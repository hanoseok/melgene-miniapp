/* Teste de fantasia de Halloween — Português do Brasil (pt/)
 * Mesmos 8 ids de fantasia e mesma ordem de perguntas/opções de costume-core.js (os pesos ficam só lá).
 * Chaves com Html: HTML como está (só <br> e <em>). O texto de privacy.sections também é HTML.
 * Sem spoiler: meta / og.default* / start / faq / loading não citam fantasias nem perguntas.
 * types.<id>.word = palavras básicas da fantasia (separadas por vírgula) — só para a checagem de spoiler.
 * Variáveis: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Teste de fantasia de Halloween: do que vou me fantasiar?',
    description: 'Do que se fantasiar no Halloween? Faça o teste de fantasia de Halloween grátis: 12 momentos de festa, 2 minutos, sem cadastro.',
    ogTitle: 'Teste de fantasia de Halloween 🎃 Do que você vai este ano?',
    ogDescription: 'Um teste grátis de 2 minutos. Responda a 12 momentos de festa de Halloween e descubra a fantasia que combina com a sua personalidade.',
  },
  siteName: 'Teste de fantasia de Halloween',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🎃 Provador de fantasias',
    h1Kicker: 'Teste de fantasia de Halloween',
    h1Html: 'Do que eu vou<br>neste <em>Halloween</em>?',
    hook: 'Ainda sem ideia do que vestir na festa? Doze momentos rapidinhos vão escolher o visual que tem tudo a ver com você.',
    metaTime: '⏱️ Uns 2 minutos',
    metaCount: '🦇 12 perguntas',
    start: 'Achar minha fantasia →',
  },

  quiz: {
    backAria: 'Pergunta anterior',
    progressAria: 'Progresso',
    qLabel: 'P{n}',
  },

  loading: {
    text: 'Revirando o armário de fantasias…',
    sub: 'Provando alguns visuais pra você',
  },

  result: {
    title: 'Teste de fantasia de Halloween: minha fantasia é {name}',
    eyebrow: 'Neste Halloween, você vai de',
    strengthsLabel: 'Seus poderes na festa',
    tipsLabel: 'Como montar o visual',
    bestLabel: 'Melhor dupla',
    rivalLabel: 'Rival amigável',
    sameShare: '{pct}% dos jogadores tiraram esta fantasia',
    shareText: 'Minha fantasia de Halloween é {name} {emoji} — “{vibe}” E a sua, qual é?',
    ctaStrong: 'Um amigo compartilhou a fantasia de Halloween',
    ctaSub: 'E você, vai de quê? Leva só 2 minutos.',
    retry: 'Fazer o teste de novo',
  },

  og: {
    eyebrow: 'Minha fantasia de Halloween',
    brand: '🎃 Teste de fantasia de Halloween',
    defaultKicker: 'Teste de fantasia de Halloween',
    defaultTitle: 'Do que você vai neste Halloween?',
    defaultDesc: '12 momentos de festa · uns 2 minutos',
  },

  faq: [
    { q: 'Como o teste escolhe a minha fantasia?', a: 'Cada resposta soma pontos para algumas fantasias, e a que tiver mais pontos ganha. Empates são resolvidos por uma regra fixa, então as mesmas respostas sempre dão a mesma fantasia.' },
    { q: 'Dá mesmo para montar a fantasia sozinho?', a: 'Dá, sim. Cada resultado vem com dicas simples usando coisas que quase todo mundo tem em casa, mais alguns itens baratinhos de loja de R$ 10 ou papelaria. Não precisa saber costurar.' },
    { q: 'E se eu não gostar do resultado?', a: 'Faça de novo! O resultado depende só de como você responde hoje, e outro clima de festa pode trazer outro visual. Ou chame a sua melhor dupla para uma fantasia em grupo.' },
    { q: 'As minhas respostas ficam salvas?', a: 'Não. As respostas são calculadas no seu navegador e nunca são guardadas. Só contamos, de forma anônima, qual fantasia saiu, para mostrar quão comum é cada resultado.' },
  ],

  privacy: {
    title: 'Política de privacidade | Teste de fantasia de Halloween',
    description: 'Política de privacidade do Teste de fantasia de Halloween: cookies, publicidade e estatísticas anônimas.',
    h1: 'Política de privacidade',
    introHtml: 'O Teste de fantasia de Halloween (o “Serviço”) respeita a sua privacidade e trata apenas o mínimo de informação necessário, como descrito abaixo.',
    sections: [
      ['1. Informações coletadas', 'Você pode usar o Serviço sem cadastro nem login. As respostas são calculadas no seu navegador e nunca são enviadas nem guardadas nos nossos servidores. Só contamos, de forma anônima, qual fantasia saiu, para mostrar quão comum é cada resultado.'],
      ['2. Cookies e tecnologias parecidas', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar direito.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e ajuste nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Guardamos totais diários anônimos (visualizações, testes concluídos, avaliações) para melhorar o Serviço. Eles não identificam você.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política, fale com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale desde 2 de outubro de 2026.'],
    ],
    back: '← Voltar ao teste de fantasia',
  },

  questions: [
    { q: 'Chegou o convite para uma festa de Halloween. Seu primeiro pensamento?', choices: [
      'Finalmente! Tô planejando meu visual há semanas.',
      'Quem vai dar a festa? Eu levo os petiscos e a playlist.',
      'Precisa ir fantasiado… ou posso ir de moletom?',
      'Vou fazer minha própria fantasia. Comprada pronta é sem graça.',
    ] },
    { q: 'Na loja de fantasias, você vai direto para…', choices: [
      'A arara de capas de veludo e glitter',
      'O cesto de promoção. Vale tudo!',
      'Orelhinhas, rabinhos e acessórios fofos',
      'O cantinho do faça-você-mesmo: gaze, tinta facial, fita',
    ] },
    { q: 'Você chega na festa. Primeira coisa que faz?', choices: [
      'Procura a pista de dança',
      'Cumprimenta todo mundo e apresenta as pessoas',
      'Escolhe um canto tranquilo e fica observando',
      'Vai direto para a mesa de comida',
    ] },
    { q: 'Ding-dong! Crianças pedindo doces na porta. Você…', choices: [
      'Dança na porta enquanto distribui os doces',
      'Se esconde atrás da porta e dá um susto. Buu!',
      'Dá para cada criança um saquinho de doces feito à mão',
      'Pede uma travessura primeiro. Nada mais justo.',
    ] },
    { q: 'O DJ toca uma música que você ama. Você…', choices: [
      'Dança como se ninguém estivesse olhando. Na hora.',
      'Entra devagar, com passos dramáticos',
      'Balança a cabeça do sofá, com um petisco na mão',
      'Puxa o amigo tímido para a pista',
    ] },
    { q: 'Hora da foto em grupo! Onde você está?', choices: [
      'Bem no meio, já no melhor ângulo',
      'Aparecendo só um pedacinho, lá no canto',
      'Fazendo careta na última fileira',
      'Arrumando o cabelo e a roupa de todo mundo antes',
    ] },
    { q: 'Alguém diz: “Bora contar histórias de terror.” Você…', choices: [
      'Já tem uma de arrepiar na ponta da língua',
      'Agarra o braço do lado e escuta com um olho fechado',
      'Transforma tudo em comédia no meio da história',
      'Sai de fininho para a cozinha',
    ] },
    { q: 'A mesa de comida está chamando. Você pega…', choices: [
      'Um pouquinho de tudo. E depois repete.',
      'Aquele prato estranho que ninguém tem coragem de provar',
      'Só a sobremesa mais bonita da mesa',
      'Pratos para os amigos antes de se servir',
    ] },
    { q: 'À meia-noite, a luz acaba de repente. Você…', choices: [
      'Liga a lanterna do celular e acalma todo mundo',
      'Faz um barulho sinistro para assustar o pessoal',
      'Fica paradinho. Você enxerga bem no escuro.',
      'Continua comendo. O escuro não muda nada.',
    ] },
    { q: 'Concurso de fantasias! Qual prêmio você levaria?', choices: [
      'Mais elegante',
      'Mais criativa',
      'Favorita do público',
      'Mais fofa',
    ] },
    { q: 'Vocês vão a uma casa mal-assombrada. Você é quem…', choices: [
      'Lidera o grupo e anima todo mundo',
      'Passeia com calma, sem se impressionar com nada',
      'Grita mais alto e ri mais que todos',
      'Estuda os cenários: “Como será que fizeram isso?”',
    ] },
    { q: 'Na manhã depois da festa, você está…', choices: [
      'Dormindo ainda. Me acorda ao pôr do sol.',
      'Arrumando tudo e devolvendo as coisas que o pessoal esqueceu',
      'Já planejando a festa do ano que vem',
      'Derretido no sofá, sem energia nenhuma',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampiro de Veludo',
      word: 'vampiro',
      vibe: 'Elegância natural, um toque de drama e a estrela de toda noite.',
      desc: 'Você nasceu para o turno da noite. Adora uma entrada triunfal, conhece o seu melhor ângulo e transforma uma noite comum em cena de filme. As pessoas se sentem atraídas pela sua confiança tranquila e por aquele ar de mistério. Você leva o estilo a sério, mas também cuida de quem está ao seu redor — quando você é leal, é para sempre.',
      strengths: ['Charme magnético', 'Estilo impecável', 'Dono da noite'],
      tips: ['Roupa preta e uma capa (um lençol escuro resolve) já dizem “conde do castelo”.', 'Penteie o cabelo para trás e passe um toque de vermelho no canto da boca.', 'Dentes de vampiro de plástico e uma reverência lenta e dramática ao chegar.'],
    },
    witch: {
      name: 'Bruxa do Luar',
      word: 'bruxa',
      vibe: 'Esperta, criativa e sempre preparando um plano genial.',
      desc: 'A sua cabeça é um caldeirão de ideias. Você prefere criar algo original a copiar o que todo mundo faz, e quase sempre tem um plano B, C e D. É independente e um pouco travessa, com um humor afiado que deixa qualquer conversa mais interessante. Os amigos te procuram quando precisam de uma solução esperta — ou de um feitiço de bons conselhos.',
      strengths: ['Ideias geniais', 'Espírito independente', 'Humor afiado'],
      tips: ['Um chapéu pontudo e um vestido ou casaco longo e escuro já bastam para começar.', 'Leve uma vassoura ou uma caneca escrita “poção” como item marca registrada.', 'Capriche com adesivos de estrela, batom roxo ou um gato preto de pelúcia no ombro.'],
    },
    ghost: {
      name: 'Fantasma de Lençol',
      word: 'fantasma',
      vibe: 'Tímido e fofo, aconchegante e, em segredo, o mais engraçado da festa.',
      desc: 'Você não precisa dos holofotes para se divertir. Prefere roupa confortável, poucos amigos próximos e assistir à festa de um cantinho gostoso. No começo podem te subestimar, mas as suas observações discretas e piadas certeiras pegam todo mundo de surpresa. Você é gentil, carinhoso e o tipo de amigo que faz os outros se sentirem seguros.',
      strengths: ['Gentileza sincera', 'Humor discreto', 'Ótimo observador'],
      tips: ['Um lençol branco com dois furos para os olhos. Clássico, confortável e pronto em cinco minutos.', 'Coloque óculos escuros ou um chapeuzinho para deixar com a sua cara.', 'Leve uma plaquinha escrita “buu” para as fotos mais fofas.'],
    },
    zombie: {
      name: 'Zumbi da Balada',
      word: 'zumbi',
      vibe: 'Tranquilo, sempre com fome e impossível de parar depois que embala.',
      desc: 'Você vai na onda e quase nada te estressa. Com bons petiscos, um tênis confortável e as suas pessoas favoritas, você já está feliz. De manhã pode ser meio lento, mas quando entra, entra de cabeça — e ninguém te segura. Os amigos adoram o seu jeito de boa e o quanto você é fiel à turma.',
      strengths: ['Totalmente de boa', 'Fôlego infinito', 'Fiel à turma'],
      tips: ['Pegue roupas velhas, faça alguns rasgos e esfregue borra de café para parecer “terra”.', 'Tinta facial cinza e sombra escura ao redor dos olhos resolvem.', 'Ande devagar com os braços esticados, gemendo por petiscos.'],
    },
    blackcat: {
      name: 'Gato Preto da Meia-Noite',
      word: 'gato',
      vibe: 'Descolado, curioso e misterioso — carinho só para os escolhidos.',
      desc: 'Você faz tudo do seu jeito, no seu ritmo. Tem curiosidade por tudo, mas só demonstra interesse quando sente de verdade. As pessoas te acham meio misterioso, e é exatamente assim que você gosta. Por trás da pose, você é brincalhão e carinhoso com quem ganha a sua confiança — e sempre cai de pé.',
      strengths: ['Estilo sem esforço', 'Curiosidade sem fim', 'Sempre cai de pé'],
      tips: ['Roupa toda preta com uma tiara de orelhinhas de gato é reconhecida na hora.', 'Desenhe um narizinho e bigodes com delineador.', 'Prenda nas costas um rabo feito com uma meia preta ou meia-calça.'],
    },
    mummy: {
      name: 'Múmia Aconchegante',
      word: 'múmia',
      vibe: 'Paciente, cuidadosa e a amiga que mantém todo mundo unido.',
      desc: 'Você é quem garante, sem alarde, que está todo mundo bem. Lembra dos pequenos detalhes, conserta o que quebrou e está sempre com um curativo à mão — literalmente ou emocionalmente. É paciente e firme, com um charme de alma antiga e um gosto por coisas clássicas e atemporais. As pessoas ficam mais calmas só de estar perto de você.',
      strengths: ['Paciência infinita', 'Coração enorme', 'Confiança total'],
      tips: ['Enrole gaze branca ou tiras de um lençol velho por cima de uma roupa branca.', 'Deixe um olho aparecendo e algumas pontas soltas balançando.', 'Manche as faixas com chá ou café para um ar bem antigo.'],
    },
    pumpkin: {
      name: 'Rei ou Rainha Abóbora',
      word: 'abóbora',
      vibe: 'Caloroso, radiante e o coração da festa — realeza do Halloween.',
      desc: 'Você ilumina qualquer ambiente como uma lanterna. Adora reunir as pessoas, lembra o nome de todo mundo e garante que ninguém fique de fora. As festas ficam mais animadas quando você está lá, e muitas vezes é você quem organiza. O seu calor é contagiante — as pessoas saem de perto de você um pouco mais iluminadas.',
      strengths: ['Anfitrião nato', 'Calor contagiante', 'Une todo mundo'],
      tips: ['Uma blusa ou moletom laranja com uma carinha de abóbora recortada em feltro preto.', 'Complete com uma tiara de folhas verdes ou uma coroinha.', 'Leve um baldinho de doces e distribua guloseimas para todos.'],
    },
    skeleton: {
      name: 'Esqueleto Dançarino',
      word: 'esqueleto',
      vibe: 'Bobo, sincero e sempre o primeiro na pista de dança.',
      desc: 'Você está aqui para se divertir, e dá para ver. Faz as pessoas rirem sem nem tentar, e a sua energia arrasta todo mundo para a pista. Você é sincero de um jeito refrescante — o que se vê é o que se leva, até o osso. A vida fica mais leve perto de você, porque você nunca se leva a sério demais.',
      strengths: ['Anima qualquer clima', 'Sinceridade até o osso', 'Dançarino sem medo'],
      tips: ['Roupa preta com fita branca ou tinta de tecido para os ossos.', 'Pinte uma caveira no rosto: base branca, círculos pretos nos olhos e dentes costurados.', 'Ensaie um passinho bobo — chacoalhar os ossos é obrigatório.'],
    },
  },
};
