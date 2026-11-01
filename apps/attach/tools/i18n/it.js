/* Test dello stile di attaccamento (it) — Italian, tu
 * 4 result ids (secure anxious avoidant fearful);
 * questions[i].choices[j] follow attach-core.js QUESTIONS[i].w[j] (the [anxiety, avoidance] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Kind, non-judgmental wording: every style is a way of coping that once made sense, and styles can change.
 * Just for fun and self-reflection — not a clinical or psychological diagnosis.
 * Placeholders: {name} {nick} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test dello stile di attaccamento: qual è il mio stile?",
    "description": "Test dello stile di attaccamento: 11 domande quotidiane su amici, famiglia e partner, circa 2 minuti, senza registrazione. Scopri come vivi i legami.",
    "ogTitle": "Test dello stile di attaccamento 🫂 Come vivi i legami?",
    "ogDescription": "Undici situazioni quotidiane con amici, famiglia e partner. Scopri il tuo stile di attaccamento, i tuoi punti di forza e consigli gentili per legami più vicini."
  },
  "siteName": "Test dello stile di attaccamento",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "🫂 Come vivi i legami?",
    "h1Kicker": "Test dello stile di attaccamento",
    "h1Html": "Come ami<br>e ti <em>leghi</em>?",
    "hook": "Una risposta che tarda, un programma saltato, un’amica che all’improvviso si apre con te. Il modo in cui reagisci a questi piccoli momenti dice molto su come costruisci i legami. Rispondi a undici domande quotidiane e scopri il tuo stile di attaccamento.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 domande",
    "start": "Scopri il mio stile →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "Domanda {n}"
  },
  "loading": {
    "text": "Leggo tra le righe…",
    "sub": "Sto capendo come ti leghi agli altri"
  },
  "result": {
    "title": "Il mio stile di attaccamento: {name}",
    "metaDesc": "Risultato del test dello stile di attaccamento: {name}, {nick}. {vibe} Scopri i tuoi punti di forza e tre consigli gentili per le tue relazioni.",
    "eyebrow": "Il tuo stile di attaccamento",
    "gaugeLabel": "Dove pendevano le tue risposte",
    "axes": [
      [
        "Tranquillo",
        "Spesso in ansia"
      ],
      [
        "Mi avvicino",
        "Mi serve spazio"
      ]
    ],
    "strengthsLabel": "I tuoi punti di forza",
    "tipsLabel": "Consigli per le tue relazioni",
    "matchLabel": "A tuo agio con",
    "disclaimer": "Solo per divertimento e per riflettere su di te. È un quiz leggero, non una valutazione psicologica né una diagnosi. Lo stile di attaccamento può cambiare nel tempo e da una relazione all’altra. Se i rapporti ti fanno spesso soffrire, parlarne con uno psicologo può aiutarti davvero.",
    "sameShare": "Il {pct}% delle persone ha questo stile",
    "shareText": "Il mio stile di attaccamento è {name} {emoji} «{vibe}» E il tuo?",
    "ctaStrong": "Un amico ha condiviso il suo stile di attaccamento",
    "ctaSub": "Come vivi i legami? Scoprilo in 2 minuti.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "Il mio stile di attaccamento",
    "brand": "🫂 Test dello stile di attaccamento",
    "defaultKicker": "Un quiz gentile sui legami",
    "defaultTitle": "Qual è il mio stile di attaccamento?",
    "defaultDesc": "11 domande · 2 minuti · come vivi i legami"
  },
  "faq": [
    {
      "q": "Come viene scelto il mio risultato?",
      "a": "Ogni risposta sposta due scale che i ricercatori usano per descrivere l’attaccamento negli adulti: quanto ti preoccupa la vicinanza e quanto ti senti a tuo agio nel contare sugli altri. Il risultato è il punto in cui le due si incontrano, e le stesse risposte danno sempre lo stesso risultato."
    },
    {
      "q": "È una diagnosi psicologica?",
      "a": "No. È un quiz leggero, per divertirti e riflettere su di te, non una valutazione professionale o scientifica. Lo stile di attaccamento non è un disturbo né un’etichetta fissa. Se le relazioni ti sembrano spesso dolorose o confuse, uno psicologo o un terapeuta può aiutarti ad approfondire."
    },
    {
      "q": "Il mio stile di attaccamento può cambiare?",
      "a": "Sì. Molte persone mostrano schemi diversi con persone diverse, e relazioni accoglienti, consapevolezza di sé e terapia possono aiutare a sentirsi più sereni e a proprio agio con il tempo. Rifai il test tra qualche mese e confronta."
    },
    {
      "q": "Le mie risposte vengono salvate?",
      "a": "No. Le risposte vengono calcolate nel tuo browser e non vengono memorizzate. Conteggiamo solo, in forma anonima, quale risultato è uscito, per poterti mostrare quanto è diffuso."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Test dello stile di attaccamento",
    "description": "Informativa sulla privacy del Test dello stile di attaccamento: come usiamo cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il Test dello stile di attaccamento (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
    "sections": [
      [
        "1. Informazioni che raccogliamo",
        "Puoi usare il Servizio senza registrarti né accedere. Le tue risposte vengono calcolate all’interno del tuo browser e non sono mai inviate né salvate sui nostri server. Conteggiamo solo, in forma anonima, quale risultato è uscito, per mostrare quanto è diffuso ciascun risultato."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la tua lingua, mostrare annunci e capire come viene utilizzato. Puoi rifiutarli o eliminarli dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare correttamente."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti web. Puoi saperne di più e modificare la personalizzazione degli annunci in <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Conserviamo totali giornalieri anonimi (visualizzazioni di pagina, test completati, valutazioni) per migliorare il Servizio. Questi totali non ti identificano personalmente."
      ],
      [
        "5. Contatti",
        "Per qualsiasi domanda su questa Informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "6. Data di entrata in vigore",
        "La presente informativa è in vigore dal 2 novembre 2026."
      ]
    ],
    "back": "← Torna al Test dello stile di attaccamento"
  },
  "questions": [
    {
      "q": "Un amico stretto non risponde al tuo messaggio da tutto il giorno. Cosa ti passa per la testa?",
      "choices": [
        "Sarà impegnato. Mi risponderà più tardi.",
        "Rileggo il mio messaggio chiedendomi se ho detto qualcosa di sbagliato.",
        "Sinceramente me ne accorgo appena. Non sono il tipo da messaggi continui.",
        "Mi preoccupo un po’, poi mi dico che non dovrei dargli così tanto peso."
      ]
    },
    {
      "q": "Una persona con cui stai entrando in confidenza ti dice: «Sto davvero bene con te». Tu…",
      "choices": [
        "Sei al settimo cielo, poi ti chiedi se la penserà ancora così il mese prossimo",
        "Senti un tepore dentro e le dici che è reciproco",
        "Sei contento, ma stranamente ti viene voglia di fare un passettino indietro",
        "Ti senti un po’ in imbarazzo e cambi discorso con una battuta"
      ]
    },
    {
      "q": "Stai passando una settimana davvero pesante. Di solito cosa fai?",
      "choices": [
        "Me la cavo da solo. Non mi piace appoggiarmi agli altri.",
        "Vorrei cercare qualcuno, ma sto zitto per non essere un peso",
        "Racconto a una persona vicina cosa succede e mi lascio aiutare",
        "Scrivo a più persone, sperando che qualcuno si faccia vivo"
      ]
    },
    {
      "q": "Un amico disdice il vostro appuntamento all’ultimo minuto.",
      "choices": [
        "Dico che non fa niente, ma in silenzio decido di contare meno su di lui",
        "Sotto sotto un po’ sollevato. Più tempo per me!",
        "Mi chiedo se in fondo non abbia voglia di vedermi",
        "Nessun problema. Scegliamo un altro giorno."
      ]
    },
    {
      "q": "Un nuovo amico inizia a raccontarti cose personali. E tu?",
      "choices": [
        "Mi apro anch’io, un passo alla volta, come viene naturale",
        "Vorrei aprirmi, ma a metà mi blocco e faccio marcia indietro",
        "Racconto tanto e in fretta. Voglio che diventiamo intimi subito.",
        "Resto sul leggero. Le cose personali restano private."
      ]
    },
    {
      "q": "Tu e una persona vicina non siete d’accordo su qualcosa di importante.",
      "choices": [
        "Voglio chiarire subito. Aspettare è insopportabile.",
        "Mi serve spazio e mi chiudo nel silenzio finché non passa",
        "Ne parliamo con calma, anche se è un po’ scomodo",
        "Oscillo tra la voglia di parlarne e quella di sparire"
      ]
    },
    {
      "q": "Una persona vicina è via per una settimana. Quanti contatti ti sembrano giusti?",
      "choices": [
        "Ci aggiorniamo quando torna. Mi godo lo spazio.",
        "Qualche messaggio fa piacere, ma va bene anche nessuno",
        "Difficile dirlo. Mi manca, ma troppi messaggi mi mettono tensione.",
        "Un piccolo aggiornamento ogni giorno. Mi piace sentirci collegati."
      ]
    },
    {
      "q": "Qualcuno fa per te un gesto gentile che non ti aspettavi.",
      "choices": [
        "Mi commuove, ma una parte di me si chiede cosa voglia in cambio",
        "Lo adoro e sento di dover fare ancora di più per quella persona",
        "Mi sento un po’ a disagio, come se ora fossi in debito",
        "Ringrazio e me lo godo, semplicemente"
      ]
    },
    {
      "q": "Se pensi alle persone a te più vicine, quale frase ti somiglia di più?",
      "choices": [
        "Mi fido che ci saranno per me, e anche loro possono contare su di me",
        "Voglio loro bene, ma sto meglio quando conto solo su me stesso",
        "A volte temo di tenerci più io a loro che loro a me",
        "Voglio essere vicino, ma una parte di me si aspetta di soffrire"
      ]
    },
    {
      "q": "Una persona nuova entra nella tua compagnia e sembra piacere a tutti.",
      "choices": [
        "Per me è uguale. Ho la mia piccola cerchia.",
        "Ho un po’ paura di essere messo da parte",
        "Resto un po’ sulle mie finché non so se posso fidarmi",
        "Bello, un amico in più con cui uscire"
      ]
    },
    {
      "q": "Qualcuno ti chiede con delicatezza: «Va tutto bene ultimamente?»",
      "choices": [
        "Rispondo «tutto ok», poi mi pento di non aver detto di più",
        "Dico sinceramente come sto",
        "Dico che va tutto bene e cambio discorso. Me la sbrigo da solo.",
        "Sono così sollevato che qualcuno se ne sia accorto che mi esce tutto d’un fiato"
      ]
    }
  ],
  "types": {
    "secure": {
      "name": "Sicuro",
      "nick": "Il Porto Tranquillo",
      "word": "attaccamento sicuro",
      "vibe": "Sai stare vicino senza perderti, e lontano senza perdere la fiducia.",
      "desc": "Tendi a fidarti che le persone a cui vuoi bene ci saranno, e ti senti a tuo agio a esserci per loro. La vicinanza non ti spaventa, e nemmeno un po’ di distanza. Quando qualcosa va storto, di solito riesci a dire ciò che provi senza esplodere né chiuderti. Gli altri si sentono spesso più calmi accanto a te, come se offrissi loro un posto dove atterrare. Non significa che non ti preoccupi mai: significa che di solito ritrovi l’equilibrio.",
      "keywords": [
        "Fiducioso",
        "Aperto",
        "Equilibrato"
      ],
      "strengths": [
        "Dire ciò di cui hai bisogno in modo semplice e gentile",
        "Lasciare spazio agli altri senza sentirti rifiutato",
        "Ricucire dopo una lite invece di tenere il conto"
      ],
      "tips": [
        "Ricordati di chiedere anche a te stesso come stai. Essere quello stabile non vuol dire portare tutto da solo.",
        "Quando una persona vicina sembra in ansia o distante, ricorda che può essere un suo vecchio schema, non un giudizio su di te.",
        "Condividi ciò che ti aiuta a restare calmo. Un semplice «ecco cosa mi aiuta» può essere un regalo per un amico in difficoltà."
      ],
      "match": "Due cuori stabili costruiscono rapporti facili e sinceri. La tua calma aiuta anche ogni altro stile a sentirsi più protetto nel tempo."
    },
    "anxious": {
      "name": "Ansioso",
      "nick": "Il Cuore Devoto",
      "word": "attaccamento ansioso, attaccamento preoccupato",
      "vibe": "Ami con tutto il cuore e senti ogni minimo cambiamento nell’aria.",
      "desc": "Tieni moltissimo alle persone e noti tutto: una risposta più breve, un tono diverso, un programma che vacilla. Sentirti vicino agli altri conta tanto per te, quindi quando un legame sembra incerto la tua mente corre a riempire i vuoti. Questa sensibilità ti rende caloroso, attento e leale. La preoccupazione non è un difetto: è il segno di quanto tieni alle persone della tua vita. Con un po’ di rassicurazione e di pratica, quel grande cuore può sentirsi vicino e tranquillo allo stesso tempo.",
      "keywords": [
        "Premuroso",
        "Attento",
        "Leale"
      ],
      "strengths": [
        "Capire come si sentono gli altri prima che lo dicano",
        "Dimostrare affetto e gratitudine con generosità",
        "Impegnarti davvero per tenere vivi i rapporti"
      ],
      "tips": [
        "Quando la preoccupazione sale, fermati un attimo prima di mandare quel messaggio in più. Chiediti cosa sai, non cosa temi.",
        "Di’ agli altri cosa ti rassicura, come un veloce «ci sentiamo dopo». Un bisogno chiaro è più facile da soddisfare di un indovinello.",
        "Costruisci una vita che ti riempia anche da sola: passioni, amici, momenti di calma. La serenità cresce da tante ancore, non da una sola."
      ],
      "match": "Un partner o un amico stabile e costante aiuta le tue preoccupazioni a calmarsi, e il tuo calore lo aiuta ad aprirsi."
    },
    "avoidant": {
      "name": "Evitante",
      "nick": "Lo Spirito Libero",
      "word": "attaccamento evitante, attaccamento distanziante",
      "vibe": "Tieni alla tua indipendenza e mostri il tuo affetto in modo discreto e concreto.",
      "desc": "Sei autonomo e te la cavi bene da solo. Ti piace stare con gli altri, ma hai anche bisogno di molto spazio, e troppa intensità emotiva può farti venire voglia di fare un passo indietro. Non è freddezza: spesso è un’abitudine imparata tanto tempo fa, quella di fidarti prima di tutto di te stesso. La tua calma sotto pressione e il rispetto per la libertà degli altri sono punti di forza veri. Lasciare avvicinare le persone poco alla volta può rendere i tuoi rapporti più leggeri, non più pesanti.",
      "keywords": [
        "Indipendente",
        "Calmo",
        "Capace"
      ],
      "strengths": [
        "Restare lucido quando le cose si fanno stressanti",
        "Rispettare lo spazio e le scelte degli altri",
        "Risolvere i problemi in modo pratico e affidabile"
      ],
      "tips": [
        "Quando ti serve spazio, dillo e di’ quando tornerai. «Mi serve una serata per me, ne parliamo domani» mantiene la fiducia.",
        "Prova a condividere una piccola emozione a settimana con qualcuno di cui ti fidi. La vicinanza può crescere a piccoli passi.",
        "Nota l’impulso di allontanarti proprio quando le cose vanno bene. Restare un momento in più è spesso il punto in cui il legame si approfondisce."
      ],
      "match": "Una persona serena e paziente rispetta il tuo spazio senza prenderla sul personale, e così ti viene più facile lasciarla avvicinare."
    },
    "fearful": {
      "name": "Disorganizzato",
      "nick": "Il Riccio Tenero",
      "word": "attaccamento disorganizzato, attaccamento timoroso",
      "vibe": "Desideri la vicinanza, e sai anche quanto può far male.",
      "desc": "Una parte di te vuole un legame profondo, un’altra resta in guardia, pronta a proteggerti. Così ti avvicini e poi ti allontani, a volte senza sapere bene perché. Come un riccio al freddo, vuoi calore ma temi gli aculei. Questo mix nasce spesso da esperienze in cui la vicinanza non era sempre un luogo protetto. Non sei troppo né troppo complicato: sei perspicace, sensibile e profondamente empatico, e con fiducia e tempo puoi sentirti vicino e al riparo insieme.",
      "keywords": [
        "Sensibile",
        "Empatico",
        "Perspicace"
      ],
      "strengths": [
        "Capire il dolore degli altri perché l’hai provato",
        "Leggere persone e situazioni con vera profondità",
        "Custodire la fiducia come un tesoro, una volta costruita"
      ],
      "tips": [
        "Dai un nome al tira e molla quando lo senti. Dire «una parte di me vuole avvicinarsi e un’altra ha paura» è coraggioso e aiuta.",
        "Scegli relazioni che ti sembrano calme e costanti, e dai loro il tempo di dimostrare quanto valgono.",
        "Sii gentile con te stesso. Se vecchie ferite continuano a pesare sul presente, uno psicologo può essere un vero alleato."
      ],
      "match": "Una persona stabile e costante, che resta gentile quando vacilli, può mostrarti piano piano che la vicinanza può essere un posto protetto."
    }
  }
};
