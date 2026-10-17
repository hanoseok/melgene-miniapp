/* Spending Personality Test (de)
 * 8 result ids (saver value flex impulse saverflex dealhunter quality balance); questions[i].choices[j] follow spend-core.js QUESTIONS[i].v[j] (the habit axis of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the user's own style mix and the real server share.
 * Placeholders: {name} {emoji} {vibe} {pct} {s} {v} {f} {i}. Entertainment only, not financial advice.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": "Geld-Typ-Test: Sparer oder Verschwender? Dein Ausgabestil",
    "description": "Geld-Typ-Test: Sparer oder Verschwender? 12 Alltagssituationen, 2 Minuten, ohne Anmeldung. Nur Spaß, keine Finanzberatung.",
    "ogTitle": "Geld-Typ-Test 💸 Wie gibst du dein Geld aus?",
    "ogDescription": "12 Alltagssituationen rund ums Geld, 2 Minuten. Sparer, Genießer oder Spontankäufer?"
  },
  "siteName": "Geld-Typ-Test",
  "privacyLink": "Datenschutzerklärung",
  "start": {
    "badge": "💸 Nur zum Spaß",
    "h1Kicker": "Geld-Typ-Test",
    "h1Html": "Was für ein <em>Geld-Typ</em><br>bist du?",
    "hook": "Zahltag, Angebote, Essen mit Freunden und vergessene Abos. Beantworte 12 Alltagssituationen ehrlich und lerne deinen eigenen Ausgabestil kennen.",
    "metaTime": "⏱️ 2 Min.",
    "metaCount": "🛍️ 12 Situationen",
    "start": "Mein Geld-Typ →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "F{n}"
  },
  "loading": {
    "text": "Wir zählen dein Kleingeld…",
    "sub": "Deine Kassenbons werden gelesen, nur zum Spaß"
  },
  "result": {
    "title": "Mein Geld-Typ: {name}",
    "metaDesc": "Ergebnis des Geld-Typ-Tests: {name}. {vibe}",
    "eyebrow": "Dein Geld-Typ ist",
    "gaugeLabel": "Deine eigenen Antworten nach Typ",
    "axes": [
      "Sparer",
      "Schnäppchenjäger",
      "Genießer",
      "Spontan"
    ],
    "strengthsLabel": "Deine Stärken beim Geld",
    "weaknessLabel": "Pass auf bei",
    "tipLabel": "Spaßige Idee",
    "disclaimer": "Nur zur Unterhaltung. Dies ist keine Finanzberatung.",
    "sameShare": "{pct} % der Leute haben diesen Typ",
    "shareText": "Mein Geld-Typ: {name} {emoji} „{vibe}“ Und deiner?",
    "shareTextPct": "Mein Geld-Typ: {name} {emoji} (Sparer {s} % · Schnäppchen {v} % · Genießer {f} % · Spontan {i} %) Und deiner?",
    "ctaStrong": "Ein Freund hat seinen Geld-Typ geteilt",
    "ctaSub": "Sparer oder Verschwender? In 2 Minuten wissen.",
    "retry": "Test nochmal machen"
  },
  "og": {
    "eyebrow": "Mein Geld-Typ",
    "brand": "💸 Geld-Typ-Test",
    "defaultKicker": "Geld-Typ-Test",
    "defaultTitle": "Was für ein Geld-Typ bist du?",
    "defaultDesc": "12 Alltagssituationen rund ums Geld · 2 Minuten"
  },
  "faq": [
    {
      "q": "Wie wird mein Geld-Typ bestimmt?",
      "a": "Jede Antwort neigt zu einer von vier Geldgewohnheiten: sparen, Schnäppchen jagen, sich etwas gönnen oder spontan kaufen. Dein Ergebnis hängt davon ab, welche Gewohnheiten du am häufigsten gewählt hast und wie nah sie beieinander lagen. Dieselben Antworten ergeben immer dasselbe Ergebnis."
    },
    {
      "q": "Ist das Finanzberatung?",
      "a": "Nein. Es ist ein lockerer Persönlichkeitstest, der nur zum Spaß gemacht ist. Er sagt nichts über deine echten Finanzen aus und sollte nie als Grundlage für Geldentscheidungen dienen. Bei echten Finanzfragen wende dich an eine qualifizierte Fachperson."
    },
    {
      "q": "Gibt es einen guten oder schlechten Ausgabestil?",
      "a": "Nein. Jeder Stil hat Stärken und blinde Flecken, und die meisten Menschen mischen mehrere. Deine Antworten ändern sich auch mit Laune, Budget und Lebensphase, also probier es an einem anderen Tag nochmal."
    },
    {
      "q": "Werden meine Antworten gespeichert?",
      "a": "Nein. Deine Antworten werden in deinem Browser berechnet und nie gespeichert. Wir zählen nur anonym, welcher Typ herauskam, damit wir zeigen können, wie häufig jeder Typ ist."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Geld-Typ-Test",
    "description": "Datenschutzerklärung des Geld-Typ-Tests – wie wir Cookies, Werbung und anonyme Statistiken verwenden.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der Geld-Typ-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie unten beschrieben.",
    "sections": [
      [
        "1. Welche Daten wir erheben",
        "Du kannst den Dienst ohne Anmeldung nutzen. Deine Antworten und deine Typ-Mischung werden in deinem Browser berechnet und weder an unsere Server gesendet noch dort gespeichert. Wir zählen nur anonym, welches Ergebnis herauskam, damit wir zeigen können, wie häufig jedes Ergebnis ist."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers verwenden, um deine Sprache zu speichern, Werbung anzuzeigen und zu verstehen, wie der Dienst genutzt wird. Du kannst sie in den Einstellungen deines Browsers ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht richtig."
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
        "Diese Datenschutzerklärung gilt ab dem 18. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Geld-Typ-Test"
  },
  "questions": [
    {
      "q": "Dein Gehalt ist da. Was machst du als Erstes?",
      "choices": [
        "Etwas Schönes buchen, das ich schon länger im Auge habe",
        "Gleich einen guten Batzen aufs Sparkonto schieben",
        "Eine Shopping-App öffnen: „Das habe ich mir verdient“",
        "Schauen, welche Rechnungen und Abos anstehen, und den Rest planen"
      ]
    },
    {
      "q": "Ein Freund lädt dich in ein angesagtes, teures Restaurant ein.",
      "choices": [
        "Ein günstigeres Lokal oder Kochen zu Hause vorschlagen",
        "Super! Ich bestelle genau das, worauf ich Lust habe",
        "Bewertungen und Menüs checken, um dort das beste Angebot zu finden",
        "Sofort reservieren und an die Rechnung später denken"
      ]
    },
    {
      "q": "Deine Kopfhörer geben endgültig auf und du brauchst neue.",
      "choices": [
        "Wochenlang Tests und Preisverläufe vergleichen",
        "Das erste kaufen, das mir eine Werbung zeigt. In einer Minute erledigt",
        "So lange wie möglich warten, dann das günstigste ordentliche Paar kaufen",
        "Das Spitzenmodell nehmen, das sich toll anfühlt und lange hält"
      ]
    },
    {
      "q": "Dein Lieblingsgeschäft hat einen riesigen Ausverkauf.",
      "choices": [
        "Den Warenkorb füllen, bevor ich denken kann",
        "Nur kaufen, was schon auf meiner Liste stand",
        "Das hochwertige Teil schnappen, das endlich erschwinglich ist",
        "Vorbeigehen. Billig ist nur billig, wenn ich es brauche"
      ]
    },
    {
      "q": "Ein kostenloser Probemonat wird gleich zum bezahlten Abo.",
      "choices": [
        "Hab ich noch am Tag der Anmeldung gekündigt",
        "Ich behalte es. Gute Dienste sind es wert, bezahlt zu werden",
        "Ich stelle mir eine Erinnerung und entscheide, ob es sich lohnt",
        "Vergessen, und jetzt zahle ich für gleich mehrere"
      ]
    },
    {
      "q": "Kaffeepause im Büro.",
      "choices": [
        "Der Hausspezial-Kaffee meines Lieblingscafés, ohne Reue",
        "Kaffee von zu Hause, in der eigenen Thermotasse",
        "Ein Kaffee, ein Stück Kuchen und die süße Tasse an der Kasse",
        "Das Café mit den besten Gutscheinen und der Stempelkarte"
      ]
    },
    {
      "q": "Die Rechnung vom Essen mit Freunden kommt.",
      "choices": [
        "Ich lade spontan alle ein und frage mich später, wo das Geld geblieben ist",
        "Ich nutze eine Aufteil-App, damit es schnell und fair geht",
        "Ich gebe eine Runde aus, und wir bestellen noch Nachtisch",
        "Ich zahle genau das, was ich gegessen habe, auf den Cent"
      ]
    },
    {
      "q": "An der Kasse wird dir eine kleine Zugabe angeboten.",
      "choices": [
        "Nur, wenn das Set tatsächlich günstiger ist",
        "Ja, und die Süßigkeiten neben der Kasse auch",
        "„Nein, danke.“ Da muss ich nicht nachdenken",
        "Klar. Kleine Extras machen den Tag schöner"
      ]
    },
    {
      "q": "Du planst deinen Urlaub.",
      "choices": [
        "Eine Tabelle und Vergleichsportale für das beste Preis-Leistungs-Verhältnis",
        "Ich buche heute Abend einen Flug, weil der Preis gut aussah",
        "Nebensaison, günstige Unterkunft, kostenlose Aktivitäten",
        "Ein richtig schönes Hotel. Die Reise ist meine Belohnung"
      ]
    },
    {
      "q": "Am Monatsende öffnest du deine Banking-App.",
      "choices": [
        "Moment, wo ist das alles hin?",
        "Ich sortiere alles nach Kategorien und passe den nächsten Monat an",
        "Ich weiß, wohin es ging, und es war es wert",
        "Der Kontostand sieht gut aus und ich bin heimlich stolz"
      ]
    },
    {
      "q": "Du fängst ein neues Hobby an.",
      "choices": [
        "Gleich Profi-Ausrüstung. Wenn schon, denn schon",
        "Ausrüstung leihen und mit kostenlosen Videos lernen",
        "Ausrüstung, Bücher, Kurse und ein süßes Outfit, alles in der ersten Woche",
        "Das Einsteigerset mit den besten Bewertungen kaufen"
      ]
    },
    {
      "q": "Welcher Satz klingt am meisten nach dir?",
      "choices": [
        "„Jeder gesparte Euro zählt“",
        "„Man lebt nur einmal“",
        "„Warum mehr zahlen für das Gleiche?“",
        "„Im Moment fühlte es sich einfach richtig an“"
      ]
    }
  ],
  "types": {
    "saver": {
      "name": "Sparfuchs-Profi",
      "word": "sparfuchs",
      "vibe": "Jeder Cent hat einen Job, und deine kommen immer pünktlich zur Arbeit.",
      "desc": "Du weißt gern, wo dein Geld ist und wofür es da ist. Du bringst dein Mittagessen ohne Murren mit, entdeckst kleine Geldlöcher und spürst ein stilles Kribbeln, wenn die Zahl auf deinem Konto steigt. Freunde rufen dich an, wenn sie wissen wollen, ob sich etwas wirklich lohnt, und du gibst ihnen eine ehrliche Antwort. Deine ruhigen, verlässlichen Gewohnheiten machen die Zukunft weniger beängstigend.",
      "strengths": [
        "Geduldig und diszipliniert",
        "Erkennt Verschwendung schnell",
        "Gelassen bei der Zukunft"
      ],
      "weakness": "Du sagst manchmal Nein zu Dingen, die dich wirklich glücklich gemacht hätten, und fühlst dich dann ausgeschlossen.",
      "tip": "Such dir jeden Monat eine kleine Belohnung, die ganz ohne schlechtes Gewissen dir gehört. Genießen gehört zum Plan."
    },
    "value": {
      "name": "Schnäppchen-Detektiv",
      "word": "detektiv",
      "vibe": "Erst vergleichen, dann kaufen.",
      "desc": "Du recherchierst vor dem Kauf: Tests, Preisverlauf, das andere Browserfenster, der andere Laden. Das beste Angebot zu finden fühlt sich an wie ein kleines Rätsel, und du verrätst die Lösung gern weiter. Du bist nicht geizig, nur allergisch gegen Überzahlen. Leute vertrauen deinen Empfehlungen, weil du die Hausaufgaben schon gemacht hast.",
      "strengths": [
        "Starker Recherchierer",
        "Vergleicht gelassen",
        "Teilt hilfreiche Funde"
      ],
      "weakness": "Vergleichen kann länger dauern, als die Sache wert ist, und manchmal verpasst du den richtigen Moment.",
      "tip": "Setz dir ein Zeitlimit für die Recherche. Das beste Angebot ist auch das, über das du dich wirklich freust."
    },
    "flex": {
      "name": "Hauptrollen-Spender",
      "word": "hauptrollen",
      "vibe": "Behandelt den Alltag wie eine Premiere.",
      "desc": "Du glaubst, dass schöne Momente schöne Dinge verdienen: das gute Essen, das Konzertticket, das Geschenk, bei dem jemand die Luft anhält. Du gibst bewusst und ohne viel Schuldgefühl aus, und deine Großzügigkeit steckt an. Freunde sind gern bei dir, weil du aus gewöhnlichen Abenden Anlässe machst. Du lebst im Moment und lässt ihn funkeln.",
      "strengths": [
        "Großzügig und lustig",
        "Schafft unvergessliche Momente",
        "Weiß, was du liebst"
      ],
      "weakness": "Große Momente können die leisen, unspektakulären verdrängen, die später wichtig werden.",
      "tip": "Trag auch eine kleine Belohnung für dein zukünftiges Ich in den Kalender ein. Das macht das Genießen noch süßer."
    },
    "impulse": {
      "name": "Spontankauf-Held",
      "word": "spontankauf",
      "vibe": "Der Warenkorb füllt sich schneller, als der Gedanke ankommt.",
      "desc": "Du folgst deinem Funken. Ein süßes Teil, gute Laune oder die Begeisterung eines Freundes, und schon ist etwas auf dem Weg zu dir. Diese Spontaneität ist Teil deines Charmes: Du probierst Neues aus, sagst Ja zu Abenteuern, und dein Leben ist selten langweilig. Deine Regale sind voller Geschichten, auch der, die mit „Das musste einfach sein“ begannen.",
      "strengths": [
        "Spontan und neugierig",
        "Sagt Ja zum Abenteuer",
        "Verbreitet gute Energie"
      ],
      "weakness": "Manche Käufe verblassen schnell, und der Kontoauszug am Monatsende überrascht dich.",
      "tip": "Probier einen „Vielleicht-Warenkorb“ für eine Nacht. Wenn du morgen noch lächelst, ist es ein echtes Ja."
    },
    "saverflex": {
      "name": "Erst-Sparen-dann-Prassen-Kombi",
      "word": "prassen",
      "vibe": "Monatelang vorsichtig, dann ein glorreiches Ja.",
      "desc": "Meistens bist du der Vorsichtige: die Gutscheine, das mitgebrachte Essen, das „Jetzt nicht“. Aber du sparst mit Ziel, und wenn der Tag kommt, gönnst du dir genau das, was du wirklich wolltest, ohne Entschuldigung. Eine überraschende Mischung: sparsam und dramatisch. Leute staunen oft, wie groß dein einziges Ja sein kann.",
      "strengths": [
        "Spart mit Ziel",
        "Genießt Käufe voll und ganz",
        "Weiß, was wichtig ist"
      ],
      "weakness": "Das lange Warten kann den großen Wurf zu groß wirken lassen, und danach schleicht sich vielleicht ein schlechtes Gewissen ein.",
      "tip": "Gib deiner großen Belohnung einen Namen und ein Datum. Die Vorfreude ist der halbe Spaß."
    },
    "dealhunter": {
      "name": "Rabatt-Jäger",
      "word": "rabatt",
      "vibe": "An einem guten Angebot gehst du schwer vorbei.",
      "desc": "Preisnachlässe bringen dich zum Leuchten. Du liebst zeitlich begrenzte Aktionen, Sets und Gutscheincodes, die wirklich funktionieren, und schlägst schnell zu, wenn der Preis stimmt. Halb Detektiv, halb Abenteurer: Die Jagd selbst macht dir echte Freude. Freunde schreiben dir, wenn sie wissen wollen, ob ein Angebot den Hype wert ist.",
      "strengths": [
        "Scharfer Blick für Angebote",
        "Schnell und entschlossen",
        "Macht beim Shoppen Spaß"
      ],
      "weakness": "Ein toller Preis lässt dich vergessen zu fragen, ob du es überhaupt brauchst.",
      "tip": "Frag dich vor dem Klick: „Würde ich das auch zum vollen Preis wollen?“ Wenn ja, ist es ein echter Gewinn."
    },
    "quality": {
      "name": "Einmal-richtig-Käufer",
      "word": "einmal-richtig",
      "vibe": "Einmal etwas mehr ausgeben, jahrelang Freude haben.",
      "desc": "Du wählst sorgfältig und wählst gut. Du hast lieber eine großartige Jacke als fünf durchschnittliche und achtest darauf, wie sich Dinge anfühlen, halten und in dein Leben passen. Du recherchierst gerade genug, um sicher zu sein, und entscheidest dich dann ohne Reue. Deine Sachen sehen meist gut aus und bleiben gut, und darauf bist du zu Recht stolz.",
      "strengths": [
        "Überlegt und wählerisch",
        "Schätzt Handwerk und Haltbarkeit",
        "Bereut selten einen Kauf"
      ],
      "weakness": "Die „beste“ Option ist schwer zu finden, und das Warten darauf kann dich ausbremsen.",
      "tip": "Gut genug ist manchmal großartig. Erlaub dir, das schöne Teil schon jetzt zu genießen."
    },
    "balance": {
      "name": "Ausgeglichener Haushalter",
      "word": "ausgeglichener",
      "vibe": "Nicht zu geizig, nicht zu wild. Genau richtig.",
      "desc": "Du mischst von allem ein bisschen. Du kannst sparen, wenn es zählt, clever einkaufen, wenn es hilft, dir etwas gönnen, wenn es passt, und hin und wieder spontan zuschlagen. Das macht dich unkompliziert beim Shoppen, Reisen und Rechnung teilen. Leute fühlen sich bei deinem Umgang mit Geld entspannt, weil er flexibel und freundlich ist.",
      "strengths": [
        "Flexibel und entspannt",
        "Passt sich jeder Situation an",
        "Leicht, mit dir die Rechnung zu teilen"
      ],
      "weakness": "Ohne feste Regel können kleine Entscheidungen unbemerkt abdriften.",
      "tip": "Such dir eine winzige Gewohnheit, die du magst, und mach sie zu deinem Anker. Der Rest darf flexibel bleiben."
    }
  }
};
