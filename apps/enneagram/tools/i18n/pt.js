/* Enneagram Test (pt — Brazilian Portuguese, "você")
 * 9 result ids (type1 … type9); questions[i].choices[j] follow enneagram-core.js QUESTIONS[i].c[j]
 * (the center or stance value of each choice; the one "softer" choice per question scores 1 point instead of 2).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the type number comes from result.typeNum, the only other number is the real server share ({pct}).
 * Kind, non-judgmental wording: every type has gifts and blind spots, nobody is only one type, and people grow.
 * Just for fun and self-reflection — not an official assessment (such as the RHETI) and not a diagnosis.
 * Placeholders: {n} {name} {emoji} {vibe} {pct}.
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
    "title": "Teste de eneagrama – Qual é o meu tipo de eneagrama?",
    "description": "Teste de eneagrama grátis: 12 perguntas rápidas do dia a dia, uns 2 minutos, sem cadastro. Descubra seu tipo, sua motivação central, forças e dicas.",
    "ogTitle": "Teste de eneagrama 🔷 Qual é o seu tipo?",
    "ogDescription": "Doze perguntas do cotidiano sobre como você reage, decide e recarrega. Descubra seu tipo de eneagrama, o que te move e como você cresce."
  },
  "siteName": "Teste de eneagrama",
  "privacyLink": "Política de Privacidade",
  "start": {
    "badge": "🔷 Nove jeitos de ver o mundo",
    "h1Kicker": "Teste de eneagrama",
    "h1Html": "O que realmente<br>te <em>move</em>?",
    "hook": "Tem gente que puxa a fila, gente que segura a paz e gente que, em silêncio, entende tudo antes de todo mundo. O eneagrama descreve nove jeitos de ver o mundo e o que cada pessoa mais deseja. Responda a doze perguntas rápidas do dia a dia e conheça o seu tipo.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 12 perguntas",
    "start": "Ver meu tipo →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "Pergunta {n}"
  },
  "loading": {
    "text": "Ligando os pontos…",
    "sub": "Achando o seu lugar no círculo"
  },
  "result": {
    "title": "Tipo {n} do eneagrama: {name}",
    "metaDesc": "Resultado do teste de eneagrama: Tipo {n}, {name}. {vibe} Veja sua motivação central, seus pontos fortes e três dicas para crescer.",
    "eyebrow": "Seu tipo de eneagrama",
    "typeNum": "Tipo {n}",
    "desireLabel": "No fundo, você quer",
    "fearLabel": "O que você tenta evitar",
    "gaugeLabel": "Para onde suas respostas pesaram",
    "centerLabel": "Sua energia nasce em…",
    "centers": ["Instinto", "Coração", "Cabeça"],
    "stanceLabel": "Você busca o que precisa…",
    "stances": ["Indo em frente", "Fazendo o certo", "Dando um passo atrás"],
    "strengthsLabel": "Seus pontos fortes",
    "tipsLabel": "Dicas para crescer",
    "growthLabel": "Ao crescer, você se inspira em",
    "disclaimer": "Só por diversão e autoconhecimento. Este quiz curto não é uma avaliação oficial de eneagrama, como o RHETI, nem um teste psicológico ou diagnóstico. A maioria das pessoas se reconhece em vários tipos, então leia o resultado como um ponto de partida, não como um rótulo.",
    "sameShare": "{pct}% das pessoas tiveram este tipo",
    "shareText": "Sou do Tipo {n} do eneagrama, {name} {emoji} “{vibe}” E você, qual é o seu tipo?",
    "ctaStrong": "Um amigo compartilhou o tipo de eneagrama dele",
    "ctaSub": "O que te move? Descubra em 2 minutos.",
    "retry": "Fazer o teste de novo"
  },
  "og": {
    "eyebrow": "Meu tipo de eneagrama",
    "brand": "🔷 Teste de eneagrama",
    "defaultKicker": "Um quiz rápido de personalidade",
    "defaultTitle": "Qual é o meu tipo de eneagrama?",
    "defaultDesc": "12 perguntas · 2 minutos · o que te move"
  },
  "faq": [
    {
      "q": "Como o meu tipo é definido?",
      "a": "Metade das perguntas olha para onde a sua energia costuma começar: no corpo e nos instintos, nos sentimentos ou no pensamento. A outra metade olha para como você costuma ir atrás do que precisa. O seu tipo fica onde essas duas respostas se encontram, e as mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "Este é o teste oficial de eneagrama?",
      "a": "Não. É um quiz curto para diversão e autoconhecimento, não uma avaliação oficial ou validada como o RHETI, e também não é um diagnóstico psicológico. Se o resultado não combinar com você, leia também sobre os tipos vizinhos. Muita gente só encontra o próprio tipo depois de refletir um pouco."
    },
    {
      "q": "O meu tipo pode mudar?",
      "a": "Segundo o eneagrama, o tipo central fica bem estável, mas o jeito como você o expressa muda bastante com estresse, humor e crescimento pessoal. As respostas de um quiz também variam, então faça de novo daqui a alguns meses e veja se o mesmo tipo aparece."
    },
    {
      "q": "As minhas respostas ficam salvas?",
      "a": "Não. Suas respostas são calculadas no seu navegador e não são armazenadas. Só contamos, de forma anônima, qual tipo apareceu, para mostrar o quanto ele é comum."
    }
  ],
  "privacy": {
    "title": "Política de Privacidade | Teste de eneagrama",
    "description": "Política de Privacidade do Teste de eneagrama — como usamos cookies, anúncios e estatísticas anônimas.",
    "h1": "Política de Privacidade",
    "introHtml": "O Teste de eneagrama (o \"Serviço\") respeita a sua privacidade e trata apenas o mínimo de informações necessárias, conforme descrito abaixo.",
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
        "Esta política está em vigor desde 4 de novembro de 2026."
      ]
    ],
    "back": "← Voltar ao Teste de eneagrama"
  },
  "questions": [
    {
      "q": "Você chega a uma festa onde quase não conhece ninguém. O que faz primeiro?",
      "choices": [
        "Sinto o clima e vou para onde a energia está",
        "Reparo em quem parece simpático e em como estou sendo visto",
        "Fico na minha um pouco e entendo como as coisas funcionam ali",
        "Pego uma bebida e já entro numa conversa"
      ]
    },
    {
      "q": "Num trabalho em grupo, você naturalmente…",
      "choices": [
        "Toma a frente e faz as coisas andarem",
        "Pega a sua parte e faz do seu jeito, na sua",
        "Garante que todo mundo está no rumo e que nada fica para trás",
        "Solta a ideia mais ousada e anima a galera"
      ]
    },
    {
      "q": "Diante de uma grande decisão, em que você mais confia?",
      "choices": [
        "No que eu sinto e no que isso significa para quem eu amo",
        "Em pesquisa, lista de prós e contras e um plano B",
        "Em conversar com alguém próximo até parecer certo",
        "Na minha intuição. Quase sempre eu simplesmente sei."
      ]
    },
    {
      "q": "Quando você quer muito alguma coisa, geralmente…",
      "choices": [
        "Vejo antes se está tudo bem para as pessoas ao meu redor",
        "Vou direto atrás",
        "Sonho com isso por muito tempo antes de fazer qualquer coisa",
        "Trabalho duro, faço do jeito certo e confio que vai dar resultado"
      ]
    },
    {
      "q": "O que mais te tira do eixo num dia ruim?",
      "choices": [
        "Não saber o que vem pela frente",
        "Receber ordens ou sentir que algo é injusto",
        "Não ser valorizado ou ser deixado de lado",
        "Pontas soltas demais e ninguém com um plano claro"
      ]
    },
    {
      "q": "Depois de uma semana longa e corrida, recarregar é…",
      "choices": [
        "Ficar sozinho, celular desligado, no meu mundo",
        "Um plano novo: uma viagem, uma saída, algo grande",
        "Um dia lento sem fazer absolutamente nada",
        "Zerar minha lista de tarefas para finalmente relaxar de verdade"
      ]
    },
    {
      "q": "Você está preso numa fila que não anda. Você…",
      "choices": [
        "Puxa papo com quem está do lado ou manda mensagem para um amigo",
        "Sente no corpo: inquietação, mandíbula travada",
        "Calcula quanto vai demorar e procura uma opção mais rápida",
        "Vai até a frente ver o que está acontecendo de fato"
      ]
    },
    {
      "q": "Alguém discorda de você na frente dos outros. Você…",
      "choices": [
        "Procura um meio-termo justo com que todos consigam viver",
        "Rebate e defende o seu ponto",
        "Fica quieto e pensa nisso depois, sozinho",
        "Sinceramente, até curte um bom debate"
      ]
    },
    {
      "q": "Qual elogio faria o seu dia?",
      "choices": [
        "“Você sempre sabe o que está acontecendo de verdade.”",
        "“Você tem um coração enorme.”",
        "“Você é muito autêntico. Sempre se mantém firme.”",
        "“Não existe ninguém igual a você.”"
      ]
    },
    {
      "q": "Uma regra que não faz sentido para você…",
      "choices": [
        "É contornada discretamente, sem fazer cena",
        "Me incomoda, mas eu odiaria decepcionar alguém",
        "É questionada em voz alta, ou simplesmente ignorada",
        "Continua sendo seguida até poder ser mudada do jeito certo"
      ]
    },
    {
      "q": "Quando um amigo tem um problema, você é quem…",
      "choices": [
        "Entra em ação e faz alguma coisa a respeito",
        "Escuta e faz ele se sentir menos sozinho",
        "Ajuda a pensar com calma e enxergar as opções",
        "Pesquisa e descobre quem poderia ajudar"
      ]
    },
    {
      "q": "Um sábado livre, sem nenhum plano. O mais provável é que você…",
      "choices": [
        "Mande mensagem para a galera e faça algo acontecer",
        "Suma num livro, num jogo ou num hobby por horas",
        "Coloque as tarefas em dia ou ajude alguém que precisa",
        "Deixe o dia rolar e veja no que dá"
      ]
    }
  ],
  "types": {
    "type1": {
      "name": "O Perfeccionista",
      "word": "perfeccionista",
      "vibe": "Você enxerga como as coisas poderiam ser melhores e cobra isso de si mesmo em silêncio.",
      "desire": "Ser bom, justo e fazer as coisas do jeito certo",
      "fear": "Estar errado, ser descuidado ou deixar as coisas desandarem",
      "desc": "Você tem um senso interno claro de certo e errado e percebe o que poderia melhorar em quase todo lugar. Você cumpre o que promete, assume responsabilidades, e as pessoas confiam em você porque sua palavra vale. Esses padrões altos, porém, podem virar um crítico interno barulhento, e às vezes bate uma irritação quando os outros não parecem se importar tanto. Na sua melhor versão, você é íntegro, paciente e sábio, e sabe que o bom o bastante às vezes é exatamente o certo.",
      "keywords": ["Íntegro", "Confiável", "Caprichoso"],
      "strengths": ["Fazer as coisas direito, mesmo quando ninguém está olhando", "Defender o que é justo", "Transformar bagunça em planos claros e possíveis"],
      "tips": ["Repare no seu crítico interno e responda a ele como um amigo gentil responderia.", "Escolha uma coisa por semana para deixar inacabada de propósito e veja que o mundo não desaba.", "Abra espaço para brincar. Descanso e diversão fazem parte de viver bem, não são prêmio por terminar tudo."],
      "growth": "Quando cresce, você se solta e encontra mais alegria, espontaneidade e leveza."
    },
    "type2": {
      "name": "O Prestativo",
      "word": "prestativo",
      "vibe": "Você percebe do que as pessoas precisam antes que elas digam e adora fazer o dia delas melhor.",
      "desire": "Ser amado e se sentir realmente necessário",
      "fear": "Não ser querido nem amado",
      "desc": "Você é caloroso, generoso e ligado nas pessoas. Lembra de aniversários, aparece quando importa, e os amigos costumam se sentir vistos e cuidados perto de você. Os relacionamentos estão no centro da sua vida. Por estar tão focado nos outros, você pode esquecer das próprias necessidades, ter dificuldade de dizer não ou se magoar quando o seu cuidado passa despercebido. Na sua melhor versão, você dá de coração, sem fazer contas, e também deixa os outros cuidarem de você.",
      "keywords": ["Caloroso", "Generoso", "Cuidadoso"],
      "strengths": ["Fazer as pessoas se sentirem bem-vindas e valorizadas", "Perceber do que alguém precisa agora", "Construir amizades próximas e fiéis"],
      "tips": ["Antes de dizer sim, pergunte a si mesmo do que você precisa hoje.", "Deixe as pessoas te ajudarem, mesmo em coisas pequenas. Receber faz parte de uma relação próxima.", "Fale das suas necessidades em voz alta em vez de esperar que alguém adivinhe."],
      "growth": "Quando cresce, você volta parte desse cuidado para si e fica mais honesto sobre os próprios sentimentos e necessidades."
    },
    "type3": {
      "name": "O Realizador",
      "word": "realizador",
      "vibe": "Você define uma meta, acha o caminho mais rápido até ela e leva todo mundo junto.",
      "desire": "Sentir-se valioso e ter sucesso",
      "fear": "Não ter valor ou fracassar",
      "desc": "Você é determinado, adaptável e cheio de energia. Sabe definir metas, ler o ambiente e entregar resultados, e as pessoas muitas vezes se inspiram na sua confiança e garra. Você gosta de evoluir, melhorar e ser bom no que faz. Às vezes, porém, é fácil medir a si mesmo só pelo que conquista e continuar correndo mesmo cansado. Na sua melhor versão, você é tão autêntico quanto bem-sucedido e sabe que tem valor mesmo num dia devagar.",
      "keywords": ["Determinado", "Adaptável", "Inspirador"],
      "strengths": ["Transformar ideias em resultados reais", "Motivar um time e manter o ritmo", "Aprender rápido e se adaptar a qualquer ambiente"],
      "tips": ["Pergunte a si mesmo o que você quer, não só o que vai parecer bom.", "Marque na agenda um tempo de descanso de verdade e leve isso tão a sério quanto um prazo.", "Conte um fracasso ou uma dúvida para alguém de confiança. Ser verdadeiro aproxima as pessoas de você."],
      "growth": "Quando cresce, você se dedica mais a pessoas e causas maiores do que o próprio sucesso."
    },
    "type4": {
      "name": "O Individualista",
      "word": "individualista",
      "vibe": "Você sente tudo profundamente e quer que a sua vida tenha um sentido só seu.",
      "desire": "Ser você mesmo e encontrar o seu próprio sentido",
      "fear": "Não ter identidade ou ser comum",
      "desc": "Você é sensível, criativo e honesto sobre emoções que muita gente evita. Percebe beleza e significado nas pequenas coisas e prefere ser autêntico a se encaixar. Os amigos te procuram quando a vida aperta, porque você não tem medo de sentimentos de verdade. Às vezes pode parecer que falta alguma coisa ou que para os outros tudo é mais fácil, e o humor pode te levar junto. Na sua melhor versão, você transforma sentimentos profundos em criatividade e compaixão e aproveita o que já é bom na sua vida.",
      "keywords": ["Criativo", "Autêntico", "Profundo"],
      "strengths": ["Expressar sentimentos em palavras, arte ou estilo", "Ficar ao lado das pessoas em emoções difíceis", "Ver beleza e sentido que os outros não percebem"],
      "tips": ["Quando bater um humor forte, dê um nome a ele e faça mesmo assim uma pequena coisa prática.", "Mantenha uma lista do que já é bom na sua vida e aumente essa lista com frequência.", "Crie algo com regularidade, mesmo que ninguém veja. Hábitos constantes dão uma casa aos seus sentimentos."],
      "growth": "Quando cresce, você ganha estrutura e disciplina e transforma sentimentos em um trabalho constante do qual se orgulha."
    },
    "type5": {
      "name": "O Observador",
      "word": "observador",
      "vibe": "Você quer entender como tudo funciona, de preferência de um cantinho tranquilo.",
      "desire": "Entender o mundo e ser capaz",
      "fear": "Ficar impotente, sobrecarregado ou sem saber nada",
      "desc": "Você é curioso, atento e independente. Adora mergulhar num assunto até entendê-lo de verdade e costuma notar detalhes e padrões que os outros deixam passar. Você valoriza seu tempo, sua energia e sua privacidade, e precisa de espaço para pensar antes de agir ou compartilhar. Às vezes pode ficar tempo demais dentro da própria cabeça ou se afastar quando pedem mais do que você se sente pronto para dar. Na sua melhor versão, você compartilha o que sabe com generosidade e entra no mundo com confiança.",
      "keywords": ["Curioso", "Perspicaz", "Independente"],
      "strengths": ["Pensar com clareza quando os outros entram em pânico", "Aprender a fundo e explicar ideias complexas", "Manter a objetividade e a calma"],
      "tips": ["Compartilhe o que sabe antes de parecer pronto. Suas ideias pela metade muitas vezes já são úteis.", "Experimente coisas com as mãos e o corpo, não só com a mente.", "Avise quando precisar de um tempo sozinho, para que ninguém leia o seu silêncio como distância."],
      "growth": "Quando cresce, você passa de olhar para fazer e age com mais confiança e presença."
    },
    "type6": {
      "name": "O Leal",
      "word": "leal",
      "vibe": "Você é aquele amigo que pensa à frente, tem um plano e fica por perto quando importa.",
      "desire": "Sentir-se seguro, apoiado e confiante nas pessoas ao seu redor",
      "fear": "Ficar sem apoio ou sem orientação",
      "desc": "Você é leal, responsável e rápido em perceber o que pode dar errado, o que faz de você um ótimo planejador e um amigo de confiança. Leva compromissos a sério e se importa muito com a sua gente e as suas comunidades. Como você pensa em todos os cenários, a cabeça pode se encher de dúvidas, e pode levar um tempo para confiar nos outros, ou em si mesmo. Na sua melhor versão, você é corajoso e firme e confia no próprio julgamento tanto quanto nas pessoas que ama.",
      "keywords": ["Leal", "Responsável", "Preparado"],
      "strengths": ["Ver problemas cedo e se planejar para eles", "Ficar ao lado dos amigos para o que der e vier", "Unir pessoas em torno de um objetivo comum"],
      "tips": ["Quando a preocupação virar uma bola de neve, escreva o que está acontecendo agora, não o que pode acontecer.", "Tome uma pequena decisão por dia sem perguntar a ninguém e perceba que dá certo.", "Lembre do seu histórico. Você já passou por coisas difíceis antes."],
      "growth": "Quando cresce, você relaxa, confia um pouco mais na vida e encontra um centro calmo e firme."
    },
    "type7": {
      "name": "O Entusiasta",
      "word": "entusiasta",
      "vibe": "A vida é uma aventura, e você quer provar todos os sabores do cardápio.",
      "desire": "Ser feliz, livre e cheio de boas experiências",
      "fear": "Ficar preso na dor, no tédio ou em limites",
      "desc": "Você é animado, curioso e cheio de ideias. Encontra graça em quase tudo, se recupera rápido, e a sua energia levanta todo mundo ao redor. Lugares, planos e possibilidades novas te acendem. Como sempre tem algo empolgante logo ali, pode ser difícil ficar muito tempo numa coisa só, ou com sentimentos difíceis. Na sua melhor versão, você une alegria com foco e profundidade e descobre que estar presente pode ser ainda melhor do que o próximo plano.",
      "keywords": ["Animado", "Curioso", "Espontâneo"],
      "strengths": ["Levar energia e diversão para qualquer grupo", "Ter soluções criativas rapidinho", "Dar a volta por cima depois de um tropeço"],
      "tips": ["Termine um plano antes de começar o próximo e curta essa sensação de coisa concluída.", "Quando algo doer, deixe-se sentir por um momento antes de procurar uma distração.", "Experimente uma hora lenta e silenciosa de vez em quando. A calma também pode ser uma aventura."],
      "growth": "Quando cresce, você desacelera, se concentra a fundo e aproveita momentos calmos e reflexivos."
    },
    "type8": {
      "name": "O Desafiador",
      "word": "desafiador",
      "vibe": "Você fala na lata, protege os seus e nunca foge de um desafio.",
      "desire": "Ser forte, ter o controle da própria vida e proteger os outros",
      "fear": "Ser controlado, ferido ou ficar sem poder",
      "desc": "Você é confiante, direto e cheio de energia. Assume o comando quando a coisa complica, defende quem não consegue se defender, e os outros se sentem seguros com você do lado deles. Você valoriza a honestidade e respeita a força. Às vezes a sua intensidade pode parecer demais, e você pode esconder sentimentos mais delicados para nunca parecer vulnerável. Na sua melhor versão, você usa a sua força para levantar os outros e deixa quem você confia ver o seu coração grande e quente.",
      "keywords": ["Ousado", "Protetor", "Direto"],
      "strengths": ["Decidir e assumir o comando numa crise", "Proteger quem é tratado de forma injusta", "Falar com honestidade quando os outros se calam"],
      "tips": ["Antes de pressionar, faça mais uma pergunta e escute de verdade a resposta.", "Mostre o seu lado mais sensível para alguém de confiança. Isso é força, não fraqueza.", "Perceba quando você está na potência máxima e escolha quais batalhas realmente importam."],
      "growth": "Quando cresce, você abre o coração e usa a sua força para cuidar dos outros com delicadeza."
    },
    "type9": {
      "name": "O Pacificador",
      "word": "pacificador",
      "vibe": "Você leva calma aonde vai e consegue ver todos os lados da história.",
      "desire": "Ter paz interior e harmonia com os outros",
      "fear": "Conflito, perda de conexão ou ficar isolado",
      "desc": "Você é tranquilo, paciente e acolhedor. Consegue enxergar muitos pontos de vista, acalma situações tensas, e as pessoas se sentem à vontade e aceitas perto de você. Muitas vezes você é a cola que mantém o grupo unido. Como quer que tudo fique em paz, você pode acabar indo na onda dos outros, adiar as próprias prioridades ou evitar dizer o que realmente pensa. Na sua melhor versão, você é firme e presente e sabe que a sua voz e os seus desejos importam tanto quanto os de qualquer pessoa.",
      "keywords": ["Calmo", "Acolhedor", "Apoiador"],
      "strengths": ["Acalmar conflitos e ajudar as pessoas a se entenderem", "Escutar sem julgar", "Criar um clima leve e acolhedor"],
      "tips": ["Pergunte a si mesmo o que você quer antes de perguntar o que os outros querem.", "Escolha uma tarefa importante toda manhã e faça ela primeiro.", "Dê a sua opinião sincera, com gentileza. Um pouco de atrito pode deixar as relações mais fortes."],
      "growth": "Quando cresce, você desperta para os próprios objetivos e age com energia e foco."
    }
  }
};
