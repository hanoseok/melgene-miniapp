/* Generatore di QR code — Italiano (/it/)
 * L’encoder è in qr-core.js; questo file contiene tutti i testi visibili. Stessa struttura di chiavi di en.js.
 * Lasciare {bytes} {v} {n} {ratio} {value} invariati.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Generatore di QR code gratis – Wi-Fi, PNG, SVG',
    description: 'Generatore di QR code gratis per link, testo, Wi-Fi, e-mail e numeri di telefono. Scegli colori, correzione d’errore e dimensioni, poi scarica in PNG o SVG. Senza registrazione, nel browser.',
    ogTitle: 'Generatore di QR code 🔳 gratis e privato',
    ogDescription: 'Un QR code per link, Wi-Fi, e-mail o telefono in pochi secondi. Nulla lascia il tuo browser.',
  },
  siteName: 'Generatore di QR code',
  privacyLink: 'Privacy',
  fileName: 'qr-code',

  hero: {
    h1Kicker: 'Generatore di QR code',
    h1Html: 'Scrivi, <em>scansiona</em><br>e condividi',
    hook: 'Link, testo, Wi-Fi, e-mail o numero di telefono diventano un QR code mentre scrivi. Gratis, senza registrazione, creato nel tuo browser.',
  },

  ui: {
    typeLabel: 'Cosa deve contenere il QR code?',
    types: { link: 'Link', text: 'Testo', wifi: 'Wi-Fi', email: 'E-mail', phone: 'Chiama' },
    link: { label: 'Indirizzo del sito', placeholder: 'esempio.it/menu' },
    text: { label: 'Il tuo testo', placeholder: 'Una nota, un codice, un messaggio breve…' },
    wifi: {
      ssid: 'Nome della rete (SSID)', ssidPh: 'TIM-12345678',
      password: 'Password', passwordPh: 'Password del Wi-Fi',
      security: 'Sicurezza',
      sec: { WPA: 'WPA / WPA2 / WPA3', WEP: 'WEP (vecchio)', nopass: 'Senza password' },
      hidden: 'Rete nascosta',
    },
    email: { to: 'Indirizzo e-mail', toPh: 'nome@esempio.it', subject: 'Oggetto (facoltativo)', subjectPh: 'Ciao', body: 'Messaggio (facoltativo)', bodyPh: 'Scrivi un messaggio…' },
    phone: { label: 'Numero di telefono', placeholder: '+39 347 123 4567' },

    previewLabel: 'Anteprima del QR code',
    previewReady: 'Anteprima del QR code, versione {v}',
    emptyPreview: 'Il tuo QR code appare qui mentre scrivi',
    info: '{bytes} byte · versione {v} · {n}×{n} moduli',
    encodes: 'Contenuto: {value}',
    tooLong: 'Troppo lungo per un solo QR code. Accorcialo o scegli una correzione più bassa (L).',
    encodeFail: 'Impossibile creare questo QR code. Prova a cambiare il testo.',
    warnContrast: 'Contrasto basso ({ratio}:1). Potrebbe non essere letto: meglio un codice scuro su sfondo chiaro.',
    warnInverted: 'Codice chiaro su sfondo scuro. Alcune app non leggono i codici invertiti.',
    warnQuiet: 'Un margine stretto rende la scansione più difficile. Lascia almeno 2 moduli (lo standard è 4).',

    downloadPng: 'Scarica PNG',
    downloadSvg: 'Scarica SVG',
    copyImage: 'Copia immagine',
    savedPng: 'PNG salvato. Provalo una volta con lo smartphone prima di stampare.',
    savedSvg: 'SVG salvato. Perfetto per la stampa, nitido a ogni dimensione.',
    copied: 'Immagine copiata. Incollala in un documento o in chat.',
    copyFail: 'Qui non è possibile copiare immagini. Usa Scarica PNG.',
    saveFail: 'Salvataggio non riuscito. Riprova.',

    options: '🎨 Colori, dimensioni e correzione',
    colors: 'Colori',
    fg: 'Codice',
    bg: 'Sfondo',
    resetColors: 'Ripristina',
    ecc: 'Correzione d’errore',
    eccHint: 'I livelli alti resistono a graffi e loghi ma rendono il codice più fitto. M va bene quasi sempre.',
    size: 'Dimensione immagine',
    margin: 'Zona di rispetto (margine)',
    marginHint: 'Il bordo vuoto intorno al codice, in moduli. Lo standard è 4.',
    localNote: '🔒 Creato nel tuo browser. Quello che scrivi non viene mai inviato a un server.',
  },

  result: {
    doneTitle: 'Il tuo QR code è pronto ✓',
    doneText: 'Provalo con la fotocamera di uno smartphone prima di stamparlo o condividerlo. Modifica i campi qui sopra quando vuoi per crearne uno nuovo.',
    again: 'Crea un altro QR code',
    shareTitle: 'Generatore di QR code – gratis e privato',
    shareText: 'Crea un QR code per link, Wi-Fi o testo in pochi secondi, direttamente nel browser 🔳',
  },

  og: {
    brand: '🔳 Generatore di QR code',
    kicker: 'Link · Wi-Fi · Testo · PNG e SVG',
    title: 'Un QR code in pochi secondi',
    desc: 'Gratis, privato, creato nel browser',
  },

  faq: [
    { q: 'Quello che scrivo viene inviato da qualche parte?', a: 'No. Il QR code viene calcolato da JavaScript nel tuo browser, quindi link, password del Wi-Fi e messaggi non arrivano mai a un server. Non vengono nemmeno salvati: chiudendo la pagina spariscono.' },
    { q: 'I QR code scadono?', a: 'No. Sono QR code statici: il contenuto è scritto nel disegno stesso, senza reindirizzamenti o link di tracciamento in mezzo. Un codice stampato funziona finché esiste il link o la rete a cui punta.' },
    { q: 'Come funziona il QR code del Wi-Fi?', a: 'Salva nome della rete, password e tipo di sicurezza nel formato standard WIFI:. La fotocamera di iPhone e Android propone subito di connettersi, così gli ospiti non devono digitare la password del modem.' },
    { q: 'Quale livello di correzione scelgo?', a: 'M (circa il 15 % di recupero) va bene quasi sempre. Scegli Q o H per superfici ruvide, rischio di graffi o un logo al centro. L crea il codice più piccolo per contenuti lunghi mostrati sullo schermo.' },
    { q: 'PNG o SVG?', a: 'Il PNG è un’immagine normale per siti, chat e documenti. L’SVG è un file vettoriale che resta nitido a qualsiasi dimensione, ideale per poster, volantini e tipografia.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Generatore di QR code',
    description: 'Informativa sulla privacy del Generatore di QR code: ciò che scrivi resta nel browser, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Il Generatore di QR code (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. Link, testi, dati Wi-Fi, indirizzi e-mail e numeri di telefono che inserisci vengono trasformati in QR code solo nel tuo browser. Non vengono inviati al nostro server né salvati. Alcune informazioni possono essere raccolte automaticamente durante l’uso, come descritto sotto.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e l’archiviazione locale del browser per ricordare la lingua, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e impostazioni nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori nostri che conservano solo totali giornalieri per lingua (pagine viste, codici creati, valutazioni). Il contenuto dei tuoi QR code non ne fa mai parte e nulla di tutto ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dall’11 ottobre 2026.'],
    ],
    back: '← Torna al Generatore di QR code',
  },
};
