'use client'

import { motion } from 'framer-motion'

interface FloatingNoteProps {
  className?: string
  delay?: number
  size?: number
}

export function FloatingNote({
  className = '',
  delay = 0,
  size = 20,
}: FloatingNoteProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [20, -100],
        x: [0, Math.random() * 40 - 20],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        style={{ imageRendering: 'pixelated' }}
      >
        <rect x="10" y="0" width="2" height="12" fill="currentColor" />
        <rect x="12" y="0" width="2" height="4" fill="currentColor" />
        <rect x="14" y="2" width="2" height="2" fill="currentColor" />
        <rect x="4" y="8" width="8" height="4" fill="currentColor" />
        <rect x="2" y="10" width="4" height="4" fill="currentColor" />
        <rect x="6" y="12" width="6" height="2" fill="currentColor" />
      </svg>
    </motion.div>
  )
}

export function FloatingNotes() {
  const notes = [
    { x: '10%', delay: 0, color: 'text-accent-blue' },
    { x: '25%', delay: 1.5, color: 'text-accent-teal' },
    { x: '40%', delay: 0.8, color: 'text-accent-blue' },
    { x: '60%', delay: 2, color: 'text-accent-teal' },
    { x: '75%', delay: 0.5, color: 'text-accent-blue' },
    { x: '90%', delay: 1.2, color: 'text-accent-teal' },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {notes.map((note, i) => (
        <div key={i} className="absolute bottom-0" style={{ left: note.x }}>
          <FloatingNote delay={note.delay} className={note.color} />
        </div>
      ))}
    </div>
  )
}
