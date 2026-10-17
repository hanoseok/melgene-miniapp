# apps/baseball — 숫자 야구 / Bulls and Cows (게임)

숫자 야구(불스 앤 카우스·히트 앤 블로·1A2B). 컴퓨터가 서로 다른 숫자로 정한 비밀 번호(3자리 또는 4자리)를 추리해 맞힌다. 모바일 480px 한 화면.
시작(티징 + 자릿수 고르기 + 타이머 선택 + 시작 버튼 + 한 줄 방법 + 맨 아래 광고 1개) → 게임(HUD 시도·시간 + 입력칸 + 숫자 패드 + 추리 기록, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).
화면은 야간 경기장(짙은 초록 + 크림 + 실밥 빨강, 스트라이크 = 노랑 · 볼 = 연두 · 아웃 = 빨강 전광판 색). 외부 그림 없음.

- 난이도: 3자리(game `baseball-3`, 가능한 비밀 번호 10×9×8 = 720가지) · 4자리(`baseball-4`, 5,040가지) (`baseball-core.js` `LEVELS`). 마지막으로 고른 자릿수는 localStorage `baseball_level_v1`, 타이머 선택은 `baseball_timer_v1`.
- 비밀 번호: 0~9 를 편향 없는 Fisher–Yates + `crypto.getRandomValues` 거부 샘플링(`cryptoRandInt`)으로 섞어 앞에서 자릿수만큼. 숫자는 서로 달라야 하고 맨 앞 0 허용(072). 검사용 시드 난수는 `seededRandInt`. 정답은 HTML 에 없고 시작할 때 JS 가 만든다.
- 판정(`judge`): 스트라이크 = 숫자·자리 모두 일치, 볼 = 숫자만 일치, 둘 다 0 이면 아웃. 내 추리도 서로 다른 숫자여야 하고(길이·모양·중복 오류와 이미 시도한 숫자는 시도로 세지 않음), 모든 자리가 스트라이크면 정답. **힌트·풀이 도움은 없다**(남은 후보를 세거나 추천하는 코드 없음 — check 가 이름으로 한 번 더 본다). 포기하기는 두 번 눌러야 정답을 보여 준다(포기한 판은 기록·서버 점수에 넣지 않음).
- 입력: 화면 숫자 패드 `pointerdown` 에서 바로 처리(300ms 지연 없음), 패드 `touch-action: manipulation`(더블탭 확대 없음), 글자 선택·길게 누르기 메뉴 막음. 키보드는 숫자·Backspace·Enter, 버튼 Enter/Space 는 click(detail 0). 이미 쓴 숫자는 패드에서 흐리게.
- 시간(선택): 시작 화면 체크박스로 켜면 첫 숫자를 누를 때 시작, 0.1초 표시(rAF). 탭을 숨기면 멈추고 돌아오면 이어 간다. 꺼 두면 HUD·결과에 시간이 없다.
- 끝 화면: 자릿수 배지 · 정답 칸 · 시도 횟수(큰 숫자) · 최고 기록(자릿수별 최소 시도 + 타이머를 켰을 때의 시간, localStorage `baseball_best_v1` — 첫 기록은 "새 최고 기록" 배지 없음) · 서버 백분위.
- 숫자는 진짜만: 맞힌 판마다 `supa.submitScore('baseball-<자릿수>', bucket)` 한 번 → 돌아온 실제 분포로 "상위 %/○%보다 적은 횟수"(memory·1to50 과 같은 방식, 서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김). bucket = 1000 − 시도 횟수(클수록 적은 횟수, `plausible` 1~999 정수). 새 DB 변경 없음(`submit_score` 는 game 이름 `^[a-z0-9-]{1,32}$`, bucket 0~100000).
- 기록: 시작(다시 하기 포함) `track('start')`, 끝 화면(맞힘·포기 모두)에 닿을 때 `track('done')`.
- 접근성: 입력칸 role=img + aria-label, 패드는 `<button>`, 자릿수는 radiogroup, 오류·결과는 aria-live. prefers-reduced-motion 이면 흔들림·공 애니메이션과 진동을 끈다.
- 포털 큐레이션 문구(12개 언어 kicker/headline/blurb): `tools/hub-curation.json` → `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 `{ id: 'baseball', … }` 로 넣었다.

주소: 원본은 자리표시자 `https://baseball.example.com/`, 배포 때 `https://melgene.com/baseball/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 ⚾·카테고리 game·등록일 2026-10-18·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `baseball-core.js` | 규칙(UMD): `newSecret`·`validate`·`judge`·`newGame`·`guess`·`giveUp`·`plausible`, crypto 섞기, 자릿수별 bucket·percentile |
| `baseball.js` | 화면 동작: 입력칸·숫자 패드·추리 기록·시계(rAF, 선택)·포기·끝 화면·점수 전송. 검사용 `window.BASEBALL_APP` (phase/state/best/elapsed/level/input) |
| `style.css` | 야간 경기장(클래스 앞머리 `bb-`) (제목 Fredoka / ko Jua / ja M PLUS Rounded 1c / zh ZCOOL KuaiLe / th Mitr / vi Baloo 2 + Be Vietnam Pro / ru Rubik, 숫자는 모든 언어 Fredoka) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `tools/i18n/<lang>.js` | 모든 문구 12개 언어(검색어: ko 숫자 야구 · en Bulls and Cows · ja ヒット&ブロー(ヌメロン風) · zh 猜数字 1A2B · fr Taureaux et vaches · de Zahlenraten · th เกมทายตัวเลข · vi Đoán số · es Toros y vacas · it Tori e vacche · pt Touros e vacas · ru Быки и коровы) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(`guide.html`) — 스포일러 없음(정답·풀이 목록 없음) |
| `tools/gen-i18n.js`, `tools/gen-og.js` | 페이지 생성(보통 + `MG_I18N_MODE=variant`), OG 이미지 12장 |
| `tools/check-baseball.js` | 검사(로직 전수 대조·언어 파일·생성 HTML·OG·등록·큐레이션) |
| `tools/hub-curation.json` | 포털 큐레이션 문구 원본 |

## 생성·검사

```bash
node tools/gen-all.js                       # 모든 사이트 + 가이드 + 링크 검사 (저장소 루트)
cd apps/baseball
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all                    # OG 이미지 (네트워크 필요)
node tools/check-baseball.js                # 이 앱 검사 (또는 루트에서 node tools/check-all.js baseball)
```
