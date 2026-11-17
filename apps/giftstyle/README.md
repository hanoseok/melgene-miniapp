# apps/giftstyle — 선물 스타일 테스트 (심리테스트)

선물을 고르고 건네는 흔한 장면 12개(보기 4개, 2분: 친구 생일 3주 전, 적은 예산, 마니또/시크릿 산타, 연말 선물 쇼핑 시작, 손수 만든 선물 vs 산 선물, "아무것도 사 오지 마", 포장은 언제, 잘 모르는 동료 선물, 마음에 안 드는 선물을 받았을 때, 여름에 겨울 생일 선물 발견, 내가 받고 싶은 최고의 선물, 선물 건네는 방법) → 결과 8종 중 하나 = "선물하는 사람" 캐릭터 + 본인 timing 답으로 계산한 선물 준비 게이지 0~100.
연말 선물 시즌에 맞췄지만 생일·기념일에도 그대로 통하게(사계절용). 언어마다 현지 선물 문화(ko 마니또·기프티콘, ja プレゼント交換, de Wichteln, es amigo invisible, pt amigo secreto, ru Новый год·Тайный Санта, th จับฉลากของขวัญ 등)로 썼다.
**정직하게**: 재미용, 임상 검사·심리 검사 아님(결과 페이지 안내·FAQ·가이드에 명시, check 가 en 문구에서 "not a clinical assessment" 확인). 어느 유형도 나쁘지 않게 — 막판에 사는 쪽도 순발력 있는 다정함으로 쓴다. MBTI 용어 금지(check).
결과 id: quickfind 순발력 히어로 ⚡ · helper 실속 해결사 🧰 · moment 순간 연출가 🎆 · together 기쁨 나눔이 🍰 · detective 선물 탐정 🔍 · wishlist 위시리스트 마법사 📝 · crafter 손끝 장인 🧶 · curator 경험 큐레이터 🎟️ (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 선물하는 사람 캐릭터 그림·이름·한 줄·키워드 3·선물 준비 게이지·설명·강점 4·선물 팁 2·나의 시그니처 선물 + 단짝·정반대 유형(그림·이름만 보여주기, 링크·hover 없음), 다른 결과 링크 없음).

채점(`giftstyle-core.js`): 8종 = 두 갈래 축 3개(2×2×2).
- 축: timing 준비 시점(spark 즉흥 0 / plan 미리 1) · focus 중요하게 보는 것(useful 실용 0 / heart 의미·경험 1) · style 고르는 방식(surprise 깜짝 0 / ask 물어보기·위시리스트 1). 문항 i 의 축 = i % 3 (축마다 4문항)
- 문항마다 보기 4개 = 축의 두 값 각각 강한 보기(2점) + 약한 보기(1점) → 두 값을 바꿔도 대칭
- 축마다 점수가 큰 값, 동점이면 그 축에서 마지막으로 고른 값(결정적·대칭)
- 선물 준비 게이지 = timing 문항 4개 답의 합 / 12 (강한 plan 3 · 약한 plan 2 · 약한 spark 1 · 강한 spark 0). 결과 주소 `#g=<0~100>` 으로 넘기고 공유 링크에도 붙는다. 값이 없으면(#g 없는 방문자) 게이지를 숨긴다 — 지어낸 숫자 없음. 구간 문구: ≤33 즉흥 · 34~66 균형 · ≥67 미리미리(무작위 답에서 25.8% / 48.4% / 25.8%). 전수 조사로 timing 축 결과와 구간이 반대로 어긋나는 경우 0
- 단짝 = timing 만 반대, 정반대 유형 = 세 축 모두 반대(서로 짝)

숫자는 진짜만: poll `giftstyle`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `gs_voted`), 합계 20 이상일 때만 "N% 같은 결과". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-giftstyle.js` 가 매번 계산, 기준 8%~18%)

8종 모두 정확히 12.50% (축마다 50.00% / 50.00%). 선물 준비 게이지 전수 최소 0 · 최대 100 · 평균 50.00.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎁·test·2026-11-18·order 2·12개 언어 제목/설명 — 포털 아이콘용 짧은 이름, 앱 h1·title 은 검색어) |
| `giftstyle-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·축 값·색·짝, 문항별 보기 값·점수, 채점·동점 규칙, 선물 준비 게이지·`#g=` 파싱·구간, poll 인코딩 (UMD) |
| `giftstyle.js` / `result.js` | 시작 → 12문항(뒤로 가기) → 분석 중 → `r/<id>.html#g=<n>` / 결과 페이지(게이지·공유·다시 하기·같은 결과 비율) |
| `style.css` | 크림색 종이 + 빨강·초록 점 바탕, 짙은 잉크·빨간 버튼, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].c[j]`, `types.<id>.word` = 스포일러 검사용 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (하는 법·세 가지 습관·모스 「증여론」(1925)과 호혜성·선물 심리 연구(받는 사람은 원하던 것·경험을 반김)·스타일별 더 좋은 선물 팁·친구와 놀기·재미용, 결과 이름·질문 없음) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 선물하는 사람 캐릭터 SVG(번개 쇼핑백·공구 상자·불꽃 막대·케이크 두 조각·돋보기·목록 두루마리·털실과 바늘·티켓 두 장, 시작 화면은 물음표 선물 상자)·페이지·OG(12개 언어 × 기본 + 8종) 생성 |
| `tools/check-giftstyle.js` | 전수·무작위 분포·대칭·짝 규칙·게이지(구간과 축 결과 일치)·poll, 언어 파일·스포일러(가이드 포함)·임상/MBTI 용어 금지·재미용 안내·폭·가짜 통계 금지, 생성 HTML, 사이트맵, OG |
| `tools/check-flow.js` | Chrome headless 실제 흐름(정적 서버 8671 + mock-supa 8672, CDP 9671): 모든 문항·결과 페이지 넘침·단어 잘림, 게이지 = 본인 답, `#g=` 공유 방문자, 끝 화면 순서, track done 1회, 콘솔 오류 0 |

## 생성 · 검사

```bash
cd apps/giftstyle
rm -rf _l && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js giftstyle && MG_I18N_MODE=variant node tools/gen-guides.js giftstyle)
node tools/gen-og.js all
node tools/check-giftstyle.js
node tools/check-flow.js en,ko,th,ru 360,375
```
