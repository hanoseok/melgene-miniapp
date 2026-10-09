# apps/coffee — 나는 어떤 커피? (심리테스트)

일상 상황 질문 12문항(보기 4개, 2분) → 커피 8종 중 하나. 결과: 에스프레소 ⚡ · 아메리카노 💧 · 카페라떼 🥛 · 카푸치노 ☁️ · 카페모카 🍫 · 콜드브루 🧊 · 플랫화이트 🤍 · 카라멜 마키아토 🍮 (id: espresso americano latte cappuccino mocha coldbrew flatwhite caramel). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나 + 한 줄 소개 + 설명 + 장점 3개 + 꿀팁 3개 + 찰떡 단짝·티격태격 라이벌은 보여주기만, 링크 없음). 같은 커피 비율은 poll 실제 값.

채점: 보기마다 `[주 유형, 보조 유형]`(`coffee-core.js` QUESTIONS[i].c[j]) — 고르면 주 유형 +2, 보조 유형 +1. 12문항 합이 가장 큰 커피가 결과, 동점이면 "늦은 문항에서 더 받은 쪽"(문항 번호 가중합) → 그래도 같으면 ORDER 앞쪽. 같은 답이면 언제나 같은 결과. 보기 순서·주 유형 위치는 섞여 있고, 8종이 각각 주 유형으로 6번씩 나온다. 보조 유형은 전수 분포가 고르게 나오도록 탐색해 정했다(수정하면 check 를 다시 돌려 확인).

숫자는 진짜만: poll `coffee`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `cf_voted_v1`), 합계 20 이상일 때만 "N% 같은 커피", 서버가 꺼져 있거나 적으면 숨김.

주소: 원본은 자리표시자 `https://coffee.example.com/`, 배포 때 `https://miniapp.melgene.com/coffee/`(대표 주소 melgene.com). 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-coffee.js` 가 매번 다시 계산·검사, 기준 10%~15%)

| 커피 | 전수 |
|---|---|
| ⚡ espresso 에스프레소 | 11.63% |
| 💧 americano 아메리카노 | 12.71% |
| 🥛 latte 카페라떼 | 12.98% |
| ☁️ cappuccino 카푸치노 | 11.56% |
| 🍫 mocha 카페모카 | 12.82% |
| 🧊 coldbrew 콜드브루 | 13.18% |
| 🤍 flatwhite 플랫화이트 | 13.27% |
| 🍮 caramel 카라멜 마키아토 | 11.84% |

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 ☕·카테고리 test·등록일 2026-10-10·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `coffee-core.js` | 결과 8종(id·이모지·색·단짝/라이벌, **ORDER 순서 바꾸지 않음** — poll 번호), 12문항 보기별 점수, 채점, poll 인코딩 (UMD) |
| `coffee.js` | 시작(티징) → 질문 12개(뒤로 가기) → 커피 내리는 중 → `r/<id>.html` 로 이동, track start/done |
| `result.js` | 결과 페이지: setShareData/setRetry, 같은 커피 비율(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 따뜻한 카페 공책(줄 공책 배경·여백 줄·포스트잇 카드·연필 테두리·스티커 그림자), 결과 페이지는 그 커피 색(`--c-*`) (제목 Pangolin: 라틴 확장·베트남어·키릴 / ko Gaegu · ja Klee One · zh ZCOOL KuaiLe · th Itim) |
| `r/`, `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 8종) = 108장, 256색 PNG), 아이콘. 기본 OG 는 물음표 달린 커피잔(결과 인용 없음) |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `types.<id>.word` = 스포일러 검사용 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(스포일러 금지, 재미용 명시) → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/art.js` | 포스트잇 그림(이모지 + 연필 낙서) · 단짝/라이벌 작은 그림 — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 256색) |
| `tools/check-coffee.js` | 도달 분포(전수 + 무작위, 각 10%~15%)·결정성·주 유형 균형, 언어 파일·스포일러·폭 예산, 생성 HTML(결과 페이지 다른 결과 링크 0, FAQPage 없음, 광고 위치, track start/done), OG (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa, check-all 에는 안 들어감) |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어(kicker·headline·blurb) — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 옮겨 넣는다 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js coffee         # 이 앱 검사만

# 이 폴더(apps/coffee)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-coffee.js
node tools/flow-test.js                # 기본 en,ko,ru × 360,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
                                       # 포트: COFFEE_HTTP_PORT(8941) COFFEE_MOCK_PORT(8942) COFFEE_CDP_PORT(9441)
```
