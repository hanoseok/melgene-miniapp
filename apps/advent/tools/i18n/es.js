/* Calendario de Adviento — español (es/)
 * Diseños, límites, fechas y formato del enlace en advent-core.js; pantallas y canvas en advent.js. Este archivo tiene todos los textos visibles.
 * Las claves terminadas en Html se insertan como HTML (solo <br> y <em>); los cuerpos de privacy.sections también.
 * Pantalla de inicio = solo gancho (sin formulario ni FAQ). Las preguntas frecuentes solo aparecen en la pantalla final común.
 * Mantén {name} {n} {day} {date} {title} tal cual. Plurales según Intl.PluralRules (one, other).
 * editor.ideas = mensajes escritos en español (no traducciones), máximo 80 caracteres cada uno.
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
    title: "Calendario de Adviento para regalar: 24 puertas",
    description: "Crea gratis un calendario de Adviento personalizado: esconde un mensaje tras cada una de las 24 puertas y envíalo por enlace. Desde el 1 de diciembre se abre una al día.",
    ogTitle: "Calendario de Adviento para regalar 🎄",
    ogDescription: "Esconde 24 mensajitos para alguien especial. En diciembre se abre una puerta cada día."
  },
  siteName: "Calendario de Adviento",
  privacyLink: "Privacidad",
  start: {
    badge: "🎄 Cuenta atrás para Navidad",
    h1Kicker: "Calendario de Adviento",
    h1Html: "24 puertitas,<br>una <em>sorpresa</em> al día",
    hook: "Esconde un mensaje detrás de cada puerta para alguien que quieres. Desde el 1 de diciembre podrá abrir una cada día.",
    start: "Crear calendario →"
  },
  editor: {
    title: "Llena tu calendario",
    themesAria: "Diseños del calendario",
    themes: {
      classic: "Clásico",
      snow: "Nevado",
      gold: "Oro estelar",
      candy: "Caramelo"
    },
    fields: {
      to: { label: "Para", placeholder: "p. ej. Lucía" },
      from: { label: "De", placeholder: "p. ej. Pablo" }
    },
    daysLabel: "Mensajes detrás de las puertas",
    daysHint: "Hasta 80 caracteres por puerta. Las puertas vacías esconden un detallito.",
    dayAria: "Mensaje de la puerta {day}",
    diceAria: "Idea al azar para la puerta {day}",
    placeholder: "Escribe un mensaje…",
    counter: "{n}/24 puertas llenas",
    fillAll: "🎲 Llenar vacías",
    preview: "👀 Vista previa",
    create: "Crear enlace",
    needOne: "Escribe al menos un mensaje primero."
  },
  ideas: [
    "¡Buenos días! Hoy es un gran día para ser tú.",
    "El chocolate caliente de esta semana corre de mi cuenta. Tú eliges el sitio.",
    "Me alegra muchísimo tenerte en mi vida. Eso es todo, ese es el mensaje.",
    "Pon tu canción favorita y baila un minuto. Receta médica.",
    "¿Te acuerdas de aquel ataque de risa que no paraba? Yo sí.",
    "Vale por: una noche de peli, tú eliges y yo pongo las palomitas.",
    "Tienes más valor del que crees y más corazón del que sabes.",
    "Misión del día: hazle una foto a algo que te haga sonreír.",
    "Recordatorio: bebe un vaso de agua y estírate un poco.",
    "Si hoy se te hace largo, este mensaje es un abrazo pequeñito.",
    "Contigo los días normales parecen vacaciones.",
    "¿Nos llamamos esta noche? Quiero que me cuentes tu día.",
    "Vale por: un abrazo, válido siempre, no caduca.",
    "Date un capricho dulce hoy. Te lo has ganado.",
    "¡Ya vamos por la mitad hasta Navidad! Lo estás haciendo genial.",
    "Sal un momento y mira al cielo. A lo mejor nieva cerca.",
    "Tres cosas que me encantan de ti: tu risa, tu corazón y tus playlists.",
    "Apunta algo bonito de este año. Empiezo yo: conocerte.",
    "Vale por: una tarea de casa que tú elijas, hecha sin quejarme.",
    "Eres mi notificación favorita.",
    "Enciende una vela esta noche y pide un deseo.",
    "Descansar también cuenta. Tómatelo con calma hoy.",
    "Mañana la Navidad estará aún más cerca. ¡Ánimo!",
    "¡Feliz Nochebuena! Gracias por ser como eres.",
    "Elijamos algo divertido para hacer juntos el año que viene.",
    "Esta noche toca mantita, chocolate y cero prisas.",
    "Dato curioso: es facilísimo quererte.",
    "Mándale un mensaje bonito a alguien hoy. Empezar por mí está permitido.",
    "Da igual la distancia, siempre te tengo cerca del corazón.",
    "¿Turrón o polvorones? Hoy es día de darse un gusto."
  ],
  calendar: {
    heading: "Calendario de Adviento",
    forName: "Para {name}",
    forNone: "Un calendario de Adviento para ti",
    fromName: "De {name}",
    before: {
      one: "La primera puerta se abre el {date}. ¡Solo falta {n} día!",
      other: "La primera puerta se abre el {date}. ¡Faltan {n} días!"
    },
    during: "Hoy es {date}. ¡Abre la puerta de hoy!",
    after: "Ya llegó la Navidad. Todas las puertas están abiertas.",
    locked: {
      one: "La puerta {day} se abre el {date}, dentro de {n} día.",
      other: "La puerta {day} se abre el {date}, dentro de {n} días."
    },
    hint: "Toca una puerta para abrirla",
    doorAria: "Puerta {day}",
    dayTitle: "{date}",
    treat: "Hoy no hay mensaje, solo un detallito dulce para ti.",
    close: "Cerrar",
    makeOwn: "🎄 Crear el mío"
  },
  preview: {
    badge: "👀 Vista previa",
    note: "Solo tú ves esta pantalla. Aquí todas las puertas están abiertas para que revises tus mensajes. A la otra persona se le abre una al día.",
    back: "← Volver"
  },
  result: {
    eyebrowMine: "¡Tu calendario de Adviento está listo!",
    eyebrowFriend: "Un calendario hecho solo para ti",
    linkLabel: "Enlace del calendario",
    copy: "Copiar",
    copied: "¡Enlace copiado!",
    copyFail: "No se pudo copiar. Selecciona el enlace y cópialo.",
    note: "Los mensajes solo viven dentro de este enlace. Quien lo tenga puede abrir cada puerta en su día, así que envíalo solo a esa persona.",
    save: "Guardar imagen",
    saving: "Creando la imagen…",
    saved: "¡Imagen guardada!",
    saveFail: "No se pudo crear la imagen. Haz una captura de pantalla.",
    imageAlt: "Calendario de Adviento con 24 puertas cerradas",
    preview: "Ver todas las puertas",
    edit: "Editar",
    retry: "Crear otro calendario",
    retryFriend: "Crear el mío",
    shareTitle: "Calendario de Adviento",
    shareText: "Te hice un calendario de Adviento 🎄 Desde el 1 de diciembre se abre una puerta cada día:",
    shareTextFriend: "Crea un calendario de Adviento para alguien especial 🎄",
    fileName: "calendario-adviento"
  },
  og: {
    brand: "🎄 Calendario de Adviento",
    kicker: "Calendario de Adviento para regalar",
    title: "24 puertas, una sorpresa al día",
    desc: "4 diseños · un mensaje en cada puerta · por enlace"
  },
  faq: [
    {
      q: "¿Cuándo se abren las puertas?",
      a: "La puerta 1 el 1 de diciembre, la 2 el 2 de diciembre y así hasta el 24, según la fecha del móvil o el ordenador de quien lo recibe. Del 25 de diciembre al 31 de enero están todas abiertas; antes de diciembre, todas cerradas."
    },
    {
      q: "¿Dónde se guardan mis mensajes?",
      a: "Solo dentro del enlace. Nada de lo que escribes se envía a nuestro servidor, así que quien tenga el enlace podrá leer los mensajes cuando se abra cada puerta. Envíalo solo a la persona indicada."
    },
    {
      q: "¿Puedo cambiar un mensaje después de enviar el enlace?",
      a: "No: los mensajes van dentro del propio enlace y no se pueden editar después. Edita tu calendario, crea un enlace nuevo y envía ese."
    },
    {
      q: "¿Qué aparece detrás de una puerta vacía?",
      a: "Un detallito del día, como una galleta, un bastón de caramelo o una estrella. Puedes llenar todas las puertas, solo algunas o dejar que el dado te dé ideas."
    }
  ],
  privacy: {
    title: "Privacidad | Calendario de Adviento",
    description: "Política de privacidad del Calendario de Adviento: cómo se tratan tus mensajes, cookies, publicidad y estadísticas anónimas.",
    h1: "Política de privacidad",
    introHtml: "El Calendario de Adviento (el \"Servicio\") respeta tu privacidad y solo trata la información mínima que se describe a continuación.",
    sections: [
      [
        "1. Información que recogemos",
        "El Servicio funciona sin cuenta ni inicio de sesión. Los nombres y mensajes que escribes nunca se envían a un servidor. Se quedan en tu navegador (mientras editas se guarda un borrador en el almacenamiento local) y dentro del enlace cuando lo compartes. Las puertas ya abiertas solo se recuerdan en el navegador de quien recibe el enlace. Parte de la información puede recogerse automáticamente, como se explica abajo."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies para mostrar anuncios y entender cómo se usa. Puedes rechazar o borrar las cookies en los ajustes del navegador; algunas funciones podrían no funcionar como esperas."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Puedes saber más y cambiar tus preferencias en <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios agregados que solo guardan totales diarios por idioma (visitas, calendarios creados, valoraciones con estrellas). Nada de esto te identifica ni incluye lo que escribiste."
      ],
      [
        "5. Enlaces compartidos e imágenes",
        "Los enlaces creados con el Servicio contienen tu calendario codificado en la URL, así que quien tenga el enlace puede leer cada mensaje cuando se abre su puerta. Las imágenes guardadas solo muestran los números de las puertas y se crean en tu navegador. Evita poner direcciones, teléfonos u otros datos personales en los mensajes."
      ],
      [
        "6. Contacto",
        "Si tienes preguntas sobre esta política, ponte en contacto con el responsable del sitio."
      ],
      [
        "7. Fecha de entrada en vigor",
        "Esta política está en vigor desde el 17 de noviembre de 2026."
      ]
    ],
    back: "← Volver al Calendario de Adviento"
  }
};
