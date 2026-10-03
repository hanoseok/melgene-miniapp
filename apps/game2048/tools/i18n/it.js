/* Gioco 2048 (edizione Halloween) — italiano */
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
    title: 'Gioco 2048 – gioca gratis online, versione Halloween',
    description: 'Gioca al gioco 2048 online in versione Halloween: scorri o usa le frecce, unisci le tessere con lo stesso numero e arriva a 2048. Gratis, senza scaricare nulla.',
    ogTitle: 'Gioco 2048 🎃 Riesci ad arrivare a 2048?',
    ogDescription: 'Scorri, unisci, raddoppia. Un 2048 da brivido da giocare subito nel browser.',
  },
  siteName: 'Gioco 2048',
  privacyLink: 'Privacy',

  start: {
    badge: '🎃 Edizione Halloween · rompicapo',
    h1Kicker: 'Gioco 2048',
    h1Html: 'Riesci ad arrivare<br>a <em>2048</em>?',
    hook: 'Fai scorrere le tessere. Due numeri uguali si incontrano e diventano uno solo — continua a raddoppiare prima che la griglia si riempia.',
    how: { swipe: 'Scorri per spostare', match: 'Unisci gli uguali', goal: 'Arriva a 2048' },
    facts: 'Niente timer · scorri o usa le frecce',
    start: 'Gioca ora →',
  },

  play: {
    score: 'Punti',
    best: 'Record',
    boardAria: 'Griglia di gioco. Scorri o usa le frecce della tastiera per spostare le tessere.',
    won: 'Hai fatto 2048!',
    keepGoing: 'Continua',
    finish: 'Finisci qui',
    over: 'Nessuna mossa rimasta!',
  },

  result: {
    over: 'Nessuna mossa rimasta!',
    won: 'Sei arrivato a 2048!',
    points: 'punti',
    best: 'Record: {n}',
    newBest: 'Nuovo record!',
    biggest: 'Tessera più grande',
    moves: 'Mosse',
    top: 'Top {n}%',
    beat: 'Meglio del {pct}% dei giocatori',
    beatAll: 'Meglio di tutti gli altri punteggi finora',
    others: 'Confrontato con altri {n} punteggi',
    comparing: 'Confronto con gli altri giocatori…',
    retry: 'Gioca ancora',
    shareTitle: 'Gioco 2048 – edizione Halloween',
    shareText: 'Ho fatto {score} punti al gioco 2048 🎃 Riesci a battermi?',
  },

  og: {
    brand: '🔢 Gioco 2048',
    defaultKicker: '2048 di Halloween gratis',
    defaultTitle: 'Riesci ad arrivare a 2048?',
    defaultDesc: 'Scorri · unisci · raddoppia',
  },

  faq: [
    { q: 'Come si gioca a 2048?', a: 'Scorri sulla griglia (o premi le frecce) e tutte le tessere si spostano insieme in quella direzione. Quando due tessere con lo stesso numero si toccano, si uniscono in una sola che vale il doppio. Dopo ogni mossa compare un nuovo 2 o 4.' },
    { q: 'Quando finisce la partita?', a: 'Non c’è un timer. La partita finisce quando la griglia è piena e nessuna tessera vicina ha lo stesso numero. Arrivato a 2048 puoi fermarti lì o continuare per fare più punti.' },
    { q: 'Come si calcolano i punti?', a: 'Ogni unione aggiunge il valore della nuova tessera al punteggio, quindi le unioni più grandi valgono di più. Il tuo record viene salvato solo in questo browser.' },
    { q: 'Il top % è reale?', a: 'Sì. A fine partita viene inviato in forma anonima al nostro server solo il tuo punteggio, che viene confrontato con quello degli altri. Il top % compare solo quando ci sono punteggi reali da confrontare; altrimenti non viene mostrato nulla.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Gioco 2048',
    description: 'Informativa sulla privacy del gioco 2048: punteggi anonimi, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Il gioco 2048 (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.',
    sections: [
      ['1. Dati raccolti', 'Il Servizio funziona senza account né accesso. A fine partita viene inviato al nostro server solo il tuo punteggio (arrotondato a 20 punti) come conteggio anonimo, senza nome né identificativi personali. Alcuni dati possono essere raccolti automaticamente durante l’uso, come descritto sotto.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e il tuo record, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo i totali giornalieri per lingua (pagine viste, partite iniziate e finite, valutazioni). Niente di tutto ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di entrata in vigore', 'Questa informativa è in vigore dal 4 ottobre 2026.'],
    ],
    back: '← Torna al gioco 2048',
  },
};
