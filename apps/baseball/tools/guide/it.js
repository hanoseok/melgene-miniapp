module.exports = {
  metaTitle: 'Tori e vacche: come si gioca, trucchi e storia del gioco',
  description: 'Come giocare a Tori e vacche (Bulls and Cows, baseball dei numeri): le regole, come leggere gli indizi, trucchi di ragionamento e la storia del gioco e del suo legame con Mastermind.',
  h1: 'Tori e vacche (baseball dei numeri): come si gioca e come ragionare',
  updated: '2026-10-18',
  intro: 'Tori e vacche è un classico gioco di decifrazione per un solo giocatore: un numero segreto resta nascosto, tu provi e ogni tentativo ti regala un piccolo indizio. In molti paesi si chiama baseball dei numeri perché gli indizi si chiamano strike, ball e out. Questa guida spiega le regole della versione di questo sito, come leggere gli indizi, alcuni modi di ragionare che rendono il rompicapo più semplice, da dove nasce il gioco e come divertirsi con gli amici.',
  sections: [
    {
      h: 'Che cos’è Tori e vacche',
      p: [
        'Il computer sceglie un numero segreto fatto di cifre tutte diverse. Nel livello classico ha 3 cifre, in quello più difficile 4. Una cifra non compare mai due volte, ma lo zero è ammesso, anche all’inizio, quindi 072 è un numero segreto del tutto valido. Ci sono così 720 numeri possibili con tre cifre e 5.040 con quattro, e ciascuno è ugualmente probabile perché le cifre vengono mescolate in modo equo a ogni round.',
        'Il tuo obiettivo è trovare il numero con meno tentativi possibile. Dopo ogni tentativo ti dicono quanto eri vicino, ma non quali cifre erano giuste, ed è da qui che nasce il rompicapo. Senza cronometro non c’è limite di tempo e non esiste un pulsante di aiuto, quindi tutto il gioco si basa su un ragionamento attento.',
      ],
    },
    {
      h: 'Come funziona un round',
      p: [
        'Scegli 3 o 4 cifre nella schermata iniziale e tocca Inizia. Inserisci un numero della stessa lunghezza con la tastiera sullo schermo o con quella del dispositivo, poi tocca Prova. Il tentativo non può ripetere una cifra e un numero già provato non viene contato di nuovo.',
      ],
      list: [
        'Un toro (strike) è una cifra giusta al posto giusto.',
        'Una vacca (ball) è una cifra presente nel numero segreto ma in un’altra posizione.',
        '“Niente” (out) significa che nessuna delle tue cifre compare nel numero segreto.',
        'Vinci quando tutte le cifre sono tori. Il risultato mostra quanti tentativi ti sono serviti.',
        'Se ti blocchi, tocca Mi arrendo due volte per vedere la risposta e iniziare un nuovo round. Un round abbandonato non conta per i tuoi record.',
      ],
    },
    {
      h: 'Modi di pensare che aiutano',
      p: [
        'I principianti spesso provano numeri a caso sperando nella fortuna. Un’abitudine migliore è trattare ogni risposta come un piccolo fatto e annotare che cosa esclude. Anche un semplice taccuino, su carta o nella testa, rende il gioco molto meno simile a una lotteria.',
      ],
      list: [
        'Somma tori e vacche. Il totale ti dice quante delle tue cifre sono nel numero segreto, in qualunque posizione.',
        '“Niente” è un’informazione preziosa. Esclude in un colpo solo tutte le cifre usate e non devi più pensarci.',
        'Cambia solo una o due cose tra un tentativo e l’altro. Se l’indizio cambia, sai che la cifra sostituita ne è la causa.',
        'Verifica separatamente cifre e posizioni. Quando sai che una cifra c’è, spostala per scoprire dove sta.',
        'Fai in modo che ogni tentativo possa ancora essere la soluzione. Se contraddice ciò che già sai, non può vincere e ti fa sprecare un turno.',
        'Non aggrapparti al primo colpo di fortuna. Controlla che sia coerente con tutti gli indizi precedenti prima di costruirci sopra.',
      ],
    },
    {
      h: 'Da dove viene il gioco',
      p: [
        'Tori e vacche è un vecchio gioco con carta e matita, di solito per due persone che si alternano come ideatore del codice e indovino. È considerato l’antenato di Mastermind, il gioco da tavolo con i pioli colorati pubblicato all’inizio degli anni Settanta. Nello stesso decennio una versione per computer chiamata Moo girava su un grande elaboratore dell’Università di Cambridge, e da allora il gioco è un esercizio amato dai programmatori.',
        'L’idea ha viaggiato con nomi diversi. In Corea è il baseball dei numeri, il cui vocabolario segue questa pagina; in Giappone si dice spesso Hit and Blow, in Cina 1A2B, e in lingue come russo e spagnolo si usano i nomi di tori e vacche. I computer hanno dimostrato che, giocando alla perfezione, ogni numero segreto di quattro cifre si risolve in al massimo sette tentativi e in poco più di cinque in media: avvicinarsi a questi valori è un ottimo risultato per una persona.',
      ],
    },
    {
      h: 'Giocare con gli amici e seguire i progressi',
      p: [
        'Il gioco si trasforma facilmente in una sfida amichevole. Accordatevi sul numero di cifre, giocate tutti qualche volta lo stesso livello e confrontate chi ha bisogno di meno tentativi. Poiché l’unica cosa nascosta è il numero segreto, dopo un round potete anche discutere del vostro ragionamento, un bel modo per imparare nuovi trucchi.',
        'Il tuo record per ogni livello viene salvato solo in questo browser. Quando risolvi un round, il tuo numero di tentativi viene confrontato con i risultati reali di altri giocatori dello stesso livello, e se non c’è ancora nulla da confrontare, il confronto semplicemente non compare. Prova a battere il tuo record, poi affronta il livello a quattro cifre per una sfida maggiore.',
      ],
    },
  ],
  cta: 'Gioca a Tori e vacche',
};
