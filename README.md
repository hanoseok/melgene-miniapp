# Trend Web Challenge — Melgene Apps (멜진 미니앱)

광고 수익형 미니앱 모음. 소스 저장소 **github.com/hanoseok/melgene-miniapp** (`main`) — 미니앱마다 `apps/<id>/` 모듈 하나. **작업 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`** (스포일러 금지, 시작 화면 티징만, 공통 끝 화면, 12개 언어, SEO, 광고, 진짜 숫자만) — 앱을 만들거나 고치기 전에 먼저 읽는다.

- 주소: 포털 **https://miniapp.melgene.com/** (melgene.com 에도 같은 포털, canonical 은 miniapp), 미니앱은 **`https://miniapp.melgene.com/<앱>/`**. 예전 `<앱>.melgene.com` 은 경로·쿼리·해시를 유지한 채 새 주소로 넘어간다. 원본은 `https://<앱>.example.com`·`https://example.com` 자리표시자를 쓰고 `deploy-prep.sh` 가 `dist/` 에서만 실제 주소로 바꾼다.
- 호스팅: GitHub Pages (github.com/hanoseok) — `melgene-miniapp` 의 **`gh-pages` 브랜치**=miniapp.melgene.com(포털 + 모든 앱, deploy.env `REPO_miniapp=melgene-miniapp`; 전환 전에는 예전 저장소 `miniapp` 의 main), `today-test`=melgene.com, `life-story`/`past-life`/`ladder`=예전 서브도메인 리다이렉트. DNS 는 Spaceship.
- 백엔드: Supabase 프로젝트 `melgene` (접속 정보는 로컬 전용 deploy.local.env — 저장소에 두지 않음). 사이트에는 publishable 키만. 함수: 공유 링크(`create_share`/`get_share`), 하루 통계(`bump_stat` → `ad_report` 뷰), 별점(`rate_app`), 플레이·하트(`play_app`/`heart_app`, 앱+IP 30초 중복 제외), 포털 요약(`app_summary`: 인기도 = 하트×10 + 별점 합 + 플레이), 밸런스 투표(`poll_vote`), 반응속도 분포(`submit_score`). 마이그레이션은 `supabase/migrations/`. 로컬 테스트는 운영 DB 대신 `node tools/mock-supa.js <포트>` + `localStorage.mg_supa_url`.
- 광고: AdSense 게시자 `ca-pub-6807370217216401`(deploy.env `ADSENSE_CLIENT`) — 모든 페이지 `<head>` 자동 광고 코드 + 도메인 루트 `ads.txt`, 화면마다 최대 1개의 `<div class="mg-ad">`(slot 5952905456, 보일 때 불러오고 안 채워지면 자리째 숨김). 광고 자리를 미리 잡지 않는다. 사이트 `melgene.com` 은 AdSense 검토 중(2026-09-27).
- 검색: Search Console `https://miniapp.melgene.com/` (HTML 파일 인증 — deploy.env `GSC_FILES_miniapp`, 지우지 말 것), 사이트맵 색인 `https://miniapp.melgene.com/sitemap-index.xml` 제출. melgene.com 도메인 속성은 DNS TXT 대기.

## 구조

```text
Trend Web Chalenge/
├── README.md / LOG.md       설명 / 실행 기록 (매 실행마다 추가)
├── package.json             npm run gen | check | build | deploy (의존성 없음, node 만)
├── .claude/skills/          melgene-miniapp(앱·포털 규칙) / melgene-ops(배포·운영)
├── shared/                  모든 앱 공통 (site.config.js, i18n.js, common.js, supa.js, base.css)
│                            site.config.js 의 SITES 는 apps/*/app.config.js 에서 생성된다
├── tools/                   공통 도구 (gen-all.js, gen-sites.js, check-all.js, check-links.js, live-check.js, mock-supa.js, lib/) — 배포 안 됨
├── supabase/migrations/     DB 함수·테이블
├── deploy-prep.sh / deploy.sh / deploy.env
└── apps/                    모듈 하나 = 폴더 하나 (app.config.js · README.md · tools/ · shared → ../../shared)
    ├── hub/        포털 (오늘의 미니앱 + 모든 미니앱 아이콘 + 자주 묻는 질문) — app.config.js 없음
    ├── life/       내 인생 애니메이션 (만들기)
    ├── past-life/  전생 테스트 (심리테스트)
    ├── balance/    밸런스 게임 (심리테스트)
    ├── monster/    할로윈 몬스터 테스트 (심리테스트)
    ├── pumpkin/    할로윈 호박 꾸미기·잭오랜턴 만들기 (만들기)
    ├── food-cup/   음식 월드컵·최애 음식 토너먼트 (투표)
    ├── ladder/     사다리타기 (게임)
    ├── reaction/   반응속도 테스트 (게임)
    └── roulette/   돌림판 (게임)
```

각 `apps/<id>/`는 **빌드 없이 그대로 배포되는 정적 폴더이자 독립 모듈**이다: `app.config.js`(등록 정보: id·이모지·카테고리·등록일·같은 날 순서 `order`·12개 언어 제목/설명), `README.md`, 자기 `tools/`(i18n·gen·og·check), `shared` 심볼릭 링크. `shared/`는 배포 전에 각 앱 폴더로 복사한다(`./deploy-prep.sh`). `app.config.js`·`README.md`·`tools/` 는 배포되지 않는다.
**앱 추가 = `apps/<id>/` 폴더 하나(+ app.config.js)** — 중앙에서 고칠 곳이 없다. `tools/gen-sites.js`(gen-all 이 맨 먼저 부름)가 `apps/*/app.config.js` 를 모아 `shared/site.config.js` 의 `SITES`(생성 구역)를 다시 쓰고, gen-all·check-all·deploy-prep 은 `apps/*` 를 자동 탐색한다. deploy-prep 은 SITES 가 app.config.js 와 어긋나면 멈춘다.
HTML 페이지는 손으로 고치지 말고 `apps/<id>/tools/` 의 생성기로 만든다(아래 "다국어").

## 배포 (GitHub Pages)

```bash
./deploy.sh                    # 전체 (deploy-prep.sh 로 dist/ 를 만든 뒤 배포 단위마다 배포 브랜치로 강제 푸시)
./deploy.sh miniapp            # 한 단위만
DEPLOY_DRY_RUN=1 ./deploy.sh   # dist 만 만들고 어느 저장소·브랜치로 갈지만 보여 줌
```

- 배포 단위(`dist/UNITS`): `dist/miniapp`→miniapp.melgene.com(루트 = 포털, `/<앱>/` = 각 앱) → **hanoseok/melgene-miniapp 의 `gh-pages`**, `dist/hub`→melgene.com → today-test(main), `dist/legacy/<앱>`→예전 서브도메인 리다이렉트(main). 저장소 이름은 `deploy.env` 의 `REPO_*`.
- 배포 브랜치: `BRANCH_<단위>` → 없으면 저장소가 소스 저장소(`SOURCE_REPO=melgene-miniapp`)면 `gh-pages`, 아니면 `main`. **소스 저장소의 `main` 에는 절대 강제 푸시하지 않는다**(deploy.sh 가 멈춘다). 소스는 평소처럼 `git push origin main`.
- miniapp.melgene.com 전환(한 번): GitHub Pages 커스텀 도메인은 한 저장소에만 붙으므로 ① hanoseok/miniapp Settings → Pages 에서 커스텀 도메인 제거(또는 Pages 끄기) ② deploy.env `REPO_miniapp=melgene-miniapp` ③ `./deploy.sh miniapp` ④ hanoseok/melgene-miniapp Settings → Pages: Deploy from branch `gh-pages` / root, Custom domain `miniapp.melgene.com`, Enforce HTTPS.
- deploy-prep 이 하는 일: 자리표시자 주소 치환(남으면 실패), 모든 HTML `<head>` 에 AdSense 코드, 도메인 루트에 `ads.txt`·`robots.txt`(모든 사이트맵)·`sitemap-index.xml`·Search Console 인증 파일, `404.html`(예전 `/<앱>/en/…`→`/<앱>/…`, 모르는 주소 → 그 앱 첫 화면/포털, 쿼리·해시 유지).
- 회사 프록시로 GitHub HTTPS/API 가 막히면 SSH 푸시로 대신한다(Pages 는 CNAME 파일로 도메인 인식).
- 배포 전: `npm run gen` (= `node tools/gen-all.js`) + `npm run check` (= `node tools/check-all.js`, 모든 `apps/*/tools/check-*.js`) + `npm run build` (deploy-prep + `node tools/check-links.js dist`).

- **Supabase 접속 정보는 저장소에 두지 않는다.** 소스의 `shared/site.config.js` 는 `SUPABASE_URL`/`SUPABASE_ANON_KEY` 가 빈 값이고, 배포 때 deploy-prep 이 로컬 전용 `deploy.local.env`(.gitignore)의 공개용 값(Project URL + publishable 키)을 배포본에만 넣는다. 파일이 없거나 secret/service_role 키면 배포가 멈춘다. 로컬 테스트는 `tools/mock-supa.js` + `localStorage.mg_supa_url`(키 없이 동작).

## 통계 확인 (광고 · 유입 · 나라)

Supabase 대시보드 → 프로젝트 `melgene` → **SQL Editor** 에서 조회한다. 공개 키로는 못 읽는다.

| 보고 싶은 것 | 쿼리 |
|---|---|
| 광고 채움률 (날짜·앱별 조회수, 광고 채움/비움, 채움률 %) | `select * from ad_report;` |
| 유입 경로 (검색·Google·Naver·기타 검색·SNS·직접·기타 사이트) | `select * from traffic_report;` |
| 나라별 최근 30일 (조회, 검색 유입, SNS 유입, 비율 %) | `select * from geo_summary;` |
| 날짜·앱·나라별 | `select * from geo_report;` |
| 날짜·앱·나라별 시작/완료 (시작 수, 끝까지 한 수, 완료율 %) | `select * from play_report;` |
| 앱×나라별 최근 30일 시작/완료 | `select * from play_summary;` |
| 지역(대륙)별 최근 30일 | `select region, sum(pageviews_30d) from geo_summary group by 1 order by 2 desc;` |
| 앱별 참여·별점·하트·인기도 | `select * from app_summary();` |

- 유입 경로: `common.js` 가 밖에서 들어온 첫 페이지의 referrer 를 분류만 해서 `in_search_<엔진>` / `in_social_<서비스>` / `in_direct` / `in_other` 로 +1 (주소는 저장 안 함). 카카오톡·인스타 앱 안 브라우저는 referrer 가 없어 direct 로 잡히는 경우가 많다.
- 나라: Supabase 앞단(Cloudflare)의 `cf-ipcountry` 국가 코드만 `daily_geo` 에 센다(IP 저장 안 함). 도시·시군구 단위는 없다. 나라 이름·지역은 `country_names` 표.
- 시작/완료: 모든 앱이 한 판이 시작될 때 `track('start')`, 끝(결과)에 닿을 때 `track('done')` 을 한 번씩 보낸다 → `bump_stat` 이 `daily_geo` 에 kind `start`/`done` 으로 나라별 +1.
- Google 검색어·노출·클릭·나라별 검색: **Search Console → 실적** (https://search.google.com/search-console/performance/search-analytics?resource_id=https%3A%2F%2Fminiapp.melgene.com%2F) — 등록 후 2~3일부터 쌓인다.
- 광고 수익·나라별 수익: AdSense → 보고서.

## 커스텀 도메인 연결 (melgene.com)

1. 도메인을 산다 (Spaceship 또는 Cloudflare 권장 — 5년 총액이 가장 싸다. 2026-09-26 비교는 LOG.md 참고).
2. 도메인 DNS에 아래 레코드를 넣는다.

   | 유형 | 이름 | 값 |
   |---|---|---|
   | A | `@` | `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153` (4개) |
   | CNAME | `www` | `hanoseok.github.io` |
   | CNAME | `past-life` | `hanoseok.github.io` |
   | CNAME | `ladder` | `hanoseok.github.io` |
   | CNAME | `life` | `hanoseok.github.io` |

   새 사이트를 추가할 때마다 `<사이트>` CNAME을 하나씩 추가한다.
3. `./switch-domain.sh melgene.com` — DNS 레코드가 모두 맞을 때만 `deploy.env`의 `CUSTOM_DOMAIN`을 바꾸고 `./deploy.sh`를 돌린다(아니면 빠진 레코드를 알려주고 멈춘다). 각 저장소에 CNAME 파일이 들어가고 Pages 설정에 커스텀 도메인이 등록된다.
4. DNS가 퍼지면(수 분~수 시간) GitHub가 HTTPS 인증서를 자동 발급한다. 그 뒤 각 저장소 Settings → Pages에서 "Enforce HTTPS"를 켠다.
5. DNS를 넣기 전에 3번을 하면 github.io 주소가 아직 없는 도메인으로 리다이렉트되어 사이트가 끊긴다. 순서를 지킨다.

AdSense는 루트 도메인(`melgene.com`)으로 신청한다. 승인되면 서브도메인에도 그대로 적용된다. 각 사이트 루트에 `ads.txt`가 있어야 한다.

## 사이트 목록

| 앱 | 폴더 | 내용 | 검사 |
|---|---|---|---|
| 포털 | apps/hub | 오늘의 미니앱 캐러셀 → 광고 → 모든 미니앱(카테고리 칩·검색·인기순) → 자주 묻는 질문 | `check-hub.js` |
| life | apps/life | 출생 연도 + 장면 → 한 획씩 그려지는 1분 흑백 만화 애니메이션, 영상 저장, `?s=` 짧은 링크 | `check-life.js` |
| past-life | apps/past-life | 12문항 → 결과 16종(결과별 공유 페이지 r/<id>.html) | `check-reach.js` |
| balance | apps/balance | 5팩×12문제 + 랜덤, 실제 선택률, 친구 비교 링크 | `check-balance.js`, `check-fit.js` |
| ladder | apps/ladder | 2~10명 사다리, 시드 공유 링크 | `check-ladder.js` |
| reaction | apps/reaction | 5라운드 반응속도, 실제 분포로 상위 % | `check-reaction.js` |
| roulette | apps/roulette | 2~16항목 가중치 돌림판, 공유 링크 | `check-roulette.js` |
| monster | apps/monster | 할로윈 몬스터 테스트: 10문항 → 결과 12종(결과별 공유 페이지 r/<id>.html, 같은 결과 비율은 poll 실제 값) | `check-monster.js`, `check-flow.js` |
| pumpkin | apps/pumpkin | 할로윈 호박 꾸미기: 모양·색·눈·코·입·꼭지·장식 + 촛불·밤하늘 → 완성 잭오랜턴, 이미지 저장(PNG), `#d=` 공유 링크 | `check-pumpkin.js` (+ `flow-test.js`) |
| food-cup | apps/food-cup | 음식 월드컵: 음식 16개 시드 셔플 대진 → 16강·8강·4강·결승 15번 고르기 → 우승 음식 + 나의 4강, 대결별·우승 실제 선택률(poll `food-cup`, 합계 10/20 이상일 때만) | `check-food-cup.js` (+ `flow-test.js`) |

새 앱: `apps/<id>/` 폴더 = `app.config.js`(12개 언어 제목·설명, category, added — 14일간 NEW) + `README.md` + `tools/i18n/<12개 언어>.js` + `tools/gen-i18n.js`·`check-<id>.js`(자동 탐색됨) + `shared -> ../../shared`. 중앙 등록 없음. 절차는 `.claude/skills/melgene-miniapp/references/new-app.md`.

## 다국어 (i18n)

12개 언어: en(기본·x-default) · ja · zh · ko · fr · de · th · vi · es · it · pt(브라질 포르투갈어, og:locale pt_BR) · ru(러시아어, og:locale ru_RU, 메신저 공유는 Telegram).

**사람이 보는 주소에는 언어가 없다**(2026-09-28 사용자 결정): 언제나 `https://miniapp.melgene.com/<앱>/…`. 언어는 **쿠키 `mg_lang`(우선) → localStorage(`mg_lang`·`lang_pref`) → 지역 자동 판단 → en** 으로만 정한다.

- 생성물 세 가지(모두 `node tools/gen-all.js` 가 만든다 — 앱마다 생성기를 보통 한 번 + `MG_I18N_MODE=variant` 한 번):
  - `apps/<앱>/index.html` 등 = 언어 없는 주소(영어 내용).
  - `apps/<앱>/<lang>/…` = 검색엔진용 언어 폴더(hreflang·사이트맵·canonical). 사람이 열면 그 언어를 저장하고 언어 없는 주소로 넘어간다.
  - `apps/<앱>/_l/<lang>/…` = 사람에게 보여 줄 언어 사본(`noindex`, robots.txt `Disallow: /_l/`, 링크는 언어 없는 주소 기준).
- 모든 페이지 `<head>` 맨 앞의 언어 로더(`G.pageLoader`, `G.hreflangTags` 안): 언어 없는 주소에서 저장된 언어가 en 이 아니면 `_l/<lang>/<같은 페이지>` 를 받아 문서를 바꾼다(주소 그대로). `?lang=<코드>` = 저장하고 주소에서 지움. `#nolang` = 이번만 안 바꿈. 봇·크롤러·자동화 브라우저는 건드리지 않는다.
- 각 언어 페이지는 실제 정적 HTML: `<html lang>`, 현지 검색어로 시작하는 title(`검색어 | 브랜드`), 설명, og(+`og:locale`/alternate), canonical, hreflang 12개 + x-default, 앱은 `G.appLd`(WebApplication + BreadcrumbList). 사이트맵은 모든 언어 폴더 URL + `xhtml:link`.
- 맨 위 공통 타이틀 바(`G.topBar`): 왼쪽 "Melgene + 언어별 배지" → 포털 홈, 오른쪽 언어 `<select>`(값 = 언어 코드 → 쿠키·localStorage 저장 후 같은 주소 다시 열기).
- 쿠키 `mg_lang`: 1년, `SameSite=Lax`, https 면 `Secure`, melgene.com 아래면 `Domain=.melgene.com`(melgene.com·miniapp.melgene.com 공유). 쿠키와 localStorage 중 한쪽만 있으면 서로 채운다. 공유·복사 링크는 언제나 언어 없는 주소(`window.mgCleanUrl`).
- **고른 언어가 없으면 방문자 지역 → 언어**(`shared/common.js`, 언어 없는 en 페이지에서만): 판단한 언어를 저장하고 같은 주소를 다시 연다. 나라는 Supabase RPC `client_country()`(`cf-ipcountry`, 저장 안 함, sessionStorage `mg_cc` 캐시, 1.2초) → 없으면 브라우저 언어의 지역 → 없거나 매핑 없는 나라면 영어. 나라→언어 표는 common.js `COUNTRY_LANG` / 스킬 4번(RU·BY·KZ·KG → ru).
- 알고 쓰는 점: 링크 미리보기(OG)는 쿠키가 없는 스크래퍼가 읽어서 언어 없는 주소는 영어 미리보기. 검색으로 언어 폴더에 들어온 사람은 한 번 넘어간다. 예전 `/<앱>/en/…` 주소는 deploy-prep 의 404 페이지가 새 주소로 넘긴다.
- 브랜드: en "Melgene Apps", ko "멜진 미니앱", ja "メルジン ミニアプリ", zh "Melgene 小应用", 그 밖 "Melgene Apps" (`G.brandOf`).

### 파일 위치

| 무엇 | 어디 |
|---|---|
| 언어 목록·공통 UI 문자열(토스트, 별점·하트·공유·FAQ·다시 하기) | `shared/i18n.js` (`LOCALES`, `STRINGS`) |
| 포털·다른 미니앱 목록의 제목·설명·카테고리·등록일 | `apps/<id>/app.config.js` → (생성) `shared/site.config.js` 의 `SITES[]` |
| 사이트별 문구(페이지, 결과, FAQ, 개인정보처리방침) | `apps/<site>/tools/i18n/<lang>.js` |
| 생성기 공통 헬퍼(hreflang, 상대 링크, sitemap, topBar, appLd, brandOf) | `tools/lib/i18n-gen.js` |
| OG 이미지 스크린샷(Chrome headless) | `tools/lib/og-shot.js`, `apps/<site>/tools/gen-og.js` |

### 다시 생성 / 검증

```bash
node tools/gen-all.js            # SITES(app.config.js) + 모든 앱 HTML + sitemap 재생성 → 링크 검사
node tools/gen-all.js --og       # + OG 이미지 재생성 (Chrome)
node tools/check-links.js        # apps/ 링크·hreflang·자리표시자 검사 (배포 빌드: ... dist)
node tools/check-all.js [앱…]   # 모든(또는 지정) 앱의 apps/<앱>/tools/check-*.js (hub 는 --layout)
node tools/mock-supa.js 8799     # 로컬용 가짜 Supabase (운영 DB 대신)
```

### 언어 추가하는 법 (예: id)

1. `shared/i18n.js` — `LOCALES` 에 `{ code: 'id', dir: 'id', label: 'Bahasa Indonesia', name: 'Bahasa Indonesia', ogLocale: 'id_ID' }`, `STRINGS.id` 추가.
2. 각 `apps/<앱>/app.config.js` — `title.id`, `desc.id` 추가 (gen-sites 가 빠진 언어를 알려 준다).
3. 사이트마다 `apps/<앱>/tools/i18n/id.js` 를 `en.js` 와 같은 키 구조로 만든다(OG 이미지 `og/id/`, 포털 `hub-core.js` 줄임 표기 `FORMATS`, `check-hub.js` 기대값, ladder·life 처럼 CSS 에 언어 목록이 있는 곳도). 직역 말고 현지 검색어·예시로(스킬 7번). 글꼴이 없는 문자는 사이트 CSS 의 언어별 글꼴 변수로.
4. `node tools/gen-all.js --og` → 앱별 check → `./deploy.sh`.

hreflang, 사이트맵, 언어 선택, 지역 자동 이동, 404 언어 폴더는 `LOCALES` 를 읽어 자동으로 늘어난다. 나라→언어 매핑은 `shared/common.js` 의 `COUNTRY_LANG` 에 추가한다. 번역 전에는 `en.js` 사본에 첫 줄 `// TODO-TRANSLATE` 를 두면 생성기는 돌고 check 스크립트는 그 언어 문구 문제를 (참고)로만 알린다.

## 내 인생 애니메이션 (apps/life)

영상/이미지 모델 없이 **모든 프레임을 캔버스에 코드로 그리는** 1분 인생 만화. 원본 바이럴 영상(흑백 펜 드로잉이 한 획씩 그려지는 그래픽노블)의 룩을 따른다.

| 파일 | 역할 |
|---|---|
| `life-core.js` | 언어 무관 로직(UMD): 장면 카탈로그(id·단계·보통 나이), 입력 정규화, `#d=` 공유 인코딩(UTF-8 base64url), 연도 보간(비운 연도 = 출생+보통 나이, 지금 나이를 넘으면 인생 후반부로 압축), 장면 계획(자막·길이·시드) |
| `life-engine.js` | 렌더러(UMD): 흔들리는 펜 획(필압 테이퍼 리본, 연필 겹선, 만년필 펜촉 각도), 드라이 브러시 띠, 해칭, 1~3컷 패널 배치, 캡션 박스·말풍선, 페이지 넘김/먹 띠 전환, 성장 라인업 엔딩. 좌표는 1080×1920(랜딩은 1080×1440) 고정 → 기기·해상도가 달라도 같은 입력이면 같은 그림 |
| `life.js` | 앱: 입력(출생 연도·달·이름, 장면 칩, 나만의 장면, 연표, 펜 4종) → 재생(일시정지/처음부터/천천히) → 끝 카드(영상 저장·링크 공유·다시 보기·고치기), 받은 링크면 "나도 내 인생 만들기" |
| `tools/i18n/<9개 언어>.js` | 모든 문구. 군대(ko·th·vi)·高考·Abitur 처럼 언어별 칩은 `life-core.js` 의 `langs` |

- 영상 저장: `canvas.captureStream(30)` + `MediaRecorder`, mp4(avc1) 우선·안 되면 webm. 데스크톱 1080×1920 4.5Mbps, 모바일/느린 기기 720×1280 2.8Mbps. 실시간 녹화라 영상 길이만큼 걸린다(화면이 가려지면 일시정지). 마지막 프레임에 `life.<SITE_CONFIG.ROOT_DOMAIN>` 워터마크(github.io 배포면 현재 주소).
- 성능: 완성된 획은 페이지 레이어에 구워 두고 그리는 중인 획만 매 프레임 다시 그린다. 프레임 간격이 20ms를 넘는 상태가 이어지면 연필 겹선·털끝 수를 줄인다(적응형 품질). `prefers-reduced-motion`이면 랜딩은 정지 화면, 재생은 0.6배속·카메라 흔들림 없음.
- 디버그용 읽기 전용 핸들 `window.LIFE_APP` (`film.seek(t)`, `film.stats()`, `lastVideo`) — 검증 스크립트가 쓴다.
