/* Personal Color Test (de)
 * 8 result ids (springlight springbright summerlight summermute autumnmute autumndeep winterbright winterdeep);
 * questions[i].choices[j] follow color-core.js QUESTIONS[i].w[j] (the [warm/cool, light/deep, bright/muted] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result name as people would search it — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the real server share. Swatch colors live in color-core.js.
 * A fun self-check, not a professional draping analysis (result disclaimer, FAQ, guide).
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap",
    "display": "'Playfair Display'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": "Farbtyp-Test: Welcher Farbtyp bin ich?",
    "description": "Mach den Farbtyp-Test: 12 Fragen, die du vor dem Spiegel prüfen kannst, etwa 2 Minuten, ohne Foto und ohne Anmeldung. Finde deine Jahreszeiten-Farben. Nur zum Spaß.",
    "ogTitle": "Farbtyp-Test 🎨 Welche Farben lassen dich strahlen?",
    "ogDescription": "Farbanalyse nach Jahreszeiten mit 12 Spiegel-Fragen. Finde deinen Unterton und die Farben, die dir am besten stehen."
  },
  "siteName": "Farbtyp-Test",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "🎨 Spiegel-Selbsttest",
    "h1Kicker": "Farbtyp-Test",
    "h1Html": "Welche Farben lassen<br>dein Gesicht <em>strahlen</em>?",
    "hook": "Schnapp dir einen Spiegel und such dir Tageslicht. Beantworte 12 kurze Fragen zu Haut, Haaren, Augen und den Farben, für die du Komplimente bekommst – und entdecke deine Jahreszeiten-Palette.",
    "metaTime": "⏱️ 2 Min.",
    "metaCount": "🪞 12 Fragen",
    "start": "Meine Farben →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "F{n}"
  },
  "loading": {
    "text": "Deine Palette wird gemischt…",
    "sub": "Jede Nuance kommt ins Licht"
  },
  "result": {
    "title": "Mein Farbtyp: {name}",
    "metaDesc": "Ergebnis im Farbtyp-Test: {name}. {vibe} Die besten Farben, Farben zum Vermeiden und Tipps für Make-up, Haarfarbe und Schmuck.",
    "eyebrow": "Dein Farbtyp ist",
    "gaugeLabel": "Wohin deine Antworten tendieren",
    "axes": [
      ["Warm", "Kühl"],
      ["Hell", "Dunkel"],
      ["Klar", "Gedämpft"]
    ],
    "paletteLabel": "Deine besten Farben",
    "avoidLabel": "Lieber sparsam einsetzen",
    "avoidNote": "Nicht verboten, nur in Gesichtsnähe schwieriger. Trag sie lieber bei Schuhen, Taschen oder Hosen.",
    "makeupLabel": "Make-up",
    "hairLabel": "Haarfarbe",
    "jewelryLabel": "Schmuck",
    "disclaimer": "Ein spielerischer Selbsttest, keine professionelle Farbberatung. Eine echte Farbanalyse arbeitet mit Stofftüchern unter kontrolliertem Licht, und Beleuchtung, Bildschirme und Make-up verändern, wie Farben wirken.",
    "sameShare": "{pct} % haben diese Palette bekommen",
    "shareText": "Mein Farbtyp: {name} {emoji} „{vibe}“ Und welcher bist du?",
    "ctaStrong": "Jemand hat seine Farben mit dir geteilt",
    "ctaSub": "Warm oder kühl? Finde es in 2 Minuten heraus.",
    "retry": "Test wiederholen"
  },
  "og": {
    "eyebrow": "Mein Farbtyp",
    "brand": "🎨 Farbtyp-Test",
    "defaultKicker": "Farbanalyse nach Jahreszeiten",
    "defaultTitle": "Welche Farben lassen dich strahlen?",
    "defaultDesc": "12 Spiegel-Fragen · 2 Minuten"
  },
  "faq": [
    {
      "q": "Wie bestimmt der Test meine Farben?",
      "a": "Jede Antwort verschiebt drei Skalen: warmer oder kühler Unterton, hell oder dunkel, klar oder gedämpft. Dein Ergebnis ist die Jahreszeiten-Palette, in der sich diese drei treffen. Gleiche Antworten ergeben immer das gleiche Ergebnis."
    },
    {
      "q": "Ist das so genau wie eine professionelle Farbberatung?",
      "a": "Nein. Es ist ein spielerischer Selbsttest auf Basis dessen, was du im Spiegel sehen kannst. Bei einer professionellen Farbberatung werden Stofftücher bei neutralem Licht an dein Gesicht gehalten – das kann ein Quiz nicht leisten. Sieh dein Ergebnis als Ausgangspunkt zum Ausprobieren."
    },
    {
      "q": "Wie bekomme ich ein verlässlicheres Ergebnis?",
      "a": "Antworte bei natürlichem Tageslicht in Fensternähe, ungeschminkt und mit zurückgebundenen Haaren. Glühbirnen, Handyfilter und gefärbte Haare können Farben wärmer oder kühler wirken lassen, als sie wirklich sind."
    },
    {
      "q": "Werden meine Antworten oder Fotos gespeichert?",
      "a": "Der Test fragt nie nach einem Foto. Deine Antworten werden in deinem Browser berechnet und nicht gespeichert. Wir zählen nur anonym, welches Ergebnis herauskam, um zu zeigen, wie häufig es ist."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Farbtyp-Test",
    "description": "Datenschutzerklärung des Farbtyp-Tests – wie wir Cookies, Werbung und anonyme Statistiken nutzen.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der Farbtyp-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie unten beschrieben.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen, und er fragt nie nach einem Foto. Deine Antworten werden in deinem Browser berechnet und nie an unsere Server gesendet oder dort gespeichert. Wir zählen nur anonym, welches Ergebnis herauskam, um zu zeigen, wie häufig jedes Ergebnis ist."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache zu speichern, Werbung anzuzeigen und zu verstehen, wie der Dienst genutzt wird. Du kannst sie in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht richtig."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuliefern. Mehr erfährst du und deine Einstellungen zur personalisierten Werbung änderst du in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistiken",
        "Wir speichern anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Diese Summen lassen keine Rückschlüsse auf deine Person zu."
      ],
      [
        "5. Kontakt",
        "Wenn du Fragen zu dieser Datenschutzerklärung hast, wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Datenschutzerklärung gilt ab dem 23. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Farbtyp-Test"
  },
  "questions": [
    {
      "q": "Schau dir bei Tageslicht die Adern an der Innenseite deines Handgelenks an. Welche Farbe haben sie?",
      "choices": [
        "Eher blau oder lila",
        "Eher grün oder oliv",
        "Eine Mischung aus beidem, schwer zu sagen"
      ]
    },
    {
      "q": "Welcher Schmuck lässt deine Haut am schönsten aussehen?",
      "choices": [
        "Gelbgold",
        "Silber oder Platin",
        "Roségold oder sanft gebürstetes Metall",
        "Glänzende Statement-Stücke, egal welches Metall"
      ]
    },
    {
      "q": "Nach einer Stunde in der Sonne ohne Sonnencreme wird deine Haut meistens…",
      "choices": [
        "Rosa und verbrennt, bräunt kaum",
        "Erst etwas rot, dann leicht gebräunt",
        "Goldig und bräunt leicht",
        "Selten verbrannt, nur etwas dunkler"
      ]
    },
    {
      "q": "Halte ein reinweißes und ein elfenbein- oder cremefarbenes Oberteil unter dein Kinn. Was steht dir besser?",
      "choices": [
        "Reinweiß. Ich wirke frisch und klar",
        "Elfenbein oder Creme. Weiß wirkt hart an mir",
        "Ehrlich gesagt sehe ich keinen Unterschied"
      ]
    },
    {
      "q": "Welche dunkle Basisfarbe steht dir direkt am Gesicht am besten?",
      "choices": [
        "Tiefschwarz. Klar und markant",
        "Schokobraun oder Camel",
        "Weiches Anthrazit oder Navy. Schwarz wirkt schwer",
        "Keine davon: Creme oder helles Beige steht mir besser"
      ]
    },
    {
      "q": "Was ist deine natürliche Haarfarbe (oder wie war sie als Kind)?",
      "choices": [
        "Sehr dunkel, fast schwarz",
        "Mittel- bis dunkelbraun mit rötlichem oder goldenem Schimmer",
        "Weiches Aschbraun oder Straßenköterblond",
        "Hell: goldbraun, rotblond oder blond"
      ]
    },
    {
      "q": "Wie würdest du deine Augen beschreiben?",
      "choices": [
        "Dunkel und intensiv, mit sehr klarem Augenweiß",
        "Warmes Haselnuss, Bernstein oder Goldbraun",
        "Weiches Graubraun oder Graugrün, sanft verlaufend",
        "Hell und funkelnd, mit klarem dunklem Rand um die Iris"
      ]
    },
    {
      "q": "Für welche Kleiderfarben bekommst du die meisten Komplimente?",
      "choices": [
        "Leuchtende Farben wie Kobaltblau oder Pink",
        "Sanfte, pudrige Töne wie Altrosa oder Salbei",
        "Helle, luftige Pastelltöne",
        "Satte, dunkle Töne wie Burgunder oder Tannengrün"
      ]
    },
    {
      "q": "Wie stark ist der Kontrast zwischen deinen Haaren und deiner Haut?",
      "choices": [
        "Hoch. Meine Haare heben sich deutlich von der Haut ab",
        "Irgendwo in der Mitte",
        "Niedrig und hell. Beides ist zart und hell",
        "Niedrig und dunkel. Beides ist satt und ähnlich im Ton"
      ]
    },
    {
      "q": "Ungeschminkt wirken deine Lippen und Wangen…",
      "choices": [
        "Rosig",
        "Pfirsichfarben oder koralle",
        "Blass und beige, ohne viel Farbe",
        "Von Natur aus dunkel, fast beerenfarben"
      ]
    },
    {
      "q": "Welche Rougefarbe wirkt an dir am natürlichsten?",
      "choices": [
        "Pfirsich oder Koralle",
        "Babyrosa oder Rosé",
        "Terrakotta oder sanftes Ziegelrot",
        "Beere oder Pflaume"
      ]
    },
    {
      "q": "Welche Stimmung passt im Spiegel am meisten zu dir?",
      "choices": [
        "Sonnig und frisch, wie Limonade beim Picknick",
        "Luftig und zart, wie Lavendel im Morgennebel",
        "Gemütlich und satt, wie Gewürztee am Kamin",
        "Klar und dramatisch, wie Großstadtlichter bei Nacht"
      ]
    }
  ],
  "types": {
    "springlight": {
      "name": "Heller Frühling",
      "word": "heller frühling",
      "vibe": "Warm, zart und voller Morgenlicht.",
      "desc": "Deine Farben sind warm, aber sanft, mit einem leichten goldenen Schimmer und kaum harten Kontrasten. Helle, klare, leicht warme Töne lassen deine Haut frisch und ausgeruht wirken, während schwere oder sehr dunkle Farben eher auf dir liegen, statt zu dir zu gehören. Denk an Pfirsich, Buttergelb, helles Aqua und warmes Rosa: Farben, die aussehen, als hätte man Sonnenschein hineingemischt.",
      "keywords": ["Warm", "Hell", "Frisch"],
      "makeup": "Rouge in Pfirsich oder Apricot, ein transparenter Lippenstift in Koralle oder warmem Rosa und Kajal in weichem Braun oder Bronze statt Schwarz.",
      "hair": "Goldblond, Honigblond oder helles Karamellbraun. Meide sehr dunkle oder aschige Töne, die einen Schatten aufs Gesicht werfen.",
      "jewelry": "Helles Gelbgold, Roségold und filigrane Stücke. Perlen in warmem Creme stehen dir wunderbar."
    },
    "springbright": {
      "name": "Klarer Frühling",
      "word": "klarer frühling",
      "vibe": "Warm, klar und voller Funkeln.",
      "desc": "Du hast warme Farben mit einer lebendigen, klaren Ausstrahlung, oft mit strahlenden Augen und frischem Kontrast. Satte, sonnige Farben wecken dein Gesicht auf, während staubige oder vergraute Töne dich müde aussehen lassen. Koralle, Mandarine, Sonnenblumengelb, Türkis und Grasgrün sind dein Spielplatz. Du kannst Farbe in kräftigen Dosen tragen und siehst trotzdem aus wie du selbst.",
      "keywords": ["Warm", "Klar", "Leuchtend"],
      "makeup": "Lippenstift in Koralle oder warmem Rot, ein klares Pfirsich-Rouge und ein Hauch Schimmer. Warmbrauner oder petrolfarbener Eyeliner setzt Akzente.",
      "hair": "Warmes Goldbraun, Kupfer oder leuchtendes Kastanienbraun. Glänzende, warme Strähnen stehen dir besser als flache, aschige Farbe.",
      "jewelry": "Poliertes Gelbgold, bunte Emaille und leuchtende Steine. Glänzende Oberflächen schlagen bei dir matte."
    },
    "summerlight": {
      "name": "Heller Sommer",
      "word": "heller sommer",
      "vibe": "Kühl, sanft und luftig wie ein klarer Himmel.",
      "desc": "Deine Farben sind hell und kühl, mit rosigem oder neutralem Unterton und einem insgesamt weichen Look. Kühle Pastelltöne und sanfte Mitteltöne lassen deine Haut ebenmäßig und strahlend wirken, während sehr dunkle, sehr warme oder Neonfarben dich überdecken können. Puderblau, Lavendel, zartes Rosa und Mint sind deine sicheren Treffer. Denk an Farben, in die ein wenig Weiß und ein wenig Blau gemischt wurde.",
      "keywords": ["Kühl", "Hell", "Sanft"],
      "makeup": "Rouge in Rosé oder Babyrosa, ein transparenter Lippenstift in Rosa oder Mauve und Kajal in Taupe oder weichem Grau.",
      "hair": "Aschblond, helles Aschbraun oder sanftes Beigeblond. Kräftige Gold- oder Orangetöne können mit deiner Haut konkurrieren.",
      "jewelry": "Silber, Weißgold und Platin, dazu Perlen, Mondstein oder hellblaue Steine."
    },
    "summermute": {
      "name": "Sanfter Sommer",
      "word": "sanfter sommer",
      "vibe": "Kühl, ruhig und leise elegant.",
      "desc": "Deine Farben sind kühl bis neutral und natürlich verschmolzen, mit wenig Kontrast zwischen Haaren, Haut und Augen. Staubige, vergraute Töne lassen dich gepflegt und gelassen wirken, während sehr leuchtende oder sehr warme Farben neben deinem Gesicht laut erscheinen. Mauve, Altrosa, Schieferblau, Salbei und sanftes Pflaume sind deine Signatur. Ton-in-Ton-Outfits wirken an dir besonders edel.",
      "keywords": ["Kühl", "Gedämpft", "Ruhig"],
      "makeup": "Lippenstift in Altrosa oder Mauve, ein zartes Rosé-Rouge und Kajal in Graubraun oder Pflaume für sanfte Kontur.",
      "hair": "Aschbraun, kühles Pilzbraun oder sanftes Aschblond. Meide messingartiges Gold und sehr dunkles, hartes Schwarz.",
      "jewelry": "Gebürstetes Silber, Weißgold und weiches Zinn. Matte Oberflächen und graue Perlen passen perfekt zu dir."
    },
    "autumnmute": {
      "name": "Sanfter Herbst",
      "word": "sanfter herbst",
      "vibe": "Warm, sanft und zart golden.",
      "desc": "Deine Farben sind warm und verschmolzen, mit erdiger Weichheit und kaum harten Kontrasten. Gedämpfte, warme Töne wirken an dir natürlich und hochwertig, während eisige oder sehr leuchtende Farben dich blass machen können. Camel, Oliv, sanftes Terrakotta, warmes Taupe und Moosgrün sind deine besten Freunde. Mehrere sanfte, warme Neutraltöne zu kombinieren ist eine deiner Superkräfte.",
      "keywords": ["Warm", "Gedämpft", "Erdig"],
      "makeup": "Lippenstift in Nude-Pfirsich oder sanftem Ziegelrot, ein warmes Terrakotta-Rouge und Kajal in Braun oder Khaki.",
      "hair": "Sanftes Goldbraun, warmes Beige oder gedämpftes Karamell. Meide kühles Asch oder Blauschwarz, das dir die Wärme nimmt.",
      "jewelry": "Mattes oder gebürstetes Gold, Bronze und Holz, dazu warme Steine wie Bernstein oder Tigerauge."
    },
    "autumndeep": {
      "name": "Dunkler Herbst",
      "word": "dunkler herbst",
      "vibe": "Warm, satt und voller Tiefe.",
      "desc": "Du hast warme Farben mit echter Tiefe, oft dunkle Haare oder Augen und einen goldenen oder olivfarbenen Unterton. Satte, würzige, kräftige Erdtöne lassen dich stark und strahlend wirken, während Pastell- und Eistöne dich verwaschen aussehen lassen. Rost, Schokolade, Senf, Oliv und tiefes Petrol sind deine Power-Farben. Du kannst dunkle Töne tragen, ohne dass sie schwer an dir wirken.",
      "keywords": ["Warm", "Dunkel", "Satt"],
      "makeup": "Lippenstift in Ziegelrot, Zimt oder warmem Bordeaux, ein Rouge in Bronze oder Terrakotta und Kajal in Dunkelbraun oder Oliv.",
      "hair": "Sattes Schokobraun, Kastanie, Auburn oder dunkles Karamell. Sehr helle oder aschige Farben wirken losgelöst von deinem Gesicht.",
      "jewelry": "Antikes oder sattes Gelbgold, Kupfer und Bronze, dazu Granat, Tigerauge oder dunkelgrüne Steine."
    },
    "winterbright": {
      "name": "Klarer Winter",
      "word": "klarer winter",
      "vibe": "Kühl, leuchtend und unmöglich zu übersehen.",
      "desc": "Deine Farben sind kühl und klar, oft mit auffälligem Kontrast zwischen Haaren, Haut und Augen. Reine, juwelenhelle Farben und klares Schwarz-Weiß lassen dich markant und lebendig wirken, während gedämpfte, beige oder staubige Töne deinen Glanz trüben. Fuchsia, Kobalt, Smaragd, echtes Rot und Eisweiß sind deine Signatur. Du kannst die mutigste Farbe im Raum tragen.",
      "keywords": ["Kühl", "Klar", "Kontrastreich"],
      "makeup": "Lippenstift in echtem Rot, Fuchsia oder kühlem Pink, ein leuchtendes Rosé-Rouge und klarer schwarzer Eyeliner.",
      "hair": "Kühles Dunkelbraun, Blauschwarz oder ein sauberer kühler Ton. Warmes Karamell oder messingfarbene Strähnen wirken an dir schnell trüb.",
      "jewelry": "Poliertes Silber, Weißgold und Platin, dazu Diamanten, Saphire oder leuchtend farbige Steine."
    },
    "winterdeep": {
      "name": "Dunkler Winter",
      "word": "dunkler winter",
      "vibe": "Kühl, tief und leise dramatisch.",
      "desc": "Du hast tiefe Farben mit kühlem oder neutral-kühlem Unterton, oft dunkle Haare und dunkle Augen. Tiefe, kühle Töne und echtes Schwarz wirken an dir elegant und kraftvoll, während helle, warme Pastelltöne und Beige dich müde aussehen lassen. Schwarz, tintiges Marineblau, Pflaume, Burgunder, Tannengrün und Eisweiß als Kontrast ergeben deine ideale Garderobe.",
      "keywords": ["Kühl", "Tief", "Elegant"],
      "makeup": "Lippenstift in Beere, Weinrot oder dunkler Pflaume, ein kühles Rosé-Rouge und Eyeliner in Schwarz oder dunkler Pflaume.",
      "hair": "Tiefes Espresso, kühles Dunkelbraun oder weiches Schwarz. Helle Goldtöne können deine natürliche Tiefe verblassen lassen.",
      "jewelry": "Silber, Weißgold oder Gunmetal, dazu tiefe Steine wie Rubin, Amethyst oder Onyx."
    }
  }
};
