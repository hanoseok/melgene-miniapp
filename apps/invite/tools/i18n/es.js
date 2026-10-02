/* Invitación de fiesta de Halloween — Español
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Invitación fiesta de Halloween – crea la tuya",
    description: "Crea tu invitación de fiesta de Halloween: nombre, fecha, hora y lugar, con tema de fantasma, calabaza, murciélago o bruja. Guarda la imagen o comparte el enlace. Gratis.",
    ogTitle: "Invitación de fiesta de Halloween 🎃",
    ogDescription: "Crea una invitación de Halloween escalofriante en un minuto y mándasela a tus invitados."
  },
  siteName: "Invitación de fiesta de Halloween",
  privacyLink: "Política de privacidad",
  start: {
    badge: "🎃 Especial Halloween",
    h1Kicker: "Invitación fiesta de Halloween",
    h1Html: "Invita a tus amigos a<br><em>tu fiesta de terror</em>",
    hook: "Ponle nombre a tu fiesta, elige un tema espeluznante y envía una invitación que a todos les dé ganas de abrir.",
    start: "Crear mi invitación →"
  },
  editor: {
    title: "Diseña tu invitación",
    themesAria: "Temas de invitación",
    themes: {
      ghost: "Fantasma",
      pumpkin: "Calabaza",
      bat: "Murciélago",
      witch: "Bruja",
      spider: "Araña"
    },
    previewAria: "Vista previa de tu invitación",
    fields: {
      title: {
        label: "Nombre de la fiesta",
        placeholder: "p. ej. Fiesta en la casa encantada"
      },
      date: {
        label: "Fecha"
      },
      time: {
        label: "Hora"
      },
      place: {
        label: "Lugar",
        placeholder: "p. ej. Mi casa, 3.º piso"
      },
      note: {
        label: "Unas palabras para los invitados",
        placeholder: "p. ej. ¡Disfraz obligatorio!"
      }
    },
    done: "Crear invitación"
  },
  card: {
    invited: "¡Estás invitado!",
    defaultTitle: "Fiesta de Halloween"
  },
  result: {
    eyebrowMine: "¡Tu invitación está lista!",
    eyebrowFriend: "Has recibido una invitación",
    imageAlt: "Invitación: {title}",
    save: "Guardar imagen",
    saving: "Creando la imagen…",
    saved: "¡Imagen guardada!",
    saveFail: "No se pudo crear la imagen. Prueba con una captura de pantalla.",
    copyText: "Copiar texto",
    copied: "¡Texto copiado!",
    copyFail: "No se pudo copiar. Inténtalo de nuevo.",
    edit: "Editar",
    retry: "Crear otra invitación",
    retryFriend: "Crear mi propia invitación",
    shareTitle: "Invitación de fiesta de Halloween",
    shareText: "¡Estás invitado a «{title}»! 🎃 Abre la invitación:",
    shareTextNoTitle: "¡Estás invitado a mi fiesta de Halloween! 🎃 Abre la invitación:",
    fileName: "party-invitation"
  },
  og: {
    brand: "🎃 Invitación de Halloween",
    defaultKicker: "Fiesta de Halloween",
    defaultTitle: "Crea tu invitación de fiesta",
    defaultDesc: "Elige un tema espeluznante · guarda la imagen o comparte el enlace",
    cardTitle: "Fiesta de Halloween"
  },
  faq: [
    {
      q: "¿Cómo hago mi invitación?",
      a: "Elige un tema, escribe el nombre de la fiesta, la fecha, la hora, el lugar y unas palabras para los invitados, y pulsa «Crear invitación». Todos los campos son opcionales y la vista previa cambia mientras escribes."
    },
    {
      q: "¿Puedo guardar la invitación como imagen?",
      a: "Sí. «Guardar imagen» crea un PNG que puedes enviar por cualquier chat. En el móvil se abre el menú de compartir y en el ordenador se descarga."
    },
    {
      q: "¿Cómo funciona el enlace para compartir?",
      a: "La invitación entera va dentro del propio enlace, así que quien lo abra verá exactamente la misma tarjeta. No guardamos nada en nuestros servidores y abrir un enlace no cambia tu propia invitación."
    },
    {
      q: "¿Puedo enviar solo el texto?",
      a: "Sí. «Copiar texto» copia el nombre de la fiesta, la fecha, la hora, el lugar, tu mensaje y el enlace, listo para pegar en cualquier mensaje."
    }
  ],
  privacy: {
    title: "Política de privacidad | Invitación de fiesta de Halloween",
    description: "Política de privacidad de Invitación de fiesta de Halloween: cómo se tratan los datos de tu invitación, cookies, publicidad y estadísticas anónimas.",
    h1: "Política de privacidad",
    introHtml: "Invitación de fiesta de Halloween (el \"Servicio\") respeta tu privacidad y procesa solo la información mínima descrita a continuación.",
    sections: [
      [
        "1. Información que recopilamos",
        "El Servicio funciona sin cuenta ni inicio de sesión. El nombre de la fiesta, la fecha, la hora, el lugar y el mensaje que escribes nunca se envían a un servidor: permanecen en tu navegador (y en la URL cuando compartes). Alguna información puede recopilarse automáticamente mientras usas el Servicio, como se describe a continuación."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazar o eliminar las cookies en la configuración de tu navegador; algunas funciones podrían no funcionar como se espera si lo haces."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores. Puedes obtener más información y cambiar tus preferencias en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio, podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, invitaciones terminadas, valoraciones). Nada de esto te identifica personalmente."
      ],
      [
        "5. Enlaces compartidos e imágenes",
        "Los enlaces creados con \"Compartir\" contienen los datos de tu invitación, codificados en la URL. Las imágenes guardadas se crean en tu navegador. Evita escribir en el lugar tu dirección exacta u otra información que te identifique personalmente."
      ],
      [
        "6. Contacto",
        "Si tienes preguntas sobre esta política, contacta con el operador del Servicio."
      ],
      [
        "7. Fecha de vigencia",
        "Esta política entra en vigor el 3 de octubre de 2026."
      ]
    ],
    back: "← Volver a la invitación"
  }
};
