# apps/aura — 오라 컬러 테스트 (심리테스트)

12문항(보기 4개) → 오라 8종. 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나 + 찰떡·상극 오라는 보여주기만, 링크 없음). 같은 오라 비율은 poll 실제 값.

숫자는 진짜만: poll `aura`, qid `r0`, opt = `aura-core.js` ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `au_voted_v1`), 합계 20 이상일 때만 "N% 같은 오라", 서버가 꺼져 있거나 적으면 숨김.

주소: 원본은 자리표시자 `https://aura.example.com/`, 배포 때 `https://miniapp.melgene.com/aura/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔮·카테고리 test·등록일 2026-09-30·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `aura-core.js` | 오라 8종(id·그라데이션 색·찰떡/상극, **ORDER 순서 바꾸지 않음** — poll 번호), 12문항 가중치(대표 3점 + 곁다리 1점, 각 유형 대표 6번), 채점·동점 규칙, poll 인코딩 (UMD) |
| `aura.js` | 시작(티징) → 질문 12개(뒤로 가기) → 오라 읽는 중 → `r/<id>.html` 로 이동, track start/done |
| `result.js` | 결과 페이지: setShareData/setRetry, 같은 오라 비율(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 밤빛 남색 + 진주빛 안개, 결과 페이지는 그 오라 색(`--a-*`)으로 물듦 (제목 Comfortaa: 라틴 확장·베트남어·키릴 / ko Jua · ja Zen Maru Gothic · zh ZCOOL XiaoWei · th Mali) |
| `r/`, `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 8종) = 108장, 256색 PNG ~150KB), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `types.<id>.word` = 스포일러 검사용 색 낱말) |
| `tools/art.js` | 오라 SVG(흐릿한 빛 여러 겹 + 실루엣, 찰떡·상극 구슬) — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 256색) |
| `tools/check-aura.js` | 도달 분포(전수 4^12 + 무작위), 언어 파일·스포일러·폭 예산, 생성 HTML(결과 페이지 다른 결과 링크 0, FAQPage 없음, 광고 위치), OG (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js aura         # 이 앱 검사만

# 이 폴더(apps/aura)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-aura.js
node tools/flow-test.js             # 기본 en,ko,th,ru × 360,375,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
                                    # 포트: AURA_HTTP_PORT(8893) AURA_MOCK_PORT(8894) AURA_CDP_PORT(9398)
```
