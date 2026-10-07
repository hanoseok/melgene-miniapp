/* Teste de idade mental (pt — português do Brasil)
 * Same 8 age-bracket ids (kid teen fresh hustle steady seasoned mellow sage) and question/choice order as mentalage-core.js
 * (the "mind age" points live only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].points[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * result.age = plural forms for the number age (Intl.PluralRules: one/few/many/other), {n} = the number (or a range like 24–29).
 * Placeholders: {name} {emoji} {vibe} {age} {pct} {n} {min} {max} {range} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Pangolin&display=swap",
    "display": "'Pangolin'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Teste de idade mental: quantos anos tem sua mente?",
    "description": "Faça o teste de idade mental: 12 perguntas leves do dia a dia, 2 a 3 minutos, sem cadastro. Descubra quantos anos sua mente tem de verdade, com o número exato, seus pontos fortes e dicas.",
    "ogTitle": "Teste de idade mental 🧠 Quantos anos tem sua mente?",
    "ogDescription": "Um quiz de 2 minutos. 12 perguntas do dia a dia revelam sua idade mental, com número exato."
  },
  "siteName": "Teste de idade mental",
  "privacyLink": "Privacidade",
  "start": {
    "badge": "🧠 Quiz rápido da mente",
    "h1Kicker": "Teste de idade mental",
    "h1Html": "Quantos anos sua mente<br><em>tem de verdade</em>?",
    "hook": "Seu RG diz um número. Seus hábitos do dia a dia talvez digam outro. Responda com sinceridade e veja o que sua cabeça acha.",
    "metaTime": "⏱️ 2 a 3 min",
    "metaCount": "✏️ 12 perguntas",
    "start": "Começar o teste →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Lendo seus rabiscos…",
    "sub": "Contando as velinhas do bolo da sua mente"
  },
  "result": {
    "title": "Teste de idade mental: eu sou {name}",
    "eyebrow": "Sua idade mental",
    "range": "{min}–{max}",
    "age": {
      "one": "{n} ano",
      "few": "{n} anos",
      "many": "{n} anos",
      "other": "{n} anos"
    },
    "metaRange": "Idade mental: {range}.",
    "strengthsLabel": "O que faz você brilhar",
    "tipsLabel": "Dicas para sua idade mental",
    "bestLabel": "Melhor amigo",
    "rivalLabel": "Rival",
    "sameShare": "{pct}% dos jogadores tiveram essa faixa",
    "shareText": "Minha idade mental: {age} {emoji} {name} — “{vibe}” Quantos anos tem a sua mente?",
    "ctaStrong": "Um amigo compartilhou a idade mental dele",
    "ctaSub": "Quantos anos tem sua mente? 2 minutos.",
    "retry": "Refazer o teste"
  },
  "og": {
    "eyebrow": "Minha idade mental",
    "brand": "🧠 Teste de idade mental",
    "defaultKicker": "Teste de idade mental",
    "defaultTitle": "Quantos anos tem sua mente?",
    "defaultDesc": "12 perguntas do dia a dia · 2 a 3 minutos"
  },
  "faq": [
    {
      "q": "Como minha idade mental é calculada?",
      "a": "Cada resposta vale alguns pontos de “idade mental”. O total coloca você numa faixa de idade, e a posição das suas respostas dentro dessa faixa dá o número exato. Mesmas respostas, mesmo resultado."
    },
    {
      "q": "É um teste psicológico de verdade?",
      "a": "Não, é só por diversão. Ele olha hábitos e humor do dia a dia, não inteligência nem maturidade. Encare como um espelho divertido, não como um diagnóstico."
    },
    {
      "q": "Por que meu resultado é tão diferente da minha idade real?",
      "a": "Essa é a graça. Muita gente tem a mente mais jovem ou mais madura do que a idade. O resultado também pode mudar com o humor, então tente de novo outro dia."
    },
    {
      "q": "Minhas respostas ficam salvas?",
      "a": "Não. As respostas são calculadas no seu navegador e nunca ficam salvas. Só contamos, de forma anônima, qual faixa de idade saiu, para mostrar quão comum é cada resultado."
    }
  ],
  "privacy": {
    "title": "Política de privacidade | Teste de idade mental",
    "description": "Política de privacidade do Teste de idade mental: cookies, publicidade e estatísticas anônimas.",
    "h1": "Política de privacidade",
    "introHtml": "O Teste de idade mental (o “Serviço”) respeita sua privacidade e trata apenas o mínimo de informações necessárias, como descrito abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "Você pode usar o Serviço sem cadastro nem login. Suas respostas são calculadas no navegador e nunca são enviadas nem salvas em nossos servidores. Só contamos, de forma anônima, qual faixa de idade saiu, para mostrar quão comum é cada resultado."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma, exibir anúncios e entender como é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar direito."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere a personalização em <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Guardamos totais diários anônimos (visualizações, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não identificam você."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política vale a partir de 8 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao teste de idade mental"
  },
  "questions": [
    {
      "q": "Sábado sem despertador. Que horas você acorda?",
      "choices": [
        "Às 6, já com o dia todo planejado",
        "Lá pelas 9, descansado e sem alarme",
        "Depois do meio-dia… manhã, o que é isso?",
        "Cedinho, pulando da cama porque é fim de semana!"
      ]
    },
    {
      "q": "Seu aniversário ideal é…",
      "choices": [
        "Balões, chapeuzinho e um bolo gigante com brigadeiro!",
        "Um festão com a galera toda",
        "Um jantar gostoso com poucos amigos",
        "Um dia tranquilo e uma ligação da família"
      ]
    },
    {
      "q": "Você está na rua e o celular chega a 15%.",
      "choices": [
        "Desespero, saio caçando uma tomada",
        "Tranquilo, sempre levo carregador portátil",
        "Se desligar, desligou. Modo aventura!"
      ]
    },
    {
      "q": "No mercado, você vai direto para…",
      "choices": [
        "O corredor de doces e salgadinhos",
        "Lasanha congelada e energético",
        "Hortifrúti e as promoções da semana",
        "Minha lista de compras, item por item"
      ]
    },
    {
      "q": "Todo mundo está falando de um hit novo.",
      "choices": [
        "Já sei a dancinha do TikTok",
        "Entrou na minha playlist no primeiro dia",
        "Isso não é regravação de uma música antiga?",
        "Um dia eu escuto"
      ]
    },
    {
      "q": "Dia de folga com chuva. Qual é o plano?",
      "choices": [
        "Galocha e pular nas poças!",
        "Coberta, petiscos e uma temporada inteira de série",
        "Fazer uma sopa quentinha e arrumar um pouco a casa",
        "Chá, um bom livro e um cochilo com barulho de chuva"
      ]
    },
    {
      "q": "Caiu um bônus surpresa na conta.",
      "choices": [
        "Finalmente compro aquele game ou boneco",
        "Já marco uma viagem com os amigos",
        "Um jantar caprichado e o resto guardado",
        "Tudo na poupança. Meu eu do futuro agradece."
      ]
    },
    {
      "q": "Sexta à noite, nada marcado.",
      "choices": [
        "Videogame ou chamada até o sol nascer",
        "Mando mensagem pra todo mundo até surgir um rolê",
        "Pijama às 21h, cama às 22h. Que delícia."
      ]
    },
    {
      "q": "Você sente uma gripe chegando.",
      "choices": [
        "Reclamo um pouco esperando alguém me paparicar",
        "Ignoro e sigo a vida",
        "Chá de gengibre, vitamina C e cama cedo",
        "Tomo um remédio e sigo com calma"
      ]
    },
    {
      "q": "O grupo do WhatsApp não para de apitar.",
      "choices": [
        "Respondo com dez figurinhas seguidas",
        "Mando o meme perfeito",
        "Leio tudo e depois respondo com um textão",
        "Silencio o grupo. Por que o povo fala tanto?"
      ]
    },
    {
      "q": "Seu quarto agora é…",
      "choices": [
        "Pelúcias, bonecos e coisas coloridas por todo lado",
        "Pôsteres, fios e um caos criativo",
        "Limpo e minimalista, tudo no lugar",
        "Plantas, uma poltrona confortável e um abajur de leitura"
      ]
    },
    {
      "q": "Se pudesse escolher só uma…",
      "choices": [
        "Voltar a ser criança sem preocupações por um dia",
        "Pular direto para uma aposentadoria tranquila"
      ]
    }
  ],
  "types": {
    "kid": {
      "name": "Criança do parquinho",
      "word": "criança do parquinho,parquinho",
      "vibe": "Curioso, brincalhão e movido a pura alegria.",
      "desc": "Sua mente ainda vive no ritmo do recreio. Você se empolga fácil, ri alto e acha graça em quase tudo. Regras viram opcionais quando tem uma brincadeira por perto. Essa energia sincera e iluminada é contagiante e deixa todo mundo ao redor mais jovem também.",
      "strengths": [
        "Curiosidade sem fim",
        "Levanta o astral na hora",
        "Imaginação sem medo"
      ],
      "tips": [
        "Mantenha o encanto, mas coloque um lembrete para as tarefas chatas de adulto.",
        "Quando algo parecer injusto, respire três vezes antes de reagir.",
        "Compartilhe sua coisa engraçada favorita com um amigo que precisa sorrir."
      ]
    },
    "teen": {
      "name": "Adolescente rebelde",
      "word": "adolescente,rebelde",
      "vibe": "Emoções gigantes, opiniões firmes e uma playlist para cada humor.",
      "desc": "Sua mente vive na intensidade do ensino médio: tudo importa demais e você sente tudo. Você questiona regras, descobre as novidades antes de todo mundo e precisa do seu espaço. Por trás da pose existe um coração leal, que faz tudo pelos amigos de verdade.",
      "strengths": [
        "Paixão por tudo",
        "Lealdade total",
        "Radar de tendências"
      ],
      "tips": [
        "Nem todo humor precisa de resposta na hora. Durma e pense amanhã.",
        "Anote suas grandes ideias, algumas são ótimas.",
        "Deixe alguém mais velho surpreender você. Ele também já foi rebelde."
      ]
    },
    "fresh": {
      "name": "Espírito de calouro",
      "word": "calouro",
      "vibe": "Livre, espontâneo e topa tudo.",
      "desc": "Sua mente está no primeiro ano da faculdade: meio sem grana, muito livre e sempre pronta para um rolê de última hora. Você coleciona experiências em vez de coisas e faz amigos em qualquer lugar. A vida é uma grande aventura que você vai descobrindo no caminho.",
      "strengths": [
        "Espontaneidade",
        "Faz amigos em todo canto",
        "Coragem para o novo"
      ],
      "tips": [
        "Diga sim às aventuras, mas crie um pequeno hábito de guardar dinheiro.",
        "Escolha um só objetivo este mês e vá até o fim.",
        "Ligue para casa de vez em quando, eles amam suas histórias."
      ]
    },
    "hustle": {
      "name": "Vinte e poucos a mil",
      "word": "vinte e poucos",
      "vibe": "Ambicioso, ocupado e movido a café e planos grandes.",
      "desc": "Sua mente está em pleno modo construção. Você equilibra metas, projetos paralelos e uma agenda lotada e ainda arruma tempo para se divertir. Quer crescer sem ficar chato. Sua garra inspira as pessoas, desde que você lembre de descansar.",
      "strengths": [
        "Garra imparável",
        "Rei do multitarefa",
        "Planejador otimista"
      ],
      "tips": [
        "Coloque o descanso na agenda do mesmo jeito que o trabalho.",
        "Comemore as pequenas vitórias, não só as grandes.",
        "Você não precisa ter tudo resolvido ainda."
      ]
    },
    "steady": {
      "name": "Trintão tranquilo",
      "word": "trintão",
      "vibe": "Calmo, confiável e no controle sem alarde.",
      "desc": "Sua mente encontrou o próprio ritmo. Você sabe do que gosta, do que não gosta e quando dizer não. Planeja com antecedência, cumpre o que promete e manda bem na cozinha. As pessoas procuram você quando precisam de uma mão firme, e você raramente decepciona.",
      "strengths": [
        "Confiança de rocha",
        "Planejamento esperto",
        "Conhece os próprios limites"
      ],
      "tips": [
        "Deixe espaço para uma diversão não planejada esta semana.",
        "Tente algo em que você seja iniciante de novo.",
        "Aceite ajuda às vezes. Confiança é via de mão dupla."
      ]
    },
    "seasoned": {
      "name": "Quarentão experiente",
      "word": "quarentão",
      "vibe": "Experiente, prático e difícil de abalar.",
      "desc": "Sua mente já viu algumas reviravoltas e continua tranquila. Você resolve problemas rápido, dá conselhos sinceros e não gasta energia com drama. Valoriza conforto, qualidade e gente que cumpre a palavra. Com você por perto, todo mundo se sente seguro.",
      "strengths": [
        "Calma sob pressão",
        "Conselhos sinceros",
        "Sabedoria prática"
      ],
      "tips": [
        "Conte suas histórias, os mais novos aprendem muito.",
        "Mantenha um hobby só por prazer, não por resultado.",
        "Alongue-se toda manhã. Suas costas agradecem."
      ]
    },
    "mellow": {
      "name": "Cinquentão de boa",
      "word": "cinquentão",
      "vibe": "Tranquilo, caloroso e feliz sem pressa.",
      "desc": "Sua mente curte a faixa da direita, sem pressa. Você prefere uma boa comida, uma caminhada longa e um papo de verdade a uma noite barulhenta. Coisas pequenas te fazem feliz, e a opinião dos outros já não preocupa. Seu calor tranquilo deixa qualquer encontro mais aconchegante.",
      "strengths": [
        "Presença serena",
        "Curte as pequenas alegrias",
        "Ouvinte generoso"
      ],
      "tips": [
        "Diga sim a uma experiência nova nesta estação.",
        "Ensine a alguém uma habilidade da qual você se orgulha.",
        "Mande uma mensagem curta para um amigo antigo."
      ]
    },
    "sage": {
      "name": "Alma velha e sábia",
      "word": "alma velha,sábia",
      "vibe": "Profundo, gentil e cheio de sabedoria silenciosa.",
      "desc": "Sua mente parece ter vivido várias vidas. Você ama calma, rotina, chá e bons livros. Repara no que os outros deixam passar, e seus conselhos ficam na cabeça por anos. Não corre atrás de modinha, mas as pessoas procuram seu olhar sereno.",
      "strengths": [
        "Olhar profundo",
        "Paciência gentil",
        "Conselhos que ficam"
      ],
      "tips": [
        "Faça algo espontâneo e meio bobo esta semana. Só porque sim.",
        "Suas rotinas tranquilas são ótimas: compartilhe com um amigo.",
        "Jogue algo com alguém bem mais novo. Vocês dois vão rir."
      ]
    }
  }
};
