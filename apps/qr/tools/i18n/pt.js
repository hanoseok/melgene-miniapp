/* Gerador de QR Code — Português do Brasil (/pt/)
 * O codificador está em qr-core.js; este arquivo traz todos os textos visíveis. Mesma estrutura de chaves de en.js.
 * Manter {bytes} {v} {n} {ratio} {value} como estão.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Gerador de QR Code grátis – Wi-Fi, PNG e SVG',
    description: 'Gerador de QR Code grátis para link, texto, Wi-Fi, e-mail e telefone. Escolha cores, correção de erro e tamanho e baixe em PNG ou SVG. Sem cadastro, tudo no seu navegador.',
    ogTitle: 'Gerador de QR Code 🔳 grátis e privado',
    ogDescription: 'Um QR Code para link, Wi-Fi, e-mail ou telefone em segundos. Nada sai do seu navegador.',
  },
  siteName: 'Gerador de QR Code',
  privacyLink: 'Privacidade',
  fileName: 'qr-code',

  hero: {
    h1Kicker: 'Gerador de QR Code',
    h1Html: 'Digite, <em>escaneie</em><br>e compartilhe',
    hook: 'Link, texto, Wi-Fi, e-mail ou telefone viram QR Code enquanto você digita. Grátis, sem cadastro e feito no seu próprio navegador.',
  },

  ui: {
    typeLabel: 'O que vai no QR Code?',
    types: { link: 'Link', text: 'Texto', wifi: 'Wi-Fi', email: 'E-mail', phone: 'Ligar' },
    link: { label: 'Endereço do site', placeholder: 'exemplo.com.br/cardapio' },
    text: { label: 'Seu texto', placeholder: 'Um recado, um código, uma mensagem curta…' },
    wifi: {
      ssid: 'Nome da rede (SSID)', ssidPh: 'VIVOFIBRA-1234',
      password: 'Senha', passwordPh: 'Senha do Wi-Fi',
      security: 'Segurança',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP (antigo)', nopass: 'Sem senha' },
      hidden: 'Rede oculta',
    },
    email: { to: 'Endereço de e-mail', toPh: 'nome@exemplo.com.br', subject: 'Assunto (opcional)', subjectPh: 'Oi', body: 'Mensagem (opcional)', bodyPh: 'Escreva uma mensagem…' },
    phone: { label: 'Número de telefone', placeholder: '+55 11 91234-5678' },

    previewLabel: 'Prévia do QR Code',
    previewReady: 'Prévia do QR Code, versão {v}',
    emptyPreview: 'Seu QR Code aparece aqui enquanto você digita',
    info: '{bytes} bytes · versão {v} · {n}×{n} módulos',
    encodes: 'Conteúdo: {value}',
    tooLong: 'Grande demais para um QR Code. Encurte ou escolha uma correção menor (L).',
    encodeFail: 'Não deu para criar este QR Code. Tente mudar o texto.',
    warnContrast: 'Contraste baixo ({ratio}:1). A leitura pode falhar: prefira código escuro em fundo claro.',
    warnInverted: 'Código claro em fundo escuro. Alguns apps não leem códigos invertidos.',
    warnQuiet: 'Margem estreita dificulta a leitura. Deixe pelo menos 2 módulos (o padrão é 4).',

    downloadPng: 'Baixar PNG',
    downloadSvg: 'Baixar SVG',
    copyImage: 'Copiar imagem',
    savedPng: 'PNG salvo. Teste uma vez com o celular antes de imprimir.',
    savedSvg: 'SVG salvo. Ótimo para gráfica, nítido em qualquer tamanho.',
    copied: 'Imagem copiada. Cole num documento ou numa conversa.',
    copyFail: 'Aqui não dá para copiar imagens. Use Baixar PNG.',
    saveFail: 'Não foi possível salvar. Tente de novo.',

    options: '🎨 Cores, tamanho e correção',
    colors: 'Cores',
    fg: 'Código',
    bg: 'Fundo',
    resetColors: 'Redefinir',
    ecc: 'Correção de erro',
    eccHint: 'Níveis altos aguentam arranhões e logos, mas deixam o código mais denso. M serve para quase tudo.',
    size: 'Tamanho da imagem',
    margin: 'Zona de silêncio (margem)',
    marginHint: 'A borda vazia em volta do código, em módulos. O padrão é 4.',
    localNote: '🔒 Feito no seu navegador. O que você digita nunca é enviado a um servidor.',
  },

  result: {
    doneTitle: 'Seu QR Code está pronto ✓',
    doneText: 'Teste com a câmera do celular antes de imprimir ou compartilhar. Mude os campos acima quando quiser para criar outro.',
    again: 'Criar outro QR Code',
    shareTitle: 'Gerador de QR Code – grátis e privado',
    shareText: 'Crie um QR Code para link, Wi-Fi ou texto em segundos, direto no navegador 🔳',
  },

  og: {
    brand: '🔳 Gerador de QR Code',
    kicker: 'Link · Wi-Fi · Texto · PNG e SVG',
    title: 'Seu QR Code em segundos',
    desc: 'Grátis, privado, feito no navegador',
  },

  faq: [
    { q: 'O que eu digito é enviado para algum lugar?', a: 'Não. O QR Code é calculado por JavaScript dentro do seu navegador, então links, senhas de Wi-Fi e mensagens nunca chegam a um servidor. Nada é salvo: ao fechar a página, tudo some.' },
    { q: 'O QR Code expira?', a: 'Não. São QR Codes estáticos: o conteúdo fica gravado no próprio desenho, sem redirecionamento nem link de rastreamento no meio. Um código impresso funciona enquanto o link ou a rede existirem.' },
    { q: 'Como funciona o QR Code do Wi-Fi?', a: 'Ele guarda o nome da rede, a senha e o tipo de segurança no formato padrão WIFI:. A câmera do iPhone ou do Android oferece conectar na hora, e as visitas não precisam digitar a senha do roteador.' },
    { q: 'Qual nível de correção escolher?', a: 'M (cerca de 15% de recuperação) serve para quase tudo. Escolha Q ou H para superfícies ásperas, risco de arranhões ou logo no meio. L gera o código menor para conteúdos longos exibidos na tela.' },
    { q: 'PNG ou SVG?', a: 'PNG é uma imagem comum para sites, conversas e documentos. SVG é um arquivo vetorial que fica nítido em qualquer tamanho, ideal para cartazes, panfletos e gráfica.' },
  ],

  privacy: {
    title: 'Política de Privacidade | Gerador de QR Code',
    description: 'Política de Privacidade do Gerador de QR Code: o que você digita fica no navegador, cookies, anúncios e estatísticas.',
    h1: 'Política de Privacidade',
    introHtml: 'O Gerador de QR Code (o "Serviço") respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações coletadas', 'O Serviço funciona sem conta nem login. Os links, textos, dados de Wi-Fi, e-mails e telefones que você digita viram QR Code apenas no seu navegador. Eles não são enviados ao nosso servidor nem armazenados. Algumas informações podem ser coletadas automaticamente durante o uso, como descrito abaixo.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma, exibir anúncios e entender como é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; alguns recursos podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios pelo Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base em visitas anteriores a este e a outros sites. Saiba mais e ajuste suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço podemos usar o Google Analytics (GA4) e contadores próprios que guardam só totais diários por idioma (visualizações, códigos criados, avaliações). O conteúdo dos seus QR Codes nunca faz parte disso e nada disso identifica você.'],
      ['5. Contato', 'Em caso de dúvidas sobre esta política, entre em contato com o responsável pelo site.'],
      ['6. Vigência', 'Esta política vale a partir de 11 de outubro de 2026.'],
    ],
    back: '← Voltar ao Gerador de QR Code',
  },
};
