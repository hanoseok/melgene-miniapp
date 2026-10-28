/* Test de la suerte de Año Nuevo (es) — misma estructura que en.js.
 * El año sale de newyear-core.js (YEAR); nunca se escribe a mano. El orden de questions[i].choices[j] es el de en.js (puntuación).
 * Sin spoilers en meta / start / faq / loading / og.default*. Sin cifras ni % en los resultados. Solo para divertirse.
 */
const Y = require('../../newyear-core.js').YEAR;

module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap",
    "display": "'Lora'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": `Test de la suerte ${Y} – tu palabra del año`,
    "description": `Haz el test de la suerte ${Y}: 11 preguntas rápidas, unos 2 minutos y sin registro. Descubre tu palabra del año, tu color, tu mes y tu objeto de la suerte. Solo por diversión.`,
    "ogTitle": `Test de la suerte ${Y} 🌅 ¿Cuál será tu palabra del año?`,
    "ogDescription": `Once preguntas ligeras sobre cómo te gustaría vivir ${Y}. Descubre tu palabra del año, tu color, tu mes y tu objeto de la suerte.`
  },
  "siteName": `Test de la suerte ${Y}`,
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": `🌅 Hola, ${Y}`,
    "h1Kicker": `Test de la suerte ${Y}`,
    "h1Html": `¿Qué te traerá<br><em>${Y}</em>?`,
    "hook": "Calendario nuevo, primer amanecer y un año entero de páginas en blanco. Responde once preguntas ligeras sobre tu forma de vivir y descubre la palabra, los amuletos y las pequeñas fortunas que te esperan en el año nuevo.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 preguntas",
    "start": "Descubre mi año →"
  },
  "quiz": {
    "backAria": "Pregunta anterior",
    "progressAria": "Progreso",
    "qLabel": "Pregunta {n}"
  },
  "loading": {
    "text": "Esperando el primer amanecer…",
    "sub": "Escribiendo tu fortuna para el año nuevo"
  },
  "result": {
    "title": `Mi palabra de ${Y}: {name}`,
    "metaDesc": `Resultado del test de la suerte ${Y}: {name}. {vibe} Mira tu color, tu mes y tu objeto de la suerte, y una fortuna ligera para el año.`,
    "eyebrow": `Tu palabra para ${Y}`,
    "colorLabel": "Color de la suerte",
    "monthLabel": "Mes de la suerte",
    "itemLabel": "Objeto de la suerte",
    "gaugeLabel": "Hacia dónde se inclinaron tus respuestas",
    "axes": [
      ["Novedades", "Constancia"],
      ["En compañía", "Tiempo para mí"],
      ["Planificar", "Dejarse llevar"]
    ],
    "fortuneLabel": "Tu año de un vistazo",
    "areas": {
      "work": "Trabajo y estudios",
      "money": "Ánimo con el dinero",
      "love": "Amor y amistades",
      "self": "Cuidarte"
    },
    "tipLabel": "Un pequeño propósito para probar",
    "buddyLabel": "Combina genial",
    "rivalLabel": "Polo opuesto",
    "disclaimer": "Solo por diversión. Tu palabra, tus amuletos y tus fortunas son ideas lúdicas para el año nuevo, no predicciones ni consejos de salud, de dinero o de vida.",
    "sameShare": "Al {pct}% de la gente le salió esta palabra",
    "shareText": `Mi palabra de ${Y} es {name} {emoji} «{vibe}» ¿Y la tuya?`,
    "ctaStrong": "Alguien te compartió su fortuna de Año Nuevo",
    "ctaSub": `¿Qué te traerá ${Y}? Descúbrelo en 2 minutos.`,
    "retry": "Repetir el test"
  },
  "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  "og": {
    "eyebrow": `Mi palabra para ${Y}`,
    "brand": `🌅 Test de la suerte ${Y}`,
    "defaultKicker": "Un test ligero de Año Nuevo",
    "defaultTitle": `¿Qué te traerá ${Y}?`,
    "defaultDesc": "11 preguntas · 2 minutos · amuletos de la suerte"
  },
  "faq": [
    {
      "q": "¿Cómo se elige mi palabra?",
      "a": "Cada respuesta mueve un poco tres escalas: probar cosas nuevas o mantener tu ritmo, estar con gente o tener tiempo para ti, y planificar o dejarte llevar. Tu palabra está donde se cruzan las tres, y las mismas respuestas siempre dan el mismo resultado."
    },
    {
      "q": "¿Es una predicción real de mi año?",
      "a": "No. La palabra, el color, el mes, el objeto de la suerte y las pequeñas fortunas son ideas para jugar, no predicciones. Nadie puede saber cómo irá un año. Usa tu resultado como una forma divertida de pensar en lo que te gustaría hacer."
    },
    {
      "q": "¿Puedo repetirlo y que me salga otra cosa?",
      "a": "Sí. Si respondes de otra manera, puedes llegar a otra palabra. Mucha gente lo repite más adelante, cuando cambian su ánimo o sus planes."
    },
    {
      "q": "¿Se guardan mis respuestas?",
      "a": "No. Tus respuestas se calculan en tu navegador y no se almacenan. Solo contamos de forma anónima qué palabra salió, para mostrar lo común que es."
    }
  ],
  "privacy": {
    "title": `Política de privacidad | Test de la suerte ${Y}`,
    "description": `Política de privacidad del test de la suerte ${Y}: cómo usamos las cookies, la publicidad y las estadísticas anónimas.`,
    "h1": "Política de privacidad",
    "introHtml": "El test de la suerte de Año Nuevo (el \"Servicio\") respeta tu privacidad y solo trata la información mínima necesaria, como se explica a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas se calculan en tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos de forma anónima qué resultado salió, para mostrar lo común que es cada uno."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en la configuración de tu navegador; en ese caso, algunas funciones podrían no funcionar bien."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar tus preferencias de personalización en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Guardamos totales diarios anónimos (visitas, tests completados, valoraciones) para mejorar el Servicio. Estos totales no te identifican personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está vigente desde el 29 de octubre de 2026."
      ]
    ],
    "back": "← Volver al test de la suerte"
  },
  "questions": [
    {
      "q": "Faltan diez minutos para las campanadas de Nochevieja. ¿Dónde estás?",
      "choices": [
        "En el sofá con tu gente favorita, picoteo en la mesa y cero planes",
        "En la fiesta de cuenta atrás que organizaste para tus amigos hace semanas",
        "En casa, a solas, escribiendo tus propósitos en una libreta nueva",
        "En un lugar nuevo, de viaje improvisado en solitario, viendo celebrar a desconocidos"
      ]
    },
    {
      "q": "Te regalan una agenda nueva para el año. ¿Qué escribes en la primera página?",
      "choices": [
        "Una lista de planes divertidos para hacer con amigos. Las fechas, ya se verá",
        "Nada todavía. Ya escribirás cuando te apetezca",
        "Los cumpleaños de todos y las reuniones familiares, lo primero",
        "Un gran objetivo personal, dividido mes a mes"
      ]
    },
    {
      "q": "El primer amanecer del año. ¿Cómo lo recibes?",
      "choices": [
        "Con alarma puesta y algo calentito en la mano, mirando tranquilamente por la ventana",
        "En un tren de madrugada, sin pensarlo, rumbo a un sitio que no conoces",
        "Guiando a un grupo hasta lo alto de un cerro, con ruta y provisiones planeadas",
        "Todavía despierto con tus amigos después de la fiesta, y lo ves de casualidad"
      ]
    },
    {
      "q": "Lo más probable es que tu propósito de Año Nuevo sea…",
      "choices": [
        "Aprender algo nuevo, con horario y seguimiento de tus avances",
        "Llamar o visitar a tus seres queridos con cierta regularidad",
        "Decir que sí a más invitaciones y ver adónde te llevan",
        "Nada de grandes propósitos. Solo tratarte un poco mejor"
      ]
    },
    {
      "q": "Surge un proyecto nuevo en el trabajo o en clase. Tú…",
      "choices": [
        "Te quedas con la parte que nadie ha probado y la resuelves sobre la marcha",
        "Te unes a un equipo que te cae bien y ayudas donde haga falta",
        "Eliges la parte que dominas y la haces con cuidado por tu cuenta",
        "Te ofreces a coordinarlo y armas un plan con todo el grupo"
      ]
    },
    {
      "q": "Te llega un dinerito inesperado, como un regalo o un pequeño extra.",
      "choices": [
        "Lo destinas a una reunión ya planeada o a regalos para tu familia",
        "Invitas a tus amigos a algo divertido, ahí mismo",
        "Lo guardas y te olvidas de él hasta que lo necesites",
        "Lo usas en un curso o en material para algo nuevo que tenías pensado"
      ]
    },
    {
      "q": "Un fin de semana libre, sin nada en la agenda. ¿Qué pasa?",
      "choices": [
        "Organizas una excursión de un día para el grupo a un lugar que nadie conoce",
        "Ordenas, preparas la semana y disfrutas de la calma",
        "Paseas a solas por un barrio que nunca has explorado",
        "Escribes a tus amigos «¿vienen a casa?» y dejas que el día fluya"
      ]
    },
    {
      "q": "En una cena de Año Nuevo, se sienta a tu lado alguien que no conoces.",
      "choices": [
        "Sonríes, charlas de cosas ligeras y disfrutas tranquilamente de la comida",
        "Le preguntas por su trabajo. Quizá aprendas algo útil para tus propias metas",
        "Le presentas a todo el mundo y propones un juego",
        "Te aseguras de que se sienta a gusto y le invitas a la próxima reunión"
      ]
    },
    {
      "q": "Después de una racha intensa, te sientes algo agotado. ¿Cómo recargas pilas?",
      "choices": [
        "Llamas a un amigo cercano y charlas de todo y de nada durante horas",
        "Pruebas algo totalmente nuevo por capricho, solo para ti",
        "Organizas una escapada de fin de semana con amigos, itinerario incluido",
        "Te reservas una noche tranquila: acostarte pronto, un buen libro y una infusión"
      ]
    },
    {
      "q": "A mitad de año, llama a tu puerta una oportunidad inesperada.",
      "choices": [
        "La piensas con calma y luego vas a por ella con un plan claro",
        "La dejas pasar. Estás a gusto con tu ritmo",
        "Lo hablas con tus personas más cercanas antes de decidir",
        "Te lanzas de cabeza y te llevas a un amigo contigo"
      ]
    },
    {
      "q": "Imagina la próxima Nochevieja. ¿Qué te haría sentir más orgullo?",
      "choices": [
        "Una libreta llena de pequeños hábitos que de verdad mantuviste",
        "Una gran meta que todo tu equipo alcanzó junto",
        "Un año lleno de momentos cálidos con la gente que quieres",
        "Un montón de historias de cosas que probaste por primera vez"
      ]
    }
  ],
  "types": {
    "voyage": {
      "name": "La Gran Travesía",
      "word": "travesía",
      "vibe": "Tú marcas el rumbo y tu tripulación navega feliz contigo.",
      "desc": "Este podría ser un año para zarpar. Te atraen los horizontes nuevos, pero nunca sales del puerto sin mapa y casi nunca viajas solo. La gente confía en tus planes porque piensas en todos los que van a bordo. Este año te sientan bien las metas compartidas: un proyecto en equipo, un viaje en grupo, un reto con amigos. Mantén el rumbo, pero disfruta también del paisaje.",
      "keywords": ["Planes audaces", "Trabajo en equipo", "Nuevos horizontes"],
      "color": "Azul océano",
      "item": "Un mapa de papel de un lugar que quieras visitar",
      "fortune": {
        "work": "Buen año para empezar algo más grande de lo que harías a solas. Tu talento para organizar a la gente puede abrirte puertas interesantes.",
        "money": "Ahorrar para una meta compartida, como un viaje o una celebración, puede motivarte más que ahorrar porque sí.",
        "love": "La gente se reúne a tu alrededor. Acuérdate de preguntar a tu tripulación cómo está, no solo cómo va el plan.",
        "self": "Agenda tu descanso igual que agendas todo lo demás. Hasta los capitanes necesitan una noche tranquila en el puerto."
      },
      "tip": "Apunta una aventura que quieras compartir con alguien este año y elige el mes junto a esa persona."
    },
    "festival": {
      "name": "La Verbena Radiante",
      "word": "verbena",
      "vibe": "Conviertes los días normales en pequeñas celebraciones.",
      "desc": "Tu año podría parecer una gran verbena con muchos escenarios pequeños. Te encanta probar cosas nuevas y te encanta hacerlo con más gente, a poder ser sin planear demasiado. Tu energía une a las personas y convierte un martes cualquiera en una fiesta. Este año tu apertura podría traerte nuevas amistades e invitaciones inesperadas. Solo deja un hueco en tu agenda para tomar aire.",
      "keywords": ["Alegre", "Sociable", "Espontáneo"],
      "color": "Coral soleado",
      "item": "Un ramo de globos de colores",
      "fortune": {
        "work": "Las ideas frescas te salen solas cuando las compartes con otros. Un enfoque divertido podría resolver lo que las caras serias no lograron.",
        "money": "Los buenos momentos compartidos te importan. Un botecito para salidas con amigos puede alegrar tu bolsillo y tu ánimo.",
        "love": "Tu círculo podría crecer este año. Alguien que conozcas por casualidad puede acabar siendo un buen amigo.",
        "self": "Equilibra las semanas movidas con algunas tardes lentas. Brillas más cuando has descansado."
      },
      "tip": "Organiza una pequeña celebración sin ningún motivo e invita a alguien a quien te gustaría conocer mejor."
    },
    "summit": {
      "name": "La Cumbre Soñada",
      "word": "cumbre",
      "vibe": "Una meta clara, un ascenso constante y una gran vista arriba.",
      "desc": "Este año parece una montaña que has decidido subir. Te gustan los retos de verdad, te gusta prepararte bien y te sientes a gusto centrándote en tu propio camino. Paso a paso, podrías avanzar de forma visible en algo que te importa: una habilidad, un proyecto, una marca personal. No necesitas público, pero la vista desde arriba merecerá ser compartida. Celebra cada campamento del trayecto.",
      "keywords": ["Enfocado", "Decidido", "Bien preparado"],
      "color": "Verde pino",
      "item": "Unas zapatillas cómodas",
      "fortune": {
        "work": "La concentración es tu punto fuerte. Un proyecto a largo plazo o una nueva habilidad podrían crecer poco a poco con tu esfuerzo paciente.",
        "money": "Las metas claras también te ayudan aquí. Saber para qué ahorras puede facilitarte las pequeñas decisiones.",
        "love": "Quizá andes ocupado con tu ascenso, así que un mensaje corto a un viejo amigo podría significar más de lo que crees.",
        "self": "Los días de descanso son parte de toda buena escalada. Planéalos con la misma seriedad que tus días de entrenamiento."
      },
      "tip": "Elige una meta para el año y marca tres pequeños puntos de control en tu calendario."
    },
    "adventure": {
      "name": "El Camino Abierto",
      "word": "camino abierto",
      "vibe": "Sin mapa, sin problema. Cada curva es una historia nueva.",
      "desc": "Tu año podría sentirse como un viaje por carretera sin destino fijo. Sigues tu curiosidad, disfrutas de tu propia compañía y no te importa cambiar de dirección cuando aparece algo interesante. Esa libertad te lleva a lugares e ideas que otros pasan por alto. Puede ser un año de primeras veces: una ciudad nueva, una afición nueva, una nueva forma de ver las cosas. Lleva siempre una libreta, porque querrás recordar los desvíos.",
      "keywords": ["Curioso", "Espíritu libre", "Independiente"],
      "color": "Naranja atardecer",
      "item": "Una mochila ligera",
      "fortune": {
        "work": "Los caminos poco habituales pueden irte bien. Probar un método que nadie ha usado aún podría llevarte a tus mejores ideas.",
        "money": "Las experiencias te importan más que las cosas. Un botecito para viajes podría convertir deseos en escapadas reales.",
        "love": "Conoces gente interesante por el camino. Deja que algunas personas se queden en tu historia más de un capítulo.",
        "self": "Tu libertad es tu energía. Asegúrate de tener también un rincón acogedor al que volver."
      },
      "tip": "Prueba algo totalmente nuevo cada estación y escribe una sola frase sobre cómo te sentiste."
    },
    "nest": {
      "name": "El Nido Cálido",
      "word": "nido cálido",
      "vibe": "Construyes un hogar donde todo el mundo se siente bienvenido.",
      "desc": "Este año podría girar en torno a construir algo cálido y duradero. Te gusta un ritmo estable, te importa mucho la gente que te rodea y te preparas con cariño para que todos se sientan cuidados. Tu casa, tu equipo o tu grupo de amigos pueden convertirse en el lugar donde a todos les encanta reunirse. Las pequeñas tradiciones que empieces este año, como una cena al mes o un álbum de fotos compartido, podrían durar muchos años.",
      "keywords": ["Atento", "Confiable", "Detallista"],
      "color": "Beige cálido",
      "item": "Una vela de aroma suave",
      "fortune": {
        "work": "La gente cuenta con tu mano firme. Organizar y apoyar a los demás podría ser donde más brilles.",
        "money": "Planificar con calma te sienta bien. Apartar un poco para momentos compartidos en casa puede resultarte muy gratificante.",
        "love": "Tus relaciones podrían ganar en profundidad más que en número. Una larga conversación puede valer más que una gran fiesta.",
        "self": "Tú cuidas de todos, así que deja que alguien cuide de ti también. Está bien aceptar ayuda."
      },
      "tip": "Empieza una pequeña tradición con tus seres queridos, como una comida al mes o una foto cada año."
    },
    "bond": {
      "name": "El Círculo Afín",
      "word": "círculo afín",
      "vibe": "Los mejores momentos de tu año tendrán caras conocidas.",
      "desc": "Tu año podría estar teñido de buena compañía. Disfrutas de un ritmo tranquilo, sabes escuchar y te gusta que los planes surjan de forma natural con la gente que quieres. Tus amigos se sienten a gusto contigo, y viejos vínculos podrían volver de maneras preciosas. Puede ser un año de largas charlas, sobremesas eternas y risas que aún recordarás el próximo invierno. Mantén abiertas la puerta y el corazón.",
      "keywords": ["Cariñoso", "Tranquilo", "Leal"],
      "color": "Rosa cereza",
      "item": "Un montoncito de tarjetas escritas a mano",
      "fortune": {
        "work": "Una buena relación con compañeros de trabajo o de clase podría hacerlo todo más fácil. Tu amabilidad es una verdadera fortaleza.",
        "money": "Compartir te sienta mejor que acumular. Un pequeño detalle pensado puede dar más alegría que una gran compra.",
        "love": "Una vieja amistad podría volver a florecer, o una nueva podría sentirse como si se conocieran de toda la vida.",
        "self": "Estar con otros te recarga, pero los ratos de calma también te ayudan a escuchar tus propios deseos."
      },
      "tip": "Envía cada mes una nota escrita a mano a alguien que te haya alegrado la vida."
    },
    "seed": {
      "name": "La Semilla Paciente",
      "word": "semilla",
      "vibe": "Pequeños pasos cada día, y algo bonito empieza a crecer.",
      "desc": "Este podría ser un año de crecimiento silencioso. Prefieres un ritmo constante, valoras tu propio espacio y disfrutas planeando pasos pequeños y sensatos. No es nada llamativo, pero el próximo invierno quizá te sorprenda todo lo que ha crecido: un hábito que se quedó, una habilidad que floreció, una rutina más serena. Tu paciencia es tu superpoder secreto este año. Riega tus semillas un poquito cada día.",
      "keywords": ["Paciente", "Constante", "Sereno"],
      "color": "Menta fresca",
      "item": "Una libretita de hábitos",
      "fortune": {
        "work": "Este año la constancia podría ganarle a la velocidad. Los pequeños avances diarios pueden sumar algo de lo que te sientas orgulloso.",
        "money": "Las rutinas suaves te van bien, como un repaso sencillo de tus gastos una vez al mes.",
        "love": "Quizá no tengas el círculo más grande, pero quienes están en él sabrán que pueden contar contigo.",
        "self": "Una rutina sencilla, un rincón ordenado y acostarte pronto pueden ser todo lo que necesitas para sentirte en tu mejor momento."
      },
      "tip": "Elige un hábito diario diminuto, tan pequeño que puedas cumplirlo incluso en tu día más perezoso."
    },
    "pause": {
      "name": "La Pausa Serena",
      "word": "pausa serena",
      "vibe": "Un año más lento, un corazón más suave y espacio para respirar.",
      "desc": "Tu año podría tratarse de bajar el ritmo de la mejor manera. Te gusta ir con calma, valoras el tiempo para ti y te parece bien dejar que la vida fluya sin forzarla. Eso no es no hacer nada: es el espacio donde aparecen en silencio las ideas nuevas. Puede ser un año para disfrutar de los placeres sencillos, un buen libro, un paseo largo, una tarde acogedora, y para notar lo que de verdad te hace feliz.",
      "keywords": ["Tranquilo", "Reflexivo", "Amable"],
      "color": "Lavanda",
      "item": "Una bufanda suave y calentita",
      "fortune": {
        "work": "Una mente en calma ve con claridad. Tomarte un momento antes de decidir podría ayudarte a elegir el buen camino.",
        "money": "Las alegrías sencillas cuestan poco. Quizá descubras que lo que más quieres ya lo tienes a mano.",
        "love": "La compañía tranquila te sienta bien. Uno o dos amigos cercanos podrían llenar tu año.",
        "self": "Este es tu año para descansar sin culpa. Las mañanas lentas y las noches tranquilas son bien merecidas."
      },
      "tip": "Reserva una tarde a la semana totalmente libre, solo para hacer lo que te apetezca."
    }
  }
};
