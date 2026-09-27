/* Roleta aleatória — Português brasileiro (/pt/)
 * Busca alvo: "roleta aleatória" / "sorteio online". title = "{busca} | {marca}".
 * Mesmas chaves dos outros arquivos de idioma. ui.presets deve manter as mesmas chaves e o mesmo número
 * de itens em todos os idiomas (verificado por check-roulette.js). Máximo de 24 caracteres por opção.
 * O FAQ só aparece na tela final compartilhada (abaixo dos botões de compartilhar) — nunca no início.
 */
module.exports = {
  siteName: 'Roleta aleatória',
  meta: {
    title: 'Roleta aleatória | Melgene Apps',
    description: 'Roleta aleatória grátis online. Escreva suas opções e gire — sem instalar, sem cadastro, pronta em um minuto. Inclui pesos e link para compartilhar.',
    ogTitle: 'Roleta aleatória — escreva suas opções e gire',
    ogDescription: 'Almoço, tarefas, desafios. Uma roleta online grátis e justa, direto no seu navegador.',
  },
  // Fonte de destaque para a faixa, o portal e o resultado (fontCss carrega, displayFont nomeia)
  fontCss: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
  displayFont: "'Dela Gothic One'",
  app: {
    name: 'Roleta aleatória',
    description: 'Uma roleta aleatória grátis online para escolher o almoço, tarefas, desafios ou um sorteio. Adicione de 2 a 16 opções com pesos opcionais e gire: o vencedor é escolhido de forma justa com aleatoriedade criptográfica. Compartilhe um link para a mesma roleta exata.',
  },
  hero: {
    h1: 'Roleta aleatória',
    tagline: 'Não consegue decidir? Escreva e gire.',
  },
  wheel: {
    spin: 'Girar',
    spinAria: 'Girar a roleta',
    share: 'Compartilhar',
    fair: 'O vencedor é sorteado no instante em que você aperta girar. A roleta só desacelera até parar nele.',
  },
  history: {
    title: 'Histórico de giros',
    clear: 'Limpar histórico',
  },
  editor: {
    title: 'Opções',
    presetsLabel: 'Início rápido',
    presets: { lunch: '🍕 Almoço', dare: '🎤 Desafios', duty: '🙋 Nomes', yesno: '👍 Sim/Não', numbers: '🔢 1–10' },
    add: 'Adicionar opção',
    shuffle: 'Embaralhar',
    weighted: 'Probabilidade ponderada',
    weightedHint: 'Quanto maior o número, maior a fatia e mais vezes ela sai.',
    themeLabel: 'Cores',
  },
  result: {
    kicker: 'A roleta escolheu',
    again: 'Girar de novo',
    removeAgain: 'Remover esta e girar de novo',
    close: 'Fechar',
  },
  // Aparece somente na tela final compartilhada (data-mg-end), como acordeão — nunca na tela inicial.
  faq: [
    { q: 'O resultado pode ser manipulado?', a: 'Não. O vencedor é sorteado com aleatoriedade criptográfica no instante em que você aperta girar, e a roleta só para nele. O momento do toque e a animação não têm nenhuma influência no resultado.' },
    { q: 'Como funciona a probabilidade ponderada?', a: 'A chance de cada opção é o seu peso (1–5) dividido pela soma de todos os pesos. Com pesos 2, 1 e 1, a primeira opção vence 50% das vezes e as outras 25% cada uma.' },
    { q: 'Quantas opções posso adicionar?', a: 'De 2 a 16. Cada opção pode ter até 24 caracteres; nomes longos encolhem ou são cortados com reticências quando a fatia é estreita.' },
    { q: 'Posso mandar minha roleta para alguém?', a: 'Sim. Compartilhar cria um link com suas opções, pesos e tema de cor codificados no endereço — nada fica salvo em servidor.' },
    { q: 'Preciso instalar um app ou me cadastrar?', a: 'Não. Funciona direto no navegador do celular, tablet ou computador, sem download nem cadastro.' },
  ],
  privacyLink: 'Política de privacidade',

  ui: {
    itemN: 'Opção {n}',
    wheelAria: 'Roleta com {n} fatias: {list}',
    ariaItem: 'Nome da opção {n}',
    ariaHandle: 'Reordenar opção {n} (seta para cima/baixo)',
    ariaDelete: 'Excluir opção {n}',
    ariaWeight: 'Opção {n}, peso {w}, aperte para mudar',
    count: '{n}/{max}',
    maxReached: 'Você pode adicionar até {max} opções',
    minReached: 'A roleta precisa de pelo menos 2 opções',
    soundOn: 'Som ativado',
    soundOff: 'Som desativado',
    announce: 'Resultado: {label}',
    historyItem: 'Giro {n}',
    restore: 'Restaurar {n} removidas',
    loadedShare: 'Roleta compartilhada carregada',
    badShare: 'Não foi possível abrir esse link', // o aviso fica em uma linha só (nowrap) — mantenha curto
    shareTitle: 'Gire minha roleta',
    shareText: 'Eu criei uma roleta — você gira?',
    themes: { candy: 'Doce', macaron: 'Macaron', circus: 'Circo', jewel: 'Joia' },
    presets: {
      lunch: ['Pizza', 'Feijoada', 'Coxinha', 'Churrasco', 'Pastel', 'Salada', 'Sushi', 'Hambúrguer'],
      dare: ['Cantar um refrão', '10 flexões', 'Imitar um sotaque', 'Pagar o café', 'Contar uma piada ruim', 'Dançar 15 segundos', 'Falar como pirata', 'Fazer uma careta'],
      duty: ['Helena', 'Miguel', 'Alice', 'Arthur', 'Laura', 'Heitor'],
      yesno: ['Sim', 'Não'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  },

  og: {
    badge: '🎡 Grátis online',
    title: 'Roleta aleatória',
    tag: 'Almoço, nomes, desafios: escreva e gire',
  },

  privacy: {
    title: 'Política de privacidade | Roleta aleatória',
    description: 'Política de privacidade da Roleta aleatória — como suas opções são armazenadas, cookies, publicidade e análises.',
    h1: 'Política de privacidade',
    introHtml: 'A Roleta aleatória (o "Serviço") respeita sua privacidade e processa apenas o mínimo de informações descritas abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta ou login. Suas opções da roleta, pesos, tema de cor e histórico de giros nunca são enviados a um servidor — eles ficam no seu navegador (armazenamento local e a URL). Algumas informações podem ser coletadas automaticamente enquanto você usa o Serviço, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies para exibir anúncios e entender como o Serviço é usado. Você pode recusar ou excluir cookies nas configurações do navegador; algumas funções podem não funcionar como esperado se você fizer isso.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base em suas visitas anteriores. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Análises', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam apenas totais diários por idioma (visualizações de página, giros, avaliações). Nada disso identifica você pessoalmente.'],
      ['5. Links compartilhados', 'Os links criados com "Compartilhar" contêm os nomes das opções, os pesos e o tema de cor que você digitou, codificados na URL. Evite digitar informações que possam identificar você pessoalmente.'],
      ['6. Contato', 'Para dúvidas sobre esta política, entre em contato com o operador do Serviço.'],
      ['7. Data de vigência', 'Esta política é válida a partir de 27 de setembro de 2026.'],
    ],
    back: '← Voltar para Roleta aleatória',
  },
};
