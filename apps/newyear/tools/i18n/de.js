/* Neujahrsorakel (de) — gleiche Struktur wie en.js. Das Jahr kommt aus newyear-core.js (YEAR), nie von Hand eintragen.
 * Die Reihenfolge von questions[i].choices[j] folgt en.js (sie bestimmt die Wertung). Keine Ziffern und kein % in den Ergebnistexten, keine Spoiler.
 * Nur zum Spaß.
 */
const Y = require('../../newyear-core.js').YEAR;

module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap",
    "display": "'Lora'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": `Neujahrsorakel ${Y} – dein Motto fürs neue Jahr`,
    "description": `Mach das Neujahrsorakel ${Y}: 11 kurze Fragen, etwa 2 Minuten, ohne Anmeldung. Entdecke dein Motto fürs Jahr, deine Glücksfarbe, deinen Glücksmonat und deinen Glücksbringer. Nur zum Spaß.`,
    "ogTitle": `Neujahrsorakel ${Y} 🌅 Was wird dein Motto fürs neue Jahr?`,
    "ogDescription": `Elf leichte Fragen dazu, wie du ${Y} verbringen möchtest. Entdecke dein Motto, deine Glücksfarbe, deinen Glücksmonat und deinen Glücksbringer.`
  },
  "siteName": `Neujahrsorakel ${Y}`,
  "privacyLink": "Datenschutz",
  "start": {
    "badge": `🌅 Hallo, ${Y}!`,
    "h1Kicker": `Neujahrsorakel ${Y}`,
    "h1Html": `Worum wird sich dein<br>Jahr <em>${Y}</em> drehen?`,
    "hook": "Ein frischer Kalender, der erste Sonnenaufgang und ein ganzes Jahr voller leerer Seiten. Beantworte elf leichte Fragen dazu, wie du gerne lebst, und entdecke das Motto, die Glücksbringer und die kleinen Vorhersagen, die im neuen Jahr auf dich warten. Ganz ohne Bleigießen.",
    "metaTime": "⏱️ 2 Min.",
    "metaCount": "✨ 11 Fragen",
    "start": "Mein Jahr zeigen →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "Frage {n}"
  },
  "loading": {
    "text": "Wir warten auf den ersten Sonnenaufgang…",
    "sub": "Dein Neujahrsorakel wird geschrieben"
  },
  "result": {
    "title": `Mein Motto für ${Y}: {name}`,
    "metaDesc": `Ergebnis im Neujahrsorakel ${Y}: {name}. {vibe} Entdecke deine Glücksfarbe, deinen Glücksmonat, deinen Glücksbringer und eine kleine Vorhersage fürs Jahr.`,
    "eyebrow": `Dein Motto für ${Y}`,
    "colorLabel": "Glücksfarbe",
    "monthLabel": "Glücksmonat",
    "itemLabel": "Glücksbringer",
    "gaugeLabel": "Wohin deine Antworten tendieren",
    "axes": [
      ["Neues", "Beständigkeit"],
      ["Gemeinsam", "Zeit für mich"],
      ["Planen", "Treiben lassen"]
    ],
    "fortuneLabel": "Dein Jahr auf einen Blick",
    "areas": {
      "work": "Job & Studium",
      "money": "Geldlaune",
      "love": "Liebe & Freunde",
      "self": "Selbstfürsorge"
    },
    "tipLabel": "Ein kleiner Vorsatz zum Ausprobieren",
    "buddyLabel": "Passt perfekt",
    "rivalLabel": "Liebes Gegenteil",
    "disclaimer": "Nur zum Spaß. Dein Motto, deine Glücksbringer und Vorhersagen sind verspielte Ideen fürs neue Jahr, keine Prophezeiungen und keine Gesundheits-, Geld- oder Lebensberatung.",
    "sameShare": "{pct} % der Leute haben dieses Motto",
    "shareText": `Mein Motto für ${Y} ist {name} {emoji} „{vibe}“ Und deins?`,
    "ctaStrong": "Jemand hat sein Neujahrsorakel mit dir geteilt",
    "ctaSub": `Worum wird sich dein Jahr ${Y} drehen? Finde es in 2 Minuten heraus.`,
    "retry": "Nochmal spielen"
  },
  "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  "og": {
    "eyebrow": `Mein Motto für ${Y}`,
    "brand": `🌅 Neujahrsorakel ${Y}`,
    "defaultKicker": "Ein leichtes Neujahrsquiz",
    "defaultTitle": `Worum wird sich dein Jahr ${Y} drehen?`,
    "defaultDesc": "11 Fragen · 2 Minuten · Glücksbringer"
  },
  "faq": [
    {
      "q": "Wie wird mein Motto bestimmt?",
      "a": "Jede Antwort verschiebt drei Skalen ein kleines Stück: Neues ausprobieren oder einen ruhigen Rhythmus halten, Zeit mit anderen oder Zeit für dich, vorausplanen oder dich treiben lassen. Dein Motto liegt dort, wo sich diese drei Skalen treffen, und gleiche Antworten ergeben immer dasselbe Ergebnis."
    },
    {
      "q": "Ist das eine echte Vorhersage für mein Jahr?",
      "a": "Nein. Motto, Glücksfarbe, Glücksmonat, Glücksbringer und die kleinen Vorhersagen sind verspielte Ideen, keine Prophezeiungen. Niemand kann wissen, wie ein Jahr verläuft. Nimm dein Ergebnis wie ein Silvesterorakel: als lustigen Anstoß, über deine guten Vorsätze nachzudenken."
    },
    {
      "q": "Kann ich es nochmal machen und etwas anderes bekommen?",
      "a": "Ja. Wenn du anders antwortest, kannst du bei einem anderen Motto landen. Viele machen das Orakel später im Jahr noch einmal, wenn sich Stimmung oder Pläne verändert haben."
    },
    {
      "q": "Werden meine Antworten gespeichert?",
      "a": "Nein. Deine Antworten werden in deinem Browser berechnet und nicht gespeichert. Wir zählen nur anonym, welches Motto herauskam, damit wir zeigen können, wie häufig es ist."
    }
  ],
  "privacy": {
    "title": `Datenschutzerklärung | Neujahrsorakel ${Y}`,
    "description": `Datenschutzerklärung des Neujahrsorakels ${Y}: wie wir Cookies, Werbung und anonyme Statistiken einsetzen.`,
    "h1": "Datenschutzerklärung",
    "introHtml": "Das Neujahrsorakel (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie unten beschrieben.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen. Deine Antworten werden in deinem Browser berechnet und nie an unsere Server gesendet oder dort gespeichert. Wir zählen nur anonym, welches Ergebnis herauskam, um zu zeigen, wie häufig jedes Ergebnis ist."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers verwenden, um deine Sprache zu speichern, Werbung anzuzeigen und zu verstehen, wie der Dienst genutzt wird. Du kannst sie in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht richtig."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und zur Personalisierung von Anzeigen findest du in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistiken",
        "Wir speichern anonyme Tageswerte (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Diese Werte lassen keinen Rückschluss auf deine Person zu."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Datenschutzerklärung gilt ab dem 29. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Neujahrsorakel"
  },
  "questions": [
    {
      "q": "Silvester, zehn vor zwölf. Wo bist du?",
      "choices": [
        "Auf dem Sofa mit deinen Lieblingsmenschen, Knabberzeug auf dem Tisch, ganz ohne Plan",
        "Auf der Countdown-Party, die du seit Wochen für deine Freunde organisierst",
        "Allein zu Hause, wo du deine Ziele fürs nächste Jahr in ein neues Notizbuch schreibst",
        "Irgendwo Neues auf einem spontanen Solotrip, wo du Fremden beim Anstoßen zusiehst"
      ]
    },
    {
      "q": "Ein nagelneuer Kalender fürs Jahr landet auf deinem Tisch. Was kommt auf die erste Seite?",
      "choices": [
        "Eine Wunschliste mit Dingen, die du mit Freunden ausprobieren willst. Termine später",
        "Noch nichts. Du schreibst rein, wenn dir danach ist",
        "Als Erstes alle Geburtstage und Familientreffen",
        "Ein großes persönliches Ziel, Monat für Monat aufgeteilt"
      ]
    },
    {
      "q": "Der erste Sonnenaufgang des Jahres. Wie begrüßt du ihn?",
      "choices": [
        "Wecker gestellt, warmes Getränk in der Hand, ganz in Ruhe am Fenster",
        "In einem frühen Zug, spontan genommen, zu einem Ort, an dem du nie warst",
        "Du führst eine Gruppenwanderung auf einen Hügel an, Route und Proviant geplant",
        "Noch wach mit Freunden nach der Party, und du erwischst ihn zufällig"
      ]
    },
    {
      "q": "Dein guter Vorsatz fürs Jahr wäre am ehesten…",
      "choices": [
        "Eine neue Fähigkeit lernen, mit Zeitplan und Fortschrittsliste",
        "Die Menschen, die du magst, regelmäßig anrufen oder besuchen",
        "Öfter Ja zu Einladungen sagen und schauen, wohin das führt",
        "Keine großen Vorsätze. Einfach ein bisschen netter zu dir selbst sein"
      ]
    },
    {
      "q": "In der Arbeit oder an der Uni kommt ein neues Projekt. Du…",
      "choices": [
        "Schnappst dir den Teil, den noch niemand probiert hat, und findest es unterwegs heraus",
        "Gehst in ein Team, das du magst, und hilfst, wo du gebraucht wirst",
        "Nimmst den Teil, den du gut kannst, und erledigst ihn sorgfältig für dich",
        "Bietest an, es zu leiten, und machst gemeinsam mit allen einen Plan"
      ]
    },
    {
      "q": "Unerwartet bekommst du ein bisschen Geld, etwa ein Geschenk oder einen kleinen Bonus.",
      "choices": [
        "Es fließt in ein geplantes Treffen oder in Geschenke für die Familie",
        "Du lädst deine Freunde spontan zu etwas Schönem ein",
        "Du legst es weg und vergisst es, bis du es brauchst",
        "Du gibst es für einen Kurs oder Ausrüstung für etwas Neues aus, das du schon länger planst"
      ]
    },
    {
      "q": "Ein freies Wochenende, nichts im Kalender. Was passiert?",
      "choices": [
        "Du planst einen Tagesausflug mit der Gruppe an einen Ort, den keiner kennt",
        "Du räumst auf, bereitest die Woche vor und genießt die Ruhe",
        "Du streifst allein durch ein Viertel, das du noch nie erkundet hast",
        "Du schreibst deinen Freunden „Kommt ihr vorbei?“ und lässt den Tag einfach kommen"
      ]
    },
    {
      "q": "Bei einer Neujahrsfeier setzt sich jemand neben dich, den du nicht kennst.",
      "choices": [
        "Lächeln, locker bleiben und in Ruhe das Essen genießen",
        "Nach dem Job fragen. Vielleicht kannst du etwas für deine eigenen Ziele lernen",
        "Die Person allen vorstellen und ein Spiel starten",
        "Dafür sorgen, dass sie sich willkommen fühlt, und sie zum nächsten Treffen einladen"
      ]
    },
    {
      "q": "Nach einer stressigen Phase bist du etwas ausgelaugt. Wie lädst du deine Akkus auf?",
      "choices": [
        "Eine enge Freundin oder einen engen Freund anrufen und stundenlang über alles und nichts quatschen",
        "Aus einer Laune heraus etwas völlig Neues ausprobieren, nur für dich",
        "Ein Wochenende mit Freunden organisieren, samt Reiseplan",
        "Einen ruhigen Abend blocken: früh ins Bett, ein gutes Buch, eine Tasse Tee"
      ]
    },
    {
      "q": "Mitten im Jahr klopft eine unerwartete Chance an.",
      "choices": [
        "Gut abwägen und dann mit einem klaren Plan zugreifen",
        "Vorbeiziehen lassen. Dein Tempo gefällt dir so, wie es ist",
        "Erst mit deinen engsten Menschen darüber reden, bevor du entscheidest",
        "Sofort zugreifen und eine Freundin oder einen Freund mitnehmen"
      ]
    },
    {
      "q": "Stell dir das nächste Silvester vor. Worauf wärst du am stolzesten?",
      "choices": [
        "Ein Notizbuch voller kleiner Gewohnheiten, die du wirklich durchgehalten hast",
        "Ein großes Ziel, das dein ganzes Team gemeinsam erreicht hat",
        "Ein Jahr voller herzlicher Momente mit den Menschen, die du liebst",
        "Ein Stapel Geschichten über Dinge, die du zum allerersten Mal ausprobiert hast"
      ]
    }
  ],
  "types": {
    "voyage": {
      "name": "Die große Seereise",
      "word": "Seereise",
      "vibe": "Du bestimmst den Kurs, und deine Crew segelt gern mit.",
      "desc": "Dieses Jahr könnte eines zum Lossegeln werden. Du liebst neue Horizonte, verlässt den Hafen aber nie ohne Karte, und du reist selten allein. Man vertraut deinen Plänen, weil du an alle an Bord denkst. Große gemeinsame Ziele passen dieses Jahr zu dir: ein Teamprojekt, eine Gruppenreise, eine Herausforderung mit Freunden. Halte den Kurs, aber genieß auch die Aussicht unterwegs.",
      "keywords": ["Mutige Pläne", "Teamgeist", "Neue Horizonte"],
      "color": "Ozeanblau",
      "item": "Eine Papierkarte von einem Ort, den du besuchen willst",
      "fortune": {
        "work": "Ein gutes Jahr, um etwas zu beginnen, das größer ist als das, was du allein schaffen würdest. Dein Talent, Menschen zu organisieren, könnte spannende Türen öffnen.",
        "money": "Auf ein gemeinsames Ziel zu sparen, etwa eine Reise oder eine Feier, könnte dich mehr motivieren als Sparen um des Sparens willen.",
        "love": "Menschen sammeln sich um dich. Frag deine Crew auch, wie es ihr geht, nicht nur, wie der Plan läuft.",
        "self": "Plane deine Pausen so, wie du alles andere planst. Auch Kapitäne brauchen mal eine ruhige Nacht im Hafen."
      },
      "tip": "Schreib ein Abenteuer auf, das du dieses Jahr mit jemandem teilen willst, und sucht euch gemeinsam den Monat aus."
    },
    "festival": {
      "name": "Das bunte Freudenfest",
      "word": "Freudenfest",
      "vibe": "Du machst aus gewöhnlichen Tagen kleine Feste.",
      "desc": "Dein Jahr könnte sich wie ein langes Festival mit vielen kleinen Bühnen anfühlen. Du probierst gern Neues aus, am liebsten mit anderen und ohne allzu viel Planung. Deine Energie bringt Menschen zusammen und macht aus einem grauen Dienstag eine Party. Dieses Jahr könnte deine Offenheit mit neuen Freundschaften und überraschenden Einladungen belohnen. Lass nur ein bisschen Platz im Kalender, um durchzuatmen.",
      "keywords": ["Fröhlich", "Gesellig", "Spontan"],
      "color": "Sonniges Koralle",
      "item": "Ein Strauß bunter Luftballons",
      "fortune": {
        "work": "Frische Ideen kommen leicht, wenn du mit anderen brainstormst. Ein verspielter Ansatz könnte ein Problem lösen, an dem ernste Gesichter gescheitert sind.",
        "money": "Gemeinsame schöne Momente sind dir wichtig. Ein kleines Ausflugsglas für Unternehmungen mit Freunden könnte Geldbeutel und Laune gleichermaßen schonen.",
        "love": "Dein Freundeskreis könnte dieses Jahr wachsen. Jemand, den du zufällig triffst, könnte ein guter Freund werden.",
        "self": "Gleiche volle Wochen mit ein paar ruhigen Abenden aus. Du strahlst noch heller, wenn du ausgeruht bist."
      },
      "tip": "Plane eine kleine Feier ganz ohne Anlass und lade jemanden ein, den du gern besser kennenlernen würdest."
    },
    "summit": {
      "name": "Der hohe Gipfel",
      "word": "Gipfel",
      "vibe": "Ein klares Ziel, ein stetiger Aufstieg, eine großartige Aussicht ganz oben.",
      "desc": "Dieses Jahr sieht aus wie ein Berg, den du dir ausgesucht hast. Du magst echte Herausforderungen, bereitest dich gern gut vor und gehst zufrieden deinen eigenen Weg. Schritt für Schritt könntest du sichtbare Fortschritte bei etwas machen, das dir wichtig ist: einer Fähigkeit, einem Projekt, einer persönlichen Bestleistung. Du brauchst kein Publikum, aber die Aussicht von oben wird es wert sein, sie zu teilen. Feiere die kleinen Zwischenlager auf dem Weg.",
      "keywords": ["Fokussiert", "Entschlossen", "Gut vorbereitet"],
      "color": "Tannengrün",
      "item": "Ein Paar bequeme Sneaker",
      "fortune": {
        "work": "Konzentration ist deine Stärke. Ein langfristiges Projekt oder eine neue Fähigkeit könnte mit deiner geduldigen Mühe stetig wachsen.",
        "money": "Klare Ziele helfen dir auch hier. Zu wissen, wofür du sparst, könnte kleine Entscheidungen leichter machen.",
        "love": "Vielleicht bist du mit deinem Aufstieg beschäftigt, also könnte eine kurze Nachricht an alte Freunde mehr bedeuten, als du denkst.",
        "self": "Ruhetage gehören zu jedem guten Aufstieg. Plane sie genauso ernsthaft wie deine Trainingstage."
      },
      "tip": "Wähle ein Ziel fürs Jahr und markiere drei kleine Etappen in deinem Kalender."
    },
    "adventure": {
      "name": "Der offene Weg",
      "word": "offene Weg",
      "vibe": "Keine Karte, kein Problem. Jede Abzweigung ist eine neue Geschichte.",
      "desc": "Dein Jahr könnte sich wie ein Roadtrip ohne festes Ziel anfühlen. Du folgst deiner Neugier, bist gern mit dir allein unterwegs und änderst bereitwillig die Richtung, wenn etwas Spannendes auftaucht. Diese Freiheit führt dich zu Orten und Ideen, die andere übersehen. Es könnte ein Jahr der ersten Male werden: eine neue Stadt, ein neues Hobby, ein neuer Blick auf die Dinge. Hab ein Notizbuch griffbereit, denn an die Umwege willst du dich erinnern.",
      "keywords": ["Neugierig", "Freigeist", "Unabhängig"],
      "color": "Abendrot-Orange",
      "item": "Ein leichter Rucksack",
      "fortune": {
        "work": "Ungewöhnliche Wege könnten dir liegen. Eine Methode auszuprobieren, die noch niemand genutzt hat, könnte zu deinen besten Ideen führen.",
        "money": "Erlebnisse bedeuten dir mehr als Dinge. Eine kleine Reisekasse könnte aus Wünschen echte Ausflüge machen.",
        "love": "Unterwegs triffst du spannende Menschen. Lass ein paar von ihnen länger als ein Kapitel in deiner Geschichte bleiben.",
        "self": "Deine Freiheit ist deine Energie. Sorg dafür, dass du auch einen gemütlichen Ort hast, an den du zurückkehren kannst."
      },
      "tip": "Probier jede Jahreszeit etwas völlig Neues aus und schreib eine einzige Zeile darüber, wie es sich angefühlt hat."
    },
    "nest": {
      "name": "Das warme Nest",
      "word": "warme Nest",
      "vibe": "Du schaffst ein Zuhause, in dem sich alle willkommen fühlen.",
      "desc": "Dieses Jahr könnte darum gehen, etwas Warmes und Beständiges aufzubauen. Du magst einen ruhigen Rhythmus, die Menschen um dich herum liegen dir sehr am Herzen, und du bereitest alles mit Bedacht vor, damit sich jeder umsorgt fühlt. Dein Zuhause, dein Team oder dein Freundeskreis könnte zu einem Ort werden, an dem alle gern zusammenkommen. Kleine Traditionen, die du dieses Jahr beginnst, etwa ein monatliches Abendessen oder ein gemeinsames Fotoalbum, könnten euch noch lange begleiten.",
      "keywords": ["Fürsorglich", "Zuverlässig", "Aufmerksam"],
      "color": "Warmes Beige",
      "item": "Eine sanft duftende Kerze",
      "fortune": {
        "work": "Andere verlassen sich auf deine ruhige Hand. Organisieren und unterstützen könnte genau das sein, worin du am meisten glänzt.",
        "money": "Für Gemütlichkeit vorzusorgen passt zu dir. Ein wenig für gemeinsame Momente zu Hause zurückzulegen, könnte sich richtig gut anfühlen.",
        "love": "Deine Beziehungen könnten eher tiefer als breiter werden. Ein langes Gespräch könnte mehr zählen als eine große Party.",
        "self": "Du kümmerst dich um alle, also sorg dafür, dass sich auch jemand um dich kümmert. Hilfe anzunehmen ist völlig in Ordnung."
      },
      "tip": "Starte eine kleine Tradition mit den Menschen, die du liebst, etwa ein monatliches Essen oder ein jährliches Foto."
    },
    "bond": {
      "name": "Der vertraute Kreis",
      "word": "vertraute Kreis",
      "vibe": "In den schönsten Momenten deines Jahres sind vertraute Gesichter dabei.",
      "desc": "Dein Jahr könnte von guter Gesellschaft geprägt sein. Du magst ein entspanntes Tempo, hörst gut zu und lässt Pläne gern ganz natürlich mit den Menschen entstehen, die du magst. Freunde fühlen sich bei dir wohl, und alte Verbindungen könnten auf schöne Weise zurückkehren. Es könnte ein Jahr langer Gespräche, gemeinsamer Mahlzeiten und eines Lachens werden, an das du dich nächsten Winter noch erinnerst. Halte Tür und Herz weit offen.",
      "keywords": ["Herzlich", "Entspannt", "Treu"],
      "color": "Kirschrosa",
      "item": "Ein Stapel handgeschriebener Karten",
      "fortune": {
        "work": "Gute Beziehungen zu Kolleginnen, Kollegen oder Mitstudierenden könnten alles leichter machen. Deine Freundlichkeit ist eine echte Stärke.",
        "money": "Teilen fühlt sich besser an als Besitzen. Kleine, durchdachte Geschenke könnten mehr Freude machen als große Anschaffungen.",
        "love": "Eine alte Freundschaft könnte neu aufblühen, oder eine neue fühlt sich an, als würdet ihr euch schon ewig kennen.",
        "self": "Zeit mit anderen lädt dich auf, aber stille Momente helfen dir, auch deine eigenen Wünsche zu hören."
      },
      "tip": "Schick jeden Monat eine handgeschriebene Nachricht an jemanden, der dein Leben heller gemacht hat."
    },
    "seed": {
      "name": "Das geduldige Samenkorn",
      "word": "Samenkorn",
      "vibe": "Jeden Tag kleine Schritte, und etwas Schönes wächst heran.",
      "desc": "Dieses Jahr könnte ein Jahr des stillen Wachstums werden. Du bevorzugst einen ruhigen Rhythmus, magst deinen eigenen Raum und planst gern kleine, vernünftige Schritte. Nichts daran ist spektakulär, aber nächsten Winter staunst du vielleicht, wie viel gewachsen ist: eine Gewohnheit, die geblieben ist, eine Fähigkeit, die aufgeblüht ist, ein gelassenerer Alltag. Deine Geduld ist dieses Jahr deine Geheimkraft. Gieß deine Samen jeden Tag ein kleines bisschen.",
      "keywords": ["Geduldig", "Beständig", "Gelassen"],
      "color": "Frisches Mint",
      "item": "Ein kleines Gewohnheits-Notizbuch",
      "fortune": {
        "work": "Beständigkeit könnte dieses Jahr Tempo schlagen. Kleine tägliche Fortschritte könnten sich zu etwas summieren, auf das du stolz bist.",
        "money": "Sanfte Routinen passen zu dir, etwa ein einfacher monatlicher Blick auf deine eigenen Ausgaben.",
        "love": "Dein Kreis ist vielleicht nicht der größte, aber die Menschen darin wissen, dass sie auf dich zählen können.",
        "self": "Eine einfache Routine, eine aufgeräumte Ecke und ein früher Feierabend könnten alles sein, was du brauchst, um dich rundum wohlzufühlen."
      },
      "tip": "Such dir eine winzige tägliche Gewohnheit aus, so klein, dass du sie selbst an deinem faulsten Tag schaffst."
    },
    "pause": {
      "name": "Die sanfte Pause",
      "word": "sanfte Pause",
      "vibe": "Ein langsameres Jahr, ein weicheres Herz und Raum zum Durchatmen.",
      "desc": "In deinem Jahr könnte es ums Langsamerwerden gehen, im allerbesten Sinn. Du magst ein ruhiges Tempo, schätzt Zeit für dich und lässt das Leben gern geschehen, ohne es zu erzwingen. Das ist kein Nichtstun: Es ist der Raum, in dem leise neue Ideen auftauchen. Es könnte ein Jahr werden, um einfache Freuden zu genießen, ein gutes Buch, einen langen Spaziergang, einen gemütlichen Abend, und zu merken, was dich wirklich glücklich macht.",
      "keywords": ["Friedlich", "Nachdenklich", "Sanft"],
      "color": "Lavendel",
      "item": "Ein weicher, kuscheliger Schal",
      "fortune": {
        "work": "Ein ruhiger Kopf sieht klar. Einen Moment innezuhalten, bevor du entscheidest, könnte dir helfen, den richtigen Weg zu wählen.",
        "money": "Einfache Freuden kosten wenig. Vielleicht merkst du, dass die Dinge, die du am meisten liebst, schon ganz nah sind.",
        "love": "Ruhige Gesellschaft passt zu dir. Ein, zwei enge Freunde könnten dein Jahr ganz erfüllt wirken lassen.",
        "self": "Dies ist dein Jahr, um ohne schlechtes Gewissen zu ruhen. Langsame Morgen und ruhige Abende hast du dir verdient."
      },
      "tip": "Halte dir einen Abend pro Woche komplett frei, nur für das, worauf du gerade Lust hast."
    }
  }
};
