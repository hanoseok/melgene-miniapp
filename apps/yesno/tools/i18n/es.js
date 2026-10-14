/* Sí o no — español. Misma estructura de claves que en.js (ver comentarios). Tuteo.
 * oracle: 12 respuestas (0-3 positivas · 4-7 neutras · 8-11 negativas), cortas porque van dentro de la bola. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Sí o no – ruleta para decidir online',
    description: '¿No te decides? Escribe tu pregunta y la ruleta del sí o no responde al instante: sí/no, sí/no/quizás, la bola mística o al mejor de 3 y 5. Gratis, justa y sin registro.',
    ogTitle: 'Sí o no 🎱 Pregunta y la bola responde',
    ogDescription: 'Sí, no, quizás o la respuesta de la bola mística. Azar justo para cada pequeño dilema.',
  },
  siteName: 'Sí o no',
  privacyLink: 'Privacidad',

  hero: {
    h1Kicker: 'Sí o no',
    h1Html: 'Pregunta lo que quieras.<br>La bola dice <em>sí</em> o <em>no</em>',
    hook: 'Escribe la pregunta que no te deja en paz, elige un modo y deja que el azar desempate.',
  },

  ui: {
    questionLabel: 'Tu pregunta (opcional)',
    questionPh: 'p. ej. ¿Pedimos tacos esta noche?',
    questionHint: 'Se queda en este dispositivo. Solo va en un enlace si compartes la respuesta.',
    modeLabel: '¿Cómo debe responder la bola?',
    modes: {
      classic: 'Sí / No',
      maybe: 'Sí / No / Quizás',
      oracle: 'Bola mística',
      best3: 'Al mejor de 3',
      best5: 'Al mejor de 5',
    },
    modeHints: {
      classic: 'Un sí o un no directo, 50 y 50.',
      maybe: 'Sí, no o quizás, un tercio cada uno.',
      oracle: 'Una de 12 respuestas de la bola: unas dicen sí, otras no y otras «espera».',
      best3: 'Se lanza hasta que un lado gane dos veces.',
      best5: 'Se lanza hasta que un lado gane tres veces.',
    },
    ask: 'Preguntar a la bola 🔮',
    asking: 'La bola está pensando…',
    fair: 'Azar criptográfico justo · solo por diversión, tú decides',
  },

  answers: { yes: 'SÍ', no: 'NO', maybe: 'QUIZÁS' },
  tones: { positive: 'Tira a sí', neutral: 'Espera y verás', negative: 'Tira a no' },
  oracle: [
    '¡Lánzate!',
    'Las estrellas dicen que sí',
    'Sí, sin arrepentirte',
    'Tu instinto ya lo sabe: sí',
    'Consúltalo con la almohada',
    'Pregúntame mañana',
    'Háblalo y luego decide',
    'La niebla no se ha ido',
    'Esta vez no',
    'Las estrellas dicen que no',
    'Deja pasar esta',
    'Espera un poco más',
  ],

  result: {
    heading: 'La bola dice',
    sharedBadge: '🔗 Respuesta compartida',
    sharedNote: 'Respuesta del {date}. Es la respuesta original guardada en el enlace; abrirlo nunca vuelve a preguntar.',
    noQuestion: 'Sin pregunta escrita',
    bestOf: 'Al mejor de {n}',
    score: '{yes} {a} : {b} {no}',
    flipYes: 'S',
    flipNo: 'N',
    copyLink: 'Compartir respuesta 🔗',
    linkCopied: 'Enlace copiado con tu pregunta y respuesta',
    again: 'Preguntar otra vez',
    askOwn: 'Preguntar yo',
    live: 'Respuesta: {answer}',
    shareTitle: 'Sí o no',
    shareText: 'Le pregunté a la bola del sí o no y dijo: {answer} 🎱',
  },

  tally: {
    title: 'Esta sesión',
    total: 'Respuestas: {n}',
  },

  history: {
    title: 'Respuestas recientes',
    note: 'Tus últimas 10 respuestas, guardadas solo en este dispositivo.',
    clear: 'Borrar',
  },

  errors: {
    badLink: 'Este enlace de respuesta está roto o incompleto, así que no se muestra nada.',
  },

  og: {
    brand: '🎱 Sí o no',
    kicker: 'Sí · No · Quizás · Bola mística',
    title: 'Haz una pregunta, recibe un sí o un no',
    desc: 'Azar justo para cada pequeño dilema',
  },

  faq: [
    { q: '¿Cómo funciona la ruleta del sí o no?', a: 'Escribe una pregunta si quieres, elige un modo y toca «Preguntar a la bola». La respuesta se sortea primero y luego la bola tiembla o las tiradas van saliendo para mostrarla. Sí/No es 50 y 50, Sí/No/Quizás da un tercio a cada uno, la bola mística elige una de 12 respuestas y al mejor de 3 o 5 sigue tirando hasta que un lado tenga mayoría.' },
    { q: '¿La respuesta es realmente aleatoria?', a: 'Sí. Cada respuesta sale del generador aleatorio criptográfico de tu navegador (crypto.getRandomValues) con muestreo por rechazo, así que ninguna respuesta es ni un poquito más probable que otra. La animación solo muestra un resultado ya sorteado.' },
    { q: '¿Tengo que hacer lo que diga?', a: 'Solo si quieres. Es una respuesta al azar para divertirse, no un consejo ni una predicción, así que no la uses para salud, dinero, temas legales o de seguridad. Un truco: fíjate si sientes alivio o decepción cuando aparece la respuesta. Esa sensación suele ser tu respuesta real.' },
    { q: '¿Se guarda o se envía mi pregunta?', a: 'Tu pregunta se queda en tu navegador. Tus últimas 10 respuestas se guardan en este dispositivo para que puedas repasarlas, y puedes borrarlas cuando quieras. La pregunta solo sale de tu dispositivo si tocas «Compartir respuesta», que la mete en el enlace que envías.' },
  ],

  privacy: {
    title: 'Política de privacidad | Sí o no',
    description: 'Política de privacidad de Sí o no: tus preguntas se quedan en tu navegador, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Sí o no (el "Servicio") respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Las preguntas que escribes y las respuestas que obtienes se procesan solo en tu navegador y no se envían a nuestro servidor. Tus últimas 10 respuestas, con la pregunta, se guardan en el almacenamiento local de tu navegador en tu dispositivo, y puedes borrarlas en cualquier momento con el botón Borrar. Cuando tocas "Compartir respuesta", la pregunta y la respuesta se escriben en el propio enlace y solo se comparten con quienes lo reciban.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma y tus respuestas recientes, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en la configuración del navegador; si lo haces, algunas funciones podrían no funcionar como se espera.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y nuestros propios contadores agregados, que solo guardan totales diarios por idioma (páginas vistas, preguntas hechas, valoraciones). Tus preguntas nunca forman parte de esos conteos y nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes dudas sobre esta Política de privacidad, contacta con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está vigente desde el 15 de octubre de 2026.'],
    ],
    back: '← Volver a Sí o no',
  },
};
