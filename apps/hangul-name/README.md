# apps/hangul-name — 내 이름 한글로 (만들기)

한글날(10월 9일) 기념 앱. 이름을 넣으면 **한글 표기**와 **음절 블록마다 읽는 법**(마-이-클 / ma-i-keul)을 보여 주고, 예쁜 **이름 카드**(붓글씨 · 귀여운 · 포스터 · 클래식 — Nanum Brush Script · Gaegu · Black Han Sans · Nanum Myeongjo)로 그려 **이미지 저장**(canvas → PNG 내려받기)과 **글자 복사**를 할 수 있다.

- 변환(`hangul-name-core.js`): ① 사전 ~400개(자주 쓰는 이름·성의 표준 외래어 표기, 국립국어원 외래어 표기법 기준 — John 존, Michael 마이클, Emma 엠마, Smith 스미스, Nguyen 응우옌, Kim 김 …) → ② 그 밖의 라틴 글자는 규칙: 악센트 제거, 글자 묶음(sch·sh·ch·th·ph·ng·ck·qu·ee·oo·ou·ai·ay·ey·ie·ea·au·aw·ow…), 자음·모음·반모음 단위 → 유니코드 조립(0xAC00 + (L×21+V)×28+T). 받침은 ㄴㅁㄹㅇ + 짧은 모음 뒤 p·t·k → ㅂ·ㅅ·ㄱ, 남는 자음엔 으(sh·ch·j 끝은 이), 모음 뒤 r 생략(영국식, a·i·o 로 끝나는 로망스어 이름은 r 을 읽음), 모음 사이 l → ㄹㄹ, 묵음 e. 키릴 문자는 먼저 라틴 글자로 옮긴 뒤 소리 나는 대로(끝소리 무성화), 일본어 가나는 일본어 표기법 표(첫 글자 예사소리·장음 생략·ん=ㄴ·っ=ㅅ), 한글은 그대로. 한자 등 다른 글자만 있으면 친절한 안내. 40자까지, 예외를 던지지 않고 결과는 늘 같다.
- **이름은 서버로 보내지 않는다**(개인정보). 변환·카드·PNG 모두 브라우저 안. 공유 링크 = `mgCleanUrl()` + `#d=`(UTF-8 base64url `{v:1,n:이름,s:스타일}`) — 받는 사람도 같은 카드를 본다(이 방문은 start/done 으로 세지 않음). 개인정보처리방침·FAQ 에 명시.
- 기록: 이름을 내면 `track('start')`, 결과가 보이면 `track('done')`(앱 이벤트 `hn_save`·`hn_copy`·`hn_open_shared` 추가). 다시 하기 = 이름 입력 화면.
- 카드 글꼴(한글 Google Fonts)은 첫 화면을 막지 않도록 JS 가 붙인다(unicode-range 조각이라 쓰는 글자만 받음). UI 글꼴: Nunito(라틴·키릴·베트남어) · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr.
- 광고: 시작 화면 맨 아래 `mg-ad-start` 1자리 + 끝 화면 공통 컴포넌트(결과 화면엔 따로 없음).

주소: 원본은 자리표시자 `https://hangul-name.example.com/`, 배포 때 `https://miniapp.melgene.com/hangul-name/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔤·카테고리 create·등록일 2026-10-09·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `hangul-name-core.js` | 사전·규칙·키릴·가나 변환, 음절 로마자, 공유 링크 encode/decode, 카드 스타일·글꼴 (UMD, 언어 무관) |
| `hangul-name.js` | 시작(티징 + 이름 입력) → 결과(카드 canvas·스타일 4개·이미지 저장/복사·음절 풀이) → 끝 화면 |
| `style.css` | 한지 바탕 + 먹색 잉크 + 단청 포인트, 자모 타일 티저 |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, ㅎ+ㅏ+ㄴ 타일 + 붓글씨 카드 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드(한글·한글날·음절 블록·외래어 표기·표기가 여러 가지인 이유·문신/선물 팁) → `tools/gen-guides.js` |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-hangul-name.js` | 변환 로직(기대 표기 56개·사전 값·무작위 2만 개)·공유 링크·언어 파일·360px 문구·생성 HTML·OG 검사 |
| `tools/check-flow.js` | 실제 흐름(Chrome headless + mock-supa): en·ko·ru × 360·1440 — 이름 입력 → 카드 → 스타일·복사·저장 → 끝 화면 → 다시 하기, 공유 링크 방문, 가로 넘침·콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                 # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js hangul-name   # 이 앱 검사만 (check-hangul-name + check-flow + check-guides)

# 이 폴더(apps/hangul-name)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all              # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-hangul-name.js
node tools/check-flow.js              # en,ko,ru × 360,1440 (예: node tools/check-flow.js en,ja 375)
```
