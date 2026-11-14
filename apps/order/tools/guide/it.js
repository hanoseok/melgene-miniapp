module.exports = {
  metaTitle: 'Estrarre l’ordine casuale: guida per un ordine equo',
  description: 'Come estrarre un ordine casuale per interrogazioni, presentazioni, turni di gioco o pulizie, perché il mescolamento è equo e come svelare l’ordine davanti a un gruppo.',
  h1: 'Ordine casuale: un ordine equo dal primo all’ultimo',
  updated: '2026-11-15',
  intro: 'Decidere chi comincia sembra una sciocchezza, finché un’intera classe, una squadra o una famiglia non aspetta la risposta. C’è sempre qualcuno che pensa che l’ordine sia pilotato, o che nota che tocca sempre agli stessi per primi. Ordine casuale risolve la questione in un solo passaggio: scrivi i nomi, mescoli una volta e l’ordine completo, dal primo all’ultimo, è deciso all’istante. Questa guida spiega come funziona lo strumento, perché il risultato è equo, a cosa serve un ordine casuale e come svelarlo in modo che tutti lo accettino.',
  sections: [
    {
      h: 'Come funziona',
      p: [
        'La prima schermata è tutta la preparazione. Scegli prima a cosa serve l’ordine: presentazioni, turni di gioco o pulizie. L’etichetta cambia solo il titolo del risultato, quindi puoi ignorarla se ti basta una lista. Poi scrivi o incolla i nomi, uno per riga. Va bene una lista copiata da WhatsApp o da un foglio di calcolo, e anche le virgole separano i nomi. Se preferisci non usare nomi, passa ai numeri e scegli quanti, da 2 a 40: comodo con i numeri del registro o dei posti.',
        'Scegli se svelare l’ordine dal primo o dall’ultimo e premi estrai. Ogni posizione compare come una carta numerata: tocca la carta o il pulsante Avanti per la successiva, attiva la modalità automatica per far apparire le carte da sole, oppure premi Mostra tutto per andare subito alla lista completa. L’ultima schermata mostra tutti in ordine con numeri grandi, più i pulsanti per copiare la lista come testo o copiare un link.',
      ],
      list: [
        'Scegli un’etichetta: ordine semplice, presentazioni, turni di gioco o pulizie.',
        'Inserisci da 2 a 40 nomi, uno per riga, oppure passa ai numeri da 1 a N.',
        'Decidi se svelare dal primo o dall’ultimo.',
        'Premi estrai una volta: tutto l’ordine è deciso in quel momento.',
        'Svela una carta alla volta, in automatico o tutto insieme.',
      ],
    },
    {
      h: 'Perché il mescolamento è equo',
      p: [
        'Un ordine equo richiede due cose: ogni disposizione possibile deve avere la stessa probabilità e il risultato deve essere deciso prima che qualcuno lo veda. Quando premi estrai, l’app chiede valori al generatore casuale crittografico del browser, lo stesso tipo di fonte usato per creare chiavi di sicurezza. Poi usa il campionamento per rifiuto, che scarta i rari valori che renderebbero alcune posizioni un po’ più probabili, e il mescolamento di Fisher–Yates, un metodo noto che dà esattamente la stessa possibilità a ogni ordine possibile.',
        'L’ordine completo esiste da quel momento. Girare le carte una per una non estrae nulla di nuovo: mostra soltanto un risultato già fissato. Non viene inviato niente a un server, quindi nessuno, nemmeno noi, può vedere o cambiare la lista. Se qualcuno ha dubbi, aprite il link condiviso su un altro telefono: compare lo stesso ordine, perché il link contiene l’ordine finito e non un nuovo mescolamento.',
      ],
    },
    {
      h: 'A cosa serve un ordine casuale',
      p: [
        'Ogni volta che un gruppo deve procedere a turno, un ordine estratto chiude la discussione su chi comincia. Gli insegnanti lo usano per l’ordine delle interrogazioni, delle presentazioni o della lettura ad alta voce. Le squadre lo usano per i turni di parola nelle riunioni o nei workshop. Famiglie e coinquilini lo usano per i turni delle pulizie, gli amici per l’ordine nei giochi da tavolo, al karaoke o in un torneo di videogiochi.',
        'È diverso dall’estrarre un vincitore. L’estrazione di un vincitore si ferma a un nome, e un generatore di squadre divide le persone in gruppi. Qui ognuno riceve una posizione dal primo all’ultimo: proprio ciò che serve quando a tutti toccherà il turno e resta da decidere solo la sequenza.',
      ],
      list: [
        'Scuola: ordine delle interrogazioni, presentazioni, lettura ad alta voce.',
        'Lavoro: turni di parola, demo, reperibilità.',
        'Casa: chi lava i piatti in quale giorno, chi sceglie il film.',
        'Giochi: ordine dei giocatori nei giochi da tavolo, quiz, karaoke.',
      ],
    },
    {
      h: 'Consigli per farlo in gruppo',
      p: [
        'Estraete dove tutti vedono lo schermo, oppure condividetelo in videochiamata. Chi vede premere il pulsante una sola volta si fida del risultato più che di una lista arrivata già pronta. Se serve ripetere, per esempio per un nome scritto male, ditelo prima di conoscere l’ordine, non dopo.',
        'Con liste lunghe, la modalità automatica mantiene un ritmo costante senza che nessuno debba toccare lo schermo, e Mostra tutto è la via più rapida se conta solo la lista. Copia come testo incolla una lista numerata direttamente in una chat o in un documento. L’ultima lista resta memorizzata sul dispositivo, così un turno settimanale si rimescola con un tocco la volta successiva.',
      ],
    },
    {
      h: 'Svelare dal primo o dall’ultimo, e condividere il risultato',
      p: [
        'Svelare dal primo è pratico: chi comincia lo sa subito e può prepararsi. Svelare dall’ultimo trasforma l’ordine in un piccolo conto alla rovescia, perché l’ultima carta rivela chi va per primo. In classe e alle feste piace questa suspense, nelle riunioni di solito si preferisce la versione veloce.',
        'Il pulsante Copia link crea un indirizzo che contiene l’ordine finito. Chi lo apre vede la stessa lista con un avviso che non è stata rimescolata, e può avviare una propria estrazione con gli stessi nomi se vuole un nuovo ordine. Il link contiene i nomi inseriti, quindi mandalo solo a chi deve vederlo.',
      ],
    },
  ],
  cta: 'Estrai l’ordine adesso',
};
