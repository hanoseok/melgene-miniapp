module.exports = {
  metaTitle: 'Generador de números aleatorios: guía para sorteos justos',
  description: 'Cómo usar el generador de números aleatorios en rifas, sorteos en redes y en clase, qué significa de verdad el azar, números aleatorios reales y pseudoaleatorios, y cómo hacer un sorteo justo.',
  h1: 'Generador de números aleatorios: cómo usarlo y cómo lograr sorteos justos',
  updated: '2026-10-11',
  intro: 'Un generador de números aleatorios parece la herramienta más simple de internet: escribes dos números y sale un tercero. Aun así, la gente lo usa para elegir ganadores, sacar a un alumno a la pizarra, sortear números, escoger respuestas de una encuesta o zanjar una discusión, y en todos esos casos el resultado solo vale si todo el mundo confía en él. Esta guía explica cómo usar el generador, da ideas para sorteos y para clase, aclara qué significa realmente el azar, compara números aleatorios reales y pseudoaleatorios y termina con costumbres sencillas para que el sorteo sea limpio.',
  sections: [
    {
      h: 'Cómo usar el generador de números aleatorios',
      p: [
        'Todo ocurre en una sola pantalla. Escribe el número más bajo en Desde y el más alto en Hasta, o toca un rango rápido como 1–10, 1–45 o 1–100. Los dos extremos cuentan, así que del 1 al 10 puede salir el 1 o el 10. También admite negativos, y cada extremo puede llegar hasta mil millones en cualquier sentido.',
        'Después elige cuántos números sacar, de uno a mil. Deja Con repetición desactivado si cada número solo puede salir una vez, como en las papeletas de una rifa o los números de asiento. Activa Ordenar si prefieres leerlos de menor a mayor. En Más opciones puedes excluir números como el 13 o un tramo entero como 20-25, y ponerle nombre al sorteo. Pulsa Sacar y los dígitos giran como en una tragaperras antes de detenerse en el resultado.',
      ],
      list: [
        'Pon Desde y Hasta, o toca un rango rápido.',
        'Elige cuántos números necesitas.',
        'Decide si se permite repetir y si quieres ordenar.',
        'Si hace falta, excluye números y nombra el sorteo.',
        'Pulsa Sacar y copia los números o el enlace del resultado.',
      ],
    },
    {
      h: 'Ideas para sorteos, rifas y la clase',
      p: [
        'Casi todos los usos consisten en dar un número a cada persona o cosa y dejar que el generador elija. Para un sorteo en Instagram, numera las participaciones válidas por orden de llegada, saca un número por premio sin repetición y publica el enlace del resultado: tus seguidores verán el sorteo exacto con su hora y sus ajustes. Un nombre como Sorteo de octubre viaja dentro del enlace.',
        'Los profes usan números aleatorios para ser justos y darle un poco de emoción a la clase. Si cada alumno tiene su número de lista, nadie puede quejarse de que siempre le toca al mismo.',
      ],
      list: [
        'Rifa: ajusta el rango a las papeletas vendidas y saca un ganador por premio.',
        'Sorteo en comentarios: numera las participaciones válidas, saca sin repetir y comparte el enlace.',
        'Clase: elige quién responde, forma parejas al azar o decide el orden de las exposiciones.',
        'Oficina: el orden del amigo invisible, quién toma las notas o un sitio para comer de una lista numerada.',
        'Juegos y estudio: números para practicar cálculo, una página para leer o un dado con las caras que quieras.',
      ],
    },
    {
      h: 'Qué significa realmente «al azar»',
      p: [
        'Un sorteo es aleatorio cuando cada resultado permitido tiene la misma probabilidad y nadie puede predecir el siguiente, ni quien pulsa el botón ni quien escribió el código. Aleatorio no significa repartido de forma pareja en pocas tiradas. Si sacas varias veces del 1 al 10, las repeticiones y las rachas son normales: que salga el 7 dos veces seguidas es exactamente igual de probable que salga el 3 y luego el 8.',
        'Las personas somos famosas por lo mal que imitamos el azar. Si te piden un número del 1 al 10, mucha gente dice 7 y poca dice 1 o 10; si intentamos escribir una serie al azar, evitamos las repeticiones mucho más de lo que lo haría el azar. Por eso un generador sirve incluso para decidir quién empieza: borra los patrones ocultos de nuestras elecciones.',
      ],
    },
    {
      h: 'Azar real, pseudoaleatorio y el generador criptográfico',
      p: [
        'Un ordenador sigue instrucciones, así que no puede inventar azar de la nada. Un generador pseudoaleatorio parte de un valor llamado semilla y aplica una fórmula para producir una secuencia larga que parece aleatoria. Las versiones sencillas bastan para juegos, pero pueden ser predecibles y esconder patrones sutiles. Los números aleatorios reales salen de ruido físico, como el ruido térmico de los componentes o pequeñas variaciones de tiempo en el hardware.',
        'Los navegadores modernos ofrecen un generador criptográficamente seguro, crypto.getRandomValues, y es el que usa esta herramienta. El sistema operativo lo alimenta con ruido del hardware y está diseñado para que los resultados pasados no revelen los siguientes, por eso también se usa para claves de seguridad. Además, la herramienta evita un error clásico, el sesgo del módulo: reducir un número aleatorio grande a un rango pequeño con un simple resto da a algunos números una pizca más de probabilidad. El generador descarta esos valores sobrantes y vuelve a sacar, de modo que cada número del rango tiene exactamente la misma probabilidad. Para sorteos sin repetición usa un método de barajado que funciona incluso con dos mil millones de números posibles.',
      ],
    },
    {
      h: 'Consejos para un sorteo justo y transparente',
      p: [
        'Una herramienta justa es solo la mitad de un sorteo justo. La otra mitad es organizarlo para que nadie pueda dudar del resultado después.',
      ],
      list: [
        'Anuncia las reglas antes: el rango, cómo se numeran las participaciones y cuántos ganadores habrá.',
        'Cierra la lista de participantes antes de sortear y guarda quién tiene cada número.',
        'Sortea una vez y quédate con el resultado. Repetir hasta que te guste no tiene sentido.',
        'Comparte el enlace del resultado: guarda los números, los ajustes y la hora, así todos ven el sorteo original y no uno nuevo.',
        'Con público, sortea en una pantalla compartida o en directo para que todos vean cómo se detienen los números.',
        'Excluye solo números de verdad inválidos, como papeletas sin vender, y dilo públicamente.',
      ],
    },
  ],
  cta: 'Sacar números aleatorios ahora',
};
