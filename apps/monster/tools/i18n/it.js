/* Which Monster Are You? — Italiano (/it/)
 * Same 12 monster ids and question/choice order as monster-core.js (scoring weights live only there).
 * Keys ending in Html are inserted as raw HTML (only <br>, <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq never name a monster or quote a question.
 */
module.exports = {
  // Fonts (per language): css = Google Fonts stylesheet, display = rounded display font stack for titles/buttons,
  // displayWeight, sans = optional body font (omit → shared default), wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Che mostro sei? Test di personalità di Halloween',
    description: 'Che mostro sei? Fai questo test di personalità di Halloween gratis: 10 domande buffe e da brivido, in circa un minuto, senza registrazione. Scopri il mostro che ti somiglia di più.',
    ogTitle: 'Che mostro sei? 🎃 Test di personalità di Halloween',
    ogDescription: 'Un test di personalità di Halloween gratis, in un minuto. Rispondi a 10 domande buffe e da brivido e incontra il tuo mostro gemello.',
  },
  siteName: 'Che Mostro Sei?',
  privacyLink: 'Informativa sulla privacy',

  start: {
    badge: '🎃 Speciale Halloween',
    h1Kicker: 'Test di personalità di Halloween',
    h1Html: 'Che <em>mostro</em><br>sei?',
    hook: 'Una notte da brivido, dieci piccole scelte. Da qualche parte nel buio, ti aspetta un mostro che ti somiglia in modo impressionante.',
    metaTime: '⏱️ Circa 1 minuto',
    metaCount: '🦇 10 domande',
    start: 'Evoca il mio mostro →',
  },

  quiz: {
    backAria: 'Domanda precedente',
    progressAria: 'Avanzamento',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Sto evocando il tuo mostro…',
    sub: 'Sto mescolando il calderone',
  },

  result: {
    title: 'Che mostro sei? A me è uscito {name}',
    eyebrow: 'Il mostro che ti somiglia è',
    strengthsLabel: 'Poteri del mostro',
    partyLabel: 'A una festa di Halloween, tu sei…',
    bestLabel: 'Amico del cuore',
    rivalLabel: 'Rivale simpatico',
    sameShare: 'Il {pct}% dei giocatori ha avuto questo mostro',
    shareText: 'Il mio mostro di Halloween è {name} {emoji} — «{catch}» E tu, che mostro sei?',
    ctaStrong: 'Un amico ti ha mandato il suo mostro',
    ctaSub: 'E tu, quale sei? Basta un minuto.',
    retry: 'Rifai il test',
  },

  og: {
    eyebrow: 'Il mio mostro di Halloween',
    brand: '🎃 Che Mostro Sei?',
    defaultKicker: 'Test di personalità di Halloween',
    defaultTitle: 'Che mostro sei?',
    defaultDesc: '10 domande buffe e da brivido · circa 1 minuto',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'Come funziona il test del mostro?', a: 'Ogni risposta assegna punti a diversi mostri, e quello con più punti diventa il tuo risultato. I pareggi si risolvono con una regola fissa, quindi le stesse risposte danno sempre lo stesso mostro.' },
    { q: 'Fa paura?', a: 'Per niente! È un quiz di Halloween tenero e adatto a tutta la famiglia — niente sangue né spaventi improvvisi, solo un pizzico di brivido divertente.' },
    { q: 'Posso avere un mostro diverso?', a: 'Sì. Il risultato dipende solo dalle tue risposte, quindi rispondendo in modo diverso può uscire un altro mostro.' },
    { q: 'Le mie risposte vengono salvate?', a: 'No. Le tue risposte vengono calcolate nel tuo browser e non vengono mai conservate. Contiamo solo, in modo anonimo, quale mostro è uscito, per mostrare quanto è frequente ogni risultato.' },
  ],

  privacy: {
    title: 'Informativa sulla privacy | Che Mostro Sei?',
    description: 'Informativa sulla privacy di Che Mostro Sei? — come usiamo cookie, pubblicità e statistiche anonime.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Che Mostro Sei? (il "Servizio") rispetta la tua privacy e tratta solo il minimo di informazioni necessarie, come descritto di seguito.',
    sections: [
      ['1. Informazioni che raccogliamo', 'Puoi usare il Servizio senza registrarti né effettuare l’accesso. Le tue risposte vengono calcolate all’interno del tuo browser e non vengono mai inviate né conservate sui nostri server. Contiamo solo, in modo anonimo, quale tipo di mostro è uscito, per poter mostrare quanto è frequente ogni risultato.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie per mostrare pubblicità e capire come viene utilizzato. Puoi rifiutare o eliminare i cookie dalle impostazioni del tuo browser; alcune funzionalità potrebbero non funzionare correttamente.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra pubblicità tramite Google AdSense. Google e i suoi partner possono usare cookie per proporre annunci in base alle tue visite precedenti a questo e ad altri siti. Puoi saperne di più e modificare le impostazioni sulla pubblicità personalizzata nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">impostazioni annunci di Google</a>.'],
      ['4. Statistiche', 'Conserviamo totali giornalieri anonimi (visualizzazioni di pagina, test completati, valutazioni) per migliorare il Servizio. Questi totali non permettono di identificarti personalmente.'],
      ['5. Contatti', 'Per qualsiasi domanda su questa Informativa sulla privacy, contatta il gestore del sito.'],
      ['6. Data di entrata in vigore', 'Questa informativa è in vigore dal 27 settembre 2026.'],
    ],
    back: '← Torna al test del mostro',
  },

  questions: [
    { q: 'Ti arriva all’ultimo un invito a una festa di Halloween. Primo pensiero?', choices: [
      'Cosa mi metto? Deve essere iconico.',
      'Ci sarà da mangiare? Allora ci sono.',
      'Mmm… chi altro viene?',
      'Porto io le decorazioni. E la playlist.',
    ] },
    { q: 'Sono passati trenta minuti dall’inizio della festa. Dove sei?', choices: [
      'Al centro della pista, tra un passo di danza e l’altro',
      'Al tavolo degli snack. Terzo piatto.',
      'In un angolo tranquillo, in una chiacchierata profonda',
      'Già amico di tutti, senza sapere come sia successo',
    ] },
    { q: 'Un urlo rimbomba in fondo a un corridoio buio pesto. Tu…', choices: [
      'Urli ancora più forte, poi scoppi a ridere',
      'Ti fiondi a vedere. Qualcuno potrebbe avere bisogno di aiuto!',
      'Ti blocchi e ti confondi in silenzio con il muro',
      'Guardi l’ora con calma. Sarà uno scherzo.',
    ] },
    { q: 'È mezzanotte e ti è venuta fame. Cosa prendi?', choices: [
      'Qualcosa di rosso e chic: succo di ciliegia e cioccolato fondente',
      'Quello che c’è in frigo. Tutto quanto.',
      'Cioccolata calda con il mio mix segreto di spezie',
    ] },
    { q: 'Qual è la tua strategia per il costume?', choices: [
      'Fatto a mano. Ci lavoro da agosto.',
      'Un vecchio lenzuolo con due buchi per gli occhi. Fatto.',
      'Mi avvolgo in quello che trovo. Anche la carta igienica va bene.',
      'Un look diverso ogni ora. Tenerli sulle spine.',
    ] },
    { q: 'Din don! Bambini mascherati suonano alla porta. Tu…', choices: [
      'Distribuisci barrette di cioccolato intere e applaudi ogni costume',
      'Spunti da dietro la porta con uno spavento (soft)',
      'Spegni la luce e sbirci dalla tenda. Non c’è nessuno.',
    ] },
    { q: 'Come ti descriverebbero i tuoi amici?', choices: [
      'Sembra intimidatorio, ma è un tenerone gigante',
      'Sempre puntuale e stranamente calmo in ogni circostanza',
      'Fa sempre quello che vuole e in qualche modo la fa sempre franca',
      'Misterioso. Ha un rimedio per letteralmente tutto',
    ] },
    { q: 'Sono le 3 del mattino. La festa si sta spegnendo. Tu sei…', choices: [
      'Appena partito. After-party a casa mia!',
      'Addormentato sul divano. Da mezzanotte.',
      'Impacchetti gli avanzi in contenitori etichettati con cura',
      'Stai riparando la cassa che qualcuno ha rotto, così la musica continua',
    ] },
    { q: 'Esci fuori e c’è una luna piena enorme. Ti senti…', choices: [
      'Selvaggio. Ho bisogno di correre da qualche parte. Ovunque!',
      'Sognante. Notte perfetta per una passeggiata lenta e silenziosa.',
      'Coccolone. Si torna dentro: coperta, tè, film vecchio.',
      'Fortunato. Presto, esprimi un desiderio!',
    ] },
    { q: 'Scegli il tuo motto per la notte di Halloween.', choices: [
      'Balla come se nessuno ti guardasse. Tanto sono tutti fantasmi.',
      'Nove vite, zero pensieri.',
      'Puntuale come un orologio, sempre.',
      'C’è un incantesimo per questo.',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampiro',
      catch: 'Elegantemente in ritardo, drammatico con classe.',
      desc: 'Sei una creatura della notte dal gusto impeccabile — nei vestiti, nella musica, negli snack. Le persone vengono attratte da te ancora prima che tu apra bocca, e sai esattamente come fare il tuo ingresso. Preferisci restare sveglio fino all’alba per una bella chiacchierata piuttosto che andare a letto presto. Sì, sei un po’ teatrale. Ed è proprio per questo che tutti ti adorano.',
      strengths: ['Fascino magnetico', 'Gusto impeccabile', 'Resistenza da nottambulo'],
      party: 'Quello che arriva per ultimo e diventa subito il protagonista della serata.',
    },
    werewolf: {
      name: 'Lupo mannaro',
      catch: 'Fedele al branco, selvaggio nell’anima.',
      desc: 'Hai un’energia senza limiti e un cuore grande come una luna piena. I tuoi amici sono il tuo branco, e attraverseresti la città di corsa a mezzanotte se uno di loro avesse bisogno di te. Sei onesto fino all’osso, quasi sempre affamato, e il tuo umore segue… diciamo, le fasi lunari. Quando ti butti in qualcosa, ci vai a tutta birra — e l’intera stanza lo sente.',
      strengths: ['Lealtà feroce', 'Energia infinita', 'Onestà (di quella buona)'],
      party: 'Guida l’assalto al buffet, poi ulula insieme a ogni canzone.',
    },
    witch: {
      name: 'Strega',
      catch: 'Prepara idee, incanta piani, non finisce mai i trucchi.',
      desc: 'Curiosa, sveglia e un po’ birichina — hai sempre un piano, un piano B e un ingrediente segreto. Adori collezionare curiosità strane per trasformarle in qualcosa di utile (o splendidamente caotico). Gli amici vengono da te per un consiglio perché le tue risposte funzionano davvero. Indipendente fino al midollo, preferisci volare sulla tua scopa piuttosto che aspettare un passaggio.',
      strengths: ['Problem solving affilato', 'Curiosità infinita', 'Un rimedio per tutto'],
      party: 'Mescola pozioni misteriose in cucina e legge il futuro a tutti quanti.',
    },
    ghost: {
      name: 'Fantasma',
      catch: 'Discreto, gentile, e in segreto il più divertente della compagnia.',
      desc: 'Fluttui nella vita con leggerezza e noti tutto quello che agli altri sfugge. Non sei proprio timido — semplicemente preferisci pochi amici veri a una stanza piena di gente. Quando parli, tiri fuori sempre la battuta perfetta al momento giusto che fa ridere tutti. Sei anche un maestro dell’uscita silenziosa: qui un secondo, tranquillamente a letto quello dopo.',
      strengths: ['Osservatore acuto', 'Umorismo impassibile', 'Presenza rassicurante'],
      party: 'Fluttua di stanza in stanza, origlia le storie migliori, poi svanisce senza lasciare traccia.',
    },
    zombie: {
      name: 'Zombie',
      catch: 'Lento, costante, e assolutamente impassibile.',
      desc: 'Niente ti scuote. Scadenze, drammi, caos — tu avanzi strascicando i piedi al tuo ritmo e in qualche modo arrivi comunque. Vai a snack e pisolini, e sei la prova vivente che la calma è un superpotere. Ai tuoi amici piace un sacco quanto sei alla mano; ci stai per qualunque cosa, basta che ci sia da mangiare. Solo, non svegliarti prima di mezzogiorno.',
      strengths: ['Calma incrollabile', 'Va con il flusso', 'Costanza sorprendente'],
      party: 'Sul divano, un piatto in ogni mano, in pace assoluta con l’universo.',
    },
    mummy: {
      name: 'Mummia',
      catch: 'Un’anima antica avvolta in strati morbidi e caldi.',
      desc: 'Ami la tua casa, le tue abitudini e i tuoi scaffali perfettamente ordinati. Conservi le cose per anni — biglietti di concerti, vecchie foto, amicizie — e ti prendi cura di tutte con dedizione. Qualcuno ti dice antiquato; tu lo chiami senza tempo. Sotto tutte quelle bende c’è un cuore caldo e leale su cui si può contare per secoli.',
      strengths: ['Affidabilità granitica', 'Organizzazione impeccabile', 'Amicizie che durano per sempre'],
      party: 'Avvolta in una coperta vicino al fuoco, mentre racconta le sue storie migliori dei bei vecchi tempi.',
    },
    frank: {
      name: 'Mostro di Frankenstein',
      catch: 'Grande, tenero, e costruito con il cuore.',
      desc: 'A prima vista puoi sembrare serio, ma chi ti conosce sa che sei l’anima più gentile della stanza. Sei un tuttofare: aggiusti le cose, costruisci, e mostri affetto con i fatti più che con le parole. A volte ti senti un po’ incompreso, ma gli amici che ti capiscono farebbero di tutto per te. È vivo… ed è adorabile.',
      strengths: ['Abile in ogni riparazione', 'Cuore d’oro', 'Solido e affidabile'],
      party: 'Sistema in silenzio le lucine, poi balla goffamente un lento quando arriva la canzone giusta.',
    },
    pumpkin: {
      name: 'Zucca di Halloween',
      catch: 'Sorriso che brilla, buonumore immediato.',
      desc: 'Illumini ogni stanza — quasi letteralmente. Il tuo ottimismo è contagioso, la tua risata si sente da lontano, e di solito sei tu ad aver organizzato la festa fin dall’inizio. Fai sentire tutti benvenuti e non dimentichi mai un nome. Anche nella notte più buia trovi qualcosa da cui sorridere, e aiuti gli altri a trovarlo a loro volta.',
      strengths: ['Positività contagiosa', 'Padrone di casa nato', 'Fa sentire tutti a proprio agio'],
      party: 'L’organizzatore, l’animatore, e il motivo per cui tutti sono venuti.',
    },
    blackcat: {
      name: 'Gatto nero',
      catch: 'Misterioso, indipendente, cool senza il minimo sforzo.',
      desc: 'Fai le cose a modo tuo e sembri cool senza nemmeno provarci. Sei selettivo su chi si avvicina, ma quando scegli qualcuno, ha un amico per tutte e nove le vite. Adori un buon pisolino, un angolo tranquillo e stare in pace — finché all’improvviso non vuoi tutta l’attenzione per te. Qualcuno dice che porti sfortuna. I tuoi amici sanno che sei il loro portafortuna.',
      strengths: ['Stile senza sforzo', 'Istinti affilati', 'Selettivo ma leale'],
      party: 'Appollaiato sul posto migliore della casa, mentre giudica tutti con affetto.',
    },
    reaper: {
      name: 'Il Mietitore',
      catch: 'Calmo, puntuale, e non manca mai una scadenza.',
      desc: 'Sei la calma in mezzo alla tempesta di tutti gli altri. Mentre gli altri vanno nel panico, tu controlli il programma, fai un piano e lo porti a termine — puntuale, ogni volta. Il tuo umorismo è così pungente che la gente capisce la battuta un’ora dopo. Il cappuccio sembra intimidatorio, ma in realtà sei tu quello che si assicura che tutti tornino a casa sani e salvi.',
      strengths: ['Sangue freddo sotto pressione', 'Tempismo perfetto', 'Premuroso in segreto'],
      party: 'Controlla l’orologio alle 23:58, poi annuncia con calma assoluta l’ultima canzone.',
    },
    fox: {
      name: 'Volpe a nove code',
      catch: 'Un mutaforma con un sorriso pronto per ogni occasione.',
      desc: 'Ti adatti a qualunque contesto — la cena elegante, la festa scatenata in casa, la riunione di famiglia. Leggi le persone all’istante e sai sempre cosa dire. Furbo e giocoso, adori un buon gioco e di solito lo vinci. Dietro tutti quei sorrisi affascinanti si nasconde qualcuno ferocemente leale verso i pochi che hanno visto le tue vere code.',
      strengths: ['Legge l’atmosfera all’istante', 'Battuta pronta', 'Si adatta a tutto'],
      party: 'Cambia costume due volte e in qualche modo diventa migliore amico della nonna del padrone di casa.',
    },
    skeleton: {
      name: 'Scheletro',
      catch: 'Osso della risata? Sei fatto tutto di quello.',
      desc: 'Non prendi la vita troppo sul serio — e onestamente, è proprio questo il tuo segreto. Fai battute nei momenti peggiori, balli con qualsiasi scusa e riesci a tirare su il morale a chiunque in trenta secondi. Viaggi leggero e vivi in modo semplice: niente drammi, niente storie, solo buonumore. Le persone si sentono più leggere vicino a te, come se avessero perso qualche chilo di preoccupazioni.',
      strengths: ['Solleva l’umore all’istante', 'Buffo senza vergogna', 'Zero drammi, tutto relax'],
      party: 'Sferraglia sulla pista da ballo e improvvisa un trenino che nessuno aveva chiesto.',
    },
  },
};
