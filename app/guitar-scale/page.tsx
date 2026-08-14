'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Fretboard, GuitarTone } from '@/components/fretboard'
import { RootNoteSelector } from '@/components/root-note-selector'
import { ScaleSelector } from '@/components/scale-selector'
import { ViewSettingsPopover } from '@/components/view-settings-popover'
import { CAGEDSelector } from '@/components/caged-selector'
import { BackingTrackPlayer } from '@/components/backing-track-player'
import { ThemeToggle } from '@/components/theme-toggle'
import { Music } from 'lucide-react'
import {
  ScaleType,
  NotationType,
  SCALE_LABELS,
  getScaleNotes,
} from '@/lib/music-utils'
import {
  CAGEDShape,
  CAGEDSelection,
  getShapeRootPosition,
} from '@/lib/caged-utils'

export default function Page() {
  const [notationType, setNotationType] = useState<NotationType>('alphabetical')
  const [rootNote, setRootNote] = useState('C')
  const [scaleType, setScaleType] = useState<ScaleType>('major')
  const [startFret, setStartFret] = useState(0)
  const [frets, setFrets] = useState(15)
  const [cagedEnabled, setCagedEnabled] = useState(false)
  const [selectedCAGEDShape, setSelectedCAGEDShape] =
    useState<CAGEDSelection>('all')
  const [guitarTone, setGuitarTone] = useState<GuitarTone>('electric')

  const scaleNotes = getScaleNotes(rootNote, scaleType)
  const cagedRootPosition =
    cagedEnabled && selectedCAGEDShape !== 'all'
      ? getShapeRootPosition(rootNote, selectedCAGEDShape as CAGEDShape)
      : null

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent-blue via-accent-teal to-accent-green">
              <Music className="w-6 h-6 text-background" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-balance">
                GuitarKit
              </h1>
              <p className="text-muted-foreground text-sm">
                스케일 연습을 더 쉽고 정확하게
              </p>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        {/* Quick Controls — 가장 자주 바꾸는 컨트롤을 프렛보드 바로 위로 */}
        <div className="p-4 md:p-6 bg-card border border-border rounded-xl space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Scale
            </p>
            <ViewSettingsPopover
              notationType={notationType}
              onNotationTypeChange={setNotationType}
              guitarTone={guitarTone}
              onGuitarToneChange={setGuitarTone}
              startFret={startFret}
              frets={frets}
              onStartFretChange={setStartFret}
              onFretsChange={setFrets}
            />
          </div>

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
              CAGED System
            </label>
            <CAGEDSelector
              enabled={cagedEnabled}
              onEnabledChange={setCagedEnabled}
              selectedShape={selectedCAGEDShape}
              onShapeChange={setSelectedCAGEDShape}
            />
            {cagedRootPosition && (
              <p className="text-xs text-muted-foreground mt-2">
                {selectedCAGEDShape} Form · 루트 {cagedRootPosition.string}
                번줄 {cagedRootPosition.fret}프렛
              </p>
            )}
          </div>
        </div>

        {/* Fretboard */}
        <div className="relative">
          <div className="bg-card border border-border rounded-xl">
            {/* 구성음 범례 — 프렛보드와 한 덩어리로 묶어 참조하기 쉽게 */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6 pb-4">
              <p className="text-sm font-medium text-muted-foreground">
                <span className="text-foreground font-semibold">
                  {rootNote} {SCALE_LABELS[scaleType]}
                </span>{' '}
                구성음
              </p>
              <div className="flex flex-wrap gap-2">
                {scaleNotes.map((note, index) => (
                  <span
                    key={index}
                    className={
                      index === 0
                        ? 'px-2 py-1 text-sm font-medium rounded border bg-accent-orange/15 text-accent-orange border-accent-orange/30'
                        : 'px-2 py-1 text-sm font-medium rounded border bg-accent-teal/15 text-accent-teal border-accent-teal/30'
                    }
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-6 pb-6 pr-0 xl:pr-6 overflow-x-auto overflow-y-visible custom-scrollbar">
              <Fretboard
                rootNote={rootNote}
                scaleType={scaleType}
                notationType={notationType}
                startFret={startFret}
                frets={frets}
                cagedEnabled={cagedEnabled}
                selectedCAGEDShape={selectedCAGEDShape}
                guitarTone={guitarTone}
              />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-teal/60 via-accent-teal/80 to-accent-teal/60 pointer-events-none opacity-70 xl:opacity-0 rounded-r-xl shadow-lg shadow-accent-teal/50"></div>
        </div>

        {/* Backing Track Player */}
        <BackingTrackPlayer rootNote={rootNote} scaleType={scaleType} />
      </div>
    </div>
  )
}
