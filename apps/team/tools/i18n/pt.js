/* Sorteador de times — português do Brasil (/pt/)
 * Mesma estrutura de chaves de en.js. Brasil: "time", "você", nomes brasileiros.
 */
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
    title: 'Sorteador de times – Dividir times aleatórios',
    description: 'Sorteador de times online: cole os nomes, escolha quantos times ou quantas pessoas por time e divida o grupo em times equilibrados. Capitães separados e o mesmo resultado num link. Grátis, sem cadastro.',
    ogTitle: 'Sorteador de times 🎲 Dividir times aleatórios',
    ogDescription: 'Cole os nomes, sorteie e tenha times justos em segundos. Compartilhe o resultado exato.',
  },
  siteName: 'Sorteador de times',
  privacyLink: 'Política de privacidade',

  start: {
    badge: '🎲 Chega de briga pra tirar time',
    h1Kicker: 'Sorteador de times',
    h1Html: 'Quem vai cair<br>no <em>seu time</em>?',
    hook: 'Cole os nomes, toque em sortear e deixe a sorte dividir a galera. Sem discussão.',
    facts: 'Até 60 nomes · capitães separados · resultado para compartilhar',
    start: 'Sortear times →',
  },

  input: {
    title: 'Quem vai jogar?',
    namesLabel: 'Nomes',
    namesHint: 'Um por linha ou separados por vírgula. Coloque * antes de um capitão.',
    placeholder: 'Ana\nJoão\n*Maria\nPedro, Júlia, Lucas',
    sample: 'Nomes de exemplo',
    clear: 'Limpar',
    tooMany: 'Só os primeiros {max} nomes são usados.',
    needMore: 'Coloque pelo menos 2 nomes.',
    modeLabel: 'Dividir por',
    modeTeams: 'Número de times',
    modeSize: 'Pessoas por time',
    minus: 'Menos',
    plus: 'Mais',
    previewEq: '{k} times × {size}',
    previewRange: '{k} times × {min}–{max}',
    leaders: 'Capitães (*) em times diferentes',
    leadersCount: 'Capitães marcados: {n}',
    leadersNone: 'Coloque * antes de um nome para marcar um capitão',
    shuffle: 'Sortear os times 🎲',
  },

  result: {
    shuffling: 'Sorteando…',
    title: 'Os times',
    sharedTitle: 'Times compartilhados',
    sharedNote: 'Alguém compartilhou estes times com você.',
    captain: 'Capitão',
    rename: 'Outros nomes de time',
    again: 'Sortear de novo',
    edit: 'Editar nomes',
    copy: 'Copiar como texto',
    copied: 'Times copiados!',
    makeOwn: 'Sortear meus times',
    badShare: 'Esse link não funciona — sorteie seus próprios times aqui.',
    shareTitle: 'Sorteador de times – Dividir times aleatórios',
    shareText: 'Aqui estão os nossos {k} times sorteados 🎲',
  },

  people: { one: '{n} pessoa', other: '{n} pessoas' },

  teams: {
    tiger: 'Os Tigres',
    eagle: 'As Águias',
    shark: 'Os Tubarões',
    wolf: 'Os Lobos',
    fox: 'As Raposas',
    panda: 'Os Pandas',
    lion: 'Os Leões',
    owl: 'As Corujas',
    dolphin: 'Os Golfinhos',
    bear: 'Os Ursos',
    rabbit: 'Os Coelhos',
    penguin: 'Os Pinguins',
    dragon: 'Os Dragões',
    unicorn: 'Os Unicórnios',
    octopus: 'Os Polvos',
    frog: 'Os Sapos',
    koala: 'Os Coalas',
    parrot: 'Os Papagaios',
    bee: 'As Abelhas',
    turtle: 'As Tartarugas',
  },

  sample: ['Ana', 'João', 'Maria', 'Pedro', 'Júlia', 'Lucas', 'Beatriz', 'Gabriel', 'Larissa', 'Rafael', 'Camila', 'Mateus'],

  og: {
    brand: '🎲 Sorteador de times',
    kicker: 'Entram nomes · saem times',
    title: 'Quem vai cair no seu time?',
    desc: 'Times justos em segundos · capitães separados · compartilhe o resultado',
  },

  faq: [
    { q: 'Como divido nomes em times?', a: 'Digite ou cole os nomes, um por linha ou separados por vírgula (até 60). Escolha quantos times você quer ou quantas pessoas por time e toque em sortear. Os times nunca têm diferença de mais de uma pessoa.' },
    { q: 'O sorteio é justo mesmo?', a: 'É. Os nomes são embaralhados com o gerador aleatório criptográfico do seu navegador (crypto.getRandomValues) e o algoritmo de Fisher–Yates, então toda divisão possível tem exatamente a mesma chance. Nem nós nem ninguém consegue mexer no resultado.' },
    { q: 'Como funcionam os capitães?', a: 'Coloque * antes de um nome para marcar um capitão e ligue “Capitães em times diferentes”. Primeiro vai um capitão para cada time, depois todo o resto é sorteado. Se houver mais capitães do que times, alguns times ficam com dois.' },
    { q: 'O que vai no link de compartilhamento?', a: 'O próprio link leva os nomes e os times exatos, então quem abrir vê o mesmo resultado. Nada fica salvo no nosso servidor. Sua última lista fica só neste navegador para você não precisar digitar de novo.' },
  ],

  privacy: {
    title: 'Política de privacidade | Sorteador de times',
    description: 'Política de privacidade do Sorteador de times: os nomes ficam no seu navegador, cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Sorteador de times (o “Serviço”) respeita a sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta nem login. Os nomes que você digita são processados só no seu navegador e não são enviados ao nosso servidor. Se você compartilhar um resultado, os nomes e os times vão dentro do próprio link, então qualquer pessoa com o link pode vê-los. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e sua última lista de nomes, exibir anúncios e entender como o Serviço é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; nesse caso, alguns recursos podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores agregados próprios que guardam só totais diários por idioma (visualizações, sorteios, avaliações). Nada disso identifica você pessoalmente.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política vale a partir de 1º de outubro de 2026.'],
    ],
    back: '← Voltar ao Sorteador de times',
  },
};
