# apps/cps — 클릭 속도 테스트 (게임)

클릭 속도 테스트(CPS 테스트, クリック速度テスト, CPS Test). **1·5·10초(기본 5초) 동안 큰 클릭 영역을 최대한 빨리 누른다.** 시계는 영역을 처음 누른 순간 시작하고 그 클릭도 1회로 센다. 결과 = CPS(클릭 ÷ 초, 소수 한 자리) + 클릭 수 + 내 등급(6단계 중 내 것만) + 모드별 내 최고 + 서버 실제 백분위.
시작(티징 + 모드 고르기 + 한 줄 방법 + 맨 아래 광고 1개) → 게임(HUD 남은 시간·클릭·CPS + 진행 막대 + 큰 클릭 영역, 광고 없음) → 끝 화면(CPS·클릭 수·시간·등급·최고 기록·25 CPS 초과 안내·서버 백분위 카드 → 공통 끝 화면).

- 입력: 클릭 영역의 `pointerdown` 만 센다(마우스 왼쪽 버튼·터치·펜, 멀티 터치는 손가락마다 1회). click/mouse/touch 이벤트로는 세지 않아 터치 + 호환 마우스 이벤트가 두 번 세어지지 않는다. 영역은 `touch-action: none`·`user-select: none`·`-webkit-touch-callout: none` + contextmenu·dblclick·selectstart·gesturestart·touchstart 기본 동작 막기(확대·선택·길게 눌러 메뉴 방지).
- **키보드(Space/Enter)는 세지 않는다** — 키를 누르고 있으면 자동 반복으로 입력이 쏟아져 공정하지 않기 때문(FAQ 에 안내).
- 시간: `performance.now()` + `requestAnimationFrame`(+ 끝 시각 setTimeout 보조). 클릭 시각은 이벤트 `timeStamp`. 시작 + 모드 시간 이후의 클릭은 세지 않는다. 끝나면 0.6초(`LOCK_MS`) 입력을 무시한 뒤 끝 화면으로(마지막 연타가 새 판을 시작하지 않게).
- 진행 중 탭을 떠나면(visibilitychange hidden) 그 판은 무효 — 안내 후 같은 모드로 다시 준비. 이미 끝난 판(잠금 중)이면 결과를 그대로 보여 준다.
- 클릭마다 물결(ripple, 최대 18개)·숫자 튀기. `prefers-reduced-motion` 이면 끈다.
- 규칙(`cps-core.js`): 등급 = CPS 4·6·8·10·13 경계 → 6단계(이름은 언어 파일 `result.tiers`). **25 CPS 초과는 사람이 낼 수 없는 값**이라 서버에 보내지 않고 최고 기록에도 넣지 않는다(안내 문구 `result.tooFast`).
- 설정(모드): localStorage `cps_prefs_v1`. 모드별 최고 기록: `cps_best_v1`(`{ "cps-5": 7.4, … }`).
- 숫자는 진짜만: 끝날 때 `supa.submitScore(C.gameKey(모드), bucket)` 한 번 — 게임 이름 `cps-1`·`cps-5`·`cps-10`, bucket = CPS×10(0..250, **높을수록 좋음**) → 돌아온 실제 분포로 상위 %(서버 없음·실패·비교할 다른 기록 없음·25 CPS 초과면 칸째 숨김).
- track: 첫 클릭으로 시계가 시작될 때 `track('start')`, 끝 화면에 닿을 때 `track('done')` 각 한 번(다시 하기 = 같은 모드 새 판).

주소: 원본은 자리표시자 `https://cps.example.com/`, 배포 때 `https://melgene.com/cps/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🖱️·카테고리 game·등록일 2026-11-04·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `cps-core.js` | 모드·게임 이름·CPS 계산·첫 클릭 시작/시간 끝 처리(tap·tick)·요약·tierOf·isValid(25 CPS 상한)·bucket·백분위(높을수록 좋음) (UMD) |
| `cps.js` | 화면·입력(pointerdown 만)·HUD(rAF)·물결·잠금·탭 이탈 무효·끝 화면·점수 전송. 검사용 `window.CPS_APP` |
| `style.css` | 짙은 보라 바탕 + 네온 노랑·분홍·하늘, 숫자 Chakra Petch (제목 Fredoka / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 `guide.html` 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`), 티저 그림 `heroSvg` |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-cps.js` | 로직(모드·게임 이름·CPS·첫 클릭 시작·시간 끝 클릭 무시·등급 경계·25 CPS 상한·bucket·높을수록 상위)·언어 파일(키·자리표시자·FAQ(키보드 질문·25 상한 포함)·글꼴·제목(검색어 먼저)·360px 폭·fr 좁은 공백·ru «ты»)·생성 HTML(시작 화면 맨 끝 광고 1·모드 라디오·게임 중 광고 0·FAQPage 없음·끝 화면 순서·등급 목록 없음)·입력 규칙(pointerdown 만·잠금·확대 막기)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js cps          # 이 앱 검사만

# 이 폴더(apps/cps)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-cps.js
```
