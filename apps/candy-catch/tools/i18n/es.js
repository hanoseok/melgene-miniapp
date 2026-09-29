/* Juego atrapa dulces de Halloween — Español (/es/)
 * Misma estructura de claves que en.js. Reglas y puntos en candy-catch-core.js.
 */
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
    title: 'Juego atrapa dulces de Halloween – Arcade gratis',
    description: 'Juego atrapa dulces de Halloween: mueve tu cubeta de calabaza, atrapa los dulces que caen, esquiva arañas y fantasmas y haz combos. 50 segundos, gratis y sin descargas.',
    ogTitle: 'Juego atrapa dulces de Halloween 🍬 ¿Cuántos atrapas?',
    ogDescription: 'Llueven dulces del cielo. 50 segundos, 3 vidas: ¿qué tan llena quedará tu cubeta?',
  },
  siteName: 'Atrapa dulces de Halloween',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🎃 Truco o trato · arcade',
    h1Kicker: 'Juego atrapa dulces de Halloween',
    h1Html: '¿Cuántos dulces<br>puedes <em>atrapar</em>?',
    hook: 'Esta noche llueven dulces. Llena tu cubeta antes de que se acabe el tiempo… pero no todo lo que cae es dulce.',
    how: { move: 'Desliza o ← →', catch: 'Atrapa dulces', avoid: 'Esquiva lo que asusta' },
    facts: '50 segundos · 3 vidas · combos',
    start: 'A atrapar dulces →',
  },

  play: {
    score: 'Puntos',
    time: 'Tiempo',
    lives: 'Vidas',
    livesAria: 'Vidas restantes: {n}',
    combo: 'Combo ×{n}',
    pause: 'Pausa',
    paused: 'En pausa',
    resume: 'Continuar',
    go: '¡Ya!',
    fieldAria: 'Zona de juego. Desliza, mueve el ratón o usa las flechas para mover la cubeta.',
  },

  result: {
    timeUp: '¡Se acabó el tiempo!',
    outOfLives: '¡Sin vidas!',
    points: 'puntos',
    best: 'Récord: {n}',
    newBest: '¡Nuevo récord!',
    caught: 'Dulces atrapados',
    streak: 'Combo más largo',
    top: 'Top {n}%',
    beat: 'Mejor que el {pct}% de los jugadores',
    beatAll: 'Mejor que todas las demás puntuaciones',
    others: 'Comparado con otras {n} puntuaciones',
    comparing: 'Comparando con otros jugadores…',
    retry: 'Jugar otra vez',
    shareTitle: 'Juego atrapa dulces de Halloween',
    shareText: '¡Hice {score} puntos en Atrapa dulces de Halloween! 🍬 ¿Me superas?',
  },

  og: {
    brand: '🍬 Atrapa dulces de Halloween',
    defaultKicker: 'Juego arcade gratis',
    defaultTitle: '¿Cuántos dulces puedes atrapar?',
    defaultDesc: 'Mueve la cubeta · atrapa dulces · 50 segundos',
  },

  faq: [
    { q: '¿Cómo se juega?', a: 'Desliza el dedo por la zona de juego, mueve el ratón o mantén las flechas ← → para mover la cubeta de calabaza. Atrapa los dulces que caen y aléjate de las cosas que dan miedo. Una partida dura 50 segundos o hasta que pierdas tus tres vidas.' },
    { q: '¿Cómo funcionan los puntos y los combos?', a: 'Cada dulce da puntos, y los más raros y elegantes dan más. Atrapa dulces seguidos para subir el combo: cuanto más larga la racha, mayor el multiplicador. Si se te cae un dulce o atrapas algo que asusta, vuelve a cero.' },
    { q: '¿El porcentaje es real?', a: 'Sí. Al terminar una partida, solo tu puntuación se envía de forma anónima a nuestro servidor y se compara con las de los demás. El porcentaje solo aparece cuando hay puntuaciones reales para comparar; si no, no se muestra nada.' },
    { q: '¿Por qué el juego se detuvo solo?', a: 'El juego se pausa automáticamente al cambiar de pestaña o de app, para que no pierdas vidas mientras no estás. Toca Continuar para seguir. Tu récord se guarda en este navegador.' },
  ],

  privacy: {
    title: 'Política de privacidad | Atrapa dulces de Halloween',
    description: 'Política de privacidad del juego Atrapa dulces de Halloween: puntuaciones anónimas, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Atrapa dulces de Halloween (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Al terminar una partida, solo tu puntuación (redondeada a la decena) se envía a nuestro servidor como un conteo anónimo, sin nombre ni identificador personal. Parte de la información puede recopilarse automáticamente durante el uso, como se describe abajo.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma y tu récord, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; algunas funciones podrían no funcionar como se espera.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios. Más información y preferencias en <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (visitas, partidas iniciadas y terminadas, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política de privacidad, contacta con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está vigente desde el 30 de septiembre de 2026.'],
    ],
    back: '← Volver a Atrapa dulces de Halloween',
  },
};
