# apps/xmastype — 크리스마스 성격 테스트 (심리테스트)

연말 일상 질문 12개(보기 4개, 2분: 연말 파티 초대, 장식 꺼내는 때, 선물 고르기, 첫눈, 연말 저녁 메뉴, 12월의 빈 오후, 카페 캐럴, 12월 달력, 연말에 제일 좋은 것, 크리스마스 스웨터 날, 보드게임 밤, 새해 소원) → 결과 8종 중 하나 = "나를 닮은 크리스마스 캐릭터". 재미용(심리 검사·진단 아님 — 결과 페이지 안내, FAQ·가이드에 명시). 결과 id: star 트리 꼭대기 별 ⭐ · reindeer 듬직한 순록 🦌 · bell 징글벨 🔔 · candy 지팡이 사탕 🍬 · candle 포근한 촛불 🕯️ · cookie 진저브레드 쿠키 🍪 · snowman 말랑한 눈사람 ⛄ · snowflake 꿈꾸는 눈송이 ❄️ (언어별 이름은 `tools/i18n/<lang>.js`, 저작권 캐릭터 없음). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 그림·이름·한 줄·키워드 3개·설명·특징 4개·나다운 크리스마스 + 찰떡궁합·티격태격 라이벌(그림·이름만 보여주기, 링크·hover 없음), 다른 결과 링크 없음).

채점(`xmastype-core.js`): 8종 = 두 갈래 축 3개(2×2×2).
- 축: energy(sparkle 0 / cozy 1) · style(classic 0 / playful 1) · focus(heart 0 / spark 1). 문항 i 의 축 = i % 3 (축마다 4문항)
- 문항마다 보기 4개 = 축의 두 값 각각 강한 보기(2점) + 약한 보기(1점) → 두 값을 바꿔도 대칭
- 축마다 점수가 큰 값, 동점이면 그 축에서 마지막으로 고른 값(결정적·대칭)
- 찰떡궁합 = energy 만 반대, 라이벌 = 세 축 모두 반대(서로 짝)

숫자는 진짜만: poll `xmastype`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `xt_voted`), 합계 20 이상일 때만 "N% 같은 결과". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-xmastype.js` 가 매번 계산, 기준 10%~15%)

8종 모두 정확히 12.50% (축마다 50.00% / 50.00% — 대칭 설계라 치우침 없음). 무작위 30만 회도 12.4~12.6%.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎄·test·2026-11-06·order 2·12개 언어 제목/설명) |
| `xmastype-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·축 값·색·찰떡궁합/라이벌, 문항별 보기 값·점수, 채점·동점 규칙, poll 인코딩 (UMD) |
| `xmastype.js` / `result.js` | 시작 → 12문항(뒤로 가기) → 포장 푸는 중 → `r/<id>.html` / 결과 페이지(공유·다시 하기·같은 결과 비율) |
| `style.css` | 크림색 눈송이 점무늬 + 전나무 초록 잉크 + 베리 빨강·금색, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].c[j]`, `types.<id>.word` = 스포일러 검사용 낱말). privacy 는 다른 앱 문구를 앱 이름·날짜만 바꿔 넣은 것 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (원리·겨울 상징의 의미·세계의 연말·팁·친구와 놀기·재미용, 결과 이름·낱말·질문 없음) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 캐릭터 SVG·페이지·OG 생성 |
| `tools/check-xmastype.js` | 전수·무작위 분포·대칭·짝 규칙·poll, 언어 파일·스포일러(가이드 포함)·폭·가짜 통계 금지, 생성 HTML(짝 카드 링크 없음, 다른 결과 링크 0), OG |
| `tools/check-flow.js` | Chrome headless 실제 흐름(정적 서버 + mock-supa): 모든 문항·모든 결과 페이지 가로 넘침·단어 잘림, 끝 화면 순서, track done 1회, 콘솔 오류 0 |

## 생성 · 검사

```bash
cd apps/xmastype
rm -rf _l && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js xmastype && MG_I18N_MODE=variant node tools/gen-guides.js xmastype)
node tools/gen-og.js all
node tools/check-xmastype.js
node tools/check-flow.js en,ko,th,de,ru 360,375
```
