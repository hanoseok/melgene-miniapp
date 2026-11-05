/* Aim Trainer — it (Aim trainer)
 * Rules live in aim-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {avg} {hits} {acc} {tier} — keep them as-is when translating.
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
    "title": "Aim trainer · Allenamento della mira online",
    "description": "Aim trainer gratis: colpisci 30 bersagli il più in fretta possibile o quanti più puoi in 30 secondi. Tempo medio, precisione e classifica su telefono o PC.",
    "ogTitle": "Aim trainer 🎯 Quanto è veloce e precisa la tua mira?",
    "ogDescription": "Colpisci 30 bersagli o gioca 30 secondi a tempo e scopri tempo medio, precisione e il tuo badge di mira."
  },
  "siteName": "Aim trainer",
  "privacyLink": "Privacy",
  "start": {
    "badge": "🎯 Quanto vale la tua mira?",
    "h1Kicker": "Aim trainer · Allenamento della mira",
    "h1Html": "Prendi la mira,<br><em>colpisci veloce</em>",
    "hook": "I bersagli spuntano ovunque nel riquadro. Toccali prima che spariscano e scopri quanto è rapida e precisa la tua mano.",
    "modeLabel": "Modalità",
    "modes": {
      "classic": {
        "name": "Classica",
        "sub": "30 bersagli"
      },
      "timed": {
        "name": "A tempo",
        "sub": "30 secondi"
      }
    },
    "how": "Colpisci il bersaglio centrale per iniziare · fuori = errore",
    "start": "Si parte →",
    "facts": "Mouse, touchpad o dito · telefono o PC · batti il tuo record"
  },
  "modes": {
    "classic": "Classica · 30 bersagli",
    "timed": "A tempo · 30 secondi"
  },
  "play": {
    "time": "Tempo",
    "hits": "Colpiti",
    "acc": "Precisione",
    "ready": "Colpisci il bersaglio per iniziare",
    "readySub": "Il tempo parte con il primo colpo",
    "done": "Finito!",
    "timeUp": "Tempo scaduto!",
    "cancelled": "Hai lasciato la pagina, quindi questa partita non conta. Riprova!",
    "change": "← Cambia modalità",
    "areaAria": "Area di mira"
  },
  "result": {
    "over": "Il tuo risultato",
    "scoreClassic": "Tempo medio per bersaglio",
    "scoreTimed": "Bersagli colpiti",
    "unitMs": "ms",
    "unitHits": "colpiti",
    "acc": "Precisione",
    "avg": "Tempo medio",
    "misses": "Errori",
    "total": "Tempo totale",
    "escaped": "Sfuggiti",
    "msValue": "{n} ms",
    "secValue": "{n} s",
    "tierLabel": "Il tuo badge di mira",
    "tiers": [
      "🐢 Riscaldamento",
      "🙂 Mira tranquilla",
      "🎯 Occhio vispo",
      "🦅 Occhio di falco",
      "⚡ Maestro del flick",
      "🏆 Leggenda della mira"
    ],
    "newBest": "Nuovo record personale!",
    "pbClassic": "Il tuo record in Classica: {n} ms",
    "pbTimed": "Il tuo record A tempo: {n} colpiti",
    "invalid": "È più veloce di quanto possa reagire un essere umano, quindi questo risultato non viene salvato né confrontato.",
    "top": "Top {n}%",
    "beat": "Meglio del {pct}% dei giocatori",
    "beatAll": "Meglio di tutti gli altri giocatori finora",
    "others": "Confrontato con altre {n} partite in questa modalità",
    "comparing": "Confronto con gli altri giocatori…",
    "shareTitle": "Aim trainer",
    "shareClassic": "Media di {avg} ms per bersaglio con il {acc}% di precisione 🎯 {tier}. Miri più veloce?",
    "shareTimed": "{hits} bersagli in 30 secondi con il {acc}% di precisione 🎯 {tier}. Riesci a battermi?",
    "retry": "Gioca ancora"
  },
  "og": {
    "brand": "🎯 Aim trainer",
    "defaultKicker": "Test di mira gratis",
    "defaultTitle": "Quanto è veloce e precisa la tua mira?",
    "defaultDesc": "30 bersagli o 30 secondi · telefono o PC"
  },
  "faq": [
    {
      "q": "Come funziona questo aim trainer?",
      "a": "Scegli Classica o A tempo, premi il pulsante e colpisci il bersaglio al centro del riquadro per iniziare. In Classica compaiono 30 bersagli uno alla volta e il punteggio è il tempo medio che impieghi a colpirli. A tempo hai 30 secondi per colpirne il più possibile; ogni bersaglio si rimpicciolisce piano piano e sfugge se sei troppo lento."
    },
    {
      "q": "Qual è un buon punteggio?",
      "a": "In Classica la maggior parte delle persone sta tra 500 e 800 millisecondi per bersaglio, e i giocatori forti scendono sotto i 450. A tempo sono comuni 35-45 colpi. Conta anche la precisione: se meno del 70% dei tuoi clic finisce su un bersaglio, il badge scende di un livello."
    },
    {
      "q": "Si può giocare con mouse, touchpad o touchscreen?",
      "a": "Sì. Funzionano clic del mouse, touchpad, penna e dito; la tastiera non si usa. Contano solo i clic dentro l’area di gioco. I punteggi di dispositivi diversi non sono davvero confrontabili: con il mouse e con il telefono puoi ottenere risultati piuttosto diversi."
    },
    {
      "q": "Perché la mia partita non è stata contata?",
      "a": "Se cambi scheda, blocchi il telefono o lasci la pagina durante una partita, questa viene annullata per correttezza. I risultati più veloci dei riflessi umani, come una media sotto i 150 millisecondi per bersaglio, non vengono salvati né confrontati con gli altri giocatori."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Aim trainer",
    "description": "Informativa sulla privacy dell’Aim trainer: punteggi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "L’Aim trainer (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Alla fine di una partita, solo il tuo punteggio (tempo medio per bersaglio o numero di colpi) viene inviato al nostro server come conteggio anonimo, senza nome né identificativi personali. Durante l’uso alcune informazioni possono essere raccolte automaticamente, come descritto sotto."
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
        "Questa informativa è in vigore dal 6 novembre 2026."
      ]
    ],
    "back": "← Torna all’Aim trainer"
  }
};
