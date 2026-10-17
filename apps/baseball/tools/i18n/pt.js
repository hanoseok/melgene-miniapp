/* Touros e vacas (숫자 야구 / number baseball) — pt
 * Rules live in baseball-core.js; this file holds every visible string.
 * Keys ending in Html are raw HTML (<br>, <em> only); privacy.sections bodies are HTML too.
 * Placeholders: {n} {d} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Touros e vacas – jogo de adivinhar o número secreto",
    "description": "Jogue Touros e vacas (Bulls and Cows) de graça: descubra o número secreto de 3 ou 4 dígitos com as pistas de strike, bola e fora. Recorde por nível, sem baixar nada.",
    "ogTitle": "Touros e vacas ⚾ Você descobre o número secreto?",
    "ogDescription": "Um número secreto sem dígitos repetidos. Dê seus palpites, leia as pistas e acerte no menor número de tentativas."
  },
  "siteName": "Touros e vacas – beisebol de números",
  "privacyLink": "Privacidade",
  "start": {
    "badge": "⚾ Beisebol de números",
    "h1Kicker": "Touros e vacas",
    "h1Html": "Descubra o<br><em>número secreto</em>",
    "hook": "O computador escondeu um número secreto sem dígitos repetidos. Dê um palpite, leia as pistas e desvende o código.",
    "how": "Certo = dígito e posição certos · Quase = dígito certo, posição errada · Nenhum = sem acertos",
    "levelLabel": "Escolha quantos dígitos",
    "levels": {
      "d3": "3 dígitos",
      "d4": "4 dígitos"
    },
    "levelSub": {
      "d3": "Clássico",
      "d4": "Mais difícil"
    },
    "timer": "Mostrar cronômetro",
    "start": "Começar →"
  },
  "play": {
    "tries": "Tentativas",
    "time": "Tempo",
    "slotAria": "Dígito {n}",
    "enter": "Palpitar",
    "del": "Apagar",
    "giveUp": "Desistir",
    "giveUpSure": "Toque de novo para ver a resposta",
    "historyTitle": "Seus palpites",
    "historyEmpty": "Digite um número para dar o primeiro palpite.",
    "errLen": "Digite {n} dígitos",
    "errDup": "Os dígitos não podem se repetir",
    "errAgain": "Você já tentou esse número",
    "strike": "Certo",
    "ball": "Quase",
    "out": "Nenhum",
    "legend": "Certo: dígito e posição certos · Quase: dígito certo, posição errada"
  },
  "result": {
    "done": "Descobriu!",
    "gaveUp": "A resposta era",
    "triesCaption": "Tentativas",
    "timeLabel": "Tempo",
    "secretLabel": "Número secreto",
    "sec": "s",
    "best": "Recorde neste nível: {n}",
    "newBest": "Novo recorde pessoal!",
    "top": "Top {n}%",
    "beat": "Menos tentativas que {pct}% dos jogadores",
    "beatAll": "Menos tentativas que todos os resultados até agora",
    "others": "Comparado com mais {n} resultados neste nível",
    "comparing": "Comparando com outros jogadores…",
    "retry": "Jogar de novo",
    "shareTitle": "Touros e vacas – você descobre o número secreto?",
    "shareText": "Descobri um número de {d} dígitos em {n} tentativas ⚾ Você consegue com menos?"
  },
  "og": {
    "brand": "⚾ Touros e vacas",
    "defaultKicker": "Jogo de números grátis",
    "defaultTitle": "Você descobre o número secreto?",
    "defaultDesc": "Certo · Quase · Nenhum"
  },
  "faq": [
    {
      "q": "Como jogar Touros e vacas?",
      "a": "O computador escolhe um número secreto com todos os dígitos diferentes. Digite um número do mesmo tamanho, também sem dígitos repetidos, e toque em Palpitar. Dígito na posição certa é “certo” (strike), dígito certo na posição errada é “quase” (bola), e sem nenhuma correspondência é “nenhum” (fora). Você vence quando todos os dígitos estão certos."
    },
    {
      "q": "O número secreto pode começar com 0? Os dígitos podem se repetir?",
      "a": "Pode começar com 0, por exemplo 072, mas um dígito nunca aparece duas vezes. Seus palpites também não podem repetir dígitos. Um número que você já tentou não conta de novo: só palpites novos aumentam as tentativas."
    },
    {
      "q": "Existe botão de dica ou limite de tentativas?",
      "a": "Não há dicas nem limite. É um quebra-cabeça de dedução pura: quanto menos tentativas, melhor. Se travar, toque em Desistir para ver a resposta e começar uma nova rodada. O cronômetro é opcional e só aparece se você ativar."
    },
    {
      "q": "Qual é a diferença entre 3 e 4 dígitos?",
      "a": "Com 3 dígitos existem 720 números secretos possíveis; com 4 dígitos há muitos mais, todos igualmente prováveis. Seu recorde é guardado separadamente para cada nível neste navegador."
    },
    {
      "q": "De onde vem o “Top %”?",
      "a": "Quando você resolve uma rodada, seu número de tentativas é comparado com os resultados reais de outros jogadores no mesmo nível. Se ainda não há outros resultados, a comparação não aparece. Rodadas em que você desiste não contam."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Touros e vacas",
    "description": "Política de privacidade de Touros e vacas: resultados anônimos, cookies, publicidade e estatísticas.",
    "h1": "Política de privacidade",
    "introHtml": "Touros e vacas (o \"Serviço\") respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta e sem login. Quando você resolve uma rodada, só o nível e o número de tentativas são enviados ao nosso servidor como contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso do Serviço, como descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seus recordes, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências em <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios que guardam apenas totais diários por idioma (visualizações de página, partidas iniciadas e concluídas, avaliações com estrelas). Nada disso identifica você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta Política de privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política vale a partir de 18 de outubro de 2026."
      ]
    ],
    "back": "← Voltar a Touros e vacas"
  }
};
