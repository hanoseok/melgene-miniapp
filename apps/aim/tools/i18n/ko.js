/* Aim Trainer — ko (에임 연습)
 * Rules live in aim-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {avg} {hits} {acc} {tier} — keep them as-is when translating.
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
    "title": "에임 연습 · 에임 테스트 (과녁 맞히기 반응속도)",
    "description": "에임 연습: 과녁 30개를 최대한 빨리 맞히거나 30초 동안 몇 개나 맞히는지 도전하세요. 평균 시간·정확도·내 순위까지, 폰·PC 무료.",
    "ogTitle": "에임 연습 🎯 내 에임, 얼마나 빠르고 정확할까?",
    "ogDescription": "과녁 30개 또는 30초 동안 맞히고 평균 시간·정확도·에임 등급을 확인하세요."
  },
  "siteName": "에임 연습",
  "privacyLink": "개인정보처리방침",
  "start": {
    "badge": "🎯 내 에임은 몇 점?",
    "h1Kicker": "에임 연습 · 에임 테스트",
    "h1Html": "과녁이 보이면<br><em>바로 맞혀라</em>",
    "hook": "상자 안 아무 데서나 과녁이 튀어나와요. 사라지기 전에 콕 눌러서 내 손이 얼마나 빠르고 정확한지 확인해 보세요.",
    "modeLabel": "모드",
    "modes": {
      "classic": {
        "name": "클래식",
        "sub": "과녁 30개"
      },
      "timed": {
        "name": "타임어택",
        "sub": "30초"
      }
    },
    "how": "가운데 과녁을 맞히면 시작 · 과녁 밖을 누르면 빗나감",
    "start": "에임 연습 시작 →",
    "facts": "마우스·터치패드·손가락 · 폰·PC · 내 기록 깨기"
  },
  "modes": {
    "classic": "클래식 · 과녁 30개",
    "timed": "타임어택 · 30초"
  },
  "play": {
    "time": "시간",
    "hits": "맞힘",
    "acc": "정확도",
    "ready": "과녁을 맞히면 시작",
    "readySub": "첫 과녁을 맞히는 순간 시계가 돌아가요",
    "done": "끝!",
    "timeUp": "시간 종료!",
    "cancelled": "페이지를 벗어나서 이번 판은 무효예요. 다시 해 보세요!",
    "change": "← 모드 바꾸기",
    "areaAria": "조준 영역"
  },
  "result": {
    "over": "내 결과",
    "scoreClassic": "과녁 하나당 평균 시간",
    "scoreTimed": "맞힌 과녁",
    "unitMs": "ms",
    "unitHits": "개",
    "acc": "정확도",
    "avg": "평균 시간",
    "misses": "빗나감",
    "total": "총 시간",
    "escaped": "놓친 과녁",
    "msValue": "{n}ms",
    "secValue": "{n}초",
    "tierLabel": "내 에임 등급",
    "tiers": [
      "🐢 몸 푸는 중",
      "🙂 무난한 에임",
      "🎯 날카로운 눈",
      "🦅 독수리 눈",
      "⚡ 플릭 장인",
      "🏆 에임의 신"
    ],
    "newBest": "최고 기록 경신!",
    "pbClassic": "클래식 최고 기록: {n}ms",
    "pbTimed": "타임어택 최고 기록: {n}개",
    "invalid": "사람이 낼 수 없는 속도라 이번 기록은 저장하거나 비교하지 않아요.",
    "top": "상위 {n}%",
    "beat": "참여자의 {pct}%보다 잘했어요",
    "beatAll": "지금까지 모든 참여자보다 잘했어요",
    "others": "이 모드의 다른 기록 {n}개와 비교",
    "comparing": "다른 사람들과 비교하는 중…",
    "shareTitle": "에임 연습",
    "shareClassic": "과녁 하나당 평균 {avg}ms, 정확도 {acc}% 🎯 {tier}. 나보다 빠를 수 있어?",
    "shareTimed": "30초 동안 과녁 {hits}개, 정확도 {acc}% 🎯 {tier}. 이 기록 깰 수 있어?",
    "retry": "다시 하기"
  },
  "og": {
    "brand": "🎯 에임 연습",
    "defaultKicker": "무료 에임 테스트",
    "defaultTitle": "내 에임, 얼마나 빠르고 정확할까?",
    "defaultDesc": "과녁 30개 또는 30초 · 폰·PC"
  },
  "faq": [
    {
      "q": "에임 연습은 어떻게 하나요?",
      "a": "클래식이나 타임어택을 고르고 시작을 누른 뒤, 상자 가운데 과녁을 맞히면 시작돼요. 클래식은 과녁 30개가 하나씩 나오고, 과녁 하나를 맞히는 데 걸린 평균 시간이 점수예요. 타임어택은 30초 동안 최대한 많이 맞히는 모드로, 과녁이 점점 작아지다가 늦으면 사라져요."
    },
    {
      "q": "몇 점이면 잘한 건가요?",
      "a": "클래식은 보통 과녁 하나당 평균 500~800ms 정도이고, 잘하는 사람은 450ms 아래로 내려가요. 타임어택은 35~45개 정도가 흔해요. 정확도도 중요해서, 누른 것 중 과녁에 맞은 비율이 70%보다 낮으면 등급이 한 단계 내려가요."
    },
    {
      "q": "마우스·터치패드·터치 화면 모두 되나요?",
      "a": "네. 마우스 클릭, 터치패드 탭, 펜, 손가락 모두 돼요. 키보드는 쓰지 않고, 플레이 영역 안에서 누른 것만 셉니다. 기기마다 조작감이 달라서 마우스 기록과 폰 기록은 꽤 차이가 날 수 있어요."
    },
    {
      "q": "왜 이번 판이 기록되지 않았나요?",
      "a": "진행 중에 다른 탭으로 가거나 화면을 끄거나 페이지를 벗어나면 공정하게 하려고 그 판은 무효가 돼요. 과녁 하나당 평균 150ms보다 빠른 것처럼 사람이 반응할 수 없는 기록은 저장하지 않고 다른 사람과 비교하지도 않아요."
    }
  ],
  "privacy": {
    "title": "개인정보처리방침 | 에임 연습",
    "description": "에임 연습의 개인정보처리방침: 익명 점수, 쿠키, 광고, 통계 안내.",
    "h1": "개인정보처리방침",
    "introHtml": "에임 연습(이하 \"서비스\")은 이용자의 개인정보를 소중히 여기며, 아래에 적은 최소한의 정보만 처리합니다.",
    "sections": [
      [
        "1. 수집하는 정보",
        "서비스는 회원가입이나 로그인 없이 이용합니다. 한 판이 끝나면 점수(과녁 하나당 평균 시간 또는 맞힌 개수)만 이름이나 개인 식별 정보 없이 익명 집계로 서버에 보냅니다. 이용 중 아래와 같은 정보가 자동으로 수집될 수 있습니다."
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
        "이 방침은 2026년 11월 6일부터 시행합니다."
      ]
    ],
    "back": "← 에임 연습으로 돌아가기"
  }
};
