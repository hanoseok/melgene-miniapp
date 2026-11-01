/* 10초 맞추기 — ko (10 Second Challenge / timer)
 * Rules live in timer-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + target/blind choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {total} {time} {pct} {tier} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Jua&display=swap",
    "display": "'Jua', 'Fredoka'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "keep-all",
    "hyphens": "manual"
  },
  "meta": {
    "title": "10초 맞추기 게임 – 타이머 딱 10.00초에 멈추기",
    "description": "10초 맞추기 게임: 스톱워치를 시작하고 감으로 정확히 10.00초에 멈춰 보세요. 3번 도전, 블라인드 모드, 5초·30초 모드까지. 설치 없이 무료.",
    "ogTitle": "10초 맞추기 게임 ⏱️ 딱 10.00초에 멈출 수 있을까?",
    "ogDescription": "머릿속으로 세다가 정확한 순간에 STOP! 3번 도전, 블라인드 모드에선 숫자가 사라져요."
  },
  "siteName": "10초 맞추기",
  "privacyLink": "개인정보처리방침",
  "start": {
    "badge": "⏱️ 10초, 감으로 맞출 수 있을까?",
    "h1Kicker": "10초 맞추기 게임",
    "h1Html": "타이머를 멈춰라<br><em>딱 10.00초에!</em>",
    "hook": "스톱워치를 시작하고 머릿속으로 세다가 정확한 순간에 멈추세요. 세 번 도전해서 가장 가까운 기록이 내 결과예요.",
    "targetLabel": "목표 시간",
    "targetValue": "{n}초",
    "blindLabel": "블라인드 모드",
    "blindDesc": "3초가 지나면 숫자가 사라져요",
    "how": "시작 → STOP · 화면 아무 데나 눌러도 멈춰요",
    "start": "도전하기 →",
    "facts": "3번 도전 · 5·10·30초 · 내 최고 기록 깨기"
  },
  "play": {
    "target": "목표 {t}",
    "blindTag": "블라인드",
    "attempt": "{total}번 중 {n}번째 도전",
    "go": "시작",
    "stop": "STOP",
    "next": "다음 도전",
    "finish": "결과 보기",
    "readyHint": "시작을 누르고 딱 {t}에 멈추세요",
    "runHint": "화면 아무 데나 누르거나 스페이스 키로 멈춤",
    "early": "{n} 빨랐어요",
    "late": "{n} 늦었어요",
    "perfect": "완벽해요! 딱 {t} 🎉",
    "cancelled": "페이지를 벗어나서 이번 도전은 무효예요. 다시 해 볼까요?",
    "hidden": "??:??.??",
    "change": "← 모드 바꾸기",
    "clockAria": "스톱워치",
    "sec": "{n}초"
  },
  "result": {
    "over": "내 결과",
    "mode": "목표 {t}",
    "perfect": "딱 {t}! 완벽하게 멈췄어요 🎉",
    "bestLabel": "가장 가까운 기록의 오차",
    "stoppedAt": "멈춘 시간 {time}",
    "tierLabel": "내 몸속 시계",
    "tiers": [
      "🐌 시간 감각 실종",
      "⏳ 대충 그 언저리",
      "🙂 꽤 괜찮은 감각",
      "🎯 정확한 타이밍",
      "⚡ 찰나의 달인",
      "🧠 인간 스톱워치"
    ],
    "newBest": "내 최고 기록 경신!",
    "pb": "이 모드 내 최고 기록: {n}",
    "avg": "평균 오차",
    "listLabel": "내 3번의 기록",
    "top": "상위 {n}%",
    "beat": "참가자 {pct}%보다 정확해요",
    "beatAll": "지금까지 모든 참가자보다 정확해요",
    "others": "이 모드의 다른 기록 {n}개와 비교",
    "comparing": "다른 참가자와 비교하는 중…",
    "shareTitle": "10초 맞추기 게임",
    "shareText": "타이머를 {t}에서 겨우 {n} 차이로 멈췄어요 ⏱️ {tier}. 너도 딱 맞출 수 있어?",
    "retry": "다시 도전"
  },
  "og": {
    "brand": "⏱️ 10초 맞추기 게임",
    "defaultKicker": "무료 타이밍 게임",
    "defaultTitle": "타이머를 딱 10.00초에 멈출 수 있을까?",
    "defaultDesc": "3번 도전 · 블라인드 모드 · 5·10·30초"
  },
  "faq": [
    {
      "q": "어떻게 하나요?",
      "a": "목표 시간(5·10·30초)을 고르고 시작을 누르면 그 순간부터 스톱워치가 돌아가요. 머릿속으로 세다가 목표 시간이 됐다 싶을 때 STOP 버튼을 누르거나 게임 화면 아무 데나 누르거나 스페이스 키를 누르세요. 한 판에 세 번 도전하고, 가장 가까운 기록이 결과가 돼요."
    },
    {
      "q": "블라인드 모드는 뭔가요?",
      "a": "블라인드 모드에서는 3초가 지나면 숫자가 물음표로 바뀌어서 끝까지 감으로만 세야 해요. 훨씬 어렵고, 최고 기록과 다른 참가자 비교도 일반 모드와 따로 계산해요."
    },
    {
      "q": "딱 10.00초 맞추기가 왜 이렇게 어렵나요?",
      "a": "손가락이 반응하는 데 잠깐 시간이 걸리고, 머릿속으로 세는 박자도 10초 동안 조금씩 밀리기 때문에 잘 멈춰도 100분의 몇 초씩 빠르거나 늦어요. 타이머는 화면을 누른 그 순간의 시각으로 재고, 진짜 스톱워치처럼 100분의 1초까지 보여 줘요. 딱 10.00이 뜨는 일은 드물어서 더 짜릿해요."
    },
    {
      "q": "왜 이번 도전이 무효가 됐나요?",
      "a": "타이머가 도는 중에 다른 탭으로 가거나 휴대폰 화면을 끄거나 페이지를 벗어나면 공정하게 하려고 그 도전은 취소돼요. 같은 차례를 다시 시작하면 돼요."
    }
  ],
  "privacy": {
    "title": "개인정보처리방침 | 10초 맞추기",
    "description": "10초 맞추기의 개인정보처리방침: 익명 점수, 쿠키, 광고, 통계 안내.",
    "h1": "개인정보처리방침",
    "introHtml": "10초 맞추기(이하 \"서비스\")는 이용자의 개인정보를 소중히 여기며, 아래에 적은 최소한의 정보만 처리합니다.",
    "sections": [
      [
        "1. 수집하는 정보",
        "서비스는 회원가입이나 로그인 없이 이용합니다. 한 판이 끝나면 점수(가장 정확했던 시도의 오차, 밀리초)만 이름이나 개인 식별 정보 없이 익명 집계로 서버에 보냅니다. 이용 중 아래와 같은 정보가 자동으로 수집될 수 있습니다."
      ],
      [
        "2. 쿠키 및 유사 기술",
        "서비스는 언어와 최고 기록을 기억하고, 광고를 보여 주고, 이용 현황을 파악하기 위해 쿠키와 브라우저 로컬 저장소를 쓸 수 있습니다. 브라우저 설정에서 거부하거나 지울 수 있으며, 그 경우 일부 기능이 다르게 동작할 수 있습니다."
      ],
      [
        "3. 광고 (Google AdSense)",
        "서비스는 Google AdSense 로 광고를 보여 줍니다. Google 과 협력사는 쿠키를 사용해 이 사이트와 다른 사이트 방문 기록을 바탕으로 광고를 보여 줄 수 있습니다. 자세한 내용과 설정은 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 광고 설정</a>에서 확인하세요."
      ],
      [
        "4. 통계",
        "서비스 개선을 위해 Google Analytics(GA4)와 언어별 하루 합계만 남기는 자체 집계(페이지 조회, 시작·완료한 판, 별점)를 쓸 수 있습니다. 어느 것도 이용자 개인을 식별하지 않습니다."
      ],
      [
        "5. 문의",
        "이 방침에 대해 궁금한 점이 있으면 사이트 운영자에게 문의해 주세요."
      ],
      [
        "6. 시행일",
        "이 방침은 2026년 11월 2일부터 시행합니다."
      ]
    ],
    "back": "← 10초 맞추기로 돌아가기"
  }
};
