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
  // Am: A[0,3] G[2,5] E[5,8] D[7,10] C[9,12]

  describe('A shape [0, 3]', () => {
    it('fret 0 is IN range', () =>
      expect(isInCAGEDShapeRange(0, 'A', 'A')).toBe(true))
    it('fret 3 is IN range', () =>
      expect(isInCAGEDShapeRange(3, 'A', 'A')).toBe(true))
    it('fret 4 is NOT in range', () =>
      expect(isInCAGEDShapeRange(4, 'A', 'A')).toBe(false))
  })

  describe('G shape [2, 5]', () => {
    it('fret 2 is IN range', () =>
      expect(isInCAGEDShapeRange(2, 'A', 'G')).toBe(true))
    it('fret 5 is IN range', () =>
      expect(isInCAGEDShapeRange(5, 'A', 'G')).toBe(true))
    it('fret 1 is NOT in range', () =>
      expect(isInCAGEDShapeRange(1, 'A', 'G')).toBe(false))
    it('fret 6 is NOT in range', () =>
      expect(isInCAGEDShapeRange(6, 'A', 'G')).toBe(false))
  })

  describe('E shape [5, 8]', () => {
    it('fret 5 is IN range', () =>
      expect(isInCAGEDShapeRange(5, 'A', 'E')).toBe(true))
    it('fret 8 is IN range', () =>
      expect(isInCAGEDShapeRange(8, 'A', 'E')).toBe(true))
    it('fret 4 is NOT in range', () =>
      expect(isInCAGEDShapeRange(4, 'A', 'E')).toBe(false))
    it('fret 9 is NOT in range', () =>
      expect(isInCAGEDShapeRange(9, 'A', 'E')).toBe(false))
  })

  describe('D shape [7, 10]', () => {
    it('fret 7 is IN range', () =>
      expect(isInCAGEDShapeRange(7, 'A', 'D')).toBe(true))
    it('fret 10 is IN range', () =>
      expect(isInCAGEDShapeRange(10, 'A', 'D')).toBe(true))
    it('fret 6 is NOT in range', () =>
      expect(isInCAGEDShapeRange(6, 'A', 'D')).toBe(false))
    it('fret 11 is NOT in range', () =>
      expect(isInCAGEDShapeRange(11, 'A', 'D')).toBe(false))
  })

  describe('C shape [9, 12]', () => {
    it('fret 9 is IN range', () =>
      expect(isInCAGEDShapeRange(9, 'A', 'C')).toBe(true))
    it('fret 12 is IN range', () =>
      expect(isInCAGEDShapeRange(12, 'A', 'C')).toBe(true))
    it('fret 8 is NOT in range', () =>
      expect(isInCAGEDShapeRange(8, 'A', 'C')).toBe(false))
    it('fret 13 is NOT in range', () =>
      expect(isInCAGEDShapeRange(13, 'A', 'C')).toBe(false))
  })
})

describe('isInCAGEDShapeRange — C major reference positions', () => {
  // C major: C[0,3] A[3,6] G[5,8] E[8,11] D[10,13]

  it('C shape covers frets 0-3', () => {
    expect(isInCAGEDShapeRange(0, 'C', 'C')).toBe(true)
    expect(isInCAGEDShapeRange(3, 'C', 'C')).toBe(true)
    expect(isInCAGEDShapeRange(4, 'C', 'C')).toBe(false)
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
  it('Am A shape at fret 0 (open position, not fret 12)', () => {
    expect(isInCAGEDShapeRange(0, 'A', 'A')).toBe(true)
    expect(isInCAGEDShapeRange(12, 'A', 'A')).toBe(false)
  })

  it('frets beyond 12 handled without wrapping mod', () => {
    // C major D shape [10,13] — fret 13 is valid
    expect(isInCAGEDShapeRange(13, 'C', 'D')).toBe(true)
    expect(isInCAGEDShapeRange(14, 'C', 'D')).toBe(false)
  })
})
