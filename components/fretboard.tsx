'use client'

import { useEffect, useRef } from 'react'
import * as Tone from 'tone'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  noteToFixedSolfege,
  getNoteFromFret,
  getScaleNotes,
  ScaleType,
} from '@/lib/music-utils'

interface FretboardProps {
  rootNote: string
  scaleType: ScaleType
  notationType: 'alphabetical' | 'syllabic'
}

const STRINGS = ['E', 'B', 'G', 'D', 'A', 'E'] // Standard tuning (high to low)
const FRETS = 20

export function Fretboard({
  rootNote,
  scaleType,
  notationType,
}: FretboardProps) {
  const synthRef = useRef<Tone.PolySynth | null>(null)

  useEffect(() => {
    // Initialize synth
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
    } else if (Tone.context.state !== 'running') {
      Tone.context.resume().then(() => {
        synthRef.current?.triggerAttackRelease(`${note}4`, '8n')
      })
    }
  }

  const isInScale = (note: string) => {
    return scaleNotes.includes(note)
  }

  const isRootNote = (note: string) => {
    return note === rootNote
  }

  const getDisplayNote = (note: string) => {
    if (notationType === 'syllabic') {
      return noteToFixedSolfege(note)
    }
    return note
  }

  return (
    <div className="relative w-fit">
      {/* Fret markers */}
      <div className="absolute top-0 left-0 right-0 flex pointer-events-none">
        <div className="w-12" /> {/* String labels space */}
        {Array.from({ length: FRETS }, (_, i) => i + 1).map(fret => {
          const showMarker = [3, 5, 7, 9, 12, 15, 17, 19, 21].includes(fret)
          const isDoubleMarker = [12].includes(fret)
          return (
            <div
              key={fret}
              className="flex-1 min-w-[50px] xl:min-w-[60px] flex items-start justify-center pt-1"
            >
              {showMarker && (
                <div className="flex flex-col gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                  {isDoubleMarker && (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fretboard */}
      <div className="space-y-3 pt-8">
        {STRINGS.map((openString, stringIndex) => (
          <div key={stringIndex} className="flex items-center gap-2">
            {/* String label */}
            <div className="w-10 text-right text-xs font-medium text-muted-foreground">
              {openString}
            </div>

            {/* Frets */}
            <div className="flex-1 flex relative">
              {/* String line */}
              <div
                className="absolute top-1/2 left-0 right-0 bg-muted-foreground/30"
                style={{ height: `${2 - stringIndex * 0.2}px` }}
              />

              {Array.from({ length: FRETS }, (_, i) => i + 1).map(fret => {
                const useFlat =
                  scaleType === 'minor' || scaleType === 'minor-pentatonic'
                const note = getNoteFromFret(openString, fret, useFlat)
                const inScale = isInScale(note)
                const isRoot = isRootNote(note)

                return (
                  <div
                    key={fret}
                    className="flex-1 min-w-[50px] xl:min-w-[60px] flex items-center justify-center relative"
                  >
                    {/* Fret line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-border" />

                    {/* Note dot */}
                    {inScale && (
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => playNote(note)}
                        className={cn(
                          'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                          isRoot
                            ? 'bg-accent-orange text-background shadow-lg shadow-accent-orange/50'
                            : 'bg-accent-teal text-background shadow-md shadow-accent-teal/30'
                        )}
                      >
                        <motion.span
                          key={`${note}-${notationType}`}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getDisplayNote(note)}
                        </motion.span>
                      </motion.button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Fret numbers */}
      <div className="flex mt-4">
        <div className="w-12" /> {/* String labels space */}
        {Array.from({ length: FRETS }, (_, i) => i + 1).map(fret => (
          <div
            key={fret}
            className="flex-1 min-w-[50px] flex items-center justify-center"
          >
            <span className="text-xs text-muted-foreground font-mono">
              {fret}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
