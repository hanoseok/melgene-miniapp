/* Jogo 2048 (edição de Halloween) — português do Brasil */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap',
    display: "'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Jogo 2048 – jogar grátis online, edição Halloween',
    description: 'Jogue o jogo 2048 online na versão de Halloween: deslize ou use as setas, junte as peças com o mesmo número e chegue ao 2048. Grátis, sem baixar nada.',
    ogTitle: 'Jogo 2048 🎃 Você chega no 2048?',
    ogDescription: 'Deslize, junte, dobre. Um 2048 assustador pra jogar direto no navegador.',
  },
  siteName: 'Jogo 2048',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🎃 Edição de Halloween · quebra-cabeça',
    h1Kicker: 'Jogo 2048',
    h1Html: 'Você consegue<br>chegar no <em>2048</em>?',
    hook: 'Deslize as peças. Dois números iguais se encontram e viram um só — continue dobrando antes que o tabuleiro encha.',
    how: { swipe: 'Deslize para mover', match: 'Junte os iguais', goal: 'Chegue ao 2048' },
    facts: 'Sem tempo · deslize ou use as setas',
    start: 'Bora jogar →',
  },

  play: {
    score: 'Pontos',
    best: 'Recorde',
    boardAria: 'Tabuleiro. Deslize ou use as setas do teclado para mover as peças.',
    won: 'Você fez 2048!',
    keepGoing: 'Continuar',
    finish: 'Parar aqui',
    over: 'Sem jogadas!',
  },

  result: {
    over: 'Acabaram as jogadas!',
    won: 'Você chegou no 2048!',
    points: 'pontos',
    best: 'Recorde: {n}',
    newBest: 'Novo recorde!',
    biggest: 'Maior peça',
    moves: 'Jogadas',
    top: 'Top {n}%',
    beat: 'Melhor que {pct}% dos jogadores',
    beatAll: 'Melhor que todas as outras pontuações até agora',
    others: 'Comparado com outras {n} pontuações',
    comparing: 'Comparando com outros jogadores…',
    retry: 'Jogar de novo',
    shareTitle: 'Jogo 2048 – edição de Halloween',
    shareText: 'Fiz {score} pontos no jogo 2048 🎃 Você consegue me passar?',
  },

  og: {
    brand: '🔢 Jogo 2048',
    defaultKicker: '2048 de Halloween grátis',
    defaultTitle: 'Você chega no 2048?',
    defaultDesc: 'Deslize · junte · dobre',
  },

  faq: [
    { q: 'Como jogar 2048?', a: 'Deslize no tabuleiro (ou aperte as setas) e todas as peças andam juntas para aquele lado. Quando duas peças com o mesmo número se encostam, elas viram uma só com o dobro do valor. Depois de cada jogada aparece um novo 2 ou 4.' },
    { q: 'Quando o jogo acaba?', a: 'Não tem tempo. O jogo acaba quando o tabuleiro fica cheio e nenhuma peça vizinha tem o mesmo número. Chegou no 2048? Dá para parar ali ou continuar para fazer mais pontos.' },
    { q: 'Como funciona a pontuação?', a: 'Cada junção soma o valor da peça nova aos seus pontos, então junções maiores valem mais. Seu recorde fica salvo só neste navegador.' },
    { q: 'O top % é real?', a: 'Sim. No fim da partida, só a sua pontuação é enviada de forma anônima para o nosso servidor e comparada com a de todo mundo. O top % só aparece quando há pontuações reais para comparar; se não houver, nada é mostrado.' },
  ],

  privacy: {
    title: 'Política de privacidade | Jogo 2048',
    description: 'Política de privacidade do jogo 2048: pontuações anônimas, cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O jogo 2048 (o "Serviço") respeita a sua privacidade e trata apenas o mínimo de informações descrito abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta nem login. No fim de uma partida, só a sua pontuação (arredondada de 20 em 20 pontos) é enviada ao nosso servidor como contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'],
      ['2. Cookies e tecnologias parecidas', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seu recorde, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar direito.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e mude suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios agregados que guardam só totais diários por idioma (visualizações, partidas iniciadas e terminadas, avaliações). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale a partir de 4 de outubro de 2026.'],
    ],
    back: '← Voltar ao jogo 2048',
  },
};
