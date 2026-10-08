module.exports = {
  "metaTitle": "Juego 2048: cómo jugar, estrategia y origen",
  "description": "Aprende a jugar al 2048, por qué funciona la estrategia de la esquina, cómo se calcula la puntuación y de dónde viene el juego. Luego juega gratis.",
  "h1": "Juego 2048: cómo jugar y llegar a la ficha 2048",
  "updated": "2026-10-09",
  "intro": "El 2048 parece sencillo: deslizar fichas numeradas por un tablero de cuatro por cuatro y fusionar las iguales. Sin embargo, tiene una profundidad sorprendente. Esta guía explica las reglas, la puntuación, las técnicas de estrategia de los jugadores con experiencia y la breve historia de uno de los puzles más copiados de la última década.",
  "sections": [
    {
      "h": "Cómo jugar",
      "p": [
        "El tablero es una cuadrícula de cuatro por cuatro con un par de fichas numeradas. Desliza el dedo sobre el tablero o pulsa las flechas (o W, A, S, D) y todas las fichas se deslizan lo más lejos posible en esa dirección. Cuando dos fichas con el mismo número chocan, se fusionan en una ficha con el doble de valor: dos 2 forman un 4 y dos 64 forman un 128.",
        "Tras cada movimiento que realmente cambia el tablero, aparece una ficha nueva en una casilla vacía. Casi siempre es un 2 y, más o menos una de cada diez veces, un 4. Si tu deslizamiento no mueve nada, no se añade ficha. Tu objetivo es crear una ficha con el número 2048. Cuando lo consigas, puedes seguir para lograr más puntos o terminar ahí."
      ],
      "list": [
        "Desliza o usa las teclas para mover todas las fichas a la vez.",
        "Dos vecinas iguales se fusionan en una ficha con el doble de valor.",
        "Aparece un 2 o un 4 nuevo tras cada movimiento que cambia el tablero.",
        "La partida acaba cuando el tablero está lleno y ninguna vecina coincide."
      ]
    },
    {
      "h": "Reglas que conviene conocer",
      "p": [
        "Una ficha solo puede fusionarse una vez por movimiento. Si una fila tiene 2, 2, 2, 2, un deslizamiento produce dos 4, no un 8, y la pareja más cercana a la pared hacia la que deslizas se fusiona primero. Este detalle importa cuando planificas una cadena de fusiones.",
        "No hay cronómetro ni deshacer, así que cada movimiento es definitivo. Tu puntuación sube según el valor de cada ficha nueva que creas, de modo que una fusión que produce un 512 suma 512 puntos. Las fusiones grandes valen mucho más que las pequeñas. Tu mejor puntuación se guarda en este navegador y, al terminar una partida, tu resultado puede compararse de forma anónima con el de otros jugadores para mostrar un porcentaje."
      ]
    },
    {
      "h": "Estrategia: mantén tu ficha mayor en una esquina",
      "p": [
        "El hábito más útil es elegir una esquina y conservar allí tu ficha más grande. Construye una cadena descendente por el borde, con la mayor en la esquina, la siguiente a su lado y así sucesivamente, como una serpiente. Como las fichas de la cadena tienen valores cercanos, se fusionan en orden en lugar de atascarse.",
        "Elige dos direcciones principales, por ejemplo abajo e izquierda si tu esquina es la inferior izquierda. Usa una tercera solo cuando sea necesario e intenta no usar la cuarta, porque es el movimiento que arrastra tu ficha grande fuera de la esquina. Si no te queda otra, comprueba antes que la fila de la esquina esté llena para que la ficha no pueda escapar."
      ],
      "list": [
        "Elige una esquina y deja allí tu ficha más grande.",
        "Prefiere dos direcciones principales y usa la tercera con moderación.",
        "Llena la fila de tu cadena antes de construir la siguiente.",
        "Fusiona las fichas pequeñas cerca de la cadena, no lejos de ella."
      ]
    },
    {
      "h": "Errores comunes",
      "p": [
        "Los principiantes suelen deslizar en las cuatro direcciones para perseguir fusiones fáciles. Eso dispersa las fichas grandes por el tablero y deja atrapadas a las pequeñas entre ellas. Otro error es gastar movimientos en fusiones diminutas mientras una ficha grande no tiene pareja cerca.",
        "Mira uno o dos movimientos por delante. Antes de cada deslizamiento, pregúntate dónde podría caer la nueva ficha y si el movimiento abre una fila o la bloquea. Cuando el tablero se llena, ve más despacio: un solo gesto descuidado puede acabar la partida, mientras que la paciencia puede salvar una posición caótica."
      ]
    },
    {
      "h": "De dónde viene el 2048",
      "p": [
        "El 2048 fue creado por el desarrollador italiano Gabriele Cirulli en marzo de 2014 como proyecto de fin de semana. Se inspiró en juegos anteriores como 1024 y Threes, y publicó el código abiertamente, lo que dio lugar a incontables variantes y clones. El número 2048 es dos elevado a once y, en teoría, un tablero de cuatro por cuatro puede llegar a una ficha de 131072.",
        "Esta versión añade un aire de Halloween, pero las reglas son las clásicas. Juega unas partidas, prueba la estrategia de la esquina y comparte tu puntuación con un amigo para ver quién llega más lejos."
      ]
    }
  ],
  "cta": "Jugar al 2048"
};
