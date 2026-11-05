# apps/aim — 에임 연습 (게임)

에임 연습(Aim Trainer, エイム練習, 瞄准训练, Аим тренер). **플레이 영역에 무작위로 나타나는 과녁을 최대한 빨리 맞힌다.** 가운데 시작 과녁을 맞힌 순간 시작(시작 과녁은 점수에 넣지 않음).
- 클래식: 과녁 30개를 하나씩. 점수 = 과녁 하나당 평균 시간(ms, 낮을수록 좋음).
- 타임어택(Timed): 30초. 과녁은 수명 동안 40% 크기까지 줄어들다 사라지고(놓침), 수명은 1.7초 → 0.95초로 짧아진다. 점수 = 맞힌 수.
결과 = 점수 + 정확도(맞힘 ÷ 누른 수) + 평균 시간/빗나감/총 시간/놓침 + 내 등급(6단계 중 내 것만, 정확도 70% 미만이면 한 단계 내림) + 모드별 내 최고 + 서버 실제 백분위.
시작(티징 + 모드 고르기 + 한 줄 방법 + 맨 아래 광고 1개) → 게임(HUD 시간·맞힘·정확도 + 진행 막대 + 플레이 영역, 광고 없음) → 끝 화면(결과 카드 → 공통 끝 화면).

- 입력: 플레이 영역의 `pointerdown` 만. 맞힘 판정은 누른 점과 과녁 중심의 거리(보이는 반지름 + 터치 8px / 마우스 2px 여유). 키보드는 쓰지 않는다. `touch-action: none` 등으로 확대·선택·메뉴 막기.
- 위치: `crypto.getRandomValues`, 바로 전 과녁과 정규화 거리 0.3 이상.
- 시간: `performance.now()` + `requestAnimationFrame`, 누른 시각은 이벤트 `timeStamp`. 끝나면 0.6초(`LOCK_MS`) 입력 잠금.
- 진행 중 탭을 떠나면(visibilitychange hidden) 그 판은 무효 — 안내 후 같은 모드로 다시 준비.
- `prefers-reduced-motion`: 과녁 등장·맞힘 효과·시작 과녁 깜빡임 끔(Timed 의 줄어듦은 규칙이라 유지).
- 숫자는 진짜만: `supa.submitScore(C.gameKey(모드), bucket)` 한 번 — `aim-classic` bucket = 평균 ms ÷ 10(0..500, 낮을수록 좋음), `aim-timed` bucket = 맞힌 수(0..100). **평균 150ms 미만·Timed 100개 초과·Classic 미완료는 보내지 않고 최고 기록에도 넣지 않는다**(안내 `result.invalid`).
- 설정: localStorage `aim_prefs_v1`, 모드별 최고 `aim_best_v1`.
- track: 시작 과녁을 맞혀 판이 시작될 때 `track('start')`, 끝 화면에 닿을 때 `track('done')`.

주소: 원본은 자리표시자 `https://aim.example.com/`, 배포 때 `https://melgene.com/aim/`. 규칙은 `.claude/skills/melgene-miniapp/SKILL.md`.

## 파일

| 파일 | 역할 |
|---|---|
| `app.config.js` | 등록 정보(🎯·game·2026-11-06·order 1·12개 언어 제목/설명) |
| `aim-core.js` | 모드·게임 이름·위치·시작/맞힘/빗나감/놓침·크기·수명·요약·등급·isValid·bucket·방향별 백분위 (UMD) |
| `aim.js` | 화면·입력·HUD·과녁 그리기·잠금·탭 이탈 무효·끝 화면·점수 전송. 검사용 `window.AIM_APP` |
| `style.css` | 짙은 남색 + 코럴 과녁 + 민트, 숫자 Chakra Petch |
| `index.html`, `privacy.html`, `guide.html`, `<lang>/`, `_l/`, `sitemap.xml` | **생성물** |
| `og/`, `favicon.svg` | OG 이미지(12개 언어), 아이콘 |
| `tools/i18n/<lang>.js` · `tools/guide/<lang>.js` | 문구 · 긴 글 가이드 (12개 언어) |
| `tools/gen-i18n.js` · `tools/gen-og.js` | 페이지·사이트맵 생성 · OG 이미지 |
| `tools/check-aim.js` | 로직·언어 파일(360px 폭 포함)·생성 HTML·입력 규칙·OG 검사 (check-all 자동) |
| `tools/flow-test.js` | Chrome headless 실제 흐름 검사(느림, check-all 에 안 들어감) |

## 생성 · 검사

```bash
# 이 폴더(apps/aim)에서
node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
node tools/gen-og.js all
node tools/check-aim.js
node tools/flow-test.js en,ko 360,1440      # 실제 흐름 (Timed 포함, 몇 분)
```
