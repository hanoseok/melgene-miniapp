/* Torneio de comida – O que você prefere comer? — Português do Brasil (/pt/, og:locale pt_BR)
 * Mesma estrutura de chaves de en.js. Ids dos pratos, emojis e chaveamento: food-cup-core.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Oswald:wght@600&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    name: "'Oswald'",
    nameWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Torneio de comida – O que você prefere comer?',
    description: 'Torneio de comida: dois pratos por disputa, toque no que você prefere comer até sobrar um campeão. O “o que você prefere” de comida em um minuto. Grátis, sem download.',
    ogTitle: 'Torneio de comida 🏆 O que você prefere comer?',
    ogDescription: 'Dois pratos, uma escolha, quinze disputas. Qual comida vai levar a coroa?',
  },
  siteName: 'Torneio de comida',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🍽️ O que você prefere · comida',
    h1Kicker: 'Torneio de comida',
    h1Html: 'Qual comida leva<br>a <em>coroa</em>?',
    hook: 'Dois pratos, uma escolha só. Vai escolhendo até sobrar só o seu favorito.',
    facts: '16 pratos · 15 escolhas · 1 min',
    start: 'Começar o torneio →',
  },

  play: {
    rounds: { r16: 'Oitavas de final', qf: 'Quartas de final', sf: 'Semifinal', f: 'Final' },
    roundFmt: '{round} · {n}/{total}',
    progressAria: 'Escolha {n} de {total}',
    hint: 'O que você prefere comer?',
    vs: 'VS',
    pickAria: 'Escolher {food}',
    same: '{pct}% escolheram igual',
  },

  result: {
    eyebrow: 'Sua comida campeã',
    champPct: '{pct}% dos jogadores também coroaram esse prato',
    champFirst: 'Você está entre os primeiros a terminar — ainda sem estatísticas.',
    fourTitle: 'Seus quatro finalistas',
    retry: 'Jogar de novo (novo chaveamento)',
    shareTitle: 'Torneio de comida – O que você prefere comer?',
    shareText: 'Minha comida campeã é {emoji} {food}! E a sua?',
  },

  foods: {
    pizza: 'Pizza',
    burger: 'Hambúrguer',
    sushi: 'Sushi',
    noodles: 'Lámen',
    chicken: 'Frango frito',
    tacos: 'Tacos',
    pasta: 'Macarrão',
    curry: 'Curry',
    dumplings: 'Guioza',
    steak: 'Picanha',
    hotpot: 'Feijoada',
    hotdog: 'Cachorro-quente',
    friedrice: 'Arroz frito',
    sandwich: 'Sanduíche',
    stew: 'Moqueca',
    shrimp: 'Camarão empanado',
  },

  og: {
    brand: '🏆 Torneio de comida',
    defaultKicker: 'O que você prefere · comida',
    defaultTitle: 'Qual comida leva a coroa?',
    defaultDesc: 'Dois pratos por vez · um campeão · cerca de um minuto',
  },

  faq: [
    { q: 'Como funciona o torneio de comida?', a: 'Dezesseis pratos são sorteados num chaveamento aleatório. Em cada disputa aparecem dois: toque no que você prefere comer e ele avança. Oitavas, quartas, semifinal e final somam 15 escolhas, e o último prato de pé é o seu campeão.' },
    { q: 'As porcentagens são de verdade?', a: 'Sim. Cada escolha é contada de forma anônima no nosso servidor, uma vez só por navegador em cada disputa. A porcentagem só aparece quando gente suficiente jogou exatamente aquela disputa; antes disso a gente prefere não mostrar nada a inventar um número.' },
    { q: 'Posso jogar de novo ou compartilhar o resultado?', a: 'Jogue quantas vezes quiser: cada partida tem um chaveamento novo, então as disputas mudam. Use os botões de compartilhar para mandar seu campeão para os amigos e ver o que eles escolhem.' },
    { q: 'Por que esses dezesseis pratos?', a: 'São pratos que o mundo inteiro ama, da comida de rua à comida de casa. Os nomes seguem como a gente fala no Brasil, mas os pratos são os mesmos em todos os idiomas, então as porcentagens juntam jogadores de todos os países.' },
  ],

  privacy: {
    title: 'Política de privacidade | Torneio de comida',
    description: 'Política de privacidade do Torneio de comida: contagem anônima das escolhas, cookies, anúncios e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Torneio de comida (o “Serviço”) respeita a sua privacidade e trata apenas o mínimo de informações descrito abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta nem login. Suas escolhas são enviadas ao nosso servidor apenas como totais anônimos (qual prato venceu cada disputa e qual prato você coroou), sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e as disputas já contadas, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar como esperado.'],
      ['3. Anúncios (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam só totais diários por idioma (visualizações, torneios concluídos, avaliações). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política vale a partir de 29 de setembro de 2026.'],
    ],
    back: '← Voltar ao Torneio de comida',
  },
};
