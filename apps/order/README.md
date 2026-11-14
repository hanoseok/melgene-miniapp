# apps/order — 순서 정하기 (투표)

이름(한 줄에 한 명, 2~40명) 또는 번호 1~N(2~40)을 **1번부터 마지막까지 전체 순서**로 섞는 랜덤 순서 정하기(Random Order Picker). 발표 순서·게임 순서·청소 당번·발언 순서용.

- 다른 추첨 앱과의 차이: lots(당첨·꽝)·raffle(경품 당첨자)·roulette(하나 고르기)·team(팀 나누기)과 달리 **모두에게 1번~N번 자리**를 준다.
- 화면 세 개: **입력**(첫 화면: h1·훅 → 무슨 순서인지 프리셋 칩 4개(그냥·발표·게임·청소 — 제목만 바뀜) → 이름 | 번호 1~N → 공개 방향(1번부터 | 마지막부터) → 섞기 → 맨 아래 `mg-ad-start`) → **공개**(프리셋 제목·진행 막대·번호표 카드(탭/다음 = 한 장, 자동 = 1.2초마다, 한 번에 보기)·지금까지 공개 목록, **광고 없음**) → **끝**(번호 목록 → 텍스트 복사·링크 복사·이름 고치기 → `data-mg-end="order"`).
- 섞기(`order-core.js`): 섞기를 누르는 순간 `crypto.getRandomValues` + 거부 샘플링 + Fisher–Yates 로 전체 순서를 한 번에 정한다. 공개는 보여 주기만. 움직임 줄이기면 카드 애니메이션 없이 바로 바뀐다.
- 저장: localStorage `order_state` = 마지막 입력(모드·이름 글·N·프리셋·방향), 읽을 때 `cleanState`. 이름은 서버로 보내지 않는다.
- 공유: `#r=` = UTF-8 base64url JSON(`{v:1,p,o:[이름…]}` 또는 `{v:1,p,n:[순열]}`), 6000자 넘으면 링크 대신 깨끗한 주소. 받을 때 길이·모양·순열·글자(꺾쇠·중괄호·백틱·제어 문자)를 다시 확인하고 틀리면 안내 문구. 화면에는 언제나 textContent. 받은 사람은 "공유받은 순서"(다시 섞지 않음)를 보고, 다시 하기 = 같은 이름으로 입력 화면(다시 섞기 / 나도 하기).
- 기록: 섞기를 누를 때 `track('start')` 1번, 전체 목록(끝 화면)이 보일 때 `track('done')` 1번. 내 결과의 다시 하기 = 같은 이름으로 바로 새 판. 공유 링크로 본 결과는 세지 않는다.

주소: 원본은 자리표시자 `https://order.example.com/`, 배포 때 `https://melgene.com/order/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🔢 · vote · 2026-11-15 · order 2 · 12개 언어 제목/설명) |
| `order-core.js` | 이름 정리·검사, 거부 샘플링·Fisher–Yates, 공개 순서, 공유 링크 인코딩/검사, 저장 값 정리 (UMD) |
| `order.js` | 입력·공개·끝 화면 동작, 자동 공개, 텍스트·링크 복사, 저장·복원, 공유(#r=) |
| `style.css` | 크림색 종이 + 번호표(대기표) 카드, 코럴·남색 · 제목은 언어 파일 글꼴 |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 번호표 1·2·3·4 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, 프리셋 4개·예시 이름 현지화) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법·공정성 원리·쓰임새·여럿이 쓰는 요령·공개 방향과 공유) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-order.js` | 로직·공정성(4명 순열 24가지 카이제곱, 10명 자리별 5σ, 번호 모드)·공유 링크 왕복/거절·언어 파일·360px 문구 폭·생성 HTML(입력 화면 맨 끝 mg-ad-start, 공개 화면 광고 없음)·innerHTML 금지·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름(Chrome headless + mock-supa): en·ko·th × 360·375 — 오류·섞기·마지막부터 공개·자동·끝 화면·공유 링크·나도 하기·번호 모드·복원·깨진 링크·콘솔 오류 0 (check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js order          # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/order)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-order.js
node tools/flow-test.js en,ko,th 360,375
```
