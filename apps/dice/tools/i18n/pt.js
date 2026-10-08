/* Rolar dados — português do Brasil (você). Mesma estrutura de en.js (veja os comentários em en.js). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Rolar dados online – Simulador de dados',
    description: 'Role dados online com um toque. Jogue de um a seis dados de uma vez, escolha o d6 clássico ou d4, d8, d10, d12 e d20 para RPG e jogos de tabuleiro e veja a soma na hora. Justo, grátis e sem cadastro.',
    ogTitle: 'Rolar dados 🎲 Dados online',
    ogDescription: 'Role de um a seis dados, do d6 ao d20, e veja a soma na hora.',
  },
  siteName: 'Rolar dados',
  privacyLink: 'Política de privacidade',

  hero: {
    h1Kicker: 'Rolar dados online',
    h1Html: 'Sacuda, role e deixe<br>os <em>dados</em> decidirem',
    hook: 'Escolha quantos dados e de que tipo, depois role. Jogos de tabuleiro, RPG de mesa ou decidir quem lava a louça.',
  },

  ui: {
    dieLetter: 'd',
    countLabel: 'Quantos dados?',
    typeLabel: 'Tipo de dado',
    typeHint: 'O d6 é o cubo clássico. Do d4 ao d20 são para RPG de mesa.',
    roll: 'Rolar os dados 🎲',
    rolling: 'Rolando…',
    keyHint: 'Dica: aperte Espaço para rolar',
    idle: 'Pronto quando você quiser',
    total: 'Soma {n}',
    trayLabel: 'Bandeja de dados',
    live: 'Você tirou {values}. Soma {total}.',
    liveOne: 'Você tirou {values}.',
    fair: 'Cada face tem exatamente a mesma chance (aleatório criptográfico)',
  },

  history: {
    title: 'Suas últimas 10 rolagens',
    note: 'Guardadas só enquanto esta página estiver aberta.',
    item: '{dice}: {values} = {total}',
    itemOne: '{dice}: {values}',
  },

  result: {
    again: 'Rolar de novo',
    shareTitle: 'Rolar dados – Dados online',
    shareText: 'Rolei {dice} e tirei {values} = {total} 🎲',
    shareTextOne: 'Rolei {dice} e tirei {values} 🎲',
  },

  og: {
    brand: '🎲 Rolar dados',
    kicker: '1 a 6 dados · d4 ao d20',
    title: 'Rolar dados online',
    desc: 'Um toque e você vê cada dado e a soma',
  },

  faq: [
    { q: 'O rolador de dados é mesmo aleatório e justo?', a: 'Sim. Cada resultado vem do gerador aleatório criptográfico do seu navegador (crypto.getRandomValues) com amostragem por rejeição, então nenhuma face tem nem um pouquinho mais de chance que outra. O resultado é definido antes de a animação começar; os dados girando são só para enfeitar.' },
    { q: 'Quantos dados posso rolar de uma vez?', a: 'De um a seis dados por rolagem, todos do mesmo tipo. A bandeja mostra cada dado e a soma, e as últimas dez rolagens ficam numa listinha enquanto a página estiver aberta.' },
    { q: 'O que são d4, d8, d10, d12 e d20?', a: 'São dados de 4, 8, 10, 12 e 20 lados, usados em RPGs de mesa como Dungeons & Dragons. O número depois do d é a quantidade de faces: um d20 dá de 1 a 20, e 2d6 quer dizer dois dados de seis lados.' },
    { q: 'Dá para usar em jogos de tabuleiro?', a: 'Claro. Use quando os dados sumirem, quando precisar de mais dados do que vêm na caixa ou quando jogar por chamada de vídeo. No teclado, aperte Espaço para rolar rapidinho.' },
  ],

  privacy: {
    title: 'Política de privacidade | Rolar dados',
    description: 'Política de privacidade do Rolar dados: suas rolagens ficam no seu navegador, cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Rolar dados (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta e sem login. As configurações dos dados e os resultados são processados apenas no seu navegador e não são enviados ao nosso servidor. No entanto, algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o seu idioma, exibir anúncios e entender como ele é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para veicular anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam apenas totais diários por idioma (visualizações, rolagens, avaliações em estrelas). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política vigora a partir de 9 de outubro de 2026.'],
    ],
    back: '← Voltar ao Rolar dados',
  },
};
