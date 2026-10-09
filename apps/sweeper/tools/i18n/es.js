/* Buscaminas — es (see en.js for the key structure; placeholders {t} {n} {pct} {time} {diff} stay as-is) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
    display: "'Audiowide'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Buscaminas – Juego de minas gratis online',
    description: 'Juega al Buscaminas online: descubre todas las casillas seguras, marca las minas con banderas y gana al reloj. Tres niveles y un primer toque siempre seguro.',
    ogTitle: 'Buscaminas 💣 ¿En cuánto tiempo despejas el campo?',
    ogDescription: 'El clásico de lógica en tu navegador: tres tamaños, un primer toque seguro y un tiempo que batir.',
  },
  siteName: 'Buscaminas',
  privacyLink: 'Política de privacidad',
  start: {
    badge: '💣 Clásico de lógica · 3 niveles',
    h1Kicker: 'Buscaminas',
    h1Html: 'Limpia el campo<br>sin <em>minas</em>',
    hook: 'Los números te dicen cuántas minas hay alrededor. Piensa, pon banderas en las casillas peligrosas y despeja el tablero antes de que se acabe el tiempo.',
    how: { reveal: 'Toca para descubrir', flag: 'Mantén para bandera', chord: 'Toca un número' },
    facts: 'Tu primer toque siempre es seguro',
    diffLabel: 'Elige un nivel',
    diffs: { beginner: 'Fácil', intermediate: 'Medio', expert: 'Experto' },
    start: 'Empezar →',
  },
  play: {
    mines: 'Minas',
    time: 'Tiempo',
    digMode: 'Cavar',
    flagMode: 'Bandera',
    boardAria: 'Tablero de Buscaminas. Toca una casilla para descubrirla; mantén pulsado o usa el modo bandera para marcar una mina.',
    paused: 'En pausa · toca para seguir',
    aHidden: 'Casilla oculta',
    aFlag: 'Casilla con bandera',
    aMine: 'Mina',
    aNum: '{n} minas alrededor',
  },
  result: {
    win: '¡Campo despejado!',
    lose: '¡Boom!',
    sec: 's',
    timeLabel: 'Tiempo',
    clearedLabel: 'Descubierto',
    best: 'Mejor: {t}',
    newBest: '¡Nuevo récord!',
    top: 'Top {n} %',
    beat: 'Más rápido que el {pct} % de los jugadores',
    beatAll: 'Más rápido que todos los tiempos hasta ahora',
    others: 'Comparado con {n} tiempos más',
    comparing: 'Comparando con otros jugadores…',
    retry: 'Jugar otra vez',
    shareTitle: 'Buscaminas – ¿puedes despejar el campo?',
    shareWin: 'Despejé el Buscaminas ({diff}) en {time} segundos 💣 ¿Puedes ganarme?',
    shareLose: 'En el Buscaminas ({diff}) descubrí el {pct} % antes del boom 💥 ¿Lo haces mejor?',
  },
  og: { brand: '💣 Buscaminas', defaultKicker: 'Juego de lógica gratis', defaultTitle: '¿Puedes despejar el campo?', defaultDesc: 'Pon banderas · gana al reloj' },
  faq: [
    {
      q: '¿Cómo se juega al Buscaminas?',
      a: 'Toca una casilla para descubrirla. Un número indica cuántas de las ocho casillas vecinas esconden una mina. Deduce dónde están, márcalas con banderas y descubre todas las casillas sin mina para ganar.',
    },
    {
      q: '¿Cómo pongo una bandera en el móvil?',
      a: 'Mantén pulsada una casilla un instante, o cambia el botón Cavar / Bandera sobre el tablero al modo bandera y toca. En el ordenador también sirve el clic derecho o la tecla F sobre la casilla seleccionada.',
    },
    {
      q: '¿Qué pasa al tocar un número?',
      a: 'Si has puesto tantas banderas alrededor de un número como indica, tocarlo descubre de golpe las demás casillas vecinas. Si alguna bandera estaba mal, esa casilla explota, así que compruébalo antes.',
    },
    {
      q: '¿El primer toque es de verdad seguro?',
      a: 'Sí. Las minas se colocan después de tu primer toque y nunca en esa casilla ni en las contiguas, así que siempre se abre algo de espacio. El tiempo empieza con ese toque y se pausa si sales de la pestaña.',
    },
  ],
  privacy: {
    "title": "Política de privacidad | Buscaminas",
    "description": "Política de privacidad de Buscaminas: tiempos anónimos, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "Buscaminas (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Cuando ganas una partida, solo se envían el nivel y tu tiempo (redondeado a medio segundo) a nuestro servidor como recuento anónimo, sin nombre ni identificador personal. Al usar el Servicio puede recopilarse automáticamente cierta información, como se describe a continuación."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y tu récord, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; en ese caso algunas funciones podrían no funcionar como se espera."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Más información y preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, partidas iniciadas y terminadas, valoraciones). Nada de esto te identifica personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes preguntas sobre esta política de privacidad, contacta con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política se aplica desde el 10 de octubre de 2026."
      ]
    ],
    "back": "← Volver a Buscaminas"
  },
};
