/* Generador de códigos QR — Español (/es/)
 * El codificador está en qr-core.js; este archivo contiene todos los textos visibles. Misma estructura de claves que en.js.
 * Mantener {bytes} {v} {n} {ratio} {value} tal cual.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Generador de códigos QR gratis – wifi, PNG, SVG',
    description: 'Generador de códigos QR gratis para enlaces, texto, wifi, correo y teléfono. Elige colores, corrección de errores y tamaño, y descarga en PNG o SVG. Sin registro, todo en tu navegador.',
    ogTitle: 'Generador de códigos QR 🔳 gratis y privado',
    ogDescription: 'Un código QR para un enlace, wifi, correo o teléfono en segundos. Nada sale de tu navegador.',
  },
  siteName: 'Generador de códigos QR',
  privacyLink: 'Privacidad',
  fileName: 'codigo-qr',

  hero: {
    h1Kicker: 'Generador de códigos QR',
    h1Html: 'Escribe, <em>escanea</em><br>y comparte',
    hook: 'Enlaces, texto, wifi, correo o teléfono se convierten en código QR mientras escribes. Gratis, sin registro y hecho en tu propio navegador.',
  },

  ui: {
    typeLabel: '¿Qué guardará el código QR?',
    types: { link: 'Enlace', text: 'Texto', wifi: 'Wifi', email: 'Correo', phone: 'Llamar' },
    link: { label: 'Dirección web', placeholder: 'ejemplo.com/carta' },
    text: { label: 'Tu texto', placeholder: 'Una nota, un código, un mensaje corto…' },
    wifi: {
      ssid: 'Nombre de la red (SSID)', ssidPh: 'MOVISTAR_1234',
      password: 'Contraseña', passwordPh: 'Clave del wifi',
      security: 'Seguridad',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP (antiguo)', nopass: 'Sin contraseña' },
      hidden: 'Red oculta',
    },
    email: { to: 'Correo electrónico', toPh: 'nombre@ejemplo.com', subject: 'Asunto (opcional)', subjectPh: 'Hola', body: 'Mensaje (opcional)', bodyPh: 'Escribe un mensaje…' },
    phone: { label: 'Número de teléfono', placeholder: '+34 612 34 56 78' },

    previewLabel: 'Vista previa del código QR',
    previewReady: 'Vista previa del código QR, versión {v}',
    emptyPreview: 'Tu código QR aparece aquí mientras escribes',
    info: '{bytes} bytes · versión {v} · {n}×{n} módulos',
    encodes: 'Contenido: {value}',
    tooLong: 'Demasiado para un solo código QR. Acórtalo o elige una corrección más baja (L).',
    encodeFail: 'No se pudo crear este código QR. Prueba a cambiar el texto.',
    warnContrast: 'Poco contraste ({ratio}:1). Puede costar escanearlo: mejor código oscuro sobre fondo claro.',
    warnInverted: 'Código claro sobre fondo oscuro. Algunas apps no leen códigos invertidos.',
    warnQuiet: 'Un margen estrecho dificulta el escaneo. Deja al menos 2 módulos (4 es lo estándar).',

    downloadPng: 'Descargar PNG',
    downloadSvg: 'Descargar SVG',
    copyImage: 'Copiar imagen',
    savedPng: 'PNG guardado. Escanéalo una vez con el móvil antes de imprimir.',
    savedSvg: 'SVG guardado. Ideal para imprenta, nítido a cualquier tamaño.',
    copied: 'Imagen copiada. Pégala en un documento o un chat.',
    copyFail: 'Aquí no se pueden copiar imágenes. Usa Descargar PNG.',
    saveFail: 'No se pudo guardar. Inténtalo de nuevo.',

    options: '🎨 Colores, tamaño y corrección',
    colors: 'Colores',
    fg: 'Código',
    bg: 'Fondo',
    resetColors: 'Restablecer',
    ecc: 'Corrección de errores',
    eccHint: 'Los niveles altos aguantan rayones y logos, pero el código queda más denso. M sirve para casi todo.',
    size: 'Tamaño de la imagen',
    margin: 'Zona de silencio (margen)',
    marginHint: 'El borde vacío alrededor del código, en módulos. Lo estándar son 4.',
    localNote: '🔒 Hecho en tu navegador. Lo que escribes nunca se envía a ningún servidor.',
  },

  result: {
    doneTitle: 'Tu código QR está listo ✓',
    doneText: 'Pruébalo con la cámara de un móvil antes de imprimirlo o compartirlo. Cambia los campos de arriba cuando quieras para crear otro.',
    again: 'Crear otro código QR',
    shareTitle: 'Generador de códigos QR – gratis y privado',
    shareText: 'Crea un código QR para un enlace, wifi o texto en segundos, directamente en el navegador 🔳',
  },

  og: {
    brand: '🔳 Generador de códigos QR',
    kicker: 'Enlace · Wifi · Texto · PNG y SVG',
    title: 'Tu código QR en segundos',
    desc: 'Gratis, privado, hecho en tu navegador',
  },

  faq: [
    { q: '¿Lo que escribo se envía a algún sitio?', a: 'No. El código QR se calcula con JavaScript dentro de tu navegador, así que enlaces, contraseñas de wifi y mensajes nunca llegan a un servidor. Tampoco se guardan: al cerrar la página desaparecen.' },
    { q: '¿Los códigos QR caducan?', a: 'No. Son códigos QR estáticos: el contenido va en el propio dibujo, sin redirecciones ni enlaces de seguimiento por medio. Un código impreso funciona mientras exista el enlace o la red a la que apunta.' },
    { q: '¿Cómo funciona el código QR del wifi?', a: 'Guarda el nombre de la red, la contraseña y el tipo de seguridad en el formato estándar WIFI:. La cámara de un iPhone o un Android ofrece conectarse al escanearlo, así tus invitados no tienen que teclear la clave del router.' },
    { q: '¿Qué nivel de corrección elijo?', a: 'M (alrededor de un 15 % de recuperación) sirve para casi todo. Elige Q o H si vas a imprimir sobre superficies rugosas, puede rayarse o llevará un logo encima. L da el código más pequeño para contenidos largos en pantalla.' },
    { q: '¿PNG o SVG?', a: 'PNG es una imagen normal para webs, chats y documentos. SVG es un archivo vectorial que se ve nítido a cualquier tamaño, perfecto para carteles, folletos y la imprenta.' },
  ],

  privacy: {
    title: 'Política de privacidad | Generador de códigos QR',
    description: 'Política de privacidad del Generador de códigos QR: lo que escribes se queda en tu navegador, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'El Generador de códigos QR (el «Servicio») respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recogemos', 'El Servicio funciona sin cuenta ni inicio de sesión. Los enlaces, textos, datos de wifi, correos y teléfonos que introduces se convierten en código QR solo en tu navegador. No se envían a nuestro servidor ni se guardan. Algunos datos pueden recogerse automáticamente durante el uso, como se explica abajo.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; algunas funciones podrían no ir bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios. Más información y ajustes en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (páginas vistas, códigos creados, valoraciones). El contenido de tus códigos QR nunca forma parte de ellos y nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política, contacta con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está vigente desde el 11 de octubre de 2026.'],
    ],
    back: '← Volver al Generador de códigos QR',
  },
};
