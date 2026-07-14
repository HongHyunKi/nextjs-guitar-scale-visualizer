import { CHROMATIC_NOTES } from './music-utils'

// 자기상관(autocorrelation) 기반 피치 검출 — 시간 도메인 파형에서 기본 주파수를 찾는다.
// FFT보다 노이즈에 강하고, 기타 음역대(80Hz~1.3kHz)에서 정확도가 높아 튜너에 적합하다.
// 무음/노이즈 구간은 -1을 반환한다.
export function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  const SIZE = buffer.length

  // RMS로 무음 판별 — 너무 조용하면 피치 추정을 시도하지 않는다.
  let rms = 0
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i]
  }
  rms = Math.sqrt(rms / SIZE)
  if (rms < 0.01) return -1

  // 기타 최저음(E2 ≈ 82Hz)보다 여유 있게 낮은 40Hz까지 커버하는 lag 범위로 제한해
  // 불필요한 연산을 줄인다.
  const minFreq = 40
  const maxLagBound = Math.min(SIZE - 1, Math.floor(sampleRate / minFreq))

  const c = new Array<number>(maxLagBound + 1).fill(0)
  for (let lag = 0; lag <= maxLagBound; lag++) {
    let sum = 0
    for (let i = 0; i < SIZE - lag; i++) {
      sum += buffer[i] * buffer[i + lag]
    }
    c[lag] = sum
  }

  // lag=0은 항상 최댓값이므로, 첫 하강 이후 첫 상승 지점부터 최댓값을 찾는다.
  let d = 0
  while (d < maxLagBound && c[d] > c[d + 1]) d++

  let maxVal = -1
  let maxLag = -1
  for (let lag = d; lag <= maxLagBound; lag++) {
    if (c[lag] > maxVal) {
      maxVal = c[lag]
      maxLag = lag
    }
  }
  if (maxLag <= 0) return -1

  // 포물선 보간으로 정수 lag 사이의 실제 피크 위치를 추정해 정밀도를 높인다.
  const x1 = c[maxLag - 1] ?? c[maxLag]
  const x2 = c[maxLag]
  const x3 = c[maxLag + 1] ?? c[maxLag]
  const denom = x1 - 2 * x2 + x3
  const shift = denom !== 0 ? (0.5 * (x1 - x3)) / denom : 0
  const refinedLag = maxLag + shift

  if (refinedLag <= 0) return -1
  return sampleRate / refinedLag
}

export type PitchDetection = {
  frequency: number
  note: string
  octave: number
  cents: number
  midi: number
}

// A4 = MIDI 69 = 440Hz 기준으로 가장 가까운 반음과 cents 편차를 계산한다.
export function frequencyToNote(frequency: number): PitchDetection {
  const midiFloat = 69 + 12 * Math.log2(frequency / 440)
  const midi = Math.round(midiFloat)
  const cents = Math.round((midiFloat - midi) * 100)
  const noteIndex = ((midi % 12) + 12) % 12
  const octave = Math.floor(midi / 12) - 1

  return {
    frequency,
    note: CHROMATIC_NOTES[noteIndex],
    octave,
    cents,
    midi,
  }
}

// MIDI 노트 번호 → 주파수(Hz). 특정 현(목표 피치)을 고정해두고 튜닝할 때 사용.
export function noteToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

// 감지된 주파수가 목표 주파수 대비 몇 cents 벗어났는지 계산한다.
// frequencyToNote의 cents(가장 가까운 반음 기준)와 달리, 완전히 다른 음을 연주해도
// 그 값이 얼마나 크든 상관없이 "선택한 줄" 기준으로 편차를 알려준다 — 줄 선택 후
// 튜닝하는 초보자 플로우에 필요한 계산.
export function centsFromTarget(frequency: number, targetFrequency: number): number {
  return Math.round(1200 * Math.log2(frequency / targetFrequency))
}
