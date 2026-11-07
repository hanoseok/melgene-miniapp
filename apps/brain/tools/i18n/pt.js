/* Left Brain Right Brain Test (pt, Brazilian Portuguese)
 * 8 result ids (architect, mapmaker, debater, hacker, weaver, designer, firework, dreamer); questions[i].choices[j] follow brain-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: think logic/intuition, plan plan/flow, express words/images;
 *  side 0 = what people usually call "left-brain style", side 1 = "right-brain style").
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the user's own left/right bar ({n}) and the real server share ({pct}).
 * Honesty: left/right-brain "dominance" is a popular myth; both hemispheres work together. Just for fun — not a psychological test or diagnosis.
 * Placeholders: {name} {emoji} {vibe} {pct} {n}.
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
    "title": "Teste cérebro esquerdo ou direito – Lógica ou intuição?",
    "description": "Teste cérebro esquerdo ou direito grátis: 12 perguntas do dia a dia, cerca de 2 minutos, sem cadastro. Descubra seu estilo de pensar, só por diversão.",
    "ogTitle": "Teste cérebro esquerdo ou direito 🧠 Lógica ou intuição?",
    "ogDescription": "Doze perguntas rápidas do dia a dia. Veja para que lado seu estilo de pensar pende e conheça seu personagem cerebral. Um quiz divertido, não um diagnóstico."
  },
  "siteName": "Teste cérebro esquerdo ou direito",
  "privacyLink": "Política de Privacidade",
  "start": {
    "badge": "🧠 Quiz de estilo de pensar",
    "h1Kicker": "Teste cérebro esquerdo ou direito",
    "h1Html": "Lógica ou intuição?<br>Para que lado você <em>pende</em>?",
    "hook": "Você faz listas ou vai no feeling? Explica com palavras ou com um rabisco rápido? Responda a doze perguntas do dia a dia e veja como seus hábitos de pensamento se equilibram, além do personagem cerebral que combina com você.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "💭 12 perguntas",
    "start": "Começar o teste →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "Pergunta {n}"
  },
  "loading": {
    "text": "Lendo seu estilo de pensar…",
    "sub": "As duas metades estão conversando"
  },
  "result": {
    "title": "Meu personagem cerebral: {name}",
    "metaDesc": "Resultado do teste cérebro esquerdo ou direito: {name}. {vibe} Veja seus pontos fortes, dicas, seu melhor amigo e seu rival amigável.",
    "eyebrow": "Seu personagem cerebral é…",
    "lrTitle": "Seu equilíbrio entre estilo esquerdo e direito",
    "lrLeft": "Estilo esquerdo",
    "lrRight": "Estilo direito",
    "lrNote": "Calculado a partir das suas doze respostas: lógica, planos e palavras contam como estilo esquerdo; intuição, improviso e imagens como estilo direito.",
    "pctFmt": "{n}%",
    "leanLeft": "Suas respostas pendem para os hábitos do lado esquerdo.",
    "leanRight": "Suas respostas pendem para os hábitos do lado direito.",
    "leanBalanced": "Suas respostas estão bem equilibradas entre os dois estilos.",
    "traitsLabel": "Seus pontos fortes",
    "tipsLabel": "Dicas para você",
    "perfectLabel": "Onde você brilha",
    "bestLabel": "Melhor amigo",
    "rivalLabel": "Rival amigável",
    "disclaimer": "Só por diversão! Ser “de cérebro esquerdo” ou “de cérebro direito” é um mito popular: a pesquisa sobre o cérebro mostra que os dois hemisférios trabalham juntos em quase tudo. Este quiz olha apenas para suas preferências de estilo de pensar. Não é um teste psicológico nem um diagnóstico.",
    "sameShare": "{pct}% das pessoas tiveram este resultado",
    "shareText": "Meu personagem cerebral é {name} {emoji} “{vibe}” Esquerdo ou direito, para que lado você pende?",
    "ctaStrong": "Um amigo compartilhou o personagem cerebral dele",
    "ctaSub": "Lógica ou intuição? Descubra em 2 minutos.",
    "retry": "Refazer o teste"
  },
  "og": {
    "eyebrow": "Meu personagem cerebral",
    "brand": "🧠 Teste cérebro esquerdo ou direito",
    "defaultKicker": "Quiz de estilo de pensar",
    "defaultTitle": "Lógica ou intuição?",
    "defaultDesc": "12 perguntas · 2 minutos · seu equilíbrio esquerdo/direito"
  },
  "faq": [
    {
      "q": "As pessoas são mesmo “de cérebro esquerdo” ou “de cérebro direito”?",
      "a": "Não, isso é um mito popular. Cada hemisfério tem algumas especialidades, mas exames de imagem mostram que os dois lados trabalham juntos em quase todas as tarefas, e grandes estudos não encontraram pessoas que usem um lado mais do que o outro no geral. Aqui, “estilo esquerdo” e “estilo direito” são só apelidos simpáticos para hábitos de pensamento."
    },
    {
      "q": "Como meu resultado é escolhido?",
      "a": "Cada pergunta observa um de três hábitos de pensamento: raciocinar ou confiar num palpite, planejar ou deixar rolar, e explicar com palavras ou com imagens. A combinação dos três escolhe seu personagem, e as mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "De onde vem a porcentagem esquerdo/direito?",
      "a": "Ela é calculada só com as suas respostas. Escolhas de lógica, planos e palavras somam para o lado do estilo esquerdo, escolhas de intuição, improviso e imagens somam para o lado do estilo direito, e respostas mais fortes contam um pouco mais."
    },
    {
      "q": "Isto é um teste psicológico de verdade?",
      "a": "Não. É um quiz leve para se divertir, não uma avaliação psicológica nem um diagnóstico. A maioria das pessoas usa todos os estilos dependendo da situação, então curta seu resultado e compare com os amigos."
    },
    {
      "q": "Minhas respostas ficam salvas?",
      "a": "Não. Suas respostas são calculadas no seu navegador e não são armazenadas. Apenas contamos, de forma anônima, qual resultado apareceu, para mostrar o quanto ele é comum."
    }
  ],
  "privacy": {
    "title": "Política de Privacidade | Teste cérebro esquerdo ou direito",
    "description": "Política de Privacidade do Teste cérebro esquerdo ou direito — como usamos cookies, anúncios e estatísticas anônimas.",
    "h1": "Política de Privacidade",
    "introHtml": "O Teste cérebro esquerdo ou direito (o \"Serviço\") respeita a sua privacidade e trata apenas o mínimo de informações necessárias, conforme descrito abaixo.",
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
        "Esta política está em vigor desde 8 de novembro de 2026."
      ]
    ],
    "back": "← Voltar ao Teste cérebro esquerdo ou direito"
  },
  "questions": [
    {
      "q": "Você precisa de um celular novo. Como escolhe?",
      "choices": [
        "Comparo especificações e preços lado a lado até um ganhar com folga",
        "Leio algumas avaliações e fico com o que me agrada mais",
        "Pego na mão na loja. Se parecer certo, é esse",
        "Vejo as especificações principais e escolho o melhor custo-benefício"
      ]
    },
    {
      "q": "Vem aí um sábado livre. Como ele vai ser?",
      "choices": [
        "Sem plano nenhum. Vejo aonde o dia me leva",
        "Planejado desde quarta, quase hora por hora",
        "Uma ou duas coisas marcadas, o resto em aberto",
        "Uma ideia geral, mas topo mudar"
      ]
    },
    {
      "q": "Um amigo pergunta como chegar a um café que você conhece. Você…",
      "choices": [
        "Manda o nome da rua e um ou dois pontos de referência",
        "Desenha um mapinha ou manda a localização com uma foto da entrada",
        "Escreve o caminho passo a passo: vira à esquerda na padaria, depois a segunda à direita…",
        "Manda um print do mapa"
      ]
    },
    {
      "q": "Uma amiga não consegue escolher entre duas propostas de emprego e pede sua opinião. Você…",
      "choices": [
        "Pergunta qual delas faz os olhos dela brilharem quando fala",
        "Faz com ela uma lista de prós e contras: salário, trajeto, crescimento",
        "Faz algumas perguntas práticas antes de opinar",
        "Diz para ela confiar na intuição. No fundo, ela já sabe"
      ]
    },
    {
      "q": "Você está arrumando a mala para um fim de semana fora. Você…",
      "choices": [
        "Arruma na noite anterior, seguindo uma lista na cabeça",
        "Joga as coisas na mochila logo antes de sair pela porta",
        "Arruma na manhã da viagem e compra o que esquecer",
        "Usa um checklist que escreveu dias antes"
      ]
    },
    {
      "q": "Como você lembra melhor das coisas?",
      "choices": [
        "Eu visualizo: a página, a cor, onde estava",
        "Faço rabiscos ou desenhos na margem",
        "Repito para mim mesmo algumas vezes",
        "Anoto com as minhas próprias palavras"
      ]
    },
    {
      "q": "Chega um jogo de tabuleiro novo com um manual bem grosso. Você…",
      "choices": [
        "Dá uma olhada nas regras e começa a jogar",
        "Lê todas as regras antes da primeira jogada",
        "Pula as regras e aprende jogando",
        "Assiste aos outros jogarem uma rodada e depois entra"
      ]
    },
    {
      "q": "Como é a sua lista de tarefas?",
      "choices": [
        "Organizada, por prioridade, riscada todo dia",
        "Existe em algum lugar. Olho de vez em quando",
        "Uma lista curta com o que realmente importa",
        "Lista? Está tudo na minha cabeça e eu vou no fluxo"
      ]
    },
    {
      "q": "Você precisa explicar uma ideia nova para a equipe ou para a turma. Você…",
      "choices": [
        "Coloca algumas imagens simples nos slides",
        "Explica falando, com alguns exemplos",
        "Desenha um diagrama no quadro e monta passo a passo",
        "Escreve primeiro um resumo claro e bem organizado"
      ]
    },
    {
      "q": "Alguém que você acabou de conhecer passa uma impressão estranha, mas você não sabe por quê. Você…",
      "choices": [
        "Confia no feeling. Geralmente ele acerta",
        "Espera para ver o que a pessoa realmente faz",
        "Mantém uma certa distância por enquanto, por via das dúvidas",
        "Ignora até ter um motivo concreto"
      ]
    },
    {
      "q": "Você tem um dia numa cidade que nunca visitou. Primeiro passo?",
      "choices": [
        "Escolho um lugar para ver e saio passeando a partir dali",
        "Me perco de propósito e sigo pelas ruazinhas",
        "Sigo o roteiro que montei antes da viagem",
        "Olho uma lista dos lugares mais famosos e escolho alguns"
      ]
    },
    {
      "q": "O que você mais curte no tempo livre?",
      "choices": [
        "Ler, escrever ou jogos de palavras",
        "Desenhar, fotografar ou construir coisas",
        "Ver filmes e vídeos com uma fotografia linda",
        "Podcasts e conversas longas"
      ]
    }
  ],
  "types": {
    "architect": {
      "name": "Mente Arquiteta",
      "word": "arquiteta,arquiteto",
      "vibe": "Planos claros, argumentos firmes e as palavras certas. Você constrói ideias que ficam de pé.",
      "keywords": ["Lógico", "Organizado", "Articulado"],
      "desc": "Você gosta de entender como as coisas funcionam antes de mergulhar. Pensa em etapas, mantém um plano por perto e explica suas ideias com tanta clareza que os outros conseguem acompanhar. As pessoas confiam a você as partes mais difíceis, porque você enxerga as falhas e resolve antes que virem problema. Você curte uma boa discussão, desde que seja justa e baseada em fatos. Às vezes espera tempo demais pelo plano perfeito, e é aí que um pequeno salto de fé ajuda.",
      "traits": ["Você transforma bagunça em passos claros", "Você explica coisas complicadas de um jeito simples", "Você cumpre promessas e prazos", "Você percebe erros que os outros deixam passar"],
      "tips": ["Tome uma pequena decisão por dia só pela intuição", "Deixe um espaço livre nos seus planos para as surpresas"],
      "perfect": "Um projeto com objetivo claro, um plano sólido e uma equipe que conta com o seu raciocínio cuidadoso."
    },
    "mapmaker": {
      "name": "Cartógrafo Visual",
      "word": "cartógrafo,cartógrafa",
      "vibe": "Você vê o quadro todo e traça a rota. Lógica com olhar visual.",
      "keywords": ["Estratégico", "Visual", "Metódico"],
      "desc": "Você pensa com calma, mas pensa em imagens. Gráficos, plantas e mapas mentais ajudam você a ver como tudo se conecta, e você planeja a rota antes de dar o primeiro passo. Os amigos pedem sua ajuda para organizar viagens, mudar os móveis de lugar ou desembaraçar agendas complicadas, porque você faz tudo parecer simples. Você prefere mostrar a contar, e um rabisco rápido diz mais para você do que um parágrafo inteiro. Só lembre que nem toda viagem precisa de mapa: alguns dos melhores lugares aparecem quando a gente erra o caminho.",
      "traits": ["Você vê como as peças se encaixam", "Você planeja rotas, ambientes e horários com facilidade", "Você explica com gráficos e desenhos", "Você mantém a calma quando tudo complica"],
      "tips": ["Compartilhe seu raciocínio em voz alta, não só no papel", "De vez em quando, deixe outra pessoa planejar o seu dia"],
      "perfect": "Planejar uma grande viagem ou um espaço novo, com uma folha em branco, uma caneta e tempo para pensar em tudo."
    },
    "debater": {
      "name": "Debatedor Relâmpago",
      "word": "debatedor,debatedora",
      "vibe": "Lógica rápida, resposta na ponta da língua e amor pelo momento. Você pensa melhor em voz alta.",
      "keywords": ["Espirituoso", "Afiado", "Adaptável"],
      "desc": "Você raciocina rápido e fala mais rápido ainda. Não precisa de roteiro, porque seus melhores argumentos surgem no meio da conversa. Você gosta de fatos e de lógica clara, mas também adora a emoção de pensar na hora, e por isso se sai muito bem em discussões, quizzes e apresentações de última hora. As pessoas curtem seu humor e suas opiniões sinceras. Só lembre que nem todo papo é uma disputa: às vezes um amigo quer que você escute mais do que vença.",
      "traits": ["Você pensa com clareza sob pressão", "Você encontra as palavras certas na hora", "Você se adapta rápido quando os planos mudam", "Você deixa as conversas animadas e divertidas"],
      "tips": ["Pare e faça mais uma pergunta antes de responder", "Anote suas melhores ideias para elas não voarem"],
      "perfect": "Uma conversa animada, uma noite de quiz ou uma reunião em que pensar rápido salva o dia."
    },
    "hacker": {
      "name": "Hacker de Enigmas",
      "word": "hacker",
      "vibe": "Você mexe, testa e descobre. Lógica em movimento, uma solução esperta de cada vez.",
      "keywords": ["Curioso", "Inventivo", "Mão na massa"],
      "desc": "Você adora um bom quebra-cabeça e resolve tentando. Em vez de ler o manual, desmonta tudo, vê como se encaixa e acha um atalho esperto que ninguém tinha visto. Sua mente é lógica, mas funciona melhor quando as mãos estão ocupadas e o plano é flexível. Os amigos chamam você quando algo está quebrado, confuso ou travado. Tarefas de rotina podem entediar você, então misture com pequenos desafios que mantenham sua curiosidade acordada.",
      "traits": ["Você aprende mais rápido fazendo", "Você encontra atalhos e gambiarras geniais", "Você é curioso sobre como as coisas funcionam", "Você não desiste quando o problema complica"],
      "tips": ["Termine um projeto antes de começar o próximo", "Explique suas soluções espertas para os outros aprenderem também"],
      "perfect": "Um aparelho quebrado, uma fase difícil de videogame ou uma sala de fuga com o relógio correndo."
    },
    "weaver": {
      "name": "Tecelão de Histórias",
      "word": "tecelão,tecelã",
      "vibe": "Você segue os sentimentos e os transforma em palavras. Intuição com um plano tranquilo.",
      "keywords": ["Empático", "Atencioso", "Expressivo"],
      "desc": "Você lê pessoas e momentos com o coração e sabe colocar esses sentimentos em palavras. Muitas vezes percebe do que um amigo precisa antes que ele diga, e encontra a mensagem perfeita para um cartão, um discurso ou uma conversa difícil. Você gosta de um ritmo de vida suave, com planos e pequenos rituais que fazem você se sentir em casa. Sua intuição é forte, então confie nela, mas também se permita mudar de rumo quando o coração disser algo novo.",
      "traits": ["Você sente como os outros estão", "Você encontra palavras tocantes para qualquer momento", "Você mantém as amizades calorosas e firmes", "Você transforma experiências em ótimas histórias"],
      "tips": ["Compartilhe seus sentimentos tanto quanto escuta os dos outros", "Tenha um caderno para as ideias que chegam à noite"],
      "perfect": "Uma carta do fundo do coração, uma conversa profunda com um bom amigo ou uma história que faz alguém se sentir compreendido."
    },
    "designer": {
      "name": "Designer Zen",
      "word": "designer",
      "vibe": "Sensibilidade para o belo e mão paciente. Você faz as coisas parecerem e se sentirem certas.",
      "keywords": ["Estético", "Paciente", "Intuitivo"],
      "desc": "Você tem um feeling para cores, formas e climas, e dedica tempo para acertar. Talvez não saiba explicar por que algo funciona, mas sabe quando vê, e seu instinto quase sempre acerta. Você curte projetos calmos com um ritmo claro: arrumar um cômodo, editar fotos, cozinhar algo tão bonito quanto gostoso. As pessoas relaxam nos espaços que você cria. Não espere a perfeição para mostrar seu trabalho. Ele já está lindo.",
      "traits": ["Você tem um olho natural para a beleza", "Você cria espaços calmos e aconchegantes", "Você cuida dos detalhes com paciência", "Você percebe climas que os outros não notam"],
      "tips": ["Mostre seu trabalho antes de achar que está pronto", "De vez em quando coloque seus sentimentos em palavras, não só em imagens"],
      "perfect": "Uma tarde tranquila arrumando, pintando ou decorando algo até ficar do jeitinho certo."
    },
    "firework": {
      "name": "Vulcão de Ideias",
      "word": "vulcão",
      "vibe": "Faíscas de ideias, rajadas de palavras e grandes emoções. Você ilumina qualquer conversa.",
      "keywords": ["Inspirador", "Espontâneo", "Caloroso"],
      "desc": "As ideias brotam na sua cabeça o dia inteiro e você não vê a hora de contar para alguém. Você confia na intuição, segue o entusiasmo e fala dos seus planos com tanta energia que os outros querem entrar junto. Você é o amigo que sugere a viagem de última hora, o barzinho novo ou a ideia maluca que acaba sendo genial. Você sente muito e demonstra, o que faz as pessoas se sentirem próximas. Sua energia é um presente, mas escolha algumas ideias para levar até o fim, para que elas brilhem de verdade.",
      "traits": ["Você tem ideias sem parar", "Você contagia as pessoas com seu entusiasmo", "Você faz amigos com facilidade", "Você transforma dias comuns em aventuras"],
      "tips": ["Escolha sua ideia favorita da semana e leve até o fim", "Dê espaço para os amigos mais quietos também compartilharem ideias"],
      "perfect": "Um brainstorming, uma viagem de improviso ou uma festa em que todo mundo vira amigo."
    },
    "dreamer": {
      "name": "Artista Sonhador",
      "word": "sonhador,sonhadora",
      "vibe": "Imaginação livre e imagens vivas na mente. Você vê mundos que os outros não veem.",
      "keywords": ["Imaginativo", "Espírito livre", "Original"],
      "desc": "Sua mente é cheia de cores, cenas e “e se…”. Você segue a intuição, muda os planos quando a inspiração bate e pensa mais em imagens do que em frases. Momentos comuns viram pequenos filmes na sua cabeça, e você muitas vezes repara numa beleza pela qual os outros passam direto. Você rende mais quando ninguém apressa você e dá para seguir uma faísca aonde ela levar. Sua originalidade é seu superpoder. Só mantenha algumas rotinas simples, para que suas grandes ideias tenham onde pousar.",
      "traits": ["Você imagina coisas que ninguém mais pensaria", "Você vê beleza nos detalhes do dia a dia", "Você fica aberto a novas experiências", "Você se expressa com estilo"],
      "tips": ["Transforme um devaneio num pequeno projeto real este mês", "Crie um lembrete gentil para as coisas que importam para os outros"],
      "perfect": "Um dia livre com música tocando, um caderno de desenho na bolsa e nenhum plano."
    }
  }
};
