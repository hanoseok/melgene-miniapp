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
};
