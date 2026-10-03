/* Test dell’amore — italiano (it/)
 * Stessi id e stesso ordine di domande/risposte di lovestyle-core.js (i punteggi sono solo lì).
 * Niente spoiler: meta, schermata iniziale, FAQ e OG predefinita non nominano alcun tipo (animale) né citano domande.
 * types.<id>.word = parola/e dell’animale solo per il controllo spoiler. Mantieni {name} {emoji} {vibe} {pct} {n}.
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
    title: 'Test dell’amore: che tipo di partner sei?',
    description: 'Come sei quando ti innamori? Fai il test dell’amore: 10 momenti di coppia, 2-3 minuti, senza registrazione. Scopri il tuo stile in amore, la tua anima affine e qualche consiglio per te.',
    ogTitle: 'Test dell’amore 💘 Che tipo di partner sei?',
    ogDescription: 'Un quiz da 2 minuti. Rispondi a 10 piccoli momenti d’amore e scopri che tipo di partner sei davvero.',
  },
  siteName: 'Test dell’amore',
  privacyLink: 'Privacy',

  start: {
    badge: '💘 Quiz di personalità in amore',
    h1Kicker: 'Test dell’amore',
    h1Html: 'Che tipo di partner<br>sei <em>in amore</em>?',
    hook: 'Come scrivi, il primo appuntamento, i piccoli litigi… Dieci momenti di tutti i giorni rivelano il personaggio tenero nascosto nel tuo cuore.',
    metaTime: '⏱️ 2-3 minuti',
    metaCount: '💌 10 domande',
    start: 'Scopri il mio stile →',
  },

  quiz: {
    backAria: 'Domanda precedente',
    progressAria: 'Avanzamento',
    qLabel: 'D{n}',
  },

  loading: {
    text: 'Sto leggendo il tuo cuore…',
    sub: 'Abbino le tue risposte a uno stile d’amore',
  },

  result: {
    title: 'Test dell’amore: sono {name}',
    eyebrow: 'In amore sei',
    strengthsLabel: 'Il tuo fascino in amore',
    tipsLabel: 'Consigli d’amore per te',
    bestLabel: 'Anima affine',
    rivalLabel: 'Rivale',
    sameShare: '{pct}% di chi gioca ha questo stile',
    shareText: 'In amore sono {name} {emoji}: «{vibe}» E tu?',
    ctaStrong: 'Qualcuno ha condiviso il suo stile in amore',
    ctaSub: 'Che tipo di partner sei tu? 2 minuti.',
    retry: 'Rifai il test',
  },

  og: {
    eyebrow: 'Il mio stile in amore',
    brand: '💘 Test dell’amore',
    defaultKicker: 'Test dell’amore',
    defaultTitle: 'Che tipo di partner sei?',
    defaultDesc: '10 momenti d’amore · 2-3 minuti',
  },

  faq: [
    { q: 'Come viene scelto il mio risultato?', a: 'Ogni risposta dà punti a un paio di stili e vince quello con più punti. I pareggi si risolvono con una regola fissa, quindi le stesse risposte danno sempre lo stesso risultato.' },
    { q: 'È un test di personalità scientifico?', a: 'No, è solo per divertirsi. Le domande nascono dalle abitudini di coppia quotidiane e non sono una diagnosi psicologica: prendilo come uno specchio giocoso, non come un verdetto.' },
    { q: 'Cosa significano «anima affine» e «rivale»?', a: 'L’anima affine è lo stile che bilancia il tuo in modo naturale. Il rivale è quello con cui ti scontri più spesso… e magari anche quello con più scintille.' },
    { q: 'Le mie risposte vengono salvate?', a: 'No. Le risposte vengono calcolate nel tuo browser e non vengono mai salvate. Contiamo solo, in forma anonima, quale stile è uscito per mostrare quanto è comune ogni risultato.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Test dell’amore',
    description: 'Informativa sulla privacy del Test dell’amore: cookie, pubblicità e statistiche anonime.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Test dell’amore (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Puoi usare il Servizio senza registrarti né accedere. Le tue risposte vengono calcolate nel browser e non vengono mai inviate né salvate sui nostri server. Contiamo solo, in forma anonima, quale stile è uscito per mostrare la frequenza di ogni risultato.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare correttamente.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e impostazioni nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Conserviamo solo totali giornalieri anonimi (visualizzazioni, test completati, valutazioni) per migliorare il Servizio. Questi totali non ti identificano.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dal 4 ottobre 2026.'],
    ],
    back: '← Torna al test dell’amore',
  },

  questions: [
    { q: 'La tua cotta ti scrive per prima. Tu…', choices: [
      'Rispondi in tre secondi, con cinque emoji',
      'Aspetti un po’. Non vuoi sembrare troppo impaziente.',
      'Mandi una risposta stuzzicante che lascia curiosità',
      'Chiedi com’è andata la giornata e ricordi ogni dettaglio',
    ] },
    { q: 'Primo appuntamento! Cosa proponi?', choices: [
      'Un caffè carino con dolci belli e musica soft',
      'Un posto tranquillo dove parlare davvero',
      'Una sala giochi o un locale di giochi da tavolo. Si gioca!',
      'Qualcosa di nuovo: mercatino serale, escursione, gita fuori porta',
    ] },
    { q: 'Si avvicina il suo compleanno. Il tuo piano?', choices: [
      'Una festa a sorpresa con tutti i suoi amici',
      'Un regalo di gran classe che non si aspetterebbe mai',
      'Una lettera scritta a mano e un album dei nostri ricordi',
      'Un regalo strampalato che lo fa ridere per giorni',
    ] },
    { q: 'La tua dolce metà ha avuto una giornata orribile. Tu…', choices: [
      'Ti siedi accanto in silenzio. Non servono parole.',
      'Arrivi con il suo cibo preferito e sistemi quello che puoi',
      'Ascolti tutta la sera e ricordi ogni parola',
      'Improvvisi un giro in macchina per svuotare la testa',
    ] },
    { q: 'Quanto ti piace scriverti quando esci con qualcuno?', choices: [
      'Tutto il giorno! Dal buongiorno alla buonanotte',
      'Un paio di messaggi. Meglio una telefonata.',
      'Messaggi lunghi e dolci, pieni di cuori',
      'Ogni tanto. Preferisco raccontare dal vivo.',
    ] },
    { q: 'Un piccolo litigio. Tu…', choices: [
      'Hai bisogno di un po’ di tempo da solo prima di parlare',
      'Fai finta di niente, ma lanci frecciatine',
      'Chiedi scusa per primo, anche se non era colpa tua',
      'Fai una battuta per rompere il ghiaccio',
    ] },
    { q: 'Cosa ti fa battere forte il cuore?', choices: [
      'Quando il suo viso si illumina appena mi vede',
      'Quando ridiamo per la stessa sciocchezza',
      'Quando dice all’improvviso «andiamo da qualche parte?»',
      'Quando rispetta i miei spazi e mi sceglie comunque',
    ] },
    { q: 'Il tuo weekend ideale in coppia?', choices: [
      'Vestirsi bene, un ristorante di tendenza, belle foto',
      'Cucinare a casa e aggiustare cose insieme',
      'Un picnic tra fiori e tramonto',
      'Il nostro solito posto, la nostra solita ordinazione',
    ] },
    { q: 'Quando qualcuno inizia a piacerti, tu…', choices: [
      'Non riesci a nasconderlo. In due giorni lo sanno tutti.',
      'Fai il vago e lasci che sia l’altro a farsi avanti',
      'Ti piace in silenzio per tanto, tanto tempo',
      'Lo inviti subito a uscire. La vita è breve!',
    ] },
    { q: 'Cosa conta di più per te in una relazione?', choices: [
      'La fiducia e lo spazio per essere me stesso',
      'Sentirmi al sicuro e coccolato',
      'Il romanticismo e i piccoli anniversari',
      'Essere migliori amici e potersi dire tutto',
    ] },
  ],

  types: {
    puppy: {
      name: 'il Golden Retriever',
      word: 'golden,retriever,cagnolino,cane',
      vibe: 'Tutto cuore, sempre al massimo e felicissimo di vederti ogni volta.',
      desc: 'Quando ami qualcuno, lo sa il mondo intero. Scrivi per primo, arrivi in anticipo e non fai mai giochetti: i tuoi sentimenti ti si leggono in faccia. La tua energia fa sentire il partner la persona più importante del mondo. Ricordati solo di prenderti cura anche di te, così il tuo grande cuore non resta mai scarico.',
      strengths: ['Dedizione totale', 'Gioia contagiosa', 'Zero giochetti'],
      tips: ['Una risposta lenta non significa che ci sia un problema: lascia un po’ di spazio per farti desiderare.', 'Tieni un giorno a settimana solo per te; il tempo insieme brillerà ancora di più.', 'Chiedi quale gesto d’affetto preferisce e regalaglielo senza misura.'],
    },
    cat: {
      name: 'il Gatto tsundere',
      word: 'gatto,gatta',
      vibe: 'Freddo fuori, morbido dentro: le coccole sono solo per chi sceglie lui.',
      desc: 'Non ti innamori in fretta, e mai in modo rumoroso. Hai bisogno dei tuoi spazi e dei tuoi tempi, quindi all’inizio puoi sembrare un po’ distante. Ma quando qualcuno conquista la tua fiducia, gli mostri un lato dolce e giocoso che nessun altro vede. Il tuo amore è discreto, leale e verissimo.',
      strengths: ['Indipendenza serena', 'Leale quando si fida', 'Dolcezza segreta'],
      tips: ['Di’ ad alta voce un sincero «mi sei mancato»: detto da te, vale oro.', 'Spiega che ti servono momenti da solo, così non verrà scambiato per freddezza.', 'I piccoli gesti contano: ricordare il suo caffè preferito è il tuo linguaggio d’amore.'],
    },
    fox: {
      name: 'la Volpe seducente',
      word: 'volpe',
      vibe: 'Brillante, elegante e sempre un passo avanti nel gioco della seduzione.',
      desc: 'Sai come lasciare il segno. Messaggi arguti, l’outfit perfetto, la giusta dose di mistero: sei irresistibile. Ami il brivido del romanticismo e tieni viva la fiamma con le sorprese. Sotto tutto quel fascino cerchi qualcuno che stia al tuo passo e veda chi sei davvero.',
      strengths: ['Fascino magnetico', 'Gusto impeccabile', 'Tiene viva la fiamma'],
      tips: ['Alterna il tira e molla con un po’ di sincerità: segnali chiari creano fiducia in fretta.', 'Fatti vedere in un giorno pigro, senza trucco: la verità è attraente.', 'Le tue sorprese sono leggendarie; lasciati sorprendere anche tu.'],
    },
    bear: {
      name: 'l’Orsacchiotto coccolone',
      word: 'orso,orsacchiotto',
      vibe: 'Solido, caloroso e l’abbraccio più sicuro del mondo.',
      desc: 'Dimostri l’amore con i fatti, non con i grandi discorsi. Aggiusti, cucini e ci sei quando conta. Forse non sei il romantico più appariscente, ma il partner non deve mai chiedersi a che punto è con te. Stare con te è come tornare a casa.',
      strengths: ['Affidabile come una roccia', 'Amore nei fatti', 'Cuore grande e caldo'],
      tips: ['Ogni tanto metti i sentimenti in parole: «sono fiero di te» fa miracoli.', 'Organizza un appuntamento a sorpresa solo per divertirvi, niente di pratico.', 'Lascia che sia anche l’altro a prendersi cura di te.'],
    },
    bunny: {
      name: 'il Coniglietto romantico',
      word: 'coniglio,coniglietto',
      vibe: 'Un sognatore che ricorda ogni appuntamento, ogni canzone e ogni piccolo anniversario.',
      desc: 'Per te l’amore è un film, e ogni scena deve essere bella. Noti i piccoli dettagli, scrivi messaggi sentiti e custodisci ogni ricordo. Senti tutto in profondità: sei premurosissimo e a volte un po’ sensibile. La persona giusta saprà avere cura della tua tenerezza.',
      strengths: ['Romanticismo sincero', 'Ricorda tutto', 'Premuroso nel profondo'],
      tips: ['Quando qualcosa ti ferisce, dillo con dolcezza invece di aspettare che l’altro indovini.', 'Non tutti amano con grandi gesti: cerca anche quelli silenziosi.', 'Create un album di foto insieme: è il tuo superpotere.'],
    },
    penguin: {
      name: 'il Pinguino fedele',
      word: 'pinguino',
      vibe: 'Parte piano, ma quando ama è una sola persona, per sempre.',
      desc: 'Ti prendi il tuo tempo prima di aprire il cuore e non hai mai fretta. Ma quando scegli qualcuno, è per lungo tempo. Ascolti davvero, ricordi ciò che conta e resti fedele in ogni stagione. Il tuo amore è dolce, paziente, quello che tutti sognano.',
      strengths: ['Fedeltà assoluta', 'Sa ascoltare', 'Dolcezza costante'],
      tips: ['Non aspettare troppo per mostrare interesse: un piccolo primo passo può cambiare tutto.', 'Condividi anche le tue preoccupazioni, non solo le sue: l’amore va in due direzioni.', 'Provate un’idea nuova ogni mese per tenere frizzante la vostra routine.'],
    },
    hamster: {
      name: 'il Criceto compagnone',
      word: 'criceto',
      vibe: 'Il partner è anche il tuo migliore amico, e ogni uscita finisce in risate.',
      desc: 'Per te le storie più belle nascono dall’amicizia. Ami giocare, dividere gli snack e ridere fino al mal di pancia. Stare con te è facile e porti in amore un’energia leggera e allegra. I discorsi seri ti mettono un po’ in imbarazzo, ma sincerità e ironia rendono forte il vostro legame.',
      strengths: ['Divertimento infinito', 'Facile parlarci', 'Prima l’amicizia'],
      tips: ['Aggiungi un po’ di romanticismo ogni tanto: a volte le candele battono le battute.', 'Quando la cosa si fa seria, resta nella conversazione invece di sdrammatizzare.', 'Tenete vive le vostre battute private: sono la colla della coppia.'],
    },
    dolphin: {
      name: 'il Delfino libero',
      word: 'delfino',
      vibe: 'Avventuroso, spontaneo e sempre con la prossima idea per uscire.',
      desc: 'Ami la libertà, i posti nuovi e dire sì all’avventura. Uscire con te significa viaggi on the road, piani improvvisati e storie da raccontare. Porti energia e curiosità in ogni relazione e ti serve qualcuno che si goda il viaggio. La libertà conta, ma la persona giusta ti fa venire voglia di tornare a casa.',
      strengths: ['Spirito d’avventura', 'Pieno di idee', 'Coraggioso in amore'],
      tips: ['Bilancia i piani spontanei con qualche rituale fisso su cui l’altro possa contare.', 'Chiedi prima delle grandi avventure: non a tutti piacciono le sorprese.', 'Condividi i tuoi sogni: fare progetti insieme è già un’avventura.'],
    },
  },
};
