module.exports = {
  metaTitle: 'Zufallszahlen Generator: Ratgeber für faire Verlosungen',
  description: 'So nutzt du den Zufallszahlen Generator für Verlosungen, Gewinnspiele und den Unterricht, was Zufall wirklich bedeutet, echter vs. Pseudozufall und wie eine faire Ziehung gelingt.',
  h1: 'Zufallszahlen Generator: Anleitung und Tipps für wirklich faire Ziehungen',
  updated: '2026-10-11',
  intro: 'Ein Zufallszahlen Generator wirkt wie das einfachste Werkzeug im Netz: Zwei Zahlen rein, eine Zahl raus. Trotzdem werden damit Gewinner ausgelost, Schüler aufgerufen, Losnummern gezogen, Umfrageantworten ausgewählt und kleine Streitereien beendet, und jedes Mal zählt das Ergebnis nur, wenn alle ihm vertrauen. Dieser Ratgeber zeigt, wie der Generator funktioniert, gibt Ideen für Gewinnspiele und den Unterricht, erklärt, was Zufall eigentlich bedeutet, vergleicht echten und Pseudozufall und endet mit einfachen Regeln für eine ehrliche Ziehung.',
  sections: [
    {
      h: 'So funktioniert der Zufallszahlen Generator',
      p: [
        'Alles passiert auf einem Bildschirm. Trag bei Von die kleinste und bei Bis die größte gewünschte Zahl ein oder tippe auf einen Schnellbereich wie 1–10, 1–45 oder 1–100. Beide Grenzen gehören dazu, bei 1 bis 10 können also auch 1 oder 10 kommen. Negative Zahlen gehen ebenfalls, und jede Grenze darf bis zu einer Milliarde in beide Richtungen reichen.',
        'Dann legst du fest, wie viele Zahlen gezogen werden, von einer bis tausend. Lass Doppelte erlaubt aus, wenn jede Zahl nur einmal kommen darf, etwa bei Losnummern oder Sitzplätzen. Schalte Sortieren ein, wenn du die Zahlen aufsteigend lesen willst. Unter Weitere Optionen kannst du Zahlen wie 13 oder ganze Abschnitte wie 20-25 ausschließen und der Ziehung einen Namen geben. Tipp auf Ziehen, und die Ziffern rollen wie bei einem Spielautomaten, bevor sie auf dem Ergebnis stehen bleiben.',
      ],
      list: [
        'Von und Bis eintragen oder einen Schnellbereich antippen.',
        'Festlegen, wie viele Zahlen du brauchst.',
        'Entscheiden, ob Doppelte erlaubt sind und sortiert wird.',
        'Bei Bedarf Zahlen ausschließen und die Ziehung benennen.',
        'Ziehen tippen, dann Zahlen oder Ergebnis-Link kopieren.',
      ],
    },
    {
      h: 'Ideen für Gewinnspiele, Tombolas und den Unterricht',
      p: [
        'Die meisten Einsätze laufen darauf hinaus, jeder Person oder Sache eine Nummer zu geben und den Generator wählen zu lassen. Bei einem Instagram-Gewinnspiel nummerierst du die gültigen Teilnahmen in der Reihenfolge ihres Eingangs, ziehst pro Preis eine Zahl ohne Wiederholung und postest den Ergebnis-Link. So sehen alle die genaue Ziehung samt Uhrzeit und Einstellungen. Ein Name wie Herbst-Gewinnspiel steckt ebenfalls im Link.',
        'Lehrkräfte nutzen Zufallszahlen, um fair zu bleiben und ein bisschen Spannung zu erzeugen. Wenn jedes Kind eine Nummer hat, kann niemand behaupten, es treffe immer dieselben.',
      ],
      list: [
        'Tombola: Bereich auf die verkauften Losnummern setzen und pro Preis einen Gewinner ziehen.',
        'Kommentar-Gewinnspiel: gültige Teilnahmen nummerieren, ohne Wiederholung ziehen, Link teilen.',
        'Unterricht: bestimmen, wer antwortet, zufällige Paare bilden oder die Reihenfolge der Referate festlegen.',
        'Büro: Reihenfolge beim Wichteln, wer Protokoll schreibt oder ein Mittagslokal aus einer nummerierten Liste.',
        'Spiel und Lernen: Zahlen fürs Kopfrechnen, eine Seite zum Lesen oder ein Würfel mit beliebig vielen Seiten.',
      ],
    },
    {
      h: 'Was Zufall wirklich bedeutet',
      p: [
        'Eine Ziehung ist zufällig, wenn jedes erlaubte Ergebnis dieselbe Chance hat und niemand das nächste vorhersagen kann, weder wer den Knopf drückt noch wer den Code geschrieben hat. Zufällig heißt nicht, dass sich alles auf kurze Sicht gleichmäßig verteilt. Ziehst du ein paarmal zwischen 1 und 10, sind Wiederholungen und Serien völlig normal: Zweimal hintereinander die 7 ist genauso wahrscheinlich wie erst die 3 und dann die 8.',
        'Menschen sind bekanntlich schlecht darin, zufällig zu sein. Fragt man nach einer Zahl zwischen 1 und 10, nennen viele die 7 und kaum jemand die 1 oder 10. Wer eine Zufallsfolge aufschreiben soll, vermeidet Wiederholungen viel stärker, als der Zufall es täte. Deshalb hilft ein Generator selbst bei kleinen Fragen wie der, wer anfängt: Er entfernt die versteckten Muster aus unseren Entscheidungen.',
      ],
    },
    {
      h: 'Echter Zufall, Pseudozufall und der Krypto-Generator',
      p: [
        'Computer folgen Anweisungen und können Zufall nicht aus dem Nichts erschaffen. Ein Pseudozufallsgenerator startet mit einem Startwert, dem Seed, und erzeugt per Formel eine lange Folge, die zufällig aussieht. Einfache Varianten reichen für Spiele, können aber vorhersagbar sein und feine Muster zeigen. Echte Zufallszahlen stammen aus physikalischem Rauschen, etwa dem thermischen Rauschen in Bauteilen oder winzigen Zeitschwankungen der Hardware.',
        'Moderne Browser bieten mit crypto.getRandomValues einen kryptografisch sicheren Generator, und genau den verwendet dieses Werkzeug. Das Betriebssystem speist ihn mit Hardware-Rauschen, und er ist so gebaut, dass frühere Werte nichts über spätere verraten, deshalb wird er auch für Sicherheitsschlüssel genutzt. Außerdem vermeidet das Werkzeug einen klassischen Fehler, die Modulo-Verzerrung: Wer eine große Zufallszahl per Restwert auf einen kleinen Bereich bringt, gibt manchen Zahlen eine winzige Extrachance. Der Generator verwirft diese überzähligen Werte und zieht neu, sodass jede Zahl im Bereich exakt gleich wahrscheinlich ist. Für Ziehungen ohne Wiederholung nutzt er ein Mischverfahren, das sogar bei zwei Milliarden möglichen Zahlen funktioniert.',
      ],
    },
    {
      h: 'Tipps für eine faire und transparente Ziehung',
      p: [
        'Ein faires Werkzeug ist nur die halbe Miete. Die andere Hälfte ist eine Ziehung, an der hinterher niemand zweifeln kann.',
      ],
      list: [
        'Regeln vorher ankündigen: Bereich, Art der Nummerierung und Zahl der Gewinner.',
        'Teilnehmerliste vor der Ziehung festschreiben und notieren, wer welche Nummer hat.',
        'Einmal ziehen und das Ergebnis behalten. Neu ziehen, bis es passt, macht alles sinnlos.',
        'Den Ergebnis-Link teilen: Er enthält Zahlen, Einstellungen und Uhrzeit, alle sehen also die Originalziehung statt einer neuen.',
        'Vor Publikum auf einem geteilten Bildschirm oder im Livestream ziehen, damit alle die Zahlen stoppen sehen.',
        'Nur wirklich ungültige Nummern ausschließen, etwa unverkaufte Lose, und das offen sagen.',
      ],
    },
  ],
  cta: 'Jetzt Zufallszahlen ziehen',
};
