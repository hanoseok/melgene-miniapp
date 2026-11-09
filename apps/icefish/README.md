# apps/icefish — 얼음 낚시 (게임)

얼음 낚시(Ice Fishing, 穴釣りゲーム, 冰钓游戏, Зимняя рыбалка). **옆에서 본 꽁꽁 언 호수 — 얼음 구멍으로 줄을 내려 60초 동안 물고기를 낚는 게임.** 그림은 모두 코드로 그린다(낚시꾼·물고기·장화, 저작권 캐릭터 없음).
- 줄 내리기: 물속을 누르고 있으면 바늘이 누른 깊이로 움직이고(LINE_SPEED, 위·아래 모두), 떼면 그 자리에 멈춘다. ↓/S·스페이스 = 아래로, ↑/W = 위로.
- 입질: 바늘이 멈춰 있을 때 다가오는 물고기는 바늘 깊이로 조금씩 끌려오고, 바늘 바로 앞에서 **한 마리당 한 번** 입질을 굴린다(종류별 확률, 난수 = crypto 시드 mulberry32). 실패하면 그냥 지나간다.
- 줄다리기: 누르고 있으면 감기(바늘 올라옴 + 장력 상승), 떼면 장력이 내려가고 물고기가 줄을 끌고 내려간다. 물고기마다 힘(str)·발버둥(tug, 갑자기 장력 +). 장력 ≥ 1 = 줄 끊어짐, 거의 0 으로 1.8초 넘게 느슨 = 빠져나감, 얼음 아래 도착 = 잡힘. 빨간 구간(0.75~)에서 손을 떼는 게 요령. 오른쪽 장력 막대, 왼쪽 남은 거리 점.
- 물고기 6종: 작은 물고기 10 · 중간 20 · 30급 35 · 대물 60 · 황금(드묾, 약 2.6%) 150 · 장화(쓰레기, 바닥) 0점. 이름은 언어별 현지 어종(ko 빙어·붕어·송어·쏘가리, ja ワカサギ·フナ·ニジマス·イトウ, ru Ёршик·Окунь·Форель·Щука 등).
- 결과 = 점수 + 잡은 물고기 수 + 끊어진 줄 수 + 최고의 한 마리 + 등급(6단계 중 내 것만: 0·80·180·300·450·650점) + 내 최고 + 서버 실제 백분위.
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 점수·남은 시간·일시정지 + 캔버스, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).

- 흐름: 시작 버튼 = 준비 상태("얼음 아래를 누르고 있으면…"), **첫 입력(필드 누르기·↓/↑·스페이스)이 판을 시작하고 `track('start')`**, 60초가 끝나 끝 화면에 닿을 때 `track('done')`. 다시 하기 = 새 준비 상태.
- 고정 시간 간격(1/120초 tick, 큰 dt 는 100ms 로 자름) → 같은 시드 + 같은 입력 = 같은 판.
- 탭을 떠나면(visibilitychange·pagehide) 자동 일시정지(시계도 멈춤), P/Esc 일시정지.
- `prefers-reduced-motion`: 거품·수초 흔들림·떠오르는 글자 움직임·번쩍임 끔, 끝 화면까지 0.45초.
- 숫자는 진짜만: `supa.submitScore('icefish', bucket)` 한 번, bucket = min(400, floor(점수 / 5)). **`C.plausible(s)` 가 거짓이면(60초를 다 채우지 않음·1500점 초과·잡은 수 30 초과) 보내지 않는다.** 서버 없음·실패·비교할 기록 없음 → 백분위 칸 통째로 숨김.
- 최고 기록: localStorage `icefish_best_v1`.
- 검사용 핸들 `window.ICE_APP` (phase, state, best, timeScale, control(hold, target), autopilot, begin).

주소: 원본은 자리표시자 `https://icefish.example.com/`, 배포 때 `https://melgene.com/icefish/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎣·game·2026-11-10·order 1·12개 언어 제목/설명) |
| `icefish-core.js` | 물고기 종류·등장·입질·줄 내리기·줄다리기(장력·끊어짐·빠져나감·잡힘)·60초·점수·등급·plausible·자동 낚시·bucket·백분위 (UMD) |
| `icefish.js` | 화면·입력·캔버스 그리기(하늘·얼음판·구멍·물·빛줄기·거품·수초·물고기·장화·낚시꾼·낚싯대 휨·장력 막대)·HUD·일시정지·끝 화면·점수 전송. 검사용 `window.ICE_APP` |
| `style.css` | 얼음 하늘색 + 깊은 호수 남청색 + 빨강·황금 포인트, 숫자 Fredoka |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `tools/i18n/<lang>.js` · `tools/guide/<lang>.js` | 문구 · 긴 글 가이드 (12개 언어) |
| `tools/gen-i18n.js` · `tools/gen-og.js` | 페이지·사이트맵 생성 · OG 이미지 |
| `tools/check-icefish.js` | 로직(준비·줄 내리기·고정 tick·재현·60초·종류·입질·줄다리기·자동 낚시 40판·plausible)·언어 파일(360px 폭 포함)·생성 HTML·OG 검사 (check-all 자동) |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 이 폴더(apps/icefish)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-icefish.js
node tools/flow-test.js en,ko,ru 360,375,1440      # 실제 흐름 (몇 분)
```
