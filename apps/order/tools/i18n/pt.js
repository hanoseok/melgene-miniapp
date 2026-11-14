/* Sortear ordem — português do Brasil (/pt/). Mesma estrutura de chaves de en.js (veja o cabeçalho). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap',
    display: "'Bagel Fat One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Sortear ordem – ordem aleatória de uma lista de nomes',
    description: 'Sorteie a ordem grátis: cole os nomes ou use números de 1 a N e tenha uma ordem justa para apresentações, vez no jogo ou escala de limpeza. Sem cadastro, nada é enviado.',
    ogTitle: 'Sortear ordem 🔢 Quem começa?',
    ogDescription: 'Embaralhe uma lista de nomes numa ordem justa e revele carta por carta.',
  },
  siteName: 'Sortear ordem',
  privacyLink: 'Política de privacidade',

  hero: {
    h1Kicker: 'Sortear ordem',
    h1Html: 'Quem vai <em>primeiro?</em>',
    hook: 'Escreva os nomes, embaralhe uma vez e a ordem fica definida do primeiro ao último.',
  },

  ui: {
    presetLabel: 'A ordem é para quê?',
    modeLabel: 'Nomes ou números',
    modeNames: 'Nomes',
    modeNumbers: 'Números 1–N',
    namesLabel: 'Nomes, um por linha',
    namesPh: 'Ana\nGabriel\nJúlia\nPedro',
    namesHint: 'Cole uma lista do WhatsApp ou da planilha. Vírgulas também separam.',
    namesCount: '{n} / {max}',
    clear: 'Limpar',
    numbersLabel: 'Quantos?',
    numbersDec: 'Um a menos',
    numbersInc: 'Um a mais',
    numbersHint: 'Embaralha os números de 1 a N. Bom para número da chamada ou do lugar.',
    numberItem: 'nº {n}',
    fromLabel: 'Revelar a ordem',
    fromFirst: 'Do 1º',
    fromLast: 'Do último',
    shuffle: 'Sortear a ordem 🔀',
    fair: 'Embaralhado uma vez com aleatoriedade criptográfica · os nomes não saem do navegador',
  },

  presets: [
    { label: 'Ordem simples', heading: 'A ordem sorteada' },
    { label: 'Apresentações', heading: 'Ordem das apresentações' },
    { label: 'Vez no jogo', heading: 'Ordem de jogada' },
    { label: 'Limpeza', heading: 'Escala de limpeza' },
  ],

  errors: {
    namesFew: 'Escreva pelo menos 2 nomes, um por linha, ou mude para números.',
    namesMany: 'Use até 40 nomes.',
    numbersRange: 'Escolha um número de 2 a 40.',
    badLink: 'Este link está quebrado ou incompleto, então nada é mostrado.',
  },

  reveal: {
    progress: '{k} de {n} revelados',
    tapHint: 'Toque na carta ou em “Próximo”. A ordem foi definida na hora de embaralhar.',
    first: 'Revelar ▶',
    next: 'Próximo ▶',
    done: 'Ver a ordem completa',
    auto: 'Automático',
    autoStop: 'Pausar',
    showAll: 'Mostrar tudo',
    soFar: 'Revelados até agora',
    live: 'Número {k}: {who}',
  },

  result: {
    sharedBadge: '🔢 Ordem compartilhada',
    sharedNote: 'Esta é a ordem salva no link. Ela não foi embaralhada de novo.',
    summary: '{n} no total, do primeiro ao último',
    copy: 'Copiar como texto',
    copied: 'Ordem copiada',
    copyLink: 'Copiar link',
    linkCopied: 'Link copiado. Quem abrir vê exatamente esta ordem.',
    linkTooLong: 'A lista é longa demais para um link, então só o endereço da página foi copiado.',
    edit: 'Mudar nomes',
    again: 'Sortear de novo 🔀',
    againShared: 'Sortear de novo / Fazer o meu 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: 'Sortear ordem',
    shareText: 'Esta é a nossa ordem, sorteada na hora 🔢',
  },

  og: {
    brand: '🔢 Sortear ordem',
    kicker: 'Apresentações · jogos · limpeza',
    title: 'Quem começa? Sorteie uma ordem justa',
    desc: 'Coloque os nomes e a ordem sai em segundos',
  },

  faq: [
    { q: 'O sorteio é justo mesmo?', a: 'Sim. Quando você toca em sortear, o gerador aleatório criptográfico do navegador (crypto.getRandomValues) faz um embaralhamento de Fisher–Yates com amostragem por rejeição, então toda ordem possível tem a mesma chance. A ordem inteira é definida nesse momento; as cartas só mostram.' },
    { q: 'Qual a diferença para sortear um ganhador?', a: 'O sorteio de ganhador para em um nome só. Aqui todo mundo ganha uma posição do primeiro ao último, que é o que você precisa para apresentações, vez no jogo, ordem de fala ou escala de limpeza.' },
    { q: 'Revelar do primeiro ou do último?', a: 'Do primeiro é mais rápido quando todos precisam se preparar. Do último dá mais suspense, porque quem vai primeiro só aparece no fim.' },
    { q: 'Os nomes ficam salvos ou são enviados?', a: 'Não. Os nomes ficam no seu navegador. Só a última lista é guardada neste aparelho para você reutilizar, e um link compartilhado leva a ordem apenas para quem você enviar.' },
  ],

  privacy: {
    title: 'Política de privacidade | Sortear ordem',
    description: 'Política de privacidade do Sortear ordem: nomes e ordens ficam no seu navegador; cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'Sortear ordem (o "Serviço") respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações coletadas', 'O Serviço funciona sem conta nem login. Os nomes ou números que você digita e a ordem sorteada são processados só no seu navegador e não são enviados ao nosso servidor. A sua última lista fica guardada no armazenamento local do navegador, no seu aparelho. Quando você copia um link, a ordem é escrita no próprio link e é compartilhada só com as pessoas para quem você enviar.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar idioma e configurações, exibir anúncios e entender como é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; alguns recursos podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios agregados que guardam só totais diários por idioma (visualizações, sorteios iniciados e concluídos). Nada disso identifica você.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale a partir de 15 de novembro de 2026.'],
    ],
    back: '← Voltar ao Sortear ordem',
  },
};
