/* 눈사람 만들기 — 한국어 (/ko/). 키 구조는 en.js와 같다. {name} {n} {max} 는 그대로 둔다.
 * editor.namePresets 는 한국어로 지은 눈사람 이름(각 20자 이내)이며 영어 번역이 아니다.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Jua&family=Gaegu:wght@700&display=swap",
    display: "'Jua', 'Nunito'",
    displayWeight: 400,
    script: "'Gaegu'",
    scriptWeight: 700,
    sans: "",
    wordBreak: "keep-all",
    hyphens: "manual"
  },
  meta: {
    title: "눈사람 만들기 – 온라인으로 눈사람 꾸미기 게임",
    description: "휴대폰으로 눈사람 만들기: 눈덩이를 쌓고 눈, 당근 코, 모자, 목도리, 팔을 골라 이름을 지어 주세요. 완성한 눈사람은 이미지로 저장하거나 링크로 보낼 수 있어요.",
    ogTitle: "눈사람 만들기 ⛄",
    ogDescription: "굴리고 쌓고 입혀서 1분 만에 나만의 눈사람을 만들고 친구에게 보내 보세요."
  },
  siteName: "눈사람 만들기",
  privacyLink: "개인정보처리방침",
  start: {
    badge: "⛄ 겨울 한정",
    h1Kicker: "눈사람 만들기",
    h1Html: "굴리고 쌓고,<br><em>눈사람 옷 입히기</em>",
    hook: "장갑은 필요 없어요. 조각을 하나하나 고르고, 내리는 눈을 구경하고, 다 만든 눈사람을 웃음이 필요한 사람에게 보내 보세요.",
    start: "눈사람 만들기 시작 →"
  },
  editor: {
    title: "눈사람을 만들어 보세요",
    canvasAria: "겨울 풍경 속 내 눈사람 미리보기",
    stepOf: "{n}단계 / {max}단계",
    steps: {
      body: "몸",
      face: "얼굴",
      nose: "코",
      hat: "모자",
      scarf: "목도리",
      arms: "팔",
      extras: "장식",
      scene: "배경",
      name: "이름"
    },
    labels: {
      body: "눈덩이",
      eyes: "눈",
      mouth: "입",
      nose: "코",
      hat: "모자",
      scarf: "목도리 색",
      pattern: "무늬",
      arms: "팔",
      extras: "장식(여러 개 선택)",
      scene: "배경",
      name: "이름(선택)"
    },
    bodies: {
      classic: "클래식",
      duo: "두 덩이",
      chubby: "통통이",
      slim: "날씬이"
    },
    eyes: {
      coal: "숯덩이",
      buttons: "단추",
      sparkly: "반짝",
      sleepy: "졸린 눈"
    },
    mouths: {
      pebbles: "조약돌",
      smile: "미소",
      grin: "활짝",
      oh: "어머!"
    },
    noses: {
      carrot: "당근",
      long: "긴 당근",
      berry: "열매",
      pinecone: "솔방울"
    },
    hats: {
      top: "실크햇",
      beanie: "비니",
      santa: "산타 모자",
      bucket: "양동이",
      earmuffs: "귀마개",
      none: "안 씀"
    },
    scarves: {
      red: "빨강",
      green: "초록",
      blue: "파랑",
      yellow: "노랑",
      purple: "보라",
      none: "안 함"
    },
    patterns: {
      solid: "민무늬",
      stripes: "줄무늬",
      dots: "물방울"
    },
    arms: {
      twigs: "나뭇가지",
      mittens: "벙어리장갑",
      wave: "손 흔들기",
      none: "팔 없음"
    },
    extras: {
      broom: "빗자루",
      buttons: "큰 단추",
      bird: "작은 새",
      flakes: "반짝이"
    },
    scenes: {
      night: "눈 오는 밤",
      sunny: "햇살 들판",
      village: "마을 불빛"
    },
    random: "아무거나",
    back: "← 이전",
    next: "다음 →",
    done: "눈사람 완성하기",
    namePlaceholder: "예: 눈동이",
    ideas: "💡 추천",
    counter: "{n}/{max}",
    namePresets: [
      "눈동이",
      "몽글이",
      "하양이",
      "꽁꽁이",
      "눈송이"
    ]
  },
  card: {
    named: "반가워, {name}!"
  },
  result: {
    eyebrowMine: "눈사람이 완성됐어요!",
    eyebrowFriend: "누군가 당신을 위해 만든 눈사람, {name}",
    eyebrowFriendNoName: "누군가 당신을 위해 눈사람을 만들었어요",
    revealHint: "아직 새하얀 눈에 덮여 있어요…",
    reveal: "❄️ 눈 털어내기",
    imageAlt: "겨울 풍경 속 눈사람",
    save: "이미지 저장",
    saving: "이미지 만드는 중…",
    saved: "이미지를 저장했어요!",
    saveFail: "이미지를 만들지 못했어요. 스크린샷으로 저장해 주세요.",
    edit: "더 만들기",
    retry: "새 눈사람 만들기",
    retryFriend: "나도 만들어 보기",
    shareTitle: "눈사람 만들기",
    shareText: "내가 만든 눈사람, {name} ⛄ 보러 오세요:",
    shareTextNoName: "내가 만든 눈사람 좀 보세요 ⛄",
    fileName: "snowman"
  },
  og: {
    brand: "⛄ 눈사람 만들기",
    defaultKicker: "눈사람 만들기",
    defaultTitle: "굴리고 쌓고, 눈사람 옷 입히기",
    defaultDesc: "모자 · 목도리 · 내리는 눈 · 저장도 공유도"
  },
  faq: [
    {
      q: "눈사람은 어떻게 만들어요?",
      a: "그림 아래의 단계를 차례로 따라가세요. 눈덩이, 얼굴, 코, 모자, 목도리, 팔, 장식, 배경 순서이고, 선택지를 탭하면 눈사람이 바로 바뀌어요. 단계는 언제든 오가며 고칠 수 있어요."
    },
    {
      q: "'아무거나' 버튼은 뭐예요?",
      a: "모든 조각을 무작위로 조합해 줘요. 마음에 드는 모습이 나올 때까지 눌러 보고, 그다음 바꾸고 싶은 조각만 직접 골라 고치면 돼요."
    },
    {
      q: "눈사람을 저장하거나 보내려면 어떻게 해요?",
      a: "'눈사람 완성하기'를 탭하세요. '이미지 저장'은 1080×1350 PNG를 만들고, 공유 버튼은 링크를 보내요. 링크를 연 사람은 눈을 털어내고 내 눈사람을 만날 수 있고, 자기만의 눈사람도 만들 수 있어요."
    },
    {
      q: "내 눈사람은 어디에 저장되나요?",
      a: "고른 내용과 이름은 링크 안에, 그리고 만드는 동안 내 브라우저에만 저장돼요. 우리 서버로는 전송되지 않으니, 링크를 아는 사람은 누구나 볼 수 있어요."
    }
  ],
  privacy: {
    title: "개인정보처리방침 | 눈사람 만들기",
    description: "눈사람 만들기 개인정보처리방침: 눈사람과 이름을 다루는 방식과 쿠키, 광고, 익명 통계에 대해 안내합니다.",
    h1: "개인정보처리방침",
    introHtml: "눈사람 만들기(이하 \"서비스\")는 이용자의 개인정보를 존중하며, 아래에 적힌 최소한의 정보만 처리합니다.",
    sections: [
      [
        "1. 수집하는 정보",
        "서비스는 회원가입이나 로그인 없이 이용할 수 있습니다. 만든 눈사람과 입력한 이름은 서버로 전송되지 않습니다. 이 정보는 브라우저(만드는 동안 임시 저장본을 로컬 저장소에 보관)와 공유할 때의 URL 안에만 남습니다. 서비스를 이용하는 동안 아래와 같이 일부 정보가 자동으로 수집될 수 있습니다."
      ],
      [
        "2. 쿠키 및 유사 기술",
        "서비스는 광고를 보여 주고 이용 현황을 파악하기 위해 쿠키를 사용할 수 있습니다. 브라우저 설정에서 쿠키를 거부하거나 삭제할 수 있으며, 이 경우 일부 기능이 제대로 작동하지 않을 수 있습니다."
      ],
      [
        "3. 광고(Google AdSense)",
        "서비스는 Google AdSense를 통해 광고를 게재합니다. Google 및 광고 파트너는 쿠키를 사용하여 이 사이트와 다른 사이트에 대한 이용자의 이전 방문 정보를 기반으로 광고를 게재할 수 있습니다. 자세한 내용과 맞춤 설정은 <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google 광고 설정</a>에서 확인하고 변경할 수 있습니다."
      ],
      [
        "4. 통계",
        "서비스 개선을 위해 Google 애널리틱스(GA4)와, 언어별 하루 합계(페이지 조회 수, 완성된 눈사람 수, 별점)만 남기는 자체 집계 카운터를 사용할 수 있습니다. 이 정보로는 개인을 식별할 수 없으며, 눈사람의 이름도 포함되지 않습니다."
      ],
      [
        "5. 공유 링크와 이미지",
        "'공유'로 만든 링크에는 눈사람 내용이 URL에 인코딩되어 들어가므로, 링크를 가진 사람은 누구나 볼 수 있습니다. 저장하는 이미지는 브라우저 안에서 만들어집니다. 이름에 주소, 전화번호 등 개인정보는 적지 말아 주세요."
      ],
      [
        "6. 문의",
        "이 개인정보처리방침에 대해 궁금한 점이 있으면 사이트 운영자에게 문의해 주세요."
      ],
      [
        "7. 시행일",
        "이 방침은 2026년 11월 9일부터 적용됩니다."
      ]
    ],
    back: "← 눈사람 만들기로 돌아가기"
  }
};
