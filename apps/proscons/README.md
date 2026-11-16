# apps/proscons — 장단점 저울 (투표)

할까 말까, A냐 B냐 고민될 때 장점·단점을 적고 항목마다 중요도(1~3)를 매기면 **SVG 저울이 실시간으로 기우는** 장단점 비교 결정기(Pros and Cons List – Decision Maker).

- 모드 두 개: **할까 말까**(선택지 하나: 왼쪽 접시 = 장점 합, 오른쪽 = 단점 합) · **A냐 B냐**(선택지 둘, 각각 장점·단점 — 왼쪽(A) = A 장점 + B 단점, 오른쪽(B) = B 장점 + A 단점. 차이는 (A 장점 − A 단점) − (B 장점 − B 단점)과 같다).
- 화면 세 개: **시작**(첫 화면: h1·훅 → 고민(선택, 80자) → 모드 → A/B 이름(24자) → 초안 안내·새로 쓰기 → 시작 → 맨 아래 `mg-ad-start`) → **저울판**(제목·저울 SVG·주제 칩 8개(돈·시간·건강…, 누르면 입력칸에 "주제: " 시작 글)·목록(항목 60자, 목록당 12개, 점 3개로 무게)·판정 버튼, **광고 없음**) → **끝**(질문·판정 "장점이 4점 차이로 앞서요 (64%)"·막대·동점이면 공정한 동전(crypto)·양쪽 가장 무거운 이유 3개·"생각 정리 도구" 안내·링크 복사·이미지 저장(canvas PNG)·목록 고치기 → `data-mg-end="proscons"`).
- 저울: `tiltAngle`(±18°, 무게 합이 작으면 분모 6으로 덜 기움) → requestAnimationFrame + `easeStep`(지수 감쇠)로 저울대 회전·접시 위치(`beamEnds`). 움직임 줄이기면 바로 그 각도.
- 저장: localStorage `proscons_draft` = 초안(모드·고민·이름·목록 6개), 읽을 때 `cleanState`. 서버로 보내지 않는다. 가짜 통계("다른 사람 X%")는 없다.
- 공유: `#d=` = UTF-8 base64url JSON(`{v:1,m:'s'|'ab',q,a,b,l:{p:[[w,"글"],…]}}`, 지금 모드 목록만), 8000자 넘으면 링크 대신 깨끗한 주소. 받을 때 버전·모드·목록 키·무게(정수 1~3)·글·개수를 다시 확인하고 틀리면 안내 문구. 받은 사람은 **읽기 전용 저울판**(입력·삭제·칩 없음) → 판정 보기 / **사본 고치기**(내 초안이 되고 #d= 지움). 화면에는 언제나 textContent.
- 기록: 한 판에서 첫 항목을 넣을 때 `track('start')` 1번, 판정(끝 화면)에 닿을 때 `track('done')` 1번. 공유 저울을 보기만 하면 세지 않는다. 다시 하기 = 새 고민(초안 비움).

주소: 원본은 자리표시자 `https://proscons.example.com/`, 배포 때 `https://melgene.com/proscons/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(⚖️ · vote · 2026-11-17 · order 2 · 12개 언어 제목/설명) |
| `proscons-core.js` | 글·무게·상태 정리, 항목 추가(12개 한도), 점수·판정·기울기·easeStep·저울대 끝·무거운 이유, 동전(crypto 거부 샘플링), 공유 링크 인코딩/검사 (UMD) |
| `proscons.js` | 시작·저울판·끝 화면 동작, 저울 애니메이션, 칩, 초안 저장·복원, 읽기 전용 공유 보기·사본 고치기, 동전, PNG 카드, 링크 복사 |
| `style.css` | 종이 크림색 + 남색 잉크 + 놋쇠 저울, 장점 초록·단점 테라코타 · 제목은 언어 파일 글꼴(Fraunces 등) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 기운 저울 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, 점수 복수형 one/few/many/other, 주제 칩 8개) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법·프랭클린의 ‘도덕적 대수’(1772년 프리스틀리에게 보낸 편지)·무게 매기는 법·요령·목록에만 기대면 안 되는 때) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-proscons.js` | 로직(점수·A/B 교차 무게·판정·기울기·easeStep·동전 균등)·공유 링크 왕복/거절·언어 파일(키·자리표시자·fr 좁은 공백·360px 문구 폭·title 폭)·생성 HTML(시작 화면 맨 끝 mg-ad-start, 저울판 광고 없음)·innerHTML 금지·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름(Chrome headless + mock-supa, 움직임 줄이기): en·ko·th·ru × 360·375 — 시작·저울판·칩·무게·기울기·판정·공유(읽기 전용)·사본 고치기·A/B·동점·동전·PNG·초안 복원·깨진 링크·넘침 없음·콘솔 오류 0 (check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js proscons       # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/proscons)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-proscons.js
node tools/flow-test.js en,ko,th,ru 360,375
```
