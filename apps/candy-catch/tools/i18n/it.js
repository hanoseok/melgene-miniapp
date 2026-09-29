/* Gioco acchiappa caramelle di Halloween — Italiano (/it/)
 * Stessa struttura di chiavi di en.js. Regole e punti in candy-catch-core.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap',
    display: "'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Acchiappa caramelle di Halloween – Gioco gratis',
    description: 'Gioco di Halloween: acchiappa caramelle con il secchiello a zucca, schiva ragni e fantasmi e fai combo per salire di punteggio. 50 secondi a partita, gratis e senza download.',
    ogTitle: 'Acchiappa caramelle di Halloween 🍬 Quante ne prendi?',
    ogDescription: 'Piovono caramelle dal cielo. 50 secondi, 3 vite: quanto riempirai il secchiello?',
  },
  siteName: 'Acchiappa caramelle di Halloween',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '🎃 Dolcetto o scherzetto · arcade',
    h1Kicker: 'Acchiappa caramelle di Halloween',
    h1Html: 'Quante caramelle<br>riesci a <em>prendere</em>?',
    hook: 'Stanotte piovono caramelle. Riempi il secchiello prima che scada il tempo… ma non tutto quello che cade è dolce.',
    how: { move: 'Trascina o ← →', catch: 'Prendi caramelle', avoid: 'Schiva i mostri' },
    facts: '50 secondi · 3 vite · combo',
    start: 'Si comincia →',
  },

  play: {
    score: 'Punti',
    time: 'Tempo',
    lives: 'Vite',
    livesAria: 'Vite rimaste: {n}',
    combo: 'Combo ×{n}',
    pause: 'Pausa',
    paused: 'In pausa',
    resume: 'Riprendi',
    go: 'Via!',
    fieldAria: 'Area di gioco. Trascina, muovi il mouse o usa le frecce per spostare il secchiello.',
  },

  result: {
    timeUp: 'Tempo scaduto!',
    outOfLives: 'Vite finite!',
    points: 'punti',
    best: 'Record: {n}',
    newBest: 'Nuovo record!',
    caught: 'Caramelle prese',
    streak: 'Combo più lunga',
    top: 'Top {n}%',
    beat: 'Meglio del {pct}% dei giocatori',
    beatAll: 'Meglio di tutti gli altri punteggi',
    others: 'Confrontato con altri {n} punteggi',
    comparing: 'Confronto con gli altri giocatori…',
    retry: 'Gioca ancora',
    shareTitle: 'Acchiappa caramelle di Halloween',
    shareText: 'Ho fatto {score} punti ad Acchiappa caramelle di Halloween 🍬 Riesci a battermi?',
  },

  og: {
    brand: '🍬 Acchiappa caramelle di Halloween',
    defaultKicker: 'Gioco arcade gratis',
    defaultTitle: 'Quante caramelle riesci ad acchiappare?',
    defaultDesc: 'Sposta il secchiello · prendi le caramelle · 50 secondi',
  },

  faq: [
    { q: 'Come si gioca?', a: 'Trascina il dito sull’area di gioco, muovi il mouse o tieni premute le frecce ← → per spostare il secchiello a zucca. Prendi le caramelle che cadono e stai alla larga dalle cose che fanno paura. Una partita dura 50 secondi o finché non perdi tutte e tre le vite.' },
    { q: 'Come funzionano punti e combo?', a: 'Ogni caramella vale punti, e quelle più rare e raffinate valgono di più. Prendine tante di fila per far crescere la combo: più lunga è la serie, più alto è il moltiplicatore. Una caramella persa o una presa spaventosa la azzerano.' },
    { q: 'La percentuale è vera?', a: 'Sì. A fine partita viene inviato in forma anonima al nostro server solo il tuo punteggio, che viene confrontato con quelli degli altri. La percentuale compare solo se ci sono punteggi veri con cui confrontarsi; altrimenti non viene mostrato nulla.' },
    { q: 'Perché il gioco si è fermato da solo?', a: 'Il gioco va in pausa da solo quando cambi scheda o app, così non perdi vite mentre sei via. Tocca Riprendi per continuare. Il tuo record resta salvato in questo browser.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Acchiappa caramelle di Halloween',
    description: 'Informativa sulla privacy di Acchiappa caramelle di Halloween: punteggi anonimi, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Acchiappa caramelle di Halloween (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. A fine partita solo il tuo punteggio (arrotondato alla decina) viene inviato al nostro server come conteggio anonimo, senza nome né identificativo personale. Alcune informazioni possono essere raccolte automaticamente durante l’uso, come descritto sotto.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e il tuo record, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (visualizzazioni, partite iniziate e finite, valutazioni). Nulla di questo ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa sulla privacy, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dal 30 settembre 2026.'],
    ],
    back: '← Torna ad Acchiappa caramelle di Halloween',
  },
};
