// dice 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/dice/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'dice',
  emoji: '🎲',
  category: 'vote',
  added: '2026-10-09',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://dice.example.com/',
  title: {
    ko: '주사위 굴리기',
    en: 'Dice Roller',
    ja: 'サイコロ',
    zh: '掷骰子',
    fr: 'Lancer de dés',
    de: 'Würfeln',
    th: 'ทอยลูกเต๋า',
    vi: 'Tung xúc xắc',
    es: 'Tirar dados',
    it: 'Lancia i dadi',
    pt: 'Rolar dados',
    ru: 'Бросить кубик',
  },
  desc: {
    ko: '주사위 1~6개를 한 번에 굴려요. 보통 주사위부터 d4·d8·d10·d12·d20까지, 합계와 최근 10번 기록도 바로 보여요.',
    en: 'Roll one to six dice at once: classic d6 or d4, d8, d10, d12 and d20 for tabletop games, with the total and your last 10 rolls.',
    ja: 'サイコロを1〜6個まとめて振れます。普通のd6からTRPG用のd4・d8・d10・d12・d20まで、合計と直近10回の履歴つき。',
    zh: '一次掷1到6个骰子。普通六面骰之外还有d4、d8、d10、d12、d20，马上显示点数合计和最近10次记录。',
    fr: 'Lance de un à six dés : le d6 classique ou les d4, d8, d10, d12 et d20 du jeu de rôle, avec le total et tes 10 derniers lancers.',
    de: 'Ein bis sechs Würfel auf einmal: klassischer W6 oder W4, W8, W10, W12 und W20 fürs Rollenspiel, mit Summe und den letzten 10 Würfen.',
    th: 'ทอยลูกเต๋าได้ครั้งละ 1-6 ลูก ทั้งลูกเต๋าหกหน้าและ d4 d8 d10 d12 d20 สำหรับบอร์ดเกม พร้อมผลรวมและประวัติ 10 ครั้งล่าสุด',
    vi: 'Gieo từ một đến sáu xúc xắc: d6 quen thuộc hoặc d4, d8, d10, d12, d20 cho board game, kèm tổng điểm và 10 lần gieo gần nhất.',
    es: 'Tira de uno a seis dados: el d6 de siempre o d4, d8, d10, d12 y d20 para juegos de rol, con el total y tus 10 últimas tiradas.',
    it: 'Lancia da uno a sei dadi: il classico d6 o i d4, d8, d10, d12 e d20 dei giochi di ruolo, con il totale e gli ultimi 10 lanci.',
    pt: 'Role de um a seis dados: o d6 clássico ou d4, d8, d10, d12 e d20 para RPG de mesa, com o total e suas 10 últimas rolagens.',
    ru: 'Брось от одного до шести кубиков: обычный d6 или d4, d8, d10, d12 и d20 для настолок, с суммой и последними 10 бросками.',
  },
};
