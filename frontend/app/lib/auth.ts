/**
 * Cloud Run サービス間認証用 Identity Token 取得ユーティリティ
 *
 * 【Cloud Run 上】
 *   GCE メタデータサーバーから OIDC トークンを取得する。
 *   参考: https://cloud.google.com/run/docs/securing/service-identity
 *
 * 【ローカル開発】
 *   GOOGLE_APPLICATION_CREDENTIALS にサービスアカウントキー JSON のパスを設定すると、
 *   そのキーを使って Google OAuth2 エンドポイントから ID トークンを取得する。
 *   サービスアカウントキーは Cloud Run Invoker ロールを持つものを使用すること。
 */

import { readFileSync } from "fs";
import { createSign } from "crypto";

const METADATA_TOKEN_URL =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

const GOOGLE_OAUTH2_TOKEN_URL = "https://oauth2.googleapis.com/token";

/**
 * サービスアカウントキー JSON から JWT を生成し、
 * Google OAuth2 エンドポイントで ID トークンと交換する。
 */
async function fetchIdentityTokenFromServiceAccount(
  audience: string,
  keyPath: string,
): Promise<string> {
  const key = JSON.parse(readFileSync(keyPath, "utf-8")) as {
    client_email: string;
    private_key: string;
  };

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: key.client_email,
    sub: key.client_email,
    aud: GOOGLE_OAUTH2_TOKEN_URL,
    iat: now,
    exp: now + 3600,
    target_audience: audience,
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const signingInput = `${encode(header)}.${encode(payload)}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(key.private_key, "base64url");
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch(GOOGLE_OAUTH2_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ID トークンの取得に失敗しました: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { id_token: string };
  return data.id_token;
}

/**
 * Cloud Run メタデータサーバーから Identity Token を取得する。
 * audience にはバックエンド Cloud Run サービスの URL を指定する。
 */
async function fetchIdentityTokenFromMetadata(
  audience: string,
): Promise<string> {
  const url = `${METADATA_TOKEN_URL}?audience=${encodeURIComponent(audience)}`;

  const res = await fetch(url, {
    headers: { "Metadata-Flavor": "Google" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Identity token の取得に失敗しました: ${res.status} ${res.statusText}`,
    );
  }

  return res.text();
}

/**
 * 実行環境に応じて Identity Token を取得する。
 *
 * - GOOGLE_APPLICATION_CREDENTIALS が設定されている場合: サービスアカウントキーを使用（ローカル開発）
 * - それ以外: GCE メタデータサーバーを使用（Cloud Run）
 */
export async function fetchIdentityToken(audience: string): Promise<string> {
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath) {
    return fetchIdentityTokenFromServiceAccount(audience, keyPath);
  }
  return fetchIdentityTokenFromMetadata(audience);
}
