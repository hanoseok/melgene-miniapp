// 모든 사이트가 공유하는 설정. 배포 전 이 파일만 채우면 광고/분석/사이트 목록이 전체에 반영된다.
window.SITE_CONFIG = {
  // 원본은 example.com 자리표시자를 쓴다. 실제 주소는 deploy-prep.sh가 deploy.env 기준으로 dist/에서 치환한다.
  ROOT_DOMAIN: 'example.com',


  // GA4 측정 ID. 비어 있으면 스크립트를 아예 로드하지 않는다.
  GA4_ID: '', // 예: 'G-XXXXXXXXXX'
  // AdSense 앱 중간 광고 단위(melgene-mid, 반응형 디스플레이). 게시자 ID는 배포 때 <head>에 들어간다.
  AD_SLOT_MID: '5952905456',

  // 카카오톡 공유(ko 페이지). Kakao Developers 앱의 JavaScript 키 — 비어 있으면 휴대폰 공유 시트/링크 복사로 대신한다.
  KAKAO_JS_KEY: '',

  // Supabase (짧은 공유 링크·참여 수). 공개용 키만 넣는다: Project URL + publishable(anon) 키.
  // secret/service_role 키는 절대 넣지 않는다. 비어 있으면 해시 링크(#d=)로만 동작한다.
  SUPABASE_URL: '', // 배포 때 deploy-prep 이 deploy.local.env 값으로 채운다 (소스 저장소에는 두지 않음)
  SUPABASE_ANON_KEY: '', // 배포 때 채움 (publishable 키만)


  // 포털 & 크로스 프로모용 앱 목록 — 앱마다 apps/<id>/app.config.js 에 있고 아래 SITES 는 생성물이다.
  // title/desc 는 언어 코드별 객체(shared/i18n.js 의 LOCALES, 11개). 없는 언어는 en 으로 대체된다.
  // path 는 사이트 루트(en) 주소이고, 언어별 주소는 path + '<언어 dir>/' 로 자동 계산된다
  // (예: https://ladder.example.com/ja/). 특정 언어만 다른 주소를 쓰려면 paths: { ja: '...' } 로 덮어쓴다.
  // <sites:generated> apps/*/app.config.js 에서 node tools/gen-sites.js 가 만든다. 여기를 손으로 고치지 않는다.
  SITES: [
    {
      id: 'life',
      emoji: '🎞️',
      category: 'create',
      added: '2026-09-26',
      path: 'https://life.example.com/',
      title: { ko: '내 인생 애니메이션', en: 'My Life, Animated', ja: 'わたしの人生アニメ', zh: '我的人生动画', fr: 'Ma vie en animation', de: 'Mein Leben als Animation', th: 'แอนิเมชันชีวิตฉัน', vi: 'Cuộc đời tôi thành hoạt hình', es: 'Mi vida animada', it: 'Animazione della mia vita', pt: 'Animação da minha vida', ru: 'Анимация моей жизни' },
      desc: {
        ko: '태어난 날부터 오늘까지, 펜으로 그려지는 1분 인생 만화.',
        en: 'Your life from birth to today, drawn line by line in one minute.',
        ja: '生まれた日から今日まで、ペンで描く1分の人生マンガ。',
        zh: '从出生到今天，一分钟用画笔画出你的人生漫画。',
        fr: 'Votre vie, de la naissance à aujourd’hui, dessinée trait par trait en une minute.',
        de: 'Dein Leben von der Geburt bis heute – Strich für Strich in einer Minute gezeichnet.',
        th: 'ชีวิตคุณตั้งแต่เกิดจนถึงวันนี้ วาดทีละเส้นในหนึ่งนาที',
        vi: 'Cuộc đời bạn từ lúc chào đời đến hôm nay, vẽ từng nét trong một phút.',
        es: 'Tu vida desde que naciste hasta hoy, dibujada trazo a trazo en un minuto.',
        it: 'La tua vita dalla nascita a oggi, disegnata tratto dopo tratto in un minuto.',
        pt: 'Sua vida do nascimento até hoje, desenhada traço a traço em um minuto.',
        ru: 'Твоя жизнь от рождения до сегодня — линия за линией, за одну минуту.',
      },
    },
    {
      id: 'past-life',
      emoji: '🔮',
      category: 'test',
      added: '2026-09-26',
      path: 'https://past-life.example.com/',
      title: { ko: '나의 전생 테스트', en: 'Past Life Test', ja: '前世診断テスト', zh: '前世测试', fr: 'Test de vie antérieure', de: 'Früheres-Leben-Test', th: 'ทดสอบชาติที่แล้ว', vi: 'Trắc nghiệm kiếp trước', es: 'Test de vidas pasadas', it: 'Test vita precedente', pt: 'Teste de vida passada', ru: 'Кем я был в прошлой жизни' },
      desc: {
        ko: '12문항, 2분이면 끝. 당신은 전생에 누구였을까?',
        en: '12 questions, 2 minutes. Who were you in a past life?',
        ja: '12問・2分で完了。あなたの前世はだれだった？',
        zh: '12道题，2分钟搞定。你的前世是谁？',
        fr: '12 questions, 2 minutes. Qui étiez-vous dans une vie antérieure ?',
        de: '12 Fragen, 2 Minuten. Wer warst du in einem früheren Leben?',
        th: '12 ข้อ 2 นาทีจบ ชาติที่แล้วคุณเป็นใคร?',
        vi: '12 câu hỏi, 2 phút. Kiếp trước bạn là ai?',
        es: '12 preguntas, 2 minutos. ¿Quién fuiste en una vida pasada?',
        it: '12 domande, 2 minuti. Chi eri in una vita precedente?',
        pt: '12 perguntas, 2 minutos. Quem você foi em uma vida passada?',
        ru: '12 вопросов, 2 минуты — и ты узнаешь свою прошлую жизнь.',
      },
    },
    {
      id: 'ladder',
      emoji: '🪜',
      category: 'vote',
      added: '2026-09-26',
      path: 'https://ladder.example.com/',
      title: { ko: '사다리타기', en: 'Ladder Game', ja: 'あみだくじ', zh: '鬼脚图抽签', fr: 'Jeu de l’échelle', de: 'Leiterspiel', th: 'เกมบันไดสุ่ม', vi: 'Trò chơi bậc thang', es: 'Juego de la escalera', it: 'Gioco della scala', pt: 'Jogo da escada', ru: 'Жеребьёвка' },
      desc: {
        ko: '점심 메뉴부터 내기까지, 공정한 온라인 사다리타기.',
        en: 'Lunch picks, coffee runs, chores — a fair online random picker.',
        ja: 'ランチ決めからおごり決めまで。公平なオンラインあみだくじ。',
        zh: '从午餐吃什么到谁请客，公平的在线抽签。',
        fr: 'Déjeuner, qui paie le café, corvées — un tirage au sort équitable en ligne.',
        de: 'Mittagessen, wer zahlt den Kaffee, Aufgaben – faire Online-Auslosung.',
        th: 'ตั้งแต่เลือกเมนูมื้อเที่ยงถึงใครเลี้ยงกาแฟ สุ่มแบบยุติธรรมออนไลน์',
        vi: 'Từ chọn món trưa đến ai khao cà phê — bốc thăm trực tuyến công bằng.',
        es: 'Almuerzo, quién paga el café, tareas: un sorteo justo en línea.',
        it: 'Pranzo, chi paga il caffè, faccende: un sorteggio equo online.',
        pt: 'Almoço, quem paga o café, tarefas: um sorteio online justo.',
        ru: 'Обед, кто платит за кофе, дежурства — честная жеребьёвка онлайн.',
      },
    },
    {
      id: 'balance',
      emoji: '⚖️',
      category: 'test',
      added: '2026-09-27',
      path: 'https://balance.example.com/',
      title: { ko: '밸런스 게임', en: 'Would You Rather', ja: '究極の二択', zh: '二选一', fr: 'Tu préfères ?', de: 'Würdest du lieber?', th: 'จะเลือกอะไร?', vi: 'Bạn chọn bên nào?', es: '¿Qué prefieres?', it: 'Preferiresti?', pt: 'O que você prefere?', ru: 'Что бы ты выбрал?' },
      desc: {
        ko: '둘 중 하나만 고른다면? 다른 사람들은 몇 %가 골랐는지 바로 확인.',
        en: 'Pick one of two — then see what percent of everyone chose the same.',
        ja: 'どっちを選ぶ？ みんなの選択率がすぐわかる究極の二択。',
        zh: '只能选一个的话？马上看看大家的选择比例。',
        fr: 'Choisissez l’un des deux, puis voyez quel pourcentage a fait le même choix.',
        de: 'Wähle eins von zwei – und sieh, wie viel Prozent genauso gewählt haben.',
        th: 'ถ้าเลือกได้แค่ทางเดียว? ดูทันทีว่าคนอื่นเลือกกี่เปอร์เซ็นต์',
        vi: 'Chỉ được chọn một? Xem ngay bao nhiêu phần trăm mọi người chọn giống bạn.',
        es: 'Elige una de dos y mira qué porcentaje eligió lo mismo.',
        it: 'Scegli una delle due e scopri che percentuale ha fatto la tua stessa scelta.',
        pt: 'Escolha uma de duas opções e veja quantos por cento escolheram igual a você.',
        ru: 'Выбери одно из двух — и узнай, сколько процентов людей выбрали то же самое.',
      },
    },
    {
      id: 'reaction',
      emoji: '⚡',
      category: 'game',
      added: '2026-09-27',
      path: 'https://reaction.example.com/',
      title: { ko: '반응속도 테스트', en: 'Reaction Time Test', ja: '反応速度テスト', zh: '反应速度测试', fr: 'Test de réflexes', de: 'Reaktionstest', th: 'ทดสอบความไวในการตอบสนอง', vi: 'Kiểm tra tốc độ phản xạ', es: 'Test de reflejos', it: 'Test di reazione', pt: 'Teste de reação', ru: 'Тест на реакцию' },
      desc: {
        ko: '초록색이 되면 탭! 내 반응속도는 전체에서 상위 몇 %?',
        en: 'Tap when it turns green. How fast are you compared to everyone?',
        ja: '緑になったらタップ！ あなたの反応速度は上位何％？',
        zh: '变绿就点！你的反应速度排在前百分之几？',
        fr: 'Touchez quand ça devient vert. Êtes-vous plus rapide que les autres ?',
        de: 'Tippe, sobald es grün wird. Wie schnell bist du im Vergleich?',
        th: 'แตะเมื่อเป็นสีเขียว! ความไวของคุณอยู่ท็อปกี่เปอร์เซ็นต์?',
        vi: 'Chạm khi màn hình chuyển xanh! Bạn nhanh hơn bao nhiêu phần trăm người chơi?',
        es: 'Toca cuando se ponga verde. ¿Qué tan rápido eres comparado con todos?',
        it: 'Tocca quando diventa verde. Quanto sei veloce rispetto agli altri?',
        pt: 'Toque quando ficar verde. Você é mais rápido que os outros?',
        ru: 'Нажми, когда станет зелёным. Насколько ты быстрее остальных?',
      },
    },
    {
      id: 'roulette',
      emoji: '🎡',
      category: 'vote',
      added: '2026-09-27',
      path: 'https://roulette.example.com/',
      title: { ko: '돌림판', en: 'Spin the Wheel', ja: 'ルーレット', zh: '转盘抽签', fr: 'Roue de la fortune', de: 'Glücksrad', th: 'วงล้อสุ่ม', vi: 'Vòng quay may mắn', es: 'Ruleta', it: 'Ruota della fortuna', pt: 'Roleta aleatória', ru: 'Колесо фортуны' },
      desc: {
        ko: '점심 메뉴, 당번, 벌칙까지. 항목만 적고 돌리면 끝.',
        en: 'Lunch, chores, dares — type your options and spin.',
        ja: 'ランチも当番も罰ゲームも。項目を書いて回すだけ。',
        zh: '午餐、值日、惩罚游戏，写好选项转一转就行。',
        fr: 'Déjeuner, corvées, gages — écrivez vos options et faites tourner.',
        de: 'Mittagessen, Aufgaben, Mutproben – Optionen eintragen und drehen.',
        th: 'มื้อเที่ยง เวร บทลงโทษ เขียนตัวเลือกแล้วหมุนเลย',
        vi: 'Món trưa, trực nhật, hình phạt — nhập lựa chọn rồi quay.',
        es: 'Almuerzo, tareas, retos: escribe tus opciones y gira.',
        it: 'Pranzo, turni, penitenze: scrivi le opzioni e gira.',
        pt: 'Almoço, tarefas, desafios: escreva as opções e gire.',
        ru: 'Обед, дежурства, фанты — впиши варианты и крути.',
      },
    },
    {
      id: 'monster',
      emoji: '🎃',
      category: 'test',
      added: '2026-09-27',
      path: 'https://monster.example.com/',
      title: { ko: '할로윈 몬스터 테스트', en: 'Which Monster Are You?', ja: 'モンスター診断', zh: '万圣节怪物测试', fr: 'Quel monstre es-tu ?', de: 'Welches Monster bist du?', th: 'คุณคือปีศาจฮาโลวีนตัวไหน?', vi: 'Bạn là quái vật nào?', es: '¿Qué monstruo eres?', it: 'Che mostro sei?', pt: 'Que monstro você é?', ru: 'Какой ты монстр?' },
      desc: {
        ko: '할로윈 밤 10문항, 1분이면 끝. 나를 닮은 몬스터는 누구?',
        en: '10 spooky-cute questions for Halloween night. Which monster is your twin?',
        ja: 'ハロウィンの夜の10問で診断。あなたにそっくりなモンスターは？',
        zh: '万圣节之夜10道题，1分钟测出和你最像的怪物。',
        fr: '10 questions mignonnes et un brin effrayantes pour Halloween. Quel monstre te ressemble ?',
        de: '10 schaurig-süße Fragen zur Halloween-Nacht. Welches Monster passt zu dir?',
        th: '10 คำถามคืนฮาโลวีน 1 นาทีรู้ผล ปีศาจตัวไหนเหมือนคุณที่สุด?',
        vi: '10 câu hỏi đêm Halloween, 1 phút có kết quả. Quái vật nào giống bạn nhất?',
        es: '10 preguntas tiernamente terroríficas para Halloween. ¿Qué monstruo se parece a ti?',
        it: '10 domande tra brividi e tenerezza per la notte di Halloween. Quale mostro ti somiglia?',
        pt: '10 perguntas fofas e assustadoras para a noite de Halloween. Qual monstro combina com você?',
        ru: 'Тест на Хэллоуин: 10 жутко милых вопросов за минуту. Какой монстр — твой двойник?',
      },
    },
  ],
  // </sites:generated>
};
