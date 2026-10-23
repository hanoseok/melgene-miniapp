/* Calcolo BMI — italiano. Stessa struttura di chiavi e segnaposto di en.js (vedi commenti). Registro: tu. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&display=swap',
    display: "'Outfit'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  num: { kg: '{n} kg', lb: '{n} lb', range: '{min} – {max}' },

  meta: {
    title: 'Calcolo BMI – Indice di massa corporea per adulti',
    description: 'Calcolo BMI gratuito per adulti: inserisci altezza e peso in cm/kg o piedi/libbre e vedi subito il tuo indice di massa corporea, la categoria OMS su una scala a colori e il peso forma.',
    ogTitle: 'Calcolo BMI ⚖️ Il tuo BMI e il tuo peso forma',
    ogDescription: 'Indice di massa corporea in cm/kg o piedi/libbre, soglie OMS e asiatiche e il peso forma per la tua altezza.',
  },
  siteName: 'Calcolo BMI',
  privacyLink: 'Informativa sulla privacy',

  hero: {
    h1Kicker: 'Calcolo BMI',
    h1Html: 'Il tuo BMI, <em>mentre scrivi</em>',
    hook: 'Inserisci altezza e peso: il tuo BMI compare su una scala a colori, insieme al peso forma per la tua altezza.',
  },

  ui: {
    unitsLabel: 'Unità',
    metric: 'cm · kg',
    imperial: 'ft · lb',
    height: 'Altezza',
    weight: 'Peso',
    cm: 'cm',
    kg: 'kg',
    ft: 'ft',
    inch: 'in',
    lb: 'lb',
    more: '+ Età e sesso (facoltativi)',
    less: '− Nascondi età e sesso',
    age: 'Età',
    years: 'anni',
    sex: 'Sesso',
    sexNone: 'Non indicato',
    female: 'Donna',
    male: 'Uomo',
    asiaToggle: 'Soglie asiatiche',
    yourBmi: 'Il tuo BMI',
    waiting: 'Inserisci altezza e peso e qui comparirà il tuo BMI.',
    scaleLabel: 'Scala del BMI',
    rangeTitle: 'Peso forma per la tua altezza',
    toLose: 'Circa {w} sopra l’intervallo di peso forma',
    toGain: 'Circa {w} sotto l’intervallo di peso forma',
    inRange: 'Sei nell’intervallo di peso forma.',
    under18: 'Questo calcolo è per adulti dai 18 anni in su. Per bambini e ragazzi il BMI si legge sulle curve di crescita per età e sesso, quindi la categoria qui sopra non vale.',
    senior: 'Dopo i 65 anni un BMI un po’ più alto è spesso considerato accettabile. Il tuo medico può dirti cosa va bene per te.',
    sexNote: 'Le soglie del BMI per adulti sono le stesse per donne e uomini, anche se a parità di BMI le donne hanno di solito più massa grassa.',
    disclaimerTitle: 'Prima di trarre conclusioni',
    disclaimer: [
      'Il BMI è solo un indicatore di massima, non una diagnosi né un consiglio medico.',
      'Non distingue i muscoli dal grasso, quindi sportivi e persone muscolose possono risultare alti.',
      'Non vale in gravidanza e questo calcolo è solo per adulti dai 18 anni in su.',
    ],
    decimalHint: 'Decimali: vanno bene sia “.” sia “,”.',
    finish: 'Vedi il riepilogo ✓',
    needOne: 'Prima inserisci altezza e peso.',
    localNote: 'Calcolato sul tuo dispositivo. Nulla di ciò che scrivi viene inviato o salvato.',
    summaryTitle: 'Riepilogo del tuo BMI',
    summaryNote: 'Questo riepilogo esiste solo in questa pagina. Non viene salvato nulla.',
    sumScale: 'Soglie',
    sumRange: 'Peso forma',
    again: 'Ricomincia',
    live: 'BMI {bmi}, {cat}',
    shareTitle: 'Calcolo BMI',
    shareText: 'Calcola il tuo BMI e il tuo peso forma in pochi secondi ⚖️',
  },

  scales: {
    who: {
      name: 'OMS',
      note: 'Categorie per adulti dell’Organizzazione mondiale della sanità.',
      labels: ['Sottopeso', 'Normopeso', 'Sovrappeso', 'Obesità di I grado', 'Obesità di II grado', 'Obesità di III grado'],
    },
    alt: {
      name: 'Asia-Pacifico',
      note: 'Soglie OMS per l’Asia-Pacifico (2000): per molte persone di origine asiatica i rischi per la salute iniziano a un BMI più basso.',
      labels: ['Sottopeso', 'Normopeso', 'Sovrappeso (a rischio)', 'Obesità di I grado', 'Obesità di II grado'],
    },
  },

  errors: {
    badNum: 'Usa solo cifre, con “.” o “,” per i decimali.',
    heightRange: 'Controlla l’altezza: deve essere tra 50 e 272 cm.',
    weightRange: 'Controlla il peso: deve essere tra 10 e 650 kg.',
    inchRange: 'I pollici devono essere meno di 12. Metti i piedi interi nella prima casella.',
    ageRange: 'L’età deve essere un numero intero tra 2 e 120.',
  },

  og: {
    brand: '⚖️ Calcolo BMI',
    kicker: 'Altezza · Peso · BMI',
    title: 'Dove si colloca il tuo BMI?',
    desc: 'Con il peso forma per la tua altezza',
  },

  faq: [
    { q: 'Come si calcola il BMI?', a: 'Si divide il peso in chili per il quadrato dell’altezza in metri. Con 1,70 m e 65 kg viene 65 ÷ (1,7 × 1,7) ≈ 22,5. Se inserisci piedi e libbre, il calcolo converte in automatico.' },
    { q: 'Qual è un BMI normale per un adulto?', a: 'Secondo l’OMS da 18,5 a 24,9 è normopeso, da 25 a 29,9 sovrappeso e da 30 in su obesità. Per le persone di origine asiatica si consigliano spesso soglie più basse, che puoi attivare con l’interruttore “Soglie asiatiche”.' },
    { q: 'Perché il mio BMI è alto se faccio sport?', a: 'Il BMI guarda solo peso e altezza, quindi non sa se quel peso è muscolo o grasso. Chi si allena molto finisce spesso tra i “sovrappeso” pur essendo asciutto. La circonferenza della vita o una misura della composizione corporea dicono molto di più.' },
    { q: 'Si può usare per i bambini o in gravidanza?', a: 'No. Sotto i 18 anni si usano le curve di crescita per età e sesso, e l’aumento di peso in gravidanza segue indicazioni proprie. In questi casi chiedi al medico o all’ostetrica.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Calcolo BMI',
    description: 'Informativa sulla privacy di Calcolo BMI: altezza, peso ed età restano nel tuo browser, più cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Calcolo BMI (il "Servizio") rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.',
    sections: [
      ['1. Dati raccolti', 'Il Servizio funziona senza account e senza accesso. Altezza, peso, età e sesso che inserisci vengono calcolati solo nel tuo browser. Non vengono inviati al nostro server, non vengono salvati e non finiscono in nessun link. Il Servizio ricorda sul tuo dispositivo solo le unità usate per ultime (cm·kg o ft·lb). Se usi i pulsanti di condivisione, viene condiviso solo l’indirizzo della pagina con un breve testo senza i tuoi numeri, e solo con le persone che scegli.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare lingua e unità, mostrare pubblicità e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non andare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Puoi saperne di più e cambiare le preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (pagine viste, calcoli, valutazioni). Le tue misure non entrano mai in questi numeri e nulla di tutto ciò ti identifica personalmente.'],
      ['5. Contatti', 'Per qualsiasi domanda su questa informativa, contatta il gestore del sito.'],
      ['6. Data di validità', 'Questa informativa è valida dal 24 ottobre 2026.'],
    ],
    back: '← Torna a Calcolo BMI',
  },
};
