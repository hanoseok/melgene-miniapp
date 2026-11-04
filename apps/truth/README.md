# apps/truth — 진실 게임 (투표)

휴대폰 하나로 하는 진실 혹은 도전(Truth or Dare) 파티 도구. 송년회·친구 모임·가족 모임용. 시작 화면(이름·팩) → 진행 화면(이번 차례 → 진실/도전/랜덤 → 카드 한 장) → 끝 화면(요약 숫자 + 공통 끝 화면). 모든 카드는 깨끗하게 — 성적인 내용·키스·술·위험한 행동·망신 주기·온라인 게시 없음(check 가 언어별 금지어로 막음).

- 시작 화면 `#screen-setup`: h1(현지 검색어)·훅 → 누가 하나(**이름 넣기** 2~20명 기본 / **이름 없이** 휴대폰 돌리기) → 팩(친구·가족·회사 송년회·커플, 주제·분위기만 설명) → "게임 시작" → 맨 끝 `mg-ad-start` 1자리.
- 진행 화면 `#screen-play`(처음 hidden, 광고 없음): 차례 번호·팩·끝내기 → 이번 차례 이름(이름 없이면 "이번 차례!") → 진실/도전/랜덤 → 카드 한 장(납작해졌다 펴지는 뒤집기, 움직임 줄이기면 바로) → "다른 카드"(같은 종류 새 카드)·"완료 · 다음 사람" → "누구나 넘어갈 수 있어요" 안내.
- 끝 화면 `#screen-end`(처음 hidden): 진행한 차례·진실·도전·바꾼 카드 숫자만 → "참가자·팩 바꾸기" → `data-mg-end="truth"`. 카드 목록을 다시 보여 주지 않는다.
- 공정성: 이름 모드는 바퀴마다 crypto 로 섞은 순서(모두 한 번씩, 새 바퀴 첫 사람이 직전 사람이면 나머지 중 무작위 자리와 바꿈 → 연속 차례 없음). 카드는 팩·종류별 섞은 덱(세션 안 반복 없음, 다 쓰면 다시 섞되 바로 반복 없음). 랜덤 = crypto 반반. 모두 `crypto.getRandomValues` + 거부 샘플링.
- 카드: 언어별 `tools/i18n/<lang>.js` 의 `packs`(4팩 × 진실·도전 각 42장, 그 나라 문화로 새로 씀). **스포일러 금지**: PAGE_I18N 안에만 있고 보이는 HTML·메타·OG·가이드·FAQ·app.config 에 쓰지 않는다(check 가 확인).
- 기록: 게임 시작(첫 차례) `track('start')`, 끝 화면 `track('done')`. 다시 하기(setRetry) = 같은 참가자·팩으로 새 게임. 공유(setShareData) = 깨끗한 앱 주소.
- 저장: 마지막 모드·이름 목록·팩만 localStorage `mg_truth_v1`(try/catch). 서버로 보내지 않는다. 서버 숫자 없음.

주소: 원본은 자리표시자 `https://truth.example.com/`, 배포 때 `https://melgene.com/truth/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎲·카테고리 vote·등록일 2026-11-05·order 2·12개 언어 제목/설명) |
| `truth-core.js` | crypto 거부 샘플링·Fisher–Yates, 이름 정리·검사(validate), 차례 바퀴(newTurns/nextPlayer), 카드 덱(newDeck/nextCard/newDecks), 랜덤(pickType), 요약 숫자 (UMD) |
| `truth.js` | 시작 → 진행 → 끝 화면, 카드 뒤집기, 저장 |
| `style.css` | 남보라 파티 밤 + 색종이, 크림색 카드, 진실 청록·도전 산호·랜덤 보라 (Baloo 2 · ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mitr · ru Rubik · vi 본문 Be Vietnam Pro) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 겹친 카드 + 주사위, 진실/도전 라벨만), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 + 카드(packs) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(하는 법·공평한 순서·우리끼리 규칙·"누구나 넘어갈 수 있다"·유래) — 카드 인용 없음 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-truth.js` | 로직·차례 바퀴(2~20명, 연속 없음)·공정성 카이제곱(첫 사람·새 바퀴 첫 사람·랜덤 반반·덱 첫 카드)·덱·언어 파일(키·자리표시자·팩 4×40장+·금지어·FAQ·360px 문구)·생성 HTML·스포일러·OG 검사 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js            # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js truth    # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/truth)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-truth.js
```
