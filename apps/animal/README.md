# apps/lovestyle — 연애 유형 테스트 (심리테스트)

연애 속 8문항(보기 4개, 2~3분) → 연애 유형 8종(귀여운 동물 이모지 캐릭터: 댕댕이 연인 🐶 · 츤데레 고양이 🐱 · 밀당 여우 🦊 · 듬직한 곰 🐻 · 로맨틱 토끼 🐰 · 일편단심 펭귄 🐧 · 단짝 햄스터 🐹 · 자유로운 돌고래 🐬). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나 + 성격 설명 + 연애 매력 3개 + 연애 꿀팁 3개 + 찰떡궁합·앙숙은 보여주기만, 링크 없음). 같은 유형 비율은 poll 실제 값.

숫자는 진짜만: poll `lovestyle`, qid `r0`, opt = `lovestyle-core.js` ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `ls_voted_v1`), 합계 20 이상일 때만 "N% 같은 유형", 서버가 꺼져 있거나 적으면 숨김.

주소: 원본은 자리표시자 `https://lovestyle.example.com/`, 배포 때 `https://miniapp.melgene.com/lovestyle/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 결과 분포 (전수 4^10 = 1,048,576가지, `node tools/check-lovestyle.js` 가 매번 다시 계산·검사, 기준 10%~15%)

각 유형은 8문항 중 5번 대표(3점) 보기, 곁다리(1점)도 5번. 문항 두 개씩 8종 대표를 모두 담는다. 동점은 ① 대표 보기 수 ② 더 나중 문항 ③ ORDER 순.

| 유형 | 전수 |
|---|---|
| 🐶 puppy 댕댕이 연인 | 11.97% |
| 🐱 cat 츤데레 고양이 | 13.97% |
| 🦊 fox 밀당 여우 | 12.62% |
| 🐻 bear 듬직한 곰 | 13.55% |
| 🐰 bunny 로맨틱 토끼 | 11.93% |
| 🐧 penguin 일편단심 펭귄 | 11.15% |
| 🐹 hamster 단짝 햄스터 | 12.67% |
| 🐬 dolphin 자유로운 돌고래 | 12.14% |

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 💘·카테고리 test·등록일 2026-10-04·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `lovestyle-core.js` | 유형 8종(id·이모지·색·찰떡궁합/앙숙, **ORDER 순서 바꾸지 않음** — poll 번호), 8문항 가중치, 채점·동점 규칙, poll 인코딩 (UMD) |
| `lovestyle.js` | 시작(티징) → 질문 10개(뒤로 가기) → 마음 읽는 중 → `r/<id>.html` 로 이동, track start/done |
| `result.js` | 결과 페이지: setShareData/setRetry, 같은 유형 비율(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 밝은 벚꽃 분홍 + 떠다니는 하트, 결과 페이지는 그 유형 색(`--c-*`)으로 물듦 (제목 Nunito 900: 라틴 확장·베트남어·키릴 / ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mali) |
| `r/`, `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 8종) = 108장, 256색 PNG), 아이콘. 기본 OG 는 연애편지 + 물음표(결과 인용 없음) |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `types.<id>.word` = 스포일러 검사용 동물 낱말, `types.<id>.tips` = 연애 꿀팁 3개) |
| `tools/art.js` | 캐릭터 그림(유형 색 후광 + 동물 이모지 + 하트) · 찰떡궁합/앙숙 작은 그림 · 시작 화면 연애편지 — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 256색) |
| `tools/check-lovestyle.js` | 도달 분포(전수 4^10 + 무작위, 각 10%~15%), 언어 파일·스포일러·폭 예산, 생성 HTML(결과 페이지 다른 결과 링크 0, FAQPage 없음, 광고 위치, track start/done), OG (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js lovestyle      # 이 앱 검사만

# 이 폴더(apps/lovestyle)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-lovestyle.js
node tools/flow-test.js                # 기본 en,ko,ru × 360,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
                                       # 포트: LOVESTYLE_HTTP_PORT(8921) LOVESTYLE_MOCK_PORT(8922) LOVESTYLE_CDP_PORT(9421)
```
