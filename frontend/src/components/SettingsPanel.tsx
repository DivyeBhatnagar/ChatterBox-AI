import { X } from 'lucide-react'
import type { UserSettings } from '../types/chat'

interface SettingsPanelProps {
  open: boolean
  settings: UserSettings
  onClose: () => void
  onUpdate: (next: UserSettings) => void
}

export function SettingsPanel({ open, settings, onClose, onUpdate }: SettingsPanelProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="ml-auto h-full w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#121420] p-5 text-zinc-100 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="rounded-md border border-zinc-600 p-1 hover:border-zinc-400">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Temperature: {settings.temperature.toFixed(1)}</label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={settings.temperature}
              onChange={(event) =>
                onUpdate({
                  ...settings,
                  temperature: Number(event.target.value),
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Max tokens</label>
            <input
              type="number"
              min={64}
              max={4096}
              value={settings.maxTokens}
              onChange={(event) =>
                onUpdate({
                  ...settings,
                  maxTokens: Number(event.target.value),
                })
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm outline-none"
            />
          </div>

          <label className="flex items-center justify-between rounded-lg border border-zinc-700 px-3 py-2 text-sm">
            Typing indicator
            <input
              type="checkbox"
              checked={settings.enableTypingIndicator}
              onChange={(event) =>
                onUpdate({
                  ...settings,
                  enableTypingIndicator: event.target.checked,
                })
              }
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-zinc-700 px-3 py-2 text-sm">
            Compact mode
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(event) =>
                onUpdate({
                  ...settings,
                  compactMode: event.target.checked,
                })
              }
            />
          </label>
        </div>
      </div>
    </div>
  )
}
