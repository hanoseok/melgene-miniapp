module.exports = {
  metaTitle: 'Contador de palavras: guia para contar caracteres e bytes',
  description: 'Como um contador de palavras conta caracteres com e sem espaços, palavras e bytes, por que o Word e os sites não batem, limites comuns como os 280 caracteres do X e dicas para escrever no tamanho certo.',
  h1: 'Guia do contador de palavras: o que é contado, por que as ferramentas divergem e como caber no limite',
  updated: '2026-10-15',
  intro: 'Limites de tamanho estão em todo lugar: uma redação do Enem com no máximo 30 linhas, uma carta de motivação de 2.000 caracteres com espaços, um post de 280 caracteres, uma meta description que é cortada perto dos 155 caracteres. Um bom contador mostra onde você está enquanto escreve, para você não precisar cortar correndo no último minuto. Este guia explica como usar a ferramenta, como cada número é definido, por que os programas nem sempre concordam, que limites você vai encontrar e como escrever com folga até a meta.',
  sections: [
    {
      h: 'Como usar o contador de palavras',
      p: [
        'Digite direto na caixa ou cole um texto de qualquer lugar. A barra azul-escura no topo mostra os quatro números mais conferidos: caracteres com espaços, caracteres sem espaços, palavras e bytes. Ela continua visível enquanto você rola um rascunho longo. Abaixo, a contagem detalhada mostra também frases, parágrafos, linhas e uma estimativa do tempo de leitura e de fala.',
        'Se você escreve com limite, escolha 500, 1.000 ou 1.500 caracteres, ou digite seu próprio número. Uma barra vai enchendo, fica laranja perto do fim e vermelha quando passa, e diz quantos caracteres faltam ou quantos cortar. O botão “Contar espaços” define se o limite segue o número com ou sem espaços. No fim, “Ver resumo” mostra um resumo pronto para copiar.',
      ],
      list: [
        'Cole ou digite seu texto: os números mudam a cada tecla.',
        'Defina uma meta e escolha se os espaços contam.',
        'Escolha a regra de bytes do seu formulário: UTF-8, UTF-8 + CRLF ou antigo 2 bytes.',
        'Limpe um texto colado com “Limpar espaços” ou “Juntar linhas”; “Desfazer” traz de volta.',
        'Seu rascunho fica salvo só neste navegador e não some ao recarregar.',
      ],
    },
    {
      h: 'Como cada número é definido',
      p: [
        'Caracteres com espaços contam tudo o que o olho vê como um caractere, mais os espaços e as quebras de linha; cada quebra vale 1. Uma letra acentuada como ã, o ç, uma bandeira ou um emoji de família formado por vários códigos contam como um só caractere. Caracteres sem espaços tiram desse total todos os espaços, tabulações e quebras de linha.',
        'As palavras são encontradas pelo separador de palavras que vem no navegador. Uma sequência de letras ou números é uma palavra, e palavras com hífen, como “guarda-chuva”, contam uma vez. As frases terminam em ponto, interrogação ou exclamação, e os parágrafos são separados por uma linha em branco.',
        'O tempo de leitura considera cerca de 238 palavras por minuto lendo em silêncio, a média de um adulto, e o tempo de fala cerca de 150 palavras por minuto, um ritmo tranquilo de apresentação.',
      ],
      list: [
        'UTF-8: 1 byte para letras sem acento, números e espaços, 2 para á, ã, ç, é, 3 para chinês, japonês e coreano, 4 para a maioria dos emojis.',
        'UTF-8 + CRLF: igual, mas cada quebra de linha conta 2 bytes, como num arquivo de texto do Windows.',
        'Antigo 2 bytes: ASCII 1 byte, qualquer outro caractere 2 e a quebra de linha 2 (EUC-KR, Shift_JIS, GBK).',
      ],
    },
    {
      h: 'Por que o Word, o Google Docs e os sites dão totais diferentes',
      p: [
        'Não existe uma regra oficial única, então pequenas diferenças são normais. O Word não conta as marcas de parágrafo como caracteres, enquanto muitos formulários on-line contam as quebras de linha, às vezes como duas. Algumas ferramentas contam cada unidade de código Unicode, e um emoji acaba valendo dois ou mais. Palavras com hífen, números e e-mails também são tratados de jeitos diferentes.',
        'O mais seguro é ler as instruções do formulário, ajustar o contador do mesmo jeito e deixar uma folga de alguns caracteres em vez de cravar o limite. Antes de enviar, cole o texto no campo de verdade e confira o número que o site mostra.',
      ],
    },
    {
      h: 'Limites que você vai encontrar',
      p: [
        'Processos seletivos, bolsas e intercâmbios costumam definir o tamanho em caracteres com espaços, por exemplo 2.000 para uma carta de motivação. Resumos de TCC e artigos costumam ser limitados em palavras. A redação do Enem é medida em linhas, não em caracteres, então use o contador como apoio. Veja sempre se a regra fala de caracteres ou palavras, com ou sem espaços.',
        'Cada rede social tem seu teto, que muda de vez em quando. No X um post comum aceita 280 caracteres, mas caracteres chineses, japoneses e coreanos contam em dobro. Os buscadores costumam mostrar de 150 a 160 caracteres de uma meta description antes de cortar.',
      ],
      list: [
        'X (Twitter): 280 caracteres.',
        'Legenda do Instagram: 2.200 caracteres.',
        'YouTube: título de 100 caracteres, descrição de 5.000.',
        'SMS: 160 caracteres, ou 70 com emoji ou acentos em alguns aparelhos.',
        'Meta description: mire em cerca de 150 a 160 caracteres.',
      ],
    },
    {
      h: 'Dicas para escrever até o limite',
      p: [
        'Escreva primeiro tudo o que quer dizer sem olhar o número e depois corte. Encurtar um rascunho longo quase sempre dá um texto mais firme do que encher um curto. Comece pelo que mais economiza: a frase que repete a pergunta, expressões como “é importante ressaltar que” e advérbios como “realmente” e “muito”. O painel de palavras repetidas ajuda: uma palavra que aparece cinco vezes num texto curto costuma ser repetição, não ênfase.',
      ],
      list: [
        'Mire em 90% a 100% do limite; uma resposta curta demais parece pouco caprichada.',
        'Deixe uma folga de alguns caracteres para formulários que contam quebras de outro jeito.',
        'Depois de colar de um PDF ou e-mail, use “Limpar espaços”.',
        'Para um discurso, leia em voz alta e confira o tempo de fala.',
        'Salve a versão final em outro lugar também: o rascunho só existe neste navegador.',
      ],
    },
  ],
  cta: 'Contar meu texto agora',
};
