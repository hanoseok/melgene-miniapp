# apps/teto — 테토 에겐 테스트 (심리테스트)

2025~26 유행어 "테토(테스토스테론 → 직진·행동·주도 에너지)·에겐(에스트로겐 → 다정·공감·섬세 에너지)"을 성별과 상관없는 **에너지 스타일**로 다루는 재미용 테스트. 일상 상황 12개(보기 4개, 2분) → 결과 8종 중 하나 + 내 답으로 계산한 테토 % vs 에겐 % 게이지. 결과: 불꽃 테토 🔥 · 든든 테토 🛡️ · 겉테속에 🥥 · 반전 매력형 🎭 · 황금 밸런스 ⚖️ · 겉에속테 🍑 · 포근 에겐 🌷 · 감성 만렙 에겐 💞 (id: boldteto softteto tetoegen switch balance egenteto softegen boldegen — 언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나 + 한 줄 소개 + 설명 + 강점 3개 + 조심할 점 + 에너지 팁 + 찰떡 케미/티격태격 라이벌은 보여주기만, 링크 없음). 누구나 어떤 유형이든 될 수 있다는 다정한 톤, "재미로" 를 FAQ·가이드에 명시.

채점(`teto-core.js`): 보기마다 테토 점수 0~3(3 아주 테토 · 2 살짝 테토 · 1 살짝 에겐 · 0 아주 에겐), 한 문항의 보기 4개가 0·1·2·3 을 하나씩(위치는 섞임).
- T = 테토 점수 합(0~36) → **테토 % = T/36**(반올림), 에겐 % = 100 − 테토 % — 그 사람의 답으로 계산한 진짜 숫자.
- K = 확실한 보기(0 또는 3)를 고른 수(0~12).
- x = T − 18. |x| ≥ A(K≥5 이면 3, 아니면 4) → 테토/에겐 쪽(K≥7 불꽃/감성 만렙, 아니면 든든/포근) · |x| < C(K≥8 이면 1, 아니면 2) → 가운데(K≥6 반전 매력형, 아니면 황금 밸런스) · 그 사이 → 겉테속에/겉에속테. 같은 답이면 언제나 같은 결과. 테토 쪽 유형은 언제나 테토 50% 초과, 에겐 쪽은 50% 미만(check 가 전수로 확인).

숫자는 진짜만: 게이지 % 는 teto.js 가 sessionStorage(`tt_last`)에 남긴 그 사람의 값 — 같은 결과 페이지일 때만 보이고 공유로 온 방문자에겐 숨김(정적 HTML 에 숫자 없음). 공유 문구에는 내 % 가 들어간다(공유 주소는 결과만). poll `teto`, qid `r0`, opt = ORDER 번호(0~7): 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `tt_voted_v1`), 합계 20 이상일 때만 "N% 같은 유형". 결과 문구에는 숫자·% 를 쓰지 않는다 — check 가 막는다.

주소: 원본은 자리표시자 `https://teto.example.com/`, 배포 때 `https://miniapp.melgene.com/teto/`(대표 주소 melgene.com). 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-teto.js` 가 매번 다시 계산·검사, 기준 10%~15%)

| 유형 | 전수 | 테토 % 범위 |
|---|---|---|
| 🔥 boldteto 불꽃 테토 | 10.98% | 58~100 |
| 🛡️ softteto 든든 테토 | 13.56% | 58~83 |
| 🥥 tetoegen 겉테속에 | 12.17% | 53~58 |
| 🎭 switch 반전 매력형 | 13.72% | 47~53 |
| ⚖️ balance 황금 밸런스 | 12.87% | 47~53 |
| 🍑 egenteto 겉에속테 | 12.17% | 42~47 |
| 🌷 softegen 포근 에겐 | 13.56% | 17~42 |
| 💞 boldegen 감성 만렙 에겐 | 10.98% | 0~42 |

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 ⚡·카테고리 test·등록일 2026-10-16·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `teto-core.js` | 결과 8종(id·이모지·색·찰떡 케미/라이벌, **ORDER 순서 바꾸지 않음** — poll 번호), 12문항 보기별 테토 점수, 채점·테토 %, poll 인코딩 (UMD) |
| `teto.js` | 시작(티징) → 일상 상황 12개(뒤로 가기) → 에너지 비율 계산 중 → `r/<id>.html` 로 이동, track start/done, sessionStorage 에 내 % |
| `result.js` | 결과 페이지: 게이지(내 %), setShareData(내 % 포함)/setRetry, 같은 유형 비율(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 크림색 바탕 + 테토(주황)·에겐(분홍) 두 빛, 반반 에너지 구슬, 결과 페이지는 그 유형 색(`--c-*`) (제목 Nunito: 라틴·베트남어·키릴 / ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr) |
| `r/`, `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 8종) = 108장, 256색 PNG), 아이콘. 기본 OG 는 물음표 달린 에너지 구슬(결과 인용 없음) |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `types.<id>.word` = 스포일러 검사용 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(뜻·유행의 시작·계산 방법·과학/성별 아님·친구와 즐기기, 스포일러 금지) → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/art.js` | 에너지 구슬 SVG(반반 테토/에겐 + 유형색 점선 고리 + 반짝이) + 이모지 · 케미/라이벌 작은 그림 — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 256색) |
| `tools/check-teto.js` | 도달 분포(전수 + 무작위, 각 10%~15%)·결정성·유형별 테토 % 범위·보기 위치 균형, 언어 파일·스포일러·폭 예산·가짜 통계 금지, 생성 HTML(결과 페이지 다른 결과 링크 0, 게이지 자리에 숫자 없음, FAQPage 없음, 광고 위치, track start/done), OG (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa, check-all 에는 안 들어감) |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어(kicker·headline·blurb) — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 옮겨 넣는다 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js teto           # 이 앱 검사만

# 이 폴더(apps/teto)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-teto.js
node tools/flow-test.js                # 기본 en,ko,ru × 360,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
                                       # 포트: TETO_HTTP_PORT(8971) TETO_MOCK_PORT(8972) TETO_CDP_PORT(9471)
```
