/* Berufstest (de) — Du-Form
 * 8 result ids (showrunner storyteller captain caretaker creator inventor builder analyst);
 * questions[i].choices[j] follow job-core.js QUESTIONS[i].w[j] (the [people/things, imagine/structure, out front/deep focus] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result, a suggested job or quote a question.
 * types.<id>.word = the result keyword as people would search it — only used by the spoiler check.
 * types.<id>.jobs = 4 real jobs that are common in this country (local names, no digits).
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Light and positive only. Just for fun — not a professional career assessment.
 * Placeholders: {name} {emoji} {vibe} {pct}.
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
    "title": "Berufstest: Welcher Beruf passt zu mir?",
    "description": "Mach den Berufstest: 11 kurze Fragen, etwa 2 Minuten, ohne Anmeldung. Finde heraus, wie du am liebsten arbeitest, was deine Stärken sind und welche Berufe passen könnten. Nur zum Spaß.",
    "ogTitle": "Berufstest 💼 Welcher Beruf passt zu mir?",
    "ogDescription": "Elf lockere Fragen dazu, wie du gern arbeitest. Entdecke deinen Arbeitsstil, deine Stärken und ein paar Berufe, die du dir ansehen könntest."
  },
  "siteName": "Berufstest",
  "privacyLink": "Datenschutzerklärung",
  "start": {
    "badge": "💼 Welcher Beruf passt?",
    "h1Kicker": "Berufstest",
    "h1Html": "Wo würdest du im Job<br><em>glänzen</em>?",
    "hook": "Die einen blühen im vollen Raum auf, die anderen in einer ruhigen Ecke mit einem kniffligen Rätsel. Beantworte elf Fragen aus dem Alltag und entdecke deinen Arbeitsstil, deine verborgenen Stärken und ein paar Berufe, die überraschend gut zu dir passen könnten.",
    "metaTime": "⏱️ 2 Min.",
    "metaCount": "✨ 11 Fragen",
    "start": "Meinen Stil finden →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "Frage {n}"
  },
  "loading": {
    "text": "Deine Antworten werden sortiert …",
    "sub": "Dein Stil trifft auf die Arbeitswelt"
  },
  "result": {
    "title": "Mein Arbeitsstil: {name}",
    "metaDesc": "Berufstest-Ergebnis: {name}. {vibe} Entdecke deine Stärken, Berufe, die zu dir passen könnten, und einen Tipp für deinen Arbeitsstil.",
    "eyebrow": "Deine Arbeitspersönlichkeit",
    "gaugeLabel": "Wohin deine Antworten tendierten",
    "axes": [
      ["Menschen", "Dinge & Ideen"],
      ["Fantasie", "Struktur"],
      ["Im Rampenlicht", "Tiefer Fokus"]
    ],
    "jobsLabel": "Berufe zum Entdecken",
    "strengthsLabel": "Deine Stärken",
    "envLabel": "Hier blühst du auf",
    "watchLabel": "Pass auf bei",
    "tipLabel": "Tipp für deinen Arbeitsstil",
    "buddyLabel": "Traum-Kollege",
    "rivalLabel": "Gegenstil",
    "disclaimer": "Nur zum Spaß. Das ist ein lockeres Quiz und kein professioneller Eignungstest. Die Berufe sind Anregungen zum Entdecken, keine Beratung, und du kannst auch auf ganz anderen Wegen glücklich werden.",
    "sameShare": "{pct} % der Leute haben diesen Arbeitsstil",
    "shareText": "Mein Arbeitsstil ist {name} {emoji} „{vibe}“ Und deiner?",
    "ctaStrong": "Ein Freund hat seinen Arbeitsstil geteilt",
    "ctaSub": "Welcher Beruf passt zu dir? Finde es in 2 Minuten heraus.",
    "retry": "Test wiederholen"
  },
  "og": {
    "eyebrow": "Meine Arbeitspersönlichkeit",
    "brand": "💼 Berufstest",
    "defaultKicker": "Ein lockeres Berufsquiz",
    "defaultTitle": "Welcher Beruf passt zu mir?",
    "defaultDesc": "11 Fragen · 2 Minuten · dein Arbeitsstil"
  },
  "faq": [
    {
      "q": "Wie wird mein Ergebnis ermittelt?",
      "a": "Jede Antwort verschiebt drei Skalen: lieber mit Menschen oder mit Dingen und Ideen arbeiten, lieber Neues erträumen oder klare Systeme aufbauen, lieber nach vorn treten oder tief eintauchen. Dein Ergebnis ist der Punkt, an dem sich diese drei Skalen treffen, und dieselben Antworten führen immer zum selben Ergebnis."
    },
    {
      "q": "Ist das ein echter Eignungstest?",
      "a": "Nein. Es ist ein lockeres Quiz für Spaß und zum Nachdenken, kein professioneller oder wissenschaftlicher Test. Bei wichtigen Entscheidungen zu Ausbildung, Studium oder Beruf sprich mit der Berufsberatung, mit Lehrkräften oder mit Leuten, die die Berufe ausüben, die dich neugierig machen."
    },
    {
      "q": "Warum wirken die vorgeschlagenen Berufe etwas schief?",
      "a": "Vier Berufe können nie einen ganzen Menschen abbilden. Es sind Beispiele für Arbeit, bei der dein Stil oft gefragt ist, nimm sie also als Ausgangspunkte. Viele Menschen mit deinem Ergebnis sind in ganz anderen Bereichen glücklich."
    },
    {
      "q": "Werden meine Antworten gespeichert?",
      "a": "Nein. Deine Antworten werden in deinem Browser berechnet und nicht gespeichert. Wir zählen nur anonym, welches Ergebnis herauskam, damit wir zeigen können, wie häufig es ist."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Berufstest",
    "description": "Datenschutzerklärung des Berufstests: Wie wir Cookies, Werbung und anonyme Statistiken verwenden.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der Berufstest (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie unten beschrieben.",
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
        "Diese Erklärung gilt ab dem 31. Oktober 2026."
      ]
    ],
    "back": "← Zurück zum Berufstest"
  },
  "questions": [
    {
      "q": "Ein Gruppenprojekt startet. Welche Rolle übernimmst du, ohne es zu wollen?",
      "choices": [
        "Die Person, die still an einer cleveren Lösung tüftelt, auf die sonst keiner kommt",
        "Die Person, die Ideen einbringt und sie der Klasse oder dem Team vorstellt",
        "Die Person, die zum Werkzeug greift und das Ding wirklich baut, Schritt für Schritt",
        "Die Person, die den Zeitplan im Blick hat und darauf achtet, dass niemand abgehängt wird"
      ]
    },
    {
      "q": "Plötzlich hast du einen freien Tag. Was klingt am besten?",
      "choices": [
        "Kaffee mit einer Freundin oder einem Freund und ein langes Gespräch über einen Film, den ihr beide geliebt habt",
        "Endlich deine Fotoordner oder dein Haushaltsbuch sortieren, schön ordentlich",
        "Leute zusammentrommeln für ein Fußballspiel oder einen Spieleabend, den du ausrichtest",
        "Ein eintägiger Workshop, in dem du mit den eigenen Händen etwas herstellst"
      ]
    },
    {
      "q": "Du hast ein neues Gadget gekauft. Was machst du zuerst?",
      "choices": [
        "Sofort einrichten und die Schritte der Reihe nach befolgen",
        "Eine einfache Anleitung schreiben, damit auch deine Familie es benutzen kann",
        "Das Auspacken filmen oder es deinen Freunden zeigen",
        "In die Einstellungen eintauchen und versteckte Funktionen und clevere Tricks entdecken"
      ]
    },
    {
      "q": "Welches Kompliment macht dir den Tag?",
      "choices": [
        "„Kein einziger Fehler. Du bist so genau.“",
        "„Das Team läuft rund, weil du da bist.“",
        "„Moment, das hast du selbst gemacht? Wahnsinn.“",
        "„Was du gesagt hast, ist mir echt im Kopf geblieben.“"
      ]
    },
    {
      "q": "Such dir deinen Traumarbeitsplatz aus.",
      "choices": [
        "Ein freundliches Teambüro, in dem alle gut aufeinander abgestimmt arbeiten",
        "Draußen vor Ort, in Bewegung, mit echten Geräten in der Hand",
        "Ein lebendiger Ort, an dem jeden Tag etwas Neues passiert",
        "Ein ruhiges Atelier mit einem Whiteboard voller halbfertiger Ideen"
      ]
    },
    {
      "q": "Etwas läuft schief. Was ist dein erster Schritt?",
      "choices": [
        "Alle zusammenholen, die Aufgaben verteilen und die Führung übernehmen",
        "Jedem Beteiligten zuhören und nach einem frischen Blickwinkel suchen",
        "In Ruhe die Zahlen und Unterlagen prüfen, um die Ursache zu finden",
        "Loslegen mit dem Tüfteln und auf der Stelle einen neuen Weg zur Lösung ausprobieren"
      ]
    },
    {
      "q": "Was taucht in deinen Video-Empfehlungen ständig auf?",
      "choices": [
        "Vlogs, Comedy-Clips und die neuesten Trends",
        "Reparaturen, Heimwerkerprojekte und Tests von Campingausrüstung",
        "Wissenschaft, Weltraum und ungelöste Rätsel, erklärt",
        "Wahre Geschichten von Menschen, die anderen helfen, etwa Lehrkräfte oder Pflegekräfte"
      ]
    },
    {
      "q": "Im Urlaub bist du meistens diejenige oder derjenige, die oder der …",
      "choices": [
        "ohne Plan herumstreift und den Speicher der Kamera oder ein Skizzenbuch füllt",
        "die perfekte Tabelle für Budget und Zeitplan baut",
        "in einem kleinen Café mit Einheimischen ins Plaudern kommt",
        "die ganze Gruppe von Ort zu Ort führt"
      ]
    },
    {
      "q": "Es ist der Tag vor der Deadline. Du …",
      "choices": [
        "schreibst eine klare To-do-Liste und arbeitest die Aufgaben nacheinander ab",
        "polierst die Abschlusspräsentation und hältst die Stimmung oben",
        "fragst bei allen im Team nach, ob jemand feststeckt",
        "versinkst in der Arbeit und kommst auf eine noch bessere Idee"
      ]
    },
    {
      "q": "Welche Aufgabe im Verein oder in einer Gruppe würde dir am meisten gefallen?",
      "choices": [
        "Neue willkommen heißen und zuhören, wenn jemand reden möchte",
        "Vorsitzende oder Vorsitzender sein und alles am Laufen halten",
        "Plakate, Logo und Merchandise gestalten",
        "Die Unterlagen und die gemeinsame Kasse in Ordnung halten"
      ]
    },
    {
      "q": "Was würdest du in zehn Jahren gern über dich hören?",
      "choices": [
        "„Mit dir an meiner Seite habe ich mich immer sicher gefühlt.“",
        "„Auf die Idee bist du als Erste oder Erster gekommen, stimmt’s?“",
        "„Du hast so viele Menschen zum Lächeln gebracht.“",
        "„Was durch deine Hände geht, funktioniert einfach.“"
      ]
    }
  ],
  "types": {
    "showrunner": {
      "name": "Der Entertainer",
      "word": "Entertainer",
      "vibe": "Gib dir eine Bühne und eine Idee, und der ganze Saal ist begeistert.",
      "desc": "Du blühst dort auf, wo Menschen, Ideen und Taten zusammenkommen. Du stellst gern etwas Neues vor, holst andere ins Boot und siehst zu, wie es vor Publikum passiert. Energie ist deine Superkraft: Ein trockenes Meeting wird zum Brainstorming, sobald du den Raum betrittst. Arbeit, bei der du starten, präsentieren und Menschen verbinden kannst, fühlt sich vermutlich weniger nach Arbeit und mehr nach Spiel an.",
      "keywords": ["Energiegeladen", "Überzeugend", "Ideenreich"],
      "strengths": ["Eine grobe Idee in etwas verwandeln, bei dem andere mitmachen wollen", "Die Stimmung im Raum lesen und heben", "Selbstbewusst das Wort ergreifen und präsentieren"],
      "jobs": ["Marketingmanager/in", "Veranstaltungskaufmann/-frau", "PR-Referent/in", "Unternehmer/in"],
      "env": "Schnelle Teams, Produktstarts und Live-Events, bei denen jede Woche etwas Neues bringt und du siehst, wie die Leute auf deine Arbeit reagieren.",
      "watch": "Mehr Projekte anzufangen, als du zu Ende bringen kannst. Glänzende neue Ideen können Zeit von denen stehlen, die schon halb fertig sind.",
      "tip": "Tu dich mit jemandem zusammen, der Details liebt, und vereinbart eine Ziellinie, bevor du das nächste große Ding startest."
    },
    "storyteller": {
      "name": "Der Geschichtenerzähler",
      "word": "Geschichtenerzähler",
      "vibe": "Du machst aus Ideen Worte und Geschichten, die man nicht vergisst.",
      "desc": "Dich ziehen Menschen und Bedeutung an. Du willst verstehen, wie andere sich fühlen, und formst daraus Worte, Lehren oder Geschichten, die ihnen etwas Neues zeigen. Du brauchst vielleicht nicht das Rampenlicht, aber dein leiser Einfluss reicht weit. Arbeit, bei der du zuhören, schreiben, unterrichten oder erklären kannst, passt vermutlich ganz natürlich zu dir.",
      "keywords": ["Einfühlsam", "Ausdrucksstark", "Nachdenklich"],
      "strengths": ["Komplizierte Dinge einfach und menschlich erklären", "Genau zuhören und merken, was Leute wirklich meinen", "Die Geschichte hinter Fakten und Zahlen finden"],
      "jobs": ["Journalist/in", "Lehrer/in", "Psychologe/Psychologin", "Texter/in"],
      "env": "Ruhige Orte mit Raum zum Nachdenken, enge Gespräche und Projekte, bei denen deine Worte echte Menschen erreichen und ihnen helfen.",
      "watch": "Die Sorgen anderer mit nach Hause zu nehmen. Mitfühlen ist ein Geschenk, aber auch du musst wieder auftanken.",
      "tip": "Führe ein kleines Notizbuch für Ideen und Formulierungen. Deine besten Arbeiten beginnen oft mit einem einzigen Satz, den du fast vergessen hättest."
    },
    "captain": {
      "name": "Der Kapitän",
      "word": "Kapitän",
      "vibe": "Wenn es hektisch wird, schauen alle auf dich, damit du Kurs hältst.",
      "desc": "Du bist am besten, wenn es ein Team zu führen und ein Ziel zu erreichen gibt. Du magst klare Pläne, entscheidest ohne großes Aufheben und hältst alle auf demselben Kurs. In Krisen vertraut man dir, weil du ruhig und organisiert bleibst. Arbeit, bei der du Menschen, Zeitpläne oder Service verantwortest, bringt vermutlich deine natürliche Führungsstärke zum Vorschein.",
      "keywords": ["Entschlossen", "Organisiert", "Verlässlich"],
      "strengths": ["Eine große Aufgabe in klare Teilaufgaben für jeden aufteilen", "Unter Druck ruhig und praktisch bleiben", "Versprechen und Termine einhalten"],
      "jobs": ["Projektleiter/in", "Vertriebsleiter/in", "Hoteldirektor/in", "Flugbegleiter/in"],
      "env": "Aktive Teams mit klaren Zielen, in denen du Menschen koordinierst, Probleme vor Ort löst und schnell Ergebnisse siehst.",
      "watch": "Alles selbst zu machen, weil es schneller scheint. Wenn du das Steuer ab und zu abgibst, wird das ganze Team stärker.",
      "tip": "Frag vor der Aufgabenverteilung jede Person, was sie am liebsten übernehmen würde. Die Antworten könnten dich überraschen."
    },
    "caretaker": {
      "name": "Der Kümmerer",
      "word": "Kümmerer",
      "vibe": "Du sorgst dafür, dass niemand durchs Raster fällt.",
      "desc": "Dir liegen Menschen am Herzen, und du zeigst es durch verlässliche, praktische Unterstützung. Du merkst, wenn jemand zu kämpfen hat, behältst die Details, auf die es ankommt, und magst Strukturen, die alle gut aufgehoben halten. Du verlangst vielleicht keine Anerkennung, aber Teams spüren den Unterschied, wenn du dabei bist. Arbeit, bei der du helfen, unterstützen und schützen kannst, fühlt sich für dich vermutlich sinnvoll an.",
      "keywords": ["Fürsorglich", "Geduldig", "Zuverlässig"],
      "strengths": ["Kleine Zeichen erkennen, dass jemand Hilfe braucht", "Sorgfältig dranbleiben, Tag für Tag", "Eine ruhige, vertrauensvolle Atmosphäre schaffen"],
      "jobs": ["Pflegefachkraft", "Personalreferent/in", "Sozialarbeiter/in", "Erzieher/in"],
      "env": "Eingeschworene Teams mit klarem Ziel, in denen Freundlichkeit und gute Abläufe für Menschen einen echten Unterschied machen.",
      "watch": "Zu allem Ja zu sagen. Deine eigene Zeit zu schützen gehört dazu, wenn du dich gut um andere kümmern willst.",
      "tip": "Blocke jede Woche eine Stunde, die nur deinen eigenen Zielen gehört, und verteidige sie wie jeden anderen Termin."
    },
    "creator": {
      "name": "Der Kreative",
      "word": "Kreative",
      "vibe": "Gib ihm Material, und etwas Neues entsteht.",
      "desc": "Du denkst mit den Händen und mit den Augen. Du liebst es, Dinge zu machen, die man sehen, schmecken, anfassen oder benutzen kann, und bist am glücklichsten, wenn du unterwegs ausprobieren, testen und verbessern darfst. Regeln sind in Ordnung, aber du brauchst Raum zum Experimentieren. Arbeit, bei der du etwas Echtes entwirfst, gestaltest oder herstellst, hält dich vermutlich lange begeistert.",
      "keywords": ["Erfinderisch", "Handfest", "Visuell"],
      "strengths": ["Aus einer Idee ein echtes, fertiges Stück machen", "Erkennen, was optisch oder vom Gefühl her genau stimmt", "Schnell lernen, indem du Dinge ausprobierst"],
      "jobs": ["Grafikdesigner/in", "Koch/Köchin", "Videoproduzent/in", "Innenarchitekt/in"],
      "env": "Ateliers, Küchen, Werkstätten oder Sets, in denen du mit echtem Material arbeitest und zeigen kannst, was du geschaffen hast.",
      "watch": "Ewig zu feilen. Ein fertiges Stück draußen in der Welt lehrt dich mehr als ein perfektes in der Schublade.",
      "tip": "Leg eine Mappe mit allem an, was du machst, auch mit Kleinigkeiten. Sie wird zu deiner besten Geschichte über dich selbst."
    },
    "inventor": {
      "name": "Der Erfinder",
      "word": "Erfinder",
      "vibe": "Dein Kopf ist ein Labor, in dem ständig neue Ideen brodeln.",
      "desc": "Du liebst große Fragen und clevere Antworten. Du tauchst gern tief in ein Rätsel ein, spielst Ideen im Kopf durch und findest eine Lösung, mit der keiner gerechnet hat. Am besten denkst du, wenn du Ruhe und die Freiheit zum Erkunden hast. Arbeit, bei der du forschen, Systeme entwerfen oder schwierige Probleme lösen kannst, ist vermutlich ein Spielplatz für deine Neugier.",
      "keywords": ["Neugierig", "Originell", "Analytisch"],
      "strengths": ["Muster und Zusammenhänge sehen, die andere übersehen", "Sich tief auf ein schwieriges Problem konzentrieren", "Originelle Lösungen finden"],
      "jobs": ["Wissenschaftler/in", "Softwareentwickler/in", "Architekt/in", "Spieleentwickler/in"],
      "env": "Ruhige Orte mit Platz zum Fokussieren, spannende Probleme und Kolleginnen und Kollegen, die gern über Ideen diskutieren.",
      "watch": "Deine brillanten Ideen im Kopf zu behalten. Wenn du sie früh teilst, können andere sie verstehen und darauf aufbauen.",
      "tip": "Erkläre einer Freundin oder einem Freund deine aktuelle Idee in drei Sätzen. Wenn sie oder er sie versteht, kannst du loslegen."
    },
    "builder": {
      "name": "Der Macher",
      "word": "Macher",
      "vibe": "Du redest nicht nur darüber. Du packst es an und machst es richtig.",
      "desc": "Du bist praktisch, bodenständig und am glücklichsten, wenn du echte Ergebnisse siehst. Du magst klare Schritte, gutes Werkzeug und Arbeit, bei der du in Bewegung bist, statt still zu sitzen. Wenn etwas kaputtgeht, bist du derjenige, der es ruhig repariert. Arbeit, bei der du bauen, reparieren, bedienen oder Dinge sicher am Laufen halten kannst, gibt dir vermutlich ein tiefes Gefühl von Zufriedenheit.",
      "keywords": ["Praktisch", "Geschickt", "Bodenständig"],
      "strengths": ["Einem Ablauf sorgfältig und sicher folgen", "Probleme mit ruhiger, handfester Könnerschaft lösen", "Echte, sichtbare Ergebnisse erzielen"],
      "jobs": ["Maschinenbauingenieur/in", "Elektriker/in", "Pilot/in", "Kfz-Mechatroniker/in"],
      "env": "Werkstätten, Baustellen, Labore oder Cockpits, in denen Können, Sicherheit und Teamarbeit zählen und du jeden Tag siehst, was du geschafft hast.",
      "watch": "Dein Können zu unterschätzen. Was dir selbstverständlich vorkommt, beeindruckt andere oft sehr.",
      "tip": "Lerne jede Jahreszeit ein neues Werkzeug oder eine neue Technik. Deine Fähigkeiten wachsen am schnellsten, wenn du sie Schritt für Schritt aufeinander aufbaust."
    },
    "analyst": {
      "name": "Der Analytiker",
      "word": "Analytiker",
      "vibe": "Details, Daten und Ordnung sind deine stillen Superkräfte.",
      "desc": "Du bemerkst, was andere übersehen. Du magst sorgfältige Arbeit, klare Regeln und das gute Gefühl, wenn jede Zahl und jedes Detail genau stimmt. Du denkst, bevor du handelst, und man vertraut deinem Urteil, weil es auf Fakten beruht. Arbeit, bei der du Informationen ordnen, prüfen, messen oder auswerten kannst, fühlt sich vermutlich ruhig und erfüllend für dich an.",
      "keywords": ["Genau", "Logisch", "Ruhig"],
      "strengths": ["Fehler und Muster in Informationen erkennen", "Komplexes ordentlich und übersichtlich halten", "Sorgfältige, faktenbasierte Entscheidungen treffen"],
      "jobs": ["Steuerberater/in", "Datenanalyst/in", "Bibliothekar/in", "Chemielaborant/in"],
      "env": "Ruhige, gut organisierte Orte mit klaren Erwartungen, an denen Genauigkeit geschätzt wird und du Zeit hast, Dinge richtig zu machen.",
      "watch": "Auf perfekte Informationen zu warten. Manchmal ist eine gut genug getroffene Entscheidung heute besser als eine perfekte im nächsten Monat.",
      "tip": "Teile jede Woche eine Erkenntnis aus deiner Arbeit. Deine sorgfältigen Funde helfen mehr Leuten, wenn sie davon hören."
    }
  }
};
