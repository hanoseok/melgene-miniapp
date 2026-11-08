# apps/snowman — 눈사람 만들기 (만들기)

canvas(1080×1350)에 코드로 그린 눈사람을 단계 9개(몸·얼굴·코·모자·목도리·팔·꾸미기·배경·이름)로 탭해서 고른다. 몸 4(클래식 3단·두 덩이·통통·날씬) · 눈 4(숯·단추·반짝·졸린) · 입 4 · 코 4(당근·긴 당근·열매·솔방울) · 모자 6(실크햇·비니·산타·양동이·귀마개·없음) · 목도리 색 6(없음 포함) × 무늬 3 · 팔 4(나뭇가지·벙어리장갑·손 흔들기·없음) · 꾸미기 4 겹쳐 고르기(빗자루·단추·작은 새·반짝이) · 배경 3(눈 오는 밤·햇살 들판·마을 불빛), 무작위(이름 유지), 이름(20자, 언어별 이름 추천 5). 미리보기에 눈이 내린다(정적 층 + 매 프레임 눈·반짝이, `prefers-reduced-motion` 이면 멈춘 한 장). 선택지 아이콘도 같은 그림 함수로 그린다(외부 이미지·이모지 그림 없음, 저작권 캐릭터 없음). 완성 → 눈덩이가 아래부터 쌓이는 애니메이션 + 이미지 저장(PNG, 휴대폰은 공유 시트) + `#d=` 공유 링크(서버 없음). 받은 사람은 눈에 덮인 그림 → "눈 털기"로 공개 → "나도 만들기". 기록: 시작 버튼에 `track('start')`, 완성(끝 화면)에 `track('done')`(받은 링크를 보기만 하면 둘 다 안 셈). 이름은 서버로 보내지 않는다(링크 안 + 만드는 동안 localStorage `snowman_draft`).

주소: 원본은 자리표시자 `https://snowman.example.com/`, 배포 때 `https://melgene.com/snowman/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 ⛄·카테고리 create·등록일 2026-11-09·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `snowman-core.js` | 선택지 목록·단계, 눈덩이 배치(layout), 무작위(seeded), 눈송이, 글 정리, `#d=` 인코딩(UTF-8 base64url `{"v":1,"b","e","m","n","h","s","p","a","x","g","t"}`), `fit` (UMD) |
| `snowman.js` | 시작(티징) → 만들기(단계 탭·선택지·이전/다음·무작위·이름, canvas 미리보기) → 끝 화면(눈사람·쌓이는 애니메이션·이미지 저장·계속 만들기·공통 끝 화면). 받은 링크는 눈 덮개 + 눈 털기 |
| `style.css` | 스타일 (겨울밤 남색 + 눈 흰색 + 목도리 빨강) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일). `card.named` 은 그림에 들어가는 문구, `editor.namePresets` 는 그 언어로 직접 지은 이름 예시 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, CSS 도형 눈사람) |
| `tools/check-snowman.js` | 로직·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :9213 + mock-supa :9214, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js
node tools/check-all.js snowman

# 이 폴더(apps/snowman)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-snowman.js
node tools/flow-test.js            # 기본 en,ko,th,ru × 360,375,1440 (캡처: 세 번째 인자로 폴더)
```
