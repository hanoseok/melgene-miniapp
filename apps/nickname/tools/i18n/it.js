/* Generatore di nickname — italiano (tu). words: per mood { adj, noun } (aggettivi 'masc/fem', nomi '|m' '|f'). Vedi en.js */
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
    title: 'Generatore di nickname – Nomi carini e cool',
    description: 'Non ti viene in mente un nickname? Scegli un mood (carino, cool, divertente, sognante), aggiungi il tuo nome se vuoi e ottieni un nickname casuale con un tocco. Rigenera finché non ti piace, poi copialo. Gratis.',
    ogTitle: 'Generatore di nickname ✨ Nomi carini e cool',
    ogDescription: 'Scegli un mood, aggiungi il tuo nome e copia il nickname con un tocco.',
  },
  siteName: 'Generatore di nickname',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '🏷️ Senza idee per un nick?',
    h1Kicker: 'Generatore di nickname',
    h1Html: 'Trova il nickname<br>che è <em>solo tuo</em>',
    hook: 'Scegli un mood, aggiungi il tuo nome se vuoi e ricevi un nickname fatto apposta per te.',
    facts: 'Carino, cool, divertente, sognante · mescola il tuo nome · copia con un tocco',
    start: 'Crea il mio nickname →',
  },

  make: {
    title: 'Che mood ti va?',
    moodLabel: 'Scegli un mood',
    moods: { cute: 'Carino', cool: 'Cool', funny: 'Divertente', dreamy: 'Sognante', mystic: 'Misterioso' },
    nameLabel: 'Il tuo nome o qualche lettera (facoltativo)',
    nameHint: 'Lo mescoliamo al nickname. Fino a 12 caratteri, resta nel tuo browser.',
    namePlaceholder: 'es. Giulia',
    numbers: '＋ Aggiungi numeri',
    poolCount: 'Combinazioni per questo mood: {n}+',
    make: 'Crea il mio nickname 🎲',
  },

  result: {
    title: 'Il tuo nickname',
    copy: 'Copia il nickname',
    copied: 'Copiato!',
    copyFail: 'Impossibile copiare. Seleziona il nickname e copialo a mano.',
    again: 'Un altro',
    change: 'Cambia mood',
    shareTitle: 'Generatore di nickname',
    shareText: 'Il generatore di nickname mi ha dato «{nick}» ✨',
  },

  style: { camel: true, order: 'noun-adj', nameSep: '_' },

  words: {
    cute: {
      adj: ['soffice', 'peloso/pelosa', 'piccolino/piccolina', 'dolce', 'coccolone/coccolona', 'frizzante', 'scintillante', 'morbido/morbida', 'paffuto/paffuta', 'tenero/tenera', 'allegro/allegra', 'caldo/calda'],
      noun: ['coniglietto|m', 'gattino|m', 'cucciolo|m', 'panda|m', 'mochi|m', 'marshmallow|m', 'cupcake|m', 'anatroccolo|m', 'pesca|f', 'budino|m', 'koala|m', 'orsetto|m'],
    },
    cool: {
      adj: ['neon', 'turbo', 'silenzioso/silenziosa', 'rapido/rapida', 'gelido/gelida', 'atomico/atomica', 'selvaggio/selvaggia', 'notturno/notturna', 'cromato/cromata', 'reale', 'elettrico/elettrica', 'ardente'],
      noun: ['lupo|m', 'falco|m', 'vipera|f', 'pilota|m', 'lama|f', 'tempesta|f', 'tigre|f', 'cometa|f', 'titano|m', 'aquila|f', 'corsaro|m', 'ninja|m'],
    },
    funny: {
      adj: ['sonnolento/sonnolenta', 'brontolone/brontolona', 'traballante', 'goffo/goffa', 'furbetto/furbetta', 'cicciotto/cicciotta', 'fradicio/fradicia', 'svitato/svitata', 'matto/matta', 'pigro/pigra', 'scorbutico/scorbutica', 'affamato/affamata'],
      noun: ['patata|f', 'spaghetto|m', 'cetriolino|m', 'waffle|m', 'pinguino|m', 'lama|m', 'crostino|m', 'polpetta|f', 'tricheco|m', 'cornetto|m', 'goblin|m', 'criceto|m'],
    },
    dreamy: {
      adj: ['stellato/stellata', 'nuvoloso/nuvolosa', 'nebbioso/nebbiosa', 'vellutato/vellutata', 'lunare', 'pastello', 'fluttuante', 'luminoso/luminosa', 'setoso/setosa', 'sfumato/sfumata', 'dorato/dorata', 'sereno/serena'],
      noun: ['luna|f', 'nuvola|f', 'aurora|f', 'stella|f', 'ninnananna|f', 'orizzonte|m', 'petalo|m', 'galassia|f', 'sussurro|m', 'sogno|m', 'alba|f', 'prato|m'],
    },
    mystic: {
      adj: ['spettrale', 'criptico/criptica', 'velato/velata', 'fantasma', 'ossidiana', 'crepuscolare', 'infestato/infestata', 'nascosto/nascosta', 'dimenticato/dimenticata', 'sinistro/sinistra', 'cinereo/cinerea', 'arcano/arcana'],
      noun: ['corvo|m', 'spettro|m', 'oracolo|m', 'enigma|m', 'cifrario|m', 'ombra|f', 'sfinge|f', 'reliquia|f', 'runa|f', 'brace|f', 'mezzanotte|f', 'mistero|m'],
    },
  },

  og: {
    brand: '🏷️ Generatore di nickname',
    kicker: 'Scegli un mood · trova un nick',
    title: 'Trova il nickname che è solo tuo',
    desc: 'Carino, cool, divertente, sognante · mescola il tuo nome · copia con un tocco',
  },

  faq: [
    { q: 'Come funziona il generatore di nickname?', a: 'Scegli un mood, scrivi se vuoi il tuo nome o qualche lettera e tocca crea. Lo strumento unisce un nome e un aggettivo dalla lista di quel mood e mescola le tue lettere se ne hai inserite.' },
    { q: 'Il nickname è davvero casuale?', a: 'Sì. Le parole vengono estratte con il generatore casuale crittografico del tuo browser (crypto.getRandomValues), quindi ogni parola della lista ha la stessa probabilità. Lo scorrere delle lettere prima del risultato è solo scenografia.' },
    { q: 'Posso inserire il mio nome?', a: 'Sì, fino a 12 caratteri: nome, iniziali o lettere a scelta. Quello che scrivi viene usato solo nel tuo browser e non viene inviato né salvato.' },
    { q: 'Qualcun altro può ottenere lo stesso nickname?', a: 'È possibile, perché ogni mood ha centinaia di combinazioni. Se un gioco o un servizio dice che il nickname è già preso, creane un altro o attiva «Aggiungi numeri».' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Generatore di nickname',
    description: 'Informativa sulla privacy del Generatore di nickname: il nome che scrivi resta nel tuo browser, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Il Generatore di nickname (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. Il nome o le lettere che scrivi e il mood che scegli vengono elaborati solo nel tuo browser e non sono inviati al nostro server. Durante l’uso, però, alcune informazioni possono essere raccolte automaticamente, come descritto di seguito.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e l’archiviazione locale del browser per ricordare la tua lingua e l’ultimo mood, mostrare annunci e capire come viene usato il Servizio. Puoi rifiutarli o eliminarli dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare i cookie per pubblicare annunci in base alle tue visite precedenti a questo e ad altri siti web. Puoi saperne di più e modificare le preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati propri che conservano solo totali giornalieri per lingua (visualizzazioni, nickname creati, valutazioni a stelle). Nulla di tutto ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per qualsiasi domanda su questa informativa sulla privacy, contatta il gestore del sito.'],
      ['6. Data di entrata in vigore', 'Questa informativa è in vigore dal 5 ottobre 2026.'],
    ],
    back: '← Torna al Generatore di nickname',
  },
};
