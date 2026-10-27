// santa 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/santa/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'santa',
  emoji: '🎁',
  category: 'vote',
  added: '2026-10-28',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://santa.example.com/',
  title: {
    ko: '마니또 뽑기',
    en: 'Secret Santa Generator',
    ja: 'プレゼント交換くじ',
    zh: '神秘圣诞老人抽签',
    fr: 'Tirage Secret Santa',
    de: 'Wichteln Auslosung',
    th: 'จับฉลากของขวัญ',
    vi: 'Bốc thăm tặng quà bí mật',
    es: 'Sorteo amigo invisible',
    it: 'Babbo Natale segreto',
    pt: 'Sorteio amigo secreto',
    ru: 'Тайный Санта',
  },
  desc: {
    ko: '이름을 넣고 마니또를 뽑은 뒤 휴대폰을 돌려 보세요. 각자 자기 이름을 눌러 내 마니또만 몰래 확인해요. 커플 제외·예산·교환일도 넣을 수 있어요.',
    en: 'Draw Secret Santa names on one phone, then pass it around so each person secretly sees only their own match. Add a budget, a date and couples to keep apart.',
    ja: '名前を入れてくじを引き、スマホを回して自分の名前をタップ。プレゼントを贈る相手を一人ずつこっそり確認できます。予算や交換日、カップル除外も設定OK。',
    zh: '输入名字一键抽签，再把手机传下去，每人点自己的名字，偷偷看自己要送礼的人。可设置预算、交换日期，情侣互不抽中。',
    fr: 'Tirez au sort votre Secret Santa sur un seul téléphone, puis faites-le passer : chacun découvre en secret à qui offrir. Budget, date et couples exclus.',
    de: 'Wichteln auslosen auf einem Handy und dann herumreichen: Jeder sieht heimlich nur, wen er beschenkt. Mit Budget, Datum und Paaren, die sich nicht ziehen.',
    th: 'ใส่ชื่อแล้วจับฉลากของขวัญ จากนั้นส่งมือถือต่อกัน ให้แต่ละคนแตะชื่อตัวเองแล้วแอบดูว่าต้องให้ของขวัญใคร ตั้งงบ วันแลก และคู่ที่ไม่ให้จับกันได้',
    vi: 'Bốc thăm tặng quà bí mật trên một điện thoại rồi chuyền tay nhau: mỗi người chạm tên mình và lén xem mình tặng quà cho ai. Có ngân sách, ngày và cặp loại trừ.',
    es: 'Haz el sorteo del amigo invisible en un solo móvil y pásalo: cada uno ve en secreto solo a quién le regala. Con presupuesto, fecha y parejas excluidas.',
    it: 'Estrai il Babbo Natale segreto su un solo telefono e passalo in giro: ognuno vede di nascosto solo a chi fare il regalo. Con budget, data e coppie escluse.',
    pt: 'Faça o sorteio do amigo secreto em um celular só e passe adiante: cada um vê em segredo só quem vai presentear. Com valor, data e casais que não se tiram.',
    ru: 'Проведи жеребьёвку Тайного Санты на одном телефоне и передай его по кругу: каждый тайком видит только своего подопечного. Бюджет, дата и пары-исключения.',
  },
};
