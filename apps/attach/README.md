# apps/attach — 애착 유형 테스트 (심리테스트)

친구·가족·연인과의 일상 상황을 묻는 질문 11개(보기 4개, 2분: 답장 없는 하루, 막 가까워진 사람의 고백, 힘든 한 주, 갑자기 취소된 약속, 새 친구에게 내 이야기, 의견 충돌, 일주일 떨어져 있을 때 연락, 뜻밖의 친절, 가까운 사람들을 떠올리면, 무리에 들어온 새 사람, "요즘 괜찮아?") → 결과 4종 중 하나 = "나의 애착 유형". 재미·자기 성찰용(심리 검사·진단 아님 — 결과 페이지 안내 문구, FAQ·가이드에 명시, 힘들면 상담 권유). 결과 id: secure 안정형 🌳 · anxious 불안형 💌 · avoidant 회피형(거부-회피) 🐈 · fearful 혼란형(공포-회피) 🦔 (언어별 이름·별명은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 이름·별명·한 줄·키워드 3개·설명·강점 3개·관계 팁 3개·편안한 짝(이름·이모지·한 줄 — 보여주기만, 링크·hover 없음), 다른 결과 링크 없음). 낙인 없는 말투(불안정 유형도 "한때 나를 지켜 준 방식", 강점, 바뀔 수 있음).

채점(`attach-core.js`): 성인 애착 2차원 모형(불안 · 회피). 보기마다 [불안 ±1, 회피 ±1], 합 A·B.
- 문항 11개(홀수) × 점수 ±1 → 다 답하면 두 축 합이 0 이 될 수 없다 = 동점 규칙 없음
- 문항마다 보기 4개 = 네 부호 조합 {−−, +−, −+, ++} 하나씩(자리는 문항마다 섞음, 한 자리에 같은 조합 최대 4번) → 축마다 +/− 반반, 두 축 독립
- 결과 = 두 축 부호: −− secure · +− anxious · −+ avoidant · ++ fearful
- 편안한 짝(match) = 모두 secure(안정형 짝이 관계를 편안하게 해 준다는 연구가 많음 — 문구는 "차분하고 한결같은 사람"처럼 이름 없이)

숫자는 진짜만: "내 답이 기운 쪽" 게이지(편안함↔걱정 · 다가감↔거리, 점 위치만)는 attach.js 가 sessionStorage(`at_last`)에 남긴 그 사람의 값 — 같은 결과 페이지일 때만 보임, 공유로 온 방문자에겐 숨김. poll `attach`, qid `r0`, opt = ORDER 번호(0~3): 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `at_voted`), 합계 20 이상일 때만 "N% 같은 유형". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^11 = 4,194,304가지, `node tools/check-attach.js` 가 매번 계산, 기준 20%~30%)

secure 25.00 · anxious 25.00 · avoidant 25.00 · fearful 25.00 (%) — 축 합 0 인 조합 0건

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🫂·test·2026-11-02·order 2·12개 언어 제목/설명) |
| `attach-core.js` | 결과 4종(**ORDER 바꾸지 않음** — poll 번호)·색·짝, 문항별 보기 점수, 채점·게이지, poll 인코딩 (UMD) |
| `attach.js` / `result.js` | 시작 → 11문항(뒤로 가기) → 답 정리하는 중 → `r/<id>.html` / 결과 페이지(게이지·공유·같은 유형 비율) |
| `style.css` | 복숭아빛 점무늬 종이 + 자두색 잉크 + 산호색, 다가가는 두 동그라미 그림, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].w[j]`, `types.<id>.word` = 스포일러 검사용 검색 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (Bowlby·Ainsworth·Hazan & Shaver·Bartholomew·2차원 모형, 유형 이름·질문 없음, 재미용·진단 아님) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 그림·페이지·OG 생성 |
| `tools/check-attach.js` | 전수 분포·동점 없음·문항 균형·극단 답·결정성, poll id, 언어 파일·스포일러(가이드 포함)·폭·가짜 통계 금지·결과 문구에 다른 결과 이름 없음, 생성 HTML(강점 3·팁 3, 짝 링크 없음, 다른 결과 링크 0), OG |
| `tools/flow-test.js` | Chrome headless 실제 흐름(시작→11문항→결과→끝 화면→다시 하기·공유 방문자), mock-supa — check-all 에는 안 들어감 |

## 생성 · 검사

```bash
cd apps/attach
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js attach && MG_I18N_MODE=variant node tools/gen-guides.js attach)
node tools/gen-og.js all
node tools/check-attach.js
node tools/flow-test.js en,ko,th,ru 360,375,1440   # 느림
```
