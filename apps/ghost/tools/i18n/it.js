/* Crea il tuo fantasmino — italiano (/it/)
 * Stessa struttura di chiavi di en.js. Disegni e numero di pezzi sono in ghost-core.js.
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
    title: 'Crea il tuo fantasmino di Halloween',
    description: 'Crea il tuo fantasmino di Halloween: scegli forma, occhi, bocca e cappello e dai vita a un fantasma tenerissimo. Gratis, senza download, pronto in un minuto.',
    ogTitle: 'Crea il tuo fantasmino di Halloween 👻',
    ogDescription: 'Un fantasmino tenerissimo in un minuto: fluttua e puoi mandarlo agli amici.',
  },
  siteName: 'Crea il tuo fantasmino',
  privacyLink: 'Privacy',

  start: {
    badge: '👻 Speciale Halloween',
    h1Kicker: 'Crea il tuo fantasmino',
    h1Html: 'Crea il tuo<br><em>fantasmino</em>',
    hook: 'Sotto quel lenzuolo si nasconde qualcuno di timido. Regalagli un faccino e un po’ di carattere, e guardalo fluttuare.',
    start: 'Crea il mio fantasmino →',
  },

  editor: {
    title: 'Decora il tuo fantasmino',
    hint: 'Suggerimento: tocca il fantasmino per vedere il prossimo',
    previewAria: 'Il tuo fantasmino. Toccalo per vedere l’opzione successiva',
    tabsAria: 'Parti del fantasmino',
    tabs: { body: 'Corpo', color: 'Colore', eyes: 'Occhi', mouth: 'Bocca', cheeks: 'Guance', hat: 'Cappello', item: 'In mano', bg: 'Sfondo' },
    optionAria: '{part} {n}',
    nameLabel: 'Dagli un nome (facoltativo)',
    namePlaceholder: 'es. Bubù',
    random: 'Casuale',
    done: 'Fatto!',
  },

  result: {
    eyebrowMine: 'Il tuo fantasmino è pronto a spaventare!',
    eyebrowFriend: 'Qualcuno ha creato questo fantasmino per te',
    untitled: 'Il mio fantasmino',
    imageAlt: 'Fantasmino: {name}',
    save: 'Salva immagine',
    saving: 'Sto creando l’immagine…',
    saved: 'Immagine salvata!',
    saveFail: 'Impossibile creare l’immagine. Prova con uno screenshot.',
    edit: 'Continua a decorare',
    retry: 'Crea un altro fantasmino',
    retryFriend: 'Crea il mio fantasmino',
    shareTitle: 'Crea il tuo fantasmino di Halloween',
    shareText: 'Ecco il mio fantasmino «{name}» 👻 Crea anche il tuo!',
    shareTextNoName: 'Ho creato il mio fantasmino 👻 Crea anche il tuo!',
    fileName: 'il-mio-fantasmino',
  },

  og: {
    brand: '👻 Crea il tuo fantasmino',
    defaultKicker: 'Fantasmino di Halloween',
    defaultTitle: 'Crea il tuo fantasmino',
    defaultDesc: 'Faccine, cappelli e piccoli amici · gratis',
  },

  faq: [
    { q: 'Come creo il mio fantasmino?', a: 'Scegli una scheda in alto nell’editor e tocca l’opzione che ti piace. Toccando il fantasmino passi all’opzione successiva di quella scheda, e «Casuale» mescola tutto. Quando ti piace, tocca «Fatto!».' },
    { q: 'Posso salvare il fantasmino come immagine?', a: 'Sì. «Salva immagine» trasforma il tuo fantasmino in un PNG. Sul telefono puoi tenerlo nella galleria dal menu di condivisione; sul computer viene scaricato.' },
    { q: 'Come funziona il link da condividere?', a: 'Tutto il fantasmino, nome compreso, è dentro il link stesso. Chi lo apre vede esattamente lo stesso fantasmino e poi può crearne uno suo. Sui nostri server non viene salvato niente.' },
    { q: 'Perché il mio fantasmino va su e giù?', a: 'Perché i fantasmi fluttuano! Quel piccolo movimento c’è solo sullo schermo. Se il dispositivo è impostato per ridurre il movimento resta fermo, e l’immagine salvata è sempre ferma.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Crea il tuo fantasmino',
    description: 'Informativa sulla privacy di Crea il tuo fantasmino: come viene trattato il tuo design, cookie, pubblicità e statistiche anonime.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Crea il tuo fantasmino (il "Servizio") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. Il tuo fantasmino e il suo nome non vengono mai inviati a un server: restano nel tuo browser (e nell’URL quando condividi). Alcune informazioni possono essere raccolte automaticamente mentre usi il Servizio, come descritto di seguito.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie per mostrare pubblicità e capire come viene usato il Servizio. Puoi rifiutare o eliminare i cookie nelle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra pubblicità tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti. Puoi saperne di più e modificare le tue preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e nostri contatori aggregati che conservano solo totali giornalieri per lingua (visualizzazioni, fantasmini completati, valutazioni). Nulla di tutto ciò ti identifica personalmente.'],
      ['5. Link condivisi e immagini', 'I link creati con "Condividi" contengono il tuo design e il nome che hai scritto, codificati nell’URL. Le immagini salvate vengono create nel tuo browser. Evita di usare come nome informazioni che ti identificano personalmente.'],
      ['6. Contatti', 'Per domande su questa informativa, contatta l’operatore del Servizio.'],
      ['7. Data di entrata in vigore', 'Questa informativa è in vigore dal 1° ottobre 2026.'],
    ],
    back: '← Torna a Crea il tuo fantasmino',
  },
};
