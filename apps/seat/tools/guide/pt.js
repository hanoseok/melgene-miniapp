module.exports = {
  metaTitle: 'Mapa de sala aleatório: guia, regras e dicas',
  description: 'Como professores usam um mapa de sala aleatório: montar a sala, separar dois alunos, primeiras fileiras e lugares fixos, de quanto em quanto tempo trocar e por que os nomes ficam privados.',
  h1: 'Mapa de sala aleatório: lugares justos para a turma toda',
  updated: '2026-10-13',
  intro: 'Trocar os alunos de lugar é um pequeno ritual do ano letivo, e é surpreendentemente fácil dar errado. Se o professor decide sozinho, alguém sempre se sente perseguido. Se os alunos escolhem, os mesmos amigos se juntam e os mais tímidos ficam nos cantos. Um mapa de sala aleatório resolve as duas coisas: quem decide é a sorte, todo mundo vê que foi a sorte, e o professor continua no controle das poucas regras que realmente importam. Este guia explica a ferramenta, mostra como os professores usam o sorteio de lugares, detalha as regras que dá para incluir e esclarece o que acontece com os nomes digitados.',
  sections: [
    {
      h: 'Como fazer um mapa de sala aleatório',
      p: [
        'Comece pelos nomes. Cole a lista da turma com um nome por linha ou separe os nomes com vírgulas. Se preferir não digitar nomes, coloque só um número, por exemplo 28, e o mapa usará os números de 1 a 28, prático para quem trabalha com o número da chamada. Um mapa aceita até 100 nomes.',
        'Depois, monte a sala. Escolha quantas fileiras de carteiras existem e quantos lugares há em cada fileira. O mapa mostra a sala do ponto de vista dos alunos, com a mesa do professor no alto, então a primeira fileira na tela é a mais perto do quadro. Toque num lugar para riscá-lo quando ele precisar ficar vazio, como um corredor, uma carteira quebrada ou o lugar ao lado da porta. Quando tudo estiver parecido com a sua sala, toque em Sortear e veja os lugares virarem um por um, ou pule a animação se o sinal estiver para tocar.',
      ],
      list: [
        'Cole os nomes ou digite quantos alunos são.',
        'Defina as fileiras e os lugares por fileira.',
        'Toque nos lugares que devem ficar vazios.',
        'Se precisar, inclua regras: separar, primeiras fileiras ou lugares fixos.',
        'Sorteie e depois salve o PNG, copie a tabela de texto ou o link.',
      ],
    },
    {
      h: 'Como os professores usam o sorteio de lugares',
      p: [
        'A maioria troca os lugares num ritmo fixo: todo mês, a cada bimestre ou no começo de uma nova unidade. Um calendário conhecido importa mais do que o intervalo exato, porque o aluno aceita muito melhor um lugar de que não gosta quando sabe que é temporário.',
        'O ideal é sortear na frente da turma. Projete a tela, deixe os lugares virarem um por um e o sorteio vira um pequeno momento coletivo, e não uma decisão contestada. Depois, salve o mapa em PNG para os slides ou para fixar no mural, ou copie como tabela de texto para o grupo da turma no WhatsApp ou para as orientações de um professor substituto.',
      ],
      list: [
        'Início do ano: misturar alunos que ainda não se conhecem.',
        'Trabalho em grupo: sortear os lugares e juntar as carteiras vizinhas em equipes.',
        'Provas: evitar que amigos sentem lado a lado.',
        'Substituição: deixar um mapa impresso para o colega saber o nome de cada um.',
      ],
    },
    {
      h: 'Regras: separar, primeiras fileiras e lugares fixos',
      p: [
        'O acaso puro é justo, mas uma sala de aula tem necessidades reais. Em Regras de lugar você pode incluir duplas para separar; esses dois alunos nunca vão sentar lado a lado, nem na diagonal. Você pode colocar alunos na lista das primeiras fileiras para que fiquem sempre nas duas primeiras, o que ajuda quem usa óculos, ouve pouco ou precisa de concentração, sem expor ninguém. E você pode fixar um nome num lugar específico, por exemplo para um aluno que precisa ficar perto da porta ou ao lado do profissional de apoio.',
        'Use as regras com moderação. Cada regra tira um pouco de acaso e, numa sala cheia, regras demais podem tornar qualquer mapa impossível. Quando isso acontece, a ferramenta avisa em vez de quebrar uma regra em silêncio e sugere tirar uma dupla ou um lugar fixo, ou adicionar lugares. Um bom hábito é manter só as regras que você explicaria para a turma.',
      ],
    },
    {
      h: 'Por que o sorteio é justo',
      p: [
        'Cada mapa é sorteado com o gerador aleatório criptográfico do seu navegador, o mesmo tipo de acaso usado em chaves de segurança. A ferramenta usa amostragem por rejeição para evitar vieses minúsculos ao transformar bits aleatórios em números de lugar e depois um embaralhamento Fisher–Yates, que dá a mesma chance a cada arrumação possível. Quando há duplas para separar, ela sorteia mapas completos de novo até sair um que cumpra todas as regras, então todos os mapas válidos continuam igualmente prováveis. Só em salas muito apertadas ela passa para uma busca cuidadosa até achar um mapa que funcione.',
        'O mapa já está decidido antes de a animação começar. Os lugares que viram só mostram um resultado definido, então tocar em Pular não muda quem senta onde.',
      ],
    },
    {
      h: 'Compartilhar o mapa e proteger os nomes',
      p: [
        'Os nomes digitados nunca saem do seu navegador. Não há conta e nada é enviado para um servidor. A última lista e o layout da sala ficam lembrados só no seu aparelho para a próxima vez, e o botão Limpar apaga tudo.',
        'Quando você copia o link, os nomes e a disposição exata são gravados no próprio link. Quem abrir vê o mesmo mapa, marcado como compartilhado, sem novo sorteio: prático para mandar a um colega ou para a coordenação. Como os nomes viajam dentro do link, evite publicar links com nomes completos em lugares públicos. Primeiro nome, iniciais ou números costumam bastar.',
      ],
    },
  ],
  cta: 'Fazer um mapa de sala aleatório',
};
