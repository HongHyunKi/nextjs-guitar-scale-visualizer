# Pentatonic Scale Implementation Specification

## Role

You are an **expert music theorist and software engineer** with precise knowledge of scale theory, modes, and pentatonic structures. Your task is to implement these concepts accurately in code.

---

## Objective

Implement a feature that correctly **calculates and displays** at minimum:

- **Major Pentatonic** scale
- **Minor Pentatonic** scale

---

## Music Theory Rules

### 1. Major Pentatonic Scale

**Formula (scale degrees):** 1 - 2 - 3 - 5 - 6

**Intervals from root:** W, W, WH, W, WH
(whole, whole, whole+half, whole, whole+half)

**Semitone intervals:** [0, 2, 4, 7, 9]

**Example — C Major Pentatonic:**
```
C  D  E  G  A
```

---

### 2. Minor Pentatonic Scale

**Formula (scale degrees):** 1 - b3 - 4 - 5 - b7

**Semitone intervals:** [0, 3, 5, 7, 10]

**Example — A Minor Pentatonic:**
```
A  C  D  E  G
```

---

## Implementation Requirements

### Input
- Root note (e.g., `C`, `D#`, `F`, `Bb`)

### Output
- List of notes for Major Pentatonic
- List of notes for Minor Pentatonic

### Example Output

```
Input: C

Major Pentatonic:
C  D  E  G  A

Minor Pentatonic:
C  Eb  F  G  Bb
```

---

## Code Requirements

1. **Interval-based calculation** — derive notes mathematically from semitone intervals; do NOT hardcode scale note lists.
2. **All 12 keys** must work correctly.
3. **Accidentals** (`#` / `b`) must be handled correctly (e.g., prefer `Eb` over `D#` in minor pentatonic contexts where flats are natural).
4. **Readable code** — clear variable names, concise logic.
5. **Function-based design** — separate concerns into small, testable functions:
   - `getNoteIndex(note)` — converts a note name to a chromatic index (0–11)
   - `getNoteName(index, preferFlat)` — converts an index back to a note name
   - `buildScale(root, intervals)` — builds a scale from a root and interval array
   - `getMajorPentatonic(root)` — returns Major Pentatonic notes
   - `getMinorPentatonic(root)` — returns Minor Pentatonic notes
6. **Test cases included** — verify multiple roots including naturals, sharps, and flats.

---

## Test Cases

| Root | Major Pentatonic       | Minor Pentatonic        |
|------|------------------------|-------------------------|
| C    | C D E G A              | C Eb F G Bb             |
| G    | G A B D E              | G Bb C D F              |
| F    | F G A C D              | F Ab Bb C Eb            |
| D#   | D# F G A# C            | D# F# G# A# C#          |
| Bb   | Bb C D F G             | Bb Db Eb F Ab           |

---

## Constraints

- **Musically incorrect output is strictly forbidden.**
- The implementation must be deterministic and produce enharmonically correct results for every key.
- Prefer flats for keys that conventionally use flats (F, Bb, Eb, Ab, Db, Gb); prefer sharps otherwise — or accept a `preferFlat` boolean parameter.
