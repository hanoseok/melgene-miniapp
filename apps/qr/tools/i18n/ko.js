/* QR코드 생성기 — 한국어 (/ko/)
 * 인코더는 qr-core.js, 이 파일은 이 언어의 모든 문구. 키 구조는 en.js 와 같다.
 * 자리표시자 {bytes} {v} {n} {ratio} {value} 는 그대로 둔다.
 */
module.exports = {
  fonts: {
    css: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css',
    display: "'Pretendard'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'keep-all',
    hyphens: 'manual',
  },

  meta: {
    title: 'QR코드 생성기 – 무료 QR코드 만들기',
    description: '링크·글자·와이파이·이메일·전화번호로 무료 QR코드 만들기. 색·오류 정정·크기를 고르고 PNG·SVG로 저장해요. 가입 없이 브라우저 안에서만 만들어요.',
    ogTitle: 'QR코드 생성기 🔳 무료로 바로 만들기',
    ogDescription: '링크·와이파이·이메일·전화번호 QR코드를 몇 초 만에. 입력한 내용은 서버로 가지 않아요.',
  },
  siteName: 'QR코드 생성기',
  privacyLink: '개인정보처리방침',
  fileName: 'qr-code',

  hero: {
    h1Kicker: 'QR코드 생성기',
    h1Html: '입력하면 바로<br><em>QR코드</em> 완성',
    hook: '링크, 글자, 와이파이, 이메일, 전화번호를 입력하는 대로 QR코드가 생겨요. 무료, 가입 없음, 내 브라우저 안에서만 만들어요.',
  },

  ui: {
    typeLabel: 'QR코드에 무엇을 담을까요?',
    types: { link: '링크', text: '글자', wifi: '와이파이', email: '이메일', phone: '전화' },
    link: { label: '웹사이트 주소', placeholder: 'example.com/menu' },
    text: { label: '담을 글자', placeholder: '메모, 코드, 짧은 메시지…' },
    wifi: {
      ssid: '와이파이 이름(SSID)', ssidPh: 'MyHomeWiFi',
      password: '비밀번호', passwordPh: '와이파이 비밀번호',
      security: '보안 방식',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP (옛 방식)', nopass: '비밀번호 없음' },
      hidden: '숨긴 네트워크',
    },
    email: { to: '받는 사람 이메일', toPh: 'name@example.com', subject: '제목 (선택)', subjectPh: '안녕하세요', body: '내용 (선택)', bodyPh: '보낼 메시지를 적어 주세요…' },
    phone: { label: '전화번호', placeholder: '010-1234-5678' },

    previewLabel: 'QR코드 미리보기',
    previewReady: 'QR코드 미리보기, 버전 {v}',
    emptyPreview: '입력하면 여기에 QR코드가 나타나요',
    info: '{bytes}바이트 · 버전 {v} · {n}×{n}칸',
    encodes: '담긴 내용: {value}',
    tooLong: 'QR코드 하나에 담기엔 너무 길어요. 줄이거나 오류 정정을 낮게(L) 골라 보세요.',
    encodeFail: 'QR코드를 만들 수 없어요. 내용을 바꿔 보세요.',
    warnContrast: '색 대비가 낮아요({ratio}:1). 인식이 잘 안 될 수 있어요. 밝은 바탕에 진한 코드가 좋아요.',
    warnInverted: '어두운 바탕에 밝은 코드예요. 일부 스캔 앱은 반전된 코드를 못 읽어요.',
    warnQuiet: '여백이 좁으면 인식이 어려워질 수 있어요. 2칸 이상(표준은 4칸)을 두세요.',

    downloadPng: 'PNG 저장',
    downloadSvg: 'SVG 저장',
    copyImage: '이미지 복사',
    savedPng: 'PNG를 저장했어요. 인쇄 전에 휴대폰으로 한 번 찍어 보세요.',
    savedSvg: 'SVG를 저장했어요. 크게 인쇄해도 선명해요.',
    copied: '이미지를 복사했어요. 문서나 채팅에 붙여 넣으세요.',
    copyFail: '여기서는 이미지 복사가 안 돼요. PNG 저장을 써 주세요.',
    saveFail: '저장하지 못했어요. 다시 시도해 주세요.',

    options: '🎨 색 · 크기 · 오류 정정',
    colors: '색',
    fg: '코드',
    bg: '바탕',
    resetColors: '원래대로',
    ecc: '오류 정정',
    eccHint: '높을수록 긁힘이나 로고에 강하지만 코드가 촘촘해져요. 보통은 M이면 충분해요.',
    size: '이미지 크기',
    margin: '여백(콰이어트 존)',
    marginHint: '코드 둘레의 빈 테두리(칸 수)예요. 표준은 4칸이에요.',
    localNote: '🔒 내 브라우저 안에서만 만들어요. 입력한 내용은 서버로 보내지 않아요.',
  },

  result: {
    doneTitle: 'QR코드가 준비됐어요 ✓',
    doneText: '인쇄하거나 공유하기 전에 휴대폰 카메라로 꼭 찍어 보세요. 위 칸을 고치면 언제든 새 코드를 만들 수 있어요.',
    again: '새 QR코드 만들기',
    shareTitle: 'QR코드 생성기 – 무료, 내 브라우저에서',
    shareText: '링크·와이파이·글자 QR코드를 몇 초 만에, 브라우저에서 바로 만들어요 🔳',
  },

  og: {
    brand: '🔳 QR코드 생성기',
    kicker: '링크 · 와이파이 · 글자 · PNG·SVG',
    title: 'QR코드, 몇 초 만에 만들기',
    desc: '무료 · 가입 없음 · 브라우저 안에서만',
  },

  faq: [
    { q: '입력한 내용이 어딘가로 전송되나요?', a: '아니요. QR코드는 브라우저 안의 자바스크립트가 계산해요. 링크, 와이파이 비밀번호, 메시지는 서버로 가지 않고 저장되지도 않아요. 페이지를 닫으면 사라져요.' },
    { q: 'QR코드에 유효 기간이 있나요?', a: '없어요. 내용이 무늬 자체에 들어 있는 정적 QR코드라서 중간에 거치는 주소나 추적 링크가 없어요. 가리키는 링크나 와이파이가 살아 있는 한 인쇄한 코드는 계속 작동해요.' },
    { q: '와이파이 QR코드는 어떻게 작동하나요?', a: '와이파이 이름, 비밀번호, 보안 방식을 표준 WIFI: 형식으로 담아요. 아이폰과 안드로이드 기본 카메라로 찍으면 바로 연결할지 물어봐서, 손님이 비밀번호를 칠 필요가 없어요.' },
    { q: '오류 정정 수준은 무엇을 골라야 하나요?', a: '보통은 M(약 15% 복구)이면 돼요. 거친 표면에 인쇄하거나 긁힐 수 있거나 가운데에 로고를 얹을 거라면 Q나 H를, 화면에 띄울 긴 내용이라면 가장 작은 코드가 나오는 L을 고르세요.' },
    { q: 'PNG와 SVG는 뭐가 다른가요?', a: 'PNG는 웹사이트, 채팅, 문서에 쓰는 보통 이미지예요. SVG는 벡터 파일이라 아무리 키워도 선명해서 포스터, 전단지, 인쇄소 작업에 좋아요.' },
  ],

  privacy: {
    title: '개인정보처리방침 | QR코드 생성기',
    description: 'QR코드 생성기 개인정보처리방침: 입력한 내용은 브라우저 안에만, 쿠키·광고·통계 안내.',
    h1: '개인정보처리방침',
    introHtml: 'QR코드 생성기(이하 "서비스")는 이용자의 개인정보를 소중히 여기며, 아래에 적은 최소한의 정보만 처리합니다.',
    sections: [
      ['1. 수집하는 정보', '서비스는 회원 가입이나 로그인 없이 이용할 수 있습니다. 입력한 링크, 글자, 와이파이 정보, 이메일 주소, 전화번호는 이용자의 브라우저 안에서만 QR코드로 바뀌며, 서버로 전송되거나 저장되지 않습니다. 다만 서비스 이용 중 아래와 같은 정보가 자동으로 수집될 수 있습니다.'],
      ['2. 쿠키 및 유사 기술', '서비스는 언어 설정을 기억하고, 광고를 보여 주고, 이용 현황을 파악하기 위해 쿠키와 브라우저 로컬 저장소를 사용할 수 있습니다. 브라우저 설정에서 거부하거나 삭제할 수 있으며, 이 경우 일부 기능이 제대로 동작하지 않을 수 있습니다.'],
      ['3. 광고 (Google AdSense)', '서비스는 Google AdSense 광고를 게재합니다. Google 및 파트너는 쿠키를 사용해 이 사이트와 다른 사이트 방문 기록을 바탕으로 광고를 제공할 수 있습니다. 자세한 내용과 설정 변경은 <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google 광고 설정</a>에서 할 수 있습니다.'],
      ['4. 통계', '서비스 개선을 위해 Google Analytics(GA4)와, 언어별 하루 합계(페이지 조회, 만든 코드 수, 별점)만 남기는 자체 집계를 사용할 수 있습니다. QR코드에 담긴 내용은 통계에 절대 포함되지 않으며, 어느 것도 개인을 식별하지 않습니다.'],
      ['5. 문의', '개인정보처리방침에 관한 문의는 사이트 운영자에게 연락해 주세요.'],
      ['6. 시행일', '이 방침은 2026년 10월 11일부터 시행합니다.'],
    ],
    back: '← QR코드 생성기로 돌아가기',
  },
};
