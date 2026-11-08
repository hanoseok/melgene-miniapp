/* Pupazzo di neve — Italiano (/it/). Stessa struttura di chiavi di en.js. Lascia {name} {n} {max} invariati.
 * Interfaccia con il tu. */
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
    title: "Pupazzo di neve online: creane uno in un minuto",
    description: "Crea un pupazzo di neve online: impila le palle di neve, scegli occhi, naso a carota, cappello, sciarpa e braccia, dagli un nome e salva l’immagine o condividi il link.",
    ogTitle: "Fai il tuo pupazzo di neve ⛄",
    ogDescription: "Rotola, impila e vesti il tuo pupazzo di neve in un minuto, poi mandalo a un amico."
  },
  siteName: "Pupazzo di neve",
  privacyLink: "Informativa sulla privacy",
  start: {
    badge: "⛄ Speciale inverno",
    h1Kicker: "Fare un pupazzo di neve",
    h1Html: "Rotola, impila e<br><em>vesti il pupazzo</em>",
    hook: "Niente guanti, niente freddo. Scegli ogni pezzo, guarda la neve cadere e manda il tuo pupazzo a chi ha bisogno di un sorriso.",
    start: "Inizia a costruire →"
  },
  editor: {
    title: "Costruisci il tuo pupazzo",
    canvasAria: "Anteprima del tuo pupazzo di neve in un paesaggio invernale",
    stepOf: "Passo {n} di {max}",
    steps: {
      body: "Corpo",
      face: "Viso",
      nose: "Naso",
      hat: "Cappello",
      scarf: "Sciarpa",
      arms: "Braccia",
      extras: "Extra",
      scene: "Sfondo",
      name: "Nome"
    },
    labels: {
      body: "Palle di neve",
      eyes: "Occhi",
      mouth: "Bocca",
      nose: "Naso",
      hat: "Cappello",
      scarf: "Colore della sciarpa",
      pattern: "Fantasia",
      arms: "Braccia",
      extras: "Extra (a piacere)",
      scene: "Sfondo",
      name: "Nome (facoltativo)"
    },
    bodies: {
      classic: "Classico",
      duo: "Due palle",
      chubby: "Paffuto",
      slim: "Snello"
    },
    eyes: {
      coal: "Carbone",
      buttons: "Bottoni",
      sparkly: "Scintillanti",
      sleepy: "Assonnati"
    },
    mouths: {
      pebbles: "Sassolini",
      smile: "Sorriso",
      grin: "Risata",
      oh: "Oh!"
    },
    noses: {
      carrot: "Carota",
      long: "Carota XL",
      berry: "Bacca",
      pinecone: "Pigna"
    },
    hats: {
      top: "Cilindro",
      beanie: "Berretto",
      santa: "Babbo Natale",
      bucket: "Secchio",
      earmuffs: "Paraorecchie",
      none: "Scoperto"
    },
    scarves: {
      red: "Rossa",
      green: "Verde",
      blue: "Blu",
      yellow: "Gialla",
      purple: "Viola",
      none: "Nessuna"
    },
    patterns: {
      solid: "Tinta unita",
      stripes: "Righe",
      dots: "Pois"
    },
    arms: {
      twigs: "Rametti",
      mittens: "Muffole",
      wave: "Saluta",
      none: "Niente"
    },
    extras: {
      broom: "Scopa",
      buttons: "Bottoni",
      bird: "Uccellino",
      flakes: "Scintille"
    },
    scenes: {
      night: "Notte nevosa",
      sunny: "Al sole",
      village: "Villaggio"
    },
    random: "Sorprendimi",
    back: "← Indietro",
    next: "Avanti →",
    done: "Il pupazzo è pronto",
    namePlaceholder: "es. Pallina",
    ideas: "💡 Idee",
    counter: "{n}/{max}",
    namePresets: [
      "Pallina",
      "Signor Gelo",
      "Fiocchetto",
      "Ghiacciolo",
      "Bottoncino"
    ]
  },
  card: {
    named: "Ti presento {name}!"
  },
  result: {
    eyebrowMine: "Il tuo pupazzo di neve è pronto!",
    eyebrowFriend: "Qualcuno ha fatto {name} solo per te",
    eyebrowFriendNoName: "Qualcuno ha fatto un pupazzo di neve solo per te",
    revealHint: "È ancora coperto di neve fresca…",
    reveal: "❄️ Spazza via la neve",
    imageAlt: "Un pupazzo di neve in un paesaggio invernale",
    save: "Salva immagine",
    saving: "Sto creando l’immagine…",
    saved: "Immagine salvata!",
    saveFail: "Non è stato possibile creare l’immagine. Prova con uno screenshot.",
    edit: "Continua",
    retry: "Fai un altro pupazzo",
    retryFriend: "Fai il mio pupazzo",
    shareTitle: "Pupazzo di neve",
    shareText: "Ti presento {name}, il pupazzo di neve che ho fatto ⛄ Guarda:",
    shareTextNoName: "Guarda il pupazzo di neve che ho fatto ⛄",
    fileName: "pupazzo-di-neve"
  },
  og: {
    brand: "⛄ Pupazzo di neve",
    defaultKicker: "Fare un pupazzo di neve",
    defaultTitle: "Rotola, impila e vesti il pupazzo",
    defaultDesc: "Cappelli · sciarpe · neve che scende · salva o condividi"
  },
  faq: [
    {
      q: "Come costruisco il mio pupazzo di neve?",
      a: "Segui i passi sotto l’immagine: palle di neve, viso, naso, cappello, sciarpa, braccia, extra e sfondo. Tocca un’opzione per provarla e il pupazzo cambia subito. Puoi passare da un passo all’altro quando vuoi."
    },
    {
      q: "Cosa fa «Sorprendimi»?",
      a: "Sceglie per te una combinazione casuale di tutti i pezzi. Continua a toccare finché non ne trovi una che ti piace, poi cambia a mano un singolo pezzo."
    },
    {
      q: "Come salvo o invio il mio pupazzo?",
      a: "Tocca «Il pupazzo è pronto». «Salva immagine» crea un PNG da 1080×1350, mentre i pulsanti di condivisione inviano un link. Chi lo apre spazza via la neve per conoscere il tuo pupazzo e può farne uno tutto suo."
    },
    {
      q: "Dove viene conservato il mio pupazzo?",
      a: "Le tue scelte e il nome stanno solo nel link e, mentre costruisci, nel tuo browser. Non vengono mai inviati al nostro server, quindi chiunque abbia il link può vederli."
    }
  ],
  privacy: {
    title: "Informativa sulla privacy | Pupazzo di neve",
    description: "Informativa sulla privacy di Pupazzo di neve: come vengono gestiti il pupazzo e il suo nome, cookie, pubblicità e statistiche anonime.",
    h1: "Informativa sulla privacy",
    introHtml: "Pupazzo di neve (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    sections: [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Il tuo pupazzo di neve e il nome che scrivi non vengono mai inviati a un server. Restano nel tuo browser (mentre costruisci viene salvata una bozza nella memoria locale) e nell’URL quando condividi. Durante l’uso del Servizio alcune informazioni possono essere raccolte automaticamente, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie per mostrare annunci e capire come viene utilizzato. Puoi rifiutare o eliminare i cookie dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non comportarsi come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri, che conservano solo totali giornalieri per lingua (pagine viste, pupazzi completati, valutazioni a stelle). Nulla di tutto ciò ti identifica personalmente né contiene il nome del tuo pupazzo."
      ],
      [
        "5. Link condivisi e immagini",
        "I link creati con «Condividi» contengono il tuo pupazzo codificato nell’URL, quindi chiunque abbia il link può vederlo. Le immagini salvate vengono create all’interno del tuo browser. Evita di inserire indirizzi, numeri di telefono o altri dati personali nel nome."
      ],
      [
        "6. Contatti",
        "Per qualsiasi domanda su questa informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "7. Data di efficacia",
        "Questa informativa è valida dal 9 novembre 2026."
      ]
    ],
    back: "← Torna a Pupazzo di neve"
  }
};
