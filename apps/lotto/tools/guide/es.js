module.exports = {
  metaTitle: "Generador de lotería: guía del azar y las combinaciones",
  description: "Cómo funciona el generador de lotería, si sus números son realmente aleatorios, las matemáticas de las combinaciones y cómo usarlo con responsabilidad.",
  h1: "Generador de lotería: cómo se crean de verdad los números aleatorios",
  updated: "2026-10-09",
  intro: "El generador de lotería saca números para el 6/45 coreano, un juego al estilo Euro, el Powerball de EE. UU. o un rango que elijas, y los hace rodar fuera de una máquina de sorteo en la pantalla. Está hecho solo por diversión. Esta guía explica cómo usarlo, por qué sus números son aleatorios en sentido estricto, cómo son las matemáticas de las combinaciones de lotería, usos creativos más allá de la lotería y cómo jugar con responsabilidad.",
  sections: [
    {
      h: "Cómo funciona el generador",
      p: [
        "Empiezas eligiendo un juego. El 6/45 coreano saca seis números del 1 al 45. El juego estilo Euro saca cinco números del 1 al 50 más dos estrellas del 1 al 12. El Powerball de EE. UU. saca cinco números del 1 al 69 más un Powerball del 1 al 26. Un juego personalizado te permite fijar el número más alto, hasta 100, y cuántos números sacar, hasta diez. Luego eliges cuántas apuestas generar, de una a cinco.",
        "Antes de sacar los números puedes añadir números que quieras mantener y números que quieras descartar. Los números mantenidos aparecen en todas las apuestas y el resto se saca a su alrededor; los descartados nunca aparecen. Estos dos ajustes se aplican solo a los números principales, no a las estrellas ni al Powerball. Cuando pulsas el botón de sorteo, primero se eligen los números, después las bolas giran en la máquina y salen rodando una a una, y por último cada apuesta se muestra ordenada de menor a mayor. Los colores de las bolas siguen los conocidos rangos coreanos y un botón de copiar guarda el resultado en el portapapeles."
      ],
      list: [
        "Elige el 6/45 coreano, estilo Euro, Powerball de EE. UU. o un rango personalizado.",
        "Elige cuántas apuestas sacar, de 1 a 5.",
        "Si quieres, indica números para mantener y para descartar, separados por comas.",
        "Pulsa el botón de sorteo y mira cómo ruedan las bolas.",
        "Copia los números, vuelve a sacar o regresa a los ajustes."
      ]
    },
    {
      h: "¿Son realmente aleatorios los números?",
      p: [
        "El generador usa la fuente aleatoria criptográfica de tu navegador, el mismo tipo de aleatoriedad que sirve para crear claves de seguridad. Sacar un número entero de un rango parece fácil, pero un método descuidado puede favorecer a algunos números. Por ejemplo, si tomas un valor aleatorio grande y usas el resto de dividirlo entre 45, los restos más pequeños salen algo más a menudo. Para evitarlo, la herramienta descarta los pocos valores aleatorios que causarían ese desequilibrio y vuelve a intentarlo, una técnica llamada muestreo por rechazo.",
        "Después los números se eligen sin repetición mediante una mezcla parcial, de modo que en cada paso cada número restante tiene la misma probabilidad. La animación de las bolas rodando se reproduce cuando el resultado ya está decidido y no influye en él. Por eso cada número permitido es igual de probable, y por eso la herramienta no puede dirigirse con el momento ni con una forma especial de pulsar el botón."
      ]
    },
    {
      h: "Las matemáticas de las combinaciones",
      p: [
        "Una lotería es un problema de recuento. En un juego 6/45 hay 8.145.060 conjuntos distintos de seis números. En un juego 5/50 más 2/12 hay 2.118.760 formas de elegir los cinco números principales y 66 formas de elegir las dos estrellas, lo que da 139.838.160 combinaciones en total. En un juego 5/69 más 1/26 hay 11.238.513 formas de elegir los cinco números y 26 opciones para el Powerball, con un total de 292.201.338 combinaciones. Cuantas más combinaciones hay, menos representa un solo boleto.",
        "Cada combinación es exactamente igual de probable que cualquier otra, incluida 1, 2, 3, 4, 5, 6. Los resultados pasados no cambian los sorteos futuros, así que no hay números calientes ni fríos, y mantener o descartar números no cambia nada de las probabilidades. Una diferencia real es cuántos otros jugadores eligen los mismos números. Mucha gente juega fechas de cumpleaños, por lo que las combinaciones formadas solo por números pequeños probablemente se compartan más si ganan, pero eso trata de compartir un premio, no de ganarlo."
      ]
    },
    {
      h: "Formas de usar el generador",
      p: [
        "Un selector aleatorio justo y rápido es útil mucho más allá de la lotería. El modo personalizado lo convierte en una pequeña caja de herramientas para todo lo que necesite números sin sesgo."
      ],
      list: [
        "Sacar números de la suerte por diversión, manteniendo en cada apuesta un número de cumpleaños o aniversario.",
        "Elegir ganadores de un sorteo o regalo numerando a los participantes y sacando un número.",
        "Crear series de números tipo bingo o sacar un número del 1 al 100 para un juego de fiesta.",
        "Decidir quién empieza sacando un número de asiento o de equipo.",
        "Enseñar probabilidad en clase comparando muchos sorteos."
      ]
    },
    {
      h: "Jugar con responsabilidad y privacidad",
      p: [
        "Esta herramienta no es un operador de lotería, no puede vender boletos y no puede predecir ni mejorar tus probabilidades de ganar. Si compras boletos, considera el coste como un gasto de ocio: fija un presupuesto de antemano, compra solo a operadores autorizados, respeta las reglas de edad mínima de donde vives y para cuando deje de ser divertido. Si el juego te está causando problemas, ponte en contacto con un servicio de ayuda local.",
        "Los números que escribes y los números sacados se procesan en tu navegador y no se envían a nuestro servidor. No se guarda nada de tus apuestas. La página puede recordar preferencias básicas, como tu idioma. Usa el botón de copiar si quieres conservar un resultado."
      ]
    }
  ],
  cta: "Sacar mis números"
};
