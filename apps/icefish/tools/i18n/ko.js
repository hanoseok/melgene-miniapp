/* Ice Fishing — ko (얼음 낚시)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
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
    "title": "얼음낚시 게임 · 얼음 낚시 60초 물고기 잡기",
    "description": "얼음낚시 게임: 얼음 구멍에 낚싯줄을 내리고, 입질이 오면 줄이 끊어지지 않게 감아 올리세요. 60초 동안 몇 점이나 낚을까요? 폰·PC에서 바로.",
    "ogTitle": "얼음 낚시 🎣 60초 동안 몇 마리나 낚을 수 있을까?",
    "ogDescription": "얼음 구멍으로 줄을 내리고 입질을 기다렸다가 살살 감아 올리세요. 너무 세게 당기면 줄이 끊어져요."
  },
  "siteName": "얼음 낚시",
  "privacyLink": "개인정보처리방침",
  "start": {
    "badge": "🎣 꽁꽁 언 호수, 작은 구멍 하나",
    "h1Kicker": "얼음낚시 게임",
    "h1Html": "줄을 내리고<br><em>쭉 감아 올려라</em>",
    "hook": "얼음 아래에서 뭔가 헤엄치고 있어요. 바늘을 알맞은 깊이로 내리고, 툭 하는 입질이 오면 줄이 끊어지기 전에 살살 감아 올리세요.",
    "how": {
      "lower": "누르고 있으면 바늘이 내려가요",
      "reel": "입질이 오면 눌러서 감기",
      "red": "빨간색이면 손 떼기"
    },
    "start": "낚시 시작 →",
    "facts": "한 판 60초 · 폰·PC · 내 최고 기록 깨기"
  },
  "play": {
    "score": "점수",
    "time": "시간",
    "secUnit": "초",
    "pause": "일시정지",
    "paused": "일시정지",
    "resume": "계속 낚시하기",
    "hint": "얼음 아래를 누르고 있으면 줄이 내려가요",
    "fieldAria": "얼음 호수: 원하는 깊이를 누르고 있으면 바늘이 내려가고, 입질이 오면 누르고 있어서 감아요",
    "bite": "입질!",
    "catchPop": "{fish} +{n}",
    "snap": "줄이 끊어졌어요!",
    "escape": "놓쳤어요",
    "timeUp": "시간 끝!"
  },
  "fish": {
    "minnow": "빙어",
    "perch": "붕어",
    "trout": "송어",
    "pike": "쏘가리",
    "golden": "황금 물고기",
    "boot": "낡은 장화"
  },
  "result": {
    "over": "오늘의 조과",
    "unit": "점",
    "newBest": "내 최고 기록 경신!",
    "best": "내 최고 기록: {n}점",
    "caught": "잡은 물고기",
    "snapped": "끊어진 줄",
    "bestCatch": "최고의 한 마리: {fish}",
    "noCatch": "이번엔 한 마리도 못 잡았어요",
    "tierLabel": "나의 낚시꾼 레벨",
    "tiers": [
      "🧊 손 시린 초보",
      "🪝 구멍 뚫기 견습생",
      "🐟 참을성 있는 낚시꾼",
      "🎣 얼음판 단골",
      "⭐ 물고기 마음 읽는 자",
      "🏆 얼음 호수의 전설"
    ],
    "top": "상위 {n}%",
    "beat": "낚시꾼 {pct}%보다 높은 점수",
    "beatAll": "지금까지 모든 낚시꾼보다 높은 점수",
    "others": "다른 기록 {n}개와 비교",
    "comparing": "다른 낚시꾼들과 비교하는 중…",
    "shareTitle": "얼음 낚시",
    "shareText": "얼음낚시 60초에 {n}점 낚았어요 🎣 {tier}. 나보다 많이 낚을 수 있어?",
    "retry": "다시 낚시하기"
  },
  "og": {
    "brand": "🎣 얼음 낚시",
    "defaultKicker": "얼음낚시 게임",
    "defaultTitle": "60초 동안 몇 마리나 낚을 수 있을까?",
    "defaultDesc": "줄 내리기 · 입질 · 줄 끊기지 않게 감기"
  },
  "faq": [
    {
      "q": "낚싯줄은 어떻게 내리나요?",
      "a": "얼음 아래 물속 아무 곳이나 누르고 있으면 바늘이 그 깊이로 움직이고, 손을 떼면 그 자리에 멈춰요. 컴퓨터에서는 ↓·↑ 키를 눌러도 돼요. 물고기마다 좋아하는 깊이가 다르니 여러 깊이를 시도해 보세요."
    },
    {
      "q": "감아 올리기는 어떻게 하나요?",
      "a": "입질이 오면 누르고 있는 동안 줄이 감기고, 오른쪽 장력 막대가 올라가요. 막대가 빨간 구간에 닿으면 잠깐 손을 떼서 줄을 풀어 주고 다시 누르세요. 막대가 꽉 차면 줄이 끊어지고, 너무 오래 느슨하게 두면 물고기가 빠져나가요."
    },
    {
      "q": "왜 물고기마다 점수가 다른가요?",
      "a": "크고 깊이 사는 물고기일수록 힘이 세고 점수가 높아요. 가끔 나오는 황금 물고기가 가장 높아요. 낡은 장화 같은 쓰레기는 쉽게 올라오지만 0점이에요. 최고 기록은 이 브라우저에 저장돼요."
    },
    {
      "q": "다른 탭으로 가면 어떻게 되나요?",
      "a": "페이지를 떠나거나 휴대폰 화면을 끄면 저절로 일시정지되고 시간도 멈춰요. '계속 낚시하기'(또는 P 키)를 누르면 멈춘 곳부터 이어서 할 수 있어요."
    }
  ],
  "privacy": {
    "title": "개인정보처리방침 | 얼음 낚시",
    "description": "얼음 낚시의 개인정보처리방침: 익명 점수, 쿠키, 광고, 통계 안내.",
    "h1": "개인정보처리방침",
    "introHtml": "얼음 낚시(이하 \"서비스\")은 이용자의 개인정보를 소중히 여기며, 아래에 적은 최소한의 정보만 처리합니다.",
    "sections": [
      [
        "1. 수집하는 정보",
        "서비스는 회원가입이나 로그인 없이 이용합니다. 한 판이 끝나면 점수만 이름이나 개인 식별 정보 없이 익명 집계로 서버에 보냅니다. 이용 중 아래와 같은 정보가 자동으로 수집될 수 있습니다."
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
        "이 방침은 2026년 11월 10일부터 시행합니다."
      ]
    ],
    "back": "← 얼음 낚시으로 돌아가기"
  }
};
