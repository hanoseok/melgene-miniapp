/* Spending Personality Test (it)
 * 8 result ids (saver value flex impulse saverflex dealhunter quality balance); questions[i].choices[j] follow spend-core.js QUESTIONS[i].v[j] (the habit axis of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the user's own style mix and the real server share.
 * Placeholders: {name} {emoji} {vibe} {pct} {s} {v} {f} {i}. Entertainment only, not financial advice.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test personalità finanziaria: risparmiatore o spendaccione?",
    "description": "Test personalità finanziaria: risparmiatore o spendaccione? 12 situazioni quotidiane, 2 minuti, senza registrazione. Per gioco, non è consulenza.",
    "ogTitle": "Test personalità finanziaria 💸 Qual è il tuo stile con i soldi?",
    "ogDescription": "12 momenti quotidiani con i soldi, 2 minuti. Risparmiatore, spendaccione o impulsivo?"
  },
  "siteName": "Test personalità finanziaria",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "💸 Solo per gioco",
    "h1Kicker": "Test personalità finanziaria",
    "h1Html": "Che tipo di <em>spendaccione</em><br>sei?",
    "hook": "Giorno di paga, offerte, cene tra amici e abbonamenti dimenticati. Rispondi con sincerità a 12 momenti quotidiani con i soldi e scopri il tuo stile di spesa.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🛍️ 12 momenti",
    "start": "Scopri il mio stile →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "D{n}"
  },
  "loading": {
    "text": "Conto i tuoi spiccioli…",
    "sub": "Leggo i tuoi scontrini, solo per gioco"
  },
  "result": {
    "title": "Il mio stile di spesa: {name}",
    "metaDesc": "Risultato del test personalità finanziaria: {name}. {vibe}",
    "eyebrow": "Il tuo stile di spesa è",
    "gaugeLabel": "Le tue risposte, per stile",
    "axes": [
      "Risparmiatore",
      "Cacciatore di occasioni",
      "Sfarzoso",
      "Impulsivo"
    ],
    "strengthsLabel": "I tuoi punti di forza con i soldi",
    "weaknessLabel": "Attenzione a",
    "tipLabel": "Idea per divertirti",
    "disclaimer": "Solo a scopo di intrattenimento. Non è consulenza finanziaria.",
    "sameShare": "Il {pct}% delle persone ha ottenuto questo stile",
    "shareText": "Il mio stile di spesa: {name} {emoji} «{vibe}» E il tuo?",
    "shareTextPct": "Il mio stile di spesa: {name} {emoji} (Risparmiatore {s}% · Occasioni {v}% · Sfarzo {f}% · Impulsivo {i}%) E il tuo?",
    "ctaStrong": "Un amico ha condiviso il suo stile con i soldi",
    "ctaSub": "Risparmiatore o spendaccione? Scoprilo in 2 minuti.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "Il mio stile di spesa",
    "brand": "💸 Test personalità finanziaria",
    "defaultKicker": "Test personalità finanziaria",
    "defaultTitle": "Che tipo di spendaccione sei?",
    "defaultDesc": "12 momenti quotidiani con i soldi · 2 minuti"
  },
  "faq": [
    {
      "q": "Come viene deciso il mio stile di spesa?",
      "a": "Ogni risposta pende verso una di quattro abitudini con i soldi: risparmiare, cercare l’affare, concedersi un vizio o comprare d’impulso. Il tuo risultato dipende dalle abitudini che hai scelto più spesso e da quanto erano vicine tra loro. Le stesse risposte danno sempre lo stesso risultato."
    },
    {
      "q": "È consulenza finanziaria?",
      "a": "No. È un quiz di personalità leggero, fatto per divertirsi. Non dice nulla sulla tua situazione finanziaria reale e non va mai usato per prendere decisioni sui soldi. Per domande finanziarie vere, rivolgiti a un professionista qualificato."
    },
    {
      "q": "Esiste uno stile di spesa giusto o sbagliato?",
      "a": "No. Ogni stile ha punti di forza e punti ciechi, e la maggior parte delle persone ne mescola più d’uno. Le tue risposte cambiano anche con l’umore, il budget e il periodo della vita, quindi riprova un altro giorno."
    },
    {
      "q": "Le mie risposte vengono salvate?",
      "a": "No. Le tue risposte vengono calcolate nel tuo browser e non vengono mai memorizzate. Contiamo solo, in modo anonimo, quale stile è uscito, per poter mostrare quanto è diffuso ciascuno."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Test personalità finanziaria",
    "description": "Informativa sulla privacy del Test personalità finanziaria: come usiamo cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il Test personalità finanziaria (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
    "sections": [
      [
        "1. Informazioni che raccogliamo",
        "Puoi usare il Servizio senza registrarti né accedere. Le tue risposte e il tuo mix di stili vengono calcolati nel tuo browser e non vengono mai inviati né conservati sui nostri server. Contiamo solo, in modo anonimo, quale risultato è uscito, per poter mostrare quanto è diffuso ciascun risultato."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare i cookie e la memoria locale del tuo browser per ricordare la tua lingua, mostrare annunci e capire come viene usato il Servizio. Puoi rifiutarli o eliminarli dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare correttamente."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per pubblicare annunci basati sulle tue visite precedenti a questo e ad altri siti web. Puoi saperne di più e modificare le impostazioni di personalizzazione degli annunci nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
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
        "La presente informativa è in vigore dal 18 ottobre 2026."
      ]
    ],
    "back": "← Torna al Test personalità finanziaria"
  },
  "questions": [
    {
      "q": "Ti arriva lo stipendio. Qual è la prima cosa che fai?",
      "choices": [
        "Prenoto qualcosa di bello che guardo da tempo",
        "Metto subito una bella parte sul conto di risparmio",
        "Apro un’app di shopping: «me lo merito»",
        "Controllo quali bollette e abbonamenti scadono e pianifico il resto"
      ]
    },
    {
      "q": "Un amico ti invita in un ristorante alla moda e caro.",
      "choices": [
        "Propongo un posto più economico o una cena a casa",
        "Che bello! Ordino esattamente quello che mi va",
        "Guardo recensioni e menù fissi per trovare l’offerta migliore",
        "Prenoto subito e al conto penso dopo"
      ]
    },
    {
      "q": "Le tue cuffie si rompono definitivamente e ne servono di nuove.",
      "choices": [
        "Confronto recensioni e storico dei prezzi per settimane",
        "Compro le prime che mi mostra una pubblicità. Fatto in un minuto",
        "Aspetto il più a lungo possibile, poi compro le più economiche decenti",
        "Prendo il modello top, che si sente bene e dura a lungo"
      ]
    },
    {
      "q": "Il tuo negozio preferito fa dei saldi enormi.",
      "choices": [
        "Riempio il carrello prima di riuscire a pensare",
        "Compro solo ciò che era già sulla mia lista",
        "Prendo quel capo di qualità che finalmente è alla mia portata",
        "Tiro dritto. Costa poco solo se mi serviva"
      ]
    },
    {
      "q": "Una prova gratuita sta per diventare un abbonamento a pagamento.",
      "choices": [
        "L’ho disdetta il giorno stesso in cui mi sono iscritto",
        "Lo tengo. I buoni servizi si pagano volentieri",
        "Imposto un promemoria e decido se vale la pena",
        "Me ne sono dimenticato, e ora ne pago diversi"
      ]
    },
    {
      "q": "Pausa caffè al lavoro.",
      "choices": [
        "La specialità del mio bar preferito, senza rimpianti",
        "Caffè da casa, nel mio thermos",
        "Un caffè, una brioche e quella tazza carina vicino alla cassa",
        "Il bar con i coupon migliori e la tessera a punti"
      ]
    },
    {
      "q": "Arriva il conto della cena tra amici.",
      "choices": [
        "Pago per tutti d’impulso, poi mi chiedo dove siano finiti i soldi",
        "Uso un’app per dividere il conto, così è veloce ed equo",
        "Offro un giro e prendiamo anche il dolce",
        "Pago esattamente quello che ho mangiato, fino all’ultimo centesimo"
      ]
    },
    {
      "q": "Alla cassa ti propongono un piccolo extra.",
      "choices": [
        "Solo se l’offerta combinata conviene davvero",
        "Sì, e anche le caramelle vicino alla cassa",
        "«No, grazie.» Non ci penso nemmeno",
        "Certo. I piccoli lussi rendono la giornata più bella"
      ]
    },
    {
      "q": "Stai organizzando una vacanza.",
      "choices": [
        "Un foglio di calcolo e comparatori per il miglior rapporto qualità-prezzo",
        "Prenoto un volo stasera perché la tariffa sembrava buona",
        "Bassa stagione, alloggio economico, attività gratuite",
        "Un hotel davvero bello. Il viaggio è il mio premio"
      ]
    },
    {
      "q": "A fine mese apri l’app della banca.",
      "choices": [
        "Aspetta, dov’è finito tutto questo?",
        "Metto tutto in categorie e correggo il mese prossimo",
        "So dov’è andato e ne è valsa la pena",
        "Il saldo è buono e sono orgoglioso in silenzio"
      ]
    },
    {
      "q": "Inizi un nuovo hobby.",
      "choices": [
        "Subito attrezzatura da professionista. Se lo faccio, lo faccio bene",
        "Mi faccio prestare l’attrezzatura e imparo con video gratuiti",
        "Attrezzatura, libri, corsi e un outfit carinissimo, tutto nella prima settimana",
        "Compro il kit per principianti con le recensioni migliori"
      ]
    },
    {
      "q": "Quale frase ti somiglia di più?",
      "choices": [
        "«Ogni piccolo risparmio conta»",
        "«Si vive una volta sola»",
        "«Perché pagare di più la stessa cosa?»",
        "«Sul momento mi sembrava la cosa giusta»"
      ]
    }
  ],
  "types": {
    "saver": {
      "name": "Maestro del Risparmio",
      "word": "risparmio",
      "vibe": "Ogni moneta ha il suo lavoro, e le tue arrivano sempre puntuali.",
      "desc": "Ti piace sapere dove sono i tuoi soldi e a cosa servono. Ti porti il pranzo da casa senza lamentarti, noti le piccole perdite e senti un brivido tranquillo quando la cifra sul conto sale. Gli amici ti chiamano per sapere se qualcosa vale davvero la pena, e tu rispondi con sincerità. Le tue abitudini calme e costanti rendono il futuro meno spaventoso.",
      "strengths": [
        "Paziente e disciplinato",
        "Individua subito gli sprechi",
        "Sereno sul futuro"
      ],
      "weakness": "A volte dici di no a cose che ti avrebbero reso davvero felice, e poi ti senti un po’ escluso.",
      "tip": "Scegli ogni mese un piccolo premio tutto tuo, senza alcun senso di colpa. Goderselo fa parte del piano."
    },
    "value": {
      "name": "Detective delle Occasioni",
      "word": "occasioni",
      "vibe": "Prima confronto, poi compro.",
      "desc": "Ti informi prima di comprare: recensioni, storico dei prezzi, l’altra scheda, l’altro negozio. Trovare l’offerta migliore ti sembra risolvere un piccolo enigma, e adori condividere la soluzione. Non sei tirchio, sei solo allergico a pagare troppo. Le persone si fidano dei tuoi consigli perché hai già fatto i compiti.",
      "strengths": [
        "Ottimo ricercatore",
        "Confronta con calma",
        "Condivide scoperte utili"
      ],
      "weakness": "Confrontare può richiedere più tempo di quanto la cosa meriti, e a volte perdi il momento giusto.",
      "tip": "Metti un limite di tempo alla ricerca. L’offerta migliore è anche quella che ti piace davvero usare."
    },
    "flex": {
      "name": "Protagonista della Propria Vita",
      "word": "protagonista",
      "vibe": "Tratta ogni giorno come una prima serata.",
      "desc": "Credi che i bei momenti meritino belle cose: la cena speciale, il biglietto del concerto, il regalo che toglie il fiato. Spendi con intenzione e senza troppi sensi di colpa, e la tua generosità è contagiosa. Gli amici adorano stare con te perché trasformi le serate qualunque in occasioni. Vivi nel presente e lo fai brillare.",
      "strengths": [
        "Generoso e divertente",
        "Crea momenti indimenticabili",
        "Sa cosa ama"
      ],
      "weakness": "I grandi momenti possono far posto stretto a quelli piccoli e tranquilli che conteranno più avanti.",
      "tip": "Segna in agenda anche un piccolo regalo per il te del futuro. Rende il lusso ancora più dolce."
    },
    "impulse": {
      "name": "Re del Carrello Pieno",
      "word": "carrello",
      "vibe": "Il carrello si riempie più in fretta di quanto arrivi il pensiero.",
      "desc": "Segui la tua scintilla. Una cosina carina, un buon umore o l’entusiasmo di un amico, e all’improvviso è già in viaggio verso casa tua. Quella spontaneità fa parte del tuo fascino: provi cose nuove, dici sì alle avventure e la tua vita è raramente noiosa. I tuoi scaffali sono pieni di storie, anche di quelle iniziate con «dovevo averlo».",
      "strengths": [
        "Spontaneo e curioso",
        "Dice sì all’avventura",
        "Diffonde buona energia"
      ],
      "weakness": "Alcuni acquisti perdono in fretta il fascino, e l’estratto conto di fine mese ti sorprende.",
      "tip": "Prova un carrello dei «forse» per una notte. Se domani sorridi ancora, è un sì vero."
    },
    "saverflex": {
      "name": "Formica con Sfizio",
      "word": "formica",
      "vibe": "Prudente per mesi, poi un sì glorioso.",
      "desc": "Quasi sempre sei quello prudente: i coupon, il pranzo da casa, il «adesso no». Ma risparmi con uno scopo, e quando arriva il giorno spendi per ciò che volevi davvero, senza scusarti. È una combinazione sorprendente: parsimonioso e teatrale. Spesso la gente resta di stucco davanti alla grandezza del tuo unico grande sì.",
      "strengths": [
        "Risparmia con un obiettivo",
        "Gode appieno degli acquisti",
        "Sa cosa conta"
      ],
      "weakness": "La lunga attesa può far sembrare lo sfizio troppo grande, e poi può spuntare il senso di colpa.",
      "tip": "Dai al tuo grande sfizio un nome e una data. Aspettarlo è metà del divertimento."
    },
    "dealhunter": {
      "name": "Cacciatore di Saldi",
      "word": "saldi",
      "vibe": "È difficile voltare le spalle a un buon affare.",
      "desc": "Gli sconti ti accendono. Adori le offerte a tempo, i pacchetti e i codici promo che funzionano davvero, e scatti subito quando il prezzo ti convince. Metà detective, metà avventuriero, ti diverti sul serio con la caccia in sé. Gli amici ti scrivono quando vogliono sapere se un’offerta vale tutto quel clamore.",
      "strengths": [
        "Occhio di lince per le offerte",
        "Rapido e deciso",
        "Divertente con cui fare shopping"
      ],
      "weakness": "Un prezzo fantastico può farti dimenticare di chiederti se ti serviva davvero.",
      "tip": "Prima di cliccare, chiediti: «Lo vorrei anche a prezzo pieno?» Se sì, è una vittoria vera."
    },
    "quality": {
      "name": "Compra-Bene-Una-Volta",
      "word": "compra-bene",
      "vibe": "Spendi un po’ di più una volta, goditelo per anni.",
      "desc": "Scegli con cura e scegli bene. Preferisci avere una giacca splendida piuttosto che cinque nella media, e ti importa come le cose si sentono, durano e si adattano alla tua vita. Ti informi quanto basta per essere sicuro, poi ti impegni senza rimpianti. Le tue cose tendono a essere belle e a restarlo, e ne sei giustamente orgoglioso.",
      "strengths": [
        "Riflessivo ed esigente",
        "Apprezza la qualità e la durata",
        "Si pente raramente di un acquisto"
      ],
      "weakness": "L’opzione «migliore» è difficile da trovare, e aspettarla può rallentarti.",
      "tip": "A volte il «abbastanza bene» è ottimo. Concediti di goderti subito la cosa bella."
    },
    "balance": {
      "name": "Budget in Equilibrio",
      "word": "equilibrio",
      "vibe": "Né troppo tirchio né troppo scatenato. Giusto così.",
      "desc": "Mescoli un po’ di tutto. Sai risparmiare quando conta, comprare con testa quando serve, concederti qualcosa quando ci sta e ogni tanto fare un acquisto spontaneo. Questo ti rende facile con cui fare shopping, viaggiare e dividere il conto. Le persone si sentono a loro agio con le tue abitudini con i soldi, perché sono flessibili e cordiali.",
      "strengths": [
        "Flessibile e rilassato",
        "Si adatta a ogni situazione",
        "Facile con cui dividere il conto"
      ],
      "weakness": "Senza una regola forte, le piccole decisioni possono andare alla deriva senza che te ne accorga.",
      "tip": "Scegli una piccolissima abitudine che ti piace e fanne la tua àncora. Il resto può restare flessibile."
    }
  }
};
