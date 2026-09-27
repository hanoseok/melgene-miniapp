/* Teste de vida passada — português brasileiro (/pt/)
 * Mesmos 16 ids de arquétipo e mesma ordem de perguntas/opções do data.js (os pesos de pontuação ficam só lá).
 * Tratamento "você" o tempo todo. Os papéis históricos coreanos ganham uma explicação rápida para a piada
 * funcionar com leitores de fora (cozinha real = a novela "A Joia do Palácio", jeongisu = um contador de
 * histórias em capítulos tipo folhetim, amhaeng-eosa = um Zorro coreano com crachá real, o ninja "que na
 * verdade era carteiro").
 * Chaves terminadas em Html são inseridas como HTML puro, assim como os corpos de privacy.sections.
 * Sem spoiler em meta/landing/og/faq.
 */
module.exports = {
  // Fonts: fontCss = extra stylesheets (omit → Pretendard), font = page font stack (omit → shared default)
  typography: {},

  meta: {
    title: 'Teste de vida passada: quem você foi?',
    description: 'Teste de vida passada grátis: responda 12 perguntas rápidas sobre seu dia a dia e descubra quem você foi em uma vida passada. Sem instalar nada, sem cadastro, só 2 minutinhos.',
    ogTitle: 'Teste de vida passada — Quem você foi em uma vida passada?',
    ogDescription: 'O teste de vida passada grátis em 2 minutos: 12 perguntas do cotidiano, 16 vidas passadas possíveis. Quem você foi?',
  },
  siteName: 'Teste de vida passada',
  landing: {
    badge: '🔮 Mais divertido que seu horóscopo',
    h1Kicker: 'Teste de vida passada',
    h1Html: 'Quem você foi<br>em uma <em>vida passada</em>?',
    hookHtml: 'Doze perguntas. Dois minutos.<br>E aí você reencontra aquele você esquecido.',
    metaTime: '⏱️ 2 minutos',
    metaResults: '📜 16 vidas passadas',
    start: 'Revelar minha vida passada →',
    backAria: 'Pergunta anterior',
    loading: 'Tirando o pó das lembranças da sua vida passada…',
  },
  // Shown only inside the shared end screen (result pages) as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'Como funciona o teste de vida passada?', a: 'Cada uma das suas 12 respostas soma pontos para algumas vidas passadas, e a que tiver mais pontos é a sua. Todas as versões do teste, em qualquer idioma, usam exatamente o mesmo cálculo.' },
    { q: 'Isso é confiável?', a: 'É só por diversão, não é adivinhação: um espelho brincalhão dos seus hábitos do dia a dia. Mesmo assim, muita gente se identifica de um jeito surpreendente com o resultado.' },
    { q: 'Dá para conseguir um resultado diferente?', a: 'Sim. Seu resultado depende só das suas respostas, então respondendo de outro jeito você pode descobrir uma vida passada diferente.' },
    { q: 'Minhas respostas ficam salvas em algum lugar?', a: 'Não. Suas respostas são calculadas direto no seu navegador e nunca são enviadas nem armazenadas. Não precisa se cadastrar.' },
  ],
  privacyLink: 'Política de Privacidade',
  result: {
    title: 'Teste de vida passada: {name}',
    shareText: 'Minha vida passada: {name} {emoji} — "{tagline}". E você, quem foi?',
    ctaStrong: 'Um amigo te mandou o resultado da vida passada dele',
    ctaSub: 'Quer saber quem você foi? Leva só 2 minutos.',
    eyebrow: 'Em uma vida passada, você foi',
    adviceLabel: 'Conselho para esta vida —',
    good: 'Alma gêmea',
    bad: 'Arqui-inimigo',
    retry: 'Fazer o teste de novo',
  },
  og: {
    eyebrow: 'Em uma vida passada, você foi',
    brand: '🔮 Teste de vida passada',
    defaultTitle: 'Teste de vida passada',
    defaultDesc: '12 perguntas, 2 minutos. Quem você foi em uma vida passada?',
  },
  privacy: {
    description: 'Política de Privacidade do Teste de vida passada: como usamos cookies, publicidade e estatísticas de acesso.',
    h1: 'Política de Privacidade',
    introHtml: 'O Teste de vida passada (o "Serviço") respeita sua privacidade e trata apenas as informações mínimas necessárias, conforme descrito abaixo.',
    sections: [
      ['1. Informações que coletamos', 'Você pode usar o Serviço sem se cadastrar ou fazer login. Suas respostas ao teste são processadas apenas dentro do seu navegador e nunca são armazenadas em nossos servidores. Algumas informações podem ser coletadas automaticamente enquanto você usa o Serviço, conforme descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies para exibir anúncios e entender como é utilizado. Você pode recusar ou excluir cookies nas configurações do seu navegador; algumas funcionalidades podem não funcionar corretamente se você fizer isso.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para veicular anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências de personalização de anúncios nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas (Google Analytics)', 'O Serviço pode usar o Google Analytics (GA4) para entender o número de visitantes e as fontes de tráfego, a fim de melhorar o Serviço. Esses dados são usados somente para fins estatísticos e não identificam você pessoalmente.'],
      ['5. Contato', 'Se tiver alguma dúvida sobre esta Política de Privacidade, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política está em vigor desde 1º de janeiro de 2026.'],
    ],
    back: '← Voltar ao Teste de vida passada',
  },

  types: {
    sura: {
      name: 'Chef de cozinha real da Coreia',
      tagline: 'Uma pitada de sal a mais podia mudar o humor do rei',
      story: 'Na cozinha real da dinastia coreana Joseon — sim, a mesma da novela "A Joia do Palácio" —, o humor do rei no dia dependia da ponta dos seus dedos. Mais importante que "salgou demais ou ficou sem graça?" era "para quem é essa refeição, de verdade?", e você sempre descobria isso antes de todo mundo. Você comandava dezenas de ajudantes de cozinha com precisão de relógio, mas nunca dividiu uma receita sequer com ninguém. Perfeccionista até a alma: servir a melhor mesa real do dia era todo o seu orgulho.',
      traits: ['Comida e clima: tudo tem que ser perfeito', 'Deixa o resultado falar, não a fofoca', 'Abre a despensa toda para quem é da sua confiança'],
      advice: 'Não tem problema caprichar demais no sal de vez em quando. Todo mundo te perdoa.',
    },
    celadon: {
      name: 'Mestre ceramista do celadon de Goryeo',
      tagline: 'Queimou mil vasos no forno e quebrou quase todos por princípio',
      story: 'Você passava noites em claro perto do forno, obcecado em recriar o lendário esmalte verde-jade do celadon da dinastia coreana Goryeo — uma cor tão valorizada que até enviados chineses escreviam sobre ela em cartas para casa. Se o tom saísse um pouco fora do padrão, você pegava o martelo sem pensar duas vezes, enquanto seus aprendizes andavam na ponta dos pés perto de padrões que nem entendiam direito. Para você, um vaso de celadon não era louça: era um pedaço do céu. Seus fracassos superavam de longe suas peças terminadas, mas o que ficou na história foram as obras-primas.',
      traits: ['Padrão de exigência: alto. Alto demais.', 'Devagar, mas termina tudo direitinho', 'Teimoso de um jeito quieto, mas sem limites'],
      advice: 'Parar na tentativa noventa e nove também pode ser lindo.',
    },
    hwarang: {
      name: 'Cavaleiro hwarang de Silla',
      tagline: 'Beleza e talento de nível olímpico, lá pelo século VI',
      story: 'Primeiro lugar tanto na espada quanto nos estudos — e, de quebra, super popular. Você era o craque dos hwarang, os "cavaleiros-flor" de elite do antigo reino coreano de Silla. Mesmo andando por montanhas e rios para treinar corpo e mente, sempre tinha uma torcida secreta te apoiando em algum canto. Honra valia mais que a própria vida, e ganhar de forma suja te envergonhava mais do que perder. No campo de batalha ou no mercado, seu nome sempre estava na boca do povo.',
      traits: ['Sempre acaba sendo o centro das atenções', 'Trata honra e princípios como algo sagrado', 'O olhar muda completamente quando rola competição'],
      advice: 'Se divertir junto vale tanto quanto vencer.',
    },
    viking: {
      name: 'Navegador viking',
      tagline: 'Se não estava no mapa, aí que você queria ir mesmo',
      story: 'Guiando seu navio pela neblina do Mar do Norte, "perigoso" só queria dizer "parece divertido". Pela emoção de avistar uma costa que nenhum mapa jamais tinha mostrado, uma tempestade ou duas era um preço justo. Criar raízes? Nunca — a próxima viagem sempre te deixava mais curioso. Sua tripulação ficava nervosa, mas seguia você mesmo assim. Afinal, você sempre voltava vivo.',
      traits: ['Os olhos brilham diante de qualquer novidade', 'Estranhamente calmo em meio a uma crise', 'Ficar parado no mesmo lugar por muito tempo te deixa inquieto'],
      advice: 'Às vezes tudo bem soltar âncora e aproveitar de verdade onde você está.',
    },
    pharaoh_cat: {
      name: 'O gato do faraó',
      tagline: 'Cultuado como um deus, passava o dia todo tirando uma soneca',
      story: 'Nos palácios do Egito antigo, você era um gato reverenciado como divindade. Fazia alguma coisa em especial? Não. Só se sentava no melhor lugar ao sol e observava os humanos te adorarem por conta própria. Mas, no segundo em que você fazia a menor cara de irritado, o palácio inteiro entrava em pânico — embora ninguém goste de comentar isso. Parecia que você não fazia absolutamente nada, mas sua simples presença mantinha tudo sob controle.',
      traits: ['Observa com elegância e se move o mínimo possível', 'Muda o clima de um ambiente com um único olhar', 'Um gênio em escapar das tarefas'],
      advice: 'Até deuses ganham mais respeito quando aparecem em pessoa de vez em quando.',
    },
    renaissance: {
      name: 'Aprendiz de um pintor renascentista',
      tagline: 'Pego com a boca na botija de tinta: era talento demais',
      story: 'Em um ateliê em Florença, você moía pigmentos e lavava pincéis à sombra de um grande mestre. Até que um dia, com o mestre fora, você completou um canto do fundo do quadro — e acabou virando a parte mais natural de toda a pintura. Você foi construindo sua habilidade em silêncio, sem que ninguém percebesse, mas de forma constante. E na ponta do seu pincel havia um sonho escondido: um dia, uma pintura assinada com o seu próprio nome.',
      traits: ['Um olhar incomum para os detalhes', 'Excelente em silêncio, sem precisar de alarde', 'Bom gosto tão forte que não deixa passar um "está bom assim"'],
      advice: 'Suas habilidades já estão prontas. Hora de começar a assinar com o seu nome.',
    },
    jeongi: {
      name: 'Contador de histórias estrela da velha Seul',
      tagline: 'Dominava o "continua no próximo capítulo" 200 anos antes da Netflix',
      story: 'Nos mercados da velha Seul, as pessoas largavam tudo quando você aparecia. Você era um jeongisu, um contador de histórias profissional que lia romances populares em voz alta para a multidão. Sua marca registrada: parar bem na hora mais tensa e esperar as moedas caírem antes de continuar. Para ser sincero, metade da história era improvisada na hora, mas era tão convincente que ninguém nunca percebia. Nas suas mãos, até a fofoca do bairro virava uma epopeia.',
      traits: ['Um dom para enfeitar qualquer história', 'Timing impecável e leitura de ambiente afiadíssima', 'Sabe exatamente como atrair uma multidão'],
      advice: 'De vez em quando, tudo bem só contar logo o final.',
    },
    silkroad: {
      name: 'Mercador de caravanas na Rota da Seda',
      tagline: 'Cada fronteira cruzada virava mais amigos',
      story: 'Cruzando desertos e passagens nevadas com seda e especiarias, línguas estrangeiras nunca foram problema para você — alguns gestos e um sorriso, e o negócio estava fechado. Em cada oásis tinha um amigo esperando para te receber, e essa rede era seu maior tesouro. Você deixava amizades pelo caminho, não só mercadorias: um viajante nato e a alma social por excelência.',
      traits: ['Faz amigos em qualquer lugar, rapidinho', 'Fecha um bom negócio sem perder o calor humano', 'Se adapta a culturas novas num piscar de olhos'],
      advice: 'Às vezes tudo bem aceitar um presente sem regatear.',
    },
    monk_scribe: {
      name: 'Monge copista medieval',
      tagline: 'Copiava à luz de vela sem errar uma letra sequer',
      story: 'Em um mosteiro medieval europeu, seu trabalho era copiar textos sagrados em pergaminho o dia inteiro. Concentração total, sem desviar o olhar — e, mesmo assim, você rabiscava escondido desenhinhos absurdos nas margens. Onde outros viam só repetição sem fim, você encontrava seu próprio ritmo e sua calma. (História real: manuscritos medievais de verdade estão cheios de rabiscos nas margens, tipo cavaleiros lutando contra caramujos gigantes.)',
      traits: ['Quando você foca, o mundo some', 'Quieto por fora, hilário por dentro', 'Não deixa passar nem o menor errinho'],
      advice: 'Feche o livro e vá tomar um ar. O mundo não vai desabar.',
    },
    pirate_cook: {
      name: 'Cozinheiro de navio pirata',
      tagline: 'Nunca sacou uma espada, mas mandava no navio mesmo assim',
      story: 'Você nunca brigou uma vez sequer, mas naquele navio sua palavra era lei — se a tripulação não gostasse do cardápio da noite, até os piratas mais brutos se comportavam perto de você. Você era a única alma gentil no meio de marujos endurecidos, e nos dias ruins todo mundo dava um jeito de passar na cozinha atrás de um pouco de conforto. Rústico por fora, mas ninguém cuidava das pessoas melhor que você: o verdadeiro poder por trás do capitão.',
      traits: ['Mostra carinho com atitudes — principalmente alimentando as pessoas', 'Se encaixa até nos ambientes mais durões', 'Surpreendentemente sensível e cuidadoso'],
      advice: 'Pare de só cuidar dos outros. Deixe alguém cuidar de você também.',
    },
    amhaeng: {
      name: 'Inspetor real disfarçado de Joseon',
      tagline: 'Escondia o crachá do rei sob trapos de mendigo',
      story: 'Você andava pelos mercados vestido de trapos, mas na manga escondia o mapae, o distintivo real com cavalos gravados que provava que você era o inspetor secreto do rei, enviado para pegar funcionários corruptos. Três frases de um magistrado desonesto e você já sentia o cheiro da mentira; no momento decisivo, você revelava quem era de verdade e virava a situação de cabeça para baixo — um pouco Zorro, um pouco Colombo. Ver a verdade enquanto todo mundo se deixava enganar pelas aparências: essa era a emoção. Armado só com o seu senso de justiça, você percorria o reino de Joseon como o justiceiro disfarçado.',
      traits: ['Detecta mentiras com uma precisão impressionante', 'Enxerga além das aparências, até o que é real', 'Quando sabe que está certo, vai até o fim'],
      advice: 'Nem todo mundo está escondendo alguma coisa. Às vezes, só confie.',
    },
    gladiator: {
      name: 'Gladiador romano',
      tagline: 'Estrelão do Coliseu, mas um baita medroso em segredo',
      story: 'No instante em que você entrava no Coliseu, a multidão gritava seu nome. Por trás daquele rosto carismático havia alguém cujos joelhos tremiam toda vez — mas ninguém nunca percebeu. "Ganho essa luta e me aposento, abro uma tabernazinha", você dizia para si mesmo… e aí pegava a espada de novo. Apavorado, mas sempre voltando para a arena: uma estrela com um charme realmente inesperado.',
      traits: ['Esconde o nervosismo como ninguém', 'Sua presença explode assim que sobe ao palco', 'Guarda sonhos simples e humildes em segredo'],
      advice: 'Admitir que está com medo não vai fazer ninguém te respeitar menos.',
    },
    teahouse: {
      name: 'Dono de uma casa de chá da dinastia Qing',
      tagline: 'Bastava um olhar para adivinhar os problemas de qualquer um',
      story: 'Em uma vielinha da China dos Qing, sua casa de chá nunca ficava vazia. Mais famosa que o chá era sua intuição: assim que um cliente se sentava, você já tinha uma boa ideia de como tinha sido o dia dele. Fofocas, desabafos, conselhos de vida: tudo começava naquela pequena casa de chá. Você nunca forçava nada; só servia uma xícara, e de alguma forma as pessoas já se sentiam melhor.',
      traits: ['Sente o clima de um ambiente em segundos', 'Calmo e sem pressa, aconteça o que acontecer', 'As pessoas se abrem com você naturalmente'],
      advice: 'Pelo menos uma vez, deixe os problemas dos outros de lado e fale dos seus.',
    },
    ninja_mailman: {
      name: 'Ninja da era Edo (na verdade, carteiro)',
      tagline: 'Se movia como uma sombra e nunca perdeu uma carta',
      story: 'Você era um ninja de verdade, treinado com muito rigor — mas sua missão de fato era entregar cartas em segredo. Todo aquele talento de pular telhados e escalar muros servia para uma coisa só: entregar com precisão e nunca, jamais, atrasar. Todo mundo imaginava missões emocionantes, mas você vivia cada dia com o orgulho humilde da entrega no prazo. No fim das contas, a pessoa mais confiável por perto era você.',
      traits: ['Sempre entrega o trabalho com precisão e perfeição', 'Ganha respeito pela constância, não pelo estardalhaço', 'Tem um senso de humor discreto e surpreendente'],
      advice: 'Pare de esconder essas habilidades. Pode se exibir um pouco.',
    },
    atlantis: {
      name: 'Guardião do farol de Atlântida',
      tagline: 'Manteve a luz acesa enquanto a cidade afundava',
      story: 'Na lendária cidade de Atlântida, na noite em que as ondas não paravam de subir, você manteve o farol aceso. Em meio ao terror de uma cidade que afundava, você foi a única pessoa que se manteve firme e não abandonou seu posto. Graças a você, os últimos navios saíram do porto em segurança. Nada chamativo — mas o tipo de presença que alguém, em algum lugar, precisa demais.',
      traits: ['Quanto maior a crise, mais calmo você fica', 'Tem a força silenciosa de quem segura a barra', 'Pensa muito mais fundo do que deixa transparecer'],
      advice: 'Tudo bem se apoiar na luz de outra pessoa de vez em quando.',
    },
    balhae: {
      name: 'Arqueiro montado de Balhae',
      tagline: 'Nunca errou um tiro — nem a galope total',
      story: 'Cavalgando pelos ventos gelados do norte — a fronteira de Balhae, um antigo reino na Manchúria —, seu arco nunca vacilava. Você treinou incontáveis vezes para aquele único instante: acertar o alvo bem no centro montado em um cavalo em disparada. Leal ao seu esquadrão acima de tudo, você sempre cavalgava na frente, e seus companheiros te seguiam sem hesitar. Velocidade e precisão ao mesmo tempo: uma combinação rara.',
      traits: ['Continua preciso mesmo quando tudo se move rápido', 'Extremamente leal à sua equipe', 'Quando tem um objetivo, vai direto nele'],
      advice: 'Às vezes tudo bem só cavalgar, sem nenhum alvo à vista.',
    },
  },

  questions: [
    {
      q: 'Num rolê com os amigos, você geralmente…',
      choices: [
        'Decide primeiro o que todo mundo vai comer. O cardápio dá o clima.',
        'Senta num canto e observa quietinho o que está rolando.',
        'Vira naturalmente a alma da festa.',
        'Fica de olho em lugares novos e caras novas.',
      ],
    },
    {
      q: 'Quando algo inesperado dá errado, você…',
      choices: [
        'Boceja primeiro. Alguém vai resolver mais cedo ou mais tarde.',
        'Investiga sozinho, quietinho, até achar a causa.',
        'Transforma tudo numa história hilária para contar depois.',
      ],
    },
    {
      q: 'Ao planejar uma viagem, você…',
      choices: [
        'Marca no mapa o maior número possível de países.',
        'Faz da sua meta fazer amizade com os locais.',
        'Planeja a rota toda em função da comida.',
      ],
    },
    {
      q: 'Um amigo te conta que foi tratado injustamente. Você…',
      choices: [
        'Diz: "Ok, primeiro vamos reunir provas."',
        'Age rápido e vai checar tudo na hora.',
        'Senta a pessoa, prepara um chá e escuta.',
        'Ajuda quietinho, nos bastidores.',
      ],
    },
    {
      q: 'O prazo está apertando e você não tem nenhuma ideia. Você…',
      choices: [
        'Apaga a luz e viaja no vazio — aí a ideia surge do nada.',
        'Faz um monte de rascunhos rápidos e escolhe o melhor.',
        'Reúne todo o material e as referências antes de começar, com perfeição.',
      ],
    },
    {
      q: 'Quando você vai às compras, você…',
      choices: [
        'Volta várias vezes até achar exatamente o que quer.',
        'Compra na hora. O arrependimento fica para depois.',
      ],
    },
    {
      q: 'Seu papel num trabalho em grupo?',
      choices: [
        'Define o rumo e empurra todo mundo para frente.',
        'Termina sua parte com perfeição, sem alarde.',
        'Cuida dos detalhes e do acabamento final.',
      ],
    },
    {
      q: 'Se você postasse algo nas redes sociais, seria…',
      choices: [
        'Uma foto minha que ficou muito boa.',
        'Histórias sobre pessoas fascinantes que conheci viajando.',
        'Uma frase do livro que li hoje.',
        'Uma foto do prato que acabei de cozinhar.',
      ],
    },
    {
      q: 'Alguém vem pedir seu conselho. Você…',
      choices: [
        'Começa organizando os fatos.',
        'Fica com raiva junto com a pessoa.',
        'Escuta em silêncio e conforta.',
      ],
    },
    {
      q: 'Quando você aprende algo novo, seu estilo é…',
      choices: [
        'Seguir o manual passo a passo, sem errar.',
        'Observar em silêncio primeiro e descobrir sozinho.',
        'Meter a cara logo e ir pegando o jeito na prática.',
      ],
    },
    {
      q: 'Você está atrasado para encontrar alguém. Você…',
      choices: [
        'Já que está atrasado mesmo, chega numa boa e escolhe o lugar primeiro.',
        'Calcula a rota exata para chegar no timing perfeito.',
        'Chega atrasado, mas dá um show de entrada.',
        'Aproveita para testar uma rota totalmente nova.',
      ],
    },
    {
      q: 'Resuma seu dia em uma frase:',
      choices: [
        'Escapei de toda tarefa chata. Dia perfeito.',
        'Encontrei uma beleza pequena em algo simples.',
        'Você não vai acreditar no que aconteceu hoje.',
      ],
    },
  ],
};
