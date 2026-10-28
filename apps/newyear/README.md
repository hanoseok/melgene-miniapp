# apps/newyear — 새해 운세 테스트 (심리테스트)

새해를 어떻게 보내고 싶은지 묻는 가벼운 질문 11개(보기 4개, 2분: 12월 31일 밤, 새 다이어리, 첫 해돋이, 새해 다짐, 새 프로젝트, 뜻밖의 용돈, 빈 주말, 신년 모임, 지쳤을 때 충전, 뜻밖의 기회, 1년 뒤 뿌듯할 일) → 결과 8종 중 하나 = "올해의 키워드". 재미용(건강·의료·재테크 조언 없음, 단정적 예언 없음 — 결과 페이지 안내 문구, FAQ·가이드에도 명시). 결과 id: voyage 출항의 해 ⛵ · festival 축제의 해 🎉 · summit 정상의 해 🏔️ · adventure 모험의 해 🧭 · nest 둥지의 해 🏡 · bond 인연의 해 🍵 · seed 씨앗의 해 🌱 · pause 쉼표의 해 🌙 (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 이름·한 줄·키워드 3개·행운의 색/달/물건·설명·네 영역 운세(일·공부 / 금전 기분 / 인연·사랑 / 나를 돌보기)·작은 다짐·잘 맞는/정반대 키워드 이름(보여주기만, 링크·hover 없음), 다른 결과 링크 없음).

**연도는 `newyear-core.js` 의 `YEAR` 한 곳**(지금 2027). 언어 파일·가이드·app.config.js 가 모두 `require` 로 이 값을 쓴다(th 는 불기 `YEAR + 543`). poll id 도 `newyear-<YEAR>`, 한 번만 투표 표시도 `ny_voted_<YEAR>` 라서 해마다 따로 센다. 해가 바뀌면:
1. `YEAR` 를 바꾼다.
2. 가이드의 띠 이야기 한 문장을 고친다 — `tools/guide/ko.js`(정미년·붉은 양), `ja.js`(未年), `zh.js`(羊年·丁未年), `vi.js`(Đinh Mùi).
3. `node tools/gen-all.js --og` (또는 `node tools/gen-og.js all`) → `node tools/check-all.js newyear`.

채점(`newyear-core.js`): 보기마다 [a 새로움+/안정−, b 함께+/나만의 시간−, c 계획+/흐름−] 점수(모두 ±1), 합 A·B·C.
- 문항 11개(홀수) × 점수 ±1 → 다 답하면 세 축 합이 0 이 될 수 없다 = 동점 규칙 없음 (check 가 전수에서 축 합 0 조합 0건 확인)
- 문항마다 보기 4개 = 부호 묶음 {+++, +−−, −+−, −−+} 또는 {−−−, −++, +−+, ++−} (축마다 +/− 반반, 두 축끼리도 고르게)
- 결과 = 세 축 부호 조합(2×2×2): +++ voyage · ++− festival · +−+ summit · +−− adventure · −++ nest · −+− bond · −−+ seed · −−− pause
- 행운의 색(`TYPES[id].lucky` 견본, 이름은 언어 파일 `types.<id>.color`)·달(`month`, 이름은 `months`)·물건(`item` 이모지, 이름은 `types.<id>.item`)은 결과의 재미 설정값 — 예측·통계 아님. 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

숫자는 진짜만: "내 답이 기운 쪽" 게이지(새로움↔안정·함께↔나만의 시간·계획↔흐름, 점 위치만)는 newyear.js 가 sessionStorage(`ny_last`)에 남긴 그 사람의 값 — 같은 결과 페이지일 때만 보임, 공유로 온 방문자에겐 숨김. poll `newyear-2027`, qid `r0`, opt = ORDER 번호(0~7): 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `ny_voted_2027`), 합계 20 이상일 때만 "N% 같은 키워드".

## 결과 분포 (전수 4^11 = 4,194,304가지, `node tools/check-newyear.js` 가 매번 계산, 기준 10%~15%)

voyage 12.88 · festival 12.12 · summit 12.12 · adventure 12.88 · nest 12.12 · bond 12.88 · seed 12.88 · pause 12.12 (%) — 축 합 0 인 조합 0건

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🌅·test·2026-10-29·order 2·12개 언어 제목/설명, 연도는 core) |
| `newyear-core.js` | YEAR, 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·색·행운의 색/달/물건·단짝/라이벌, 문항별 보기 점수, 채점·게이지, poll 인코딩 (UMD) |
| `newyear.js` / `result.js` | 시작 → 11문항(뒤로 가기) → 해돋이 기다리는 중 → `r/<id>.html` / 결과 페이지(게이지·공유·같은 키워드 비율) |
| `style.css` | 새벽 하늘(남색 → 자줏빛 → 노을)·금빛 해돋이·작은 불꽃, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].w[j]`) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (스포일러 없음, 결과·질문 목록 없음, 재미용, 결과로 새해 목표 세우기·세계의 새해 풍습) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 그림(지평선 위 해돋이 카드)·페이지·OG 생성 |
| `tools/check-newyear.js` | 전수 분포·동점 없음·문항 균형·극단 답·결정성, YEAR·poll id, 언어 파일·연도 하드코딩·스포일러(가이드 포함)·폭·가짜 통계 금지, 생성 HTML(행운 값 = core, 단짝/라이벌 링크 없음, 다른 결과 링크 0), OG |
| `tools/flow-test.js` | Chrome headless 실제 흐름(시작→11문항→결과→끝 화면→다시 하기·공유 방문자), mock-supa — check-all 에는 안 들어감 |

## 생성 · 검사

```bash
cd apps/newyear
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js newyear && MG_I18N_MODE=variant node tools/gen-guides.js newyear)
node tools/gen-og.js all
node tools/check-newyear.js
node tools/flow-test.js en,ko,ja 360,1440   # 느림
```
