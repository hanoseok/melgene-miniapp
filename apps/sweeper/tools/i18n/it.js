/* Campo minato — it (see en.js for the key structure; placeholders {t} {n} {pct} {time} {diff} stay as-is) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
    display: "'Audiowide'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Campo minato – Gioco delle mine gratis online',
    description: 'Gioca a Campo minato online: scopri tutte le caselle sicure, segna le mine con le bandierine e batti il tempo. Principiante, intermedio o esperto. Il primo tocco è sempre sicuro.',
    ogTitle: 'Campo minato 💣 In quanto tempo liberi il campo?',
    ogDescription: 'Il classico rompicapo nel browser: tre dimensioni, un primo tocco sicuro e un tempo da battere.',
  },
  siteName: 'Campo minato',
  privacyLink: 'Informativa sulla privacy',
  start: {
    badge: '💣 Rompicapo classico · 3 livelli',
    h1Kicker: 'Campo minato',
    h1Html: 'Libera il campo,<br>evita ogni <em>mina</em>',
    hook: 'I numeri dicono quante mine si nascondono lì intorno. Ragiona, pianta bandierine sulle caselle pericolose e ripulisci la griglia prima che scada il tempo.',
    how: { reveal: 'Tocca per scoprire', flag: 'Tieni per segnare', chord: 'Tocca un numero per liberare' },
    facts: 'Il primo tocco è sempre sicuro',
    diffLabel: 'Scegli il livello',
    diffs: { beginner: 'Facile', intermediate: 'Medio', expert: 'Esperto' },
    start: 'Inizia →',
  },
  play: {
    mines: 'Mine',
    time: 'Tempo',
    digMode: 'Scava',
    flagMode: 'Bandiera',
    boardAria: 'Griglia di Campo minato. Tocca una casella per scoprirla; tieni premuto o usa la modalità bandiera per segnare una mina.',
    paused: 'In pausa · tocca per continuare',
    aHidden: 'Casella coperta',
    aFlag: 'Casella con bandierina',
    aMine: 'Mina',
    aNum: '{n} mine vicine',
  },
  result: {
    win: 'Campo liberato!',
    lose: 'Boom!',
    sec: 's',
    timeLabel: 'Tempo',
    clearedLabel: 'Scoperto',
    best: 'Record: {t}',
    newBest: 'Nuovo record!',
    top: 'Top {n}%',
    beat: 'Più veloce del {pct}% dei giocatori',
    beatAll: 'Più veloce di tutti i tempi finora',
    others: 'Confrontato con altri {n} tempi',
    comparing: 'Confronto con gli altri giocatori…',
    retry: 'Gioca ancora',
    shareTitle: 'Campo minato – riesci a liberare il campo?',
    shareWin: 'Ho liberato il Campo minato ({diff}) in {time} secondi 💣 Riesci a battermi?',
    shareLose: 'A Campo minato ({diff}) ho scoperto il {pct}% prima del boom 💥 Fai meglio di me?',
  },
  og: { brand: '💣 Campo minato', defaultKicker: 'Rompicapo gratis', defaultTitle: 'Riesci a liberare il campo?', defaultDesc: 'Segna le mine · batti il tempo' },
  faq: [
    {
      q: 'Come si gioca a Campo minato?',
      a: 'Tocca una casella per scoprirla. Un numero indica quante delle otto caselle vicine nascondono una mina. Deduci dove sono, segnale con le bandierine e scopri tutte le caselle senza mina per vincere.',
    },
    {
      q: 'Come metto una bandierina sul telefono?',
      a: 'Tieni premuta una casella per un attimo, oppure porta il pulsante Scava / Bandiera sopra la griglia in modalità bandiera e tocca. Sul computer vale anche il clic destro o il tasto F sulla casella selezionata.',
    },
    {
      q: 'Cosa succede se tocco un numero?',
      a: 'Se hai messo attorno a un numero tante bandierine quante indica, toccarlo scopre in un colpo tutte le altre caselle vicine. Se una bandierina era sbagliata, quella casella esplode: controlla prima.',
    },
    {
      q: 'Il primo tocco è davvero sicuro?',
      a: 'Sì. Le mine vengono posizionate dopo il tuo primo tocco e mai su quella casella né accanto, così si apre sempre un po’ di spazio. Il tempo parte con quel tocco e si ferma quando lasci la scheda.',
    },
  ],
  privacy: {
    "title": "Informativa sulla privacy | Campo minato",
    "description": "Informativa sulla privacy di Campo minato: tempi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Campo minato (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Quando vinci una partita vengono inviati al nostro server solo il livello e il tuo tempo (arrotondato al mezzo secondo) come conteggio anonimo, senza nome né identificativi personali. Durante l’uso del Servizio alcune informazioni possono essere raccolte automaticamente, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la tua lingua e il tuo record, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo i totali giornalieri per lingua (pagine viste, partite iniziate e finite, valutazioni). Nulla di tutto ciò ti identifica personalmente."
      ],
      [
        "5. Contatti",
        "Per domande su questa informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "6. Data di efficacia",
        "Questa informativa è valida dal 10 ottobre 2026."
      ]
    ],
    "back": "← Torna a Campo minato"
  },
};
