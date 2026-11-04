// xmastree 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/xmastree/ 로 바꾼다).
module.exports = {
  id: 'xmastree',
  emoji: '🎄',
  category: 'create',
  added: '2026-11-05',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://xmastree.example.com/',
  title: {
    ko: '크리스마스 트리 꾸미기',
    en: 'Decorate a Christmas Tree',
    ja: 'クリスマスツリー飾り付け',
    zh: '装饰圣诞树',
    fr: 'Décorer un sapin de Noël',
    de: 'Christbaum schmücken',
    th: 'แต่งต้นคริสต์มาส',
    vi: 'Trang trí cây thông Noel',
    es: 'Decorar el árbol de Navidad',
    it: 'Decorare l’albero di Natale',
    pt: 'Decorar árvore de Natal',
    ru: 'Нарядить ёлку',
  },
  desc: {
    ko: '트리 모양과 배경을 고르고 공·별·지팡이 사탕·선물을 톡톡 달아 크리스마스 트리를 꾸며 보세요. 반짝이는 전구와 눈, 이미지 저장과 링크 공유까지.',
    en: 'Pick a tree and a background, tap to hang baubles, stars, candy canes and gifts, switch on twinkling lights and snow, then save the picture or share a link.',
    ja: 'ツリーと背景を選んで、ボールや星、キャンディケイン、プレゼントをタップで飾り付け。きらめくライトと雪をつけて、画像保存やリンクでシェアできます。',
    zh: '选好树形和背景，点一点挂上彩球、星星、拐杖糖和礼物，再打开闪烁的彩灯和雪花，存成图片或发链接分享。',
    fr: 'Choisis un sapin et un décor, accroche boules, étoiles, sucres d’orge et cadeaux d’un tap, allume les guirlandes et la neige, puis enregistre l’image ou partage un lien.',
    de: 'Baum und Hintergrund wählen, Kugeln, Sterne, Zuckerstangen und Geschenke antippen, Lichterkette und Schnee einschalten – dann als Bild speichern oder per Link teilen.',
    th: 'เลือกต้นไม้และฉากหลัง แตะเพื่อแขวนลูกบอล ดาว ไม้เท้าลูกกวาด และของขวัญ เปิดไฟกะพริบกับหิมะ แล้วบันทึกรูปหรือแชร์ลิงก์',
    vi: 'Chọn cây thông và phông nền, chạm để treo quả châu, ngôi sao, kẹo gậy và quà, bật đèn lấp lánh và tuyết rơi, rồi lưu ảnh hoặc gửi link.',
    es: 'Elige un árbol y un fondo, toca para colgar bolas, estrellas, bastones de caramelo y regalos, enciende las luces y la nieve, y guarda la imagen o comparte un enlace.',
    it: 'Scegli un albero e uno sfondo, tocca per appendere palline, stelle, bastoncini di zucchero e regali, accendi luci e neve, poi salva l’immagine o condividi un link.',
    pt: 'Escolha uma árvore e um fundo, toque para pendurar bolinhas, estrelas, bengalinhas e presentes, acenda o pisca-pisca e a neve, e salve a imagem ou compartilhe um link.',
    ru: 'Выбери ёлку и фон, нажимай, чтобы повесить шары, звёзды, леденцы и подарки, включи гирлянду и снег — и сохрани картинку или отправь ссылку.',
  },
};
