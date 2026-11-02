# apps/wrapped — 올해 결산 카드 (만들기)

테마 6(오로라·노을·민트·한밤·종이·네온) + 이름(선택, 20자) + **올해의 한 단어(필수, 16자, 언어별 추천 칩 5개)** + 선택 6칸(최고의 순간 40·올해의 노래 40·음식 30·장소 30·고마운 사람 30·내년 목표 40자) → canvas 로 그린 결산 카드(1080×1350, 외부 그림 없음 — 도형·이모지, 빈 칸은 카드에서 빠짐) + 이미지 저장(PNG, 휴대폰은 공유 시트) + 텍스트 복사 + `#d=` 공유 링크. 받은 사람은 같은 카드를 바로 끝 화면에서 보고 "나도 만들기"(이때 start/done 은 세지 않음). 쓴 글은 서버로 보내지 않는다(링크 안 + 쓰는 동안 localStorage `wrapped_draft`).

**연도는 어디에도 굳히지 않는다**: 카드 연도 = `wrapped-core.js` `reviewYear()`(1월 = 지난해, 2~12월 = 올해), 문구는 `{year}`·`{next}` 자리표시자, 공유 링크에는 만든 사람의 연도(`y`)가 들어간다. 제목·설명·OG 이미지에도 연도 숫자가 없어서 해마다 다시 만들 필요가 없다(check 가 언어 파일·생성 HTML·JS 문자열의 연도 숫자를 막는다; 개인정보 시행일만 예외).

주소: 원본은 자리표시자 `https://wrapped.example.com/`, 배포 때 `https://melgene.com/wrapped/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎁·카테고리 create·등록일 2026-11-03·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `wrapped-core.js` | 테마(색·이모지·배경 그림)·글 칸(FIELDS/ROWS)·연도(reviewYear·validYear)·글 정리·canFinish(한 단어 필수)·`#d=` 인코딩(UTF-8 base64url `{"v":1,"t","y","nm","w","mo","so","fo","pl","th","go"}`, 빈 칸 생략, 디코딩 때 검증·자르기, 한 단어 없으면 거부)·줄바꿈 `wrap`(Intl.Segmenter)·반짝이 위치(seeded) (UMD) |
| `wrapped.js` | 시작(티징) → 편집기(테마·이름·한 단어+추천 칩·6칸 + 실시간 canvas 미리보기, 한 단어 없이 완성하면 안내) → 끝 화면(카드·이미지 저장·텍스트 복사·고치기·공통 끝 화면). 받은 링크는 바로 끝 화면 |
| `style.css` | 스타일 (밤보라 + 코랄 핑크 + 금빛. 제목·한 단어 글꼴은 언어 파일 fonts) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 연도 숫자 없음), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일). `card.*` 는 카드 그림에 들어가는 문구, `editor.ideas` 는 그 언어로 직접 고른 한 단어 예시 5개 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 |
| `tools/gen-og.js` | OG 이미지 (Chrome headless) |
| `tools/check-wrapped.js` | 로직·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :9291 + mock-supa :9292, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js
node tools/check-all.js wrapped

# 이 폴더(apps/wrapped)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-wrapped.js
node tools/flow-test.js            # 기본 en,ko,ru × 360,1440 (캡처: 세 번째 인자로 폴더)
```
