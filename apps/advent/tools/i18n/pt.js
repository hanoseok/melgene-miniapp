/* Calendário do Advento — português do Brasil (pt/)
 * Designs, limites, datas e formato do link em advent-core.js; telas e canvas em advent.js. Este arquivo tem todos os textos visíveis.
 * Chaves terminadas em Html entram como HTML (só <br> e <em>); os textos de privacy.sections também.
 * Tela inicial = só um gostinho (sem formulário nem FAQ). As perguntas frequentes só aparecem na tela final comum.
 * Mantenha {name} {n} {day} {date} {title} como estão. Plurais pelo Intl.PluralRules (one, other).
 * editor.ideas = recados escritos em português do Brasil (não traduções), até 80 caracteres cada.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Calendário do Advento para presentear: 24 portas",
    description: "Monte grátis um calendário do Advento personalizado: um recado atrás de cada uma das 24 portinhas, enviado por link. A partir de 1º de dezembro abre uma por dia.",
    ogTitle: "Calendário do Advento para presentear 🎄",
    ogDescription: "Esconda 24 recadinhos para alguém especial. Em dezembro abre uma portinha por dia."
  },
  siteName: "Calendário do Advento",
  privacyLink: "Privacidade",
  start: {
    badge: "🎄 Contagem regressiva pro Natal",
    h1Kicker: "Calendário do Advento",
    h1Html: "24 portinhas,<br>uma <em>surpresa</em> por dia",
    hook: "Esconda um recado atrás de cada portinha para alguém que você ama. A partir de 1º de dezembro, dá para abrir uma por dia.",
    start: "Montar calendário →"
  },
  editor: {
    title: "Preencha seu calendário",
    themesAria: "Designs do calendário",
    themes: {
      classic: "Clássico",
      snow: "Com neve",
      gold: "Estrelado",
      candy: "Docinho"
    },
    fields: {
      to: { label: "Para", placeholder: "ex.: Ana" },
      from: { label: "De", placeholder: "ex.: Lucas" }
    },
    daysLabel: "Recados atrás das portinhas",
    daysHint: "Até 80 caracteres por portinha. As vazias escondem um docinho.",
    dayAria: "Recado da portinha {day}",
    diceAria: "Ideia aleatória para a portinha {day}",
    placeholder: "Escreva um recado…",
    counter: "{n}/24 portinhas preenchidas",
    fillAll: "🎲 Preencher vazias",
    preview: "👀 Prévia",
    create: "Criar link",
    needOne: "Escreva pelo menos um recado antes."
  },
  ideas: [
    "Bom dia! Hoje é um ótimo dia para ser você.",
    "O chocolate quente desta semana é por minha conta. Você escolhe o lugar.",
    "Que sorte ter você na minha vida. É isso, esse é o recado.",
    "Coloca sua música favorita e dança por um minuto. Ordem médica.",
    "Lembra daquela crise de riso que não acabava mais? Eu lembro.",
    "Vale: uma noite de filme, você escolhe e a pipoca é comigo.",
    "Você tem mais coragem do que pensa e mais doçura do que imagina.",
    "Missão do dia: tirar foto de algo que te faça sorrir.",
    "Lembrete carinhoso: bebe um copo d’água e se alonga um pouco.",
    "Se o dia estiver comprido, este recado é um abracinho.",
    "Com você, dia comum parece feriado.",
    "Bora conversar hoje à noite? Quero saber como foi seu dia.",
    "Vale: um abraço, válido para sempre, sem data de validade.",
    "Hoje se dá um doce de presente. Você merece.",
    "Já estamos na metade do caminho até o Natal! Você está mandando bem.",
    "Dá uma saída rápida e olha pro céu. O fim de ano tem um brilho diferente.",
    "Três coisas que amo em você: sua risada, seu coração e suas playlists.",
    "Anota uma coisa boa deste ano. Começo eu: te conhecer.",
    "Vale: uma tarefa de casa à sua escolha, feita sem reclamar.",
    "Você é minha notificação favorita.",
    "Acende uma vela hoje à noite e faz um pedido.",
    "Descansar também conta. Vai com calma hoje.",
    "Amanhã o Natal fica ainda mais perto. Aguenta firme!",
    "Feliz véspera de Natal! Valeu por ser quem você é.",
    "Vamos escolher uma coisa legal para fazer juntos no ano que vem.",
    "Hoje à noite: cobertinha, filme e zero compromisso.",
    "Curiosidade: é facílimo gostar de você.",
    "Manda uma mensagem carinhosa para alguém hoje. Pode começar por mim.",
    "Não importa a distância, você está sempre pertinho do meu coração.",
    "Panetone ou rabanada? Hoje é dia de doce."
  ],
  calendar: {
    heading: "Calendário do Advento",
    forName: "Para {name}",
    forNone: "Um calendário do Advento para você",
    fromName: "De {name}",
    before: {
      one: "A primeira portinha abre em {date}. Falta só {n} dia!",
      other: "A primeira portinha abre em {date}. Faltam {n} dias!"
    },
    during: "Hoje é {date}. Abra a portinha de hoje!",
    after: "O Natal chegou. Todas as portinhas estão abertas.",
    locked: {
      one: "A portinha {day} abre em {date}, daqui a {n} dia.",
      other: "A portinha {day} abre em {date}, daqui a {n} dias."
    },
    hint: "Toque numa portinha para abrir",
    doorAria: "Portinha {day}",
    dayTitle: "{date}",
    treat: "Hoje não tem recado, só um docinho para você.",
    close: "Fechar",
    makeOwn: "🎄 Fazer o meu"
  },
  preview: {
    badge: "👀 Prévia",
    note: "Só você vê esta tela. Aqui todas as portinhas estão abertas para você conferir os recados. Para quem recebe, abre uma por dia.",
    back: "← Voltar"
  },
  result: {
    eyebrowMine: "Seu calendário do Advento está pronto!",
    eyebrowFriend: "Um calendário feito só para você",
    linkLabel: "Link do calendário",
    copy: "Copiar",
    copied: "Link copiado!",
    copyFail: "Não deu para copiar. Selecione o link e copie.",
    note: "Os recados existem só dentro deste link. Quem tiver o link pode abrir cada portinha no dia certo, então mande só para a pessoa certa.",
    save: "Salvar imagem",
    saving: "Criando a imagem…",
    saved: "Imagem salva!",
    saveFail: "Não deu para criar a imagem. Tire um print da tela.",
    imageAlt: "Calendário do Advento com 24 portinhas fechadas",
    preview: "Ver todas as portinhas",
    edit: "Editar",
    retry: "Montar outro calendário",
    retryFriend: "Fazer o meu",
    shareTitle: "Calendário do Advento",
    shareText: "Fiz um calendário do Advento para você 🎄 A partir de 1º de dezembro abre uma portinha por dia:",
    shareTextFriend: "Monte um calendário do Advento para alguém especial 🎄",
    fileName: "calendario-advento"
  },
  og: {
    brand: "🎄 Calendário do Advento",
    kicker: "Calendário do Advento para presentear",
    title: "24 portinhas, uma surpresa por dia",
    desc: "4 designs · um recado por portinha · por link"
  },
  faq: [
    {
      q: "Quando as portinhas abrem?",
      a: "A portinha 1 abre em 1º de dezembro, a 2 em 2 de dezembro e assim por diante até o dia 24, pela data do celular ou computador de quem recebe. De 25 de dezembro a 31 de janeiro todas ficam abertas; antes de dezembro, todas fechadas."
    },
    {
      q: "Onde ficam guardados meus recados?",
      a: "Só dentro do link. Nada do que você escreve é enviado ao nosso servidor, então quem tiver o link consegue ler os recados quando cada portinha abrir. Mande só para a pessoa certa."
    },
    {
      q: "Dá para mudar um recado depois de mandar o link?",
      a: "Não: os recados ficam no próprio link, que não pode ser editado depois. Edite o calendário, crie um link novo e mande esse."
    },
    {
      q: "O que aparece atrás de uma portinha vazia?",
      a: "Um docinho do dia, como um biscoito, uma bengalinha de doce ou uma estrelinha. Você pode preencher todas, só algumas ou deixar o dado sugerir ideias."
    }
  ],
  privacy: {
    title: "Privacidade | Calendário do Advento",
    description: "Política de privacidade do Calendário do Advento: como seus recados são tratados, cookies, publicidade e estatísticas anônimas.",
    h1: "Política de privacidade",
    introHtml: "O Calendário do Advento (o \"Serviço\") respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    sections: [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta nem login. Os nomes e recados que você digita nunca são enviados a um servidor. Eles ficam no seu navegador (um rascunho fica no armazenamento local enquanto você edita) e dentro do link quando você compartilha. As portinhas já abertas ficam registradas só no navegador de quem recebe. Algumas informações podem ser coletadas automaticamente, como descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias parecidas",
        "O Serviço pode usar cookies para mostrar anúncios e entender como é usado. Você pode recusar ou apagar cookies nas configurações do navegador; algumas funções podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências em <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios agregados que guardam só totais diários por idioma (visualizações, calendários criados, avaliações com estrelas). Nada disso identifica você nem inclui o que você escreveu."
      ],
      [
        "5. Links compartilhados e imagens",
        "Os links criados com o Serviço contêm seu calendário codificado na URL, então quem tiver o link pode ler cada recado quando a portinha abrir. As imagens salvas mostram só os números das portinhas e são criadas no seu navegador. Evite colocar endereço, telefone ou outros dados pessoais nos recados."
      ],
      [
        "6. Contato",
        "Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site."
      ],
      [
        "7. Data de vigência",
        "Esta política vale a partir de 17 de novembro de 2026."
      ]
    ],
    back: "← Voltar ao Calendário do Advento"
  }
};
