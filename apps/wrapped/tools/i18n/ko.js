/* 올해 결산 카드 — 한국어. Key structure = en.js; see en.js for notes ({year}/{next} are filled in by the browser — never write a year as digits). */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Jua&family=Gaegu:wght@700&display=swap",
    "display": "'Jua', 'Nunito'",
    "displayWeight": 400,
    "script": "'Gaegu'",
    "scriptWeight": 700,
    "sans": "",
    "wordBreak": "keep-all",
    "hyphens": "manual"
  },
  "meta": {
    "title": "올해 결산 카드 만들기 · 연말 결산 템플릿",
    "description": "올해 결산 카드 만들기: 올해의 한 단어, 최고의 순간, 올해의 노래·음식·장소, 고마운 사람, 내년 목표를 적고 테마를 고르면 연말 결산 이미지가 완성돼요. 가입 없이 바로.",
    "ogTitle": "올해 결산 카드 🎁",
    "ogDescription": "한 단어, 한 곡, 잊지 못할 순간으로 나의 한 해를 카드 한 장에 담아 보세요."
  },
  "siteName": "올해 결산 카드",
  "privacyLink": "개인정보처리방침",
  "start": {
    "badge": "🎁 연말 특집",
    "h1Kicker": "올해 결산 카드 만들기",
    "h1Html": "나의 한 해를<br><em>카드 한 장에</em>",
    "hook": "한 단어, 한 곡, 잊지 못할 한 순간. 몇 줄만 적으면 나의 한 해를 담은 결산 카드가 완성돼요.",
    "start": "결산 카드 만들기 →"
  },
  "editor": {
    "title": "몇 줄로 돌아보는 나의 한 해",
    "themesAria": "카드 테마",
    "themes": {
      "aurora": "오로라",
      "sunset": "노을",
      "mint": "민트",
      "midnight": "한밤",
      "paper": "종이",
      "neon": "네온"
    },
    "previewAria": "카드 미리보기",
    "fields": {
      "nm": {
        "label": "이름 (선택)",
        "placeholder": "예: 지민"
      },
      "w": {
        "label": "올해의 한 단어",
        "placeholder": "올해를 한 단어로"
      },
      "mo": {
        "label": "최고의 순간",
        "placeholder": "예: 동생이랑 처음 본 겨울 바다"
      },
      "so": {
        "label": "올해의 노래",
        "placeholder": "올해 제일 많이 들은 노래"
      },
      "fo": {
        "label": "올해의 음식",
        "placeholder": "예: 퇴근길 떡볶이"
      },
      "pl": {
        "label": "올해의 장소",
        "placeholder": "예: 회사 앞 작은 카페"
      },
      "th": {
        "label": "고마운 사람",
        "placeholder": "예: 엄마, 우리 팀, 민수"
      },
      "go": {
        "label": "내년 목표",
        "placeholder": "예: 10km 마라톤 완주"
      }
    },
    "ideasAria": "한 단어 추천",
    "ideas": [
      "성장",
      "버티기",
      "도전",
      "쉼표",
      "행복"
    ],
    "needWord": "올해의 한 단어를 먼저 적어 주세요. 나머지는 비워 둬도 돼요.",
    "done": "카드 완성하기"
  },
  "card": {
    "kicker": "올해 결산",
    "titleMine": "나의 {year}",
    "titleName": "{name}의 {year}",
    "word": "올해의 한 단어",
    "rows": {
      "mo": "최고의 순간",
      "so": "올해의 노래",
      "fo": "올해의 음식",
      "pl": "올해의 장소",
      "th": "고마운 사람",
      "go": "{next} 목표"
    }
  },
  "result": {
    "eyebrowMine": "{year} 결산 카드 완성!",
    "eyebrowFriend": "{name}의 {year} 결산",
    "eyebrowFriendNoName": "친구의 {year} 결산",
    "imageAlt": "올해 결산 카드. 올해의 한 단어: {word}",
    "save": "이미지 저장",
    "saving": "이미지 만드는 중…",
    "saved": "이미지를 저장했어요!",
    "saveFail": "이미지를 만들지 못했어요. 화면 캡처를 이용해 주세요.",
    "copyText": "텍스트 복사",
    "copied": "텍스트를 복사했어요!",
    "copyFail": "복사하지 못했어요. 다시 시도해 주세요.",
    "edit": "고치기",
    "retry": "새 카드 만들기",
    "retryFriend": "나도 만들기",
    "shareTitle": "올해 결산 카드",
    "shareText": "{name}의 {year} 결산 카드 🎁 구경해 보세요:",
    "shareTextNoName": "나의 {year} 결산 카드 🎁 구경해 보세요:",
    "fileName": "year-in-review"
  },
  "og": {
    "brand": "🎁 올해 결산 카드",
    "defaultKicker": "올해 결산 카드 만들기",
    "defaultTitle": "나의 한 해를 카드 한 장에",
    "defaultDesc": "테마 6가지 · 한 단어·노래·순간 · 저장·공유",
    "cardKicker": "올해 결산",
    "cardWord": "성장",
    "cardRows": [
      "최고의 순간",
      "올해의 노래",
      "내년 목표"
    ]
  },
  "faq": [
    {
      "q": "무엇을 적어야 하나요?",
      "a": "올해의 한 단어만 있으면 돼요. 이름, 최고의 순간, 노래, 음식, 장소, 고마운 사람, 내년 목표는 모두 선택이고, 비워 둔 칸은 카드에 나오지 않아요."
    },
    {
      "q": "카드에는 몇 년도가 나오나요?",
      "a": "기기 날짜를 기준으로 지금 돌아보는 해가 나와요. 1월에 만들면 막 끝난 지난해로 나와서 조금 늦게 만들어도 괜찮아요."
    },
    {
      "q": "카드를 사진으로 저장할 수 있나요?",
      "a": "네. ‘이미지 저장’을 누르면 스토리와 채팅에 잘 맞는 1080×1350 PNG가 만들어져요. 휴대폰에서는 공유 창이 열리고, 컴퓨터에서는 바로 내려받아요."
    },
    {
      "q": "적은 내용은 어디에 남나요?",
      "a": "고치는 동안에는 내 브라우저에만, 공유하면 링크 안에만 담겨요. 적은 내용은 서버로 보내지 않아요. 링크를 가진 사람은 누구나 볼 수 있으니 믿는 사람에게만 보내 주세요."
    }
  ],
  "privacy": {
    "title": "개인정보처리방침 | 올해 결산 카드",
    "description": "올해 결산 카드 개인정보처리방침 — 카드에 적은 글의 처리 방식, 쿠키, 광고, 접속 통계 이용에 대한 안내입니다.",
    "h1": "개인정보처리방침",
    "introHtml": "올해 결산 카드(이하 \"서비스\")는 이용자의 개인정보를 소중히 여기며, 다음과 같은 방침에 따라 최소한의 정보만을 처리합니다.",
    "sections": [
      [
        "1. 수집하는 정보",
        "서비스는 회원가입이나 로그인 없이 이용할 수 있습니다. 카드에 적은 글은 서버로 보내지 않고 이용자의 브라우저 안에서만 처리됩니다(쓰는 동안 임시 저장본이 브라우저 저장소에 남고, 공유할 때는 URL 안에 담깁니다). 다만 서비스 이용 과정에서 아래 정보가 자동으로 수집될 수 있습니다."
      ],
      [
        "2. 쿠키 및 유사 기술",
        "서비스는 광고 게재 및 서비스 이용 형태 분석을 위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있으며, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다."
      ],
      [
        "3. 광고 서비스 (Google AdSense)",
        "서비스는 Google AdSense를 통해 광고를 게재합니다. Google 및 광고 파트너는 쿠키를 사용하여 이용자의 이전 방문 정보를 기반으로 광고를 게재할 수 있습니다. 자세한 내용과 맞춤 설정은 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 광고 설정</a>에서 확인하고 변경할 수 있습니다."
      ],
      [
        "4. 접속 통계 분석",
        "서비스 개선을 위해 Google Analytics(GA4)와 날짜·언어별 합계만 남기는 자체 통계(조회 수, 완성한 카드 수, 별점)를 사용할 수 있습니다. 개인을 식별하는 정보와 카드에 적은 내용은 수집하지 않습니다."
      ],
      [
        "5. 공유 링크와 이미지",
        "\"공유하기\"로 만들어지는 링크에는 카드 내용이 URL에 인코딩되어 포함되므로, 링크를 가진 사람은 누구나 볼 수 있습니다. 저장하는 이미지는 이용자의 브라우저 안에서 만들어집니다. 카드에 주소·전화번호 등 개인정보를 적지 않는 것을 권장합니다."
      ],
      [
        "6. 문의",
        "개인정보처리방침에 대한 문의사항은 서비스 운영자에게 연락해 주세요."
      ],
      [
        "7. 시행일",
        "이 방침은 2026년 11월 3일부터 적용됩니다."
      ]
    ],
    "back": "← 올해 결산 카드로 돌아가기"
  }
};
