# apps/percent — 퍼센트 계산기 (만들기)

계산 탭 6개로 퍼센트 문제를 입력하는 대로 바로 푸는 한 화면 도구 앱(age·dday 처럼 시작 화면이 따로 없다). 결과마다 "이렇게 계산했어요" 계산식 줄과 복사 버튼.

- 계산: ① Y의 X% ② X는 Y의 몇 % ③ A→B 증감률(+25% / −12.5%, 기준 |A|) ④ X% 빼기·더하기(할인가·인상가, 빠른 할인 칩 10·20·30·50%, 아낀 금액) ⑤ X% 바뀐 뒤 값 → 원래 값(흔한 실수 답도 안내) ⑥ 두 비율의 %p 차이 + 상대 변화율.
- 입력: `type=text inputmode=decimal`. `percent-core.js` 의 `parseNum` 이 언어 소수점 기준으로 "," "." 둘 다 받는다(둘 다 있으면 뒤쪽이 소수점, 한 종류면 언어 소수점 = 소수점 / 다른 기호는 정확히 세 자리 앞이면 자릿수 구분). 공백·`'`·`%`·`+`/`−`·전각 숫자 허용. 결과는 `clean()`(유효 15자리 → 소수 10자리, −0 → 0), 화면은 `Intl.NumberFormat(lang, { maximumFractionDigits: 10 })`.
- 오류: badNum · divZero(②의 Y=0) · fromZero(③의 A=0) · over100(내리기 100% 초과·역산 100% 이상) · tooBig(|x| ≥ 1e15). 빈 칸은 오류가 아니라 안내 문구.
- 기록: 한 판에서 처음 결과가 나온 순간 `track('start')` 1번 → "계산 요약 보기"를 처음 누르면 요약 카드 + 공통 끝 화면 + `track('done')` 1번(다시 눌러도 같은 판은 1번). 다시 하기(`setRetry`) = 모든 입력을 비우고 새 판.
- 저장: localStorage `mg_percent_mode`(마지막 탭)만, try/catch. 숫자는 서버·저장소·주소 어디에도 없다. `#d=` 공유 링크는 만들지 않았다. 공유 = 깨끗한 주소(`mgCleanUrl`) + 고정 문구.
- 화면: h1·훅 → 탭 6개(3×2) → 고른 카드 → 소수점 안내 → 요약 보기 → (요약 뒤) `#result`(요약 + `data-mg-end="percent"`) → 맨 아래 `mg-ad-start`(요약이 보이면 숨김).

주소: 원본은 자리표시자 `https://percent.example.com/`, 배포 때 `https://melgene.com/percent/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(💯 · create · 2026-10-22 · order 1 · 12개 언어 제목/설명) |
| `percent-core.js` | 입력 해석·부동소수 정리·6가지 계산·오류 (UMD) |
| `percent.js` | 한 화면 동작(탭·입력하는 대로 계산·칩·방향·복사·요약·다시 하기·공유 데이터) |
| `style.css` | 모눈종이 + 남색 잉크 + 토마토 주황 + 형광펜 노랑, 숫자 Space Grotesk (라틴 Outfit · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr · vi Be Vietnam Pro · ru Rubik) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, "?%" 카드 + % 타일 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구(12개 언어, 키 구조 동일, `num` = 언어별 % · %p 표기) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법 · 손으로 푸는 세 공식 · 증감률·겹치는 할인·역산 함정 · %와 %p · 생활 예시·암산) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-percent.js` | 로직(소수점·입력 해석 45개·clean·6가지 계산·오류·역산 되돌림 300번)·언어 파일(키·자리표시자·360px 문구·FAQ·제목 검색어·fr 좁은 공백·글꼴)·생성 HTML·사이트맵·OG·percent.js 저장/전송 규칙 |
| `tools/check-flow.js` | 실제 흐름(Chrome headless + 정적 서버 + mock-supa): 첫 화면 광고·넘침, 6가지 계산 값·오류, 언어 소수점, 칩·방향, 복사, track 횟수, 끝 화면 순서, 공유 데이터, 다시 하기, 탭 기억, 콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 가이드 + 링크 검사
node tools/check-all.js percent     # 이 앱 검사(check-percent + check-flow) + 가이드 검사

# 이 앱만 (루트에서, gen-all 과 같은 순서)
(cd apps/percent && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js)
node tools/gen-guides.js percent && MG_I18N_MODE=variant node tools/gen-guides.js percent
node apps/percent/tools/gen-og.js all   # OG 이미지 (언어 지정: node apps/percent/tools/gen-og.js ja ko)
(cd apps/percent && node tools/check-percent.js && node tools/check-flow.js)   # check-flow 예: node tools/check-flow.js ru,de 375 · SHOT=<폴더>
node tools/check-guides.js percent
```
