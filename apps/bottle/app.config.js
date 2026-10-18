// bottle 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/bottle/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'bottle',
  emoji: '🍾',
  category: 'vote',
  added: '2026-10-19',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://bottle.example.com/',
  title: {
    ko: '병 돌리기',
    en: 'Spin the Bottle',
    ja: 'ボトル回し',
    zh: '转瓶子',
    fr: 'Jeu de la bouteille',
    de: 'Flaschendrehen',
    th: 'หมุนขวด',
    vi: 'Quay chai',
    es: 'Juego de la botella',
    it: 'Gioco della bottiglia',
    pt: 'Jogo da garrafa',
    ru: 'Бутылочка',
  },
  desc: {
    ko: '휴대폰을 테이블 가운데 두고 병을 돌려요. 이름을 둘러 앉히면 누가 먼저 할지, 누가 노래를 고를지 공정하게 정해 줘요.',
    en: 'Put the phone in the middle of the table and spin the bottle. Seat everyone’s names around it to fairly pick who goes first or who chooses the song.',
    ja: 'スマホをテーブルの真ん中に置いてボトルを回そう。名前を並べれば、誰が先にやるか・誰が曲を選ぶかを公平に決められます。',
    zh: '把手机放在桌子中间转瓶子。把大家的名字围成一圈，公平决定谁先来、谁来点歌。',
    fr: 'Posez le téléphone au milieu de la table et faites tourner la bouteille. Placez les prénoms autour pour savoir qui commence ou qui choisit la musique.',
    de: 'Handy in die Tischmitte, Flasche drehen! Namen im Kreis eintragen und fair entscheiden, wer anfängt oder wer das nächste Lied aussucht.',
    th: 'วางมือถือกลางโต๊ะแล้วหมุนขวด ใส่ชื่อเพื่อนรอบวง ให้ขวดชี้ว่าใครเริ่มก่อนหรือใครได้เลือกเพลงอย่างยุติธรรม',
    vi: 'Đặt điện thoại giữa bàn và quay chai. Xếp tên mọi người quanh vòng để chọn công bằng ai đi trước hay ai được chọn bài hát.',
    es: 'Pon el móvil en el centro de la mesa y gira la botella. Coloca los nombres alrededor y decide con justicia quién empieza o quién elige la canción.',
    it: 'Metti il telefono al centro del tavolo e gira la bottiglia. Disponi i nomi in cerchio e scopri in modo equo chi inizia o chi sceglie la canzone.',
    pt: 'Coloque o celular no meio da mesa e gire a garrafa. Ponha os nomes em roda e decida de forma justa quem começa ou quem escolhe a música.',
    ru: 'Положите телефон в центр стола и крутите бутылочку. Впишите имена по кругу — и честно решите, кто начинает или кто выбирает песню.',
  },
};
