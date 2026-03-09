// Run: npx tsx lib/scale-tests.ts
import { getScaleNotes, getNoteIndex, ScaleType } from './music-utils'

// ─────────────────────────────────────────────
// Interval definitions (ground truth)
// ─────────────────────────────────────────────
const INTERVALS: Record<ScaleType, number[]> = {
  'major':            [0, 2, 4, 5, 7, 9, 11],
  'minor':            [0, 2, 3, 5, 7, 8, 10],
  'major-pentatonic': [0, 2, 4, 7, 9],
  'minor-pentatonic': [0, 3, 5, 7, 10],
}

// ─────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────

// 'b' 을 노트명의 플랫 기호로만 취급 (B 음은 제외)
function isFlat(note: string): boolean {
  return note.length > 1 && note[1] === 'b'
}

function isSharp(note: string): boolean {
  return note.includes('#')
}

function hasAccidentalMix(notes: string[]): boolean {
  const hasSharp = notes.some(n => isSharp(n))
  const hasFlat = notes.some(n => isFlat(n))
  return hasSharp && hasFlat
}

function verifyIntervals(root: string, notes: string[], intervals: number[]): string | null {
  const rootIdx = getNoteIndex(root)
  for (let i = 0; i < intervals.length; i++) {
    const expected = (rootIdx + intervals[i]) % 12
    const actual = getNoteIndex(notes[i])
    if (actual !== expected) {
      return `note[${i}]="${notes[i]}" has chromatic index ${actual}, expected ${expected} (interval +${intervals[i]} from ${root})`
    }
  }
  return null
}

// ─────────────────────────────────────────────
// Core assert
// ─────────────────────────────────────────────
let passed = 0
let failed = 0

function assertScale(root: string, scaleType: ScaleType, expected: string[]) {
  const label = `${root.padEnd(2)} ${scaleType}`
  const actual = getScaleNotes(root, scaleType)
  const errors: string[] = []

  // 1. 길이 체크
  if (actual.length !== expected.length) {
    errors.push(`length ${actual.length} ≠ expected ${expected.length}`)
  }

  // 2. 루트 스펠링
  if (actual[0] !== root) {
    errors.push(`root note "${actual[0]}" ≠ input root "${root}"`)
  }

  // 3. 어시덴탈 일관성 (#와 b 혼용 금지)
  if (hasAccidentalMix(actual)) {
    errors.push(`mixed accidentals: [${actual.join(', ')}]`)
  }

  // 4. 크로매틱 인덱스 검증 (음정 공식 기반)
  const intervalErr = verifyIntervals(root, actual, INTERVALS[scaleType])
  if (intervalErr) {
    errors.push(intervalErr)
  }

  // 5. 정확한 음표명 일치
  const exactMatch = JSON.stringify(actual) === JSON.stringify(expected)
  if (!exactMatch) {
    errors.push(`spelling mismatch\n      expected: [${expected.join(', ')}]\n      actual:   [${actual.join(', ')}]`)
  }

  if (errors.length === 0) {
    console.log(`  ✓ ${label}: ${actual.join(' ')}`)
    passed++
  } else {
    console.error(`  ✗ ${label}`)
    for (const e of errors) {
      console.error(`    → ${e}`)
    }
    failed++
  }
}

// ─────────────────────────────────────────────
// Test data: 17 roots × 4 scales = 68 cases
// Expected values calculated from shouldUseFlat + interval logic
// ─────────────────────────────────────────────

console.log('\n════════════════════════════════════════')
console.log(' MAJOR SCALE [0,2,4,5,7,9,11]')
console.log('════════════════════════════════════════')

assertScale('C',  'major', ['C',  'D',  'E',  'F',  'G',  'A',  'B'  ])
assertScale('C#', 'major', ['C#', 'D#', 'F',  'F#', 'G#', 'A#', 'C'  ])
assertScale('Db', 'major', ['Db', 'Eb', 'F',  'Gb', 'Ab', 'Bb', 'C'  ])
assertScale('D',  'major', ['D',  'E',  'F#', 'G',  'A',  'B',  'C#' ])
assertScale('D#', 'major', ['D#', 'F',  'G',  'G#', 'A#', 'C',  'D'  ])
assertScale('Eb', 'major', ['Eb', 'F',  'G',  'Ab', 'Bb', 'C',  'D'  ])
assertScale('E',  'major', ['E',  'F#', 'G#', 'A',  'B',  'C#', 'D#' ])
assertScale('F',  'major', ['F',  'G',  'A',  'Bb', 'C',  'D',  'E'  ])
assertScale('F#', 'major', ['F#', 'G#', 'A#', 'B',  'C#', 'D#', 'F'  ])
assertScale('Gb', 'major', ['Gb', 'Ab', 'Bb', 'B',  'Db', 'Eb', 'F'  ])
assertScale('G',  'major', ['G',  'A',  'B',  'C',  'D',  'E',  'F#' ])
assertScale('G#', 'major', ['G#', 'A#', 'C',  'C#', 'D#', 'F',  'G'  ])
assertScale('Ab', 'major', ['Ab', 'Bb', 'C',  'Db', 'Eb', 'F',  'G'  ])
assertScale('A',  'major', ['A',  'B',  'C#', 'D',  'E',  'F#', 'G#' ])
assertScale('A#', 'major', ['A#', 'C',  'D',  'D#', 'F',  'G',  'A'  ])
assertScale('Bb', 'major', ['Bb', 'C',  'D',  'Eb', 'F',  'G',  'A'  ])
assertScale('B',  'major', ['B',  'C#', 'D#', 'E',  'F#', 'G#', 'A#' ])

console.log('\n════════════════════════════════════════')
console.log(' MINOR SCALE [0,2,3,5,7,8,10]')
console.log('════════════════════════════════════════')

assertScale('C',  'minor', ['C',  'D',  'Eb', 'F',  'G',  'Ab', 'Bb' ])
assertScale('C#', 'minor', ['C#', 'D#', 'E',  'F#', 'G#', 'A',  'B'  ])
assertScale('Db', 'minor', ['Db', 'Eb', 'E',  'Gb', 'Ab', 'A',  'B'  ])
assertScale('D',  'minor', ['D',  'E',  'F',  'G',  'A',  'Bb', 'C'  ])
assertScale('D#', 'minor', ['D#', 'F',  'F#', 'G#', 'A#', 'B',  'C#' ])
assertScale('Eb', 'minor', ['Eb', 'F',  'Gb', 'Ab', 'Bb', 'B',  'Db' ])
assertScale('E',  'minor', ['E',  'F#', 'G',  'A',  'B',  'C',  'D'  ])
assertScale('F',  'minor', ['F',  'G',  'Ab', 'Bb', 'C',  'Db', 'Eb' ])
assertScale('F#', 'minor', ['F#', 'G#', 'A',  'B',  'C#', 'D',  'E'  ])
assertScale('Gb', 'minor', ['Gb', 'Ab', 'A',  'B',  'Db', 'D',  'E'  ])
assertScale('G',  'minor', ['G',  'A',  'Bb', 'C',  'D',  'Eb', 'F'  ])
assertScale('G#', 'minor', ['G#', 'A#', 'B',  'C#', 'D#', 'E',  'F#' ])
assertScale('Ab', 'minor', ['Ab', 'Bb', 'B',  'Db', 'Eb', 'E',  'Gb' ])
assertScale('A',  'minor', ['A',  'B',  'C',  'D',  'E',  'F',  'G'  ])
assertScale('A#', 'minor', ['A#', 'C',  'C#', 'D#', 'F',  'F#', 'G#' ])
assertScale('Bb', 'minor', ['Bb', 'C',  'Db', 'Eb', 'F',  'Gb', 'Ab' ])
assertScale('B',  'minor', ['B',  'C#', 'D',  'E',  'F#', 'G',  'A'  ])

console.log('\n════════════════════════════════════════')
console.log(' MAJOR PENTATONIC [0,2,4,7,9]')
console.log('════════════════════════════════════════')

assertScale('C',  'major-pentatonic', ['C',  'D',  'E',  'G',  'A'  ])
assertScale('C#', 'major-pentatonic', ['C#', 'D#', 'F',  'G#', 'A#' ])
assertScale('Db', 'major-pentatonic', ['Db', 'Eb', 'F',  'Ab', 'Bb' ])
assertScale('D',  'major-pentatonic', ['D',  'E',  'F#', 'A',  'B'  ])
assertScale('D#', 'major-pentatonic', ['D#', 'F',  'G',  'A#', 'C'  ])
assertScale('Eb', 'major-pentatonic', ['Eb', 'F',  'G',  'Bb', 'C'  ])
assertScale('E',  'major-pentatonic', ['E',  'F#', 'G#', 'B',  'C#' ])
assertScale('F',  'major-pentatonic', ['F',  'G',  'A',  'C',  'D'  ])
assertScale('F#', 'major-pentatonic', ['F#', 'G#', 'A#', 'C#', 'D#' ])
assertScale('Gb', 'major-pentatonic', ['Gb', 'Ab', 'Bb', 'Db', 'Eb' ])
assertScale('G',  'major-pentatonic', ['G',  'A',  'B',  'D',  'E'  ])
assertScale('G#', 'major-pentatonic', ['G#', 'A#', 'C',  'D#', 'F'  ])
assertScale('Ab', 'major-pentatonic', ['Ab', 'Bb', 'C',  'Eb', 'F'  ])
assertScale('A',  'major-pentatonic', ['A',  'B',  'C#', 'E',  'F#' ])
assertScale('A#', 'major-pentatonic', ['A#', 'C',  'D',  'F',  'G'  ])
assertScale('Bb', 'major-pentatonic', ['Bb', 'C',  'D',  'F',  'G'  ])
assertScale('B',  'major-pentatonic', ['B',  'C#', 'D#', 'F#', 'G#' ])

console.log('\n════════════════════════════════════════')
console.log(' MINOR PENTATONIC [0,3,5,7,10]')
console.log('════════════════════════════════════════')

assertScale('C',  'minor-pentatonic', ['C',  'Eb', 'F',  'G',  'Bb' ])
assertScale('C#', 'minor-pentatonic', ['C#', 'E',  'F#', 'G#', 'B'  ])
assertScale('Db', 'minor-pentatonic', ['Db', 'E',  'Gb', 'Ab', 'B'  ])
assertScale('D',  'minor-pentatonic', ['D',  'F',  'G',  'A',  'C'  ])
assertScale('D#', 'minor-pentatonic', ['D#', 'F#', 'G#', 'A#', 'C#' ])
assertScale('Eb', 'minor-pentatonic', ['Eb', 'Gb', 'Ab', 'Bb', 'Db' ])
assertScale('E',  'minor-pentatonic', ['E',  'G',  'A',  'B',  'D'  ])
assertScale('F',  'minor-pentatonic', ['F',  'Ab', 'Bb', 'C',  'Eb' ])
assertScale('F#', 'minor-pentatonic', ['F#', 'A',  'B',  'C#', 'E'  ])
assertScale('Gb', 'minor-pentatonic', ['Gb', 'A',  'B',  'Db', 'E'  ])
assertScale('G',  'minor-pentatonic', ['G',  'Bb', 'C',  'D',  'F'  ])
assertScale('G#', 'minor-pentatonic', ['G#', 'B',  'C#', 'D#', 'F#' ])
assertScale('Ab', 'minor-pentatonic', ['Ab', 'B',  'Db', 'Eb', 'Gb' ])
assertScale('A',  'minor-pentatonic', ['A',  'C',  'D',  'E',  'G'  ])
assertScale('A#', 'minor-pentatonic', ['A#', 'C#', 'D#', 'F',  'G#' ])
assertScale('Bb', 'minor-pentatonic', ['Bb', 'Db', 'Eb', 'F',  'Ab' ])
assertScale('B',  'minor-pentatonic', ['B',  'D',  'E',  'F#', 'A'  ])

// ─────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────
console.log('\n════════════════════════════════════════')
console.log(` Results: ${passed} passed, ${failed} failed  (total ${passed + failed})`)
console.log('════════════════════════════════════════\n')

if (failed > 0) process.exit(1)
