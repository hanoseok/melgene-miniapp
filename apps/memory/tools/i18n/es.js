/* Juego de memoria — español */
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
    title: 'Juego de memoria – Voltea cartas de Halloween',
    description: 'Juega gratis al juego de memoria online: voltea las cartas de Halloween de dos en dos y encuentra todas las parejas. Tres niveles, cronómetro y jugadas. Sin descargas.',
    ogTitle: 'Juego de memoria 🎃 ¿Encontrarás todas las parejas?',
    ogDescription: 'Calabazas, fantasmas y murciélagos se esconden bajo las cartas. Voltea dos cada vez y pon a prueba tu memoria.',
  },
  siteName: 'Juego de memoria de Halloween',
  privacyLink: 'Privacidad',
  start: {
    badge: '🎃 Cartas de Halloween',
    h1Kicker: 'Juego de memoria',
    h1Html: 'Voltea las cartas,<br>busca las <em>parejas</em>',
    hook: 'Calabazas, fantasmas y murciélagos se esconden bajo las cartas. Voltea dos cada vez y recuerda bien dónde está cada dibujo.',
    how: 'Voltea dos cartas · mismo dibujo = pareja',
    levelLabel: 'Elige un nivel',
    levels: { easy: 'Fácil', normal: 'Normal', hard: 'Difícil' },
    start: 'Empezar →',
  },
  play: {
    time: 'Tiempo',
    moves: 'Jugadas',
    pairs: 'Parejas',
    boardAria: 'Tablero del juego de memoria. Voltea dos cartas para encontrar una pareja.',
    aDown: 'Carta {n}, boca abajo',
    paused: 'En pausa · toca para seguir',
  },
  result: {
    done: '¡Todas las parejas!',
    sec: 's',
    movesLabel: 'Jugadas',
    accLabel: 'Precisión',
    best: 'Récord: {t}',
    newBest: '¡Nuevo récord!',
    top: 'Top {n} %',
    beat: 'Más rápido que el {pct} % de los jugadores',
    beatAll: 'Más rápido que todos los tiempos hasta ahora',
    others: 'Comparado con {n} tiempos más en este nivel',
    comparing: 'Comparando con otros jugadores…',
    retry: 'Jugar otra vez',
    shareTitle: 'Juego de memoria de Halloween – ¿qué tal tu memoria?',
    shareText: 'Encontré las {pairs} parejas en {time} s y {moves} jugadas 🎃 ¿Me superas?',
  },
  og: {
    brand: '🃏 Juego de memoria',
    defaultKicker: 'Juego de memoria gratis',
    defaultTitle: '¿Encontrarás todas las parejas?',
    defaultDesc: 'Voltea · recuerda · empareja',
  },
  faq: [
    {
      q: '¿Cómo se juega al juego de memoria?',
      a: 'Al principio todas las cartas están boca abajo. Toca una carta y luego otra. Si los dos dibujos son iguales, quedan abiertas como pareja; si no, se dan la vuelta tras un momento. Encuentra todas las parejas para terminar. El reloj empieza con la primera carta.',
    },
    {
      q: '¿Qué cuenta como jugada y cómo se calcula la precisión?',
      a: 'Cada vez que volteas dos cartas es una jugada. La precisión es el número de parejas dividido entre tus jugadas, así que encontrarlas todas sin fallar da un 100 %. Fallar no suma tiempo, pero sí jugadas.',
    },
    {
      q: '¿Qué diferencia hay entre los niveles?',
      a: 'Fácil tiene 12 cartas (6 parejas), Normal 16 cartas (8 parejas) y Difícil 24 cartas (12 parejas). Las cartas y los dibujos se barajan en cada partida, y tu récord se guarda por separado para cada nivel.',
    },
    {
      q: '¿Qué pasa si cambio a otra app?',
      a: 'El reloj se detiene y las cartas se tapan para que nadie haga trampa. Al volver, toca el tablero y la partida sigue donde la dejaste.',
    },
    {
      q: '¿De dónde sale el «Top %»?',
      a: 'Al terminar, tu nivel y tu tiempo redondeado se comparan con los tiempos reales de otros jugadores del mismo nivel. Si todavía no hay otros tiempos, la comparación simplemente no aparece.',
    },
  ],
  privacy: {
    "title": "Política de privacidad | Juego de memoria",
    "description": "Política de privacidad del juego de memoria: tiempos anónimos, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "El juego de memoria de Halloween (el \"Servicio\") respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Al terminar una partida, solo se envían a nuestro servidor tu nivel y tu tiempo (redondeado a la décima de segundo) como un recuento anónimo, sin nombre ni identificador personal. Durante el uso del Servicio se puede recopilar automáticamente cierta información, como se describe a continuación."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y tus récords, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en la configuración del navegador; en ese caso algunas funciones podrían no funcionar como se espera."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar tus preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (páginas vistas, partidas empezadas y terminadas, valoraciones con estrellas). Nada de esto te identifica personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está vigente desde el 16 de octubre de 2026."
      ]
    ],
    "back": "← Volver al juego de memoria"
  },
};
