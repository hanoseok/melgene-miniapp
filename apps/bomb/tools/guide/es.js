module.exports = {
  metaTitle: 'Papa caliente: reglas, variantes para fiestas y mecha justa',
  description: 'Cómo jugar a la papa caliente con un solo móvil: elegir jugadores y largo de mecha, variantes para fiestas, por qué la mecha secreta es justa y consejos para jugar seguros y divertirse.',
  h1: 'Papa caliente: el juego de pasar la bomba en el móvil',
  updated: '2026-10-24',
  intro: 'La papa caliente es uno de los juegos de grupo más sencillos: algo pasa de mano en mano en un círculo, nadie sabe cuándo se acabará el tiempo y quien lo tenga en ese momento pierde. En esta versión, tu móvil es la papa. Enciendes una mecha, tocas la bomba, le pasas el teléfono al siguiente y el tictac se acelera hasta que, en un momento secreto, todo explota. Esta guía explica cómo jugar, propone variantes para distintos grupos, cuenta por qué el momento de la explosión es de verdad aleatorio y da algunos consejos para que todos lo pasen bien.',
  sections: [
    {
      h: 'Cómo se juega',
      p: [
        'Primero elige si queréis escribir nombres. Con Jugar ya nadie escribe nada: os pasáis el móvil en círculo y quien lo tenga cuando explote, pierde. Con nombres, escribe de 2 a 12 jugadores en el orden en que estáis sentados. La pantalla mostrará quién tiene la bomba y, tras cada toque, a quién pasarla, y al final aparecerá el nombre de quien perdió.',
        'Después elige el largo de la mecha. Una corta arde entre 10 y 25 segundos, una normal entre 20 y 45 y una larga entre 40 y 80. Nunca verás la cifra real. Pulsa el botón de inicio, toca la bomba grande, pasa el móvil y no dejes que se pare. Tras cada toque hay una breve pausa para que nadie pueda dar la vuelta entera tocando él solo.',
      ],
      list: [
        'Elige Jugar ya o escribe a los jugadores en orden de pase.',
        'Elige mecha corta, normal o larga.',
        'Activa las pistas o las tarjetas de prenda si quieres.',
        'Enciende la mecha, toca la bomba y pasa el móvil.',
        'Cuando explote, quien tenga el móvil pierde.',
      ],
    },
    {
      h: 'Variantes para fiestas',
      p: [
        'El juego básico funciona con cualquier grupo, pero pequeños cambios lo mantienen fresco. Para romper el hielo, usa una mecha corta y pide que cada uno diga su nombre y su comida favorita antes de pasar. Para una noche de juegos larga, jugad por eliminación: quien pierde se retira, se editan los nombres y gana el último que quede.',
        'También podéis complicar el pase. Elegid una categoría, como animales, países o películas, y hay que decir una respuesta sin repetir antes de tocar la bomba. Si dudas demasiado, puede que te explote en las manos. Las tarjetas de prenda, opcionales, añaden un reto pequeño y simpático para quien pierda.',
      ],
      list: [
        'Ronda temática: di algo de la categoría antes de pasar.',
        'Eliminación: quien pierde se retira hasta que quede uno.',
        'Por equipos: dos equipos se turnan y gana el que menos pierda.',
        'En clase: quien pierda responde la siguiente pregunta.',
        'En familia: quien pierda elige el próximo juego o recoge la mesa.',
      ],
    },
    {
      h: 'Por qué la mecha secreta es justa',
      p: [
        'En cuanto enciendes la mecha, la app elige la hora de la explosión con el generador aleatorio criptográfico del navegador, crypto.getRandomValues. Usa muestreo por rechazo, que descarta los pocos valores que harían algunos momentos un poco más probables, así que cada milisegundo del rango elegido tiene la misma probabilidad. El momento se decide antes del primer pase y nunca se muestra, ni siquiera a quien tiene el móvil.',
        'El tictac, la vibración y la pista opcional de las chispas sí se aceleran hacia el final, porque eso es lo que hace emocionante la papa caliente. Pero cuándo empieza la aceleración, lo brusca que es, su velocidad máxima y algunos acelerones falsos por el medio cambian en cada ronda. El ritmo acelera el corazón sin decir cuánto tiempo queda. Si el juego pasa a segundo plano, la mecha se detiene, para que nadie pierda por culpa de una notificación.',
      ],
    },
    {
      h: 'Consejos para jugar seguros',
      p: [
        'Como el móvil va de mano en mano muy rápido, un poco de cuidado ayuda mucho. Pásalo en la mano en vez de lanzarlo, jugad sentados o de pie sin moveros y apartad las bebidas del círculo. Acordad antes de empezar qué significa perder, para que el resultado se reciba con una risa y no con una discusión.',
      ],
      list: [
        'Entrega el móvil en la mano, nunca lo lances.',
        'Sujétalo con las dos manos y con firmeza.',
        'Silencia el sonido en sitios tranquilos, la vibración sigue funcionando.',
        'Que las prendas sean amables y saltad cualquier tarjeta que incomode.',
        'Con niños pequeños, usa la mecha larga para un ritmo más tranquilo.',
      ],
    },
    {
      h: 'De dónde viene la papa caliente',
      p: [
        'Pasar un objeto mientras se acaba el tiempo es una idea antigua. Muchos juegos infantiles usan música que se para en un momento desconocido, y el nombre papa caliente viene de la imagen de algo demasiado caliente para sostenerlo mucho rato. Se ha jugado durante generaciones en cumpleaños, patios de colegio y campamentos de verano, a menudo con una pelota, una bolsita de semillas o un paquete envuelto.',
        'Más tarde, los fabricantes de juguetes añadieron temporizadores electrónicos y bombas que suenan o saltan tras un tiempo aleatorio, y ya no hacía falta alguien que controlara la música. Esta app sigue la misma idea con un solo móvil: un temporizador justo y oculto, un sonido que pone nervioso y un resultado inmediato, para que todo el grupo juegue sin que nadie tenga que quedarse fuera haciendo de árbitro.',
      ],
    },
  ],
  cta: 'Jugar a la papa caliente',
};
