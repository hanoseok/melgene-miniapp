/* Past Life Quiz — Spanish (/es/), neutral Spanish for Spain + Latin America, reader addressed as "tú" (no vosotros/ustedes)
 * Same 16 archetype ids and question/choice order as data.js (scoring weights live only there).
 * Korean roles get a one-clause local hook: royal kitchen = the K-drama «La joya del palacio» (Dae Jang Geum),
 * jeongisu = a live telenovela "continuará…", amhaeng-eosa = a Joseon Zorro with a badge, the ninja "que en realidad era cartero".
 * Keys ending in Html are raw HTML; privacy.sections bodies are HTML too. No spoilers in meta/landing/og/faq.
 */
module.exports = {
  // Fonts: fontCss = extra stylesheets (omit → Pretendard), font = page font stack (omit → shared default)
  typography: {},

  meta: {
    title: 'Test de vidas pasadas: ¿quién fuiste tú?',
    description: 'Test de vidas pasadas gratis: responde 12 preguntas sobre tu día a día y descubre quién fuiste en tu vida pasada. Sin descargas ni registro, en 2 minutos.',
    ogTitle: 'Test de vidas pasadas — ¿Quién fuiste en tu vida pasada?',
    ogDescription: 'Test de vidas pasadas gratis: 12 preguntas, 2 minutos y 16 vidas pasadas posibles. ¿Quién fuiste tú?',
  },
  siteName: 'Test de vidas pasadas',
  landing: {
    badge: '🔮 Más divertido que tu horóscopo',
    h1Kicker: 'Test de vidas pasadas',
    h1Html: '¿Quién fuiste en<br>tu <em>vida pasada</em>?',
    hookHtml: 'Doce preguntas. Dos minutos.<br>Y reencuéntrate con tu yo olvidado.',
    metaTime: '⏱️ 2 minutos',
    metaResults: '📜 16 vidas pasadas',
    start: 'Descubrir mi vida pasada →',
    backAria: 'Pregunta anterior',
    loading: 'Desempolvando los recuerdos de tu vida pasada…',
  },
  // Shown only inside the shared end screen (result pages) as an accordion. Plain text, spoiler-free.
  faq: [
    { q: '¿Cómo funciona el test de vida pasada?', a: 'Cada una de tus 12 respuestas suma puntos a varias vidas pasadas, y la que acumula más puntos es la tuya. Todas las versiones del test, en cualquier idioma, puntúan exactamente igual.' },
    { q: '¿Es fiable?', a: 'Es para divertirse, no para adivinar el futuro: un espejo juguetón de tus hábitos de cada día. Aun así, mucha gente se siente sorprendentemente identificada con su resultado.' },
    { q: '¿Puedo obtener otro resultado?', a: 'Sí. Tu resultado depende solo de tus respuestas, así que si respondes de otra manera puedes descubrir una vida pasada distinta.' },
    { q: '¿Se guardan mis respuestas?', a: 'No. Tus respuestas se calculan directamente en tu navegador y nunca se envían ni se almacenan. No necesitas registrarte.' },
  ],
  privacyLink: 'Política de privacidad',
  result: {
    title: 'Test de vidas pasadas: {name}',
    shareText: 'Mi vida pasada: {name} {emoji} — «{tagline}». ¿Y tú, quién fuiste?',
    ctaStrong: 'Un amigo te ha enviado su vida pasada',
    ctaSub: '¿Quieres saber quién fuiste tú? Son solo 2 minutos.',
    eyebrow: 'En tu vida pasada fuiste',
    adviceLabel: 'Consejo para esta vida —',
    good: 'Tu alma gemela',
    bad: 'Tu némesis',
    retry: 'Hacer el test de nuevo',
  },
  og: {
    eyebrow: 'En tu vida pasada fuiste',
    brand: '🔮 Test de vidas pasadas',
    defaultTitle: 'Test de vidas pasadas',
    defaultDesc: '12 preguntas, 2 minutos. ¿Quién fuiste en tu vida pasada?',
  },
  privacy: {
    description: 'Política de privacidad del Test de vida pasada: cómo usamos las cookies, la publicidad y las estadísticas de visitas.',
    h1: 'Política de privacidad',
    introHtml: 'Test de vida pasada (el «Servicio») respeta tu privacidad y solo trata la información mínima necesaria, tal como se describe a continuación.',
    sections: [
      ['1. Información que recopilamos', 'Puedes usar el Servicio sin registrarte ni iniciar sesión. Tus respuestas del test se procesan solo dentro de tu navegador y nunca se guardan en nuestros servidores. Mientras usas el Servicio, puede recopilarse cierta información de forma automática, como se describe a continuación.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies para mostrar anuncios y entender cómo se utiliza. Puedes rechazar o eliminar las cookies desde la configuración de tu navegador; si lo haces, es posible que algunas partes del sitio no funcionen bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios a través de Google AdSense. Google y sus socios pueden usar cookies para mostrarte anuncios basados en tus visitas anteriores a este y a otros sitios web. Puedes obtener más información y cambiar la personalización de anuncios en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Configuración de anuncios de Google</a>.'],
      ['4. Estadísticas (Google Analytics)', 'El Servicio puede usar Google Analytics (GA4) para conocer el número de visitantes y las fuentes de tráfico, y así mejorar. Estos datos se usan solo con fines estadísticos y no te identifican personalmente.'],
      ['5. Contacto', 'Si tienes alguna pregunta sobre esta Política de privacidad, ponte en contacto con el responsable del sitio.'],
      ['6. Entrada en vigor', 'Esta política está vigente desde el 1 de enero de 2026.'],
    ],
    back: '← Volver al Test de vida pasada',
  },

  types: {
    sura: {
      name: 'Gran chef de la cocina real coreana',
      tagline: 'Con una pizca de sal manejabas el humor del rey',
      story: 'En la cocina real de la dinastía Joseon —sí, la del K-drama «La joya del palacio» (Dae Jang Geum)—, el humor del rey dependía de la punta de tus dedos. Más que «¿está salado o soso?», importaba «¿para quién es de verdad este banquete?», y tú siempre lo averiguabas antes que nadie. Dirigías a decenas de ayudantes de cocina con precisión de reloj, pero jamás compartiste ni una sola receta. Perfeccionismo en estado puro: servir cada día la mejor mesa del palacio era todo tu orgullo.',
      traits: ['La comida y el ambiente: todo debe ser perfecto', 'Demuestras con resultados, no con chismes', 'Con los tuyos, abres la despensa de par en par'],
      advice: 'Pasarte de sal de vez en cuando no es grave: todo el mundo te lo perdonará.',
    },
    celadon: {
      name: 'Maestro ceramista del celadón de Goryeo',
      tagline: 'Mil jarrones al horno y casi todos al suelo (por principios)',
      story: 'Pasabas noches en vela junto al horno, con la obsesión de recrear el legendario verde jade del celadón de la dinastía Goryeo, en Corea: un color tan codiciado que hasta los enviados chinos hablaban de él en sus cartas. Si el tono se desviaba lo más mínimo, echabas mano del martillo sin pensarlo dos veces, mientras tus aprendices andaban de puntillas ante unos estándares que no terminaban de entender. Para ti, un jarrón de celadón no era una vasija: era un pedazo de cielo. Tus fracasos superaban con creces a tus obras terminadas, pero lo que el mundo recuerda son tus obras maestras.',
      traits: ['Tus estándares: altos. Demasiado altos.', 'Vas despacio, pero terminas todo como es debido', 'Tu testarudez es silenciosa… pero infinita'],
      advice: 'Detenerte en el intento noventa y nueve también puede ser precioso.',
    },
    hwarang: {
      name: 'Caballero hwarang del reino de Silla',
      tagline: 'Belleza y talento de nivel olímpico… allá por el siglo VI',
      story: 'Entre los mejores con la espada y con los libros… y, encima, con legiones de fans. Eras el as de los hwarang, la élite de «caballeros flor» del antiguo reino coreano de Silla. Mientras recorrías montes y ríos para templar cuerpo y mente, siempre había en algún rincón un grupo de admiradores secretos animándote. Valorabas el honor más que la propia vida, y te daba más vergüenza ganar con trampas que perder. En el campo de batalla o en el mercado, tu nombre siempre estaba en boca de todos.',
      traits: ['Siempre terminas siendo el centro de atención', 'El honor y los principios son sagrados para ti', 'Cuando hay competencia, se te enciende la mirada'],
      advice: 'Disfrutar en compañía vale tanto como ganar, créeme.',
    },
    viking: {
      name: 'Navegante vikingo',
      tagline: 'Si no salía en el mapa, más ganas tenías de ir',
      story: 'Mientras guiabas tu barco entre la niebla del mar del Norte, «peligroso» solo significaba «suena divertido». Por la emoción de avistar una costa que ningún mapa había dibujado jamás, un par de tormentas eran un precio justo. ¿Echar raíces? Nunca: siempre te picaba más la curiosidad por el próximo viaje. Tu tripulación se ponía nerviosa, pero te seguía igual. Al fin y al cabo, siempre volvías con vida.',
      traits: ['Se te iluminan los ojos ante cualquier novedad', 'En plena crisis, mantienes una calma sorprendente', 'Pasar mucho tiempo en un mismo lugar te inquieta'],
      advice: 'A veces está bien echar el ancla y disfrutar de donde estás.',
    },
    pharaoh_cat: {
      name: 'El gato del faraón',
      tagline: 'Te adoraban como a un dios, y tú, a lo tuyo: la siesta',
      story: 'En los palacios del antiguo Egipto eras un gato venerado como un dios. ¿Hacías algo en concreto? No. Simplemente te sentabas en el mejor rincón al sol y observabas cómo los humanos te adoraban por voluntad propia. Eso sí: en cuanto ponías la más mínima cara de fastidio, todo el palacio entraba en pánico… aunque de eso nadie quiere hablar. Parecía que no hacías nada, pero con tu sola presencia lo tenías todo bajo control.',
      traits: ['Observas con elegancia y te mueves lo justo', 'Con una sola mirada cambias el ambiente de la sala', 'Tienes un don para librarte de las tareas'],
      advice: 'Hasta los dioses ganan respeto cuando se dejan ver en persona de vez en cuando.',
    },
    renaissance: {
      name: 'Aprendiz de un pintor renacentista',
      tagline: 'Mezclabas pigmentos… y tu talento te delató',
      story: 'En un taller de Florencia, molías pigmentos y lavabas pinceles a la sombra de un gran maestro. Hasta que un día, mientras él no estaba, rellenaste un rincón del fondo… y resultó ser la parte más natural de todo el cuadro. Fuiste puliendo tu talento en silencio, sin que nadie lo notara, pero sin pausa. Y en la punta de tu pincel escondías un sueño: algún día, un cuadro firmado con tu propio nombre.',
      traits: ['Tienes un ojo increíble para los detalles', 'Brillas en silencio, sin necesidad de fanfarrias', 'Tu gusto es tan firme que el «ya está bien así» no te vale'],
      advice: 'Tu talento ya está listo: es hora de empezar a firmar con tu nombre.',
    },
    jeongi: {
      name: 'Cuentacuentos estrella del viejo Seúl',
      tagline: 'Dominabas el “continuará…” 200 años antes que Netflix',
      story: 'En los mercados del viejo Seúl, la gente lo dejaba todo en cuanto aparecías. Eras un jeongisu, un cuentacuentos profesional que leía en voz alta las novelas de moda ante la multitud. Tu jugada estrella: cortar en seco justo en el momento más emocionante —un «continuará…» de telenovela, pero en carne y hueso— y esperar a que llovieran las monedas para seguir. A decir verdad, la mitad de la historia la improvisabas sobre la marcha, pero sonaba tan convincente que nadie se daba cuenta. En tus manos, hasta el rumor del barrio se volvía una epopeya.',
      traits: ['Tienes un don para adornar cualquier historia', 'Tu sentido del momento y del ambiente es impecable', 'Sabes exactamente cómo atraer a la multitud'],
      advice: 'De vez en cuando, puedes contar el final sin hacerte de rogar.',
    },
    silkroad: {
      name: 'Mercader de la Ruta de la Seda',
      tagline: 'Cada frontera que cruzabas te dejaba más amigos',
      story: 'Cruzabas desiertos y pasos de montaña nevados con tu carga de seda y especias, y los idiomas extranjeros nunca fueron un problema: un par de gestos, una sonrisa y trato hecho. En cada oasis te esperaba un amigo con los brazos abiertos, y esa red de contactos era tu mayor tesoro. Más que mercancías, ibas dejando amistades a tu paso: trotamundos de nacimiento y el alma de cualquier caravana.',
      traits: ['Haces amigos en cualquier parte, y rápido', 'Consigues buen precio sin perder la calidez', 'Te adaptas a otras culturas en un abrir y cerrar de ojos'],
      advice: 'A veces está bien aceptar un regalo sin regatear.',
    },
    monk_scribe: {
      name: 'Monje copista de la Edad Media',
      tagline: 'Copiabas a la luz de una vela sin una sola errata',
      story: 'En un monasterio de la Europa medieval, tu trabajo era copiar las Escrituras sobre pergamino de sol a sol. Con una concentración total, sin desviar la vista ni un segundo… y, aun así, dibujabas a escondidas garabatos absurdos en los márgenes. Donde otros solo veían una repetición interminable, tú encontrabas tu propio ritmo y tu calma. (Dato real: los manuscritos medievales están llenos de dibujitos en los márgenes, como caballeros luchando contra caracoles gigantes.)',
      traits: ['Cuando te concentras, el mundo desaparece', 'Por fuera, calma; por dentro, pura comedia', 'No dejas pasar ni el más mínimo error'],
      advice: 'Cierra el libro y sal a tomar el aire: el mundo no se va a derrumbar.',
    },
    pirate_cook: {
      name: 'Cocinero de un barco pirata',
      tagline: 'Nunca sacaste la espada, pero en el barco mandabas tú',
      story: 'Nunca peleaste ni una sola vez, pero en ese barco tu palabra era ley: con la cena en juego, hasta los piratas más rudos cuidaban sus modales contigo. Eras la única alma tierna entre marineros curtidos, y en los días malos todos terminaban pasándose por la cocina en busca de un poco de consuelo. Rudeza por fuera, sí, pero nadie cuidaba de la gente como tú: el verdadero poder detrás del capitán.',
      traits: ['Demuestras cariño con hechos, sobre todo dando de comer', 'Encajas incluso en los ambientes más rudos', 'Tienes el corazón mucho más tierno de lo que parece'],
      advice: 'Deja de cuidar solo a los demás y permite que alguien te cuide a ti.',
    },
    amhaeng: {
      name: 'Inspector encubierto del rey de Joseon',
      tagline: 'Bajo tus harapos de mendigo escondías la placa del rey',
      story: 'Recorrías los mercados en harapos, pero en la manga escondías el mapae: la placa real con caballos grabados que te acreditaba como inspector secreto del rey, con la misión de cazar a funcionarios corruptos. Te bastaban tres frases de un magistrado sinvergüenza para oler la mentira, y en el momento decisivo revelabas tu identidad y todo daba un giro de ciento ochenta grados: un Zorro de Joseon, pero con placa. Ver la verdad mientras los demás se dejaban engañar por las apariencias: eso sí que era emocionante. Sin más arma que tu sentido de la justicia, recorriste el país como el justiciero de incógnito de Joseon.',
      traits: ['Detectas las mentiras con una precisión asombrosa', 'Miras más allá de las apariencias, hasta lo que es real', 'Cuando sabes que tienes razón, llegas hasta el final'],
      advice: 'No todo el mundo esconde algo: a veces, simplemente confía.',
    },
    gladiator: {
      name: 'Gladiador romano',
      tagline: 'Superestrella del Coliseo y, en secreto, un manojo de nervios',
      story: 'En cuanto pisabas el Coliseo, el público coreaba tu nombre. Detrás de esa cara de carisma arrollador había alguien a quien le temblaban las rodillas cada vez… pero nadie lo notó jamás. «Gano este combate, me retiro y abro una tabernita», te decías… y luego volvías a empuñar la espada. Con el miedo en el cuerpo, pero saltando siempre a la arena: una estrella con un encanto de lo más inesperado.',
      traits: ['Disimulas los nervios como nadie', 'En cuanto pisas un escenario, tu presencia estalla', 'En secreto, guardas sueños sencillos y humildes'],
      advice: 'Admitir que tienes miedo no hará que nadie te respete menos.',
    },
    teahouse: {
      name: 'Dueño de una casa de té de la dinastía Qing',
      tagline: 'Te bastaba ver una cara para adivinar sus penas',
      story: 'En un callejón de la China de la dinastía Qing, tu casa de té nunca estaba vacía. Más famosa que el té era tu intuición: en cuanto un cliente se sentaba, ya te hacías una idea de cómo le había ido el día. Rumores, confidencias, consejos para la vida: todo empezaba en aquella pequeña casa de té. Nunca presionabas a nadie; solo servías una taza y, sin saber cómo, la gente ya se sentía mejor.',
      traits: ['Lees el ambiente en cuestión de segundos', 'Pase lo que pase, te lo tomas con calma', 'La gente se sincera contigo casi sin darse cuenta'],
      advice: 'Por una vez, olvida los problemas ajenos y habla de los tuyos.',
    },
    ninja_mailman: {
      name: 'Ninja de Edo que en realidad era cartero',
      tagline: 'Te movías como una sombra y jamás perdiste una carta',
      story: 'En el Japón de la era Edo eras un ninja de verdad, con un entrenamiento durísimo… pero tu auténtica misión era repartir cartas en secreto. Todo ese talento para saltar tejados y escalar muros servía para una sola cosa: entregar con precisión y nunca, jamás, tarde. Todos imaginaban misiones trepidantes, pero tú vivías cada día con el humilde orgullo de la entrega puntual. Al final, la persona más digna de confianza eras tú.',
      traits: ['Cumples siempre, con precisión y sin fallos', 'Te ganas el respeto con constancia, no con brillo', 'Tu humor sorprende cuando menos se espera'],
      advice: 'Deja de esconder ese talento y presume un poco, que te lo has ganado.',
    },
    atlantis: {
      name: 'Guardián del faro de la Atlántida',
      tagline: 'Mientras la ciudad se hundía, tú mantenías la luz encendida',
      story: 'En la legendaria ciudad de la Atlántida, la noche en que las olas no dejaban de crecer, mantuviste el faro encendido. En pleno terror, mientras la ciudad se hundía, fuiste la única persona que no perdió la calma ni abandonó su puesto. Gracias a ti, los últimos barcos lograron salir del puerto sanos y salvos. No eras de lucirte, pero tenías esa presencia que alguien, en algún lugar, necesita sí o sí.',
      traits: ['Cuanto mayor es la crisis, más calma mantienes', 'Tienes una fuerza serena para mantenerte firme', 'Piensas mucho más hondo de lo que dejas ver'],
      advice: 'Está bien apoyarte en la luz de otra persona de vez en cuando.',
    },
    balhae: {
      name: 'Arquero a caballo de Balhae',
      tagline: 'Nunca fallabas un tiro, ni siquiera al galope',
      story: 'Cabalgando entre los vientos helados del norte —en la frontera de Balhae, un antiguo reino de Manchuria—, tu arco nunca temblaba. Practicaste incontables veces para ese único instante: dar en el centro de la diana desde un caballo a galope tendido. Leal a tu unidad por encima de todo, siempre cabalgabas en primera línea, y tus compañeros te seguían sin dudar. Velocidad y precisión a la vez: una combinación poco común.',
      traits: ['Mantienes la precisión aunque todo vaya a toda velocidad', 'Tu lealtad a los tuyos es a prueba de todo', 'Si tienes una meta, vas directo hacia ella'],
      advice: 'A veces está bien cabalgar sin rumbo, sin ninguna diana a la vista.',
    },
  },

  questions: [
    {
      q: 'En una reunión con amigos, tú normalmente…',
      choices: [
        'Decides qué se va a comer. El menú marca el ambiente.',
        'Te sientas en un rincón y observas en silencio.',
        'Te conviertes, sin proponértelo, en el alma de la fiesta.',
        'Buscas con la mirada lugares nuevos y caras nuevas.',
      ],
    },
    {
      q: 'Cuando algo sale mal de repente, tú…',
      choices: [
        'Primero bostezas. Alguien lo arreglará tarde o temprano.',
        'Investigas en silencio hasta dar con la causa.',
        'Lo conviertes en una anécdota divertidísima para contar después.',
      ],
    },
    {
      q: 'Cuando planeas un viaje, tú…',
      choices: [
        'Tachas de la lista tantos países como sea humanamente posible.',
        'Te pones como meta hacer amigos entre la gente local.',
        'Organizas toda la ruta en torno a la comida.',
      ],
    },
    {
      q: 'Un amigo te cuenta que ha sufrido una injusticia. Tú…',
      choices: [
        'Dices: «A ver, primero reunamos pruebas».',
        'Te mueves rápido y vas a comprobarlo en el acto.',
        'Le pides que se siente, preparas un té y escuchas.',
        'Ayudas en silencio, desde las sombras.',
      ],
    },
    {
      q: 'La fecha límite se acerca y no tienes ni una idea. Tú…',
      choices: [
        'Apagas la luz y te quedas mirando a la nada… hasta que, de golpe, surge la idea.',
        'Haces un montón de borradores rápidos y eliges el mejor.',
        'Reúnes todo el material y las referencias a la perfección antes de empezar.',
      ],
    },
    {
      q: 'Cuando vas de compras, tú…',
      choices: [
        'Vuelves una y otra vez hasta encontrar justo lo que buscas.',
        'Lo compras ya. El arrepentimiento, para después.',
      ],
    },
    {
      q: '¿Cuál es tu papel en un trabajo en grupo?',
      choices: [
        'Marcas el rumbo y empujas a todos hacia adelante.',
        'Terminas tu parte a la perfección, sin hacer ruido.',
        'Te encargas de los detalles y del toque final.',
      ],
    },
    {
      q: 'Si publicaras algo en redes sociales, sería…',
      choices: [
        'Una foto mía en la que salgo muy bien.',
        'Historias de la gente fascinante que conocí viajando.',
        'Una frase del libro que leí hoy.',
        'Una foto del plato que acabo de cocinar.',
      ],
    },
    {
      q: 'Alguien te pide consejo. Tú…',
      choices: [
        'Empiezas por poner los hechos en orden.',
        'Te indignas tanto como la otra persona.',
        'Escuchas en silencio y le das consuelo.',
      ],
    },
    {
      q: 'Cuando aprendes algo nuevo, tu estilo es…',
      choices: [
        'Seguir el manual paso a paso, sin errores.',
        'Observar en silencio y entenderlo primero por tu cuenta.',
        'Lanzarte de cabeza y aprender sobre la marcha.',
      ],
    },
    {
      q: 'Vas a llegar tarde a una cita. Tú…',
      choices: [
        'Total, ya es tarde: llegas con calma y te buscas un buen sitio.',
        'Calculas la ruta exacta para llegar en el momento perfecto.',
        'Llegas tarde, pero haciendo una entrada triunfal.',
        'Aprovechas para probar una ruta totalmente nueva.',
      ],
    },
    {
      q: 'Resume tu día en una frase:',
      choices: [
        'Esquivé todas las tareas pesadas. Día perfecto.',
        'Encontré un poco de belleza en algo pequeño.',
        'No te vas a creer lo que me pasó hoy.',
      ],
    },
  ],
};
