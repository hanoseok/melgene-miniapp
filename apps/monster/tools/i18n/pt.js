/* Which Monster Are You? — Português Brasileiro (/pt/)
 * Same 12 monster ids and question/choice order as monster-core.js (scoring weights live only there).
 * Keys ending in Html are inserted as raw HTML (only <br>, <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq never name a monster or quote a question.
 */
module.exports = {
  // Fonts (per language): css = Google Fonts stylesheet, display = rounded display font stack for titles/buttons,
  // displayWeight, sans = optional body font (omit → shared default), wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Que monstro você é? Teste de personalidade de Halloween',
    description: 'Que monstro você é? Faça esse teste de personalidade de Halloween grátis: 10 perguntas engraçadas e assustadoras, em cerca de um minuto, sem cadastro. Descubra o monstro que combina com você.',
    ogTitle: 'Que monstro você é? 🎃 Teste de personalidade de Halloween',
    ogDescription: 'Um teste de personalidade de Halloween grátis, de um minuto. Responda 10 perguntas engraçadas e assustadoras e conheça seu monstro gêmeo.',
  },
  siteName: 'Que Monstro Você É?',
  privacyLink: 'Política de Privacidade',

  start: {
    badge: '🎃 Especial de Halloween',
    h1Kicker: 'Teste de personalidade de Halloween',
    h1Html: 'Que <em>monstro</em><br>você é?',
    hook: 'Uma noite assombrada, dez pequenas escolhas. Em algum lugar no escuro, um monstro parecidérrimo com você está esperando.',
    metaTime: '⏱️ Cerca de 1 minuto',
    metaCount: '🦇 10 perguntas',
    start: 'Invocar meu monstro →',
  },

  quiz: {
    backAria: 'Pergunta anterior',
    progressAria: 'Progresso',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Invocando seu monstro…',
    sub: 'Mexendo o caldeirão',
  },

  result: {
    title: 'Que monstro você é? Eu tirei {name}',
    eyebrow: 'O monstro que combina com você é',
    strengthsLabel: 'Poderes do monstro',
    partyLabel: 'Numa festa de Halloween, você é…',
    bestLabel: 'Melhor amigo',
    rivalLabel: 'Rival querido',
    sameShare: '{pct}% dos jogadores também tiraram esse monstro',
    shareText: 'Meu monstro de Halloween é {name} {emoji} — “{catch}” E você, que monstro é?',
    ctaStrong: 'Um amigo te mandou o monstro dele',
    ctaSub: 'E você, qual é o seu? Leva um minuto.',
    retry: 'Refazer o teste',
  },

  og: {
    eyebrow: 'Meu monstro de Halloween',
    brand: '🎃 Que Monstro Você É?',
    defaultKicker: 'Teste de personalidade de Halloween',
    defaultTitle: 'Que monstro você é?',
    defaultDesc: '10 perguntas assustadoras e engraçadas · cerca de 1 minuto',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'Como funciona o teste do monstro?', a: 'Cada resposta soma pontos para vários monstros, e o que tiver mais pontos é o seu resultado. Empates são resolvidos por uma regra fixa, então as mesmas respostas sempre dão o mesmo monstro.' },
    { q: 'Dá medo?', a: 'De jeito nenhum! É um quiz de Halloween fofo e para toda a família — sem sangue nem sustos de verdade, só um climinha assustador e divertido.' },
    { q: 'Posso tirar um monstro diferente?', a: 'Sim. Seu resultado depende só das suas respostas, então responder diferente pode invocar outro monstro.' },
    { q: 'Minhas respostas ficam salvas?', a: 'Não. Suas respostas são calculadas no seu navegador e nunca são guardadas. A gente só conta, de forma anônima, qual monstro saiu, para mostrar o quanto cada resultado é comum.' },
  ],

  privacy: {
    title: 'Política de Privacidade | Que Monstro Você É?',
    description: 'Política de Privacidade de Que Monstro Você É? — como usamos cookies, publicidade e estatísticas anônimas.',
    h1: 'Política de Privacidade',
    introHtml: 'Que Monstro Você É? (o "Serviço") respeita sua privacidade e trata apenas o mínimo de informação necessária, conforme descrito abaixo.',
    sections: [
      ['1. Informações que coletamos', 'Você pode usar o Serviço sem se cadastrar nem fazer login. Suas respostas são calculadas dentro do seu navegador e nunca são enviadas nem armazenadas em nossos servidores. A gente só conta, de forma anônima, qual tipo de monstro saiu, para mostrar o quanto cada resultado é comum.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies para exibir anúncios e entender como é utilizado. Você pode recusar ou apagar os cookies nas configurações do seu navegador; algumas funções podem não funcionar direito se você fizer isso.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências de anúncios personalizados nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Guardamos totais diários anônimos (visualizações de página, testes concluídos, avaliações) para melhorar o Serviço. Esses totais não permitem identificar você pessoalmente.'],
      ['5. Contato', 'Se tiver alguma dúvida sobre esta Política de Privacidade, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política está em vigor desde 27 de setembro de 2026.'],
    ],
    back: '← Voltar para o teste do monstro',
  },

  questions: [
    { q: 'Chega de última hora um convite pra festa de Halloween no seu celular. Primeiro pensamento?', choices: [
      'O que eu vou vestir? Tem que ser icônico.',
      'Vai ter comida? Então tô dentro.',
      'Hum… quem mais vai?',
      'Eu levo a decoração. E a playlist.',
    ] },
    { q: 'Trinta minutos depois de a festa começar. Onde você está?', choices: [
      'No meio da pista, todo mundo se jogando',
      'Na mesa de salgadinhos. Terceiro prato.',
      'Num canto tranquilo, numa conversa séria e profunda',
      'De alguma forma já é amigo de todo mundo',
    ] },
    { q: 'Um grito ecoa no fim de um corredor escuro. Você…', choices: [
      'Grita ainda mais alto, depois cai na gargalhada',
      'Corre pra lá. Alguém pode precisar de ajuda!',
      'Congela e se funde discretamente com a parede',
      'Olha as horas com calma. Deve ser brincadeira.',
    ] },
    { q: 'É meia-noite e bateu aquela vontade de comer algo. Você vai atrás de…', choices: [
      'Algo vermelho e chique: suco de cereja com chocolate amargo',
      'O que tiver na geladeira. Tudo.',
      'Chocolate quente com minha mistura secreta de temperos',
    ] },
    { q: 'Sua estratégia de fantasia?', choices: [
      'Feita à mão. Tô montando desde agosto.',
      'Um lençol velho com dois buracos pros olhos. Pronto.',
      'Me enrolo no que tiver por perto. Papel higiênico também vale.',
      'Um visual diferente a cada hora. Pra deixar todo mundo curioso.',
    ] },
    { q: 'Ding-dong! Chegam as crianças fantasiadas na sua porta. Você…', choices: [
      'Distribui chocolates grandes e elogia cada fantasia',
      'Aparece de trás da porta com um susto (bem levinho)',
      'Apaga as luzes e espia pela cortina. Não tem ninguém em casa.',
    ] },
    { q: 'Como seus amigos te descreveriam?', choices: [
      'Parece intimidador, mas na real é um marshmallow',
      'Sempre pontual e estranhamente calmo com tudo',
      'Faz o que quer e sempre se dá bem de algum jeito',
      'Misterioso. Tem solução pra absolutamente tudo',
    ] },
    { q: 'Três da manhã. A festa está no fim. Você está…', choices: [
      'Só começando. Depois-festa lá em casa!',
      'Dormindo no sofá. Desde as onze.',
      'Guardando as sobras em potinhos bem etiquetados',
      'Consertando a caixa de som que alguém quebrou pra música não parar',
    ] },
    { q: 'Você sai e tem uma lua cheia enorme no céu. Você sente…', choices: [
      'Selvagem. Preciso correr pra algum lugar. Qualquer lugar!',
      'Sonhador. Noite perfeita pra uma caminhada lenta e silenciosa.',
      'Aconchego. De volta pra dentro: cobertor, chá, filme antigo.',
      'Sorte. Rápido, faz um pedido!',
    ] },
    { q: 'Escolha seu lema para a noite de Halloween.', choices: [
      'Dance como se ninguém estivesse vendo. De qualquer forma, são todos fantasmas.',
      'Nove vidas, zero preocupações.',
      'Sempre na hora certa.',
      'Tem um feitiço pra isso.',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampiro',
      catch: 'Chique e atrasado, dramático com estilo.',
      desc: 'Você é uma criatura da noite com um gosto impecável — nas roupas, na música, nos salgadinhos. As pessoas se sentem atraídas por você antes mesmo de você abrir a boca, e você sabe exatamente como fazer uma entrada triunfal. Prefere ficar acordado até o amanhecer numa boa conversa a ir dormir cedo. Sim, você é meio dramático. E é exatamente por isso que todo mundo te adora.',
      strengths: ['Charme magnético', 'Gosto impecável', 'Resistência de quem não dorme'],
      party: 'Chega por último e vira o assunto da festa na mesma hora.',
    },
    werewolf: {
      name: 'Lobisomem',
      catch: 'Leal à matilha, selvagem por dentro.',
      desc: 'Você tem uma energia sem limites e um coração do tamanho de uma lua cheia. Seus amigos são a sua matilha, e você atravessaria a cidade correndo à meia-noite se alguém deles precisasse. É honesto até demais, está com fome quase sempre, e seu humor muda… digamos, com as fases da lua. Quando você se joga em algo, vai com tudo — e todo mundo na sala sente isso.',
      strengths: ['Lealdade feroz', 'Energia sem fim', 'Honestidade (do tipo boa)'],
      party: 'Lidera o ataque à mesa de salgadinhos e depois uiva junto em cada música.',
    },
    witch: {
      name: 'Bruxa',
      catch: 'Prepara ideias, encanta planos, nunca fica sem truque.',
      desc: 'Curiosa, esperta e um pouquinho travessa — você sempre tem um plano, um plano B e um ingrediente secreto. Adora colecionar curiosidades estranhas e transformá-las em algo útil (ou deliciosamente bagunçado). Os amigos vêm pedir conselho porque suas respostas realmente funcionam. Independente até a raiz, prefere voar na sua própria vassoura a esperar uma carona.',
      strengths: ['Sagacidade afiada', 'Curiosidade sem fim', 'Um remédio pra tudo'],
      party: 'Mistura poções misteriosas na cozinha e lê a sorte de todo mundo.',
    },
    ghost: {
      name: 'Fantasma',
      catch: 'Quieto, gentil, e secretamente o mais engraçado da turma.',
      desc: 'Você flutua pela vida bem de leve e percebe tudo que os outros deixam passar. Não é bem tímido — só prefere alguns amigos de verdade a uma sala lotada. Quando resolve falar, solta a frase certa na hora certa e faz todo mundo rir. Também é mestre na saída silenciosa: está aqui num segundo, tranquilo na cama no seguinte.',
      strengths: ['Observador afiado', 'Humor na medida certa', 'Presença tranquilizadora'],
      party: 'Vaga de cômodo em cômodo, escuta as melhores histórias e some sem deixar rastro.',
    },
    zombie: {
      name: 'Zumbi',
      catch: 'Devagar, constante, e completamente tranquilo.',
      desc: 'Nada te abala. Prazo, drama, caos — você vai arrastando o pé no seu ritmo e de algum jeito sempre chega lá. Vive de lanche e soneca, e é a prova viva de que ficar de boa é um superpoder. Seus amigos adoram como você é tranquilo; topa qualquer parada desde que tenha comida envolvida. Só não te acordem antes do meio-dia.',
      strengths: ['Calma inabalável', 'Vai na flow', 'Persistência surpreendente'],
      party: 'No sofá, com um prato em cada mão, em paz total com o universo.',
    },
    mummy: {
      name: 'Múmia',
      catch: 'Uma alma antiga enrolada em camadas bem quentinhas.',
      desc: 'Você ama sua casa, suas rotinas e suas prateleiras perfeitamente organizadas. Guarda as coisas por anos — ingresso de show, foto antiga, amizade — e cuida bem de tudo isso. Tem quem te chame de antiquado; você chama de atemporal. Debaixo de todas essas camadas tem um coração quentinho e leal, com quem dá pra contar por séculos.',
      strengths: ['Confiabilidade de pedra', 'Organização impecável', 'Amizades que duram pra sempre'],
      party: 'Enrolada num cobertor perto do fogo, contando as melhores histórias de antigamente.',
    },
    frank: {
      name: 'Monstro de Frankenstein',
      catch: 'Grandão, gente boa, e feito com muito coração.',
      desc: 'À primeira vista você pode parecer sério, mas quem te conhece sabe que é a alma mais boa da sala. Você é do tipo que resolve: conserta, constrói, e mostra carinho fazendo, não só falando. Às vezes se sente meio incompreendido, mas os amigos que te entendem fariam qualquer coisa por você. Está vivo… e é uma gracinha.',
      strengths: ['Bom de conserto', 'Coração de ouro', 'Firme e confiável'],
      party: 'Conserta as luzinhas de decoração em silêncio e depois dança um lento meio sem jeito quando toca a música certa.',
    },
    pumpkin: {
      name: 'Abóbora de Halloween',
      catch: 'Sorriso brilhante, clima bom na hora.',
      desc: 'Você ilumina qualquer ambiente — quase literalmente. Seu otimismo é contagiante, sua risada é alta, e geralmente foi você quem organizou a festa desde o início. Você faz todo mundo se sentir bem-vindo e nunca esquece um nome. Até na noite mais escura você encontra um motivo pra sorrir, e ajuda os outros a encontrarem também.',
      strengths: ['Positividade contagiante', 'Anfitrião nato', 'Deixa todo mundo à vontade'],
      party: 'O anfitrião, o hype, e o motivo pelo qual todo mundo apareceu.',
    },
    blackcat: {
      name: 'Gato preto',
      catch: 'Misterioso, independente, estiloso sem esforço.',
      desc: 'Você faz as coisas do seu jeito e parece descolado sem nem tentar. É seletivo com quem deixa chegar perto, mas quando escolhe alguém, essa pessoa ganha um amigo pras nove vidas inteiras. Adora uma boa soneca, um cantinho tranquilo e ficar em paz — até que, do nada, quer toda a atenção pra si. Tem quem diga que você dá azar. Seus amigos sabem que você é o amuleto da sorte deles.',
      strengths: ['Estilo sem esforço', 'Instintos afiados', 'Seletivo, mas leal'],
      party: 'Instalado no melhor lugar da casa, julgando todo mundo com muito carinho.',
    },
    reaper: {
      name: 'Ceifador',
      catch: 'Calmo, pontual, e nunca perde um prazo.',
      desc: 'Você é a calma no meio da tempestade dos outros. Enquanto todo mundo entra em pânico, você confere a agenda, faz um plano e resolve — bem na hora, sempre. Seu humor é tão seco que as pessoas só entendem a piada uma hora depois. O capuz parece intimidador, mas na verdade é você quem garante que todo mundo volte pra casa em segurança.',
      strengths: ['Sangue-frio sob pressão', 'Tempo perfeito', 'Cuidadoso em segredo'],
      party: 'Confere as horas às 23h58 e anuncia, bem tranquilo, a última música.',
    },
    fox: {
      name: 'Raposa de nove caudas',
      catch: 'Um metamorfo com um sorriso pra cada ocasião.',
      desc: 'Você se encaixa em qualquer lugar — o jantar chique, a festa bagunçada, a reunião de família. Você lê as pessoas na hora e sempre sabe o que dizer. Esperto e brincalhão, adora um bom jogo e quase sempre ganha. Por trás de tantos sorrisos charmosos tem alguém ferozmente leal aos poucos que já viram suas caudas de verdade.',
      strengths: ['Lê o clima na hora', 'Resposta na ponta da língua', 'Se adapta a tudo'],
      party: 'Troca de fantasia duas vezes e de alguma forma vira melhor amigo da avó do anfitrião.',
    },
    skeleton: {
      name: 'Esqueleto',
      catch: 'Osso engraçado? Você é feito só disso.',
      desc: 'Você não leva a vida tão a sério — e sinceramente, esse é o seu segredo. Solta piadas nas piores horas, dança com qualquer desculpa e consegue animar qualquer um em trinta segundos. Viaja leve e vive simples: sem drama, sem frescura, só boa vibração. As pessoas se sentem mais leves perto de você, como se tivessem perdido uns quilos de preocupação.',
      strengths: ['Levanta o astral na hora', 'Engraçado sem vergonha', 'Zero drama, puro relaxamento'],
      party: 'Sacode os ossos na pista de dança e começa uma dança da conga que ninguém pediu.',
    },
  },
};
