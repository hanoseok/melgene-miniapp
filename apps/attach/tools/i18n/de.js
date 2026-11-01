/* Bindungstyp-Test (de) — German, du
 * 4 result ids (secure anxious avoidant fearful);
 * questions[i].choices[j] follow attach-core.js QUESTIONS[i].w[j] (the [anxiety, avoidance] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Kind, non-judgmental wording: every style is a way of coping that once made sense, and styles can change.
 * Just for fun and self-reflection — not a clinical or psychological diagnosis.
 * Placeholders: {name} {nick} {emoji} {vibe} {pct}.
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
    "title": "Bindungstyp-Test – Welcher Bindungstyp bin ich?",
    "description": "Bindungstyp-Test: 11 Alltagsfragen zu Freunden, Familie und Partnerschaft, 2 Minuten, ohne Anmeldung. Finde heraus, wie du Nähe lebst – mit sanften Tipps.",
    "ogTitle": "Bindungstyp-Test 🫂 Wie lebst du Nähe?",
    "ogDescription": "Elf Alltagssituationen mit Freunden, Familie und Partner. Entdecke deinen Bindungstyp, deine Stärken und liebevolle Tipps für engere Beziehungen."
  },
  "siteName": "Bindungstyp-Test",
  "privacyLink": "Datenschutzerklärung",
  "start": {
    "badge": "🫂 Wie lebst du Nähe?",
    "h1Kicker": "Bindungstyp-Test",
    "h1Html": "Wie liebst du<br>und <em>verbindest</em> du dich?",
    "hook": "Eine Antwort, die auf sich warten lässt, ein abgesagtes Treffen, eine Freundin, die sich plötzlich öffnet. Wie du auf solche kleinen Momente reagierst, verrät viel darüber, wie du Bindungen eingehst. Beantworte elf Alltagsfragen und lerne deinen Bindungstyp kennen.",
    "metaTime": "⏱️ 2 Min.",
    "metaCount": "✨ 11 Fragen",
    "start": "Meinen Typ finden →"
  },
  "quiz": {
    "backAria": "Vorherige Frage",
    "progressAria": "Fortschritt",
    "qLabel": "Frage {n}"
  },
  "loading": {
    "text": "Wir lesen zwischen den Zeilen…",
    "sub": "Wir schauen, wie du Nähe lebst"
  },
  "result": {
    "title": "Mein Bindungstyp: {name}",
    "metaDesc": "Ergebnis im Bindungstyp-Test: {name}, {nick}. {vibe} Entdecke deine Stärken und drei liebevolle Tipps für deine Beziehungen.",
    "eyebrow": "Dein Bindungstyp",
    "gaugeLabel": "Wohin deine Antworten tendierten",
    "axes": [
      [
        "Gelassen",
        "Oft besorgt"
      ],
      [
        "Nähe suchen",
        "Raum brauchen"
      ]
    ],
    "strengthsLabel": "Deine Stärken",
    "tipsLabel": "Tipps für deine Beziehungen",
    "matchLabel": "Fühlt sich leicht an mit",
    "disclaimer": "Nur zum Spaß und zur Selbstreflexion. Dieses leichte Quiz ist keine psychologische Untersuchung und keine Diagnose. Bindungsmuster können sich mit der Zeit und je nach Beziehung verändern. Wenn sich Beziehungen oft schmerzhaft anfühlen, kann ein Gespräch in einer Beratungsstelle oder mit einer Therapeutin wirklich helfen.",
    "sameShare": "{pct} % der Leute haben diesen Bindungstyp",
    "shareText": "Mein Bindungstyp ist {name} {emoji} „{vibe}“ Und deiner?",
    "ctaStrong": "Jemand hat seinen Bindungstyp mit dir geteilt",
    "ctaSub": "Wie lebst du Nähe? Finde es in 2 Minuten heraus.",
    "retry": "Test nochmal machen"
  },
  "og": {
    "eyebrow": "Mein Bindungstyp",
    "brand": "🫂 Bindungstyp-Test",
    "defaultKicker": "Ein sanftes Beziehungsquiz",
    "defaultTitle": "Welcher Bindungstyp bin ich?",
    "defaultDesc": "11 Fragen · 2 Minuten · wie du Nähe lebst"
  },
  "faq": [
    {
      "q": "Wie wird mein Ergebnis bestimmt?",
      "a": "Jede Antwort verschiebt zwei Skalen, mit denen die Forschung Bindung bei Erwachsenen beschreibt: wie sehr du dir Sorgen um Nähe machst und wie wohl du dich dabei fühlst, dich auf andere zu verlassen. Dein Ergebnis liegt dort, wo sich beide treffen, und gleiche Antworten ergeben immer das gleiche Ergebnis."
    },
    {
      "q": "Ist das eine psychologische Diagnose?",
      "a": "Nein. Es ist ein leichtes Quiz zum Spaß und zur Selbstreflexion, keine fachliche oder wissenschaftliche Untersuchung. Ein Bindungstyp ist keine Störung und kein festes Etikett. Wenn sich Beziehungen oft schmerzhaft oder verwirrend anfühlen, kann dir eine Beratung oder Therapie helfen, genauer hinzuschauen."
    },
    {
      "q": "Kann sich mein Bindungstyp ändern?",
      "a": "Ja. Viele Menschen zeigen bei verschiedenen Menschen unterschiedliche Muster, und unterstützende Beziehungen, Selbstwahrnehmung und Therapie können helfen, sich mit der Zeit geborgener und entspannter zu fühlen. Mach den Test in ein paar Monaten noch einmal und vergleiche."
    },
    {
      "q": "Werden meine Antworten gespeichert?",
      "a": "Nein. Deine Antworten werden in deinem Browser berechnet und nicht gespeichert. Wir zählen nur anonym, welches Ergebnis herauskam, damit wir zeigen können, wie häufig es ist."
    }
  ],
  "privacy": {
    "title": "Datenschutzerklärung | Bindungstyp-Test",
    "description": "Datenschutzerklärung des Bindungstyp-Tests: Wie wir Cookies, Werbung und anonyme Statistiken verwenden.",
    "h1": "Datenschutzerklärung",
    "introHtml": "Der Bindungstyp-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie unten beschrieben.",
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
        "Diese Erklärung gilt ab dem 2. November 2026."
      ]
    ],
    "back": "← Zurück zum Bindungstyp-Test"
  },
  "questions": [
    {
      "q": "Eine enge Freundin hat den ganzen Tag nicht auf deine Nachricht geantwortet. Was geht dir durch den Kopf?",
      "choices": [
        "Sie hat bestimmt viel um die Ohren. Sie meldet sich später.",
        "Ich lese meine Nachricht nochmal und frage mich, ob ich was Falsches gesagt habe.",
        "Ehrlich gesagt fällt es mir kaum auf. Ständig hin und her schreiben ist nicht so meins.",
        "Ich mache mir kurz Sorgen und sage mir dann, dass es mir nicht so wichtig sein sollte."
      ]
    },
    {
      "q": "Jemand, dem du gerade näherkommst, sagt: „Ich verbringe echt gern Zeit mit dir.“ Du …",
      "choices": [
        "freust dich riesig und fragst dich dann, ob das nächsten Monat noch so ist",
        "spürst ein warmes Gefühl und sagst, dass es dir genauso geht",
        "freust dich, willst aber seltsamerweise einen kleinen Schritt zurück",
        "fühlst dich etwas unbeholfen und lenkst mit einem Witz ab"
      ]
    },
    {
      "q": "Du hast eine richtig harte Woche. Was machst du meistens?",
      "choices": [
        "Ich regle das allein. Ich stütze mich nicht gern auf andere.",
        "Ich würde mich gern melden, bleibe aber still, um niemandem zur Last zu fallen",
        "Ich erzähle einem vertrauten Menschen, was los ist, und lasse mir helfen",
        "Ich schreibe mehreren Leuten und hoffe, dass sich jemand nach mir erkundigt"
      ]
    },
    {
      "q": "Ein Freund sagt eure Verabredung in letzter Minute ab.",
      "choices": [
        "Ich sage, es ist okay, nehme mir aber still vor, nicht mehr so auf ihn zu zählen",
        "Insgeheim bin ich etwas erleichtert. Mehr Zeit für mich!",
        "Ich frage mich, ob er mich überhaupt sehen will",
        "Kein Problem. Wir suchen uns einfach einen anderen Tag."
      ]
    },
    {
      "q": "Ein neuer Freund fängt an, dir Persönliches zu erzählen. Und du?",
      "choices": [
        "Ich öffne mich auch, Schritt für Schritt, so wie es sich stimmig anfühlt",
        "Ich will mich öffnen, erstarre aber auf halbem Weg und ziehe mich zurück",
        "Ich erzähle schnell ganz viel. Ich will, dass wir uns rasch nahekommen.",
        "Ich bleibe locker. Privates bleibt privat."
      ]
    },
    {
      "q": "Du und ein vertrauter Mensch seid bei etwas Wichtigem unterschiedlicher Meinung.",
      "choices": [
        "Ich will das sofort klären. Warten halte ich kaum aus.",
        "Ich brauche Abstand und werde still, bis Gras über die Sache gewachsen ist",
        "Wir reden ruhig darüber, auch wenn es etwas unangenehm ist",
        "Ich schwanke zwischen „Lass uns reden“ und „Ich will nur weg“"
      ]
    },
    {
      "q": "Ein vertrauter Mensch ist eine Woche weg. Wie viel Kontakt fühlt sich richtig an?",
      "choices": [
        "Wir holen alles nach, wenn wir uns wiedersehen. Ich genieße den Freiraum.",
        "Ein paar Nachrichten sind schön, aber gar keine ist auch okay",
        "Schwer zu sagen. Ich vermisse die Person, aber zu viele Nachrichten machen mich angespannt.",
        "Jeden Tag ein kleines Update. Ich mag das Gefühl, verbunden zu sein."
      ]
    },
    {
      "q": "Jemand tut unerwartet etwas Liebes für dich.",
      "choices": [
        "Ich bin gerührt, aber ein Teil von mir fragt sich, was die Person dafür will",
        "Ich freue mich riesig und finde, ich sollte noch mehr für sie tun",
        "Mir ist leicht unwohl, als stünde ich jetzt in der Schuld",
        "Ich bedanke mich und freue mich einfach"
      ]
    },
    {
      "q": "Wenn du an die Menschen denkst, die dir am nächsten stehen: Was passt am besten zu dir?",
      "choices": [
        "Ich vertraue darauf, dass sie für mich da sind, und sie können auch auf mich zählen",
        "Ich mag sie, aber am wohlsten fühle ich mich, wenn ich mich auf mich selbst verlasse",
        "Manchmal fürchte ich, dass sie mir mehr bedeuten als ich ihnen",
        "Ich wünsche mir Nähe, aber ein Teil von mir rechnet damit, verletzt zu werden"
      ]
    },
    {
      "q": "Jemand Neues kommt in deinen Freundeskreis, und alle scheinen die Person toll zu finden.",
      "choices": [
        "Mir ist das ziemlich egal. Ich habe meinen eigenen kleinen Kreis.",
        "Ich habe ein bisschen Angst, außen vor zu bleiben",
        "Ich bleibe etwas auf Abstand, bis ich weiß, ob ich ihr trauen kann",
        "Super, noch jemand, mit dem man was unternehmen kann"
      ]
    },
    {
      "q": "Jemand fragt behutsam: „Ist bei dir gerade alles okay?“",
      "choices": [
        "Ich sage „Alles gut“ und wünschte später, ich hätte mehr erzählt",
        "Ich sage ehrlich, wie es mir geht",
        "Ich sage, alles ist gut, und wechsle das Thema. Ich kläre das selbst.",
        "Ich bin so erleichtert, dass es jemand bemerkt, dass alles aus mir heraussprudelt"
      ]
    }
  ],
  "types": {
    "secure": {
      "name": "Sicher",
      "nick": "Der ruhige Hafen",
      "word": "sichere Bindung, sicherer Bindungstyp",
      "vibe": "Du kannst nah sein, ohne dich zu verlieren, und getrennt, ohne das Vertrauen zu verlieren.",
      "desc": "Du gehst meist davon aus, dass die Menschen, die du liebst, für dich da sind, und du bist gern auch für sie da. Nähe macht dir keine Angst, ein bisschen Abstand aber auch nicht. Wenn etwas schiefläuft, kannst du meistens sagen, was du fühlst, ohne zu explodieren oder dichtzumachen. Andere werden in deiner Gegenwart oft ruhiger, als würdest du ihnen einen geschützten Ort zum Landen bieten. Das heißt nicht, dass du dir nie Sorgen machst, sondern dass du meist wieder ins Gleichgewicht findest.",
      "keywords": [
        "Vertrauensvoll",
        "Offen",
        "Ausgeglichen"
      ],
      "strengths": [
        "Einfach und freundlich sagen, was du brauchst",
        "Anderen Raum lassen, ohne dich abgelehnt zu fühlen",
        "Dich nach einem Streit versöhnen, statt aufzurechnen"
      ],
      "tips": [
        "Achte auch auf dich selbst. Der ruhende Pol zu sein heißt nicht, alles allein zu tragen.",
        "Wenn ein vertrauter Mensch besorgt oder distanziert wirkt, ist das vielleicht ein altes Muster und kein Urteil über dich.",
        "Teile, was dir hilft, ruhig zu bleiben. Ein einfaches „Das hilft mir“ kann ein Geschenk für Freunde sein, die gerade kämpfen."
      ],
      "match": "Zwei ruhige Herzen bauen leichte, ehrliche Beziehungen. Deine Gelassenheit hilft auch jedem anderen Typ, sich mit der Zeit geborgener zu fühlen."
    },
    "anxious": {
      "name": "Ängstlich",
      "nick": "Das hingebungsvolle Herz",
      "word": "ängstliche Bindung, ängstlicher Bindungstyp",
      "vibe": "Du liebst von ganzem Herzen und spürst jede kleine Veränderung in der Luft.",
      "desc": "Dir liegt viel an anderen, und du bemerkst alles: eine kürzere Antwort, einen anderen Ton, einen Plan, der wackelt. Nähe zu Menschen ist dir sehr wichtig, und wenn sich eine Verbindung ungewiss anfühlt, füllt dein Kopf die Lücken schnell selbst. Diese Feinfühligkeit macht dich warmherzig, aufmerksam und treu. Die Sorge ist kein Fehler, sondern ein Zeichen dafür, wie viel dir die Menschen in deinem Leben bedeuten. Mit etwas Zuspruch und Übung kann sich dieses große Herz nah und zugleich ruhig fühlen.",
      "keywords": [
        "Fürsorglich",
        "Aufmerksam",
        "Treu"
      ],
      "strengths": [
        "Spüren, wie es anderen geht, bevor sie es sagen",
        "Liebe und Wertschätzung großzügig zeigen",
        "Viel Herzblut investieren, damit Beziehungen lebendig bleiben"
      ],
      "tips": [
        "Wenn die Sorge hochkocht, halte kurz inne, bevor du noch eine Nachricht schickst. Frag dich, was du weißt, nicht was du befürchtest.",
        "Sag anderen, was dich beruhigt, etwa ein kurzes „Melde mich später“. Klare Bedürfnisse sind leichter zu erfüllen als Ratespiele.",
        "Bau dir ein Leben, das dich auch für sich allein erfüllt: Hobbys, Freunde, stille Zeit. Halt wächst aus vielen Ankern, nicht aus einem."
      ],
      "match": "Ein beständiger, verlässlicher Partner oder Freund hilft deinen Sorgen, sich zu legen, und deine Wärme hilft ihm, sich zu öffnen."
    },
    "avoidant": {
      "name": "Vermeidend",
      "nick": "Der freie Geist",
      "word": "vermeidende Bindung, vermeidender Bindungstyp",
      "vibe": "Deine Unabhängigkeit ist dir wichtig, und du zeigst Zuneigung auf leise, praktische Art.",
      "desc": "Du bist selbstständig und kommst gut allein zurecht. Du magst Menschen, brauchst aber auch viel Freiraum, und zu viel emotionale Intensität bringt dich dazu, einen Schritt zurückzutreten. Das ist keine Kälte, sondern oft eine früh gelernte Gewohnheit, zuerst dir selbst zu vertrauen. Deine Ruhe unter Druck und dein Respekt vor der Freiheit anderer sind echte Stärken. Wenn du Menschen nach und nach näher lässt, können sich deine Beziehungen leichter anfühlen, nicht schwerer.",
      "keywords": [
        "Unabhängig",
        "Gelassen",
        "Fähig"
      ],
      "strengths": [
        "Ruhig bleiben, wenn es stressig wird",
        "Den Freiraum und die Entscheidungen anderer respektieren",
        "Probleme praktisch und zuverlässig lösen"
      ],
      "tips": [
        "Wenn du Abstand brauchst, sag es, und sag, wann du wieder da bist. „Ich brauche heute Abend Ruhe, lass uns morgen reden“ erhält das Vertrauen.",
        "Teile einmal pro Woche ein kleines Gefühl mit jemandem, dem du vertraust. Nähe kann in winzigen Schritten wachsen.",
        "Achte auf den Impuls, dich zurückzuziehen, gerade wenn es schön wird. Oft vertieft sich die Verbindung genau dann, wenn du einen Moment länger bleibst."
      ],
      "match": "Ein gelassener, geduldiger Mensch respektiert deinen Freiraum, ohne es persönlich zu nehmen, und so fällt es dir leichter, ihn näher zu lassen."
    },
    "fearful": {
      "name": "Desorganisiert",
      "nick": "Der zarte Igel",
      "word": "desorganisierte Bindung, desorganisierter Bindungstyp",
      "vibe": "Du sehnst dich nach Nähe und weißt zugleich, wie weh sie tun kann.",
      "desc": "Ein Teil von dir wünscht sich tiefe Verbindung, ein anderer bleibt auf der Hut, bereit, dich zu schützen. Also kommst du näher und gehst dann wieder auf Abstand, manchmal ohne genau zu wissen, warum. Wie ein Igel in der Kälte willst du Wärme, fürchtest aber die Stacheln. Diese Mischung stammt oft aus Erfahrungen, in denen sich Nähe nicht immer geborgen angefühlt hat. Du bist nicht zu viel und nicht zu kompliziert: Du bist feinfühlig, aufmerksam und zutiefst empathisch, und mit Vertrauen und Zeit kannst du dich nah und zugleich geborgen fühlen.",
      "keywords": [
        "Feinfühlig",
        "Empathisch",
        "Scharfsinnig"
      ],
      "strengths": [
        "Den Schmerz anderer verstehen, weil du ihn selbst kennst",
        "Menschen und Situationen mit echter Tiefe lesen",
        "Vertrauen wie einen Schatz hüten, wenn es einmal gewachsen ist"
      ],
      "tips": [
        "Benenne das Hin und Her, wenn du es spürst. Zu sagen „Ein Teil von mir will näher kommen, ein anderer hat Angst“ ist mutig und hilfreich.",
        "Wähle Beziehungen, die sich ruhig und beständig anfühlen, und gib ihnen Zeit, sich zu bewähren.",
        "Sei sanft mit dir. Wenn alte Verletzungen dein Heute prägen, kann eine Beratung oder Therapie eine echte Stütze sein."
      ],
      "match": "Ein beständiger Mensch, der freundlich bleibt, wenn du wankst, kann dir nach und nach zeigen, dass Nähe geborgen sein kann."
    }
  }
};
