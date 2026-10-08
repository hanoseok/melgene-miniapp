module.exports = {
  "metaTitle": "2048 Spiel: Anleitung, Strategie-Tipps und Geschichte",
  "description": "So spielst du 2048, warum die Ecken-Strategie funktioniert, wie die Punkte zählen und woher das Spiel stammt. Danach kostenlos im Browser spielen.",
  "h1": "2048 Spiel: so spielst du und erreichst die 2048",
  "updated": "2026-10-09",
  "intro": "2048 wirkt einfach: Zahlenkacheln auf einem Vier-mal-vier-Feld verschieben und gleiche verschmelzen. Trotzdem steckt überraschend viel Tiefe darin. Dieser Ratgeber behandelt die Regeln, die Punktewertung, die Strategien erfahrener Spielender und die kurze Geschichte eines der am häufigsten nachgebauten Puzzlespiele des letzten Jahrzehnts.",
  "sections": [
    {
      "h": "So spielst du",
      "p": [
        "Das Spielfeld ist ein Raster aus vier mal vier Feldern mit ein paar Zahlenkacheln. Wische über das Feld oder drücke die Pfeiltasten (oder W, A, S, D), und alle Kacheln rutschen so weit wie möglich in diese Richtung. Treffen zwei Kacheln mit derselben Zahl aufeinander, verschmelzen sie zu einer Kachel mit dem doppelten Wert: Zwei 2er werden zur 4, zwei 64er zur 128.",
        "Nach jedem Zug, der das Feld wirklich verändert, erscheint eine neue Kachel auf einem freien Feld. Meistens ist es eine 2, etwa jedes zehnte Mal eine 4. Bewegt dein Wischen nichts, kommt keine Kachel hinzu. Dein Ziel ist eine Kachel mit der Zahl 2048. Danach kannst du für mehr Punkte weiterspielen oder dort aufhören."
      ],
      "list": [
        "Wische oder nutze die Tasten, um alle Kacheln gleichzeitig zu verschieben.",
        "Gleiche Nachbarn verschmelzen zu einer Kachel mit doppeltem Wert.",
        "Nach jedem Zug, der das Feld verändert, erscheint eine neue 2 oder 4.",
        "Das Spiel endet, wenn das Feld voll ist und keine Nachbarn gleich sind."
      ]
    },
    {
      "h": "Regeln, die du kennen solltest",
      "p": [
        "Eine Kachel kann pro Zug nur einmal verschmelzen. Liegt in einer Reihe 2, 2, 2, 2, ergibt ein Zug zwei 4er und keine 8, und das Paar, das näher an der Wand in Zugrichtung liegt, verschmilzt zuerst. Dieses Detail zählt, wenn du eine Kette von Verschmelzungen planst.",
        "Es gibt keinen Timer und kein Zurück, jeder Zug ist endgültig. Dein Punktestand steigt um den Wert jeder neu entstandenen Kachel, eine Verschmelzung zu einer 512 bringt also 512 Punkte. Große Verschmelzungen sind daher deutlich mehr wert als kleine. Dein Bestwert wird in diesem Browser gespeichert, und am Spielende kann dein Ergebnis anonym mit anderen verglichen werden, um einen Top-Prozentwert zu zeigen."
      ]
    },
    {
      "h": "Strategie: die größte Kachel in der Ecke halten",
      "p": [
        "Die nützlichste Gewohnheit ist, eine Ecke zu wählen und dort deine größte Kachel zu halten. Baue am Rand eine absteigende Kette auf: die größte Kachel in der Ecke, die nächstgrößere daneben und so weiter, wie eine Schlange. Weil die Kacheln der Kette ähnliche Werte haben, verschmelzen sie nacheinander, statt sich zu blockieren.",
        "Wähle zwei Hauptrichtungen, etwa nach unten und nach links, wenn deine Ecke unten links ist. Nutze eine dritte Richtung nur, wenn es sein muss, und die vierte möglichst nie, denn sie zieht die große Kachel aus der Ecke. Musst du sie spielen, prüfe vorher, ob die Eckreihe voll ist, damit die Kachel nicht davonrutschen kann."
      ],
      "list": [
        "Wähle eine Ecke und lass die größte Kachel dort.",
        "Bevorzuge zwei Hauptrichtungen, die dritte nur sparsam.",
        "Fülle die Reihe deiner Kette, bevor du die nächste aufbaust.",
        "Verschmelze kleine Kacheln nahe der Kette, nicht weit entfernt."
      ]
    },
    {
      "h": "Häufige Fehler",
      "p": [
        "Anfänger wischen oft in alle vier Richtungen, um leichten Verschmelzungen nachzujagen. Dadurch verteilen sich große Kacheln über das Feld, und kleine werden dazwischen eingeklemmt. Ein weiterer Fehler ist, Züge für winzige Verschmelzungen zu verbrauchen, während eine große Kachel keinen Partner in der Nähe hat.",
        "Denke ein bis zwei Züge voraus. Frage dich vor jedem Wischen, wo die neue Kachel landen könnte und ob der Zug eine Reihe öffnet oder blockiert. Wird das Feld voll, werde langsamer: Ein achtloser Zug kann das Spiel beenden, während Geduld eine unübersichtliche Lage retten kann."
      ]
    },
    {
      "h": "Woher 2048 kommt",
      "p": [
        "2048 wurde im März 2014 vom italienischen Entwickler Gabriele Cirulli als Wochenendprojekt geschaffen. Es ließ sich von früheren Spielen wie 1024 und Threes inspirieren, und er veröffentlichte den Code offen, was zu unzähligen Varianten und Klonen führte. Die Zahl 2048 ist zwei hoch elf, und theoretisch kann ein Vier-mal-vier-Feld eine Kachel von 131072 erreichen.",
        "Diese Version bringt eine Halloween-Optik, die Regeln sind aber die klassischen. Spiele ein paar Runden, probiere die Ecken-Strategie und teile deinen Punktestand mit einem Freund, um zu sehen, wer weiterkommt."
      ]
    }
  ],
  "cta": "2048 jetzt spielen"
};
