module.exports = {
  metaTitle: 'Guia do QR Code: criar, imprimir e escanear',
  description: 'Como o QR Code funciona, como criar um para link ou Wi-Fi, dicas de impressão sobre tamanho, contraste e correção de erro, a história do QR Code e como escanear com segurança.',
  h1: 'Como criar um QR Code que funciona de primeira',
  updated: '2026-10-11',
  intro: 'O QR Code está em todo lugar: na mesa do restaurante, no ingresso do show, na encomenda e no cartaz. Parece um monte de quadradinhos aleatórios, mas cada um tem uma função. Este guia explica o que um QR Code guarda de verdade, como criar um para um link, uma mensagem ou a sua rede Wi-Fi, como imprimir para ele ser lido de primeira, de onde veio a ideia e como se proteger ao escanear códigos feitos por outras pessoas.',
  sections: [
    {
      h: 'O que é um QR Code',
      p: [
        'QR vem de Quick Response, “resposta rápida”. O QR Code é um código de barras bidimensional: em vez de uma fileira de barras, ele guarda as informações numa grade quadrada de células escuras e claras chamadas módulos. Os três quadrados grandes nos cantos são padrões de localização. Eles mostram para a câmera onde o código está, como está girado e qual o tamanho, por isso dá para escanear de cabeça para baixo ou de lado.',
        'O resto da grade traz os seus dados e mais dados de correção de erro calculados com códigos de Reed-Solomon, a mesma matemática usada em CDs e em sondas espaciais. Graças a essa redundância, o leitor consegue reconstruir o conteúdo mesmo que parte do código esteja suja, rasgada ou coberta. A menor versão, a 1, tem 21 × 21 módulos; a maior, a 40, tem 177 × 177 e guarda quase três mil bytes. Quanto mais longo o conteúdo, maior e mais densa a grade.'
      ]
    },
    {
      h: 'Como criar um QR Code aqui',
      p: [
        'O gerador funciona inteiro no seu navegador. O código é calculado no seu próprio aparelho na hora em que você digita, então nada é enviado, registrado ou armazenado, e não precisa criar conta.'
      ],
      list: [
        'Escolha o que vai no código: um link, um texto, o acesso ao Wi-Fi, um e-mail ou um telefone.',
        'Preencha os campos. Se você digitar um endereço sem https://, ele é adicionado sozinho para o celular abrir como link.',
        'Acompanhe a prévia ao vivo. Abra as opções para mudar cores, correção de erro, tamanho da imagem ou zona de silêncio.',
        'Baixe um PNG para telas e documentos, ou um SVG para gráfica. Nos navegadores compatíveis, dá até para copiar a imagem direto.',
        'Teste o resultado com o seu celular antes de compartilhar ou imprimir.'
      ]
    },
    {
      h: 'QR Code do Wi-Fi para as visitas',
      p: [
        'Com um QR Code do Wi-Fi, as visitas não precisam digitar aquela senha enorme da etiqueta do roteador. Ele guarda o nome da rede, a senha e o tipo de segurança num formato de texto padrão que começa com WIFI:. As câmeras nativas do iPhone e do Android reconhecem esse formato e oferecem conectar com um toque.',
        'Escolha a mesma segurança usada no roteador. Quase todos os roteadores atuais usam WPA2 ou WPA3, e os dois entram em WPA. Escolha “Sem senha” só para redes abertas e marque “Rede oculta” se o roteador não divulga o nome. Caracteres especiais como ponto e vírgula, vírgula, dois-pontos e aspas são tratados automaticamente. Se você trocar a senha do Wi-Fi, crie um código novo, porque o antigo vai parar de funcionar.'
      ]
    },
    {
      h: 'Dicas de impressão: tamanho, contraste e correção',
      p: [
        'A maioria dos problemas de leitura vem da impressão, não do código. Algumas regras simples fazem toda a diferença.'
      ],
      list: [
        'Tamanho: como regra prática, o código deve ter pelo menos um décimo da distância de leitura. Um código lido a 30 cm precisa de uns 3 cm; um cartaz visto a 3 m, de uns 30 cm.',
        'Contraste: código escuro em fundo claro. Preto no branco é o mais seguro. Cores claras, degradês e códigos claros em fundo escuro confundem muitos leitores, por isso o gerador avisa quando o contraste está baixo.',
        'Zona de silêncio: deixe uma borda vazia em volta do código. O padrão pede quatro módulos, e texto ou imagem colados na borda são uma causa comum de falha.',
        'Correção de erro: o nível L recupera cerca de 7% de danos, M 15%, Q 25% e H 30%. M para o dia a dia; Q ou H para adesivos, placas externas ou códigos com um logo pequeno por cima; L quando um texto longo precisa caber num código pequeno na tela.',
        'Tamanho do conteúdo: com o mesmo tamanho de impressão, menos conteúdo significa módulos maiores. Prefira um link curto a um endereço enorme.'
      ]
    },
    {
      h: 'Uma breve história do QR Code',
      p: [
        'O QR Code foi inventado em 1994 por Masahiro Hara e sua equipe na Denso Wave, na época uma divisão da fabricante japonesa de autopeças Denso, do grupo Toyota. As fábricas rastreavam peças com códigos de barras comuns, e os operários precisavam escanear várias etiquetas por caixa, porque cada código guardava só uns vinte caracteres. Hara queria um código que guardasse muito mais dados e fosse lido rapidinho de qualquer direção.',
        'Os quadrados de localização têm uma proporção de preto e branco que quase nunca aparece em textos ou imagens impressas, então o leitor os encontra na hora. A Denso Wave tinha a patente, mas decidiu não cobrá-la, e o formato virou norma internacional ISO em 2000. Quando as câmeras dos celulares passaram a ler QR Code nativamente, ele se espalhou por pagamentos como o Pix, cartões de embarque, cardápios e muito mais. O nome QR Code continua sendo marca registrada da Denso Wave.'
      ]
    },
    {
      h: 'Escaneie com segurança',
      p: [
        'O QR Code é só uma embalagem, e qualquer pessoa pode imprimir um. Golpistas às vezes colam códigos falsos por cima dos verdadeiros em parquímetros, cartazes ou mesas de restaurante para levar as pessoas a páginas de pagamento ou login falsas. Antes de abrir um link, leia o endereço que a câmera mostra e confira se é mesmo do estabelecimento. Desconfie de códigos que pedem dados do cartão, senhas ou instalação de apps, e nunca escaneie um código que chegou numa mensagem inesperada pedindo pressa.',
        'Ao criar os seus códigos, vale a mesma ideia ao contrário: use links que você controla, teste antes de imprimir e, se colocar em local público, confira de vez em quando se ninguém colou um adesivo por cima.'
      ]
    }
  ],
  cta: 'Criar um QR Code agora'
};
