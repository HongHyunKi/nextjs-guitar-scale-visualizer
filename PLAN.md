# Guitar ScaleUp — 로드맵

> "방구석 기타리스트를 위한 연습 도구 모음" — 일렉기타 연습에 필요한 기능을 하나씩 추가해나가는 멀티 툴 허브.
> 새 기능 추가 시 `app/page.tsx`의 `FEATURES` 배열과 `app/<feature>/page.tsx` 라우트를 함께 만든다. 스타일은 `DESIGN.md`, 음악 이론 로직은 `lib/music-utils.ts`가 authoritative.

## 완료

- [x] 스케일 연습 (`/guitar-scale`) — 지판 시각화, CAGED, 백킹트랙
- [x] 코드사전 (`/chords`) — 코드 다이어그램, 사운드
- [x] 메트로놈 (`/metronome`) — BPM, 박자, 세분화, 탭템포, 사운드 6종
- [x] 튜너 (`/tuner`) — 6-인라인 헤드스톡 GUI에서 줄(1~6번) 선택 → 목표음 대비 낮음/높음/정확 표시. 초보자가 EADGBE를 몰라도 줄 번호만으로 튜닝 가능한 것이 기본 상호작용.

## 다음 후보 (우선순위 순)

1. **코드 진행 연습 (Chord Progression Trainer)** — 코드사전 + 메트로놈을 잇는 기능. 코드를 이어붙여 진행을 만들고 BPM에 맞춰 자동 전환.
2. **이어 트레이닝 (Ear Training)** — 인터벌/코드/스케일 듣고 맞히기 퀴즈. Tone.js 사운드 인프라 재사용.
3. **연습 기록/스트릭 트래커** — 오늘 연습 시간, 어떤 스케일/코드를 연습했는지 localStorage에 기록.
4. **속도 훈련 (Speed Trainer)** — 메트로놈 BPM을 마디마다 자동으로 점진 상승.
5. **백킹트랙 독립 기능화** — `components/backing-track-player.tsx`를 스케일 페이지 밖으로 꺼내 장르별 라이브러리로 확장.
6. **아르페지오 시각화** — 코드 아르페지오를 스케일과 같은 지판 뷰로.
7. **TAB 뷰어/작성기** — 텍스트 탭 입력 → 지판 애니메이션 재생.

## 튜너 구현 메모

- **기본 상호작용은 "줄 선택 → 목표음 고정" 방식** (자동 크로매틱 인식이 아님). 이유: 초보자는 EADGBE 개념이 없으므로, 흔한 튜너 앱처럼 1~6번 줄을 먼저 고르면 그 줄의 목표 주파수에 고정해서 편차(낮음/높음/정확)를 알려준다. 다른 음을 연주해도 "가장 가까운 음"으로 스냅하지 않고 선택한 목표 대비 편차를 그대로 보여준다 (`centsFromTarget`). 자동 인식 모드는 이후 추가기능으로 고려.
- `lib/pitch-utils.ts`: 자기상관(autocorrelation, ACF2+) 기반 피치 검출 + `frequencyToNote`(가장 가까운 반음, 보조 정보용) + `noteToFrequency`/`centsFromTarget`(선택된 목표음 기준 편차, 튜닝 판정의 핵심). DSP 로직은 여기로 격리하고 `music-utils.ts`의 `CHROMATIC_NOTES`를 노트 이름 소스로 재사용(중복 금지 원칙 준수).
- `components/tuner.tsx`: `getUserMedia` + `AnalyserNode`(FFT_SIZE 4096 — 저음현 E2 정확도 확보용)로 실시간 파형을 읽고 `requestAnimationFrame` 루프에서 피치 검출 후 최근 5프레임 중앙값으로 스무딩(경계값 근처 깜빡임 방지). 마이크 권한 거부/에러 상태를 명시적으로 처리.
- 헤드스톡 GUI(`GuitarHeadstock`)는 SVG 단일 좌표계로 그려 페그(줄 번호 1~6번, 음이름은 보조 텍스트)와 현 두께·연결선이 어긋나지 않게 함. 표준 튜닝 6현 데이터는 `music-utils.ts`의 `STANDARD_TUNING_MIDI`를 재사용.
