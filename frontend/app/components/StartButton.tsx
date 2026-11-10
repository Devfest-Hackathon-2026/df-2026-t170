"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getRandomMunicipality } from "@/app/lib/api";

export default function StartButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRandom() {
    setLoading(true);
    setError(null);
    try {
      const municipality = await getRandomMunicipality();
      router.push(`/spot/${municipality.municipality_code}`);
    } catch {
      setError("地点の取得に失敗しました。もう一度お試しください。");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      {error && (
        <p role="alert" className="text-sm text-red-600 text-center">
          {error}
        </p>
      )}
      <button
        onClick={handleRandom}
        disabled={loading}
        className="w-full rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        aria-busy={loading}
      >
        {loading ? "地点を探しています…" : "🎲 ランダム地点で観光"}
      </button>
      <button
        disabled
        className="w-full rounded-2xl border-2 border-zinc-300 bg-white px-8 py-4 text-lg font-semibold text-zinc-400 cursor-not-allowed"
        title="現在地機能はMVP外です"
      >
        📍 現在地で観光
        <span className="ml-2 text-xs font-normal text-zinc-400">(準備中)</span>
      </button>
    </div>
  );
}
