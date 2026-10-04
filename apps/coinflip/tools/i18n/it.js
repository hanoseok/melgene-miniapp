/* Testa o croce — italiano (tu). Stessa struttura di en.js (vedi i commenti). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Testa o croce online: lancia la moneta',
    description: 'Non riesci a decidere? Lancia una moneta online, testa o croce, e lascia scegliere al caso. Dai tu un nome ai due lati oppure tira da uno a tre dadi. Gratis, senza registrazione.',
    ogTitle: 'Testa o croce 🪙 Moneta e dadi',
    ogDescription: 'Lancia la moneta o i dadi e lascia decidere al caso.',
  },
  siteName: 'Testa o croce',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '🪙 Lo spareggio più equo',
    h1Kicker: 'Testa o croce',
    h1Html: 'Testa o croce?<br>Decide la <em>moneta</em>',
    hook: 'Dai un nome alle due opzioni, lancia la moneta e scegli quello che esce. Puoi anche tirare i dadi.',
    facts: 'Moneta e dadi · lati con il tuo nome · un lancio equo ogni volta',
    start: 'Lancia →',
  },

  tool: {
    title: 'Tocca a te',
    tabCoin: 'Moneta',
    tabDice: 'Dadi',
    namesLabel: 'Dai un nome ai due lati',
    namesHint: 'Di default sono testa e croce. Cambiali con le tue opzioni, come pizza e sushi.',
    sideA: 'Testa',
    sideB: 'Croce',
    fieldA: 'Nome del primo lato',
    fieldB: 'Nome del secondo lato',
    throwCoin: 'Lancia la moneta 🪙',
    diceLabel: 'Quanti dadi?',
    rollDice: 'Tira i dadi 🎲',
  },

  count: { one: '{n} lancio in questa sessione', other: '{n} lanci in questa sessione' },
  countDice: { one: '{n} tiro in questa sessione', other: '{n} tiri in questa sessione' },

  result: {
    titleCoin: 'È uscito',
    titleDice: 'Hai fatto',
    sum: 'Totale {n}',
    tallyTitle: 'Questa sessione',
    tallySide: '{name} {n}',
    againCoin: 'Lancia ancora',
    againDice: 'Tira ancora',
    change: 'Torna al lancio',
    shareTitle: 'Testa o croce online',
    shareTextCoin: 'Ho lanciato una moneta ed è uscito {name} 🪙',
    shareTextDice: 'Ho tirato i dadi e ho fatto {n} 🎲',
  },

  og: {
    brand: '🪙 Testa o croce',
    kicker: 'Testa o croce · moneta e dadi',
    title: 'Testa o croce?',
    desc: 'Lancia la moneta o i dadi · un lancio equo decide',
  },

  faq: [
    { q: 'Come funziona il lancio della moneta?', a: 'Se vuoi, dai un nome ai due lati e premi lancia. Il risultato viene estratto prima e la moneta gira per mostrarlo, quindi quello che vedi è sempre l’esito reale. Nella scheda Dadi tiri da uno a tre dadi a sei facce.' },
    { q: 'Il lancio è davvero equo?', a: 'Sì. Il risultato arriva dal generatore casuale crittografico del tuo browser (crypto.getRandomValues) con campionamento per rifiuto, quindi testa e croce hanno esattamente la stessa probabilità, come ogni faccia del dado. L’animazione serve solo per scena.' },
    { q: 'Posso usare le mie opzioni al posto di testa e croce?', a: 'Sì. Scrivi due nomi qualsiasi nei campi sopra la moneta, per esempio pizza e sushi, e il risultato mostrerà il nome del vincitore. Se lasci un campo vuoto torna il nome predefinito.' },
    { q: 'Cosa indicano i contatori alla fine?', a: 'Contano solo quanto hai lanciato in questa pagina da quando l’hai aperta, comprese le volte in cui è uscito ciascun lato. Si azzerano quando ricarichi e non vengono inviati da nessuna parte.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Testa o croce',
    description: 'Informativa sulla privacy di Testa o croce: i nomi che scrivi restano nel tuo browser, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Testa o croce (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. I nomi che scrivi e i tuoi risultati vengono elaborati solo nel tuo browser e non vengono inviati al nostro server. Tuttavia, durante l’uso possono essere raccolte automaticamente alcune informazioni, come descritto di seguito.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare la tua lingua, mostrare annunci e capire come viene usato. Puoi rifiutarli o eliminarli dalle impostazioni del browser; alcune funzioni potrebbero non andare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare i cookie per pubblicare annunci in base alle tue visite precedenti a questo e ad altri siti. Puoi saperne di più e modificare le preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo i totali giornalieri per lingua (visualizzazioni, lanci, valutazioni a stelle). Nulla di ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa sulla privacy, contatta il gestore del sito.'],
      ['6. Data di entrata in vigore', 'Questa informativa è in vigore dal 5 ottobre 2026.'],
    ],
    back: '← Torna a Testa o croce',
  },
};
