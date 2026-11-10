# API仕様書

- Format: JSON
- Encoding: UTF-8

## 各エンドポイント

### 現在地から市区町村を取得

緯度経度から該当する市区町村を特定する。

`POST` `/locations/reverse-geocode`
Request
```json

{
  "latitude": 35.6812,
  "longitude": 139.7671
}
```

Response
```json

{
  "municipality_code": "131016",
  "prefecture_name": "東京都",
  "municipality_name": "千代田区"
}
```

### ランダム地域取得

条件に一致する市区町村からランダムに1件取得する。

`GET` `/municipalities/random`
Request
```json

{
  "prefecture_code": "13", // 0で指定なし国内
  "exclude_codes": ["131016"]
}

```
※ すべて任意。指定がなければ全国から抽選する。
Response
```json

{
  "municipality_code": "131024",
  "prefecture_name": "東京都",
  "municipality_name": "中央区"
}
```

### 地域基本情報取得

指定地域の基本情報・公式サイトを取得する。

`GET` `/municipalities/{municipality_code}`
Request
text

例：
`GET /municipalities/131016`

Response
```json

{
  "municipality_code": "131016",
  "prefecture_name": "東京都",
  "municipality_name": "千代田区",
  "official_website": "https://example.jp",
  "official_tourism_website": "https://example.jp/tourism"
}
```
### AI観光ガイド生成

指定地域の観光ガイドをAIで生成する。

`POST` `/municipalities/{municipality_code}/guide`
Request
```json

{
  "language": "ja",
  "sections": [
    "overview",
    "geography",
    "history",
    "culture",
    "tourism",
    "heritage"
  ]
}

```
Response
```json

{
  "municipality_code": "131016",
  "guide": {
    "title": "千代田区の観光ガイド",
    "overview": "地域の概要",
    "geography": "地理的特徴",
    "history": "歴史的背景",
    "culture": "文化的特徴",
    "tourism": "観光の見どころ",
    "heritage": "文化遺産の紹介"
  },
  "sources": [
    {
      "title": "自治体公式サイト",
      "url": "https://example.jp"
    }
  ],
  "generated_at": "2026-11-10T09:00:00+09:00"
}
```
### 地図表示用情報取得

指定地域の地図表示に必要な情報を取得する。
参考：[国土数値情報（行政区域） 製品仕様書 第4.0版 - KS-PS-N03-v4_0.pdf](https://nlftp.mlit.go.jp/ksj/gml/product_spec/KS-PS-N03-v4_0.pdf)
`N03_007`を用いて下1桁のcheckdigitを除いた上5桁で検索

`GET` `/municipalities/{municipality_code}/map`
Request
text

`GET /municipalities/131016/map`

Response
```json

{
  "municipality_code": "131016",
  "paths": [
    { lat: 35.6938, lng: 139.7536 },
    { lat: 35.6938, lng: 139.7536 },
    { lat: 35.6938, lng: 139.7536 }
  ],
  "provider": "google_maps"
}
```

## MVP外エンドポイント

### 地理情報取得

指定地域の地形・自然環境などを取得する。

GET /municipalities/{municipality_code}/geography

### 歴史・地名の由来取得

公式サイトや歴史資料などを参照し、地域の歴史・地名の由来を取得する。

GET /municipalities/{municipality_code}/history
Request
text

GET /municipalities/131016/history


### 文化遺産一覧取得

指定地域に存在する文化遺産を取得する。

GET /municipalities/{municipality_code}/heritages



10. ストリートビュー情報取得

指定座標周辺のストリートビュー情報を取得する。

GET /maps/streetview
Request
text

GET /maps/streetview?latitude=35.6812&longitude=139.7671

Response
json

{
  "location": {
    "latitude": 35.6812,
    "longitude": 139.7671
  },
  "available": true,
  "provider": "google_maps"
}

11. エラーコード

全API共通。
HTTP Status	Code	説明
400	INVALID_REQUEST	リクエスト形式不正
401	UNAUTHORIZED	認証エラー
404	NOT_FOUND	対象地域・データが存在しない
422	VALIDATION_ERROR	パラメータ不正
429	RATE_LIMIT_EXCEEDED	API利用制限
500	INTERNAL_SERVER_ERROR	サーバーエラー
502	EXTERNAL_API_ERROR	外部APIエラー
503	SERVICE_UNAVAILABLE	外部サービス利用不可
エラーレスポンス
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "指定された市区町村が見つかりません。"
  }
}
```

12. 外部データソース
| 対象 | ソース |
| ---  | ---    |
| 市区町村コード | [総務省](https://www.soumu.go.jp/denshijiti/code.html) |
| 標高・地形 | 国土地理院 |
| 歴史・地名の由来 | 自治体公式サイト・自治体史・Wikipedia |
| 文化遺産 | 文化庁・[日本遺産](https://japan-heritage.bunka.go.jp/ja/culturalproperties/) |
| 観光情報 | 自治体公式観光サイト |
| 地図描画情報 | 国土数値情報 |
| 地図・ストリートビュー | Google Maps Platform |
