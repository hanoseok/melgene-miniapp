/* Penitenze con le carte (Penalty Card Flip) — italiano (/it/ ; la lingua arriva dal cookie o dalla preferenza salvata)
 * La logica è in penalty-core.js; tutti i testi visibili sono qui. Le chiavi che finiscono in Html accettano HTML (solo <br>, <em>, <a>).
 * Schermate: avvio (accenno + pulsante + pubblicità) → impostazioni (giocatori, carte penitenza, penitenze, nomi) → girare (carte coperte) → fine (chi prende la penitenza + schermata finale comune).
 * La FAQ compare solo nella schermata finale comune. Lascia invariati i segnaposto come {n} {k}.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@600&display=swap',
    display: "'Fredoka'",
    displayWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Penitenze con le carte – sorteggio penitenze per feste',
    description: 'Gioco gratuito di carte per scegliere le penitenze a feste e serate. Scegli quanti giocatori e carte penitenza, poi gira le carte coperte una alla volta. Senza registrazione.',
    ogTitle: 'Penitenze con le carte 🃏 Gira la carta, scegli la penitenza',
    ogDescription: 'Sorteggio equo delle penitenze per le feste, mescolato nel tuo browser.',
  },
  siteName: 'Penitenze con le carte',
  privacyLink: 'Informativa sulla privacy',

  hero: {
    h1Kicker: 'Penitenze con le carte',
    h1Html: 'Gira le carte,<br><em>scopri la penitenza</em>',
    hook: 'Una carta coperta a testa. Alcune nascondono una penitenza, le altre sono salve. Stavolta chi tocca?',
  },

  ui: {
    playersLabel: 'Quanti giocatori?',
    playersDec: 'Un giocatore in meno',
    playersInc: 'Un giocatore in più',
    penaltyLabel: 'Quante carte penitenza?',
    penaltyDec: 'Una carta penitenza in meno',
    penaltyInc: 'Una carta penitenza in più',
    penaltyHint: 'Parte da circa un terzo dei giocatori. Puoi cambiarlo.',
    itemsLabel: 'Elenco delle penitenze',
    itemsHint: 'Una penitenza per riga. Le carte penitenza pescano da questo elenco in ordine casuale. Modificalo come vuoi.',
    itemsPh: 'Cantare una canzone\nFare un brindisi',
    resetItems: 'Ripristina le penitenze di esempio',
    itemsCount: '{count} righe',
    namesBtn: '+ Aggiungi i nomi (facoltativo)',
    namesLabel: 'Nomi, nell’ordine dei turni',
    namesPh: 'Giulia\nMarco\nChiara',
    namesHint: 'Se lasci vuoto, i turni diventano “1°, 2°, 3°”. Va bene anche avere meno nomi che giocatori.',
    start: 'Mescola le carte 🃏',
    begin: 'Inizia',
    setupTitle: 'Impostazioni',
    fair: 'Mescolato una volta con numeri casuali crittografici · nulla lascia il tuo browser',
  },

  errors: {
    playersRange: 'Scegli tra 2 e 12 giocatori.',
    penaltiesRange: 'Le carte penitenza vanno da 1 al numero di giocatori.',
    itemsEmpty: 'Scrivi almeno una penitenza.',
    itemsTooMany: 'Puoi usare fino a 30 penitenze.',
    namesTooMany: 'Ci sono più nomi che giocatori. Togli un nome o aggiungi un giocatore.',
    badLink: 'Questo link del risultato è rotto o incompleto, quindi non si può mostrare nulla.',
  },

  draw: {
    progress: '{done}/{n} girate',
    left: 'Rimangono {n} carte',
    turn: 'Tocca a: {who}',
    turnNum: 'Turno {k}',
    numbered: 'Giocatore {k}',
    pick: 'Tocca una carta coperta qualsiasi. Tutte erano già decise al momento del mescolamento.',
    gridAria: 'Carte penitenza coperte',
    cardAria: 'Carta {k}, coperta',
    penaltyTag: 'Penitenza!',
    safeTag: 'Salvo',
    revealPenalty: '{who}: {text}',
    revealSafe: '{who} è salvo stavolta',
    revealNone: 'Tocca una carta per vedere il risultato qui.',
    flipAll: 'Gira tutte',
    reshuffle: 'Mescola di nuovo',
    seeResults: 'Vedi i risultati',
    done: 'Tutte le carte sono state girate.',
    live: '{who}: {text}',
    liveSafe: '{who}: salvo',
  },

  result: {
    heading: 'Chi prende la penitenza',
    sharedBadge: '🃏 Risultato condiviso',
    sharedNote: 'Questo è il risultato salvato nel link. Non viene mescolato di nuovo.',
    summary: '{k} penitenza · {s} salvi',
    summaryMany: '{k} penitenze · {s} salvi',
    listHead: 'Penitenze di questo giro',
    safeList: 'Salvi: {names}',
    copy: 'Copia come testo',
    copied: 'Risultato copiato',
    copyLink: 'Copia il link',
    linkCopied: 'Link copiato. Chi lo apre vede esattamente questo risultato.',
    again: 'Provaci anche tu',
    edit: 'Cambia le impostazioni',
    textTitle: '🃏 Risultato di Penitenze con le carte',
    textSafe: 'salvo',
    shareTitle: 'Penitenze con le carte',
    shareText: 'Gira le carte e scegli la penitenza della serata 🃏',
  },

  og: {
    brand: '🃏 Penitenze con le carte',
    kicker: 'Penitenze di festa · una carta alla volta',
    title: 'Scegli la penitenza girando le carte',
    desc: 'Casuale, equo e pronto in pochi secondi',
    sample: 'Cantare una canzone',
  },

  defaults: [
    'Cantare una canzone (basta il ritornello)',
    'Fare un brindisi in una frase',
    'Fare una posa dolcissima',
    'Versare dell’acqua alla persona alla tua sinistra',
    'Ballare la danza del robot per 10 secondi',
    'Presentarti di nuovo con una frase in più',
    'Far partire la canzone scelta dalla persona alla tua destra',
    'Raccontare una battuta su di te',
    'Leggere la frase successiva con voce da trailer',
    'Indovinare al primo colpo la canzone preferita del prossimo',
  ],

  faq: [
    { q: 'Il mescolamento è davvero equo?', a: 'Sì. Quando mescoli, le carte vengono disposte una sola volta con il generatore di numeri casuali crittografico del tuo browser (crypto.getRandomValues), usando un campionamento per rifiuto e il mescolamento di Fisher–Yates. Tutto è fissato in quell’istante, quindi non conta quale carta si tocca.' },
    { q: 'Come vengono scelti i testi delle penitenze?', a: 'Ogni carta penitenza prende una riga dal tuo elenco in ordine casuale. Se le righe sono meno delle carte penitenza, l’elenco mescolato viene riutilizzato. Modifica le righe prima di mescolare, per adattarle al tuo gruppo.' },
    { q: 'Si può rifiutare una penitenza?', a: 'Sì. Le penitenze servono per divertirsi e sono sempre facoltative. Se qualcuno non vuole farne una, il gruppo può sostituirla con una più leggera.' },
    { q: 'Come condivido il risultato con il gruppo?', a: 'Nella schermata dei risultati tocca «Copia come testo» per incollare l’elenco in una chat, oppure «Copia il link». Il link contiene questo risultato esatto: chi lo apre vede le stesse carte senza un nuovo mescolamento.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Penitenze con le carte',
    description: 'Informativa sulla privacy di Penitenze con le carte: nomi, penitenze e risultati restano nel tuo browser; cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Penitenze con le carte (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. I nomi, le penitenze e i risultati che inserisci vengono elaborati solo nel tuo browser e non vengono inviati al nostro server. Le tue ultime impostazioni restano nella memoria locale del browser sul tuo dispositivo e puoi cancellarle quando vuoi. Quando copi un link del risultato, nomi, penitenze e risultati vengono inseriti nel link stesso e sono visibili solo alle persone a cui lo invii.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare lingua e impostazioni, mostrare pubblicità e capire come viene usato. Puoi rifiutarli o cancellarli nelle impostazioni del browser; in tal caso alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per distribuire annunci in base alle tue visite precedenti a questo e ad altri siti. Per saperne di più e cambiare le preferenze, consulta le <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri, che conservano solo i totali giornalieri per lingua (visualizzazioni, partite iniziate e completate). Nulla di tutto questo identifica personalmente l’utente.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è in vigore dall’11 novembre 2026.'],
    ],
    back: '← Torna a Penitenze con le carte',
  },
};
