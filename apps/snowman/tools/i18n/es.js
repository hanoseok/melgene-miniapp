/* Muñeco de nieve — Español (/es/). Misma estructura de claves que en.js. Mantén {name} {n} {max} tal cual.
 * Interfaz con tuteo. */
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
    title: "Muñeco de nieve online: crea el tuyo en un minuto",
    description: "Haz un muñeco de nieve online: apila las bolas, elige ojos, nariz de zanahoria, sombrero, bufanda y brazos, ponle nombre y guarda la imagen o comparte el enlace.",
    ogTitle: "Haz tu muñeco de nieve ⛄",
    ogDescription: "Rueda, apila y viste a tu propio muñeco de nieve en un minuto y envíaselo a un amigo."
  },
  siteName: "Muñeco de nieve",
  privacyLink: "Política de privacidad",
  start: {
    badge: "⛄ Especial invierno",
    h1Kicker: "Hacer un muñeco de nieve",
    h1Html: "Rueda, apila y<br><em>viste a tu muñeco</em>",
    hook: "Sin guantes ni frío. Elige cada pieza, mira cómo cae la nieve y envía tu muñeco a alguien que necesite una sonrisa.",
    start: "Empezar a construir →"
  },
  editor: {
    title: "Haz tu muñeco de nieve",
    canvasAria: "Vista previa de tu muñeco de nieve en un paisaje de invierno",
    stepOf: "Paso {n} de {max}",
    steps: {
      body: "Cuerpo",
      face: "Cara",
      nose: "Nariz",
      hat: "Sombrero",
      scarf: "Bufanda",
      arms: "Brazos",
      extras: "Extras",
      scene: "Fondo",
      name: "Nombre"
    },
    labels: {
      body: "Bolas de nieve",
      eyes: "Ojos",
      mouth: "Boca",
      nose: "Nariz",
      hat: "Sombrero",
      scarf: "Color de la bufanda",
      pattern: "Estampado",
      arms: "Brazos",
      extras: "Extras (los que quieras)",
      scene: "Fondo",
      name: "Nombre (opcional)"
    },
    bodies: {
      classic: "Clásico",
      duo: "Dos bolas",
      chubby: "Regordete",
      slim: "Esbelto"
    },
    eyes: {
      coal: "Carbón",
      buttons: "Botones",
      sparkly: "Brillantes",
      sleepy: "Dormilones"
    },
    mouths: {
      pebbles: "Piedrecitas",
      smile: "Sonrisa",
      grin: "Sonrisón",
      oh: "¡Oh!"
    },
    noses: {
      carrot: "Zanahoria",
      long: "Zanahoria XL",
      berry: "Baya",
      pinecone: "Piña"
    },
    hats: {
      top: "Chistera",
      beanie: "Gorro",
      santa: "Gorro Noel",
      bucket: "Cubo",
      earmuffs: "Orejeras",
      none: "Sin sombrero"
    },
    scarves: {
      red: "Roja",
      green: "Verde",
      blue: "Azul",
      yellow: "Amarilla",
      purple: "Morada",
      none: "Sin bufanda"
    },
    patterns: {
      solid: "Lisa",
      stripes: "Rayas",
      dots: "Lunares"
    },
    arms: {
      twigs: "Ramitas",
      mittens: "Manoplas",
      wave: "Saludando",
      none: "Sin brazos"
    },
    extras: {
      broom: "Escoba",
      buttons: "Botones",
      bird: "Pajarito",
      flakes: "Destellos"
    },
    scenes: {
      night: "Noche nevada",
      sunny: "Día soleado",
      village: "Pueblo"
    },
    random: "Sorpréndeme",
    back: "← Atrás",
    next: "Siguiente →",
    done: "Terminar mi muñeco",
    namePlaceholder: "p. ej. Bolita",
    ideas: "💡 Ideas",
    counter: "{n}/{max}",
    namePresets: [
      "Bolita",
      "Don Escarcha",
      "Copito",
      "Señor Tiritón",
      "Botoncito"
    ]
  },
  card: {
    named: "¡Te presento a {name}!"
  },
  result: {
    eyebrowMine: "¡Tu muñeco de nieve está listo!",
    eyebrowFriend: "Alguien ha hecho a {name} solo para ti",
    eyebrowFriendNoName: "Alguien ha hecho un muñeco de nieve solo para ti",
    revealHint: "Todavía está cubierto de nieve fresca…",
    reveal: "❄️ Quitar la nieve",
    imageAlt: "Un muñeco de nieve en un paisaje de invierno",
    save: "Guardar imagen",
    saving: "Creando tu imagen…",
    saved: "¡Imagen guardada!",
    saveFail: "No se pudo crear la imagen. Prueba con una captura de pantalla.",
    edit: "Seguir creando",
    retry: "Hacer otro muñeco",
    retryFriend: "Hacer mi muñeco",
    shareTitle: "Muñeco de nieve",
    shareText: "Te presento a {name}, el muñeco de nieve que he hecho ⛄ Mira:",
    shareTextNoName: "Mira el muñeco de nieve que he hecho ⛄",
    fileName: "muneco-de-nieve"
  },
  og: {
    brand: "⛄ Muñeco de nieve",
    defaultKicker: "Hacer un muñeco de nieve",
    defaultTitle: "Rueda, apila y viste a tu muñeco",
    defaultDesc: "Sombreros · bufandas · nieve cayendo · guarda o comparte"
  },
  faq: [
    {
      q: "¿Cómo construyo mi muñeco de nieve?",
      a: "Sigue los pasos que hay bajo la imagen: bolas de nieve, cara, nariz, sombrero, bufanda, brazos, extras y fondo. Toca una opción para probarla y el muñeco cambia al instante. Puedes saltar de un paso a otro cuando quieras."
    },
    {
      q: "¿Qué hace «Sorpréndeme»?",
      a: "Elige por ti una combinación al azar de todas las piezas. Sigue tocando hasta que alguna te guste y luego cambia a mano cualquier pieza."
    },
    {
      q: "¿Cómo guardo o envío mi muñeco?",
      a: "Toca «Terminar mi muñeco». «Guardar imagen» crea un PNG de 1080×1350, y los botones de compartir envían un enlace. Quien lo abra quitará la nieve para conocer a tu muñeco y podrá hacer uno propio."
    },
    {
      q: "¿Dónde se guarda mi muñeco?",
      a: "Tus elecciones y el nombre viven solo en el enlace y, mientras construyes, en tu propio navegador. Nunca se envían a nuestro servidor, así que cualquiera que tenga el enlace puede verlos."
    }
  ],
  privacy: {
    title: "Política de privacidad | Muñeco de nieve",
    description: "Política de privacidad de Muñeco de nieve: cómo se tratan tu muñeco y su nombre, cookies, publicidad y estadísticas anónimas.",
    h1: "Política de privacidad",
    introHtml: "Muñeco de nieve (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    sections: [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Tu muñeco de nieve y el nombre que escribes nunca se envían a un servidor. Se quedan en tu navegador (mientras construyes se guarda un borrador en el almacenamiento local) y en la URL cuando compartes. Durante el uso del Servicio se puede recopilar cierta información de forma automática, como se explica a continuación."
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
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y nuestros propios contadores agregados, que solo guardan totales diarios por idioma (páginas vistas, muñecos terminados, valoraciones con estrellas). Nada de esto te identifica personalmente ni incluye el nombre de tu muñeco."
      ],
      [
        "5. Enlaces compartidos e imágenes",
        "Los enlaces creados con «Compartir» contienen tu muñeco codificado en la URL, de modo que cualquiera que tenga el enlace puede verlo. Las imágenes guardadas se crean dentro de tu navegador. Evita poner direcciones, números de teléfono u otros datos personales en el nombre."
      ],
      [
        "6. Contacto",
        "Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "7. Fecha de entrada en vigor",
        "Esta política se aplica desde el 9 de noviembre de 2026."
      ]
    ],
    back: "← Volver a Muñeco de nieve"
  }
};
