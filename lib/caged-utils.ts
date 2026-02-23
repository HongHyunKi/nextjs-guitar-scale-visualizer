import { ScaleType } from './music-utils'

export type CAGEDShape = 'C' | 'A' | 'G' | 'E' | 'D'
export type CAGEDSelection = CAGEDShape | 'all'

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function getNoteIndex(note: string): number {
  const normalizedNote = note.replace('b', '#')
  const flatToSharp: Record<string, string> = {
    Db: 'C#',
    Eb: 'D#',
    Gb: 'F#',
    Ab: 'G#',
    Bb: 'A#',
  }
  const sharpNote = flatToSharp[note] || note
  return NOTES.indexOf(sharpNote)
}

// CAGED 형태별 기준점 (6번현에서의 루트 위치를 기준으로 한 오프셋)
// E shape: 오픈 코드 기준, 6번현 루트
// D shape: 6번현 루트에서 +2 프렛
// C shape: 6번현 루트에서 +3 프렛
// A shape: 6번현 루트에서 +5 프렛
// G shape: 6번현 루트에서 +7 프렛
const CAGED_ROOT_OFFSETS: Record<CAGEDShape, number> = {
  E: 0,
  D: 2,
  C: 3,
  A: 5,
  G: 7,
}

// 각 CAGED 형태별 스케일 패턴 정의
// [줄 인덱스(0=고음E, 5=저음E), 프렛 오프셋] 형태로 정의
// 메이저 스케일 CAGED 패턴 (루트 기준 상대적 위치)
const MAJOR_SCALE_PATTERNS: Record<CAGEDShape, [number, number][]> = {
  E: [
    // E shape (0-3 프렛 범위)
    [5, 0], [5, 2], [5, 3],  // 저음 E현
    [4, 0], [4, 2], [4, 3],  // A현
    [3, 0], [3, 2],          // D현
    [2, 0], [2, 2],          // G현
    [1, 0], [1, 2], [1, 3],  // B현
    [0, 0], [0, 2], [0, 3],  // 고음 E현
  ],
  D: [
    // D shape (2-5 프렛 범위)
    [5, 2], [5, 3], [5, 5],
    [4, 2], [4, 3], [4, 5],
    [3, 2], [3, 4], [3, 5],
    [2, 2], [2, 4], [2, 5],
    [1, 3], [1, 5],
    [0, 2], [0, 3], [0, 5],
  ],
  C: [
    // C shape (3-6 프렛 범위)
    [5, 3], [5, 5],
    [4, 3], [4, 5], [4, 7],
    [3, 4], [3, 5], [3, 7],
    [2, 5], [2, 7],
    [1, 5], [1, 6], [1, 8],
    [0, 5], [0, 7], [0, 8],
  ],
  A: [
    // A shape (5-8 프렛 범위)
    [5, 5], [5, 7], [5, 8],
    [4, 5], [4, 7],
    [3, 5], [3, 7],
    [2, 5], [2, 7], [2, 9],
    [1, 5], [1, 7], [1, 8],
    [0, 5], [0, 7], [0, 8],
  ],
  G: [
    // G shape (7-10 프렛 범위)
    [5, 7], [5, 8], [5, 10],
    [4, 7], [4, 9], [4, 10],
    [3, 7], [3, 9], [3, 10],
    [2, 7], [2, 9],
    [1, 8], [1, 10],
    [0, 7], [0, 8], [0, 10],
  ],
}

// 마이너 스케일 CAGED 패턴 (3도가 반음 내려감)
const MINOR_SCALE_PATTERNS: Record<CAGEDShape, [number, number][]> = {
  E: [
    [5, 0], [5, 2], [5, 3],
    [4, 0], [4, 2], [4, 3],
    [3, 0], [3, 2],
    [2, 0], [2, 1],          // G현 3도가 반음 내려감
    [1, 0], [1, 1], [1, 3],  // B현 3도가 반음 내려감
    [0, 0], [0, 2], [0, 3],
  ],
  D: [
    [5, 2], [5, 3], [5, 5],
    [4, 2], [4, 3], [4, 5],
    [3, 2], [3, 4], [3, 5],
    [2, 2], [2, 3], [2, 5],  // 마이너 조정
    [1, 3], [1, 5],
    [0, 2], [0, 3], [0, 5],
  ],
  C: [
    [5, 3], [5, 5],
    [4, 3], [4, 5], [4, 6],  // 마이너 조정
    [3, 4], [3, 5], [3, 7],
    [2, 5], [2, 6],          // 마이너 조정
    [1, 5], [1, 6], [1, 8],
    [0, 5], [0, 6], [0, 8],  // 마이너 조정
  ],
  A: [
    [5, 5], [5, 7], [5, 8],
    [4, 5], [4, 7],
    [3, 5], [3, 7],
    [2, 5], [2, 6], [2, 8],  // 마이너 조정
    [1, 5], [1, 6], [1, 8],  // 마이너 조정
    [0, 5], [0, 7], [0, 8],
  ],
  G: [
    [5, 7], [5, 8], [5, 10],
    [4, 7], [4, 9], [4, 10],
    [3, 7], [3, 9], [3, 10],
    [2, 7], [2, 8],          // 마이너 조정
    [1, 8], [1, 10],
    [0, 7], [0, 8], [0, 10],
  ],
}

// 메이저 펜타토닉 CAGED 패턴 (1, 2, 3, 5, 6 도)
const MAJOR_PENTATONIC_PATTERNS: Record<CAGEDShape, [number, number][]> = {
  E: [
    [5, 0], [5, 2],
    [4, 0], [4, 2],
    [3, -1], [3, 2],
    [2, -1], [2, 2],
    [1, 0], [1, 2],
    [0, 0], [0, 2],
  ],
  D: [
    [5, 2], [5, 4],
    [4, 2], [4, 4],
    [3, 2], [3, 4],
    [2, 2], [2, 4],
    [1, 2], [1, 5],
    [0, 2], [0, 5],
  ],
  C: [
    [5, 4], [5, 7],
    [4, 4], [4, 7],
    [3, 4], [3, 7],
    [2, 5], [2, 7],
    [1, 5], [1, 7],
    [0, 5], [0, 7],
  ],
  A: [
    [5, 5], [5, 7],
    [4, 5], [4, 7],
    [3, 4], [3, 7],
    [2, 4], [2, 7],
    [1, 5], [1, 8],
    [0, 5], [0, 7],
  ],
  G: [
    [5, 7], [5, 10],
    [4, 7], [4, 9],
    [3, 7], [3, 9],
    [2, 7], [2, 9],
    [1, 7], [1, 10],
    [0, 7], [0, 10],
  ],
}

// 마이너 펜타토닉 CAGED 패턴 (1, b3, 4, 5, b7 도)
const MINOR_PENTATONIC_PATTERNS: Record<CAGEDShape, [number, number][]> = {
  E: [
    [5, 0], [5, 3],
    [4, 0], [4, 2],
    [3, 0], [3, 2],
    [2, 0], [2, 2],
    [1, 0], [1, 3],
    [0, 0], [0, 3],
  ],
  D: [
    [5, 3], [5, 5],
    [4, 2], [4, 5],
    [3, 2], [3, 5],
    [2, 2], [2, 5],
    [1, 3], [1, 5],
    [0, 3], [0, 5],
  ],
  C: [
    [5, 5], [5, 8],
    [4, 5], [4, 7],
    [3, 5], [3, 7],
    [2, 5], [2, 7],
    [1, 5], [1, 8],
    [0, 5], [0, 8],
  ],
  A: [
    [5, 5], [5, 8],
    [4, 5], [4, 7],
    [3, 5], [3, 7],
    [2, 5], [2, 8],
    [1, 5], [1, 8],
    [0, 5], [0, 8],
  ],
  G: [
    [5, 8], [5, 10],
    [4, 7], [4, 10],
    [3, 7], [3, 10],
    [2, 8], [2, 10],
    [1, 8], [1, 10],
    [0, 8], [0, 10],
  ],
}

function getPatternForScaleType(
  scaleType: ScaleType
): Record<CAGEDShape, [number, number][]> {
  switch (scaleType) {
    case 'major':
      return MAJOR_SCALE_PATTERNS
    case 'minor':
      return MINOR_SCALE_PATTERNS
    case 'major-pentatonic':
      return MAJOR_PENTATONIC_PATTERNS
    case 'minor-pentatonic':
      return MINOR_PENTATONIC_PATTERNS
    default:
      return MAJOR_SCALE_PATTERNS
  }
}

/**
 * 특정 프렛 위치가 CAGED 패턴에 포함되는지 확인
 */
export function isInCAGEDPattern(
  stringIndex: number, // 0 = 고음 E, 5 = 저음 E
  fret: number,
  rootNote: string,
  shape: CAGEDShape,
  scaleType: ScaleType
): boolean {
  const rootIndex = getNoteIndex(rootNote)
  const patterns = getPatternForScaleType(scaleType)
  const pattern = patterns[shape]

  // E 형태 기준으로 루트 위치 계산 (저음 E현의 루트 프렛)
  const baseRootFret = rootIndex === 0 ? 12 : rootIndex

  for (const [patternString, patternFretOffset] of pattern) {
    if (patternString !== stringIndex) continue

    // 패턴 프렛 = 기준 루트 프렛 + 패턴 오프셋
    const patternFret = baseRootFret + patternFretOffset

    // 옥타브 범위 내에서 확인 (0-12, 12-24 프렛 등)
    if (
      fret === patternFret ||
      fret === patternFret - 12 ||
      fret === patternFret + 12
    ) {
      return true
    }
  }

  return false
}

/**
 * 특정 프렛 위치가 어떤 CAGED 형태에 속하는지 반환
 * 여러 형태에 속할 수 있으므로 첫 번째 일치 형태 반환
 */
export function getCAGEDShapeForPosition(
  stringIndex: number,
  fret: number,
  rootNote: string,
  scaleType: ScaleType
): CAGEDShape | null {
  const shapes: CAGEDShape[] = ['C', 'A', 'G', 'E', 'D']

  for (const shape of shapes) {
    if (isInCAGEDPattern(stringIndex, fret, rootNote, shape, scaleType)) {
      return shape
    }
  }

  return null
}

/**
 * 모든 CAGED 형태에 대한 프렛 위치 정보 반환
 */
export function getAllCAGEDPositions(
  rootNote: string,
  scaleType: ScaleType,
  maxFrets: number = 22
): Map<string, CAGEDShape[]> {
  const positions = new Map<string, CAGEDShape[]>()
  const shapes: CAGEDShape[] = ['C', 'A', 'G', 'E', 'D']

  for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
    for (let fret = 1; fret <= maxFrets; fret++) {
      const key = `${stringIndex}-${fret}`
      const matchingShapes: CAGEDShape[] = []

      for (const shape of shapes) {
        if (isInCAGEDPattern(stringIndex, fret, rootNote, shape, scaleType)) {
          matchingShapes.push(shape)
        }
      }

      if (matchingShapes.length > 0) {
        positions.set(key, matchingShapes)
      }
    }
  }

  return positions
}

// CAGED 형태별 색상
export const CAGED_COLORS: Record<CAGEDShape, string> = {
  C: 'caged-c',
  A: 'caged-a',
  G: 'caged-g',
  E: 'caged-e',
  D: 'caged-d',
}
