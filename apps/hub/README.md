# apps/hub — 포털 (Melgene Apps 메인)

오늘의 미니앱 캐러셀 → 모든 미니앱(카테고리 칩·검색·인기순) → 광고 → 자주 묻는 질문. 앱 목록은 `shared/site.config.js` 의 SITES(= 각 `apps/<id>/app.config.js` 에서 생성)를 읽는다. 주소: https://miniapp.melgene.com/ (melgene.com 에도 같은 포털).

주소: 원본은 자리표시자 `https://example.com/`, 배포 때 `https://miniapp.melgene.com/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `hub-core.js` | 정렬·NEW·숫자 표기 등 언어 무관 로직 (UMD, 검사와 공용) |
| `script.js` | 포털 화면 동작 |
| `style.css` | 포털 스타일 |
| `index.html`, `privacy.html`, `<lang>/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(11개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (11개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-*.js` | 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js              # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js hub         # 이 앱 검사만

# 이 폴더(apps/hub)에서
node tools/gen-i18n.js
node tools/gen-og.js               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-hub.js --layout   # 구조·SEO·스포일러 + 11개 언어 360/375 실측
```

큐레이션 문구: `tools/i18n/<lang>.js` 의 `curation.items`. 규칙: `.claude/skills/melgene-miniapp/references/portal.md`. 이 폴더에는 app.config.js 가 없다(포털은 앱 목록에 들어가지 않음).
