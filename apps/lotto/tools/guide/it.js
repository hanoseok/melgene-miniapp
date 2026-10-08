module.exports = {
  metaTitle: "Generatore di lotto: guida al caso e alle combinazioni",
  description: "Come funziona il generatore di lotto, se i numeri sono davvero casuali, la matematica delle combinazioni e come usarlo con responsabilità, per divertimento.",
  h1: "Generatore di lotto: come nascono davvero i numeri casuali",
  updated: "2026-10-09",
  intro: "Il generatore di lotto estrae numeri per il 6/45 coreano, un gioco in stile Euro, il Powerball statunitense o un intervallo a tua scelta, e li fa rotolare fuori da una macchina di estrazione sullo schermo. È fatto solo per divertimento. Questa guida spiega come usarlo, perché i suoi numeri sono casuali in senso stretto, com’è fatta la matematica delle combinazioni, usi creativi oltre la lotteria e come giocare con responsabilità.",
  sections: [
    {
      h: "Come funziona il generatore",
      p: [
        "Cominci scegliendo un gioco. Il 6/45 coreano estrae sei numeri da 1 a 45. Il gioco in stile Euro estrae cinque numeri da 1 a 50 più due stelle da 1 a 12. Il Powerball statunitense estrae cinque numeri da 1 a 69 più un Powerball da 1 a 26. Un gioco personalizzato ti permette di fissare il numero più alto, fino a 100, e quanti numeri estrarre, fino a dieci. Poi scegli quante giocate produrre, da una a cinque.",
        "Prima dell’estrazione puoi aggiungere numeri da tenere e numeri da escludere. I numeri tenuti compaiono in ogni giocata e gli altri vengono estratti intorno a loro; i numeri esclusi non compaiono mai. Queste due impostazioni valgono solo per i numeri principali, non per le stelle né per il Powerball. Quando premi il pulsante di estrazione, i numeri vengono scelti per primi, poi le palline rotolano nella macchina e escono una alla volta, e infine ogni giocata viene mostrata in ordine crescente. I colori delle palline seguono le note fasce coreane e un pulsante di copia mette il risultato negli appunti."
      ],
      list: [
        "Scegli il 6/45 coreano, lo stile Euro, il Powerball statunitense o un intervallo personalizzato.",
        "Scegli quante giocate estrarre, da 1 a 5.",
        "Se vuoi, indica numeri da tenere e da escludere, separati da virgole.",
        "Premi il pulsante di estrazione e guarda le palline uscire.",
        "Copia i numeri, estrai di nuovo o torna alle impostazioni."
      ]
    },
    {
      h: "I numeri sono davvero casuali?",
      p: [
        "Il generatore usa la fonte casuale crittografica del tuo browser, lo stesso tipo di casualità usato per creare chiavi di sicurezza. Estrarre un numero intero da un intervallo sembra facile, ma un metodo approssimativo può favorire alcuni numeri. Per esempio, se si prende un grande valore casuale e si usa il resto della divisione per 45, i resti più piccoli escono un po’ più spesso. Per evitarlo, lo strumento scarta i pochi valori casuali che causerebbero lo squilibrio e riprova, una tecnica chiamata campionamento per rigetto.",
        "I numeri vengono poi scelti senza ripetizioni con un rimescolamento parziale, così a ogni passo ogni numero rimasto ha la stessa probabilità. L’animazione delle palline parte quando il risultato è già deciso e non lo influenza. Per questo ogni numero consentito è ugualmente probabile, e per questo lo strumento non può essere pilotato dal momento o dal modo in cui premi il pulsante."
      ]
    },
    {
      h: "La matematica delle combinazioni",
      p: [
        "Una lotteria è un problema di conteggio. In un gioco 6/45 esistono 8.145.060 insiemi diversi di sei numeri. In un gioco 5/50 più 2/12 ci sono 2.118.760 modi di scegliere i cinque numeri principali e 66 modi di scegliere le due stelle, per un totale di 139.838.160 combinazioni. In un gioco 5/69 più 1/26 ci sono 11.238.513 modi di scegliere i cinque numeri e 26 scelte per il Powerball, per un totale di 292.201.338 combinazioni. Più combinazioni ci sono, meno rappresenta una singola schedina.",
        "Ogni combinazione è esattamente probabile quanto ogni altra, compresa 1, 2, 3, 4, 5, 6. I risultati passati non cambiano le estrazioni future, quindi non esistono numeri caldi o freddi, e tenere o escludere numeri non cambia nulla delle probabilità. Una differenza reale è quanti altri giocatori scelgono gli stessi numeri. Molti puntano sulle date di nascita, quindi le combinazioni fatte solo di numeri piccoli probabilmente vengono condivise più spesso in caso di vincita, ma questo riguarda la divisione di un premio, non il fatto di vincerlo."
      ]
    },
    {
      h: "Modi di usare il generatore",
      p: [
        "Un selettore casuale equo e veloce è utile ben oltre la lotteria. La modalità personalizzata lo trasforma in una piccola cassetta degli attrezzi per tutto ciò che richiede numeri senza distorsioni."
      ],
      list: [
        "Estrarre numeri fortunati per divertimento, tenendo in ogni giocata un numero di compleanno o anniversario.",
        "Scegliere vincitori per una lotteria o un concorso numerando i partecipanti ed estraendo un numero.",
        "Creare serie di numeri in stile tombola o estrarre un numero da 1 a 100 per un gioco di società.",
        "Decidere chi inizia estraendo un numero di posto o di squadra.",
        "Insegnare la probabilità in classe confrontando molte estrazioni."
      ]
    },
    {
      h: "Giocare con responsabilità e privacy",
      p: [
        "Questo strumento non è un operatore di lotteria, non può vendere biglietti e non può prevedere né migliorare le tue probabilità di vincita. Se compri biglietti, considera il costo come una spesa per svago: fissa un budget in anticipo, compra solo da operatori autorizzati, rispetta i limiti di età del tuo paese e smetti quando non è più divertente. Se il gioco ti sta creando problemi, contatta un servizio di aiuto locale.",
        "I numeri che inserisci e quelli estratti vengono elaborati nel tuo browser e non vengono inviati al nostro server. Nulla delle tue giocate viene conservato. La pagina può ricordare preferenze di base, come la lingua. Usa il pulsante di copia se vuoi conservare un risultato."
      ]
    }
  ],
  cta: "Estrai i miei numeri"
};
