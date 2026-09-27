/* Jogo da escada — Português do Brasil (/pt/)
 * Termos de busca: "sorteio", "jogo da escada", "amidakuji".
 * page.* é inserido no HTML estático por tools/gen-i18n.js; ui.* é embutido na página para ladder.js.
 */
module.exports = {
  siteName: 'Jogo da escada',
  meta: {
    title: 'Jogo da escada, sorteio online | Melgene Apps',
    description: 'Quem paga o café? Onde vamos almoçar? Quem lava a louça? Este sorteio online grátis (um jogo da escada, também chamado de amidakuji) decide de forma justa em segundos — sem instalar nada, sem cadastro. Compartilhe a mesma escada com um link.',
    ogTitle: 'Jogo da escada — o sorteio justo, grátis em 1 minuto',
    ogDescription: 'Digite nomes e resultados, toque e siga o caminho. Um sorteio online grátis, sem instalação.',
  },
  fontCss: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap', // Jua 에 없는 ã õ ç à è ì ò ù → Fredoka (fr·es 와 같음)
  app: {
    name: 'Jogo da escada',
    currency: 'BRL',
    description: 'Um jogo da escada grátis online (um sorteio) para escolher onde almoçar, quem paga o café, dividir as tarefas de casa ou definir a ordem de jogo. Digite os jogadores e os resultados para gerar uma escada aleatória e justa, e compartilhe exatamente a mesma com um link.',
  },
  setup: {
    badge: '🪜 Grátis online',
    h1Html: 'Não consegue decidir?<br>Deixe o <em>jogo da escada</em> escolher',
    hook: 'Adicione nomes e resultados, e deixe o acaso fazer o resto. Almoço, café, tarefas de casa, ordem de jogo — tudo decidido de forma justa.',
    countLabel: 'Número de jogadores',
    minusAria: 'Menos jogadores',
    plusAria: 'Mais jogadores',
    presetLabel: 'Atalhos rápidos',
    presets: { lunch: '🍕 Almoço', coffee: '☕ Quem paga o café', clean: '🧹 Tarefas de casa', order: '🔢 Ordem de jogo' },
    namesLabel: 'Jogadores',
    resultsLabel: 'Resultados',
    shuffle: '🔀 Embaralhar',
    build: 'Montar a escada →',
  },
  play: {
    edit: '← Editar',
    rebuild: '🔁 Nova escada',
    hint: 'Toque em um jogador para seguir o caminho dele',
    revealAll: 'Revelar tudo',
    finalTitle: 'Resultados finais',
  },
  privacyLink: 'Política de privacidade',

  // FAQ curta e sem spoiler, exibida só na tela final compartilhada (MG_FAQ)
  faq: [
    { q: 'O jogo da escada é mesmo justo?', a: 'Sim. Os degraus são colocados aleatoriamente a cada vez e os caminhos nunca se cruzam, então ninguém pode prever ou manipular o resultado.' },
    { q: 'Posso fazer uma nova escada com os mesmos jogadores?', a: 'Toque em "Nova escada" para manter seus jogadores e resultados, mas gerar uma escada totalmente nova e aleatória.' },
    { q: 'Quantos jogadores podem participar?', a: 'De 2 a 10 jogadores.' },
    { q: 'Funciona no celular?', a: 'Sim. Foi feito para toque, e a escada se ajusta automaticamente a qualquer tamanho de tela.' },
  ],

  ui: {
    defaultName: 'Jogador {n}',
    win: 'Vencedor 🎉',
    lose: 'Não foi',
    coffeeWin: 'Paga o café',
    coffeeLose: 'Escapou',
    order: ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º'],
    pools: {
      lunch: ['Pizza', 'Tacos', 'Hambúrguer', 'Sushi', 'Churrasco', 'Salada', 'Marmita', 'Lanche', 'Feijoada', 'Sanduíche'],
      clean: ['Louça', 'Aspirar', 'Roupa', 'Lixo', 'Banheiro', 'Compras', 'Tirar pó', 'Passar pano', 'Plantas', 'Reciclagem'],
    },
    ariaName: 'Nome do jogador {n}',
    ariaResult: 'Resultado {n}',
    ariaTrace: 'Seguir o caminho de {name}',
    ariaHidden: 'Resultado {n}, ainda não revelado',
    ariaRevealed: '{result} revelado',
    shareTitle: 'Olha esse jogo da escada',
    shareText: 'Eu fiz uma escada — refaça o mesmo caminho e veja onde você cai!',
    retryLabel: 'Nova escada',
  },

  og: {
    badge: '🪜 Grátis online',
    title: 'Jogo da escada',
    tag: 'Almoço, café e tarefas de casa, decididos com justiça',
  },

  privacy: {
    title: 'Política de privacidade | Jogo da escada',
    description: 'Política de privacidade do Jogo da escada — uso de cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Jogo da escada (o "Serviço") respeita sua privacidade e trata apenas as informações mínimas necessárias, conforme descrito abaixo.',
    sections: [
      ['1. Informações que coletamos', 'Você pode usar o Serviço sem se cadastrar ou fazer login. Os nomes e resultados que você digita nunca são armazenados em nossos servidores; eles são processados somente no seu navegador (armazenamento local e o endereço da página). Algumas informações podem ser coletadas automaticamente enquanto você usa o Serviço, conforme descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies para exibir anúncios e entender como o Serviço é usado. Você pode recusar ou excluir cookies nas configurações do seu navegador; algumas funções podem não funcionar corretamente se você fizer isso.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios por meio do Google AdSense. O Google e seus parceiros podem usar cookies para exibir anúncios com base nas suas visitas anteriores a este e a outros sites. Você pode saber mais e alterar suas configurações de personalização de anúncios em <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas (Google Analytics)', 'O Serviço pode usar o Google Analytics (GA4) para entender o número de visitantes e as origens do tráfego a fim de melhorá-lo. Esses dados são usados apenas para fins estatísticos e não identificam você pessoalmente.'],
      ['5. Links de compartilhamento', 'Os links criados com "Compartilhar" contêm os nomes dos jogadores e o texto dos resultados que você digitou, além da estrutura da escada, codificados na URL. Recomendamos não inserir informações que possam identificar alguém pessoalmente.'],
      ['6. Contato', 'Se você tiver dúvidas sobre esta Política de privacidade, entre em contato com o operador do site.'],
      ['7. Data de vigência', 'Esta política está em vigor desde 1º de janeiro de 2026.'],
    ],
    back: '← Voltar ao Jogo da escada',
  },
};
