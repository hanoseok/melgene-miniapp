/* Intagliare la zucca di Halloween online — italiano (/it/)
 * Stessa struttura di chiavi di en.js. Disegni e numero di pezzi sono in pumpkin-core.js.
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
    title: 'Intagliare la zucca di Halloween online',
    description: 'Intagliare la zucca di Halloween online: scegli occhi, naso e bocca, accendi la candela e crea la tua zucca illuminata. Gratis, senza download, in un minuto.',
    ogTitle: 'Intagliare la zucca di Halloween online 🎃',
    ogDescription: 'Crea la tua zucca di Halloween in un minuto, accendi la candela e mandala a un amico.',
  },
  siteName: 'Zucca di Halloween',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '🎃 Speciale Halloween',
    h1Kicker: 'Intagliare la zucca di Halloween',
    h1Html: 'Intaglia la tua<br><em>zucca</em> di Halloween',
    hook: 'Niente coltelli, niente pasticci. Dai una faccia alla tua zucca, accendi la candela e guardala brillare.',
    start: 'Inizia a intagliare →',
  },

  editor: {
    title: 'Intaglia la tua zucca',
    hint: 'Suggerimento: tocca la zucca per provare la prossima',
    previewAria: 'La tua zucca. Toccala per provare la prossima opzione',
    tabsAria: 'Parti della zucca',
    tabs: { shape: 'Forma', color: 'Colore', eyes: 'Occhi', nose: 'Naso', mouth: 'Bocca', stem: 'Picciolo', extra: 'Extra' },
    optionAria: '{part} {n}',
    glow: 'Candela',
    night: 'Notte',
    nameLabel: 'Dai un nome alla zucca (facoltativo)',
    namePlaceholder: 'es. Sorrisone',
    random: 'Casuale',
    done: 'Fatto!',
  },

  result: {
    eyebrowMine: 'La tua zucca di Halloween è pronta!',
    eyebrowFriend: 'Un amico ha intagliato questa zucca per te',
    untitled: 'La mia zucca',
    imageAlt: 'Zucca di Halloween: {name}',
    save: 'Salva immagine',
    saving: 'Creo l’immagine…',
    saved: 'Immagine salvata!',
    saveFail: 'Impossibile creare l’immagine. Prova con uno screenshot.',
    edit: 'Continua a modificare',
    retry: 'Intaglia un’altra zucca',
    retryFriend: 'Intaglia la tua zucca',
    shareTitle: 'Intagliare la zucca di Halloween online',
    shareText: 'Ho intagliato una zucca di Halloween chiamata «{name}» 🎃 Intaglia anche la tua!',
    shareTextNoName: 'Ho intagliato la mia zucca di Halloween 🎃 Intaglia anche la tua!',
    fileName: 'la-mia-zucca',
  },

  og: {
    brand: '🎃 Zucca di Halloween',
    defaultKicker: 'Intagliare la zucca online',
    defaultTitle: 'Intaglia la tua zucca di Halloween',
    defaultDesc: 'Occhi, naso, bocca e luce di candela · gratis nel browser',
  },

  faq: [
    { q: 'Come si intaglia la zucca?', a: 'Scegli una scheda (forma, colore, occhi, naso, bocca, picciolo o extra) e tocca un’opzione. Toccando la zucca passi all’opzione successiva, mentre «Casuale» mescola tutto. Quando ti piace, tocca «Fatto!».' },
    { q: 'Posso salvare la mia zucca come immagine?', a: 'Sì. «Salva immagine» trasforma la tua zucca in un PNG. Sul telefono puoi salvarla nelle foto dal menu di condivisione; sul computer viene scaricata.' },
    { q: 'Come funziona il link da condividere?', a: 'Tutto il tuo design, nome compreso, è contenuto nel link stesso. Chi lo apre vede esattamente la stessa zucca e poi può intagliare la sua. Sui nostri server non viene salvato niente.' },
    { q: 'A cosa servono gli interruttori Candela e Notte?', a: 'La candela fa brillare le parti intagliate di una luce calda, come una vera candela all’interno. Spegnila per un look di giorno. L’interruttore Notte cambia lo sfondo tra cielo stellato e sfondo chiaro.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Zucca di Halloween',
    description: 'Informativa sulla privacy di Zucca di Halloween: come viene trattato il tuo design, cookie, pubblicità e statistiche anonime.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Zucca di Halloween (il "Servizio") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. La tua zucca e il suo nome non vengono mai inviati a un server: restano nel tuo browser (e nell’URL quando condividi). Alcune informazioni possono essere raccolte automaticamente mentre usi il Servizio, come descritto di seguito.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie per mostrare pubblicità e capire come viene usato il Servizio. Puoi rifiutare o eliminare i cookie nelle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra pubblicità tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti. Puoi saperne di più e modificare le tue preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e nostri contatori aggregati che conservano solo totali giornalieri per lingua (visualizzazioni, zucche completate, valutazioni). Nulla di tutto ciò ti identifica personalmente.'],
      ['5. Link condivisi e immagini', 'I link creati con "Condividi" contengono il tuo design e il nome che hai scritto, codificati nell’URL. Le immagini salvate vengono create nel tuo browser. Evita di usare come nome informazioni che ti identificano personalmente.'],
      ['6. Contatti', 'Per domande su questa informativa, contatta l’operatore del Servizio.'],
      ['7. Data di entrata in vigore', 'Questa informativa è in vigore dal 28 settembre 2026.'],
    ],
    back: '← Torna a Zucca di Halloween',
  },
};
