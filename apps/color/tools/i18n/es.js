/* Personal Color Test (es)
 * 8 result ids (springlight springbright summerlight summermute autumnmute autumndeep winterbright winterdeep);
 * questions[i].choices[j] follow color-core.js QUESTIONS[i].w[j] (the [warm/cool, light/deep, bright/muted] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result name as people would search it — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the real server share. Swatch colors live in color-core.js.
 * A fun self-check, not a professional draping analysis (result disclaimer, FAQ, guide).
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {"css":"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap","display":"'Playfair Display'","displayWeight":700,"sans":"","wordBreak":"normal","hyphens":"manual"},
  "meta": {
    "title": "Test de colorimetría: ¿qué estación de color eres?",
    "description": "Haz el test de colorimetría: 12 preguntas que puedes comprobar frente al espejo, unos 2 minutos, sin foto ni registro. Descubre tu paleta de colores. Solo por diversión.",
    "ogTitle": "Test de colorimetría 🎨 ¿Qué colores te iluminan la cara?",
    "ogDescription": "Un test de colorimetría por estaciones con 12 preguntas frente al espejo. Descubre tu subtono y los tonos que mejor te quedan."
  },
  "siteName": "Test de colorimetría",
  "privacyLink": "Política de privacidad",
  "start": {
    "badge": "🎨 Autotest con espejo",
    "h1Kicker": "Test de colorimetría",
    "h1Html": "¿Qué colores hacen<br>que tu cara <em>brille</em>?",
    "hook": "Coge un espejo y busca luz natural. Responde 12 preguntas rápidas sobre tu piel, tu pelo, tus ojos y los colores por los que te hacen cumplidos, y descubre tu paleta de estación.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🪞 12 preguntas",
    "start": "Ver mis colores →"
  },
  "quiz": {
    "backAria": "Pregunta anterior",
    "progressAria": "Progreso",
    "qLabel": "P{n}"
  },
  "loading": {
    "text": "Mezclando tu paleta…",
    "sub": "Poniendo cada tono a la luz"
  },
  "result": {
    "title": "Mi colorimetría: {name}",
    "metaDesc": "Resultado del test de colorimetría: {name}. {vibe} Descubre tus mejores colores, los que conviene evitar y consejos de maquillaje, pelo y joyas.",
    "eyebrow": "Tu estación de color es",
    "gaugeLabel": "Hacia dónde se inclinaron tus respuestas",
    "axes": [
      ["Cálido", "Frío"],
      ["Claro", "Profundo"],
      ["Brillante", "Suave"]
    ],
    "paletteLabel": "Tus mejores colores",
    "avoidLabel": "Colores con moderación",
    "avoidNote": "No están prohibidos, solo cuesta más llevarlos cerca de la cara. Úsalos en zapatos, bolsos o pantalones.",
    "makeupLabel": "Maquillaje",
    "hairLabel": "Color de pelo",
    "jewelryLabel": "Joyas",
    "disclaimer": "Es un autotest para divertirse, no un análisis de color profesional. El draping real usa telas con luz controlada, y la iluminación, las pantallas y el maquillaje cambian cómo se ven los colores.",
    "sameShare": "Al {pct}% de la gente le salió esta paleta",
    "shareText": "Mi colorimetría: {name} {emoji} «{vibe}» ¿Y la tuya?",
    "ctaStrong": "Alguien te ha compartido sus colores",
    "ctaSub": "¿Cálida o fría? Descúbrelo en 2 minutos.",
    "retry": "Repetir el test"
  },
  "og": {
    "eyebrow": "Mi colorimetría",
    "brand": "🎨 Test de colorimetría",
    "defaultKicker": "Test de colorimetría por estaciones",
    "defaultTitle": "¿Qué colores te iluminan la cara?",
    "defaultDesc": "12 preguntas frente al espejo · 2 minutos"
  },
  "faq": [
    {
      "q": "¿Cómo decide el test cuáles son mis colores?",
      "a": "Cada respuesta mueve un poco tres escalas: subtono cálido o frío, claro o profundo, y brillante o suave. Tu resultado es la paleta de estación donde se cruzan las tres. Las mismas respuestas siempre dan el mismo resultado."
    },
    {
      "q": "¿Es tan fiable como un análisis de colorimetría profesional?",
      "a": "No. Es un autotest para divertirse basado en lo que puedes ver en el espejo. Un análisis profesional compara telas sobre tu cara con luz neutra, algo que un test no puede hacer. Toma tu resultado como un punto de partida para experimentar."
    },
    {
      "q": "¿Cómo consigo un resultado más fiable?",
      "a": "Responde con luz natural cerca de una ventana, con la cara lavada y el pelo recogido. Las bombillas, los filtros del móvil y el pelo teñido pueden hacer que los colores parezcan más cálidos o más fríos de lo que son."
    },
    {
      "q": "¿Se guardan mis respuestas o mis fotos?",
      "a": "El test nunca te pide una foto. Tus respuestas se calculan en tu navegador y no se guardan. Solo contamos de forma anónima qué resultado salió, para mostrar lo común que es."
    }
  ],
  "privacy": {
    "title": "Política de privacidad | Test de colorimetría",
    "description": "Política de privacidad del Test de colorimetría: cómo usamos las cookies, la publicidad y las estadísticas anónimas.",
    "h1": "Política de privacidad",
    "introHtml": "Test de colorimetría (el \"Servicio\") respeta tu privacidad y trata solo la información mínima necesaria, tal como se describe a continuación.",
    "sections": [
      [
        "1. Información que recopilamos",
        "Puedes usar el Servicio sin registrarte ni iniciar sesión, y nunca te pide una foto. Tus respuestas se calculan en tu navegador y nunca se envían ni se guardan en nuestros servidores. Solo contamos de forma anónima qué resultado salió, para mostrar lo común que es cada resultado."
      ],
      [
        "2. Cookies y tecnologías similares",
        "El Servicio puede usar cookies y el almacenamiento local de tu navegador para recordar tu idioma, mostrar anuncios y entender cómo se usa el Servicio. Puedes rechazarlas o borrarlas desde la configuración de tu navegador; si lo haces, algunas funciones podrían no funcionar bien."
      ],
      [
        "3. Publicidad (Google AdSense)",
        "El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios basados en tus visitas anteriores a este y otros sitios web. Puedes obtener más información y cambiar la personalización de anuncios en la <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Configuración de anuncios de Google</a>."
      ],
      [
        "4. Estadísticas",
        "Guardamos totales diarios anónimos (páginas vistas, tests completados, valoraciones) para mejorar el Servicio. Estos totales no te identifican personalmente."
      ],
      [
        "5. Contacto",
        "Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio."
      ],
      [
        "6. Fecha de entrada en vigor",
        "Esta política está vigente desde el 23 de octubre de 2026."
      ]
    ],
    "back": "← Volver al Test de colorimetría"
  },
  "questions": [
    {
      "q": "Con luz natural, mira las venas de la parte interna de tu muñeca. ¿De qué color son?",
      "choices": [
        "Sobre todo azules o moradas",
        "Sobre todo verdes u oliva",
        "Una mezcla de ambas, difícil de saber"
      ]
    },
    {
      "q": "¿Con qué joyas se ve mejor tu piel?",
      "choices": [
        "Oro amarillo",
        "Plata o platino",
        "Oro rosa o metal suave y cepillado",
        "Piezas llamativas y brillantes, de cualquier metal"
      ]
    },
    {
      "q": "Tras una hora al sol sin protector, tu piel normalmente…",
      "choices": [
        "Se pone rosa, se quema y apenas se broncea",
        "Primero se quema un poco y luego se broncea ligeramente",
        "Se vuelve dorada y se broncea con facilidad",
        "Casi nunca se quema y se oscurece un poco"
      ]
    },
    {
      "q": "Ponte una camiseta blanca pura y otra marfil o crema bajo la barbilla. ¿Cuál te queda mejor?",
      "choices": [
        "El blanco puro. Mi cara se ve fresca y luminosa",
        "Marfil o crema. El blanco me queda duro",
        "Sinceramente, no noto diferencia"
      ]
    },
    {
      "q": "¿Qué color oscuro básico te queda mejor junto a la cara?",
      "choices": [
        "Negro azabache. Nítido e impactante",
        "Marrón chocolate o camel",
        "Gris marengo suave o azul marino. El negro me pesa",
        "Ninguno: me favorecen más el crema o el beige claro"
      ]
    },
    {
      "q": "¿Cuál es tu color de pelo natural (o cuál era en tu infancia)?",
      "choices": [
        "Muy oscuro, casi negro",
        "Castaño medio u oscuro con reflejos rojizos o dorados",
        "Castaño ceniza suave o castaño apagado",
        "Claro: castaño dorado, rubio fresa o rubio"
      ]
    },
    {
      "q": "¿Cómo describirías tus ojos?",
      "choices": [
        "Oscuros e intensos, con el blanco muy limpio",
        "Avellana cálido, ámbar o marrón dorado",
        "Gris pardo o gris verdoso suave, con tonos difuminados",
        "Claros y brillantes, con un aro exterior nítido"
      ]
    },
    {
      "q": "¿Con qué colores de ropa te hacen más cumplidos?",
      "choices": [
        "Colores vivos como el azul cobalto o el rosa fucsia",
        "Tonos suaves y empolvados como el rosa palo o el verde salvia",
        "Pasteles claros y ligeros",
        "Tonos intensos y profundos como el burdeos o el verde bosque"
      ]
    },
    {
      "q": "¿Cuánto contraste hay entre tu pelo y tu piel?",
      "choices": [
        "Mucho. Mi pelo destaca claramente sobre mi piel",
        "Algo intermedio",
        "Poco y claro. Ambos son suaves y pálidos",
        "Poco y profundo. Ambos son intensos y de tono parecido"
      ]
    },
    {
      "q": "Sin maquillaje, tus labios y mejillas se ven…",
      "choices": [
        "Rosados",
        "Melocotón o coral",
        "Pálidos y beige, con poco color",
        "Naturalmente intensos, casi color frambuesa"
      ]
    },
    {
      "q": "¿Qué colorete te queda más natural?",
      "choices": [
        "Melocotón o coral",
        "Rosa bebé o rosa palo",
        "Terracota o ladrillo suave",
        "Frambuesa o ciruela"
      ]
    },
    {
      "q": "¿Qué ambiente se parece más a ti frente al espejo?",
      "choices": [
        "Soleado y fresco, como una limonada en un pícnic",
        "Ligero y suave, como lavanda entre la niebla de la mañana",
        "Acogedor e intenso, como un té especiado junto al fuego",
        "Nítido y dramático, como las luces de la ciudad de noche"
      ]
    }
  ],
  "types": {
    "springlight": {
      "name": "Primavera clara",
      "word": "primavera clara",
      "vibe": "Cálida, delicada y llena de luz de mañana.",
      "desc": "Tu colorido es cálido pero suave, con un brillo dorado delicado y muy poco contraste. Los tonos claros, limpios y ligeramente cálidos hacen que tu piel se vea fresca y descansada, mientras que los colores pesados o muy oscuros se quedan encima de ti en vez de acompañarte. Piensa en melocotón, amarillo mantequilla, aguamarina claro y rosa cálido: colores que parecen mezclados con sol.",
      "keywords": ["Cálida", "Clara", "Fresca"],
      "makeup": "Colorete melocotón o albaricoque, un labial coral o rosa cálido translúcido y delineador marrón suave o bronce en lugar de negro.",
      "hair": "Rubio dorado, miel o castaño caramelo claro. Evita los tonos muy oscuros o ceniza que ensombrecen tu cara.",
      "jewelry": "Oro amarillo claro, oro rosa y piezas delicadas. Las perlas en tono crema cálido te quedan preciosas."
    },
    "springbright": {
      "name": "Primavera brillante",
      "word": "primavera brillante",
      "vibe": "Cálida, luminosa y llena de chispa.",
      "desc": "Tienes un colorido cálido con un aire vivo y limpio, a menudo con ojos brillantes y un contraste fresco. Los colores saturados y soleados te despiertan la cara, mientras que los tonos empolvados o agrisados pueden darte aspecto cansado. Coral, mandarina, amarillo girasol, turquesa y verde hierba son tu terreno de juego. Puedes llevar color a lo grande y seguir pareciendo tú.",
      "keywords": ["Cálida", "Limpia", "Vibrante"],
      "makeup": "Labial coral o rojo cálido, un colorete melocotón limpio y un toque de brillo. Un delineador marrón cálido o verde azulado da el punto.",
      "hair": "Castaño dorado cálido, cobrizo o castaño brillante. Los reflejos cálidos y luminosos te sientan mejor que los colores planos y cenizos.",
      "jewelry": "Oro amarillo pulido, esmalte de colores y piedras vivas. Los acabados brillantes te favorecen más que los mates."
    },
    "summerlight": {
      "name": "Verano claro",
      "word": "verano claro",
      "vibe": "Fría, suave y ligera como un cielo despejado.",
      "desc": "Tu colorido es claro y frío, con un subtono rosado o neutro y un aspecto general suave. Los pasteles fríos y los tonos medios delicados hacen que tu piel se vea lisa y luminosa, mientras que los colores muy oscuros, muy cálidos o neón pueden eclipsarte. Azul empolvado, lavanda, rosa suave y menta son apuestas seguras. Piensa en colores con un poco de blanco y un poco de azul mezclados.",
      "keywords": ["Fría", "Clara", "Suave"],
      "makeup": "Colorete rosa o rosa bebé, un labial rosa o malva translúcido y delineador topo o gris suave.",
      "hair": "Rubio ceniza, castaño ceniza claro o rubio beige suave. Los tonos muy dorados o anaranjados pueden chocar con tu piel.",
      "jewelry": "Plata, oro blanco y platino, con perlas, piedra luna o piedras azul pálido."
    },
    "summermute": {
      "name": "Verano suave",
      "word": "verano suave",
      "vibe": "Fría, serena y discretamente elegante.",
      "desc": "Tu colorido va de frío a neutro y está difuminado de forma natural, con poco contraste entre pelo, piel y ojos. Los tonos empolvados y agrisados te dan un aire pulido y sereno, mientras que los colores muy vivos o muy cálidos pueden resultar estridentes junto a tu cara. Malva, rosa palo, azul pizarra, salvia y ciruela suave son tu sello. Los looks tono sobre tono te quedan especialmente refinados.",
      "keywords": ["Fría", "Suave", "Serena"],
      "makeup": "Labial rosa palo o malva, colorete rosa suave y delineador gris pardo o ciruela para definir sin endurecer.",
      "hair": "Castaño ceniza, castaño champiñón frío o rubio ceniza suave. Evita el dorado anaranjado o el negro muy duro.",
      "jewelry": "Plata cepillada, oro blanco y peltre suave. Los acabados mates y las perlas grises van muy contigo."
    },
    "autumnmute": {
      "name": "Otoño suave",
      "word": "otoño suave",
      "vibe": "Cálida, dulce y suavemente dorada.",
      "desc": "Tu colorido es cálido y difuminado, con una suavidad terrosa y poco contraste. Los tonos cálidos y apagados te quedan naturales y elegantes, mientras que los colores helados o muy vivos pueden restarte color. Camel, oliva, terracota suave, topo cálido y verde musgo son tus mejores aliados. Combinar varios neutros cálidos y suaves es uno de tus superpoderes.",
      "keywords": ["Cálida", "Suave", "Terrosa"],
      "makeup": "Labial nude melocotón o ladrillo suave, colorete terracota cálido y delineador marrón o caqui.",
      "hair": "Castaño dorado suave, beige cálido o caramelo apagado. Evita el ceniza frío o el negro azulado, que apagan tu calidez.",
      "jewelry": "Oro mate o cepillado, bronce y madera, con piedras cálidas como el ámbar o el ojo de tigre."
    },
    "autumndeep": {
      "name": "Otoño profundo",
      "word": "otoño profundo",
      "vibe": "Cálida, intensa y llena de profundidad.",
      "desc": "Tienes un colorido cálido con verdadera profundidad, a menudo pelo u ojos oscuros y un subtono dorado u oliva. Los tonos tierra ricos, especiados y saturados te dan un aire fuerte y radiante, mientras que los pasteles y los tonos helados pueden apagarte. Óxido, chocolate, mostaza, oliva y verde azulado profundo son tus colores de poder. Puedes llevar tonos oscuros sin que te resulten pesados.",
      "keywords": ["Cálida", "Profunda", "Intensa"],
      "makeup": "Labial rojo ladrillo, canela o burdeos cálido, colorete bronce o terracota y delineador marrón oscuro u oliva.",
      "hair": "Chocolate intenso, castaño, caoba o caramelo oscuro. Los colores muy claros o cenizos pueden verse desconectados de tu cara.",
      "jewelry": "Oro amarillo envejecido o intenso, cobre y bronce, con granate, ojo de tigre o piedras verde oscuro."
    },
    "winterbright": {
      "name": "Invierno brillante",
      "word": "invierno brillante",
      "vibe": "Fría, vibrante e imposible de ignorar.",
      "desc": "Tu colorido es frío y limpio, a menudo con un contraste llamativo entre pelo, piel y ojos. Los colores puros y brillantes como joyas, y el blanco y negro nítidos, te dan un aire nítido y lleno de vida, mientras que los tonos apagados, beige o empolvados pueden apagar tu chispa. Fucsia, cobalto, esmeralda, rojo puro y blanco helado son tu sello. Puedes llevar el color más atrevido de la sala.",
      "keywords": ["Fría", "Limpia", "Contrastada"],
      "makeup": "Labial rojo puro, fucsia o rosa frío, colorete rosa vivo y delineador negro bien definido.",
      "hair": "Castaño oscuro frío, negro azulado o un tono frío y limpio. Los reflejos caramelo cálidos o anaranjados pueden verse turbios en ti.",
      "jewelry": "Plata pulida, oro blanco y platino, con diamantes, zafiros o piedras de colores vivos."
    },
    "winterdeep": {
      "name": "Invierno profundo",
      "word": "invierno profundo",
      "vibe": "Fría, profunda y discretamente dramática.",
      "desc": "Tienes un colorido profundo con un subtono frío o neutro frío, a menudo con pelo y ojos oscuros. Los tonos fríos y profundos y el negro puro te quedan elegantes y poderosos, mientras que los pasteles cálidos claros y los beiges pueden darte aspecto cansado. Negro, azul marino tinta, ciruela, burdeos, verde pino y blanco helado para el contraste forman tu armario ideal.",
      "keywords": ["Fría", "Profunda", "Elegante"],
      "makeup": "Labial frambuesa, vino o ciruela oscuro, colorete rosa frío y delineador negro o ciruela oscuro.",
      "hair": "Espresso profundo, castaño oscuro frío o negro suave. Los tonos dorados claros pueden apagar tu profundidad natural.",
      "jewelry": "Plata, oro blanco o metal pavonado, con piedras profundas como el rubí, la amatista o el ónix."
    }
  }
};
