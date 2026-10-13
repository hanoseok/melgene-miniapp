# apps/1to50 — 1to50 / 1 to 50 Game (게임)

고전 1to50 숫자 터치 게임(슐테 테이블 변형). 5×5 판에 1~25 가 섞여 있고, 다음 숫자를 순서대로 최대한 빨리 누른다. 모바일 480px 한 화면.
시작(티징 + 짧은 방법 3칸 + 모드 고르기 + 맨 아래 광고 1개) → 게임(HUD 다음·시간·진행 + 진행 막대 + 5×5 판 + 3-2-1, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).
화면은 밝은 하늘색 놀이판(흰 바탕 + 파랑 타일 두 단계 + 산호색 강조) — 다른 게임 앱의 어두운 화면과 다르게.

- 모드: 클래식 1→50(game `1to50-50`), 빠른 모드 1→25(game `1to50-25`) (`1to50-core.js` `MODES`). 마지막으로 고른 모드는 localStorage `one50_mode_v1`.
- 규칙: 판 = 1..25 순열(crypto 시드 + mulberry32). classic 은 1..25 를 누르면 그 칸에 26..50(미리 섞은 줄에서 차례로)이 나오고, 26..50 을 누르면 칸이 빈다. quick 은 누른 칸이 바로 빈다.
- **틀린 터치 = 벌점 0.5초**(`PENALTY_MS`, 결정 사항): 칸이 흔들리고 HUD 에 "+0.5" 가 뜨며 시간에 더해진다. 빈 칸 터치는 무시(벌점 없음). 시작 화면 방법 칸·FAQ·가이드에 같은 규칙을 적었다. 최종 시간 = 시계 + 실수 × 0.5초.
- 입력: 칸 `pointerdown` 에서 바로 처리(300ms 지연 없음), 판·칸 `touch-action: manipulation`(더블탭 확대 없음), 글자 선택·길게 누르기 메뉴 막음. 키보드 Enter/Space 도 같은 동작(click detail 0).
- 시간: 3-2-1(700ms 간격, 판은 가림) 뒤 GO 와 함께 숫자가 보이고 시작, requestAnimationFrame 으로 0.01초 표시. 탭을 숨기면(visibilitychange) 멈추고 판을 가린다 → 누르면 다시 3-2-1 뒤 이어서.
- 끝 화면: 모드 배지 · 큰 숫자(초, 0.01) · 최고 기록(모드별 최단, localStorage `one50_best_v1` — 첫 기록은 "새 기록" 배지 없음) · 통계 칸(틀린 터치·숫자당 시간) · 벌점 안내(실수가 있을 때만) · 서버 백분위.
- 숫자는 진짜만: 끝낸 판마다 `supa.submitScore('1to50-50' | '1to50-25', bucket)` 한 번 → 돌아온 실제 분포로 "상위 %/○%보다 빠름"(sweeper·sudoku 와 같은 방식, 서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김). bucket = 1999 − round(초 × 10)(0.1초 단위, 199.9초까지), 클수록 빠름. 말이 안 되게 빠른 기록(classic 6초 미만, quick 3초 미만)은 보내지 않는다(`plausible`). 새 DB 변경 없음.
- 기록: 시작(다시 하기 포함) `track('start')`, 끝 화면에 닿을 때 `track('done')`.
- 접근성: 칸은 `<button>`(빈 칸은 aria-label "빈 칸"·aria-disabled), 모드는 radiogroup, 다음 숫자는 aria-live. prefers-reduced-motion 이면 흔들림 대신 색만 바꾸고 애니메이션·진동을 끈다.
- 포털 큐레이션 문구(12개 언어 kicker/headline/blurb): `tools/hub-curation.json` — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 `{ id: '1to50', … }` 로 옮겨 넣는다(이 앱 작업에서는 hub 를 고치지 않았다).

주소: 원본은 자리표시자 `https://1to50.example.com/`, 배포 때 `https://melgene.com/1to50/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔢·카테고리 game·등록일 2026-10-14·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `1to50-core.js` | 규칙(UMD): `newGame`·`tap`(정답/실수/빈칸)·`progress`·`penaltyMs`·`plausible`, 시드 난수, 모드별 bucket·percentile |
| `1to50.js` | 화면 동작: 판 DOM·pointerdown 입력·3-2-1·시계(rAF)·일시정지·끝 화면·점수 전송. 검사용 `window.ONE50_APP` (phase/state/best/elapsed/mode) |
| `style.css` | 하늘색 놀이판(클래스 앞머리 `ot-`) (제목 Fredoka / ko Jua / ja M PLUS Rounded 1c / zh ZCOOL KuaiLe / th Mitr / vi Baloo 2 + Be Vietnam Pro / ru Rubik, 숫자는 모든 언어 Fredoka) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어 (머지용) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-1to50.js` | 로직(1..25 판·26..50 줄·정답/실수/빈칸·결정성·봇 500판 불변식·bucket/백분위/plausible)·언어 파일(키·번역·자리표시자·벌점 안내·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·모드 라디오 2·게임 중 광고 0·숫자 칸 미리 없음·끝 화면 순서·FAQPage 없음)·앱 JS(pointerdown·3-2-1·일시정지·한 곳씩 track)·OG·hub-curation.json 검사 |
| `tools/flow-test.js` | 실제 흐름(Chrome headless + CDP, mock-supa): 시작 → 3-2-1 → 틀린 터치 1번 → 1..50 터치 → 끝 화면(순서·백분위·공유) → 다시 하기. check-all 에는 안 들어감(느림) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js 1to50        # 이 앱 검사만

# 이 폴더(apps/1to50)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-1to50.js
node tools/flow-test.js              # en,ko × 360,1440 (+ 빈 서버 1회)
```
