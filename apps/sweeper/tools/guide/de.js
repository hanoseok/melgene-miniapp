module.exports = {
  metaTitle: 'Minesweeper-Guide: Spielweise, Tipps und Geschichte',
  description: 'So spielst du Minesweeper online: Zahlen lesen, Flaggen setzen, Felder per Zahl räumen, Tipps für schnellere Zeiten und ein kurzer Blick auf die Geschichte des Klassikers.',
  h1: 'Minesweeper: Spielweise, Zahlen lesen und schneller räumen',
  updated: '2026-10-10',
  intro: 'Minesweeper ist ein kostenloses Logikrätsel: ein Gitter aus verdeckten Feldern, ein paar Minen und ein Ziel, nämlich alle Felder ohne Mine aufzudecken. Sobald sich das Brett öffnet, braucht man kein Glück mehr, sondern genaues Zahlenlesen. Dieser Guide erklärt die Regeln, die Steuerung am Handy und am Computer, Gewohnheiten für schnellere Zeiten und ein wenig Geschichte.',
  sections: [
    {
      h: 'Was Minesweeper ist und wie die Regeln funktionieren',
      p: [
        'Zu Beginn ist jedes Feld verdeckt. Beim Aufdecken passiert eines von drei Dingen. Steckt eine Mine darunter, ist das Spiel vorbei. Ist das Feld sicher und liegen unter den acht Nachbarn Minen, zeigt es eine Zahl von 1 bis 8 mit der genauen Anzahl. Ist es sicher und ganz ohne Minen in der Nähe, bleibt es leer und alle zusammenhängenden leeren Felder öffnen sich automatisch. Ein einziger Tipp kann also eine große Fläche freilegen.',
        'Gewonnen hast du, wenn alle Felder ohne Mine aufgedeckt sind. Flaggen sind nur eine Gedächtnisstütze: Sie zählen nicht für den Sieg, verhindern aber, dass du ein als gefährlich erkanntes Feld antippst, und der Zähler über dem Brett zeigt, wie viele Minen noch unmarkiert sind. Es gibt drei Stufen: Leicht (9 × 9, 10 Minen), Mittel (12 × 12, 24 Minen) und Experte (14 × 14, 40 Minen).',
      ],
    },
    {
      h: 'Steuerung und schneller Einstieg',
      p: [
        'Das Brett ist für Daumen gebaut: Die Felder sind auch auf dem Handy gut zu treffen und das ganze Spiel passt ohne Scrollen auf den Bildschirm. Dein erster Tipp ist immer sicher. Die Minen werden erst danach verteilt, nie auf dem gewählten Feld oder seinen Nachbarn, damit sich immer ein kleiner Bereich mit Hinweisen öffnet.',
        'Die Uhr startet mit dem ersten Tipp. Wechselst du zu einem anderen Tab oder einer anderen App, pausiert sie und das Brett wird verdeckt, bis du zurückkehrst und tippst.',
      ],
      list: [
        'Ein verdecktes Feld antippen deckt es auf.',
        'Ein Feld kurz gedrückt halten setzt oder entfernt eine Flagge. Alternativ stellst du die Taste Graben / Flagge auf Flaggenmodus und tippst.',
        'Tippe auf eine aufgedeckte Zahl: Stimmt die Zahl der Flaggen ringsum mit ihr überein, öffnen sich alle übrigen Nachbarn auf einmal.',
        'Am Computer setzt der Rechtsklick eine Flagge; Pfeiltasten, Enter und F erlauben das Spielen ohne Maus.',
        'Der Zähler zeigt Minen minus Flaggen. Fällt er unter null, ist mindestens eine Flagge falsch gesetzt.',
      ],
    },
    {
      h: 'Strategie: aus Zahlen Gewissheit machen',
      p: [
        'Beginne mit den einfachsten Schlüssen. Eine 1 mit genau einem verdeckten Nachbarn verrät dort eine Mine. Hat eine Zahl schon so viele Flaggen wie ihr Wert, sind alle anderen verdeckten Nachbarn sicher. Diese zwei Regeln lösen den größten Teil eines Brett der Stufe Leicht.',
        'Reicht das nicht mehr, vergleiche benachbarte Zahlen. Berührt eine 1 drei verdeckte Felder und teilt eine Nachbar-1 davon zwei, liegt die Mine im gemeinsamen Paar, und das dritte Feld der ersten Zahl ist sicher. Solange es einen sicheren Zug gibt, wird nicht geraten.',
      ],
      list: [
        'Ecken und Ränder haben weniger Nachbarn, ihre Zahlen sind deshalb stärkere Hinweise.',
        'Setze eine Flagge, sobald du sicher bist, und räume den Rest per Tipp auf die Zahl.',
        'Musst du raten, wähle das Feld mit der geringsten Minenchance und dem größten Informationsgewinn.',
        'Keine Hektik am Anfang: Tempo entsteht durch weniger Fehler und Pausen, nicht durch schnelleres Tippen.',
      ],
    },
    {
      h: 'Eine kurze Geschichte von Minesweeper',
      p: [
        'Rätsel, bei denen man versteckten Minen ausweicht, gab es schon Anfang der 1980er auf Heimcomputern, etwa Mined-Out auf dem ZX Spectrum, wo man ein Feld überquerte und aus der Zahl der Nachbarminen auf deren Lage schloss. Die moderne Form mit Gitter und Zahlenfeldern setzte sich in den Jahren danach durch.',
        'Zur weltweiten Gewohnheit wurde es, als Microsoft es mit Windows auslieferte. Oft heißt es, Solitaire habe Drag and Drop beigebracht und Minesweeper das präzise Klicken und die rechte Maustaste. Millionen Menschen spielen es in Pausen, und Communities messen sich um die schnellsten Zeiten.',
      ],
    },
    {
      h: 'Zeiten, freundlicher Wettstreit und Datenschutz',
      p: [
        'Nach einem Sieg siehst du deine Zeit; die Bestzeit pro Stufe wird nur in deinem Browser gespeichert. Haben andere dieselbe Stufe geschafft, zeigt ein Prozentwert, wo deine Zeit liegt. Gibt es noch nichts zu vergleichen, bleibt er verborgen. Die Zahlen stammen aus echten Partien.',
        'Willst du einen Freund herausfordern, teile dein Ergebnis und einigt euch auf dieselbe Stufe. Die Verteilung ist in jeder Partie zufällig, das Glück gleicht sich über ein paar Runden aus. Ein Konto brauchst du nicht; nach einem Sieg gehen nur Stufe und gerundete Zeit an den Server, nie dein Name.',
      ],
    },
  ],
  cta: 'Minesweeper jetzt spielen',
};
