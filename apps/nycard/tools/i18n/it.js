/* Biglietto di auguri 2027 — italiano (it/). Stessa struttura e variabili di en.js. card.* viene disegnato sul biglietto. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Pacifico'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Biglietti di Buon Anno 2027 da creare online",
    description: "Crea biglietti di auguri di Buon Anno 2027 online: scegli uno stile e un augurio, aggiungi i nomi e due righe, poi salva l’immagine o invia un link che si apre come una busta.",
    ogTitle: "Biglietti di Buon Anno 2027 🎆",
    ogDescription: "In un minuto il tuo biglietto di Buon Anno, per mandare i primi auguri del 2027."
  },
  siteName: "Auguri di Buon Anno 2027",
  privacyLink: "Privacy",
  start: {
    badge: "🎆 Ciao, 2027!",
    h1Kicker: "Biglietti di Buon Anno 2027",
    h1Html: "Inizia l’anno<br>con <em>belle parole</em>",
    hook: "Scegli uno stile, scrivi un augurio breve e manda un biglietto che si apre come una vera busta.",
    start: "Crea il biglietto →"
  },
  editor: {
    title: "Personalizza il biglietto",
    themesAria: "Stili del biglietto",
    themes: {
      red: "Rosso e oro",
      washi: "Carta washi",
      goat: "Capretta",
      minimal: "Minimal",
      snowy: "Notte di neve",
      fireworks: "Fuochi"
    },
    previewAria: "Anteprima del biglietto",
    greetingsLabel: "Augurio",
    decoLabel: "Extra",
    decos: {
      zodiac: "Capra",
      year: "2027",
      sparkle: "Brillantini"
    },
    fields: {
      to: {
        label: "Per",
        placeholder: "es. Nonna"
      },
      from: {
        label: "Da",
        placeholder: "es. Giulia"
      },
      message: {
        label: "Il tuo messaggio",
        placeholder: "Scrivi un augurio per l’anno…"
      }
    },
    ideas: "💡 Idee",
    counter: "{n}/{max}",
    presets: [
      "Ti auguro un 2027 pieno di salute, risate e progetti che finalmente si realizzano.",
      "Grazie per esserci stato tutto l’anno. A più caffè, più chiacchiere e più tempo insieme!",
      "Che il nuovo anno ti porti serenità, belle sorprese e giornate leggere.",
      "Tanti auguri di un felice anno nuovo a te e a tutta la famiglia.",
      "Unico buon proposito: vederci più spesso quest’anno. Promesso! Buon anno!"
    ],
    defaultGreeting: "happy",
    zodiacOn: false,
    done: "Completa il biglietto"
  },
  card: {
    greetings: {
      happy: "Buon Anno!",
      formal: "Felice Anno Nuovo",
      luck: "Tanti auguri di buon anno",
      year: "Buon 2027!"
    },
    zodiac: "2027 · Anno lunare della Capra",
    to: "Cara/o {name},",
    from: "Con affetto, {name}"
  },
  open: {
    eyebrow: "Hai ricevuto un biglietto di auguri",
    fromName: "da {name}",
    fromNone: "da qualcuno che ti pensa",
    open: "Apri il biglietto"
  },
  result: {
    eyebrowMine: "Il tuo biglietto è pronto!",
    eyebrowFriend: "Un biglietto da {name}",
    eyebrowFriendNoName: "Un biglietto solo per te",
    imageAlt: "Biglietto di Buon Anno: {greeting}",
    save: "Salva immagine",
    saving: "Creo l’immagine…",
    saved: "Immagine salvata!",
    saveFail: "Non è stato possibile creare l’immagine. Prova con uno screenshot.",
    copyText: "Copia testo",
    copied: "Testo copiato!",
    copyFail: "Copia non riuscita. Riprova.",
    edit: "Modifica",
    retry: "Crea un altro biglietto",
    retryFriend: "Crea il tuo biglietto",
    shareTitle: "Auguri di Buon Anno 2027",
    shareText: "{name} ti ha mandato un biglietto di Buon Anno 🎆 Aprilo qui:",
    shareTextNoName: "Qualcuno ti ha mandato un biglietto di Buon Anno 🎆 Aprilo qui:",
    fileName: "biglietto-buon-anno-2027"
  },
  og: {
    brand: "🎆 Auguri di Buon Anno 2027",
    defaultKicker: "Biglietti di Buon Anno 2027",
    defaultTitle: "Inizia l’anno con belle parole",
    defaultDesc: "6 stili · salva l’immagine o invia un link",
    cardGreeting: "Buon Anno!"
  },
  faq: [
    {
      q: "Come creo il biglietto?",
      a: "Scegli uno stile e un augurio, attiva o disattiva la capra, il grande «2027» e i brillantini, poi scrivi per chi è, da parte di chi e un breve messaggio. L’anteprima si aggiorna mentre scrivi. Quando ti piace, tocca «Completa il biglietto»."
    },
    {
      q: "Perché una capra?",
      a: "Nel calendario lunare dell’Asia orientale il 2027 è l’anno della Capra (o della Pecora). In Giappone, Corea, Cina e Vietnam l’animale dell’anno finisce spesso sui biglietti di auguri. È solo un tocco simpatico: puoi disattivarlo."
    },
    {
      q: "Posso salvare il biglietto come immagine?",
      a: "Sì. «Salva immagine» crea un PNG 1080×1350 perfetto per WhatsApp e le storie. Sul telefono si apre il menu di condivisione; sul computer l’immagine viene scaricata."
    },
    {
      q: "Cosa vede chi apre il mio link?",
      a: "Prima una busta chiusa: basta toccarla per aprirla e scoprire il biglietto, con l’augurio nella sua lingua. Poi può creare un biglietto tutto suo."
    },
    {
      q: "Dove viene salvato il mio messaggio?",
      a: "Solo dentro il link e, mentre scrivi, nel tuo browser. Non viene mai inviato al nostro server, quindi chiunque abbia il link può leggerlo: condividilo solo con le persone giuste."
    }
  ],
  privacy: {
    title: "Informativa sulla privacy | Auguri di Buon Anno 2027",
    description: "Informativa sulla privacy di Auguri di Buon Anno 2027: come viene trattato il testo del biglietto, cookie, pubblicità e statistiche anonime.",
    h1: "Informativa sulla privacy",
    introHtml: "Auguri di Buon Anno 2027 (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    sections: [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account e senza login. I nomi e il messaggio che scrivi non vengono mai inviati a un server. Restano nel tuo browser (durante la modifica una bozza è salvata nella memoria locale) e nell’indirizzo del link quando condividi. Alcune informazioni possono essere raccolte automaticamente durante l’uso, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie per mostrare annunci e capire come viene utilizzato. Puoi rifiutare o cancellare i cookie dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti. Per saperne di più e modificare le preferenze visita le <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo i totali giornalieri per lingua (visualizzazioni, biglietti completati, valutazioni a stelle). Nulla di tutto ciò ti identifica o contiene il tuo messaggio."
      ],
      [
        "5. Link condivisi e immagini",
        "I link creati con «Condividi» contengono il biglietto codificato nell’indirizzo, quindi chiunque abbia il link può vederlo. Le immagini salvate vengono create nel tuo browser. Evita di inserire indirizzi, numeri di telefono o altri dati personali nel messaggio."
      ],
      [
        "6. Contatti",
        "Per domande su questa informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "7. Data di entrata in vigore",
        "Questa informativa è in vigore dal 7 novembre 2026."
      ]
    ],
    back: "← Torna ad Auguri di Buon Anno 2027"
  }
};
