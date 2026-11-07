/* Ski Downhill — pt-BR (Jogo de esqui)
 * As regras ficam em ski-core.js; este arquivo só tem os textos visíveis.
 * Chaves terminadas em Html entram como HTML (só <br> e <em>); privacy.sections também.
 * Mantenha os marcadores {n} {pct} {s} {c} {tier}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap",
    "display": "'Oswald'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Jogo de esqui online – Descida e slalom",
    "description": "Jogo de esqui online: desça uma pista de neve sem fim, desvie de pinheiros, pedras e bonecos de neve e passe pelas portas de slalom para ganhar metros extras. Celular ou PC.",
    "ogTitle": "Jogo de esqui ⛷️ Até onde você chega antes de cair?",
    "ogDescription": "Desça uma pista infinita, passe pelas portas de slalom e desvie dos pinheiros. Bateu, acabou."
  },
  "siteName": "Jogo de esqui",
  "privacyLink": "Privacidade",
  "start": {
    "badge": "⛷️ Neve fresquinha, pista sem fim",
    "h1Kicker": "Jogo de esqui online",
    "h1Html": "Desça a montanha<br><em>o mais longe que der</em>",
    "hook": "A pista nunca acaba e o esqui fica cada vez mais rápido. Costure entre pinheiros e bandeiras e veja quantos metros você aguenta antes de levar um tombo.",
    "how": {
      "steer": "Segure um lado da tela",
      "gates": "Passe entre as bandeiras",
      "avoid": "Desvie das árvores"
    },
    "start": "Bora pra pista →",
    "facts": "Segure a tela ou teclas ← → · celular ou PC · bata seu recorde"
  },
  "play": {
    "dist": "Distância",
    "best": "Recorde",
    "pause": "Pausar",
    "paused": "Pausado",
    "resume": "Continuar descendo",
    "hint": "Toque para largar",
    "fieldAria": "Pista de esqui: segure a metade esquerda ou direita para virar",
    "gateOk": "+{n} m ×{c}",
    "gateMiss": "Porta perdida"
  },
  "result": {
    "over": "Sua descida",
    "unit": "m",
    "newBest": "Novo recorde pessoal!",
    "best": "Seu recorde: {n} m",
    "gates": "Portas passadas",
    "time": "Tempo",
    "timeValue": "{s} s",
    "tierLabel": "Seu nível no esqui",
    "tiers": [
      "🧊 Pista de iniciante",
      "🟢 Pista verde",
      "🔵 Pista azul",
      "⚫ Pista preta",
      "⚡ Foguete da neve",
      "🏆 Lenda da montanha"
    ],
    "top": "Top {n}%",
    "beat": "Mais longe que {pct}% dos esquiadores",
    "beatAll": "Mais longe que todos os outros até agora",
    "others": "Comparado com outras {n} descidas",
    "comparing": "Comparando com outros esquiadores…",
    "shareTitle": "Jogo de esqui",
    "shareText": "Desci {n} m de montanha ⛷️ {tier}. E você, chega até onde?",
    "retry": "Descer de novo"
  },
  "og": {
    "brand": "⛷️ Jogo de esqui",
    "defaultKicker": "Jogo de esqui online",
    "defaultTitle": "Até onde você chega antes de cair?",
    "defaultDesc": "Pista sem fim · portas de slalom · celular ou PC"
  },
  "faq": [
    {
      "q": "Como controlo o esquiador?",
      "a": "Segure o dedo ou o mouse na metade esquerda ou direita da pista, ou segure as teclas ← → (ou A / D). O esquiador inclina e desliza suave para aquele lado; solte para voltar a descer reto. A descida começa no seu primeiro toque ou tecla."
    },
    {
      "q": "Pra que servem as bandeiras?",
      "a": "Duas bandeiras da mesma cor formam uma porta. Passe entre elas para ganhar metros extras e emende várias portas seguidas para subir o combo e aumentar cada bônus. Perder uma porta não acaba a descida, mas zera o combo."
    },
    {
      "q": "Como a distância é contada?",
      "a": "Somam-se os metros que você desceu e os bônus das portas. Quanto mais longe, mais rápido fica, e a descida termina assim que você bate num pinheiro, numa pedra ou num boneco de neve. Seu recorde fica salvo neste navegador."
    },
    {
      "q": "E se eu trocar de aba?",
      "a": "O jogo pausa sozinho quando você sai da página ou bloqueia o celular. Toque em “Continuar descendo” (ou na tecla P) para seguir exatamente de onde parou."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Jogo de esqui",
    "description": "Política de privacidade do jogo de esqui: pontuações anônimas, cookies, publicidade e estatísticas.",
    "h1": "Política de privacidade",
    "introHtml": "O jogo de esqui (o \"Serviço\") respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta e sem login. Quando uma descida termina, só a sua distância em metros é enviada ao nosso servidor como contagem anônima, sem nome nem identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo."
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
        "Esta política vale a partir de 8 de novembro de 2026."
      ]
    ],
    "back": "← Voltar ao jogo de esqui"
  }
};
