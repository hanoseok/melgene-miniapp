/* 집순이·집돌이 지수 테스트 — es
 * questions[i].choices[j] 는 homebody-core.js QUESTIONS[i].choices[j] 와 같은 순서(점수는 core 에만 있다). 키 구조는 en.js 와 동일.
 * Keys ending in Html are raw HTML (start.h1Html: <br> 1개 + <em> 만). 결과 단계 6종 id 는 homebody-core.js ORDER 와 같다.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep as-is when translating.
 * 스포일러 금지: meta / og.default* / start / faq / loading 에는 결과 이름·질문 문구를 인용하지 않는다.
 * fonts: css = Google Fonts, display = 제목/버튼 글꼴 스택, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap",
    "display": "'Comfortaa'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test de hogareño – ¿Cuánto de casero eres?",
    "description": "¿Eres hogareño o hogareña? Haz este test de hogareño gratis: 10 situaciones del día a día, 1 minuto aprox., sin registro. Descubre tu porcentaje de casero y cuánto amas tu sofá.",
    "ogTitle": "Test de hogareño 🏠 ¿Cuánto de casero eres?",
    "ogDescription": "Un test gratis de 1 minuto. Responde 10 situaciones cotidianas y obtén tu porcentaje de hogareño."
  },
  "siteName": "Test de hogareño",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "🏠 Índice de hogareño",
    "h1Kicker": "Test de hogareño",
    "h1Html": "¿Cuánto de<br><em>hogareño</em> eres?",
    "hook": "Diez situaciones pequeñas te dirán cuánto amas tu casa y cuánto tiene que esforzarse el mundo de afuera.",
    "metaTime": "⏱️ Aprox. 1 minuto",
    "metaCount": "🛋️ 10 preguntas",
    "start": "Ver mi nivel →"
  },
  "quiz": {
    "backAria": "Pregunta anterior",
    "progressAria": "Progreso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Contando tus puntos de comodidad…",
    "sub": "Revisando el sofá"
  },
  "result": {
    "title": "Test de hogareño: soy {name}",
    "eyebrow": "Tu perfil hogareño es",
    "strengthsLabel": "Tus superpoderes",
    "othersLabel": "Cómo te ven los demás",
    "bestLabel": "Mejor pareja",
    "clashLabel": "Perfil opuesto",
    "meterLabel": "Nivel de hogareño",
    "moreShare": "El {pct} % de los jugadores es más hogareño que tú",
    "shareText": "Soy {name} {emoji} — «{vibe}» ¿Y tú, cuánto de hogareño eres?",
    "shareTextPct": "Soy {pct} % hogareño: {name} {emoji}. ¿Y tú?",
    "ctaStrong": "Un amigo compartió su resultado",
    "ctaSub": "¿Cuánto de hogareño eres? Solo 1 minuto.",
    "retry": "Repetir el test"
  },
  "og": {
    "eyebrow": "Mi nivel de hogareño",
    "brand": "🏠 Test de hogareño",
    "defaultKicker": "Test de hogareño",
    "defaultTitle": "¿Cuánto de hogareño eres?",
    "defaultDesc": "10 situaciones cotidianas · aprox. 1 minuto"
  },
  "faq": [
    {
      "q": "¿Cómo se calcula mi porcentaje de hogareño?",
      "a": "Cada respuesta vale de 0 a 10 puntos hacia el lado de la casa. Se suman los puntos de tus diez respuestas y se pasan a una escala de 0 a 100: cuanto más alto el porcentaje, más te inclinas por quedarte en casa."
    },
    {
      "q": "¿Hogareño es lo mismo que introvertido?",
      "a": "No exactamente. La introversión trata de dónde sacas energía; ser hogareño trata de dónde te gusta pasar el tiempo. Muchos extrovertidos adoran su sofá y muchos introvertidos adoran las caminatas largas."
    },
    {
      "q": "¿Es un test científico?",
      "a": "No. Es un cuestionario ligero para divertirse y charlar, no una evaluación psicológica. El resultado solo refleja tus respuestas de hoy."
    },
    {
      "q": "¿Cómo se calcula «más hogareño que el X % de los jugadores»?",
      "a": "Contamos de forma anónima en qué rango de puntos cae cada test terminado. Cuando hay al menos 20 resultados, comparamos el tuyo con ellos. La línea aparece solo en tu propio resultado y sigue oculta mientras haya pocos jugadores."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Test de hogareño",
    "description": "Política de privacidad del Test de hogareño: cookies, publicidad y estadísticas anónimas.",
    "h1": "Política de privacidad",
    "introHtml": "El Test de hogareño (el «Servicio») respeta tu privacidad y solo trata la información mínima necesaria, como se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan en tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos de forma anónima qué rango de puntos salió, para mostrar lo común que es cada resultado."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían no funcionar bien."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y ajustes en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Guardamos totales diarios anónimos (páginas vistas, tests terminados, valoraciones) para mejorar el Servicio. No permiten identificarte."
      ],
      [
        "5. Contacto",
        "Si tienes preguntas sobre esta política, contacta con el responsable del sitio."
      ],
      [
        "6. Fecha de vigencia",
        "Esta política está vigente desde el 21 de octubre de 2026."
      ]
    ],
    "back": "← Volver al test de hogareño"
  },
  "questions": [
    {
      "q": "Viernes por la noche, el grupo de chat se enciende: «¿Unas copas en el centro?»",
      "choices": [
        "Responder «otro día» e irme a casa feliz",
        "Ir una hora y escabullirme",
        "Contraproponer: en casa de alguien con comida para llevar",
        "Ir y quedarme hasta el cierre"
      ]
    },
    {
      "q": "Un fin de semana largo sin nada planeado. ¿Tu plan ideal?",
      "choices": [
        "Hacer la maleta y salir de viaje improvisado",
        "No salir de casa a propósito",
        "Una excursión de un día y volver a mi cama",
        "Un café o un parque cerca y de vuelta a casa"
      ]
    },
    {
      "q": "Suena el timbre y no esperabas a nadie. Tú…",
      "choices": [
        "Abres, algo sorprendido",
        "Miras primero por la mirilla",
        "Me encanta: las visitas sorpresa son lo mejor",
        "Te quedas quieto hasta que se vayan"
      ]
    },
    {
      "q": "¿Dónde te gustaría más vivir?",
      "choices": [
        "En una casa tranquila con mi propio rincón",
        "En pleno centro de una ciudad animada",
        "En un nido donde todo está al alcance de la mano",
        "En un piso con un buen balcón cerca del ambiente"
      ]
    },
    {
      "q": "Es un domingo lluvioso. ¿Qué piensas primero?",
      "choices": [
        "El mejor clima: manta, té, ventana",
        "Uf, adiós a todos mis planes",
        "Por fin una excusa perfecta para quedarme",
        "Bueno, buscaré un plan en un lugar cubierto"
      ]
    },
    {
      "q": "Un amigo te invita a un evento dentro de dos semanas.",
      "choices": [
        "Primero miro mi agenda",
        "Ya empiezo a pensar cómo cancelar con elegancia",
        "¡Me apunto!",
        "Digo que sí y lo temo cuanto más se acerca"
      ]
    },
    {
      "q": "Llegas a casa tras un día entero fuera. Te sientes…",
      "choices": [
        "Con energía todavía, listo para más",
        "Cansado de forma agradable",
        "Por fin: puerta cerrada, móvil en silencio",
        "Aliviado, como una batería que se carga"
      ]
    },
    {
      "q": "Es hora de cenar. ¿Dónde quieres estar?",
      "choices": [
        "Cocinando en casa",
        "Fuera, pero en un sitio pequeño y tranquilo",
        "En un restaurante animado lleno de gente",
        "En el sofá con comida a domicilio y una serie"
      ]
    },
    {
      "q": "¿Cuántos días seguidos puedes quedarte en casa sin volverte loco?",
      "choices": [
        "Con uno me basta",
        "Semanas, y ni lo notaría",
        "Unos tres días",
        "Una semana, sin problema"
      ]
    },
    {
      "q": "Tienes algo de dinero extra. ¿En qué lo gastas?",
      "choices": [
        "Una noche con amigos",
        "Entradas y viajes",
        "Gadgets, juegos o streaming para el sofá",
        "Más comodidad: un buen sillón, lámpara, ropa de cama"
      ]
    }
  ],
  "types": {
    "wild": {
      "name": "Nacido para la calle",
      "vibe": "Tu casa es donde sueltas la mochila antes de volver a salir.",
      "desc": "Tratas tu puerta como una puerta giratoria. Un día entero en casa te parece un día perdido, y tus mejores ideas llegan en un sendero, un tren o una terraza. Te recargas con gente y aire libre, y coleccionas planes como otros coleccionan tazas. Tu casa es sobre todo un lugar para dormir, ducharte y cambiarte de zapatos.",
      "strengths": [
        "Energía infinita",
        "Dice sí a la aventura",
        "Nunca se aburre"
      ],
      "others": "Los demás te ven como quien siempre tiene planes y logra sacar a todos del sofá."
    },
    "roamer": {
      "name": "Trotamundos de fin de semana",
      "vibe": "Más fuera que dentro, pero amas una buena siesta.",
      "desc": "Te encanta salir, sobre todo con amigos, pero también conoces la alegría de una noche que termina temprano. Tu semana está llena de planes y una noche tranquila en casa es un premio, no una costumbre. Disfrutas la variedad: un café nuevo, una escapada corta, una calle que aún no has recorrido.",
      "strengths": [
        "Sociable y curioso",
        "Planes flexibles",
        "Bueno para empezar cosas"
      ],
      "others": "Los demás te ven como simpático y animado, siempre listo para un café, aunque a veces desapareces para recargar."
    },
    "switch": {
      "name": "Equilibrista de planes",
      "vibe": "Mitad sofá, mitad ciudad, siempre adaptable.",
      "desc": "Disfrutas una noche de fiesta y una noche tranquila en casa con la misma sonrisa. Ninguna es un sacrificio: lees tu energía del día y la sigues. Eso te hace buena compañía tanto para amigos salidores como para hogareños. Tu único reto es decidir a qué lado hacer caso un viernes.",
      "strengths": [
        "Encaja en cualquier plan",
        "Lee su propia energía",
        "Buena compañía"
      ],
      "others": "Los demás te ven como relajado y difícil de encasillar, el amigo que encaja en cualquier plan."
    },
    "nester": {
      "name": "Nido acogedor",
      "vibe": "Feliz con una manta, una lámpara y el plan de quedarte.",
      "desc": "En casa eres más tú. La has hecho cómoda a propósito: la luz justa, el sillón justo, los snacks justos. Sales por la gente que importa, pero acortas las noches y dejas la salida cerca. Tu evento ideal tiene hora de inicio, hora de fin y un sofá cerca.",
      "strengths": [
        "Hace acogedor cualquier espacio",
        "Gasta su energía con cabeza",
        "Gran anfitrión en casa"
      ],
      "others": "Los demás te ven como cálido y tranquilo, el amigo en cuya casa todos quieren estar."
    },
    "homebody": {
      "name": "Hogareño certificado",
      "vibe": "Tus mejores planes son los que cancelas.",
      "desc": "De verdad amas estar en casa y ya no te disculpas por ello. Tu espacio es tu estación de recarga, tu cuarto de aficiones y tu refugio a la vez. Las invitaciones reciben una pausa educada antes de la respuesta, y un fin de semana sin nada en la agenda es un regalo. No eres antisocial: eliges tus salidas con cuidado.",
      "strengths": [
        "Feliz a solas",
        "Mundo interior rico",
        "Protege tu paz"
      ],
      "others": "Los demás te ven como tranquilo, algo misterioso y sorprendentemente gracioso cuando estás en tu elemento."
    },
    "legend": {
      "name": "Leyenda del hogar",
      "vibe": "La puerta es una sugerencia. El sofá es un reino.",
      "desc": "Has convertido quedarte en casa en un arte. Las apps de comida te conocen por tu nombre, tu rincón está optimizado y tu batería social se carga con silencio. Puedes pasar días sin acordarte del mundo exterior y estar perfectamente bien. Cuando sales, es por algo que de verdad merece la pena, y planeas el regreso antes de irte.",
      "strengths": [
        "Maestro de la comodidad",
        "Totalmente autosuficiente",
        "Cero FOMO"
      ],
      "others": "Los demás te ven como una leyenda: rara vez visto, siempre en paz y la persona a quien pedir una buena serie."
    }
  }
};
