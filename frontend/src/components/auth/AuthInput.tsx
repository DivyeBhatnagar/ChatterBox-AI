import type { InputHTMLAttributes } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function AuthInput({ label, error, ...props }: AuthInputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-200">{label}</span>
      <input
        {...props}
        className={`w-full rounded-lg border bg-zinc-950/70 px-3 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 ${error ? 'border-rose-500/70 focus:ring-2 focus:ring-rose-500/20' : 'border-zinc-700 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20'}`}
      />
      {error ? <span className="mt-1.5 block text-xs text-rose-300">{error}</span> : null}
    </label>
  )
}
