# ☕ Cof/fee 변천사 — v1 → v2 → v3

> **"좋아하는 커피를 걱정 없이 마실 수 있게"**  
> 세 번의 리빌드를 거쳐, 단순한 계산기에서 AI 코칭 시스템으로 진화한 기록.

---

## 한눈에 보는 진화 요약

| 항목 | v1 | v2 | v3 |
|---|---|---|---|
| **언어/프레임워크** | Python + Streamlit | React + TypeScript + Vite | React + TypeScript + Vite |
| **상태관리** | 없음 (스크립트 단순 실행) | Jotai (atom 기반) | Jotai (동일) |
| **데이터 저장** | 로컬 CSV 파일 | localStorage (브라우저) | localStorage (동일) |
| **AI 기능** | 없음 | 기획만 (GraphRAG 미구현) | **YIE GraphRAG 실제 연동** |
| **캐릭터** | 3종 (bean/berry PNG) | 4종 (busybeen 시리즈) | **9종** (코치 콩이 + 5종 신규) |
| **페이지 수** | 단일 화면 (탭) | 7개 페이지 | **8개 페이지** (CoachChat 추가) |
| **테스트 코드** | 없음 | 없음 | **Vitest 도입** |
| **커밋 수** | 6개 | 20개+ | 9개 (v2 클론 기반) |

---

## v1 — 아이디어의 씨앗 (Python Streamlit)

> **"계산이 먼저다"** — 기능을 증명하는 프로토타입

### 탄생 배경
커피 마시는 시간이 다음 날 컨디션에 얼마나 영향을 주는지 직접 계산하고 싶었던 것이 출발점. Python 스크립트 두 개(`main.py`, `logic.py`)와 Streamlit으로 최소한의 UI를 만들었다.

### 핵심 구조

```
v1/
├── main.py          # Streamlit UI 전체
├── logic.py         # 계산 엔진 (반감기, 수면 예측 등)
├── requirements.txt # streamlit, pandas, matplotlib
├── coffee_log.csv   # CSV 일기장 (로컬 저장)
└── assets/
    ├── working_bean.png
    ├── wink_bean.png
    └── fresh_berry.png
```

### 이미 v1에 있었던 것들

핵심 알고리즘은 v1에서 완성되었다. 이후 버전들이 모두 이 로직을 물려받는다.

- **카페인 반감기 공식** — `C_now = C_initial × 0.5^(t / halfLife)`, 기본 반감기 5시간
- **특별 관리 모드** (컨디션 저하 시 반감기 7시간으로 상향) — 생리 민감도 반영의 원형
- **물 섭취 연동** — 물 1잔당 카페인 대사 10% 가속 (`0.9^water_cups`)
- **수면 예측 로직** — 카페인이 50mg 아래로 떨어지는 시간 역산
- **징검다리 스케줄러** — 섭취 후 12~24h 두통 경고, 4일 후 안전 재회일 계산
- **치킨 지수** — 참은 커피 × 4,500원 → 치킨 환산
- **주간 통계 차트** — matplotlib 막대그래프, 400mg 권장 한도선

### 캐릭터 시스템 (v1)
| 상태 | 캐릭터 | 조건 |
|---|---|---|
| 야근 중 🔥 | `working_bean.png` | 잔존량 > 150mg |
| 안정기 ☕ | `wink_bean.png` | 50~150mg |
| 클린 🌿 | `fresh_berry.png` | < 50mg |

CSS `@keyframes floating`으로 상하 둥둥 애니메이션 적용.

### v1의 한계
- 단일 Python 파일 → 모바일 사용 불가, 배포 어려움
- CSV 파일 저장 → 기기 간 이동 불가
- Streamlit의 리렌더링 구조 → 인터랙션 자유도 낮음
- AI 기능 없음

---

## v2 — 완전한 재건축 (React + TypeScript)

> **"제대로 된 앱을 만들자"** — 프레임워크 완전 교체, 웹앱으로 환골탈태

### 가장 큰 변화: 언어와 철학의 전환

v1의 Python/Streamlit을 통째로 버리고 **React + TypeScript + Vite** 스택으로 처음부터 다시 썼다. 단순 계산기에서 멀티페이지 앱으로의 도약.

### 새로운 기술 스택

| 역할 | 선택 |
|---|---|
| UI 프레임워크 | React 18 + TypeScript |
| 번들러 | Vite |
| 스타일링 | Tailwind CSS |
| 상태관리 | **Jotai** (atom 기반 전역 상태) |
| 차트 | **Recharts** |
| 애니메이션 | **Framer Motion** |
| 라우팅 | React Router v6 |
| 날짜 처리 | Day.js |

### 페이지 아키텍처 (v2에서 정립)

```
src/pages/
├── Onboarding/   # 최초 실행 시 사용자 프로파일링
├── Dashboard/    # 실시간 캐릭터 + 카페인 상태
├── AddDrink/     # 음료 기록 (검색 + 직접 입력)
├── History/      # 타임라인 기반 섭취 기록
├── Stats/        # 주간 통계 차트 + 인사이트
├── Goals/        # 4주 감량 로드맵 / 이별 캘린더
└── Settings/     # 개인 설정 + 전체 초기화
```

### v2에서 새로 생긴 것들

**온보딩 시스템** — 앱 첫 실행 시 닉네임, 체중, 성별, 카페인 민감도, 일일 목표량 등을 수집해 개인화된 반감기를 계산.

**다크모드 / 크림 테마** — 라이트(크림 `#FDFAF6`) ↔ 다크(회갈색 Taupe `#483C32`) 전환. Framer Motion으로 배경색 전환 애니메이션 적용. 별빛 배경은 야간 모드 전용.

**증상 기록 시스템** (`SymptomModal`) — 두통, 심장 두근거림, 불안 등 컨디션을 날짜별로 기록하고 카페인 섭취와 상관관계 분석.

**은하수/별빛 배경 엔진** — 카페인 상태에 반응하는 동적 배경. 카페인이 높을수록 별이 더 많아지는 시각적 피드백.

**유리 모피즘(Glassmorphism) UI** — 수면 안내 / AI 추천 플로팅 카드에 적용.

**타임머신 기능** — 과거 날짜의 데이터 확인 및 소급 입력.

**데이터 내보내기/복구** — 섭취 기록을 JSON으로 내보내고 복구하는 기능.

**캐릭터 4종 (busybeen 시리즈)**
| 상태 | 파일 |
|---|---|
| IDLE (클린) | `relaxbeen.png` |
| GOOD (집중) | `composedbeen.png` |
| WARNING (과각성) | `busybeen.png` |
| FUN (긍정적) | `funnybeen.png` |

**3D 아이콘 시스템** — battery, bulb, cup, moon, sun, trophy 등 13종의 3D 아이콘 도입으로 시각적 풍성함 추가.

**브랜치 전략 도입** — `main`, `develop`, `feature/intelligent-journey-system` 등 PR 기반 협업 구조로 전환.

### v2에서 기획만 하고 못 만든 것

v2의 README에는 야심 찬 AI 아키텍처가 담겨 있다 — Neo4j 지식 그래프, ChromaDB 벡터 DB, LangChain + Tavily API를 통한 Agentic GraphRAG. 하지만 Phase 2로 분류되어 실제 코드에는 없다. v3가 이것을 실현한다.

---

## v3 — AI가 실제로 들어오다 (YIE 통합)

> **"논문이 말한다"** — 계획으로만 있던 AI 엔진을 실제로 연결

### v3의 시작

v2 레포를 그대로 클론해서 출발했다 (첫 커밋: `"chore: init cof-fee-v3 (cloned from v2, YIE integration branch)"`). 즉 v2의 모든 기능을 이어받고 AI 연동에 집중.

### 가장 큰 변화: YIE 실제 연동

v2에서 기획만 했던 AI 엔진이 v3에서 **YIE(Universal Insight Engine)** 라는 이름으로 실제 연결됐다.

```
Cof/fee v3 ──(HTTP POST)──▶ YIE localhost:8000/rag/query
                                      │
                              Neo4j GraphRAG
                              1,374개 학술 청크
                              (카페인·수면·인지·피로 논문)
                                      │
                              EXAONE 3.5 LLM
                                      │
                              논문 기반 인사이트 카드
```

`src/lib/yieClient.ts`가 신규 추가됐다. Stats 화면에서 최근 7일 평균 카페인 섭취량과 잔존량을 YIE에 보내면, 관련 논문 청크를 검색해 한국어 인사이트 카드로 돌려준다.

### AI 코치 콩이 (CoachChat 페이지)

v3 최대 신기능. `pages/CoachChat/` 페이지가 통째로 추가됐다.

- **코치 콩이** (`coach_kong.png`) — v3 전용 신규 캐릭터
- 프리미엄 성운(Nebula) 배경 애니메이션
- 채팅 UI — 메시지 입력, AI 응답 시뮬레이션 (현재 더미 응답, YIE 연동 예정)
- Dashboard에 플로팅 FAB 버튼으로 진입점 추가

### 캐릭터 대폭 확장 (4종 → 9종)

v3에서 캐릭터 라이브러리가 두 배 이상 늘었다.

| 신규 캐릭터 | 역할 |
|---|---|
| `coach_kong.png` | AI 코치 콩이 (채팅 전용) |
| `hustle_bean.png` | 열정 모드 |
| `pro_bean.png` | 프로 집중 상태 |
| `spark_bean.png` | 에너지 스파크 |
| `zen_bean.png` | 젠 / 안정 상태 |

### 테스트 코드 도입 (Vitest)

v1, v2에는 없었던 **자동화 테스트**가 v3에서 처음 생겼다.

`src/lib/utiles.test.ts`에 핵심 로직 3종 테스트:

```typescript
// 반감기 계산 검증
calculateCurrentCaffeine(200mg, "5시간 전") → ≈ 100mg

// 캐릭터 상태 분기 검증  
getCharacterStatus(0, 400) → 'IDLE'
getCharacterStatus(500, 400) → 'DANGER'

// 동적 반감기 검증
getDynamicHalfLife({ gender: 'M', sensitivity: 'NORMAL' }) → 5
getDynamicHalfLife({ gender: 'F', isMenstruating: true }) → 7.5
```

`package.json`에 `vitest` 추가, `"test": "vitest run"` 스크립트 등록.

### v3에서 사라진 것

v2에 있던 GIF 에셋(`public/assets/gifs/` — 은하수 전환, 카페인 타임라인 애니메이션 webp 파일들)이 v3에서 제거됐다. 방향이 '시각적 화려함'보다 'AI 실용성'으로 이동했다는 신호.

---

## 버전 간 DNA 계승도

```
v1 (Python)
│
│  ✅ 계승: 반감기 공식, 수면 예측, 두통 예보, 치킨 지수
│  ❌ 폐기: Streamlit UI, CSV 저장, 단일 파일 구조
│
▼
v2 (React)
│
│  ✅ 계승: 모든 계산 로직 (TypeScript로 재구현)
│  ➕ 추가: 멀티페이지, 온보딩, 다크모드, Jotai, 브랜치 전략
│  📋 기획: GraphRAG AI 엔진 (미구현)
│
▼
v3 (React + YIE)
│
│  ✅ 계승: v2 전체 (클론 기반 시작)
│  ➕ 추가: YIE GraphRAG 실 연동, CoachChat, 캐릭터 9종, Vitest
│  🚧 진행 중: /rag/evidence 연동, UI v3 리디자인
```

---

## 핵심 알고리즘의 진화

### 반감기 공식

| 버전 | 공식 | 특이사항 |
|---|---|---|
| v1 | `C = C₀ × 0.5^(t/5)` × `0.9^water` | 특별 관리 모드 시 반감기 7h |
| v2 | 동일 + 성별/체중/민감도/생리 변수 | DSM-5 점수로 중독도 측정 추가 |
| v3 | 동일 + Vitest 단위 테스트 | `getDynamicHalfLife()` 함수 분리 |

### 데이터 저장

| 버전 | 저장소 | 특징 |
|---|---|---|
| v1 | `coffee_log.csv` | 서버 필요, 기기 종속 |
| v2 | `localStorage` | 브라우저 내장, 오프라인 가능 |
| v3 | `localStorage` + YIE API | 로컬 + 클라우드 AI 분석 병행 |

---

## 마치며

Cof/fee는 "커피를 마신 시간을 기록하면 어떨까"라는 단순한 아이디어에서 출발해, 세 번의 전면 재설계를 거쳤다. v1은 아이디어를 증명했고, v2는 제대로 된 앱의 형태를 만들었으며, v3는 AI를 실제로 붙이는 단계다.

핵심 알고리즘(반감기 × 수면 예측 × 두통 예보)은 v1부터 지금까지 변하지 않았다. 껍데기가 바뀐 게 아니라, 그 위에 점점 더 많은 것이 쌓였다.

---

*분석 기준일: 2026-06-06*  
*Designed & Developed by 용용*
