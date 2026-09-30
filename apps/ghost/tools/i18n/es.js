/* Crea tu fantasma de Halloween — español (/es/)
 * Misma estructura de claves que en.js. Los dibujos y la cantidad de piezas están en ghost-core.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Crea tu fantasma de Halloween – fantasmita tierno',
    description: 'Crea tu fantasma de Halloween: elige la forma, los ojos, la boca y el sombrero de tu fantasmita tierno. Gratis, sin descargas y listo en 1 minuto. Guárdalo o compártelo.',
    ogTitle: 'Crea tu fantasma de Halloween 👻',
    ogDescription: 'Tu fantasmita tierno en un minuto: flota y se lo puedes mandar a tus amigos.',
  },
  siteName: 'Crea tu fantasma',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '👻 Especial Halloween',
    h1Kicker: 'Crea tu fantasma de Halloween',
    h1Html: 'Crea tu propio<br><em>fantasmita</em>',
    hook: 'Alguien tímido se esconde bajo esa sábana. Dale una carita y un poco de personalidad, y míralo flotar.',
    start: 'Crear mi fantasma →',
  },

  editor: {
    title: 'Diseña tu fantasma',
    hint: 'Consejo: toca el fantasma para ver el siguiente',
    previewAria: 'Tu fantasma. Tócalo para ver la siguiente opción',
    tabsAria: 'Partes del fantasma',
    tabs: { body: 'Cuerpo', color: 'Color', eyes: 'Ojos', mouth: 'Boca', cheeks: 'Mejillas', hat: 'Sombrero', item: 'En la mano', bg: 'Fondo' },
    optionAria: '{part} {n}',
    nameLabel: 'Ponle nombre (opcional)',
    namePlaceholder: 'p. ej. Bubú',
    random: 'Al azar',
    done: '¡Listo!',
  },

  result: {
    eyebrowMine: '¡Tu fantasma está listo para asustar!',
    eyebrowFriend: 'Alguien creó este fantasmita para ti',
    untitled: 'Mi fantasmita',
    imageAlt: 'Fantasma: {name}',
    save: 'Guardar imagen',
    saving: 'Creando tu imagen…',
    saved: '¡Imagen guardada!',
    saveFail: 'No se pudo crear la imagen. Prueba con una captura de pantalla.',
    edit: 'Seguir editando',
    retry: 'Crear otro fantasma',
    retryFriend: 'Crear mi propio fantasma',
    shareTitle: 'Crea tu fantasma de Halloween – fantasmita tierno',
    shareText: 'Te presento a mi fantasma «{name}» 👻 ¡Crea el tuyo!',
    shareTextNoName: 'Hice mi propio fantasmita 👻 ¡Crea el tuyo!',
    fileName: 'mi-fantasma',
  },

  og: {
    brand: '👻 Crea tu fantasma',
    defaultKicker: 'Fantasma de Halloween',
    defaultTitle: 'Crea tu propio fantasmita',
    defaultDesc: 'Caritas, sombreros y amiguitos · gratis',
  },

  faq: [
    { q: '¿Cómo creo mi fantasma?', a: 'Elige una pestaña arriba del editor y toca la opción que te guste. Si tocas el fantasma, pasa a la siguiente opción de esa pestaña, y «Al azar» lo mezcla todo. Cuando te guste, toca «¡Listo!».' },
    { q: '¿Puedo guardar mi fantasma como imagen?', a: 'Sí. «Guardar imagen» convierte tu fantasma en un PNG. En el celular puedes guardarlo en tus fotos desde el menú de compartir; en la computadora se descarga.' },
    { q: '¿Cómo funciona el enlace para compartir?', a: 'Todo tu fantasma, nombre incluido, va dentro del propio enlace. Quien lo abra verá exactamente el mismo fantasma y luego podrá crear el suyo. No guardamos nada en nuestros servidores.' },
    { q: '¿Por qué mi fantasma sube y baja?', a: '¡Porque los fantasmas flotan! Ese movimiento suave solo existe en la pantalla. Si tu dispositivo tiene activado reducir movimiento, el fantasma se queda quieto, y la imagen guardada siempre es fija.' },
  ],

  privacy: {
    title: 'Política de privacidad | Crea tu fantasma',
    description: 'Política de privacidad de Crea tu fantasma: cómo se trata tu diseño, cookies, publicidad y estadísticas anónimas.',
    h1: 'Política de privacidad',
    introHtml: 'Crea tu fantasma (el "Servicio") respeta tu privacidad y procesa solo la información mínima descrita a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Tu fantasma y su nombre nunca se envían a un servidor: permanecen en tu navegador (y en la URL cuando lo compartes). Alguna información puede recopilarse automáticamente mientras usas el Servicio, como se describe a continuación.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazar o eliminar las cookies en la configuración de tu navegador; algunas funciones podrían no funcionar como se espera si lo haces.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores. Puedes obtener más información y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio, podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, fantasmas terminados, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Enlaces compartidos e imágenes', 'Los enlaces creados con "Compartir" contienen tu diseño y el nombre que escribiste, codificados en la URL. Las imágenes guardadas se crean en tu navegador. Evita usar como nombre información que te identifique personalmente.'],
      ['6. Contacto', 'Si tienes preguntas sobre esta política, contacta con el operador del Servicio.'],
      ['7. Fecha de vigencia', 'Esta política entra en vigor el 1 de octubre de 2026.'],
    ],
    back: '← Volver a Crea tu fantasma',
  },
};
