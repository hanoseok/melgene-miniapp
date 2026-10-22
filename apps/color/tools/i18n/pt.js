/* Personal Color Test (pt)
 * 8 result ids (springlight springbright summerlight summermute autumnmute autumndeep winterbright winterdeep);
 * questions[i].choices[j] follow color-core.js QUESTIONS[i].w[j] (the [warm/cool, light/deep, bright/muted] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result name as people would search it — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the real server share. Swatch colors live in color-core.js.
 * A fun self-check, not a professional draping analysis (result disclaimer, FAQ, guide).
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {"css":"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap","display":"'Playfair Display'","displayWeight":700,"sans":"","wordBreak":"normal","hyphens":"manual"},
  "meta": {
    "title": "Teste de coloração pessoal: descubra sua cartela",
    "description": "Faça o teste de coloração pessoal: 12 perguntas para conferir no espelho, cerca de 2 minutos, sem foto e sem cadastro. Descubra sua cartela de cores. Só por diversão.",
    "ogTitle": "Teste de coloração pessoal 🎨 Quais cores iluminam seu rosto?",
    "ogDescription": "Um teste de coloração pessoal por estações com 12 perguntas no espelho. Descubra seu subtom e as cores que mais te valorizam."
  },
  "siteName": "Teste de coloração pessoal",
  "privacyLink": "Política de privacidade",
  "start": {
    "badge": "🎨 Autoteste no espelho",
    "h1Kicker": "Teste de coloração pessoal",
    "h1Html": "Quais cores fazem<br>seu rosto <em>brilhar</em>?",
    "hook": "Pegue um espelho e procure a luz do dia. Responda 12 perguntas rápidas sobre sua pele, cabelo, olhos e as cores que rendem elogios, e descubra sua cartela de estação.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🪞 12 perguntas",
    "start": "Ver minhas cores →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Montando sua cartela…",
    "sub": "Testando cada tom contra a luz"
  },
  "result": {
    "title": "Minha coloração pessoal: {name}",
    "metaDesc": "Resultado do teste de coloração pessoal: {name}. {vibe} Veja as melhores cores, as que é melhor evitar e dicas de maquiagem, cabelo e acessórios.",
    "eyebrow": "Sua coloração pessoal é",
    "gaugeLabel": "Para onde suas respostas pesaram",
    "axes": [
      ["Quente", "Frio"],
      ["Claro", "Profundo"],
      ["Brilhante", "Suave"]
    ],
    "paletteLabel": "Suas melhores cores",
    "avoidLabel": "Cores para usar com moderação",
    "avoidNote": "Não são proibidas, só ficam mais difíceis perto do rosto. Use em sapatos, bolsas ou calças.",
    "makeupLabel": "Maquiagem",
    "hairLabel": "Cor do cabelo",
    "jewelryLabel": "Acessórios",
    "disclaimer": "Um autoteste divertido, não uma análise de coloração profissional. O teste de tecidos de verdade é feito com luz controlada, e a iluminação, as telas e a maquiagem mudam a forma como vemos as cores.",
    "sameShare": "{pct}% das pessoas tiveram esta cartela",
    "shareText": "Minha coloração pessoal: {name} {emoji} “{vibe}” E a sua?",
    "ctaStrong": "Alguém compartilhou a cartela com você",
    "ctaSub": "Quente ou fria? Descubra em 2 minutos.",
    "retry": "Refazer o teste"
  },
  "og": {
    "eyebrow": "Minha coloração pessoal",
    "brand": "🎨 Teste de coloração pessoal",
    "defaultKicker": "Teste de coloração por estações",
    "defaultTitle": "Quais cores iluminam seu rosto?",
    "defaultDesc": "12 perguntas no espelho · 2 minutos"
  },
  "faq": [
    {
      "q": "Como o teste descobre minhas cores?",
      "a": "Cada resposta move um pouco três escalas: subtom quente ou frio, claro ou profundo, e brilhante ou suave. Seu resultado é a cartela de estação onde essas três se encontram. As mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "É tão preciso quanto uma análise de coloração com consultora?",
      "a": "Não. É um autoteste divertido baseado no que você consegue ver no espelho. Uma análise profissional compara tecidos no seu rosto sob luz neutra, algo que um quiz não consegue fazer. Use seu resultado como ponto de partida para experimentar."
    },
    {
      "q": "Como consigo uma resposta mais confiável?",
      "a": "Responda com luz natural perto de uma janela, de rosto limpo e com o cabelo preso. Lâmpadas, filtros do celular e cabelo tingido podem deixar as cores mais quentes ou mais frias do que realmente são."
    },
    {
      "q": "Minhas respostas ou fotos ficam salvas?",
      "a": "O teste nunca pede foto. Suas respostas são calculadas no seu navegador e não são armazenadas. Só contamos, de forma anônima, qual resultado saiu, para mostrar o quanto ele é comum."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Teste de coloração pessoal",
    "description": "Política de privacidade do Teste de coloração pessoal: como usamos cookies, publicidade e estatísticas anônimas.",
    "h1": "Política de privacidade",
    "introHtml": "O Teste de coloração pessoal (o \"Serviço\") respeita sua privacidade e trata apenas o mínimo de informações necessário, conforme descrito abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "Você pode usar o Serviço sem cadastro nem login, e ele nunca pede uma foto. Suas respostas são calculadas no seu navegador e nunca são enviadas nem armazenadas em nossos servidores. Só contamos, de forma anônima, qual resultado saiu, para mostrar o quanto cada resultado é comum."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do seu navegador para lembrar seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; se fizer isso, alguns recursos podem não funcionar corretamente."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere a personalização de anúncios nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Mantemos totais diários anônimos (visualizações de página, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não identificam você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta Política de privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política está em vigor desde 23 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao Teste de coloração pessoal"
  },
  "questions": [
    {
      "q": "Na luz do dia, olhe as veias na parte de dentro do seu pulso. De que cor elas são?",
      "choices": [
        "Mais azuis ou roxas",
        "Mais verdes ou cor de oliva",
        "Uma mistura das duas, difícil dizer"
      ]
    },
    {
      "q": "Com quais acessórios sua pele fica mais bonita?",
      "choices": [
        "Ouro amarelo",
        "Prata ou platina",
        "Ouro rosé ou metal escovado e suave",
        "Peças brilhantes e chamativas, de qualquer metal"
      ]
    },
    {
      "q": "Depois de uma hora no sol sem protetor, sua pele normalmente…",
      "choices": [
        "Fica rosada, queima e quase não bronzeia",
        "Queima um pouco primeiro e depois bronzeia de leve",
        "Fica dourada e bronzeia com facilidade",
        "Raramente queima e escurece um pouco"
      ]
    },
    {
      "q": "Coloque uma blusa branca pura e outra off-white ou creme embaixo do queixo. Qual fica melhor?",
      "choices": [
        "O branco puro. Meu rosto fica fresco e iluminado",
        "Off-white ou creme. O branco fica duro em mim",
        "Sinceramente, não vejo diferença"
      ]
    },
    {
      "q": "Qual cor escura básica fica melhor perto do seu rosto?",
      "choices": [
        "Preto intenso. Marcante e elegante",
        "Marrom chocolate ou caramelo",
        "Grafite suave ou azul-marinho. O preto pesa",
        "Nenhuma: creme ou bege claro combinam mais comigo"
      ]
    },
    {
      "q": "Qual é a sua cor de cabelo natural (ou qual era na infância)?",
      "choices": [
        "Muito escuro, quase preto",
        "Castanho médio a escuro com reflexos acobreados ou dourados",
        "Castanho acinzentado suave ou castanho apagado",
        "Claro: castanho dourado, loiro morango ou loiro"
      ]
    },
    {
      "q": "Como você descreveria seus olhos?",
      "choices": [
        "Escuros e intensos, com o branco bem limpo",
        "Avelã quente, âmbar ou castanho dourado",
        "Cinza-castanho ou cinza-esverdeado suave, com tons misturados",
        "Claros e brilhantes, com um contorno externo bem marcado"
      ]
    },
    {
      "q": "Com quais cores de roupa você recebe mais elogios?",
      "choices": [
        "Cores vivas como azul-cobalto ou rosa pink",
        "Tons suaves e empoeirados como rosa antigo ou verde sálvia",
        "Tons pastel claros e leves",
        "Tons ricos e profundos como bordô ou verde-floresta"
      ]
    },
    {
      "q": "Qual é o contraste entre seu cabelo e sua pele?",
      "choices": [
        "Alto. Meu cabelo se destaca bastante da pele",
        "Algo no meio-termo",
        "Baixo e claro. Os dois são suaves e claros",
        "Baixo e profundo. Os dois são intensos e de tom parecido"
      ]
    },
    {
      "q": "Sem maquiagem, seus lábios e bochechas parecem…",
      "choices": [
        "Rosados",
        "Pêssego ou coral",
        "Pálidos e bege, com pouca cor",
        "Naturalmente intensos, quase cor de frutas vermelhas"
      ]
    },
    {
      "q": "Qual blush fica mais natural em você?",
      "choices": [
        "Pêssego ou coral",
        "Rosa bebê ou rosa antigo",
        "Terracota ou tijolo suave",
        "Frutas vermelhas ou ameixa"
      ]
    },
    {
      "q": "Qual clima mais combina com você no espelho?",
      "choices": [
        "Ensolarado e fresco, como uma limonada num piquenique",
        "Leve e suave, como lavanda na neblina da manhã",
        "Aconchegante e intenso, como um chá de especiarias perto da lareira",
        "Nítido e dramático, como as luzes da cidade à noite"
      ]
    }
  ],
  "types": {
    "springlight": {
      "name": "Primavera Clara",
      "word": "primavera clara",
      "vibe": "Quente, delicada e cheia de luz da manhã.",
      "desc": "Sua coloração é quente, mas suave, com um brilho dourado delicado e quase nenhum contraste forte. Tons claros, limpos e levemente quentes deixam sua pele com aspecto fresco e descansado, enquanto cores pesadas ou muito escuras ficam por cima de você em vez de combinar com você. Pense em pêssego, amarelo manteiga, água-marinha clara e rosa quente: cores que parecem misturadas com sol.",
      "keywords": ["Quente", "Clara", "Fresca"],
      "makeup": "Blush pêssego ou damasco, um batom coral ou rosa quente translúcido e delineador marrom suave ou bronze no lugar do preto.",
      "hair": "Loiro dourado, mel ou castanho caramelo claro. Evite tons muito escuros ou acinzentados, que fazem sombra no rosto.",
      "jewelry": "Ouro amarelo claro, ouro rosé e peças delicadas. Pérolas em tom creme quente ficam lindas em você."
    },
    "springbright": {
      "name": "Primavera Brilhante",
      "word": "primavera brilhante",
      "vibe": "Quente, límpida e cheia de brilho.",
      "desc": "Você tem coloração quente com um ar vivo e límpido, muitas vezes com olhos brilhantes e um contraste fresco. Cores saturadas e ensolaradas despertam o seu rosto, enquanto tons empoeirados ou acinzentados podem dar um ar cansado. Coral, tangerina, amarelo girassol, turquesa e verde grama são o seu playground. Você pode usar cor em doses generosas e continuar parecendo você.",
      "keywords": ["Quente", "Límpida", "Vibrante"],
      "makeup": "Batom coral ou vermelho quente, um blush pêssego vivo e um toque de iluminador. Um delineador marrom quente ou verde-petróleo dá destaque.",
      "hair": "Castanho dourado quente, acobreado ou castanho brilhante. Reflexos quentes e luminosos valorizam mais do que cores opacas e acinzentadas.",
      "jewelry": "Ouro amarelo polido, esmaltados coloridos e pedras vivas. Acabamentos brilhantes ganham dos foscos em você."
    },
    "summerlight": {
      "name": "Verão Claro",
      "word": "verão claro",
      "vibe": "Fria, suave e leve como um céu limpo.",
      "desc": "Sua coloração é clara e fria, com subtom rosado ou neutro e um aspecto geral suave. Tons pastel frios e meios-tons delicados deixam sua pele lisa e luminosa, enquanto cores muito escuras, muito quentes ou neon podem apagar você. Azul bebê, lavanda, rosa suave e verde-menta são acertos garantidos. Pense em cores com um pouco de branco e um pouco de azul misturados.",
      "keywords": ["Fria", "Clara", "Suave"],
      "makeup": "Blush rosa ou rosa bebê, um batom rosa ou malva translúcido e delineador taupe ou cinza suave.",
      "hair": "Loiro acinzentado, castanho claro acinzentado ou loiro bege suave. Tons muito dourados ou alaranjados podem brigar com sua pele.",
      "jewelry": "Prata, ouro branco e platina, com pérolas, pedra da lua ou pedras azul-claro."
    },
    "summermute": {
      "name": "Verão Suave",
      "word": "verão suave",
      "vibe": "Fria, calma e discretamente elegante.",
      "desc": "Sua coloração vai de fria a neutra e é naturalmente esfumada, com pouco contraste entre cabelo, pele e olhos. Tons empoeirados e acinzentados deixam você com um ar refinado e sereno, enquanto cores muito vivas ou muito quentes podem parecer gritantes perto do rosto. Malva, rosa antigo, azul ardósia, sálvia e ameixa suave são sua assinatura. Looks tom sobre tom ficam especialmente elegantes em você.",
      "keywords": ["Fria", "Suave", "Calma"],
      "makeup": "Batom rosa antigo ou malva, blush rosa suave e delineador cinza-amarronzado ou ameixa para definir sem pesar.",
      "hair": "Castanho acinzentado, castanho frio cor de cogumelo ou loiro acinzentado suave. Evite dourado amarelado ou preto muito duro.",
      "jewelry": "Prata escovada, ouro branco e estanho suave. Acabamentos foscos e pérolas cinza têm tudo a ver com você."
    },
    "autumnmute": {
      "name": "Outono Suave",
      "word": "outono suave",
      "vibe": "Quente, gentil e suavemente dourada.",
      "desc": "Sua coloração é quente e esfumada, com uma suavidade terrosa e pouco contraste. Tons quentes e fechados ficam naturais e sofisticados em você, enquanto cores geladas ou muito vivas podem roubar sua cor. Caramelo, oliva, terracota suave, taupe quente e verde-musgo são seus melhores aliados. Combinar vários neutros quentes e suaves é um dos seus superpoderes.",
      "keywords": ["Quente", "Suave", "Terrosa"],
      "makeup": "Batom nude pêssego ou tijolo suave, blush terracota quente e delineador marrom ou cáqui.",
      "hair": "Castanho dourado suave, bege quente ou caramelo fechado. Evite cinza frio ou preto azulado, que apagam seu calor.",
      "jewelry": "Ouro fosco ou escovado, bronze e madeira, com pedras quentes como âmbar ou olho de tigre."
    },
    "autumndeep": {
      "name": "Outono Profundo",
      "word": "outono profundo",
      "vibe": "Quente, rica e cheia de profundidade.",
      "desc": "Você tem coloração quente com profundidade de verdade, muitas vezes cabelo ou olhos escuros e subtom dourado ou oliva. Tons terrosos ricos, picantes e saturados deixam você com um ar forte e radiante, enquanto tons pastel e gelados podem desbotar você. Ferrugem, chocolate, mostarda, oliva e verde-petróleo profundo são suas cores de poder. Você pode usar tons escuros sem que eles pesem.",
      "keywords": ["Quente", "Profunda", "Rica"],
      "makeup": "Batom vermelho tijolo, canela ou bordô quente, blush bronze ou terracota e delineador marrom escuro ou oliva.",
      "hair": "Chocolate intenso, castanho, ruivo escuro ou caramelo escuro. Cores muito claras ou acinzentadas podem parecer desconectadas do rosto.",
      "jewelry": "Ouro amarelo envelhecido ou intenso, cobre e bronze, com granada, olho de tigre ou pedras verde-escuras."
    },
    "winterbright": {
      "name": "Inverno Brilhante",
      "word": "inverno brilhante",
      "vibe": "Fria, vibrante e impossível de ignorar.",
      "desc": "Sua coloração é fria e límpida, muitas vezes com um contraste marcante entre cabelo, pele e olhos. Cores puras e brilhantes como joias, e o preto e branco bem nítidos, deixam você com um ar marcante e cheio de vida, enquanto tons fechados, bege ou empoeirados podem apagar seu brilho. Fúcsia, cobalto, esmeralda, vermelho puro e branco gelo são sua assinatura. Você pode usar a cor mais ousada do ambiente.",
      "keywords": ["Fria", "Límpida", "Contrastante"],
      "makeup": "Batom vermelho puro, fúcsia ou rosa frio, blush rosa vivo e delineador preto bem definido.",
      "hair": "Castanho escuro frio, preto azulado ou um tom frio e limpo. Reflexos caramelo quentes ou amarelados podem ficar sem vida em você.",
      "jewelry": "Prata polida, ouro branco e platina, com diamantes, safiras ou pedras de cores vivas."
    },
    "winterdeep": {
      "name": "Inverno Profundo",
      "word": "inverno profundo",
      "vibe": "Fria, profunda e discretamente dramática.",
      "desc": "Você tem coloração profunda com subtom frio ou neutro frio, muitas vezes com cabelo e olhos escuros. Tons frios e profundos e o preto puro ficam elegantes e poderosos em você, enquanto tons pastel quentes e claros e os beges podem dar um ar cansado. Preto, azul-marinho tinta, ameixa, bordô, verde-pinho e branco gelo para o contraste formam seu guarda-roupa ideal.",
      "keywords": ["Fria", "Profunda", "Elegante"],
      "makeup": "Batom frutas vermelhas, vinho ou ameixa escuro, blush rosa frio e delineador preto ou ameixa escuro.",
      "hair": "Café expresso profundo, castanho escuro frio ou preto suave. Tons dourados claros podem apagar sua profundidade natural.",
      "jewelry": "Prata, ouro branco ou grafite, com pedras profundas como rubi, ametista ou ônix."
    }
  }
};
