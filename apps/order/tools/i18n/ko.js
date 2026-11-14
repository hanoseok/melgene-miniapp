/* 순서 정하기 — 한국어 (/ko/). 키 구조는 en.js 와 같다. 설명은 en.js 머리말 참고. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap',
    display: "'Bagel Fat One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'keep-all',
    hyphens: 'manual',
  },

  meta: {
    title: '순서 정하기 – 발표 순서·게임 순서 랜덤 정하기',
    description: '이름을 붙여 넣거나 번호 1~N 으로 발표 순서, 게임 순서, 청소 순서를 공정하게 랜덤으로 정해요. 1번부터 끝까지 한 장씩 공개. 무료, 가입 없음.',
    ogTitle: '순서 정하기 🔢 누가 먼저 할까?',
    ogDescription: '이름을 섞어 1번부터 끝까지 공정한 순서를 정하고 한 장씩 공개해요.',
  },
  siteName: '순서 정하기',
  privacyLink: '개인정보처리방침',

  hero: {
    h1Kicker: '순서 정하기',
    h1Html: '누가 <em>먼저</em> 할까?',
    hook: '이름만 적고 한 번 섞으면 1번부터 마지막까지 순서가 정해져요.',
  },

  ui: {
    presetLabel: '무슨 순서인가요?',
    modeLabel: '이름 또는 번호',
    modeNames: '이름',
    modeNumbers: '번호 1~N',
    namesLabel: '이름 (한 줄에 한 명)',
    namesPh: '민준\n서연\n지호\n하은',
    namesHint: '단톡방·엑셀에서 복사해 붙여 넣어도 돼요. 쉼표로도 나뉘어요.',
    namesCount: '{n} / {max}명',
    clear: '지우기',
    numbersLabel: '몇 번까지?',
    numbersDec: '하나 줄이기',
    numbersInc: '하나 늘리기',
    numbersHint: '1부터 N까지 번호를 섞어요. 출석 번호·자리 번호로 정할 때 좋아요.',
    numberItem: '{n}번',
    fromLabel: '공개 순서',
    fromFirst: '1번부터',
    fromLast: '마지막부터',
    shuffle: '순서 섞기 🔀',
    fair: '암호 난수로 한 번만 섞어요 · 이름은 기기 밖으로 안 나가요',
  },

  presets: [
    { label: '그냥 순서', heading: '랜덤 순서' },
    { label: '발표 순서', heading: '발표 순서' },
    { label: '게임 순서', heading: '게임 순서' },
    { label: '청소 순서', heading: '청소 당번 순서' },
  ],

  errors: {
    namesFew: '이름을 한 줄에 하나씩 2명 이상 적거나 번호로 바꿔 주세요.',
    namesMany: '이름은 40명까지 넣을 수 있어요.',
    numbersRange: '2부터 40 사이로 골라 주세요.',
    badLink: '순서 링크가 깨졌거나 잘려서 보여 드릴 수 없어요.',
  },

  reveal: {
    progress: '{n}명 중 {k}명 공개',
    tapHint: '카드를 누르거나 다음을 누르세요. 순서는 섞을 때 이미 정해졌어요.',
    first: '공개하기 ▶',
    next: '다음 ▶',
    done: '전체 순서 보기',
    auto: '자동 공개',
    autoStop: '멈추기',
    showAll: '한 번에 보기',
    soFar: '지금까지 공개',
    live: '{k}번째: {who}',
  },

  result: {
    sharedBadge: '🔢 공유받은 순서',
    sharedNote: '링크에 저장된 순서예요. 다시 섞지 않았어요.',
    summary: '{n}명, 1번부터 마지막까지',
    copy: '텍스트로 복사',
    copied: '순서를 복사했어요',
    copyLink: '링크 복사',
    linkCopied: '링크를 복사했어요. 여는 사람 모두 같은 순서를 봐요.',
    linkTooLong: '목록이 너무 길어 링크에 담지 못해 페이지 주소만 복사했어요.',
    edit: '이름 고치기',
    again: '다시 섞기 🔀',
    againShared: '다시 섞기 / 나도 하기 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: '순서 정하기',
    shareText: '랜덤으로 정한 우리 순서예요 🔢',
  },

  og: {
    brand: '🔢 순서 정하기',
    kicker: '발표 · 게임 · 청소 당번',
    title: '누가 먼저? 공정하게 순서 정하기',
    desc: '이름만 넣으면 1번부터 끝까지 바로',
  },

  faq: [
    { q: '정말 공정하게 섞이나요?', a: '네. 섞기를 누르는 순간 브라우저의 암호학적 난수(crypto.getRandomValues)로 거부 샘플링과 Fisher–Yates 셔플을 해서 모든 순서가 똑같은 확률로 나와요. 전체 순서는 그때 정해지고, 카드 공개는 보여 주기만 해요.' },
    { q: '제비뽑기·당첨자 뽑기와 뭐가 달라요?', a: '당첨자 뽑기는 한 명을 고르면 끝나요. 순서 정하기는 모두에게 1번부터 마지막까지 번호를 매겨서 발표 순서, 게임 차례, 청소 당번처럼 줄 세우는 데 맞아요.' },
    { q: '1번부터와 마지막부터 공개, 뭐가 좋아요?', a: '1번부터는 바로 준비해야 할 때 편해요. 마지막부터는 1번이 맨 끝에 나와서 더 두근두근해요.' },
    { q: '이름이 저장되거나 전송되나요?', a: '아니요. 이름은 브라우저 안에만 있어요. 다음에 다시 쓰도록 마지막 목록만 이 기기에 저장하고, 공유 링크는 보낸 사람에게만 순서를 전해요.' },
  ],

  privacy: {
    title: '개인정보처리방침 | 순서 정하기',
    description: '순서 정하기 개인정보처리방침: 이름과 순서는 브라우저에만 남고, 쿠키·광고·통계는 이렇게 다뤄요.',
    h1: '개인정보처리방침',
    introHtml: '순서 정하기(이하 "서비스")는 이용자의 개인정보를 소중히 여기며, 아래에 적은 최소한의 정보만 처리합니다.',
    sections: [
      ['1. 수집하는 정보', '서비스는 회원 가입이나 로그인 없이 동작합니다. 입력한 이름·번호와 섞인 순서는 브라우저 안에서만 처리되며 서버로 보내지 않습니다. 마지막 목록은 이 기기의 브라우저 로컬 저장소에 남습니다. 순서 링크를 복사하면 순서가 링크 안에 담겨, 링크를 받은 사람에게만 전달됩니다.'],
      ['2. 쿠키 및 유사 기술', '서비스는 언어·설정 기억, 광고 표시, 이용 현황 파악을 위해 쿠키와 브라우저 로컬 저장소를 사용할 수 있습니다. 브라우저 설정에서 거부하거나 삭제할 수 있으며, 이 경우 일부 기능이 예상대로 동작하지 않을 수 있습니다.'],
      ['3. 광고 (Google AdSense)', '서비스는 Google AdSense 광고를 표시합니다. Google 과 파트너는 이 사이트와 다른 사이트 방문 기록을 바탕으로 광고를 보여 주기 위해 쿠키를 사용할 수 있습니다. 자세한 내용과 설정은 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 광고 설정</a>에서 확인할 수 있습니다.'],
      ['4. 통계', '서비스 개선을 위해 Google Analytics(GA4)와 언어별 하루 합계(페이지 조회, 시작·완료 횟수)만 남기는 자체 집계를 쓸 수 있습니다. 어느 것도 개인을 식별하지 않습니다.'],
      ['5. 문의', '개인정보처리방침에 관한 문의는 사이트 운영자에게 연락해 주세요.'],
      ['6. 시행일', '이 방침은 2026년 11월 15일부터 시행합니다.'],
    ],
    back: '← 순서 정하기로 돌아가기',
  },
};
