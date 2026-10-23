# apps/bomb — 폭탄 돌리기 (투표)

휴대폰 하나를 돌리며 노는 파티 게임: 폭탄을 누르고 옆 사람에게 넘기다가, 몰래 정해진 순간에 터질 때 들고 있던 사람이 걸린다. 시작 화면(설정) → 게임 화면(폭탄 누르고 넘기기 → 펑 → 결과 + 최근 기록 + 공통 끝 화면).

- 시작 화면 `#screen-setup`: h1(현지 검색어)·훅 → 누가 하나(🎲 그냥 하기 기본 / 👥 이름 넣기 2~12명, 줄바꿈·쉼표, 넘기는 순서) → 심지 길이(짧게 10~25초 · 보통 20~45초 기본 · 길게 40~80초 — 범위 문구는 bomb-core `FUSES` 에서 생성) → 힌트 보기(불꽃이 빨라짐, 기본 꺼짐) · 벌칙 미션 카드(기본 꺼짐) → "심지에 불붙이기" → 공정성 한 줄 → 맨 끝 `mg-ad-start` 1자리.
- 게임 화면 `#screen-play`(처음 hidden, 광고 자리 없음): 심지 안내(시간은 비밀)·🔊/🔇·그만 → "💣 ○○ 님이 폭탄을 들고 있어요"(이름 없으면 "누르고 넘기세요") → 큰 폭탄 버튼(누르면 넘기기, 600ms 연타 방지) → "→ ○○ 님에게 넘겨요!" · 넘긴 횟수 → 멈춤 덮개(`#paused`) · 펑(`#boom`, 앱 폭 안 전체 화면) → `#result`: 결과 카드("💥 ○○" 또는 "걸렸다!", 심지 n초·넘긴 횟수, 벌칙 미션 한 장, "참가자 바꾸기"·"이 이름으로 링크 복사"(이름 모드만)) → 최근 판 10개(이 기기, "지우기") → `data-mg-end="bomb"`.
- **터지는 시각을 먼저 정한다**: 불붙이는 순간 `crypto.getRandomValues` 거부 샘플링으로 범위 안 1ms 단위 균등(`drawFuse`). 화면·PAGE_I18N·DOM 어디에도 쓰지 않는다(끝난 뒤 결과에만 "심지 n초"). 첫 사람도 crypto(`firstHolder`).
- 째깍 소리·진동(`planTicks`): 끝으로 갈수록 빨라지지만 시작점(20~55%)·곡선(지수 1.5~2.8)·처음 간격(600~780ms)·최고 속도(105~150ms)·가짜 질주 1~3번·박자마다 ±15% 를 crypto 로 섞어 박자로 남은 시간을 정확히 알 수 없다. 힌트를 켜면 심지 불꽃(`--spark-ms`)이 박자를 따라 빨라지고, 끄면 일정.
- 소리: WebAudio — 불붙이기(·계속하기)를 누른 뒤에만 AudioContext 를 만든다. 끄기 상태는 저장. 진동은 `navigator.vibrate` 가 있을 때만(째깍 12~22ms, 넘기기 30ms, 펑 [320,90,420]).
- 멈춤: `visibilitychange`(숨김)·`pagehide` 에 심지 시계(`fusePause`)와 소리가 멈추고, 돌아와서 "계속하기"를 눌러야 멈춘 자리부터 다시 탄다.
- 움직임 줄이기: 펑이 흔들림·파편 없이 짧은 번쩍임(0.45초) 뒤 결과.
- 벌칙 미션: 언어별 12장(`tools/i18n/<lang>.js` 의 `missions`, 가족용). 터진 뒤 덱에서 **한 장씩만**(다 쓰기 전 반복 없음). PAGE_I18N 안에만 있고 보이는 HTML·메타·OG·가이드·FAQ·README 에 목록으로 쓰지 않는다(check 가 확인).
- 공유: 끝 화면 공통 공유(setShareData)는 깨끗한 앱 주소. "이 이름으로 링크 복사" = `#d=<UTF-8 base64url(JSON {v:1,m:[이름]})>` — 이름만(결과·심지 없음). 받은 사람은 이름이 채워진 시작 화면을 보고 직접 불붙인다(start/done 은 할 때만). 잘못된 링크는 안내만.
- 저장: 설정 `mg_bomb_v1`(모드·이름·심지·힌트·벌칙·소리), 최근 결과 `mg_bomb_hist_v1`(10개, 읽을 때 `sanitizeHistory`) — localStorage, 모든 접근 try/catch. 서버로 보내지 않는다. 서버 숫자 없음.
- 기록: 불붙일 때마다 `track('start')`, 터질 때 `track('done')`. 다시 하기(setRetry) = "한 판 더"(같은 설정).

주소: 원본은 자리표시자 `https://bomb.example.com/`, 배포 때 `https://melgene.com/bomb/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 💣·카테고리 vote·등록일 2026-10-24·order 2·12개 언어 제목/설명) |
| `bomb-core.js` | crypto 거부 샘플링, 심지 길이(drawFuse)·심지 시계(newFuse/fuseStart/fusePause/fuseElapsed/fuseDone), 째깍 박자(planTicks/tickGap), 넘기기(firstHolder/nextHolder/canPass), 이름·검사, 벌칙 덱, 기록, `#d=` 인코딩/디코딩 (UMD) |
| `bomb.js` | 설정 → 심지·박자 먼저 → 넘기기·째깍(WebAudio·진동)·멈춤 → 펑 → 결과·미션·기록 → 끝 화면, `#d=` 이름 불러오기 |
| `style.css` | 보랏빛 밤 + 주황 불빛, 검은 폭탄(SVG)·노란 불꽃, 크림색 카드, 펑 전체 화면 (Baloo 2 · ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mitr · ru Rubik · vi 본문 Be Vietnam Pro) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 폭탄 + 불꽃 + 넘기는 손), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 + 언어별 벌칙 미션 12장 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(하는 법·파티 응용·비밀 심지가 공정한 이유·안전 팁·유래) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-bomb.js` | 로직·공정성(카이제곱: 심지 3종 15칸, 첫 사람 2~12명)·심지 시계 멈춤·박자(빨라짐·예측 불가)·넘기기·이름·덱·기록·`#d=`·언어 파일·360px 문구·생성 HTML·**미션 목록 노출 없음**·OG 검사 |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js             # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js bomb      # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/bomb)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-bomb.js
node tools/flow-test.js en,ko,ja 360,1440
```
