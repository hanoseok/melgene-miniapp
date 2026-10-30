module.exports = {
  metaTitle: 'Turnierbaum erstellen: Freilose, Setzliste und faire Auslosung',
  description: 'Wie ein K.-o.-Turnierbaum funktioniert, was Freilose und Setzlisten bedeuten, wie du ihn für Spieleabende, Büro, Sport oder Lieblings-Duelle nutzt und warum die Zufallsauslosung fair ist.',
  h1: 'Turnierbaum erklärt: K.-o.-System, Freilose und Setzliste',
  updated: '2026-10-30',
  intro: 'Ein Turnierbaum ist der einfachste Weg, aus einer langen Liste einen einzigen Sieger zu machen. Zwei treten gegeneinander an, einer kommt weiter, und mit jeder Runde halbiert sich das Feld, bis nur noch der Champion übrig ist. Dieser Ratgeber erklärt, wie ein Turnierbaum im K.-o.-System aufgebaut ist, warum manche ein Freilos bekommen, was eine Setzliste ist, wie du einen Turnierbaum für Spieleabende, Büro-Wettbewerbe, Sport oder lustige Lieblings-Duelle nutzt und warum eine echte Zufallsauslosung der fairste Start ist.',
  sections: [
    {
      h: 'So funktioniert das K.-o.-System',
      p: [
        'Im K.-o.-System hat jedes Spiel genau einen Sieger und einen Verlierer, und der Verlierer scheidet aus. Bei 8 Teilnehmern gibt es 4 Viertelfinals, 2 Halbfinals und 1 Finale. Daraus folgt eine praktische Regel: Weil jedes Spiel genau einen Teilnehmer ausscheiden lässt, braucht ein Turnierbaum mit n Teilnehmern immer n − 1 Spiele bis zum Sieger. 16 Teilnehmer brauchen 15 Spiele, 64 Teilnehmer 63.',
        'Die Runden werden vom Ende her benannt: Im Finale sind noch 2 übrig, im Halbfinale 4, im Viertelfinale 8, davor kommen Achtelfinale und Sechzehntelfinale. In dieser App kannst du die Sieger selbst wählen, immer zwei Karten auf einmal, oder nur auslosen und die Sieger später antippen, wenn echte Spiele gespielt sind.',
      ],
      list: [
        'Gib 2 bis 64 Namen oder Begriffe ein, einen pro Zeile.',
        'Wähle Zufallsauslosung oder deine eigene Reihenfolge als Setzliste.',
        'Wähle Sieger Spiel für Spiel oder lose nur aus.',
        'Mach eine Wahl rückgängig oder tippe einen anderen Namen an.',
        'Speichere den fertigen Turnierbaum als PNG, kopiere ihn als Text oder teile einen Link.',
      ],
    },
    {
      h: 'Freilose: wenn die Zahl nicht aufgeht',
      p: [
        'Ein Turnierbaum lässt sich nur sauber halbieren, wenn die Zahl der Plätze eine Zweierpotenz ist: 2, 4, 8, 16, 32 oder 64. Echte Gruppen sind das selten. Bei 6 Spielern hat der Baum trotzdem 8 Plätze, also bleiben zwei leer. Wer gegen einen leeren Platz gelost wird, bekommt ein Freilos und zieht ohne Spiel in die nächste Runde ein.',
        'Freilose sollten verteilt und nicht gehäuft sein. Ein guter Turnierbaum lässt nie zwei leere Plätze aufeinandertreffen und verteilt Freilose möglichst gleichmäßig auf obere und untere Hälfte, damit keine Seite einen leichteren Weg hat. Die App setzt Freilose nach dem üblichen Setzschema, das genau das leistet, und zählt ein Freilos nie als Spiel.',
      ],
    },
    {
      h: 'Setzliste: Zufall oder eigene Reihenfolge',
      p: [
        'Die Setzliste bestimmt, wo jeder startet. Im Sport werden die Teilnehmer nach Stärke geordnet, damit die Besten möglichst spät aufeinandertreffen: Nummer 1 spielt zuerst gegen den schwächsten Gesetzten, Nummer 2 kommt in die andere Hälfte und so weiter. Wenn du in der App deine Reihenfolge behältst, wird deine Liste zur Setzliste. Die erste Zeile ist an 1 gesetzt, die zweite an 2, und die Bestgesetzten bekommen Freilose zuerst.',
        'Wenn niemand bevorzugt werden soll, nimm die Zufallsauslosung. Sie passt für Spieleabende, Verlosungen, eine Liste mit Snacks oder Filmen und jede Runde, in der man sich nicht vorwerfen lassen will, die Paarungen geschoben zu haben.',
      ],
    },
    {
      h: 'Warum die Zufallsauslosung fair ist',
      p: [
        'Eine Auslosung ist nur fair, wenn jede mögliche Reihenfolge gleich wahrscheinlich ist. Viele schnelle Tools mischen mit schwachem Zufall oder einem Sortier-Trick, der bestimmte Plätze unbemerkt bevorzugt. Diese App nutzt den kryptografischen Zufallsgenerator des Browsers und das Fisher-Yates-Verfahren mit Verwerfungsmethode. Das entfernt sogar die winzige Verzerrung, die entsteht, wenn man Zufallszahlen auf einen kleineren Bereich herunterrechnet. So hat jede Anordnung deiner Liste genau dieselbe Chance, und niemand, auch nicht die Person mit dem Handy, bestimmt die Paarungen.',
        'Fairness heißt auch, dass der Baum immer stimmig bleibt. Änderst du einen Sieger in einer frühen Runde, werden alle späteren Ergebnisse gelöscht, die davon abhingen. Ein Name kann also nie in einer Runde stehen, die er gar nicht erreicht hat.',
      ],
    },
    {
      h: 'Ideen: Spieleabend, Büro, Sport und Lieblings-Duelle',
      p: [
        'Beim Spieleabend trägst du alle Namen ein, lost aus und spielst echte Runden Tischtennis, Videospiel oder Schere, Stein, Papier und tippst jeden Sieger an. Im Büro ist ein Turnierbaum eine lockere Abstimmung über das Team-Mittagessen, einen Projektnamen oder die schönste Tasse in der Teeküche. Vereine und kleine Ligen losen einen K.-o.-Pokal aus, speichern das Bild und posten es in die Gruppe.',
        'In Korea ist dasselbe Format als Ideal-Typ-Weltmeisterschaft bekannt: Man wählt aus zwei immer den Favoriten, Runde für Runde, bis nur einer bleibt. Probier es mit Gerichten, Songs, Reisezielen oder allem, bei dem du dich nicht entscheiden kannst. Das Ergebnis überrascht oft, und genau das macht den halben Spaß aus. Teile am Ende den Link, damit Freunde deinen ganzen Weg zum Sieger sehen.',
      ],
    },
  ],
  cta: 'Jetzt Turnierbaum erstellen',
};
