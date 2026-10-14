/* Contador de palavras — português do Brasil (pt/)
 * A lógica de contagem está em wordcount-core.js; este arquivo tem todos os textos visíveis neste idioma.
 * Chaves terminadas em Html entram como HTML (só <br> e <em>); privacy.sections também.
 * Mantenha {n} {max} {m} {s} {pct} {chars} {words} como estão.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    display: "'Montserrat'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Contador de palavras e caracteres online grátis',
    description: 'Contador de palavras e caracteres grátis: caracteres com e sem espaços, palavras, frases, parágrafos, bytes, tempo de leitura e limite de caracteres. Funciona no seu navegador.',
    ogTitle: 'Contador de palavras 📝 caracteres, palavras, bytes',
    ogDescription: 'Cole seu texto e veja na hora caracteres, palavras, frases, bytes e tempo de leitura. Nada é enviado.',
  },
  siteName: 'Contador de palavras',
  privacyLink: 'Política de privacidade',

  hero: {
    h1Kicker: 'Contador de palavras',
    h1Html: 'Cada caractere contado<br><em>enquanto você digita</em>',
    hook: 'Digite ou cole seu texto. Caracteres, palavras e bytes mudam na hora, e uma barra avisa quando você passa do limite.',
  },

  ui: {
    editorLabel: 'Seu texto',
    placeholder: 'Digite ou cole seu texto aqui…',
    bar: { chars: 'Caracteres', noSpaces: 'Sem espaços', words: 'Palavras', bytes: 'Bytes' },
    toolsLabel: 'Ferramentas de texto',
    tools: { copy: 'Copiar', tidy: 'Limpar espaços', join: 'Juntar linhas', clear: 'Apagar tudo', undo: 'Desfazer' },
    saved: 'Seu rascunho fica salvo só neste aparelho, nunca é enviado.',
    copied: 'Texto copiado',
    copyFail: 'Não deu para copiar. Selecione o texto e copie você mesmo.',
    cleared: 'Texto apagado. Toque em Desfazer para recuperar.',
    tidied: 'Espaços sobrando e linhas vazias removidos.',
    joined: 'Quebras de linha removidas.',
    undone: 'Alteração desfeita.',
    nothing: 'Nada para mudar.',
    limitLabel: 'Tamanho desejado',
    limitOff: 'Não',
    limitChip: '{n}',
    limitCustom: 'Outro',
    limitCustomPh: 'ex.: 280',
    limitCustomAria: 'Tamanho desejado em caracteres',
    limitSpaces: 'Contar espaços',
    limitText: '{n} / {max} caracteres',
    limitLeft: 'faltam {n}',
    limitOver: '{n} acima do limite',
    statsLabel: 'Contagem detalhada',
    stats: {
      chars: 'Caracteres (com espaços)',
      noSpaces: 'Caracteres (sem espaços)',
      words: 'Palavras',
      sentences: 'Frases',
      paragraphs: 'Parágrafos',
      lines: 'Linhas',
      reading: 'Tempo de leitura',
      speaking: 'Tempo de fala',
      bytes: 'Bytes',
    },
    byteMode: { utf8: 'UTF-8', neis: 'UTF-8 + CRLF', legacy: 'Antigo 2 bytes' },
    byteHint: {
      utf8: 'UTF-8 padrão: letras sem acento e espaços 1 byte, á ã ç é 2, chinês, japonês e coreano 3, emoji 4. Uma quebra de linha é 1 byte.',
      neis: 'UTF-8, mas cada quebra de linha conta 2 bytes (CR + LF), como nos arquivos de texto do Windows.',
      legacy: 'Codificações antigas de 2 bytes (EUC-KR, Shift_JIS, GBK): ASCII 1 byte, qualquer outro caractere 2, quebra de linha 2.',
    },
    time: { sec: '{s} s', min: '{m} min', minSec: '{m} min {s} s' },
    timeNote: 'Os tempos são estimativas: cerca de 238 palavras por minuto lendo em silêncio e 150 falando.',
    kwLabel: 'Palavras mais repetidas',
    kwEmpty: 'As palavras que você usa duas ou mais vezes aparecem aqui. As muito comuns, como “de” e “que”, ficam de fora.',
    kwCount: '{n}×',
    finish: 'Ver resumo ✓',
    needText: 'Primeiro digite ou cole um texto.',
    local: 'Contado no seu aparelho. Seu texto nunca é enviado.',
  },

  result: {
    heading: 'Seu texto num relance',
    limitOk: 'Dentro da sua meta de {max} caracteres ({pct}%).',
    limitOver: '{n} caracteres acima da sua meta de {max}.',
    copySummary: 'Copiar resumo',
    summaryCopied: 'Resumo copiado',
    summaryTitle: 'Resumo da contagem',
    again: 'Contar outro texto',
    live: 'Resumo pronto: {chars} caracteres, {words} palavras.',
    shareTitle: 'Contador de palavras',
    shareText: 'Contador de palavras e caracteres grátis, com bytes e tempo de leitura. Seu texto fica no seu aparelho 📝',
  },

  og: {
    brand: '📝 Contador de palavras',
    kicker: 'Caracteres · palavras · bytes · leitura',
    title: 'Conte caracteres e palavras na hora',
    desc: 'Grátis, e seu texto fica no seu aparelho',
  },

  faq: [
    { q: 'Espaços e quebras de linha entram na conta?', a: 'Os dois números aparecem. “Com espaços” conta também espaços e quebras de linha (1 cada). “Sem espaços” tira todos os espaços, tabulações e quebras. O botão “Contar espaços” escolhe qual número a barra da meta segue.' },
    { q: 'Por que o número é diferente do Word ou do Google Docs?', a: 'Cada ferramenta tem suas regras. Algumas contam palavra com hífen como duas, outras contam emoji como dois caracteres, e o Word ignora quebras de linha. Aqui um emoji ou uma letra acentuada vale 1 caractere, palavras com hífen contam como 1 e uma quebra de linha vale 1.' },
    { q: 'Como os bytes são contados?', a: 'Escolha a regra do formulário que você está preenchendo. A maioria dos sites usa UTF-8. UTF-8 + CRLF conta cada quebra de linha como 2 bytes. Antigo 2 bytes conta ASCII como 1 byte e qualquer outro caractere como 2, como sistemas asiáticos antigos.' },
    { q: 'Meu texto é salvo ou enviado?', a: 'Ele nunca sai do seu aparelho. O rascunho fica no armazenamento local deste navegador para sobreviver a um recarregamento, e “Apagar tudo” o remove. Seu texto não vai no endereço da página nem nos links de compartilhamento.' },
  ],

  privacy: {
    title: 'Política de privacidade | Contador de palavras',
    description: 'Política de privacidade do Contador de palavras: seu texto é contado e guardado só no seu navegador; cookies, publicidade e estatísticas.',
    h1: 'Política de privacidade',
    introHtml: 'O Contador de palavras (o “Serviço”) respeita sua privacidade e trata apenas as informações mínimas descritas abaixo.',
    sections: [
      ['1. Informações que coletamos', 'O Serviço funciona sem conta nem login. O texto que você digita ou cola é contado apenas no seu navegador. Ele nunca é enviado ao nosso servidor nem a qualquer outro, e nunca é colocado no endereço da página ou em links de compartilhamento. Para manter seu rascunho depois de recarregar, o texto e suas configurações ficam salvos apenas no armazenamento local do navegador neste aparelho; “Apagar tudo” remove o rascunho salvo, assim como limpar os dados do site no navegador.'],
      ['2. Cookies e tecnologias semelhantes', 'O Serviço pode usar cookies e o armazenamento local do navegador para lembrar seu idioma e configurações, mostrar anúncios e entender como é usado. Você pode recusá-los ou apagá-los nas configurações do navegador; algumas funções podem não funcionar como esperado.'],
      ['3. Publicidade (Google AdSense)', 'O Serviço exibe anúncios do Google AdSense. O Google e seus parceiros podem usar cookies para mostrar anúncios com base nas suas visitas anteriores a este e a outros sites. Saiba mais e altere suas preferências nas <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configurações de anúncios do Google</a>.'],
      ['4. Estatísticas', 'Para melhorar o Serviço, podemos usar o Google Analytics (GA4) e contadores próprios agregados que guardam só totais diários por idioma (visualizações, usos, avaliações). Esses contadores nunca incluem seu texto nem seus números e não identificam você.'],
      ['5. Contato', 'Se tiver dúvidas sobre esta política, entre em contato com o responsável pelo site.'],
      ['6. Data de vigência', 'Esta política vale a partir de 15 de outubro de 2026.'],
    ],
    back: '← Voltar ao Contador de palavras',
  },
};
