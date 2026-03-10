import { getNoteIndex } from './music-utils'

export type CAGEDShape = 'C' | 'A' | 'G' | 'E' | 'D'
export type CAGEDSelection = CAGEDShape | 'all'

export const CAGED_SHAPES: CAGEDShape[] = ['C', 'A', 'G', 'E', 'D']

/**
 * 각 CAGED 형태의 오픈 코드 기준 음 인덱스
 *
 * 오픈 코드에서 루트 위치:
 * - E shape: 루트 = 배레 프렛 (6번현, open E = 4)
 * - A shape: 루트 = 배레 프렛 (5번현, open A = 9)
 * - G shape: 루트 = 배레 + 3   (open G 코드에서 루트가 6번현 3프렛, G = 7)
 * - D shape: 루트 = 배레 프렛  (4번현, open D = 2)
 * - C shape: 루트 = 배레 + 3   (open C 코드에서 루트가 5번현 3프렛, C = 0)
 *
 * → 배레 프렛 = (rootIndex - BASE_NOTE + 12) % 12
 */
const SHAPE_BASE_NOTE: Record<CAGEDShape, number> = {
  E: 4, // E
  A: 9, // A
  G: 7, // G
  D: 2, // D
  C: 0, // C
}

export function getBarreFret(rootIndex: number, shape: CAGEDShape): number {
  return (rootIndex - SHAPE_BASE_NOTE[shape] + 12) % 12
}

function getSortedBarres(
  rootIndex: number
): { shape: CAGEDShape; barre: number }[] {
  return CAGED_SHAPES.map(shape => ({
    shape,
    barre: getBarreFret(rootIndex, shape),
  })).sort((a, b) => a.barre - b.barre)
}

// sorted 포지션 인덱스(0-4) → CAGED 레이블 순서
// 루트별 sorted 순서와 무관하게, 낮은 포지션부터 C→A→G→E→D를 부여
const POSITION_TO_LABEL: CAGEDShape[] = ['C', 'A', 'G', 'E', 'D']

// 레이블 → sorted 포지션 인덱스
const LABEL_TO_POSITION_IDX: Record<CAGEDShape, number> = {
  C: 0,
  A: 1,
  G: 2,
  E: 3,
  D: 4,
}

/**
 * All 뷰에서 각 프렛의 CAGED 형태를 결정 (버킷 방식 — 겹침 없음)
 *
 * 각 형태는 자신의 배레 프렛부터 다음 형태의 배레 프렛 직전까지 담당.
 * 레이블은 chord shape이 아닌 positional 순서로 부여: 낮은 포지션부터 C→A→G→E→D.
 *
 * 검증 (C 메이저): C[0,3) A[3,5) G[5,8) E[8,10) D[10,12) — 변화 없음
 * 검증 (Am): sorted A[0],G[2],E[5],D[7],C[9] → 레이블 C[0,3) A[2,5) G[5,8) E[7,10) D[9,12)
 */
export function getCAGEDShapeForFret(
  fret: number,
  rootNote: string
): CAGEDShape {
  const rootIndex = getNoteIndex(rootNote)
  const sorted = getSortedBarres(rootIndex)
  const f = fret % 12

  let positionIdx = sorted.length - 1 // 기본값: wrap-around 처리
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].barre <= f) positionIdx = i
    else break
  }
  return POSITION_TO_LABEL[positionIdx]
}

// Shape별 barre로부터의 low/high 오프셋
// Am 기준: A[0,3] G[2,5] E[5,8] D[7,10] C[9,12]
// C 메이저 기준: C[0,3] A[3,6] G[5,8] E[8,11] D[10,13]
const SHAPE_LOW_OFFSET: Record<CAGEDShape, number> = {
  C: 0,
  A: 0,
  G: 0,
  E: 0,
  D: 0,
}

const SHAPE_HIGH_OFFSET: Record<CAGEDShape, number> = {
  C: +1, // high = next_barre + 1 (C shape 마이너 패턴이 barre+4까지 이어짐, e.g. Am D pos fret 13)
  A: +1, // high = next_barre + 1
  G: 0, // high = next_barre
  E: +1, // high = next_barre + 1
  D: +1, // high = next_barre + 1
}

/**
 * 단일 Shape 선택 시 프렛이 해당 Shape 범위에 속하는지 확인
 *
 * Am 기준: A[0,3] G[2,5] E[5,8] D[7,10] C[9,12]
 * C 메이저 기준: C[0,3] A[3,6] G[5,8] E[8,11] D[10,13]
 * 인접 shape 간 겹침 (CAGED shared notes — 정상)
 */
export function isInCAGEDShapeRange(
  fret: number,
  rootNote: string,
  shape: CAGEDShape
): boolean {
  const rootIndex = getNoteIndex(rootNote)
  const sorted = getSortedBarres(rootIndex)

  // 레이블(C/A/G/E/D) → sorted 포지션 인덱스 (chord shape이 아닌 위치 기반)
  const positionIdx = LABEL_TO_POSITION_IDX[shape]
  const nextIdx = (positionIdx + 1) % sorted.length

  const shapeEntry = sorted[positionIdx]
  const chordShape = shapeEntry.shape // 실제 chord shape (SHAPE_HIGH_OFFSET 조회용)

  const low = shapeEntry.barre + SHAPE_LOW_OFFSET[chordShape]
  const highBase = sorted[nextIdx].barre + SHAPE_HIGH_OFFSET[chordShape]
  // highBase가 low 이하면 옥타브 wrap (예: D 포지션의 next가 wrap-around될 때)
  const high = highBase <= low ? highBase + 12 : highBase

  // 옥타브 정규화: fret 자체와 옥타브 등가(fret % 12, fret % 12 + 12) 둘 다 체크
  // fret >= 12 가드: fret 0-11은 1st octave이므로 두 번째 조건(+12) 적용 안 함
  // 미적용 시 예: Am D pos [9,13]에서 fret 0 → f+12=12 ∈ [9,13] 으로 잘못 포함됨
  const f = fret % 12
  return (f >= low && f <= high) || (fret >= 12 && f + 12 >= low && f + 12 <= high)
}
