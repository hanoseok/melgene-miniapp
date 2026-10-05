/* Portal Melgene Apps (hub) — español (/es/).
 * privacy.introHtml y el cuerpo de privacy.sections son HTML; el resto es texto plano.
 * ui lo usa script.js y se incrusta en la página como window.PAGE_I18N.
 * Sin spoilers: los textos de la selección describen el ambiente de cada app, nunca sus preguntas ni resultados reales.
 * Español neutro con tuteo (sirve para España y Latinoamérica). */
module.exports = {
  siteName: 'Melgene Apps',
  // 머리글 워드마크: 'Melgene' + 작은 배지 (공통 STRINGS.es.brandBadge 와 같아야 한다)
  brand: { word: 'Melgene', badge: 'Apps' },
  typography: { display: "'Gabarito', var(--font-sans)" },
  meta: {
    title: 'Minijuegos gratis y tests de personalidad | Melgene Apps',
    description:
      'Minijuegos gratis y tests de personalidad que se abren al instante en el navegador. Sin descargas ni registro, y cada miniapp dura un minuto.',
    ogTitle: 'Melgene Apps: minijuegos gratis y tests de personalidad',
    ogDescription: 'Minijuegos, tests y apps para crear. Sin descargas ni registro: toca una y juega en un minuto.',
  },
  homeAria: 'Inicio de Melgene Apps',
  h1: 'Minijuegos gratis y tests de personalidad',
  curation: {
    h2: 'Mini apps de hoy',
    items: [
      {
        id: 'mole',
        kicker: 'Juego de reflejos',
        headline: 'Golpea topos, esquiva bombas',
        blurb: 'Tócalos antes de que se escondan. 30 segundos, un título.',
      },
      {
        id: 'nickname',
        kicker: 'Hazlo tú',
        headline: 'Un apodo que va contigo',
        blurb: 'Elige un estilo y consigue un apodo nuevo con un toque.',
      },
      {
        id: 'coinflip',
        kicker: '¿Indeciso?',
        headline: 'Cara o cruz, o un dado',
        blurb: 'Lanza una moneda o hasta tres dados, siempre al azar.',
      },
      {
        id: 'invite',
        kicker: 'Hazlo tú',
        headline: 'Crea tu invitación de Halloween',
        blurb: 'Pon los datos de la fiesta, elige un tema y guárdala o envíala.',
      },
      {
        id: 'lunch',
        kicker: '¿No sabes qué comer?',
        headline: 'Gira la tragaperras y decide',
        blurb: 'Elige comida y ánimo y deja que la máquina decida.',
      },
      {
        id: 'merge',
        kicker: 'Juego rápido',
        headline: 'Suelta, combina y crece',
        blurb: 'Dos iguales se fusionan en algo más grande. ¡Que no se desborde el frasco!',
      },
      {
        id: 'costume',
        kicker: 'Test de personalidad',
        headline: '¿De qué te disfrazas este Halloween?',
        blurb: 'Responde unas situaciones y descubre tu disfraz ideal.',
      },
      {
        id: 'ghost',
        kicker: 'Hazlo tú',
        headline: 'Crea tu propio fantasmita',
        blurb: 'Elige forma, cara y sombrero, y guárdalo o compártelo.',
      },
      {
        id: 'team',
        kicker: 'Hacer equipos',
        headline: 'Equipos al azar y justos en un toque',
        blurb: 'Escribe los nombres, elige cuántos equipos y mezcla.',
      },
      {
        id: 'lovestyle',
        kicker: 'Test de personalidad',
        headline: '¿Qué tipo de pareja eres?',
        blurb: 'Diez pequeños momentos en pareja para descubrir cómo amas.',
      },
      {
        id: 'animal',
        kicker: 'Test de personalidad',
        headline: '¿Qué animal eres?',
        blurb: 'Ocho momentos cotidianos, dos minutos. Conoce tu lado salvaje.',
      },
      {
        id: 'game2048',
        kicker: 'Juego de lógica',
        headline: 'Desliza, combina y llega a 2048',
        blurb: 'Une números iguales. El puzle clásico, edición Halloween.',
      },
      {
        id: 'aura',
        kicker: 'Test de personalidad',
        headline: '¿De qué color es tu aura?',
        blurb: 'Responde a unos momentos cotidianos y descubre tu brillo.',
      },
      {
        id: 'candy-catch',
        kicker: 'Juego rápido',
        headline: 'Atrapa los dulces que caen',
        blurb: 'Mueve tu cubo de calabaza y esquiva todo lo que da miedo.',
      },
    ],
  },
  browse: {
    h2: 'Todas las miniapps',
    searchLabel: 'Buscar miniapps',
    searchPlaceholder: 'Buscar miniapps',
    catLabel: 'Categorías',
    sortLabel: 'Ordenar por',
  },
  ui: {
    cats: { all: 'Todas', game: 'Juegos', test: 'Tests', create: 'Crear', vote: 'Votar' },
    sorts: { popular: 'Populares', rating: 'Mejor valoradas', newest: 'Más nuevas' },
    totalHtml: 'Ya se ha jugado <strong>{n} veces</strong>',
    play: 'Jugar',
    newBadge: 'NUEVO',
    plays: '{n} partidas',
    ratingAria: 'Valoración de {avg} sobre 5 ({votes} valoraciones)',
    prev: 'Recomendación anterior',
    next: 'Siguiente recomendación',
    goTo: 'Ver recomendación {n}',
    count: '{n} apps',
    countOne: '1 app',
    emptyCat: 'Todavía no hay miniapps en esta categoría.',
    emptySearch: 'Ninguna miniapp coincide con «{q}». Prueba con otra palabra o míralas todas.',
    reset: 'Ver todas',
  },
  faqTitle: 'Preguntas frecuentes',
  faq: [
    [
      '¿Qué es Melgene Apps?',
      'Una colección gratuita de miniapps: minijuegos rápidos, tests de personalidad y apps que convierten unas pocas respuestas en algo tuyo. Cada una dura un minuto más o menos y se abre directamente en el navegador.',
    ],
    [
      '¿Tengo que descargar algo o registrarme?',
      'No. Cada minijuego y cada test es una página web que funciona en el móvil, la tableta y el ordenador: envía el enlace y tus amigos podrán jugar al instante. Si juegas a menudo, usa «Añadir a pantalla de inicio» en el menú del navegador para tenerla como una app.',
    ],
    [
      '¿Se recopilan datos personales?',
      'No. Nunca pedimos tu nombre, correo ni teléfono. Los corazones, las valoraciones y las partidas son totales anónimos por app, y un enlace para compartir solo guarda las respuestas necesarias para mostrar el resultado.',
    ],
    [
      '¿Cada cuánto hay miniapps nuevas?',
      'Vamos sumando juegos y tests nuevos según lo que está de moda. Las novedades llevan una etiqueta NUEVO durante dos semanas y salen primero al ordenar por «Más nuevas».',
    ],
  ],
  privacyLink: 'Política de privacidad',
  og: {
    h1Html: 'Minijuegos gratis<br>y tests de personalidad',
    tag: 'Sin descargas. Sin registro. A jugar.',
  },
  privacy: {
    title: 'Política de privacidad | Melgene Apps',
    description:
      'Política de privacidad de Melgene Apps: publicidad (Google AdSense), partidas, corazones y valoraciones anónimos, cookies y almacenamiento del navegador.',
    h1: 'Política de privacidad',
    introHtml:
      'Melgene Apps (el «Servicio») es una colección de miniapps que se usan sin cuenta. Respetamos tu privacidad y solo tratamos la información mínima necesaria para que el Servicio funcione, como se describe a continuación.',
    sections: [
      [
        '1. Información que no recopilamos',
        'El Servicio no pide ni recopila datos personales como tu nombre, correo electrónico, número de teléfono o una cuenta. Lo que escribes en cada miniapp se procesa, por defecto, solo en tu propio navegador.',
      ],
      [
        '2. Contadores anónimos: partidas, corazones y valoraciones (Supabase)',
        'Para mostrar partidas, corazones y valoraciones, guardamos únicamente lo siguiente en Supabase (un servicio de base de datos): totales acumulados por miniapp (partidas y corazones), valoraciones de 1 a 5 estrellas por miniapp y totales diarios por fecha, miniapp e idioma (páginas vistas, partidas completadas y si se mostró un anuncio). Para no contar dos veces la misma visita en menos de 30 segundos, el servidor guarda brevemente un hash unidireccional de tu dirección IP y lo borra automáticamente, normalmente en menos de un día. Para contar una sola valoración por navegador, tu navegador guarda un identificador aleatorio y el servidor solo almacena su hash. Cuando creas un enlace para compartir, guardamos solo las respuestas necesarias para mostrar ese mismo resultado. Nada de esto se usa para identificarte.',
      ],
      [
        '3. Publicidad (anuncios automáticos de Google AdSense)',
        'El Servicio muestra anuncios mediante los anuncios automáticos de Google AdSense, por lo que Google decide dónde aparecen. Google y sus socios pueden usar cookies para mostrar anuncios según tus intereses. Puedes revisar y cambiar la configuración de anuncios personalizados en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.',
      ],
      [
        '4. Estadísticas (Google Analytics)',
        'El Servicio puede usar Google Analytics (GA4) para obtener estadísticas de visitas y mejorar el Servicio. Estos datos se usan solo con fines estadísticos y no te identifican personalmente.',
      ],
      [
        '5. Cookies y almacenamiento del navegador',
        'Ajustes como tu idioma, la última categoría y el último orden que usaste o las valoraciones que diste se guardan solo en tu navegador (localStorage y una cookie que recuerda tu idioma). Puedes borrar o bloquear las cookies y los datos del sitio en cualquier momento desde la configuración del navegador.',
      ],
      ['6. Contacto', 'Si tienes alguna pregunta sobre esta política de privacidad, ponte en contacto con el responsable del sitio.'],
      ['7. Fecha de entrada en vigor', 'Esta política está en vigor desde el 26 de septiembre de 2026.'],
    ],
    back: '← Volver a Melgene Apps',
  },
};
