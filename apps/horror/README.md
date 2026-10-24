# apps/horror — 공포영화 생존 테스트 (심리테스트)

할로윈 시즌 공포영화 단골 상황 11문항(보기 4개, 2분: 폐가 내기, 한밤중 숨소리 전화, 숲속 오두막, 혼자 울리는 오르골, 경고 적힌 일기장, 새벽 노크, 늦게 깜빡이는 거울, 정전, "흩어져서 찾아보자", 점쟁이 경고, 움직이는 인형) → 결과 8종 중 하나. 재미용, PG(피·무기·괴물·깜짝 놀래키기 없음 — 결과 페이지 안내 문구, FAQ·가이드에도 명시). 결과 id: leader 용감한 리더 🔦 · skeptic 현실파 회의론자 🧐 · comic 분위기 메이커 🤪 · curious 문 열어보는 호기심쟁이 🚪 · strategist 침착한 전략가 🗺️ · researcher 자료 조사 담당 📚 · final 최후의 생존자 🌅 · runner 도망 전문가 🏃 (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 이름·한 줄·키워드 3개·영화 속 생존 시간 막대·강점 3개·대표 장면·생존 팁·단짝/라이벌 이름(보여주기만, 링크·hover 없음), 다른 결과 링크 없음).

채점(`horror-core.js`): 보기마다 [a 용감+/신중−, b 머리+/직감−, c 함께+/혼자−] 점수(모두 ±1), 합 A·B·C.
- 문항 11개(홀수) × 점수 ±1 → 다 답하면 세 축 합이 0 이 될 수 없다 = 동점 규칙 없음
- 문항마다 보기 4개 = 부호 묶음 {+++, +−−, −+−, −−+} 또는 {−−−, −++, +−+, ++−} (축마다 +/− 반반, 두 축끼리도 고르게)
- 결과 = 세 축 부호 조합(2×2×2): +++ leader · ++− skeptic · +−+ comic · +−− curious · −++ strategist · −+− researcher · −−+ final · −−− runner
- 생존 시간(`TYPES[id].minute`, 100분 영화 기준)은 결과의 재미 설정값 — 통계 아님. 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

숫자는 진짜만: "내 답이 기운 쪽" 게이지(용감↔신중·머리↔직감·함께↔혼자, 점 위치만)는 horror.js 가 sessionStorage(`hr_last`)에 남긴 그 사람의 값 — 같은 결과 페이지일 때만 보임, 공유로 온 방문자에겐 숨김. poll `horror`, qid `r0`, opt = ORDER 번호(0~7): 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `hr_voted_v1`), 합계 20 이상일 때만 "N% 같은 캐릭터".

## 결과 분포 (전수 4^11 = 4,194,304가지, `node tools/check-horror.js` 가 매번 계산, 기준 10%~15%)

leader 12.88 · skeptic 12.12 · comic 12.12 · curious 12.88 · strategist 12.12 · researcher 12.88 · final 12.88 · runner 12.12 (%)

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎃·test·2026-10-25·order 2·12개 언어 제목/설명) |
| `horror-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·색·생존 시간·단짝/라이벌, 문항별 보기 점수, 채점·게이지, poll 인코딩 (UMD) |
| `horror.js` / `result.js` | 시작 → 11문항(뒤로 가기) → 대본 넘기는 중 → `r/<id>.html` / 결과 페이지(게이지·공유·같은 캐릭터 비율) |
| `style.css` | 심야 극장(자주빛 밤·벨벳 커튼·안개), 촛불빛 호박색, 영화 포스터 그림, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].w[j]`) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (스포일러 없음, 결과·질문 목록 없음, 재미용) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 그림(언덕 위 집·보름달 포스터)·페이지·OG 생성 |
| `tools/check-horror.js` | 전수 분포·동점 없음·문항 균형·극단 답·결정성, 언어 파일·스포일러·폭·가짜 통계 금지, 생성 HTML(생존 막대 = core, 단짝/라이벌 링크 없음), OG |
| `tools/flow-test.js` | Chrome headless 실제 흐름(시작→11문항→결과→끝 화면→다시 하기·공유 방문자), mock-supa — check-all 에는 안 들어감 |

## 생성 · 검사

```bash
cd apps/horror
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js horror && MG_I18N_MODE=variant node tools/gen-guides.js horror)
node tools/gen-og.js all
node tools/check-horror.js
node tools/flow-test.js en,ko,ru 360,1440   # 느림
```
