/* Tallar calabaza de Halloween online — español (/es/)
 * Misma estructura de claves que en.js. Los dibujos y la cantidad de piezas están en pumpkin-core.js.
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
    title: 'Tallar calabaza de Halloween online',
    description: 'Tallar una calabaza de Halloween online: elige ojos, nariz y boca, enciende la vela y crea tu propia calabaza iluminada. Gratis, sin descargas, en un minuto.',
    ogTitle: 'Tallar calabaza de Halloween online 🎃',
    ogDescription: 'Crea tu propia calabaza de Halloween en un minuto, enciende la vela y envíasela a un amigo.',
  },
  siteName: 'Calabaza de Halloween',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🎃 Especial Halloween',
    h1Kicker: 'Tallar calabaza de Halloween',
    h1Html: 'Talla tu propia<br><em>calabaza</em> de Halloween',
    hook: 'Sin cuchillo y sin ensuciar nada. Dale una cara a tu calabaza, enciende la vela y mírala brillar.',
    start: 'Empezar a tallar →',
  },

  editor: {
    title: 'Talla tu calabaza',
    hint: 'Truco: toca la calabaza para probar la siguiente',
    previewAria: 'Tu calabaza. Tócala para probar la siguiente opción',
    tabsAria: 'Partes de la calabaza',
    tabs: { shape: 'Forma', color: 'Color', eyes: 'Ojos', nose: 'Nariz', mouth: 'Boca', stem: 'Tallo', extra: 'Extras' },
    optionAria: '{part} {n}',
    glow: 'Vela',
    night: 'Noche',
    nameLabel: 'Ponle nombre (opcional)',
    namePlaceholder: 'p. ej., Don Sonrisas',
    random: 'Aleatorio',
    done: '¡Listo!',
  },

  result: {
    eyebrowMine: '¡Tu calabaza de Halloween está lista!',
    eyebrowFriend: 'Un amigo talló esta calabaza para ti',
    untitled: 'Mi calabaza',
    imageAlt: 'Calabaza de Halloween: {name}',
    save: 'Guardar imagen',
    saving: 'Creando la imagen…',
    saved: '¡Imagen guardada!',
    saveFail: 'No se pudo crear la imagen. Mejor haz una captura de pantalla.',
    edit: 'Seguir editando',
    retry: 'Tallar otra calabaza',
    retryFriend: 'Tallar mi propia calabaza',
    shareTitle: 'Tallar calabaza de Halloween online',
    shareText: 'Tallé una calabaza de Halloween llamada «{name}» 🎃 ¡Talla la tuya!',
    shareTextNoName: 'Tallé mi propia calabaza de Halloween 🎃 ¡Talla la tuya!',
    fileName: 'mi-calabaza',
  },

  og: {
    brand: '🎃 Calabaza de Halloween',
    defaultKicker: 'Tallar calabaza online',
    defaultTitle: 'Talla tu propia calabaza de Halloween',
    defaultDesc: 'Ojos, nariz, boca y luz de vela · gratis en tu navegador',
  },

  faq: [
    { q: '¿Cómo tallo mi calabaza?', a: 'Elige una pestaña (forma, color, ojos, nariz, boca, tallo o extras) y toca una opción. Si tocas la calabaza pasa a la siguiente opción, y «Aleatorio» lo mezcla todo. Cuando te guste, toca «¡Listo!».' },
    { q: '¿Puedo guardar mi calabaza como imagen?', a: 'Sí. «Guardar imagen» convierte tu calabaza en un PNG. En el móvil puedes guardarla en tus fotos desde el menú de compartir; en el ordenador se descarga.' },
    { q: '¿Cómo funciona el enlace para compartir?', a: 'Todo tu diseño, incluido el nombre, va dentro del propio enlace. Quien lo abra verá exactamente la misma calabaza y luego podrá tallar la suya. No guardamos nada en nuestros servidores.' },
    { q: '¿Para qué sirven los interruptores Vela y Noche?', a: 'La vela ilumina las partes talladas con un brillo cálido, como una vela de verdad dentro. Apágala para verla de día. El interruptor Noche cambia el fondo entre un cielo estrellado y un fondo claro.' },
  ],

  privacy: {
    title: 'Política de privacidad | Calabaza de Halloween',
    description: 'Política de privacidad de Calabaza de Halloween: cómo se trata tu diseño, cookies, publicidad y estadísticas anónimas.',
    h1: 'Política de privacidad',
    introHtml: 'Calabaza de Halloween (el "Servicio") respeta tu privacidad y procesa solo la información mínima descrita a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. Tu calabaza y su nombre nunca se envían a un servidor: permanecen en tu navegador (y en la URL cuando la compartes). Alguna información puede recopilarse automáticamente mientras usas el Servicio, como se describe a continuación.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazar o eliminar las cookies en la configuración de tu navegador; algunas funciones podrían no funcionar como se espera si lo haces.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores. Puedes obtener más información y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio, podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (páginas vistas, calabazas terminadas, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Enlaces compartidos e imágenes', 'Los enlaces creados con "Compartir" contienen tu diseño y el nombre que escribiste, codificados en la URL. Las imágenes guardadas se crean en tu navegador. Evita usar como nombre información que te identifique personalmente.'],
      ['6. Contacto', 'Si tienes preguntas sobre esta política, contacta con el operador del Servicio.'],
      ['7. Fecha de vigencia', 'Esta política entra en vigor el 28 de septiembre de 2026.'],
    ],
    back: '← Volver a Calabaza de Halloween',
  },
};
