import { motion } from 'framer-motion'

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1 rounded-2xl border border-indigo-400/20 bg-[#11131f]/90 px-4 py-3"
        role="status"
        aria-label="Assistant is typing"
      >
        <span className="sr-only">Assistant is typing</span>
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-2 w-2 rounded-full bg-indigo-300"
            animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15 }}
          />
        ))}
      </motion.div>
    </div>
  )
}
