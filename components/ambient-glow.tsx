'use client'

import { motion } from 'framer-motion'

export function AmbientGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 w-[150%] h-[60%] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(74, 144, 217, 0.3) 0%, rgba(74, 144, 217, 0.1) 40%, transparent 70%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-1/4 w-[40%] h-[40%] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(217, 74, 138, 0.2) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/3 -left-1/4 w-[30%] h-[30%] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(74, 217, 217, 0.15) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 144, 217, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 144, 217, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}
