/* Strafkarten-Ziehen (Penalty Card Flip) — Deutsch (/de/ ; Sprache über Cookie oder gespeicherte Einstellung)
 * Die Logik steht in penalty-core.js; alle sichtbaren Texte stehen hier. Schlüssel mit Endung Html dürfen HTML enthalten (nur <br>, <em>, <a>).
 * Bildschirme: Start (Teaser + Button + Anzeige) → Einstellungen (Personen, Strafkarten, Strafen, Namen) → Umdrehen (verdeckte Karten) → Ende (wer bekommt die Strafe + gemeinsamer Endbildschirm).
 * Die FAQ erscheint nur auf dem gemeinsamen Endbildschirm. Platzhalter wie {n} {k} bleiben unverändert.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@600&display=swap',
    display: "'Fredoka'",
    displayWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'auto',
  },

  meta: {
    title: 'Strafen Karten Spiel – Strafen online auslosen',
    description: 'Kostenloses Strafen-Kartenspiel für Partys und Trinkabende. Anzahl der Personen und Strafkarten wählen und die verdeckten Karten nacheinander umdrehen. Ohne Anmeldung.',
    ogTitle: 'Strafkarten-Ziehen 🃏 Karte umdrehen, Strafe auslosen',
    ogDescription: 'Faire Auslosung von Partystrafen, im Browser gemischt.',
  },
  siteName: 'Strafkarten-Ziehen',
  privacyLink: 'Datenschutzerklärung',

  hero: {
    h1Kicker: 'Strafkarten-Ziehen',
    h1Html: 'Karten umdrehen,<br><em>die Strafe auslosen</em>',
    hook: 'Pro Person liegt eine verdeckte Karte. Einige verbergen eine Strafe, die anderen sind sicher. Wer hat es diesmal erwischt?',
  },

  ui: {
    playersLabel: 'Anzahl der Personen',
    playersDec: 'Eine Person weniger',
    playersInc: 'Eine Person mehr',
    penaltyLabel: 'Anzahl der Strafkarten',
    penaltyDec: 'Eine Strafkarte weniger',
    penaltyInc: 'Eine Strafkarte mehr',
    penaltyHint: 'Startet bei etwa einem Drittel der Personen. Du kannst es ändern.',
    itemsLabel: 'Strafen',
    itemsHint: 'Eine Strafe pro Zeile. Die Strafkarten ziehen in zufälliger Reihenfolge aus dieser Liste. Frei bearbeitbar.',
    itemsPh: 'Ein Lied singen\nEinen Toast ausbringen',
    resetItems: 'Beispielstrafen wiederherstellen',
    itemsCount: '{count} Zeilen',
    namesBtn: '+ Namen eintragen (optional)',
    namesLabel: 'Namen in der Reihenfolge',
    namesPh: 'Lena\nMax\nJonas',
    namesHint: 'Leer lassen, dann heißen die Züge „1., 2., 3.“. Weniger Namen als Personen ist in Ordnung.',
    start: 'Karten mischen 🃏',
    begin: 'Start',
    setupTitle: 'Einstellungen',
    fair: 'Einmal mit kryptografischem Zufall gemischt · nichts verlässt deinen Browser',
  },

  errors: {
    playersRange: 'Bitte zwischen 2 und 12 Personen wählen.',
    penaltiesRange: 'Strafkarten: mindestens 1, höchstens so viele wie Personen.',
    itemsEmpty: 'Bitte mindestens eine Strafe eintragen.',
    itemsTooMany: 'Es sind höchstens 30 Strafen möglich.',
    namesTooMany: 'Es gibt mehr Namen als Personen. Entferne einen Namen oder erhöhe die Anzahl.',
    badLink: 'Dieser Ergebnislink ist kaputt oder unvollständig, daher wird nichts angezeigt.',
  },

  draw: {
    progress: '{done}/{n} umgedreht',
    left: 'Noch {n} Karten',
    turn: 'Als Nächstes: {who}',
    turnNum: '{k}. Zug',
    numbered: '{k}.',
    pick: 'Tippe eine beliebige verdeckte Karte an. Alle Karten waren beim Mischen schon festgelegt.',
    gridAria: 'Verdeckte Strafkarten',
    cardAria: 'Karte {k}, verdeckt',
    penaltyTag: 'Strafe!',
    safeTag: 'Sicher',
    revealPenalty: '{who}: {text}',
    revealSafe: '{who} ist diesmal sicher',
    revealNone: 'Tippe eine Karte an, dann erscheint das Ergebnis hier.',
    flipAll: 'Alle umdrehen',
    reshuffle: 'Neu mischen',
    seeResults: 'Ergebnisse ansehen',
    done: 'Alle Karten sind umgedreht.',
    live: '{who}: {text}',
    liveSafe: '{who}: sicher',
  },

  result: {
    heading: 'Wer hat die Strafe bekommen',
    sharedBadge: '🃏 Geteiltes Ergebnis',
    sharedNote: 'Das ist das Ergebnis aus dem Link. Es wird nicht noch einmal gemischt.',
    summary: '{k} Strafe · {s} sicher',
    summaryMany: '{k} Strafen · {s} sicher',
    listHead: 'Strafen dieser Runde',
    safeList: 'Sicher: {names}',
    copy: 'Als Text kopieren',
    copied: 'Ergebnis kopiert',
    copyLink: 'Link kopieren',
    linkCopied: 'Link kopiert. Wer ihn öffnet, sieht genau dieses Ergebnis.',
    again: 'Ich probier’s auch',
    edit: 'Einstellungen ändern',
    textTitle: '🃏 Strafkarten-Ziehen Ergebnis',
    textSafe: 'sicher',
    shareTitle: 'Strafkarten-Ziehen',
    shareText: 'Karten umdrehen und eine Partystrafe auslosen 🃏',
  },

  og: {
    brand: '🃏 Strafkarten-Ziehen',
    kicker: 'Partystrafen · eine Karte nach der anderen',
    title: 'Strafen per Karten umdrehen auslosen',
    desc: 'Zufällig, fair und in Sekunden fertig',
    sample: 'Ein Lied singen',
  },

  defaults: [
    'Ein Lied singen (nur der Refrain reicht)',
    'Einen Toast in einem Satz ausbringen',
    'Eine superniedliche Pose machen',
    'Dem Nachbarn links ein Glas Wasser einschenken',
    '10 Sekunden Roboter tanzen',
    'Dich mit einem weiteren Satz noch einmal vorstellen',
    'Den Song abspielen, den der Nachbar rechts wählt',
    'Einen Witz über dich selbst erzählen',
    'Den nächsten Satz mit Filmtrailer-Stimme vorlesen',
    'Den Lieblingssong des Nächsten auf Anhieb erraten',
  ],

  faq: [
    { q: 'Ist das Mischen wirklich fair?', a: 'Ja. Beim Mischen werden die Karten einmal mit dem kryptografischen Zufallsgenerator deines Browsers (crypto.getRandomValues) verteilt, mit Rejection Sampling und einem Fisher-Yates-Shuffle. Alles ist in diesem Moment festgelegt, es spielt also keine Rolle, welche Karte jemand antippt.' },
    { q: 'Wie werden die Strafen zugeordnet?', a: 'Jede Strafkarte bekommt in zufälliger Reihenfolge eine Zeile deiner Strafenliste. Gibt es weniger Zeilen als Strafkarten, wird die gemischte Liste wiederverwendet. Passe die Zeilen vor dem Mischen an eure Runde an.' },
    { q: 'Darf man eine Strafe ablehnen?', a: 'Ja. Strafen sind nur zum Spaß gedacht und immer freiwillig. Möchte jemand keine ausführen, kann die Gruppe eine andere, harmlosere Strafe wählen.' },
    { q: 'Wie teile ich das Ergebnis mit der Gruppe?', a: 'Tippe auf den Ergebnisbildschirm auf „Als Text kopieren“, um die Liste in einen Chat zu kopieren, oder auf „Link kopieren“. Der Link enthält genau dieses Ergebnis, wer ihn öffnet, sieht dieselben Karten ohne neues Mischen.' },
  ],

  privacy: {
    title: 'Datenschutzerklärung | Strafkarten-Ziehen',
    description: 'Datenschutzerklärung für Strafkarten-Ziehen: Namen, Strafen und Ergebnisse bleiben im Browser; Cookies, Werbung und Statistik.',
    h1: 'Datenschutzerklärung',
    introHtml: 'Strafkarten-Ziehen (der „Dienst“) respektiert deine Privatsphäre und verarbeitet nur die unten beschriebenen Mindestdaten.',
    sections: [
      ['1. Erhobene Informationen', 'Der Dienst funktioniert ohne Konto oder Anmeldung. Die von dir eingegebenen Namen, Strafen und Ergebnisse werden nur in deinem Browser verarbeitet und nicht an unseren Server gesendet. Deine letzten Einstellungen werden im lokalen Speicher deines Browsers auf deinem Gerät gespeichert; du kannst sie jederzeit im Browser löschen. Wenn du einen Ergebnislink kopierst, werden Namen, Strafen und Ergebnisse in den Link selbst geschrieben und nur mit den Personen geteilt, denen du ihn schickst.'],
      ['2. Cookies und ähnliche Technologien', 'Der Dienst kann Cookies und den lokalen Speicher deines Browsers verwenden, um Sprache und Einstellungen zu merken, Werbung anzuzeigen und die Nutzung zu verstehen. Du kannst sie in den Browsereinstellungen ablehnen oder löschen; dann funktionieren manche Funktionen womöglich nicht wie erwartet.'],
      ['3. Werbung (Google AdSense)', 'Der Dienst zeigt Werbung über Google AdSense an. Google und seine Partner können Cookies verwenden, um Anzeigen auf Grundlage deiner früheren Besuche auf dieser und anderen Websites auszuspielen. Mehr dazu und Einstellungen findest du unter <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google-Anzeigeneinstellungen</a>.'],
      ['4. Statistik', 'Zur Verbesserung des Dienstes nutzen wir eventuell Google Analytics (GA4) sowie eigene zusammengefasste Zähler, die pro Sprache nur Tagessummen speichern (Seitenaufrufe, begonnene und beendete Runden). Daraus lässt sich niemand persönlich identifizieren.'],
      ['5. Kontakt', 'Bei Fragen zu dieser Datenschutzerklärung wende dich bitte an den Betreiber der Website.'],
      ['6. Gültigkeit', 'Diese Erklärung gilt ab dem 11. November 2026.'],
    ],
    back: '← Zurück zu Strafkarten-Ziehen',
  },
};
