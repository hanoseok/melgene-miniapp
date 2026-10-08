module.exports = {
  metaTitle: "Gerador de loteria: guia do acaso e das combinações",
  description: "Como funciona o gerador de loteria, se os números são realmente aleatórios, a matemática das combinações e como usá-lo com responsabilidade, só por diversão.",
  h1: "Gerador de loteria: como os números aleatórios são criados de verdade",
  updated: "2026-10-09",
  intro: "O gerador de loteria sorteia números para o 6/45 coreano, um jogo no estilo Euro, a Powerball dos EUA ou um intervalo à sua escolha, e os faz rolar para fora de uma máquina de sorteio na tela. Foi feito apenas por diversão. Este guia explica como usá-lo, por que seus números são aleatórios em sentido estrito, como é a matemática das combinações de loteria, usos criativos além da loteria e como jogar com responsabilidade.",
  sections: [
    {
      h: "Como o gerador funciona",
      p: [
        "Você começa escolhendo um jogo. O 6/45 coreano sorteia seis números de 1 a 45. O jogo no estilo Euro sorteia cinco números de 1 a 50 mais duas estrelas de 1 a 12. A Powerball dos EUA sorteia cinco números de 1 a 69 mais uma Powerball de 1 a 26. Um jogo personalizado permite definir o maior número, até 100, e quantos números sortear, até dez. Depois você escolhe quantos jogos gerar, de um a cinco.",
        "Antes de sortear, você pode incluir números para manter e números para excluir. Os números mantidos aparecem em todos os jogos e os demais são sorteados ao redor deles; os números excluídos nunca aparecem. Essas duas configurações valem só para os números principais, não para as estrelas nem para a Powerball. Quando você aperta o botão de sorteio, os números são escolhidos primeiro, depois as bolas giram na máquina e saem rolando uma a uma, e por fim cada jogo é mostrado em ordem crescente. As cores das bolas seguem as conhecidas faixas coreanas, e um botão de copiar coloca o resultado na área de transferência."
      ],
      list: [
        "Escolha o 6/45 coreano, o estilo Euro, a Powerball dos EUA ou um intervalo personalizado.",
        "Escolha quantos jogos sortear, de 1 a 5.",
        "Se quiser, informe números para manter e para excluir, separados por vírgulas.",
        "Aperte o botão de sorteio e veja as bolas rolarem.",
        "Copie os números, sorteie de novo ou volte às configurações."
      ]
    },
    {
      h: "Os números são mesmo aleatórios?",
      p: [
        "O gerador usa a fonte aleatória criptográfica do seu navegador, o mesmo tipo de aleatoriedade usado para criar chaves de segurança. Sortear um número inteiro de um intervalo parece fácil, mas um método descuidado pode favorecer alguns números. Por exemplo, se você pega um valor aleatório grande e usa o resto da divisão por 45, os restos menores saem um pouco mais vezes. Para evitar isso, a ferramenta descarta os poucos valores aleatórios que causariam o desequilíbrio e tenta de novo, uma técnica chamada amostragem por rejeição.",
        "Os números são então escolhidos sem repetição por um embaralhamento parcial, de modo que, a cada passo, cada número restante tem a mesma chance. A animação das bolas rolando é exibida depois que o resultado já foi decidido e não o influencia. Por isso cada número permitido é igualmente provável, e por isso a ferramenta não pode ser direcionada pelo momento nem por um jeito especial de apertar o botão."
      ]
    },
    {
      h: "A matemática das combinações",
      p: [
        "Uma loteria é um problema de contagem. Em um jogo 6/45 existem 8.145.060 conjuntos diferentes de seis números. Em um jogo 5/50 mais 2/12 há 2.118.760 maneiras de escolher os cinco números principais e 66 maneiras de escolher as duas estrelas, o que dá 139.838.160 combinações no total. Em um jogo 5/69 mais 1/26 há 11.238.513 maneiras de escolher os cinco números e 26 opções para a Powerball, num total de 292.201.338 combinações. Quanto mais combinações existem, menos um único bilhete representa.",
        "Toda combinação é exatamente tão provável quanto qualquer outra, inclusive 1, 2, 3, 4, 5, 6. Resultados passados não mudam sorteios futuros, então não existem números quentes ou frios, e manter ou excluir números não muda nada nas chances. Uma diferença real é quantos outros jogadores escolhem os mesmos números. Muita gente aposta em datas de aniversário, então combinações só de números pequenos provavelmente são divididas com mais frequência se forem premiadas, mas isso diz respeito a dividir um prêmio, não a ganhá-lo."
      ]
    },
    {
      h: "Maneiras de usar o gerador",
      p: [
        "Um seletor aleatório justo e rápido é útil muito além da loteria. O modo personalizado o transforma numa pequena caixa de ferramentas para tudo o que precisa de números sem viés."
      ],
      list: [
        "Sortear números da sorte por diversão, mantendo em cada jogo um número de aniversário ou data especial.",
        "Escolher ganhadores de um sorteio ou brinde numerando os participantes e sorteando um número.",
        "Criar séries de números no estilo bingo ou sortear um número de 1 a 100 para um jogo de festa.",
        "Decidir quem começa sorteando um número de assento ou de equipe.",
        "Ensinar probabilidade em sala de aula comparando muitos sorteios."
      ]
    },
    {
      h: "Jogar com responsabilidade e privacidade",
      p: [
        "Esta ferramenta não é uma operadora de loteria, não pode vender bilhetes e não pode prever nem melhorar suas chances de ganhar. Se você compra bilhetes, trate o custo como gasto com lazer: defina um orçamento de antemão, compre apenas de operadoras autorizadas, respeite as regras de idade mínima de onde mora e pare quando deixar de ser divertido. Se o jogo estiver lhe causando problemas, entre em contato com um serviço de apoio local.",
        "Os números que você digita e os números sorteados são processados no seu navegador e não são enviados ao nosso servidor. Nada sobre os seus jogos é guardado. A página pode lembrar preferências básicas, como o seu idioma. Use o botão de copiar se quiser guardar um resultado."
      ]
    }
  ],
  cta: "Sortear meus números"
};
