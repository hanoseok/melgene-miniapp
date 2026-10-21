module.exports = {
  metaTitle: 'Calcolo percentuale: formule, sconti e punti percentuali',
  description: 'Come fare il calcolo percentuale a mano: il X% di un numero, che percentuale è un numero di un altro, variazione percentuale, sconti cumulati, prezzo iniziale e differenza tra percentuale e punto percentuale.',
  h1: 'Calcolo percentuale: come risolvere ogni percentuale',
  updated: '2026-10-22',
  intro: 'Le percentuali sono ovunque: cartellini dei saldi, buste paga, voti, tassi di interesse, sondaggi. Quasi tutto si risolve con tre piccole formule, eppure alcune trappole colpiscono quasi tutti, come riaggiungere uno sconto o confondere percentuale e punto percentuale. Questa guida spiega come funziona il calcolatore, come fare gli stessi conti con carta e penna, dove si nascondono gli errori tipici e qualche trucco di calcolo a mente per la vita di tutti i giorni.',
  sections: [
    {
      h: 'Come usare il calcolatore di percentuali',
      p: [
        'Scegli la tua domanda tra le sei schede in alto: la percentuale di un numero, che percentuale è un numero di un altro, la variazione percentuale tra due valori, uno sconto o un aumento, il valore iniziale prima di una variazione, oppure la differenza tra due tassi in punti percentuali. Ogni scheda ha due caselle. Appena le compili compare la risposta, con una riga che mostra esattamente come è stata calcolata.',
        'Puoi scrivere i decimali con la virgola o con il punto: 12,5 e 12.5 funzionano entrambi, e si capiscono anche i separatori delle migliaia come 1.250. I risultati sono arrotondati al massimo a dieci decimali, così spariscono i minuscoli errori di arrotondamento dei computer. Alla fine apri il riepilogo per vedere tutti i risultati di questa sessione in un’unica lista e copiare quelli che ti servono.',
      ],
      list: [
        'Tutto viene calcolato nel tuo browser: i numeri che scrivi non vengono inviati da nessuna parte.',
        'Il pulsante copia copia il risultato insieme alla formula.',
        'La scheda sconti ha pulsanti rapidi per il 10, 20, 30 e 50 per cento.',
      ],
    },
    {
      h: 'Le tre formule di base, a mano',
      p: [
        'Per cento significa «su cento», quindi il 15% è 15 su 100, cioè 0,15. Con questa idea quasi ogni domanda diventa una di tre formule. Per la percentuale di un numero si moltiplica e si divide per 100: il 15% di 200 è 200 × 15 ÷ 100 = 30. Per sapere che percentuale è una parte si divide la parte per il totale e si moltiplica per 100: 30 su 120 è 30 ÷ 120 × 100 = 25%. Per trovare il totale partendo da una parte e dalla sua percentuale si divide la parte per la percentuale e si moltiplica per 100: se 30 è il 25%, il totale è 30 ÷ 25 × 100 = 120.',
        'Il trucco è chiedersi sempre «percentuale di che cosa?». Il numero dopo la parola «di» è la base, e la base va al denominatore. La maggior parte degli errori nasce quando la base cambia di nascosto a metà del problema.',
      ],
      list: [
        'Parte = totale × percentuale ÷ 100',
        'Percentuale = parte ÷ totale × 100',
        'Totale = parte ÷ percentuale × 100',
      ],
    },
    {
      h: 'Variazioni, sconti e la trappola del calcolo inverso',
      p: [
        'La variazione percentuale confronta il valore nuovo con quello vecchio: (nuovo − vecchio) ÷ vecchio × 100. Un prezzo che passa da 80 a 100 cresce del 25%, ma uno che scende da 100 a 80 cala solo del 20%, perché la base è diversa nei due sensi. Questa asimmetria spiega un indovinello famoso: togli il 20% a 100 e ottieni 80; riaggiungi il 20% e arrivi solo a 96.',
        'Per lo stesso motivo gli sconti cumulati sono più piccoli di quanto sembrino. Un ulteriore 20% su un prezzo già scontato del 30% non fa il 50%: paghi 0,7 × 0,8 = 0,56 del prezzo, cioè uno sconto del 44%. Per annullare una variazione percentuale bisogna dividere, non sottrarre. Se una giacca costa 80 € dopo lo sconto del 20%, il prezzo iniziale era 80 ÷ 0,8 = 100 €. Se uno scontrino di 122 € include l’IVA al 22%, l’imponibile è 122 ÷ 1,22 = 100 €, non 95,16 €. La scheda «Valore iniziale» mostra questa divisione e ti avvisa perfino della risposta sbagliata più allettante.',
      ],
    },
    {
      h: 'Percentuale o punto percentuale?',
      p: [
        'Quando si confrontano due percentuali ci sono due modi onesti di descrivere la differenza, e danno numeri molto diversi. Se il tasso di un conto deposito passa dal 2% al 3%, è salito di un punto percentuale: basta sottrarre un tasso dall’altro. In termini relativi è salito del 50%, perché l’aumento di 1 è la metà del 2 iniziale. Titoli di giornale e pubblicità a volte scelgono la versione che suona più clamorosa, quindi conviene controllare quale viene usata.',
        'I punti percentuali sono l’unità giusta per tassi di interesse, aliquote, disoccupazione, sondaggi e tassi di conversione, cioè numeri che sono già percentuali. La scheda «Punti (p.p.)» mostra entrambe le cifre insieme: la differenza in punti e la variazione relativa in percentuale.',
      ],
    },
    {
      h: 'Esempi quotidiani e trucchi di calcolo a mente',
      p: [
        'Non serve sempre una calcolatrice. Il 10% di un numero è quel numero con la virgola spostata di un posto a sinistra: il 10% di 64 è 6,4. Il 5% è la metà, il 20% il doppio. Le percentuali si possono anche scambiare: l’8% di 50 è uguale al 50% di 8, cioè 4. Per una mancia del 15%, calcola il 10% e aggiungi la sua metà.',
        'Per le decisioni importanti, scrivi la formula. Confronta un aumento di stipendio con l’inflazione sottraendo i due tassi in punti, controlla un prezzo scontato moltiplicando per la parte che resta invece di sottrarre due volte e, se un prestito indica un tasso mensile, ricorda che dodici mesi di interessi composti fanno più di dodici volte quel tasso.',
      ],
      list: [
        'Uno sconto del 25% vuol dire pagare 0,75 del prezzo; del 40%, 0,6.',
        'Dopo un calo del 50% serve un aumento del 100% per tornare al punto di partenza.',
        'Raddoppiare è +100%; dimezzare è −50%.',
      ],
    },
  ],
  cta: 'Apri il calcolo percentuale',
};
