module.exports = {
  metaTitle: 'Prozentrechner-Ratgeber: Formeln, Rabatte, Prozentpunkte',
  description: 'Prozentrechnung einfach erklärt: Prozentwert, Prozentsatz und Grundwert berechnen, prozentuale Veränderung, Rabatt auf Rabatt, vom Brutto zum Netto zurückrechnen und der Unterschied zwischen Prozent und Prozentpunkten.',
  h1: 'Prozentrechner: so rechnest du jede Prozentaufgabe',
  updated: '2026-10-22',
  intro: 'Prozente begegnen uns überall: auf Preisschildern im Sale, auf der Gehaltsabrechnung, bei Noten, Zinsen und Wahlumfragen. Fast alles lässt sich mit drei kleinen Formeln lösen, trotzdem tappen viele in dieselben Fallen, etwa wenn sie einen Rabatt einfach wieder aufschlagen oder Prozent und Prozentpunkte verwechseln. Dieser Ratgeber zeigt, wie der Prozentrechner arbeitet, wie du dasselbe mit Stift und Papier rechnest, wo die typischen Fehler stecken und welche Kopfrechentricks im Alltag helfen.',
  sections: [
    {
      h: 'So nutzt du den Prozentrechner',
      p: [
        'Wähle oben einen der sechs Reiter: Prozentwert einer Zahl, Prozentsatz einer Zahl von einer anderen, prozentuale Veränderung zwischen zwei Werten, Rabatt oder Aufschlag, den Ausgangswert vor einer Veränderung oder den Abstand zweier Sätze in Prozentpunkten. Jeder Reiter hat zwei Felder. Sobald beide ausgefüllt sind, erscheint das Ergebnis, darunter eine Zeile mit dem genauen Rechenweg.',
        'Dezimalzahlen kannst du mit Komma oder Punkt eingeben, 12,5 und 12.5 funktionieren beide, und auch Tausenderpunkte wie 1.250 werden erkannt. Ergebnisse werden auf höchstens zehn Nachkommastellen gerundet, damit die winzigen Rundungsfehler von Computern verschwinden. Am Ende zeigt die Zusammenfassung alle Ergebnisse dieser Sitzung in einer Liste, und du kopierst, was du brauchst.',
      ],
      list: [
        'Alles wird in deinem Browser berechnet, deine Zahlen werden nirgendwohin gesendet.',
        'Der Kopieren-Button kopiert das Ergebnis samt Rechenweg.',
        'Der Rabatt-Reiter hat Schnelltasten für 10, 20, 30 und 50 % Rabatt.',
      ],
    },
    {
      h: 'Die drei Grundformeln zum Selberrechnen',
      p: [
        'Prozent heißt „von Hundert“, 15 % sind also 15 von 100 oder 0,15. Damit wird fast jede Prozentaufgabe zu einer von drei Formeln. Den Prozentwert berechnest du mit Grundwert mal Prozentsatz geteilt durch 100: 15 % von 200 sind 200 × 15 ÷ 100 = 30. Den Prozentsatz bekommst du mit Prozentwert geteilt durch Grundwert mal 100: 30 von 120 sind 30 ÷ 120 × 100 = 25 %. Den Grundwert berechnest du mit Prozentwert geteilt durch Prozentsatz mal 100: Wenn 30 genau 25 % sind, ist der Grundwert 30 ÷ 25 × 100 = 120.',
        'Der Trick ist, immer zu fragen: „Prozent wovon?“ Die Zahl nach dem Wort „von“ ist der Grundwert, und der gehört in den Nenner. Die meisten Fehler passieren, wenn sich der Grundwert unterwegs unbemerkt ändert.',
      ],
      list: [
        'Prozentwert = Grundwert × Prozentsatz ÷ 100',
        'Prozentsatz = Prozentwert ÷ Grundwert × 100',
        'Grundwert = Prozentwert ÷ Prozentsatz × 100',
      ],
    },
    {
      h: 'Veränderung, Rabatte und die Rückrechnungsfalle',
      p: [
        'Die prozentuale Veränderung vergleicht den neuen mit dem alten Wert: (neu − alt) ÷ alt × 100. Steigt ein Preis von 80 auf 100, sind das 25 % mehr, fällt er von 100 auf 80, aber nur 20 % weniger, weil sich der Grundwert je nach Richtung unterscheidet. Diese Asymmetrie erklärt ein bekanntes Rätsel: Zieh von 100 zwanzig Prozent ab, dann hast du 80; schlag 20 % wieder drauf, dann kommst du nur auf 96.',
        'Aus demselben Grund sind Rabatte auf Rabatte kleiner, als sie aussehen. Zusätzliche 20 % auf einen schon um 30 % reduzierten Preis sind nicht 50 %, sondern 0,7 × 0,8 = 0,56 des Preises, also 44 % Rabatt. Um eine Veränderung rückgängig zu machen, teilst du, statt abzuziehen. Kostet eine Jacke nach 20 % Rabatt 80 €, war der alte Preis 80 ÷ 0,8 = 100 €. Sind 119 € brutto inklusive 19 % Mehrwertsteuer, beträgt der Nettopreis 119 ÷ 1,19 = 100 € und nicht 96,39 €. Der Reiter „Grundwert zurück“ zeigt genau diese Division und warnt sogar vor der verlockenden falschen Antwort.',
      ],
    },
    {
      h: 'Prozent oder Prozentpunkte?',
      p: [
        'Vergleicht man zwei Prozentzahlen, gibt es zwei ehrliche Arten, den Abstand zu beschreiben, und sie liefern sehr unterschiedliche Zahlen. Steigt der Tagesgeldzins von 2 % auf 3 %, ist er um einen Prozentpunkt gestiegen: Man zieht einfach einen Satz vom anderen ab. Relativ betrachtet ist er um 50 % gestiegen, weil der Zuwachs von 1 die Hälfte des Ausgangswerts 2 ist. Nachrichten und Werbung wählen manchmal die Variante, die dramatischer klingt, deshalb lohnt sich ein genauer Blick.',
        'Prozentpunkte sind die richtige Einheit für Zinsen, Steuersätze, Arbeitslosenquoten, Wahlumfragen und Conversion-Raten, also für Zahlen, die schon Prozente sind. Der Reiter „Prozentpunkte“ zeigt beides auf einmal: den Abstand in Punkten und die relative Veränderung in Prozent.',
      ],
    },
    {
      h: 'Alltagsbeispiele und Kopfrechentricks',
      p: [
        'Nicht immer braucht man einen Rechner. 10 % einer Zahl bekommst du, indem du das Komma um eine Stelle nach links schiebst: 10 % von 64 sind 6,4. 5 % sind die Hälfte davon, 20 % das Doppelte. Prozente lassen sich auch tauschen: 8 % von 50 sind dasselbe wie 50 % von 8, also 4. Für 15 % Trinkgeld rechnest du 10 % und legst die Hälfte davon drauf.',
        'Bei großen Entscheidungen lohnt es sich, die Formel aufzuschreiben. Vergleiche eine Gehaltserhöhung mit der Inflation, indem du die beiden Sätze in Prozentpunkten voneinander abziehst, prüfe einen Sale-Preis, indem du mit dem verbleibenden Anteil multiplizierst, statt zweimal abzuziehen, und denk bei einem Monatszins daran, dass zwölf Monate mit Zinseszins mehr ergeben als das Zwölffache des Satzes.',
      ],
      list: [
        '25 % Rabatt heißt: Du zahlst 0,75 des Preises, bei 40 % sind es 0,6.',
        'Nach einem Minus von 50 % braucht es ein Plus von 100 %, um den Ausgangswert wieder zu erreichen.',
        'Verdoppeln ist +100 %, halbieren ist −50 %.',
      ],
    },
  ],
  cta: 'Prozentrechner öffnen',
};
