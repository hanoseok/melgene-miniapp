/* Sorteio de penitência (Penalty Card Flip) — português do Brasil (/pt/ ; o idioma vem do cookie ou da preferência salva)
 * A lógica está em penalty-core.js; todos os textos visíveis estão aqui. Chaves que terminam em Html aceitam HTML (só <br>, <em>, <a>).
 * Telas: início (chamada + botão + anúncio) → ajustes (pessoas, cartas de penitência, penitências, nomes) → virar (cartas viradas para baixo) → fim (quem pega a penitência + tela final comum).
 * A FAQ aparece só na tela final comum. Mantenha os marcadores {n} {k} como estão.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap',
    display: "'Baloo 2'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Sorteio de penitência – cartas para festa e bebida',
    description: 'Jogo grátis de cartas para sortear penitências em festas e noites de bebida. Escolha quantas pessoas e cartas de penitência, depois vire as cartas uma por uma. Sem cadastro.',
    ogTitle: 'Sorteio de penitência 🃏 Vire a carta e descubra a penitência',
    ogDescription: 'Sorteio justo de penitências para festas, embaralhado no seu navegador.',
  },
  siteName: 'Sorteio de penitência',
  privacyLink: 'Política de privacidade',

  hero: {
    h1Kicker: 'Sorteio de penitência',
    h1Html: 'Vire as cartas,<br><em>descubra a penitência</em>',
    hook: 'Uma carta virada para baixo por pessoa. Algumas escondem uma penitência, e as outras estão salvas. Quem vai pagar dessa vez?',
  },

  ui: {
    playersLabel: 'Quantas pessoas?',
    playersDec: 'Uma pessoa a menos',
    playersInc: 'Uma pessoa a mais',
    penaltyLabel: 'Quantas cartas de penitência?',
    penaltyDec: 'Uma carta de penitência a menos',
    penaltyInc: 'Uma carta de penitência a mais',
    penaltyHint: 'Começa em cerca de um terço das pessoas. Você pode mudar.',
    itemsLabel: 'Lista de penitências',
    itemsHint: 'Uma penitência por linha. As cartas de penitência sorteiam desta lista em ordem aleatória. Edite à vontade.',
    itemsPh: 'Cantar uma música\nFazer um brinde',
    resetItems: 'Voltar às penitências de exemplo',
    itemsCount: '{count} linhas',
    namesBtn: '+ Adicionar nomes (opcional)',
    namesLabel: 'Nomes, na ordem da vez',
    namesPh: 'Ana\nBruno\nLuíza',
    namesHint: 'Se deixar vazio, as vezes aparecem como 1º, 2º, 3º. Pode ter menos nomes que pessoas.',
    start: 'Embaralhar as cartas 🃏',
    begin: 'Começar',
    setupTitle: 'Ajustes da partida',
    fair: 'Embaralhado uma vez com aleatoriedade criptográfica · nada sai do seu navegador',
  },

  errors: {
    playersRange: 'Escolha entre 2 e 12 pessoas.',
    penaltiesRange: 'As cartas de penitência vão de 1 até o número de pessoas.',
    itemsEmpty: 'Escreva pelo menos uma penitência.',
    itemsTooMany: 'Use no máximo 30 penitências.',
    namesTooMany: 'Há mais nomes do que pessoas. Remova um nome ou adicione uma pessoa.',
    badLink: 'Este link de resultado está quebrado ou incompleto, então não há nada para mostrar.',
  },

  draw: {
    progress: '{done}/{n} viradas',
    left: '{n} cartas restantes',
    turn: 'Próxima vez: {who}',
    turnNum: 'Vez {k}',
    numbered: 'Pessoa {k}',
    pick: 'Toque em qualquer carta virada para baixo. Todas já estavam definidas ao embaralhar.',
    gridAria: 'Cartas de penitência viradas para baixo',
    cardAria: 'Carta {k}, virada para baixo',
    penaltyTag: 'Penitência!',
    safeTag: 'Salvo',
    revealPenalty: '{who}: {text}',
    revealSafe: '{who} está salvo desta vez',
    revealNone: 'Toque em uma carta para ver o resultado aqui.',
    flipAll: 'Virar todas',
    reshuffle: 'Embaralhar de novo',
    seeResults: 'Ver os resultados',
    done: 'Todas as cartas foram viradas.',
    live: '{who}: {text}',
    liveSafe: '{who}: salvo',
  },

  result: {
    heading: 'Quem pega a penitência',
    sharedBadge: '🃏 Resultado compartilhado',
    sharedNote: 'Este é o resultado salvo no link. Ele não é embaralhado de novo.',
    summary: '{k} penitência · {s} salvos',
    summaryMany: '{k} penitências · {s} salvos',
    listHead: 'Penitências desta rodada',
    safeList: 'Salvos: {names}',
    copy: 'Copiar como texto',
    copied: 'Resultado copiado',
    copyLink: 'Copiar link',
    linkCopied: 'Link copiado. Quem abrir vai ver exatamente este resultado.',
    again: 'Tente você também',
    edit: 'Mudar os ajustes',
    textTitle: '🃏 Resultado do Sorteio de penitência',
    textSafe: 'salvo',
    shareTitle: 'Sorteio de penitência',
    shareText: 'Vire as cartas e sorteie a penitência da festa 🃏',
  },

  og: {
    brand: '🃏 Sorteio de penitência',
    kicker: 'Penitências de festa · uma carta por vez',
    title: 'Sorteie a penitência virando cartas',
    desc: 'Aleatório, justo e pronto em segundos',
    sample: 'Cantar uma música',
  },

  defaults: [
    'Cantar uma música (só o refrão já vale)',
    'Fazer um brinde em uma frase',
    'Fazer uma pose superfofa',
    'Servir água para a pessoa à sua esquerda',
    'Dançar robô por 10 segundos',
    'Se apresentar de novo com mais uma frase',
    'Tocar a música escolhida pela pessoa à sua direita',
    'Contar uma piada sobre você mesmo',
    'Ler a próxima frase com voz de trailer de cinema',
    'Adivinhar de primeira a música favorita da próxima pessoa',
  ],

  faq: [
    { q: 'O embaralhamento é mesmo justo?', a: 'Sim. Ao embaralhar, as cartas são distribuídas uma única vez pelo gerador de números aleatórios criptográfico do seu navegador (crypto.getRandomValues), com amostragem por rejeição e embaralhamento de Fisher–Yates. Tudo fica definido naquele momento, então não importa qual carta alguém toca.' },
    { q: 'Como são escolhidos os textos das penitências?', a: 'Cada carta de penitência pega uma linha da sua lista em ordem aleatória. Se houver menos linhas do que cartas de penitência, a lista embaralhada é usada de novo. Ajuste as linhas antes de embaralhar para combinar com o seu grupo.' },
    { q: 'Dá para recusar uma penitência?', a: 'Dá. As penitências são para se divertir e são sempre opcionais. Se alguém não quiser fazer, o grupo pode trocar por uma mais leve.' },
    { q: 'Como compartilho o resultado com o grupo?', a: 'Na tela de resultados, toque em “Copiar como texto” para colar a lista no chat, ou em “Copiar link”. O link guarda exatamente este resultado: quem abrir vê as mesmas cartas, sem um novo sorteio.' },
  ],

  privacy: {
    title: 'Política de privacidade | Sorteio de penitência',
    description: 'Política de privacidade do Sorteio de penitência: nomes, penitências e resultados ficam no seu navegador; cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Sorteio de penitência (o «Serviço») respeita a sua privacidade e trata apenas o mínimo de informações descrito abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta nem login. Os nomes, as penitências e os resultados que você digita são processados somente no seu navegador e não são enviados ao nosso servidor. Seus últimos ajustes ficam no armazenamento local do navegador, no seu dispositivo, e você pode apagá-los quando quiser. Quando você copia um link de resultado, nomes, penitências e resultados são gravados no próprio link e ficam visíveis apenas para as pessoas a quem você o enviar.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o idioma e os ajustes, exibir anúncios e entender como o Serviço é usado. Você pode recusar ou apagar essas informações nas configurações do navegador; se fizer isso, alguns recursos podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para veicular anúncios com base em visitas anteriores a este site e a outros. Saiba mais e altere suas preferências em <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios, que guardam apenas totais diários por idioma (visualizações, partidas iniciadas e concluídas). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política está em vigor desde 11 de novembro de 2026.'],
    ],
    back: '← Voltar ao Sorteio de penitência',
  },
};
