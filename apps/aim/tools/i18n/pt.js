/* Aim Trainer — pt (Treino de mira)
 * Rules live in aim-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {avg} {hits} {acc} {tier} — keep them as-is when translating.
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
    "title": "Treino de mira · Aim trainer online grátis",
    "description": "Treino de mira grátis: acerte 30 alvos o mais rápido possível ou o máximo que conseguir em 30 segundos. Tempo médio, precisão e ranking no celular ou PC.",
    "ogTitle": "Treino de mira 🎯 Sua mira é rápida e precisa?",
    "ogDescription": "Acerte 30 alvos ou jogue 30 segundos contra o relógio e veja seu tempo médio, sua precisão e seu selo de mira."
  },
  "siteName": "Treino de mira",
  "privacyLink": "Política de Privacidade",
  "start": {
    "badge": "🎯 Quanto vale sua mira?",
    "h1Kicker": "Treino de mira · Aim trainer",
    "h1Html": "Mire bem,<br><em>acerte rápido</em>",
    "hook": "Os alvos aparecem em qualquer lugar do quadro. Toque neles antes que sumam e descubra se sua mão é rápida e precisa.",
    "modeLabel": "Modo",
    "modes": {
      "classic": {
        "name": "Clássico",
        "sub": "30 alvos"
      },
      "timed": {
        "name": "Cronometrado",
        "sub": "30 segundos"
      }
    },
    "how": "Acerte o alvo do centro para começar · clicar fora conta como erro",
    "start": "Começar treino →",
    "facts": "Mouse, touchpad ou dedo · celular ou PC · supere seu recorde"
  },
  "modes": {
    "classic": "Clássico · 30 alvos",
    "timed": "Cronometrado · 30 segundos"
  },
  "play": {
    "time": "Tempo",
    "hits": "Acertos",
    "acc": "Precisão",
    "ready": "Acerte o alvo para começar",
    "readySub": "O relógio começa nesse primeiro acerto",
    "done": "Pronto!",
    "timeUp": "Acabou o tempo!",
    "cancelled": "Você saiu da página, então esta rodada não valeu. Tente de novo!",
    "change": "← Trocar modo",
    "areaAria": "Área de mira"
  },
  "result": {
    "over": "Seu resultado",
    "scoreClassic": "Tempo médio por alvo",
    "scoreTimed": "Alvos acertados",
    "unitMs": "ms",
    "unitHits": "acertos",
    "acc": "Precisão",
    "avg": "Tempo médio",
    "misses": "Erros",
    "total": "Tempo total",
    "escaped": "Escaparam",
    "msValue": "{n} ms",
    "secValue": "{n} s",
    "tierLabel": "Seu selo de mira",
    "tiers": [
      "🐢 Aquecendo",
      "🙂 Mira tranquila",
      "🎯 Olho afiado",
      "🦅 Olho de águia",
      "⚡ Mestre do flick",
      "🏆 Lenda da mira"
    ],
    "newBest": "Novo recorde pessoal!",
    "pbClassic": "Seu recorde no Clássico: {n} ms",
    "pbTimed": "Seu recorde no Cronometrado: {n} acertos",
    "invalid": "Isso é mais rápido do que uma pessoa consegue reagir, então este resultado não é salvo nem comparado.",
    "top": "Top {n}%",
    "beat": "Melhor que {pct}% dos jogadores",
    "beatAll": "Melhor que todos os outros jogadores até agora",
    "others": "Comparado com outras {n} rodadas neste modo",
    "comparing": "Comparando com outros jogadores…",
    "shareTitle": "Treino de mira",
    "shareClassic": "Média de {avg} ms por alvo com {acc}% de precisão 🎯 {tier}. Você mira mais rápido?",
    "shareTimed": "{hits} alvos em 30 segundos com {acc}% de precisão 🎯 {tier}. Consegue me superar?",
    "retry": "Jogar de novo"
  },
  "og": {
    "brand": "🎯 Treino de mira",
    "defaultKicker": "Aim trainer grátis",
    "defaultTitle": "Sua mira é rápida e precisa?",
    "defaultDesc": "30 alvos ou 30 segundos · celular ou PC"
  },
  "faq": [
    {
      "q": "Como funciona o treino de mira?",
      "a": "Escolha Clássico ou Cronometrado, aperte o botão e acerte o alvo no centro do quadro para começar. No Clássico aparecem 30 alvos, um de cada vez, e sua pontuação é o tempo médio que você leva para acertar cada um. No Cronometrado você tem 30 segundos para acertar o máximo possível; cada alvo encolhe aos poucos e escapa se você demorar."
    },
    {
      "q": "O que é uma boa pontuação?",
      "a": "No Clássico a maioria das pessoas fica entre 500 e 800 milissegundos por alvo, e quem joga bem fica abaixo de 450. No Cronometrado, de 35 a 45 acertos é comum. A precisão também conta: se menos de 70% dos seus cliques acertarem um alvo, seu selo cai um nível."
    },
    {
      "q": "Dá para jogar com mouse, touchpad ou tela de toque?",
      "a": "Dá, sim. Funcionam clique do mouse, touchpad, caneta e dedo; o teclado não é usado. Só contam os cliques dentro da área de jogo. Pontuações de aparelhos diferentes não são bem comparáveis: no mouse e no celular os resultados podem ser bem diferentes."
    },
    {
      "q": "Por que minha rodada não valeu?",
      "a": "Se você trocar de aba, bloquear o celular ou sair da página durante a rodada, ela é cancelada para ser justo. Resultados mais rápidos do que uma pessoa consegue reagir, como uma média abaixo de 150 milissegundos por alvo, não são salvos nem comparados com outros jogadores."
    }
  ],
  "privacy": {
    "title": "Política de Privacidade | Treino de mira",
    "description": "Política de Privacidade do Treino de mira: pontuações anônimas, cookies, publicidade e estatísticas.",
    "h1": "Política de Privacidade",
    "introHtml": "O Treino de mira (o \"Serviço\") respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta nem login. Ao fim de uma rodada, só a sua pontuação (tempo médio por alvo ou número de acertos) é enviada ao nosso servidor como contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo."
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
        "Esta política vale a partir de 6 de novembro de 2026."
      ]
    ],
    "back": "← Voltar para o Treino de mira"
  }
};
