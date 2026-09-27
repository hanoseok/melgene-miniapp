/* Esculpir abóbora de Halloween online — português do Brasil (/pt/, og:locale pt_BR)
 * Mesma estrutura de chaves de en.js. Desenhos e quantidade de peças ficam em pumpkin-core.js.
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
    title: 'Esculpir abóbora de Halloween online',
    description: 'Esculpir abóbora de Halloween online: escolha olhos, nariz e boca, acenda a vela e crie sua própria abóbora iluminada. Grátis, sem baixar nada, em um minuto.',
    ogTitle: 'Esculpir abóbora de Halloween online 🎃',
    ogDescription: 'Crie sua abóbora de Halloween em um minuto, acenda a vela e mande para um amigo.',
  },
  siteName: 'Abóbora de Halloween',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🎃 Especial de Halloween',
    h1Kicker: 'Esculpir abóbora de Halloween',
    h1Html: 'Esculpa sua<br><em>abóbora</em> de Halloween',
    hook: 'Sem faca e sem sujeira. Dê uma cara para sua abóbora, acenda a vela e veja ela brilhar.',
    start: 'Começar a esculpir →',
  },

  editor: {
    title: 'Esculpa sua abóbora',
    hint: 'Dica: toque na abóbora para ver a próxima opção',
    previewAria: 'Sua abóbora. Toque para ver a próxima opção',
    tabsAria: 'Partes da abóbora',
    tabs: { shape: 'Formato', color: 'Cor', eyes: 'Olhos', nose: 'Nariz', mouth: 'Boca', stem: 'Cabinho', extra: 'Extras' },
    optionAria: '{part} {n}',
    glow: 'Vela',
    night: 'Noite',
    nameLabel: 'Dê um nome à abóbora (opcional)',
    namePlaceholder: 'ex.: Seu Sorrisão',
    random: 'Aleatório',
    done: 'Pronto!',
  },

  result: {
    eyebrowMine: 'Sua abóbora de Halloween está pronta!',
    eyebrowFriend: 'Um amigo esculpiu esta abóbora para você',
    untitled: 'Minha abóbora',
    imageAlt: 'Abóbora de Halloween: {name}',
    save: 'Salvar imagem',
    saving: 'Criando a imagem…',
    saved: 'Imagem salva!',
    saveFail: 'Não deu para criar a imagem. Tire um print da tela.',
    edit: 'Continuar editando',
    retry: 'Esculpir outra abóbora',
    retryFriend: 'Esculpir a minha abóbora',
    shareTitle: 'Esculpir abóbora de Halloween online',
    shareText: 'Esculpi uma abóbora de Halloween chamada “{name}” 🎃 Esculpa a sua também!',
    shareTextNoName: 'Esculpi minha própria abóbora de Halloween 🎃 Esculpa a sua também!',
    fileName: 'minha-abobora',
  },

  og: {
    brand: '🎃 Abóbora de Halloween',
    defaultKicker: 'Esculpir abóbora online',
    defaultTitle: 'Esculpa sua abóbora de Halloween',
    defaultDesc: 'Olhos, nariz, boca e luz de vela · grátis no navegador',
  },

  faq: [
    { q: 'Como eu esculpo minha abóbora?', a: 'Escolha uma aba (formato, cor, olhos, nariz, boca, cabinho ou extras) e toque numa opção. Tocar na própria abóbora passa para a próxima opção, e “Aleatório” mistura tudo. Quando gostar, toque em “Pronto!”.' },
    { q: 'Dá para salvar minha abóbora como imagem?', a: 'Dá, sim. “Salvar imagem” transforma sua abóbora em um PNG. No celular, você salva na galeria pelo menu de compartilhar; no computador, ela é baixada.' },
    { q: 'Como funciona o link de compartilhar?', a: 'Todo o seu desenho, com o nome, fica guardado dentro do próprio link. Quem abrir vê exatamente a mesma abóbora e depois pode esculpir a sua. Nada fica salvo nos nossos servidores.' },
    { q: 'Para que servem os botões Vela e Noite?', a: 'A vela faz as partes esculpidas brilharem com uma luz quentinha, como uma vela de verdade lá dentro. Desligue para um visual de dia. O botão Noite troca o fundo entre um céu estrelado e um fundo claro.' },
  ],

  privacy: {
    title: 'Política de privacidade | Abóbora de Halloween',
    description: 'Política de privacidade da Abóbora de Halloween: como seu desenho é tratado, cookies, publicidade e estatísticas anônimas.',
    h1: 'Política de privacidade',
    introHtml: 'A Abóbora de Halloween (o "Serviço") respeita sua privacidade e processa apenas o mínimo de informações descritas abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta ou login. Sua abóbora e o nome dela nunca são enviados a um servidor: eles ficam no seu navegador (e na URL quando você compartilha). Algumas informações podem ser coletadas automaticamente enquanto você usa o Serviço, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies para exibir anúncios e entender como o Serviço é usado. Você pode recusar ou excluir cookies nas configurações do navegador; algumas funções podem não funcionar como esperado se você fizer isso.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base em suas visitas anteriores. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam apenas totais diários por idioma (visualizações de página, abóboras concluídas, avaliações). Nada disso identifica você pessoalmente.'],
      ['5. Links compartilhados e imagens', 'Os links criados com "Compartilhar" contêm o seu desenho e o nome que você digitou, codificados na URL. As imagens salvas são criadas no seu navegador. Evite usar como nome informações que possam identificar você pessoalmente.'],
      ['6. Contato', 'Para dúvidas sobre esta política, entre em contato com o operador do Serviço.'],
      ['7. Data de vigência', 'Esta política é válida a partir de 28 de setembro de 2026.'],
    ],
    back: '← Voltar para Abóbora de Halloween',
  },
};
