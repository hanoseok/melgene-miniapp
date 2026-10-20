# apps/snake — 뱀 게임 (게임)

고전 스네이크. 17×17 격자 위에서 뱀을 움직여(터치 스와이프 · 방향키 · WASD) 사과를 먹고 길어진다. 벽이나 자기 몸에 닿으면 끝(벽 통과 옵션 없음).
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 카운트다운 3·2·1 → 게임(HUD 점수·최고·일시정지 + 캔버스, 광고 없음) → 끝 화면(점수 카드 → 공통 끝 화면).

- 속도: 틱 간격 = max(75, 165 − 3 × 먹은 수) ms (먹을수록 빨라짐). 사과 점수 = 10 + 2 × min(레벨 − 1, 10), 레벨 = 1 + floor(먹은 수 / 5).
- 입력: 반대·같은 방향은 무시, 한 틱 사이에 2개까지 줄 세움(빠른 연속 스와이프). 카운트다운 중에도 방향을 미리 줄 수 있다.
- 끝나는 경우: `wall`(벽) · `self`(자기 몸, 꼬리 칸으로 가는 이동은 안전) · `full`(격자를 다 채움).
- 탭을 떠나면 자동 일시정지(visibilitychange·pagehide), 일시정지 버튼·P/Esc. prefers-reduced-motion: 먹을 때 고리·점수 글자·카운트 팝·충돌 번쩍임·사과 맥박 끔.
- 최고 기록: localStorage `sn_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('snake', round(score/10))` 한 번 → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).
- track: 시작(또는 다시 하기) 때 `track('start')`, 끝 화면에 닿을 때 `track('done')` 각 한 번.

주소: 원본은 자리표시자 `https://snake.example.com/`, 배포 때 `https://melgene.com/snake/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🐍·카테고리 game·등록일 2026-10-21·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `snake-core.js` | 격자·뱀·사과·`turn`/`tick`/`step`(시드 난수 mulberry32)·속도 곡선·레벨·점수·bucket·백분위 (UMD) |
| `snake.js` | 화면·입력(스와이프·키)·캔버스(dpr 최대 2.5, 한 칸 = 정수 px)·HUD·일시정지·끝 화면·점수 전송. 검사용 `window.SNAKE_APP` |
| `style.css` | 숲 초록 + 형광 라임 뱀 + 사과 빨강 (제목 Lilita One / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 `guide.html` 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-snake.js` | 로직(봇 1,000판: 점수·길이·충돌·재현·속도·공정함)·bucket/백분위·언어 파일(키·자리표시자·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·그 밖 광고 0·FAQPage 없음·끝 화면 순서)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js snake        # 이 앱 검사만

# 이 폴더(apps/snake)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-snake.js
```
