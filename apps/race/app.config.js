// race 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/race/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'race',
  emoji: '🏁',
  category: 'vote',
  added: '2026-10-22',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://race.example.com/',
  title: {
    ko: '동물 달리기 시합',
    en: 'Animal Race Picker',
    ja: '動物レース抽選',
    zh: '动物赛跑抽签',
    fr: 'Course d’animaux',
    de: 'Tierrennen-Auslosung',
    th: 'สุ่มแข่งวิ่งสัตว์',
    vi: 'Đua thú bốc thăm',
    es: 'Carrera de animales',
    it: 'Corsa di animali',
    pt: 'Corrida de animais',
    ru: 'Гонка животных',
  },
  desc: {
    ko: '이름을 넣으면 동물들이 한 줄씩 맡아 달려요. 1등이 이기거나 꼴찌가 커피 사기! 결과는 공정한 랜덤으로 미리 정해져요.',
    en: 'Type the names and each one gets an animal on its own lane. First across the line wins, or last place buys the coffee. Fair random every time.',
    ja: '名前を入れると動物がレーンを走ります。1位が勝ちか、ビリがおごるか。順位は公平なランダムで決まります。',
    zh: '输入名字，每人一只小动物各占一条跑道。第一名胜出，或者最后一名请喝咖啡。名次由公平随机决定。',
    fr: 'Entrez les prénoms : chacun a son animal sur sa ligne. Le premier gagne, ou le dernier paie les cafés. Un tirage au sort vraiment équitable.',
    de: 'Namen eintragen, jedes Tier bekommt eine eigene Bahn. Der Erste gewinnt – oder der Letzte zahlt den Kaffee. Fair ausgelost.',
    th: 'ใส่ชื่อ แล้วสัตว์แต่ละตัววิ่งในเลนของตัวเอง ที่หนึ่งชนะ หรือคนสุดท้ายเลี้ยงกาแฟ สุ่มอย่างยุติธรรมทุกครั้ง',
    vi: 'Nhập tên, mỗi người có một con thú chạy trên làn riêng. Về nhất thắng, hoặc về chót bao cà phê. Bốc thăm ngẫu nhiên công bằng.',
    es: 'Escribe los nombres y cada uno tiene su animal en su carril. Gana el primero o el último paga los cafés. Sorteo justo cada vez.',
    it: 'Scrivi i nomi e ognuno ha il suo animale nella sua corsia. Vince il primo, oppure l’ultimo offre il caffè. Sorteggio equo ogni volta.',
    pt: 'Digite os nomes e cada um ganha um bichinho na sua raia. O primeiro vence, ou o último paga o café. Sorteio justo sempre.',
    ru: 'Впиши имена — у каждого свой зверёк на своей дорожке. Первый побеждает, или последний угощает кофе. Честный жребий.',
  },
};
