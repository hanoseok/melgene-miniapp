module.exports = {
  metaTitle: 'Guía de sudoku: reglas, técnicas y un poco de historia',
  description: 'Cómo jugar al sudoku online: las reglas, las notas y las pistas, técnicas desde el single hasta el X-Wing, qué significan los cuatro niveles y una breve historia del pasatiempo.',
  h1: 'Sudoku: cómo jugar, resolver mejor y disfrutar cada cuadrícula',
  updated: '2026-10-12',
  intro: 'El sudoku es un pasatiempo de lógica gratuito que se juega en una cuadrícula de 9 por 9. Algunas casillas ya traen un número y tu tarea es completar las demás para que cada fila, cada columna y cada caja de 3 por 3 tenga los números del 1 al 9 una sola vez. No hace falta hacer cuentas y un sudoku bien hecho nunca te obliga a adivinar. En esta guía encontrarás las reglas, los controles en el móvil y en el ordenador, las técnicas para pasar de Fácil a Experto y un poco de la historia viajera de este juego.',
  sections: [
    {
      h: 'Qué es el sudoku y cómo funcionan las reglas',
      p: [
        'La cuadrícula tiene 81 casillas repartidas en nueve filas, nueve columnas y nueve cajas de tres por tres. El sudoku empieza con algunos números dados, normalmente entre veinte y cuarenta, que no se pueden cambiar. Cada casilla vacía debe llevar un número del 1 al 9, y ningún número puede repetirse en la misma fila, la misma columna o la misma caja. Cuando todas las casillas están llenas sin romper esa regla, el sudoku está resuelto.',
        'En realidad los números son solo nueve símbolos distintos: podrías jugar con letras o colores y nada cambiaría. Por eso el sudoku es un juego de colocar y descartar, no un problema de matemáticas. Cada cuadrícula de esta página se crea en tu navegador y un programa la comprueba antes de mostrártela, así que tiene exactamente una solución y se puede completar solo con razonamiento.',
      ],
    },
    {
      h: 'Controles y primeros pasos',
      p: [
        'Elige un nivel y toca Nuevo sudoku. Toca una casilla vacía para seleccionarla: su fila, su columna y su caja se sombrean para que veas con qué casillas se relaciona, y si ya tiene un número, todas las copias de ese número se resaltan en la cuadrícula. Después toca un número del teclado que hay debajo. La cifra pequeña bajo cada número indica cuántos faltan todavía, una forma rápida de encontrar los números casi terminados.',
        'La partida se guarda en este navegador después de cada jugada. Si cierras la página, la pantalla de inicio te ofrecerá Seguir jugando con el nivel y el tiempo. El reloj se detiene en cuanto cambias de pestaña o de app, y la cuadrícula queda tapada hasta que vuelves, así que una interrupción no te cuesta nada.',
      ],
      list: [
        'Notas pasa el teclado a modo lápiz: cada número que tocas se escribe o se borra en pequeño en la casilla elegida.',
        'Borrar vacía la casilla seleccionada y Deshacer retrocede jugada a jugada.',
        'Pista rellena una casilla correcta por ti. Tienes tres por sudoku, y un sudoku resuelto con pista no entra en la comparación de tiempos.',
        'Revisar pone en rojo los números que no coinciden con la solución. Sin Revisar, solo se marcan los choques directos en una fila, columna o caja.',
        'En el ordenador, muévete con las flechas, rellena con las teclas del 1 al 9, borra con Retroceso, activa las notas con N y deshaz con Z.',
      ],
    },
    {
      h: 'Técnicas de resolución, del single al X-Wing',
      p: [
        'Casi todos los sudokus empiezan con singles. Un single desnudo es una casilla en la que su fila, su columna y su caja ya descartan ocho de los nueve números, así que solo cabe uno. El single oculto es la mirada contraria: dentro de una fila, columna o caja solo queda una casilla donde puede ir cierto número. Revisar cada número a lo largo de tres cajas en línea es la forma más rápida de encontrarlos, y los sudokus fáciles de esta página se resuelven solo con estas dos ideas.',
        'Los niveles Medio y Difícil piden algo más. Con la técnica de apuntado, si dentro de una caja un número solo puede ir en una fila, ese número no puede aparecer en el resto de esa fila. Con la pareja desnuda, dos casillas de un mismo grupo que solo tienen los mismos dos candidatos se reservan esos dos números, y puedes quitarlos del resto del grupo. Los difíciles pueden necesitar además un trío desnudo o un X-Wing, cuando un número queda encerrado en las mismas dos columnas en dos filas distintas. Los de nivel Experto tienen menos pistas y exigen cadenas de razonamiento más largas.',
      ],
      list: [
        'Empieza a anotar candidatos solo cuando se acaben los singles. Las notas brillan en los sudokus difíciles.',
        'En cuanto colocas un número, quítalo de las notas de su fila, columna y caja. El juego lo hace por ti.',
        'Si te atascas, mira en el teclado qué números tienen solo una o dos copias pendientes y céntrate en ellos.',
        'No adivines a propósito. Si dos opciones parecen posibles, busca una tercera casilla que decida entre ellas.',
      ],
    },
    {
      h: 'Una breve historia del sudoku',
      p: [
        'El pasatiempo es más antiguo que su nombre. Los cuadrados latinos, cuadrículas donde cada símbolo aparece una vez por fila y por columna, ya los estudió el matemático Leonhard Euler en el siglo XVIII, y en la década de 1890 algunos periódicos franceses publicaban pasatiempos numéricos con reglas parecidas. La forma moderna, con sus nueve cajas, apareció en 1979 en una revista de pasatiempos estadounidense con el nombre de Number Place y suele atribuirse al creador de acertijos Howard Garns.',
        'En 1984 la editorial japonesa Nikoli lo llevó a Japón y lo bautizó como sudoku, abreviatura de una frase que viene a decir que cada número debe quedarse solo. En Japón también se le llama a menudo Nanpure, por Number Place. La fiebre mundial llegó en 2004 y 2005, cuando los periódicos británicos empezaron a publicarlo a diario, y desde entonces no ha faltado en periódicos, libros de pasatiempos y móviles.',
      ],
    },
    {
      h: 'Niveles, sudoku del día y comparaciones justas',
      p: [
        'Los cuatro niveles dependen de dos cosas: cuántas pistas quedan y qué técnicas necesita un evaluador integrado para resolver la cuadrícula. Fácil deja muchas pistas y se resuelve solo con singles. Medio quita más números y permite descartes sencillos. Difícil se elige para que haga falta al menos una técnica intermedia, y Experto reduce la cuadrícula al mínimo de pistas manteniendo una única solución. El sudoku del día se genera a partir de la fecha, uno por nivel e igual para todo el mundo, y cambia a medianoche UTC, ideal para retar a un amigo con el mismo sudoku.',
        'Cuando resuelves un sudoku sin pistas, tu tiempo queda como tu récord de ese nivel solo en tu navegador, y la pantalla de resultado muestra dónde se sitúa entre los tiempos reales de otros jugadores. A nuestro servidor solo llegan el nivel y un tiempo redondeado hacia abajo en tramos de cinco segundos, nunca tu nombre, y la comparación se oculta mientras no haya con qué comparar.',
      ],
    },
  ],
  cta: 'Jugar al sudoku ahora',
};
