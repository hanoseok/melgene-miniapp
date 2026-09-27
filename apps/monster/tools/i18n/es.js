/* Which Monster Are You? — Spanish (/es/)
 * Same 12 monster ids and question/choice order as monster-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as monster-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq never name a monster or quote a question.
 * Placeholders: {name} {emoji} {catch} {pct} {n} {total} — keep them as-is when translating.
 */
module.exports = {
  // Fonts (per language): css = Google Fonts stylesheet, display = rounded display font stack for titles/buttons,
  // displayWeight, sans = optional body font (omit → shared default), wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: "",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: '¿Qué monstruo eres? Test de personalidad de Halloween',
    description: '¿Qué monstruo eres? Descubre tu monstruo de Halloween con este test de personalidad gratis: 10 preguntas divertidas y tétricas, un minuto, sin registro. Encuentra al monstruo que va con tu esencia.',
    ogTitle: '¿Qué monstruo eres? 🎃 Test de personalidad de Halloween',
    ogDescription: 'Un test de Halloween gratis de un minuto. Responde 10 preguntas divertidas y tétricas y conoce a tu monstruo gemelo.',
  },
  siteName: '¿Qué Monstruo Eres?',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🎃 Especial de Halloween',
    h1Kicker: 'Test de personalidad de Halloween',
    h1Html: '¿Qué <em>monstruo</em><br>eres tú?',
    hook: 'Una noche tenebrosa, diez pequeñas decisiones. En algún rincón de la oscuridad te espera un monstruo que se parece muchísimo a ti.',
    metaTime: '⏱️ Como 1 minuto',
    metaCount: '🦇 10 preguntas',
    start: 'Invocar a mi monstruo →',
  },

  quiz: {
    backAria: 'Pregunta anterior',
    progressAria: 'Progreso',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Invocando a tu monstruo…',
    sub: 'Removiendo el caldero',
  },

  result: {
    title: '¿Qué monstruo eres? Me tocó {name}',
    eyebrow: 'El monstruo que va contigo es',
    strengthsLabel: 'Poderes del monstruo',
    partyLabel: 'En una fiesta de Halloween, tú eres…',
    bestLabel: 'Mejor amigo',
    rivalLabel: 'Rival simpático',
    sameShare: 'El {pct}% de los jugadores también sacó este monstruo',
    shareText: 'Mi monstruo de Halloween es {name} {emoji} — “{catch}” ¿Tú qué monstruo eres?',
    ctaStrong: 'Un amigo te mandó su monstruo',
    ctaSub: '¿Tú cuál eres? Toma solo un minuto.',
    retry: 'Repetir el test',
  },

  og: {
    eyebrow: 'Mi monstruo de Halloween',
    brand: '🎃 ¿Qué Monstruo Eres?',
    defaultKicker: 'Test de personalidad de Halloween',
    defaultTitle: '¿Qué monstruo eres?',
    defaultDesc: '10 preguntas de Halloween · como 1 minuto',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text, spoiler-free.
  faq: [
    { q: '¿Cómo se calcula el resultado del test?', a: 'Cada respuesta suma puntos a varios monstruos, y el que junta más puntos es tu resultado. Los empates se resuelven con una regla fija, así que las mismas respuestas siempre dan el mismo monstruo.' },
    { q: '¿Da miedo?', a: 'Para nada. Es un test de Halloween tierno y apto para toda la familia — sin sangre ni sustos de los que hacen saltar, solo un poco de diversión tenebrosa.' },
    { q: '¿Puedo sacar un monstruo distinto?', a: 'Sí. Tu resultado depende solo de tus respuestas, así que si respondes distinto puede aparecer otro monstruo.' },
    { q: '¿Se guardan mis respuestas?', a: 'No. Tus respuestas se calculan en tu navegador y nunca se guardan. Solo contamos, de forma anónima, qué monstruo salió, para mostrar qué tan frecuente es cada resultado.' },
  ],

  privacy: {
    title: 'Política de privacidad | ¿Qué Monstruo Eres?',
    description: 'Política de privacidad de ¿Qué Monstruo Eres? — cómo usamos cookies, publicidad y estadísticas anónimas.',
    h1: 'Política de privacidad',
    introHtml: '¿Qué Monstruo Eres? (el "Servicio") respeta tu privacidad y solo procesa la información mínima necesaria, tal como se explica a continuación.',
    sections: [
      ['1. Información que recopilamos', 'Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan dentro de tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos, de forma anónima, qué tipo de monstruo salió, para poder mostrar qué tan frecuente es cada resultado.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa. Puedes rechazar o borrar las cookies desde la configuración de tu navegador; si lo haces, algunas funciones podrían no funcionar correctamente.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este sitio y a otros. Puedes conocer más y cambiar tu configuración de anuncios personalizados en <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Guardamos totales diarios anónimos (visitas a la página, tests completados, valoraciones) para mejorar el Servicio. Estos totales no permiten identificarte.'],
      ['5. Contacto', 'Si tienes alguna pregunta sobre esta Política de privacidad, contacta al operador del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política entra en vigor el 27 de septiembre de 2026.'],
    ],
    back: '← Volver al test del monstruo',
  },

  questions: [
    { q: 'Te llega a último momento una invitación a una fiesta de Halloween. ¿Qué piensas primero?', choices: [
      '¿Qué me pongo? Tiene que ser legendario.',
      '¿Va a haber comida? Entonces voy.',
      'Mmm… ¿quién más va?',
      'Yo llevo la decoración. Y la playlist.',
    ] },
    { q: 'A los treinta minutos de fiesta, ¿dónde estás?', choices: [
      'En medio de la pista, moviendo todo el cuerpo',
      'En la mesa de botanas. Voy en el tercer plato.',
      'En un rincón tranquilo, en una charla profunda',
      'Ya eres amigo de todo el mundo, sin saber cómo',
    ] },
    { q: 'Un grito retumba en un pasillo bien oscuro. Tú…', choices: [
      'Gritas todavía más fuerte y luego te mueres de risa',
      'Corres para allá. ¡Alguien puede necesitar ayuda!',
      'Te congelas y te vuelves uno con la pared',
      'Miras la hora tranquilamente. Seguro es una broma.',
    ] },
    { q: 'Es medianoche y te da hambre. ¿A qué le entras?', choices: [
      'Algo rojo y elegante: jugo de cereza con chocolate amargo',
      'Lo que haya en el refri. Todo.',
      'Chocolate caliente con mi mezcla secreta de especias',
    ] },
    { q: '¿Tu estrategia de disfraz?', choices: [
      'Hecho a mano. Lo vengo armando desde agosto.',
      'Una sábana vieja con dos hoyos para los ojos. Listo.',
      'Me envuelvo con lo que haya a la mano. El papel higiénico cuenta.',
      'Un look distinto cada hora. Que nadie sepa qué esperar.',
    ] },
    { q: '¡Ding dong! Llegan los niños pidiendo dulces. Tú…', choices: [
      'Repartes chocolates de tamaño completo y aplaudes cada disfraz',
      'Sales de atrás de la puerta con un susto (suavecito)',
      'Apagas la luz y espías por la cortina. Aquí no vive nadie.',
    ] },
    { q: '¿Cómo te describen tus amigos?', choices: [
      'Parece intimidante, pero es un pan de dios',
      'Siempre puntual y raramente tranquilo con todo',
      'Hace lo que se le antoja y de algún modo se sale con la suya',
      'Misterioso. Tiene remedio para absolutamente todo',
    ] },
    { q: 'Son las 3 a. m. y la fiesta se está apagando. Tú…', choices: [
      'Apenas estás arrancando. ¡After party en mi casa!',
      'Dormido en el sillón. Desde las once.',
      'Guardando las sobras en tápers bien etiquetados',
      'Arreglando la bocina que alguien rompió para que la música siga',
    ] },
    { q: 'Sales afuera y ves una luna llena enorme. Te sientes…', choices: [
      'Salvaje. Necesitas correr a donde sea. ¡A cualquier lado!',
      'Soñador. Noche perfecta para caminar despacio y en silencio.',
      'Acurrucado. De vuelta adentro: cobija, té, película vieja.',
      'Con suerte. ¡Rápido, pide un deseo!',
    ] },
    { q: 'Elige tu lema para esta noche de Halloween.', choices: [
      'Baila como si nadie te viera. Total, todos son fantasmas.',
      'Nueve vidas, cero preocupaciones.',
      'Puntual, siempre puntual.',
      'Para eso hay un hechizo.',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampiro',
      catch: 'Llega tarde con estilo, dramático por naturaleza.',
      desc: 'Eres una criatura de la noche con un gusto impecable: para la ropa, la música y los antojos. La gente se fija en ti antes de que digas una palabra, y sabes hacer una entrada como nadie. Prefieres quedarte despierto hasta el amanecer en una buena plática antes que irte a dormir temprano. Sí, eres un poco dramático. Y por eso mismo todos te adoran.',
      strengths: ['Encanto magnético', 'Gusto impecable', 'Resistencia de trasnochador'],
      party: 'El que llega al final y de inmediato se roba toda la fiesta.',
    },
    werewolf: {
      name: 'Hombre lobo',
      catch: 'Fiel a la manada, salvaje por dentro.',
      desc: 'Tienes una energía sin límites y un corazón del tamaño de la luna llena. Tus amigos son tu manada, y cruzarías la ciudad corriendo a medianoche si alguno te necesita. Eres brutalmente honesto, casi siempre tienes hambre, y tu humor cambia… digamos que como la luna. Cuando te entregas a algo, vas con todo — y el ambiente entero lo nota.',
      strengths: ['Lealtad feroz', 'Energía inagotable', 'Honestidad (con buena onda)'],
      party: 'Encabeza el asalto a la mesa de botanas y luego aúlla cada canción.',
    },
    witch: {
      name: 'Bruja',
      catch: 'Prepara ideas, hechiza planes y nunca se queda sin trucos.',
      desc: 'Curiosa, lista y un poquito traviesa: siempre tienes un plan, un plan B y un ingrediente secreto. Te encanta juntar datos raros y convertirlos en algo útil (o en un caos delicioso). Tus amigos vienen a pedirte consejo porque tus respuestas de verdad funcionan. Independiente hasta la médula, prefieres volar en tu propia escoba antes que esperar a que alguien te lleve.',
      strengths: ['Solución de problemas afiladísima', 'Curiosidad sin fin', 'Remedio para todo'],
      party: 'Mezclando bebidas misteriosas en la cocina y leyéndole la suerte a todos.',
    },
    ghost: {
      name: 'Fantasma',
      catch: 'Silencioso, tierno y en secreto el más gracioso de todos.',
      desc: 'Flotas por la vida con suavidad y notas todo lo que a los demás se les escapa. No es que seas tímido — simplemente prefieres a unos pocos amigos de verdad antes que un salón lleno de gente. Cuando hablas, siempre sueltas el comentario justo en el momento perfecto que hace reír a todos. También eres maestro de la salida silenciosa: estás aquí un segundo, y al siguiente ya estás tranquilo en tu cama.',
      strengths: ['Observador afilado', 'Timing de humor seco', 'Presencia que calma'],
      party: 'Flota de cuarto en cuarto, escucha las mejores historias y desaparece sin dejar rastro.',
    },
    zombie: {
      name: 'Zombi',
      catch: 'Lento, constante, y nada le quita la calma.',
      desc: 'Nada te altera. Fechas límite, dramas, caos — tú avanzas arrastrando los pies a tu propio ritmo y de algún modo siempre llegas. Funcionas a base de botanas y siestas, y eres la prueba viviente de que la tranquilidad es un superpoder. A tus amigos les encanta lo relajado que eres; te apuntas a cualquier plan mientras haya comida de por medio. Eso sí, no te despierten antes del mediodía.',
      strengths: ['Calma inquebrantable', 'Fluye con todo', 'Persistencia sorprendente'],
      party: 'En el sillón, un plato en cada mano, en total paz con el universo.',
    },
    mummy: {
      name: 'Momia',
      catch: 'Un alma antigua envuelta en capas bien calientitas.',
      desc: 'Amas tu casa, tus rutinas y tus repisas perfectamente ordenadas. Guardas las cosas por años — boletos viejos, fotos antiguas, amistades — y las cuidas todas muy bien. Algunos te dicen anticuado; tú le llamas atemporal. Bajo todas esas vendas hay un corazón cálido y leal en el que se puede confiar por siglos.',
      strengths: ['Confiable a prueba de todo', 'Organización impecable', 'Amistades para toda la vida'],
      party: 'Envuelto en una cobija junto al fuego, contando las mejores historias de "cuando yo era joven".',
    },
    frank: {
      name: 'El Monstruo de Frankenstein',
      catch: 'Grandote, tierno y armado puro corazón.',
      desc: 'A primera vista pareces serio, pero cualquiera que te conozca sabe que eres el alma más noble del lugar. Eres un hacedor: arreglas cosas, construyes cosas y demuestras cariño con acciones más que con palabras. A veces sientes que no te entienden del todo, pero los amigos que sí te entienden harían lo que fuera por ti. Está vivo… y es adorable.',
      strengths: ['Hábil para arreglar cualquier cosa', 'Corazón de oro', 'Constante y confiable'],
      party: 'Arreglando las luces en silencio, y luego bailando torpe y feliz cuando suena la canción correcta.',
    },
    pumpkin: {
      name: 'Calabaza de Halloween',
      catch: 'Sonrisa que brilla, buena vibra instantánea.',
      desc: 'Iluminas cualquier cuarto — casi literalmente. Tu optimismo es contagioso, tu risa se escucha desde lejos, y normalmente tú fuiste quien organizó el plan desde un inicio. Haces que todos se sientan bienvenidos y nunca se te olvida un nombre. Hasta en la noche más oscura encuentras algo de qué reírte, y ayudas a los demás a encontrarlo también.',
      strengths: ['Positividad contagiosa', 'Anfitrión nato', 'Hace sentir bienvenido a todos'],
      party: 'El anfitrión, el hype y la razón por la que todos llegaron.',
    },
    blackcat: {
      name: 'Gato negro',
      catch: 'Misterioso, independiente, imposiblemente cool.',
      desc: 'Haces las cosas a tu manera y te ves increíble sin ni siquiera esforzarte. Eres selectivo con quién dejas entrar a tu círculo, pero al que elige tiene un amigo para las nueve vidas. Amas una buena siesta, un rincón tranquilo y que te dejen en paz — hasta que de repente quieres toda la atención para ti. Algunos dicen que traes mala suerte. Tus amigos saben que eres su amuleto de la suerte.',
      strengths: ['Estilo sin esfuerzo', 'Instintos agudos', 'Selectivo pero leal'],
      party: 'Instalado en el mejor asiento de la casa, juzgando a todos con muchísimo cariño.',
    },
    reaper: {
      name: 'La Parca',
      catch: 'Tranquila, puntual y jamás falla una fecha límite.',
      desc: 'Eres la calma en medio de la tormenta de todos los demás. Mientras otros entran en pánico, tú revisas el itinerario, armas un plan y lo ejecutas — justo a tiempo, siempre. Tu humor es tan seco que la gente entiende el chiste una hora después. La capucha se ve intimidante, pero en realidad eres quien se asegura de que todos lleguen bien a casa.',
      strengths: ['Frío bajo presión', 'Timing perfecto', 'Cariñosa en secreto'],
      party: 'Revisa la hora a las 11:58 y anuncia, muy tranquila, la última canción.',
    },
    fox: {
      name: 'Zorro de nueve colas',
      catch: 'Cambia de forma y tiene una sonrisa para cada ocasión.',
      desc: 'Encajas en cualquier lugar: la cena elegante, la fiesta descontrolada en casa, hasta la reunión familiar. Lees a la gente al instante y siempre sabes qué decir. Listo y juguetón, te encanta un buen juego y casi siempre lo ganas. Detrás de todas esas caras encantadoras hay alguien ferozmente leal con los pocos que han visto tus colas de verdad.',
      strengths: ['Lee el ambiente al instante', 'Ingenio rápido', 'Se adapta a todo'],
      party: 'Se cambia de disfraz dos veces y de algún modo termina siendo mejor amigo de la abuela del anfitrión.',
    },
    skeleton: {
      name: 'Esqueleto',
      catch: '¿Hueso gracioso? Tú eres puro hueso gracioso.',
      desc: 'No te tomas la vida muy en serio — y honestamente, ese es tu secreto. Sueltas chistes en el peor momento posible, bailas con cualquier pretexto y puedes animar a cualquiera en treinta segundos. Viajas ligero y vives simple: sin drama, sin show, solo buena vibra. La gente se siente más ligera a tu lado, como si se hubiera quitado unos kilos de preocupación.',
      strengths: ['Sube el ánimo al instante', 'Payaso sin miedo', 'Cero drama, puro relax'],
      party: 'Traquetea en la pista de baile y arranca un tren que nadie pidió.',
    },
  },
};
