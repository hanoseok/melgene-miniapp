module.exports = {
  metaTitle: 'Tabellone torneo: bye, teste di serie e sorteggio equo',
  description: 'Come funziona un tabellone a eliminazione diretta, cosa sono i bye e le teste di serie, come usarlo per serate giochi, ufficio, sport o sfide tra preferiti, e perché il sorteggio casuale è equo.',
  h1: 'Tabellone torneo: eliminazione diretta, bye e teste di serie',
  updated: '2026-10-30',
  intro: 'Un tabellone è il modo più semplice per trasformare una lunga lista in un solo vincitore. Due si sfidano, uno passa, e a ogni turno il tabellone si dimezza fino al campione. Questa guida spiega come si costruisce un tabellone a eliminazione diretta, perché qualcuno riceve un bye, cosa vuol dire testa di serie, come usarlo per una serata giochi, una gara in ufficio, lo sport o un divertente mondiale dei preferiti, e perché un sorteggio davvero casuale è il punto di partenza più equo.',
  sections: [
    {
      h: 'Come funziona l’eliminazione diretta',
      p: [
        'Nell’eliminazione diretta ogni partita ha un vincitore e un perdente, e chi perde è fuori. Con 8 partecipanti si giocano 4 quarti di finale, 2 semifinali e 1 finale. Ne deriva una regola semplice: ogni partita elimina esattamente uno, quindi un tabellone con n partecipanti richiede sempre n − 1 partite per avere un campione. Sedici partecipanti, 15 partite; 64 partecipanti, 63.',
        'I turni si chiamano contando dalla fine: la finale ne ha 2, le semifinali 4, i quarti 8, e prima ci sono ottavi e sedicesimi. In questa app puoi scegliere tu i vincitori, due carte alla volta, oppure fare solo il sorteggio e toccare i vincitori più tardi, man mano che si giocano le partite vere.',
      ],
      list: [
        'Scrivi da 2 a 64 nomi o voci, uno per riga.',
        'Scegli il sorteggio casuale o tieni il tuo ordine come teste di serie.',
        'Scegli i vincitori sfida per sfida, o fai solo il sorteggio.',
        'Annulla una scelta o tocca l’altro nome se cambi idea.',
        'Salva il tabellone in PNG, copialo come testo o condividi un link.',
      ],
    },
    {
      h: 'I bye: quando i numeri non tornano',
      p: [
        'Un tabellone si divide a metà in modo pulito solo se i posti sono una potenza di due: 2, 4, 8, 16, 32 o 64. I gruppi veri raramente lo sono. Con 6 giocatori il tabellone ha comunque 8 posti, quindi due restano vuoti. Chi capita contro un posto vuoto riceve un bye e passa al turno successivo senza giocare.',
        'I bye vanno distribuiti, non ammucchiati. Un buon tabellone non mette mai due posti vuoti uno contro l’altro e divide i bye nel modo più uniforme possibile tra metà alta e metà bassa, così nessun lato ha una strada più facile. L’app colloca i bye secondo lo schema classico delle teste di serie, che fa proprio questo, e non conta mai un bye come partita.',
      ],
    },
    {
      h: 'Teste di serie: sorteggio o il tuo ordine',
      p: [
        'Le teste di serie decidono da dove parte ciascuno. Nello sport si ordinano i partecipanti perché i più forti si incontrino il più tardi possibile: la n. 1 gioca prima contro la più bassa, la n. 2 va nell’altra metà, e così via. Se nell’app tieni il tuo ordine, la lista diventa l’ordine delle teste di serie: la prima riga è la n. 1, la seconda la n. 2, e le migliori ricevono i bye per prime.',
        'Quando nessuno deve essere avvantaggiato, usa il sorteggio. È perfetto per una serata tra amici, una lotteria, una lista di piatti o film, o qualsiasi gruppo in cui non vuoi essere accusato di aver truccato gli accoppiamenti.',
      ],
    },
    {
      h: 'Perché il sorteggio casuale è equo',
      p: [
        'Un sorteggio è equo solo se ogni ordine possibile ha la stessa probabilità. Molti strumenti veloci mescolano con una casualità debole o con un trucco di ordinamento che favorisce di nascosto alcune posizioni. Questa app usa il generatore casuale crittografico del browser e l’algoritmo di Fisher–Yates con campionamento a rifiuto, che elimina anche la piccola distorsione che nasce quando si riduce un numero casuale a un intervallo più piccolo. Così ogni disposizione della tua lista ha esattamente la stessa probabilità, e nessuno, nemmeno chi tiene il telefono, sceglie chi incontra chi.',
        'Essere equi significa anche avere un tabellone sempre coerente. Se cambi un vincitore in un turno precedente, tutti i risultati successivi che ne dipendevano vengono cancellati, quindi un nome non può mai comparire in un turno che non ha raggiunto.',
      ],
    },
    {
      h: 'Idee: serate giochi, ufficio, sport e mondiali dei preferiti',
      p: [
        'In una serata giochi inserisci i nomi di tutti, fai il sorteggio e giocate partite vere di ping-pong, videogiochi o morra cinese, toccando ogni vincitore. In ufficio un tabellone è un modo leggero per votare il pranzo di squadra, il nome di un progetto o la tazza più bella della cucina. Club e piccoli campionati possono sorteggiare una coppa a eliminazione diretta, salvare l’immagine e pubblicarla nel gruppo.',
        'In Corea questo formato è famoso come mondiale del tipo ideale: scegli il preferito tra due, turno dopo turno, finché ne resta uno. Provalo con piatti, canzoni, mete di viaggio o qualunque cosa su cui non riesci a decidere. La scelta finale spesso sorprende, ed è metà del divertimento. Alla fine condividi il link perché gli amici vedano tutto il tuo percorso fino al campione.',
      ],
    },
  ],
  cta: 'Crea un tabellone torneo',
};
