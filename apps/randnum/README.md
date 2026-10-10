# apps/randnum — 랜덤 숫자 뽑기 (투표)

한 화면 도구: 최소·최대(음수 가능, 각각 ±10억), 개수(1~1000), 중복 허용·정렬 스위치, 자주 쓰는 범위(1–6 · 1–10 · 1–45(6개·중복 없음·정렬) · 1–100), "옵션 더 보기"(뺄 숫자 `4, 13, 20-25` · 추첨 이름)를 정하고 "숫자 뽑기"(또는 Enter)를 누르면 값을 **먼저** 뽑고, 진남보라 플립 보드 타일의 숫자가 슬롯처럼 굴러가다 차례로 멈춘다(움직임 줄이기면 바로). 숫자가 1개면 아주 크게, 많으면 촘촘한 격자(1000개까지, 스크롤).

- 공정성: `crypto.getRandomValues` 거부 샘플링(`randnum-core.js` 의 `uniformInt` — 범위 최대 2e9+1 < 2^32, 나머지 구간은 버리고 다시 뽑음). 뺄 숫자는 "남은 숫자 k 번째"로 바로 옮기고(`nthAllowed`), 중복 없이 = 희소(Map) 부분 Fisher–Yates(10억 범위에서도 메모리는 뽑는 개수만큼). 연출은 결과에 영향이 없다.
- 결과 카드: 범위·개수·중복·정렬·제외 태그, 숫자 타일, "숫자 복사"(쉼표 구분, 이름이 있으면 앞에), "결과 링크 복사"(경품 추첨용 `#d=`).
- 공유 링크 `#d=<UTF-8 base64url(JSON {v:1,a,b,n,u,s,x,r,t,l})>`: 받은 사람은 **다시 뽑지 않고** 그 결과를 "🎁 공유된 추첨 결과" 배지·뽑은 시각과 함께 본다(`decodeShare` 가 범위·개수·중복·뺄 숫자·정렬을 모두 검사, 틀리면 "링크가 깨졌어요"). 공유 결과는 start/done 을 세지 않고, 다시 하기 = "나도 뽑아 보기"(같은 설정으로 새로 뽑음). 끝 화면 공유(setShareData)도 지금 결과의 `#d=` 링크.
- 최근 10번: localStorage `mg_randnum_history`(모든 접근 try/catch, 한 줄에 숫자 100개까지 저장), "지우기". 서버로 보내지 않는다. 서버 숫자 없음.
- 기록: 뽑기를 누를 때 `track('start')`, 마지막 타일이 멈췄을 때 `track('done')`(다시 뽑을 때마다 또).
- 따로 시작 화면이 없는 도구 앱(dice 와 같은 방식): 첫 화면 `#screen-rn` = h1(현지 검색어)·훅 → 입력 카드 → 뽑기 → 결과(`#result`, 뽑은 뒤 보임: 결과 카드 → 최근 기록 → 공통 끝 화면 `data-mg-end="randnum"`) → 맨 끝 `mg-ad-start` 1자리. 결과가 보이면 `mg-ad-start` 는 숨긴다(한 화면 광고 1개).

주소: 원본은 자리표시자 `https://randnum.example.com/`, 배포 때 `https://melgene.com/randnum/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔢·카테고리 vote·등록일 2026-10-11·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `randnum-core.js` | crypto 거부 샘플링, 입력 검사(validate), 뺄 숫자 파싱, 뽑기(희소 Fisher–Yates), 프리셋, `#d=` 인코딩/디코딩, 기록 (UMD) |
| `randnum.js` | 한 화면: 입력 → 뽑기 → 릴 연출 → 결과·복사·링크 → 최근 기록 → 끝 화면, `#d=` 공유 결과 보기 |
| `style.css` | 연보라 모눈종이 + 진남보라 플립 보드(라임 숫자) + 바이올렛 버튼 (Unbounded · ko Do Hyeon · ja M PLUS 1p · zh ZCOOL QingKe HuangYou · th Kanit, 숫자는 JetBrains Mono) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 플립 보드 타일 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법·경품 추첨/이벤트/교실 활용·무작위의 뜻·진짜 난수 vs 의사 난수·암호학적 난수·공정한 추첨 팁) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-randnum.js` | 로직·입력 검사·공정성(카이제곱 5종)·`#d=` 왕복/변조 거절·언어 파일·360px 문구·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js randnum     # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/randnum)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-randnum.js
```
