/**
 * GET /api/municipalities/random
 *
 * クライアントコンポーネント（StartButton）からランダム市区町村を取得するための
 * Route Handler。バックエンドへの認証付きリクエストはサーバーサイドで行う。
 */

import { getRandomMunicipality } from "@/app/lib/api";
import type { Municipality } from "@/app/lib/types";

export async function GET(): Promise<Response> {
  try {
    const municipality: Municipality = await getRandomMunicipality();
    return Response.json(municipality);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message } },
      { status: 500 },
    );
  }
}
