/* Corrida de animais — português do Brasil. Mesma estrutura de chaves do en.js. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Corrida de animais – sorteio com corrida online',
    description: 'Sorteio com corrida de animais: digite de 2 a 10 nomes e cada um corre na sua raia. O primeiro vence ou o último paga o café. Sorteio justo, grátis e sem cadastro.',
    ogTitle: 'Corrida de animais 🏁 Quem paga o café?',
    ogDescription: 'Digite os nomes, coloque os bichinhos na largada e deixe a corrida decidir. O primeiro vence ou o último paga.',
  },
  siteName: 'Corrida de animais',
  privacyLink: 'Política de privacidade',

  hero: {
    h1Kicker: 'Corrida de animais',
    h1Html: 'Ninguém consegue decidir?<br><em>Deixa os bichos correrem</em>',
    hook: 'Quem paga o café? Quem começa? Coloque todo mundo numa raia e assista à corrida.',
  },

  ui: {
    modeLabel: 'Como vamos decidir?',
    modeWin: '🏆 O 1º vence',
    modeLose: '☕ O último paga',
    countLabel: 'Corredores',
    countValue: '{n} corredores',
    less: 'Menos corredores',
    more: 'Mais corredores',
    namesLabel: 'Quem vai correr?',
    namesHint: 'Raia vazia usa o nome padrão. O bichinho é só pela graça e não muda a chance de ninguém.',
    playerN: 'Jogador {n}',
    nameAria: 'Nome da raia {n}',
    start: 'Largar! 🏁',
    fair: 'A ordem de chegada é sorteada com aleatório crypto antes da largada · os nomes ficam no seu aparelho',
    trackAria: 'Pista de corrida',
    go: 'JÁ!',
    bannerWin: '🏆 Quem cruzar a linha primeiro vence',
    bannerLose: '☕ Quem chegar por último paga',
    liveStart: 'Três, dois, um, já! A corrida começou.',
  },

  errors: {
    tooFew: 'Precisa de pelo menos 2 corredores.',
    tooMany: 'Cabem no máximo 10 corredores na pista.',
    badLink: 'Este link está quebrado, nenhum nome foi carregado.',
  },

  result: {
    winKicker: 'E quem venceu foi',
    winTitle: '{name} venceu! 🏆',
    winSub: 'Primeiro a cruzar a linha de chegada.',
    loseKicker: 'Último a cruzar a linha',
    loseTitle: '{name} chegou por último',
    loseSub: 'Que azar! Essa rodada de café é por conta de {name} ☕',
    rankingTitle: 'Ordem de chegada',
    tagWin: 'Venceu',
    tagLose: 'Paga ☕',
    edit: 'Trocar nomes',
    shareNames: 'Copiar link com esses nomes',
    linkCopied: 'Link copiado. Ele abre os mesmos corredores, prontos para largar.',
    sharedNote: 'Corredores carregados de um link compartilhado. É só largar!',
    history: 'Últimas corridas',
    historyClear: 'Limpar',
    historyWin: '🏆 {name}',
    historyLose: '☕ {name}',
    historyMeta: '{n} corredores',
    liveWin: '{name} venceu a corrida.',
    liveLose: '{name} chegou em último.',
    again: 'Correr de novo 🏁',
    shareTitle: 'Corrida de animais',
    shareText: 'Ninguém consegue decidir? Deixa os bichos correrem 🏁',
  },

  og: {
    brand: '🏁 Corrida de animais',
    kicker: 'Sorteio com corrida · de 2 a 10',
    title: 'Deixe a corrida de bichos decidir',
    desc: 'O primeiro vence, ou o último paga o café',
  },

  faq: [
    { q: 'A corrida é aleatória e justa de verdade?', a: 'Sim. Na hora em que você larga, a ordem de chegada inteira é sorteada com o gerador aleatório criptográfico do navegador (crypto.getRandomValues), amostragem por rejeição e um embaralhamento de Fisher-Yates. Toda ordem tem exatamente a mesma chance; a corrida na tela só encena o resultado.' },
    { q: 'O bichinho ou a raia mudam a minha chance?', a: 'Não. Os bichinhos são distribuídos por raia só pela graça. Aqui o coelho não é mais rápido que a tartaruga, e a raia 1 tem a mesma chance que a raia 10.' },
    { q: 'Por que as chegadas são sempre tão apertadas?', a: 'Para dar emoção. Depois do sorteio, a animação coloca arrancadas, tropeços e uma chegada no photochart no lugar que importa, o primeiro ou o último, dependendo do modo. A encenação nunca muda a ordem.' },
    { q: 'Posso mandar os mesmos corredores para os amigos?', a: 'Pode. “Copiar link com esses nomes” coloca no link só os nomes e o modo, nunca um resultado. Quem abrir faz uma corrida nova. Seus últimos resultados ficam só neste aparelho.' },
  ],

  privacy: {
    title: 'Política de privacidade | Corrida de animais',
    description: 'Política de privacidade da Corrida de animais: nomes e resultados ficam no seu navegador, cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'A Corrida de animais (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações coletadas', 'O Serviço funciona sem conta nem login. Os nomes que você digita são processados só no seu navegador e não são enviados ao nosso servidor. Sua última lista de nomes e seus dez últimos resultados podem ficar guardados no armazenamento local do navegador, no seu aparelho. Quando você copia um link com nomes, eles vão dentro do próprio link e só chegam às pessoas para quem você enviar.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar idioma e configurações, exibir anúncios e entender como ele é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar direito.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e ajuste suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam só totais diários por idioma (visualizações de página, corridas iniciadas e terminadas, notas). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale a partir de 22 de outubro de 2026.'],
    ],
    back: '← Voltar para Corrida de animais',
  },
};
