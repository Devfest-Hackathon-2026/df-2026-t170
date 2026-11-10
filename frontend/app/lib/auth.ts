/**
 * Cloud Run サービス間認証用 Identity Token 取得ユーティリティ
 *
 * Cloud Run 上では GCE メタデータサーバーから OIDC トークンを取得する。
 * ローカル開発時は BACKEND_API_URL が未設定のためこの関数は呼ばれない（api.ts 側で制御）。
 *
 * 参考: https://cloud.google.com/run/docs/securing/service-identity#fetching_identity_and_access_tokens
 */

const METADATA_TOKEN_URL =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

/**
 * Cloud Run メタデータサーバーから Identity Token を取得する。
 * audience にはバックエンド Cloud Run サービスの URL を指定する。
 */
export async function fetchIdentityToken(audience: string): Promise<string> {
  const url = `${METADATA_TOKEN_URL}?audience=${encodeURIComponent(audience)}`;

  const res = await fetch(url, {
    headers: { "Metadata-Flavor": "Google" },
    // トークンはリクエストごとに新規取得し、キャッシュしない
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Identity token の取得に失敗しました: ${res.status} ${res.statusText}`,
    );
  }

  return res.text();
}
