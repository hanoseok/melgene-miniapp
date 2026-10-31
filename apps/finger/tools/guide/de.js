module.exports = {
  metaTitle: 'Finger-Auswahl: Zufallsauswahl mit den Fingern',
  description: 'So nutzt du die Finger-Auswahl auf einem Handy: einen oder mehrere Gewinner, faire Teams, warum die Zufallsauswahl gerecht ist, Spielideen und Tipps für große Runden.',
  h1: 'Finger-Auswahl: Zufallsauswahl, bei der alle einen Finger auflegen',
  updated: '2026-11-01',
  intro: 'Die Finger-Auswahl beendet kleine Streitereien in Sekunden. Das Handy kommt in die Tischmitte, jeder legt einen Finger auf den Bildschirm, und nach einer kurzen Pause leuchtet die App einen davon an. Keine Namen eintippen, keine Zettel falten, niemand muss den Hut halten. Dieser Ratgeber erklärt, wie es funktioniert, welche drei Modi es gibt, warum die Auswahl wirklich fair ist, und gibt Ideen für Partys, den Unterricht und das Familienessen.',
  sections: [
    {
      h: 'So funktioniert es',
      p: [
        'Wähle auf dem Startbildschirm, was die App entscheiden soll. Ein Gewinner bestimmt genau einen Finger. Mehrere Gewinner wählt zwei oder mehr auf einmal, praktisch, wenn du ein paar Freiwillige brauchst. Teams teilt alle in zwei, drei oder vier farbige Teams von fast gleicher Größe auf. Öffne danach das Fingerfeld.',
        'Jetzt legen alle gleichzeitig einen Finger auf den Bildschirm. Jeder Finger bekommt einen eigenen leuchtenden Kreis in einer anderen Farbe. Sobald genug Finger aufliegen, beginnen die Kreise zu pulsieren und ein Ring füllt sich. Haltet still: Wenn jemand einen Finger dazulegt oder abhebt, startet der Countdown von vorn. Ist der Ring voll, entscheidet das Feld. Die anderen Kreise verblassen, der gewählte wächst, und das Handy vibriert kurz, falls es das kann.',
      ],
      list: [
        '1 Gewinner, mehrere Gewinner oder Teams wählen.',
        'Das Fingerfeld öffnen und das Handy auf eine ebene Fläche legen.',
        'Jeder drückt einen Finger auf den Bildschirm.',
        'Stillhalten, bis sich der Ring gefüllt hat.',
        'Der leuchtende Kreis oder die Kreise je Teamfarbe zeigen das Ergebnis.',
      ],
    },
    {
      h: 'Am Computer oder auf Einzeltouch-Bildschirmen',
      p: [
        'Nicht jeder Bildschirm erkennt viele Finger gleichzeitig. Laptops und Desktop-Rechner haben meist nur eine Maus, und manche Handys und Tablets erfassen nur wenige Berührungen. Dann schaltet die App in den Klick-Modus: Pro Spieler einmal klicken, um einen farbigen Punkt zu setzen, einen Punkt noch mal anklicken, falls er versehentlich entstanden ist, und auf Los drücken, wenn alle dabei sind. Die Auswahl läuft danach genauso ab wie mit Fingern.',
        'Der Klick-Modus eignet sich auch für große Gruppen. Die meisten Handys verfolgen etwa fünf Finger gleichzeitig, das Feld nimmt bis zu zehn an. Wenn mehr Leute mitspielen, als der Bildschirm spüren kann, setzt euch um ein Tablet, nutzt den Klick-Modus am Laptop oder spielt zwei Runden und lasst die beiden Sieger gegeneinander antreten.',
      ],
    },
    {
      h: 'Warum die Auswahl fair ist',
      p: [
        'Die App entscheidet nichts im Voraus. Erst in dem Moment, in dem sich der Ring füllt, schaut sie sich die aufliegenden Finger an und lost unter ihnen mit dem kryptografischen Zufallsgenerator deines Browsers, crypto.getRandomValues. Sie arbeitet mit Rejection Sampling: Die wenigen Rohwerte, die manche Positionen minimal bevorzugen würden, werden verworfen, sodass jeder Finger exakt die gleiche Chance hat. Wo du den Finger hinlegst, wie früh du da warst und welche Farbe du bekommst, spielt keine Rolle.',
        'Teams nutzen dieselbe Quelle. Alle Finger werden gemischt und dann der Reihe nach auf die Teams verteilt, beginnend bei einem zufällig gewählten Team. So unterscheiden sich die Teamgrößen höchstens um eine Person, und jeder hat dieselbe Chance, in jedem Team zu landen. Weil der Countdown bei jedem hinzugefügten oder abgehobenen Finger neu startet, kann niemand abwarten und erst in letzter Sekunde ein- oder aussteigen.',
      ],
    },
    {
      h: 'Ideen für Party und Alltag',
      p: [
        'Die Finger-Auswahl glänzt immer dann, wenn eine Gruppe schnell und neutral entscheiden will. Klärt vorher, was das Ergebnis bedeutet, bevor jemand den Bildschirm berührt, dann wird es mit einem Lachen statt mit einer Diskussion akzeptiert.',
      ],
      list: [
        'Wer diesmal die Kaffeerunde oder die Pizza bezahlt.',
        'Wer bei Mensch ärgere dich nicht oder beim Kartenspiel anfängt.',
        'Wer abwäscht, den Müll rausbringt oder mit dem Hund Gassi geht.',
        'Wer die nächste Frage im Quiz oder bei Wahrheit oder Pflicht beantwortet.',
        'Freunde in Teams aufteilen für Activity, Kicker, Fußball oder das Kneipenquiz.',
        'Zwei Freiwillige in der Klasse mit dem Modus Mehrere Gewinner bestimmen.',
      ],
    },
    {
      h: 'Tipps für eine reibungslose Runde',
      p: [
        'Leg das Handy flach auf den Tisch, statt es zu halten, damit niemand versehentlich mit dem Daumen den Bildschirm berührt. Bitte alle, nur einen Finger zu benutzen und ihn aufgelegt zu lassen: Verschieben ist in Ordnung, Abheben startet die Wartezeit neu. Löst das Handy eine Systemgeste aus oder zieht ein Menü herunter, setz die Finger etwas weiter vom Bildschirmrand entfernt auf.',
        'Die Ergebnisse der letzten zehn Runden stehen unter dem Resultat, solange die Seite offen ist, praktisch für ein Best-of-three. Sie liegen nur im Arbeitsspeicher und verschwinden, wenn du die Seite schließt, und die Berührungen selbst verlassen dein Gerät nie.',
      ],
      list: [
        'Das Handy flach hinlegen und sich darum versammeln.',
        'Ein Finger pro Person, weg vom Bildschirmrand.',
        'Den Finger erst abheben, wenn das Ergebnis erscheint.',
        'Bei mehr als fünf Personen ein Tablet oder den Klick-Modus nehmen.',
      ],
    },
  ],
  cta: 'Finger-Auswahl öffnen',
};
