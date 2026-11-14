/* Fazer certificado — português do Brasil (pt/). Mesma estrutura de chaves de en.js; veja as notas no topo de en.js. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Playfair+Display:wght@700;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    serif: "'Playfair Display'",
    serifWeight: 700,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Fazer certificado online: certificados engraçados",
    description: "Fazer certificado online: escreva o prêmio e o motivo, escolha moldura e selo e crie um certificado engraçado ou de agradecimento. Salve em A4 ou mande um link com cerimônia.",
    ogTitle: "Fazer certificado 🏆",
    ogDescription: "Um certificado engraçado ou carinhoso em um minuto, entregue com um link."
  },
  siteName: "Fazer certificado",
  privacyLink: "Privacidade",
  start: {
    badge: "🏆 Hora da premiação de fim de ano",
    h1Kicker: "Fazer certificado",
    h1Html: "Alguém merece<br><em>um prêmio</em>",
    hook: "Dê um nome ao prêmio, conte o motivo e mande um link que abre como uma cerimônia de verdade.",
    start: "Fazer certificado →"
  },
  editor: {
    title: "Monte o certificado",
    themesAria: "Modelos de certificado",
    themes: {
      gold: "Moldura dourada",
      pastel: "Pastel fofo",
      minimal: "Minimalista",
      ribbon: "Fita retrô"
    },
    previewAria: "Prévia do certificado",
    examplesAria: "Ideias de nome do prêmio",
    sealLabel: "Selo",
    seals: {
      none: "Nenhum",
      red: "Selo vermelho",
      gold: "Medalha"
    },
    fields: {
      title: {
        label: "Nome do prêmio",
        placeholder: "ex.: Colega do ano"
      },
      to: {
        label: "Para",
        placeholder: "ex.: Ana"
      },
      reason: {
        label: "Por que ganhou",
        placeholder: "Por ter…"
      },
      date: {
        label: "Data"
      },
      issuer: {
        label: "Entregue por",
        placeholder: "ex.: Comissão do cafezinho"
      }
    },
    titleExamples: [
      "Colega do ano",
      "Rei do lanchinho",
      "Prêmio alto-astral",
      "Mestre do cafezinho"
    ],
    dice: "🎲 Sortear",
    counter: "{n}/{max}",
    reasons: [
      "Por manter o grupo do zap vivo o ano inteiro com memes de altíssima qualidade.",
      "Por dar bom-dia com um sorriso até na segunda-feira de manhã.",
      "Por dividir os lanchinhos da gaveta sem nunca fazer cara feia.",
      "Por ser o primeiro a dizer “deixa comigo” e o último a sair depois da arrumação.",
      "Por rir das nossas piadas, até na terceira vez.",
      "Por lembrar de aniversários, do café de cada um e de todos os pequenos detalhes.",
      "Por uma calma olímpica diante de impressora travada, trânsito e pão queimado.",
      "Por deixar o último pão de queijo quando ninguém ia perceber.",
      "Por se perder sempre no caminho, mas achar sempre o melhor lugar pra comer.",
      "Por estar lá, toda vez, exatamente quando precisou.",
      "Por provar primeiro a receita misteriosa com uma coragem exemplar.",
      "Por provar o ano todo que gentileza é um superpoder."
    ],
    done: "Concluir certificado"
  },
  card: {
    heading: "Certificado de honra",
    defaultTitle: "Prêmio de excelência",
    presented: "Este certificado é concedido com orgulho a",
    name: "{name}",
    closing: "Em reconhecimento ao que foi dito acima, entregamos este prêmio com muita gratidão.",
    sealFallback: "★"
  },
  open: {
    eyebrow: "🏆 Cerimônia de premiação",
    forName: "Um prêmio para {name}",
    forNone: "Um prêmio só para você",
    hint: "Toque no pergaminho para abrir",
    open: "Abrir o certificado"
  },
  result: {
    eyebrowMine: "Seu certificado está pronto!",
    eyebrowFriend: "Parabéns, {name}!",
    eyebrowFriendNoName: "Parabéns!",
    imageAlt: "Certificado: {title}",
    save: "Salvar imagem",
    saving: "Criando a imagem…",
    saved: "Imagem salva!",
    saveFail: "Não deu para criar a imagem. Tente um print da tela.",
    edit: "Editar",
    retry: "Fazer outro certificado",
    retryFriend: "Fazer o meu",
    shareTitle: "Fazer certificado",
    shareText: "Tem um prêmio para {name} 🏆 Abra a cerimônia aqui:",
    shareTextNoName: "Alguém te deu um prêmio 🏆 Abra a cerimônia aqui:",
    fileName: "certificado"
  },
  og: {
    brand: "🏆 Fazer certificado",
    defaultKicker: "Fazer certificado",
    defaultTitle: "Alguém merece um prêmio",
    defaultDesc: "4 modelos · selo · imagem A4 ou link com cerimônia",
    sampleTitle: "Rei do lanchinho"
  },
  faq: [
    {
      q: "Como faço um certificado?",
      a: "Escolha um dos quatro modelos, escreva o nome do prêmio, quem recebe e o motivo, depois a data, quem entrega e o selo. A prévia muda enquanto você digita. Quando estiver do seu jeito, toque em “Concluir certificado”."
    },
    {
      q: "Qual é o tamanho da imagem salva?",
      a: "“Salvar imagem” cria um PNG de 1240×1754, no formato de uma folha A4: imprime certinho e fica nítido no WhatsApp. No celular abre o menu de compartilhar; no computador, baixa direto."
    },
    {
      q: "O que a pessoa vê quando abre meu link?",
      a: "Uma pequena cerimônia: aparece um pergaminho enrolado, ela toca e o certificado se abre com o nome dela. O título e a data aparecem no idioma dela, e ela pode fazer o próprio certificado."
    },
    {
      q: "Onde fica guardado o que eu escrevo?",
      a: "Só dentro do link e no seu próprio navegador. Nada é enviado para o nosso servidor, então qualquer pessoa com o link pode ler o certificado. Mande só para quem você quiser."
    }
  ],
  privacy: {
    title: "Política de privacidade | Fazer certificado",
    description: "Política de privacidade do Fazer certificado: como o texto que você digita é tratado, cookies, publicidade e estatísticas anônimas.",
    h1: "Política de privacidade",
    introHtml: "O Fazer certificado (o \"Serviço\") respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    sections: [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta nem login. O nome do prêmio, os nomes, o motivo e a data que você digita nunca são enviados a um servidor. Ficam no seu navegador (durante a edição um rascunho fica no armazenamento local) e na URL quando você compartilha. Algumas informações podem ser coletadas automaticamente, como descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies para exibir anúncios e entender como é usado. Você pode recusar ou apagar cookies nas configurações do navegador; alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e ajuste suas preferências em <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam só totais diários por idioma (visualizações, certificados concluídos, avaliações). Nada disso identifica você nem inclui o que você escreveu."
      ],
      [
        "5. Links compartilhados e imagens",
        "Os links criados em “Compartilhar” levam o certificado codificado na URL, então qualquer pessoa com o link pode vê-lo. As imagens são criadas no seu navegador. Evite colocar endereço, telefone ou outros dados pessoais no certificado."
      ],
      [
        "6. Contato",
        "Em caso de dúvidas sobre esta política, entre em contato com o responsável pelo site."
      ],
      [
        "7. Vigência",
        "Esta política vale a partir de 15 de novembro de 2026."
      ]
    ],
    back: "← Voltar para o Fazer certificado"
  }
};
