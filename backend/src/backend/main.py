import os
import json
import csv
import random
from pathlib import Path
from datetime import datetime, timezone, timedelta

import httpx
from fastapi import FastAPI, HTTPException, Query
from google import genai
from google.genai import types 
from pydantic import BaseModel

app = FastAPI()
DATA_DIR = Path(__file__).parent / "data" 

def load_municipalities(path):
    municipalities = []
    with open(path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["municipality"] == "":
                continue
            municipalities.append({
                "municipality_code": row["code"],
                "prefecture_name": row["prefecture"],
                "municipality_name": row["municipality"],
            })
    return municipalities


MUNICIPALITIES = load_municipalities(DATA_DIR / "municipalities.csv")
WARDS = load_municipalities(DATA_DIR / "wards.csv")

# 6桁コードで引く辞書（区も含める）
MUNICIPALITY_BY_CODE = {m["municipality_code"]: m for m in MUNICIPALITIES + WARDS}
# 5桁コード（検査数字なし）で引く辞書
MUNICIPALITY_BY_CODE5 = {code[:5]: m for code, m in MUNICIPALITY_BY_CODE.items()}

with open(DATA_DIR / "boundaries.json", encoding="utf-8") as f:
    BOUNDARIES = json.load(f)

GSI_REVERSE_GEOCODER_URL = "https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress"

class ReverseGeocodeRequest(BaseModel):
    latitude: float
    longitude: float

class GuideRequest(BaseModel):
    language: str = "ja"
    sections: list[str] = [
        "overview", "geography", "history",
        "culture", "tourism", "heritage",
    ]

class Guide(BaseModel):
    title: str
    overview: str
    geography: str
    history: str
    culture: str
    tourism: str
    heritage: str


GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Hello from FastAPI"}

@app.get("/municipalities/random")
def get_random_municipality(
    prefecture_code: str = "0",
    exclude_codes: list[str] = Query(default=[]),
):
    candidates = []
    for m in MUNICIPALITIES:
        # 都道府県の指定があれば、コードの先頭2桁で絞りこむ
        if prefecture_code != "0" and not m["municipality_code"].startswith(prefecture_code.zfill(2)):
            continue
        candidates.append(m)

    if not candidates:
        raise HTTPException(status_code=404, detail="条件に合う市区町村が見つかりません。")

    return random.choice(candidates)

@app.get("/municipalities/{municipality_code}")
def get_municipality(municipality_code: str):
    municipality = MUNICIPALITY_BY_CODE.get(municipality_code)
    if municipality is None:
        raise HTTPException(status_code=404, detail="指定された市町村が見つかりません。")
    return {
        **municipality,
        "official_website": None,
        "official_tourism_website": None,
    }

@app.post("/locations/reverse-geocode")
def reverse_geocode(req: ReverseGeocodeRequest):
    try:
        res = httpx.get(
            GSI_REVERSE_GEOCODER_URL,
            params={"lat": req.latitude, "lon": req.longitude},
            timeout=5,
        )
        res.raise_for_status()
        data = res.json()
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="外部APIエラー")

    results = data.get("results")
    if not results:
        raise HTTPException(status_code=404, detail="この地点の市区町村が見つかりません。")

    muni_cd = results["muniCd"].zfill(5)
    muncipality = MUNICIPALITY_BY_CODE5.get(muni_cd)
    if muncipality is None:
        raise HTTPException(status_code=404, detail="この地点の市区町村が見つかりません。")

    return muncipality

@app.post("/municipalities/{municipality_code}/guide")
def generate_guide(municipality_code: str, req: GuideRequest):
    municipality = MUNICIPALITY_BY_CODE.get(municipality_code)
    if municipality is None:
        raise HTTPException(status_code=404, detail="指定された市区町村が見つかりません。")

    name = municipality["prefecture_name"] + municipality["municipality_name"]
    prompt = f"""あなたは、地形や歴史から街の成り立ちを読み解くのが得意な観光ガイドです。
{name}の観光ガイドを、言語コード「{req.language}」の言語で書いてください。

各項目の内容:
- title: ガイドのタイトル
- overview: 地域の概要
- geography: 地形・地理の特徴
- history: 歴史や地名の由来
- culture: 文化・食・祭りなど
- tourism: 観光の見どころ
- heritage: 文化遺産の紹介

各項目は200字程度にしてください。確かでない情報は書かないでください。"""

    try:
        client = genai.Client(
            vertexai=True,
            project=os.getenv("GOOGLE_CLOUD_PROJECT"),
            location=os.getenv("GOOGLE_CLOUD_LOCATION", "global"),
        )
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=Guide,
            ),
        )
        guide = response.parsed
    except Exception as e:
        print("Gemini error:", e)
        raise HTTPException(status_code=502, detail="AIガイドの生成に失敗しました。")

    # リクエストで指定されたセクションだけ返す（タイトルは常に返す）
    guide_dict = {
        key: value
        for key, value in guide.model_dump().items()
        if key == "title" or key in req.sections
    }

    jst = timezone(timedelta(hours=9))
    return {
        "municipality_code": municipality_code,
        "guide": guide_dict,
        "sources": [],
        "generated_at": datetime.now(jst).isoformat(),
    }

@app.get("/municipalities/{municipality_code}/map")
def get_map(municipality_code: str):
    boundary = BOUNDARIES.get(municipality_code[:5])
    if boundary is None:
        raise HTTPException(status_code=404, detail="指定された市区町村の境界データが見つかりません。")

    return {
        "municipality_code": municipality_code,
        "paths": [{"lat": lat, "lng": lng} for lng, lat in boundary],
        "provider": "google_maps",
    }