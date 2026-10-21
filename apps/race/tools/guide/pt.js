module.exports = {
  metaTitle: 'Corrida de animais: guia do sorteio com corrida',
  description: 'Como usar a corrida de animais para escolher um vencedor ou decidir quem paga o café: montar os corredores, por que todo nome tem a mesma chance, ideias para o trabalho e para festas e uma breve história do sorteio.',
  h1: 'Corrida de animais: deixe uma corrida decidir, de forma justa',
  updated: '2026-10-22',
  intro: 'Tem decisão que é pequena demais para discutir e chata demais para tomar sozinho: quem paga a próxima rodada de café, quem apresenta primeiro, quem fica com o último pedaço de pizza. A corrida de animais transforma esse momento num showzinho. Cada pessoa ganha um bichinho na sua própria raia, começa uma contagem regressiva e os bichos disparam rumo à linha de chegada com arrancadas, tropeços e chegadas apertadas. Quando a poeira baixa, você sabe quem chegou em primeiro e quem chegou por último. Este guia explica como usar, por que o resultado é aleatório de verdade, ideias para cada turma e um pouco de história.',
  sections: [
    {
      h: 'Como usar a corrida',
      p: [
        'Primeiro escolha o que a corrida vai decidir. Com “O 1º vence”, o primeiro bicho a cruzar a linha é o vencedor, ótimo para prêmio, escolher um voluntário ou decidir quem começa o jogo. Com “O último paga”, sobra para o corredor mais lento: pagar o café, lavar as xícaras ou cantar a próxima no karaokê.',
        'Depois defina o número de corredores, de 2 a 10, e escreva um nome em cada raia. Se estiver com pressa, pode deixar raias vazias; elas correm com um nome padrão como Jogador 3. Toque em largar: depois de uma contagem de três segundos, a corrida dura uns seis a nove segundos e aparece a ordem de chegada, com medalhas para os três primeiros e a posição decisiva em destaque.',
      ],
      list: [
        'Escolha o modo: o primeiro vence ou o último paga.',
        'Defina quantos corredores e escreva um nome em cada raia.',
        'Toque em largar e acompanhe a contagem e a corrida.',
        'Veja a ordem de chegada e corra de novo com os mesmos nomes ou troque.',
        'Copie um link com os nomes para os amigos fazerem a própria corrida.',
      ],
    },
    {
      h: 'Por que todo nome tem exatamente a mesma chance',
      p: [
        'A corrida parece uma bagunça, mas quem decide o resultado não é a animação. Na hora em que você larga, o app sorteia a ordem de chegada inteira com o gerador aleatório criptográfico do navegador, crypto.getRandomValues. Ele usa amostragem por rejeição para evitar o pequeno viés de uma simples conta de resto, e o embaralhamento de Fisher-Yates, o método padrão para colocar uma lista em ordem aleatória. Toda ordem possível tem a mesma probabilidade.',
        'Só depois o app monta a animação. Cada raia ganha a própria curva de velocidade, com arrancadas e tropeços, ajustada para que os bichos cruzem a linha exatamente na ordem já sorteada. É por isso que a liderança troca várias vezes e a chegada muitas vezes vai para o photochart. O bichinho é só enfeite: aqui o coelho não é mais rápido que a tartaruga, e a raia 1 não tem mais sorte que a raia 10.',
      ],
    },
    {
      h: 'Ideias para o trabalho, festas e sala de aula',
      p: [
        'No trabalho, a corrida resolve numa boa aquelas tarefas que ninguém quer pegar. Também serve para definir a ordem das apresentações ou quem escolhe o almoço da semana. Como todo mundo vê a mesma tela, ninguém pode dizer que foi marmelada, e a contagem regressiva transforma uma decisão chata numa pausa de dez segundos.',
        'Em festas e almoços de família, use para decidir quem começa no jogo de tabuleiro, quem escolhe a próxima música ou quem conta uma piada. Professores podem escolher a ordem das apresentações ou o próximo leitor sem chamar sempre os mesmos alunos.',
      ],
      list: [
        'Rodada de café ou de pão de queijo: o último paga.',
        'Ordem na reunião: uma corrida e vale a ordem de chegada.',
        'Noite de jogos: o vencedor escolhe o próximo jogo.',
        'Sala de aula: o primeiro responde à pergunta do dia.',
        'Tarefas de casa: o último leva o lixo para fora.',
      ],
    },
    {
      h: 'Uma breve história do sorteio e das corridas',
      p: [
        'Desde sempre a gente procura jeitos de deixar a sorte decidir com justiça. Tirar a sorte aparece em textos antigos de muitas culturas, e o palitinho mais curto, o cara ou coroa e o “uni duni tê” continuam firmes. A ideia é sempre a mesma: o resultado não pode depender de quem fala mais alto.',
        'As corridas acrescentam emoção. Os cavalinhos de parque de diversões, os jogos de corrida de tabuleiro e a fábula da lebre e da tartaruga brincam com a graça de assistir a uma disputa incerta. Este app junta as duas tradições: um sorteio justo feito no instante em que você larga e uma corrida que deixa a espera divertida.',
      ],
    },
    {
      h: 'Dicas para uma corrida melhor',
      p: [
        'Combinem o modo e o que está em jogo antes de largar, assim o resultado é aceito sem discussão. Use nomes curtos para caber na raia do celular e deixe a tela onde todo mundo vê, ou compartilhe na chamada de vídeo.',
      ],
      list: [
        'Falem em voz alta o que significa chegar em primeiro ou em último antes da corrida.',
        'Em telas pequenas, use nomes curtos ou apelidos.',
        'Para várias decisões seguidas, corra de novo com os mesmos nomes.',
        'Os últimos resultados ficam no aparelho, dá para ver quem pagou da última vez.',
        'Se a animação incomodar, o ajuste “reduzir movimento” do sistema mostra o resultado na hora.',
      ],
    },
  ],
  cta: 'Começar uma corrida de animais',
};
