import {
  getNoteIndex,
  getNoteFromFret,
  getScaleNotes,
  isScaleFlat,
  CHROMATIC_NOTES,
  type ScaleType,
} from '@/lib/music-utils'

// ─── getNoteIndex ────────────────────────────────────────────────────────────

describe('getNoteIndex', () => {
  it('returns 0–11 for sharp notes', () => {
    const expected: [string, number][] = [
      ['C', 0],
      ['C#', 1],
      ['D', 2],
      ['D#', 3],
      ['E', 4],
      ['F', 5],
      ['F#', 6],
      ['G', 7],
      ['G#', 8],
      ['A', 9],
      ['A#', 10],
      ['B', 11],
    ]
    expected.forEach(([note, idx]) => {
      expect(getNoteIndex(note)).toBe(idx)
    })
  })

  it('resolves flat enharmonics to same index as sharps', () => {
    const pairs: [string, string][] = [
      ['Db', 'C#'],
      ['Eb', 'D#'],
      ['Gb', 'F#'],
      ['Ab', 'G#'],
      ['Bb', 'A#'],
    ]
    pairs.forEach(([flat, sharp]) => {
      expect(getNoteIndex(flat)).toBe(getNoteIndex(sharp))
    })
  })
})

// ─── getNoteFromFret ─────────────────────────────────────────────────────────

describe('getNoteFromFret', () => {
  // Standard tuning open strings: E4 B3 G3 D3 A2 E2
  it('6th string (E) fret 5 → A', () => {
    expect(getNoteFromFret('E', 5)).toBe('A')
  })

  it('6th string (E) fret 8 → C', () => {
    expect(getNoteFromFret('E', 8)).toBe('C')
  })

  it('5th string (A) fret 3 → C', () => {
    expect(getNoteFromFret('A', 3)).toBe('C')
  })

  it('fret 0 returns open string note', () => {
    expect(getNoteFromFret('E', 0)).toBe('E')
    expect(getNoteFromFret('B', 0)).toBe('B')
    expect(getNoteFromFret('G', 0)).toBe('G')
  })

  it('wraps around octave correctly (fret 12 = same as fret 0)', () => {
    expect(getNoteFromFret('E', 12)).toBe('E')
    expect(getNoteFromFret('A', 12)).toBe('A')
  })

  it('useFlat=true returns flat notation', () => {
    // E + 1 fret = F, no flat needed
    expect(getNoteFromFret('E', 1, true)).toBe('F')
    // E + 2 frets = F#/Gb
    expect(getNoteFromFret('E', 2, true)).toBe('Gb')
    expect(getNoteFromFret('E', 2, false)).toBe('F#')
  })
})

// ─── getScaleNotes ───────────────────────────────────────────────────────────

const ALL_ROOTS = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
]

const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  'major-pentatonic': [0, 2, 4, 7, 9],
  'minor-pentatonic': [0, 3, 5, 7, 10],
}

const SCALE_NOTE_COUNT: Record<ScaleType, number> = {
  major: 7,
  minor: 7,
  'major-pentatonic': 5,
  'minor-pentatonic': 5,
}

describe('getScaleNotes', () => {
  describe('note count', () => {
    const scaleTypes: ScaleType[] = [
      'major',
      'minor',
      'major-pentatonic',
      'minor-pentatonic',
    ]
    scaleTypes.forEach(scaleType => {
      it(`${scaleType} always returns ${SCALE_NOTE_COUNT[scaleType]} notes`, () => {
        ALL_ROOTS.forEach(root => {
          const notes = getScaleNotes(root, scaleType)
          expect(notes).toHaveLength(SCALE_NOTE_COUNT[scaleType])
        })
      })
    })
  })

  describe('root note is first element', () => {
    const scaleTypes: ScaleType[] = [
      'major',
      'minor',
      'major-pentatonic',
      'minor-pentatonic',
    ]
    scaleTypes.forEach(scaleType => {
      it(`${scaleType}: first note matches root`, () => {
        ALL_ROOTS.forEach(root => {
          const notes = getScaleNotes(root, scaleType)
          expect(notes[0]).toBe(root)
        })
      })
    })
  })

  describe('sharp/flat consistency (no mixing within a scale)', () => {
    const scaleTypes: ScaleType[] = [
      'major',
      'minor',
      'major-pentatonic',
      'minor-pentatonic',
    ]
    scaleTypes.forEach(scaleType => {
      it(`${scaleType}: no scale mixes sharps and flats`, () => {
        ALL_ROOTS.forEach(root => {
          const notes = getScaleNotes(root, scaleType)
          const hasSharp = notes.some(n => n.includes('#'))
          const hasFlat = notes.some(n => n.includes('b'))
          expect(hasSharp && hasFlat).toBe(false)
        })
      })
    })
  })

  describe('chromatic index correctness — all 12 roots × 4 scales', () => {
    const scaleTypes: ScaleType[] = [
      'major',
      'minor',
      'major-pentatonic',
      'minor-pentatonic',
    ]
    scaleTypes.forEach(scaleType => {
      it(`${scaleType}: all notes at correct chromatic index`, () => {
        ALL_ROOTS.forEach(root => {
          const rootIdx = getNoteIndex(root)
          const notes = getScaleNotes(root, scaleType)
          const intervals = SCALE_INTERVALS[scaleType]
          intervals.forEach((interval, i) => {
            const expectedIdx = (rootIdx + interval) % 12
            const actualIdx = getNoteIndex(notes[i])
            expect(actualIdx).toBe(expectedIdx)
          })
        })
      })
    })
  })

  describe('reference values from CLAUDE.md', () => {
    it('C major-pentatonic: C D E G A', () => {
      expect(getScaleNotes('C', 'major-pentatonic')).toEqual([
        'C',
        'D',
        'E',
        'G',
        'A',
      ])
    })

    it('C# major-pentatonic: C# D# F G# A#', () => {
      expect(getScaleNotes('C#', 'major-pentatonic')).toEqual([
        'C#',
        'D#',
        'F',
        'G#',
        'A#',
      ])
    })

    it('Db major-pentatonic: Db Eb F Ab Bb', () => {
      expect(getScaleNotes('Db', 'major-pentatonic')).toEqual([
        'Db',
        'Eb',
        'F',
        'Ab',
        'Bb',
      ])
    })

    it('D# minor-pentatonic: D# F# G# A# C# (known bug regression)', () => {
      expect(getScaleNotes('D#', 'minor-pentatonic')).toEqual([
        'D#',
        'F#',
        'G#',
        'A#',
        'C#',
      ])
    })

    it('C major: C D E F G A B', () => {
      expect(getScaleNotes('C', 'major')).toEqual([
        'C',
        'D',
        'E',
        'F',
        'G',
        'A',
        'B',
      ])
    })

    it('A minor: A B C D E F G', () => {
      expect(getScaleNotes('A', 'minor')).toEqual([
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
      ])
    })

    it('G major: G A B C D E F#', () => {
      expect(getScaleNotes('G', 'major')).toEqual([
        'G',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F#',
      ])
    })

    it('F major: F G A Bb C D E', () => {
      expect(getScaleNotes('F', 'major')).toEqual([
        'F',
        'G',
        'A',
        'Bb',
        'C',
        'D',
        'E',
      ])
    })

    it('Bb major: Bb C D Eb F G A', () => {
      expect(getScaleNotes('Bb', 'major')).toEqual([
        'Bb',
        'C',
        'D',
        'Eb',
        'F',
        'G',
        'A',
      ])
    })
  })

  describe('enharmonic pair equivalence', () => {
    const pairs: [string, string][] = [
      ['C#', 'Db'],
      ['D#', 'Eb'],
      ['F#', 'Gb'],
      ['G#', 'Ab'],
      ['A#', 'Bb'],
    ]
    const scaleTypes: ScaleType[] = [
      'major',
      'minor',
      'major-pentatonic',
      'minor-pentatonic',
    ]

    pairs.forEach(([sharp, flat]) => {
      scaleTypes.forEach(scaleType => {
        it(`${sharp} and ${flat} ${scaleType} are enharmonically equivalent`, () => {
          const sharpNotes = getScaleNotes(sharp, scaleType)
          const flatNotes = getScaleNotes(flat, scaleType)
          // Same chromatic content, different spelling
          expect(sharpNotes.map(getNoteIndex)).toEqual(
            flatNotes.map(getNoteIndex)
          )
          // Sharp root uses sharps, flat root uses flats
          expect(sharpNotes.every(n => !n.includes('b'))).toBe(true)
          expect(flatNotes.every(n => !n.includes('#'))).toBe(true)
        })
      })
    })
  })
})

// ─── isScaleFlat ─────────────────────────────────────────────────────────────

describe('isScaleFlat', () => {
  it('flat root → true', () => {
    expect(isScaleFlat('Bb', 'major')).toBe(true)
    expect(isScaleFlat('Eb', 'major')).toBe(true)
    expect(isScaleFlat('Ab', 'minor')).toBe(true)
  })

  it('sharp root → false', () => {
    expect(isScaleFlat('C#', 'major')).toBe(false)
    expect(isScaleFlat('F#', 'major')).toBe(false)
    expect(isScaleFlat('G#', 'minor-pentatonic')).toBe(false)
  })

  it('natural major: F → true, G → false', () => {
    expect(isScaleFlat('F', 'major')).toBe(true)
    expect(isScaleFlat('G', 'major')).toBe(false)
  })

  it('natural minor: D → true, E → false', () => {
    expect(isScaleFlat('D', 'minor')).toBe(true)
    expect(isScaleFlat('E', 'minor')).toBe(false)
  })

  it('natural minor: C → true (flat convention)', () => {
    expect(isScaleFlat('C', 'minor')).toBe(true)
  })

  it('natural major: C → false (no flats/sharps)', () => {
    expect(isScaleFlat('C', 'major')).toBe(false)
  })
})
