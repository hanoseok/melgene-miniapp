// icefish 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/icefish/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'icefish',
  emoji: '🎣',
  category: 'game',
  added: '2026-11-10',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://icefish.example.com/',
  title: {
    ko: '얼음 낚시',
    en: 'Ice Fishing',
    ja: '穴釣りゲーム',
    zh: '冰钓游戏',
    fr: 'Pêche sur glace',
    de: 'Eisangeln',
    th: 'ตกปลาน้ำแข็ง',
    vi: 'Câu cá trên băng',
    es: 'Pesca en hielo',
    it: 'Pesca sul ghiaccio',
    pt: 'Pesca no gelo',
    ru: 'Зимняя рыбалка',
  },
  desc: {
    ko: '꽁꽁 언 호수 구멍에 낚싯줄을 내리고, 입질이 오면 장력을 조절하며 감아 올리는 60초 얼음낚시 게임.',
    en: 'Drop your line through a hole in the frozen lake, wait for a bite and reel in without snapping the line. 60 seconds per round.',
    ja: '凍った湖の穴に糸をたらし、アタリが来たら糸が切れないように巻き上げる60秒の穴釣りゲーム。',
    zh: '在冰封湖面的冰洞里放下鱼线，鱼儿咬钩后控制拉力收线，别让线断掉。每局60秒的冰钓游戏。',
    fr: 'Descends ta ligne dans un trou de la glace, attends la touche et remonte le poisson sans casser le fil. 60 secondes par partie.',
    de: 'Lass die Schnur durchs Eisloch hinab, warte auf den Biss und hol den Fisch ein, ohne dass die Schnur reißt. 60 Sekunden pro Runde.',
    th: 'หย่อนสายเบ็ดลงรูน้ำแข็งกลางทะเลสาบ รอปลากินเหยื่อ แล้วค่อย ๆ ม้วนสายขึ้นอย่าให้สายขาด รอบละ 60 วินาที',
    vi: 'Thả dây câu qua lỗ băng trên hồ đóng băng, chờ cá cắn câu rồi kéo lên mà không để đứt dây. Mỗi lượt 60 giây.',
    es: 'Baja el sedal por un agujero en el lago helado, espera la picada y recoge sin que se rompa la línea. 60 segundos por partida.',
    it: 'Cala la lenza in un buco nel lago ghiacciato, aspetta l’abboccata e recupera senza spezzare il filo. 60 secondi a partita.',
    pt: 'Desça a linha por um buraco no lago congelado, espere a fisgada e puxe sem arrebentar a linha. 60 segundos por partida.',
    ru: 'Опусти леску в лунку на замёрзшем озере, дождись поклёвки и вытащи рыбу, не порвав леску. 60 секунд на раунд.',
  },
};
