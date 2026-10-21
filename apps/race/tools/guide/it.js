module.exports = {
  metaTitle: 'Corsa di animali: guida al sorteggio con una gara',
  description: 'Come usare la corsa di animali per scegliere un vincitore o decidere chi offre il caffè: preparare i corridori, perché ogni nome ha la stessa probabilità, idee per ufficio e feste e una breve storia del sorteggio.',
  h1: 'Corsa di animali: lasciare che una gara decida, in modo equo',
  updated: '2026-10-22',
  intro: 'Ci sono decisioni troppo piccole per discuterne e troppo imbarazzanti da prendere da soli: chi offre il prossimo giro di caffè, chi presenta per primo, chi mangia l’ultima fetta. La corsa di animali trasforma quel momento in un piccolo spettacolo. Ogni persona ha un animale nella sua corsia, parte un conto alla rovescia e gli animali scattano verso il traguardo tra accelerazioni, inciampi e arrivi al fotofinish. Quando si posa la polvere, sai chi è arrivato primo e chi ultimo. Questa guida spiega come usarla, perché il risultato è davvero casuale, idee per gruppi diversi e un po’ di storia.',
  sections: [
    {
      h: 'Come usare la corsa',
      p: [
        'Per prima cosa scegli cosa decide la gara. Con «Vince il 1°», il primo animale a tagliare il traguardo è il vincitore, perfetto per un premio, scegliere un volontario o decidere chi comincia una partita. Con «Paga l’ultimo», al corridore più lento tocca qualcosa: offrire il caffè, lavare le tazze o cantare la prossima al karaoke.',
        'Poi imposta il numero di corridori, da 2 a 10, e scrivi un nome in ogni corsia. Se hai fretta puoi lasciare corsie vuote: corrono con un nome predefinito come Giocatore 3. Premi via: dopo un conto alla rovescia di tre secondi, la gara dura circa sei-nove secondi e poi compare l’ordine d’arrivo, con le medaglie per i primi tre e il posto decisivo evidenziato.',
      ],
      list: [
        'Scegli la modalità: vince il primo o paga l’ultimo.',
        'Imposta quanti corridori ci sono e scrivi un nome per corsia.',
        'Premi via e guarda il conto alla rovescia e la gara.',
        'Leggi l’ordine d’arrivo, poi rifai la gara con gli stessi nomi o cambiali.',
        'Copia un link con i nomi per far correre anche gli amici.',
      ],
    },
    {
      h: 'Perché ogni nome ha esattamente la stessa probabilità',
      p: [
        'La gara sembra caotica, ma il risultato non lo decide l’animazione. Nel momento in cui premi via, l’app sorteggia l’intero ordine d’arrivo con il generatore casuale crittografico del browser, crypto.getRandomValues. Usa il campionamento per rifiuto per evitare la piccola distorsione di un semplice calcolo del resto, e il mescolamento di Fisher-Yates, il metodo standard per mettere una lista in ordine casuale. Ogni ordine possibile è ugualmente probabile.',
        'Solo dopo viene preparata l’animazione. Ogni corsia riceve la sua curva di velocità, con scatti e inciampi, regolata in modo che gli animali arrivino esattamente nell’ordine già sorteggiato. Per questo il comando della gara cambia più volte e l’arrivo è spesso al fotofinish. L’animale è solo decorazione: qui il coniglio non è più veloce della tartaruga e la corsia 1 non è più fortunata della 10.',
      ],
    },
    {
      h: 'Idee per ufficio, feste e scuola',
      p: [
        'In ufficio, la corsa assegna con leggerezza le incombenze per cui nessuno si offre. Serve anche per l’ordine degli interventi in riunione o per scegliere chi decide il pranzo questa settimana. Tutti guardano lo stesso schermo, quindi nessuno può parlare di trucchi, e il conto alla rovescia trasforma una decisione noiosa in una pausa di dieci secondi.',
        'Alle feste e alle cene in famiglia, usala per decidere chi inizia a un gioco da tavolo, chi sceglie la prossima canzone o chi deve raccontare una barzelletta. Gli insegnanti possono scegliere l’ordine delle interrogazioni o il prossimo lettore senza chiamare sempre gli stessi alunni.',
      ],
      list: [
        'Giro di caffè o di cornetti: paga l’ultimo.',
        'Ordine in riunione: una gara e si segue l’ordine d’arrivo.',
        'Serata giochi: il vincitore sceglie il gioco successivo.',
        'A scuola: il primo risponde alla domanda di riscaldamento.',
        'Faccende di casa: l’ultimo porta fuori la spazzatura.',
      ],
    },
    {
      h: 'Breve storia del sorteggio e delle gare',
      p: [
        'Da sempre cerchiamo modi per lasciare che il caso decida in modo equo. Il sorteggio compare nei testi antichi di molte culture, e la pagliuzza più corta, il testa o croce e le conte come «ambarabà ciccì coccò» sono ancora vivissimi. L’idea è sempre la stessa: il risultato non deve dipendere da chi alza di più la voce.',
        'Le gare aggiungono suspense. I cavallini delle giostre, i giochi da tavolo con le corse e la favola della lepre e della tartaruga giocano tutti con il brivido di seguire una sfida dall’esito incerto. Questa app unisce le due tradizioni: un sorteggio equo fatto nell’istante in cui premi via e una gara che rende divertente l’attesa.',
      ],
    },
    {
      h: 'Consigli per una gara migliore',
      p: [
        'Mettetevi d’accordo su modalità e posta in gioco prima di premere via, così il risultato viene accettato senza discussioni. Usa nomi corti perché stiano nella corsia sul telefono e metti lo schermo dove tutti lo vedono, oppure condividilo in videochiamata.',
      ],
      list: [
        'Dite ad alta voce cosa significa arrivare primi o ultimi prima della gara.',
        'Sugli schermi piccoli usa nomi corti o soprannomi.',
        'Per più decisioni di fila, rifai la gara con gli stessi nomi.',
        'Gli ultimi risultati restano sul dispositivo: utile per sapere chi ha pagato l’ultima volta.',
        'Se le animazioni ti danno fastidio, l’impostazione di sistema «riduci movimento» mostra subito il risultato.',
      ],
    },
  ],
  cta: 'Inizia una corsa di animali',
};
