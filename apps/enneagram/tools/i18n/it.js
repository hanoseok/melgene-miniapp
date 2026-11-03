/* Test dell’enneagramma (it) — Italian, tu
 * 9 result ids (type1 … type9); questions[i].choices[j] follow enneagram-core.js QUESTIONS[i].c[j]
 * (the center or stance value of each choice; the one "softer" choice per question scores 1 point instead of 2).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the type number comes from result.typeNum, the only other number is the real server share ({pct}).
 * Kind, non-judgmental wording: every type has gifts and blind spots, nobody is only one type, and people grow.
 * Just for fun and self-reflection — not an official assessment (such as the RHETI) and not a diagnosis.
 * Placeholders: {n} {name} {emoji} {vibe} {pct}.
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
    "title": "Test dell’enneagramma: qual è il mio tipo?",
    "description": "Test dell’enneagramma gratis: 12 domande quotidiane, circa 2 minuti, senza registrazione. Scopri il tuo tipo, cosa ti motiva e i tuoi punti di forza.",
    "ogTitle": "Test dell’enneagramma 🔷 Qual è il tuo tipo?",
    "ogDescription": "Dodici domande quotidiane su come reagisci, decidi e ricarichi le energie. Scopri il tuo tipo dell’enneagramma, cosa ti spinge e come puoi crescere."
  },
  "siteName": "Test dell’enneagramma",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "🔷 Nove sguardi sul mondo",
    "h1Kicker": "Test dell’enneagramma",
    "h1Html": "Cosa ti <em>spinge</em><br>davvero?",
    "hook": "C’è chi prende in mano la situazione, chi porta la pace e chi, in silenzio, capisce tutto. L’enneagramma descrive nove modi di vedere il mondo e ciò che ognuno desidera di più. Rispondi a dodici domande quotidiane e scopri il tuo tipo.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 12 domande",
    "start": "Scopri il mio tipo →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "Domanda {n}"
  },
  "loading": {
    "text": "Unisco i puntini…",
    "sub": "Cerco il tuo posto nel cerchio"
  },
  "result": {
    "title": "Enneagramma tipo {n}: {name}",
    "metaDesc": "Risultato del test dell’enneagramma: tipo {n}, {name}. {vibe} Scopri la tua motivazione profonda, i tuoi punti di forza e tre consigli per crescere.",
    "eyebrow": "Il tuo tipo dell’enneagramma",
    "typeNum": "Tipo {n}",
    "desireLabel": "In fondo desideri",
    "fearLabel": "Ciò che cerchi di evitare",
    "gaugeLabel": "Dove si sono orientate le tue risposte",
    "centerLabel": "La tua energia nasce da…",
    "centers": ["La pancia", "Il cuore", "La testa"],
    "stanceLabel": "Ottieni ciò che ti serve…",
    "stances": ["Andando avanti", "Facendo la cosa giusta", "Prendendo distanza"],
    "strengthsLabel": "I tuoi punti di forza",
    "tipsLabel": "Consigli per crescere",
    "growthLabel": "Crescendo, prendi qualcosa da",
    "disclaimer": "Solo per divertimento e per riflettere su di te. Questo breve quiz non è una valutazione ufficiale dell’enneagramma come il RHETI, né un test psicologico o una diagnosi. Quasi tutti si riconoscono in più tipi, quindi considera il risultato un punto di partenza, non un’etichetta.",
    "sameShare": "Il {pct}% delle persone ha questo tipo",
    "shareText": "Sono il tipo {n} dell’enneagramma, {name} {emoji} «{vibe}» E tu che tipo sei?",
    "ctaStrong": "Un amico ha condiviso il suo tipo dell’enneagramma",
    "ctaSub": "Cosa ti spinge davvero? Scoprilo in 2 minuti.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "Il mio tipo dell’enneagramma",
    "brand": "🔷 Test dell’enneagramma",
    "defaultKicker": "Un veloce quiz sulla personalità",
    "defaultTitle": "Qual è il mio tipo dell’enneagramma?",
    "defaultDesc": "12 domande · 2 minuti · cosa ti spinge"
  },
  "faq": [
    {
      "q": "Come viene scelto il mio tipo?",
      "a": "Metà delle domande guarda dove tende a nascere la tua energia: nel corpo e nell’istinto, nei sentimenti o nel pensiero. L’altra metà guarda come cerchi di solito di ottenere ciò che ti serve. Il tuo tipo è il punto in cui le due risposte si incontrano, e le stesse risposte danno sempre lo stesso risultato."
    },
    {
      "q": "È il test ufficiale dell’enneagramma?",
      "a": "No. È un breve quiz per divertirti e riflettere su di te, non una valutazione ufficiale o validata come il RHETI, né una diagnosi psicologica. Se il risultato non ti convince, leggi anche i tipi vicini. Molte persone trovano il proprio tipo solo dopo averci riflettuto un po’."
    },
    {
      "q": "Il mio tipo può cambiare?",
      "a": "Secondo l’insegnamento dell’enneagramma il tipo di base resta piuttosto stabile, ma il modo in cui lo esprimi cambia molto con lo stress, l’umore e la crescita personale. Anche le risposte al quiz possono variare, quindi rifai il test tra qualche mese e guarda se esce lo stesso tipo."
    },
    {
      "q": "Le mie risposte vengono salvate?",
      "a": "No. Le risposte vengono calcolate nel tuo browser e non vengono memorizzate. Conteggiamo solo, in forma anonima, quale tipo è uscito, per poterti mostrare quanto è diffuso."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Test dell’enneagramma",
    "description": "Informativa sulla privacy del Test dell’enneagramma: come usiamo cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il Test dell’enneagramma (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
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
        "La presente informativa è in vigore dal 4 novembre 2026."
      ]
    ],
    "back": "← Torna al Test dell’enneagramma"
  },
  "questions": [
    {
      "q": "Arrivi a una festa dove non conosci quasi nessuno. Qual è la prima cosa che fai?",
      "choices": [
        "Sento l’atmosfera e vado dove c’è più energia",
        "Noto chi sembra simpatico e che impressione sto facendo",
        "Resto un attimo in disparte per capire come funziona qui",
        "Prendo da bere e mi butto subito in una conversazione"
      ]
    },
    {
      "q": "In un progetto di gruppo, ti viene naturale…",
      "choices": [
        "Prendere in mano la situazione e far andare avanti le cose",
        "Fare la mia parte a modo mio, in silenzio",
        "Controllare che tutti siano in pari e che non manchi niente",
        "Lanciare l’idea più audace e accendere gli animi"
      ]
    },
    {
      "q": "Davanti a una grande decisione, di cosa ti fidi di più?",
      "choices": [
        "Di come mi sento e di cosa significa per le persone a cui tengo",
        "Di ricerche, una lista di pro e contro e un piano B",
        "Di parlarne con qualcuno di vicino finché non mi sembra giusto",
        "Del mio istinto. Di solito lo so e basta."
      ]
    },
    {
      "q": "Quando desideri davvero qualcosa, di solito…",
      "choices": [
        "Prima controllo che vada bene alle persone intorno a me",
        "Vado dritto all’obiettivo",
        "Lo sogno a lungo prima di fare qualsiasi cosa",
        "Lavoro sodo, faccio le cose per bene e confido che ne varrà la pena"
      ]
    },
    {
      "q": "Cosa ti manda più in crisi in una brutta giornata?",
      "choices": [
        "Non sapere cosa succederà dopo",
        "Ricevere ordini o sentire che qualcosa è ingiusto",
        "Sentire che nessuno mi apprezza o mi nota",
        "Troppe cose in sospeso e nessuno con un piano chiaro"
      ]
    },
    {
      "q": "Dopo una settimana lunga e piena, ricaricarti significa…",
      "choices": [
        "Tempo per me, telefono spento, nel mio mondo",
        "Un nuovo piano: un viaggio, una serata fuori, qualcosa di grande",
        "Una giornata lenta senza fare assolutamente niente",
        "Svuotare la lista delle cose da fare per rilassarmi finalmente sul serio"
      ]
    },
    {
      "q": "Sei in una fila che non si muove. Tu…",
      "choices": [
        "Chiacchiero con chi ho accanto o scrivo a qualcuno",
        "Lo sento nel corpo: irrequietezza, mascella serrata",
        "Calcolo quanto ci vorrà e cerco un’alternativa più veloce",
        "Vado in testa alla fila a vedere cosa sta succedendo davvero"
      ]
    },
    {
      "q": "Qualcuno ti contraddice davanti agli altri. Tu…",
      "choices": [
        "Cerco una via di mezzo giusta che vada bene a tutti",
        "Ribatto e difendo la mia posizione",
        "Resto in silenzio e ci rimugino più tardi, per conto mio",
        "Sinceramente, un bel dibattito mi diverte parecchio"
      ]
    },
    {
      "q": "Quale complimento ti renderebbe felice la giornata?",
      "choices": [
        "«Capisci sempre cosa sta succedendo davvero.»",
        "«Hai un cuore enorme.»",
        "«Sei una persona vera. Non cedi mai sulle tue posizioni.»",
        "«Non c’è nessuno come te.»"
      ]
    },
    {
      "q": "Una regola che per te non ha senso…",
      "choices": [
        "La aggiro in silenzio, senza fare scenate",
        "Mi dà fastidio, ma odierei deludere qualcuno",
        "La metto in discussione ad alta voce, o la ignoro e basta",
        "La rispetto comunque finché non si può cambiare nel modo giusto"
      ]
    },
    {
      "q": "Quando una persona cara ha un problema, sei tu che…",
      "choices": [
        "Intervieni e fai qualcosa di concreto",
        "Ascolti e la fai sentire meno sola",
        "La aiuti a ragionarci e a vedere le sue possibilità",
        "Ti informi e scopri chi potrebbe aiutare"
      ]
    },
    {
      "q": "Un sabato libero senza nessun programma. Molto probabilmente…",
      "choices": [
        "Scrivo alle persone e organizzo qualcosa",
        "Sparisco per ore in un libro, un gioco o un hobby",
        "Recupero le faccende o aiuto chi ne ha bisogno",
        "Lascio scorrere la giornata e vedo dove mi porta"
      ]
    }
  ],
  "types": {
    "type1": {
      "name": "Il Perfezionista",
      "word": "perfezionista",
      "vibe": "Vedi come le cose potrebbero andare meglio e, in silenzio, lo pretendi prima di tutto da te.",
      "desire": "Essere una persona buona, giusta e fare le cose per bene",
      "fear": "Sbagliare, essere superficiale o lasciar correre",
      "desc": "Hai dentro un senso chiaro di ciò che è giusto e sbagliato, e noti cosa si potrebbe migliorare quasi ovunque guardi. Mantieni le promesse, ti prendi le tue responsabilità e le persone si fidano di te perché dici ciò che pensi davvero. Quegli stessi standard elevati possono però trasformarsi in un critico interiore molto rumoroso, e forse ti irriti quando agli altri non sembra importare quanto a te. Nella tua versione migliore hai principi, pazienza e saggezza, e sai che a volte abbastanza buono è proprio la misura giusta.",
      "keywords": ["Integrità", "Affidabilità", "Precisione"],
      "strengths": ["Fare le cose per bene, anche quando nessuno controlla", "Difendere ciò che è giusto", "Trasformare situazioni caotiche in piani chiari e fattibili"],
      "tips": ["Ascolta il tuo critico interiore e rispondigli come farebbe un amico gentile.", "Scegli una cosa a settimana da lasciare incompiuta di proposito, e scopri che il mondo non crolla.", "Fai spazio al gioco. Riposo e divertimento fanno parte del vivere bene, non sono un premio per aver finito tutto."],
      "growth": "Quando cresci ti sciogli un po’ e trovi più gioia, spontaneità e leggerezza."
    },
    "type2": {
      "name": "L’Altruista",
      "word": "altruista",
      "vibe": "Capisci di cosa hanno bisogno le persone prima che lo dicano, e ami rendere migliore la loro giornata.",
      "desire": "Essere amato e sentirti davvero necessario",
      "fear": "Non essere voluto o amato",
      "desc": "Hai calore, generosità e una grande sintonia con gli altri. Ricordi i compleanni, ci sei quando conta e accanto a te gli amici si sentono visti e accuditi. Le relazioni sono al centro della tua vita. Proprio perché sei così attento agli altri, puoi dimenticare i tuoi bisogni, fare fatica a dire di no o restarci male quando le tue premure passano inosservate. Nella tua versione migliore dai liberamente, senza tenere il conto, e lasci che anche gli altri si prendano cura di te.",
      "keywords": ["Calore", "Generosità", "Premura"],
      "strengths": ["Far sentire le persone accolte e apprezzate", "Cogliere ciò di cui qualcuno ha bisogno proprio ora", "Costruire amicizie strette e durature"],
      "tips": ["Prima di dire di sì, chiediti di cosa hai bisogno tu oggi.", "Lascia che gli altri ti aiutino, anche nelle piccole cose. Ricevere fa parte di un legame stretto.", "Esprimi ad alta voce i tuoi bisogni invece di sperare che qualcuno li indovini."],
      "growth": "Quando cresci rivolgi parte di quella cura verso te stesso e diventi più sincero sui tuoi sentimenti e bisogni."
    },
    "type3": {
      "name": "Il Realizzatore",
      "word": "realizzatore",
      "vibe": "Ti fissi un obiettivo, trovi la strada più veloce e porti tutti con te.",
      "desire": "Sentirti di valore e avere successo",
      "fear": "Non valere nulla o fallire",
      "desc": "Hai grinta, capacità di adattamento e tanta energia. Sai darti obiettivi, leggere l’atmosfera e ottenere risultati, e spesso la tua sicurezza e la tua determinazione ispirano gli altri. Ti piace crescere, migliorare ed essere bravo in quello che fai. A volte però è facile misurarti solo in base a ciò che ottieni e continuare a correre anche quando sei stanco. Nella tua versione migliore sei autentico oltre che vincente, e sai di valere qualcosa anche in una giornata storta.",
      "keywords": ["Determinazione", "Adattabilità", "Ispirazione"],
      "strengths": ["Trasformare le idee in risultati concreti", "Motivare una squadra e mantenere il ritmo", "Imparare in fretta e adattarti a qualsiasi contesto"],
      "tips": ["Chiediti che cosa vuoi tu, non solo cosa farà bella figura.", "Metti in agenda vero tempo libero e prendilo sul serio quanto una scadenza.", "Condividi un fallimento o un dubbio con qualcuno di cui ti fidi. Mostrarti per come sei avvicina le persone."],
      "growth": "Quando cresci ti dedichi di più a persone e cause più grandi del tuo successo personale."
    },
    "type4": {
      "name": "L’Individualista",
      "word": "individualista",
      "vibe": "Senti le cose in profondità e vuoi che la tua vita abbia un significato davvero tuo.",
      "desire": "Essere te stesso e trovare il tuo significato",
      "fear": "Non avere un’identità o essere una persona qualunque",
      "desc": "Hai sensibilità, creatività e un’onestà sulle emozioni che spesso gli altri evitano. Noti bellezza e significato nelle piccole cose, e preferisci essere autentico piuttosto che adeguarti. Gli amici vengono da te quando la vita si fa dura, perché i sentimenti veri non ti spaventano. A volte senti che ti manca qualcosa o che per gli altri sia tutto più facile, e gli stati d’animo possono trascinarti. Nella tua versione migliore trasformi le emozioni profonde in creatività e compassione, e ti godi ciò che di buono c’è già nella tua vita.",
      "keywords": ["Creatività", "Autenticità", "Profondità"],
      "strengths": ["Esprimere i sentimenti con parole, arte o stile", "Restare accanto alle persone nelle emozioni difficili", "Vedere bellezza e significato dove altri non li vedono"],
      "tips": ["Quando arriva un’ondata emotiva, dalle un nome e poi fai comunque una piccola cosa pratica.", "Tieni un elenco di ciò che di buono c’è già nella tua vita e aggiungi spesso qualcosa.", "Crea qualcosa con regolarità, anche se nessuno lo vede. Le abitudini costanti danno una casa ai tuoi sentimenti."],
      "growth": "Quando cresci aggiungi struttura e disciplina, e trasformi le emozioni in un lavoro costante di cui andare fiero."
    },
    "type5": {
      "name": "L’Osservatore",
      "word": "osservatore",
      "vibe": "Vuoi capire come funziona ogni cosa, possibilmente da un angolo tranquillo.",
      "desire": "Capire il mondo e sentirti capace",
      "fear": "Sentirti impotente, sopraffatto o senza risposte",
      "desc": "Hai curiosità, spirito d’osservazione e indipendenza. Ami approfondire un argomento finché non lo capisci davvero, e spesso noti dettagli e schemi che agli altri sfuggono. Dai valore al tuo tempo, alla tua energia e alla tua riservatezza, e hai bisogno di spazio per pensare prima di agire o condividere. A volte resti un po’ troppo nella tua testa, o ti ritiri quando ti chiedono più di quanto ti senti pronto a dare. Nella tua versione migliore condividi con generosità ciò che sai e affronti il mondo con sicurezza.",
      "keywords": ["Curiosità", "Intuito", "Indipendenza"],
      "strengths": ["Pensare con lucidità quando gli altri vanno nel panico", "Studiare a fondo e spiegare idee complesse", "Restare calmo e obiettivo"],
      "tips": ["Condividi ciò che sai prima che ti sembri finito. Le tue idee a metà sono spesso già utili.", "Prova a fare le cose con le mani e con il corpo, non solo con la mente.", "Di’ agli altri quando hai bisogno di stare per conto tuo, così non scambiano il tuo silenzio per distanza."],
      "growth": "Quando cresci passi dal guardare al fare, e agisci con più sicurezza e presenza."
    },
    "type6": {
      "name": "Il Leale",
      "word": "leale",
      "vibe": "Sei l’amico che pensa in anticipo, ha un piano e resta quando conta davvero.",
      "desire": "Sentirti al sicuro, sostenuto e certo delle persone intorno a te",
      "fear": "Restare senza sostegno né guida",
      "desc": "Hai lealtà, senso di responsabilità e un occhio rapido per ciò che potrebbe andare storto, cosa che ti rende un ottimo pianificatore e un amico di cui fidarsi. Prendi sul serio gli impegni e tieni molto alle tue persone e alle tue comunità. Visto che ragioni su ogni scenario possibile, la tua mente può riempirsi di dubbi, e potresti metterci un po’ a fidarti degli altri, o di te stesso. Nella tua versione migliore hai coraggio e stabilità, e ti fidi del tuo giudizio quanto delle persone che ami.",
      "keywords": ["Lealtà", "Responsabilità", "Prudenza"],
      "strengths": ["Individuare i problemi in anticipo e prepararti", "Stare accanto agli amici nella buona e nella cattiva sorte", "Unire le persone attorno a un obiettivo comune"],
      "tips": ["Quando la preoccupazione prende il sopravvento, scrivi cosa sta succedendo adesso, non cosa potrebbe succedere.", "Prendi ogni giorno una piccola decisione senza chiedere a nessuno, e nota che va tutto bene.", "Ricorda quello che hai già superato. Hai affrontato cose difficili anche prima."],
      "growth": "Quando cresci ti rilassi, ti fidi un po’ di più della vita e trovi un centro calmo e stabile."
    },
    "type7": {
      "name": "L’Entusiasta",
      "word": "entusiasta",
      "vibe": "La vita è un’avventura e vuoi assaggiare ogni sapore del menù.",
      "desire": "Essere felice, libero e pieno di belle esperienze",
      "fear": "Restare intrappolato nel dolore, nella noia o nei limiti",
      "desc": "Hai ottimismo, curiosità e un sacco di idee. Trovi il lato divertente in quasi tutto, ti riprendi in fretta e la tua energia tira su chiunque ti stia intorno. Posti nuovi, progetti e possibilità ti accendono. Visto che c’è sempre qualcosa di emozionante in arrivo, può esserti difficile restare a lungo su una cosa sola, o con le emozioni difficili. Nella tua versione migliore unisci la tua gioia a concentrazione e profondità, e scopri che essere presente può farti stare persino meglio del prossimo programma.",
      "keywords": ["Ottimismo", "Curiosità", "Spontaneità"],
      "strengths": ["Portare energia e divertimento in qualsiasi gruppo", "Trovare in fretta soluzioni creative", "Rialzarti dopo un imprevisto"],
      "tips": ["Porta a termine un progetto prima di iniziarne un altro, e goditi quella sensazione di cosa compiuta.", "Quando qualcosa fa male, concediti di sentirlo per un momento prima di cercare una distrazione.", "Prova ogni tanto un’ora lenta e tranquilla. Anche la calma può essere un’avventura."],
      "growth": "Quando cresci rallenti, ti concentri in profondità e ti godi momenti quieti e riflessivi."
    },
    "type8": {
      "name": "Il Leader",
      "word": "leader",
      "vibe": "Parli chiaro, proteggi i tuoi e non ti tiri mai indietro davanti a una sfida.",
      "desire": "Essere forte, avere in mano la tua vita e proteggere gli altri",
      "fear": "Essere controllato, ferito o senza potere",
      "desc": "Hai sicurezza, schiettezza e un’energia travolgente. Prendi le redini quando le cose si complicano, difendi chi non riesce a difendersi da solo e gli altri si sentono al sicuro con te dalla loro parte. Apprezzi l’onestà e rispetti la forza. A volte la tua intensità può sembrare eccessiva, e forse nascondi i sentimenti più teneri per non apparire mai vulnerabile. Nella tua versione migliore usi la tua forza per sollevare gli altri, e lasci che le persone di cui ti fidi vedano il tuo cuore grande e caldo.",
      "keywords": ["Forza", "Protezione", "Schiettezza"],
      "strengths": ["Prendere decisioni e guidare nei momenti di crisi", "Proteggere chi viene trattato ingiustamente", "Parlare con sincerità quando gli altri tacciono"],
      "tips": ["Prima di spingere, fai una domanda in più e ascolta davvero la risposta.", "Mostra il tuo lato più tenero a qualcuno di cui ti fidi. È forza, non debolezza.", "Accorgiti di quando vai a tutta potenza, e scegli quali battaglie contano davvero."],
      "growth": "Quando cresci apri il cuore e usi la tua forza per prenderti cura degli altri con dolcezza."
    },
    "type9": {
      "name": "Il Mediatore",
      "word": "mediatore",
      "vibe": "Porti calma ovunque vai e sai vedere tutti i lati di una storia.",
      "desire": "Avere pace interiore e armonia con gli altri",
      "fear": "Il conflitto, perdere il legame o sentirti escluso",
      "desc": "Hai un carattere tranquillo, paziente e accogliente. Sai vedere molti punti di vista, calmi le situazioni tese e accanto a te le persone si sentono rilassate e accettate. Spesso sei il collante che tiene unito un gruppo. Visto che vuoi che tutto resti tranquillo, potresti assecondare gli altri, rimandare le tue priorità o evitare di dire ciò che pensi davvero. Nella tua versione migliore sei una presenza stabile e attenta, e sai che la tua voce e i tuoi desideri contano quanto quelli di chiunque altro.",
      "keywords": ["Calma", "Accoglienza", "Sostegno"],
      "strengths": ["Calmare i conflitti e aiutare le persone a capirsi", "Ascoltare senza giudicare", "Creare un’atmosfera rilassata e accogliente"],
      "tips": ["Chiediti cosa vuoi tu prima di chiedere cosa vogliono gli altri.", "Ogni mattina scegli un compito importante e fallo per primo.", "Condividi la tua opinione sincera, con gentilezza. Un po’ di attrito può rendere i rapporti più forti."],
      "growth": "Quando cresci ti risvegli ai tuoi obiettivi e agisci con energia e concentrazione."
    }
  }
};
