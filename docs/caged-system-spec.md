# CAGED System — Architecture & Implementation Spec

> This file is the authoritative reference for the CAGED system implementation.
> Read it fully before modifying `lib/caged-utils.ts`, `components/caged-selector.tsx`, or related tests.

---

## What Is CAGED

The CAGED system maps 5 open chord shapes (C, A, G, E, D) across the fretboard.
Each shape repeats every 12 frets. Together they tile the entire neck with no gaps.

A shape is identified by its **chord identity** (which open chord it resembles), not by its position on the neck.

---

## Barre Fret Calculation

Each shape has a base note — the open-position root of that chord form:

| Shape | Open root | Base index |
|-------|-----------|------------|
| E     | E         | 4          |
| A     | A         | 9          |
| G     | G         | 7          |
| D     | D         | 2          |
| C     | C         | 0          |

```
barre = (rootIndex - baseNote + 12) % 12
```

### Reference: barre frets by root

| Root  | C  | A  | G  | E  | D  |
|-------|----|----|----|----|----|
| C (0) |  0 |  3 |  5 |  8 | 10 |
| G (7) |  7 | 10 |  0 |  3 |  5 |
| A (9) |  9 |  0 |  2 |  5 |  7 |

---

## Shape Range Calculation

Each shape owns a fret range: from its own barre fret up to (but not including) the next shape's barre fret. Adjacent shapes overlap slightly (CAGED shared notes — intentional).

```
low      = barre + SHAPE_LOW_OFFSET[shape]     // currently 0 for all shapes
highBase = next_barre + SHAPE_HIGH_OFFSET[shape]
high     = highBase <= low ? highBase + 12 : highBase   // wrap-around guard
```

### SHAPE_HIGH_OFFSET

The `high` boundary extends slightly past the next shape's barre to include notes shared between adjacent shapes:

| Shape | offset | Notes |
|-------|--------|-------|
| C     | +1     | C chord pattern extends one fret past next barre |
| A     | +1     | same |
| G     |  0     | G chord pattern ends exactly at next barre |
| E     | +1     | same as C/A/D |
| D     | +1     | same |

### Wrap-around

The last shape in sorted order has a `next` that wraps back to sorted[0], whose barre is smaller. When `highBase <= low`, add 12:

```typescript
const high = highBase <= low ? highBase + 12 : highBase
```

### 2nd octave (frets ≥ 12)

```typescript
const f = fret % 12
return (f >= low && f <= high) || (fret >= 12 && f + 12 >= low && f + 12 <= high)
```

**Critical guard:** the `fret >= 12` condition on the second clause prevents open-string frets (0–11) from being pulled into high wrap-around positions. Without it, e.g. Am C shape [9,13]: fret 0 → f+12=12 ∈ [9,13] would incorrectly return true.

---

## Am Reference Table

Am sorted barres: A[0], G[2], E[5], D[7], C[9]

| Shape | barre | range  | 2nd octave |
|-------|-------|--------|------------|
| A     | 0     | [0, 3] | [12, 15]   |
| G     | 2     | [2, 5] | [14, 17]   |
| E     | 5     | [5, 8] | [17, 20]   |
| D     | 7     | [7,10] | [19, 22]   |
| C     | 9     | [9,13] | [21, 25]   |

---

## Architecture Rules

### The Golden Rule

**Shape labels must reflect chord identity, not sorted position.**

`isInCAGEDShapeRange(fret, root, 'E')` must always find the E-shape region regardless of where E lands in the sorted barre order for a given root.

### Lookup pattern (correct)

```typescript
const idx = sorted.findIndex(s => s.shape === shape)
```

### Anti-pattern (wrong — caused the positional labeling bug)

```typescript
// NEVER do this — maps fixed labels to fixed sorted positions
const LABEL_TO_POSITION_IDX = { C: 0, A: 1, G: 2, E: 3, D: 4 }
const positionIdx = LABEL_TO_POSITION_IDX[shape]  // wrong for any root ≠ C
```

---

## Bug History

### Positional Label Bug (fixed in commit `86d6ae1` area)

**Symptom:** Selecting any shape showed the wrong fret region for all roots except C major.

**Root cause:** `POSITION_TO_LABEL` assigned labels C→A→G→E→D to sorted positions 0→4, regardless of which chord shape was actually at each position. `LABEL_TO_POSITION_IDX` reversed this — mapping labels back to fixed position indices.

**Example (G major, select "E shape"):**
```
Sorted barres: G[0], E[3], D[5], C[7], A[10]
Old code: LABEL_TO_POSITION_IDX['E'] = 3 → sorted[3] = {C, barre:7}
Result: frets 7-10 highlighted  ← wrong (C shape region)
Expected: frets 3-6 highlighted ← E shape region
```

**Fix:** removed both lookup tables; replaced with `findIndex` by shape identity.

**Scope:** C major worked by coincidence (sorted order happens to be C→A→G→E→D). All other 11 roots were broken.

---

## File Map

| File | Responsibility |
|------|---------------|
| `lib/caged-utils.ts` | Barre calculation, range membership — single source of truth |
| `components/caged-selector.tsx` | UI: C / A / G / E / D / All toggle |
| `components/fretboard.tsx` | Calls `isInCAGEDShapeRange` to decide highlight per fret |
| `test/caged-utils.test.ts` | Unit tests: Am + C major full range, octave wrapping, regression |

---

## Test Requirements

A CAGED implementation is only considered correct when all of the following pass:

**1. Shape identity is preserved across roots**
- Selecting "E shape" on G major → frets 3–6 highlighted (E barre at 3)
- Selecting "E shape" on Am → frets 5–8 highlighted (E barre at 5)

**2. Range boundaries are exact**
- Boundary frets (low and high) are IN range
- low-1 and high+1 are NOT in range

**3. 2nd octave wrapping is correct**
- shape[low,high] → 2nd octave [low+12, high+12]
- frets 0–11 must NOT bleed into wrap-around high positions

**4. Adjacent shape overlap is intentional**
- G and E shapes for Am both include fret 5 (shared CAGED transition note) — this is correct, not a bug

**Recommended roots to test:**
- C major (canonical — sorted order matches shape order)
- G major (sorted order is G→E→D→C→A, non-standard)
- Am (sorted order is A→G→E→D→C)
- D# minor (verifies no shape region overlap or misassignment on a sharp root)
