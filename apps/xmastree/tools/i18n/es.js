/* Decorar el árbol de Navidad — Español (/es/). Misma estructura de claves que en.js. Mantén {name} {n} {max} tal cual.
 * Interfaz con tuteo, como la Tarjeta de Navidad. */
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
    title: "Decorar el árbol de Navidad online",
    description: "Decora el árbol de Navidad online: elige tu árbol, cuelga bolas, estrellas y bastones de caramelo, enciende las luces y la nieve, y guarda o comparte tu árbol.",
    ogTitle: "Decora tu árbol de Navidad 🎄",
    ogDescription: "Cuelga adornos, enciende las luces y comparte tu propio árbol de Navidad en un minuto."
  },
  siteName: "Decorar el árbol de Navidad",
  privacyLink: "Política de privacidad",
  start: {
    badge: "🎄 Especial Navidad",
    h1Kicker: "Decorar el árbol de Navidad",
    h1Html: "Tu árbol<br><em>lleno de luz</em>",
    hook: "Cuelga bolas y bastones de caramelo, enciende las luces, haz que nieve y envía tu árbol a alguien a quien quieras.",
    start: "Empezar a decorar →"
  },
  editor: {
    title: "Decora tu árbol",
    canvasAria: "Tu árbol de Navidad. Toca para colgar el adorno elegido y arrastra un adorno para moverlo.",
    hint: "Toca el árbol para colgar un adorno · arrastra para moverlo",
    paletteLabel: "Adornos",
    kinds: {
      red: "Bola roja",
      gold: "Bola dorada",
      blue: "Bola azul",
      purple: "Bola morada",
      silver: "Bola plateada",
      star: "Estrella",
      bell: "Campana",
      cane: "Bastón de caramelo",
      gift: "Regalo",
      bow: "Lazo",
      sock: "Calcetín",
      flake: "Copo de nieve",
      cookie: "Galleta",
      erase: "Borrador"
    },
    undo: "Deshacer",
    clear: "Borrar todo",
    auto: "Sorpréndeme",
    count: "{n}/{max} adornos",
    full: "¡Tu árbol está lleno! Mueve o borra antes algún adorno.",
    styleLabel: "Árbol",
    styles: {
      classic: "Clásico",
      snowy: "Nevado",
      nordic: "Nórdico",
      pink: "Rosa"
    },
    bgLabel: "Fondo",
    bgs: {
      night: "Noche clara",
      cozy: "Salón cálido",
      snowfield: "Campo nevado",
      red: "Rojo festivo"
    },
    topperLabel: "Cima del árbol",
    toppers: {
      none: "Ninguno",
      star: "Estrella",
      angel: "Ángel",
      bow: "Lazo"
    },
    extrasLabel: "Extras",
    snow: "Nieve",
    lights: "Luces",
    fields: {
      name: {
        label: "Tu nombre",
        placeholder: "p. ej. Lucía"
      },
      message: {
        label: "Mensaje corto",
        placeholder: "p. ej. ¡Feliz Navidad!"
      }
    },
    ideas: "💡 Ideas",
    counter: "{n}/{max}",
    presets: [
      "¡Feliz Navidad y próspero Año Nuevo!",
      "Que no falten turrón, risas y abrazos 🎄",
      "Paz y cariño en estas fiestas",
      "Que los Reyes te traigan mucha ilusión ✨",
      "¡Felices fiestas, de nuestro Belén a tu casa!"
    ],
    done: "Terminar mi árbol"
  },
  card: {
    by: "Decorado por {name}"
  },
  result: {
    eyebrowMine: "¡Tu árbol está listo!",
    eyebrowFriend: "{name} ha decorado este árbol para ti",
    eyebrowFriendNoName: "Alguien ha decorado este árbol para ti",
    imageAlt: "Árbol de Navidad decorado con {n} adornos",
    save: "Guardar imagen",
    saving: "Creando tu imagen…",
    saved: "¡Imagen guardada!",
    saveFail: "No se pudo crear la imagen. Prueba a hacer una captura de pantalla.",
    edit: "Seguir decorando",
    retry: "Decorar otro árbol",
    retryFriend: "Decorar mi propio árbol",
    shareTitle: "Decorar el árbol de Navidad",
    shareText: "{name} ha decorado un árbol de Navidad 🎄 Échale un vistazo:",
    shareTextNoName: "Mira el árbol de Navidad que he decorado 🎄",
    fileName: "christmas-tree"
  },
  og: {
    brand: "🎄 Decorar el árbol de Navidad",
    defaultKicker: "Decorar el árbol de Navidad",
    defaultTitle: "Tu árbol lleno de luz",
    defaultDesc: "Adornos · luces · nieve · guárdalo o compártelo"
  },
  faq: [
    {
      q: "¿Cómo cuelgo un adorno?",
      a: "Elige un adorno en la fila de debajo del árbol y toca cualquier parte del árbol. Para moverlo, mantenlo pulsado y arrástralo. Con el borrador quitas un solo adorno, y con Deshacer vuelves un paso atrás."
    },
    {
      q: "¿Puedo cambiar el árbol después de poner adornos?",
      a: "Sí. Puedes cambiar la forma del árbol, el fondo y la cima, y encender o apagar la nieve y las luces cuando quieras. Tus adornos se quedan justo donde los pusiste."
    },
    {
      q: "¿Cómo guardo o envío mi árbol?",
      a: "Toca «Terminar mi árbol». «Guardar imagen» crea un PNG de 1080×1350, y los botones de compartir envían un enlace. Quien lo abra verá tu árbol con las luces parpadeando y podrá decorar el suyo."
    },
    {
      q: "¿Dónde se guarda mi árbol?",
      a: "Tus adornos, tu nombre y tu mensaje viven solo en el enlace y, mientras decoras, en tu propio navegador. Nunca se envían a nuestro servidor, así que cualquiera que tenga el enlace puede verlos."
    }
  ],
  privacy: {
    title: "Política de privacidad | Decorar el árbol de Navidad",
    description: "Política de privacidad de Decorar el árbol de Navidad: cómo se tratan tu árbol, tu nombre y tu mensaje, cookies, publicidad y estadísticas anónimas.",
    h1: "Política de privacidad",
    introHtml: "Decorar el árbol de Navidad (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    sections: [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Tu árbol, el nombre y el mensaje que escribes nunca se envían a un servidor. Se quedan en tu navegador (mientras decoras se guarda un borrador en el almacenamiento local) y en la URL cuando compartes. Durante el uso del Servicio se puede recopilar cierta información de forma automática, como se explica a continuación."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies para mostrar anuncios y entender cómo se utiliza. Puedes rechazar o eliminar las cookies en la configuración de tu navegador; si lo haces, es posible que algunas funciones no se comporten como se espera."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Más información y preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y nuestros propios contadores agregados, que solo guardan totales diarios por idioma (páginas vistas, árboles terminados, valoraciones con estrellas). Nada de esto te identifica personalmente ni incluye tu nombre o tu mensaje."
      ],
      [
        "5. Enlaces compartidos e imágenes",
        "Los enlaces creados con «Compartir» contienen tu árbol codificado en la URL, de modo que cualquiera que tenga el enlace puede verlo. Las imágenes guardadas se crean dentro de tu navegador. Evita poner direcciones, números de teléfono u otros datos personales en tu mensaje."
      ],
      [
        "6. Contacto",
        "Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "7. Fecha de entrada en vigor",
        "Esta política se aplica desde el 5 de noviembre de 2026."
      ]
    ],
    back: "← Volver a Decorar el árbol de Navidad"
  }
};
