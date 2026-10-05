/* ¿Qué animal eres? (es)
 * Same 8 animal ids (wolf owl otter lion panda eagle sloth deer) and question/choice order as animal-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as animal-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name an animal result or quote a question.
 * types.<id>.word = the plain animal word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "¿Qué animal eres? Test de personalidad animal",
    "description": "¿Qué animal eres? Test de personalidad con 8 situaciones del día a día: 2 o 3 minutos, gratis y sin registro. Descubre qué animal se parece a ti, tu match ideal y consejos.",
    "ogTitle": "¿Qué animal eres? 🦊 Test de personalidad animal",
    "ogDescription": "Un test rápido de 2 minutos. Responde a 8 situaciones cotidianas y conoce al animal que más se parece a ti."
  },
  "siteName": "¿Qué animal eres?",
  "privacyLink": "Privacidad",
  "start": {
    "badge": "🦊 Test de personalidad animal",
    "h1Kicker": "¿Qué animal eres?",
    "h1Html": "¿A qué animal<br>te <em>pareces más</em>?",
    "hook": "Un plan cancelado, una llamada a medianoche, una fiesta donde solo conoces a alguien… Unos momentos cotidianos revelan tu lado salvaje.",
    "metaTime": "⏱️ 2–3 minutos",
    "metaCount": "🐾 8 preguntas",
    "start": "Encontrar mi animal →"
  },
  "quiz": {
    "backAria": "Pregunta anterior",
    "progressAria": "Progreso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Siguiendo tus huellas…",
    "sub": "Buscando el animal que encaja con tus respuestas"
  },
  "result": {
    "title": "¿Qué animal eres? Soy {name}",
    "eyebrow": "El animal que más se parece a ti",
    "strengthsLabel": "Tus superpoderes",
    "tipsLabel": "Consejos para tu lado animal",
    "bestLabel": "Tu match",
    "rivalLabel": "Tu rival",
    "sameShare": "Al {pct} % le salió este animal",
    "shareText": "Mi animal es {name} {emoji}: «{vibe}» ¿Y el tuyo?",
    "ctaStrong": "Un amigo compartió su animal",
    "ctaSub": "¿Qué animal eres? Solo 2 minutos.",
    "retry": "Repetir el test"
  },
  "og": {
    "eyebrow": "Mi animal es",
    "brand": "🦊 ¿Qué animal eres?",
    "defaultKicker": "Test de personalidad animal",
    "defaultTitle": "¿Qué animal eres?",
    "defaultDesc": "8 situaciones cotidianas · 2–3 minutos"
  },
  "faq": [
    {
      "q": "¿Cómo se elige mi animal?",
      "a": "Cada respuesta suma puntos a un par de animales, y gana el que tenga más. Los empates se resuelven con una regla fija, así que las mismas respuestas siempre dan el mismo resultado."
    },
    {
      "q": "¿Es un test de personalidad científico?",
      "a": "No, es solo para divertirse. Las preguntas se basan en hábitos y estados de ánimo cotidianos, no en un diagnóstico psicológico: tómalo como un espejo juguetón."
    },
    {
      "q": "¿Qué significan «tu match» y «tu rival»?",
      "a": "Tu match es el animal que equilibra al tuyo de forma natural. Tu rival es con el que más chocas, lo que también puede significar más chispa."
    },
    {
      "q": "¿Se guardan mis respuestas?",
      "a": "No. Tus respuestas se calculan en tu navegador y nunca se guardan. Solo contamos, de forma anónima, qué animal salió, para mostrar lo común que es cada resultado."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | ¿Qué animal eres?",
    "description": "Política de privacidad de «¿Qué animal eres?»: cookies, publicidad y estadísticas anónimas.",
    "h1": "Política de privacidad",
    "introHtml": "¿Qué animal eres? (el «Servicio») respeta tu privacidad y solo trata la información mínima necesaria, como se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan en tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos, de forma anónima, qué animal salió para mostrar la frecuencia de cada resultado."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían no funcionar bien."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y ajustes en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Solo guardamos totales diarios anónimos (visitas, tests completados, valoraciones) para mejorar el Servicio. Estos totales no te identifican."
      ],
      [
        "5. Contacto",
        "Si tienes dudas sobre esta política, contacta con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está vigente desde el 6 de octubre de 2026."
      ]
    ],
    "back": "← Volver al test de animales"
  },
  "questions": [
    {
      "q": "Te cancelan los planes del fin de semana. Tú…",
      "choices": [
        "Escribes a tus mejores amigos para ver quién está libre",
        "Por fin te acomodas con un libro o un documental",
        "Pruebas algo al azar: una cafetería nueva, un parque, lo que sea",
        "Montas una cena en un momento e invitas a todos. ¡Hoy anfitrión!"
      ]
    },
    {
      "q": "Te cae encima un gran trabajo en grupo. Tú…",
      "choices": [
        "Vas paso a paso, sin prisa y con constancia",
        "Cuidas el buen rollo y haces tu parte a tu ritmo",
        "Fijas una meta clara y apuntas al mejor resultado",
        "Primero te aseguras de que todos se sientan escuchados y cómodos"
      ]
    },
    {
      "q": "Un amigo te llama a medianoche, hecho polvo. Tú…",
      "choices": [
        "Lo animas con chistes hasta que se ría",
        "Le ayudas a armar un plan claro para solucionarlo",
        "Dices «voy para allá» y apareces en 20 minutos",
        "Te quedas al teléfono, tranquilo y reconfortante, el tiempo que haga falta"
      ]
    },
    {
      "q": "Llegas a una fiesta donde solo conoces a una persona. Tú…",
      "choices": [
        "Te quedas junto a tu amigo, sonriendo, esperando a que se acerquen",
        "Entras como si fuera tu casa y saludas a todo el mundo",
        "Observas la sala y luego hablas con quien parezca interesante",
        "Buscas un rincón cómodo junto a los snacks y no te mueves"
      ]
    },
    {
      "q": "Elige tu viaje soñado.",
      "choices": [
        "Un resort acogedor: dormir hasta tarde, comer bien, no hacer nada",
        "Un road trip con tus mejores amigos, recuerdos en cada parada",
        "Un campo lleno de flores o una cabaña en el bosque",
        "Una ciudad antigua y tranquila, llena de museos, librerías e historias"
      ]
    },
    {
      "q": "De repente surge un problema. Tú…",
      "choices": [
        "Te concentras, buscas el camino más rápido y lo resuelves",
        "Te ríes, improvisas y lo conviertes en algo divertido",
        "Respiras hondo, picas algo y dejas que se arregle solo",
        "Das un paso al frente y tomas el mando enseguida"
      ]
    },
    {
      "q": "Tus amigos te describirían como…",
      "choices": [
        "El dulce, el que siempre nota cómo se siente cada uno",
        "El ambicioso, el que siempre tiene una meta",
        "El leal, el que siempre los apoya",
        "El divertido, el que mejora cada plan"
      ]
    },
    {
      "q": "Tu noche perfecta termina con…",
      "choices": [
        "Todos aplaudiendo una noche que hiciste inolvidable",
        "Buena comida, buena gente y risas sin prisa",
        "Una conversación profunda de madrugada bajo las estrellas",
        "A la cama temprano, móvil apagado y a dormir muchísimo"
      ]
    }
  ],
  "types": {
    "wolf": {
      "name": "el Lobo leal",
      "word": "lobo",
      "vibe": "Lealtad feroz: tu manada siempre es lo primero.",
      "desc": "Eres el amigo que aparece cuando hace falta. Cuando alguien entra en tu círculo, lo proteges, lo respaldas y nunca olvidas lo que hizo por ti. Al principio puedes parecer serio, pero con los tuyos eres cálido, divertido y entregado. Tu manada tiene mucha suerte.",
      "strengths": [
        "Lealtad inquebrantable",
        "Corazón protector",
        "Espíritu de equipo"
      ],
      "tips": [
        "Deja que otros también te ayuden; no tienes que cargar con toda la manada.",
        "Di «no» de vez en cuando. Ser leal no es aceptarlo todo.",
        "Haz hueco a gente nueva; tu círculo puede crecer sin perder su calidez."
      ]
    },
    "owl": {
      "name": "el Búho sabio",
      "word": "búho,lechuza",
      "vibe": "Observador y callado, siempre tres pensamientos más profundo.",
      "desc": "Prefieres mirar, escuchar y entender antes de hablar. La gente acude a ti por consejos meditados y brillas en las conversaciones profundas de madrugada. Te encanta aprender y notas los detalles que otros pasan por alto. A veces le das demasiadas vueltas, pero tu perspicacia es un verdadero regalo.",
      "strengths": [
        "Perspicacia afilada",
        "Gran capacidad de escucha",
        "Mente curiosa"
      ],
      "tips": [
        "Comparte tus ideas antes de que sean perfectas; la gente quiere oírlas.",
        "Cuando tu mente va a mil, escribe o sal a caminar en vez de darle vueltas.",
        "Agenda un rato de diversión sin ningún objetivo. Tu cerebro merece recreo."
      ]
    },
    "otter": {
      "name": "la Nutria juguetona",
      "word": "nutria",
      "vibe": "Pura diversión, grandes sonrisas y talento para mejorar cualquier día.",
      "desc": "Conviertes los momentos normales en juegos. Eres curiosa, simpática y casi imposible de poner triste. Haces amigos donde vayas y mantienes el ambiente ligero aunque todo se complique. Detrás de las bromas, solo quieres que todos disfruten juntos.",
      "strengths": [
        "Buen rollo al instante",
        "Amistades fáciles",
        "Diversión sin miedo"
      ],
      "tips": [
        "Regálate un minuto de calma de vez en cuando; no toda emoción necesita un chiste.",
        "Termina una cosa pequeña antes de empezar la siguiente aventura.",
        "Cuéntales cuando de verdad lo pases mal. Les encantará estar contigo."
      ]
    },
    "lion": {
      "name": "el León audaz",
      "word": "león",
      "vibe": "Seguro, de gran corazón y nacido para liderar la sala.",
      "desc": "Das un paso al frente cuando otros dudan. Tienes presencia, valentía y un lado generoso, y la gente sigue tu energía con naturalidad. Te encantan los grandes momentos y haces que los tuyos se sientan celebrados. En tu mejor versión, lideras elevando a todos los que te rodean.",
      "strengths": [
        "Liderazgo natural",
        "Valentía generosa",
        "Confianza contagiosa"
      ],
      "tips": [
        "Cede el foco a veces; las voces tranquilas suelen tener las mejores ideas.",
        "Pregunta antes de tomar el mando. La ayuda funciona mejor cuando se pide.",
        "Descansar también es ser fuerte. Hasta los reyes echan la siesta."
      ]
    },
    "panda": {
      "name": "el Panda tranquilo",
      "word": "panda",
      "vibe": "Tranquilo, amable y la calma en cualquier tormenta.",
      "desc": "Te dejas llevar y ayudas a todos a tu alrededor a relajarse. Disfrutas de la buena comida, la buena compañía y los días sin prisa. Rara vez montas dramas y es muy difícil alterarte. A la gente le encanta lo seguro y cómodo que es estar contigo.",
      "strengths": [
        "Presencia serena",
        "Amabilidad tranquila",
        "Disfruta de lo pequeño"
      ],
      "tips": [
        "Di en voz alta lo que quieres; tú también puedes tener un favorito.",
        "Elige un pequeño objetivo cada semana para estirarte un poco.",
        "No dejes que el «lo que sea» esconda lo que de verdad sientes."
      ]
    },
    "eagle": {
      "name": "el Águila ambiciosa",
      "word": "águila",
      "vibe": "Enfocada, independiente y siempre apuntando más alto.",
      "desc": "Ves el panorama completo y vas a por él. Te marcas metas, haces planes y te exiges mucho. Te gusta ser independiente y resuelves problemas rápido. Tu ambición inspira, y en el fondo esperas encontrar a alguien que siga tu ritmo.",
      "strengths": [
        "Enfoque claro",
        "Espíritu independiente",
        "Resuelve problemas rápido"
      ],
      "tips": [
        "Celebra las victorias del camino, no solo la cima.",
        "Delega algo esta semana. La confianza llega más lejos que la velocidad.",
        "Pregunta cómo se sienten los demás; avanzar es mejor si se comparte."
      ]
    },
    "sloth": {
      "name": "el Perezoso acogedor",
      "word": "perezoso",
      "vibe": "Lento, constante y un profesional de disfrutar la vida.",
      "desc": "Conoces el secreto que otros olvidan: no hay premio por ir con prisas. Proteges tu paz, amas tus comodidades y avanzas un suave paso a la vez. Eres paciente, tranquilo y discretamente sabio sobre lo que importa de verdad. Tu calma es un regalo en un mundo apresurado.",
      "strengths": [
        "Paciencia profunda",
        "Mente en paz",
        "Maestro de la comodidad"
      ],
      "tips": [
        "Empieza antes de sentirte listo; los pasos pequeños también cuentan.",
        "Cuéntales tus planes a tus amigos con tiempo para que se adapten a tu ritmo.",
        "Prueba algo nuevo al mes. Lo acogedor y lo curioso pueden ir juntos."
      ]
    },
    "deer": {
      "name": "el Ciervo gentil",
      "word": "ciervo,venado",
      "vibe": "De corazón tierno, elegante y sintonizado con los sentimientos de todos.",
      "desc": "Notas las cosas pequeñas: un cambio de ánimo, alguien solo en un rincón. Eres suave, sensible y discretamente amable, y amas los lugares bonitos y tranquilos. Quizá te sobresaltes ante los conflictos, pero tu empatía hace que la gente te confíe sus sentimientos.",
      "strengths": [
        "Empatía profunda",
        "Amabilidad elegante",
        "Ojo para la belleza"
      ],
      "tips": [
        "Tus sentimientos importan tanto como los suyos; habla pronto, aunque sea bajito.",
        "Recarga con naturaleza o música después de los días ajetreados.",
        "Puedes decir «necesito un momento» sin dar explicaciones."
      ]
    }
  }
};
