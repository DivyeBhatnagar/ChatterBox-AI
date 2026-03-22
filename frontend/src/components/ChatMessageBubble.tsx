import { memo, useMemo, useState } from 'react'
import { Check, Clipboard, User, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import type { ChatMessage } from '../types/chat'
import { ChatBorder } from './ui/chat-border'

interface ChatMessageBubbleProps {
  message: ChatMessage
  compact?: boolean
}

export const ChatMessageBubble = memo(function ChatMessageBubble({
  message,
  compact,
}: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const alignmentClass = useMemo(
    () => (message.role === 'user' ? 'justify-end' : 'justify-start'),
    [message.role],
  )

  const bubbleClass = useMemo(() => {
    if (message.role === 'user') {
      return 'bg-gradient-to-br from-indigo-500/90 to-purple-500/80 border-indigo-300/20 text-white'
    }

    if (message.error) {
      return 'bg-rose-500/15 border-rose-400/30 text-rose-100'
    }

    return 'bg-[#11131f]/90 border-zinc-700/70 text-zinc-100'
  }, [message.error, message.role])

  const copyMessage = async () => {
    if (message.role !== 'assistant') {
      return
    }
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${alignmentClass}`}
    >
      <ChatBorder className="w-full max-w-[85%] p-1 shadow-lg shadow-black/20 sm:max-w-[75%]" glow={message.role === 'assistant'}>
        <div className={`rounded-2xl border px-4 py-3 ${bubbleClass} ${compact ? 'text-sm' : 'text-[15px]'}`}>
          <div className="mb-2 flex items-center gap-2 text-xs text-zinc-300">
            {message.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            <span className="font-medium">{message.role === 'user' ? 'You' : 'AI Assistant'}</span>
          </div>

          <article className="prose prose-invert max-w-none prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-black/40 prose-code:font-mono prose-code:text-indigo-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
          </article>

          {message.role === 'assistant' && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={copyMessage}
                className="inline-flex items-center gap-1 rounded-md border border-zinc-600 px-2 py-1 text-[11px] transition hover:border-indigo-400/60 hover:text-indigo-200"
              >
                {copied ? <Check size={13} /> : <Clipboard size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </ChatBorder>
    </motion.div>
  )
})
