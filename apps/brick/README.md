# apps/brick — 벽돌깨기 / Brick Breaker (게임)

고전 벽돌깨기(Breakout). 패들로 공을 튕겨 네온 벽돌을 모두 깨면 다음 단계, 목숨 3개. 단계마다 공이 빨라지고(시작 속도 300 → +40/단계, 최대 640, 패들에 맞을 때마다 +3 · 단계당 +100 까지), 무늬 6가지를 돌아가며 쓴다(흰 테두리 벽돌은 두 번 맞아야 깨짐).
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 점수·단계·목숨 + 캔버스 판, 광고 없음) → 끝 화면(내 등급 하나 + 점수 카드 → 공통 끝 화면).
화면은 네온 레트로 오락실(짙은 남보라 + 격자 + 빛나는 분홍·하늘·노랑) — mole 의 흙빛 잔디와 다른 모양.

- 점수: 벽돌 줄마다 50·40·30·30·20·20·10·10(위 줄일수록 큼), 두 번 벽돌 첫 타 +5, 단계 클리어 보너스 200 × 단계.
- 아이템(깨진 벽돌의 12%에서 캡슐): 하늘색 = 패들 넓게(15초), 노란색 = 멀티볼(공마다 둘 더, 최대 6개).
- 서브: 공이 패들 위에 붙어 있다가 손을 떼거나 클릭·Space·↑ 로 발사(3초 지나면 자동).
- 물리(`brick-core.js`): 공이 한 번에 반지름의 절반 이하로만 움직이도록 잘게 나눠 진행 → 벽돌을 뚫지 않음. 패들 맞은 위치로 각도(±60°), 세로 속도 하한(옆으로만 오가며 갇히지 않게).
- 등급 6단계(점수 문턱 0·500·1400·3000·5500·10000): 이름은 언어 파일 `result.tiers`, 이모지는 `brick-core.js` `TIER_EMOJI`. 끝 화면에는 내 등급만 보이고 목록은 어디에도 없다(스포일러 금지).
- 입력: 판 위를 끌기(터치·펜) / 마우스 움직이기, 키보드 ← → (A D). 캔버스 `touch-action: none` + touchmove 막기로 끄는 동안 페이지가 스크롤되지 않는다. 캔버스는 devicePixelRatio(최대 2.5)로 선명하게, 배경·벽돌은 바뀔 때만 다시 그린다.
- prefers-reduced-motion 이면 파편·깜빡임·티저 움직임 끔. 프레임당 진행 시간 상한 50ms(탭을 숨기면 사실상 일시정지).
- 최고 기록: localStorage `brick_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('brick', round(score/20))` 한 번 → 돌아온 실제 분포로 상위 % (mole·reaction 과 같은 방식, 서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김). 새 DB 변경 없음.
- 기록: 시작(다시 하기 포함) `track('start')`, 끝 화면 `track('done')`.
- 포털 큐레이션 문구(12개 언어 kicker/headline/blurb): `tools/hub-curation.json` — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 `{ id: 'brick', … }` 로 옮겨 넣는다(이 앱 작업에서는 hub 를 고치지 않았다).

주소: 원본은 자리표시자 `https://brick.example.com/`, 배포 때 `https://miniapp.melgene.com/brick/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🧱·카테고리 game·등록일 2026-10-08·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `brick-core.js` | 규칙·물리(`step(s, dt)` → brick/wall/paddle/drop/catch/lose/stage/over/launch 사건)·`setPaddle`·`launch`·단계 무늬(LEVELS)·속도 곡선·아이템·`tierOf`, 시드 난수(mulberry32), bucket·percentile (UMD) |
| `brick.js` | 캔버스 그리기(DPR·층 캐시·파편)·입력·HUD·판 위 메시지·끝 화면·점수 전송. 검사용 `window.BRICK_APP` (phase/state/best/endNow) |
| `style.css` | 네온 오락실(클래스 앞머리 `tf-`) (제목 Audiowide / ko Do Hyeon / ja DotGothic16 / zh ZCOOL QingKe HuangYou / th·vi Chakra Petch(+ vi Be Vietnam Pro) / ru Russo One, 숫자는 본문 글꼴 굵게) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어 (머지용) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-brick.js` | 로직(서브·반사·벽돌 제거·두 번 벽돌·빠른 공 뚫림 없음·단계 진행·목숨·아이템·봇 40판 매 step 판 밖/벽돌 안 없음·재현·실력·등급)·bucket/백분위·언어 파일(키·번역·자리표시자·등급 6개·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·게임 중 광고 0·캔버스·FAQPage 없음·끝 화면 순서·등급 목록 없음)·OG·hub-curation.json 검사 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js brick        # 이 앱 검사만

# 이 폴더(apps/brick)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-brick.js
```
