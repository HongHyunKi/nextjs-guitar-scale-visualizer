'use client'

import { useState } from 'react'
import { Fretboard } from '@/components/fretboard'
import { NotationToggle } from '@/components/notation-toggle'
import { RootNoteSelector } from '@/components/root-note-selector'
import { ScaleSelector } from '@/components/scale-selector'
import { FretControl } from '@/components/fret-control'
import { BackingTrackPlayer } from '@/components/backing-track-player'
import { Music } from 'lucide-react'
import {
  ScaleType,
  NotationType,
  SCALE_LABELS,
  getScaleNotes,
} from '@/lib/music-utils'
import { CAGEDSelection } from '@/lib/caged-utils'

export default function Page() {
  const [notationType, setNotationType] = useState<NotationType>('alphabetical')
  const [rootNote, setRootNote] = useState('C')
  const [scaleType, setScaleType] = useState<ScaleType>('major')
  const [startFret, setStartFret] = useState(0)
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
                Guitar ScaleUp
              </h1>
              <p className="text-muted-foreground text-sm">
                방구석 기타리스트를 위한 스케일 시각화
              </p>
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
              startFret={startFret}
              frets={frets}
              cagedEnabled={cagedEnabled}
              selectedCAGEDShape={selectedCAGEDShape}
            />
          </div>

          {/* Scroll indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-teal/60 via-accent-teal/80 to-accent-teal/60 pointer-events-none opacity-70 xl:opacity-0 rounded-r-xl shadow-lg shadow-accent-teal/50"></div>
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
                  Start Fret
                </label>
                <FretControl
                  value={startFret}
                  onChange={setStartFret}
                  min={0}
                  max={frets - 3}
                />
              </div>
              <div className="w-full max-w-xs">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  End Fret
                </label>
                <FretControl
                  value={frets}
                  onChange={setFrets}
                  min={startFret + 3}
                  max={24}
                />
              </div>
            </div>

            {/* TODO CAGED */}
            {/* <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                CAGED System
              </label>
              <CAGEDSelector
                enabled={cagedEnabled}
                onEnabledChange={setCagedEnabled}
                selectedShape={selectedCAGEDShape}
                onShapeChange={setSelectedCAGEDShape}
              />
            </div> */}
          </div>
        </div>

        {/* Backing Track Player */}
        <BackingTrackPlayer rootNote={rootNote} scaleType={scaleType} />
      </div>
    </div>
  )
}
