/* Puzzle a blocchi — italiano */
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
    "title": "Puzzle a blocchi – gioco di blocchi 8×8",
    "description": "Puzzle a blocchi: trascina i pezzi su una griglia 8×8, riempi righe e colonne per eliminarle e concatena le combo. Gratis, senza download.",
    "ogTitle": "Puzzle a blocchi 🧩 Quanto resisti con la griglia libera?",
    "ogDescription": "Trascina i pezzi, riempi una riga o una colonna e sparisce. Elimina di fila per fare combo."
  },
  "siteName": "Puzzle a blocchi",
  "privacyLink": "Privacy",
  "start": {
    "badge": "🧩 Rompicapo 8×8 rilassante",
    "h1Kicker": "Puzzle a blocchi",
    "h1Html": "Riempi le righe,<br><em>e cancellale!</em>",
    "hook": "Tre pezzi, una griglia 8×8 e nessun timer. Incastrali, elimina righe e colonne e vai avanti finché c’è spazio.",
    "how": {
      "drag": "Trascina un pezzo",
      "lines": "Riempi le linee",
      "plan": "Lascia spazio"
    },
    "facts": "Senza timer · combo · batti il record",
    "start": "Gioca →"
  },
  "play": {
    "score": "Punti",
    "best": "Record",
    "combo": "Combo",
    "comboValue": "×{n}",
    "hint": "Trascina un pezzo sulla griglia",
    "hintSelected": "Tocca una casella per posarlo",
    "hintNoFit": "Quel pezzo lì non entra",
    "noRoom": "Niente più spazio!",
    "boardAria": "Griglia 8 per 8. Scegli un pezzo con 1, 2 o 3, spostalo con le frecce e premi Invio per posarlo. Esc annulla.",
    "trayAria": "Pezzi da posare",
    "pieceAria": "Pezzo {n}",
    "pieceNoFit": "Pezzo {n} (non c’è posto)"
  },
  "result": {
    "over": "Non c’è più posto sulla griglia",
    "points": "punti",
    "lines": "Linee eliminate",
    "combo": "Combo migliore",
    "comboValue": "×{n}",
    "shareTitle": "Puzzle a blocchi",
    "shareText": "Ho fatto {n} punti a Puzzle a blocchi 🧩 Riesci a battermi?",
    "best": "Record: {n}",
    "newBest": "Nuovo record!",
    "top": "Top {n}%",
    "beat": "Meglio del {pct}% dei giocatori",
    "beatAll": "Meglio di tutti gli altri giocatori finora",
    "others": "Confronto con altre {n} partite",
    "comparing": "Confronto con gli altri giocatori…",
    "retry": "Gioca ancora"
  },
  "og": {
    "brand": "🧩 Puzzle a blocchi",
    "defaultKicker": "Gioco di blocchi 8×8 gratis",
    "defaultTitle": "Riempi le righe, svuota la griglia",
    "defaultDesc": "Trascina · riempi righe e colonne · combo"
  },
  "faq": [
    {
      "q": "Come si gioca?",
      "a": "Trascina uno dei tre pezzi sotto la griglia e lascialo su caselle vuote. Quando una riga o una colonna è piena, viene eliminata. Posati tutti e tre i pezzi, ne arrivano tre nuovi. La partita finisce quando nessuno dei pezzi rimasti entra da nessuna parte."
    },
    {
      "q": "Come si calcola il punteggio?",
      "a": "Ogni casella posata vale un punto. Eliminare linee dà un bonus che cresce con il numero di linee eliminate in una volta (10, 30, 60, 100 …), e il bonus viene moltiplicato per la tua combo."
    },
    {
      "q": "Come funzionano le combo?",
      "a": "Ogni pezzo che elimina almeno una linea fa salire la combo di uno, e quel numero è il moltiplicatore di quella mossa. Se tre pezzi di fila non eliminano nulla, la combo torna a zero."
    },
    {
      "q": "Si può giocare senza trascinare?",
      "a": "Sì. Tocca un pezzo per sceglierlo, poi tocca la griglia dove vuoi metterlo. Con la tastiera premi 1, 2 o 3 per scegliere, spostalo con le frecce e premi Invio per posarlo."
    },
    {
      "q": "La percentuale è vera?",
      "a": "Sì. A fine partita viene inviato in forma anonima al nostro server solo il tuo punteggio, per confrontarlo con quelli degli altri. La percentuale compare solo se ci sono punteggi reali con cui confrontarlo."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Puzzle a blocchi",
    "description": "Informativa sulla privacy di Puzzle a blocchi: punteggi anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Puzzle a blocchi (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. A fine partita viene inviato al nostro server solo il tuo punteggio, come conteggio anonimo, senza nome né identificativi personali. Durante l’uso alcune informazioni possono essere raccolte automaticamente, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e il tuo record, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non andare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per proporre annunci in base alle tue visite precedenti a questo e ad altri siti. Puoi saperne di più e cambiare le preferenze nelle <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (pagine viste, partite iniziate e finite, valutazioni). Nulla di tutto ciò ti identifica personalmente."
      ],
      [
        "5. Contatti",
        "Per qualsiasi domanda su questa informativa, contatta il gestore del sito."
      ],
      [
        "6. Data di entrata in vigore",
        "Questa informativa è in vigore dal 29 ottobre 2026."
      ]
    ],
    "back": "← Torna a Puzzle a blocchi"
  }
};
