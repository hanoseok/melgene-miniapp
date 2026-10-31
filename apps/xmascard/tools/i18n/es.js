/* Tarjeta de Navidad — Español (/es/). Misma estructura de claves que en.js. Deja {name} {greeting} {n} {max} tal cual. */
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
    title: "Tarjeta de Navidad para crear y enviar online",
    description: "Crea tu tarjeta de Navidad online: elige un tema y un saludo, escribe los nombres y un mensaje cariñoso, y guárdala como imagen o envía un enlace que se abre como un sobre.",
    ogTitle: "Crea tu tarjeta de Navidad 🎄",
    ogDescription: "Haz una tarjeta de Navidad bonita en un minuto y envíasela a quien más quieres."
  },
  siteName: "Tarjeta de Navidad",
  privacyLink: "Política de privacidad",
  start: {
    badge: "🎄 Especial fiestas",
    h1Kicker: "Tarjeta de Navidad",
    h1Html: "Manda un poco de<br><em>magia navideña</em>",
    hook: "Elige un diseño bonito, escribe unas palabras con cariño y envía una tarjeta que se abre como un sobre de verdad.",
    start: "Crear mi tarjeta →"
  },
  editor: {
    title: "Diseña tu tarjeta",
    themesAria: "Diseños de tarjeta",
    themes: {
      classic: "Clásica",
      snowy: "Noche nevada",
      golden: "Dorada",
      cute: "Tierna",
      minimal: "Minimalista",
      forest: "Bosque invernal"
    },
    previewAria: "Vista previa de tu tarjeta",
    greetingsLabel: "Saludo",
    decoLabel: "Adornos",
    decos: {
      snow: "Nieve",
      lights: "Luces",
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
        placeholder: "Escribe unas palabras bonitas…"
      }
    },
    ideas: "💡 Ideas",
    counter: "{n}/{max}",
    presets: [
      "Gracias por estar ahí todo el año. ¡Que pases una Navidad llena de risas, abrazos y turrón!",
      "Que estas fiestas te traigan calma, buena comida y mucho tiempo con tu gente.",
      "Aunque estemos lejos, te llevo en el corazón. ¡A ver si nos vemos pronto!",
      "Que el año que viene llegue cargado de salud, ilusión y buenos momentos.",
      "Come las uvas, pide tus deseos y disfruta, que te lo has ganado. ¡Felices fiestas!"
    ],
    defaultGreeting: "merry",
    done: "Terminar tarjeta"
  },
  card: {
    greetings: {
      merry: "¡Feliz Navidad!",
      holidays: "¡Felices fiestas!",
      newyear: "¡Feliz Año Nuevo!",
      seasons: "Paz y amor en Navidad"
    },
    to: "Para {name}",
    from: "Con cariño, {name}"
  },
  open: {
    eyebrow: "Te ha llegado una tarjeta de Navidad",
    fromName: "de {name}",
    fromNone: "de alguien que piensa en ti",
    open: "Abrir la tarjeta"
  },
  result: {
    eyebrowMine: "¡Tu tarjeta está lista!",
    eyebrowFriend: "Una tarjeta de {name}",
    eyebrowFriendNoName: "Una tarjeta solo para ti",
    imageAlt: "Tarjeta de Navidad: {greeting}",
    save: "Guardar imagen",
    saving: "Creando la imagen…",
    saved: "¡Imagen guardada!",
    saveFail: "No se pudo crear la imagen. Haz una captura de pantalla.",
    copyText: "Copiar texto",
    copied: "¡Texto copiado!",
    copyFail: "No se pudo copiar. Inténtalo de nuevo.",
    edit: "Editar",
    retry: "Hacer otra tarjeta",
    retryFriend: "Crear mi tarjeta",
    shareTitle: "Tarjeta de Navidad",
    shareText: "{name} te ha enviado una tarjeta de Navidad 🎄 Ábrela aquí:",
    shareTextNoName: "Te han enviado una tarjeta de Navidad 🎄 Ábrela aquí:",
    fileName: "tarjeta-de-navidad"
  },
  og: {
    brand: "🎄 Tarjeta de Navidad",
    defaultKicker: "Tarjeta de Navidad",
    defaultTitle: "Manda un poco de magia navideña",
    defaultDesc: "6 diseños · guárdala como imagen o envía un enlace",
    cardGreeting: "¡Feliz Navidad!"
  },
  faq: [
    {
      q: "¿Cómo hago mi tarjeta?",
      a: "Elige un diseño y un saludo, activa o quita la nieve, las luces y los brillos, y escribe para quién es, de quién y un mensaje corto. La vista previa cambia al instante; pulsa «Terminar tarjeta» cuando te guste."
    },
    {
      q: "¿Puedo guardar la tarjeta como imagen?",
      a: "Sí. «Guardar imagen» crea un PNG de 1080×1350, perfecto para WhatsApp o historias. En el móvil se abre el menú de compartir; en el ordenador se descarga."
    },
    {
      q: "¿Qué ve quien abre mi enlace?",
      a: "Primero ve un sobre cerrado; al tocarlo se abre y aparece tu tarjeta, con el saludo en su propio idioma. Después puede crear su propia tarjeta."
    },
    {
      q: "¿Dónde se guarda mi mensaje?",
      a: "Solo dentro del enlace y, mientras escribes, en tu propio navegador. Nunca se envía a nuestro servidor, pero cualquiera con el enlace puede leerlo, así que compártelo solo con quien quieras."
    }
  ],
  privacy: {
    title: "Política de privacidad | Tarjeta de Navidad",
    description: "Política de privacidad de Tarjeta de Navidad: cómo se trata el texto de tu tarjeta, cookies, publicidad y estadísticas anónimas.",
    h1: "Política de privacidad",
    introHtml: "Tarjeta de Navidad (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    sections: [
      [
        "1. Información que recogemos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Los nombres y el mensaje que escribes nunca se envían a un servidor: se quedan en tu navegador (mientras editas se guarda un borrador en el almacenamiento local) y en la URL cuando compartes. Alguna información puede recogerse automáticamente durante el uso, como se explica abajo."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa. Puedes rechazar o borrar las cookies en los ajustes del navegador; en ese caso, algunas funciones podrían no ir como se espera."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores. Más información y preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (visitas, tarjetas terminadas, valoraciones). Nada de esto te identifica ni incluye tu mensaje."
      ],
      [
        "5. Enlaces compartidos e imágenes",
        "Los enlaces creados con «Compartir» contienen tu tarjeta codificada en la URL, así que cualquiera que tenga el enlace puede verla. Las imágenes se crean dentro de tu navegador. Evita poner direcciones, teléfonos u otros datos personales en el mensaje."
      ],
      [
        "6. Contacto",
        "Si tienes dudas sobre esta política, ponte en contacto con el responsable del sitio."
      ],
      [
        "7. Fecha de entrada en vigor",
        "Esta política se aplica desde el 1 de noviembre de 2026."
      ]
    ],
    back: "← Volver a Tarjeta de Navidad"
  }
};
