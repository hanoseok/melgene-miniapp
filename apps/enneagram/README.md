# apps/enneagram — 에니어그램 테스트 (심리테스트)

일상 상황 질문 12개(보기 4개, 2분: 낯선 파티, 팀 프로젝트, 큰 결정, 갖고 싶은 것, 기분 나쁜 날, 주말 충전, 안 움직이는 줄, 반대 의견, 듣고 싶은 칭찬, 납득 안 가는 규칙, 친구의 고민, 약속 없는 토요일) → 결과 9종 중 하나 = "나의 에니어그램 유형". 재미·자기 성찰용(RHETI 같은 공식 검사·진단 아님 — 결과 페이지 안내 문구, FAQ·가이드에 명시). 결과 id: type1 개혁가 ⚖️ · type2 조력가 🤲 · type3 성취가 🏆 · type4 예술가 🎨 · type5 탐구가 🔭 · type6 충실가 🛡️ · type7 열정가 🎉 · type8 도전가 🔥 · type9 평화주의자 🕊️ (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만: 번호·이름·한 줄·키워드 3개·바라는 것/피하는 것·설명·강점 3개·성장 팁 3개·성장 방향(통합 화살표 유형의 번호·이모지·이름 — 보여주기만, 링크·hover 없음), 다른 결과 링크 없음).

채점(`enneagram-core.js`): 9유형 = 중심 3(gut 8·9·1 / heart 2·3·4 / head 5·6·7) × 태도 3(호나이 그룹: assertive 3·7·8 / compliant 1·2·6 / withdrawn 4·5·9) 칸 하나씩.
- 문항 12개 = 중심 문항 6 + 태도 문항 6(번갈아), 두 축은 서로 다른 문항 → 무작위 답에서 독립
- 문항마다 보기 4개 = 그 축의 세 값 하나씩(2점) + 그중 한 값의 "약한" 보기(1점). 축마다 두 번 나오는 값이 값마다 2번 → 회전 대칭
- 축마다 점수가 가장 큰 값. 동점: 두 값 → 원을 따라 다음 값(0·1→1, 1·2→2, 2·0→0), 세 값 → 그 축에서 마지막으로 고른 값 (결정적)
- 성장 방향 = 통합 화살표 1→7→5→8→2→4→1, 3→6→9→3

숫자는 진짜만: "내 답이 기운 쪽" 막대(중심 3 · 태도 3, 폭만·숫자 없음)는 enneagram.js 가 sessionStorage(`eg_last`)에 남긴 그 사람의 축별 점수 — 같은 결과 페이지일 때만 보임, 공유로 온 방문자에겐 숨김. poll `enneagram`, qid `r0`, opt = ORDER 번호(0~8): 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `eg_voted`), 합계 20 이상일 때만 "N% 같은 유형". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음, 유형 번호는 `result.typeNum`).

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-enneagram.js` 가 매번 계산, 기준 9%~13%)

1·2·3·8 각 10.98 · 4·6·7·9 각 11.18 · 5 11.38 (%) — 축별 33.13 / 33.13 / 33.74 (세 값 동점을 마지막 답으로 정하는 데서 오는 작은 치우침)

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🔷·test·2026-11-04·order 2·12개 언어 제목/설명) |
| `enneagram-core.js` | 결과 9종(**ORDER 바꾸지 않음** — poll 번호)·중심/태도·색·성장 방향, 문항별 보기 값·점수, 채점·동점 규칙, poll 인코딩 (UMD) |
| `enneagram.js` / `result.js` | 시작 → 12문항(뒤로 가기) → 점 잇는 중 → `r/<id>.html` / 결과 페이지(막대·공유·같은 유형 비율) |
| `style.css` | 연보라 점무늬 종이 + 남색 잉크 + 금색, 천천히 도는 아홉 점 원 그림, 결과 페이지는 결과 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].c[j]`, `types.<id>.word` = 스포일러 검사용 검색 낱말) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (구르지예프·이차소·나란조·리소-허드슨·RHETI, 세 중심·호나이 세 태도, 유형 이름·질문 없음, 재미용·공식 검사 아님) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 그림·페이지·OG 생성 |
| `tools/check-enneagram.js` | 전수·무작위 분포(9%~13%)·동점 규칙·회전 대칭·에니어그램 배치·화살표·보기 자리 쏠림, poll id, 언어 파일·스포일러(가이드 포함)·폭·가짜 통계 금지·RHETI 안내, 생성 HTML(강점 3·팁 3, 성장 카드 링크 없음, 다른 결과 링크 0), OG |

## 생성 · 검사

```bash
cd apps/enneagram
rm -rf _l && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js enneagram && MG_I18N_MODE=variant node tools/gen-guides.js enneagram)
node tools/gen-og.js all
node tools/check-enneagram.js
```
