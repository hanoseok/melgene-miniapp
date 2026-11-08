// snowman 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/snowman/ 로 바꾼다).
module.exports = {
  id: 'snowman',
  emoji: '⛄',
  category: 'create',
  added: '2026-11-09',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://snowman.example.com/',
  title: {
    ko: '눈사람 만들기',
    en: 'Snowman Maker',
    ja: '雪だるま作り',
    zh: '堆雪人',
    fr: 'Bonhomme de neige',
    de: 'Schneemann bauen',
    th: 'ปั้นตุ๊กตาหิมะ',
    vi: 'Đắp người tuyết',
    es: 'Muñeco de nieve',
    it: 'Pupazzo di neve',
    pt: 'Boneco de neve',
    ru: 'Слепи снеговика',
  },
  desc: {
    ko: '눈덩이 크기부터 눈·입·당근 코·모자·목도리·팔까지 톡톡 골라 나만의 눈사람을 만들어 보세요. 눈 내리는 배경, 이름 붙이기, 이미지 저장과 링크 공유까지.',
    en: 'Build a snowman online: stack the snowballs, pick eyes, a carrot nose, a hat, a scarf and arms, name it, then save the picture or send a link.',
    ja: '雪玉の大きさから目・口・にんじんの鼻・帽子・マフラー・腕までタップで選んで、自分だけの雪だるまを作ろう。名前をつけて画像保存やリンクでシェア。',
    zh: '从雪球大小到眼睛、嘴巴、胡萝卜鼻子、帽子、围巾和手臂，点一点就能堆出自己的雪人。取个名字，存成图片或发链接分享。',
    fr: 'Fais ton bonhomme de neige en ligne : empile les boules, choisis les yeux, le nez en carotte, le chapeau, l’écharpe et les bras, donne-lui un nom, puis enregistre l’image ou partage un lien.',
    de: 'Schneemann bauen online: Schneekugeln stapeln, Augen, Karottennase, Hut, Schal und Arme wählen, einen Namen geben – dann als Bild speichern oder per Link teilen.',
    th: 'ปั้นตุ๊กตาหิมะออนไลน์ เลือกก้อนหิมะ ตา ปาก จมูกแครอท หมวก ผ้าพันคอ และแขน ตั้งชื่อ แล้วบันทึกรูปหรือแชร์ลิงก์',
    vi: 'Đắp người tuyết online: xếp các quả cầu tuyết, chọn mắt, mũi cà rốt, mũ, khăn quàng và tay, đặt tên rồi lưu ảnh hoặc gửi link.',
    es: 'Haz tu muñeco de nieve online: apila las bolas, elige ojos, nariz de zanahoria, sombrero, bufanda y brazos, ponle nombre y guarda la imagen o comparte un enlace.',
    it: 'Crea il tuo pupazzo di neve online: impila le palle, scegli occhi, naso di carota, cappello, sciarpa e braccia, dagli un nome e salva l’immagine o condividi un link.',
    pt: 'Monte seu boneco de neve online: empilhe as bolas, escolha olhos, nariz de cenoura, chapéu, cachecol e braços, dê um nome e salve a imagem ou compartilhe um link.',
    ru: 'Слепи снеговика онлайн: выбери комы, глаза, нос-морковку, шапку, шарф и руки, дай ему имя — и сохрани картинку или отправь ссылку.',
  },
};
