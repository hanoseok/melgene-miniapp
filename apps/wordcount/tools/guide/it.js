module.exports = {
  metaTitle: 'Contatore di parole: guida per contare caratteri e byte',
  description: 'Come un contatore di parole conta caratteri con e senza spazi, parole e byte, perché Word e i siti non coincidono, i limiti più comuni come i 280 caratteri di X e consigli per scrivere alla lunghezza giusta.',
  h1: 'Guida al contatore di parole: cosa si conta, perché gli strumenti non coincidono e come rispettare un limite',
  updated: '2026-10-15',
  intro: 'I limiti di lunghezza sono ovunque: una lettera motivazionale di 2.000 caratteri spazi inclusi, un post da 280 caratteri, una meta description che viene tagliata intorno ai 155 caratteri, un abstract della tesi limitato in parole. Un buon contatore ti dice dove sei mentre scrivi, così non devi tagliare di corsa all’ultimo minuto. Questa guida spiega come usare lo strumento, come viene definito ogni numero, perché i programmi non sempre danno lo stesso totale, quali limiti incontrerai e come scrivere comodamente fino all’obiettivo.',
  sections: [
    {
      h: 'Come usare il contatore di parole',
      p: [
        'Scrivi direttamente nel riquadro o incolla un testo da qualsiasi fonte. La barra blu scuro in alto mostra i quattro numeri più controllati: caratteri con spazi, caratteri senza spazi, parole e byte. Resta visibile mentre scorri una bozza lunga. Sotto, il conteggio dettagliato aggiunge frasi, paragrafi, righe e una stima del tempo di lettura e di parlato.',
        'Se scrivi con un limite, scegli 500, 1.000 o 1.500 caratteri, oppure inserisci un numero tuo. Una barra si riempie mentre scrivi, diventa arancione vicino alla fine e rossa quando sfori, e ti dice quanti caratteri mancano o quanti tagliare. Con l’interruttore «Conta gli spazi» decidi se il limite segue il numero con o senza spazi. Alla fine, «Vedi riepilogo» mostra un riassunto da copiare.',
      ],
      list: [
        'Incolla o scrivi il testo: i numeri cambiano a ogni tasto.',
        'Imposta un obiettivo e scegli se contare gli spazi.',
        'Scegli la regola dei byte del tuo modulo: UTF-8, UTF-8 + CRLF o vecchio 2 byte.',
        'Pulisci un testo incollato con «Pulisci spazi» o «Unisci righe»; «Annulla» lo riporta indietro.',
        'La bozza resta salvata solo in questo browser e sopravvive a un ricaricamento.',
      ],
    },
    {
      h: 'Come viene definito ogni numero',
      p: [
        'I caratteri spazi inclusi contano tutto ciò che l’occhio vede come un carattere, più spazi e a capo; ogni a capo vale 1. Una lettera accentata come è, una bandiera o un’emoji famiglia composta da più codici contano come un solo carattere. I caratteri senza spazi tolgono da quel totale tutti gli spazi, le tabulazioni e gli a capo.',
        'Le parole vengono trovate dal separatore linguistico integrato nel browser. Una sequenza di lettere o cifre è una parola, l’apostrofo di «l’amico» è gestito dal browser e le parole con trattino come «e-mail» contano una volta. Le frasi finiscono con punto, punto interrogativo o esclamativo, e i paragrafi sono separati da una riga vuota.',
        'Il tempo di lettura presuppone circa 238 parole al minuto in lettura silenziosa, la media di un adulto, e il tempo di parlato circa 150 parole al minuto, un ritmo da presentazione tranquilla.',
      ],
      list: [
        'UTF-8: 1 byte per lettere senza accento, cifre e spazi, 2 per à, è, ì, ò, ù, 3 per cinese, giapponese e coreano, 4 per la maggior parte delle emoji.',
        'UTF-8 + CRLF: uguale, ma ogni a capo conta 2 byte, come in un file di testo Windows.',
        'Vecchio 2 byte: ASCII 1 byte, ogni altro carattere 2, a capo 2 (EUC-KR, Shift_JIS, GBK).',
      ],
    },
    {
      h: 'Perché Word, Google Docs e i siti danno totali diversi',
      p: [
        'Non esiste un’unica regola ufficiale, quindi piccole differenze sono normali. Word non conta i segni di paragrafo tra i caratteri, mentre molti moduli online contano gli a capo, a volte come due. Alcuni strumenti contano ogni unità di codice Unicode, così un’emoji vale due caratteri o più. Anche parole con trattino, numeri e indirizzi email vengono trattati in modi diversi.',
        'La cosa più sicura è leggere le istruzioni del modulo, impostare il contatore allo stesso modo e lasciare un margine di qualche carattere invece di arrivare esattamente al limite. Prima di inviare, incolla il testo nel campo vero e controlla il numero mostrato dal sito.',
      ],
    },
    {
      h: 'I limiti che incontrerai',
      p: [
        'Le candidature per borse di studio, master e lavoro fissano spesso la lunghezza in caratteri spazi inclusi, per esempio 2.000 per una lettera motivazionale. Abstract e riassunti sono invece limitati in parole. Controlla sempre se si parla di caratteri o di parole, e con o senza spazi.',
        'Ogni social ha il suo tetto, che cambia di tanto in tanto. Su X un post standard accetta 280 caratteri, ma i caratteri cinesi, giapponesi e coreani contano doppio. I motori di ricerca mostrano di solito 150-160 caratteri di una meta description prima di tagliarla.',
      ],
      list: [
        'X (Twitter): 280 caratteri.',
        'Didascalia Instagram: 2.200 caratteri.',
        'YouTube: titolo di 100 caratteri, descrizione di 5.000.',
        'SMS: 160 caratteri, o 70 con emoji o caratteri speciali.',
        'Meta description: punta a circa 150-160 caratteri.',
      ],
    },
    {
      h: 'Consigli per scrivere fino a un limite',
      p: [
        'Scrivi prima tutto quello che vuoi dire senza guardare il numero, poi taglia. Accorciare una bozza lunga dà quasi sempre un testo più solido che gonfiarne una corta. Parti da ciò che fa risparmiare di più: la frase che ripete la domanda, formule come «è importante sottolineare che», avverbi come «davvero» o «molto». Il pannello delle parole ripetute aiuta: una parola che compare cinque volte in un testo breve è di solito una ripetizione, non un’enfasi.',
      ],
      list: [
        'Punta al 90-100% del limite; una risposta troppo corta sembra poco curata.',
        'Lascia qualche carattere di margine per i moduli che contano gli a capo in altro modo.',
        'Dopo aver incollato da un PDF o da un’email, usa «Pulisci spazi».',
        'Per un discorso, leggilo ad alta voce e controlla il tempo di parlato.',
        'Salva la versione finale anche altrove: la bozza vive solo in questo browser.',
      ],
    },
  ],
  cta: 'Conta il mio testo ora',
};
