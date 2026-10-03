# apps/merge — 할로윈 수박게임 (게임)

수박 게임(Suika Game·スイカゲーム·合成大西瓜) 방식의 떨어뜨려 합치기 게임, 할로윈·가을 테마. 병 위에서 조준해(터치 끌기 · 마우스 · ←/→·A/D 키) 조각을 떨어뜨리고(손 떼기·클릭·Space/Enter/↓), 같은 조각 두 개가 닿으면 한 단계 큰 조각이 된다.
시작(티징 + 짧은 방법 3칸) → 게임(HUD 점수·최고·다음 조각 + 단계 사슬 + 병 캔버스, 광고 없음) → 끝 화면(점수 카드 → 공통 끝 화면).

- 조각 11단계: 캔디콘 → 사탕 → 막대사탕 → 밤 → 사과 → 버섯 → 박쥐 → 유령 → 수정 구슬 → 호박 → 잭오랜턴. 손에 오는 것은 0~4단계(작을수록 자주). 잭오랜턴 둘이 닿으면 둘 다 사라지고 66점.
- 점수: 단계 k를 만들면 k(k+1)/2 점. 시간 제한 없음. 조각 윗부분이 위쪽 점선 위에 2초 동안 계속 있으면 끝(막 떨어뜨렸거나 막 합쳐진 조각은 0.9초 동안 빼고 봄).
- 물리: 위치 기반(PBD) 원 물리 — 1/240초 작은 단계, 중력·겹침 풀기(질량 = r², 4회)·벽·바닥·반발·마찰·속도 한도. 같은 시드 + 같은 입력 = 같은 판.
- 탭을 떠나면 자동 일시정지(visibilitychange·pagehide), 일시정지 버튼·P/Esc. prefers-reduced-motion: 합치기 고리·파편·선 깜빡임·글자 이동·굴림 회전 끔.
- 최고 기록: localStorage `merge_best_v1`. 숫자는 진짜만: 끝날 때 `supa.submitScore('merge', round(score/10))` 한 번 → 돌아온 실제 분포로 상위 % (서버 없음·실패·비교할 다른 기록 없음이면 칸째 숨김).

주소: 원본은 자리표시자 `https://merge.example.com/`, 배포 때 `https://miniapp.melgene.com/merge/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎃·카테고리 game·등록일 2026-10-02·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `merge-core.js` | 병 400×600 논리 좌표, 단계 11개(**순서 바꾸지 않음**), 시드 난수(mulberry32), `aim`·`drop`·`step(state, dt)`(1/240초로 나눔), 합치기·점수·끝 조건, bucket·percentile (UMD) |
| `merge.js` | 화면·입력·캔버스(조각 스프라이트 미리 그림, dpr 최대 2.5)·HUD·단계 사슬·일시정지·끝 화면·점수 전송. 검사용 `window.MERGE_APP` |
| `style.css` | 마녀의 보랏빛 밤 + 호박 주황 + 슬라임 라임, 클래스 앞머리 `sk-`(공통 `mg-` 와 겹치지 않게) (제목 Lilita One / ru Rubik / vi Baloo 2 + Be Vietnam Pro / ko Jua / ja RocknRoll One / zh ZCOOL KuaiLe / th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, `tiers` = 조각 이름 11개) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-merge.js` | 로직(합치기·쌓임·잭오랜턴·끝 조건·재현·봇 28판: 끝남·NaN·벽 밖·겹침·점수 합·조각 수·실력)·bucket/백분위·언어 파일(키·자리표시자·FAQ·글꼴·제목·360px 폭)·생성 HTML(시작 화면 맨 끝 광고 1·그 밖 광고 0·FAQPage 없음·끝 화면 순서·공통 클래스 겹침)·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa 에 점수 분포를 심어 상위 % 확인, 빈 서버·움직임 줄이기 한 번씩, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js              # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js merge      # 이 앱 검사만

# 이 폴더(apps/merge)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all           # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-merge.js
node tools/flow-test.js            # 기본 en,ko,ru × 360,1440 (+ 빈 서버 · 움직임 줄이기 375). 캡처: 세 번째 인자로 폴더
                                   # 포트: MG_HTTP_PORT=8895 MG_MOCK_PORT=8896 MG_CDP_PORT=9399 (바꿀 수 있음)
```
