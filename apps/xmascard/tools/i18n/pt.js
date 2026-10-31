/* Cartão de Natal — Português do Brasil (/pt/). Mesma estrutura de chaves do en.js. Mantenha {name} {greeting} {n} {max} como estão. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Pacifico'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Cartão de Natal para criar e enviar online",
    description: "Crie seu cartão de Natal online: escolha um tema e uma saudação, escreva os nomes e uma mensagem carinhosa e salve como imagem ou mande um link que abre como um envelope.",
    ogTitle: "Crie seu cartão de Natal 🎄",
    ogDescription: "Faça um cartão de Natal caprichado em um minuto e mande pra quem você ama."
  },
  siteName: "Cartão de Natal",
  privacyLink: "Política de Privacidade",
  start: {
    badge: "🎄 Especial de fim de ano",
    h1Kicker: "Cartão de Natal",
    h1Html: "Mande um pouco de<br><em>magia de Natal</em>",
    hook: "Escolha um design bonito, escreva umas palavras de carinho e mande um cartão que abre como um envelope de verdade.",
    start: "Criar meu cartão →"
  },
  editor: {
    title: "Monte seu cartão",
    themesAria: "Designs do cartão",
    themes: {
      classic: "Clássico",
      snowy: "Noite de neve",
      golden: "Dourado",
      cute: "Fofo",
      minimal: "Minimalista",
      forest: "Floresta"
    },
    previewAria: "Prévia do seu cartão",
    greetingsLabel: "Saudação",
    decoLabel: "Enfeites",
    decos: {
      snow: "Neve",
      lights: "Pisca-pisca",
      sparkle: "Brilhos"
    },
    fields: {
      to: {
        label: "Para",
        placeholder: "ex.: Vó"
      },
      from: {
        label: "De",
        placeholder: "ex.: Ana"
      },
      message: {
        label: "Sua mensagem",
        placeholder: "Escreva umas palavras de carinho…"
      }
    },
    ideas: "💡 Ideias",
    counter: "{n}/{max}",
    presets: [
      "Valeu por estar sempre por perto. Que seu Natal seja leve, gostoso e cheio de risadas!",
      "Que essas festas tragam paz, muita comida boa e tempo com quem você ama.",
      "Mesmo longe, você está sempre no meu coração. Bora marcar um encontro logo!",
      "Que o Ano Novo chegue com saúde, alegria e muitas conquistas pra você.",
      "Ano puxado, né? Descanse, aproveite as festas e recarregue as energias!"
    ],
    defaultGreeting: "merry",
    done: "Finalizar cartão"
  },
  card: {
    greetings: {
      merry: "Feliz Natal!",
      holidays: "Boas festas!",
      newyear: "Feliz Ano Novo!",
      seasons: "Paz e luz neste Natal"
    },
    to: "Para {name}",
    from: "Com carinho, {name}"
  },
  open: {
    eyebrow: "Você recebeu um cartão de Natal",
    fromName: "de {name}",
    fromNone: "de alguém que pensou em você",
    open: "Abrir o cartão"
  },
  result: {
    eyebrowMine: "Seu cartão está pronto!",
    eyebrowFriend: "Um cartão de {name}",
    eyebrowFriendNoName: "Um cartão só pra você",
    imageAlt: "Cartão de Natal: {greeting}",
    save: "Salvar imagem",
    saving: "Criando a imagem…",
    saved: "Imagem salva!",
    saveFail: "Não deu para criar a imagem. Tire um print da tela.",
    copyText: "Copiar texto",
    copied: "Texto copiado!",
    copyFail: "Não deu para copiar. Tente de novo.",
    edit: "Editar",
    retry: "Fazer outro cartão",
    retryFriend: "Criar meu cartão",
    shareTitle: "Cartão de Natal",
    shareText: "{name} te mandou um cartão de Natal 🎄 Abra aqui:",
    shareTextNoName: "Você recebeu um cartão de Natal 🎄 Abra aqui:",
    fileName: "cartao-de-natal"
  },
  og: {
    brand: "🎄 Cartão de Natal",
    defaultKicker: "Cartão de Natal",
    defaultTitle: "Mande um pouco de magia de Natal",
    defaultDesc: "6 designs · salve como imagem ou mande um link",
    cardGreeting: "Feliz Natal!"
  },
  faq: [
    {
      q: "Como faço meu cartão?",
      a: "Escolha um design e uma saudação, ligue ou desligue a neve, o pisca-pisca e os brilhos e escreva para quem é, de quem é e uma mensagem curta. A prévia muda na hora; toque em “Finalizar cartão” quando gostar."
    },
    {
      q: "Dá para salvar o cartão como imagem?",
      a: "Dá, sim. “Salvar imagem” cria um PNG de 1080×1350, perfeito para o WhatsApp ou os stories. No celular abre o menu de compartilhar; no computador, a imagem é baixada."
    },
    {
      q: "O que a pessoa vê quando abre meu link?",
      a: "Primeiro um envelope fechado; com um toque ele abre e o cartão aparece, com a saudação no idioma dela. Depois ela também pode criar o próprio cartão."
    },
    {
      q: "Onde minha mensagem fica guardada?",
      a: "Só dentro do link e, enquanto você escreve, no seu navegador. Nada vai para o nosso servidor, mas qualquer pessoa com o link pode ler, então compartilhe só com quem você quer."
    }
  ],
  privacy: {
    title: "Política de Privacidade | Cartão de Natal",
    description: "Política de Privacidade do Cartão de Natal: como o texto do seu cartão é tratado, cookies, publicidade e estatísticas anônimas.",
    h1: "Política de Privacidade",
    introHtml: "O Cartão de Natal (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    sections: [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta nem login. Os nomes e a mensagem que você digita nunca são enviados a um servidor: ficam no seu navegador (enquanto você edita, um rascunho fica no armazenamento local) e na URL quando você compartilha. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies para exibir anúncios e entender como é usado. Você pode recusar ou apagar os cookies nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores. Saiba mais e mude suas preferências nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam só totais diários por idioma (visualizações, cartões finalizados, avaliações). Nada disso identifica você nem inclui a sua mensagem."
      ],
      [
        "5. Links compartilhados e imagens",
        "Os links criados com “Compartilhar” contêm o seu cartão codificado na URL, então qualquer pessoa com o link pode vê-lo. As imagens são criadas no seu navegador. Evite colocar endereço, telefone ou outros dados pessoais na mensagem."
      ],
      [
        "6. Contato",
        "Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site."
      ],
      [
        "7. Data de vigência",
        "Esta política vale a partir de 1º de novembro de 2026."
      ]
    ],
    back: "← Voltar ao Cartão de Natal"
  }
};
