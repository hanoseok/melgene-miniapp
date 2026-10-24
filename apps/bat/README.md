# apps/bat — 할로윈 박쥐 날기 (게임)

플래피 버드 방식의 할로윈 게임. 박쥐는 저절로 앞으로 날고, 탭·클릭·스페이스(엔터·↑·W)마다 날갯짓해 위로 솟았다가 중력으로 떨어진다. 보름달 아래 위에서 매달린 유령 나무와 아래의 묘비·유령 나무 사이 틈을 지나면 1점, 기둥이나 땅에 닿으면 끝.
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 점수·최고·일시정지 + 캔버스, 준비 상태 "탭해서 날갯짓" — 첫 탭이 판을 시작, 광고 없음) → 끝 화면(점수 카드 → 공통 끝 화면).

- 화면: Canvas 2D, 세계 360×600 단위를 필드 크기에 맞춰 늘림(비율 고정). 달밤 하늘·별·보름달·먼 언덕과 성 실루엣·안개, 박쥐(날개 퍼덕임·속도에 따라 기울기), 부딪히면 번쩍임·흔들림 뒤 땅으로 떨어짐. requestAnimationFrame + devicePixelRatio(최대 2.5).
- 규칙(`bat-core.js`, 고정 시간 간격 1/120초 — 같은 시드 + 같은 tick 의 날갯짓 = 같은 판): 중력 1500, 날갯짓 속도 −430, 최대 낙하 700. 충돌 반지름 11(그림 17보다 작게, 너그러운 판정). 기둥 폭 62·간격 214, 틈 높이 = max(134, 178 − 2 × 기둥 번호), 속도 = min(196, 138 + 2 × 점수) 단위/초, 앞 틈과 가운데 차이 ≤ 120(언제나 지나갈 수 있음). 천장은 막힘만(죽지 않음). 점수 = 지난 틈 수.
- 탭을 떠나면 자동 일시정지(visibilitychange·pagehide), 일시정지 버튼·P/Esc. prefers-reduced-motion: 별 반짝임·언덕 흐름·안개·날개 퍼덕임·둥실·+1 떠오름·번쩍임·흔들림 끔(끝 화면도 바로).
- 최고 기록: localStorage `bat_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('bat', 점수)` 한 번 → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).
- track: 시작(또는 다시 하기) 때 `track('start')`, 끝 화면에 닿을 때 `track('done')` 각 한 번.

주소: 원본은 자리표시자 `https://bat.example.com/`, 배포 때 `https://melgene.com/bat/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🦇·카테고리 game·등록일 2026-10-25·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `bat-core.js` | 고정 tick 물리(`step`·`flap`)·기둥 생성(시드 난수 mulberry32, 틈 높이·이동 제한)·원-사각형 충돌·점수·자동 비행(`autoFlap`, 검사용)·bucket·백분위 (UMD) |
| `bat.js` | 화면·입력(탭·클릭·키)·캔버스 그리기(하늘·달·언덕·기둥·땅·박쥐·효과)·HUD·준비/일시정지·끝 화면·점수 전송. 검사용 `window.BAT_APP` |
| `style.css` | 달밤 보라 + 호박 주황·달빛 노랑 (제목 Fredoka / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 `guide.html` 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-bat.js` | 로직(준비·날갯짓·중력·천장·땅·고정 tick·충돌 경계·점수 1번·재현, 자동 비행 150판 × 300개 + 최악의 틈 이동 = 틈은 언제나 통과 가능, 봇 1,100판 공정함)·bucket/백분위·언어 파일(키·자리표시자·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·그 밖 광고 0·FAQPage 없음·끝 화면 순서)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | 실제 흐름 검사 (Chrome headless + CDP + mock-supa, check-all 에는 안 들어감 — 느림) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js bat          # 이 앱 검사만

# 이 폴더(apps/bat)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-bat.js
node tools/flow-test.js en,ko,ru 360,1440    # 흐름 검사 (언어 × 폭 + 움직임 줄이기)
```
