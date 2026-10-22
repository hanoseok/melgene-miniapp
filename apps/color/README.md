# apps/color — 퍼스널 컬러 테스트 (심리테스트)

거울 앞에서 스스로 확인할 수 있는 단서 12문항(보기 3~4개, 2분: 손목 혈관 색, 햇볕 반응, 금·은, 새하얀 vs 아이보리, 블랙 vs 브라운, 타고난 머리·눈 색, 대비, 칭찬받는 옷 색, 입술·볼 색, 블러셔, 분위기) → 결과 8종 중 하나. 재미용 자가진단, **전문 드레이핑 진단 아님**(결과 페이지 안내 문구, FAQ·가이드에도 명시). 결과 id: springlight 봄 라이트 🌷 · springbright 봄 브라이트 🌻 · summerlight 여름 라이트 🫧 · summermute 여름 뮤트 🌫️ · autumnmute 가을 뮤트 🍂 · autumndeep 가을 딥 🌰 · winterbright 겨울 브라이트 💎 · winterdeep 겨울 딥 🖤 (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 이름·설명·키워드 3개·베스트 컬러 칩 8개·피하면 좋은 색 칩 4개·메이크업/헤어/주얼리 팁, 다른 결과 링크·이름 없음).

채점(`color-core.js`): 보기마다 [t 웜+/쿨−, v 라이트+/딥−, c 브라이트+/뮤트−] 점수(−2~2), 합 T·V·C.
- 온도: T > 0 웜, T < 0 쿨, T = 0 이면 1번(혈관)·4번(흰색/아이보리) 답의 온도 → 그래도 0 이면 C ≤ 0 → 웜
- |V| 와 |C| 중 큰 쪽이 하위 유형: 웜 = V+ 봄 라이트 · C+ 봄 브라이트 · C− 가을 뮤트 · V− 가을 딥 / 쿨 = V+ 여름 라이트 · C− 여름 뮤트 · C+ 겨울 브라이트 · V− 겨울 딥 (|V| = |C| 이면 같은 부호: 웜은 C·쿨은 V, 반대 부호: 웜은 V·쿨은 C)
- 같은 답이면 같은 결과. 색 칩 hex 는 `TYPES[id].best`(8)·`avoid`(4) — 화면에 그대로 칩으로 그림(문구 파일에는 색 없음).

숫자는 진짜만: "내 답이 기운 쪽" 게이지(웜↔쿨·라이트↔딥·브라이트↔뮤트, 점 위치만, 숫자 없음)는 color.js 가 sessionStorage(`pc_last`)에 남긴 그 사람의 값 — 같은 결과 페이지일 때만 보임, 공유로 온 방문자에겐 숨김. poll `color`, qid `r0`, opt = ORDER 번호(0~7): 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `pc_voted_v1`), 합계 20 이상일 때만 "N% 같은 팔레트". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 3·4·4·3·4^8 = 9,437,184가지, `node tools/check-color.js` 가 매번 계산, 기준 5%~25%)

springlight 12.65 · springbright 9.84 · summerlight 12.73 · summermute 10.92 · autumnmute 15.16 · autumndeep 12.63 · winterbright 14.33 · winterdeep 11.74 (%)

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎨·test·2026-10-23·order 2·12개 언어 제목/설명) |
| `color-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호)·대표색·베스트/피할 색 hex, 문항별 보기 점수, 채점·게이지, poll 인코딩 (UMD) |
| `color.js` / `result.js` | 시작 → 12문항(뒤로 가기) → 팔레트 섞는 중 → `r/<id>.html` / 결과 페이지(게이지·공유·같은 팔레트 비율) |
| `style.css` | 도자기빛 흰 바탕 + 따뜻한/시원한 빛, 컬러 부채 그림, 색 칩, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].w[j]`) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (스포일러 없음, 결과·계절 이름 목록 없음) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 그림(컬러 부채)·페이지·OG 생성 |
| `tools/check-color.js` | 전수 분포·축 평균·극단 답·결정성, 언어 파일·스포일러·폭·가짜 통계 금지, 생성 HTML(색 칩 = core), OG |
| `tools/flow-test.js` | Chrome headless 실제 흐름(시작→12문항→결과→끝 화면→다시 하기·공유 방문자), mock-supa — check-all 에는 안 들어감 |

## 생성 · 검사

```bash
cd apps/color
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js color && MG_I18N_MODE=variant node tools/gen-guides.js color)
node tools/gen-og.js all
node tools/check-color.js
node tools/flow-test.js en,ko 360,375,1440   # 느림
```
