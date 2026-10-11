module.exports = {
  metaTitle: 'Guia de sudoku: regras, técnicas e um pouco de história',
  description: 'Como jogar sudoku online: as regras, anotações e dicas, técnicas do single ao X-Wing, o que significam os quatro níveis e uma breve história do famoso passatempo de números.',
  h1: 'Sudoku: como jogar, resolver melhor e curtir cada grade',
  updated: '2026-10-12',
  intro: 'O sudoku é um passatempo de lógica grátis jogado numa grade de 9 por 9. Algumas casas já vêm com um número, e sua tarefa é preencher as outras para que cada linha, cada coluna e cada quadrado de 3 por 3 tenha os números de 1 a 9 uma única vez. Não precisa fazer conta nenhuma, e um sudoku bem feito nunca obriga você a chutar. Neste guia você encontra as regras, os controles no celular e no computador, as técnicas para sair do Fácil e chegar ao Especialista e um pouco da história, que dá a volta ao mundo, desse jogo.',
  sections: [
    {
      h: 'O que é sudoku e como funcionam as regras',
      p: [
        'A grade tem 81 casas, divididas em nove linhas, nove colunas e nove quadrados de três por três. O jogo começa com alguns números dados, geralmente entre vinte e quarenta, que não podem ser alterados. Cada casa vazia precisa receber um número de 1 a 9, e nenhum número pode se repetir na mesma linha, na mesma coluna ou no mesmo quadrado. Quando todas as casas estão preenchidas sem quebrar essa regra, o sudoku está resolvido.',
        'No fundo, os números são só nove símbolos diferentes: dava para jogar com letras ou cores e nada mudaria. Por isso o sudoku é um jogo de encaixar e descartar, não um problema de matemática. Cada grade desta página é criada no seu navegador e conferida por um programa antes de aparecer, então tem exatamente uma solução e pode ser completada só com raciocínio.',
      ],
    },
    {
      h: 'Controles e primeiros passos',
      p: [
        'Escolha um nível e toque em Novo sudoku. Toque numa casa vazia para selecioná-la: a linha, a coluna e o quadrado dela ficam sombreados para você ver o que ela toca, e, se a casa já tiver um número, todas as cópias dele são destacadas na grade. Depois toque num número do teclado abaixo. O numerozinho embaixo de cada tecla mostra quantos ainda faltam, um jeito rápido de achar os números quase completos.',
        'O jogo fica salvo neste navegador a cada jogada. Se você fechar a página, a tela inicial vai oferecer Continuar jogo com o nível e o tempo. O relógio pausa assim que você troca de aba ou de app, e a grade fica coberta até você voltar, então uma interrupção não custa nada.',
      ],
      list: [
        'Notas coloca o teclado no modo lápis: cada número tocado é escrito ou apagado em tamanho pequeno na casa escolhida.',
        'Apagar limpa a casa selecionada, e Desfazer volta uma jogada de cada vez.',
        'Dica preenche uma casa certa para você. São três por jogo, e um sudoku resolvido com dica não entra na comparação de tempos.',
        'Conferir deixa em vermelho os números que não batem com a solução. Com ele desligado, só as repetições diretas numa linha, coluna ou quadrado ganham contorno.',
        'No computador, use as setas para se mover, as teclas de 1 a 9 para preencher, Backspace para apagar, N para as notas e Z para desfazer.',
      ],
    },
    {
      h: 'Técnicas de resolução, do single ao X-Wing',
      p: [
        'Quase todo sudoku começa com singles. Um single nu é uma casa em que a linha, a coluna e o quadrado já descartam oito dos nove números, então só sobra um. O single escondido é o olhar contrário: dentro de uma linha, coluna ou quadrado, só resta uma casa que pode receber determinado número. Passar cada número por três quadrados alinhados é o jeito mais rápido de achá-los, e os sudokus fáceis desta página se resolvem só com essas duas ideias.',
        'Os níveis Médio e Difícil pedem um pouco mais. Com o apontamento, se dentro de um quadrado um número só pode ficar numa linha, esse número não pode aparecer no resto dessa linha. Com o par nu, duas casas do mesmo grupo que só têm os mesmos dois candidatos reservam esses dois números, que você pode tirar do resto do grupo. Os difíceis podem exigir ainda um trio nu ou um X-Wing, quando um número fica preso nas mesmas duas colunas em duas linhas diferentes. Os de nível Especialista têm menos números dados e pedem cadeias de raciocínio mais longas.',
      ],
      list: [
        'Comece a anotar candidatos só quando os singles acabarem. As notas fazem mais diferença nas grades difíceis.',
        'Assim que colocar um número, tire-o das notas da mesma linha, coluna e quadrado. O jogo faz isso por você.',
        'Se travar, veja no teclado quais números têm só uma ou duas cópias faltando e foque neles.',
        'Nunca chute de propósito. Se duas opções parecem possíveis, procure uma terceira casa que decida entre elas.',
      ],
    },
    {
      h: 'Uma breve história do sudoku',
      p: [
        'O passatempo é mais antigo que o nome. Os quadrados latinos, grades em que cada símbolo aparece uma vez por linha e por coluna, foram estudados pelo matemático Leonhard Euler no século XVIII, e jornais franceses da década de 1890 já publicavam passatempos numéricos com regras parecidas. A forma moderna, com os nove quadrados, apareceu em 1979 numa revista de passatempos americana com o nome de Number Place e costuma ser atribuída ao criador de enigmas Howard Garns.',
        'Em 1984, a editora japonesa Nikoli levou o jogo ao Japão e o batizou de sudoku, abreviação de uma frase que quer dizer mais ou menos que cada número precisa ficar sozinho. No Japão ele também é muito chamado de Nanpure, de Number Place. A febre mundial veio em 2004 e 2005, quando jornais britânicos passaram a publicá-lo todos os dias, e desde então o sudoku nunca mais saiu dos jornais, das revistinhas de passatempo e dos celulares.',
      ],
    },
    {
      h: 'Níveis, sudoku do dia e comparações justas',
      p: [
        'Os quatro níveis dependem de duas coisas: quantos números dados sobram e quais técnicas um avaliador embutido precisa usar para resolver a grade. O Fácil deixa muitos números e se resolve só com singles. O Médio tira mais números e permite descartes simples. O Difícil é escolhido para exigir pelo menos uma técnica intermediária, e o Especialista reduz a grade ao mínimo de números dados mantendo uma única solução. O sudoku do dia é gerado a partir da data, um por nível e igual para todo mundo, e muda às 21h no horário de Brasília (meia-noite UTC), perfeito para desafiar um amigo no mesmo jogo.',
        'Quando você resolve um sudoku sem dicas, seu tempo vira o recorde daquele nível, guardado só no seu navegador, e a tela de resultado mostra onde ele fica entre os tempos reais de outros jogadores. Para o nosso servidor vão apenas o nível e um tempo arredondado para baixo em blocos de cinco segundos, nunca o seu nome, e a comparação fica escondida enquanto não houver com o que comparar.',
      ],
    },
  ],
  cta: 'Jogar sudoku agora',
};
