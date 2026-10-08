/* Tirar dados — español (tú). Misma estructura que en.js (ver comentarios). */
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
    title: 'Tirar dados online – Simulador de dados',
    description: 'Tirar dados online con un solo toque: lanza de uno a seis dados a la vez, elige el d6 clásico o un d4, d8, d10, d12 y d20 para juegos de rol y mira el total al instante. Justo, gratis y sin registro.',
    ogTitle: 'Tirar dados 🎲 Dados online',
    ogDescription: 'Tira de uno a seis dados, del d6 al d20, y mira el total con un toque.',
  },
  siteName: 'Tirar dados',
  privacyLink: 'Política de privacidad',

  hero: {
    h1Kicker: 'Tirar dados online',
    h1Html: 'Agita, tira y<br>deja que decidan los <em>dados</em>',
    hook: 'Elige cuántos dados y de qué tipo, y tira. Para juegos de mesa, partidas de rol o decidir quién friega los platos.',
  },

  ui: {
    dieLetter: 'd',
    countLabel: '¿Cuántos dados?',
    typeLabel: 'Tipo de dado',
    typeHint: 'El d6 es el cubo clásico. Del d4 al d20 son para juegos de rol.',
    roll: 'Tirar los dados 🎲',
    rolling: 'Rodando…',
    keyHint: 'Truco: pulsa Espacio para tirar',
    idle: 'Listo cuando quieras',
    total: 'Total {n}',
    trayLabel: 'Bandeja de dados',
    live: 'Te ha salido {values}. Total {total}.',
    liveOne: 'Te ha salido {values}.',
    fair: 'Cada cara tiene exactamente la misma probabilidad (azar criptográfico)',
  },

  history: {
    title: 'Tus últimas 10 tiradas',
    note: 'Solo se guardan mientras esta página esté abierta.',
    item: '{dice}: {values} = {total}',
    itemOne: '{dice}: {values}',
  },

  result: {
    again: 'Tirar otra vez',
    shareTitle: 'Tirar dados – Tirar dados online',
    shareText: 'He tirado {dice} y me ha salido {values} = {total} 🎲',
    shareTextOne: 'He tirado {dice} y me ha salido {values} 🎲',
  },

  og: {
    brand: '🎲 Tirar dados',
    kicker: '1 a 6 dados · del d4 al d20',
    title: 'Tirar dados online',
    desc: 'Un toque y ves cada dado y el total',
  },

  faq: [
    { q: '¿El simulador de dados es realmente aleatorio y justo?', a: 'Sí. Cada resultado sale del generador aleatorio criptográfico de tu navegador (crypto.getRandomValues) con muestreo por rechazo, así que ninguna cara es ni un poquito más probable que otra. El resultado se decide antes de que empiece la animación; los dados rodando son solo para el espectáculo.' },
    { q: '¿Cuántos dados puedo tirar a la vez?', a: 'De uno a seis dados por tirada, todos del mismo tipo. La bandeja muestra cada dado y el total, y tus últimas diez tiradas se quedan en una pequeña lista mientras la página esté abierta.' },
    { q: '¿Qué son el d4, d8, d10, d12 y d20?', a: 'Son dados de 4, 8, 10, 12 y 20 caras, los que se usan en juegos de rol como Dungeons & Dragons. El número después de la d es el número de caras: un d20 da de 1 a 20, y 2d6 significa dos dados de seis caras.' },
    { q: '¿Puedo usarlo para juegos de mesa?', a: 'Claro. Úsalo cuando falten los dados, cuando necesites más de los que trae la caja o cuando juegues por videollamada. Con teclado, pulsa Espacio para tirar más rápido.' },
  ],

  privacy: {
    title: 'Política de privacidad | Tirar dados',
    description: 'Política de privacidad de Tirar dados: tus tiradas se quedan en tu navegador, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Tirar dados (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Tus ajustes de dados y tus resultados se procesan solo en tu navegador y no se envían a nuestro servidor. Aun así, al usar el Servicio puede recopilarse automáticamente cierta información, como se describe a continuación.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma, mostrar anuncios y entender cómo se utiliza. Puedes rechazarlas o eliminarlas en los ajustes de tu navegador; en ese caso, es posible que algunas funciones no se comporten como esperas.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, tiradas, valoraciones con estrellas). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está en vigor desde el 9 de octubre de 2026.'],
    ],
    back: '← Volver a Tirar dados',
  },
};
