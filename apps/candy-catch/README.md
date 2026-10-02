# apps/candy-catch — 할로윈 사탕 받기 게임 (게임)

50초 캐주얼 아케이드. 호박 바구니를 좌우로 움직여(터치 끌기 · 마우스 · ←/→·A/D 키) 떨어지는 사탕을 받고 방해물(거미·유령)은 피한다.
시작(티징 + 짧은 방법 3칸) → 카운트다운 3·2·1 → 게임(HUD 점수·시간·목숨 + 캔버스, 광고 없음) → 끝 화면(점수 카드 → 공통 끝 화면).

- 사탕 4종(10/20/30/50점, 귀한 것일수록 드묾·빠름), 방해물 2종(받으면 목숨 −1·콤보 0·0.9초 무적). 목숨 3개, 시간 50초.
- 콤보: 연달아 받은 사탕 수 → 배수 ×1(0~4) ×2(5~9) ×3(10~19) ×4(20~). 사탕을 놓치면 0.
- 난이도: 낙하 속도 165→400, 생성 간격 760→340ms, 방해물 비율 13%→32% (시간에 따라). 유령은 10초 뒤부터, 좌우로 흔들림.
- 탭을 떠나면 자동 일시정지(visibilitychange·pagehide), 일시정지 버튼·P/Esc. prefers-reduced-motion: 흔들림·파편·회전·글자 이동 끔.
- 최고 기록: localStorage `cc_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('candy-catch', round(score/10))` 한 번 → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).

주소: 원본은 자리표시자 `https://candy-catch.example.com/`, 배포 때 `https://miniapp.melgene.com/candy-catch/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🍬·카테고리 game·등록일 2026-09-30·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `candy-catch-core.js` | 필드 400×600 논리 좌표, 물건 6종(**순서 바꾸지 않음**), 시드 난수(mulberry32), `step(state, dt, input)`(50ms 로 나눔), 콤보·목숨·난이도, bucket·percentile (UMD) |
| `candy-catch.js` | 화면·입력·캔버스(스프라이트 미리 그림, dpr 최대 2.5)·HUD·일시정지·끝 화면·점수 전송. 검사용 `window.CANDY_APP` |
| `style.css` | 한밤 남색 + 슬라임 라임 + 사탕 분홍 + 호박 주황 (제목 Lilita One / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-candy-catch.js` | 로직(봇 2,400판: 점수·콤보·목숨·재현·난이도·공정함)·bucket/백분위·언어 파일(키·자리표시자·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·그 밖 광고 0·FAQPage 없음·끝 화면 순서)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa 에 점수 분포를 심어 상위 % 확인, 빈 서버·움직임 줄이기 한 번씩, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                  # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js candy-catch    # 이 앱 검사만

# 이 폴더(apps/candy-catch)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all               # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-candy-catch.js
node tools/flow-test.js                # 기본 en,ko,th,ru × 360,375,1440 (+ 빈 서버 · 움직임 줄이기). 캡처: 세 번째 인자로 폴더
                                       # 포트: CC_HTTP_PORT=8891 CC_MOCK_PORT=8892 CC_CDP_PORT=9396 (바꿀 수 있음)
```
