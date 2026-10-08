module.exports = {
  "metaTitle": "Jogo 2048: como jogar, estratégia e história",
  "description": "Aprenda a jogar 2048, por que a estratégia do canto funciona, como a pontuação é calculada e de onde veio o jogo. Depois jogue de graça.",
  "h1": "Jogo 2048: como jogar e chegar à peça 2048",
  "updated": "2026-10-09",
  "intro": "O 2048 parece simples: deslizar peças numeradas num tabuleiro quatro por quatro e juntar as iguais. Mesmo assim, tem uma profundidade surpreendente. Este guia explica as regras, a pontuação, as técnicas de estratégia de jogadores experientes e a breve história de um dos quebra-cabeças mais copiados da última década.",
  "sections": [
    {
      "h": "Como jogar",
      "p": [
        "O tabuleiro é uma grade de quatro por quatro com algumas peças numeradas. Deslize o dedo sobre o tabuleiro ou aperte as setas (ou W, A, S, D) e todas as peças deslizam o mais longe possível naquela direção. Quando duas peças com o mesmo número se encontram, elas se fundem numa peça com o dobro do valor: dois 2 viram um 4 e dois 64 viram um 128.",
        "Depois de cada movimento que realmente muda o tabuleiro, surge uma peça nova numa casa vazia. Quase sempre é um 2 e, mais ou menos uma vez em dez, um 4. Se o deslize não mover nada, nenhuma peça é adicionada. Seu objetivo é criar uma peça com o número 2048. Quando conseguir, você pode continuar por uma pontuação maior ou parar ali."
      ],
      "list": [
        "Deslize ou use as teclas para mover todas as peças de uma vez.",
        "Duas vizinhas iguais se fundem numa peça com o dobro do valor.",
        "Um novo 2 ou 4 surge após cada movimento que muda o tabuleiro.",
        "O jogo termina quando o tabuleiro está cheio e nenhuma vizinha combina."
      ]
    },
    {
      "h": "Regras que vale conhecer",
      "p": [
        "Uma peça só pode se fundir uma vez por movimento. Se uma linha tem 2, 2, 2, 2, um deslize produz dois 4, não um 8, e o par mais próximo da parede para a qual você desliza se funde primeiro. Esse detalhe importa quando você planeja uma sequência de fusões.",
        "Não há cronômetro nem desfazer, então cada movimento é definitivo. Sua pontuação sobe pelo valor de cada peça nova criada, de modo que uma fusão que produz um 512 soma 512 pontos. Fusões grandes valem muito mais que as pequenas. Sua melhor pontuação fica salva neste navegador e, quando a partida termina, seu resultado pode ser comparado anonimamente com o de outros jogadores para mostrar uma porcentagem."
      ]
    },
    {
      "h": "Estratégia: mantenha sua maior peça num canto",
      "p": [
        "O hábito mais útil é escolher um canto e manter ali a sua maior peça. Monte uma corrente decrescente ao longo da borda, com a maior no canto, a seguinte ao lado e assim por diante, como uma cobra. Como as peças da corrente têm valores próximos, elas se fundem em sequência em vez de travar.",
        "Escolha duas direções principais, por exemplo para baixo e para a esquerda se o seu canto for o inferior esquerdo. Use uma terceira só quando precisar e tente nunca usar a quarta, pois é o movimento que arrasta a peça grande para fora do canto. Se for obrigado, confira antes se a linha do canto está cheia para a peça não escapar."
      ],
      "list": [
        "Escolha um canto e deixe ali sua maior peça.",
        "Prefira duas direções principais e use a terceira com moderação.",
        "Preencha a linha da sua corrente antes de montar a próxima.",
        "Funda as peças pequenas perto da corrente, não longe dela."
      ]
    },
    {
      "h": "Erros comuns",
      "p": [
        "Iniciantes costumam deslizar nas quatro direções para correr atrás de fusões fáceis. Isso espalha as peças grandes pelo tabuleiro e deixa as pequenas presas entre elas. Outro erro é gastar movimentos em fusões minúsculas enquanto uma peça grande não tem par por perto.",
        "Olhe um ou dois movimentos à frente. Antes de cada deslize, pergunte onde a nova peça pode cair e se o movimento abre ou trava uma linha. Quando o tabuleiro lota, desacelere: um único deslize descuidado pode acabar o jogo, enquanto a paciência pode salvar uma posição bagunçada."
      ]
    },
    {
      "h": "De onde vem o 2048",
      "p": [
        "O 2048 foi criado pelo desenvolvedor italiano Gabriele Cirulli em março de 2014 como projeto de fim de semana. Ele se inspirou em jogos anteriores, como 1024 e Threes, e publicou o código abertamente, o que gerou incontáveis variações e clones. O número 2048 é dois elevado a onze e, em teoria, um tabuleiro quatro por quatro pode chegar a uma peça de 131072.",
        "Esta versão traz um clima de Halloween, mas as regras são as clássicas. Jogue algumas partidas, teste a estratégia do canto e compartilhe sua pontuação com um amigo para ver quem vai mais longe."
      ]
    }
  ],
  "cta": "Jogar 2048 agora"
};
