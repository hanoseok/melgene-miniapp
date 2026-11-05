/* Aim Trainer — es (Aim trainer)
 * Rules live in aim-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {avg} {hits} {acc} {tier} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Aim trainer · Entrenamiento de puntería online",
    "description": "Aim trainer gratis: acierta 30 objetivos lo más rápido posible o todos los que puedas en 30 segundos. Tiempo medio, precisión y ranking en móvil o PC.",
    "ogTitle": "Aim trainer 🎯 ¿Qué tan rápida y precisa es tu puntería?",
    "ogDescription": "Acierta 30 objetivos o juega 30 segundos contrarreloj y descubre tu tiempo medio, tu precisión y tu insignia."
  },
  "siteName": "Aim trainer",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "🎯 ¿Cuánto vale tu puntería?",
    "h1Kicker": "Aim trainer · Entrenamiento de puntería",
    "h1Html": "Apunta bien,<br><em>acierta rápido</em>",
    "hook": "Los objetivos aparecen en cualquier parte del recuadro. Tócalos antes de que desaparezcan y descubre lo rápida y precisa que es tu mano.",
    "modeLabel": "Modo",
    "modes": {
      "classic": {
        "name": "Clásico",
        "sub": "30 objetivos"
      },
      "timed": {
        "name": "Contrarreloj",
        "sub": "30 segundos"
      }
    },
    "how": "Acierta el objetivo central para empezar · fuera = fallo",
    "start": "¡Vamos! →",
    "facts": "Ratón, panel táctil o dedo · móvil o PC · supera tu récord"
  },
  "modes": {
    "classic": "Clásico · 30 objetivos",
    "timed": "Contrarreloj · 30 segundos"
  },
  "play": {
    "time": "Tiempo",
    "hits": "Aciertos",
    "acc": "Precisión",
    "ready": "Acierta el objetivo para empezar",
    "readySub": "El reloj arranca con ese primer acierto",
    "done": "¡Listo!",
    "timeUp": "¡Se acabó el tiempo!",
    "cancelled": "Saliste de la página, así que esta partida no cuenta. ¡Inténtalo de nuevo!",
    "change": "← Cambiar modo",
    "areaAria": "Zona de puntería"
  },
  "result": {
    "over": "Tu resultado",
    "scoreClassic": "Tiempo medio por objetivo",
    "scoreTimed": "Objetivos acertados",
    "unitMs": "ms",
    "unitHits": "aciertos",
    "acc": "Precisión",
    "avg": "Tiempo medio",
    "misses": "Fallos",
    "total": "Tiempo total",
    "escaped": "Escapados",
    "msValue": "{n} ms",
    "secValue": "{n} s",
    "tierLabel": "Tu insignia de puntería",
    "tiers": [
      "🐢 Calentando",
      "🙂 Puntería casual",
      "🎯 Buen ojo",
      "🦅 Ojo de halcón",
      "⚡ Rey del flick",
      "🏆 Leyenda del aim"
    ],
    "newBest": "¡Nuevo récord personal!",
    "pbClassic": "Tu récord en Clásico: {n} ms",
    "pbTimed": "Tu récord en Contrarreloj: {n} aciertos",
    "invalid": "Eso es más rápido de lo que puede reaccionar una persona, así que este resultado no se guarda ni se compara.",
    "top": "Top {n} %",
    "beat": "Mejor que el {pct} % de los jugadores",
    "beatAll": "Mejor que todos los demás jugadores hasta ahora",
    "others": "Comparado con otras {n} partidas en este modo",
    "comparing": "Comparando con otros jugadores…",
    "shareTitle": "Aim trainer",
    "shareClassic": "Promedio de {avg} ms por objetivo con {acc} % de precisión 🎯 {tier}. ¿Apuntas más rápido?",
    "shareTimed": "{hits} objetivos en 30 segundos con {acc} % de precisión 🎯 {tier}. ¿Lo superas?",
    "retry": "Jugar otra vez"
  },
  "og": {
    "brand": "🎯 Aim trainer",
    "defaultKicker": "Test de puntería gratis",
    "defaultTitle": "¿Qué tan rápida y precisa es tu puntería?",
    "defaultDesc": "30 objetivos o 30 segundos · móvil o PC"
  },
  "faq": [
    {
      "q": "¿Cómo funciona este aim trainer?",
      "a": "Elige Clásico o Contrarreloj, pulsa el botón y acierta el objetivo del centro del recuadro para empezar. En Clásico aparecen 30 objetivos uno a uno y tu puntuación es el tiempo medio que tardas en acertar cada uno. En Contrarreloj tienes 30 segundos para acertar todos los que puedas; cada objetivo se encoge poco a poco y se escapa si tardas demasiado."
    },
    {
      "q": "¿Qué es una buena puntuación?",
      "a": "En Clásico la mayoría promedia entre 500 y 800 milisegundos por objetivo, y los buenos jugadores bajan de 450. En Contrarreloj lo habitual son unos 35 a 45 aciertos. La precisión también cuenta: si menos del 70 % de tus clics dan en un objetivo, tu insignia baja un nivel."
    },
    {
      "q": "¿Se puede jugar con ratón, panel táctil o pantalla táctil?",
      "a": "Sí. Funcionan los clics del ratón, el panel táctil, el lápiz y el dedo; el teclado no se usa. Solo cuentan los clics dentro de la zona de juego. Las puntuaciones de distintos dispositivos no son muy comparables: con ratón y con móvil puedes sacar resultados bastante diferentes."
    },
    {
      "q": "¿Por qué no contó mi partida?",
      "a": "Si cambias de pestaña, bloqueas el móvil o sales de la página durante una partida, se anula para que sea justo. Los resultados más rápidos de lo que puede reaccionar una persona, como un promedio por debajo de 150 milisegundos por objetivo, no se guardan ni se comparan con otros jugadores."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Aim trainer",
    "description": "Política de privacidad del Aim trainer: puntuaciones anónimas, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "El Aim trainer (el \"Servicio\") respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Al terminar una partida, solo tu puntuación (tiempo medio por objetivo o número de aciertos) se envía a nuestro servidor como un recuento anónimo, sin nombre ni identificador personal. Durante el uso puede recopilarse automáticamente cierta información, como se describe abajo."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y tu récord, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en la configuración del navegador; algunas funciones podrían no ir como se espera."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, partidas iniciadas y terminadas, valoraciones). Nada de esto te identifica personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes preguntas sobre esta política, contacta con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está vigente desde el 6 de noviembre de 2026."
      ]
    ],
    "back": "← Volver al Aim trainer"
  }
};
