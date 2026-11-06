/* Tarjeta de Año Nuevo 2027 — español (es/). Misma estructura y variables que en.js. card.* se dibuja en la tarjeta. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Pacifico'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Tarjetas de Año Nuevo 2027 para crear",
    description: "Crea tarjetas de Año Nuevo 2027 en línea: elige un diseño y un saludo, escribe los nombres y un buen deseo, y guárdala como imagen o envía un enlace que se abre como un sobre.",
    ogTitle: "Tarjetas de Año Nuevo 2027 🎆",
    ogDescription: "Crea en un minuto una tarjeta de Feliz Año Nuevo y envía tus primeros buenos deseos de 2027."
  },
  siteName: "Tarjeta de Año Nuevo 2027",
  privacyLink: "Privacidad",
  start: {
    badge: "🎆 ¡Hola, 2027!",
    h1Kicker: "Tarjetas de Año Nuevo 2027",
    h1Html: "Empieza el año<br>con <em>buenos deseos</em>",
    hook: "Elige un diseño, escribe un deseo corto y envía una tarjeta que se abre como un sobre de verdad.",
    start: "Crear mi tarjeta →"
  },
  editor: {
    title: "Diseña tu tarjeta",
    themesAria: "Diseños de tarjeta",
    themes: {
      red: "Rojo y oro",
      washi: "Papel washi",
      goat: "Cabrita",
      minimal: "Minimalista",
      snowy: "Noche nevada",
      fireworks: "Fuegos"
    },
    previewAria: "Vista previa de tu tarjeta",
    greetingsLabel: "Saludo",
    decoLabel: "Extras",
    decos: {
      zodiac: "Cabra",
      year: "2027",
      sparkle: "Brillos"
    },
    fields: {
      to: {
        label: "Para",
        placeholder: "p. ej. Abuela"
      },
      from: {
        label: "De",
        placeholder: "p. ej. Lucía"
      },
      message: {
        label: "Tu mensaje",
        placeholder: "Escribe un buen deseo para el año…"
      }
    },
    ideas: "💡 Ideas",
    counter: "{n}/{max}",
    presets: [
      "Que 2027 te traiga salud, mucha risa y todos esos planes que siempre dejamos para después.",
      "Gracias por estar ahí todo el año. ¡Por más cafés, más charlas y más tiempo juntos!",
      "Que este año nuevo llegue con calma, ilusión y alguna que otra sorpresa bonita.",
      "Te deseo un año lleno de paz, amor y prosperidad para ti y los tuyos.",
      "Mi único propósito: vernos más este año. Esta vez va en serio. ¡Feliz Año Nuevo!"
    ],
    defaultGreeting: "happy",
    zodiacOn: false,
    done: "Terminar mi tarjeta"
  },
  card: {
    greetings: {
      happy: "¡Feliz Año Nuevo!",
      formal: "Próspero Año Nuevo",
      luck: "Mis mejores deseos",
      year: "¡Feliz 2027!"
    },
    zodiac: "2027 · Año lunar de la Cabra",
    to: "Querida/o {name}:",
    from: "Con cariño, {name}"
  },
  open: {
    eyebrow: "Te llegó una tarjeta de Año Nuevo",
    fromName: "de {name}",
    fromNone: "de alguien que se acordó de ti",
    open: "Abrir la tarjeta"
  },
  result: {
    eyebrowMine: "¡Tu tarjeta está lista!",
    eyebrowFriend: "Una tarjeta de {name}",
    eyebrowFriendNoName: "Una tarjeta solo para ti",
    imageAlt: "Tarjeta de Año Nuevo: {greeting}",
    save: "Guardar imagen",
    saving: "Creando la imagen…",
    saved: "¡Imagen guardada!",
    saveFail: "No se pudo crear la imagen. Prueba con una captura de pantalla.",
    copyText: "Copiar texto",
    copied: "¡Texto copiado!",
    copyFail: "No se pudo copiar el texto. Inténtalo de nuevo.",
    edit: "Editar",
    retry: "Crear otra tarjeta",
    retryFriend: "Crear mi tarjeta",
    shareTitle: "Tarjeta de Año Nuevo 2027",
    shareText: "{name} te envió una tarjeta de Año Nuevo 🎆 Ábrela aquí:",
    shareTextNoName: "Alguien te envió una tarjeta de Año Nuevo 🎆 Ábrela aquí:",
    fileName: "tarjeta-ano-nuevo-2027"
  },
  og: {
    brand: "🎆 Tarjeta de Año Nuevo 2027",
    defaultKicker: "Tarjetas de Año Nuevo 2027",
    defaultTitle: "Empieza el año con buenos deseos",
    defaultDesc: "6 diseños · guarda la imagen o envía un enlace",
    cardGreeting: "¡Feliz Año Nuevo!"
  },
  faq: [
    {
      q: "¿Cómo creo mi tarjeta?",
      a: "Elige un diseño y un saludo, activa o desactiva la cabra, el «2027» grande y los brillos, y escribe para quién es, de parte de quién y un mensaje corto. La vista previa cambia mientras escribes. Cuando te guste, toca «Terminar mi tarjeta»."
    },
    {
      q: "¿Por qué una cabra?",
      a: "En el calendario lunar de Asia oriental, 2027 es el año de la Cabra (o de la Oveja). En Japón, Corea, China o Vietnam es habitual poner el animal del año en las tarjetas. Es solo un detalle simpático: puedes desactivarlo."
    },
    {
      q: "¿Puedo guardar la tarjeta como imagen?",
      a: "Sí. «Guardar imagen» crea un PNG de 1080×1350 que queda genial en WhatsApp y en historias. En el móvil se abre el menú para compartir; en el ordenador se descarga."
    },
    {
      q: "¿Qué ve la persona que abre mi enlace?",
      a: "Primero ve un sobre cerrado; al tocarlo se abre y aparece tu tarjeta, con el saludo en su propio idioma. Después puede crear su propia tarjeta."
    },
    {
      q: "¿Dónde se guarda mi mensaje?",
      a: "Solo dentro del enlace y, mientras editas, en tu propio navegador. Nunca se envía a nuestro servidor, así que cualquiera con el enlace puede leerlo: compártelo solo con quien quieras."
    }
  ],
  privacy: {
    title: "Política de privacidad | Tarjeta de Año Nuevo 2027",
    description: "Política de privacidad de Tarjeta de Año Nuevo 2027: cómo se trata el texto de tu tarjeta, cookies, publicidad y estadísticas anónimas.",
    h1: "Política de privacidad",
    introHtml: "Tarjeta de Año Nuevo 2027 (el \"Servicio\") respeta tu privacidad y solo trata la información mínima descrita a continuación.",
    sections: [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Los nombres y el mensaje que escribes nunca se envían a un servidor. Se quedan en tu navegador (mientras editas se guarda un borrador en el almacenamiento local) y en la dirección del enlace cuando compartes. Es posible que se recopile cierta información de forma automática, como se describe a continuación."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa. Puedes rechazar o borrar las cookies en la configuración de tu navegador; algunas funciones podrían no funcionar como esperas."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Más información y preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (páginas vistas, tarjetas terminadas, valoraciones con estrellas). Nada de esto te identifica ni incluye tu mensaje."
      ],
      [
        "5. Enlaces compartidos e imágenes",
        "Los enlaces creados con «Compartir» contienen tu tarjeta codificada en la dirección, así que cualquiera que tenga el enlace puede verla. Las imágenes guardadas se crean en tu navegador. Evita poner direcciones, teléfonos u otros datos personales en el mensaje."
      ],
      [
        "6. Contacto",
        "Si tienes preguntas sobre esta política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "7. Fecha de entrada en vigor",
        "Esta política está vigente desde el 7 de noviembre de 2026."
      ]
    ],
    back: "← Volver a Tarjeta de Año Nuevo 2027"
  }
};
