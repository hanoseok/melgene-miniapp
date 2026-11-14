/* Creare attestato — italiano (it/). Stessa struttura di chiavi di en.js; vedi note in testa a en.js. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Playfair+Display:wght@700;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    serif: "'Playfair Display'",
    serifWeight: 700,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Creare attestato online: attestati divertenti",
    description: "Creare un attestato online: scrivi premio e motivazione, scegli cornice e timbro e fai un attestato divertente o di ringraziamento. Salvalo in A4 o invialo con un link.",
    ogTitle: "Creare attestato 🏆",
    ogDescription: "Un attestato divertente o affettuoso in un minuto, da consegnare con un link."
  },
  siteName: "Crea attestato",
  privacyLink: "Privacy",
  start: {
    badge: "🏆 Premiazioni di fine anno",
    h1Kicker: "Creare attestato",
    h1Html: "Qualcuno si merita<br><em>un premio</em>",
    hook: "Dai un nome al premio, scrivi perché e invia un link che si apre come una vera premiazione.",
    start: "Crea l’attestato →"
  },
  editor: {
    title: "Crea l’attestato",
    themesAria: "Stili di attestato",
    themes: {
      gold: "Cornice d’oro",
      pastel: "Pastello",
      minimal: "Essenziale",
      ribbon: "Nastro rétro"
    },
    previewAria: "Anteprima dell’attestato",
    examplesAria: "Idee per il nome del premio",
    sealLabel: "Timbro",
    seals: {
      none: "Nessuno",
      red: "Timbro rosso",
      gold: "Medaglia"
    },
    fields: {
      title: {
        label: "Nome del premio",
        placeholder: "es. Collega dell’anno"
      },
      to: {
        label: "Assegnato a",
        placeholder: "es. Giulia"
      },
      reason: {
        label: "Motivazione",
        placeholder: "Per aver…"
      },
      date: {
        label: "Data"
      },
      issuer: {
        label: "Consegnato da",
        placeholder: "es. Il comitato del caffè"
      }
    },
    titleExamples: [
      "Collega dell’anno",
      "Re della merenda",
      "Premio buonumore",
      "Campione di risate"
    ],
    dice: "🎲 A caso",
    counter: "{n}/{max}",
    reasons: [
      "Per aver tenuto vivo il gruppo WhatsApp tutto l’anno con meme di altissima qualità.",
      "Per aver salutato tutti con un sorriso anche il lunedì mattina.",
      "Per aver condiviso gli snack del cassetto senza mai fare il tirchio.",
      "Per essere il primo a dire «ci penso io» e l’ultimo ad andare via dopo aver sistemato.",
      "Per aver riso alle nostre battute, anche alla terza volta.",
      "Per ricordare compleanni, caffè preferiti e tutte le piccole attenzioni.",
      "Per una calma olimpica davanti a stampanti inceppate, ritardi e pane bruciato.",
      "Per aver lasciato l’ultimo biscotto quando nessuno se ne sarebbe accorto.",
      "Per perdersi sempre per strada ma trovare sempre la trattoria migliore.",
      "Per esserci stato, ogni volta, proprio quando serviva.",
      "Per aver assaggiato per primo la ricetta misteriosa con coraggio esemplare.",
      "Per averci dimostrato tutto l’anno che la gentilezza è un superpotere."
    ],
    done: "Completa l’attestato"
  },
  card: {
    heading: "Attestato di merito",
    defaultTitle: "Premio d’eccellenza",
    presented: "Il presente attestato è conferito con orgoglio a",
    name: "{name}",
    closing: "In riconoscimento di quanto sopra, si consegna questo premio con sincera gratitudine.",
    sealFallback: "★"
  },
  open: {
    eyebrow: "🏆 Premiazione",
    forName: "Un premio per {name}",
    forNone: "Un premio tutto per te",
    hint: "Tocca la pergamena per srotolarla",
    open: "Srotola l’attestato"
  },
  result: {
    eyebrowMine: "Il tuo attestato è pronto!",
    eyebrowFriend: "Congratulazioni, {name}!",
    eyebrowFriendNoName: "Congratulazioni!",
    imageAlt: "Attestato: {title}",
    save: "Salva immagine",
    saving: "Creazione dell’immagine…",
    saved: "Immagine salvata!",
    saveFail: "Impossibile creare l’immagine. Prova con uno screenshot.",
    edit: "Modifica",
    retry: "Crea un altro attestato",
    retryFriend: "Crea il mio attestato",
    shareTitle: "Creare attestato",
    shareText: "C’è un premio per {name} 🏆 Apri la premiazione qui:",
    shareTextNoName: "Qualcuno ti ha dato un premio 🏆 Apri la premiazione qui:",
    fileName: "attestato"
  },
  og: {
    brand: "🏆 Crea attestato",
    defaultKicker: "Creare attestato",
    defaultTitle: "Qualcuno si merita un premio",
    defaultDesc: "4 stili · timbro · immagine A4 o link con premiazione",
    sampleTitle: "Re della merenda"
  },
  faq: [
    {
      q: "Come si crea un attestato?",
      a: "Scegli uno dei quattro stili, scrivi il nome del premio, chi lo riceve e la motivazione, poi data, chi lo consegna e timbro. L’anteprima cambia mentre scrivi. Quando ti piace, tocca «Completa l’attestato»."
    },
    {
      q: "Quanto è grande l’immagine salvata?",
      a: "«Salva immagine» crea un PNG da 1240×1754, con le proporzioni di un foglio A4: si stampa bene e resta nitido in chat. Sul telefono si apre il menu di condivisione, sul computer viene scaricato."
    },
    {
      q: "Cosa vede chi apre il mio link?",
      a: "Una piccola premiazione: appare una pergamena arrotolata, la tocca e l’attestato si srotola con il suo nome. Titolo e data compaiono nella sua lingua, e può crearne uno tutto suo."
    },
    {
      q: "Dove viene salvato quello che scrivo?",
      a: "Solo dentro il link e nel tuo browser. Niente viene inviato al nostro server, quindi chiunque abbia il link può leggere l’attestato: condividilo solo con chi vuoi tu."
    }
  ],
  privacy: {
    title: "Informativa sulla privacy | Creare attestato",
    description: "Informativa sulla privacy di Crea attestato: come viene gestito il testo, cookie, pubblicità e statistiche anonime.",
    h1: "Informativa sulla privacy",
    introHtml: "Crea attestato (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    sections: [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Il nome del premio, i nomi, la motivazione e la data che scrivi non vengono mai inviati a un server. Restano nel tuo browser (durante la modifica una bozza è salvata nella memoria locale) e nell’URL quando condividi. Alcune informazioni possono essere raccolte automaticamente, come descritto sotto."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie per mostrare annunci e capire come viene utilizzato. Puoi rifiutare o eliminare i cookie dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze in <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che tengono solo i totali giornalieri per lingua (visite, attestati completati, valutazioni). Niente di tutto ciò ti identifica o contiene ciò che hai scritto."
      ],
      [
        "5. Link condivisi e immagini",
        "I link creati con «Condividi» contengono l’attestato codificato nell’URL, quindi chiunque abbia il link può vederlo. Le immagini vengono create nel tuo browser. Evita di inserire indirizzi, numeri di telefono o altri dati personali."
      ],
      [
        "6. Contatti",
        "Per domande su questa informativa, contatta il gestore del sito."
      ],
      [
        "7. Data di efficacia",
        "Questa informativa è valida dal 15 novembre 2026."
      ]
    ],
    back: "← Torna a Crea attestato"
  }
};
