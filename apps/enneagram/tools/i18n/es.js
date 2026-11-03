/* Test de eneagrama (es) — Spanish, tú (neutral, Spain + Latin America)
 * 9 result ids (type1 … type9); questions[i].choices[j] follow enneagram-core.js QUESTIONS[i].c[j]
 * (the center or stance value of each choice; the one "softer" choice per question scores 1 point instead of 2).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the type number comes from result.typeNum, the only other number is the real server share ({pct}).
 * Kind, non-judgmental wording: every type has gifts and blind spots, nobody is only one type, and people grow.
 * Just for fun and self-reflection — not an official assessment (such as the RHETI) and not a diagnosis.
 * Placeholders: {n} {name} {emoji} {vibe} {pct}.
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
    "title": "Test de eneagrama: ¿cuál es mi tipo de eneagrama?",
    "description": "Test de eneagrama gratis: 12 preguntas cotidianas, unos 2 minutos y sin registro. Descubre tu tipo, qué te motiva, tus fortalezas y consejos.",
    "ogTitle": "Test de eneagrama 🔷 ¿Cuál es tu tipo?",
    "ogDescription": "Doce preguntas cotidianas sobre cómo reaccionas, decides y recargas pilas. Descubre tu tipo de eneagrama, qué te mueve y cómo puedes crecer."
  },
  "siteName": "Test de eneagrama",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "🔷 Nueve miradas al mundo",
    "h1Kicker": "Test de eneagrama",
    "h1Html": "¿Qué te <em>mueve</em><br>de verdad?",
    "hook": "Hay quien toma las riendas, quien pone paz y quien, sin hacer ruido, lo descifra todo. El eneagrama describe nueve maneras de ver el mundo y lo que cada una desea por encima de todo. Responde doce preguntas cotidianas y conoce tu tipo.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 12 preguntas",
    "start": "Descubrir mi tipo →"
  },
  "quiz": {
    "backAria": "Pregunta anterior",
    "progressAria": "Progreso",
    "qLabel": "Pregunta {n}"
  },
  "loading": {
    "text": "Uniendo los puntos…",
    "sub": "Buscando tu lugar en el círculo"
  },
  "result": {
    "title": "Eneagrama tipo {n}: {name}",
    "metaDesc": "Resultado del test de eneagrama: tipo {n}, {name}. {vibe} Descubre tu motivación profunda, tus fortalezas y tres consejos para crecer.",
    "eyebrow": "Tu tipo de eneagrama",
    "typeNum": "Tipo {n}",
    "desireLabel": "En el fondo quieres",
    "fearLabel": "Lo que intentas evitar",
    "gaugeLabel": "Hacia dónde se inclinaron tus respuestas",
    "centerLabel": "Tu energía nace en…",
    "centers": ["El instinto", "El corazón", "La cabeza"],
    "stanceLabel": "Buscas lo que necesitas…",
    "stances": ["Yendo hacia delante", "Haciendo lo correcto", "Tomando distancia"],
    "strengthsLabel": "Tus fortalezas",
    "tipsLabel": "Consejos para crecer",
    "growthLabel": "Al crecer, tomas algo de",
    "disclaimer": "Solo por diversión y para conocerte mejor. Este test breve no es una evaluación oficial del eneagrama como el RHETI, ni un test psicológico ni un diagnóstico. Casi todo el mundo se reconoce en varios tipos, así que toma el resultado como un punto de partida, no como una etiqueta.",
    "sameShare": "El {pct} % de la gente tiene este tipo",
    "shareText": "Soy el tipo {n} del eneagrama, {name} {emoji} «{vibe}» ¿Y tú, qué tipo eres?",
    "ctaStrong": "Alguien ha compartido su tipo de eneagrama contigo",
    "ctaSub": "¿Qué te mueve a ti? Descúbrelo en 2 minutos.",
    "retry": "Repetir el test"
  },
  "og": {
    "eyebrow": "Mi tipo de eneagrama",
    "brand": "🔷 Test de eneagrama",
    "defaultKicker": "Un test de personalidad rápido",
    "defaultTitle": "¿Cuál es mi tipo de eneagrama?",
    "defaultDesc": "12 preguntas · 2 minutos · qué te mueve"
  },
  "faq": [
    {
      "q": "¿Cómo se decide mi tipo?",
      "a": "La mitad de las preguntas observa dónde suele nacer tu energía: en el cuerpo y el instinto, en los sentimientos o en el pensamiento. La otra mitad observa cómo sueles buscar lo que necesitas. Tu tipo está donde se cruzan esas dos respuestas, y las mismas respuestas dan siempre el mismo resultado."
    },
    {
      "q": "¿Es el test oficial del eneagrama?",
      "a": "No. Es un test breve para divertirte y reflexionar, no una evaluación oficial ni validada como el RHETI, ni un diagnóstico psicológico. Si tu resultado no te convence, lee también sobre los tipos vecinos. Mucha gente solo encuentra su tipo después de reflexionar un tiempo."
    },
    {
      "q": "¿Puede cambiar mi tipo?",
      "a": "Según la enseñanza del eneagrama, el tipo principal se mantiene bastante estable, pero la forma de expresarlo cambia mucho con el estrés, el estado de ánimo y el crecimiento personal. Tus respuestas también pueden variar, así que repite el test dentro de unos meses y mira si sale el mismo tipo."
    },
    {
      "q": "¿Se guardan mis respuestas?",
      "a": "No. Tus respuestas se calculan en tu navegador y no se almacenan. Solo contamos, de forma anónima, qué tipo ha salido, para poder mostrar lo habitual que es."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Test de eneagrama",
    "description": "Política de privacidad del Test de eneagrama: cómo usamos las cookies, la publicidad y las estadísticas anónimas.",
    "h1": "Política de privacidad",
    "introHtml": "El Test de eneagrama (el «Servicio») respeta tu privacidad y trata únicamente la información mínima necesaria, tal como se describe a continuación.",
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
        "Esta política entra en vigor el 4 de noviembre de 2026."
      ]
    ],
    "back": "← Volver al Test de eneagrama"
  },
  "questions": [
    {
      "q": "Llegas a una fiesta donde casi no conoces a nadie. ¿Qué haces primero?",
      "choices": [
        "Tanteo el ambiente y voy donde hay más energía",
        "Me fijo en quién parece simpático y en qué impresión estoy dando",
        "Me quedo un momento al margen para entender cómo funciona todo",
        "Pido algo de beber y me lanzo a conversar"
      ]
    },
    {
      "q": "En un proyecto en grupo, lo natural para ti es…",
      "choices": [
        "Tomar la iniciativa y sacar las cosas adelante",
        "Encargarme de mi parte y hacerla a mi manera, sin ruido",
        "Asegurarme de que todos van al día y no se olvida nada",
        "Soltar la idea más atrevida y contagiar las ganas"
      ]
    },
    {
      "q": "Ante una gran decisión, ¿en qué confías más?",
      "choices": [
        "En lo que siento y en lo que supone para la gente que quiero",
        "En informarme bien, una lista de pros y contras y un plan B",
        "En hablarlo con alguien cercano hasta que me parezca bien",
        "En mi instinto. Casi siempre lo sé sin más."
      ]
    },
    {
      "q": "Cuando de verdad quieres algo, normalmente…",
      "choices": [
        "Primero compruebo que a la gente de mi entorno le parece bien",
        "Voy directo a conseguirlo",
        "Sueño con ello mucho tiempo antes de hacer nada",
        "Trabajo duro, lo hago como es debido y confío en que dará frutos"
      ]
    },
    {
      "q": "¿Qué es lo que más te desestabiliza en un mal día?",
      "choices": [
        "No saber qué va a pasar después",
        "Que me den órdenes o que algo me parezca injusto",
        "Sentir que nadie me valora ni se fija en mí",
        "Demasiados cabos sueltos y nadie con un plan claro"
      ]
    },
    {
      "q": "Después de una semana larga y ajetreada, recargar pilas es…",
      "choices": [
        "Tiempo a solas, el teléfono apagado, en mi mundo",
        "Un plan nuevo: un viaje, una noche fuera, algo grande",
        "Un día tranquilo sin hacer absolutamente nada",
        "Vaciar mi lista de pendientes para por fin relajarme de verdad"
      ]
    },
    {
      "q": "Estás en una fila que no avanza. Tú…",
      "choices": [
        "Charlo con quien tengo al lado o le escribo a alguien",
        "Lo noto en el cuerpo: inquietud, la mandíbula tensa",
        "Calculo cuánto tardará y busco una opción más rápida",
        "Me acerco al principio a ver qué está pasando de verdad"
      ]
    },
    {
      "q": "Alguien te lleva la contraria delante de otros. Tú…",
      "choices": [
        "Busco un punto medio justo con el que todos puedan estar bien",
        "Respondo y defiendo mi postura",
        "Me quedo en silencio y le doy vueltas más tarde, a solas",
        "Sinceramente, un buen debate me divierte bastante"
      ]
    },
    {
      "q": "¿Qué cumplido te alegraría el día?",
      "choices": [
        "«Siempre sabes lo que de verdad está pasando.»",
        "«Tienes un corazón enorme.»",
        "«Contigo no hay dobleces. Siempre te mantienes firme.»",
        "«No hay nadie como tú.»"
      ]
    },
    {
      "q": "Una norma que no tiene sentido para ti…",
      "choices": [
        "La esquivo en silencio, sin montar un escándalo",
        "Me molesta, pero odiaría decepcionar a alguien",
        "La cuestiono en voz alta o directamente la ignoro",
        "La sigo cumpliendo hasta que se pueda cambiar como es debido"
      ]
    },
    {
      "q": "Cuando alguien cercano tiene un problema, tú eres quien…",
      "choices": [
        "Interviene y hace algo al respecto",
        "Escucha y hace que se sienta menos solo",
        "Le ayuda a pensarlo con calma y a ver sus opciones",
        "Busca información y averigua quién podría ayudar"
      ]
    },
    {
      "q": "Un sábado libre sin ningún plan. Lo más probable es que…",
      "choices": [
        "Escribas a la gente y organices algo",
        "Te pierdas durante horas en un libro, un juego o una afición",
        "Te pongas al día con las tareas o ayudes a quien lo necesite",
        "Dejes que el día fluya y veas adónde te lleva"
      ]
    }
  ],
  "types": {
    "type1": {
      "name": "El Perfeccionista",
      "word": "perfeccionista",
      "vibe": "Ves cómo podrían ser mejores las cosas y, sin hacer ruido, te lo exiges a ti.",
      "desire": "Ser una buena persona, ser justo y hacer las cosas bien",
      "fear": "Equivocarte, ser descuidado o dejar pasar las cosas",
      "desc": "Llevas dentro un sentido muy claro del bien y del mal, y ves qué se podría mejorar casi en cualquier parte. Cumples tus promesas, asumes responsabilidades y la gente confía en ti porque dices lo que piensas de verdad. Esos mismos estándares altos pueden convertirse en una voz crítica interior muy ruidosa, y quizá te irrite que a otros no parezca importarles tanto. En tu mejor versión tienes principios, paciencia y sabiduría, y sabes que a veces lo suficientemente bueno es justo lo adecuado.",
      "keywords": ["Integridad", "Fiabilidad", "Rigor"],
      "strengths": ["Hacer las cosas bien, aunque nadie esté mirando", "Defender lo que es justo", "Convertir situaciones caóticas en planes claros y viables"],
      "tips": ["Fíjate en tu crítico interior y respóndele como lo haría alguien que te quiere.", "Elige una cosa por semana para dejarla sin terminar a propósito, y comprueba que el mundo no se derrumba.", "Haz sitio para el juego. Descansar y divertirte forma parte de vivir bien, no es un premio por terminarlo todo."],
      "growth": "Al crecer te sueltas un poco y encuentras más alegría, espontaneidad y ligereza."
    },
    "type2": {
      "name": "El Ayudador",
      "word": "ayudador",
      "vibe": "Notas lo que la gente necesita antes de que lo diga, y te encanta alegrarle el día.",
      "desire": "Sentirte querido y realmente necesario",
      "fear": "Que nadie te quiera ni te necesite",
      "desc": "Tienes calidez, generosidad y una gran sintonía con los demás. Te acuerdas de los cumpleaños, apareces cuando importa y, a tu lado, tus amistades se sienten vistas y cuidadas. Las relaciones están en el centro de tu vida. Como estás tan pendiente de los demás, puedes olvidar tus propias necesidades, costarte decir que no o dolerte que nadie note tus cuidados. En tu mejor versión das con libertad, sin llevar la cuenta, y dejas que los demás también cuiden de ti.",
      "keywords": ["Calidez", "Generosidad", "Cuidado"],
      "strengths": ["Hacer que la gente se sienta bienvenida y valorada", "Captar lo que alguien necesita justo ahora", "Construir amistades cercanas y duraderas"],
      "tips": ["Antes de decir que sí, pregúntate qué necesitas tú hoy.", "Deja que te ayuden, aunque sea con cosas pequeñas. Recibir también forma parte de una relación cercana.", "Di en voz alta lo que necesitas en lugar de esperar que alguien lo adivine."],
      "growth": "Al crecer diriges parte de ese cuidado hacia ti y eres más sincero con tus propios sentimientos y necesidades."
    },
    "type3": {
      "name": "El Triunfador",
      "word": "triunfador",
      "vibe": "Te pones una meta, encuentras el camino más rápido y arrastras a todos contigo.",
      "desire": "Sentirte valioso y tener éxito",
      "fear": "No valer nada o fracasar",
      "desc": "Tienes empuje, capacidad de adaptación y mucha energía. Sabes fijarte metas, leer el ambiente y conseguir resultados, y a menudo tu seguridad y tu ambición inspiran a los demás. Te gusta crecer, mejorar y hacer bien lo que haces. A veces, sin embargo, es fácil medirte solo por tus logros y seguir corriendo aunque estés agotado. En tu mejor versión eres auténtico además de exitoso, y sabes que vales mucho incluso en un día flojo.",
      "keywords": ["Ambición", "Adaptabilidad", "Inspiración"],
      "strengths": ["Convertir ideas en resultados reales", "Motivar a un equipo y mantener el ritmo", "Aprender rápido y adaptarte a cualquier entorno"],
      "tips": ["Pregúntate qué quieres tú, no solo qué va a quedar bien.", "Reserva tiempo de descanso de verdad y tómatelo tan en serio como una fecha de entrega.", "Comparte un fracaso o una duda con alguien de confianza. Mostrarte tal como eres acerca a la gente."],
      "growth": "Al crecer te comprometes más con personas y causas que van más allá de tu propio éxito."
    },
    "type4": {
      "name": "El Individualista",
      "word": "individualista",
      "vibe": "Sientes las cosas a fondo y quieres que tu vida tenga un sentido de verdad tuyo.",
      "desire": "Ser tú mismo y encontrar tu propio sentido",
      "fear": "No tener identidad o ser del montón",
      "desc": "Tienes sensibilidad, creatividad y una honestidad emocional que otras personas suelen evitar. Ves belleza y sentido en las cosas pequeñas, y prefieres ser auténtico antes que encajar. Tus amistades acuden a ti cuando la vida se complica, porque no te asustan los sentimientos reales. A veces sientes que te falta algo o que los demás lo tienen más fácil, y los cambios de humor pueden arrastrarte. En tu mejor versión conviertes tus emociones profundas en creatividad y compasión, y disfrutas de lo que ya es bueno en tu vida.",
      "keywords": ["Creatividad", "Autenticidad", "Profundidad"],
      "strengths": ["Expresar sentimientos con palabras, arte o estilo", "Acompañar a la gente en emociones difíciles", "Ver belleza y sentido donde otros no los ven"],
      "tips": ["Cuando te invada un estado de ánimo, ponle nombre y luego haz igualmente una pequeña cosa práctica.", "Lleva una lista de lo que ya es bueno en tu vida y añade cosas a menudo.", "Crea algo con regularidad, aunque nadie lo vea. Los hábitos constantes dan un hogar a tus sentimientos."],
      "growth": "Al crecer sumas estructura y disciplina, y conviertes tus emociones en un trabajo constante del que te sientes orgulloso."
    },
    "type5": {
      "name": "El Investigador",
      "word": "investigador",
      "vibe": "Quieres entender cómo funciona todo, a ser posible desde un rincón tranquilo.",
      "desire": "Entender el mundo y sentirte capaz",
      "fear": "Sentirte indefenso, desbordado o perdido",
      "desc": "Tienes curiosidad, capacidad de observación e independencia. Te encanta profundizar en un tema hasta entenderlo de verdad, y a menudo notas detalles y patrones que a otros se les escapan. Valoras tu tiempo, tu energía y tu intimidad, y necesitas espacio para pensar antes de actuar o compartir. A veces te quedas demasiado en tu cabeza, o te retiras cuando te piden más de lo que te sientes con ganas de dar. En tu mejor versión compartes tus conocimientos con generosidad y sales al mundo con seguridad.",
      "keywords": ["Curiosidad", "Perspicacia", "Independencia"],
      "strengths": ["Pensar con claridad cuando otros entran en pánico", "Aprender a fondo y explicar ideas complejas", "Mantener la calma y la objetividad"],
      "tips": ["Comparte lo que sabes antes de que te parezca terminado. Tus ideas a medio hacer ya suelen ser útiles.", "Prueba cosas con las manos y el cuerpo, no solo con la mente.", "Avisa cuando necesites tiempo a solas, para que nadie confunda tu silencio con distancia."],
      "growth": "Al crecer pasas de observar a actuar, con más seguridad y presencia."
    },
    "type6": {
      "name": "El Leal",
      "word": "leal",
      "vibe": "Eres esa amistad que se adelanta, tiene un plan y no se va cuando de verdad importa.",
      "desire": "Sentirte seguro, con apoyo y en confianza con la gente que te rodea",
      "fear": "Quedarte sin apoyo ni orientación",
      "desc": "Tienes lealtad, sentido de la responsabilidad y un ojo rápido para ver lo que podría salir mal, lo que te convierte en un gran planificador y en alguien de total confianza. Te tomas en serio tus compromisos y te importan mucho tu gente y tus comunidades. Como piensas en todos los escenarios posibles, tu mente puede llenarse de dudas, y quizá te cueste un tiempo confiar en los demás, o en ti. En tu mejor versión tienes valentía y firmeza, y confías en tu propio criterio tanto como en las personas que quieres.",
      "keywords": ["Lealtad", "Responsabilidad", "Previsión"],
      "strengths": ["Detectar problemas a tiempo y prepararte para ellos", "Estar al lado de tus amistades en lo bueno y en lo malo", "Unir a la gente en torno a un objetivo común"],
      "tips": ["Cuando la preocupación se dispare, escribe lo que está pasando ahora mismo, no lo que podría pasar.", "Toma cada día una pequeña decisión sin preguntar a nadie, y observa que sale bien.", "Recuerda tu historial. Ya has superado cosas difíciles antes."],
      "growth": "Al crecer te relajas, confías un poco más en la vida y encuentras un centro tranquilo y estable."
    },
    "type7": {
      "name": "El Entusiasta",
      "word": "entusiasta",
      "vibe": "La vida es una aventura y quieres probar todos los sabores del menú.",
      "desire": "Ser feliz, libre y vivir muchas experiencias buenas",
      "fear": "Quedar atrapado en el dolor, el aburrimiento o los límites",
      "desc": "Tienes optimismo, curiosidad y un montón de ideas. Le encuentras la gracia a casi todo, te recuperas rápido y tu energía anima a todos los que te rodean. Los lugares, planes y posibilidades nuevos te encienden. Como siempre hay algo emocionante a la vuelta de la esquina, te puede costar quedarte mucho tiempo con una sola cosa, o con los sentimientos difíciles. En tu mejor versión unes tu alegría con concentración y profundidad, y descubres que estar presente puede sentarte aún mejor que el siguiente plan.",
      "keywords": ["Optimismo", "Curiosidad", "Espontaneidad"],
      "strengths": ["Llevar energía y diversión a cualquier grupo", "Encontrar soluciones creativas en poco tiempo", "Recuperarte de los contratiempos"],
      "tips": ["Termina un plan antes de empezar el siguiente, y disfruta de esa sensación de cosa acabada.", "Cuando algo duela, permítete sentirlo un momento antes de buscar una distracción.", "Prueba de vez en cuando una hora lenta y tranquila. La calma también puede ser una aventura."],
      "growth": "Al crecer bajas el ritmo, te concentras a fondo y disfrutas de momentos tranquilos y reflexivos."
    },
    "type8": {
      "name": "El Desafiador",
      "word": "desafiador",
      "vibe": "Hablas claro, proteges a los tuyos y nunca te echas atrás ante un reto.",
      "desire": "Ser fuerte, llevar las riendas de tu vida y proteger a los demás",
      "fear": "Que te controlen, te hagan daño o quedarte sin poder",
      "desc": "Tienes seguridad, franqueza y muchísima energía. Tomas el mando cuando las cosas se complican, defiendes a quienes no pueden defenderse solos y los demás se sienten a salvo contigo de su lado. Valoras la honestidad y respetas la fuerza. A veces tu intensidad puede resultar excesiva, y quizá escondas tus sentimientos más tiernos para no parecer vulnerable. En tu mejor versión usas tu fuerza para levantar a los demás, y dejas que las personas de confianza vean tu gran corazón.",
      "keywords": ["Fuerza", "Protección", "Franqueza"],
      "strengths": ["Tomar decisiones y asumir el mando en una crisis", "Proteger a quienes reciben un trato injusto", "Hablar con sinceridad cuando otros se callan"],
      "tips": ["Antes de presionar, haz una pregunta más y escucha de verdad la respuesta.", "Muestra tu lado más tierno a alguien de confianza. Eso es fuerza, no debilidad.", "Date cuenta de cuándo vas a toda potencia y elige qué batallas importan de verdad."],
      "growth": "Al crecer abres el corazón y usas tu fuerza para cuidar de los demás con suavidad."
    },
    "type9": {
      "name": "El Pacificador",
      "word": "pacificador",
      "vibe": "Llevas calma allá donde vas y sabes ver todas las caras de una historia.",
      "desire": "Tener paz interior y armonía con los demás",
      "fear": "El conflicto, perder la conexión o quedarte aislado",
      "desc": "Tienes un carácter tranquilo, paciente y abierto. Ves muchos puntos de vista, calmas las situaciones tensas y la gente se siente relajada y aceptada a tu lado. A menudo eres el pegamento que mantiene unido a un grupo. Como quieres que todo siga en paz, puede que te dejes llevar por los demás, aplaces tus propias prioridades o evites decir lo que de verdad piensas. En tu mejor versión eres una presencia firme y atenta, y sabes que tu voz y tus deseos importan tanto como los de cualquiera.",
      "keywords": ["Calma", "Aceptación", "Apoyo"],
      "strengths": ["Calmar conflictos y ayudar a que la gente se entienda", "Escuchar sin juzgar", "Crear un ambiente relajado y acogedor"],
      "tips": ["Pregúntate qué quieres tú antes de preguntar qué quieren los demás.", "Elige cada mañana una tarea importante y hazla primero.", "Comparte tu opinión sincera, con amabilidad. Un poco de fricción puede fortalecer las relaciones."],
      "growth": "Al crecer despiertas a tus propias metas y actúas con energía y concentración."
    }
  }
};
