# apps/santa — 마니또 뽑기 (투표)

휴대폰 하나로 하는 마니또(시크릿 산타) 뽑기: 이름을 넣고 뽑은 뒤 휴대폰을 돌리면 각자 자기 이름을 눌러 내 마니또만 몰래 확인한다. 누가 누구를 뽑았는지 전체 결과는 기본으로 아무도 보지 않는다. 시작 화면(설정) → 확인 화면(휴대폰 돌리기 → 선물 상자 → 가리기 + 진행자 도구) → 완료 카드 + 공통 끝 화면.

- 시작 화면 `#screen-setup`: h1(현지 검색어)·훅 → 모임 이름(선택) → 이름 3~30명(줄바꿈·쉼표, 같은 이름은 " 2") → 선물 예산·교환 날짜(선택) → "이 둘은 서로 안 뽑기" 제외 쌍(두 select + 추가, 칩 ×로 삭제, 최대 40쌍) → "2명끼리 서로 뽑기 막기"(2-cycle 금지, 기본 꺼짐) → "마니또 뽑기" → 공정성 한 줄 → 맨 끝 `mg-ad-start` 1자리.
- **뽑기**(`santa-core.draw`): crypto.getRandomValues 거부 샘플링으로 균등한 순열(Fisher–Yates)을 만들고, 자기 자신·제외 쌍(양방향)·2-cycle 조건을 만족할 때까지 버리고 다시(최대 20만 번) → 조건을 만족하는 모든 배정 위에서 정확히 균등. 먼저 백트래킹(선택지가 가장 적은 사람부터)으로 가능한 배정이 있는지 확인해, 없으면 `impossible`, 있는데 샘플링이 다 실패하면 `tooHard` 안내 — 치우친 결과를 대신 내놓지 않는다.
- 확인 화면 `#screen-play`(처음 hidden, 광고 자리 없음): 모임 이름·예산·날짜 띠 → "휴대폰을 돌려 주세요" + "n명 중 k명 확인" → 이름 버튼(2칸 격자) → 이름 누름 → 확인 창 "정말 ○○님인가요?"(이미 본 사람은 "다시 볼까요?") → 선물 상자(누르면 뚜껑이 열림) → "당신의 마니또는 ☆☆" + 예산·날짜 → "확인했어요, 가리기" → 이름 회색 ✓. 모두 확인하면 완료.
- 진행자 도구: 🔗 개인 링크 만들기(사람마다 "링크 복사" — 안내 문구 + 주소) · ✅ 다 확인했어요 · 👀 전체 결과 보기(경고 확인 창 뒤에만, "목록 가리기") · 🔄 새로 뽑기(확인 창) · ✏️ 명단 고치기(확인 창, 이번 뽑기 지움).
- 개인 링크 `#d=`: `{v:1, e:모임, g:주는 사람, r:받는 사람, b:예산, t:날짜}` JSON → UTF-8 → 무작위 4바이트 씨앗 xorshift XOR 가림 → base64url. 받는 사람 이름이 한눈에(또는 base64 를 풀어도) 읽히지 않을 뿐 암호는 아니다. 열면 그 사람의 선물 상자 하나만 보이고(명단·진행자 도구 없음), 열면 완료 카드.
- 완료 `#done`: 완료 카드(모두 확인 / 링크로 확인) → `data-mg-end="santa"`.
- 저장: 설정 `mg_santa_v1`(모임·이름·예산·날짜·제외 쌍·2명끼리 막기), 이번 뽑기 `mg_santa_draw_v1`(배정·확인 표시 — 휴대폰을 돌리는 동안 새로고침해도 이어지게, 읽을 때 `sanitizeDraw` 로 조건 재검사, "새로 뽑기"는 덮어쓰고 "명단 고치기"는 지움) — localStorage, 모든 접근 try/catch. 서버로 보내지 않는다(네트워크 호출 없음). 서버 숫자 없음.
- 기록: 뽑을 때마다 `track('start')`, 모두 확인했을 때·"다 확인했어요"·개인 링크 상자를 열었을 때 `track('done')`(한 번만, `markDone`). 공통 공유(setShareData)는 깨끗한 앱 주소. 다시 하기(setRetry) = 같은 명단으로 새로 뽑기(링크로 연 사람은 시작 화면으로).
- 움직임 줄이기: 상자 흔들림·뚜껑 애니메이션 없이 바로 열림.

주소: 원본은 자리표시자 `https://santa.example.com/`, 배포 때 `https://melgene.com/santa/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎁·카테고리 vote·등록일 2026-10-28·order 2·12개 언어 제목/설명) |
| `santa-core.js` | crypto 거부 샘플링, 균등 순열, 조건 행렬·검사(isValid), 가능 여부 백트래킹(feasible), 뽑기(draw), 이름·제외 쌍·날짜 정리, 저장된 뽑기 검사, `#d=` 가림 인코딩/디코딩 (UMD) |
| `santa.js` | 설정 → 뽑기 → 휴대폰 돌리기(확인 창·선물 상자·가리기) → 진행자 도구(개인 링크·전체 결과·새로 뽑기) → 완료 → 끝 화면, `#d=` 링크 열기 |
| `style.css` | 겨울 밤 초록 + 크리스마스 빨강 + 금색 리본, 눈송이 배경, 크림색 카드, 빨간 선물 상자(SVG) (Baloo 2 · ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mitr · ru Rubik · vi 본문 Be Vietnam Pro) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 뚜껑이 들린 선물 상자 + 물음표 쪽지 + 눈송이), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 (ko 마니또 · ja プレゼント交換 · de Wichteln · es Amigo invisible · pt Amigo secreto) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(뽑는 법·진행 팁·예산 예절·커플 제외와 공정성·멀리서 하는 법·Wichteln/Julklapp/Secret Santa/마니또 유래) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-santa.js` | 로직·뽑기 유효성(자기 자신·제외 쌍·2-cycle)·공정성(카이제곱: 전수 열거한 유효 배정 위 균등, 4명·4명 2-cycle 금지·5명 제외 1쌍·6명 제외 2쌍+2-cycle 금지)·불가능 판정(전수 열거와 일치)·`#d=` 왕복/가림/변조 거절·언어 파일·360px 문구·생성 HTML(**배정이 HTML 에 없음**)·OG 검사 |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js             # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js santa     # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/santa)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-santa.js
node tools/flow-test.js en,ko,ja 360,1440
```
