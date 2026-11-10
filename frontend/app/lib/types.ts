// API レスポンス型定義

export type Municipality = {
  municipality_code: string;
  prefecture_name: string;
  municipality_name: string;
};

export type MunicipalityDetail = Municipality & {
  official_website: string;
  official_tourism_website: string;
};

export type MapData = {
  municipality_code: string;
  paths: Array<{ lat: number; lng: number }>;
  provider: string;
};

export type GuideSection =
  | "overview"
  | "geography"
  | "history"
  | "culture"
  | "tourism"
  | "heritage";

export type Guide = {
  title: string;
  overview: string;
  geography: string;
  history: string;
  culture: string;
  tourism: string;
  heritage: string;
};

export type GuideResponse = {
  municipality_code: string;
  guide: Guide;
  sources: Array<{ title: string; url: string }>;
  generated_at: string;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};
