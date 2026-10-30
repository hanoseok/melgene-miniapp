module.exports = {
  metaTitle: 'Chaveamento de torneio: folgas, cabeças de chave e sorteio',
  description: 'Como funciona um chaveamento mata-mata, o que são folgas e cabeças de chave, como usar em noites de jogos, no trabalho, no esporte ou numa disputa de favoritos, e por que o sorteio aleatório é justo.',
  h1: 'Chaveamento de torneio: mata-mata, folgas e cabeças de chave',
  updated: '2026-10-30',
  intro: 'Um chaveamento é o jeito mais simples de transformar uma lista comprida em um único vencedor. Dois se enfrentam, um avança, e a cada fase o número cai pela metade até sobrar o campeão. Este guia explica como se monta um chaveamento mata-mata, por que alguns participantes ganham folga, o que é cabeça de chave, como usar em noites de jogos, disputas no trabalho, esporte ou numa divertida copa dos favoritos, e por que um sorteio realmente aleatório é o ponto de partida mais justo.',
  sections: [
    {
      h: 'Como funciona o mata-mata',
      p: [
        'No mata-mata cada jogo tem um vencedor e um perdedor, e quem perde está fora. Com 8 participantes, são 4 jogos de quartas de final, 2 semifinais e 1 final. Daí sai uma regra simples: como cada jogo elimina exatamente um, um chaveamento com n participantes sempre precisa de n − 1 jogos para ter campeão. Dezesseis participantes, 15 jogos; 64 participantes, 63.',
        'As fases são contadas a partir do fim: a final tem 2, as semifinais 4, as quartas 8, e antes vêm as oitavas e a fase de 32. Neste app você pode escolher os vencedores você mesmo, dois cartões por vez, ou só sortear as chaves e tocar nos vencedores depois, conforme os jogos de verdade acontecem.',
      ],
      list: [
        'Digite de 2 a 64 nomes ou opções, um por linha.',
        'Escolha sorteio aleatório ou mantenha sua ordem como cabeças de chave.',
        'Escolha vencedores confronto a confronto, ou só sorteie as chaves.',
        'Desfaça uma escolha ou toque no outro nome se mudar de ideia.',
        'Salve o chaveamento em PNG, copie como texto ou compartilhe um link.',
      ],
    },
    {
      h: 'Folgas: quando a conta não fecha',
      p: [
        'Um chaveamento só se divide certinho ao meio quando o número de vagas é uma potência de dois: 2, 4, 8, 16, 32 ou 64. Grupos reais quase nunca são assim. Com 6 jogadores, o chaveamento continua com 8 vagas, então duas ficam vazias. Quem cai contra uma vaga vazia ganha folga e passa para a próxima fase sem jogar.',
        'As folgas precisam ser espalhadas, não amontoadas. Um bom chaveamento nunca coloca duas vagas vazias uma contra a outra e divide as folgas da forma mais igual possível entre a metade de cima e a de baixo, para nenhum lado ter um caminho mais fácil. O app posiciona as folgas pelo esquema clássico de cabeças de chave, que faz exatamente isso, e nunca conta folga como jogo.',
      ],
    },
    {
      h: 'Cabeças de chave: sorteio ou sua própria ordem',
      p: [
        'As cabeças de chave definem onde cada um começa. No esporte, os participantes são ordenados para que os mais fortes se cruzem o mais tarde possível: o cabeça 1 enfrenta primeiro o mais baixo, o 2 vai para a outra metade, e assim por diante. Se você mantiver sua ordem no app, a lista vira a ordem das cabeças de chave: a primeira linha é o cabeça 1, a segunda o 2, e os melhores recebem as folgas primeiro.',
        'Quando ninguém deve ter vantagem, use o sorteio. Ele é perfeito para uma noite com os amigos, uma rifa, uma lista de comidas ou filmes, ou qualquer grupo em que você não quer ser acusado de armar os confrontos.',
      ],
    },
    {
      h: 'Por que o sorteio aleatório é justo',
      p: [
        'Um sorteio só é justo se toda ordem possível tiver a mesma chance. Muitas ferramentas rápidas embaralham com uma aleatoriedade fraca ou com um truque de ordenação que favorece algumas posições sem ninguém perceber. Este app usa o gerador aleatório criptográfico do navegador e o algoritmo de Fisher–Yates com amostragem por rejeição, que remove até o pequeno viés que aparece quando um número aleatório é espremido num intervalo menor. Assim, toda arrumação da sua lista tem exatamente a mesma chance, e ninguém, nem quem está segurando o celular, escolhe quem enfrenta quem.',
        'Ser justo também é ter um chaveamento sempre coerente. Se você troca um vencedor numa fase anterior, todos os resultados seguintes que dependiam daquele jogo são apagados, então um nome nunca aparece numa fase que não alcançou.',
      ],
    },
    {
      h: 'Ideias: noite de jogos, trabalho, esporte e copa dos favoritos',
      p: [
        'Numa noite de jogos, coloque o nome de todo mundo, sorteie as chaves e joguem partidas de verdade de pingue-pongue, videogame ou pedra, papel e tesoura, tocando em cada vencedor. No trabalho, o chaveamento é um jeito leve de votar o almoço da equipe, o nome de um projeto ou a caneca mais bonita da copa. Clubes e ligas pequenas podem sortear uma copa mata-mata, salvar a imagem e postar no grupo.',
        'Na Coreia, esse formato é famoso como a copa do mundo do tipo ideal: você escolhe o favorito entre dois, fase após fase, até sobrar um. Teste com comidas, músicas, destinos de viagem ou qualquer coisa em que você não consegue decidir. A escolha final costuma surpreender, e isso é metade da graça. No fim, compartilhe o link para os amigos verem todo o seu caminho até o campeão.',
      ],
    },
  ],
  cta: 'Montar um chaveamento agora',
};
