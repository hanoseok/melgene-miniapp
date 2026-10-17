/* Spending Personality Test (es)
 * 8 result ids (saver value flex impulse saverflex dealhunter quality balance); questions[i].choices[j] follow spend-core.js QUESTIONS[i].v[j] (the habit axis of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the user's own style mix and the real server share.
 * Placeholders: {name} {emoji} {vibe} {pct} {s} {v} {f} {i}. Entertainment only, not financial advice.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test de personalidad financiera: ¿ahorrador o gastador?",
    "description": "Test de personalidad financiera: ¿ahorrador o gastador? 12 situaciones cotidianas, 2 minutos, sin registro. Solo diversión, no es asesoramiento.",
    "ogTitle": "Test de personalidad financiera 💸 ¿Cuál es tu estilo con el dinero?",
    "ogDescription": "12 momentos cotidianos con el dinero, 2 minutos. ¿Ahorrador, gastador o impulsivo?"
  },
  "siteName": "Test de personalidad financiera",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "💸 Solo por diversión",
    "h1Kicker": "Test de personalidad financiera",
    "h1Html": "¿Qué tipo de <em>gastador</em><br>eres?",
    "hook": "Día de cobro, ofertas, cenas con amigos y suscripciones olvidadas. Responde con sinceridad a 12 momentos cotidianos con el dinero y conoce tu propio estilo de gasto.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🛍️ 12 momentos",
    "start": "Descubrir mi estilo →"
  },
  "quiz": {
    "backAria": "Pregunta anterior",
    "progressAria": "Progreso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Contando tus monedas…",
    "sub": "Leyendo tus tickets, solo por diversión"
  },
  "result": {
    "title": "Mi estilo de gasto: {name}",
    "metaDesc": "Resultado del test de personalidad financiera: {name}. {vibe}",
    "eyebrow": "Tu estilo de gasto es",
    "gaugeLabel": "Tus propias respuestas, por estilo",
    "axes": [
      "Ahorrador",
      "Cazador de gangas",
      "Derrochador",
      "Impulsivo"
    ],
    "strengthsLabel": "Tus puntos fuertes con el dinero",
    "weaknessLabel": "Ojo con",
    "tipLabel": "Idea divertida",
    "disclaimer": "Solo con fines de entretenimiento. No es asesoramiento financiero.",
    "sameShare": "El {pct} % de la gente obtuvo este estilo",
    "shareText": "Mi estilo de gasto: {name} {emoji} “{vibe}” ¿Y el tuyo?",
    "shareTextPct": "Mi estilo de gasto: {name} {emoji} (Ahorrador {s} % · Gangas {v} % · Derroche {f} % · Impulsivo {i} %) ¿Y el tuyo?",
    "ctaStrong": "Un amigo ha compartido su estilo con el dinero",
    "ctaSub": "¿Ahorrador o gastador? Descúbrelo en 2 minutos.",
    "retry": "Repetir el test"
  },
  "og": {
    "eyebrow": "Mi estilo de gasto",
    "brand": "💸 Test de personalidad financiera",
    "defaultKicker": "Test de personalidad financiera",
    "defaultTitle": "¿Qué tipo de gastador eres?",
    "defaultDesc": "12 momentos cotidianos con el dinero · 2 minutos"
  },
  "faq": [
    {
      "q": "¿Cómo se decide mi estilo de gasto?",
      "a": "Cada respuesta se inclina hacia uno de cuatro hábitos con el dinero: ahorrar, buscar el mejor precio, darse un capricho o comprar por impulso. Tu resultado depende de los hábitos que más elegiste y de lo cerca que estuvieron entre sí. Las mismas respuestas siempre dan el mismo resultado."
    },
    {
      "q": "¿Es asesoramiento financiero?",
      "a": "No. Es un test de personalidad ligero hecho para divertirse. No dice nada de tus finanzas reales y nunca debe usarse para tomar decisiones de dinero. Para dudas financieras de verdad, consulta con un profesional cualificado."
    },
    {
      "q": "¿Hay un estilo de gasto bueno o malo?",
      "a": "No. Todos los estilos tienen puntos fuertes y puntos ciegos, y la mayoría de la gente mezcla varios. Tus respuestas también cambian según tu humor, tu presupuesto y tu etapa de vida, así que vuelve a probar otro día."
    },
    {
      "q": "¿Se guardan mis respuestas?",
      "a": "No. Tus respuestas se calculan en tu navegador y nunca se almacenan. Solo contamos, de forma anónima, qué estilo salió, para poder mostrar lo habitual que es cada uno."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Test de personalidad financiera",
    "description": "Política de privacidad del Test de personalidad financiera: cómo usamos las cookies, la publicidad y las estadísticas anónimas.",
    "h1": "Política de privacidad",
    "introHtml": "El Test de personalidad financiera (el \"Servicio\") respeta tu privacidad y solo trata la información mínima necesaria, tal como se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas y tu mezcla de estilos se calculan dentro de tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos, de forma anónima, qué resultado salió, para poder mostrar lo habitual que es cada resultado."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o eliminarlas en la configuración de tu navegador; si lo haces, es posible que algunas funciones no se comporten como deberían."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y a otros sitios web. Puedes obtener más información y cambiar tus preferencias de personalización de anuncios en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Guardamos totales diarios anónimos (páginas vistas, tests completados, valoraciones) para mejorar el Servicio. Estos totales no te identifican personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes cualquier pregunta sobre esta Política de privacidad, ponte en contacto con quien gestiona el sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está en vigor desde el 18 de octubre de 2026."
      ]
    ],
    "back": "← Volver al Test de personalidad financiera"
  },
  "questions": [
    {
      "q": "Te llega la nómina. ¿Qué es lo primero que haces?",
      "choices": [
        "Reservar algo bonito que llevo tiempo mirando",
        "Mover enseguida una buena parte a la cuenta de ahorro",
        "Abrir una app de compras: “me lo merezco”",
        "Revisar qué facturas y suscripciones vencen y planificar el resto"
      ]
    },
    {
      "q": "Un amigo te invita a un restaurante de moda y caro.",
      "choices": [
        "Proponer un sitio más barato o cocinar en casa",
        "¡Genial! Pido justo lo que me apetece",
        "Mirar reseñas y menús del día para encontrar la mejor opción",
        "Reservar ahora mismo y ya pensaré en la cuenta después"
      ]
    },
    {
      "q": "Tus auriculares por fin se rompen y necesitas unos nuevos.",
      "choices": [
        "Comparar reseñas y comparadores de precio durante semanas",
        "Comprar los primeros que me salga en un anuncio. Listo en un minuto",
        "Aguantar lo máximo posible y luego comprar los más baratos que cumplan",
        "Comprar el modelo top, que se siente genial y dura mucho"
      ]
    },
    {
      "q": "Tu tienda favorita tiene unas rebajas enormes.",
      "choices": [
        "Lleno el carrito antes de pensar",
        "Compro solo lo que ya estaba en mi lista",
        "Me llevo esa prenda premium que por fin me sale a cuenta",
        "Paso de largo. Barato solo es barato si lo necesitaba"
      ]
    },
    {
      "q": "Una prueba gratuita está a punto de convertirse en suscripción de pago.",
      "choices": [
        "La cancelé el mismo día que me apunté",
        "Me la quedo. Los buenos servicios valen lo que cuestan",
        "Pongo un recordatorio y decido si merece la pena",
        "Se me olvidó, y ahora pago varias a la vez"
      ]
    },
    {
      "q": "Pausa para el café en el trabajo.",
      "choices": [
        "La especialidad de mi cafetería favorita, sin remordimientos",
        "Café de casa, en mi propio termo",
        "Un café, un bollo y esa taza tan mona junto a la caja",
        "La cafetería con los mejores cupones y tarjeta de sellos"
      ]
    },
    {
      "q": "Llega la cuenta de la cena con amigos.",
      "choices": [
        "Pago por todos por un impulso y luego me pregunto adónde se fue el dinero",
        "Uso una app para dividir la cuenta y que sea rápido y justo",
        "Invito a una ronda y además pedimos postre",
        "Pago exactamente lo que me comí, hasta el último céntimo"
      ]
    },
    {
      "q": "En la caja te ofrecen un pequeño extra.",
      "choices": [
        "Solo si el pack sale realmente mejor de precio",
        "Sí, y también las chuches de al lado",
        "“No, gracias.” Ni lo pienso",
        "Claro. Los pequeños lujos hacen el día más agradable"
      ]
    },
    {
      "q": "Estás planeando unas vacaciones.",
      "choices": [
        "Una hoja de cálculo y comparadores para conseguir la mejor relación calidad-precio",
        "Reservo un vuelo esta noche porque la tarifa tenía buena pinta",
        "Fechas de temporada baja, alojamiento barato, actividades gratis",
        "Un hotel realmente bonito. El viaje es mi recompensa"
      ]
    },
    {
      "q": "Abres la app del banco a final de mes.",
      "choices": [
        "Espera, ¿adónde se fue todo esto?",
        "Lo clasifico todo por categorías y ajusto el mes que viene",
        "Sé adónde fue y mereció la pena",
        "El saldo está bien y me siento orgulloso en silencio"
      ]
    },
    {
      "q": "Empiezas un hobby nuevo.",
      "choices": [
        "Ir directo a equipo profesional. Si lo hago, lo hago bien",
        "Pedir prestado el equipo y aprender con vídeos gratis",
        "Equipo, libros, clases y un conjunto monísimo, todo en la primera semana",
        "Comprar el kit de principiante mejor valorado"
      ]
    },
    {
      "q": "¿Qué frase te suena más a ti?",
      "choices": [
        "“Cada poquito que ahorro cuenta”",
        "“Solo se vive una vez”",
        "“¿Por qué pagar más por lo mismo?”",
        "“En ese momento me pareció lo correcto”"
      ]
    }
  ],
  "types": {
    "saver": {
      "name": "Profesional del Ahorro",
      "word": "ahorro",
      "vibe": "Cada moneda tiene su trabajo, y las tuyas siempre llegan puntuales.",
      "desc": "Te gusta saber dónde está tu dinero y para qué sirve. Te llevas la comida de casa sin quejarte, notas las pequeñas fugas y sientes un cosquilleo tranquilo cuando sube la cifra de tu cuenta. Tus amigos te llaman cuando quieren saber si algo de verdad merece la pena, y tú les das una respuesta sincera. Tus hábitos serenos y constantes hacen que el futuro dé menos miedo.",
      "strengths": [
        "Paciente y disciplinado",
        "Detecta el derroche enseguida",
        "Tranquilo ante el futuro"
      ],
      "weakness": "A veces le dices que no a cosas que te habrían hecho muy feliz, y luego te sientes un poco fuera de juego.",
      "tip": "Elige cada mes un pequeño capricho que sea tuyo, sin una pizca de culpa. Disfrutarlo también forma parte del plan."
    },
    "value": {
      "name": "Detective de Gangas",
      "word": "gangas",
      "vibe": "Primero investigar, luego comprar.",
      "desc": "Investigas antes de comprar: reseñas, historial de precios, la otra pestaña, la otra tienda. Encontrar la mejor oferta te parece resolver un pequeño misterio, y te encanta compartir la solución. No eres rácano, solo alérgico a pagar de más. La gente confía en tus recomendaciones porque ya has hecho los deberes.",
      "strengths": [
        "Gran investigador",
        "Compara con calma",
        "Comparte hallazgos útiles"
      ],
      "weakness": "Comparar puede llevar más tiempo del que la cosa merece, y a veces se te escapa el momento.",
      "tip": "Ponle un límite de tiempo a la investigación. La mejor oferta también es la que de verdad disfrutas usando."
    },
    "flex": {
      "name": "Protagonista de Tu Propia Película",
      "word": "protagonista",
      "vibe": "Trata el día a día como si fuera un estreno.",
      "desc": "Crees que los buenos momentos merecen cosas buenas: la cena especial, la entrada del concierto, el regalo que deja a alguien boquiabierto. Gastas con intención y sin demasiada culpa, y tu generosidad se contagia. A tus amigos les encanta tu compañía porque conviertes las tardes normales en ocasiones. Vives el presente y lo haces brillar.",
      "strengths": [
        "Generoso y divertido",
        "Crea momentos memorables",
        "Sabe lo que le gusta"
      ],
      "weakness": "Los grandes momentos pueden dejar sin sitio a los pequeños y tranquilos que importarán más adelante.",
      "tip": "Apunta también en el calendario un capricho para tu yo del futuro. Hace el derroche aún más dulce."
    },
    "impulse": {
      "name": "Rey del Carrito Lleno",
      "word": "carrito",
      "vibe": "El carrito se llena más rápido de lo que llega el pensamiento.",
      "desc": "Sigues tu chispa. Una cosita mona, un buen día o la emoción de un amigo, y de repente ya viene de camino a tu puerta. Esa espontaneidad es parte de tu encanto: pruebas cosas nuevas, dices que sí a las aventuras y tu vida rara vez es aburrida. Tus estantes están llenos de historias, incluso de las que empezaron con “es que tenía que tenerlo”.",
      "strengths": [
        "Espontáneo y curioso",
        "Dice que sí a la aventura",
        "Reparte buena energía"
      ],
      "weakness": "Algunas compras pierden la gracia enseguida, y el extracto de fin de mes te sorprende.",
      "tip": "Prueba un carrito de “quizá” durante una noche. Si mañana sigues sonriendo, es un sí de verdad."
    },
    "saverflex": {
      "name": "Hormiga con Capricho",
      "word": "hormiga",
      "vibe": "Prudente durante meses, y luego un sí glorioso.",
      "desc": "La mayoría de los días eres el prudente: los cupones, el táper, el “ahora no”. Pero ahorras con un propósito, y cuando llega el día gastas en lo que de verdad querías, sin pedir perdón. Es una combinación sorprendente: ahorrador y dramático a la vez. La gente se queda asombrada de lo grande que puede ser tu único sí.",
      "strengths": [
        "Ahorra con un objetivo",
        "Disfruta sus compras al máximo",
        "Sabe lo que importa"
      ],
      "weakness": "La larga espera puede hacer que el capricho parezca demasiado grande, y la culpa puede colarse después.",
      "tip": "Ponle nombre y fecha a tu gran capricho. Esperarlo es la mitad de la diversión."
    },
    "dealhunter": {
      "name": "Cazador de Rebajas",
      "word": "rebajas",
      "vibe": "Cuesta mucho dejar pasar una buena oferta.",
      "desc": "Los descuentos te iluminan. Te encantan las ofertas por tiempo limitado, los packs y los códigos de descuento que de verdad funcionan, y saltas rápido cuando el precio te cuadra. Mitad detective, mitad aventurero, disfrutas de verdad con la caza en sí. Tus amigos te escriben cuando quieren saber si una oferta merece el bombo.",
      "strengths": [
        "Ojo de lince para las ofertas",
        "Rápido y decidido",
        "Da gusto ir de compras contigo"
      ],
      "weakness": "Un gran precio puede hacerte olvidar preguntarte si lo necesitabas.",
      "tip": "Antes de hacer clic, pregúntate: “¿Lo querría a precio completo?” Si la respuesta es sí, es un triunfo de verdad."
    },
    "quality": {
      "name": "Comprador de Una Vez para Siempre",
      "word": "una vez",
      "vibe": "Gasta un poco más una vez y disfrútalo durante años.",
      "desc": "Eliges con cuidado y eliges bien. Prefieres tener una chaqueta estupenda a cinco del montón, y te importa cómo se sienten las cosas, cuánto duran y cómo encajan en tu vida. Investigas lo justo para estar seguro y luego te comprometes sin remordimientos. Tus cosas suelen verse bien y seguir así, y te sientes con razón orgulloso.",
      "strengths": [
        "Reflexivo y exigente",
        "Valora la calidad y la durabilidad",
        "Rara vez se arrepiente de una compra"
      ],
      "weakness": "Cuesta encontrar la “mejor” opción, y esperar por ella puede frenarte.",
      "tip": "A veces lo suficientemente bueno es genial. Permítete disfrutar de lo bonito ya."
    },
    "balance": {
      "name": "Presupuesto Equilibrado",
      "word": "equilibrado",
      "vibe": "Ni muy tacaño ni muy loco. Justo en su punto.",
      "desc": "Mezclas un poco de todo. Sabes ahorrar cuando importa, comprar con cabeza cuando ayuda, darte un capricho cuando toca y disfrutar de alguna compra espontánea de vez en cuando. Eso te hace fácil para ir de compras, viajar y dividir una cuenta. La gente se siente tranquila con tus hábitos con el dinero, porque son flexibles y amables.",
      "strengths": [
        "Flexible y tranquilo",
        "Se adapta a cualquier situación",
        "Da gusto dividir la cuenta contigo"
      ],
      "weakness": "Sin una regla firme, las pequeñas decisiones pueden ir a la deriva sin que te des cuenta.",
      "tip": "Elige un hábito minúsculo que te guste y que sea tu ancla. Lo demás puede seguir siendo flexible."
    }
  }
};
