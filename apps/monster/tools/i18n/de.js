/* Welches Monster bist du? — Deutsch (/de/)
 * Gleiche 12 Monster-IDs, gleiche Reihenfolge von Fragen/Antworten wie monster-core.js (Gewichtungen nur dort).
 * questions[i].choices[j] muss in derselben Reihenfolge wie monster-core.js QUESTIONS[i].choices[j] bleiben.
 * Keys, die auf Html enden, werden als rohes HTML eingefügt (nur <br> und <em>); privacy.sections-Texte sind auch HTML.
 * Keine Spoiler: meta / og.default* / start / faq nennen nie ein Monster und zitieren nie eine Frage.
 * Platzhalter: {name} {emoji} {catch} {pct} {n} {total} — beim Übersetzen unverändert lassen.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: "",
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Welches Monster bist du? Halloween-Persönlichkeitstest',
    description: 'Welches Monster bist du? Mach den kostenlosen Halloween-Persönlichkeitstest: 10 gruselig-süße Fragen, etwa eine Minute, keine Anmeldung. Finde das Monster, das zu dir passt.',
    ogTitle: 'Welches Monster bist du? 🎃 Halloween-Persönlichkeitstest',
    ogDescription: 'Der kostenlose Halloween-Persönlichkeitstest für eine Minute. Beantworte 10 gruselig-süße Fragen und triff dein Monster-Ich.',
  },
  siteName: 'Welches Monster bist du?',
  privacyLink: 'Datenschutzerklärung',

  start: {
    badge: '🎃 Halloween-Spezial',
    h1Kicker: 'Halloween-Persönlichkeitstest',
    h1Html: 'Welches <em>Monster</em><br>bist du?',
    hook: 'Eine gruselige Nacht, zehn kleine Entscheidungen. Irgendwo im Dunkeln wartet ein Monster, das dir verblüffend ähnlich ist.',
    metaTime: '⏱️ Etwa 1 Minute',
    metaCount: '🦇 10 Fragen',
    start: 'Mein Monster rufen →',
  },

  quiz: {
    backAria: 'Vorherige Frage',
    progressAria: 'Fortschritt',
    qLabel: 'F{n}',
  },

  loading: {
    text: 'Dein Monster wird beschworen …',
    sub: 'Der Kessel brodelt schon',
  },

  result: {
    title: 'Welches Monster bist du? Mein Ergebnis: {name}',
    eyebrow: 'Das Monster, das zu dir passt, ist',
    strengthsLabel: 'Monster-Kräfte',
    partyLabel: 'Auf einer Halloween-Party bist du …',
    bestLabel: 'Bester Kumpel',
    rivalLabel: 'Erzrivale',
    sameShare: '{pct}% der Spieler haben auch dieses Monster bekommen',
    shareText: 'Mein Halloween-Monster ist {name} {emoji} — „{catch}“ Welches Monster bist du?',
    ctaStrong: 'Ein Freund hat dir sein Monster geschickt',
    ctaSub: 'Welches bist du? Dauert nur eine Minute.',
    retry: 'Test wiederholen',
  },

  og: {
    eyebrow: 'Mein Halloween-Monster',
    brand: '🎃 Welches Monster bist du?',
    defaultKicker: 'Halloween-Persönlichkeitstest',
    defaultTitle: 'Welches Monster bist du?',
    defaultDesc: '10 gruselig-süße Fragen · etwa 1 Minute',
  },

  // Nur im gemeinsamen Endbildschirm sichtbar, als Akkordeon. Reiner Text, ohne Spoiler.
  faq: [
    { q: 'Wie funktioniert der Monster-Test?', a: 'Jede Antwort gibt ein paar Monstern Punkte, und das Monster mit den meisten Punkten ist dein Ergebnis. Unentschieden werden nach einer festen Regel entschieden, darum ergeben dieselben Antworten immer dasselbe Monster.' },
    { q: 'Ist der Test gruselig?', a: 'Überhaupt nicht. Es ist ein süßes, familienfreundliches Halloween-Quiz — kein Blut, keine Schockmomente, nur ein bisschen gruseliger Spaß.' },
    { q: 'Kann ich ein anderes Monster bekommen?', a: 'Ja. Dein Ergebnis hängt nur von deinen Antworten ab — antworte anders, und es erscheint ein anderes Monster.' },
    { q: 'Werden meine Antworten gespeichert?', a: 'Nein. Deine Antworten werden nur in deinem Browser ausgewertet und nirgendwo gespeichert. Wir zählen anonym nur, welches Monster herauskam, um zu zeigen, wie häufig jedes Ergebnis ist.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Welches Monster bist du?',
    description: 'Datenschutzerklärung für „Welches Monster bist du?“ — wie wir Cookies, Werbung und anonyme Statistiken verwenden.',
    h1: 'Datenschutzerklärung',
    introHtml: '„Welches Monster bist du?“ (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie im Folgenden beschrieben.',
    sections: [
      ['1. Erhobene Informationen', 'Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen. Deine Antworten werden ausschließlich in deinem Browser ausgewertet und niemals an unsere Server gesendet oder dort gespeichert. Wir zählen anonym nur, welcher Monstertyp herauskam, um zu zeigen, wie häufig jedes Ergebnis ist.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies verwenden, um Werbung anzuzeigen und die Nutzung des Dienstes zu verstehen. Du kannst Cookies in deinen Browsereinstellungen ablehnen oder löschen; einige Funktionen funktionieren dann möglicherweise nicht richtig.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können anhand von Cookies Werbung auf Basis deiner früheren Besuche auf dieser und anderen Websites anzeigen. Mehr dazu und wie du deine Anzeigenpersonalisierung änderst, erfährst du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistiken', 'Wir speichern anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Diese Summen lassen keine Rückschlüsse auf dich als Person zu.'],
      ['5. Kontakt', 'Wenn du Fragen zu dieser Datenschutzerklärung hast, wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Richtlinie gilt ab dem 27. September 2026.'],
    ],
    back: '← Zurück zum Monster-Test',
  },

  questions: [
    { q: 'Auf deinem Handy poppt eine Last-Minute-Einladung zu einer Halloween-Party auf. Erster Gedanke?', choices: [
      'Was zieh ich an? Muss legendär werden.',
      'Gibt’s was zu essen? Dann bin ich dabei.',
      'Hm … wer kommt denn noch so?',
      'Ich bring die Deko mit. Und die Playlist.',
    ] },
    { q: 'Party läuft seit dreißig Minuten. Wo steckst du?', choices: [
      'Mitten auf der Tanzfläche, Arme und Beine überall',
      'Am Snacktisch. Dritter Teller schon.',
      'In einer ruhigen Ecke, tief im Gespräch mit einer Person',
      'Irgendwie schon mit allen befreundet',
    ] },
    { q: 'Ein Schrei hallt durch einen stockdunklen Flur. Du …', choices: [
      'Schreist noch lauter mit und lachst dich kaputt',
      'Rennst hin. Vielleicht braucht jemand Hilfe!',
      'Erstarrst und verschmilzt still mit der Wand',
      'Schaust ruhig auf die Uhr. Bestimmt nur ein Scherz.',
    ] },
    { q: 'Mitternacht, du hast Hunger. Wonach greifst du?', choices: [
      'Was Rotes und Edles: Kirschsaft mit dunkler Schokolade',
      'Was auch immer im Kühlschrank steht. Alles davon.',
      'Heiße Schokolade mit meiner eigenen geheimen Gewürzmischung',
    ] },
    { q: 'Deine Kostüm-Strategie?', choices: [
      'Selbstgemacht. Ich bastle schon seit August daran.',
      'Altes Bettlaken, zwei Löcher für die Augen. Fertig.',
      'Alles einwickeln, was rumliegt. Klopapier zählt auch.',
      'Jede Stunde ein neuer Look. Sollen sie raten.',
    ] },
    { q: 'Klingeling! Kinder stehen zum Süßes-oder-Saures vor der Tür. Du …', choices: [
      'Verteilst die großen Schokoriegel und feierst jedes Kostüm ab',
      'Springst hinter der Tür hervor mit einem (sanften) Schreckmoment',
      'Licht aus, durch den Vorhang spähen. Hier ist niemand zu Hause.',
    ] },
    { q: 'Wie würden deine Freunde dich beschreiben?', choices: [
      'Sieht einschüchternd aus, ist aber ein riesiges Weichei',
      'Immer pünktlich und seltsam gelassen bei allem',
      'Macht, worauf sie Lust hat, und kommt trotzdem immer damit durch',
      'Geheimnisvoll. Hat für wirklich alles ein Mittel parat',
    ] },
    { q: 'Drei Uhr nachts. Die Party geht zu Ende. Du …', choices: [
      'Fängst gerade erst an. Aftershow bei mir!',
      'Schläfst auf dem Sofa. Schon seit elf.',
      'Packst die Reste in ordentlich beschriftete Dosen',
      'Reparierst die Box, die jemand kaputt gemacht hat, damit die Musik weitergeht',
    ] },
    { q: 'Draußen hängt ein riesiger Vollmond am Himmel. Du fühlst dich …', choices: [
      'Wild. Ich muss irgendwohin rennen. Egal wohin!',
      'Verträumt. Perfekte Nacht für einen ruhigen, stillen Spaziergang.',
      'Gemütlich. Rein ins Haus: Decke, Tee, alter Film.',
      'Glücklich. Schnell was wünschen!',
    ] },
    { q: 'Wähl dein Motto für die Halloween-Nacht.', choices: [
      'Tanz, als würde niemand zuschauen. Sind eh alles Geister.',
      'Neun Leben, null Sorgen.',
      'Immer pünktlich, jedes Mal.',
      'Dafür gibt’s einen Zauberspruch.',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampir',
      catch: 'Kommt spät, sorgt sofort für Drama.',
      desc: 'Du bist ein Nachtwesen mit tadellosem Geschmack — bei Outfits, bei Musik, bei Snacks. Leute fühlen sich zu dir hingezogen, bevor du auch nur ein Wort gesagt hast, und du weißt genau, wie man einen Auftritt hinlegt. Lieber bis zum Sonnenaufgang ein gutes Gespräch führen, als früh ins Bett zu gehen. Ja, ein bisschen dramatisch bist du schon. Genau deshalb lieben dich alle.',
      strengths: ['Magnetische Ausstrahlung', 'Makelloser Geschmack', 'Nachteulen-Ausdauer'],
      party: 'Kommt als Letzte(r) an und wird sofort zum Star des Abends.',
    },
    werewolf: {
      name: 'Werwolf',
      catch: 'Treu zum Rudel, wild im Herzen.',
      desc: 'Du hast grenzenlose Energie und ein Herz so groß wie der Vollmond. Deine Freunde sind dein Rudel, und du würdest mitten in der Nacht quer durch die Stadt rennen, wenn einer von ihnen dich braucht. Du bist ehrlich bis zur letzten Konsequenz, meistens hungrig, und deine Laune ist … sagen wir, mondabhängig. Wenn du dabei bist, bist du mit ganzem Herzen dabei — und der ganze Raum spürt es.',
      strengths: ['Bedingungslose Loyalität', 'Endlose Energie', 'Ehrlich (auf die nette Art)'],
      party: 'Führt den Snack-Raubzug an und heult dann bei jedem einzelnen Song mit.',
    },
    witch: {
      name: 'Hexe',
      catch: 'Braut Ideen, zaubert Pläne, hat immer noch einen Trick auf Lager.',
      desc: 'Neugierig, clever und ein bisschen frech — du hast immer einen Plan, einen Plan B und eine geheime Zutat. Du sammelst gern kuriose Fakten und machst daraus etwas Nützliches (oder herrlich Chaotisches). Freunde kommen zu dir, wenn sie Rat brauchen, weil deine Antworten wirklich funktionieren. Zutiefst unabhängig — du fliegst lieber selbst auf deinem Besen, als auf eine Mitfahrgelegenheit zu warten.',
      strengths: ['Scharfsinnige Problemlösung', 'Endlose Neugier', 'Für alles ein Mittel'],
      party: 'Mixt geheimnisvolle Getränke in der Küche und liest allen aus der Hand.',
    },
    ghost: {
      name: 'Geist',
      catch: 'Ruhig, sanft und heimlich der Witzigste hier.',
      desc: 'Du schwebst leise durchs Leben und bemerkst alles, was allen anderen entgeht. Schüchtern bist du nicht wirklich — du bevorzugst nur ein paar echte Freunde einem vollen Raum. Wenn du doch mal was sagst, kommt es genau im richtigen Moment und bringt alle zum Lachen. Außerdem bist du Meister im leisen Verschwinden: eben noch da, im nächsten Moment schon friedlich zu Hause im Bett.',
      strengths: ['Scharfer Beobachter', 'Trockener Humor mit perfektem Timing', 'Beruhigende Präsenz'],
      party: 'Schwebt von Raum zu Raum, schnappt die besten Geschichten auf und verschwindet dann spurlos.',
    },
    zombie: {
      name: 'Zombie',
      catch: 'Langsam, stetig und absolut unerschütterlich.',
      desc: 'Nichts bringt dich aus der Ruhe. Deadlines, Drama, Chaos — du schlurfst einfach in deinem eigenen Tempo weiter und kommst trotzdem irgendwie an. Du läufst auf Snacks und Nickerchen und bist der lebende Beweis, dass „entspannt“ eine Superkraft ist. Freunde lieben, wie locker du bist; du bist für alles zu haben, solange Essen im Spiel ist. Weck dich nur nicht vor Mittag.',
      strengths: ['Unerschütterliche Ruhe', 'Geht mit dem Flow', 'Überraschend hartnäckig'],
      party: 'Auf dem Sofa, in jeder Hand einen Teller, völlig im Frieden mit der Welt.',
    },
    mummy: {
      name: 'Mumie',
      catch: 'Eine alte Seele, eingewickelt in gemütliche Schichten.',
      desc: 'Du liebst dein Zuhause, deine Routinen und deine perfekt sortierten Regale. Du bewahrst Dinge jahrelang auf — Kinokarten, alte Fotos, Freundschaften — und kümmerst dich liebevoll um alles davon. Manche nennen dich altmodisch; du nennst es zeitlos. Unter all den Schichten steckt ein warmes, treues Herz, auf das man sich jahrhundertelang verlassen kann.',
      strengths: ['Absolut verlässlich', 'Wunderbar organisiert', 'Hält Freundschaften für immer'],
      party: 'In eine Decke gewickelt am Kamin, erzählt die besten Geschichten von „früher“.',
    },
    frank: {
      name: 'Frankensteins Monster',
      catch: 'Groß, sanft und mit Herz gebaut.',
      desc: 'Auf den ersten Blick wirkst du vielleicht ernst, aber jeder, der dich kennt, weiß: Du bist die freundlichste Seele im Raum. Du bist ein Macher — du reparierst Dinge, baust Dinge und zeigst Liebe lieber durch Taten als durch Worte. Manchmal fühlst du dich ein bisschen missverstanden, aber die Freunde, die dich wirklich kennen, würden alles für dich tun. Es lebt … und es ist zum Knuddeln.',
      strengths: ['Handwerklich geschickt', 'Herz aus Gold', 'Fels in der Brandung'],
      party: 'Repariert leise die Lichterkette, tanzt dann unbeholfen Blues, wenn der richtige Song kommt.',
    },
    pumpkin: {
      name: 'Kürbisgeist',
      catch: 'Strahlendes Grinsen, sofort gute Stimmung.',
      desc: 'Du erhellst jeden Raum — fast wortwörtlich. Dein Optimismus steckt an, dein Lachen ist laut, und meistens warst du es, der die Party überhaupt erst geplant hat. Du sorgst dafür, dass sich alle willkommen fühlen, und vergisst nie einen Namen. Selbst in der dunkelsten Nacht findest du etwas zum Lächeln — und hilfst allen anderen, es auch zu finden.',
      strengths: ['Ansteckende Fröhlichkeit', 'Geborener Gastgeber', 'Lässt jeden willkommen fühlen'],
      party: 'Der Gastgeber, der Stimmungsmacher und der Grund, warum überhaupt alle gekommen sind.',
    },
    blackcat: {
      name: 'Schwarze Katze',
      catch: 'Geheimnisvoll, unabhängig, unfassbar cool.',
      desc: 'Du machst die Dinge auf deine eigene Art und siehst dabei mühelos cool aus. Du lässt nicht jeden nah an dich ran, aber wen du einmal auswählst, der hat einen Freund für alle neun Leben. Du liebst ein gutes Nickerchen, einen ruhigen Platz und deine Ruhe — bis du plötzlich die volle Aufmerksamkeit willst. Manche sagen, du bringst Unglück. Deine Freunde wissen: Du bist der Glücksbringer.',
      strengths: ['Mühelos stilvoll', 'Scharfe Instinkte', 'Wählerisch, aber treu'],
      party: 'Sitzt auf dem besten Platz im Haus und beurteilt alle liebevoll von oben herab.',
    },
    reaper: {
      name: 'Sensenmann',
      catch: 'Ruhig, pünktlich und verpasst nie eine Deadline.',
      desc: 'Du bist die Ruhe in jedem Sturm. Während andere in Panik geraten, checkst du den Zeitplan, machst einen Plan und ziehst ihn durch — immer genau pünktlich. Dein Humor ist so trocken, dass Leute erst eine Stunde später merken, dass du einen Witz gemacht hast. Die Kapuze wirkt einschüchternd, aber eigentlich bist du derjenige, der dafür sorgt, dass alle sicher nach Hause kommen.',
      strengths: ['Cool unter Druck', 'Perfektes Timing', 'Heimlich fürsorglich'],
      party: 'Checkt um 23:58 Uhr die Uhr und kündigt dann ganz ruhig den letzten Song an.',
    },
    fox: {
      name: 'Neunschwänziger Fuchs',
      catch: 'Ein Gestaltwandler mit einem Lächeln für jeden Raum.',
      desc: 'Du passt überall rein — beim schicken Dinner, auf der chaotischen Hausparty, beim Familientreffen. Du liest Menschen sofort und weißt immer das Richtige zu sagen. Clever und verspielt, liebst du ein gutes Spiel und gewinnst es meistens auch. Hinter all den charmanten Gesichtern steckt jemand, der den wenigen, die deine echten Schwänze gesehen haben, unerschütterlich treu ist.',
      strengths: ['Liest jeden Raum sofort', 'Schlagfertiger Witz', 'Passt sich an alles an'],
      party: 'Wechselt zweimal das Kostüm und wird nebenbei beste Freundin der Oma des Gastgebers.',
    },
    skeleton: {
      name: 'Skelett',
      catch: 'Lustiger Knochen? Bei dir sind alle Knochen lustig.',
      desc: 'Du nimmst das Leben nicht zu ernst — und ehrlich gesagt ist genau das dein Geheimnis. Du reißt Witze im denkbar ungünstigsten Moment, tanzt bei der kleinsten Ausrede und bringst jeden in dreißig Sekunden zum Lachen. Du reist mit leichtem Gepäck und lebst einfach: kein Drama, kein Trara, nur gute Stimmung. Bei dir fühlen sich Leute leichter, als hätten sie ein paar Kilo Sorgen abgeworfen.',
      strengths: ['Sofortiger Stimmungsmacher', 'Furchtlos albern', 'Erfrischend drama-frei'],
      party: 'Klappert auf der Tanzfläche und startet eine Polonaise, die niemand angefordert hat.',
    },
  },
};
