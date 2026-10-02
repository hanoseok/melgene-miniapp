# apps/team — 랜덤 팀 나누기 · 조 편성 (투표)

이름을 붙여 넣고(한 줄에 한 명 또는 쉼표, 최대 60명·이름 20자) 팀 수 또는 팀당 인원을 골라 섞으면, 카드가 팀 상자로 날아가는 약 1.5초 애니메이션(움직임 줄이기면 바로) 뒤에 색깔 팀 카드 + 재미있는 팀 이름(동물 20개, 언어별 이름)이 나온다. 이름 앞/뒤 `*`(＊ ★) = 주장 → "주장은 서로 다른 팀으로" 를 켜면 주장부터 팀마다 한 명씩.

- 공정성: `crypto.getRandomValues` 거부 샘플링 → Fisher–Yates. 모든 배치가 같은 확률, 팀 인원 차이 ≤ 1, 팀 순서도 섞음(누가 1명 많은 팀인지 무작위).
- 결과: 팀 이름 다시 뽑기 · 다시 섞기 · 이름 고치기 · 텍스트로 복사(끝에 공유 링크) → 공통 끝 화면(`data-mg-end="team"`).
- 공유 링크 `#d=`: `{ v:1, n: 이름(주장은 앞에 *), t: 팀별 사람 번호, a: 팀별 동물 번호 }` JSON → UTF-8 base64url. 서버 저장 없음. 받는 사람은 같은 팀을 자기 언어로 보고 "나도 팀 나누기" → 입력 화면. 공유 결과를 여는 것은 start/done 으로 세지 않는다.
- 숫자: 서버 숫자 없음(보이는 숫자는 입력한 사람 수·팀 수뿐). 기록 = 섞기 누를 때 `track('start')`, 결과가 다 보일 때 `track('done')`.
- 마지막 목록·방식·주장 설정은 localStorage `team_last_v1` 에만.
- 광고: 시작 화면 맨 아래 `mg-ad-start` 1자리 + 입력 화면 섞기 버튼 아래 `mg-ad` 1자리 + 끝 화면 공통 컴포넌트.

주소: 원본은 자리표시자 `https://team.example.com/`, 배포 때 `https://miniapp.melgene.com/team/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎲·카테고리 vote·등록일 2026-10-01·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `team-core.js` | 이름 읽기, 팀 수 범위, crypto 섞기·팀 만들기, 팀 동물 20개(id·이모지·색, **순서 바꾸지 않음** — 공유 링크 번호), 공유 인코딩/검증 (UMD) |
| `team.js` | 시작(티징) → 입력 → 섞기 애니메이션 → 결과 / 공유 링크로 연 결과 |
| `style.css` | 크림 마룻바닥 + 남색 잉크 + 팀 색 띠 카드 (Nunito · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 빈 팀 상자 + 주사위), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 + 팀 이름 20개 + 그 나라 흔한 예시 이름 12개 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-team.js` | 로직·공정성(통계)·공유 인코딩·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |
| `tools/flow-test.js` | headless 전체 흐름 (python3 http.server :8751 + mock-supa :8752, 공유 링크 왕복 포함, check-all 에는 안 들어감) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js team         # 이 앱 검사만

# 이 폴더(apps/team)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-team.js
node tools/flow-test.js             # 기본 en,ko,th,ru × 360,375,1440 (+ 움직임 줄이기 한 번). 캡처: 세 번째 인자로 폴더
```
