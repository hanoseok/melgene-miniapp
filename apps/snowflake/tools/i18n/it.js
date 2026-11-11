/* Crea fiocchi di neve — italiano (copia /it/). Stesse chiavi di en.js. Scrittura naturale, non traduzione letterale.
 * Le chiavi che finiscono con Html vengono inserite così come sono (solo <br> ed <em>). */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Nunito'",
    scriptWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Crea un fiocco di neve online · Snowflake Maker",
    description: "Crea online il tuo fiocco di neve simmetrico. Regola i bracci, il dettaglio e la lunghezza, scegli forma e colore, poi salva un'immagine PNG 1080 × 1080 o condividi un link.",
    ogTitle: "Crea un fiocco di neve ❄️",
    ogDescription: "Bastano pochi tocchi per far crescere un fiocco di neve a sei punte. Salvalo o mandalo a un amico."
  },
  siteName: "Snowflake Maker",
  privacyLink: "Informativa sulla privacy",
  start: {
    badge: "❄️ Speciale inverno",
    h1Kicker: "Crea fiocchi di neve online",
    h1Html: "Fai crescere un fiocco<br><em>tutto tuo</em>",
    hook: "Tocca qualche volta e guarda un fiocco perfettamente simmetrico prendere forma. Salvalo come immagine o invia il link a un amico.",
    start: "Inizia a creare →"
  },
  editor: {
    title: "Crea il tuo fiocco",
    canvasAria: "Anteprima del tuo fiocco di neve",
    labels: {
      arms: "Bracci per lato",
      complexity: "Dettaglio",
      size: "Lunghezza dei bracci"
    },
    levels: {
      complexity: ["Semplice", "Medio", "Dettagliato"],
      size: ["Corti", "Medi", "Lunghi"]
    },
    buttons: {
      newFlake: "Nuovo fiocco",
      shape: "Cambia forma",
      color: "Cambia colore",
      save: "Salva PNG",
      share: "Condividi",
      done: "Ho finito, mostra il fiocco"
    },
    shapes: {
      needle: "Aghi",
      plate: "Lamelle",
      spike: "Punte",
      feather: "Piume"
    },
    palettes: ["Blu ghiaccio", "Bianco brina", "Lilla", "Oro di mezzanotte", "Menta"],
    status: {
      copied: "Link copiato!",
      copyFail: "Impossibile copiare il link. Prova a salvare il PNG.",
      shared: "Condiviso!",
      saving: "Sto creando l'immagine…",
      saved: "Immagine salvata!",
      saveFail: "Impossibile creare l'immagine. Prova con uno screenshot."
    }
  },
  result: {
    eyebrowMine: "Il tuo fiocco è pronto!",
    eyebrowFriend: "Un amico ha creato questo fiocco per te",
    save: "Salva PNG",
    edit: "Continua a creare",
    retry: "Crea un nuovo fiocco",
    retryFriend: "Creo il mio",
    shareTitle: "Snowflake Maker",
    shareText: "Guarda il fiocco di neve che ho creato ❄️ Apri il link per vederlo:",
    fileName: "fiocco-di-neve"
  },
  og: {
    brand: "❄️ Snowflake Maker",
    defaultKicker: "Crea fiocchi di neve online",
    defaultTitle: "Fai crescere un fiocco tutto tuo",
    defaultDesc: "Sei punte · forme · colori · salva o condividi"
  },
  faq: [
    {
      q: "Come si crea un fiocco di neve?",
      a: "Tocca «Nuovo fiocco» per ottenere un disegno diverso, poi usa i tre cursori per bracci, dettaglio e lunghezza. Ogni fiocco è un solo braccio copiato sei volte e specchiato, quindi risulta sempre simmetrico."
    },
    {
      q: "A cosa servono i pulsanti di forma e colore?",
      a: "«Cambia forma» modifica il modo in cui sono disegnati i bracci (aghi, lamelle, punte o piume) mantenendo lo stesso disegno. «Cambia colore» cambia lo sfondo e il colore delle linee. Puoi provarli entrambi sullo stesso fiocco."
    },
    {
      q: "Come salvo o condivido il mio fiocco?",
      a: "«Salva PNG» scarica un'immagine 1080 × 1080. «Condividi» crea un link con le tue impostazioni: chi lo apre vede lo stesso fiocco."
    },
    {
      q: "Il mio fiocco viene conservato da qualche parte?",
      a: "No. Il fiocco esiste solo nell'immagine e nel link. Quando salvi o condividi, niente di ciò che crei viene caricato sul nostro server."
    }
  ],
  privacy: {
    title: "Informativa sulla privacy | Snowflake Maker",
    description: "Informativa sulla privacy di Snowflake Maker: come vengono trattati i tuoi fiocchi, cookie, pubblicità e statistiche anonime.",
    h1: "Informativa sulla privacy",
    introHtml: "Snowflake Maker (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    sections: [
      [
        "1. Informazioni che raccogliamo",
        "Il Servizio funziona senza account né accesso. Le impostazioni del tuo fiocco non vengono mai inviate a un server. Restano nel tuo browser e nel link quando lo condividi. Durante l'uso del Servizio possono essere raccolte automaticamente alcune informazioni, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie per mostrare annunci e capire come viene utilizzato. Puoi rifiutare o eliminare i cookie nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Per saperne di più e modificare le preferenze, consulta le <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati propri, che conservano solo i totali giornalieri per lingua (visualizzazioni di pagina, fiocchi completati). Nessuno di questi dati ti identifica personalmente."
      ],
      [
        "5. Link e immagini condivisi",
        "Un link creato con «Condividi» contiene le impostazioni del tuo fiocco nell'URL, quindi chiunque abbia il link può vedere lo stesso fiocco. Le immagini salvate vengono create nel tuo browser e non vengono caricate sui nostri server."
      ],
      [
        "6. Contatti",
        "Per qualsiasi domanda su questa Informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "7. Data di efficacia",
        "Questa informativa è efficace dall'11 novembre 2026."
      ]
    ],
    back: "← Torna a Snowflake Maker"
  }
};
