/* Gerador de loteria — pt. 키 구조는 en.js 와 같다. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual'
  },
  meta: {
    title: 'Gerador de loteria: números aleatórios da sorte',
    description: 'Quer números da sorte? Escolha o 6/45 coreano, um 5/50 + 2 estrelas estilo Euro, a Powerball dos EUA ou seu próprio intervalo, fixe ou exclua números e sorteie até cinco jogos. Só por diversão, sem cadastro.',
    ogTitle: 'Gerador de loteria 🎱 Números aleatórios',
    ogDescription: 'Sorteie números da sorte por diversão, até cinco jogos de uma vez.'
  },
  siteName: 'Gerador de loteria',
  privacyLink: 'Privacidade',
  start: {
    badge: '🎱 Só por diversão',
    h1Kicker: 'Gerador de loteria',
    h1Html: 'Hoje é seu dia de <em>sorte</em>?<br>Sorteie seus números',
    hook: 'Escolha um jogo, fixe ou exclua alguns números e veja as bolas rolarem. Até cinco jogos de uma vez.',
    facts: 'Coreia · estilo Euro · Powerball · personalizado · só entretenimento',
    start: 'Sortear números →'
  },
  tool: {
    title: 'Configure o sorteio',
    presetLabel: 'Qual jogo?',
    presets: {
      kr: 'Coreia 6/45',
      euro: 'Estilo Euro 5/50 + 2',
      us: 'Powerball EUA',
      custom: 'Personalizado'
    },
    presetInfo: {
      kr: '6 números de 1 a 45',
      euro: '5 números de 1 a 50 + 2 estrelas de 1 a 12',
      us: '5 números de 1 a 69 + 1 Powerball de 1 a 26',
      custom: 'Escolha quantos números e o maior deles'
    },
    pickLabel: 'Números a sortear',
    maxLabel: 'Maior número',
    gamesLabel: 'Quantos jogos?',
    fixedLabel: 'Números para manter (opcional)',
    fixedHint: 'Sempre incluídos em todos os jogos, como 7, 21',
    fixedPh: '7, 21',
    excludeLabel: 'Números para excluir (opcional)',
    excludeHint: 'Nunca serão sorteados, como 4, 13',
    excludePh: '4, 13',
    draw: 'Sortear as bolas 🎱',
    drawing: 'Sorteando…',
    machine: 'As bolas giram na máquina de sorteio',
    note: 'Apenas para entretenimento. Toda combinação tem a mesma chance e esta ferramenta não prevê resultados nem aumenta suas chances de ganhar.',
    errors: {
      bad: 'Use números inteiros de 1 a {max}, separados por vírgulas.',
      overlap: 'Um número não pode ser mantido e excluído ao mesmo tempo.',
      tooMany: 'Você pode manter no máximo {pick} números.',
      notEnough: 'Há números excluídos demais para sortear {pick}.'
    }
  },
  result: {
    title: 'Seus números da sorte',
    game: 'Jogo {n}',
    extraNames: {
      euro: 'Estrelas',
      us: 'Powerball'
    },
    copy: 'Copiar números 📋',
    copied: 'Números copiados!',
    again: 'Sortear de novo',
    change: 'Voltar às configurações',
    disclaimer: 'Apenas para entretenimento. Sem previsão, sem promessa de prêmio.',
    shareTitle: 'Gerador de loteria',
    shareText: 'Meus números da sorte 🎱\n{numbers}'
  },
  og: {
    brand: '🎱 Gerador de loteria',
    kicker: 'Números aleatórios · por diversão',
    title: 'Hoje é seu dia de sorte?',
    desc: 'Escolha um jogo e sorteie até cinco jogos'
  },
  faq: [
    {
      q: 'Como sorteio meus números?',
      a: 'Escolha um jogo (6/45 coreano, estilo Euro, Powerball dos EUA ou seu próprio intervalo), defina de um a cinco jogos e toque no botão de sortear. Os números são definidos primeiro, as bolas saem uma a uma e depois cada jogo aparece em ordem crescente.'
    },
    {
      q: 'Os números são mesmo aleatórios?',
      a: 'São. Eles vêm do gerador aleatório criptográfico do seu navegador (crypto.getRandomValues) com amostragem por rejeição, então cada número permitido tem exatamente a mesma chance, sem viés. A animação das bolas é só para dar efeito.'
    },
    {
      q: 'Para que servem os números mantidos e excluídos?',
      a: 'Os números mantidos aparecem em todos os jogos e os demais são sorteados ao redor deles. Os excluídos nunca saem. Valem só para os números principais, não para as estrelas nem para a Powerball.'
    },
    {
      q: 'Isso aumenta minhas chances de ganhar?',
      a: 'Não. Em um sorteio real toda combinação tem a mesma chance e nenhuma ferramenta consegue prever o resultado. Este gerador é só um jeito divertido de escolher números e não promete prêmio nenhum.'
    }
  ],
  privacy: {
    title: 'Política de privacidade | Gerador de loteria',
    description: 'Política de privacidade do Gerador de loteria: os números que você digita ficam no seu navegador, cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Gerador de loteria (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      [
        '1. Informações que coletamos',
        'O Serviço funciona sem conta e sem login. Os números que você digita e os resultados são processados apenas no seu navegador e não são enviados ao nosso servidor. No entanto, algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'
      ],
      [
        '2. Cookies e tecnologias semelhantes',
        'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar o seu idioma, exibir anúncios e entender como ele é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar como esperado.'
      ],
      [
        '3. Publicidade (Google AdSense)',
        'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para veicular anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configurações de anúncios do Google</a>.'
      ],
      [
        '4. Estatísticas',
        'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam apenas totais diários por idioma (visualizações, sorteios, avaliações em estrelas). Nada disso identifica você pessoalmente.'
      ],
      [
        '5. Contato',
        'Se tiver dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site.'
      ],
      [
        '6. Data de vigência',
        'Esta política vigora a partir de 7 de outubro de 2026.'
      ]
    ],
    back: '← Voltar ao Gerador de loteria'
  }
};
