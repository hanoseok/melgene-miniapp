# apps/invite — 할로윈 파티 초대장 만들기 (만들기)

테마 5(유령·호박·박쥐·마녀·거미) + 파티 이름(30자)·날짜·시간·장소(40자)·한마디(80자) → canvas 로 그린 초대장(1080×1500) + 이미지 저장(PNG, 휴대폰은 공유 시트) + 텍스트 복사 + `#d=` 공유 링크(받은 사람은 같은 초대장 + "나도 만들기", 이때 start/done 은 세지 않음). 날짜·시간은 `Intl` 로 그 언어 서식(그레고리력).

주소: 원본은 자리표시자 `https://invite.example.com/`, 배포 때 `https://miniapp.melgene.com/invite/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지·카테고리 create·등록일·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `invite-core.js` | 테마(색·이모지·장식 위치)·글 정리·날짜/시간 검증·`#d=` 인코딩(UTF-8 base64url `{"v":1,"t":테마,"n","d","h","p","m"}`, 빈 칸 생략)·줄바꿈 `wrap` (UMD) |
| `invite.js` | 시작(티징) → 편집기(테마 칩·입력 5칸·실시간 canvas 미리보기) → 끝 화면(초대장·이미지 저장·텍스트 복사·고치기·공통 끝 화면) |
| `style.css` | 스타일 (밤보라 + 호박 주황. 제목 글꼴은 언어 파일 fonts) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일). `card.*` 는 초대장 그림에 들어가는 문구 |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 |
| `tools/gen-og.js` | OG 이미지 (Chrome headless) |
| `tools/check-invite.js` | 로직·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :8771 + mock-supa :8772, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js
node tools/check-all.js invite

# 이 폴더(apps/invite)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-invite.js
node tools/flow-test.js            # 기본 en,ko,th,ru × 360,375,1440 (캡처: 세 번째 인자로 폴더)
```
