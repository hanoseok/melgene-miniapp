// seat 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/seat/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'seat',
  emoji: '🪑',
  category: 'vote',
  added: '2026-10-13',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://seat.example.com/',
  title: {
    ko: '자리 바꾸기',
    en: 'Random Seating Chart',
    ja: '席替え',
    zh: '随机排座位',
    fr: 'Plan de classe aléatoire',
    de: 'Zufälliger Sitzplan',
    th: 'สุ่มที่นั่ง',
    vi: 'Xếp chỗ ngồi ngẫu nhiên',
    es: 'Plano de clase aleatorio',
    it: 'Sorteggio dei posti',
    pt: 'Mapa de sala aleatório',
    ru: 'Рассадка учеников',
  },
  desc: {
    ko: '이름만 넣으면 랜덤 자리 배치 끝. 교실 줄·칸, 빈자리, 떨어뜨릴 짝, 고정 자리, 앞자리까지 정하고 공정하게 섞어요.',
    en: 'Paste your class list and shuffle a fair seating chart. Set rows and columns, aisles, keep-apart pairs, fixed and front-row seats.',
    ja: '名前を入れるだけでランダムに席替え。列と席数、空席、離したい2人、固定席、前の席まで決めて公平にシャッフル。',
    zh: '输入名单就能随机排座位。可设行列、空位、不坐一起的同学、固定座位和前排座位，公平打乱。',
    fr: 'Colle ta liste et tire un plan de classe au hasard. Rangées, allées, élèves à séparer, places fixes et premier rang.',
    de: 'Klassenliste einfügen, fairen Sitzplan auslosen. Reihen, Gänge, getrennte Paare, feste Plätze und vordere Reihen.',
    th: 'ใส่รายชื่อแล้วสุ่มผังที่นั่งได้ทันที กำหนดแถว ช่องว่าง คู่ที่ต้องแยก ที่นั่งประจำ และแถวหน้าได้',
    vi: 'Dán danh sách lớp và xếp chỗ ngồi ngẫu nhiên công bằng. Chọn hàng, lối đi, cặp cần tách, chỗ cố định, bàn đầu.',
    es: 'Pega la lista y sortea un plano de clase justo. Filas, pasillos, parejas separadas, sitios fijos y primera fila.',
    it: 'Incolla l’elenco e sorteggia i posti in classe. File, corridoi, coppie da separare, posti fissi e prime file.',
    pt: 'Cole a lista da turma e sorteie um mapa de sala justo. Fileiras, corredores, duplas separadas, lugares fixos e frente.',
    ru: 'Вставьте список класса и получите честную случайную рассадку. Ряды, проходы, кого развести, закреплённые места и первые парты.',
  },
};
