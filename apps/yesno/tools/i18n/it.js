/* Sì o no — italiano. Stessa struttura di chiavi di en.js (vedi commenti). Si dà del tu.
 * oracle: 12 risposte (0-3 positive · 4-7 neutre · 8-11 negative), brevi perché stanno dentro la sfera. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Sì o no – ruota per decidere online',
    description: 'Non riesci a decidere? Scrivi la domanda e la ruota del sì o no risponde subito: sì/no, sì/no/forse, la sfera magica o al meglio di 3 e 5. Gratis, equa e senza registrazione.',
    ogTitle: 'Sì o no 🎱 Chiedi e la sfera risponde',
    ogDescription: 'Sì, no, forse o il responso della sfera magica. Un sorteggio equo per ogni piccolo dilemma.',
  },
  siteName: 'Sì o no',
  privacyLink: 'Privacy',

  hero: {
    h1Kicker: 'Sì o no',
    h1Html: 'Chiedi quello che vuoi.<br>La sfera dice <em>sì</em> o <em>no</em>',
    hook: 'Scrivi la domanda su cui continui a girare intorno, scegli una modalità e lascia decidere il caso.',
  },

  ui: {
    questionLabel: 'La tua domanda (facoltativa)',
    questionPh: 'es. Stasera pizza o restiamo a casa?',
    questionHint: 'Resta su questo dispositivo. Finisce in un link solo se condividi la risposta.',
    modeLabel: 'Come deve rispondere la sfera?',
    modes: {
      classic: 'Sì / No',
      maybe: 'Sì / No / Forse',
      oracle: 'Sfera magica',
      best3: 'Al meglio di 3',
      best5: 'Al meglio di 5',
    },
    modeHints: {
      classic: 'Un sì o un no secco, 50 e 50.',
      maybe: 'Sì, no o forse, un terzo ciascuno.',
      oracle: 'Uno dei 12 responsi della sfera: alcuni dicono sì, altri no, altri «aspetta».',
      best3: 'Si lancia finché una parte vince due volte.',
      best5: 'Si lancia finché una parte vince tre volte.',
    },
    ask: 'Chiedi alla sfera 🔮',
    asking: 'La sfera sta pensando…',
    fair: 'Caso crittografico equo · solo per gioco, decidi tu',
  },

  answers: { yes: 'SÌ', no: 'NO', maybe: 'FORSE' },
  tones: { positive: 'Più sì che no', neutral: 'Aspetta e vedi', negative: 'Più no che sì' },
  oracle: [
    'Buttati!',
    'Le stelle dicono sì',
    'Sì, senza rimpianti',
    'Il tuo istinto lo sa: sì',
    'Dormici sopra',
    'Richiedimelo domani',
    'Parlane, poi decidi',
    'La nebbia è ancora fitta',
    'Non questa volta',
    'Le stelle dicono no',
    'Lascia perdere',
    'Aspetta ancora un po’',
  ],

  result: {
    heading: 'La sfera dice',
    sharedBadge: '🔗 Risposta condivisa',
    sharedNote: 'Risposta del {date}. È la risposta originale salvata nel link: aprirlo non fa mai una nuova domanda.',
    noQuestion: 'Nessuna domanda scritta',
    bestOf: 'Al meglio di {n}',
    score: '{yes} {a} : {b} {no}',
    flipYes: 'S',
    flipNo: 'N',
    copyLink: 'Condividi la risposta 🔗',
    linkCopied: 'Link copiato con domanda e risposta',
    again: 'Chiedi di nuovo',
    askOwn: 'Chiedo anch’io',
    live: 'Risposta: {answer}',
    shareTitle: 'Sì o no',
    shareText: 'Ho chiesto alla sfera del sì o no e ha detto: {answer} 🎱',
  },

  tally: {
    title: 'Questa sessione',
    total: 'Risposte: {n}',
  },

  history: {
    title: 'Risposte recenti',
    note: 'Le tue ultime 10 risposte, salvate solo su questo dispositivo.',
    clear: 'Cancella',
  },

  errors: {
    badLink: 'Questo link della risposta è rotto o incompleto, quindi non viene mostrato nulla.',
  },

  og: {
    brand: '🎱 Sì o no',
    kicker: 'Sì · No · Forse · Sfera magica',
    title: 'Fai una domanda, ricevi un sì o un no',
    desc: 'Un sorteggio equo per ogni piccolo dilemma',
  },

  faq: [
    { q: 'Come funziona la ruota del sì o no?', a: 'Scrivi una domanda se vuoi, scegli una modalità e tocca «Chiedi alla sfera». La risposta viene estratta prima, poi la sfera trema o i lanci scorrono uno alla volta per mostrarla. Sì/No è 50 e 50, Sì/No/Forse dà un terzo a ciascuno, la sfera magica sceglie uno di 12 responsi, e al meglio di 3 o 5 continua finché una parte ha la maggioranza.' },
    { q: 'La risposta è davvero casuale?', a: 'Sì. Ogni risposta viene dal generatore casuale crittografico del tuo browser (crypto.getRandomValues) con campionamento per rifiuto, quindi nessuna risposta è nemmeno un po’ più probabile di un’altra. L’animazione mostra solo un risultato già estratto.' },
    { q: 'Devo davvero fare quello che dice?', a: 'Solo se ti va. È una risposta casuale per divertirsi, non un consiglio né una previsione, quindi non usarla per salute, soldi, questioni legali o sicurezza. Un trucco: nota se ti senti sollevato o deluso quando appare la risposta. Quella sensazione spesso è la tua vera risposta.' },
    { q: 'La mia domanda viene salvata o inviata?', a: 'La domanda resta nel tuo browser. Le ultime 10 risposte sono salvate su questo dispositivo per poterle rivedere, e puoi cancellarle quando vuoi. La domanda lascia il dispositivo solo se tocchi «Condividi la risposta», che la mette nel link che invii.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Sì o no',
    description: 'Informativa sulla privacy di Sì o no: le tue domande restano nel browser, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Sì o no (il "Servizio") rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. Le domande che scrivi e le risposte che ricevi sono elaborate solo nel tuo browser e non vengono inviate al nostro server. Le tue ultime 10 risposte, domanda compresa, sono conservate nella memoria locale del browser sul tuo dispositivo e puoi cancellarle in qualsiasi momento con il pulsante Cancella. Quando tocchi "Condividi la risposta", domanda e risposta vengono scritte nel link stesso e condivise solo con chi lo riceve.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e le risposte recenti, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Puoi saperne di più e modificare le preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e nostri contatori aggregati che conservano solo totali giornalieri per lingua (pagine viste, domande fatte, valutazioni). Le tue domande non fanno mai parte di questi conteggi e nulla di tutto ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dal 15 ottobre 2026.'],
    ],
    back: '← Torna a Sì o no',
  },
};
