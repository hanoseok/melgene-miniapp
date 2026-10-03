/* Teste do amor — português do Brasil (pt/)
 * Mesmos id e mesma ordem de perguntas/opções de lovestyle-core.js (a pontuação fica só lá).
 * Sem spoiler: meta, tela inicial, FAQ e OG padrão não citam nenhum tipo (bicho) nem perguntas.
 * types.<id>.word = palavra(s) do bicho só para a checagem de spoiler. Mantenha {name} {emoji} {vibe} {pct} {n}.
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
    title: 'Teste do amor: que tipo de namorado(a) você é?',
    description: 'Como você é quando está apaixonado(a)? Faça o teste do amor: 10 momentos de namoro, 2 a 3 minutos, sem cadastro. Descubra seu estilo no amor, quem combina com você e dicas para o seu coração.',
    ogTitle: 'Teste do amor 💘 Que tipo de namorado(a) você é?',
    ogDescription: 'Um teste de 2 minutos. Responda 10 momentos de namoro e descubra seu verdadeiro estilo no amor.',
  },
  siteName: 'Teste do amor',
  privacyLink: 'Privacidade',

  start: {
    badge: '💘 Teste de personalidade no amor',
    h1Kicker: 'Teste do amor',
    h1Html: 'Que tipo de namorado(a)<br>você é <em>no amor</em>?',
    hook: 'Jeito de mandar mensagem, primeiro encontro, briguinhas… Dez momentos do dia a dia revelam o personagem fofo escondido no seu coração.',
    metaTime: '⏱️ 2 a 3 minutos',
    metaCount: '💌 10 perguntas',
    start: 'Descobrir meu estilo →',
  },

  quiz: {
    backAria: 'Pergunta anterior',
    progressAria: 'Progresso',
    qLabel: 'P{n}',
  },

  loading: {
    text: 'Lendo seu coração…',
    sub: 'Combinando suas respostas com um estilo de amor',
  },

  result: {
    title: 'Teste do amor: eu sou {name}',
    eyebrow: 'No amor, você é',
    strengthsLabel: 'Seus charmes no amor',
    tipsLabel: 'Dicas de amor para você',
    bestLabel: 'Seu match',
    rivalLabel: 'Seu rival',
    sameShare: '{pct}% tiveram este estilo',
    shareText: 'No amor eu sou {name} {emoji}: “{vibe}” E você?',
    ctaStrong: 'Alguém compartilhou o estilo no amor',
    ctaSub: 'Que tipo de namorado(a) você é? 2 minutos.',
    retry: 'Fazer de novo',
  },

  og: {
    eyebrow: 'Meu estilo no amor',
    brand: '💘 Teste do amor',
    defaultKicker: 'Teste do amor',
    defaultTitle: 'Que tipo de namorado(a) você é?',
    defaultDesc: '10 momentos de namoro · 2 a 3 minutos',
  },

  faq: [
    { q: 'Como meu resultado é definido?', a: 'Cada resposta soma pontos para alguns estilos, e vence o que tiver mais pontos. Empates são decididos por uma regra fixa, então as mesmas respostas sempre dão o mesmo resultado.' },
    { q: 'É um teste de personalidade científico?', a: 'Não, é só para se divertir. As perguntas vêm de hábitos do dia a dia no namoro e não são um diagnóstico psicológico: encare como um espelho divertido, não como um veredito.' },
    { q: 'O que significam “seu match” e “seu rival”?', a: 'Seu match é o estilo que equilibra o seu naturalmente. Seu rival é aquele com quem você mais se estranha… o que também pode significar mais faísca.' },
    { q: 'Minhas respostas ficam salvas?', a: 'Não. Suas respostas são calculadas no seu navegador e nunca ficam salvas. Só contamos, de forma anônima, qual estilo saiu para mostrar o quanto cada resultado é comum.' },
  ],

  privacy: {
    title: 'Política de privacidade | Teste do amor',
    description: 'Política de privacidade do Teste do amor: cookies, publicidade e estatísticas anônimas.',
    h1: 'Política de privacidade',
    introHtml: 'O Teste do amor (o “Serviço”) respeita sua privacidade e trata apenas o mínimo de informações necessário, como descrito abaixo.',
    sections: [
      ['1. Informações que coletamos', 'Você pode usar o Serviço sem cadastro nem login. Suas respostas são calculadas no navegador e nunca são enviadas nem guardadas em nossos servidores. Só contamos, de forma anônima, qual estilo saiu para mostrar a frequência de cada resultado.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar direito.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e ajuste em <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Guardamos apenas totais diários anônimos (visualizações, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não identificam você.'],
      ['5. Contato', 'Em caso de dúvidas sobre esta política, fale com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale a partir de 4 de outubro de 2026.'],
    ],
    back: '← Voltar ao teste do amor',
  },

  questions: [
    { q: 'O crush manda mensagem primeiro. Você…', choices: [
      'Responde em três segundos, com cinco emojis',
      'Espera um pouco. Não quer parecer ansioso(a) demais.',
      'Manda uma resposta provocante que deixa curiosidade',
      'Pergunta como foi o dia e lembra de cada detalhe',
    ] },
    { q: 'Primeiro encontro! O que você sugere?', choices: [
      'Uma cafeteria fofa com doces lindos e música baixinha',
      'Um lugar tranquilo para conversar de verdade',
      'Fliperama ou café de jogos de tabuleiro. Bora jogar!',
      'Algo novo: feirinha à noite, trilha, bate-volta',
    ] },
    { q: 'O aniversário do mozão está chegando. Seu plano?', choices: [
      'Uma festa surpresa com todos os amigos',
      'Algo estiloso que ninguém imaginaria',
      'Uma carta escrita à mão e um álbum das nossas memórias',
      'Um presente zoeiro que rende risada por dias',
    ] },
    { q: 'O mozão teve um dia horrível. Você…', choices: [
      'Fica do lado em silêncio. Não precisa de palavras.',
      'Aparece com a comida favorita e resolve o que dá',
      'Escuta a noite toda e lembra de cada palavra',
      'Chama para um rolê de carro de última hora para espairecer',
    ] },
    { q: 'Quanto você gosta de trocar mensagem quando está ficando sério?', choices: [
      'O dia todo! Do bom dia ao boa noite',
      'Uma ou duas mensagens. Prefiro ligar.',
      'Mensagens longas e fofas, cheias de coração',
      'De vez em quando. Prefiro contar pessoalmente.',
    ] },
    { q: 'Rolou uma briguinha. Você…', choices: [
      'Precisa de um tempo sozinho(a) antes de conversar',
      'Finge que está tudo bem, mas solta indiretas',
      'Pede desculpa primeiro, mesmo sem ter culpa',
      'Faz uma piada para quebrar o gelo',
    ] },
    { q: 'O que faz seu coração disparar?', choices: [
      'Quando o rosto se ilumina assim que me vê',
      'Quando a gente ri da mesma bobeira',
      'Quando do nada vem um “bora pra algum lugar?”',
      'Quando respeitam meu espaço e ainda assim me escolhem',
    ] },
    { q: 'Seu fim de semana ideal a dois?', choices: [
      'Se arrumar, restaurante da moda e fotos lindas',
      'Cozinhar em casa e consertar coisas juntos',
      'Piquenique com flores e pôr do sol',
      'O lugar de sempre, o pedido de sempre',
    ] },
    { q: 'Quando começa a gostar de alguém, você…', choices: [
      'Não consegue esconder. Em dois dias todo mundo sabe.',
      'Se faz de difícil e deixa a pessoa vir',
      'Gosta em silêncio por muito, muito tempo',
      'Chama para sair na hora. A vida é curta!',
    ] },
    { q: 'O que mais importa para você num relacionamento?', choices: [
      'Confiança e espaço para ser eu mesmo(a)',
      'Me sentir seguro(a) e cuidado(a)',
      'Romance e pequenas datas especiais',
      'Ser melhores amigos e poder falar de tudo',
    ] },
  ],

  types: {
    puppy: {
      name: 'o Golden Retriever',
      word: 'golden,retriever,cachorro,cachorrinho',
      vibe: 'Coração inteiro, sempre no máximo e feliz demais de te ver.',
      desc: 'Quando você ama alguém, o mundo todo fica sabendo. Você manda mensagem primeiro, chega antes e nunca faz joguinho: os sentimentos estão estampados no rosto. Sua energia faz o mozão se sentir a pessoa mais importante do mundo. Só lembre de cuidar de você também, para esse coração enorme nunca ficar sem bateria.',
      strengths: ['Entrega total', 'Alegria contagiante', 'Zero joguinhos'],
      tips: ['Resposta demorada não quer dizer que tem problema: dê espaço para sentirem sua falta.', 'Separe um dia por semana só para você; o tempo juntos vai brilhar ainda mais.', 'Pergunte qual carinho a pessoa mais gosta e capriche exatamente nele.'],
    },
    cat: {
      name: 'o Gato tsundere',
      word: 'gato,gata',
      vibe: 'Frio por fora, molinho por dentro: carinho só para quem foi escolhido.',
      desc: 'Você não se apaixona rápido, muito menos fazendo barulho. Precisa do seu espaço e do seu tempo, então no começo pode parecer meio distante. Mas quando alguém conquista sua confiança, ganha um lado doce e brincalhão que ninguém mais vê. Seu amor é discreto, leal e muito real.',
      strengths: ['Independência tranquila', 'Fiel quando confia', 'Fofura secreta'],
      tips: ['Diga em voz alta um sincero “senti sua falta”: vindo de você, vale ouro.', 'Explique que precisa de um tempo sozinho(a), para não parecer frieza.', 'Pequenos gestos contam: lembrar o café favorito é a sua linguagem do amor.'],
    },
    fox: {
      name: 'a Raposa sedutora',
      word: 'raposa',
      vibe: 'Esperta, estilosa e sempre um passo à frente no jogo da conquista.',
      desc: 'Você sabe causar impressão. Mensagens espertas, o look perfeito e a dose certa de mistério: fica difícil resistir. Você ama o friozinho na barriga do romance e mantém a chama acesa com surpresas. Por trás de todo esse charme, quer alguém que acompanhe seu ritmo e ainda enxergue quem você é de verdade.',
      strengths: ['Charme magnético', 'Bom gosto', 'Mantém a chama acesa'],
      tips: ['Misture o joguinho com sinceridade: sinais claros criam confiança rápido.', 'Mostre-se num dia de preguiça, sem produção: o real é atraente.', 'Suas surpresas são lendárias; deixe que te surpreendam também.'],
    },
    bear: {
      name: 'o Ursão fofo',
      word: 'urso,ursão,ursinho',
      vibe: 'Firme, caloroso e o abraço mais seguro do mundo.',
      desc: 'Você mostra amor com atitudes, não com grandes discursos. Conserta, cozinha e está presente quando importa. Talvez não seja o romântico mais chamativo, mas o mozão nunca precisa se perguntar onde está no seu coração. Estar com você é como voltar para casa.',
      strengths: ['Confiável demais', 'Amor em atitudes', 'Coração enorme'],
      tips: ['De vez em quando, coloque os sentimentos em palavras: “tenho orgulho de você” faz milagre.', 'Planeje um encontro surpresa só por diversão, nada prático.', 'Deixe que cuidem de você também.'],
    },
    bunny: {
      name: 'o Coelhinho romântico',
      word: 'coelho,coelhinho',
      vibe: 'Um sonhador que lembra de cada encontro, cada música e cada datinha.',
      desc: 'Para você, o amor é um filme, e cada cena precisa ser linda. Você repara nos detalhes, escreve mensagens do fundo do coração e guarda cada lembrança como tesouro. Sente tudo com intensidade: é super atencioso(a) e, às vezes, um pouco sensível. A pessoa certa vai cuidar desse seu jeito doce.',
      strengths: ['Romantismo sincero', 'Lembra de tudo', 'Atencioso(a) de verdade'],
      tips: ['Quando algo magoar, fale com carinho em vez de esperar que adivinhem.', 'Nem todo mundo ama com grandes gestos: repare também nos pequenos.', 'Façam um álbum de fotos juntos: é o seu superpoder.'],
    },
    penguin: {
      name: 'o Pinguim fiel',
      word: 'pinguim',
      vibe: 'Começa devagar, mas quando ama é uma pessoa só, para sempre.',
      desc: 'Você leva tempo para abrir o coração e nunca tem pressa. Mas quando escolhe alguém, é para durar. Escuta de verdade, lembra do que importa e continua ali em todas as estações. Seu amor é doce, paciente e daqueles que todo mundo sonha.',
      strengths: ['Fidelidade total', 'Sabe ouvir', 'Doçura constante'],
      tips: ['Não demore demais para mostrar interesse: um pequeno primeiro passo pode mudar tudo.', 'Divida também suas preocupações, não só escute as da outra pessoa: amor é via de mão dupla.', 'Testem um programa novo por mês para a rotina continuar com faísca.'],
    },
    hamster: {
      name: 'o Hamster parceiro',
      word: 'hamster',
      vibe: 'O mozão também é seu melhor amigo, e todo encontro termina em risada.',
      desc: 'Para você, os melhores relacionamentos começam como amizade. Você ama jogar, dividir besteirinhas para comer e rir até a barriga doer. É fácil estar com você, e você traz uma energia leve e divertida para o amor. Conversa séria deixa você meio sem jeito, mas sinceridade e bom humor deixam a relação forte.',
      strengths: ['Diversão sem fim', 'Fácil de conversar', 'Amizade em primeiro lugar'],
      tips: ['Coloque um pouco de romance de vez em quando: às vezes vela ganha de piada.', 'Quando o papo ficar sério, fique na conversa em vez de fazer graça.', 'Mantenham vivas as piadas internas: elas são a cola de vocês.'],
    },
    dolphin: {
      name: 'o Golfinho livre',
      word: 'golfinho',
      vibe: 'Aventureiro, espontâneo e sempre com a próxima ideia de rolê na cabeça.',
      desc: 'Você ama liberdade, lugares novos e dizer sim para a aventura. Namorar você é sinônimo de viagens de carro, planos de última hora e histórias para contar. Você leva energia e curiosidade para cada relação e precisa de alguém que curta a viagem. A liberdade importa, mas a pessoa certa dá vontade de voltar para casa.',
      strengths: ['Espírito aventureiro', 'Cheio de ideias', 'Coragem no amor'],
      tips: ['Equilibre os planos espontâneos com alguns rituais fixos em que a pessoa possa confiar.', 'Combine antes das grandes aventuras: nem todo mundo curte surpresa.', 'Divida seus sonhos: fazer planos juntos já é uma aventura.'],
    },
  },
};
