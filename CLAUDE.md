# Guitar Scale Visualizer — CLAUDE.md

> This file is the authoritative guide for AI agents working on this project.
> Read it fully before making any changes to music theory logic, scale rendering, or test coverage.

---

## Project Overview

A Next.js guitar fretboard visualizer that highlights scale notes across all 6 strings. Users select a root note and scale type; the fretboard highlights which frets belong to the scale.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Tone.js · Framer Motion

---

## Directory Structure

```
app/
  page.tsx              — main page (client component, wires all state)
components/
  fretboard.tsx         — guitar fretboard rendering + audio playback
  scale-selector.tsx    — scale type picker
  root-note-selector.tsx — 12-note root picker
  notation-toggle.tsx   — CDE / 도레미 / 123 toggle
  fret-control.tsx      — fret count slider
  caged-selector.tsx    — CAGED shape toggle
lib/
  music-utils.ts        — ALL music theory logic (single source of truth)
  caged-utils.ts        — CAGED system shape ranges
  scale-tests.ts        — runnable test script (npx tsx lib/scale-tests.ts)
docs/
  pentatonic-scale-spec.md — original spec for scale implementation
```

---

## Music Theory Implementation Rules

### The Golden Rule

**`lib/music-utils.ts` is the single source of truth for all note/scale logic.**
Never recompute scale membership, flat/sharp preference, or note names anywhere else (e.g., in component files).

### Note Representation

- Internal chromatic index: `0` (C) through `11` (B) — always sharp-based internally
- Display notation: determined at render time based on root key convention
- Sharp reference: `['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']`
- Flat reference:  `['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']`

### Sharp/Flat Preference Logic (`shouldUseFlat`)

Located in `lib/music-utils.ts`. **Do not duplicate this logic elsewhere.**

```
if root contains 'b'  → use flats  (e.g. Bb, Eb, Ab)
if root contains '#'  → use sharps (e.g. D#, F#, C#)
if natural root:
  major-character scales → use flats for: F Bb Eb Ab Db Gb
  minor-character scales → use flats for: D G C F Bb Eb Ab
```

**When adding new scales**, assign each scale an `isMinor: boolean` (or more precisely a `character: 'major' | 'minor'`) that feeds into `shouldUseFlat`. Modes break down as:

| Scale           | Character | isMinor |
|-----------------|-----------|---------|
| Major           | major     | false   |
| Major Pentatonic| major     | false   |
| Lydian          | major     | false   |
| Mixolydian      | major     | false   |
| Minor           | minor     | true    |
| Minor Pentatonic| minor     | true    |
| Dorian          | minor     | true    |
| Phrygian        | minor     | true    |
| Harmonic Minor  | minor     | true    |
| Melodic Minor   | minor     | true    |

---

## Scale Catalog

### Currently Implemented

| ScaleType           | Intervals (semitones) | Formula            |
|---------------------|-----------------------|--------------------|
| `major`             | [0,2,4,5,7,9,11]      | 1 2 3 4 5 6 7      |
| `minor`             | [0,2,3,5,7,8,10]      | 1 2 b3 4 5 b6 b7   |
| `major-pentatonic`  | [0,2,4,7,9]           | 1 2 3 5 6          |
| `minor-pentatonic`  | [0,3,5,7,10]          | 1 b3 4 5 b7        |

### Planned — Add in This Order

| Scale              | Intervals (semitones)   | Formula               | Genre Context                        |
|--------------------|-------------------------|-----------------------|--------------------------------------|
| Dorian             | [0,2,3,5,7,9,10]        | 1 2 b3 4 5 6 b7       | Blues, Jazz, Funk — essential         |
| Mixolydian         | [0,2,4,5,7,9,10]        | 1 2 3 4 5 6 b7        | Dominant 7th chords, Rock, Country   |
| Lydian             | [0,2,4,6,7,9,11]        | 1 2 3 #4 5 6 7        | Film scores, dreamy/ethereal sound   |
| Phrygian           | [0,1,3,5,7,8,10]        | 1 b2 b3 4 5 b6 b7     | Metal, Flamenco, Spanish             |
| Harmonic Minor     | [0,2,3,5,7,8,11]        | 1 2 b3 4 5 b6 7       | Neo-classical Metal, Classical       |
| Melodic Minor      | [0,2,3,5,7,9,11]        | 1 2 b3 4 5 6 7        | Modern Jazz — ascending form only    |

**Implementation checklist for each new scale:**
1. Add interval constant in `lib/music-utils.ts` (e.g., `const DORIAN_INTERVALS = [...]`)
2. Add to `ScaleType` union type
3. Add to `SCALE_LABELS` record
4. Add case in `getScaleNotes` switch with correct `isMinor` value
5. Add UI button in `components/scale-selector.tsx`
6. Add comprehensive test cases in `lib/scale-tests.ts` covering all 12 roots

---

## Known Bugs and Constraints

### BUG: Fretboard Note Matching Mismatch (rendering bug)

**File:** `components/fretboard.tsx` line 123

```typescript
// CURRENT (broken):
const useFlat = scaleType.includes('minor')  // ← hardcoded logic, independent of music-utils
const note = getNoteFromFret(openString, fret, useFlat)
const inScale = scaleNotes.includes(note)    // ← string comparison fails on enharmonic mismatch
```

**Problem:** `getScaleNotes` now uses `shouldUseFlat` (root-aware), but `getNoteFromFret` in the fretboard uses a different rule. For sharp-rooted minor scales (e.g., D# minor pentatonic), `getScaleNotes` returns `['D#','F#','G#','A#','C#']` but the fretboard generates `'Gb'` for the same note — `'Gb'` is not in the scale array → note is not highlighted even though it should be.

**Fix required:** Either:
- (A) Export `shouldUseFlat` from `music-utils.ts` and use it in the fretboard, OR
- (B) Compare notes by chromatic index instead of string equality:
  ```typescript
  const inScale = scaleNotes.some(n => getNoteIndex(n) === getNoteIndex(note))
  ```
  Option B is safer and eliminates the entire class of enharmonic mismatch bugs.

**Until this is fixed, the fretboard renders incorrectly for any sharp-rooted minor-character scale.**

### Sharp/Flat Convention Gaps

The `MINOR_FLAT_ROOTS` set (`D G C F Bb Eb Ab`) is an approximation. Edge cases:
- `B minor` → conventionally uses sharps (F#, C#) ✓ (correct, B not in set)
- `E minor` → uses sharps (F#) ✓ (E not in set)
- `A minor` → no accidentals, either works ✓

When adding modes, verify the flat-root sets match conventional key signatures for each mode's parallel roots.

---

## Test Requirements

### Run Tests

```bash
npx tsx lib/scale-tests.ts
```

### Why the Current Tests Are Insufficient

The current test script (`lib/scale-tests.ts`) only covers **5 roots × 2 scale types = 10 cases**. This is NOT enough to verify correctness across all 12 keys. Tests pass while real rendering has bugs (see fretboard bug above).

### Required Coverage for Any Scale

A scale implementation is only considered correct when all of the following pass:

**1. All 12 roots must be tested**, covering:

| Category       | Roots                      |
|----------------|----------------------------|
| Natural sharps | C G D A E B                |
| Natural flats  | F                          |
| Sharps         | C# D# F# G# A#             |
| Flats          | Db Eb Gb Ab Bb             |

**2. For each root, verify:**
- Correct number of notes (e.g., 5 for pentatonic, 7 for diatonic)
- Root note spelled correctly (must match the input root, not its enharmonic)
- All notes use consistent accidental style (no mixing `F#` and `Gb` in the same scale)
- Notes are in ascending interval order from root

**3. Cross-check against known reference:**

Every scale result must be independently verified against music theory reference data, not just against the code's own output. Use the interval formula as ground truth:

```
verify(root, intervals) {
  for each interval:
    expectedIndex = (rootIndex + interval) % 12
    actualIndex = getNoteIndex(result[i])
    assert(expectedIndex === actualIndex)
}
```

**4. Enharmonic consistency test:**

Enharmonic roots (e.g., `C#` and `Db`) should produce enharmonically equivalent scales with appropriate spelling:

```
C# Major Pentatonic: C# D# F  G# A#
Db Major Pentatonic: Db Eb F  Ab Bb
```

These should be tested as a pair.

### Example: Correct Major Pentatonic for All 12 Roots

| Root | Scale                     |
|------|---------------------------|
| C    | C D E G A                 |
| C#   | C# D# F G# A#             |
| Db   | Db Eb F Ab Bb             |
| D    | D E F# A B                |
| D#   | D# F G A# C               |
| Eb   | Eb F G Bb C               |
| E    | E F# G# B C#              |
| F    | F G A C D                 |
| F#   | F# G# A# C# D#            |
| Gb   | Gb Ab Bb Db Eb            |
| G    | G A B D E                 |
| G#   | G# A# C D# F              |
| Ab   | Ab Bb C Eb F              |
| A    | A B C# E F#               |
| A#   | A# C D F G                |
| Bb   | Bb C D F G                |
| B    | B C# D# F# G#             |

---

## Adding a New Scale — Step-by-Step

1. **Add interval constant** in `lib/music-utils.ts`:
   ```typescript
   // Dorian intervals - 1, 2, b3, 4, 5, 6, b7
   const DORIAN_INTERVALS = [0, 2, 3, 5, 7, 9, 10]
   ```

2. **Extend `ScaleType`**:
   ```typescript
   export type ScaleType = 'major' | 'minor' | 'major-pentatonic' | 'minor-pentatonic' | 'dorian'
   ```

3. **Add label**:
   ```typescript
   export const SCALE_LABELS: Record<ScaleType, string> = {
     ...
     'dorian': 'Dorian',
   }
   ```

4. **Add case in `getScaleNotes`**:
   ```typescript
   case 'dorian': intervals = DORIAN_INTERVALS; isMinor = true; break
   ```

5. **Add UI** in `components/scale-selector.tsx`

6. **Add tests** in `lib/scale-tests.ts` — all 12 roots required

---

## Code Quality Constraints

- **No hardcoded note lists for scale output** — always derive from root + intervals
- **No duplicate flat/sharp logic** — `shouldUseFlat` in `music-utils.ts` is the only place this is decided
- **String comparison for note matching is fragile** — prefer chromatic index comparison (`getNoteIndex`) when checking scale membership in rendering code
- **`ScaleType` is the only type for scale identification** — never use raw strings
