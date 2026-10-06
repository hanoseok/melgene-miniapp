// lotto 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/lotto/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'lotto',
  emoji: '🎱',
  category: 'vote',
  added: '2026-10-07',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://lotto.example.com/',
  title: {
    ko: '로또 번호 생성기',
    en: 'Lotto Number Generator',
    ja: 'ロト番号ジェネレーター',
    zh: '彩票号码生成器',
    fr: 'Générateur de loto',
    de: 'Lottozahlen-Generator',
    th: 'สุ่มเลขลอตเตอรี่',
    vi: 'Tạo số xổ số',
    es: 'Generador de lotería',
    it: 'Generatore di lotto',
    pt: 'Gerador de loteria',
    ru: 'Генератор лото',
  },
  desc: {
    ko: '한국 로또 6/45, 유로 방식, 미국 파워볼, 직접 정한 범위까지. 꼭 넣을 번호와 뺄 번호를 정하고 최대 5게임을 공이 굴러 나오는 연출과 함께 뽑아요. 오락용이에요.',
    en: 'Draw lucky numbers for Korea 6/45, a Euro-style game, US Powerball or your own range. Keep or skip numbers, up to five games.',
    ja: '韓国ロト6/45、ユーロ式、米国パワーボール、自由な範囲で番号を引けます。入れる数字と外す数字を決めて、最大5口までボールが転がる演出つき。お楽しみ用です。',
    zh: '韩国乐透6/45、欧洲式、美国强力球或自定义范围，随手摇一组幸运号码。可固定或排除号码，一次最多5注，附彩球滚动动画，仅供娱乐。',
    fr: 'Tire des numéros pour le 6/45 coréen, façon Euro, Powerball US ou ta plage. Fixe ou exclus des numéros, jusqu’à cinq grilles.',
    de: 'Zieh Zahlen für Korea 6/45, Euro-Stil, US-Powerball oder eigenen Bereich. Zahlen behalten oder streichen, bis zu fünf Tipps.',
    th: 'สุ่มเลขนำโชคแบบลอตโต้เกาหลี 6/45 แบบยูโร พาวเวอร์บอลสหรัฐ หรือกำหนดช่วงเอง ล็อกหรือตัดเลขได้ สุ่มได้สูงสุด 5 ชุด เพื่อความสนุกเท่านั้น',
    vi: 'Quay số may mắn kiểu lotto Hàn Quốc 6/45, Euro, Powerball Mỹ hoặc khoảng số tự đặt. Giữ hoặc loại số, tối đa năm bộ. Chỉ để giải trí.',
    es: 'Saca números del 6/45 coreano, estilo Euro, Powerball de EE. UU. o tu rango. Fija o descarta números, hasta cinco apuestas.',
    it: 'Estrai numeri per il 6/45 coreano, stile Euro, Powerball USA o un tuo intervallo. Fissa o escludi numeri, fino a cinque giocate.',
    pt: 'Sorteie números do 6/45 coreano, estilo Euro, Powerball dos EUA ou seu intervalo. Fixe ou exclua números, até cinco jogos.',
    ru: 'Вытяни числа для корейского 6/45, Евролото, Powerball или своего диапазона. Закрепляй и исключай числа, до пяти билетов.',
  },
};
