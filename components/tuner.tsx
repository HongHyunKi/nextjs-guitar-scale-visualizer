'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  autoCorrelate,
  frequencyToNote,
  noteToFrequency,
  centsFromTarget,
  type PitchDetection,
} from '@/lib/pitch-utils'
import { STANDARD_TUNING_MIDI, CHROMATIC_NOTES, NOTES_FLAT } from '@/lib/music-utils'

type MicState = 'idle' | 'requesting' | 'listening' | 'denied' | 'error'
type Status = 'no-selection' | 'awaiting-input' | 'in-tune' | 'flat' | 'sharp'

const IN_TUNE_CENTS = 5
// 저음현(E2 ≈ 82Hz)은 2048 샘플(약 46ms) 윈도우에 3~4주기밖에 담기지 않아 자기상관
// 추정이 흔들린다 — 4096(약 93ms)으로 늘려 저음역 정확도를 확보한다.
const FFT_SIZE = 4096

type TuningId =
  | 'standard'
  | 'half-step-down'
  | 'whole-step-down'
  | 'drop-d'
  | 'drop-c'
  | 'dadgad'
  | 'open-g'
  | 'open-d'

// 실제 튜너 앱(GuitarTuna, Fender Tune)의 관례를 따른다: 스탠다드가 기본이고,
// 다운 튜닝(하프 다운/1음 다운) → 드롭 튜닝 → 오픈 튜닝 순으로 그룹핑한다.
// midi는 저음(6번 줄)→고음(1번 줄) 순서. 하프 다운은 관례상 플랫(Eb Ab Db…)으로
// 표기하므로 useFlat으로 표기 배열을 바꾼다.
type Tuning = {
  id: TuningId
  label: string
  group: '기본' | '다운 튜닝' | '드롭 튜닝' | '오픈 튜닝'
  midi: number[]
  useFlat?: boolean
}

const TUNINGS: Tuning[] = [
  { id: 'standard', label: '스탠다드', group: '기본', midi: [...STANDARD_TUNING_MIDI].reverse() },
  { id: 'half-step-down', label: '하프 다운 (반음 ↓)', group: '다운 튜닝', midi: [39, 44, 49, 54, 58, 63], useFlat: true },
  { id: 'whole-step-down', label: '1음 다운 (온음 ↓)', group: '다운 튜닝', midi: [38, 43, 48, 53, 57, 62] },
  { id: 'drop-d', label: '드롭 D', group: '드롭 튜닝', midi: [38, 45, 50, 55, 59, 64] },
  { id: 'drop-c', label: '드롭 C', group: '드롭 튜닝', midi: [36, 43, 48, 53, 57, 62] },
  { id: 'open-g', label: '오픈 G', group: '오픈 튜닝', midi: [38, 43, 50, 55, 59, 62] },
  { id: 'open-d', label: '오픈 D', group: '오픈 튜닝', midi: [38, 45, 50, 54, 57, 62] },
  { id: 'dadgad', label: 'DADGAD', group: '오픈 튜닝', midi: [38, 45, 50, 55, 57, 62] },
]

const TUNING_GROUPS = ['기본', '다운 튜닝', '드롭 튜닝', '오픈 튜닝'] as const

// 옵션에 표시할 현 구성(예: "E A D G B E")은 midi에서 파생한다 — 하드코딩 금지.
function tuningNotesLabel(tuning: Tuning) {
  return buildStrings(tuning)
    .map(s => s.noteName)
    .join(' ')
}

// 헤드스톡 GUI는 저음(6번, 왼쪽)→고음(1번, 오른쪽) 순서로 그린다 — 페그의 메인
// 라벨은 튜닝의 음이름(E A D G B E …)이고, 줄 번호(1번=가는 고음현 ~ 6번=굵은
// 저음현)는 보조 라벨로 붙인다.
function buildStrings(tuning: (typeof TUNINGS)[number]) {
  const noteNames = tuning.useFlat ? NOTES_FLAT : CHROMATIC_NOTES
  return tuning.midi.map((midi, i) => {
    const noteIndex = ((midi % 12) + 12) % 12
    const octave = Math.floor(midi / 12) - 1
    return {
      midi,
      noteName: noteNames[noteIndex],
      note: `${noteNames[noteIndex]}${octave}`,
      stringNumber: 6 - i,
    }
  })
}

export function Tuner() {
  const [micState, setMicState] = useState<MicState>('idle')
  const [pitch, setPitch] = useState<PitchDetection | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [tuningId, setTuningId] = useState<TuningId>('standard')

  const tuning = TUNINGS.find(t => t.id === tuningId) ?? TUNINGS[0]
  const strings = buildStrings(tuning)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)
  const bufferRef = useRef<Float32Array>(new Float32Array(FFT_SIZE))
  // 최근 유효 주파수 값의 중앙값을 사용해 프레임 간 튀는 값(자기상관 추정 잡음)을
  // 완화한다 — 경계값(±5 cents) 근처에서 판정이 매 프레임 깜빡이는 것을 막아준다.
  const recentFreqsRef = useRef<number[]>([])

  const stopListening = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    audioCtxRef.current?.close()
    audioCtxRef.current = null
    analyserRef.current = null
    recentFreqsRef.current = []
    setPitch(null)
  }

  useEffect(() => stopListening, [])

  const startListening = async () => {
    setMicState('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })
      streamRef.current = stream

      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = FFT_SIZE
      bufferRef.current = new Float32Array(analyser.fftSize)
      source.connect(analyser)
      analyserRef.current = analyser

      setMicState('listening')

      const tick = () => {
        const currentAnalyser = analyserRef.current
        if (!currentAnalyser || !audioCtxRef.current) return
        currentAnalyser.getFloatTimeDomainData(bufferRef.current)
        const freq = autoCorrelate(bufferRef.current, audioCtxRef.current.sampleRate)

        if (freq > 0) {
          const recent = recentFreqsRef.current
          recent.push(freq)
          if (recent.length > 5) recent.shift()
          const sorted = [...recent].sort((a, b) => a - b)
          const median = sorted[Math.floor(sorted.length / 2)]
          setPitch(frequencyToNote(median))
        } else {
          recentFreqsRef.current = []
          setPitch(null)
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      setMicState('denied')
    }
  }

  const handleToggle = () => {
    if (micState === 'listening') {
      stopListening()
      setMicState('idle')
    } else {
      startListening()
    }
  }

  const handleSelectString = (i: number) => {
    setSelectedIndex(prev => (prev === i ? null : i))
  }

  const selectedString = selectedIndex !== null ? strings[selectedIndex] : null
  const targetFrequency = selectedString ? noteToFrequency(selectedString.midi) : null
  const centsToTarget =
    pitch !== null && targetFrequency !== null
      ? centsFromTarget(pitch.frequency, targetFrequency)
      : null

  const status: Status =
    selectedIndex === null
      ? 'no-selection'
      : micState !== 'listening' || pitch === null || centsToTarget === null
        ? 'awaiting-input'
        : Math.abs(centsToTarget) <= IN_TUNE_CENTS
          ? 'in-tune'
          : centsToTarget < 0
            ? 'flat'
            : 'sharp'

  const STATUS_COPY: Record<Status, { heading: string; sub: string; color: string }> = {
    'no-selection': {
      heading: '줄을 선택하세요',
      sub: '아래 헤드스톡에서 튜닝할 줄을 탭하세요',
      color: 'text-muted-foreground',
    },
    'awaiting-input': {
      heading: selectedString
        ? `${selectedString.noteName} (${selectedString.stringNumber}번 줄)`
        : '',
      sub:
        micState === 'listening'
          ? '줄을 연주해보세요'
          : 'Start를 눌러 마이크를 켜주세요',
      color: 'text-foreground',
    },
    'in-tune': {
      heading: '정확해요!',
      sub: `${selectedString?.noteName} (${selectedString?.stringNumber}번 줄)이 잘 맞았어요`,
      color: 'text-accent-teal',
    },
    flat: {
      heading: '낮아요',
      sub: '줄을 조여 음을 올리세요',
      color: 'text-accent-orange',
    },
    sharp: {
      heading: '높아요',
      sub: '줄을 풀어 음을 내리세요',
      color: 'text-accent-orange',
    },
  }

  const copy = STATUS_COPY[status]
  const needleValue = Math.max(-50, Math.min(50, centsToTarget ?? 0))
  const needleColor =
    status === 'in-tune' ? 'bg-accent-teal' : status === 'flat' || status === 'sharp' ? 'bg-accent-orange' : 'bg-muted-foreground/30'

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-8">
      {/* Tuning selector — 실제 튜너 앱처럼 최상단에서 튜닝을 먼저 고른다. 기본은 스탠다드(EADGBE). */}
      <div className="flex flex-col items-center gap-1.5">
        <label htmlFor="tuning-select" className="text-xs text-muted-foreground">
          튜닝
        </label>
        <select
          id="tuning-select"
          value={tuningId}
          onChange={e => setTuningId(e.target.value as TuningId)}
          className="bg-muted text-foreground text-sm font-semibold text-center rounded-lg px-4 py-2.5 border-0 outline-none focus:ring-1 focus:ring-accent-teal cursor-pointer"
        >
          {TUNING_GROUPS.map(group => (
            <optgroup key={group} label={group}>
              {TUNINGS.filter(t => t.group === group).map(t => (
                <option key={t.id} value={t.id}>
                  {t.label} · {tuningNotesLabel(t)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Status display */}
      <div className="flex flex-col items-center gap-3 py-4 min-h-[9.5rem] justify-center">
        <h2 className={cn('text-3xl md:text-4xl font-bold text-balance text-center transition-colors', copy.color)}>
          {copy.heading}
        </h2>
        <p className="text-sm text-muted-foreground text-center">{copy.sub}</p>

        {pitch !== null && selectedString !== null && centsToTarget !== null && (
          <p className="text-xs font-mono tabular-nums text-muted-foreground">
            {pitch.note}
            {pitch.octave} · {pitch.frequency.toFixed(1)} Hz ·{' '}
            {centsToTarget > 0 ? '+' : ''}
            {centsToTarget} cents
          </p>
        )}

        {/* Cents meter: -50 ~ +50, relative to selected string's target pitch */}
        <div className="w-full max-w-xs">
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
            <motion.div
              animate={{ left: `${50 + needleValue / 2}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn('absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full transition-colors', needleColor)}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>-50</span>
            <span>0</span>
            <span>+50</span>
          </div>
        </div>
      </div>

      {/* Mic toggle */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleToggle}
          disabled={micState === 'requesting'}
          className={cn(
            'w-32 py-3 rounded-lg text-base font-semibold transition-all inline-flex items-center justify-center gap-2',
            micState === 'listening'
              ? 'bg-accent-orange text-background hover:opacity-90'
              : 'bg-accent-teal text-background hover:opacity-90 disabled:opacity-60'
          )}
        >
          {micState === 'listening' ? (
            <>
              <MicOff className="w-4 h-4" /> Stop
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" /> Start
            </>
          )}
        </button>

        {micState === 'denied' && (
          <p className="text-xs text-destructive text-center max-w-xs">
            마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 접근을 허용한 뒤 다시
            시도해주세요.
          </p>
        )}
        {micState === 'requesting' && (
          <p className="text-xs text-muted-foreground">마이크 권한 요청 중…</p>
        )}
      </div>

      {/* Guitar headstock — 페그(음이름)를 탭해서 튜닝할 줄을 선택한다 */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground text-center">
          튜닝할 줄을 선택하세요
        </p>
        <GuitarHeadstock
          strings={strings}
          selectedIndex={selectedIndex}
          status={status}
          onSelect={handleSelectString}
        />
      </div>
    </div>
  )
}

// 6-인라인(일렉기타 스타일) 헤드스톡 실루엣 + 넥을 하나의 SVG 좌표계에 그려
// 페그(튜닝 손잡이)와 현이 정확히 이어져 보이도록 한다. 페그를 탭하면 해당 줄이 선택된다.
const HEADSTOCK_PEG_Y = 60
const HEADSTOCK_NUT_Y = 100
const HEADSTOCK_BOTTOM_Y = 210
const PEG_X = [46, 91.6, 137.2, 182.8, 228.4, 274]
const NUT_X = [96, 121.6, 147.2, 172.8, 198.4, 224]
// 저음(굵은 현)→고음(가는 현) 순서로 두께를 줄인다.
const STRING_WIDTH = [4, 3.5, 3, 2.5, 2, 1.5]

function GuitarHeadstock({
  strings,
  selectedIndex,
  status,
  onSelect,
}: {
  strings: { midi: number; noteName: string; note: string; stringNumber: number }[]
  selectedIndex: number | null
  status: Status
  onSelect: (i: number) => void
}) {
  return (
    <svg
      viewBox="0 0 320 220"
      className="w-full max-w-xs mx-auto"
      role="group"
      aria-label="기타 헤드스톡 — 튜닝할 줄 선택"
    >
      {/* Headstock + neck silhouette */}
      <path
        d="M46,14 L274,14 L224,100 L224,210 L96,210 L96,100 Z"
        className="fill-muted stroke-border"
        strokeWidth={1.5}
      />

      {strings.map((s, i) => {
        const selected = selectedIndex === i
        const stringClass = selected
          ? status === 'in-tune'
            ? 'stroke-accent-teal'
            : status === 'flat' || status === 'sharp'
              ? 'stroke-accent-orange'
              : 'stroke-accent-teal/50'
          : 'stroke-muted-foreground/40'
        return (
          <polyline
            key={s.note + i}
            points={`${PEG_X[i]},${HEADSTOCK_PEG_Y} ${NUT_X[i]},${HEADSTOCK_NUT_Y} ${NUT_X[i]},${HEADSTOCK_BOTTOM_Y}`}
            fill="none"
            className={cn('transition-colors', stringClass)}
            strokeWidth={STRING_WIDTH[i]}
            strokeLinecap="round"
          />
        )
      })}

      {strings.map((s, i) => {
        const selected = selectedIndex === i
        const inTune = selected && status === 'in-tune'
        const offPitch = selected && (status === 'flat' || status === 'sharp')
        const pegClass = inTune
          ? 'fill-accent-teal stroke-accent-teal'
          : offPitch
            ? 'fill-accent-orange/15 stroke-accent-orange'
            : selected
              ? 'fill-card stroke-accent-teal'
              : 'fill-card stroke-border'
        const textClass = inTune
          ? 'fill-background'
          : offPitch
            ? 'fill-accent-orange'
            : selected
              ? 'fill-accent-teal'
              : 'fill-muted-foreground'

        return (
          <g
            key={s.note + i}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={`${s.noteName} — ${s.stringNumber}번 줄 (${s.note}) 선택`}
            className="cursor-pointer outline-none"
            onClick={() => onSelect(i)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(i)
              }
            }}
          >
            <circle
              cx={PEG_X[i]}
              cy={HEADSTOCK_PEG_Y}
              r={19}
              className={cn('transition-colors', pegClass)}
              strokeWidth={selected ? 2.5 : 1.5}
            />
            <text
              x={PEG_X[i]}
              y={HEADSTOCK_PEG_Y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={17}
              fontWeight={700}
              className={cn('transition-colors pointer-events-none', textClass)}
            >
              {s.noteName}
            </text>
            <text
              x={PEG_X[i]}
              y={HEADSTOCK_PEG_Y + 34}
              textAnchor="middle"
              fontSize={12}
              className="fill-muted-foreground pointer-events-none"
            >
              {s.stringNumber}번
            </text>
          </g>
        )
      })}
    </svg>
  )
}
