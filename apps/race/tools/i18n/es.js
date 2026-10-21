/* Carrera de animales — español. Misma estructura de claves que en.js. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Carrera de animales – sorteo con carrera online',
    description: 'Sorteo con una carrera de animales: escribe de 2 a 10 nombres y cada uno corre en su carril. Gana el primero o el último paga los cafés. Azar justo, gratis y sin registro.',
    ogTitle: 'Carrera de animales 🏁 ¿Quién paga los cafés?',
    ogDescription: 'Escribe los nombres, pon a los animales en la salida y deja que la carrera decida. Gana el primero o paga el último.',
  },
  siteName: 'Carrera de animales',
  privacyLink: 'Política de privacidad',

  hero: {
    h1Kicker: 'Carrera de animales',
    h1Html: '¿No os ponéis de acuerdo?<br><em>Que lo decidan los animales</em>',
    hook: '¿Quién paga los cafés? ¿Quién empieza? Pon a todos en un carril y mira la carrera.',
  },

  ui: {
    modeLabel: '¿Cómo lo decidimos?',
    modeWin: '🏆 Gana el 1.º',
    modeLose: '☕ Paga el último',
    countLabel: 'Corredores',
    countValue: '{n} corredores',
    less: 'Menos corredores',
    more: 'Más corredores',
    namesLabel: '¿Quién corre?',
    namesHint: 'Si dejas un carril vacío, usa su nombre por defecto. El animal es solo por diversión y no cambia las probabilidades de nadie.',
    playerN: 'Jugador {n}',
    nameAria: 'Nombre del carril {n}',
    start: '¡Empieza la carrera! 🏁',
    fair: 'El orden de llegada se sortea con azar crypto antes de salir · los nombres se quedan en tu dispositivo',
    trackAria: 'Pista de carreras',
    go: '¡YA!',
    bannerWin: '🏆 Gana quien cruce primero la meta',
    bannerLose: '☕ Paga quien llegue el último',
    liveStart: 'Tres, dos, uno, ¡ya! Empieza la carrera.',
  },

  errors: {
    tooFew: 'Hacen falta al menos 2 corredores.',
    tooMany: 'En la pista caben 10 corredores como máximo.',
    badLink: 'Este enlace está roto y no se han cargado nombres.',
  },

  result: {
    winKicker: 'Y el ganador es',
    winTitle: '¡Gana {name}! 🏆',
    winSub: 'Primero en cruzar la meta.',
    loseKicker: 'Último en cruzar la meta',
    loseTitle: '{name} llega el último',
    loseSub: '¡Mala suerte! Esta ronda de cafés la paga {name} ☕',
    rankingTitle: 'Orden de llegada',
    tagWin: 'Ganador',
    tagLose: 'Paga ☕',
    edit: 'Cambiar nombres',
    shareNames: 'Copiar enlace con estos nombres',
    linkCopied: 'Enlace copiado. Abre los mismos corredores, listos para salir.',
    sharedNote: 'Corredores cargados desde un enlace compartido. ¡Cuando quieras!',
    history: 'Últimas carreras',
    historyClear: 'Borrar',
    historyWin: '🏆 {name}',
    historyLose: '☕ {name}',
    historyMeta: '{n} corredores',
    liveWin: '{name} gana la carrera.',
    liveLose: '{name} llega en último lugar.',
    again: 'Otra carrera 🏁',
    shareTitle: 'Carrera de animales',
    shareText: '¿No os ponéis de acuerdo? Que lo decida una carrera de animales 🏁',
  },

  og: {
    brand: '🏁 Carrera de animales',
    kicker: 'Sorteo con carrera · de 2 a 10',
    title: 'Que lo decidan los animales corriendo',
    desc: 'Gana el primero, o el último paga los cafés',
  },

  faq: [
    { q: '¿La carrera es de verdad aleatoria y justa?', a: 'Sí. Al pulsar empezar, todo el orden de llegada se sortea con el generador aleatorio criptográfico del navegador (crypto.getRandomValues), muestreo por rechazo y una mezcla de Fisher-Yates. Todos los órdenes tienen exactamente la misma probabilidad; la carrera en pantalla solo lo representa.' },
    { q: '¿El animal o el carril cambian mis probabilidades?', a: 'No. Los animales se reparten por carril solo por diversión. Aquí el conejo no es más rápido que la tortuga, y el carril 1 tiene las mismas opciones que el 10.' },
    { q: '¿Por qué las llegadas siempre son tan ajustadas?', a: 'Para darle emoción. Una vez sorteado el orden, la animación añade acelerones, tropiezos y un final apretado en el puesto que importa, el primero o el último según el modo. El espectáculo nunca cambia el orden.' },
    { q: '¿Puedo mandar los mismos corredores a mis amigos?', a: 'Sí. «Copiar enlace con estos nombres» guarda en el enlace solo los nombres y el modo, nunca un resultado. Quien lo abra hará una carrera nueva. Tus últimos resultados se quedan solo en este dispositivo.' },
  ],

  privacy: {
    title: 'Política de privacidad | Carrera de animales',
    description: 'Política de privacidad de Carrera de animales: los nombres y resultados se quedan en tu navegador, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Carrera de animales (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recogemos', 'El Servicio funciona sin cuenta ni inicio de sesión. Los nombres que escribes se procesan solo en tu navegador y no se envían a nuestro servidor. Tu última lista de nombres y tus diez últimos resultados pueden guardarse en el almacenamiento local del navegador, en tu dispositivo. Si copias un enlace con nombres, esos nombres van dentro del propio enlace y solo los verán las personas a las que se lo envíes.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y ajustes, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; en ese caso algunas funciones podrían no ir bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Puedes saber más y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (páginas vistas, carreras empezadas y terminadas, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes dudas sobre esta política, ponte en contacto con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está en vigor desde el 22 de octubre de 2026.'],
    ],
    back: '← Volver a Carrera de animales',
  },
};
