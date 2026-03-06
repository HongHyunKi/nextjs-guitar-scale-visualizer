'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ScaleType, SCALE_LABELS } from '@/lib/music-utils'

interface ScaleSelectorProps {
  scaleType: ScaleType
  onScaleTypeChange: (type: ScaleType) => void
}

const SCALE_ITEMS = (Object.entries(SCALE_LABELS) as [ScaleType, string][]).map(
  ([value, label]) => ({ value, label })
)

export function ScaleSelector({
  scaleType,
  onScaleTypeChange,
}: ScaleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SCALE_ITEMS.map(({ value, label }) => (
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
          {label}
        </Button>
      ))}
    </div>
  )
}
