/* 집순이·집돌이 지수 테스트 — pt
 * questions[i].choices[j] 는 homebody-core.js QUESTIONS[i].choices[j] 와 같은 순서(점수는 core 에만 있다). 키 구조는 en.js 와 동일.
 * Keys ending in Html are raw HTML (start.h1Html: <br> 1개 + <em> 만). 결과 단계 6종 id 는 homebody-core.js ORDER 와 같다.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep as-is when translating.
 * 스포일러 금지: meta / og.default* / start / faq / loading 에는 결과 이름·질문 문구를 인용하지 않는다.
 * fonts: css = Google Fonts, display = 제목/버튼 글꼴 스택, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap",
    "display": "'Comfortaa'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Teste de caseiro – Quanto você é caseiro?",
    "description": "Você é caseiro ou caseira? Faça este teste de caseiro grátis: 10 situações do dia a dia, cerca de 1 minuto, sem cadastro. Descubra sua porcentagem de caseiro e quanto você ama o sofá.",
    "ogTitle": "Teste de caseiro 🏠 Quanto você é caseiro?",
    "ogDescription": "Um teste grátis de 1 minuto. Responda 10 situações do dia a dia e veja sua porcentagem de caseiro."
  },
  "siteName": "Teste de caseiro",
  "privacyLink": "Política de privacidade",
  "start": {
    "badge": "🏠 Índice de caseiro",
    "h1Kicker": "Teste de caseiro",
    "h1Html": "Quanto você é<br><em>caseiro</em>?",
    "hook": "Dez situações pequenas mostram o quanto você ama o seu lar e o quanto o mundo lá fora precisa se esforçar.",
    "metaTime": "⏱️ Cerca de 1 min",
    "metaCount": "🛋️ 10 perguntas",
    "start": "Ver meu nível →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Contando seus pontos de aconchego…",
    "sub": "Conferindo o sofá"
  },
  "result": {
    "title": "Teste de caseiro: sou {name}",
    "eyebrow": "Seu perfil de caseiro é",
    "strengthsLabel": "Seus superpoderes",
    "othersLabel": "Como os outros veem você",
    "bestLabel": "Par ideal",
    "clashLabel": "Perfil oposto",
    "meterLabel": "Nível de caseiro",
    "moreShare": "{pct}% dos jogadores são mais caseiros que você",
    "shareText": "Sou {name} {emoji} — “{vibe}” E você, quanto é caseiro?",
    "shareTextPct": "Sou {pct}% caseiro: {name} {emoji}. E você?",
    "ctaStrong": "Um amigo compartilhou o resultado",
    "ctaSub": "Quanto você é caseiro? Leva 1 minuto.",
    "retry": "Refazer o teste"
  },
  "og": {
    "eyebrow": "Meu nível de caseiro",
    "brand": "🏠 Teste de caseiro",
    "defaultKicker": "Teste de caseiro",
    "defaultTitle": "Quanto você é caseiro?",
    "defaultDesc": "10 situações do dia a dia · cerca de 1 minuto"
  },
  "faq": [
    {
      "q": "Como minha porcentagem de caseiro é calculada?",
      "a": "Cada resposta vale de 0 a 10 pontos para o lado de casa. Os pontos das suas dez respostas são somados e levados para uma escala de 0 a 100: quanto maior a porcentagem, mais você prefere ficar em casa."
    },
    {
      "q": "Caseiro é a mesma coisa que introvertido?",
      "a": "Não exatamente. Introversão é sobre de onde vem sua energia; ser caseiro é sobre onde você gosta de passar o tempo. Muitos extrovertidos amam o sofá e muitos introvertidos amam longas caminhadas."
    },
    {
      "q": "Esse teste é científico?",
      "a": "Não. É um quiz leve para se divertir e puxar conversa, não uma avaliação psicológica. O resultado só reflete suas respostas de hoje."
    },
    {
      "q": "Como é calculado “mais caseiro que X% dos jogadores”?",
      "a": "Contamos de forma anônima em qual faixa de pontos cada teste concluído cai. Quando há pelo menos 20 resultados, comparamos o seu com eles. A linha só aparece no seu próprio resultado e fica escondida enquanto houver poucos jogadores."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Teste de caseiro",
    "description": "Política de privacidade do Teste de caseiro: cookies, publicidade e estatísticas anônimas.",
    "h1": "Política de privacidade",
    "introHtml": "O Teste de caseiro (o “Serviço”) respeita a sua privacidade e trata apenas o mínimo de informação necessário, como descrito abaixo.",
    "sections": [
      [
        "1. Informações coletadas",
        "Você pode usar o Serviço sem cadastro nem login. As respostas são calculadas no seu navegador e nunca são enviadas nem guardadas nos nossos servidores. Só contamos, de forma anônima, qual faixa de pontos saiu, para mostrar quão comum é cada resultado."
      ],
      [
        "2. Cookies e tecnologias parecidas",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar direito."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e ajuste nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Guardamos totais diários anônimos (visualizações, testes concluídos, avaliações) para melhorar o Serviço. Eles não identificam você."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta política, fale com o responsável pelo site."
      ],
      [
        "6. Vigência",
        "Esta política vale desde 21 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao teste de caseiro"
  },
  "questions": [
    {
      "q": "Sexta à noite, o grupo do zap acende: “Bora tomar uma no centro?”",
      "choices": [
        "Responder “fica pra próxima” e ir feliz pra casa",
        "Ir por uma hora e depois sumir de fininho",
        "Fazer uma contraproposta: na casa de alguém com comida por delivery",
        "Ir e ficar até fecharem o bar"
      ]
    },
    {
      "q": "Um feriadão sem nada marcado. Seu plano ideal?",
      "choices": [
        "Fazer a mala e viajar de última hora",
        "Não sair de casa, de propósito",
        "Um bate-e-volta e dormir na minha cama",
        "Um café ou parque por perto e depois casa"
      ]
    },
    {
      "q": "A campainha toca e você não esperava ninguém. Você…",
      "choices": [
        "Abre, meio surpreso",
        "Olha primeiro pelo olho mágico",
        "Adora: visita surpresa é o melhor",
        "Fica imóvel esperando a pessoa ir embora"
      ]
    },
    {
      "q": "Onde você mais gostaria de morar?",
      "choices": [
        "Numa casa tranquila com meu cantinho",
        "No meio de uma cidade agitada",
        "Num ninho onde tudo está ao alcance da mão",
        "Num apê com uma boa varanda perto da agitação"
      ]
    },
    {
      "q": "É um domingo chuvoso. Qual o seu primeiro pensamento?",
      "choices": [
        "O melhor clima: cobertor, chá, janela",
        "Poxa, lá se vão meus planos",
        "Finalmente uma desculpa perfeita para ficar em casa",
        "Tá bom, vou achar um programa em lugar coberto"
      ]
    },
    {
      "q": "Um amigo te convida para um evento daqui a duas semanas.",
      "choices": [
        "Primeiro vejo minha agenda",
        "Já começo a pensar em como cancelar sem climão",
        "Tô dentro!",
        "Digo que sim e vou ficando ansioso conforme chega a data"
      ]
    },
    {
      "q": "Você chega em casa depois de um dia inteiro fora. Você se sente…",
      "choices": [
        "Ainda cheio de energia, pronto pra mais",
        "Cansado de um jeito bom",
        "Finalmente: porta trancada, celular no silencioso",
        "Aliviado, como uma bateria carregando"
      ]
    },
    {
      "q": "É hora do jantar. Onde você quer estar?",
      "choices": [
        "Cozinhando em casa",
        "Fora, mas num lugarzinho tranquilo",
        "Num restaurante animado cheio de gente",
        "No sofá com delivery e uma série"
      ]
    },
    {
      "q": "Quantos dias seguidos você aguenta em casa sem ficar maluco?",
      "choices": [
        "Um dia já basta",
        "Semanas, e nem notaria",
        "Uns três dias",
        "Uma semana, tranquilo"
      ]
    },
    {
      "q": "Sobrou um dinheirinho. Você gasta com…",
      "choices": [
        "Uma noite com os amigos",
        "Ingressos e viagens",
        "Gadgets, jogos ou streaming pro sofá",
        "Mais conforto: uma boa poltrona, abajur, roupa de cama"
      ]
    }
  ],
  "types": {
    "wild": {
      "name": "Nascido pra rua",
      "vibe": "Casa é onde você larga a mochila antes de sair de novo.",
      "desc": "Para você, a porta de casa é uma porta giratória. Um dia inteiro dentro parece um dia perdido, e suas melhores ideias surgem numa trilha, num trem ou numa varanda. Você recarrega com gente e ar livre e coleciona planos como outras pessoas colecionam canecas. Sua casa é, na maior parte, lugar de dormir, tomar banho e trocar de sapato.",
      "strengths": [
        "Energia sem fim",
        "Diz sim à aventura",
        "Nunca fica entediado"
      ],
      "others": "Os outros veem você como quem sempre tem plano e consegue tirar todo mundo do sofá."
    },
    "roamer": {
      "name": "Andarilho de fim de semana",
      "vibe": "Mais fora do que dentro, mas ama uma boa soneca.",
      "desc": "Você adora sair, principalmente com amigos, mas também conhece a alegria de uma noite que termina cedo. Sua semana é cheia de planos e uma noite tranquila em casa é um presente, não um hábito. Você gosta de variedade: um café novo, uma viagem curta, uma rua que ainda não explorou.",
      "strengths": [
        "Sociável e curioso",
        "Planos flexíveis",
        "Bom em começar coisas"
      ],
      "others": "Os outros veem você como simpático e animado, sempre pronto para um café, mas que às vezes some para recarregar."
    },
    "switch": {
      "name": "Equilibrista de rolês",
      "vibe": "Metade sofá, metade cidade, totalmente adaptável.",
      "desc": "Você curte uma noite agitada e uma noite silenciosa em casa com o mesmo sorriso. Nenhuma é sacrifício: você lê sua energia do dia e a segue. Isso faz de você boa companhia tanto para amigos baladeiros quanto para caseiros. Seu único desafio é decidir qual lado ouvir numa sexta.",
      "strengths": [
        "Combina com qualquer plano",
        "Lê a própria energia",
        "Boa companhia"
      ],
      "others": "Os outros veem você como tranquilo e difícil de definir, o amigo que encaixa em qualquer plano."
    },
    "nester": {
      "name": "Ninho aconchegante",
      "vibe": "Feliz com um cobertor, um abajur e o plano de ficar.",
      "desc": "Em casa você é mais você. Deixou tudo confortável de propósito: a luz certa, a poltrona certa, os petiscos certos. Você sai pelas pessoas importantes, mas mantém as noites curtas e a saída perto. Seu evento ideal tem hora para começar, hora para acabar e um sofá por perto.",
      "strengths": [
        "Deixa qualquer lugar aconchegante",
        "Gasta energia com sabedoria",
        "Ótimo anfitrião em casa"
      ],
      "others": "Os outros veem você como caloroso e calmo, o amigo na casa de quem todo mundo quer ficar."
    },
    "homebody": {
      "name": "Caseiro certificado",
      "vibe": "Seus melhores planos são os que você cancela.",
      "desc": "Você ama de verdade ficar em casa e parou de pedir desculpas por isso. Seu espaço é ao mesmo tempo estação de recarga, quarto de hobbies e refúgio. Convites ganham uma pausa educada antes da resposta, e um fim de semana sem nada na agenda é um presente. Você não é antissocial: só escolhe com cuidado seus passeios.",
      "strengths": [
        "Feliz sozinho",
        "Mundo interior rico",
        "Protege sua paz"
      ],
      "others": "Os outros veem você como calmo, um pouco misterioso e surpreendentemente engraçado quando está no seu elemento."
    },
    "legend": {
      "name": "Lenda do lar",
      "vibe": "A porta é uma sugestão. O sofá é um reino.",
      "desc": "Você transformou ficar em casa em arte. Os apps de delivery sabem seu nome, seu cantinho é otimizado e sua bateria social carrega no silêncio. Você passa dias sem lembrar do mundo lá fora e está perfeitamente bem. Quando sai, é por algo que vale muito a pena, e já planeja a volta antes de ir.",
      "strengths": [
        "Mestre do conforto",
        "Totalmente autossuficiente",
        "Zero FOMO"
      ],
      "others": "Os outros veem você como uma lenda: raramente avistado, sempre em paz e a pessoa certa para pedir indicação de série."
    }
  }
};
