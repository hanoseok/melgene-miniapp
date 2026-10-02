// invite 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/invite/ 로 바꾼다).
module.exports = {
  id: 'invite',
  emoji: '💌',
  category: 'create',
  added: '2026-10-03',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://invite.example.com/',
  title: {
    ko: '할로윈 파티 초대장 만들기',
    en: 'Party Invitation Maker',
    ja: 'ハロウィン招待状メーカー',
    zh: '万圣节派对邀请函制作',
    fr: 'Invitation Halloween',
    de: 'Halloween-Einladung',
    th: 'สร้างการ์ดเชิญปาร์ตี้ฮาโลวีน',
    vi: 'Tạo thiệp mời tiệc Halloween',
    es: 'Invitación de fiesta de Halloween',
    it: 'Invito per festa di Halloween',
    pt: 'Convite de festa de Halloween',
    ru: 'Приглашение на Хэллоуин',
  },
  desc: {
    ko: '파티 이름·날짜·시간·장소·한마디를 넣고 유령·호박·박쥐·마녀 테마를 골라 오싹한 초대장을 만들어 보세요. 이미지 저장, 링크 공유, 텍스트 복사.',
    en: 'Add the party name, date, time, place and a note, pick a ghost, pumpkin, bat or witch theme and make a spooky invitation. Save the image, share a link or copy the text.',
    ja: 'パーティー名・日時・場所・ひとことを入れて、おばけ・かぼちゃ・コウモリ・魔女のテーマで招待状を作ろう。画像保存、リンク共有、テキストコピーもOK。',
    zh: '填写派对名称、日期、时间、地点和留言，选择幽灵、南瓜、蝙蝠或女巫主题，做一张惊悚邀请函。可存图片、分享链接或复制文字。',
    fr: 'Ajoute le nom de la fête, la date, l’heure, le lieu et un mot, choisis un thème fantôme, citrouille, chauve-souris ou sorcière. Enregistre l’image, partage le lien ou copie le texte.',
    de: 'Partyname, Datum, Uhrzeit, Ort und eine Nachricht eintragen, Gespenst-, Kürbis-, Fledermaus- oder Hexen-Motiv wählen. Als Bild speichern, Link teilen oder Text kopieren.',
    th: 'ใส่ชื่องาน วันที่ เวลา สถานที่ และข้อความ เลือกธีมผี ฟักทอง ค้างคาว หรือแม่มด บันทึกเป็นรูป แชร์ลิงก์ หรือคัดลอกข้อความได้',
    vi: 'Nhập tên tiệc, ngày, giờ, địa điểm và lời nhắn, chọn chủ đề ma, bí ngô, dơi hoặc phù thủy. Lưu thành ảnh, chia sẻ link hoặc sao chép nội dung.',
    es: 'Escribe el nombre de la fiesta, la fecha, la hora, el lugar y un mensaje, y elige un tema de fantasma, calabaza, murciélago o bruja. Guarda la imagen, comparte el enlace o copia el texto.',
    it: 'Scrivi nome della festa, data, ora, luogo e un messaggio, scegli un tema fantasma, zucca, pipistrello o strega. Salva l’immagine, condividi il link o copia il testo.',
    pt: 'Escreva o nome da festa, a data, a hora, o local e um recado, e escolha um tema de fantasma, abóbora, morcego ou bruxa. Salve a imagem, compartilhe o link ou copie o texto.',
    ru: 'Впиши название вечеринки, дату, время, место и пару слов, выбери тему — привидение, тыква, летучая мышь или ведьма. Сохрани картинку, поделись ссылкой или скопируй текст.',
  },
};
