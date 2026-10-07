/* Test dell’età mentale (it)
 * Same 8 age-bracket ids (kid teen fresh hustle steady seasoned mellow sage) and question/choice order as mentalage-core.js
 * (the "mind age" points live only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].points[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * result.age = plural forms for the number age (Intl.PluralRules: one/few/many/other), {n} = the number (or a range like 24–29).
 * Placeholders: {name} {emoji} {vibe} {age} {pct} {n} {min} {max} {range} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Pangolin&display=swap",
    "display": "'Pangolin'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test dell’età mentale: quanti anni ha la tua testa?",
    "description": "Fai il test dell’età mentale: 12 domande leggere di tutti i giorni, 2-3 minuti, senza registrazione. Scopri quanti anni ha davvero la tua testa, con il numero esatto, i tuoi punti di forza e qualche consiglio.",
    "ogTitle": "Test dell’età mentale 🧠 Quanti anni ha la tua testa?",
    "ogDescription": "Un quiz da 2 minuti. 12 domande quotidiane rivelano la tua età mentale, con il numero esatto."
  },
  "siteName": "Test dell’età mentale",
  "privacyLink": "Privacy",
  "start": {
    "badge": "🧠 Quiz lampo sulla mente",
    "h1Kicker": "Test dell’età mentale",
    "h1Html": "Quanti anni ha davvero<br><em>la tua testa</em>?",
    "hook": "La carta d’identità dice un numero. Le tue abitudini di ogni giorno forse ne dicono un altro. Rispondi con sincerità e scopri cosa ne pensa la tua testa.",
    "metaTime": "⏱️ 2-3 min",
    "metaCount": "✏️ 12 domande",
    "start": "Inizia il test →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "D{n}"
  },
  "loading": {
    "text": "Sto leggendo i tuoi scarabocchi…",
    "sub": "Conto le candeline sulla torta della tua mente"
  },
  "result": {
    "title": "Test dell’età mentale: sono {name}",
    "eyebrow": "La tua età mentale",
    "range": "{min}–{max}",
    "age": {
      "one": "{n} anno",
      "few": "{n} anni",
      "many": "{n} anni",
      "other": "{n} anni"
    },
    "metaRange": "Età mentale: {range}.",
    "strengthsLabel": "Cosa ti fa brillare",
    "tipsLabel": "Consigli per la tua età mentale",
    "bestLabel": "Migliore amico",
    "rivalLabel": "Rivale",
    "sameShare": "Il {pct}% ha questa fascia d’età",
    "shareText": "La mia età mentale: {age} {emoji} {name} — «{vibe}» Quanti anni ha la tua testa?",
    "ctaStrong": "Un amico ha condiviso la sua età mentale",
    "ctaSub": "Quanti anni ha la tua testa? 2 minuti.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "La mia età mentale",
    "brand": "🧠 Test dell’età mentale",
    "defaultKicker": "Test dell’età mentale",
    "defaultTitle": "Quanti anni ha la tua testa?",
    "defaultDesc": "12 domande quotidiane · 2-3 minuti"
  },
  "faq": [
    {
      "q": "Come viene calcolata la mia età mentale?",
      "a": "Ogni risposta vale qualche punto di «età mentale». Il totale ti colloca in una fascia d’età, e la posizione delle tue risposte dentro quella fascia dà il numero esatto. Stesse risposte, stesso risultato."
    },
    {
      "q": "È un vero test psicologico?",
      "a": "No, è solo per divertimento. Guarda abitudini e umore di tutti i giorni, non intelligenza o maturità. Prendilo come uno specchio scherzoso, non come una diagnosi."
    },
    {
      "q": "Perché il risultato è così diverso dalla mia età vera?",
      "a": "È proprio il bello. Tante persone hanno una testa più giovane o più matura della loro età. Il risultato può cambiare anche con l’umore, quindi riprova un altro giorno."
    },
    {
      "q": "Le mie risposte vengono salvate?",
      "a": "No. Le risposte vengono calcolate nel tuo browser e non vengono mai salvate. Contiamo solo in forma anonima quale fascia d’età è uscita, per mostrare quanto è comune ogni risultato."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Test dell’età mentale",
    "description": "Informativa sulla privacy del Test dell’età mentale: cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Test dell’età mentale (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
    "sections": [
      [
        "1. Dati raccolti",
        "Puoi usare il Servizio senza registrarti né accedere. Le tue risposte vengono calcolate nel browser e non vengono mai inviate o salvate sui nostri server. Contiamo solo in forma anonima quale fascia d’età è uscita, per mostrare quanto è comune ogni risultato."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli dalle impostazioni del browser; alcune funzioni potrebbero non funzionare correttamente."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e impostazioni nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Conserviamo totali giornalieri anonimi (visualizzazioni, test completati, valutazioni) per migliorare il Servizio. Questi totali non ti identificano."
      ],
      [
        "5. Contatti",
        "Per domande su questa informativa, contatta il gestore del sito."
      ],
      [
        "6. Data di entrata in vigore",
        "Questa informativa è valida dall’8 ottobre 2026."
      ]
    ],
    "back": "← Torna al test dell’età mentale"
  },
  "questions": [
    {
      "q": "Un sabato senza sveglia. A che ora ti alzi?",
      "choices": [
        "Alle 6, con la giornata già pianificata",
        "Verso le 9, riposato e senza sveglia",
        "Dopo mezzogiorno… la mattina cos’è?",
        "Prestissimo, saltando giù dal letto perché è weekend!"
      ]
    },
    {
      "q": "Il tuo compleanno ideale è…",
      "choices": [
        "Palloncini, cappellini e una torta gigante!",
        "Una festa enorme con tutta la compagnia",
        "Una bella cena con pochi amici stretti",
        "Una giornata tranquilla e una telefonata dalla famiglia"
      ]
    },
    {
      "q": "Sei in giro e il telefono è al 15%.",
      "choices": [
        "Panico, cerco subito una presa",
        "Nessun problema, ho sempre il powerbank",
        "Se si spegne, pazienza. Modalità avventura!"
      ]
    },
    {
      "q": "Al supermercato vai dritto a…",
      "choices": [
        "Il reparto caramelle e merendine",
        "Pizze surgelate ed energy drink",
        "Frutta, verdura e le offerte della settimana",
        "La mia lista della spesa, voce per voce"
      ]
    },
    {
      "q": "Tutti parlano di un nuovo tormentone.",
      "choices": [
        "Il balletto lo so già a memoria",
        "Nella mia playlist dal primo giorno",
        "Ma non è la cover di una canzone vecchia?",
        "Prima o poi lo ascolterò"
      ]
    },
    {
      "q": "Un giorno libero di pioggia. Programmi?",
      "choices": [
        "Stivali di gomma e salti nelle pozzanghere!",
        "Coperta, snack e una stagione intera di una serie",
        "Un bel brodo caldo e un po’ di ordine in casa",
        "Tè, un buon libro e un pisolino col rumore della pioggia"
      ]
    },
    {
      "q": "Ti arriva un bonus a sorpresa.",
      "choices": [
        "Finalmente compro quel videogioco o action figure",
        "Prenoto subito un viaggio con gli amici",
        "Una bella cena fuori e il resto da parte",
        "Tutto sul conto risparmio. Il me del futuro ringrazia."
      ]
    },
    {
      "q": "Venerdì sera, niente in programma.",
      "choices": [
        "Videogiochi o chiamate fino all’alba",
        "Scrivo a tutti finché non salta fuori qualcosa",
        "In pigiama alle 9, a letto alle 10. Che pace."
      ]
    },
    {
      "q": "Senti arrivare un raffreddore.",
      "choices": [
        "Mi lamento un po’ sperando che qualcuno mi coccoli",
        "Lo ignoro e vado avanti",
        "Tisana allo zenzero, vitamine e a letto presto",
        "Prendo qualcosa e continuo con calma"
      ]
    },
    {
      "q": "Il gruppo WhatsApp non smette di suonare.",
      "choices": [
        "Rispondo con dieci sticker di fila",
        "Mando il meme perfetto",
        "Leggo tutto e poi rispondo con un messaggio lungo",
        "Silenzio il gruppo. Perché scrivono tutti così tanto?"
      ]
    },
    {
      "q": "In questo momento la tua stanza è…",
      "choices": [
        "Peluche, pupazzi e cose colorate ovunque",
        "Poster, cavi e un caos creativo",
        "Pulita e minimal, ogni cosa al suo posto",
        "Piante, una poltrona comoda e una lampada da lettura"
      ]
    },
    {
      "q": "Se potessi sceglierne solo una…",
      "choices": [
        "Tornare bambino spensierato per un giorno",
        "Passare subito a una pensione tranquilla e serena"
      ]
    }
  ],
  "types": {
    "kid": {
      "name": "Bimbo del parco giochi",
      "word": "bimbo,parco giochi",
      "vibe": "Curioso, giocherellone e alimentato da pura gioia.",
      "desc": "La tua testa va ancora a ritmo di ricreazione. Ti entusiasmi subito, ridi forte e trovi qualcosa di divertente in quasi tutto. Le regole diventano facoltative se c’è un gioco in vista. Questa energia sincera e luminosa è contagiosa e fa sentire giovani anche gli altri.",
      "strengths": [
        "Curiosità infinita",
        "Buonumore istantaneo",
        "Fantasia senza paura"
      ],
      "tips": [
        "Tieniti lo stupore, ma metti un promemoria per le noiose faccende da adulti.",
        "Quando qualcosa ti sembra ingiusto, fai tre respiri prima di reagire.",
        "Condividi la tua cosa buffa preferita con un amico che ha bisogno di sorridere."
      ]
    },
    "teen": {
      "name": "Adolescente ribelle",
      "word": "adolescente,ribelle",
      "vibe": "Emozioni enormi, opinioni nette e una playlist per ogni umore.",
      "desc": "La tua testa vive con l’intensità del liceo: tutto conta tantissimo e senti tutto al massimo. Metti in dubbio le regole, scopri le novità prima di tutti e hai bisogno dei tuoi spazi. Dietro l’atteggiamento c’è un cuore leale pronto a tutto per gli amici veri.",
      "strengths": [
        "Passione per tutto",
        "Lealtà a prova di bomba",
        "Radar delle tendenze"
      ],
      "tips": [
        "Non ogni stato d’animo merita una risposta immediata. Dormici su.",
        "Scrivi le tue grandi idee, alcune sono davvero buone.",
        "Lasciati sorprendere da qualcuno più grande. Anche lui è stato ribelle."
      ]
    },
    "fresh": {
      "name": "Spirito da matricola",
      "word": "matricola",
      "vibe": "Libero, spontaneo e pronto a tutto.",
      "desc": "La tua testa è al primo anno di università: un po’ al verde, molto libera e sempre pronta per un piano last minute. Collezioni esperienze invece di oggetti e ti fai amici ovunque. La vita è una grande avventura che scopri strada facendo.",
      "strengths": [
        "Spontaneità",
        "Fa amicizia ovunque",
        "Coraggio davanti al nuovo"
      ],
      "tips": [
        "Di’ sì alle avventure, ma tieni anche una piccola abitudine di risparmio.",
        "Scegli un solo obiettivo questo mese e portalo a termine.",
        "Chiama casa ogni tanto, adorano le tue storie."
      ]
    },
    "hustle": {
      "name": "Ventenne rampante",
      "word": "ventenne,rampante",
      "vibe": "Ambizioso, impegnato e a base di caffè e grandi progetti.",
      "desc": "La tua testa è in piena fase di costruzione. Fai il giocoliere tra obiettivi, progetti paralleli e un’agenda piena, e trovi comunque il tempo per divertirti. Vuoi crescere senza diventare noioso. La tua grinta ispira gli altri, purché ti ricordi di riposare.",
      "strengths": [
        "Grinta inarrestabile",
        "Campione di multitasking",
        "Pianificatore ottimista"
      ],
      "tips": [
        "Metti il riposo in agenda come il lavoro.",
        "Festeggia le piccole vittorie, non solo quelle grandi.",
        "Non devi avere già tutte le risposte."
      ]
    },
    "steady": {
      "name": "Trentenne posato",
      "word": "trentenne",
      "vibe": "Calmo, affidabile e con tutto sotto controllo, senza rumore.",
      "desc": "La tua testa ha trovato il suo ritmo. Sai cosa ti piace, cosa no e quando dire di no. Pianifichi in anticipo, mantieni le promesse e in cucina te la cavi bene. Le persone vengono da te quando serve una mano sicura, e raramente le deludi.",
      "strengths": [
        "Affidabilità a prova di tutto",
        "Pianificazione furba",
        "Conosce i propri limiti"
      ],
      "tips": [
        "Lascia spazio a un divertimento imprevisto questa settimana.",
        "Prova qualcosa in cui torni a essere principiante.",
        "Lasciati aiutare ogni tanto. La fiducia va in due direzioni."
      ]
    },
    "seasoned": {
      "name": "Quarantenne navigato",
      "word": "quarantenne,navigato",
      "vibe": "Esperto, pratico e difficile da agitare.",
      "desc": "La tua testa ha visto qualche colpo di scena e resta calma. Risolvi i problemi in fretta, dai consigli sinceri e non sprechi energie nei drammi. Apprezzi comodità, qualità e persone che mantengono la parola. Con te accanto tutti si sentono al sicuro.",
      "strengths": [
        "Sangue freddo",
        "Consigli sinceri",
        "Saggezza pratica"
      ],
      "tips": [
        "Racconta le tue storie, i più giovani imparano tanto.",
        "Tieni un hobby solo per piacere, non per i risultati.",
        "Fai stretching ogni mattina. La schiena ringrazia."
      ]
    },
    "mellow": {
      "name": "Cinquantenne zen",
      "word": "cinquantenne",
      "vibe": "Rilassato, caloroso e felice senza fretta.",
      "desc": "La tua testa si gode la corsia lenta. Preferisci un buon pranzo, una lunga passeggiata e una chiacchierata vera a una serata rumorosa. Le piccole cose ti rendono felice e il giudizio degli altri non ti preoccupa più. Il tuo calore tranquillo rende ogni ritrovo più accogliente.",
      "strengths": [
        "Presenza serena",
        "Gusta le piccole gioie",
        "Ascolto generoso"
      ],
      "tips": [
        "Di’ sì a una nuova esperienza in questa stagione.",
        "Insegna a qualcuno un’abilità di cui vai fiero.",
        "Manda un breve messaggio a un vecchio amico."
      ]
    },
    "sage": {
      "name": "Vecchia anima saggia",
      "word": "vecchia anima,saggia",
      "vibe": "Profondo, gentile e pieno di saggezza silenziosa.",
      "desc": "La tua testa sembra aver vissuto molte vite. Ami la calma, le abitudini, il tè e i buoni libri. Noti ciò che agli altri sfugge e i tuoi consigli restano in mente per anni. Non insegui le mode, ma le persone cercano il tuo sguardo sereno.",
      "strengths": [
        "Sguardo profondo",
        "Pazienza gentile",
        "Consigli che restano"
      ],
      "tips": [
        "Fai qualcosa di spontaneo e un po’ sciocco questa settimana. Così, per gioco.",
        "Le tue abitudini tranquille sono preziose: condividile con un amico.",
        "Gioca con qualcuno molto più giovane. Riderete tutti e due."
      ]
    }
  }
};
