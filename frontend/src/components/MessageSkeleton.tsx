export function MessageSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-24 animate-pulse rounded bg-zinc-700/40" />
      <div className="h-4 w-full animate-pulse rounded bg-zinc-700/40" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-700/40" />
    </div>
  )
}
