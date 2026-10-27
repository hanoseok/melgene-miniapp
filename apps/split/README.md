# apps/split — 더치페이 계산기 (만들기)

총액과 인원, 또는 누가 뭘 먹었는지를 넣는 대로 1인당 금액을 계산하는 한 화면 도구 앱(bmi·percent 처럼 시작 화면이 따로 없다). 먼저 낸 사람이 있으면 누가 누구한테 얼마 보낼지(최소 송금)까지 정리한다.

- 방법 두 가지: **똑같이 나누기**(총액 · 인원 2~30명 · 팁/봉사료 % 선택) / **항목별로 나누기**(사람 이름 2~20명 · 메뉴(이름·가격·함께 먹은 사람 칩, 기본 = 모두) · 세금 % · 팁 %, 세금·팁은 각자 주문 금액 비율로).
- 돈은 언제나 **정수 최소 단위**(원·엔·센트, `split-core.js`). `allocate` = 큰 나머지 방식(BigInt) — 합계가 언제나 총액과 정확히 같다.
- 정리 단위(통화별: KRW 1·10·100·1000원(기본 100) · JPY 1·10·100円 · CNY 0.01·0.1·1 · USD/GBP 0.01·1·5 · EUR/BRL 0.01·0.1·1·5 · THB 1·5·10 · VND 1·1,000·10,000(기본 1,000) · RUB 0.01·1·10·100). 끝돈 = **총무가 부담**(단위로 내림한 나머지를 총무 = 첫 사람이 냄) / **골고루 나눔**(남는 단위를 나머지가 큰 사람부터 하나씩, 단위보다 작은 끝돈은 가장 많이 내는 사람). 예) 100,000원 ÷ 3, 100원 단위, 총무 부담 → 33,300 × 2 + 총무 33,400.
- 팁 프리셋은 언어 파일 `tip`(en 15·18·20% 열림, ko·ja·zh·th·vi 등은 접힘·0%). 퍼센트는 0~100, 소수 2자리, 0.5 올림.
- **누가 먼저 냈어요**: 낸 사람(여럿 가능)과 금액 → 잔액 → 같은 금액끼리 먼저 짝 → 가장 큰 빚 ↔ 가장 큰 받을 돈(greedy), 송금 ≤ 사람 수 − 1. 한 사람만 있고 금액이 비면 전액. 낸 돈 합계가 총액과 다르면 `paidOver`/`paidUnder` 로 알리고 송금 목록은 숨긴다.
- 통화: 언어 기본값(ko KRW · ja JPY · zh CNY · en USD · fr/de/it/es EUR · pt BRL · th THB · vi VND · ru RUB) + 선택(GBP 포함 10개). 금액 모양 = `Intl.NumberFormat`(narrowSymbol), ko `{n}원` · ja `{n}円`(언어 파일 `cur.local`). 입력 = `type=text inputmode=decimal`, "," "." 모두 소수점 또는 천 단위 구분(뒤 3자리 = 구분), 전각 숫자·통화 기호 허용.
- **결과 복사** = 메신저용 일반 글(총액·1인당/사람별·송금 + 깨끗한 주소). **링크로 공유** = `#d=<UTF-8 base64url JSON>`(방법·통화·단위·이름·메뉴·금액·낸 사람 — 서버 없음). 받은 링크를 열면 계산기가 그대로 채워지고 "공유받은 링크" 안내.
- 기록: 이번 판에서 사용자가 손댄 뒤 처음으로 계산이 나온 순간 `track('start')` 1번(저장값·공유 링크로 열기만 하면 세지 않음, 바로 "정산 완료"를 누르면 그때) → "정산 완료"를 처음 누르면 요약 카드 + 공통 끝 화면 + `track('done')` 1번. 다시 하기(`setRetry`) = 입력·낸 사람을 비우고 `#d=` 를 지운 새 판(방법·통화·단위·끝돈 방식은 그대로).
- 저장: localStorage `mg_split_v1`(공유 링크와 같은 모양, try/catch)만. 이름·금액은 서버로 보내지 않는다. 공통 끝 화면 공유 = 깨끗한 주소(`mgCleanUrl`) + 고정 문구.
- 화면: h1·훅 → 입력 카드(방법·통화 → 똑같이/항목별 → 정리 단위·끝돈) → 결과 카드 → 누가 먼저 냈어요 → 결과 복사·링크로 공유 → 정산 완료 → (완료 뒤) `#result`(요약 + `data-mg-end="split"`) → 맨 아래 `mg-ad-start`(요약이 보이면 숨김).

주소: 원본은 자리표시자 `https://split.example.com/`, 배포 때 `https://melgene.com/split/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(💸 · create · 2026-10-28 · order 1 · 12개 언어 제목/설명) |
| `split-core.js` | 입력 해석·통화 표·퍼센트·큰 나머지 나누기·똑같이/항목별 계산·최소 송금·공유/저장 모양 (UMD) |
| `split.js` | 한 화면 동작(방법·통화·인원·사람/메뉴/낸 사람 목록·칩·팁·정리 단위·끝돈·결과·송금·복사·링크·저장·요약·다시 하기) |
| `style.css` | 영수증 종이색 + 진갈색 잉크 + 산호색 포인트, 숫자 Space Grotesk |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, "?" 영수증 + 점선 + 💸), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구(12개 언어, 키 구조 동일, `cur` 기본 통화·현지 금액 모양, `tip` 프리셋) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법 · 공정하게 나누기 · 나라별 팁·봉사료·세금 · 끝돈 정리 · 먼저 낸 사람 정산과 예절) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-split.js` | 로직(입력 해석 · 퍼센트 · allocate 무작위 3000번 · 똑같이 무작위 1000번 · 항목별 무작위 1000번 · 정산 무작위 2000번 · 공유 되돌림/거부)·언어 파일·생성 HTML·사이트맵·OG·split.js 저장/전송 규칙 |
| `tools/check-flow.js` | 실제 흐름(Chrome headless + 정적 서버 + mock-supa): 첫 화면·넘침, 똑같이(총무/골고루)·오류, 정산(전액/모자람), 복사 글, 항목별(칩·세금), 링크 공유 새 탭, 저장, 요약·끝 화면 순서, track 횟수, 다시 하기, 서버로 이름 안 감, 콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js            # SITES + 모든 앱 HTML + 가이드 + 링크 검사
node tools/check-all.js split    # 이 앱 검사(check-flow + check-split) + 가이드 검사

# 이 앱만
(cd apps/split && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js)
node tools/gen-guides.js split && MG_I18N_MODE=variant node tools/gen-guides.js split
node apps/split/tools/gen-og.js all
(cd apps/split && node tools/check-split.js && node tools/check-flow.js)   # 예: node tools/check-flow.js ru,de 375 · SHOT=<폴더>
```
