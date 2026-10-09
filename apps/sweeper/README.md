# apps/sweeper — 지뢰찾기 / Minesweeper (게임)

고전 지뢰찾기. 숫자(주변 지뢰 수)를 단서로 지뢰가 아닌 칸을 모두 열면 승리, 지뢰를 열면 패배. 난이도 3단계(모바일 480px 한 화면, 스크롤 없음).
시작(티징 + 짧은 방법 3칸 + 난이도 고르기 + 맨 아래 광고 1개) → 게임(HUD 지뢰·시간·열기/깃발 버튼 + 칸 격자, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).
화면은 레이더 같은 짙은 청록 밤 + 주황 경고색·민트 안전색(brick 의 네온 보라와 다름).

- 난이도: 초급 9×9 / 지뢰 10, 중급 12×12 / 24, 고급 14×14 / 40 (`sweeper-core.js` `DIFFS`). 마지막으로 고른 난이도는 localStorage `sweeper_diff_v1`.
- 첫 클릭은 언제나 안전: 지뢰는 첫 칸을 연 뒤에 깔고, 첫 칸과 둘레 8칸(3×3)에는 놓지 않는다 → 첫 칸은 항상 빈 칸(0)이라 둘레가 flood fill 로 열린다. 시드 mulberry32 — 같은 시드 + 같은 첫 칸 = 같은 배치.
- 입력: 탭/클릭 = 열기, 길게 누르기(터치·펜 420ms, 움직이면 취소) · 마우스 오른쪽 · 판 위 열기/깃발 버튼(깃발 모드) = 깃발, 열린 숫자 탭 = chord(주변 깃발 수 = 숫자일 때 나머지 열기, 틀린 깃발이면 터짐), 키보드 ← ↑ → ↓ 이동 · Enter/Space 열기 · F 깃발. 터치 길게 누르기엔 짧은 진동(prefers-reduced-motion 이면 끔).
- 시간: 첫 클릭에 시작, 탭을 숨기면(visibilitychange) 멈추고 판을 가린다(돌아와 탭하면 이어서 — 가려서 몰래 풀기 방지). 지뢰 카운터 = 지뢰 − 깃발(0 아래로 내려갈 수 있음).
- 승리: 안전한 칸을 모두 열면 won(남은 지뢰는 자동 깃발). 패배: 지뢰가 드러나고 터진 칸 표시, 틀린 깃발은 ✗ 스타일. 끝나면 1.3초(움직임 줄이기 0.4초) 판을 보여 준 뒤 끝 화면.
- 끝 화면: 난이도 배지 · 승/패 머리 · 큰 숫자(승 = 걸린 초, 패 = 연 비율 %) · 최고 기록(난이도별 최단, localStorage `sweeper_best_v1` — 첫 기록은 "새 기록" 배지 없음) · 통계 칸(시간·연 비율) · 서버 백분위.
- 숫자는 진짜만: 이긴 판에서만 `supa.submitScore('sweeper-b|-i|-e', bucket)` 한 번(난이도마다 game 이름) → 돌아온 실제 분포로 "상위 %/○%보다 빠름"(mole·brick 과 같은 방식, 서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김). bucket = 1999 − round(초 × 2), 클수록 빠름. 새 DB 변경 없음(game 이름은 `^[a-z0-9-]{1,32}$` 면 됨).
- 기록: 시작(다시 하기 포함) `track('start')`, 끝 화면에 닿을 때 `track('done')`(승·패 모두).
- 접근성: 칸은 `<button>`(roving tabindex, aria-label = 닫힘/깃발/지뢰/주변 N개), 난이도는 radiogroup, 깃발 모드 버튼은 aria-pressed. prefers-reduced-motion 이면 티저 깜빡임·진동·끝 지연 단축.
- 포털 큐레이션 문구(12개 언어 kicker/headline/blurb): `tools/hub-curation.json` — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 `{ id: 'sweeper', … }` 로 옮겨 넣는다(이 앱 작업에서는 hub 를 고치지 않았다).

주소: 원본은 자리표시자 `https://sweeper.example.com/`, 배포 때 `https://miniapp.melgene.com/sweeper/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 💣·카테고리 game·등록일 2026-10-10·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `sweeper-core.js` | 규칙(UMD): `newGame`·`reveal`(첫 칸 뒤 지뢰 배치·반복문 flood fill)·`toggleFlag`·`chord`·`minesLeft`·`progress`·`wrongFlags`, 시드 난수, 난이도별 bucket·percentile |
| `sweeper.js` | 화면 동작: 칸 격자 DOM·입력(탭/길게/우클릭/키보드/chord)·시간·일시정지·끝 화면·점수 전송. 검사용 `window.SWEEPER_APP` (phase/state/best/elapsed/diff) |
| `style.css` | 레이더 화면(클래스 앞머리 `tf-`) (제목 Audiowide / ko Do Hyeon / ja DotGothic16 / zh ZCOOL QingKe HuangYou / th·vi Chakra Petch(+ vi Be Vietnam Pro) / ru Russo One, 숫자는 본문 글꼴 굵게) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어 (머지용) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-sweeper.js` | 로직(난이도 크기·첫 클릭 안전 450판 모든 난이도·모서리·결정성·flood fill·깃발·chord·승패·풀이기 300판·무작위 봇 180판 불변식·bucket/백분위)·언어 파일(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·난이도 라디오 3·게임 중 광고 0·판에 지뢰 배치 없음·끝 화면 순서·FAQPage 없음)·앱 JS(일시정지·길게 누르기·chord·한 곳씩 track)·OG·hub-curation.json 검사 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js sweeper      # 이 앱 검사만

# 이 폴더(apps/sweeper)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-sweeper.js
```
