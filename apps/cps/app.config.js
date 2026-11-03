// cps 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/cps/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'cps',
  emoji: '🖱️',
  category: 'game',
  added: '2026-11-04',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://cps.example.com/',
  title: {
    ko: '클릭 속도 테스트',
    en: 'CPS Test',
    ja: 'クリック速度テスト',
    zh: '点击速度测试',
    fr: 'Test de clics',
    de: 'CPS-Klicktest',
    th: 'ทดสอบความเร็วคลิก',
    vi: 'Test tốc độ click',
    es: 'Test de clics',
    it: 'Test dei click',
    pt: 'Teste de cliques',
    ru: 'Тест на скорость кликов',
  },
  desc: {
    ko: '1초·5초·10초 동안 최대한 빨리 클릭하세요. 초당 클릭 수(CPS)와 내 등급, 다른 사람과의 비교까지.',
    en: 'Click as fast as you can for 1, 5 or 10 seconds and see your clicks per second (CPS), your rank badge and how you compare.',
    ja: '1秒・5秒・10秒でどれだけ速くクリックできる？1秒あたりのクリック数（CPS）とランクがすぐわかります。',
    zh: '在1秒、5秒或10秒内尽情狂点，测出你的每秒点击数（CPS）和手速等级。',
    fr: 'Clique le plus vite possible pendant 1, 5 ou 10 secondes et découvre tes clics par seconde (CPS) et ton niveau.',
    de: 'Klick 1, 5 oder 10 Sekunden lang so schnell du kannst und sieh deine Klicks pro Sekunde (CPS) und deinen Rang.',
    th: 'คลิกให้เร็วที่สุดใน 1, 5 หรือ 10 วินาที แล้วดูว่าคุณคลิกได้กี่ครั้งต่อวินาที (CPS) พร้อมระดับของคุณ',
    vi: 'Click thật nhanh trong 1, 5 hoặc 10 giây để biết số click mỗi giây (CPS) và cấp độ tay nhanh của bạn.',
    es: 'Haz clic lo más rápido que puedas durante 1, 5 o 10 segundos y descubre tus clics por segundo (CPS) y tu nivel.',
    it: 'Clicca più veloce che puoi per 1, 5 o 10 secondi e scopri i tuoi click al secondo (CPS) e il tuo livello.',
    pt: 'Clique o mais rápido que puder por 1, 5 ou 10 segundos e descubra seus cliques por segundo (CPS) e seu nível.',
    ru: 'Кликай как можно быстрее 1, 5 или 10 секунд и узнай свою скорость в кликах в секунду (CPS) и свой уровень.',
  },
};
