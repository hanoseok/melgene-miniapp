/* Corsa di animali — italiano. Stessa struttura di chiavi di en.js. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Corsa di animali – sorteggio con una gara online',
    description: 'Sorteggio con una corsa di animali: scrivi da 2 a 10 nomi e ognuno corre nella sua corsia. Vince il primo oppure l’ultimo offre il caffè. Casuale ed equo, gratis, senza registrazione.',
    ogTitle: 'Corsa di animali 🏁 Chi offre il caffè?',
    ogDescription: 'Scrivi i nomi, metti gli animali ai blocchi di partenza e lascia decidere la gara. Vince il primo o paga l’ultimo.',
  },
  siteName: 'Corsa di animali',
  privacyLink: 'Informativa sulla privacy',

  hero: {
    h1Kicker: 'Corsa di animali',
    h1Html: 'Non riuscite a decidere?<br><em>Lasciate correre gli animali</em>',
    hook: 'Chi offre il caffè? Chi comincia? Metti tutti in corsia e guarda la gara.',
  },

  ui: {
    modeLabel: 'Come decidiamo?',
    modeWin: '🏆 Vince il 1°',
    modeLose: '☕ Paga l’ultimo',
    countLabel: 'Corridori',
    countValue: '{n} corridori',
    less: 'Meno corridori',
    more: 'Più corridori',
    namesLabel: 'Chi corre?',
    namesHint: 'Una corsia vuota usa il nome predefinito. L’animale è solo per gioco e non cambia le probabilità di nessuno.',
    playerN: 'Giocatore {n}',
    nameAria: 'Nome per la corsia {n}',
    start: 'Via alla gara 🏁',
    fair: 'L’ordine d’arrivo viene sorteggiato con il caso crypto prima della partenza · i nomi restano sul tuo dispositivo',
    trackAria: 'Pista della gara',
    go: 'VIA!',
    bannerWin: '🏆 Vince chi taglia per primo il traguardo',
    bannerLose: '☕ Paga chi arriva ultimo',
    liveStart: 'Tre, due, uno, via! La gara è partita.',
  },

  errors: {
    tooFew: 'Servono almeno 2 corridori.',
    tooMany: 'In pista ci stanno al massimo 10 corridori.',
    badLink: 'Questo link è rotto, nessun nome è stato caricato.',
  },

  result: {
    winKicker: 'E il vincitore è',
    winTitle: 'Vince {name}! 🏆',
    winSub: 'Primo a tagliare il traguardo.',
    loseKicker: 'Ultimo al traguardo',
    loseTitle: '{name} arriva ultimo',
    loseSub: 'Che sfortuna! Questo giro di caffè lo offre {name} ☕',
    rankingTitle: 'Ordine d’arrivo',
    tagWin: 'Vincitore',
    tagLose: 'Paga ☕',
    edit: 'Cambia i nomi',
    shareNames: 'Copia il link con questi nomi',
    linkCopied: 'Link copiato. Apre gli stessi corridori, pronti a partire.',
    sharedNote: 'Corridori caricati da un link condiviso. Quando vuoi, si parte!',
    history: 'Ultime gare',
    historyClear: 'Cancella',
    historyWin: '🏆 {name}',
    historyLose: '☕ {name}',
    historyMeta: '{n} corridori',
    liveWin: '{name} vince la gara.',
    liveLose: '{name} arriva ultimo.',
    again: 'Un’altra gara 🏁',
    shareTitle: 'Corsa di animali',
    shareText: 'Non riuscite a decidere? Lasciate correre gli animali 🏁',
  },

  og: {
    brand: '🏁 Corsa di animali',
    kicker: 'Sorteggio con una gara · da 2 a 10',
    title: 'Lascia decidere la corsa degli animali',
    desc: 'Vince il primo, oppure l’ultimo offre il caffè',
  },

  faq: [
    { q: 'La gara è davvero casuale ed equa?', a: 'Sì. Appena premi via, l’intero ordine d’arrivo viene sorteggiato con il generatore casuale crittografico del browser (crypto.getRandomValues), campionamento per rifiuto e un mescolamento di Fisher-Yates. Ogni ordine ha esattamente la stessa probabilità; la gara sullo schermo lo mette soltanto in scena.' },
    { q: 'L’animale o la corsia cambiano le mie probabilità?', a: 'No. Gli animali vengono assegnati per corsia solo per divertimento. Qui il coniglio non è più veloce della tartaruga, e la corsia 1 ha le stesse probabilità della 10.' },
    { q: 'Perché gli arrivi sono sempre così combattuti?', a: 'Per lo spettacolo. Dopo il sorteggio, l’animazione aggiunge scatti, inciampi e un finale al fotofinish nel posto che conta, il primo o l’ultimo a seconda della modalità. La scena non cambia mai l’ordine.' },
    { q: 'Posso mandare gli stessi corridori agli amici?', a: 'Sì. «Copia il link con questi nomi» mette nel link solo i nomi e la modalità, mai un risultato. Chi lo apre fa una gara nuova. I tuoi ultimi risultati restano solo su questo dispositivo.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Corsa di animali',
    description: 'Informativa sulla privacy di Corsa di animali: nomi e risultati restano nel browser, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Corsa di animali (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né login. I nomi che inserisci vengono elaborati solo nel tuo browser e non sono inviati al nostro server. L’ultima lista di nomi e gli ultimi dieci risultati possono restare nella memoria locale del browser sul tuo dispositivo. Quando copi un link con i nomi, questi sono scritti nel link stesso e arrivano solo alle persone a cui lo mandi.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare lingua e impostazioni, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Per saperne di più e modificare le preferenze, visita le <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni degli annunci Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati propri che conservano solo totali giornalieri per lingua (pagine viste, gare iniziate e finite, valutazioni a stelle). Nulla di tutto ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dal 22 ottobre 2026.'],
    ],
    back: '← Torna a Corsa di animali',
  },
};
