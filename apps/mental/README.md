# apps/mental — 멘탈 강도 테스트 (심리테스트)

일상 속 작은 위기 12개(보기 4개, 2분: 최악이었던 하루 다음 날, 알람 안 울림, 새 머리에 "특이하네", 약속 당일 취소, 발표 직전 노트북 꺼짐, 빨간 펜 피드백, 공들인 일 실패, 지하철 멈춤, 단톡방 무응답, 게임 대패, 마감 세 개 겹침, 큰 결정에 다들 한마디) → 결과 8종 중 하나 = "내 멘탈을 이루는 재료" + 본인 답으로 계산한 멘탈 점수 0~100.
**정직하게**: 재미용, 임상 검사·심리 검사 아님(결과 페이지 안내·FAQ·가이드에 명시, check 가 en 문구에서 "not a clinical assessment" 확인). 질문·결과 문구에 임상 용어 금지(check). 어느 재료도 나쁘지 않게 — 말랑한 재료도 강점이 있게 쓴다.
결과 id: silk 섬세한 실타래 🧵 · ember 타오르는 불씨 🔥 · pearl 고요한 진주 🦪 · oak 든든한 참나무 🌳 · jelly 말랑 푸딩 🍮 · wave 출렁이는 파도 🌊 · bamboo 휘어지는 대나무 🎋 · diamond 반짝이는 다이아몬드 💎 (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 재료 캐릭터 그림·이름·한 줄·키워드 3·멘탈 게이지·설명·강점 4·팁 2·충전법 + 찰떡 궁합·정반대 유형(그림·이름만 보여주기, 링크·hover 없음), 다른 결과 링크 없음).

채점(`mental-core.js`): 8종 = 두 갈래 축 3개(2×2×2), 각 축의 0 = 말랑한 쪽, 1 = 단단한 쪽.
- 축: bounce 회복력(slow 0 / quick 1) · calm 평정심(stormy 0 / steady 1) · self 자기 확신(absorb 0 / trust 1). 문항 i 의 축 = i % 3 (축마다 4문항)
- 문항마다 보기 4개 = 축의 두 값 각각 강한 보기(2점) + 약한 보기(1점) → 두 값을 바꿔도 대칭
- 축마다 점수가 큰 값, 동점이면 그 축에서 마지막으로 고른 값(결정적·대칭)
- 멘탈 게이지 = 본인 12개 답의 T/(S+T) (강한 단단 0:3 · 약한 단단 1:2 · 약한 말랑 2:1 · 강한 말랑 3:0). 결과 주소 `#s=<0~100>` 으로 넘기고 공유 링크에도 붙는다. 값이 없으면(#s 없는 방문자) 게이지를 숨긴다 — 지어낸 숫자 없음. 구간 문구: ≤42 말랑 · 43~57 균형 · ≥58 단단(무작위 답에서 약 26% / 48% / 26%)
- 찰떡 궁합 = bounce 만 반대, 정반대 유형 = 세 축 모두 반대(서로 짝)

숫자는 진짜만: poll `mental`, qid `r0`, opt = ORDER 번호(0~7). 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `mt_voted`), 합계 20 이상일 때만 "N% 같은 결과". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-mental.js` 가 매번 계산, 기준 8%~18%)

8종 모두 정확히 12.50% (축마다 50.00% / 50.00%). 멘탈 게이지 전수 최소 0 · 최대 100 · 평균 50.00.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🛡️·test·2026-11-14·order 2·12개 언어 제목/설명 — 포털 아이콘용 짧은 이름, 앱 h1·title 은 검색어) |
| `mental-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·축 값·색·짝, 문항별 보기 값·점수, 채점·동점 규칙, 멘탈 게이지·`#s=` 파싱·구간, poll 인코딩 (UMD) |
| `mental.js` / `result.js` | 시작 → 12문항(뒤로 가기) → 분석 중 → `r/<id>.html#s=<n>` / 결과 페이지(멘탈 게이지·공유·다시 하기·같은 결과 비율) |
| `style.css` | 왼쪽 말랑한 분홍 · 오른쪽 단단한 하늘색 "재료 견본" 바탕 + 남색 잉크, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].c[j]`, `types.<id>.word` = 스포일러 검사용 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (하는 법·카우아이 연구(1955)·클러프 4C(2002)·에픽테토스·드웩·네프·친구와 놀기·재미용, 결과 이름·질문 없음) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 재료 캐릭터 SVG(실타래·불씨·진주·참나무·푸딩·파도·대나무·보석, 시작 화면은 눈금 캡슐)·페이지·OG(12개 언어 × 기본 + 8종) 생성 |
| `tools/check-mental.js` | 전수·무작위 분포·대칭·짝 규칙·멘탈 게이지·poll, 언어 파일·스포일러(가이드 포함)·임상 용어 금지·재미용 안내·폭·가짜 통계 금지, 생성 HTML, 사이트맵, OG |
| `tools/check-flow.js` | Chrome headless 실제 흐름(정적 서버 8631 + mock-supa 8632, CDP 9631): 모든 문항·결과 페이지 넘침·단어 잘림, 게이지 = 본인 답, `#s=` 공유 방문자, 끝 화면 순서, track done 1회, 콘솔 오류 0 |

## 생성 · 검사

```bash
cd apps/mental
rm -rf _l && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js mental && MG_I18N_MODE=variant node tools/gen-guides.js mental)
node tools/gen-og.js all
node tools/check-mental.js
node tools/check-flow.js en,ko,th,de,ru 360,375
```
