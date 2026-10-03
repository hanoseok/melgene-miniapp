/* Test del amor — español (es/)
 * Mismos id y mismo orden de preguntas/opciones que lovestyle-core.js (la puntuación solo está allí).
 * Sin spoilers: meta, pantalla de inicio, FAQ y OG por defecto no nombran ningún tipo (animal) ni citan preguntas.
 * types.<id>.word = palabra(s) del animal solo para el control de spoilers. Mantén {name} {emoji} {vibe} {pct} {n}.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Test del amor: ¿qué tipo de pareja eres?',
    description: '¿Cómo eres cuando te enamoras? Haz el test del amor: 10 momentos de pareja, 2 o 3 minutos, sin registro. Descubre tu estilo en el amor, con quién haces match y consejos para ti.',
    ogTitle: 'Test del amor 💘 ¿Qué tipo de pareja eres?',
    ogDescription: 'Un test de 2 minutos. Responde 10 pequeños momentos de amor y descubre qué tipo de pareja eres de verdad.',
  },
  siteName: 'Test del amor',
  privacyLink: 'Privacidad',

  start: {
    badge: '💘 Test de personalidad en el amor',
    h1Kicker: 'Test del amor',
    h1Html: '¿Qué tipo de pareja<br>eres <em>en el amor</em>?',
    hook: 'Cómo escribes, tu primera cita, las pequeñas peleas… Diez momentos del día a día revelan el personaje adorable que se esconde en tu corazón.',
    metaTime: '⏱️ 2–3 minutos',
    metaCount: '💌 10 preguntas',
    start: 'Descubrir mi estilo →',
  },

  quiz: {
    backAria: 'Pregunta anterior',
    progressAria: 'Progreso',
    qLabel: 'P{n}',
  },

  loading: {
    text: 'Leyendo tu corazón…',
    sub: 'Buscando el estilo que encaja con tus respuestas',
  },

  result: {
    title: 'Test del amor: soy {name}',
    eyebrow: 'En el amor eres',
    strengthsLabel: 'Tus encantos en el amor',
    tipsLabel: 'Consejos de amor para ti',
    bestLabel: 'Tu match',
    rivalLabel: 'Tu rival',
    sameShare: 'Al {pct} % le salió este estilo',
    shareText: 'En el amor soy {name} {emoji}: «{vibe}» ¿Y tú?',
    ctaStrong: 'Alguien te compartió su estilo en el amor',
    ctaSub: '¿Qué tipo de pareja eres tú? 2 minutos.',
    retry: 'Repetir el test',
  },

  og: {
    eyebrow: 'Mi estilo en el amor',
    brand: '💘 Test del amor',
    defaultKicker: 'Test del amor',
    defaultTitle: '¿Qué tipo de pareja eres?',
    defaultDesc: '10 momentos de amor · 2–3 minutos',
  },

  faq: [
    { q: '¿Cómo se decide mi resultado?', a: 'Cada respuesta suma puntos a un par de estilos, y gana el que tenga más. Los empates se resuelven con una regla fija, así que las mismas respuestas siempre dan el mismo resultado.' },
    { q: '¿Es un test de personalidad científico?', a: 'No, es solo para divertirse. Las preguntas se basan en hábitos cotidianos de pareja y no son un diagnóstico psicológico: tómalo como un espejo divertido, no como un veredicto.' },
    { q: '¿Qué significan «tu match» y «tu rival»?', a: 'Tu match es el estilo que equilibra el tuyo de forma natural. Tu rival es con quien más chocas… lo que también puede significar más chispa.' },
    { q: '¿Se guardan mis respuestas?', a: 'No. Tus respuestas se calculan en tu navegador y nunca se guardan. Solo contamos, de forma anónima, qué estilo salió para mostrar lo común que es cada resultado.' },
  ],

  privacy: {
    title: 'Política de privacidad | Test del amor',
    description: 'Política de privacidad del Test del amor: cookies, publicidad y estadísticas anónimas.',
    h1: 'Política de privacidad',
    introHtml: 'Test del amor (el «Servicio») respeta tu privacidad y solo trata la información mínima necesaria, como se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan en tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos, de forma anónima, qué estilo salió para mostrar la frecuencia de cada resultado.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían no funcionar bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y ajustes en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Solo guardamos totales diarios anónimos (visitas, tests completados, valoraciones) para mejorar el Servicio. Estos totales no te identifican.'],
      ['5. Contacto', 'Si tienes dudas sobre esta política, contacta con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está vigente desde el 4 de octubre de 2026.'],
    ],
    back: '← Volver al test del amor',
  },

  questions: [
    { q: 'Tu crush te escribe primero. Tú…', choices: [
      'Contestas en tres segundos, con cinco emojis',
      'Esperas un poco. No quieres parecer desesperado/a.',
      'Mandas una respuesta pícara que le deje con ganas de más',
      'Le preguntas qué tal su día y recuerdas cada detalle',
    ] },
    { q: '¡Primera cita! ¿Qué propones?', choices: [
      'Una cafetería bonita con postres monos y música suave',
      'Un sitio tranquilo para hablar de verdad',
      'Unos recreativos o un café de juegos de mesa. ¡A jugar!',
      'Algo nuevo: un mercadillo nocturno, una ruta, una escapada',
    ] },
    { q: 'Se acerca su cumpleaños. ¿Tu plan?', choices: [
      'Una fiesta sorpresa con todos sus amigos',
      'Algo con mucho estilo que nunca se imaginaría',
      'Una carta a mano y un álbum de nuestros recuerdos',
      'Un regalo absurdo que le haga reír durante días',
    ] },
    { q: 'Tu pareja ha tenido un día horrible. Tú…', choices: [
      'Te sientas a su lado en silencio. Sobran las palabras.',
      'Apareces con su comida favorita y arreglas lo que puedes',
      'Le escuchas toda la noche y recuerdas cada palabra',
      'Te lo llevas de paseo en coche improvisado para despejarse',
    ] },
    { q: '¿Cuánto te gusta escribirte cuando estás saliendo con alguien?', choices: [
      '¡Todo el día! Del buenos días al buenas noches',
      'Un mensaje o dos. Prefiero llamar.',
      'Mensajes largos y dulces llenos de corazones',
      'De vez en cuando. Prefiero contarlo en persona.',
    ] },
    { q: 'Una pequeña discusión. Tú…', choices: [
      'Necesitas un rato a solas antes de hablar',
      'Haces como si nada, pero sueltas indirectas',
      'Pides perdón primero, aunque no fuera culpa tuya',
      'Sueltas una broma para romper el hielo',
    ] },
    { q: '¿Qué hace que se te acelere el corazón?', choices: [
      'Que se le ilumine la cara en cuanto me ve',
      'Reírnos de la misma tontería',
      'Que me diga «¿nos vamos a algún sitio?» de repente',
      'Que respete mi espacio y aun así me elija',
    ] },
    { q: '¿Tu finde ideal en pareja?', choices: [
      'Arreglarnos, un restaurante de moda y fotos bonitas',
      'Cocinar en casa y arreglar cosas juntos',
      'Un pícnic con flores y una puesta de sol',
      'Nuestro sitio de siempre, lo de siempre',
    ] },
    { q: 'Cuando alguien empieza a gustarte, tú…', choices: [
      'No lo puedes esconder. En dos días lo sabe todo el mundo.',
      'Te haces el/la interesante y dejas que venga',
      'Te gusta en silencio durante mucho, mucho tiempo',
      'Le pides una cita enseguida. ¡La vida es corta!',
    ] },
    { q: '¿Qué es lo más importante para ti en una relación?', choices: [
      'La confianza y espacio para ser yo',
      'Sentirme seguro/a y cuidado/a',
      'El romanticismo y los pequeños aniversarios',
      'Ser mejores amigos y poder hablar de todo',
    ] },
  ],

  types: {
    puppy: {
      name: 'el Golden Retriever',
      word: 'golden,retriever,perrito,perro',
      vibe: 'Todo corazón, a tope, y siempre feliz de verte.',
      desc: 'Cuando quieres a alguien, todo el mundo se entera. Escribes primero, llegas antes y nunca juegas al gato y al ratón: tus sentimientos se te notan en la cara. Tu energía hace que tu pareja se sienta la persona más importante del mundo. Solo acuérdate de cuidarte también, para que tu gran corazón nunca se quede sin batería.',
      strengths: ['Entrega total', 'Alegría contagiosa', 'Cero jueguecitos'],
      tips: ['Que tarde en contestar no significa que pase algo: dale espacio para echarte de menos.', 'Guarda un día a la semana solo para ti; vuestro tiempo juntos brillará más.', 'Pregúntale qué muestra de cariño le gusta más y dásela a montones.'],
    },
    cat: {
      name: 'el Gato tsundere',
      word: 'gato,gata',
      vibe: 'Frío por fuera, blandito por dentro: mimos solo para la persona elegida.',
      desc: 'No te enamoras rápido, y mucho menos haciendo ruido. Necesitas tu espacio y tu tiempo, así que al principio puedes parecer algo distante. Pero cuando alguien se gana tu confianza, le enseñas un lado dulce y juguetón que nadie más ve. Tu amor es tranquilo, leal y muy real.',
      strengths: ['Independencia serena', 'Leal cuando confía', 'Dulzura secreta'],
      tips: ['Di un «te he echado de menos» en voz alta: viniendo de ti, vale oro.', 'Explica que necesitas ratos a solas para que no se confunda con frialdad.', 'Los pequeños gestos cuentan: recordar su café favorito es tu lenguaje del amor.'],
    },
    fox: {
      name: 'el Zorro seductor',
      word: 'zorro,zorra',
      vibe: 'Ingenioso, con estilo y siempre un paso por delante en el juego del amor.',
      desc: 'Sabes causar impresión. Mensajes ingeniosos, el look perfecto y el punto justo de misterio: resultas irresistible. Te encanta el cosquilleo del romance y mantienes la chispa con sorpresas. Bajo tanto encanto, buscas a alguien que te siga el ritmo y aun así vea a tu verdadero yo.',
      strengths: ['Encanto magnético', 'Muy buen gusto', 'Mantiene la chispa'],
      tips: ['Mezcla el tira y afloja con sinceridad: las señales claras crean confianza rápido.', 'Déjate ver un día de pereza, sin arreglarte: lo auténtico atrae.', 'Tus sorpresas son legendarias; deja que te sorprendan a ti también.'],
    },
    bear: {
      name: 'el Osito achuchable',
      word: 'oso,osito',
      vibe: 'Firme, cálido y el abrazo más seguro del mundo.',
      desc: 'Demuestras el amor con hechos, no con grandes discursos. Arreglas cosas, cocinas y estás ahí cuando importa. Quizá no seas el romántico más llamativo, pero tu pareja nunca duda de dónde está. Estar contigo es como volver a casa.',
      strengths: ['Fiable como una roca', 'Amor con hechos', 'Corazón enorme'],
      tips: ['Pon tus sentimientos en palabras de vez en cuando: «estoy orgulloso/a de ti» llega lejos.', 'Organiza una cita sorpresa solo por diversión, nada práctico.', 'Deja que tu pareja también te cuide a ti.'],
    },
    bunny: {
      name: 'el Conejito romántico',
      word: 'conejo,conejito',
      vibe: 'Un alma soñadora que recuerda cada cita, cada canción y cada pequeño aniversario.',
      desc: 'Para ti, el amor es una película y cada escena tiene que ser bonita. Te fijas en los detalles, escribes mensajes que salen del corazón y guardas cada recuerdo como un tesoro. Lo sientes todo muy hondo: eres muy detallista y, a veces, un poco sensible. La persona adecuada cuidará tu ternura.',
      strengths: ['Romanticismo sincero', 'Lo recuerda todo', 'Muy detallista'],
      tips: ['Cuando algo te duela, dilo con suavidad en lugar de esperar a que lo adivinen.', 'No todo el mundo quiere con grandes gestos: fíjate también en los pequeños.', 'Haced un álbum de fotos juntos: es tu superpoder.'],
    },
    penguin: {
      name: 'el Pingüino fiel',
      word: 'pingüino',
      vibe: 'Arranca despacio, pero cuando ama, es una sola persona y para siempre.',
      desc: 'Te tomas tu tiempo antes de abrir tu corazón y nunca tienes prisa. Pero cuando eliges a alguien, es para largo. Escuchas de verdad, recuerdas lo importante y sigues ahí en todas las estaciones. Tu amor es dulce, paciente y de los que todo el mundo sueña.',
      strengths: ['Fidelidad absoluta', 'Sabe escuchar', 'Dulzura constante'],
      tips: ['No esperes demasiado para mostrar interés: un pequeño primer paso puede cambiarlo todo.', 'Comparte también tus preocupaciones, no solo escuches las suyas: el amor va en dos direcciones.', 'Probad un plan nuevo cada mes para que la rutina siga teniendo chispa.'],
    },
    hamster: {
      name: 'el Hámster colega',
      word: 'hámster',
      vibe: 'Tu pareja es también tu mejor amigo, y cada cita acaba en carcajadas.',
      desc: 'Para ti, las mejores relaciones empiezan como amistad. Te encanta jugar, compartir picoteo y reír hasta que duela la barriga. Es fácil estar contigo y aportas una energía ligera y divertida al amor. Las charlas serias te dan un poco de apuro, pero tu sinceridad y tu humor mantienen fuerte el vínculo.',
      strengths: ['Diversión sin fin', 'Fácil de hablar', 'Primero la amistad'],
      tips: ['Añade algo de romanticismo de vez en cuando: a veces las velas ganan a los chistes.', 'Cuando la cosa se ponga seria, quédate en la conversación en vez de hacer una broma.', 'Mantened vivas vuestras bromas privadas: son el pegamento de la relación.'],
    },
    dolphin: {
      name: 'el Delfín libre',
      word: 'delfín',
      vibe: 'Aventurero, espontáneo y siempre con la próxima idea de cita en la cabeza.',
      desc: 'Te encantan la libertad, los sitios nuevos y decir que sí a la aventura. Salir contigo es sinónimo de viajes por carretera, planes improvisados e historias que contar. Aportas energía y curiosidad a cada relación y necesitas a alguien que disfrute del viaje. La libertad te importa, pero la persona adecuada te da ganas de volver a casa.',
      strengths: ['Espíritu aventurero', 'Lleno de ideas', 'Valiente en el amor'],
      tips: ['Equilibra los planes espontáneos con algunos rituales fijos en los que tu pareja pueda confiar.', 'Consulta antes de las grandes aventuras: no a todo el mundo le gustan las sorpresas.', 'Comparte tus sueños: hacer planes juntos ya es una aventura.'],
    },
  },
};
