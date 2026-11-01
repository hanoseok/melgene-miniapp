/* Attachment Style Test (pt — Brazilian Portuguese, "você")
 * 4 result ids (secure anxious avoidant fearful);
 * questions[i].choices[j] follow attach-core.js QUESTIONS[i].w[j] (the [anxiety, avoidance] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Kind, non-judgmental wording: every style is a way of coping that once made sense, and styles can change.
 * Just for fun and self-reflection — not a clinical or psychological diagnosis.
 * Placeholders: {name} {nick} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Teste de estilo de apego – Qual é o meu estilo de apego?",
    "description": "Teste de estilo de apego com 11 perguntas do dia a dia sobre amigos, família e relacionamentos. Leva uns 2 minutos, sem cadastro, com dicas gentis.",
    "ogTitle": "Teste de estilo de apego 🫂 Como você se conecta?",
    "ogDescription": "Onze situações do dia a dia com amigos, família e parceiros. Descubra seu estilo de apego, seus pontos fortes e dicas carinhosas para se aproximar."
  },
  "siteName": "Teste de estilo de apego",
  "privacyLink": "Política de Privacidade",
  "start": {
    "badge": "🫂 Como você se conecta?",
    "h1Kicker": "Teste de estilo de apego",
    "h1Html": "Como você ama<br>e se <em>conecta</em>?",
    "hook": "Uma resposta que demora no WhatsApp, um rolê cancelado, um amigo que de repente se abre com você. O jeito como você reage a esses pequenos momentos diz muito sobre como você cria laços. Responda a onze perguntas do cotidiano e conheça o seu estilo de apego.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 perguntas",
    "start": "Descobrir meu estilo →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "Pergunta {n}"
  },
  "loading": {
    "text": "Lendo nas entrelinhas…",
    "sub": "Mapeando como você se conecta com as pessoas"
  },
  "result": {
    "title": "Meu estilo de apego: {name}",
    "metaDesc": "Resultado do teste de estilo de apego: {name}, {nick}. {vibe} Veja seus pontos fortes e três dicas carinhosas para os seus relacionamentos.",
    "eyebrow": "Seu estilo de apego",
    "gaugeLabel": "Para onde suas respostas pesaram",
    "axes": [
      ["Tranquilo", "Preocupado"],
      ["Se aproxima", "Precisa de espaço"]
    ],
    "strengthsLabel": "Seus pontos fortes",
    "tipsLabel": "Dicas para os seus relacionamentos",
    "matchLabel": "Combina bem com",
    "disclaimer": "Só por diversão e autoconhecimento. Este é um teste leve, não uma avaliação nem um diagnóstico psicológico. O estilo de apego pode mudar com o tempo e de uma relação para outra. Se os relacionamentos costumam doer muito, conversar com um psicólogo pode ajudar de verdade.",
    "sameShare": "{pct}% das pessoas tiveram este estilo",
    "shareText": "Meu estilo de apego é {name} {emoji} “{vibe}” E o seu?",
    "ctaStrong": "Um amigo compartilhou o estilo de apego dele",
    "ctaSub": "Como você se conecta? Descubra em 2 minutos.",
    "retry": "Fazer o teste de novo"
  },
  "og": {
    "eyebrow": "Meu estilo de apego",
    "brand": "🫂 Teste de estilo de apego",
    "defaultKicker": "Um teste gentil sobre vínculos",
    "defaultTitle": "Qual é o meu estilo de apego?",
    "defaultDesc": "11 perguntas · 2 minutos · como você se conecta"
  },
  "faq": [
    {
      "q": "Como o meu resultado é definido?",
      "a": "Cada resposta mexe um pouco em duas escalas que os pesquisadores usam para descrever o apego adulto: o quanto você se preocupa com a proximidade e o quanto se sente à vontade para contar com os outros. O resultado é o ponto onde as duas se encontram, e as mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "Isto é um diagnóstico psicológico?",
      "a": "Não. É um teste leve, feito para diversão e autoconhecimento, e não uma avaliação profissional ou científica. Estilo de apego não é um transtorno nem um rótulo fixo. Se os seus relacionamentos costumam ser dolorosos ou confusos, um psicólogo pode ajudar você a entender isso com calma."
    },
    {
      "q": "Meu estilo de apego pode mudar?",
      "a": "Pode, sim. Muita gente age de um jeito com uma pessoa e de outro jeito com outra, e relações acolhedoras, autoconhecimento e terapia ajudam a pessoa a se sentir mais tranquila com o tempo. Refaça o teste daqui a alguns meses e compare."
    },
    {
      "q": "Minhas respostas ficam salvas?",
      "a": "Não. As respostas são calculadas no seu navegador e não são armazenadas. Só contamos, de forma anônima, qual resultado apareceu, para mostrar o quanto ele é comum."
    }
  ],
  "privacy": {
    "title": "Política de Privacidade | Teste de estilo de apego",
    "description": "Política de Privacidade do Teste de estilo de apego — como usamos cookies, anúncios e estatísticas anônimas.",
    "h1": "Política de Privacidade",
    "introHtml": "O Teste de estilo de apego (o \"Serviço\") respeita a sua privacidade e trata apenas o mínimo de informações necessárias, conforme descrito abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "Você pode usar o Serviço sem se cadastrar nem fazer login. Suas respostas são calculadas no seu navegador e nunca são enviadas nem armazenadas em nossos servidores. Apenas contamos, de forma anônima, qual resultado apareceu, para mostrar o quanto cada resultado é comum."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar corretamente."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências de personalização de anúncios nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Guardamos totais diários anônimos (visualizações de página, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não identificam você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta Política de Privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política está em vigor desde 2 de novembro de 2026."
      ]
    ],
    "back": "← Voltar ao Teste de estilo de apego"
  },
  "questions": [
    {
      "q": "Um amigo próximo passou o dia inteiro sem responder sua mensagem no WhatsApp. O que passa pela sua cabeça?",
      "choices": [
        "Deve estar ocupado. Daqui a pouco ele responde.",
        "Releio minha mensagem tentando ver se falei algo errado.",
        "Sinceramente, nem reparo. Não sou de ficar trocando mensagem o tempo todo.",
        "Fico um pouco preocupado, depois digo a mim mesmo que não deveria ligar tanto."
      ]
    },
    {
      "q": "Alguém de quem você começou a se aproximar diz: “Adoro passar tempo com você.” Você…",
      "choices": [
        "Fica radiante, mas logo se pergunta se no mês que vem a pessoa ainda vai pensar assim",
        "Sente um quentinho no peito e diz que o sentimento é recíproco",
        "Fica feliz, mas sente uma vontade estranha de dar um passinho para trás",
        "Fica meio sem graça e muda de assunto com uma piada"
      ]
    },
    {
      "q": "Você está passando por uma semana bem difícil. O que costuma fazer?",
      "choices": [
        "Resolvo sozinho. Não gosto de depender dos outros.",
        "Tenho vontade de procurar alguém, mas fico quieto para não incomodar",
        "Conto para alguém próximo o que está acontecendo e deixo a pessoa me ajudar",
        "Mando mensagem para várias pessoas, torcendo para alguém perguntar como estou"
      ]
    },
    {
      "q": "Um amigo desmarca o programa de vocês em cima da hora.",
      "choices": [
        "Digo que tudo bem, mas decido em silêncio não contar tanto com ele",
        "No fundo fico até aliviado. Mais tempo só para mim!",
        "Fico pensando se ele não quer mesmo me ver",
        "Sem problema. A gente marca outro dia."
      ]
    },
    {
      "q": "Uma amizade nova começa a contar coisas pessoais. E você?",
      "choices": [
        "Também me abro, aos poucos, no ritmo que parecer natural",
        "Quero me abrir, mas travo no meio do caminho e recuo",
        "Conto muita coisa rápido. Quero que a gente fique próximo logo.",
        "Mantenho a conversa leve. Assunto pessoal fica comigo."
      ]
    },
    {
      "q": "Você e alguém próximo discordam sobre algo importante.",
      "choices": [
        "Quero resolver na hora. Esperar é insuportável.",
        "Preciso de espaço e fico quieto até a poeira baixar",
        "A gente conversa com calma, mesmo que seja um pouco desconfortável",
        "Fico dividido entre querer conversar e querer sumir"
      ]
    },
    {
      "q": "Alguém próximo vai viajar por uma semana. Quanto contato parece ideal?",
      "choices": [
        "A gente põe o papo em dia quando ela voltar. Gosto desse espaço.",
        "Algumas mensagens são legais, mas se não vier nenhuma, tudo bem",
        "Difícil dizer. Sinto falta, mas mensagem demais me deixa tenso.",
        "Uma notícia rapidinha todo dia. Gosto de sentir que estamos ligados."
      ]
    },
    {
      "q": "Alguém faz algo inesperadamente gentil por você.",
      "choices": [
        "Fico tocado, mas uma parte de mim se pergunta o que a pessoa quer em troca",
        "Adoro e sinto que preciso fazer ainda mais por ela",
        "Fico levemente desconfortável, como se agora estivesse devendo",
        "Agradeço e simplesmente aproveito"
      ]
    },
    {
      "q": "Pensando nas pessoas mais próximas de você, qual frase mais combina com você?",
      "choices": [
        "Confio que estarão lá por mim, e elas também podem contar comigo",
        "Gosto delas, mas fico mais feliz contando comigo mesmo",
        "Às vezes tenho medo de gostar mais delas do que elas de mim",
        "Quero estar perto, mas uma parte de mim espera sair machucada"
      ]
    },
    {
      "q": "Uma pessoa nova entra na sua turma e todo mundo parece adorá-la.",
      "choices": [
        "Tanto faz. Eu fico no meu cantinho com meus poucos amigos.",
        "Fico com um pouco de medo de ficar de fora",
        "Fico com o pé atrás até saber que posso confiar nela",
        "Que ótimo, mais uma pessoa para sair junto"
      ]
    },
    {
      "q": "Alguém pergunta com carinho: “Está tudo bem com você ultimamente?”",
      "choices": [
        "Digo “tô bem” e depois me arrependo de não ter falado mais",
        "Conto com sinceridade como estou",
        "Digo que estou bem e mudo de assunto. Eu me viro sozinho.",
        "Fico tão aliviado por alguém ter notado que desabafo tudo de uma vez"
      ]
    }
  ],
  "types": {
    "secure": {
      "name": "Seguro",
      "nick": "O Porto Tranquilo",
      "word": "apego seguro",
      "vibe": "Você consegue ficar perto sem se perder e longe sem perder a confiança.",
      "desc": "Você costuma confiar que as pessoas que ama vão estar presentes, e também se sente à vontade para estar presente para elas. A proximidade não assusta você, e um pouco de distância também não. Quando algo dá errado, em geral você consegue dizer o que sente sem explodir nem se fechar. As pessoas costumam ficar mais calmas perto de você, como se encontrassem um lugar tranquilo para pousar. Isso não quer dizer que você nunca se preocupa; quer dizer que normalmente encontra o caminho de volta para o equilíbrio.",
      "keywords": ["Confiante", "Aberto", "Equilibrado"],
      "strengths": ["Dizer o que precisa de forma simples e gentil", "Dar espaço aos outros sem se sentir rejeitado", "Fazer as pazes depois de uma briga em vez de ficar contando pontos"],
      "tips": ["Continue cuidando de você também. Ser a pessoa estável não significa carregar tudo sozinho.", "Quando alguém próximo parecer preocupado ou distante, lembre que pode ser um padrão antigo dele, e não um julgamento sobre você.", "Compartilhe como você mantém a calma. Um simples “isto é o que me ajuda” pode ser um presente para amigos que sofrem com isso."],
      "match": "Dois corações estáveis constroem relações leves e sinceras. A sua calma também ajuda qualquer estilo a se sentir mais tranquilo com o tempo."
    },
    "anxious": {
      "name": "Ansioso",
      "nick": "O Coração Dedicado",
      "word": "apego ansioso",
      "vibe": "Você ama de corpo e alma e sente cada pequena mudança no ar.",
      "desc": "Você se importa muito e percebe tudo: uma resposta mais curta, um tom diferente, um plano que fica para depois. Estar perto das pessoas é muito importante para você, então, quando uma ligação parece incerta, a cabeça corre para preencher as lacunas. Essa sensibilidade faz de você alguém caloroso, atento e leal. A preocupação não é um defeito; é sinal do quanto você valoriza as pessoas da sua vida. Com um pouco de carinho e prática, esse coração enorme pode se sentir calmo além de próximo.",
      "keywords": ["Carinhoso", "Atento", "Leal"],
      "strengths": ["Perceber o que os outros sentem antes que digam", "Demonstrar amor e gratidão com generosidade", "Se esforçar de verdade para manter as relações vivas"],
      "tips": ["Quando a preocupação apertar, respire antes de mandar aquela mensagem a mais. Pergunte a si mesmo o que você sabe, não o que você teme.", "Diga às pessoas o que acalma você, como um rápido “falo com você mais tarde”. Necessidades claras são mais fáceis de atender do que suposições.", "Construa uma vida que preencha você por si só: hobbies, amigos, momentos de silêncio. A tranquilidade cresce a partir de muitas âncoras, não de uma só."],
      "match": "Um parceiro ou amigo estável e constante ajuda suas preocupações a se acalmarem, e o seu carinho ajuda essa pessoa a se abrir."
    },
    "avoidant": {
      "name": "Evitativo",
      "nick": "O Espírito Livre",
      "word": "apego evitativo",
      "vibe": "Você valoriza a sua independência e cuida dos outros de um jeito discreto e prático.",
      "desc": "Você é autossuficiente e se vira bem sozinho. Gosta de gente, mas também precisa de bastante espaço, e emoção intensa demais pode dar vontade de dar um passo para trás. Isso não é frieza; muitas vezes é um hábito aprendido há muito tempo de confiar primeiro em si mesmo. Sua calma sob pressão e seu respeito pela liberdade dos outros são qualidades de verdade. Deixar as pessoas chegarem um pouco de cada vez pode deixar suas relações mais leves, e não mais pesadas.",
      "keywords": ["Independente", "Calmo", "Capaz"],
      "strengths": ["Manter a serenidade quando o clima fica tenso", "Respeitar o espaço e as escolhas dos outros", "Resolver problemas de um jeito prático e confiável"],
      "tips": ["Quando precisar de espaço, diga isso e diga quando vai voltar. “Preciso de uma noite só pra mim, a gente conversa amanhã” mantém a confiança.", "Tente compartilhar um pequeno sentimento por semana com alguém de confiança. A intimidade pode crescer em passos bem pequenos.", "Repare na vontade de se afastar justamente quando as coisas ficam boas. Ficar um pouquinho mais costuma ser onde a conexão se aprofunda."],
      "match": "Uma pessoa tranquila e paciente respeita o seu espaço sem levar para o lado pessoal, e isso facilita deixá-la chegar mais perto."
    },
    "fearful": {
      "name": "Desorganizado",
      "nick": "O Ouriço Sensível",
      "word": "apego desorganizado, apego temeroso",
      "vibe": "Você deseja proximidade e também sabe o quanto ela pode doer.",
      "desc": "Uma parte de você quer uma conexão profunda, e outra parte fica de guarda, pronta para proteger você. Por isso você às vezes se aproxima e depois recua, sem saber muito bem por quê. Como um ouriço no frio, você quer calor, mas tem medo dos espinhos. Essa mistura costuma vir de experiências em que estar perto nem sempre foi tranquilo. Você não é demais nem complicado demais: é perceptivo, sensível e muito empático, e com confiança e tempo pode se sentir perto e em paz ao mesmo tempo.",
      "keywords": ["Sensível", "Empático", "Perceptivo"],
      "strengths": ["Entender a dor dos outros porque você já sentiu", "Ler pessoas e situações com profundidade", "Valorizar muito a confiança quando ela é construída de verdade"],
      "tips": ["Dê nome ao vai e vem quando sentir. Dizer “uma parte de mim quer chegar perto e outra parte está com medo” é corajoso e ajuda muito.", "Escolha relações que pareçam calmas e constantes, e dê tempo para que elas mostrem quem são.", "Seja gentil consigo mesmo. Se feridas antigas continuam moldando o presente, um psicólogo pode ser um grande aliado."],
      "match": "Uma pessoa tranquila e constante, que continua gentil quando você vacila, pode mostrar aos poucos que a proximidade pode ser um lugar de paz."
    }
  }
};
