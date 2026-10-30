# apps/job — 직업 적성 테스트 (심리테스트)

일하는 방식을 묻는 가벼운 일상 질문 11개(보기 4개, 2분: 조별 과제 역할, 갑자기 생긴 하루, 새 기기, 듣고 싶은 칭찬, 꿈의 일터, 문제가 생겼을 때, 추천 영상, 여행 스타일, 마감 하루 전, 동아리에서 맡고 싶은 자리, 10년 뒤 듣고 싶은 말) → 결과 8종 중 하나 = "나의 일 스타일". 재미용(전문 진로·적성 검사 아님 — 결과 페이지 안내 문구, FAQ·가이드에 명시, 공공 진로 서비스·상담 안내). 결과 id: showrunner 무대를 여는 기획자 🎤 · storyteller 마음을 잇는 이야기꾼 📖 · captain 팀을 이끄는 선장 🧭 · caretaker 모두를 챙기는 수호자 🤝 · creator 손끝의 크리에이터 🎨 · inventor 번뜩이는 발명가 💡 · builder 믿고 맡기는 장인 🛠️ · analyst 꼼꼼한 분석가 📊 (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 이름·한 줄·키워드 3개·설명·알아볼 만한 직업 4개(언어마다 그 나라에서 흔한 실제 직업)·강점 3개·빛나는 곳·조심할 점·일 스타일 팁·환상의 동료/정반대 스타일 이름(보여주기만, 링크·hover 없음), 다른 결과 링크 없음).

채점(`job-core.js`): 보기마다 [a 사람+/사물·데이터·아이디어−, b 상상+/체계−, c 앞장+/깊이 몰두−] 점수(모두 ±1), 합 A·B·C.
- 문항 11개(홀수) × 점수 ±1 → 다 답하면 세 축 합이 0 이 될 수 없다 = 동점 규칙 없음 (check 가 전수에서 축 합 0 조합 0건 확인)
- 문항마다 보기 4개 = 부호 묶음 {+++, +−−, −+−, −−+} 또는 {−−−, −++, +−+, ++−} (축마다 +/− 반반, 두 축끼리도 고르게)
- 결과 = 세 축 부호 조합(2×2×2): +++ showrunner · ++− storyteller · +−+ captain · +−− caretaker · −++ creator · −+− inventor · −−+ builder · −−− analyst
- 환상의 동료 = 앞장 축만 다른 짝, 정반대 스타일 = 세 축 모두 반대(check 가 확인)

숫자는 진짜만: "내 답이 기운 쪽" 게이지(사람↔사물·아이디어 · 상상↔체계 · 앞장서기↔깊이 몰두, 점 위치만)는 job.js 가 sessionStorage(`jb_last`)에 남긴 그 사람의 값 — 같은 결과 페이지일 때만 보임, 공유로 온 방문자에겐 숨김. poll `job`, qid `r0`, opt = ORDER 번호(0~7): 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `jb_voted`), 합계 20 이상일 때만 "N% 같은 일 스타일". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^11 = 4,194,304가지, `node tools/check-job.js` 가 매번 계산, 기준 10%~15%)

showrunner 12.88 · storyteller 12.12 · captain 12.12 · caretaker 12.88 · creator 12.12 · inventor 12.88 · builder 12.88 · analyst 12.12 (%) — 축 합 0 인 조합 0건

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(💼·test·2026-10-31·order 2·12개 언어 제목/설명) |
| `job-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·색·동료/라이벌, 문항별 보기 점수, 채점·게이지, poll 인코딩 (UMD) |
| `job.js` / `result.js` | 시작 → 11문항(뒤로 가기) → 답 정리하는 중 → `r/<id>.html` / 결과 페이지(게이지·공유·같은 일 스타일 비율) |
| `style.css` | 크림색 모눈 종이 + 남색 잉크 + 겨자색, 목걸이 사원증 그림, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].w[j]`, `types.<id>.jobs` = 그 나라 실제 직업 4개) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (스포일러 없음, 결과·질문 목록 없음, 재미용·전문 검사 아님, 일 스타일로 직업 알아보는 법) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 그림(모눈 카드 위 사원증)·페이지·OG 생성 |
| `tools/check-job.js` | 전수 분포·동점 없음·문항 균형·극단 답·결정성, poll id, 언어 파일·스포일러(가이드 포함)·폭(버튼·배지·직업 줄)·가짜 통계 금지, 생성 HTML(직업 4·강점 3, 동료/라이벌 링크 없음, 다른 결과 링크 0), OG |
| `tools/flow-test.js` | Chrome headless 실제 흐름(시작→11문항→결과→끝 화면→다시 하기·공유 방문자), mock-supa — check-all 에는 안 들어감 |

## 생성 · 검사

```bash
cd apps/job
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js job && MG_I18N_MODE=variant node tools/gen-guides.js job)
node tools/gen-og.js all
node tools/check-job.js
node tools/flow-test.js en,ko,th 360,375,1440   # 느림
```
