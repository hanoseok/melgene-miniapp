/* Reto de los 10 segundos — es (10 Second Challenge / timer)
 * Rules live in timer-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + target/blind choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {total} {time} {pct} {tier} — keep them as-is when translating.
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
    "title": "Reto de los 10 segundos – Para el cronómetro en 10,00",
    "description": "Reto de los 10 segundos: inicia el cronómetro y detenlo justo en 10,00 segundos a ojo. 3 intentos, modo a ciegas y objetivos de 5 o 30 segundos. Gratis, sin descargas.",
    "ogTitle": "Reto de los 10 segundos ⏱️ ¿Lo paras justo en 10,00?",
    "ogDescription": "Cuenta en tu cabeza y pulsa STOP en el momento justo. 3 intentos, y en modo a ciegas los números desaparecen."
  },
  "siteName": "Reto de los 10 segundos",
  "privacyLink": "Privacidad",
  "start": {
    "badge": "⏱️ ¿Sientes 10 segundos?",
    "h1Kicker": "Reto de los 10 segundos",
    "h1Html": "Para el crono<br><em>justo en 10,00</em>",
    "hook": "Inicia el cronómetro, cuenta en tu cabeza y páralo en el momento justo. Tres intentos, y solo cuenta el más cercano.",
    "targetLabel": "Tiempo objetivo",
    "targetValue": "{n} s",
    "blindLabel": "Modo a ciegas",
    "blindDesc": "Los números desaparecen a los 3 segundos",
    "how": "Inicio y luego STOP · toca donde sea o pulsa Espacio",
    "start": "¡Vamos! →",
    "facts": "3 intentos · 5, 10 o 30 segundos · supera tu récord"
  },
  "play": {
    "target": "Objetivo {t}",
    "blindTag": "A ciegas",
    "attempt": "Intento {n} de {total}",
    "go": "Inicio",
    "stop": "STOP",
    "next": "Siguiente intento",
    "finish": "Ver mi resultado",
    "readyHint": "Pulsa Inicio y para justo en {t}",
    "runHint": "Toca donde sea o pulsa Espacio para parar",
    "early": "{n} antes de tiempo",
    "late": "{n} tarde",
    "perfect": "¡Perfecto! Justo {t} 🎉",
    "cancelled": "Saliste de la página, así que ese intento no cuenta. ¡Otra vez!",
    "hidden": "??:??.??",
    "change": "← Cambiar modo",
    "clockAria": "Cronómetro",
    "sec": "{n} s"
  },
  "result": {
    "over": "Tu resultado",
    "mode": "Objetivo {t}",
    "perfect": "¡Justo {t}! Parada perfecta 🎉",
    "bestLabel": "Intento más cercano, desfase de",
    "stoppedAt": "Parado en {time}",
    "tierLabel": "Tu reloj interno",
    "tiers": [
      "🐌 Perdido en el tiempo",
      "⏳ Más o menos",
      "🙂 Buen reloj interno",
      "🎯 Timing preciso",
      "⚡ Pro de las centésimas",
      "🧠 Cronómetro humano"
    ],
    "newBest": "¡Nuevo récord personal!",
    "pb": "Tu récord en este modo: {n}",
    "avg": "Desfase medio",
    "listLabel": "Tus 3 intentos",
    "top": "Top {n}%",
    "beat": "Más preciso que el {pct}% de los jugadores",
    "beatAll": "Más preciso que todos los demás jugadores hasta ahora",
    "others": "Comparado con {n} partidas más en este modo",
    "comparing": "Comparando con otros jugadores…",
    "shareTitle": "Reto de los 10 segundos",
    "shareText": "Paré el cronómetro a solo {n} de {t} ⏱️ {tier}. ¿Lo clavas tú?",
    "retry": "Intentar de nuevo"
  },
  "og": {
    "brand": "⏱️ Reto de los 10 segundos",
    "defaultKicker": "Juego de timing gratis",
    "defaultTitle": "¿Paras el cronómetro justo en 10,00?",
    "defaultDesc": "3 intentos · modo a ciegas · 5, 10 o 30 segundos"
  },
  "faq": [
    {
      "q": "¿Cómo se juega?",
      "a": "Elige un tiempo objetivo (5, 10 o 30 segundos) y pulsa Inicio. El cronómetro arranca en el instante en que tocas. Cuenta en tu cabeza y pulsa STOP, toca en cualquier parte de la pantalla de juego o pulsa Espacio cuando creas que ha pasado el tiempo. Tienes tres intentos por partida y el más cercano es tu resultado."
    },
    {
      "q": "¿Qué hace el modo a ciegas?",
      "a": "En el modo a ciegas los números se convierten en signos de interrogación después de los primeros 3 segundos, y tienes que seguir contando solo por intuición. Es mucho más difícil, y tiene su propio récord y su propia comparación con otros jugadores."
    },
    {
      "q": "¿Por qué es tan difícil clavar el 10,00?",
      "a": "Tu dedo tarda un instante en reaccionar y tu cuenta mental se desvía un poco en diez segundos, así que incluso una buena parada cae unas centésimas antes o después. El cronómetro toma el momento exacto de tu toque y muestra centésimas como uno de verdad. Un 10,00 exacto es raro, y por eso tiene tanta gracia."
    },
    {
      "q": "¿Por qué no contó mi intento?",
      "a": "Si cambias de pestaña, bloqueas el móvil o sales de la página mientras corre el cronómetro, ese intento se cancela para que sea justo. Vuelve a empezar el mismo intento."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Reto de los 10 segundos",
    "description": "Política de privacidad de Reto de los 10 segundos: puntuaciones anónimas, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "Reto de los 10 segundos (el \"Servicio\") respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Al terminar una partida, solo tu puntuación (cuántos milisegundos se desvió tu mejor intento) se envía a nuestro servidor como un recuento anónimo, sin nombre ni identificador personal. Durante el uso puede recopilarse automáticamente cierta información, como se describe abajo."
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
        "Esta política está vigente desde el 2 de noviembre de 2026."
      ]
    ],
    "back": "← Volver a Reto de los 10 segundos"
  }
};
