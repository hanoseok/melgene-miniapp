# apps/yesno — 예스 노 결정기 (투표)

질문(선택)을 적고 방식을 골라 "구슬에게 묻기"를 누르면 YES / NO 를 정해 주는 도구. 따로 시작 화면이 없는 한 화면 도구 앱(randnum·coinflip 처럼)이다.

- 모드 5개: 예/아니오(1:1) · 예/아니오/글쎄(1:1:1) · 신비한 구슬(언어별 직접 쓴 답 12개 — 0~3 긍정 · 4~7 중립 · 8~11 부정, Magic 8-Ball 문구를 베끼지 않음) · 3판 2선승 · 5판 3선승(한쪽이 과반에 닿는 순간 끝, 판마다 하나씩 보여 줌).
- 공정성: `crypto.getRandomValues` 거부 샘플링. 답을 **먼저** 정하고 구슬 흔들기(약 1.8초)·best-of 판(0.42초씩)은 보여 주기만 한다. 움직임 줄이기면 바로.
- 질문: 이 기기에만(최근 10개 `localStorage mg_yesno_history`, try/catch). 서버로 보내지 않는다. **"이 답 공유하기"** 를 누를 때만 질문·답이 `#d=`(UTF-8 base64url) 링크에 들어간다. 공통 끝 화면 공유는 언제나 깨끗한 주소(문구에는 답만).
- 숫자: 서버 숫자 없음 — `poll_vote` 는 하루 단위 집계가 없어("오늘 X%") 넣지 않았다. 보이는 숫자는 이번 세션 누적(예·아니오·글쎄)과 최근 기록뿐.
- 기록: 묻기를 누를 때 `track('start')`, 답이 보일 때 `track('done')`(다시 물을 때마다 또). 공유 링크로 본 답은 세지 않는다.
- 화면: h1·훅 → 질문 → 모드 칩 → 묻기 → (물은 뒤) 답 카드 → 누적 → 최근 기록 → `data-mg-end="yesno"` → 맨 아래 `mg-ad-start`(답이 보이면 숨김). `setRetry` = 같은 질문으로 다시 묻기(공유 답을 볼 때는 "나도 물어보기").
- 재미용 안내: FAQ·가이드에 "조언·예언이 아님, 건강·돈·법·안전 결정에 쓰지 말 것".

주소: 원본은 자리표시자 `https://yesno.example.com/`, 배포 때 `https://melgene.com/yesno/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎱 · vote · 2026-10-15 · order 2 · 12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `yesno-core.js` | crypto 거부 샘플링, 모드별 묻기·best-of, 톤·분류, 질문 다듬기, `#d=` 인코딩/검증, 누적·기록 (UMD) |
| `yesno.js` | 한 화면 동작(모드 칩·구슬 연출·best-of 판·공유 답·누적·기록) |
| `style.css` | 밤하늘 남보라 + 검은 구슬(파란 창) + 금빛 버튼 (Fredoka · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr · vi Baloo 2 · ru Rubik) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 구슬 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-yesno.js` | 로직·best-of 종료·공정성(카이제곱 7종)·`#d=` 왕복/변조·언어 파일·360px 문구·생성 HTML·OG 검사 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 가이드 + 링크 검사
node tools/check-all.js yesno       # 이 앱 검사 + 가이드 검사

# 이 폴더(apps/yesno)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-yesno.js
```
