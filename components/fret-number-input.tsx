'use client'

import { useEffect, useState } from 'react'

interface FretNumberInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  label: string
}

export function FretNumberInput({
  value,
  onChange,
  min,
  max,
  label,
}: FretNumberInputProps) {
  const [text, setText] = useState(value.toString())
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (!focused) setText(value.toString())
  }, [value, focused])

  const commit = () => {
    setFocused(false)
    const num = parseInt(text)
    const clamped = isNaN(num) ? value : Math.max(min, Math.min(max, num))
    onChange(clamped)
    setText(clamped.toString())
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`${label} 감소`}
        className="w-6 h-7 flex items-center justify-center rounded-md border border-border bg-card hover:bg-accent-teal/10 hover:border-accent-teal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:border-border transition-colors"
      >
        <span className="text-sm font-bold text-muted-foreground">−</span>
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={text}
        onFocus={e => {
          setFocused(true)
          e.target.select()
        }}
        onChange={e => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') e.currentTarget.blur()
        }}
        className="w-9 h-7 rounded-md border border-border bg-muted/50 text-center text-xs font-semibold text-foreground focus:outline-none focus:border-accent-teal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`${label} 증가`}
        className="w-6 h-7 flex items-center justify-center rounded-md border border-border bg-card hover:bg-accent-teal/10 hover:border-accent-teal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:border-border transition-colors"
      >
        <span className="text-sm font-bold text-muted-foreground">+</span>
      </button>
    </div>
  )
}
