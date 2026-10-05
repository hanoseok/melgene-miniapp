/* Que animal você é? (pt)
 * Same 8 animal ids (wolf owl otter lion panda eagle sloth deer) and question/choice order as animal-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as animal-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name an animal result or quote a question.
 * types.<id>.word = the plain animal word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Que animal você é? Teste de personalidade animal",
    "description": "Que animal você é? Teste de personalidade com 8 situações do dia a dia: 2 a 3 minutos, grátis e sem cadastro. Descubra qual animal combina com você, seu par ideal e dicas.",
    "ogTitle": "Que animal você é? 🦊 Teste de personalidade animal",
    "ogDescription": "Um quiz rápido de 2 minutos. Responda a 8 situações do dia a dia e conheça o animal mais parecido com você."
  },
  "siteName": "Que animal você é?",
  "privacyLink": "Privacidade",
  "start": {
    "badge": "🦊 Teste de personalidade animal",
    "h1Kicker": "Que animal você é?",
    "h1Html": "Com qual animal<br>você se parece <em>mais</em>?",
    "hook": "Um plano cancelado, uma ligação de madrugada, uma festa onde você só conhece uma pessoa… Alguns momentos do dia a dia revelam seu lado selvagem.",
    "metaTime": "⏱️ 2 a 3 minutos",
    "metaCount": "🐾 8 perguntas",
    "start": "Descobrir meu animal →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Seguindo suas pegadas…",
    "sub": "Combinando suas respostas com um animal"
  },
  "result": {
    "title": "Que animal você é? Eu sou {name}",
    "eyebrow": "O animal mais parecido com você",
    "strengthsLabel": "Seus superpoderes",
    "tipsLabel": "Dicas para o seu lado animal",
    "bestLabel": "Seu match",
    "rivalLabel": "Seu rival",
    "sameShare": "{pct}% tiveram este animal",
    "shareText": "Meu animal é {name} {emoji}: “{vibe}” E o seu?",
    "ctaStrong": "Um amigo compartilhou o animal dele",
    "ctaSub": "Que animal você é? Só 2 minutos.",
    "retry": "Fazer de novo"
  },
  "og": {
    "eyebrow": "Meu animal é",
    "brand": "🦊 Que animal você é?",
    "defaultKicker": "Teste de personalidade animal",
    "defaultTitle": "Que animal você é?",
    "defaultDesc": "8 situações do dia a dia · 2 a 3 minutos"
  },
  "faq": [
    {
      "q": "Como o teste escolhe meu animal?",
      "a": "Cada resposta dá pontos a alguns animais, e o que tiver mais pontos vence. Os empates são resolvidos por uma regra fixa, então as mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "É um teste de personalidade científico?",
      "a": "Não, é só diversão. As perguntas se baseiam em hábitos e humores do dia a dia, não em um diagnóstico psicológico: encare como um espelho brincalhão."
    },
    {
      "q": "O que significam “seu match” e “seu rival”?",
      "a": "Seu match é o animal que equilibra o seu naturalmente. Seu rival é aquele com quem você mais se choca, o que também pode significar mais faísca."
    },
    {
      "q": "Minhas respostas ficam salvas?",
      "a": "Não. Suas respostas são calculadas no seu navegador e nunca são guardadas. Só contamos, de forma anônima, qual animal saiu, para mostrar o quanto cada resultado é comum."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Que animal você é?",
    "description": "Política de privacidade de “Que animal você é?”: cookies, publicidade e estatísticas anônimas.",
    "h1": "Política de privacidade",
    "introHtml": "“Que animal você é?” (o “Serviço”) respeita sua privacidade e trata apenas o mínimo de informações necessário, como descrito abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "Você pode usar o Serviço sem cadastro nem login. Suas respostas são calculadas no navegador e nunca são enviadas nem guardadas em nossos servidores. Só contamos, de forma anônima, qual animal saiu para mostrar a frequência de cada resultado."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar direito."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e ajuste em <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Guardamos apenas totais diários anônimos (visualizações, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não identificam você."
      ],
      [
        "5. Contato",
        "Em caso de dúvidas sobre esta política, fale com o responsável pelo site."
      ],
      [
        "6. Vigência",
        "Esta política vale a partir de 6 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao teste de animais"
  },
  "questions": [
    {
      "q": "Seus planos do fim de semana foram cancelados. Você…",
      "choices": [
        "Manda mensagem pros amigos mais próximos pra ver quem está livre",
        "Finalmente fica em casa com um livro ou documentário",
        "Tenta algo aleatório: um café novo, um parque, qualquer coisa",
        "Monta um jantar na hora e chama todo mundo. Hoje o anfitrião é você!"
      ]
    },
    {
      "q": "Um trabalho em grupo enorme cai no seu colo. Você…",
      "choices": [
        "Vai passo a passo, sem pressa e com constância",
        "Mantém o clima bom e faz a sua parte no seu ritmo",
        "Define uma meta clara e mira no melhor resultado",
        "Primeiro garante que todo mundo se sinta ouvido e à vontade"
      ]
    },
    {
      "q": "Um amigo liga à meia-noite, arrasado. Você…",
      "choices": [
        "Anima com piadas até ele rir",
        "Ajuda a montar um plano claro pra resolver",
        "Fala “tô indo” e chega em 20 minutos",
        "Fica no telefone, calmo e acolhedor, o tempo que for preciso"
      ]
    },
    {
      "q": "Você chega numa festa em que só conhece uma pessoa. Você…",
      "choices": [
        "Fica perto do seu amigo, sorrindo, esperando alguém puxar assunto",
        "Entra como se fosse o dono do lugar e cumprimenta todo mundo",
        "Observa o ambiente primeiro e depois puxa papo com quem parecer interessante",
        "Acha um cantinho confortável perto dos petiscos e não sai mais de lá"
      ]
    },
    {
      "q": "Escolha a viagem dos seus sonhos.",
      "choices": [
        "Um resort aconchegante: dormir até tarde, comer bem, não fazer nada",
        "Uma viagem de carro com os melhores amigos, memórias em cada parada",
        "Um campo cheio de flores ou uma cabana na floresta",
        "Uma cidade antiga e tranquila, cheia de museus, livrarias e histórias"
      ]
    },
    {
      "q": "De repente aparece um problema. Você…",
      "choices": [
        "Foca, encontra o caminho mais rápido e resolve",
        "Ri, improvisa e transforma em algo divertido",
        "Respira fundo, pega um petisco e deixa se resolver sozinho",
        "Dá um passo à frente e assume o comando na hora"
      ]
    },
    {
      "q": "Seus amigos descreveriam você como…",
      "choices": [
        "O gentil, que sempre percebe como todo mundo está",
        "O determinado, que sempre tem uma meta",
        "O leal, que sempre está do lado deles",
        "O divertido, que deixa todo programa melhor"
      ]
    },
    {
      "q": "Sua noite perfeita termina com…",
      "choices": [
        "Todo mundo aplaudindo uma noite que você tornou inesquecível",
        "Comida boa, gente boa e risadas sem pressa",
        "Uma conversa profunda de madrugada sob as estrelas",
        "Cama cedo, celular desligado e um sono bem longo"
      ]
    }
  ],
  "types": {
    "wolf": {
      "name": "o Lobo leal",
      "word": "lobo",
      "vibe": "Lealdade feroz: sua matilha vem sempre em primeiro lugar.",
      "desc": "Você é o amigo que aparece. Quando alguém entra no seu círculo, você protege, apoia e nunca esquece o que fizeram por você. No começo pode parecer sério, mas com os seus você é caloroso, engraçado e dedicado. Sua matilha tem muita sorte.",
      "strengths": [
        "Lealdade inabalável",
        "Coração protetor",
        "Espírito de equipe"
      ],
      "tips": [
        "Deixe os outros te ajudarem também; você não precisa carregar a matilha inteira.",
        "Diga “não” de vez em quando. Ser leal não é concordar com tudo.",
        "Abra espaço para gente nova; seu círculo pode crescer sem perder o calor."
      ]
    },
    "owl": {
      "name": "a Coruja sábia",
      "word": "coruja",
      "vibe": "Observadora e quieta, sempre três pensamentos mais fundo.",
      "desc": "Você prefere olhar, ouvir e entender antes de falar. As pessoas procuram você por conselhos ponderados, e você brilha nas conversas profundas de madrugada. Adora aprender e percebe os detalhes que todo mundo perde. Às vezes pensa demais, mas sua sensibilidade é um presente de verdade.",
      "strengths": [
        "Percepção afiada",
        "Ótima ouvinte",
        "Mente curiosa"
      ],
      "tips": [
        "Compartilhe suas ideias antes de ficarem perfeitas; as pessoas querem ouvir.",
        "Quando a mente acelerar, escreva ou saia para caminhar em vez de ruminar.",
        "Marque um momento de diversão sem objetivo nenhum. Seu cérebro merece recreio."
      ]
    },
    "otter": {
      "name": "a Lontra brincalhona",
      "word": "lontra",
      "vibe": "Pura diversão, sorriso largo e talento pra melhorar qualquer dia.",
      "desc": "Você transforma momentos comuns em brincadeira. É curiosa, simpática e quase impossível de deixar triste. Faz amigos por onde passa e mantém o clima leve mesmo quando tudo desanda. Por trás das piadas, só quer que todo mundo se divirta junto.",
      "strengths": [
        "Bom astral na hora",
        "Amizades fáceis",
        "Diversão sem medo"
      ],
      "tips": [
        "Reserve um minuto de silêncio de vez em quando; nem toda emoção precisa de uma piada.",
        "Termine uma coisa pequena antes de começar a próxima aventura.",
        "Conte quando estiver mesmo mal. Vão adorar estar ao seu lado."
      ]
    },
    "lion": {
      "name": "o Leão destemido",
      "word": "leão",
      "vibe": "Confiante, de coração grande e nascido pra liderar o ambiente.",
      "desc": "Você dá um passo à frente quando os outros hesitam. Tem presença, coragem e um lado generoso, e as pessoas seguem sua energia naturalmente. Ama os grandes momentos e faz questão de que os seus se sintam celebrados. No seu melhor, você lidera elevando todo mundo ao redor.",
      "strengths": [
        "Liderança natural",
        "Coragem generosa",
        "Confiança contagiante"
      ],
      "tips": [
        "Passe o holofote adiante às vezes; vozes quietas costumam ter as melhores ideias.",
        "Pergunte antes de assumir o comando. Ajuda funciona melhor quando é bem-vinda.",
        "Descansar faz parte de ser forte. Até rei tira soneca."
      ]
    },
    "panda": {
      "name": "o Panda tranquilo",
      "word": "panda",
      "vibe": "Tranquilo, gentil e a calma em qualquer tempestade.",
      "desc": "Você vai com o fluxo e ajuda todo mundo ao redor a relaxar. Gosta de comida boa, boa companhia e dias sem pressa. Raramente cria drama e é difícil de tirar do sério. As pessoas adoram como é seguro e confortável ficar perto de você.",
      "strengths": [
        "Presença calma",
        "Gentileza tranquila",
        "Curte as pequenas coisas"
      ],
      "tips": [
        "Diga em voz alta o que você quer; você também pode ter um favorito.",
        "Escolha uma meta pequena por semana pra se desafiar um pouquinho.",
        "Não deixe o “tanto faz” esconder o que você realmente sente."
      ]
    },
    "eagle": {
      "name": "a Águia ambiciosa",
      "word": "águia",
      "vibe": "Focada, independente e sempre mirando mais alto.",
      "desc": "Você enxerga o quadro geral e vai atrás. Define metas, faz planos e se cobra bastante. Gosta de ser independente e resolve problemas rápido. Sua ambição inspira, e no fundo você torce para encontrar alguém que acompanhe o seu ritmo.",
      "strengths": [
        "Foco claro",
        "Espírito independente",
        "Resolve problemas rápido"
      ],
      "tips": [
        "Comemore as vitórias do caminho, não só o topo.",
        "Delegue algo esta semana. Confiança leva mais longe que velocidade.",
        "Pergunte como os outros estão; progresso é melhor quando é compartilhado."
      ]
    },
    "sloth": {
      "name": "a Preguiça aconchegante",
      "word": "preguiça",
      "vibe": "Devagar, constante e profissional em aproveitar a vida.",
      "desc": "Você conhece o segredo que os outros esquecem: não existe prêmio pra quem corre. Protege sua paz, ama seu conforto e vai um passinho suave de cada vez. É paciente, tranquilo e discretamente sábio sobre o que realmente importa. Sua calma é um presente num mundo apressado.",
      "strengths": [
        "Paciência profunda",
        "Mente em paz",
        "Mestre do conforto"
      ],
      "tips": [
        "Comece antes de se sentir pronto; passos pequenos também contam.",
        "Conte seus planos pros amigos com antecedência pra eles se ajustarem ao seu ritmo.",
        "Experimente uma novidade por mês. Aconchego e curiosidade combinam."
      ]
    },
    "deer": {
      "name": "o Cervo gentil",
      "word": "cervo,veado",
      "vibe": "Coração mole, elegante e sintonizado com o sentimento de todos.",
      "desc": "Você percebe as pequenas coisas: uma mudança de humor, alguém sozinho no canto. É suave, sensível e discretamente gentil, e ama lugares bonitos e tranquilos. Pode se assustar diante de conflitos, mas sua empatia faz de você alguém a quem as pessoas confiam seus sentimentos.",
      "strengths": [
        "Empatia profunda",
        "Gentileza elegante",
        "Olhar para a beleza"
      ],
      "tips": [
        "Seus sentimentos importam tanto quanto os deles; fale cedo, mesmo baixinho.",
        "Recarregue as energias com natureza ou música depois de dias corridos.",
        "Você pode dizer “preciso de um momento” sem explicar."
      ]
    }
  }
};
