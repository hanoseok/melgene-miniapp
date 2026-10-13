/* Juego del 1 al 50 — español */
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
    title: 'Juego del 1 al 50 – Toca los números en orden',
    description: 'Juega al juego del 1 al 50 online: toca los números en orden lo más rápido posible y supera tu mejor tiempo por centésimas. Modo clásico o rápido del 1 al 25. Gratis y sin descargas.',
    ogTitle: 'Juego del 1 al 50 🔢 ¿Cuánto tardas en tocar del 1 al 50?',
    ogDescription: 'Encuentra el siguiente número y tócalo hasta el final. Una prueba rápida de concentración y velocidad.',
  },
  siteName: 'Juego del 1 al 50',
  privacyLink: 'Política de privacidad',
  start: {
    badge: '🔢 Tocar números · velocidad',
    h1Kicker: 'Juego del 1 al 50',
    h1Html: 'Del 1 al 50,<br>¡a toda <em>velocidad</em>!',
    hook: 'Los números están desordenados por la cuadrícula. Encuentra el siguiente, tócalo y sigue hasta el final. Tus ojos tienen que ir más rápido que tus dedos.',
    how: { order: 'Toca en orden desde 1', swap: 'Salen números nuevos', penalty: 'Fallo +0,5 s' },
    facts: 'Cuenta atrás 3-2-1 · tiempo en centésimas',
    modeLabel: 'Elige un modo',
    modes: { classic: 'Clásico', quick: 'Rápido' },
    start: '¡Empezar! →',
  },
  play: {
    next: 'Siguiente',
    time: 'Tiempo',
    progress: 'Hechos',
    go: '¡YA!',
    boardAria: 'Cuadrícula del juego del 1 al 50. Toca los números en orden, empezando por el 1.',
    paused: 'En pausa · toca para seguir',
    aBlank: 'Casilla vacía',
  },
  result: {
    done: '¡Terminado!',
    sec: 's',
    mistakesLabel: 'Fallos',
    perLabel: 'Por número',
    best: 'Mejor: {t}',
    newBest: '¡Nuevo récord!',
    penNote: 'Incluye +{s} s por fallos',
    top: 'Top {n} %',
    beat: 'Más rápido que el {pct} % de los jugadores',
    beatAll: 'Más rápido que todos los demás tiempos',
    others: 'Comparado con otros {n} tiempos',
    comparing: 'Comparando con otros jugadores…',
    retry: 'Jugar otra vez',
    shareTitle: 'Juego del 1 al 50 – ¿qué tan rápido eres?',
    shareText: 'Toqué del 1 al {max} en {time} segundos 🔢 ¿Me ganas?',
  },
  og: {
    brand: '🔢 Juego del 1 al 50',
    defaultKicker: 'Juego de velocidad gratis',
    defaultTitle: '¿Cuánto tardas del 1 al 50?',
    defaultDesc: 'Busca el siguiente número · gana al reloj',
  },
  faq: [
    {
      q: '¿Cómo se juega al juego del 1 al 50?',
      a: 'Tras una cuenta atrás 3-2-1, una cuadrícula de 5×5 muestra los números del 1 al 25 en lugares al azar. Toca el 1, luego el 2, luego el 3 y así. En el modo Clásico cada casilla que tocas muestra un número nuevo del 26 al 50, y sigues hasta el 50.',
    },
    {
      q: '¿Qué pasa si toco el número equivocado?',
      a: 'La casilla tiembla y se suman 0,5 segundos a tu tiempo, así que tocar a lo loco no compensa. Tocar una casilla vacía no hace nada. En el resultado verás cuántos fallos tuviste.',
    },
    {
      q: '¿Qué diferencia hay entre Clásico y Rápido?',
      a: 'El Clásico va del 1 al 50 y es el modo habitual para comparar tiempos. El Rápido termina en el 25 y cada casilla tocada se queda vacía: es un calentamiento corto y funciona como una tabla de Schulte.',
    },
    {
      q: '¿De dónde sale el número «Top %»?',
      a: 'Al terminar, tu modo y tu tiempo redondeado se comparan con los tiempos reales de otros jugadores en el mismo modo. Si todavía no hay tiempos con los que comparar, ese bloque no aparece.',
    },
  ],
  privacy: {
    "title": "Política de privacidad | Juego del 1 al 50",
    "description": "Política de privacidad del Juego del 1 al 50: tiempos anónimos, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "Juego del 1 al 50 (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Cuando terminas una partida, solo se envían el modo y tu tiempo (redondeado a la décima de segundo) a nuestro servidor como recuento anónimo, sin nombre ni identificador personal. Al usar el Servicio puede recopilarse automáticamente cierta información, como se describe a continuación."
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
        "Esta política se aplica desde el 14 de octubre de 2026."
      ]
    ],
    "back": "← Volver al Juego del 1 al 50"
  },
};
