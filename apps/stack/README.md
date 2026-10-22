# apps/stack — 탑 쌓기 (게임)

고전 스택 게임. 탑 위로 블록이 한 축을 따라 왔다 갔다 하고(층마다 x·z 축을 번갈아), 탭·클릭·스페이스(엔터·↓)로 떨어뜨린다. 아래 블록과 겹친 부분만 남고 삐져나온 조각은 잘려 떨어진다. 완전히 빗나가면 끝.
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 층수·최고·일시정지 + 캔버스 + "탭해서 떨어뜨리기" 안내, 광고 없음) → 끝 화면(점수 카드 → 공통 끝 화면).

- 화면: Canvas 2D 아이소메트릭(윗면·왼면·오른면), 층마다 색상(hue)이 7°씩 바뀌고 배경 그라데이션도 따라감, 카메라가 맨 위를 부드럽게 따라 올라감, 끝나면 탑 전체가 보이게 물러남. requestAnimationFrame + devicePixelRatio(최대 2.5).
- 규칙(`stack-core.js`): 받침 100×100, 움직임 폭 ±115, 속도 = min(290, 120 + 4 × 쌓은 수) 단위/초. 어긋남 ≤ 3단위 = 퍼펙트(제자리 스냅, 크기 유지, 연속 +1), 연속 퍼펙트 3번째부터 그 축으로 5단위씩 넓어짐(최대 100). 점수 = 쌓은 블록 수.
- 탭을 떠나면 자동 일시정지(visibilitychange·pagehide), 일시정지 버튼·P/Esc. prefers-reduced-motion: 퍼펙트 물결·글자 떠오름·조각 낙하·줌아웃 애니메이션 끔(조각은 제자리에서 짧게 사라짐, 카메라는 바로 이동).
- 최고 기록: localStorage `st_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('stack', 층수)` 한 번 → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).
- track: 시작(또는 다시 하기) 때 `track('start')`, 끝 화면에 닿을 때 `track('done')` 각 한 번.

주소: 원본은 자리표시자 `https://stack.example.com/`, 배포 때 `https://melgene.com/stack/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🏗️·카테고리 game·등록일 2026-10-23·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `stack-core.js` | 블록·겹침(`overlap1`)·`step`(왕복)·`drop`(퍼펙트·잘림·넓어짐·빗나감)·속도 곡선·시드 난수(mulberry32)·bucket·백분위 (UMD) |
| `stack.js` | 화면·입력(탭·클릭·키)·캔버스 그리기(아이소메트릭·색·카메라·조각·물결)·HUD·일시정지·끝 화면·점수 전송. 검사용 `window.STACK_APP` |
| `style.css` | 해 질 녘 남보라 + 민트·복숭아 (제목 Fredoka / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 `guide.html` 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-stack.js` | 로직(겹침·잘림·퍼펙트·넓어짐·왕복·재현, 봇 1,200판: 완벽·사람 같은 오차·대충·무작위 — 불변식·공정함)·bucket/백분위·언어 파일(키·자리표시자·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·그 밖 광고 0·FAQPage 없음·끝 화면 순서)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름 검사 (Chrome headless + CDP + mock-supa, check-all 에는 안 들어감 — 느림) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js stack        # 이 앱 검사만

# 이 폴더(apps/stack)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-stack.js
node tools/flow-test.js en,ko 360,375,1440   # 흐름 검사 (en·ko × 3폭 + 움직임 줄이기)
```
