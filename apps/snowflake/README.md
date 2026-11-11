# apps/snowflake — 눈꽃 만들기 / Snowflake Maker (만들기)

가지 한 개를 시드(무작위)로 만든 뒤 60도씩 여섯 번 돌리고 좌우로 뒤집어 대칭 눈 결정을 채운다. 슬라이더 3개(한쪽 가지 수·복잡도·가지 길이), 가지 모양 4(가는 선·육각 판·가시·깃털)와 색 5를 버튼으로 바꾼다. 완성 → PNG 저장(1080×1080, 서버 전송 없음) · `#d=` 공유 링크(설정·시드만 담음) · 받은 사람은 같은 눈꽃을 보고 "나도 만들기". 기록: 시작 버튼에 `track('start')`, 끝 화면 도달 또는 저장 완료에 `track('done')`(받은 링크는 세지 않음).

주소: 원본은 자리표시자 `https://snowflake.example.com/`, 배포 때 `https://melgene.com/snowflake/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(❄️·카테고리 create·등록일 2026-11-11·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `snowflake-core.js` | 파라미터·범위, 시드 무작위(crypto), 가지 도형 목록, 배경 반짝이, `#d=` 인코딩/디코딩 (UMD) |
| `snowflake.js` | 시작 → 만들기(canvas·슬라이더·도구) → 끝 화면, 피어나는 애니메이션(움직임 줄이기면 생략), PNG 저장, 공유 |
| `style.css` | 스타일 (깊은 겨울 파랑 + 얼음 하늘색) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 (12개 언어) |
| `tools/gen-i18n.js`, `tools/gen-og.js`, `tools/check-snowflake.js` | 페이지 생성 · OG 생성 · 검사 |

## 생성·검사

```sh
cd apps/snowflake && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
cd apps/snowflake && node ../../tools/gen-guides.js snowflake && MG_I18N_MODE=variant node ../../tools/gen-guides.js snowflake
cd apps/snowflake && node tools/gen-og.js          # 또는 node tools/gen-og.js all
cd apps/snowflake && node tools/check-snowflake.js && node ../../tools/check-guides.js snowflake
```
