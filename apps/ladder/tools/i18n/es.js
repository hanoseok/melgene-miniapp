/* Juego de la escalera — Español (/es/)
 * Términos de búsqueda: "sorteo", "juego de la escalera", "amidakuji".
 * page.* lo escribe tools/gen-i18n.js en el HTML estático; ui.* se incluye en la página para ladder.js.
 */
module.exports = {
  siteName: 'Juego de la escalera',
  meta: {
    title: 'Sorteo, juego de la escalera | Melgene Apps',
    description: '¿Quién paga el café? ¿Dónde almorzamos? ¿Quién lava los platos? Este sorteo online gratis (un juego de la escalera, también llamado amidakuji) decide de forma justa, sin instalar nada ni registrarte. Comparte la misma escalera con un enlace.',
    ogTitle: 'Juego de la escalera — un sorteo justo, gratis en 1 minuto',
    ogDescription: 'Escribe nombres y resultados, toca y sigue el camino. Un sorteo online gratis, sin instalación.',
  },
  fontCss: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap',
  app: {
    name: 'Juego de la escalera',
    currency: 'EUR',
    description: 'Un juego de la escalera gratis online (un sorteo) para elegir el almuerzo, quién paga el café, repartir tareas o fijar un orden. Escribe los jugadores y los resultados para obtener una escalera aleatoria justa, y comparte exactamente la misma con un enlace.',
  },
  setup: {
    badge: '🪜 Gratis online',
    h1Html: '¿No decides?<br>Haz un <em>sorteo</em>',
    hook: 'Agrega nombres y resultados, el resto lo decide el azar. Almuerzo, café, tareas, orden de turno — todo resuelto de forma justa.',
    countLabel: 'Número de jugadores',
    minusAria: 'Menos jugadores',
    plusAria: 'Más jugadores',
    presetLabel: 'Accesos rápidos',
    presets: { lunch: '🍕 Almuerzo', coffee: '☕ Quién paga el café', clean: '🧹 Tareas', order: '🔢 Orden de turno' },
    namesLabel: 'Jugadores',
    resultsLabel: 'Resultados',
    shuffle: '🔀 Mezclar',
    build: 'Crear escalera →',
  },
  play: {
    edit: '← Editar',
    rebuild: '🔁 Nueva escalera',
    hint: 'Toca a un jugador para seguir su camino',
    revealAll: 'Revelar todo',
    finalTitle: 'Resultados finales',
  },
  privacyLink: 'Política de privacidad',

  // FAQ breve y sin spoilers — solo aparece en la pantalla final compartida (MG_FAQ)
  faq: [
    { q: '¿El juego de la escalera es realmente justo?', a: 'Sí. Los peldaños se colocan al azar cada vez y los caminos nunca se cruzan, así que nadie puede predecir ni manipular el resultado.' },
    { q: '¿Puedo generar otra escalera con los mismos jugadores?', a: 'Toca "Nueva escalera" para mantener tus jugadores y resultados, pero generar una escalera aleatoria completamente nueva.' },
    { q: '¿Cuántos jugadores pueden participar?', a: 'De 2 a 10 jugadores.' },
    { q: '¿Funciona en el móvil?', a: 'Sí. Está diseñado para tocar, y la escalera se adapta automáticamente a cualquier tamaño de pantalla.' },
  ],

  ui: {
    defaultName: 'Jugador {n}',
    win: 'Ganador 🎉',
    lose: 'Nada',
    coffeeWin: 'Paga el café',
    coffeeLose: 'A salvo',
    order: ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º'],
    pools: {
      lunch: ['Pizza', 'Tacos', 'Hamburguesa', 'Sushi', 'Paella', 'Ensalada', 'Bocadillo', 'Ramen', 'Burrito', 'Empanadas'],
      clean: ['Platos', 'Aspirar', 'Ropa', 'Basura', 'Baño', 'Compras', 'Quitar polvo', 'Trapear', 'Plantas', 'Reciclaje'],
    },
    ariaName: 'Nombre del jugador {n}',
    ariaResult: 'Resultado {n}',
    ariaTrace: 'Seguir el camino de {name}',
    ariaHidden: 'Resultado {n}, aún no revelado',
    ariaRevealed: '{result} revelado',
    shareTitle: 'Mira esta escalera',
    shareText: '¡Hice una escalera — prueba la misma y mira dónde terminas!',
    retryLabel: 'Nueva escalera',
  },

  og: {
    badge: '🪜 Gratis online',
    title: 'Juego de la escalera',
    tag: 'Del almuerzo al café, decidido con justicia',
  },

  privacy: {
    title: 'Política de privacidad | Juego de la escalera',
    description: 'Política de privacidad del Juego de la escalera — uso de cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'El Juego de la escalera (el "Servicio") respeta tu privacidad y procesa solo la información mínima necesaria, como se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'Puedes usar el Servicio sin registrarte ni iniciar sesión. Los nombres y resultados que escribes nunca se guardan en nuestros servidores; se procesan solo en tu navegador (almacenamiento local y la URL de la página). Es posible que se recopile automáticamente cierta información mientras usas el Servicio, como se describe a continuación.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies para mostrar anuncios y entender el uso del Servicio. Puedes rechazar o eliminar las cookies en la configuración de tu navegador; algunas funciones podrían no funcionar correctamente si lo haces.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar tu configuración de personalización de anuncios en <a href="https://adssettings.google.com/" target="_blank" rel="noopener">la configuración de anuncios de Google</a>.'],
      ['4. Estadísticas (Google Analytics)', 'El Servicio puede usar Google Analytics (GA4) para entender el número de visitantes y las fuentes de tráfico y así mejorarlo. Estos datos se usan solo con fines estadísticos y no te identifican personalmente.'],
      ['5. Sobre los enlaces para compartir', 'Los enlaces creados con "Compartir" contienen los nombres de los jugadores y el texto de los resultados que escribiste, además de la estructura de la escalera, codificados en la URL. Recomendamos no introducir información que pueda identificar a una persona.'],
      ['6. Contacto', 'Si tienes preguntas sobre esta Política de privacidad, contacta al operador del sitio.'],
      ['7. Fecha de vigencia', 'Esta política entra en vigor el 1 de enero de 2026.'],
    ],
    back: '← Volver al Juego de la escalera',
  },
};
