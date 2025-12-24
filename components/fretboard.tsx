'use client'

import { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  noteToFixedSolfege,
  noteToInterval,
  getNoteFromFret,
  getScaleNotes,
  ScaleType,
} from '@/lib/music-utils'

interface FretboardProps {
  rootNote: string
  scaleType: ScaleType
  notationType: 'alphabetical' | 'syllabic' | 'intervals'
  frets?: number
}

const STRINGS = ['E', 'B', 'G', 'D', 'A', 'E'] // 고음현부터 저음현 순

export function Fretboard({
  rootNote,
  scaleType,
  notationType,
  frets = 17,
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

  const scaleNotes = getScaleNotes(rootNote, scaleType)

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

  return (
    <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
      {/* 최소 너비를 유지하기 위한 컨테이너 (frets 수에 따라 동적 계산 가능) */}
      <div className="min-w-[800px] flex flex-col">
        {/* 1. 상단 마커 영역 */}
        <div className="flex mb-2">
          <div className="w-8 min-w-4" /> {/* 줄 이름 열 정렬용 여백 */}
          {Array.from({ length: frets }, (_, i) => i + 1).map(fret => (
            <div
              key={`marker-${fret}`}
              className="flex-1 min-w-[52px] xl:min-w-[60px] flex flex-col items-center justify-end h-6"
            >
              {[3, 5, 7, 9, 15].includes(fret) && (
                <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
              )}
              {fret === 12 && (
                <div className="flex flex-col gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 2. 지판 본체 영역 */}
        <div className="flex flex-col">
          {STRINGS.map((openString, stringIndex) => (
            <div
              key={`string-${stringIndex}`}
              className="flex items-stretch h-12"
            >
              {/* 줄 이름 표시 */}
              <div className="min-w-4 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
                {openString}
              </div>

              {/* 프렛들 */}
              {Array.from({ length: frets }, (_, i) => i + 1).map(fret => {
                const useFlat = scaleType.includes('minor')
                const note = getNoteFromFret(openString, fret, useFlat)
                const inScale = scaleNotes.includes(note)
                const isRoot = note === rootNote

                return (
                  <div
                    key={`fret-${stringIndex}-${fret}`}
                    className={cn(
                      'flex-1 min-w-[52px] xl:min-w-[60px] relative flex items-center justify-center',
                      'border-r-2 border-zinc-800/80' // 프렛 사이의 선을 더 굵고 밝게 강조
                    )}
                  >
                    {/* 현(String) 가로선 */}
                    <div
                      className="absolute top-1/2 left-0 right-0 bg-zinc-500/50 pointer-events-none"
                      style={{ height: `${1.5 + stringIndex * 0.3}px` }} // 저음현으로 갈수록 미세하게 두꺼워짐
                    />

                    {/* 음표 도트 */}
                    {inScale && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playNote(note)}
                        className={cn(
                          'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-sm',
                          isRoot
                            ? 'bg-accent-orange text-background shadow-lg shadow-accent-orange/40'
                            : 'bg-accent-teal text-background shadow-md shadow-accent-teal/30'
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

        {/* 3. 하단 프렛 번호 영역 */}
        <div className="flex mt-3">
          <div className="w-8 min-w-4" />
          {Array.from({ length: frets }, (_, i) => i + 1).map(fret => (
            <div
              key={`num-${fret}`}
              className="flex-1 min-w-[52px] xl:min-w-[60px] flex items-center justify-center"
            >
              <span className="text-[11px] text-muted-foreground/50 font-mono font-medium">
                {fret}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
