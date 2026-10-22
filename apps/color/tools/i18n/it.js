/* Personal Color Test (it)
 * 8 result ids (springlight springbright summerlight summermute autumnmute autumndeep winterbright winterdeep);
 * questions[i].choices[j] follow color-core.js QUESTIONS[i].w[j] (the [warm/cool, light/deep, bright/muted] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result name as people would search it — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the real server share. Swatch colors live in color-core.js.
 * A fun self-check, not a professional draping analysis (result disclaimer, FAQ, guide).
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {"css":"https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap","display":"'Playfair Display'","displayWeight":700,"sans":"","wordBreak":"normal","hyphens":"manual"},
  "meta": {
    "title": "Test di armocromia: scopri la tua stagione",
    "description": "Fai il test di armocromia: 12 domande da verificare allo specchio, circa 2 minuti, senza foto e senza registrazione. Scopri la tua palette. Solo per divertimento.",
    "ogTitle": "Test di armocromia 🎨 Quali colori ti illuminano il viso?",
    "ogDescription": "Un test di armocromia sulle stagioni con 12 domande allo specchio. Scopri il tuo sottotono e le tinte che ti valorizzano."
  },
  "siteName": "Test di armocromia",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "🎨 Test allo specchio",
    "h1Kicker": "Test di armocromia",
    "h1Html": "Quali colori fanno<br><em>brillare</em> il tuo viso?",
    "hook": "Prendi uno specchio e mettiti alla luce del giorno. Rispondi a 12 domande veloci su pelle, capelli, occhi e sui colori per cui ricevi complimenti, e scopri la tua palette di stagione.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🪞 12 domande",
    "start": "Scopri i colori →"
  },
  "quiz": {
    "backAria": "Domanda precedente",
    "progressAria": "Avanzamento",
    "qLabel": "D{n}"
  },
  "loading": {
    "text": "Sto mescolando la tua palette…",
    "sub": "Metto ogni tinta controluce"
  },
  "result": {
    "title": "La mia armocromia: {name}",
    "metaDesc": "Risultato del test di armocromia: {name}. {vibe} Scopri i colori migliori, quelli da dosare e i consigli su trucco, capelli e gioielli.",
    "eyebrow": "La tua stagione è",
    "gaugeLabel": "Dove si sono orientate le risposte",
    "axes": [
      ["Caldo", "Freddo"],
      ["Chiaro", "Scuro"],
      ["Brillante", "Spento"]
    ],
    "paletteLabel": "I tuoi colori migliori",
    "avoidLabel": "Colori da dosare",
    "avoidNote": "Non sono vietati, sono solo più difficili da portare vicino al viso. Tienili per scarpe, borse o pantaloni.",
    "makeupLabel": "Trucco",
    "hairLabel": "Colore dei capelli",
    "jewelryLabel": "Gioielli",
    "disclaimer": "Un autotest per divertirsi, non un'analisi armocromatica professionale. Il vero draping usa tessuti sotto una luce controllata, e illuminazione, schermi e trucco cambiano il modo in cui vediamo i colori.",
    "sameShare": "Il {pct}% delle persone ha ottenuto questa palette",
    "shareText": "La mia armocromia: {name} {emoji} «{vibe}» E la tua?",
    "ctaStrong": "Qualcuno ti ha condiviso i suoi colori",
    "ctaSub": "Caldo o freddo? Scoprilo in 2 minuti.",
    "retry": "Rifai il test"
  },
  "og": {
    "eyebrow": "La mia armocromia",
    "brand": "🎨 Test di armocromia",
    "defaultKicker": "Test di armocromia sulle stagioni",
    "defaultTitle": "Quali colori ti illuminano il viso?",
    "defaultDesc": "12 domande allo specchio · 2 minuti"
  },
  "faq": [
    {
      "q": "Come fa il test a capire quali sono i miei colori?",
      "a": "Ogni risposta sposta un po' tre scale: sottotono caldo o freddo, chiaro o scuro, brillante o spento. Il risultato è la palette di stagione dove le tre scale si incontrano. Le stesse risposte danno sempre lo stesso risultato."
    },
    {
      "q": "È preciso come un'analisi di armocromia con una consulente?",
      "a": "No. È un autotest per divertirsi, basato su ciò che puoi vedere allo specchio. Un'analisi professionale confronta i drappi di tessuto sul viso sotto una luce neutra, cosa che un quiz non può fare. Prendi il risultato come un punto di partenza per sperimentare."
    },
    {
      "q": "Come posso ottenere una risposta più affidabile?",
      "a": "Rispondi alla luce naturale vicino a una finestra, con il viso struccato e i capelli raccolti. Le lampadine, i filtri del telefono e i capelli tinti possono far sembrare i colori più caldi o più freddi di quanto siano davvero."
    },
    {
      "q": "Le mie risposte o le mie foto vengono salvate?",
      "a": "Il test non chiede mai una foto. Le risposte vengono calcolate nel tuo browser e non vengono salvate. Contiamo solo, in forma anonima, quale risultato è uscito, per mostrarti quanto è comune."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Test di armocromia",
    "description": "Informativa sulla privacy del Test di armocromia: come usiamo cookie, pubblicità e statistiche anonime.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Test di armocromia (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.",
    "sections": [
      [
        "1. Informazioni che raccogliamo",
        "Puoi usare il Servizio senza registrarti né accedere, e non ti viene mai chiesta una foto. Le tue risposte vengono calcolate nel browser e non vengono mai inviate né salvate sui nostri server. Contiamo solo, in forma anonima, quale risultato è uscito, per mostrare quanto è comune ciascun risultato."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la tua lingua, mostrare annunci e capire come viene usato il Servizio. Puoi rifiutarli o cancellarli dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare correttamente."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci basati sulle tue visite precedenti a questo e ad altri siti web. Puoi saperne di più e modificare la personalizzazione degli annunci nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
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
        "La presente informativa è in vigore dal 23 ottobre 2026."
      ]
    ],
    "back": "← Torna al Test di armocromia"
  },
  "questions": [
    {
      "q": "Alla luce del giorno, guarda le vene all'interno del polso. Di che colore sono?",
      "choices": [
        "Soprattutto blu o viola",
        "Soprattutto verdi o oliva",
        "Un mix di entrambi, difficile dirlo"
      ]
    },
    {
      "q": "Con quali gioielli la tua pelle sta meglio?",
      "choices": [
        "Oro giallo",
        "Argento o platino",
        "Oro rosa o metallo satinato e delicato",
        "Pezzi vistosi e lucidi, di qualsiasi metallo"
      ]
    },
    {
      "q": "Dopo un'ora al sole senza protezione, di solito la tua pelle…",
      "choices": [
        "Si arrossa, si scotta e si abbronza a malapena",
        "Prima si scotta un po', poi si abbronza leggermente",
        "Diventa dorata e si abbronza facilmente",
        "Si scotta di rado e si scurisce un po'"
      ]
    },
    {
      "q": "Metti sotto il mento una maglia bianco ottico e una avorio o panna. Quale ti sta meglio?",
      "choices": [
        "Il bianco ottico. Il viso sembra fresco e luminoso",
        "Avorio o panna. Il bianco su di me è troppo duro",
        "Sinceramente, non vedo differenza"
      ]
    },
    {
      "q": "Quale colore scuro di base ti sta meglio vicino al viso?",
      "choices": [
        "Nero corvino. Netto e d'impatto",
        "Marrone cioccolato o cammello",
        "Antracite morbido o blu navy. Il nero mi appesantisce",
        "Nessuno: mi stanno meglio panna o beige chiaro"
      ]
    },
    {
      "q": "Qual è il tuo colore di capelli naturale (o com'era da bambino o bambina)?",
      "choices": [
        "Molto scuro, quasi nero",
        "Castano medio o scuro con riflessi ramati o dorati",
        "Castano cenere tenue o castano spento",
        "Chiaro: castano dorato, biondo fragola o biondo"
      ]
    },
    {
      "q": "Come descriveresti i tuoi occhi?",
      "choices": [
        "Scuri e intensi, con il bianco molto limpido",
        "Nocciola caldo, ambra o castano dorato",
        "Grigio-marrone o grigio-verde tenue, dalle sfumature morbide",
        "Chiari e luminosi, con un anello esterno netto"
      ]
    },
    {
      "q": "Con quali colori di vestiti ricevi più complimenti?",
      "choices": [
        "Colori accesi come il blu cobalto o il rosa shocking",
        "Tinte polverose e delicate come il rosa antico o il verde salvia",
        "Pastelli chiari e leggeri",
        "Tinte ricche e profonde come il bordeaux o il verde bosco"
      ]
    },
    {
      "q": "Quanto è forte il contrasto tra i tuoi capelli e la tua pelle?",
      "choices": [
        "Alto. I capelli risaltano nettamente sulla pelle",
        "Una via di mezzo",
        "Basso e chiaro. Entrambi sono tenui e pallidi",
        "Basso e scuro. Entrambi sono intensi e di tono simile"
      ]
    },
    {
      "q": "Senza trucco, labbra e guance appaiono…",
      "choices": [
        "Rosa rosato",
        "Pesca o corallo",
        "Pallide e beige, con poco colore",
        "Naturalmente intense, quasi color frutti di bosco"
      ]
    },
    {
      "q": "Quale blush ti sta in modo più naturale?",
      "choices": [
        "Pesca o corallo",
        "Rosa confetto o rosa antico",
        "Terracotta o mattone tenue",
        "Frutti di bosco o prugna"
      ]
    },
    {
      "q": "Quale atmosfera ti somiglia di più allo specchio?",
      "choices": [
        "Solare e fresca, come una limonata a un picnic",
        "Leggera e delicata, come lavanda nella nebbia del mattino",
        "Avvolgente e ricca, come un tè speziato davanti al camino",
        "Netta e drammatica, come le luci della città di notte"
      ]
    }
  ],
  "types": {
    "springlight": {
      "name": "Primavera Light",
      "word": "primavera light",
      "vibe": "Calda, delicata e piena di luce del mattino.",
      "desc": "I tuoi colori sono caldi ma delicati, con un tenue bagliore dorato e pochissimo contrasto. Le tinte chiare, limpide e leggermente calde rendono la pelle fresca e riposata, mentre i colori pesanti o molto scuri ti stanno addosso invece di accompagnarti. Pensa a pesca, giallo burro, acquamarina chiaro e rosa caldo: colori che sembrano mescolati con il sole.",
      "keywords": ["Calda", "Chiara", "Fresca"],
      "makeup": "Blush pesca o albicocca, un rossetto corallo o rosa caldo trasparente ed eyeliner marrone tenue o bronzo al posto del nero.",
      "hair": "Biondo dorato, miele o castano caramello chiaro. Evita i toni molto scuri o cenere che ombreggiano il viso.",
      "jewelry": "Oro giallo chiaro, oro rosa e pezzi delicati. Le perle color panna calda ti stanno benissimo."
    },
    "springbright": {
      "name": "Primavera Bright",
      "word": "primavera bright",
      "vibe": "Calda, limpida e piena di brio.",
      "desc": "I tuoi colori sono caldi con una qualità vivace e limpida, spesso con occhi luminosi e un contrasto fresco. I colori saturi e solari ti risvegliano il viso, mentre le tinte polverose o ingrigite possono darti un'aria stanca. Corallo, mandarino, giallo girasole, turchese e verde prato sono il tuo campo da gioco. Puoi portare il colore in dosi generose e sembrare sempre tu.",
      "keywords": ["Calda", "Limpida", "Vivace"],
      "makeup": "Rossetto corallo o rosso caldo, un blush pesca brillante e un tocco di luce. Un eyeliner marrone caldo o verde petrolio dà carattere.",
      "hair": "Castano dorato caldo, ramato o castano brillante. I riflessi caldi e lucenti ti valorizzano più dei colori piatti e cenere.",
      "jewelry": "Oro giallo lucido, smalti colorati e pietre vivaci. Le finiture lucide battono quelle opache."
    },
    "summerlight": {
      "name": "Estate Light",
      "word": "estate light",
      "vibe": "Fresca, morbida e leggera come un cielo terso.",
      "desc": "I tuoi colori sono chiari e freddi, con un sottotono rosato o neutro e un aspetto d'insieme morbido. I pastelli freddi e i mezzitoni delicati rendono la pelle liscia e luminosa, mentre i colori molto scuri, molto caldi o fluo possono sovrastarti. Azzurro polvere, lavanda, rosa tenue e menta sono vittorie facili. Pensa a colori con un po' di bianco e un po' di blu mescolati dentro.",
      "keywords": ["Fredda", "Chiara", "Morbida"],
      "makeup": "Blush rosa o rosa confetto, un rossetto rosa o malva trasparente ed eyeliner tortora o grigio tenue.",
      "hair": "Biondo cenere, castano cenere chiaro o biondo beige tenue. I toni troppo dorati o aranciati possono stonare con la pelle.",
      "jewelry": "Argento, oro bianco e platino, con perle, pietra di luna o pietre azzurro pallido."
    },
    "summermute": {
      "name": "Estate Soft",
      "word": "estate soft",
      "vibe": "Fredda, calma e discretamente elegante.",
      "desc": "I tuoi colori vanno dal freddo al neutro e sono sfumati in modo naturale, con poco contrasto tra capelli, pelle e occhi. Le tinte polverose e ingrigite ti danno un'aria curata e serena, mentre i colori molto accesi o molto caldi possono risultare chiassosi vicino al viso. Malva, rosa antico, blu ardesia, salvia e prugna tenue sono la tua firma. I look tono su tono ti stanno particolarmente raffinati.",
      "keywords": ["Fredda", "Spenta", "Calma"],
      "makeup": "Rossetto rosa antico o malva, blush rosa tenue ed eyeliner grigio-marrone o prugna per definire con dolcezza.",
      "hair": "Castano cenere, castano fungo freddo o biondo cenere tenue. Evita il dorato ottonato o il nero molto duro.",
      "jewelry": "Argento satinato, oro bianco e peltro tenue. Le finiture opache e le perle grigie ti rispecchiano."
    },
    "autumnmute": {
      "name": "Autunno Soft",
      "word": "autunno soft",
      "vibe": "Calda, dolce e delicatamente dorata.",
      "desc": "I tuoi colori sono caldi e sfumati, con una morbidezza terrosa e poco contrasto. Le tinte calde e spente ti stanno in modo naturale e raffinato, mentre i colori ghiaccio o molto accesi possono spegnerti. Cammello, oliva, terracotta tenue, tortora caldo e verde muschio sono i tuoi migliori alleati. Sovrapporre diversi neutri caldi e delicati è uno dei tuoi superpoteri.",
      "keywords": ["Calda", "Spenta", "Terrosa"],
      "makeup": "Rossetto nude pesca o mattone tenue, blush terracotta caldo ed eyeliner marrone o kaki.",
      "hair": "Castano dorato tenue, beige caldo o caramello spento. Evita il cenere freddo o il nero blu che smorzano il tuo calore.",
      "jewelry": "Oro opaco o satinato, bronzo e legno, con pietre calde come ambra o occhio di tigre."
    },
    "autumndeep": {
      "name": "Autunno Deep",
      "word": "autunno deep",
      "vibe": "Calda, ricca e piena di profondità.",
      "desc": "I tuoi colori sono caldi e davvero profondi, spesso con capelli o occhi scuri e un sottotono dorato o olivastro. I toni terra ricchi, speziati e saturi ti danno un aspetto forte e radioso, mentre pastelli e tinte ghiaccio possono sbiadirti. Ruggine, cioccolato, senape, oliva e verde petrolio profondo sono i tuoi colori forti. Puoi portare tinte scure senza che ti appesantiscano.",
      "keywords": ["Calda", "Profonda", "Ricca"],
      "makeup": "Rossetto rosso mattone, cannella o bordeaux caldo, blush bronzo o terracotta ed eyeliner marrone scuro o oliva.",
      "hair": "Cioccolato intenso, castano, ramato scuro o caramello scuro. I colori molto chiari o cenere possono sembrare scollegati dal viso.",
      "jewelry": "Oro giallo anticato o intenso, rame e bronzo, con granato, occhio di tigre o pietre verde scuro."
    },
    "winterbright": {
      "name": "Inverno Bright",
      "word": "inverno bright",
      "vibe": "Fredda, vivida e impossibile da ignorare.",
      "desc": "I tuoi colori sono freddi e limpidi, spesso con un contrasto deciso tra capelli, pelle e occhi. I colori puri e brillanti come gemme e il bianco e nero netti ti danno un'aria definita e piena di vita, mentre le tinte spente, beige o polverose possono smorzare la tua luce. Fucsia, cobalto, smeraldo, rosso puro e bianco ghiaccio sono la tua firma. Puoi indossare il colore più audace della stanza.",
      "keywords": ["Fredda", "Limpida", "Contrastata"],
      "makeup": "Rossetto rosso puro, fucsia o rosa freddo, blush rosa acceso ed eyeliner nero ben definito.",
      "hair": "Castano scuro freddo, nero blu o una tinta fredda e pulita. I riflessi caramello caldi o ottonati possono risultare torbidi su di te.",
      "jewelry": "Argento lucido, oro bianco e platino, con diamanti, zaffiri o pietre dai colori vivaci."
    },
    "winterdeep": {
      "name": "Inverno Deep",
      "word": "inverno deep",
      "vibe": "Fredda, profonda e discretamente drammatica.",
      "desc": "I tuoi colori sono profondi, con un sottotono freddo o neutro-freddo, spesso con capelli e occhi scuri. Le tinte fredde e profonde e il nero puro ti stanno eleganti e potenti, mentre i pastelli caldi chiari e i beige possono darti un'aria stanca. Nero, blu inchiostro, prugna, bordeaux, verde pino e bianco ghiaccio per il contrasto compongono il tuo guardaroba ideale.",
      "keywords": ["Fredda", "Profonda", "Elegante"],
      "makeup": "Rossetto frutti di bosco, vinaccia o prugna scuro, blush rosa freddo ed eyeliner nero o prugna scuro.",
      "hair": "Espresso profondo, castano scuro freddo o nero morbido. I toni dorati chiari possono spegnere la tua profondità naturale.",
      "jewelry": "Argento, oro bianco o canna di fucile, con pietre profonde come rubino, ametista o onice."
    }
  }
};
