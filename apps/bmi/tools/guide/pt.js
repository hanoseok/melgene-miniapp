module.exports = {
  metaTitle: 'Calcular IMC: fórmula, classificação e limitações',
  description: 'Como calcular o IMC em quilos ou em libras, o que significam as faixas da OMS e as asiáticas, por que o IMC erra com quem treina e como a medida da cintura completa o resultado.',
  h1: 'Calcular IMC: como funciona o índice de massa corporal',
  updated: '2026-10-24',
  intro: 'O índice de massa corporal, ou IMC, é o número que médicos, planos de saúde e apps de academia mais usam para classificar adultos em abaixo do peso, peso normal, sobrepeso e obesidade. Ele só precisa da altura e do peso, por isso é rápido, mas também bem simplificado. Este guia explica como a calculadora funciona, a fórmula, o que cada faixa significa, quando o IMC erra e quais medidas simples dão uma visão mais completa.',
  sections: [
    {
      h: 'Como usar a calculadora de IMC',
      p: [
        'Escolha as unidades (centímetros e quilos, ou pés, polegadas e libras) e digite sua altura e seu peso. Assim que os dois campos estiverem preenchidos, seu IMC aparece com uma casa decimal, um marcador numa escala colorida e o nome da faixa. Logo abaixo você vê o peso ideal para a sua altura e, se estiver fora dele, quanto falta mais ou menos.',
        'Idade e sexo são opcionais. Eles não mudam o número; só acrescentam um aviso quando faz sentido, por exemplo que a calculadora é para adultos ou que depois dos 65 anos um IMC um pouco mais alto costuma ser normal. O botão “Faixas asiáticas” aplica os cortes mais baixos recomendados na Ásia. Tudo é calculado no seu navegador, e nada é enviado ou salvo.',
      ],
      list: [
        'Decimais funcionam com vírgula ou ponto: 70,5 e 70.5 dão no mesmo.',
        'Ao trocar de unidade, os valores já digitados são convertidos.',
        'O resumo junta seu IMC, sua faixa e seu peso ideal num só cartão.',
      ],
    },
    {
      h: 'A fórmula do IMC, passo a passo',
      p: [
        'O IMC é o peso em quilos dividido pela altura em metros ao quadrado. Com 1,70 m e 65 kg: 1,7 × 1,7 = 2,89 e 65 ÷ 2,89 ≈ 22,5. Como a altura vai ao quadrado, poucos centímetros fazem diferença: com os mesmos 65 kg o resultado fica perto de 23,9 com 1,65 m e de 21,2 com 1,75 m.',
        'Em unidades americanas a fórmula é 703 × peso em libras ÷ altura em polegadas ao quadrado. O 703 só converte libras e polegadas em quilos e metros. A calculadora usa as conversões exatas de 2,54 cm por polegada e 0,45359237 kg por libra.',
      ],
      list: [
        'Sistema métrico: IMC = kg ÷ (m × m)',
        'Unidades dos EUA: IMC = 703 × lb ÷ (in × in)',
        'Peso ideal = de 18,5 × m² a 24,9 × m² (OMS)',
      ],
    },
    {
      h: 'O que cada faixa significa',
      p: [
        'A OMS, seguida pelo Ministério da Saúde, divide o IMC adulto em abaixo do peso (menos de 18,5), peso normal (18,5 a 24,9), sobrepeso (25 a 29,9) e obesidade (30 ou mais), que por sua vez se divide em grau I (30 a 34,9), grau II (35 a 39,9) e grau III (40 ou mais). As faixas são as mesmas para mulheres e homens. Elas foram escolhidas porque, em populações grandes, o risco de diabetes tipo 2, pressão alta e doenças do coração aumenta conforme o IMC se afasta da faixa do meio.',
        'Pesquisas feitas na Ásia mostraram que muitas pessoas de origem asiática têm esses riscos com um IMC mais baixo, em parte porque, com o mesmo peso, costumam ter mais gordura, principalmente na barriga. Por isso a OMS para a Ásia-Pacífico marca o sobrepeso a partir de 23 e a obesidade a partir de 25. Cada país ajusta: o Japão fala em obesidade a partir de 25, e a China coloca o sobrepeso em 24 e a obesidade em 28.',
      ],
      list: [
        'Menos de 18,5: abaixo do peso em todas as escalas',
        '18,5 a 24,9: peso normal pela OMS',
        '23 a 24,9: já é sobrepeso na escala da Ásia-Pacífico',
      ],
    },
    {
      h: 'O que o IMC não mostra',
      p: [
        'O IMC só olha o peso total, então não diferencia músculo de gordura nem mostra onde a gordura está. Um jogador de rúgbi ou quem faz musculação pode aparecer com sobrepeso, ou até obesidade, estando bem definido, enquanto um idoso que perdeu massa muscular pode ter IMC normal e gordura demais. Duas pessoas com o mesmo IMC podem ter saúdes bem diferentes.',
        'Ele também não serve para todo mundo. Crianças e adolescentes são avaliados pelas curvas de crescimento por idade e sexo, e o ganho de peso na gravidez segue orientações próprias. Adultos muito altos ou muito baixos e pessoas com retenção de líquido também podem ter resultados enganosos. Encare o IMC como uma primeira referência, não como um veredito.',
      ],
    },
    {
      h: 'Cintura e relação cintura-altura',
      p: [
        'A gordura acumulada na barriga está mais ligada a doenças do coração e do metabolismo do que a gordura em outras partes, e o IMC não enxerga isso. Basta uma fita métrica: meça no meio do caminho entre a última costela e o alto do quadril, depois de soltar o ar normalmente. No Brasil, cintura acima de 80 cm nas mulheres e de 94 cm nos homens já indica risco aumentado.',
        'Também se usa a relação cintura-altura: se ela fica abaixo de 0,5, ou seja, se a cintura mede menos da metade da altura, o risco costuma ser menor. Balanças de bioimpedância e exames de imagem estimam a gordura de forma mais direta, embora aparelhos caseiros errem bastante. Se o IMC e a cintura apontarem para lados diferentes, converse com seu médico.',
      ],
      list: [
        'Cintura ÷ altura abaixo de 0,5: risco geralmente menor',
        'Meça de manhã, em pé, depois de soltar o ar',
        'Use sempre a mesma fita e o mesmo ponto',
      ],
    },
    {
      h: 'Dicas para ler e acompanhar o resultado',
      p: [
        'Pese-se no mesmo horário, de preferência de manhã, porque o peso pode variar um quilo ou mais entre a manhã e a noite. Observe a tendência de algumas semanas em vez de um número isolado, e lembre que a faixa saudável cobre vários quilos por um motivo: não existe um único peso perfeito. Se quiser mudar de peso, mudanças pequenas e constantes no sono, nos exercícios e nas refeições duram mais que uma dieta radical.',
      ],
      list: [
        'Meça a altura sem sapato e pese-se com roupa leve.',
        'Confira a cintura além do IMC.',
        'Fale com um médico antes de mudanças grandes.',
      ],
    },
  ],
  cta: 'Calcular meu IMC agora',
};
