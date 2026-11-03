/* Enneagramm-Test (de) — German, du
 * 9 result ids (type1 … type9); questions[i].choices[j] follow enneagram-core.js QUESTIONS[i].c[j]
 * (the center or stance value of each choice; the one "softer" choice per question scores 1 point instead of 2).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the type number comes from result.typeNum, the only other number is the real server share ({pct}).
 * Kind, non-judgmental wording: every type has gifts and blind spots, nobody is only one type, and people grow.
 * Just for fun and self-reflection — not an official assessment (such as the RHETI) and not a diagnosis.
 * Quotes: „…“.
 * Placeholders: {n} {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "auto"
  },
  "meta": {
    "title": "Enneagramm-Test: Welcher Enneagramm-Typ bin ich?",
    "description": "Kostenloser Enneagramm-Test: 12 kurze Alltagsfragen, etwa 2 Minuten, ohne Anmeldung. Finde deinen Typ, deine Grundmotivation, deine Stärken und Tipps fürs Wachsen.",
    "ogTitle": "Enneagramm-Test 🔷 Welcher Typ bist du?",
    "ogDescription": "Zwölf Alltagsfragen dazu, wie du reagierst, entscheidest und auftankst. Entdecke deinen Enneagramm-Typ, was dich antreibt und wie du wächst."
  },
  "siteName": "Enneagramm-Test",
  "privacyLink": "Datenschutzerklärung",
  "start": {
    "badge": "🔷 Neun Blicke auf die Welt",
    "h1Kicker": "Enneagramm-Test",
    "h1Html": "Was treibt dich<br><em>wirklich</em> an?",
    "hook": "Manche gehen voran, manche sorgen für Frieden, manche durchschauen still und leise alles. Das Enneagramm beschreibt neun Arten, die Welt zu sehen, und was Menschen sich am meisten wünschen. Beantworte zwölf kurze Fragen aus dem Alltag und lerne deinen Typ kennen.",
    "metaTime": "⏱️ 2 Min.",
    "metaCount": "✨ 12 Fragen",
    "start": "Meinen Typ finden →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "Frage {n}"
  },
  "loading": {
    "text": "Wir verbinden die Punkte…",
    "sub": "Wir suchen deinen Platz auf dem Kreis"
  },
  "result": {
    "title": "Enneagramm-Typ {n}: {name}",
    "metaDesc": "Ergebnis im Enneagramm-Test: Typ {n}, {name}. {vibe} Entdecke deine Grundmotivation, deine Stärken und drei Tipps fürs Wachsen.",
    "eyebrow": "Dein Enneagramm-Typ",
    "typeNum": "Typ {n}",
    "desireLabel": "Tief im Inneren willst du",
    "fearLabel": "Was du zu vermeiden versuchst",
    "gaugeLabel": "Wohin deine Antworten tendierten",
    "centerLabel": "Deine Energie startet im…",
    "centers": ["Bauch", "Herz", "Kopf"],
    "stanceLabel": "Was du brauchst, holst du dir, indem du…",
    "stances": ["Nach vorne gehst", "Das Richtige tust", "Dich zurückziehst"],
    "strengthsLabel": "Deine Stärken",
    "tipsLabel": "Tipps fürs Wachsen",
    "growthLabel": "Wenn du wächst, lernst du von",
    "disclaimer": "Nur zum Spaß und zur Selbstreflexion. Dieses kurze Quiz ist kein offizieller Enneagramm-Test wie der RHETI und auch kein psychologischer Test oder eine Diagnose. Die meisten Menschen erkennen sich in mehreren Typen wieder, also sieh dein Ergebnis als Ausgangspunkt, nicht als Etikett.",
    "sameShare": "{pct} % der Leute haben diesen Typ",
    "shareText": "Ich bin Enneagramm-Typ {n}, {name} {emoji} „{vibe}“ Welcher Typ bist du?",
    "ctaStrong": "Jemand hat seinen Enneagramm-Typ geteilt",
    "ctaSub": "Was treibt dich an? Finde es in 2 Minuten heraus.",
    "retry": "Test wiederholen"
  },
  "og": {
    "eyebrow": "Mein Enneagramm-Typ",
    "brand": "🔷 Enneagramm-Test",
    "defaultKicker": "Ein kurzes Persönlichkeitsquiz",
    "defaultTitle": "Welcher Enneagramm-Typ bin ich?",
    "defaultDesc": "12 Fragen · 2 Minuten · was dich antreibt"
  },
  "faq": [
    {
      "q": "Wie wird mein Typ bestimmt?",
      "a": "Die Hälfte der Fragen schaut darauf, wo deine Energie meist zuerst entsteht: in deinem Körper und Instinkt, in deinen Gefühlen oder in deinem Denken. Die andere Hälfte schaut darauf, wie du dir normalerweise holst, was du brauchst. Dein Typ liegt dort, wo sich beide Antworten treffen, und gleiche Antworten ergeben immer dasselbe Ergebnis."
    },
    {
      "q": "Ist das der offizielle Enneagramm-Test?",
      "a": "Nein. Es ist ein kurzes Quiz zum Spaß und zur Selbstreflexion, kein offizielles oder wissenschaftlich geprüftes Verfahren wie der RHETI und keine psychologische Diagnose. Wenn dein Ergebnis nicht passt, lies auch über die benachbarten Typen. Viele Menschen finden ihren Typ erst nach einigem Nachdenken."
    },
    {
      "q": "Kann sich mein Typ ändern?",
      "a": "Nach der Enneagramm-Lehre bleibt dein Grundtyp ziemlich stabil, aber wie du ihn lebst, verändert sich stark mit Stress, Stimmung und persönlicher Entwicklung. Auch deine Antworten im Quiz können sich verschieben. Mach den Test in ein paar Monaten noch einmal und schau, ob derselbe Typ herauskommt."
    },
    {
      "q": "Werden meine Antworten gespeichert?",
      "a": "Nein. Deine Antworten werden in deinem Browser berechnet und nicht gespeichert. Wir zählen nur anonym, welcher Typ herauskam, damit wir zeigen können, wie häufig er ist."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Enneagramm-Test",
    "description": "Datenschutzerklärung des Enneagramm-Tests: Wie wir Cookies, Werbung und anonyme Statistiken verwenden.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der Enneagramm-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie unten beschrieben.",
    "sections": [
      [
        "1. Welche Informationen wir erheben",
        "Du kannst den Dienst ohne Anmeldung und ohne Login nutzen. Deine Antworten werden in deinem Browser berechnet und niemals an unsere Server gesendet oder dort gespeichert. Wir zählen nur anonym, welches Ergebnis herauskam, damit wir zeigen können, wie häufig jedes Ergebnis ist."
      ],
      [
        "2. Cookies und ähnliche Technologien",
        "Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um sich deine Sprache zu merken, Werbung anzuzeigen und zu verstehen, wie der Dienst genutzt wird. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; dann funktionieren manche Funktionen eventuell nicht richtig."
      ],
      [
        "3. Werbung (Google AdSense)",
        "Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche dieser und anderer Websites auszuspielen. Mehr dazu und die Einstellungen zur Anzeigenpersonalisierung findest du in den <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Google-Anzeigeneinstellungen</a>."
      ],
      [
        "4. Statistiken",
        "Wir speichern anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Diese Summen lassen keine Rückschlüsse auf dich persönlich zu."
      ],
      [
        "5. Kontakt",
        "Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website."
      ],
      [
        "6. Gültig ab",
        "Diese Erklärung gilt ab dem 4. November 2026."
      ]
    ],
    "back": "← Zurück zum Enneagramm-Test"
  },
  "questions": [
    {
      "q": "Du kommst auf eine Party, auf der du kaum jemanden kennst. Was machst du zuerst?",
      "choices": [
        "Die Stimmung erspüren und dahin gehen, wo was los ist",
        "Schauen, wer freundlich wirkt, und wie ich rüberkomme",
        "Kurz im Hintergrund bleiben und herausfinden, wie es hier läuft",
        "Mir was zu trinken holen und einfach ins Gespräch springen"
      ]
    },
    {
      "q": "Bei einem Gruppenprojekt wirst du ganz von selbst…",
      "choices": [
        "Die Führung übernehmen und die Sache vorantreiben",
        "Meinen Teil übernehmen und ihn still auf meine Art erledigen",
        "Darauf achten, dass alle im Plan sind und nichts vergessen wird",
        "Die mutigste Idee einbringen und alle begeistern"
      ]
    },
    {
      "q": "Wenn du vor einer großen Entscheidung stehst, worauf verlässt du dich am meisten?",
      "choices": [
        "Wie es sich anfühlt und was es für die Menschen bedeutet, die mir wichtig sind",
        "Recherche, eine Pro-und-Contra-Liste und einen Plan B",
        "Ein Gespräch mit jemandem, der mir nahesteht, bis es sich richtig anfühlt",
        "Mein Bauchgefühl. Meistens weiß ich es einfach."
      ]
    },
    {
      "q": "Wenn du etwas wirklich willst, dann…",
      "choices": [
        "Frage ich erst, ob es für die Menschen um mich herum okay ist",
        "Gehe ich direkt darauf los",
        "Träume ich lange davon, bevor ich etwas unternehme",
        "Arbeite ich hart, mache es richtig und vertraue darauf, dass es sich auszahlt"
      ]
    },
    {
      "q": "Was bringt dich an einem schlechten Tag am meisten aus dem Gleichgewicht?",
      "choices": [
        "Nicht zu wissen, was als Nächstes kommt",
        "Herumkommandiert zu werden oder wenn etwas unfair ist",
        "Mich nicht geschätzt oder übersehen zu fühlen",
        "Zu viele offene Baustellen und niemand mit einem klaren Plan"
      ]
    },
    {
      "q": "Nach einer langen, vollen Woche sieht Auftanken für dich so aus…",
      "choices": [
        "Zeit für mich allein, Handy aus, in meiner eigenen Welt",
        "Ein neuer Plan: eine Reise, ein Abend unterwegs, etwas Großes",
        "Ein gemütlicher Tag, an dem ich absolut nichts tue",
        "Meine To-do-Liste abarbeiten, damit ich endlich richtig abschalten kann"
      ]
    },
    {
      "q": "Du steckst in einer Schlange fest, die sich nicht bewegt. Du…",
      "choices": [
        "Plauderst mit der Person neben dir oder schreibst jemandem",
        "Spürst es im Körper: unruhig, der Kiefer angespannt",
        "Rechnest aus, wie lange es dauert, und suchst eine schnellere Möglichkeit",
        "Gehst nach vorne, um zu sehen, was da eigentlich los ist"
      ]
    },
    {
      "q": "Jemand widerspricht dir vor anderen. Du…",
      "choices": [
        "Suchst einen fairen Mittelweg, mit dem alle leben können",
        "Hältst dagegen und vertrittst deinen Standpunkt",
        "Wirst still und denkst später allein darüber nach",
        "Ehrlich gesagt: Eine gute Diskussion macht dir irgendwie Spaß"
      ]
    },
    {
      "q": "Welches Kompliment würde dir den Tag versüßen?",
      "choices": [
        "„Du weißt immer, was wirklich los ist.“",
        "„Du hast so ein großes Herz.“",
        "„Du bist so echt. Du bleibst immer standhaft.“",
        "„Es gibt niemanden wie dich.“"
      ]
    },
    {
      "q": "Eine Regel, die für dich keinen Sinn ergibt…",
      "choices": [
        "Umgehe ich still und leise, ohne großes Aufheben",
        "Nervt mich, aber ich will niemanden enttäuschen",
        "Stelle ich laut infrage oder ignoriere sie einfach",
        "Befolge ich trotzdem, bis sie auf dem richtigen Weg geändert wird"
      ]
    },
    {
      "q": "Wenn jemand aus deinem Freundeskreis ein Problem hat, bist du die Person, die…",
      "choices": [
        "Einschreitet und etwas unternimmt",
        "Zuhört und dafür sorgt, dass sich niemand allein fühlt",
        "Hilft, alles durchzudenken und die Optionen zu sehen",
        "Recherchiert und herausfindet, wer helfen könnte"
      ]
    },
    {
      "q": "Ein freier Samstag ohne jeden Plan. Am wahrscheinlichsten…",
      "choices": [
        "Schreibe ich Leuten und sorge dafür, dass etwas passiert",
        "Tauche ich stundenlang in ein Buch, ein Spiel oder ein Hobby ab",
        "Erledige ich liegengebliebene Aufgaben oder helfe jemandem, der es braucht",
        "Lasse ich mich durch den Tag treiben und schaue, wohin er führt"
      ]
    }
  ],
  "types": {
    "type1": {
      "name": "Der Perfektionist",
      "word": "Perfektionist",
      "vibe": "Du siehst, wie Dinge besser sein könnten, und hältst dich still und konsequent daran.",
      "desire": "Gut und gerecht zu sein und die Dinge richtig zu machen",
      "fear": "Falsch zu liegen, nachlässig zu sein oder Dinge schleifen zu lassen",
      "desc": "Du trägst ein klares inneres Gespür für richtig und falsch in dir und bemerkst fast überall, was sich verbessern ließe. Du hältst deine Versprechen, übernimmst Verantwortung, und andere vertrauen dir, weil du meinst, was du sagst. Dieselben hohen Ansprüche können aber zu einem lauten inneren Kritiker werden, und es ärgert dich vielleicht, wenn anderen etwas weniger wichtig zu sein scheint. In deiner besten Form bist du prinzipientreu, geduldig und weise und weißt, dass „gut genug“ manchmal genau richtig ist.",
      "keywords": ["Prinzipientreu", "Zuverlässig", "Gründlich"],
      "strengths": ["Dinge ordentlich machen, auch wenn niemand hinschaut", "Für Gerechtigkeit eintreten", "Aus Chaos klare, machbare Pläne machen"],
      "tips": ["Achte auf deinen inneren Kritiker und antworte ihm so, wie es ein guter Freund tun würde.", "Lass jede Woche bewusst eine Sache unerledigt und sieh, dass die Welt trotzdem nicht untergeht.", "Mach Platz für Spiel. Ruhe und Spaß gehören zu einem guten Leben dazu und sind keine Belohnung dafür, dass alles erledigt ist."],
      "growth": "Wenn du wächst, wirst du lockerer und findest mehr Freude, Spontaneität und Leichtigkeit."
    },
    "type2": {
      "name": "Der Helfer",
      "word": "Helfer",
      "vibe": "Du merkst, was Menschen brauchen, bevor sie es sagen, und machst ihnen gern den Tag schöner.",
      "desire": "Geliebt und wirklich gebraucht zu werden",
      "fear": "Unerwünscht oder ungeliebt zu sein",
      "desc": "Du bist herzlich, großzügig und feinfühlig für andere. Du denkst an Geburtstage, bist da, wenn es darauf ankommt, und Freunde fühlen sich bei dir oft gesehen und umsorgt. Beziehungen stehen im Mittelpunkt deines Lebens. Weil du so sehr auf andere achtest, vergisst du manchmal deine eigenen Bedürfnisse, tust dich schwer mit einem Nein oder bist gekränkt, wenn deine Fürsorge nicht bemerkt wird. In deiner besten Form gibst du frei, ohne mitzuzählen, und lässt auch andere für dich sorgen.",
      "keywords": ["Herzlich", "Großzügig", "Fürsorglich"],
      "strengths": ["Dafür sorgen, dass sich Menschen willkommen und wertgeschätzt fühlen", "Erkennen, was jemand gerade jetzt braucht", "Enge, treue Freundschaften aufbauen"],
      "tips": ["Bevor du Ja sagst, frag dich, was du selbst heute brauchst.", "Lass dir helfen, auch bei Kleinigkeiten. Annehmen gehört zu einer engen Beziehung dazu.", "Sprich deine Bedürfnisse laut aus, statt zu hoffen, dass jemand sie errät."],
      "growth": "Wenn du wächst, richtest du einen Teil dieser Fürsorge nach innen und wirst ehrlicher mit deinen eigenen Gefühlen und Bedürfnissen."
    },
    "type3": {
      "name": "Der Macher",
      "word": "Macher",
      "vibe": "Du setzt dir ein Ziel, findest den schnellsten Weg dorthin und nimmst alle mit.",
      "desire": "Dich wertvoll zu fühlen und erfolgreich zu sein",
      "fear": "Wertlos zu sein oder zu scheitern",
      "desc": "Du bist ehrgeizig, anpassungsfähig und voller Energie. Du weißt, wie man Ziele setzt, eine Situation liest und Ergebnisse erzielt, und andere lassen sich oft von deinem Selbstvertrauen und deinem Antrieb mitreißen. Du willst wachsen, besser werden und gut sein in dem, was du tust. Manchmal ist es aber verlockend, dich nur an deinen Erfolgen zu messen und weiterzurennen, auch wenn du müde bist. In deiner besten Form bist du nicht nur erfolgreich, sondern auch echt, und du weißt, dass du auch an einem ruhigen Tag wertvoll bist.",
      "keywords": ["Ehrgeizig", "Anpassungsfähig", "Inspirierend"],
      "strengths": ["Ideen in echte Ergebnisse verwandeln", "Ein Team motivieren und in Schwung halten", "Schnell lernen und sich an jede Umgebung anpassen"],
      "tips": ["Frag dich, was du wirklich willst, nicht nur, was gut aussieht.", "Plane echte Auszeiten ein und nimm sie so ernst wie eine Deadline.", "Erzähl jemandem, dem du vertraust, von einem Misserfolg oder Zweifel. Echtheit bringt dich anderen näher."],
      "growth": "Wenn du wächst, setzt du dich treuer für Menschen und Anliegen ein, die größer sind als dein eigener Erfolg."
    },
    "type4": {
      "name": "Der Individualist",
      "word": "Individualist",
      "vibe": "Du fühlst alles tief und willst, dass dein Leben etwas ganz Eigenes bedeutet.",
      "desire": "Du selbst zu sein und deinen eigenen Sinn zu finden",
      "fear": "Keine Identität zu haben oder gewöhnlich zu sein",
      "desc": "Du bist sensibel, kreativ und ehrlich im Umgang mit Gefühlen, denen andere oft ausweichen. Du siehst Schönheit und Bedeutung in kleinen Dingen und bist lieber authentisch, als dich anzupassen. Freunde kommen zu dir, wenn das Leben schwer wird, weil du keine Angst vor echten Gefühlen hast. Manchmal hast du das Gefühl, dass dir etwas fehlt oder dass es andere leichter haben, und Stimmungen können dich mitreißen. In deiner besten Form verwandelst du tiefe Gefühle in Kreativität und Mitgefühl und genießt, was in deinem Leben schon gut ist.",
      "keywords": ["Kreativ", "Authentisch", "Tiefgründig"],
      "strengths": ["Gefühle in Worten, Kunst oder Stil ausdrücken", "Anderen auch in schwierigen Gefühlen beistehen", "Schönheit und Bedeutung sehen, die andere übersehen"],
      "tips": ["Wenn dich eine Stimmung packt, benenne sie und tu trotzdem eine kleine praktische Sache.", "Führe eine Liste mit dem, was in deinem Leben schon gut ist, und ergänze sie oft.", "Erschaffe regelmäßig etwas, auch wenn es niemand sieht. Feste Gewohnheiten geben deinen Gefühlen ein Zuhause."],
      "growth": "Wenn du wächst, bringst du Struktur und Disziplin hinein und verwandelst Gefühle in beständige Arbeit, auf die du stolz bist."
    },
    "type5": {
      "name": "Der Beobachter",
      "word": "Beobachter",
      "vibe": "Du willst verstehen, wie alles funktioniert, am liebsten aus einer ruhigen Ecke heraus.",
      "desire": "Die Welt zu verstehen und kompetent zu sein",
      "fear": "Hilflos, überfordert oder ahnungslos zu sein",
      "desc": "Du bist neugierig, aufmerksam und unabhängig. Du vertiefst dich gern in ein Thema, bis du es wirklich verstehst, und bemerkst oft Details und Muster, die anderen entgehen. Deine Zeit, deine Energie und deine Privatsphäre sind dir wichtig, und du brauchst Raum zum Nachdenken, bevor du handelst oder etwas teilst. Manchmal bleibst du vielleicht etwas zu lange im Kopf oder ziehst dich zurück, wenn andere mehr verlangen, als du geben möchtest. In deiner besten Form teilst du dein Wissen großzügig und gehst mit Selbstvertrauen in die Welt hinaus.",
      "keywords": ["Neugierig", "Scharfsinnig", "Unabhängig"],
      "strengths": ["Klar denken, wenn andere in Panik geraten", "Tief lernen und komplexe Ideen erklären", "Sachlich und ruhig bleiben"],
      "tips": ["Teile dein Wissen, bevor es sich fertig anfühlt. Deine halb fertigen Ideen sind oft schon nützlich.", "Probiere Dinge mit Händen und Körper aus, nicht nur mit dem Kopf.", "Sag anderen, wenn du Zeit für dich brauchst, damit sie deine Ruhe nicht als Distanz verstehen."],
      "growth": "Wenn du wächst, kommst du vom Zuschauen ins Tun und handelst mit mehr Selbstvertrauen und Präsenz."
    },
    "type6": {
      "name": "Der Loyale",
      "word": "Loyale",
      "vibe": "Du bist die Person, die vorausdenkt, einen Plan hat und bleibt, wenn es darauf ankommt.",
      "desire": "Dich sicher, unterstützt und der Menschen um dich herum gewiss zu fühlen",
      "fear": "Ohne Halt oder Orientierung dazustehen",
      "desc": "Du bist treu, verantwortungsbewusst und erkennst schnell, was schiefgehen könnte. Das macht dich zu einem großartigen Planer und einem verlässlichen Freund. Du nimmst Verpflichtungen ernst, und deine Menschen und Gemeinschaften liegen dir sehr am Herzen. Weil du jedes Szenario durchdenkst, kann dein Kopf voller Zweifel sein, und es dauert manchmal, bis du anderen vertraust, oder dir selbst. In deiner besten Form bist du mutig und standfest und vertraust deinem eigenen Urteil genauso wie den Menschen, die du liebst.",
      "keywords": ["Treu", "Verantwortungsvoll", "Vorbereitet"],
      "strengths": ["Probleme früh erkennen und vorausplanen", "Freunden in guten wie in schlechten Zeiten beistehen", "Menschen für ein gemeinsames Ziel zusammenbringen"],
      "tips": ["Wenn sich Sorgen hochschaukeln, schreib auf, was gerade wirklich passiert, nicht was passieren könnte.", "Triff jeden Tag eine kleine Entscheidung, ohne jemanden zu fragen, und merke, dass es gut ausgeht.", "Erinnere dich an deine Erfahrungen. Du hast schon schwierige Dinge gemeistert."],
      "growth": "Wenn du wächst, entspannst du dich, vertraust dem Leben ein bisschen mehr und findest eine ruhige, stabile Mitte."
    },
    "type7": {
      "name": "Der Optimist",
      "word": "Optimist",
      "vibe": "Das Leben ist ein Abenteuer, und du willst jede Sorte auf der Karte probieren.",
      "desire": "Glücklich und frei zu sein und viele schöne Erlebnisse zu haben",
      "fear": "In Schmerz, Langeweile oder Grenzen gefangen zu sein",
      "desc": "Du bist fröhlich, neugierig und voller Ideen. Du findest in fast allem den Spaß, stehst schnell wieder auf, und deine Energie reißt alle um dich herum mit. Neue Orte, Pläne und Möglichkeiten begeistern dich. Weil schon das nächste Spannende wartet, fällt es dir manchmal schwer, lange bei einer Sache zu bleiben, oder bei schwierigen Gefühlen. In deiner besten Form verbindest du deine Lebensfreude mit Fokus und Tiefe und entdeckst, dass ganz im Moment zu sein sich noch besser anfühlen kann als der nächste Plan.",
      "keywords": ["Fröhlich", "Neugierig", "Spontan"],
      "strengths": ["Energie und Spaß in jede Gruppe bringen", "Schnell kreative Lösungen finden", "Nach Rückschlägen schnell wieder aufstehen"],
      "tips": ["Bring einen Plan zu Ende, bevor du den nächsten beginnst, und genieß dieses Gefühl.", "Wenn etwas wehtut, lass das Gefühl einen Moment zu, bevor du nach Ablenkung suchst.", "Gönn dir ab und zu eine langsame, stille Stunde. Ruhe kann ihr eigenes Abenteuer sein."],
      "growth": "Wenn du wächst, wirst du langsamer, konzentrierst dich tief und genießt ruhige, nachdenkliche Momente."
    },
    "type8": {
      "name": "Der Herausforderer",
      "word": "Herausforderer",
      "vibe": "Du sagst es geradeheraus, beschützt deine Leute und weichst keiner Herausforderung aus.",
      "desire": "Stark zu sein, dein Leben selbst in der Hand zu haben und andere zu schützen",
      "fear": "Kontrolliert, verletzt oder machtlos zu sein",
      "desc": "Du bist selbstbewusst, direkt und voller Energie. Du übernimmst das Ruder, wenn es chaotisch wird, setzt dich für Menschen ein, die sich nicht selbst wehren können, und andere fühlen sich sicher, wenn du auf ihrer Seite stehst. Ehrlichkeit ist dir wichtig, und du respektierst Stärke. Manchmal kann deine Intensität zu viel wirken, und vielleicht versteckst du weichere Gefühle, um nie verletzlich auszusehen. In deiner besten Form nutzt du deine Stärke, um andere aufzurichten, und lässt die Menschen, denen du vertraust, dein großes, warmes Herz sehen.",
      "keywords": ["Mutig", "Beschützend", "Direkt"],
      "strengths": ["In einer Krise entscheiden und die Führung übernehmen", "Menschen schützen, die unfair behandelt werden", "Ehrlich sprechen, wenn andere sich zurückhalten"],
      "tips": ["Bevor du Druck machst, stell noch eine Frage und hör dir die Antwort wirklich an.", "Zeig jemandem, dem du vertraust, deine weichere Seite. Das ist Stärke, keine Schwäche.", "Merke, wann du auf Hochtouren läufst, und wähle, welche Kämpfe wirklich wichtig sind."],
      "growth": "Wenn du wächst, öffnest du dein Herz und nutzt deine Stärke, um sanft für andere zu sorgen."
    },
    "type9": {
      "name": "Der Friedensstifter",
      "word": "Friedensstifter",
      "vibe": "Du bringst Ruhe, wohin du auch gehst, und siehst jede Seite einer Geschichte.",
      "desire": "Inneren Frieden und Harmonie mit anderen zu haben",
      "fear": "Konflikt, Verlust von Verbundenheit oder abgeschnitten zu sein",
      "desc": "Du bist gelassen, geduldig und annehmend. Du kannst viele Sichtweisen sehen, beruhigst angespannte Situationen, und Menschen fühlen sich bei dir entspannt und angenommen. Oft bist du der Kitt, der eine Gruppe zusammenhält. Weil du willst, dass alles friedlich bleibt, gehst du vielleicht mit anderen mit, schiebst deine eigenen Prioritäten auf oder sagst nicht, was du wirklich denkst. In deiner besten Form bist du standfest und präsent und weißt, dass deine Stimme und deine Wünsche genauso zählen wie die aller anderen.",
      "keywords": ["Ruhig", "Annehmend", "Unterstützend"],
      "strengths": ["Konflikte beruhigen und Menschen helfen, sich zu verstehen", "Zuhören, ohne zu urteilen", "Eine entspannte, einladende Atmosphäre schaffen"],
      "tips": ["Frag dich, was du willst, bevor du fragst, was andere wollen.", "Wähle jeden Morgen eine wichtige Aufgabe und erledige sie zuerst.", "Sag ehrlich deine Meinung, freundlich. Ein bisschen Reibung kann Beziehungen stärken."],
      "growth": "Wenn du wächst, erwachst du für deine eigenen Ziele und handelst mit Energie und Fokus."
    }
  }
};
