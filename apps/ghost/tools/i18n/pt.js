/* Crie seu fantasminha de Halloween — português do Brasil (/pt/)
 * Mesma estrutura de chaves de en.js. Desenhos e quantidade de peças ficam em ghost-core.js.
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
    title: 'Crie seu fantasminha de Halloween',
    description: 'Crie seu fantasminha de Halloween: escolha o formato, os olhos, a boca e o chapéu e monte um fantasma fofo do seu jeito. Grátis, sem baixar nada, pronto em 1 minuto.',
    ogTitle: 'Crie seu fantasminha de Halloween 👻',
    ogDescription: 'Seu fantasminha fofo em um minuto: ele flutua e você pode mandar para os amigos.',
  },
  siteName: 'Crie seu fantasminha',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '👻 Especial de Halloween',
    h1Kicker: 'Crie seu fantasminha',
    h1Html: 'Crie seu próprio<br><em>fantasminha</em>',
    hook: 'Tem alguém tímido escondido debaixo desse lençol. Dê uma carinha e um pouco de personalidade e veja ele flutuar.',
    start: 'Criar meu fantasminha →',
  },

  editor: {
    title: 'Monte seu fantasminha',
    hint: 'Dica: toque no fantasminha para ver o próximo',
    previewAria: 'Seu fantasminha. Toque para ver a próxima opção',
    tabsAria: 'Partes do fantasminha',
    tabs: { body: 'Corpo', color: 'Cor', eyes: 'Olhos', mouth: 'Boca', cheeks: 'Bochechas', hat: 'Chapéu', item: 'Na mão', bg: 'Cenário' },
    optionAria: '{part} {n}',
    nameLabel: 'Dê um nome (opcional)',
    namePlaceholder: 'ex.: Bubu',
    random: 'Aleatório',
    done: 'Pronto!',
  },

  result: {
    eyebrowMine: 'Seu fantasminha está pronto para assombrar!',
    eyebrowFriend: 'Alguém criou este fantasminha para você',
    untitled: 'Meu fantasminha',
    imageAlt: 'Fantasminha: {name}',
    save: 'Salvar imagem',
    saving: 'Criando sua imagem…',
    saved: 'Imagem salva!',
    saveFail: 'Não deu para criar a imagem. Tente um print da tela.',
    edit: 'Continuar editando',
    retry: 'Criar outro fantasminha',
    retryFriend: 'Criar meu fantasminha',
    shareTitle: 'Crie seu fantasminha de Halloween',
    shareText: 'Olha meu fantasminha “{name}” 👻 Crie o seu também!',
    shareTextNoName: 'Criei meu próprio fantasminha 👻 Crie o seu também!',
    fileName: 'meu-fantasminha',
  },

  og: {
    brand: '👻 Crie seu fantasminha',
    defaultKicker: 'Fantasminha de Halloween',
    defaultTitle: 'Crie seu próprio fantasminha',
    defaultDesc: 'Carinhas, chapéus e amiguinhos · grátis',
  },

  faq: [
    { q: 'Como eu crio meu fantasminha?', a: 'Escolha uma aba no alto do editor e toque na opção que você curtir. Tocar no próprio fantasminha passa para a próxima opção daquela aba, e “Aleatório” mistura tudo. Quando estiver do seu jeito, toque em “Pronto!”.' },
    { q: 'Dá para salvar o fantasminha como imagem?', a: 'Dá. “Salvar imagem” transforma seu fantasminha em PNG. No celular você guarda na galeria pelo menu de compartilhar; no computador ele é baixado.' },
    { q: 'Como funciona o link de compartilhar?', a: 'O fantasminha inteiro, com nome e tudo, vai dentro do próprio link. Quem abrir vê exatamente o mesmo fantasminha e depois pode criar o seu. Nada fica salvo nos nossos servidores.' },
    { q: 'Por que meu fantasminha fica subindo e descendo?', a: 'Porque fantasma flutua! Esse movimento leve só existe na tela. Se o seu aparelho estiver com a opção de reduzir movimento ligada, ele fica parado, e a imagem salva é sempre parada.' },
  ],

  privacy: {
    title: 'Política de privacidade | Crie seu fantasminha',
    description: 'Política de privacidade do Crie seu fantasminha: como seu desenho é tratado, cookies, publicidade e estatísticas anônimas.',
    h1: 'Política de privacidade',
    introHtml: 'O Crie seu fantasminha (o "Serviço") respeita sua privacidade e processa apenas o mínimo de informações descritas abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta ou login. Seu fantasminha e o nome dele nunca são enviados a um servidor: eles ficam no seu navegador (e na URL quando você compartilha). Algumas informações podem ser coletadas automaticamente enquanto você usa o Serviço, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies para exibir anúncios e entender como o Serviço é usado. Você pode recusar ou excluir cookies nas configurações do navegador; algumas funções podem não funcionar como esperado se você fizer isso.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base em suas visitas anteriores. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam apenas totais diários por idioma (visualizações de página, fantasminhas concluídos, avaliações). Nada disso identifica você pessoalmente.'],
      ['5. Links compartilhados e imagens', 'Os links criados com "Compartilhar" contêm o seu desenho e o nome que você digitou, codificados na URL. As imagens salvas são criadas no seu navegador. Evite usar como nome informações que possam identificar você pessoalmente.'],
      ['6. Contato', 'Para dúvidas sobre esta política, entre em contato com o operador do Serviço.'],
      ['7. Data de vigência', 'Esta política é válida a partir de 1º de outubro de 2026.'],
    ],
    back: '← Voltar para o Crie seu fantasminha',
  },
};
