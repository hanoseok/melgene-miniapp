module.exports = {
  metaTitle: 'Calcular IMC: fórmula, categorías y limitaciones',
  description: 'Cómo calcular el IMC en kilos o en libras, qué significan los puntos de corte de la OMS y los asiáticos, por qué el IMC falla con deportistas y cómo la cintura completa el resultado.',
  h1: 'Calcular IMC: cómo funciona el índice de masa corporal',
  updated: '2026-10-24',
  intro: 'El índice de masa corporal, o IMC, es la cifra que más usan médicos, aseguradoras y apps de deporte para clasificar a los adultos en bajo peso, peso normal, sobrepeso y obesidad. Solo necesita la estatura y el peso, así que es rápido, pero también bastante tosco. Esta guía explica cómo funciona la calculadora, la fórmula, qué significan las categorías, cuándo se equivoca el IMC y qué medidas sencillas dan una imagen más completa.',
  sections: [
    {
      h: 'Cómo usar la calculadora de IMC',
      p: [
        'Elige las unidades (centímetros y kilos, o pies, pulgadas y libras) y escribe tu estatura y tu peso. En cuanto rellenas las dos casillas aparece tu IMC con un decimal, un marcador en una escala de colores y el nombre de la categoría. Debajo verás el peso saludable para tu estatura y, si estás fuera, cuánto te separa más o menos.',
        'La edad y el sexo son opcionales. No cambian la cifra; solo añaden una nota cuando hace falta, por ejemplo que la calculadora es para adultos o que a partir de los 65 años un IMC algo más alto suele estar bien. El interruptor “Criterio asiático” aplica los cortes más bajos que se recomiendan en Asia. Todo se calcula en tu navegador y nada se envía ni se guarda.',
      ],
      list: [
        'Los decimales valen con coma o con punto: 70,5 y 70.5 son lo mismo.',
        'Si cambias de unidades, los valores ya escritos se convierten solos.',
        'El resumen reúne tu IMC, tu categoría y tu peso saludable.',
      ],
    },
    {
      h: 'La fórmula del IMC, paso a paso',
      p: [
        'El IMC es el peso en kilos dividido entre la estatura en metros al cuadrado. Con 1,70 m y 65 kg: 1,7 × 1,7 = 2,89 y 65 ÷ 2,89 ≈ 22,5. Como la estatura va al cuadrado, unos pocos centímetros importan: con los mismos 65 kg sale alrededor de 23,9 a 1,65 m y de 21,2 a 1,75 m.',
        'En unidades estadounidenses la fórmula es 703 × peso en libras ÷ estatura en pulgadas al cuadrado. El 703 solo sirve para pasar libras y pulgadas a kilos y metros. La calculadora usa las conversiones exactas de 2,54 cm por pulgada y 0,45359237 kg por libra.',
      ],
      list: [
        'Sistema métrico: IMC = kg ÷ (m × m)',
        'Unidades de EE. UU.: IMC = 703 × lb ÷ (in × in)',
        'Peso saludable = de 18,5 × m² a 24,9 × m² (OMS)',
      ],
    },
    {
      h: 'Qué significan las categorías',
      p: [
        'La OMS divide el IMC adulto en bajo peso (menos de 18,5), peso normal (18,5 a 24,9), sobrepeso (25 a 29,9) y obesidad (30 o más), que a su vez se divide en grado I (30 a 34,9), grado II (35 a 39,9) y grado III (40 o más). Los cortes son los mismos para mujeres y hombres. Se eligieron porque, en poblaciones grandes, el riesgo de diabetes tipo 2, hipertensión y enfermedad cardíaca sube a medida que el IMC se aleja de la zona media.',
        'Estudios hechos en Asia vieron que muchas personas de origen asiático tienen esos riesgos con un IMC más bajo, en parte porque con el mismo peso suelen tener más grasa, sobre todo abdominal. Por eso la OMS para Asia-Pacífico marca el sobrepeso desde 23 y la obesidad desde 25. Cada país afina: Japón habla de obesidad desde 25 y China pone el sobrepeso en 24 y la obesidad en 28.',
      ],
      list: [
        'Menos de 18,5: bajo peso en todas las escalas',
        '18,5 a 24,9: peso normal según la OMS',
        '23 a 24,9: ya es sobrepeso en la escala de Asia-Pacífico',
      ],
    },
    {
      h: 'Lo que el IMC no cuenta',
      p: [
        'El IMC solo mira el peso total, así que no distingue músculo de grasa ni dice dónde está la grasa. Un jugador de rugby o alguien que hace pesas puede salir con sobrepeso, o incluso obesidad, estando muy en forma, mientras que una persona mayor que ha perdido músculo puede tener un IMC normal con demasiada grasa. Dos personas con el mismo IMC pueden tener una salud muy distinta.',
        'Tampoco sirve para todo el mundo. A niños y adolescentes se les valora con tablas de percentiles por edad y sexo, y el aumento de peso en el embarazo sigue sus propias pautas. Los adultos muy altos o muy bajos y quienes retienen líquidos también pueden obtener resultados engañosos. Toma el IMC como una primera orientación, no como un veredicto.',
      ],
    },
    {
      h: 'Cintura e índice cintura-estatura',
      p: [
        'La grasa acumulada en la barriga está más ligada a las enfermedades del corazón y del metabolismo que la de otras zonas, y el IMC no la ve. Basta una cinta métrica: mide a medio camino entre la última costilla y la parte alta de la cadera, después de soltar el aire con normalidad. En España se suele considerar alta una cintura de más de 88 cm en mujeres y de más de 102 cm en hombres.',
        'También se usa el índice cintura-estatura: si queda por debajo de 0,5, es decir, si tu cintura mide menos de la mitad de tu estatura, el riesgo suele ser menor. Las básculas de bioimpedancia y las pruebas de imagen estiman la grasa de forma más directa, aunque los aparatos caseros fallan a menudo. Si el IMC y la cintura dicen cosas distintas, coméntalo con tu médico.',
      ],
      list: [
        'Cintura ÷ estatura por debajo de 0,5: riesgo normalmente menor',
        'Mide por la mañana, de pie, después de soltar el aire',
        'Usa siempre la misma cinta y el mismo punto',
      ],
    },
    {
      h: 'Consejos para leer y seguir tu resultado',
      p: [
        'Pésate a la misma hora, mejor por la mañana, porque el peso puede variar un kilo o más entre la mañana y la noche. Fíjate en la tendencia de varias semanas más que en un dato suelto, y recuerda que el rango saludable abarca varios kilos por algo: no existe un único peso perfecto. Si quieres cambiar de peso, los cambios pequeños y constantes en sueño, actividad y comidas aguantan mejor que una dieta estricta.',
      ],
      list: [
        'Mide tu estatura descalzo y pésate con ropa ligera.',
        'Revisa la cintura además del IMC.',
        'Consulta con un médico antes de hacer grandes cambios.',
      ],
    },
  ],
  cta: 'Calcular mi IMC ahora',
};
