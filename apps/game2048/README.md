# apps/game2048 — 2048 게임 (게임)

고전 2048 숫자 퍼즐, 할로윈 분위기 타일(뼈색 → 호박 주황 → 마녀 보라 → 슬라임 → 잭오랜턴, 128 이상은 귀퉁이에 작은 그림). 판 위 스와이프(터치·마우스 끌기) 또는 방향키·WASD로 모든 타일을 한쪽으로 밀고, 같은 숫자 둘이 만나면 두 배 하나로 합쳐진다.
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 점수·최고 + 4×4 판, 광고 없음) → 끝 화면(점수 카드 → 공통 끝 화면).

- 규칙: 밀 때마다 한 줄에서 같은 숫자는 한 번만 합쳐짐, 무언가 움직였을 때만 빈 칸에 새 타일(90% 2 · 10% 4). 점수 = 합쳐서 생긴 타일 값의 합. 되돌리기 없음.
- 2048 을 만들면 "계속하기 / 여기서 끝내기"(끝내기 → 끝 화면). 빈 칸도 없고 이웃끼리 같은 숫자도 없으면 끝(“더 이상 움직일 수 없어요” 잠깐 보인 뒤 끝 화면).
- prefers-reduced-motion: 미끄러짐·튀어나옴·점수 떠오름·티저 움직임 끔.
- 최고 기록: localStorage `game2048_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('game2048', round(score/20))` 한 번 → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).
- 기록: 시작(다시 하기 포함) `track('start')`, 끝 화면 `track('done')`.

주소: 원본은 자리표시자 `https://game2048.example.com/`, 배포 때 `https://miniapp.melgene.com/game2048/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔢·카테고리 game·등록일 2026-10-04·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `game2048-core.js` | 4×4 판, 시드 난수(mulberry32), `newGame`·`move(state, dir)`(slides·merged·removed·spawn·justWon·over 돌려줌)·`canMove`·`tiles`, bucket·percentile (UMD) |
| `game2048.js` | 화면·입력(스와이프·방향키)·타일 DOM 애니메이션·HUD·2048 달성/끝 오버레이·끝 화면·점수 전송. 검사용 `window.G2048_APP` |
| `style.css` | 보랏빛 밤 + 타일 색, 클래스 앞머리 `tf-`(공통 `mg-` 와 겹치지 않게) (제목 Lilita One / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-game2048.js` | 로직(한 줄 합치기 규칙·방향·안 움직이면 그대로·새 타일·점수·2048 한 번·끝 조건·재현·봇 60판 불변식·실력)·bucket/백분위·언어 파일(키·자리표시자·FAQ·글꼴·제목·검색어 2048·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·그 밖 광고 0·FAQPage 없음·끝 화면 순서·공통 클래스 겹침)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js game2048     # 이 앱 검사만

# 이 폴더(apps/game2048)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-game2048.js
```
