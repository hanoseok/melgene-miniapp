module.exports = {
  metaTitle: 'Carrera de animales: guía del sorteo con carrera',
  description: 'Cómo usar la carrera de animales para elegir un ganador o decidir quién paga los cafés: preparar a los corredores, por qué cada nombre tiene la misma probabilidad, ideas para la oficina y las fiestas, y una breve historia de los sorteos.',
  h1: 'Carrera de animales: deja que una carrera decida, con justicia',
  updated: '2026-10-22',
  intro: 'Hay decisiones demasiado pequeñas para discutirlas y demasiado incómodas para tomarlas a solas: quién paga la próxima ronda de cafés, quién presenta primero, quién se come el último trozo. La carrera de animales convierte ese momento en un pequeño espectáculo. Cada persona tiene un animal en su propio carril, empieza una cuenta atrás y los animales salen disparados hacia la meta con acelerones, tropiezos y llegadas ajustadas. Cuando se asienta el polvo, ya sabes quién ha llegado primero y quién el último. Esta guía explica cómo usarla, por qué el resultado es de verdad aleatorio, ideas para distintos grupos y un poco de historia.',
  sections: [
    {
      h: 'Cómo usar la carrera',
      p: [
        'Primero elige qué decide la carrera. Con «Gana el 1.º», el primer animal en cruzar la línea es el ganador, ideal para un premio, elegir a un voluntario o decidir quién empieza una partida. Con «Paga el último», al corredor más lento le toca algo: pagar los cafés, fregar las tazas o cantar la siguiente en el karaoke.',
        'Después ajusta el número de corredores, de 2 a 10, y escribe un nombre en cada carril. Si tienes prisa, puedes dejar carriles vacíos; corren con un nombre por defecto como Jugador 3. Pulsa empezar: tras una cuenta atrás de tres segundos, la carrera dura entre seis y nueve segundos y aparece el orden de llegada, con medallas para los tres primeros y el puesto decisivo resaltado.',
      ],
      list: [
        'Elige un modo: gana el primero o paga el último.',
        'Ajusta cuántos corredores hay y escribe un nombre en cada carril.',
        'Pulsa empezar y mira la cuenta atrás y la carrera.',
        'Lee el orden de llegada y vuelve a correr con los mismos nombres o cámbialos.',
        'Copia un enlace con los nombres para que tus amigos hagan su propia carrera.',
      ],
    },
    {
      h: 'Por qué cada nombre tiene exactamente la misma probabilidad',
      p: [
        'La carrera parece caótica, pero el resultado no lo decide la animación. En cuanto pulsas empezar, la app sortea el orden de llegada completo con el generador aleatorio criptográfico del navegador, crypto.getRandomValues. Usa muestreo por rechazo para evitar el pequeño sesgo de un simple cálculo de resto, y la mezcla de Fisher-Yates, el método estándar para desordenar una lista al azar. Todos los órdenes posibles son igual de probables.',
        'Solo después se prepara la animación. Cada carril recibe su propia curva de velocidad, con acelerones y tropiezos, ajustada para que los animales crucen la meta exactamente en el orden ya sorteado. Por eso el líder cambia varias veces y la llegada suele ser de foto finish. El animal es pura decoración: aquí el conejo no es más rápido que la tortuga y el carril 1 no tiene más suerte que el 10.',
      ],
    },
    {
      h: 'Ideas para la oficina, las fiestas y el aula',
      p: [
        'En el trabajo, la carrera reparte sin dramas las tareas que nadie quiere. También sirve para fijar el orden de las presentaciones o elegir quién decide dónde comer esta semana. Como todos miran la misma pantalla, nadie puede decir que hubo trampa, y la cuenta atrás convierte una decisión aburrida en un descanso de diez segundos.',
        'En fiestas y reuniones familiares, úsala para decidir quién empieza en un juego de mesa, quién elige la próxima canción o a quién le toca contar un chiste. El profesorado puede elegir el orden de exposiciones o el siguiente lector sin preguntar siempre a los mismos alumnos.',
      ],
      list: [
        'Ronda de cafés o de churros: paga el último.',
        'Orden en la reunión: una carrera y se sigue el orden de llegada.',
        'Noche de juegos: el ganador elige el siguiente juego.',
        'En clase: el primero responde a la pregunta del día.',
        'Tareas de casa: el último saca la basura.',
      ],
    },
    {
      h: 'Breve historia de los sorteos y las carreras',
      p: [
        'Siempre hemos buscado formas de dejar que el azar decida con justicia. Echar suertes aparece en textos antiguos de muchas culturas, y sacar la pajita más corta, lanzar una moneda o las retahílas como «pito, pito, gorgorito» siguen muy vivos. La idea es siempre la misma: el resultado no debe depender de quién grita más.',
        'Las carreras añaden emoción a esa idea. Los caballitos de feria, los juegos de carreras de tablero y la fábula de la liebre y la tortuga juegan con la emoción de ver una competición incierta. Esta app une las dos tradiciones: un sorteo justo hecho en el instante en que pulsas empezar y una carrera que hace divertida la espera.',
      ],
    },
    {
      h: 'Consejos para una carrera mejor',
      p: [
        'Poneos de acuerdo en el modo y en lo que hay en juego antes de pulsar empezar, así el resultado se acepta sin discusión. Usa nombres cortos para que quepan en el carril del móvil y deja la pantalla donde todos la vean, o compártela en la videollamada.',
      ],
      list: [
        'Decid en voz alta qué significa quedar primero o último antes de la carrera.',
        'En pantallas pequeñas, usa nombres cortos o apodos.',
        'Para varias decisiones seguidas, vuelve a correr con los mismos nombres.',
        'Los últimos resultados se quedan en el dispositivo, así sabes quién pagó la última vez.',
        'Si el movimiento te molesta, el ajuste «reducir movimiento» del sistema muestra el resultado al momento.',
      ],
    },
  ],
  cta: 'Empezar una carrera de animales',
};
