/* Aura-Farben-Test — Deutsch (de/)
 * Dieselben 8 Aura-IDs und dieselbe Reihenfolge der Fragen/Antworten wie aura-core.js (Gewichte nur dort).
 * Schlüssel mit Html: rohes HTML (nur <br> und <em>). Der Text in privacy.sections ist ebenfalls HTML.
 * Keine Spoiler: meta / og.default* / start / faq nennen keine Aura-Farbe und zitieren keine Frage.
 * types.<id>.word = Grundfarbwörter (kommagetrennt) — nur für die Spoiler-Prüfung.
 * Platzhalter: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap',
    display: "'Comfortaa'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Aura-Farben-Test – Welche Farbe hat deine Aura?',
    description: 'Welche Farbe hat deine Aura? Mach den kostenlosen Aura-Farben-Test: 12 Fragen aus dem Alltag, etwa 2 Minuten, ohne Anmeldung. Entdecke das Leuchten deiner Energie.',
    ogTitle: 'Aura-Farben-Test ✨ Welche Farbe hat deine Aura?',
    ogDescription: 'Ein kostenloser Aura-Test in 2 Minuten. Beantworte 12 Alltagsfragen und sieh, in welcher Farbe deine Energie leuchtet.',
  },
  siteName: 'Aura-Farben-Test',
  privacyLink: 'Datenschutz',

  start: {
    badge: '✨ Aura-Lesung',
    h1Kicker: 'Aura-Farben-Test',
    h1Html: 'Welche Farbe hat<br>deine <em>Aura</em>?',
    hook: 'Jeder Mensch strahlt auf seine Weise. Zwölf kleine Momente aus dem Alltag zeigen, wie dein Leuchten aussieht.',
    metaTime: '⏱️ Etwa 2 Minuten',
    metaCount: '🔮 12 Fragen',
    start: 'Meine Aura lesen →',
  },

  quiz: {
    backAria: 'Vorherige Frage',
    progressAria: 'Fortschritt',
    qLabel: 'F{n}',
  },

  loading: {
    text: 'Deine Aura wird gelesen …',
    sub: 'Die Farben kommen zur Ruhe',
  },

  result: {
    title: 'Aura-Farben-Test: Meine Aura ist {name}',
    eyebrow: 'Deine Aura-Farbe ist',
    strengthsLabel: 'Deine Leuchtkräfte',
    othersLabel: 'So sehen dich andere',
    bestLabel: 'Passt perfekt',
    clashLabel: 'Reibt sich',
    sameShare: '{pct} % der Spieler haben dieselbe Aura',
    shareText: 'Meine Aura ist {name} {emoji} – „{vibe}“ Welche Farbe hat deine?',
    ctaStrong: 'Jemand hat dir seine Aura geschickt',
    ctaSub: 'Welche Farbe hat deine? Dauert 2 Minuten.',
    retry: 'Test noch mal machen',
  },

  og: {
    eyebrow: 'Meine Aura-Farbe',
    brand: '✨ Aura-Farben-Test',
    defaultKicker: 'Aura-Farben-Test',
    defaultTitle: 'Welche Farbe hat deine Aura?',
    defaultDesc: '12 Fragen aus dem Alltag · etwa 2 Minuten',
  },

  faq: [
    { q: 'Wie funktioniert der Aura-Farben-Test?', a: 'Jede Antwort gibt ein paar Aura-Farben Punkte, und die Farbe mit den meisten Punkten ist dein Ergebnis. Bei Gleichstand entscheidet eine feste Regel – gleiche Antworten ergeben also immer dieselbe Aura.' },
    { q: 'Was ist eigentlich eine Aura?', a: 'In der populären Spiritualität ist die Aura ein Energiefeld, das jeden Menschen umgibt, und jede Farbe steht für eine Stimmung und einen Charakter. Dieser Test greift die Idee spielerisch auf – zum Spaß und zum Nachdenken über dich selbst, nicht als Wissenschaft.' },
    { q: 'Kann sich meine Aura-Farbe ändern?', a: 'Ja. Dein Ergebnis hängt nur von deinen heutigen Antworten ab. Eine andere Stimmung oder ein neuer Lebensabschnitt kann eine andere Farbe hervorbringen. Mach den Test, so oft du willst.' },
    { q: 'Werden meine Antworten gespeichert?', a: 'Nein. Deine Antworten werden in deinem Browser ausgewertet und nie gespeichert. Wir zählen nur anonym, welche Aura herauskam, um zu zeigen, wie häufig jedes Ergebnis ist.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Aura-Farben-Test',
    description: 'Datenschutzerklärung des Aura-Farben-Tests – Cookies, Werbung und anonyme Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Der Aura-Farben-Test (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die nötigsten Informationen, wie unten beschrieben.',
    sections: [
      ['1. Welche Daten wir erheben', 'Du kannst den Dienst ohne Registrierung oder Anmeldung nutzen. Deine Antworten werden in deinem Browser ausgewertet und nie an unsere Server gesendet oder dort gespeichert. Wir zählen nur anonym, welche Aura-Farbe herauskam, um zu zeigen, wie häufig jedes Ergebnis ist.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache zu speichern, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in deinen Browsereinstellungen ablehnen oder löschen; manche Funktionen arbeiten dann eventuell nicht richtig.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites zu schalten. Mehr dazu und Einstellungen in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Wir speichern anonyme Tagessummen (Seitenaufrufe, abgeschlossene Tests, Bewertungen), um den Dienst zu verbessern. Sie lassen keine Rückschlüsse auf deine Person zu.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 30. September 2026.'],
    ],
    back: '← Zurück zum Aura-Test',
  },

  questions: [
    { q: 'Ein ruhiger Samstagmorgen, nichts geplant. Wie fängt er an?', choices: [
      'Mit einem Lauf zum Sonnenaufgang. Erst mal bewegen.',
      'Ich schreibe in die Gruppe: „Ausflug? Abfahrt in einer Stunde.“',
      'Pflanzen gießen, dann ein Bummel über den Wochenmarkt',
      'Kaffee, ein Notizbuch und absolute Stille',
    ] },
    { q: 'Eine Freundin schreibt: „Hey … können wir reden?“ Du …', choices: [
      'rufst sofort an. Egal was ist, ich bin da.',
      'hörst erst zu und hilfst dann, Ordnung reinzubringen',
      'kommst mit Snacks vorbei und einem Plan, sie zum Lachen zu bringen',
      'schickst eine lange, herzliche Nachricht und einen passenden Song',
    ] },
    { q: 'Du kommst auf eine Party, auf der du kaum jemanden kennst.', choices: [
      'Zehn Minuten später rede ich mit dem halben Raum',
      'Ich bin die Person, die alle zum Lachen bringt',
      'Ich finde eine Person und wir reden stundenlang in einer Ecke',
      'Ich starte ein Spiel und hole alle mit rein',
    ] },
    { q: 'Du darfst ein Jahr lang überall wohnen. Du wählst …', choices: [
      'ein kleines Häuschen am Waldrand',
      'einen ruhigen Ort am Meer',
      'ein gemütliches Dachatelier voller Malsachen',
      'mitten in einer quirligen Großstadt',
    ] },
    { q: 'Das Gruppenprojekt ist morgen fällig und nichts ist fertig.', choices: [
      'Ich übernehme das Kommando und verteile die Aufgaben',
      'Ich mache einen Schritt-für-Schritt-Plan, damit keiner in Panik gerät',
      'Spät in der Nacht habe ich die rettende Idee',
      'Ich schaue, wer gestresst ist, und sorge dafür, dass es allen gut geht',
    ] },
    { q: 'Du darfst eine Superkraft haben. Welche?', choices: [
      'Gedanken lesen',
      'Mich jederzeit überallhin teleportieren',
      'Jede Wunde und jeden Kummer heilen',
      'Jeden sofort zum Lächeln bringen',
    ] },
    { q: 'Was füllt die Fotogalerie deines Handys am meisten?', choices: [
      'Selfies und Gruppenfotos mit Menschen, die ich liebe',
      'Himmel, Blumen, Bäume – überall Natur',
      'Schräge Blickwinkel, stimmungsvolles Licht, kleine Kunstwerke',
      'Orte, an denen ich war, und meine Abenteuer',
    ] },
    { q: 'Der Stress wächst dir über den Kopf. Was hilft?', choices: [
      'Aufräumen und eine klare To-do-Liste schreiben',
      'Ein hartes Workout, bis der Kopf frei ist',
      'Zeit allein, um alles in Ruhe zu durchdenken',
      'Lustige Videos und Snacks. Sorgen später.',
    ] },
    { q: 'Was denken Leute meistens, wenn sie dich zum ersten Mal treffen?', choices: [
      '„Selbstbewusst. Ein bisschen intensiv.“',
      '„So warmherzig und lieb.“',
      '„Ruhig. Dem kann man vertrauen.“',
      '„Geheimnisvoll. Wie niemand sonst.“',
    ] },
    { q: 'Welches Geschenk würde dich am meisten freuen?', choices: [
      'Eine Pflanze oder etwas Selbstgemachtes',
      'Konzertkarten mit meinen besten Freunden',
      'Ein seltenes Buch oder ein schönes Notizbuch',
      'Ein Überraschungs-Wochenendtrip',
    ] },
    { q: 'Ein Streit bahnt sich an. Du …', choices: [
      'bleibst ruhig und suchst, was fair ist',
      'entschuldigst dich zuerst. Frieden ist wichtiger.',
      'machst einen Witz, um die Stimmung zu lockern',
      'trittst einen Schritt zurück und denkst später darüber nach',
    ] },
    { q: 'Welches Motto passt am besten zu dir?', choices: [
      'Das Leben ist ein Abenteuer – sag Ja!',
      'Langsam wachsen, tief verwurzeln.',
      'Erst träumen, dann wahr machen.',
      'Laut lieben.',
    ] },
  ],

  types: {
    red: {
      name: 'Rubinrot',
      word: 'rot, rote',
      vibe: 'Pures Feuer: mutig, zielstrebig und voller Leben.',
      desc: 'Deine Aura brennt hell und warm. Du bist ein Macher: Wenn dir etwas wichtig ist, legst du los und denkst unterwegs nach. Herausforderungen wecken dich auf, statt dich abzuschrecken, und deine Energie reißt andere mit. Du fühlst alles stark – Begeisterung wie Frust – und versteckst es nicht. Genau diese Ehrlichkeit macht dich so vertrauenswürdig.',
      strengths: ['Furchtloser Antrieb', 'Ansteckende Energie', 'Ehrlich und direkt'],
      others: 'Andere sehen in dir den Funken im Raum – die Person, die Dinge ins Rollen bringt und ausspricht, was alle denken.',
    },
    orange: {
      name: 'Sonnenorange',
      word: 'orange',
      vibe: 'Warm, spontan und immer bereit für ein Abenteuer.',
      desc: 'Deine Aura leuchtet wie ein Sonnenuntergang auf einem Roadtrip im Sommer. Du liebst neue Orte, neue Leute und ein fröhliches „Warum nicht?“. Du findest überall Freunde, und deine Geschichten sind am Tisch immer die besten. Routine langweilt dich, also machst du dein Leben bunt mit Plänen, auf die sonst niemand käme. Unter all dem Spaß steckt ein großzügiges Herz, das gute Zeiten teilen will.',
      strengths: ['Abenteuergeist', 'Findet überall Freunde', 'Sorgt für Stimmung'],
      others: 'Andere sehen in dir die Person, die aus einem normalen Tag eine Geschichte macht – locker, gesellig und voller Überraschungen.',
    },
    yellow: {
      name: 'Goldgelb',
      word: 'gelb, gelbe',
      vibe: 'Sonnenschein auf zwei Beinen: fröhlich, neugierig, hell.',
      desc: 'Deine Aura ist reines Tageslicht. Du bist optimistisch, verspielt und unendlich neugierig und sammelst ständig neue Ideen und Hobbys. Du findest an fast allem die lustige Seite, und dein Lachen ist unter deinen Freunden berühmt. Du magst es leicht, bist aber auch klug und schnell – du lernst fix und teilst dein Wissen mit allen.',
      strengths: ['Natürlicher Optimismus', 'Schneller, neugieriger Kopf', 'Hebt jede Stimmung'],
      others: 'Andere sehen in dir einen Sonnenstrahl – allein dein Auftauchen macht schwere Tage leichter.',
    },
    green: {
      name: 'Smaragdgrün',
      word: 'grün, grüne',
      vibe: 'Geerdet, fürsorglich und leise am Wachsen.',
      desc: 'Deine Aura fühlt sich an wie ein Wald nach dem Regen: ruhig, frisch und lebendig. Dir liegen die Menschen und Dinge um dich herum sehr am Herzen, und du baust lieber etwas Beständiges auf, als schnell zu gewinnen. Du merkst, was andere brauchen, und hilfst, ohne Aufhebens zu machen. Balance ist dir wichtig – ein Spaziergang, ein gutes Essen und liebe Menschen richten fast alles.',
      strengths: ['Beständig und geduldig', 'Geborene Kümmerin', 'Hält alles im Gleichgewicht'],
      others: 'Andere sehen in dir einen sicheren Hafen – verlässlich, freundlich und die Person, die man anruft, wenn man Halt braucht.',
    },
    blue: {
      name: 'Ozeanblau',
      word: 'blau, blaue',
      vibe: 'Ruhiges Wasser, tiefe Treue, ehrliche Worte.',
      desc: 'Deine Aura ist so ruhig wie das Meer an einem klaren Tag. Du bleibst gelassen, wenn es chaotisch wird, und wählst deine Worte mit Bedacht. Wahrheit und Vertrauen bedeuten dir viel – du hältst Versprechen und erwartest dasselbe von anderen. Du bist vielleicht nicht die lauteste Stimme im Raum, aber wenn du sprichst, hören alle zu, weil sie wissen, dass du es ernst meinst.',
      strengths: ['Ruhig unter Druck', 'Zutiefst loyal', 'Bedachte Worte'],
      others: 'Andere sehen in dir den vertrauenswürdigsten Menschen, den sie kennen – friedlich, fair und immer ehrlich.',
    },
    indigo: {
      name: 'Mitternachts-Indigo',
      word: 'indigo',
      vibe: 'Intuitiv, tiefgründig und einen Schritt voraus.',
      desc: 'Deine Aura schimmert wie der Himmel kurz nach Mitternacht. Du spürst Dinge, bevor jemand sie ausspricht, und ahnst oft das Ende einer Geschichte, bevor sie beginnt. Du liebst große Fragen, stille Zeit und Gespräche, die in die Tiefe gehen. Du bist unabhängig und etwas verschlossen, doch die wenigen, die dich wirklich kennen, haben eine Freundin oder einen Freund mit seltener Weitsicht.',
      strengths: ['Scharfe Intuition', 'Tiefe Gedanken', 'Sieht das große Ganze'],
      others: 'Andere halten dich für weise über dein Alter hinaus – still, feinfühlig und ein bisschen schwer zu durchschauen.',
    },
    violet: {
      name: 'Mystisches Violett',
      word: 'violett, lila',
      vibe: 'Eine Träumerin mit einer Vision, die sonst niemand sieht.',
      desc: 'Deine Aura wirbelt voller Fantasie. Du siehst die Welt, wie sie sein könnte, nicht nur, wie sie ist, und dein Kopf ist voller Ideen, Geschichten und Pläne. Kunst, Musik und alles Ungewöhnliche ziehen dich an. Normale Regeln passen nicht immer zu dir – und das ist gut so: Deine besondere Sicht inspiriert die Menschen um dich herum.',
      strengths: ['Grenzenlose Fantasie', 'Originelle Ideen', 'Inspiriert andere'],
      others: 'Andere sehen in dir ein Unikat – kreativ, ein wenig geheimnisvoll und voller überraschender Ideen.',
    },
    pink: {
      name: 'Rosenrosa',
      word: 'rosa, pink',
      vibe: 'Weiches Herz, große Liebe, sanfte Stärke.',
      desc: 'Deine Aura ist warm und zart wie das erste Licht im Frühling. Du liebst offen und gibst Menschen das Gefühl, gesehen zu werden – ob du an einen Geburtstag denkst oder merkst, wenn jemand still ist. Freundlichkeit fällt dir leicht, und du glaubst, dass kleine Gesten einen ganzen Tag verändern können. Sanft heißt nicht schwach: Dein Herz ist deine Stärke.',
      strengths: ['Endlose Freundlichkeit', 'Tiefes Mitgefühl', 'Lässt andere sich geliebt fühlen'],
      others: 'Andere sehen in dir einen süßen, tröstenden Menschen – die Freundin, deren Umarmung alles wieder gut macht.',
    },
  },
};
