/* Estrarre l’ordine casuale — italiano (/it/). Stessa struttura di chiavi di en.js (vedi intestazione). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap',
    display: "'Bagel Fat One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Ordine casuale – estrarre l’ordine di una lista di nomi',
    description: 'Estrai un ordine casuale gratis: incolla i nomi o usa i numeri da 1 a N e ottieni un ordine equo per interrogazioni, presentazioni, turni di gioco o pulizie. Senza registrazione.',
    ogTitle: 'Ordine casuale 🔢 Chi comincia?',
    ogDescription: 'Mescola una lista di nomi in un ordine equo e svelalo una carta alla volta.',
  },
  siteName: 'Ordine casuale',
  privacyLink: 'Informativa sulla privacy',

  hero: {
    h1Kicker: 'Estrarre l’ordine casuale',
    h1Html: 'Chi va <em>per primo?</em>',
    hook: 'Scrivi i nomi, mescola una volta e l’ordine è deciso, dal primo all’ultimo.',
  },

  ui: {
    presetLabel: 'A cosa serve l’ordine?',
    modeLabel: 'Nomi o numeri',
    modeNames: 'Nomi',
    modeNumbers: 'Numeri 1–N',
    namesLabel: 'Nomi, uno per riga',
    namesPh: 'Giulia\nLeonardo\nSofia\nFrancesco',
    namesHint: 'Incolla una lista da WhatsApp o da un foglio di calcolo. Anche le virgole separano.',
    namesCount: '{n} / {max}',
    clear: 'Cancella',
    numbersLabel: 'Quanti?',
    numbersDec: 'Uno in meno',
    numbersInc: 'Uno in più',
    numbersHint: 'Mescola i numeri da 1 a N. Comodo con i numeri del registro o dei posti.',
    numberItem: 'n. {n}',
    fromLabel: 'Svelare l’ordine',
    fromFirst: 'Dal 1º',
    fromLast: 'Dall’ultimo',
    shuffle: 'Estrai l’ordine 🔀',
    fair: 'Mescolato una sola volta con casualità crittografica · i nomi restano nel browser',
  },

  presets: [
    { label: 'Ordine semplice', heading: 'L’ordine estratto' },
    { label: 'Presentazioni', heading: 'Ordine delle presentazioni' },
    { label: 'Turni di gioco', heading: 'Ordine dei turni' },
    { label: 'Pulizie', heading: 'Turni delle pulizie' },
  ],

  errors: {
    namesFew: 'Scrivi almeno 2 nomi, uno per riga, oppure passa ai numeri.',
    namesMany: 'Puoi usare al massimo 40 nomi.',
    numbersRange: 'Scegli un numero tra 2 e 40.',
    badLink: 'Questo link è rotto o incompleto, quindi non viene mostrato nulla.',
  },

  reveal: {
    progress: '{k} su {n} svelati',
    tapHint: 'Tocca la carta o «Avanti». L’ordine è stato deciso al momento del mescolamento.',
    first: 'Svela ▶',
    next: 'Avanti ▶',
    done: 'Vedi l’ordine completo',
    auto: 'Automatico',
    autoStop: 'Pausa',
    showAll: 'Mostra tutto',
    soFar: 'Svelati finora',
    live: 'Numero {k}: {who}',
  },

  result: {
    sharedBadge: '🔢 Ordine condiviso',
    sharedNote: 'Questo è l’ordine salvato nel link. Non è stato rimescolato.',
    summary: '{n} in tutto, dal primo all’ultimo',
    copy: 'Copia come testo',
    copied: 'Ordine copiato',
    copyLink: 'Copia link',
    linkCopied: 'Link copiato. Chi lo apre vede esattamente questo ordine.',
    linkTooLong: 'La lista è troppo lunga per un link: è stato copiato solo l’indirizzo della pagina.',
    edit: 'Modifica i nomi',
    again: 'Rimescola 🔀',
    againShared: 'Rimescola / Provo anch’io 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: 'Ordine casuale',
    shareText: 'Ecco il nostro ordine, estratto a caso 🔢',
  },

  og: {
    brand: '🔢 Ordine casuale',
    kicker: 'Presentazioni · giochi · pulizie',
    title: 'Chi comincia? Estrai un ordine equo',
    desc: 'Inserisci i nomi, l’ordine è pronto in un attimo',
  },

  faq: [
    { q: 'L’estrazione è davvero equa?', a: 'Sì. Quando premi estrai, il generatore casuale crittografico del browser (crypto.getRandomValues) esegue un mescolamento di Fisher–Yates con campionamento per rifiuto, quindi ogni ordine possibile ha la stessa probabilità. L’ordine completo è deciso in quel momento; le carte lo mostrano soltanto.' },
    { q: 'Che differenza c’è con l’estrazione di un vincitore?', a: 'L’estrazione di un vincitore si ferma a un nome. Qui ognuno riceve un posto dal primo all’ultimo: proprio quello che serve per interrogazioni, presentazioni, turni di gioco, interventi o pulizie.' },
    { q: 'Meglio svelare dal primo o dall’ultimo?', a: 'Dal primo è più rapido quando tutti devono prepararsi. Dall’ultimo crea più suspense, perché chi va per primo si scopre alla fine.' },
    { q: 'I nomi vengono salvati o inviati?', a: 'No. I nomi restano nel tuo browser. L’ultima lista è salvata su questo dispositivo per riusarla, e un link condiviso porta l’ordine solo alle persone a cui lo mandi.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Ordine casuale',
    description: 'Informativa sulla privacy di Ordine casuale: nomi e ordini restano nel browser; cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Ordine casuale (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né login. I nomi o i numeri inseriti e l’ordine ottenuto sono elaborati solo nel tuo browser e non vengono inviati al nostro server. L’ultima lista è conservata nella memoria locale del browser sul tuo dispositivo. Quando copi un link, l’ordine è scritto nel link stesso ed è condiviso solo con le persone a cui lo invii.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare lingua e impostazioni, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo i totali giornalieri per lingua (pagine viste, estrazioni iniziate e concluse). Nessuno di questi dati ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dal 15 novembre 2026.'],
    ],
    back: '← Torna a Ordine casuale',
  },
};
