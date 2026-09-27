// pumpkin 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/pumpkin/ 로 바꾼다).
module.exports = {
  id: 'pumpkin',
  emoji: '🎃',
  category: 'create',
  added: '2026-09-28',
  path: 'https://pumpkin.example.com/',
  title: {
    ko: '할로윈 호박 꾸미기',
    en: 'Pumpkin Carving Online',
    ja: 'かぼちゃランタン作り',
    zh: '万圣节南瓜灯制作',
    fr: 'Sculpter une citrouille',
    de: 'Kürbis schnitzen online',
    th: 'แกะสลักฟักทองฮาโลวีน',
    vi: 'Khắc bí ngô Halloween',
    es: 'Tallar calabaza de Halloween',
    it: 'Intagliare la zucca di Halloween',
    pt: 'Esculpir abóbora de Halloween',
    ru: 'Вырезать тыкву на Хэллоуин',
  },
  desc: {
    ko: '눈·코·입을 골라 나만의 잭오랜턴을 만들고 촛불을 켜 보세요. 이미지로 저장하고 친구에게 보내기.',
    en: 'Pick eyes, nose and mouth, light the candle and carve your own jack-o’-lantern. Save it as an image or send it to a friend.',
    ja: '目・鼻・口を選んで自分だけのジャックオーランタンを作ろう。ろうそくを灯して画像保存、友だちにも送れる。',
    zh: '挑选眼睛、鼻子和嘴巴，点亮蜡烛，做一盏专属南瓜灯。可以存成图片，也能发给朋友。',
    fr: 'Choisis les yeux, le nez et la bouche, allume la bougie et crée ta citrouille d’Halloween. Enregistre l’image ou envoie-la à un ami.',
    de: 'Augen, Nase und Mund aussuchen, Kerze anzünden und deinen eigenen Halloween-Kürbis schnitzen. Als Bild speichern oder Freunden schicken.',
    th: 'เลือกตา จมูก ปาก จุดเทียน แล้วสร้างฟักทองแจ็คโอแลนเทิร์นของคุณเอง บันทึกเป็นรูปหรือส่งให้เพื่อนได้',
    vi: 'Chọn mắt, mũi, miệng, thắp nến và khắc chiếc đèn bí ngô của riêng bạn. Lưu thành ảnh hoặc gửi cho bạn bè.',
    es: 'Elige ojos, nariz y boca, enciende la vela y talla tu propia calabaza de Halloween. Guárdala como imagen o envíasela a un amigo.',
    it: 'Scegli occhi, naso e bocca, accendi la candela e intaglia la tua zucca di Halloween. Salvala come immagine o mandala a un amico.',
    pt: 'Escolha olhos, nariz e boca, acenda a vela e esculpa sua própria abóbora de Halloween. Salve como imagem ou mande para um amigo.',
    ru: 'Выбери глаза, нос и рот, зажги свечу и вырежи свою тыкву-фонарь. Сохрани картинку или отправь другу.',
  },
};
