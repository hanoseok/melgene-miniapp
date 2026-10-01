/* Gioco dell’anguria – Halloween (Suika Game) — italiano (/it/)
 * Stessa struttura di chiavi di en.js. Regole, livelli e punti in merge-core.js.
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
    title: 'Gioco dell’anguria – Halloween (Suika Game) gratis',
    description: 'Il gioco dell’anguria versione Halloween: lascia cadere dolcetti nel barattolo, unisci le coppie uguali e arriva alla zucca gigante. Gratis, senza download.',
    ogTitle: 'Gioco dell’anguria – Halloween 🎃 Fin dove arriverai?',
    ogDescription: 'Lascia cadere, abbina, unisci. Resta sotto la linea e scopri fin dove arrivi.',
  },
  siteName: 'Gioco dell’anguria – Halloween',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '🎃 Halloween · puzzle di fusione',
    h1Kicker: 'Gioco dell’anguria – Halloween',
    h1Html: 'Fin dove arriva<br>la tua <em>fusione</em>?',
    hook: 'Lascia cadere dolcetti nel barattolo. Due uguali che si toccano si uniscono in qualcosa di più grande, ma la pila non deve superare la linea.',
    how: { aim: 'Mira e lascia', match: 'Unisci due uguali', line: 'Sotto la linea' },
    facts: 'Niente timer · al tuo ritmo',
    start: 'Inizia a unire →',
  },

  play: {
    score: 'Punti',
    best: 'Record',
    next: 'Prossimo',
    nextAria: 'Prossimo pezzo: {name}',
    pause: 'Pausa',
    paused: 'In pausa',
    resume: 'Riprendi',
    full: 'Barattolo pieno!',
    chainAria: 'Ordine delle fusioni dal pezzo più piccolo al più grande',
    fieldAria: 'Barattolo di gioco. Muovi o trascina per mirare, poi lascia o fai clic per far cadere. Frecce per mirare, Spazio per far cadere.',
  },

  result: {
    full: 'Il barattolo trabocca!',
    points: 'punti',
    best: 'Record: {n}',
    newBest: 'Nuovo record!',
    biggest: 'Pezzo più grande',
    merges: 'Fusioni',
    top: 'Top {n}%',
    beat: 'Meglio del {pct}% dei giocatori',
    beatAll: 'Meglio di tutti gli altri punteggi finora',
    others: 'Confrontato con altri {n} punteggi',
    comparing: 'Confronto con gli altri giocatori…',
    retry: 'Gioca ancora',
    shareTitle: 'Gioco dell’anguria – Halloween',
    shareText: 'Ho fatto {score} punti al gioco dell’anguria di Halloween 🎃 Riesci a battermi?',
  },

  tiers: ['Caramella mais', 'Caramella', 'Lecca-lecca', 'Castagna', 'Mela', 'Fungo', 'Pipistrello', 'Fantasma', 'Sfera di cristallo', 'Zucca', 'Zucca lanterna'],

  og: {
    brand: '🎃 Gioco dell’anguria – Halloween',
    defaultKicker: 'Gioco di fusione di Halloween gratis',
    defaultTitle: 'Fin dove arriva la tua fusione?',
    defaultDesc: 'Lascia cadere · unisci due uguali · cresci',
  },

  faq: [
    { q: 'Come si gioca?', a: 'Muovi il dito o il mouse sopra il barattolo per mirare, poi lascia (o fai clic) per far cadere il pezzo. Puoi anche mirare con le frecce e far cadere con Spazio. Quando due pezzi identici si toccano, si uniscono nella misura successiva.' },
    { q: 'Quando finisce la partita?', a: 'Non c’è timer. La partita finisce quando la pila resta sopra la linea tratteggiata in alto per circa due secondi, quindi lascia spazio e pianifica le fusioni.' },
    { q: 'Come funziona il punteggio?', a: 'Ogni fusione dà punti, e quelle più grandi ne danno di più. Le reazioni a catena fanno salire il punteggio molto in fretta.' },
    { q: 'Il top % è vero?', a: 'Sì. A fine partita solo il tuo punteggio viene inviato in forma anonima al nostro server e confrontato con quello degli altri. Il top % compare solo se ci sono punteggi reali da confrontare, altrimenti non viene mostrato nulla. Il gioco si mette anche in pausa da solo quando cambi scheda.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Gioco dell’anguria – Halloween',
    description: 'Informativa sulla privacy del Gioco dell’anguria – Halloween: punteggi anonimi, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Gioco dell’anguria – Halloween (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. A fine partita solo il tuo punteggio (arrotondato alla decina) viene inviato al nostro server come conteggio anonimo, senza nome né identificativo personale. Alcune informazioni possono essere raccolte automaticamente durante l’uso, come descritto sotto.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e il tuo record, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze in <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (visualizzazioni, partite iniziate e finite, valutazioni). Nulla di questo ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa sulla privacy, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dal 2 ottobre 2026.'],
    ],
    back: '← Torna al Gioco dell’anguria – Halloween',
  },
};
