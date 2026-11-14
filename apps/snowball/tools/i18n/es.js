/* Snowball Fight — es (Bolas de nieve)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
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
    "title": "Guerra de bolas de nieve – lanza y agáchate",
    "description": "Juego gratis de guerra de bolas de nieve: acierta a los niños que asoman tras sus fuertes y agáchate detrás de tu muro cuando te lancen una bola. 60 segundos.",
    "ogTitle": "Bolas de nieve ☃️ ¿Cuántos aciertos en 60 segundos?",
    "ogDescription": "Lanza rápido, agáchate a tiempo y no le des al perro. Tres corazones, un minuto."
  },
  "siteName": "Bolas de nieve",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "☃️ Nieve recién caída, bolsillos llenos",
    "h1Kicker": "Guerra de bolas de nieve",
    "h1Html": "Apunta, lanza<br><em>y agáchate</em>",
    "hook": "Al otro lado del patio, los niños se esconden tras sus fuertes de nieve. Dales cuando asomen la cabeza y agáchate rápido cuando alguno levante el brazo.",
    "how": {
      "throw": "Toca a un niño para lanzar",
      "duck": "Si sale ❗, agáchate",
      "avoid": "No le des a los amigos"
    },
    "start": "¡A la batalla! →",
    "facts": "Partidas de 60 s · 3 corazones · móvil o PC"
  },
  "play": {
    "score": "Puntos",
    "time": "Tiempo",
    "lives": "Vidas",
    "secUnit": "s",
    "pause": "Pausa",
    "paused": "En pausa",
    "resume": "Volver a la batalla",
    "hint": "Toca el patio para empezar",
    "fieldAria": "Patio nevado: toca a un niño para lanzar una bola, mantén pulsado el muro o el botón Agáchate para esconderte",
    "duck": "Agáchate (mantén)",
    "duckAria": "Agacharse tras el muro mientras se mantiene pulsado",
    "combo": "Combo ×{n}",
    "golden": "¡Dorado! +{n}",
    "oops": "¡Es un amigo! −{n}",
    "miss": "Fallo",
    "block": "¡Bloqueado!",
    "ouch": "¡Ay!",
    "timeUp": "¡Tiempo!",
    "out": "¡Sepultado!"
  },
  "result": {
    "over": "Fin de la batalla",
    "reasonTime": "Aguantaste el minuto entero",
    "reasonOut": "Tres impactos y quedas fuera",
    "unit": "pts",
    "newBest": "¡Nuevo récord personal!",
    "best": "Tu récord: {n} pts",
    "hits": "Aciertos",
    "accuracy": "Precisión",
    "bestCombo": "Mejor combo",
    "tierLabel": "Tu rango de batalla",
    "tiers": [
      "🧤 Dedos congelados",
      "❄️ Novato de la nieve",
      "⛄ Fijo del patio",
      "🎯 Buena puntería",
      "⭐ Asaltafuertes",
      "🏆 Leyenda helada"
    ],
    "top": "Top {n} %",
    "beat": "Mejor que el {pct} % de los jugadores",
    "beatAll": "Mejor que todos los demás jugadores hasta ahora",
    "others": "Comparado con otras {n} partidas",
    "comparing": "Comparando con otros jugadores…",
    "shareTitle": "Guerra de bolas de nieve",
    "shareText": "Hice {n} pts en 60 segundos de guerra de bolas de nieve ☃️ {tier}. ¿Me superas?",
    "retry": "Otra batalla"
  },
  "og": {
    "brand": "☃️ Bolas de nieve",
    "defaultKicker": "Juego de bolas de nieve online",
    "defaultTitle": "¿Cuántos aciertos en 60 segundos?",
    "defaultDesc": "Lanza · agáchate · no le des al perro"
  },
  "faq": [
    {
      "q": "¿Cómo lanzo y cómo me agacho?",
      "a": "Toca (o haz clic en) un niño que asome tras su fuerte de nieve y una bola saldrá hacia él. Para esconderte, mantén pulsado el botón Agáchate o el muro de nieve de abajo. Mientras estás agachado no puedes lanzar. En el ordenador, usa ← y → para elegir un fuerte, ↑ o F para lanzar, y mantén Espacio o ↓ para agacharte."
    },
    {
      "q": "¿Cómo sé que viene una bola?",
      "a": "El niño que va a lanzar levanta el brazo y aparece un ❗ rojo sobre su cabeza. Si le das antes, no llega a lanzar. Si la bola ya está en el aire, verás un ❗ grande sobre tu muro y el botón Agáchate se pondrá rojo: mantenlo hasta que la bola caiga."
    },
    {
      "q": "¿Cómo se cuentan los puntos?",
      "a": "Cada acierto suma puntos, y un muñeco de nieve vale un poco más que un niño. Varios aciertos seguidos forman un combo que sube el valor de cada lanzamiento; un fallo lo reinicia. El raro muñeco de nieve dorado es el que más vale. El perro y el niño de la bandera blanca son amigos: si les das, pierdes puntos."
    },
    {
      "q": "¿Cuándo termina una partida?",
      "a": "Cada partida dura 60 segundos, o termina antes si te dan tres veces. Cuanto más avanza el reloj, más movida se pone. La partida se pausa sola si cambias de pestaña o bloqueas el móvil."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Bolas de nieve",
    "description": "Política de privacidad del juego de bolas de nieve: puntuaciones anónimas, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "El juego de bolas de nieve (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
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
        "Esta política está vigente desde el 14 de noviembre de 2026."
      ]
    ],
    "back": "← Volver al juego de bolas de nieve"
  }
};
