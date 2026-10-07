/* Mentales Alter Test (de)
 * Same 8 age-bracket ids (kid teen fresh hustle steady seasoned mellow sage) and question/choice order as mentalage-core.js
 * (the "mind age" points live only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].points[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * result.age = plural forms for the number age (Intl.PluralRules: one/few/many/other), {n} = the number (or a range like 24–29).
 * Placeholders: {name} {emoji} {vibe} {age} {pct} {n} {min} {max} {range} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Pangolin&display=swap",
    "display": "'Pangolin'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": "Mentales Alter Test: Wie alt ist dein Kopf?",
    "description": "Mach den Test zum mentalen bzw. psychologischen Alter: 12 leichte Alltagsfragen, 2–3 Minuten, ohne Anmeldung. Erfahre, wie alt dein Kopf wirklich ist – aufs Jahr genau, mit Stärken und Tipps.",
    "ogTitle": "Mentales Alter Test 🧠 Wie alt ist dein Kopf?",
    "ogDescription": "Ein 2-Minuten-Quiz. 12 Alltagsfragen verraten dein psychologisches Alter – aufs Jahr genau."
  },
  "siteName": "Mentales Alter Test",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "🧠 Kurzes Kopf-Quiz",
    "h1Kicker": "Mentales Alter Test",
    "h1Html": "Wie alt ist dein Kopf<br><em>wirklich</em>?",
    "hook": "Dein Ausweis sagt eine Zahl. Deine Alltagsgewohnheiten sagen vielleicht eine andere. Antworte ehrlich und sieh, was dein Kopf dazu meint.",
    "metaTime": "⏱️ 2–3 Min.",
    "metaCount": "✏️ 12 Fragen",
    "start": "Mein mentales Alter →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "F{n}"
  },
  "loading": {
    "text": "Deine Kritzeleien werden gelesen…",
    "sub": "Wir zählen die Kerzen auf dem Kuchen deines Kopfes"
  },
  "result": {
    "title": "Mentales Alter Test: Ich bin {name}",
    "eyebrow": "Dein mentales Alter",
    "range": "{min}–{max}",
    "age": {
      "one": "{n} Jahr",
      "few": "{n} Jahre",
      "many": "{n} Jahre",
      "other": "{n} Jahre"
    },
    "metaRange": "Mentales Alter: {range}.",
    "strengthsLabel": "Was dich stark macht",
    "tipsLabel": "Tipps für dein Kopf-Alter",
    "bestLabel": "Bester Kumpel",
    "rivalLabel": "Rivale",
    "sameShare": "{pct} % der Spieler haben diese Altersgruppe",
    "shareText": "Mein mentales Alter: {age} {emoji} {name} – „{vibe}“ Wie alt ist dein Kopf?",
    "ctaStrong": "Jemand hat sein mentales Alter geteilt",
    "ctaSub": "Wie alt ist dein Kopf? 2 Minuten.",
    "retry": "Test nochmal machen"
  },
  "og": {
    "eyebrow": "Mein mentales Alter",
    "brand": "🧠 Mentales Alter Test",
    "defaultKicker": "Psychologisches Alter Test",
    "defaultTitle": "Wie alt ist dein Kopf?",
    "defaultDesc": "12 Alltagsfragen · 2–3 Minuten"
  },
  "faq": [
    {
      "q": "Wie wird mein mentales Alter berechnet?",
      "a": "Jede Antwort bringt ein paar „Kopf-Alter“-Punkte. Die Summe ordnet dich einer Altersgruppe zu, und wo deine Antworten darin liegen, ergibt die genaue Zahl. Gleiche Antworten, gleiches Ergebnis."
    },
    {
      "q": "Ist das ein echter psychologischer Test?",
      "a": "Nein, nur zum Spaß. Er schaut auf Alltagsgewohnheiten und Stimmungen, nicht auf Intelligenz oder Reife. Nimm ihn als lustigen Spiegel, nicht als Diagnose."
    },
    {
      "q": "Warum weicht mein Ergebnis so von meinem echten Alter ab?",
      "a": "Genau das macht den Spaß aus. Viele Menschen sind im Kopf jünger oder älter als laut Geburtsurkunde. Das Ergebnis kann sich auch mit der Laune ändern – probier es an einem anderen Tag nochmal."
    },
    {
      "q": "Werden meine Antworten gespeichert?",
      "a": "Nein. Deine Antworten werden im Browser ausgewertet und nie gespeichert. Wir zählen nur anonym, welche Altersgruppe herauskam, um zu zeigen, wie häufig jedes Ergebnis ist."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Mentales Alter Test",
    "description": "Datenschutzerklärung für den Mentales Alter Test – Cookies, Werbung und anonyme Statistiken.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der Mentales Alter Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die nötigsten Informationen, wie unten beschrieben.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen. Deine Antworten werden im Browser ausgewertet und nie an unsere Server gesendet oder gespeichert. Wir zählen nur anonym, welche Altersgruppe herauskam, um die Häufigkeit der Ergebnisse zu zeigen."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht richtig."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage früherer Besuche auf dieser und anderen Websites auszuliefern. Mehr dazu und zur Personalisierung findest du in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistiken",
        "Wir speichern anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Diese Summen lassen keine Rückschlüsse auf dich zu."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 8. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Test"
  },
  "questions": [
    {
      "q": "Samstag ohne Wecker. Wann wachst du auf?",
      "choices": [
        "Um 6, der Tag ist schon durchgeplant",
        "Gegen 9, ganz von allein und ausgeschlafen",
        "Mittags… was ist ein Morgen?",
        "Superfrüh, weil Wochenende! Raus aus dem Bett!"
      ]
    },
    {
      "q": "Dein perfekter Geburtstag sieht so aus:",
      "choices": [
        "Luftballons, Partyhütchen und eine riesige Torte!",
        "Große Party mit der ganzen Clique",
        "Gemütliches Abendessen mit ein paar Freunden",
        "Ein ruhiger Tag und ein Anruf von der Familie"
      ]
    },
    {
      "q": "Du bist unterwegs und dein Handy hat 15 %.",
      "choices": [
        "Panik! Sofort eine Steckdose suchen",
        "Kein Stress, die Powerbank ist immer dabei",
        "Dann geht’s halt aus. Abenteuer!"
      ]
    },
    {
      "q": "Im Supermarkt gehst du zuerst zu…",
      "choices": [
        "Süßigkeiten und Chips",
        "Tiefkühlpizza und Energydrinks",
        "Obst, Gemüse und den Angeboten der Woche",
        "Meinem Einkaufszettel, Punkt für Punkt"
      ]
    },
    {
      "q": "Alle reden über einen neuen Hit.",
      "choices": [
        "Den Tanz dazu kann ich schon",
        "Am ersten Tag in meiner Playlist",
        "Ist das nicht ein Cover von einem alten Lied?",
        "Hör ich mir irgendwann mal an"
      ]
    },
    {
      "q": "Ein verregneter freier Tag. Der Plan?",
      "choices": [
        "Gummistiefel an und in Pfützen springen!",
        "Decke, Snacks und eine ganze Staffel",
        "Etwas Warmes kochen und ein bisschen aufräumen",
        "Tee, ein gutes Buch und ein Nickerchen zum Regen"
      ]
    },
    {
      "q": "Du bekommst überraschend einen Bonus.",
      "choices": [
        "Endlich das Spiel oder die Figur kaufen, die ich will",
        "Sofort einen Trip mit Freunden buchen",
        "Einmal schön essen gehen, den Rest sparen",
        "Alles aufs Sparkonto. Mein zukünftiges Ich dankt."
      ]
    },
    {
      "q": "Freitagabend, nichts geplant.",
      "choices": [
        "Zocken oder telefonieren bis zum Sonnenaufgang",
        "Rumschreiben, bis sich was ergibt",
        "Um 21 Uhr im Schlafanzug, um 22 Uhr im Bett. Herrlich."
      ]
    },
    {
      "q": "Eine Erkältung bahnt sich an.",
      "choices": [
        "Ein bisschen jammern und auf Pflege hoffen",
        "Ignorieren und weitermachen",
        "Ingwertee, Vitamine und früh ins Bett",
        "Eine Tablette nehmen und ruhig weitermachen"
      ]
    },
    {
      "q": "Der WhatsApp-Gruppenchat explodiert.",
      "choices": [
        "Ich antworte mit zehn Stickern am Stück",
        "Ich schicke das perfekte Meme",
        "Alles lesen, später eine lange Nachricht",
        "Stummschalten. Warum schreiben alle so viel?"
      ]
    },
    {
      "q": "Dein Zimmer ist gerade…",
      "choices": [
        "Voller Kuscheltiere, Figuren und bunter Sachen",
        "Poster, Kabel und kreatives Chaos",
        "Aufgeräumt und minimalistisch, alles hat seinen Platz",
        "Pflanzen, ein gemütlicher Sessel und eine Leselampe"
      ]
    },
    {
      "q": "Wenn du nur eins wählen könntest…",
      "choices": [
        "Für einen Tag wieder ein sorgloses Kind sein",
        "Direkt in einen ruhigen, friedlichen Ruhestand"
      ]
    }
  ],
  "types": {
    "kid": {
      "name": "Spielplatz-Kind",
      "word": "Spielplatz",
      "vibe": "Neugierig, verspielt und voller purer Freude.",
      "desc": "Dein Kopf tickt noch im Pausenhof-Tempo. Du freust dich schnell, lachst laut und findest an fast allem etwas Lustiges. Regeln sind optional, wenn ein Spiel wartet. Diese ehrliche, helle Energie steckt an und hält auch die Menschen um dich jung.",
      "strengths": [
        "Endlose Neugier",
        "Sofortiger Stimmungsmacher",
        "Furchtlose Fantasie"
      ],
      "tips": [
        "Bewahre das Staunen, aber stell dir eine Erinnerung für lästige Erwachsenen-Aufgaben.",
        "Wenn sich etwas unfair anfühlt, atme dreimal tief durch, bevor du reagierst.",
        "Teile deine liebste Albernheit mit jemandem, der ein Lächeln braucht."
      ]
    },
    "teen": {
      "name": "Rebellischer Teenie",
      "word": "Teenie,rebellisch",
      "vibe": "Große Gefühle, klare Meinungen und eine Playlist für jede Laune.",
      "desc": "Dein Kopf lebt in Oberstufen-Intensität: Alles ist wichtig, und du fühlst alles. Du hinterfragst Regeln, entdeckst Neues vor allen anderen und brauchst deinen eigenen Raum. Hinter der coolen Fassade steckt ein loyales Herz, das für die richtigen Freunde alles tut.",
      "strengths": [
        "Leidenschaft pur",
        "Absolut loyal",
        "Trend-Radar"
      ],
      "tips": [
        "Nicht jede Laune braucht eine sofortige Antwort. Schlaf eine Nacht drüber.",
        "Schreib deine großen Ideen auf, manche sind richtig gut.",
        "Lass dich von Älteren überraschen. Die waren auch mal Rebellen."
      ]
    },
    "fresh": {
      "name": "Ersti-Spirit",
      "word": "Ersti",
      "vibe": "Frei, spontan und für alles zu haben.",
      "desc": "Dein Kopf fühlt sich an wie das erste Semester: etwas pleite, sehr frei und immer bereit für spontane Pläne. Du sammelst Erlebnisse statt Dinge und findest überall Freunde. Das Leben ist ein großes Abenteuer, das du unterwegs herausfindest.",
      "strengths": [
        "Spontaneität",
        "Findet überall Freunde",
        "Mutig bei Neuem"
      ],
      "tips": [
        "Sag Ja zu Abenteuern, aber gönn dir auch eine kleine Spar-Routine.",
        "Nimm dir diesen Monat ein einziges Ziel vor und zieh es durch.",
        "Ruf ab und zu zu Hause an. Dort lieben sie deine Geschichten."
      ]
    },
    "hustle": {
      "name": "Ehrgeizige Zwanziger",
      "word": "Zwanziger,ehrgeizig",
      "vibe": "Ehrgeizig, beschäftigt und angetrieben von Kaffee und großen Plänen.",
      "desc": "Dein Kopf ist voll im Aufbau-Modus. Du jonglierst Ziele, Nebenprojekte und einen vollen Kalender und findest trotzdem Zeit für Spaß. Du willst erwachsen werden, ohne langweilig zu werden. Dein Antrieb inspiriert andere – solange du ans Ausruhen denkst.",
      "strengths": [
        "Unaufhaltsamer Antrieb",
        "Multitasking-Profi",
        "Optimistischer Planer"
      ],
      "tips": [
        "Plane Pausen genauso fest ein wie Arbeit.",
        "Feiere kleine Erfolge, nicht nur die großen.",
        "Du musst noch nicht alles herausgefunden haben."
      ]
    },
    "steady": {
      "name": "Entspannte Dreißiger",
      "word": "Dreißiger",
      "vibe": "Ruhig, verlässlich und still in Kontrolle.",
      "desc": "Dein Kopf hat seinen Rhythmus gefunden. Du weißt, was du magst, was nicht und wann du Nein sagst. Du planst voraus, hältst Versprechen und kochst richtig gut. Wer eine ruhige Hand braucht, kommt zu dir, und du enttäuschst selten.",
      "strengths": [
        "Grundsolide Verlässlichkeit",
        "Kluge Planung",
        "Kennt die eigenen Grenzen"
      ],
      "tips": [
        "Lass diese Woche Platz für ungeplanten Spaß.",
        "Probier etwas, bei dem du wieder Anfänger bist.",
        "Lass dir ruhig mal helfen. Verlässlichkeit gilt in beide Richtungen."
      ]
    },
    "seasoned": {
      "name": "Erfahrene Vierziger",
      "word": "Vierziger",
      "vibe": "Erfahren, praktisch und kaum aus der Ruhe zu bringen.",
      "desc": "Dein Kopf hat schon einige Wendungen erlebt und bleibt cool. Du löst Probleme schnell, gibst ehrliche Ratschläge und verschwendest keine Energie an Drama. Du schätzt Komfort, Qualität und Menschen, die meinen, was sie sagen. Mit dir fühlen sich alle sicher.",
      "strengths": [
        "Cool unter Druck",
        "Ehrlicher Rat",
        "Praktische Weisheit"
      ],
      "tips": [
        "Erzähl deine Geschichten, Jüngere lernen viel daraus.",
        "Behalte ein Hobby nur zum Spaß, nicht für Ergebnisse.",
        "Dehn dich jeden Morgen. Dein Rücken sagt Danke."
      ]
    },
    "mellow": {
      "name": "Gelassene Fünfziger",
      "word": "Fünfziger,gelassen",
      "vibe": "Locker, warmherzig und glücklich ohne Eile.",
      "desc": "Dein Kopf genießt die langsame Spur. Ein gutes Essen, ein langer Spaziergang und ein echtes Gespräch sind dir lieber als eine laute Nacht. Kleine Dinge machen dich glücklich, und was andere denken, ist dir egal geworden. Deine ruhige Wärme macht jedes Treffen gemütlicher.",
      "strengths": [
        "Friedliche Ausstrahlung",
        "Genießt kleine Freuden",
        "Großzügiger Zuhörer"
      ],
      "tips": [
        "Sag diese Saison Ja zu einer neuen Erfahrung.",
        "Bring jemandem etwas bei, worauf du stolz bist.",
        "Schreib einem alten Freund eine kurze Nachricht."
      ]
    },
    "sage": {
      "name": "Weise alte Seele",
      "word": "alte Seele,weise",
      "vibe": "Tiefgründig, sanft und voller stiller Weisheit.",
      "desc": "Dein Kopf fühlt sich an, als hätte er schon viele Leben gelebt. Du liebst Ruhe, Routinen, Tee und gute Bücher. Du bemerkst, was andere übersehen, und deine Ratschläge bleiben jahrelang hängen. Trends sind dir egal, aber viele suchen deinen gelassenen Blick.",
      "strengths": [
        "Tiefer Blick",
        "Sanfte Geduld",
        "Ratschläge, die bleiben"
      ],
      "tips": [
        "Mach diese Woche etwas Spontanes und Albernes. Einfach so.",
        "Deine ruhigen Rituale sind toll, teile sie mit einem Freund.",
        "Spiel ein Spiel mit jemandem, der viel jünger ist. Ihr werdet beide lachen."
      ]
    }
  }
};
