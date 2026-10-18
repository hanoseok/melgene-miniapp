# apps/bottle — 병 돌리기 (투표)

휴대폰을 테이블 가운데 두고 화면 속 병을 돌려 한 사람을 고르는 파티·순서 정하기 도구. 시작 화면이 따로 없는 한 화면 도구 앱(yesno·roulette 류): 옵션 → 테이블 위 병 → 돌리기 → (돌린 뒤) 결과 + 최근 기록 + 공통 끝 화면 → 맨 아래 `mg-ad-start`. 가족용 — 키스·성인 연출은 어디에도 없다(check 가 막음).

- 첫 화면 `#screen-bottle`: h1(현지 검색어)·훅 → 옵션 카드(모드 **그냥 돌리기**(기본, 이름 없이 아무 각도) / **이름 넣고 돌리기**(2~12명, 앉은 순서대로 시계 방향) · 겹치지 않게(기본 켬) · 미션 카드(기본 꺼짐: 랜덤 미션 / 직접 쓰기 30줄)) → 테이블(이름 칩이 둘레에 같은 간격, 360px 에서 칩 폭은 bottle.js 가 `--chip-w` 로 잡고 말줄임) + 병 → "병 돌리기" → `#result`(처음 hidden) → 맨 끝 `mg-ad-start` 1자리(결과가 보이면 숨김).
- 돌리기: 버튼 · 병 누르기 · 손가락으로 튕기기(pointer events, 튕긴 방향 = 회전 방향만) · 키보드 Enter/Space. **결과를 먼저 정한다** — `crypto.getRandomValues` 거부 샘플링으로 자리(그냥 돌리기면 0.0~359.9°)를 고르고, 그 자리 칸 안(중심 ± 칸×0.38, 흔들기도 crypto)에 멈추도록 회전량을 계산한 뒤(4~7바퀴, 3~6초, ease-out quart) 애니메이션만 한다. rAF 가 멈춰도(숨은 탭) ms+0.5초 뒤 반드시 끝냄. 움직임 줄이기면 0.25초. 멈추면 진동(`navigator.vibrate`).
- 결과 `#result`: 결과 카드(“병이 가리킨 사람은” + 이름 / 그냥 돌리기 문구, 라운드 “n명 중 k명”, 미션 카드 한 장, "새 라운드 시작"·"이 이름으로 링크 복사") → 최근 기록(10개, 2개 이상일 때) → `data-mg-end="bottle"`.
- 겹치지 않게: 한 라운드 동안 아직 안 뽑힌 사람 중 균등, 모두 뽑히면 다음 돌리기에서 새 라운드. 이름이 바뀌면 라운드 초기화.
- 미션 카드: 언어별 기본 12장(`tools/i18n/<lang>.js` 의 `prompts`, 가족용·현지 표현) 또는 직접 쓴 목록을 crypto 로 섞어 한 장씩(다 쓰기 전 반복 없음, 다시 섞을 때 연속 반복 없음). **스포일러 금지**: 기본 카드는 PAGE_I18N 안에만 있고 보이는 HTML·메타·OG·가이드·FAQ 에 목록으로 쓰지 않는다(check 가 확인).
- 공유: 끝 화면 공통 공유(setShareData)는 깨끗한 앱 주소. "이 이름으로 링크 복사"(이름 모드에서만) = `#d=<UTF-8 base64url(JSON {v:1,m:[이름],s:0|1})>` — 결과는 담지 않고 이름 목록·겹치지 않기만. 받은 사람은 이름이 채워진 테이블을 보고(“공유 링크에서 이름을 불러왔어요”), start/done 은 돌릴 때만 센다. 잘못된 링크는 안내만.
- 저장: 마지막 모드·이름 목록만 localStorage `mg_bottle_v1`(try/catch). 서버로 보내지 않는다. 서버 숫자 없음.
- 기록: 돌릴 때마다 `track('start')`, 결과가 보일 때 `track('done')`(yesno 와 같은 방식). 다시 하기(setRetry) = "한 번 더 돌리기".

주소: 원본은 자리표시자 `https://bottle.example.com/`, 배포 때 `https://melgene.com/bottle/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🍾·카테고리 vote·등록일 2026-10-19·order 2·12개 언어 제목/설명) |
| `bottle-core.js` | crypto 거부 샘플링·Fisher–Yates, 글자 정리·이름/미션 읽기, 검사(validate), 각도 ↔ 자리(angleToSeat/targetAngle), 회전 계획(planRotation/spinPlan/ease), 겹치지 않기 라운드(chooseSeat), 미션 덱, 기록, `#d=` 인코딩/디코딩 (UMD) |
| `bottle.js` | 옵션 → 자리 칩 → 결과 먼저 → 회전 애니메이션(rAF + 안전 타이머)·튕기기 → 결과·미션·기록 → 끝 화면, `#d=` 이름 불러오기 |
| `style.css` | 자두색 파티 밤 + 색종이 점, 둥근 나무 테이블, 초록 유리병(SVG), 호박색 포인트, 크림색 카드 (Baloo 2 · ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mitr · ru Rubik · vi 본문 Be Vietnam Pro) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 테이블 + 병 + 둘레 이모지 얼굴), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 + 언어별 기본 미션 카드 12장 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(돌려서 고르기의 유래·하는 법·모임별 아이디어·공정한 이유·팁) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-bottle.js` | 로직·각도↔자리 왕복·회전 계획·공정성(카이제곱: 자리 2~12명, 실제 흐름, 각도, 겹치지 않기)·미션 덱·`#d=` 왕복/변조 거절·언어 파일·360px 문구·생성 HTML·스포일러·OG 검사 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js             # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js bottle    # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/bottle)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-bottle.js
```
