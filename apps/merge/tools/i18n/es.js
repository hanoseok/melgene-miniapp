/* Juego de la sandía – Halloween (Suika Game) — español (/es/)
 * Misma estructura de claves que en.js. Reglas, niveles y puntos en merge-core.js. Tuteo.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap',
    display: "'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Juego de la sandía – Halloween (Suika Game) gratis',
    description: 'El juego de la sandía en versión Halloween: suelta dulces en el frasco, fusiona las parejas iguales en algo más grande y llega a la calabaza gigante. Gratis y sin descargas.',
    ogTitle: 'Juego de la sandía – Halloween 🎃 ¿Hasta dónde llegarás?',
    ogDescription: 'Suelta, empareja y fusiona. No pases la línea y descubre hasta dónde llegas.',
  },
  siteName: 'Juego de la sandía – Halloween',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🎃 Halloween · puzle de fusión',
    h1Kicker: 'Juego de la sandía – Halloween',
    h1Html: '¿Hasta dónde llega<br>tu <em>fusión</em>?',
    hook: 'Suelta golosinas en el frasco. Cuando dos iguales se tocan, se fusionan en algo más grande… pero que la pila no pase la línea.',
    how: { aim: 'Apunta y suelta', match: 'Junta dos iguales', line: 'No pases la línea' },
    facts: 'Sin tiempo límite · a tu ritmo',
    start: 'Empezar a fusionar →',
  },

  play: {
    score: 'Puntos',
    best: 'Récord',
    next: 'Sigue',
    nextAria: 'Siguiente pieza: {name}',
    pause: 'Pausa',
    paused: 'En pausa',
    resume: 'Seguir',
    full: '¡Frasco lleno!',
    chainAria: 'Orden de fusión de la pieza más pequeña a la más grande',
    fieldAria: 'Frasco del juego. Mueve o arrastra para apuntar y suelta o haz clic para soltar la pieza. Flechas para apuntar, Espacio para soltar.',
  },

  result: {
    full: '¡El frasco se desbordó!',
    points: 'puntos',
    best: 'Récord: {n}',
    newBest: '¡Nuevo récord!',
    biggest: 'Pieza más grande',
    merges: 'Fusiones',
    top: 'Top {n}%',
    beat: 'Mejor que el {pct}% de los jugadores',
    beatAll: 'Mejor que todas las demás puntuaciones',
    others: 'Comparado con otras {n} puntuaciones',
    comparing: 'Comparando con otros jugadores…',
    retry: 'Jugar otra vez',
    shareTitle: 'Juego de la sandía – Halloween',
    shareText: 'Hice {score} puntos en el juego de la sandía de Halloween 🎃 ¿Me superas?',
  },

  tiers: ['Caramelo de maíz', 'Caramelo', 'Paleta', 'Castaña', 'Manzana', 'Hongo', 'Murciélago', 'Fantasma', 'Bola de cristal', 'Calabaza', 'Calabaza iluminada'],

  og: {
    brand: '🎃 Juego de la sandía – Halloween',
    defaultKicker: 'Juego de fusión de Halloween gratis',
    defaultTitle: '¿Hasta dónde llega tu fusión?',
    defaultDesc: 'Suelta · junta dos iguales · crece',
  },

  faq: [
    { q: '¿Cómo se juega?', a: 'Mueve el dedo o el ratón sobre el frasco para apuntar y suelta (o haz clic) para dejar caer la pieza. También puedes apuntar con las flechas y soltar con Espacio. Cuando dos piezas idénticas se tocan, se fusionan en el tamaño siguiente.' },
    { q: '¿Cuándo se acaba la partida?', a: 'No hay límite de tiempo. La partida termina cuando la pila se queda unos dos segundos por encima de la línea punteada de arriba, así que deja espacio y planea tus fusiones.' },
    { q: '¿Cómo se cuentan los puntos?', a: 'Cada fusión da puntos, y las más grandes dan más. Las reacciones en cadena hacen que la puntuación suba muy rápido.' },
    { q: '¿El top % es real?', a: 'Sí. Al terminar, solo tu puntuación se envía de forma anónima a nuestro servidor y se compara con la de los demás. El top % solo aparece si hay puntuaciones reales para comparar; si no, no se muestra nada. El juego también se pausa solo cuando cambias de pestaña.' },
  ],

  privacy: {
    title: 'Política de privacidad | Juego de la sandía – Halloween',
    description: 'Política de privacidad del juego de la sandía de Halloween: puntuaciones anónimas, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Juego de la sandía – Halloween (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Al terminar una partida, solo tu puntuación (redondeada a la decena) se envía a nuestro servidor como un conteo anónimo, sin nombre ni identificador personal. Parte de la información puede recopilarse automáticamente durante el uso, como se describe abajo.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma y tu récord, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; algunas funciones podrían no funcionar como se espera.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios. Más información y preferencias en <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (visitas, partidas iniciadas y terminadas, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política de privacidad, contacta con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está vigente desde el 2 de octubre de 2026.'],
    ],
    back: '← Volver al juego de la sandía – Halloween',
  },
};
