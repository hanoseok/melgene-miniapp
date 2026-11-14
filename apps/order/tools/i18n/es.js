/* Sortear orden — español (/es/). Misma estructura de claves que en.js (ver su cabecera). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap',
    display: "'Bagel Fat One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Sortear orden – orden aleatorio de una lista de nombres',
    description: 'Sortea el orden gratis: pega nombres o usa números del 1 al N y obtén un orden justo para exposiciones, turnos de juego o tareas de limpieza. Sin registro, nada se sube.',
    ogTitle: 'Sortear orden 🔢 ¿Quién empieza?',
    ogDescription: 'Mezcla una lista de nombres en un orden justo y revélalo carta a carta.',
  },
  siteName: 'Sortear orden',
  privacyLink: 'Política de privacidad',

  hero: {
    h1Kicker: 'Sortear orden',
    h1Html: '¿Quién va <em>primero?</em>',
    hook: 'Escribe los nombres, mezcla una vez y el orden queda fijado del primero al último.',
  },

  ui: {
    presetLabel: '¿Para qué es el orden?',
    modeLabel: 'Nombres o números',
    modeNames: 'Nombres',
    modeNumbers: 'Números 1–N',
    namesLabel: 'Nombres, uno por línea',
    namesPh: 'Lucía\nMateo\nSofía\nHugo',
    namesHint: 'Pega una lista desde WhatsApp o una hoja de cálculo. Las comas también separan.',
    namesCount: '{n} / {max}',
    clear: 'Borrar',
    numbersLabel: '¿Cuántos?',
    numbersDec: 'Uno menos',
    numbersInc: 'Uno más',
    numbersHint: 'Mezcla los números del 1 al N. Útil con números de lista o de asiento.',
    numberItem: 'n.º {n}',
    fromLabel: 'Revelar el orden',
    fromFirst: 'Desde el 1.º',
    fromLast: 'Desde el último',
    shuffle: 'Sortear el orden 🔀',
    fair: 'Mezclado una sola vez con azar criptográfico · los nombres no salen de tu navegador',
  },

  presets: [
    { label: 'Orden sin más', heading: 'El orden sorteado' },
    { label: 'Exposiciones', heading: 'Orden de exposiciones' },
    { label: 'Turnos de juego', heading: 'Orden de turnos' },
    { label: 'Limpieza', heading: 'Turnos de limpieza' },
  ],

  errors: {
    namesFew: 'Escribe al menos 2 nombres, uno por línea, o cambia a números.',
    namesMany: 'Puedes usar hasta 40 nombres.',
    numbersRange: 'Elige un número entre 2 y 40.',
    badLink: 'Este enlace está roto o incompleto, así que no se muestra nada.',
  },

  reveal: {
    progress: '{k} de {n} revelados',
    tapHint: 'Toca la carta o «Siguiente». El orden quedó fijado al mezclar.',
    first: 'Revelar ▶',
    next: 'Siguiente ▶',
    done: 'Ver el orden completo',
    auto: 'Automático',
    autoStop: 'Pausa',
    showAll: 'Ver todo',
    soFar: 'Revelados hasta ahora',
    live: 'Número {k}: {who}',
  },

  result: {
    sharedBadge: '🔢 Orden compartido',
    sharedNote: 'Este es el orden guardado en el enlace. No se ha vuelto a mezclar.',
    summary: '{n} en total, del primero al último',
    copy: 'Copiar como texto',
    copied: 'Orden copiado',
    copyLink: 'Copiar enlace',
    linkCopied: 'Enlace copiado. Quien lo abra verá exactamente este orden.',
    linkTooLong: 'La lista es demasiado larga para un enlace; se copió solo la dirección de la página.',
    edit: 'Cambiar nombres',
    again: 'Volver a sortear 🔀',
    againShared: 'Volver a sortear / Probar yo 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: 'Sortear orden',
    shareText: 'Este es nuestro orden, sorteado al azar 🔢',
  },

  og: {
    brand: '🔢 Sortear orden',
    kicker: 'Exposiciones · juegos · limpieza',
    title: '¿Quién empieza? Sortea un orden justo',
    desc: 'Nombres dentro, orden listo en segundos',
  },

  faq: [
    { q: '¿El sorteo es realmente justo?', a: 'Sí. Al pulsar sortear, el generador aleatorio criptográfico del navegador (crypto.getRandomValues) hace una mezcla de Fisher–Yates con muestreo por rechazo, así que todos los órdenes posibles tienen la misma probabilidad. El orden completo se fija en ese momento; las cartas solo lo muestran.' },
    { q: '¿En qué se diferencia de sortear un ganador?', a: 'Un sorteo de ganador termina con un solo nombre. Aquí todos reciben un puesto del primero al último, que es lo que necesitas para exposiciones, turnos de juego, turnos de palabra o la limpieza.' },
    { q: '¿Revelar desde el primero o desde el último?', a: 'Desde el primero es más rápido si todos tienen que prepararse. Desde el último da más emoción, porque quien va primero se descubre al final.' },
    { q: '¿Se guardan o se envían los nombres?', a: 'No. Los nombres se quedan en tu navegador. Tu última lista se guarda en este dispositivo para reutilizarla, y un enlace compartido solo lleva el orden a quien tú se lo envíes.' },
  ],

  privacy: {
    title: 'Política de privacidad | Sortear orden',
    description: 'Política de privacidad de Sortear orden: los nombres y el orden se quedan en tu navegador; cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Sortear orden (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recogemos', 'El Servicio funciona sin cuenta ni inicio de sesión. Los nombres o números que escribes y el orden resultante se procesan solo en tu navegador y no se envían a nuestro servidor. Tu última lista se guarda en el almacenamiento local del navegador, en tu dispositivo. Al copiar un enlace, el orden se escribe en el propio enlace y solo se comparte con las personas a las que lo envíes.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y ajustes, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; algunas funciones podrían no ir como se espera.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios agregados que solo guardan totales diarios por idioma (páginas vistas, sorteos iniciados y terminados). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política, ponte en contacto con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está vigente desde el 15 de noviembre de 2026.'],
    ],
    back: '← Volver a Sortear orden',
  },
};
