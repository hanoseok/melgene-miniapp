/* Torneo del cibo – Cosa preferisci mangiare? — Italiano (/it/)
 * Stessa struttura di chiavi di en.js. Id dei piatti, emoji e tabellone: food-cup-core.js.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Oswald:wght@600&display=swap',
    display: "'Unbounded'",
    displayWeight: 800,
    name: "'Oswald'",
    nameWeight: 600,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Torneo del cibo – Cosa preferisci mangiare?',
    description: 'Torneo del cibo: due piatti per sfida, tocca quello che preferisci mangiare finché resta un campione. Il «preferiresti» del cibo in un minuto. Gratis, senza download.',
    ogTitle: 'Torneo del cibo 🏆 Cosa preferisci mangiare?',
    ogDescription: 'Due piatti, una scelta, quindici sfide. Quale cibo incoronerai?',
  },
  siteName: 'Torneo del cibo',
  privacyLink: 'Privacy',

  start: {
    badge: '🍽️ Preferiresti · edizione cibo',
    h1Kicker: 'Torneo del cibo',
    h1Html: 'Quale piatto vince<br>la <em>corona</em>?',
    hook: 'Due piatti, una sola scelta. Continua finché resta solo il tuo preferito.',
    facts: '16 piatti · 15 scelte · 1 min',
    start: 'Inizia il torneo →',
  },

  play: {
    rounds: { r16: 'Ottavi di finale', qf: 'Quarti di finale', sf: 'Semifinale', f: 'Finale' },
    roundFmt: '{round} · {n}/{total}',
    progressAria: 'Scelta {n} di {total}',
    hint: 'Cosa preferiresti mangiare?',
    vs: 'VS',
    pickAria: 'Scegli {food}',
    same: 'Il {pct}% ha scelto come te',
  },

  result: {
    eyebrow: 'Il tuo piatto campione',
    champPct: 'Anche il {pct}% dei giocatori ha incoronato questo piatto',
    champFirst: 'Sei tra i primi ad arrivare in fondo: ancora niente statistiche.',
    fourTitle: 'Le tue semifinaliste',
    retry: 'Gioca ancora (nuovo tabellone)',
    shareTitle: 'Torneo del cibo – Cosa preferisci mangiare?',
    shareText: 'Il mio piatto campione è {emoji} {food}! E il tuo?',
  },

  foods: {
    pizza: 'Pizza',
    burger: 'Hamburger',
    sushi: 'Sushi',
    noodles: 'Ramen',
    chicken: 'Pollo fritto',
    tacos: 'Tacos',
    pasta: 'Spaghetti',
    curry: 'Curry',
    dumplings: 'Ravioli cinesi',
    steak: 'Bistecca',
    hotpot: 'Minestrone',
    hotdog: 'Hot dog',
    friedrice: 'Riso cantonese',
    sandwich: 'Panino',
    stew: 'Paella',
    shrimp: 'Gamberi fritti',
  },

  og: {
    brand: '🏆 Torneo del cibo',
    defaultKicker: 'Preferiresti · edizione cibo',
    defaultTitle: 'Quale piatto vince la corona?',
    defaultDesc: 'Due piatti alla volta · un campione · circa un minuto',
  },

  faq: [
    { q: 'Come funziona il torneo del cibo?', a: 'Sedici piatti vengono sorteggiati in un tabellone casuale. In ogni sfida ne compaiono due: tocca quello che preferisci mangiare e passa al turno dopo. Ottavi, quarti, semifinali e finale fanno 15 scelte, e l’ultimo piatto rimasto è il tuo campione.' },
    { q: 'Le percentuali sono vere?', a: 'Sì. Ogni scelta viene contata in forma anonima sul nostro server, una sola volta per browser per ogni sfida. Una percentuale compare solo quando abbastanza persone hanno giocato proprio quella sfida; prima preferiamo non mostrare nulla piuttosto che un numero inventato.' },
    { q: 'Posso rigiocare o condividere il risultato?', a: 'Gioca quante volte vuoi: ogni partita ha un nuovo tabellone casuale, quindi le sfide cambiano. Con i pulsanti di condivisione mandi il tuo campione agli amici e vedi cosa scelgono loro.' },
    { q: 'Perché proprio questi sedici piatti?', a: 'Sono piatti amati in tutto il mondo, dallo street food al comfort food. I nomi seguono come si dicono in italiano, ma i piatti sono gli stessi in tutte le lingue, quindi le percentuali mettono insieme giocatori di ogni paese.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Torneo del cibo',
    description: 'Informativa sulla privacy del Torneo del cibo: conteggio anonimo delle scelte, cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Torneo del cibo (il «Servizio») rispetta la tua privacy e tratta solo le informazioni minime descritte di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Il Servizio funziona senza account né accesso. Le tue scelte vengono inviate al nostro server solo come totali anonimi (quale piatto ha vinto ogni sfida e quale piatto hai incoronato), senza nome né identificativi personali. Durante l’uso alcune informazioni possono essere raccolte automaticamente, come descritto sotto.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie e l’archiviazione locale del browser per ricordare la lingua e le sfide già contate, mostrare annunci e capire come viene usato. Puoi rifiutarli o cancellarli dalle impostazioni del browser; alcune funzioni potrebbero non funzionare come previsto.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrare annunci in base alle tue visite precedenti a questo e ad altri siti. Maggiori informazioni e preferenze nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Per migliorare il Servizio possiamo usare Google Analytics (GA4) e contatori aggregati nostri che conservano solo totali giornalieri per lingua (visualizzazioni, tornei completati, valutazioni). Nulla di tutto questo ti identifica personalmente.'],
      ['5. Contatti', 'Per domande su questa informativa, contatta il gestore del sito.'],
      ['6. Data di validità', 'Questa informativa è valida dal 29 settembre 2026.'],
    ],
    back: '← Torna al Torneo del cibo',
  },
};
