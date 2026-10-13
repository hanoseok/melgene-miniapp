// zombie 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/zombie/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 역할 이름·상황 질문을 쓰지 않는다.
module.exports = {
  id: 'zombie',
  emoji: '🧟',
  category: 'test',
  added: '2026-10-14',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://zombie.example.com/',
  title: {
    ko: '좀비 생존 테스트',
    en: 'Zombie Survival Test',
    ja: 'ゾンビ サバイバル診断',
    zh: '丧尸末日生存测试',
    fr: 'Test de survie zombie',
    de: 'Zombie-Apokalypse-Test',
    th: 'แบบทดสอบเอาชีวิตรอดซอมบี้',
    vi: 'Test sinh tồn zombie',
    es: 'Test de supervivencia zombie',
    it: 'Test di sopravvivenza zombie',
    pt: 'Teste de sobrevivência zumbi',
    ru: 'Выживешь среди зомби?',
  },
  desc: {
    ko: '좀비 사태가 터졌다! 상황 12개, 2분이면 끝. 좀비 아포칼립스에서 내가 맡을 생존 역할을 확인해 보세요.',
    en: 'The outbreak is here. 12 scenarios, 2 minutes. Find out what role you would play in the zombie apocalypse.',
    ja: 'ゾンビが街にあふれたら？12のシーン、2分で完了。ゾンビ世界でのあなたの役割を診断します。',
    zh: '丧尸爆发了！12个情境，2分钟测出末日里你会扮演什么角色。',
    fr: 'L’épidémie est là. 12 situations, 2 minutes. Découvre ton rôle pendant l’apocalypse zombie.',
    de: 'Der Ausbruch ist da. 12 Situationen, 2 Minuten. Finde heraus, welche Rolle du in der Zombie-Apokalypse hättest.',
    th: 'ซอมบี้บุกเมืองแล้ว! 12 สถานการณ์ ใช้เวลา 2 นาที รู้เลยว่าคุณจะรับบทไหนในวันสิ้นโลก',
    vi: 'Đại dịch zombie bùng phát! 12 tình huống, 2 phút. Xem bạn sẽ giữ vai trò gì khi tận thế ập đến.',
    es: 'Llegó el brote. 12 situaciones, 2 minutos. Descubre qué rol tendrías en el apocalipsis zombie.',
    it: 'È scoppiata l’epidemia. 12 situazioni, 2 minuti. Scopri che ruolo avresti nell’apocalisse zombie.',
    pt: 'O surto chegou. 12 situações, 2 minutos. Descubra qual seria o seu papel no apocalipse zumbi.',
    ru: 'Началась эпидемия! 12 ситуаций, 2 минуты. Узнай, какую роль ты сыграешь в зомби-апокалипсисе.',
  },
};
