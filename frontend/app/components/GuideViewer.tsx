"use client";

import { useState } from "react";
import type { Guide, GuideSection } from "@/app/lib/types";

type CategoryInfo = {
  key: GuideSection;
  label: string;
  emoji: string;
};

const CATEGORIES: CategoryInfo[] = [
  { key: "overview", label: "概要", emoji: "📖" },
  { key: "geography", label: "地理", emoji: "🏔️" },
  { key: "history", label: "歴史", emoji: "📜" },
  { key: "culture", label: "文化", emoji: "🎭" },
  { key: "tourism", label: "観光", emoji: "🗺️" },
  { key: "heritage", label: "文化遺産", emoji: "🏛️" },
];

type Props = {
  guide: Guide;
  sources: Array<{ title: string; url: string }>;
};

export default function GuideViewer({ guide, sources }: Props) {
  const [active, setActive] = useState<GuideSection>("overview");

  const current = CATEGORIES.find((c) => c.key === active)!;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* カテゴリ選択タブ */}
      <div
        role="tablist"
        aria-label="観光ガイドカテゴリ"
        className="flex flex-wrap gap-2"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={active === cat.key}
            aria-controls={`panel-${cat.key}`}
            id={`tab-${cat.key}`}
            onClick={() => setActive(cat.key)}
            className={[
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
              active === cat.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700",
            ].join(" ")}
          >
            <span aria-hidden>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* カテゴリ詳細 */}
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-6 leading-relaxed"
      >
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          <span aria-hidden>{current.emoji}</span>
          {current.label}
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300 leading-7">
          {guide[active]}
        </p>
      </div>

      {/* 出典 */}
      {sources.length > 0 && (
        <div className="text-xs text-zinc-400 dark:text-zinc-500">
          <span className="font-medium">出典: </span>
          {sources.map((s, i) => (
            <span key={i}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {s.title}
              </a>
              {i < sources.length - 1 && "、"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
