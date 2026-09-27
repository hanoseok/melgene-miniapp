---
name: melgene-ops
description: Melgene Apps(멜진 미니앱) 운영 절차 — 배포(deploy.sh, 배포 단위, 404 리다이렉트), 라이브 확인, 광고(AdSense 승인·ads.txt·자동 광고·mg-ad), 통계 확인(Supabase ad_report·traffic_report·geo_summary), Supabase DB 변경 절차, Search Console(사이트맵·색인 요청), 보안 규칙. "배포해", "광고 확인", "통계 어디서", "검색 유입", "나라별", "DB 바꿔" 같은 요청이나 매 예약 실행의 점검 때 읽는다. 앱·포털 화면 규칙은 melgene-miniapp.
---

# Melgene Apps 운영

프로젝트: `/Users/hanoseok/SynologyDrive/Home Drive/AGENTS/Trend Web Chalenge` = GitHub **`hanoseok/melgene-miniapp`** (소스 `main`, SSH `git@github.com:hanoseok/melgene-miniapp.git`). 미니앱마다 `apps/<id>/` 모듈. 시작할 때 README.md·LOG.md(맨 아래 최근 기록)를 읽고, 끝날 때 LOG.md 에 한 줄 남긴다. 사용자에게는 한국어로 말한다.

## 1. 배포

```bash
node tools/gen-all.js                 # SITES(apps/*/app.config.js) + 생성 + 링크 검사
node tools/check-all.js [앱…]         # apps/*/tools/check-*.js (포털: check-hub.js --layout)
git add -A && git commit && git push origin main   # 소스 (main 은 절대 강제 푸시 안 함)
./deploy.sh                           # deploy-prep → 배포 단위마다 배포 브랜치로 강제 푸시
DEPLOY_DRY_RUN=1 ./deploy.sh          # 어디로 갈지만 확인
node tools/check-links.js dist        # 배포 빌드 검사(선택)
```

- **miniapp.melgene.com = 공개 저장소 `hanoseok/melgene-miniapp` 의 `gh-pages` 브랜치 Pages** (2026-09-27 이전 완료, 사용자 결정으로 저장소 공개). 예전 `hanoseok/miniapp` 은 도메인을 뗀 상태(github.io 주소로만 남음). 처음 만든 소스 저장소(회사 메일 작성자·Supabase 값이 든 옛 커밋이 GitHub 에 남아 커밋 번호로 공개 조회됐음)는 `hanoseok/melgene-miniapp-old` 로 이름을 바꿔 **비공개**로 돌리고, 같은 이름으로 깨끗한 공개 저장소를 새로 만들었다 — 공개 저장소에서는 force push 로 기록을 지워도 옛 커밋이 한동안 조회되므로, 민감한 값이 한 번이라도 들어간 저장소는 공개하지 말고 새 저장소를 만든다. 옛 저장소 삭제는 사용자가 직접(되돌릴 수 없음). 교훈: 도메인을 옮길 때는 새 쪽 Pages 를 먼저 켜고(배포까지) 예전 쪽에서 떼자마자 새 쪽에 붙이고 바로 라이브 200 을 확인한다 — 반대로 하면 사이트가 통째로 404 가 된다.
- 배포 단위(`dist/UNITS`): `dist/miniapp` → **hanoseok/melgene-miniapp 의 `gh-pages` 브랜치** → **miniapp.melgene.com** (루트 = 포털, `/<앱>/`, CNAME 파일), `dist/hub` → today-test(main) → melgene.com(같은 포털), `dist/legacy/<앱>` → ladder·life-story·past-life(main) → 예전 `<앱>.melgene.com` 리다이렉트.
- 브랜치 규칙(deploy.sh): `BRANCH_<단위>` → 없으면 저장소가 `SOURCE_REPO`(melgene-miniapp)면 gh-pages, 아니면 main. 소스 저장소 main 으로 가는 설정이면 멈춘다. 스위치는 deploy.env `REPO_miniapp` 한 줄(`miniapp` = 예전 hanoseok/miniapp main, `melgene-miniapp` = 새 gh-pages). Pages 커스텀 도메인은 한 저장소에만 붙으므로 바꿀 때는 예전 저장소에서 도메인을 먼저 뗀다(README "배포").
- deploy-prep 이 하는 일: `https://<앱>.example.com`·`https://example.com` 자리표시자 치환(남으면 실패), 모든 HTML `<head>` 에 AdSense 자동 광고 스크립트 + `google-adsense-account` 메타, 도메인 루트에 ads.txt·robots.txt·sitemap-index.xml·Search Console 인증 파일(`GSC_FILES_miniapp`), 404.html(옛 `/<앱>/en/…` → `/<앱>/…`, 쿼리·해시 유지).
- 회사 프록시로 GitHub HTTPS/API 가 막히면 deploy.sh 가 SSH 푸시로 대신한다("GitHub API에 연결되지 않는다 … SSH로 푸시만 한다"는 정상).
- 완성되면 바로 배포하고 사용자에게 알린다(사용자 지시).

## 2. 라이브 확인

- `curl` 로 주소·광고 코드 확인: 88개 = 8개 사이트(포털 + 앱 7개) × 11개 언어(`/`, `/<앱>/`, 각 `ja/ zh/ ko/ fr/ de/ th/ vi/ es/ it/ pt/`). curl 은 브라우저가 아니라 지역 자동 이동(common.js)과 무관하다. 각 페이지에 `adsbygoogle.js?client=ca-pub-6807370217216401` 와 `google-adsense-account` 가 있어야 한다.
- 브라우저 동작(광고 자리·끝 화면·IntersectionObserver)은 **화면에 보이는 탭**에서 본다. Claude in Chrome 탭이 백그라운드(`document.visibilityState === 'hidden'`)면 IntersectionObserver·rAF 가 멈춰 광고 자리가 비어 보인다 — 버그 아님. 앱 안 브라우저(Claude 브라우저)는 visible.
- 회사망: 셸의 `https_proxy` 를 그대로 따른다(바꾸거나 우회하지 않는다 — 이 환경의 정책 훅이 프록시 설정 변경을 금지한다. 2026-09-27 사용자가 "시간 초과면 프록시를 빼고 다시"를 요청했으나 정책 때문에 적용하지 않음). **HTTPS 프록시가 시간 초과(curl 000/28)일 때 대신 쓰는 길**: ① 배포는 deploy.sh 가 알아서 SSH 푸시(`git@github.com`, 프록시 안 탐) ② 라이브 확인은 앱 안 브라우저(Claude 브라우저 `mcp__Claude_Browser__*`)로 주소를 열고 같은 출처 `fetch` 로 여러 주소를 한 번에 확인 ③ 원격 반영은 `git ls-remote git@github.com:hanoseok/<repo>.git` 로 HEAD 확인(miniapp: `git ls-remote git@github.com:hanoseok/melgene-miniapp.git gh-pages`) ④ 그래도 안 되면 몇 분 뒤 다시. Chrome 이 Menlo 보안 게이트웨이로 가면 SSO 로그인을 요구한다 — 비밀번호를 넣지 않는다.
- `node tools/live-check.js <URL…>` (headless, Supabase·실제 광고 요청은 막고 "시도했는지"만 봄 → 운영 숫자 오염 없음).

## 3. 광고 (AdSense)

- 게시자 `ca-pub-6807370217216401`(deploy.env `ADSENSE_CLIENT`), 광고 단위 melgene-mid slot `5952905456`(`SITE_CONFIG.AD_SLOT_MID`). 사이트 `melgene.com` 하나로 등록(하위 도메인 포함). 자동 광고·자동 최적화 사용.
- 승인 전에는 광고 요청이 `data-ad-status="unfilled"` 로 돌아오고 mg-ad 는 자리째 숨는다(정상). 승인되면 코드 변경 없이 채워진다.
- 매 실행마다 확인: AdSense → 사이트(승인 상태·ads.txt 상태) / 정책 센터 / 광고 → 사이트 기준(자동 광고 '사용'). 승인 후에는 라이브에서 `ins.adsbygoogle[data-ad-status="filled"]` 와 `ad_report` 의 ads_filled.
- ads.txt: `google.com, pub-6807370217216401, DIRECT, f08c47fec0942fa0` — melgene.com/ads.txt 와 miniapp.melgene.com/ads.txt. AdSense 의 "찾을 수 없음"은 재크롤까지 며칠 늦게 바뀐다.
- 개인 정보·지급 정보 입력은 사용자가 한다. 광고 클릭 추적·유도 금지(정책).

## 4. 통계 — Supabase SQL Editor

Supabase 대시보드 → 프로젝트 melgene → SQL Editor (공개 키로는 못 읽음)

| 보기 | 쿼리 |
|---|---|
| 광고 채움률 | `select * from ad_report;` |
| 유입 경로 (검색·Google·Naver·SNS·직접·기타) | `select * from traffic_report;` |
| 나라별 30일 | `select * from geo_summary;` / 지역: `select region, sum(pageviews_30d) from geo_summary group by 1 order by 2 desc;` |
| 날짜·앱·나라 | `select * from geo_report;` |
| 날짜·앱·나라별 시작/완료 | `select * from play_report;` |
| 앱×나라별 30일 시작/완료·완료율 | `select * from play_summary;` |
| 앱 참여·별점·하트·인기도 | `select * from app_summary();` |
| (확인용) 내 나라 코드 — 지역 자동 이동에 쓰는 값 | `POST /rest/v1/rpc/client_country` (공개 RPC, `cf-ipcountry` 그대로, 저장 안 함) |

- 기록 방식: `common.js` `initStats` → `supa.bump('pv')` + `trafficSource(document.referrer)`(밖에서 온 첫 페이지만, 분류만 저장) + 광고 채움 여부. 서버 `bump_stat` 이 `cf-ipcountry` 국가 코드만 `daily_geo` 에(IP 저장 안 함) — pv·검색·SNS 유입과 `start`/`done`(앱마다 한 판 시작·끝). 플레이·하트는 `play_app`/`heart_app`(앱+IP md5 30초).
- Google 검색어·노출·클릭은 Search Console → 실적. 수익은 AdSense → 보고서.

## 4-1. Supabase 접속 정보 — 저장소에 절대 넣지 않는다 (사용자 지시)

- 소스(`hanoseok/melgene-miniapp`, **공개 저장소**)에는 Supabase URL·키·프로젝트 ref·대시보드 링크를 두지 않는다. `shared/site.config.js` 의 `SUPABASE_URL`/`SUPABASE_ANON_KEY` 는 빈 값.
- 값은 로컬 전용 `deploy.local.env`(.gitignore)에만: `SUPABASE_URL=…`, `SUPABASE_ANON_KEY=sb_publishable_…`. deploy-prep 이 배포본(dist → gh-pages)의 site.config.js 에만 넣는다 — 브라우저가 써야 하므로 배포된 사이트에는 공개용 값이 들어간다(원래 공개용).
- deploy-prep 은 파일이 없거나 형식이 이상하거나 `sb_secret_`/service_role 키면 멈춘다. secret 키·DB 비밀번호·토큰은 어디에도 두지 않는다.
- 커밋 전 확인: `git grep -n -E 'supabase\.co|sb_publishable|sb_secret|service_role|postgres://'` 결과에 값이 없어야 한다(코드의 변수 이름·주석만).
- 커밋 작성자는 **hanoseok <hanoseok@gmail.com>** (사용자 지정): 소스는 저장소 로컬 git 설정, 배포는 deploy.env `GIT_AUTHOR_*_DEPLOY`. 회사 메일(전역 git 설정)이 공개 기록에 남지 않게 한다.

## 5. Supabase DB 바꾸는 절차

1. `supabase/migrations/<YYYYMMDDHHMMSS>_<이름>.sql` 작성. 테이블은 RLS on + `revoke all … from anon, authenticated`, 공개 함수는 `security definer` + `set search_path = public` + `grant execute … to anon`. 보고용 뷰는 `with (security_invoker = true)` + revoke.
2. 로컬 임시 Postgres 로 먼저 검증(`initdb --locale=C`, TCP 포트, PG14 면 `security_invoker` 를 sed 로 빼고), anon 으로 직접 조회가 막히는지까지.
3. Chrome(hanoseok 프로필) Supabase SQL Editor 에 넣고 실행(Monaco: `monaco.editor.getEditors()` 중 보이는 것 `.getModel().setValue(sql)` → Cmd+Enter). "destructive operation" 경고는 내용을 확인한 뒤에만 진행.
4. 라이브에서 한 번 호출해 결과 확인, 테스트 행은 지운다. `tools/mock-supa.js` 도 같은 모양으로 맞춘다.
- 절대: service_role/secret 키·DB 비밀번호를 쓰거나 파일에 두지 않는다(사이트에는 publishable 키만). 운영 데이터로 테스트하지 않는다(로컬은 mock).

## 6. Search Console

- 속성 `https://miniapp.melgene.com/` (사용자 Google 계정, HTML 파일 인증 `googlea6d2c28765f03a02.html` — deploy.env `GSC_FILES_miniapp`, 지우지 않음). 사이트맵 `sitemap-index.xml` 제출됨.
- 새 앱·큰 변경 후: 상단 URL 검사에 주소 → "색인 생성 요청"(하루 할당량이 적어 포털·새 앱 첫 화면 위주). 입력창은 먼저 클릭해 포커스를 준 뒤 입력.
- melgene.com 도메인 속성은 DNS TXT(Spaceship) 필요 — 회사망에서는 보안 게이트웨이로 막힘, 사용자에게 맡기거나 다른 망에서.

## 7. 지켜야 할 것

- 비밀번호 입력·계정 생성 금지, 결제·개인 정보 입력 금지(사용자가 한다). 프록시 설정(HTTP(S)_PROXY/NO_PROXY)을 바꾸거나 파일에 쓰지 않는다.
- 외부 계정 설정 변경(Search Console 속성 추가, DNS, AdSense 설정)은 사용자에게 먼저 묻고 한다.
- 기록: LOG.md(무엇을·검증 결과), README(구조·절차가 바뀌면), 메모리(사용자 결정), 규칙이 바뀌면 이 스킬과 melgene-miniapp.
