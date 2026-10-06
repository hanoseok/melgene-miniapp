/* Generador de lotería — es. 키 구조는 en.js 와 같다. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual'
  },
  meta: {
    title: 'Generador de lotería: números aleatorios',
    description: '¿Buscas números de la suerte? Elige el 6/45 coreano, un 5/50 + 2 estrellas al estilo Euro, el Powerball de EE. UU. o tu propio rango, fija o descarta números y saca hasta cinco apuestas. Solo por diversión, sin registro.',
    ogTitle: 'Generador de lotería 🎱 Números aleatorios',
    ogDescription: 'Saca números de la suerte por diversión, hasta cinco apuestas a la vez.'
  },
  siteName: 'Generador de lotería',
  privacyLink: 'Privacidad',
  start: {
    badge: '🎱 Solo por diversión',
    h1Kicker: 'Generador de lotería',
    h1Html: '¿Hoy tienes <em>suerte</em>?<br>Saca tus números',
    hook: 'Elige un juego, fija o descarta algunos números y mira cómo ruedan las bolas. Hasta cinco apuestas de una vez.',
    facts: 'Corea · estilo Euro · Powerball · personalizado · solo entretenimiento',
    start: 'Sacar números →'
  },
  tool: {
    title: 'Prepara tu sorteo',
    presetLabel: '¿Qué juego?',
    presets: {
      kr: 'Corea 6/45',
      euro: 'Estilo Euro 5/50 + 2',
      us: 'Powerball EE. UU.',
      custom: 'Personalizado'
    },
    presetInfo: {
      kr: '6 números del 1 al 45',
      euro: '5 números del 1 al 50 + 2 estrellas del 1 al 12',
      us: '5 números del 1 al 69 + 1 Powerball del 1 al 26',
      custom: 'Elige cuántos números y el más alto'
    },
    pickLabel: 'Números a sacar',
    maxLabel: 'Número más alto',
    gamesLabel: '¿Cuántas apuestas?',
    fixedLabel: 'Números a mantener (opcional)',
    fixedHint: 'Siempre incluidos en cada apuesta, por ejemplo 7, 21',
    fixedPh: '7, 21',
    excludeLabel: 'Números a descartar (opcional)',
    excludeHint: 'Nunca saldrán, por ejemplo 4, 13',
    excludePh: '4, 13',
    draw: 'Sacar las bolas 🎱',
    drawing: 'Sacando…',
    machine: 'Las bolas giran en la máquina del sorteo',
    note: 'Solo por entretenimiento. Todas las combinaciones son igual de probables y esta herramienta no puede predecir ni mejorar tus probabilidades de ganar.',
    errors: {
      bad: 'Usa números enteros del 1 al {max}, separados por comas.',
      overlap: 'Un número no puede estar a la vez mantenido y descartado.',
      tooMany: 'Puedes mantener como máximo {pick} números.',
      notEnough: 'Hay demasiados números descartados para sacar {pick}.'
    }
  },
  result: {
    title: 'Tus números de la suerte',
    game: 'Apuesta {n}',
    extraNames: {
      euro: 'Estrellas',
      us: 'Powerball'
    },
    copy: 'Copiar números 📋',
    copied: '¡Números copiados!',
    again: 'Sacar otra vez',
    change: 'Volver a los ajustes',
    disclaimer: 'Solo por entretenimiento. Sin predicciones ni promesas de premio.',
    shareTitle: 'Generador de lotería',
    shareText: 'Mis números de la suerte 🎱\n{numbers}'
  },
  og: {
    brand: '🎱 Generador de lotería',
    kicker: 'Números aleatorios · por diversión',
    title: '¿Hoy tienes suerte?',
    desc: 'Elige un juego y saca hasta cinco apuestas'
  },
  faq: [
    {
      q: '¿Cómo saco mis números?',
      a: 'Elige un juego (6/45 coreano, estilo Euro, Powerball de EE. UU. o tu propio rango), escoge de una a cinco apuestas y pulsa el botón de sacar. Los números se deciden primero, las bolas salen una a una y luego cada apuesta se muestra ordenada.'
    },
    {
      q: '¿Los números son realmente aleatorios?',
      a: 'Sí. Salen del generador aleatorio criptográfico de tu navegador (crypto.getRandomValues) con muestreo por rechazo, así que cada número permitido tiene exactamente la misma probabilidad y no hay sesgo. La animación de las bolas es solo decorativa.'
    },
    {
      q: '¿Para qué sirven los números mantenidos y descartados?',
      a: 'Los mantenidos aparecen en todas las apuestas y el resto se saca alrededor de ellos. Los descartados nunca salen. Solo afectan a los números principales, no a las estrellas ni al Powerball.'
    },
    {
      q: '¿Esto aumenta mis probabilidades de ganar?',
      a: 'No. En un sorteo real todas las combinaciones son igual de probables y ninguna herramienta puede predecir el resultado. Este generador es solo una forma divertida de elegir números y no promete ningún premio.'
    }
  ],
  privacy: {
    title: 'Política de privacidad | Generador de lotería',
    description: 'Política de privacidad del Generador de lotería: los números que escribes se quedan en tu navegador, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Generador de lotería (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      [
        '1. Información que recopilamos',
        'El Servicio funciona sin cuenta ni inicio de sesión. Los números que escribes y tus resultados se procesan solo en tu navegador y no se envían a nuestro servidor. No obstante, mientras usas el Servicio puede recopilarse automáticamente cierta información, como se describe a continuación.'
      ],
      [
        '2. Cookies y tecnologías similares',
        'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían no funcionar como se espera.'
      ],
      [
        '3. Publicidad (Google AdSense)',
        'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Puedes saber más y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'
      ],
      [
        '4. Estadísticas',
        'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (visitas, sorteos, valoraciones con estrellas). Nada de esto te identifica personalmente.'
      ],
      [
        '5. Contacto',
        'Si tienes preguntas sobre esta política de privacidad, ponte en contacto con el responsable del sitio.'
      ],
      [
        '6. Fecha de entrada en vigor',
        'Esta política está en vigor desde el 7 de octubre de 2026.'
      ]
    ],
    back: '← Volver al Generador de lotería'
  }
};
