/* Sim ou não — português do Brasil (você). Mesma estrutura de chaves de en.js (veja os comentários).
 * oracle: 12 respostas (0-3 positivas · 4-7 neutras · 8-11 negativas), curtas porque ficam dentro da bola. */
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
    title: 'Sim ou não – roleta para decidir online',
    description: 'Na dúvida? Escreva sua pergunta e a roleta do sim ou não responde na hora: sim/não, sim/não/talvez, a bola mística ou melhor de 3 e de 5. Grátis, justa e sem cadastro.',
    ogTitle: 'Sim ou não 🎱 Pergunte e a bola responde',
    ogDescription: 'Sim, não, talvez ou a resposta da bola mística. Sorteio justo para cada pequeno dilema.',
  },
  siteName: 'Sim ou não',
  privacyLink: 'Privacidade',

  hero: {
    h1Kicker: 'Sim ou não',
    h1Html: 'Pergunte o que quiser.<br>A bola diz <em>sim</em> ou <em>não</em>',
    hook: 'Escreva aquela pergunta que não sai da sua cabeça, escolha um modo e deixe o acaso desempatar.',
  },

  ui: {
    questionLabel: 'Sua pergunta (opcional)',
    questionPh: 'ex.: Peço açaí hoje à noite?',
    questionHint: 'Fica só neste aparelho. Só vai para um link se você compartilhar a resposta.',
    modeLabel: 'Como a bola deve responder?',
    modes: {
      classic: 'Sim / Não',
      maybe: 'Sim / Não / Talvez',
      oracle: 'Bola mística',
      best3: 'Melhor de 3',
      best5: 'Melhor de 5',
    },
    modeHints: {
      classic: 'Um sim ou não direto, meio a meio.',
      maybe: 'Sim, não ou talvez, um terço cada.',
      oracle: 'Uma de 12 respostas da bola: umas dizem sim, outras não e outras “espere”.',
      best3: 'Joga até um lado vencer duas vezes.',
      best5: 'Joga até um lado vencer três vezes.',
    },
    ask: 'Perguntar à bola 🔮',
    asking: 'A bola está pensando…',
    fair: 'Sorteio criptográfico justo · só por diversão, você decide',
  },

  answers: { yes: 'SIM', no: 'NÃO', maybe: 'TALVEZ' },
  tones: { positive: 'Puxando pro sim', neutral: 'Espere pra ver', negative: 'Puxando pro não' },
  oracle: [
    'Vai fundo!',
    'As estrelas dizem sim',
    'Sim, sem arrependimento',
    'Seu coração já sabe: sim',
    'Durma e decida amanhã',
    'Me pergunte amanhã',
    'Converse e depois decida',
    'A névoa ainda não passou',
    'Desta vez não',
    'As estrelas dizem não',
    'Deixa essa pra lá',
    'Segura mais um pouco',
  ],

  result: {
    heading: 'A bola diz',
    sharedBadge: '🔗 Resposta compartilhada',
    sharedNote: 'Resposta de {date}. É a resposta original salva no link; abrir não faz uma nova pergunta.',
    noQuestion: 'Nenhuma pergunta escrita',
    bestOf: 'Melhor de {n}',
    score: '{yes} {a} : {b} {no}',
    flipYes: 'S',
    flipNo: 'N',
    copyLink: 'Compartilhar resposta 🔗',
    linkCopied: 'Link copiado com sua pergunta e resposta',
    again: 'Perguntar de novo',
    askOwn: 'Perguntar eu mesmo',
    live: 'Resposta: {answer}',
    shareTitle: 'Sim ou não',
    shareText: 'Perguntei à bola do sim ou não e ela disse: {answer} 🎱',
  },

  tally: {
    title: 'Nesta sessão',
    total: 'Respostas: {n}',
  },

  history: {
    title: 'Respostas recentes',
    note: 'Suas últimas 10 respostas, salvas só neste aparelho.',
    clear: 'Limpar',
  },

  errors: {
    badLink: 'Este link de resposta está quebrado ou incompleto, então nada é mostrado.',
  },

  og: {
    brand: '🎱 Sim ou não',
    kicker: 'Sim · Não · Talvez · Bola mística',
    title: 'Faça uma pergunta, receba sim ou não',
    desc: 'Sorteio justo para cada pequeno dilema',
  },

  faq: [
    { q: 'Como funciona a roleta do sim ou não?', a: 'Escreva uma pergunta se quiser, escolha um modo e toque em “Perguntar à bola”. A resposta é sorteada primeiro e depois a bola treme ou as jogadas aparecem uma a uma para revelá-la. Sim/Não é meio a meio, Sim/Não/Talvez dá um terço para cada, a bola mística escolhe uma de 12 respostas e melhor de 3 ou 5 continua até um lado ter maioria.' },
    { q: 'A resposta é mesmo aleatória?', a: 'Sim. Cada resposta vem do gerador aleatório criptográfico do seu navegador (crypto.getRandomValues) com amostragem por rejeição, então nenhuma resposta é nem um pouquinho mais provável que outra. A animação só mostra um resultado já sorteado.' },
    { q: 'Preciso seguir o que ela diz?', a: 'Só se quiser. É uma resposta aleatória para se divertir, não um conselho nem uma previsão, então não use para saúde, dinheiro, questões legais ou segurança. Uma dica: repare se você sente alívio ou decepção quando a resposta aparece. Esse sentimento costuma ser a sua resposta de verdade.' },
    { q: 'Minha pergunta fica salva ou é enviada?', a: 'Sua pergunta fica no seu navegador. As últimas 10 respostas ficam salvas neste aparelho para você rever, e dá para limpar quando quiser. A pergunta só sai do aparelho se você tocar em “Compartilhar resposta”, que a coloca dentro do link que você envia.' },
  ],

  privacy: {
    title: 'Política de privacidade | Sim ou não',
    description: 'Política de privacidade do Sim ou não: suas perguntas ficam no navegador, cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'Sim ou não (o "Serviço") respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações coletadas', 'O Serviço funciona sem conta nem login. As perguntas que você escreve e as respostas que recebe são processadas só no seu navegador e não são enviadas ao nosso servidor. Suas últimas 10 respostas, com a pergunta, ficam no armazenamento local do navegador no seu aparelho, e você pode apagá-las a qualquer momento com o botão Limpar. Quando você toca em "Compartilhar resposta", a pergunta e a resposta são escritas no próprio link e compartilhadas só com quem recebê-lo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e suas respostas recentes, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios agregados que guardam só totais diários por idioma (visualizações, perguntas feitas, avaliações). Suas perguntas nunca entram nessas contagens e nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta Política de privacidade, entre em contato com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale a partir de 15 de outubro de 2026.'],
    ],
    back: '← Voltar para Sim ou não',
  },
};
