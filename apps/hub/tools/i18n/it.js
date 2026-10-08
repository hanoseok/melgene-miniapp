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
        id: 'hangul-name',
        kicker: "Giornata dell’hangul",
        headline: "Il tuo nome scritto in coreano",
        blurb: "Scrivi il nome e ottienilo in hangul su una card.",
      },
      {
        id: 'dice',
        kicker: "Per i giochi da tavolo",
        headline: "Lancia i dadi nel browser",
        blurb: "Fino a sei dadi, dal d4 al d20. Lanci equi.",
      },
      {
        id: 'brick',
        kicker: 'Classico arcade',
        headline: 'Una palla contro un muro al neon',
        blurb: 'Rimandala con la racchetta e spacca tutto. 3 vite, sempre più veloce.',
      },
      {
        id: 'mentalage',
        kicker: 'Test di personalità',
        headline: 'Quanti anni ha la tua testa?',
        blurb: '12 domande quotidiane, due minuti. La tua età mentale in numero.',
      },
      {
        id: 'fancytext',
        kicker: 'Crealo tu',
        headline: 'Dai stile al tuo testo',
        blurb: 'Trasforma il testo in font speciali e copialo con un tocco.',
      },
      {
        id: 'mole',
        kicker: 'Gioco di riflessi',
        headline: 'Colpisci le talpe, evita le bombe',
        blurb: 'Toccale prima che si nascondano. 30 secondi, un titolo.',
      },
      {
        id: 'nickname',
        kicker: 'Crealo tu',
        headline: 'Un nickname che ti somiglia',
        blurb: 'Scegli lo stile e ottieni un nickname nuovo con un tocco.',
      },
      {
        id: 'coinflip',
        kicker: 'Indeciso?',
        headline: 'Testa o croce, o un dado',
        blurb: 'Lancia una moneta o fino a tre dadi, sempre equo.',
      },
      {
        id: 'lotto',
        kicker: 'Un po\' di fortuna?',
        headline: 'Numeri del lotto per gioco',
        blurb: 'Scegli un gioco ed estrai fino a cinque giocate.',
      },
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
        id: 'animal',
        kicker: 'Test di personalità',
        headline: 'Che animale sei?',
        blurb: 'Otto momenti quotidiani, due minuti. Scopri il tuo lato selvaggio.',
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
  // Piè di pagina di tutte le pagine del portale (Chi siamo · Guide · Termini · Privacy · Contatti). Testo semplice (viene escapato).
  footerNav: { about: 'Chi siamo', guides: 'Guide', terms: 'Termini di utilizzo', privacy: 'Privacy', contact: 'Contatti' },
  aboutPage: {
    title: 'Chi siamo | Melgene Apps',
    description: 'Melgene Apps è un piccolo studio indipendente che crea minigiochi, test della personalità e strumenti creativi gratis nel browser, in 12 lingue. Ecco come lavoriamo.',
    h1: 'Chi è Melgene Apps',
    lead: 'Melgene Apps è un piccolo studio indipendente che realizza mini app gratuite da aprire in qualsiasi browser: giochi veloci, test della personalità leggeri, piccoli strumenti creativi e aiutini per le decisioni di tutti i giorni. Niente download, niente account, e quasi tutte durano più o meno un minuto.',
    sections: [
      {
        h: 'Cosa realizziamo',
        p: [
          'Ogni mini app di Melgene fa una cosa sola, ma la fa bene. Alcune sono giochi arcade da finire in pausa caffè, come colpisci la talpa, il gioco dei mattoncini o un puzzle di fusione. Altre sono test della personalità che trasformano qualche situazione quotidiana in un risultato giocoso da condividere. Altre ancora ti aiutano a creare qualcosa, come una scritta decorata, un invito per una festa o un soprannome, oppure a risolvere una piccola decisione con una ruota, il gioco della scala o il lancio di una moneta.',
          'Pubblichiamo nuove app con regolarità, spesso in base alle stagioni e alle feste, e continuiamo a migliorare quelle già uscite osservando come le persone le usano davvero.',
        ],
      },
      {
        h: 'Perché lo facciamo',
        p: ['Pensiamo che i bei momenti online debbano essere rapidi, gentili e gratuiti. Molti siti di giochi o quiz li nascondono dietro registrazioni, pop-up e inviti a installare un’app. Noi puntiamo al contrario: tocchi un link, l’app si apre, giochi e, con un altro tocco, la mandi a un amico.'],
      },
      {
        h: 'Come nasce e viene testata ogni app',
        p: ['Ogni app parte da un breve progetto: a chi è rivolta, quanto deve durare una partita e cosa mostra la schermata del risultato. Poi la costruiamo come pagina web leggera e la testiamo prima della pubblicazione:'],
        list: [
          'Su schermi di smartphone piccoli (larghi 360 px) oltre che su tablet e browser desktop',
          'In tutte le 12 lingue, controllando che ogni riga ci stia e si legga in modo naturale',
          'Con controlli automatici su link non funzionanti, traduzioni mancanti e struttura delle pagine',
          'Senza spoiler: la schermata iniziale incuriosisce ma non svela mai domande o risultati',
        ],
      },
      {
        h: 'Pensate per lo smartphone, in 12 lingue',
        p: ['Quasi tutti giocano dal telefono, quindi ogni app è progettata prima di tutto per uno schermo stretto. Melgene Apps è disponibile in italiano, inglese, giapponese, cinese, coreano, francese, tedesco, thailandese, vietnamita, spagnolo, portoghese e russo. Scriviamo ogni lingua pensando a chi la legge invece di tradurre parola per parola, e usiamo i nomi che le persone cercano davvero nel loro Paese.'],
      },
      {
        h: 'Rispetto della privacy fin dall’inizio',
        p: ['Non ti serve mai un account e non ti chiediamo mai nome, email o numero di telefono. Quello che scrivi in un’app viene elaborato nel tuo browser. Partite, cuori e valutazioni sono solo totali anonimi per app. Il sito si sostiene con la pubblicità di Google AdSense; trovi tutti i dettagli nella nostra Informativa sulla privacy.'],
      },
      {
        h: 'Una nota sui test della personalità',
        p: ['I nostri test della personalità, i test dell’età mentale e i quiz simili sono pensati per divertire. Non sono valutazioni psicologiche, mediche o professionali e nessun risultato dovrebbe essere usato per prendere decisioni importanti su di te o su altre persone. Goditeli come spunto di conversazione e come momento di svago.'],
      },
      {
        h: 'Scrivici',
        p: ['Leggiamo tutti i messaggi. Se trovi un errore, hai un’idea per una nuova mini app o vuoi parlare di una collaborazione, visita la pagina Contatti o scrivi a contact@melgene.com.'],
      },
    ],
  },
  contactPage: {
    title: 'Contatti | Melgene Apps',
    description: 'Contatta Melgene Apps via email per suggerimenti, segnalazioni di errori, proposte di collaborazione o richieste sulla privacy. Di solito rispondiamo in pochi giorni lavorativi.',
    h1: 'Contattaci',
    lead: 'Domande, idee o problemi? Siamo un piccolo team e leggiamo personalmente ogni messaggio.',
    emailH: 'Email',
    emailNote: 'Di solito rispondiamo entro pochi giorni lavorativi.',
    sections: [
      {
        h: 'Per cosa puoi scriverci',
        p: ['Scrivici pure per qualsiasi cosa riguardi Melgene Apps, per esempio:'],
        list: [
          'Suggerimenti e idee per nuovi minigiochi, test o strumenti',
          'Segnalazioni di errori: una pagina che non si apre, un pulsante che non risponde, un testo tagliato',
          'Errori di traduzione o frasi che suonano poco naturali nella tua lingua',
          'Proposte di collaborazione, licenze o richieste della stampa',
          'Richieste sulla privacy e domande su dati o cookie',
        ],
      },
      {
        h: 'Come segnalare un errore',
        p: ['Per aiutarci a risolverlo in fretta, indica il nome della mini app, la lingua che stavi usando, il tuo dispositivo e browser (per esempio iPhone con Safari o Android con Chrome) e descrivi in breve cosa è successo. Uno screenshot aiuta moltissimo.'],
      },
      {
        h: 'Tempi di risposta',
        p: ['Di solito rispondiamo entro pochi giorni lavorativi; durante le festività potrebbe volerci un po’ di più. Non ti chiederemo mai password o dati di pagamento.'],
      },
    ],
  },
  termsPage: {
    title: 'Termini di utilizzo | Melgene Apps',
    description: 'Termini di utilizzo di Melgene Apps: minigiochi e test gratuiti nel browser, forniti così come sono per divertimento, regole d’uso, link di condivisione e pubblicità di terzi.',
    h1: 'Termini di utilizzo',
    updated: 'Ultimo aggiornamento: 9 ottobre 2026',
    lead: 'Questi Termini di utilizzo si applicano a Melgene Apps (il «Servizio»), compresi il portale e tutte le mini app dei nostri siti. Usando il Servizio accetti questi termini. Se non li accetti, ti chiediamo di non usare il Servizio.',
    sections: [
      { h: '1. Il Servizio', p: ['Melgene Apps offre gratuitamente minigiochi, test della personalità, strumenti creativi e aiuti per decidere che funzionano nel browser. Non serve un account. Possiamo aggiungere, modificare o rimuovere app e funzioni in qualsiasi momento.'] },
      { h: '2. Fornito così com’è', p: ['Il Servizio è fornito «così com’è» e «come disponibile», senza garanzie di alcun tipo. Ci impegniamo perché funzioni bene, ma non garantiamo che sia sempre disponibile, privo di errori o adatto a uno scopo particolare. Nei limiti consentiti dalla legge, non siamo responsabili di perdite o danni derivanti dal suo utilizzo.'] },
      { h: '3. Solo per divertimento', p: ['I risultati dei test della personalità, dei test dell’età mentale, delle estrazioni casuali e di funzioni simili servono a divertirsi. Non sono consigli scientifici, psicologici, medici, finanziari o professionali. Un risultato casuale, come i numeri del lotto, non aumenta le tue probabilità di vincere.'] },
      {
        h: '4. Uso consentito',
        p: ['Usando il Servizio ti impegni a non:'],
        list: [
          'Usarlo per scopi illeciti, dannosi o offensivi',
          'Inserire contenuti d’odio, molesti, sessualmente espliciti o che violano i diritti altrui',
          'Disturbare o sovraccaricare il Servizio, estrarne dati in massa o accedervi senza autorizzazione',
          'Manipolare partite, cuori, valutazioni o annunci, anche con strumenti automatici o clic non validi',
        ],
      },
      { h: '5. Ciò che crei e condividi', p: ['Alcune app ti permettono di scrivere nomi o testi, creare un’immagine o generare un link di condivisione. Sei responsabile di ciò che inserisci e condividi. Un link di condivisione conserva solo le informazioni necessarie a mostrare quel risultato e chiunque lo abbia può aprirlo, quindi non inserire dati personali o sensibili. Possiamo rimuovere i link che violano questi termini.'] },
      { h: '6. Pubblicità e cookie', p: ['Il Servizio è gratuito perché è sostenuto dalla pubblicità. Gli annunci sono forniti da terzi come Google AdSense, che possono usare cookie e tecnologie simili per mostrarli e misurarli, compresi gli annunci personalizzati. Non controlliamo il contenuto degli annunci di terzi né i siti a cui rimandano. Puoi saperne di più e gestire le tue scelte nella nostra Informativa sulla privacy e nelle Impostazioni annunci di Google.'] },
      { h: '7. Proprietà intellettuale', p: ['Design, codice, testi, illustrazioni e altri materiali del Servizio appartengono a Melgene Apps o ai suoi licenzianti e sono tutelati dalla legge. Puoi usare il Servizio per scopi personali e non commerciali e condividerne liberamente i link. Non copiare, ripubblicare o vendere le app o i loro contenuti senza il nostro permesso.'] },
      { h: '8. Modifiche ai termini', p: ['Potremmo aggiornare questi Termini di utilizzo di tanto in tanto; in quel caso cambieremo la data in cima a questa pagina. Se continui a usare il Servizio dopo un aggiornamento, accetti i termini modificati.'] },
      { h: '9. Contatti', p: ['Per domande su questi termini scrivi a contact@melgene.com oppure usa la nostra pagina Contatti.'] },
    ],
  },
  guidesPage: {
    title: 'Guide e consigli per ogni mini app | Melgene Apps',
    description: 'Come si gioca, consigli e curiosità su minigiochi, test della personalità e strumenti di Melgene. Leggi una guida breve e poi entra subito nell’app.',
    h1: 'Guide e consigli',
    lead: 'Ogni guida spiega come funziona una mini app, come migliorare e qualche cosa utile da sapere prima di iniziare. Niente spoiler: domande e risultati restano una sorpresa.',
    read: 'Leggi la guida',
    play: 'Gioca',
    empty: 'Le guide stanno arrivando. Torna a trovarci presto!',
  },
};
