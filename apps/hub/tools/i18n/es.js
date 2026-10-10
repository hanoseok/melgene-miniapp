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
        id: 'qr',
        kicker: "Herramienta útil",
        headline: "Convierte un enlace en código QR",
        blurb: "Enlace, texto o Wi-Fi. Descarga PNG o SVG desde tu navegador.",
      },
      {
        id: 'randnum',
        kicker: "Sorteo justo",
        headline: "Números al azar con un toque",
        blurb: "Cualquier rango, con o sin repetir. Ideal para sorteos.",
      },
      {
        id: 'coffee',
        kicker: "Test de personalidad",
        headline: "¿Qué café eres?",
        blurb: "12 preguntas cotidianas, 2 minutos. Encuentra tu café ideal.",
      },
      {
        id: 'sweeper',
        kicker: "Clásico de lógica",
        headline: "Esquiva las minas, despeja el tablero",
        blurb: "Lee los números y marca el peligro. Primer toque seguro.",
      },
      {
        id: 'hangul-name',
        kicker: "Día del hangul",
        headline: "Tu nombre escrito en coreano",
        blurb: "Escribe tu nombre y obtenlo en hangul en una tarjeta.",
      },
      {
        id: 'dice',
        kicker: "Para juegos de mesa",
        headline: "Tira los dados en el navegador",
        blurb: "Hasta seis dados, del d4 al d20. Tiradas justas.",
      },
      {
        id: 'brick',
        kicker: 'Clásico de arcade',
        headline: 'Una pelota contra un muro neón',
        blurb: 'Rebótala con tu paleta y rompe todo. 3 vidas, cada vez más rápido.',
      },
      {
        id: 'mentalage',
        kicker: 'Test de personalidad',
        headline: '¿Cuántos años tiene tu mente?',
        blurb: '12 preguntas cotidianas, 2 minutos. Tu edad mental en número.',
      },
      {
        id: 'fancytext',
        kicker: 'Hazlo tú',
        headline: 'Dale estilo a tus letras',
        blurb: 'Convierte tu texto en letras bonitas y cópialo con un toque.',
      },
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
        id: 'lotto',
        kicker: '¿Probamos suerte?',
        headline: 'Números de lotería al azar',
        blurb: 'Elige un juego y saca hasta cinco apuestas.',
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
  // Pie de página de todas las páginas del portal (Quiénes somos · Guías · Términos · Privacidad · Contacto). Texto plano (se escapa).
  footerNav: { about: 'Quiénes somos', guides: 'Guías', terms: 'Términos de uso', privacy: 'Privacidad', contact: 'Contacto' },
  aboutPage: {
    title: 'Quiénes somos | Melgene Apps',
    description: 'Melgene Apps es un pequeño estudio independiente que crea minijuegos, tests de personalidad y herramientas creativas gratis para el navegador en 12 idiomas.',
    h1: 'Sobre Melgene Apps',
    lead: 'Melgene Apps es un pequeño estudio independiente que crea miniapps gratuitas que se abren en cualquier navegador: juegos rápidos, tests de personalidad para pasar el rato, pequeñas herramientas creativas y ayudas para las decisiones de cada día. Sin descargas, sin cuenta, y la mayoría dura más o menos un minuto.',
    sections: [
      {
        h: 'Qué hacemos',
        p: [
          'Cada miniapp de Melgene hace una sola cosa, pero la hace bien. Algunas son juegos tipo arcade que terminas en un descanso, como golpea al topo, rompe ladrillos o un puzle de fusionar. Otras son tests de personalidad que convierten unas cuantas situaciones cotidianas en un resultado divertido para compartir. Y otras te ayudan a crear algo, como letras bonitas, una invitación de fiesta o un apodo, o a resolver una decisión pequeña con una ruleta, un juego de la escalera o lanzando una moneda.',
          'Publicamos apps nuevas con frecuencia, muchas veces según la temporada o las fiestas, y seguimos mejorando las anteriores según cómo las usa la gente de verdad.',
        ],
      },
      {
        h: 'Por qué las hacemos',
        p: ['Creemos que los mejores ratitos en internet deben ser rápidos, amables y gratis. Muchas webs de juegos o tests los esconden tras registros, ventanas emergentes e invitaciones a instalar una app. Nosotros buscamos lo contrario: tocas un enlace, la app se abre, juegas y, con un toque más, se la mandas a un amigo.'],
      },
      {
        h: 'Cómo se crea y se prueba cada app',
        p: ['Cada app empieza con un plan breve: para quién es, cuánto debe durar una partida y qué muestra la pantalla de resultado. Después la construimos como una página web ligera y la probamos antes de publicarla:'],
        list: [
          'En pantallas de móvil pequeñas (360 px de ancho), además de tabletas y navegadores de ordenador',
          'En los 12 idiomas, comprobando que cada línea cabe y se lee con naturalidad',
          'Con revisiones automáticas de enlaces rotos, traducciones que faltan y estructura de la página',
          'Sin spoilers: la pantalla de inicio despierta la curiosidad, pero nunca revela preguntas ni resultados',
        ],
      },
      {
        h: 'Pensadas para el móvil, en 12 idiomas',
        p: ['La mayoría juega desde el móvil, así que cada app se diseña primero para una pantalla estrecha. Melgene Apps está disponible en español, inglés, japonés, chino, coreano, francés, alemán, tailandés, vietnamita, italiano, portugués y ruso. Escribimos cada idioma pensando en sus lectores en lugar de traducir palabra por palabra, y usamos los nombres que la gente de cada país busca de verdad.'],
      },
      {
        h: 'Respetuosas con tu privacidad',
        p: ['Nunca necesitas una cuenta y nunca te pedimos tu nombre, tu correo ni tu teléfono. Lo que escribes en una app se procesa en tu propio navegador. Las partidas, los corazones y las valoraciones son solo totales anónimos por app. El sitio se mantiene con publicidad de Google AdSense; puedes leer los detalles en nuestra Política de privacidad.'],
      },
      {
        h: 'Una nota sobre los tests de personalidad',
        p: ['Nuestros tests de personalidad, de edad mental y otros cuestionarios parecidos están hechos para entretener. No son evaluaciones psicológicas, médicas ni profesionales, y ningún resultado debería usarse para tomar decisiones importantes sobre ti o sobre otra persona. Disfrútalos como tema de conversación y como un rato divertido.'],
      },
      {
        h: 'Escríbenos',
        p: ['Leemos todos los mensajes. Si encuentras un fallo, tienes una idea para una miniapp nueva o quieres hablar de colaborar, visita nuestra página de contacto o escribe a contact@melgene.com.'],
      },
    ],
  },
  contactPage: {
    title: 'Contacto | Melgene Apps',
    description: 'Contacta con Melgene Apps por correo para opiniones, avisos de fallos, propuestas de colaboración o solicitudes de privacidad. Solemos responder en pocos días hábiles.',
    h1: 'Contacto',
    lead: '¿Tienes preguntas, ideas o algún problema? Somos un equipo pequeño y leemos cada mensaje nosotros mismos.',
    emailH: 'Correo electrónico',
    emailNote: 'Solemos responder en pocos días hábiles.',
    sections: [
      {
        h: 'Sobre qué puedes escribirnos',
        p: ['Puedes escribirnos sobre cualquier cosa relacionada con Melgene Apps, por ejemplo:'],
        list: [
          'Opiniones e ideas para nuevos minijuegos, tests o herramientas',
          'Avisos de fallos: una página que no carga, un botón que no responde o un texto cortado',
          'Errores de traducción o frases que suenan raras en tu idioma',
          'Propuestas de colaboración, licencias o prensa',
          'Solicitudes de privacidad y preguntas sobre datos o cookies',
        ],
      },
      {
        h: 'Si nos avisas de un fallo',
        p: ['Para arreglarlo rápido, indícanos el nombre de la miniapp, el idioma que usabas, tu dispositivo y navegador (por ejemplo, iPhone con Safari o Android con Chrome) y cuéntanos brevemente qué pasó. Una captura de pantalla ayuda mucho.'],
      },
      {
        h: 'Tiempo de respuesta',
        p: ['Solemos responder en pocos días hábiles; en épocas de vacaciones puede tardar algo más. Nunca te pediremos contraseñas ni datos de pago.'],
      },
    ],
  },
  termsPage: {
    title: 'Términos de uso | Melgene Apps',
    description: 'Términos de uso de Melgene Apps: minijuegos y tests gratis en el navegador, ofrecidos tal cual para entretener, normas de uso, enlaces para compartir y anuncios de terceros.',
    h1: 'Términos de uso',
    updated: 'Última actualización: 9 de octubre de 2026',
    lead: 'Estos términos de uso se aplican a Melgene Apps (el «Servicio»), incluido el portal y todas las miniapps de nuestros sitios. Al usar el Servicio, aceptas estos términos. Si no estás de acuerdo, por favor no uses el Servicio.',
    sections: [
      { h: '1. El Servicio', p: ['Melgene Apps ofrece gratis minijuegos, tests de personalidad, herramientas creativas y ayudas para decidir que funcionan en tu navegador. No hace falta cuenta. Podemos añadir, cambiar o retirar apps y funciones en cualquier momento.'] },
      { h: '2. Se ofrece tal cual', p: ['El Servicio se ofrece «tal cual» y «según disponibilidad», sin garantías de ningún tipo. Trabajamos para que funcione bien, pero no garantizamos que esté siempre disponible, libre de errores o que sirva para un fin concreto. En la medida en que lo permita la ley, no somos responsables de pérdidas o daños derivados de su uso.'] },
      { h: '3. Solo para entretener', p: ['Los resultados de los tests de personalidad, de edad mental, de los sorteos aleatorios y de funciones similares son para divertirse. No son consejos científicos, psicológicos, médicos, financieros ni profesionales. Un resultado aleatorio, como unos números de lotería, no aumenta tus posibilidades de ganar nada.'] },
      {
        h: '4. Uso aceptable',
        p: ['Al usar el Servicio, te comprometes a no:'],
        list: [
          'Usarlo para fines ilegales, dañinos o abusivos',
          'Introducir contenido de odio, acoso, sexualmente explícito o que vulnere derechos de otras personas',
          'Interrumpir o sobrecargar el Servicio, extraer datos de forma masiva o acceder sin autorización',
          'Manipular partidas, corazones, valoraciones o anuncios, también con herramientas automáticas o clics no válidos',
        ],
      },
      { h: '5. Lo que creas y compartes', p: ['Algunas apps te permiten escribir nombres o textos, crear una imagen o generar un enlace para compartir. Eres responsable de lo que introduces y compartes. Un enlace para compartir guarda solo la información necesaria para mostrar ese resultado y cualquiera que lo tenga puede abrirlo, así que no incluyas datos personales ni sensibles. Podemos eliminar los enlaces que incumplan estos términos.'] },
      { h: '6. Publicidad y cookies', p: ['El Servicio es gratuito porque se financia con anuncios. Los anuncios los sirven terceros como Google AdSense, que pueden usar cookies y tecnologías similares para mostrarlos y medirlos, incluidos anuncios personalizados. No controlamos el contenido de los anuncios de terceros ni los sitios a los que enlazan. Puedes saber más y gestionar tus preferencias en nuestra Política de privacidad y en la configuración de anuncios de Google.'] },
      { h: '7. Propiedad intelectual', p: ['El diseño, el código, los textos, las ilustraciones y demás materiales del Servicio pertenecen a Melgene Apps o a sus licenciantes y están protegidos por la ley. Puedes usar el Servicio con fines personales y no comerciales y compartir sus enlaces libremente. No copies, republiques ni vendas las apps o su contenido sin nuestro permiso.'] },
      { h: '8. Cambios en estos términos', p: ['Podemos actualizar estos términos de uso de vez en cuando y, cuando lo hagamos, cambiaremos la fecha que aparece al principio de esta página. Si sigues usando el Servicio después de un cambio, aceptas los términos actualizados.'] },
      { h: '9. Contacto', p: ['Si tienes dudas sobre estos términos, escribe a contact@melgene.com o usa nuestra página de contacto.'] },
    ],
  },
  guidesPage: {
    title: 'Guías y consejos de todas las miniapps | Melgene Apps',
    description: 'Cómo se juega, consejos y curiosidades de los minijuegos, tests de personalidad y herramientas de Melgene. Lee una guía corta y entra directo a la app.',
    h1: 'Guías y consejos',
    lead: 'Cada guía explica cómo funciona una miniapp, cómo mejorar y algunas cosas que conviene saber antes de empezar. Sin spoilers: las preguntas y los resultados siguen siendo una sorpresa.',
    read: 'Leer la guía',
    play: 'Jugar',
    empty: 'Las guías están en camino. ¡Vuelve pronto!',
  },
};
