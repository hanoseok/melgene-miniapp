/* Ice Fishing — es (Pesca en hielo)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
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
    "title": "Juego de pesca en hielo – Pesca bajo el hielo",
    "description": "Juego de pesca en hielo gratis online: baja el sedal por un agujero del lago helado, espera la picada y recoge sin que se rompa la línea. 60 segundos, móvil o PC.",
    "ogTitle": "Pesca en hielo 🎣 ¿Cuántos peces sacas en 60 segundos?",
    "ogDescription": "Baja el sedal bajo el hielo, siente la picada y recoge con cuidado. Si tiras demasiado, la línea se rompe."
  },
  "siteName": "Pesca en hielo",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "🎣 Un lago helado, un agujerito",
    "h1Kicker": "Juego de pesca en hielo",
    "h1Html": "Baja el sedal<br><em>y sácalos</em>",
    "hook": "Algo nada bajo el hielo. Baja el anzuelo a la profundidad justa, espera el tirón y recoge con suavidad antes de que la línea ceda.",
    "how": {
      "lower": "Mantén para bajar",
      "reel": "¿Pica? Mantén y recoge",
      "red": "Suelta en la zona roja"
    },
    "start": "Empezar a pescar →",
    "facts": "Partidas de 60 s · móvil o PC · supera tu récord"
  },
  "play": {
    "score": "Puntos",
    "time": "Tiempo",
    "secUnit": "s",
    "pause": "Pausa",
    "paused": "En pausa",
    "resume": "Seguir pescando",
    "hint": "Mantén bajo el hielo para bajar el sedal",
    "fieldAria": "Lago helado: mantén pulsado a una profundidad para bajar el anzuelo y mantén para recoger cuando pique",
    "bite": "¡Pica!",
    "catchPop": "{fish} +{n}",
    "snap": "¡Se rompió la línea!",
    "escape": "Se escapó",
    "timeUp": "¡Se acabó el tiempo!"
  },
  "fish": {
    "minnow": "Pececillo",
    "perch": "Perca",
    "trout": "Trucha",
    "pike": "Lucio",
    "golden": "Pez dorado",
    "boot": "Bota vieja"
  },
  "result": {
    "over": "Tu pesca",
    "unit": "pts",
    "newBest": "¡Nuevo récord personal!",
    "best": "Tu récord: {n} pts",
    "caught": "Peces pescados",
    "snapped": "Líneas rotas",
    "bestCatch": "Mejor captura: {fish}",
    "noCatch": "Esta vez no pescaste nada",
    "tierLabel": "Tu nivel de pescador",
    "tiers": [
      "🧊 Manos heladas",
      "🪝 Pescador novato",
      "🐟 Pescador paciente",
      "🎣 Habitual del lago",
      "⭐ Rey de los peces",
      "🏆 Leyenda del lago"
    ],
    "top": "Top {n} %",
    "beat": "Mejor que el {pct} % de los pescadores",
    "beatAll": "Mejor que todos los pescadores hasta ahora",
    "others": "Comparado con otras {n} partidas",
    "comparing": "Comparando con otros pescadores…",
    "shareTitle": "Pesca en hielo",
    "shareText": "Hice {n} pts pescando en hielo en 60 segundos 🎣 {tier}. ¿Me superas?",
    "retry": "Pescar otra vez"
  },
  "og": {
    "brand": "🎣 Pesca en hielo",
    "defaultKicker": "Juego de pesca en hielo",
    "defaultTitle": "¿Cuántos peces sacas en 60 segundos?",
    "defaultDesc": "Baja el sedal · siente la picada · que no se rompa"
  },
  "faq": [
    {
      "q": "¿Cómo bajo el sedal?",
      "a": "Mantén pulsado en cualquier punto del agua bajo el hielo. El anzuelo va hacia esa profundidad y se detiene al soltar. En el ordenador también puedes mantener las teclas ↓ y ↑. Cada pez prefiere una profundidad distinta, así que prueba varias."
    },
    {
      "q": "¿Cómo se recoge?",
      "a": "Cuando pique un pez, mantén pulsado para recoger. La barra de tensión de la derecha sube. Cuando llegue a la zona roja, suelta un momento para que la línea se afloje y vuelve a mantener. Si la barra se llena, la línea se rompe; si la dejas floja demasiado tiempo, el pez se suelta."
    },
    {
      "q": "¿Por qué unos peces valen más?",
      "a": "Los peces más grandes y profundos tiran más fuerte y dan más puntos; el raro pez dorado es el que más vale. La basura, como una bota vieja, sube fácil pero no suma nada. Tu récord se guarda en este navegador."
    },
    {
      "q": "¿Qué pasa si cambio de pestaña?",
      "a": "La partida se pausa sola cuando sales de la página o bloqueas el móvil, y el reloj también se detiene. Pulsa Seguir pescando (o la tecla P) para continuar donde lo dejaste."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Pesca en hielo",
    "description": "Política de privacidad del juego de pesca en hielo: puntuaciones anónimas, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "El juego de pesca en hielo (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Al terminar una partida, solo se envía a nuestro servidor tu puntuación como un recuento anónimo, sin nombre ni identificador personal. Durante el uso puede recopilarse automáticamente cierta información, como se describe abajo."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y tu récord, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en la configuración del navegador; en ese caso, algunas funciones podrían no ir como se espera."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Más información y preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, partidas empezadas y terminadas, valoraciones). Nada de esto te identifica personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes alguna pregunta sobre esta política, ponte en contacto con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está vigente desde el 10 de noviembre de 2026."
      ]
    ],
    "back": "← Volver al juego de pesca en hielo"
  }
};
