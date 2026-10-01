/* Jogo da melancia – Halloween (Suika Game) — português do Brasil (/pt/, og:locale pt_BR)
 * Mesma estrutura de chaves de en.js. Regras, níveis e pontos em merge-core.js. Tratamento por "você".
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
    title: 'Jogo da melancia – Halloween (Suika Game) grátis',
    description: 'O jogo da melancia na versão Halloween: solte doces no pote, junte os pares iguais em algo maior e chegue à abóbora gigante. Grátis, sem baixar nada.',
    ogTitle: 'Jogo da melancia – Halloween 🎃 Até onde você chega?',
    ogDescription: 'Solte, combine, junte. Não passe da linha e veja até onde você consegue ir.',
  },
  siteName: 'Jogo da melancia – Halloween',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🎃 Halloween · quebra-cabeça de juntar',
    h1Kicker: 'Jogo da melancia – Halloween',
    h1Html: 'Até onde chega<br>a sua <em>fusão</em>?',
    hook: 'Solte guloseimas no pote. Quando duas iguais se encostam, viram algo maior — só não deixe a pilha passar da linha.',
    how: { aim: 'Mire e solte', match: 'Junte duas iguais', line: 'Fique abaixo da linha' },
    facts: 'Sem cronômetro · no seu ritmo',
    start: 'Começar a juntar →',
  },

  play: {
    score: 'Pontos',
    best: 'Recorde',
    next: 'Próximo',
    nextAria: 'Próxima peça: {name}',
    pause: 'Pausar',
    paused: 'Pausado',
    resume: 'Continuar',
    full: 'Pote cheio!',
    chainAria: 'Ordem de fusão da menor peça até a maior',
    fieldAria: 'Pote do jogo. Mova ou arraste para mirar e solte o dedo ou clique para soltar a peça. Setas para mirar, Espaço para soltar.',
  },

  result: {
    full: 'O pote transbordou!',
    points: 'pontos',
    best: 'Recorde: {n}',
    newBest: 'Novo recorde!',
    biggest: 'Maior peça',
    merges: 'Fusões',
    top: 'Top {n}%',
    beat: 'Melhor que {pct}% dos jogadores',
    beatAll: 'Melhor que todas as outras pontuações',
    others: 'Comparado com outras {n} pontuações',
    comparing: 'Comparando com outros jogadores…',
    retry: 'Jogar de novo',
    shareTitle: 'Jogo da melancia – Halloween',
    shareText: 'Fiz {score} pontos no jogo da melancia de Halloween 🎃 Consegue me passar?',
  },

  tiers: ['Bala de milho', 'Bala', 'Pirulito', 'Castanha', 'Maçã', 'Cogumelo', 'Morcego', 'Fantasma', 'Bola de cristal', 'Abóbora', 'Abóbora-lanterna'],

  og: {
    brand: '🎃 Jogo da melancia – Halloween',
    defaultKicker: 'Jogo de juntar de Halloween grátis',
    defaultTitle: 'Até onde chega a sua fusão?',
    defaultDesc: 'Solte · junte duas iguais · cresça',
  },

  faq: [
    { q: 'Como jogar?', a: 'Mova o dedo ou o mouse sobre o pote para mirar e solte (ou clique) para deixar a peça cair. Você também pode mirar com as setas e soltar com Espaço. Quando duas peças iguais se encostam, elas viram uma peça do tamanho seguinte.' },
    { q: 'Quando o jogo acaba?', a: 'Não tem cronômetro. O jogo acaba quando a pilha fica uns dois segundos acima da linha tracejada lá em cima, então deixe espaço e planeje suas fusões.' },
    { q: 'Como funciona a pontuação?', a: 'Cada fusão vale pontos, e as maiores valem mais. Reações em cadeia fazem a pontuação subir bem rápido.' },
    { q: 'O top % é de verdade?', a: 'Sim. No fim da partida, só a sua pontuação é enviada de forma anônima ao nosso servidor e comparada com a dos outros. O top % só aparece quando há pontuações reais para comparar; se não, nada é mostrado. O jogo também pausa sozinho quando você troca de aba.' },
  ],

  privacy: {
    title: 'Política de privacidade | Jogo da melancia – Halloween',
    description: 'Política de privacidade do jogo da melancia de Halloween: pontuações anônimas, cookies, anúncios e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Jogo da melancia – Halloween (o "Serviço") respeita sua privacidade e trata apenas o mínimo de informações descrito abaixo.',
    sections: [
      ['1. Informações coletadas', 'O Serviço funciona sem conta nem login. No fim de uma partida, só a sua pontuação (arredondada para a dezena) é enviada ao nosso servidor como uma contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seu recorde, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências em <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam apenas totais diários por idioma (visualizações, partidas iniciadas e concluídas, avaliações). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Em caso de dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política vale a partir de 2 de outubro de 2026.'],
    ],
    back: '← Voltar ao Jogo da melancia – Halloween',
  },
};
