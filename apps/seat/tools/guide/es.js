module.exports = {
  metaTitle: 'Plano de clase aleatorio: guía, reglas y consejos',
  description: 'Cómo usan los docentes un plano de clase aleatorio: preparar el aula, separar a dos alumnos, primeras filas y sitios fijos, cada cuánto cambiar y por qué los nombres quedan en privado.',
  h1: 'Plano de clase aleatorio: sitios justos para toda la clase',
  updated: '2026-10-13',
  intro: 'Cambiar a los alumnos de sitio es un pequeño ritual del curso, y es sorprendentemente fácil que salga mal. Si el docente decide solo, alguien siempre se siente señalado. Si eligen los alumnos, los mismos amigos se juntan y los más callados acaban en los rincones. Un plano de clase aleatorio resuelve las dos cosas: decide el azar, todos ven que ha decidido el azar y el docente sigue controlando las pocas reglas que de verdad importan. Esta guía explica la herramienta, muestra cómo la usan los docentes, detalla las reglas que puedes añadir y aclara qué pasa con los nombres que escribes.',
  sections: [
    {
      h: 'Cómo hacer un plano de clase aleatorio',
      p: [
        'Empieza por los nombres. Pega la lista de la clase con un nombre por línea o sepáralos con comas. Si prefieres no escribir nombres, pon un solo número, por ejemplo 28, y el plano usará los números del 1 al 28, perfecto si trabajas con número de lista. Un plano admite hasta 100 nombres.',
        'Después, dibuja el aula. Elige cuántas filas de mesas hay y cuántos sitios tiene cada fila. El plano muestra el aula desde el punto de vista de los alumnos, con la mesa del profe arriba, así que la primera fila en pantalla es la más cercana a la pizarra. Toca un sitio para tacharlo si debe quedar vacío, por ejemplo un pasillo, una mesa rota o el sitio junto a la puerta. Cuando todo se parezca a tu aula, pulsa Sortear y mira cómo los sitios se giran uno a uno, o salta la animación si está a punto de sonar el timbre.',
      ],
      list: [
        'Pega los nombres o escribe cuántos alumnos tienes.',
        'Ajusta las filas y los sitios por fila.',
        'Toca los sitios que deben quedar vacíos.',
        'Si hace falta, añade reglas: separar, primeras filas o sitios fijos.',
        'Sortea y luego guarda el PNG, copia la tabla de texto o el enlace.',
      ],
    },
    {
      h: 'Cómo usan los docentes el reparto aleatorio',
      p: [
        'La mayoría cambia los sitios con un ritmo fijo: cada mes, cada evaluación o al empezar una nueva unidad. Un calendario conocido importa más que el intervalo exacto, porque un alumno acepta mucho mejor un sitio que no le gusta cuando sabe que es temporal.',
        'Lo mejor es sortear delante de la clase. Proyecta la pantalla, deja que los sitios se giren uno a uno y el sorteo se convierte en un pequeño momento compartido en vez de en una decisión discutida. Luego guarda el plano en PNG para tus diapositivas o para colgarlo, o cópialo como tabla de texto en la circular para familias o en las instrucciones para una sustitución.',
      ],
      list: [
        'Inicio de curso: mezclar a alumnos que aún no se conocen.',
        'Trabajo en grupo: sentar al azar y convertir las mesas vecinas en equipos.',
        'Exámenes: evitar que los amigos se sienten juntos.',
        'Sustituciones: dejar un plano impreso para que el compañero sepa cada nombre.',
      ],
    },
    {
      h: 'Reglas: separar, primeras filas y sitios fijos',
      p: [
        'El azar puro es justo, pero un aula tiene necesidades reales. En Reglas de sitios puedes añadir parejas que separar; esos dos alumnos nunca se sentarán juntos, ni siquiera en diagonal. Puedes poner alumnos en la lista de primeras filas para que siempre caigan en las dos primeras, algo que ayuda a quien lleva gafas, oye mal o necesita concentrarse, sin señalarlo. Y puedes fijar un nombre en un sitio concreto, por ejemplo para un alumno que debe estar cerca de la puerta o junto a su apoyo.',
        'Usa las reglas con moderación. Cada regla quita un poco de azar y, en un aula llena, demasiadas reglas pueden hacer imposible cualquier plano. Cuando pasa, la herramienta te avisa en lugar de saltarse una regla en silencio y te sugiere quitar una pareja o un sitio fijo, o añadir sitios. Un buen hábito es quedarte solo con las reglas que podrías explicar a la clase.',
      ],
    },
    {
      h: 'Por qué el sorteo es justo',
      p: [
        'Cada plano se sortea con el generador aleatorio criptográfico de tu navegador, el mismo tipo de azar que se usa para las claves de seguridad. La herramienta usa muestreo por rechazo para evitar sesgos diminutos al convertir bits aleatorios en números de sitio y luego un barajado Fisher–Yates, que da la misma probabilidad a cada distribución posible. Si hay parejas que separar, vuelve a sacar planos completos hasta obtener uno que cumpla todas las reglas, así que todos los planos válidos siguen siendo igual de probables. Solo en aulas muy justas pasa a una búsqueda cuidadosa para encontrar un plano que funcione.',
        'El plano queda decidido antes de que empiece la animación. Los sitios que se giran solo muestran un resultado ya fijado, así que pulsar Saltar no cambia quién se sienta dónde.',
      ],
    },
    {
      h: 'Compartir el plano y proteger los nombres',
      p: [
        'Los nombres que escribes nunca salen de tu navegador. No hay cuenta y no se sube nada a ningún servidor. Tu última lista y la distribución del aula se recuerdan solo en tu dispositivo para la próxima vez, y el botón Borrar las elimina.',
        'Cuando copias el enlace, los nombres y la distribución exacta se escriben en el propio enlace. Quien lo abra verá el mismo plano, marcado como compartido, sin volver a sortear: muy práctico para enviarlo a un compañero o al grupo de la clase. Como los nombres viajan dentro del enlace, evita publicar enlaces con nombres completos en sitios públicos. Nombres de pila, iniciales o números suelen bastar.',
      ],
    },
  ],
  cta: 'Hacer un plano de clase aleatorio',
};
