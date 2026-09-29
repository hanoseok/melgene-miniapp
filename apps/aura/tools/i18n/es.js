/* Test de aura — Español (es/)
 * Mismos 8 id de aura y mismo orden de preguntas/opciones que aura-core.js (los pesos solo están allí).
 * Claves con Html: HTML tal cual (solo <br> y <em>). El cuerpo de privacy.sections también es HTML.
 * Sin spoilers: meta / og.default* / start / faq no nombran ningún color de aura ni citan preguntas.
 * types.<id>.word = palabras de color básicas (separadas por comas) — solo para el control de spoilers.
 * Variables: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap',
    display: "'Comfortaa'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Test de aura – ¿De qué color es tu aura?',
    description: '¿De qué color es tu aura? Haz este test de aura gratis: 12 preguntas del día a día, unos 2 minutos y sin registro. Descubre la luz que irradia tu energía.',
    ogTitle: 'Test de aura ✨ ¿De qué color es tu aura?',
    ogDescription: 'Un test de aura gratis de 2 minutos. Responde 12 preguntas cotidianas y descubre el color de tu energía.',
  },
  siteName: 'Test de aura',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '✨ Lectura de aura',
    h1Kicker: 'Test de aura',
    h1Html: '¿De qué color<br>es tu <em>aura</em>?',
    hook: 'Todo el mundo irradia su propia luz. Doce pequeños momentos de la vida diaria van a revelar cuál es la tuya.',
    metaTime: '⏱️ Unos 2 minutos',
    metaCount: '🔮 12 preguntas',
    start: 'Leer mi aura →',
  },

  quiz: {
    backAria: 'Pregunta anterior',
    progressAria: 'Progreso',
    qLabel: 'P{n}',
  },

  loading: {
    text: 'Leyendo tu aura…',
    sub: 'Dejando que los colores se asienten',
  },

  result: {
    title: 'Test de aura: mi aura es {name}',
    eyebrow: 'El color de tu aura es',
    strengthsLabel: 'Tus poderes de luz',
    othersLabel: 'Cómo te ven los demás',
    bestLabel: 'Aura afín',
    clashLabel: 'Aura opuesta',
    sameShare: 'El {pct} % de los jugadores tiene esta aura',
    shareText: 'Mi aura es {name} {emoji}: «{vibe}» ¿De qué color es la tuya?',
    ctaStrong: 'Alguien te ha enviado su aura',
    ctaSub: '¿De qué color es la tuya? Son 2 minutos.',
    retry: 'Repetir el test',
  },

  og: {
    eyebrow: 'El color de mi aura',
    brand: '✨ Test de aura',
    defaultKicker: 'Test de aura',
    defaultTitle: '¿De qué color es tu aura?',
    defaultDesc: '12 preguntas del día a día · unos 2 minutos',
  },

  faq: [
    { q: '¿Cómo funciona el test de aura?', a: 'Cada respuesta suma puntos a algunos colores de aura, y el que acumula más puntos es tu resultado. Si hay empate, decide una regla fija, así que las mismas respuestas siempre dan la misma aura.' },
    { q: '¿Qué es un aura?', a: 'En la espiritualidad popular, el aura es un halo de energía que rodea a cada persona, y cada color se asocia a un estado de ánimo y una personalidad. Este test juega con esa idea: es para divertirte y conocerte un poco, no es ciencia.' },
    { q: '¿Puede cambiar el color de mi aura?', a: 'Sí. El resultado depende solo de cómo respondas hoy, así que otro estado de ánimo o una nueva etapa pueden sacar otro color. Repítelo cuando quieras.' },
    { q: '¿Se guardan mis respuestas?', a: 'No. Tus respuestas se calculan en tu navegador y nunca se guardan. Solo contamos de forma anónima qué aura salió, para mostrar lo común que es cada resultado.' },
  ],

  privacy: {
    title: 'Política de privacidad | Test de aura',
    description: 'Política de privacidad del Test de aura: cookies, publicidad y estadísticas anónimas.',
    h1: 'Política de privacidad',
    introHtml: 'El Test de aura (el «Servicio») respeta tu privacidad y solo trata la información mínima necesaria, como se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan en tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos de forma anónima qué color de aura salió, para mostrar lo común que es cada resultado.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían no funcionar bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y ajustes en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Guardamos totales diarios anónimos (páginas vistas, tests terminados, valoraciones) para mejorar el Servicio. No permiten identificarte.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política, contacta con el responsable del sitio.'],
      ['6. Fecha de vigencia', 'Esta política está vigente desde el 30 de septiembre de 2026.'],
    ],
    back: '← Volver al test de aura',
  },

  questions: [
    { q: 'Un sábado por la mañana tranquilo y sin planes. ¿Cómo empieza?', choices: [
      'Con una carrera al amanecer. Necesito moverme.',
      'Escribo al grupo: «¿Escapada? Salimos en una hora».',
      'Riego mis plantas y me doy una vuelta por el mercado',
      'Café, una libreta y silencio absoluto',
    ] },
    { q: 'Una amiga te escribe: «Oye… ¿podemos hablar?». Tú…', choices: [
      'La llamas enseguida. Sea lo que sea, aquí estoy.',
      'Escuchas primero y luego la ayudas a ordenar ideas',
      'Te presentas con snacks y un plan para hacerla reír',
      'Le mandas un mensaje largo y sincero con una canción que encaja',
    ] },
    { q: 'Llegas a una fiesta donde casi no conoces a nadie.', choices: [
      'A los diez minutos ya hablo con media sala',
      'Soy quien hace reír a todo el mundo',
      'Encuentro a una persona y hablamos horas en un rincón',
      'Propongo un juego y meto a todos',
    ] },
    { q: 'Puedes vivir donde quieras durante un año. Eliges…', choices: [
      'Una casita al borde de un bosque',
      'Un pueblo tranquilo junto al mar',
      'Un ático acogedor lleno de material de arte',
      'El centro de una gran ciudad llena de vida',
    ] },
    { q: 'El trabajo en grupo es para mañana y no hay nada hecho.', choices: [
      'Tomo las riendas y reparto las tareas',
      'Hago un plan paso a paso para que nadie entre en pánico',
      'De madrugada se me ocurre la idea que lo salva todo',
      'Miro quién está agobiado y me aseguro de que todos estén bien',
    ] },
    { q: 'Puedes tener un superpoder. ¿Cuál?', choices: [
      'Leer mentes',
      'Teletransportarme a cualquier sitio',
      'Curar cualquier herida o pena',
      'Hacer sonreír a cualquiera al instante',
    ] },
    { q: '¿Qué llena más la galería de fotos de tu móvil?', choices: [
      'Selfis y fotos de grupo con la gente que quiero',
      'Cielos, flores, árboles: naturaleza por todas partes',
      'Ángulos raros, luces con ambiente, pequeñas obras de arte',
      'Lugares donde he estado y mis aventuras',
    ] },
    { q: 'El estrés se acumula. ¿Qué te ayuda?', choices: [
      'Ordenar y escribir una lista de tareas bien clara',
      'Un entrenamiento duro hasta despejar la cabeza',
      'Tiempo a solas para pensarlo todo con calma',
      'Vídeos graciosos y algo de picar. Ya me preocuparé.',
    ] },
    { q: '¿Qué suele pensar la gente cuando te conoce?', choices: [
      '«Mucha seguridad. Algo de intensidad».',
      '«Cuánta calidez y dulzura».',
      '«Transmite calma. Se puede confiar».',
      '«Puro misterio. No se parece a nadie».',
    ] },
    { q: '¿Qué regalo te haría más ilusión?', choices: [
      'Una planta o algo hecho a mano',
      'Entradas para un concierto con mis mejores amigos',
      'Un libro raro o una libreta preciosa',
      'Una escapada sorpresa de fin de semana',
    ] },
    { q: 'Empieza una discusión. Tú…', choices: [
      'Mantienes la calma y buscas lo justo',
      'Pides perdón primero. La paz importa más.',
      'Sueltas una broma para quitar tensión',
      'Das un paso atrás y lo piensas más tarde',
    ] },
    { q: 'Elige el lema que más se parece a ti.', choices: [
      'La vida es una aventura: ¡di que sí!',
      'Crecer despacio, echar raíces hondas.',
      'Primero soñarlo, luego hacerlo realidad.',
      'Querer a lo grande.',
    ] },
  ],

  types: {
    red: {
      name: 'Rojo rubí',
      word: 'rojo, roja',
      vibe: 'Fuego puro: audacia, empuje y muchísima vida.',
      desc: 'Tu aura arde fuerte y cálida. Eres de hacer: cuando algo te importa, te lanzas y piensas por el camino. Los retos te despiertan en vez de asustarte, y tu energía arrastra a los demás contigo. Lo sientes todo con intensidad, de la emoción al enfado, y no lo escondes. Justo esa sinceridad es la que hace que la gente confíe en ti.',
      strengths: ['Empuje sin miedo', 'Energía contagiosa', 'Sinceridad sin rodeos'],
      others: 'Los demás te ven como la chispa del grupo: quien pone las cosas en marcha y dice lo que todos piensan.',
    },
    orange: {
      name: 'Naranja atardecer',
      word: 'naranja',
      vibe: 'Calidez, espontaneidad y ganas de aventura a todas horas.',
      desc: 'Tu aura brilla como un atardecer en un viaje de verano. Te encantan los sitios nuevos, la gente nueva y el «¿por qué no?». Haces amigos en cualquier parte y tus anécdotas son siempre las mejores de la mesa. La rutina te aburre, así que llenas tu vida de planes que a nadie más se le ocurrirían. Debajo de tanta diversión hay un corazón generoso al que le encanta compartir buenos ratos.',
      strengths: ['Espíritu aventurero', 'Hace amigos en todas partes', 'Anima cualquier plan'],
      others: 'Los demás te ven como quien convierte un día normal en una historia: alguien sociable, con buen rollo y siempre con sorpresas.',
    },
    yellow: {
      name: 'Amarillo dorado',
      word: 'amarillo, amarilla',
      vibe: 'Un rayo de sol con patas: pura alegría, curiosidad y luz.',
      desc: 'Tu aura es pura luz de día. Tienes un optimismo, unas ganas de jugar y una curiosidad sin fin, y siempre andas coleccionando ideas y aficiones nuevas. Le encuentras el lado divertido a casi todo, y tu risa es famosa entre tus amigos. Te gusta la ligereza, pero también tienes una mente ágil: aprendes enseguida y lo compartes con todo el mundo.',
      strengths: ['Optimismo natural', 'Mente rápida y curiosa', 'Alegra cualquier ambiente'],
      others: 'Los demás te ven como un rayo de sol: con solo aparecer, los días difíciles pesan menos.',
    },
    green: {
      name: 'Verde esmeralda',
      word: 'verde',
      vibe: 'Raíces firmes, mucho cariño y un crecer sereno.',
      desc: 'Tu aura se siente como un bosque después de la lluvia: tranquila, fresca y viva. Cuidas mucho a las personas y cosas que te rodean, y prefieres construir algo duradero antes que ganar rápido. Notas lo que los demás necesitan y ayudas sin hacer ruido. El equilibrio es importante para ti: un paseo, una buena comida y tu gente lo arreglan casi todo.',
      strengths: ['Constante y paciente', 'Don para cuidar', 'Mantiene el equilibrio'],
      others: 'Los demás te ven como un refugio: de fiar, amable y la persona a la que llaman cuando necesitan calma.',
    },
    blue: {
      name: 'Azul océano',
      word: 'azul',
      vibe: 'Aguas tranquilas, lealtad profunda, palabras sinceras.',
      desc: 'Tu aura está tan en calma como el mar en un día despejado. Te mantienes firme cuando todo se complica y eliges tus palabras con cuidado. La verdad y la confianza significan mucho para ti: cumples tus promesas y esperas lo mismo. Quizá no seas la voz más fuerte del grupo, pero cuando hablas, todos escuchan, porque saben que lo dices en serio.',
      strengths: ['Calma bajo presión', 'Lealtad profunda', 'Habla con cabeza'],
      others: 'Los demás te ven como la persona más de fiar que conocen: serena, justa y siempre honesta.',
    },
    indigo: {
      name: 'Índigo medianoche',
      word: 'índigo, añil',
      vibe: 'Intuición, profundidad y siempre un paso por delante.',
      desc: 'Tu aura brilla como el cielo justo después de medianoche. Intuyes las cosas antes de que nadie las diga, y a menudo adivinas el final de una historia antes de que empiece. Te gustan las grandes preguntas, los ratos de silencio y las conversaciones que van al fondo. Valoras tu independencia y tu intimidad, pero quienes te conocen de verdad tienen a alguien con una lucidez poco común.',
      strengths: ['Intuición afilada', 'Pensamiento profundo', 'Ve el panorama completo'],
      others: 'Los demás te ven como alguien sabio para su edad: de pocas palabras, con mucha perspicacia y un poco difícil de descifrar.',
    },
    violet: {
      name: 'Violeta místico',
      word: 'violeta, morado, morada',
      vibe: 'Alma soñadora con una visión que nadie más ve.',
      desc: 'Tu aura es un remolino de imaginación. Ves el mundo como podría ser, no solo como es, y tu cabeza está llena de ideas, historias y planes. Te atraen el arte, la música y todo lo que se sale de lo común. Las reglas de siempre no siempre te encajan, y está bien: tu forma única de mirar inspira a quienes te rodean.',
      strengths: ['Imaginación desbordante', 'Ideas originales', 'Inspira a los demás'],
      others: 'Los demás te ven como alguien único: pura creatividad, un toque de misterio e ideas sorprendentes.',
    },
    pink: {
      name: 'Rosa suave',
      word: 'rosa',
      vibe: 'Corazón tierno, amor enorme, fuerza dulce.',
      desc: 'Tu aura es cálida y tierna como la primera luz de la primavera. Quieres sin reservas y haces que la gente se sienta vista, ya sea recordando un cumpleaños o notando cuando alguien está callado. La amabilidad te sale sola, y crees que un pequeño gesto puede cambiarle el día a cualquiera. Ser dulce no es ser débil: tu corazón es tu fuerza.',
      strengths: ['Amabilidad sin fin', 'Empatía profunda', 'Hace que la gente se sienta querida'],
      others: 'Los demás te ven como alguien dulce y reconfortante: esa persona cuyo abrazo lo arregla todo.',
    },
  },
};
