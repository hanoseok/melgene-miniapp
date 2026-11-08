// raffle 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/raffle/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'raffle',
  emoji: '🎁',
  category: 'vote',
  added: '2026-11-09',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://raffle.example.com/',
  title: {
    ko: '경품 추첨기',
    en: 'Raffle Draw',
    ja: '景品抽選',
    zh: '在线抽奖',
    fr: 'Tirage au sort en ligne',
    de: 'Gewinnspiel-Auslosung',
    th: 'จับฉลากรางวัล',
    vi: 'Quay số trúng thưởng',
    es: 'Sorteo online',
    it: 'Estrazione premi',
    pt: 'Sorteio online',
    ru: 'Розыгрыш призов',
  },
  desc: {
    ko: '송년회·회식 경품 추첨을 큰 화면으로. 이름 붙여 넣기나 번호표, 1등·2등·3등 경품, 한 명씩 두근두근 공개, 되돌리기, 결과 복사·공유까지.',
    en: 'Draw office-party prizes on the big screen: paste names or use ticket numbers, set prizes, reveal winners one by one, undo, then copy or share the results.',
    ja: '忘年会の景品抽選を大画面で。名前の貼り付けや番号札、1等・2等・3等の景品、一人ずつドキドキ発表、取り消し、結果のコピーと共有まで。',
    zh: '年会、尾牙抽奖上大屏幕：粘贴名单或用号码牌，设置一二三等奖，逐个揭晓中奖者，可撤销，结果一键复制和分享。',
    fr: 'Le tirage des lots de la soirée sur grand écran : noms collés ou tickets numérotés, lots, gagnants révélés un par un, annulation, résultats à copier ou partager.',
    de: 'Preise der Weihnachtsfeier auf dem großen Bildschirm auslosen: Namen oder Losnummern, Preise festlegen, Gewinner einzeln enthüllen, Rückgängig, Ergebnis teilen.',
    th: 'จับรางวัลงานเลี้ยงปีใหม่บนจอใหญ่ วางรายชื่อหรือใช้เลขบัตร ตั้งรางวัลที่ 1 2 3 ประกาศผู้โชคดีทีละคน ยกเลิกได้ คัดลอกและแชร์ผลลัพธ์',
    vi: 'Quay thưởng tiệc tất niên trên màn hình lớn: dán tên hoặc dùng số vé, đặt giải nhất nhì ba, công bố từng người trúng, hoàn tác, sao chép và chia sẻ kết quả.',
    es: 'Sortea los premios de la cena de empresa en la pantalla grande: nombres o números, premios, ganadores uno a uno, deshacer y resultados para copiar o compartir.',
    it: 'Estrai i premi della festa sul maxischermo: nomi incollati o biglietti numerati, premi, vincitori svelati uno alla volta, annulla, risultati da copiare o condividere.',
    pt: 'Sorteie os prêmios da confraternização no telão: nomes ou números, prêmios, ganhadores revelados um a um, desfazer e resultado para copiar ou compartilhar.',
    ru: 'Розыгрыш призов на корпоративе на большом экране: имена или номера билетов, призы, победители по одному, отмена, итоги можно скопировать и отправить.',
  },
};
