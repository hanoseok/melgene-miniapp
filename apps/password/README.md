# apps/password — 비밀번호 생성기 (만들기)

한 화면 도구: 맨 위에서 **비밀번호 / 패스프레이즈**를 고른다. 비밀번호 = 길이 슬라이더(4~64, 기본 16) + 대문자·소문자·숫자·특수문자 스위치 + "헷갈리는 글자 빼기"(0 O 1 l I). 패스프레이즈 = 단어 수(3~8, 기본 5) + 구분 기호(하이픈·마침표·밑줄·띄어쓰기) + 첫 글자 대문자 + 숫자 넣기. 개수 = 1개 / 5개 한꺼번에. "만들기"를 누르면 값을 **먼저** 만들고 글자가 잠깐 뒤섞이다 멈춘다(움직임 줄이기면 바로). 결과마다 "복사" 버튼, 아래에 강도 막대(엔트로피 비트·등급·해킹 예상 시간·한 줄 조언).

- 난수: `crypto.getRandomValues` 32비트 + 거부 샘플링(`password-core.js` 의 `uniformInt` — 모듈로 치우침 없음). JS 기본 난수 함수는 쓰지 않는다.
- "고른 종류마다 1글자 이상": 합집합에서 길이만큼 고르게 뽑고, 빠진 종류가 있으면 **문자열을 통째로 다시** 뽑는다(부분 고치기는 분포를 치우치게 함) → 조건을 만족하는 문자열 전체에서 정확히 고르게.
- 엔트로피(진짜 값): 비밀번호 = log2(조건을 만족하는 문자열 수), 포함·배제로 정확히 계산(`log2Valid`, 검사에서 작은 경우 전수 세기와 비교). 패스프레이즈 = 단어 수 × log2(2048) = 11비트/단어 + 숫자 넣기면 log2(10 × 단어 수). 첫 글자 대문자는 엔트로피를 더하지 않는다.
- 단어 목록: `password-core.js` 안에 영어 단어 2048개(a-z 3~7자, 중복 없음, 알파벳순).
- 강도: <45 약함 · <60 보통 · <80 강함 · ≥80 아주 강함. 해킹 예상 시간 = 2^(bits-1) / 1e10 초(초당 100억 번 오프라인 공격의 평균), 초·분·시간·일·년(`Intl.NumberFormat` unit, 큰 수는 compact), 1초 미만 / 우주 나이(1.38e10년)보다 길면 문구.
- **보안·개인정보**: 만든 비밀번호는 화면(textContent)과 사용자가 누른 복사(클립보드)에만 있다. localStorage·쿠키·주소(#·?)·공유 문구·서버·통계 어디에도 넣지 않는다. 끝 화면 공유(setShareData)는 앱의 언어 없는 주소(`mgCleanUrl`) + 일반 문구뿐. 서버 숫자 없음.
- 기록: 만들기를 누를 때 `track('start')`, 결과가 다 보일 때 `track('done')`(다시 만들 때마다 또). 다시 하기(setRetry) = 같은 설정으로 새로 만들기.
- 따로 시작 화면이 없는 도구 앱(randnum·qr 과 같은 방식): 첫 화면 `#screen-pw` = h1(현지 검색어)·훅 → 설정 카드 → 만들기 → 결과(`#result`, 만든 뒤 보임: 결과 카드 → 공통 끝 화면 `data-mg-end="password"`) → 맨 끝 `mg-ad-start` 1자리. 결과가 보이면 `mg-ad-start` 는 숨긴다(한 화면 광고 1개).

주소: 원본은 자리표시자 `https://password.example.com/`, 배포 때 `https://melgene.com/password/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔑·카테고리 create·등록일 2026-10-13·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `password-core.js` | crypto 거부 샘플링, 옵션 정리(normalize), 글자 묶음, 비밀번호·패스프레이즈 생성, 정확한 엔트로피, 강도·해킹 시간, 단어 2048개 (UMD) |
| `password.js` | 한 화면: 종류·옵션 → 만들기 → 뒤섞임 연출 → 결과·복사 → 강도 → 끝 화면 |
| `style.css` | 민트 점무늬 종이 + 금고 철판 결과 카드 + 숲색·열쇠 금색 (Montserrat · ko Black Han Sans · ja M PLUS 1p · zh ZCOOL QingKe HuangYou · th Kanit, 비밀번호는 JetBrains Mono) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 금고 카드 + 제목 — 비밀번호처럼 보이는 문자열 없이 ●), 아이콘(열쇠) |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법·강한 비밀번호의 조건·패스프레이즈·엔트로피와 해킹 시간·비밀번호 관리자와 2단계 인증) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-password.js` | 로직·엔트로피(전수 세기 비교)·공정성(카이제곱 3종)·패스프레이즈·해킹 시간·언어 파일·360px 문구·생성 HTML·비밀번호 비저장/비공유 코드 규칙·OG 검사 |
| `tools/check-flow.js` | 실제 흐름 검사(Chrome headless + 정적 서버 + mock-supa): 첫 화면 → 만들기 → 끝 화면 순서 → 복사 → 패스프레이즈 5개 → 다시 하기, 주소·저장소·공유 링크에 비밀번호 없음, 넘침·단어 잘림·콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js password    # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/password)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-password.js
node tools/check-flow.js            # en,ko × 360,1440 (예: node tools/check-flow.js en,ja,ru,th 375)
```
