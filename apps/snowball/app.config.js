// snowball 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/snowball/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'snowball',
  emoji: '☃️',
  category: 'game',
  added: '2026-11-14',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://snowball.example.com/',
  title: {
    ko: '눈싸움',
    en: 'Snowball Fight',
    ja: '雪合戦',
    zh: '打雪仗',
    fr: 'Boules de neige',
    de: 'Schneeballschlacht',
    th: 'ปาหิมะ',
    vi: 'Ném tuyết',
    es: 'Bolas de nieve',
    it: 'Palle di neve',
    pt: 'Bolas de neve',
    ru: 'Снежки',
  },
  desc: {
    ko: '눈 요새 뒤에서 튀어나오는 아이들에게 눈덩이를 던지고, 날아오는 눈덩이는 벽 뒤로 숙여 피하는 60초 눈싸움 게임.',
    en: 'Peek over your snow wall, hit the kids popping up from their forts and duck when a snowball flies your way. 60 seconds, 3 hearts.',
    ja: '雪の砦から顔を出す相手に雪玉を当て、飛んでくる雪玉は壁の後ろにしゃがんでかわす60秒の雪合戦ゲーム。',
    zh: '朝雪堡后探出头的小伙伴扔雪球，雪球飞来时赶紧躲到雪墙后面。每局60秒的打雪仗游戏。',
    fr: 'Vise les enfants qui surgissent derrière leurs forts de neige et baisse-toi quand une boule fonce sur toi. 60 secondes, 3 cœurs.',
    de: 'Triff die Kinder, die hinter ihren Schneeburgen auftauchen, und duck dich, wenn ein Schneeball angeflogen kommt. 60 Sekunden, 3 Herzen.',
    th: 'ปาหิมะใส่เด็ก ๆ ที่โผล่จากป้อมหิมะ แล้วหมอบหลบหลังกำแพงเมื่อลูกหิมะพุ่งมา รอบละ 60 วินาที มี 3 หัวใจ',
    vi: 'Ném tuyết trúng những bạn nhỏ ló lên sau pháo đài tuyết và cúi xuống nấp khi quả cầu tuyết bay tới. 60 giây, 3 trái tim.',
    es: 'Acierta a los niños que asoman tras sus fuertes de nieve y agáchate cuando te lancen una bola. 60 segundos y 3 corazones.',
    it: 'Colpisci i bambini che spuntano dai fortini di neve e abbassati quando una palla vola verso di te. 60 secondi, 3 cuori.',
    pt: 'Acerte a criançada que aparece atrás dos fortes de neve e se abaixe quando vier uma bola na sua direção. 60 segundos, 3 corações.',
    ru: 'Попадай снежками в ребят, выглядывающих из-за снежных крепостей, и пригибайся, когда снежок летит в тебя. 60 секунд, 3 сердца.',
  },
};
