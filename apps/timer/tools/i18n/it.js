/* Sfida dei 10 secondi — it (10 Second Challenge / timer)
 * Rules live in timer-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + target/blind choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {total} {time} {pct} {tier} — keep them as-is when translating.
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
    "title": "Sfida dei 10 secondi – Ferma il cronometro a 10,00",
    "description": "Sfida dei 10 secondi: avvia il cronometro e fermalo esattamente a 10,00 secondi a sensazione. 3 tentativi, modalità alla cieca, 5 o 30 secondi. Gratis, senza download.",
    "ogTitle": "Sfida dei 10 secondi ⏱️ Ti fermi esattamente a 10,00?",
    "ogDescription": "Conta nella tua testa e premi STOP al momento giusto. 3 tentativi, e alla cieca le cifre spariscono."
  },
  "siteName": "Sfida dei 10 secondi",
  "privacyLink": "Privacy",
  "start": {
    "badge": "⏱️ Senti scorrere 10 secondi?",
    "h1Kicker": "Sfida dei 10 secondi",
    "h1Html": "Ferma il crono<br><em>a 10,00 esatti</em>",
    "hook": "Avvia il cronometro, conta nella tua testa e fermalo al momento giusto. Tre tentativi, conta solo il più vicino.",
    "targetLabel": "Tempo obiettivo",
    "targetValue": "{n} s",
    "blindLabel": "Modalità alla cieca",
    "blindDesc": "Le cifre spariscono dopo 3 secondi",
    "how": "Via, poi STOP · tocca ovunque o premi Spazio",
    "start": "Si parte →",
    "facts": "3 tentativi · 5, 10 o 30 secondi · batti il tuo record"
  },
  "play": {
    "target": "Obiettivo {t}",
    "blindTag": "Alla cieca",
    "attempt": "Tentativo {n} di {total}",
    "go": "Via",
    "stop": "STOP",
    "next": "Prossimo tentativo",
    "finish": "Vedi il risultato",
    "readyHint": "Premi Via e fermati esattamente a {t}",
    "runHint": "Tocca ovunque o premi Spazio per fermare",
    "early": "{n} in anticipo",
    "late": "{n} in ritardo",
    "perfect": "Perfetto! Esattamente {t} 🎉",
    "cancelled": "Hai lasciato la pagina, quindi questo tentativo non vale. Riprova!",
    "hidden": "??:??.??",
    "change": "← Cambia modalità",
    "clockAria": "Cronometro",
    "sec": "{n} s"
  },
  "result": {
    "over": "Il tuo risultato",
    "mode": "Obiettivo {t}",
    "perfect": "Esattamente {t}! Stop perfetto 🎉",
    "bestLabel": "Tentativo migliore, scarto di",
    "stoppedAt": "Fermato a {time}",
    "tierLabel": "Il tuo orologio interno",
    "tiers": [
      "🐌 Perso nel tempo",
      "⏳ Più o meno lì",
      "🙂 Buon orologio interno",
      "🎯 Tempismo preciso",
      "⚡ Re dei centesimi",
      "🧠 Cronometro umano"
    ],
    "newBest": "Nuovo record personale!",
    "pb": "Il tuo record in questa modalità: {n}",
    "avg": "Scarto medio",
    "listLabel": "I tuoi 3 tentativi",
    "top": "Top {n}%",
    "beat": "Più preciso del {pct}% dei giocatori",
    "beatAll": "Più preciso di tutti gli altri giocatori finora",
    "others": "Confrontato con altre {n} partite in questa modalità",
    "comparing": "Confronto con gli altri giocatori…",
    "shareTitle": "Sfida dei 10 secondi",
    "shareText": "Ho fermato il cronometro a soli {n} da {t} ⏱️ {tier}. Tu ci riesci esattamente?",
    "retry": "Riprova"
  },
  "og": {
    "brand": "⏱️ Sfida dei 10 secondi",
    "defaultKicker": "Gioco di tempismo gratis",
    "defaultTitle": "Riesci a fermare il cronometro a 10,00?",
    "defaultDesc": "3 tentativi · alla cieca · 5, 10 o 30 secondi"
  },
  "faq": [
    {
      "q": "Come si gioca?",
      "a": "Scegli un tempo obiettivo (5, 10 o 30 secondi) e premi Via. Il cronometro parte nell’istante in cui tocchi. Conta nella tua testa, poi premi STOP, tocca un punto qualsiasi dello schermo di gioco o premi Spazio quando pensi che il tempo sia passato. Hai tre tentativi per partita e il più vicino è il tuo risultato."
    },
    {
      "q": "Cosa fa la modalità alla cieca?",
      "a": "Alla cieca le cifre diventano punti interrogativi dopo i primi 3 secondi e devi continuare a contare solo a sensazione. È molto più difficile, e ha un record proprio e un confronto separato con gli altri giocatori."
    },
    {
      "q": "Perché è così difficile fare esattamente 10,00?",
      "a": "Il dito impiega un attimo a reagire e il conteggio mentale scivola un po’ in dieci secondi, quindi anche un buon stop arriva qualche centesimo prima o dopo. Il cronometro usa l’istante esatto del tuo tocco e mostra i centesimi come un cronometro vero. Un 10,00 esatto è raro, ed è proprio questo il bello."
    },
    {
      "q": "Perché il mio tentativo non è valido?",
      "a": "Se cambi scheda, blocchi il telefono o lasci la pagina mentre il cronometro corre, quel tentativo viene annullato per correttezza. Ricomincia semplicemente lo stesso tentativo."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Sfida dei 10 secondi",
    "description": "Informativa sulla privacy di Sfida dei 10 secondi: punteggi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Sfida dei 10 secondi (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Alla fine di una partita, solo il tuo punteggio (di quanti millisecondi si è discostato il tuo tentativo migliore) viene inviato al nostro server come conteggio anonimo, senza nome né identificativi personali. Durante l’uso alcune informazioni possono essere raccolte automaticamente, come descritto sotto."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare i cookie e la memoria locale del browser per ricordare la lingua e il tuo record, mostrare annunci e capire come viene usato il Servizio. Puoi rifiutarli o cancellarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">impostazioni degli annunci Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (pagine viste, partite iniziate e concluse, valutazioni a stelle). Nulla di tutto ciò ti identifica personalmente."
      ],
      [
        "5. Contatti",
        "Per qualsiasi domanda su questa informativa, contatta il gestore del sito."
      ],
      [
        "6. Data di entrata in vigore",
        "Questa informativa è in vigore dal 2 novembre 2026."
      ]
    ],
    "back": "← Torna a Sfida dei 10 secondi"
  }
};
