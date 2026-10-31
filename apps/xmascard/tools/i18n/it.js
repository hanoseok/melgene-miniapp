/* Biglietto di Natale — Italiano (/it/). Stessa struttura di chiavi di en.js. Lascia {name} {greeting} {n} {max} così come sono. */
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
    title: "Biglietto di Natale da creare e inviare online",
    description: "Crea il tuo biglietto di Natale online: scegli un tema e un augurio, aggiungi i nomi e un messaggio affettuoso, poi salvalo come immagine o invialo con un link.",
    ogTitle: "Crea il tuo biglietto di Natale 🎄",
    ogDescription: "Prepara un biglietto di Natale caldo e accogliente in un minuto e mandalo a chi vuoi bene."
  },
  siteName: "Biglietto di Natale",
  privacyLink: "Informativa sulla privacy",
  start: {
    badge: "🎄 Speciale feste",
    h1Kicker: "Biglietto di Natale",
    h1Html: "Un pensiero<br><em>per Natale</em>",
    hook: "Scegli un bel design, scrivi due parole col cuore e manda un biglietto che si apre come una vera busta.",
    start: "Crea il biglietto →"
  },
  editor: {
    title: "Personalizza il biglietto",
    themesAria: "Design del biglietto",
    themes: {
      classic: "Classico",
      snowy: "Notte di neve",
      golden: "Oro",
      cute: "Tenero",
      minimal: "Essenziale",
      forest: "Bosco d’inverno"
    },
    previewAria: "Anteprima del biglietto",
    greetingsLabel: "Augurio",
    decoLabel: "Decorazioni",
    decos: {
      snow: "Neve",
      lights: "Lucine",
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
        placeholder: "Scrivi due parole affettuose…"
      }
    },
    ideas: "💡 Idee",
    counter: "{n}/{max}",
    presets: [
      "Grazie per esserci sempre. Ti auguro un Natale caldo, pieno di risate e di panettone!",
      "Che queste feste ti portino serenità, buon cibo e tanto tempo con chi ami.",
      "Lontani, ma sempre vicini col cuore. Non vedo l’ora di rivederti!",
      "Un anno impegnativo sta finendo: riposati e goditi ogni momento delle feste.",
      "Tanta salute, serenità e belle sorprese per il nuovo anno!"
    ],
    defaultGreeting: "merry",
    done: "Completa il biglietto"
  },
  card: {
    greetings: {
      merry: "Buon Natale!",
      holidays: "Buone feste!",
      newyear: "Felice anno nuovo!",
      seasons: "Auguri di cuore"
    },
    to: "Per {name}",
    from: "Con affetto, {name}"
  },
  open: {
    eyebrow: "Ti è arrivato un biglietto di Natale",
    fromName: "da {name}",
    fromNone: "da qualcuno che ti pensa",
    open: "Apri il biglietto"
  },
  result: {
    eyebrowMine: "Il tuo biglietto è pronto!",
    eyebrowFriend: "Un biglietto da {name}",
    eyebrowFriendNoName: "Un biglietto tutto per te",
    imageAlt: "Biglietto di Natale: {greeting}",
    save: "Salva immagine",
    saving: "Sto creando l’immagine…",
    saved: "Immagine salvata!",
    saveFail: "Impossibile creare l’immagine. Prova con uno screenshot.",
    copyText: "Copia testo",
    copied: "Testo copiato!",
    copyFail: "Impossibile copiare. Riprova.",
    edit: "Modifica",
    retry: "Crea un altro biglietto",
    retryFriend: "Crea il tuo biglietto",
    shareTitle: "Biglietto di Natale",
    shareText: "{name} ti ha mandato un biglietto di Natale 🎄 Aprilo qui:",
    shareTextNoName: "Ti è arrivato un biglietto di Natale 🎄 Aprilo qui:",
    fileName: "biglietto-di-natale"
  },
  og: {
    brand: "🎄 Biglietto di Natale",
    defaultKicker: "Biglietto di Natale",
    defaultTitle: "Un pensiero per Natale",
    defaultDesc: "6 design · salvalo come immagine o invia un link",
    cardGreeting: "Buon Natale!"
  },
  faq: [
    {
      q: "Come creo il mio biglietto?",
      a: "Scegli un design e un augurio, accendi o spegni neve, lucine e brillantini, poi scrivi per chi è, da parte di chi e un breve messaggio. L’anteprima cambia subito: tocca «Completa il biglietto» quando ti piace."
    },
    {
      q: "Posso salvare il biglietto come immagine?",
      a: "Sì. «Salva immagine» crea un PNG 1080×1350, perfetto per WhatsApp o le storie. Sul telefono si apre il menu di condivisione, sul computer viene scaricato."
    },
    {
      q: "Cosa vede chi apre il mio link?",
      a: "Prima una busta chiusa: con un tocco si apre e compare il biglietto, con l’augurio nella sua lingua. Subito dopo può creare il proprio biglietto."
    },
    {
      q: "Dove resta il mio messaggio?",
      a: "Solo dentro il link e, mentre scrivi, nel tuo browser. Non viene mai inviato al nostro server, ma chi ha il link può leggerlo: condividilo solo con chi vuoi tu."
    }
  ],
  privacy: {
    title: "Informativa sulla privacy | Biglietto di Natale",
    description: "Informativa sulla privacy di Biglietto di Natale: come viene trattato il testo del biglietto, cookie, pubblicità e statistiche anonime.",
    h1: "Informativa sulla privacy",
    introHtml: "Biglietto di Natale (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.",
    sections: [
      [
        "1. Dati raccolti",
        "Il Servizio funziona senza account né accesso. I nomi e il messaggio che scrivi non vengono mai inviati a un server: restano nel tuo browser (durante la modifica una bozza resta nella memoria locale) e nell’URL quando condividi. Alcune informazioni possono essere raccolte automaticamente durante l’uso, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie per mostrare annunci e capire come viene utilizzato. Puoi rifiutare o cancellare i cookie dalle impostazioni del browser; in questo caso alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti. Maggiori informazioni e preferenze nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori nostri che conservano solo totali giornalieri per lingua (visualizzazioni, biglietti completati, valutazioni). Nulla di tutto ciò ti identifica né contiene il tuo messaggio."
      ],
      [
        "5. Link condivisi e immagini",
        "I link creati con «Condividi» contengono il biglietto codificato nell’URL, quindi chiunque abbia il link può vederlo. Le immagini vengono create nel tuo browser. Evita di scrivere indirizzi, numeri di telefono o altri dati personali nel messaggio."
      ],
      [
        "6. Contatti",
        "Per domande su questa informativa, contatta il gestore del sito."
      ],
      [
        "7. Data di efficacia",
        "Questa informativa è valida dal 1° novembre 2026."
      ]
    ],
    back: "← Torna a Biglietto di Natale"
  }
};
