/* Test costume di Halloween — Italiano (it/)
 * Stessi 8 id di costume e stesso ordine di domande/risposte di costume-core.js (i pesi sono solo lì).
 * Chiavi con Html: HTML così com’è (solo <br> e <em>). Anche il testo di privacy.sections è HTML.
 * Niente spoiler: meta / og.default* / start / faq / loading non nominano costumi e non citano domande.
 * types.<id>.word = parole base del costume (separate da virgole) — solo per il controllo spoiler.
 * Segnaposto: {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Test costume di Halloween: da cosa mi travesto?',
    description: 'Da cosa mi travesto ad Halloween? Fai gratis il test costume di Halloween: 12 momenti di festa, circa 2 minuti, senza registrazione, con idee fai da te.',
    ogTitle: 'Test costume di Halloween 🎃 Da cosa ti travesti quest’anno?',
    ogDescription: 'Un test gratuito di 2 minuti. Rispondi a 12 momenti di una festa di Halloween e scopri il costume che rispecchia la tua personalità.',
  },
  siteName: 'Test costume di Halloween',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '🎃 Camerino dei costumi',
    h1Kicker: 'Test costume di Halloween',
    h1Html: 'Da cosa mi travesto<br>ad <em>Halloween</em>?',
    hook: 'Fissi ancora una borsa dei travestimenti vuota? Dodici piccoli momenti di festa sceglieranno il look che rispecchia il vero te.',
    metaTime: '⏱️ Circa 2 minuti',
    metaCount: '🦇 12 domande',
    start: 'Trova il mio costume →',
  },

  quiz: {
    backAria: 'Domanda precedente',
    progressAria: 'Avanzamento',
    qLabel: 'D{n}',
  },

  loading: {
    text: 'Stiamo frugando nel baule dei costumi…',
    sub: 'Proviamo qualche look per te',
  },

  result: {
    title: 'Test costume di Halloween: mi travesto da {name}',
    eyebrow: 'Ad Halloween travestiti da',
    strengthsLabel: 'I tuoi superpoteri da festa',
    tipsLabel: 'Come realizzarlo',
    bestLabel: 'Spalla ideale',
    rivalLabel: 'Rivale amico',
    sameShare: 'Il {pct}% dei giocatori ha ottenuto questo costume',
    shareText: 'Il mio costume di Halloween è {name} {emoji} — «{vibe}» E tu da cosa ti travesti?',
    ctaStrong: 'Qualcuno ha condiviso il suo costume di Halloween',
    ctaSub: 'E tu da cosa ti travesti? Bastano 2 minuti.',
    retry: 'Rifai il test',
  },

  og: {
    eyebrow: 'Il mio costume di Halloween',
    brand: '🎃 Test costume di Halloween',
    defaultKicker: 'Test costume di Halloween',
    defaultTitle: 'Da cosa ti travesti ad Halloween?',
    defaultDesc: '12 momenti di festa · circa 2 minuti',
  },

  faq: [
    { q: 'Come sceglie il test il mio costume?', a: 'Ogni risposta dà punti a un paio di costumi e vince quello con più punti. I pareggi si risolvono con una regola fissa, quindi le stesse risposte danno sempre lo stesso costume.' },
    { q: 'Posso davvero fare il costume da solo?', a: 'Sì. Ogni risultato ha consigli semplici con cose che quasi tutti hanno già in casa, più qualche extra economico da un negozio di casalinghi o da Tiger. Non serve saper cucire.' },
    { q: 'E se il risultato non mi piace?', a: 'Rifai il test! Il risultato dipende solo da come rispondi oggi, e un altro umore da festa può tirare fuori un altro look. Oppure fai coppia con la tua spalla ideale per un costume di gruppo.' },
    { q: 'Le mie risposte vengono salvate?', a: 'No. Le tue risposte vengono calcolate nel browser e mai salvate. Contiamo solo, in forma anonima, quale costume è uscito, per mostrare quanto è comune ogni risultato.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Test costume di Halloween',
    description: 'Informativa sulla privacy del Test costume di Halloween: cookie, pubblicità e statistiche anonime.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Il Test costume di Halloween (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Puoi usare il Servizio senza registrarti né accedere. Le tue risposte vengono calcolate nel browser e non vengono mai inviate né salvate sui nostri server. Contiamo solo, in forma anonima, quale costume è uscito, per mostrare quanto è comune ogni risultato.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e l’archiviazione locale del browser per ricordare la lingua, mostrare pubblicità e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare correttamente.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e impostazioni nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Conserviamo totali giornalieri anonimi (visualizzazioni, test completati, valutazioni) per migliorare il Servizio. Non permettono di identificarti.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di validità', 'Questa informativa è valida dal 2 ottobre 2026.'],
    ],
    back: '← Torna al test costume',
  },

  questions: [
    { q: 'È appena arrivato un invito a una festa di Halloween. Il tuo primo pensiero?', choices: [
      'Finalmente. Sto preparando il mio look da settimane.',
      'Chi organizza? Porto io patatine e playlist.',
      'Devo per forza travestirmi… o posso venire in tuta?',
      'Il costume me lo faccio da solo. Quelli comprati sono noiosi.',
    ] },
    { q: 'Nel negozio di costumi vai dritto verso…', choices: [
      'Lo stand dei mantelli di velluto e dei brillantini',
      'Il cesto delle offerte. Va bene tutto!',
      'Orecchie, code e piccoli accessori',
      'L’angolo fai da te: bende, trucchi, nastro adesivo',
    ] },
    { q: 'Arrivi alla festa. Prima mossa?', choices: [
      'Cercare la pista da ballo',
      'Salutare tutti e presentare le persone tra loro',
      'Trovare un angolo tranquillo e osservare la gente',
      'Andare dritto al tavolo degli snack',
    ] },
    { q: 'Din-don! Bambini alla porta: «Dolcetto o scherzetto?». Tu…', choices: [
      'Balli sulla porta mentre distribuisci caramelle',
      'Ti nascondi dietro la porta e salti fuori. Bu!',
      'Dai a ogni bambino un sacchettino fatto a mano',
      'Prima vuoi lo scherzetto. Patti chiari.',
    ] },
    { q: 'Il DJ mette una canzone che adori. Tu…', choices: [
      'Balli come se nessuno guardasse. Subito.',
      'Entri piano in pista con mosse teatrali',
      'Annuisci a tempo dal divano, snack in mano',
      'Trascini in pista l’amico più timido',
    ] },
    { q: 'Foto di gruppo! Dove sei?', choices: [
      'Davanti al centro, profilo migliore pronto',
      'Sbuchi appena dal bordo della foto',
      'In ultima fila a fare una smorfia',
      'A sistemare capelli e vestiti di tutti prima',
    ] },
    { q: 'Qualcuno dice: «Raccontiamoci storie di paura». Tu…', choices: [
      'Ne hai già una da brividi pronta',
      'Ti aggrappi al braccio accanto e ascolti con un occhio chiuso',
      'La trasformi in una commedia a metà',
      'Sgattaioli in silenzio in cucina',
    ] },
    { q: 'Il tavolo degli snack ti chiama. Prendi…', choices: [
      'Un po’ di tutto. Poi fai il bis.',
      'L’unico piatto strano che nessuno osa assaggiare',
      'Solo il dolce più bello del tavolo',
      'I piatti per i tuoi amici prima che per te',
    ] },
    { q: 'A mezzanotte salta la luce all’improvviso. Tu…', choices: [
      'Accendi la torcia del telefono e tranquillizzi tutti',
      'Fai un verso spettrale per spaventare gli altri',
      'Resti immobile. Al buio ci vedi benissimo.',
      'Continui a mangiare. Il buio non cambia niente.',
    ] },
    { q: 'Gara di costumi! Che premio vinceresti?', choices: [
      'Il più elegante',
      'Il più creativo',
      'Il preferito del pubblico',
      'Il più carino',
    ] },
    { q: 'Visiti una casa stregata. Sei quello che…', choices: [
      'Guida il gruppo e incoraggia tutti',
      'Passeggia tranquillo, per niente impressionato',
      'Urla più forte e ride più di tutti',
      'Studia gli oggetti di scena: «Come l’avranno fatto?»',
    ] },
    { q: 'La mattina dopo la festa, tu…', choices: [
      'Dormi ancora. Svegliatemi al tramonto.',
      'Metti in ordine e restituisci a tutti le cose dimenticate',
      'Stai già organizzando la festa dell’anno prossimo',
      'Sei tutt’uno con il divano, completamente scarico',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampiro di velluto',
      word: 'vampiro',
      vibe: 'Elegante senza sforzo, un po’ teatrale e la star di ogni notte.',
      desc: 'Sei nato per il turno di notte. Adori fare un’entrata a effetto, conosci il tuo profilo migliore e sai trasformare una serata qualunque in una scena da film. Le persone sono attratte dalla tua sicurezza tranquilla e da quel tocco di mistero. Prendi lo stile sul serio, ma ti prendi anche cura della tua cerchia: quando sei leale, lo sei per sempre.',
      strengths: ['Fascino magnetico', 'Stile impeccabile', 'Padrone della notte'],
      tips: ['Vestiti neri e un mantello (va bene un lenzuolo scuro) dicono subito «conte del castello».', 'Pettina i capelli all’indietro e aggiungi un tocco di rosso all’angolo delle labbra.', 'Canini di plastica e un inchino lento e teatrale quando arrivi.'],
    },
    witch: {
      name: 'Strega al chiaro di luna',
      word: 'strega',
      vibe: 'Furba, creativa e sempre con un piano geniale in pentola.',
      desc: 'La tua mente è un calderone di idee. Preferisci creare qualcosa di originale piuttosto che copiare gli altri, e di solito hai un piano B, C e D. Sei indipendente e un po’ dispettosa, con un’ironia tagliente che rende ogni conversazione interessante. Gli amici vengono da te quando serve una soluzione furba, o un incantesimo di buoni consigli.',
      strengths: ['Idee brillanti', 'Spirito indipendente', 'Ironia tagliente'],
      tips: ['Un cappello a punta e un vestito lungo o un cappotto scuro bastano per iniziare.', 'Una scopa o una tazza con l’etichetta «pozione» come accessorio simbolo.', 'Aggiungi adesivi a stella, rossetto viola o un gatto nero di peluche sulla spalla.'],
    },
    ghost: {
      name: 'Fantasma col lenzuolo',
      word: 'fantasma',
      vibe: 'Timido e tenero, accogliente e in segreto il più divertente della stanza.',
      desc: 'Non ti serve stare sotto i riflettori per divertirti. Preferisci vestiti comodi, pochi amici stretti e guardare la festa da un angolino comodo. All’inizio magari ti sottovalutano, ma le tue osservazioni silenziose e le battute a sorpresa spiazzano tutti. Sei gentile, dolce, e il tipo di amico accanto a cui ci si sente al sicuro.',
      strengths: ['Gentilezza delicata', 'Umorismo a sorpresa', 'Grande osservatore'],
      tips: ['Un lenzuolo bianco con due buchi per gli occhi. Classico, comodo e pronto in cinque minuti.', 'Aggiungi occhiali da sole o un cappellino per renderlo inconfondibilmente tuo.', 'Porta un cartellino con scritto «bu» per le foto più tenere.'],
    },
    zombie: {
      name: 'Zombie festaiolo',
      word: 'zombie',
      vibe: 'Rilassato, sempre affamato e inarrestabile una volta partito.',
      desc: 'Segui la corrente e quasi niente ti stressa. Dammi buoni snack, scarpe comode e le tue persone preferite, e sei felice. La mattina parti lento, ma quando ci sei, ci sei al cento per cento, e niente può fermarti. Gli amici adorano il tuo modo rilassato e quanto sei fedele al tuo gruppo.',
      strengths: ['Zen totale', 'Resistenza inarrestabile', 'Fedele al gruppo'],
      tips: ['Prendi vestiti vecchi, fai qualche strappo e strofina fondi di caffè come «terra».', 'Trucco grigio sul viso e ombretto scuro intorno agli occhi, e il gioco è fatto.', 'Cammina piano con le braccia tese e lamentati per avere snack.'],
    },
    blackcat: {
      name: 'Gatto nero di mezzanotte',
      word: 'gatto',
      vibe: 'Cool, curioso e misterioso: affetto solo per pochi eletti.',
      desc: 'Fai le cose a modo tuo e con i tuoi tempi. Sei curioso di tutto, ma mostri interesse solo quando lo senti davvero. Gli altri ti trovano un po’ misterioso, ed è proprio così che ti piace. Dietro l’aria distaccata sei giocherellone e affettuoso con chi si guadagna la tua fiducia, e cadi sempre in piedi.',
      strengths: ['Cool senza sforzo', 'Curiosità infinita', 'Cade sempre in piedi'],
      tips: ['Un outfit tutto nero con un cerchietto con orecchie da gatto si riconosce subito.', 'Disegna un nasino e i baffi con l’eyeliner.', 'Fissa sulla schiena una coda fatta con un calzino o dei collant neri.'],
    },
    mummy: {
      name: 'Mummia coccolosa',
      word: 'mummia',
      vibe: 'Paziente, premurosa e l’amica che tiene unito tutto il gruppo.',
      desc: 'Sei tu che in silenzio ti assicuri che tutti stiano bene. Ricordi i piccoli dettagli, aggiusti ciò che è rotto e hai sempre un cerotto pronto, in senso letterale o emotivo. Sei paziente e stabile, con il fascino di un’anima antica e l’amore per le cose classiche e senza tempo. Le persone si sentono più tranquille solo a starti vicino.',
      strengths: ['Pazienza infinita', 'Cuore premuroso', 'Affidabile come una roccia'],
      tips: ['Avvolgi garza bianca o strisce di un vecchio lenzuolo sopra un outfit bianco.', 'Lascia scoperto un occhio e qualche lembo penzolante.', 'Tampona le bende con tè o caffè per un effetto antico.'],
    },
    pumpkin: {
      name: 'Re Zucca',
      word: 'zucca',
      vibe: 'Caloroso, solare e il cuore della festa: re o regina di Halloween.',
      desc: 'Illumini ogni stanza come una lanterna. Ami riunire le persone, ricordi il nome di tutti e fai in modo che nessuno si senta escluso. Le feste sono più vive quando ci sei tu, e spesso sei proprio tu a organizzarle. Il tuo calore è contagioso: chi passa del tempo con te se ne va un po’ più luminoso.',
      strengths: ['Padrone di casa nato', 'Calore contagioso', 'Unisce tutti'],
      tips: ['Una maglia o una felpa arancione con una faccia da lanterna ritagliata nel feltro nero.', 'In testa un cerchietto con foglie verdi o una piccola corona.', 'Porta un secchiello di caramelle e distribuisci dolcetti a tutti.'],
    },
    skeleton: {
      name: 'Scheletro ballerino',
      word: 'scheletro',
      vibe: 'Buffo, sincero e sempre il primo sulla pista da ballo.',
      desc: 'Sei qui per divertirti, e si vede. Fai ridere la gente senza nemmeno provarci, e la tua energia trascina tutti in pista. Sei di una sincerità rinfrescante: con te quello che vedi è quello che c’è, fino all’osso. La vita sembra più leggera accanto a te, perché non ti prendi mai troppo sul serio.',
      strengths: ['Carica di buonumore', 'Sincerità fino all’osso', 'Ballerino senza paura'],
      tips: ['Vestiti neri e nastro adesivo bianco o colori per tessuto per le ossa.', 'Truccati da teschio: base bianca, cerchi neri intorno agli occhi e denti cuciti.', 'Prova un passo di danza buffo: far tintinnare le ossa è obbligatorio.'],
    },
  },
};
