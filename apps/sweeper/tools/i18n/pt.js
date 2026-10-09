/* Campo minado — pt (see en.js for the key structure; placeholders {t} {n} {pct} {time} {diff} stay as-is) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
    display: "'Audiowide'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Campo minado – Jogo de minas grátis online',
    description: 'Jogue Campo minado online: abra todos os quadrados seguros, marque as minas com bandeiras e vença o relógio. Três níveis e um primeiro toque sempre seguro.',
    ogTitle: 'Campo minado 💣 Em quanto tempo você limpa o campo?',
    ogDescription: 'O clássico quebra-cabeça no navegador: três tamanhos, um primeiro toque seguro e um tempo para bater.',
  },
  siteName: 'Campo minado',
  privacyLink: 'Política de privacidade',
  start: {
    badge: '💣 Clássico · 3 níveis',
    h1Kicker: 'Campo minado',
    h1Html: 'Limpe o campo<br>sem <em>minas</em>',
    hook: 'Os números mostram quantas minas estão escondidas por perto. Pense, coloque bandeiras nos quadrados perigosos e limpe o tabuleiro antes que o tempo acabe.',
    how: { reveal: 'Toque para abrir', flag: 'Segure p/ bandeira', chord: 'Toque num número p/ limpar' },
    facts: 'O primeiro toque é sempre seguro',
    diffLabel: 'Escolha o nível',
    diffs: { beginner: 'Fácil', intermediate: 'Médio', expert: 'Difícil' },
    start: 'Começar →',
  },
  play: {
    mines: 'Minas',
    time: 'Tempo',
    digMode: 'Abrir',
    flagMode: 'Bandeira',
    boardAria: 'Tabuleiro do Campo minado. Toque num quadrado para abri-lo; segure ou use o modo bandeira para marcar uma mina.',
    paused: 'Pausado · toque para continuar',
    aHidden: 'Quadrado fechado',
    aFlag: 'Quadrado com bandeira',
    aMine: 'Mina',
    aNum: '{n} minas por perto',
  },
  result: {
    win: 'Campo limpo!',
    lose: 'Bum!',
    sec: 's',
    timeLabel: 'Tempo',
    clearedLabel: 'Aberto',
    best: 'Melhor: {t}',
    newBest: 'Novo recorde!',
    top: 'Top {n}%',
    beat: 'Mais rápido que {pct}% dos jogadores',
    beatAll: 'Mais rápido que todos os tempos até agora',
    others: 'Comparado com outros {n} tempos',
    comparing: 'Comparando com outros jogadores…',
    retry: 'Jogar de novo',
    shareTitle: 'Campo minado – você consegue limpar o campo?',
    shareWin: 'Limpei o Campo minado ({diff}) em {time} segundos 💣 Você me vence?',
    shareLose: 'No Campo minado ({diff}) abri {pct}% antes do bum 💥 Você faz melhor?',
  },
  og: { brand: '💣 Campo minado', defaultKicker: 'Quebra-cabeça grátis', defaultTitle: 'Você limpa o campo?', defaultDesc: 'Marque as minas · vença o relógio' },
  faq: [
    {
      q: 'Como se joga Campo minado?',
      a: 'Toque num quadrado para abri-lo. Um número mostra quantos dos oito quadrados vizinhos escondem uma mina. Descubra onde elas estão, marque com bandeiras e abra todos os quadrados sem mina para vencer.',
    },
    {
      q: 'Como coloco uma bandeira no celular?',
      a: 'Segure um quadrado por um instante, ou mude o botão Abrir / Bandeira acima do tabuleiro para o modo bandeira e toque. No computador também vale o clique direito ou a tecla F no quadrado selecionado.',
    },
    {
      q: 'O que acontece ao tocar num número?',
      a: 'Se você colocou ao redor do número tantas bandeiras quanto ele indica, tocar nele abre de uma vez os outros quadrados vizinhos. Se alguma bandeira estiver errada, o quadrado explode, então confira antes.',
    },
    {
      q: 'O primeiro toque é mesmo seguro?',
      a: 'É sim. As minas são colocadas depois do seu primeiro toque, nunca naquele quadrado nem ao lado, então sempre abre algum espaço. O tempo começa nesse toque e pausa quando você sai da aba.',
    },
  ],
  privacy: {
    "title": "Política de privacidade | Campo minado",
    "description": "Política de privacidade do Campo minado: tempos anônimos, cookies, publicidade e estatísticas.",
    "h1": "Política de privacidade",
    "introHtml": "O Campo minado (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta ou login. Quando você vence uma partida, apenas o nível e o seu tempo (arredondado para meio segundo) são enviados ao nosso servidor como contagem anônima, sem nome ou identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso do Serviço, conforme descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seu recorde, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam só totais diários por idioma (visualizações de página, partidas iniciadas e concluídas, avaliações). Nada disso identifica você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política vale a partir de 10 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao Campo minado"
  },
};
