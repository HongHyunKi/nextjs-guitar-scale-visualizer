'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NotationToggleProps {
  type: 'alphabetical' | 'syllabic' | 'intervals'
  onTypeChange: (type: 'alphabetical' | 'syllabic' | 'intervals') => void
}

export function NotationToggle({ type, onTypeChange }: NotationToggleProps) {
  return (
    <div className="relative inline-flex p-1 bg-muted rounded-lg w-auto">
      <button
        onClick={() => onTypeChange('alphabetical')}
        className={cn(
          'relative z-10 px-4 py-2 text-sm font-medium transition-colors rounded-md',
          type === 'alphabetical'
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        CDE
      </button>

      <button
        onClick={() => onTypeChange('syllabic')}
        className={cn(
          'relative z-10 px-4 py-2 text-sm font-medium transition-colors rounded-md',
          type === 'syllabic'
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        도레미
      </button>

      <button
        onClick={() => onTypeChange('intervals')}
        className={cn(
          'relative z-10 px-4 py-2 text-sm font-medium transition-colors rounded-md',
          type === 'intervals'
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        123
      </button>

      <motion.div
        layoutId="notation-toggle"
        className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm"
        initial={false}
        animate={{
          left:
            type === 'alphabetical'
              ? '4px'
              : type === 'syllabic'
                ? 'calc(33.33% + 1.33px)'
                : 'calc(66.67% + 2.67px)',
          right:
            type === 'alphabetical'
              ? 'calc(66.67% + 2.67px)'
              : type === 'syllabic'
                ? 'calc(33.33% + 1.33px)'
                : '4px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </div>
  )
}
