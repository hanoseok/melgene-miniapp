module.exports = {
  metaTitle: 'Buscaminas: cómo jugar, trucos e historia',
  description: 'Cómo jugar al Buscaminas online: leer los números, poner banderas, despejar con un toque, trucos para ir más rápido y una breve historia del clásico juego de lógica.',
  h1: 'Buscaminas: cómo jugar, leer los números y despejar más rápido',
  updated: '2026-10-10',
  intro: 'El Buscaminas es un juego de lógica gratuito: una cuadrícula de casillas ocultas, unas cuantas minas y un único objetivo, descubrir todas las casillas que no tienen mina. Una vez que el tablero se abre no hace falta suerte, solo leer los números con cuidado. Esta guía explica las reglas, los controles en el móvil y el ordenador, hábitos para ser más rápido y algo de historia.',
  sections: [
    {
      h: 'Qué es el Buscaminas y cómo funcionan las reglas',
      p: [
        'Al empezar, todas las casillas están tapadas. Al descubrir una, ocurre una de tres cosas. Si esconde una mina, la partida termina. Si es segura y alguna de sus ocho vecinas tiene mina, muestra un número del 1 al 8 con la cantidad exacta. Si es segura y no hay minas alrededor, queda vacía y todas las casillas vacías conectadas se abren solas, así que un solo toque puede despejar una zona grande.',
        'Ganas cuando todas las casillas sin mina están descubiertas. Las banderas son solo una nota para ti: no cuentan para ganar, pero evitan que toques una casilla que ya juzgaste peligrosa y el contador sobre el tablero muestra cuántas minas quedan sin marcar. Hay tres niveles: Fácil (9 × 9, 10 minas), Medio (12 × 12, 24 minas) y Experto (14 × 14, 40 minas).',
      ],
    },
    {
      h: 'Controles y arranque rápido',
      p: [
        'El tablero está pensado para los pulgares: las casillas son lo bastante grandes para tocarlas en el móvil y todo cabe en la pantalla sin desplazarse. Tu primer toque siempre es seguro. Las minas se colocan después de él, nunca en la casilla elegida ni en las contiguas, así que siempre se abre un pequeño espacio con pistas.',
        'El tiempo empieza con ese primer toque. Si cambias de pestaña o de aplicación, el reloj se detiene y el tablero se tapa hasta que vuelvas y toques.',
      ],
      list: [
        'Toca una casilla tapada para descubrirla.',
        'Mantén pulsada una casilla un instante para poner o quitar una bandera, o cambia el botón Cavar / Bandera sobre el tablero al modo bandera y toca.',
        'Toca un número descubierto: si las banderas a su alrededor coinciden con el número, se abren de golpe todas las demás vecinas.',
        'En el ordenador, el clic derecho pone una bandera; las flechas, Intro y la tecla F permiten jugar sin ratón.',
        'El contador muestra minas menos banderas. Si baja de cero, al menos una bandera está mal puesta.',
      ],
    },
    {
      h: 'Estrategia: convertir los números en certezas',
      p: [
        'Empieza por las deducciones más sencillas. Un 1 con una sola vecina tapada indica que esa vecina es mina. Un número cuyas banderas ya completan su valor hace seguras a todas las demás vecinas tapadas. Con estas dos reglas se resuelve la mayor parte de un tablero Fácil.',
        'Cuando no basten, compara números vecinos. Si un 1 toca tres casillas tapadas y otro 1 comparte dos de ellas, la mina está en el par compartido y la tercera casilla del primer número es segura. Mientras exista un movimiento seguro, no adivines.',
      ],
      list: [
        'Las esquinas y los bordes tienen menos vecinas, así que sus números dan pistas más fuertes.',
        'Pon una bandera en cuanto estés seguro y despeja el resto tocando el número.',
        'Si tienes que adivinar, elige la casilla con menos probabilidad de mina y que más información dé.',
        'No te precipites al principio: la velocidad nace de cometer menos errores y hacer menos pausas, no de tocar más rápido.',
      ],
    },
    {
      h: 'Breve historia del Buscaminas',
      p: [
        'Los juegos de esquivar minas ocultas ya existían en los ordenadores domésticos a principios de los años ochenta, por ejemplo Mined-Out en el ZX Spectrum, donde se cruzaba un campo deduciendo las minas por el número de las vecinas. La versión moderna, con cuadrícula y casillas numeradas, se consolidó en los años siguientes.',
        'Se volvió un hábito mundial cuando Microsoft lo incluyó en Windows. Suele decirse que el Solitario enseñó a arrastrar y soltar, y el Buscaminas, a hacer clic con precisión y a usar el botón derecho. Millones de personas lo juegan en sus descansos y hay comunidades que compiten por los tiempos más rápidos.',
      ],
    },
    {
      h: 'Tiempos, competir con amigos y privacidad',
      p: [
        'Al despejar un tablero ves tu tiempo, y tu mejor tiempo de cada nivel se guarda solo en tu navegador. Si otros jugadores han terminado el mismo nivel, un porcentaje indica dónde queda tu tiempo; si aún no hay con quién comparar, se oculta. Las cifras son totales reales.',
        'Para retar a un amigo, comparte tu resultado y acordad el mismo nivel. La disposición es aleatoria en cada partida, así que la suerte se equilibra tras unas rondas. No necesitas cuenta y, tras ganar, solo se envían el nivel y un tiempo redondeado, nunca tu nombre.',
      ],
    },
  ],
  cta: 'Jugar al Buscaminas ahora',
};
