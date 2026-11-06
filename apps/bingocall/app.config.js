// bingocall 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/bingocall/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'bingocall',
  emoji: '🎱',
  category: 'vote',
  added: '2026-11-07',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://bingocall.example.com/',
  title: {
    ko: '빙고 번호 추첨기',
    en: 'Bingo Caller',
    ja: 'ビンゴマシン',
    zh: '宾果抽号器',
    fr: 'Tirage du loto',
    de: 'Bingo-Ziehung',
    th: 'เครื่องสุ่มเลขบิงโก',
    vi: 'Máy quay số lô tô',
    es: 'Bingo online',
    it: 'Tombola online',
    pt: 'Sorteador de bingo',
    ru: 'Лото онлайн',
  },
  desc: {
    ko: '송년회 빙고 진행을 휴대폰 하나로. 75볼·90볼·직접 범위, 큰 번호 화면, 지난 번호와 전체 판, 되돌리기, 자동 뽑기, 음성 안내까지.',
    en: 'Call bingo at your party from one phone or a TV. 75-ball, 90-ball or your own range, a huge number display, full board, undo and auto draw.',
    ja: '忘年会のビンゴ大会をスマホ1台で。75球・90球・自由な範囲、大きな数字表示、出た番号の一覧、取り消し、自動抽選、読み上げにも対応。',
    zh: '尾牙、年会的宾果游戏用一部手机就能主持。75球、90球或自定范围，大号数字显示、已开号码面板、撤销、自动抽号和语音播报。',
    fr: 'Animez le loto de la soirée avec un seul téléphone ou une télé : 75 ou 90 boules, plage libre, grand numéro, grille complète, annuler et tirage auto.',
    de: 'Bingo auf der Weihnachtsfeier mit nur einem Handy oder TV ansagen: 75 oder 90 Kugeln, eigener Bereich, große Zahl, ganze Tafel, Rückgängig und Auto-Ziehung.',
    th: 'เป็นพิธีกรบิงโกงานเลี้ยงปีใหม่ด้วยมือถือเครื่องเดียว 75 ลูก 90 ลูก หรือกำหนดช่วงเอง ตัวเลขใหญ่ กระดานเลขที่ออก ย้อนกลับ และสุ่มอัตโนมัติ',
    vi: 'Làm quản trò lô tô, bingo tất niên chỉ với một điện thoại hay TV: 75 hoặc 90 số, tự chọn khoảng, số hiện thật to, bảng số đã ra, hoàn tác, quay tự động.',
    es: 'Canta el bingo de la fiesta con un solo móvil o la tele: 75 o 90 bolas, rango propio, número gigante, tablero completo, deshacer y sorteo automático.',
    it: 'Estrai i numeri della tombola con un solo telefono o la TV: 90 o 75 numeri, intervallo libero, numero gigante, tabellone, annulla ed estrazione automatica.',
    pt: 'Cante o bingo da festa com um só celular ou a TV: 75 ou 90 bolas, intervalo livre, número gigante, painel completo, desfazer e sorteio automático.',
    ru: 'Ведите лото и бинго на корпоративе с одного телефона или ТВ: 75 или 90 чисел, свой диапазон, крупное число, табло, отмена и автовыбор.',
  },
};
