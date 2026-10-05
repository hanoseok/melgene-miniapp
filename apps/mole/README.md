# apps/mole — 두더지 잡기 / Whack-a-Mole (게임)

3×3 구멍에서 튀어나오는 두더지를 30초 동안 눌러 잡는 반응 게임. 시간이 갈수록 빨라지고(간격 0.8 → 0.38초, 떠 있는 시간 1.2 → 0.6초, 동시에 1 → 2 → 3마리), 황금 두더지(+30)와 폭탄(−20)이 섞여 나온다.
시작(티징 + 짧은 방법 3칸 + 맨 아래 광고 1개) → 게임(HUD 점수·시간·최고 + 시간 막대 + 3×3 구멍, 광고 없음) → 끝 화면(내 등급 하나 + 점수 카드 → 공통 끝 화면).

- 점수: 두더지 +10 · 황금 +30 · 폭탄 −20(0 아래로 안 내려감). 빈 구멍을 눌러도 감점 없음. 시작 후 처음 두 번은 반드시 두더지.
- 등급 6단계(점수 문턱 0·60·130·210·300·400): 이름은 언어 파일 `result.tiers`, 이모지는 `mole-core.js` `TIER_EMOJI`. 끝 화면에는 내 등급만 보이고 목록은 어디에도 없다(스포일러 금지).
- 입력: 구멍 누르기(pointerdown 으로 즉시 반응), 키보드 1~9. prefers-reduced-motion 이면 올라오는 움직임·망치·점수 떠오름·흔들림 끔. 프레임당 진행 시간 상한 100ms(탭을 숨기면 사실상 일시정지).
- 최고 기록: localStorage `mole_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('mole', round(score/10))` 한 번 → 돌아온 실제 분포로 상위 % (reaction·game2048 과 같은 방식, 서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김). 새 DB 변경 없음.
- 기록: 시작(다시 하기 포함) `track('start')`, 끝 화면 `track('done')`.

주소: 원본은 자리표시자 `https://mole.example.com/`, 배포 때 `https://miniapp.melgene.com/mole/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔨·카테고리 game·등록일 2026-10-06·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `mole-core.js` | 규칙·시간 진행(`tick(s, dt)` → spawn/leave/end 사건)·`whack(s, hole)`·난이도 곡선·`tierOf`, 시드 난수(mulberry32), bucket·percentile (UMD) |
| `mole.js` | 화면·입력·구멍 DOM 상태(data-state/kind)·HUD·끝 화면·점수 전송. 검사용 `window.MOLE_APP` |
| `style.css` | 흙빛 밤 + 잔디 판 + CSS 로 그린 두더지(클래스 앞머리 `tf-`) (제목 Lilita One / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-mole.js` | 로직(시간 진행·점수·난이도·재현·봇 실력·등급)·bucket/백분위·언어 파일(키·번역·자리표시자·등급 6개·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·게임 중 광고 0·FAQPage 없음·끝 화면 순서·등급 목록 없음)·OG 검사 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js mole         # 이 앱 검사만

# 이 폴더(apps/mole)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all             # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-mole.js
```
