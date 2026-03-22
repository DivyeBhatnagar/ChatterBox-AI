import { Circle, Settings, Wifi, WifiOff, RotateCcw } from 'lucide-react'

interface ChatHeaderProps {
  online: boolean
  isGenerating: boolean
  onOpenSettings: () => void
  onRegenerate: () => void
  canRegenerate: boolean
}

export function ChatHeader({
  online,
  isGenerating,
  onOpenSettings,
  onRegenerate,
  canRegenerate,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0d14]/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold tracking-wide text-white sm:text-lg">AI Assistant</h1>
          <p className="mt-0.5 inline-flex items-center gap-2 text-xs text-zinc-300">
            <Circle
              size={10}
              className={isGenerating ? 'fill-indigo-400 text-indigo-400 animate-pulse' : 'fill-emerald-400 text-emerald-400'}
            />
            {isGenerating ? 'Generating response...' : 'Ready'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${online ? 'border-emerald-400/40 text-emerald-300' : 'border-amber-400/40 text-amber-300'}`}
          >
            {online ? <Wifi size={12} /> : <WifiOff size={12} />}
            {online ? 'Online' : 'Offline'}
          </span>

          <button
            type="button"
            disabled={!canRegenerate || isGenerating}
            onClick={onRegenerate}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-600 px-2 py-1 text-xs text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={12} />
            Regenerate
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-600 px-2 py-1 text-xs text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
          >
            <Settings size={12} />
            Settings
          </button>
        </div>
      </div>
    </header>
  )
}
