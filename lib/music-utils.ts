// Notation type
export type NotationType = 'alphabetical' | 'syllabic' | 'intervals'

// Note to solfege mapping (movable do - relative to root)
const SOLFEGE_MAP: Record<number, string> = {
  0: '도',
  1: '도#',
  2: '레',
  3: '레#',
  4: '미',
  5: '파',
  6: '파#',
  7: '솔',
  8: '솔#',
  9: '라',
  10: '라#',
  11: '시',
}

// Fixed solfege mapping (absolute - C is always Do)
const FIXED_SOLFEGE_MAP: Record<string, string> = {
  C: '도',
  'C#': '도#',
  Db: '레♭',
  D: '레',
  'D#': '레#',
  Eb: '미♭',
  E: '미',
  F: '파',
  'F#': '파#',
  Gb: '솔♭',
  G: '솔',
  'G#': '솔#',
  Ab: '라♭',
  A: '라',
  'A#': '라#',
  Bb: '시♭',
  B: '시',
}

// Interval notation mapping (scale degrees)
const INTERVAL_MAP: Record<number, string> = {
  0: '1',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3',
  5: '4',
  6: 'b5',
  7: '5',
  8: 'b6',
  9: '6',
  10: 'b7',
  11: '7',
}

// Scale type definition
export type ScaleType = 'major' | 'minor' | 'major-pentatonic' | 'minor-pentatonic'

// Scale type labels
export const SCALE_LABELS: Record<ScaleType, string> = {
  'major': 'Major Scale',
  'minor': 'Minor Scale',
  'major-pentatonic': 'Major Pentatonic',
  'minor-pentatonic': 'Minor Pentatonic',
}

// All notes in chromatic order (sharp notation) — canonical reference
export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Flat-to-sharp enharmonic mapping
const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#',
}

// All notes in chromatic order (sharp notation)
const NOTES_SHARP = CHROMATIC_NOTES

// All notes in chromatic order (flat notation)
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

// Major scale intervals (W-W-H-W-W-W-H) - 1, 2, 3, 4, 5, 6, 7
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11]

// Natural Minor scale intervals (W-H-W-W-H-W-W) - 1, 2, b3, 4, 5, b6, b7
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10]

// Major Pentatonic scale intervals - 1, 2, 3, 5, 6
const MAJOR_PENTATONIC_INTERVALS = [0, 2, 4, 7, 9]

// Minor Pentatonic scale intervals - 1, b3, 4, 5, b7
const MINOR_PENTATONIC_INTERVALS = [0, 3, 5, 7, 10]

export function getNoteIndex(note: string): number {
  const sharp = FLAT_TO_SHARP[note] ?? note
  return CHROMATIC_NOTES.indexOf(sharp)
}

export function noteToSolfege(note: string, rootNote: string): string {
  const noteIndex = getNoteIndex(note)
  const rootIndex = getNoteIndex(rootNote)
  const interval = (noteIndex - rootIndex + 12) % 12
  return SOLFEGE_MAP[interval] || note
}

export function noteToFixedSolfege(note: string): string {
  return FIXED_SOLFEGE_MAP[note] || note
}

export function noteToInterval(note: string, rootNote: string): string {
  const noteIndex = getNoteIndex(note)
  const rootIndex = getNoteIndex(rootNote)
  const interval = (noteIndex - rootIndex + 12) % 12
  return INTERVAL_MAP[interval] || note
}

export function getScaleNotes(
  rootNote: string,
  scaleType: ScaleType
): string[] {
  const rootIndex = getNoteIndex(rootNote)

  let intervals: number[]
  let notesArray: string[]

  switch (scaleType) {
    case 'major':
      intervals = MAJOR_INTERVALS
      notesArray = NOTES_SHARP
      break
    case 'minor':
      intervals = MINOR_INTERVALS
      notesArray = NOTES_FLAT
      break
    case 'major-pentatonic':
      intervals = MAJOR_PENTATONIC_INTERVALS
      notesArray = NOTES_SHARP
      break
    case 'minor-pentatonic':
      intervals = MINOR_PENTATONIC_INTERVALS
      notesArray = NOTES_FLAT
      break
    default:
      intervals = MAJOR_INTERVALS
      notesArray = NOTES_SHARP
  }

  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12
    return notesArray[noteIndex]
  })
}

export function getNoteFromFret(
  openString: string,
  fret: number,
  useFlat: boolean = false
): string {
  const startIndex = getNoteIndex(openString)
  const noteIndex = (startIndex + fret) % 12
  const notesArray = useFlat ? NOTES_FLAT : NOTES_SHARP
  return notesArray[noteIndex]
}
