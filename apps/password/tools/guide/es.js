module.exports = {
  metaTitle: 'Generador de contraseñas: guía de contraseñas seguras',
  description: 'Cómo crear contraseñas seguras y frases de contraseña fáciles de recordar, qué significan de verdad la entropía y el tiempo para descifrarlas, y por qué importan el gestor y la verificación en dos pasos.',
  h1: 'Generador de contraseñas: contraseñas seguras, frases de contraseña y entropía',
  updated: '2026-10-13',
  intro: 'La mayoría de las cuentas robadas no caen ante un hacker genial. Todo empieza con una contraseña corta, una contraseña reutilizada tras la filtración de otra web o un patrón previsible como un nombre seguido de un año. Un generador de contraseñas se encarga de lo que peor hacemos los humanos: elegir al azar. Esta guía explica cómo usar el generador, qué hace realmente fuerte una contraseña, qué son las frases de contraseña, cómo leer la entropía y el tiempo para descifrarla, y termina con dos hábitos que importan todavía más que la contraseña.',
  sections: [
    {
      h: 'Cómo usar el generador de contraseñas',
      p: [
        'Todo ocurre en una sola pantalla y en tu propio dispositivo. Elige arriba Contraseña o Frase. Para una contraseña, mueve el control de longitud entre 4 y 64 caracteres y activa los tipos que quieras: mayúsculas, minúsculas, números y símbolos. Cada tipo activado aparece al menos una vez, así que cumple con las webs que exigen ciertas reglas de composición. Si alguna vez vas a dictar la contraseña o copiarla a mano desde una pantalla, activa Sin caracteres parecidos para dejar fuera 0, O, 1, l e I.',
        'Para una frase de contraseña, elige cuántas palabras quieres (de 3 a 8), el separador y si cada palabra empieza en mayúscula y se añade un número. Escoge Solo una o Cinco de golpe y pulsa Generar. Cada resultado tiene su botón Copiar, y el medidor de abajo muestra la entropía en bits, un nivel de fuerza y el tiempo estimado para descifrarla.',
      ],
      list: [
        'Elige Contraseña o Frase.',
        'Ajusta la longitud o el número de palabras.',
        'Elige los tipos de caracteres, o el separador y las opciones.',
        'Pulsa Generar y copia la que te guste.',
        'Guárdala directamente en tu gestor de contraseñas.',
      ],
    },
    {
      h: 'Qué hace segura una contraseña',
      p: [
        'La fuerza depende de cuántas posibilidades tendría que probar un atacante, no de lo complicada que parezca. P@ssw0rd! parece un lío, pero las herramientas de descifrado prueban primero palabras comunes con sustituciones típicas, así que cae en segundos. Una cadena realmente aleatoria es otra cosa: cada carácter es una elección independiente y cada carácter extra multiplica las posibilidades. Por eso la longitud gana a la astucia. Pasar de 12 a 16 caracteres aleatorios hace que una contraseña sea decenas de millones de veces más difícil de adivinar.',
        'La otra mitad es el azar. Solemos usar cumpleaños, nombres de mascotas, secuencias de teclado como qwerty y el mismo patrón favorito en todas partes, y los atacantes conocen todas esas costumbres. El generador usa la fuente aleatoria criptográfica del navegador, crypto.getRandomValues, y una técnica llamada muestreo por rechazo para que cada carácter permitido tenga exactamente la misma probabilidad. No hay patrón que aprender ni sesgo que aprovechar.',
        'El tercer ingrediente es no repetir. Hasta una contraseña perfecta se vuelve débil en cuanto la reutilizas, porque una filtración en un sitio se la entrega a atacantes que luego la prueban en todos los demás. Una cuenta, una contraseña.',
      ],
    },
    {
      h: 'Frases de contraseña: seguras y más fáciles de recordar',
      p: [
        'Una frase de contraseña es un puñado de palabras al azar unidas, como una frase corta sin sentido. La clave es que las palabras las elija el azar, no tú: un verso de una canción o una cita famosa no tienen nada de aleatorio. Este generador toma cada palabra de una lista integrada de 2048 palabras cortas en inglés, así que cada una aporta exactamente 11 bits de entropía. Cinco palabras dan 55 bits, seis dan 66, y un número aleatorio suma unos pocos bits más.',
        'Las frases de contraseña brillan en los pocos secretos que de verdad tienes que escribir o recordar: la contraseña maestra de tu gestor, el inicio de sesión del ordenador o la copia de seguridad del móvil. Son largas, por tanto fuertes, y están hechas de palabras reales, por lo que se escriben mucho mejor en el teclado del móvil que un revoltijo de símbolos. Poner mayúscula a cada palabra no añade fuerza porque el patrón es previsible, pero ayuda con las webs que exigen una mayúscula.',
      ],
    },
    {
      h: 'La entropía y el tiempo para descifrarla, explicados',
      p: [
        'La entropía, medida en bits, indica entre cuántas posibilidades igual de probables se eligió una contraseña. Cada bit duplica esa cifra: 60 bits son alrededor de un trillón de posibilidades y 80 bits, un millón de veces más. El medidor calcula este valor con exactitud a partir de tus ajustes. En las contraseñas cuenta todas las cadenas de la longitud elegida que contienen al menos un carácter de cada tipo seleccionado; en las frases multiplica las opciones de palabras por la posición y el valor del número añadido.',
        'El tiempo para descifrarla supone un ataque sin conexión muy rápido de 10 000 millones de intentos por segundo, un ritmo al alcance de una sola tarjeta gráfica moderna contra una base de datos de contraseñas filtrada y mal protegida. De media, el atacante la encuentra tras probar la mitad de las posibilidades. Además se supone que conoce exactamente tus ajustes, así que la estimación nunca te halaga. A grandes rasgos: menos de 45 bits es débil, de 45 a 60 aceptable, de 60 a 80 fuerte y 80 o más muy fuerte.',
      ],
      list: [
        'Cuentas desechables o sin importancia: de 45 a 60 bits.',
        'Cuentas del día a día como compras y redes sociales: de 60 a 80 bits.',
        'Correo, banco, trabajo y gestor de contraseñas: 80 bits o más.',
      ],
    },
    {
      h: 'Gestores de contraseñas y verificación en dos pasos',
      p: [
        'Nadie puede recordar decenas de contraseñas aleatorias distintas, y nadie debería intentarlo. Un gestor de contraseñas las guarda en una bóveda cifrada, las rellena en las webs correctas y te avisa de las repetidas o filtradas. Genera aquí una contraseña segura, pégala en el gestor al crear o cambiar una cuenta y no tendrás que volver a verla. Protege el propio gestor con una frase de contraseña larga que sí memorices.',
        'La verificación en dos pasos, o 2FA, añade un segundo paso como un código de una app de autenticación, una llave de acceso o una llave de seguridad física. Aunque se filtre la contraseña, el atacante no puede entrar. Actívala primero en tu correo, porque desde él se recuperan casi todas las demás cuentas.',
      ],
      list: [
        'Usa una contraseña distinta para cada cuenta.',
        'Guarda las contraseñas en un gestor, no en notas, chats ni capturas de pantalla.',
        'Activa la 2FA o las llaves de acceso donde se ofrezcan, empezando por el correo.',
        'Cambia la contraseña en cuanto un servicio avise de una filtración.',
        'No envíes nunca una contraseña por mensaje o correo y desconfía de enlaces de inicio de sesión inesperados.',
      ],
    },
  ],
  cta: 'Generar una contraseña segura',
};
