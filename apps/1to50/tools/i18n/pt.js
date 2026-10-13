/* Jogo de 1 a 50 — português (Brasil) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Jogo de 1 a 50 – Toque os números em ordem',
    description: 'Jogue o jogo de 1 a 50 online: toque os números em ordem o mais rápido que puder e bata seu recorde no centésimo. Modo clássico ou rápido de 1 a 25. Grátis, sem baixar nada.',
    ogTitle: 'Jogo de 1 a 50 🔢 Em quanto tempo você toca de 1 a 50?',
    ogDescription: 'Ache o próximo número e toque nele, até o fim. Um teste rápido de foco e velocidade dos dedos.',
  },
  siteName: 'Jogo de 1 a 50',
  privacyLink: 'Política de Privacidade',
  start: {
    badge: '🔢 Tocar números · velocidade',
    h1Kicker: 'Jogo de 1 a 50',
    h1Html: 'De 1 a 50,<br>bem <em>rapidinho</em>!',
    hook: 'Os números estão espalhados pela grade. Ache o próximo, toque nele e siga até o fim. Seus olhos precisam ser mais rápidos que seus dedos.',
    how: { order: 'Toque em ordem desde 1', swap: 'Surgem números novos', penalty: 'Erro +0,5 s' },
    facts: 'Contagem 3-2-1 · tempo em centésimos',
    modeLabel: 'Escolha o modo',
    modes: { classic: 'Clássico', quick: 'Rápido' },
    start: 'Começar →',
  },
  play: {
    next: 'Próximo',
    time: 'Tempo',
    progress: 'Feitos',
    go: 'JÁ!',
    boardAria: 'Grade do jogo de 1 a 50. Toque os números em ordem, começando pelo 1.',
    paused: 'Pausado · toque para continuar',
    aBlank: 'Casa vazia',
  },
  result: {
    done: 'Concluído!',
    sec: 's',
    mistakesLabel: 'Erros',
    perLabel: 'Por número',
    best: 'Recorde: {t}',
    newBest: 'Novo recorde!',
    penNote: 'Inclui +{s} s pelos erros',
    top: 'Top {n}%',
    beat: 'Mais rápido que {pct}% dos jogadores',
    beatAll: 'Mais rápido que todos os outros tempos até agora',
    others: 'Comparado com outros {n} tempos',
    comparing: 'Comparando com outros jogadores…',
    retry: 'Jogar de novo',
    shareTitle: 'Jogo de 1 a 50 – você é rápido?',
    shareText: 'Toquei de 1 a {max} em {time} segundos 🔢 Consegue me vencer?',
  },
  og: {
    brand: '🔢 Jogo de 1 a 50',
    defaultKicker: 'Jogo de velocidade grátis',
    defaultTitle: 'Quanto tempo de 1 a 50?',
    defaultDesc: 'Ache o próximo número · vença o relógio',
  },
  faq: [
    {
      q: 'Como se joga o jogo de 1 a 50?',
      a: 'Depois de uma contagem 3-2-1, uma grade 5×5 mostra os números de 1 a 25 em lugares aleatórios. Toque o 1, depois o 2, depois o 3 e assim por diante. No modo Clássico, cada casa tocada mostra um número novo de 26 a 50, e você continua até o 50.',
    },
    {
      q: 'O que acontece se eu tocar o número errado?',
      a: 'A casa treme e 0,5 segundo é somado ao seu tempo, então tocar no chute não vale a pena. Tocar uma casa vazia não faz nada. No resultado você vê quantos erros cometeu.',
    },
    {
      q: 'Qual a diferença entre Clássico e Rápido?',
      a: 'O Clássico vai de 1 a 50 e é o modo de referência para comparar tempos. O Rápido termina no 25 e cada casa tocada fica vazia: é um aquecimento curto e funciona como uma tabela de Schulte.',
    },
    {
      q: 'De onde vem o número “Top %”?',
      a: 'Ao terminar, seu modo e seu tempo arredondado são comparados com os tempos reais de outros jogadores no mesmo modo. Se ainda não houver tempos para comparar, esse bloco não aparece.',
    },
  ],
  privacy: {
    "title": "Política de privacidade | Jogo de 1 a 50",
    "description": "Política de privacidade do Jogo de 1 a 50: tempos anônimos, cookies, publicidade e estatísticas.",
    "h1": "Política de privacidade",
    "introHtml": "O Jogo de 1 a 50 (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.",
    "sections": [
      [
        "1. Informações que coletamos",
        "O Serviço funciona sem conta ou login. Quando você termina uma partida, apenas o modo e o seu tempo (arredondado para o décimo de segundo) são enviados ao nosso servidor como contagem anônima, sem nome ou identificador pessoal. Algumas informações podem ser coletadas automaticamente durante o uso do Serviço, conforme descrito abaixo."
      ],
      [
        "2. Cookies e tecnologias semelhantes",
        "O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e seu recorde, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado."
      ],
      [
        "3. Publicidade (Google AdSense)",
        "O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configurações de anúncios do Google</a>."
      ],
      [
        "4. Estatísticas",
        "Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam só totais diários por idioma (visualizações de página, partidas iniciadas e concluídas, avaliações). Nada disso identifica você pessoalmente."
      ],
      [
        "5. Contato",
        "Se tiver dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site."
      ],
      [
        "6. Data de vigência",
        "Esta política vale a partir de 14 de outubro de 2026."
      ]
    ],
    "back": "← Voltar ao Jogo de 1 a 50"
  },
};
