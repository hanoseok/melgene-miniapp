# apps/sudoku — 스도쿠 / Sudoku (게임)

고전 9×9 스도쿠. 가로줄·세로줄·3×3 상자마다 1~9를 한 번씩 채우면 완성. 퍼즐은 브라우저에서 바로 만들고(정답이 하나뿐인지 풀이기로 확인), 난이도 4단계(모바일 480px 한 화면).
시작(티징 + 짧은 방법 3칸 + 난이도 4개 + 이어 하기/새 퍼즐/오늘의 퍼즐 + 맨 아래 광고 1개) → 게임(HUD 난이도·실수·시간 + 판 + 도구 5개 + 숫자 패드, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).
화면은 신문 퍼즐 지면 같은 크림색 종이 + 남색 잉크 + 산호색 강조(제목 Fraunces 계열 세리프).

- 생성(`sudoku-core.js` `generate(diff, seed)`): 시드 난수(mulberry32)로 완성판을 무작위로 채우고, 180° 대칭 쌍으로 단서를 지운다. 지울 때마다 `countSolutions(…, 2)` 로 해가 하나인지, 사람 기법 채점기 `grade()` 로 난이도 상한을 지키는지 확인.
  - 채점 단계: 1 = naked/hidden single, 2 = 잠긴 후보(pointing·claiming)·naked/hidden pair, 3 = naked triple·X-Wing, 4 = 그것으로 안 풀림.
  - 쉬움: 단서 목표 38, 1단계만 · 보통: 31, 2단계까지 · 어려움: 26, 3단계까지 + 2단계 이상이 필요한 판을 12번까지 다시 뽑음 · 전문가: 단서 최소(대개 24~28), 3단계 이상이 필요한 판을 10번까지 다시 뽑음.
  - 생성 시간(Node 50판씩): 평균 0.3~4ms, 최대 약 12ms → 모바일 300ms 예산에 충분. 미리 계산한 퍼즐 데이터 없음.
- 오늘의 퍼즐: UTC 날짜 + 난이도로 시드(`dailySeed`) → 전 세계 같은 퍼즐, UTC 자정에 바뀜. 고른 난이도로 만든다.
- 입력: 칸 탭 = 고르기(줄·열·상자 옅게, 같은 숫자 파랗게), 숫자 패드 = 넣기(같은 숫자 다시 = 지우기), 메모 모드 = 후보 숫자, 지우기·되돌리기(최대 300수)·힌트(판마다 3번, 힌트 칸은 잠기고 되돌리기 기록은 비움)·오답 표시(켜면 정답과 다른 숫자 빨강, 꺼도 규칙 충돌은 빨간 테두리). 숫자를 넣으면 이웃 메모에서 그 숫자를 자동으로 지운다. 패드의 작은 숫자 = 남은 개수.
  키보드: ← ↑ → ↓ · 1~9 · Backspace/Delete/0 · N(메모) · Z/Ctrl+Z(되돌리기).
- 실수 = 정답과 다른 숫자를 넣은 횟수(오답 표시와 무관하게 셈).
- 저장: 진행 중인 판은 localStorage `sudoku_save_v1`(움직일 때마다·5초마다·pagehide·탭 숨김) → 시작 화면 "이어서 하기"(난이도·시간 표시). 다 풀면 지운다. 최고 기록 `sudoku_best_v1`(힌트 없는 판만), 마지막 난이도 `sudoku_diff_v1`.
- 시간: 판이 시작되면 바로 시작, 탭을 숨기면 멈추고 판을 가린다(돌아와 탭하면 이어서).
- 숫자는 진짜만: 힌트 없이 푼 판만 `supa.submitScore('sudoku-e|-m|-h|-x', bucket)` 한 번 → 돌아온 실제 분포로 "상위 %/○%보다 빠름"(sweeper·mole 과 같은 방식, 서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김). bucket = 1999 − floor(초 / 5), 클수록 빠름(서버 제한 0..100000·게임당 구간 2000개 안). 새 DB 변경 없음.
- 기록: 새 퍼즐(새 퍼즐·오늘의 퍼즐 버튼) 시작에 `track('start')`, 끝 화면에 닿을 때 `track('done')`. 이어 하기는 start 를 다시 세지 않는다. 다시 하기(공통 끝 화면) = 시작 화면으로.
- 접근성: 칸은 `<button>`(aria-label = 행·열·값/메모), 난이도는 radiogroup, 메모·오답 표시는 aria-pressed, 패드 키 aria-label = 숫자·남은 개수. prefers-reduced-motion 이면 커서 깜빡임·완성 물결을 끈다.
- 포털 큐레이션 문구(12개 언어 kicker/headline/blurb): `tools/hub-curation.json` — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 `{ id: 'sudoku', … }` 로 옮겨 넣는다(이 앱 작업에서는 hub 를 고치지 않았다 — 넣기 전에는 `node tools/gen-all.js` 가 hub 큐레이션 누락으로 멈춘다).

주소: 원본은 자리표시자 `https://sudoku.example.com/`, 배포 때 `https://melgene.com/sudoku/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔢·카테고리 game·등록일 2026-10-12·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `sudoku-core.js` | 규칙(UMD): 칸·묶음 표, 비트마스크 풀이기(`countSolutions`·`solve`), 기법 채점기(`grade`), 생성기(`generate`), 오늘의 퍼즐 시드, 힌트 칸·충돌·숫자 개수, bucket·percentile |
| `sudoku.js` | 화면 동작: 판·패드·도구·키보드·시간·일시정지·저장/이어 하기·끝 화면·점수 전송. 검사용 `window.SUDOKU_APP` (phase/game/elapsed/diff/fillAllButOne) |
| `style.css` | 퍼즐 지면(클래스 앞머리 `sd-`) (제목 Fraunces / ko Gowun Batang / ja Shippori Mincho / zh Noto Serif SC / th Trirong / vi·ru Lora(+ vi Be Vietnam Pro), 숫자는 본문 글꼴) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어 (머지용) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-sudoku.js` | 로직(풀이기·난이도마다 50판 생성: 정답 규칙·단서=정답·해 하나·대칭·단서 범위·채점 상한·시간, 결정성·오늘의 퍼즐, 힌트·충돌·문자열, bucket/백분위)·언어 파일(키·번역·자리표시자·FAQ·버튼 이름·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·난이도 라디오 4·이어 하기 숨김·게임 중 광고 0·패드 9·도구 5·퍼즐/정답 미노출·끝 화면 순서·FAQPage 없음)·앱 JS(일시정지·자동 저장·힌트 없는 판만 점수·한 곳씩 track)·OG·hub-curation.json 검사 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js sudoku       # 이 앱 검사만

# 이 폴더(apps/sudoku)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node ../../tools/gen-guides.js sudoku && MG_I18N_MODE=variant node ../../tools/gen-guides.js sudoku
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-sudoku.js
```
