/**
 * バックエンドAPIクライアント
 * NOTE: 現時点ではすべて空実装（モックデータを返す）。
 *       実際のバックエンドが用意されたら BASE_URL を設定して実実装に切り替える。
 */

import type {
  Municipality,
  MunicipalityDetail,
  MapData,
  GuideResponse,
  GuideSection,
} from "./types";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// ---- モックデータ --------------------------------------------------------

const MOCK_MUNICIPALITY: Municipality = {
  municipality_code: "131016",
  prefecture_name: "東京都",
  municipality_name: "千代田区",
};

const MOCK_DETAIL: MunicipalityDetail = {
  ...MOCK_MUNICIPALITY,
  official_website: "https://www.city.chiyoda.lg.jp/",
  official_tourism_website: "https://visit.chiyoda.or.jp/",
};

const MOCK_MAP: MapData = {
  municipality_code: "131016",
  paths: [
    { lat: 35.6938, lng: 139.7536 },
    { lat: 35.6854, lng: 139.7677 },
    { lat: 35.6762, lng: 139.7606 },
    { lat: 35.6734, lng: 139.7439 },
    { lat: 35.6834, lng: 139.737 },
    { lat: 35.6938, lng: 139.7536 },
  ],
  provider: "google_maps",
};

const MOCK_GUIDE: GuideResponse = {
  municipality_code: "131016",
  guide: {
    title: "千代田区の観光ガイド",
    overview:
      "千代田区は東京都の中心部に位置し、皇居や国会議事堂、官公庁など日本の中枢機能が集まる地区です。",
    geography:
      "東京都の中央部に位置し、東は中央区・台東区、西は新宿区・港区と接しています。地形は比較的平坦で、神田川が北東部を流れています。",
    history:
      "江戸時代には江戸城の城下町として発展。明治以降は首都東京の中心地として、政治・経済・文化の中枢を担ってきました。",
    culture:
      "伝統工芸から現代アートまで多彩な文化が息づいています。神田古書店街や秋葉原など、独自の文化地区が存在します。",
    tourism:
      "皇居東御苑、靖国神社、東京国立近代美術館など多くの観光スポットがあります。桜の名所としても知られる千鳥ヶ淵も見どころのひとつです。",
    heritage:
      "江戸城跡（皇居）は国の特別史跡に指定されています。湯島聖堂や神田明神など歴史的な社寺も点在しています。",
  },
  sources: [
    {
      title: "千代田区公式サイト",
      url: "https://www.city.chiyoda.lg.jp/",
    },
  ],
  generated_at: new Date().toISOString(),
};

// ---- API関数（空実装） ---------------------------------------------------

/**
 * ランダムな市区町村を取得する
 * GET /municipalities/random
 */
export async function getRandomMunicipality(): Promise<Municipality> {
  // TODO: 実実装
  // const res = await fetch(`${BASE_URL}/municipalities/random`);
  // if (!res.ok) throw new Error("Failed to fetch random municipality");
  // return res.json();
  return Promise.resolve(MOCK_MUNICIPALITY);
}

/**
 * 緯度経度から市区町村を取得する
 * POST /municipalities/from-geocode
 */
export async function getMunicipalityFromGeocode(
  latitude: number,
  longitude: number,
): Promise<Municipality> {
  // TODO: 実実装
  // const res = await fetch(`${BASE_URL}/municipalities/from-geocode`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ latitude, longitude }),
  // });
  // if (!res.ok) throw new Error("Failed to fetch municipality from geocode");
  // return res.json();
  void latitude;
  void longitude;
  return Promise.resolve(MOCK_MUNICIPALITY);
}

/**
 * 市区町村の基本情報を取得する
 * GET /municipalities/{municipality_code}
 */
export async function getMunicipalityDetail(
  code: string,
): Promise<MunicipalityDetail> {
  // TODO: 実実装
  // const res = await fetch(`${BASE_URL}/municipalities/${code}`);
  // if (!res.ok) throw new Error("Failed to fetch municipality detail");
  // return res.json();
  void code;
  return Promise.resolve(MOCK_DETAIL);
}

/**
 * 地図表示用情報を取得する
 * GET /municipalities/{municipality_code}/map
 */
export async function getMunicipalityMap(code: string): Promise<MapData> {
  // TODO: 実実装
  // const res = await fetch(`${BASE_URL}/municipalities/${code}/map`);
  // if (!res.ok) throw new Error("Failed to fetch municipality map");
  // return res.json();
  void code;
  return Promise.resolve(MOCK_MAP);
}

/**
 * AI観光ガイドを取得する
 * POST /municipalities/{municipality_code}/guide
 */
export async function getMunicipalityGuide(
  code: string,
  sections: GuideSection[] = [
    "overview",
    "geography",
    "history",
    "culture",
    "tourism",
    "heritage",
  ],
): Promise<GuideResponse> {
  // TODO: 実実装
  // const res = await fetch(`${BASE_URL}/municipalities/${code}/guide`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ language: "ja", sections }),
  // });
  // if (!res.ok) throw new Error("Failed to fetch guide");
  // return res.json();
  void code;
  void sections;
  return Promise.resolve(MOCK_GUIDE);
}
