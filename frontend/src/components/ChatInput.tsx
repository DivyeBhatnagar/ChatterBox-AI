import { useEffect, useRef } from 'react'
import { SendHorizonal, Loader2 } from 'lucide-react'

interface ChatInputProps {
  value: string
  maxChars: number
  disabled: boolean
  isSending: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onClear: () => void
}

export function ChatInput({
  value,
  maxChars,
  disabled,
  isSending,
  onChange,
  onSubmit,
  onClear,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const target = textareaRef.current
    if (!target) {
      return
    }
    target.style.height = 'auto'
    target.style.height = `${Math.min(target.scrollHeight, 180)}px`
  }, [value])

  const remainingChars = maxChars - value.length

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101218]/80 p-3 backdrop-blur-md">
      <label htmlFor="chat-input" className="sr-only">
        Ask AI Assistant
      </label>
      <textarea
        id="chat-input"
        ref={textareaRef}
        value={value}
        rows={1}
        maxLength={maxChars}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            onSubmit()
          }
        }}
        placeholder="Ask anything..."
        className="max-h-[180px] min-h-[48px] w-full resize-none rounded-xl border border-zinc-700/80 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-400">
          {remainingChars >= 0 ? `${remainingChars} characters left` : 'Character limit exceeded'}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
          >
            Clear chat
          </button>
          <button
            type="button"
            disabled={disabled || isSending || !value.trim() || remainingChars < 0}
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? <Loader2 className="animate-spin" size={15} /> : <SendHorizonal size={15} />}
            {isSending ? 'Sending' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
