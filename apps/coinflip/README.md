# apps/coinflip — 동전 던지기 & 주사위 (투표)

앞면/뒷면 두 선택지 이름을 사용자가 바꿀 수 있는 동전 던지기(기본 이름은 언어별 앞/뒤)와 6면 주사위 1~3개 굴리기 탭. "던지기/굴리기"를 누르면 결과를 **먼저** 뽑고, 동전은 회전하며 그 면으로 떨어지고 주사위는 잠깐 굴러 그 눈에 멈춘다(움직임 줄이기면 바로). 결과 화면에는 **결과 하나**와 이번 세션 누적 횟수(동전은 면별 횟수 포함)가 나온다.

- 공정성: `crypto.getRandomValues` 거부 샘플링(동전 2면·주사위 6면 모두 같은 확률). 연출은 결과를 보여 줄 뿐 결과에 영향이 없다.
- 선택지 이름: 최대 12자, 비우면 기본 이름, 저장하지 않는다(결과·누적도 이 페이지를 연 동안만).
- 숫자: 서버 숫자 없음 — 보이는 숫자는 직접 던진 횟수뿐. 기록 = 던지기·굴리기를 누를 때 `track('start')`, 결과가 보일 때 `track('done')`(다시 던질 때마다 또).
- 결과 화면: 다시 던지기(탭에 따라 동전/주사위) · 설정으로 돌아가기 → 공통 끝 화면(`data-mg-end="coinflip"`, 다시 하기 버튼 문구는 `setRetry` 로 동전/주사위에 맞춤).
- 광고: 시작 화면 맨 아래 `mg-ad-start` 1자리 + 도구 화면 던지기 버튼 아래 `mg-ad` 1자리 + 끝 화면 공통 컴포넌트.

주소: 원본은 자리표시자 `https://coinflip.example.com/`, 배포 때 `https://miniapp.melgene.com/coinflip/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(이모지 🪙·카테고리 vote·등록일 2026-10-05·order 2·12개 언어 제목/설명) → `tools/gen-sites.js` 가 SITES 로 모은다 |
| `coinflip-core.js` | crypto 거부 샘플링, 동전·주사위 뽑기, 이름 다듬기, 세션 누적 (UMD) |
| `coinflip.js` | 시작(티징) → 동전/주사위 도구 → 결과 + 누적 |
| `style.css` | 연하늘 바탕 + 남색 잉크 + 금빛 동전 + 주황 버튼 (Nunito · ko Jua · ja M PLUS Rounded 1c · zh ZCOOL KuaiLe · th Mitr) |
| `index.html`, `privacy.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, 동전 + 주사위 + 제목), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 (배포 때 실제 파일로 복사) |
| `tools/i18n/<lang>.js` | 모든 문구 (12개 언어, 키 구조 동일) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (`tools/gen-all.js` 가 자동 탐색, 보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-coinflip.js` | 로직·공정성(통계)·언어 파일·생성 HTML·OG 검사 (`tools/check-all.js` 가 자동 탐색) |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js               # SITES + 모든 앱 HTML + 링크 검사
node tools/check-all.js coinflip     # 이 앱 검사만

# 이 폴더(apps/coinflip)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all            # OG 이미지 (언어 지정: node tools/gen-og.js ja ko)
node tools/check-coinflip.js
```
