/* Crear copos de nieve — español (copia /es/). Mismas claves que en.js. Redacción natural, no traducción literal.
 * Las claves que terminan en Html se insertan tal cual (solo <br> y <em>). */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Nunito'",
    scriptWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Crear copos de nieve online · Snowflake Maker",
    description: "Crea tu propio copo de nieve simétrico online. Ajusta las ramas, el detalle y el tamaño, elige la forma y el color, y guarda una imagen PNG de 1080 × 1080 o comparte un enlace.",
    ogTitle: "Crea un copo de nieve ❄️",
    ogDescription: "Con unos toques, un copo de nieve de seis puntas simétrico va tomando forma. Guárdalo o envíaselo a tus amigos."
  },
  siteName: "Snowflake Maker",
  privacyLink: "Política de privacidad",
  start: {
    badge: "❄️ Especial de invierno",
    h1Kicker: "Crear copos de nieve online",
    h1Html: "Haz crecer un copo<br><em>solo tuyo</em>",
    hook: "Toca unas cuantas veces y mira cómo se forma un copo perfectamente simétrico. Guárdalo como imagen o envía el enlace a un amigo.",
    start: "Empezar a crear →"
  },
  editor: {
    title: "Crea tu copo de nieve",
    canvasAria: "Vista previa de tu copo de nieve",
    labels: {
      arms: "Ramas por lado",
      complexity: "Detalle",
      size: "Largo de las ramas"
    },
    levels: {
      complexity: ["Sencillo", "Medio", "Detallado"],
      size: ["Cortas", "Medias", "Largas"]
    },
    buttons: {
      newFlake: "Nuevo copo",
      shape: "Cambiar forma",
      color: "Cambiar color",
      save: "Guardar PNG",
      share: "Compartir",
      done: "Listo, ver mi copo"
    },
    shapes: {
      needle: "Agujas",
      plate: "Placas",
      spike: "Púas",
      feather: "Plumas"
    },
    palettes: ["Azul hielo", "Blanco escarchado", "Lila", "Oro de medianoche", "Menta"],
    status: {
      copied: "¡Enlace copiado!",
      copyFail: "No se pudo copiar el enlace. Prueba a guardar el PNG.",
      shared: "¡Compartido!",
      saving: "Creando tu imagen…",
      saved: "¡Imagen guardada!",
      saveFail: "No se pudo crear la imagen. Prueba con una captura de pantalla."
    }
  },
  result: {
    eyebrowMine: "¡Tu copo de nieve está listo!",
    eyebrowFriend: "Un amigo creó este copo de nieve para ti",
    save: "Guardar PNG",
    edit: "Seguir creando",
    retry: "Crear un copo nuevo",
    retryFriend: "Crear el mío",
    shareTitle: "Snowflake Maker",
    shareText: "Mira el copo de nieve que hice ❄️ Abre el enlace para verlo:",
    fileName: "copo-de-nieve"
  },
  og: {
    brand: "❄️ Snowflake Maker",
    defaultKicker: "Crear copos de nieve online",
    defaultTitle: "Haz crecer un copo solo tuyo",
    defaultDesc: "Seis puntas · formas · colores · guardar o compartir"
  },
  faq: [
    {
      q: "¿Cómo se crea un copo de nieve?",
      a: "Toca «Nuevo copo» para obtener un diseño nuevo y luego usa los tres controles para las ramas, el detalle y el largo. Cada copo es una sola rama copiada seis veces y reflejada, así que siempre se ve simétrico."
    },
    {
      q: "¿Para qué sirven los botones de forma y color?",
      a: "«Cambiar forma» cambia el dibujo de las ramas entre agujas, placas, púas o plumas, y mantiene el mismo diseño. «Cambiar color» cambia el fondo y el color de las líneas. Puedes probar ambos en el mismo copo."
    },
    {
      q: "¿Cómo guardo o comparto mi copo?",
      a: "«Guardar PNG» descarga una imagen de 1080 × 1080. «Compartir» crea un enlace con tus ajustes; quien lo abra verá el mismo copo."
    },
    {
      q: "¿Se guarda mi copo en algún sitio?",
      a: "No. El copo solo existe en la imagen y en el enlace. Lo que creas no se sube a nuestro servidor cuando guardas o compartes."
    }
  ],
  privacy: {
    title: "Política de privacidad | Snowflake Maker",
    description: "Política de privacidad de Snowflake Maker: cómo se trata tu copo de nieve, las cookies, la publicidad y las estadísticas anónimas.",
    h1: "Política de privacidad",
    introHtml: "Snowflake Maker (el «Servicio») respeta tu privacidad y solo trata la información mínima descrita a continuación.",
    sections: [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Los ajustes de tu copo nunca se envían a un servidor. Se quedan en tu navegador y en el enlace cuando lo compartes. Durante el uso del Servicio podría recopilarse cierta información de forma automática, como se describe a continuación."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies para mostrar anuncios y entender cómo se utiliza. Puedes rechazar o borrar las cookies en la configuración de tu navegador; si lo haces, algunas funciones podrían no funcionar como se espera."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y a otros sitios web. Puedes saber más y cambiar tus preferencias en <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y nuestros propios contadores agregados, que solo guardan totales diarios por idioma (visitas a páginas, copos terminados). Nada de esto te identifica personalmente."
      ],
      [
        "5. Enlaces e imágenes compartidas",
        "Un enlace creado con «Compartir» contiene los ajustes de tu copo dentro de la URL, por lo que cualquiera que tenga el enlace puede ver el mismo copo. Las imágenes guardadas se crean en tu navegador y no se suben a nuestros servidores."
      ],
      [
        "6. Contacto",
        "Si tienes preguntas sobre esta Política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "7. Fecha de entrada en vigor",
        "Esta política entra en vigor el 11 de noviembre de 2026."
      ]
    ],
    back: "← Volver a Snowflake Maker"
  }
};
