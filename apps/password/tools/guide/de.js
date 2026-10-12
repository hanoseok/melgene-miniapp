module.exports = {
  metaTitle: 'Passwort-Generator Ratgeber: sichere Passwörter, Passphrasen',
  description: 'So erstellst du starke Passwörter und merkbare Passphrasen, was Entropie und Knackzeit wirklich bedeuten und warum Passwort-Manager und Zwei-Faktor-Authentifizierung so wichtig sind.',
  h1: 'Passwort-Generator: starke Passwörter, Passphrasen und was Entropie bedeutet',
  updated: '2026-10-13',
  intro: 'Die meisten gehackten Konten fallen nicht einem genialen Hacker zum Opfer. Es beginnt mit einem zu kurzen Passwort, einem Passwort, das schon bei einer anderen Seite geleakt wurde, oder einem leicht zu erratenden Muster wie Vorname plus Jahreszahl. Ein Passwort-Generator nimmt dem Menschen genau das ab, was er am schlechtesten kann: zufällig zu sein. Dieser Ratgeber zeigt, wie du den Generator benutzt, was ein Passwort wirklich stark macht, was Passphrasen sind, wie du Entropie und Knackzeit liest, und welche zwei Gewohnheiten noch wichtiger sind als das Passwort selbst.',
  sections: [
    {
      h: 'So benutzt du den Passwort-Generator',
      p: [
        'Alles passiert auf einem Bildschirm und auf deinem eigenen Gerät. Wähle oben Passwort oder Passphrase. Für ein Passwort stellst du die Länge mit dem Schieberegler zwischen 4 und 64 Zeichen ein und schaltest die gewünschten Zeichenarten ein: Großbuchstaben, Kleinbuchstaben, Ziffern und Sonderzeichen. Jede eingeschaltete Art kommt garantiert mindestens einmal vor, damit sind auch Seiten mit strengen Passwortregeln zufrieden. Wenn du das Passwort einmal vorlesen oder vom Bildschirm abtippen musst, schalte „Ähnliche Zeichen weglassen“ ein, dann fehlen 0, O, 1, l und I.',
        'Für eine Passphrase wählst du die Anzahl der Wörter (3 bis 8), das Trennzeichen und ob jedes Wort groß beginnt und eine Zahl dazukommt. Wähle „Nur eins“ oder „Fünf auf einmal“ und tippe auf Erstellen. Jedes Ergebnis hat einen eigenen Kopieren-Knopf, und die Anzeige darunter zeigt die Entropie in Bit, eine Stärkestufe und die geschätzte Zeit zum Knacken.',
      ],
      list: [
        'Passwort oder Passphrase wählen.',
        'Länge oder Wortanzahl einstellen.',
        'Zeichenarten oder Trennzeichen und Optionen wählen.',
        'Auf Erstellen tippen und das passende kopieren.',
        'Direkt im Passwort-Manager speichern.',
      ],
    },
    {
      h: 'Was ein Passwort stark macht',
      p: [
        'Die Stärke hängt davon ab, wie viele Möglichkeiten ein Angreifer durchprobieren müsste, nicht davon, wie kompliziert ein Passwort aussieht. P@ssw0rd! wirkt chaotisch, doch Knackprogramme probieren zuerst gängige Wörter mit den üblichen Ersetzungen und haben es in Sekunden. Eine echt zufällige Zeichenkette ist etwas anderes: Jedes Zeichen wird unabhängig gewählt, und jedes weitere Zeichen vervielfacht die Zahl der Möglichkeiten. Deshalb schlägt Länge jede Raffinesse. Von 12 auf 16 Zufallszeichen zu gehen, macht ein Passwort zig Millionen Mal schwerer zu erraten.',
        'Die andere Hälfte ist Zufall. Menschen nehmen Geburtstage, Haustiernamen, Tastaturfolgen wie qwertz und überall dasselbe Lieblingsmuster, und Angreifer kennen all diese Gewohnheiten. Der Generator nutzt die kryptografische Zufallsquelle deines Browsers, crypto.getRandomValues, und ein Verfahren namens Rejection Sampling, damit jedes erlaubte Zeichen exakt gleich wahrscheinlich ist. Es gibt kein Muster zu lernen und keine Schieflage auszunutzen.',
        'Die dritte Zutat ist Einmaligkeit. Selbst ein perfektes Passwort wird schwach, sobald du es mehrfach verwendest, denn ein Leak bei einer Seite liefert es Angreifern, die es dann überall sonst ausprobieren. Ein Konto, ein Passwort.',
      ],
    },
    {
      h: 'Passphrasen: stark und leichter zu merken',
      p: [
        'Eine Passphrase besteht aus ein paar zufälligen Wörtern hintereinander, wie ein kurzer, unsinniger Satz. Entscheidend ist, dass der Zufall die Wörter wählt und nicht du. Eine Liedzeile oder ein bekanntes Zitat ist überhaupt nicht zufällig. Dieser Generator zieht jedes Wort aus einer eingebauten Liste mit 2.048 kurzen englischen Wörtern, also bringt jedes Wort genau 11 Bit Entropie. Fünf Wörter ergeben 55 Bit, sechs ergeben 66, und eine zufällige Zahl legt noch ein paar Bit drauf.',
        'Passphrasen glänzen bei den wenigen Geheimnissen, die du wirklich tippen oder auswendig wissen musst: das Master-Passwort deines Passwort-Managers, die Anmeldung am Computer oder das Backup deines Handys. Sie sind lang und damit stark, bestehen aber aus echten Wörtern und lassen sich auf einer Handytastatur viel leichter tippen als ein Zeichensalat. Großgeschriebene Wortanfänge erhöhen die Stärke nicht, weil das Muster vorhersehbar ist, helfen aber bei Seiten, die einen Großbuchstaben verlangen.',
      ],
    },
    {
      h: 'Entropie und Knackzeit einfach erklärt',
      p: [
        'Entropie wird in Bit gemessen und gibt an, aus wie vielen gleich wahrscheinlichen Möglichkeiten ein Passwort gezogen wurde. Jedes Bit verdoppelt die Anzahl: 60 Bit sind rund eine Trillion Möglichkeiten, 80 Bit noch einmal eine Million Mal mehr. Die Anzeige berechnet diesen Wert exakt aus deinen Einstellungen. Bei Passwörtern zählt sie alle Zeichenketten der gewählten Länge, die von jeder gewählten Zeichenart mindestens ein Zeichen enthalten; bei Passphrasen multipliziert sie die Wortauswahl mit Position und Wert der zusätzlichen Zahl.',
        'Die Knackzeit geht von einem schnellen Offline-Angriff mit 10 Milliarden Versuchen pro Sekunde aus – ein Tempo, das schon eine einzige moderne Grafikkarte gegen eine schlecht geschützte, geleakte Passwortdatenbank schafft. Im Schnitt findet der Angreifer das Passwort, nachdem er die Hälfte der Möglichkeiten probiert hat. Außerdem wird angenommen, dass er deine Einstellungen genau kennt, die Schätzung schmeichelt dir also nie. Grob gilt: unter 45 Bit schwach, 45 bis 60 mittel, 60 bis 80 stark, ab 80 sehr stark.',
      ],
      list: [
        'Wegwerf- oder unwichtige Konten: 45 bis 60 Bit.',
        'Alltagskonten wie Shopping und soziale Netzwerke: 60 bis 80 Bit.',
        'E-Mail, Onlinebanking, Arbeit und Passwort-Manager: 80 Bit oder mehr.',
      ],
    },
    {
      h: 'Passwort-Manager und Zwei-Faktor-Authentifizierung',
      p: [
        'Niemand kann sich Dutzende verschiedene Zufallspasswörter merken, und niemand sollte es versuchen. Ein Passwort-Manager speichert sie in einem verschlüsselten Tresor, füllt sie auf den richtigen Seiten aus und warnt vor mehrfach genutzten oder geleakten Passwörtern. Erstelle hier ein starkes Passwort, füge es beim Anlegen oder Ändern eines Kontos in den Manager ein, und du musst es nie wieder sehen. Den Manager selbst schützt du mit einer langen Passphrase, die du dir merkst.',
        'Die Zwei-Faktor-Authentifizierung, kurz 2FA, fügt einen zweiten Schritt hinzu, etwa einen Code aus einer Authenticator-App, einen Passkey oder einen Hardware-Sicherheitsschlüssel. Selbst wenn ein Passwort geleakt wird, kommt der Angreifer nicht hinein. Schalte sie zuerst für dein E-Mail-Konto ein, denn darüber lassen sich die meisten anderen Konten zurücksetzen.',
      ],
      list: [
        'Für jedes Konto ein anderes Passwort verwenden.',
        'Passwörter im Passwort-Manager aufbewahren, nicht in Notizen, Chats oder Screenshots.',
        '2FA oder Passkeys überall einschalten, wo es geht – zuerst beim E-Mail-Konto.',
        'Passwort sofort ändern, wenn ein Dienst einen Datenleak meldet.',
        'Passwörter nie per Nachricht oder E-Mail weitergeben und bei unerwarteten Login-Links misstrauisch sein.',
      ],
    },
  ],
  cta: 'Jetzt ein starkes Passwort erstellen',
};
