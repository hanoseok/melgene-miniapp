# apps/bmi — BMI 계산기 (만들기)

키와 몸무게를 넣는 대로 BMI(체질량지수)를 계산하는 한 화면 도구 앱(percent·age 처럼 시작 화면이 따로 없다). 성인(18세 이상)용, 의학적 조언이 아니라는 안내를 첫 화면에 둔다.

- 단위: cm·kg / ft·in·lb 토글. 바꾸면 들어 있던 값을 새 단위로 옮긴다. 마지막 단위만 localStorage `mg_bmi_unit`(try/catch). 기본 = cm·kg.
- 계산: `bmi-core.js` — BMI = kg ÷ m², 1 in = 2.54 cm, 1 lb = 0.45359237 kg. 화면 값은 소수 1자리 반올림, 단계는 그 반올림 값으로 정한다(24.96 → 25.0 → 과체중).
- 기준: WHO 6단계(18.5 · 25 · 30 · 35 · 40). "아시아 기준" 토글 = 언어별 기준 — ko 대한비만학회(kr: 18.5 · 23 · 25 · 30 · 35) · ja 日本肥満学会(jp: 18.5 · 25 · 30 · 35 · 40) · zh 中国成人标准(cn: 18.5 · 24 · 28) · 그 밖 WHO 아시아·태평양(asia: 18.5 · 23 · 25 · 30). ko·ja·zh·th·vi 는 처음부터 켜짐.
- 결과: 큰 BMI · 단계 이름 · 색 막대 + 표시 · 경계 숫자 · 기준 설명 · 내 키의 정상 체중 범위 · 범위까지 남은 kg/lb(올림, 0.1 이상).
- 선택 입력: 나이(2~120 정수 — 18세 미만이면 성인용 안내, 65세 이상 안내)·성별(남녀 기준이 같다는 안내). 계산 값은 바뀌지 않는다.
- 입력: `type=text inputmode=decimal`, "," "." 둘 다 소수점, 전각 숫자 허용. 오류: badNum · heightRange(50~272cm) · weightRange(10~650kg) · inchRange(피트가 있을 때 12인치 이상) · ageRange.
- 기록: 한 판에서 처음으로 숫자가 제대로 들어온 순간 `track('start')` 1번 → "BMI 요약 보기"를 처음 누르면 요약 카드 + 공통 끝 화면 + `track('done')` 1번. 다시 하기(`setRetry`) = 입력·성별을 비우고 새 판(단위·기준은 그대로).
- 개인정보: 키·몸무게·나이는 서버·저장소·주소 어디에도 없다. 공유 = 깨끗한 주소(`mgCleanUrl`) + 고정 문구(숫자 없음).
- 화면: h1·훅 → 입력 카드(단위 · 키·몸무게 · 나이·성별(접힘) · 아시아 기준) → 결과 카드 → 알아 둘 점 → 요약 보기 → (요약 뒤) `#result`(요약 + `data-mg-end="bmi"`) → 맨 아래 `mg-ad-start`(요약이 보이면 숨김).

주소: 원본은 자리표시자 `https://bmi.example.com/`, 배포 때 `https://melgene.com/bmi/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(⚖️ · create · 2026-10-24 · order 1 · 12개 언어 제목/설명) |
| `bmi-core.js` | 입력 해석·단위 환산·BMI·단계·정상 범위·오류 (UMD) |
| `bmi.js` | 한 화면 동작(단위·입력하는 대로 계산·색 막대·아시아 기준·나이·성별·요약·다시 하기·공유 데이터) |
| `style.css` | 연한 민트 + 진녹색 잉크 + 단계 색(파랑→초록→노랑·주황·빨강), 숫자 Space Grotesk |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** — 손으로 고치지 않는다 |
| `og/`, `favicon.svg` | OG 이미지(12개 언어, "?" 결과 카드 + 색 막대 + 저울), 아이콘 |
| `shared` | `../../shared` 심볼릭 링크 |
| `tools/i18n/<lang>.js` | 모든 문구(12개 언어, 키 구조 동일, `scales.alt.labels` = 그 언어 기준 단계 수) |
| `tools/guide/<lang>.js` | 긴 글 가이드 12개 언어(사용법 · 공식 · WHO/아시아 기준 · 한계 · 허리둘레·허리 대 키 비율 · 팁) |
| `tools/gen-i18n.js` | 페이지·사이트맵 생성 (보통 + `MG_I18N_MODE=variant`) |
| `tools/gen-og.js` | OG 이미지 (Chrome headless, `tools/lib/og-shot.js`) |
| `tools/check-bmi.js` | 로직(입력 해석·공식·미국식 환산 703 공식 300번·반올림 뒤 단계·경계 18.5/23/24/25/28/30/35/40·정상 범위·남은 몸무게·오류·나이)·언어 파일·생성 HTML·사이트맵·OG·bmi.js 저장/전송 규칙 |
| `tools/check-flow.js` | 실제 흐름(Chrome headless + 정적 서버 + mock-supa): 첫 화면·넘침, 계산·쉼표, 아시아 기준, 오류, 단위 변환, 나이·성별, track 횟수, 끝 화면 순서, 공유 데이터, 다시 하기, 단위 기억, 콘솔 오류 |

## 생성 · 검사

```bash
# 프로젝트 루트에서
node tools/gen-all.js            # SITES + 모든 앱 HTML + 가이드 + 링크 검사
node tools/check-all.js bmi      # 이 앱 검사(check-bmi + check-flow) + 가이드 검사

# 이 앱만
(cd apps/bmi && node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js)
node tools/gen-guides.js bmi && MG_I18N_MODE=variant node tools/gen-guides.js bmi
node apps/bmi/tools/gen-og.js all
(cd apps/bmi && node tools/check-bmi.js && node tools/check-flow.js)   # 예: node tools/check-flow.js ru,de 375 · SHOT=<폴더>
```
