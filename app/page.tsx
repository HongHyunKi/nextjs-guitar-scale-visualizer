'use client'

import { useState } from 'react'
import { Fretboard } from '@/components/fretboard'
import { NotationToggle } from '@/components/notation-toggle'
import { RootNoteSelector } from '@/components/root-note-selector'
import { ScaleSelector } from '@/components/scale-selector'
import { Music } from 'lucide-react'

export default function Page() {
  const [notationType, setNotationType] = useState<'alphabetical' | 'syllabic'>(
    'alphabetical'
  )
  const [rootNote, setRootNote] = useState('C')
  const [scaleType, setScaleType] = useState<'major' | 'pentatonic'>('major')

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
              Notation Type
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
        </div>

        {/* Fretboard */}
        <div className="bg-card border border-border rounded-xl p-6 overflow-x-auto overflow-y-visible">
          <Fretboard
            rootNote={rootNote}
            scaleType={scaleType}
            notationType={notationType}
          />
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
