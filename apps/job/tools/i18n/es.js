/* Test vocacional (es)
 * 8 result ids (showrunner storyteller captain caretaker creator inventor builder analyst);
 * questions[i].choices[j] follow job-core.js QUESTIONS[i].w[j] (the [people/things, imagine/structure, out front/deep focus] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result, a suggested job or quote a question.
 * types.<id>.word = the result keyword as people would search it — only used by the spoiler check.
 * types.<id>.jobs = 4 real jobs that are common in this country (local names, no digits).
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Light and positive only. Just for fun — not a professional career assessment.
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test vocacional: ¿qué profesión va contigo?",
    "description": "Haz el test vocacional: 11 preguntas rápidas, unos 2 minutos y sin registrarte. Descubre tu estilo de trabajo, tus puntos fuertes y profesiones que podrían irte bien. Solo por diversión.",
    "ogTitle": "Test vocacional 💼 ¿Qué profesión va contigo?",
    "ogDescription": "Once preguntas ligeras sobre cómo te gusta trabajar. Descubre tu estilo de trabajo, tus puntos fuertes y algunas profesiones que merece la pena explorar."
  },
  "siteName": "Test vocacional",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "💼 ¿Qué profesión me va?",
    "h1Kicker": "Test vocacional",
    "h1Html": "¿Dónde vas a<br><em>brillar</em> trabajando?",
    "hook": "Hay quien se crece en una sala llena de gente y quien prefiere un rincón tranquilo con un rompecabezas difícil. Responde once preguntas de la vida diaria y descubre tu estilo de trabajo, tus puntos fuertes ocultos y algunas profesiones que quizá te sienten sorprendentemente bien.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 preguntas",
    "start": "Descubrir mi estilo →"
  },
  "quiz": {
    "backAria": "Pregunta anterior",
    "progressAria": "Progreso",
    "qLabel": "Pregunta {n}"
  },
  "loading": {
    "text": "Ordenando tus respuestas…",
    "sub": "Buscando tu estilo en el mundo laboral"
  },
  "result": {
    "title": "Mi estilo de trabajo: {name}",
    "metaDesc": "Resultado del test vocacional: {name}. {vibe} Descubre tus puntos fuertes, profesiones que podrían irte bien y un consejo para tu forma de trabajar.",
    "eyebrow": "Tu personalidad laboral",
    "gaugeLabel": "Hacia dónde se inclinaron tus respuestas",
    "axes": [
      ["Personas", "Cosas e ideas"],
      ["Imaginación", "Orden"],
      ["Dar la cara", "Concentración"]
    ],
    "jobsLabel": "Profesiones para explorar",
    "strengthsLabel": "Tus puntos fuertes",
    "envLabel": "Dónde brillas",
    "watchLabel": "Ojo con",
    "tipLabel": "Consejo para trabajar",
    "buddyLabel": "Compi ideal",
    "rivalLabel": "Estilo opuesto",
    "disclaimer": "Solo por diversión. Es un test ligero, no una evaluación profesional de orientación laboral. Las profesiones son ideas para explorar, no consejos, y puedes triunfar en muchos otros caminos.",
    "sameShare": "Al {pct}% de la gente le salió este estilo de trabajo",
    "shareText": "Mi estilo de trabajo es {name} {emoji} «{vibe}» ¿Y el tuyo?",
    "ctaStrong": "Un amigo ha compartido su estilo de trabajo",
    "ctaSub": "¿Qué profesión va contigo? Descúbrelo en 2 minutos.",
    "retry": "Repetir el test"
  },
  "og": {
    "eyebrow": "Mi personalidad laboral",
    "brand": "💼 Test vocacional",
    "defaultKicker": "Un test vocacional ligero",
    "defaultTitle": "¿Qué profesión va contigo?",
    "defaultDesc": "11 preguntas · 2 minutos · tu estilo de trabajo"
  },
  "faq": [
    {
      "q": "¿Cómo se decide mi resultado?",
      "a": "Cada respuesta mueve tres escalas: trabajar con personas o con cosas e ideas, imaginar cosas nuevas o montar sistemas claros, y dar la cara o concentrarte a fondo. Tu resultado es el punto donde se cruzan las tres, y las mismas respuestas siempre dan el mismo resultado."
    },
    {
      "q": "¿Es un test de orientación profesional de verdad?",
      "a": "No. Es un juego ligero para divertirse y reflexionar, no una prueba profesional ni científica. Para decisiones importantes sobre tus estudios o tu trabajo, habla con un orientador del instituto o de la universidad, con tus profesores o con gente que se dedique a lo que te interesa."
    },
    {
      "q": "¿Por qué algunas profesiones sugeridas no me encajan?",
      "a": "Cuatro profesiones nunca pueden abarcar a una persona entera. Son ejemplos de trabajos que suelen aprovechar tu estilo, así que tómalas como punto de partida. Mucha gente con tu mismo resultado es feliz en campos totalmente distintos."
    },
    {
      "q": "¿Se guardan mis respuestas?",
      "a": "No. Tus respuestas se calculan en tu navegador y no se almacenan. Solo contamos, de forma anónima, qué resultado ha salido, para poder mostrarte lo habitual que es."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Test vocacional",
    "description": "Política de privacidad del Test vocacional: cómo usamos las cookies, la publicidad y las estadísticas anónimas.",
    "h1": "Política de privacidad",
    "introHtml": "El Test vocacional (el «Servicio») respeta tu privacidad y trata únicamente la información mínima necesaria, tal como se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan dentro de tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos, de forma anónima, qué resultado ha salido, para poder mostrar lo habitual que es cada uno."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en los ajustes de tu navegador; si lo haces, es posible que algunas funciones no funcionen correctamente."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar la personalización de anuncios en <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Guardamos totales diarios anónimos (visitas a la página, tests completados, valoraciones) para mejorar el Servicio. Estos totales no te identifican personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política entra en vigor el 31 de octubre de 2026."
      ]
    ],
    "back": "← Volver al Test vocacional"
  },
  "questions": [
    {
      "q": "Empieza un trabajo en grupo. ¿Qué papel acabas asumiendo sin proponértelo?",
      "choices": [
        "El que idea en silencio una solución ingeniosa que a nadie más se le había ocurrido",
        "El que propone ideas y las presenta delante de la clase o del equipo",
        "El que coge las herramientas y construye lo que sea, paso a paso",
        "El que lleva el calendario y vigila que nadie se quede atrás"
      ]
    },
    {
      "q": "De repente tienes un día libre. ¿Qué te apetece más?",
      "choices": [
        "Un café con una amiga y charlar largo y tendido sobre una peli que os encantó",
        "Ordenar por fin tus carpetas de fotos o tus cuentas, todo limpio y en su sitio",
        "Reunir gente para un partido o una noche de juegos de mesa que organizas tú",
        "Un taller de un día en el que haces algo con tus propias manos"
      ]
    },
    {
      "q": "Te acabas de comprar un aparato nuevo. ¿Qué haces primero?",
      "choices": [
        "Lo configuras enseguida, siguiendo las instrucciones una a una",
        "Escribes una guía sencilla para que tu familia también sepa usarlo",
        "Grabas la apertura de la caja o se lo enseñas a tus amigos",
        "Te metes en los ajustes a buscar funciones ocultas y trucos ingeniosos"
      ]
    },
    {
      "q": "¿Qué cumplido te alegra el día?",
      "choices": [
        "«Ni un solo error. Eres muy preciso».",
        "«El equipo funciona tan bien gracias a ti».",
        "«¿Esto lo has hecho tú? ¡Qué pasada!».",
        "«Lo que dijiste se me quedó grabado»."
      ]
    },
    {
      "q": "Elige tu lugar de trabajo ideal.",
      "choices": [
        "Una oficina con buen rollo donde todo el equipo va a una",
        "Fuera, sobre el terreno, moviéndote y manejando equipos de verdad",
        "Un sitio con mucho ambiente donde cada día pasa algo nuevo",
        "Un estudio tranquilo con una pizarra llena de ideas a medias"
      ]
    },
    {
      "q": "Algo sale mal. ¿Cuál es tu primer movimiento?",
      "choices": [
        "Reunir a todos, repartir las tareas y ponerte al frente",
        "Escuchar a cada persona implicada y buscar un enfoque distinto",
        "Revisar con calma los números y los registros para dar con la causa",
        "Ponerte a trastear y probar una forma nueva de arreglarlo en el momento"
      ]
    },
    {
      "q": "¿Qué no deja de aparecerte en los vídeos recomendados?",
      "choices": [
        "Vlogs, vídeos de humor y las últimas tendencias",
        "Reparaciones, bricolaje y reseñas de material de acampada",
        "Ciencia, espacio y misterios sin resolver explicados",
        "Historias reales de gente que ayuda a otros, como profes y enfermeras"
      ]
    },
    {
      "q": "En un viaje, normalmente eres quien…",
      "choices": [
        "Va sin plan por ahí y llena el carrete de fotos o un cuaderno de dibujos",
        "Monta la hoja de cálculo perfecta con el presupuesto y los horarios",
        "Acaba charlando con la gente del lugar en una cafetería cualquiera",
        "Guía a todo el grupo de un sitio a otro"
      ]
    },
    {
      "q": "Es la víspera de la entrega. Tú…",
      "choices": [
        "Escribes una lista clara de tareas y las vas tachando una a una",
        "Pules la presentación final y mantienes los ánimos del equipo",
        "Preguntas a tus compañeros uno por uno si alguien está atascado",
        "Te sumerges en el trabajo y se te ocurre una idea aún mejor"
      ]
    },
    {
      "q": "En un club o grupo, ¿qué puesto te gustaría más?",
      "choices": [
        "Dar la bienvenida a los nuevos y escuchar a quien necesite hablar",
        "Ser quien preside y mantiene todo en marcha",
        "Diseñar los carteles, el logo y el merchandising",
        "Llevar los registros y el dinero común en orden"
      ]
    },
    {
      "q": "Dentro de diez años, ¿qué te encantaría oír?",
      "choices": [
        "«Siempre me sentí tranquilo sabiendo que estabas ahí».",
        "«Fuiste el primero en pensar en eso, ¿verdad?».",
        "«Hiciste sonreír a mucha gente».",
        "«Si pasa por tus manos, funciona»."
      ]
    }
  ],
  "types": {
    "showrunner": {
      "name": "El Showman",
      "word": "showman",
      "vibe": "Dame un escenario y una idea, y te pongo a toda la sala en pie.",
      "desc": "Te sientes vivo donde se juntan las personas, las ideas y la acción. Disfrutas proponiendo algo nuevo, sumando a los demás y viéndolo cobrar vida delante del público. La energía es tu superpoder: una reunión aburrida se convierte en una lluvia de ideas en cuanto entras. Un trabajo que te deje lanzar, presentar y conectar probablemente se parecerá más a un juego que a una obligación.",
      "keywords": ["Enérgico", "Persuasivo", "Lleno de ideas"],
      "strengths": ["Convertir una idea en bruto en algo a lo que la gente quiere sumarse", "Leer el ambiente de una sala y animarlo", "Hablar en público y presentar con seguridad"],
      "jobs": ["Jefe de marketing", "Productor de televisión", "Organizador de eventos", "Emprendedor"],
      "env": "Equipos ágiles, lanzamientos y eventos en directo donde cada semana trae algo nuevo y puedes ver cómo reacciona la gente a tu trabajo.",
      "watch": "Empezar más proyectos de los que puedes terminar. Las ideas nuevas y brillantes pueden robarle tiempo a las que ya vas por la mitad.",
      "tip": "Únete a alguien a quien le encanten los detalles y fija una única meta antes de lanzarte a lo siguiente."
    },
    "storyteller": {
      "name": "El Narrador",
      "word": "narrador",
      "vibe": "Conviertes las ideas en palabras e historias que se quedan en la memoria.",
      "desc": "Te atraen las personas y el sentido de las cosas. Te gusta entender cómo se sienten los demás y darle forma en palabras, lecciones o historias que ayudan a ver algo con otros ojos. Quizá no necesites el foco, pero tu influencia silenciosa llega lejos. Un trabajo en el que puedas escuchar, escribir, enseñar o explicar probablemente te encajará de forma natural.",
      "keywords": ["Empático", "Expresivo", "Reflexivo"],
      "strengths": ["Explicar cosas complicadas de forma sencilla y cercana", "Escuchar con atención y notar lo que la gente quiere decir de verdad", "Encontrar la historia que hay detrás de los datos y las cifras"],
      "jobs": ["Redactor", "Profesor", "Psicólogo", "Periodista"],
      "env": "Espacios tranquilos con tiempo para pensar, conversaciones cercanas y proyectos en los que tus palabras llegan a personas reales y les ayudan.",
      "watch": "Llevarte a casa las preocupaciones de los demás. Preocuparte tanto es un regalo, pero tú también necesitas recargar.",
      "tip": "Lleva una libretita de ideas y frases. Tu mejor trabajo suele empezar como una línea que casi se te olvida."
    },
    "captain": {
      "name": "El Capitán",
      "word": "capitán",
      "vibe": "Cuando el trabajo se complica, todos miran hacia ti para llevar el timón.",
      "desc": "Das lo mejor de ti cuando hay un equipo al que guiar y un objetivo que alcanzar. Te gustan los planes claros, decides sin dramas y consigues que todo el mundo reme en la misma dirección. La gente confía en ti en los momentos de crisis porque mantienes la calma y la cabeza ordenada. Un trabajo que te ponga al mando de personas, horarios o servicio al cliente probablemente sacará tu liderazgo natural.",
      "keywords": ["Decidido", "Organizado", "Fiable"],
      "strengths": ["Dividir un trabajo grande en tareas claras para cada persona", "Mantener la calma y el sentido práctico bajo presión", "Cumplir lo prometido y respetar los plazos"],
      "jobs": ["Jefe de proyecto", "Director comercial", "Director de hotel", "Auxiliar de vuelo"],
      "env": "Equipos activos con objetivos claros, donde puedes coordinar a la gente, resolver problemas al momento y ver resultados rápido.",
      "watch": "Hacerlo todo tú porque parece más rápido. Dejar que otros lleven el timón de vez en cuando fortalece a todo el equipo.",
      "tip": "Antes de repartir tareas, pregunta a cada persona qué le apetece más hacer. Puede que las respuestas te sorprendan."
    },
    "caretaker": {
      "name": "El Cuidador",
      "word": "cuidador",
      "vibe": "Te aseguras de que nadie se quede atrás.",
      "desc": "Te importan las personas y lo demuestras con un apoyo constante y práctico. Te das cuenta cuando alguien lo está pasando mal, recuerdas los detalles que importan y te gustan los sistemas que mantienen a todos a salvo y bien atendidos. Quizá no pidas reconocimiento, pero los equipos notan la diferencia cuando estás. Un trabajo en el que puedas ayudar, apoyar y proteger a los demás probablemente te resultará muy significativo.",
      "keywords": ["Atento", "Paciente", "Cumplidor"],
      "strengths": ["Notar las pequeñas señales de que alguien necesita ayuda", "Hacer un seguimiento cuidadoso, día tras día", "Crear un ambiente tranquilo y de confianza"],
      "jobs": ["Enfermero/a", "Técnico de recursos humanos", "Trabajador/a social", "Responsable de atención al cliente"],
      "env": "Equipos unidos con un propósito claro, donde la amabilidad y las buenas rutinas marcan una diferencia real en la vida de las personas.",
      "watch": "Decir que sí a todo el mundo. Proteger tu propio tiempo también es una forma de cuidar bien a los demás.",
      "tip": "Reserva una hora a la semana que sea solo para tus propios objetivos y defiéndela como cualquier otra cita."
    },
    "creator": {
      "name": "El Creador",
      "word": "creador",
      "vibe": "Dame los materiales y aparecerá algo nuevo.",
      "desc": "Piensas con las manos y con los ojos. Te encanta hacer cosas que la gente puede ver, probar, tocar o usar, y eres más feliz cuando puedes intentar, comprobar y mejorar sobre la marcha. Las normas están bien, pero prefieres tener espacio para experimentar. Un trabajo en el que puedas diseñar, elaborar o producir algo real probablemente te mantendrá ilusionado durante mucho tiempo.",
      "keywords": ["Ingenioso", "Manitas", "Visual"],
      "strengths": ["Convertir una idea en una pieza real y terminada", "Detectar lo que se ve o se siente justo como debe", "Aprender rápido probando las cosas"],
      "jobs": ["Diseñador gráfico", "Cocinero", "Creador de contenido en vídeo", "Interiorista"],
      "env": "Estudios, cocinas, talleres o platós donde puedes trabajar con materiales reales y enseñar lo que has hecho.",
      "watch": "Pulir sin fin. Una pieza terminada y puesta en el mundo te enseña más que una perfecta guardada en un cajón.",
      "tip": "Guarda un portafolio con todo lo que hagas, incluso lo pequeño. Acabará siendo tu mejor historia sobre ti."
    },
    "inventor": {
      "name": "El Inventor",
      "word": "inventor",
      "vibe": "Tu mente es un laboratorio donde las ideas nuevas no paran de burbujear.",
      "desc": "Te encantan las grandes preguntas y las respuestas ingeniosas. Disfrutas sumergiéndote en un rompecabezas, probando ideas en tu cabeza y encontrando una solución que nadie esperaba. Piensas mejor cuando tienes tiempo tranquilo y libertad para explorar. Un trabajo en el que puedas investigar, diseñar sistemas o resolver problemas difíciles probablemente será un parque de juegos para tu curiosidad.",
      "keywords": ["Curioso", "Original", "Analítico"],
      "strengths": ["Ver patrones y conexiones que otros pasan por alto", "Concentrarte a fondo en un problema difícil", "Dar con soluciones originales"],
      "jobs": ["Investigador científico", "Programador", "Arquitecto", "Desarrollador de videojuegos"],
      "env": "Lugares tranquilos con espacio para concentrarse, problemas interesantes y compañeros a los que les gusta un buen debate de ideas.",
      "watch": "Guardarte las ideas brillantes en la cabeza. Compartirlas pronto ayuda a otros a entenderlas y a construir sobre ellas.",
      "tip": "Cuéntale tu idea del momento a un amigo en tres frases. Si la entiende, ya estás listo para ponerla en marcha."
    },
    "builder": {
      "name": "El Constructor",
      "word": "constructor",
      "vibe": "No te quedas en palabras: lo haces, y lo haces bien.",
      "desc": "Eres práctico, constante y más feliz cuando ves resultados reales. Te gustan los pasos claros, las buenas herramientas y el trabajo que te mantiene en movimiento en lugar de quieto. Cuando algo se rompe, eres quien lo arregla con calma. Un trabajo en el que puedas construir, reparar, manejar o mantener las cosas funcionando con seguridad probablemente te dará una profunda satisfacción.",
      "keywords": ["Práctico", "Habilidoso", "Constante"],
      "strengths": ["Seguir un proceso con cuidado y con seguridad", "Arreglar problemas con calma y habilidad manual", "Conseguir resultados reales y visibles"],
      "jobs": ["Ingeniero mecánico", "Electricista", "Piloto", "Mecánico de automóviles"],
      "env": "Talleres, obras, laboratorios o cabinas donde importan la destreza, la seguridad y el trabajo en equipo, y cada día ves lo que has conseguido.",
      "watch": "Quitarle valor a tus habilidades. Lo que a ti te parece obvio suele impresionar a todos los demás.",
      "tip": "Aprende una herramienta o técnica nueva cada temporada. Tus habilidades crecen más rápido cuando las vas sumando paso a paso."
    },
    "analyst": {
      "name": "El Analista",
      "word": "analista",
      "vibe": "Los detalles, los datos y el orden son tus superpoderes silenciosos.",
      "desc": "Te fijas en lo que otros pasan por alto. Disfrutas del trabajo meticuloso, de las reglas claras y de la satisfacción de que cada número y cada detalle estén exactamente bien. Piensas antes de actuar, y la gente confía en tu criterio porque se apoya en hechos. Un trabajo en el que puedas organizar, comprobar, medir o analizar información probablemente te resultará tranquilo y gratificante.",
      "keywords": ["Preciso", "Lógico", "Sereno"],
      "strengths": ["Detectar errores y patrones en la información", "Mantener limpio y ordenado lo complejo", "Tomar decisiones cuidadosas basadas en hechos"],
      "jobs": ["Contable", "Analista de datos", "Bibliotecario", "Técnico de laboratorio"],
      "env": "Lugares tranquilos y bien organizados con expectativas claras, donde se valora la exactitud y tienes tiempo para hacer las cosas bien.",
      "watch": "Esperar a tener la información perfecta. A veces una decisión suficientemente buena hoy vale más que una perfecta el mes que viene.",
      "tip": "Comparte una conclusión de tu trabajo cada semana. Tus hallazgos cuidadosos ayudan a más gente cuando se enteran de ellos."
    }
  }
};
