import {
  getScaleNotes,
  getNoteIndex,
  isScaleFlat,
  ScaleType,
  CHROMATIC_NOTES,
} from '@/lib/music-utils'

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'dominant7'
export type BackingStyle = 'rock' | 'blues' | 'jazz'

export interface Chord {
  root: string
  quality: ChordQuality
  numeral: string
  notes: string[]
  midiNotes: number[]
}

export interface DiatonicChords {
  chords: Chord[]
  scaleType: ScaleType
  rootNote: string
}

const CHORD_INTERVALS: Record<ChordQuality, number[]> = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  dominant7: [0, 4, 7, 10],
}

const MAJOR_DIATONIC_QUALITIES: ChordQuality[] = [
  'major',
  'minor',
  'minor',
  'major',
  'major',
  'minor',
  'diminished',
]
const MINOR_DIATONIC_QUALITIES: ChordQuality[] = [
  'minor',
  'diminished',
  'major',
  'minor',
  'minor',
  'major',
  'major',
]
const MAJOR_PENT_QUALITIES: ChordQuality[] = [
  'major',
  'minor',
  'minor',
  'major',
  'minor',
]
const MINOR_PENT_QUALITIES: ChordQuality[] = [
  'minor',
  'major',
  'minor',
  'minor',
  'major',
]

const MAJOR_NUMERALS = ['I', 'IIm', 'IIIm', 'IV', 'V', 'VIm', 'VIIdim']
const MINOR_NUMERALS = ['Im', 'IIdim', 'IIIb', 'IVm', 'Vm', 'VIb', 'VIIb']
const MAJOR_PENT_NUMERALS = ['I', 'IIm', 'IIIm', 'V', 'VIm']
const MINOR_PENT_NUMERALS = ['Im', 'IIIb', 'IVm', 'Vm', 'VIIb']

const NOTES_FLAT = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
]

export function noteToMidi(note: string, octave: number): number {
  return (octave + 1) * 12 + getNoteIndex(note)
}

function buildChordNotes(
  root: string,
  quality: ChordQuality,
  useFlat: boolean
): string[] {
  const rootIdx = getNoteIndex(root)
  const ref = useFlat ? NOTES_FLAT : CHROMATIC_NOTES
  return CHORD_INTERVALS[quality].map(
    interval => ref[(rootIdx + interval) % 12]
  )
}

function buildMidiNotes(notes: string[]): number[] {
  const result: number[] = []
  let prevMidi = -1
  for (const note of notes) {
    let midi = noteToMidi(note, 3)
    while (midi <= prevMidi) midi += 12
    result.push(midi)
    prevMidi = midi
  }
  return result
}

export function getDiatonicChords(
  rootNote: string,
  scaleType: ScaleType
): DiatonicChords {
  const scaleNotes = getScaleNotes(rootNote, scaleType)
  const useFlat = isScaleFlat(rootNote, scaleType)

  let qualities: ChordQuality[]
  let numerals: string[]

  switch (scaleType) {
    case 'major':
      qualities = MAJOR_DIATONIC_QUALITIES
      numerals = MAJOR_NUMERALS
      break
    case 'minor':
      qualities = MINOR_DIATONIC_QUALITIES
      numerals = MINOR_NUMERALS
      break
    case 'major-pentatonic':
      qualities = MAJOR_PENT_QUALITIES
      numerals = MAJOR_PENT_NUMERALS
      break
    case 'minor-pentatonic':
    default:
      qualities = MINOR_PENT_QUALITIES
      numerals = MINOR_PENT_NUMERALS
      break
  }

  const chords: Chord[] = scaleNotes.map((note, i) => {
    const quality = qualities[i]
    const notes = buildChordNotes(note, quality, useFlat)
    return {
      root: note,
      quality,
      numeral: numerals[i],
      notes,
      midiNotes: buildMidiNotes(notes),
    }
  })

  return { chords, scaleType, rootNote }
}

export function getChordLabel(chord: Chord): string {
  const suffix: Record<ChordQuality, string> = {
    major: 'maj',
    minor: 'm',
    diminished: 'dim',
    dominant7: '7',
  }
  return `${chord.root}${suffix[chord.quality]}`
}

export function getStyleProgression(
  style: BackingStyle,
  scaleType: ScaleType
): number[] {
  const isPent =
    scaleType === 'major-pentatonic' || scaleType === 'minor-pentatonic'
  const isMinor = scaleType === 'minor' || scaleType === 'minor-pentatonic'

  if (isPent) {
    return isMinor
      ? [0, 2, 3, 4] // Im - IIIb - IVm - Vm
      : [0, 3, 4, 3] // I - V - VIm - V
  }

  if (isMinor) {
    switch (style) {
      case 'rock':
        return [0, 5, 6, 4] // Im - VIb - VIIb - Vm
      case 'blues':
        return [0, 3, 0, 4] // Im - IVm - Im - Vm
      case 'jazz':
        return [1, 4, 0, 5] // IIdim - Vm - Im - VIb
    }
  } else {
    switch (style) {
      case 'rock':
        return [0, 4, 5, 3] // I - V - VIm - IV
      case 'blues':
        return [0, 3, 0, 4] // I - IV - I - V
      case 'jazz':
        return [1, 4, 0, 5] // IIm - V - I - VIm
    }
  }
}
