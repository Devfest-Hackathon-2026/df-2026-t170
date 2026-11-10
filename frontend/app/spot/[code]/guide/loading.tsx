export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 animate-pulse">
      {/* ヘッダースケルトン */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4">
        <div className="h-5 w-5 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      {/* コンテンツスケルトン */}
      <div className="flex flex-col gap-6 px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="h-8 w-56 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        {/* タブスケルトン */}
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900"
            />
          ))}
        </div>
        {/* パネルスケルトン */}
        <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 p-6 flex flex-col gap-3">
          <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-4/6 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>
    </main>
  );
}
