# apps/nickname — 닉네임 생성기 (만들기)

분위기 칩 5개(귀여운·멋진·웃긴·몽환적인·미스터리) 중 하나를 고르고 (선택) 이름이나 글자를 넣은 뒤 "만들기"를 누르면, 결과 화면에 **닉네임 하나**와 복사 버튼이 나온다(다시 뽑기·분위기 바꾸기 → 공통 끝 화면 `data-mg-end="nickname"`). 단어 목록을 모아 보여 주지 않는다(고르기 화면에는 조합 수만).

- 단어: 언어마다 그 나라 말로 분위기별 형용사 12개 + 명사 12개(`tools/i18n/<lang>.js` 의 `words`) → 분위기당 144 조합, 전체 720 조합 이상. 프랑스어·스페인어·이탈리아어·포르투갈어·독일어·러시아어는 성별 맞춤(형용사 `남성/여성/중성` 형태, 명사 `|m|f|n`).
- 조합: 형용사 + 명사(언어별 순서·붙여 쓰기는 `style`). 이름·글자를 넣으면 이름+명사 · 명사+이름 · 형용사명사+구분+이름 중 하나로 섞는다(12글자까지, 이 브라우저 안에서만 쓰고 저장·전송하지 않음). "숫자 붙이기"를 켜면 두 자리 숫자.
- 공정성: `crypto.getRandomValues` 거부 샘플링. 글자가 휙휙 바뀌는 연출 뒤에 먼저 정해 둔 결과를 보여 주고, 직전 결과와 같으면 다시 뽑는다.
- 기록: 만들기를 누를 때 `track('start')`, 결과가 확정될 때 `track('done')`(다시 뽑기마다 또).
- 저장: 마지막 분위기·숫자 붙이기만 localStorage `nickname_last_v1`.
- 광고: 시작 화면 맨 아래 `mg-ad-start` 1자리 + 고르기 화면 만들기 버튼 아래 `mg-ad` 1자리 + 끝 화면 공통 컴포넌트.

주소: 원본은 자리표시자 `https://nickname.example.com/`, 배포 때 `https://miniapp.melgene.com/nickname/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🏷️·카테고리 create·등록일 2026-10-05·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `nickname-core.js` | 단어 읽기, 이름 정리, 조합(성별 일치·이름 섞기·숫자), crypto 뽑기 (UMD) |
| `nickname.js` | 시작(티징) → 분위기·이름 고르기 → 닉네임 + 복사 |
| `style.css` | 연보라 도트 바탕 + 남보라 잉크 + 보라·핑크·라임 이름표 스티커 (Nunito · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 이름표 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 + 그 나라 단어 목록 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-nickname.js` | 로직·공정성(통계)·언어 파일(분위기 5개×단어 12개 이상·성별 형태)·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js nickname     # 이 앱 검사만

# 이 폴더(apps/nickname)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-nickname.js
```
