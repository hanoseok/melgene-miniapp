// password 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/password/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'password',
  emoji: '🔑',
  category: 'create',
  added: '2026-10-13',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://password.example.com/',
  title: {
    ko: '비밀번호 생성기',
    en: 'Password Generator',
    ja: 'パスワード生成',
    zh: '密码生成器',
    fr: 'Générateur de mot de passe',
    de: 'Passwort-Generator',
    th: 'สร้างรหัสผ่าน',
    vi: 'Tạo mật khẩu mạnh',
    es: 'Generador de claves',
    it: 'Generatore di password',
    pt: 'Gerador de senhas',
    ru: 'Генератор паролей',
  },
  desc: {
    ko: '길이·문자 종류만 고르면 강력한 무작위 비밀번호나 외우기 쉬운 단어 조합이 바로. 강도와 해킹 시간까지, 서버 전송 없이.',
    en: 'Make strong random passwords or easy-to-remember passphrases. See the real strength in bits and time to crack. Nothing leaves your browser.',
    ja: '長さと文字の種類を選ぶだけで、強いランダムパスワードや覚えやすいパスフレーズを作成。強度と解読時間も表示、送信なし。',
    zh: '选好长度和字符类型，立即生成高强度随机密码或好记的单词口令。显示真实强度和破解时间，不上传任何数据。',
    fr: 'Crée des mots de passe aléatoires solides ou des phrases de passe faciles à retenir. Force réelle en bits, rien ne quitte ton navigateur.',
    de: 'Erstelle starke Zufallspasswörter oder leicht merkbare Passphrasen. Echte Stärke in Bit und Knackzeit. Nichts verlässt deinen Browser.',
    th: 'สร้างรหัสผ่านสุ่มที่แข็งแรง หรือวลีรหัสผ่านที่จำง่าย ดูความแข็งแรงจริงเป็นบิตและเวลาที่ใช้แฮ็ก ไม่มีข้อมูลออกจากเบราว์เซอร์',
    vi: 'Tạo mật khẩu ngẫu nhiên mạnh hoặc cụm mật khẩu dễ nhớ. Xem độ mạnh thật theo bit và thời gian bẻ khóa. Không gửi gì lên mạng.',
    es: 'Crea contraseñas aleatorias seguras o frases de contraseña fáciles de recordar. Fuerza real en bits y tiempo de descifrado, sin enviar nada.',
    it: 'Crea password casuali sicure o passphrase facili da ricordare. Forza reale in bit e tempo per forzarla. Niente esce dal tuo browser.',
    pt: 'Crie senhas aleatórias fortes ou frases-senha fáceis de lembrar. Veja a força real em bits e o tempo para quebrar. Nada sai do navegador.',
    ru: 'Создавай надёжные случайные пароли или легко запоминаемые парольные фразы. Реальная стойкость в битах, ничего не уходит из браузера.',
  },
};
