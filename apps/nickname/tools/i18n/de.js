/* Nickname Generator — Deutsch (du). words: pro Stimmung { adj, noun } (Adjektive 'm/f/n', Nomen '|m' '|f' '|n'). Siehe en.js */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Nickname Generator – Süße & coole Namen',
    description: 'Dir fällt kein Nickname ein? Such dir eine Stimmung aus (süß, cool, lustig, verträumt), gib auf Wunsch deinen Namen dazu und bekomm per Klick einen Zufalls-Nickname. Neu würfeln, bis er passt. Gratis.',
    ogTitle: 'Nickname Generator ✨ Süße & coole Namen',
    ogDescription: 'Stimmung wählen, Namen dazugeben und den Nickname mit einem Tipp kopieren.',
  },
  siteName: 'Nickname Generator',
  privacyLink: 'Datenschutzerklärung',

  start: {
    badge: '🏷️ Keine Namensidee?',
    h1Kicker: 'Nickname Generator',
    h1Html: 'Finde den Nickname,<br>der <em>zu dir passt</em>',
    hook: 'Such dir eine Stimmung aus, gib auf Wunsch deinen Namen dazu und bekomm einen Nickname nur für dich.',
    facts: 'Süß, cool, lustig, verträumt · mischt deinen Namen ein · mit einem Tipp kopieren',
    start: 'Nickname erstellen →',
  },

  make: {
    title: 'Welche Stimmung darf es sein?',
    moodLabel: 'Stimmung wählen',
    moods: { cute: 'Süß', cool: 'Cool', funny: 'Lustig', dreamy: 'Verträumt', mystic: 'Geheimnisvoll' },
    nameLabel: 'Dein Name oder Buchstaben (optional)',
    nameHint: 'Wir mischen ihn in den Nickname. Bis zu 12 Zeichen, bleibt in deinem Browser.',
    namePlaceholder: 'z. B. Lena',
    numbers: '＋ Zahlen anhängen',
    poolCount: 'Kombinationen in dieser Stimmung: {n}+',
    make: 'Nickname erstellen 🎲',
  },

  result: {
    title: 'Dein Nickname',
    copy: 'Nickname kopieren',
    copied: 'Kopiert!',
    copyFail: 'Kopieren hat nicht geklappt. Markiere den Nickname und kopiere ihn von Hand.',
    again: 'Noch einer',
    change: 'Stimmung ändern',
    shareTitle: 'Nickname Generator',
    shareText: 'Der Nickname Generator hat mir „{nick}“ gegeben ✨',
  },

  style: { camel: true, order: 'adj-noun', nameSep: '_' },

  words: {
    cute: {
      adj: ['flauschiger/flauschige/flauschiges', 'kuscheliger/kuschelige/kuscheliges', 'winziger/winzige/winziges', 'süßer/süße/süßes', 'weicher/weiche/weiches', 'knuffiger/knuffige/knuffiges', 'pummeliger/pummelige/pummeliges', 'zarter/zarte/zartes', 'fluffiger/fluffige/fluffiges', 'putziger/putzige/putziges', 'wuscheliger/wuschelige/wuscheliges', 'funkelnder/funkelnde/funkelndes'],
      noun: ['Hase|m', 'Kätzchen|n', 'Welpe|m', 'Panda|m', 'Mochi|n', 'Marshmallow|m', 'Cupcake|m', 'Küken|n', 'Pfirsich|m', 'Pudding|m', 'Koala|m', 'Bärchen|n'],
    },
    cool: {
      adj: ['lautloser/lautlose/lautloses', 'rasanter/rasante/rasantes', 'eisiger/eisige/eisiges', 'atomarer/atomare/atomares', 'wilder/wilde/wildes', 'nächtlicher/nächtliche/nächtliches', 'königlicher/königliche/königliches', 'elektrischer/elektrische/elektrisches', 'glühender/glühende/glühendes', 'stürmischer/stürmische/stürmisches', 'blitzschneller/blitzschnelle/blitzschnelles', 'eiskalter/eiskalte/eiskaltes'],
      noun: ['Wolf|m', 'Falke|m', 'Viper|f', 'Reiter|m', 'Klinge|f', 'Sturm|m', 'Tiger|m', 'Komet|m', 'Titan|m', 'Habicht|m', 'Racer|m', 'Ninja|m'],
    },
    funny: {
      adj: ['schläfriger/schläfrige/schläfriges', 'mürrischer/mürrische/mürrisches', 'wackeliger/wackelige/wackeliges', 'tollpatschiger/tollpatschige/tollpatschiges', 'hinterlistiger/hinterlistige/hinterlistiges', 'moppeliger/moppelige/moppeliges', 'verrückter/verrückte/verrücktes', 'durchnässter/durchnässte/durchnässtes', 'alberner/alberne/albernes', 'fauler/faule/faules', 'grantiger/grantige/grantiges', 'kitzliger/kitzlige/kitzliges'],
      noun: ['Kartoffel|f', 'Nudel|f', 'Gurke|f', 'Waffel|f', 'Pinguin|m', 'Lama|n', 'Toast|m', 'Frikadelle|f', 'Walross|n', 'Brezel|f', 'Kobold|m', 'Hamster|m'],
    },
    dreamy: {
      adj: ['sternenklarer/sternenklare/sternenklares', 'wolkiger/wolkige/wolkiges', 'nebliger/nebelige/nebliges', 'samtiger/samtige/samtiges', 'silbriger/silbrige/silbriges', 'pastelliger/pastellige/pastelliges', 'schwebender/schwebende/schwebendes', 'leuchtender/leuchtende/leuchtendes', 'seidiger/seidige/seidiges', 'dunstiger/dunstige/dunstiges', 'goldener/goldene/goldenes', 'friedlicher/friedliche/friedliches'],
      noun: ['Mond|m', 'Wolke|f', 'Aurora|f', 'Sternenstaub|m', 'Wiegenlied|n', 'Horizont|m', 'Blütenblatt|n', 'Galaxie|f', 'Flüstern|n', 'Tagtraum|m', 'Sonnenaufgang|m', 'Wiese|f'],
    },
    mystic: {
      adj: ['hohler/hohle/hohles', 'kryptischer/kryptische/kryptisches', 'verschleierter/verschleierte/verschleiertes', 'gespenstischer/gespenstische/gespenstisches', 'schattenhafter/schattenhafte/schattenhaftes', 'dämmriger/dämmrige/dämmriges', 'verwunschener/verwunschene/verwunschenes', 'verborgener/verborgene/verborgenes', 'vergessener/vergessene/vergessenes', 'finsterer/finstere/finsteres', 'aschfahler/aschfahle/aschfahles', 'rätselhafter/rätselhafte/rätselhaftes'],
      noun: ['Rabe|m', 'Spuk|m', 'Orakel|n', 'Rätsel|n', 'Chiffre|f', 'Geist|m', 'Schatten|m', 'Sphinx|f', 'Relikt|n', 'Rune|f', 'Glut|f', 'Mitternacht|f'],
    },
  },

  og: {
    brand: '🏷️ Nickname Generator',
    kicker: 'Stimmung wählen · Namen finden',
    title: 'Finde den Nickname, der zu dir passt',
    desc: 'Süß, cool, lustig, verträumt · mischt deinen Namen ein · mit einem Tipp kopieren',
  },

  faq: [
    { q: 'Wie funktioniert der Nickname Generator?', a: 'Wähle eine Stimmung, gib auf Wunsch deinen Namen oder ein paar Buchstaben ein und tippe auf Erstellen. Das Tool setzt ein Adjektiv und ein Nomen aus der Wortliste dieser Stimmung zusammen und mischt deine Buchstaben ein, falls du welche angegeben hast.' },
    { q: 'Ist der Nickname wirklich zufällig?', a: 'Ja. Die Wörter werden mit dem kryptografischen Zufallsgenerator deines Browsers (crypto.getRandomValues) gezogen, daher ist jedes Wort der Liste gleich wahrscheinlich. Das Flackern vor dem Ergebnis ist nur Show.' },
    { q: 'Kann ich meinen eigenen Namen eingeben?', a: 'Ja, bis zu 12 Zeichen: Name, Initialen oder beliebige Buchstaben. Was du eingibst, wird nur in deinem Browser verwendet und weder gesendet noch gespeichert.' },
    { q: 'Kann jemand anderes denselben Nickname bekommen?', a: 'Das ist möglich, denn jede Stimmung hat Hunderte Kombinationen. Meldet ein Spiel oder Dienst, dass der Nickname vergeben ist, erstelle einen neuen oder schalte „Zahlen anhängen“ ein.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Nickname Generator',
    description: 'Datenschutzerklärung des Nickname Generators: Der eingegebene Name bleibt in deinem Browser, Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Der Nickname Generator (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestinformationen.',
    sections: [
      ['1. Erhobene Informationen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Der Name oder die Buchstaben, die du eingibst, und die gewählte Stimmung werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Während der Nutzung können jedoch automatisch einige Informationen erhoben werden, wie unten beschrieben.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers nutzen, um deine Sprache und deine letzte Stimmung zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; dann funktionieren manche Funktionen möglicherweise nicht wie vorgesehen.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Anzeigen auf Basis deiner früheren Besuche dieser und anderer Websites auszuliefern. Mehr dazu und deine Einstellungen findest du in den <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes können wir Google Analytics (GA4) und eigene Zähler nutzen, die nur Tagessummen pro Sprache speichern (Seitenaufrufe, erstellte Nicknames, Sternebewertungen). Nichts davon identifiziert dich persönlich.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültig ab', 'Diese Erklärung gilt ab dem 5. Oktober 2026.'],
    ],
    back: '← Zurück zum Nickname Generator',
  },
};
