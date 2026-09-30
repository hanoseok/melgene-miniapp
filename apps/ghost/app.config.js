// ghost 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/ghost/ 로 바꾼다).
module.exports = {
  id: 'ghost',
  emoji: '👻',
  category: 'create',
  added: '2026-10-01',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://ghost.example.com/',
  title: {
    ko: '나만의 유령 만들기',
    en: 'Ghost Maker',
    ja: 'おばけメーカー',
    zh: '万圣节小幽灵制作',
    fr: 'Créer son fantôme',
    de: 'Gespenst erstellen',
    th: 'สร้างผีน้อยฮาโลวีน',
    vi: 'Tạo con ma Halloween',
    es: 'Crea tu fantasma',
    it: 'Crea il tuo fantasmino',
    pt: 'Crie seu fantasminha',
    ru: 'Создай привидение',
  },
  desc: {
    ko: '몸 모양·눈·입·모자를 골라 둥실둥실 떠다니는 나만의 귀여운 유령을 만들어 보세요. 이미지로 저장하고 친구에게 보내기.',
    en: 'Pick a body, eyes, mouth and a hat and make your own cute floating ghost. Save it as an image or send it to a friend.',
    ja: 'からだ・目・口・帽子を選んで、ふわふわ浮かぶ自分だけのおばけを作ろう。画像保存も、友だちに送るのもOK。',
    zh: '挑选身体、眼睛、嘴巴和帽子，捏一只轻飘飘的专属小幽灵。可以存成图片，也能发给朋友。',
    fr: 'Choisis la forme, les yeux, la bouche et un chapeau pour créer ton petit fantôme qui flotte. Enregistre l’image ou envoie-la à un ami.',
    de: 'Form, Augen, Mund und Hut aussuchen und dein eigenes süßes Schwebe-Gespenst gestalten. Als Bild speichern oder Freunden schicken.',
    th: 'เลือกรูปร่าง ตา ปาก และหมวก สร้างผีน้อยน่ารักที่ลอยไปมาของคุณเอง บันทึกเป็นรูปหรือส่งให้เพื่อนได้',
    vi: 'Chọn dáng, mắt, miệng và mũ để tạo chú ma nhỏ dễ thương bay lơ lửng của riêng bạn. Lưu thành ảnh hoặc gửi cho bạn bè.',
    es: 'Elige forma, ojos, boca y sombrero y crea tu propio fantasmita tierno que flota. Guárdalo como imagen o mándaselo a un amigo.',
    it: 'Scegli forma, occhi, bocca e cappello e crea il tuo fantasmino tenerissimo che fluttua. Salvalo come immagine o mandalo a un amico.',
    pt: 'Escolha formato, olhos, boca e chapéu e crie seu fantasminha fofo que flutua. Salve como imagem ou mande para um amigo.',
    ru: 'Выбери форму, глаза, рот и шляпу и создай своё милое парящее привидение. Сохрани картинку или отправь другу.',
  },
};
