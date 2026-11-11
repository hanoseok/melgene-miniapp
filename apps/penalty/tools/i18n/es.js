/* Castigo con cartas (Penalty Card Flip) — español (/es/ ; el idioma viene de la cookie o de la preferencia guardada)
 * La lógica está en penalty-core.js; todos los textos visibles están aquí. Las claves que terminan en Html admiten HTML (solo <br>, <em> y <a>).
 * Pantallas: inicio (gancho + botón + anuncio) → ajustes (jugadores, cartas de castigo, castigos, nombres) → volteo (cartas boca abajo) → final (quién recibe el castigo + pantalla final común).
 * La FAQ solo aparece en la pantalla final común. Conserva tal cual los marcadores {n} {k}.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap',
    display: "'Baloo 2'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Castigo con cartas – sortea penitencias para la fiesta',
    description: 'Juego gratis de cartas para sortear castigos en fiestas y noches de copas. Elige cuántos jugadores y cartas de castigo, y voltea las cartas boca abajo una a una. Sin registro.',
    ogTitle: 'Castigo con cartas 🃏 Voltea la carta, sortea el castigo',
    ogDescription: 'Sorteo justo de castigos para fiestas, barajado en tu navegador.',
  },
  siteName: 'Castigo con cartas',
  privacyLink: 'Política de privacidad',

  hero: {
    h1Kicker: 'Castigo con cartas',
    h1Html: 'Voltea las cartas,<br><em>saca el castigo</em>',
    hook: 'Una carta boca abajo por jugador. Algunas esconden un castigo y el resto están a salvo. ¿A quién le toca esta vez?',
  },

  ui: {
    playersLabel: '¿Cuántos jugadores?',
    playersDec: 'Un jugador menos',
    playersInc: 'Un jugador más',
    penaltyLabel: '¿Cuántas cartas de castigo?',
    penaltyDec: 'Una carta de castigo menos',
    penaltyInc: 'Una carta de castigo más',
    penaltyHint: 'Empieza en aproximadamente un tercio de los jugadores. Puedes cambiarlo.',
    itemsLabel: 'Lista de castigos',
    itemsHint: 'Un castigo por línea. Las cartas de castigo sacan de esta lista en orden aleatorio. Edítala como quieras.',
    itemsPh: 'Cantar una canción\nBrindar con un discurso corto',
    resetItems: 'Volver a los castigos de ejemplo',
    itemsCount: '{count} líneas',
    namesBtn: '+ Añadir nombres (opcional)',
    namesLabel: 'Nombres, en orden de turno',
    namesPh: 'Lucía\nDiego\nMarta',
    namesHint: 'Si lo dejas vacío, los turnos se muestran como 1.º, 2.º, 3.º. Puedes poner menos nombres que jugadores.',
    start: 'Barajar las cartas 🃏',
    begin: 'Empezar',
    setupTitle: 'Ajustes de la partida',
    fair: 'Barajado una vez con aleatoriedad criptográfica · nada sale de tu navegador',
  },

  errors: {
    playersRange: 'Elige entre 2 y 12 jugadores.',
    penaltiesRange: 'Las cartas de castigo van de 1 hasta el número de jugadores.',
    itemsEmpty: 'Escribe al menos un castigo.',
    itemsTooMany: 'Puedes usar hasta 30 castigos.',
    namesTooMany: 'Hay más nombres que jugadores. Quita un nombre o añade un jugador.',
    badLink: 'Este enlace de resultado está roto o incompleto, así que no se puede mostrar nada.',
  },

  draw: {
    progress: '{done}/{n} volteadas',
    left: 'Quedan {n} cartas',
    turn: 'Le toca a: {who}',
    turnNum: 'Turno {k}',
    numbered: 'Jugador {k}',
    pick: 'Toca cualquier carta boca abajo. Todas quedaron fijadas al barajar.',
    gridAria: 'Cartas de castigo boca abajo',
    cardAria: 'Carta {k}, boca abajo',
    penaltyTag: '¡Castigo!',
    safeTag: 'A salvo',
    revealPenalty: '{who}: {text}',
    revealSafe: '{who} se salva esta vez',
    revealNone: 'Toca una carta para ver el resultado aquí.',
    flipAll: 'Voltear todas',
    reshuffle: 'Barajar de nuevo',
    seeResults: 'Ver los resultados',
    done: 'Todas las cartas están volteadas.',
    live: '{who}: {text}',
    liveSafe: '{who}: a salvo',
  },

  result: {
    heading: 'Quién se lleva el castigo',
    sharedBadge: '🃏 Resultado compartido',
    sharedNote: 'Este es el resultado guardado en el enlace. No se vuelve a barajar.',
    summary: '{k} castigo · {s} a salvo',
    summaryMany: '{k} castigos · {s} a salvo',
    listHead: 'Castigos de esta ronda',
    safeList: 'A salvo: {names}',
    copy: 'Copiar como texto',
    copied: 'Resultado copiado',
    copyLink: 'Copiar enlace',
    linkCopied: 'Enlace copiado. Quien lo abra verá exactamente este resultado.',
    again: 'Pruébalo tú también',
    edit: 'Cambiar ajustes',
    textTitle: '🃏 Resultado de Castigo con cartas',
    textSafe: 'a salvo',
    shareTitle: 'Castigo con cartas',
    shareText: 'Voltea las cartas y saca un castigo para la fiesta 🃏',
  },

  og: {
    brand: '🃏 Castigo con cartas',
    kicker: 'Castigos de fiesta · una carta a la vez',
    title: 'Saca el castigo volteando cartas',
    desc: 'Aleatorio, justo y listo en segundos',
    sample: 'Cantar una canción',
  },

  defaults: [
    'Cantar una canción (basta con el estribillo)',
    'Brindar con una frase',
    'Hacer una pose supertierna',
    'Servir agua a la persona de tu izquierda',
    'Bailar robot durante 10 segundos',
    'Presentarte otra vez con una frase más',
    'Poner la canción que elija la persona de tu derecha',
    'Contar un chiste sobre ti mismo',
    'Leer la siguiente frase con voz de tráiler de cine',
    'Adivinar a la primera la canción favorita del siguiente',
  ],

  faq: [
    { q: '¿De verdad el barajado es justo?', a: 'Sí. Al barajar, las cartas se colocan una sola vez con el generador de números aleatorios criptográfico de tu navegador (crypto.getRandomValues), usando muestreo por rechazo y el barajado de Fisher–Yates. Todo queda fijado en ese momento, así que no importa qué carta toque cada uno.' },
    { q: '¿Cómo se eligen los textos de castigo?', a: 'Cada carta de castigo toma una línea de tu lista en orden aleatorio. Si hay menos líneas que cartas de castigo, se vuelve a usar la lista barajada. Ajusta las líneas antes de barajar para que encajen con tu grupo.' },
    { q: '¿Se puede rechazar un castigo?', a: 'Sí. Los castigos son para divertirse y siempre son voluntarios. Si alguien no quiere hacer uno, el grupo puede cambiarlo por otro más suave.' },
    { q: '¿Cómo comparto el resultado con el grupo?', a: 'En la pantalla de resultados, toca «Copiar como texto» para pegar la lista en el chat, o «Copiar enlace». El enlace guarda este resultado exacto: quien lo abra verá las mismas cartas sin que se vuelva a barajar.' },
  ],

  privacy: {
    title: 'Política de privacidad | Castigo con cartas',
    description: 'Política de privacidad de Castigo con cartas: nombres, castigos y resultados se quedan en tu navegador; cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Castigo con cartas (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recogemos', 'El Servicio funciona sin cuenta ni inicio de sesión. Los nombres, los castigos y los resultados que introduces solo se procesan en tu navegador y no se envían a nuestro servidor. Tus últimos ajustes se guardan en el almacenamiento local de tu navegador, en tu dispositivo, y puedes borrarlos cuando quieras. Cuando copias un enlace de resultado, los nombres, los castigos y los resultados se escriben dentro del propio enlace y solo los ve quien lo reciba de tu parte.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar el idioma y los ajustes, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en la configuración del navegador; si lo haces, algunas funciones podrían no funcionar como se espera.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este sitio y a otros. Puedes saber más y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y nuestros propios contadores agregados, que solo guardan totales diarios por idioma (visitas, partidas empezadas y terminadas). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes cualquier pregunta sobre esta política, contacta con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está en vigor desde el 11 de noviembre de 2026.'],
    ],
    back: '← Volver a Castigo con cartas',
  },
};
