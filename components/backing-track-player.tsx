'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as Tone from 'tone'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ScaleType } from '@/lib/music-utils'
import {
  getDiatonicChords,
  getStyleProgression,
  getChordLabel,
  BackingStyle,
  Chord,
} from '@/lib/chord-utils'

interface BackingTrackPlayerProps {
  rootNote: string
  scaleType: ScaleType
}

type DrumStep = { kick: boolean; snare: boolean; hihat: boolean }

const DRUM_PATTERNS: Record<BackingStyle, DrumStep[]> = {
  rock: [
    { kick: true, snare: false, hihat: true }, // 0
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 2
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: true, hihat: true }, // 4 (beat 2)
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 6
    { kick: false, snare: false, hihat: false },
    { kick: true, snare: false, hihat: true }, // 8 (beat 3)
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 10
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: true, hihat: true }, // 12 (beat 4)
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 14
    { kick: false, snare: false, hihat: false },
  ],
  blues: [
    { kick: true, snare: false, hihat: true }, // 0
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 3 (shuffle)
    { kick: false, snare: true, hihat: false }, // 4
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 6 (shuffle)
    { kick: false, snare: false, hihat: false },
    { kick: true, snare: false, hihat: true }, // 8
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 11 (shuffle)
    { kick: false, snare: true, hihat: false }, // 12
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 14 (shuffle)
    { kick: false, snare: false, hihat: false },
  ],
  jazz: [
    { kick: true, snare: false, hihat: true }, // 0
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 2
    { kick: false, snare: false, hihat: true }, // 3 (triplet feel)
    { kick: false, snare: true, hihat: false }, // 4
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 6
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 8
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 10
    { kick: false, snare: false, hihat: true }, // 11 (triplet feel)
    { kick: false, snare: true, hihat: false }, // 12
    { kick: false, snare: false, hihat: false },
    { kick: false, snare: false, hihat: true }, // 14
    { kick: false, snare: false, hihat: false },
  ],
}

const STYLE_LABELS: Record<BackingStyle, string> = {
  rock: 'Rock',
  blues: 'Blues',
  jazz: 'Jazz',
}

export function BackingTrackPlayer({
  rootNote,
  scaleType,
}: BackingTrackPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(90)
  const [style, setStyle] = useState<BackingStyle>('rock')
  const [progressionOverride, setProgressionOverride] = useState<
    number[] | null
  >(null)
  const [currentBeat, setCurrentBeat] = useState<number | null>(null)
  const [samplerLoaded, setSamplerLoaded] = useState(false)

  // Derived: 수동 오버라이드 없으면 스타일 프리셋 사용 (useMemo로 레퍼런스 안정화)
  const progressionIndices = useMemo(
    () => progressionOverride ?? getStyleProgression(style, scaleType),
    [progressionOverride, style, scaleType]
  )

  const samplerRef = useRef<Tone.Sampler | null>(null)
  const kickRef = useRef<Tone.MembraneSynth | null>(null)
  const snareRef = useRef<Tone.NoiseSynth | null>(null)
  const hihatRef = useRef<Tone.MetalSynth | null>(null)
  const chordSeqRef = useRef<Tone.Sequence<Chord> | null>(null)
  const drumSeqRef = useRef<Tone.Sequence<DrumStep> | null>(null)

  // Initialize audio instruments once on mount
  useEffect(() => {
    samplerRef.current = new Tone.Sampler({
      urls: {
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
        C5: 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      onload: () => setSamplerLoaded(true),
    }).toDestination()

    kickRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 4,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).toDestination()
    kickRef.current.volume.value = -6

    snareRef.current = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 },
    }).toDestination()
    snareRef.current.volume.value = -10

    hihatRef.current = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5,
    }).toDestination()
    hihatRef.current.volume.value = -18

    return () => {
      samplerRef.current?.dispose()
      kickRef.current?.dispose()
      snareRef.current?.dispose()
      hihatRef.current?.dispose()
      chordSeqRef.current?.dispose()
      drumSeqRef.current?.dispose()
      Tone.getTransport().stop()
      Tone.getTransport().cancel()
    }
  }, [])

  // Rebuild sequences whenever playback params change
  useEffect(() => {
    setCurrentBeat(null) // Bug 3: 하이라이트 즉시 초기화
    chordSeqRef.current?.dispose()
    drumSeqRef.current?.dispose()
    Tone.getTransport().stop() // Bug 2: cancel 전에 stop
    Tone.getTransport().cancel()
    Tone.getTransport().position = 0 // Bug 2: position 리셋

    if (!isPlaying || !samplerLoaded) return

    const { chords } = getDiatonicChords(rootNote, scaleType)
    const progression = progressionIndices.map(
      i => chords[Math.min(i, chords.length - 1)]
    )

    Tone.getTransport().bpm.value = bpm

    // Apply swing for jazz/blues
    if (style === 'jazz') {
      Tone.getTransport().swing = 0.5
      Tone.getTransport().swingSubdivision = '8n'
    } else if (style === 'blues') {
      Tone.getTransport().swing = 0.2
      Tone.getTransport().swingSubdivision = '8n'
    } else {
      Tone.getTransport().swing = 0
    }

    let beatStep = 0

    chordSeqRef.current = new Tone.Sequence<Chord>(
      (time, chord) => {
        const step = beatStep % progression.length
        beatStep++

        // Update UI slightly before the chord sounds
        const delay = Math.max(0, (time - Tone.now()) * 1000 - 20)
        setTimeout(() => setCurrentBeat(step), delay)

        if (samplerRef.current) {
          chord.midiNotes.forEach((midi, i) => {
            const noteName = Tone.Frequency(midi, 'midi').toNote()
            samplerRef.current!.triggerAttackRelease(
              noteName,
              '2n',
              time + i * 0.04
            )
          })
        }
      },
      progression,
      '1m'
    )

    drumSeqRef.current = new Tone.Sequence<DrumStep>(
      (time, step) => {
        if (step.kick) kickRef.current?.triggerAttackRelease('C1', '8n', time)
        if (step.snare) snareRef.current?.triggerAttackRelease('8n', time)
        if (step.hihat) hihatRef.current?.triggerAttackRelease('32n', time)
      },
      DRUM_PATTERNS[style],
      '16n'
    )

    chordSeqRef.current.start(0)
    drumSeqRef.current.start(0)
    Tone.getTransport().start()
  }, [
    isPlaying,
    rootNote,
    scaleType,
    style,
    bpm,
    progressionIndices,
    samplerLoaded,
  ])

  const handleTogglePlay = async () => {
    await Tone.start()
    setIsPlaying(prev => !prev)
  }

  const handleSetStyle = (s: BackingStyle) => {
    setStyle(s)
    setProgressionOverride(null) // Bug 1: 같은 배치로 처리 → Effect 한 번만 트리거
  }

  const handleBpmChange = (delta: number) => {
    setBpm(prev => Math.min(180, Math.max(60, prev + delta)))
  }

  const cycleSlotChord = (slotIndex: number, direction: 1 | -1) => {
    const { chords } = getDiatonicChords(rootNote, scaleType)
    setProgressionOverride(prev => {
      const base = prev ?? getStyleProgression(style, scaleType)
      const next = [...base]
      next[slotIndex] =
        (next[slotIndex] + direction + chords.length) % chords.length
      return next
    })
  }

  const { chords } = getDiatonicChords(rootNote, scaleType)

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Backing Track
          </p>
        </div>
        <button
          onClick={handleTogglePlay}
          disabled={!samplerLoaded}
          className={cn(
            'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
            isPlaying
              ? 'bg-accent-orange text-background hover:opacity-90'
              : samplerLoaded
                ? 'bg-accent-teal text-background hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          {!samplerLoaded ? 'Loading...' : isPlaying ? '■ Stop' : '▶ Play'}
        </button>
      </div>

      {/* Style + BPM */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Style selector */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Style</p>
          <div className="relative inline-flex p-1 bg-muted rounded-lg">
            {(Object.keys(STYLE_LABELS) as BackingStyle[]).map(s => (
              <button
                key={s}
                onClick={() => handleSetStyle(s)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-md transition-colors z-10',
                  style === s
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {style === s && (
                  <motion.div
                    layoutId="backing-style"
                    className="absolute inset-0 bg-background rounded-md shadow-sm z-[-1]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {STYLE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* BPM control */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">BPM</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBpmChange(-5)}
              className="w-8 h-8 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground font-bold transition-colors"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-mono font-semibold tabular-nums">
              {bpm}
            </span>
            <button
              onClick={() => handleBpmChange(5)}
              className="w-8 h-8 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground font-bold transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Loop progression */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Loop (4 bars)</p>
        <div className="flex flex-wrap gap-3">
          {progressionIndices.map((chordIdx, slotIndex) => {
            const chord = chords[Math.min(chordIdx, chords.length - 1)]
            const isActive = isPlaying && currentBeat === slotIndex
            return (
              <div
                key={slotIndex}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg border transition-all',
                  isActive
                    ? 'bg-accent-orange/20 border-accent-orange text-accent-orange'
                    : 'bg-muted/30 border-border text-foreground'
                )}
              >
                <button
                  onClick={() => cycleSlotChord(slotIndex, -1)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs px-1"
                >
                  ‹
                </button>
                <div className="text-center min-w-[48px]">
                  <div className="text-sm font-bold">
                    {getChordLabel(chord)}
                  </div>
                </div>
                <button
                  onClick={() => cycleSlotChord(slotIndex, 1)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs px-1"
                >
                  ›
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Diatonic chords reference */}
      <div className="space-y-2 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">Diatonic Chords</p>
        <div className="flex flex-wrap gap-2">
          {chords.map((chord, i) => (
            <div
              key={i}
              className="px-3 py-1.5 rounded-md bg-muted/50 text-center"
            >
              <div className="text-xs font-semibold text-foreground">
                {getChordLabel(chord)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
