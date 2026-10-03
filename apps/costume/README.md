# apps/costume — 할로윈 코스튬 추천 (심리테스트)

할로윈 파티 속 12문항(보기 4개) → 코스튬 8종(뱀파이어·마녀·이불 유령·좀비·검은 고양이·미라·호박 대왕·해골). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나 + 성격 설명 + 코스튬 만드는 팁 3개 + 찰떡 단짝·라이벌은 보여주기만, 링크 없음). 같은 코스튬 비율은 poll 실제 값.

숫자는 진짜만: poll `costume`, qid `r0`, opt = `costume-core.js` ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `cs_voted_v1`), 합계 20 이상일 때만 "N% 같은 코스튬", 서버가 꺼져 있거나 적으면 숨김.

주소: 원본은 자리표시자 `https://costume.example.com/`, 배포 때 `https://miniapp.melgene.com/costume/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-costume.js` 가 매번 다시 계산·검사, 기준 10%~15%)

각 유형은 12문항 중 6번 대표(3점) 보기, 곁다리(1점)는 5~7번. 동점은 ① 대표 보기 수 ② 더 나중 문항 ③ ORDER 순.

| 코스튬 | 전수 | 무작위 20만 회 |
|---|---|---|
| 🧛 vampire 벨벳 뱀파이어 | 12.51% | ≈12.5% |
| 🧙 witch 달빛 마녀 | 12.36% | ≈12.4% |
| 👻 ghost 이불 유령 | 13.06% | ≈13.1% |
| 🧟 zombie 파티 좀비 | 12.85% | ≈12.9% |
| 🐈‍⬛ blackcat 한밤의 검은 고양이 | 11.55% | ≈11.5% |
| 🩹 mummy 포근한 미라 | 12.64% | ≈12.7% |
| 🎃 pumpkin 호박 대왕 | 13.74% | ≈13.7% |
| 💀 skeleton 춤추는 해골 | 11.29% | ≈11.3% |

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎭·카테고리 test·등록일 2026-10-02·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `costume-core.js` | 코스튬 8종(id·색·단짝/라이벌, **ORDER 순서 바꾸지 않음** — poll 번호), 12문항 가중치(대표 3점 + 곁다리 1점, 각 유형 대표 6번), 채점·동점 규칙, poll 인코딩 (UMD) |
| `costume.js` | 시작(티징) → 질문 12개(뒤로 가기) → 옷장 뒤지는 중 → `r/<id>.html` 로 이동, track start/done |
| `result.js` | 결과 페이지: setShareData/setRetry, 같은 코스튬 비율(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 보랏빛 할로윈 밤 + 호박 주황, 결과 페이지는 그 코스튬 색(`--c-*`)으로 물듦 (제목 Nunito 900: 라틴 확장·베트남어·키릴 / ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mali) |
| `r/`, `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 8종) = 108장, 256색 PNG), 아이콘. 기본 OG 는 정체불명 옷걸이 + 물음표(결과 인용 없음) |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `types.<id>.word` = 스포일러 검사용 낱말, `types.<id>.tips` = 코스튬 팁 3개) |
| `tools/art.js` | 코스튬 캐릭터 SVG(후광 + 얼굴) · 단짝/라이벌 작은 얼굴 · 정체불명 옷걸이 — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 256색) |
| `tools/check-costume.js` | 도달 분포(전수 4^12 + 무작위, 각 10%~15%), 언어 파일·스포일러·폭 예산, 생성 HTML(결과 페이지 다른 결과 링크 0, FAQPage 없음, 광고 위치), OG (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js costume      # 이 앱 검사만

# 이 폴더(apps/costume)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-costume.js
node tools/flow-test.js              # 기본 en,ko,ru × 360,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
                                     # 포트: COSTUME_HTTP_PORT(8897) COSTUME_MOCK_PORT(8898) COSTUME_CDP_PORT(9401)
```
