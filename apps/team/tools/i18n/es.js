/* Generador de equipos aleatorios — español (/es/)
 * Misma estructura de claves que en.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Generador de equipos aleatorios – Hacer equipos',
    description: 'Generador de equipos aleatorios: pega los nombres, elige cuántos equipos o personas por equipo y haz equipos equilibrados y justos. Capitanes separados y el mismo resultado en un enlace. Gratis, sin registro.',
    ogTitle: 'Generador de equipos aleatorios 🎲 Hacer equipos',
    ogDescription: 'Pega los nombres, mezcla y ten equipos justos en segundos. Comparte el resultado exacto.',
  },
  siteName: 'Generador de equipos',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🎲 Se acabó pelear por los equipos',
    h1Kicker: 'Generador de equipos aleatorios',
    h1Html: '¿Quién acabará<br>en <em>tu equipo</em>?',
    hook: 'Pega los nombres, toca mezclar y deja que el azar reparta al grupo. Sin discusiones.',
    facts: 'Hasta 60 nombres · capitanes separados · resultado para compartir',
    start: 'Hacer equipos →',
  },

  input: {
    title: '¿Quién juega?',
    namesLabel: 'Nombres',
    namesHint: 'Uno por línea o separados por comas. Pon * delante de un capitán.',
    placeholder: 'Lucía\nHugo\n*Sofía\nMateo, Martina, Pablo',
    sample: 'Nombres de ejemplo',
    clear: 'Borrar',
    tooMany: 'Solo se usan los primeros {max} nombres.',
    needMore: 'Añade al menos 2 nombres.',
    modeLabel: 'Repartir por',
    modeTeams: 'Número de equipos',
    modeSize: 'Tamaño de equipo',
    minus: 'Menos',
    plus: 'Más',
    previewEq: '{k} equipos × {size}',
    previewRange: '{k} equipos × {min}–{max}',
    leaders: 'Capitanes (*) en equipos distintos',
    leadersCount: 'Capitanes marcados: {n}',
    leadersNone: 'Pon * delante de un nombre para marcar un capitán',
    shuffle: 'Mezclar equipos 🎲',
  },

  result: {
    shuffling: 'Mezclando…',
    title: 'Los equipos',
    sharedTitle: 'Equipos compartidos',
    sharedNote: 'Alguien te ha compartido estos equipos.',
    captain: 'Capitán',
    rename: 'Cambiar nombres',
    again: 'Mezclar otra vez',
    edit: 'Editar nombres',
    copy: 'Copiar como texto',
    copied: '¡Equipos copiados!',
    makeOwn: 'Hacer mis equipos',
    badShare: 'Este enlace no funciona: haz tus propios equipos aquí.',
    shareTitle: 'Generador de equipos aleatorios – Hacer equipos',
    shareText: 'Estos son nuestros {k} equipos al azar 🎲',
  },

  people: { one: '{n} persona', other: '{n} personas' },

  teams: {
    tiger: 'Los Tigres',
    eagle: 'Las Águilas',
    shark: 'Los Tiburones',
    wolf: 'Los Lobos',
    fox: 'Los Zorros',
    panda: 'Los Pandas',
    lion: 'Los Leones',
    owl: 'Los Búhos',
    dolphin: 'Los Delfines',
    bear: 'Los Osos',
    rabbit: 'Los Conejos',
    penguin: 'Los Pingüinos',
    dragon: 'Los Dragones',
    unicorn: 'Los Unicornios',
    octopus: 'Los Pulpos',
    frog: 'Las Ranas',
    koala: 'Los Koalas',
    parrot: 'Los Loros',
    bee: 'Las Abejas',
    turtle: 'Las Tortugas',
  },

  sample: ['Lucía', 'Hugo', 'Sofía', 'Mateo', 'Martina', 'Pablo', 'Valeria', 'Diego', 'Paula', 'Daniel', 'Carmen', 'Álvaro'],

  og: {
    brand: '🎲 Generador de equipos',
    kicker: 'Nombres dentro · equipos fuera',
    title: '¿Quién acabará en tu equipo?',
    desc: 'Equipos justos al azar en segundos · capitanes separados · compártelo',
  },

  faq: [
    { q: '¿Cómo reparto nombres en equipos?', a: 'Escribe o pega los nombres, uno por línea o separados por comas (hasta 60). Elige cuántos equipos quieres o cuántas personas por equipo y toca mezclar. Los equipos nunca se diferencian en más de una persona.' },
    { q: '¿El sorteo es realmente justo?', a: 'Sí. Los nombres se mezclan con el generador aleatorio criptográfico de tu navegador (crypto.getRandomValues) y el algoritmo de Fisher–Yates, así que cada reparto posible tiene exactamente la misma probabilidad. Ni nosotros ni nadie puede influir en el resultado.' },
    { q: '¿Cómo funcionan los capitanes?', a: 'Pon * delante de un nombre para marcarlo como capitán y activa «Capitanes en equipos distintos». Primero se reparte un capitán por equipo y luego se mezcla a todos los demás. Si hay más capitanes que equipos, algunos equipos tendrán dos.' },
    { q: '¿Qué lleva el enlace para compartir?', a: 'El propio enlace lleva los nombres y los equipos exactos, así que quien lo abra verá el mismo resultado. No guardamos nada en nuestro servidor. Tu última lista se queda solo en este navegador para que no tengas que volver a escribirla.' },
  ],

  privacy: {
    title: 'Política de privacidad | Generador de equipos',
    description: 'Política de privacidad del Generador de equipos aleatorios: los nombres se procesan en tu navegador, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'El Generador de equipos aleatorios (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recogemos', 'El Servicio funciona sin cuenta ni inicio de sesión. Los nombres que escribes se procesan solo en tu navegador y no se envían a nuestro servidor. Si compartes un resultado, los nombres y los equipos van dentro del propio enlace, así que cualquiera con el enlace puede verlos. Algunos datos pueden recogerse automáticamente mientras usas el Servicio, como se explica abajo.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y tu última lista de nombres, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; en ese caso algunas funciones podrían no ir bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Más información y preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y nuestros propios contadores agregados, que solo guardan totales diarios por idioma (visitas, mezclas, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política, contacta con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está en vigor desde el 1 de octubre de 2026.'],
    ],
    back: '← Volver al Generador de equipos',
  },
};
