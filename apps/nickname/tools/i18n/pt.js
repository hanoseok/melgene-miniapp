/* Gerador de nickname — português do Brasil (você). words: por clima { adj, noun } (adjetivos 'masc/fem', nomes '|m' '|f'). Veja en.js */
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
    title: 'Gerador de nickname – Nomes fofos e legais',
    description: 'Sem ideia de nickname ou apelido? Escolha um clima (fofo, legal, engraçado, sonhador), coloque seu nome se quiser e ganhe um nickname aleatório com um toque. Gere de novo até gostar e copie. Grátis.',
    ogTitle: 'Gerador de nickname ✨ Nomes fofos e legais',
    ogDescription: 'Escolha um clima, coloque seu nome e copie o nickname com um toque.',
  },
  siteName: 'Gerador de nickname',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🏷️ Sem ideia de nickname?',
    h1Kicker: 'Gerador de nickname',
    h1Html: 'Ache o nickname<br>que é <em>a sua cara</em>',
    hook: 'Escolha um clima, coloque seu nome se quiser e ganhe um nickname feito só para você.',
    facts: 'Fofo, legal, engraçado, sonhador · mistura seu nome · copie com um toque',
    start: 'Criar meu nickname →',
  },

  make: {
    title: 'Qual é o seu clima?',
    moodLabel: 'Escolha um clima',
    moods: { cute: 'Fofo', cool: 'Legal', funny: 'Engraçado', dreamy: 'Sonhador', mystic: 'Misterioso' },
    nameLabel: 'Seu nome ou algumas letras (opcional)',
    nameHint: 'A gente mistura no nickname. Até 12 caracteres e fica só no seu navegador.',
    namePlaceholder: 'ex.: Ana',
    numbers: '＋ Adicionar números',
    poolCount: 'Combinações deste clima: {n}+',
    make: 'Criar meu nickname 🎲',
  },

  result: {
    title: 'Seu nickname',
    copy: 'Copiar nickname',
    copied: 'Copiado!',
    copyFail: 'Não deu para copiar. Selecione o nickname e copie manualmente.',
    again: 'Gerar outro',
    change: 'Mudar o clima',
    shareTitle: 'Gerador de nickname',
    shareText: 'O gerador de nickname me deu “{nick}” ✨',
  },

  style: { camel: true, order: 'noun-adj', nameSep: '_' },

  words: {
    cute: {
      adj: ['fofo/fofa', 'peludo/peluda', 'pequenino/pequenina', 'doce', 'fofinho/fofinha', 'borbulhante', 'brilhante', 'macio/macia', 'gordinho/gordinha', 'meigo/meiga', 'alegre', 'quentinho/quentinha'],
      noun: ['coelhinho|m', 'gatinho|m', 'cachorrinho|m', 'panda|m', 'mochi|m', 'marshmallow|m', 'cupcake|m', 'patinho|m', 'pêssego|m', 'pudim|m', 'coala|m', 'ursinho|m'],
    },
    cool: {
      adj: ['neon', 'turbo', 'silencioso/silenciosa', 'veloz', 'gelado/gelada', 'atômico/atômica', 'selvagem', 'noturno/noturna', 'cromado/cromada', 'real', 'elétrico/elétrica', 'flamejante'],
      noun: ['lobo|m', 'falcão|m', 'víbora|f', 'piloto|m', 'lâmina|f', 'tempestade|f', 'tigre|m', 'cometa|m', 'titã|m', 'águia|f', 'corredor|m', 'ninja|m'],
    },
    funny: {
      adj: ['sonolento/sonolenta', 'rabugento/rabugenta', 'bambo/bamba', 'desastrado/desastrada', 'sorrateiro/sorrateira', 'rechonchudo/rechonchuda', 'encharcado/encharcada', 'doidinho/doidinha', 'maluco/maluca', 'preguiçoso/preguiçosa', 'ranzinza', 'faminto/faminta'],
      noun: ['batata|f', 'macarrão|m', 'picles|m', 'waffle|m', 'pinguim|m', 'lhama|f', 'torrada|f', 'almôndega|f', 'morsa|f', 'coxinha|f', 'duende|m', 'hamster|m'],
    },
    dreamy: {
      adj: ['estrelado/estrelada', 'nublado/nublada', 'enevoado/enevoada', 'aveludado/aveludada', 'lunar', 'pastel', 'flutuante', 'luminoso/luminosa', 'sedoso/sedosa', 'nebuloso/nebulosa', 'dourado/dourada', 'sereno/serena'],
      noun: ['lua|f', 'nuvem|f', 'aurora|f', 'estrela|f', 'cantiga|f', 'horizonte|m', 'pétala|f', 'galáxia|f', 'sussurro|m', 'devaneio|m', 'amanhecer|m', 'campina|f'],
    },
    mystic: {
      adj: ['espectral', 'enigmático/enigmática', 'velado/velada', 'fantasma', 'obsidiana', 'crepuscular', 'assombrado/assombrada', 'oculto/oculta', 'esquecido/esquecida', 'sinistro/sinistra', 'cinzento/cinzenta', 'arcano/arcana'],
      noun: ['corvo|m', 'espectro|m', 'oráculo|m', 'enigma|m', 'cifra|f', 'sombra|f', 'esfinge|f', 'relíquia|f', 'runa|f', 'brasa|f', 'meia-noite|f', 'mistério|m'],
    },
  },

  og: {
    brand: '🏷️ Gerador de nickname',
    kicker: 'Escolha um clima · ganhe um nome',
    title: 'Ache o nickname que é a sua cara',
    desc: 'Fofo, legal, engraçado, sonhador · mistura seu nome · copie com um toque',
  },

  faq: [
    { q: 'Como funciona o gerador de nickname?', a: 'Escolha um clima, digite se quiser seu nome ou algumas letras e toque em criar. A ferramenta junta um substantivo e um adjetivo da lista desse clima e mistura as suas letras, se você colocou alguma.' },
    { q: 'O nickname é mesmo aleatório?', a: 'É sim. As palavras são sorteadas com o gerador aleatório criptográfico do seu navegador (crypto.getRandomValues), então todas as palavras da lista têm a mesma chance. As letras piscando antes do resultado são só efeito visual.' },
    { q: 'Posso colocar meu próprio nome?', a: 'Pode, até 12 caracteres: nome, iniciais ou as letras que quiser. O que você digita é usado só no seu navegador e não é enviado nem salvo.' },
    { q: 'Outra pessoa pode ganhar o mesmo nickname?', a: 'Pode acontecer, porque cada clima tem centenas de combinações. Se um jogo ou serviço disser que o nickname já existe, gere outro ou ligue “Adicionar números”.' },
  ],

  privacy: {
    title: 'Política de privacidade | Gerador de nickname',
    description: 'Política de privacidade do Gerador de nickname: o nome que você digita fica no seu navegador, cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Gerador de nickname (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta ou login. O nome ou as letras que você digita e o clima que escolhe são processados apenas no seu navegador e não são enviados ao nosso servidor. No entanto, algumas informações podem ser coletadas automaticamente durante o uso, conforme descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e o último clima, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Você pode saber mais e alterar suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam apenas totais diários por idioma (visualizações, nicknames criados, avaliações em estrelas). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Em caso de dúvidas sobre esta política de privacidade, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política vale a partir de 5 de outubro de 2026.'],
    ],
    back: '← Voltar ao Gerador de nickname',
  },
};
