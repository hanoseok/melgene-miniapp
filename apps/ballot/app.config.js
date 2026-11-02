// ballot 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/ballot/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'ballot',
  emoji: '🗳️',
  category: 'vote',
  added: '2026-11-03',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://ballot.example.com/',
  title: {
    ko: '비밀 투표',
    en: 'Anonymous Voting',
    ja: '匿名投票',
    zh: '匿名投票',
    fr: 'Vote anonyme',
    de: 'Anonyme Abstimmung',
    th: 'โหวตลับ',
    vi: 'Bỏ phiếu kín',
    es: 'Votación anónima',
    it: 'Votazione anonima',
    pt: 'Votação anônima',
    ru: 'Тайное голосование',
  },
  desc: {
    ko: '휴대폰 하나를 돌려 가며 하는 익명 투표. 송년회 시상식, 회식 메뉴, 반 결정까지 누가 뭘 골랐는지 아무도 모르게 뽑고 마지막에 두구두구 발표해요.',
    en: 'Pass one phone around for a truly anonymous vote: year-end awards, where to eat, class decisions. Nobody sees who picked what, then reveal the results together.',
    ja: 'スマホ1台を回して投票する匿名投票。忘年会の表彰、お店選び、クラスの決めごとも、誰が何を選んだかわからないまま最後にドキドキ発表。',
    zh: '一部手机轮流传，真正的匿名投票。年会颁奖、聚餐去哪、班级决定都行，谁投了谁没人知道，最后一起揭晓结果。',
    fr: 'Faites passer un seul téléphone pour un vrai vote anonyme : trophées de fin d’année, resto, décisions de classe. Personne ne voit qui a voté quoi.',
    de: 'Ein Handy geht reihum: echte anonyme Abstimmung für Jahresend-Awards, Restaurantwahl oder Klassenentscheidungen. Keiner sieht, wer was gewählt hat.',
    th: 'ส่งมือถือเครื่องเดียววนกันโหวตแบบไม่ระบุชื่อ ทั้งมอบรางวัลงานเลี้ยงปีใหม่ เลือกร้าน หรือเรื่องในห้อง ไม่มีใครรู้ว่าใครเลือกอะไร แล้วลุ้นประกาศผลพร้อมกัน',
    vi: 'Chuyền một chiếc điện thoại để bỏ phiếu kín thật sự: trao giải tiệc cuối năm, chọn quán, việc của lớp. Không ai biết ai chọn gì, rồi cùng công bố kết quả.',
    es: 'Pasa un solo móvil para una votación anónima de verdad: premios de fin de año, dónde comer, decisiones de clase. Nadie ve quién votó qué.',
    it: 'Passate un solo telefono per una votazione davvero anonima: premi di fine anno, dove mangiare, decisioni di classe. Nessuno vede chi ha votato cosa.',
    pt: 'Passe um celular só de mão em mão para uma votação anônima de verdade: prêmios de fim de ano, onde comer, decisões da turma. Ninguém vê quem votou em quê.',
    ru: 'Передавай один телефон по кругу: настоящее тайное голосование для новогодней премии, выбора кафе или решений класса. Никто не видит, кто за что голосовал.',
  },
};
