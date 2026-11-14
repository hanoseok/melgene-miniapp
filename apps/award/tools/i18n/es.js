/* Crear diploma — español (es/). Misma estructura de claves que en.js; ver notas al inicio de en.js. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Playfair+Display:wght@700;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    serif: "'Playfair Display'",
    serifWeight: 700,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Crear diploma online: diplomas divertidos gratis",
    description: "Crear diploma online: escribe el premio y el motivo, elige marco y sello, y haz un diploma divertido o de agradecimiento. Guárdalo en A4 o envía un enlace con ceremonia.",
    ogTitle: "Crear diploma 🏆",
    ogDescription: "Haz un diploma divertido o emotivo en un minuto y entrégalo con un enlace."
  },
  siteName: "Crear diploma",
  privacyLink: "Privacidad",
  start: {
    badge: "🏆 Temporada de premios de fin de año",
    h1Kicker: "Crear diploma",
    h1Html: "Alguien se merece<br><em>un premio</em>",
    hook: "Ponle nombre al premio, cuenta por qué lo ganó y envía un enlace que se abre como una entrega de verdad.",
    start: "Crear diploma →"
  },
  editor: {
    title: "Diseña el diploma",
    themesAria: "Diseños de diploma",
    themes: {
      gold: "Marco dorado",
      pastel: "Pastel tierno",
      minimal: "Minimalista",
      ribbon: "Cinta retro"
    },
    previewAria: "Vista previa del diploma",
    examplesAria: "Ideas de nombre del premio",
    sealLabel: "Sello",
    seals: {
      none: "Ninguno",
      red: "Sello rojo",
      gold: "Medalla"
    },
    fields: {
      title: {
        label: "Nombre del premio",
        placeholder: "p. ej. Compañero del año"
      },
      to: {
        label: "Para",
        placeholder: "p. ej. Lucía"
      },
      reason: {
        label: "Por qué lo gana",
        placeholder: "Por…"
      },
      date: {
        label: "Fecha"
      },
      issuer: {
        label: "Entregado por",
        placeholder: "p. ej. El comité del café"
      }
    },
    titleExamples: [
      "Compañero del año",
      "Rey de los snacks",
      "Premio al buen rollo",
      "Campeón de la siesta"
    ],
    dice: "🎲 Al azar",
    counter: "{n}/{max}",
    reasons: [
      "Por mantener vivo el grupo de WhatsApp todo el año con memes de primerísima calidad.",
      "Por saludar con una sonrisa incluso los lunes por la mañana.",
      "Por compartir los snacks del cajón sin pedir nada a cambio.",
      "Por ser el primero en decir «yo me encargo» y el último en irse tras recoger.",
      "Por reírse de nuestros chistes, incluso la tercera vez que los contamos.",
      "Por acordarse de cumpleaños, cafés favoritos y todos los pequeños detalles.",
      "Por una calma olímpica ante atascos de impresora, retrasos y tostadas quemadas.",
      "Por ceder la última galleta cuando nadie se habría enterado.",
      "Por perderse siempre por el camino pero encontrar siempre el mejor sitio para comer.",
      "Por estar ahí, cada vez, justo cuando hacía falta.",
      "Por probar valientemente la receta nueva para que los demás no tuviéramos que hacerlo.",
      "Por demostrar todo el año que la amabilidad es un superpoder."
    ],
    done: "Terminar diploma"
  },
  card: {
    heading: "Diploma de reconocimiento",
    defaultTitle: "Premio a la excelencia",
    presented: "Se otorga con orgullo el presente diploma a",
    name: "{name}",
    closing: "En reconocimiento a lo anterior, se entrega este premio con todo nuestro cariño.",
    sealFallback: "★"
  },
  open: {
    eyebrow: "🏆 Entrega de premios",
    forName: "Un premio para {name}",
    forNone: "Un premio solo para ti",
    hint: "Toca el pergamino para desenrollarlo",
    open: "Desenrollar diploma"
  },
  result: {
    eyebrowMine: "¡Tu diploma está listo!",
    eyebrowFriend: "¡Felicidades, {name}!",
    eyebrowFriendNoName: "¡Felicidades!",
    imageAlt: "Diploma: {title}",
    save: "Guardar imagen",
    saving: "Creando la imagen…",
    saved: "¡Imagen guardada!",
    saveFail: "No se pudo crear la imagen. Prueba con una captura de pantalla.",
    edit: "Editar",
    retry: "Crear otro diploma",
    retryFriend: "Crear el mío",
    shareTitle: "Crear diploma",
    shareText: "Hay un premio para {name} 🏆 Abre la ceremonia aquí:",
    shareTextNoName: "Alguien te ha dado un premio 🏆 Abre la ceremonia aquí:",
    fileName: "diploma"
  },
  og: {
    brand: "🏆 Crear diploma",
    defaultKicker: "Crear diploma",
    defaultTitle: "Alguien se merece un premio",
    defaultDesc: "4 diseños · sello · imagen A4 o enlace con ceremonia",
    sampleTitle: "Rey de los snacks"
  },
  faq: [
    {
      q: "¿Cómo creo un diploma?",
      a: "Elige uno de los cuatro diseños, escribe el nombre del premio, de quién lo recibe y el motivo, y luego la fecha, quién lo entrega y el sello. La vista previa cambia mientras escribes. Cuando te guste, toca «Terminar diploma»."
    },
    {
      q: "¿De qué tamaño es la imagen?",
      a: "«Guardar imagen» crea un PNG de 1240×1754, con la forma de una hoja A4: se imprime bien y se ve nítido en el chat. En el móvil abre el menú de compartir; en el ordenador se descarga."
    },
    {
      q: "¿Qué ve quien abre mi enlace?",
      a: "Una pequeña entrega de premios: aparece un pergamino enrollado, lo toca y el diploma se desenrolla con su nombre. El título y la fecha salen en su idioma, y puede crear su propio diploma."
    },
    {
      q: "¿Dónde se guarda lo que escribo?",
      a: "Solo dentro del enlace y en tu propio navegador. No se envía nada a nuestro servidor, así que cualquiera con el enlace puede leer el diploma: compártelo solo con quien quieras."
    }
  ],
  privacy: {
    title: "Política de privacidad | Crear diploma",
    description: "Política de privacidad de Crear diploma: cómo se trata el texto que escribes, cookies, publicidad y estadísticas anónimas.",
    h1: "Política de privacidad",
    introHtml: "Crear diploma (el \"Servicio\") respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    sections: [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. El nombre del premio, los nombres, el motivo y la fecha que escribes nunca se envían a un servidor. Se quedan en tu navegador (mientras editas se guarda un borrador en el almacenamiento local) y en la URL cuando compartes. Alguna información puede recopilarse automáticamente, como se describe abajo."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa. Puedes rechazar o borrar las cookies en la configuración del navegador; algunas funciones podrían no ir bien."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Más información y preferencias en <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (visitas, diplomas terminados, valoraciones). Nada de esto te identifica ni incluye lo que escribiste."
      ],
      [
        "5. Enlaces compartidos e imágenes",
        "Los enlaces creados con «Compartir» llevan tu diploma codificado en la URL, así que cualquiera con el enlace puede verlo. Las imágenes se crean en tu navegador. Evita poner direcciones, teléfonos u otros datos personales en el diploma."
      ],
      [
        "6. Contacto",
        "Si tienes dudas sobre esta política, ponte en contacto con el responsable del sitio."
      ],
      [
        "7. Fecha de entrada en vigor",
        "Esta política se aplica desde el 15 de noviembre de 2026."
      ]
    ],
    back: "← Volver a Crear diploma"
  }
};
