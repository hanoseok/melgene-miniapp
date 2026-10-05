// mole 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/mole/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'mole',
  emoji: '🔨',
  category: 'game',
  added: '2026-10-06',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://mole.example.com/',
  title: {
    ko: '두더지 잡기',
    en: 'Whack-a-Mole',
    ja: 'もぐらたたき',
    zh: '打地鼠',
    fr: 'Jeu de la taupe',
    de: 'Hau den Maulwurf',
    th: 'เกมตีตัวตุ่น',
    vi: 'Game đập chuột chũi',
    es: 'Golpea al topo',
    it: 'Colpisci la talpa',
    pt: 'Jogo da toupeira',
    ru: 'Бей крота',
  },
  desc: {
    ko: '구멍에서 튀어나오는 두더지를 톡톡! 폭탄은 피하고 30초 안에 최고 점수에 도전하세요.',
    en: 'Tap the moles as they pop out of the holes, dodge the bombs and beat the clock in 30 seconds.',
    ja: '穴から出てくるもぐらをタップ！爆弾はよけて、30秒でハイスコアを目指そう。',
    zh: '地鼠从洞里冒头就快点一下，遇到炸弹别碰，30秒内冲高分、拿称号。',
    fr: 'Tape les taupes qui sortent des trous, évite les bombes et bats le chrono en 30 secondes.',
    de: 'Tippe die Maulwürfe an, weiche den Bomben aus und hol dir in 30 Sekunden den Highscore.',
    th: 'แตะตัวตุ่นที่โผล่จากรู หลบระเบิด แล้วทำคะแนนสูงสุดให้ได้ใน 30 วินาที',
    vi: 'Chạm chuột chũi thò lên từ các hố, né bom và ghi điểm cao nhất trong 30 giây.',
    es: 'Toca los topos que asoman por los agujeros, esquiva las bombas y bate tu récord en 30 segundos.',
    it: 'Tocca le talpe che spuntano dalle buche, evita le bombe e batti il record in 30 secondi.',
    pt: 'Toque nas toupeiras que saem dos buracos, desvie das bombas e bata o recorde em 30 segundos.',
    ru: 'Тапай по кротам, выскакивающим из нор, обходи бомбы и набери рекорд за 30 секунд.',
  },
};
