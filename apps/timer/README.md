# apps/timer — 10초 맞추기 (게임)

10초 맞추기(10초 챌린지, 10秒ストップ, 10 Second Challenge). 스톱워치를 시작해 감으로 **목표 시간(5·10·30초, 기본 10초)에 딱 맞춰 멈춘다.** 한 판 = 3번 도전, 결과 = 가장 작은 오차(|멈춘 시간 − 목표|)와 평균 오차. 블라인드 모드는 3초가 지나면 숫자를 `??:??.??` 로 가린다(원조 방식, 더 어려움).
시작(티징 + 목표·블라인드 고르기 + 한 줄 방법 + 맨 아래 광고 1개) → 게임(시도 3칸 + 시계 + 큰 버튼 시작/STOP/다음/결과, 광고 없음) → 끝 화면(가장 가까운 기록 오차·멈춘 시간·등급·딱 맞춤 배지·내 최고·평균·시도 3개·서버 백분위 카드 → 공통 끝 화면).

- 시간: `performance.now()` + `requestAnimationFrame`. 멈춘 시각은 입력 이벤트 `timeStamp`(같은 시간 기준, 이상하면 지금)로 잰다. 시계는 스톱워치처럼 mm:ss.cc(1/100초 아래 버림, 59:59.99 상한), 오차는 1/1000초.
- 입력: 큰 버튼, 달리는 동안 게임 화면 아무 데나 누르기(`pointerdown` — 누르는 순간), Space/Enter. 멈춘 직후 0.45초는 입력을 무시(연타로 다음 시도가 바로 시작되지 않게).
- 규칙(`timer-core.js`): err = 멈춘 시간 − 목표(ms). **딱 맞춤 = 화면이 목표 그대로**(0 ≤ err < 10ms) — 0~40초 전 구간에서 화면 표시와 일치하는지 검사. 등급 = 가장 작은 |err| 500·250·100·40·15ms 경계 → 6단계(이름은 언어 파일 `result.tiers`, 끝 화면에는 내 등급만). 딱 맞춤이면 꽃가루 축하(움직임 줄이기 = 끔).
- 달리는 중 탭을 떠나면(visibilitychange hidden) 그 시도는 무효 — 안내 후 같은 차례를 다시 한다.
- 설정(목표·블라인드): localStorage `timer_prefs_v1`. 모드별 최고 기록: `timer_best_v1`(`{ "timer-10": ms, … }`).
- 숫자는 진짜만: 끝날 때 `supa.submitScore(C.gameKey(목표, 블라인드), bucket)` 한 번 — 게임 이름은 모드별 `timer-5`·`timer-10`·`timer-30`(+ 블라인드 `-b`), bucket = 가장 작은 |err| ms(0..1999, **낮을수록 좋음**) → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).
- track: 한 판의 첫 시도가 실제로 시작될 때 `track('start')`, 끝 화면에 닿을 때 `track('done')` 각 한 번(다시 하기 = 새 판).

주소: 원본은 자리표시자 `https://timer.example.com/`, 배포 때 `https://melgene.com/timer/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 ⏱️·카테고리 game·등록일 2026-11-02·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `timer-core.js` | 목표·모드별 게임 이름·시계 표시·오차·딱 맞춤·한 판 기록/요약·tierOf·bucket·백분위(낮을수록 좋음) (UMD) |
| `timer.js` | 화면·입력(버튼·아무 데나·키보드)·시계(rAF)·블라인드 가림·탭 이탈 무효·축하·끝 화면·점수 전송. 검사용 `window.TIMER_APP` |
| `style.css` | 남색 바탕 + 초록 LED 시계(Share Tech Mono) (제목 Fredoka / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 `guide.html` 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`), 티저 그림 `heroSvg` |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-timer.js` | 로직(목표·게임 이름·시계·오차·딱 맞춤 = 화면 표시 120,003건·3번·요약·등급 경계·bucket·낮을수록 상위)·언어 파일(키·자리표시자·FAQ(블라인드 질문 포함)·글꼴·제목·360px 폭·fr 좁은 공백·ru «ты»)·생성 HTML(시작 화면 맨 끝 광고 1·목표 라디오·게임 중 광고 0·FAQPage 없음·끝 화면 순서)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름 검사 (Chrome headless + CDP + mock-supa, check-all 에는 안 들어감 — 느림) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js timer        # 이 앱 검사만

# 이 폴더(apps/timer)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-timer.js
node tools/flow-test.js en,ko,th 360,375,1440    # 흐름 검사 (언어 × 폭 + 움직임 줄이기)
```
