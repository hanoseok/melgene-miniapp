---
name: melgene-miniapp
description: Melgene Apps(멜진 미니앱) 미니앱·포털을 새로 만들거나 고칠 때 반드시 따르는 전체 규칙. 스포일러 금지, 시작 화면은 티징만(+맨 아래 광고 1개), FAQ는 끝 화면에만(포털 예외), 공통 끝 화면(data-mg-end)·타이틀 바, 모바일 480px, 12개 언어(언어 없는 주소 · 쿠키 > localStorage · 지역 자동 판단), 광고 위치, 진짜 숫자, SEO(현지 검색어), 포털 구성(오늘의 미니앱 짧게 → 모든 미니앱 → 광고 → FAQ), 새 앱 만드는 절차. apps/<앱>·apps/hub 를 만들거나 수정하는 모든 작업(에이전트 포함) 전에 읽는다. 배포·광고·통계·Search Console 은 melgene-ops.
---

# Melgene Apps 미니앱 규칙

`/Users/hanoseok/SynologyDrive/Home Drive/AGENTS/Trend Web Chalenge`(= GitHub `hanoseok/melgene-miniapp`, main) 의 모든 미니앱(apps/*)과 포털(apps/hub)에 적용한다. 미니앱 하나 = 모듈 하나 = `apps/<id>/` 폴더 하나(`app.config.js` 등록 정보 · `README.md` · 자기 `tools/` · `shared -> ../../shared`). 새 앱을 만들 때, 기존 앱을 고칠 때, 에이전트에게 맡길 때 모두 이 규칙을 먼저 지킨다(에이전트에게는 이 파일 경로를 알려 준다).

| 자세한 문서 | 언제 |
|---|---|
| [references/portal.md](references/portal.md) | 포털 화면 순서·오늘의 미니앱 카드 크기·포털 FAQ·정렬 |
| [references/new-app.md](references/new-app.md) | 새 미니앱을 처음부터 만들 때 (폴더·생성기·등록·언어별 글꼴 주의·검사) |
| [references/seo.md](references/seo.md) | 제목·설명·JSON-LD·현지 검색어 표·Search Console |
| `.claude/skills/melgene-ops/SKILL.md` | 배포·라이브 확인·광고(AdSense)·통계(Supabase)·DB 변경 |

## 0. 매일 새 앱 — 카테고리 순환

- 예약 실행(trend-web-chalenge)마다 **새 미니앱을 두 개** 만든다(예약 작업 지시 2026-09-30: "매 실행시마다 … 두개 씩 추가"; 기존 앱 고도화는 사용자가 따로 요청할 때만). 두 개는 순환의 연속 두 칸(예: game 다음 test) — 같은 날 `order: 1, 2`.
- 카테고리는 **game → test → create → vote → game …** 순서로 돌린다. 이번 카테고리 = `apps/*/app.config.js`(= 생성된 `shared/site.config.js` SITES) 에서 `added` 가 가장 최근인 앱(같은 날이면 `order` 가 큰 쪽 = SITES 목록에서 뒤쪽)의 카테고리 **다음 차례**. 예) 마지막이 monster(test, 2026-09-27) → 다음은 create.
- 그 카테고리 안에서 주제는 시기(계절·명절·이슈)와 검색 수요로 고른다. 이미 있는 앱과 겹치지 않게. 참고 사이트: poki, poomang, simsimtest, fcs-game.
- 만든 날 LOG.md 에 "카테고리 순환: <이번> → 다음 <다음>" 을 남긴다.

## 1. 재미를 떨어뜨리는 것은 절대 하지 않는다 (스포일러 금지)

- **질문·선택지·정답·결과 유형을 모아서 보여주지 않는다.** 밸런스 게임 질문 모음, 퀴즈 문제 목록, "결과 16종 한눈에 보기", 정답표 같은 페이지·섹션·목록을 만들지 않는다.
- 시작 전 화면(팩 설명, 소개 문구, 카드 부제, OG 이미지, 메타 설명)에 **실제 질문이나 결과를 인용하지 않는다.** 팩은 주제·분위기로만 설명한다. 예) "평생 여름 vs 평생 겨울" ✗ → "매일 부딪히는 사소한 고민들" ✓
- 끝 화면은 **그 사람의 결과만** 보여준다. 방금 푼 질문 전체 목록, "가장 팽팽했던 질문" 목록처럼 질문을 다시 모아 보여주는 것도 하지 않는다. (숫자 요약—예: 대세 일치율, 몇 문제 중 몇 개—은 괜찮다.)
- SEO 소개 글에도 질문·결과 목록을 넣지 않는다. 앱이 무엇인지, 어떻게 노는지만 쓴다.
- 결과 공유 페이지(예: past-life·monster r/<type>.html)는 그 결과 하나만 담는다. 다른 결과로 가는 목록·링크를 두지 않는다. 인연·악연(찰떡 단짝·티격태격 라이벌)처럼 결과의 일부인 한두 개는 **보여주기만** 한다 — 이름·그림은 보이되 절대 링크(`<a>`)로 만들지 않는다(누르면 다른 결과가 스포일러됨). hover·pointer 같은 누를 수 있어 보이는 모양도 없게. check 스크립트가 결과 페이지에 다른 결과 페이지로 가는 링크가 0개인지 본다.

## 2. 시작 화면은 티징만

- 앱 시작 화면에는 **앱에 대한 티징(한 줄 훅·짧은 소개·시작 버튼·시작에 필요한 입력)** 과, 어려운 게임인 경우에만 **짧은 게임 설명(방법)**, 그리고 **맨 아래 광고 1개**를 둔다. 그 밖에는 아무것도 보여주지 않는다.
- 시작 화면 광고(사용자 지시 2026-10-02, 예전 "시작 화면 광고 없음" 규칙을 대신함): 시작 화면 컨테이너의 **마지막 요소**로 `<div class="mg-ad mg-ad-start"></div>` 하나(시작 버튼·방법·입력 다음). 시작 화면이 보일 때만 보이고 플레이가 시작되면 화면째 사라진다. 따로 시작 화면이 없는 도구 앱(돌림판·사다리 등)은 첫 화면(입력 화면) 맨 아래에 둔다. JS 가 시작 화면을 만드는 앱은 거기에 넣고 `window.observeAd(el)`. 이미 같은 화면에 함께 보이는 `mg-ad` 가 있으면 하나 더 두지 않는다(맨 아래로 옮긴다).
- 시작 화면에 SEO 소개 글·"다른 테스트" 목록·FAQ·통계 목록을 두지 않는다. (SEO는 `<title>`, 메타 설명, OG, WebApplication JSON-LD 로만 한다. 숨긴 텍스트 금지.)
- 광고는 시작 화면 맨 아래 1개, 진행 중 화면(예: 퀴즈 중간)에 최대 1개, 그리고 끝 화면(공통 컴포넌트)에 둔다.

## 2-1. 자주 묻는 질문(FAQ)은 끝 화면에만

- FAQ는 **끝 화면의 공유 버튼 아래(다시 하기 위)** 에서만 접이식으로 보여준다. 첫 화면·소개 영역에 FAQ 섹션을 따로 두지 않는다.
- 생성기에서 `G.scriptJson('MG_FAQ', T.faq)`(항목 `{ q, a }`)로 넣으면 공통 끝 화면이 그린다. 3~5개, 짧게, **스포일러 금지**(질문·결과를 인용하지 않는다).
- 끝 화면은 처음엔 숨어 있으므로 **FAQPage JSON-LD 는 넣지 않는다**(WebApplication / WebSite / ItemList 는 괜찮다).
- **넣지 않는 질문**(포털 포함): "정말 무료인가요?" 류, "인기순·하트·별점은 어떻게 정해지나요?" 류 운영 설명. FAQ는 그 앱을 하는 데 필요한 질문만.

## 3. 공통 끝 화면 (모든 앱 동일)

끝 화면 순서는 고정이다:

1. 앱 결과 (앱마다 다름)
2. ★ 별점 + ♥ 하트
3. 광고
4. 공유: 링크 복사 · X · Instagram · TikTok · Facebook · 메신저(언어별: ko 카카오톡 / ja·th LINE / ru Telegram / 그 밖 WhatsApp)
5. 자주 묻는 질문 (접이식, `MG_FAQ`)
6. 다시 하기
7. 다른 미니앱 링크 — **무작위 5개만**(`renderMoreTests`, 사용자 지시 2026-10-04; 예전 최신순 전체 목록은 폐지)

구현: 결과 바로 아래에 `<div data-mg-end="<앱 id>"></div>` 하나만 둔다(`shared/common.js` 가 2~7을 그린다). 앱은 `window.setShareData({ title, text, url } | fn)` 과 `window.setRetry(fn | url | { label, action })` 만 등록한다. 앱 자체 공유 버튼·다시 하기 버튼·별점·다른 테스트 목록을 따로 만들지 않는다.

**시작/완료 기록(모든 앱 필수)**: 한 판이 실제로 시작될 때(사용자가 시작한 순간) `window.track('start')` 한 번, 그 판이 끝(결과) 화면에 닿을 때 `window.track('done')` 한 번. 다시 하기로 새 판이면 다시 한 번씩. 앱 고유 이벤트(balance_start 등)는 그대로 두고 이 둘을 더한다(통계: `play_report`·`play_summary`). 색은 CSS 변수(`--mg-end-retry-bg` 등)로만 맞춘다.

## 4. 화면·브랜드·언어

- **맨 위 타이틀 바**: 모든 앱 페이지의 제일 위에는 공통 `G.topBar(lang, rel)`(tools/lib/i18n-gen.js)를 둔다. 왼쪽 "Melgene + 배지"를 누르면 포털 홈(언어 없는 주소, 고른 언어로 보임)으로 가고, 오른쪽은 언어 선택 `<select>`. 앱 이름은 그 아래 앱 화면에서 보여준다. 앱마다 따로 헤더·언어 전환을 만들지 않는다.
- **모바일이 기본**: 데스크톱에서도 가운데 `--app-width`(480px) 한 줄 레이아웃. 여러 칸 데스크톱 레이아웃 금지. 고정 요소(모달·전체 화면)도 이 폭 안에.
- 브랜드: en "Melgene Apps", ko "멜진 미니앱", ja "メルジン ミニアプリ", zh "Melgene 小应用", 그 밖 "Melgene Apps". 워드마크 = "Melgene" + 언어별 배지. "오늘의 테스트" 금지.
- **12개 언어**: en(루트, 기본) · ja · zh · ko · fr · de · th · vi · es · it · pt(브라질 포르투갈어, og:locale pt_BR) · ru(러시아어, og:locale ru_RU — 게임·테스트는 «ты», 포털 FAQ·개인정보는 «вы», 따옴표 «», 복수형 one/few/many/other, 키릴 문자를 지원하는 글꼴만). 모든 문구는 `apps/<앱>/tools/i18n/<lang>.js` 에만 둔다(코드·템플릿에 문구 금지). 언어 전환은 공통 `<select>`. 번역은 직역이 아니라 그 나라 사람이 쓰는 말·예시로. 첫 줄이 `// TODO-TRANSLATE` 인 언어 파일은 en 사본(번역 대기) — check 스크립트가 그 언어의 문구 문제를 (참고)로만 알린다. 번역을 넣으면 그 줄을 지운다.
- **보이는 주소에 언어를 넣지 않는다**(사용자 지시 2026-09-28: "/ko /jp /en 처럼 path 에 넣지 말고, localStorage 와 쿠키에만 써, 쿠키가 더 우선순위야"): 사람이 보는 주소는 언제나 `https://miniapp.melgene.com/<앱>/…`(언어 없음). 언어 = **쿠키 `mg_lang` → (없으면) localStorage `mg_lang`·`lang_pref` → (없으면) 지역 자동 판단 → en**. 쿠키는 1년·`SameSite=Lax`·https 면 `Secure`·melgene.com 아래면 `Domain=.melgene.com`(melgene.com·miniapp 공유). 저장은 쿠키와 localStorage 둘 다, 읽을 때 한쪽만 있으면 서로 채운다.
- **어떻게 동작하나**(`tools/lib/i18n-gen.js` 의 `G.pageLoader(rel)` — `G.hreflangTags` 가 모든 페이지 `<head>` 맨 앞에 넣는다, 앱에서 할 일 없음): 언어 없는 주소(=en 페이지)에서 저장된 언어가 en 이 아니면 그 자리에서 숨은 언어 사본 `<앱>/_l/<lang>/<rel>` 을 받아 문서를 통째로 바꾼다(주소 그대로). 언어 폴더 주소(`/<앱>/ko/…`)나 `_l/…` 를 직접 열면 사람은 언어 없는 주소로 `location.replace`(쿼리·해시 유지, 저장된 언어가 없으면 그 폴더 언어를 저장). `?lang=<코드>` = 저장하고 주소에서 지운 뒤 적용. 언어 `<select>` 값 = 언어 코드 → 저장하고 같은 언어 없는 주소를 다시 연다. `#nolang` = 이번만 안 바꿈. 크롤러·자동화 브라우저(봇 UA·`HeadlessChrome`·`navigator.webdriver`)는 바꾸거나 옮기지 않는다. 공유·복사 링크는 언제나 언어 없는 주소(`window.mgCleanUrl`). 앱 코드에서 언어별 주소를 만들지 않는다 — 링크는 생성기의 상대 경로 그대로.
- **언어 폴더와 숨은 사본은 생성물**: `apps/<앱>/<lang>/…` = 검색엔진용(hreflang·사이트맵·canonical, 사람은 곧바로 언어 없는 주소로 넘어감). `apps/<앱>/_l/<lang>/…` = 사람에게 보여 줄 사본(`noindex`, canonical 은 폴더 주소, 링크는 언어 없는 주소 기준 상대 경로, robots.txt `Disallow: /_l/`·`/*/_l/`). `node tools/gen-all.js` 가 앱마다 생성기를 두 번 돌린다(보통 + `MG_I18N_MODE=variant`) — 생성기를 직접 돌릴 때도 둘 다. 링크 검사(`check-links.js`)가 사본의 noindex·짝 페이지를 확인한다.
- **고른 언어가 없으면 방문자 지역을 따른다**: 언어 없는 en 페이지에서만(`common.js`) 판단해서 그 언어를 저장하고 같은 주소를 다시 연다. 나라 = Supabase RPC `client_country()`(Cloudflare `cf-ipcountry`, 저장 안 함, sessionStorage `mg_cc` 캐시, 1.2초 제한) → 모르면 브라우저 언어의 지역(ko-KR → KR) → 그래도 모르거나 매핑 없는 나라면 영어 그대로. 매핑: KR ko · JP ja · CN TW HK MO SG zh · FR MC + 프랑스어권 아프리카 fr (BE·LU 는 브라우저가 de 면 de) · DE AT LI de (CH 는 브라우저가 fr/it 면 그 언어) · TH th · VN vi · 스페인어권 es · IT SM VA it · PT BR AO MZ CV GW ST TL pt · RU BY KZ KG ru. 로컬 headless 검사는 쿠키 `mg_lang`(또는 `lang_pref`)을 그 언어로 넣거나, `#nolang`, 또는 기본 headless UA(봇 판정 — 언어 폴더 주소가 그대로 보임)로 돌린다.
- 포털 카테고리: 게임 · 심리테스트 · 만들기 · 투표 (id: game · test · create · vote). 돌림판·사다리타기처럼 여럿 중 하나를 정하는 도구는 **투표(vote)**. 새 카테고리는 필요하면 더 만들어도 된다(사용자 지시 2026-10-03; 추가하면 12개 언어 이름·칩·check 를 함께 갱신).
- 새 앱 등록 = `apps/<id>/app.config.js`(12개 언어 제목·설명, category, added) — 중앙 파일은 고치지 않는다. `node tools/gen-all.js` 가 `tools/gen-sites.js` 로 `shared/site.config.js` 의 SITES(생성 구역, 손으로 고치지 않음)를 다시 쓴다. 등록 5일 동안 포털에 NEW 배지.

## 5. 숫자는 진짜만

- 참여 수·별점·하트·선택률·백분위는 **서버(Supabase)에서 온 실제 값만** 보여준다. 가짜·예시·자리표시 숫자 금지. 값이 없으면 숨기거나 "새로 나왔어요".
- 플레이 수 = 앱에 들어온 수, 하트 = 누를 때마다. 둘 다 **앱마다 같은 IP 는 30초 안에 다시 세지 않는다**(서버 판정). 인기도 = 하트×10 + 별점 합(1~5) + 플레이×1.
- 로컬 테스트는 운영 DB를 건드리지 않는다: `node tools/mock-supa.js <포트>` + `localStorage.mg_supa_url`.

## 6. 광고

- 광고 자리를 미리 잡지 않는다(빈 박스 금지). AdSense 자동 광고 + 화면마다 최대 1개의 `<div class="mg-ad"></div>`(광고 단위 slot `SITE_CONFIG.AD_SLOT_MID`). 광고가 없으면(unfilled) 자리째 숨는다.
- 위치: 앱은 **시작 화면 맨 아래 1개**(`<div class="mg-ad mg-ad-start"></div>`, 시작 화면 컨테이너의 마지막 요소 — 2번 절) + 진행 중 화면(퀴즈·질문 화면)에 최대 1개 + 끝 화면(공통 컴포넌트가 이미 포함). 한 화면에 동시에 보이는 광고는 1개. `shared/common.js` 의 `initInlineAds()` 가 모든 `.mg-ad` 를 지켜보다가 보일 때 광고를 넣고, `.mg-ad-start` 는 그려졌을 때만 위 간격(28px)이 생긴다(base.css). check 스크립트가 시작 화면 맨 끝 `mg-ad-start` 1개를 요구한다. **포털은 "모든 미니앱" 아래·FAQ 위에 1개.**
- 광고 코드(`<head>` 자동 광고 스크립트·계정 메타)와 ads.txt 는 배포 때 deploy-prep 이 넣는다 — 원본에 직접 넣지 않는다.

## 7. 검색(SEO) — 12개 언어로 Google 검색이 잘 되게

- `<title>` 은 **그 나라 사람이 실제로 검색하는 말**(예: 사다리타기 / あみだくじ / ladder game, 밸런스 게임 / 究極の選択 / would you rather, 전생 테스트 / 前世診断)을 앞에 두고 ` | ` + 브랜드(`G.brandOf(lang)`). 번역은 음차가 아니라 현지 검색어로.
- 메타 설명·OG 도 같은 검색어를 자연스럽게 한두 번. 무료·설치 없음·1분 같은 사실만.
- 페이지마다 보이는 `<h1>` 하나에 검색어를 담는다. 숨긴 텍스트·키워드 나열·시작 화면 SEO 글 금지(2번 규칙 그대로).
- 구조화 데이터: 앱은 `G.appLd(lang, { siteRoot, rel, name, description, category })`(WebApplication + BreadcrumbList). 별점(aggregateRating)·FAQPage 는 앱 페이지에 넣지 않는다.
- 모든 페이지 hreflang 12개 + x-default, 자기 canonical, og:locale(+alternate), `<html lang>`, 사이트맵(12개 언어 + lastmod). 검색엔진은 언어 폴더 주소(`/<앱>/ko/…`)를 언어별로 색인한다(봇은 옮기지 않음) — 검색으로 들어온 사람은 한 번 넘어가 언어 없는 주소에서 그 언어로 본다. 링크 미리보기(OG)는 쿠키가 없는 스크래퍼가 읽으므로 언어 없는 주소는 영어 미리보기.
- **포털은 예외**: 포털은 앱이 아니므로 맨 아래 "자주 묻는 질문"을 보이게 두고(소개 글은 따로 두지 않고 FAQ로 합친다) FAQPage + WebSite + ItemList JSON-LD 를 넣을 수 있다. 포털에 카테고리 설명 섹션·히어로 문구는 두지 않는다. 포털 순서: 타이틀 바 → 오늘의 미니앱(위아래 짧게: 카드 약 260px, 헤드라인·소개 각 2줄) → 모든 미니앱(카테고리 칩) → 광고 → 자주 묻는 질문. 자세한 건 references/portal.md.
- 현지 검색어 표·Search Console 은 references/seo.md.

## 8. 끝내기 전 확인

- `node tools/gen-all.js`(링크 검사 포함), `node tools/check-all.js`(모든 앱의 `tools/check-*.js`, 포털은 `--layout`), 360/375/1440 폭, en + 비라틴 언어 하나로 전체 흐름, 콘솔 오류 0.
- 이 문서의 1·2번(스포일러·FAQ)을 어긴 곳이 없는지 생성된 HTML에서 한 번 더 찾는다.
- 완성되면 바로 배포하고 알린다(melgene-ops). LOG.md 에 한 줄, 규칙이 바뀌었으면 이 스킬도 고친다.

## 9. 사용자가 정한 것 (바꾸지 않는다)

- 브랜드는 "Melgene Apps / 멜진 미니앱" 계열, "오늘의 테스트"·"Melgene MiniApp" 금지. 주소는 `https://miniapp.melgene.com/<앱>/` — 보이는 주소에 언어 경로 금지, 언어는 쿠키 > localStorage 에만(4번 절).
- 카테고리는 게임·심리테스트·만들기·투표(game·test·create·vote)만(새 카테고리는 더 만들어도 됨, 사용자 지시 2026-10-03). 돌림판·사다리류 = 투표. 새 앱은 NEW.
- 매일(예약 실행마다) 새 앱을 두 개 만들고, 카테고리를 순서대로 돌린다(0번 절).
- 하트·플레이 30초 중복 제외(앱+IP), 인기도 = 하트×10 + 별점 합 + 플레이.
- 끝 화면 7단 순서, 공유 6개(링크 복사·X·Instagram·TikTok·Facebook·언어별 메신저), 3×2 배치.
- FAQ 에 "정말 무료인가요?"·"인기순·하트·별점 계산" 류를 넣지 않는다.
- 사용자에게는 한국어로 말한다.

- 앱 이름(ko)은 짧게: `할로윈 수박게임` · `할로윈 코스튬 추천` · `할로윈 파티 초대장`처럼 "~ 테스트/~ 만들기/~ 머지" 군더더기를 뺀다(사용자 지시 2026-10-04).
