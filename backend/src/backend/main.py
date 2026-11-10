from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
class ReverseGeocodeRequest(BaseModel):
    latitude: float
    longitude: float

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Hello from FastAPI"}

@app.get("/municipalities/{municipality_code}")
def get_municipality(municipality_code: str):
    return {
        "municipality_code": municipality_code,
        "prefecture_name": "東京都",
        "municipality_name": "千代田区",
        "official_website": "https://example.jp",
        "official_tourism_website": "https://example.jp/tourism"
    }

@app.post("/locations/reverse-geocode")
def reverse_geocode(req: ReverseGeocodeRequest):
    return {
        "municipality_code": "131016",
        "prefecture_name": "東京都",
        "municipality_name": "千代田区",
    }