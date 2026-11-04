# apps/xmastree — 크리스마스 트리 꾸미기 (만들기)

canvas(1080×1350) 트리에 장식 13종(유리 공 5색·별·종·지팡이 사탕·선물·리본·양말·눈송이·쿠키)을 탭해서 달고 끌어서 옮기기, 지우개·되돌리기(60단계)·모두 지우기·자동 꾸미기(seeded), 트리 모양 4(클래식·눈 덮인·북유럽·핑크) · 배경 4(별밤·아늑한 방·눈밭·빨강) · 꼭대기 4(없음·별·천사·리본) · 눈/전구 토글, 이름(20자)·짧은 메시지(50자, 언어별 문구 추천). 전구는 반짝이고 눈은 내린다(정적 층 + 매 프레임 반짝임·눈, `prefers-reduced-motion` 이면 멈춘 한 장). 이미지 저장(PNG, 휴대폰은 공유 시트) + `#d=` 공유 링크(서버 없음). 받은 사람은 바로 그 트리(반짝임 포함) + "나도 꾸미기"(start/done 안 셈). 기록: 첫 꾸미기 동작에 `track('start')`, 완성에 `track('done')`. 이름·메시지는 서버로 보내지 않는다(링크 안 + 꾸미는 동안 localStorage `xmastree_draft`).

주소: 원본은 자리표시자 `https://xmastree.example.com/`, 배포 때 `https://melgene.com/xmastree/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎄·카테고리 create·등록일 2026-11-05·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `xmastree-core.js` | 모양·배경·꼭대기·장식 목록, 트리 영역(inTree)·전구 위치·눈송이·자동 꾸미기(seeded)·hit, 글 정리, `#d=` 인코딩(UTF-8 base64url `{"v":1,"s","b","t","f","p","m","n"}`, p = 장식마다 5글자 — 종류 a~m + x/2·y/2 base36), 줄바꿈 `wrap` (UMD) |
| `xmastree.js` | 시작(티징) → 꾸미기(canvas 포인터 탭·끌기, 팔레트 아이콘도 같은 그림 함수) → 끝 화면(트리·이미지 저장·계속 꾸미기·공통 끝 화면). 받은 링크는 바로 끝 화면 |
| `style.css` | 스타일 (전나무 초록 + 산타 빨강 + 금빛, 트리 canvas `touch-action: none`) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일). `card.by` 는 그림에 들어가는 문구, `editor.presets` 는 그 언어로 직접 쓴 메시지 예시 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 |
| `tools/gen-og.js` | OG 이미지 (Chrome headless) |
| `tools/check-xmastree.js` | 로직·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :9193 + mock-supa :9194, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js
node tools/check-all.js xmastree

# 이 폴더(apps/xmastree)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-xmastree.js
node tools/flow-test.js            # 기본 en,ko,th,ru × 360,375,1440 (캡처: 세 번째 인자로 폴더)
```
