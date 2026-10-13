/* Gioco da 1 a 50 — italiano */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Gioco da 1 a 50 – Tocca i numeri in ordine',
    description: 'Gioca al gioco da 1 a 50 online: tocca i numeri in ordine il più in fretta possibile e batti il tuo record al centesimo. Modalità classica o rapida da 1 a 25. Gratis, senza download.',
    ogTitle: 'Gioco da 1 a 50 🔢 Quanto ci metti a toccare da 1 a 50?',
    ogDescription: 'Trova il numero successivo e toccalo, fino alla fine. Un test lampo di concentrazione e velocità.',
  },
  siteName: 'Gioco da 1 a 50',
  privacyLink: 'Informativa sulla privacy',
  start: {
    badge: '🔢 Tocca i numeri · velocità',
    h1Kicker: 'Gioco da 1 a 50',
    h1Html: 'Da 1 a 50,<br>più <em>veloce</em> che puoi',
    hook: 'I numeri sono sparsi sulla griglia. Trova il prossimo, toccalo e vai avanti fino in fondo. I tuoi occhi devono essere più rapidi delle dita.',
    how: { order: 'Tocca in ordine da 1', swap: 'Spuntano nuovi numeri', penalty: 'Errore +0,5 s' },
    facts: 'Conto alla rovescia 3-2-1 · tempo al centesimo',
    modeLabel: 'Scegli la modalità',
    modes: { classic: 'Classica', quick: 'Rapida' },
    start: 'Via! →',
  },
  play: {
    next: 'Prossimo',
    time: 'Tempo',
    progress: 'Fatti',
    go: 'VIA!',
    boardAria: 'Griglia del gioco da 1 a 50. Tocca i numeri in ordine, a partire da 1.',
    paused: 'In pausa · tocca per riprendere',
    aBlank: 'Casella vuota',
  },
  result: {
    done: 'Finito!',
    sec: 's',
    mistakesLabel: 'Errori',
    perLabel: 'Per numero',
    best: 'Record: {t}',
    newBest: 'Nuovo record!',
    penNote: 'Include +{s} s per gli errori',
    top: 'Top {n}%',
    beat: 'Più veloce del {pct}% dei giocatori',
    beatAll: 'Più veloce di tutti gli altri tempi finora',
    others: 'Confrontato con altri {n} tempi',
    comparing: 'Confronto con gli altri giocatori…',
    retry: 'Gioca ancora',
    shareTitle: 'Gioco da 1 a 50 – quanto sei veloce?',
    shareText: 'Ho toccato da 1 a {max} in {time} secondi 🔢 Riesci a battermi?',
  },
  og: {
    brand: '🔢 Gioco da 1 a 50',
    defaultKicker: 'Gioco di velocità gratis',
    defaultTitle: 'Quanto ci metti da 1 a 50?',
    defaultDesc: 'Trova il prossimo numero · batti il tempo',
  },
  faq: [
    {
      q: 'Come si gioca al gioco da 1 a 50?',
      a: 'Dopo un conto alla rovescia 3-2-1, una griglia 5×5 mostra i numeri da 1 a 25 in posizioni casuali. Tocca 1, poi 2, poi 3 e così via. In modalità Classica ogni casella toccata mostra un nuovo numero da 26 a 50, e continui fino a 50.',
    },
    {
      q: 'Cosa succede se tocco il numero sbagliato?',
      a: 'La casella trema e al tuo tempo si aggiungono 0,5 secondi, quindi toccare a caso non conviene. Toccare una casella vuota non fa nulla. Nel risultato vedi quanti errori hai fatto.',
    },
    {
      q: 'Che differenza c’è tra Classica e Rapida?',
      a: 'La Classica va da 1 a 50 ed è la modalità di riferimento per confrontare i tempi. La Rapida si ferma a 25 e ogni casella toccata resta vuota: è un riscaldamento breve e funziona come una tabella di Schulte.',
    },
    {
      q: 'Da dove viene il numero «Top %»?',
      a: 'Alla fine, la tua modalità e il tuo tempo arrotondato vengono confrontati con i tempi reali degli altri giocatori nella stessa modalità. Se non ci sono ancora tempi da confrontare, questo riquadro non compare.',
    },
  ],
  privacy: {
    "title": "Informativa sulla privacy | Gioco da 1 a 50",
    "description": "Informativa sulla privacy del Gioco da 1 a 50: tempi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Gioco da 1 a 50 (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Quando finisci una partita vengono inviati al nostro server solo la modalità e il tuo tempo (arrotondato al decimo di secondo) come conteggio anonimo, senza nome né identificativi personali. Durante l’uso del Servizio alcune informazioni possono essere raccolte automaticamente, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la tua lingua e il tuo record, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo i totali giornalieri per lingua (pagine viste, partite iniziate e finite, valutazioni). Nulla di tutto ciò ti identifica personalmente."
      ],
      [
        "5. Contatti",
        "Per domande su questa informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "6. Data di efficacia",
        "Questa informativa è valida dal 14 ottobre 2026."
      ]
    ],
    "back": "← Torna al Gioco da 1 a 50"
  },
};
