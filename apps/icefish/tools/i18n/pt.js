/* Ice Fishing — pt (Pesca no gelo)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Jogo de pesca no gelo – Pescaria no gelo online",
    "description": "Jogo de pesca no gelo grátis online: desça a linha por um buraco no lago congelado, espere a fisgada e puxe sem arrebentar a linha. 60 segundos, no celular ou no PC.",
    "ogTitle": "Pesca no gelo 🎣 Quantos peixes você pega em 60 segundos?",
    "ogDescription": "Desça a linha pelo gelo, sinta a fisgada e puxe com calma. Se puxar forte demais, a linha arrebenta."
  },
  "siteName": "Pesca no gelo",
  "privacyLink": "Política de privacidade",
  "start": {
    "badge": "🎣 Um lago congelado, um buraquinho",
    "h1Kicker": "Jogo de pesca no gelo",
    "h1Html": "Desça a linha<br><em>e puxe o peixe</em>",
    "hook": "Tem alguma coisa nadando debaixo do gelo. Desça o anzol até a profundidade certa, espere o puxão e recolha com jeito antes que a linha ceda.",
    "how": {
      "lower": "Segure para descer",
      "reel": "Fisgou? Segure para puxar",
      "red": "Solte no vermelho"
    },
    "start": "Começar a pescar →",
    "facts": "Partidas de 60 s · celular ou PC · bata seu recorde"
  },
  "play": {
    "score": "Pontos",
    "time": "Tempo",
    "secUnit": "s",
    "pause": "Pausar",
    "paused": "Pausado",
    "resume": "Continuar pescando",
    "hint": "Segure debaixo do gelo para descer a linha",
    "fieldAria": "Lago congelado: segure numa profundidade para descer o anzol e segure para puxar quando o peixe fisgar",
    "bite": "Fisgou!",
    "catchPop": "{fish} +{n}",
    "snap": "A linha arrebentou!",
    "escape": "Escapou",
    "timeUp": "Acabou o tempo!"
  },
  "fish": {
    "minnow": "Lambari",
    "perch": "Perca",
    "trout": "Truta",
    "pike": "Lúcio",
    "golden": "Peixe dourado",
    "boot": "Bota velha"
  },
  "result": {
    "over": "Sua pescaria",
    "unit": "pts",
    "newBest": "Novo recorde pessoal!",
    "best": "Seu recorde: {n} pts",
    "caught": "Peixes pescados",
    "snapped": "Linhas arrebentadas",
    "bestCatch": "Melhor peixe: {fish}",
    "noCatch": "Nenhum peixe desta vez",
    "tierLabel": "Seu nível de pescador",
    "tiers": [
      "🧊 Mãos congeladas",
      "🪝 Aprendiz do gelo",
      "🐟 Pescador paciente",
      "🎣 Figurinha do lago",
      "⭐ Rei dos peixes",
      "🏆 Lenda do lago"
    ],
    "top": "Top {n}%",
    "beat": "Melhor que {pct}% dos pescadores",
    "beatAll": "Melhor que todos os pescadores até agora",
    "others": "Comparado com outras {n} partidas",
    "comparing": "Comparando com outros pescadores…",
    "shareTitle": "Pesca no gelo",
    "shareText": "Fiz {n} pts na pesca no gelo em 60 segundos 🎣 {tier}. Consegue me superar?",
    "retry": "Pescar de novo"
  },
  "og": {
    "brand": "🎣 Pesca no gelo",
    "defaultKicker": "Jogo de pesca no gelo",
    "defaultTitle": "Quantos peixes você pega em 60 segundos?",
    "defaultDesc": "Desça a linha · sinta a fisgada · não arrebente"
  },
  "faq": [
    {
      "q": "Como desço a linha?",
      "a": "Segure em qualquer ponto da água debaixo do gelo. O anzol vai até essa profundidade e para quando você solta. No computador, dá para segurar as teclas ↓ e ↑. Cada peixe gosta de uma profundidade diferente, então teste algumas."
    },
    {
      "q": "Como funciona o puxar?",
      "a": "Quando um peixe fisgar, segure para recolher a linha. A barra de tensão à direita sobe. Quando ela chegar na zona vermelha, solte um pouco para a linha afrouxar e segure de novo. Se a barra encher, a linha arrebenta; se ficar frouxa por muito tempo, o peixe escapa."
    },
    {
      "q": "Por que alguns peixes valem mais?",
      "a": "Peixes maiores e mais fundos puxam com mais força e valem mais pontos; o raro peixe dourado vale mais que todos. Lixo como uma bota velha sobe fácil, mas não vale nada. Seu recorde fica salvo neste navegador."
    },
    {
      "q": "O que acontece se eu trocar de aba?",
      "a": "A partida pausa sozinha quando você sai da página ou bloqueia o celular, e o relógio também para. Toque em Continuar pescando (ou na tecla P) para seguir de onde parou."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Pesca no gelo",
    "description": "Política de privacidade do jogo de pesca no gelo: pontuações anônimas, cookies, publicidade e estatísticas.",
    "h1": "Política de privacidade",
    "introHtml": "O jogo de pesca no gelo (o \"Serviço\") respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta e sem login. Quando uma partida termina, só a sua pontuação é enviada ao nosso servidor como contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seu recorde, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e ajuste suas preferências nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam só totais diários por idioma (visualizações de página, partidas iniciadas e terminadas, avaliações em estrelas). Nada disso identifica você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política vale a partir de 10 de novembro de 2026."
      ]
    ],
    "back": "← Voltar ao jogo de pesca no gelo"
  }
};
