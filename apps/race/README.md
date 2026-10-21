# apps/race — 동물 달리기 시합 (투표)

이름을 넣으면 동물이 한 레인씩 맡아 달리는 랜덤 뽑기 레이스. “1등이 승리” 또는 “꼴찌가 쏘기(커피 사기)”. 시작 화면(설정) → 경주 화면(카운트다운 → 달리기 → 결과 + 최근 기록 + 공통 끝 화면).

- 시작 화면 `#screen-setup`: h1(현지 검색어)·훅 → 모드(🏆 1등이 승리 기본 / ☕ 꼴찌가 쏘기) → 인원 2~10(기본 4, − / +) → 레인별 이름 칸(2열, 동물 이모지 + 입력, 빈 칸은 언어별 기본 이름 “Player 3”·“참가자 3”, 같은 이름은 " 2") → “출발” → 공정성 한 줄 → 맨 끝 `mg-ad-start` 1자리.
- 경주 화면 `#screen-race`(처음 hidden, 광고 자리 없음): 모드 안내 → 트랙(레인마다 왼쪽 이름 칸 = 출발선, 체크무늬 결승선, 10명도 360px 에 들어가게 레인 높이 52→32px) → 3·2·1·GO 카운트다운(0.65초씩) → 달리기(rAF + translateX, 질주 💨·비틀거림·선두 레인 밝게, 도착하면 🥇🥈🥉/등수) → `#result`: 결과 카드(1등 또는 꼴찌 이름, 도착 순서 전체, 승부 자리 강조, “이름 바꾸기”·“이 이름으로 링크 복사”) → 최근 경기 10개(이 기기, “지우기”) → `data-mg-end="race"`.
- **순위를 먼저 정한다**: 출발 순간 `crypto.getRandomValues` 거부 샘플링 + Fisher–Yates 로 도착 순서 전체(`finishOrder`). 그다음 `planRace` 가 연출을 짠다 — 1등 6.0~7.6초, 전체 9초 이내, 승부 자리(win: 1·2등 / lose: 꼴찌·그 앞) 0.03~0.1초 차, 나머지 0.09~0.34초 차. 레인마다 속도 곡선(흐름 5종 + 구간 8개, 질주·비틀거림) → 위치 = 속도 적분 / 전체 거리라 각 레인이 자기 도착 시각에 정확히 결승선에 닿는다(화면 속 도착 순서 = 정한 순서, 선두 바뀜 ~90%). 동물·레인·모드는 확률과 무관.
- 움직임 줄이기면 카운트다운·달리기 없이 바로 결승 장면 + 결과(0.3초). rAF 가 멈춰도(숨은 탭) 결승 시각 + 1.5초 뒤 반드시 끝낸다.
- 공유: 끝 화면 공통 공유(setShareData)는 깨끗한 앱 주소. “이 이름으로 링크 복사” = `#d=<UTF-8 base64url(JSON {v:1,m:[이름 칸, 빈 칸 ''],o:'w'|'l'})>` — 결과는 담지 않는다. 받은 사람은 이름이 채워진 시작 화면(안내 문구)을 보고 직접 달린다(start/done 은 달릴 때만). 잘못된 링크는 안내만.
- 저장: 마지막 설정 `mg_race_v1`(모드·인원·이름 칸), 최근 결과 `mg_race_hist_v1`(10개, 읽을 때 `sanitizeHistory`) — localStorage, 모든 접근 try/catch. 서버로 보내지 않는다. 서버 숫자 없음.
- 기록: 출발할 때마다 `track('start')`, 결과가 보일 때 `track('done')`. 다시 하기(setRetry) = “한 번 더 달리기”(같은 이름).

주소: 원본은 자리표시자 `https://race.example.com/`, 배포 때 `https://melgene.com/race/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🏁·카테고리 vote·등록일 2026-10-22·order 2·12개 언어 제목/설명) |
| `race-core.js` | crypto 거부 샘플링·Fisher–Yates·도착 순서, 이름 정리(resolveNames/validate), 연출 계획(planRace/positionAt/fxAt/leaderAt), 기록, `#d=` 인코딩/디코딩 (UMD) |
| `race.js` | 설정 → 순위 먼저 → 카운트다운 → rAF 달리기 → 결과·기록 → 끝 화면, `#d=` 이름 불러오기 |
| `style.css` | 줄무늬 잔디 바탕, 흙색 트랙·흰 점선 레인·체크무늬 결승선, 노랑·빨강 포인트 (Baloo 2 · ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mitr · ru Rubik · vi 본문 Be Vietnam Pro) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 트랙 위 동물 5마리), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(쓰는 법·공정한 이유·회사/모임 아이디어·제비뽑기 역사·팁) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-race.js` | 로직·공정성(카이제곱: 2~10명 1등/꼴찌, 4명 순서 24가지, 레인별 등수, 흐름)·연출 계획(단조·도착 순서·시간·접전·선두 바뀜)·이름·기록·`#d=`·언어 파일·360px 문구·생성 HTML·OG 검사 |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js             # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js race      # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/race)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-race.js
node tools/flow-test.js en,ko,ja 360,1440
```
