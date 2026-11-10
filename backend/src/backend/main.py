import csv
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta

app = FastAPI()
DATA_PATH = Path(__file__).parent / "data" / "municipalities.csv"

def load_municipalities():
    municipalities = []
    with open(DATA_PATH, encoding="utf-8") as f:
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


MUNICIPALITIES = load_municipalities()
MUNICIPALITY_BY_CODE = {m["municipality_code"]: m for m in MUNICIPALITIES}

class ReverseGeocodeRequest(BaseModel):
    latitude: float
    longitude: float

class GuideRequest(BaseModel):
    language: str = "ja"
    sections: list[str] = [
        "overview", "geography", "history",
        "culture", "tourism", "heritage",
    ]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Hello from FastAPI"}

@app.get("/municipalities/random")
def get_random_municipality(
    prefecture_code: str = "0",
    exclude_codes: list[str] = Query(default=[]),
):
    return {
        "municipality_code": "131024",
        "prefecture_name": "東京都",
        "municipality_name": "中央区",
    }

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
    return {
        "municipality_code": "131016",
        "prefecture_name": "東京都",
        "municipality_name": "千代田区",
    }

@app.post("/municipalities/{municipality_code}/guide")
def generate_guide(municipality_code: str, req: GuideRequest):
    jst = timezone(timedelta(hours=9))
    return {
        "municipality_code": municipality_code,"municipality_code": municipality_code,
        "guide": {
            "title": "千代田区の観光ガイド",
            "overview": "地理の概要",
            "geography": "地理的特徴",
            "history": "歴史的背景",
            "culture": "文化的特徴",
            "tourism": "観光の見どころ",
            "heritage": "文化遺産の紹介",
        },
        "sources": [
            {"title": "自治体公式サイト", "url": "https://example.jp"},
        ],
        "generated_at": datetime.now(jst).isoformat(),
    }

@app.post("/municipalities/{municipality_code}/map")
def get_map(municipality_code: str):
    return {
        "municipality_code": municipality_code,
        "paths": [
            {"lat": 35.6938, "lng": 139.7536},
            {"lat": 35.6950, "lng": 139.7600},
            {"lat": 35.6850, "lng": 139.7650},
        ],
        "provider": "google_maps",
    }