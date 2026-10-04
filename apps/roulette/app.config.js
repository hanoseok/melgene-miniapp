// roulette 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/roulette/ 로 바꾼다).
module.exports = {
  id: 'roulette',
  emoji: '🎡',
  category: 'vote',
  added: '2026-09-27',
  order: 3, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://roulette.example.com/',
  title: {
    ko: '돌림판',
    en: 'Spin the Wheel',
    ja: 'ルーレット',
    zh: '转盘抽签',
    fr: 'Roue de la fortune',
    de: 'Glücksrad',
    th: 'วงล้อสุ่ม',
    vi: 'Vòng quay may mắn',
    es: 'Ruleta',
    it: 'Ruota della fortuna',
    pt: 'Roleta aleatória',
    ru: 'Колесо фортуны',
  },
  desc: {
    ko: '점심 메뉴, 당번, 벌칙까지. 항목만 적고 돌리면 끝.',
    en: 'Lunch, chores, dares — type your options and spin.',
    ja: 'ランチも当番も罰ゲームも。項目を書いて回すだけ。',
    zh: '午餐、值日、惩罚游戏，写好选项转一转就行。',
    fr: 'Déjeuner, corvées, gages — écrivez vos options et faites tourner.',
    de: 'Mittagessen, Aufgaben, Mutproben – Optionen eintragen und drehen.',
    th: 'มื้อเที่ยง เวร บทลงโทษ เขียนตัวเลือกแล้วหมุนเลย',
    vi: 'Món trưa, trực nhật, hình phạt — nhập lựa chọn rồi quay.',
    es: 'Almuerzo, tareas, retos: escribe tus opciones y gira.',
    it: 'Pranzo, turni, penitenze: scrivi le opzioni e gira.',
    pt: 'Almoço, tarefas, desafios: escreva as opções e gire.',
    ru: 'Обед, дежурства, фанты — впиши варианты и крути.',
  },
};
