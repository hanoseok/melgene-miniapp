# apps/ghost — 나만의 유령 만들기 · 할로윈 유령 캐릭터 메이커 (만들기)

몸 모양 5 · 색 6(흰색·민트·라벤더·핑크·야광 초록·한밤) · 눈 10 · 입 10 · 볼 4 · 모자·장식 8 · 들고 있는 것 6 · 배경 4 + 이름(선택, 20자) → 둥실둥실 떠다니는 완성 유령 + 이미지 저장(SVG → canvas PNG 1080×1300, 휴대폰은 공유 시트) + `#d=` 공유 링크(받은 사람은 같은 유령 + "나도 만들기").

주소: 원본은 자리표시자 `https://ghost.example.com/`, 배포 때 `https://miniapp.melgene.com/ghost/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지·카테고리 create·등록일·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `ghost-core.js` | 부품 목록·정규화·이름 정리·무작위·`#d=` 인코딩(UTF-8 base64url `{"v":1,"p":[b,c,e,m,k,h,i,g],"n":이름}`)·SVG 그림 (UMD) |
| `ghost.js` | 시작(티징: 물음표 실루엣) → 편집기(탭 8개·유령 누르면 다음 부품·랜덤) → 끝 화면(이미지 저장·공유·다시 하기) |
| `style.css` | 스타일 (둥실둥실 `.gh-float`, prefers-reduced-motion 이면 멈춤. 제목 글꼴 Nunito / ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mali) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-ghost.js` | 로직·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :8741 + mock-supa :8742, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js              # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js ghost      # 이 앱 검사만

# 이 폴더(apps/ghost)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all           # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-ghost.js
node tools/flow-test.js            # 기본 en,ko,th,ru × 360,375,1440 (캡처: 세 번째 인자로 폴더)
```
