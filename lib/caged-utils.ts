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

// Shape별 barre로부터의 low/high 오프셋.
// 실제 지판 노트 데이터로 독립 재검산해 확인됨 — 예: Am pentatonic E shape
// [5,8]은 6번현·1번현 모두 5·8프렛에 노트가 있는, 흔히 "박스 1"로 불리는
// 그 패턴과 정확히 일치한다. barre/offset 공식 자체는 정확하다.
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
 * 셰이프는 chord identity로 찾는다 (sorted 배열에서 자신의 barre 위치를
 * findIndex로 검색) — 고정 위치 인덱스를 쓰면 정렬 순서가 [C,A,G,E,D]인
 * 루트(=C)에서만 우연히 맞고 나머지 11개 루트에서는 전부 틀린다.
 *
 * Am 기준(sorted A[0] G[2] E[5] D[7] C[9]): A[0,3] G[2,5] E[5,8] D[7,10] C[9,13]
 * C 메이저 기준(sorted C[0] A[3] G[5] E[8] D[10]): C[0,4] A[3,6] G[5,8] E[8,11] D[10,13]
 * 인접 shape 간 겹침은 CAGED 이론상 정상(shared notes).
 */
export function isInCAGEDShapeRange(
  fret: number,
  rootNote: string,
  shape: CAGEDShape
): boolean {
  const rootIndex = getNoteIndex(rootNote)
  const sorted = getSortedBarres(rootIndex)

  // shape 정체성으로 직접 검색 — 위치가 아니라 "이 shape가 어디 있는가"
  const positionIdx = sorted.findIndex(s => s.shape === shape)
  const nextIdx = (positionIdx + 1) % sorted.length

  const low = sorted[positionIdx].barre + SHAPE_LOW_OFFSET[shape]
  const highBase = sorted[nextIdx].barre + SHAPE_HIGH_OFFSET[shape]
  // highBase가 low 이하면 옥타브 wrap (예: D 포지션의 next가 wrap-around될 때)
  const high = highBase <= low ? highBase + 12 : highBase

  // 옥타브 정규화: fret 자체와 옥타브 등가(fret % 12, fret % 12 + 12) 둘 다 체크
  // fret >= 12 가드: fret 0-11은 1st octave이므로 두 번째 조건(+12) 적용 안 함
  // 미적용 시 예: Am D pos [9,13]에서 fret 0 → f+12=12 ∈ [9,13] 으로 잘못 포함됨
  const f = fret % 12
  return (
    (f >= low && f <= high) || (fret >= 12 && f + 12 >= low && f + 12 <= high)
  )
}

// 각 shape의 "루트 랜드마크" 위치 — 참고: SHAPE_BASE_NOTE 독스트링의 오프셋과 동일.
// E/A/D shape는 open chord의 root가 barre 프렛 그 자체에 있고,
// C/G shape는 open chord의 root가 barre + 3프렛에 있다.
const SHAPE_ROOT_STRING: Record<CAGEDShape, number> = {
  E: 6,
  A: 5,
  D: 4,
  G: 6,
  C: 5,
}

const SHAPE_ROOT_FRET_OFFSET: Record<CAGEDShape, number> = {
  E: 0,
  A: 0,
  D: 0,
  G: 3,
  C: 3,
}

/**
 * 셰이프의 루트음이 실제로 위치한 (스트링 번호, 프렛) — 1번줄(고음 E)~6번줄(저음 E) 기준.
 * 예: C키에서 C shape → { string: 5, fret: 3 } (5번줄 3프렛)
 */
export function getShapeRootPosition(
  rootNote: string,
  shape: CAGEDShape
): { string: number; fret: number } {
  const barre = getBarreFret(getNoteIndex(rootNote), shape)
  return {
    string: SHAPE_ROOT_STRING[shape],
    fret: barre + SHAPE_ROOT_FRET_OFFSET[shape],
  }
}
