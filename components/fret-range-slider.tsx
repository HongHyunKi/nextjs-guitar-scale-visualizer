'use client'

interface FretRangeSliderProps {
  startFret: number
  endFret: number
  onStartFretChange: (value: number) => void
  onEndFretChange: (value: number) => void
  min?: number
  max?: number
  minGap?: number
}

export function FretRangeSlider({
  startFret,
  endFret,
  onStartFretChange,
  onEndFretChange,
  min = 0,
  max = 24,
  minGap = 3,
}: FretRangeSliderProps) {
  const startPercent = ((startFret - min) / (max - min)) * 100
  const endPercent = ((endFret - min) / (max - min)) * 100

  const thumbClass =
    'absolute inset-0 w-full h-5 appearance-none bg-transparent pointer-events-none ' +
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto ' +
    '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full ' +
    '[&::-webkit-slider-thumb]:bg-accent-teal [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card ' +
    '[&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer ' +
    '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 ' +
    '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-teal [&::-moz-range-thumb]:border-2 ' +
    '[&::-moz-range-thumb]:border-card [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow [&::-moz-range-thumb]:box-border'

  return (
    <div className="relative flex-1 h-5 flex items-center">
      <div className="absolute w-full h-1.5 rounded-full bg-muted" />
      <div
        className="absolute h-1.5 rounded-full bg-accent-teal"
        style={{ left: `${startPercent}%`, right: `${100 - endPercent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={startFret}
        onChange={e =>
          onStartFretChange(Math.min(parseInt(e.target.value), endFret - minGap))
        }
        className={thumbClass}
        aria-label="Start Fret"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={endFret}
        onChange={e =>
          onEndFretChange(Math.max(parseInt(e.target.value), startFret + minGap))
        }
        className={thumbClass}
        aria-label="End Fret"
      />
    </div>
  )
}
