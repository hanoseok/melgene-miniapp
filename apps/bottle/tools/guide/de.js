module.exports = {
  metaTitle: 'Flaschendrehen-Anleitung: Regeln, faire Auswahl & Partyideen',
  description: 'So spielst du Flaschendrehen online als familienfreundliches Entscheidungsspiel: Namen eintragen, Aufgabenkarten, warum jeder Platz dieselbe Chance hat, Spielvarianten und Tipps.',
  h1: 'Flaschendrehen online: fair und familienfreundlich entscheiden, wer dran ist',
  updated: '2026-10-19',
  intro: 'Flaschendrehen kennt fast jeder: Alle sitzen im Kreis, jemand dreht in der Mitte eine Flasche, und wer vom Flaschenhals getroffen wird, ist dran. Diese App behält diesen einfachen Moment bei, bringt ihn aber aufs Handy. Du brauchst weder eine echte Flasche noch einen völlig ebenen Tisch. Handy in die Mitte legen, die Namen der Leute drumherum eintragen und die Flasche entscheiden lassen. So klärst du schnell, wer anfängt, wer das nächste Lied aussucht oder wer den Tisch abräumt. Diese Anleitung erklärt, woher das Spiel kommt, wie es hier funktioniert, welche Varianten es für verschiedene Gruppen gibt und warum das Ergebnis wirklich fair ist.',
  sections: [
    {
      h: 'Woher das Drehen zum Auswählen kommt',
      p: [
        'Lange bevor es Apps gab, ließen Menschen sich drehende Gegenstände entscheiden. Im mittelalterlichen Europa gab es den Trendel beziehungsweise Teetotum, einen kleinen Kreisel mit Buchstaben an den Seiten, die nach dem Umfallen anzeigten, was zu tun war. Bis heute drehen Kinder Kreisel, Münzen oder Stifte, um auszumachen, wer anfängt. Zeigespiele sind aus einem einfachen Grund beliebt: Alle sehen zu, wie der Gegenstand langsamer wird, also kann niemand behaupten, es sei geschummelt worden.',
        'Die Variante mit der Flasche wurde im zwanzigsten Jahrhundert zum Partyklassiker, einfach weil eine leere Flasche immer zur Hand ist und sich gut auf dem Tisch dreht. Gruppen haben sie für alles Mögliche genutzt: wer die nächste Geschichte erzählt, wer eine Frage beantwortet, wer das Kartenspiel beginnt. Genau für solches Spielen ist diese App gemacht, als freundliches Entscheidungswerkzeug für Partys, Familienabende, Schulklassen und Spieleabende.',
      ],
    },
    {
      h: 'So spielst du mit der App',
      p: [
        'Es gibt zwei Spielarten. „Einfach drehen“ braucht keine Vorbereitung: Knopf drücken, die Flasche bleibt in einer zufälligen Richtung stehen und alle schauen, wohin der Hals zeigt. „Mit Namen“ eignet sich, wenn das Handy in der Mitte eines echten Tisches liegt. Trage 2 bis 12 Namen ein, einen pro Zeile, in der Reihenfolge, in der ihr sitzt, im Uhrzeigersinn. Die Namen erscheinen wie Sitzplätze gleichmäßig um den Tisch auf dem Bildschirm, und die Flasche bleibt bei einem von ihnen stehen.',
        'Du startest mit dem großen Knopf oder indem du die Flasche antippst. Du kannst sie auch mit dem Finger anschnippen, das fühlt sich fast echt an. Jede Drehung dauert ein paar Sekunden, macht mehrere Umdrehungen und wird dann sanft langsamer. Die gezogene Person wird hervorgehoben, das Ergebnis erscheint unter dem Tisch, und ein Verlauf merkt sich die letzten zehn Drehungen, damit niemand vergisst, wer schon dran war.',
      ],
      list: [
        '„Einfach drehen“ wählen oder „Mit Namen“ und alle in Sitzreihenfolge eintragen.',
        '„Keine Wiederholung“ eingeschaltet lassen, wenn jeder einmal dran sein soll, bevor jemand doppelt kommt.',
        'Auf Wunsch die Aufgabenkarte nach jedem Dreh für eine kleine, freundliche Aufgabe aktivieren.',
        'Handy flach in die Tischmitte legen und die Flasche antippen oder anschnippen.',
        'Ergebnis vorlesen, dann nochmal drehen oder eine neue Runde starten.',
      ],
    },
    {
      h: 'Spielideen für verschiedene Gruppen',
      p: [
        'Auf einer Party oder beim Halloween-Treffen entscheidet die Flasche, wer das nächste Lied aussucht, wer die Kostümparade eröffnet oder wer bei Scharade anfängt. Mit Aufgabenkarten bekommt die gezogene Person eine leichte, nette Aufgabe, etwa eine kurze Imitation oder ein Kompliment für den Sitznachbarn. Die Karten kommen einzeln, so bringt jede Drehung eine kleine Überraschung. Habt ihr eigene Ideen, wählt „Eigene Liste“ und schreibt eine Aufgabe pro Zeile.',
        'Zu Hause verteilt sie Hausarbeit ohne Diskussion: Wen die Flasche trifft, der räumt die Spülmaschine aus oder geht mit dem Hund raus. Lehrkräfte können damit bestimmen, wer vorliest oder welche Gruppe zuerst präsentiert, und mit „Keine Wiederholung“ kommt jedes Kind dran. Beim Spieleabend klärt sie, wer beginnt, im Meeting, wer zuerst berichtet. Die Faustregel: Wenn eine Entscheidung sonst im Streit um Fairness endet, lass die Flasche entscheiden.',
      ],
    },
    {
      h: 'Warum das Ergebnis fair ist',
      p: [
        'Eine echte Flasche auf einem echten Tisch ist nicht ganz fair. Unebenheiten, die Form des Glases und die Art, wie jemand dreht, verschieben die Chancen. Die App umgeht das, indem sie das Ergebnis festlegt, bevor sich irgendetwas bewegt. Beim Drehen bittet sie den kryptografischen Zufallsgenerator deines Browsers, dieselbe Art Zufall wie für Sicherheitsschlüssel, einen Platz auszuwählen. Mit sogenanntem Rejection Sampling entfernt sie die winzige Verzerrung, die einfacher Zufallscode haben kann. Bei acht Namen hat also jede Person genau eine Chance von eins zu acht.',
        'Erst danach beginnt die Animation. Die App berechnet, wie weit sich die Flasche drehen muss, um im Tischabschnitt der gewählten Person zu landen, fügt ein paar volle Umdrehungen und einen kleinen zufälligen Versatz hinzu, damit sie nie exakt an derselben Stelle stoppt, und bremst sanft ab. Wie kräftig du anschnippst, ändert nur die Drehrichtung, nie das Ergebnis. Mit „Keine Wiederholung“ wählt die App nur unter denen, die in dieser Runde noch nicht dran waren, und auch dort völlig gleichmäßig. Deine Namen verlassen dein Gerät nicht.',
      ],
    },
    {
      h: 'Tipps für eine gute Runde',
      p: [
        'Trage die Namen in der Reihenfolge ein, in der ihr wirklich sitzt, damit Bildschirm und Tisch zusammenpassen; dann zeigt der Flaschenhals direkt auf die richtige Person. Leg das Handy flach hin und dreh die Helligkeit hoch, wenn es dunkel ist. Bei großen Gruppen lassen sich kurze Namen oder Spitznamen am Tischrand besser lesen.',
        'Halte Aufgaben nett und freiwillig. Jeder sollte aussetzen dürfen, und die besten Aufgaben bringen den ganzen Tisch zum Lachen, statt eine Person bloßzustellen. Wollt ihr später mit derselben Gruppe weiterspielen, nutzt nach einer Drehung „Link mit diesen Namen kopieren“: Der Link öffnet denselben Tisch, und die Namen stehen im Link, nicht auf einem Server. Vor allem aber: Genießt die Spannung, wenn die Flasche langsamer wird.',
      ],
    },
  ],
  cta: 'Jetzt Flasche drehen',
};
