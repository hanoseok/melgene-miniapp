/* Ruleta aleatoria — Español (/es/)
 * Búsqueda objetivo: "ruleta aleatoria". title = "{búsqueda} | {marca}".
 * Mismas claves que los demás archivos de idioma. ui.presets debe mantener las mismas claves y el mismo
 * número de elementos en todos los idiomas (lo comprueba check-roulette.js). Máximo 24 caracteres por opción.
 * El FAQ solo aparece en la pantalla final compartida (debajo de los botones de compartir) — nunca en el inicio.
 */
module.exports = {
  siteName: 'Ruleta aleatoria',
  meta: {
    title: 'Ruleta aleatoria | Melgene Apps',
    description: 'Ruleta aleatoria gratis online. Escribe tus opciones y gira — sin instalar, sin registro, lista en un minuto. Incluye ponderación y enlace para compartir.',
    ogTitle: 'Ruleta aleatoria — escribe tus opciones y gira',
    ogDescription: 'Almuerzo, tareas, retos. Una ruleta online gratuita y justa que funciona en tu navegador.',
  },
  // Tipografía de cartel para el título, el portal y el resultado (fontCss la carga, displayFont la nombra)
  fontCss: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
  displayFont: "'Dela Gothic One'",
  app: {
    name: 'Ruleta aleatoria',
    description: 'Una ruleta aleatoria gratuita online para elegir el almuerzo, tareas, retos o un sorteo. Añade de 2 a 16 opciones con peso opcional y gira: el ganador se elige de forma justa con aleatoriedad criptográfica. Comparte un enlace a la misma ruleta exacta.',
  },
  hero: {
    h1: 'Ruleta aleatoria',
    tagline: '¿No te decides? Escríbelo y gira.',
  },
  wheel: {
    spin: 'Girar',
    spinAria: 'Girar la ruleta',
    share: 'Compartir',
    fair: 'El resultado se elige al azar en el momento en que pulsas girar. La ruleta solo frena hasta detenerse ahí.',
  },
  history: {
    title: 'Historial de giros',
    clear: 'Borrar historial',
  },
  editor: {
    title: 'Opciones',
    presetsLabel: 'Inicio rápido',
    presets: { lunch: '🍕 Almuerzo', dare: '🎤 Retos', duty: '🙋 Nombres', yesno: '👍 Sí/No', numbers: '🔢 1–10' },
    add: 'Añadir opción',
    shuffle: 'Mezclar',
    weighted: 'Probabilidad ponderada',
    weightedHint: 'Cuanto mayor sea el número, más ancho el sector y más veces sale.',
    themeLabel: 'Colores',
  },
  result: {
    kicker: 'La ruleta eligió',
    again: 'Girar de nuevo',
    removeAgain: 'Quitar esta y girar de nuevo',
    close: 'Cerrar',
  },
  // Solo aparece en la pantalla final compartida (debajo de los botones de compartir) — no en el inicio
  faq: [
    { q: '¿Se puede manipular el resultado?', a: 'No. El ganador se elige con aleatoriedad criptográfica en el instante en que pulsas girar, y la ruleta simplemente se detiene ahí. Ni el momento de pulsar ni la animación influyen en el resultado.' },
    { q: '¿Cómo funciona la probabilidad ponderada?', a: 'La probabilidad de cada opción es su peso (1–5) dividido entre la suma de todos los pesos. Con pesos 2, 1 y 1, la primera opción gana el 50 % de las veces y las otras el 25 % cada una.' },
    { q: '¿Cuántas opciones puedo añadir?', a: 'De 2 a 16. Cada opción admite hasta 24 caracteres; los nombres largos se reducen o se recortan con puntos suspensivos cuando el sector es estrecho.' },
    { q: '¿Puedo enviarle mi ruleta a alguien?', a: 'Sí. Compartir crea un enlace que codifica tus opciones, pesos y tema de color en la dirección — no se guarda nada en un servidor.' },
    { q: '¿Necesito instalar una app o registrarme?', a: 'No. La ruleta funciona directamente en el navegador del móvil, la tableta o el ordenador, sin descargas ni registro.' },
  ],
  privacyLink: 'Política de privacidad',

  ui: {
    itemN: 'Opción {n}',
    wheelAria: 'Ruleta con {n} sectores: {list}',
    ariaItem: 'Nombre de la opción {n}',
    ariaHandle: 'Reordenar la opción {n} (flechas arriba/abajo)',
    ariaDelete: 'Eliminar la opción {n}',
    ariaWeight: 'Opción {n}, peso {w}, pulsa para cambiar',
    count: '{n}/{max}',
    maxReached: 'Puedes añadir hasta {max} opciones',
    minReached: 'La ruleta necesita al menos 2 opciones',
    soundOn: 'Sonido activado',
    soundOff: 'Sonido desactivado',
    announce: 'Resultado: {label}',
    historyItem: 'Giro {n}',
    restore: 'Recuperar {n} eliminadas',
    loadedShare: 'Ruleta compartida cargada',
    badShare: 'No se pudo abrir ese enlace', // el aviso ocupa una sola línea (nowrap) — mantenlo corto
    shareTitle: 'Gira mi ruleta',
    shareText: 'Hice una ruleta — ¿le das una vuelta?',
    themes: { candy: 'Caramelo', macaron: 'Macaron', circus: 'Circo', jewel: 'Joya' },
    presets: {
      lunch: ['Pizza', 'Tacos', 'Sushi', 'Hamburguesas', 'Paella', 'Ensalada', 'Pasta', 'Empanadas'],
      dare: ['Cantar un estribillo', 'Bailar 15 segundos', 'Imitar un acento', 'Invitar el café', 'Contar un chiste malo', '10 flexiones', 'Hablar como pirata', 'Poner cara graciosa'],
      duty: ['Mía', 'Leo', 'Sofía', 'Mateo', 'Valentina', 'Diego'],
      yesno: ['Sí', 'No'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  },

  og: {
    badge: '🎡 Gratis online',
    title: 'Ruleta aleatoria',
    tag: 'Almuerzo, nombres, retos: escribe y gira',
  },

  privacy: {
    title: 'Política de privacidad | Ruleta aleatoria',
    description: 'Política de privacidad de Ruleta aleatoria — cómo se guardan tus opciones, cookies, publicidad y analítica.',
    h1: 'Política de privacidad',
    introHtml: 'Ruleta aleatoria (el "Servicio") respeta tu privacidad y procesa solo la información mínima descrita a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Tus opciones, pesos, tema de color e historial de giros nunca se envían a un servidor — permanecen en tu navegador (almacenamiento local y la URL). Alguna información puede recopilarse automáticamente mientras usas el Servicio, como se describe a continuación.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazar o eliminar las cookies en la configuración de tu navegador; algunas funciones podrían no funcionar como se espera si lo haces.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores. Puedes obtener más información y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Analítica', 'Para mejorar el Servicio, podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, giros, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Enlaces compartidos', 'Los enlaces creados con "Compartir" contienen los nombres de las opciones, los pesos y el tema de color que introdujiste, codificados en la URL. Evita introducir información que te identifique personalmente.'],
      ['6. Contacto', 'Si tienes preguntas sobre esta política, contacta con el operador del Servicio.'],
      ['7. Fecha de vigencia', 'Esta política entra en vigor el 27 de septiembre de 2026.'],
    ],
    back: '← Volver a Ruleta aleatoria',
  },
};
