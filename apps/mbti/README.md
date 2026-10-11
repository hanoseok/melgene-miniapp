# apps/mbti — MBTI 테스트 (심리테스트)

16유형 모델에서 영감을 받은 **비공식 재미용** MBTI 테스트(공식 MBTI® 검사 아님, The Myers-Briggs Company 와 무관 — 결과 페이지·FAQ·가이드에 한 줄 안내). 일상 문장 20개(축 E/I·S/N·T/F·J/P × 5문항)에 5단계로 답하면(3분) 네 글자 유형 16종 중 하나. 결과 페이지 `r/<id>.html`(id = 소문자 네 글자: intj … esfp) = 그 결과 하나 + 축별 비율 막대(내 답에서 실제 계산, `#d=`) + 별명·한 줄 소개·설명 + 강점 3·약점 3 + 일할 때·연애할 때 + 찰떡궁합(E/I·J/P 를 뒤집은 유형)·상극(네 글자 모두 뒤집은 유형)은 보여주기만(링크 없음) + 비공식 안내 + 공통 끝 화면.

채점(`mbti-core.js`): 답 0(전혀 아니다)~4(매우 그렇다) → d = 답 − 2. 문항 key 가 +1 이면 앞 글자(E·S·T·J), −1 이면 뒤 글자 쪽. 축 합 s(−10~+10) > 0 → 앞 글자, < 0 → 뒤 글자, = 0 → 그 축에서 처음으로 0이 아닌 답의 방향(대칭이라 치우침 없음), 모두 0이면 뒤 글자. 앞 글자 비율 = 50 + 5·s %. 축마다 앞/뒤 글자 문항이 3:2 / 2:3 으로 섞여 있어 "다 그렇다"만 눌러도 한쪽으로 몰리지 않는다. 같은 답이면 언제나 같은 결과.

숫자는 진짜만: 축 막대는 주소의 `#d=`(base64url "E.S.T.J" 비율)가 유형 글자와 맞을 때만 보이고, 없으면 숨김(공유 링크에도 `#d=` 를 붙여 친구도 같은 막대를 봄). 같은 유형 비율은 poll `mbti` — 서버 보기 번호가 0~9 까지라 16종을 qid `r0`(ORDER 0~7)·`r1`(8~15)에 나눠 담는다. 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `mb_voted_v1`), 합계 20 이상일 때만 "N% 같은 유형", 서버가 꺼져 있거나 적으면 숨김.

주소: 원본은 자리표시자 `https://mbti.example.com/`, 배포 때 `https://miniapp.melgene.com/mbti/`(대표 주소 melgene.com). 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 결과 분포 (`node tools/check-mbti.js` 가 매번 다시 계산·검사, 기준 5.5%~7%)

축마다 5^5 = 3,125가지 답을 전부 채점 → 앞 글자 확률 49.984%(네 축 같음, 축끼리 독립) → 16종 정확한 확률 6.242%~6.258%. 무작위 200,000회도 6.1%~6.4%.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🧩·카테고리 test·등록일 2026-10-12·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `mbti-core.js` | 유형 16종(ORDER 순서 바꾸지 않음 — poll 번호, 이모지·그룹 색 NT/NF/SJ/SP·찰떡궁합/상극), 20문항(축·방향·장식 이모지), 채점·축 비율, `#d=` 인코딩/검증, poll 인코딩 (UMD) |
| `mbti.js` | 시작(티징) → 20문항(5단계, 뒤로 가기) → 분석 중 → `r/<id>.html#d=…` 로 이동, track start(첫 질문이 보일 때)/done |
| `result.js` | 결과 페이지: 축 막대(`#d=` 검증 후), setShareData(이 결과 + `#d=`)/setRetry, 같은 유형 비율(서버 값), 공유로 온 방문자에게만 "해 보기" CTA |
| `style.css` | 모눈종이 배경 + 2×2 글자 타일 스티커 + 둥근 카드, 결과 페이지는 그룹 색(`--c-*`). 제목 Nunito(라틴·베트남어·키릴) / ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr |
| `r/`, `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어 × (기본 + 16종) = 204장, 128색 PNG), 아이콘. 기본 OG 는 물음표 타일(결과 인용 없음) |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `types.<id>.word` = 스포일러 검사용 낱말, ru 는 «ты») |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(네 축 개념 설명만 — 16종 목록·별명 없음, 비공식 안내) → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/art.js` | 2×2 글자 타일 + 이모지 배지 · 찰떡궁합/상극 작은 그림 — 생성기·OG 공용 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js` + ImageMagick 로 128색) |
| `tools/check-mbti.js` | 분포(축별 전수 + 무작위)·결정성·16종 도달·`#d=` 왕복, 언어 파일·스포일러(유형 코드·별명이 시작 전 문구·가이드에 없는지)·비공식 안내·ru «ты»·폭 예산, 생성 HTML(결과 페이지 다른 결과 링크 0, FAQPage 없음, 광고 위치, track start/done), OG (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa, check-all 에는 안 들어감) |
| `tools/hub-curation.json` | 포털 "오늘의 미니앱" 카드 문구 12개 언어(kicker·headline·blurb) — `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 옮겨 넣는다 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js mbti           # 이 앱 검사만

# 이 폴더(apps/mbti)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-mbti.js
node tools/flow-test.js                # 기본 en,ko,ru × 360,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
                                       # 포트: MBTI_HTTP_PORT(8951) MBTI_MOCK_PORT(8952) MBTI_CDP_PORT(9451)
```
