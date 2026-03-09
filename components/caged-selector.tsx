'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CAGEDShape, CAGEDSelection, CAGED_SHAPES, CAGED_BG_CLASSES } from '@/lib/caged-utils'

interface CAGEDSelectorProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  selectedShape: CAGEDSelection
  onShapeChange: (shape: CAGEDSelection) => void
}

const SHAPES: { value: CAGEDSelection; label: string }[] = [
  { value: 'all', label: 'All' },
  ...CAGED_SHAPES.map(s => ({ value: s as CAGEDSelection, label: s })),
]

export function CAGEDSelector({
  enabled,
  onEnabledChange,
  selectedShape,
  onShapeChange,
}: CAGEDSelectorProps) {
  const handleClick = (value: CAGEDSelection) => {
    onEnabledChange(true)
    onShapeChange(value)
  }

  return (
    <div className="flex items-center flex-wrap gap-1">
      {SHAPES.map(({ value, label }) => {
        const isSelected = enabled && selectedShape === value
        const isShape = value !== 'all'
        const colorClass = isShape ? CAGED_BG_CLASSES[value as CAGEDShape] : ''

        return (
          <Button
            key={value}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleClick(value as CAGEDSelection)}
            className={cn(
              'min-w-[48px] transition-all',
              isSelected &&
                (value === 'all'
                  ? 'bg-accent-teal text-background hover:bg-accent-teal/90'
                  : `${colorClass} text-background hover:opacity-90`)
            )}
          >
            {label}
          </Button>
        )
      })}
    </div>
  )
}
