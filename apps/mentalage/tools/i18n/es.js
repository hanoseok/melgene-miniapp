/* Test de edad mental (es)
 * Same 8 age-bracket ids (kid teen fresh hustle steady seasoned mellow sage) and question/choice order as mentalage-core.js
 * (the "mind age" points live only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].points[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * result.age = plural forms for the number age (Intl.PluralRules: one/few/many/other), {n} = the number (or a range like 24–29).
 * Placeholders: {name} {emoji} {vibe} {age} {pct} {n} {min} {max} {range} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Pangolin&display=swap",
    "display": "'Pangolin'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test de edad mental: ¿cuántos años tiene tu mente?",
    "description": "Haz el test de edad mental: 12 preguntas ligeras del día a día, 2 o 3 minutos, sin registro. Descubre cuántos años tiene de verdad tu mente, con el número exacto, tus fortalezas y consejos.",
    "ogTitle": "Test de edad mental 🧠 ¿Cuántos años tiene tu mente?",
    "ogDescription": "Un quiz de 2 minutos. 12 preguntas cotidianas revelan tu edad mental con número exacto."
  },
  "siteName": "Test de edad mental",
  "privacyLink": "Privacidad",
  "start": {
    "badge": "🧠 Quiz rápido de la mente",
    "h1Kicker": "Test de edad mental",
    "h1Html": "¿Cuántos años tiene<br><em>tu mente</em> de verdad?",
    "hook": "Tu DNI dice un número. Tus costumbres de cada día quizá digan otro. Responde con sinceridad y mira lo que opina tu cabeza.",
    "metaTime": "⏱️ 2–3 min",
    "metaCount": "✏️ 12 preguntas",
    "start": "Ver mi edad mental →"
  },
  "quiz": {
    "backAria": "Pregunta anterior",
    "progressAria": "Progreso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Leyendo tus garabatos…",
    "sub": "Contando las velas del pastel de tu mente"
  },
  "result": {
    "title": "Test de edad mental: soy {name}",
    "eyebrow": "Tu edad mental",
    "range": "{min}–{max}",
    "age": {
      "one": "{n} año",
      "few": "{n} años",
      "many": "{n} años",
      "other": "{n} años"
    },
    "metaRange": "Edad mental: {range}.",
    "strengthsLabel": "Lo que te hace brillar",
    "tipsLabel": "Consejos para tu edad mental",
    "bestLabel": "Mejor amigo",
    "rivalLabel": "Rival",
    "sameShare": "Al {pct} % le salió esta edad",
    "shareText": "Mi edad mental: {age} {emoji} {name} — «{vibe}» ¿Cuántos años tiene tu mente?",
    "ctaStrong": "Alguien te compartió su edad mental",
    "ctaSub": "¿Cuántos años tiene tu mente? 2 minutos.",
    "retry": "Repetir el test"
  },
  "og": {
    "eyebrow": "Mi edad mental",
    "brand": "🧠 Test de edad mental",
    "defaultKicker": "Test de edad mental",
    "defaultTitle": "¿Cuántos años tiene tu mente?",
    "defaultDesc": "12 preguntas cotidianas · 2–3 minutos"
  },
  "faq": [
    {
      "q": "¿Cómo se calcula mi edad mental?",
      "a": "Cada respuesta suma unos puntos de «edad mental». El total te coloca en un grupo de edad, y dónde caen tus respuestas dentro de ese grupo da el número exacto. Mismas respuestas, mismo resultado."
    },
    {
      "q": "¿Es un test psicológico de verdad?",
      "a": "No, es solo por diversión. Mira hábitos y estados de ánimo del día a día, no la inteligencia ni la madurez. Tómalo como un espejo divertido, no como un diagnóstico."
    },
    {
      "q": "¿Por qué mi resultado es tan distinto de mi edad real?",
      "a": "Ahí está la gracia. Mucha gente tiene una mente más joven o más madura que su edad. El resultado también puede cambiar con tu humor, así que prueba otro día."
    },
    {
      "q": "¿Se guardan mis respuestas?",
      "a": "No. Tus respuestas se calculan en tu navegador y nunca se guardan. Solo contamos de forma anónima qué grupo de edad salió para mostrar cuánto se repite cada resultado."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Test de edad mental",
    "description": "Política de privacidad del Test de edad mental: cookies, publicidad y estadísticas anónimas.",
    "h1": "Política de privacidad",
    "introHtml": "Test de edad mental (el «Servicio») respeta tu privacidad y solo trata la información mínima necesaria, como se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan en tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos de forma anónima qué grupo de edad salió para mostrar cuánto se repite cada resultado."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían no funcionar bien."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y ajustes de personalización en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Guardamos totales diarios anónimos (visitas, tests completados, valoraciones) para mejorar el Servicio. Estos totales no te identifican."
      ],
      [
        "5. Contacto",
        "Si tienes preguntas sobre esta política, contacta con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está vigente desde el 8 de octubre de 2026."
      ]
    ],
    "back": "← Volver al test de edad mental"
  },
  "questions": [
    {
      "q": "Un sábado sin alarma. ¿A qué hora te despiertas?",
      "choices": [
        "A las 6, con el día ya planeado",
        "Sobre las 9, descansado y sin despertador",
        "Pasado el mediodía… ¿qué es la mañana?",
        "¡Tempranísimo, saltando de la cama porque es finde!"
      ]
    },
    {
      "q": "Tu cumpleaños ideal es…",
      "choices": [
        "¡Globos, gorritos y una tarta gigante!",
        "Un fiestón con toda la pandilla",
        "Una cena tranquila con unos pocos amigos",
        "Un día tranquilo y una llamada de la familia"
      ]
    },
    {
      "q": "Estás fuera y al móvil le queda un 15 %.",
      "choices": [
        "Pánico, a buscar un enchufe ya",
        "Tranqui, siempre llevo batería externa",
        "Si se apaga, se apaga. ¡Modo aventura!"
      ]
    },
    {
      "q": "En el súper, vas directo a…",
      "choices": [
        "El pasillo de chuches y galletas",
        "Pizzas congeladas y bebidas energéticas",
        "La fruta, la verdura y las ofertas de la semana",
        "Mi lista de la compra, en orden"
      ]
    },
    {
      "q": "Todo el mundo habla de una canción nueva.",
      "choices": [
        "Ya me sé el baile de TikTok",
        "A mi playlist desde el primer día",
        "¿Eso no es una versión de una canción antigua?",
        "Ya la escucharé… algún día"
      ]
    },
    {
      "q": "Un día libre de lluvia. ¿Plan?",
      "choices": [
        "¡Botas de agua y a saltar en los charcos!",
        "Mantita, picoteo y una temporada entera de serie",
        "Un buen cocido o una sopa y ordenar un poco",
        "Té, un buen libro y siesta con el sonido de la lluvia"
      ]
    },
    {
      "q": "Te llega un bonus sorpresa.",
      "choices": [
        "Por fin me compro ese videojuego o figura",
        "Reservo un viaje con amigos ya mismo",
        "Una buena cena y el resto, ahorrado",
        "Todo a la cuenta de ahorro. Mi yo del futuro lo agradece."
      ]
    },
    {
      "q": "Viernes por la noche, sin planes.",
      "choices": [
        "Videojuegos o llamadas hasta que salga el sol",
        "Escribo a todos hasta que salga un plan",
        "Pijama a las 9, en la cama a las 10. Gloria."
      ]
    },
    {
      "q": "Notas que te viene un resfriado.",
      "choices": [
        "Me quejo un poco a ver si alguien me mima",
        "Lo ignoro y sigo con lo mío",
        "Infusión de jengibre, vitaminas y a la cama pronto",
        "Me tomo algo y sigo con calma"
      ]
    },
    {
      "q": "El grupo de WhatsApp no para de sonar.",
      "choices": [
        "Respondo con diez stickers seguidos",
        "Mando el meme perfecto",
        "Lo leo todo y luego respondo con un mensaje largo",
        "Lo silencio. ¿Por qué escribe tanto la gente?"
      ]
    },
    {
      "q": "Ahora mismo tu cuarto es…",
      "choices": [
        "Peluches, figuras y cosas de colores por todas partes",
        "Pósters, cables y un caos creativo",
        "Limpio y minimalista, cada cosa en su sitio",
        "Plantas, un sillón cómodo y una lámpara de lectura"
      ]
    },
    {
      "q": "Si solo pudieras elegir una…",
      "choices": [
        "Volver a ser un niño sin preocupaciones por un día",
        "Saltar directo a una jubilación tranquila"
      ]
    }
  ],
  "types": {
    "kid": {
      "name": "Peque del parque",
      "word": "peque,parque",
      "vibe": "Curioso, juguetón y con energía de pura alegría.",
      "desc": "Tu mente sigue a ritmo de recreo. Te emocionas rápido, te ríes fuerte y encuentras algo divertido en casi todo. Las normas son opcionales si hay un juego de por medio. Esa energía sincera y luminosa contagia y hace que la gente a tu alrededor también se sienta joven.",
      "strengths": [
        "Curiosidad infinita",
        "Subidón de ánimo al instante",
        "Imaginación sin miedo"
      ],
      "tips": [
        "Conserva la ilusión, pero pon un recordatorio para las tareas aburridas de adulto.",
        "Cuando algo te parezca injusto, respira tres veces antes de reaccionar.",
        "Comparte tu cosa graciosa favorita con un amigo que necesite sonreír."
      ]
    },
    "teen": {
      "name": "Adolescente rebelde",
      "word": "adolescente,rebelde",
      "vibe": "Emociones enormes, opiniones claras y una playlist para cada humor.",
      "desc": "Tu mente vive con intensidad de instituto: todo importa muchísimo y lo sientes todo. Cuestionas las normas, pillas lo nuevo antes que nadie y necesitas tu espacio. Detrás de la actitud hay un corazón leal que haría lo que fuera por sus amigos de verdad.",
      "strengths": [
        "Pasión por todo",
        "Lealtad a prueba de bombas",
        "Radar de tendencias"
      ],
      "tips": [
        "No todo enfado necesita respuesta inmediata. Consúltalo con la almohada.",
        "Apunta tus grandes ideas, algunas son buenísimas.",
        "Deja que alguien mayor te sorprenda. También fue rebelde."
      ]
    },
    "fresh": {
      "name": "Espíritu de novato",
      "word": "novato",
      "vibe": "Libre, espontáneo y apuntado a todo.",
      "desc": "Tu mente está en primero de carrera: algo pelado de dinero, muy libre y siempre listo para un plan de última hora. Coleccionas experiencias en vez de cosas y haces amigos en todas partes. La vida es una gran aventura que vas descubriendo sobre la marcha.",
      "strengths": [
        "Espontaneidad",
        "Hace amigos en cualquier lado",
        "Valiente con lo nuevo"
      ],
      "tips": [
        "Di que sí a las aventuras, pero guarda un pequeño hábito de ahorro.",
        "Elige un solo objetivo este mes y llévalo hasta el final.",
        "Llama a casa de vez en cuando, les encantan tus historias."
      ]
    },
    "hustle": {
      "name": "Veinteañero a tope",
      "word": "veinteañero",
      "vibe": "Ambicioso, ocupado y con café y grandes planes como gasolina.",
      "desc": "Tu mente está en modo construcción. Haces malabares con metas, proyectos paralelos y una agenda llena, y aun así sacas tiempo para divertirte. Quieres crecer sin volverte aburrido. Tus ganas inspiran a los demás, siempre que te acuerdes de descansar.",
      "strengths": [
        "Empuje imparable",
        "Experto en malabares",
        "Planificador optimista"
      ],
      "tips": [
        "Agenda el descanso igual que agendas el trabajo.",
        "Celebra las pequeñas victorias, no solo las grandes.",
        "No hace falta tenerlo todo resuelto todavía."
      ]
    },
    "steady": {
      "name": "Treintañero sereno",
      "word": "treintañero",
      "vibe": "Tranquilo, fiable y con todo bajo control sin hacer ruido.",
      "desc": "Tu mente ha encontrado su ritmo. Sabes lo que te gusta, lo que no y cuándo decir que no. Planeas con tiempo, cumples tu palabra y cocinas bastante bien. La gente acude a ti cuando necesita una mano firme, y casi nunca la decepcionas.",
      "strengths": [
        "Fiabilidad total",
        "Planificación inteligente",
        "Conoce sus límites"
      ],
      "tips": [
        "Deja hueco para la diversión improvisada esta semana.",
        "Prueba algo en lo que vuelvas a ser principiante.",
        "Deja que te ayuden a veces. La confianza va en dos direcciones."
      ]
    },
    "seasoned": {
      "name": "Cuarentón curtido",
      "word": "cuarentón,curtido",
      "vibe": "Experimentado, práctico y difícil de alterar.",
      "desc": "Tu mente ha visto unos cuantos giros de guion y mantiene la calma. Resuelves problemas rápido, das consejos sinceros y no gastas energía en dramas. Valoras la comodidad, la calidad y a la gente que cumple lo que dice. Contigo, todos se sienten seguros.",
      "strengths": [
        "Calma bajo presión",
        "Consejos sinceros",
        "Sabiduría práctica"
      ],
      "tips": [
        "Cuenta tus historias, los más jóvenes aprenden mucho de ellas.",
        "Guarda un hobby solo por diversión, no por resultados.",
        "Estírate cada mañana. Tu espalda te lo agradecerá."
      ]
    },
    "mellow": {
      "name": "Cincuentón relajado",
      "word": "cincuentón",
      "vibe": "Tranquilo, cálido y feliz sin prisas.",
      "desc": "Tu mente disfruta del carril lento. Prefieres una buena comida, un paseo largo y una charla de verdad a una noche ruidosa. Las cosas pequeñas te hacen feliz y ya no te preocupa el qué dirán. Tu calidez tranquila hace más acogedora cualquier reunión.",
      "strengths": [
        "Presencia serena",
        "Disfruta lo pequeño",
        "Escucha generosa"
      ],
      "tips": [
        "Di que sí a una experiencia nueva esta temporada.",
        "Enseña a alguien una habilidad de la que estés orgulloso.",
        "Escribe un mensaje corto a un viejo amigo."
      ]
    },
    "sage": {
      "name": "Alma vieja y sabia",
      "word": "alma vieja,sabia",
      "vibe": "Profundo, amable y lleno de sabiduría tranquila.",
      "desc": "Tu mente parece haber vivido muchas vidas. Te encantan la calma, las rutinas, el té y los buenos libros. Notas lo que otros pasan por alto y tus consejos se recuerdan durante años. No persigues modas, pero la gente busca tu mirada serena.",
      "strengths": [
        "Mirada profunda",
        "Paciencia amable",
        "Consejos que perduran"
      ],
      "tips": [
        "Haz algo espontáneo y un poco tonto esta semana. Porque sí.",
        "Tus rutinas tranquilas son geniales: compártelas con un amigo.",
        "Juega a algo con alguien mucho más joven. Os reiréis los dos."
      ]
    }
  }
};
