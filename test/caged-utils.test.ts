import { getNoteIndex } from '@/lib/music-utils'
import { getBarreFret, isInCAGEDShapeRange } from '@/lib/caged-utils'

// ─── getBarreFret ─────────────────────────────────────────────────────────────

describe('getBarreFret', () => {
  it('C major: C[0] A[3] G[5] E[8] D[10]', () => {
    const root = getNoteIndex('C')
    expect(getBarreFret(root, 'C')).toBe(0)
    expect(getBarreFret(root, 'A')).toBe(3)
    expect(getBarreFret(root, 'G')).toBe(5)
    expect(getBarreFret(root, 'E')).toBe(8)
    expect(getBarreFret(root, 'D')).toBe(10)
  })

  it('Am (A): A[0] G[2] E[5] D[7] C[9]', () => {
    const root = getNoteIndex('A')
    expect(getBarreFret(root, 'A')).toBe(0)
    expect(getBarreFret(root, 'G')).toBe(2)
    expect(getBarreFret(root, 'E')).toBe(5)
    expect(getBarreFret(root, 'D')).toBe(7)
    expect(getBarreFret(root, 'C')).toBe(9)
  })

  it('G major: G[0] E[3] D[5] C[7] A[10]', () => {
    const root = getNoteIndex('G')
    expect(getBarreFret(root, 'G')).toBe(0)
    expect(getBarreFret(root, 'E')).toBe(3)
    expect(getBarreFret(root, 'D')).toBe(5)
    expect(getBarreFret(root, 'C')).toBe(7)
    expect(getBarreFret(root, 'A')).toBe(10)
  })

  it('E shape barre matches (rootIndex - 4 + 12) % 12 for all 12 roots', () => {
    const roots = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ]
    roots.forEach(r => {
      const idx = getNoteIndex(r)
      const expected = (idx - 4 + 12) % 12
      expect(getBarreFret(idx, 'E')).toBe(expected)
    })
  })
})

// ─── isInCAGEDShapeRange ──────────────────────────────────────────────────────

describe('isInCAGEDShapeRange — Am pentatonic reference positions', () => {
  // Am sorted barres: A[0], G[2], E[5], D[7], C[9]
  // Positional labels: C[0,3] A[2,5] G[5,8] E[7,10] D[9,12]

  describe('C shape [0, 3]', () => {
    it('fret 0 is IN range', () =>
      expect(isInCAGEDShapeRange(0, 'A', 'C')).toBe(true))
    it('fret 3 is IN range', () =>
      expect(isInCAGEDShapeRange(3, 'A', 'C')).toBe(true))
    it('fret 4 is NOT in range', () =>
      expect(isInCAGEDShapeRange(4, 'A', 'C')).toBe(false))
  })

  describe('A shape [2, 5]', () => {
    it('fret 2 is IN range', () =>
      expect(isInCAGEDShapeRange(2, 'A', 'A')).toBe(true))
    it('fret 5 is IN range', () =>
      expect(isInCAGEDShapeRange(5, 'A', 'A')).toBe(true))
    it('fret 1 is NOT in range', () =>
      expect(isInCAGEDShapeRange(1, 'A', 'A')).toBe(false))
    it('fret 6 is NOT in range', () =>
      expect(isInCAGEDShapeRange(6, 'A', 'A')).toBe(false))
  })

  describe('G shape [5, 8]', () => {
    it('fret 5 is IN range', () =>
      expect(isInCAGEDShapeRange(5, 'A', 'G')).toBe(true))
    it('fret 8 is IN range', () =>
      expect(isInCAGEDShapeRange(8, 'A', 'G')).toBe(true))
    it('fret 4 is NOT in range', () =>
      expect(isInCAGEDShapeRange(4, 'A', 'G')).toBe(false))
    it('fret 9 is NOT in range', () =>
      expect(isInCAGEDShapeRange(9, 'A', 'G')).toBe(false))
  })

  describe('E shape [7, 10]', () => {
    it('fret 7 is IN range', () =>
      expect(isInCAGEDShapeRange(7, 'A', 'E')).toBe(true))
    it('fret 10 is IN range', () =>
      expect(isInCAGEDShapeRange(10, 'A', 'E')).toBe(true))
    it('fret 6 is NOT in range', () =>
      expect(isInCAGEDShapeRange(6, 'A', 'E')).toBe(false))
    it('fret 11 is NOT in range', () =>
      expect(isInCAGEDShapeRange(11, 'A', 'E')).toBe(false))
  })

  describe('D shape [9, 13]', () => {
    it('fret 9 is IN range', () =>
      expect(isInCAGEDShapeRange(9, 'A', 'D')).toBe(true))
    it('fret 12 is IN range', () =>
      expect(isInCAGEDShapeRange(12, 'A', 'D')).toBe(true))
    it('fret 13 is IN range (B string C note — top of C chord shape pattern)', () =>
      expect(isInCAGEDShapeRange(13, 'A', 'D')).toBe(true))
    it('fret 8 is NOT in range', () =>
      expect(isInCAGEDShapeRange(8, 'A', 'D')).toBe(false))
    it('fret 14 is NOT in range', () =>
      expect(isInCAGEDShapeRange(14, 'A', 'D')).toBe(false))
    it('fret 0 is NOT in range (open strings must not bleed into wrap-around D pos)', () =>
      expect(isInCAGEDShapeRange(0, 'A', 'D')).toBe(false))
    it('fret 1 is NOT in range', () =>
      expect(isInCAGEDShapeRange(1, 'A', 'D')).toBe(false))
  })
})

describe('isInCAGEDShapeRange — C major reference positions', () => {
  // C major: C[0,4] A[3,6] G[5,8] E[8,11] D[10,13]
  // Note: C shape extends to fret 4 (C chord shape span = next_barre + 1)
  // fret 4 has no C major pentatonic note so no visual effect, but zone boundary is at 4.

  it('C shape covers frets 0-4', () => {
    expect(isInCAGEDShapeRange(0, 'C', 'C')).toBe(true)
    expect(isInCAGEDShapeRange(3, 'C', 'C')).toBe(true)
    expect(isInCAGEDShapeRange(4, 'C', 'C')).toBe(true)
    expect(isInCAGEDShapeRange(5, 'C', 'C')).toBe(false)
  })

  it('A shape covers frets 3-6', () => {
    expect(isInCAGEDShapeRange(3, 'C', 'A')).toBe(true)
    expect(isInCAGEDShapeRange(6, 'C', 'A')).toBe(true)
    expect(isInCAGEDShapeRange(2, 'C', 'A')).toBe(false)
    expect(isInCAGEDShapeRange(7, 'C', 'A')).toBe(false)
  })

  it('G shape covers frets 5-8', () => {
    expect(isInCAGEDShapeRange(5, 'C', 'G')).toBe(true)
    expect(isInCAGEDShapeRange(8, 'C', 'G')).toBe(true)
    expect(isInCAGEDShapeRange(4, 'C', 'G')).toBe(false)
    expect(isInCAGEDShapeRange(9, 'C', 'G')).toBe(false)
  })

  it('E shape covers frets 8-11 (root at 6th string fret 8)', () => {
    expect(isInCAGEDShapeRange(8, 'C', 'E')).toBe(true)
    expect(isInCAGEDShapeRange(11, 'C', 'E')).toBe(true)
    expect(isInCAGEDShapeRange(7, 'C', 'E')).toBe(false)
    expect(isInCAGEDShapeRange(12, 'C', 'E')).toBe(false)
  })

  it('D shape covers frets 10-13', () => {
    expect(isInCAGEDShapeRange(10, 'C', 'D')).toBe(true)
    expect(isInCAGEDShapeRange(13, 'C', 'D')).toBe(true)
    expect(isInCAGEDShapeRange(9, 'C', 'D')).toBe(false)
    expect(isInCAGEDShapeRange(14, 'C', 'D')).toBe(false)
  })
})

describe('isInCAGEDShapeRange — wrap-around edge cases', () => {
  it('Am C shape (pos 0): fret 0 (open) and fret 12 (2nd octave) both in range', () => {
    expect(isInCAGEDShapeRange(0, 'A', 'C')).toBe(true)
    // fret 12 = 2nd octave start of C shape (pos 0) — should be IN range
    expect(isInCAGEDShapeRange(12, 'A', 'C')).toBe(true)
  })

  it('frets beyond 12 handled without wrapping mod', () => {
    // C major D shape [10,13] — fret 13 is valid
    expect(isInCAGEDShapeRange(13, 'C', 'D')).toBe(true)
    expect(isInCAGEDShapeRange(14, 'C', 'D')).toBe(false)
  })

  it('1st octave frets (0-11) do NOT bleed into wrap-around positions (regression)', () => {
    // Bug: (f+12) condition was applied to fret 0-11, causing open strings
    // to be incorrectly included in high wrap-around positions.
    // Am D pos [9,13]: fret 0 → f=0, f+12=12 ∈ [9,13] was incorrectly true.
    expect(isInCAGEDShapeRange(0, 'A', 'D')).toBe(false) // open strings NOT in D pos
    expect(isInCAGEDShapeRange(1, 'A', 'D')).toBe(false)
    // C major D pos [10,13]
    expect(isInCAGEDShapeRange(0, 'C', 'D')).toBe(false)
    expect(isInCAGEDShapeRange(1, 'C', 'D')).toBe(false)
    // B minor D pos [11,15]: frets 0-3 were incorrectly true before fix
    expect(isInCAGEDShapeRange(0, 'B', 'D')).toBe(false)
    expect(isInCAGEDShapeRange(3, 'B', 'D')).toBe(false)
  })
})

// ─── Am pentatonic — full fretboard (frets 1-24) ─────────────────────────────

describe('Am pentatonic — frets 1-24 octave wrapping', () => {
  // Am sorted barres: A[0] G[2] E[5] D[7] C[9]
  // Positional labels: C[0,3] A[2,5] G[5,8] E[7,10] D[9,13]
  // 2nd octave: C[12,15] A[14,17] G[17,20] E[19,22] D[21,25]
  const root = 'A'

  describe('C shape [0,3] → 2nd octave [12,15]', () => {
    it.each([1, 2, 3])('fret %i ∈ C shape (1st octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'C')).toBe(true)
    )
    it.each([4, 5, 11])('fret %i ∉ C shape', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'C')).toBe(false)
    )
    it.each([12, 13, 14, 15])('fret %i ∈ C shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'C')).toBe(true)
    )
    it.each([16, 17])('fret %i ∉ C shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'C')).toBe(false)
    )
  })

  describe('A shape [2,5] → 2nd octave [14,17]', () => {
    it.each([2, 3, 4, 5])('fret %i ∈ A shape (1st octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'A')).toBe(true)
    )
    it.each([1, 6])('fret %i ∉ A shape', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'A')).toBe(false)
    )
    it.each([14, 15, 16, 17])('fret %i ∈ A shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'A')).toBe(true)
    )
    it.each([13, 18])('fret %i ∉ A shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'A')).toBe(false)
    )
  })

  describe('G shape [5,8] → 2nd octave [17,20]', () => {
    it.each([5, 6, 7, 8])('fret %i ∈ G shape (1st octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'G')).toBe(true)
    )
    it.each([4, 9])('fret %i ∉ G shape', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'G')).toBe(false)
    )
    it.each([17, 18, 19, 20])('fret %i ∈ G shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'G')).toBe(true)
    )
    it.each([16, 21])('fret %i ∉ G shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'G')).toBe(false)
    )
  })

  describe('E shape [7,10] → 2nd octave [19,22]', () => {
    it.each([7, 8, 9, 10])('fret %i ∈ E shape (1st octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'E')).toBe(true)
    )
    it.each([6, 11])('fret %i ∉ E shape', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'E')).toBe(false)
    )
    it.each([19, 20, 21, 22])('fret %i ∈ E shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'E')).toBe(true)
    )
    it.each([18, 23])('fret %i ∉ E shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'E')).toBe(false)
    )
  })

  describe('D shape [9,13] → 2nd octave [21,25]', () => {
    it.each([9, 10, 11, 12, 13])('fret %i ∈ D shape (1st octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'D')).toBe(true)
    )
    it.each([8, 14])('fret %i ∉ D shape', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'D')).toBe(false)
    )
    it.each([21, 22, 23, 24])('fret %i ∈ D shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'D')).toBe(true)
    )
    it.each([20])('fret %i ∉ D shape (2nd octave)', fret =>
      expect(isInCAGEDShapeRange(fret, root, 'D')).toBe(false)
    )
  })
})
