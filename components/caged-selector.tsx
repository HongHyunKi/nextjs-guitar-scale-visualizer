'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CAGEDShape, CAGEDSelection } from '@/lib/caged-utils'

interface CAGEDSelectorProps {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  selectedShape: CAGEDSelection
  onShapeChange: (shape: CAGEDSelection) => void
}

const SHAPES: { value: CAGEDSelection; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'C', label: 'C' },
  { value: 'A', label: 'A' },
  { value: 'G', label: 'G' },
  { value: 'E', label: 'E' },
  { value: 'D', label: 'D' },
]

const SHAPE_COLORS: Record<CAGEDShape, string> = {
  C: 'bg-caged-c',
  A: 'bg-caged-a',
  G: 'bg-caged-g',
  E: 'bg-caged-e',
  D: 'bg-caged-d',
}

export function CAGEDSelector({
  enabled,
  onEnabledChange,
  selectedShape,
  onShapeChange,
}: CAGEDSelectorProps) {
  return (
    <div className="space-y-3">
      {/* CAGED 토글 */}
      <div className="flex items-center gap-3">
        <Button
          variant={enabled ? 'default' : 'outline'}
          onClick={() => onEnabledChange(!enabled)}
          className={cn(
            'transition-all',
            enabled && 'bg-accent-teal text-background hover:bg-accent-teal/90'
          )}
        >
          CAGED System
        </Button>
        {enabled && (
          <span className="text-sm text-muted-foreground">
            {selectedShape === 'all' ? '모든 형태' : `${selectedShape} Shape`}
          </span>
        )}
      </div>

      {/* CAGED 형태 선택 */}
      {enabled && (
        <div className="flex flex-wrap gap-2">
          {SHAPES.map(({ value, label }) => {
            const isSelected = selectedShape === value
            const isShape = value !== 'all'
            const colorClass = isShape ? SHAPE_COLORS[value as CAGEDShape] : ''

            return (
              <Button
                key={value}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => onShapeChange(value)}
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
      )}
    </div>
  )
}
