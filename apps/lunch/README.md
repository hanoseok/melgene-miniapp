# apps/lunch — 오늘 뭐 먹지 메뉴 뽑기 (투표)

아침·점심·저녁·야식 중 하나와 기분 태그(든든한·가벼운·매운·혼밥, 여러 개 가능 = 하나라도 맞으면 후보)를 고르고 "슬롯 돌리기"를 누르면 약 2초 동안 세로 릴이 돌다가 한 메뉴에서 멈추고(움직임 줄이기면 바로), 결과 화면에 **뽑힌 메뉴 하나**만 나온다. 후보 목록을 모아 보여 주지 않는다(고르기 화면에는 후보 개수만).

- 메뉴: 언어마다 그 나라 사람이 실제 먹는 음식 30개 이상(`tools/i18n/<lang>.js` 의 `menus`, 문자열 `이름|이모지|끼니|기분`. 끼니 b 아침·l 점심·d 저녁·n 야식, 기분 h 든든·l 가벼운·s 매운·o 혼밥). 끼니마다 충분한 수 + 끼니 × 기분마다 1개 이상 → 한 가지 기분만 골라도 후보가 비지 않는다(check 가 확인).
- 공정성: `crypto.getRandomValues` 거부 샘플링으로 후보 중 하나를 **먼저** 뽑고, 릴은 그곳에 멈추는 연출. 모든 후보가 같은 확률.
- 결과 화면: 다시 뽑기 · 이거 제외(후보에서 빼고 바로 새로 뽑기, 이 페이지를 연 동안만) · 조건 바꾸기 → 공통 끝 화면(`data-mg-end="lunch"`). 후보를 모두 제외하면 고르기 화면에 안내 + "다시 넣기".
- 숫자: 서버 숫자 없음(보이는 숫자는 후보·제외 개수뿐). 기록 = 뽑기 누를 때 `track('start')`, 결과가 보일 때 `track('done')`(다시 뽑기·제외 뒤 새 판마다 또).
- 저장: 마지막 끼니·기분 태그만 localStorage `lunch_last_v1`. 처음 열면 현지 시각으로 끼니 기본값(5~9시 아침 · 10~14 점심 · 15~20 저녁 · 그 밖 야식).
- 광고: 시작 화면 맨 아래 `mg-ad-start` 1자리 + 고르기 화면 뽑기 버튼 아래 `mg-ad` 1자리 + 끝 화면 공통 컴포넌트.

주소: 원본은 자리표시자 `https://lunch.example.com/`, 배포 때 `https://miniapp.melgene.com/lunch/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🍽️·카테고리 vote·등록일 2026-10-03·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `lunch-core.js` | 메뉴 문자열 읽기, 후보(끼니·기분·제외), crypto 뽑기, 릴 띠 만들기, 시각별 기본 끼니 (UMD) |
| `lunch.js` | 시작(티징) → 고르기 + 슬롯 릴 → 결과 |
| `style.css` | 크림 식탁보 + 진한 갈색 잉크 + 토마토 레드·머스터드 슬롯머신 (Nunito · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 슬롯머신 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 + 그 나라 메뉴 목록 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-lunch.js` | 로직·공정성(통계)·언어 파일(메뉴 30개 이상·끼니×기분 빈틈 없음)·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :8761 + mock-supa :8762, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js lunch        # 이 앱 검사만

# 이 폴더(apps/lunch)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-lunch.js
node tools/flow-test.js             # 기본 en,ko,ru × 360,1440 (+ 움직임 줄이기 한 번). 캡처: 세 번째 인자로 폴더
```
