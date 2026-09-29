/* Teste da aura — Português do Brasil (pt/)
 * Mesmos 8 ids de aura e mesma ordem de perguntas/opções de aura-core.js (os pesos ficam só lá).
 * Chaves com Html: HTML como está (só <br> e <em>). O texto de privacy.sections também é HTML.
 * Sem spoiler: meta / og.default* / start / faq não citam cores de aura nem perguntas.
 * types.<id>.word = palavras de cor básicas (separadas por vírgula) — só para a checagem de spoiler.
 * Variáveis: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap',
    display: "'Comfortaa'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Teste da aura – Qual é a cor da sua aura?',
    description: 'Qual é a cor da sua aura? Faça o teste da aura grátis: 12 perguntas do dia a dia, uns 2 minutos, sem cadastro. Descubra a luz que a sua energia emite.',
    ogTitle: 'Teste da aura ✨ Qual é a cor da sua aura?',
    ogDescription: 'Um teste da aura grátis de 2 minutos. Responda 12 perguntas do dia a dia e descubra a cor da sua energia.',
  },
  siteName: 'Teste da aura',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '✨ Leitura de aura',
    h1Kicker: 'Teste da aura',
    h1Html: 'Qual é a cor<br>da sua <em>aura</em>?',
    hook: 'Todo mundo emite uma luz própria. Doze pequenos momentos do dia a dia vão revelar qual é a sua.',
    metaTime: '⏱️ Uns 2 minutos',
    metaCount: '🔮 12 perguntas',
    start: 'Ler minha aura →',
  },

  quiz: {
    backAria: 'Pergunta anterior',
    progressAria: 'Progresso',
    qLabel: 'P{n}',
  },

  loading: {
    text: 'Lendo a sua aura…',
    sub: 'Deixando as cores assentarem',
  },

  result: {
    title: 'Teste da aura: minha aura é {name}',
    eyebrow: 'A cor da sua aura é',
    strengthsLabel: 'Seus poderes de luz',
    othersLabel: 'Como os outros te veem',
    bestLabel: 'Aura parceira',
    clashLabel: 'Aura oposta',
    sameShare: '{pct}% dos jogadores têm esta aura',
    shareText: 'Minha aura é {name} {emoji} — “{vibe}” Qual é a cor da sua?',
    ctaStrong: 'Alguém te mandou a própria aura',
    ctaSub: 'Qual é a cor da sua? Leva 2 minutos.',
    retry: 'Fazer o teste de novo',
  },

  og: {
    eyebrow: 'A cor da minha aura',
    brand: '✨ Teste da aura',
    defaultKicker: 'Teste da aura',
    defaultTitle: 'Qual é a cor da sua aura?',
    defaultDesc: '12 perguntas do dia a dia · uns 2 minutos',
  },

  faq: [
    { q: 'Como funciona o teste da aura?', a: 'Cada resposta soma pontos para algumas cores de aura, e a cor com mais pontos é o seu resultado. Em caso de empate, uma regra fixa decide, então as mesmas respostas sempre dão a mesma aura.' },
    { q: 'Afinal, o que é aura?', a: 'Na espiritualidade popular, a aura é um brilho de energia em volta de cada pessoa, e cada cor está ligada a um humor e a uma personalidade. Este teste brinca com essa ideia: é para se divertir e se conhecer um pouco, não é ciência.' },
    { q: 'A cor da minha aura pode mudar?', a: 'Pode. O resultado depende só de como você responde hoje, então outro humor ou uma nova fase da vida podem trazer outra cor. Refaça quando quiser.' },
    { q: 'Minhas respostas ficam salvas?', a: 'Não. As respostas são calculadas no seu navegador e nunca são guardadas. A gente só conta, de forma anônima, qual aura saiu, para mostrar quão comum é cada resultado.' },
  ],

  privacy: {
    title: 'Política de privacidade | Teste da aura',
    description: 'Política de privacidade do Teste da aura: cookies, publicidade e estatísticas anônimas.',
    h1: 'Política de privacidade',
    introHtml: 'O Teste da aura (o “Serviço”) respeita a sua privacidade e trata apenas o mínimo de informação necessário, como descrito abaixo.',
    sections: [
      ['1. Informações coletadas', 'Você pode usar o Serviço sem cadastro nem login. As respostas são calculadas no seu navegador e nunca são enviadas nem guardadas nos nossos servidores. Só contamos, de forma anônima, qual cor de aura saiu, para mostrar quão comum é cada resultado.'],
      ['2. Cookies e tecnologias parecidas', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar direito.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e ajuste nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Guardamos totais diários anônimos (visualizações, testes concluídos, avaliações) para melhorar o Serviço. Eles não identificam você.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política, fale com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale desde 30 de setembro de 2026.'],
    ],
    back: '← Voltar ao teste da aura',
  },

  questions: [
    { q: 'Um sábado de manhã tranquilo, sem nada marcado. Como ele começa?', choices: [
      'Com uma corrida no nascer do sol. Preciso me mexer primeiro.',
      'Mando no grupo: “Bate e volta na praia? Saímos em uma hora.”',
      'Rego minhas plantas e dou uma volta na feira',
      'Café, um caderno e silêncio total',
    ] },
    { q: 'Uma amiga manda: “Oi… a gente pode conversar?” Você…', choices: [
      'Liga na hora. Seja o que for, tô aqui.',
      'Escuta primeiro e depois ajuda a organizar as ideias',
      'Aparece com besteirinhas e um plano pra fazer ela rir',
      'Manda uma mensagem longa e sincera com uma música que combina',
    ] },
    { q: 'Você chega numa festa onde quase não conhece ninguém.', choices: [
      'Dez minutos depois já estou conversando com metade da sala',
      'Sou quem faz todo mundo rir',
      'Acho uma pessoa e a gente conversa horas num canto',
      'Puxo uma brincadeira e chamo todo mundo',
    ] },
    { q: 'Você pode morar em qualquer lugar por um ano. Escolhe…', choices: [
      'Uma casinha na beira de uma mata',
      'Uma cidadezinha tranquila à beira-mar',
      'Um sótão aconchegante cheio de material de arte',
      'O centro de uma cidade grande e agitada',
    ] },
    { q: 'O trabalho em grupo é pra amanhã e nada está pronto.', choices: [
      'Assumo o comando e divido as tarefas',
      'Faço um plano passo a passo pra ninguém entrar em pânico',
      'De madrugada tenho a ideia que salva tudo',
      'Vejo quem está estressado e confiro se todo mundo está bem',
    ] },
    { q: 'Você pode ter um superpoder. Qual?', choices: [
      'Ler mentes',
      'Me teletransportar pra qualquer lugar',
      'Curar qualquer ferida ou coração partido',
      'Fazer qualquer pessoa sorrir na hora',
    ] },
    { q: 'O que mais enche a galeria do seu celular?', choices: [
      'Selfies e fotos de grupo com quem eu amo',
      'Céus, flores, árvores: natureza pra todo lado',
      'Ângulos estranhos, luzes com clima, pequenas obras de arte',
      'Lugares onde estive e minhas aventuras',
    ] },
    { q: 'O estresse está acumulando. O que ajuda?', choices: [
      'Arrumar tudo e escrever uma lista de tarefas bem clara',
      'Um treino pesado até a cabeça esvaziar',
      'Um tempo sozinho pra pensar em tudo com calma',
      'Vídeos engraçados e besteira pra comer. Preocupação fica pra depois.',
    ] },
    { q: 'O que as pessoas costumam pensar quando te conhecem?', choices: [
      '“Quanta confiança. Uma energia intensa.”',
      '“Que pessoa calorosa e doce.”',
      '“Passa calma. Dá pra confiar.”',
      '“Um mistério. Não parece com ninguém.”',
    ] },
    { q: 'Que presente te deixaria mais feliz?', choices: [
      'Uma planta ou algo feito à mão',
      'Ingressos pra um show com meus melhores amigos',
      'Um livro raro ou um caderno lindo',
      'Uma viagem surpresa de fim de semana',
    ] },
    { q: 'Uma discussão está começando. Você…', choices: [
      'Mantém a calma e procura o que é justo',
      'Pede desculpa primeiro. A paz importa mais.',
      'Solta uma piada pra aliviar o clima',
      'Dá um passo atrás e pensa nisso depois',
    ] },
    { q: 'Escolha o lema que mais parece com você.', choices: [
      'A vida é uma aventura: diga sim!',
      'Crescer devagar, criar raízes fundas.',
      'Primeiro sonhar, depois realizar.',
      'Amar em voz alta.',
    ] },
  ],

  types: {
    red: {
      name: 'Vermelho rubi',
      word: 'vermelho, vermelha',
      vibe: 'Fogo puro: coragem, garra e muita vida.',
      desc: 'Sua aura queima forte e quente. Você é de fazer: quando algo importa, você vai primeiro e pensa no caminho. Desafios te acendem em vez de assustar, e sua energia puxa os outros junto. Você sente tudo com intensidade, da empolgação à frustração, e não esconde. É justamente essa sinceridade que faz as pessoas confiarem em você.',
      strengths: ['Garra sem medo', 'Energia contagiante', 'Sinceridade direta'],
      others: 'Os outros te veem como a faísca do grupo: quem faz as coisas começarem e fala o que todo mundo está pensando.',
    },
    orange: {
      name: 'Laranja pôr do sol',
      word: 'laranja',
      vibe: 'Calor, espontaneidade e vontade de aventura o tempo todo.',
      desc: 'Sua aura brilha como um pôr do sol numa viagem de verão. Você ama lugares novos, gente nova e um bom “por que não?”. Faz amizade em qualquer lugar, e suas histórias são sempre as melhores da mesa. Rotina te entedia, então você enche a vida de cor com planos que ninguém mais inventaria. Por baixo de tanta diversão há um coração generoso que adora dividir bons momentos.',
      strengths: ['Espírito aventureiro', 'Faz amigos em todo lugar', 'Anima qualquer rolê'],
      others: 'Os outros te veem como quem transforma um dia comum numa história pra contar: de boa, sociável e cheio de surpresas.',
    },
    yellow: {
      name: 'Amarelo dourado',
      word: 'amarelo, amarela',
      vibe: 'Um raio de sol ambulante: alegria, curiosidade e luz.',
      desc: 'Sua aura é pura luz do dia. Você tem um otimismo, uma vontade de brincar e uma curiosidade sem fim, e vive colecionando ideias e hobbies novos. Encontra o lado engraçado de quase tudo, e sua risada é famosa entre os amigos. Você gosta de leveza, mas também tem a mente rápida: aprende logo e divide tudo com todo mundo.',
      strengths: ['Otimismo natural', 'Mente rápida e curiosa', 'Ilumina qualquer ambiente'],
      others: 'Os outros te veem como um raio de sol: basta você chegar para os dias difíceis ficarem mais leves.',
    },
    green: {
      name: 'Verde esmeralda',
      word: 'verde',
      vibe: 'Raízes firmes, muito cuidado e um crescer sereno.',
      desc: 'Sua aura parece uma mata depois da chuva: calma, fresca e viva. Você se importa muito com as pessoas e as coisas ao seu redor, e prefere construir algo duradouro a ganhar rápido. Percebe do que os outros precisam e ajuda sem alarde. Equilíbrio é importante pra você: uma caminhada, uma boa comida e a sua gente resolvem quase tudo.',
      strengths: ['Constância e paciência', 'Dom de cuidar', 'Mantém o equilíbrio'],
      others: 'Os outros te veem como um porto seguro: confiável, gentil, a pessoa para quem ligam quando precisam de chão.',
    },
    blue: {
      name: 'Azul oceano',
      word: 'azul',
      vibe: 'Águas calmas, lealdade profunda, palavras sinceras.',
      desc: 'Sua aura é tão calma quanto o mar num dia limpo. Você se mantém firme quando tudo complica e escolhe as palavras com cuidado. Verdade e confiança significam muito pra você: cumpre suas promessas e espera o mesmo. Talvez você não seja a voz mais alta da sala, mas quando fala, todo mundo escuta, porque sabe que é de verdade.',
      strengths: ['Calma sob pressão', 'Lealdade profunda', 'Fala com cuidado'],
      others: 'Os outros te veem como a pessoa mais confiável que conhecem: tranquila, justa e sempre honesta.',
    },
    indigo: {
      name: 'Índigo meia-noite',
      word: 'índigo, anil',
      vibe: 'Intuição, profundidade e sempre um passo à frente.',
      desc: 'Sua aura cintila como o céu logo depois da meia-noite. Você sente as coisas antes que alguém fale, e muitas vezes adivinha o fim de uma história antes de ela começar. Gosta de grandes perguntas, momentos de silêncio e conversas que vão fundo. Você valoriza sua independência e sua privacidade, mas quem te conhece de verdade tem por perto alguém com uma lucidez rara.',
      strengths: ['Intuição afiada', 'Pensamento profundo', 'Enxerga o quadro todo'],
      others: 'Os outros te veem como alguém sábio para a idade: de poucas palavras, perspicaz e meio difícil de decifrar.',
    },
    violet: {
      name: 'Violeta místico',
      word: 'violeta, roxo, roxa',
      vibe: 'Uma alma sonhadora com uma visão que ninguém mais vê.',
      desc: 'Sua aura é um redemoinho de imaginação. Você vê o mundo como ele poderia ser, não só como ele é, e sua cabeça vive cheia de ideias, histórias e planos. Arte, música e tudo que foge do comum te atraem. As regras de sempre nem sempre servem pra você, e tudo bem: seu jeito único de ver as coisas inspira quem está por perto.',
      strengths: ['Imaginação sem limites', 'Ideias originais', 'Inspira os outros'],
      others: 'Os outros te veem como alguém único: criatividade, um toque de mistério e ideias surpreendentes.',
    },
    pink: {
      name: 'Rosa suave',
      word: 'rosa',
      vibe: 'Coração mole, amor enorme, força delicada.',
      desc: 'Sua aura é quente e delicada como a primeira luz da primavera. Você ama sem medo e faz as pessoas se sentirem vistas, seja lembrando um aniversário ou percebendo quando alguém está quieto. Gentileza é natural pra você, e você acredita que um pequeno gesto pode mudar o dia de alguém. Ser doce não é ser fraco: seu coração é a sua força.',
      strengths: ['Gentileza sem fim', 'Empatia profunda', 'Faz as pessoas se sentirem amadas'],
      others: 'Os outros te veem como alguém doce e acolhedor: aquela pessoa cujo abraço resolve tudo.',
    },
  },
};
