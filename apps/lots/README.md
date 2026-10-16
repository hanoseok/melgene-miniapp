# apps/lots — 제비뽑기 (투표)

휴대폰을 돌려 가며 한 명씩 **접힌 종이 쪽지**를 고르는 제비뽑기. 시작 화면(설정) → 뽑기 화면(쪽지 격자) → 끝 화면(누가 뭘 뽑았나).

- 시작 화면 `#screen-setup`: h1(현지 검색어)·훅 → 쪽지 수(2~50) · 참가자 이름(선택, 접힘 — 넣으면 쪽지 수 = 이름 수, 같은 이름은 " 2") → 쪽지 내용(**당첨 / 꽝**: 당첨 장수만 / **직접 쓰기**: 라벨 20자 + 장수 + 🎉축하 여부, 10가지까지, 합계 = 쪽지 수, "나머지는 꽝으로") → 옵션(본 결과 바로 가리기·당첨 꽃가루, 기본 켬) → "쪽지 접기" → 최근 설정 5개 → 맨 끝 `mg-ad-start` 1자리.
- 뽑기 화면 `#screen-draw`(광고 없음): 진행 "3/10장 뽑음" + 막대, "OO 차례", 접힌 쪽지 격자(No.01…, 조금씩 기울어짐). 쪽지를 누르면 앱 폭 안 덮개에서 종이가 펼쳐지며(위 절반이 접힌 자국을 축으로 넘어감) 라벨이 나온다(움직임 줄이기면 바로, 꽃가루 없음). "다음 사람" → 가리기 켬이면 "OO에게 폰을 넘겨 주세요" 덮개 → "준비됐어요". 가리기 끔이면 뽑힌 쪽지에 라벨이 남는다. "여기서 그만 뽑기"는 두 번 눌러야 끝남.
- 끝 화면 `#screen-end`: 결과 카드(차례 순서 이름/번호 → 라벨, 쪽지별 정리, 안 뽑은 쪽지 수) · "글로 복사" · "결과 링크 복사"(`#d=`) · "설정 바꾸기" → `data-mg-end="lots"`.
- 공정성: "쪽지 접기" 순간 `crypto.getRandomValues` 거부 샘플링 + Fisher–Yates 로 한 번 섞어 위치마다 내용이 정해진다(`lots-core.js` `makeDeck`). 고르는 순서·위치와 상관없이 같은 확률. 연출은 결과에 영향 없음.
- 공유 링크 `#d=<UTF-8 base64url(JSON {v:1,k:[[라벨,장수,축하]],m?:[이름],r:[종류 번호(차례 순)],t})>`: 받은 사람은 다시 뽑지 않고 "🎟️ 공유된 제비뽑기 결과"로 본다. `decodeShare` 가 종류·장수·이름 수·결과 수·종류별 받은 수를 검사하고 라벨·이름을 정리(꺾쇠·제어 문자 제거), 틀리면 "링크가 깨졌어요". 공유 결과는 start/done 을 세지 않고 다시 하기 = "나도 제비뽑기 만들기"(설정으로). 끝 화면 공통 공유(setShareData)는 깨끗한 주소.
- 저장: 최근 설정 5개만 localStorage `mg_lots_recent_v1`(모든 접근 try/catch). 서버로 보내지 않는다. 서버 숫자 없음.
- 기록: "쪽지 접기"로 뽑기가 시작될 때 `track('start')`, 끝 화면이 보일 때 `track('done')`(다시 뽑을 때마다 또).

주소: 원본은 자리표시자 `https://lots.example.com/`, 배포 때 `https://melgene.com/lots/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎟️·카테고리 vote·등록일 2026-10-17·order 2·12개 언어 제목/설명) |
| `lots-core.js` | crypto 거부 샘플링·Fisher–Yates, 글자 정리·이름 읽기, 검사(validate), 뽑기 판(newSession/pick/results/tally), `#d=` 인코딩/디코딩, 최근 설정 (UMD) |
| `lots.js` | 설정 → 쪽지 격자 → 펼침·폰 넘기기 → 결과·복사·링크 → 끝 화면, `#d=` 공유 결과 보기 |
| `style.css` | 크래프트지 바탕 + 응모권 모양 카드(반원 홈) + 흰 종이 쪽지 + 빨간 타자기 번호 + 겨자색 도장 (Alfa Slab One · ko Black Han Sans · ja Dela Gothic One · zh ZCOOL QingKe HuangYou · th Kanit · ru Rubik · vi 본문 Be Vietnam Pro, 번호 Courier Prime) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 접힌 쪽지 + 펼친 당첨 쪽지), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구 + 그 나라 예시 쪽지(커피 쏘기·벌칙 등) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(하는 법·공정한 이유·폰 넘길 때 비밀·교실/회사/모임/선물 교환 아이디어·제비뽑기의 역사) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-lots.js` | 로직·검사·공정성(카이제곱 7종)·`#d=` 왕복/변조 거절·언어 파일·360px 문구·생성 HTML·OG 검사 |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :8791 + mock-supa :8792, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js            # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js lots     # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/lots)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-lots.js
node tools/flow-test.js en,ko,th 360,1440 [캡처 폴더]
```
