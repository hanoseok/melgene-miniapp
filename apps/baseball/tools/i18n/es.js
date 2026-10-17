/* Toros y vacas (숫자 야구 / number baseball) — es
 * Rules live in baseball-core.js; this file holds every visible string.
 * Keys ending in Html are raw HTML (<br>, <em> only); privacy.sections bodies are HTML too.
 * Placeholders: {n} {d} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Toros y vacas – juego de adivinar el número secreto",
    "description": "Juega gratis a Toros y vacas (Bulls and Cows): adivina el número secreto de 3 o 4 cifras con las pistas de toros, vacas y nada. Mejor marca por nivel, sin descargas.",
    "ogTitle": "Toros y vacas ⚾ ¿Puedes descubrir el número secreto?",
    "ogDescription": "Un número secreto sin cifras repetidas. Adivínalo con las pistas y logra hacerlo en el menor número de intentos."
  },
  "siteName": "Toros y vacas – béisbol de números",
  "privacyLink": "Privacidad",
  "start": {
    "badge": "⚾ Béisbol de números",
    "h1Kicker": "Toros y vacas",
    "h1Html": "Descubre el<br><em>número secreto</em>",
    "hook": "La computadora ha escondido un número secreto sin cifras repetidas. Haz tu apuesta, lee las pistas y descifra el código.",
    "how": "Toro = cifra y posición correctas · Vaca = cifra correcta, posición equivocada · Nada = ningún acierto",
    "levelLabel": "Elige cuántas cifras",
    "levels": {
      "d3": "3 cifras",
      "d4": "4 cifras"
    },
    "levelSub": {
      "d3": "Clásico",
      "d4": "Más difícil"
    },
    "timer": "Mostrar cronómetro",
    "start": "Empezar →"
  },
  "play": {
    "tries": "Intentos",
    "time": "Tiempo",
    "slotAria": "Cifra {n}",
    "enter": "Probar",
    "del": "Borrar",
    "giveUp": "Rendirme",
    "giveUpSure": "Toca otra vez para ver la respuesta",
    "historyTitle": "Tus intentos",
    "historyEmpty": "Escribe un número para hacer tu primer intento.",
    "errLen": "Escribe {n} cifras",
    "errDup": "Las cifras no pueden repetirse",
    "errAgain": "Ya probaste ese número",
    "strike": "Toro",
    "ball": "Vaca",
    "out": "Nada",
    "legend": "Toro: cifra y posición correctas · Vaca: cifra correcta, posición equivocada"
  },
  "result": {
    "done": "¡Lo descifraste!",
    "gaveUp": "La respuesta era",
    "triesCaption": "Intentos",
    "timeLabel": "Tiempo",
    "secretLabel": "Número secreto",
    "sec": "s",
    "best": "Mejor marca en este nivel: {n}",
    "newBest": "¡Nueva mejor marca personal!",
    "top": "Top {n} %",
    "beat": "Menos intentos que el {pct} % de los jugadores",
    "beatAll": "Menos intentos que todos los resultados hasta ahora",
    "others": "Comparado con {n} resultados más en este nivel",
    "comparing": "Comparando con otros jugadores…",
    "retry": "Jugar otra vez",
    "shareTitle": "Toros y vacas – ¿puedes descubrir el número secreto?",
    "shareText": "Descifré un número de {d} cifras en {n} intentos ⚾ ¿Puedes hacerlo en menos?"
  },
  "og": {
    "brand": "⚾ Toros y vacas",
    "defaultKicker": "Juego de números gratis",
    "defaultTitle": "¿Puedes descubrir el número secreto?",
    "defaultDesc": "Toro · Vaca · Nada"
  },
  "faq": [
    {
      "q": "¿Cómo se juega a Toros y vacas?",
      "a": "La computadora elige un número secreto con todas las cifras distintas. Escribe un número de la misma longitud, también sin cifras repetidas, y pulsa Probar. Una cifra en su sitio es un toro, una cifra correcta en otro sitio es una vaca, y si no coincide nada es “nada”. Ganas cuando todas las cifras son toros."
    },
    {
      "q": "¿Puede el número empezar por 0? ¿Se repiten las cifras?",
      "a": "Puede empezar por 0, por ejemplo 072, pero una cifra nunca aparece dos veces. Tus intentos tampoco pueden repetir cifras. Un número que ya probaste no se cuenta de nuevo: solo los intentos nuevos suman."
    },
    {
      "q": "¿Hay botón de pista o límite de intentos?",
      "a": "No hay pistas ni límite. Es un puzle de pura deducción: cuantos menos intentos necesites, mejor. Si te atascas, pulsa Rendirme para ver la respuesta y empezar otra ronda. El cronómetro es opcional y solo aparece si lo activas."
    },
    {
      "q": "¿Qué diferencia hay entre 3 y 4 cifras?",
      "a": "Con 3 cifras hay 720 números secretos posibles; con 4 cifras hay muchos más, y todos son igual de probables. Tu mejor marca se guarda por separado para cada nivel en este navegador."
    },
    {
      "q": "¿De dónde sale el “Top %”?",
      "a": "Cuando resuelves una ronda, tu número de intentos se compara con los resultados reales de otros jugadores del mismo nivel. Si aún no hay otros resultados, la comparación no se muestra. Las rondas en las que te rindes no cuentan."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Toros y vacas",
    "description": "Política de privacidad de Toros y vacas: resultados anónimos, cookies, publicidad y estadísticas.",
    "h1": "Política de privacidad",
    "introHtml": "Toros y vacas (el \"Servicio\") respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Al resolver una ronda, solo se envían a nuestro servidor el nivel y tu número de intentos como un recuento anónimo, sin nombre ni identificador personal. Durante el uso del Servicio se puede recopilar automáticamente cierta información, como se describe a continuación."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y tus récords, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en la configuración del navegador; en ese caso algunas funciones podrían no funcionar como se espera."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar tus preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (páginas vistas, partidas empezadas y terminadas, valoraciones con estrellas). Nada de esto te identifica personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está vigente desde el 18 de octubre de 2026."
      ]
    ],
    "back": "← Volver a Toros y vacas"
  }
};
