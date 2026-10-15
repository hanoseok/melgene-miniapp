/* Jogo da memória — português (Brasil) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Jogo da memória – Vire as cartas de Halloween',
    description: 'Jogue o jogo da memória online grátis: vire as cartas de Halloween de duas em duas e encontre todos os pares. Três níveis, cronômetro e jogadas. Sem download.',
    ogTitle: 'Jogo da memória 🎃 Você acha todos os pares?',
    ogDescription: 'Abóboras, fantasmas e morcegos estão escondidos nas cartas. Vire duas de cada vez e teste sua memória.',
  },
  siteName: 'Jogo da memória de Halloween',
  privacyLink: 'Privacidade',
  start: {
    badge: '🎃 Cartas de Halloween',
    h1Kicker: 'Jogo da memória',
    h1Html: 'Vire as cartas,<br>ache todos os <em>pares</em>',
    hook: 'Abóboras, fantasmas e morcegos estão escondidos nas cartas. Vire duas de cada vez e lembre bem onde está cada figura.',
    how: 'Vire duas cartas · figuras iguais = par',
    levelLabel: 'Escolha o nível',
    levels: { easy: 'Fácil', normal: 'Médio', hard: 'Difícil' },
    start: 'Começar →',
  },
  play: {
    time: 'Tempo',
    moves: 'Jogadas',
    pairs: 'Pares',
    boardAria: 'Tabuleiro do jogo da memória. Vire duas cartas para achar um par.',
    aDown: 'Carta {n}, virada para baixo',
    paused: 'Pausado · toque para continuar',
  },
  result: {
    done: 'Todos os pares achados!',
    sec: 's',
    movesLabel: 'Jogadas',
    accLabel: 'Precisão',
    best: 'Recorde: {t}',
    newBest: 'Novo recorde!',
    top: 'Top {n}%',
    beat: 'Mais rápido que {pct}% dos jogadores',
    beatAll: 'Mais rápido que todos os tempos até agora',
    others: 'Comparado com outros {n} tempos deste nível',
    comparing: 'Comparando com outros jogadores…',
    retry: 'Jogar de novo',
    shareTitle: 'Jogo da memória de Halloween – como está sua memória?',
    shareText: 'Achei os {pairs} pares em {time} s e {moves} jogadas 🎃 Consegue me vencer?',
  },
  og: {
    brand: '🃏 Jogo da memória',
    defaultKicker: 'Jogo da memória grátis',
    defaultTitle: 'Você acha todos os pares?',
    defaultDesc: 'Vire · lembre · combine',
  },
  faq: [
    {
      q: 'Como se joga o jogo da memória?',
      a: 'No começo todas as cartas estão viradas para baixo. Toque em uma carta e depois em outra. Se as duas figuras forem iguais, elas ficam abertas como par; se não, voltam a virar depois de um instante. Ache todos os pares para terminar. O cronômetro começa na primeira carta.',
    },
    {
      q: 'O que conta como jogada e como a precisão é calculada?',
      a: 'Cada vez que você vira duas cartas é uma jogada. A precisão é o número de pares dividido pelas jogadas, então achar todos sem errar dá 100%. Errar não soma tempo, mas gasta jogadas.',
    },
    {
      q: 'Qual a diferença entre os níveis?',
      a: 'Fácil tem 12 cartas (6 pares), Médio tem 16 cartas (8 pares) e Difícil tem 24 cartas (12 pares). Cartas e figuras são embaralhadas a cada partida, e seu recorde é salvo separado para cada nível.',
    },
    {
      q: 'O que acontece se eu trocar de app?',
      a: 'O cronômetro para e as cartas ficam cobertas, para ninguém espiar. Quando voltar, toque no tabuleiro e a partida continua de onde parou.',
    },
    {
      q: 'De onde vem o “Top %”?',
      a: 'Ao terminar, seu nível e seu tempo arredondado são comparados com os tempos reais de outros jogadores do mesmo nível. Se ainda não houver outros tempos, a comparação simplesmente não aparece.',
    },
  ],
  privacy: {
    "title": "Política de privacidade | Jogo da memória",
    "description": "Política de privacidade do jogo da memória: tempos anônimos, cookies, publicidade e estatísticas.",
    "h1": "Política de privacidade",
    "introHtml": "O jogo da memória de Halloween (o \"Serviço\") respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta e sem login. Quando você termina uma partida, só o nível e o tempo (arredondado para o décimo de segundo) são enviados ao nosso servidor como contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso do Serviço, como descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seus recordes, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências em <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam apenas totais diários por idioma (visualizações de página, partidas iniciadas e concluídas, avaliações com estrelas). Nada disso identifica você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta Política de privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política vale a partir de 16 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao jogo da memória"
  },
};
