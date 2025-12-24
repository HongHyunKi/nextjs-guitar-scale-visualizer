'use client'

import { useState } from 'react'
import { Fretboard } from '@/components/fretboard'
import { NotationToggle } from '@/components/notation-toggle'
import { RootNoteSelector } from '@/components/root-note-selector'
import { ScaleSelector } from '@/components/scale-selector'
import { Input } from '@/components/ui/input'
import { Music } from 'lucide-react'
import { ScaleType, getScaleNotes, noteToFixedSolfege } from '@/lib/music-utils'

export default function Page() {
  const [notationType, setNotationType] = useState<'alphabetical' | 'syllabic'>(
    'alphabetical'
  )
  const [rootNote, setRootNote] = useState('C')
  const [scaleType, setScaleType] = useState<ScaleType>('major')
  const [frets, setFrets] = useState(17)
  const [isEditingFrets, setIsEditingFrets] = useState(false)
  const [fretsInput, setFretsInput] = useState('17')

  const scaleNotes = getScaleNotes(rootNote, scaleType)

  const handleFretsInputChange = (value: string) => {
    setFretsInput(value)
  }

  const handleFretsInputBlur = () => {
    const numValue = parseInt(fretsInput)
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(5, Math.min(22, numValue))
      setFrets(clampedValue)
      setFretsInput(clampedValue.toString())
    } else {
      setFretsInput(frets.toString())
    }
    setIsEditingFrets(false)
  }

  const handleFretsInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      handleFretsInputBlur()
    } else if (e.key === 'Escape') {
      setFretsInput(frets.toString())
      setIsEditingFrets(false)
    }
  }

  const getScaleLabel = (type: ScaleType) => {
    switch (type) {
      case 'major':
        return 'Major'
      case 'minor':
        return 'Minor'
      case 'major-pentatonic':
        return 'Major Pentatonic'
      case 'minor-pentatonic':
        return 'Minor Pentatonic'
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent-blue via-accent-teal to-accent-green">
              <Music className="w-6 h-6 text-background" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-balance">
                Guitar Scale Visualizer
              </h1>
              <p className="text-muted-foreground text-sm">
                Interactive fretboard for learning scales
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col flex-wrap gap-4  p-6 bg-card border border-border rounded-xl">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Root Note
            </label>
            <RootNoteSelector
              rootNote={rootNote}
              onRootNoteChange={setRootNote}
              notationType={notationType}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Notation
            </label>
            <NotationToggle
              type={notationType}
              onTypeChange={setNotationType}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Scale Type
            </label>
            <ScaleSelector
              scaleType={scaleType}
              onScaleTypeChange={setScaleType}
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {rootNote} {getScaleLabel(scaleType)} 구성음
            </label>

            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {scaleNotes.map((note, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 px-2 py-1 bg-background rounded"
                  >
                    <span className="text-sm font-medium">{note}</span>
                    {notationType === 'syllabic' && (
                      <span className="text-xs text-muted-foreground">
                        {noteToFixedSolfege(note)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 프렛 수 조절 */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Frets
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFrets(Math.max(5, frets - 1))}
                disabled={frets <= 5}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-accent-teal/10 hover:border-accent-teal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:border-border transition-colors"
              >
                <span className="text-lg font-bold text-muted-foreground">
                  −
                </span>
              </button>
              <div
                className="w-10 flex items-center justify-center cursor-text"
                onClick={() => {
                  if (!isEditingFrets) {
                    setIsEditingFrets(true)
                    setFretsInput(frets.toString())
                  }
                }}
              >
                {isEditingFrets ? (
                  <Input
                    type="number"
                    value={fretsInput}
                    onChange={e => handleFretsInputChange(e.target.value)}
                    onBlur={handleFretsInputBlur}
                    onKeyDown={handleFretsInputKeyDown}
                    min={5}
                    max={22}
                    autoFocus
                    className="h-10 text-lg font-semibold text-center"
                  />
                ) : (
                  <div className="w-full h-10 px-4 flex items-center justify-center rounded-lg bg-muted/50 border border-border">
                    <span className="text-sm font-semibold text-foreground">
                      {frets}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setFrets(Math.min(22, frets + 1))}
                disabled={frets >= 22}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-accent-teal/10 hover:border-accent-teal disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:border-border transition-colors"
              >
                <span className="text-lg font-bold text-muted-foreground">
                  +
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Fretboard */}
        <div className="relative">
          <div className="bg-card border border-border rounded-xl p-6 overflow-x-auto overflow-y-visible custom-scrollbar">
            <Fretboard
              rootNote={rootNote}
              scaleType={scaleType}
              notationType={notationType}
              frets={frets}
            />
          </div>

          {/* Scroll indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-teal/60 via-accent-teal/80 to-accent-teal/60 pointer-events-none opacity-70 xl:opacity-0 rounded-r-xl shadow-lg shadow-accent-teal/50"></div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 p-4 bg-card/50 border border-border rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent-orange" />
            <span className="text-sm text-muted-foreground">Root Note</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent-teal" />
            <span className="text-sm text-muted-foreground">Scale Degree</span>
          </div>
        </div>
      </div>
    </div>
  )
}
