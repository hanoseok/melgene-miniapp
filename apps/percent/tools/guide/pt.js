module.exports = {
  metaTitle: 'Calculadora de porcentagem: fórmulas, descontos e pontos',
  description: 'Como calcular porcentagem na mão: X% de um número, quantos por cento um número é de outro, variação percentual, descontos acumulados, preço original e a diferença entre porcentagem e ponto percentual.',
  h1: 'Calculadora de porcentagem: como resolver qualquer conta',
  updated: '2026-10-22',
  intro: 'A porcentagem está em todo lugar: etiqueta de promoção, holerite, nota de prova, juros, pesquisa eleitoral. Quase tudo se resolve com três fórmulas simples, mas algumas armadilhas pegam quase todo mundo, como somar de volta um desconto ou confundir porcentagem com ponto percentual. Este guia mostra como a calculadora funciona, como fazer as mesmas contas com papel e caneta, onde estão os erros mais comuns e alguns truques de cálculo mental para o dia a dia.',
  sections: [
    {
      h: 'Como usar a calculadora de porcentagem',
      p: [
        'Escolha sua pergunta entre as seis abas lá em cima: a porcentagem de um número, quantos por cento um número é de outro, a variação percentual entre dois valores, um desconto ou aumento, o valor original antes de uma mudança, ou a diferença entre duas taxas em pontos percentuais. Cada aba tem dois campos. Assim que você preenche os dois, a resposta aparece, junto com uma linha mostrando exatamente como foi calculada.',
        'Dá para digitar decimais com vírgula ou ponto: 12,5 e 12.5 funcionam, e separadores de milhar como 1.250 também são entendidos. Os resultados são arredondados para no máximo dez casas decimais, o que esconde os minúsculos erros de arredondamento dos computadores. No fim, abra o resumo para ver todos os resultados desta sessão numa lista só e copiar o que você precisar.',
      ],
      list: [
        'Tudo é calculado no seu navegador; os números digitados não são enviados para lugar nenhum.',
        'O botão de copiar copia o resultado junto com a fórmula.',
        'A aba de desconto tem botões rápidos para 10, 20, 30 e 50 por cento.',
      ],
    },
    {
      h: 'As três fórmulas básicas, na mão',
      p: [
        'Por cento quer dizer “a cada cem”, então 15% é 15 em cada 100, ou 0,15. Com essa ideia, quase toda pergunta vira uma de três fórmulas. Para a porcentagem de um número, multiplique e divida por 100: 15% de 200 é 200 × 15 ÷ 100 = 30. Para saber quantos por cento uma parte representa, divida a parte pelo total e multiplique por 100: 30 de 120 é 30 ÷ 120 × 100 = 25%. Para achar o total a partir de uma parte e da sua porcentagem, divida a parte pela porcentagem e multiplique por 100: se 30 é 25%, o total é 30 ÷ 25 × 100 = 120.',
        'O segredo é sempre perguntar “porcentagem de quê?”. O número que vem depois da palavra “de” é a base, e a base vai no denominador. A maioria dos erros acontece quando a base muda sem você perceber no meio da conta.',
      ],
      list: [
        'Parte = total × porcentagem ÷ 100',
        'Porcentagem = parte ÷ total × 100',
        'Total = parte ÷ porcentagem × 100',
      ],
    },
    {
      h: 'Variação, descontos e a armadilha da conta inversa',
      p: [
        'A variação percentual compara o valor novo com o antigo: (novo − antigo) ÷ antigo × 100. Um preço que vai de 80 para 100 subiu 25%, mas um preço que cai de 100 para 80 caiu só 20%, porque a base é diferente em cada sentido. Essa assimetria explica uma charada famosa: tire 20% de 100 e sobra 80; some 20% de volta e você chega só a 96.',
        'Pelo mesmo motivo, descontos acumulados são menores do que parecem. Mais 20% de desconto sobre um preço que já tinha 30% de desconto não dá 50%: você paga 0,7 × 0,8 = 0,56 do preço, ou seja, 44% de desconto. Para desfazer uma variação percentual é preciso dividir, não subtrair. Se uma blusa sai por R$ 80 depois de 20% de desconto, o preço original era 80 ÷ 0,8 = R$ 100. Se um valor de R$ 110 já inclui 10% de taxa de serviço, o valor sem a taxa é 110 ÷ 1,1 = R$ 100, e não R$ 99. A aba “Valor original” mostra essa divisão e ainda avisa sobre a resposta errada mais tentadora.',
      ],
    },
    {
      h: 'Porcentagem ou ponto percentual?',
      p: [
        'Quando comparamos duas porcentagens, existem duas formas honestas de descrever a diferença, e elas dão números bem diferentes. Se a taxa Selic sobe de 10% para 12%, ela subiu 2 pontos percentuais: é só subtrair uma taxa da outra. Em termos relativos, subiu 20%, porque o aumento de 2 é um quinto dos 10 iniciais. Manchetes e anúncios às vezes escolhem a versão que soa mais impressionante, então vale conferir qual está sendo usada.',
        'Pontos percentuais são a unidade certa para juros, alíquotas de imposto, desemprego, pesquisas e taxas de conversão, ou seja, números que já são porcentagens. A aba “Pontos (p.p.)” mostra os dois números ao mesmo tempo: a diferença em pontos e a variação relativa em porcentagem.',
      ],
    },
    {
      h: 'Exemplos do dia a dia e cálculo mental',
      p: [
        'Nem sempre é preciso calculadora. 10% de um número é esse número com a vírgula andando uma casa para a esquerda: 10% de 64 é 6,4. 5% é a metade disso, e 20% é o dobro. Porcentagens também podem ser trocadas: 8% de 50 é o mesmo que 50% de 8, ou seja, 4. Para uma gorjeta de 15%, calcule 10% e some a metade.',
        'Nas decisões maiores, escreva a fórmula. Compare um aumento de salário com a inflação subtraindo as duas taxas em pontos, confira um preço de promoção multiplicando pela parte que sobra em vez de subtrair duas vezes e, se um empréstimo informa juros ao mês, lembre que doze meses de juros compostos somam mais do que doze vezes essa taxa.',
      ],
      list: [
        '25% de desconto quer dizer pagar 0,75 do preço; 40%, pagar 0,6.',
        'Depois de uma queda de 50%, é preciso subir 100% para voltar ao início.',
        'Dobrar é +100%; cair pela metade é −50%.',
      ],
    },
  ],
  cta: 'Abrir a calculadora de porcentagem',
};
