/* Test attitudinale lavoro (it)
 * 8 result ids (showrunner storyteller captain caretaker creator inventor builder analyst);
 * questions[i].choices[j] follow job-core.js QUESTIONS[i].w[j] (the [people/things, imagine/structure, out front/deep focus] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result, a suggested job or quote a question.
 * types.<id>.word = the result keyword as people would search it — only used by the spoiler check.
 * types.<id>.jobs = 4 real jobs that are common in this country (local names, no digits).
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Light and positive only. Just for fun — not a professional career assessment.
 * Placeholders: {name} {emoji} {vibe} {pct}.
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
    "title": "Test attitudinale lavoro: che lavoro fa per me?",
    "description": "Fai il test attitudinale lavoro: 11 domande veloci, circa 2 minuti e nessuna registrazione. Scopri il tuo stile di lavoro, i tuoi punti di forza e i mestieri che potrebbero fare per te. Solo per gioco.",
    "ogTitle": "Test attitudinale lavoro 💼 Che lavoro fa per me?",
    "ogDescription": "Undici domande leggere su come ti piace lavorare. Scopri il tuo stile di lavoro, i tuoi punti di forza e qualche mestiere da esplorare."
  },
  "siteName": "Test attitudinale lavoro",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "💼 Che lavoro fa per me?",
    "h1Kicker": "Test attitudinale lavoro",
    "h1Html": "Dove potresti<br><em>brillare</em> a lavoro?",
    "hook": "C’è chi si accende in una stanza piena di gente e chi in un angolo tranquillo davanti a un rompicapo. Rispondi a undici domande di vita quotidiana e scopri il tuo stile di lavoro, i tuoi punti di forza nascosti e qualche mestiere che potrebbe starti sorprendentemente bene.",
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
    "text": "Metto in ordine le tue risposte…",
    "sub": "Cerco il tuo stile nel mondo del lavoro"
  },
  "result": {
    "title": "Il mio stile di lavoro: {name}",
    "metaDesc": "Risultato del test attitudinale lavoro: {name}. {vibe} Scopri i tuoi punti di forza, i mestieri che potrebbero fare per te e un consiglio per il tuo modo di lavorare.",
    "eyebrow": "La tua personalità lavorativa",
    "gaugeLabel": "Dove si sono orientate le tue risposte",
    "axes": [
      ["Persone", "Cose e idee"],
      ["Fantasia", "Metodo"],
      ["In prima linea", "Concentrazione"]
    ],
    "jobsLabel": "Mestieri da esplorare",
    "strengthsLabel": "I tuoi punti di forza",
    "envLabel": "Dove dai il meglio",
    "watchLabel": "Attenzione a",
    "tipLabel": "Consiglio per lavorare",
    "buddyLabel": "Collega ideale",
    "rivalLabel": "Stile opposto",
    "disclaimer": "Solo per gioco. È un test leggero, non una valutazione professionale di orientamento. I mestieri sono spunti da esplorare, non consigli, e puoi trovarti bene in tante altre strade.",
    "sameShare": "Al {pct}% delle persone è uscito questo stile di lavoro",
    "shareText": "Il mio stile di lavoro è {name} {emoji} «{vibe}» E il tuo?",
    "ctaStrong": "Un amico ha condiviso il suo stile di lavoro",
    "ctaSub": "Che lavoro fa per te? Scoprilo in 2 minuti.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "La mia personalità lavorativa",
    "brand": "💼 Test attitudinale lavoro",
    "defaultKicker": "Un test leggero sul lavoro",
    "defaultTitle": "Che lavoro fa per me?",
    "defaultDesc": "11 domande · 2 minuti · il tuo stile di lavoro"
  },
  "faq": [
    {
      "q": "Come viene scelto il mio risultato?",
      "a": "Ogni risposta sposta tre scale: lavorare con le persone o con le cose e le idee, immaginare novità o costruire sistemi chiari, mettersi in prima linea o concentrarsi a fondo. Il tuo risultato è il punto in cui le tre si incontrano, e le stesse risposte danno sempre lo stesso risultato."
    },
    {
      "q": "È un vero test di orientamento professionale?",
      "a": "No. È un quiz leggero pensato per divertirsi e riflettere, non un test professionale né scientifico. Per le scelte importanti su studio o lavoro parla con un orientatore della scuola o dell’università, con i tuoi insegnanti o con chi fa i mestieri che ti incuriosiscono."
    },
    {
      "q": "Perché alcuni mestieri suggeriti non mi convincono?",
      "a": "Quattro mestieri non possono descrivere una persona intera. Sono esempi di lavori che spesso valorizzano il tuo stile, quindi prendili come punti di partenza. Molte persone con il tuo stesso risultato stanno benissimo in settori del tutto diversi."
    },
    {
      "q": "Le mie risposte vengono salvate?",
      "a": "No. Le risposte vengono calcolate nel tuo browser e non vengono memorizzate. Conteggiamo solo, in forma anonima, quale risultato è uscito, per poterti mostrare quanto è diffuso."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Test attitudinale lavoro",
    "description": "Informativa sulla privacy del Test attitudinale lavoro: come usiamo cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il Test attitudinale lavoro (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
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
        "La presente informativa è in vigore dal 31 ottobre 2026."
      ]
    ],
    "back": "← Torna al Test attitudinale lavoro"
  },
  "questions": [
    {
      "q": "Parte un lavoro di gruppo. Che ruolo finisci per prenderti senza nemmeno provarci?",
      "choices": [
        "Quello che in silenzio trova una soluzione geniale a cui nessun altro aveva pensato",
        "Quello che lancia idee e le presenta alla classe o al team",
        "Quello che prende gli attrezzi e costruisce davvero la cosa, un passo alla volta",
        "Quello che tiene il calendario e controlla che nessuno resti indietro"
      ]
    },
    {
      "q": "Ti ritrovi all’improvviso con una giornata libera. Cosa ti va di più?",
      "choices": [
        "Un caffè con un’amica e una lunga chiacchierata su un film che avete amato",
        "Mettere finalmente in ordine le cartelle delle foto o i conti, tutto pulito e al suo posto",
        "Radunare gente per una partita o una serata di giochi da tavolo organizzata da te",
        "Un laboratorio di una giornata dove fai qualcosa con le tue mani"
      ]
    },
    {
      "q": "Hai appena comprato un nuovo gadget. Cosa fai per prima cosa?",
      "choices": [
        "Lo configuri subito, seguendo le istruzioni passo passo",
        "Scrivi una semplice guida perché possa usarlo anche la tua famiglia",
        "Filmi l’unboxing o lo mostri ai tuoi amici",
        "Ti butti nelle impostazioni a cercare funzioni nascoste e trucchi intelligenti"
      ]
    },
    {
      "q": "Quale complimento ti fa svoltare la giornata?",
      "choices": [
        "«Neanche un errore. Sei davvero preciso».",
        "«Il team gira così bene grazie a te».",
        "«Aspetta, l’hai fatto tu? Fantastico».",
        "«Quello che hai detto mi è rimasto dentro»."
      ]
    },
    {
      "q": "Scegli il tuo posto di lavoro ideale.",
      "choices": [
        "Un ufficio con un bel clima dove tutta la squadra rema insieme",
        "All’aperto, sul campo, in movimento e con attrezzature vere da maneggiare",
        "Un posto vivace dove ogni giorno succede qualcosa di nuovo",
        "Uno studio tranquillo con una lavagna piena di idee a metà"
      ]
    },
    {
      "q": "Qualcosa va storto. Qual è la tua prima mossa?",
      "choices": [
        "Radunare tutti, dividere i compiti e prendere il comando",
        "Ascoltare ciascuno dei coinvolti e cercare un punto di vista nuovo",
        "Controllare con calma numeri e registri per trovare la causa",
        "Mettersi a trafficare e provare subito un modo nuovo per sistemare"
      ]
    },
    {
      "q": "Cosa continua a comparirti nei video consigliati?",
      "choices": [
        "Vlog, video comici e le ultime tendenze",
        "Riparazioni, fai da te e recensioni di attrezzatura da campeggio",
        "Scienza, spazio e misteri irrisolti spiegati bene",
        "Storie vere di persone che aiutano gli altri, come insegnanti e infermieri"
      ]
    },
    {
      "q": "In viaggio sei di solito quello che…",
      "choices": [
        "Gira senza piano e riempie la galleria di foto o un quaderno di schizzi",
        "Prepara il foglio di calcolo perfetto con budget e orari",
        "Finisce a chiacchierare con la gente del posto in un baretto",
        "Guida tutto il gruppo da un posto all’altro"
      ]
    },
    {
      "q": "È la vigilia della scadenza. Tu…",
      "choices": [
        "Scrivi una lista chiara delle cose da fare e le spunti una a una",
        "Rifinisci la presentazione finale e tieni alto il morale di tutti",
        "Senti i colleghi uno per uno per vedere se qualcuno è bloccato",
        "Ti immergi nel lavoro e ti viene in mente un’idea ancora migliore"
      ]
    },
    {
      "q": "In un club o in un gruppo, quale incarico ti piacerebbe di più?",
      "choices": [
        "Accogliere i nuovi arrivati e ascoltare chi ha bisogno di parlare",
        "Fare il presidente e far andare avanti tutto",
        "Disegnare locandine, logo e gadget",
        "Tenere in ordine i registri e la cassa comune"
      ]
    },
    {
      "q": "Tra dieci anni, cosa ameresti sentirti dire?",
      "choices": [
        "«Mi sono sempre sentito al sicuro sapendo che c’eri tu».",
        "«Ci hai pensato per primo tu, vero?».",
        "«Hai fatto sorridere tantissime persone».",
        "«Se passa dalle tue mani, funziona»."
      ]
    }
  ],
  "types": {
    "showrunner": {
      "name": "Il Mattatore",
      "word": "mattatore",
      "vibe": "Dammi un palco e un’idea, e ti accendo tutta la sala.",
      "desc": "Ti senti vivo dove si incontrano persone, idee e azione. Ti piace lanciare qualcosa di nuovo, coinvolgere gli altri e vederlo prendere forma davanti a un pubblico. L’energia è il tuo superpotere: una riunione noiosa diventa un brainstorming appena entri. Un lavoro che ti permetta di lanciare, presentare e creare connessioni probabilmente ti sembrerà meno un lavoro e più un gioco.",
      "keywords": ["Energico", "Convincente", "Pieno di idee"],
      "strengths": ["Trasformare un’idea grezza in qualcosa a cui gli altri vogliono unirsi", "Capire l’aria che tira in una stanza e risollevarla", "Parlare in pubblico e presentare con sicurezza"],
      "jobs": ["Responsabile marketing", "Produttore televisivo", "Organizzatore di eventi", "Imprenditore"],
      "env": "Team dinamici, lanci e eventi dal vivo dove ogni settimana porta qualcosa di nuovo e puoi vedere come reagiscono le persone al tuo lavoro.",
      "watch": "Iniziare più progetti di quanti ne riesci a finire. Le idee nuove e luccicanti possono rubare tempo a quelle già a metà strada.",
      "tip": "Fai squadra con qualcuno che adora i dettagli e concorda un unico traguardo prima di partire con la prossima grande impresa."
    },
    "storyteller": {
      "name": "Il Narratore",
      "word": "narratore",
      "vibe": "Trasformi le idee in parole e storie che restano in mente.",
      "desc": "Ti attirano le persone e il significato delle cose. Ti piace capire come si sentono gli altri e dare forma a quello che hai colto in parole, lezioni o storie che aiutano a vedere qualcosa di nuovo. Magari non hai bisogno dei riflettori, ma la tua influenza silenziosa arriva lontano. Un lavoro in cui puoi ascoltare, scrivere, insegnare o spiegare probabilmente ti calzerà in modo naturale.",
      "keywords": ["Empatico", "Espressivo", "Riflessivo"],
      "strengths": ["Spiegare cose complicate in modo semplice e umano", "Ascoltare con attenzione e cogliere cosa intendono davvero le persone", "Trovare la storia che sta dietro a fatti e numeri"],
      "jobs": ["Giornalista", "Insegnante", "Psicologo", "Copywriter"],
      "env": "Spazi tranquilli con tempo per pensare, conversazioni a tu per tu e progetti in cui le tue parole raggiungono e aiutano persone reali.",
      "watch": "Portarti a casa le preoccupazioni degli altri. Tenerci tanto è un dono, ma anche tu hai bisogno di ricaricarti.",
      "tip": "Tieni un piccolo taccuino di idee e frasi. Il tuo lavoro migliore spesso parte da una riga che stavi per dimenticare."
    },
    "captain": {
      "name": "Il Capitano",
      "word": "capitano",
      "vibe": "Quando il lavoro si fa frenetico, tutti guardano a te per tenere il timone.",
      "desc": "Dai il meglio quando c’è una squadra da guidare e un obiettivo da raggiungere. Ti piacciono i piani chiari, decidi senza tanti giri e tieni tutti orientati nella stessa direzione. Le persone si fidano di te nei momenti difficili perché resti calmo e organizzato. Un lavoro che ti metta a capo di persone, turni o servizio ai clienti probabilmente farà emergere la tua leadership naturale.",
      "keywords": ["Deciso", "Organizzato", "Affidabile"],
      "strengths": ["Dividere un grande lavoro in compiti chiari per ciascuno", "Restare calmo e pratico sotto pressione", "Mantenere promesse e scadenze"],
      "jobs": ["Project manager", "Direttore commerciale", "Direttore d’albergo", "Assistente di volo"],
      "env": "Squadre attive con obiettivi chiari, dove puoi coordinare le persone, risolvere problemi al volo e vedere presto i risultati.",
      "watch": "Fare tutto da solo perché sembra più veloce. Lasciare ogni tanto il timone agli altri rende più forte tutta la squadra.",
      "tip": "Prima di assegnare i compiti, chiedi a ciascuno che cosa gli piacerebbe fare di più. Potresti restare sorpreso dalle risposte."
    },
    "caretaker": {
      "name": "Il Premuroso",
      "word": "premuroso",
      "vibe": "Ti assicuri che nessuno resti indietro.",
      "desc": "Ci tieni alle persone e lo dimostri con un sostegno costante e concreto. Ti accorgi quando qualcuno è in difficoltà, ricordi i dettagli che contano e ti piacciono i sistemi che tengono tutti al sicuro e ben seguiti. Magari non chiedi riconoscimenti, ma i team sentono la differenza quando ci sei. Un lavoro in cui puoi aiutare, sostenere e proteggere gli altri probabilmente ti sembrerà pieno di significato.",
      "keywords": ["Attento", "Paziente", "Affidabile"],
      "strengths": ["Cogliere i piccoli segnali di chi ha bisogno di aiuto", "Portare avanti le cose con cura, giorno dopo giorno", "Creare un’atmosfera serena e di fiducia"],
      "jobs": ["Infermiere", "Addetto alle risorse umane", "Assistente sociale", "Responsabile del servizio clienti"],
      "env": "Team affiatati con uno scopo chiaro, dove gentilezza e buone abitudini fanno una differenza reale nella vita delle persone.",
      "watch": "Dire di sì a tutti. Proteggere il tuo tempo è parte del prendersi cura bene degli altri.",
      "tip": "Blocca un’ora a settimana che sia solo per i tuoi obiettivi e difendila come qualsiasi altro appuntamento."
    },
    "creator": {
      "name": "Il Creativo",
      "word": "creativo",
      "vibe": "Dammi i materiali e comparirà qualcosa di nuovo.",
      "desc": "Pensi con le mani e con gli occhi. Ami fare cose che la gente può vedere, assaggiare, toccare o usare, e sei più felice quando puoi provare, verificare e migliorare strada facendo. Le regole vanno bene, ma preferisci avere spazio per sperimentare. Un lavoro in cui puoi progettare, realizzare o produrre qualcosa di concreto probabilmente ti terrà entusiasta a lungo.",
      "keywords": ["Ingegnoso", "Manuale", "Visivo"],
      "strengths": ["Trasformare un’idea in un lavoro vero e finito", "Capire cosa appare o si sente giusto", "Imparare in fretta provando le cose"],
      "jobs": ["Grafico", "Cuoco", "Videomaker", "Architetto d’interni"],
      "env": "Studi, cucine, laboratori o set dove puoi lavorare con materiali veri e mostrare ciò che hai fatto.",
      "watch": "Rifinire all’infinito. Un lavoro finito e portato nel mondo insegna più di uno perfetto chiuso in un cassetto.",
      "tip": "Tieni un portfolio di tutto ciò che fai, anche le cose piccole. Diventerà la tua migliore storia su di te."
    },
    "inventor": {
      "name": "L’Inventore",
      "word": "inventore",
      "vibe": "La tua mente è un laboratorio dove le idee nuove non smettono mai di ribollire.",
      "desc": "Ami le grandi domande e le risposte intelligenti. Ti piace immergerti in un rompicapo, mettere alla prova idee nella tua testa e trovare una soluzione che nessuno si aspettava. Pensi meglio quando hai tempo tranquillo e libertà di esplorare. Un lavoro in cui puoi fare ricerca, progettare sistemi o risolvere problemi difficili probabilmente sarà un parco giochi per la tua curiosità.",
      "keywords": ["Curioso", "Originale", "Analitico"],
      "strengths": ["Vedere schemi e collegamenti che altri non notano", "Concentrarti a fondo su un problema difficile", "Trovare soluzioni originali"],
      "jobs": ["Ricercatore scientifico", "Sviluppatore software", "Ingegnere", "Sviluppatore di videogiochi"],
      "env": "Luoghi tranquilli con spazio per concentrarsi, problemi interessanti e colleghi a cui piace un bel dibattito di idee.",
      "watch": "Tenere le tue idee brillanti nella testa. Condividerle presto aiuta gli altri a capirle e a costruirci sopra.",
      "tip": "Spiega la tua idea del momento a un amico in tre frasi. Se la capisce, sei pronto a realizzarla."
    },
    "builder": {
      "name": "Il Costruttore",
      "word": "costruttore",
      "vibe": "Non ti limiti a parlarne: lo fai, e lo fai bene.",
      "desc": "Sei pratico, costante e più felice quando vedi risultati concreti. Ti piacciono i passaggi chiari, i buoni strumenti e un lavoro che ti tiene in movimento invece che seduto. Quando qualcosa si rompe, sei tu che lo ripari con calma. Un lavoro in cui puoi costruire, riparare, far funzionare o tenere in sicurezza le cose probabilmente ti darà una profonda soddisfazione.",
      "keywords": ["Pratico", "Abile", "Costante"],
      "strengths": ["Seguire una procedura con cura e in sicurezza", "Risolvere problemi con calma e manualità", "Ottenere risultati concreti e visibili"],
      "jobs": ["Ingegnere meccanico", "Elettricista", "Pilota", "Meccanico"],
      "env": "Officine, cantieri, laboratori o cabine di pilotaggio dove contano abilità, sicurezza e lavoro di squadra, e ogni giorno vedi cosa hai realizzato.",
      "watch": "Sminuire le tue capacità. Quello che per te è ovvio spesso impressiona tutti gli altri.",
      "tip": "Impara uno strumento o una tecnica nuova a ogni stagione. Le tue competenze crescono più in fretta se le accumuli passo dopo passo."
    },
    "analyst": {
      "name": "L’Analista",
      "word": "analista",
      "vibe": "Dettagli, dati e ordine sono i tuoi superpoteri silenziosi.",
      "desc": "Noti ciò che gli altri trascurano. Ti piacciono il lavoro accurato, le regole chiare e la soddisfazione di avere ogni numero e ogni dettaglio al posto giusto. Pensi prima di agire, e la gente si fida del tuo giudizio perché si basa sui fatti. Un lavoro in cui puoi organizzare, controllare, misurare o analizzare informazioni probabilmente ti sembrerà sereno e appagante.",
      "keywords": ["Preciso", "Logico", "Calmo"],
      "strengths": ["Individuare errori e schemi nelle informazioni", "Tenere in ordine le cose complesse", "Prendere decisioni ponderate basate sui fatti"],
      "jobs": ["Commercialista", "Analista di dati", "Bibliotecario", "Tecnico di laboratorio"],
      "env": "Luoghi calmi e ben organizzati con aspettative chiare, dove la precisione è apprezzata e hai il tempo di fare le cose per bene.",
      "watch": "Aspettare l’informazione perfetta. A volte una decisione abbastanza buona oggi vale più di una perfetta il mese prossimo.",
      "tip": "Condividi una scoperta del tuo lavoro ogni settimana. I tuoi risultati accurati aiutano più persone quando li conoscono."
    }
  }
};
