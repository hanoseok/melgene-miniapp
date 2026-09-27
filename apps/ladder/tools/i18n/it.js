/* Gioco della scala — Italiano (/it/)
 * Termini di ricerca: "gioco della scala", "sorteggio online", "amidakuji".
 * page.* viene inserito nell'HTML statico da tools/gen-i18n.js; ui.* è incluso nella pagina per ladder.js.
 */
module.exports = {
  siteName: 'Gioco della scala',
  meta: {
    title: 'Gioco della scala, sorteggio online | Melgene Apps',
    description: 'Chi paga il caffè? Dove si pranza? Chi lava i piatti? Questo sorteggio online gratuito (un gioco della scala, detto anche amidakuji) decide in modo equo in pochi secondi — senza installazione né registrazione. Condividi la stessa scala con un link.',
    ogTitle: 'Gioco della scala — il sorteggio equo, gratis in 1 minuto',
    ogDescription: 'Inserisci nomi e risultati, tocca e segui il percorso. Un sorteggio online gratuito, senza installazione.',
  },
  fontCss: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap', // Jua 에 없는 ã õ ç à è ì ò ù → Fredoka (fr·es 와 같음)
  app: {
    name: 'Gioco della scala',
    currency: 'EUR',
    description: 'Un gioco della scala gratuito online (un sorteggio) per scegliere dove pranzare, chi paga il caffè, assegnare le faccende o stabilire un ordine di turno. Inserisci i giocatori e i risultati per ottenere una scala casuale ed equa, poi condividi esattamente la stessa con un link.',
  },
  setup: {
    badge: '🪜 Gratis online',
    h1Html: 'Non riesci a decidere?<br>Fatti aiutare dal <em>gioco della scala</em>',
    hook: 'Aggiungi nomi e risultati, poi lascia fare al destino. Pranzo, caffè, faccende, ordine di turno — tutto deciso in modo equo.',
    countLabel: 'Numero di giocatori',
    minusAria: 'Meno giocatori',
    plusAria: 'Più giocatori',
    presetLabel: 'Scelte rapide',
    presets: { lunch: '🍕 Pranzo', coffee: '☕ Chi paga il caffè', clean: '🧹 Faccende', order: '🔢 Ordine di turno' },
    namesLabel: 'Giocatori',
    resultsLabel: 'Risultati',
    shuffle: '🔀 Mescola',
    build: 'Crea la scala →',
  },
  play: {
    edit: '← Modifica',
    rebuild: '🔁 Nuova scala',
    hint: 'Tocca un giocatore per seguire il suo percorso',
    revealAll: 'Rivela tutto',
    finalTitle: 'Risultati finali',
  },
  privacyLink: 'Informativa sulla privacy',

  // FAQ breve e senza spoiler, mostrata solo nella schermata finale condivisa (MG_FAQ)
  faq: [
    { q: 'Il gioco della scala è davvero equo?', a: 'Sì. I pioli vengono posizionati a caso ogni volta e i percorsi non si incrociano mai, quindi nessuno può prevedere o truccare il risultato.' },
    { q: 'Posso fare una nuova scala con gli stessi giocatori?', a: 'Tocca "Nuova scala" per mantenere giocatori e risultati, ma generare una scala casuale completamente nuova.' },
    { q: 'Quanti giocatori possono partecipare?', a: 'Da 2 a 10 giocatori.' },
    { q: 'Funziona sul cellulare?', a: 'Sì. È pensato per il tocco e la scala si adatta automaticamente a qualsiasi dimensione dello schermo.' },
  ],

  ui: {
    defaultName: 'Giocatore {n}',
    win: 'Vincitore 🎉',
    lose: 'Niente',
    coffeeWin: 'Paga caffè',
    coffeeLose: 'Salvo',
    order: ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º'],
    pools: {
      lunch: ['Pizza', 'Tacos', 'Hamburger', 'Sushi', 'Kebab', 'Insalata', 'Panini', 'Ramen', 'Pasta', 'Focaccia'],
      clean: ['Piatti', 'Aspirare', 'Bucato', 'Spazzatura', 'Bagno', 'Spesa', 'Spolverare', 'Pavimenti', 'Piante', 'Riciclo'],
    },
    ariaName: 'Nome giocatore {n}',
    ariaResult: 'Risultato {n}',
    ariaTrace: 'Segui il percorso di {name}',
    ariaHidden: 'Risultato {n}, non ancora rivelato',
    ariaRevealed: '{result} rivelato',
    shareTitle: 'Guarda questo gioco della scala',
    shareText: 'Ho creato una scala — prova lo stesso percorso e scopri dove arrivi!',
    retryLabel: 'Nuova scala',
  },

  og: {
    badge: '🪜 Gratis online',
    title: 'Gioco della scala',
    tag: 'Pranzo, caffè e faccende, decisi in modo equo',
  },

  privacy: {
    title: 'Informativa sulla privacy | Gioco della scala',
    description: 'Informativa sulla privacy del Gioco della scala — uso di cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Il Gioco della scala (il "Servizio") rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Puoi usare il Servizio senza registrarti né accedere. I nomi e i risultati che inserisci non vengono mai salvati sui nostri server; sono elaborati solo nel tuo browser (memoria locale e URL della pagina). Alcune informazioni possono essere raccolte automaticamente durante l\'uso del Servizio, come descritto di seguito.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie per mostrare pubblicità e capire come viene utilizzato il Servizio. Puoi rifiutare o eliminare i cookie nelle impostazioni del tuo browser; alcune funzioni potrebbero non funzionare correttamente se lo fai.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra pubblicità tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti web. Puoi saperne di più e modificare le impostazioni di personalizzazione degli annunci su <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci Google</a>.'],
      ['4. Statistiche (Google Analytics)', 'Il Servizio può usare Google Analytics (GA4) per capire il numero di visitatori e le fonti di traffico e migliorarlo. Questi dati sono usati solo a fini statistici e non ti identificano personalmente.'],
      ['5. Link di condivisione', 'I link creati con "Condividi" contengono i nomi dei giocatori e il testo dei risultati che hai inserito, oltre alla struttura della scala, codificati nell\'URL. Ti consigliamo di non inserire informazioni che possano identificare una persona.'],
      ['6. Contatti', 'Per qualsiasi domanda su questa Informativa sulla privacy, contatta il gestore del sito.'],
      ['7. Data di entrata in vigore', 'Questa politica è in vigore dal 1° gennaio 2026.'],
    ],
    back: '← Torna al Gioco della scala',
  },
};
