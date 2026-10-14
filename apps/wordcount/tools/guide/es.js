module.exports = {
  metaTitle: 'Contador de palabras: guía para contar caracteres y bytes',
  description: 'Cómo un contador de palabras cuenta caracteres con y sin espacios, palabras y bytes, por qué Word y las webs no coinciden, límites habituales como los 280 caracteres de X y consejos para escribir justo a la medida.',
  h1: 'Guía del contador de palabras: qué se cuenta, por qué las herramientas no coinciden y cómo ajustarte a un límite',
  updated: '2026-10-15',
  intro: 'Los límites de extensión están en todas partes: una carta de motivación de 2.000 caracteres con espacios, un post de 280 caracteres, una meta descripción que se corta hacia los 155 caracteres, un resumen de TFG limitado en palabras. Un buen contador te dice dónde estás mientras escribes, para no recortar a toda prisa en el último minuto. Esta guía explica cómo usar la herramienta, cómo se define cada número, por qué los programas no siempre coinciden, qué límites te vas a encontrar y cómo escribir cómodamente hasta un objetivo.',
  sections: [
    {
      h: 'Cómo usar el contador de palabras',
      p: [
        'Escribe directamente en el cuadro o pega un texto de cualquier sitio. La barra azul oscuro de arriba muestra los cuatro números que más se consultan: caracteres con espacios, caracteres sin espacios, palabras y bytes. Sigue a la vista mientras te desplazas por un borrador largo. Debajo, el conteo detallado añade frases, párrafos, líneas y una estimación del tiempo de lectura y de habla.',
        'Si escribes con un límite, elige 500, 1.000 o 1.500 caracteres, o pon tu propio número. Una barra se llena mientras escribes, se vuelve naranja cerca del final y roja al pasarte, y te dice cuántos caracteres quedan o cuántos sobran. Con el interruptor «Contar espacios» decides si el límite sigue el número con o sin espacios. Al terminar, «Ver resumen» muestra un resumen listo para copiar.',
      ],
      list: [
        'Pega o escribe tu texto: los números cambian con cada tecla.',
        'Fija un objetivo y elige si cuentan los espacios.',
        'Elige la regla de bytes de tu formulario: UTF-8, UTF-8 + CRLF o antiguo 2 bytes.',
        'Limpia un texto pegado con «Limpiar espacios» o «Unir líneas»; «Deshacer» lo recupera.',
        'Tu borrador se guarda solo en este navegador y no se pierde al recargar.',
      ],
    },
    {
      h: 'Cómo se define cada número',
      p: [
        'Los caracteres con espacios cuentan todo lo que el ojo ve como un carácter, más los espacios y los saltos de línea; cada salto vale 1. Una letra con tilde como á, la ñ, una bandera o un emoji de familia formado por varios códigos cuentan como un solo carácter. Los caracteres sin espacios restan de ese total todos los espacios, tabulaciones y saltos de línea.',
        'Las palabras se detectan con el separador lingüístico que trae el navegador. Una secuencia de letras o números es una palabra y las palabras con guion, como «e-mail», cuentan una vez. Las frases terminan en punto, signo de interrogación o de exclamación, y los párrafos se separan con una línea en blanco.',
        'El tiempo de lectura supone unas 238 palabras por minuto leyendo en silencio, la media de un adulto, y el tiempo de habla unas 150 palabras por minuto, un ritmo de exposición tranquilo.',
      ],
      list: [
        'UTF-8: 1 byte para letras sin tilde, números y espacios, 2 para á, é, ñ, ü, 3 para chino, japonés y coreano, 4 para la mayoría de los emoji.',
        'UTF-8 + CRLF: igual, pero cada salto de línea cuenta 2 bytes, como un archivo de texto de Windows.',
        'Antiguo 2 bytes: ASCII 1 byte, cualquier otro carácter 2 y el salto de línea 2 (EUC-KR, Shift_JIS, GBK).',
      ],
    },
    {
      h: 'Por qué Word, Google Docs y las webs dan totales distintos',
      p: [
        'No hay una única regla oficial, así que pequeñas diferencias son normales. Word no cuenta las marcas de párrafo como caracteres, mientras que muchos formularios web sí cuentan los saltos de línea, a veces como dos. Algunas herramientas cuentan cada unidad de código Unicode y un emoji termina valiendo dos o más. Tampoco todos tratan igual las palabras con guion, los números o los correos.',
        'Lo más seguro es leer las instrucciones del formulario, ajustar el contador igual y dejar un margen de unos pocos caracteres en lugar de clavar el límite. Antes de enviar, pega el texto en el campo real y revisa el número que muestra la web.',
      ],
    },
    {
      h: 'Límites que te vas a encontrar',
      p: [
        'Las solicitudes de becas, másteres y empleo suelen fijar la extensión en caracteres con espacios, por ejemplo 2.000 para una carta de motivación. Los resúmenes y abstracts se limitan más bien en palabras. Comprueba siempre si se habla de caracteres o de palabras, y con o sin espacios.',
        'Cada red social tiene su tope, y cambia de vez en cuando. En X un post estándar admite 280 caracteres, aunque los caracteres chinos, japoneses y coreanos cuentan doble. Los buscadores suelen mostrar de 150 a 160 caracteres de una meta descripción antes de cortarla.',
      ],
      list: [
        'X (Twitter): 280 caracteres.',
        'Pie de foto de Instagram: 2.200 caracteres.',
        'YouTube: título de 100 caracteres, descripción de 5.000.',
        'SMS: 160 caracteres, o 70 si lleva emoji o caracteres especiales.',
        'Meta descripción: apunta a unos 150 a 160 caracteres.',
      ],
    },
    {
      h: 'Consejos para escribir hasta un límite',
      p: [
        'Escribe primero todo lo que quieres decir sin mirar el número y luego recorta. Acortar un borrador largo casi siempre da un texto más firme que inflar uno corto. Empieza por lo que más ahorra: la frase que repite la pregunta, muletillas como «cabe destacar que» y adverbios como «realmente» o «muy». El panel de palabras repetidas ayuda: si una palabra sale cinco veces en un texto corto, suele ser repetición y no énfasis.',
      ],
      list: [
        'Apunta al 90-100 % del límite; una respuesta muy corta parece poco trabajada.',
        'Deja un margen de unos caracteres para formularios que cuentan los saltos de otra forma.',
        'Tras pegar desde un PDF o un correo, usa «Limpiar espacios».',
        'Si es un discurso, léelo en voz alta y revisa el tiempo de habla.',
        'Guarda también la versión final en otro sitio: el borrador solo vive en este navegador.',
      ],
    },
  ],
  cta: 'Contar mi texto ahora',
};
