/* Calcular IMC — español. Misma estructura de claves y marcadores que en.js (ver comentarios). Trato: tú. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&display=swap',
    display: "'Outfit'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  num: { kg: '{n} kg', lb: '{n} lb', range: '{min} – {max}' },

  meta: {
    title: 'Calcular IMC – Índice de masa corporal para adultos',
    description: 'Calculadora de IMC gratis para adultos: introduce tu estatura y peso en cm/kg o pies/libras y mira al momento tu índice de masa corporal, su categoría de la OMS y tu peso saludable.',
    ogTitle: 'Calcular IMC ⚖️ Tu IMC y tu peso saludable',
    ogDescription: 'Índice de masa corporal en cm/kg o pies/libras, puntos de corte de la OMS y asiáticos, y el peso saludable para tu estatura.',
  },
  siteName: 'Calcular IMC',
  privacyLink: 'Política de privacidad',

  hero: {
    h1Kicker: 'Calcular IMC',
    h1Html: 'Tu IMC, <em>mientras escribes</em>',
    hook: 'Escribe tu estatura y tu peso para ver tu IMC en una escala de colores y el peso saludable para tu estatura.',
  },

  ui: {
    unitsLabel: 'Unidades',
    metric: 'cm · kg',
    imperial: 'ft · lb',
    height: 'Estatura',
    weight: 'Peso',
    cm: 'cm',
    kg: 'kg',
    ft: 'ft',
    inch: 'in',
    lb: 'lb',
    more: '+ Edad y sexo (opcional)',
    less: '− Ocultar edad y sexo',
    age: 'Edad',
    years: 'años',
    sex: 'Sexo',
    sexNone: 'Sin indicar',
    female: 'Mujer',
    male: 'Hombre',
    asiaToggle: 'Criterio asiático',
    yourBmi: 'Tu IMC',
    waiting: 'Escribe tu estatura y tu peso y aquí aparecerá tu IMC.',
    scaleLabel: 'Escala del IMC',
    rangeTitle: 'Peso saludable para tu estatura',
    toLose: 'Unos {w} por encima del rango saludable',
    toGain: 'Unos {w} por debajo del rango saludable',
    inRange: 'Estás dentro del rango saludable.',
    under18: 'Esta calculadora es para adultos de 18 años o más. En niños y adolescentes el IMC se interpreta con tablas de percentiles por edad y sexo, así que la categoría de arriba no aplica.',
    senior: 'A partir de los 65 años, un IMC algo más alto suele considerarse aceptable. Tu médico puede decirte qué te conviene.',
    sexNote: 'Los puntos de corte del IMC adulto son los mismos para mujeres y hombres, aunque con el mismo IMC las mujeres suelen tener más grasa corporal.',
    disclaimerTitle: 'Antes de sacar conclusiones',
    disclaimer: [
      'El IMC es una cifra orientativa, no un diagnóstico ni un consejo médico.',
      'No distingue músculo de grasa, así que deportistas y personas musculosas pueden salir altos.',
      'No sirve durante el embarazo y esta calculadora es solo para adultos de 18 años o más.',
    ],
    decimalHint: 'Decimales: valen “.” y “,”.',
    finish: 'Ver mi resumen ✓',
    needOne: 'Primero escribe tu estatura y tu peso.',
    localNote: 'Se calcula en tu dispositivo. Nada de lo que escribes se envía ni se guarda.',
    summaryTitle: 'Resumen de tu IMC',
    summaryNote: 'Este resumen solo está en esta página. No se guarda nada.',
    sumScale: 'Criterio',
    sumRange: 'Peso saludable',
    again: 'Empezar de nuevo',
    live: 'IMC {bmi}, {cat}',
    shareTitle: 'Calcular IMC',
    shareText: 'Calcula tu IMC y tu peso saludable en segundos ⚖️',
  },

  scales: {
    who: {
      name: 'OMS',
      note: 'Categorías para adultos de la Organización Mundial de la Salud.',
      labels: ['Bajo peso', 'Peso normal', 'Sobrepeso', 'Obesidad grado I', 'Obesidad grado II', 'Obesidad grado III'],
    },
    alt: {
      name: 'Asia-Pacífico',
      note: 'Criterio de la OMS para Asia-Pacífico (2000): en muchas personas de origen asiático los riesgos de salud aparecen con un IMC más bajo.',
      labels: ['Bajo peso', 'Peso normal', 'Sobrepeso (riesgo)', 'Obesidad grado I', 'Obesidad grado II'],
    },
  },

  errors: {
    badNum: 'Usa solo números, con “.” o “,” para los decimales.',
    heightRange: 'Revisa la estatura: debe estar entre 50 y 272 cm.',
    weightRange: 'Revisa el peso: debe estar entre 10 y 650 kg.',
    inchRange: 'Las pulgadas deben ser menos de 12. Pon los pies enteros en la primera casilla.',
    ageRange: 'La edad debe ser un número entero entre 2 y 120.',
  },

  og: {
    brand: '⚖️ Calcular IMC',
    kicker: 'Estatura · Peso · IMC',
    title: '¿Dónde está tu IMC en la escala?',
    desc: 'Con el peso saludable para tu estatura',
  },

  faq: [
    { q: '¿Cómo se calcula el IMC?', a: 'Se divide el peso en kilos entre la estatura en metros al cuadrado. Con 1,70 m y 65 kg sale 65 ÷ (1,7 × 1,7) ≈ 22,5. Si escribes pies y libras, la calculadora hace la conversión por ti.' },
    { q: '¿Qué IMC es normal en un adulto?', a: 'Según la OMS, de 18,5 a 24,9 es peso normal, de 25 a 29,9 sobrepeso y de 30 en adelante obesidad. Para personas de origen asiático se suelen recomendar cortes más bajos, que puedes activar con el interruptor “Criterio asiático”.' },
    { q: '¿Por qué me sale un IMC alto si hago deporte?', a: 'El IMC solo mira peso y estatura, así que no sabe si ese peso es músculo o grasa. Mucha gente que entrena aparece con sobrepeso estando en forma. La medida de la cintura o un análisis de composición corporal dicen bastante más.' },
    { q: '¿Sirve para niños o durante el embarazo?', a: 'No. Antes de los 18 años se usan tablas de percentiles según edad y sexo, y el aumento de peso en el embarazo tiene sus propias pautas. En esos casos, consulta con tu médico o matrona.' },
  ],

  privacy: {
    title: 'Política de privacidad | Calcular IMC',
    description: 'Política de privacidad de Calcular IMC: tu estatura, peso y edad se quedan en tu navegador; además, cookies, publicidad y estadísticas.',
    h1: 'Política de privacidad',
    introHtml: 'Calcular IMC (el "Servicio") respeta tu privacidad y solo trata la información mínima que se describe a continuación.',
    sections: [
      ['1. Información que recogemos', 'El Servicio funciona sin cuenta ni inicio de sesión. La estatura, el peso, la edad y el sexo que escribes se calculan solo en tu navegador. No se envían a nuestro servidor, no se guardan y no se añaden a ningún enlace. El Servicio solo recuerda en tu dispositivo las unidades que usaste por última vez (cm·kg o ft·lb). Si usas los botones para compartir, solo se comparte la dirección de la página y un texto breve sin tus números, y solo con quien tú elijas.'],
      ['2. Cookies y tecnologías similares', 'El Servicio puede usar cookies y el almacenamiento local del navegador para recordar tu idioma y tus unidades, mostrar anuncios y entender cómo se usa. Puedes rechazarlas o borrarlas en la configuración del navegador; si lo haces, algunas funciones podrían no ir bien.'],
      ['3. Publicidad (Google AdSense)', 'El Servicio muestra anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios según tus visitas anteriores a este y otros sitios. Puedes saber más y cambiar tus preferencias en la <a href="https://adssettings.google.com/" target="_blank" rel="noopener">configuración de anuncios de Google</a>.'],
      ['4. Estadísticas', 'Para mejorar el Servicio podemos usar Google Analytics (GA4) y contadores propios que solo guardan totales diarios por idioma (páginas vistas, cálculos, valoraciones). Tus medidas nunca forman parte de estos datos y nada de esto te identifica personalmente.'],
      ['5. Contacto', 'Si tienes dudas sobre esta política de privacidad, ponte en contacto con el responsable del sitio.'],
      ['6. Fecha de entrada en vigor', 'Esta política está en vigor desde el 24 de octubre de 2026.'],
    ],
    back: '← Volver a Calcular IMC',
  },
};
