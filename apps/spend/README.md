# apps/spend — 소비 성향 테스트 (심리테스트)

돈 쓰는 일상 상황 12개(보기 4개, 2분) → 결과 8종 중 하나 + 내 답으로 계산한 스타일 비율 막대(짠테크·가성비·플렉스·충동). 재미용, **재무 조언 아님**(결과 페이지에 안내 문구, FAQ·가이드에도 명시). 결과 id: saver 짠테크 요정 🐷 · value 가성비 탐정 🔍 · flex 플렉스 주인공 💎 · impulse 지름신 강림형 🛒 · saverflex 짠플 반전형 🎁 · dealhunter 세일 헌터 🏷️ · quality 가심비 장인 🧥 · balance 균형 가계부형 ⚖️ (언어별 이름은 `tools/i18n/<lang>.js`). 결과마다 공유 페이지 `r/<id>.html`(그 결과 하나만, 다른 결과 링크·이름 없음, 찰떡 궁합 없음).

채점(`spend-core.js`): 보기마다 습관 축 하나(0 짠테크 · 1 가성비 · 2 플렉스 · 3 충동), 한 문항의 보기 4개가 네 축을 하나씩(라틴 방진으로 위치 균형). 축별 선택 횟수 c 로만 결정(순서 무관, 같은 답이면 같은 결과).
- 제곱합 ≤ 40 이고 (짠테크+가성비) = (플렉스+충동) → 균형 가계부형
- 1위가 2위보다 3개 이상 많으면 → 1위 축의 단일 유형
- 아니면 1·2위 조합: 짠테크+플렉스 = 짠플 반전형, 가성비+충동 = 세일 헌터, 가성비+플렉스 = 가심비 장인, 그 밖은 1위 축 단일 유형 (동률은 가성비 → 플렉스 → 짠테크 → 충동)

숫자는 진짜만: 막대 % 는 spend.js 가 sessionStorage(`sp_last`)에 남긴 그 사람의 값 — 같은 결과 페이지일 때만 보임, 공유로 온 방문자에겐 숨김(정적 HTML 에 숫자 없음). poll `spend`, qid `r0`, opt = ORDER 번호(0~7): 결과 페이지에 처음 닿은 브라우저만 한 번 투표(localStorage `sp_voted_v1`), 합계 20 이상일 때만 "N% 같은 스타일". 결과 문구에는 숫자·% 를 쓰지 않는다(check 가 막음).

## 결과 분포 (전수 4^12 = 16,777,216가지, `node tools/check-spend.js` 가 매번 계산, 기준 10%~17%)

saver 16.33 · value 12.75 · flex 10.23 · impulse 11.96 · saverflex 10.66 · dealhunter 10.46 · quality 13.84 · balance 13.77 (%)

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(💸·test·2026-10-18·order 2·12개 언어 제목/설명) |
| `spend-core.js` | 결과 8종(**ORDER 바꾸지 않음** — poll 번호), 문항별 축 배치, 채점·비율, poll 인코딩 (UMD) |
| `spend.js` / `result.js` | 시작 → 12문항 → 계산 중 → `r/<id>.html` / 결과 페이지(비율 막대·공유·같은 스타일 비율) |
| `style.css` | 민트·금빛 톤, 금화 그림, 결과 페이지는 유형 색(`--c-*`) |
| `index.html` `r/` `privacy.html` `guide.html` `<lang>/` `_l/` `sitemap.xml` `og/` | **생성물** |
| `tools/i18n/<lang>.js` | 모든 문구 (`questions[i].choices[j]` 순서 = `QUESTIONS[i].v[j]`) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 (스포일러 없음) |
| `tools/art.js` `gen-i18n.js` `gen-og.js` | 그림·페이지·OG 생성 |
| `tools/check-spend.js` | 전수 분포·위치 균형·결정성, 언어 파일·스포일러·폭·가짜 통계 금지, 생성 HTML, OG |

## 생성 · 검사

```bash
cd apps/spend
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
(cd ../.. && node tools/gen-guides.js spend && MG_I18N_MODE=variant node tools/gen-guides.js spend)
node tools/gen-og.js all
node tools/check-spend.js
```
