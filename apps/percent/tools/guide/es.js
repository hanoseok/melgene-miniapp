module.exports = {
  metaTitle: 'Calculadora de porcentajes: fórmulas, descuentos y puntos',
  description: 'Cómo calcular porcentajes a mano: el X % de un número, qué porcentaje es un número de otro, variación porcentual, descuentos acumulados, precio original y la diferencia entre porcentaje y punto porcentual.',
  h1: 'Calculadora de porcentajes: cómo resolver cualquier porcentaje',
  updated: '2026-10-22',
  intro: 'Los porcentajes están por todas partes: etiquetas de rebajas, nóminas, notas de examen, tipos de interés, encuestas. Casi todo se resuelve con tres fórmulas pequeñas, pero hay trampas en las que cae casi todo el mundo, como volver a sumar un descuento o confundir porcentaje con punto porcentual. Esta guía explica cómo funciona la calculadora, cómo hacer las mismas cuentas con papel y lápiz, dónde se esconden los errores típicos y algunos trucos de cálculo mental para el día a día.',
  sections: [
    {
      h: 'Cómo usar la calculadora de porcentajes',
      p: [
        'Elige tu pregunta entre las seis pestañas de arriba: el porcentaje de un número, qué porcentaje es un número de otro, la variación porcentual entre dos valores, un descuento o un aumento, el valor original antes de un cambio o la diferencia entre dos tasas en puntos porcentuales. Cada pestaña tiene dos casillas. En cuanto las rellenas, aparece la respuesta junto con una línea que muestra exactamente cómo se calculó.',
        'Puedes escribir los decimales con coma o con punto: 12,5 y 12.5 funcionan igual, y también se entienden separadores de miles como 1.250. Los resultados se redondean a un máximo de diez decimales, lo que oculta los diminutos errores de redondeo de los ordenadores. Al terminar, abre el resumen para ver todos tus resultados en una sola lista y copiar los que necesites.',
      ],
      list: [
        'Todo se calcula en tu navegador; los números que escribes no se envían a ninguna parte.',
        'El botón de copiar copia el resultado junto con su fórmula.',
        'La pestaña de descuentos tiene botones rápidos para el 10, 20, 30 y 50 por ciento.',
      ],
    },
    {
      h: 'Las tres fórmulas básicas, a mano',
      p: [
        'Por ciento significa «de cada cien», así que el 15 % es 15 de cada 100, o sea 0,15. Con esa idea, casi cualquier pregunta se convierte en una de tres fórmulas. Para el porcentaje de un número, multiplica y divide entre 100: el 15 % de 200 es 200 × 15 ÷ 100 = 30. Para saber qué porcentaje es una parte, divide la parte entre el total y multiplica por 100: 30 de 120 es 30 ÷ 120 × 100 = 25 %. Para hallar el total a partir de una parte y su porcentaje, divide la parte entre el porcentaje y multiplica por 100: si 30 es el 25 %, el total es 30 ÷ 25 × 100 = 120.',
        'El truco es preguntarse siempre «¿porcentaje de qué?». El número que va después de «de» es la base, y la base va en el denominador. La mayoría de los errores aparecen cuando la base cambia sin que te des cuenta a mitad del problema.',
      ],
      list: [
        'Parte = total × porcentaje ÷ 100',
        'Porcentaje = parte ÷ total × 100',
        'Total = parte ÷ porcentaje × 100',
      ],
    },
    {
      h: 'Variación, descuentos y la trampa del cálculo inverso',
      p: [
        'La variación porcentual compara el valor nuevo con el anterior: (nuevo − anterior) ÷ anterior × 100. Un precio que pasa de 80 a 100 sube un 25 %, pero uno que baja de 100 a 80 solo baja un 20 %, porque la base es distinta en cada sentido. Esa asimetría explica un acertijo famoso: quita un 20 % a 100 y te queda 80; vuelve a sumar un 20 % y solo llegas a 96.',
        'Por lo mismo, los descuentos acumulados son menores de lo que parecen. Un 20 % adicional sobre un precio ya rebajado un 30 % no es un 50 %: pagas 0,7 × 0,8 = 0,56 del precio, es decir, un 44 % de descuento. Para deshacer un cambio porcentual hay que dividir, no restar. Si una chaqueta cuesta 80 € tras un 20 % de descuento, el precio original era 80 ÷ 0,8 = 100 €. Si un tique de 121 € incluye un 21 % de IVA, la base imponible es 121 ÷ 1,21 = 100 €, no 95,59 €. La pestaña «Valor original» muestra esa división y hasta te avisa de la respuesta equivocada más tentadora.',
      ],
    },
    {
      h: 'Porcentaje frente a punto porcentual',
      p: [
        'Al comparar dos porcentajes hay dos formas honestas de describir la diferencia, y dan cifras muy distintas. Si el tipo de interés pasa del 4 % al 6 %, ha subido 2 puntos porcentuales: basta con restar una tasa de la otra. En términos relativos ha subido un 50 %, porque el aumento de 2 es la mitad del 4 inicial. Los titulares y los anuncios a veces eligen la versión que suena más llamativa, así que conviene comprobar cuál se usa.',
        'Los puntos porcentuales son la unidad adecuada para tipos de interés, tipos impositivos, paro, encuestas y tasas de conversión, es decir, números que ya son porcentajes. La pestaña «Puntos (p. p.)» da las dos cifras a la vez: la diferencia en puntos y la variación relativa en porcentaje.',
      ],
    },
    {
      h: 'Ejemplos cotidianos y trucos de cálculo mental',
      p: [
        'No siempre hace falta calculadora. El 10 % de un número es ese número con la coma desplazada un lugar a la izquierda: el 10 % de 64 es 6,4. El 5 % es la mitad, y el 20 %, el doble. Los porcentajes también se pueden intercambiar: el 8 % de 50 es lo mismo que el 50 % de 8, o sea, 4. Para una propina del 15 %, calcula el 10 % y súmale la mitad.',
        'En las decisiones importantes, apunta la fórmula. Compara una subida de sueldo con la inflación restando las dos tasas en puntos, comprueba un precio rebajado multiplicando por la parte que queda en vez de restar dos veces y, si un préstamo indica un tipo mensual, recuerda que doce meses de interés compuesto suman más que doce veces ese tipo.',
      ],
      list: [
        'Un 25 % de descuento significa pagar 0,75 del precio; un 40 %, 0,6.',
        'Tras una caída del 50 % hace falta una subida del 100 % para recuperarse.',
        'Duplicar es +100 %; reducir a la mitad es −50 %.',
      ],
    },
  ],
  cta: 'Abrir la calculadora de porcentajes',
};
