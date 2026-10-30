# apps/bracket — 토너먼트 대진표 (투표)

내가 넣은 이름·항목 2~64개로 단판 승부(싱글 엘리미네이션) 토너먼트 대진표를 만든다. 한 판씩 두 카드 중 승자를 고르는 "이상형 월드컵"식 진행과, 실제 경기용으로 대진표만 뽑고 나중에 승자를 누르는 진행 둘 다. 정해진 음식으로 하는 `food-cup` 과 달리 항목은 모두 사용자 것이다. 시작 화면(입력) → 대진 화면(맞대결 카드 · 대진표 · 도구) → 우승 카드 + 공통 끝 화면.

- 시작 화면 `#screen-setup`: h1(현지 검색어)·훅 → (진행 중 대진표가 있으면) 이어 하기 → 대진표 제목(선택) → 항목 textarea(한 줄에 하나, 한 줄이면 쉼표로 나눔, 대소문자 무시 중복 제거, 24자) → 대진 배치(🎲 랜덤 추첨 / 📋 입력 순서 = 시드) → 방식(한 판씩 고르기 / 대진표만 뽑기) → 만들기 → 공정성 한 줄 → 맨 끝 `mg-ad-start` 1자리.
- **대진**(`bracket-core`): 크기 = 2의 거듭제곱. 표준 시드 배치(1 vs size, …)에 시드 n+1..size 를 bye 로 두어 bye 끼리 만나지 않고 위/아래 절반에 고르게(차이 ≤ 1) 퍼진다. bye 는 자동 진출이고 경기 수에 넣지 않는다 → 진짜 경기 = n − 1. 랜덤 = crypto.getRandomValues 거부 샘플링 Fisher–Yates(모든 순서 같은 확률). 입력 순서 = 첫 줄이 1번 시드(bye 도 상위 시드부터).
- 대진 화면 `#screen-play`(처음 hidden, 광고 자리 없음): 제목·항목 수 → 맞대결 `#duel`(한 판씩 모드, 라운드 이름·"n경기 중 k번째", 청록/주홍 큰 카드 두 장 + VS) → 대진표 `#board`(라운드별 세로 목록, 2칸 격자 — 가로 스크롤 없음, 이름을 누르면 승자, 끝에 🏆 우승 줄) → 도구(되돌리기 · PNG 저장 · 글로 복사 · 링크 복사 · 새 대진표).
- 승자를 바꾸거나 되돌리면 그 경기에서 결승까지 이어지는 결과를 지운다(대진표가 늘 맞게).
- 우승 `#done`: 트로피 + 우승자 + "제목 · n개 · m경기" → `data-mg-end="bracket"`.
- PNG: canvas 로 라운드별 열 + 연결선 + 우승 칸(페이지 글꼴 그대로 — `document.fonts.ready` 뒤, 16개 이하 2배 해상도). 글로 복사: 라운드별 "A vs B → A", bye, 우승.
- 공유 링크 `#d=`: `{v,t,n(시드 순),s,m,w('0'/'1'/'-')}` JSON → UTF-8 → base64url(최대 12000자, 64개 × 24자 한글도 들어감). 열 때 `sanitize`(모양·중복·길이·정해지지 않은 경기 결과 지움). 공통 공유(setShareData)도 상태가 담긴 링크.
- 저장: 입력 `mg_bracket_in_v1`, 진행 중 대진표 `mg_bracket_v1`(상태·되돌리기 기록·done 셈) — localStorage, 모든 접근 try/catch. 네트워크 호출 없음.
- 기록: 대진표를 만들 때(만들기·다시 하기) `track('start')`, 우승자가 처음 정해질 때 `track('done')`(한 번만, `markDone`). 받은 링크로 연 대진표는 세지 않는다. 다시 하기(setRetry) = 같은 항목·제목·방식으로 다시 섞어 새 대진표.

주소: 원본은 자리표시자 `https://bracket.example.com/`, 배포 때 `https://melgene.com/bracket/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🏆·카테고리 vote·등록일 2026-10-30·order 2·12개 언어 제목/설명) |
| `bracket-core.js` | crypto 거부 샘플링 섞기, 항목 정리, 표준 시드 배치·bye, 경기 풀이(resolve)·승자 고르기/지우기·다음 경기, 라운드 이름, 상태 검사(sanitize), `#d=` 인코딩/디코딩, 글로 복사 (UMD) |
| `bracket.js` | 입력 → 만들기 → 맞대결/대진표에서 승자 → 우승 → 끝 화면, 되돌리기, PNG·글·링크 내보내기, `#d=` 열기 |
| `style.css` | 남색 + 트로피 금색 + 크림 카드, 맞대결 청록·주홍 (Baloo 2 · ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mitr · ru Rubik · vi 본문 Be Vietnam Pro) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 대진표 선 + 트로피, 실제 이름 없음), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (ko 대진표·이상형 월드컵 · ja トーナメント表 · de Turnierbaum · es cuadro de torneo · pt chaveamento · ru турнирная сетка) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(단판 승부·n−1 경기·bye·시드·공정한 추첨·모임/회사/스포츠/이상형 월드컵) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-bracket.js` | 로직(항목 2~64 전부: bye 수·bye 끼리 없음·고른 분포·n−1 경기·우승 1명, 섞기 카이제곱, 승자 변경, `#d=` 왕복/거절)·언어 파일·360px 문구·생성 HTML·OG 검사 |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js bracket     # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/bracket)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-bracket.js
node tools/flow-test.js en,ja 360,1440
```
