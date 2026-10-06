# apps/fancytext — 멋진 글꼴 변환기 (만들기)

글을 입력하면 **글꼴 15개**(굵게·기울임·굵은 기울임·필기체·굵은 필기체·고딕체·이중선·모노·동그라미·검은 동그라미·네모·검은 네모·작은 대문자·거꾸로·넓게)와 **어떤 글에도 되는 꾸미기 10개**(취소선·밑줄·물결·띄어쓰기·★ ꧁꧂ ✿ ♡ 『』 ･ﾟ✧ 감싸기)로 바뀐 모습이 한 줄씩 나온다. 한 줄을 누르면 복사된다(첫 복사 뒤 공통 끝 화면 `data-mg-end="fancytext"` 이 목록 아래에 나온다).

- 글꼴은 유니코드 기호(수학 알파벳·원문자 등)라 **라틴 글자·숫자만** 바뀐다(é 같은 악센트 글자는 기본 글자 + 결합 부호). 한글·가나·한자·태국·키릴 글은 글꼴 목록이 빠지고 꾸미기만 나온다(안내 문구 표시). 글이 비어 있으면 예시 글(`make.sample`)로 흐리게 미리 보여 주고, 누르면 "먼저 글을 입력하세요".
- 모든 변환은 브라우저 안에서만 한다. 입력한 글은 저장·전송하지 않는다(localStorage 도 쓰지 않음). 120자까지.
- 기록: 시작 버튼(또는 끝 화면의 "다른 글 꾸미기")을 누를 때 `track('start')`, 판마다 첫 복사 때 `track('done')`.
- 광고: 시작 화면 맨 아래 `mg-ad-start` 1자리 + 입력 화면 목록 아래 `mg-ad` 1자리(첫 복사 뒤 숨김) + 끝 화면 공통 컴포넌트.

주소: 원본은 자리표시자 `https://fancytext.example.com/`, 배포 때 `https://miniapp.melgene.com/fancytext/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 ✨·카테고리 create·등록일 2026-10-07·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `fancytext-core.js` | 글꼴 15·꾸미기 10 변환, 목록 만들기 (UMD, 언어 무관) |
| `fancytext.js` | 시작(티징) → 글 입력 + 목록(누르면 복사) → 끝 화면 |
| `style.css` | 크림 바탕 + 남색 잉크 + 핑크·하늘·노랑 스티커 카드 (Nunito · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 스타일 글씨 카드 3장 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 + 스타일 이름 25개 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-fancytext.js` | 변환 로직·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js fancytext    # 이 앱 검사만

# 이 폴더(apps/fancytext)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-fancytext.js
```
