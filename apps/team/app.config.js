// team 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/team/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'team',
  emoji: '🎲',
  category: 'vote',
  added: '2026-10-01',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://team.example.com/',
  title: {
    ko: '랜덤 팀 나누기',
    en: 'Random Team Generator',
    ja: 'チーム分け',
    zh: '随机分组',
    fr: 'Générateur d’équipes',
    de: 'Zufällige Teams',
    th: 'สุ่มแบ่งทีม',
    vi: 'Chia đội ngẫu nhiên',
    es: 'Generador de equipos',
    it: 'Generatore di squadre',
    pt: 'Sorteador de times',
    ru: 'Разделить на команды',
  },
  desc: {
    ko: '이름만 붙여 넣으면 팀 수나 팀당 인원대로 공정하게 조 편성. 주장은 서로 다른 팀으로, 결과는 링크로 그대로 공유.',
    en: 'Paste names, pick teams or people per team, and shuffle into fair teams. Captains apart, same result in a share link.',
    ja: '名前を貼るだけで、チーム数か人数で公平にチーム分け。リーダーは別々のチームに、結果はリンクでそのまま共有。',
    zh: '粘贴名单，按组数或每组人数公平随机分组。组长分到不同组，结果用链接原样分享。',
    fr: 'Colle les prénoms, choisis le nombre d’équipes ou de joueurs par équipe et mélange. Capitaines séparés, résultat partageable.',
    de: 'Namen einfügen, Anzahl der Teams oder Personen pro Team wählen, mischen. Kapitäne getrennt, Ergebnis per Link teilen.',
    th: 'วางรายชื่อแล้วสุ่มแบ่งทีมอย่างยุติธรรมตามจำนวนทีมหรือจำนวนคนต่อทีม หัวหน้าแยกคนละทีม แชร์ผลเดิมด้วยลิงก์',
    vi: 'Dán danh sách tên, chọn số đội hoặc số người mỗi đội rồi chia ngẫu nhiên công bằng. Đội trưởng tách riêng, chia sẻ bằng link.',
    es: 'Pega los nombres, elige cuántos equipos o personas por equipo y mezcla. Capitanes separados, mismo resultado en un enlace.',
    it: 'Incolla i nomi, scegli quante squadre o persone per squadra e mescola. Capitani separati, stesso risultato in un link.',
    pt: 'Cole os nomes, escolha quantos times ou pessoas por time e sorteie. Capitães separados, mesmo resultado num link.',
    ru: 'Вставь имена, выбери число команд или людей в команде — и перемешай. Капитаны порознь, результат по ссылке.',
  },
};
