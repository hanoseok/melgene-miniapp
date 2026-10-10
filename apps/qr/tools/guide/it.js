module.exports = {
  metaTitle: 'Guida ai QR code: creare, stampare e scansionare',
  description: 'Come funziona un QR code, come crearne uno per un link o il Wi-Fi, consigli di stampa su dimensioni, contrasto e correzione d’errore, la sua storia e come scansionare in sicurezza.',
  h1: 'Come creare un QR code che funziona al primo colpo',
  updated: '2026-10-11',
  intro: 'I QR code sono ovunque: sui tavoli dei ristoranti, sui biglietti dei concerti, sui pacchi e sui manifesti. Sembrano rumore casuale, ma ogni quadratino ha un compito. Questa guida spiega che cosa contiene davvero un QR code, come crearne uno per un link, un messaggio o la tua rete Wi-Fi, come stamparlo perché venga letto subito, da dove nasce l’idea e come restare al sicuro quando scansioni codici fatti da altri.',
  sections: [
    {
      h: 'Che cos’è un QR code',
      p: [
        'QR sta per Quick Response, «risposta rapida». Un QR code è un codice a barre bidimensionale: invece di una fila di linee, memorizza le informazioni in una griglia quadrata di celle scure e chiare chiamate moduli. I tre quadrati grandi negli angoli sono i riferimenti di posizione. Dicono alla fotocamera dove si trova il codice, come è ruotato e quanto è grande: per questo puoi scansionarlo capovolto o di sbieco.',
        'Il resto della griglia contiene i tuoi dati e altri dati di correzione d’errore calcolati con i codici di Reed-Solomon, la stessa matematica usata nei CD e nelle sonde spaziali. Grazie a questa ridondanza, il lettore può ricostruire il contenuto anche se una parte del codice è sporca, strappata o coperta. La versione più piccola, la 1, misura 21 × 21 moduli; la più grande, la 40, ne misura 177 × 177 e contiene quasi tremila byte. Più il contenuto è lungo, più la griglia diventa grande e fitta.'
      ]
    },
    {
      h: 'Come creare un QR code qui',
      p: [
        'Il generatore funziona interamente nel tuo browser. Il codice viene calcolato sul tuo dispositivo mentre scrivi, quindi nulla viene caricato, registrato o salvato, e non serve creare un account.'
      ],
      list: [
        'Scegli cosa deve contenere il codice: un link, un testo, l’accesso al Wi-Fi, un’e-mail o un numero di telefono.',
        'Compila i campi. Se scrivi un indirizzo senza https://, viene aggiunto da solo così lo smartphone lo apre come link.',
        'Guarda l’anteprima in tempo reale. Apri le opzioni per cambiare colori, correzione d’errore, dimensione dell’immagine o zona di rispetto.',
        'Scarica un PNG per schermi e documenti, o un SVG per la stampa. Nei browser compatibili puoi anche copiare l’immagine direttamente.',
        'Prova il risultato con il tuo smartphone prima di condividerlo o stamparlo.'
      ]
    },
    {
      h: 'QR code del Wi-Fi per gli ospiti',
      p: [
        'Con un QR code del Wi-Fi gli ospiti non devono digitare la lunga password scritta sotto il modem. Il codice salva nome della rete, password e tipo di sicurezza in un formato di testo standard che inizia con WIFI:. Le fotocamere integrate di iPhone e Android riconoscono questo formato e propongono di connettersi con un tocco.',
        'Scegli la stessa sicurezza impostata sul modem. Quasi tutti i modem recenti usano WPA2 o WPA3, che rientrano entrambi in WPA. Scegli «Senza password» solo per le reti aperte e spunta «Rete nascosta» se il modem non trasmette il nome. Caratteri speciali come punto e virgola, virgole, due punti e virgolette vengono gestiti automaticamente. Se cambi la password del Wi-Fi, crea un nuovo codice: quello vecchio smetterà di funzionare.'
      ]
    },
    {
      h: 'Consigli di stampa: dimensioni, contrasto e correzione',
      p: [
        'Quasi tutti i problemi di scansione nascono dalla stampa, non dal codice. Poche regole semplici fanno una grande differenza.'
      ],
      list: [
        'Dimensioni: come regola pratica, il codice deve essere largo almeno un decimo della distanza di lettura. Un codice letto da 30 cm deve misurare circa 3 cm; un manifesto visto da 3 m circa 30 cm.',
        'Contrasto: codice scuro su sfondo chiaro. Il nero su bianco è il più sicuro. Colori tenui, sfumature e codici chiari su sfondo scuro confondono molti lettori, per questo il generatore avvisa quando il contrasto è basso.',
        'Zona di rispetto: lascia un bordo vuoto intorno al codice. Lo standard chiede quattro moduli, e testi o immagini attaccati al bordo sono una causa frequente di errori.',
        'Correzione d’errore: il livello L recupera circa il 7 % dei danni, M il 15 %, Q il 25 % e H il 30 %. M per l’uso quotidiano, Q o H per adesivi, insegne all’aperto o codici con un piccolo logo sopra, L quando un testo lungo deve stare in un codice piccolo sullo schermo.',
        'Lunghezza del contenuto: a parità di dimensione di stampa, meno contenuto significa moduli più grandi. Meglio un link breve che un indirizzo lunghissimo.'
      ]
    },
    {
      h: 'Breve storia del QR code',
      p: [
        'Il QR code è stato inventato nel 1994 da Masahiro Hara e dal suo gruppo in Denso Wave, allora una divisione del produttore giapponese di componenti auto Denso, del gruppo Toyota. Nelle fabbriche i pezzi venivano tracciati con normali codici a barre e gli operai dovevano scansionare più etichette per ogni cassa, perché ogni codice conteneva solo una ventina di caratteri. Hara voleva un codice capace di contenere molti più dati e di essere letto velocissimo da qualsiasi direzione.',
        'I quadrati di posizione hanno un rapporto tra bianco e nero che quasi non compare nei testi o nelle immagini stampate, così il lettore li trova all’istante. Denso Wave possedeva il brevetto ma scelse di non farlo valere, e il formato divenne norma internazionale ISO nel 2000. Quando le fotocamere degli smartphone hanno imparato a leggerli in modo nativo, i QR code sono arrivati nei pagamenti, nelle carte d’imbarco, nei menù e in molto altro. Il nome QR Code è ancora un marchio registrato di Denso Wave.'
      ]
    },
    {
      h: 'Scansionare in sicurezza',
      p: [
        'Un QR code è solo un contenitore e chiunque può stamparne uno. A volte i truffatori incollano codici falsi sopra quelli veri su parchimetri, manifesti o tavoli dei ristoranti, per portare le persone su pagine di pagamento o di accesso contraffatte. Prima di aprire un link, leggi l’indirizzo mostrato dalla fotocamera e controlla che appartenga all’attività che ti aspetti. Diffida dei codici che chiedono dati della carta, password o di installare app, e non scansionare mai un codice arrivato in un messaggio inatteso che ti mette fretta.',
        'Quando crei i tuoi codici vale lo stesso al contrario: usa link che controlli, prova il codice prima di stampare e, se lo esponi in un luogo pubblico, controlla ogni tanto che nessuno lo abbia coperto con un adesivo.'
      ]
    }
  ],
  cta: 'Crea un QR code ora'
};
