/* Contador de palabras — español (es/)
 * La lógica de conteo está en wordcount-core.js; este archivo tiene todos los textos visibles en este idioma.
 * Las claves que terminan en Html se insertan como HTML (solo <br> y <em>); también privacy.sections.
 * Mantén {n} {max} {m} {s} {pct} {chars} {words} tal cual.
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
    title: 'Contador de palabras y caracteres online gratis',
    description: 'Contador de palabras y caracteres gratis: caracteres con y sin espacios, palabras, frases, párrafos, bytes, tiempo de lectura y un límite objetivo. Funciona en tu navegador.',
    ogTitle: 'Contador de palabras 📝 caracteres, palabras y bytes',
    ogDescription: 'Pega tu texto y ve al instante caracteres, palabras, frases, bytes y tiempo de lectura. No se envía nada.',
  },
  siteName: 'Contador de palabras',
  privacyLink: 'Política de privacidad',

  hero: {
    h1Kicker: 'Contador de palabras',
    h1Html: 'Cada carácter contado<br><em>mientras escribes</em>',
    hook: 'Escribe o pega tu texto. Caracteres, palabras y bytes se actualizan al momento, y una barra te avisa cuando llegas al límite.',
  },

  ui: {
    editorLabel: 'Tu texto',
    placeholder: 'Escribe o pega tu texto aquí…',
    bar: { chars: 'Caracteres', noSpaces: 'Sin espacios', words: 'Palabras', bytes: 'Bytes' },
    toolsLabel: 'Herramientas de texto',
    tools: { copy: 'Copiar', tidy: 'Limpiar espacios', join: 'Unir líneas', clear: 'Borrar todo', undo: 'Deshacer' },
    saved: 'Tu borrador se guarda solo en este dispositivo, nunca se sube.',
    copied: 'Texto copiado',
    copyFail: 'No se pudo copiar. Selecciona el texto y cópialo tú.',
    cleared: 'Texto borrado. Toca Deshacer para recuperarlo.',
    tidied: 'Espacios de más y líneas vacías eliminados.',
    joined: 'Saltos de línea eliminados.',
    undone: 'Cambio deshecho.',
    nothing: 'No hay nada que cambiar.',
    limitLabel: 'Longitud objetivo',
    limitOff: 'No',
    limitChip: '{n}',
    limitCustom: 'Otro',
    limitCustomPh: 'p. ej. 280',
    limitCustomAria: 'Longitud objetivo en caracteres',
    limitSpaces: 'Contar espacios',
    limitText: '{n} / {max} caracteres',
    limitLeft: 'quedan {n}',
    limitOver: '{n} por encima del límite',
    statsLabel: 'Conteo detallado',
    stats: {
      chars: 'Caracteres (con espacios)',
      noSpaces: 'Caracteres (sin espacios)',
      words: 'Palabras',
      sentences: 'Frases',
      paragraphs: 'Párrafos',
      lines: 'Líneas',
      reading: 'Tiempo de lectura',
      speaking: 'Tiempo hablando',
      bytes: 'Bytes',
    },
    byteMode: { utf8: 'UTF-8', neis: 'UTF-8 + CRLF', legacy: 'Antiguo 2 bytes' },
    byteHint: {
      utf8: 'UTF-8 estándar: letras sin tilde y espacios 1 byte, á é ñ ü 2, chino, japonés y coreano 3, emoji 4. Un salto de línea es 1 byte.',
      neis: 'UTF-8, pero cada salto de línea cuenta 2 bytes (CR + LF), como en los archivos de texto de Windows.',
      legacy: 'Codificaciones antiguas de 2 bytes (EUC-KR, Shift_JIS, GBK): ASCII 1 byte, cualquier otro carácter 2, salto de línea 2.',
    },
    time: { sec: '{s} s', min: '{m} min', minSec: '{m} min {s} s' },
    timeNote: 'Los tiempos son estimados: unas 238 palabras por minuto leyendo en silencio y 150 hablando.',
    kwLabel: 'Palabras más repetidas',
    kwEmpty: 'Aquí aparecen las palabras que usas dos o más veces. Se omiten las muy comunes como «de» o «que».',
    kwCount: '{n}×',
    finish: 'Ver resumen ✓',
    needText: 'Primero escribe o pega un texto.',
    local: 'Se cuenta en tu dispositivo. Tu texto nunca se envía.',
  },

  result: {
    heading: 'Tu texto de un vistazo',
    limitOk: 'Dentro de tu objetivo de {max} caracteres ({pct} %).',
    limitOver: '{n} caracteres por encima de tu objetivo de {max}.',
    copySummary: 'Copiar resumen',
    summaryCopied: 'Resumen copiado',
    summaryTitle: 'Resumen del contador',
    again: 'Contar otro texto',
    live: 'Resumen listo: {chars} caracteres, {words} palabras.',
    shareTitle: 'Contador de palabras',
    shareText: 'Contador de palabras y caracteres gratis, con bytes y tiempo de lectura. Tu texto se queda en tu dispositivo 📝',
  },

  og: {
    brand: '📝 Contador de palabras',
    kicker: 'Caracteres · palabras · bytes · lectura',
    title: 'Cuenta caracteres y palabras al momento',
    desc: 'Gratis, y tu texto se queda en tu dispositivo',
  },

  faq: [
    { q: '¿Se cuentan los espacios y los saltos de línea?', a: 'Se muestran ambos números. «Con espacios» cuenta también espacios y saltos de línea (1 cada uno). «Sin espacios» quita todos los espacios, tabulaciones y saltos. Con el interruptor «Contar espacios» eliges cuál sigue la barra del objetivo.' },
    { q: '¿Por qué no coincide con Word o Google Docs?', a: 'Cada herramienta tiene sus reglas. Algunas cuentan una palabra con guion como dos, otras un emoji como dos caracteres, y Word ignora los saltos de línea. Aquí un emoji o una letra con tilde vale 1 carácter, las palabras con guion cuentan como 1 y un salto de línea vale 1.' },
    { q: '¿Cómo se cuentan los bytes?', a: 'Elige la regla del formulario que estás llenando. La mayoría de las webs usan UTF-8. UTF-8 + CRLF cuenta cada salto de línea como 2 bytes. Antiguo 2 bytes cuenta ASCII como 1 byte y cualquier otro carácter como 2, como sistemas asiáticos antiguos.' },
    { q: '¿Se guarda o se envía mi texto?', a: 'Nunca sale de tu dispositivo. El borrador queda en el almacenamiento local de este navegador para que sobreviva a una recarga, y «Borrar todo» lo elimina. Tu texto no va en la dirección de la página ni en los enlaces para compartir.' },
  ],

  privacy: {
    title: 'Política de privacidad | Contador de palabras',
    description: 'Política de privacidad del Contador de palabras: tu texto se cuenta y guarda solo en tu navegador; cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Contador de palabras (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recogemos', 'El Servicio funciona sin cuenta ni inicio de sesión. El texto que escribes o pegas se cuenta solo en tu navegador. Nunca se envía a nuestro servidor ni a ningún otro, y nunca se escribe en la dirección de la página ni en los enlaces para compartir. Para conservar tu borrador tras recargar, el texto y tus ajustes se guardan solo en el almacenamiento local del navegador de este dispositivo; «Borrar todo» elimina el borrador guardado, igual que borrar los datos del sitio en tu navegador.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma y ajustes, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; algunas funciones podrían no funcionar como se espera.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios agregados que solo guardan totales diarios por idioma (páginas vistas, usos, valoraciones). Estos contadores nunca incluyen tu texto ni sus cifras y no te identifican.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política, contacta con el responsable del sitio.'],
      ['6. Fecha de vigencia', 'Esta política está vigente desde el 15 de octubre de 2026.'],
    ],
    back: '← Volver al Contador de palabras',
  },
};
