/* 집순이·집돌이 지수 테스트 — de
 * questions[i].choices[j] 는 homebody-core.js QUESTIONS[i].choices[j] 와 같은 순서(점수는 core 에만 있다). 키 구조는 en.js 와 동일.
 * Keys ending in Html are raw HTML (start.h1Html: <br> 1개 + <em> 만). 결과 단계 6종 id 는 homebody-core.js ORDER 와 같다.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep as-is when translating.
 * 스포일러 금지: meta / og.default* / start / faq / loading 에는 결과 이름·질문 문구를 인용하지 않는다.
 * fonts: css = Google Fonts, display = 제목/버튼 글꼴 스택, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap",
    "display": "'Comfortaa'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": "Stubenhocker-Test – Wie sehr bist du ein Stubenhocker?",
    "description": "Wie sehr bist du ein Stubenhocker? Mach diesen kostenlosen Stubenhocker-Test: 10 Alltagssituationen, etwa 1 Minute, ohne Anmeldung. Erfahre deinen Stubenhocker-Wert in Prozent.",
    "ogTitle": "Stubenhocker-Test 🏠 Wie sehr bist du ein Stubenhocker?",
    "ogDescription": "Ein kostenloser Test in 1 Minute. Beantworte 10 Alltagssituationen und erhalte deinen Prozentwert."
  },
  "siteName": "Stubenhocker-Test",
  "privacyLink": "Datenschutz",
  "start": {
    "badge": "🏠 Zuhause-Index",
    "h1Kicker": "Stubenhocker-Test",
    "h1Html": "Wie sehr bist du ein<br><em>Stubenhocker</em>?",
    "hook": "Zehn kleine Situationen zeigen dir, wie sehr du dein Zuhause liebst und wie viel Mühe sich die Welt draußen geben muss.",
    "metaTime": "⏱️ Etwa 1 Minute",
    "metaCount": "🛋️ 10 Fragen",
    "start": "Meinen Wert zeigen →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "F{n}"
  },
  "loading": {
    "text": "Deine Gemütlichkeitspunkte werden gezählt…",
    "sub": "Das Sofa wird geprüft"
  },
  "result": {
    "title": "Stubenhocker-Test: Ich bin {name}",
    "eyebrow": "Dein Stubenhocker-Typ ist",
    "strengthsLabel": "Deine Superkräfte",
    "othersLabel": "Wie andere dich sehen",
    "bestLabel": "Bestes Match",
    "clashLabel": "Gegenpol",
    "meterLabel": "Stubenhocker-Wert",
    "moreShare": "{pct} % der Spieler sind größere Stubenhocker als du",
    "shareText": "Ich bin {name} {emoji} – „{vibe}“ Wie sehr bist du Stubenhocker?",
    "shareTextPct": "Ich bin zu {pct} % Stubenhocker: {name} {emoji}. Und du?",
    "ctaStrong": "Ein Freund hat sein Ergebnis geteilt",
    "ctaSub": "Wie sehr bist du Stubenhocker? Dauert 1 Minute.",
    "retry": "Test wiederholen"
  },
  "og": {
    "eyebrow": "Mein Stubenhocker-Wert",
    "brand": "🏠 Stubenhocker-Test",
    "defaultKicker": "Stubenhocker-Test",
    "defaultTitle": "Wie sehr bist du ein Stubenhocker?",
    "defaultDesc": "10 Alltagssituationen · etwa 1 Minute"
  },
  "faq": [
    {
      "q": "Wie wird mein Stubenhocker-Wert berechnet?",
      "a": "Jede Antwort bringt 0 bis 10 Punkte in Richtung Zuhause. Die Punkte deiner zehn Antworten werden addiert und auf eine Skala von 0 bis 100 gestreckt. Je höher der Prozentwert, desto eher bleibst du lieber drinnen."
    },
    {
      "q": "Ist ein Stubenhocker dasselbe wie ein Introvertierter?",
      "a": "Nicht ganz. Introversion beschreibt, woher du Energie bekommst, Stubenhocker zu sein beschreibt, wo du deine Zeit am liebsten verbringst. Viele Extrovertierte lieben ihr Sofa und viele Introvertierte lange Spaziergänge."
    },
    {
      "q": "Ist dieser Test wissenschaftlich?",
      "a": "Nein. Es ist ein lockeres Quiz für Spaß und Gesprächsstoff, kein psychologischer Test. Das Ergebnis spiegelt nur deine heutigen Antworten."
    },
    {
      "q": "Wie entsteht „größerer Stubenhocker als X % der Spieler“?",
      "a": "Wir zählen anonym, in welchen Punktebereich jeder abgeschlossene Test fällt. Sobald mindestens 20 Ergebnisse vorliegen, vergleichen wir deines damit. Die Zeile erscheint nur bei deinem eigenen Ergebnis und bleibt verborgen, solange zu wenige mitgespielt haben."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Stubenhocker-Test",
    "description": "Datenschutzerklärung des Stubenhocker-Tests – Cookies, Werbung und anonyme Statistik.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der Stubenhocker-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die nötigsten Informationen, wie unten beschrieben.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen. Deine Antworten werden in deinem Browser ausgewertet und nie an unsere Server gesendet oder dort gespeichert. Wir zählen nur anonym, welcher Punktebereich herauskam, um zu zeigen, wie häufig jedes Ergebnis ist."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in deinen Browsereinstellungen ablehnen oder löschen; manche Funktionen arbeiten dann eventuell nicht richtig."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites zu schalten. Mehr dazu und Einstellungen in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistik",
        "Wir speichern anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Sie lassen keine Rückschlüsse auf deine Person zu."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 21. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Stubenhocker-Test"
  },
  "questions": [
    {
      "q": "Freitagabend, der Gruppenchat leuchtet auf: „Drinks in der Stadt?“",
      "choices": [
        "Mit „ein andermal“ antworten und glücklich nach Hause gehen",
        "Eine Stunde hingehen, dann heimlich verschwinden",
        "Gegenvorschlag: bei jemandem zu Hause mit Essen zum Mitnehmen",
        "Hingehen und bis zum Schluss bleiben"
      ]
    },
    {
      "q": "Ein langes Wochenende ohne Pläne. Dein idealer Plan?",
      "choices": [
        "Tasche packen und spontan losfahren",
        "Absichtlich keinen Schritt vor die Tür setzen",
        "Ein Tagesausflug, dann zurück ins eigene Bett",
        "Ein Café oder Park in der Nähe, dann nach Hause"
      ]
    },
    {
      "q": "Es klingelt, und du hast niemanden erwartet. Du…",
      "choices": [
        "Machst auf, ein bisschen überrascht",
        "Schaust erst durch den Türspion",
        "Freust dich: Spontanbesuche sind die besten",
        "Erstarrst und wartest, bis die Person geht"
      ]
    },
    {
      "q": "Wo würdest du am liebsten wohnen?",
      "choices": [
        "In einem ruhigen Zuhause mit meiner eigenen Ecke",
        "Mitten in einer lebhaften Großstadt",
        "In einem Nest, in dem alles in Reichweite ist",
        "In einer Wohnung mit schönem Balkon nah am Trubel"
      ]
    },
    {
      "q": "Regnerischer Sonntag. Was denkst du zuerst?",
      "choices": [
        "Bestes Wetter: Decke, Tee, Fenster",
        "Mist, alle Pläne fallen ins Wasser",
        "Endlich eine perfekte Ausrede, drinnen zu bleiben",
        "Na gut, ich suche mir etwas Drinnen aus"
      ]
    },
    {
      "q": "Ein Freund lädt dich zu einer Veranstaltung in zwei Wochen ein.",
      "choices": [
        "Ich schaue erst in meinen Kalender",
        "Ich überlege schon, wie ich elegant absage",
        "Ich bin dabei!",
        "Ich sage zu und fürchte mich, je näher es rückt"
      ]
    },
    {
      "q": "Du kommst nach einem ganzen Tag draußen heim. Du fühlst dich…",
      "choices": [
        "Noch voller Energie, bereit für mehr",
        "Angenehm müde",
        "Endlich: Tür zu, Handy auf lautlos",
        "Erleichtert, wie ein Akku, der lädt"
      ]
    },
    {
      "q": "Es ist Abendessenszeit. Wo willst du sein?",
      "choices": [
        "Zu Hause beim Kochen",
        "Draußen, aber an einem ruhigen kleinen Ort",
        "In einem belebten Restaurant voller Leute",
        "Auf dem Sofa mit Lieferessen und einer Serie"
      ]
    },
    {
      "q": "Wie viele Tage am Stück kannst du zu Hause bleiben, ohne dass dir die Decke auf den Kopf fällt?",
      "choices": [
        "Ein Tag reicht völlig",
        "Wochen, ohne es zu merken",
        "Etwa drei Tage",
        "Eine Woche, locker"
      ]
    },
    {
      "q": "Du hast etwas Geld übrig. Wofür gibst du es aus?",
      "choices": [
        "Einen Abend mit Freunden",
        "Tickets und Reisen",
        "Gadgets, Spiele oder Streaming für die Couch",
        "Mehr Gemütlichkeit: guter Sessel, Lampe, Bettwäsche"
      ]
    }
  ],
  "types": {
    "wild": {
      "name": "Geborener Draußenmensch",
      "vibe": "Zuhause ist, wo du die Tasche abstellst, bevor du wieder losziehst.",
      "desc": "Deine Haustür ist eine Drehtür. Ein Tag drinnen fühlt sich verschenkt an, und deine besten Ideen kommen auf einem Wanderweg, im Zug oder auf einer Terrasse. Du lädst dich bei Menschen und frischer Luft auf und sammelst Pläne, wie andere Tassen sammeln. Deine Wohnung ist vor allem ein Ort zum Schlafen, Duschen und Schuhewechseln.",
      "strengths": [
        "Endlose Energie",
        "Sagt Ja zum Abenteuer",
        "Nie gelangweilt"
      ],
      "others": "Andere sehen in dir den, der immer Pläne hat und alle vom Sofa holt."
    },
    "roamer": {
      "name": "Wochenend-Streuner",
      "vibe": "Öfter draußen als drinnen, aber Mittagsschlaf liebst du trotzdem.",
      "desc": "Du bist gern unterwegs, besonders mit Freunden, kennst aber auch das Glück eines früh endenden Abends. Deine Woche ist voller Pläne, und ein ruhiger Abend zu Hause ist eher Belohnung als Gewohnheit. Du magst Abwechslung: ein neues Café, ein Kurztrip, eine Straße, die du noch nie gegangen bist.",
      "strengths": [
        "Gesellig und neugierig",
        "Flexible Pläne",
        "Gut im Anfangen"
      ],
      "others": "Andere sehen dich als freundlich und lebhaft, immer für einen Kaffee zu haben, aber manchmal zum Aufladen verschwindend."
    },
    "switch": {
      "name": "Ausgewogener Wechsler",
      "vibe": "Halb Couch, halb Stadt, völlig anpassungsfähig.",
      "desc": "Du genießt einen lauten Abend draußen und einen stillen Abend drinnen mit demselben Lächeln. Keiner fühlt sich wie ein Opfer an; du spürst einfach deine Energie und folgst ihr. Das macht dich zu einem angenehmen Begleiter für Ausgehfreunde und Stubenhocker gleichermaßen. Deine einzige Frage: auf welche Seite du freitags hörst.",
      "strengths": [
        "Passt zu jedem Plan",
        "Spürt die eigene Energie",
        "Angenehme Gesellschaft"
      ],
      "others": "Andere sehen dich als entspannt und schwer festzulegen, der Freund, der zu jedem Plan passt."
    },
    "nester": {
      "name": "Gemütlicher Nestbauer",
      "vibe": "Glücklich mit Decke, Lampe und dem Plan, zu bleiben.",
      "desc": "Zu Hause bist du am meisten du selbst. Du hast es mit Absicht gemütlich gemacht: das richtige Licht, der richtige Sessel, die richtigen Snacks. Für wichtige Menschen gehst du raus, hältst Abende aber kurz und den Ausgang nah. Dein idealer Termin hat eine Anfangszeit, eine Endzeit und ein Sofa in der Nähe.",
      "strengths": [
        "Macht jeden Raum gemütlich",
        "Geht klug mit Energie um",
        "Toller Gastgeber daheim"
      ],
      "others": "Andere sehen dich als warm und ruhig, den Freund, bei dem alle gern abhängen."
    },
    "homebody": {
      "name": "Zertifizierter Stubenhocker",
      "vibe": "Deine besten Pläne sind die abgesagten.",
      "desc": "Du bist wirklich gern zu Hause und entschuldigst dich nicht mehr dafür. Dein Raum ist Ladestation, Hobbyzimmer und Zuflucht in einem. Einladungen bekommen erst eine höfliche Pause, und ein Wochenende ohne Termine fühlt sich wie ein Geschenk an. Du bist nicht ungesellig, du wählst deine Ausflüge nur sorgfältig.",
      "strengths": [
        "Glücklich allein",
        "Reiche Innenwelt",
        "Schützt deine Ruhe"
      ],
      "others": "Andere sehen dich als ruhig, ein wenig geheimnisvoll und überraschend witzig, sobald du in deinem Element bist."
    },
    "legend": {
      "name": "Legende des Zuhauses",
      "vibe": "Die Tür ist nur ein Vorschlag. Das Sofa ist ein Königreich.",
      "desc": "Du hast das Zuhausebleiben zur Kunst gemacht. Lieferdienste kennen deinen Namen, dein Setup ist optimiert und dein Sozialakku lädt in der Stille. Du kannst tagelang ohne die Außenwelt auskommen und bist völlig zufrieden. Gehst du doch raus, dann für etwas, das sich wirklich lohnt, und die Heimreise planst du schon vor dem Aufbruch.",
      "strengths": [
        "Meister der Gemütlichkeit",
        "Völlig autark",
        "Null FOMO"
      ],
      "others": "Andere sehen dich als Legende: selten gesichtet, immer entspannt und die Person für gute Serientipps."
    }
  }
};
