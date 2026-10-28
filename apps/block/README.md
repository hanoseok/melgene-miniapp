# apps/block — 블록 퍼즐 (게임)

8×8 블록 퍼즐(Block Blast·1010! 방식). 조각 세 개를 받아 판에 끌어다 놓고, 가로줄·세로줄이 꽉 차면 **동시에** 지워진다. 세 개를 다 놓으면 새로 세 개, 남은 조각이 어디에도 안 들어가면 끝.
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 점수·최고·콤보 + 8×8 판 + 안내 한 줄 + 조각 3칸, 광고 없음) → 끝 화면(점수 카드 → 공통 끝 화면).

- 화면: DOM 판(8×8 `div`, CSS grid, aspect-ratio 1) — 360px 에서 칸 약 37px, 데스크톱 최대 448px. 끄는 조각은 판 칸 크기의 `position: fixed` 고스트(translate3d)로 따라오고, 터치는 손가락 위로 띄운다. 놓을 수 있는 자리면 판에 미리보기 + 지워질 줄 흰 테두리.
- 입력: 끌어 놓기(pointer events + setPointerCapture), 탭으로 고르고 탭으로 놓기(탭한 칸을 덮는 자리, 가운데 우선), 키보드(1·2·3 고르기, 화살표, Enter/Space 놓기, Esc 취소, 판 `#board` 포커스).
- 규칙(`block-core.js`): 조각 15가족 37모양(점·직선 2~5 가로세로·2×2·3×3·2×3·작은 ㄱ·L·J·큰 ㄱ·T·S·Z, 회전 없음), 가족 가중치. 점수 = 놓은 칸 + 줄 보너스(10·k(k+1)/2 → 10·30·60·100…) × 콤보. 콤보 = 줄을 지운 놓기마다 +1, 못 지운 놓기 3번 이어지면 0. 나눠 줄 때 하나도 안 들어가면 3번까지 다시 뽑기(빈 판에서는 언제나 들어감). 시드 난수 mulberry32(같은 시드 + 같은 놓기 = 같은 판).
- 탭을 떠나면(visibilitychange·pagehide·blur) 끌던 조각을 제자리로(시간 제한이 없어 멈출 것은 없음). prefers-reduced-motion: 놓기·지우기·점수 떠오름·흔들림 애니메이션 끔, 끝 화면도 빨리.
- 최고 기록: localStorage `block_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('block', round(점수/20))` 한 번 → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).
- track: 시작(또는 다시 하기) 때 `track('start')`, 끝 화면에 닿을 때 `track('done')` 각 한 번.

주소: 원본은 자리표시자 `https://block.example.com/`, 배포 때 `https://melgene.com/block/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🧩·카테고리 game·등록일 2026-10-29·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `block-core.js` | 조각(회전 생성·중복 제거·가중치)·canPlace·가로세로 동시 지우기·점수·콤보·나눠 주기(다시 뽑기)·끝 판정·욕심쟁이 봇(`bot`)·bucket·백분위 (UMD) |
| `block.js` | 화면·입력(끌기·탭·키보드)·판/조각 그리기·미리보기·효과·HUD·끝 화면·점수 전송. 검사용 `window.BLOCK_APP` |
| `style.css` | 깊은 남색 판 + 사탕 색 블록 7가지 (제목 Fredoka / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 `guide.html` 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`), 티저 그림 `heroSvg` |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-block.js` | 로직(조각 모양·경계·가로/세로/동시 지우기·점수·콤보 유지/끊김·새로 나눠 주기·재현·첫 손 2,000시드·다시 뽑기, 무작위 봇 1,500판 + 욕심쟁이 봇 250판: 오류 없음·정수 점수·끝 판정 전수 확인·가득 찬 줄 없음·공정함)·bucket/백분위·언어 파일(키·자리표시자·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·그 밖 광고 0·FAQPage 없음·끝 화면 순서)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름 검사 (Chrome headless + CDP + mock-supa, check-all 에는 안 들어감 — 느림) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js block        # 이 앱 검사만

# 이 폴더(apps/block)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-block.js
node tools/flow-test.js en,ko,ja 360,1440    # 흐름 검사 (언어 × 폭 + 움직임 줄이기)
```
