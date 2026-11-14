/* Snowball Fight — ko (눈싸움)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
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
    "title": "눈싸움 게임 – 던지고 숙이고 맞히기",
    "description": "무료 눈싸움 게임: 눈 요새 뒤에서 고개를 내미는 아이들에게 눈덩이를 던지고, 날아오는 눈덩이는 벽 뒤로 숙여 피하세요. 한 판 60초, 폰·PC 모두.",
    "ogTitle": "눈싸움 ☃️ 60초 동안 몇 번이나 맞힐 수 있을까?",
    "ogDescription": "빠르게 던지고, 제때 숙이고, 강아지는 맞히지 마세요. 하트 3개, 1분 승부."
  },
  "siteName": "눈싸움",
  "privacyLink": "개인정보처리방침",
  "start": {
    "badge": "☃️ 첫눈 온 날, 주머니엔 눈덩이 가득",
    "h1Kicker": "눈싸움 게임",
    "h1Html": "고개 내밀면 던지고<br><em>날아오면 숙이기</em>",
    "hook": "마당 건너편 아이들이 눈 요새 뒤에 숨어 있어요. 고개를 내밀 때 맞히고, 누가 팔을 번쩍 들면 얼른 숙이세요.",
    "how": {
      "throw": "아이를 누르면 던지기",
      "duck": "❗ 뜨면 숙이기 꾹",
      "avoid": "친구는 맞히지 마요"
    },
    "start": "눈싸움 시작 →",
    "facts": "한 판 60초 · 하트 3개 · 폰·PC 모두"
  },
  "play": {
    "score": "점수",
    "time": "시간",
    "lives": "하트",
    "secUnit": "초",
    "pause": "일시정지",
    "paused": "잠깐 멈춤",
    "resume": "다시 싸우기",
    "hint": "마당을 누르면 시작해요",
    "fieldAria": "눈 덮인 마당: 아이를 누르면 눈덩이를 던지고, 눈벽이나 숙이기 버튼을 누르고 있으면 숨어요",
    "duck": "숙이기 (꾹)",
    "duckAria": "누르고 있는 동안 벽 뒤로 숙이기",
    "combo": "콤보 ×{n}",
    "golden": "황금! +{n}",
    "oops": "친구예요! −{n}",
    "miss": "빗나감",
    "block": "막았다!",
    "ouch": "아야!",
    "timeUp": "시간 끝!",
    "out": "눈에 파묻혔다!"
  },
  "result": {
    "over": "눈싸움 끝",
    "reasonTime": "1분을 끝까지 버텼어요",
    "reasonOut": "세 번 맞아서 아웃",
    "unit": "점",
    "newBest": "내 최고 기록!",
    "best": "내 최고: {n}점",
    "hits": "맞힌 수",
    "accuracy": "명중률",
    "bestCombo": "최고 콤보",
    "tierLabel": "나의 눈싸움 등급",
    "tiers": [
      "🧤 꽁꽁 언 손",
      "❄️ 눈싸움 새내기",
      "⛄ 동네 단골",
      "🎯 명사수",
      "⭐ 요새 습격대장",
      "🏆 눈싸움 전설"
    ],
    "top": "상위 {n}%",
    "beat": "참가자 {pct}%보다 높아요",
    "beatAll": "지금까지 모든 참가자보다 높아요",
    "others": "다른 {n}판과 비교했어요",
    "comparing": "다른 사람들과 비교하는 중…",
    "shareTitle": "눈싸움 게임",
    "shareText": "60초 눈싸움에서 {n}점 ☃️ {tier}. 이길 수 있어?",
    "retry": "한 판 더"
  },
  "og": {
    "brand": "☃️ 눈싸움",
    "defaultKicker": "온라인 눈싸움 게임",
    "defaultTitle": "60초 동안 몇 번 맞힐 수 있을까?",
    "defaultDesc": "던지고 · 숙이고 · 강아지는 피하고"
  },
  "faq": [
    {
      "q": "어떻게 던지고 숨나요?",
      "a": "눈 요새에서 고개를 내민 아이를 누르면 그쪽으로 눈덩이가 날아가요. 숨으려면 아래쪽 숙이기 버튼이나 내 눈벽을 누르고 있으면 돼요. 숙인 동안에는 던질 수 없어요. PC에서는 ←·→로 요새를 고르고 ↑나 F로 던지며, 스페이스나 ↓를 누르고 있으면 숙여요."
    },
    {
      "q": "눈덩이가 날아오는 건 어떻게 알아요?",
      "a": "던지려는 아이는 팔을 번쩍 들고 머리 위에 빨간 ❗가 떠요. 그 전에 맞히면 아예 못 던져요. 눈덩이가 이미 날아오고 있으면 내 벽 위에 큰 ❗가 뜨고 숙이기 버튼이 빨개지니, 눈덩이가 닿을 때까지 꾹 누르고 있으세요."
    },
    {
      "q": "점수는 어떻게 매겨지나요?",
      "a": "맞힐 때마다 점수를 얻고, 눈사람은 아이보다 조금 더 높아요. 연달아 맞히면 콤보가 쌓여 한 번 맞힐 때 얻는 점수가 커지고, 빗나가면 콤보가 끊겨요. 가끔 나오는 황금 눈사람이 가장 높아요. 강아지와 흰 깃발을 흔드는 아이는 친구라서 맞히면 점수가 깎여요."
    },
    {
      "q": "한 판은 언제 끝나요?",
      "a": "한 판은 60초이고, 세 번 맞으면 일찍 끝나요. 시간이 갈수록 더 바빠져요. 다른 탭으로 가거나 화면을 잠그면 저절로 멈춰요."
    }
  ],
  "privacy": {
    "title": "개인정보처리방침 | 눈싸움",
    "description": "눈싸움의 개인정보처리방침: 익명 점수, 쿠키, 광고, 통계 안내.",
    "h1": "개인정보처리방침",
    "introHtml": "눈싸움(이하 \"서비스\")은 이용자의 개인정보를 소중히 여기며, 아래에 적은 최소한의 정보만 처리합니다.",
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
        "이 방침은 2026년 11월 14일부터 시행합니다."
      ]
    ],
    "back": "← 눈싸움으로 돌아가기"
  }
};
