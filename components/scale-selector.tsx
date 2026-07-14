'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ScaleType, SCALE_LABELS, MAIN_SCALE_TYPES } from '@/lib/music-utils'

interface ScaleSelectorProps {
  scaleType: ScaleType
  onScaleTypeChange: (type: ScaleType) => void
}

const OTHER_SCALE_ITEMS = (Object.keys(SCALE_LABELS) as ScaleType[])
  .filter(value => !MAIN_SCALE_TYPES.includes(value))
  .map(value => ({ value, label: SCALE_LABELS[value] }))

export function ScaleSelector({
  scaleType,
  onScaleTypeChange,
}: ScaleSelectorProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isOtherSelected = !MAIN_SCALE_TYPES.includes(scaleType)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {MAIN_SCALE_TYPES.map(value => (
        <Button
          key={value}
          variant={scaleType === value ? 'default' : 'outline'}
          onClick={() => onScaleTypeChange(value)}
          className={cn(
            'transition-all',
            scaleType === value &&
              'bg-accent-teal text-background hover:bg-accent-teal/90'
          )}
        >
          {SCALE_LABELS[value]}
        </Button>
      ))}

      <div className="relative col-span-2 sm:col-span-1" ref={containerRef}>
        <Button
          variant={isOtherSelected ? 'default' : 'outline'}
          onClick={() => setOpen(prev => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            'w-full transition-all',
            isOtherSelected &&
              'bg-accent-teal text-background hover:bg-accent-teal/90'
          )}
        >
          <span className="truncate">
            {isOtherSelected ? SCALE_LABELS[scaleType] : '더보기'}
          </span>
          <ChevronDown
            className={cn('w-4 h-4 transition-transform', open && 'rotate-180')}
          />
        </Button>

        {open && (
          <div
            role="listbox"
            className="absolute right-0 top-full mt-2 w-56 z-30 bg-card border border-border rounded-xl p-1.5 shadow-lg"
          >
            {OTHER_SCALE_ITEMS.map(({ value, label }) => (
              <button
                key={value}
                role="option"
                aria-selected={scaleType === value}
                onClick={() => {
                  onScaleTypeChange(value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  scaleType === value
                    ? 'bg-accent-teal/15 text-accent-teal'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
