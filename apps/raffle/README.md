# apps/raffle — 경품 추첨기 (투표)

송년회·회식·라이브 이벤트 경품 추첨을 휴대폰이나 TV·프로젝터 한 화면으로 진행하는 추첨기(랜덤 이름 뽑기 · giveaway winner picker). 참가자는 이름 붙여 넣기(한 줄에 한 명, `이름*3` = 응모권 3장, 같은 이름은 경고) 또는 번호표 1~N(2~9999). 경품은 이름 + 당첨 인원(기본 1등 ×1 · 2등 ×2 · 3등 ×5, 언어별 이름, 12개까지).

- 다른 추첨 앱과의 차이: lots(당첨·꽝 쪽지)·roulette(돌림판 하나)·randnum(숫자)·team(팀 나누기)·santa(짝 맞추기)·bingocall(번호 부르기)와 달리 **여러 경품 × 여러 당첨자**를 상별로 한 명씩 공개하는 행사 진행용.
- 화면 세 개: **준비**(h1·훅 → 참가자(이름 명단 | 번호표) → 경품 줄(이름·−/+·×, 추가) → 추첨 순서(1등은 마지막에 = 기본 | 1등부터) → 한 사람은 한 번만 당첨(기본 켬) → 뽑을 당첨자 수 → 시작 → 맨 아래 `mg-ad-start`) → **추첨**(진행 `n / m` · 발표 모드 · 결과 → 무대(지금 상·“k / c번째”·공개 칸) → 뽑기 → 건너뛰기(셔플 중) → 남은 인원 한꺼번에 · 방금 뽑기 취소 → 다음 상·남은 응모자 → 지금까지 당첨자 → 새 추첨(확인)) → **결과**(상별 당첨자 → 텍스트 복사 → 명단·경품 고치기 / 공유 링크로 열었으면 나도 만들기 → `data-mg-end="raffle"`).
- **추첨 화면에는 광고 자리를 두지 않는다**(TV·프로젝터 화면). 광고는 준비 화면 맨 아래 1개 + 공통 끝 화면.
- 뽑기(`raffle-core.js`): 누를 때마다 지금 상의 자격 있는 사람(한 번만 당첨이면 아직 안 뽑힌 사람, 아니면 이 상에 아직 안 뽑힌 사람) 중 한 명을 `crypto.getRandomValues` + 거부 샘플링으로, 응모권 수만큼 가중치를 두고 고른다. 미리 섞지 않는다. 이름 셔플(약 1.7초, 점점 느려짐, 연출 이름도 crypto)은 값을 정한 뒤 보여 주기만 하고, 건너뛰기·무대 탭·Space(셔플 중)·움직임 줄이기면 바로 공개. 공개 때 색종이(1등은 더 많이). 되돌리기 = 마지막 묶음(한꺼번에 뽑기면 그 묶음 전체).
- 저장: localStorage `raffle_state` = 입력 초안(모드·명단 글·N·경품·순서·한 번만) + 진행 중 추첨. 새로 고침하면 추첨 화면으로 그대로(start 다시 안 셈). 읽을 때 `sanitize`(버전·모양·한도·상 순서·자격·묶음 번호를 처음부터 다시 쌓아 확인). 서버로 보내는 것 없음.
- 공유: 결과 화면에서 주소에 `#r=`(결과 목록만 — 당첨자가 있는 상 이름 + 당첨자, UTF-8 base64url, 12000자 넘으면 깨끗한 주소). 받은 사람은 결과 화면(“공유받은 추첨 결과”, 다시 하기 = 나도 추첨 만들기)을 본다. 텍스트 복사 = 제목 + 상별 목록 + 링크.
- 기록: 한 추첨의 첫 당첨자를 뽑을 때 `track('start')` 1번(한 명·한꺼번에 둘 다), 모든 상을 다 뽑았거나 결과를 열 때 `track('done')` 1번(`raffle.done`). 다시 하기 = 같은 명단·경품으로 새 추첨 → 다시 start/done. 공유 링크로 연 결과는 세지 않는다.
- 편의: 발표 모드(`body.rf-present` — 타이틀 바·바닥글·당첨자 목록 숨김, 상·이름 크게, Fullscreen API 가 있으면 함께 전체 화면, Esc 로 끔), 발표용 리모컨·키보드(Space·Enter·→·PageDown = 뽑기).

주소: 원본은 자리표시자 `https://raffle.example.com/`, 배포 때 `https://melgene.com/raffle/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎁 · vote · 2026-11-09 · order 2 · 12개 언어 제목/설명) |
| `raffle-core.js` | 이름 붙여 넣기(응모권·중복)·경품 정리·설정 검사·상 순서·뽑기(가중치, 한 번만/중복 허용)·한꺼번에·되돌리기·저장 검사·공유 링크 (UMD) |
| `raffle.js` | 준비·추첨·결과 화면 동작, 경품 줄 편집, 이름 셔플 연출·건너뛰기·색종이, 발표 모드, 저장·복원, 공유(#r=)·텍스트 복사 |
| `style.css` | 짙은 와인색 무대 + 금빛·리본 빨강, 선물 상자 공개 칸 · 제목은 언어 파일 글꼴 |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 선물 상자 세 개 + 빈 “?” 이름표 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, 기본 경품·예시 이름 현지화) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법·이름/번호표/응모권·순서와 한 번만 당첨·송년회/라이브 진행 팁·공정성) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-raffle.js` | 로직(파싱·검사·순서·끝까지 뽑기 200여 번 모두 다른 사람·중복 허용·묶음 되돌리기·sanitize·공유 왕복/거부·카이제곱 3종)·언어 파일·360px 문구·생성 HTML(준비 화면 mg-ad-start, 추첨 화면 광고 없음)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름(Chrome headless + mock-supa): en·ko × 375(지정 가능) 전체 흐름·공유 링크 탭·발표 모드, 번호표·중복 허용, 셔플·건너뛰기, de·ru·vi·th 360px 넘침 (check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js raffle         # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/raffle)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-raffle.js
node tools/flow-test.js en,ko 360,375,1440
```
