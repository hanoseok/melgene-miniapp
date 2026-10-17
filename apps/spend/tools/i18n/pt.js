/* Spending Personality Test (pt)
 * 8 result ids (saver value flex impulse saverflex dealhunter quality balance); questions[i].choices[j] follow spend-core.js QUESTIONS[i].v[j] (the habit axis of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the user's own style mix and the real server share.
 * Placeholders: {name} {emoji} {vibe} {pct} {s} {v} {f} {i}. Entertainment only, not financial advice.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Teste de perfil de gastos: qual é o seu estilo?",
    "description": "Teste de personalidade financeira: 12 situações do dia a dia, 2 minutos, sem cadastro. Você é econômico ou esbanjador? Só diversão, não é conselho financeiro.",
    "ogTitle": "Teste de perfil de gastos 💸 Qual é o seu estilo com dinheiro?",
    "ogDescription": "12 situações do dia a dia com dinheiro, 2 minutos. Econômico, esbanjador ou compra por impulso?"
  },
  "siteName": "Teste de perfil de gastos",
  "privacyLink": "Política de Privacidade",
  "start": {
    "badge": "💸 Só por diversão",
    "h1Kicker": "Teste de perfil de gastos",
    "h1Html": "Que tipo de <em>gastador</em><br>é você?",
    "hook": "Dia do pagamento, liquidação, rachar a conta com a galera e assinaturas que aparecem do nada. Responda com sinceridade a 12 situações do dia a dia e descubra o seu jeito de gastar.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🛍️ 12 situações",
    "start": "Descobrir meu perfil →"
  },
  "quiz": {
    "backAria": "Pergunta anterior",
    "progressAria": "Progresso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Contando suas moedinhas…",
    "sub": "Lendo seus comprovantes, só de brincadeira"
  },
  "result": {
    "title": "Meu perfil de gastos: {name}",
    "metaDesc": "Resultado do teste de perfil de gastos: {name}. {vibe}",
    "eyebrow": "Seu perfil de gastos é",
    "gaugeLabel": "Suas respostas, por perfil",
    "axes": [
      "Econômico",
      "Caçador de valor",
      "Esbanjador",
      "Impulsivo"
    ],
    "strengthsLabel": "Seus pontos fortes com dinheiro",
    "weaknessLabel": "Fique de olho",
    "tipLabel": "Ideia divertida",
    "disclaimer": "Apenas para entretenimento. Isto não é conselho financeiro.",
    "sameShare": "{pct}% das pessoas tiraram este perfil",
    "shareText": "Meu perfil de gastos: {name} {emoji} “{vibe}” E o seu?",
    "shareTextPct": "Meu perfil de gastos: {name} {emoji} (Econômico {s}% · Valor {v}% · Esbanjador {f}% · Impulso {i}%) E o seu?",
    "ctaStrong": "Um amigo compartilhou o perfil de gastos dele",
    "ctaSub": "Econômico ou esbanjador? Descubra em 2 minutos.",
    "retry": "Fazer o teste de novo"
  },
  "og": {
    "eyebrow": "Meu perfil de gastos",
    "brand": "💸 Teste de perfil de gastos",
    "defaultKicker": "Teste de perfil de gastos",
    "defaultTitle": "Que tipo de gastador é você?",
    "defaultDesc": "12 situações do dia a dia com dinheiro · 2 minutos"
  },
  "faq": [
    {
      "q": "Como meu perfil de gastos é definido?",
      "a": "Cada resposta pende para um de quatro hábitos com dinheiro: economizar, caçar valor, se mimar ou comprar por impulso. Seu resultado depende de quais hábitos você mais escolheu e de quão próximos eles ficaram. As mesmas respostas sempre dão o mesmo resultado."
    },
    {
      "q": "Isto é conselho financeiro?",
      "a": "Não. É um quiz de personalidade leve, feito para se divertir. Ele não diz nada sobre suas finanças reais e nunca deve ser usado para tomar decisões sobre dinheiro. Para dúvidas financeiras de verdade, converse com um profissional qualificado."
    },
    {
      "q": "Existe perfil de gastos bom ou ruim?",
      "a": "Não. Todo perfil tem pontos fortes e pontos cegos, e a maioria das pessoas mistura vários. Suas respostas também mudam com o humor, o orçamento e a fase da vida, então tente de novo em outro dia."
    },
    {
      "q": "Minhas respostas ficam salvas?",
      "a": "Não. Suas respostas são calculadas no seu navegador e nunca são guardadas. Só contamos, de forma anônima, qual perfil apareceu, para mostrar o quanto cada um é comum."
    }
  ],
  "privacy": {
    "title": "Política de Privacidade | Teste de perfil de gastos",
    "description": "Política de Privacidade do Teste de perfil de gastos: como usamos cookies, publicidade e estatísticas anônimas.",
    "h1": "Política de Privacidade",
    "introHtml": "O Teste de perfil de gastos (o \"Serviço\") respeita a sua privacidade e trata apenas as informações mínimas necessárias, conforme descrito abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "Você pode usar o Serviço sem cadastro e sem login. Suas respostas e a mistura de perfis são calculadas dentro do seu navegador e nunca são enviadas nem armazenadas em nossos servidores. Só contamos, de forma anônima, qual resultado apareceu, para mostrar o quanto cada resultado é comum."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do seu navegador para lembrar o seu idioma, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; se fizer isso, alguns recursos podem não funcionar corretamente."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Você pode saber mais e alterar suas preferências de personalização de anúncios nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Mantemos totais diários anônimos (visualizações de página, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não identificam você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver qualquer dúvida sobre esta Política de Privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política está em vigor desde 18 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao Teste de perfil de gastos"
  },
  "questions": [
    {
      "q": "O pagamento caiu na conta. Qual é a primeira coisa que você faz?",
      "choices": [
        "Reservo aquele programa legal que eu estava namorando",
        "Separo logo uma boa parte para a poupança",
        "Abro o app de compras: “eu mereço”",
        "Vejo quais contas e assinaturas vencem e planejo o resto"
      ]
    },
    {
      "q": "Um amigo convida você para um restaurante da moda, daqueles caros.",
      "choices": [
        "Sugiro um lugar mais barato ou cozinhar em casa",
        "Ótimo! Vou pedir exatamente o que eu quero",
        "Olho avaliações e menus executivos para achar o melhor custo-benefício",
        "Reservo agora e penso na conta depois"
      ]
    },
    {
      "q": "Seu fone de ouvido finalmente pifou e você precisa de um novo.",
      "choices": [
        "Comparo avaliações e histórico de preços por semanas",
        "Compro o primeiro que o anúncio mostrar. Resolvido em um minuto",
        "Seguro o máximo que der e depois compro o mais barato que preste",
        "Levo o modelo top, que é uma delícia e dura muito"
      ]
    },
    {
      "q": "Sua loja favorita está com uma liquidação enorme.",
      "choices": [
        "Encho o carrinho antes de conseguir pensar",
        "Compro só o que já estava na minha lista",
        "Pego aquela peça premium que enfim cabe no bolso",
        "Passo reto. Barato só é barato se eu precisava"
      ]
    },
    {
      "q": "O teste grátis de um serviço está prestes a virar assinatura paga.",
      "choices": [
        "Cancelei no mesmo dia em que me cadastrei",
        "Fico. Serviço bom merece ser pago",
        "Coloco um lembrete e decido se vale a pena",
        "Esqueci, e agora pago por vários deles"
      ]
    },
    {
      "q": "Pausa para o café no meio do expediente.",
      "choices": [
        "A bebida especial da minha cafeteria favorita, sem culpa",
        "Café de casa, na minha garrafa térmica",
        "Um café, um pão de queijo e aquela canequinha fofa do balcão",
        "A cafeteria com os melhores cupons e cartão fidelidade"
      ]
    },
    {
      "q": "A conta do jantar em grupo chega.",
      "choices": [
        "Pago para todo mundo na emoção e depois me pergunto para onde foi o dinheiro",
        "Uso um app de dividir a conta para ficar rápido e justo",
        "Pago uma rodada de bebidas e ainda pedimos sobremesa",
        "Pago exatamente o que comi, até o último centavo"
      ]
    },
    {
      "q": "O caixa oferece um item extra bem baratinho na hora de pagar.",
      "choices": [
        "Só se o preço do combo realmente compensar",
        "Quero, e mais a balinha do balcão",
        "“Não, obrigado.” Sem nem pensar",
        "Claro. Pequenos luxos deixam o dia melhor"
      ]
    },
    {
      "q": "Você está planejando as férias.",
      "choices": [
        "Planilha e sites de comparação para achar o melhor custo-benefício",
        "Compro a passagem hoje à noite porque o preço estava ótimo",
        "Baixa temporada, hospedagem simples e passeios de graça",
        "Um hotel bem bom. A viagem é o meu prêmio"
      ]
    },
    {
      "q": "Você abre o app do banco no fim do mês.",
      "choices": [
        "Peraí, para onde foi tudo isso?",
        "Separo tudo por categoria e ajusto o mês que vem",
        "Sei para onde foi e valeu a pena",
        "O saldo está saudável e eu fico orgulhoso em silêncio"
      ]
    },
    {
      "q": "Você começa um hobby novo.",
      "choices": [
        "Já vou de equipamento profissional. Se eu faço, faço direito",
        "Pego equipamento emprestado e aprendo com vídeos gratuitos",
        "Equipamento, livros, aulas e uma roupinha fofa, tudo na primeira semana",
        "Compro o kit de iniciante mais bem avaliado"
      ]
    },
    {
      "q": "Qual frase mais combina com você?",
      "choices": [
        "“Cada centavo economizado conta”",
        "“Só se vive uma vez”",
        "“Por que pagar mais pela mesma coisa?”",
        "“Na hora pareceu a coisa certa”"
      ]
    }
  ],
  "types": {
    "saver": {
      "name": "Mão de Vaca Raiz",
      "word": "mão de vaca",
      "vibe": "Cada moeda tem uma missão, e as suas sempre chegam no horário.",
      "desc": "Você gosta de saber onde está o seu dinheiro e para que ele serve. Leva marmita sem reclamar, percebe os pequenos vazamentos e sente uma alegria discreta quando o saldo sobe. Os amigos ligam para você quando querem saber se algo vale mesmo a pena, e você responde com toda a franqueza. Seus hábitos calmos e constantes deixam o futuro menos assustador.",
      "strengths": [
        "Paciente e disciplinado",
        "Enxerga desperdício rápido",
        "Tranquilo com o futuro"
      ],
      "weakness": "Você pode dizer não a coisas que te fariam muito feliz e depois se sentir de fora.",
      "tip": "Escolha um mimo pequeno por mês que seja seu, sem nenhuma culpa. Curtir também faz parte do plano."
    },
    "value": {
      "name": "Detetive de Promoção",
      "word": "detetive",
      "vibe": "Primeiro pesquisar, depois comprar.",
      "desc": "Você pesquisa antes de comprar: avaliações, histórico de preço, a outra aba, a outra loja. Achar a melhor oferta é como resolver um quebra-cabeça, e você adora compartilhar a resposta. Você não é pão-duro, só tem alergia a pagar caro. As pessoas confiam nas suas indicações porque você já fez o dever de casa.",
      "strengths": [
        "Ótimo pesquisador",
        "Compara com calma",
        "Divide achados úteis"
      ],
      "weakness": "Comparar pode levar mais tempo do que a coisa vale, e às vezes você perde a hora.",
      "tip": "Dê um limite de tempo para a pesquisa. A melhor oferta também é a que você realmente gosta de usar."
    },
    "flex": {
      "name": "Protagonista dos Gastos",
      "word": "protagonista",
      "vibe": "Trata o dia a dia como uma estreia de cinema.",
      "desc": "Você acredita que bons momentos merecem coisas boas: o jantar caprichado, o ingresso do show, o presente que faz alguém arregalar os olhos. Gasta com intenção e sem muita culpa, e sua generosidade contagia. Os amigos amam estar perto de você porque você transforma noites comuns em ocasiões. Você vive o presente e faz ele brilhar.",
      "strengths": [
        "Generoso e divertido",
        "Cria momentos inesquecíveis",
        "Sabe do que gosta"
      ],
      "weakness": "Os grandes momentos podem ocupar o lugar dos momentos quietos e sem graça que importam depois.",
      "tip": "Deixe também um mimo do “eu do futuro” na agenda. Ele deixa o esbanjar ainda mais gostoso."
    },
    "impulse": {
      "name": "Herói do Carrinho Cheio",
      "word": "carrinho",
      "vibe": "O carrinho enche mais rápido do que o pensamento chega.",
      "desc": "Você segue a sua faísca. Uma coisinha fofa, um bom humor ou a empolgação de um amigo, e de repente o pacote já está a caminho de casa. Essa espontaneidade faz parte do seu charme: você experimenta coisas novas, topa aventuras e sua vida raramente é sem graça. Suas prateleiras estão cheias de histórias, até daquelas que começaram com “eu precisava”.",
      "strengths": [
        "Espontâneo e curioso",
        "Topa qualquer aventura",
        "Espalha boa energia"
      ],
      "weakness": "Algumas compras perdem a graça rápido, e a fatura surpreende você no fim do mês.",
      "tip": "Teste um “carrinho do talvez” de um dia inteiro. Se amanhã você ainda sorrir, aí é um sim de verdade."
    },
    "saverflex": {
      "name": "Guarda Agora, Mima Depois",
      "word": "mima",
      "vibe": "Cuidadoso por meses, depois um sim glorioso.",
      "desc": "Na maioria dos dias você é o cuidadoso: os cupons, a marmita, o “agora não”. Mas você economiza com um propósito, e quando o dia chega, gasta no que realmente queria, sem pedir desculpas. É uma combinação surpreendente: econômico e dramático. As pessoas ficam espantadas com o tamanho que o seu único sim pode ter.",
      "strengths": [
        "Economiza com meta",
        "Aproveita a compra por inteiro",
        "Sabe o que importa"
      ],
      "weakness": "A espera longa pode fazer o mimo parecer grande demais, e a culpa pode aparecer depois.",
      "tip": "Dê um nome e uma data ao seu grande mimo. A expectativa já é metade da graça."
    },
    "dealhunter": {
      "name": "Caçador de Ofertas",
      "word": "caçador",
      "vibe": "Uma boa oferta é difícil de largar.",
      "desc": "Desconto acende você. Adora oferta por tempo limitado, combo e cupom que realmente funciona, e age rápido quando o preço parece certo. Meio detetive, meio aventureiro, você sente alegria de verdade na própria caçada. Os amigos mandam mensagem quando querem saber se uma oferta vale a fama.",
      "strengths": [
        "Olho afiado para ofertas",
        "Rápido e decidido",
        "Divertido para fazer compras junto"
      ],
      "weakness": "Um preço ótimo pode fazer você esquecer de perguntar se precisava daquilo.",
      "tip": "Antes de clicar, pergunte: “Eu ia querer isso pelo preço cheio?” Se sim, é vitória de verdade."
    },
    "quality": {
      "name": "Comprador de Uma Vez Só",
      "word": "uma vez",
      "vibe": "Gaste um pouco mais uma vez e curta por anos.",
      "desc": "Você escolhe com cuidado e escolhe bem. Prefere ter uma jaqueta ótima a cinco medianas, e se importa com como as coisas são, duram e combinam com a sua vida. Pesquisa o bastante para ter certeza e depois decide sem arrependimento. Suas coisas costumam ser bonitas e continuar assim, e você tem orgulho disso.",
      "strengths": [
        "Criterioso e exigente",
        "Valoriza qualidade e durabilidade",
        "Raramente se arrepende de uma compra"
      ],
      "weakness": "A opção “perfeita” pode ser difícil de achar, e esperar por ela pode atrasar você.",
      "tip": "O bom o bastante às vezes é ótimo. Deixe-se curtir a coisa bonita agora."
    },
    "balance": {
      "name": "Equilibrista do Orçamento",
      "word": "equilibrista",
      "vibe": "Nem mão fechada, nem solto demais. No ponto certo.",
      "desc": "Você mistura um pouco de tudo. Sabe economizar quando importa, comprar com inteligência quando ajuda, se mimar quando vale a pena e curtir uma compra espontânea de vez em quando. Isso faz de você uma ótima companhia para fazer compras, viajar e dividir a conta. As pessoas ficam à vontade com o seu jeito de lidar com dinheiro, porque ele é flexível e simpático.",
      "strengths": [
        "Flexível e tranquilo",
        "Se adapta a qualquer situação",
        "Fácil de dividir a conta"
      ],
      "weakness": "Sem uma regra forte, as pequenas decisões podem ir à deriva sem você perceber.",
      "tip": "Escolha um hábito pequeno de que você goste e faça dele a sua âncora. O resto pode continuar flexível."
    }
  }
};
