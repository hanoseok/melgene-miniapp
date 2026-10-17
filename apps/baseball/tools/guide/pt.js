module.exports = {
  metaTitle: 'Touros e vacas: como jogar, dicas e história do jogo',
  description: 'Como jogar Touros e vacas (Bulls and Cows, beisebol de números): as regras, como ler as pistas, dicas de raciocínio e a história do jogo e sua relação com o Mastermind.',
  h1: 'Touros e vacas (beisebol de números): como jogar e como raciocinar',
  updated: '2026-10-18',
  intro: 'Touros e vacas é um jogo clássico de decifrar códigos para um jogador só: um número secreto fica escondido, você dá palpites e cada palpite rende uma pequena pista. Em vários países ele é chamado de beisebol de números, porque as pistas se chamam strike, bola e fora. Este guia explica as regras da versão deste site, como ler as pistas, formas de pensar que deixam o quebra-cabeça mais fácil, de onde o jogo vem e como se divertir com os amigos.',
  sections: [
    {
      h: 'O que é Touros e vacas',
      p: [
        'O computador escolhe um número secreto formado por dígitos diferentes. No nível clássico ele tem 3 dígitos e no mais difícil, 4. Um dígito nunca aparece duas vezes, mas o zero é permitido, até no começo, então 072 é um número secreto perfeitamente válido. Isso dá 720 segredos possíveis com três dígitos e 5.040 com quatro, e todos são igualmente prováveis porque os dígitos são embaralhados de forma justa a cada rodada.',
        'Seu objetivo é descobrir o número com o menor número de palpites. Depois de cada palpite você fica sabendo o quanto chegou perto, mas não quais dígitos estavam certos, e é daí que nasce o desafio. Não há limite de tempo a menos que você ligue o cronômetro, e não existe botão de dica, então o jogo todo é raciocínio cuidadoso.',
      ],
    },
    {
      h: 'Como funciona uma rodada',
      p: [
        'Escolha 3 ou 4 dígitos na tela inicial e toque em Começar. Digite um número do mesmo tamanho no teclado da tela ou no do seu aparelho e toque em Palpitar. O palpite não pode repetir um dígito, e um número que você já tentou não é contado de novo.',
      ],
      list: [
        'Certo (strike) é um dígito correto na posição correta.',
        'Quase (bola) é um dígito que está no número secreto, mas em outra posição.',
        'Nenhum (fora) significa que nenhum dos seus dígitos aparece no número secreto.',
        'Você vence quando todos os dígitos estão certos. O resultado mostra quantas tentativas você precisou.',
        'Se travar, toque em Desistir duas vezes para ver a resposta e começar uma nova rodada. Uma rodada desistida não conta para seus recordes.',
      ],
    },
    {
      h: 'Formas de pensar que ajudam',
      p: [
        'Quem está começando costuma chutar números ao acaso e torcer pela sorte. Um hábito melhor é tratar cada resposta como um pequeno fato e anotar o que ela elimina. Até um caderninho simples, no papel ou na cabeça, faz o jogo parecer muito menos uma questão de sorte.',
      ],
      list: [
        'Some os certos e os quase. Esse total diz quantos dos seus dígitos estão no número secreto, estejam onde estiverem.',
        '“Nenhum” é muito valioso. Ele elimina de uma vez todos os dígitos que você usou, e você não precisa pensar mais neles.',
        'Mude só uma ou duas coisas entre os palpites. Se a pista mudar, você sabe que o dígito trocado é o motivo.',
        'Teste as posições separadamente dos dígitos. Quando souber que um dígito está lá dentro, mude-o de lugar para achar onde ele fica.',
        'Garanta que todo palpite ainda possa ser a resposta. Se contradiz algo que você já sabe, ele não pode vencer e desperdiça uma jogada.',
        'Não se apegue ao primeiro acerto de sorte. Confira se ele combina com todas as pistas anteriores antes de construir em cima dele.',
      ],
    },
    {
      h: 'De onde vem o jogo',
      p: [
        'Touros e vacas é um jogo antigo de papel e lápis, geralmente entre duas pessoas que se revezam como criador do código e adivinhador. Ele é considerado o antecessor do Mastermind, o jogo de tabuleiro com pinos coloridos lançado no início dos anos 1970. Na mesma década, uma versão de computador chamada Moo rodava num computador de grande porte da Universidade de Cambridge, e desde então o jogo é um exercício favorito dos programadores.',
        'A ideia viajou com nomes locais. Na Coreia é o beisebol de números, cujo vocabulário esta página segue; no Japão costuma ser chamado de Hit and Blow, na China de 1A2B, e em línguas como o russo e o espanhol usam-se os nomes de touros e vacas. Computadores mostraram que, jogando com perfeição, qualquer número secreto de quatro dígitos é resolvido em no máximo sete palpites e em um pouco mais de cinco em média, então chegar perto disso é excelente para uma pessoa.',
      ],
    },
    {
      h: 'Jogando com amigos e acompanhando o progresso',
      p: [
        'É fácil transformar o jogo numa disputa amistosa. Combinem o número de dígitos, joguem todos algumas vezes o mesmo nível e comparem quem precisa de menos tentativas. Como nada fica escondido além do número secreto, depois de uma rodada vocês também podem conversar sobre o raciocínio de cada um, um ótimo jeito de aprender macetes novos.',
        'Seu melhor resultado de cada nível fica salvo apenas neste navegador. Quando você resolve uma rodada, seu número de tentativas é comparado com os resultados reais de outros jogadores no mesmo nível, e se ainda não há nada para comparar, a comparação simplesmente não aparece. Tente bater o seu próprio recorde e depois encare o nível de quatro dígitos para um desafio maior.',
      ],
    },
  ],
  cta: 'Jogar Touros e vacas agora',
};
