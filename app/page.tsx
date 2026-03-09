'use client'

import { useState } from 'react'
import { Fretboard } from '@/components/fretboard'
import { NotationToggle } from '@/components/notation-toggle'
import { RootNoteSelector } from '@/components/root-note-selector'
import { ScaleSelector } from '@/components/scale-selector'
import { CAGEDSelector } from '@/components/caged-selector'
import { FretControl } from '@/components/fret-control'
import { Music } from 'lucide-react'
import {
  ScaleType,
  NotationType,
  SCALE_LABELS,
  getScaleNotes,
} from '@/lib/music-utils'
import {
  CAGEDSelection,
  CAGED_SHAPES,
  CAGED_BG_CLASSES,
} from '@/lib/caged-utils'

export default function Page() {
  const [notationType, setNotationType] = useState<NotationType>('alphabetical')
  const [rootNote, setRootNote] = useState('C')
  const [scaleType, setScaleType] = useState<ScaleType>('major')
  const [frets, setFrets] = useState(15)
  const [cagedEnabled, setCagedEnabled] = useState(false)
  const [selectedCAGEDShape, setSelectedCAGEDShape] =
    useState<CAGEDSelection>('all')

  const scaleNotes = getScaleNotes(rootNote, scaleType)

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
        <div className="p-6 bg-card border border-border rounded-xl space-y-6">
          {/* Scale 섹션 */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Scale
            </p>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Root Note
              </label>
              <RootNoteSelector
                rootNote={rootNote}
                onRootNoteChange={setRootNote}
                notationType={notationType}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 items-start">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Scale Type
                </label>
                <ScaleSelector
                  scaleType={scaleType}
                  onScaleTypeChange={setScaleType}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  {rootNote} {SCALE_LABELS[scaleType]} 구성음
                </label>
                <div className="flex flex-wrap gap-2">
                  {scaleNotes.map((note, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm font-medium rounded border bg-accent-teal/15 text-accent-teal border-accent-teal/30"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* View 섹션 */}
          <div className="space-y-4 border-t border-border pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              View
            </p>

            <div className="flex flex-wrap gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Notation
                </label>
                <NotationToggle
                  type={notationType}
                  onTypeChange={setNotationType}
                />
              </div>

              <div className="w-full max-w-xs">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Frets
                </label>
                <FretControl value={frets} onChange={setFrets} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                CAGED System
              </label>
              <CAGEDSelector
                enabled={cagedEnabled}
                onEnabledChange={setCagedEnabled}
                selectedShape={selectedCAGEDShape}
                onShapeChange={setSelectedCAGEDShape}
              />
            </div>
          </div>
        </div>

        {/* Fretboard */}
        <div className="relative">
          <div className="bg-card border border-border rounded-xl p-6 pr-0 xl:pr-6 overflow-x-auto overflow-y-visible custom-scrollbar">
            <Fretboard
              rootNote={rootNote}
              scaleType={scaleType}
              notationType={notationType}
              frets={frets}
              cagedEnabled={cagedEnabled}
              selectedCAGEDShape={selectedCAGEDShape}
            />
          </div>

          {/* Scroll indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-teal/60 via-accent-teal/80 to-accent-teal/60 pointer-events-none opacity-70 xl:opacity-0 rounded-r-xl shadow-lg shadow-accent-teal/50"></div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 p-4 bg-card/50 border border-border rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent-orange" />
            <span className="text-sm text-muted-foreground">Root Note</span>
          </div>
          {cagedEnabled ? (
            CAGED_SHAPES.map(shape => (
              <div key={shape} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${CAGED_BG_CLASSES[shape]}`}
                />
                <span className="text-sm text-muted-foreground">
                  {shape} Shape
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-accent-teal" />
              <span className="text-sm text-muted-foreground">
                Scale Degree
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
