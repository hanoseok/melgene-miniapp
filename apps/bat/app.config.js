// bat 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/bat/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'bat',
  emoji: '🦇',
  category: 'game',
  added: '2026-10-25',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://bat.example.com/',
  title: {
    ko: '할로윈 박쥐 날기',
    en: 'Flappy Bat',
    ja: 'フラッピーバット',
    zh: '飞吧蝙蝠',
    fr: 'Flappy chauve-souris',
    de: 'Flappy Fledermaus',
    th: 'เกมค้างคาวบิน',
    vi: 'Dơi bay Halloween',
    es: 'Flappy murciélago',
    it: 'Flappy pipistrello',
    pt: 'Flappy morcego',
    ru: 'Летучая мышь Flappy',
  },
  desc: {
    ko: '탭할 때마다 박쥐가 날갯짓해요. 보름달 아래 묘비와 유령 나무 사이 틈을 지나갈수록 점수가 올라가요.',
    en: 'Tap to flap and guide a little bat through the gaps between gravestones and haunted trees under the full moon. Every gap scores a point.',
    ja: 'タップで羽ばたいて、満月の下のお墓とおばけの木のすき間をくぐり抜けよう。くぐるたびに1点。',
    zh: '点击让小蝙蝠扇动翅膀，在满月下穿过墓碑和鬼树之间的空隙。每穿过一道得 1 分。',
    fr: 'Tape pour battre des ailes et guide la petite chauve-souris entre les tombes et les arbres hantés, sous la pleine lune.',
    de: 'Tippe zum Flattern und lenke die kleine Fledermaus im Vollmond durch die Lücken zwischen Grabsteinen und Spukbäumen.',
    th: 'แตะเพื่อกระพือปีก พาค้างคาวน้อยบินลอดช่องระหว่างหลุมศพกับต้นไม้ผีสิงใต้แสงจันทร์เต็มดวง ลอดได้หนึ่งช่องได้หนึ่งแต้ม',
    vi: 'Chạm để vỗ cánh, đưa chú dơi nhỏ bay qua khe hở giữa bia mộ và cây ma dưới trăng tròn. Mỗi khe qua được tính một điểm.',
    es: 'Toca para aletear y guía al murciélago entre lápidas y árboles embrujados bajo la luna llena. Cada hueco suma un punto.',
    it: 'Tocca per sbattere le ali e guida il pipistrello tra lapidi e alberi stregati sotto la luna piena. Ogni varco vale un punto.',
    pt: 'Toque para bater as asas e guie o morceguinho entre lápides e árvores assombradas sob a lua cheia. Cada vão vale um ponto.',
    ru: 'Нажимай, чтобы взмахнуть крыльями, и веди летучую мышь между надгробиями и жуткими деревьями под полной луной.',
  },
};
