# apps/bingocall — 빙고 번호 추첨기 (투표)

송년회·회식·가족 모임 빙고를 휴대폰 하나나 TV·프로젝터로 진행하는 번호 추첨기(빙고 머신). 75볼(B-I-N-G-O) · 90볼(영국식 1~90) · 직접 범위(1~999 안에서 5~150개, 예: 아이들용 1~30).

- 화면 세 개: **시작**(h1·훅 → 방식 3개(기본 75볼) → 직접 범위 입력(직접일 때만) → 시작 → 맨 아래 `mg-ad-start`) → **진행**(방식 칩·`n / m`·전체 화면(Fullscreen API 지원할 때만)·끝내기 → 큰 공(75볼은 글자·색, 화면 폭·높이에 맞춰 커짐, 전체 화면에서 더 크게) → 지난 번호 5개 → 뽑기 → 되돌리기·자동 뽑기(3/5/8초, 진행 막대) → 읽어 주기(그 언어 음성이 있을 때만 보임)·효과음(둘 다 기본 꺼짐) → 전체 판 → 새 게임(확인)) → **끝**(뽑은 번호 수 / 전체 · 진행 시간 → 빙고 종류 바꾸기 → `data-mg-end="bingocall"`).
- **진행 화면에는 광고 자리를 두지 않는다**(TV·프로젝터에 띄우는 화면). 광고는 시작 화면 맨 아래 1개 + 공통 끝 화면.
- 뽑기(`bingocall-core.js`): 누를 때마다 아직 안 나온 번호 중 하나를 `crypto.getRandomValues` + 거부 샘플링으로 고른다(미리 섞어 두지 않아 저장소를 봐도 다음 번호를 알 수 없음). 같은 번호는 절대 다시 안 나오고, 끝까지 뽑으면 전체 번호의 순열. 되돌리기 = 마지막 번호를 다시 남은 번호로. 굴러가는 숫자 연출(약 0.9초, 연출 숫자도 crypto)은 값을 정한 뒤 보여 주기만 하고, 움직임 줄이기면 바로 나온다.
- 저장: localStorage `bingocall_state` = 진행 중 게임(방식·범위·뽑은 번호·시작/끝 시각·done) + 설정(간격·읽어 주기·소리·마지막 방식/범위). 새로 고침하면 진행 화면으로 그대로 돌아온다(start 다시 안 셈). 읽을 때 `sanitize`(버전·방식·범위·중복·개수) — 틀리면 버림. 서버로 보내는 것 없음, 서버 숫자 없음.
- 기록: 한 게임의 첫 번호를 뽑을 때 `track('start')` 1번, 끝내기(또는 모든 번호를 다 뽑았을 때) `track('done')` 1번(`game.done`, 되돌려도 다시 안 셈). 다시 하기(`setRetry`) = 같은 방식·범위로 새 게임 → 다시 start/done.
- 편의: 발표용 리모컨·키보드(진행 화면에서 Space·Enter·→·PageDown = 뽑기), 진행 화면에서 화면 꺼짐 막기(Wake Lock, 지원할 때만). 공유 = 깨끗한 주소(상태 없음).

주소: 원본은 자리표시자 `https://bingocall.example.com/`, 배포 때 `https://melgene.com/bingocall/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎱 · vote · 2026-11-07 · order 2 · 12개 언어 제목/설명) |
| `bingocall-core.js` | 범위·검사·75볼 글자·판 모양·뽑기(반복 없음)·되돌리기·끝내기·시간·저장 검사·연출 숫자 (UMD) |
| `bingocall.js` | 시작·진행·끝 화면 동작, 굴리기 연출, 자동 뽑기, 읽어 주기(speechSynthesis)·효과음(WebAudio), 전체 화면, 저장·복원 |
| `style.css` | 짙은 남색 무대 + 빙고 공(B 파랑·I 빨강·N 흰색·G 초록·O 노랑) · 제목은 언어 파일 글꼴, 숫자는 Baloo 2 |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 빙고 공 다섯 개 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법·75볼 vs 90볼·송년회 진행 팁·공정한 추첨 원리·큰 화면) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-bingocall.js` | 로직(끝까지 뽑기 순열 280번·되돌리기·저장 검사·카이제곱)·언어 파일·360px 문구·생성 HTML(시작 화면 mg-ad-start, 진행 화면 광고 없음)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름(Chrome headless): en·ko 375px 75개 모두 뽑기·새로 고침·되돌리기·끝내기·다시 하기, 움직임 연출, de·ru·vi 360px 넘침 (check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js bingocall      # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/bingocall)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-bingocall.js
node tools/flow-test.js                # en,ko × 375 + 움직임 + de,ru,vi × 360
```
