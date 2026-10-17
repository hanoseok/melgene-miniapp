module.exports = {
  metaTitle: 'Toros y vacas: cómo jugar, trucos e historia del juego',
  description: 'Cómo jugar a Toros y vacas (Bulls and Cows, béisbol de números): las reglas, cómo leer las pistas, trucos de razonamiento y la historia del juego y su relación con Mastermind.',
  h1: 'Toros y vacas (béisbol de números): cómo jugar y cómo razonar',
  updated: '2026-10-18',
  intro: 'Toros y vacas es un juego clásico de descifrar códigos para un solo jugador: hay un número secreto escondido, tú pruebas y cada intento te da una pequeña pista. En muchos países se conoce como béisbol de números porque las pistas se llaman strikes, bolas y outs. Esta guía explica las reglas de la versión de este sitio, cómo leer las pistas, algunas formas de pensar que hacen el rompecabezas más fácil, de dónde viene el juego y cómo disfrutarlo con amigos.',
  sections: [
    {
      h: 'Qué es Toros y vacas',
      p: [
        'La computadora elige un número secreto formado por cifras distintas. En el nivel clásico tiene 3 cifras y en el más difícil 4. Una cifra nunca aparece dos veces, pero el cero está permitido, incluso al principio, así que 072 es un número secreto perfectamente válido. Eso da 720 secretos posibles con tres cifras y 5.040 con cuatro, y todos son igual de probables porque las cifras se mezclan con un barajado justo en cada ronda.',
        'Tu objetivo es encontrar el número con el menor número de intentos posible. Después de cada intento te dicen lo cerca que estuviste, pero no qué cifras acertaste, y de ahí sale el reto. No hay tiempo límite a menos que actives el cronómetro, y tampoco hay botón de pistas, de modo que todo el juego consiste en razonar con cuidado.',
      ],
    },
    {
      h: 'Cómo es una ronda',
      p: [
        'Elige 3 o 4 cifras en la pantalla de inicio y pulsa Empezar. Escribe un número de la misma longitud con el teclado de la pantalla o el de tu equipo y pulsa Probar. Tu intento no puede repetir una cifra, y un número que ya probaste no se vuelve a contar.',
      ],
      list: [
        'Un toro (strike) es una cifra correcta en la posición correcta.',
        'Una vaca (bola) es una cifra que está en el número secreto pero en otra posición.',
        '“Nada” (out) significa que ninguna de tus cifras aparece en el número secreto.',
        'Ganas cuando todas las cifras son toros. El resultado muestra cuántos intentos necesitaste.',
        'Si te atascas, pulsa Rendirme dos veces para ver la respuesta y empezar una ronda nueva. Una ronda en la que te rindes no cuenta para tus marcas.',
      ],
    },
    {
      h: 'Formas de pensar que ayudan',
      p: [
        'Los principiantes suelen probar números al azar y esperar suerte. Un hábito mejor es tratar cada respuesta como un pequeño dato y anotar qué descarta. Incluso una libreta sencilla, en papel o en la cabeza, hace que el juego parezca mucho menos cuestión de suerte.',
      ],
      list: [
        'Suma los toros y las vacas. Ese total te dice cuántas de tus cifras están en el número secreto, estén donde estén.',
        '“Nada” es muy valioso. Descarta de golpe todas las cifras que usaste y ya no tienes que pensar en ellas.',
        'Cambia solo una o dos cosas entre intentos. Si la pista cambia, sabes que la cifra que cambiaste es la causa.',
        'Prueba las posiciones por separado de las cifras. Cuando sepas que una cifra está dentro, muévela para descubrir su sitio.',
        'Procura que cada intento aún pueda ser la solución. Si contradice algo que ya sabes, no puede ganar y desperdicias un turno.',
        'No te aferres al primer acierto afortunado. Comprueba que encaja con todas las pistas anteriores antes de construir sobre él.',
      ],
    },
    {
      h: 'De dónde viene el juego',
      p: [
        'Toros y vacas es un juego antiguo de lápiz y papel, normalmente entre dos personas que se turnan como creador del código y adivino. Se considera el antecesor de Mastermind, el juego de tablero con clavijas de colores publicado a principios de los años setenta. En esa misma década una versión informática llamada Moo se jugaba en una computadora central de la Universidad de Cambridge, y desde entonces es un ejercicio favorito de los programadores.',
        'La idea ha viajado con nombres locales. En Corea es el béisbol de números, cuyo vocabulario sigue esta página; en Japón se llama a menudo Hit and Blow, en China 1A2B, y en español o ruso se usan los nombres de toros y vacas. Se ha demostrado con ordenadores que, jugando a la perfección, cualquier número secreto de cuatro cifras se resuelve en siete intentos como máximo y en algo más de cinco de media, así que acercarse a eso es excelente para una persona.',
      ],
    },
    {
      h: 'Jugar con amigos y seguir tu progreso',
      p: [
        'Es fácil convertir el juego en un duelo amistoso. Acordad el número de cifras, jugad todos varias veces el mismo nivel y comparad quién necesita menos intentos. Como lo único oculto es el número secreto, después de una ronda también podéis comentar vuestro razonamiento, una buena manera de aprender trucos nuevos.',
        'Tu mejor marca de cada nivel se guarda solo en este navegador. Cuando resuelves una ronda, tu número de intentos se compara con los resultados reales de otros jugadores del mismo nivel, y si todavía no hay nada con que comparar, la comparación simplemente no se muestra. Intenta superar tu propia marca y luego prueba el nivel de cuatro cifras como reto mayor.',
      ],
    },
  ],
  cta: 'Jugar a Toros y vacas',
};
