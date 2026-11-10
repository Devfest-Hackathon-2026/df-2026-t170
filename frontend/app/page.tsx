import StartButton from "@/app/components/StartButton";

export default function StartPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-zinc-900 dark:to-zinc-950 min-h-screen">
      {/* ロゴ / タイトル */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-6xl" aria-hidden>
          🗾
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          旅すごろく
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
          日本全国の市区町村をランダムに旅して、
          <br />
          知らなかった魅力を発見しよう。
        </p>
      </div>

      {/* スタートボタン群（Client Component） */}
      <StartButton />

      <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
        ※ 現在地機能はMVPでは未対応です
      </p>
    </main>
  );
}
