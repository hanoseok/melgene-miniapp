/* Cara ou coroa — português do Brasil (você). Mesma estrutura de en.js (veja os comentários). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Cara ou coroa online: jogar a moeda',
    description: 'Não consegue decidir? Jogue uma moeda online, cara ou coroa, e deixe a sorte escolher. Dê você mesmo o nome aos dois lados ou role de um a três dados. Grátis e sem cadastro.',
    ogTitle: 'Cara ou coroa 🪙 Moeda e dados',
    ogDescription: 'Jogue a moeda ou role os dados e deixe a sorte decidir.',
  },
  siteName: 'Cara ou coroa',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🪙 O desempate mais justo',
    h1Kicker: 'Cara ou coroa',
    h1Html: 'Cara ou coroa?<br>Deixe a <em>moeda</em> decidir',
    hook: 'Dê nome às suas duas opções, jogue a moeda e fique com o que cair. Dá para rolar dados também.',
    facts: 'Moeda e dados · lados com o seu nome · um lançamento justo toda vez',
    start: 'Jogar →',
  },

  tool: {
    title: 'Hora de jogar',
    tabCoin: 'Moeda',
    tabDice: 'Dados',
    namesLabel: 'Dê nome aos dois lados',
    namesHint: 'Por padrão são cara e coroa. Troque pelas suas opções, como pizza e sushi.',
    sideA: 'Cara',
    sideB: 'Coroa',
    fieldA: 'Nome do primeiro lado',
    fieldB: 'Nome do segundo lado',
    throwCoin: 'Jogar a moeda 🪙',
    diceLabel: 'Quantos dados?',
    rollDice: 'Rolar os dados 🎲',
  },

  count: { one: '{n} lançamento nesta sessão', other: '{n} lançamentos nesta sessão' },
  countDice: { one: '{n} rolagem nesta sessão', other: '{n} rolagens nesta sessão' },

  result: {
    titleCoin: 'Deu',
    titleDice: 'Você tirou',
    sum: 'Total {n}',
    tallyTitle: 'Esta sessão',
    tallySide: '{name} {n}',
    againCoin: 'Jogar de novo',
    againDice: 'Rolar de novo',
    change: 'Voltar ao lançamento',
    shareTitle: 'Cara ou coroa online',
    shareTextCoin: 'Joguei uma moeda e deu {name} 🪙',
    shareTextDice: 'Rolei os dados e tirei {n} 🎲',
  },

  og: {
    brand: '🪙 Cara ou coroa',
    kicker: 'Cara ou coroa · moeda e dados',
    title: 'Cara ou coroa?',
    desc: 'Jogue a moeda ou role os dados · um lançamento justo decide',
  },

  faq: [
    { q: 'Como funciona o cara ou coroa?', a: 'Se quiser, dê nome aos dois lados e toque em jogar. O resultado é sorteado primeiro e a moeda gira só para mostrá-lo, então o que você vê é sempre o resultado real. Na aba Dados você rola de um a três dados de seis faces.' },
    { q: 'O lançamento é mesmo justo?', a: 'Sim. O resultado vem do gerador aleatório criptográfico do seu navegador (crypto.getRandomValues) com amostragem por rejeição, então cara e coroa têm exatamente a mesma chance, assim como cada face do dado. A animação é só enfeite.' },
    { q: 'Posso usar minhas próprias opções no lugar de cara e coroa?', a: 'Pode. Digite dois nomes quaisquer nos campos acima da moeda, por exemplo pizza e sushi, e o resultado mostra o nome do vencedor. Se deixar um campo vazio, volta o nome padrão.' },
    { q: 'O que significam os contadores no final?', a: 'Eles contam só o que você jogou nesta página desde que a abriu, incluindo quantas vezes cada lado saiu. Zeram quando você recarrega e não são enviados para lugar nenhum.' },
  ],

  privacy: {
    title: 'Política de privacidade | Cara ou coroa',
    description: 'Política de privacidade do Cara ou coroa: os nomes que você digita ficam no seu navegador, cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Cara ou coroa (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta e sem login. Os nomes que você digita e os resultados são processados apenas no seu navegador e não são enviados ao nosso servidor. No entanto, algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o seu idioma, exibir anúncios e entender como ele é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para veicular anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam apenas totais diários por idioma (visualizações, lançamentos, avaliações em estrelas). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política vigora a partir de 5 de outubro de 2026.'],
    ],
    back: '← Voltar ao Cara ou coroa',
  },
};
