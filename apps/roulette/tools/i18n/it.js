/* Ruota della fortuna — Italiano (/it/)
 * Ricerca mirata: "ruota della fortuna" / "sorteggio online". title = "{ricerca} | {marchio}".
 * Stesse chiavi degli altri file di lingua. ui.presets deve mantenere le stesse chiavi e lo stesso numero
 * di elementi in tutte le lingue (verificato da check-roulette.js). 24 caratteri max per opzione.
 * Il FAQ compare solo nella schermata finale condivisa (sotto i pulsanti di condivisione) — mai all'inizio.
 */
module.exports = {
  siteName: 'Ruota della fortuna',
  meta: {
    title: 'Ruota della fortuna | Melgene Apps',
    description: 'Ruota della fortuna gratis online. Scrivi le opzioni e gira — senza installare nulla, pronta in un minuto. Probabilità ponderate e link da condividere.',
    ogTitle: 'Ruota della fortuna — scrivi le opzioni e gira',
    ogDescription: 'Pranzo, faccende, sfide. Una ruota online gratuita ed equa, direttamente nel tuo browser.',
  },
  // Font per l'insegna, il portale e il risultato (fontCss la carica, displayFont la nomina)
  fontCss: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
  displayFont: "'Dela Gothic One'",
  app: {
    name: 'Ruota della fortuna',
    description: 'Una ruota della fortuna gratuita online per scegliere il pranzo, le faccende, le sfide o un sorteggio. Aggiungi da 2 a 16 opzioni con pesi facoltativi e gira: il vincitore viene scelto in modo equo con casualità crittografica. Condividi un link alla stessa identica ruota.',
  },
  hero: {
    h1: 'Ruota della fortuna',
    tagline: 'Non riesci a decidere? Scrivilo e gira.',
  },
  wheel: {
    spin: 'Gira',
    spinAria: 'Gira la ruota',
    share: 'Condividi',
    fair: "Il vincitore viene scelto a caso nell'istante in cui premi gira. La ruota si limita a rallentare fino a fermarsi lì.",
  },
  history: {
    title: 'Cronologia dei giri',
    clear: 'Cancella cronologia',
  },
  editor: {
    title: 'Opzioni',
    presetsLabel: 'Avvio rapido',
    presets: { lunch: '🍕 Pranzo', dare: '🎤 Sfide', duty: '🙋 Nomi', yesno: '👍 Sì/No', numbers: '🔢 1–10' },
    add: 'Aggiungi opzione',
    shuffle: 'Mescola',
    weighted: 'Probabilità ponderate',
    weightedHint: 'Un numero più alto dà una fetta più larga ed esce più spesso.',
    themeLabel: 'Colori',
  },
  result: {
    kicker: 'La ruota ha scelto',
    again: 'Gira di nuovo',
    removeAgain: 'Rimuovi e gira di nuovo',
    close: 'Chiudi',
  },
  // Mostrato solo nella schermata finale condivisa (data-mg-end), come accordion — mai nella schermata iniziale.
  faq: [
    { q: 'Il risultato può essere truccato?', a: "No. Il vincitore viene estratto con casualità crittografica nell'istante in cui premi gira, e la ruota si limita a fermarsi lì. Il momento in cui premi e l'animazione non hanno alcuna influenza sul risultato." },
    { q: 'Come funzionano le probabilità ponderate?', a: 'La probabilità di ogni opzione è il suo peso (1–5) diviso per la somma di tutti i pesi. Con pesi 2, 1 e 1, la prima opzione vince il 50% delle volte e le altre il 25% ciascuna.' },
    { q: 'Quante opzioni posso aggiungere?', a: 'Da 2 a 16. Ogni opzione può avere fino a 24 caratteri; i nomi lunghi si riducono o vengono troncati con i puntini quando una fetta è stretta.' },
    { q: 'Posso mandare la mia ruota a qualcuno?', a: 'Sì. Condividi crea un link che codifica le tue opzioni, i pesi e il tema colore nell\'indirizzo — niente viene salvato su un server.' },
    { q: 'Devo installare un\'app o registrarmi?', a: 'No. Funziona direttamente nel browser del telefono, del tablet o del computer, senza download né registrazione.' },
  ],
  privacyLink: 'Informativa sulla privacy',

  ui: {
    itemN: 'Opzione {n}',
    wheelAria: 'Ruota con {n} fette: {list}',
    ariaItem: 'Nome opzione {n}',
    ariaHandle: 'Riordina opzione {n} (freccia su/giù)',
    ariaDelete: 'Elimina opzione {n}',
    ariaWeight: 'Opzione {n}, peso {w}, premi per cambiare',
    count: '{n}/{max}',
    maxReached: 'Puoi aggiungere fino a {max} opzioni',
    minReached: 'La ruota richiede almeno 2 opzioni',
    soundOn: 'Audio attivo',
    soundOff: 'Audio disattivato',
    announce: 'Risultato: {label}',
    historyItem: 'Giro {n}',
    restore: 'Ripristina {n} rimosse',
    loadedShare: 'Ruota condivisa caricata',
    badShare: 'Impossibile aprire questo link', // il toast sta su una riga (nowrap) — resta breve
    shareTitle: 'Fai girare la mia ruota',
    shareText: 'Ho creato una ruota — le dai un giro?',
    themes: { candy: 'Caramella', macaron: 'Macaron', circus: 'Circo', jewel: 'Gioiello' },
    presets: {
      lunch: ['Pizza', 'Pasta', 'Risotto', 'Lasagne', 'Panini', 'Insalata', 'Gnocchi', 'Focaccia'],
      dare: ['Canta un ritornello', '10 flessioni', 'Imita un accento', 'Offri il caffè', 'Racconta una barzelletta', 'Balla 15 secondi', 'Parla come un pirata', 'Fai una smorfia'],
      duty: ['Sofia', 'Leonardo', 'Giulia', 'Francesco', 'Aurora', 'Alessandro'],
      yesno: ['Sì', 'No'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  },

  og: {
    badge: '🎡 Gratis online',
    title: 'Ruota della fortuna',
    tag: 'Pranzo, nomi, sfide: scrivi e gira',
  },

  privacy: {
    title: 'Informativa sulla privacy | Ruota della fortuna',
    description: 'Informativa sulla privacy di Ruota della fortuna — come vengono conservate le tue opzioni, cookie, pubblicità e analisi.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Ruota della fortuna (il "Servizio") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', "Il Servizio funziona senza account né accesso. Le tue opzioni, i pesi, il tema colore e la cronologia dei giri non vengono mai inviati a un server — restano nel tuo browser (memoria locale e URL). Alcune informazioni possono essere raccolte automaticamente mentre usi il Servizio, come descritto di seguito."],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie per mostrare pubblicità e capire come viene usato il Servizio. Puoi rifiutare o eliminare i cookie nelle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra pubblicità tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti. Puoi saperne di più e modificare le tue preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci Google</a>.'],
      ['4. Analisi', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e nostri contatori aggregati che conservano solo totali giornalieri per lingua (visualizzazioni, giri, valutazioni). Nulla di tutto ciò ti identifica personalmente.'],
      ['5. Link condivisi', 'I link creati con "Condividi" contengono i nomi delle opzioni, i pesi e il tema colore che hai inserito, codificati nell\'URL. Evita di inserire informazioni che ti identificano personalmente.'],
      ['6. Contatti', "Per domande su questa informativa, contatta l'operatore del Servizio."],
      ['7. Data di entrata in vigore', "Questa informativa è in vigore dal 27 settembre 2026."],
    ],
    back: '← Torna a Ruota della fortuna',
  },
};
