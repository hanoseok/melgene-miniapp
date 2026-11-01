/* Test de estilo de apego (es) — Spanish, tú
 * 4 result ids (secure anxious avoidant fearful);
 * questions[i].choices[j] follow attach-core.js QUESTIONS[i].w[j] (the [anxiety, avoidance] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Kind, non-judgmental wording: every style is a way of coping that once made sense, and styles can change.
 * Just for fun and self-reflection — not a clinical or psychological diagnosis.
 * Placeholders: {name} {nick} {emoji} {vibe} {pct}.
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
    "title": "Test de estilo de apego: ¿cuál es mi estilo de apego?",
    "description": "Test de estilo de apego: 11 preguntas cotidianas sobre amistades, familia y pareja, 2 minutos y sin registro. Descubre cómo te vinculas, con consejos amables.",
    "ogTitle": "Test de estilo de apego 🫂 ¿Cómo te vinculas?",
    "ogDescription": "Once situaciones cotidianas con amistades, familia y pareja. Descubre tu estilo de apego, tus fortalezas y consejos amables para unas relaciones más cercanas."
  },
  "siteName": "Test de estilo de apego",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "🫂 ¿Cómo te vinculas?",
    "h1Kicker": "Test de estilo de apego",
    "h1Html": "¿Cómo quieres<br>y te <em>vinculas</em>?",
    "hook": "Un mensaje que tarda en llegar, un plan cancelado, una amiga que de repente se abre contigo. Cómo reaccionas ante estos pequeños momentos dice mucho de cómo creas vínculos. Responde once preguntas cotidianas y conoce tu estilo de apego.",
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
    "text": "Leyendo entre líneas…",
    "sub": "Viendo cómo te vinculas con los demás"
  },
  "result": {
    "title": "Mi estilo de apego: {name}",
    "metaDesc": "Resultado del test de estilo de apego: {name}, {nick}. {vibe} Descubre tus fortalezas y tres consejos amables para tus relaciones.",
    "eyebrow": "Tu estilo de apego",
    "gaugeLabel": "Hacia dónde se inclinaron tus respuestas",
    "axes": [
      [
        "Tranquilidad",
        "Preocupación"
      ],
      [
        "Cercanía",
        "Espacio propio"
      ]
    ],
    "strengthsLabel": "Tus fortalezas",
    "tipsLabel": "Consejos para tus relaciones",
    "matchLabel": "Te sientes a gusto con",
    "disclaimer": "Solo por diversión y para conocerte mejor. Es un test ligero, no una evaluación psicológica ni un diagnóstico. El estilo de apego puede cambiar con el tiempo y según la relación. Si tus relaciones te hacen sufrir a menudo, hablar con un psicólogo puede ayudarte de verdad.",
    "sameShare": "El {pct} % de la gente tiene este estilo",
    "shareText": "Mi estilo de apego es {name} {emoji} «{vibe}» ¿Y el tuyo?",
    "ctaStrong": "Alguien ha compartido su estilo de apego contigo",
    "ctaSub": "¿Y tú, cómo te vinculas? Descúbrelo en 2 minutos.",
    "retry": "Repetir el test"
  },
  "og": {
    "eyebrow": "Mi estilo de apego",
    "brand": "🫂 Test de estilo de apego",
    "defaultKicker": "Un test tranquilo sobre tus vínculos",
    "defaultTitle": "¿Cuál es mi estilo de apego?",
    "defaultDesc": "11 preguntas · 2 minutos · cómo te vinculas"
  },
  "faq": [
    {
      "q": "¿Cómo se decide mi resultado?",
      "a": "Cada respuesta mueve dos escalas que los investigadores usan para describir el apego en adultos: cuánto te preocupa la cercanía y lo cómodo que te sientes al apoyarte en los demás. Tu resultado está donde se cruzan ambas, y las mismas respuestas dan siempre el mismo resultado."
    },
    {
      "q": "¿Es un diagnóstico psicológico?",
      "a": "No. Es un test ligero para divertirte y reflexionar, no una evaluación profesional ni científica. El estilo de apego no es un trastorno ni una etiqueta fija. Si tus relaciones te resultan a menudo dolorosas o confusas, un psicólogo o terapeuta puede ayudarte a explorarlo con calma."
    },
    {
      "q": "¿Puede cambiar mi estilo de apego?",
      "a": "Sí. Mucha gente muestra patrones distintos con personas distintas, y las relaciones que cuidan, el autoconocimiento y la terapia pueden ayudar a sentirse más en calma y más a gusto con el tiempo. Repite el test dentro de unos meses y compara."
    },
    {
      "q": "¿Se guardan mis respuestas?",
      "a": "No. Tus respuestas se calculan en tu navegador y no se almacenan. Solo contamos, de forma anónima, qué resultado ha salido, para poder mostrarte lo habitual que es."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Test de estilo de apego",
    "description": "Política de privacidad del Test de estilo de apego: cómo usamos las cookies, la publicidad y las estadísticas anónimas.",
    "h1": "Política de privacidad",
    "introHtml": "El Test de estilo de apego (el «Servicio») respeta tu privacidad y trata únicamente la información mínima necesaria, tal como se describe a continuación.",
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
        "Esta política entra en vigor el 2 de noviembre de 2026."
      ]
    ],
    "back": "← Volver al Test de estilo de apego"
  },
  "questions": [
    {
      "q": "Una amiga cercana lleva todo el día sin contestar a tu mensaje. ¿Qué se te pasa por la cabeza?",
      "choices": [
        "Estará liada. Ya me contestará luego.",
        "Releo mi mensaje preguntándome si dije algo que no debía.",
        "La verdad, apenas me doy cuenta. No soy de estar escribiendo todo el rato.",
        "Me preocupo un poco y luego me digo que no debería importarme tanto."
      ]
    },
    {
      "q": "Alguien con quien empiezas a tener confianza te dice: «Me encanta pasar tiempo contigo». Tú…",
      "choices": [
        "Te emocionas y luego te preguntas si seguirá sintiéndolo el mes que viene",
        "Sientes un calorcito por dentro y le dices que es mutuo",
        "Te alegras, pero curiosamente te entran ganas de dar un pasito atrás",
        "Te sientes algo cortado y cambias de tema con una broma"
      ]
    },
    {
      "q": "Estás pasando una semana muy dura. ¿Qué sueles hacer?",
      "choices": [
        "Me las apaño solo. No me gusta apoyarme en nadie.",
        "Quiero escribir a alguien, pero me callo para no ser una carga",
        "Le cuento a alguien cercano lo que pasa y dejo que me ayude",
        "Escribo a varias personas esperando que alguien se interese por mí"
      ]
    },
    {
      "q": "Un amigo cancela vuestro plan en el último momento.",
      "choices": [
        "Le digo que no pasa nada, pero decido en silencio no contar tanto con él",
        "En el fondo, un poco aliviado. ¡Más tiempo para mí!",
        "Me pregunto si en realidad no tiene ganas de verme",
        "Sin problema. Quedamos otro día."
      ]
    },
    {
      "q": "Un amigo nuevo empieza a contarte cosas personales. ¿Y tú?",
      "choices": [
        "Yo también me abro, poco a poco, con naturalidad",
        "Quiero abrirme, pero me bloqueo a mitad de camino y me echo atrás",
        "Cuento mucho y muy rápido. Quiero que nos hagamos íntimos enseguida.",
        "Lo mantengo ligero. Lo personal me lo guardo."
      ]
    },
    {
      "q": "Tú y alguien cercano no estáis de acuerdo en algo importante.",
      "choices": [
        "Quiero arreglarlo ya. Esperar se me hace insoportable.",
        "Necesito espacio y me quedo callado hasta que se pase",
        "Lo hablamos con calma, aunque resulte un poco incómodo",
        "Oscilo entre querer hablarlo y querer desaparecer"
      ]
    },
    {
      "q": "Alguien cercano se va una semana fuera. ¿Cuánto contacto te parece bien?",
      "choices": [
        "Ya nos pondremos al día cuando vuelva. Disfruto del espacio.",
        "Unos cuantos mensajes están bien, pero ninguno también",
        "Difícil de decir. Le echo de menos, pero demasiados mensajes me agobian.",
        "Una pequeña novedad cada día. Me gusta sentir que seguimos conectados."
      ]
    },
    {
      "q": "Alguien tiene contigo un detalle bonito que no esperabas.",
      "choices": [
        "Me emociona, pero una parte de mí se pregunta qué querrá a cambio",
        "Me encanta y siento que debería hacer todavía más por esa persona",
        "Me siento un poco incómodo, como si ahora le debiera una",
        "Le doy las gracias y simplemente lo disfruto"
      ]
    },
    {
      "q": "Cuando piensas en las personas más cercanas a ti, ¿qué frase te describe mejor?",
      "choices": [
        "Confío en que estarán ahí para mí, y ellas también pueden contar conmigo",
        "Las quiero, pero donde mejor estoy es apoyándome en mí mismo",
        "A veces me preocupa que me importen ellas más a mí que yo a ellas",
        "Quiero estar cerca, pero una parte de mí espera salir herida"
      ]
    },
    {
      "q": "Llega alguien nuevo a tu grupo y parece que a todo el mundo le encanta.",
      "choices": [
        "Me da un poco igual. Yo tengo mi pequeño círculo.",
        "Me preocupa un poco quedarme fuera",
        "Me mantengo algo en guardia hasta saber si puedo confiar",
        "Genial, una persona más con la que quedar"
      ]
    },
    {
      "q": "Alguien te pregunta con cariño: «¿Va todo bien últimamente?»",
      "choices": [
        "Digo «estoy bien» y luego me arrepiento de no haber contado más",
        "Le cuento con sinceridad cómo estoy",
        "Digo que estoy bien y cambio de tema. Ya lo resolveré yo.",
        "Me alivia tanto que alguien lo note que lo suelto todo de golpe"
      ]
    }
  ],
  "types": {
    "secure": {
      "name": "Seguro",
      "nick": "El Puerto Tranquilo",
      "word": "apego seguro",
      "vibe": "Sabes estar cerca sin perderte y lejos sin perder la confianza.",
      "desc": "Sueles confiar en que las personas que quieres estarán ahí, y te sientes a gusto estando ahí para ellas. La cercanía no te asusta, y un poco de distancia tampoco. Cuando algo va mal, normalmente puedes decir lo que sientes sin estallar ni cerrarte. La gente suele sentirse más tranquila a tu lado, como si le ofrecieras un lugar donde aterrizar. Eso no significa que nunca te preocupes, sino que casi siempre encuentras el camino de vuelta al equilibrio.",
      "keywords": [
        "Confiado",
        "Abierto",
        "Equilibrado"
      ],
      "strengths": [
        "Decir lo que necesitas de forma sencilla y amable",
        "Dar espacio a los demás sin sentirte rechazado",
        "Hacer las paces tras una discusión en vez de llevar la cuenta"
      ],
      "tips": [
        "Acuérdate de preguntarte también cómo estás tú. Ser el pilar no significa cargar con todo a solas.",
        "Cuando alguien cercano parezca inquieto o distante, recuerda que puede ser un patrón antiguo suyo, no un veredicto sobre ti.",
        "Comparte lo que te ayuda a mantener la calma. Un simple «esto es lo que me ayuda» puede ser un regalo para quien lo está pasando mal."
      ],
      "match": "Dos corazones tranquilos construyen relaciones fáciles y sinceras. Tu calma también ayuda a cualquier otro estilo a sentirse más a salvo con el tiempo."
    },
    "anxious": {
      "name": "Ansioso",
      "nick": "El Corazón Entregado",
      "word": "apego ansioso, apego preocupado",
      "vibe": "Quieres con todo el corazón y notas cualquier cambio en el ambiente.",
      "desc": "Te importan mucho los demás y te fijas en todo: una respuesta más corta, un cambio de tono, un plan que se tambalea. Sentirte cerca de la gente es muy importante para ti, así que cuando un vínculo parece incierto, tu mente se acelera para rellenar los huecos. Esa sensibilidad te hace cálido, atento y leal. La preocupación no es un defecto: es una señal de lo mucho que valoras a las personas de tu vida. Con un poco de apoyo y práctica, ese gran corazón puede sentirse cerca y en calma a la vez.",
      "keywords": [
        "Cariñoso",
        "Atento",
        "Leal"
      ],
      "strengths": [
        "Notar cómo se sienten los demás antes de que lo digan",
        "Mostrar cariño y gratitud con generosidad",
        "Esforzarte de verdad por mantener vivas tus relaciones"
      ],
      "tips": [
        "Cuando la preocupación se dispare, para un momento antes de enviar ese mensaje de más. Pregúntate qué sabes, no qué temes.",
        "Di a los demás qué te tranquiliza, como un rápido «hablamos luego». Una necesidad clara es más fácil de atender que una adivinanza.",
        "Construye una vida que te llene por sí misma: aficiones, amistades, ratos tranquilos. La calma crece con muchas anclas, no con una sola."
      ],
      "match": "Una pareja o un amigo estable y constante ayuda a que tus preocupaciones se calmen, y tu calidez le ayuda a abrirse."
    },
    "avoidant": {
      "name": "Evitativo",
      "nick": "El Espíritu Libre",
      "word": "apego evitativo, apego distante",
      "vibe": "Valoras tu independencia y demuestras tu cariño de forma discreta y práctica.",
      "desc": "Eres autosuficiente y se te da bien resolver las cosas por tu cuenta. Disfrutas de la gente, pero también necesitas mucho espacio, y demasiada intensidad emocional puede hacer que quieras dar un paso atrás. No es frialdad: muchas veces es un hábito aprendido hace tiempo, el de confiar primero en ti. Tu calma bajo presión y tu respeto por la libertad de los demás son fortalezas reales. Dejar que la gente se acerque poco a poco puede hacer tus relaciones más ligeras, no más pesadas.",
      "keywords": [
        "Independiente",
        "Sereno",
        "Resolutivo"
      ],
      "strengths": [
        "Mantener la calma cuando las cosas se ponen tensas",
        "Respetar el espacio y las decisiones de los demás",
        "Resolver problemas de forma práctica y fiable"
      ],
      "tips": [
        "Cuando necesites espacio, dilo y di cuándo volverás. «Necesito una tarde para mí, hablamos mañana» mantiene la confianza.",
        "Prueba a compartir un pequeño sentimiento a la semana con alguien de confianza. La cercanía puede crecer a pasitos.",
        "Fíjate en las ganas de alejarte justo cuando todo va bien. Quedarte un momento más suele ser lo que hace más profundo el vínculo."
      ],
      "match": "Una persona serena y paciente respeta tu espacio sin tomárselo como algo personal, y así te resulta más fácil dejarla acercarse."
    },
    "fearful": {
      "name": "Desorganizado",
      "nick": "El Erizo Tierno",
      "word": "apego desorganizado, apego temeroso",
      "vibe": "Anhelas la cercanía y también sabes cuánto puede doler.",
      "desc": "Una parte de ti quiere una conexión profunda y otra se mantiene en guardia, lista para protegerte. Por eso a veces te acercas y luego te alejas, sin saber muy bien por qué. Como un erizo en invierno, quieres calor pero temes las púas. Esta mezcla suele venir de experiencias en las que la cercanía no siempre fue un lugar a salvo. No eres demasiado ni demasiado complicado: eres perspicaz, sensible y profundamente empático, y con confianza y tiempo puedes sentirte cerca y a salvo a la vez.",
      "keywords": [
        "Sensible",
        "Empático",
        "Perspicaz"
      ],
      "strengths": [
        "Entender el dolor ajeno porque lo has sentido",
        "Leer a las personas y las situaciones con verdadera profundidad",
        "Cuidar la confianza como un tesoro una vez construida"
      ],
      "tips": [
        "Ponle nombre al tira y afloja cuando lo notes. Decir «una parte de mí quiere acercarse y otra tiene miedo» es valiente y ayuda.",
        "Elige relaciones que se sientan tranquilas y constantes, y dales tiempo para demostrar lo que valen.",
        "Sé amable contigo. Si viejas heridas siguen marcando tu presente, un psicólogo puede ser un gran aliado."
      ],
      "match": "Una persona estable y constante que sigue siendo amable cuando flaqueas puede enseñarte poco a poco que la cercanía puede ser un lugar a salvo."
    }
  }
};
