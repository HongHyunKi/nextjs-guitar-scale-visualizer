import { getNoteIndex } from './music-utils'

export type CAGEDShape = 'C' | 'A' | 'G' | 'E' | 'D'
export type CAGEDSelection = CAGEDShape | 'all'

export const CAGED_SHAPES: CAGEDShape[] = ['C', 'A', 'G', 'E', 'D']

/**
 * 각 CAGED 형태의 오픈 코드 기준 음 인덱스
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

/**
 * All 뷰에서 각 프렛의 CAGED 형태를 결정 (버킷 방식 — 겹침 없음)
 *
 * 셰이프는 정렬 인덱스가 아닌 chord identity로 반환한다 (spec 3.3).
 * 검증 (Am): sorted A[0],G[2],E[5],D[7],C[9] → A/G/E/D/C 순서로 레이블
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
  return sorted[positionIdx].shape
}

const SHAPE_HIGH_OFFSET: Record<CAGEDShape, number> = {
  C: +1, // high = next_barre + 1
  A: +1, // high = next_barre + 1
  G: 0, // high = next_barre
  E: +1, // high = next_barre + 1
  D: +1, // high = next_barre + 1
}

/**
 * 단일 Shape 선택 시 프렛이 해당 Shape 범위에 속하는지 확인
 *
 * 셰이프는 chord identity로 검색한다 — 정렬 인덱스 절대 사용 금지 (spec).
 *
 * CAGED 셰이프 범위는 major/minor 동일: G-form A코드와 G-form Am코드는 모두 fret 2.
 * 범위 내에서 어떤 음이 켜지는지는 getScaleNotes(root, scaleType)가 결정한다.
 *
 * Am / A major 기준 (동일): A[0,3] G[2,5] E[5,8] D[7,10] C[9,13]
 */
export function isInCAGEDShapeRange(
  fret: number,
  rootNote: string,
  shape: CAGEDShape
): boolean {
  const rootIndex = getNoteIndex(rootNote)
  const sorted = getSortedBarres(rootIndex)

  // 정체성 기반 검색 — 정렬 인덱스 절대 사용 금지 (spec)
  const idx = sorted.findIndex(s => s.shape === shape)
  const nextIdx = (idx + 1) % sorted.length

  const low = sorted[idx].barre
  const highBase = sorted[nextIdx].barre + SHAPE_HIGH_OFFSET[shape]
  // highBase가 low 이하면 옥타브 wrap
  const high = highBase <= low ? highBase + 12 : highBase

  const f = fret % 12

  // 고점 wrap-around (high>11) 또는 정상 범위
  // fret >= 12 가드: 1st octave(0-11)가 wrap-around 높은 위치로 블리드 안 되게
  return (
    (f >= low && f <= high) || (fret >= 12 && f + 12 >= low && f + 12 <= high)
  )
}
