module.exports = {
  metaTitle: 'Zahlenraten (Bulls and Cows): Regeln, Tipps und Geschichte',
  description: 'So spielst du Zahlenraten (Bulls and Cows, Zahlen-Baseball): Regeln, Hinweise richtig lesen, Denkstrategien, ein kurzer Blick in die Geschichte und der Bezug zu Mastermind.',
  h1: 'Zahlenraten (Bulls and Cows): so spielst du und so denkst du dich zur Lösung',
  updated: '2026-10-18',
  intro: 'Bulls and Cows ist ein klassisches Code-Knacker-Spiel für eine Person: Eine Geheimzahl bleibt verborgen, du rätst, und jeder Tipp bringt dir einen kleinen Hinweis. In vielen Ländern heißt das Spiel Zahlen-Baseball, weil die Hinweise Strikes, Bälle und Outs heißen. Dieser Leitfaden erklärt die Regeln der Version auf dieser Seite, wie du die Hinweise liest, Denkweisen, die das Rätsel leichter machen, woher das Spiel stammt und wie du es mit Freunden spielst.',
  sections: [
    {
      h: 'Was Bulls and Cows ist',
      p: [
        'Der Computer wählt eine Geheimzahl aus lauter verschiedenen Ziffern. In der klassischen Stufe hat sie 3 Ziffern, in der härteren Stufe 4. Eine Ziffer kommt nie zweimal vor, aber die Null ist erlaubt, auch am Anfang, sodass 072 eine ganz normale Geheimzahl ist. Das ergibt 720 mögliche Geheimzahlen bei drei Ziffern und 5.040 bei vier, und jede ist gleich wahrscheinlich, weil die Ziffern in jeder Runde fair gemischt werden.',
        'Dein Ziel ist es, die Zahl mit möglichst wenigen Tipps zu finden. Nach jedem Tipp erfährst du, wie nah du dran warst, aber nicht, welche Ziffern stimmten, und genau daraus entsteht das Rätsel. Ohne Stoppuhr gibt es keine Zeitbegrenzung und es gibt keinen Hinweis-Knopf, das ganze Spiel lebt also von sorgfältigem Nachdenken.',
      ],
    },
    {
      h: 'So läuft eine Runde',
      p: [
        'Wähle auf dem Startbildschirm 3 oder 4 Ziffern und tippe auf Los geht’s. Gib mit dem Ziffernblock auf dem Bildschirm oder mit der Tastatur eine Zahl gleicher Länge ein und tippe auf Raten. Dein Tipp darf keine Ziffer doppelt enthalten, und eine schon probierte Zahl wird nicht erneut gezählt.',
      ],
      list: [
        'Ein Treffer (Strike) ist eine richtige Ziffer an der richtigen Stelle.',
        'Ein „Fast“ (Ball) ist eine Ziffer, die in der Geheimzahl vorkommt, aber an einer anderen Stelle steht.',
        '„Daneben“ (Out) heißt, dass keine deiner Ziffern in der Geheimzahl vorkommt.',
        'Du gewinnst, wenn alle Ziffern Treffer sind. Das Ergebnis zeigt, wie viele Versuche du gebraucht hast.',
        'Wenn du nicht weiterkommst, tippe zweimal auf Aufgeben, um die Lösung zu sehen und eine neue Runde zu starten. Eine aufgegebene Runde zählt nicht für deine Bestleistung.',
      ],
    },
    {
      h: 'Denkweisen, die helfen',
      p: [
        'Anfänger raten oft einfach drauflos und hoffen auf Glück. Besser ist die Gewohnheit, jede Antwort als kleine Tatsache zu behandeln und aufzuschreiben, was sie ausschließt. Schon ein einfacher Notizzettel, auf Papier oder im Kopf, lässt das Spiel viel weniger nach Zufall aussehen.',
      ],
      list: [
        'Zähle Treffer und Fast-Treffer zusammen. Die Summe sagt dir, wie viele deiner Ziffern in der Geheimzahl vorkommen, egal wo.',
        '„Daneben“ ist sehr wertvoll. Es schließt auf einen Schlag alle benutzten Ziffern aus, und du musst nie wieder an sie denken.',
        'Ändere zwischen zwei Tipps nur ein bis zwei Dinge. Wenn sich der Hinweis ändert, weißt du, dass die getauschte Ziffer der Grund ist.',
        'Prüfe Ziffern und Positionen getrennt. Sobald klar ist, dass eine Ziffer dazugehört, verschiebe sie, um ihren Platz zu finden.',
        'Achte darauf, dass jeder Tipp noch die Lösung sein könnte. Widerspricht er etwas, das du schon weißt, kann er nicht gewinnen und kostet dich einen Zug.',
        'Klammere dich nicht an den ersten Glückstreffer. Prüfe, ob er zu allen früheren Hinweisen passt, bevor du darauf aufbaust.',
      ],
    },
    {
      h: 'Woher das Spiel kommt',
      p: [
        'Bulls and Cows ist ein altes Papier-und-Bleistift-Spiel, meist zu zweit gespielt, wobei man abwechselnd Rätselsteller und Rater ist. Es gilt als Vorläufer von Mastermind, dem Brettspiel mit bunten Steckern, das Anfang der 1970er-Jahre erschien. Eine Computerversion namens Moo lief im selben Jahrzehnt auf einem Großrechner der Universität Cambridge, und seitdem ist das Spiel eine Lieblingsübung von Programmierern.',
        'Die Idee ist unter vielen Namen verbreitet. In Korea heißt sie Zahlen-Baseball und nutzt Baseball-Begriffe, wie es auch diese Seite tut. In Japan sagt man oft Hit and Blow, in China 1A2B, und im Russischen oder Spanischen heißen die Hinweise Bullen und Kühe. Computer haben gezeigt, dass sich jede vierstellige Geheimzahl bei perfektem Spiel mit höchstens sieben Tipps lösen lässt, im Schnitt mit etwas mehr als fünf. Wer nahe daran kommt, ist als Mensch richtig gut.',
      ],
    },
    {
      h: 'Mit Freunden spielen und Fortschritte verfolgen',
      p: [
        'Das Spiel lässt sich leicht in einen freundlichen Wettstreit verwandeln. Einigt euch auf die Ziffernzahl, spielt alle ein paar Mal dieselbe Stufe und vergleicht, wer die wenigsten Versuche braucht. Da außer der Geheimzahl nichts verborgen ist, könnt ihr nach einer Runde auch über euer Vorgehen sprechen, was eine gute Möglichkeit ist, neue Tricks zu lernen.',
        'Deine Bestleistung pro Stufe wird nur in diesem Browser gespeichert. Wenn du eine Runde löst, wird deine Versuchszahl mit den echten Ergebnissen anderer Spieler derselben Stufe verglichen, und gibt es noch nichts zu vergleichen, entfällt der Vergleich einfach. Versuche erst, deine eigene Bestmarke zu schlagen, und wage dich dann an die vierstellige Stufe.',
      ],
    },
  ],
  cta: 'Jetzt Zahlenraten spielen',
};
