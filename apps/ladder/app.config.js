// ladder 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 11개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/ladder/ 로 바꾼다).
module.exports = {
  id: 'ladder',
  emoji: '🪜',
  category: 'vote',
  added: '2026-09-26',
  order: 3, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://ladder.example.com/',
  title: {
    ko: '사다리타기',
    en: 'Ladder Game',
    ja: 'あみだくじ',
    zh: '鬼脚图抽签',
    fr: 'Jeu de l’échelle',
    de: 'Leiterspiel',
    th: 'เกมบันไดสุ่ม',
    vi: 'Trò chơi bậc thang',
    es: 'Juego de la escalera',
    it: 'Gioco della scala',
    pt: 'Jogo da escada',
  },
  desc: {
    ko: '점심 메뉴부터 내기까지, 공정한 온라인 사다리타기.',
    en: 'Lunch picks, coffee runs, chores — a fair online random picker.',
    ja: 'ランチ決めからおごり決めまで。公平なオンラインあみだくじ。',
    zh: '从午餐吃什么到谁请客，公平的在线抽签。',
    fr: 'Déjeuner, qui paie le café, corvées — un tirage au sort équitable en ligne.',
    de: 'Mittagessen, wer zahlt den Kaffee, Aufgaben – faire Online-Auslosung.',
    th: 'ตั้งแต่เลือกเมนูมื้อเที่ยงถึงใครเลี้ยงกาแฟ สุ่มแบบยุติธรรมออนไลน์',
    vi: 'Từ chọn món trưa đến ai khao cà phê — bốc thăm trực tuyến công bằng.',
    es: 'Almuerzo, quién paga el café, tareas: un sorteo justo en línea.',
    it: 'Pranzo, chi paga il caffè, faccende: un sorteggio equo online.',
    pt: 'Almoço, quem paga o café, tarefas: um sorteio online justo.',
  },
};
