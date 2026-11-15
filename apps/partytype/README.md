# apps/partytype — 파티 유형 테스트 (심리테스트)

모임·파티의 흔한 장면 12개(보기 4개, 2분: 도착, 분위기가 썰렁할 때, 토요일 초대, 노래·춤 타임, 간식 테이블, "게임 하자!", 자정의 2차 제안, 단체 사진, 언제 갈까, 다음 날 단톡방, 처음 보는 친구의 친구, 배달이 한 시간 늦음) → 결과 8종 중 하나 = "모임에서 내 역할" + 본인 energy 답으로 계산한 파티 에너지 0~100.
연말 파티 시즌에 맞췄지만 생일·홈파티·게임의 밤에도 그대로 통하게(사계절용). 언어마다 현지 모임 문화(ko 송년회·회식·2차, ja 忘年会・二次会, pt confraternização, ru корпоратив 등)로 썼다.
**정직하게**: 재미용, 임상 검사·심리 검사 아님(결과 페이지 안내·FAQ·가이드에 명시, check 가 en 문구에서 "not a clinical assessment" 확인). 어느 유형도 나쁘지 않게 — 조용한 쪽도 파티에 꼭 필요한 역할로 쓴다. MBTI 용어 금지(check).
결과 id: confidant 속마음 단짝 🕯️ · earlybird 해피 얼리버드 🐤 · snack 간식 탐험대 🧁 · memory 추억 기록가 📸 · spark 분위기 메이커 🎈 · host 다정한 호스트 🫶 · dj 무드 DJ 🎧 · captain 파티 캡틴 📋 (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 파티 손님 캐릭터 그림·이름·한 줄·키워드 3·파티 에너지 게이지·설명·강점 4·파티 팁 2·어울리는 모임 + 단짝·정반대 유형(그림·이름만 보여주기, 링크·hover 없음), 다른 결과 링크 없음).

채점(`partytype-core.js`): 8종 = 두 갈래 축 3개(2×2×2).
- 축: energy 파티 에너지(cozy 0 / buzz 1) · focus 관심(people 0 / scene 1 — 음악·음식·사진·놀이) · style 노는 방식(flow 0 / plan 1). 문항 i 의 축 = i % 3 (축마다 4문항)
- 문항마다 보기 4개 = 축의 두 값 각각 강한 보기(2점) + 약한 보기(1점) → 두 값을 바꿔도 대칭
- 축마다 점수가 큰 값, 동점이면 그 축에서 마지막으로 고른 값(결정적·대칭)
- 파티 에너지 게이지 = energy 문항 4개 답의 합 / 12 (강한 buzz 3 · 약한 buzz 2 · 약한 cozy 1 · 강한 cozy 0). 결과 주소 `#e=<0~100>` 으로 넘기고 공유 링크에도 붙는다. 값이 없으면(#e 없는 방문자) 게이지를 숨긴다 — 지어낸 숫자 없음. 구간 문구: ≤33 잔잔 · 34~66 균형 · ≥67 신남(무작위 답에서 25.8% / 48.4% / 25.8%). 전수 조사로 energy 축 결과와 구간이 반대로 어긋나는 경우 0
- 단짝 = energy 만 반대, 정반대 유형 = 세 축 모두 반대(서로 짝)

숫자는 진짜만: poll `partytype`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `pt_voted`), 합계 20 이상일 때만 "N% 같은 결과". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-partytype.js` 가 매번 계산, 기준 8%~18%)

8종 모두 정확히 12.50% (축마다 50.00% / 50.00%). 파티 에너지 게이지 전수 최소 0 · 최대 100 · 평균 50.00.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎉·test·2026-11-16·order 2·12개 언어 제목/설명 — 포털 아이콘용 짧은 이름, 앱 h1·title 은 검색어) |
| `partytype-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·축 값·색·짝, 문항별 보기 값·점수, 채점·동점 규칙, 파티 에너지 게이지·`#e=` 파싱·구간, poll 인코딩 (UMD) |
| `partytype.js` / `result.js` | 시작 → 12문항(뒤로 가기) → 분석 중 → `r/<id>.html#e=<n>` / 결과 페이지(게이지·공유·다시 하기·같은 결과 비율) |
| `style.css` | 크림색 종이 + 색종이 점 바탕, 밤하늘 남보라 잉크·보라 버튼, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].c[j]`, `types.<id>.word` = 스포일러 검사용 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (하는 법·세 가지 습관·융(1920년대)의 내향/외향과 대부분은 중간·상황에 따라 달라짐·스타일별 파티 즐기는 법·친구와 놀기·재미용, 결과 이름·질문 없음) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 파티 손님 캐릭터 SVG(머그와 촛불·작은 새·컵케이크·카메라·파티 나팔·쟁반·헤드폰·클립보드, 시작 화면은 물음표 선물 상자)·페이지·OG(12개 언어 × 기본 + 8종) 생성 |
| `tools/check-partytype.js` | 전수·무작위 분포·대칭·짝 규칙·게이지(구간과 축 결과 일치)·poll, 언어 파일·스포일러(가이드 포함)·임상/MBTI 용어 금지·재미용 안내·폭·가짜 통계 금지, 생성 HTML, 사이트맵, OG |
| `tools/check-flow.js` | Chrome headless 실제 흐름(정적 서버 8651 + mock-supa 8652, CDP 9651): 모든 문항·결과 페이지 넘침·단어 잘림, 게이지 = 본인 답, `#e=` 공유 방문자, 끝 화면 순서, track done 1회, 콘솔 오류 0 |

## 생성 · 검사

```bash
cd apps/partytype
rm -rf _l && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js partytype && MG_I18N_MODE=variant node tools/gen-guides.js partytype)
node tools/gen-og.js all
node tools/check-partytype.js
node tools/check-flow.js en,ko,th,ru 360,375
```
