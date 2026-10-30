/* Teste vocacional (pt-BR)
 * 8 result ids (showrunner storyteller captain caretaker creator inventor builder analyst);
 * questions[i].choices[j] follow job-core.js QUESTIONS[i].w[j] (the [people/things, imagine/structure, out front/deep focus] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result, a suggested job or quote a question.
 * types.<id>.word = the result keyword as people would search it — only used by the spoiler check.
 * types.<id>.jobs = 4 real jobs that are common in this country (local names, no digits).
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Light and positive only. Just for fun — not a professional career assessment.
 * Placeholders: {name} {emoji} {vibe} {pct}.
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
    "title": "Teste vocacional: qual profissão combina comigo?",
    "description": "Faça o teste vocacional: 11 perguntas rápidas, cerca de 2 minutos e sem cadastro. Descubra seu estilo de trabalho, seus pontos fortes e profissões que podem combinar com você. Só por diversão.",
    "ogTitle": "Teste vocacional 💼 Qual profissão combina comigo?",
    "ogDescription": "Onze perguntas leves sobre como você gosta de trabalhar. Descubra seu estilo de trabalho, seus pontos fortes e algumas profissões que vale a pena explorar."
  },
  "siteName": "Teste vocacional",
  "privacyLink": "Política de privacidade",
  "start": {
    "badge": "💼 Que profissão combina?",
    "h1Kicker": "Teste vocacional",
    "h1Html": "Onde você vai<br><em>brilhar</em> no trabalho?",
    "hook": "Tem gente que se acende numa sala cheia e tem gente que prefere um cantinho tranquilo com um quebra-cabeça difícil. Responda onze perguntas do dia a dia e descubra seu estilo de trabalho, seus pontos fortes escondidos e algumas profissões que podem combinar com você de um jeito surpreendente.",
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
    "text": "Organizando suas respostas…",
    "sub": "Procurando seu estilo no mundo do trabalho"
  },
  "result": {
    "title": "Meu estilo de trabalho: {name}",
    "metaDesc": "Resultado do teste vocacional: {name}. {vibe} Veja seus pontos fortes, profissões que podem combinar com você e uma dica para o seu jeito de trabalhar.",
    "eyebrow": "Sua personalidade profissional",
    "gaugeLabel": "Para onde suas respostas se inclinaram",
    "axes": [
      ["Pessoas", "Coisas e ideias"],
      ["Imaginação", "Organização"],
      ["Na linha de frente", "Foco profundo"]
    ],
    "jobsLabel": "Profissões para explorar",
    "strengthsLabel": "Seus pontos fortes",
    "envLabel": "Onde você brilha",
    "watchLabel": "Fique de olho",
    "tipLabel": "Dica de trabalho",
    "buddyLabel": "Colega ideal",
    "rivalLabel": "Estilo oposto",
    "disclaimer": "Só por diversão. É um teste leve, não uma avaliação profissional de orientação de carreira. As profissões são ideias para explorar, não conselhos, e você pode se dar bem em muitos outros caminhos.",
    "sameShare": "{pct}% das pessoas tiraram este estilo de trabalho",
    "shareText": "Meu estilo de trabalho é {name} {emoji} “{vibe}” E o seu?",
    "ctaStrong": "Um amigo compartilhou o estilo de trabalho dele",
    "ctaSub": "Qual profissão combina com você? Descubra em 2 minutos.",
    "retry": "Refazer o teste"
  },
  "og": {
    "eyebrow": "Minha personalidade profissional",
    "brand": "💼 Teste vocacional",
    "defaultKicker": "Um teste vocacional leve",
    "defaultTitle": "Qual profissão combina comigo?",
    "defaultDesc": "11 perguntas · 2 minutos · seu estilo de trabalho"
  },
  "faq": [
    {
      "q": "Como meu resultado é definido?",
      "a": "Cada resposta move três escalas: trabalhar com pessoas ou com coisas e ideias, imaginar novidades ou montar sistemas claros, e ficar na linha de frente ou mergulhar fundo no foco. Seu resultado é o ponto onde as três se encontram, e as mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "Isso é uma avaliação vocacional de verdade?",
      "a": "Não. É um teste leve, feito para se divertir e refletir, e não uma avaliação profissional nem científica. Para decisões importantes sobre estudo ou trabalho, converse com a orientação vocacional da escola ou da faculdade, com um psicólogo ou orientador profissional, ou com quem já atua nas áreas que despertam sua curiosidade."
    },
    {
      "q": "Por que algumas profissões sugeridas parecem não ter nada a ver?",
      "a": "Quatro profissões nunca conseguem representar uma pessoa inteira. São exemplos de trabalhos que costumam aproveitar o seu estilo, então use como ponto de partida. Muita gente com o seu resultado é feliz em áreas completamente diferentes."
    },
    {
      "q": "Minhas respostas ficam salvas?",
      "a": "Não. Suas respostas são calculadas no seu navegador e não são armazenadas. Só contamos, de forma anônima, qual resultado apareceu, para mostrar o quanto ele é comum."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Teste vocacional",
    "description": "Política de privacidade do Teste vocacional: como usamos cookies, publicidade e estatísticas anônimas.",
    "h1": "Política de privacidade",
    "introHtml": "O Teste vocacional (o “Serviço”) respeita sua privacidade e trata apenas as informações mínimas necessárias, conforme descrito abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "Você pode usar o Serviço sem se cadastrar nem fazer login. Suas respostas são calculadas dentro do seu navegador e nunca são enviadas nem armazenadas em nossos servidores. Só contamos, de forma anônima, qual resultado apareceu, para mostrar o quanto cada resultado é comum."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do seu navegador para lembrar seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar corretamente."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base em suas visitas anteriores a este e a outros sites. Você pode saber mais e alterar a personalização de anúncios em <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Mantemos totais diários anônimos (visualizações de página, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não identificam você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver qualquer dúvida sobre esta Política de privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política entra em vigor em 31 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao Teste vocacional"
  },
  "questions": [
    {
      "q": "Começa um trabalho em grupo. Que papel você acaba assumindo sem nem tentar?",
      "choices": [
        "Quem bola sozinho uma solução esperta em que ninguém mais tinha pensado",
        "Quem joga ideias na roda e apresenta para a turma ou para a equipe",
        "Quem pega as ferramentas e realmente constrói a coisa, passo a passo",
        "Quem cuida do cronograma e confere se ninguém ficou para trás"
      ]
    },
    {
      "q": "De repente você ganha um dia livre. O que parece melhor?",
      "choices": [
        "Um café com uma amiga e um papo longo sobre um filme que vocês amaram",
        "Finalmente organizar as pastas de fotos ou as finanças, tudo limpinho e no lugar",
        "Juntar a galera para um racha ou uma noite de jogos de tabuleiro que você organiza",
        "Uma oficina de um dia em que você faz algo com as próprias mãos"
      ]
    },
    {
      "q": "Você acabou de comprar um aparelho novo. O que faz primeiro?",
      "choices": [
        "Configura na hora, seguindo as instruções uma por uma",
        "Escreve um passo a passo simples para sua família também saber usar",
        "Grava o unboxing ou mostra para os amigos",
        "Mergulha nas configurações atrás de funções escondidas e truques espertos"
      ]
    },
    {
      "q": "Que elogio faz o seu dia?",
      "choices": [
        "“Nenhum errinho. Você é muito preciso.”",
        "“A equipe funciona tão bem por sua causa.”",
        "“Peraí, você mesmo fez isso? Que demais.”",
        "“O que você disse ficou na minha cabeça.”"
      ]
    },
    {
      "q": "Escolha o seu local de trabalho dos sonhos.",
      "choices": [
        "Um escritório com clima bom, onde todo mundo trabalha em sintonia",
        "Em campo, em movimento, lidando com equipamentos de verdade",
        "Um lugar agitado onde todo dia acontece alguma coisa nova",
        "Um ateliê tranquilo com um quadro cheio de ideias pela metade"
      ]
    },
    {
      "q": "Algo dá errado. Qual é a sua primeira atitude?",
      "choices": [
        "Reunir todo mundo, dividir as tarefas e assumir a frente",
        "Ouvir cada pessoa envolvida e buscar um ângulo novo",
        "Conferir com calma os números e os registros para achar a causa",
        "Começar a mexer e testar na hora um jeito novo de resolver"
      ]
    },
    {
      "q": "O que não para de aparecer nas recomendações de vídeo?",
      "choices": [
        "Vlogs, vídeos de humor e as últimas tendências",
        "Consertos, faça você mesmo e análises de equipamento de camping",
        "Ciência, espaço e mistérios não resolvidos explicados",
        "Histórias reais de gente que ajuda os outros, como professores e enfermeiras"
      ]
    },
    {
      "q": "Numa viagem, você costuma ser quem…",
      "choices": [
        "Sai sem roteiro e enche a galeria de fotos ou um caderno de desenhos",
        "Monta a planilha perfeita de orçamento e horários",
        "Acaba conversando com os moradores numa cafeteria qualquer",
        "Guia o grupo todo de um lugar para o outro"
      ]
    },
    {
      "q": "É a véspera do prazo de entrega. Você…",
      "choices": [
        "Escreve uma lista clara de tarefas e vai riscando uma a uma",
        "Dá o acabamento na apresentação final e mantém o astral de todo mundo",
        "Pergunta aos colegas um por um se alguém está travado",
        "Se perde no trabalho e tem uma ideia ainda melhor"
      ]
    },
    {
      "q": "Num grupo ou clube, qual função você mais gostaria de ter?",
      "choices": [
        "Receber os novatos e ouvir quem precisa desabafar",
        "Ser o presidente que mantém tudo andando",
        "Desenhar os cartazes, o logo e os brindes",
        "Manter os registros e o dinheiro do grupo em ordem"
      ]
    },
    {
      "q": "Daqui a dez anos, o que você adoraria ouvir?",
      "choices": [
        "“Eu sempre me senti seguro sabendo que você estava lá.”",
        "“Foi você quem pensou nisso primeiro, né?”",
        "“Você fez muita gente sorrir.”",
        "“Se passa pelas suas mãos, funciona.”"
      ]
    }
  ],
  "types": {
    "showrunner": {
      "name": "O Showman",
      "word": "showman",
      "vibe": "Me dê um palco e uma ideia, e eu levanto a sala inteira.",
      "desc": "Você se sente vivo onde pessoas, ideias e ação se encontram. Gosta de apresentar algo novo, juntar os outros na ideia e ver acontecer diante de uma plateia. Energia é o seu superpoder: uma reunião chata vira um brainstorming quando você chega. Um trabalho que permita lançar, apresentar e se conectar provavelmente vai parecer menos trabalho e mais brincadeira.",
      "keywords": ["Enérgico", "Persuasivo", "Cheio de ideias"],
      "strengths": ["Transformar uma ideia solta em algo em que as pessoas querem entrar", "Sentir o clima de um ambiente e levantar o astral", "Falar em público e apresentar com segurança"],
      "jobs": ["Gerente de marketing", "Produtor de TV", "Organizador de eventos", "Empreendedor"],
      "env": "Equipes ágeis, lançamentos e eventos ao vivo, onde toda semana traz algo novo e você vê a reação das pessoas ao seu trabalho.",
      "watch": "Começar mais projetos do que consegue terminar. Ideias novas e brilhantes podem roubar o tempo das que já estão pela metade.",
      "tip": "Faça dupla com alguém que adora detalhes e combine uma linha de chegada antes de partir para a próxima grande ideia."
    },
    "storyteller": {
      "name": "O Narrador",
      "word": "narrador",
      "vibe": "Você transforma ideias em palavras e histórias que ficam na memória.",
      "desc": "Você se sente atraído pelas pessoas e pelo sentido das coisas. Gosta de entender o que os outros sentem e dar forma a isso em palavras, lições ou histórias que ajudam a enxergar algo novo. Talvez não precise dos holofotes, mas sua influência silenciosa vai longe. Um trabalho em que você possa ouvir, escrever, ensinar ou explicar provavelmente vai combinar de forma natural com você.",
      "keywords": ["Empático", "Expressivo", "Reflexivo"],
      "strengths": ["Explicar coisas complicadas de um jeito simples e humano", "Ouvir com atenção e perceber o que as pessoas querem dizer de verdade", "Encontrar a história por trás de fatos e números"],
      "jobs": ["Jornalista", "Professor", "Psicólogo", "Redator publicitário"],
      "env": "Espaços calmos com tempo para pensar, conversas próximas e projetos em que suas palavras chegam a pessoas reais e ajudam de verdade.",
      "watch": "Levar para casa as preocupações dos outros. Se importar tanto é um dom, mas você também precisa recarregar as energias.",
      "tip": "Tenha um caderninho de ideias e frases. Seu melhor trabalho muitas vezes começa como uma linha que você quase esqueceu."
    },
    "captain": {
      "name": "O Capitão",
      "word": "capitão",
      "vibe": "Quando a coisa aperta, todo mundo olha para você para pegar o leme.",
      "desc": "Você rende mais quando há uma equipe para guiar e uma meta para alcançar. Gosta de planos claros, decide sem drama e mantém todos remando na mesma direção. As pessoas confiam em você nas crises porque você mantém a calma e a organização. Um trabalho que coloque você à frente de pessoas, escalas ou atendimento provavelmente vai trazer à tona sua liderança natural.",
      "keywords": ["Decidido", "Organizado", "Confiável"],
      "strengths": ["Dividir um trabalho grande em tarefas claras para cada pessoa", "Manter a calma e o senso prático sob pressão", "Cumprir promessas e prazos"],
      "jobs": ["Gerente de projetos", "Gerente de vendas", "Gerente de hotel", "Comissário de bordo"],
      "env": "Equipes ativas com metas claras, onde você coordena pessoas, resolve problemas na hora e vê resultados rápido.",
      "watch": "Fazer tudo sozinho porque parece mais rápido. Deixar os outros pegarem o leme de vez em quando fortalece a equipe inteira.",
      "tip": "Antes de distribuir as tarefas, pergunte a cada pessoa o que ela mais gostaria de fazer. As respostas podem te surpreender."
    },
    "caretaker": {
      "name": "O Cuidador",
      "word": "cuidador",
      "vibe": "Você garante que ninguém fique para trás.",
      "desc": "Você se importa com as pessoas e mostra isso com um apoio constante e prático. Percebe quando alguém está passando por dificuldade, lembra dos detalhes que importam e gosta de sistemas que mantêm todo mundo seguro e bem cuidado. Pode ser que você não peça reconhecimento, mas as equipes sentem a diferença quando você está por perto. Um trabalho em que você possa ajudar, apoiar e proteger os outros provavelmente vai ser muito significativo para você.",
      "keywords": ["Atencioso", "Paciente", "Confiável"],
      "strengths": ["Perceber os pequenos sinais de que alguém precisa de ajuda", "Acompanhar tudo com cuidado, dia após dia", "Criar um ambiente calmo e de confiança"],
      "jobs": ["Enfermeiro(a)", "Analista de recursos humanos", "Assistente social", "Gerente de atendimento ao cliente"],
      "env": "Equipes unidas com um propósito claro, onde gentileza e boas rotinas fazem diferença real na vida das pessoas.",
      "watch": "Dizer sim para todo mundo. Proteger o seu tempo também faz parte de cuidar bem dos outros.",
      "tip": "Reserve uma hora por semana só para os seus objetivos e proteja esse horário como qualquer outro compromisso."
    },
    "creator": {
      "name": "O Criador",
      "word": "criador",
      "vibe": "Me dê os materiais e vai surgir algo novo.",
      "desc": "Você pensa com as mãos e com os olhos. Adora fazer coisas que as pessoas podem ver, provar, segurar ou usar, e fica mais feliz quando pode tentar, testar e melhorar pelo caminho. Regras são ok, mas você prefere ter espaço para experimentar. Um trabalho em que você possa projetar, produzir ou criar algo real provavelmente vai te manter empolgado por muito tempo.",
      "keywords": ["Inventivo", "Mão na massa", "Visual"],
      "strengths": ["Transformar uma ideia em uma peça real e finalizada", "Perceber o que parece ou soa certo", "Aprender rápido testando as coisas"],
      "jobs": ["Designer gráfico", "Cozinheiro", "Produtor de vídeos", "Designer de interiores"],
      "env": "Ateliês, cozinhas, oficinas ou sets em que você trabalha com materiais reais e mostra o que fez.",
      "watch": "Ficar polindo para sempre. Uma peça pronta e lá fora no mundo ensina mais do que uma perfeita guardada na gaveta.",
      "tip": "Mantenha um portfólio de tudo o que fizer, até as coisas pequenas. Ele vira a sua melhor história sobre você."
    },
    "inventor": {
      "name": "O Inventor",
      "word": "inventor",
      "vibe": "Sua mente é um laboratório onde novas ideias nunca param de borbulhar.",
      "desc": "Você ama grandes perguntas e respostas inteligentes. Gosta de mergulhar num quebra-cabeça, testar ideias na cabeça e achar uma solução que ninguém esperava. Pensa melhor quando tem tempo tranquilo e liberdade para explorar. Um trabalho em que você possa pesquisar, desenhar sistemas ou resolver problemas difíceis provavelmente vai ser um parquinho para a sua curiosidade.",
      "keywords": ["Curioso", "Original", "Analítico"],
      "strengths": ["Enxergar padrões e conexões que os outros não veem", "Focar profundamente em um problema difícil", "Chegar a soluções originais"],
      "jobs": ["Pesquisador científico", "Desenvolvedor de software", "Arquiteto", "Desenvolvedor de jogos"],
      "env": "Lugares tranquilos com espaço para se concentrar, problemas interessantes e colegas que curtem um bom debate de ideias.",
      "watch": "Guardar suas ideias brilhantes só na cabeça. Compartilhar cedo ajuda os outros a entender e a construir em cima delas.",
      "tip": "Explique a ideia do momento para um amigo em três frases. Se ele entender, você está pronto para colocar em prática."
    },
    "builder": {
      "name": "O Construtor",
      "word": "construtor",
      "vibe": "Você não fica só falando: faz acontecer, e faz direito.",
      "desc": "Você é prático, constante e fica mais feliz quando vê resultados reais. Gosta de passos claros, boas ferramentas e de um trabalho que te coloca em movimento em vez de parado. Quando algo quebra, é você quem conserta com calma. Um trabalho em que você possa construir, consertar, operar ou manter as coisas funcionando com segurança provavelmente vai te dar uma profunda satisfação.",
      "keywords": ["Prático", "Habilidoso", "Constante"],
      "strengths": ["Seguir um processo com cuidado e segurança", "Resolver problemas com calma e habilidade manual", "Conseguir resultados reais e visíveis"],
      "jobs": ["Engenheiro mecânico", "Eletricista", "Piloto", "Mecânico de automóveis"],
      "env": "Oficinas, obras, laboratórios ou cabines onde habilidade, segurança e trabalho em equipe importam e, todo dia, você vê o que conquistou.",
      "watch": "Se subestimar. O que parece óbvio para você costuma impressionar todo mundo.",
      "tip": "Aprenda uma ferramenta ou técnica nova a cada estação. Suas habilidades crescem mais rápido quando você as empilha passo a passo."
    },
    "analyst": {
      "name": "O Analista",
      "word": "analista",
      "vibe": "Detalhes, dados e ordem são os seus superpoderes silenciosos.",
      "desc": "Você percebe o que os outros deixam passar. Gosta do trabalho cuidadoso, de regras claras e da satisfação de acertar cada número e cada detalhe. Pensa antes de agir, e as pessoas confiam no seu julgamento porque ele se baseia em fatos. Um trabalho em que você possa organizar, conferir, medir ou analisar informações provavelmente vai ser tranquilo e gratificante para você.",
      "keywords": ["Preciso", "Lógico", "Calmo"],
      "strengths": ["Encontrar erros e padrões nas informações", "Manter o que é complexo limpo e organizado", "Tomar decisões cuidadosas baseadas em fatos"],
      "jobs": ["Contador(a)", "Analista de dados", "Bibliotecário(a)", "Técnico(a) de laboratório"],
      "env": "Lugares calmos e bem organizados, com expectativas claras, onde a precisão é valorizada e você tem tempo de fazer direito.",
      "watch": "Esperar pela informação perfeita. Às vezes uma decisão boa o bastante hoje vale mais do que uma perfeita no mês que vem.",
      "tip": "Compartilhe uma descoberta do seu trabalho por semana. Seus achados cuidadosos ajudam mais gente quando as pessoas ficam sabendo deles."
    }
  }
};
