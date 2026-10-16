# apps/dday — 디데이 계산기 (만들기)

목표일까지 D-day, 시작한 날부터 며칠째, 날짜 더하기 빼기를 한 화면에서 계산하고, 결과를 벽걸이 달력 카드로 보여 주는 도구. 따로 시작 화면이 없는 한 화면 도구 앱(yesno·wordcount 처럼)이다.

- 모드 3개(탭): **디데이**(목표일 → D-n · D-DAY · D+n, 실시간 남은/지난 일·시·분·초, 시간 선택) · **며칠째**(시작일 → n일째/지난 날수, "시작한 날을 1일로 세기" 스위치 — ko 만 기본 켬(100일 셈법), 년·개월·일·주, 다가오는 100·200·300·500·1000…일과 주년 6개) · **날짜 계산**(날짜 ± N일 → 날짜·요일, 오늘 기준 D-n).
- 빠른 선택: 할로윈·크리스마스·새해 첫날·밸런타인데이 — 날짜는 코드로 계산(오늘 포함 가장 가까운 그날, 가까운 순). 음력 명절·시험일은 넣지 않는다.
- 날짜 셈: 달력 날짜끼리 **UTC 정오 일 번호**(`Date.UTC(y, m-1, d, 12)`)로 비교 → 서머타임·시간대와 무관한 정수. 실시간 타이머만 로컬 시각(`new Date(y, m-1, d, hh, mm)`). 2/29 시작의 주년은 평년 2/28. 표기는 `Intl.DateTimeFormat`(timeZone UTC + 정오) · `Intl.PluralRules`(언어별 복수형 객체).
- 카드: 제목(40자) · 이모지 12개 · 색 5개(토마토·민트·포도·바다·먹색). **이미지 저장**(canvas 1080×1350 PNG) · **카드 링크 복사**(`#d=` = UTF-8 base64url JSON `{v,k,t,d,h?,e,c,o?,n?}`, 받는 쪽에서 모양·범위를 꼼꼼히 검사, 받은 사람 시간대에서 실시간으로 다시 셈) · **내 디데이에 저장**(이 기기 localStorage `mg_dday_saved` 최대 10개, 같은 것은 맨 위로, try/catch). 서버로 보내는 것은 없다.
- 공유 카드를 열면 배지 + 안내, 다시 하기 = "나도 디데이 만들기"(주소의 `#d=` 를 지우고 첫 화면으로). 깨진 링크는 오류 안내만.
- 기록: 계산하기(빠른 선택·저장 목록 열기 포함)마다 `track('start')` → 카드 → `track('done')`. 공유 카드 열기·이모지/색 바꾸기는 세지 않는다. 공통 끝 화면 공유는 깨끗한 주소 + 큰 숫자만(제목·날짜 없음).
- 화면: h1·훅 → 모드 탭 → 입력 카드 → 계산하기 → (있으면) 내 디데이 → (계산 뒤) 카드 → 버튼 3개 → 기념일 → `data-mg-end="dday"` → 맨 아래 `mg-ad-start`(결과가 보이면 숨김).
- 숫자: 서버 숫자 없음. 보이는 숫자는 모두 이 기기에서 계산한 날짜뿐.

주소: 원본은 자리표시자 `https://dday.example.com/`, 배포 때 `https://melgene.com/dday/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(📅 · create · 2026-10-17 · order 1 · 12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `dday-core.js` | 달력 날짜·UTC 정오 셈·윤년·월 더하기(말일 맞춤)·년개월일 차이·디데이/며칠째/기념일/빠른 선택/날짜 계산, 제목·날수 다듬기, `#d=` 인코딩/검증, 저장 목록 (UMD) |
| `dday.js` | 한 화면 동작(탭·라디오·빠른 선택·카드·1초 타이머·기념일·저장 목록·공유 링크·canvas 이미지) |
| `style.css` | 크림색 모눈종이 + 남색 잉크 + 토마토 포인트, 벽걸이 달력 카드(고리·색 띠), 숫자 Unbounded (en·fr·de·es·it·pt Bricolage Grotesque · ko Do Hyeon · ja M PLUS Rounded 1c · zh ZCOOL QingKe HuangYou · th Mitr · vi Be Vietnam Pro · ru Rubik) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 달력 "D-DAY" + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, 복수형은 언어별 범주) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` 가 guide.html 생성 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-dday.js` | 로직(윤년·일 번호 연속·요일·2024-02-29 ±365/366·서머타임 5개 시간대(뉴욕·베를린·로드하우·상파울루·서울)·D-DAY 경계·1일로 세기·기념일·년개월일·빠른 선택·#d= 왕복/변조 28종·저장 목록)·언어 파일(키·복수형 범주·360px 문구·FAQ·제목)·생성 HTML·OG 검사 |
| `tools/check-flow.js` | 실제 흐름(Chrome headless + 정적 서버 + mock-supa): 첫 화면 광고·넘침·버튼 문구·단어 잘림, D-10 실시간, 할로윈, 100일째, 날짜 계산, track 횟수, 저장/새로고침/열기/지우기, 공유 카드·나도 만들기, 깨진 링크, 끝 화면 순서, 콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 가이드 + 링크 검사
node tools/check-all.js dday        # 이 앱 검사(check-dday + check-flow) + 가이드 검사

# 이 폴더(apps/dday)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-dday.js
node tools/check-flow.js            # en,ko,ja × 360,1440 (예: node tools/check-flow.js ru,th 375 · SHOT=<폴더> 면 스크린샷)
```
