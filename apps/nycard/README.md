# apps/nycard — 2027 연하장 (만들기)

디자인 6(홍색 금박·한지 느낌·귀여운 양·미니멀·눈 오는 밤·불꽃놀이) + 인사말 4(언어별: ko 새해 복 많이 받으세요/근하신년…, ja あけましておめでとうございます/謹賀新年/賀正…, zh 新年快乐/恭贺新禧… 등) + 꾸미기 토글 3(양띠 배지 — 도형으로 그린 양 얼굴 + 띠 문구 · 큰 "2027" · 반짝이) + 받는 사람(20자)·보내는 사람(20자)·덕담(120자, 언어별 문구 추천 5개) → canvas 로 그린 카드(1080×1350, 외부 그림 없음 — 도형·이모지) + 이미지 저장(PNG, 휴대폰은 공유 시트) + 텍스트 복사 + `#d=` 공유 링크. 받은 사람은 봉투 열기 화면(움직임 줄이기면 바로 열림) → 같은 카드 + "나도 만들기"(이때 start/done 은 세지 않음). 메시지는 서버로 보내지 않는다(링크 안 + 쓰는 동안 localStorage `nycard_draft`).

양띠 배지는 한중일·베트남·태국·러시아어(띠/«символ года» 문화가 있는 곳)는 처음부터 켜고, 그 밖 언어는 꺼 둔다(`editor.zodiacOn`). 꺼도 카드는 그대로 완성된다.

주소: 원본은 자리표시자 `https://nycard.example.com/`, 배포 때 `https://melgene.com/nycard/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🐐·카테고리 create·등록일 2026-11-07·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `nycard-core.js` | 디자인(색·이모지·배경 그림 종류·장식 위치)·인사말·꾸미기 비트·글 정리·`#d=` 인코딩(UTF-8 base64url `{"v":1,"t","g","o","to","fr","m"}`, 빈 글 칸 생략, 디코딩 때 검증·자르기)·줄바꿈 `wrap`(Intl.Segmenter 단어 단위)·점 위치(seeded) (UMD) |
| `nycard.js` | 시작(티징) → 편집기(디자인·인사말·꾸미기·이름·덕담 + 실시간 canvas 미리보기) → 끝 화면(카드·이미지 저장·텍스트 복사·고치기·공통 끝 화면). 받은 링크는 봉투 화면. 양 얼굴·구름·물결·불꽃은 canvas 도형 |
| `style.css` | 스타일 (연지 빨강 + 금빛. 제목·인사말 글꼴은 언어 파일 fonts — ko 나눔손글씨 붓, ja Yuji Syuku, zh 马善政 붓글씨) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일). `card.*` 는 카드 그림에 들어가는 문구, `editor.presets` 는 그 언어로 직접 쓴 덕담 예시 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어 → `tools/gen-guides.js` |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 |
| `tools/gen-og.js` | OG 이미지 (Chrome headless) |
| `tools/check-nycard.js` | 로직·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :9391 + mock-supa :9392, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js
node tools/check-all.js nycard

# 이 폴더(apps/nycard)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-nycard.js
node tools/flow-test.js            # 기본 en,ko,th,ru × 360,375,1440 (캡처: 세 번째 인자로 폴더)
```
