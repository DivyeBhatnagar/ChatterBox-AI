import type { ReactNode } from 'react'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#1a1a2f_0%,_#0a0a0a_45%)] px-4 py-8 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10131d]/80 p-6 shadow-2xl backdrop-blur-xl sm:p-7">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </div>
  )
}
