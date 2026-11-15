// sled 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/sled/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'sled',
  emoji: '🛷',
  category: 'game',
  added: '2026-11-16',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://sled.example.com/',
  title: {
    ko: '썰매 레이스',
    en: 'Sled Race',
    ja: 'そりレース',
    zh: '雪橇竞速',
    fr: 'Course de luge',
    de: 'Schlittenrennen',
    th: 'แข่งเลื่อนหิมะ',
    vi: 'Đua xe trượt tuyết',
    es: 'Carrera de trineos',
    it: 'Corsa in slitta',
    pt: 'Corrida de trenó',
    ru: 'Гонка на санках',
  },
  desc: {
    ko: '끝없는 눈 언덕을 썰매로 내려가며 나무·바위·눈사람을 피하고, 깃발·선물·황금 별을 모으고, 점프대로 날아오르는 90초 레이스.',
    en: 'Sled down an endless snowy hill: dodge trees, rocks and snowmen, grab flags, gifts and golden stars, and fly off ramps. 90 seconds.',
    ja: '終わりのない雪山をそりで滑り降り、木や岩や雪だるまをよけて旗やプレゼントを集め、ジャンプ台で空を飛ぶ90秒レース。',
    zh: '坐雪橇冲下无尽雪坡，躲开松树、岩石和雪人，收集小旗、礼物和金星，冲上跳台飞起来。每局90秒。',
    fr: 'Dévale une pente enneigée sans fin en luge : évite sapins, rochers et bonshommes, attrape cadeaux et étoiles, saute sur les tremplins.',
    de: 'Rodel einen endlosen Hang hinab: Weich Tannen, Felsen und Schneemännern aus, sammle Geschenke und Sterne und flieg über Schanzen.',
    th: 'ไถลเลื่อนลงเนินหิมะไม่รู้จบ หลบต้นสน หิน และตุ๊กตาหิมะ เก็บธง ของขวัญ และดาวทอง แล้วพุ่งขึ้นทางกระโดด รอบละ 90 วินาที',
    vi: 'Lao xe trượt xuống con dốc tuyết bất tận: né cây, đá và người tuyết, nhặt cờ, quà, sao vàng và bay qua dốc nhảy. 90 giây, 3 tim.',
    es: 'Baja en trineo por una ladera nevada sin fin: esquiva pinos, rocas y muñecos de nieve, recoge regalos y estrellas y vuela en las rampas.',
    it: 'Scendi in slitta da un pendio innevato infinito: schiva abeti, rocce e pupazzi di neve, prendi regali e stelle e vola dai trampolini.',
    pt: 'Desça de trenó uma encosta nevada sem fim: desvie de pinheiros, pedras e bonecos de neve, pegue presentes e estrelas e voe nas rampas.',
    ru: 'Мчись на санках с бесконечной снежной горы: объезжай ёлки, камни и снеговиков, собирай подарки и звёзды, взлетай с трамплинов.',
  },
};
