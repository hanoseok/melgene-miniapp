# apps/penalty — 벌칙 카드 뒤집기 (투표)

뒷면 카드를 한 장씩 뒤집어 벌칙 당첨자를 정하는 송년회·술자리용 도구. 시작 → 설정 → 뒤집기 → 끝(누가 벌칙인지).

- 시작 `#screen-start`: h1(현지 검색어)·한 줄 훅·시작 버튼, 맨 끝 `mg-ad-start` 1자리. 벌칙 문구·FAQ 없음.
- 설정 `#screen-setup`: 참가 인원 2~12(스테퍼) · 벌칙 카드 장수 1~인원(기본 자동: 인원÷3 반올림, 최소 1; 직접 바꾸면 자동 갱신 멈춤) · 벌칙 문구(줄바꿈, 12개 언어 기본 10개, 최대 30개·60자) · 참가자 이름(선택, 접힘) → "카드 섞기".
- 뒤집기 `#screen-flip`(광고 없음): 뒷면 카드 격자, 누르면 한 장씩 뒤집힘(벌칙 = 주황빨강, 무사 = 청록), 남은 장 수·진행 막대·"다음 차례"(이름 또는 "N번"), "한꺼번에 뒤집기", "다시 섞기"(아무 카드도 뒤집기 전에만), 모두 뒤집으면 "결과 보기".
- 끝 `#screen-end`: 그 판의 "나온 사람과 벌칙" 요약 · 무사 명단 · "글로 복사" · "결과 링크 복사"(`#d=`) · "설정 바꾸기" → `data-mg-end="penalty"`(공통 끝 화면).
- 공정성: "카드 섞기"를 누르는 순간 `crypto.getRandomValues` 거부 샘플링 + Fisher–Yates 로 벌칙 위치를 정하고, 벌칙 문구는 목록을 섞어 순서 없이 뽑는다. 뒤집는 것은 보여 주기만 한다.
- 기록: 카드 섞기 시 `track('start')` 1번, 결과 보기(끝 화면) 시 `track('done')` 1번. 공유 링크로 본 결과는 세지 않는다.
- 공유 `#d=<UTF-8 base64url(JSON {v,n,m?,r})>`: 받은 사람은 같은 결과를 "공유된 결과"로 본다(다시 섞지 않음). 틀린 링크는 "링크가 깨졌어요".
- 저장: 마지막 설정만 localStorage `penalty_state`(try/catch). 서버로 보내지 않는다.

주소: 원본은 자리표시자 `https://penalty.example.com/`, 배포 때 `https://melgene.com/penalty/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🃏 · 카테고리 vote · 등록일 2026-11-11 · order 2 · 12개 언어 제목/설명) |
| `penalty-core.js` | 인원·벌칙 장수 검사, 기본 장수, 거부 샘플링 셔플, 배정(deal), 뒤집기(flip), 공유 링크 인코딩/디코딩, 저장 값 정리 (UMD) |
| `penalty.js` | 시작·설정·뒤집기·끝 화면, 공유 결과 보기, 기록, 저장 |
| `style.css` | 짙은 초록 펠트 바탕, 금색 뒷면 카드, 3D 뒤집기(움직임 줄이기면 전환 끔) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 + 기본 벌칙 문구 10개 |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(하는 법·공정한 이유·안전한 분위기·벌칙 고르는 팁) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-penalty.js` | 등록 정보·로직(공정성 포함)·공유 링크·언어 파일·생성 HTML(스포일러·광고 자리) 검사 |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :8791 + mock-supa :8792, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js                 # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js penalty       # 이 앱 검사 (+ 가이드 검사)

# 이 폴더(apps/penalty)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node ../../tools/gen-guides.js penalty && MG_I18N_MODE=variant node ../../tools/gen-guides.js penalty
node tools/gen-og.js all
node tools/check-penalty.js
node ../../tools/check-guides.js penalty
node tools/flow-test.js en,ko 360,1440 [캡처 폴더]
```
