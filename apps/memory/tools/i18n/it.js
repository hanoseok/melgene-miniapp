/* Gioco di memoria — italiano */
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
    title: 'Gioco di memoria – Gira le carte di Halloween',
    description: 'Gioca gratis al gioco di memoria online: gira le carte di Halloween due alla volta e trova tutte le coppie. Tre livelli, cronometro e mosse. Senza download.',
    ogTitle: 'Gioco di memoria 🎃 Riesci a trovare tutte le coppie?',
    ogDescription: 'Zucche, fantasmi e pipistrelli si nascondono sotto le carte. Girane due alla volta e metti alla prova la memoria.',
  },
  siteName: 'Gioco di memoria di Halloween',
  privacyLink: 'Privacy',
  start: {
    badge: '🎃 Carte di Halloween',
    h1Kicker: 'Gioco di memoria',
    h1Html: 'Gira le carte,<br>trova le <em>coppie</em>',
    hook: 'Zucche, fantasmi e pipistrelli si nascondono sotto le carte. Girane due alla volta e ricorda bene dove si trova ogni figura.',
    how: 'Gira due carte · stessa figura = coppia',
    levelLabel: 'Scegli un livello',
    levels: { easy: 'Facile', normal: 'Medio', hard: 'Difficile' },
    start: 'Inizia →',
  },
  play: {
    time: 'Tempo',
    moves: 'Mosse',
    pairs: 'Coppie',
    boardAria: 'Tavolo del gioco di memoria. Gira due carte per trovare una coppia.',
    aDown: 'Carta {n}, coperta',
    paused: 'In pausa · tocca per continuare',
  },
  result: {
    done: 'Tutte le coppie trovate!',
    sec: 's',
    movesLabel: 'Mosse',
    accLabel: 'Precisione',
    best: 'Record: {t}',
    newBest: 'Nuovo record!',
    top: 'Top {n}%',
    beat: 'Più veloce del {pct}% dei giocatori',
    beatAll: 'Più veloce di tutti i tempi finora',
    others: 'Confrontato con altri {n} tempi di questo livello',
    comparing: 'Confronto con gli altri giocatori…',
    retry: 'Gioca ancora',
    shareTitle: 'Gioco di memoria di Halloween – com’è la tua memoria?',
    shareText: 'Ho trovato tutte le {pairs} coppie in {time} s e {moves} mosse 🎃 Riesci a battermi?',
  },
  og: {
    brand: '🃏 Gioco di memoria',
    defaultKicker: 'Gioco di memoria gratis',
    defaultTitle: 'Riesci a trovare tutte le coppie?',
    defaultDesc: 'Gira · ricorda · abbina',
  },
  faq: [
    {
      q: 'Come si gioca al gioco di memoria?',
      a: 'All’inizio tutte le carte sono coperte. Tocca una carta e poi una seconda. Se le due figure sono uguali restano scoperte come coppia; altrimenti si rigirano dopo un attimo. Trova tutte le coppie per finire. Il cronometro parte con la prima carta.',
    },
    {
      q: 'Cosa conta come mossa e come si calcola la precisione?',
      a: 'Ogni volta che giri due carte è una mossa. La precisione è il numero di coppie diviso per le mosse, quindi trovarle tutte senza errori vale il 100%. Gli errori non aggiungono tempo, ma costano mosse.',
    },
    {
      q: 'Che differenza c’è tra i livelli?',
      a: 'Facile ha 12 carte (6 coppie), Medio 16 carte (8 coppie) e Difficile 24 carte (12 coppie). Carte e figure vengono rimescolate a ogni partita e il tuo record viene salvato separatamente per ogni livello.',
    },
    {
      q: 'Cosa succede se passo a un’altra app?',
      a: 'Il cronometro si ferma e le carte vengono coperte, così nessuno può sbirciare. Quando torni, tocca il tavolo e la partita riprende da dove l’avevi lasciata.',
    },
    {
      q: 'Da dove viene il «Top %»?',
      a: 'Alla fine, il tuo livello e il tempo arrotondato vengono confrontati con i tempi reali degli altri giocatori dello stesso livello. Se non ci sono ancora altri tempi, il confronto semplicemente non compare.',
    },
  ],
  privacy: {
    "title": "Informativa sulla privacy | Gioco di memoria",
    "description": "Informativa sulla privacy del gioco di memoria: tempi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il gioco di memoria di Halloween (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Quando finisci una partita, al nostro server vengono inviati solo il livello e il tempo (arrotondato al decimo di secondo) come conteggio anonimo, senza nome né identificativi personali. Durante l’uso del Servizio alcune informazioni possono essere raccolte automaticamente, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e i tuoi record, mostrare annunci e capire come viene usato. Puoi rifiutarli o eliminarli nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Per saperne di più e modificare le preferenze visita <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori nostri che conservano solo totali giornalieri per lingua (pagine viste, partite iniziate e finite, valutazioni a stelle). Nessuno di questi dati ti identifica personalmente."
      ],
      [
        "5. Contatti",
        "Per qualsiasi domanda su questa informativa, contatta il gestore del sito."
      ],
      [
        "6. Data di efficacia",
        "Questa informativa è valida dal 16 ottobre 2026."
      ]
    ],
    "back": "← Torna al gioco di memoria"
  },
};
