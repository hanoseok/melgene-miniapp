/* Generatore di squadre casuali — italiano (/it/)
 * Stessa struttura di chiavi di en.js.
 */
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
    title: 'Generatore di squadre casuali – Dividi in squadre',
    description: 'Generatore di squadre casuali: incolla i nomi, scegli quante squadre o quante persone per squadra e dividi il gruppo in squadre equilibrate. Capitani separati, stesso risultato in un link. Gratis, senza registrazione.',
    ogTitle: 'Generatore di squadre casuali 🎲 Dividi in squadre',
    ogDescription: 'Incolla i nomi, mescola e hai squadre giuste in pochi secondi. Condividi il risultato esatto.',
  },
  siteName: 'Generatore di squadre',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '🎲 Basta litigare per le squadre',
    h1Kicker: 'Generatore di squadre casuali',
    h1Html: 'Chi finirà<br>nella <em>tua squadra</em>?',
    hook: 'Incolla i nomi, tocca mescola e lascia che sia il caso a dividere il gruppo. Senza discussioni.',
    facts: 'Fino a 60 nomi · capitani separati · risultato da condividere',
    start: 'Fai le squadre →',
  },

  input: {
    title: 'Chi gioca?',
    namesLabel: 'Nomi',
    namesHint: 'Uno per riga o separati da virgole. Metti * davanti a un capitano.',
    placeholder: 'Giulia\nLeonardo\n*Sofia\nFrancesco, Aurora, Lorenzo',
    sample: 'Nomi di esempio',
    clear: 'Cancella',
    tooMany: 'Vengono usati solo i primi {max} nomi.',
    needMore: 'Inserisci almeno 2 nomi.',
    modeLabel: 'Dividi per',
    modeTeams: 'Numero di squadre',
    modeSize: 'Persone a squadra',
    minus: 'Meno',
    plus: 'Più',
    previewEq: '{k} squadre × {size}',
    previewRange: '{k} squadre × {min}–{max}',
    leaders: 'Capitani (*) in squadre diverse',
    leadersCount: 'Capitani segnati: {n}',
    leadersNone: 'Metti * davanti a un nome per farlo capitano',
    shuffle: 'Mescola le squadre 🎲',
  },

  result: {
    shuffling: 'Si mescola…',
    title: 'Le squadre',
    sharedTitle: 'Squadre condivise',
    sharedNote: 'Qualcuno ha condiviso con te queste squadre.',
    captain: 'Capitano',
    rename: 'Altri nomi di squadra',
    again: 'Rimescola',
    edit: 'Modifica i nomi',
    copy: 'Copia come testo',
    copied: 'Squadre copiate!',
    makeOwn: 'Fai le tue squadre',
    badShare: 'Questo link non funziona: fai qui le tue squadre.',
    shareTitle: 'Generatore di squadre casuali – Dividi in squadre',
    shareText: 'Ecco le nostre {k} squadre estratte a sorte 🎲',
  },

  people: { one: '{n} persona', other: '{n} persone' },

  teams: {
    tiger: 'Le Tigri',
    eagle: 'Le Aquile',
    shark: 'Gli Squali',
    wolf: 'I Lupi',
    fox: 'Le Volpi',
    panda: 'I Panda',
    lion: 'I Leoni',
    owl: 'I Gufi',
    dolphin: 'I Delfini',
    bear: 'Gli Orsi',
    rabbit: 'I Conigli',
    penguin: 'I Pinguini',
    dragon: 'I Draghi',
    unicorn: 'Gli Unicorni',
    octopus: 'I Polpi',
    frog: 'Le Rane',
    koala: 'I Koala',
    parrot: 'I Pappagalli',
    bee: 'Le Api',
    turtle: 'Le Tartarughe',
  },

  sample: ['Giulia', 'Leonardo', 'Sofia', 'Francesco', 'Aurora', 'Lorenzo', 'Alice', 'Mattia', 'Ginevra', 'Tommaso', 'Emma', 'Andrea'],

  og: {
    brand: '🎲 Generatore di squadre',
    kicker: 'Dentro i nomi · fuori le squadre',
    title: 'Chi finirà nella tua squadra?',
    desc: 'Squadre casuali e giuste in pochi secondi · capitani separati · condividi',
  },

  faq: [
    { q: 'Come divido dei nomi in squadre?', a: 'Scrivi o incolla i nomi, uno per riga o separati da virgole (fino a 60). Scegli quante squadre vuoi o quante persone per squadra e tocca mescola. Le squadre non differiscono mai di più di una persona.' },
    { q: 'Il sorteggio è davvero equo?', a: 'Sì. I nomi vengono mescolati con il generatore casuale crittografico del browser (crypto.getRandomValues) e l’algoritmo di Fisher–Yates, quindi ogni divisione possibile ha esattamente la stessa probabilità. Né noi né altri possono pilotare il risultato.' },
    { q: 'Come funzionano i capitani?', a: 'Metti * davanti a un nome per segnarlo come capitano e attiva «Capitani in squadre diverse». Prima viene assegnato un capitano a ogni squadra, poi tutti gli altri vengono mescolati. Se i capitani sono più delle squadre, alcune ne avranno due.' },
    { q: 'Cosa contiene il link di condivisione?', a: 'Il link stesso contiene i nomi e le squadre esatte, quindi chi lo apre vede lo stesso risultato. Sul nostro server non viene salvato nulla. La tua ultima lista resta solo in questo browser, così non devi riscriverla.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Generatore di squadre',
    description: 'Informativa sulla privacy del Generatore di squadre casuali: i nomi restano nel browser, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Il Generatore di squadre casuali (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. I nomi che inserisci vengono elaborati solo nel tuo browser e non sono inviati al nostro server. Se condividi un risultato, i nomi e le squadre sono scritti nel link stesso, quindi chiunque abbia il link può vederli. Alcune informazioni possono essere raccolte automaticamente durante l’uso, come descritto sotto.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e l’ultima lista di nomi, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni degli annunci Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (visualizzazioni, mescolate, valutazioni). Nulla di tutto ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dal 1° ottobre 2026.'],
    ],
    back: '← Torna al Generatore di squadre',
  },
};
