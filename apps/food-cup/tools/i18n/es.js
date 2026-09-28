/* Torneo de comida – ¿Qué prefieres comer? — Español (/es/)
 * Misma estructura de claves que en.js. Ids de platos, emojis y cuadro: food-cup-core.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Oswald:wght@600&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    name: "'Oswald'",
    nameWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Torneo de comida – ¿Qué prefieres comer?',
    description: 'Torneo de comida: dos platos por duelo, toca el que prefieres comer hasta que quede un campeón. El «¿qué prefieres?» de comida en un minuto. Gratis, sin descargas.',
    ogTitle: 'Torneo de comida 🏆 ¿Qué prefieres comer?',
    ogDescription: 'Dos platos, una elección, quince duelos. ¿Qué comida vas a coronar?',
  },
  siteName: 'Torneo de comida',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🍽️ ¿Qué prefieres? · edición comida',
    h1Kicker: 'Torneo de comida',
    h1Html: '¿Qué comida se lleva<br>la <em>corona</em>?',
    hook: 'Dos platos, una sola elección. Sigue eligiendo hasta que solo quede tu favorito.',
    facts: '16 platos · 15 elecciones · 1 min',
    start: 'Empezar el torneo →',
  },

  play: {
    rounds: { r16: 'Octavos de final', qf: 'Cuartos de final', sf: 'Semifinal', f: 'Final' },
    roundFmt: '{round} · {n}/{total}',
    progressAria: 'Elección {n} de {total}',
    hint: '¿Cuál prefieres comer?',
    vs: 'VS',
    pickAria: 'Elegir {food}',
    same: 'El {pct} % eligió lo mismo',
  },

  result: {
    eyebrow: 'Tu comida campeona',
    champPct: 'El {pct} % de los jugadores también coronó este plato',
    champFirst: 'Eres de los primeros en terminar: aún no hay estadísticas.',
    fourTitle: 'Tus cuatro finalistas',
    retry: 'Jugar otra vez (nuevo cuadro)',
    shareTitle: 'Torneo de comida – ¿Qué prefieres comer?',
    shareText: '¡Mi comida campeona es {emoji} {food}! ¿Y la tuya?',
  },

  foods: {
    pizza: 'Pizza',
    burger: 'Hamburguesa',
    sushi: 'Sushi',
    noodles: 'Ramen',
    chicken: 'Pollo frito',
    tacos: 'Tacos',
    pasta: 'Espaguetis',
    curry: 'Curry',
    dumplings: 'Empanadas',
    steak: 'Bistec',
    hotpot: 'Cocido',
    hotdog: 'Hot dog',
    friedrice: 'Arroz frito',
    sandwich: 'Sándwich',
    stew: 'Paella',
    shrimp: 'Gambas rebozadas',
  },

  og: {
    brand: '🏆 Torneo de comida',
    defaultKicker: '¿Qué prefieres? · edición comida',
    defaultTitle: '¿Qué comida se lleva la corona?',
    defaultDesc: 'Dos platos cada vez · un campeón · cerca de un minuto',
  },

  faq: [
    { q: '¿Cómo funciona el torneo de comida?', a: 'Dieciséis platos se sortean en un cuadro al azar. En cada duelo aparecen dos: toca el que prefieres comer y pasa de ronda. Octavos, cuartos, semifinales y final suman 15 elecciones, y el último plato en pie es tu campeón.' },
    { q: '¿Los porcentajes son reales?', a: 'Sí. Cada elección se cuenta de forma anónima en nuestro servidor, una sola vez por navegador en cada duelo. Un porcentaje solo aparece cuando suficientes personas han jugado ese mismo duelo; antes de eso preferimos no mostrar nada que inventar un número.' },
    { q: '¿Puedo volver a jugar o compartir mi resultado?', a: 'Juega todas las veces que quieras: cada partida tiene un cuadro nuevo al azar, así que los duelos cambian. Con los botones de compartir puedes mandar tu campeón a tus amigos y ver qué eligen ellos.' },
    { q: '¿Por qué estos dieciséis platos?', a: 'Son platos que se adoran en todo el mundo, de la comida callejera a la comida casera. Los nombres siguen cómo se dicen en español, pero los platos son los mismos en todos los idiomas, así que los porcentajes reúnen a jugadores de todos los países.' },
  ],

  privacy: {
    title: 'Política de privacidad | Torneo de comida',
    description: 'Política de privacidad del Torneo de comida: recuento anónimo de elecciones, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Torneo de comida (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Tus elecciones se envían a nuestro servidor solo como totales anónimos (qué plato ganó cada duelo y qué plato coronaste), sin nombre ni identificador personal. Durante el uso pueden recopilarse automáticamente algunos datos, como se describe abajo.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma y los duelos ya contados, mostrar anuncios y entender cómo se usa. Puedes rechazarlos o borrarlos en los ajustes del navegador; en ese caso algunas funciones podrían no ir como se espera.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Más información y preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (visitas, torneos terminados, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política de privacidad, contacta con el responsable del sitio.'],
      ['6. Fecha de vigencia', 'Esta política es válida desde el 29 de septiembre de 2026.'],
    ],
    back: '← Volver al Torneo de comida',
  },
};
