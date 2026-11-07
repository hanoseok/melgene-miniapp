/* Ski Downhill — it (Gioco di sci)
 * Le regole sono in ski-core.js; questo file contiene solo i testi visibili.
 * Le chiavi che finiscono in Html sono inserite come HTML (solo <br> ed <em>); anche privacy.sections.
 * Lascia invariati i segnaposto {n} {pct} {s} {c} {tier}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap",
    "display": "'Oswald'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Gioco di sci online – Discesa e slalom",
    "description": "Gioco di sci online: scendi lungo una pista innevata senza fine, schiva abeti, rocce e pupazzi di neve e passa tra le porte dello slalom per metri bonus. Da telefono o PC.",
    "ogTitle": "Gioco di sci ⛷️ Quanto lontano arrivi prima di cadere?",
    "ogDescription": "Scendi lungo una pista infinita, infila le porte dello slalom e schiva gli abeti. Basta un urto ed è finita."
  },
  "siteName": "Gioco di sci",
  "privacyLink": "Privacy",
  "start": {
    "badge": "⛷️ Neve fresca, pista infinita",
    "h1Kicker": "Gioco di sci online",
    "h1Html": "Giù dalla montagna<br><em>più lontano che puoi</em>",
    "hook": "La pista non finisce mai e gli sci vanno sempre più veloci. Fai lo slalom tra abeti e bandierine e scopri quanti metri riesci a fare prima di cadere.",
    "how": {
      "steer": "Tieni premuto un lato",
      "gates": "Passa tra le bandierine",
      "avoid": "Schiva abeti e rocce"
    },
    "start": "In pista →",
    "facts": "Tieni premuto o tasti ← → · telefono o PC · batti il record"
  },
  "play": {
    "dist": "Distanza",
    "best": "Record",
    "pause": "Pausa",
    "paused": "In pausa",
    "resume": "Continua a sciare",
    "hint": "Tocca per partire",
    "fieldAria": "Pista da sci: tieni premuta la metà sinistra o destra per curvare",
    "gateOk": "+{n} m ×{c}",
    "gateMiss": "Porta mancata"
  },
  "result": {
    "over": "La tua discesa",
    "unit": "m",
    "newBest": "Nuovo record personale!",
    "best": "Il tuo record: {n} m",
    "gates": "Porte passate",
    "time": "Tempo",
    "timeValue": "{s} s",
    "tierLabel": "Il tuo livello",
    "tiers": [
      "🧊 Campo scuola",
      "🟢 Pista verde",
      "🔵 Pista blu",
      "⚫ Pista nera",
      "⚡ Bolide della neve",
      "🏆 Leggenda delle vette"
    ],
    "top": "Top {n}%",
    "beat": "Più lontano del {pct}% degli sciatori",
    "beatAll": "Più lontano di tutti gli altri finora",
    "others": "Confrontato con altre {n} discese",
    "comparing": "Confronto con gli altri sciatori…",
    "shareTitle": "Gioco di sci",
    "shareText": "Sono sceso per {n} m giù dalla montagna ⛷️ {tier}. Tu fin dove arrivi?",
    "retry": "Scia di nuovo"
  },
  "og": {
    "brand": "⛷️ Gioco di sci",
    "defaultKicker": "Gioco di sci online",
    "defaultTitle": "Quanto lontano arrivi prima di cadere?",
    "defaultDesc": "Pista infinita · porte dello slalom · telefono o PC"
  },
  "faq": [
    {
      "q": "Come si guida lo sciatore?",
      "a": "Tieni premuto con il dito o il mouse sulla metà sinistra o destra della pista, oppure tieni premuti i tasti ← → (o A / D). Lo sciatore si inclina e scivola dolcemente da quel lato; lascia andare per tornare dritto. La discesa parte al primo tocco o tasto."
    },
    {
      "q": "A cosa servono le bandierine?",
      "a": "Due bandierine dello stesso colore formano una porta. Passaci in mezzo per guadagnare metri bonus e infila più porte di fila per far salire la combo e rendere ogni bonus più grande. Mancare una porta non chiude la discesa, ma azzera la combo."
    },
    {
      "q": "Come si conta la distanza?",
      "a": "Si sommano i metri percorsi in discesa e i bonus delle porte. Più vai lontano, più la velocità aumenta, e la discesa finisce appena colpisci un abete, una roccia o un pupazzo di neve. Il record resta salvato in questo browser."
    },
    {
      "q": "Cosa succede se cambio scheda?",
      "a": "Il gioco va in pausa da solo quando lasci la pagina o blocchi il telefono. Premi «Continua a sciare» (o il tasto P) per ripartire esattamente da dove ti eri fermato."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Gioco di sci",
    "description": "Informativa sulla privacy del gioco di sci: punteggi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il gioco di sci (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account e senza accesso. Alla fine di una discesa viene inviata al nostro server solo la tua distanza in metri, come conteggio anonimo, senza nome né identificativi personali. Durante l’uso alcune informazioni possono essere raccolte automaticamente, come descritto sotto."
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
        "Questa informativa è in vigore dall’8 novembre 2026."
      ]
    ],
    "back": "← Torna al gioco di sci"
  }
};
