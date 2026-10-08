module.exports = {
  "metaTitle": "Gioco 2048: come giocare, strategia e storia",
  "description": "Impara a giocare a 2048, perché funziona la strategia dell'angolo, come si calcola il punteggio e da dove viene il gioco. Poi gioca gratis.",
  "h1": "Gioco 2048: come giocare e raggiungere la tessera 2048",
  "updated": "2026-10-09",
  "intro": "2048 sembra semplice: far scorrere tessere numerate su una griglia quattro per quattro e unire quelle uguali. Eppure ha una profondità sorprendente. Questa guida spiega le regole, il punteggio, le tecniche dei giocatori esperti e la breve storia di uno dei rompicapi più copiati dell'ultimo decennio.",
  "sections": [
    {
      "h": "Come si gioca",
      "p": [
        "La griglia è di quattro per quattro con un paio di tessere numerate. Scorri sulla griglia o premi le frecce (oppure W, A, S, D) e tutte le tessere scivolano il più lontano possibile in quella direzione. Quando due tessere con lo stesso numero si scontrano, si uniscono in una tessera con valore doppio: due 2 diventano un 4 e due 64 diventano un 128.",
        "Dopo ogni mossa che cambia davvero la griglia, compare una nuova tessera in una casella vuota. Per lo più è un 2 e circa una volta su dieci un 4. Se il tuo scorrimento non muove nulla, non si aggiunge nessuna tessera. L'obiettivo è creare una tessera con il numero 2048. Quando ci riesci, puoi continuare per un punteggio più alto o fermarti lì."
      ],
      "list": [
        "Scorri o usa i tasti per muovere tutte le tessere insieme.",
        "Due vicine uguali si uniscono in una tessera dal valore doppio.",
        "Compare un nuovo 2 o 4 dopo ogni mossa che cambia la griglia.",
        "La partita finisce quando la griglia è piena e nessuna vicina è uguale."
      ]
    },
    {
      "h": "Regole da conoscere",
      "p": [
        "Una tessera può unirsi una sola volta per mossa. Se una riga contiene 2, 2, 2, 2, uno scorrimento produce due 4, non un 8, e la coppia più vicina alla parete verso cui scorri si unisce per prima. Il dettaglio conta quando pianifichi una catena di unioni.",
        "Non c'è timer né annulla, quindi ogni mossa è definitiva. Il punteggio sale del valore di ogni nuova tessera creata, quindi un'unione che produce un 512 vale 512 punti. Le unioni grandi valgono molto più di quelle piccole. Il tuo punteggio migliore viene salvato in questo browser e, quando la partita finisce, il tuo risultato può essere confrontato in forma anonima con quello di altri giocatori per mostrare una percentuale."
      ]
    },
    {
      "h": "Strategia: tieni la tessera più grande in un angolo",
      "p": [
        "L'abitudine più utile è scegliere un angolo e tenerci la tessera più grande. Costruisci lungo il bordo una catena decrescente, con la più grande nell'angolo, la successiva accanto e così via, come un serpente. Poiché le tessere della catena hanno valori vicini, si uniscono in sequenza invece di bloccarsi.",
        "Scegli due direzioni principali, per esempio giù e sinistra se il tuo angolo è in basso a sinistra. Usa la terza solo quando serve e cerca di non usare mai la quarta, perché è la mossa che trascina la tessera grande fuori dall'angolo. Se sei costretto, controlla prima che la riga dell'angolo sia piena, così la tessera non può scappare."
      ],
      "list": [
        "Scegli un angolo e lascia lì la tessera più grande.",
        "Preferisci due direzioni principali e usa la terza con parsimonia.",
        "Riempi la riga della catena prima di costruire la successiva.",
        "Unisci le tessere piccole vicino alla catena, non lontano."
      ]
    },
    {
      "h": "Errori comuni",
      "p": [
        "I principianti spesso scorrono in tutte e quattro le direzioni per inseguire unioni facili. Così le tessere grandi si sparpagliano sulla griglia e quelle piccole restano intrappolate in mezzo. Un altro errore è sprecare mosse in unioni minuscole mentre una tessera grande non ha compagne vicine.",
        "Guarda una o due mosse avanti. Prima di ogni scorrimento, chiediti dove potrebbe cadere la nuova tessera e se la mossa libera o blocca una riga. Quando la griglia si riempie, rallenta: un solo gesto distratto può chiudere la partita, mentre la pazienza può salvare una posizione confusa."
      ]
    },
    {
      "h": "Da dove viene 2048",
      "p": [
        "2048 è stato creato dallo sviluppatore italiano Gabriele Cirulli nel marzo 2014 come progetto da weekend. Si è ispirato a giochi precedenti come 1024 e Threes e ha pubblicato il codice in forma aperta, dando origine a innumerevoli varianti e cloni. Il numero 2048 è due elevato alla undicesima e, in teoria, una griglia quattro per quattro può arrivare a una tessera di 131072.",
        "Questa versione aggiunge un'atmosfera di Halloween, ma le regole sono quelle classiche. Gioca qualche partita, prova la strategia dell'angolo e condividi il punteggio con un amico per vedere chi arriva più lontano."
      ]
    }
  ],
  "cta": "Gioca a 2048"
};
