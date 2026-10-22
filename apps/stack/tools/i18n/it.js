/* Impila blocchi — italiano (/it/)
 * Regole e punteggio sono in stack-core.js; questo file contiene solo i testi visibili. Lascia {n} {pct} invariati.
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
    "title": "Impila blocchi – gioco della torre gratis online",
    "description": "Impila blocchi, il gioco della torre: tocca per far cadere il blocco che scorre e costruisci la torre più alta. Ciò che sporge viene tagliato. Gratis, senza download.",
    "ogTitle": "Impila blocchi 🏗️ Fin dove arrivi?",
    "ogDescription": "Lascia cadere ogni blocco al momento giusto. Ciò che sporge viene tagliato. Quanto sarà alta la tua torre?"
  },
  "siteName": "Impila blocchi",
  "privacyLink": "Privacy",
  "start": {
    "badge": "🏗️ Arcade con un tocco",
    "h1Kicker": "Impila blocchi",
    "h1Html": "Tocca, sgancia,<br><em>sali più in alto!</em>",
    "hook": "Un blocco scorre avanti e indietro sopra la tua torre. Sgancialo al momento giusto. Quello che sporge dal bordo è perso per sempre.",
    "how": {
      "tap": "Tocca per sganciare",
      "cut": "Ciò che sporge cade",
      "perfect": "Punta al perfetto"
    },
    "facts": "Sempre più veloce · un tocco · batti il record",
    "start": "Inizia a impilare →"
  },
  "play": {
    "score": "Blocchi",
    "best": "Record",
    "paused": "In pausa",
    "resume": "Riprendi",
    "hint": "Tocca per sganciare",
    "perfect": "Perfetto!",
    "combo": "Combo ×{n}",
    "fieldAria": "Area di gioco. Tocca, fai clic o premi Spazio per far cadere il blocco che scorre.",
    "pause": "Pausa"
  },
  "result": {
    "over": "Mancata la torre!",
    "blocks": "blocchi",
    "perfects": "Lanci perfetti",
    "bestCombo": "Combo migliore",
    "shareTitle": "Impila blocchi",
    "shareText": "Ho impilato {n} blocchi in Impila blocchi 🏗️ Riesci a fare di meglio?",
    "best": "Record: {n}",
    "newBest": "Nuovo record!",
    "top": "Top {n}%",
    "beat": "Più alta del {pct}% dei giocatori",
    "beatAll": "Più alta di tutte le torri finora",
    "others": "Confronto con altre {n} torri",
    "comparing": "Confronto con gli altri giocatori…",
    "retry": "Gioca ancora"
  },
  "og": {
    "brand": "🏗️ Impila blocchi",
    "defaultKicker": "Gioco gratis di blocchi da impilare",
    "defaultTitle": "Quanto in alto riesci a impilare?",
    "defaultDesc": "Tocca per sganciare · ciò che sporge è tagliato · punta al perfetto"
  },
  "faq": [
    {
      "q": "Come si gioca?",
      "a": "Un blocco scorre avanti e indietro sopra la torre. Tocca l’area di gioco, fai clic o premi Spazio per sganciarlo. Resta solo la parte che poggia sul blocco sotto; il resto viene tagliato e il blocco successivo è più stretto. La partita finisce quando un blocco manca del tutto la torre."
    },
    {
      "q": "Cos’è un lancio perfetto?",
      "a": "Se sganci il blocco quasi esattamente sopra quello di sotto, si incastra da solo e mantiene tutta la sua larghezza. Con più perfetti di fila il blocco torna ad allargarsi un po’ alla volta, dandoti un po’ di respiro."
    },
    {
      "q": "Perché diventa più difficile?",
      "a": "Ogni blocco impilato fa scorrere il successivo un po’ più veloce, fino a una velocità massima. Prendi il ritmo e tocca un attimo prima che il blocco arrivi al punto giusto."
    },
    {
      "q": "Il top % è vero?",
      "a": "Sì. A fine partita viene inviato in forma anonima al nostro server solo il numero di blocchi, per confrontarlo con quello degli altri. Il top % compare solo se ci sono punteggi reali da confrontare; altrimenti non viene mostrato nulla."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Impila blocchi",
    "description": "Informativa sulla privacy di Impila blocchi: punteggi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Impila blocchi (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. A fine partita viene inviato al nostro server solo il tuo punteggio (il numero di blocchi impilati) come conteggio anonimo, senza nome né identificativi personali. Alcune informazioni possono essere raccolte automaticamente durante l’uso, come descritto sotto."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e il tuo record, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori nostri che conservano solo totali giornalieri per lingua (pagine viste, partite iniziate e finite, valutazioni a stelle). Nulla di tutto ciò ti identifica personalmente."
      ],
      [
        "5. Contatti",
        "Per domande su questa informativa sulla privacy, contatta il gestore del sito."
      ],
      [
        "6. Data di entrata in vigore",
        "Questa informativa è valida dal 23 ottobre 2026."
      ]
    ],
    "back": "← Torna a Impila blocchi"
  }
};
