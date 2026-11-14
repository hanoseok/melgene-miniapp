module.exports = {
  metaTitle: 'Sortear orden: guía para un orden justo en grupo',
  description: 'Cómo sortear el orden de exposiciones, turnos de juego o tareas de limpieza, por qué la mezcla es justa y consejos para revelar el orden delante de un grupo.',
  h1: 'Sortear orden: un orden justo del primero al último',
  updated: '2026-11-15',
  intro: 'Decidir quién empieza parece poca cosa hasta que toda una clase, un equipo o una familia está esperando la respuesta. Siempre hay alguien que cree que el orden está amañado, o que nota que siempre salen primero los mismos. Sortear orden lo resuelve en un paso: escribes los nombres, mezclas una vez y el orden completo, del primero al último, queda fijado al instante. Esta guía explica cómo funciona la herramienta, por qué el resultado es justo, para qué sirve un orden aleatorio y cómo revelarlo para que todos lo acepten.',
  sections: [
    {
      h: 'Cómo funciona',
      p: [
        'La primera pantalla es toda la preparación. Primero elige para qué es el orden: exposiciones, turnos de juego o limpieza. Esa etiqueta solo cambia el título del resultado, así que puedes ignorarla si solo necesitas una lista. Después escribe o pega los nombres, uno por línea. Sirve una lista copiada de WhatsApp o de una hoja de cálculo, y las comas también separan nombres. Si prefieres no usar nombres, cambia a números y elige cuántos, de 2 a 40, algo práctico con números de lista o de asiento.',
        'Elige si el orden se revela desde el primero o desde el último y pulsa sortear. Cada puesto aparece como una carta numerada: toca la carta o el botón Siguiente para ver la siguiente, activa el modo automático para que las cartas salgan solas, o pulsa Ver todo para ir directamente a la lista completa. La última pantalla muestra a todos en orden con números grandes, además de botones para copiar la lista como texto o copiar un enlace.',
      ],
      list: [
        'Elige una etiqueta: orden sin más, exposiciones, turnos de juego o limpieza.',
        'Escribe de 2 a 40 nombres, uno por línea, o cambia a números del 1 al N.',
        'Decide si revelar desde el primero o desde el último.',
        'Pulsa sortear una vez: todo el orden queda fijado en ese momento.',
        'Revela carta a carta, en automático o todo de golpe.',
      ],
    },
    {
      h: 'Por qué la mezcla es justa',
      p: [
        'Un orden justo necesita dos cosas: que todas las ordenaciones posibles tengan la misma probabilidad y que el resultado quede decidido antes de que nadie lo vea. Al pulsar sortear, la aplicación pide valores al generador aleatorio criptográfico de tu navegador, el mismo tipo de fuente que se usa para crear claves de seguridad. Luego aplica muestreo por rechazo, que descarta los raros valores que harían algo más probables ciertos puestos, y la mezcla de Fisher–Yates, un método conocido que da exactamente la misma oportunidad a cada orden posible.',
        'El orden completo existe desde ese momento. Destapar las cartas una a una no sortea nada nuevo; solo muestra un resultado ya fijado. No se envía nada a ningún servidor, así que nadie, ni siquiera nosotros, puede ver ni cambiar la lista. Si alguien duda, abrid el enlace compartido en otro móvil: aparece el mismo orden, porque el enlace guarda el orden terminado y no una mezcla nueva.',
      ],
    },
    {
      h: 'Para qué sirve un orden aleatorio',
      p: [
        'Siempre que un grupo tiene que ir por turnos, un orden sorteado acaba con la discusión de quién empieza. Los profesores lo usan para el orden de exposiciones o de lectura en voz alta. Los equipos lo usan para el turno de palabra en reuniones o talleres. Familias y compañeros de piso lo usan para los turnos de limpieza, y los amigos para el orden en juegos de mesa, karaoke o un torneo de videojuegos.',
        'No es lo mismo que sortear un ganador. Un sorteo de ganador termina con un nombre y un generador de equipos reparte a la gente en grupos. Aquí cada persona recibe un puesto del primero al último, justo lo que hace falta cuando a todos les va a tocar y solo queda decidir la secuencia.',
      ],
      list: [
        'Colegio: orden de exposiciones, lectura en voz alta, turnos de laboratorio.',
        'Trabajo: turno de palabra, demos, guardias.',
        'Casa: quién friega cada día, quién elige la película.',
        'Juegos: orden de turnos en juegos de mesa, rondas de preguntas, karaoke.',
      ],
    },
    {
      h: 'Consejos para hacerlo en grupo',
      p: [
        'Sortea donde todos vean la pantalla o compártela en una videollamada. Quien ve que el botón se pulsa una sola vez confía más en el resultado que en una lista que llega ya hecha. Si hay que repetir, por ejemplo por un nombre mal escrito, dilo antes de conocer el orden y no después.',
        'Con listas largas, el modo automático mantiene un ritmo constante sin que nadie toque la pantalla, y Ver todo es lo más rápido si solo importa la lista. Copiar como texto pega una lista numerada directamente en un chat o un documento. Tu última lista se recuerda en el dispositivo, así que un turno semanal se vuelve a sortear con un toque la próxima vez.',
      ],
    },
    {
      h: 'Revelar desde el primero o desde el último, y compartir el resultado',
      p: [
        'Revelar desde el primero es práctico: quien empieza lo sabe enseguida y puede prepararse. Revelar desde el último convierte el orden en una pequeña cuenta atrás, porque la última carta descubre quién va primero. En clase y en fiestas suele gustar ese suspense; en reuniones se prefiere la versión rápida.',
        'El botón Copiar enlace crea una dirección que contiene el orden terminado. Quien la abra verá la misma lista con un aviso de que no se ha vuelto a mezclar, y podrá sortear su propio orden con los mismos nombres si quiere uno nuevo. El enlace lleva los nombres que escribiste, así que envíalo solo a quien deba verlo.',
      ],
    },
  ],
  cta: 'Sortear el orden ahora',
};
