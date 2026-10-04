// nickname 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/nickname/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'nickname',
  emoji: '🏷️',
  category: 'create',
  added: '2026-10-05',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://nickname.example.com/',
  title: {
    ko: '닉네임 생성기',
    en: 'Nickname Generator',
    ja: 'ニックネーム作成',
    zh: '昵称生成器',
    fr: 'Générateur de pseudo',
    de: 'Nickname Generator',
    th: 'ตั้งชื่อเล่น',
    vi: 'Tạo nickname',
    es: 'Generador de apodos',
    it: 'Generatore di nickname',
    pt: 'Gerador de nickname',
    ru: 'Генератор ников',
  },
  desc: {
    ko: '귀여운·멋진·웃긴·몽환적인 분위기를 고르고 이름을 넣으면 나만의 닉네임이 뚝딱. 마음에 들 때까지 다시 뽑아요.',
    en: 'Pick a vibe, add your name if you like, and get a one-of-a-kind nickname. Spin again until it feels right, then copy it.',
    ja: '雰囲気を選んで名前を入れるだけで、自分だけのニックネームが完成。気に入るまで何度でも作れます。',
    zh: '选一种风格，再输入名字，就能得到专属昵称。不满意可以反复重抽，满意后一键复制。',
    fr: 'Choisis une ambiance, ajoute ton prénom si tu veux et obtiens un pseudo unique. Relance jusqu’à ce qu’il te plaise, puis copie-le.',
    de: 'Stimmung wählen, auf Wunsch den Namen dazugeben und einen einzigartigen Nickname bekommen. Neu würfeln, bis er passt.',
    th: 'เลือกบรรยากาศ ใส่ชื่อของคุณได้ถ้าอยากใส่ แล้วรับชื่อเล่นสุดเก๋ ไม่ถูกใจก็สุ่มใหม่ได้ ก๊อปปี้ใช้ได้ทันที',
    vi: 'Chọn phong cách, thêm tên của bạn nếu muốn và nhận ngay nickname độc đáo. Không ưng thì tạo lại, rồi sao chép.',
    es: 'Elige un estilo, añade tu nombre si quieres y consigue un apodo único. Vuelve a sacar hasta que te guste y cópialo.',
    it: 'Scegli un mood, aggiungi il tuo nome se vuoi e ottieni un nickname unico. Rigenera finché non ti piace, poi copialo.',
    pt: 'Escolha um clima, coloque seu nome se quiser e ganhe um nickname único. Gere de novo até gostar e copie.',
    ru: 'Выбери настроение, добавь своё имя, если хочешь, и получи ник, которого больше ни у кого нет. Не нравится — крути заново и копируй.',
  },
};
