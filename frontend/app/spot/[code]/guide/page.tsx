import Link from "next/link";
import { getMunicipalityDetail, getMunicipalityGuide } from "@/app/lib/api";
import GuideViewer from "@/app/components/GuideViewer";

export default async function GuidePage(
  props: PageProps<"/spot/[code]/guide">,
) {
  const { code } = await props.params;

  const [detail, guideData] = await Promise.all([
    getMunicipalityDetail(code),
    getMunicipalityGuide(code),
  ]);

  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* ヘッダー: 地名を常時表示 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm px-6 py-4">
        <Link
          href={`/spot/${code}`}
          className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
          aria-label="地点選択に戻る"
        >
          ←
        </Link>
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-zinc-400 dark:text-zinc-500 tracking-widest">
            {detail.prefecture_name}
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {detail.municipality_name}
          </span>
        </div>
      </header>

      {/* ガイドコンテンツ */}
      <div className="flex flex-col flex-1 gap-4 px-6 py-8 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {guideData.guide.title}
        </h1>

        {/* カテゴリ選択 + 詳細表示（Client Component） */}
        <GuideViewer guide={guideData.guide} sources={guideData.sources} />
      </div>
    </main>
  );
}
