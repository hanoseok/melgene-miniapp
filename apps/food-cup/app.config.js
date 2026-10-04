// food-cup 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/food-cup/ 로 바꾼다).
// 스포일러 금지: 설명은 방식만(음식 목록 없음).
module.exports = {
  id: 'food-cup',
  emoji: '🍽️',
  category: 'vote',
  added: '2026-09-29',
  path: 'https://food-cup.example.com/',
  title: {
    ko: '음식 월드컵',
    en: 'Food Tournament',
    ja: '食べ物トーナメント',
    zh: '美食世界杯',
    fr: 'Tournoi de bouffe',
    de: 'Essen-Turnier',
    th: 'ทัวร์นาเมนต์อาหาร',
    vi: 'Giải đấu món ăn',
    es: 'Torneo de comida',
    it: 'Torneo del cibo',
    pt: 'Torneio de comida',
    ru: 'Битва блюд',
  },
  desc: {
    ko: '두 음식 중 더 먹고 싶은 걸 골라 16강부터 결승까지. 끝까지 남는 내 최애 음식과 다른 사람들의 실제 선택률을 확인해요.',
    en: 'Two dishes at a time: tap the one you’d rather eat, from the round of 16 to the final, and see how others really picked.',
    ja: '2つの料理から食べたい方を選んで1回戦から決勝まで。最後に残る好きな食べ物と、みんなの本当の選択率がわかる。',
    zh: '两道菜选一道更想吃的，从16强一路选到决赛，看看你的本命美食和大家的真实选择比例。',
    fr: 'Deux plats à chaque duel : touche celui que tu préfères manger, des huitièmes à la finale, et vois ce que les autres ont vraiment choisi.',
    de: 'Immer zwei Gerichte: Tippe auf das, was du lieber isst – vom Achtelfinale bis zum Finale – und sieh, was andere wirklich gewählt haben.',
    th: 'เลือกเมนูที่อยากกินมากกว่าทีละสองจาน ตั้งแต่รอบ 16 ทีมจนถึงรอบชิง แล้วดูว่าคนอื่นเลือกอะไรจริง ๆ',
    vi: 'Mỗi lượt hai món: chạm vào món bạn muốn ăn hơn, từ vòng 1/8 đến chung kết, rồi xem mọi người thật sự đã chọn gì.',
    es: 'Dos platos por duelo: toca el que prefieres comer, de octavos a la final, y mira qué eligieron de verdad los demás.',
    it: 'Due piatti per sfida: tocca quello che preferisci mangiare, dagli ottavi alla finale, e scopri cosa hanno scelto davvero gli altri.',
    pt: 'Dois pratos por disputa: toque no que você prefere comer, das oitavas à final, e veja o que os outros escolheram de verdade.',
    ru: 'Каждый раз два блюда: выбирай, что съел бы с большей охотой, от 1/8 до финала, и смотри, что на самом деле выбрали другие.',
  },
};
