# apps/seat — 자리 바꾸기 · 랜덤 자리 배치 (투표)

한 화면 도구: 이름(한 줄에 한 명 또는 쉼표, 최대 100명·이름 20자, 같은 이름은 " 2" " 3" — **숫자 하나만 쓰면 1..N 번호**) → 교실(줄 1~10 × 한 줄 자리 1~10, 기본 5×6) → 자리 지도(학생 쪽에서 본 모양, 교탁이 위)에서 자리를 눌러 **빈자리(통로)** 표시 또는 **이름 고정** → "자리 규칙(선택)"(접힘): **떨어뜨리기**(두 사람이 상하좌우·대각선으로 붙지 않음, 최대 30쌍) · **앞자리**(앞 두 줄 안) · 고정 자리 목록 → "자리 섞기"를 누르면 배치를 **먼저** 정하고 칠판 초록 교실에서 자리 카드가 앞줄부터 하나씩 뒤집힌다(건너뛰기 가능, 움직임 줄이기면 바로).

- 공정성: `crypto.getRandomValues` 거부 샘플링 → Fisher–Yates(`seat-core.js` 의 `arrange`). 고정 자리 먼저 → 앞자리 이름은 앞 두 줄 빈 곳 중 균등 → 나머지는 남은 자리 중 균등 → 떨어뜨리기 규칙을 어기면 통째로 다시(최대 600번, 이 단계 결과는 규칙을 지키는 모든 배치 중 균등) → 그래도 안 되면 무작위 순서 백트래킹(20만 노드). 못 찾으면 "모든 규칙을 지키는 배치가 없어요" 안내(규칙을 몰래 어기지 않음). 자리 부족·앞자리 부족·고정 충돌은 섞기 전에 `validate` 가 알려 준다.
- 결과 카드: 보는 쪽 전환(학생 쪽 = 교탁 위 / 선생님 쪽 = 180° 돌림, 교탁 아래), 이름 글자 크기 자동 맞춤, "텍스트 복사"(표 모양, 보는 쪽 반영), "PNG 저장"(canvas 1200px 폭, 보는 쪽 반영), "링크 복사".
- 공유 링크 `#d=<UTF-8 base64url(JSON {v:1,r,c,b?,n | k,s,t})>`: 이름(번호뿐이면 `k` 로 압축) + 교실 + 자리별 이름 번호. 받은 사람은 **다시 섞지 않고** "🔗 공유된 자리 배치표" 로 본다(`decodeShare` 가 줄·칸·막은 자리·이름·배치를 모두 검사, 틀리면 "링크가 깨졌어요"). 규칙(떨어뜨리기·앞자리·고정)은 링크에 담지 않는다. 공유 자리표는 start/done 을 세지 않고, 다시 하기 = "나도 자리 바꾸기"(입력으로 돌아감). 쿼리(`?`)는 쓰지 않는다.
- 저장: 마지막 이름·교실·규칙만 localStorage `mg_seat_last_v1`(모든 접근 try/catch, "지우기" 버튼). 서버로 보내지 않는다. 서버 숫자 없음.
- 기록: "자리 섞기"를 누를 때 `track('start')`, 마지막 자리가 공개(또는 건너뛰기)될 때 `track('done')`(다시 섞을 때마다 또).
- 따로 시작 화면이 없는 도구 앱(randnum 과 같은 방식): 첫 화면 `#screen-seat` = h1(현지 검색어)·훅 → 이름 카드 → 교실 카드 → 규칙(접힘) → 섞기 → 결과(`#result`, 섞은 뒤 보임: 자리표 카드 → 공통 끝 화면 `data-mg-end="seat"`) → 맨 끝 `mg-ad-start` 1자리. 결과가 보이면 `mg-ad-start` 는 숨긴다(한 화면 광고 1개).

주소: 원본은 자리표시자 `https://seat.example.com/`, 배포 때 `https://melgene.com/seat/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🪑·카테고리 vote·등록일 2026-10-13·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `seat-core.js` | crypto 거부 샘플링·Fisher–Yates, 이름 읽기, 교실(인접·줄칸 바꿀 때 위치 옮기기), 검사(validate), 배치(arrange: 균등+거절 → 백트래킹), 규칙 확인(satisfies), 화면 순서·텍스트 표, `#d=` 인코딩/디코딩 (UMD) |
| `seat.js` | 한 화면: 이름 → 교실·자리 지도 → 규칙 → 섞기 → 뒤집기 공개 → 자리표·복사·PNG·링크 → 끝 화면, `#d=` 공유 자리표 보기 |
| `style.css` | 크림 공책 종이 + 칠판 초록 교실 + 나무 교탁 + 머스터드 (Baloo 2 · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr · ru Rubik) |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 교탁 + 자리 카드, 이름 없음), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 + 그 나라 흔한 예시 이름 20개 (12개 언어, 키 구조 동일) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(만드는 법·선생님들의 활용·규칙·공정한 이유·공유와 이름 보호) → `tools/gen-guides.js` 가 guide.html |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-seat.js` | 로직·규칙·불가능 판정·공정성(카이제곱 5종)·`#d=` 왕복/변조 거절·언어 파일·360px 문구·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :8771 + mock-supa :8772, 공유 링크 왕복 포함, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js seat        # 이 앱 검사만 (+ 가이드 검사)

# 이 폴더(apps/seat)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-seat.js
node tools/flow-test.js             # en,ko,th,ru × 360,375,1440 (+ 움직임 줄이기)
```
