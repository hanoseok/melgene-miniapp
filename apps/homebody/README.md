# apps/homebody — 집순이·집돌이 지수 테스트 (심리테스트)

일상 상황 10문항(보기 4개, 점수 0·3·7·10) → 집콕 지수 0~100% → 결과 6단계. 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나 + 그 단계의 지수 범위 + 찰떡·상극 유형은 보여주기만, 링크 없음).

지수 = 10문항 점수 합(0~100)을 20~80 구간에서 0~100 으로 폄 → `CUTS` 로 6단계(균등 무작위 응답 기준 각 13~20%). 단계 id 는 `wild < roamer < switch < nester < homebody < legend`.

숫자는 진짜만: poll `homebody`, qid `r0`, opt = 지수의 10점 구간(0~9, 100 은 9). **방금 테스트를 푼 브라우저**에서만 정확한 %(sessionStorage `hb_score`)와 "나보다 집순이·집돌이인 사람 N%"(내 구간보다 높은 구간 + 같은 구간의 절반)를 보여 준다. 처음 받은 결과만 한 번 투표(localStorage `hb_voted_v1`), 합계 20 미만이거나 서버가 꺼져 있으면 숨김. 공유 링크로 온 방문자는 그 단계의 범위만 본다.

주소: 원본은 자리표시자 `https://homebody.example.com/`, 배포 때 `https://miniapp.melgene.com/homebody/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🏠·카테고리 test·등록일 2026-10-21·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `homebody-core.js` | 6단계(id·색·찰떡/상극, ORDER 순서), 10문항 보기 점수(**순서가 언어 파일의 보기 순서와 1:1**), 지수 계산·단계 경계(CUTS)·범위, poll 구간 인코딩·백분위 (UMD) |
| `homebody.js` | 시작(티징) → 질문 10개(뒤로 가기) → 계산 중 → `r/<id>.html` 로 이동, track start/done, sessionStorage 에 지수 저장 |
| `result.js` | 결과 페이지: setShareData/setRetry, 방금 푼 사람의 정확한 %·공유 문구, 백분위(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 해 질 녘 램프빛 갈색 + 따뜻한 안개, 결과 페이지는 그 단계 색(`--a-*`)으로 물듦, 지수 막대 |
| `r/`, `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 6단계) = 84장), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 `guide.html` 생성 |
| `tools/art.js` | 집 그림 SVG(단계가 높을수록 창문 불빛이 밝고 밖이 어두워짐) — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 256색) |
| `tools/check-homebody.js` | 도달 분포(전수 4^10 + 무작위), 단계 경계·poll·백분위, 언어 파일·스포일러·폭 예산, 생성 HTML(결과 페이지 다른 결과 링크 0, FAQPage 없음, 광고 위치), OG (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js homebody     # 이 앱 검사만

# 이 폴더(apps/homebody)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-homebody.js
```
