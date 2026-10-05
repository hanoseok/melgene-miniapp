/* Che animale sei? (it)
 * Same 8 animal ids (wolf owl otter lion panda eagle sloth deer) and question/choice order as animal-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as animal-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name an animal result or quote a question.
 * types.<id>.word = the plain animal word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Che animale sei? Test di personalità animale",
    "description": "Che animale sei? Test di personalità con 8 situazioni di tutti i giorni: 2-3 minuti, gratis e senza registrazione. Scopri quale animale ti somiglia, la tua anima affine e qualche consiglio.",
    "ogTitle": "Che animale sei? 🦊 Test di personalità animale",
    "ogDescription": "Un quiz veloce di 2 minuti. Rispondi a 8 situazioni quotidiane e scopri l’animale che ti somiglia di più."
  },
  "siteName": "Che animale sei?",
  "privacyLink": "Privacy",
  "start": {
    "badge": "🦊 Test di personalità animale",
    "h1Kicker": "Che animale sei?",
    "h1Html": "A quale animale<br>somigli <em>di più</em>?",
    "hook": "Un piano saltato, una chiamata a mezzanotte, una festa dove conosci solo una persona… Pochi momenti quotidiani rivelano il tuo lato selvaggio.",
    "metaTime": "⏱️ 2-3 minuti",
    "metaCount": "🐾 8 domande",
    "start": "Trova il mio animale →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "D{n}"
  },
  "loading": {
    "text": "Seguiamo le tue orme…",
    "sub": "Abbiniamo le tue risposte a un animale"
  },
  "result": {
    "title": "Che animale sei? Sono {name}",
    "eyebrow": "L’animale che ti somiglia di più",
    "strengthsLabel": "I tuoi superpoteri",
    "tipsLabel": "Consigli per il tuo lato animale",
    "bestLabel": "Anima affine",
    "rivalLabel": "Rivale",
    "sameShare": "Il {pct}% di chi gioca ha questo animale",
    "shareText": "Il mio animale è {name} {emoji}: «{vibe}» E il tuo?",
    "ctaStrong": "Un amico ha condiviso il suo animale",
    "ctaSub": "Che animale sei? Bastano 2 minuti.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "Il mio animale è",
    "brand": "🦊 Che animale sei?",
    "defaultKicker": "Test di personalità animale",
    "defaultTitle": "Che animale sei?",
    "defaultDesc": "8 situazioni quotidiane · 2-3 minuti"
  },
  "faq": [
    {
      "q": "Come viene scelto il mio animale?",
      "a": "Ogni risposta dà punti a un paio di animali e vince quello con più punti. I pareggi si risolvono con una regola fissa, quindi le stesse risposte danno sempre lo stesso risultato."
    },
    {
      "q": "È un test di personalità scientifico?",
      "a": "No, è solo per divertirsi. Le domande partono da abitudini e umori di tutti i giorni, non da una diagnosi psicologica: consideralo uno specchio giocoso."
    },
    {
      "q": "Cosa significano «anima affine» e «rivale»?",
      "a": "La tua anima affine è l’animale che bilancia naturalmente il tuo. Il tuo rivale è quello con cui ti scontri di più, e a volte è anche quello con più scintille."
    },
    {
      "q": "Le mie risposte vengono salvate?",
      "a": "No. Le tue risposte sono calcolate nel tuo browser e non vengono mai salvate. Contiamo solo, in forma anonima, quale animale è uscito, per mostrare quanto è comune ogni risultato."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Che animale sei?",
    "description": "Informativa sulla privacy di «Che animale sei?»: cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Che animale sei? (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Puoi usare il Servizio senza registrarti né accedere. Le tue risposte vengono calcolate nel browser e non vengono mai inviate né salvate sui nostri server. Contiamo solo, in forma anonima, quale animale è uscito per mostrare la frequenza di ogni risultato."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare correttamente."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e impostazioni nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Conserviamo solo totali giornalieri anonimi (visualizzazioni, test completati, valutazioni) per migliorare il Servizio. Questi totali non ti identificano."
      ],
      [
        "5. Contatti",
        "Per domande su questa informativa, contatta il gestore del sito."
      ],
      [
        "6. Data di efficacia",
        "Questa informativa è in vigore dal 6 ottobre 2026."
      ]
    ],
    "back": "← Torna al test sugli animali"
  },
  "questions": [
    {
      "q": "Ti saltano i programmi del weekend. Tu…",
      "choices": [
        "Scrivi agli amici più stretti per vedere chi è libero",
        "Finalmente ti metti sul divano con un libro o un documentario",
        "Provi qualcosa a caso: un bar nuovo, un parco, quel che capita",
        "Organizzi al volo una cena e inviti tutti. Stasera si ospita!"
      ]
    },
    {
      "q": "Ti piomba addosso un grosso lavoro di gruppo. Tu…",
      "choices": [
        "Vai un passo alla volta, con calma e costanza",
        "Tieni alto il clima e fai la tua parte coi tuoi tempi",
        "Fissi un obiettivo chiaro e punti al risultato migliore",
        "Prima di tutto ti assicuri che tutti si sentano ascoltati e a loro agio"
      ]
    },
    {
      "q": "Un amico ti chiama a mezzanotte, a pezzi. Tu…",
      "choices": [
        "Lo tiri su con le battute finché non ride",
        "Lo aiuti a costruire un piano chiaro per risolvere",
        "Dici «arrivo» e sei lì in 20 minuti",
        "Resti al telefono, calmo e rassicurante, per tutto il tempo che serve"
      ]
    },
    {
      "q": "Arrivi a una festa dove conosci una sola persona. Tu…",
      "choices": [
        "Stai vicino al tuo amico, sorridi e aspetti che qualcuno si avvicini",
        "Entri come se fossi a casa tua e saluti tutti",
        "Osservi la sala, poi attacchi bottone con chi sembra interessante",
        "Ti trovi un angolino comodo vicino agli stuzzichini e non ti muovi più"
      ]
    },
    {
      "q": "Scegli il viaggio dei tuoi sogni.",
      "choices": [
        "Un resort accogliente: dormire fino a tardi, mangiare bene, non fare nulla",
        "Un on the road con i migliori amici, ricordi a ogni tappa",
        "Una campagna fiorita o una baita nel bosco",
        "Un borgo antico e tranquillo pieno di musei, librerie e storie"
      ]
    },
    {
      "q": "All’improvviso salta fuori un problema. Tu…",
      "choices": [
        "Ti concentri, trovi la via più rapida e lo risolvi",
        "Ci ridi su, improvvisi e lo trasformi in qualcosa di divertente",
        "Respiri a fondo, sgranocchi qualcosa e lasci che si sistemi da solo",
        "Ti fai avanti e prendi subito in mano la situazione"
      ]
    },
    {
      "q": "I tuoi amici ti descriverebbero come…",
      "choices": [
        "Quello dolce, che si accorge sempre di come stanno tutti",
        "Quello determinato, che ha sempre un obiettivo",
        "Quello leale, che li sostiene sempre",
        "Quello divertente, che rende migliore ogni piano"
      ]
    },
    {
      "q": "La tua serata perfetta finisce con…",
      "choices": [
        "Tutti che applaudono una notte che hai reso indimenticabile",
        "Buon cibo, bella gente e risate senza fretta",
        "Una conversazione profonda a notte fonda sotto le stelle",
        "A letto presto, cellulare spento e una dormita lunghissima"
      ]
    }
  ],
  "types": {
    "wolf": {
      "name": "il Lupo fedele",
      "word": "lupo",
      "vibe": "Di una lealtà feroce: il tuo branco viene sempre prima.",
      "desc": "Sei l’amico che c’è quando serve. Quando qualcuno entra nella tua cerchia lo proteggi, lo sostieni e non dimentichi mai ciò che ha fatto per te. All’inizio puoi sembrare serio, ma con i tuoi sei caloroso, divertente e devoto. Il tuo branco è davvero fortunato.",
      "strengths": [
        "Lealtà incrollabile",
        "Cuore protettivo",
        "Spirito di squadra"
      ],
      "tips": [
        "Lascia che anche gli altri ti aiutino: non devi portare tutto il branco.",
        "Ogni tanto di’ «no». Essere leali non significa accettare tutto.",
        "Fai spazio a persone nuove: la tua cerchia può crescere senza perdere calore."
      ]
    },
    "owl": {
      "name": "il Gufo saggio",
      "word": "gufo,civetta",
      "vibe": "Osservatore silenzioso, sempre tre pensieri più in profondità.",
      "desc": "Preferisci guardare, ascoltare e capire prima di parlare. Le persone vengono da te per un consiglio ponderato e dai il meglio nelle conversazioni profonde a notte fonda. Ami imparare e noti i dettagli che tutti gli altri perdono. A volte ci pensi troppo, ma la tua intuizione è un vero dono.",
      "strengths": [
        "Intuito acuto",
        "Grande ascoltatore",
        "Mente curiosa"
      ],
      "tips": [
        "Condividi le tue idee prima che siano perfette: la gente vuole ascoltarle.",
        "Quando la mente corre, scrivi o fai una passeggiata invece di rimuginare.",
        "Metti in agenda un momento di svago senza scopo. Il tuo cervello merita la ricreazione."
      ]
    },
    "otter": {
      "name": "la Lontra giocherellona",
      "word": "lontra",
      "vibe": "Pura allegria, grandi sorrisi e il talento di migliorare ogni giornata.",
      "desc": "Trasformi i momenti ordinari in giochi. Sei curiosa, cordiale e quasi impossibile da rattristare. Ti fai amici ovunque e tieni il clima leggero anche quando tutto va storto. Dietro le battute, vuoi solo che tutti si divertano insieme.",
      "strengths": [
        "Buon umore immediato",
        "Amicizie facili",
        "Divertimento senza paura"
      ],
      "tips": [
        "Concediti ogni tanto un minuto di silenzio: non ogni emozione ha bisogno di una battuta.",
        "Porta a termine una cosa piccola prima di lanciarti nella prossima avventura.",
        "Di’ quando stai davvero male: gli altri saranno felici di esserci."
      ]
    },
    "lion": {
      "name": "il Leone audace",
      "word": "leone",
      "vibe": "Sicuro, di buon cuore e nato per guidare la sala.",
      "desc": "Ti fai avanti quando gli altri esitano. Hai presenza, coraggio e un lato generoso, e la gente segue naturalmente la tua energia. Adori i grandi momenti e fai sentire i tuoi festeggiati. Al meglio, guidi sollevando tutti quelli che ti stanno intorno.",
      "strengths": [
        "Leadership naturale",
        "Coraggio generoso",
        "Sicurezza contagiosa"
      ],
      "tips": [
        "Cedi ogni tanto i riflettori: le voci pacate hanno spesso le idee migliori.",
        "Chiedi prima di prendere il comando. L’aiuto funziona meglio quando è desiderato.",
        "Riposare fa parte della forza. Anche i re fanno il pisolino."
      ]
    },
    "panda": {
      "name": "il Panda zen",
      "word": "panda",
      "vibe": "Tranquillo, gentile e la calma in ogni tempesta.",
      "desc": "Ti lasci portare dalla corrente e aiuti tutti intorno a te a rilassarsi. Ti piacciono il buon cibo, la buona compagnia e le giornate senza fretta. Fai raramente drammi ed è molto difficile farti perdere la calma. Alla gente piace quanto sia sicuro e confortevole stare con te.",
      "strengths": [
        "Presenza serena",
        "Gentilezza rilassata",
        "Il piacere delle piccole cose"
      ],
      "tips": [
        "Di’ ad alta voce ciò che vuoi: puoi avere anche tu un preferito.",
        "Scegli un piccolo obiettivo a settimana per metterti un po’ alla prova.",
        "Non lasciare che «per me è uguale» nasconda ciò che senti davvero."
      ]
    },
    "eagle": {
      "name": "l’Aquila ambiziosa",
      "word": "aquila",
      "vibe": "Concentrata, indipendente e sempre puntata più in alto.",
      "desc": "Vedi il quadro generale e ci vai dritta. Fissi obiettivi, fai piani e pretendi molto da te stessa. Ami l’indipendenza e risolvi i problemi in fretta. La tua ambizione ispira e, in fondo, speri in qualcuno che tenga il tuo passo.",
      "strengths": [
        "Concentrazione nitida",
        "Spirito indipendente",
        "Risolve i problemi in fretta"
      ],
      "tips": [
        "Festeggia le vittorie lungo la strada, non solo in cima.",
        "Delega qualcosa questa settimana. La fiducia porta più lontano della velocità.",
        "Chiedi come stanno gli altri: il progresso è più bello se condiviso."
      ]
    },
    "sloth": {
      "name": "il Bradipo coccoloso",
      "word": "bradipo",
      "vibe": "Lento, costante e un professionista nel godersi la vita.",
      "desc": "Conosci il segreto che gli altri dimenticano: non c’è premio per chi si affretta. Proteggi la tua pace, ami le tue comodità e vai avanti un passo gentile alla volta. Sei paziente, imperturbabile e silenziosamente saggio su ciò che conta davvero. La tua calma è un dono in un mondo di corsa.",
      "strengths": [
        "Pazienza profonda",
        "Mentalità serena",
        "Maestro del comfort"
      ],
      "tips": [
        "Comincia prima di sentirti pronto: anche i piccoli passi contano.",
        "Racconta i tuoi piani agli amici per tempo, così si adattano al tuo ritmo.",
        "Prova una novità al mese. Accogliente e curioso possono andare insieme."
      ]
    },
    "deer": {
      "name": "il Cervo gentile",
      "word": "cervo,daino",
      "vibe": "Dal cuore tenero, aggraziato e in sintonia con le emozioni di tutti.",
      "desc": "Noti le piccole cose: un cambio d’umore, qualcuno da solo in un angolo. Sei dolce, sensibile e silenziosamente gentile, e ami i posti belli e tranquilli. Forse ti spaventi davanti ai conflitti, ma la tua empatia fa di te qualcuno a cui si confidano i sentimenti.",
      "strengths": [
        "Empatia profonda",
        "Gentilezza aggraziata",
        "Occhio per la bellezza"
      ],
      "tips": [
        "I tuoi sentimenti contano quanto i loro: parla presto, anche piano.",
        "Ricarica le batterie con la natura o la musica dopo le giornate piene.",
        "Puoi dire «ho bisogno di un momento» senza spiegare."
      ]
    }
  }
};
