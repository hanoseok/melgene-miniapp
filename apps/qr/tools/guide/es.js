module.exports = {
  metaTitle: 'Guía de códigos QR: crear, imprimir y escanear',
  description: 'Cómo funciona un código QR, cómo crear uno para un enlace o el wifi, consejos de impresión sobre tamaño, contraste y corrección de errores, su historia y cómo escanear con seguridad.',
  h1: 'Cómo crear un código QR que se lea a la primera',
  updated: '2026-10-11',
  intro: 'Los códigos QR están por todas partes: en las mesas de los bares, en las entradas de conciertos, en los paquetes y en los carteles. Parecen ruido al azar, pero cada cuadradito tiene su función. Esta guía explica qué guarda realmente un código QR, cómo crear uno para un enlace, un mensaje o tu red wifi, cómo imprimirlo para que se lea a la primera, de dónde salió la idea y cómo protegerte cuando escaneas códigos hechos por otros.',
  sections: [
    {
      h: '¿Qué es un código QR?',
      p: [
        'QR significa Quick Response, «respuesta rápida». Un código QR es un código de barras bidimensional: en lugar de una fila de barras, guarda la información en una cuadrícula de celdas oscuras y claras llamadas módulos. Los tres cuadrados grandes de las esquinas son patrones de localización. Le dicen a la cámara dónde está el código, cómo está girado y qué tamaño tiene; por eso puedes escanearlo del revés o en diagonal.',
        'El resto de la cuadrícula contiene tus datos y datos extra de corrección de errores calculados con códigos Reed-Solomon, las mismas matemáticas que se usan en los CD y en las sondas espaciales. Gracias a esa redundancia, el lector puede reconstruir el contenido aunque parte del código esté sucia, rota o tapada. La versión más pequeña, la 1, mide 21 × 21 módulos; la más grande, la 40, mide 177 × 177 y admite casi tres mil bytes. Cuanto más largo el contenido, más grande y densa es la cuadrícula.'
      ]
    },
    {
      h: 'Cómo crear un código QR aquí',
      p: [
        'El generador funciona entero en tu navegador. El código se calcula en tu propio dispositivo en el momento en que escribes, así que nada se sube, se registra ni se guarda, y no hace falta crear ninguna cuenta.'
      ],
      list: [
        'Elige qué guardará el código: un enlace, texto, el acceso al wifi, un correo o un teléfono.',
        'Rellena los campos. Si escribes una dirección web sin https://, se añade sola para que el móvil la abra como enlace.',
        'Mira la vista previa en directo. Abre las opciones para cambiar los colores, la corrección de errores, el tamaño de la imagen o la zona de silencio.',
        'Descarga un PNG para pantallas y documentos, o un SVG para imprenta. En los navegadores compatibles también puedes copiar la imagen directamente.',
        'Escanea el resultado con tu propio móvil antes de compartirlo o imprimirlo.'
      ]
    },
    {
      h: 'Código QR del wifi para tus invitados',
      p: [
        'Un código QR del wifi evita que tus invitados tengan que teclear la contraseña larguísima de la pegatina del router. Guarda el nombre de la red, la contraseña y el tipo de seguridad en un formato de texto estándar que empieza por WIFI:. Las apps de cámara de iPhone y Android reconocen ese formato y ofrecen conectarse con un toque.',
        'Elige la misma seguridad que usa tu router. Casi todos los routers actuales usan WPA2 o WPA3, que van los dos en WPA. Elige «Sin contraseña» solo para redes abiertas y marca «Red oculta» si tu router no emite su nombre. Los caracteres especiales como punto y coma, comas, dos puntos y comillas se escapan automáticamente. Si cambias la contraseña del wifi, crea un código nuevo, porque el antiguo dejará de funcionar.'
      ]
    },
    {
      h: 'Consejos de impresión: tamaño, contraste y corrección',
      p: [
        'La mayoría de los problemas al escanear vienen de la impresión, no del código. Unas pocas reglas marcan una gran diferencia.'
      ],
      list: [
        'Tamaño: como regla general, el código debe medir al menos una décima parte de la distancia de lectura. Un código que se escanea a 30 cm necesita unos 3 cm de ancho; un cartel que se lee a 3 m, unos 30 cm.',
        'Contraste: código oscuro sobre fondo claro. Negro sobre blanco es lo más seguro. Los colores pálidos, los degradados y los códigos claros sobre fondo oscuro confunden a muchos lectores; por eso el generador avisa cuando el contraste es bajo.',
        'Zona de silencio: deja un borde vacío alrededor del código. El estándar pide cuatro módulos, y el texto o las imágenes pegados al borde son una causa típica de fallos.',
        'Corrección de errores: el nivel L recupera alrededor de un 7 % de daños, M un 15 %, Q un 25 % y H un 30 %. M para el día a día; Q o H para pegatinas, carteles exteriores o códigos con un logo pequeño encima; L cuando necesitas meter un texto largo en un código pequeño en pantalla.',
        'Longitud del contenido: con el mismo tamaño de impresión, menos contenido significa módulos más grandes. Mejor un enlace corto que una dirección kilométrica.'
      ]
    },
    {
      h: 'Breve historia del código QR',
      p: [
        'El código QR lo inventaron en 1994 Masahiro Hara y su equipo en Denso Wave, entonces una división del fabricante japonés de componentes de automóvil Denso, del grupo Toyota. Las fábricas seguían las piezas con códigos de barras normales y los operarios tenían que escanear varias etiquetas por caja, porque cada código de barras solo guardaba unos veinte caracteres. Hara quería un código que almacenara muchos más datos y se leyera muy rápido desde cualquier ángulo.',
        'Los cuadrados de localización se diseñaron con una proporción de negro y blanco que casi nunca aparece en textos o imágenes impresos, así que el lector los encuentra al instante. Denso Wave tenía la patente pero decidió no ejercerla, y el formato se convirtió en norma internacional ISO en el año 2000. Cuando las cámaras de los móviles aprendieron a leer códigos QR de serie, llegaron a los pagos, las tarjetas de embarque, las cartas de los restaurantes y mucho más. El nombre QR Code sigue siendo una marca registrada de Denso Wave.'
      ]
    },
    {
      h: 'Escanear con seguridad',
      p: [
        'Un código QR es solo un envase, y cualquiera puede imprimir uno. A veces los estafadores pegan códigos falsos encima de los reales en parquímetros, carteles o mesas de restaurante para llevar a la gente a páginas de pago o de acceso que imitan a las auténticas. Antes de abrir un enlace, lee la dirección que muestra la cámara y comprueba que pertenece al negocio que esperas. Desconfía de los códigos que piden datos de la tarjeta, contraseñas o descargar apps, y no escanees nunca un código que llegue en un mensaje inesperado que te meta prisa.',
        'Al crear tus propios códigos, aplica la misma idea al revés: usa enlaces que controles, prueba el código antes de imprimir y, si lo colocas en un lugar público, revisa de vez en cuando que nadie lo haya tapado con una pegatina.'
      ]
    }
  ],
  cta: 'Crear un código QR ahora'
};
