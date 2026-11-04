/* Decorare l’albero di Natale — Italiano (/it/). Stessa struttura di chiavi di en.js. Lascia {name} {n} {max} invariati.
 * Interfaccia con il tu, come il Biglietto di Natale. */
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
    title: "Decorare l’albero di Natale online",
    description: "Decora l’albero di Natale online: scegli l’albero, appendi palline, stelle e bastoncini di zucchero, accendi luci e neve, poi salva l’immagine o condividi il link.",
    ogTitle: "Decora il tuo albero di Natale 🎄",
    ogDescription: "Appendi le palline, accendi le luci e condividi il tuo albero di Natale in un minuto."
  },
  siteName: "Decorare l’albero di Natale",
  privacyLink: "Informativa sulla privacy",
  start: {
    badge: "🎄 Speciale Natale",
    h1Kicker: "Decorare l’albero di Natale",
    h1Html: "Il tuo albero<br><em>tutto luci</em>",
    hook: "Appendi palline e bastoncini di zucchero, accendi le luci, fai scendere la neve e manda il tuo albero a chi vuoi bene.",
    start: "Inizia a decorare →"
  },
  editor: {
    title: "Decora il tuo albero",
    canvasAria: "Il tuo albero di Natale. Tocca per appendere la decorazione scelta, trascina una decorazione per spostarla.",
    hint: "Tocca l’albero per appendere · trascina per spostare",
    paletteLabel: "Decorazioni",
    kinds: {
      red: "Pallina rossa",
      gold: "Pallina d’oro",
      blue: "Pallina blu",
      purple: "Pallina viola",
      silver: "Pallina argento",
      star: "Stella",
      bell: "Campanella",
      cane: "Bastoncino",
      gift: "Regalo",
      bow: "Fiocco",
      sock: "Calza",
      flake: "Fiocco di neve",
      cookie: "Biscotto",
      erase: "Gomma"
    },
    undo: "Annulla",
    clear: "Svuota",
    auto: "Sorprendimi",
    count: "{n}/{max} decorazioni",
    full: "L’albero è pieno! Prima sposta o cancella una decorazione.",
    styleLabel: "Albero",
    styles: {
      classic: "Classico",
      snowy: "Innevato",
      nordic: "Nordico",
      pink: "Rosa"
    },
    bgLabel: "Sfondo",
    bgs: {
      night: "Notte serena",
      cozy: "Salotto caldo",
      snowfield: "Neve fresca",
      red: "Rosso festa"
    },
    topperLabel: "Puntale",
    toppers: {
      none: "Nessuno",
      star: "Stella",
      angel: "Angelo",
      bow: "Fiocco"
    },
    extrasLabel: "Extra",
    snow: "Neve",
    lights: "Luci",
    fields: {
      name: {
        label: "Il tuo nome",
        placeholder: "es. Giulia"
      },
      message: {
        label: "Messaggio",
        placeholder: "es. Buon Natale!"
      }
    },
    ideas: "💡 Idee",
    counter: "{n}/{max}",
    presets: [
      "Buon Natale e felice anno nuovo!",
      "Panettone, tombola e tanto affetto 🎄",
      "Auguri di cuore da tutta la famiglia!",
      "Che la magia del Natale scaldi la tua casa",
      "Pace, serenità e un pizzico di neve ❄️"
    ],
    done: "Ho finito l’albero"
  },
  card: {
    by: "Decorato da {name}"
  },
  result: {
    eyebrowMine: "Il tuo albero è pronto!",
    eyebrowFriend: "{name} ha decorato quest’albero per te",
    eyebrowFriendNoName: "Qualcuno ha decorato quest’albero per te",
    imageAlt: "Albero di Natale decorato con {n} decorazioni",
    save: "Salva immagine",
    saving: "Sto creando l’immagine…",
    saved: "Immagine salvata!",
    saveFail: "Non è stato possibile creare l’immagine. Prova con uno screenshot.",
    edit: "Decora ancora",
    retry: "Decora un nuovo albero",
    retryFriend: "Decora il mio albero",
    shareTitle: "Decorare l’albero di Natale",
    shareText: "{name} ha decorato un albero di Natale 🎄 Dai un’occhiata:",
    shareTextNoName: "Guarda l’albero di Natale che ho decorato 🎄",
    fileName: "christmas-tree"
  },
  og: {
    brand: "🎄 Decorare l’albero di Natale",
    defaultKicker: "Decorare l’albero di Natale",
    defaultTitle: "Il tuo albero tutto luci",
    defaultDesc: "Decorazioni · luci · neve · salva o condividi"
  },
  faq: [
    {
      q: "Come appendo una decorazione?",
      a: "Scegli una decorazione nella fila sotto l’albero, poi tocca un punto qualsiasi dell’albero. Per spostarla, tienila premuta e trascinala. Con la gomma togli una sola decorazione, con Annulla torni indietro di un passo."
    },
    {
      q: "Posso cambiare l’albero dopo aver messo le decorazioni?",
      a: "Sì. Puoi cambiare forma dell’albero, sfondo e puntale, e accendere o spegnere neve e luci in qualsiasi momento. Le decorazioni restano esattamente dove le hai messe."
    },
    {
      q: "Come salvo o invio il mio albero?",
      a: "Tocca «Ho finito l’albero». «Salva immagine» crea un PNG da 1080×1350, mentre i pulsanti di condivisione inviano un link. Chi lo apre vede il tuo albero con le luci che brillano e può decorarne uno tutto suo."
    },
    {
      q: "Dove viene conservato il mio albero?",
      a: "Decorazioni, nome e messaggio stanno solo nel link e, mentre decori, nel tuo browser. Non vengono mai inviati al nostro server, quindi chiunque abbia il link può vederli."
    }
  ],
  privacy: {
    title: "Informativa sulla privacy | Decorare l’albero di Natale",
    description: "Informativa sulla privacy di Decorare l’albero di Natale: come vengono gestiti albero, nome e messaggio, cookie, pubblicità e statistiche anonime.",
    h1: "Informativa sulla privacy",
    introHtml: "Decorare l’albero di Natale (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    sections: [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Il tuo albero, il nome e il messaggio che scrivi non vengono mai inviati a un server. Restano nel tuo browser (mentre decori viene salvata una bozza nella memoria locale) e nell’URL quando condividi. Durante l’uso del Servizio alcune informazioni possono essere raccolte automaticamente, come descritto di seguito."
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
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri, che conservano solo totali giornalieri per lingua (pagine viste, alberi completati, valutazioni a stelle). Nulla di tutto ciò ti identifica personalmente né contiene il tuo nome o il tuo messaggio."
      ],
      [
        "5. Link condivisi e immagini",
        "I link creati con «Condividi» contengono il tuo albero codificato nell’URL, quindi chiunque abbia il link può vederlo. Le immagini salvate vengono create all’interno del tuo browser. Evita di inserire indirizzi, numeri di telefono o altri dati personali nel messaggio."
      ],
      [
        "6. Contatti",
        "Per qualsiasi domanda su questa informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "7. Data di efficacia",
        "Questa informativa è valida dal 5 novembre 2026."
      ]
    ],
    back: "← Torna a Decorare l’albero di Natale"
  }
};
