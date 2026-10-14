module.exports = {
  metaTitle: 'Zeichenzähler-Guide: Zeichen, Wörter und Bytes richtig zählen',
  description: 'Wie ein Zeichenzähler Zeichen mit und ohne Leerzeichen, Wörter und Bytes zählt, warum Word und Websites abweichen, typische Limits wie 280 Zeichen bei X und Tipps, um genau auf die Ziellänge zu schreiben.',
  h1: 'Zeichenzähler-Guide: was gezählt wird, warum Programme abweichen und wie du ein Limit triffst',
  updated: '2026-10-15',
  intro: 'Längenvorgaben gibt es überall: ein Motivationsschreiben mit höchstens 2.000 Zeichen inklusive Leerzeichen, ein Post mit 280 Zeichen, eine Meta-Beschreibung, die nach etwa 155 Zeichen abgeschnitten wird, ein Abstract mit 250 Wörtern. Ein guter Zähler zeigt dir schon beim Schreiben, wo du stehst, damit du nicht kurz vor der Abgabe hektisch kürzen musst. Dieser Guide erklärt die Bedienung, wie jeder Wert definiert ist, warum Programme leicht unterschiedliche Ergebnisse liefern, welche Limits dir begegnen und wie du entspannt auf eine Ziellänge schreibst.',
  sections: [
    {
      h: 'So benutzt du den Zeichenzähler',
      p: [
        'Tippe direkt ins Feld oder füge Text von irgendwoher ein. Der dunkelblaue Balken oben im Feld zeigt die vier wichtigsten Werte: Zeichen mit Leerzeichen, Zeichen ohne Leerzeichen, Wörter und Bytes. Er bleibt beim Scrollen sichtbar, auch wenn du einen langen Entwurf bearbeitest. Darunter stehen zusätzlich Sätze, Absätze, Zeilen sowie geschätzte Lese- und Sprechzeit.',
        'Schreibst du auf ein Limit hin, wähle 500, 1.000 oder 1.500 Zeichen oder gib einen eigenen Wert ein. Ein Balken füllt sich, wird kurz vor dem Ende orange und beim Überschreiten rot und sagt dir genau, wie viele Zeichen noch fehlen oder gestrichen werden müssen. Mit „Leerzeichen zählen“ legst du fest, ob das Limit dem Wert mit oder ohne Leerzeichen folgt. Am Ende zeigt „Auswertung zeigen“ eine Übersicht zum Kopieren.',
      ],
      list: [
        'Text einfügen oder tippen – die Werte ändern sich bei jedem Anschlag.',
        'Ziel festlegen und wählen, ob Leerzeichen mitzählen.',
        'Byte-Regel des Formulars wählen: UTF-8, UTF-8 + CRLF oder Alt 2-Byte.',
        'Eingefügten Text mit „Leerzeichen bereinigen“ oder „Zeilen verbinden“ säubern; „Rückgängig“ holt ihn zurück.',
        'Der Entwurf bleibt nur in diesem Browser gespeichert und übersteht ein Neuladen.',
      ],
    },
    {
      h: 'Wie jeder Wert definiert ist',
      p: [
        'Zeichen mit Leerzeichen zählt alles, was das Auge als ein Zeichen sieht, plus Leerzeichen und Zeilenumbrüche; jeder Umbruch zählt 1. Umlaute wie ä, ein ß, eine Flagge oder ein Familien-Emoji aus mehreren verbundenen Codepunkten zählen jeweils als ein Zeichen. Zeichen ohne Leerzeichen zieht davon alle Leerzeichen, Tabs und Zeilenumbrüche ab.',
        'Wörter findet die eingebaute, sprachbewusste Worterkennung des Browsers. Eine Folge aus Buchstaben oder Ziffern ist ein Wort, Bindestrich-Wörter wie E-Mail zählen einmal. Lange deutsche Komposita sind ein Wort, egal wie lang. Sätze enden an Punkt, Frage- oder Ausrufezeichen, Absätze trennt eine Leerzeile.',
        'Die Lesezeit geht von etwa 238 Wörtern pro Minute beim stillen Lesen aus, einem Durchschnittswert für Erwachsene, die Sprechzeit von etwa 150 Wörtern pro Minute, einem ruhigen Vortragstempo.',
      ],
      list: [
        'UTF-8: 1 Byte für Buchstaben ohne Umlaut, Ziffern und Leerzeichen, 2 für ä ö ü ß, 3 für Chinesisch, Japanisch und Koreanisch, 4 für die meisten Emoji.',
        'UTF-8 + CRLF: wie UTF-8, aber jeder Zeilenumbruch zählt 2 Bytes, wie in einer Windows-Textdatei.',
        'Alt 2-Byte: ASCII 1 Byte, jedes andere Zeichen 2, ein Umbruch 2 (EUC-KR, Shift_JIS, GBK).',
      ],
    },
    {
      h: 'Warum Word, Google Docs und Websites anders zählen',
      p: [
        'Eine einzige offizielle Zählregel gibt es nicht, kleine Abweichungen sind also normal. Word zählt Absatzmarken nicht als Zeichen, viele Online-Formulare zählen Zeilenumbrüche dagegen mit, manchmal doppelt. Manche Programme zählen jede Unicode-Codeeinheit, wodurch ein Emoji zwei oder mehr Zeichen „kostet“. Auch bei Bindestrich-Wörtern, Zahlen und E-Mail-Adressen gehen die Meinungen auseinander.',
        'Am sichersten: die Hinweise des Formulars lesen, den Zähler genauso einstellen und ein paar Zeichen Puffer lassen, statt das Limit exakt auszureizen. Vor dem Absenden den Text ins echte Feld einfügen und die Anzeige der Website prüfen.',
      ],
    },
    {
      h: 'Limits, die dir begegnen',
      p: [
        'Bewerbungsportale geben die Länge oft in Zeichen inklusive Leerzeichen vor, etwa 2.000 Zeichen für ein Motivationsschreiben. Abstracts und Zusammenfassungen werden eher in Wörtern begrenzt. Prüfe immer, ob Zeichen oder Wörter gemeint sind und ob Leerzeichen mitzählen.',
        'Soziale Netzwerke haben eigene Obergrenzen, die sich von Zeit zu Zeit ändern. Bei X erlaubt ein normaler Post 280 Zeichen, chinesische, japanische und koreanische Zeichen zählen doppelt. Suchmaschinen zeigen meist 150 bis 160 Zeichen einer Meta-Beschreibung, bevor sie abschneiden.',
      ],
      list: [
        'X (Twitter): 280 Zeichen.',
        'Instagram-Bildunterschrift: 2.200 Zeichen.',
        'YouTube: Titel 100 Zeichen, Beschreibung 5.000 Zeichen.',
        'SMS: 160 Zeichen, mit Emoji oder Sonderzeichen nur 70.',
        'Meta-Beschreibung: etwa 150 bis 160 Zeichen anpeilen.',
      ],
    },
    {
      h: 'Tipps, um auf eine Länge zu schreiben',
      p: [
        'Schreib zuerst alles auf, ohne auf die Zahl zu schauen, und kürze dann. Einen langen Entwurf zu straffen ergibt fast immer den besseren Text, als einen kurzen aufzublähen. Fang mit den großen Brocken an: den Satz, der die Frage wiederholt, Floskeln wie „es ist wichtig zu erwähnen, dass“ und Füllwörter wie „eigentlich“, „wirklich“ oder „sehr“. Die Liste der häufigsten Wörter hilft: Taucht ein Wort in einem kurzen Text fünfmal auf, ist das meist Wiederholung statt Betonung.',
      ],
      list: [
        'Ziel: 90 bis 100 Prozent des Limits; zu kurze Antworten wirken lieblos.',
        'Ein paar Zeichen Puffer lassen, falls das Formular Umbrüche anders zählt.',
        'Text aus PDF oder E-Mail mit „Leerzeichen bereinigen“ säubern.',
        'Reden laut lesen und die Sprechzeit prüfen.',
        'Die Endfassung zusätzlich anderswo speichern – der Entwurf lebt nur in diesem Browser.',
      ],
    },
  ],
  cta: 'Jetzt Text zählen',
};
