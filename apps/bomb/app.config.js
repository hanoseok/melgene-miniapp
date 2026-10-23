// bomb 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/bomb/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'bomb',
  emoji: '💣',
  category: 'vote',
  added: '2026-10-24',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://bomb.example.com/',
  title: {
    ko: '폭탄 돌리기',
    en: 'Hot Potato Game',
    ja: '爆弾ゲーム',
    zh: '传炸弹游戏',
    fr: 'Patate chaude',
    de: 'Heiße Kartoffel',
    th: 'เกมส่งระเบิด',
    vi: 'Chuyền bom',
    es: 'Papa caliente',
    it: 'Patata bollente',
    pt: 'Batata quente',
    ru: 'Горячая картошка',
  },
  desc: {
    ko: '폭탄을 누르고 옆 사람에게 휴대폰을 넘기세요. 심지가 언제 다 타는지는 아무도 몰라요. 터질 때 들고 있던 사람이 걸려요!',
    en: 'Tap the bomb and hand the phone on. Nobody knows when the fuse runs out, and whoever holds it at the boom is out!',
    ja: '爆弾をタップして隣の人にスマホを渡そう。導火線がいつ燃え尽きるかは誰にもわからない。爆発した時に持っていた人の負け！',
    zh: '点一下炸弹，把手机传给下一个人。谁也不知道引线什么时候烧完，爆炸时拿着手机的人就输了！',
    fr: 'Touche la bombe et passe le téléphone. Personne ne sait quand la mèche s’arrête : celui qui l’a en main au boum a perdu !',
    de: 'Tippe auf die Bombe und reich das Handy weiter. Keiner weiß, wann die Zündschnur abbrennt – wer es beim Knall hält, verliert!',
    th: 'แตะระเบิดแล้วส่งมือถือให้คนถัดไป ไม่มีใครรู้ว่าชนวนจะหมดเมื่อไร ใครถืออยู่ตอนระเบิดคนนั้นแพ้!',
    vi: 'Chạm quả bom rồi chuyền điện thoại cho người kế bên. Không ai biết khi nào ngòi cháy hết, ai cầm lúc nổ là thua!',
    es: 'Toca la bomba y pasa el móvil. Nadie sabe cuándo se acaba la mecha: ¡quien lo tenga cuando explote, pierde!',
    it: 'Tocca la bomba e passa il telefono. Nessuno sa quando finisce la miccia: chi lo tiene al botto ha perso!',
    pt: 'Toque na bomba e passe o celular. Ninguém sabe quando o pavio acaba: quem estiver segurando na explosão perde!',
    ru: 'Нажми на бомбу и передай телефон дальше. Никто не знает, когда догорит фитиль: у кого он в руках при взрыве — проиграл!',
  },
};
