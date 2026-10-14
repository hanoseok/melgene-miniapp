# apps/wordcount — 글자수 세기 (만들기)

한 화면 도구: 큰 입력 칸에 글을 쓰거나 붙여 넣으면 입력 칸 위 남색 막대(공백 포함·공백 제외·단어·바이트, 스크롤해도 따라옴)와 "자세한 숫자"(문장·문단·줄·읽는 시간·말하는 시간)가 실시간으로 바뀐다. 목표 글자수(끄기·500·1,000·1,500·직접 입력, "공백 포함" 스위치) → 진행 막대(90% 이상 주황, 넘으면 빨강 + "N자 초과"). 바이트 방식 3개(UTF-8 · 나이스 · 완성형 2바이트). 도구: 글 복사 · 공백 정리 · 줄바꿈 없애기 · 모두 지우기 · 되돌리기(15초, 한 단계). "자주 쓴 단어"(접이식, 2번 이상 쓴 단어 상위 5개·비율, 흔한 단어 제외). "결과 보기" → 요약 카드(+ 결과 복사) → 공통 끝 화면.

- 세는 법(`wordcount-core.js`, 가이드·FAQ 와 같은 정의): 줄바꿈 \r\n → \n, 줄바꿈 1개 = 1글자. 글자 = grapheme(Intl.Segmenter, 없으면 결합 문자·ZWJ·국기 쌍 근사) — 👨‍👩‍👧·é·🇰🇷·ที่ = 1. 공백 제외 = \s 전부 뺌. 단어 = Segmenter word(isWordLike), 띄어 쓰지 않고 붙은 조각(한자·가나·태국어 제외)은 합침(AI는·2026년·e-mail = 1). 문장 = Segmenter sentence + 영어 약어(Mr. Dr.) 이어 붙임. 문단 = 빈 줄로 나뉜 덩어리, 줄 = 비어 있지 않은 줄.
- 바이트: utf8 = UTF-8(줄바꿈 1) · neis = UTF-8 + 줄바꿈 2(나이스 학생부: 한글 3·영문 1·엔터 2) · legacy = 완성형 2바이트(ASCII 1, 나머지 코드 포인트 2, 줄바꿈 2 — EUC-KR·Shift_JIS·GBK 근사, 자소서용).
- 시간: 읽기 = 단어 238/분 + 한글 음절 500/분 + 한자·가나 500/분, 말하기 = 150 + 300 + 300.
- **개인정보**: 글은 이 기기 localStorage(`mg_wordcount_draft`, 400ms 디바운스)와 설정(`mg_wordcount_prefs`: 바이트 방식·목표·공백 포함)에만 — 모든 접근 try/catch. 주소·공유 문구·서버·통계에 글을 넣지 않는다(공유 = `mgCleanUrl` + 일반 문구). "모두 지우기"·다시 하기 = 초안 삭제. 화면에 "이 기기에만 저장" 안내.
- 기록: 처음 글을 쓸 때(지운 뒤 다시 쓸 때) `track('start')` 한 번, "결과 보기"에서 `track('done')` 한 번(같은 판에서 다시 눌러도 한 번). 불러온 초안으로 바로 결과를 보면 start → done. 다시 하기(setRetry) = 지우고 입력 칸에 초점.
- 따로 시작 화면이 없는 도구 앱(password·randnum 과 같은 방식): 첫 화면 `#screen-wc` = h1(현지 검색어)·훅 → 입력 카드 → 목표 → 자세한 숫자 → 자주 쓴 단어 → 결과 보기 → 결과(`#result`, 누른 뒤 보임: 요약 카드 → `data-mg-end="wordcount"`) → 맨 끝 `mg-ad-start` 1자리. 요약이 보이면 `mg-ad-start` 숨김, 지우면 다시 보임.

주소: 원본은 자리표시자 `https://wordcount.example.com/`, 배포 때 `https://melgene.com/wordcount/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 📝·카테고리 create·등록일 2026-10-15·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `wordcount-core.js` | grapheme·단어·문장·문단·줄·바이트 3방식·시간·키워드·목표 상태·설정 정리·공백 정리·줄 잇기 (UMD, Segmenter 없을 때 대체 로직) |
| `wordcount.js` | 한 화면: 입력 → 실시간 숫자 → 목표·바이트 방식 → 도구·되돌리기 → 키워드 → 결과 보기 → 끝 화면, 초안 저장 |
| `style.css` | 크림색 원고지(주황 칸 선) + 남색 잉크 + 빨간 교정펜 + 형광펜 노랑, 줄 노트 입력 칸 (Montserrat · ko Do Hyeon · ja M PLUS 1p · zh ZCOOL QingKe HuangYou · th Kanit, 숫자는 JetBrains Mono) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 줄 노트 카드 + 언어별 막대 라벨 — 가짜 숫자 없음), 아이콘(메모지 + 빨간 +) |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법·숫자 정의·Word/사이트와 다른 이유·자소서·나이스/原稿用紙/SNS 한도·한도에 맞추는 요령) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-wordcount.js` | 로직(Segmenter + 대체 로직: 이모지·한중일·태국어·한국어 어절·바이트 3방식·시간·키워드·목표·정리)·언어 파일·360px 문구·생성 HTML·글 비공유/주소 미사용 코드 규칙·OG 검사 |
| `tools/check-flow.js` | 실제 흐름 검사(Chrome headless + 정적 서버 + mock-supa): 입력 → 숫자 = core, 목표·넘침, 나이스 바이트, 새로고침 초안·설정, 정리/되돌리기, 결과 보기·끝 화면 순서, 글 누출 없음, 다시 하기, track 횟수, 넘침·단어 잘림·콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js wordcount   # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/wordcount)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-wordcount.js
node tools/check-flow.js            # en,ko × 360,1440 (예: node tools/check-flow.js ja,th,ru 375)
```
