module.exports = {
  metaTitle: 'Calcolo BMI: formula, categorie e limiti',
  description: 'Come si calcola il BMI in chili o in libbre, cosa significano le soglie OMS e quelle asiatiche, perché il BMI sbaglia con gli sportivi e come la circonferenza vita completa il risultato.',
  h1: 'Calcolo BMI: come funziona l’indice di massa corporea',
  updated: '2026-10-24',
  intro: 'L’indice di massa corporea, o BMI, è il numero che medici, assicurazioni e app di fitness usano più spesso per dividere gli adulti in sottopeso, normopeso, sovrappeso e obesità. Bastano altezza e peso, quindi è veloce, ma anche piuttosto grossolano. Questa guida spiega come funziona il calcolo, la formula, il significato delle categorie, i casi in cui il BMI sbaglia e le misure semplici che danno un quadro più completo.',
  sections: [
    {
      h: 'Come usare il calcolo BMI',
      p: [
        'Scegli le unità (centimetri e chili, oppure piedi, pollici e libbre) e inserisci altezza e peso. Appena le due caselle sono piene compare il tuo BMI con un decimale, un indicatore su una scala a colori e il nome della categoria. Sotto trovi il peso forma per la tua altezza e, se sei fuori dall’intervallo, quanto ti manca più o meno.',
        'Età e sesso sono facoltativi. Non cambiano il numero; aggiungono solo una nota quando serve, per esempio che il calcolo è pensato per gli adulti o che dopo i 65 anni un BMI un po’ più alto è spesso accettabile. L’interruttore “Soglie asiatiche” applica le soglie più basse raccomandate in Asia. Tutto viene calcolato nel browser e nulla viene inviato o salvato.',
      ],
      list: [
        'I decimali funzionano con virgola o punto: 70,5 e 70.5 sono uguali.',
        'Se cambi unità, i valori già inseriti vengono convertiti.',
        'Il riepilogo raccoglie BMI, categoria e peso forma in un’unica scheda.',
      ],
    },
    {
      h: 'La formula del BMI, passo dopo passo',
      p: [
        'Il BMI è il peso in chili diviso per il quadrato dell’altezza in metri. Con 1,70 m e 65 kg: 1,7 × 1,7 = 2,89 e 65 ÷ 2,89 ≈ 22,5. Dato che l’altezza è al quadrato, pochi centimetri contano: con gli stessi 65 kg si ottiene circa 23,9 a 1,65 m e 21,2 a 1,75 m.',
        'Con le unità americane la formula è 703 × peso in libbre ÷ altezza in pollici al quadrato. Il 703 serve solo a convertire libbre e pollici in chili e metri. Il calcolo usa le conversioni esatte di 2,54 cm per pollice e 0,45359237 kg per libbra.',
      ],
      list: [
        'Sistema metrico: BMI = kg ÷ (m × m)',
        'Unità USA: BMI = 703 × lb ÷ (in × in)',
        'Peso forma = da 18,5 × m² a 24,9 × m² (OMS)',
      ],
    },
    {
      h: 'Cosa significano le categorie',
      p: [
        'L’OMS divide il BMI degli adulti in sottopeso (sotto 18,5), normopeso (da 18,5 a 24,9), sovrappeso (da 25 a 29,9) e obesità (da 30 in su), a sua volta divisa in I grado (30–34,9), II grado (35–39,9) e III grado (40 e oltre). Le soglie sono le stesse per donne e uomini. Sono state scelte perché, su grandi popolazioni, il rischio di diabete di tipo 2, ipertensione e malattie cardiache cresce man mano che il BMI si allontana dalla fascia centrale.',
        'Studi condotti in Asia hanno mostrato che molte persone di origine asiatica corrono questi rischi già con un BMI più basso, anche perché a parità di peso tendono ad avere più grasso, soprattutto addominale. Per questo l’OMS per l’Asia-Pacifico fissa il sovrappeso da 23 e l’obesità da 25. I singoli Paesi precisano: il Giappone parla di obesità da 25, la Cina mette il sovrappeso a 24 e l’obesità a 28.',
      ],
      list: [
        'Sotto 18,5: sottopeso su tutte le scale',
        'Da 18,5 a 24,9: normopeso secondo l’OMS',
        'Da 23 a 24,9: già sovrappeso sulla scala Asia-Pacifico',
      ],
    },
    {
      h: 'Cosa il BMI non dice',
      p: [
        'Il BMI guarda solo il peso totale: non distingue i muscoli dal grasso e non dice dove si trova il grasso. Un rugbista o chi fa pesi può risultare in sovrappeso o persino obeso pur essendo asciutto, mentre un anziano che ha perso massa muscolare può avere un BMI normale con troppo grasso. Due persone con lo stesso BMI possono avere una salute molto diversa.',
        'Non va bene nemmeno per tutti. Bambini e ragazzi si valutano con le curve di crescita per età e sesso, e l’aumento di peso in gravidanza segue indicazioni proprie. Anche gli adulti molto alti o molto bassi e chi trattiene liquidi possono ottenere risultati fuorvianti. Considera il BMI un primo indicatore, non un giudizio sulla tua salute.',
      ],
    },
    {
      h: 'Circonferenza vita e rapporto vita-altezza',
      p: [
        'Il grasso accumulato sulla pancia è più legato alle malattie del cuore e del metabolismo rispetto a quello in altre zone, e il BMI non lo vede. Basta un metro da sarta: misura a metà strada tra l’ultima costola e la cresta dell’anca, dopo aver espirato normalmente. In Italia una circonferenza oltre 88 cm nelle donne e oltre 102 cm negli uomini è considerata un segnale di rischio.',
        'Si usa anche il rapporto vita-altezza: se resta sotto 0,5, cioè se la vita misura meno di metà della tua altezza, il rischio è di solito più basso. Bilance impedenziometriche ed esami di imaging stimano il grasso in modo più diretto, anche se gli apparecchi di casa sono spesso imprecisi. Se BMI e circonferenza vita dicono cose diverse, parlane con il medico.',
      ],
      list: [
        'Vita ÷ altezza sotto 0,5: rischio di solito più basso',
        'Misura al mattino, in piedi, dopo aver espirato',
        'Usa sempre lo stesso metro e lo stesso punto',
      ],
    },
    {
      h: 'Consigli per leggere e seguire il risultato',
      p: [
        'Pesati alla stessa ora, meglio al mattino, perché il peso può cambiare di un chilo o più tra mattina e sera. Guarda l’andamento di qualche settimana più che un singolo valore, e ricorda che l’intervallo di peso forma copre diversi chili per un motivo: non esiste un unico peso perfetto. Se vuoi cambiare peso, piccoli cambiamenti costanti nel sonno, nel movimento e nei pasti durano più di una dieta rigida.',
      ],
      list: [
        'Misura l’altezza senza scarpe e pesati con abiti leggeri.',
        'Controlla la circonferenza vita oltre al BMI.',
        'Chiedi al medico prima di grandi cambiamenti.',
      ],
    },
  ],
  cta: 'Calcola ora il tuo BMI',
};
