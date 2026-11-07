/* Ski Downhill — es (Juego de esquí)
 * Las reglas están en ski-core.js; este archivo solo tiene los textos visibles.
 * Las claves que terminan en Html se insertan como HTML (solo <br> y <em>); privacy.sections también.
 * Mantén los marcadores {n} {pct} {s} {c} {tier}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap",
    "display": "'Oswald'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Juego de esquí online – Descenso y eslalon",
    "description": "Juego de esquí online: baja por una pista nevada sin fin, esquiva pinos, rocas y muñecos de nieve, y pasa por las puertas de eslalon para sumar metros extra. Móvil o PC.",
    "ogTitle": "Juego de esquí ⛷️ ¿Hasta dónde llegas antes de caerte?",
    "ogDescription": "Baja por una pista infinita, pasa entre las puertas de eslalon y esquiva los pinos. Un choque y se acabó."
  },
  "siteName": "Juego de esquí",
  "privacyLink": "Privacidad",
  "start": {
    "badge": "⛷️ Nieve polvo, pista infinita",
    "h1Kicker": "Juego de esquí online",
    "h1Html": "Baja la montaña<br><em>lo más lejos posible</em>",
    "hook": "La pista nunca termina y tus esquís van cada vez más rápido. Zigzaguea entre pinos y banderas y descubre cuántos metros aguantas sin caerte.",
    "how": {
      "steer": "Mantén un lado y gira",
      "gates": "Pasa entre banderas",
      "avoid": "Esquiva pinos y rocas"
    },
    "start": "¡A la pista! →",
    "facts": "Mantén pulsado o teclas ← → · móvil o PC · supera tu récord"
  },
  "play": {
    "dist": "Distancia",
    "best": "Récord",
    "pause": "Pausa",
    "paused": "En pausa",
    "resume": "Seguir esquiando",
    "hint": "Toca para salir",
    "fieldAria": "Pista de esquí: mantén pulsada la mitad izquierda o derecha para girar",
    "gateOk": "+{n} m ×{c}",
    "gateMiss": "Puerta fallada"
  },
  "result": {
    "over": "Tu descenso",
    "unit": "m",
    "newBest": "¡Nuevo récord personal!",
    "best": "Tu récord: {n} m",
    "gates": "Puertas pasadas",
    "time": "Tiempo",
    "timeValue": "{s} s",
    "tierLabel": "Tu nivel de esquí",
    "tiers": [
      "🧊 Pista de principiantes",
      "🟢 Pista verde",
      "🔵 Pista azul",
      "⚫ Pista negra",
      "⚡ Bólido de la nieve",
      "🏆 Leyenda de la montaña"
    ],
    "top": "Top {n} %",
    "beat": "Más lejos que el {pct} % de los esquiadores",
    "beatAll": "Más lejos que todos los demás hasta ahora",
    "others": "Comparado con {n} descensos más",
    "comparing": "Comparando con otros esquiadores…",
    "shareTitle": "Juego de esquí",
    "shareText": "He bajado {n} m de montaña ⛷️ {tier}. ¿Hasta dónde llegas tú?",
    "retry": "Volver a esquiar"
  },
  "og": {
    "brand": "⛷️ Juego de esquí",
    "defaultKicker": "Juego de esquí online",
    "defaultTitle": "¿Hasta dónde llegas antes de caerte?",
    "defaultDesc": "Pista infinita · puertas de eslalon · móvil o PC"
  },
  "faq": [
    {
      "q": "¿Cómo se maneja al esquiador?",
      "a": "Mantén el dedo o el ratón pulsado en la mitad izquierda o derecha de la pista, o mantén las teclas ← → (o A / D). El esquiador se inclina y se desliza suavemente hacia ese lado; suelta para volver a bajar recto. El descenso empieza con tu primer toque o tecla."
    },
    {
      "q": "¿Para qué sirven las banderas?",
      "a": "Dos banderas del mismo color forman una puerta. Pasa entre ellas para ganar metros extra y encadena puertas para subir el combo y que cada bonus sea mayor. Fallar una puerta no termina el descenso, pero el combo vuelve a cero."
    },
    {
      "q": "¿Cómo se cuenta la distancia?",
      "a": "Se suman los metros que bajas más los bonus de las puertas. Cuanto más lejos llegas, más rápido vas, y el descenso termina en cuanto chocas con un pino, una roca o un muñeco de nieve. Tu récord se guarda en este navegador."
    },
    {
      "q": "¿Qué pasa si cambio de pestaña?",
      "a": "El juego se pausa solo cuando sales de la página o bloqueas el móvil. Pulsa «Seguir esquiando» (o la tecla P) para continuar justo donde lo dejaste."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Juego de esquí",
    "description": "Política de privacidad del juego de esquí: puntuaciones anónimas, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "El juego de esquí (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Al terminar un descenso, solo se envía a nuestro servidor tu distancia en metros como un recuento anónimo, sin nombre ni identificador personal. Durante el uso puede recopilarse automáticamente cierta información, como se describe abajo."
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
        "Esta política está vigente desde el 8 de noviembre de 2026."
      ]
    ],
    "back": "← Volver al juego de esquí"
  }
};
