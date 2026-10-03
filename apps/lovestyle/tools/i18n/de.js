/* Liebestyp-Test — Deutsch (de/)
 * Gleiche Typ-IDs und Fragen-/Antwortreihenfolge wie lovestyle-core.js (Punkte nur dort).
 * Keine Spoiler: Meta, Startseite, FAQ und Standard-OG nennen keinen Typ (kein Tier) und zitieren keine Frage.
 * types.<id>.word = Tierwort(e) nur für die Spoiler-Prüfung. Platzhalter {name} {emoji} {vibe} {pct} {n} unverändert lassen.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Liebestyp-Test: Welcher Liebestyp bin ich?',
    description: 'Was für ein Partner bist du in der Liebe? Der Liebestyp-Test mit 10 kleinen Dating-Momenten, 2–3 Minuten, ohne Anmeldung. Mit deinem perfekten Match und Liebestipps.',
    ogTitle: 'Liebestyp-Test 💘 Welcher Liebestyp bist du?',
    ogDescription: 'Ein Quiz in 2 Minuten. Beantworte 10 kleine Dating-Momente und entdecke, was für ein Partner du wirklich bist.',
  },
  siteName: 'Liebestyp-Test',
  privacyLink: 'Datenschutz',

  start: {
    badge: '💘 Dating-Persönlichkeitstest',
    h1Kicker: 'Liebestyp-Test',
    h1Html: 'Was für ein Partner<br>bist du <em>in der Liebe</em>?',
    hook: 'Texten, erstes Date, kleine Streits … Zehn Alltagsmomente verraten, welcher süße Charakter in deinem Herzen steckt.',
    metaTime: '⏱️ 2–3 Minuten',
    metaCount: '💌 10 Fragen',
    start: 'Liebestyp finden →',
  },

  quiz: {
    backAria: 'Vorherige Frage',
    progressAria: 'Fortschritt',
    qLabel: 'F{n}',
  },

  loading: {
    text: 'Dein Herz wird gelesen …',
    sub: 'Deine Antworten werden einem Liebestyp zugeordnet',
  },

  result: {
    title: 'Liebestyp-Test: Ich bin {name}',
    eyebrow: 'In der Liebe bist du',
    strengthsLabel: 'Deine Liebes-Stärken',
    tipsLabel: 'Liebestipps für dich',
    bestLabel: 'Perfektes Match',
    rivalLabel: 'Rivale',
    sameShare: '{pct} % haben diesen Liebestyp',
    shareText: 'Mein Liebestyp: {name} {emoji} – „{vibe}“ Und welcher bist du?',
    ctaStrong: 'Jemand hat seinen Liebestyp geteilt',
    ctaSub: 'Was für ein Partner bist du? 2 Minuten.',
    retry: 'Test wiederholen',
  },

  og: {
    eyebrow: 'Mein Liebestyp',
    brand: '💘 Liebestyp-Test',
    defaultKicker: 'Liebestyp-Test',
    defaultTitle: 'Welcher Liebestyp bist du?',
    defaultDesc: '10 Dating-Momente · 2–3 Minuten',
  },

  faq: [
    { q: 'Wie wird mein Ergebnis bestimmt?', a: 'Jede Antwort gibt ein paar Liebestypen Punkte, und der Typ mit den meisten Punkten gewinnt. Gleichstände entscheidet eine feste Regel, deshalb führen gleiche Antworten immer zum gleichen Ergebnis.' },
    { q: 'Ist das ein wissenschaftlicher Persönlichkeitstest?', a: 'Nein, der Test ist zum Spaß. Die Fragen beruhen auf alltäglichen Dating-Gewohnheiten und sind keine psychologische Diagnose – eher ein verspielter Spiegel als ein Urteil.' },
    { q: 'Was bedeuten „Perfektes Match“ und „Rivale“?', a: 'Dein perfektes Match ergänzt deinen Stil ganz natürlich. Mit deinem Rivalen gerätst du am häufigsten aneinander – was auch heißen kann: die meisten Funken.' },
    { q: 'Werden meine Antworten gespeichert?', a: 'Nein. Deine Antworten werden nur in deinem Browser ausgewertet und nirgends gespeichert. Wir zählen nur anonym, welcher Typ herauskam, um zu zeigen, wie häufig jedes Ergebnis ist.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Liebestyp-Test',
    description: 'Datenschutzerklärung des Liebestyp-Tests – Cookies, Werbung und anonyme Statistiken.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Der Liebestyp-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unbedingt nötigen Informationen, wie unten beschrieben.',
    sections: [
      ['1. Welche Daten wir erheben', 'Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen. Deine Antworten werden nur in deinem Browser ausgewertet und weder an unsere Server gesendet noch dort gespeichert. Wir zählen nur anonym, welcher Typ herauskam, um die Häufigkeit der Ergebnisse anzuzeigen.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers verwenden, um deine Sprache zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; einige Funktionen arbeiten dann eventuell nicht richtig.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche dieser und anderer Websites auszuspielen. Mehr dazu und Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistiken', 'Wir speichern nur anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Diese Summen lassen keine Rückschlüsse auf deine Person zu.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 4. Oktober 2026.'],
    ],
    back: '← Zurück zum Liebestyp-Test',
  },

  questions: [
    { q: 'Dein Schwarm schreibt dir zuerst. Du …', choices: [
      'Antwortest in drei Sekunden – mit fünf Emojis',
      'Wartest ein bisschen. Nicht zu eifrig wirken!',
      'Schickst eine neckische Antwort, die neugierig macht',
      'Fragst, wie der Tag war, und merkst dir jedes Detail',
    ] },
    { q: 'Erstes Date! Was schlägst du vor?', choices: [
      'Ein süßes Café mit hübschen Desserts und leiser Musik',
      'Einen ruhigen Ort, an dem man wirklich reden kann',
      'Spielhalle oder Spielecafé. Lass uns zocken!',
      'Etwas Neues: Nachtmarkt, Wanderung, Tagesausflug',
    ] },
    { q: 'Bald hat dein Schatz Geburtstag. Dein Plan?', choices: [
      'Eine Überraschungsparty mit allen Freunden',
      'Etwas Stylisches, mit dem niemand rechnet',
      'Ein handgeschriebener Brief und ein Album unserer Erinnerungen',
      'Ein albernes Geschenk, über das noch tagelang gelacht wird',
    ] },
    { q: 'Dein Schatz hatte einen furchtbaren Tag. Du …', choices: [
      'Sitzt still daneben. Worte braucht es nicht.',
      'Kommst mit dem Lieblingsessen und regelst, was geht',
      'Hörst den ganzen Abend zu und merkst dir jedes Wort',
      'Machst spontan eine Spritztour, damit der Kopf frei wird',
    ] },
    { q: 'Wie viel schreibst du gern, wenn du datest?', choices: [
      'Den ganzen Tag! Von Guten Morgen bis Gute Nacht',
      'Ein, zwei kurze Nachrichten. Lieber telefonieren.',
      'Lange, süße Nachrichten voller Herzen',
      'Ab und zu. Erzählen tu ich lieber persönlich.',
    ] },
    { q: 'Ein kleiner Streit. Du …', choices: [
      'Brauchst erst mal Zeit für dich',
      'Tust, als wäre alles okay, aber gibst Hinweise',
      'Entschuldigst dich zuerst, auch wenn es nicht deine Schuld war',
      'Machst einen Witz, um das Eis zu brechen',
    ] },
    { q: 'Was lässt dein Herz höherschlagen?', choices: [
      'Wenn das Gesicht strahlt, sobald es mich sieht',
      'Wenn wir über denselben Quatsch lachen',
      'Wenn spontan kommt: „Lass uns wegfahren!“',
      'Wenn mein Freiraum respektiert wird und ich trotzdem gewählt werde',
    ] },
    { q: 'Dein ideales Wochenende zu zweit?', choices: [
      'Schick machen, angesagtes Restaurant, schöne Fotos',
      'Zusammen kochen und Sachen reparieren',
      'Ein Picknick mit Blumen und Sonnenuntergang',
      'Unser Stammlokal, unsere übliche Bestellung',
    ] },
    { q: 'Wenn du jemanden zu mögen beginnst, …', choices: [
      'kannst du es nicht verbergen. Nach zwei Tagen weiß es jeder.',
      'bleibst du cool und lässt die Person kommen',
      'magst du sie still – sehr, sehr lange',
      'fragst du sofort nach einem Date. Das Leben ist kurz!',
    ] },
    { q: 'Was ist dir in einer Beziehung am wichtigsten?', choices: [
      'Vertrauen und Raum, ich selbst zu sein',
      'Mich sicher und umsorgt zu fühlen',
      'Romantik und kleine Jahrestage',
      'Beste Freunde sein und über alles reden',
    ] },
  ],

  types: {
    puppy: {
      name: 'der Golden Retriever',
      word: 'golden,retriever,hund,welpe',
      vibe: 'Mit vollem Herzen dabei und jedes Mal überglücklich, dich zu sehen.',
      desc: 'Wenn du liebst, weiß es die ganze Welt. Du schreibst zuerst, kommst zu früh und spielst nie Spielchen – deine Gefühle stehen dir ins Gesicht geschrieben. Deine Energie gibt deinem Schatz das Gefühl, der wichtigste Mensch der Welt zu sein. Denk nur daran, auch auf dich zu achten, damit dein großes Herz nie leer läuft.',
      strengths: ['Volle Hingabe', 'Ansteckende Freude', 'Null Spielchen'],
      tips: ['Eine langsame Antwort heißt nicht, dass etwas nicht stimmt – gib Raum zum Vermissen.', 'Plane jede Woche einen Tag nur für dich; eure gemeinsame Zeit strahlt dann noch mehr.', 'Frag, welche Art von Zuneigung am besten ankommt, und gib genau die.'],
    },
    cat: {
      name: 'die Tsundere-Katze',
      word: 'katze,kater',
      vibe: 'Außen cool, innen weich – Zuneigung nur für die oder den Auserwählten.',
      desc: 'Du verliebst dich nicht schnell und schon gar nicht laut. Du brauchst deinen Raum und deine Zeit und wirkst anfangs vielleicht etwas distanziert. Doch wer dein Vertrauen gewinnt, sieht eine süße, verspielte Seite, die sonst niemand kennt. Deine Liebe ist leise, treu und absolut echt.',
      strengths: ['Gelassene Unabhängigkeit', 'Treu, wenn du vertraust', 'Heimliche Zärtlichkeit'],
      tips: ['Sag einmal ehrlich laut „Ich hab dich vermisst“ – von dir bedeutet das die Welt.', 'Erklär, dass du Zeit für dich brauchst, damit es nicht wie Kälte wirkt.', 'Kleine Gesten zählen: Die Lieblingskaffeesorte zu kennen, ist deine Liebessprache.'],
    },
    fox: {
      name: 'der charmante Fuchs',
      word: 'fuchs',
      vibe: 'Witzig, stilvoll und im Spiel der Herzen immer einen Schritt voraus.',
      desc: 'Du weißt, wie man Eindruck macht. Schlagfertige Nachrichten, das perfekte Outfit, genau die richtige Portion Geheimnis – du bist schwer zu widerstehen. Du liebst das Kribbeln der Romantik und hältst alles mit Überraschungen spannend. Unter dem Charme suchst du jemanden, der mithalten kann und trotzdem dein wahres Ich sieht.',
      strengths: ['Magnetischer Charme', 'Stilsicher', 'Hält das Kribbeln wach'],
      tips: ['Misch das Hin und Her mit klarer Ehrlichkeit; deutliche Signale schaffen schnell Vertrauen.', 'Zeig dich auch an faulen Tagen ungeschminkt – echt ist anziehend.', 'Deine Überraschungen sind legendär; lass dich auch mal überraschen.'],
    },
    bear: {
      name: 'der Kuschelbär',
      word: 'bär,teddy',
      vibe: 'Beständig, warm und die sicherste Umarmung der Welt.',
      desc: 'Du zeigst Liebe durch Taten statt großer Worte. Du reparierst, kochst und bist da, wenn es darauf ankommt. Vielleicht bist du nicht der auffälligste Romantiker, aber dein Schatz muss nie rätseln, woran er bei dir ist. Mit dir zusammen zu sein fühlt sich an wie nach Hause kommen.',
      strengths: ['Absolut verlässlich', 'Liebe in Taten', 'Großes warmes Herz'],
      tips: ['Sprich deine Gefühle ab und zu aus – „Ich bin stolz auf dich“ bewirkt viel.', 'Plane ein Überraschungsdate, das einfach nur Spaß macht, nicht praktisch ist.', 'Lass dich auch mal umsorgen.'],
    },
    bunny: {
      name: 'das romantische Häschen',
      word: 'häschen,hase,kaninchen',
      vibe: 'Ein Träumer, der sich an jedes Date, jedes Lied und jeden kleinen Jahrestag erinnert.',
      desc: 'Für dich ist Liebe ein Film, und jede Szene soll schön sein. Du bemerkst kleine Details, schreibst herzliche Nachrichten und hütest jede Erinnerung. Du fühlst alles sehr tief, bist dadurch unglaublich fürsorglich und manchmal auch etwas empfindlich. Der richtige Mensch wird deine Zärtlichkeit schätzen.',
      strengths: ['Herzliche Romantik', 'Vergisst nichts', 'Tief fürsorglich'],
      tips: ['Wenn dich etwas verletzt, sag es sanft, statt darauf zu warten, dass es erraten wird.', 'Nicht jeder zeigt Liebe mit großen Gesten – achte auch auf die leisen.', 'Führt ein gemeinsames Fotoalbum: Das ist deine Superkraft.'],
    },
    penguin: {
      name: 'der treue Pinguin',
      word: 'pinguin',
      vibe: 'Langsamer Start, aber wenn du liebst, dann einen Menschen – für immer.',
      desc: 'Du lässt dir Zeit, bevor du dein Herz öffnest, und überstürzt nie etwas. Doch wenn du dich entscheidest, dann für lange. Du hörst genau zu, merkst dir, was zählt, und bleibst in jeder Jahreszeit treu. Deine Liebe ist sanft, geduldig und genau die, von der viele träumen.',
      strengths: ['Treue für immer', 'Geduldiger Zuhörer', 'Ruhig und sanft'],
      tips: ['Warte nicht zu lange, Interesse zu zeigen – ein kleiner erster Schritt kann alles ändern.', 'Teile auch deine Sorgen, nicht nur die des anderen; Liebe geht in beide Richtungen.', 'Probiert jeden Monat eine neue Date-Idee, damit eure gemütliche Routine frisch bleibt.'],
    },
    hamster: {
      name: 'der Kumpel-Hamster',
      word: 'hamster',
      vibe: 'Dein Schatz ist auch dein bester Freund, und jedes Date endet in Gelächter.',
      desc: 'Für dich beginnen die besten Beziehungen als Freundschaft. Du spielst gern, teilst Snacks und lachst, bis der Bauch wehtut. Mit dir ist alles leicht, und du bringst eine fröhliche, verspielte Energie in die Liebe. Ernste Gespräche sind dir etwas unangenehm, aber deine Ehrlichkeit und dein Humor halten euch zusammen.',
      strengths: ['Endloser Spaß', 'Leicht zu reden', 'Freundschaft zuerst'],
      tips: ['Mach es ab und zu romantisch – Kerzen schlagen manchmal Witze.', 'Wenn es ernst wird, bleib im Gespräch, statt es wegzuscherzen.', 'Pflegt eure Insider-Witze; sie sind der Kleber eurer Beziehung.'],
    },
    dolphin: {
      name: 'der freie Delfin',
      word: 'delfin,delphin',
      vibe: 'Abenteuerlustig, spontan und immer mit der nächsten Date-Idee im Kopf.',
      desc: 'Du liebst Freiheit, neue Orte und sagst gern Ja zum Abenteuer. Mit dir zu daten heißt Roadtrips, spontane Pläne und Geschichten zum Erzählen. Du bringst Energie und Neugier in jede Beziehung und brauchst jemanden, der die Fahrt genießt. Freiheit ist dir wichtig, aber der richtige Mensch lässt dich gern nach Hause kommen.',
      strengths: ['Abenteuergeist', 'Voller Ideen', 'Mutig in der Liebe'],
      tips: ['Gleiche spontane Pläne mit ein paar festen Ritualen aus, auf die man sich verlassen kann.', 'Sprich große Abenteuer vorher ab – nicht jeder liebt Überraschungen.', 'Teile deine Träume; gemeinsam Pläne schmieden ist schon ein Abenteuer.'],
    },
  },
};
