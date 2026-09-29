/* Test dell’aura — Italiano (it/)
 * Stessi 8 id di aura e stesso ordine di domande/risposte di aura-core.js (i pesi sono solo lì).
 * Chiavi con Html: HTML così com’è (solo <br> e <em>). Anche il testo di privacy.sections è HTML.
 * Niente spoiler: meta / og.default* / start / faq non nominano colori dell’aura e non citano domande.
 * types.<id>.word = parole di colore di base (separate da virgole) — solo per il controllo spoiler.
 * Segnaposto: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap',
    display: "'Comfortaa'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Test dell’aura – Di che colore è la tua aura?',
    description: 'Di che colore è la tua aura? Fai il test dell’aura gratis: 12 domande di vita quotidiana, circa 2 minuti, senza registrazione. Scopri la luce che emana la tua energia.',
    ogTitle: 'Test dell’aura ✨ Di che colore è la tua aura?',
    ogDescription: 'Un test dell’aura gratuito di 2 minuti. Rispondi a 12 domande di tutti i giorni e scopri il colore della tua energia.',
  },
  siteName: 'Test dell’aura',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '✨ Lettura dell’aura',
    h1Kicker: 'Test dell’aura',
    h1Html: 'Di che colore è<br>la tua <em>aura</em>?',
    hook: 'Ognuno emana una luce tutta sua. Dodici piccoli momenti di vita quotidiana ti sveleranno qual è la tua.',
    metaTime: '⏱️ Circa 2 minuti',
    metaCount: '🔮 12 domande',
    start: 'Leggi la mia aura →',
  },

  quiz: {
    backAria: 'Domanda precedente',
    progressAria: 'Avanzamento',
    qLabel: 'D{n}',
  },

  loading: {
    text: 'Sto leggendo la tua aura…',
    sub: 'Lasciamo posare i colori',
  },

  result: {
    title: 'Test dell’aura: la mia aura è {name}',
    eyebrow: 'Il colore della tua aura è',
    strengthsLabel: 'I tuoi poteri di luce',
    othersLabel: 'Come ti vedono gli altri',
    bestLabel: 'Aura affine',
    clashLabel: 'Aura opposta',
    sameShare: 'Il {pct}% dei giocatori ha la stessa aura',
    shareText: 'La mia aura è {name} {emoji} – «{vibe}» Di che colore è la tua?',
    ctaStrong: 'Qualcuno ti ha mandato la sua aura',
    ctaSub: 'E la tua di che colore è? Bastano 2 minuti.',
    retry: 'Rifai il test',
  },

  og: {
    eyebrow: 'Il colore della mia aura',
    brand: '✨ Test dell’aura',
    defaultKicker: 'Test dell’aura',
    defaultTitle: 'Di che colore è la tua aura?',
    defaultDesc: '12 domande di tutti i giorni · circa 2 minuti',
  },

  faq: [
    { q: 'Come funziona il test dell’aura?', a: 'Ogni risposta dà punti ad alcuni colori dell’aura, e il colore con più punti è il tuo risultato. In caso di parità decide una regola fissa, quindi le stesse risposte danno sempre la stessa aura.' },
    { q: 'Che cos’è l’aura?', a: 'Nella spiritualità popolare l’aura è un alone di energia che circonda ogni persona, e ogni colore è legato a uno stato d’animo e a una personalità. Questo test gioca con l’idea: è per divertirsi e riflettere su di sé, non è scienza.' },
    { q: 'Il colore della mia aura può cambiare?', a: 'Sì. Il risultato dipende solo da come rispondi oggi, quindi un altro umore o una nuova fase della vita possono far emergere un altro colore. Rifallo quando vuoi.' },
    { q: 'Le mie risposte vengono salvate?', a: 'No. Le risposte vengono calcolate nel tuo browser e non vengono mai salvate. Contiamo solo, in forma anonima, quale aura è uscita, per mostrare quanto è comune ogni risultato.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Test dell’aura',
    description: 'Informativa sulla privacy del Test dell’aura: cookie, pubblicità e statistiche anonime.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Il Test dell’aura (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Puoi usare il Servizio senza registrarti né accedere. Le tue risposte vengono calcolate nel browser e non vengono mai inviate né salvate sui nostri server. Contiamo solo, in forma anonima, quale colore dell’aura è uscito, per mostrare quanto è comune ogni risultato.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e l’archiviazione locale del browser per ricordare la lingua, mostrare pubblicità e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare correttamente.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e impostazioni nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Conserviamo totali giornalieri anonimi (visualizzazioni, test completati, valutazioni) per migliorare il Servizio. Non permettono di identificarti.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di validità', 'Questa informativa è valida dal 30 settembre 2026.'],
    ],
    back: '← Torna al test dell’aura',
  },

  questions: [
    { q: 'Un sabato mattina tranquillo, niente in programma. Come inizia?', choices: [
      'Con una corsa all’alba. Prima devo muovermi.',
      'Scrivo nel gruppo: «Gita fuori porta? Si parte tra un’ora».',
      'Innaffio le piante e poi faccio un giro al mercato',
      'Caffè, un quaderno e silenzio assoluto',
    ] },
    { q: 'Un’amica ti scrive: «Ehi… possiamo parlare?». Tu…', choices: [
      'La chiami subito. Qualunque cosa sia, ci sono.',
      'Prima ascolti, poi la aiuti a fare chiarezza',
      'Arrivi con gli snack e un piano per farla ridere',
      'Le mandi un lungo messaggio sincero e una canzone adatta',
    ] },
    { q: 'Arrivi a una festa dove non conosci quasi nessuno.', choices: [
      'Dopo dieci minuti chiacchiero con mezza sala',
      'Sono io quello che fa ridere tutti',
      'Trovo una persona e parliamo per ore in un angolo',
      'Propongo un gioco e coinvolgo tutti',
    ] },
    { q: 'Puoi vivere dove vuoi per un anno. Scegli…', choices: [
      'Una casetta ai margini di un bosco',
      'Un paesino tranquillo sul mare',
      'Una mansarda accogliente piena di materiali artistici',
      'Il centro di una grande città piena di vita',
    ] },
    { q: 'Il lavoro di gruppo è per domani e non è pronto niente.', choices: [
      'Prendo in mano la situazione e divido i compiti',
      'Faccio un piano passo per passo così nessuno va nel panico',
      'A notte fonda mi viene l’idea che salva tutto',
      'Guardo chi è in ansia e mi assicuro che tutti stiano bene',
    ] },
    { q: 'Puoi avere un solo superpotere. Quale?', choices: [
      'Leggere nel pensiero',
      'Teletrasportarmi ovunque, in qualsiasi momento',
      'Guarire ogni ferita e ogni dolore',
      'Far sorridere chiunque all’istante',
    ] },
    { q: 'Cosa riempie di più la galleria del tuo telefono?', choices: [
      'Selfie e foto di gruppo con le persone che amo',
      'Cieli, fiori, alberi: natura ovunque',
      'Inquadrature strane, luci d’atmosfera, piccole opere d’arte',
      'Posti in cui sono stato e le mie avventure',
    ] },
    { q: 'Lo stress si accumula. Cosa ti aiuta?', choices: [
      'Riordinare e scrivere una lista di cose da fare chiarissima',
      'Un allenamento tosto finché la testa non si svuota',
      'Stare da solo e ripensare a tutto con calma',
      'Video divertenti e qualcosa da sgranocchiare. Ci penso dopo.',
    ] },
    { q: 'Cosa pensa di solito chi ti incontra per la prima volta?', choices: [
      '«Tanta sicurezza. Un tipo intenso».',
      '«Che calore e che dolcezza».',
      '«Trasmette calma. Ci si può fidare».',
      '«Un mistero. Non somiglia a nessuno».',
    ] },
    { q: 'Quale regalo ti renderebbe più felice?', choices: [
      'Una pianta o qualcosa fatto a mano',
      'I biglietti di un concerto con i miei migliori amici',
      'Un libro raro o un quaderno bellissimo',
      'Un weekend a sorpresa',
    ] },
    { q: 'Sta per iniziare una discussione. Tu…', choices: [
      'Mantieni la calma e cerchi ciò che è giusto',
      'Chiedi scusa per primo. La pace conta di più.',
      'Fai una battuta per sciogliere la tensione',
      'Fai un passo indietro e ci ripensi più tardi',
    ] },
    { q: 'Scegli il motto che ti somiglia di più.', choices: [
      'La vita è un’avventura: di’ di sì!',
      'Crescere piano, mettere radici profonde.',
      'Prima sognarlo, poi realizzarlo.',
      'Amare a voce alta.',
    ] },
  ],

  types: {
    red: {
      name: 'Rosso rubino',
      word: 'rosso, rossa',
      vibe: 'Fuoco puro: coraggio, grinta e tanta voglia di vivere.',
      desc: 'La tua aura brucia intensa e calda. Sei una persona d’azione: quando qualcosa conta, ti butti e pensi strada facendo. Le sfide ti accendono invece di spaventarti, e la tua energia trascina gli altri con te. Senti tutto con forza, dall’entusiasmo alla frustrazione, e non lo nascondi. È proprio questa sincerità a far sì che la gente si fidi di te.',
      strengths: ['Grinta senza paura', 'Energia contagiosa', 'Sincerità diretta'],
      others: 'Gli altri ti vedono come la scintilla del gruppo: chi fa partire le cose e dice ad alta voce quello che tutti pensano.',
    },
    orange: {
      name: 'Arancio tramonto',
      word: 'arancione, arancio',
      vibe: 'Calore, spontaneità e voglia di avventura a ogni ora.',
      desc: 'La tua aura brilla come un tramonto durante un viaggio d’estate. Ami i posti nuovi, le persone nuove e il «perché no?». Fai amicizia ovunque e i tuoi aneddoti sono sempre i migliori a tavola. La routine ti annoia, così riempi la vita di colore con piani che a nessun altro verrebbero in mente. Sotto tutto questo divertimento c’è un cuore generoso che ama condividere i bei momenti.',
      strengths: ['Spirito d’avventura', 'Fa amicizia ovunque', 'Anima della festa'],
      others: 'Gli altri ti vedono come chi trasforma una giornata qualunque in una storia da raccontare: alla mano, socievole e piena di sorprese.',
    },
    yellow: {
      name: 'Giallo oro',
      word: 'giallo, gialla',
      vibe: 'Un raggio di sole con le gambe: allegria, curiosità, luce.',
      desc: 'La tua aura è pura luce del giorno. Hai un ottimismo, una voglia di giocare e una curiosità senza fine, e raccogli sempre nuove idee e passioni. Trovi il lato buffo in quasi tutto, e la tua risata è famosa tra gli amici. Ti piace la leggerezza, ma hai anche una mente sveglia: impari in fretta e condividi con tutti quello che scopri.',
      strengths: ['Ottimismo naturale', 'Mente sveglia e curiosa', 'Rallegra ogni ambiente'],
      others: 'Gli altri ti vedono come un raggio di sole: basta che arrivi tu e le giornate pesanti si alleggeriscono.',
    },
    green: {
      name: 'Verde smeraldo',
      word: 'verde',
      vibe: 'Radici solide, tanta cura e una crescita silenziosa.',
      desc: 'La tua aura sembra un bosco dopo la pioggia: calma, fresca e viva. Tieni moltissimo alle persone e alle cose che ti circondano, e preferisci costruire qualcosa che duri piuttosto che vincere in fretta. Noti di cosa hanno bisogno gli altri e aiuti senza fare rumore. L’equilibrio per te è importante: una passeggiata, un buon pranzo e le persone care sistemano quasi tutto.',
      strengths: ['Costanza e pazienza', 'Talento nel prendersi cura', 'Senso dell’equilibrio'],
      others: 'Gli altri ti vedono come un porto sicuro: affidabile, gentile, la persona da chiamare quando serve ritrovare la calma.',
    },
    blue: {
      name: 'Blu oceano',
      word: 'blu, azzurro',
      vibe: 'Acque calme, lealtà profonda, parole sincere.',
      desc: 'La tua aura è calma come il mare in una giornata limpida. Resti stabile quando tutto si complica e scegli le parole con cura. Verità e fiducia contano tantissimo per te: mantieni le promesse e ti aspetti lo stesso. Forse non sei la voce più forte del gruppo, ma quando parli tutti ascoltano, perché sanno che lo pensi davvero.',
      strengths: ['Calma sotto pressione', 'Lealtà profonda', 'Parole ponderate'],
      others: 'Gli altri ti vedono come la persona più affidabile che conoscono: serena, giusta e sempre onesta.',
    },
    indigo: {
      name: 'Indaco notte',
      word: 'indaco',
      vibe: 'Intuito, profondità e sempre un passo avanti.',
      desc: 'La tua aura scintilla come il cielo appena dopo mezzanotte. Percepisci le cose prima che qualcuno le dica, e spesso indovini il finale di una storia prima che cominci. Ami le grandi domande, i momenti di silenzio e le conversazioni che vanno a fondo. Tieni alla tua indipendenza e alla tua riservatezza, ma le poche persone che ti conoscono davvero hanno accanto qualcuno con una lucidità rara.',
      strengths: ['Intuito affilato', 'Pensiero profondo', 'Vede il quadro generale'],
      others: 'Gli altri ti vedono come una persona saggia oltre la sua età: silenziosa, perspicace e un po’ difficile da decifrare.',
    },
    violet: {
      name: 'Viola mistico',
      word: 'viola',
      vibe: 'Un’anima sognatrice con una visione che nessun altro vede.',
      desc: 'La tua aura è un vortice di immaginazione. Vedi il mondo come potrebbe essere, non solo com’è, e la tua testa è piena di idee, storie e progetti. Ti attirano l’arte, la musica e tutto ciò che è fuori dal comune. Le regole di sempre non ti stanno sempre bene, ed è giusto così: il tuo modo unico di guardare le cose ispira chi ti sta intorno.',
      strengths: ['Immaginazione sconfinata', 'Idee originali', 'Ispira gli altri'],
      others: 'Gli altri ti vedono come una persona unica: creativa, un po’ misteriosa e piena di idee sorprendenti.',
    },
    pink: {
      name: 'Rosa cipria',
      word: 'rosa',
      vibe: 'Cuore tenero, amore immenso, forza gentile.',
      desc: 'La tua aura è calda e tenera come la prima luce di primavera. Ami apertamente e fai sentire le persone viste, che sia ricordando un compleanno o accorgendoti quando qualcuno è silenzioso. La gentilezza ti viene naturale, e credi che un piccolo gesto possa cambiare la giornata di chiunque. Dolcezza non vuol dire debolezza: il tuo cuore è la tua forza.',
      strengths: ['Gentilezza infinita', 'Empatia profonda', 'Fa sentire amati'],
      others: 'Gli altri ti vedono come una persona dolce e rassicurante: quella il cui abbraccio sistema tutto.',
    },
  },
};
