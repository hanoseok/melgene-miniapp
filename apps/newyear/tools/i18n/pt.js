/* Teste da sorte de Ano-Novo (pt-BR) — mesma estrutura de en.js. O ano vem de newyear-core.js (YEAR).
 * Ordem das alternativas igual à do en (ela define a pontuação). Sem números ou % nos resultados, sem spoiler, só por diversão. */
const Y = require('../../newyear-core.js').YEAR;

module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap",
    "display": "'Lora'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": `Teste da sorte ${Y} – sua palavra do ano`,
    "description": `Faça o teste da sorte ${Y}: 11 perguntas rápidas, cerca de 2 minutos, sem cadastro. Descubra sua palavra do ano, cor, mês e objeto da sorte. Só por diversão.`,
    "ogTitle": `Teste da sorte ${Y} 🌅 Qual é a sua palavra para o ano?`,
    "ogDescription": `Onze perguntas leves sobre como você quer viver ${Y}. Descubra sua palavra do ano, sua cor, seu mês e seu objeto da sorte.`
  },
  "siteName": `Teste da sorte ${Y}`,
  "privacyLink": "Privacidade",
  "start": {
    "badge": `🌅 Olá, ${Y}`,
    "h1Kicker": `Teste da sorte ${Y}`,
    "h1Html": `Como vai ser<br>o seu <em>${Y}</em>?`,
    "hook": "Calendário novo, roupa branca separada e um ano inteiro de páginas em branco. Responda a onze perguntas leves sobre o seu jeito de viver e descubra a palavra, os amuletos e as pequenas previsões que esperam por você no ano que vem.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 perguntas",
    "start": "Ver meu ano →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "Pergunta {n}"
  },
  "loading": {
    "text": "Esperando o primeiro nascer do sol…",
    "sub": "Escrevendo a sua sorte para o ano novo"
  },
  "result": {
    "title": `Minha palavra de ${Y}: {name}`,
    "metaDesc": `Resultado do teste da sorte ${Y}: {name}. {vibe} Veja sua cor, seu mês e seu objeto da sorte e uma previsão leve para o ano.`,
    "eyebrow": `Sua palavra para ${Y}`,
    "colorLabel": "Cor da sorte",
    "monthLabel": "Mês da sorte",
    "itemLabel": "Objeto da sorte",
    "gaugeLabel": "Para onde suas respostas pesaram",
    "axes": [
      ["Novidades", "Constância"],
      ["Em turma", "Tempo só meu"],
      ["Planejar", "Deixar fluir"]
    ],
    "fortuneLabel": "Seu ano num relance",
    "areas": {
      "work": "Trabalho e estudos",
      "money": "Clima do bolso",
      "love": "Pessoas e amor",
      "self": "Autocuidado"
    },
    "tipLabel": "Uma pequena meta para tentar",
    "buddyLabel": "Combina demais",
    "rivalLabel": "Oposto querido",
    "disclaimer": "Só por diversão. Sua palavra, seus amuletos e suas previsões são ideias brincalhonas para o ano novo, não são previsões de verdade nem conselhos de saúde, dinheiro ou vida.",
    "sameShare": "{pct}% das pessoas tiraram esta palavra",
    "shareText": `Minha palavra de ${Y} é {name} {emoji} “{vibe}” E a sua?`,
    "ctaStrong": "Alguém compartilhou a sorte do ano novo",
    "ctaSub": `Como vai ser o seu ${Y}? Descubra em 2 minutos.`,
    "retry": "Fazer o teste de novo"
  },
  "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
  "og": {
    "eyebrow": `Minha palavra para ${Y}`,
    "brand": `🌅 Teste da sorte ${Y}`,
    "defaultKicker": "Um teste leve de Ano-Novo",
    "defaultTitle": `Como vai ser o seu ${Y}?`,
    "defaultDesc": "11 perguntas · 2 minutos · amuletos da sorte"
  },
  "faq": [
    {
      "q": "Como a minha palavra é escolhida?",
      "a": "Cada resposta mexe um pouco em três escalas: experimentar coisas novas ou manter um ritmo constante, estar com gente ou ter tempo para você, e planejar com antecedência ou deixar a vida levar. Sua palavra fica onde essas três se encontram, e as mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "Isso é uma previsão de verdade do meu ano?",
      "a": "Não. A palavra, a cor, o mês, o objeto da sorte e as pequenas previsões são ideias divertidas, como uma simpatia de Réveillon feita entre amigos. Ninguém sabe como um ano vai ser. Use o resultado como um jeito leve de pensar no que você gostaria de fazer."
    },
    {
      "q": "Posso refazer e tirar outra coisa?",
      "a": "Pode. Se você responder diferente, pode cair em outra palavra. Muita gente refaz o teste no meio do ano, quando o humor ou os planos mudaram."
    },
    {
      "q": "Minhas respostas ficam salvas?",
      "a": "Não. As respostas são calculadas no seu navegador e não são guardadas. Só contamos, de forma anônima, qual palavra saiu, para mostrar o quanto ela é comum."
    }
  ],
  "privacy": {
    "title": `Política de Privacidade | Teste da sorte ${Y}`,
    "description": `Política de Privacidade do Teste da sorte ${Y}: como usamos cookies, anúncios e estatísticas anônimas.`,
    "h1": "Política de Privacidade",
    "introHtml": "O Teste da sorte de Ano-Novo (o \"Serviço\") respeita a sua privacidade e trata apenas o mínimo de informações necessário, conforme descrito abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "Você pode usar o Serviço sem cadastro e sem login. Suas respostas são calculadas dentro do seu navegador e nunca são enviadas nem armazenadas nos nossos servidores. Apenas contamos, de forma anônima, qual resultado saiu, para mostrar o quanto cada resultado é comum."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar corretamente."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências de personalização de anúncios nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Mantemos totais diários anônimos (visualizações de página, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não identificam você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta Política de Privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política está em vigor desde 29 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao Teste da sorte"
  },
  "questions": [
    {
      "q": "Faltam dez minutos para a meia-noite do Réveillon. Onde você está?",
      "choices": [
        "No sofá com as pessoas que você mais ama, petiscos na mesa e zero planos",
        "Na festa da virada que você organizou para os amigos semanas atrás",
        "Em casa, sozinho, escrevendo as metas do ano num caderno novinho",
        "Num lugar desconhecido, numa viagem solo de última hora, vendo estranhos comemorarem"
      ]
    },
    {
      "q": "Uma agenda novinha para o ano chega na sua mesa. O que vai na primeira página?",
      "choices": [
        "Uma lista de coisas divertidas para fazer com os amigos. As datas ficam para depois",
        "Nada por enquanto. Você escreve quando der vontade",
        "Os aniversários de todo mundo e os encontros de família, antes de tudo",
        "Uma grande meta pessoal, dividida mês a mês"
      ]
    },
    {
      "q": "O primeiro nascer do sol do ano. Como você o recebe?",
      "choices": [
        "Despertador ligado, bebida quentinha na mão, olhando em silêncio pela janela",
        "Num trem bem cedo, por impulso, rumo a um lugar onde você nunca foi",
        "Guiando uma turma numa trilha até o alto do morro, com rota e lanches planejados",
        "Ainda acordado com os amigos depois da festa, e você vê por acaso"
      ]
    },
    {
      "q": "Sua meta para o ano provavelmente vai ser…",
      "choices": [
        "Aprender uma habilidade nova, com cronograma e controle de progresso",
        "Ligar ou visitar as pessoas que você ama com regularidade",
        "Dizer sim a mais convites e ver onde isso vai dar",
        "Nada de grandes metas. Só ser um pouco mais gentil consigo mesmo"
      ]
    },
    {
      "q": "Surge um projeto novo no trabalho ou na faculdade. Você…",
      "choices": [
        "Pega a parte que ninguém tentou ainda e vai descobrindo no caminho",
        "Entra num time de que gosta e ajuda onde precisarem",
        "Fica com a parte que você domina e faz com calma, por conta própria",
        "Se oferece para liderar e monta um plano junto com todo mundo"
      ]
    },
    {
      "q": "Chega um dinheirinho inesperado, como um presente ou um pequeno bônus.",
      "choices": [
        "Vai para um encontro já planejado ou para presentes para a família",
        "Você chama os amigos para algo divertido, ali mesmo, na hora",
        "Guarda e esquece até precisar",
        "Investe num curso ou em equipamento para algo novo que você vinha planejando"
      ]
    },
    {
      "q": "Um fim de semana livre, sem nada na agenda. O que acontece?",
      "choices": [
        "Você planeja um passeio de um dia com a turma para um lugar que ninguém conhece",
        "Você arruma a casa, prepara a semana e curte a calmaria",
        "Você passeia sozinho por um bairro que nunca explorou",
        "Você manda “bora aqui em casa?” no grupo e deixa o dia rolar"
      ]
    },
    {
      "q": "Numa reunião de Ano-Novo, alguém que você nunca viu senta do seu lado.",
      "choices": [
        "Sorri, mantém a conversa leve e aproveita a comida em paz",
        "Pergunta sobre o trabalho da pessoa. Pode ter algo a aprender para as suas metas",
        "Apresenta a pessoa para todo mundo e puxa uma brincadeira",
        "Faz questão de que ela se sinta bem-vinda e chama para o próximo encontro"
      ]
    },
    {
      "q": "Depois de uma fase corrida, você está meio cansado. Como recarrega?",
      "choices": [
        "Liga para um amigo próximo e fica horas conversando sobre nada",
        "Experimenta algo totalmente novo, por impulso, só para você",
        "Organiza uma escapada de fim de semana com os amigos, roteiro incluído",
        "Reserva uma noite tranquila: dormir cedo, um bom livro e um chá"
      ]
    },
    {
      "q": "No meio do ano, aparece uma oportunidade inesperada.",
      "choices": [
        "Pensa com cuidado e depois vai com um plano claro",
        "Deixa passar. Você está feliz com o ritmo que tem",
        "Conversa com as pessoas mais próximas antes de decidir",
        "Mergulha de cabeça e leva um amigo junto na aventura"
      ]
    },
    {
      "q": "Imagine o próximo Réveillon. O que mais te deixaria orgulhoso?",
      "choices": [
        "Um caderno cheio de pequenos hábitos que você realmente manteve",
        "Uma grande meta que o time inteiro alcançou junto",
        "Um ano cheio de momentos carinhosos com quem você ama",
        "Um monte de histórias de coisas que você fez pela primeira vez"
      ]
    }
  ],
  "types": {
    "voyage": {
      "name": "A Grande Travessia",
      "word": "travessia",
      "vibe": "Você traça a rota, e a tripulação adora navegar com você.",
      "desc": "Este pode ser um ano de soltar as amarras. Você gosta de horizontes novos, mas não sai do porto sem mapa e quase nunca viaja sozinho. As pessoas confiam nos seus planos porque você pensa em todo mundo a bordo. Grandes metas em grupo combinam com você este ano: um projeto em equipe, uma viagem com a turma, um desafio encarado com os amigos. Mantenha o rumo, mas aproveite a paisagem pelo caminho.",
      "keywords": ["Planos ousados", "Trabalho em equipe", "Novos horizontes"],
      "color": "Azul-oceano",
      "item": "Um mapa de papel de um lugar que você quer conhecer",
      "fortune": {
        "work": "Um bom ano para começar algo maior do que você faria sozinho. Seu talento para organizar pessoas pode abrir portas interessantes.",
        "money": "Juntar para um objetivo em comum, como uma viagem ou uma comemoração, pode motivar mais do que guardar só por guardar.",
        "love": "As pessoas se reúnem ao seu redor. Lembre de perguntar como a tripulação está, não só como anda o plano.",
        "self": "Agende o descanso como você agenda todo o resto. Até capitão precisa de uma noite tranquila no porto."
      },
      "tip": "Anote uma aventura que você quer viver com alguém este ano e escolham o mês juntos."
    },
    "festival": {
      "name": "A Grande Folia",
      "word": "folia",
      "vibe": "Você transforma dias comuns em pequenas comemorações.",
      "desc": "Seu ano pode parecer um longo festival com vários palcos pequenos. Você adora experimentar coisas novas e adora fazer isso com outras pessoas, de preferência sem planejar demais. Sua energia junta a galera e faz uma terça-feira sem graça virar festa. Este ano pode recompensar sua abertura com novos amigos e convites inesperados. Só deixe um espacinho na agenda para respirar.",
      "keywords": ["Alegria", "Sociável", "Espontâneo"],
      "color": "Coral ensolarado",
      "item": "Um punhado de balões coloridos",
      "fortune": {
        "work": "Ideias frescas surgem fácil quando você troca ideias com os outros. Um jeito brincalhão pode resolver o que a cara séria não resolveu.",
        "money": "Momentos divertidos em grupo importam para você. Um potinho para os rolês com os amigos pode deixar o bolso e o humor felizes.",
        "love": "Seu círculo pode crescer este ano. Alguém que você conhecer por acaso pode virar um grande amigo.",
        "self": "Equilibre as semanas agitadas com algumas noites tranquilas. Seu brilho aparece mais quando você está descansado."
      },
      "tip": "Planeje uma pequena comemoração sem motivo nenhum e chame alguém que você gostaria de conhecer melhor."
    },
    "summit": {
      "name": "O Cume Mais Alto",
      "word": "cume",
      "vibe": "Uma meta clara, uma subida firme e uma vista linda lá em cima.",
      "desc": "Este ano parece uma montanha que você escolheu escalar. Você gosta de um desafio de verdade, gosta de se preparar bem e fica feliz em seguir o próprio caminho. Passo a passo, você pode avançar de forma visível em algo que importa: uma habilidade, um projeto, um recorde pessoal. Você não precisa de plateia, mas a vista lá de cima vai valer a pena compartilhar. Comemore cada acampamento pelo caminho.",
      "keywords": ["Foco", "Determinação", "Bem preparado"],
      "color": "Verde-pinheiro",
      "item": "Um par de tênis confortáveis",
      "fortune": {
        "work": "O foco profundo é a sua força. Um projeto de longo prazo ou uma habilidade nova pode crescer firme com o seu esforço paciente.",
        "money": "Metas claras ajudam aqui também. Saber para que você está juntando pode deixar as pequenas escolhas mais fáceis.",
        "love": "Talvez você ande ocupado com a sua subida, então uma mensagem curta para um velho amigo pode valer mais do que você imagina.",
        "self": "Dias de descanso fazem parte de toda boa escalada. Planeje esses dias com a mesma seriedade dos dias de treino."
      },
      "tip": "Escolha uma meta para o ano e marque três pequenos pontos de checagem no calendário."
    },
    "adventure": {
      "name": "A Estrada Aberta",
      "word": "estrada aberta",
      "vibe": "Sem mapa, sem problema. Cada curva vira uma história nova.",
      "desc": "Seu ano pode parecer uma viagem de carro sem destino fixo. Você segue a curiosidade, curte a própria companhia e muda de direção sem drama quando aparece algo interessante. Essa liberdade leva você a lugares e ideias que os outros deixam passar. Pode ser um ano de primeiras vezes: uma cidade nova, um hobby novo, um jeito novo de ver as coisas. Tenha um caderninho por perto, porque você vai querer lembrar dos desvios.",
      "keywords": ["Curioso", "Espírito livre", "Independente"],
      "color": "Laranja pôr do sol",
      "item": "Uma mochila leve",
      "fortune": {
        "work": "Caminhos fora do comum podem combinar com você. Testar um método que ninguém usou ainda pode render suas melhores ideias.",
        "money": "Experiências valem mais para você do que coisas. Um potinho de viagem pode transformar vontades em passeios de verdade.",
        "love": "Você conhece gente interessante pelo caminho. Deixe algumas dessas pessoas ficarem na sua história por mais de um capítulo.",
        "self": "Sua liberdade é a sua energia. Garanta também um cantinho aconchegante para onde voltar."
      },
      "tip": "Experimente uma coisa totalmente nova a cada estação e escreva uma única frase sobre como foi."
    },
    "nest": {
      "name": "O Ninho Aconchegante",
      "word": "ninho",
      "vibe": "Você constrói um lar onde todo mundo se sente bem-vindo.",
      "desc": "Este ano pode girar em torno de construir algo acolhedor e duradouro. Você gosta de um ritmo constante, se importa de verdade com quem está por perto e se prepara com carinho para que todos se sintam cuidados. Sua casa, sua equipe ou sua turma podem virar o lugar onde as pessoas amam se reunir. Pequenas tradições que você começar este ano, como um jantar por mês ou um álbum de fotos em conjunto, podem durar muito tempo.",
      "keywords": ["Carinhoso", "Confiável", "Atencioso"],
      "color": "Bege quentinho",
      "item": "Uma vela de aroma suave",
      "fortune": {
        "work": "As pessoas contam com a sua mão firme. Organizar e apoiar os outros pode ser onde você mais brilha.",
        "money": "Planejar o conforto combina com você. Separar um pouquinho para momentos em casa com quem você ama pode ser muito gratificante.",
        "love": "Suas relações podem ficar mais profundas, e não mais numerosas. Uma conversa longa pode valer mais que uma festa enorme.",
        "self": "Você cuida de todo mundo, então deixe alguém cuidar de você também. Tudo bem aceitar ajuda."
      },
      "tip": "Comece uma pequena tradição com quem você ama, como um almoço por mês ou uma foto por ano."
    },
    "bond": {
      "name": "O Círculo de Afeto",
      "word": "círculo de afeto",
      "vibe": "Os melhores momentos do seu ano vão ter rostos conhecidos.",
      "desc": "Seu ano pode ganhar a cor das boas companhias. Você curte um ritmo tranquilo, sabe ouvir e gosta de deixar os planos acontecerem naturalmente com quem você ama. Os amigos ficam à vontade com você, e laços antigos podem voltar de um jeito bonito. Pode ser um ano de conversas longas, refeições divididas e risadas que você ainda vai lembrar no próximo inverno. Mantenha a porta e o coração abertos.",
      "keywords": ["Caloroso", "Tranquilo", "Leal"],
      "color": "Rosa-cereja",
      "item": "Um maço de cartões escritos à mão",
      "fortune": {
        "work": "Boas relações com colegas de trabalho ou de turma podem facilitar tudo. Sua gentileza é uma força de verdade.",
        "money": "Dividir é melhor que ter. Pequenos presentes pensados com carinho podem trazer mais alegria que grandes compras.",
        "love": "Uma amizade antiga pode florescer de novo, ou uma nova pode parecer que vocês se conhecem desde sempre.",
        "self": "Estar com os outros recarrega você, mas momentos de silêncio ajudam a ouvir os seus próprios desejos."
      },
      "tip": "Mande um bilhete escrito à mão por mês para alguém que deixou a sua vida mais leve."
    },
    "seed": {
      "name": "A Semente Paciente",
      "word": "semente",
      "vibe": "Passinhos todo dia, e algo bonito começa a crescer.",
      "desc": "Este pode ser um ano de crescimento silencioso. Você prefere um ritmo constante, gosta do seu espaço e curte planejar passos pequenos e sensatos. Nada disso é chamativo, mas no fim do ano você pode se surpreender com o quanto cresceu: um hábito que ficou, uma habilidade que floresceu, uma rotina mais calma. Sua paciência é o seu superpoder este ano. Regue suas sementes um pouquinho todo dia.",
      "keywords": ["Paciente", "Constante", "Calmo"],
      "color": "Menta fresca",
      "item": "Um caderninho de hábitos",
      "fortune": {
        "work": "Constância pode vencer a pressa este ano. Pequenos avanços diários podem somar algo de que você vai se orgulhar.",
        "money": "Rotinas suaves combinam com você, como dar uma olhadinha nos próprios gastos uma vez por mês.",
        "love": "Talvez seu círculo não seja o maior, mas quem está nele sabe que pode contar com você.",
        "self": "Uma rotina simples, um cantinho arrumado e uma noite de sono cedo podem ser tudo de que você precisa para se sentir bem."
      },
      "tip": "Escolha um hábito diário bem pequeno, pequeno o bastante para fazer até no dia mais preguiçoso."
    },
    "pause": {
      "name": "A Pausa Serena",
      "word": "pausa",
      "vibe": "Um ano mais devagar, um coração mais leve e espaço para respirar.",
      "desc": "Seu ano pode ser sobre desacelerar do melhor jeito. Você gosta de um ritmo calmo, valoriza o tempo para si e fica feliz em deixar a vida acontecer sem forçar. Isso não é ficar parado: é o espaço onde ideias novas aparecem quietinhas. Pode ser um ano para curtir prazeres simples, um bom livro, uma caminhada longa, uma noite aconchegante, e perceber o que realmente faz você feliz.",
      "keywords": ["Paz", "Reflexivo", "Gentil"],
      "color": "Lavanda",
      "item": "Um cachecol macio e quentinho",
      "fortune": {
        "work": "Uma mente calma enxerga com clareza. Respirar um pouco antes de decidir pode ajudar você a escolher o caminho certo.",
        "money": "Alegrias simples custam pouco. Você pode descobrir que o que mais ama já está bem perto.",
        "love": "Companhias tranquilas combinam com você. Um ou dois amigos próximos podem deixar o seu ano completo.",
        "self": "Este é o seu ano de descansar sem culpa. Manhãs lentas e noites sossegadas são mais do que merecidas."
      },
      "tip": "Deixe uma noite por semana totalmente livre, só para fazer o que der vontade."
    }
  }
};
