// lots 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/lots/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'lots',
  emoji: '🎟️',
  category: 'vote',
  added: '2026-10-17',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://lots.example.com/',
  title: {
    ko: '제비뽑기',
    en: 'Draw Lots',
    ja: 'くじ引き',
    zh: '抽签',
    fr: 'Tirage au sort',
    de: 'Losziehen',
    th: 'จับฉลาก',
    vi: 'Bốc thăm',
    es: 'Sorteo',
    it: 'Estrazione a sorte',
    pt: 'Sorteio',
    ru: 'Жеребьёвка',
  },
  desc: {
    ko: '휴대폰을 돌려 가며 한 명씩 접힌 쪽지를 골라요. 당첨·꽝은 물론 벌칙·커피 쏘기까지, 누가 뭘 뽑았는지 결과로 정리돼요.',
    en: 'Pass the phone and let everyone pick a folded paper slip. Winners and blanks or your own prizes, with a clear who-got-what summary.',
    ja: 'スマホを回して一人ずつ折りたたんだ紙を引くくじ引き。当たり・ハズレも罰ゲームも、誰が何を引いたか最後にまとめて表示。',
    zh: '手机传一圈，每人抽一张折好的纸签。中签、空签或自定义奖项都行，最后清楚列出谁抽到了什么。',
    fr: 'Faites passer le téléphone : chacun choisit un papier plié. Gagnants et perdants ou vos propres lots, avec le résumé de qui a eu quoi.',
    de: 'Handy herumgeben, jeder zieht einen gefalteten Zettel. Gewinne und Nieten oder eigene Lose, am Ende sieht man, wer was gezogen hat.',
    th: 'ส่งมือถือต่อกัน ให้ทุกคนเลือกฉลากพับทีละใบ มีทั้งถูกรางวัล ไม่ถูก หรือตั้งรางวัลเอง สรุปท้ายว่าใครได้อะไร',
    vi: 'Chuyền điện thoại, mỗi người chọn một lá thăm gấp. Trúng, trượt hay giải tự đặt, cuối cùng có bảng tổng hợp ai bốc được gì.',
    es: 'Pasa el móvil y que cada uno elija un papelito doblado. Premios y vacíos o tus propias opciones, con el resumen de quién sacó qué.',
    it: 'Passate il telefono: ognuno pesca un bigliettino piegato. Vincenti e vuoti o premi vostri, con il riepilogo di chi ha pescato cosa.',
    pt: 'Passe o celular e cada um escolhe um papelzinho dobrado. Prêmios e vazios ou opções suas, com o resumo de quem tirou o quê.',
    ru: 'Передавайте телефон по кругу — каждый тянет сложенную бумажку. Выигрыш, пустышки или свои варианты и итог, кому что досталось.',
  },
};
