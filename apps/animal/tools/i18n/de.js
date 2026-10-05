/* Welches Tier bist du? (de)
 * Same 8 animal ids (wolf owl otter lion panda eagle sloth deer) and question/choice order as animal-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as animal-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name an animal result or quote a question.
 * types.<id>.word = the plain animal word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": "Welches Tier bist du? Tier-Persönlichkeitstest",
    "description": "Welches Tier bist du? Der Tier-Persönlichkeitstest mit 8 Alltagssituationen: 2–3 Minuten, kostenlos, ohne Anmeldung. Finde dein Tier, dein perfektes Match und Tipps.",
    "ogTitle": "Welches Tier bist du? 🦊 Tier-Persönlichkeitstest",
    "ogDescription": "Ein Quiz für zwischendurch, 2 Minuten. Beantworte 8 Alltagssituationen und lerne das Tier kennen, das zu dir passt."
  },
  "siteName": "Welches Tier bist du?",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "🦊 Tier-Persönlichkeitstest",
    "h1Kicker": "Welches Tier bist du?",
    "h1Html": "Welchem Tier<br>bist du <em>am ähnlichsten</em>?",
    "hook": "Ein abgesagter Plan, ein Anruf um Mitternacht, eine Party voller Fremder … Ein paar Alltagsmomente verraten deine wilde Seite.",
    "metaTime": "⏱️ 2–3 Minuten",
    "metaCount": "🐾 8 Fragen",
    "start": "Mein Tier finden →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "F{n}"
  },
  "loading": {
    "text": "Wir folgen deinen Spuren …",
    "sub": "Deine Antworten werden einem Tier zugeordnet"
  },
  "result": {
    "title": "Welches Tier bist du? Ich bin {name}",
    "eyebrow": "Dein ähnlichstes Tier",
    "strengthsLabel": "Deine Superkräfte",
    "tipsLabel": "Tipps für deine tierische Seite",
    "bestLabel": "Perfektes Match",
    "rivalLabel": "Rivale",
    "sameShare": "{pct} % haben dieses Tier",
    "shareText": "Mein Tier ist {name} {emoji} – „{vibe}“ Welches Tier bist du?",
    "ctaStrong": "Ein Freund hat sein Tier geteilt",
    "ctaSub": "Welches Tier bist du? 2 Minuten.",
    "retry": "Test wiederholen"
  },
  "og": {
    "eyebrow": "Mein Tier ist",
    "brand": "🦊 Welches Tier bist du?",
    "defaultKicker": "Tier-Persönlichkeitstest",
    "defaultTitle": "Welches Tier bist du?",
    "defaultDesc": "8 Alltagssituationen · 2–3 Minuten"
  },
  "faq": [
    {
      "q": "Wie wird mein Tier ermittelt?",
      "a": "Jede Antwort gibt einigen Tieren Punkte, und das Tier mit den meisten Punkten gewinnt. Bei Gleichstand entscheidet eine feste Regel – gleiche Antworten ergeben also immer dasselbe Ergebnis."
    },
    {
      "q": "Ist das ein wissenschaftlicher Persönlichkeitstest?",
      "a": "Nein, er ist nur zum Spaß. Die Fragen drehen sich um Alltagsgewohnheiten und Stimmungen, nicht um eine psychologische Diagnose – sieh ihn als verspielten Spiegel."
    },
    {
      "q": "Was bedeuten „Perfektes Match“ und „Rivale“?",
      "a": "Dein perfektes Match ist das Tier, das deines von Natur aus ausgleicht. Dein Rivale ist das, mit dem du am häufigsten aneinandergerätst – das kann auch die meisten Funken bedeuten."
    },
    {
      "q": "Werden meine Antworten gespeichert?",
      "a": "Nein. Deine Antworten werden in deinem Browser ausgewertet und nie gespeichert. Wir zählen nur anonym, welches Tier herauskam, um zu zeigen, wie häufig jedes Ergebnis ist."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Welches Tier bist du?",
    "description": "Datenschutzerklärung zu „Welches Tier bist du?“ – Cookies, Werbung und anonyme Statistiken.",
    "h1": "Datenschutzerklärung",
    "introHtml": "„Welches Tier bist du?“ (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie unten beschrieben.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen. Deine Antworten werden nur in deinem Browser ausgewertet und weder an unsere Server gesendet noch dort gespeichert. Wir zählen nur anonym, welches Tier herauskam, um die Häufigkeit der Ergebnisse anzuzeigen."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers verwenden, um deine Sprache zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht richtig."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche dieser und anderer Websites auszuspielen. Mehr dazu und Einstellungen findest du in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistiken",
        "Wir speichern nur anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Diese Summen lassen keine Rückschlüsse auf deine Person zu."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 6. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Tier-Test"
  },
  "questions": [
    {
      "q": "Dein Wochenendplan wird kurzfristig abgesagt. Du …",
      "choices": [
        "schreibst deinen engsten Freunden und schaust, wer Zeit hat",
        "machst es dir endlich mit einem Buch oder einer Doku gemütlich",
        "probierst irgendwas Spontanes: neues Café, neuer Park, egal",
        "organisierst schnell ein Abendessen und lädst alle ein. Du bist heute Gastgeber!"
      ]
    },
    {
      "q": "Ein großes Gruppenprojekt landet auf deinem Tisch. Du …",
      "choices": [
        "gehst es Schritt für Schritt an, ohne Eile",
        "sorgst für gute Stimmung und machst deinen Teil im eigenen Tempo",
        "setzt dir ein klares Ziel und willst das beste Ergebnis",
        "achtest zuerst darauf, dass sich alle gehört und wohl fühlen"
      ]
    },
    {
      "q": "Ein Freund ruft dich um Mitternacht aufgelöst an. Du …",
      "choices": [
        "heiterst ihn mit Witzen auf, bis er lacht",
        "hilfst ihm, einen klaren Plan zur Lösung zu machen",
        "sagst „Bin unterwegs“ und stehst in 20 Minuten vor der Tür",
        "bleibst am Telefon, ruhig und tröstend, so lange es nötig ist"
      ]
    },
    {
      "q": "Du kommst auf eine Party, auf der du nur eine Person kennst. Du …",
      "choices": [
        "bleibst bei deinem Freund, lächelst und wartest, dass dich jemand anspricht",
        "trittst auf, als gehöre dir der Laden, und begrüßt alle",
        "beobachtest erst den Raum und sprichst dann jemand Interessanten an",
        "suchst dir eine gemütliche Ecke neben den Snacks und bleibst dort"
      ]
    },
    {
      "q": "Such dir deine Traumreise aus.",
      "choices": [
        "Gemütliches Resort: ausschlafen, gut essen, nichts tun",
        "Roadtrip mit den besten Freunden, Erinnerungen an jedem Stopp",
        "Blühende Landschaft oder eine Hütte im Wald",
        "Eine ruhige Altstadt voller Museen, Buchläden und Geschichten"
      ]
    },
    {
      "q": "Plötzlich taucht ein Problem auf. Du …",
      "choices": [
        "konzentrierst dich, suchst den schnellsten Weg und löst es",
        "lachst darüber, improvisierst und machst Spaß daraus",
        "atmest tief durch, holst dir einen Snack und lässt es laufen",
        "trittst vor und übernimmst sofort das Steuer"
      ]
    },
    {
      "q": "Deine Freunde würden dich beschreiben als …",
      "choices": [
        "den Sanften, der immer merkt, wie es allen geht",
        "den Zielstrebigen, der immer ein Ziel hat",
        "den Loyalen, der immer hinter ihnen steht",
        "den Lustigen, der jeden Plan besser macht"
      ]
    },
    {
      "q": "Dein perfekter Abend endet mit …",
      "choices": [
        "Jubel von allen für einen Abend, den du unvergesslich gemacht hast",
        "gutem Essen, guten Leuten und Lachen ohne Eile",
        "einem tiefen Gespräch spät in der Nacht unter den Sternen",
        "früh ins Bett, Handy aus und ganz lange schlafen"
      ]
    }
  ],
  "types": {
    "wolf": {
      "name": "der treue Wolf",
      "word": "wolf",
      "vibe": "Unerschütterlich loyal, dein Rudel steht immer an erster Stelle.",
      "desc": "Du bist der Freund, der da ist. Wer einmal in deinem Kreis ist, den beschützt du, dem hältst du den Rücken frei, und was jemand für dich getan hat, vergisst du nie. Anfangs wirkst du vielleicht ernst, aber bei deinen Leuten bist du warm, witzig und tief ergeben. Dein Rudel kann sich glücklich schätzen.",
      "strengths": [
        "Unerschütterliche Treue",
        "Beschützerherz",
        "Teamgeist"
      ],
      "tips": [
        "Lass dir auch mal helfen – du musst nicht das ganze Rudel tragen.",
        "Sag ab und zu „Nein“. Loyalität heißt nicht, zu allem Ja zu sagen.",
        "Mach Platz für neue Leute; dein Kreis kann wachsen, ohne seine Wärme zu verlieren."
      ]
    },
    "owl": {
      "name": "die weise Eule",
      "word": "eule",
      "vibe": "Still beobachtend und immer drei Gedanken tiefer.",
      "desc": "Du schaust, hörst zu und verstehst lieber erst, bevor du sprichst. Leute kommen mit Fragen zu dir, wenn sie durchdachten Rat brauchen, und in tiefen Gesprächen spät in der Nacht blühst du auf. Du lernst gern und bemerkst Details, die allen anderen entgehen. Manchmal grübelst du zu viel, aber dein Gespür ist ein echtes Geschenk.",
      "strengths": [
        "Scharfer Durchblick",
        "Gute Zuhörerin",
        "Neugieriger Kopf"
      ],
      "tips": [
        "Teile deine Ideen, bevor sie perfekt sind – die Leute wollen sie hören.",
        "Wenn die Gedanken rasen, schreib sie auf oder geh spazieren, statt sie zu wiederholen.",
        "Plane etwas Spaß ohne jeden Zweck ein. Dein Kopf hat Pause verdient."
      ]
    },
    "otter": {
      "name": "der verspielte Otter",
      "word": "otter",
      "vibe": "Pure Freude, breites Lächeln und ein Talent, jeden Tag besser zu machen.",
      "desc": "Du machst aus gewöhnlichen Momenten Spiele. Du bist neugierig, freundlich und kaum traurig zu kriegen. Überall findest du Freunde und hältst die Stimmung leicht, auch wenn alles drunter und drüber geht. Hinter den Witzen steckt der Wunsch, dass alle zusammen Spaß haben.",
      "strengths": [
        "Sofort gute Laune",
        "Leichte Freundschaften",
        "Furchtloser Spaß"
      ],
      "tips": [
        "Gönn dir ab und zu eine stille Minute; nicht jedes Gefühl braucht einen Witz.",
        "Bring eine Kleinigkeit zu Ende, bevor du das nächste Abenteuer startest.",
        "Sag es, wenn es dir wirklich schlecht geht. Die anderen sind gern für dich da."
      ]
    },
    "lion": {
      "name": "der mutige Löwe",
      "word": "löwe",
      "vibe": "Selbstbewusst, warmherzig und geboren, um den Raum zu führen.",
      "desc": "Du trittst vor, wenn andere zögern. Du hast Ausstrahlung, Mut und eine großzügige Ader, und die Leute folgen ganz natürlich deiner Energie. Du liebst große Momente und sorgst dafür, dass deine Leute gefeiert werden. Am besten führst du, indem du alle um dich herum nach oben ziehst.",
      "strengths": [
        "Natürliche Führungskraft",
        "Großherziger Mut",
        "Ansteckendes Selbstvertrauen"
      ],
      "tips": [
        "Gib das Rampenlicht auch mal ab; leise Stimmen haben oft die besten Ideen.",
        "Frag nach, bevor du übernimmst. Hilfe wirkt am besten, wenn sie erwünscht ist.",
        "Ausruhen gehört zur Stärke. Sogar Könige machen ein Nickerchen."
      ]
    },
    "panda": {
      "name": "der gemütliche Panda",
      "word": "panda",
      "vibe": "Locker, freundlich und die Ruhe in jedem Sturm.",
      "desc": "Du lässt dich treiben und bringst alle um dich herum zum Entspannen. Du magst gutes Essen, gute Gesellschaft und Tage ohne Hetze. Du machst selten Drama und bist erstaunlich schwer aus der Ruhe zu bringen. Die Leute lieben es, wie sicher und gemütlich es mit dir ist.",
      "strengths": [
        "Ruhige Präsenz",
        "Lockere Freundlichkeit",
        "Freude an kleinen Dingen"
      ],
      "tips": [
        "Sag laut, was du willst; du darfst auch einen Favoriten haben.",
        "Setz dir jede Woche ein kleines Ziel, um dich etwas zu strecken.",
        "Lass „ist mir egal“ nicht verdecken, was du wirklich fühlst."
      ]
    },
    "eagle": {
      "name": "der zielstrebige Adler",
      "word": "adler",
      "vibe": "Fokussiert, unabhängig und immer höher hinaus.",
      "desc": "Du siehst das große Ganze und gehst darauf zu. Du setzt dir Ziele, machst Pläne und legst bei dir selbst hohe Maßstäbe an. Du bist gern unabhängig und löst Probleme schnell. Dein Ehrgeiz inspiriert, und im Stillen hoffst du auf jemanden, der dein Tempo mitgehen kann.",
      "strengths": [
        "Klarer Fokus",
        "Unabhängiger Geist",
        "Schneller Problemlöser"
      ],
      "tips": [
        "Feiere die Erfolge unterwegs, nicht nur auf dem Gipfel.",
        "Gib diese Woche etwas ab. Vertrauen bringt dich weiter als Tempo.",
        "Frag nach, wie es den anderen geht; Fortschritt ist besser, wenn man ihn teilt."
      ]
    },
    "sloth": {
      "name": "das gemütliche Faultier",
      "word": "faultier",
      "vibe": "Langsam, beständig und Profi im Genießen.",
      "desc": "Du kennst das Geheimnis, das andere vergessen: Fürs Hetzen gibt es keinen Preis. Du schützt deine Ruhe, liebst deine Gemütlichkeit und gehst alles Schritt für Schritt an. Du bist geduldig, unaufgeregt und still weise, was wirklich zählt. Deine Ruhe ist ein Geschenk in einer eiligen Welt.",
      "strengths": [
        "Tiefe Geduld",
        "Friedliche Haltung",
        "Meister der Gemütlichkeit"
      ],
      "tips": [
        "Fang an, bevor du dich bereit fühlst; kleine Schritte zählen auch.",
        "Sag Freunden früh Bescheid, damit sie sich auf dein Tempo einstellen können.",
        "Probiere einmal im Monat etwas Neues. Gemütlich und neugierig passen zusammen."
      ]
    },
    "deer": {
      "name": "das sanfte Reh",
      "word": "reh,hirsch",
      "vibe": "Weichherzig, anmutig und feinfühlig für die Gefühle aller.",
      "desc": "Du bemerkst die kleinen Dinge: die Stimmung, die kippt, den Einsamen in der Ecke. Du bist sanft, sensibel und leise freundlich und liebst schöne, friedliche Orte. Bei Konflikten zuckst du vielleicht zusammen, aber dein Einfühlungsvermögen macht dich zu jemandem, dem man seine Gefühle anvertraut.",
      "strengths": [
        "Tiefes Mitgefühl",
        "Anmutige Freundlichkeit",
        "Blick für Schönheit"
      ],
      "tips": [
        "Deine Gefühle zählen genauso viel; sprich früh, auch wenn es leise ist.",
        "Lade dich nach vollen Tagen in der Natur oder mit Musik auf.",
        "Du darfst „Ich brauche einen Moment“ sagen, ohne dich zu erklären."
      ]
    }
  }
};
