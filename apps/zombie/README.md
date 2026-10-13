# apps/zombie — 좀비 생존 테스트 (심리테스트)

할로윈 시즌 좀비 사태 상황 질문 12개(보기 4개, 2분) → 생존자 역할 8종 중 하나. 결과: 생존팀 대장 📣 · 작전 브레인 🗺️ · 응급 구조대원 🩹 · 보급 사냥꾼 🎒 · 만능 수리공 🔧 · 외톨이 늑대 🐺 · 분위기 메이커 🎸 · 천운의 행운아 🍀 (id: leader strategist medic scavenger engineer lonewolf cheer lucky — 언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나 + 한 줄 소개 + 생존 예보(말로만, 숫자 없음) + 설명 + 생존 기술 3개 + 약점 + 생존 팁 + 최고/최악의 파트너는 보여주기만, 링크 없음). 같은 역할 비율은 poll 실제 값. 장난스럽고 무섭지 않은 톤(피·깜짝 놀람 없음).

채점: 보기마다 `[주 유형, 보조 유형]`(`zombie-core.js` QUESTIONS[i].c[j]) — 고르면 주 유형 +2, 보조 유형 +1. 12문항 합이 가장 큰 역할이 결과, 동점이면 "늦은 문항에서 더 받은 쪽"(문항 번호 가중합) → 그래도 같으면 ORDER 앞쪽. 같은 답이면 언제나 같은 결과. 8종이 각각 주 유형으로 6번씩 나오고 보기 위치는 섞여 있다. 보조 유형은 보기마다 내용상 그럴듯한 후보 2~3개 중에서 전수 분포가 가장 고르게 나오도록 탐색해 정했다(수정하면 check 를 다시 돌려 확인).

숫자는 진짜만: poll `zombie`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `zb_voted_v1`), 합계 20 이상일 때만 "N% 같은 역할", 서버가 꺼져 있거나 적으면 숨김. 결과 문구(특히 생존 예보)에는 숫자·% 를 쓰지 않는다 — check 가 막는다.

주소: 원본은 자리표시자 `https://zombie.example.com/`, 배포 때 `https://miniapp.melgene.com/zombie/`(대표 주소 melgene.com). 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-zombie.js` 가 매번 다시 계산·검사, 기준 10%~15%)

| 역할 | 전수 |
|---|---|
| 📣 leader 생존팀 대장 | 12.56% |
| 🗺️ strategist 작전 브레인 | 11.64% |
| 🩹 medic 응급 구조대원 | 13.23% |
| 🎒 scavenger 보급 사냥꾼 | 13.01% |
| 🔧 engineer 만능 수리공 | 12.87% |
| 🐺 lonewolf 외톨이 늑대 | 12.28% |
| 🎸 cheer 분위기 메이커 | 11.81% |
| 🍀 lucky 천운의 행운아 | 12.60% |

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🧟·카테고리 test·등록일 2026-10-14·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `zombie-core.js` | 역할 8종(id·이모지·색·최고/최악의 파트너, **ORDER 순서 바꾸지 않음** — poll 번호), 12문항 보기별 점수, 채점, poll 인코딩 (UMD) |
| `zombie.js` | 시작(티징) → 상황 12개("{n}일차" 진행, 뒤로 가기) → 생존 장비 점검 중 → `r/<id>.html` 로 이동, track start/done |
| `result.js` | 결과 페이지: setShareData/setRetry, 같은 역할 비율(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 한밤의 비상 방송(짙은 녹회색 밤하늘·달·안개·반딧불), 형광 연두·경고 노랑 위험 표시 줄무늬, 결과 페이지는 그 역할 색(`--c-*`) (제목 Rubik: 라틴 확장·키릴 / ko Black Han Sans · ja Dela Gothic One · zh ZCOOL QingKe HuangYou · th Kanit · vi Be Vietnam Pro) |
| `r/`, `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 8종) = 108장, 256색 PNG), 아이콘. 기본 OG 는 물음표 달린 좀비 패치(결과 인용 없음) |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `types.<id>.word` = 스포일러 검사용 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(스포일러 금지, 재미용 명시) → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/art.js` | 생존자 패치 SVG(위험 줄무늬 테두리·리벳·빛나는 원) + 이모지 · 파트너 작은 그림 — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 256색) |
| `tools/check-zombie.js` | 도달 분포(전수 + 무작위, 각 10%~15%)·결정성·주 유형 균형, 언어 파일·스포일러·폭 예산·가짜 통계 금지, 생성 HTML(결과 페이지 다른 결과 링크 0, FAQPage 없음, 광고 위치, track start/done), OG (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa, check-all 에는 안 들어감) |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어(kicker·headline·blurb) — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 옮겨 넣는다 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js zombie         # 이 앱 검사만

# 이 폴더(apps/zombie)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-zombie.js
node tools/flow-test.js                # 기본 en,ko,ru × 360,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
                                       # 포트: ZOMBIE_HTTP_PORT(8961) ZOMBIE_MOCK_PORT(8962) ZOMBIE_CDP_PORT(9461)
```
