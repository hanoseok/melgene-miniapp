module.exports = {
  metaTitle: 'QR-Code Ratgeber: erstellen, drucken und sicher scannen',
  description: 'Wie QR-Codes funktionieren, wie du einen für Link oder WLAN erstellst, Drucktipps zu Größe, Kontrast und Fehlerkorrektur, die Geschichte des QR-Codes und sicheres Scannen.',
  h1: 'So erstellst du einen QR-Code, der immer funktioniert',
  updated: '2026-10-11',
  intro: 'QR-Codes sind überall: auf Restauranttischen, Konzerttickets, Paketen und Plakaten. Sie sehen aus wie zufälliges Rauschen, aber jedes Kästchen hat eine Aufgabe. Dieser Ratgeber erklärt, was ein QR-Code wirklich speichert, wie du einen für einen Link, eine Nachricht oder dein WLAN erstellst, wie du ihn so druckst, dass er beim ersten Versuch funktioniert, woher die Idee stammt und wie du sicher bleibst, wenn du fremde Codes scannst.',
  sections: [
    {
      h: 'Was ist ein QR-Code?',
      p: [
        'QR steht für Quick Response, also schnelle Antwort. Ein QR-Code ist ein zweidimensionaler Barcode: Statt einer Reihe von Strichen speichert er Informationen in einem quadratischen Raster aus dunklen und hellen Feldern, den Modulen. Die drei großen Quadrate in den Ecken sind Positionsmarken. Sie verraten der Kamera, wo der Code liegt, wie er gedreht ist und wie groß er ist – deshalb lässt er sich auch kopfüber oder schräg scannen.',
        'Der Rest des Rasters enthält deine Daten und zusätzliche Fehlerkorrekturdaten, berechnet mit Reed-Solomon-Codes – derselben Mathematik, die auf CDs und in Raumsonden steckt. Dank dieser Redundanz kann ein Lesegerät den Inhalt rekonstruieren, auch wenn ein Teil des Codes verschmutzt, eingerissen oder verdeckt ist. Die kleinste Version 1 misst 21 × 21 Module, die größte Version 40 ganze 177 × 177 und fasst fast dreitausend Byte. Längere Inhalte brauchen einfach ein größeres, dichteres Raster.'
      ]
    },
    {
      h: 'So erstellst du hier einen QR-Code',
      p: [
        'Der Generator läuft komplett in deinem Browser. Der Code wird in dem Moment, in dem du tippst, auf deinem eigenen Gerät berechnet. Nichts wird hochgeladen, protokolliert oder gespeichert, und ein Konto brauchst du auch nicht.'
      ],
      list: [
        'Wähle, was in den Code soll: Link, Text, WLAN-Zugang, E-Mail oder Telefonnummer.',
        'Fülle die Felder aus. Tippst du eine Webadresse ohne https://, wird es automatisch ergänzt, damit Handys sie als Link öffnen.',
        'Sieh dir die Live-Vorschau an. In den Optionen änderst du Farben, Fehlerkorrektur, Bildgröße und Ruhezone.',
        'Lade ein PNG für Bildschirm und Dokumente oder ein SVG für den Druck. In unterstützten Browsern kannst du das Bild auch direkt in die Zwischenablage kopieren.',
        'Scanne das Ergebnis mit deinem eigenen Handy, bevor du es teilst oder druckst.'
      ]
    },
    {
      h: 'WLAN-QR-Codes für Gäste',
      p: [
        'Mit einem WLAN-QR-Code müssen Gäste nicht mehr den langen Schlüssel von der Rückseite des Routers abtippen. Er speichert Netzwerkname, Passwort und Verschlüsselung in einem Standard-Textformat, das mit WIFI: beginnt. Die eingebauten Kamera-Apps von iPhone und Android erkennen das Format und bieten an, sich mit einem Tipp zu verbinden.',
        'Wähle dieselbe Verschlüsselung wie dein Router. Fast alle aktuellen Router nutzen WPA2 oder WPA3, beides fällt unter WPA. „Ohne Passwort“ nur bei offenen Netzen wählen, und „Verstecktes Netzwerk“ ankreuzen, wenn dein Router seinen Namen nicht sendet. Sonderzeichen wie Semikolon, Komma, Doppelpunkt und Anführungszeichen werden automatisch maskiert. Änderst du später dein WLAN-Passwort, brauchst du einen neuen Code, denn der alte funktioniert dann nicht mehr.'
      ]
    },
    {
      h: 'Drucktipps: Größe, Kontrast und Fehlerkorrektur',
      p: [
        'Die meisten Scanprobleme entstehen beim Druck, nicht im Code selbst. Ein paar einfache Regeln bewirken viel.'
      ],
      list: [
        'Größe: Als Faustregel sollte der Code mindestens ein Zehntel des Scanabstands breit sein. Ein Code, der aus 30 cm gescannt wird, braucht etwa 3 cm, ein Plakat für 3 m Abstand rund 30 cm.',
        'Kontrast: dunkler Code auf hellem Grund. Schwarz auf Weiß ist am sichersten. Blasse Farben, Verläufe und helle Codes auf dunklem Grund verwirren viele Scanner – deshalb warnt der Generator bei geringem Kontrast.',
        'Ruhezone: Lass einen leeren Rand um den Code. Der Standard verlangt vier Module, und Text oder Bilder direkt am Rand sind eine häufige Ursache für Fehlscans.',
        'Fehlerkorrektur: Stufe L stellt etwa 7 Prozent Schaden wieder her, M etwa 15, Q etwa 25 und H etwa 30. M für den Alltag, Q oder H für Aufkleber, Außenschilder oder ein kleines Logo darauf, L wenn ein langer Text in einen kleinen Code auf dem Bildschirm passen muss.',
        'Länge des Inhalts: Bei gleicher Druckgröße bedeutet kürzerer Inhalt größere Module. Ein kurzer Link ist besser als eine ellenlange Adresse.'
      ]
    },
    {
      h: 'Eine kurze Geschichte des QR-Codes',
      p: [
        'Der QR-Code wurde 1994 von Masahiro Hara und seinem Team bei Denso Wave erfunden, damals eine Abteilung des japanischen Autozulieferers Denso aus dem Toyota-Konzern. In den Autofabriken wurden Teile mit gewöhnlichen Barcodes verfolgt, und die Arbeiter mussten pro Kiste mehrere Etiketten scannen, weil ein Barcode nur rund zwanzig Zeichen fasste. Hara wollte einen Code, der viel mehr Daten speichert und sich aus jeder Richtung blitzschnell lesen lässt.',
        'Die Positionsquadrate haben ein Hell-Dunkel-Verhältnis, das in gedrucktem Text oder Bildern kaum vorkommt, sodass ein Scanner sie sofort findet. Denso Wave hielt das Patent, verzichtete aber darauf, es durchzusetzen, und das Format wurde im Jahr 2000 zur internationalen ISO-Norm. Als Smartphone-Kameras QR-Codes direkt lesen konnten, eroberten sie Bezahlung, Bordkarten, Speisekarten und vieles mehr. Der Name QR Code ist bis heute eine eingetragene Marke von Denso Wave.'
      ]
    },
    {
      h: 'Sicher scannen',
      p: [
        'Ein QR-Code ist nur ein Behälter, und jeder kann einen drucken. Betrüger kleben manchmal gefälschte Codes über echte, etwa an Parkautomaten, Plakaten oder Restauranttischen, um Menschen auf täuschend echte Bezahl- oder Login-Seiten zu locken. Lies vor dem Öffnen die Adresse, die die Kamera anzeigt, und prüfe, ob sie zum erwarteten Anbieter gehört. Sei vorsichtig bei Codes, die Kartendaten, Passwörter oder App-Downloads verlangen, und scanne niemals Codes aus unerwarteten Nachrichten, die dich zur Eile drängen.',
        'Für deine eigenen Codes gilt dasselbe umgekehrt: Nutze Links, die du kontrollierst, teste den Code vor dem Druck und schau bei öffentlich ausgehängten Codes ab und zu nach, ob ihn niemand überklebt hat.'
      ]
    }
  ],
  cta: 'Jetzt QR-Code erstellen'
};
