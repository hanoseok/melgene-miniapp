# apps/hue — 다른 색 찾기 (게임)

다른 색 찾기(절대색감 테스트, Kuku Kube 방식). n×n 판의 타일이 모두 같은 색인데 **딱 한 칸**만 아주 살짝 밝거나 어둡다. 그 칸을 누르면 다음 레벨(판이 커지고 색 차이가 줄어듦). 전체 60초, 틀리면 3초 감점. 점수 = 깬 레벨 수. **재미용이며 의학적 색각 검사가 아니다**(FAQ·가이드에 명시).
시작(티징 + 한 줄 방법 + 맨 아래 광고 1개) → 게임(HUD 레벨·시간·최고 + 시간 막대 + 색 판 + 안내 한 줄, 광고 없음) → 끝 화면(점수·색감 등급·최고·틀린 횟수·가장 큰 판·서버 백분위 카드 → 공통 끝 화면).

- 화면: DOM 판(`div` n×n, CSS grid, aspect-ratio 1). 판 폭 = `min(448px, 화면 폭, 100svh − 236px)` — 플레이 중 스크롤 없이 한 화면. 판 바탕은 색 판단을 흐리지 않게 무채색(짙은 회색).
- 입력: 칸 누르기(마우스·터치 click), 키보드(판 `#board` 포커스 — 화살표로 커서, Enter/Space 고르기). 틀리면 그 칸 어두워짐 + 판 흔들림 + "−3s" 떠오름.
- 규칙(`hue-core.js`): 판 크기 2,3,3,4,4,5,5,5,6,6,6,7,7,7,7 → 그 뒤 8×8. 색 차이 = OKLab 밝기(L) 0.15 × 0.89^레벨, 바닥 0.016. 색은 레벨마다 무작위 OKLCH(hue 0..360 · chroma 0.06..0.15 · L 0.52..0.78, 다른 칸 L 은 0.42..0.86 안), 두 색 모두 sRGB 안에 들도록 chroma 를 줄임(밝기만 다름). 등급 = 점수 0·5·10·15·20·26 이상 → 6단계(이름은 언어 파일 `result.tiers`, 끝 화면에는 내 등급만). 시드 난수 mulberry32.
- 시간이 다 되면 마지막 레벨의 정답 칸을 잠깐 표시하고 끝 화면으로. 탭을 떠나면(visibilitychange hidden) 시계를 멈추고 돌아오면 이어 감. prefers-reduced-motion: 흔들림·떠오름 끔, 끝 화면도 빨리.
- 최고 기록: localStorage `hue_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('hue', 점수)` 한 번 → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).
- track: 시작(또는 다시 하기) 때 `track('start')`, 끝 화면에 닿을 때 `track('done')` 각 한 번.

주소: 원본은 자리표시자 `https://hue.example.com/`, 배포 때 `https://melgene.com/hue/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎨·카테고리 game·등록일 2026-10-31·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `hue-core.js` | 판 크기·색 차이·OKLCH→sRGB 색 만들기·레벨(다른 칸 하나)·pick(맞음/3초 감점)·timeLeft·tierOf·bucket·백분위 (UMD) |
| `hue.js` | 화면·입력(클릭·키보드)·판 그리기·시계(requestAnimationFrame, 숨으면 멈춤)·효과·HUD·끝 화면·점수 전송. 검사용 `window.HUE_APP` |
| `style.css` | 무채색 짙은 회색 바탕 + 무지개 포인트 (제목 Fredoka / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 `guide.html` 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`), 티저 그림 `heroSvg` |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-hue.js` | 로직(판 크기 2→8·색 차이 줄어듦·2,400레벨: 다른 칸 정확히 1개·8비트 색도 다름·sRGB·밝기 범위·hex 실제 밝기 차이 = delta, 감점·시간·재현·등급 경계)·bucket/백분위·언어 파일(키·자리표시자·FAQ(의학 검사 아님 포함)·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·그 밖 광고 0·FAQPage 없음·끝 화면 순서)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름 검사 (Chrome headless + CDP + mock-supa, check-all 에는 안 들어감 — 느림) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js hue          # 이 앱 검사만

# 이 폴더(apps/hue)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-hue.js
node tools/flow-test.js en,ko,th 360,375,1440    # 흐름 검사 (언어 × 폭 + 움직임 줄이기)
```
