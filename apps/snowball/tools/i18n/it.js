/* Snowball Fight — it (Palle di neve)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
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
    "title": "Battaglia di palle di neve – lancia e schiva",
    "description": "Gioco gratis di battaglia di palle di neve: colpisci i bambini che spuntano dai fortini e abbassati dietro il tuo muro quando arriva una palla. 60 secondi a partita.",
    "ogTitle": "Palle di neve ☃️ Quanti colpi in 60 secondi?",
    "ogDescription": "Lancia veloce, abbassati in tempo e non colpire il cane. Tre cuori, un minuto."
  },
  "siteName": "Palle di neve",
  "privacyLink": "Informativa sulla privacy",
  "start": {
    "badge": "☃️ Neve fresca, tasche piene",
    "h1Kicker": "Battaglia di palle di neve",
    "h1Html": "Mira, lancia<br><em>e abbassati</em>",
    "hook": "Dall’altra parte del cortile i bambini si nascondono dietro i fortini di neve. Colpiscili quando sbucano e abbassati in fretta quando qualcuno alza il braccio.",
    "how": {
      "throw": "Tocca un bimbo per lanciare",
      "duck": "Con ❗ tieni Abbassati",
      "avoid": "Non colpire gli amici"
    },
    "start": "Inizia la battaglia →",
    "facts": "Partite da 60 secondi · 3 cuori · telefono o PC"
  },
  "play": {
    "score": "Punti",
    "time": "Tempo",
    "lives": "Vite",
    "secUnit": "s",
    "pause": "Pausa",
    "paused": "In pausa",
    "resume": "Torna a combattere",
    "hint": "Tocca il cortile per iniziare",
    "fieldAria": "Cortile innevato: tocca un bambino per lanciare una palla, tieni premuto il muro o il pulsante Abbassati per nasconderti",
    "duck": "Abbassati (tieni)",
    "duckAria": "Abbassarsi dietro il muro finché è premuto",
    "combo": "Combo ×{n}",
    "golden": "D’oro! +{n}",
    "oops": "È un amico! −{n}",
    "miss": "Mancato",
    "block": "Parata!",
    "ouch": "Ahi!",
    "timeUp": "Tempo scaduto!",
    "out": "Sommerso!"
  },
  "result": {
    "over": "Battaglia finita",
    "reasonTime": "Hai resistito per tutto il minuto",
    "reasonOut": "Colpito tre volte: fuori",
    "unit": "punti",
    "newBest": "Nuovo record personale!",
    "best": "Il tuo record: {n} punti",
    "hits": "Colpi",
    "accuracy": "Mira",
    "bestCombo": "Combo max",
    "tierLabel": "Il tuo grado in battaglia",
    "tiers": [
      "🧤 Dita gelate",
      "❄️ Fiocco novellino",
      "⛄ Di casa in cortile",
      "🎯 Tiratore scelto",
      "⭐ Conquistaforti",
      "🏆 Leggenda di neve"
    ],
    "top": "Top {n}%",
    "beat": "Meglio del {pct}% dei giocatori",
    "beatAll": "Meglio di tutti gli altri giocatori finora",
    "others": "Confrontato con altre {n} partite",
    "comparing": "Confronto con gli altri giocatori…",
    "shareTitle": "Battaglia di palle di neve",
    "shareText": "Ho fatto {n} punti in 60 secondi di battaglia di palle di neve ☃️ {tier}. Riesci a battermi?",
    "retry": "Un’altra battaglia"
  },
  "og": {
    "brand": "☃️ Palle di neve",
    "defaultKicker": "Gioco di palle di neve online",
    "defaultTitle": "Quanti colpi in 60 secondi?",
    "defaultDesc": "Lancia · abbassati · non colpire il cane"
  },
  "faq": [
    {
      "q": "Come si lancia e come ci si abbassa?",
      "a": "Tocca (o clicca) un bambino che sbuca dal suo fortino e una palla di neve parte verso di lui. Per nasconderti tieni premuto il pulsante Abbassati o il muro di neve in basso. Mentre sei abbassato non puoi lanciare. Al computer usa ← e → per scegliere un fortino, ↑ o F per lanciare e tieni premuto Spazio o ↓ per abbassarti."
    },
    {
      "q": "Come capisco che sta arrivando una palla?",
      "a": "Il bambino che sta per lanciare alza il braccio e sopra la sua testa compare un ❗ rosso. Se lo colpisci prima, il lancio non parte. Se la palla è già in volo, sopra il tuo muro appare un grande ❗ e il pulsante Abbassati diventa rosso: tienilo premuto finché la palla non arriva."
    },
    {
      "q": "Come si calcolano i punti?",
      "a": "Ogni colpo vale punti, e un pupazzo di neve vale un po’ più di un bambino. Più colpi di fila creano una combo che aumenta il valore di ogni lancio, mentre un tiro mancato la azzera. Il raro pupazzo di neve d’oro vale più di tutti. Il cane e il bambino con la bandiera bianca sono amici: colpirli toglie punti."
    },
    {
      "q": "Quando finisce una partita?",
      "a": "Ogni partita dura 60 secondi, oppure finisce prima se vieni colpito tre volte. Più passa il tempo, più si fa frenetica. La partita va in pausa da sola se cambi scheda o blocchi il telefono."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Palle di neve",
    "description": "Informativa sulla privacy del gioco di palle di neve: punteggi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Il gioco di palle di neve (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.",
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
        "Questa informativa è in vigore dal 14 novembre 2026."
      ]
    ],
    "back": "← Torna al gioco di palle di neve"
  }
};
