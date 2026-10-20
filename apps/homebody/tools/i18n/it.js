/* 집순이·집돌이 지수 테스트 — it
 * questions[i].choices[j] 는 homebody-core.js QUESTIONS[i].choices[j] 와 같은 순서(점수는 core 에만 있다). 키 구조는 en.js 와 동일.
 * Keys ending in Html are raw HTML (start.h1Html: <br> 1개 + <em> 만). 결과 단계 6종 id 는 homebody-core.js ORDER 와 같다.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep as-is when translating.
 * 스포일러 금지: meta / og.default* / start / faq / loading 에는 결과 이름·질문 문구를 인용하지 않는다.
 * fonts: css = Google Fonts, display = 제목/버튼 글꼴 스택, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap",
    "display": "'Comfortaa'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test da pantofolaio – Quanto sei casalingo?",
    "description": "Sei un pantofolaio? Fai questo test da pantofolaio gratis: 10 situazioni di tutti i giorni, circa 1 minuto, senza registrazione. Scopri la tua percentuale di pantofolaio e quanto ami il divano.",
    "ogTitle": "Test da pantofolaio 🏠 Quanto sei casalingo?",
    "ogDescription": "Un test gratuito di 1 minuto. Rispondi a 10 situazioni quotidiane e scopri la tua percentuale."
  },
  "siteName": "Test da pantofolaio",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "🏠 Indice di pantofolaio",
    "h1Kicker": "Test da pantofolaio",
    "h1Html": "Quanto sei<br><em>pantofolaio</em>?",
    "hook": "Dieci piccole situazioni ti dicono quanto ami casa tua e quanto deve impegnarsi il mondo là fuori.",
    "metaTime": "⏱️ Circa 1 minuto",
    "metaCount": "🛋️ 10 domande",
    "start": "Scopri il mio livello →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "D{n}"
  },
  "loading": {
    "text": "Conto i tuoi punti comfort…",
    "sub": "Controllo il divano"
  },
  "result": {
    "title": "Test da pantofolaio: sono {name}",
    "eyebrow": "Il tuo profilo da pantofolaio è",
    "strengthsLabel": "I tuoi superpoteri",
    "othersLabel": "Come ti vedono gli altri",
    "bestLabel": "Coppia ideale",
    "clashLabel": "Profilo opposto",
    "meterLabel": "Livello di pantofolaio",
    "moreShare": "Il {pct}% dei giocatori è più pantofolaio di te",
    "shareText": "Sono {name} {emoji} — «{vibe}» E tu, quanto sei pantofolaio?",
    "shareTextPct": "Sono pantofolaio al {pct}%: {name} {emoji}. E tu?",
    "ctaStrong": "Un amico ha condiviso il suo risultato",
    "ctaSub": "Quanto sei pantofolaio? Ci vuole 1 minuto.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "Il mio livello di pantofolaio",
    "brand": "🏠 Test da pantofolaio",
    "defaultKicker": "Test da pantofolaio",
    "defaultTitle": "Quanto sei pantofolaio?",
    "defaultDesc": "10 situazioni quotidiane · circa 1 minuto"
  },
  "faq": [
    {
      "q": "Come si calcola la mia percentuale di pantofolaio?",
      "a": "Ogni risposta vale da 0 a 10 punti verso il lato casa. I punti delle tue dieci risposte vengono sommati e portati su una scala da 0 a 100: più la percentuale è alta, più tendi a restare dentro."
    },
    {
      "q": "Pantofolaio e introverso sono la stessa cosa?",
      "a": "Non proprio. L’introversione riguarda da dove prendi energia, essere pantofolaio riguarda dove ti piace passare il tempo. Molti estroversi adorano il divano e molti introversi adorano le lunghe passeggiate."
    },
    {
      "q": "Questo test è scientifico?",
      "a": "No. È un quiz leggero per divertirsi e fare conversazione, non una valutazione psicologica. Il risultato riflette solo le tue risposte di oggi."
    },
    {
      "q": "Come si calcola «più pantofolaio del X% dei giocatori»?",
      "a": "Contiamo in forma anonima in quale fascia di punteggio finisce ogni test completato. Quando ci sono almeno 20 risultati, confrontiamo il tuo con gli altri. La riga compare solo sul tuo risultato e resta nascosta finché non ci sono abbastanza giocatori."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Test da pantofolaio",
    "description": "Informativa sulla privacy del Test da pantofolaio: cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il Test da pantofolaio (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Puoi usare il Servizio senza registrarti né accedere. Le tue risposte vengono calcolate nel browser e non vengono mai inviate né salvate sui nostri server. Contiamo solo, in forma anonima, quale fascia di punteggio è uscita, per mostrare quanto è comune ogni risultato."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e l’archiviazione locale del browser per ricordare la lingua, mostrare pubblicità e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare correttamente."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e impostazioni nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Conserviamo totali giornalieri anonimi (visualizzazioni, test completati, valutazioni) per migliorare il Servizio. Non permettono di identificarti."
      ],
      [
        "5. Contatti",
        "Per domande su questa informativa, contatta il gestore del sito."
      ],
      [
        "6. Data di validità",
        "Questa informativa è valida dal 21 ottobre 2026."
      ]
    ],
    "back": "← Torna al test da pantofolaio"
  },
  "questions": [
    {
      "q": "Venerdì sera, la chat di gruppo si accende: «Aperitivo in centro?»",
      "choices": [
        "Rispondere «magari la prossima» e tornare a casa felice",
        "Andare un’ora e poi svignarsela",
        "Controproporre: a casa di qualcuno con cibo d’asporto",
        "Andare e restare fino alla chiusura"
      ]
    },
    {
      "q": "Un lungo weekend senza programmi. Il tuo piano ideale?",
      "choices": [
        "Fare la valigia e partire all’improvviso",
        "Non uscire di casa di proposito",
        "Una gita in giornata e poi di nuovo nel mio letto",
        "Un bar o un parco vicino, poi a casa"
      ]
    },
    {
      "q": "Suona il campanello e non aspettavi nessuno. Tu…",
      "choices": [
        "Apri, un po’ sorpreso",
        "Guardi prima dallo spioncino",
        "Ne sei felice: le visite a sorpresa sono il massimo",
        "Resti immobile finché non se ne vanno"
      ]
    },
    {
      "q": "Dove ti piacerebbe vivere di più?",
      "choices": [
        "In una casa tranquilla con il mio angolino",
        "Nel cuore di una città vivace",
        "In un nido dove tutto è a portata di mano",
        "In un appartamento con un bel balcone vicino al movimento"
      ]
    },
    {
      "q": "È una domenica di pioggia. Qual è il tuo primo pensiero?",
      "choices": [
        "Il tempo migliore: coperta, tè, finestra",
        "Uffa, addio a tutti i miei programmi",
        "Finalmente una scusa perfetta per restare in casa",
        "Va bene, cerco qualcosa da fare al chiuso"
      ]
    },
    {
      "q": "Un amico ti invita a un evento tra due settimane.",
      "choices": [
        "Prima guardo l’agenda",
        "Inizio già a pensare come disdire con garbo",
        "Ci sono!",
        "Dico di sì e poi ci penso con ansia man mano che si avvicina"
      ]
    },
    {
      "q": "Torni a casa dopo un’intera giornata fuori. Ti senti…",
      "choices": [
        "Pieno di energia, pronto a continuare",
        "Piacevolmente stanco",
        "Finalmente: porta chiusa, telefono in silenzioso",
        "Sollevato, come una batteria che si ricarica"
      ]
    },
    {
      "q": "È l’ora di cena. Dove vuoi essere?",
      "choices": [
        "A cucinare a casa",
        "Fuori, ma in un localino tranquillo",
        "In un ristorante animato pieno di gente",
        "Sul divano con la consegna a domicilio e una serie"
      ]
    },
    {
      "q": "Quanti giorni di fila puoi restare a casa senza impazzire?",
      "choices": [
        "Basta un giorno",
        "Settimane, senza accorgermene",
        "Circa tre giorni",
        "Una settimana, tranquillamente"
      ]
    },
    {
      "q": "Hai un po’ di soldi extra. Dove li spendi?",
      "choices": [
        "Una serata con gli amici",
        "Biglietti e viaggi",
        "Gadget, giochi o streaming per il divano",
        "Più comfort: una bella poltrona, una lampada, la biancheria"
      ]
    }
  ],
  "types": {
    "wild": {
      "name": "Nato per stare fuori",
      "vibe": "Casa è dove lasci lo zaino prima di uscire di nuovo.",
      "desc": "Per te la porta di casa è una porta girevole. Una giornata dentro sembra sprecata e le tue idee migliori arrivano su un sentiero, in treno o su una terrazza. Ti ricarichi con la gente e l’aria aperta, e collezioni programmi come altri collezionano tazze. La tua casa è soprattutto un posto per dormire, farsi la doccia e cambiare le scarpe.",
      "strengths": [
        "Energia infinita",
        "Dice sì all’avventura",
        "Non si annoia mai"
      ],
      "others": "Gli altri ti vedono come quello che ha sempre un programma e riesce a staccare tutti dal divano."
    },
    "roamer": {
      "name": "Girovago del weekend",
      "vibe": "Più fuori che dentro, ma ami un bel pisolino.",
      "desc": "Ami uscire, soprattutto con gli amici, ma conosci anche la gioia di una serata che finisce presto. La tua settimana è piena di programmi e una sera tranquilla a casa è un premio, non un’abitudine. Ti piace la varietà: un bar nuovo, una gita breve, una strada che non hai ancora percorso.",
      "strengths": [
        "Socievole e curioso",
        "Programmi flessibili",
        "Bravo a iniziare"
      ],
      "others": "Gli altri ti vedono come simpatico e vivace, sempre pronto per un caffè, ma ogni tanto sparisci per ricaricarti."
    },
    "switch": {
      "name": "Equilibrista delle serate",
      "vibe": "Metà divano, metà città, sempre adattabile.",
      "desc": "Ti godi una serata rumorosa fuori e una silenziosa a casa con lo stesso sorriso. Nessuna è un sacrificio: leggi la tua energia del giorno e la segui. Questo ti rende una buona compagnia sia per gli amici sempre in giro sia per i pantofolai. Il tuo unico dilemma è scegliere quale lato ascoltare il venerdì.",
      "strengths": [
        "Si adatta a ogni programma",
        "Legge la propria energia",
        "Buona compagnia"
      ],
      "others": "Gli altri ti vedono come tranquillo e difficile da inquadrare, l’amico che va bene per ogni programma."
    },
    "nester": {
      "name": "Nido accogliente",
      "vibe": "Felice con una coperta, una lampada e il piano di restare.",
      "desc": "A casa sei più te stesso. L’hai resa comoda di proposito: la luce giusta, la poltrona giusta, gli snack giusti. Esci per le persone importanti, ma tieni le serate brevi e l’uscita vicina. Il tuo evento ideale ha un orario di inizio, uno di fine e un divano nei paraggi.",
      "strengths": [
        "Rende accogliente ogni spazio",
        "Usa l’energia con saggezza",
        "Ottimo padrone di casa"
      ],
      "others": "Gli altri ti vedono come caloroso e calmo, l’amico a casa del quale tutti vogliono stare."
    },
    "homebody": {
      "name": "Pantofolaio certificato",
      "vibe": "I tuoi programmi migliori sono quelli che disdici.",
      "desc": "Ami davvero stare a casa e hai smesso di scusarti. Il tuo spazio è insieme stazione di ricarica, stanza degli hobby e rifugio. Gli inviti ricevono una pausa educata prima della risposta, e un weekend senza impegni è un regalo. Non sei antisociale: scegli le uscite con cura.",
      "strengths": [
        "Felice da solo",
        "Mondo interiore ricco",
        "Protegge la tua pace"
      ],
      "others": "Gli altri ti vedono come calmo, un po’ misterioso e sorprendentemente divertente quando sei nel tuo elemento."
    },
    "legend": {
      "name": "Leggenda di casa",
      "vibe": "La porta è un suggerimento. Il divano è un regno.",
      "desc": "Hai trasformato lo stare in casa in un’arte. Le app di consegna ti conoscono per nome, la tua postazione è ottimizzata e la batteria sociale si ricarica nel silenzio. Puoi passare giorni senza pensare al mondo esterno ed essere perfettamente sereno. Quando esci, è per qualcosa che vale davvero, e il ritorno lo pianifichi prima di partire.",
      "strengths": [
        "Maestro del comfort",
        "Totalmente autosufficiente",
        "Zero FOMO"
      ],
      "others": "Gli altri ti vedono come una leggenda: raramente avvistato, sempre in pace e la persona a cui chiedere una bella serie."
    }
  }
};
