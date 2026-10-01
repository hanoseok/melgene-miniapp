/* Test de disfraz de Halloween — Español (es/)
 * Mismos 8 id de disfraz y mismo orden de preguntas/opciones que costume-core.js (los pesos solo están allí).
 * Claves con Html: HTML tal cual (solo <br> y <em>). El cuerpo de privacy.sections también es HTML.
 * Sin spoilers: meta / og.default* / start / faq / loading no nombran ningún disfraz ni citan preguntas.
 * types.<id>.word = palabras básicas del disfraz (separadas por comas) — solo para el control de spoilers.
 * Variables: {name} {emoji} {vibe} {pct} {n}
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
    title: 'Test de disfraz de Halloween: ¿de qué me disfrazo?',
    description: '¿De qué me disfrazo en Halloween? Haz gratis este test de disfraz de Halloween: 12 momentos de fiesta, unos 2 minutos, sin registro y con ideas fáciles.',
    ogTitle: 'Test de disfraz de Halloween 🎃 ¿De qué te disfrazas este año?',
    ogDescription: 'Un test gratis de 2 minutos. Responde 12 momentos de una fiesta de Halloween y descubre el disfraz que va con tu personalidad.',
  },
  siteName: 'Test de disfraz de Halloween',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🎃 Probador de disfraces',
    h1Kicker: 'Test de disfraz de Halloween',
    h1Html: '¿De qué me disfrazo<br>este <em>Halloween</em>?',
    hook: '¿Sigues mirando una bolsa de disfraces vacía? Doce pequeños momentos de fiesta van a elegir el look que va con tu verdadero yo.',
    metaTime: '⏱️ 2 minutos',
    metaCount: '🦇 12 preguntas',
    start: 'Descubrir mi disfraz →',
  },

  quiz: {
    backAria: 'Pregunta anterior',
    progressAria: 'Progreso',
    qLabel: 'P{n}',
  },

  loading: {
    text: 'Revolviendo el baúl de disfraces…',
    sub: 'Probándote algunos looks',
  },

  result: {
    title: 'Test de disfraz de Halloween: me toca {name}',
    eyebrow: 'Este Halloween, disfrázate de',
    strengthsLabel: 'Tus superpoderes de fiesta',
    tipsLabel: 'Cómo armarlo',
    bestLabel: 'Dúo ideal',
    rivalLabel: 'Rival amistoso',
    sameShare: 'Al {pct} % de los jugadores le salió este disfraz',
    shareText: 'Mi disfraz de Halloween es {name} {emoji} — «{vibe}» ¿Y tú de qué te disfrazas?',
    ctaStrong: 'Alguien te compartió su disfraz de Halloween',
    ctaSub: '¿Y tú de qué te disfrazas? Solo son 2 minutos.',
    retry: 'Repetir el test',
  },

  og: {
    eyebrow: 'Mi disfraz de Halloween',
    brand: '🎃 Test de disfraz de Halloween',
    defaultKicker: 'Test de disfraz de Halloween',
    defaultTitle: '¿De qué te disfrazas este Halloween?',
    defaultDesc: '12 momentos de fiesta · unos 2 minutos',
  },

  faq: [
    { q: '¿Cómo elige el test mi disfraz?', a: 'Cada respuesta suma puntos a un par de disfraces, y gana el que tiene más. Los empates se resuelven con una regla fija, así que las mismas respuestas siempre dan el mismo disfraz.' },
    { q: '¿De verdad puedo hacer el disfraz yo mismo?', a: 'Sí. Cada resultado trae ideas sencillas con cosas que casi todos tenemos en casa, más algunos extras baratos de cualquier bazar o tienda de todo a precio bajo. No hace falta saber coser.' },
    { q: '¿Y si no me gusta mi resultado?', a: '¡Hazlo otra vez! Tu resultado depende solo de cómo respondas hoy, y otro ánimo de fiesta puede sacar otro look. O únete a tu dúo ideal para un disfraz en grupo.' },
    { q: '¿Se guardan mis respuestas?', a: 'No. Tus respuestas se calculan en tu navegador y nunca se guardan. Solo contamos, de forma anónima, qué disfraz salió, para mostrar lo común que es cada resultado.' },
  ],

  privacy: {
    title: 'Política de privacidad | Test de disfraz de Halloween',
    description: 'Política de privacidad del Test de disfraz de Halloween: cookies, publicidad y estadísticas anónimas.',
    h1: 'Política de privacidad',
    introHtml: 'El Test de disfraz de Halloween (el «Servicio») respeta tu privacidad y solo trata la información mínima necesaria, como se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan en tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos de forma anónima qué disfraz salió, para mostrar lo común que es cada resultado.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían no funcionar bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y ajustes en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Guardamos totales diarios anónimos (páginas vistas, tests terminados, valoraciones) para mejorar el Servicio. No permiten identificarte.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política, contacta con el responsable del sitio.'],
      ['6. Fecha de vigencia', 'Esta política está vigente desde el 2 de octubre de 2026.'],
    ],
    back: '← Volver al test de disfraz',
  },

  questions: [
    { q: 'Te acaba de llegar una invitación a una fiesta de Halloween. ¿Qué piensas primero?', choices: [
      'Por fin. Llevo semanas planeando mi look.',
      '¿Quién la organiza? Yo llevo snacks y la playlist.',
      '¿Hay que disfrazarse… o puedo ir cómodo?',
      'Yo me hago mi propio disfraz. Comprado es aburrido.',
    ] },
    { q: 'En la tienda de disfraces, vas directo a…', choices: [
      'El perchero de capas de terciopelo y brillos',
      'La caja de ofertas. ¡Todo vale!',
      'Orejas, colas y accesorios pequeñitos',
      'El rincón DIY: vendas, pintura facial, cinta',
    ] },
    { q: 'Llegas a la fiesta. ¿Primer movimiento?', choices: [
      'Buscar la pista de baile',
      'Saludar a todos y presentar a la gente',
      'Elegir un rincón tranquilo y observar',
      'Ir directo a la mesa de snacks',
    ] },
    { q: '¡Din-don! Niños pidiendo dulces en la puerta. Tú…', choices: [
      'Bailas en la puerta mientras repartes dulces',
      'Te escondes detrás de la puerta y sales de golpe. ¡Bu!',
      'Le das a cada niño una bolsita hecha a mano',
      'Primero pides una travesura. Lo justo es justo.',
    ] },
    { q: 'El DJ pone una canción que te encanta. Tú…', choices: [
      'Bailas como si nadie te viera. Al instante.',
      'Entras despacio con movimientos dramáticos',
      'Mueves la cabeza desde el sofá, snack en mano',
      'Sacas a la pista a tu amigo más tímido',
    ] },
    { q: '¡Hora de la foto grupal! ¿Dónde estás?', choices: [
      'Al frente y al centro, con tu mejor ángulo listo',
      'Asomándote desde el borde',
      'Haciendo una cara chistosa en la última fila',
      'Arreglando el pelo y la ropa de todos primero',
    ] },
    { q: 'Alguien dice: «Contemos historias de miedo». Tú…', choices: [
      'Ya tienes una escalofriante preparada',
      'Te agarras del brazo de al lado y escuchas con un ojo cerrado',
      'La conviertes en comedia a mitad de camino',
      'Te escabulles en silencio a la cocina',
    ] },
    { q: 'La mesa de snacks te llama. Agarras…', choices: [
      'Un poco de todo. Y luego repites.',
      'El plato raro que nadie más se atreve a probar',
      'Solo el postre más bonito de la mesa',
      'Platos para tus amigos antes que para ti',
    ] },
    { q: 'A medianoche, se va la luz de repente. Tú…', choices: [
      'Enciendes la linterna del teléfono y calmas a todos',
      'Haces un ruido tenebroso para asustar a los demás',
      'Te quedas quieto. Ves perfecto en la oscuridad.',
      'Sigues comiendo. La oscuridad no cambia nada.',
    ] },
    { q: '¡Concurso de disfraces! ¿Qué premio ganarías?', choices: [
      'El más elegante',
      'El más creativo',
      'El favorito del público',
      'El más tierno',
    ] },
    { q: 'Visitas una casa embrujada. Tú eres quien…', choices: [
      'Guía al grupo y anima a todos',
      'Pasea con calma, sin inmutarse',
      'Grita más fuerte y se ríe más',
      'Estudia la utilería: «¿Cómo hicieron eso?»',
    ] },
    { q: 'La mañana después de la fiesta, tú…', choices: [
      'Sigues dormido. Que me despierten al atardecer.',
      'Ordenas y devuelves a cada quien lo que olvidó',
      'Ya estás planeando la fiesta del próximo año',
      'Te fundiste con el sofá, sin energía',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampiro de terciopelo',
      word: 'vampiro',
      vibe: 'Elegante sin esfuerzo, un poco dramático y la estrella de cada noche.',
      desc: 'Naciste para el turno de noche. Te encanta hacer una gran entrada, conoces tu mejor ángulo y conviertes una noche cualquiera en una escena de película. La gente se siente atraída por tu seguridad tranquila y ese toque de misterio. Te tomas el estilo en serio, pero también cuidas a los tuyos: cuando eres leal, es para siempre.',
      strengths: ['Encanto magnético', 'Estilo impecable', 'Dueño de la noche'],
      tips: ['Ropa negra y una capa (una sábana oscura sirve) dicen «conde del castillo» al instante.', 'Peina tu pelo hacia atrás y añade un toque de rojo en la comisura de los labios.', 'Colmillos de plástico y una reverencia lenta y dramática al llegar.'],
    },
    witch: {
      name: 'Bruja de luna llena',
      word: 'bruja',
      vibe: 'Lista, creativa y siempre cocinando un plan brillante.',
      desc: 'Tu mente es un caldero de ideas. Prefieres crear algo original antes que copiar lo que hacen todos, y casi siempre tienes un plan B, C y D. Eres independiente y un poco traviesa, con un ingenio afilado que hace interesante cualquier conversación. Tus amigos acuden a ti cuando necesitan una solución inteligente o un hechizo de buen consejo.',
      strengths: ['Ideas brillantes', 'Espíritu independiente', 'Ingenio afilado'],
      tips: ['Un sombrero puntiagudo y un vestido largo o un abrigo oscuro bastan para empezar.', 'Lleva una escoba o una taza con la etiqueta «poción» como accesorio estrella.', 'Añade estrellitas adhesivas, labial morado o un gato negro de peluche en el hombro.'],
    },
    ghost: {
      name: 'Fantasma de sábana',
      word: 'fantasma',
      vibe: 'Tímido y tierno, acogedor y en secreto el más gracioso del lugar.',
      desc: 'No necesitas ser el centro de atención para divertirte a lo grande. Prefieres la ropa cómoda, unos pocos amigos cercanos y mirar la fiesta desde un rincón cómodo. Al principio quizá te subestimen, pero tus observaciones calladas y tus chistes por sorpresa toman a todos desprevenidos. Eres dulce, amable y el tipo de amigo con quien todos se sienten a salvo.',
      strengths: ['Bondad tranquila', 'Humor por sorpresa', 'Gran observador'],
      tips: ['Una sábana blanca con dos agujeros para los ojos. Clásico, cómodo y listo en cinco minutos.', 'Ponle lentes de sol o un sombrerito para que sea inconfundiblemente tuyo.', 'Lleva un cartelito que diga «bu» para las fotos más tiernas.'],
    },
    zombie: {
      name: 'Zombi fiestero',
      word: 'zombi',
      vibe: 'Relajado, siempre con hambre e imparable una vez que arranca.',
      desc: 'Te dejas llevar y casi nada te estresa. Con buenos snacks, zapatos cómodos y tu gente favorita, eres feliz. Por la mañana arrancas despacio, pero cuando entras, entras con todo, y nada te detiene. Tus amigos adoran tu buena onda y lo leal que eres con tu grupo.',
      strengths: ['Totalmente tranqui', 'Resistencia imparable', 'Leal a su grupo'],
      tips: ['Toma ropa vieja, hazle unos rotos y frota posos de café para simular «tierra».', 'Pintura facial gris y sombra oscura alrededor de los ojos hacen el truco.', 'Camina despacio con los brazos estirados y gruñe pidiendo snacks.'],
    },
    blackcat: {
      name: 'Gato negro de medianoche',
      word: 'gato',
      vibe: 'Cool, curioso y misterioso: cariño solo para unos pocos elegidos.',
      desc: 'Haces las cosas a tu manera y a tu ritmo. Todo te da curiosidad, pero solo muestras interés cuando de verdad lo sientes. La gente te ve un poco misterioso, y así te gusta. Detrás de esa pose cool eres juguetón y cariñoso con quienes se ganan tu confianza, y siempre caes de pie.',
      strengths: ['Cool sin esfuerzo', 'Curiosidad infinita', 'Siempre cae de pie'],
      tips: ['Un outfit todo negro con diadema de orejas de gato se reconoce al instante.', 'Dibuja una naricita y bigotes con delineador.', 'Sujeta a tu espalda una cola hecha con un calcetín o unas medias negras.'],
    },
    mummy: {
      name: 'Momia mimosa',
      word: 'momia',
      vibe: 'Paciente, atenta y la amiga que mantiene unido a todo el grupo.',
      desc: 'Eres quien se asegura en silencio de que todos estén bien. Recuerdas los pequeños detalles, arreglas lo que está roto y siempre tienes una venda lista, literal o emocionalmente. Eres paciente y estable, con encanto de alma vieja y amor por lo clásico y atemporal. La gente se siente más tranquila solo con estar cerca de ti.',
      strengths: ['Paciencia infinita', 'Gran corazón', 'Confiable como una roca'],
      tips: ['Envuelve gasa blanca o tiras de una sábana vieja sobre ropa blanca.', 'Deja un ojo asomando y algunas puntas colgando sueltas.', 'Mancha las vendas con té o café para darles un aire antiguo.'],
    },
    pumpkin: {
      name: 'Rey Calabaza',
      word: 'calabaza',
      vibe: 'Cálido, radiante y el corazón de la fiesta: rey o reina de Halloween.',
      desc: 'Iluminas cada lugar como un farol. Te encanta reunir a la gente, recuerdas el nombre de todos y te aseguras de que nadie se sienta fuera. Las fiestas tienen más vida cuando estás tú, y muchas veces eres quien las organiza. Tu calidez es contagiosa: la gente se va de tu lado sintiéndose un poco más luminosa.',
      strengths: ['Anfitrión nato', 'Calidez contagiosa', 'Une a todo el mundo'],
      tips: ['Una camiseta o sudadera naranja con una cara de farol recortada en fieltro negro.', 'Corónala con una diadema de hojas verdes o una coronita.', 'Lleva una cesta de dulces y reparte golosinas a todos.'],
    },
    skeleton: {
      name: 'Esqueleto bailarín',
      word: 'esqueleto',
      vibe: 'Payaso, honesto y siempre el primero en la pista de baile.',
      desc: 'Estás aquí para divertirte, y se nota. Haces reír sin ni siquiera intentarlo, y tu energía arrastra a todos a la pista. Eres de una honestidad refrescante: contigo, lo que se ve es lo que hay, hasta los huesos. La vida se siente más ligera a tu lado, porque nunca te tomas demasiado en serio.',
      strengths: ['Subidón de ánimo', 'Honestidad hasta los huesos', 'Bailarín sin miedo'],
      tips: ['Ropa negra y cinta blanca o pintura para tela para los huesos.', 'Píntate una calavera: base blanca, círculos negros en los ojos y dientes cosidos.', 'Ensaya un paso de baile ridículo: hacer sonar los huesos es obligatorio.'],
    },
  },
};
