# apps/life — 내 인생 애니메이션 (만들기)

출생 연도 + 장면 → 한 획씩 그려지는 1분 흑백 만화 애니메이션, 영상 저장, `?s=` 짧은 링크.

주소: 원본은 자리표시자 `https://life.example.com/`, 배포 때 `https://miniapp.melgene.com/life/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지·카테고리·등록일·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `life-core.js` | 장면 카탈로그·입력 정규화·공유 인코딩·장면 계획 (UMD) |
| `life-engine.js` | 캔버스 펜 드로잉 렌더러 (UMD) |
| `life.js` | 입력 → 재생 → 끝 화면, 영상 저장 |
| `style.css` | 스타일 |
| `index.html`, `privacy.html`, `<lang>/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-*.js` | 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js              # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js life        # 이 앱 검사만

# 이 폴더(apps/life)에서
node tools/gen-i18n.js
node tools/gen-og.js               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-life.js
```
