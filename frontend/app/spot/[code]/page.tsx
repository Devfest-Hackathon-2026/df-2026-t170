import Link from "next/link";
import { getMunicipalityDetail, getMunicipalityMap } from "@/app/lib/api";
import MunicipalityMap from "@/app/components/MunicipalityMap";

export default async function SpotPage(props: PageProps<"/spot/[code]">) {
  const { code } = await props.params;

  const [detail, mapData] = await Promise.all([
    getMunicipalityDetail(code),
    getMunicipalityMap(code),
  ]);

  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      {/* 地図エリア */}
      <div className="relative w-full h-56 sm:h-72 bg-zinc-100 dark:bg-zinc-900">
        <MunicipalityMap
          paths={mapData.paths}
          municipalityName={`${detail.prefecture_name} ${detail.municipality_name}`}
        />
      </div>

      {/* 地名表示 */}
      <div className="flex flex-col items-center gap-1 px-6 py-10 text-center flex-1 justify-center">
        <p className="text-base text-zinc-500 dark:text-zinc-400 tracking-widest">
          {detail.prefecture_name}
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {detail.municipality_name}
        </h1>
        <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-500">
          市区町村コード: {detail.municipality_code}
        </p>
      </div>

      {/* ボタンエリア */}
      <div className="flex gap-4 px-6 pb-10 pt-4 justify-center">
        <Link
          href="/"
          className="flex-1 max-w-[160px] rounded-2xl border-2 border-zinc-300 dark:border-zinc-600 px-6 py-4 text-center text-base font-semibold text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          ← 戻る
        </Link>
        <Link
          href={`/spot/${code}/guide`}
          className="flex-1 max-w-[160px] rounded-2xl bg-emerald-600 px-6 py-4 text-center text-base font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
        >
          観光する →
        </Link>
      </div>
    </main>
  );
}
