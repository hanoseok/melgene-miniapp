module.exports = {
  metaTitle: "Lottozahlen-Generator: Anleitung, Zufall und Kombinatorik",
  description: "So funktioniert der Lottozahlen-Generator, ob die Zahlen wirklich zufällig sind, die Mathematik der Kombinationen und wie du ihn verantwortungsvoll nutzt.",
  h1: "Lottozahlen-Generator: wie zufällige Lottozahlen wirklich entstehen",
  updated: "2026-10-09",
  intro: "Der Lottozahlen-Generator zieht Zahlen für das koreanische 6/45, ein Spiel im Euro-Stil, den US-Powerball oder einen Bereich deiner Wahl und lässt sie am Bildschirm aus einer Ziehungsmaschine rollen. Er ist nur zum Spaß gedacht. Dieser Ratgeber erklärt, wie du ihn nutzt, warum seine Zahlen im strengen Sinn zufällig sind, wie die Mathematik der Lotto-Kombinationen aussieht, kreative Einsatzmöglichkeiten über das Lotto hinaus und wie du verantwortungsvoll spielst.",
  sections: [
    {
      h: "So funktioniert der Generator",
      p: [
        "Du wählst zuerst ein Spiel. Das koreanische 6/45 zieht sechs Zahlen von 1 bis 45. Das Spiel im Euro-Stil zieht fünf Zahlen von 1 bis 50 plus zwei Sterne von 1 bis 12. Der US-Powerball zieht fünf Zahlen von 1 bis 69 plus einen Powerball von 1 bis 26. Beim eigenen Spiel legst du die höchste Zahl bis 100 und die Anzahl der gezogenen Zahlen bis zehn fest. Danach bestimmst du, wie viele Tipps erzeugt werden, von einem bis fünf.",
        "Vor der Ziehung kannst du Zahlen zum Behalten und Zahlen zum Streichen angeben. Behaltene Zahlen erscheinen in jedem Tipp, und die übrigen Zahlen werden um sie herum gezogen; gestrichene Zahlen erscheinen nie. Beide Einstellungen gelten nur für die Hauptzahlen, nicht für die Sterne oder den Powerball. Drückst du auf die Ziehen-Taste, werden zuerst die Zahlen bestimmt, dann wirbeln die Kugeln in der Maschine und rollen nacheinander heraus, und zuletzt wird jeder Tipp aufsteigend sortiert angezeigt. Die Kugelfarben folgen den bekannten koreanischen Bereichen, und eine Kopieren-Taste legt das Ergebnis in die Zwischenablage."
      ],
      list: [
        "Wähle koreanisches 6/45, Euro-Stil, US-Powerball oder einen eigenen Bereich.",
        "Wähle die Zahl der Tipps, von 1 bis 5.",
        "Gib optional Zahlen zum Behalten und zum Streichen an, durch Kommas getrennt.",
        "Drücke die Ziehen-Taste und sieh zu, wie die Kugeln herausrollen.",
        "Kopiere die Zahlen, ziehe erneut oder gehe zurück zu den Einstellungen."
      ]
    },
    {
      h: "Sind die Zahlen wirklich zufällig?",
      p: [
        "Der Generator nutzt die kryptografische Zufallsquelle deines Browsers, dieselbe Art von Zufall, mit der Sicherheitsschlüssel erzeugt werden. Eine ganze Zahl aus einem Bereich zu ziehen klingt einfach, doch eine unsaubere Methode kann manche Zahlen bevorzugen. Nimmt man etwa einen großen Zufallswert und verwendet den Rest nach der Division durch 45, kommen die kleineren Reste etwas häufiger vor. Um das zu vermeiden, verwirft das Werkzeug die wenigen Zufallswerte, die diese Schieflage verursachen würden, und zieht neu. Diese Technik heißt Rejection Sampling.",
        "Anschließend werden die Zahlen ohne Wiederholung durch ein teilweises Mischen ausgewählt, sodass bei jedem Schritt jede verbleibende Zahl dieselbe Chance hat. Die Animation der rollenden Kugeln läuft erst ab, wenn das Ergebnis längst feststeht, und beeinflusst es nicht. Deshalb ist jede zulässige Zahl gleich wahrscheinlich, und deshalb lässt sich das Werkzeug weder durch den Zeitpunkt noch durch eine besondere Art des Tippens steuern."
      ]
    },
    {
      h: "Die Mathematik der Lotto-Kombinationen",
      p: [
        "Lotto ist ein Zählproblem. Bei 6/45 gibt es 8.145.060 verschiedene Sechser-Kombinationen. Bei 5/50 plus 2/12 gibt es 2.118.760 Möglichkeiten für die fünf Hauptzahlen und 66 für die zwei Sterne, zusammen 139.838.160 Kombinationen. Bei 5/69 plus 1/26 gibt es 11.238.513 Möglichkeiten für die fünf Zahlen und 26 für den Powerball, also 292.201.338 Kombinationen. Je mehr Kombinationen es gibt, desto kleiner ist der Anteil, den ein einzelner Schein abdeckt.",
        "Jede Kombination ist genau so wahrscheinlich wie jede andere, auch 1, 2, 3, 4, 5, 6. Frühere Ergebnisse verändern spätere Ziehungen nicht, es gibt also weder heiße noch kalte Zahlen, und das Behalten oder Streichen von Zahlen ändert nichts an den Chancen. Ein echter Unterschied liegt darin, wie viele andere Spielende dieselben Zahlen wählen. Viele tippen Geburtstage, deshalb werden Kombinationen aus nur kleinen Zahlen im Gewinnfall wahrscheinlich öfter geteilt – das betrifft aber das Teilen eines Gewinns, nicht das Gewinnen."
      ]
    },
    {
      h: "Einsatzmöglichkeiten des Generators",
      p: [
        "Eine faire, schnelle Zufallsauswahl ist weit über das Lotto hinaus nützlich. Der eigene Modus macht daraus einen kleinen Werkzeugkasten für alles, was unverzerrte Zahlen braucht."
      ],
      list: [
        "Glückszahlen zum Spaß ziehen und eine Geburtstags- oder Jubiläumszahl in jedem Tipp behalten.",
        "Gewinner für Verlosungen oder Gewinnspiele ziehen, indem du Teilnehmende nummerierst und eine Zahl ziehst.",
        "Bingo-ähnliche Zahlenreihen erstellen oder bei einem Partyspiel eine Zahl von 1 bis 100 ziehen.",
        "Entscheiden, wer anfängt, indem du eine Sitz- oder Teamnummer ziehst.",
        "Wahrscheinlichkeit im Unterricht erklären, indem viele Ziehungen verglichen werden."
      ]
    },
    {
      h: "Verantwortungsvoll spielen und Datenschutz",
      p: [
        "Dieses Werkzeug ist kein Lotterieanbieter, kann keine Scheine verkaufen und kann deine Gewinnchancen weder vorhersagen noch verbessern. Wenn du Scheine kaufst, betrachte die Kosten als Ausgaben für Unterhaltung: Lege vorher ein Budget fest, kaufe nur bei zugelassenen Anbietern, beachte die Altersgrenzen deines Landes und höre auf, wenn es keinen Spaß mehr macht. Wenn Glücksspiel dir Probleme bereitet, wende dich bitte an eine örtliche Beratungsstelle.",
        "Die Zahlen, die du eingibst, und die gezogenen Zahlen werden in deinem Browser verarbeitet und nicht an unseren Server gesendet. Von deinen Tipps wird nichts gespeichert. Die Seite kann einfache Einstellungen wie deine Sprache merken. Nutze die Kopieren-Taste, wenn du ein Ergebnis behalten möchtest."
      ]
    }
  ],
  cta: "Meine Zahlen ziehen"
};
