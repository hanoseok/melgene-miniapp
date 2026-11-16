# apps/advent — 어드벤트 캘린더 만들기 (만들기)

받는 사람·보내는 사람(각 20자) + 디자인 4(클래식·눈 내리는·별빛 골드·캔디) + 24칸 메시지(칸마다 80자, 🎲 = 언어별로 직접 쓴 따뜻한 메시지 30개 중 하나, "빈 칸 채우기" 한 번에) → 미리보기(만든 사람만, 모든 문 열림) → `#d=` 공유 링크(UTF-8 base64url JSON, 압축 없음, 끝의 빈 칸은 잘라 냄) + 복사 + 이미지 저장(1080×1350 PNG, 닫힌 문 번호만 — 메시지 없음). 메시지는 서버로 보내지 않는다(링크 안 + 쓰는 동안 localStorage `advent_draft`).

받은 링크는 끝 화면 자리에 캘린더(섞어 보이지만 같은 캘린더면 같은 배치): 받는 사람 기기 날짜가 그해 12월 N일 이상인 문만 열린다. 12월 25일~1월 31일은 모두 열림, 2~11월은 모두 잠김. 잠긴 문은 흔들리며 "N일 뒤 열림"(언어별 복수형, Intl.PluralRules), 열린 문은 3D로 열리고 메시지 창(textContent). 연 문은 localStorage `advent_open_<링크 해시>`. 받은 사람은 start/done 을 세지 않고 "나도 만들기". 움직임 줄이기면 문·창·흔들기 애니메이션 없음.

기록: 편집기에서 처음 입력(이름·메시지·🎲·디자인)할 때 `track('start')`, 링크를 만들 때 `track('done')`.

주소: 원본은 자리표시자 `https://advent.example.com/`, 배포 때 `https://melgene.com/advent/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎄·create·2026-11-17·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `advent-core.js` | 디자인 색·선물 이모지·글 정리(cleanText)·`#d=` 인코딩/디코딩(형식·길이 검사, 11000자 한도)·날짜(`season`·`doorUnlocked`·`daysUntil`·`decDate`)·문 배치(`layout`)·`storeKey`·`plural` (UMD, Node 검사 공용) |
| `advent.js` | 시작(티징) → 편집기 → 미리보기 → 끝 화면(링크·복사·이미지·공통 끝 화면). 받은 링크는 캘린더 + 메시지 창. 검사용 `window.AD_APP.setNow(날짜)` |
| `style.css` | 겨울밤 초록 + 빨강 + 금빛. 디자인별 문 색은 `.ad-cal.th-<id>` 변수 |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어). `ideas` = 그 언어로 직접 쓴 🎲 메시지(화면에 목록으로 보이지 않음), `calendar.before`·`calendar.locked` 는 복수형 객체 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 |
| `tools/gen-og.js` | OG 이미지 (Chrome headless) |
| `tools/check-advent.js` | 로직(날짜·#d= 왕복·조작 링크 거부·배치·복수형)·언어 파일·생성 HTML(티징·광고 위치·끝 화면·랜덤 메시지 노출 없음)·JS 안전·OG 검사 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js
node tools/check-all.js advent

# 이 폴더(apps/advent)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-advent.js
```
