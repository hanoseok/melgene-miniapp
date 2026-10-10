module.exports = {
  metaTitle: 'Generatore di numeri casuali: guida a estrazioni eque',
  description: 'Come usare il generatore di numeri casuali per lotterie, giveaway e in classe, cosa significa davvero casuale, numeri casuali veri e pseudocasuali e come fare un’estrazione equa.',
  h1: 'Generatore di numeri casuali: come si usa e come fare estrazioni davvero eque',
  updated: '2026-10-11',
  intro: 'Un generatore di numeri casuali sembra lo strumento più semplice del web: scrivi due numeri e ne ottieni un terzo. Eppure lo si usa per scegliere i vincitori, interrogare uno studente, estrarre numeri, campionare risposte a un sondaggio o chiudere una discussione, e ogni volta il risultato conta solo se tutti si fidano. Questa guida spiega come usare il generatore, dà idee per giveaway e scuola, chiarisce cosa vuol dire davvero casuale, confronta numeri casuali veri e pseudocasuali e chiude con qualche abitudine semplice per un’estrazione onesta.',
  sections: [
    {
      h: 'Come usare il generatore di numeri casuali',
      p: [
        'Tutto avviene in una sola schermata. Scrivi il numero più basso in Da e il più alto in A, oppure tocca un intervallo rapido come 1–10, 1–45 o 1–100. Entrambi gli estremi sono inclusi, quindi da 1 a 10 può uscire anche 1 o 10. Funzionano anche i numeri negativi, e ogni estremo può arrivare fino a un miliardo in entrambe le direzioni.',
        'Poi scegli quanti numeri estrarre, da uno a mille. Lascia spento Con ripetizioni se ogni numero può uscire una sola volta, come per i biglietti di una lotteria o i numeri dei posti. Attiva Ordina se preferisci leggerli dal più piccolo al più grande. In Altre opzioni puoi escludere numeri come il 13 o un intero tratto come 20-25 e dare un nome all’estrazione. Premi Estrai e le cifre girano come in una slot machine prima di fermarsi sul risultato.',
      ],
      list: [
        'Imposta Da e A, oppure tocca un intervallo rapido.',
        'Scegli quanti numeri ti servono.',
        'Decidi se ammettere ripetizioni e se ordinare.',
        'Se serve, escludi numeri e dai un nome all’estrazione.',
        'Premi Estrai, poi copia i numeri o il link del risultato.',
      ],
    },
    {
      h: 'Idee per giveaway, lotterie e scuola',
      p: [
        'Quasi ogni uso consiste nel dare un numero a ogni persona o oggetto e lasciare che sia il generatore a scegliere. Per un giveaway su Instagram, numera le partecipazioni valide in ordine di arrivo, estrai un numero per premio senza ripetizioni e pubblica il link del risultato: i follower vedranno l’estrazione esatta con ora e impostazioni. Un nome come Giveaway di ottobre viaggia insieme al link.',
        'Gli insegnanti usano i numeri casuali per essere imparziali e aggiungere un po’ di suspense. Se ogni studente ha il suo numero del registro, nessuno può dire che tocca sempre agli stessi.',
      ],
      list: [
        'Lotteria: imposta l’intervallo sui biglietti venduti ed estrai un vincitore per premio.',
        'Giveaway nei commenti: numera le partecipazioni valide, estrai senza ripetizioni e condividi il link.',
        'In classe: scegli chi risponde, forma coppie a caso o decidi l’ordine delle presentazioni.',
        'In ufficio: l’ordine del Babbo Natale segreto, chi verbalizza o un posto per pranzo da una lista numerata.',
        'Gioco e studio: numeri per il calcolo a mente, una pagina da leggere o un dado con le facce che vuoi.',
      ],
    },
    {
      h: 'Cosa vuol dire davvero «a caso»',
      p: [
        'Un’estrazione è casuale quando ogni risultato ammesso ha la stessa probabilità e nessuno può prevedere il successivo, né chi preme il pulsante né chi ha scritto il codice. Casuale non significa distribuito in modo uniforme su pochi tentativi. Se estrai più volte da 1 a 10, ripetizioni e serie sono normali: far uscire il 7 due volte di fila è probabile esattamente quanto far uscire il 3 e poi l’8.',
        'Le persone sono notoriamente pessime a fare le cose a caso. Se chiedi un numero da 1 a 10, molti dicono 7 e pochi dicono 1 o 10; quando proviamo a scrivere una sequenza casuale evitiamo le ripetizioni molto più di quanto farebbe il caso. Per questo un generatore è utile anche per decidere chi comincia: elimina le abitudini nascoste nelle nostre scelte.',
      ],
    },
    {
      h: 'Caso vero, pseudocasuale e generatore crittografico',
      p: [
        'Un computer esegue istruzioni, quindi non può inventare la casualità dal nulla. Un generatore pseudocasuale parte da un valore chiamato seme e applica una formula per produrre una lunga sequenza che sembra casuale. Le versioni semplici bastano per i giochi, ma possono essere prevedibili e nascondere schemi sottili. I numeri casuali veri nascono dal rumore fisico, come il rumore termico dei componenti o le minime variazioni di tempo dell’hardware.',
        'I browser moderni offrono un generatore crittograficamente sicuro, crypto.getRandomValues, ed è quello che usa questo strumento. Il sistema operativo lo alimenta con il rumore dell’hardware ed è progettato in modo che i valori passati non rivelino quelli futuri, per questo si usa anche per le chiavi di sicurezza. In più lo strumento evita un errore classico, la distorsione del modulo: ridurre un grande numero casuale a un piccolo intervallo con un semplice resto dà ad alcuni numeri una minuscola probabilità in più. Il generatore scarta quei valori in eccesso ed estrae di nuovo, così ogni numero dell’intervallo ha esattamente la stessa probabilità. Per le estrazioni senza ripetizioni usa un metodo di mescolamento che funziona anche su due miliardi di numeri possibili.',
      ],
    },
    {
      h: 'Consigli per un’estrazione equa e trasparente',
      p: [
        'Uno strumento equo è solo metà di un’estrazione equa. L’altra metà è organizzarla in modo che nessuno possa dubitare del risultato dopo.',
      ],
      list: [
        'Annuncia prima le regole: l’intervallo, come si numerano i partecipanti e quanti vincitori ci saranno.',
        'Blocca la lista dei partecipanti prima di estrarre e tieni traccia di chi ha quale numero.',
        'Estrai una volta e tieni il risultato. Ripetere finché non piace non ha senso.',
        'Condividi il link del risultato: contiene numeri, impostazioni e ora, quindi tutti vedono l’estrazione originale e non una nuova.',
        'Davanti a un pubblico, estrai su uno schermo condiviso o in diretta così tutti vedono fermarsi i numeri.',
        'Escludi solo numeri davvero non validi, come biglietti invenduti, e dichiaralo apertamente.',
      ],
    },
  ],
  cta: 'Estrai numeri casuali ora',
};
