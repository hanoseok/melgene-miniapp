/* Tori e vacche (숫자 야구 / number baseball) — it
 * Rules live in baseball-core.js; this file holds every visible string.
 * Keys ending in Html are raw HTML (<br>, <em> only); privacy.sections bodies are HTML too.
 * Placeholders: {n} {d} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Tori e vacche – gioco di numeri da indovinare",
    "description": "Gioca gratis a Tori e vacche (Bulls and Cows): indovina il numero segreto di 3 o 4 cifre con gli indizi toro, vacca e niente. Record per livello, senza installare nulla.",
    "ogTitle": "Tori e vacche ⚾ Riesci a scoprire il numero segreto?",
    "ogDescription": "Un numero segreto senza cifre ripetute. Prova a indovinarlo con gli indizi, nel minor numero di tentativi."
  },
  "siteName": "Tori e vacche – baseball dei numeri",
  "privacyLink": "Privacy",
  "start": {
    "badge": "⚾ Baseball dei numeri",
    "h1Kicker": "Tori e vacche",
    "h1Html": "Scopri il<br><em>numero segreto</em>",
    "hook": "Il computer ha nascosto un numero segreto senza cifre ripetute. Fai un tentativo, leggi gli indizi e decifra il codice.",
    "how": "Toro = cifra e posto giusti · Vacca = cifra giusta, posto sbagliato · Niente = nessuna corrispondenza",
    "levelLabel": "Scegli quante cifre",
    "levels": {
      "d3": "3 cifre",
      "d4": "4 cifre"
    },
    "levelSub": {
      "d3": "Classico",
      "d4": "Più difficile"
    },
    "timer": "Mostra il cronometro",
    "start": "Inizia →"
  },
  "play": {
    "tries": "Tentativi",
    "time": "Tempo",
    "slotAria": "Cifra {n}",
    "enter": "Prova",
    "del": "Cancella",
    "giveUp": "Mi arrendo",
    "giveUpSure": "Tocca ancora per vedere la risposta",
    "historyTitle": "I tuoi tentativi",
    "historyEmpty": "Inserisci un numero per fare il primo tentativo.",
    "errLen": "Inserisci {n} cifre",
    "errDup": "Le cifre non possono ripetersi",
    "errAgain": "Hai già provato questo numero",
    "strike": "Toro",
    "ball": "Vacca",
    "out": "Niente",
    "legend": "Toro: cifra e posto giusti · Vacca: cifra giusta, posto sbagliato"
  },
  "result": {
    "done": "Trovato!",
    "gaveUp": "La risposta era",
    "triesCaption": "Tentativi",
    "timeLabel": "Tempo",
    "secretLabel": "Numero segreto",
    "sec": "s",
    "best": "Record a questo livello: {n}",
    "newBest": "Nuovo record personale!",
    "top": "Top {n}%",
    "beat": "Meno tentativi del {pct}% dei giocatori",
    "beatAll": "Meno tentativi di tutti i risultati finora",
    "others": "Confrontato con altri {n} risultati a questo livello",
    "comparing": "Confronto con gli altri giocatori…",
    "retry": "Gioca ancora",
    "shareTitle": "Tori e vacche – riesci a scoprire il numero segreto?",
    "shareText": "Ho indovinato un numero di {d} cifre in {n} tentativi ⚾ Riesci a fare meglio?"
  },
  "og": {
    "brand": "⚾ Tori e vacche",
    "defaultKicker": "Gioco di numeri gratuito",
    "defaultTitle": "Riesci a scoprire il numero segreto?",
    "defaultDesc": "Toro · Vacca · Niente"
  },
  "faq": [
    {
      "q": "Come si gioca a Tori e vacche?",
      "a": "Il computer sceglie un numero segreto con tutte le cifre diverse. Inserisci un numero della stessa lunghezza, anch’esso senza cifre ripetute, e premi Prova. Una cifra al posto giusto è un toro, una cifra giusta al posto sbagliato è una vacca, e se non c’è nessuna corrispondenza è “niente”. Vinci quando tutte le cifre sono tori."
    },
    {
      "q": "Il numero segreto può iniziare con 0? Le cifre possono ripetersi?",
      "a": "Può iniziare con 0, per esempio 072, ma una cifra non compare mai due volte. Anche i tuoi tentativi non devono ripetere cifre. Un numero già provato non viene contato di nuovo: solo i tentativi nuovi aumentano il conteggio."
    },
    {
      "q": "C’è un pulsante di aiuto o un limite di tentativi?",
      "a": "Nessun aiuto e nessun limite. È un puro rompicapo di deduzione: meno tentativi servono, meglio è. Se ti blocchi, premi Mi arrendo per vedere la risposta e iniziare un nuovo round. Il cronometro è facoltativo e compare solo se lo attivi."
    },
    {
      "q": "Che differenza c’è tra 3 e 4 cifre?",
      "a": "Con 3 cifre ci sono 720 numeri segreti possibili; con 4 cifre molti di più, tutti ugualmente probabili. Il tuo record viene salvato separatamente per ogni livello in questo browser."
    },
    {
      "q": "Da dove viene il “Top %”?",
      "a": "Quando risolvi un round, il tuo numero di tentativi viene confrontato con i risultati reali degli altri giocatori dello stesso livello. Se non ci sono ancora altri risultati, il confronto non viene mostrato. I round in cui ti arrendi non contano."
    }
  ],
  "privacy": {
    "title": "Informativa sulla privacy | Tori e vacche",
    "description": "Informativa sulla privacy di Tori e vacche: risultati anonimi, cookie, pubblicità e statistiche.",
    "h1": "Informativa sulla privacy",
    "introHtml": "Tori e vacche (il \"Servizio\") rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.",
    "sections": [
      [
        "1. Informazioni raccolte",
        "Il Servizio funziona senza account né accesso. Quando risolvi un round, al nostro server vengono inviati solo il livello e il numero di tentativi come conteggio anonimo, senza nome né identificativi personali. Durante l’uso del Servizio alcune informazioni possono essere raccolte automaticamente, come descritto di seguito."
      ],
      [
        "2. Cookie e tecnologie simili",
        "Il Servizio può usare cookie e la memoria locale del browser per ricordare la lingua e i tuoi record, mostrare annunci e capire come viene usato. Puoi rifiutarli o eliminarli nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto."
      ],
      [
        "3. Pubblicità (Google AdSense)",
        "Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Per saperne di più e modificare le preferenze visita <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Impostazioni annunci di Google</a>."
      ],
      [
        "4. Statistiche",
        "Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori nostri che conservano solo totali giornalieri per lingua (pagine viste, partite iniziate e finite, valutazioni a stelle). Nessuno di questi dati ti identifica personalmente."
      ],
      [
        "5. Contatti",
        "Per qualsiasi domanda su questa informativa, contatta il gestore del sito."
      ],
      [
        "6. Data di efficacia",
        "Questa informativa è valida dal 18 ottobre 2026."
      ]
    ],
    "back": "← Torna a Tori e vacche"
  }
};
