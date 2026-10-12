module.exports = {
  metaTitle: 'Sorteggio dei posti in classe: guida, regole e consigli',
  description: 'Come gli insegnanti usano il sorteggio dei posti: preparare l’aula, separare due alunni, prime file e posti fissi, ogni quanto cambiare e perché i nomi restano privati.',
  h1: 'Sorteggio dei posti: banchi equi per tutta la classe',
  updated: '2026-10-13',
  intro: 'Cambiare i posti è un piccolo rito dell’anno scolastico, ed è sorprendentemente facile sbagliarlo. Se decide l’insegnante da solo, qualcuno si sente sempre preso di mira. Se scelgono gli alunni, gli stessi amici si raggruppano e i più timidi finiscono ai lati. Il sorteggio dei posti risolve entrambi i problemi: decide il caso, tutti vedono che ha deciso il caso e l’insegnante tiene in mano le poche regole che contano davvero. Questa guida spiega lo strumento, mostra come i docenti usano la disposizione casuale, descrive le regole che puoi aggiungere e chiarisce cosa succede ai nomi che scrivi.',
  sections: [
    {
      h: 'Come fare il sorteggio dei posti',
      p: [
        'Parti dai nomi. Incolla l’elenco della classe con un nome per riga oppure separali con delle virgole. Se preferisci non scrivere nomi, inserisci un solo numero, per esempio 28: la piantina userà i numeri da 1 a 28, comodo se lavori con i numeri del registro. Una piantina accetta fino a 100 nomi.',
        'Poi disegna l’aula. Scegli quante file di banchi ci sono e quanti posti ha ogni fila. La mappa mostra l’aula dal punto di vista degli alunni, con la cattedra in alto, quindi la prima fila sullo schermo è quella più vicina alla lavagna. Tocca un posto per barrarlo quando deve restare vuoto, per esempio un corridoio, un banco rotto o il posto vicino alla porta. Quando tutto somiglia alla tua classe, premi Sorteggia e guarda i posti girarsi uno alla volta, oppure salta l’animazione se sta per suonare la campanella.',
      ],
      list: [
        'Incolla i nomi o scrivi quanti alunni hai.',
        'Imposta le file e i banchi per fila.',
        'Tocca i posti che devono restare vuoti.',
        'Se serve, aggiungi regole: separare, prime file o posti fissi.',
        'Sorteggia, poi salva il PNG, copia la tabella di testo o il link.',
      ],
    },
    {
      h: 'Come i docenti usano la disposizione casuale',
      p: [
        'La maggior parte cambia i posti con un ritmo fisso: ogni mese, a ogni quadrimestre o all’inizio di una nuova unità. Un calendario noto conta più dell’intervallo esatto, perché un alunno accetta molto meglio un posto che non gli piace quando sa che è temporaneo.',
        'Il modo migliore è sorteggiare davanti alla classe. Proietta lo schermo sulla LIM, lascia che i posti si girino uno alla volta e il sorteggio diventa un piccolo momento condiviso invece di una decisione contestata. Dopo, salva la piantina in PNG per le slide o per appenderla, oppure copiala come tabella di testo nelle comunicazioni o nelle istruzioni per una supplenza.',
      ],
      list: [
        'Inizio anno: mescolare alunni che non si conoscono ancora.',
        'Lavori di gruppo: sistemare a caso e poi unire i banchi vicini in squadre.',
        'Verifiche: evitare che gli amici siano accanto.',
        'Supplenze: lasciare una piantina stampata perché il collega conosca ogni nome.',
      ],
    },
    {
      h: 'Regole: separare, prime file e posti fissi',
      p: [
        'Il caso puro è equo, ma una classe ha esigenze reali. In Regole dei posti puoi aggiungere coppie da separare: quei due alunni non saranno mai vicini, nemmeno in diagonale. Puoi mettere alunni nell’elenco delle prime file perché finiscano sempre nelle prime due, utile per chi porta gli occhiali, sente poco o fatica a concentrarsi, senza metterlo in evidenza. E puoi fissare un nome a un posto preciso, per esempio per un alunno che deve stare vicino alla porta o accanto all’insegnante di sostegno.',
        'Usa le regole con misura. Ogni regola toglie un po’ di casualità e, in un’aula piena, troppe regole possono rendere impossibile qualsiasi piantina. Quando succede, lo strumento te lo dice invece di infrangere una regola di nascosto e ti suggerisce di togliere una coppia o un posto fisso, oppure di aggiungere posti. Una buona abitudine è tenere solo le regole che potresti spiegare alla classe.',
      ],
    },
    {
      h: 'Perché il sorteggio è equo',
      p: [
        'Ogni piantina viene estratta con il generatore casuale crittografico del browser, lo stesso tipo di casualità usato per le chiavi di sicurezza. Lo strumento usa il campionamento per rifiuto per evitare minuscole distorsioni quando i bit casuali diventano numeri di posto, poi un mescolamento Fisher–Yates, che dà la stessa probabilità a ogni disposizione possibile. Con coppie da separare, ripete l’estrazione di piantine complete finché non ne trova una che rispetta tutte le regole, così tutte le piantine valide restano ugualmente probabili. Solo nelle aule molto strette passa a una ricerca accurata per trovare una disposizione che funzioni.',
        'La piantina è decisa prima che parta l’animazione. I posti che si girano mostrano soltanto un risultato già fissato, quindi premere Salta non cambia chi siede dove.',
      ],
    },
    {
      h: 'Condividere la piantina e proteggere i nomi',
      p: [
        'I nomi che scrivi non lasciano mai il tuo browser. Non c’è un account e niente viene caricato su un server. L’ultimo elenco e la disposizione dell’aula vengono ricordati solo sul tuo dispositivo per la volta successiva, e il pulsante Cancella li elimina.',
        'Quando copi il link, i nomi e la disposizione esatta vengono scritti nel link stesso. Chi lo apre vede la stessa piantina, segnata come condivisa, senza un nuovo sorteggio: comodo da mandare a un collega o nel gruppo della classe. Poiché i nomi viaggiano nel link, evita di pubblicare link con nomi e cognomi in luoghi pubblici. Nomi di battesimo, iniziali o numeri di solito bastano.',
      ],
    },
  ],
  cta: 'Sorteggia i posti adesso',
};
