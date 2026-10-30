module.exports = {
  metaTitle: 'Cuadro de torneo: pases, cabezas de serie y sorteo justo',
  description: 'Cómo funciona un cuadro de eliminación directa, qué son los pases directos y las cabezas de serie, cómo usarlo en noches de juegos, la oficina, el deporte o un duelo de favoritos, y por qué el sorteo aleatorio es justo.',
  h1: 'Cuadro de torneo: eliminación directa, pases y cabezas de serie',
  updated: '2026-10-30',
  intro: 'Un cuadro de torneo es la forma más sencilla de convertir una lista larga en un único ganador. Dos se enfrentan, uno pasa, y el cuadro se reduce a la mitad en cada ronda hasta que queda un campeón. Esta guía explica cómo se arma un cuadro de eliminación directa, por qué algunos reciben un pase directo, qué significa ser cabeza de serie, cómo usarlo en noches de juegos, concursos de oficina, deporte o un divertido mundial de favoritos, y por qué un sorteo realmente aleatorio es el punto de partida más justo.',
  sections: [
    {
      h: 'Cómo funciona la eliminación directa',
      p: [
        'En eliminación directa cada partido tiene un ganador y un perdedor, y el perdedor queda fuera. Con 8 participantes se juegan 4 cuartos de final, 2 semifinales y 1 final. De ahí sale una regla sencilla: como cada partido elimina exactamente a uno, un cuadro de n participantes siempre necesita n − 1 partidos para tener campeón. Dieciséis participantes, 15 partidos; 64 participantes, 63.',
        'Las rondas se nombran contando desde el final: la final tiene 2, las semifinales 4, los cuartos 8, y antes vienen los octavos y dieciseisavos. En esta app puedes elegir los ganadores tú mismo, dos tarjetas a la vez, o solo sortear el cuadro y tocar los ganadores después, a medida que se jueguen los partidos de verdad.',
      ],
      list: [
        'Escribe de 2 a 64 nombres u opciones, uno por línea.',
        'Elige sorteo aleatorio o mantén tu orden como cabezas de serie.',
        'Elige ganadores duelo a duelo, o solo sortea el cuadro.',
        'Deshaz una elección o toca otro nombre si cambias de idea.',
        'Guarda el cuadro como PNG, cópialo como texto o comparte un enlace.',
      ],
    },
    {
      h: 'Pases directos: cuando las cuentas no cuadran',
      p: [
        'Un cuadro solo se divide limpiamente si el número de plazas es una potencia de dos: 2, 4, 8, 16, 32 o 64. Los grupos reales casi nunca lo son. Con 6 jugadores el cuadro sigue teniendo 8 plazas, así que dos quedan vacías. Quien cae frente a una plaza vacía recibe un pase directo y avanza a la siguiente ronda sin jugar.',
        'Los pases deben repartirse, no amontonarse. Un buen cuadro nunca enfrenta dos plazas vacías y reparte los pases lo más parejo posible entre la mitad de arriba y la de abajo, para que ningún lado tenga un camino más fácil. La app coloca los pases con el esquema clásico de cabezas de serie, que hace justo eso, y nunca cuenta un pase como partido.',
      ],
    },
    {
      h: 'Cabezas de serie: sorteo o tu propio orden',
      p: [
        'Las cabezas de serie deciden dónde empieza cada uno. En el deporte se ordena a los participantes para que los más fuertes se crucen lo más tarde posible: la 1 juega primero contra la peor, la 2 va a la otra mitad, y así. Si mantienes tu orden en la app, tu lista se convierte en el orden de cabezas de serie: la primera línea es la 1, la segunda la 2, y las mejores reciben los pases primero.',
        'Cuando nadie debe tener ventaja, usa el sorteo. Es ideal para una noche con amigos, una rifa, una lista de comidas o películas, o cualquier grupo donde no quieras que te acusen de amañar los cruces.',
      ],
    },
    {
      h: 'Por qué el sorteo aleatorio es justo',
      p: [
        'Un sorteo solo es justo si cada orden posible tiene la misma probabilidad. Muchas herramientas rápidas mezclan con un azar débil o con un truco de ordenación que favorece en silencio algunas posiciones. Esta app usa el generador aleatorio criptográfico del navegador y el algoritmo de Fisher–Yates con muestreo por rechazo, que elimina el pequeño sesgo que aparece al encajar un número aleatorio en un rango menor. Así, cada disposición de tu lista tiene exactamente la misma probabilidad, y nadie, ni siquiera quien sostiene el móvil, elige quién se cruza con quién.',
        'Ser justo también es que el cuadro siempre cuadre. Si cambias un ganador en una ronda anterior, se borran todos los resultados posteriores que dependían de ese partido, así que un nombre nunca aparece en una ronda a la que no llegó.',
      ],
    },
    {
      h: 'Ideas: noches de juegos, oficina, deporte y mundiales de favoritos',
      p: [
        'En una noche de juegos, mete el nombre de todos, sortea el cuadro y jugad partidas reales de ping-pong, videojuegos o piedra, papel o tijera, tocando a cada ganador. En la oficina, un cuadro es una forma ligera de votar la comida del equipo, el nombre de un proyecto o la mejor taza de la cocina. Clubes y ligas pequeñas pueden sortear una copa de eliminación directa, guardar la imagen y publicarla en el grupo.',
        'En Corea este formato es famoso como el mundial del tipo ideal: eliges tu favorito entre dos, ronda tras ronda, hasta que queda uno. Pruébalo con comidas, canciones, destinos o cualquier cosa que no puedas decidir. El resultado final suele sorprender, y eso es la mitad de la diversión. Al terminar, comparte el enlace para que tus amigos vean todo tu camino hasta el campeón.',
      ],
    },
  ],
  cta: 'Crear un cuadro de torneo',
};
