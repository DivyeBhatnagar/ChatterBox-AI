import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

export function AuthButton({ loading, children, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </button>
  )
}
