/* Introvert or Extrovert Test (pt, Brazilian Portuguese)
 * 8 result ids (recharger, teapot, observer, chameleon, host, cheer, connector, butterfly); questions[i].choices[j] follow introvert-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: recharge solo/people, circle close/wide, voice inward/outward;
 *  side 0 = the introvert side, side 1 = the extrovert side). This is a spectrum of social energy — never use personality-type letter codes or brand names of other type systems.
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the user's own introvert/extrovert bar ({n}) and the real server share ({pct}).
 * Honesty: just for fun — not a clinical assessment or diagnosis.
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
    "title": "Teste introvertido ou extrovertido – De onde vem sua energia?",
    "description": "Teste introvertido extrovertido grátis: 12 situações do dia a dia, cerca de 2 minutos, sem cadastro. Veja onde você fica no espectro da energia social, só por diversão.",
    "ogTitle": "Teste introvertido ou extrovertido ⚡ De onde vem sua energia?",
    "ogDescription": "Doze situações rápidas do dia a dia. Veja o seu equilíbrio entre introvertido e extrovertido e conheça seu personagem de energia social. Um quiz divertido, não uma avaliação clínica."
  },
  "siteName": "Teste introvertido ou extrovertido",
  "privacyLink": "Política de Privacidade",
  "start": {
    "badge": "⚡ Quiz de energia social",
    "h1Kicker": "Teste introvertido ou extrovertido",
    "h1Html": "Sofá e série ou rolê até tarde?<br>De onde vem a sua <em>energia</em>?",
    "hook": "Tem gente que recarrega no sofá, tem gente que recarrega no meio da galera, e a maioria fica em algum lugar no meio. Responda a doze situações do dia a dia e veja o seu lugar no espectro entre introvertido e extrovertido, além do personagem de energia social que combina com você.",
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
    "text": "Medindo sua bateria social…",
    "sub": "Contando noites tranquilas e noites agitadas"
  },
  "result": {
    "title": "Meu tipo de energia social: {name}",
    "metaDesc": "Resultado do teste introvertido ou extrovertido: {name}. {vibe} Veja seus pontos fortes, dicas, sua melhor dupla e seu tipo oposto.",
    "eyebrow": "Seu tipo de energia social é…",
    "ieTitle": "Seu equilíbrio introvertido / extrovertido",
    "ieIntro": "Introvertido",
    "ieExtro": "Extrovertido",
    "ieNote": "Calculado a partir das suas doze respostas: recarregar sozinho, um círculo pequeno e pensar antes de falar contam para o lado introvertido; as escolhas opostas contam para o lado extrovertido.",
    "pctFmt": "{n}%",
    "leanIntro": "Suas respostas pendem para o lado introvertido.",
    "leanExtro": "Suas respostas pendem para o lado extrovertido.",
    "leanAmbi": "Você está bem na zona ambivertida e tira energia dos dois lados.",
    "traitsLabel": "Seus pontos fortes",
    "tipsLabel": "Dicas para você",
    "perfectLabel": "Seu dia perfeito",
    "bestLabel": "Melhor dupla",
    "rivalLabel": "Tipo oposto",
    "disclaimer": "Só por diversão! Este quiz é para se divertir, não é uma avaliação clínica. Ele olha para alguns hábitos sociais do dia a dia e não pode diagnosticar nada. Introversão e extroversão são um espectro, e a maioria das pessoas se move nele conforme o dia.",
    "sameShare": "{pct}% das pessoas tiveram este resultado",
    "shareText": "Meu tipo de energia social é {name} {emoji} “{vibe}” E você, é mais introvertido ou extrovertido?",
    "ctaStrong": "Um amigo compartilhou o tipo de energia social dele",
    "ctaSub": "Introvertido, extrovertido ou no meio-termo? Descubra em 2 minutos.",
    "retry": "Refazer o teste"
  },
  "og": {
    "eyebrow": "Meu tipo de energia social",
    "brand": "⚡ Teste introvertido ou extrovertido",
    "defaultKicker": "Quiz de energia social",
    "defaultTitle": "Introvertido ou extrovertido?",
    "defaultDesc": "12 situações · 2 minutos · o seu equilíbrio"
  },
  "faq": [
    {
      "q": "Qual é a diferença entre introvertido e extrovertido?",
      "a": "É principalmente uma questão de energia. Quem fica do lado introvertido costuma recarregar com silêncio e tempo sozinho, enquanto quem fica do lado extrovertido costuma se animar com companhia e movimento. Não é o mesmo que ser tímido ou desinibido, e não diz nada sobre o quanto você é gentil ou capaz."
    },
    {
      "q": "O que é um ambivertido?",
      "a": "Um ambivertido fica perto do meio do espectro e consegue curtir tanto momentos agitados quanto tranquilos, dependendo do dia. Muita gente está nessa zona do meio, e é por isso que o seu resultado mostra a sua própria barra de equilíbrio, e não só um rótulo."
    },
    {
      "q": "Como meu resultado é escolhido?",
      "a": "Cada situação observa um de três hábitos: como você recarrega, se prefere um círculo pequeno ou grande de pessoas, e se pensa antes de falar ou pensa em voz alta. A combinação dos três escolhe o seu tipo, e as mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "De onde vem a porcentagem introvertido/extrovertido?",
      "a": "Ela é calculada só com as suas respostas. Cada escolha soma um pouco para o lado introvertido ou para o lado extrovertido, e as respostas mais fortes contam um pouco mais. Não há comparação com outras pessoas."
    },
    {
      "q": "Isto é uma avaliação clínica?",
      "a": "Não. Este quiz é só por diversão, não é uma avaliação clínica nem um diagnóstico. Suas respostas são calculadas no seu navegador e não são armazenadas; apenas contamos, de forma anônima, qual resultado apareceu."
    }
  ],
  "privacy": {
    "title": "Política de Privacidade | Teste introvertido ou extrovertido",
    "description": "Política de Privacidade do Teste introvertido ou extrovertido — como usamos cookies, anúncios e estatísticas anônimas.",
    "h1": "Política de Privacidade",
    "introHtml": "O Teste introvertido ou extrovertido (o \"Serviço\") respeita a sua privacidade e trata apenas o mínimo de informações necessárias, conforme descrito abaixo.",
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
        "Esta política está em vigor desde 10 de novembro de 2026."
      ]
    ],
    "back": "← Voltar ao Teste introvertido ou extrovertido"
  },
  "questions": [
    {
      "q": "É sexta à noite depois de uma semana longa e corrida. O que parece melhor?",
      "choices": [
        "Celular no silencioso, cobertor e uma série. Só eu",
        "Um jantar rápido com um ou dois amigos e depois casa",
        "Mando no grupo do WhatsApp: quem topa sair hoje? Preciso de gente!",
        "Uma noite tranquila em casa, talvez uma ligação rápida com alguém próximo"
      ]
    },
    {
      "q": "Seu aniversário está chegando. Como você quer comemorar?",
      "choices": [
        "Uma festa grande. Chamo todo mundo, amigo de amigo é bem-vindo",
        "Um jantar com as duas ou três pessoas mais próximas",
        "Um encontro pequeno com um punhado de bons amigos",
        "Um churrasco tranquilo com gente de várias partes da minha vida"
      ]
    },
    {
      "q": "Numa reunião ou aula, alguém pergunta: “Alguma ideia?” Você…",
      "choices": [
        "Espero um pouco e falo quando a ideia estiver clara",
        "Entro na hora e vou descobrindo enquanto falo",
        "Fico quieto e mando a ideia depois, bem escrita",
        "Solto uma ideia meio crua e vou construindo com o que os outros dizem"
      ]
    },
    {
      "q": "No dia seguinte a uma festa grande ou um casamento, você se sente…",
      "choices": [
        "Um pouco cansado, mas topo um café com um amigo",
        "Totalmente esgotado. Preciso de um dia inteiro sozinho para me recuperar",
        "Bem, mas vou deixar o dia calmo e tranquilo",
        "Ainda no pique. Quem quer sair de novo?"
      ]
    },
    {
      "q": "Você está numa festa onde só conhece quem te convidou. Você…",
      "choices": [
        "Acho uma pessoa interessante e converso com ela quase a noite toda",
        "Vou me apresentando por aí. No fim, conheço metade da festa",
        "Entro numa roda de conversa e conheço algumas pessoas novas",
        "Fico perto de quem eu conheço ou vou ajudar na cozinha"
      ]
    },
    {
      "q": "Você está sozinho no elevador com um vizinho que mal conhece. Você…",
      "choices": [
        "Puxo papo sobre o tempo, o prédio, qualquer coisa",
        "Dou oi e faço um comentário rápido",
        "Sorrio, aceno com a cabeça e fico olhando os números dos andares",
        "Torço em silêncio para ninguém precisar falar nada"
      ]
    },
    {
      "q": "Você passa um dia livre inteiro sozinho em casa. À noite, você se sente…",
      "choices": [
        "Bem descansado, mas um papo rápido cairia bem",
        "Perfeito. Bateria cheia, faria tudo de novo amanhã",
        "Inquieto. Na hora do almoço eu já estava mandando mensagem para todo mundo",
        "Ok, mas preferia ter alguém por perto"
      ]
    },
    {
      "q": "Como são os seus grupos de conversa no celular?",
      "choices": [
        "Um ou dois grupos com as pessoas mais próximas, e já está ótimo",
        "Vários grupos, e acompanho a maioria deles",
        "Alguns grupos, mas falo mais em um só",
        "Muitos: trabalho, faculdade, futebol, amigos antigos, todos apitando"
      ]
    },
    {
      "q": "Quando alguma coisa está te incomodando, como você resolve?",
      "choices": [
        "Converso com alguém. Vai ficando mais claro enquanto eu falo",
        "Penso bem primeiro e depois, talvez, conto para alguém",
        "Ligo na hora para um amigo e falo até fazer sentido",
        "Escrevo ou penso quieto até entender tudo"
      ]
    },
    {
      "q": "Um amigo manda mensagem às seis da tarde: “Bora sair hoje?” Você…",
      "choices": [
        "Bora! Já estou me arrumando",
        "Talvez, se for algo tranquilo e não muito tarde",
        "Claro, ainda tenho um pouco de energia",
        "Hoje não. Minha bateria social acabou"
      ]
    },
    {
      "q": "É sua primeira semana num grupo, curso ou time novo. Você…",
      "choices": [
        "Converso com pessoas diferentes a cada vez",
        "Aprendo o nome de todo mundo e sugiro um rolê com a turma",
        "Acho uma pessoa com quem me dou bem e grudo nela",
        "Vou conhecendo umas duas pessoas aos poucos"
      ]
    },
    {
      "q": "Você precisa combinar algo com um amigo. Você prefere…",
      "choices": [
        "Mandar mensagem, para pensar antes no que dizer",
        "Ligar. É mais rápido e eu gosto de ouvir a voz",
        "Mandar um áudio",
        "Mandar mensagem e ligar rapidinho só se precisar"
      ]
    }
  ],
  "types": {
    "recharger": {
      "name": "Bateria Zen",
      "word": "bateria zen",
      "vibe": "Paz, silêncio e poucas pessoas que você ama. Você brilha mais depois de um tempo sozinho.",
      "keywords": ["Calmo", "Pensativo", "Leal"],
      "desc": "Você sabe exatamente o que enche a sua bateria: uma noite tranquila, o seu espaço e tempo para pensar. Você mantém um círculo pequeno de pessoas em quem confia de verdade, e com elas você é carinhoso, engraçado e muito leal. Nas conversas, você escuta primeiro e fala quando tem algo que vale a pena dizer, e por isso suas palavras têm peso. Dias corridos não são problema, mas depois você precisa de uma noite calma para voltar a ser você. Isso não é fraqueza. É só o jeito que a sua energia funciona.",
      "traits": ["Você escuta com atenção de verdade", "Você pensa antes de falar", "Você mantém amizades por anos", "Você fica bem na sua própria companhia"],
      "tips": ["Marque seu tempo de sossego como qualquer outro compromisso", "Compartilhe uma ideia em voz alta antes de deixá-la perfeita"],
      "perfect": "Uma tarde de chuva com um bom livro, um chá quentinho e uma mensagem comprida do seu melhor amigo."
    },
    "teapot": {
      "name": "Tagarela de Sofá",
      "word": "tagarela",
      "vibe": "Na sua com o mundo, mas não para de falar com as suas pessoas favoritas.",
      "keywords": ["Carinhoso", "Engraçado", "Autêntico"],
      "desc": "Quem não te conhece pode achar que você é quieto, mas os amigos próximos sabem a verdade: quando você se sente em casa, as histórias não acabam mais. Você recarrega no seu canto e prefere poucos amigos próximos a uma multidão, mas pensa em voz alta e adora conversas longas que mudam de assunto o tempo todo. Você é aquele amigo que liga para contar uma coisinha e fica uma hora no telefone. As pessoas ficam à vontade com você porque você é sincero e fácil de conversar. Só não esqueça de garantir o sossego de que você precisa depois.",
      "traits": ["Você faz os amigos se sentirem em casa", "Você conta histórias que fazem todo mundo rir", "Você fala o que realmente pensa", "Você mantém a conversa fluindo"],
      "tips": ["Deixe gente nova ver o seu lado falante um pouco mais cedo", "Reserve uma noite tranquila depois de um papo longo"],
      "perfect": "Uma conversa até de madrugada no sofá com a sua pessoa favorita e petiscos na mesa."
    },
    "observer": {
      "name": "Observador Gentil",
      "word": "observador",
      "vibe": "Você conhece muita gente e repara em tudo, com calma e gentileza.",
      "keywords": ["Perceptivo", "Tranquilo", "Gentil"],
      "desc": "Você circula com facilidade por muitos grupos diferentes, mas raramente precisa ser o centro das atenções. Você gosta de estar com as pessoas, desde que possa dar um passo atrás, olhar e ouvir. Por isso, você percebe coisas que os outros não veem: quem está se sentindo de fora, quem está cansado, quem precisa de uma palavra gentil. Amigos de partes bem diferentes da sua vida sentem que te conhecem. Eventos grandes são divertidos em pequenas doses, e depois você precisa de sossego para processar tudo o que viu e ouviu.",
      "traits": ["Você lê o clima de um lugar", "Você se dá bem com todo tipo de gente", "Você repara nos pequenos detalhes", "Você fica calmo em lugares cheios"],
      "tips": ["Conte o que você percebe. Seu olhar ajuda os outros", "Saia um pouco mais cedo quando a bateria estiver acabando"],
      "perfect": "Um encontro animado onde você passeia entre as conversas e depois volta para casa a pé, em silêncio."
    },
    "chameleon": {
      "name": "Camaleão Social",
      "word": "camaleão",
      "vibe": "Alma da festa numa noite, eremita feliz na outra. Você se adapta a qualquer ambiente.",
      "keywords": ["Flexível", "Expressivo", "Equilibrado"],
      "desc": "Você conversa com qualquer pessoa, pensa em voz alta com facilidade e acompanha um círculo grande de amigos, mas a sua bateria ainda recarrega melhor em casa. Essa mistura faz de você um ambivertido nato: animado e falante quando sai, e feliz no silêncio quando precisa se reorganizar. Às vezes as pessoas se surpreendem quando você recusa um convite, mas você conhece os seus limites. Você troca de modo com tanta naturalidade que se encaixa em quase qualquer lugar. O seu talento é o equilíbrio, então continue ouvindo o que a sua energia diz.",
      "traits": ["Você se encaixa em quase qualquer grupo", "Você conversa com qualquer pessoa", "Você sabe quando precisa de uma pausa", "Você traz energia sem se esgotar"],
      "tips": ["Recuse um convite sem culpa", "Avise os amigos próximos quando estiver no modo sossego"],
      "perfect": "Uma noite divertida com os amigos, seguida de uma manhã lenta e preguiçosa só para você."
    },
    "host": {
      "name": "Anfitrião Acolhedor",
      "word": "anfitrião",
      "vibe": "Você ama companhia em doses pequenas e quentinhas: comida boa, amigos próximos, papo de verdade.",
      "keywords": ["Atencioso", "Constante", "Acolhedor"],
      "desc": "Estar com pessoas enche a sua bateria, mas você prefere o aconchego ao barulho. Um jantar em casa, um café de sempre ou uma viagem curta com amigos próximos te deixam mais feliz. Você escuta com atenção, pensa antes de falar e lembra do que importa para as pessoas que você ama. Os amigos sabem que sempre podem contar com você, porque você cria um espaço calmo e acolhedor. Multidões podem ser um pouco demais, mas uma mesa cheia de rostos conhecidos é o seu lugar favorito no mundo.",
      "traits": ["Você faz as pessoas se sentirem bem-vindas", "Você lembra das pequenas coisas", "Você mantém a turma unida", "Você escuta sem julgar"],
      "tips": ["Deixe outra pessoa receber de vez em quando para você relaxar também", "Experimente uma turma nova de vez em quando. Você pode amar"],
      "perfect": "Um jantar longo em casa com amigos próximos, velas acesas e ninguém olhando o relógio."
    },
    "cheer": {
      "name": "Líder de Torcida",
      "word": "líder de torcida",
      "vibe": "Barulhento, leal e sempre torcendo pela sua galera. Seus amigos são a sua energia.",
      "keywords": ["Empolgado", "Leal", "Encorajador"],
      "desc": "Você tira energia das pessoas e devolve tudo para as suas favoritas. Você prefere uma turma próxima a uma multidão, e com ela você é barulhento, engraçado e apoia sem fim. Você pensa em voz alta, reage com o rosto inteiro e manda áudios mais longos que muito podcast. Quando um amigo tem uma boa notícia, você é o primeiro a comemorar. Quando ele tem um dia difícil, você é o primeiro a aparecer. Lembre que também é ótimo receber apoio.",
      "traits": ["Você levanta as pessoas quando estão pra baixo", "Você comemora cada conquista", "Você mantém o grupo do WhatsApp vivo", "Você deixa qualquer plano mais divertido"],
      "tips": ["Peça apoio quando precisar, não só ofereça", "Deixe um pouco de silêncio para os amigos mais quietos entrarem na conversa"],
      "perfect": "Uma viagem de carro com os amigos mais próximos, som alto e todo mundo cantando junto."
    },
    "connector": {
      "name": "Conector Sereno",
      "word": "conector",
      "vibe": "Você conhece todo mundo e junta as pessoas, com um estilo calmo e pensado.",
      "keywords": ["Confiável", "Diplomático", "Sociável"],
      "desc": "As pessoas te dão energia, e você conhece muitas delas. Você gosta de conhecer gente nova e de manter contato com vários grupos, mas faz isso de um jeito calmo e pensado. Você escuta, pensa e depois diz a coisa certa, e isso te torna ótimo em apresentar pessoas que deveriam se conhecer. Os outros confiam em você como uma ponte entre amigos, equipes e famílias. Você raramente precisa de holofote, porque ver as pessoas se conectando já é recompensa suficiente. Só lembre de guardar um tempo para as suas amizades mais próximas também.",
      "traits": ["Você apresenta pessoas que precisam se conhecer", "Você fica calmo nas discussões em grupo", "Você mantém contato com muitos amigos", "Você escolhe as palavras com cuidado"],
      "tips": ["Arrume tempo para conversas a sós com os amigos mais próximos", "Dê a sua opinião mesmo quando o grupo discorda"],
      "perfect": "Um encontro tranquilo em que você apresenta dois amigos que acabam se dando super bem."
    },
    "butterfly": {
      "name": "Borboleta Social",
      "word": "borboleta",
      "vibe": "Rostos novos, planos grandes e papo sem fim. As pessoas são a sua fonte de energia.",
      "keywords": ["Extrovertido", "Animado", "Espontâneo"],
      "desc": "Você se acende no meio da galera. Conhecer gente nova, fazer planos e conversar sobre tudo te dá mais energia do que qualquer cochilo. Sua agenda está cheia, seu celular não para de vibrar e você pensa melhor quando está falando. Você faz desconhecidos parecerem velhos amigos em poucos minutos e leva vida a qualquer ambiente. Dias quietos podem te deixar inquieto, mas também ajudam a recarregar de outro jeito. O seu calor humano é um presente, então divida ele com as pessoas mais quietas também.",
      "traits": ["Você faz amigos em qualquer lugar", "Você leva energia para qualquer evento", "Você puxa conversa com facilidade", "Você transforma dias comuns em programas"],
      "tips": ["Reserve uma noite tranquila por semana para descansar a voz", "Converse a sós com os amigos que não curtem multidão"],
      "perfect": "Um festival, uma festa enorme ou uma cidade nova cheia de gente que você ainda não conhece."
    }
  }
};
