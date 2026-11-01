/* Desafio dos 10 segundos — pt (10 Second Challenge / timer)
 * Rules live in timer-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + target/blind choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {total} {time} {pct} {tier} — keep them as-is when translating.
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
    "title": "Desafio dos 10 segundos – Pare o cronômetro em 10,00",
    "description": "Desafio dos 10 segundos: inicie o cronômetro e pare exatamente em 10,00 segundos no feeling. 3 tentativas, modo às cegas e metas de 5 ou 30 segundos. Grátis, sem download.",
    "ogTitle": "Desafio dos 10 segundos ⏱️ Você para em 10,00?",
    "ogDescription": "Conte de cabeça e aperte STOP na hora certa. 3 tentativas, e no modo às cegas os números somem."
  },
  "siteName": "Desafio dos 10 segundos",
  "privacyLink": "Privacidade",
  "start": {
    "badge": "⏱️ Você sente 10 segundos?",
    "h1Kicker": "Desafio dos 10 segundos",
    "h1Html": "Pare o cronômetro<br><em>em 10,00 cravado</em>",
    "hook": "Inicie o cronômetro, conte de cabeça e pare na hora certa. São três tentativas, e só vale a mais próxima.",
    "targetLabel": "Tempo alvo",
    "targetValue": "{n} s",
    "blindLabel": "Modo às cegas",
    "blindDesc": "Os números somem depois de 3 segundos",
    "how": "Iniciar, depois STOP · toque em qualquer lugar ou Espaço",
    "start": "Bora →",
    "facts": "3 tentativas · 5, 10 ou 30 segundos · bata seu recorde"
  },
  "play": {
    "target": "Alvo {t}",
    "blindTag": "Às cegas",
    "attempt": "Tentativa {n} de {total}",
    "go": "Iniciar",
    "stop": "STOP",
    "next": "Próxima tentativa",
    "finish": "Ver meu resultado",
    "readyHint": "Aperte Iniciar e pare exatamente em {t}",
    "runHint": "Toque em qualquer lugar ou aperte Espaço para parar",
    "early": "{n} adiantado",
    "late": "{n} atrasado",
    "perfect": "Perfeito! Exatamente {t} 🎉",
    "cancelled": "Você saiu da página, então essa tentativa não conta. De novo!",
    "hidden": "??:??.??",
    "change": "← Mudar modo",
    "clockAria": "Cronômetro",
    "sec": "{n} s"
  },
  "result": {
    "over": "Seu resultado",
    "mode": "Alvo {t}",
    "perfect": "Exatamente {t}! Parada perfeita 🎉",
    "bestLabel": "Tentativa mais próxima, erro de",
    "stoppedAt": "Parou em {time}",
    "tierLabel": "Seu relógio interno",
    "tiers": [
      "🐌 Perdido no tempo",
      "⏳ Mais ou menos",
      "🙂 Bom relógio interno",
      "🎯 Timing preciso",
      "⚡ Fera dos centésimos",
      "🧠 Cronômetro humano"
    ],
    "newBest": "Novo recorde pessoal!",
    "pb": "Seu recorde neste modo: {n}",
    "avg": "Erro médio",
    "listLabel": "Suas 3 tentativas",
    "top": "Top {n}%",
    "beat": "Mais preciso que {pct}% dos jogadores",
    "beatAll": "Mais preciso que todos os outros jogadores até agora",
    "others": "Comparado com outras {n} partidas neste modo",
    "comparing": "Comparando com outros jogadores…",
    "shareTitle": "Desafio dos 10 segundos",
    "shareText": "Parei o cronômetro a só {n} de {t} ⏱️ {tier}. Você consegue cravar?",
    "retry": "Jogar de novo"
  },
  "og": {
    "brand": "⏱️ Desafio dos 10 segundos",
    "defaultKicker": "Jogo de timing grátis",
    "defaultTitle": "Você para o cronômetro em 10,00 cravado?",
    "defaultDesc": "3 tentativas · modo às cegas · 5, 10 ou 30 segundos"
  },
  "faq": [
    {
      "q": "Como se joga?",
      "a": "Escolha um tempo alvo (5, 10 ou 30 segundos) e aperte Iniciar. O cronômetro começa no instante do toque. Conte de cabeça e aperte STOP, toque em qualquer lugar da tela do jogo ou aperte Espaço quando achar que o tempo passou. São três tentativas por partida, e a mais próxima é o seu resultado."
    },
    {
      "q": "O que faz o modo às cegas?",
      "a": "No modo às cegas os números viram pontos de interrogação depois dos primeiros 3 segundos, e você precisa continuar contando só no feeling. É bem mais difícil, e o modo tem recorde próprio e comparação separada com outros jogadores."
    },
    {
      "q": "Por que é tão difícil cravar 10,00?",
      "a": "Seu dedo leva um instante para reagir e a contagem de cabeça escorrega um pouco em dez segundos, então mesmo uma boa parada fica alguns centésimos antes ou depois. O cronômetro usa o momento exato do seu toque e mostra centésimos como um cronômetro de verdade. Um 10,00 cravado é raro, e é isso que deixa tudo divertido."
    },
    {
      "q": "Por que minha tentativa não valeu?",
      "a": "Se você trocar de aba, bloquear o celular ou sair da página com o cronômetro rodando, a tentativa é cancelada para ser justo. É só começar a mesma tentativa de novo."
    }
  ],
  "privacy": {
    "title": "Política de Privacidade | Desafio dos 10 segundos",
    "description": "Política de Privacidade do Desafio dos 10 segundos: pontuações anônimas, cookies, publicidade e estatísticas.",
    "h1": "Política de Privacidade",
    "introHtml": "Desafio dos 10 segundos (o \"Serviço\") respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta nem login. Ao fim de uma partida, só a sua pontuação (quantos milissegundos sua melhor tentativa errou) é enviada ao nosso servidor como contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seu recorde, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam só totais diários por idioma (visualizações de página, partidas iniciadas e terminadas, avaliações). Nada disso identifica você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política vale a partir de 2 de novembro de 2026."
      ]
    ],
    "back": "← Voltar para Desafio dos 10 segundos"
  }
};
