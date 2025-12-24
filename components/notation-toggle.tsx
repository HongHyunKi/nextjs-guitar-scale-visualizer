'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type NotationType = 'alphabetical' | 'syllabic' | 'intervals'

interface NotationToggleProps {
  type: NotationType
  onTypeChange: (type: NotationType) => void
}

export function NotationToggle({ type, onTypeChange }: NotationToggleProps) {
  const items: { type: NotationType; label: string }[] = [
    { type: 'alphabetical', label: 'CDE' },
    { type: 'syllabic', label: '도레미' },
    { type: 'intervals', label: '123' },
  ]

  return (
    <div className="relative inline-flex p-1 bg-muted rounded-lg">
      {items.map(item => (
        <button
          key={item.type}
          onClick={() => onTypeChange(item.type)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-md transition-colors z-10',
            type === item.type
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {type === item.type && (
            <motion.div
              layoutId="notation-toggle"
              className="absolute inset-0 bg-background rounded-md shadow-sm z-[-1]"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          {item.label}
        </button>
      ))}
    </div>
  )
}
