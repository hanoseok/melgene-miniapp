/* Generador de apodos — español (tú). words: por estilo { adj, noun } (adjetivos 'masc/fem', nombres '|m' '|f'). Ver en.js */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Generador de apodos – Nicks lindos y chulos',
    description: '¿No se te ocurre un apodo o un nick? Elige un estilo (tierno, chulo, gracioso, soñador), añade tu nombre si quieres y consigue un apodo aleatorio con un toque. Vuelve a sacar hasta que te guste. Gratis.',
    ogTitle: 'Generador de apodos ✨ Nicks lindos y chulos',
    ogDescription: 'Elige un estilo, añade tu nombre y copia tu apodo con un solo toque.',
  },
  siteName: 'Generador de apodos',
  privacyLink: 'Política de privacidad',

  start: {
    badge: '🏷️ ¿Sin ideas para un nick?',
    h1Kicker: 'Generador de apodos',
    h1Html: 'Encuentra el apodo<br>que <em>es tuyo</em>',
    hook: 'Elige un estilo, añade tu nombre si quieres y recibe un apodo hecho solo para ti.',
    facts: 'Tierno, chulo, gracioso, soñador · mezcla tu nombre · copia con un toque',
    start: 'Crear mi apodo →',
  },

  make: {
    title: '¿Qué estilo prefieres?',
    moodLabel: 'Elige un estilo',
    moods: { cute: 'Tierno', cool: 'Chulo', funny: 'Gracioso', dreamy: 'Soñador', mystic: 'Misterioso' },
    nameLabel: 'Tu nombre o unas letras (opcional)',
    nameHint: 'Lo mezclamos con el apodo. Hasta 12 caracteres y se queda en tu navegador.',
    namePlaceholder: 'p. ej. Lucía',
    numbers: '＋ Añadir números',
    poolCount: 'Combinaciones de este estilo: {n}+',
    make: 'Crear mi apodo 🎲',
  },

  result: {
    title: 'Tu apodo',
    copy: 'Copiar apodo',
    copied: '¡Copiado!',
    copyFail: 'No se pudo copiar. Selecciona el apodo y cópialo a mano.',
    again: 'Otro más',
    change: 'Cambiar de estilo',
    shareTitle: 'Generador de apodos',
    shareText: 'El generador de apodos me ha dado «{nick}» ✨',
  },

  style: { camel: true, order: 'noun-adj', nameSep: '_' },

  words: {
    cute: {
      adj: ['suave', 'peludo/peluda', 'pequeñito/pequeñita', 'dulce', 'mimoso/mimosa', 'burbujeante', 'brillante', 'tierno/tierna', 'rosado/rosada', 'redondito/redondita', 'risueño/risueña', 'calentito/calentita'],
      noun: ['conejito|m', 'gatito|m', 'perrito|m', 'panda|m', 'mochi|m', 'malvavisco|m', 'cupcake|m', 'patito|m', 'melocotón|m', 'flan|m', 'koala|m', 'osito|m'],
    },
    cool: {
      adj: ['neón', 'turbo', 'silencioso/silenciosa', 'veloz', 'helado/helada', 'atómico/atómica', 'salvaje', 'nocturno/nocturna', 'cromado/cromada', 'real', 'eléctrico/eléctrica', 'ardiente'],
      noun: ['lobo|m', 'halcón|m', 'víbora|f', 'jinete|m', 'espada|f', 'tormenta|f', 'tigre|m', 'cometa|m', 'titán|m', 'águila|f', 'piloto|m', 'ninja|m'],
    },
    funny: {
      adj: ['dormilón/dormilona', 'gruñón/gruñona', 'tambaleante', 'torpe', 'pillo/pilla', 'regordete/regordeta', 'empapado/empapada', 'chiflado/chiflada', 'loco/loca', 'perezoso/perezosa', 'cascarrabias', 'hambriento/hambrienta'],
      noun: ['patata|f', 'fideo|m', 'pepinillo|m', 'gofre|m', 'pingüino|m', 'llama|f', 'tostada|f', 'albóndiga|f', 'morsa|f', 'churro|m', 'duende|m', 'hámster|m'],
    },
    dreamy: {
      adj: ['estrellado/estrellada', 'nublado/nublada', 'brumoso/brumosa', 'aterciopelado/aterciopelada', 'lunar', 'pastel', 'flotante', 'luminoso/luminosa', 'sedoso/sedosa', 'difuso/difusa', 'dorado/dorada', 'sereno/serena'],
      noun: ['luna|f', 'nube|f', 'aurora|f', 'estrella|f', 'nana|f', 'horizonte|m', 'pétalo|m', 'galaxia|f', 'susurro|m', 'ensueño|m', 'amanecer|m', 'pradera|f'],
    },
    mystic: {
      adj: ['espectral', 'críptico/críptica', 'velado/velada', 'fantasma', 'obsidiana', 'crepuscular', 'embrujado/embrujada', 'oculto/oculta', 'olvidado/olvidada', 'siniestro/siniestra', 'ceniciento/cenicienta', 'arcano/arcana'],
      noun: ['cuervo|m', 'espectro|m', 'oráculo|m', 'enigma|m', 'cifra|f', 'sombra|f', 'esfinge|f', 'reliquia|f', 'runa|f', 'brasa|f', 'medianoche|f', 'misterio|m'],
    },
  },

  og: {
    brand: '🏷️ Generador de apodos',
    kicker: 'Elige un estilo · consigue un nick',
    title: 'Encuentra el apodo que es tuyo',
    desc: 'Tierno, chulo, gracioso, soñador · mezcla tu nombre · copia con un toque',
  },

  faq: [
    { q: '¿Cómo funciona el generador de apodos?', a: 'Elige un estilo, escribe si quieres tu nombre o unas letras y pulsa crear. La herramienta une un nombre y un adjetivo de la lista de ese estilo y mezcla tus letras si has puesto alguna.' },
    { q: '¿El apodo es realmente aleatorio?', a: 'Sí. Las palabras se sacan con el generador aleatorio criptográfico de tu navegador (crypto.getRandomValues), así que todas las de la lista tienen la misma probabilidad. El parpadeo antes del resultado es solo un efecto.' },
    { q: '¿Puedo poner mi propio nombre?', a: 'Sí, hasta 12 caracteres: nombre, iniciales o las letras que quieras. Lo que escribes solo se usa en tu navegador y no se envía ni se guarda.' },
    { q: '¿Otra persona puede conseguir el mismo apodo?', a: 'Es posible, porque cada estilo tiene cientos de combinaciones. Si un juego o servicio dice que el apodo ya está cogido, saca otro o activa «Añadir números».' },
  ],

  privacy: {
    title: 'Política de privacidad | Generador de apodos',
    description: 'Política de privacidad del Generador de apodos: el nombre que escribes se queda en tu navegador, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'El Generador de apodos (el «Servicio») respeta tu privacidad y trata solo la información mínima descrita a continuación.',
    sections: [
      ['1. Información que recopilamos', 'El Servicio funciona sin cuenta ni inicio de sesión. El nombre o las letras que escribes y el estilo que eliges se procesan solo en tu navegador y no se envían a nuestro servidor. No obstante, mientras usas el Servicio puede recopilarse automáticamente cierta información, como se describe a continuación.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma y tu último estilo, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas en los ajustes del navegador; algunas funciones podrían dejar de funcionar correctamente.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores agregados propios que solo guardan totales diarios por idioma (visitas, apodos creados, valoraciones). Nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes preguntas sobre esta política de privacidad, ponte en contacto con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política es efectiva desde el 5 de octubre de 2026.'],
    ],
    back: '← Volver al Generador de apodos',
  },
};
