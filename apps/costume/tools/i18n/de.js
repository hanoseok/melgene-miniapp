/* Halloween-Kostüm-Test — Deutsch (de/)
 * Dieselben 8 Kostüm-IDs und dieselbe Reihenfolge der Fragen/Antworten wie costume-core.js (Gewichte nur dort).
 * Schlüssel mit Html: rohes HTML (nur <br> und <em>). Der Text in privacy.sections ist ebenfalls HTML.
 * Keine Spoiler: meta / og.default* / start / faq / loading nennen kein Kostüm und zitieren keine Frage.
 * types.<id>.word = einfache Kostüm-Wörter (kommagetrennt) — nur für die Spoiler-Prüfung.
 * Platzhalter: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Halloween-Kostüm-Test – Als was soll ich mich verkleiden?',
    description: 'Als was verkleide ich mich an Halloween? Der kostenlose Halloween-Kostüm-Test: 12 Partymomente, ca. 2 Minuten, ohne Anmeldung – mit DIY-Tipps.',
    ogTitle: 'Halloween-Kostüm-Test 🎃 Als was gehst du dieses Jahr?',
    ogDescription: 'Ein kostenloser 2-Minuten-Test. Beantworte 12 Halloween-Partymomente und finde das Kostüm, das zu deiner Persönlichkeit passt.',
  },
  siteName: 'Halloween-Kostüm-Test',
  privacyLink: 'Datenschutzerklärung',

  start: {
    badge: '🎃 Gruselige Umkleide',
    h1Kicker: 'Halloween-Kostüm-Test',
    h1Html: 'Als was gehe ich<br>an <em>Halloween</em>?',
    hook: 'Die Verkleidungskiste ist noch leer? Zwölf kleine Partymomente finden den Look, der wirklich zu dir passt.',
    metaTime: '⏱️ ca. 2 Minuten',
    metaCount: '🦇 12 Fragen',
    start: 'Mein Kostüm finden →',
  },

  quiz: {
    backAria: 'Vorherige Frage',
    progressAria: 'Fortschritt',
    qLabel: 'F{n}',
  },

  loading: {
    text: 'Wir durchwühlen den Kostümschrank…',
    sub: 'Ein paar Looks werden für dich anprobiert',
  },

  result: {
    title: 'Halloween-Kostüm-Test: Ich gehe als {name}',
    eyebrow: 'Zu Halloween gehst du als',
    strengthsLabel: 'Deine Party-Superkräfte',
    tipsLabel: 'So klappt’s',
    bestLabel: 'Bester Buddy',
    rivalLabel: 'Netter Rivale',
    sameShare: '{pct} % der Spieler haben dieses Kostüm',
    shareText: 'Mein Halloween-Kostüm: {name} {emoji} – „{vibe}“ Als was gehst du?',
    ctaStrong: 'Jemand hat sein Halloween-Kostüm mit dir geteilt',
    ctaSub: 'Als was gehst du? Dauert nur 2 Minuten.',
    retry: 'Test nochmal machen',
  },

  og: {
    eyebrow: 'Mein Halloween-Kostüm',
    brand: '🎃 Halloween-Kostüm-Test',
    defaultKicker: 'Halloween-Kostüm-Test',
    defaultTitle: 'Als was gehst du an Halloween?',
    defaultDesc: '12 Partymomente · ca. 2 Minuten',
  },

  faq: [
    { q: 'Wie ermittelt der Test mein Kostüm?', a: 'Jede Antwort gibt ein paar Kostümen Punkte, und das mit den meisten Punkten gewinnt. Bei Gleichstand entscheidet eine feste Regel – gleiche Antworten ergeben also immer dasselbe Kostüm.' },
    { q: 'Kann ich das Kostüm wirklich selbst machen?', a: 'Ja. Zu jedem Ergebnis gibt es einfache Tipps mit Sachen, die die meisten schon zu Hause haben, plus ein paar günstige Extras aus dem Drogeriemarkt oder Sonderpostenladen. Nähen musst du nicht.' },
    { q: 'Was, wenn mir mein Ergebnis nicht gefällt?', a: 'Mach den Test einfach nochmal! Dein Ergebnis hängt nur von deinen heutigen Antworten ab, und eine andere Partylaune bringt vielleicht einen anderen Look hervor. Oder tu dich mit deinem besten Buddy für ein Gruppenkostüm zusammen.' },
    { q: 'Werden meine Antworten gespeichert?', a: 'Nein. Deine Antworten werden in deinem Browser ausgewertet und nie gespeichert. Wir zählen nur anonym, welches Kostüm herauskam, um zu zeigen, wie häufig jedes Ergebnis ist.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Halloween-Kostüm-Test',
    description: 'Datenschutzerklärung des Halloween-Kostüm-Tests – Cookies, Werbung und anonyme Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Der Halloween-Kostüm-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die nötigsten Informationen, wie unten beschrieben.',
    sections: [
      ['1. Welche Daten wir erheben', 'Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen. Deine Antworten werden in deinem Browser ausgewertet und nie an unsere Server gesendet oder dort gespeichert. Wir zählen nur anonym, welches Kostüm herauskam, um zu zeigen, wie häufig jedes Ergebnis ist.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in deinen Browsereinstellungen ablehnen oder löschen; manche Funktionen arbeiten dann eventuell nicht richtig.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites zu schalten. Mehr dazu und Einstellungen in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Wir speichern anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Sie lassen keine Rückschlüsse auf deine Person zu.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 2. Oktober 2026.'],
    ],
    back: '← Zurück zum Kostüm-Test',
  },

  questions: [
    { q: 'Gerade kam eine Einladung zur Halloween-Party. Dein erster Gedanke?', choices: [
      'Endlich. Ich plane meinen Look schon seit Wochen.',
      'Wer feiert? Ich bringe Snacks und eine Playlist mit.',
      'Muss ich mich verkleiden… oder darf ich in Jogginghose kommen?',
      'Ich bastle mein Kostüm selbst. Gekauft ist langweilig.',
    ] },
    { q: 'Im Kostümladen gehst du direkt zu…', choices: [
      'Dem Ständer mit Samtumhängen und Glitzer',
      'Der Grabbelkiste. Alles geht!',
      'Ohren, Schwänzen und kleinen Accessoires',
      'Der Bastelecke: Mullbinden, Schminke, Klebeband',
    ] },
    { q: 'Du kommst auf die Party. Dein erster Move?', choices: [
      'Die Tanzfläche suchen',
      'Allen Hallo sagen und Leute miteinander bekannt machen',
      'Eine ruhige Ecke suchen und Leute beobachten',
      'Direkt zum Snacktisch',
    ] },
    { q: 'Ding-dong! „Süßes oder Saures!“ an der Tür. Du…', choices: [
      'Tanzt an der Tür, während du Süßigkeiten verteilst',
      'Versteckst dich hinter der Tür und springst raus. Buh!',
      'Gibst jedem Kind ein selbst gepacktes Tütchen',
      'Willst zuerst Saures sehen. Fair ist fair.',
    ] },
    { q: 'Der DJ spielt einen Song, den du liebst. Du…', choices: [
      'Tanzt sofort, als würde niemand zuschauen',
      'Gleitest langsam mit dramatischen Moves auf die Fläche',
      'Wippst auf dem Sofa mit, Snack in der Hand',
      'Ziehst deinen schüchternen Freund auf die Tanzfläche',
    ] },
    { q: 'Zeit fürs Gruppenfoto! Wo bist du?', choices: [
      'Vorne in der Mitte, beste Seite bereit',
      'Lugst ganz vom Rand ins Bild',
      'Hinten, mit einer albernen Grimasse',
      'Richtest erst allen Haare und Outfits',
    ] },
    { q: 'Jemand sagt: „Lasst uns Gruselgeschichten erzählen.“ Du…', choices: [
      'Hast schon eine richtig schaurige parat',
      'Klammerst dich an den Arm neben dir und hörst mit einem Auge zu',
      'Machst mittendrin eine Comedy daraus',
      'Verdrückst dich leise in die Küche',
    ] },
    { q: 'Der Snacktisch ruft. Du nimmst…', choices: [
      'Von allem ein bisschen. Dann Nachschlag.',
      'Das eine seltsame Gericht, an das sich keiner rantraut',
      'Nur das hübscheste Dessert auf dem Tisch',
      'Erst Teller für deine Freunde, dann für dich',
    ] },
    { q: 'Um Mitternacht geht plötzlich das Licht aus. Du…', choices: [
      'Machst die Handy-Taschenlampe an und beruhigst alle',
      'Machst ein gruseliges Geräusch, um die anderen zu ärgern',
      'Bleibst ganz still. Du siehst im Dunkeln bestens.',
      'Isst weiter. Dunkelheit ändert gar nichts.',
    ] },
    { q: 'Kostümwettbewerb! Welchen Preis würdest du gewinnen?', choices: [
      'Am elegantesten',
      'Am kreativsten',
      'Publikumsliebling',
      'Am niedlichsten',
    ] },
    { q: 'Ihr geht in ein Geisterhaus. Du bist die Person, die…', choices: [
      'Die Gruppe anführt und alle anfeuert',
      'Ganz entspannt durchschlendert, völlig unbeeindruckt',
      'Am lautesten schreit und am meisten lacht',
      'Die Requisiten studiert: „Wie haben die das gemacht?“',
    ] },
    { q: 'Am Morgen nach der Party bist du…', choices: [
      'Noch im Bett. Weckt mich bei Sonnenuntergang.',
      'Am Aufräumen und gibst allen ihre vergessenen Sachen zurück',
      'Schon am Planen der Party nächstes Jahr',
      'Mit dem Sofa verschmolzen, total platt',
    ] },
  ],

  types: {
    vampire: {
      name: 'Samt-Vampir',
      word: 'vampir',
      vibe: 'Mühelos elegant, ein bisschen dramatisch und der Star jeder Nacht.',
      desc: 'Du bist für die Nachtschicht geboren. Du liebst einen großen Auftritt, kennst deine beste Seite und machst aus einem gewöhnlichen Abend eine Filmszene. Menschen fühlen sich von deinem ruhigen Selbstbewusstsein und dem Hauch von Geheimnis angezogen. Du nimmst Stil ernst, kümmerst dich aber auch um deine Leute – und wenn du einmal loyal bist, dann für immer.',
      strengths: ['Magnetischer Charme', 'Makelloser Stil', 'Herrscher der Nacht'],
      tips: ['Schwarzes Outfit plus Umhang (ein dunkles Bettlaken reicht) – sofort „Graf vom Schloss“.', 'Haare nach hinten gelen und einen Tupfer Rot in den Mundwinkel.', 'Plastikzähne und eine langsame, dramatische Verbeugung bei deiner Ankunft.'],
    },
    witch: {
      name: 'Mondschein-Hexe',
      word: 'hexe',
      vibe: 'Clever, kreativ und braut immer einen genialen Plan.',
      desc: 'Dein Kopf ist ein Kessel voller Ideen. Du machst lieber etwas Eigenes, als zu kopieren, was alle machen, und hast meistens einen Plan B, C und D. Du bist unabhängig, ein bisschen frech und hast einen scharfen Witz, der jedes Gespräch spannend macht. Freunde kommen zu dir, wenn sie eine schlaue Lösung brauchen – oder einen guten Rat mit Zauberkraft.',
      strengths: ['Geniale Ideen', 'Unabhängiger Geist', 'Scharfer Witz'],
      tips: ['Ein spitzer Hut und ein langes dunkles Kleid oder ein Mantel reichen für den Anfang.', 'Ein Besen oder ein Becher mit der Aufschrift „Zaubertrank“ als Markenzeichen.', 'Dazu Sternsticker, lila Lippenstift oder eine schwarze Plüschkatze auf der Schulter.'],
    },
    ghost: {
      name: 'Bettlaken-Gespenst',
      word: 'gespenst',
      vibe: 'Schüchtern-süß, gemütlich und heimlich die lustigste Person im Raum.',
      desc: 'Du brauchst kein Rampenlicht, um eine tolle Zeit zu haben. Du magst bequeme Klamotten, ein paar enge Freunde und die Party von einem gemütlichen Platz aus zu beobachten. Manche unterschätzen dich anfangs, aber deine stillen Beobachtungen und heimlichen Witze erwischen alle kalt. Du bist sanft, lieb und genau die Art Freund, bei der man sich sicher fühlt.',
      strengths: ['Sanfte Güte', 'Heimlicher Humor', 'Scharfer Beobachter'],
      tips: ['Ein weißes Bettlaken mit zwei Augenlöchern. Klassisch, bequem und in fünf Minuten fertig.', 'Eine Sonnenbrille oder ein Mini-Hut machen es unverwechselbar deins.', 'Ein kleines Schild mit „Buh“ sorgt für die süßesten Fotos.'],
    },
    zombie: {
      name: 'Party-Zombie',
      word: 'zombie',
      vibe: 'Locker, immer hungrig und nicht mehr zu stoppen, wenn du einmal loslegst.',
      desc: 'Du lässt dich treiben und dich kaum von etwas stressen. Gib dir gute Snacks, bequeme Schuhe und deine Lieblingsmenschen, und du bist glücklich. Morgens kommst du vielleicht langsam in die Gänge, aber wenn du einmal dabei bist, dann voll – und nichts kann dich aufhalten. Freunde lieben deine entspannte Art und wie treu du zu deiner Crew stehst.',
      strengths: ['Tiefenentspannt', 'Unaufhaltsame Ausdauer', 'Treu zur Crew'],
      tips: ['Alte Klamotten nehmen, ein paar Löcher reißen und Kaffeesatz als „Dreck“ einreiben.', 'Graue Gesichtsfarbe und dunkler Lidschatten um die Augen – fertig.', 'Langsam mit ausgestreckten Armen gehen und nach Snacks stöhnen.'],
    },
    blackcat: {
      name: 'Schwarze Mitternachts-Katze',
      word: 'katze',
      vibe: 'Cool, neugierig und geheimnisvoll – Zuneigung nur für wenige Auserwählte.',
      desc: 'Du machst alles auf deine Art und in deinem Tempo. Du bist neugierig auf alles, zeigst Interesse aber nur, wenn du es wirklich spürst. Andere finden dich ein bisschen geheimnisvoll, und genau so magst du es. Hinter der coolen Fassade bist du verspielt und lieb zu denen, die dein Vertrauen verdienen – und du landest immer auf den Füßen.',
      strengths: ['Mühelos cool', 'Endlose Neugier', 'Landet immer auf den Füßen'],
      tips: ['Komplett schwarzes Outfit mit Katzenohren-Haarreif – sofort erkennbar.', 'Mit Eyeliner eine kleine Nase und Schnurrhaare malen.', 'Einen Schwanz aus einer schwarzen Socke oder Strumpfhose hinten feststecken.'],
    },
    mummy: {
      name: 'Kuschel-Mumie',
      word: 'mumie',
      vibe: 'Geduldig, fürsorglich und die Person, die alle zusammenhält.',
      desc: 'Du bist diejenige Person, die still darauf achtet, dass es allen gut geht. Du merkst dir die kleinen Dinge, reparierst, was kaputt ist, und hast immer ein Pflaster parat – wörtlich oder seelisch. Du bist geduldig und beständig, mit dem Charme einer alten Seele und einer Liebe zu klassischen, zeitlosen Dingen. In deiner Nähe werden alle ruhiger.',
      strengths: ['Endlose Geduld', 'Großes, fürsorgliches Herz', 'Felsenfest zuverlässig'],
      tips: ['Weiße Mullbinden oder Streifen aus einem alten Laken über ein weißes Outfit wickeln.', 'Ein Auge frei lassen und ein paar Enden lose baumeln lassen.', 'Die Binden mit Tee oder Kaffee betupfen – das wirkt uralt.'],
    },
    pumpkin: {
      name: 'Kürbis-König',
      word: 'kürbis',
      vibe: 'Warmherzig, strahlend und das Herz der Party – König oder Königin von Halloween.',
      desc: 'Du bringst jeden Raum zum Leuchten wie eine Laterne. Du bringst gern Menschen zusammen, merkst dir alle Namen und sorgst dafür, dass sich niemand ausgeschlossen fühlt. Partys sind lebendiger, wenn du da bist, und oft bist du es, der sie organisiert. Deine Wärme steckt an – wer Zeit mit dir verbringt, geht ein bisschen heller nach Hause.',
      strengths: ['Geborener Gastgeber', 'Ansteckende Wärme', 'Bringt alle zusammen'],
      tips: ['Ein orangefarbenes Shirt oder Hoodie mit einem Kürbisgesicht aus schwarzem Filz.', 'Dazu ein Haarreif mit grünen Blättern oder eine kleine Krone.', 'Einen Süßigkeiteneimer tragen und an alle Leckereien verteilen.'],
    },
    skeleton: {
      name: 'Tanzendes Skelett',
      word: 'skelett',
      vibe: 'Albern, ehrlich und immer als Erstes auf der Tanzfläche.',
      desc: 'Du bist hier, um Spaß zu haben, und das sieht man. Du bringst Leute zum Lachen, ohne es zu versuchen, und deine Energie zieht alle auf die Tanzfläche. Du bist erfrischend ehrlich – bei dir bekommt man, was man sieht, bis auf die Knochen. Mit dir fühlt sich das Leben leichter an, weil du dich nie zu ernst nimmst.',
      strengths: ['Sofortiger Stimmungsmacher', 'Ehrlich bis auf die Knochen', 'Furchtloser Tänzer'],
      tips: ['Schwarze Klamotten plus weißes Klebeband oder Textilfarbe für die Knochen.', 'Ein Totenkopfgesicht schminken: weiße Grundierung, schwarze Augenringe und aufgemalte Zähne.', 'Einen albernen Tanzschritt üben – Klappern ist Pflicht.'],
    },
  },
};
