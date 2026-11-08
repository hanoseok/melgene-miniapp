module.exports = {
  metaTitle: 'Gewinnspiel-Auslosung: Anleitung für eine faire Losziehung',
  description: 'So gelingt eine faire Gewinnspiel-Auslosung online: Namen einfügen oder Losnummern nutzen, Preise und Reihenfolge festlegen und die Gewinner einzeln auf dem großen Bildschirm ziehen.',
  h1: 'Faire Losziehung auf der Weihnachtsfeier oder im Livestream',
  updated: '2026-11-09',
  intro: 'Die Verlosung ist oft der Moment, an den sich nach der Weihnachtsfeier alle erinnern. Die Handys verschwinden, es wird still, und beim ersten Namen gibt es Jubel. Schwierig ist nur die Durchführung: Zettel gehen verloren, ein Name wird zweimal gezogen, und niemand weiß genau, ob die Lostrommel gut gemischt war. Diese Auslosungs-App ersetzt die Trommel durch einen Bildschirm. Du fügst die Teilnehmerliste ein oder wählst nummerierte Lose, trägst die Preise ein und enthüllst die Gewinner nacheinander nach einem kurzen Namenswirbel. Diese Anleitung erklärt Einrichtung, Optionen, Moderation und warum das Ergebnis fair ist.',
  sections: [
    {
      h: 'So funktioniert die Auslosung',
      p: [
        'Wähle zuerst, wer mitmacht. Nimm Namen, wenn du eine Gästeliste, eine Klassenliste oder die Nutzernamen aus einem Livestream-Chat hast, und füge sie zeilenweise ein. Nimm Losnummern, wenn die Teilnehmer nummerierte Lose haben, und gib die höchste Nummer ein. Dann trägst du die Preise vom größten zum kleinsten ein, jeweils mit der Anzahl der Gewinner. Voreingestellt sind ein Hauptpreis, zwei zweite und fünf dritte Preise; du kannst sie umbenennen, die Anzahl ändern oder bis zu zwölf Preise anlegen.',
        'Mit Auslosung starten öffnet sich der Ziehungsbildschirm. Bei jedem Tippen auf Ziehen wirbeln die Namen kurz und bleiben bei einem Gewinner stehen. Preis und Name erscheinen groß, und darunter sammelt eine Liste alle bisherigen Gewinner. Hat ein Preis mehrere Gewinner und die Zeit ist knapp, zieht „Alle auf einmal“ den Rest dieses Preises in einem Schritt. Sind alle Preise gezogen, zeigt das Ergebnis die Gewinner nach Preisen geordnet.',
      ],
      list: [
        'Namen oder Losnummern wählen.',
        'Preise vom größten zum kleinsten mit Gewinnerzahl eintragen.',
        'Reihenfolge und Mehrfachgewinne festlegen.',
        'Einzeln ziehen oder den Rest eines Preises auf einmal.',
        'Ergebnis als Text kopieren oder den Link teilen.',
      ],
    },
    {
      h: 'Namen, Losnummern und zusätzliche Lose',
      p: [
        'Die Namensliste funktioniert am besten, wenn jede Person nur einmal vorkommt. Steht ein Name doppelt da, weist die App darauf hin, denn meist wurde die Liste zweimal kopiert oder zwei Personen heißen gleich. Jede Zeile zählt als eigene Teilnahme, also ergänze Nachname oder Initial. Soll jemand bessere Chancen haben, etwa weil er drei Lose gekauft hat, schreibe *3 hinter den Namen. Dann hat diese Person dreifache Chancen, gewinnt bei aktiver Einmal-Regel aber trotzdem nur einmal.',
        'Losnummern passen zu Tombolas, Schulfesten und Feiern, bei denen am Eingang Papierlose verkauft werden. Gib die letzte verkaufte Nummer ein; die App zieht zwischen 1 und dieser Nummer, und die Gewinnnummer wird groß angezeigt, damit der Besitzer mit seinem Abschnitt nach vorne kommt.',
      ],
    },
    {
      h: 'Reihenfolge und „Jede Person gewinnt nur einmal“',
      p: [
        'Die meisten Feiern heben das Beste bis zum Schluss auf. Deshalb werden standardmäßig zuerst die kleinen Preise und ganz am Ende der Hauptpreis gezogen – so bleiben alle bis zur letzten Ziehung. Bei einem kurzen Livestream, in dem Zuschauer früh gehen könnten, kannst du mit dem Hauptpreis beginnen.',
        'Die Regel, dass jede Person nur einmal gewinnt, ist voreingestellt. Wer gewonnen hat, scheidet für die übrigen Preise aus, sodass sich die Geschenke auf mehr Leute verteilen. Schalte sie aus, wenn jeder Preis allen offenstehen soll, etwa bei mehreren Verlosungen über einen langen Abend. Denselben Preis gewinnt trotzdem niemand zweimal.',
      ],
    },
    {
      h: 'Tipps für Weihnachtsfeier und Livestream-Gewinnspiel',
      p: [
        'Schließe einen Laptop an Fernseher oder Beamer an und aktiviere den Präsentationsmodus. Titelleiste und Zusatzknöpfe verschwinden, Preis und Name werden größer und sind auch hinten im Raum lesbar. Mit einem Presenter oder der Leertaste ziehst du den nächsten Gewinner und kannst beim Publikum bleiben. Kündige vor jeder Ziehung den Preis an, das steigert die Spannung, und nutze „Sofort zeigen“, wenn der Abend knapp wird.',
        'Für ein Online-Gewinnspiel sammelst du die Teilnahmen zuerst an einem Ort, etwa in den Kommentaren eines Beitrags, und fügst die Nutzernamen in die Liste ein. Teile während der Ziehung deinen Bildschirm, damit alle zusehen können. Danach kopierst du das Ergebnis in den Chat oder schickst den Link, der nur Preise und Gewinner enthält. Bei einem Versehen nimmt „Letzte Ziehung zurück“ die Ziehung zurück – sag es dem Publikum aber, bevor du neu ziehst.',
      ],
    },
    {
      h: 'Warum die Ziehung fair ist',
      p: [
        'Fairness ist der Sinn einer Verlosung, deshalb nimmt die App keine Abkürzungen. Die Liste wird nicht vorher gemischt: Jeder Gewinner wird erst beim Tippen auf Ziehen mit dem kryptografischen Zufallsgenerator des Browsers bestimmt, derselben Art Zufall, die für Sicherheitsschlüssel verwendet wird. Jedes verbleibende Los hat genau dieselbe Chance, und Verwerfungsmethode (Rejection Sampling) beseitigt die kleine Verzerrung einfacher Zufallscodes. Die wirbelnden Namen sind nur Show und erscheinen, nachdem der Gewinner schon feststeht.',
        'Deine Liste verlässt das Gerät nie. Namen, Preise und eine laufende Auslosung bleiben im Browser, auch nach dem Neuladen, und nichts wird auf einen Server hochgeladen. Am Ende löscht „Neue Auslosung“ die Gewinner, oder du behältst die Liste fürs nächste Jahr.',
      ],
    },
  ],
  cta: 'Jetzt Auslosung starten',
};
