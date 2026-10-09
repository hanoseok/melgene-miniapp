module.exports = {
  metaTitle: 'Campo minado: como jogar, dicas e história',
  description: 'Como jogar Campo minado online: ler os números, colocar bandeiras, abrir com um toque, dicas para limpar mais rápido e uma breve história do clássico quebra-cabeça.',
  h1: 'Campo minado: como jogar, ler os números e limpar mais rápido',
  updated: '2026-10-10',
  intro: 'O Campo minado é um quebra-cabeça de lógica gratuito: uma grade de quadrados escondidos, algumas minas e um único objetivo, abrir todos os quadrados que não têm mina. Quando o tabuleiro se abre, não é preciso sorte, apenas ler os números com cuidado. Este guia explica as regras, os controles no celular e no computador, hábitos que aceleram as partidas e um pouco de história.',
  sections: [
    {
      h: 'O que é o Campo minado e como funcionam as regras',
      p: [
        'No começo, todos os quadrados estão cobertos. Ao abrir um, acontece uma de três coisas. Se tiver uma mina, o jogo acaba. Se for seguro e houver minas entre os oito vizinhos, ele mostra um número de 1 a 8 com a quantidade exata. Se for seguro e não houver nenhuma mina ao redor, fica vazio e todos os quadrados vazios conectados se abrem sozinhos, então um único toque pode revelar uma área grande.',
        'Você vence quando todos os quadrados sem mina estão abertos. As bandeiras são só uma anotação para você: não contam para a vitória, mas evitam que você toque num quadrado que já julgou perigoso, e o contador acima do tabuleiro mostra quantas minas ainda estão sem marca. Há três níveis: Fácil (9 × 9, 10 minas), Médio (12 × 12, 24 minas) e Difícil (14 × 14, 40 minas).',
      ],
    },
    {
      h: 'Controles e início rápido',
      p: [
        'O tabuleiro foi feito para os polegares: os quadrados são grandes o bastante para tocar no celular e tudo cabe na tela sem rolar. Seu primeiro toque é sempre seguro. As minas são colocadas depois dele, nunca no quadrado escolhido nem nos vizinhos, então sempre se abre um pequeno espaço com pistas.',
        'O tempo começa com esse primeiro toque. Se você trocar de aba ou de aplicativo, o relógio para e o tabuleiro é coberto até você voltar e tocar.',
      ],
      list: [
        'Toque num quadrado coberto para abri-lo.',
        'Segure um quadrado por um instante para colocar ou tirar uma bandeira, ou mude o botão Abrir / Bandeira acima do tabuleiro para o modo bandeira e toque.',
        'Toque num número aberto: se as bandeiras ao redor forem iguais ao número, todos os outros vizinhos se abrem de uma vez.',
        'No computador, o clique direito coloca uma bandeira; as setas, Enter e a tecla F permitem jogar sem mouse.',
        'O contador mostra minas menos bandeiras. Se ficar abaixo de zero, pelo menos uma bandeira está errada.',
      ],
    },
    {
      h: 'Estratégia: transformar números em certezas',
      p: [
        'Comece pelas deduções mais simples. Um 1 com um único vizinho coberto indica que esse vizinho é mina. Um número que já tem as bandeiras completas torna seguros todos os outros vizinhos cobertos. Essas duas regras resolvem boa parte de um tabuleiro Fácil.',
        'Quando elas acabarem, compare números vizinhos. Se um 1 toca três quadrados cobertos e um 1 ao lado divide dois deles, a mina está no par em comum e o terceiro quadrado do primeiro número é seguro. Enquanto houver uma jogada certa, não adivinhe.',
      ],
      list: [
        'Cantos e bordas têm menos vizinhos, então seus números dão pistas mais fortes.',
        'Coloque a bandeira assim que tiver certeza e abra o resto tocando no número.',
        'Se precisar adivinhar, escolha o quadrado com menor chance de mina e que traga mais informação.',
        'Não se apresse no começo: a velocidade vem de menos erros e menos pausas, não de toques mais rápidos.',
      ],
    },
    {
      h: 'Uma breve história do Campo minado',
      p: [
        'Jogos de desviar de minas escondidas já existiam nos computadores domésticos no início dos anos 1980, como o Mined-Out do ZX Spectrum, em que se atravessava um campo deduzindo as minas pelo número das vizinhas. A versão moderna, com grade e quadrados numerados, se consolidou nos anos seguintes.',
        'Virou hábito mundial quando a Microsoft o incluiu no Windows. Costuma-se dizer que o Paciência ensinou a arrastar e soltar, e o Campo minado ensinou a clicar com precisão e a usar o botão direito. Milhões de pessoas jogam nos intervalos e há comunidades que disputam os tempos mais rápidos.',
      ],
    },
    {
      h: 'Tempos, disputa com amigos e privacidade',
      p: [
        'Ao limpar um tabuleiro você vê seu tempo, e o melhor tempo de cada nível fica salvo apenas no seu navegador. Se outros jogadores terminaram o mesmo nível, uma porcentagem mostra onde seu tempo está; se ainda não há com quem comparar, ela fica oculta. Os números são totais reais.',
        'Para desafiar um amigo, compartilhe seu resultado e combinem o mesmo nível. A disposição é aleatória em cada partida, então a sorte se equilibra em algumas rodadas. Não é preciso conta e, depois de uma vitória, só o nível e um tempo arredondado vão ao servidor, nunca o seu nome.',
      ],
    },
  ],
  cta: 'Jogar Campo minado agora',
};
