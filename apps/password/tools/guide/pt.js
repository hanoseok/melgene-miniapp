module.exports = {
  metaTitle: 'Gerador de senhas: guia de senhas fortes e frases-senha',
  description: 'Como criar senhas fortes e frases-senha fáceis de lembrar, o que entropia e tempo para quebrar significam de verdade, e por que o gerenciador de senhas e a verificação em duas etapas importam.',
  h1: 'Gerador de senhas: senhas fortes, frases-senha e o que é entropia',
  updated: '2026-10-13',
  intro: 'A maioria das contas invadidas não cai nas mãos de um hacker genial. Tudo começa com uma senha curta, uma senha reaproveitada depois do vazamento de outro site ou um padrão fácil de adivinhar, como nome mais ano de nascimento. Um gerador de senhas assume o que nós humanos fazemos pior: escolher ao acaso. Este guia mostra como usar o gerador, explica o que deixa uma senha forte de verdade, apresenta as frases-senha, traduz os números de entropia e de tempo para quebrar e termina com dois hábitos que importam ainda mais do que a própria senha.',
  sections: [
    {
      h: 'Como usar o gerador de senhas',
      p: [
        'Tudo acontece em uma única tela e no seu próprio aparelho. Escolha Senha ou Frase-senha no topo. Para uma senha, arraste o controle de tamanho entre 4 e 64 caracteres e ligue os tipos que quiser: maiúsculas, minúsculas, números e símbolos. Cada tipo ligado aparece pelo menos uma vez, então os sites com regras de composição ficam satisfeitos. Se um dia você precisar ditar a senha ou digitá-la olhando para uma tela, ligue Sem caracteres parecidos para deixar de fora 0, O, 1, l e I.',
        'Para uma frase-senha, escolha quantas palavras quer (de 3 a 8), o separador e se cada palavra começa com maiúscula e ganha um número. Selecione Só uma ou Cinco de uma vez e toque em Gerar. Cada resultado tem seu próprio botão Copiar, e o medidor logo abaixo mostra a entropia em bits, o nível de força e o tempo estimado para quebrar.',
      ],
      list: [
        'Escolha Senha ou Frase-senha.',
        'Defina o tamanho ou o número de palavras.',
        'Escolha os tipos de caractere, ou o separador e as opções.',
        'Toque em Gerar e copie a que preferir.',
        'Salve direto no seu gerenciador de senhas.',
      ],
    },
    {
      h: 'O que deixa uma senha forte',
      p: [
        'A força depende de quantas possibilidades um atacante teria de testar, não de quão complicada a senha parece. P@ssw0rd! parece bagunçada, mas os programas de quebra testam primeiro palavras comuns com as trocas de sempre, e ela cai em segundos. Uma sequência realmente aleatória é outra história: cada caractere é uma escolha independente, e cada caractere a mais multiplica as possibilidades. Por isso o tamanho vence a esperteza. Passar de 12 para 16 caracteres aleatórios deixa a senha dezenas de milhões de vezes mais difícil de adivinhar.',
        'A outra metade é o acaso. A gente escolhe aniversários, nomes de bichos de estimação, sequências do teclado como qwerty e o mesmo padrão favorito em todo lugar, e os atacantes conhecem todos esses hábitos. O gerador usa a fonte aleatória criptográfica do navegador, crypto.getRandomValues, e uma técnica chamada amostragem por rejeição, para que todo caractere permitido tenha exatamente a mesma chance. Não há padrão para aprender nem viés para explorar.',
        'O terceiro ingrediente é não repetir. Até uma senha perfeita fica fraca quando é reutilizada, porque o vazamento de um site a entrega a atacantes que depois testam em todos os outros. Uma conta, uma senha.',
      ],
    },
    {
      h: 'Frases-senha: fortes e mais fáceis de lembrar',
      p: [
        'Uma frase-senha é um punhado de palavras aleatórias juntas, como uma frase curta e sem sentido. O segredo é que quem escolhe as palavras é o acaso, não você: um trecho de música ou uma citação famosa não têm nada de aleatório. Este gerador sorteia cada palavra de uma lista embutida de 2.048 palavras curtas em inglês, então cada palavra soma exatamente 11 bits de entropia. Cinco palavras dão 55 bits, seis dão 66, e um número aleatório acrescenta mais alguns bits.',
        'As frases-senha brilham nos poucos segredos que você realmente precisa digitar ou decorar: a senha mestra do gerenciador, o login do computador ou o backup do celular. São longas, então são fortes, e feitas de palavras de verdade, então são muito mais fáceis de digitar no teclado do celular do que um amontoado de símbolos. Colocar maiúscula em cada palavra não aumenta a força porque o padrão é previsível, mas ajuda nos sites que exigem uma letra maiúscula.',
      ],
    },
    {
      h: 'Entropia e tempo para quebrar, explicados',
      p: [
        'A entropia, medida em bits, diz entre quantas possibilidades igualmente prováveis a senha foi sorteada. Cada bit dobra esse número: 60 bits são cerca de um quintilhão de possibilidades, e 80 bits, um milhão de vezes mais. O medidor calcula esse valor com exatidão a partir das suas configurações. Nas senhas, conta todas as sequências do tamanho escolhido que têm pelo menos um caractere de cada tipo selecionado; nas frases-senha, multiplica as escolhas de palavras pela posição e pelo valor do número acrescentado.',
        'O tempo para quebrar supõe um ataque offline muito rápido, de 10 bilhões de tentativas por segundo, ritmo ao alcance de uma única placa de vídeo moderna contra um banco de senhas vazado e mal protegido. Em média, o atacante encontra a senha depois de testar metade das possibilidades. A estimativa também supõe que ele sabe exatamente quais configurações você usou, então nunca é otimista demais. De forma geral: abaixo de 45 bits é fraca, de 45 a 60 razoável, de 60 a 80 forte, e 80 ou mais muito forte.',
      ],
      list: [
        'Contas descartáveis ou sem importância: de 45 a 60 bits.',
        'Contas do dia a dia, como compras e redes sociais: de 60 a 80 bits.',
        'E-mail, banco, trabalho e gerenciador de senhas: 80 bits ou mais.',
      ],
    },
    {
      h: 'Gerenciador de senhas e verificação em duas etapas',
      p: [
        'Ninguém consegue lembrar dezenas de senhas aleatórias diferentes, e ninguém deveria tentar. Um gerenciador de senhas guarda tudo em um cofre criptografado, preenche nos sites certos e avisa quando há senhas repetidas ou vazadas. Gere aqui uma senha forte, cole no gerenciador ao criar ou trocar a senha de uma conta e você nunca mais vai precisar olhar para ela. Proteja o próprio gerenciador com uma frase-senha longa que você decora.',
        'A verificação em duas etapas, ou 2FA, acrescenta um segundo passo, como um código de um app autenticador, uma chave de acesso ou uma chave de segurança física. Mesmo que a senha vaze, o atacante não consegue entrar. Ative primeiro no seu e-mail, porque é por ele que a maioria das outras contas é recuperada.',
      ],
      list: [
        'Use uma senha diferente para cada conta.',
        'Guarde as senhas em um gerenciador, não em notas, conversas ou prints.',
        'Ative a 2FA ou as chaves de acesso onde houver, começando pelo e-mail.',
        'Troque a senha na hora se um serviço avisar sobre vazamento.',
        'Nunca mande senha por mensagem ou e-mail e desconfie de links de login que você não esperava.',
      ],
    },
  ],
  cta: 'Gerar uma senha forte agora',
};
