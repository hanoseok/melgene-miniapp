module.exports = {
  metaTitle: 'Guida al sudoku: regole, tecniche e un po’ di storia',
  description: 'Come si gioca a sudoku online: le regole, note e aiuti, le tecniche dal single all’X-Wing, il significato dei quattro livelli e una breve storia del celebre gioco di numeri.',
  h1: 'Sudoku: come si gioca, come risolverlo meglio e da dove viene',
  updated: '2026-10-12',
  intro: 'Il sudoku è un gioco di logica gratuito su una griglia di 9 caselle per 9. Alcune caselle contengono già un numero e il tuo compito è riempire le altre in modo che ogni riga, ogni colonna e ogni riquadro 3 per 3 contenga una sola volta i numeri da 1 a 9. Non serve fare calcoli e uno schema ben costruito non ti costringe mai a tirare a indovinare. In questa guida trovi le regole, i comandi su telefono e computer, le tecniche per passare da Facile a Esperto e un po’ della storia sorprendentemente internazionale di questo gioco.',
  sections: [
    {
      h: 'Che cos’è il sudoku e come funzionano le regole',
      p: [
        'La griglia ha 81 caselle, divise in nove righe, nove colonne e nove riquadri di tre per tre. Lo schema parte con alcuni numeri dati, di solito tra venti e quaranta, che non si possono modificare. Ogni casella vuota deve ricevere un numero da 1 a 9 e nessun numero può comparire due volte nella stessa riga, nella stessa colonna o nello stesso riquadro. Quando tutte le caselle sono piene senza violare questa regola, lo schema è risolto.',
        'In fondo i numeri sono solo nove simboli diversi: potresti giocare con lettere o colori e non cambierebbe nulla. Per questo il sudoku è un gioco di posizionamento ed esclusione, non un problema di matematica. Ogni griglia di questa pagina viene creata nel tuo browser e controllata da un risolutore prima di essere mostrata, quindi ha una e una sola soluzione e si completa soltanto ragionando.',
      ],
    },
    {
      h: 'Comandi e primi passi',
      p: [
        'Scegli un livello e tocca Nuovo sudoku. Tocca una casella vuota per selezionarla: la sua riga, la sua colonna e il suo riquadro si colorano leggermente per mostrarti cosa tocca, e se contiene già un numero tutte le sue copie vengono evidenziate nella griglia. Poi tocca un numero sul tastierino sotto la griglia. La cifra piccola sotto ogni numero indica quante copie mancano ancora, comoda per individuare i numeri quasi completati.',
        'La partita viene salvata in questo browser dopo ogni mossa. Se chiudi la pagina, la schermata iniziale ti proporrà Continua la partita con livello e tempo. Il cronometro si ferma appena passi a un’altra scheda o app, e la griglia resta coperta finché non torni: un’interruzione non ti costa nulla.',
      ],
      list: [
        'Note porta il tastierino in modalità matita: ogni numero toccato si scrive o si cancella in piccolo nella casella scelta.',
        'Cancella svuota la casella selezionata, Annulla torna indietro una mossa alla volta.',
        'Aiuto riempie per te una casella giusta. Ne hai tre per schema, e uno schema risolto con un aiuto non entra nel confronto dei tempi.',
        'Verifica mostra in rosso i numeri che non corrispondono alla soluzione. Senza Verifica vengono evidenziati solo i doppioni in una riga, colonna o riquadro.',
        'Al computer ti muovi con le frecce, inserisci con i tasti da 1 a 9, cancelli con Backspace, attivi le note con N e annulli con Z.',
      ],
    },
    {
      h: 'Le tecniche, dal single all’X-Wing',
      p: [
        'Quasi ogni schema comincia con i single. Un single nudo è una casella in cui riga, colonna e riquadro escludono già otto numeri su nove, quindi ne resta uno solo. Il single nascosto è il punto di vista opposto: in una riga, colonna o riquadro c’è una sola casella che può ospitare un certo numero. Passare in rassegna ogni numero su tre riquadri allineati è il modo più veloce per trovarli, e gli schemi facili di questa pagina si risolvono solo con queste due idee.',
        'I livelli Medio e Difficile chiedono qualcosa in più. Con il puntamento, se in un riquadro un numero può stare solo su una riga, quel numero non può comparire altrove su quella riga. Con la coppia nuda, due caselle dello stesso gruppo che hanno esattamente gli stessi due candidati si riservano quei due numeri, che puoi togliere dal resto del gruppo. Gli schemi difficili possono richiedere anche un tris nudo o un X-Wing, quando un numero è confinato nelle stesse due colonne su due righe diverse. Gli schemi Esperto hanno meno numeri dati e richiedono catene di ragionamento più lunghe.',
      ],
      list: [
        'Inizia a scrivere note solo quando i single sono finiti: servono soprattutto negli schemi difficili.',
        'Appena inserisci un numero, toglilo dalle note della sua riga, colonna e riquadro. Il gioco lo fa per te.',
        'Se sei bloccato, guarda sul tastierino quali numeri hanno solo una o due copie mancanti e concentrati su quelli.',
        'Non tirare mai a indovinare apposta. Se due possibilità sembrano valide, cerca una terza casella che decida.',
      ],
    },
    {
      h: 'Una breve storia del sudoku',
      p: [
        'Il gioco è più antico del suo nome. I quadrati latini, griglie in cui ogni simbolo compare una volta per riga e per colonna, furono studiati dal matematico Leonhard Euler nel Settecento, e negli anni Novanta dell’Ottocento alcuni giornali francesi pubblicavano giochi numerici con regole simili. La forma moderna, con i suoi nove riquadri, apparve nel 1979 in una rivista di enigmistica americana con il nome di Number Place ed è di solito attribuita all’autore di giochi Howard Garns.',
        'Nel 1984 l’editore giapponese Nikoli lo portò in Giappone e lo battezzò sudoku, abbreviazione di una frase che più o meno significa che ogni numero deve restare da solo. In Giappone è chiamato spesso anche Nanpure, da Number Place. La mania mondiale è esplosa nel 2004 e 2005, quando i quotidiani britannici hanno iniziato a pubblicarlo ogni giorno, e da allora il sudoku non è più uscito da giornali, riviste di enigmistica e telefoni.',
      ],
    },
    {
      h: 'Livelli, sudoku del giorno e confronti equi',
      p: [
        'I quattro livelli dipendono da due cose: quanti numeri dati restano e quali tecniche servono a un valutatore integrato per risolvere la griglia. Facile lascia molti numeri e si risolve con i soli single. Medio ne toglie di più e ammette esclusioni semplici. Difficile viene scelto in modo che serva almeno una tecnica intermedia, ed Esperto riduce la griglia al minimo di numeri dati mantenendo una soluzione unica. Il sudoku del giorno nasce dalla data, uno per livello e uguale per tutti nel mondo, e cambia a mezzanotte UTC: perfetto per sfidare un amico sullo stesso schema.',
        'Quando risolvi uno schema senza aiuti, il tuo tempo diventa il record di quel livello, salvato solo nel tuo browser, e la schermata finale mostra dove si colloca tra i tempi reali degli altri giocatori. Al nostro server arrivano soltanto il livello e un tempo arrotondato per difetto a blocchi di cinque secondi, mai il tuo nome, e il confronto resta nascosto finché non c’è nulla con cui confrontarsi.',
      ],
    },
  ],
  cta: 'Gioca a sudoku ora',
};
