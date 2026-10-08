/* Portal Melgene Apps (hub) — português brasileiro (/pt/).
 * privacy.introHtml e o corpo de privacy.sections são HTML; o resto é texto simples.
 * ui é usado por script.js e é incluído na página como window.PAGE_I18N.
 * Sem spoiler: os textos da curadoria descrevem o clima de cada app, nunca as perguntas ou resultados reais. */
module.exports = {
  siteName: 'Melgene Apps',
  // 머리글 워드마크: 'Melgene' + 작은 배지 (공통 STRINGS.pt.brandBadge 와 같아야 한다)
  brand: { word: 'Melgene', badge: 'Apps' },
  typography: { display: "'Gabarito', var(--font-sans)" },
  meta: {
    title: 'Minijogos grátis e testes de personalidade | Melgene Apps',
    description:
      'Minijogos grátis e testes de personalidade que abrem na hora no navegador, sem baixar app nem cadastro. Cada minijogo dura cerca de um minuto.',
    ogTitle: 'Melgene Apps: minijogos grátis e testes de personalidade',
    ogDescription: 'Minijogos, testes de personalidade e apps para criar. Sem baixar, sem cadastro: é só tocar e jogar em um minuto.',
  },
  homeAria: 'Início do Melgene Apps',
  h1: 'Minijogos grátis e testes de personalidade',
  curation: {
    h2: 'Mini apps de hoje',
    items: [
      {
        id: 'hangul-name',
        kicker: "Dia do hangul",
        headline: "Seu nome escrito em coreano",
        blurb: "Digite seu nome e receba em hangul num cartão.",
      },
      {
        id: 'dice',
        kicker: "Para jogos de tabuleiro",
        headline: "Role os dados no navegador",
        blurb: "Até seis dados, do d4 ao d20. Rolagens justas.",
      },
      {
        id: 'brick',
        kicker: 'Clássico de fliperama',
        headline: 'Uma bola contra o muro neon',
        blurb: 'Rebata com a raquete e derrube tudo. 3 vidas, cada vez mais rápido.',
      },
      {
        id: 'mentalage',
        kicker: 'Teste de personalidade',
        headline: 'Quantos anos tem sua mente?',
        blurb: '12 perguntas do dia a dia, 2 minutos. Sua idade mental em número.',
      },
      {
        id: 'fancytext',
        kicker: 'Faça você',
        headline: 'Dê estilo ao seu texto',
        blurb: 'Transforme seu texto em letras diferentes e copie com um toque.',
      },
      {
        id: 'mole',
        kicker: 'Jogo de reflexos',
        headline: 'Acerte as toupeiras, fuja das bombas',
        blurb: 'Toque antes que se escondam. 30 segundos, um título.',
      },
      {
        id: 'nickname',
        kicker: 'Faça você',
        headline: 'Um nickname a sua cara',
        blurb: 'Escolha o clima e ganhe um nickname novo com um toque.',
      },
      {
        id: 'coinflip',
        kicker: 'Sem decidir?',
        headline: 'Cara ou coroa, ou um dado',
        blurb: 'Jogue uma moeda ou até três dados, sempre na sorte.',
      },
      {
        id: 'lotto',
        kicker: 'Dia de sorte?',
        headline: 'Números da loteria por diversão',
        blurb: 'Escolha um jogo e sorteie até cinco jogos.',
      },
      {
        id: 'invite',
        kicker: 'Faça você mesmo',
        headline: 'Crie um convite de festa de Halloween',
        blurb: 'Ponha os dados da festa, escolha um tema e salve ou envie.',
      },
      {
        id: 'lunch',
        kicker: 'Sem ideia do que comer?',
        headline: 'Gire a roleta da refeição de hoje',
        blurb: 'Escolha a refeição e o humor e deixe o caça-níqueis decidir.',
      },
      {
        id: 'merge',
        kicker: 'Jogo rápido',
        headline: 'Solte, junte e cresça',
        blurb: 'Dois iguais se fundem em algo maior. Não deixe o pote transbordar!',
      },
      {
        id: 'costume',
        kicker: 'Teste de personalidade',
        headline: 'Qual fantasia usar neste Halloween?',
        blurb: 'Responda a algumas situações e descubra a fantasia ideal.',
      },
      {
        id: 'ghost',
        kicker: 'Faça você mesmo',
        headline: 'Crie seu próprio fantasminha',
        blurb: 'Escolha forma, carinha e chapéu, depois salve ou mande.',
      },
      {
        id: 'team',
        kicker: 'Sortear times',
        headline: 'Times aleatórios e justos num toque',
        blurb: 'Digite os nomes, escolha quantos times e sorteie.',
      },
      {
        id: 'lovestyle',
        kicker: 'Teste de personalidade',
        headline: 'Como você é no amor?',
        blurb: 'Dez pequenos momentos a dois revelam o seu jeito de amar.',
      },
      {
        id: 'animal',
        kicker: 'Teste de personalidade',
        headline: 'Que animal você é?',
        blurb: 'Oito momentos do dia a dia, dois minutos. Conheça seu lado selvagem.',
      },
      {
        id: 'game2048',
        kicker: 'Quebra-cabeça',
        headline: 'Deslize, junte e chegue a 2048',
        blurb: 'Junte números iguais. O clássico dos números, versão Halloween.',
      },
      {
        id: 'aura',
        kicker: 'Teste de personalidade',
        headline: 'Qual é a cor da sua aura?',
        blurb: 'Responda a alguns momentos do dia a dia e descubra seu brilho.',
      },
      {
        id: 'candy-catch',
        kicker: 'Jogo rápido',
        headline: 'Pegue os doces que caem do céu',
        blurb: 'Mova seu balde de abóbora e desvie do que dá medo.',
      },
    ],
  },
  browse: {
    h2: 'Todos os mini apps',
    searchLabel: 'Buscar mini apps',
    searchPlaceholder: 'Buscar mini apps',
    catLabel: 'Categorias',
    sortLabel: 'Ordenar por',
  },
  ui: {
    // "Sorteio" na categoria vote (roleta, sorteio): mais natural do que traduzir "vote" ao pé da letra.
    cats: { all: 'Todos', game: 'Jogos', test: 'Testes', create: 'Criar', vote: 'Sorteio' },
    sorts: { popular: 'Populares', rating: 'Bem avaliados', newest: 'Novidades' },
    totalHtml: 'Já jogado <strong>{n} vezes</strong>',
    play: 'Jogar',
    newBadge: 'NOVO',
    plays: '{n} jogadas',
    ratingAria: 'Avaliação {avg} de 5 ({votes} avaliações)',
    prev: 'Indicação anterior',
    next: 'Próxima indicação',
    goTo: 'Mostrar indicação {n}',
    count: '{n} apps',
    countOne: '1 app',
    emptyCat: 'Ainda não há mini apps nessa categoria.',
    emptySearch: 'Nada encontrado para "{q}". Tente outra palavra ou veja todos os mini apps.',
    reset: 'Ver todos',
  },
  faqTitle: 'Perguntas frequentes',
  // Visível no rodapé do portal (+ FAQPage JSON-LD). Curto, sem spoiler.
  faq: [
    [
      'O que é o Melgene Apps?',
      'O Melgene Apps é uma coleção grátis de mini apps: minijogos rápidos, testes de personalidade e apps que transformam poucas respostas em algo seu. Cada um dura cerca de um minuto e abre direto no navegador.',
    ],
    [
      'Preciso baixar algo ou me cadastrar?',
      'Não. Todo minijogo e teste é uma página web que funciona no celular, no tablet e no computador, então dá pra mandar o link e seus amigos jogam na hora. Se usar bastante, escolha "Adicionar à tela inicial" no menu do navegador pra deixar como um app.',
    ],
    [
      'Vocês coletam dados pessoais?',
      'Não. Nunca pedimos seu nome, e-mail ou telefone. Corações, notas e número de jogadas são totais anônimos por app, e um link de compartilhamento guarda só as respostas necessárias pra mostrar aquele resultado.',
    ],
    [
      'Com que frequência saem mini apps novos?',
      'A gente vai adicionando jogos e testes de personalidade novos conforme o que está em alta. Os novos ganham o selo NOVO por duas semanas e aparecem primeiro ao ordenar por Novidades.',
    ],
  ],
  privacyLink: 'Política de privacidade',
  og: {
    h1Html: 'Minijogos grátis<br>e testes de personalidade',
    tag: 'Sem baixar. Sem cadastro. Só jogar.',
  },
  privacy: {
    title: 'Política de privacidade | Melgene Apps',
    description:
      'Política de privacidade do Melgene Apps: publicidade (Google AdSense), contagens anônimas de jogadas, corações e notas, cookies e armazenamento do navegador.',
    h1: 'Política de privacidade',
    introHtml:
      'O Melgene Apps (o "Serviço") é uma coleção de mini apps que você usa sem precisar de conta. Respeitamos sua privacidade e tratamos só o mínimo de informação necessária para o Serviço funcionar, como descrito abaixo.',
    sections: [
      [
        '1. Informações que não coletamos',
        'O Serviço nunca pede nem coleta dados pessoais como seu nome, e-mail, telefone ou uma conta. O que você digita em cada mini app é processado, por padrão, só no seu próprio navegador.',
      ],
      [
        '2. Contagens anônimas: jogadas, corações e notas (Supabase)',
        'Para mostrar jogadas, corações e notas, guardamos apenas o seguinte no Supabase (um serviço de banco de dados): totais acumulados por mini app (jogadas e corações), notas de 1 a 5 estrelas por mini app, e totais diários por data, mini app e idioma (visualizações de página, jogadas concluídas e se um anúncio foi mostrado). Para não contar a mesma visita duas vezes em menos de 30 segundos, o servidor guarda por um curto período um hash de mão única do seu endereço IP e o apaga automaticamente, geralmente em menos de um dia. Para contar só uma nota por navegador, seu navegador guarda um identificador aleatório e o servidor armazena apenas o hash dele. Quando você cria um link de compartilhamento, guardamos só as respostas necessárias para mostrar aquele resultado a quem abrir o link. Nada disso é usado para identificar você.',
      ],
      [
        '3. Publicidade (anúncios automáticos do Google AdSense)',
        'O Serviço mostra anúncios pelos anúncios automáticos do Google AdSense, ou seja, é o Google quem escolhe onde eles aparecem. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nos seus interesses. Você pode revisar e mudar as configurações de anúncios personalizados nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configurações de anúncios do Google</a>.',
      ],
      [
        '4. Estatísticas (Google Analytics)',
        'O Serviço pode usar o Google Analytics (GA4) para estatísticas de visitas e para melhorar o Serviço. Esses dados são usados só para fins estatísticos e não identificam você pessoalmente.',
      ],
      [
        '5. Cookies e armazenamento do navegador',
        'Ajustes como seu idioma, a última categoria e ordenação usadas, e as notas que você deu ficam salvos só no seu navegador (localStorage e um cookie que lembra seu idioma). Você pode apagar ou bloquear cookies e dados do site a qualquer momento nas configurações do navegador.',
      ],
      ['6. Contato', 'Se tiver alguma dúvida sobre esta política de privacidade, entre em contato com o responsável pelo site.'],
      ['7. Data de vigência', 'Esta política está em vigor desde 26 de setembro de 2026.'],
    ],
    back: '← Voltar ao Melgene Apps',
  },
  // Rodapé de todas as páginas do portal (Sobre · Guias · Termos · Privacidade · Contato). Texto simples (é escapado).
  footerNav: { about: 'Sobre nós', guides: 'Guias', terms: 'Termos de uso', privacy: 'Privacidade', contact: 'Contato' },
  aboutPage: {
    title: 'Sobre nós | Melgene Apps',
    description: 'O Melgene Apps é um pequeno estúdio independente que cria minijogos, testes de personalidade e ferramentas criativas grátis no navegador, em 12 idiomas.',
    h1: 'Sobre o Melgene Apps',
    lead: 'O Melgene Apps é um pequeno estúdio independente que cria miniapps gratuitos para abrir em qualquer navegador: joguinhos rápidos, testes de personalidade descontraídos, pequenas ferramentas criativas e ajudinhas para as decisões do dia a dia. Sem download, sem cadastro, e a maioria leva mais ou menos um minuto.',
    sections: [
      {
        h: 'O que a gente faz',
        p: [
          'Cada miniapp do Melgene faz uma coisa só, mas faz bem. Alguns são jogos de arcade para terminar no intervalo do café, como o jogo da toupeira, o quebra-tijolos ou um quebra-cabeça de juntar. Outros são testes de personalidade que transformam algumas situações do dia a dia em um resultado divertido para compartilhar. E outros ajudam você a criar algo, como letras estilosas, um convite de festa ou um apelido, ou a resolver uma decisão pequena com uma roleta, um jogo da escadinha ou cara ou coroa.',
          'Lançamos apps novos com frequência, muitas vezes de acordo com as estações e as datas comemorativas, e seguimos melhorando os antigos com base em como as pessoas realmente usam.',
        ],
      },
      {
        h: 'Por que a gente faz isso',
        p: ['Acreditamos que os melhores momentos na internet devem ser rápidos, gentis e gratuitos. Muitos sites de jogos ou testes escondem tudo atrás de cadastros, pop-ups e pedidos para instalar um app. Nosso objetivo é o contrário: você toca no link, o app abre, você joga e, com mais um toque, manda para um amigo.'],
      },
      {
        h: 'Como cada app é criado e testado',
        p: ['Todo app começa com um plano curto: para quem é, quanto tempo deve durar uma rodada e o que a tela de resultado mostra. Depois criamos uma página web leve e testamos antes de publicar:'],
        list: [
          'Em telas pequenas de celular (360 px de largura), além de tablets e navegadores de computador',
          'Nos 12 idiomas, conferindo se cada frase cabe na tela e soa natural',
          'Com verificações automáticas de links quebrados, traduções faltando e estrutura das páginas',
          'Sem spoilers: a tela inicial desperta a curiosidade, mas nunca revela perguntas ou resultados',
        ],
      },
      {
        h: 'Feito para o celular, em 12 idiomas',
        p: ['A maioria das pessoas joga no celular, então todo app é pensado primeiro para telas estreitas. O Melgene Apps está disponível em português, inglês, japonês, chinês, coreano, francês, alemão, tailandês, vietnamita, espanhol, italiano e russo. Escrevemos cada idioma para quem vai ler, em vez de traduzir palavra por palavra, e usamos os nomes que as pessoas de cada país realmente pesquisam.'],
      },
      {
        h: 'Privacidade desde o início',
        p: ['Você nunca precisa de conta e nós nunca pedimos seu nome, e-mail ou telefone. O que você digita em um app é processado no seu próprio navegador. Jogadas, corações e avaliações são apenas totais anônimos por app. O site é mantido com anúncios do Google AdSense; os detalhes estão na nossa Política de Privacidade.'],
      },
      {
        h: 'Um aviso sobre os testes de personalidade',
        p: ['Nossos testes de personalidade, de idade mental e outros quizzes parecidos são feitos para diversão. Eles não são avaliações psicológicas, médicas ou profissionais, e nenhum resultado deve ser usado para tomar decisões importantes sobre você ou outra pessoa. Aproveite como assunto para conversar e um momento divertido.'],
      },
      {
        h: 'Fale com a gente',
        p: ['Lemos todas as mensagens. Se você encontrar um erro, tiver uma ideia de miniapp novo ou quiser falar sobre parceria, visite nossa página de Contato ou mande um e-mail para contact@melgene.com.'],
      },
    ],
  },
  contactPage: {
    title: 'Contato | Melgene Apps',
    description: 'Fale com o Melgene Apps por e-mail para opiniões, relatos de erros, propostas de parceria ou pedidos sobre privacidade. Costumamos responder em poucos dias úteis.',
    h1: 'Fale com a gente',
    lead: 'Dúvidas, ideias ou algum problema? Somos uma equipe pequena e lemos cada mensagem pessoalmente.',
    emailH: 'E-mail',
    emailNote: 'Costumamos responder em poucos dias úteis.',
    sections: [
      {
        h: 'Sobre o que você pode escrever',
        p: ['Pode escrever sobre qualquer assunto ligado ao Melgene Apps, por exemplo:'],
        list: [
          'Opiniões e ideias para novos minijogos, testes ou ferramentas',
          'Relatos de erros: uma página que não abre, um botão que não responde ou um texto cortado',
          'Erros de tradução ou frases que soam estranhas no seu idioma',
          'Propostas de parceria, licenciamento ou imprensa',
          'Pedidos sobre privacidade e dúvidas sobre dados ou cookies',
        ],
      },
      {
        h: 'Ao relatar um erro',
        p: ['Para a gente resolver rápido, informe o nome do miniapp, o idioma que você estava usando, seu aparelho e navegador (por exemplo, iPhone com Safari ou Android com Chrome) e descreva em poucas palavras o que aconteceu. Uma captura de tela ajuda muito.'],
      },
      {
        h: 'Prazo de resposta',
        p: ['Costumamos responder em poucos dias úteis; em feriados pode demorar um pouco mais. Nunca vamos pedir sua senha ou dados de pagamento.'],
      },
    ],
  },
  termsPage: {
    title: 'Termos de uso | Melgene Apps',
    description: 'Termos de uso do Melgene Apps: minijogos e testes grátis no navegador, oferecidos no estado em que se encontram para diversão, regras de uso, links de compartilhamento e anúncios de terceiros.',
    h1: 'Termos de uso',
    updated: 'Última atualização: 9 de outubro de 2026',
    lead: 'Estes Termos de uso se aplicam ao Melgene Apps (o “Serviço”), incluindo o portal e todos os miniapps dos nossos sites. Ao usar o Serviço, você concorda com estes termos. Se não concordar, por favor não use o Serviço.',
    sections: [
      { h: '1. O Serviço', p: ['O Melgene Apps oferece gratuitamente minijogos, testes de personalidade, ferramentas criativas e ajudas para decidir que funcionam no navegador. Não é preciso criar conta. Podemos adicionar, alterar ou remover apps e recursos a qualquer momento.'] },
      { h: '2. Oferecido no estado em que se encontra', p: ['O Serviço é oferecido “no estado em que se encontra” e “conforme disponível”, sem garantias de qualquer tipo. Fazemos o possível para que tudo funcione bem, mas não garantimos que esteja sempre disponível, livre de erros ou adequado a uma finalidade específica. Na medida permitida por lei, não nos responsabilizamos por perdas ou danos resultantes do uso do Serviço.'] },
      { h: '3. Apenas para diversão', p: ['Os resultados de testes de personalidade, testes de idade mental, sorteios aleatórios e recursos parecidos são para diversão. Eles não são orientação científica, psicológica, médica, financeira ou profissional. Um resultado aleatório, como números de loteria, não aumenta suas chances de ganhar nada.'] },
      {
        h: '4. Uso aceitável',
        p: ['Ao usar o Serviço, você concorda em não:'],
        list: [
          'Usá-lo para fins ilegais, prejudiciais ou abusivos',
          'Inserir conteúdo de ódio, assédio, sexualmente explícito ou que viole direitos de terceiros',
          'Atrapalhar ou sobrecarregar o Serviço, extrair dados em massa ou acessá-lo sem autorização',
          'Manipular jogadas, corações, avaliações ou anúncios, inclusive com ferramentas automáticas ou cliques inválidos',
        ],
      },
      { h: '5. O que você cria e compartilha', p: ['Alguns apps permitem digitar nomes ou textos, criar uma imagem ou gerar um link de compartilhamento. Você é responsável pelo que digita e compartilha. Um link de compartilhamento guarda só as informações necessárias para mostrar aquele resultado, e qualquer pessoa com o link pode abri-lo, então não inclua dados pessoais ou sensíveis. Podemos remover links que violem estes termos.'] },
      { h: '6. Anúncios e cookies', p: ['O Serviço é gratuito porque é mantido por anúncios. Os anúncios são fornecidos por terceiros, como o Google AdSense, que podem usar cookies e tecnologias semelhantes para exibir e medir anúncios, inclusive personalizados. Não controlamos o conteúdo dos anúncios de terceiros nem os sites para onde eles levam. Saiba mais e gerencie suas escolhas na nossa Política de Privacidade e nas Configurações de anúncios do Google.'] },
      { h: '7. Propriedade intelectual', p: ['O design, o código, os textos, as ilustrações e os demais materiais do Serviço pertencem ao Melgene Apps ou a seus licenciadores e são protegidos por lei. Você pode usar o Serviço para fins pessoais e não comerciais e compartilhar os links livremente. Não copie, republique ou venda os apps ou seu conteúdo sem a nossa permissão.'] },
      { h: '8. Mudanças nestes termos', p: ['Podemos atualizar estes Termos de uso de tempos em tempos e, quando isso acontecer, mudaremos a data no topo desta página. Se você continuar usando o Serviço depois de uma atualização, estará aceitando os termos revisados.'] },
      { h: '9. Contato', p: ['Se tiver dúvidas sobre estes termos, mande um e-mail para contact@melgene.com ou use nossa página de Contato.'] },
    ],
  },
  guidesPage: {
    title: 'Guias e dicas de todos os miniapps | Melgene Apps',
    description: 'Como jogar, dicas e curiosidades dos minijogos, testes de personalidade e ferramentas do Melgene. Leia um guia rápido e vá direto para o app.',
    h1: 'Guias e dicas',
    lead: 'Cada guia explica como um miniapp funciona, como mandar melhor e algumas coisas que vale saber antes de começar. Sem spoilers: as perguntas e os resultados continuam sendo surpresa.',
    read: 'Ler o guia',
    play: 'Jogar',
    empty: 'Os guias estão a caminho. Volte em breve!',
  },
};
