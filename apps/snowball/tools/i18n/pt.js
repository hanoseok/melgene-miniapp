/* Snowball Fight — pt (Bolas de neve)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
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
    "title": "Guerra de bolas de neve – arremesse e desvie",
    "description": "Jogo grátis de guerra de bolas de neve: acerte a criançada que aparece atrás dos fortes e se abaixe atrás do seu muro quando vier uma bola. Partidas de 60 segundos.",
    "ogTitle": "Bolas de neve ☃️ Quantos acertos em 60 segundos?",
    "ogDescription": "Arremesse rápido, se abaixe na hora certa e não acerte o cachorro. Três corações, um minuto."
  },
  "siteName": "Bolas de neve",
  "privacyLink": "Política de privacidade",
  "start": {
    "badge": "☃️ Neve fresquinha, bolsos cheios",
    "h1Kicker": "Guerra de bolas de neve",
    "h1Html": "Mire, arremesse<br><em>e se abaixe</em>",
    "hook": "Do outro lado do quintal, a criançada está escondida atrás dos fortes de neve. Acerte quando alguém colocar a cabeça para fora e se abaixe rápido quando levantarem o braço.",
    "how": {
      "throw": "Toque numa criança para jogar",
      "duck": "Com ❗, segure Abaixar",
      "avoid": "Não acerte os amigos"
    },
    "start": "Começar a guerra →",
    "facts": "Partidas de 60 s · 3 corações · celular ou PC"
  },
  "play": {
    "score": "Pontos",
    "time": "Tempo",
    "lives": "Vidas",
    "secUnit": "s",
    "pause": "Pausar",
    "paused": "Pausado",
    "resume": "Voltar para a guerra",
    "hint": "Toque no quintal para começar",
    "fieldAria": "Quintal com neve: toque numa criança para arremessar, segure o muro ou o botão Abaixar para se esconder",
    "duck": "Abaixar (segure)",
    "duckAria": "Abaixar atrás do muro enquanto estiver segurando",
    "combo": "Combo ×{n}",
    "golden": "Dourado! +{n}",
    "oops": "É amigo! −{n}",
    "miss": "Errou",
    "block": "Bloqueou!",
    "ouch": "Ai!",
    "timeUp": "Acabou o tempo!",
    "out": "Soterrado!"
  },
  "result": {
    "over": "Fim da guerra",
    "reasonTime": "Você aguentou o minuto inteiro",
    "reasonOut": "Levou três boladas e saiu",
    "unit": "pts",
    "newBest": "Novo recorde pessoal!",
    "best": "Seu recorde: {n} pts",
    "hits": "Acertos",
    "accuracy": "Precisão",
    "bestCombo": "Melhor combo",
    "tierLabel": "Seu nível na guerra",
    "tiers": [
      "🧤 Dedos congelados",
      "❄️ Novato da neve",
      "⛄ Dono do quintal",
      "🎯 Mira certeira",
      "⭐ Invasor de fortes",
      "🏆 Lenda da neve"
    ],
    "top": "Top {n}%",
    "beat": "Melhor que {pct}% dos jogadores",
    "beatAll": "Melhor que todos os outros jogadores até agora",
    "others": "Comparado com outras {n} partidas",
    "comparing": "Comparando com outros jogadores…",
    "shareTitle": "Guerra de bolas de neve",
    "shareText": "Fiz {n} pts em 60 segundos de guerra de bolas de neve ☃️ {tier}. Consegue me superar?",
    "retry": "Mais uma guerra"
  },
  "og": {
    "brand": "☃️ Bolas de neve",
    "defaultKicker": "Jogo de bolas de neve online",
    "defaultTitle": "Quantos acertos em 60 segundos?",
    "defaultDesc": "Arremesse · se abaixe · poupe o cachorro"
  },
  "faq": [
    {
      "q": "Como arremesso e como me abaixo?",
      "a": "Toque (ou clique) numa criança que aparece atrás do forte de neve e uma bola sai voando até ela. Para se esconder, segure o botão Abaixar ou o muro de neve lá embaixo. Enquanto estiver abaixado, você não consegue arremessar. No computador, use ← e → para escolher um forte, ↑ ou F para arremessar, e segure Espaço ou ↓ para se abaixar."
    },
    {
      "q": "Como sei que vem uma bola?",
      "a": "A criança que vai arremessar levanta o braço e aparece um ❗ vermelho em cima da cabeça dela. Se você acertar antes, ela nem chega a jogar. Se a bola já estiver no ar, um ❗ grande aparece em cima do seu muro e o botão Abaixar fica vermelho: segure até a bola chegar."
    },
    {
      "q": "Como funciona a pontuação?",
      "a": "Cada acerto vale pontos, e um boneco de neve vale um pouco mais que uma criança. Vários acertos seguidos formam um combo que aumenta o valor de cada arremesso; um erro zera o combo. O raro boneco de neve dourado é o que vale mais. O cachorro e a criança com a bandeira branca são amigos: acertar neles tira pontos."
    },
    {
      "q": "Quando a partida acaba?",
      "a": "Cada partida dura 60 segundos, ou acaba antes se você levar três boladas. Quanto mais o tempo passa, mais agitado fica. A partida pausa sozinha se você trocar de aba ou bloquear o celular."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Bolas de neve",
    "description": "Política de privacidade do jogo de bolas de neve: pontuações anônimas, cookies, publicidade e estatísticas.",
    "h1": "Política de privacidade",
    "introHtml": "O jogo de bolas de neve (o \"Serviço\") respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.",
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
        "Esta política vale a partir de 14 de novembro de 2026."
      ]
    ],
    "back": "← Voltar ao jogo de bolas de neve"
  }
};
