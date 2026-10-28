/* Test della fortuna di Capodanno (it) — stessa struttura di en.js.
 * L’anno arriva da newyear-core.js (YEAR), mai scritto a mano. L’ordine di questions[i].choices[j] è quello di en.js (punteggio).
 * Niente spoiler in meta / start / faq / loading / og.default*. Niente cifre né % nei risultati. Solo per gioco.
 */
const Y = require('../../newyear-core.js').YEAR;

module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap",
    "display": "'Lora'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": `Test della fortuna ${Y} – la tua parola dell’anno`,
    "description": `Fai il test della fortuna ${Y}: 11 domande veloci, circa 2 minuti, senza registrazione. Scopri la tua parola dell’anno, il colore, il mese e l’oggetto portafortuna. Solo per gioco.`,
    "ogTitle": `Test della fortuna ${Y} 🌅 Qual è la tua parola dell’anno?`,
    "ogDescription": `Undici domande leggere su come vorresti vivere il ${Y}. Scopri la tua parola dell’anno, il colore, il mese e l’oggetto portafortuna.`
  },
  "siteName": `Test della fortuna ${Y}`,
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": `🌅 Ciao, ${Y}`,
    "h1Kicker": `Test della fortuna ${Y}`,
    "h1Html": `Cosa ti porterà<br>il <em>${Y}</em>?`,
    "hook": "Un calendario nuovo, la prima alba e un anno intero di pagine bianche. Rispondi a undici domande leggere sul tuo modo di vivere e scopri la parola, i portafortuna e i piccoli auspici che ti aspettano nell’anno nuovo.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 domande",
    "start": "Inizia il test →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "Domanda {n}"
  },
  "loading": {
    "text": "Aspettando la prima alba…",
    "sub": "Sto scrivendo i tuoi auspici per l’anno nuovo"
  },
  "result": {
    "title": `La mia parola del ${Y}: {name}`,
    "metaDesc": `Risultato del test della fortuna ${Y}: {name}. {vibe} Scopri il tuo colore, mese e oggetto portafortuna e un auspicio leggero per l’anno.`,
    "eyebrow": `La tua parola per il ${Y}`,
    "colorLabel": "Colore portafortuna",
    "monthLabel": "Mese fortunato",
    "itemLabel": "Oggetto portafortuna",
    "gaugeLabel": "Dove pendono le tue risposte",
    "axes": [
      ["Novità", "Costanza"],
      ["In compagnia", "Tempo per me"],
      ["Pianificare", "Lasciarsi andare"]
    ],
    "fortuneLabel": "Il tuo anno in breve",
    "areas": {
      "work": "Lavoro e studio",
      "money": "Umore e soldi",
      "love": "Amore e amicizie",
      "self": "Cura di sé"
    },
    "tipLabel": "Un piccolo buon proposito da provare",
    "buddyLabel": "Gran sintonia",
    "rivalLabel": "Opposto amico",
    "disclaimer": "Solo per gioco. La tua parola, i portafortuna e gli auspici sono idee giocose per l’anno nuovo, non previsioni né consigli su salute, soldi o vita.",
    "sameShare": "Il {pct}% delle persone ha ottenuto questa parola",
    "shareText": `La mia parola del ${Y} è {name} {emoji} «{vibe}» E la tua?`,
    "ctaStrong": "Un amico ti ha condiviso la sua fortuna per l’anno nuovo",
    "ctaSub": `Cosa ti porterà il ${Y}? Scoprilo in 2 minuti.`,
    "retry": "Rifai il test"
  },
  "months": ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
  "og": {
    "eyebrow": `La mia parola per il ${Y}`,
    "brand": `🌅 Test della fortuna ${Y}`,
    "defaultKicker": "Un quiz leggero di Capodanno",
    "defaultTitle": `Cosa ti porterà il ${Y}?`,
    "defaultDesc": "11 domande · 2 minuti · portafortuna"
  },
  "faq": [
    {
      "q": "Come viene scelta la mia parola?",
      "a": "Ogni risposta sposta un po’ tre scale: provare cose nuove o mantenere il tuo ritmo, stare con gli altri o prenderti tempo per te, organizzare in anticipo o lasciarti andare. La tua parola è il punto in cui le tre si incontrano, e le stesse risposte danno sempre lo stesso risultato."
    },
    {
      "q": "È una vera previsione del mio anno?",
      "a": "No. La parola, il colore, il mese, l’oggetto portafortuna e i piccoli auspici sono idee per giocare, non previsioni. Nessuno può sapere come andrà un anno. Usa il risultato come un modo divertente per pensare a ciò che ti piacerebbe fare."
    },
    {
      "q": "Posso rifarlo e ottenere qualcos’altro?",
      "a": "Sì. Se rispondi in modo diverso, puoi arrivare a un’altra parola. Molti lo rifanno più avanti nell’anno, quando l’umore o i progetti sono cambiati."
    },
    {
      "q": "Le mie risposte vengono salvate?",
      "a": "No. Le risposte vengono calcolate nel tuo browser e non vengono conservate. Contiamo solo, in forma anonima, quale parola è uscita, per mostrare quanto è comune."
    }
  ],
  "privacy": {
    "title": `Informativa sulla privacy | Test della fortuna ${Y}`,
    "description": `Informativa sulla privacy del test della fortuna ${Y}: come usiamo cookie, pubblicità e statistiche anonime.`,
    "h1": "Informativa sulla privacy",
    "introHtml": "Il test della fortuna di Capodanno (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
    "sections": [
      [
        "1. Informazioni che raccogliamo",
        "Puoi usare il Servizio senza registrarti né effettuare l’accesso. Le tue risposte vengono calcolate nel browser e non vengono mai inviate né salvate sui nostri server. Contiamo solo, in forma anonima, quale risultato è uscito, per mostrare quanto è comune ciascun risultato."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare i cookie e la memoria locale del browser per ricordare la tua lingua, mostrare annunci e capire come viene usato il Servizio. Puoi rifiutarli o cancellarli dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare correttamente."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti web. Puoi saperne di più e modificare le impostazioni di personalizzazione degli annunci nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Conserviamo totali giornalieri anonimi (visualizzazioni, test completati, valutazioni) per migliorare il Servizio. Questi totali non ti identificano personalmente."
      ],
      [
        "5. Contatti",
        "Per qualsiasi domanda su questa Informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "6. Data di entrata in vigore",
        "La presente informativa è in vigore dal 29 ottobre 2026."
      ]
    ],
    "back": "← Torna al test della fortuna"
  },
  "questions": [
    {
      "q": "Mancano dieci minuti alla mezzanotte di Capodanno. Dove sei?",
      "choices": [
        "Sul divano con le tue persone preferite, stuzzichini in tavola e nessun programma",
        "Alla festa con il conto alla rovescia che hai organizzato per gli amici settimane fa",
        "A casa da solo, a scrivere i buoni propositi su un quaderno nuovo",
        "In un posto nuovo, in un viaggio last minute da solo, a guardare sconosciuti che festeggiano"
      ]
    },
    {
      "q": "Ti arriva un’agenda nuova di zecca per l’anno. Cosa scrivi nella prima pagina?",
      "choices": [
        "Una lista di cose divertenti da provare con gli amici. Le date possono aspettare",
        "Ancora niente. Ci scriverai quando ne avrai voglia",
        "I compleanni di tutti e i pranzi di famiglia, per prima cosa",
        "Un grande obiettivo personale, diviso mese per mese"
      ]
    },
    {
      "q": "La prima alba dell’anno. Come la accogli?",
      "choices": [
        "Sveglia puntata, una bevanda calda in mano, guardandola in silenzio dalla finestra",
        "Su un treno all’alba preso d’impulso, verso un posto dove non sei mai stato",
        "Guidando un gruppo in cima a una collina, con percorso e merenda già pianificati",
        "Ancora sveglio con gli amici dopo la festa, e la vedi per caso"
      ]
    },
    {
      "q": "Il tuo buon proposito per l’anno sarà molto probabilmente…",
      "choices": [
        "Imparare qualcosa di nuovo, con un calendario e un modo per seguire i progressi",
        "Chiamare o andare a trovare le persone care con regolarità",
        "Dire di sì a più inviti e vedere dove ti portano",
        "Niente grandi propositi. Solo essere un po’ più gentile con te stesso"
      ]
    },
    {
      "q": "Al lavoro o a scuola arriva un nuovo progetto. Tu…",
      "choices": [
        "Prendi la parte che nessuno ha mai provato e la capisci strada facendo",
        "Entri in un gruppo che ti piace e dai una mano dove serve",
        "Scegli la parte che conosci bene e la fai con cura per conto tuo",
        "Ti offri di coordinarlo e prepari un piano insieme a tutti"
      ]
    },
    {
      "q": "Ti arriva una piccola somma inaspettata, come un regalo o un piccolo extra.",
      "choices": [
        "La metti da parte per una rimpatriata già in programma o per i regali di famiglia",
        "Offri qualcosa di divertente agli amici, lì per lì",
        "La metti via e te ne dimentichi finché non serve",
        "La usi per un corso o per l’attrezzatura di qualcosa di nuovo che avevi in mente"
      ]
    },
    {
      "q": "Un weekend libero, niente in agenda. Cosa succede?",
      "choices": [
        "Organizzi una gita di un giorno per il gruppo in un posto che nessuno conosce",
        "Metti in ordine, prepari la settimana e ti godi la calma",
        "Giri da solo per un quartiere che non hai mai esplorato",
        "Scrivi agli amici «passate da me?» e lasci che la giornata vada da sé"
      ]
    },
    {
      "q": "Al cenone di Capodanno, accanto a te si siede qualcuno che non conosci.",
      "choices": [
        "Sorridi, chiacchieri del più e del meno e ti godi il cibo in pace",
        "Gli chiedi del suo lavoro. Magari c’è qualcosa da imparare per i tuoi obiettivi",
        "Lo presenti a tutti e proponi un gioco",
        "Ti assicuri che si senta a suo agio e lo inviti alla prossima serata"
      ]
    },
    {
      "q": "Dopo un periodo intenso ti senti un po’ scarico. Come ricarichi le energie?",
      "choices": [
        "Chiami un amico stretto e chiacchierate di tutto e di niente per ore",
        "Provi qualcosa di completamente nuovo d’impulso, solo per te",
        "Organizzi un weekend fuori con gli amici, itinerario compreso",
        "Ti riservi una serata tranquilla: a letto presto, un buon libro e una tisana"
      ]
    },
    {
      "q": "A metà anno bussa alla porta un’occasione inaspettata.",
      "choices": [
        "La valuti con attenzione, poi ci vai con un piano chiaro",
        "La lasci passare. Ti piace il ritmo che hai",
        "Ne parli con le persone più vicine prima di decidere",
        "Ti butti subito e porti con te un amico"
      ]
    },
    {
      "q": "Immagina il prossimo Capodanno. Cosa ti renderebbe più orgoglioso?",
      "choices": [
        "Un quaderno pieno di piccole abitudini che hai davvero mantenuto",
        "Un grande obiettivo raggiunto insieme a tutta la squadra",
        "Un anno pieno di momenti affettuosi con le persone che ami",
        "Un mucchio di storie su cose provate per la primissima volta"
      ]
    }
  ],
  "types": {
    "voyage": {
      "name": "La Grande Traversata",
      "word": "traversata",
      "vibe": "Tu tracci la rotta e il tuo equipaggio naviga felice con te.",
      "desc": "Questo potrebbe essere un anno per salpare. Ti attirano gli orizzonti nuovi, ma non lasci mai il porto senza una mappa e raramente viaggi da solo. Le persone si fidano dei tuoi piani perché pensi a tutti quelli a bordo. Quest’anno ti si addicono i grandi obiettivi condivisi: un progetto di squadra, un viaggio di gruppo, una sfida con gli amici. Tieni la rotta, ma goditi anche il panorama.",
      "keywords": ["Piani audaci", "Lavoro di squadra", "Nuovi orizzonti"],
      "color": "Blu oceano",
      "item": "Una cartina di carta di un posto che vuoi visitare",
      "fortune": {
        "work": "Un buon anno per iniziare qualcosa di più grande di ciò che faresti da solo. Il tuo talento nell’organizzare le persone potrebbe aprirti porte interessanti.",
        "money": "Mettere da parte per un obiettivo condiviso, come un viaggio o una festa, potrebbe motivarti più che risparmiare tanto per farlo.",
        "love": "Le persone si radunano intorno a te. Ricordati di chiedere al tuo equipaggio come sta, non solo come va il piano.",
        "self": "Programma il riposo come programmi tutto il resto. Anche i capitani hanno bisogno di una notte tranquilla in porto."
      },
      "tip": "Scrivi un’avventura che vuoi condividere con qualcuno quest’anno e scegliete insieme il mese."
    },
    "festival": {
      "name": "La Festa Luminosa",
      "word": "festa luminosa",
      "vibe": "Trasformi i giorni qualunque in piccole celebrazioni.",
      "desc": "Il tuo anno potrebbe somigliare a una lunga festa di paese con tanti piccoli palchi. Ami provare cose nuove e ami farlo insieme agli altri, possibilmente senza programmare troppo. La tua energia unisce le persone e trasforma un martedì grigio in una festa. Quest’anno la tua apertura potrebbe regalarti nuove amicizie e inviti inaspettati. Lascia solo un po’ di spazio in agenda per riprendere fiato.",
      "keywords": ["Allegro", "Socievole", "Spontaneo"],
      "color": "Corallo solare",
      "item": "Un mazzo di palloncini colorati",
      "fortune": {
        "work": "Le idee fresche arrivano facilmente quando ti confronti con gli altri. Un approccio giocoso potrebbe risolvere ciò che le facce serie non sono riuscite a sbloccare.",
        "money": "I bei momenti condivisi contano per te. Un salvadanaio per le uscite con gli amici potrebbe rendere felici sia il portafoglio sia l’umore.",
        "love": "La tua cerchia potrebbe allargarsi quest’anno. Qualcuno incontrato per caso potrebbe diventare un buon amico.",
        "self": "Bilancia le settimane piene con qualche serata lenta. La tua luce brilla di più quando sei riposato."
      },
      "tip": "Organizza una piccola festa senza alcun motivo e invita qualcuno che ti piacerebbe conoscere meglio."
    },
    "summit": {
      "name": "La Vetta Ambita",
      "word": "vetta",
      "vibe": "Un obiettivo chiaro, una salita costante, una grande vista in cima.",
      "desc": "Quest’anno somiglia a una montagna che hai scelto di scalare. Ti piacciono le sfide vere, ti piace prepararti bene e stai volentieri concentrato sul tuo percorso. Passo dopo passo potresti fare progressi visibili in qualcosa che ti sta a cuore: un’abilità, un progetto, un record personale. Non ti serve un pubblico, ma la vista dall’alto varrà la pena di essere condivisa. Festeggia ogni piccolo campo base lungo la strada.",
      "keywords": ["Concentrato", "Determinato", "Ben preparato"],
      "color": "Verde pino",
      "item": "Un paio di scarpe da ginnastica comode",
      "fortune": {
        "work": "La concentrazione è il tuo punto di forza. Un progetto a lungo termine o una nuova abilità potrebbero crescere con costanza grazie al tuo impegno paziente.",
        "money": "Anche qui gli obiettivi chiari ti aiutano. Sapere per cosa stai mettendo da parte può rendere più facili le piccole scelte.",
        "love": "Forse sarai preso dalla tua salita, quindi un breve messaggio a un vecchio amico potrebbe valere più di quanto pensi.",
        "self": "I giorni di riposo fanno parte di ogni buona scalata. Pianificali con la stessa serietà dei giorni di allenamento."
      },
      "tip": "Scegli un obiettivo per l’anno e segna sul calendario tre piccole tappe intermedie."
    },
    "adventure": {
      "name": "La Strada Aperta",
      "word": "strada aperta",
      "vibe": "Niente mappa, nessun problema. Ogni curva è una storia nuova.",
      "desc": "Il tuo anno potrebbe sembrare un viaggio on the road senza meta fissa. Segui la curiosità, ti godi la tua stessa compagnia e cambi volentieri direzione quando spunta qualcosa di interessante. Questa libertà ti porta in luoghi e idee che altri non notano. Potrebbe essere un anno di prime volte: una città nuova, un hobby nuovo, un nuovo modo di vedere le cose. Tieni a portata di mano un taccuino, perché vorrai ricordare le deviazioni.",
      "keywords": ["Curioso", "Spirito libero", "Indipendente"],
      "color": "Arancio tramonto",
      "item": "Uno zaino leggero",
      "fortune": {
        "work": "I percorsi insoliti potrebbero fare per te. Provare un metodo che nessuno ha ancora usato potrebbe portarti alle idee migliori.",
        "money": "Per te le esperienze contano più delle cose. Un piccolo salvadanaio per i viaggi potrebbe trasformare i desideri in partenze vere.",
        "love": "Lungo la strada incontri persone interessanti. Lascia che qualcuna resti nella tua storia per più di un capitolo.",
        "self": "La tua libertà è la tua energia. Assicurati di avere anche un posto accogliente in cui tornare."
      },
      "tip": "Prova una cosa completamente nuova a ogni stagione e scrivi una sola riga su come ti sei sentito."
    },
    "nest": {
      "name": "Il Nido Caldo",
      "word": "nido caldo",
      "vibe": "Costruisci una casa in cui tutti si sentono i benvenuti.",
      "desc": "Quest’anno potrebbe ruotare intorno al costruire qualcosa di caldo e duraturo. Ti piace un ritmo stabile, tieni molto alle persone che hai intorno e ti prepari con cura perché tutti si sentano accolti. La tua casa, la tua squadra o il tuo gruppo di amici potrebbero diventare il posto dove tutti amano ritrovarsi. Le piccole tradizioni che inizi quest’anno, come una cena al mese o un album di foto condiviso, potrebbero durare a lungo.",
      "keywords": ["Premuroso", "Affidabile", "Attento"],
      "color": "Beige caldo",
      "item": "Una candela dal profumo delicato",
      "fortune": {
        "work": "Gli altri contano sulla tua mano ferma. Organizzare e sostenere gli altri potrebbe essere il campo in cui brilli di più.",
        "money": "Organizzarti per stare comodo ti si addice. Mettere da parte qualcosa per i momenti condivisi a casa potrebbe darti una bella soddisfazione.",
        "love": "I tuoi legami potrebbero diventare più profondi più che più numerosi. Una lunga chiacchierata potrebbe contare più di una grande festa.",
        "self": "Ti prendi cura di tutti, quindi lascia che qualcuno si prenda cura anche di te. Va benissimo accettare un aiuto."
      },
      "tip": "Inizia una piccola tradizione con le persone che ami, come un pranzo al mese o una foto ogni anno."
    },
    "bond": {
      "name": "Il Cerchio Affiatato",
      "word": "cerchio affiatato",
      "vibe": "I momenti più belli del tuo anno avranno volti familiari.",
      "desc": "Il tuo anno potrebbe colorarsi di buona compagnia. Ti piace un ritmo rilassato, sai ascoltare e lasci che i programmi nascano in modo naturale con le persone a cui vuoi bene. Gli amici stanno bene con te, e vecchi legami potrebbero tornare in modi bellissimi. Potrebbe essere un anno di lunghe chiacchierate, tavolate e risate che ricorderai ancora il prossimo inverno. Tieni aperti la porta e il cuore.",
      "keywords": ["Affettuoso", "Alla mano", "Leale"],
      "color": "Rosa ciliegia",
      "item": "Un mazzetto di biglietti scritti a mano",
      "fortune": {
        "work": "Un buon rapporto con colleghi o compagni di corso potrebbe rendere tutto più semplice. La tua gentilezza è una vera forza.",
        "money": "Condividere ti fa stare meglio che possedere. Un piccolo pensiero fatto col cuore potrebbe dare più gioia di un grande acquisto.",
        "love": "Una vecchia amicizia potrebbe rifiorire, o una nuova potrebbe sembrare di lunga data.",
        "self": "Stare con gli altri ti ricarica, ma i momenti di quiete ti aiutano anche ad ascoltare i tuoi desideri."
      },
      "tip": "Ogni mese manda un biglietto scritto a mano a qualcuno che ti ha reso la vita più luminosa."
    },
    "seed": {
      "name": "Il Seme Paziente",
      "word": "seme paziente",
      "vibe": "Piccoli passi ogni giorno, e qualcosa di bello cresce.",
      "desc": "Questo potrebbe essere un anno di crescita silenziosa. Preferisci un ritmo regolare, ami i tuoi spazi e ti piace pianificare passi piccoli e sensati. Niente di appariscente, ma il prossimo inverno potresti stupirti di quanto è cresciuto: un’abitudine che è rimasta, un’abilità che è sbocciata, una routine più serena. La pazienza è il tuo superpotere segreto quest’anno. Annaffia i tuoi semi un pochino ogni giorno.",
      "keywords": ["Paziente", "Costante", "Sereno"],
      "color": "Menta fresca",
      "item": "Un quadernino delle abitudini",
      "fortune": {
        "work": "Quest’anno la costanza potrebbe battere la velocità. I piccoli progressi quotidiani potrebbero sommarsi in qualcosa di cui andare fiero.",
        "money": "Le routine gentili fanno per te, come un semplice sguardo mensile alle tue spese.",
        "love": "Forse non avrai la cerchia più grande, ma chi ne fa parte saprà di poter contare su di te.",
        "self": "Una routine semplice, un angolo in ordine e andare a letto presto potrebbero bastarti per sentirti al meglio."
      },
      "tip": "Scegli una minuscola abitudine quotidiana, così piccola da riuscirci anche nel giorno più pigro."
    },
    "pause": {
      "name": "La Pausa Gentile",
      "word": "pausa gentile",
      "vibe": "Un anno più lento, un cuore più morbido e spazio per respirare.",
      "desc": "Il tuo anno potrebbe essere all’insegna del rallentare, nel modo migliore. Ti piace un ritmo calmo, dai valore al tempo per te e lasci volentieri che la vita scorra senza forzarla. Non significa non fare niente: è lo spazio in cui le idee nuove arrivano in silenzio. Potrebbe essere un anno per godersi i piaceri semplici, un buon libro, una lunga passeggiata, una serata accogliente, e per accorgersi di ciò che ti rende davvero felice.",
      "keywords": ["Sereno", "Riflessivo", "Delicato"],
      "color": "Lavanda",
      "item": "Una sciarpa morbida e calda",
      "fortune": {
        "work": "Una mente calma vede chiaro. Prenderti un momento prima di decidere potrebbe aiutarti a scegliere la strada giusta.",
        "money": "Le gioie semplici costano poco. Potresti scoprire che le cose che ami di più sono già a portata di mano.",
        "love": "La compagnia tranquilla ti si addice. Uno o due amici stretti potrebbero bastare a riempire il tuo anno.",
        "self": "Questo è il tuo anno per riposare senza sensi di colpa. Mattine lente e serate tranquille sono ben meritate."
      },
      "tip": "Tieni una sera a settimana completamente libera, solo per fare ciò che ti va."
    }
  }
};
