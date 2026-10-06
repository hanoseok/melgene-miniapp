# apps/lotto — 로또 번호 생성기 (투표)

한국 로또 6/45 · 유로 방식 5/50 + 스타 2/12 · 미국 파워볼 5/69 + 1/26 · 직접 정하기(1..M 중 N개, M ≤ 100, N ≤ 10) 중에서 고르고, 게임 수(1~5), 꼭 넣을 번호·뺄 번호(본 번호에만 적용)를 정해 "공 뽑기"를 누르면 번호를 **먼저** 뽑고, 추첨기 연출 뒤 게임마다 정렬된 공이 하나씩 굴러 나온다(움직임 줄이기면 바로). 공 색은 한국 로또 구간(1~10 노랑 · 11~20 파랑 · 21~30 빨강 · 31~40 회색 · 41~ 초록). 번호 복사 버튼, 다시 뽑기, 설정으로 돌아가기.

- 공정성: `crypto.getRandomValues` 거부 샘플링 + 부분 Fisher-Yates(편향 없음). 연출은 결과에 영향이 없다. 고정 번호는 항상 포함, 제외 번호는 절대 나오지 않는다.
- **오락용 안내**: 도구 화면·결과 화면·FAQ 에 "오락용, 예측·당첨 보장 아님"을 분명히 쓴다. 당첨 확률 수치·향상 주장은 어디에도 넣지 않는다(check 가 퍼센트·확률 수치를 막는다).
- 전부 클라이언트: 입력한 번호·결과는 저장하지도 서버로 보내지도 않는다. 서버 숫자 없음. 기록 = 뽑기를 누를 때 `track('start')`, 결과가 보일 때 `track('done')`.
- 결과 화면 → 공통 끝 화면(`data-mg-end="lotto"`, 다시 하기 = 다시 뽑기). 광고: 시작 화면 맨 아래 `mg-ad-start` 1자리 + 설정 화면 뽑기 버튼 아래 `mg-ad` 1자리 + 끝 화면 공통 컴포넌트.

주소: 원본은 자리표시자 `https://lotto.example.com/`, 배포 때 `https://miniapp.melgene.com/lotto/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🎱·카테고리 vote·등록일 2026-10-07·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `lotto-core.js` | 프리셋, crypto 거부 샘플링 뽑기, 고정·제외 규칙, 입력 파싱, 공 색 구간, 복사 문장 (UMD) |
| `lotto.js` | 시작(티징) → 설정·추첨기 연출 → 게임별 정렬된 공 결과 |
| `style.css` | 크림 바탕 + 남색 잉크 + 로또 공 색 + 빨강 버튼 (Nunito · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 공 5개 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-lotto.js` | 로직·공정성(통계)·고정/제외 규칙·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js lotto       # 이 앱 검사만

# 이 폴더(apps/lotto)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-lotto.js
```
