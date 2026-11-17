// reindeer 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/reindeer/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'reindeer',
  emoji: '🦌',
  category: 'game',
  added: '2026-11-18',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://reindeer.example.com/',
  title: {
    ko: '순록 점프',
    en: 'Reindeer Jump',
    ja: 'トナカイジャンプ',
    zh: '驯鹿跳跃',
    fr: 'Saut de renne',
    de: 'Rentier-Sprung',
    th: 'กวางเรนเดียร์กระโดด',
    vi: 'Tuần lộc nhảy',
    es: 'Salto de reno',
    it: 'Salto della renna',
    pt: 'Pulo da rena',
    ru: 'Прыжки оленя',
  },
  desc: {
    ko: '눈 덮인 밤 지붕을 달리는 원버튼 러너. 톡 치면 점프, 꾹 누르면 더 높이, 공중에서 한 번 더 2단 점프로 굴뚝·까마귀·지붕 틈을 넘으며 선물을 모아요.',
    en: 'A one-button runner on snowy night rooftops: tap to jump, hold to go higher, double jump over chimneys, crows and gaps.',
    ja: '雪の夜の屋根を走るワンボタン ランゲーム。タップでジャンプ、長押しで高く、二段ジャンプで煙突やカラス、屋根のすき間を越えてプレゼントを集めよう。',
    zh: '在雪夜屋顶上奔跑的单键跑酷：点击跳跃，按住跳得更高，用二段跳越过烟囱、乌鸦和屋顶空隙，沿途收集礼物。',
    fr: 'Course à un bouton sur les toits enneigés : touche pour sauter, maintiens pour monter, double saut sur cheminées et corbeaux.',
    de: 'Ein-Knopf-Lauf über verschneite Dächer bei Nacht: tippen, halten für mehr Höhe, Doppelsprung über Schornsteine, Krähen und Lücken.',
    th: 'เกมวิ่งปุ่มเดียวบนหลังคาหิมะยามค่ำ แตะเพื่อกระโดด กดค้างให้สูงขึ้น กระโดดสองชั้นข้ามปล่องไฟ อีกา และช่องระหว่างหลังคา แล้วเก็บของขวัญ',
    vi: 'Game chạy một nút trên mái nhà tuyết ban đêm: chạm để nhảy, giữ để nhảy cao, nhảy đôi qua ống khói, quạ và khe hở, nhặt quà dọc đường.',
    es: 'Carrera de un botón por tejados nevados: toca para saltar, mantén para subir más y haz doble salto sobre chimeneas y cuervos.',
    it: 'Corsa a un tasto sui tetti innevati: tocca per saltare, tieni premuto per salire, doppio salto su camini, corvi e buchi.',
    pt: 'Corrida de um botão pelos telhados nevados à noite: toque para pular, segure para subir e use o pulo duplo sobre chaminés, corvos e vãos.',
    ru: 'Раннер в одну кнопку по снежным ночным крышам: нажми — прыжок, держи — выше, двойным прыжком через трубы, ворон и пропасти за подарками.',
  },
};
