/* Lancia i dadi — italiano (tu). Stessa struttura di en.js (vedi i commenti). */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Lancia i dadi online – Simulatore di dadi',
    description: 'Lancia i dadi online con un solo tocco: tira da uno a sei dadi insieme, scegli il classico d6 oppure d4, d8, d10, d12 e d20 per i giochi di ruolo e vedi subito il totale. Equo, gratis, senza registrazione.',
    ogTitle: 'Lancia i dadi 🎲 Dadi online',
    ogDescription: 'Tira da uno a sei dadi, dal d6 al d20, e vedi il totale con un tocco.',
  },
  siteName: 'Lancia i dadi',
  privacyLink: 'Informativa sulla privacy',

  hero: {
    h1Kicker: 'Lancia i dadi online',
    h1Html: 'Agita, lancia e<br>lascia decidere ai <em>dadi</em>',
    hook: 'Scegli quanti dadi e di che tipo, poi lancia. Per giochi da tavolo, giochi di ruolo o per decidere chi lava i piatti.',
  },

  ui: {
    dieLetter: 'd',
    countLabel: 'Quanti dadi?',
    typeLabel: 'Tipo di dado',
    typeHint: 'Il d6 è il classico cubo. Dal d4 al d20 sono per i giochi di ruolo.',
    roll: 'Lancia i dadi 🎲',
    rolling: 'Rotolano…',
    keyHint: 'Suggerimento: premi Spazio per lanciare',
    idle: 'Pronto quando vuoi',
    total: 'Totale {n}',
    trayLabel: 'Vassoio dei dadi',
    live: 'Hai fatto {values}. Totale {total}.',
    liveOne: 'Hai fatto {values}.',
    fair: 'Ogni faccia ha esattamente la stessa probabilità (casualità crittografica)',
  },

  history: {
    title: 'I tuoi ultimi 10 lanci',
    note: 'Conservati solo finché la pagina resta aperta.',
    item: '{dice}: {values} = {total}',
    itemOne: '{dice}: {values}',
  },

  result: {
    again: 'Lancia di nuovo',
    shareTitle: 'Lancia i dadi – Lancia i dadi online',
    shareText: 'Ho lanciato {dice} e ho fatto {values} = {total} 🎲',
    shareTextOne: 'Ho lanciato {dice} e ho fatto {values} 🎲',
  },

  og: {
    brand: '🎲 Lancia i dadi',
    kicker: 'Da 1 a 6 dadi · dal d4 al d20',
    title: 'Lancia i dadi online',
    desc: 'Un tocco e vedi ogni dado e il totale',
  },

  faq: [
    { q: 'Il lancio dei dadi online è davvero casuale ed equo?', a: 'Sì. Ogni risultato arriva dal generatore casuale crittografico del tuo browser (crypto.getRandomValues) con campionamento per rifiuto, quindi nessuna faccia è nemmeno un po’ più probabile delle altre. Il risultato viene deciso prima che parta l’animazione; i dadi che rotolano sono solo scena.' },
    { q: 'Quanti dadi posso lanciare insieme?', a: 'Da uno a sei dadi per lancio, tutti dello stesso tipo. Il vassoio mostra ogni dado e il totale, e gli ultimi dieci lanci restano in una breve lista finché la pagina è aperta.' },
    { q: 'Cosa sono d4, d8, d10, d12 e d20?', a: 'Sono dadi con 4, 8, 10, 12 e 20 facce, usati nei giochi di ruolo come Dungeons & Dragons. Il numero dopo la d indica quante facce ha il dado: un d20 dà da 1 a 20, e 2d6 vuol dire due dadi a sei facce.' },
    { q: 'Posso usarlo per i giochi da tavolo?', a: 'Certo. Usalo quando mancano i dadi, quando te ne servono più di quelli nella scatola o quando giochi in videochiamata. Da tastiera, premi Spazio per lanciare più in fretta.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Lancia i dadi',
    description: 'Informativa sulla privacy di Lancia i dadi: i tuoi lanci restano nel tuo browser, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Lancia i dadi (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né login. Le impostazioni dei dadi e i risultati vengono elaborati solo nel tuo browser e non vengono inviati al nostro server. Durante l’uso del Servizio alcune informazioni possono comunque essere raccolte automaticamente, come descritto di seguito.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del tuo browser per ricordare la tua lingua, mostrare annunci e capire come viene utilizzato. Puoi rifiutarli o eliminarli dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti. Puoi saperne di più e modificare le tue preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (pagine viste, lanci, valutazioni a stelle). Nulla di tutto ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per qualsiasi domanda su questa Informativa sulla privacy, contatta il gestore del sito.'],
      ['6. Data di entrata in vigore', 'La presente informativa è in vigore dal 9 ottobre 2026.'],
    ],
    back: '← Torna a Lancia i dadi',
  },
};
