# apps/snowball — 눈싸움 (게임)

눈싸움(Snowball Fight, 雪合戦, 打雪仗, Снежки). **내 눈벽 뒤에서, 눈 요새 뒤로 솟아오르는 아이·눈사람을 눌러 맞히고, 날아오는 눈덩이는 숙여서 피하는 60초 게임.** 그림은 모두 코드로 그린다(아이·눈사람·강아지, 저작권 캐릭터 없음).
- 마당: 요새 5곳(뒷줄 2 · 앞줄 3, `SLOTS`). 상대는 솟기(170ms) → 보임(upMs) → 내려가기, 맞으면 쓰러짐(420ms).
- 던지기: 마당(내 눈벽 위)을 누르면 그 자리로 던진다 — 상대가 있으면 그 상대를 겨냥. 공은 240ms(앞줄)·300ms(뒷줄) 뒤 도착, 그때 상대가 아직 서 있어야 명중. 숙인 동안·쿨다운(200ms)·공 3개 비행 중엔 못 던짐.
- 상대: 아이 10 · 눈사람 15 · 황금 눈사람 50(약 4%, 짧게, 안 던짐) · 강아지·흰 깃발 아이 = 친구(약 14%, 맞히면 −25, 0 밑으로 안 내려감).
- 콤보: 연속 명중마다 × (1 + 0.1 × min(콤보−1, 10)). 빗나감·친구 명중·내가 맞음 = 콤보 0.
- 되받아치기: 아이·눈사람이 팔을 들고 머리 위 빨간 ❗(wind) → 공 던짐(incoming, 화면 쪽으로 커지며 날아옴, 벽 위 큰 ❗·숙이기 버튼 빨강). 도착할 때 숙이고 있으면 막음, 아니면 하트 −1. 팔 드는 중에 맞히면 던지지 못함. 하트 3개를 다 잃으면 끝(out).
- 난이도: 50초에 걸쳐 등장 간격 1050→470ms, 동시에 2→4명, 보이는 시간 1750→950ms, 던질 확률 30→65%, 공 비행 1000→720ms.
- 입력: 마당 누르기 = 던지기, 내 눈벽·숙이기 버튼 누르고 있기 = 숙이기. 키보드 ←/→(A/D) 요새 고르기 · ↑/W/F/Enter 던지기 · 스페이스/↓/S 누르고 있기 = 숙이기 · P/Esc 일시정지.
- 결과 = 점수 + 끝난 이유(시간/아웃) + 맞힌 수 + 명중률 + 최고 콤보 + 등급(6단계 중 내 것만: 0·150·350·600·900·1300점) + 내 최고 + 서버 실제 백분위.
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 점수·시간·하트·일시정지 + 캔버스 + 숙이기 버튼, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).

- 흐름: 시작 버튼 = 준비 상태("마당을 누르면 시작"), **첫 입력(마당·숙이기 버튼·키)이 판을 시작하고 `track('start')`**, 끝 화면에 닿을 때 `track('done')`. 다시 하기 = 새 준비 상태.
- 고정 시간 간격(1/120초 tick, 큰 dt 는 100ms 로 자름) → 같은 시드 + 같은 입력 = 같은 판. 난수 = crypto 시드 mulberry32.
- 탭을 떠나면(visibilitychange·pagehide) 자동 일시정지(시계도 멈춤).
- `prefers-reduced-motion`: 내리는 눈을 적게(14개)·멈춘 채로, 흔들림·번쩍임·떠오르는 글자 움직임 끔, 끝 화면까지 0.45초.
- 숫자는 진짜만: `supa.submitScore('snowball', bucket)` 한 번, bucket = min(350, floor(점수 / 10)). **`C.plausible(s)` 가 거짓이면(60초를 다 채우지 않은 time·하트가 남은 out·3500점 초과·맞힌 수 160 초과·맞힌 수 > 던진 수) 보내지 않는다.** 서버 없음·실패·비교할 기록 없음 → 백분위 칸 통째로 숨김.
- 최고 기록: localStorage `snowball_best_v1`.
- 검사용 핸들 `window.SB_APP` (phase, state, best, timeScale, control(duck), autopilot, throwAt(x, y), begin).

주소: 원본은 자리표시자 `https://snowball.example.com/`, 배포 때 `https://melgene.com/snowball/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(☃️·game·2026-11-14·order 1·12개 언어 제목/설명) |
| `snowball-core.js` | 요새 자리·상대 종류·등장·던지기(겨냥·비행·명중/빗나감)·콤보·되받아치기(경고·막기·하트)·난이도·60초·등급·plausible·자동 플레이·bucket·백분위 (UMD) |
| `snowball.js` | 화면·입력·캔버스 그리기(하늘·언덕·눈 마당·요새·아이·눈사람·황금 눈사람·강아지·흰 깃발·공·날아오는 공·내 눈벽·나·내리는 눈)·HUD·일시정지·끝 화면·점수 전송. 검사용 `window.SB_APP` |
| `style.css` | 겨울 하늘 파랑 + 눈 흰색 + 목도리 빨강·황금 포인트, 숫자 Fredoka |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `tools/i18n/<lang>.js` · `tools/guide/<lang>.js` | 문구 · 긴 글 가이드 (12개 언어) |
| `tools/gen-i18n.js` · `tools/gen-og.js` | 페이지·사이트맵 생성 · OG 이미지 |
| `tools/check-snowball.js` | 로직(준비·고정 tick·재현·60초·하트·종류·던지기·콤보·친구·되받아치기·난이도·자동 플레이 40판·plausible)·언어 파일(360px 폭 포함)·생성 HTML·OG 검사 (check-all 자동) |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 이 폴더(apps/snowball)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-snowball.js
node tools/flow-test.js en,ko,ru 360,375,1440      # 실제 흐름 (몇 분)
```
