/* Cara o cruz — español (tú). Misma estructura que en.js (ver comentarios). */
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
    title: 'Cara o cruz online: lanzar una moneda',
    description: '¿No te decides? Lanza una moneda online, cara o cruz, y deja que decida el azar. Ponle tú el nombre a los dos lados o tira de uno a tres dados. Gratis y sin registro.',
    ogTitle: 'Cara o cruz 🪙 Moneda y dados',
    ogDescription: 'Lanza la moneda o los dados y deja que decida el azar.',
  },
  siteName: 'Cara o cruz',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🪙 El desempate más justo',
    h1Kicker: 'Cara o cruz',
    h1Html: '¿Cara o cruz?<br>Que decida la <em>moneda</em>',
    hook: 'Ponle nombre a tus dos opciones, lanza la moneda y quédate con lo que salga. También puedes tirar dados.',
    facts: 'Moneda y dados · lados con tu nombre · un lanzamiento justo cada vez',
    start: 'Lanzar →',
  },

  tool: {
    title: 'A lanzar',
    tabCoin: 'Moneda',
    tabDice: 'Dados',
    namesLabel: 'Pon nombre a los dos lados',
    namesHint: 'Por defecto son cara y cruz. Cámbialos por tus opciones, como pizza y sushi.',
    sideA: 'Cara',
    sideB: 'Cruz',
    fieldA: 'Nombre del primer lado',
    fieldB: 'Nombre del segundo lado',
    throwCoin: 'Lanzar la moneda 🪙',
    diceLabel: '¿Cuántos dados?',
    rollDice: 'Tirar los dados 🎲',
  },

  count: { one: '{n} lanzamiento en esta sesión', other: '{n} lanzamientos en esta sesión' },
  countDice: { one: '{n} tirada en esta sesión', other: '{n} tiradas en esta sesión' },

  result: {
    titleCoin: 'Ha salido',
    titleDice: 'Has sacado',
    sum: 'Total {n}',
    tallyTitle: 'Esta sesión',
    tallySide: '{name} {n}',
    againCoin: 'Lanzar otra vez',
    againDice: 'Tirar otra vez',
    change: 'Volver al lanzamiento',
    shareTitle: 'Cara o cruz online',
    shareTextCoin: 'Lancé una moneda y salió {name} 🪙',
    shareTextDice: 'Tiré los dados y saqué {n} 🎲',
  },

  og: {
    brand: '🪙 Cara o cruz',
    kicker: 'Cara o cruz · moneda y dados',
    title: '¿Cara o cruz?',
    desc: 'Lanza la moneda o los dados · un lanzamiento justo decide',
  },

  faq: [
    { q: '¿Cómo funciona lo de cara o cruz?', a: 'Si quieres, ponle nombre a los dos lados y pulsa lanzar. El resultado se sortea primero y la moneda gira para mostrarlo, así que lo que ves es siempre el resultado real. En la pestaña Dados tiras de uno a tres dados de seis caras.' },
    { q: '¿Es realmente justo?', a: 'Sí. El resultado sale del generador aleatorio criptográfico de tu navegador (crypto.getRandomValues) con muestreo por rechazo, así que cara y cruz son exactamente igual de probables, y cada cara del dado también. La animación es solo decoración.' },
    { q: '¿Puedo usar mis propias opciones en lugar de cara y cruz?', a: 'Sí. Escribe dos nombres cualesquiera en los campos sobre la moneda, por ejemplo pizza y sushi, y el resultado mostrará el nombre del ganador. Si dejas un campo vacío vuelve el nombre por defecto.' },
    { q: '¿Qué significan los contadores del final?', a: 'Solo cuentan lo que has lanzado en esta página desde que la abriste, incluidas las veces que ha salido cada lado. Se reinician al recargar y no se envían a ningún sitio.' },
  ],

  privacy: {
    title: 'Política de privacidad | Cara o cruz',
    description: 'Política de privacidad de Cara o cruz: los nombres que escribes se quedan en tu navegador, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Cara o cruz (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Los nombres que escribes y tus resultados se procesan solo en tu navegador y no se envían a nuestro servidor. No obstante, mientras usas el Servicio puede recopilarse automáticamente cierta información, como se describe a continuación.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían no funcionar como se espera.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Puedes saber más y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (visitas, lanzamientos, valoraciones con estrellas). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política de privacidad, ponte en contacto con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está en vigor desde el 5 de octubre de 2026.'],
    ],
    back: '← Volver a Cara o cruz',
  },
};
