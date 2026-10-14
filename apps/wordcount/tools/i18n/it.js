/* Contatore di parole — italiano (it/)
 * La logica di conteggio è in wordcount-core.js; questo file contiene tutti i testi visibili in questa lingua.
 * Le chiavi che finiscono con Html sono inserite come HTML (solo <br> e <em>); anche privacy.sections.
 * Lascia {n} {max} {m} {s} {pct} {chars} {words} come sono.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    display: "'Montserrat'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Contatore di parole e caratteri online gratis',
    description: 'Contatore di parole e caratteri gratis: caratteri con e senza spazi, parole, frasi, paragrafi, byte, tempo di lettura e un limite obiettivo. Funziona nel tuo browser.',
    ogTitle: 'Contatore di parole 📝 caratteri, parole, byte',
    ogDescription: 'Incolla il testo e vedi subito caratteri, parole, frasi, byte e tempo di lettura. Non viene inviato nulla.',
  },
  siteName: 'Contatore di parole',
  privacyLink: 'Privacy',

  hero: {
    h1Kicker: 'Contatore di parole',
    h1Html: 'Ogni carattere contato<br><em>mentre scrivi</em>',
    hook: 'Scrivi o incolla il testo. Caratteri, parole e byte si aggiornano subito, e una barra ti avvisa quando superi il limite.',
  },

  ui: {
    editorLabel: 'Il tuo testo',
    placeholder: 'Scrivi o incolla qui il tuo testo…',
    bar: { chars: 'Caratteri', noSpaces: 'Senza spazi', words: 'Parole', bytes: 'Byte' },
    toolsLabel: 'Strumenti di testo',
    tools: { copy: 'Copia', tidy: 'Pulisci spazi', join: 'Unisci righe', clear: 'Cancella tutto', undo: 'Annulla' },
    saved: 'La bozza resta salvata solo su questo dispositivo, mai caricata.',
    copied: 'Testo copiato',
    copyFail: 'Impossibile copiare. Seleziona il testo e copialo tu.',
    cleared: 'Testo cancellato. Tocca Annulla per recuperarlo.',
    tidied: 'Spazi doppi e righe vuote eliminati.',
    joined: 'A capo eliminati.',
    undone: 'Modifica annullata.',
    nothing: 'Niente da cambiare.',
    limitLabel: 'Lunghezza obiettivo',
    limitOff: 'No',
    limitChip: '{n}',
    limitCustom: 'Altro',
    limitCustomPh: 'es. 280',
    limitCustomAria: 'Lunghezza obiettivo in caratteri',
    limitSpaces: 'Conta gli spazi',
    limitText: '{n} / {max} caratteri',
    limitLeft: 'ne mancano {n}',
    limitOver: '{n} oltre il limite',
    statsLabel: 'Conteggio dettagliato',
    stats: {
      chars: 'Caratteri (spazi inclusi)',
      noSpaces: 'Caratteri (senza spazi)',
      words: 'Parole',
      sentences: 'Frasi',
      paragraphs: 'Paragrafi',
      lines: 'Righe',
      reading: 'Tempo di lettura',
      speaking: 'Tempo di parlato',
      bytes: 'Byte',
    },
    byteMode: { utf8: 'UTF-8', neis: 'UTF-8 + CRLF', legacy: 'Vecchio 2 byte' },
    byteHint: {
      utf8: 'UTF-8 standard: lettere senza accento e spazi 1 byte, à è ì ò ù 2, cinese, giapponese e coreano 3, emoji 4. Un a capo vale 1 byte.',
      neis: 'UTF-8, ma ogni a capo conta 2 byte (CR + LF), come nei file di testo di Windows.',
      legacy: 'Vecchie codifiche a 2 byte (EUC-KR, Shift_JIS, GBK): ASCII 1 byte, ogni altro carattere 2, a capo 2.',
    },
    time: { sec: '{s} s', min: '{m} min', minSec: '{m} min {s} s' },
    timeNote: 'I tempi sono stime: circa 238 parole al minuto leggendo in silenzio e 150 parlando.',
    kwLabel: 'Parole più ripetute',
    kwEmpty: 'Qui compaiono le parole che usi due o più volte. Quelle comunissime come «di» o «che» sono escluse.',
    kwCount: '{n}×',
    finish: 'Vedi riepilogo ✓',
    needText: 'Prima scrivi o incolla un testo.',
    local: 'Contato sul tuo dispositivo. Il testo non viene mai inviato.',
  },

  result: {
    heading: 'Il tuo testo in breve',
    limitOk: 'Dentro il tuo obiettivo di {max} caratteri ({pct}%).',
    limitOver: '{n} caratteri oltre il tuo obiettivo di {max}.',
    copySummary: 'Copia riepilogo',
    summaryCopied: 'Riepilogo copiato',
    summaryTitle: 'Riepilogo conteggio',
    again: 'Conta un altro testo',
    live: 'Riepilogo pronto: {chars} caratteri, {words} parole.',
    shareTitle: 'Contatore di parole',
    shareText: 'Contatore di parole e caratteri gratis, con byte e tempo di lettura. Il testo resta sul tuo dispositivo 📝',
  },

  og: {
    brand: '📝 Contatore di parole',
    kicker: 'Caratteri · parole · byte · lettura',
    title: 'Conta caratteri e parole in tempo reale',
    desc: 'Gratis, e il testo resta sul tuo dispositivo',
  },

  faq: [
    { q: 'Spazi e a capo vengono contati?', a: 'Vedi entrambi i numeri. «Spazi inclusi» conta anche spazi e a capo (1 ciascuno). «Senza spazi» toglie tutti gli spazi, le tabulazioni e gli a capo. Con l’interruttore «Conta gli spazi» scegli quale numero segue la barra dell’obiettivo.' },
    { q: 'Perché il risultato è diverso da Word o Google Docs?', a: 'Ogni strumento ha le sue regole. Alcuni contano una parola con il trattino come due, altri un’emoji come due caratteri, e Word ignora gli a capo. Qui un’emoji o una lettera accentata vale 1 carattere, le parole con trattino contano 1 e un a capo vale 1.' },
    { q: 'Come vengono contati i byte?', a: 'Scegli la regola del modulo che stai compilando. La maggior parte dei siti usa UTF-8. UTF-8 + CRLF conta ogni a capo come 2 byte. Vecchio 2 byte conta l’ASCII 1 byte e ogni altro carattere 2, come i vecchi sistemi asiatici.' },
    { q: 'Il mio testo viene salvato o inviato?', a: 'Non lascia mai il tuo dispositivo. La bozza resta nella memoria locale di questo browser per sopravvivere a un ricaricamento, e «Cancella tutto» la elimina. Il testo non finisce nell’indirizzo della pagina né nei link di condivisione.' },
  ],

  privacy: {
    title: 'Privacy | Contatore di parole',
    description: 'Informativa privacy del Contatore di parole: il testo viene contato e salvato solo nel tuo browser; cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Contatore di parole (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte qui sotto.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. Il testo che scrivi o incolli viene contato solo nel tuo browser. Non viene mai inviato al nostro server né ad altri, e non viene mai scritto nell’indirizzo della pagina o nei link di condivisione. Per conservare la bozza dopo un ricaricamento, il testo e le impostazioni sono salvati solo nella memoria locale del browser su questo dispositivo; «Cancella tutto» elimina la bozza salvata, così come cancellare i dati del sito nel browser.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e la memoria locale del browser per ricordare lingua e impostazioni, mostrare annunci e capire come viene usato. Puoi rifiutarli o eliminarli nelle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (visualizzazioni, utilizzi, valutazioni). Questi contatori non includono mai il tuo testo né i suoi numeri e non ti identificano.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di efficacia', 'Questa informativa è valida dal 15 ottobre 2026.'],
    ],
    back: '← Torna al Contatore di parole',
  },
};
