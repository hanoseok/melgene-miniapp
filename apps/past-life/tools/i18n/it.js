/* Test vita precedente — italiano (/it/)
 * Stessi 16 id di archetipo e stesso ordine di domande/scelte di data.js (i pesi di punteggio restano solo lì).
 * Diamo del "tu" ovunque. I ruoli storici coreani hanno un accenno per far arrivare la battuta a lettori globali
 * (cucina reale = il K-drama «Il gioiello nel palazzo», jeongisu = un cantastorie da tenerti sulle spine,
 * amhaeng-eosa = uno Zorro coreano con tanto di placca, il ninja "che in realtà era un postino").
 * Le chiavi che finiscono in Html vengono inserite come HTML grezzo, così come i corpi di privacy.sections.
 * Niente spoiler in meta/landing/og/faq.
 */
module.exports = {
  // Fonts: fontCss = extra stylesheets (omit → Pretendard), font = page font stack (omit → shared default)
  typography: {},

  meta: {
    title: 'Test vita precedente: chi eri tu?',
    description: 'Test di personalità gratis sulla vita precedente: rispondi a 12 domande sulle tue abitudini quotidiane e scopri chi eri in una vita passata. Senza registrazione, in 2 minuti.',
    ogTitle: 'Test vita precedente — Chi eri in una vita passata?',
    ogDescription: 'Il test vita precedente gratis in 2 minuti: 12 domande di ogni giorno, 16 vite possibili. E tu, chi eri?',
  },
  siteName: 'Test vita precedente',
  landing: {
    badge: '🔮 Più divertente del tuo oroscopo',
    h1Kicker: 'Test vita precedente',
    h1Html: 'Chi eri in una<br><em>vita precedente</em>?',
    hookHtml: 'Dodici domande. Due minuti.<br>E riscopri il te che avevi dimenticato.',
    metaTime: '⏱️ 2 minuti',
    metaResults: '📜 16 vite passate',
    start: 'Scopri la mia vita precedente →',
    backAria: 'Domanda precedente',
    loading: 'Spolveriamo i ricordi della tua vita precedente…',
  },
  // Shown only inside the shared end screen (result pages) as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'Come funziona il test della vita precedente?', a: 'Ognuna delle tue 12 risposte assegna punti a diverse vite precedenti, e quella con più punti è la tua. Tutte le versioni del test, in ogni lingua, usano esattamente lo stesso calcolo.' },
    { q: 'È attendibile?', a: 'È un gioco, non una predizione: uno specchio scherzoso delle tue abitudini quotidiane. Detto questo, in tanti si ritrovano nel risultato in modo sorprendente.' },
    { q: 'Posso ottenere un risultato diverso?', a: 'Sì. Il tuo risultato dipende solo dalle tue risposte, quindi rispondendo in modo diverso puoi scoprire un\'altra vita precedente.' },
    { q: 'Le mie risposte vengono salvate?', a: 'No. Le tue risposte vengono calcolate direttamente nel tuo browser e non vengono mai inviate né conservate. Non serve nessuna registrazione.' },
  ],
  privacyLink: 'Informativa sulla privacy',
  result: {
    title: 'Test vita precedente: {name}',
    shareText: 'La mia vita precedente: {name} {emoji} — "{tagline}". E tu, chi eri?',
    ctaStrong: 'Un amico ti ha mandato il suo risultato della vita precedente',
    ctaSub: 'Curioso di sapere chi eri? Bastano 2 minuti.',
    eyebrow: 'In una vita precedente eri',
    adviceLabel: 'Consiglio per questa vita —',
    good: 'Anima gemella',
    bad: 'Nemesi di allora',
    retry: 'Rifai il test',
  },
  og: {
    eyebrow: 'In una vita precedente eri',
    brand: '🔮 Test vita precedente',
    defaultTitle: 'Test vita precedente',
    defaultDesc: '12 domande, 2 minuti. Chi eri in una vita precedente?',
  },
  privacy: {
    description: 'Informativa sulla privacy del Test vita precedente: come usiamo cookie, pubblicità e statistiche.',
    h1: 'Informativa sulla privacy',
    introHtml: 'Test vita precedente (il "Servizio") rispetta la tua privacy e tratta solo le informazioni minime necessarie, come descritto di seguito.',
    sections: [
      ['1. Informazioni raccolte', 'Puoi usare il Servizio senza registrarti né accedere. Le tue risposte al test vengono elaborate solo all\'interno del tuo browser e non vengono mai salvate sui nostri server. Alcune informazioni possono essere raccolte automaticamente durante l\'uso del Servizio, come descritto di seguito.'],
      ['2. Cookie e tecnologie simili', 'Il Servizio può usare cookie per mostrare pubblicità e capire come viene utilizzato. Puoi rifiutare o eliminare i cookie dalle impostazioni del tuo browser; alcune funzionalità potrebbero non funzionare correttamente se lo fai.'],
      ['3. Pubblicità (Google AdSense)', 'Il Servizio mostra annunci tramite Google AdSense. Google e i suoi partner possono usare cookie per mostrarti annunci in base alle tue visite precedenti a questo e ad altri siti web. Puoi saperne di più e modificare le tue preferenze di personalizzazione degli annunci nelle <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Impostazioni annunci Google</a>.'],
      ['4. Statistiche (Google Analytics)', 'Il Servizio può usare Google Analytics (GA4) per capire il numero di visitatori e le fonti di traffico, così da migliorarsi. Questi dati vengono usati solo a fini statistici e non ti identificano personalmente.'],
      ['5. Contatti', 'Per qualsiasi domanda su questa Informativa sulla privacy, contatta il gestore del sito.'],
      ['6. Data di entrata in vigore', 'Questa informativa è in vigore dal 1° gennaio 2026.'],
    ],
    back: '← Torna al Test vita precedente',
  },

  types: {
    sura: {
      name: 'Capocuoco della cucina reale coreana',
      tagline: 'Con un pizzico di sale decidevi l\'umore del re',
      story: 'Nella cucina reale della dinastia coreana Joseon — sì, quella del K-drama «Il gioiello nel palazzo» — l\'umore del re per la giornata si decideva sulla punta delle tue dita. Più che "troppo salato o troppo insipido?", contava "per chi è davvero questo pasto?", e tu lo capivi sempre prima di tutti. Dirigevi decine di aiutanti di cucina con precisione millimetrica, senza però condividere mai una sola ricetta. Perfezionista fino al midollo: servire ogni giorno la tavola reale migliore era tutto il tuo orgoglio.',
      traits: ['Sapore e atmosfera devono essere entrambi perfetti', 'Lasci parlare i risultati, non i pettegolezzi', 'Per i tuoi, apri la dispensa senza riserve'],
      advice: 'Esagerare col sale ogni tanto va bene: ti perdoneranno tutti.',
    },
    celadon: {
      name: 'Maestro ceramista del celadon di Goryeo',
      tagline: 'Mille vasi cotti nel forno, quasi tutti distrutti per principio',
      story: 'Passavi notti insonni accanto al forno, ossessionato dall\'idea di ricreare il leggendario smalto verde giada del celadon della dinastia coreana Goryeo — un colore così prezioso che perfino gli inviati cinesi ne scrivevano in patria. Se la tonalità era anche solo leggermente sbagliata, afferravi il martello senza esitare, mentre i tuoi apprendisti camminavano in punta di piedi attorno a standard che non capivano fino in fondo. Per te un vaso di celadon non era un semplice oggetto: era un pezzo di cielo. I tuoi fallimenti superavano di gran lunga i tuoi lavori finiti, ma ciò che il mondo ricorda sono i capolavori.',
      traits: ['Standard: alti. Troppo alti.', 'Lento, ma finisce sempre tutto a regola d\'arte', 'Testardo in silenzio, ma senza limiti'],
      advice: 'Fermarsi al novantanovesimo tentativo può essere bellissimo lo stesso.',
    },
    hwarang: {
      name: 'Cavaliere hwarang di Silla',
      tagline: 'Bellezza e talento da Olimpiadi, già nel VI secolo',
      story: 'Primo della classe nella scherma e negli studi — e per giunta popolarissimo. Eri l\'asso degli hwarang, l\'élite dei "cavalieri fiore" dell\'antico regno coreano di Silla. Anche mentre giravi tra monti e fiumi per allenare corpo e mente, da qualche parte c\'era sempre un gruppo di ammiratori segreti a farti il tifo. L\'onore contava più della vita stessa, e vincere in modo sleale ti faceva vergognare più che perdere. Sul campo di battaglia o al mercato, il tuo nome era sempre sulla bocca di tutti.',
      traits: ['Finisci sempre al centro dell\'attenzione', 'Onore e principi sono sacri per te', 'Ti si accende lo sguardo appena c\'è competizione'],
      advice: 'Divertirsi insieme vale quanto vincere.',
    },
    viking: {
      name: 'Navigatore vichingo',
      tagline: 'Se non era sulla mappa, avevi ancora più voglia di andarci',
      story: 'Alla guida della tua drakkar nella nebbia del Mare del Nord, "pericoloso" voleva solo dire "sembra divertente". Per il brivido di avvistare una costa che nessuna mappa aveva mai mostrato, una tempesta o due erano un prezzo giusto. Metter su casa? Mai: la prossima traversata ti incuriosiva sempre di più. Il tuo equipaggio si innervosiva, ma ti seguiva comunque. Dopotutto, tornavi sempre vivo.',
      traits: ['Ti si illuminano gli occhi davanti a qualsiasi novità', 'Stranamente calmo nelle crisi', 'Restare troppo a lungo nello stesso posto ti rende irrequieto'],
      advice: 'Ogni tanto va bene gettare l\'ancora e goderti davvero dove sei.',
    },
    pharaoh_cat: {
      name: 'Il gatto del faraone',
      tagline: 'Venerato come un dio, passavi la giornata a fare pisolini',
      story: 'Nei palazzi dell\'antico Egitto eri un gatto venerato come una divinità. Facevi qualcosa in particolare? No. Ti sedevi semplicemente nel miglior angolo di sole e guardavi gli umani adorarti di loro spontanea volontà. Ma bastava un\'espressione anche solo leggermente infastidita perché tutto il palazzo entrasse nel panico — anche se nessuno ama parlarne. Sembrava che tu non facessi assolutamente nulla, eppure la tua sola presenza teneva tutto sotto controllo.',
      traits: ['Osservi con eleganza, ti muovi il minimo indispensabile', 'Con un solo sguardo cambi l\'atmosfera di una stanza', 'Un genio nell\'evitare le faccende'],
      advice: 'Anche gli dei guadagnano rispetto se si fanno vedere di persona ogni tanto.',
    },
    renaissance: {
      name: 'Apprendista di un pittore rinascimentale',
      tagline: 'Colto in flagrante mentre mescolavi i colori: eri troppo bravo',
      story: 'In una bottega fiorentina macinavi pigmenti e lavavi pennelli all\'ombra di un grande maestro. Poi un giorno, mentre lui era fuori, hai riempito un angolo dello sfondo — ed è risultata la parte più naturale di tutto il dipinto. Costruivi la tua abilità in silenzio, senza che nessuno se ne accorgesse, ma senza sosta. E sulla punta del tuo pennello si nascondeva un sogno: un giorno, un quadro firmato col tuo nome.',
      traits: ['Un occhio fuori dal comune per i dettagli', 'Eccellente in silenzio, senza bisogno di clamore', 'Un gusto così esigente da non accontentarsi del "va bene così"'],
      advice: 'Sei pronto. È ora di iniziare a firmare con il tuo nome.',
    },
    jeongi: {
      name: 'Cantastorie stella della vecchia Seoul',
      tagline: 'Padroneggiavi il "continua…" 200 anni prima di Netflix',
      story: 'Nei mercati della vecchia Seoul, la gente lasciava perdere tutto appena arrivavi. Eri un jeongisu, un cantastorie professionista che leggeva ad alta voce i romanzi popolari davanti alla folla. La tua mossa segreta: fermarti di colpo nel momento più avvincente e aspettare che piovessero le monete prima di continuare. A dire il vero, metà della storia la improvvisavi sul momento, ma era così convincente che nessuno se ne accorgeva mai. Nelle tue mani, persino i pettegolezzi del vicinato diventavano un\'epopea.',
      traits: ['Un dono per abbellire qualsiasi storia', 'Un senso del tempo e dell\'atmosfera impeccabile', 'Sai esattamente come attirare una folla'],
      advice: 'Ogni tanto puoi anche dire subito come va a finire.',
    },
    silkroad: {
      name: 'Mercante di carovane sulla Via della Seta',
      tagline: 'Ogni confine attraversato significava più amici',
      story: 'Attraversavi deserti e passi innevati con seta e spezie, e le lingue straniere non sono mai state un problema per te: qualche gesto e un sorriso, e l\'affare era fatto. In ogni oasi ti aspettava un amico pronto ad accoglierti, e quella rete era il tuo bene più prezioso. Lasciavi dietro di te legami, non solo merci: un giramondo nato e la vera anima sociale della carovana.',
      traits: ['Fai amicizia ovunque, e in fretta', 'Chiudi un buon affare senza mai perdere il calore umano', 'Ti adatti a nuove culture in un attimo'],
      advice: 'Ogni tanto va bene accettare un regalo senza contrattare.',
    },
    monk_scribe: {
      name: 'Amanuense di un monastero medievale',
      tagline: 'Copiavi a lume di candela senza un solo errore',
      story: 'In un monastero medievale europeo, il tuo lavoro era copiare le Scritture su pergamena tutto il giorno. Concentrazione totale, mai uno sguardo di lato — eppure di nascosto scarabocchiavi nei margini piccoli disegni assurdi. Dove altri vedevano solo una ripetizione infinita, tu trovavi il tuo ritmo e la tua calma. (Storia vera: i manoscritti medievali reali sono pieni di scarabocchi nei margini, tipo cavalieri che combattono lumache giganti.)',
      traits: ['Quando ti concentri, il mondo scompare', 'Silenzioso fuori, esilarante dentro', 'Non riesci a lasciar correre nemmeno il più piccolo errore'],
      advice: 'Chiudi il libro e prendi una boccata d\'aria: il mondo non crollerà.',
    },
    pirate_cook: {
      name: 'Cuoco su una nave pirata',
      tagline: 'Mai sguainata una spada, ma comandavi tu sulla nave',
      story: 'Non hai mai combattuto una sola volta, eppure su quella nave la tua parola era legge — se l\'equipaggio non gradiva il menu della sera, anche i pirati più duri stavano composti davanti a te. Eri l\'unica anima gentile tra marinai induriti, e nei giorni no finivano tutti in cambusa in cerca di un po\' di conforto. Ruvido fuori, ma nessuno sapeva prendersi cura della gente come te: il vero potere dietro il capitano.',
      traits: ['Mostri affetto con i fatti — soprattutto sfamando la gente', 'Ti trovi a tuo agio anche negli ambienti più rudi', 'Sorprendentemente dolce e premuroso'],
      advice: 'Smetti di occuparti solo degli altri: lascia che qualcuno si prenda cura di te.',
    },
    amhaeng: {
      name: 'Ispettore reale in incognito di Joseon',
      tagline: 'Nascondevi la placca del re sotto stracci da mendicante',
      story: 'Giravi per i mercati vestito di stracci, ma nella manica tenevi il mapae, il medaglione reale con i cavalli che provava che eri l\'ispettore segreto del re, incaricato di stanare i funzionari corrotti. Bastavano tre frasi di un magistrato disonesto perché tu fiutassi la bugia; nel momento decisivo rivelavi chi eri davvero e ribaltavi tutta la situazione — un po\' Zorro, un po\' Colombo. Vedere la verità mentre tutti gli altri si lasciavano ingannare dalle apparenze: era questo il brivido. Armato solo del tuo senso di giustizia, giravi il regno di Joseon come giustiziere segreto.',
      traits: ['Individui le bugie con precisione sorprendente', 'Guardi oltre le apparenze, fino a ciò che è vero', 'Quando sai di avere ragione, vai fino in fondo'],
      advice: 'Non tutti nascondono qualcosa. A volte, fidati e basta.',
    },
    gladiator: {
      name: 'Gladiatore romano',
      tagline: 'Superstar del Colosseo, in segreto un fifone totale',
      story: 'Nel momento in cui entravi nel Colosseo, la folla scandiva il tuo nome. Dietro quel volto carismatico c\'era qualcuno a cui tremavano le ginocchia ogni singola volta — ma nessuno se n\'è mai accorto. "Vinco questa e poi mi ritiro, apro una taverna," ti dicevi… e poi riprendevi la spada. Terrorizzato ma sempre pronto a entrare nell\'arena: una star dal fascino davvero sorprendente.',
      traits: ['Nascondi il nervosismo come un professionista', 'Sul palco la tua presenza esplode', 'Coltivi in segreto piccoli sogni umili'],
      advice: 'Ammettere di avere paura non ti farà perdere il rispetto di nessuno.',
    },
    teahouse: {
      name: 'Proprietario di una casa da tè della dinastia Qing',
      tagline: 'Bastava uno sguardo per intuire i pensieri di chiunque',
      story: 'In un vicolo della Cina dei Qing, la tua casa da tè non era mai vuota. Più famosa del tè era la tua intuizione: appena un cliente si sedeva, avevi già un\'idea abbastanza chiara di come fosse andata la sua giornata. Voci, confidenze, consigli di vita: cominciava tutto in quella piccola casa da tè. Non forzavi mai nessuno; versavi semplicemente una tazza, e in qualche modo la gente si sentiva già meglio.',
      traits: ['Leggi l\'atmosfera in pochi secondi', 'Calmo e mai frettoloso, qualunque cosa succeda', 'La gente si apre con te in modo naturale'],
      advice: 'Per una volta, lascia perdere i problemi degli altri e parla dei tuoi.',
    },
    ninja_mailman: {
      name: 'Ninja dell\'era Edo (in realtà un postino)',
      tagline: 'Ti muovevi come un\'ombra, mai persa una sola lettera',
      story: 'Eri un vero ninja, addestrato in modo rigorosissimo — ma la tua missione reale era consegnare lettere di nascosto. Tutto quel talento nel saltare tra i tetti e scalare i muri serviva a una sola cosa: consegnare con precisione, e mai in ritardo. Tutti immaginavano missioni mozzafiato, ma tu vivevi ogni giorno con l\'orgoglio umile della consegna puntuale. Alla fine, la persona più affidabile in circolazione eri tu.',
      traits: ['Porta sempre a termine il lavoro, con precisione e alla perfezione', 'Guadagna rispetto con la costanza, non con lo sfarzo', 'Ha un senso dell\'umorismo furtivo e inaspettato'],
      advice: 'Smetti di nascondere quelle capacità. Vai pure e mettiti un po\' in mostra.',
    },
    atlantis: {
      name: 'Guardiano del faro di Atlantide',
      tagline: 'Tenevi la luce accesa mentre la città affondava',
      story: 'Nella leggendaria città di Atlantide, la notte in cui le onde continuavano a salire, hai tenuto acceso il faro. Nel terrore di una città che affondava, sei stato l\'unica persona a restare saldo e a tenere il tuo posto. Grazie a te, le ultime navi sono uscite dal porto sane e salve. Niente di appariscente — ma il tipo di presenza di cui qualcuno, da qualche parte, ha assolutamente bisogno.',
      traits: ['Più grande è la crisi, più sei calmo', 'Hai la forza silenziosa di chi tiene duro', 'Pensi molto più a fondo di quanto lasci trapelare'],
      advice: 'Va bene appoggiarti alla luce di qualcun altro, ogni tanto.',
    },
    balhae: {
      name: 'Arciere a cavallo di Balhae',
      tagline: 'Non sbagliavi mai un colpo — nemmeno al galoppo',
      story: 'Cavalcando tra i venti gelidi del nord — la frontiera di Balhae, un antico regno della Manciuria — il tuo arco non vacillava mai. Ti sei allenato innumerevoli volte per quell\'unico istante: colpire il bersaglio dritto al centro da un cavallo lanciato a tutta velocità. Leale al tuo reparto sopra ogni cosa, cavalcavi sempre in prima linea, e i tuoi compagni ti seguivano senza esitare. Velocità e precisione insieme: una combinazione rara.',
      traits: ['Resti preciso anche quando tutto si muove in fretta', 'Fedelissimo alla tua squadra', 'Quando c\'è un obiettivo, vai dritto verso di esso'],
      advice: 'Ogni tanto va bene semplicemente cavalcare, senza nessun bersaglio in vista.',
    },
  },

  questions: [
    {
      q: 'A una serata con gli amici, di solito…',
      choices: [
        'Decidi tu per primo cosa si mangia. Il menu fa l\'atmosfera.',
        'Ti siedi in un angolo e osservi in silenzio quello che succede.',
        'Diventi naturalmente l\'anima della festa.',
        'Tieni d\'occhio posti nuovi e facce nuove.',
      ],
    },
    {
      q: 'Quando succede qualcosa di inaspettato che va storto, tu…',
      choices: [
        'Sbadigli per prima cosa. Prima o poi qualcuno ci penserà.',
        'Scavi in silenzio da solo finché non trovi la causa.',
        'Lo trasformi in una storia esilarante da raccontare dopo.',
      ],
    },
    {
      q: 'Quando organizzi un viaggio, tu…',
      choices: [
        'Spunti quanti più paesi possibile.',
        'Ti dai come obiettivo di fare amicizia con la gente del posto.',
        'Pianifichi tutto il percorso in base al cibo.',
      ],
    },
    {
      q: 'Un amico ti racconta di aver subito un\'ingiustizia. Tu…',
      choices: [
        'Dici: "Ok, prima raccogliamo le prove."',
        'Ti muovi subito e vai a controllare di persona.',
        'Lo fai sedere, prepari un tè e ascolti.',
        'Aiuti in silenzio, dietro le quinte.',
      ],
    },
    {
      q: 'La scadenza incombe e non hai la minima idea. Tu…',
      choices: [
        'Spegni la luce e ti perdi nel vuoto — poi arriva l\'idea all\'improvviso.',
        'Sforni un mucchio di bozze veloci e scegli la migliore.',
        'Raccogli prima tutto il materiale e i riferimenti alla perfezione.',
      ],
    },
    {
      q: 'Quando fai shopping, tu…',
      choices: [
        'Continui a tornare finché non trovi quello giusto.',
        'Lo compri subito. I rimpianti, dopo.',
      ],
    },
    {
      q: 'Il tuo ruolo in un lavoro di gruppo?',
      choices: [
        'Dai la direzione e spingi tutti in avanti.',
        'Finisci la tua parte alla perfezione, senza fare rumore.',
        'Ti occupi dei dettagli e del tocco finale.',
      ],
    },
    {
      q: 'Se pubblicassi qualcosa sui social, sarebbe…',
      choices: [
        'Una mia foto davvero riuscita.',
        'Storie sulle persone affascinanti incontrate in viaggio.',
        'Una frase del libro che ho letto oggi.',
        'Una foto del piatto che ho appena cucinato.',
      ],
    },
    {
      q: 'Qualcuno viene da te per un consiglio. Tu…',
      choices: [
        'Inizi mettendo in ordine i fatti.',
        'Ti indigni insieme a lui.',
        'Ascolti in silenzio e lo conforti.',
      ],
    },
    {
      q: 'Quando impari qualcosa di nuovo, il tuo stile è…',
      choices: [
        'Seguire il manuale passo dopo passo, senza errori.',
        'Osservare in silenzio e capire prima da solo.',
        'Buttarti subito e imparare sul campo.',
      ],
    },
    {
      q: 'Stai per fare tardi a un appuntamento. Tu…',
      choices: [
        'Ormai sei in ritardo, quindi arrivi con calma e ti sistemi per primo.',
        'Calcoli il percorso esatto per arrivare al momento perfetto.',
        'Arrivi in ritardo, ma con un ingresso memorabile.',
        'Ne approfitti per provare un percorso del tutto nuovo.',
      ],
    },
    {
      q: 'Riassumi la tua giornata in una frase:',
      choices: [
        'Ho schivato ogni incombenza noiosa. Giornata perfetta.',
        'Ho trovato un po\' di bellezza in qualcosa di piccolo.',
        'Non crederai a cosa mi è successo oggi.',
      ],
    },
  ],
};
