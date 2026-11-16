/* Calendario dell’Avvento — italiano (it/)
 * Design, limiti, date e formato del link in advent-core.js; schermate e canvas in advent.js. Questo file contiene tutti i testi visibili.
 * Le chiavi che finiscono in Html sono inserite come HTML (solo <br> e <em>); anche i testi di privacy.sections.
 * Schermata iniziale = solo anteprima (niente modulo né FAQ). Le FAQ compaiono solo nella schermata finale comune.
 * Lascia {name} {n} {day} {date} {title} così come sono. Plurali secondo Intl.PluralRules (one, other).
 * editor.ideas = messaggi scritti in italiano (non traduzioni), massimo 80 caratteri ciascuno.
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Calendario dell’Avvento da regalare: 24 caselle",
    description: "Crea gratis un calendario dell’Avvento personalizzato: un messaggio dietro ognuna delle 24 finestrelle, da inviare con un link. Dal 1° dicembre se ne apre una al giorno.",
    ogTitle: "Calendario dell’Avvento da regalare 🎄",
    ogDescription: "Nascondi 24 piccoli messaggi per una persona speciale. A dicembre si apre una finestrella al giorno."
  },
  siteName: "Calendario dell’Avvento",
  privacyLink: "Privacy",
  start: {
    badge: "🎄 Conto alla rovescia per Natale",
    h1Kicker: "Calendario dell’Avvento",
    h1Html: "24 finestrelle,<br>una <em>sorpresa</em> al giorno",
    hook: "Nascondi un messaggio dietro ogni finestrella per una persona a cui vuoi bene. Dal 1° dicembre potrà aprirne una al giorno.",
    start: "Crea il calendario →"
  },
  editor: {
    title: "Riempi il calendario",
    themesAria: "Design del calendario",
    themes: {
      classic: "Classico",
      snow: "Innevato",
      gold: "Oro stellato",
      candy: "Caramella"
    },
    fields: {
      to: { label: "Per", placeholder: "es. Giulia" },
      from: { label: "Da", placeholder: "es. Marco" }
    },
    daysLabel: "Messaggi dietro le finestrelle",
    daysHint: "Fino a 80 caratteri ciascuno. Le finestrelle vuote nascondono un dolcetto.",
    dayAria: "Messaggio della finestrella {day}",
    diceAria: "Idea a caso per la finestrella {day}",
    placeholder: "Scrivi un messaggio…",
    counter: "{n}/24 finestrelle piene",
    fillAll: "🎲 Riempi le vuote",
    preview: "👀 Anteprima",
    create: "Crea il link",
    needOne: "Scrivi almeno un messaggio."
  },
  ideas: [
    "Buongiorno! Oggi è una giornata perfetta per essere te.",
    "La cioccolata calda di questa settimana la offro io. Tu scegli il bar.",
    "Sono così felice di averti nella mia vita. Tutto qui, questo è il messaggio.",
    "Metti la tua canzone preferita e balla per un minuto. Lo dice il dottore.",
    "Ti ricordi quella volta che abbiamo riso fino alle lacrime? Io sì.",
    "Buono per: una serata film, scegli tu, i popcorn li porto io.",
    "Hai più coraggio di quanto pensi e più dolcezza di quanto sai.",
    "Missione di oggi: fotografa qualcosa che ti fa sorridere.",
    "Piccolo promemoria: bevi un bicchiere d’acqua e fai uno stiracchiamento.",
    "Se oggi la giornata è lunga, questo messaggio è un piccolo abbraccio.",
    "Con te anche i giorni normali sembrano vacanze.",
    "Ci sentiamo stasera? Voglio sapere com’è andata la tua giornata.",
    "Buono per: un abbraccio, valido sempre, nessuna scadenza.",
    "Concediti qualcosa di dolce oggi. Te lo meriti.",
    "Siamo a metà strada verso Natale! Stai andando alla grande.",
    "Esci un attimo e guarda il cielo. Magari nevica da qualche parte.",
    "Tre cose che adoro di te: la tua risata, il tuo cuore, le tue playlist.",
    "Scrivi una cosa bella di quest’anno. Comincio io: averti conosciuto.",
    "Buono per: una faccenda di casa a tua scelta, fatta senza lamentarmi.",
    "Sei la mia notifica preferita.",
    "Stasera accendi una candela ed esprimi un desiderio.",
    "Anche riposare conta. Oggi prenditela con calma.",
    "Domani Natale sarà ancora più vicino. Tieni duro!",
    "Buona Vigilia! Grazie di essere come sei.",
    "Scegliamo una cosa bella da fare insieme l’anno prossimo.",
    "Stasera coperta morbida, tisana e zero impegni.",
    "Curiosità: è facilissimo volerti bene.",
    "Manda un messaggio carino a qualcuno oggi. Puoi cominciare da me.",
    "Non importa la distanza, ti porto sempre nel cuore.",
    "Panettone o pandoro? Oggi è giorno di golosità."
  ],
  calendar: {
    heading: "Calendario dell’Avvento",
    forName: "Per {name}",
    forNone: "Un calendario dell’Avvento per te",
    fromName: "Da {name}",
    before: {
      one: "La prima finestrella si apre il {date}. Manca solo {n} giorno!",
      other: "La prima finestrella si apre il {date}. Mancano {n} giorni!"
    },
    during: "Oggi è il {date}. Apri la finestrella di oggi!",
    after: "È arrivato Natale. Tutte le finestrelle sono aperte.",
    locked: {
      one: "La finestrella {day} si apre il {date}, tra {n} giorno.",
      other: "La finestrella {day} si apre il {date}, tra {n} giorni."
    },
    hint: "Tocca una finestrella per aprirla",
    doorAria: "Finestrella {day}",
    dayTitle: "{date}",
    treat: "Oggi niente messaggio, solo un piccolo dolcetto per te.",
    close: "Chiudi",
    makeOwn: "🎄 Crea il tuo"
  },
  preview: {
    badge: "👀 Anteprima",
    note: "Questa schermata la vedi solo tu. Qui tutte le finestrelle sono aperte per controllare i messaggi. Per chi lo riceve se ne apre una al giorno.",
    back: "← Indietro"
  },
  result: {
    eyebrowMine: "Il tuo calendario dell’Avvento è pronto!",
    eyebrowFriend: "Un calendario fatto apposta per te",
    linkLabel: "Link del calendario",
    copy: "Copia",
    copied: "Link copiato!",
    copyFail: "Impossibile copiare. Seleziona il link e copialo.",
    note: "I messaggi esistono solo dentro questo link. Chi ce l’ha può aprire ogni finestrella nel suo giorno, quindi mandalo solo alla persona giusta.",
    save: "Salva immagine",
    saving: "Creo l’immagine…",
    saved: "Immagine salvata!",
    saveFail: "Impossibile creare l’immagine. Fai uno screenshot.",
    imageAlt: "Calendario dell’Avvento con 24 finestrelle chiuse",
    preview: "Vedi tutte le finestrelle",
    edit: "Modifica",
    retry: "Crea un altro calendario",
    retryFriend: "Crea il tuo",
    shareTitle: "Calendario dell’Avvento",
    shareText: "Ti ho fatto un calendario dell’Avvento 🎄 Dal 1° dicembre si apre una finestrella al giorno:",
    shareTextFriend: "Crea un calendario dell’Avvento per una persona speciale 🎄",
    fileName: "calendario-avvento"
  },
  og: {
    brand: "🎄 Calendario dell’Avvento",
    kicker: "Calendario dell’Avvento da regalare",
    title: "24 finestrelle, una sorpresa al giorno",
    desc: "4 design · un messaggio per finestrella · via link"
  },
  faq: [
    {
      q: "Quando si aprono le finestrelle?",
      a: "La finestrella 1 il 1° dicembre, la 2 il 2 dicembre e così via fino al 24, secondo la data del telefono o del computer di chi lo riceve. Dal 25 dicembre al 31 gennaio sono tutte aperte; prima di dicembre restano tutte chiuse."
    },
    {
      q: "Dove vengono salvati i miei messaggi?",
      a: "Solo dentro il link. Nulla di ciò che scrivi viene inviato al nostro server, quindi chi ha il link può leggere i messaggi quando si apre ogni finestrella. Mandalo solo alla persona giusta."
    },
    {
      q: "Posso cambiare un messaggio dopo aver inviato il link?",
      a: "No: i messaggi sono dentro il link stesso, che non si può modificare. Modifica il calendario, crea un nuovo link e invia quello."
    },
    {
      q: "Cosa c’è dietro una finestrella vuota?",
      a: "Un piccolo dolcetto del giorno, come un biscotto, un bastoncino di zucchero o una stellina. Puoi riempirle tutte, solo alcune, oppure farti suggerire idee dal dado."
    }
  ],
  privacy: {
    title: "Privacy | Calendario dell’Avvento",
    description: "Informativa privacy del Calendario dell’Avvento: come vengono gestiti i tuoi messaggi, cookie, pubblicità e statistiche anonime.",
    h1: "Informativa sulla privacy",
    introHtml: "Il Calendario dell’Avvento (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    sections: [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. I nomi e i messaggi che scrivi non vengono mai inviati a un server. Restano nel tuo browser (durante la modifica una bozza è salvata nella memoria locale) e dentro il link quando lo condividi. Le finestrelle già aperte vengono ricordate solo nel browser di chi riceve il link. Alcune informazioni possono essere raccolte automaticamente, come descritto qui sotto."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie per mostrare annunci e capire come viene utilizzato. Puoi rifiutare o eliminare i cookie dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Puoi saperne di più e modificare le preferenze in <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (visualizzazioni, calendari creati, valutazioni a stelle). Niente di tutto ciò ti identifica né contiene ciò che hai scritto."
      ],
      [
        "5. Link condivisi e immagini",
        "I link creati con il Servizio contengono il tuo calendario codificato nell’URL, quindi chi ha il link può leggere ogni messaggio quando si apre la sua finestrella. Le immagini salvate mostrano solo i numeri delle finestrelle e vengono create nel tuo browser. Evita di scrivere indirizzi, numeri di telefono o altri dati personali nei messaggi."
      ],
      [
        "6. Contatti",
        "Per domande su questa informativa, contatta il gestore del sito."
      ],
      [
        "7. Data di entrata in vigore",
        "Questa informativa è in vigore dal 17 novembre 2026."
      ]
    ],
    back: "← Torna al Calendario dell’Avvento"
  }
};
