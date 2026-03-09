'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'

interface FretControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function FretControl({
  value,
  onChange,
  min = 5,
  max = 24,
}: FretControlProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value.toString())

  const handleBlur = () => {
    const num = parseInt(inputValue)
    if (!isNaN(num)) {
      const clamped = Math.max(min, Math.min(max, num))
      onChange(clamped)
      setInputValue(clamped.toString())
    } else {
      setInputValue(value.toString())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setInputValue(value.toString())
      setIsEditing(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Range slider */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-teal [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent-teal [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
      />

      {/* Spinner */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-accent-teal/10 hover:border-accent-teal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:border-border transition-colors"
        >
          <span className="text-lg font-bold text-muted-foreground">−</span>
        </button>
        <div
          className="w-10 flex items-center justify-center cursor-text"
          onClick={() => {
            if (!isEditing) {
              setIsEditing(true)
              setInputValue(value.toString())
            }
          }}
        >
          {isEditing ? (
            <Input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              min={min}
              max={max}
              autoFocus
              className="h-10 text-lg font-semibold text-center"
            />
          ) : (
            <div className="w-full h-10 px-4 flex items-center justify-center rounded-lg bg-muted/50 border border-border">
              <span className="text-sm font-semibold text-foreground">
                {value}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-accent-teal/10 hover:border-accent-teal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:border-border transition-colors"
        >
          <span className="text-lg font-bold text-muted-foreground">+</span>
        </button>
      </div>
    </div>
  )
}
