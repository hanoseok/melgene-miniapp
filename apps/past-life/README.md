# apps/past-life — 나의 전생 테스트 (심리테스트)

12문항 → 결과 16종. 결과마다 공유 페이지 `r/<id>.html`.

주소: 원본은 자리표시자 `https://past-life.example.com/`, 배포 때 `https://miniapp.melgene.com/past-life/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지·카테고리·등록일·11개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `data.js` | 문항·결과 점수 데이터 |
| `quiz.js` | 시작(티징) + 12문항 + 로딩 |
| `result.js` | 결과 페이지 동작 |
| `r/` | 결과 페이지 (생성물) |
| `style.css` | 스타일 |
| `index.html`, `privacy.html`, `<lang>/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(11개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (11개 언어, 키 구조 동일) |
| `tools/gen-results.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-*.js` | 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js              # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js past-life   # 이 앱 검사만

# 이 폴더(apps/past-life)에서
node tools/gen-results.js
node tools/gen-og.js               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-reach.js   # 결과 도달 분포 + 결과 페이지 링크(스포일러) 검사
```
