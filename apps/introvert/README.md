# apps/introvert — 내향형 외향형 테스트 (심리테스트)

일상 상황 질문 12개(보기 4개, 2분: 긴 한 주 뒤 금요일 밤, 내 생일, 회의에서 아이디어 묻기, 큰 모임 다음 날, 아는 사람 하나뿐인 파티, 엘리베이터의 이웃, 집에서 혼자 보낸 하루, 단톡방, 고민 푸는 법, 갑작스러운 저녁 약속, 새 모임 첫 주, 전화 vs 메시지) → 결과 8종 중 하나 = "나의 사회적 에너지 유형" + 본인 답으로 계산한 내향/외향 막대.
**mbti 앱과 다르게**: 성격 유형 글자가 아니라 사회적 에너지의 스펙트럼(내향↔외향, 가운데 = 양향형)을 본다. MBTI 용어 금지(check 가 모든 언어·가이드에서 확인).
**정직하게**: 재미용, 임상 검사·진단 아님(결과 페이지 안내·FAQ·가이드에 명시, check 가 en 문구에서 "not a clinical assessment" 확인).
결과 id: recharger 조용한 충전러 🔋 · teapot 숨은 수다쟁이 🫖 · observer 다정한 관찰자 🔭 · chameleon 카멜레온 양향인 🦎 · host 포근한 모임장 🍲 · cheer 찐친 응원단장 📣 · connector 차분한 연결고리 🌉 · butterfly 인싸 나비 🦋 (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 에너지 콩 그림·이름·한 줄·키워드 3·내향/외향 막대·설명·강점 4·팁 2·완벽한 하루 + 찰떡 궁합·정반대 유형(그림·이름만 보여주기, 링크·hover 없음), 다른 결과 링크 없음).

채점(`introvert-core.js`): 8종 = 두 갈래 축 3개(2×2×2), 각 축의 0 = 내향 쪽, 1 = 외향 쪽.
- 축: recharge(solo 0 / people 1) · circle(close 0 / wide 1) · voice(inward 0 / outward 1). 문항 i 의 축 = i % 3 (축마다 4문항)
- 문항마다 보기 4개 = 축의 두 값 각각 강한 보기(2점) + 약한 보기(1점) → 두 값을 바꿔도 대칭
- 축마다 점수가 큰 값, 동점이면 그 축에서 마지막으로 고른 값(결정적·대칭)
- 내향/외향 막대 = 본인 12개 답의 I/(I+E) (강한 내향 3:0 · 약한 내향 2:1 · 약한 외향 1:2 · 강한 외향 0:3). 결과 주소 `#i=<0~100>` 으로 넘기고 공유 링크에도 붙는다. 값이 없으면(#i 없는 방문자) 막대를 숨긴다 — 지어낸 숫자 없음. 50±6 이면 "양향형 구간" 문구
- 찰떡 궁합 = recharge 만 반대, 정반대 유형 = 세 축 모두 반대(서로 짝)

숫자는 진짜만: poll `introvert`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `iv_voted`), 합계 20 이상일 때만 "N% 같은 결과". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-introvert.js` 가 매번 계산, 기준 8%~18%)

8종 모두 정확히 12.50% (축마다 50.00% / 50.00%). 내향/외향 막대 전수 최소 0% · 최대 100% · 평균 50.00%.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🔌·test·2026-11-10·order 2·12개 언어 제목/설명 — 포털 아이콘용 짧은 이름, 앱 h1·title 은 검색어) |
| `introvert-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·축 값·색·짝, 문항별 보기 값·점수, 채점·동점 규칙, 내향/외향 비율·`#i=` 파싱, poll 인코딩 (UMD) |
| `introvert.js` / `result.js` | 시작 → 12문항(뒤로 가기) → 분석 중 → `r/<id>.html#i=<n>` / 결과 페이지(내향/외향 막대·공유·다시 하기·같은 결과 비율) |
| `style.css` | 왼쪽 조용한 밤(인디고) · 오른쪽 환한 낮(햇살) 두 톤 + 남색 잉크, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].c[j]`, `types.<id>.word` = 스포일러 검사용 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (하는 법·융(1921)·아이젱크·빅 파이브·양향형·수줍음과의 차이·친구와 놀기·재미용, 결과 이름·질문 없음) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 에너지 콩 SVG(달/해 = 충전, 작은 친구 1/3 = 관계 크기, 생각/말 풍선 = 표현)·페이지·OG(12개 언어 × 기본 + 8종) 생성 |
| `tools/check-introvert.js` | 전수·무작위 분포·대칭·짝 규칙·내향/외향 비율·poll, 언어 파일·스포일러(가이드 포함)·MBTI 용어 금지·재미용 안내·폭·가짜 통계 금지, 생성 HTML, 사이트맵, OG |
| `tools/check-flow.js` | Chrome headless 실제 흐름(정적 서버 + mock-supa): 모든 문항·결과 페이지 넘침·단어 잘림, 막대 = 본인 답, `#i=` 공유 방문자, 끝 화면 순서, track done 1회, 콘솔 오류 0 |

## 생성 · 검사

```bash
cd apps/introvert
rm -rf _l && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js introvert && MG_I18N_MODE=variant node tools/gen-guides.js introvert)
node tools/gen-og.js all
node tools/check-introvert.js
node tools/check-flow.js en,ko,th,de,ru 360,375
```
