# apps/food-cup — 음식 월드컵 · 최애 음식 토너먼트 (투표)

이상형 월드컵 방식의 음식 버전. 음식 16개(모든 언어 같은 id, 이름은 그 나라에서 부르는 말)를 매 판 시드 셔플로 대진 → 16강(8경기) · 8강(4) · 4강(2) · 결승(1) = 15번 고르기 → 우승 음식 + 나의 4강 → 공통 끝 화면.

숫자는 진짜만: poll `food-cup` (`supa.vote` / `supa.pollResults`, 시작할 때 합계 한 번 받아 두고 투표는 보내기만).
- 대결 qid `m<lo>-<hi>`(두 음식 번호 작은 것부터, 120개), opt 0 = lo 승 · 1 = hi 승 → 고른 뒤 "N% 같은 선택"은 그 대결 합계 ≥ 10 일 때만.
- 우승 qid `c0`(번호 0~9, opt = 번호) / `c1`(10~15, opt = 번호-10) → "N%도 우승" 은 우승 합계 ≥ 20 일 때만, 아니면 "거의 처음으로 끝까지" 문구(숫자 없음). 서버가 꺼져 있으면 아무것도 안 보인다.
- 표시 %는 내 표를 넣기 전 합계(= 다른 사람들). 같은 브라우저는 같은 대결 한 번, 우승 한 번만 센다(localStorage `fc_votes_v1`).

주소: 원본은 자리표시자 `https://food-cup.example.com/`, 배포 때 `https://miniapp.melgene.com/food-cup/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🍽️·카테고리 vote·등록일·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `food-cup-core.js` | 음식 16개(id·이모지·접시 색, **순서 바꾸지 않음** — qid 번호), 시드 셔플(mulberry32), 대진 상태(불변), qid/opt 인코딩, 합계 → % (UMD) |
| `food-cup.js` | 시작(티징) → 경기(두 카드 + VS, 라운드·진행 막대, ←/→ 키) → 끝 화면(우승·나의 4강, 공유·다시 하기 = 새 대진) |
| `style.css` | 크림 체크 식탁보 + 토마토 빨강 + 머스터드, 두툼한 카드·어긋난 그림자 (제목 Unbounded · 이름 Oswald: 라틴 확장·베트남어·키릴 / ko Black Han Sans·Do Hyeon · ja Dela Gothic One · zh ZCOOL QingKe HuangYou · th Kanit) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 물음표 접시 — 음식은 안 보임), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 + 음식 이름 16개 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-food-cup.js` | 대진 로직·서버 인코딩·언어 파일(음식 이름 폭 포함)·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server + mock-supa 에 표를 심어 % 확인, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js food-cup     # 이 앱 검사만

# 이 폴더(apps/food-cup)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-food-cup.js
node tools/flow-test.js             # 기본 en,ko,th,ru × 360,375,1440 (+ 빈 서버 한 번). 캡처: 세 번째 인자로 폴더
```
