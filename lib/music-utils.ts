// Note to solfege mapping
const SOLFEGE_MAP: Record<number, string> = {
  0: "Do",
  1: "Di",
  2: "Re",
  3: "Ri",
  4: "Mi",
  5: "Fa",
  6: "Fi",
  7: "Sol",
  8: "Si",
  9: "La",
  10: "Li",
  11: "Ti",
}

// All notes in chromatic order
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Major scale intervals (W-W-H-W-W-W-H)
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11]

// Pentatonic scale intervals
const PENTATONIC_INTERVALS = [0, 2, 4, 7, 9]

export function getNoteIndex(note: string): number {
  return NOTES.indexOf(note)
}

export function noteToSolfege(note: string, rootNote: string): string {
  const noteIndex = getNoteIndex(note)
  const rootIndex = getNoteIndex(rootNote)
  const interval = (noteIndex - rootIndex + 12) % 12
  return SOLFEGE_MAP[interval] || note
}

export function getScaleNotes(rootNote: string, scaleType: "major" | "pentatonic"): string[] {
  const rootIndex = getNoteIndex(rootNote)
  const intervals = scaleType === "major" ? MAJOR_INTERVALS : PENTATONIC_INTERVALS

  return intervals.map((interval) => {
    const noteIndex = (rootIndex + interval) % 12
    return NOTES[noteIndex]
  })
}

export function getNoteFromFret(openString: string, fret: number): string {
  const startIndex = getNoteIndex(openString)
  const noteIndex = (startIndex + fret) % 12
  return NOTES[noteIndex]
}
