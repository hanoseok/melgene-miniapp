/* Ice Fishing — it (Pesca sul ghiaccio)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
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
    "title": "Gioco di pesca sul ghiaccio online",
    "description": "Gioco di pesca sul ghiaccio gratis online: cala la lenza in un buco nel lago ghiacciato, aspetta l’abboccata e recupera senza spezzare il filo. 60 secondi, da telefono o PC.",
    "ogTitle": "Pesca sul ghiaccio 🎣 Quanti pesci prendi in 60 secondi?",
    "ogDescription": "Cala la lenza sotto il ghiaccio, senti l’abboccata e recupera piano. Se tiri troppo, il filo si spezza."
  },
  "siteName": "Pesca sul ghiaccio",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "🎣 Un lago ghiacciato, un piccolo buco",
    "h1Kicker": "Gioco di pesca sul ghiaccio",
    "h1Html": "Cala la lenza<br><em>e tirali su</em>",
    "hook": "Qualcosa nuota sotto il ghiaccio. Cala l’amo alla profondità giusta, aspetta lo strattone e recupera con delicatezza prima che il filo ceda.",
    "how": {
      "lower": "Tieni premuto per calare",
      "reel": "Abbocca? Tieni per recuperare",
      "red": "Molla sul rosso"
    },
    "start": "Inizia a pescare →",
    "facts": "Partite da 60 s · telefono o PC · batti il tuo record"
  },
  "play": {
    "score": "Punti",
    "time": "Tempo",
    "secUnit": "s",
    "pause": "Pausa",
    "paused": "In pausa",
    "resume": "Continua a pescare",
    "hint": "Tieni premuto sotto il ghiaccio per calare la lenza",
    "fieldAria": "Lago ghiacciato: tieni premuto a una profondità per calare l’amo, tieni premuto per recuperare quando abbocca",
    "bite": "Abbocca!",
    "catchPop": "{fish} +{n}",
    "snap": "Il filo si è spezzato!",
    "escape": "È scappato",
    "timeUp": "Tempo scaduto!"
  },
  "fish": {
    "minnow": "Vairone",
    "perch": "Persico",
    "trout": "Trota",
    "pike": "Luccio",
    "golden": "Pesce d’oro",
    "boot": "Vecchio stivale"
  },
  "result": {
    "over": "Il tuo pescato",
    "unit": "pt",
    "newBest": "Nuovo record personale!",
    "best": "Il tuo record: {n} pt",
    "caught": "Pesci presi",
    "snapped": "Fili spezzati",
    "bestCatch": "Cattura migliore: {fish}",
    "noCatch": "Stavolta niente pesci",
    "tierLabel": "Il tuo livello di pescatore",
    "tiers": [
      "🧊 Mani gelate",
      "🪝 Apprendista",
      "🐟 Pesca paziente",
      "🎣 Habitué del lago",
      "⭐ Re dei pesci",
      "🏆 Leggenda del lago"
    ],
    "top": "Top {n}%",
    "beat": "Meglio del {pct}% dei pescatori",
    "beatAll": "Meglio di tutti i pescatori finora",
    "others": "Confrontato con altre {n} partite",
    "comparing": "Confronto con gli altri pescatori…",
    "shareTitle": "Pesca sul ghiaccio",
    "shareText": "Ho fatto {n} pt pescando sul ghiaccio in 60 secondi 🎣 {tier}. Riesci a battermi?",
    "retry": "Pesca ancora"
  },
  "og": {
    "brand": "🎣 Pesca sul ghiaccio",
    "defaultKicker": "Gioco di pesca sul ghiaccio",
    "defaultTitle": "Quanti pesci prendi in 60 secondi?",
    "defaultDesc": "Cala la lenza · senti l’abboccata · non spezzare il filo"
  },
  "faq": [
    {
      "q": "Come si cala la lenza?",
      "a": "Tieni premuto in un punto qualsiasi dell’acqua sotto il ghiaccio: l’amo si sposta a quella profondità e si ferma quando molli. Al computer puoi anche tenere premuti i tasti ↓ e ↑. Ogni pesce ama una profondità diversa, quindi provane qualcuna."
    },
    {
      "q": "Come funziona il recupero?",
      "a": "Quando un pesce abbocca, tieni premuto per recuperare. La barra della tensione a destra sale. Quando arriva nella zona rossa, molla un attimo per allentare il filo e poi tieni di nuovo. Se la barra si riempie, il filo si spezza; se resta lento troppo a lungo, il pesce si slama."
    },
    {
      "q": "Perché alcuni pesci valgono di più?",
      "a": "I pesci più grandi e profondi tirano più forte e valgono più punti; il raro pesce d’oro vale più di tutti. I rifiuti come un vecchio stivale salgono facilmente ma non valgono nulla. Il tuo record viene salvato in questo browser."
    },
    {
      "q": "Cosa succede se cambio scheda?",
      "a": "La partita va in pausa da sola quando lasci la pagina o blocchi il telefono, e anche il tempo si ferma. Tocca Continua a pescare (o il tasto P) per riprendere da dove eri."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Pesca sul ghiaccio",
    "description": "Informativa sulla privacy del gioco di pesca sul ghiaccio: punteggi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il gioco di pesca sul ghiaccio (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account e senza accesso. Alla fine di una partita viene inviato al nostro server solo il tuo punteggio, come conteggio anonimo, senza nome né identificativi personali. Durante l’uso alcune informazioni possono essere raccolte automaticamente, come descritto sotto."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare i cookie e la memoria locale del browser per ricordare la lingua e il tuo record, mostrare annunci e capire come viene usato il Servizio. Puoi rifiutarli o cancellarli dalle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo i totali giornalieri per lingua (pagine viste, partite iniziate e finite, valutazioni a stelle). Nulla di tutto ciò ti identifica personalmente."
      ],
      [
        "5. Contatti",
        "Per domande su questa informativa, contatta il gestore del sito."
      ],
      [
        "6. Data di efficacia",
        "Questa informativa è in vigore dal 10 novembre 2026."
      ]
    ],
    "back": "← Torna al gioco di pesca sul ghiaccio"
  }
};
