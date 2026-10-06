/* Generatore di lotto — it. 키 구조는 en.js 와 같다. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual'
  },
  meta: {
    title: 'Generatore di lotto: numeri casuali fortunati',
    description: 'Cerchi numeri fortunati? Scegli il 6/45 coreano, un 5/50 + 2 stelle in stile Euro, il Powerball USA o un tuo intervallo, fissa o escludi numeri ed estrai fino a cinque giocate. Solo per divertimento, senza registrazione.',
    ogTitle: 'Generatore di lotto 🎱 Numeri casuali',
    ogDescription: 'Estrai numeri fortunati per gioco, fino a cinque giocate insieme.'
  },
  siteName: 'Generatore di lotto',
  privacyLink: 'Privacy',
  start: {
    badge: '🎱 Solo per divertimento',
    h1Kicker: 'Generatore di lotto',
    h1Html: 'Oggi sei <em>fortunato</em>?<br>Estrai i tuoi numeri',
    hook: 'Scegli un gioco, fissa o escludi qualche numero e guarda le palline rotolare fuori. Fino a cinque giocate in una volta.',
    facts: 'Corea · stile Euro · Powerball · personalizzato · solo intrattenimento',
    start: 'Estrai i numeri →'
  },
  tool: {
    title: 'Imposta l’estrazione',
    presetLabel: 'Quale gioco?',
    presets: {
      kr: 'Corea 6/45',
      euro: 'Stile Euro 5/50 + 2',
      us: 'Powerball USA',
      custom: 'Personalizzato'
    },
    presetInfo: {
      kr: '6 numeri da 1 a 45',
      euro: '5 numeri da 1 a 50 + 2 stelle da 1 a 12',
      us: '5 numeri da 1 a 69 + 1 Powerball da 1 a 26',
      custom: 'Scegli quanti numeri e il più alto'
    },
    pickLabel: 'Numeri da estrarre',
    maxLabel: 'Numero più alto',
    gamesLabel: 'Quante giocate?',
    fixedLabel: 'Numeri da tenere (facoltativo)',
    fixedHint: 'Sempre presenti in ogni giocata, ad es. 7, 21',
    fixedPh: '7, 21',
    excludeLabel: 'Numeri da escludere (facoltativo)',
    excludeHint: 'Non verranno mai estratti, ad es. 4, 13',
    excludePh: '4, 13',
    draw: 'Estrai le palline 🎱',
    drawing: 'Estrazione in corso…',
    machine: 'Le palline girano nella macchina delle estrazioni',
    note: 'Solo per intrattenimento. Ogni combinazione è ugualmente probabile e questo strumento non può prevedere né migliorare le tue possibilità di vincere.',
    errors: {
      bad: 'Usa numeri interi da 1 a {max}, separati da virgole.',
      overlap: 'Un numero non può essere tenuto ed escluso insieme.',
      tooMany: 'Puoi tenere al massimo {pick} numeri.',
      notEnough: 'Troppi numeri esclusi per estrarne {pick}.'
    }
  },
  result: {
    title: 'I tuoi numeri fortunati',
    game: 'Giocata {n}',
    extraNames: {
      euro: 'Stelle',
      us: 'Powerball'
    },
    copy: 'Copia i numeri 📋',
    copied: 'Numeri copiati!',
    again: 'Estrai ancora',
    change: 'Torna alle impostazioni',
    disclaimer: 'Solo per intrattenimento. Nessuna previsione, nessuna promessa di vincita.',
    shareTitle: 'Generatore di lotto',
    shareText: 'I miei numeri fortunati 🎱\n{numbers}'
  },
  og: {
    brand: '🎱 Generatore di lotto',
    kicker: 'Numeri casuali · per gioco',
    title: 'Oggi sei fortunato?',
    desc: 'Scegli un gioco ed estrai fino a cinque giocate'
  },
  faq: [
    {
      q: 'Come estraggo i miei numeri?',
      a: 'Scegli un gioco (6/45 coreano, stile Euro, Powerball USA o un tuo intervallo), imposta da una a cinque giocate e premi il pulsante di estrazione. I numeri vengono decisi prima, le palline escono una alla volta e poi ogni giocata viene mostrata in ordine crescente.'
    },
    {
      q: 'I numeri sono davvero casuali?',
      a: 'Sì. Vengono dal generatore casuale crittografico del tuo browser (crypto.getRandomValues) con campionamento per rifiuto, quindi ogni numero consentito ha esattamente la stessa probabilità e non c’è distorsione. L’animazione delle palline è solo scenografica.'
    },
    {
      q: 'A cosa servono i numeri da tenere e da escludere?',
      a: 'I numeri tenuti compaiono in ogni giocata e gli altri vengono estratti intorno a loro. Quelli esclusi non escono mai. Valgono solo per i numeri principali, non per le stelle o il Powerball.'
    },
    {
      q: 'Così aumento le mie possibilità di vincere?',
      a: 'No. In un’estrazione reale ogni combinazione è ugualmente probabile e nessuno strumento può prevedere il risultato. Questo generatore è solo un modo divertente per scegliere i numeri e non promette alcuna vincita.'
    }
  ],
  privacy: {
    title: 'Informativa sulla privacy | Generatore di lotto',
    description: 'Informativa sulla privacy del Generatore di lotto: i numeri che scrivi restano nel tuo browser, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Generatore di lotto (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      [
        '1. Informazioni raccolte',
        'Il Servizio funziona senza account né accesso. I numeri che scrivi e i tuoi risultati vengono elaborati solo nel tuo browser e non vengono inviati al nostro server. Tuttavia, durante l’uso possono essere raccolte automaticamente alcune informazioni, come descritto di seguito.'
      ],
      [
        '2. Cookie e tecnologie simili',
        'Il Servizio può usare cookie e la memoria locale del browser per ricordare la tua lingua, mostrare annunci e capire come viene usato. Puoi rifiutarli o eliminarli dalle impostazioni del browser; alcune funzioni potrebbero non andare come previsto.'
      ],
      [
        '3. Pubblicità (Google AdSense)',
        'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare i cookie per pubblicare annunci in base alle tue visite precedenti a questo e ad altri siti. Puoi saperne di più e modificare le preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci di Google</a>.'
      ],
      [
        '4. Statistiche',
        'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo i totali giornalieri per lingua (visualizzazioni, estrazioni, valutazioni a stelle). Nulla di ciò ti identifica personalmente.'
      ],
      [
        '5. Contatti',
        'Per domande su questa informativa sulla privacy, contatta il gestore del sito.'
      ],
      [
        '6. Data di entrata in vigore',
        'Questa informativa è in vigore dal 7 ottobre 2026.'
      ]
    ],
    back: '← Torna al Generatore di lotto'
  }
};
