# apps/memory — 카드 짝 맞추기 / Memory Match Game (게임)

할로윈 카드 짝 맞추기(신경쇠약·Concentration). 엎어 둔 카드를 두 장씩 뒤집어 같은 그림 짝을 모두 찾는다. 모바일 480px 한 화면.
시작(티징 + 난이도 고르기 + 시작 버튼 + 한 줄 방법 + 맨 아래 광고 1개) → 게임(HUD 시간·횟수·찾은 짝 + 진행 막대 + 카드 판, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).
화면은 할로윈 밤(짙은 보라 + 호박 주황 + 연두 강조, 카드 뒷면 = 보라 거미줄 무늬, 앞면 = 크림색 + 이모지). 외부 그림 없음.

- 난이도: 쉬움 4×3(6쌍, game `memory-easy`) · 보통 4×4(8쌍, `memory-normal`) · 어려움 4×6(12쌍, `memory-hard`) (`memory-core.js` `LEVELS`). 360px 에서 카드 약 73px. 마지막으로 고른 난이도는 localStorage `memory_level_v1`.
- 그림: 할로윈 이모지 12개(`SYMBOLS`, ZWJ 묶음 없음) 중 판마다 쌍 수만큼 무작위로 고른다.
- 섞기: 편향 없는 Fisher–Yates + `crypto.getRandomValues` 거부 샘플링(`cryptoRandInt`). 검사용 시드 난수는 `seededRandInt`.
- 규칙: 두 장이 같으면 짝(열린 채), 다르면 0.7초(`MISS_MS`) 뒤 다시 엎는다 — 그 전에 다른 카드를 누르면 바로 엎고 새 카드를 뒤집는다. 한 수 = 두 장. 정확도 = 짝 ÷ 수 × 100. 미리 보기 없음. 앞면 그림은 앞면일 때만 DOM 에 넣는다.
- 입력: 카드 `pointerdown` 에서 바로 처리(300ms 지연 없음), 판·카드 `touch-action: manipulation`(더블탭 확대 없음), 글자 선택·길게 누르기 메뉴 막음. 키보드 Enter/Space 도 같은 동작(click detail 0).
- 시간: 첫 카드를 뒤집을 때 시작, 0.1초 표시(rAF). 탭을 숨기면(visibilitychange) 멈추고 카드를 가린다(틀린 두 장은 엎음) → 누르면 이어서.
- 끝 화면: 난이도 배지 · 큰 숫자(초, 0.1) · 최고 기록(난이도별 최단 시간 + 그때 수, localStorage `memory_best_v1` — 첫 기록은 "새 기록" 배지 없음) · 통계 칸(뒤집은 횟수·정확도) · 서버 백분위.
- 숫자는 진짜만: 끝낸 판마다 `supa.submitScore('memory-<난이도>', bucket)` 한 번 → 돌아온 실제 분포로 "상위 %/○%보다 빠름"(1to50 과 같은 방식, 서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김). bucket = 9999 − round(초 × 10)(0.1초 단위), 클수록 빠름. 말이 안 되는 기록(쉬움 4초·보통 6초·어려움 9초 미만, 또는 수 < 쌍 수)은 보내지 않는다(`plausible`). 새 DB 변경 없음.
- 기록: 시작(다시 하기 포함) `track('start')`, 끝 화면에 닿을 때 `track('done')`.
- 접근성: 카드는 `<button>`(뒷면은 aria-label "N번 카드, 뒷면", 짝은 aria-disabled), 난이도는 radiogroup, 찾은 짝은 aria-live. prefers-reduced-motion 이면 뒤집기·흔들림 애니메이션과 진동을 끈다.
- 포털 큐레이션 문구(12개 언어 kicker/headline/blurb): `tools/hub-curation.json` — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 `{ id: 'memory', … }` 로 옮겨 넣는다(이 앱 작업에서는 hub 를 고치지 않았다).

주소: 원본은 자리표시자 `https://memory.example.com/`, 배포 때 `https://melgene.com/memory/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🃏·카테고리 game·등록일 2026-10-16·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `memory-core.js` | 규칙(UMD): `newGame`·`flip`·`hideMismatch`·`accuracy`·`progress`·`plausible`, crypto 섞기, 난이도별 bucket·percentile |
| `memory.js` | 화면 동작: 카드 DOM·pointerdown 입력·0.7초 엎기·시계(rAF)·일시정지·끝 화면·점수 전송. 검사용 `window.MEMORY_APP` (phase/state/best/elapsed/level) |
| `style.css` | 할로윈 밤 판(클래스 앞머리 `mm-`) (제목 Fredoka / ko Jua / ja M PLUS Rounded 1c / zh ZCOOL KuaiLe / th Mitr / vi Baloo 2 + Be Vietnam Pro / ru Rubik, 숫자는 모든 언어 Fredoka) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어 (머지용) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-memory.js` | 로직(난이도·두 장씩·뒤집기/짝/틀림/바로 엎기·결정성·crypto 섞기 고름·봇 600판·bucket/백분위/plausible)·언어 파일(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·난이도 라디오 3·게임 중 광고 0·카드 미리 없음·끝 화면 순서·FAQPage 없음)·앱 JS·OG·hub-curation.json 검사 |
| `tools/flow-test.js` | 실제 흐름(Chrome headless + CDP, mock-supa): 시작 → 틀린 두 장(0.7초 뒤 엎임) → 일시정지/이어 하기 → 모든 짝 → 끝 화면(순서·백분위·공유) → 다시 하기. 12개 언어(en·ko 는 360/1440 × 쉬움/어려움). check-all 에는 안 들어감(느림) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js memory       # 이 앱 검사만

# 이 폴더(apps/memory)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-memory.js
node tools/flow-test.js              # en,ko × 360,1440 × 쉬움/어려움 + 나머지 언어 360 + 빈 서버 1회
```
