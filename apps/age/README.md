# apps/age — 만 나이 계산기 (만들기)

생년월일(연·월·일 선택 상자, 언어별 순서 ymd·mdy·dmy)과 선택 기준일(비우면 오늘)로 만 나이를 년·개월·일까지 계산하는 도구. 따로 시작 화면이 없는 한 화면 도구 앱(dday 처럼)이다.

- 결과: 만 나이(큰 숫자 + 년·개월·일, 태어난 요일) → **(ko 만)** 한국 나이 셈법 비교(만 나이·연 나이·세는 나이 + 2023-06-28 만 나이 통일 안내) → 다음 생일 D-n(당일이면 축하, 2/29 생이면 "평년엔 2/28" 안내) → 살아온 일·주·개월·시간 → 요일·별자리·띠 → 기념일(1만·2만·3만 일, 다음 10단위 생일, 지난 것은 "지났어요").
- 날짜 셈: **UTC 정오 일 번호**(`Date.UTC(y, m-1, d, 12)`)로 서머타임·시간대와 무관한 정수. 년·개월은 말일 맞춤(1/31 → 2/28 = 1개월). 2/29 생은 평년 2/28 이 생일(`BIRTHDAY_RULE = 'feb28'`). "오늘" 만 기기 로컬 날짜. 띠는 양력 출생 연도 기준(음력 설 경계는 가이드에서만 안내).
- 오류: 빈 칸 → noDate, 그 달에 없는 날 → badDate(일 상자가 그달 날수로 바뀌어 보통은 생기지 않음), 미래 생일 → future, 130살 초과 → tooOld, 기준일 1900~2199 밖 → badAsOf.
- 개인정보: 생년월일은 페이지 안에서만 계산 — 서버 전송·localStorage·주소(#·?) 어디에도 없다. **`#d=` 공유 링크는 만들지 않았다**(생년월일을 주소에 싣지 않기 위해). 공통 끝 화면 공유 = 깨끗한 주소(`mgCleanUrl`) + "지금까지 n일을 살았어요" 문구뿐.
- 기록: 한 판 = 계산하기를 처음 누른 순간 `track('start')` 1번 → 결과가 보이면 `track('done')` 1번. 입력 오류로 결과가 안 나오면 start 만 남고 고쳐서 누르면 같은 판의 done. 다시 하기(`setRetry`) = 입력 비우고 첫 화면.
- 화면: h1·훅 → 생년월일 → 기준일 → 계산하기 → (계산 뒤) 결과 카드들 → `data-mg-end="age"` → 맨 아래 `mg-ad-start`(결과가 보이면 숨김).
- 숫자: 서버 숫자 없음. 보이는 숫자는 모두 이 기기에서 계산한 날짜뿐.

주소: 원본은 자리표시자 `https://age.example.com/`, 배포 때 `https://melgene.com/age/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎂 · create · 2026-10-19 · order 1 · 12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `age-core.js` | 달력 날짜·UTC 정오 셈·윤년·월 더하기(말일 맞춤)·만 나이·다음 생일(2/29 규칙)·살아온 날·별자리·띠·한국 나이·기념일·오류 (UMD) |
| `age.js` | 한 화면 동작(선택 상자 채우기 — Intl 연·월·일 이름, th 불기 연도면 서기 병기 · 계산 · 결과 그리기 · 다시 하기 · 공유 데이터) |
| `style.css` | 크림 바탕 + 스프링클 점 + 초콜릿 잉크 + 딸기 분홍·민트·버터(생일 케이크), 숫자 Baloo 2 (en·fr·de·es·it·pt Fredoka · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr · vi Baloo 2 · ru Rubik) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 케이크 + "?" 카드 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일, 복수형은 언어별 범주, `korea` 블록은 ko 만 show) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(계산 원리 · 2/29 · 나라별 나이 셈법 — ko 만/연/세는 나이, ja 満年齢/数え年, zh 周岁/虚岁, vi tuổi mụ, th พ.ศ. · 기념일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-age.js` | 로직(윤년·말일·2/29·생일 전날/당일·다음 생일·별자리 경계 26개·띠·한국 나이·기념일·오류)·서머타임 5개 시간대(TZ)·언어 파일(키·복수형·360px 문구·FAQ·제목·korea=ko 만)·생성 HTML·사이트맵·OG·age.js 개인정보 규칙 |
| `tools/check-flow.js` | 실제 흐름(Chrome headless + 정적 서버 + mock-supa): 첫 화면 광고·넘침·문구, 빈 입력 오류, 1990-05-15 결과가 core 와 같음, 한국 나이 카드 ko 만, 2/29 안내, 미래 생일 오류, track 횟수, 끝 화면 순서, 공유 데이터에 생년월일 없음, 다시 하기, 콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 가이드 + 링크 검사
node tools/check-all.js age         # 이 앱 검사(check-age + check-flow) + 가이드 검사

# 이 앱만 (루트에서, gen-all 과 같은 순서)
(cd apps/age && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js)
node tools/gen-guides.js age && MG_I18N_MODE=variant node tools/gen-guides.js age
node apps/age/tools/gen-og.js all   # OG 이미지 (언어 지정: node apps/age/tools/gen-og.js ja ko)
(cd apps/age && node tools/check-age.js && node tools/check-flow.js)   # check-flow 예: node tools/check-flow.js ru,th 375 · SHOT=<폴더>
node tools/check-guides.js age
```
