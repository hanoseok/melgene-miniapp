/* Decorar árvore de Natal — Português do Brasil (/pt/). Mesma estrutura de chaves do en.js. Mantenha {name} {n} {max} como estão.
 * Tratamento por "você". editor.presets = mensagens curtas escritas para o Brasil (máx. 50 caracteres), não traduções.
 */
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
    title: "Decorar árvore de Natal online",
    description: "Decore uma árvore de Natal online: escolha a árvore, pendure bolinhas, estrelas e bengalinhas, acenda o pisca-pisca e a neve, e salve a imagem ou envie o link.",
    ogTitle: "Decorar árvore de Natal 🎄",
    ogDescription: "Pendure enfeites, acenda as luzes e compartilhe a sua árvore de Natal em um minuto."
  },
  siteName: "Decorar árvore de Natal",
  privacyLink: "Política de Privacidade",
  start: {
    badge: "🎄 Especial de Natal",
    h1Kicker: "Decorar árvore de Natal",
    h1Html: "Monte a sua<br><em>árvore brilhante</em>",
    hook: "Pendure bolinhas e bengalinhas, acenda o pisca-pisca, deixe nevar e mande a sua árvore para quem você ama.",
    start: "Começar a decorar →"
  },
  editor: {
    title: "Decore a sua árvore",
    canvasAria: "A sua árvore de Natal. Toque para pendurar o enfeite escolhido e arraste um enfeite para mudá-lo de lugar.",
    hint: "Toque na árvore para pendurar · arraste para mover",
    paletteLabel: "Enfeites",
    kinds: {
      red: "Bola vermelha",
      gold: "Bola dourada",
      blue: "Bola azul",
      purple: "Bola roxa",
      silver: "Bola prateada",
      star: "Estrela",
      bell: "Sino",
      cane: "Bengalinha",
      gift: "Presente",
      bow: "Laço",
      sock: "Meia",
      flake: "Floco de neve",
      cookie: "Biscoito",
      erase: "Borracha"
    },
    undo: "Desfazer",
    clear: "Limpar",
    auto: "Surpresa!",
    count: "{n}/{max} enfeites",
    full: "A árvore está cheia! Mova ou apague um enfeite primeiro.",
    styleLabel: "Árvore",
    styles: {
      classic: "Clássica",
      snowy: "Com neve",
      nordic: "Nórdica",
      pink: "Rosa"
    },
    bgLabel: "Fundo",
    bgs: {
      night: "Céu estrelado",
      cozy: "Aconchego",
      snowfield: "Campo nevado",
      red: "Clima festivo"
    },
    topperLabel: "Topo da árvore",
    toppers: {
      none: "Nenhum",
      star: "Estrela",
      angel: "Anjo",
      bow: "Laço"
    },
    extrasLabel: "Extras",
    snow: "Neve",
    lights: "Luzes",
    fields: {
      name: {
        label: "Seu nome",
        placeholder: "ex.: Ana"
      },
      message: {
        label: "Mensagem curta",
        placeholder: "ex.: Feliz Natal!"
      }
    },
    ideas: "💡 Ideias",
    counter: "{n}/{max}",
    presets: [
      "Feliz Natal e um próspero Ano Novo!",
      "Boas festas com muita paz e rabanada!",
      "Que o Natal traga amor e união 🎄",
      "Um Natal iluminado pra você!",
      "Ho ho ho! Boas festas, família!"
    ],
    done: "Finalizar árvore"
  },
  card: {
    by: "Decorada por {name}"
  },
  result: {
    eyebrowMine: "Sua árvore está pronta!",
    eyebrowFriend: "{name} decorou esta árvore para você",
    eyebrowFriendNoName: "Alguém decorou esta árvore para você",
    imageAlt: "Árvore de Natal decorada com {n} enfeites",
    save: "Salvar imagem",
    saving: "Criando a sua imagem…",
    saved: "Imagem salva!",
    saveFail: "Não foi possível criar a imagem. Tente tirar um print.",
    edit: "Seguir decorando",
    retry: "Decorar outra árvore",
    retryFriend: "Decorar a minha árvore",
    shareTitle: "Decorar árvore de Natal",
    shareText: "{name} decorou uma árvore de Natal 🎄 Dá uma olhada:",
    shareTextNoName: "Olha a árvore de Natal que eu decorei 🎄",
    fileName: "christmas-tree"
  },
  og: {
    brand: "🎄 Decorar árvore de Natal",
    defaultKicker: "Decorar árvore de Natal",
    defaultTitle: "Monte a sua árvore brilhante",
    defaultDesc: "Enfeites · luzes · neve · salve ou compartilhe"
  },
  faq: [
    {
      q: "Como eu penduro um enfeite?",
      a: "Escolha um enfeite na fileira embaixo da árvore e toque em qualquer ponto da árvore. Para mudar um de lugar, pressione e arraste. Use a borracha para tirar um enfeite só, ou toque em Desfazer para voltar um passo."
    },
    {
      q: "Dá para mudar a árvore depois de colocar os enfeites?",
      a: "Dá, sim. Você pode trocar o formato da árvore, o fundo e o enfeite do topo, e ligar ou desligar a neve e as luzes quando quiser. Os enfeites continuam onde você colocou."
    },
    {
      q: "Como salvo ou envio a minha árvore?",
      a: "Toque em “Finalizar árvore”. “Salvar imagem” gera um PNG de 1080×1350, e os botões de compartilhar enviam um link. Quem abrir o link vê a sua árvore com as luzes piscando e pode decorar uma também."
    },
    {
      q: "Onde a minha árvore fica guardada?",
      a: "Os enfeites, o nome e a mensagem ficam só no link e, enquanto você decora, no seu próprio navegador. Nada disso é enviado ao nosso servidor, então qualquer pessoa com o link consegue ver a árvore."
    }
  ],
  privacy: {
    title: "Política de Privacidade | Decorar árvore de Natal",
    description: "Política de Privacidade do Decorar árvore de Natal: como tratamos a sua árvore, nome e mensagem, além de cookies, publicidade e estatísticas anônimas.",
    h1: "Política de Privacidade",
    introHtml: "O Decorar árvore de Natal (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    sections: [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta nem login. A sua árvore, o nome e a mensagem que você digita nunca são enviados a um servidor. Eles ficam no seu navegador (um rascunho é guardado no armazenamento local enquanto você decora) e na URL quando você compartilha. Algumas informações podem ser coletadas automaticamente durante o uso do Serviço, conforme descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies para exibir anúncios e entender como o Serviço é usado. Você pode recusar ou apagar cookies nas configurações do navegador; se fizer isso, alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e mude suas preferências nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam só totais diários por idioma (visualizações de página, árvores finalizadas, avaliações com estrelas). Nada disso identifica você pessoalmente, nem inclui o seu nome ou a sua mensagem."
      ],
      [
        "5. Links e imagens compartilhados",
        "Os links criados com “Compartilhar” contêm a sua árvore codificada na URL, então qualquer pessoa com o link pode vê-la. As imagens salvas são geradas dentro do seu navegador. Evite colocar endereço, telefone ou outros dados pessoais na mensagem."
      ],
      [
        "6. Contato",
        "Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "7. Data de vigência",
        "Esta política vale a partir de 5 de novembro de 2026."
      ]
    ],
    back: "← Voltar ao Decorar árvore de Natal"
  }
};
