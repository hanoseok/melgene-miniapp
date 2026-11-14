# apps/award — 상장 만들기 (만들기)

디자인 4(클래식 금테·귀여운 파스텔·심플·레트로 리본) + 상 이름(24자, 언어별 예시 칩 4개) + 받는 사람(20자) + 수상 이유(140자, 🎲 언어별 랜덤 문구 12개) + 날짜(기본 오늘, 받는 사람 언어 모양 — Intl) + 주는 사람·단체(24자) + 도장 3(없음 · 주는 사람 첫 글자를 새긴 빨간 도장 · 금메달) → canvas 로 그린 상장(1240×1754 = A4 비율, 외부 그림 없음 — 도형·글자만) + PNG 저장(휴대폰은 공유 시트) + `#d=` 공유 링크. 받은 사람은 "상장 수여식" 화면(두루마리를 누르면 펼쳐짐, 움직임 줄이기면 바로 열림) → 같은 상장 + "나도 만들기"(이때 start/done 은 세지 않음). 적은 글은 서버로 보내지 않는다(링크 안 + 쓰는 동안 localStorage `award_draft`). 사용자 글은 textContent·canvas 로만 그린다(innerHTML 없음).

상장 머리글(상 장 / 表彰状 / 奖 状 / Certificate of Award …)·"수상자" 줄·맺음말(이에 이 상장을 드립니다 / よってここに… / 特发此状，以资鼓励。…)은 받는 사람 언어로 그려진다(`card.*`).

주소: 원본은 자리표시자 `https://award.example.com/`, 배포 때 `https://melgene.com/award/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🏆·카테고리 create·등록일 2026-11-15·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `award-core.js` | 디자인 색·도장 종류·글 정리(cleanText)·날짜(validDate·today·formatDate)·`#d=` 인코딩(UTF-8 base64url `{"v":1,"t","s","d","ti","to","m","is"}`, 빈 글 칸 생략, 1800자 한도, 디코딩 때 형식 검사·정리·자르기)·줄바꿈 `wrap`(Intl.Segmenter)·도장 글자 `sealChar` (UMD) |
| `award.js` | 시작(티징) → 편집기(실시간 canvas 미리보기) → 끝 화면(상장·이미지 저장·고치기·공통 끝 화면). 받은 링크는 수여식 화면. 테두리·리본 띠·빨간 도장(인주 빈 곳)·금메달은 canvas 도형 |
| `style.css` | 스타일 (시상식 남색 + 금빛. 상장 글꼴은 언어 파일 fonts.serif — Playfair Display / 나눔명조 / Shippori Mincho / Noto Serif SC / Trirong) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일). `card.*` 는 상장 그림에 들어가는 문구, `editor.titleExamples`·`editor.reasons` 는 그 언어로 직접 쓴 예시 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 |
| `tools/gen-og.js` | OG 이미지 (Chrome headless) |
| `tools/check-award.js` | 로직(#d= 왕복·조작 링크 거부·정리)·언어 파일·생성 HTML(시작 화면 티징·mg-ad-start 맨 끝)·JS 안전·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :9491 + mock-supa :9492, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js
node tools/check-all.js award

# 이 폴더(apps/award)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-award.js
node tools/flow-test.js            # 기본 en,ja,ru × 360,375,1440 (캡처: 세 번째 인자로 폴더)
```
