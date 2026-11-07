/* Left Brain Right Brain Test (it)
 * 8 result ids (architect, mapmaker, debater, hacker, weaver, designer, firework, dreamer); questions[i].choices[j] follow brain-core.js QUESTIONS[i].c[j]
 * (each question has a strong and a softer choice for each side of one axis: think logic/intuition, plan plan/flow, express words/images;
 *  side 0 = what people usually call "left-brain style", side 1 = "right-brain style").
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only numbers are the user's own left/right bar ({n}) and the real server share ({pct}).
 * Honesty: left/right-brain "dominance" is a popular myth; both hemispheres work together. Just for fun — not a psychological test or diagnosis.
 * Placeholders: {name} {emoji} {vibe} {pct} {n}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test emisfero destro o sinistro – Logica o intuito?",
    "description": "Test emisfero destro o sinistro gratis: 12 domande quotidiane, circa 2 minuti, senza registrazione. Scopri il tuo stile di pensiero, solo per gioco.",
    "ogTitle": "Test emisfero destro o sinistro 🧠 Logica o intuito?",
    "ogDescription": "Dodici domande veloci sulla vita di tutti i giorni. Scopri da che parte pende il tuo stile di pensiero e incontra il tuo personaggio. Un quiz per gioco, non una diagnosi."
  },
  "siteName": "Test emisfero destro o sinistro",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "🧠 Quiz sullo stile mentale",
    "h1Kicker": "Test emisfero destro o sinistro",
    "h1Html": "Logica o intuito?<br>Da che parte <em>pendi</em>?",
    "hook": "Fai liste o segui l’istinto? Spieghi con le parole o con uno schizzo al volo? Rispondi a dodici domande quotidiane e scopri come si bilanciano le tue abitudini di pensiero, insieme al personaggio cerebrale che ti somiglia.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "💭 12 domande",
    "start": "Inizia il test →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "Domanda {n}"
  },
  "loading": {
    "text": "Sto leggendo il tuo stile di pensiero…",
    "sub": "Le due metà ne stanno discutendo"
  },
  "result": {
    "title": "Il mio personaggio cerebrale: {name}",
    "metaDesc": "Risultato del test emisfero destro o sinistro: {name}. {vibe} Scopri i tuoi punti di forza, i consigli, il tuo migliore amico e il tuo rivale simpatico.",
    "eyebrow": "Il tuo personaggio è…",
    "lrTitle": "Il tuo equilibrio tra stile sinistro e destro",
    "lrLeft": "Stile sinistro",
    "lrRight": "Stile destro",
    "lrNote": "Calcolato dalle tue dodici risposte: logica, piani e parole contano come stile sinistro; intuito, flusso e immagini come stile destro.",
    "pctFmt": "{n}%",
    "leanLeft": "Le tue risposte pendono verso le abitudini dell’emisfero sinistro.",
    "leanRight": "Le tue risposte pendono verso le abitudini dell’emisfero destro.",
    "leanBalanced": "Le tue risposte sono ben bilanciate tra i due stili.",
    "traitsLabel": "I tuoi punti di forza",
    "tipsLabel": "Consigli per te",
    "perfectLabel": "Dove dai il meglio",
    "bestLabel": "Migliore amico",
    "rivalLabel": "Rivale simpatico",
    "disclaimer": "Solo per gioco! Essere «di emisfero sinistro» o «di emisfero destro» è un mito molto diffuso: la ricerca sul cervello mostra che i due emisferi lavorano insieme in quasi tutto. Questo quiz guarda solo alle tue preferenze di stile di pensiero. Non è un test psicologico né una diagnosi.",
    "sameShare": "Il {pct}% delle persone ha ottenuto questo risultato",
    "shareText": "Il mio personaggio cerebrale è {name} {emoji} «{vibe}» Sinistra o destra, tu da che parte pendi?",
    "ctaStrong": "Un amico ti ha mandato il suo personaggio cerebrale",
    "ctaSub": "Logica o intuito? Scoprilo in 2 minuti.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "Il mio personaggio cerebrale",
    "brand": "🧠 Test emisfero destro o sinistro",
    "defaultKicker": "Quiz sullo stile mentale",
    "defaultTitle": "Logica o intuito?",
    "defaultDesc": "12 domande · 2 minuti · il tuo equilibrio sinistra/destra"
  },
  "faq": [
    {
      "q": "Le persone sono davvero «di emisfero sinistro» o «destro»?",
      "a": "No, è un mito molto diffuso. Ogni emisfero ha alcune specialità, ma le immagini del cervello mostrano che le due metà collaborano in quasi ogni attività, e grandi studi non hanno trovato persone che usano complessivamente un lato più dell’altro. Qui «stile sinistro» e «stile destro» sono solo soprannomi simpatici per le abitudini di pensiero."
    },
    {
      "q": "Come viene scelto il mio risultato?",
      "a": "Ogni domanda guarda una di tre abitudini di pensiero: ragionare o fidarsi di una sensazione, pianificare o andare a braccio, spiegare con le parole o con le immagini. La combinazione delle tre sceglie il tuo personaggio, e le stesse risposte danno sempre lo stesso risultato."
    },
    {
      "q": "Da dove viene la percentuale sinistra/destra?",
      "a": "È calcolata solo dalle tue risposte. Le scelte per logica, piani e parole si sommano al lato dello stile sinistro, quelle per intuito, flusso e immagini al lato dello stile destro, e le risposte più decise contano un po’ di più."
    },
    {
      "q": "È un vero test psicologico?",
      "a": "No. È un quiz leggero per divertirsi, non una valutazione psicologica né una diagnosi. Quasi tutti usano ogni stile a seconda della situazione: goditi il risultato e confrontalo con gli amici."
    },
    {
      "q": "Le mie risposte vengono salvate?",
      "a": "No. Le risposte vengono calcolate nel tuo browser e non sono memorizzate. Contiamo solo, in forma anonima, quale risultato è uscito, per mostrare quanto è comune."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Test emisfero destro o sinistro",
    "description": "Informativa sulla privacy del Test emisfero destro o sinistro: come usiamo cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il Test emisfero destro o sinistro (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
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
        "La presente informativa è in vigore dall’8 novembre 2026."
      ]
    ],
    "back": "← Torna al Test emisfero destro o sinistro"
  },
  "questions": [
    {
      "q": "Ti serve un telefono nuovo. Come scegli?",
      "choices": [
        "Confronto specifiche e prezzi finché uno vince nettamente",
        "Leggo qualche recensione, poi prendo quello che mi ispira",
        "Lo provo in negozio: se sta bene in mano, è quello giusto",
        "Guardo le specifiche principali e scelgo il miglior rapporto qualità-prezzo"
      ]
    },
    {
      "q": "Sta arrivando un sabato libero. Com’è?",
      "choices": [
        "Nessun programma. Vedo dove mi porta la giornata",
        "Organizzato già da mercoledì, quasi ora per ora",
        "Una o due cose fissate, il resto aperto",
        "Un’idea di massima, ma pronto a cambiarla"
      ]
    },
    {
      "q": "Un amico ti chiede come arrivare a un bar che conosci. Tu…",
      "choices": [
        "Gli scrivi il nome della via e un paio di punti di riferimento",
        "Disegni una mappa al volo o mandi la posizione con la foto dell’ingresso",
        "Scrivi le indicazioni passo passo: a sinistra al forno, poi la seconda a destra…",
        "Mandi uno screenshot della mappa"
      ]
    },
    {
      "q": "Un’amica non sa scegliere tra due offerte di lavoro e ti chiede un parere. Tu…",
      "choices": [
        "Le chiedi quale le fa brillare gli occhi quando ne parla",
        "Fate insieme una lista di pro e contro: stipendio, tragitto, crescita",
        "Le fai qualche domanda pratica prima di dire la tua",
        "Le dici di fidarsi dell’istinto: in fondo lo sa già"
      ]
    },
    {
      "q": "Prepari la valigia per un weekend fuori. Tu…",
      "choices": [
        "La faccio la sera prima, seguendo una lista che ho in testa",
        "Butto le cose in borsa un attimo prima di uscire",
        "La faccio la mattina della partenza e compro quello che dimentico",
        "Uso una checklist scritta giorni prima"
      ]
    },
    {
      "q": "Come ricordi meglio le cose?",
      "choices": [
        "Le visualizzo: la pagina, il colore, dove si trovavano",
        "Faccio scarabocchi o schizzi a margine",
        "Me le ripeto qualche volta",
        "Le scrivo con parole mie"
      ]
    },
    {
      "q": "Arriva un gioco da tavolo nuovo con un regolamento bello spesso. Tu…",
      "choices": [
        "Dai un’occhiata alle regole, poi si gioca",
        "Leggi tutte le regole prima della prima mossa",
        "Salti le regole e impari giocando",
        "Guardi gli altri fare un giro, poi ti unisci"
      ]
    },
    {
      "q": "Com’è la tua lista delle cose da fare?",
      "choices": [
        "Ordinata, per priorità, spuntata ogni giorno",
        "Esiste da qualche parte. Ogni tanto la guardo",
        "Una lista breve con le cose che contano davvero",
        "Una lista? È tutto nella mia testa e vado a sensazione"
      ]
    },
    {
      "q": "Devi spiegare un’idea nuova al tuo team o alla classe. Tu…",
      "choices": [
        "Aggiungi qualche immagine semplice alle slide",
        "Ne parli con un paio di esempi",
        "Disegni uno schema alla lavagna e lo costruisci passo dopo passo",
        "Scrivi prima un riassunto chiaro e ben organizzato"
      ]
    },
    {
      "q": "Una persona appena conosciuta ti dà una strana sensazione, ma non sai perché. Tu…",
      "choices": [
        "Ti fidi della sensazione: di solito ci prende",
        "Aspetti di vedere cosa fa davvero",
        "Per ora tieni un po’ le distanze, non si sa mai",
        "La ignori finché non c’è un motivo concreto"
      ]
    },
    {
      "q": "Hai un giorno in una città mai vista. Prima mossa?",
      "choices": [
        "Scelgo un posto da vedere e poi giro da lì",
        "Mi perdo apposta e seguo le stradine",
        "Seguo il programma fatto prima del viaggio",
        "Guardo una lista dei posti più belli e ne scelgo alcuni"
      ]
    },
    {
      "q": "Cosa ti piace di più nel tempo libero?",
      "choices": [
        "Leggere, scrivere o giochi di parole",
        "Disegnare, fotografare o costruire cose",
        "Guardare film e video girati benissimo",
        "Podcast e lunghe chiacchierate"
      ]
    }
  ],
  "types": {
    "architect": {
      "name": "Mente Architetto",
      "word": "architetto,architetta",
      "vibe": "Piani chiari, ragioni solide e le parole giuste. Costruisci idee che stanno in piedi.",
      "keywords": ["Logico", "Organizzato", "Chiaro"],
      "desc": "Ti piace capire come funzionano le cose prima di buttarti. Pensi per passaggi, tieni un piano a portata di mano e spieghi le tue idee in modo così chiaro che gli altri riescono a seguirti. Le persone ti affidano le parti più delicate, perché noti i buchi e li sistemi prima che diventino problemi. Ti piace una bella discussione, purché sia corretta e basata sui fatti. A volte aspetti il piano perfetto un po’ troppo a lungo, ed è lì che un piccolo salto nel vuoto ti aiuta.",
      "traits": ["Trasformi i problemi confusi in passaggi chiari", "Spieghi in modo semplice le cose complicate", "Mantieni promesse e scadenze", "Noti errori che sfuggono agli altri"],
      "tips": ["Prendi ogni giorno una piccola decisione solo d’istinto", "Lascia un po’ di spazio vuoto nei tuoi piani per le sorprese"],
      "perfect": "Un progetto con un obiettivo chiaro, un piano solido e una squadra che conta sulla tua testa attenta."
    },
    "mapmaker": {
      "name": "Cartografo Visivo",
      "word": "cartografo,cartografa",
      "vibe": "Vedi il quadro intero e tracci il percorso. Logica con occhio per le immagini.",
      "keywords": ["Strategico", "Visivo", "Metodico"],
      "desc": "Ragioni con calma, ma lo fai per immagini. Grafici, piantine e mappe mentali ti aiutano a vedere come tutto si collega, e pianifichi il percorso prima di partire. Gli amici ti chiedono di organizzare viaggi, risistemare stanze o sbrogliare agende complicate, perché fai sembrare tutto semplice. Preferisci mostrare piuttosto che raccontare, e uno schizzo veloce per te dice più di un lungo paragrafo. Ricorda però che non ogni viaggio ha bisogno di una mappa: certi posti bellissimi si trovano sbagliando strada.",
      "traits": ["Vedi come si incastrano i pezzi", "Pianifichi percorsi, stanze e orari con facilità", "Spieghi con grafici e schizzi", "Resti calmo quando le cose si complicano"],
      "tips": ["Condividi i tuoi ragionamenti ad alta voce, non solo su carta", "Ogni tanto lascia che sia qualcun altro a organizzarti la giornata"],
      "perfect": "Pianificare un grande viaggio o un nuovo spazio, con un foglio bianco, una penna e il tempo per pensarci bene."
    },
    "debater": {
      "name": "Oratore Lampo",
      "word": "oratore,oratrice",
      "vibe": "Logica veloce, battuta pronta e amore per il momento. Pensi meglio ad alta voce.",
      "keywords": ["Spiritoso", "Acuto", "Flessibile"],
      "desc": "Ragioni in fretta e parli ancora più in fretta. Non ti serve un copione, perché i tuoi argomenti migliori arrivano nel bel mezzo della conversazione. Ami i fatti e la logica chiara, ma anche il brivido di pensare sul momento, e per questo sei bravissimo in discussioni, quiz e presentazioni dell’ultimo minuto. La gente apprezza il tuo umorismo e le tue opinioni sincere. Ricorda solo che non ogni chiacchierata è una gara: a volte un amico vuole che tu ascolti, non che tu vinca.",
      "traits": ["Pensi con lucidità sotto pressione", "Trovi le parole giuste all’istante", "Ti adatti in fretta quando i piani cambiano", "Rendi le discussioni vivaci e divertenti"],
      "tips": ["Fermati e fai un’altra domanda prima di rispondere", "Scrivi le idee migliori, così non volano via"],
      "perfect": "Una discussione accesa, una serata quiz o una riunione in cui la prontezza salva la giornata."
    },
    "hacker": {
      "name": "Hacker dei Rompicapi",
      "word": "hacker",
      "vibe": "Smonti, provi e alla fine ci arrivi. Logica in movimento, un trucco geniale alla volta.",
      "keywords": ["Curioso", "Inventivo", "Pratico"],
      "desc": "Adori un bel rompicapo e lo risolvi provando. Invece di leggere il manuale, smonti tutto, guardi come si incastra e trovi una scorciatoia geniale che nessuno aveva visto. La tua mente è logica, ma funziona meglio quando le mani sono occupate e il piano è flessibile. Gli amici ti chiamano quando qualcosa è rotto, confuso o bloccato. Le attività di routine possono annoiarti, quindi alternale a piccole sfide che tengano sveglia la tua curiosità.",
      "traits": ["Impari più in fretta provando da solo", "Trovi scorciatoie e soluzioni furbe", "Resti curioso di come funzionano le cose", "Non molli quando un problema si fa difficile"],
      "tips": ["Finisci un progetto prima di aprirne un altro", "Spiega le tue soluzioni furbe, così anche gli altri possono impararle"],
      "perfect": "Un aggeggio rotto, un livello di gioco difficilissimo o una escape room con il tempo che scorre."
    },
    "weaver": {
      "name": "Tessitore di Storie",
      "word": "tessitore,tessitrice",
      "vibe": "Segui i sentimenti e li trasformi in parole. Intuito con un piano tranquillo.",
      "keywords": ["Empatico", "Riflessivo", "Espressivo"],
      "desc": "Leggi le persone e i momenti con il cuore, e sai mettere quei sentimenti in parole. Spesso capisci di cosa ha bisogno un amico prima che lo dica, e trovi il messaggio perfetto per un biglietto, un discorso o una conversazione difficile. Ti piace un ritmo di vita dolce, con piani e piccoli rituali che ti fanno sentire a casa. Il tuo intuito è forte, quindi fidati, ma concediti anche di cambiare strada quando il cuore ti dice qualcosa di nuovo.",
      "traits": ["Senti come stanno gli altri", "Trovi parole toccanti per ogni momento", "Tieni le amicizie calde e costanti", "Trasformi le esperienze in grandi racconti"],
      "tips": ["Condividi i tuoi sentimenti tanto quanto ascolti quelli degli altri", "Tieni un quaderno per le idee che arrivano di notte"],
      "perfect": "Una lettera sentita, una chiacchierata profonda con un buon amico o un racconto che fa sentire qualcuno capito."
    },
    "designer": {
      "name": "Designer Zen",
      "word": "designer",
      "vibe": "Senso del bello e mano paziente. Fai in modo che le cose appaiano e si sentano giuste.",
      "keywords": ["Estetico", "Paziente", "Intuitivo"],
      "desc": "Hai un debole per colori, forme e atmosfere, e ti prendi il tempo per farli tornare. Forse non sai spiegare perché una cosa funziona, ma lo capisci appena la vedi, e il tuo istinto di solito ci azzecca. Ami i progetti tranquilli con un ritmo chiaro: sistemare una stanza, ritoccare foto, cucinare qualcosa che è bello quanto buono. Le persone si rilassano negli spazi che crei. Non aspettare la perfezione prima di mostrare quello che fai: è già bellissimo.",
      "traits": ["Hai un occhio naturale per la bellezza", "Crei spazi calmi e accoglienti", "Curi i dettagli con pazienza", "Noti atmosfere che agli altri sfuggono"],
      "tips": ["Mostra il tuo lavoro prima che ti sembri finito", "Ogni tanto metti i tuoi sentimenti in parole, non solo in immagini"],
      "perfect": "Un pomeriggio tranquillo a sistemare, dipingere o abbellire qualcosa finché non è proprio giusto."
    },
    "firework": {
      "name": "Vulcano di Idee",
      "word": "vulcano",
      "vibe": "Scintille di idee, raffiche di parole e grandi emozioni. Accendi ogni chat.",
      "keywords": ["Trascinante", "Spontaneo", "Caloroso"],
      "desc": "Le idee ti spuntano in testa tutto il giorno e non vedi l’ora di condividerle. Ti fidi dell’intuito, segui l’entusiasmo e parli dei tuoi progetti con così tanta energia che gli altri vogliono unirsi. Sei l’amico che propone la gita improvvisata, il nuovo locale o l’idea pazza che si rivela geniale. Senti tanto e lo fai vedere, e questo fa sentire le persone vicine a te. La tua energia è un dono, ma scegli qualche idea da portare a termine, così può brillare davvero.",
      "traits": ["Sforni idee senza sosta", "Contagi le persone con il tuo entusiasmo", "Fai amicizia con facilità", "Trasformi i giorni normali in avventure"],
      "tips": ["Scegli l’idea preferita della settimana e portala fino in fondo", "Lascia spazio anche agli amici più timidi per dire la loro"],
      "perfect": "Un brainstorming, un viaggio improvvisato o una festa in cui tutti diventano amici."
    },
    "dreamer": {
      "name": "Artista Sognatore",
      "word": "sognatore,sognatrice",
      "vibe": "Immaginazione libera e immagini vivide in testa. Vedi mondi che gli altri non vedono.",
      "keywords": ["Fantasioso", "Libero", "Originale"],
      "desc": "La tua mente è piena di colori, scene e «e se…». Segui l’intuito, cambi programma quando arriva l’ispirazione e pensi più per immagini che per frasi. I momenti normali diventano piccoli film nella tua testa, e spesso noti una bellezza davanti a cui gli altri passano senza guardare. Dai il meglio quando nessuno ti mette fretta e puoi seguire una scintilla ovunque ti porti. L’originalità è il tuo superpotere. Tieni solo qualche semplice abitudine, così le tue grandi idee hanno dove atterrare.",
      "traits": ["Immagini cose che a nessuno verrebbero in mente", "Vedi la bellezza nei dettagli di ogni giorno", "Resti aperto alle nuove esperienze", "Ti esprimi con stile"],
      "tips": ["Trasforma una fantasia in un piccolo progetto vero questo mese", "Imposta un promemoria gentile per le cose che contano per gli altri"],
      "perfect": "Una giornata libera con la musica accesa, un album da disegno in borsa e nessun programma."
    }
  }
};
