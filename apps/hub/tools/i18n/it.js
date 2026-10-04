/* Portale Melgene Apps (hub) — italiano (/it/).
 * privacy.introHtml e il corpo di privacy.sections sono HTML; il resto è testo semplice.
 * ui è usato da script.js ed è incluso nella pagina come window.PAGE_I18N.
 * Niente spoiler: i testi della selezione descrivono l’atmosfera di ogni app, mai le vere domande o i risultati. */
module.exports = {
  siteName: 'Melgene Apps',
  // 머리글 워드마크: 'Melgene' + 작은 배지 (공통 STRINGS.it.brandBadge 와 같아야 한다)
  brand: { word: 'Melgene', badge: 'Apps' },
  typography: { display: "'Gabarito', var(--font-sans)" },
  meta: {
    title: 'Mini giochi gratis e test di personalità | Melgene Apps',
    description:
      'Mini giochi gratis e test di personalità che si aprono subito nel browser, senza download né registrazione. Ogni mini app dura circa un minuto.',
    ogTitle: 'Melgene Apps: mini giochi gratis e test di personalità',
    ogDescription: 'Mini giochi, test di personalità e altro ancora. Senza download né registrazione: tocchi e giochi in un minuto.',
  },
  homeAria: 'Home di Melgene Apps',
  h1: 'Mini giochi gratis e test di personalità',
  curation: {
    h2: 'Mini app di oggi',
    items: [
      {
        id: 'invite',
        kicker: 'Fallo tu',
        headline: 'Crea l’invito per la festa di Halloween',
        blurb: 'Inserisci i dettagli, scegli un tema e salva o condividi.',
      },
      {
        id: 'lunch',
        kicker: 'Non sai cosa mangiare?',
        headline: 'Gira la slot e scegli il pasto',
        blurb: 'Scegli pasto e umore e lascia decidere alla slot.',
      },
      {
        id: 'merge',
        kicker: 'Gioco veloce',
        headline: 'Lascia cadere, unisci, cresci',
        blurb: 'Due uguali si fondono in uno più grande. Non farlo traboccare!',
      },
      {
        id: 'costume',
        kicker: 'Test di personalità',
        headline: 'Da cosa ti travesti ad Halloween?',
        blurb: 'Rispondi a poche situazioni e scopri il costume giusto per te.',
      },
      {
        id: 'ghost',
        kicker: 'Crealo tu',
        headline: 'Crea il tuo piccolo fantasma',
        blurb: 'Scegli forma, faccia e cappello, poi salvalo o invialo.',
      },
      {
        id: 'team',
        kicker: 'Fare squadre',
        headline: 'Squadre casuali ed eque in un tocco',
        blurb: 'Scrivi i nomi, scegli quante squadre e mescola.',
      },
      {
        id: 'lovestyle',
        kicker: 'Test di personalità',
        headline: 'Che tipo di partner sei?',
        blurb: 'Dieci piccoli momenti di coppia per scoprire come ami.',
      },
      {
        id: 'game2048',
        kicker: 'Rompicapo',
        headline: 'Scorri, unisci, arriva a 2048',
        blurb: 'Unisci i numeri uguali. Il puzzle classico in versione Halloween.',
      },
      {
        id: 'aura',
        kicker: 'Test di personalità',
        headline: 'Di che colore è la tua aura?',
        blurb: 'Rispondi a qualche momento quotidiano e scopri la tua luce.',
      },
      {
        id: 'candy-catch',
        kicker: 'Gioco veloce',
        headline: 'Acchiappa le caramelle che cadono',
        blurb: 'Muovi il secchiello a zucca e schiva ciò che fa paura.',
      },
    ],
  },
  browse: {
    h2: 'Tutte le mini app',
    searchLabel: 'Cerca una mini app',
    searchPlaceholder: 'Cerca una mini app',
    catLabel: 'Categorie',
    sortLabel: 'Ordina per',
  },
  ui: {
    // "Sorteggi" per la categoria vote (ruota, sorteggio): più naturale di una traduzione letterale di "vote".
    cats: { all: 'Tutte', game: 'Giochi', test: 'Test', create: 'Crea', vote: 'Sorteggi' },
    sorts: { popular: 'Popolari', rating: 'Più votate', newest: 'Novità' },
    totalHtml: 'Finora giocato <strong>{n} volte</strong>',
    play: 'Gioca',
    newBadge: 'NUOVO',
    plays: '{n} partite',
    ratingAria: 'Valutato {avg} su 5 ({votes} valutazioni)',
    prev: 'Selezione precedente',
    next: 'Selezione successiva',
    goTo: 'Mostra selezione {n}',
    count: '{n} app',
    countOne: '1 app',
    emptyCat: 'Ancora nessuna mini app in questa categoria.',
    emptySearch: 'Nessun risultato per «{q}». Prova un’altra parola o guarda tutte le mini app.',
    reset: 'Mostra tutte',
  },
  faqTitle: 'Domande frequenti',
  // Visibile in fondo al portale (+ FAQPage JSON-LD). Breve, senza spoiler.
  faq: [
    [
      'Cos’è Melgene Apps?',
      'Melgene Apps è una raccolta gratuita di mini app: mini giochi veloci, test di personalità e app che trasformano poche risposte in qualcosa di tuo. Ognuna dura circa un minuto e si apre subito nel browser.',
    ],
    [
      'Devo scaricare qualcosa o registrarmi?',
      'No. Ogni mini gioco e test è una pagina web che funziona su telefono, tablet e computer: basta inviare il link e i tuoi amici possono giocare subito. Se lo usi spesso, scegli «Aggiungi alla schermata Home» dal menu del browser per tenerlo come un’app.',
    ],
    [
      'Raccogliete dati personali?',
      'No. Non chiediamo mai nome, email o numero di telefono. Cuori, voti e numero di partite sono totali anonimi per ogni app, e un link di condivisione salva solo le risposte necessarie a mostrare quel risultato.',
    ],
    [
      'Con che frequenza arrivano nuove mini app?',
      'Aggiungiamo di continuo nuovi giochi e test di personalità seguendo le tendenze del momento. Le novità hanno il badge NUOVO per due settimane e compaiono per prime ordinando per Novità.',
    ],
  ],
  privacyLink: 'Informativa sulla privacy',
  og: {
    h1Html: 'Mini giochi gratis<br>e test di personalità',
    tag: 'Niente download. Niente registrazione. Si gioca.',
  },
  privacy: {
    title: 'Informativa sulla privacy | Melgene Apps',
    description:
      'Informativa sulla privacy di Melgene Apps: pubblicità (Google AdSense), conteggi anonimi di partite, cuori e voti, cookie e memoria del browser.',
    h1: 'Informativa sulla privacy',
    introHtml:
      'Melgene Apps (il «Servizio») è una raccolta di mini app che puoi usare senza account. Rispettiamo la tua privacy e trattiamo solo il minimo di informazioni necessario per far funzionare il Servizio, come descritto di seguito.',
    sections: [
      [
        '1. Informazioni che non raccogliamo',
        'Il Servizio non chiede né raccoglie dati personali come nome, email, numero di telefono o un account. Quello che inserisci in ogni mini app viene elaborato, per impostazione predefinita, solo nel tuo browser.',
      ],
      [
        '2. Conteggi anonimi: partite, cuori e voti (Supabase)',
        'Per mostrare partite, cuori e voti, salviamo solo quanto segue su Supabase (un servizio di database): totali cumulativi per mini app (partite e cuori), voti da 1 a 5 stelle per mini app, e totali giornalieri per data, mini app e lingua (visualizzazioni di pagina, partite completate e se è stata mostrata una pubblicità). Per non contare due volte la stessa visita entro 30 secondi, il server conserva brevemente un hash monodirezionale del tuo indirizzo IP e lo elimina automaticamente, di solito entro un giorno. Per contare un solo voto per browser, il tuo browser conserva un identificativo casuale di cui il server salva solo l’hash. Quando crei un link di condivisione, salviamo solo le risposte necessarie a mostrare quel risultato a chi lo apre. Nulla di tutto questo serve a identificarti.',
      ],
      [
        '3. Pubblicità (annunci automatici Google AdSense)',
        'Il Servizio mostra annunci tramite gli annunci automatici di Google AdSense, quindi è Google a scegliere dove appaiono. Google e i suoi partner possono usare cookie per mostrare annunci in base ai tuoi interessi. Puoi controllare e modificare le impostazioni degli annunci personalizzati nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci Google</a>.',
      ],
      [
        '4. Statistiche (Google Analytics)',
        'Il Servizio può usare Google Analytics (GA4) per statistiche sui visitatori e per migliorare il Servizio. Questi dati sono usati solo a fini statistici e non ti identificano personalmente.',
      ],
      [
        '5. Cookie e memoria del browser',
        'Impostazioni come la lingua, l’ultima categoria e l’ultimo ordinamento usati, o i voti che hai dato, sono salvate solo nel tuo browser (localStorage e un cookie che ricorda la tua lingua). Puoi eliminare o bloccare cookie e dati del sito in qualsiasi momento dalle impostazioni del browser.',
      ],
      ['6. Contatti', 'Per qualsiasi domanda su questa informativa sulla privacy, contatta il gestore del sito.'],
      ['7. Data di entrata in vigore', 'Questa informativa è in vigore dal 26 settembre 2026.'],
    ],
    back: '← Torna a Melgene Apps',
  },
};
