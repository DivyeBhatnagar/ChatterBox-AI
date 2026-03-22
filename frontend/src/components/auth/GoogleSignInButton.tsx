import { Chrome, Loader2 } from 'lucide-react'

interface GoogleSignInButtonProps {
  loading?: boolean
  onClick: () => void
}

export function GoogleSignInButton({ loading, onClick }: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-600 bg-zinc-900/70 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : <Chrome size={16} />}
      Continue with Google
    </button>
  )
}
