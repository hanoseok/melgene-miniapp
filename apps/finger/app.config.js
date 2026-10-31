// finger 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/finger/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'finger',
  emoji: '👆',
  category: 'vote',
  added: '2026-11-01',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://finger.example.com/',
  title: {
    ko: '손가락 룰렛',
    en: 'Finger Chooser',
    ja: '指ルーレット',
    zh: '手指轮盘',
    fr: 'Tirage au doigt',
    de: 'Finger-Auswahl',
    th: 'สุ่มนิ้ว',
    vi: 'Chọn bằng ngón tay',
    es: 'Elegir con el dedo',
    it: 'Scegli col dito',
    pt: 'Escolha no dedo',
    ru: 'Выбор пальцем',
  },
  desc: {
    ko: '모두 휴대폰 화면에 손가락을 하나씩 올리면 잠깐 뒤 한 명이 골라져요. 여러 명 뽑기·팀 나누기도 돼요. 누가 쏠지, 누가 먼저 할지 바로!',
    en: 'Everyone puts a finger on the screen and a moment later one is picked. Pick several or split into teams too. Who pays, who goes first, settled!',
    ja: 'みんなでスマホの画面に指を1本ずつ置くと、少しして1人が選ばれます。複数人やチーム分けも。おごる人も順番もすぐ決まる！',
    zh: '大家各放一根手指在手机屏幕上，稍等一下就会选出一个人。也能选多人或分组。谁请客、谁先来，马上定！',
    fr: 'Chacun pose un doigt sur l’écran et, après un instant, un seul est choisi. Plusieurs gagnants ou des équipes aussi. Qui paie, qui commence ?',
    de: 'Alle legen einen Finger aufs Display, kurz darauf wird einer gewählt. Auch mehrere oder Teams. Wer zahlt, wer fängt an? Sofort geklärt!',
    th: 'ทุกคนวางนิ้วบนจอมือถือคนละนิ้ว รอแป๊บเดียวระบบจะสุ่มเลือกหนึ่งคน สุ่มหลายคนหรือแบ่งทีมก็ได้ ใครจ่าย ใครเริ่มก่อน รู้ทันที!',
    vi: 'Mỗi người đặt một ngón tay lên màn hình, chờ chút là chọn ra một người. Chọn nhiều người hay chia đội cũng được. Ai trả tiền, ai đi trước?',
    es: 'Cada uno pone un dedo en la pantalla y, al momento, sale uno elegido. También varios o por equipos. ¿Quién paga, quién empieza? ¡Listo!',
    it: 'Ognuno appoggia un dito sullo schermo e dopo un attimo ne esce uno. Anche più vincitori o squadre. Chi paga, chi inizia? Deciso!',
    pt: 'Cada um põe um dedo na tela e, num instante, um é escolhido. Também vários ou times. Quem paga, quem começa? Resolvido!',
    ru: 'Все кладут по пальцу на экран, и через миг выбирается один. Можно выбрать нескольких или разделить на команды. Кто платит, кто первый?',
  },
};
