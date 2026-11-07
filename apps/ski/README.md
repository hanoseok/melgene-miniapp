# apps/ski — 스키 활강 (게임)

스키 활강(Ski Downhill, スキーゲーム, 滑雪游戏, Горные лыжи). **끝없이 이어지는 설산 슬로프를 내려가며 장애물을 피하는 엔드리스 게임.** 스키어는 화면 위쪽 1/3 에 고정, 세계가 위로 흐른다.
- 조종: 필드 왼쪽/오른쪽 절반을 누르고 있기(pointer, 여러 손가락이면 마지막 손가락) 또는 ←/→·A/D 키를 누르고 있기. 옆 속도가 목표(±MAX_VX)로 부드럽게 따라간다(STEER_RESP). 양 끝은 막혀 있을 뿐 넘어지지 않는다. 크게 꺾으면 앞 속도가 조금 준다(TURN_DRAG).
- 장애물: 소나무·바위·눈사람(충돌 반지름은 그림보다 작게). 닿으면 끝(미끄러지며 넘어짐 → 1.1초 뒤 끝 화면).
- 기문: 빨강/파랑 번갈아 깃발 두 개. 사이를 지나면 콤보 +1, 보너스 = 5 m × min(콤보, 5). 바깥으로 지나면 콤보 0(끝나지 않음).
- 속도는 거리에 따라 빨라지고(220 → 540 단위/초), 줄 간격은 좁아지고, 장애물은 많아진다. 점수(m) = 내려온 거리(10 단위 = 1 m) + 기문 보너스.
- 코스: 줄(row) 단위로 미리 만든다. 줄마다 안전한 길(lane)이 있고 다음 줄 lane 은 따라갈 수 있는 만큼만(shiftAt) 움직인다 — 언제나 지나갈 수 있다(check 가 자동 조종 40판 × 2,000 m 로 확인). 시드 = `crypto.getRandomValues`.
- 결과 = 거리(m) + 통과한 기문 + 주행 시간 + 등급(6단계 중 내 것만: 0·300·700·1300·2200·3500 m) + 내 최고 + 서버 실제 백분위.
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 거리·최고·일시정지 + 캔버스, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).

- 흐름: 시작 버튼 = 준비 상태("탭해서 출발"), **첫 입력(필드 누르기·방향키·스페이스)이 판을 시작하고 `track('start')`**, 끝 화면에 닿을 때 `track('done')`. 다시 하기 = 새 준비 상태.
- 고정 시간 간격(1/120초 tick, 큰 dt 는 100ms 로 자름) → 같은 시드 + 같은 입력 = 같은 판.
- 탭을 떠나면(visibilitychange·pagehide) 자동 일시정지, P/Esc 일시정지.
- `prefers-reduced-motion`: 눈송이·보너스 떠오름·번쩍임·흔들림 끔, 끝 화면까지 0.45초.
- 숫자는 진짜만: `supa.submitScore('ski', bucket)` 한 번, bucket = min(1999, floor(점수 / 5)). 서버 없음·실패·비교할 기록 없음 → 백분위 칸 통째로 숨김.
- 최고 기록: localStorage `ski_best_v1`.
- 검사용 핸들 `window.SKI_APP` (phase, state, best, timeScale, steer, autopilot, begin).

주소: 원본은 자리표시자 `https://ski.example.com/`, 배포 때 `https://melgene.com/ski/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(⛷️·game·2026-11-08·order 1·12개 언어 제목/설명) |
| `ski-core.js` | 속도·줄 간격·lane·코스 만들기·조종·충돌·기문 콤보·점수·등급·자동 조종·bucket·백분위 (UMD) |
| `ski.js` | 화면·입력·캔버스 그리기(눈 결·스키 자국·나무·바위·눈사람·기문·눈송이)·HUD·일시정지·끝 화면·점수 전송. 검사용 `window.SKI_APP` |
| `style.css` | 맑은 겨울(흰 눈·얼음 하늘색) + 남색 포인트 + 기문 빨강/파랑, 숫자 Oswald |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `tools/i18n/<lang>.js` · `tools/guide/<lang>.js` | 문구 · 긴 글 가이드 (12개 언어) |
| `tools/gen-i18n.js` · `tools/gen-og.js` | 페이지·사이트맵 생성 · OG 이미지 |
| `tools/check-ski.js` | 로직(코스 불변식·언제나 통과 가능·충돌·기문)·언어 파일(360px 폭 포함)·생성 HTML·OG 검사 (check-all 자동) |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 이 폴더(apps/ski)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-ski.js
node tools/flow-test.js en,ko,ru 360,375,1440      # 실제 흐름 (몇 분)
```
