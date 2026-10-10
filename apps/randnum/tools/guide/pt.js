module.exports = {
  metaTitle: 'Gerador de números aleatórios: guia para sorteios justos',
  description: 'Como usar o gerador de números aleatórios em rifas, sorteios no Instagram e na sala de aula, o que aleatório quer dizer de verdade, números aleatórios reais e pseudoaleatórios e como fazer um sorteio justo.',
  h1: 'Gerador de números aleatórios: como usar e como fazer sorteios realmente justos',
  updated: '2026-10-11',
  intro: 'Um gerador de números aleatórios parece a ferramenta mais simples da internet: você digita dois números e recebe um terceiro. Mesmo assim, ele é usado para escolher ganhadores, chamar alunos, sortear números, separar respostas de pesquisa e encerrar discussões, e em todos esses casos o resultado só vale se todo mundo confiar nele. Este guia mostra como usar o gerador, traz ideias para sorteios e para a escola, explica o que aleatório significa de verdade, compara números aleatórios reais e pseudoaleatórios e termina com hábitos simples para um sorteio honesto.',
  sections: [
    {
      h: 'Como usar o gerador de números aleatórios',
      p: [
        'Tudo acontece numa tela só. Digite o menor número em De e o maior em Até, ou toque num intervalo rápido como 1–10, 1–45 ou 1–100. As duas pontas entram no sorteio, então de 1 a 10 pode sair o 1 ou o 10. Números negativos também funcionam, e cada ponta pode ir até um bilhão para qualquer lado.',
        'Depois escolha quantos números sortear, de um a mil. Deixe Com repetição desligado se cada número só puder sair uma vez, como em bilhetes de rifa ou números de cadeira. Ligue Ordenar se preferir ler do menor para o maior. Em Mais opções você pode excluir números como o 13 ou uma sequência inteira como 20-25 e dar um nome ao sorteio. Toque em Sortear e os dígitos giram como num caça-níquel antes de parar no resultado.',
      ],
      list: [
        'Preencha De e Até, ou toque num intervalo rápido.',
        'Escolha quantos números você precisa.',
        'Decida se pode repetir e se quer ordenar.',
        'Se precisar, exclua números e dê nome ao sorteio.',
        'Toque em Sortear e copie os números ou o link do resultado.',
      ],
    },
    {
      h: 'Ideias para sorteios, rifas e sala de aula',
      p: [
        'Quase todo uso se resume a dar um número para cada pessoa ou item e deixar o gerador escolher. Num sorteio no Instagram, numere os comentários válidos pela ordem de chegada, sorteie um número por prêmio sem repetição e publique o link do resultado: seus seguidores veem o sorteio exato, com horário e configurações. Um nome como Sorteio de outubro vai junto no link.',
        'Professores usam números aleatórios para ser justos e dar um pouco de emoção à aula. Se cada aluno tem seu número da chamada, ninguém pode reclamar que sempre sobra para o mesmo.',
      ],
      list: [
        'Rifa: ajuste o intervalo aos bilhetes vendidos e sorteie um ganhador por prêmio.',
        'Sorteio nos comentários: numere as participações válidas, sorteie sem repetir e compartilhe o link.',
        'Sala de aula: escolha quem responde, forme duplas aleatórias ou defina a ordem das apresentações.',
        'Trabalho: a ordem do amigo secreto, quem faz a ata ou um lugar para almoçar de uma lista numerada.',
        'Jogos e estudo: números para treinar contas, uma página para ler ou um dado com quantas faces quiser.',
      ],
    },
    {
      h: 'O que “aleatório” quer dizer de verdade',
      p: [
        'Um sorteio é aleatório quando todo resultado permitido tem a mesma chance e ninguém consegue prever o próximo, nem quem aperta o botão nem quem escreveu o código. Aleatório não quer dizer espalhado por igual em poucas tentativas. Se você sortear algumas vezes de 1 a 10, repetições e sequências são normais: tirar 7 duas vezes seguidas é exatamente tão provável quanto tirar 3 e depois 8.',
        'Pessoas são famosas por imitar mal o acaso. Quando alguém pede um número de 1 a 10, muita gente fala 7 e pouca gente fala 1 ou 10; quando tentamos escrever uma sequência aleatória, evitamos repetições muito mais do que o acaso faria. Por isso o gerador é útil até para decidir quem começa: ele tira os padrões escondidos das nossas escolhas.',
      ],
    },
    {
      h: 'Aleatório real, pseudoaleatório e o gerador criptográfico',
      p: [
        'Computadores seguem instruções, então não conseguem criar aleatoriedade do nada. Um gerador pseudoaleatório parte de um valor chamado semente e usa uma fórmula para produzir uma sequência longa que parece aleatória. Versões simples servem para jogos, mas podem ser previsíveis e esconder padrões sutis. Números aleatórios reais vêm de ruído físico, como o ruído térmico dos componentes ou pequenas variações de tempo do hardware.',
        'Os navegadores modernos oferecem um gerador criptograficamente seguro, o crypto.getRandomValues, e é ele que esta ferramenta usa. O sistema operacional alimenta esse gerador com ruído do hardware, e ele foi feito para que resultados passados não revelem os próximos, por isso também é usado em chaves de segurança. Além disso, a ferramenta evita um erro clássico, o viés do módulo: reduzir um número aleatório grande a um intervalo pequeno com um simples resto dá a alguns números uma chance minúscula a mais. O gerador descarta esses valores excedentes e sorteia de novo, então cada número do intervalo tem exatamente a mesma probabilidade. Nos sorteios sem repetição ele usa um embaralhamento que funciona até com dois bilhões de números possíveis.',
      ],
    },
    {
      h: 'Dicas para um sorteio justo e transparente',
      p: [
        'Uma ferramenta justa é só metade de um sorteio justo. A outra metade é organizar tudo para que ninguém possa duvidar do resultado depois.',
      ],
      list: [
        'Divulgue as regras antes: o intervalo, como as participações são numeradas e quantos ganhadores haverá.',
        'Feche a lista de participantes antes de sortear e guarde quem ficou com cada número.',
        'Sorteie uma vez e fique com o resultado. Sortear de novo até gostar não faz sentido.',
        'Compartilhe o link do resultado: ele guarda números, configurações e horário, então todos veem o sorteio original e não um novo.',
        'Com público, sorteie numa tela compartilhada ou ao vivo para que todos vejam os números pararem.',
        'Exclua só números realmente inválidos, como bilhetes não vendidos, e avise publicamente.',
      ],
    },
  ],
  cta: 'Sortear números agora',
};
