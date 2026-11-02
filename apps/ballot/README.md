# apps/ballot — 비밀 투표 (투표)

휴대폰 하나를 돌려 가며 하는 익명 투표. 송년회 시상식, 회식 메뉴, 반 결정처럼 한 자리에 모인 사람들이 한 명씩 혼자 투표하고, 마지막에 다 같이 질문 하나씩 두구두구 발표한다. 누가 무엇을 골랐는지는 어디에도 남기지 않는다(표 수 합계만). 시작 화면(설정) → 투표 화면(가림 → 투표용지 → 저장됨, 반복) → 결과 화면(한 질문씩 발표 → 최종 결과 + 공통 끝 화면). `#d=` 결과 링크는 공유 결과 화면.

- 시작 화면 `#screen-setup`: h1(현지 검색어)·훅 → 이어 하기 안내(진행 중 투표가 있을 때만) → 템플릿 4개(🏆 시상식(사람 뽑기 3문항, 기본) · 🍽️ 회식 메뉴 · 🎬 영화의 밤(2문항) · ✏️ 직접 만들기 — 언어마다 현지 예시) → 이름 목록(사람 뽑기 질문이 함께 쓰는 명단, 12명까지) → 질문 카드(JS 가 그림: 제목 · "사람 뽑기" 체크 · 선택지 한 줄에 하나, 1~5문항, 2~12개) → 질문 추가 → 투표 인원 2~40(이름 목록을 쓰면 손대기 전까지 이름 수로 자동) → 오류 → "비밀 투표 시작" → 공정성 한 줄 → 맨 끝 `mg-ad-start` 1자리.
- 입력 정리(`ballot-core.cleanList`): 줄바꿈·쉼표(、，)로 나눔, 공백 정리, 대소문자 무시 중복 제거, 40자. 빈 제목은 "질문 i". "자기 자신 못 뽑기"는 두지 않았다(익명이라 누가 누군지 모름).
- 투표 화면 `#screen-vote`(처음 hidden, 광고 자리 없음): 진행 줄("n명 중 i번째", 표 수 없음) → 가림("i번째 사람에게 폰을 건네주세요" → 준비) → 투표용지(질문마다 2칸 버튼 라디오, 모두 골라야 "투표하기" 켜짐) → 저장됨(투표용지 DOM 째 즉시 지움 → "다음 사람") → 모두 끝("결과 발표"). 진행자 도구: 지금 마감(1표 이상, 확인 창) · 투표 취소(확인 창). 투표 중에는 아무도(진행자도) 중간 집계를 못 본다.
- 비밀: `castBallot` 은 고른 선택지의 합계에 1씩 더할 뿐 표 자체는 돌려주지도 남기지도 않는다. 저장되는 것은 질문·인원·투표한 수·표 수·동점 깨기뿐.
- 결과 화면 `#screen-result`: 질문 하나씩 "질문 i / n" → 두구두구(3·2·1) → 카드 튀어나옴 + 막대(많은 순, 같으면 입력 순, 1등 금색, `{c}표 · {p}%`). 동점이면 "동점이에요!" + 공동 1위 + "공정하게 동점 깨기 🎲"(crypto 거부 샘플링, 후보를 잠깐 번갈아 비춘 뒤 "동점 추첨: ○○" + "랜덤으로 뽑았어요" 표시). "전체 결과 보기"로 건너뛰기 가능 → 최종 결과(모든 카드 · 결과 글로 복사 · 결과 링크 복사 · 결과 링크 공유(navigator.share 있을 때) · 질문 고치기) → `data-mg-end="ballot"`.
- 결과 링크 `#d=`: `{ v:1, n, q:[{ t, o, c, b }] }` JSON → UTF-8 → base64url(가림 없음 — 합계만 담기므로 숨길 것이 없다). 받는 쪽은 `sanitizeResult` 로 검사(질문 1~5 · 선택지 2~12 · 질문마다 합계 = n · b 는 동점 1등 중 하나일 때만). 열면 `#screen-shared`: 최종 결과 카드(동점 깨기 버튼 없음) + "나도 비밀 투표 만들기"(주소의 # 지우고 시작 화면). start/done 을 세지 않는다.
- 저장(localStorage, 모든 접근 try/catch): 초안 `mg_ballot_v1`(템플릿·이름·질문·인원·인원 직접 바꿈 여부), 진행 `mg_ballot_run_v1`(단계 voting|results, done, 질문·인원·cast·counts·tb — 읽을 때 `sanitizeSession` 으로 합계 재검사). 서버로 보내지 않는다(네트워크 호출 없음). 서버 숫자 없음.
- 기록: 투표 시작(`startVoting`) 때 `track('start')`, 최종 결과가 처음 보일 때(`showSummary`) `track('done')` — 새로고침 뒤 이어 하기는 다시 세지 않음. 공통 공유(setShareData)는 깨끗한 앱 주소. 다시 하기(setRetry) = 같은 질문으로 새 투표(start 다시 1번).
- 움직임 줄이기: 두구두구·카드 튀어나옴·막대 자람·동점 깜빡임 없이 바로. 진동은 `navigator.vibrate` 가 있을 때만.

주소: 원본은 자리표시자 `https://ballot.example.com/`, 배포 때 `https://melgene.com/ballot/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🗳️·카테고리 vote·등록일 2026-11-03·order 2·12개 언어 제목/설명) |
| `ballot-core.js` | crypto 거부 샘플링, 목록 정리, 초안 검사(validate), 진행(createSession·castBallot — 표 수만), 집계(tally·winnerOf·percent), 동점 깨기(breakTie·resolveTie), 저장된 진행 검사, `#d=` 인코딩/디코딩·검사 (UMD) |
| `ballot.js` | 설정(템플릿·이름·질문 카드·인원) → 투표(가림·투표용지·저장됨·마감·취소) → 발표(두구두구·동점 깨기) → 최종 결과(복사·링크) → 끝 화면, 이어 하기, `#d=` 공유 결과 화면 |
| `style.css` | 짙은 남색 밤 + 금색 투표함 + 크림색 투표용지, 산호색 강조 (Baloo 2 · ko Jua · ja Mochiy Pop One · zh ZCOOL KuaiLe · th Mitr · ru Rubik · vi 본문 Be Vietnam Pro) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 금색 투표함 + 체크한 투표용지 + 🤫·❓), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 + 템플릿(언어별 현지 음식·간식 예시, ko 송년회 · ja 忘年会 · ru новогодняя премия) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(폰 하나로 하는 법 · 익명 투표가 공정한 이유 · 송년회 시상식 진행 · 동점과 공정한 추첨 · 회식 메뉴·반 결정·결과 공유·멀리 있는 모임) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-ballot.js` | 로직(정리·검사·표 넣기·잘못된 표 거절·세션에 표 없음·무작위 1000판 합계 = 투표 수·집계·동점 감지·resolveTie 한 번만)·동점 깨기 공정성(카이제곱: 동점 2~6개 + resolveTie 경로)·결과 링크 왕복(한글·이모지·태국어·키릴)/변조 거절·진행 저장 검사·언어 파일(키·템플릿·FAQ·360px 문구·글꼴)·생성 HTML·OG 검사 |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감): 오류·이름·질문 추가/삭제 → 4명 투표(새로고침 이어 하기) → 발표·동점 깨기 → 최종 결과·끝 화면 → 결과 링크·깨진 링크·나도 만들기 + 움직임 줄이기·지금 마감·다시 하기 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js             # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js ballot    # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/ballot)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-ballot.js
node tools/flow-test.js en,ko,ru 360,1440
```
