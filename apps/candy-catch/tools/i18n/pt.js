/* Jogo de pegar doces de Halloween — Português do Brasil (/pt/, og:locale pt_BR)
 * Mesma estrutura de chaves de en.js. Regras e pontos em candy-catch-core.js.
 */
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
    title: 'Jogo de pegar doces de Halloween – Grátis',
    description: 'Jogo de pegar doces de Halloween: mova seu balde de abóbora, pegue os doces que caem, desvie de aranhas e fantasmas e faça combos. 50 segundos, grátis e sem download.',
    ogTitle: 'Jogo de pegar doces de Halloween 🍬 Quantos você pega?',
    ogDescription: 'Está chovendo doce. 50 segundos, 3 vidas: até onde você enche o balde?',
  },
  siteName: 'Pegar doces de Halloween',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🎃 Doces ou travessuras · arcade',
    h1Kicker: 'Jogo de pegar doces de Halloween',
    h1Html: 'Quantos doces<br>você <em>pega</em>?',
    hook: 'Hoje à noite está chovendo doce. Encha seu balde antes do tempo acabar… mas nem tudo que cai é docinho.',
    how: { move: 'Arraste ou ← →', catch: 'Pegue os doces', avoid: 'Fuja dos bichos' },
    facts: '50 segundos · 3 vidas · combos',
    start: 'Bora pegar doces →',
  },

  play: {
    score: 'Pontos',
    time: 'Tempo',
    lives: 'Vidas',
    livesAria: 'Vidas restantes: {n}',
    combo: 'Combo ×{n}',
    pause: 'Pausar',
    paused: 'Pausado',
    resume: 'Continuar',
    go: 'Já!',
    fieldAria: 'Área do jogo. Arraste, mova o mouse ou use as setas para mover o balde.',
  },

  result: {
    timeUp: 'Acabou o tempo!',
    outOfLives: 'Acabaram as vidas!',
    points: 'pontos',
    best: 'Recorde: {n}',
    newBest: 'Novo recorde!',
    caught: 'Doces pegos',
    streak: 'Maior combo',
    top: 'Top {n}%',
    beat: 'Melhor que {pct}% dos jogadores',
    beatAll: 'Melhor que todas as outras pontuações',
    others: 'Comparado com outras {n} pontuações',
    comparing: 'Comparando com outros jogadores…',
    retry: 'Jogar de novo',
    shareTitle: 'Jogo de pegar doces de Halloween',
    shareText: 'Fiz {score} pontos no jogo de pegar doces de Halloween 🍬 Você consegue me passar?',
  },

  og: {
    brand: '🍬 Pegar doces de Halloween',
    defaultKicker: 'Jogo arcade grátis',
    defaultTitle: 'Quantos doces você consegue pegar?',
    defaultDesc: 'Mova o balde · pegue os doces · 50 segundos',
  },

  faq: [
    { q: 'Como se joga?', a: 'Arraste o dedo na área do jogo, mova o mouse ou segure as setas ← → para mover o balde de abóbora. Pegue os doces que caem e fique longe das coisas assustadoras. Uma partida dura 50 segundos ou até você perder as três vidas.' },
    { q: 'Como funcionam os pontos e os combos?', a: 'Cada doce vale pontos, e os mais raros e caprichados valem mais. Pegue doces em sequência para aumentar o combo: quanto maior a sequência, maior o multiplicador. Deixar um doce cair ou pegar algo assustador zera o combo.' },
    { q: 'A porcentagem é de verdade?', a: 'Sim. No fim da partida, só a sua pontuação é enviada de forma anônima ao nosso servidor e comparada com a dos outros. A porcentagem só aparece quando há pontuações reais para comparar; se não houver, nada é mostrado.' },
    { q: 'Por que o jogo parou sozinho?', a: 'O jogo pausa sozinho quando você troca de aba ou de app, para você não perder vidas enquanto está fora. Toque em Continuar para seguir. Seu recorde fica salvo neste navegador.' },
  ],

  privacy: {
    title: 'Política de privacidade | Pegar doces de Halloween',
    description: 'Política de privacidade do jogo de pegar doces de Halloween: pontuações anônimas, cookies, anúncios e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O jogo de pegar doces de Halloween (o "Serviço") respeita sua privacidade e trata apenas o mínimo de informações descrito abaixo.',
    sections: [
      ['1. Informações coletadas', 'O Serviço funciona sem conta nem login. No fim de uma partida, só a sua pontuação (arredondada para a dezena) é enviada ao nosso servidor como uma contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seu recorde, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências em <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam apenas totais diários por idioma (visualizações, partidas iniciadas e concluídas, avaliações). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Em caso de dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política vale a partir de 30 de setembro de 2026.'],
    ],
    back: '← Voltar ao jogo de pegar doces de Halloween',
  },
};
