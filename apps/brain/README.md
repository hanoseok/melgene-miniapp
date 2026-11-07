# apps/brain — 좌뇌 우뇌 테스트 (심리테스트)

일상 질문 12개(보기 4개, 2분: 새 휴대폰 고르기, 빈 토요일, 카페 길 알려 주기, 친구의 이직 고민, 주말 여행 짐, 기억하는 법, 새 보드게임 규칙서, 할 일 목록, 새 아이디어 설명, 처음 만난 사람의 묘한 느낌, 낯선 도시의 하루, 쉬는 시간) → 결과 8종 중 하나 = "나를 닮은 뇌 캐릭터" + 본인 답으로 계산한 좌/우 생각 습관 막대.
**정직하게**: 좌뇌형·우뇌형 "우세"는 대중적 속설이고 두 반구는 함께 일한다 — 이 테스트는 생각 습관의 선호를 재미로 본다(결과 페이지 안내·FAQ·가이드에 명시, check 가 en 문구에서 확인). 심리 검사·진단 아님.
결과 id: architect 설계도 브레인 📐 · mapmaker 지도 메이커 🗺️ · debater 순발력 토론왕 🎤 · hacker 퍼즐 해커 🧩 · weaver 감성 이야기꾼 📖 · designer 차분한 디자이너 🎨 · firework 아이디어 불꽃 🎆 · dreamer 공상 아티스트 🌈 (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 뇌 그림·이름·한 줄·키워드 3·좌/우 막대·설명·강점 4·팁 2·빛나는 곳 + 단짝·라이벌(그림·이름만 보여주기, 링크·hover 없음), 다른 결과 링크 없음).

채점(`brain-core.js`): 8종 = 두 갈래 축 3개(2×2×2), 각 축의 0 = 흔히 말하는 "좌뇌식", 1 = "우뇌식".
- 축: think(logic 0 / intuition 1) · plan(plan 0 / flow 1) · express(words 0 / images 1). 문항 i 의 축 = i % 3 (축마다 4문항)
- 문항마다 보기 4개 = 축의 두 값 각각 강한 보기(2점) + 약한 보기(1점) → 두 값을 바꿔도 대칭
- 축마다 점수가 큰 값, 동점이면 그 축에서 마지막으로 고른 값(결정적·대칭)
- 좌/우 막대 = 본인 12개 답의 L/(L+R) (강한 좌 3:0 · 약한 좌 2:1 · 약한 우 1:2 · 강한 우 0:3). 결과 주소 `#l=<0~100>` 으로 넘기고 공유 링크에도 붙는다. 값이 없으면(#l 없는 방문자) 막대를 숨긴다 — 지어낸 숫자 없음
- 단짝 = think 만 반대, 라이벌 = 세 축 모두 반대(서로 짝)

숫자는 진짜만: poll `brain`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `br_voted`), 합계 20 이상일 때만 "N% 같은 결과". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-brain.js` 가 매번 계산, 기준 8%~18%)

8종 모두 정확히 12.50% (축마다 50.00% / 50.00%). 좌/우 막대 전수 최소 0% · 최대 100% · 평균 50.00%.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🧠·test·2026-11-08·order 2·12개 언어 제목/설명 — 포털 아이콘용 짧은 이름, 앱 h1·title 은 검색어) |
| `brain-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·축 값·색·단짝/라이벌, 문항별 보기 값·점수, 채점·동점 규칙, 좌/우 비율·`#l=` 파싱, poll 인코딩 (UMD) |
| `brain.js` / `result.js` | 시작 → 12문항(뒤로 가기) → 분석 중 → `r/<id>.html#l=<n>` / 결과 페이지(좌/우 막대·공유·다시 하기·같은 결과 비율) |
| `style.css` | 화면을 반으로 나눈 두 톤(왼쪽 살구 · 오른쪽 하늘) + 남색 잉크, Fredoka(vi·ru Nunito, ja M PLUS Rounded 1c, th Kanit), 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].c[j]`, `types.<id>.word` = 스포일러 검사용 낱말). privacy 는 다른 앱 문구를 앱 이름·날짜만 바꿔 넣은 것 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (하는 법·Broca/Wernicke·Sperry/Gazzaniga 분리뇌 연구·속설이 퍼진 이유와 지금의 과학·생각 습관의 뜻·친구와 놀기·재미용, 결과 이름·질문 없음) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 뇌 캐릭터 SVG·페이지·OG(12개 언어 × 기본 + 8종) 생성 |
| `tools/check-brain.js` | 전수·무작위 분포·대칭·짝 규칙·좌/우 비율·poll, 언어 파일·스포일러(가이드 포함)·속설 안내·폭·가짜 통계 금지, 생성 HTML(짝 카드 링크 없음, 다른 결과 링크 0, 막대 자리 숨김), 사이트맵, OG |
| `tools/check-flow.js` | Chrome headless 실제 흐름(정적 서버 + mock-supa): 모든 문항·모든 결과 페이지 가로 넘침·단어 잘림, 좌/우 막대 = 본인 답, `#l=` 공유 방문자, 끝 화면 순서, track done 1회, 콘솔 오류 0 |

## 생성 · 검사

```bash
cd apps/brain
rm -rf _l && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js brain && MG_I18N_MODE=variant node tools/gen-guides.js brain)
node tools/gen-og.js all
node tools/check-brain.js
node tools/check-flow.js en,ko,th,de,ru 360,375
```
