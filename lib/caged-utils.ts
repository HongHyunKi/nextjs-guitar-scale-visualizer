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

function getBarreFret(rootIndex: number, shape: CAGEDShape): number {
  return (rootIndex - SHAPE_BASE_NOTE[shape] + 12) % 12
}

function getSortedBarres(rootIndex: number): { shape: CAGEDShape; barre: number }[] {
  return CAGED_SHAPES
    .map(shape => ({ shape, barre: getBarreFret(rootIndex, shape) }))
    .sort((a, b) => a.barre - b.barre)
}

/**
 * All 뷰에서 각 프렛의 CAGED 형태를 결정 (버킷 방식 — 겹침 없음)
 *
 * 각 형태는 자신의 배레 프렛부터 다음 형태의 배레 프렛 직전까지 담당.
 * 배레 프렛 자체는 그 형태에 속함 (경계는 해당 형태 소속).
 *
 * 검증 (C 메이저): C[0,3) A[3,5) G[5,8) E[8,10) D[10,12)
 * - 2번현 fret1 (C=root) → C ✓  /  5번현 fret3 (C=root) → A ✓
 * - 3번현 fret5 (C=root) → G ✓  /  6번현 fret8 (C=root) → E ✓
 * - 4번현 fret10 (C=root) → D ✓
 */
export function getCAGEDShapeForFret(fret: number, rootNote: string): CAGEDShape {
  const rootIndex = getNoteIndex(rootNote)
  const sorted = getSortedBarres(rootIndex)
  const f = fret % 12

  let result = sorted[sorted.length - 1] // 기본값: wrap-around 처리
  for (const entry of sorted) {
    if (entry.barre <= f) {
      result = entry
    } else {
      break
    }
  }
  return result.shape
}

// Shape별 barre로부터의 low/high 오프셋
// C 메이저 기준 검증: C[1,3] A[2,6] G[4,8] E[7,10] D[9,13]
const SHAPE_LOW_OFFSET: Record<CAGEDShape, number> = {
  C: 0,   // low = max(barre, 1) 로 별도 처리 — barre 자체가 low
  A: -1,
  G: -1,
  E: -1,
  D: -1,
}

const SHAPE_HIGH_OFFSET: Record<CAGEDShape, number> = {
  C: 0,
  A: 1,   // A shape는 next barre +1까지 포함
  G: 0,
  E: 0,
  D: 1,   // D shape도 next barre +1까지 포함 (wrap 포함)
}

/**
 * 단일 Shape 선택 시 프렛이 해당 Shape 범위에 속하는지 확인
 *
 * C 메이저 기준: C[1,3] A[2,6] G[4,8] E[7,10] D[9,13]
 * 인접 shape 간 2프렛 겹침 (CAGED shared notes — 정상)
 */
export function isInCAGEDShapeRange(fret: number, rootNote: string, shape: CAGEDShape): boolean {
  const rootIndex = getNoteIndex(rootNote)
  const sorted = getSortedBarres(rootIndex)

  const shapeIdx = sorted.findIndex(e => e.shape === shape)
  const nextIdx = (shapeIdx + 1) % sorted.length

  // C 이외의 shape이 barre=0이면 해당 키의 개방 코드 위치를 의미하지만,
  // CAGED 시각화에서는 다른 shape들(최대 ~fret10) 이후인 12번 위치로 표시
  // 예) D major D shape: barre=0 → 12로 처리 → range [11, 15]
  const rawBarre = sorted[shapeIdx].barre
  const shapeBarre = shape !== 'C' && rawBarre === 0 ? 12 : rawBarre

  const low = shapeBarre + SHAPE_LOW_OFFSET[shape]
  const highBase = sorted[nextIdx].barre + SHAPE_HIGH_OFFSET[shape]
  // highBase가 low 이하면 옥타브 wrap (예: D shape low=9, highBase=1 → high=13)
  const high = highBase <= low ? highBase + 12 : highBase

  // fret 실제 위치(mod 없이)로 비교 — fret 0과 fret 12는 다른 위치
  // C shape은 open 포지션(barre=0)일 때 개방현 제외 → min 1
  const lowClamped = shape === 'C' ? Math.max(low, 1) : Math.max(low, 0)
  return fret >= lowClamped && fret <= high
}