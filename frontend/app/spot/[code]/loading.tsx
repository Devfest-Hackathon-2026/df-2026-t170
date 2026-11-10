export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 animate-pulse">
      {/* 地図スケルトン */}
      <div className="w-full h-56 sm:h-72 bg-zinc-200 dark:bg-zinc-800" />

      {/* 地名スケルトン */}
      <div className="flex flex-col items-center gap-3 px-6 py-10">
        <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-12 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-32 rounded bg-zinc-100 dark:bg-zinc-900" />
      </div>

      {/* ボタンスケルトン */}
      <div className="flex gap-4 px-6 pb-10 pt-4 justify-center">
        <div className="h-14 flex-1 max-w-[160px] rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-14 flex-1 max-w-[160px] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </main>
  );
}
