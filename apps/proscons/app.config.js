// proscons 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/proscons/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'proscons',
  emoji: '⚖️',
  category: 'vote',
  added: '2026-11-17',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://proscons.example.com/',
  title: {
    ko: '장단점 저울',
    en: 'Pros and Cons Scale',
    ja: 'メリデメ天秤',
    zh: '利弊天平',
    fr: 'Pour et contre',
    de: 'Pro und Contra',
    th: 'ตาชั่งข้อดีข้อเสีย',
    vi: 'Cân ưu nhược điểm',
    es: 'Pros y contras',
    it: 'Pro e contro',
    pt: 'Prós e contras',
    ru: 'Плюсы и минусы',
  },
  desc: {
    ko: '할까 말까, A냐 B냐 고민될 때 장단점을 적고 중요도(1~3)를 매기면 저울이 기울어요. 몇 점 차이인지 보고 링크로 친구에게 물어봐요.',
    en: 'Stuck on a decision? List the pros and cons, give each a weight from 1 to 3 and watch the scale tip. See the margin, then send the link to a friend.',
    ja: 'やるかやめるか、AかBか迷ったら、メリットとデメリットを書いて重み（1〜3）をつけるだけ。天秤が傾き、何点差かがわかります。',
    zh: '纠结做不做、选A还是选B？写下利与弊，给每条打1到3分的权重，天平就会倾斜，看清差几分，再发链接问问朋友。',
    fr: 'Vous hésitez ? Listez le pour et le contre, donnez un poids de 1 à 3 à chaque point et regardez la balance pencher. Partagez ensuite le lien.',
    de: 'Unentschlossen? Pro und Contra notieren, jedem Punkt ein Gewicht von 1 bis 3 geben und zusehen, wohin die Waage kippt. Dann den Link teilen.',
    th: 'ลังเลว่าจะทำดีไหม หรือเลือก A หรือ B เขียนข้อดีข้อเสีย ให้น้ำหนัก 1–3 แล้วดูตาชั่งเอียง รู้ว่าห่างกันกี่แต้ม แล้วส่งลิงก์ถามเพื่อน',
    vi: 'Phân vân nên làm hay không, chọn A hay B? Ghi ưu và nhược điểm, chấm trọng số 1–3 rồi xem cán cân nghiêng về đâu và gửi link cho bạn bè.',
    es: '¿No te decides? Anota los pros y los contras, dale a cada uno un peso del 1 al 3 y mira hacia dónde se inclina la balanza. Luego comparte el enlace.',
    it: 'Indeciso? Scrivi pro e contro, dai a ogni punto un peso da 1 a 3 e guarda da che parte pende la bilancia. Poi manda il link a un amico.',
    pt: 'Na dúvida? Liste os prós e contras, dê a cada um um peso de 1 a 3 e veja para onde a balança pende. Depois mande o link para um amigo.',
    ru: 'Не можешь решить? Запиши плюсы и минусы, дай каждому вес от 1 до 3 и посмотри, куда склонятся весы. Потом отправь ссылку другу.',
  },
};
