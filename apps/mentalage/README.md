# apps/mentalage — 정신연령 테스트 (심리테스트)

가벼운 일상 질문 12문항(보기 2~4개, 2~3분) → 마음 나이대 8종 + 그 안의 숫자 나이(결정적). 나이대: 놀이터 꼬마 🍭 7–12 · 질풍노도 십대 🎧 13–17 · 새내기 스무 살 🛹 18–23 · 열정 이십 대 ☕ 24–29 · 안정 삼십 대 🪴 30–39 · 노련한 사십 대 🧭 40–49 · 여유로운 오십 대 🍵 50–64 · 인생 9단 어르신 🦉 65–82. 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나 + 나이 도장 + 설명 + 장점 3개 + 꿀팁 3개 + 찰떡 단짝·티격태격 라이벌은 보여주기만, 링크 없음). 같은 나이대 비율은 poll 실제 값.

채점: 보기마다 "마음 나이 점수" 0~6(`mentalage-core.js` QUESTIONS[i].points, 보기 순서와 점수는 섞여 있음). 점수 합 → `CUTS` 로 나이대, 그 나이대 안에서 (합, 늦은 문항 가중합) 순 분위를 나이 범위에 옮겨 숫자 나이. 같은 답이면 언제나 같은 나이대·같은 숫자.

숫자 나이: 정적 결과 페이지는 범위(예: 24–29)를 보여 주고, 퀴즈가 `r/<id>.html#a=<나이>` 로 넘기면 `result.js` 가 범위 안의 숫자일 때만 그 숫자로 바꾼다(공유 링크·공유 문구에도 `#a=`). 나이 문구는 언어별 복수형(`result.age.one/few/many/other`, Intl.PluralRules — ru год/года/лет).

숫자는 진짜만: poll `mentalage`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `ma_voted_v1`), 합계 20 이상일 때만 "N% 같은 나이대", 서버가 꺼져 있거나 적으면 숨김.

주소: 원본은 자리표시자 `https://mentalage.example.com/`, 배포 때 `https://miniapp.melgene.com/mentalage/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 결과 분포 (전수 4^9·3^2·2 = 4,718,592가지, `node tools/check-mentalage.js` 가 매번 다시 계산·검사, 기준 10%~15%)

| 나이대 | 나이 | 전수 |
|---|---|---|
| 🍭 kid 놀이터 꼬마 | 7–12 | 11.23% |
| 🎧 teen 질풍노도 십대 | 13–17 | 12.22% |
| 🛹 fresh 새내기 스무 살 | 18–23 | 12.41% |
| ☕ hustle 열정 이십 대 | 24–29 | 13.99% |
| 🪴 steady 안정 삼십 대 | 30–39 | 13.96% |
| 🧭 seasoned 노련한 사십 대 | 40–49 | 12.32% |
| 🍵 mellow 여유로운 오십 대 | 50–64 | 12.16% |
| 🦉 sage 인생 9단 어르신 | 65–82 | 11.73% |

숫자 나이 7~82 의 76가지 모두 어떤 답으로든 나온다(검사).

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🧠·카테고리 test·등록일 2026-10-08·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `mentalage-core.js` | 나이대 8종(id·이모지·색·나이 범위·단짝/라이벌, **ORDER 순서 바꾸지 않음** — poll 번호), 12문항 점수, CUTS, 숫자 나이표, validAge, poll 인코딩 (UMD) |
| `mentalage.js` | 시작(티징) → 질문 12개(뒤로 가기) → 재는 중 → `r/<id>.html#a=<나이>` 로 이동, track start/done |
| `result.js` | 결과 페이지: 숫자 나이(#a=) 반영, setShareData(#a 포함)/setRetry, 같은 나이대 비율(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 파스텔 낙서 공책(줄 공책 배경·여백 줄·포스트잇 카드·연필 테두리·스티커 그림자), 결과 페이지는 그 나이대 색(`--c-*`) (제목 Pangolin: 라틴 확장·베트남어·키릴 / ko Gaegu · ja Klee One · zh ZCOOL KuaiLe · th Itim) |
| `r/`, `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 8종) = 108장, 256색 PNG), 아이콘. 기본 OG 는 물음표 달린 뇌(결과 인용 없음) |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `types.<id>.word` = 스포일러 검사용 낱말) |
| `tools/art.js` | 포스트잇 그림(이모지 + 연필 낙서) · 단짝/라이벌 작은 그림 — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 256색) |
| `tools/check-mentalage.js` | 도달 분포(전수 + 무작위, 각 10%~15%)·숫자 나이 범위/도달/결정성·단조, 언어 파일·스포일러·폭 예산, 생성 HTML(결과 페이지 다른 결과 링크 0, 나이 도장, FAQPage 없음, 광고 위치, track start/done), OG (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa, check-all 에는 안 들어감) |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어(kicker·headline·blurb) — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 옮겨 넣는다 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js mentalage      # 이 앱 검사만

# 이 폴더(apps/mentalage)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-mentalage.js
node tools/flow-test.js                # 기본 en,ko,ru × 360,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
                                       # 포트: MENTALAGE_HTTP_PORT(8931) MENTALAGE_MOCK_PORT(8932) MENTALAGE_CDP_PORT(9431)
```
