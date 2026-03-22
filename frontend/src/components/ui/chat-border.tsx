import type { ReactNode } from 'react'
import { GlowingEffect } from './glowing-effect'
import { cn } from '../../lib/utils'

interface ChatBorderProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export function ChatBorder({ children, className, glow = true }: ChatBorderProps) {
  return (
    <div className={cn('relative rounded-2xl border border-white/10 bg-[#0f121a]/80 p-2', className)}>
      <GlowingEffect
        spread={36}
        glow={glow}
        disabled={false}
        proximity={72}
        inactiveZone={0.08}
        borderWidth={2}
        blur={0}
      />
      <div className="relative rounded-xl border border-zinc-700/70 bg-[#0f1118]/85">{children}</div>
    </div>
  )
}
