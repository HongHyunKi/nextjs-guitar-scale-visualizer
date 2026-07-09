'use client'

import { useEffect, useRef, useMemo } from 'react'
import * as Tone from 'tone'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  noteToFixedSolfege,
  noteToInterval,
  getNoteFromFret,
  getNoteIndex,
  getPitchFromFret,
  getScaleNotes,
  isScaleFlat,
  ScaleType,
  NotationType,
} from '@/lib/music-utils'
import {
  CAGEDShape,
  CAGEDSelection,
  isInCAGEDShapeRange,
} from '@/lib/caged-utils'

export type GuitarTone = 'electric' | 'acoustic'

interface FretboardProps {
  rootNote: string
  scaleType: ScaleType
  notationType: NotationType
  startFret?: number
  frets?: number
  cagedEnabled?: boolean
  selectedCAGEDShape?: CAGEDSelection
  guitarTone?: GuitarTone
}

const STRINGS = ['E', 'B', 'G', 'D', 'A', 'E'] // 고음현부터 저음현 순

// 실제 기타 녹음 샘플 (tonejs-instruments, CC-BY 3.0 — README 출처 표기 참조)
// Sampler가 샘플 사이 음정은 리피칭으로 채운다
const SAMPLE_URLS: Record<GuitarTone, Record<string, string>> = {
  electric: {
    E2: 'E2.mp3',
    'F#2': 'Fs2.mp3',
    A2: 'A2.mp3',
    C3: 'C3.mp3',
    'D#3': 'Ds3.mp3',
    'F#3': 'Fs3.mp3',
    A3: 'A3.mp3',
    C4: 'C4.mp3',
    'D#4': 'Ds4.mp3',
    'F#4': 'Fs4.mp3',
    A4: 'A4.mp3',
    C5: 'C5.mp3',
    'D#5': 'Ds5.mp3',
    'F#5': 'Fs5.mp3',
    A5: 'A5.mp3',
    C6: 'C6.mp3',
  },
  acoustic: {
    E2: 'E2.mp3',
    G2: 'G2.mp3',
    A2: 'A2.mp3',
    C3: 'C3.mp3',
    D3: 'D3.mp3',
    E3: 'E3.mp3',
    G3: 'G3.mp3',
    A3: 'A3.mp3',
    C4: 'C4.mp3',
    D4: 'D4.mp3',
    E4: 'E4.mp3',
    G4: 'G4.mp3',
    A4: 'A4.mp3',
    C5: 'C5.mp3',
    D5: 'D5.mp3',
  },
}

export function Fretboard({
  rootNote,
  scaleType,
  notationType,
  startFret = 0,
  frets = 24,
  cagedEnabled = false,
  selectedCAGEDShape = 'all',
  guitarTone = 'electric',
}: FretboardProps) {
  const samplerRef = useRef<Tone.Sampler | null>(null)

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: SAMPLE_URLS[guitarTone],
      baseUrl: `/samples/guitar-${guitarTone}/`,
      release: 1,
    }).toDestination()
    samplerRef.current = sampler

    return () => {
      samplerRef.current = null
      sampler.dispose()
    }
  }, [guitarTone])

  const scaleNotes = useMemo(
    () => getScaleNotes(rootNote, scaleType),
    [rootNote, scaleType]
  )

  const allFrets = useMemo(
    () =>
      Array.from({ length: frets - startFret + 1 }, (_, i) => i + startFret),
    [frets, startFret]
  )

  const playNote = async (stringIndex: number, fret: number) => {
    await Tone.start()
    const sampler = samplerRef.current
    if (!sampler || !sampler.loaded) return // 샘플 로드 전 클릭은 무시
    const pitch = getPitchFromFret(
      stringIndex,
      fret,
      isScaleFlat(rootNote, scaleType)
    )
    sampler.triggerAttackRelease(pitch, '2n')
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

  // 프렛별 세로선 스타일 (12=옥타브, 나머지=일반, 0=너트는 별도 처리)
  const getFretBorderClass = (fret: number) => {
    if (fret === 0) return ''
    if (fret === 12) return 'border-r-2 border-accent-orange/70'
    return 'border-r-2 border-border'
  }

  // 프렛별 너비 (기타 물리 법칙: 12프렛 = 1프렛의 절반)
  const getFretWidth = (fret: number): number => {
    if (fret === 0) return 52
    return Math.max(36, Math.round(72 * Math.pow(0.965, fret - 1)))
  }

  return (
    <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
      <div className="w-full flex flex-col">
        {/* 2. 지판 본체 */}
        <div className="flex flex-col">
          {STRINGS.map((openString, stringIndex) => (
            <div
              key={`string-${stringIndex}`}
              className="flex items-stretch h-9"
            >
              {allFrets.map(fret => {
                const useFlat = isScaleFlat(rootNote, scaleType)
                const note = getNoteFromFret(openString, fret, useFlat)
                const inScale = scaleNotes.some(
                  n => getNoteIndex(n) === getNoteIndex(note)
                )
                const isRoot = getNoteIndex(note) === getNoteIndex(rootNote)
                const active = isActiveNote(fret)
                const isOpenString = fret === 0

                return (
                  <div
                    key={`fret-${stringIndex}-${fret}`}
                    className={cn(
                      'relative flex items-center justify-center',
                      getFretBorderClass(fret)
                    )}
                    style={
                      fret === 0
                        ? { width: 52, flexShrink: 0 }
                        : { flex: getFretWidth(fret) }
                    }
                  >
                    {/* 현(String) 가로선 (0프렛 왼쪽은 표시 안 함) */}
                    {!isOpenString && (
                      <div
                        className="absolute top-1/2 left-0 right-0 bg-muted-foreground/50 pointer-events-none"
                        style={{ height: `${1.5 + stringIndex * 0.3}px` }}
                      />
                    )}

                    {/* 0프렛 너트 세로선 (오른쪽 끝 = 1프렛 경계) */}
                    {isOpenString && (
                      <div className="absolute inset-y-0 right-0 w-[6px] bg-foreground/90 pointer-events-none" />
                    )}

                    {/* 활성 노트 (0프렛 포함, 동일 UI) */}
                    {inScale && active && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playNote(stringIndex, fret)}
                        className={cn(
                          'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-sm',
                          getNoteColorClass(isRoot)
                        )}
                      >
                        <span className="drop-shadow-sm">
                          {getDisplayNote(note)}
                        </span>
                      </motion.button>
                    )}

                    {/* 비활성 shape 노트: 흐리게 */}
                    {inScale && !active && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => playNote(stringIndex, fret)}
                        className={cn(
                          'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all shadow-sm opacity-40',
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
          {startFret === 0 && <div className="w-8 min-w-4" />}
          {allFrets.map(fret => (
            <div
              key={`num-${fret}`}
              className="flex items-center justify-center"
              style={
                fret === 0
                  ? { width: 52, flexShrink: 0 }
                  : { flex: getFretWidth(fret) }
              }
            >
              {fret > 0 && (
                <span
                  className={cn(
                    'text-xs font-mono font-medium',
                    fret === 12
                      ? 'text-accent-orange'
                      : 'text-muted-foreground'
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
          {startFret === 0 && <div className="w-8 min-w-4" />}
          {allFrets.map(fret => (
            <div
              key={`marker-${fret}`}
              className="flex items-center justify-center gap-1 h-5"
              style={
                fret === 0
                  ? { width: 52, flexShrink: 0 }
                  : { flex: getFretWidth(fret) }
              }
            >
              {[12, 24].includes(fret) ? (
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
