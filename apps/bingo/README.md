# apps/bingo — 새해 목표 빙고 (만들기)

새해(연말) 목표를 3×3·4×4·5×5 빙고판에 적어 카드 이미지로 저장하고, 이룬 목표에 도장을 찍어 빙고 줄을 세는 도구 앱. 인스타그램·틱톡의 "목표 빙고판" 유행 형식.

- 화면 세 개: **시작**(티징 · 판 크기 3/4/5, 기본 5×5 · 내 빙고판 만들기 · 저장한 판이 있으면 "저장한 빙고판 열기" → 맨 아래 `mg-ad-start`) → **편집**(제목 · 크기 · 가운데 자유칸(홀수 판) · 색 테마 6개 · 칸 그리드 + 칸 입력 하나(16px, iOS 확대 없음)·다음 · 아이디어로 채우기 · 섞기 · 모두 지우기 → 완성) → **완성**(1080×1350 캔버스 카드 · 칸을 눌러 도장/취소 · 빙고 줄 수(Intl.PluralRules 복수형) · 이미지 저장 · 빙고판 링크 복사 · 목표 고치기 → `data-mg-end="bingo"`).
- 로직은 `bingo-core.js`: 빙고 줄(가로·세로·대각선, 자유칸은 늘 찍힘) · 크기 바꾸기(글 순서 유지) · 자유칸 켜기(가운데 글을 빈칸으로 옮김) · 아이디어 채우기(빈칸만, 겹침 없음) · 섞기(자유칸 고정, 도장 지움) · 공유/저장 모양(정리·크기 제한) · 캔버스 줄바꿈(Intl.Segmenter — 한중일·태국어).
- 아이디어: 언어 파일 `ideas` 40개씩(현지 생활에 맞게, 직역 아님). 모두 채워야 완성(빈칸이면 needAll 안내).
- 캔버스 글꼴: 제목 = 화면 제목 글꼴(언어 파일 fonts, zh 는 ZCOOL KuaiLe → PingFang SC 대체), 칸 글 = 본문 글꼴(base.css `:lang` 규칙 그대로 — th·zh·ja 시스템 글꼴), `document.fonts.load` 뒤 다시 그림(1.5초 제한). 띄어쓰기 언어는 낱말이 잘리지 않는 크기까지 줄임.
- 기록: 편집 화면에 처음 들어갈 때 `track('start')` 1번 → 그 판이 완성 카드에 닿을 때 `track('done')` 1번. 이어 하기·받은 링크 보기는 세지 않음. 다시 하기(`setRetry`) = 빈 새 판(크기·색 유지) → 다시 start/done.
- 저장: localStorage `mg_bingo_v1` = `{ b: 판, p: 'edit'|'done' }`(try/catch)만. **빙고판 링크** = `#d=<UTF-8 base64url JSON>`(최대 8000자, 열 때 `sanitize` — 크기·길이 40자·제어 문자·테마·비트마스크), 받은 판은 보기 전용(도장 안 찍힘, 저장 안 함). 서버로 보내는 것 없음. 사용자 글은 textContent·캔버스로만(innerHTML 없음). 공통 끝 화면 공유 = 깨끗한 주소 + 고정 문구(목표 글 없음).

주소: 원본은 자리표시자 `https://bingo.example.com/`, 배포 때 `https://melgene.com/bingo/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎯 · create · 2026-10-30 · order 1 · 12개 언어 제목/설명) |
| `bingo-core.js` | 판 모양·빙고 줄·토글·크기·자유칸·아이디어·섞기·공유/저장·줄바꿈 (UMD) |
| `bingo.js` | 시작·편집·완성 화면 동작, 캔버스 카드, 도장, 이미지 저장, 링크, 저장, 다시 하기 |
| `style.css` | 크림 바탕 + 보라 잉크 + 주황 포인트, 편집 그리드는 테마 색 변수 |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 글 없는 5×5 판 + 도장 + 대각선 줄 + 🎯), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구(12개 언어, 키 구조 동일, `ui.lines` 복수형, `themes`, `ideas` 40개) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(만드는 법 · 칸에 맞는 목표 쓰기 · 빙고가 동기부여에 좋은 이유 · 공유·인쇄 · 연말 회고) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-bingo.js` | 로직(빙고 줄 무작위 3000번 = 직접 센 값 · 크기 · 자유칸 · 아이디어 300번 · 섞기 300번 · 공유 되돌림 500번/거부/정리 · 줄바꿈)·언어 파일·생성 HTML·사이트맵·OG·bingo.js 규칙 |
| `tools/flow-test.js` | 실제 흐름(Chrome headless + 정적 서버 + mock-supa, 포트 9071/9072/9571): 시작·광고·넘침, 편집(빈 판·글 escape·아이디어·섞기·크기·색), 완성(캔버스·도장·빙고 줄·복수형), 끝 화면 순서, 링크(보기 전용·잘못된 링크), 이어 하기, 다시 하기, track 횟수, 서버로 글 안 감, 콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js            # SITES + 모든 앱 HTML + 가이드 + 링크 검사
node tools/check-all.js bingo    # 이 앱 검사(check-bingo) + 가이드 검사

# 이 앱만
(cd apps/bingo && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js)
node tools/gen-guides.js bingo && MG_I18N_MODE=variant node tools/gen-guides.js bingo
node apps/bingo/tools/gen-og.js all
(cd apps/bingo && node tools/check-bingo.js && node tools/flow-test.js)   # 예: node tools/flow-test.js ja,th 375 · SHOT=<폴더>
```
