"""国土数値情報（行政区域）の GeoJSON から、市区町村ごとの境界線を作るスクリプト。

使い方:
    uv run python scripts/build_boundaries.py N03のgeojsonファイルのパス
"""

import csv
import json
import sys
from collections import defaultdict
from pathlib import Path

from shapely.geometry import shape
from shapely.ops import unary_union

DATA_DIR = Path(__file__).parent.parent / "src" / "backend" / "data"


def load_csv(path):
    with open(path, encoding="utf-8") as f:
        return [row for row in csv.DictReader(f) if row["municipality"] != ""]


def main():
    geojson_path = sys.argv[1]

    print("GeoJSON を読み込み中...")
    with open(geojson_path, encoding="utf-8") as f:
        data = json.load(f)

    polygons = defaultdict(list)
    for feature in data["features"]:
        code5 = feature["properties"]["N03_007"]
        if code5 is None:
            continue
        polygons[code5].append(shape(feature["geometry"]))

    municipalities = load_csv(DATA_DIR / "municipalities.csv")
    wards = load_csv(DATA_DIR / "wards.csv")
    for city in municipalities:
        city_code5 = city["code"][:5]
        if city_code5 in polygons:
            continue
        for ward in wards:
            is_ward_of_city = (
                ward["prefecture"] == city["prefecture"]
                and ward["code"] != city["code"]
                and ward["municipality"].startswith(city["municipality"])
            )
            if is_ward_of_city:
                polygons[city_code5].extend(polygons.get(ward["code"][:5], []))

    boundaries = {}
    for code5, shapes in polygons.items():
        if not shapes:
            continue
        geom = unary_union(shapes).simplify(0.001, preserve_topology=True)
        if geom.geom_type == "MultiPolygon":
            geom = max(geom.geoms, key=lambda g: g.area)
        boundaries[code5] = [
            [round(lng, 5), round(lat, 5)] for lng, lat in geom.exterior.coords
        ]

    out_path = DATA_DIR / "boundaries.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(boundaries, f, separators=(",", ":"))
    print(f"{len(boundaries)} 件の境界線を {out_path} に書き出しました")

if __name__ == "__main__":
    main()