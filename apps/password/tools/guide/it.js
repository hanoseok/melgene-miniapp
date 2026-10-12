module.exports = {
  metaTitle: 'Generatore di password: guida a password sicure ed entropia',
  description: 'Come creare password sicure e passphrase facili da ricordare, cosa significano davvero entropia e tempo per forzarle, e perché contano il password manager e la verifica in due passaggi.',
  h1: 'Generatore di password: password robuste, passphrase e cosa significa entropia',
  updated: '2026-10-13',
  intro: 'La maggior parte degli account violati non cade per mano di un hacker geniale. Tutto parte da una password troppo corta, da una password riutilizzata dopo la fuga di dati di un altro sito o da uno schema prevedibile come nome più anno di nascita. Un generatore di password si occupa di ciò che noi umani facciamo peggio: scegliere a caso. Questa guida spiega come usare il generatore, cosa rende davvero robusta una password, cosa sono le passphrase, come leggere entropia e tempo per forzarla, e chiude con due abitudini che contano ancora più della password stessa.',
  sections: [
    {
      h: 'Come usare il generatore di password',
      p: [
        'Tutto avviene in una sola schermata e sul tuo dispositivo. In alto scegli Password o Passphrase. Per una password, sposta il cursore della lunghezza tra 4 e 64 caratteri e attiva i tipi che vuoi: maiuscole, minuscole, numeri e simboli. Ogni tipo attivato compare almeno una volta, così rispetti anche i siti che impongono regole di composizione. Se dovrai dettare la password o ricopiarla da uno schermo, attiva Escludi i sosia per togliere 0, O, 1, l e I.',
        'Per una passphrase scegli quante parole vuoi (da 3 a 8), il separatore, e se ogni parola deve iniziare con la maiuscola e se aggiungere un numero. Seleziona Solo una o Cinque insieme e premi Genera. Ogni risultato ha il suo pulsante Copia e l’indicatore sotto mostra l’entropia in bit, un livello di robustezza e il tempo stimato per forzarla.',
      ],
      list: [
        'Scegli Password o Passphrase.',
        'Imposta la lunghezza o il numero di parole.',
        'Scegli i tipi di caratteri, oppure separatore e opzioni.',
        'Premi Genera e copia quella che preferisci.',
        'Salvala subito nel tuo password manager.',
      ],
    },
    {
      h: 'Cosa rende robusta una password',
      p: [
        'La robustezza dipende da quante possibilità un attaccante dovrebbe provare, non da quanto la password sembri complicata. P@ssw0rd! sembra un groviglio, ma i programmi di cracking provano prima le parole comuni con le sostituzioni tipiche e la trovano in pochi secondi. Una stringa davvero casuale è un’altra storia: ogni carattere è una scelta indipendente e ogni carattere in più moltiplica le possibilità. Ecco perché la lunghezza batte l’astuzia. Passare da 12 a 16 caratteri casuali rende una password decine di milioni di volte più difficile da indovinare.',
        'L’altra metà è il caso. Scegliamo compleanni, nomi di animali, sequenze di tasti come qwerty e lo stesso schema preferito ovunque, e gli attaccanti conoscono tutte queste abitudini. Il generatore usa la sorgente casuale crittografica del browser, crypto.getRandomValues, e una tecnica chiamata campionamento con rifiuto, così ogni carattere ammesso ha esattamente la stessa probabilità. Nessuno schema da imparare, nessuno squilibrio da sfruttare.',
        'Il terzo ingrediente è l’unicità. Anche una password perfetta diventa debole appena la riusi, perché la fuga di dati di un sito la consegna ad attaccanti che poi la provano ovunque. Un account, una password.',
      ],
    },
    {
      h: 'Passphrase: robuste e più facili da ricordare',
      p: [
        'Una passphrase è una manciata di parole a caso unite insieme, come una breve frase senza senso. Il trucco è che a scegliere le parole sia il caso, non tu: un verso di una canzone o una citazione famosa non hanno nulla di casuale. Questo generatore pesca ogni parola da un elenco integrato di 2.048 parole inglesi brevi, quindi ogni parola aggiunge esattamente 11 bit di entropia. Cinque parole danno 55 bit, sei ne danno 66, e un numero casuale aggiunge ancora qualche bit.',
        'Le passphrase danno il meglio per i pochi segreti che devi davvero digitare o ricordare: la password principale del password manager, l’accesso al computer o il backup del telefono. Sono lunghe, quindi robuste, e fatte di parole vere, quindi molto più comode da scrivere sulla tastiera del telefono di un miscuglio di simboli. Mettere la maiuscola a ogni parola non aumenta la robustezza perché lo schema è prevedibile, ma aiuta con i siti che pretendono una maiuscola.',
      ],
    },
    {
      h: 'Entropia e tempo per forzarla, spiegati',
      p: [
        'L’entropia, misurata in bit, indica tra quante possibilità ugualmente probabili è stata estratta una password. Ogni bit raddoppia il numero: 60 bit sono circa un miliardo di miliardi di possibilità, 80 bit un milione di volte di più. L’indicatore calcola questo valore esattamente dalle tue impostazioni. Per le password conta tutte le stringhe della lunghezza scelta che contengono almeno un carattere di ogni tipo selezionato; per le passphrase moltiplica le scelte delle parole per la posizione e il valore del numero aggiunto.',
        'Il tempo per forzarla presuppone un attacco offline velocissimo da 10 miliardi di tentativi al secondo, un ritmo alla portata di una sola scheda video moderna contro un archivio di password rubato e protetto male. In media l’attaccante la trova dopo aver provato metà delle possibilità. Si presume anche che conosca esattamente le tue impostazioni, quindi la stima non ti lusinga mai. In linea di massima: sotto i 45 bit è debole, da 45 a 60 discreta, da 60 a 80 forte, da 80 in su fortissima.',
      ],
      list: [
        'Account usa e getta o poco importanti: da 45 a 60 bit.',
        'Account di tutti i giorni come acquisti e social: da 60 a 80 bit.',
        'Email, home banking, lavoro e password manager: 80 bit o più.',
      ],
    },
    {
      h: 'Password manager e verifica in due passaggi',
      p: [
        'Nessuno riesce a ricordare decine di password casuali diverse, e nessuno dovrebbe provarci. Un password manager le custodisce in una cassaforte cifrata, le inserisce sui siti giusti e ti avvisa se sono ripetute o trapelate. Genera qui una password robusta, incollala nel manager quando crei o modifichi un account e non dovrai più vederla. Proteggi il manager stesso con una passphrase lunga che impari a memoria.',
        'La verifica in due passaggi, o 2FA, aggiunge un secondo passo come un codice da un’app di autenticazione, una passkey o una chiave di sicurezza fisica. Anche se la password trapela, l’attaccante non riesce a entrare. Attivala prima di tutto sull’email, perché è da lì che si recuperano quasi tutti gli altri account.',
      ],
      list: [
        'Usa una password diversa per ogni account.',
        'Tieni le password in un password manager, non in note, chat o screenshot.',
        'Attiva la 2FA o le passkey ovunque siano disponibili, partendo dall’email.',
        'Cambia subito la password se un servizio segnala una fuga di dati.',
        'Non inviare mai una password per messaggio o email e diffida dei link di accesso inattesi.',
      ],
    },
  ],
  cta: 'Genera subito una password robusta',
};
