# apps/finger — 손가락 룰렛 (투표)

Chwazi 식 손가락 고르기: 휴대폰을 가운데 두고 모두 화면에 손가락을 하나씩 올리면, 잠깐 가만히 있은 뒤 그 순간 화면 위 손가락들 중에서 공정하게 고른다. 1명 뽑기 · 여러 명 뽑기(N) · 팀 나누기(2~4팀). 시작 화면(설정) → 손가락 판 화면(판 → 뽑기 → 결과 + 최근 기록 + 공통 끝 화면).

- 시작 화면 `#screen-setup`: h1(현지 검색어)·훅 → 무엇을 뽑나(👆 1명 기본 / ✌️ 여러 명 / 🎨 팀) → 몇 명(N 1~9, `−`·`+`) 또는 몇 팀(2·3·4) → "손가락 판 열기" → 공정성 한 줄 → 맨 끝 `mg-ad-start` 1자리. 설정만 이 기기에 저장(`mg_finger_v1`).
- 손가락 판 `#screen-play`(처음 hidden, 광고 자리 없음): 모드 안내·설정 버튼 → `#pad`(높이 ≈ 화면 − 200px, 340~640px) → 클릭 모드 줄(안내·지우기·Go) → `#result`(결과 카드 · 팀 줄 · "설정 바꾸기") → 최근 결과(메모리에만 10개) → `data-mg-end="finger"`.
- **입력**: Pointer Events. 판은 `touch-action:none`·`user-select:none`·`-webkit-touch-callout:none`, `touchstart/touchmove/touchend` 를 `passive:false` 로 막고 `contextmenu`·`selectstart`·`dragstart`·`gesturestart`(iOS 확대)도 막는다. 손가락(touch/pen)은 누르는 동안만 점이 있고 `setPointerCapture`, 최대 10개(넘으면 "10개까지" 안내). 손가락마다 다른 색(들어온 순서, 결과와 무관)의 빛나는 원 + 맥박.
- **클릭 모드**(마우스, 또는 `navigator.maxTouchPoints < 2`): 누를 때마다 점이 생기고 가까운 점(34px)을 다시 누르면 지운다. 최소 인원이 되면 Go 가 켜지고, Go 뒤 `GO_MS`(1.5초) 두근두근 뒤 뽑는다.
- **언제 뽑나**: 손가락 수가 최소 인원(1명 = 2 · N명 = N+1 · 팀 = 팀 수) 이상이고 `STABLE_MS`(2.5초) 동안 더해지거나 떨어지지 않으면. 올리거나 떼면 기다림이 처음부터(고리 `--p` 가 0 으로). 탭이 숨으면 손가락을 모두 비운다.
- **공정성**: 정하는 순간(`decide()`) 판 위에 있는 점들 사이에서 `CORE.decide` — `crypto.getRandomValues` 거부 샘플링 + 부분 Fisher–Yates(1명·N명), 팀은 전체를 섞고 crypto 로 고른 시작 팀부터 돌아가며 나눔(크기 차이 ≤ 1, 누구든 어느 팀이든 균등). 미리 정하지 않는다.
- **연출**: 나머지(`.is-out`)는 흐려지고 뽑힌 원(`.is-win`)은 1.7배로 커지며 빛난다(팀은 팀 색 + 번호). 1.3초 뒤 결과. 움직임 줄이기면 애니메이션 없이 바로. 진동은 `navigator.vibrate` 가 있을 때만(올릴 때 15ms, 뽑을 때 [60,40,140]).
- 기록: 판에 첫 손가락(첫 점)이 올라갈 때 `track('start')`, 결과 화면이 보일 때 `track('done')`. 다시 하기(setRetry) = 판을 비우고 같은 설정으로 새 판. 공유(setShareData)는 깨끗한 앱 주소만(이름이 없으므로 `#d=` 없음). 서버 숫자 없음.

주소: 원본은 자리표시자 `https://finger.example.com/`, 배포 때 `https://melgene.com/finger/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 👆·카테고리 vote·등록일 2026-11-01·order 2·12개 언어 제목/설명) |
| `finger-core.js` | crypto 거부 샘플링, 설정 정리(normalize)·최소 인원(minTouches/canDecide), 기다림 시계(holdProgress/holdDone), 뽑기(pickWinners/splitTeams/decide), 기록 (UMD) |
| `finger.js` | 설정 → 판(Pointer Events·클릭 모드) → 기다림 → 뽑기·연출 → 결과·기록 → 끝 화면 |
| `style.css` | 남색 밤 + 네온 손가락 원, 크림색 카드 (Baloo 2 · ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mitr · ru Rubik · vi 본문 Be Vietnam Pro) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 빛나는 손가락 원 + 👆), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구(팀 이름 4개 포함) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(하는 법·클릭 모드·공정성·파티 아이디어·팁) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-finger.js` | 로직·공정성(카이제곱: 1명 2~10개 · N명 3종 + 조합 · 팀 4종 + 큰 팀 색 · 쌍 확률, 한 번 걸리면 다시 뽑아 두 번 연속일 때만 실패)·언어 파일·360px 문구·생성 HTML·입력 막기·OG 검사 |
| `tools/flow-test.js` | Chrome headless 실제 흐름(CDP 멀티터치 `Input.dispatchTouchEvent` + 마우스 클릭 모드, 느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js             # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js finger    # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/finger)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-finger.js
node tools/flow-test.js en,ko,th 360,1440
```
