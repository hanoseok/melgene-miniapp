/* Juego 2048 (edición Halloween) — español */
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
    title: 'Juego 2048 – jugar gratis online, edición Halloween',
    description: 'Juega al juego 2048 online en versión Halloween: desliza o usa las flechas, fusiona las fichas con el mismo número y llega al 2048. Gratis y sin descargar nada.',
    ogTitle: 'Juego 2048 🎃 ¿Llegarás al 2048?',
    ogDescription: 'Desliza, fusiona, duplica. Un 2048 de miedo para jugar directo en el navegador.',
  },
  siteName: 'Juego 2048',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🎃 Edición Halloween · puzle',
    h1Kicker: 'Juego 2048',
    h1Html: '¿Llegarás<br>al <em>2048</em>?',
    hook: 'Desliza las fichas. Dos números iguales se juntan y se fusionan en uno — sigue duplicando antes de que se llene el tablero.',
    how: { swipe: 'Desliza para mover', match: 'Junta los iguales', goal: 'Llega al 2048' },
    facts: 'Sin tiempo · desliza o usa las flechas',
    start: 'A jugar →',
  },

  play: {
    score: 'Puntos',
    best: 'Récord',
    boardAria: 'Tablero. Desliza o usa las flechas del teclado para mover las fichas.',
    won: '¡Hiciste 2048!',
    keepGoing: 'Seguir jugando',
    finish: 'Terminar aquí',
    over: '¡No quedan movimientos!',
  },

  result: {
    over: '¡No quedan movimientos!',
    won: '¡Llegaste al 2048!',
    points: 'puntos',
    best: 'Récord: {n}',
    newBest: '¡Nuevo récord!',
    biggest: 'Ficha más grande',
    moves: 'Movimientos',
    top: 'Top {n}%',
    beat: 'Mejor que el {pct}% de los jugadores',
    beatAll: 'Mejor que todas las demás puntuaciones hasta ahora',
    others: 'Comparado con {n} puntuaciones más',
    comparing: 'Comparando con otros jugadores…',
    retry: 'Jugar otra vez',
    shareTitle: 'Juego 2048 – edición Halloween',
    shareText: 'Hice {score} puntos en el juego 2048 🎃 ¿Me superas?',
  },

  og: {
    brand: '🔢 Juego 2048',
    defaultKicker: '2048 de Halloween gratis',
    defaultTitle: '¿Llegarás al 2048?',
    defaultDesc: 'Desliza · fusiona · duplica',
  },

  faq: [
    { q: '¿Cómo se juega al 2048?', a: 'Desliza sobre el tablero (o pulsa las flechas) y todas las fichas se mueven a la vez hacia ese lado. Cuando dos fichas con el mismo número se tocan, se fusionan en una que vale el doble. Después de cada movimiento aparece un 2 o un 4 nuevo.' },
    { q: '¿Cuándo termina la partida?', a: 'No hay límite de tiempo. La partida termina cuando el tablero está lleno y no hay dos fichas vecinas con el mismo número. Si llegas al 2048 puedes parar ahí o seguir para sumar más puntos.' },
    { q: '¿Cómo se calculan los puntos?', a: 'Cada fusión suma el valor de la ficha nueva, así que las fusiones grandes valen más. Tu récord se guarda solo en este navegador.' },
    { q: '¿El top % es real?', a: 'Sí. Al terminar, solo tu puntuación se envía de forma anónima a nuestro servidor y se compara con la de los demás. El top % solo aparece cuando hay puntuaciones reales para comparar; si no, no se muestra nada.' },
  ],

  privacy: {
    title: 'Política de privacidad | Juego 2048',
    description: 'Política de privacidad del juego 2048: puntuaciones anónimas, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'El juego 2048 (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recogemos', 'El Servicio funciona sin cuenta ni inicio de sesión. Al terminar una partida, solo se envía tu puntuación (redondeada a 20 puntos) a nuestro servidor como recuento anónimo, sin nombre ni identificadores personales. Algunos datos pueden recogerse automáticamente durante el uso, como se explica abajo.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y tu récord, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; en ese caso algunas funciones podrían no ir bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, partidas iniciadas y terminadas, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política de privacidad, ponte en contacto con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está en vigor desde el 4 de octubre de 2026.'],
    ],
    back: '← Volver al juego 2048',
  },
};
