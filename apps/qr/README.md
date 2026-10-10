# apps/qr — QR코드 생성기 (만들기)

한 화면 도구: 종류(링크 · 글자 · 와이파이 · 이메일 · 전화)를 고르고 입력하면 그 자리에서 QR코드 미리보기가 바뀐다(0.12초 디바운스). PNG(256~2048px)·SVG 저장, 지원 브라우저에서는 이미지 복사(ClipboardItem). 옵션(접힘): 코드·바탕 색(대비 4:1 미만·밝은 코드 경고), 오류 정정 L/M/Q/H(기본 M), 이미지 크기, 여백(콰이어트 존 0~8, 기본 4, 2 미만 경고).

- **인코더는 직접 구현** (`qr-core.js`, 외부 라이브러리 없음): 숫자·영숫자·바이트(UTF-8, ECI 없음) 중 내용 전체에 맞는 가장 촘촘한 모드, 버전 1~40 자동(가장 작은 버전), Reed–Solomon(GF(256)/0x11D), 블록 나누기·끼워 넣기, 마스크 8개 벌점(N1~N4) 최소 선택, 형식 정보(BCH 0x537 ^ 0x5412)·버전 정보(v7+, BCH 0x1F25).
- 내용 형식: 링크(scheme 없으면 `https://` 자동) · 글자(그대로) · 와이파이 `WIFI:T:WPA|WEP|nopass;S:…;P:…;H:true;;`(`\ ; , : "` 는 `\` 로 escape) · `mailto:주소?subject=…&body=…` · `tel:+숫자`.
- **개인정보**: 입력 내용은 브라우저 메모리에서만 처리 — 저장(localStorage 등)·전송 없음. 공유 버튼은 앱 주소만 공유한다(사용자 내용 X). check 스크립트가 qr.js·qr-core.js 에 fetch/XHR/저장소가 없는지 본다.
- 기록: 한 판 = 코드를 처음 만든 순간 `track('start')` → 그 코드를 처음 저장/복사한 순간 `track('done')`. 같은 코드를 또 저장해도 done 은 한 번, 저장 뒤 내용·옵션을 바꿔 새 코드가 되면 새 판.
- 따로 시작 화면이 없는 도구 앱(dice·roulette 와 같은 방식): 첫 화면 `#screen-qr` = h1(현지 검색어)·훅 → 종류·입력 → 미리보기 → 저장 버튼 → 옵션(접힘) → "브라우저 안에서만" 안내 → 결과(`#result`, 첫 저장 뒤 보임) 안에 공통 끝 화면(`data-mg-end="qr"`, 다시 하기 = 입력 비우고 새 코드) → 맨 끝 `mg-ad-start` 1자리. 결과·끝 화면이 보이면 `mg-ad-start` 는 숨긴다(한 화면 광고 1개).

주소: 원본은 자리표시자 `https://qr.example.com/`, 배포 때 `https://melgene.com/qr/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🔳·카테고리 create·등록일 2026-10-11·order 1·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `qr-core.js` | QR 인코더 + 내용 만들기(와이파이·링크·mailto·tel) + 색 대비 + SVG (UMD) |
| `qr.js` | 한 화면: 종류·입력 → 미리보기 canvas → PNG·SVG·복사 → 결과·끝 화면 |
| `style.css` | 종이색 모눈 바탕 + 검정 잉크 테두리 + 파랑·라임 포인트 (Unbounded · ko Pretendard · ja M PLUS 1p · zh 시스템/Noto Sans SC · th Mitr) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 앱 주소를 담은 진짜 QR + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(QR코드란·만드는 법·와이파이 QR·인쇄 팁·역사(덴소 웨이브 1994)·안전하게 스캔) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-qr.js` | 인코더 KAT(HELLO WORLD 1-M/1-Q 코드워드·형식 정보 32개·버전 정보·정렬 무늬·용량 표·기준 행렬) + 자체 디코더 되읽기(버전 1~40 × L/M/Q/H, 마스크 0~7, UTF-8) + 언어 파일·생성 HTML·개인정보·OG 검사 (의존성 없음) |
| `tools/check-flow.js` | Chrome headless 실제 흐름(en·ko × 360·1440): 입력 → 미리보기 칸 = 행렬, 와이파이 escape, 대비 경고, 길이 초과, PNG 1024² 칸 비교, start/done 횟수, 끝 화면 순서, 공유에 내용 없음, 콘솔 오류 0. `JSQR=<jsQR.js>` 를 주면 PNG 를 jsQR 로도 읽음 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js qr          # 이 앱 검사만 (check-qr + check-flow + 가이드)

# 이 폴더(apps/qr)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-qr.js
node tools/check-flow.js en,ja,ru 360,1440
```
