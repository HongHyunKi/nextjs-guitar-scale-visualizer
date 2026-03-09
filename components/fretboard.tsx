'use client'

import { useEffect, useRef, useMemo } from 'react'
import * as Tone from 'tone'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  noteToFixedSolfege,
  noteToInterval,
  getNoteFromFret,
  getScaleNotes,
  ScaleType,
  NotationType,
} from '@/lib/music-utils'
import {
  CAGEDShape,
  CAGEDSelection,
  isInCAGEDShapeRange,
} from '@/lib/caged-utils'

interface FretboardProps {
  rootNote: string
  scaleType: ScaleType
  notationType: NotationType
  frets?: number
  cagedEnabled?: boolean
  selectedCAGEDShape?: CAGEDSelection
}

const STRINGS = ['E', 'B', 'G', 'D', 'A', 'E'] // 고음현부터 저음현 순

export function Fretboard({
  rootNote,
  scaleType,
  notationType,
  frets = 17,
  cagedEnabled = false,
  selectedCAGEDShape = 'all',
}: FretboardProps) {
  const synthRef = useRef<Tone.PolySynth | null>(null)

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5,
      },
    }).toDestination()

    return () => {
      synthRef.current?.dispose()
    }
  }, [])

  const scaleNotes = useMemo(
    () => getScaleNotes(rootNote, scaleType),
    [rootNote, scaleType]
  )

  const allFrets = useMemo(
    () => Array.from({ length: frets }, (_, i) => i + 1),
    [frets]
  )

  const playNote = (note: string) => {
    if (synthRef.current && Tone.context.state === 'running') {
      synthRef.current.triggerAttackRelease(`${note}4`, '8n')
    } else {
      Tone.context.resume().then(() => {
        synthRef.current?.triggerAttackRelease(`${note}4`, '8n')
      })
    }
  }

  const getDisplayNote = (note: string) => {
    if (notationType === 'syllabic') {
      return noteToFixedSolfege(note)
    } else if (notationType === 'intervals') {
      return noteToInterval(note, rootNote)
    }
    return note
  }

  // 해당 프렛이 선택된 shape의 활성 범위에 속하는지
  const isActiveNote = (fret: number): boolean => {
    if (!cagedEnabled || selectedCAGEDShape === 'all') return true
    return isInCAGEDShapeRange(fret, rootNote, selectedCAGEDShape as CAGEDShape)
  }

  // 활성 노트의 색상
  const getNoteColorClass = (isRoot: boolean): string => {
    if (isRoot)
      return 'bg-accent-orange text-background shadow-lg shadow-accent-orange/40'
    return 'bg-accent-teal text-background shadow-md shadow-accent-teal/30'
  }

  // 프렛별 세로선 스타일 (0=너트, 12=옥타브, 나머지=일반)
  const getFretBorderClass = (fret: number) => {
    if (fret === 0) return 'border-r-[3px] border-zinc-300/60'
    if (fret === 12) return 'border-r-2 border-rose-500/70'
    return 'border-r-2 border-zinc-700/80'
  }

  return (
    <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
      <div className="min-w-[800px] flex flex-col">
        {/* 2. 지판 본체 */}
        <div className="flex flex-col">
          {STRINGS.map((openString, stringIndex) => (
            <div
              key={`string-${stringIndex}`}
              className="flex items-stretch h-12"
            >
              {/* 줄 이름 */}
              <div className="min-w-4 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
                {openString}
              </div>

              {allFrets.map(fret => {
                const useFlat = scaleType.includes('minor')
                const note = getNoteFromFret(openString, fret, useFlat)
                const inScale = scaleNotes.includes(note)
                const isRoot = note === rootNote
                const active = isActiveNote(fret)

                return (
                  <div
                    key={`fret-${stringIndex}-${fret}`}
                    className={cn(
                      'flex-1 min-w-[52px] xl:min-w-[60px] relative flex items-center justify-center',
                      getFretBorderClass(fret)
                    )}
                  >
                    {/* 현(String) 가로선 */}
                    <div
                      className="absolute top-1/2 left-0 right-0 bg-zinc-500/50 pointer-events-none"
                      style={{ height: `${1.5 + stringIndex * 0.3}px` }}
                    />

                    {/* 활성 shape 노트: 완전 표시 */}
                    {inScale && active && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playNote(note)}
                        className={cn(
                          'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-sm',
                          getNoteColorClass(isRoot)
                        )}
                      >
                        <span className="drop-shadow-sm">
                          {getDisplayNote(note)}
                        </span>
                      </motion.button>
                    )}

                    {/* 비활성 shape 노트: 흐리게 (음이름 유지) */}
                    {inScale && !active && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => playNote(note)}
                        className={cn(
                          'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-sm opacity-40',
                          getNoteColorClass(isRoot)
                        )}
                      >
                        <span className="drop-shadow-sm">
                          {getDisplayNote(note)}
                        </span>
                      </motion.button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* 3. 하단 프렛 번호 */}
        <div className="flex mt-3">
          <div className="w-8 min-w-4" />
          {allFrets.map(fret => (
            <div
              key={`num-${fret}`}
              className="flex-1 min-w-[52px] xl:min-w-[60px] flex items-center justify-center"
            >
              {fret > 0 && (
                <span
                  className={cn(
                    'text-[11px] font-mono font-medium',
                    fret === 12
                      ? 'text-rose-500/80'
                      : 'text-muted-foreground/50'
                  )}
                >
                  {fret}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 4. 하단 마커 영역 */}
        <div className="flex mt-2">
          <div className="w-8 min-w-4" />
          {allFrets.map(fret => (
            <div
              key={`marker-${fret}`}
              className="flex-1 min-w-[52px] xl:min-w-[60px] flex items-center justify-center gap-1 h-5"
            >
              {fret === 12 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                </>
              ) : [3, 5, 7, 9, 15, 17, 19, 21].includes(fret) ? (
                <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
