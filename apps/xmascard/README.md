# apps/xmascard — 크리스마스 카드 (만들기)

디자인 6(클래식·눈 오는 밤·골드·귀여움·미니멀·겨울 숲) + 인사말 4(메리 크리스마스·연말·새해·시즌 인사, ru 는 「С Новым годом!」가 기본) + 장식 토글 3(눈·전구·반짝이) + 받는 사람(20자)·보내는 사람(20자)·메시지(120자, 언어별 문구 추천 5개) → canvas 로 그린 카드(1080×1350, 외부 그림 없음 — 도형·이모지) + 이미지 저장(PNG, 휴대폰은 공유 시트) + 텍스트 복사 + `#d=` 공유 링크. 받은 사람은 봉투 열기 화면(움직임 줄이기면 바로 열림) → 같은 카드 + "나도 만들기"(이때 start/done 은 세지 않음). 메시지는 서버로 보내지 않는다(링크 안 + 쓰는 동안 localStorage `xmascard_draft`).

주소: 원본은 자리표시자 `https://xmascard.example.com/`, 배포 때 `https://melgene.com/xmascard/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎄·카테고리 create·등록일 2026-11-01·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `xmascard-core.js` | 테마(색·이모지·배경 그림 종류·장식 위치)·인사말·장식 비트·글 정리·`#d=` 인코딩(UTF-8 base64url `{"v":1,"t","g","o","to","fr","m"}`, 빈 글 칸 생략, 디코딩 때 검증·자르기)·줄바꿈 `wrap`(Intl.Segmenter 단어 단위)·눈송이 위치(seeded) (UMD) |
| `xmascard.js` | 시작(티징) → 편집기(테마·인사말·장식·이름·메시지 + 실시간 canvas 미리보기) → 끝 화면(카드·이미지 저장·텍스트 복사·고치기·공통 끝 화면). 받은 링크는 봉투 화면 |
| `style.css` | 스타일 (전나무 초록 + 산타 빨강 + 금빛. 제목·인사말 글꼴은 언어 파일 fonts) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일). `card.*` 는 카드 그림에 들어가는 문구, `editor.presets` 는 그 언어로 직접 쓴 메시지 예시 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 |
| `tools/gen-og.js` | OG 이미지 (Chrome headless) |
| `tools/check-xmascard.js` | 로직·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :9191 + mock-supa :9192, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js
node tools/check-all.js xmascard

# 이 폴더(apps/xmascard)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-xmascard.js
node tools/flow-test.js            # 기본 en,ko,th,ru × 360,375,1440 (캡처: 세 번째 인자로 폴더)
```
