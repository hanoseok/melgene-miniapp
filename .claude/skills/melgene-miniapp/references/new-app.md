# 새 미니앱 만드는 절차

기존 앱(apps/ladder, apps/reaction, apps/roulette 등)을 본보기로 삼는다. 순서대로.
**앱 추가 = `apps/<id>/` 폴더 하나.** 중앙 파일(site.config.js, gen-all, deploy-prep, deploy.env)은 고치지 않는다 — 모두 `apps/*` 를 자동 탐색한다.

## 1. 폴더

```text
apps/<id>/
├── app.config.js  등록 정보 (아래 4번) — 포털·다른 미니앱 목록(SITES)에 들어감
├── README.md      짧게: 무엇인지, 파일, 생성·검사 명령 (다른 앱 README 형식 그대로)
├── index.html, privacy.html, <lang>/index.html, _l/<lang>/… ← 생성물 (손으로 고치지 않음, _l = 사람에게 보이는 언어 사본)
├── <id>-core.js   언어 무관 로직 (UMD: 브라우저 + Node 검사 공용)
├── <id>.js        화면 동작 (문구는 PAGE_I18N/ui 에서만)
├── style.css      사이트 색·글꼴 (공통 컴포넌트는 --mg-* 변수로만 맞춤)
├── og/ , favicon.svg, sitemap.xml
├── shared -> ../../shared   (심볼릭 링크)
└── tools/
    ├── i18n/{en,ja,zh,ko,fr,de,th,vi,es,it,pt,ru}.js   모든 문구 (키 구조 동일)
    ├── gen-i18n.js    페이지 생성 (tools/gen-all.js 가 자동 탐색)
    ├── gen-og.js      OG 이미지 12장 (tools/lib/og-shot.js)
    ├── guide/{en,…,ru}.js  긴 글 가이드 12개 언어 (아래 4-1번) → tools/gen-guides.js 가 guide.html 생성
    └── check-<id>.js  로직·언어 파일·생성 HTML 검사 (tools/check-all.js 가 자동 탐색, cwd = apps/<id>)
```

id 는 `^[a-z0-9-]{1,32}$`. 주소는 원본에서 `https://<id>.example.com/` 자리표시자(deploy-prep 이 `https://miniapp.melgene.com/<id>/` 로 바꿈).

## 2. 생성기 (tools/gen-i18n.js) 필수 요소

- `const G = require('../../../tools/lib/i18n-gen.js'); const L = G.loadSiteLocales(SITE_DIR);` — 12개 파일이 없으면 실패한다.
- `<html lang>`, `<title>` = 현지 검색어 | `G.brandOf(lang)`, 메타 설명, og(+`G.ogLocaleTags`), canonical, `G.hreflangTags(siteRoot, rel)` — `<head>` 안 맨 앞(언어 로더 `G.pageLoader` 가 여기 들어 있다).
- `G.appLd(lang, { siteRoot, rel, name, description, category })` (game|test|create|vote).
- 맨 위 `G.topBar(lang, rel)`. (언어 적용·지역 자동 판단은 로더와 common.js 가 알아서 한다 — 앱에서 할 일 없음. 앱 JS 에서 언어별 주소(`/ko/` 등)를 만들지 않는다: 링크는 생성기 상대 경로, 공유 주소는 `window.mgCleanUrl()`)
- 시작 화면 = 티징(+어려운 게임만 짧은 방법) + 맨 아래(시작 화면 컨테이너의 마지막 요소) `<div class="mg-ad mg-ad-start"></div>` 1개(SEO 글·FAQ·목록은 여전히 금지). 진행 중 화면에 `mg-ad` 최대 1개. check 스크립트에 "시작 화면 맨 끝 mg-ad-start 정확히 1개" 검사를 넣는다.
- 결과 아래 `<div data-mg-end="<id>"></div>`, `G.scriptJson('MG_FAQ', T.faq)` (3~5개 `{q,a}`).
- 스크립트 순서: `shared/site.config.js` → `shared/i18n.js` → `shared/common.js` → `shared/supa.js` → 앱 JS.
- `G.sitemapXml(siteRoot, ['index.html', 'privacy.html', …])`.

## 3. 앱 JS 에서 할 일

- `window.setShareData({ title, text, url } | fn)`, `window.setRetry(fn | url | { label, action })`.
- 한 판이 시작될 때(사용자가 시작한 순간) `track('start')` 한 번 — 나라별 시작/완료 통계(`play_report`).
- 한 판이 끝날 때 `track('done')` 한 번 (포털 참여 수·통계). 플레이 수는 `common.js` 가 진입 시 자동(`play_app`, 30초 중복 제외).
- 서버 숫자(선택률·분포 등)는 `window.supa.*` (vote/pollResults, submitScore/scoreDistribution 등). 실패하면 숨긴다.
- 공유 링크 상태는 `#d=`(UTF-8 base64url) 또는 Supabase 짧은 링크 `?s=`. 주소에 언어를 넣지 않는다(받는 사람은 자기 언어로 본다).
- 생성기는 `MG_I18N_MODE=variant` 로 한 번 더 돌 때 `_l/<lang>/…` 을 만든다 — `G.fileOf`·`G.relHref` 를 쓰면 저절로 맞다(파일 경로를 직접 조립하지 않는다).

## 4. 등록

- `apps/<id>/app.config.js` = `module.exports = { id, emoji, category, added: 'YYYY-MM-DD', path: 'https://<id>.example.com/', title: {12개}, desc: {12개} }` (같은 날 여러 개면 `order: 1, 2 …`). 제목은 앱 페이지의 검색어와 같은 이름. 다른 앱의 app.config.js 를 복사해 고친다.
- `node tools/gen-all.js` 가 먼저 `tools/gen-sites.js` 로 `shared/site.config.js` 의 SITES(생성 구역)를 다시 쓴다 — id≠폴더, path 모양, 빠진 언어가 있으면 실패. deploy-prep 은 SITES 가 어긋나면(`gen-sites.js --check`) 멈춘다.
- 포털 큐레이션에 넣으려면 `apps/hub/tools/i18n/<lang>.js` 의 `curation.items` 에 12개 언어로(2줄 규칙, portal.md).
- `deploy.env` 는 고칠 것이 없다(miniapp.melgene.com 배포 단위에 함께 들어감 — hanoseok/melgene-miniapp 의 gh-pages). 예전 서브도메인 리다이렉트가 필요할 때만 `REPO_<id>`.

## 4-1. 가이드 글 (guide.html) — 앱마다 필수

AdSense 가 "가치가 낮은 콘텐츠"로 거절한 뒤(2026-10) 생긴 규칙: 시작 화면은 티징만 두는 대신, 앱마다 **긴 글 가이드 페이지**를 따로 둔다. 새 앱을 만들 때 함께 쓴다.

- 파일: `apps/<id>/tools/guide/<lang>.js` 12개(en ja zh ko fr de th vi es it pt ru), 모두 같은 키·같은 섹션 수(섹션별 키·`list` 유무도 같게). 일반 텍스트만(HTML 금지 — 생성기가 escape).

```js
module.exports = {
  metaTitle: 'Whack-a-Mole Guide: How to Play, Tips & Fun Facts', // 현지 검색어 앞, 표시 폭 ≤ 60 권장(≤ 70 필수, 한중일 글자 = 2)
  description: '…',          // 메타 설명 110~160자(한중일은 그 절반 정도)
  h1: 'Whack-a-Mole: how to play and score higher',
  updated: '2026-10-09',     // YYYY-MM-DD (Article datePublished/dateModified, "업데이트" 표시)
  intro: '2~4문장 한 단락',
  sections: [                // 4~6개
    { h: '하는 법', p: ['단락', '단락'], list: ['선택 항목', '…'] },
  ],
  cta: 'Play Whack-a-Mole now', // 앱으로 가는 버튼
};
```

- 분량: en 본문 450단어 이상(보통 650~950), 다른 언어도 같은 내용을 그 나라 말로(직역 금지) — 글자 밀도 보정 후 en 의 50% 이상.
- 내용: 앱이 무엇인지 · 하는 법 · 잘하는 팁 · 배경/역사/원리 · 친구와 즐기는 법. **스포일러 금지(1번 규칙 그대로)** — 질문·결과 유형 목록, 정답, 결과 이름을 모아 쓰지 않는다. 심리테스트는 "재미로" 라는 점을 한 줄.
- 생성: `node tools/gen-all.js` 가 앱 생성기 바로 뒤에 `tools/gen-guides.js <id>`(보통 + `MG_I18N_MODE=variant`)를 돌린다 → `guide.html`·`<dir>/guide.html`·`_l/<lang>/guide.html`(G.topBar, h1, 업데이트 날짜, 본문, 2번째 섹션 뒤 `mg-ad` 1개, 앱으로 가는 CTA, Article + BreadcrumbList JSON-LD, `shared/article.css`), `sitemap.xml` 에 guide.html 12개 추가, 푸터에 privacy 링크가 있는 모든 앱 HTML 에 ` · 가이드` 링크와 `<meta name="mg-guide">`(끝 화면 FAQ 맨 아래 "📖 가이드 & 팁"). 앱 생성기는 고칠 것이 없다 — 푸터를 `… · <a href="<접두어>privacy.html">…</a>` 모양으로만 두면 된다.
- 가이드 조회는 플레이 수로 세지 않는다(`<meta name="mg-no-play">`).
- 검사: `node tools/check-guides.js <id>`(check-all 이 자동으로 돌림). 앱 check 스크립트의 사이트맵 URL 수 검사는 guide.html 을 빼고 센다(`/<loc>(?![^<]*guide\.html)/g`).
- 포털 `guides.html`(가이드 모음)은 가이드가 있는 앱을 자동으로 싣는다 — 따로 등록할 것 없음.

## 5. 언어·글꼴 주의 (겪은 일)

- 번역은 현지 표현·예시로(프리셋 음식, 메신저, 시험 이름 등). 직역·음차 금지. pt 는 브라질 포르투갈어(você, 브라질 예시).
- it·pt 의 à è ì ò ù ã õ ç 는 Latin-1 범위 — fr·es 와 같은 제목 글꼴이면 된다. Jua 처럼 라틴 확장이 모자란 글꼴은 fr·es 처럼 다른 글꼴(ladder 는 Fredoka)로.
- th: 줄 높이를 넉넉히(성조 기호 잘림), letter-spacing 0, 단어 경계에서 줄바꿈. vi: 제목 글꼴이 베트남어 성조를 지원하는지 확인(Be Vietnam Pro·Plus Jakarta Sans 등). zh: Pretendard 에 없는 간체자가 있어 시스템 중국어 글꼴 우선. ja: `word-break: auto-phrase`. fr: `?`·`!`·`:` 앞 좁은 줄바꿈 없는 공백. de: 긴 단어 `hyphens: auto`.
- `shared/base.css` 의 `:lang(zh|th|vi)` 글꼴 규칙이 모든 요소에 걸려 사이트의 제목 글꼴 상속을 끊는다 → 사이트 CSS 에서 제목 요소에 글꼴을 다시 지정. `svg { max-width: 100% }` 가 손그림 테두리 SVG 를 줄일 수 있다.
- 360px 에서 버튼 문구·칩·이름이 넘치지 않게 문구를 줄인다(check 스크립트에 폭 검사를 넣는다).

## 6. 검사 → 배포

1. `node tools/gen-all.js` (모든 사이트 생성 + 링크 검사), 필요하면 `--og`
2. `node tools/check-all.js <id>` (또는 `apps/<id>` 에서 `node tools/check-<id>.js`)
3. 로컬 확인: `python3 -m http.server` + `node tools/mock-supa.js <포트>` + `localStorage.mg_supa_url` — 360/375/1440, en + 비라틴 언어 하나로 끝까지, 콘솔 오류 0, 끝 화면 순서
4. `./deploy.sh` → 라이브 확인·Search Console 색인 요청 (melgene-ops 스킬)
5. LOG.md 한 줄, 루트 README 사이트 목록 표, `apps/<id>/README.md` (가이드 `tools/guide/<lang>.js` 12개도 같이 — 4-1번)
6. 커밋·푸시: `git add apps/<id> shared/site.config.js … && git commit && git push origin main` (소스는 main, 배포본은 deploy.sh 가 gh-pages 로)
