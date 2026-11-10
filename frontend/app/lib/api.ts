/**
 * バックエンドAPIクライアント
 *
 * 【認証について】
 * バックエンド（Cloud Run）は --no-allow-unauthenticated で保護されている。
 * フロントエンド（Cloud Run）からのリクエストには GCE メタデータサーバーから取得した
 * OIDC Identity Token を Authorization: Bearer ヘッダーに付与する。
 *
 * 【環境変数】
 * - BACKEND_API_URL : バックエンドの Cloud Run サービス URL（サーバーサイド専用・NEXT_PUBLIC_ 不要）
 *                     未設定の場合はモックデータを返す（ローカル開発用フォールバック）
 *
 * 【呼び出し元】
 * すべての関数は Server Components / Route Handlers から呼ぶこと。
 * クライアントサイドから呼ぶと BACKEND_API_URL が undefined になりモックにフォールバックする。
 */

import { fetchIdentityToken } from "./auth";
import type {
  Municipality,
  MunicipalityDetail,
  MapData,
  GuideResponse,
  GuideSection,
} from "./types";

const BASE_URL = process.env.BACKEND_API_URL;

// ---- モックデータ（BACKEND_API_URL 未設定時のフォールバック） ----------------

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

// ---- 内部ユーティリティ ---------------------------------------------------

/**
 * Bearer トークン付きの共通 fetch ラッパー。
 * BASE_URL が未設定の場合は null を返し、呼び出し元でモックにフォールバックする。
 */
async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response | null> {
  if (!BASE_URL) return null;

  // audience = バックエンドの Cloud Run サービス URL（トークンの検証に使用される）
  const token = await fetchIdentityToken(BASE_URL);

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  return fetch(`${BASE_URL}${path}`, { ...init, headers, cache: "no-store" });
}

/** レスポンスのエラーハンドリング共通処理 */
async function handleResponse<T>(res: Response, label: string): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`[${label}] ${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ---- API 関数 -------------------------------------------------------------

/**
 * ランダムな市区町村を取得する
 * GET /municipalities/random
 */
export async function getRandomMunicipality(): Promise<Municipality> {
  const res = await apiFetch("/municipalities/random");
  if (!res) return MOCK_MUNICIPALITY;
  return handleResponse<Municipality>(res, "getRandomMunicipality");
}

/**
 * 緯度経度から市区町村を取得する
 * POST /municipalities/from-geocode
 */
export async function getMunicipalityFromGeocode(
  latitude: number,
  longitude: number,
): Promise<Municipality> {
  const res = await apiFetch("/municipalities/from-geocode", {
    method: "POST",
    body: JSON.stringify({ latitude, longitude }),
  });
  if (!res) return MOCK_MUNICIPALITY;
  return handleResponse<Municipality>(res, "getMunicipalityFromGeocode");
}

/**
 * 市区町村の基本情報を取得する
 * GET /municipalities/{municipality_code}
 */
export async function getMunicipalityDetail(
  code: string,
): Promise<MunicipalityDetail> {
  const res = await apiFetch(`/municipalities/${code}`);
  if (!res) return MOCK_DETAIL;
  return handleResponse<MunicipalityDetail>(res, "getMunicipalityDetail");
}

/**
 * 地図表示用情報を取得する
 * GET /municipalities/{municipality_code}/map
 */
export async function getMunicipalityMap(code: string): Promise<MapData> {
  const res = await apiFetch(`/municipalities/${code}/map`);
  if (!res) return MOCK_MAP;
  return handleResponse<MapData>(res, "getMunicipalityMap");
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
  const res = await apiFetch(`/municipalities/${code}/guide`, {
    method: "POST",
    body: JSON.stringify({ language: "ja", sections }),
  });
  if (!res) return MOCK_GUIDE;
  return handleResponse<GuideResponse>(res, "getMunicipalityGuide");
}
