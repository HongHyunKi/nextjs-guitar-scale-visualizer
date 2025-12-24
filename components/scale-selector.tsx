'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ScaleType } from '@/lib/music-utils'

interface ScaleSelectorProps {
  scaleType: ScaleType
  onScaleTypeChange: (type: ScaleType) => void
}

export function ScaleSelector({
  scaleType,
  onScaleTypeChange,
}: ScaleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant={scaleType === 'major' ? 'default' : 'outline'}
        onClick={() => onScaleTypeChange('major')}
        className={cn(
          'transition-all',
          scaleType === 'major' &&
            'bg-accent-teal text-background hover:bg-accent-teal/90'
        )}
      >
        Major Scale
      </Button>
      <Button
        variant={scaleType === 'minor' ? 'default' : 'outline'}
        onClick={() => onScaleTypeChange('minor')}
        className={cn(
          'transition-all',
          scaleType === 'minor' &&
            'bg-accent-teal text-background hover:bg-accent-teal/90'
        )}
      >
        Minor Scale
      </Button>
      <Button
        variant={scaleType === 'major-pentatonic' ? 'default' : 'outline'}
        onClick={() => onScaleTypeChange('major-pentatonic')}
        className={cn(
          'transition-all',
          scaleType === 'major-pentatonic' &&
            'bg-accent-teal text-background hover:bg-accent-teal/90'
        )}
      >
        Major Pentatonic
      </Button>
      <Button
        variant={scaleType === 'minor-pentatonic' ? 'default' : 'outline'}
        onClick={() => onScaleTypeChange('minor-pentatonic')}
        className={cn(
          'transition-all',
          scaleType === 'minor-pentatonic' &&
            'bg-accent-teal text-background hover:bg-accent-teal/90'
        )}
      >
        Minor Pentatonic
      </Button>
    </div>
  )
}
