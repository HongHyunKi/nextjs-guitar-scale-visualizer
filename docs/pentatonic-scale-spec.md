# Pentatonic Scale — Implementation Spec

> This file is the authoritative reference for pentatonic scale logic.
> Read it fully before modifying scale intervals, accidental logic, or adding new scale types.

---

## What This Covers

Two scales implemented as the foundation of the scale system:

- **Major Pentatonic** — bright, consonant; used in pop, country, blues solos
- **Minor Pentatonic** — dark, bluesy; the most commonly used guitar scale

Both are 5-note subsets of their respective diatonic scales (major/minor), omitting the two most dissonant intervals.

---

## Interval Formulas

### Major Pentatonic

**Degrees:** 1 – 2 – 3 – 5 – 6
**Semitones:** `[0, 2, 4, 7, 9]`
**Omits:** 4th and 7th (the tritone-prone degrees)

```
C major pentatonic: C  D  E  G  A
```

### Minor Pentatonic

**Degrees:** 1 – b3 – 4 – 5 – b7
**Semitones:** `[0, 3, 5, 7, 10]`
**Omits:** 2nd and b6 (the most tense intervals in natural minor)

```
A minor pentatonic: A  C  D  E  G
```

---

## Sharp / Flat Convention

### The Rule

Accidental preference is determined by root + scale character. **Never hardcode per scale type alone.**

```
if root contains 'b'  → use flats  (Bb, Eb, Ab, Db, Gb, Fb)
if root contains '#'  → use sharps (C#, D#, F#, G#, A#)
if natural root:
  major pentatonic → flats for: F Bb Eb Ab Db Gb
  minor pentatonic → flats for: D G C F Bb Eb Ab
```

### Reference Table — All 12 Roots

| Root | Major Pentatonic | Minor Pentatonic |
| ---- | ---------------- | ---------------- |
| C    | C D E G A        | C Eb F G Bb      |
| C#   | C# D# F G# A#    | C# E F# G# B     |
| Db   | Db Eb F Ab Bb    | Db Eb Gb Ab B    |
| D    | D E F# A B       | D F G A C        |
| D#   | D# F G A# C      | D# F# G# A# C#   |
| Eb   | Eb F G Bb C      | Eb Gb Ab Bb Db   |
| E    | E F# G# B C#     | E G A B D        |
| F    | F G A C D        | F Ab Bb C Eb     |
| F#   | F# G# A# C# D#   | F# A B C# E      |
| Gb   | Gb Ab Bb Db Eb   | Gb A B Db E      |
| G    | G A B D E        | G Bb C D F       |
| G#   | G# A# C D# F     | G# B C# D# F#    |
| Ab   | Ab Bb C Eb F     | Ab B Db Eb Gb    |
| A    | A B C# E F#      | A C D E G        |
| A#   | A# C D F G       | A# C# D# F G#    |
| Bb   | Bb C D F G       | Bb Db Eb F Ab    |
| B    | B C# D# F# G#    | B D E F# A       |

**Enharmonic pairs produce enharmonically equivalent scales with correct spelling:**

```
C# major pentatonic: C# D# F  G# A#
Db major pentatonic: Db Eb F  Ab Bb   ← same pitches, flat spelling
```

---

## Implementation Rules

### Correct pattern

```typescript
// In lib/music-utils.ts — single source of truth
function getScaleNotes(root: string, scaleType: ScaleType): string[] {
  const rootIndex = getNoteIndex(root)
  const useFlat = shouldUseFlat(root, isMinor) // ← root-aware, not type-aware
  return intervals.map(i => getNoteName((rootIndex + i) % 12, useFlat))
}
```

### Anti-patterns (never do these)

```typescript
// WRONG: hardcodes flat preference to scale type, ignores root
// e.g. D# minor pentatonic should use sharps, but this returns flats
const useFlatWrong = scaleType.includes('minor')

// WRONG: string comparison fails on enharmonic mismatch
// e.g. scaleNotes = ['D#','F#',...] but note = 'Eb' → returns false (miss)
const inScaleWrong = scaleNotes.includes(note)

// CORRECT: compare by chromatic index — enharmonic-safe
const inScale = scaleNotes.some(n => getNoteIndex(n) === getNoteIndex(note))
```

---

## Architecture Rules

- **`lib/music-utils.ts` is the only place scale notes are computed.** Never recompute in components.
- **`shouldUseFlat` is the only place accidental preference is decided.** Never duplicate this logic.
- **Note matching must use `getNoteIndex`, not string equality.** Enharmonic mismatches (D# vs Eb) are a silent rendering bug.

---

## Test Requirements

A scale implementation is only considered correct when all of the following pass:

**1. All 12 roots tested** — covering naturals, sharps, and flats

**2. Per root, verify:**

- Correct note count (5 for pentatonic)
- Root note spelled exactly as input (not its enharmonic)
- No mixed accidentals within a single scale (no `F#` and `Gb` in the same result)
- Intervals match formula: `(rootIndex + interval) % 12 === getNoteIndex(result[i])`

**3. Enharmonic pair consistency:**

- C# and Db produce enharmonically equivalent scales with different spellings
- D# and Eb same
- F# and Gb same

**4. Regression: sharp-rooted minor scales**

- D# minor pentatonic → `['D#', 'F#', 'G#', 'A#', 'C#']` (all sharps, not mixed)
- The fretboard must highlight these correctly (requires index-based matching, not string)
