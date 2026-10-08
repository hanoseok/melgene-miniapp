# apps/dice — 주사위 굴리기 (투표)

한 화면 도구: 주사위 개수(1~6, 기본 2)와 종류(d4 · d6 · d8 · d10 · d12 · d20, 기본 d6)를 고르고 "굴리기"(또는 Space 키, 판을 눌러도 됨)를 누르면 값을 **먼저** 뽑고, d6 은 CSS 3D 정육면체가 굴러 그 눈에 멈추고 나머지는 다각형(SVG)이 돌며 튄 뒤 그 숫자에 멈춘다(움직임 줄이기면 바로). 판에 각 주사위와 합계(2개 이상), 아래에 이번 세션 최근 10번 기록. 독일어는 표기 글자 W(W6·3W6).

- 공정성: `crypto.getRandomValues` 거부 샘플링(`dice-core.js` 의 `uniformInt` — 2^32 를 면 수로 나눈 나머지 구간은 버리고 다시 뽑음, 모듈로 치우침 없음). 연출은 결과에 영향이 없다.
- 전부 클라이언트: 설정·결과·기록은 메모리에만(저장·전송 없음, 새로 고치면 사라짐). 서버 숫자 없음. 기록 = 굴리기를 누를 때 `track('start')`, 결과가 판에 보일 때 `track('done')`(굴릴 때마다 또).
- 따로 시작 화면이 없는 도구 앱(roulette 와 같은 방식): 첫 화면 `#screen-dice` = h1(현지 검색어)·훅 → 개수/종류 → 판 → 굴리기 → 기록(`#history`, 첫 굴림 뒤 보임) 안에 공통 끝 화면(`data-mg-end="dice"`, 다시 하기 = 판으로 올라가 다시 굴리기) → 맨 끝 `mg-ad-start` 1자리. 기록·끝 화면이 보이면 `mg-ad-start` 는 숨긴다(한 화면 광고 1개). 소리·흔들어 굴리기는 없음.

주소: 원본은 자리표시자 `https://dice.example.com/`, 배포 때 `https://miniapp.melgene.com/dice/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎲·카테고리 vote·등록일 2026-10-09·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `dice-core.js` | crypto 거부 샘플링, 굴리기, 합계·표기(2d6/d20/3W6), 최근 10번, 합 확률 분포, 정육면체 회전 (UMD) |
| `dice.js` | 한 화면: 설정 → 굴림 연출 → 판 결과 + 합계 → 기록·끝 화면 |
| `style.css` | 크림 바탕 + 진녹색 펠트 판 + 빨강 버튼, d6 3D 정육면체·다각형 주사위 (Nunito · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 펠트 위 주사위 + d20 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(하는 법·공정성·주사위 역사·TRPG 다면체·놀이·두 주사위 합 확률) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-dice.js` | 로직·거부 샘플링·공정성(종류별 카이제곱)·언어 파일·360px 문구·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js dice        # 이 앱 검사만
node tools/check-guides.js dice     # 가이드 검사

# 이 폴더(apps/dice)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-dice.js
```
