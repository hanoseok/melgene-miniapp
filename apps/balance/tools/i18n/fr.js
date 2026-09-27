/* Tu préfères ? — Français (/fr/)
 * Recherches visées : « tu préfères », « jeu tu préfères », « questions tu préfères », « tu préfères drôle / couple »
 * Les clés ui.questions (qid) et l’ordre a/b sont identiques dans les 9 langues : les votes sont additionnés entre langues,
 * donc chaque option doit avoir EXACTEMENT le même sens partout (formulation locale, choix inchangé).
 * Options à l’infinitif pour se lire après « Tu préfères… ». Tutoiement, ton de soirée entre amis.
 * Pas de spoiler (.claude/skills/melgene-miniapp) : descriptions de packs, accroche, méta, OG et FAQ ne citent aucune question ni aucun profil.
 * Typographie : fr() ci-dessous remplace l’espace devant ? ! : ; » (et après «) par une espace fine insécable (U+202F).
 */
const NNBSP = ' ';
function fr(v) {
  if (typeof v === 'string') {
    return v.replace(/ ([?!:;»])/g, NNBSP + '$1').replace(/« /g, '«' + NNBSP)
      .replace(/([\d}]) (%|h )/g, '$1' + NNBSP + '$2'); // 20 %, {rate} %, 10 h
  }
  if (Array.isArray(v)) return v.map(fr);
  if (v && typeof v === 'object') { const o = {}; Object.keys(v).forEach((k) => { o[k] = k === 'fonts' ? v[k] : fr(v[k]); }); return o; }
  return v;
}

module.exports = fr({
  siteName: 'Tu préfères ?',
  meta: {
    title: 'Tu préfères ? Le jeu aux vrais pourcentages', // + ' | ' + marque (G.brandOf)
    description: 'Jeu « Tu préfères » gratuit : choisis entre deux options et découvre aussitôt quel pourcentage de joueurs a fait le même choix. 5 thèmes, sans inscription, une minute.',
    ogTitle: 'Tu préfères ? Choisis ton camp, découvre les pourcentages',
    ogDescription: 'Les vrais pourcentages dès que tu choisis. Plutôt comme tout le monde, ou à contre-courant ?',
  },
  // Polices et coupures de ligne propres à chaque langue ; gen-i18n.js les injecte en variables :root dans <head>.
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
    display: "'Dela Gothic One'",
    displayWeight: 400,
    option: "'Pretendard'",
    optionWeight: 800,
    optionScale: 0.96,
    heroScale: 0.92,
    dense: false,
    tall: false,
    wordBreak: 'normal',
    hyphens: 'auto',
  },
  app: {
    name: 'Tu préfères ?',
  },
  home: {
    h1a: 'Tu préfères ?',
    h1b: 'Choisis ton camp.',
    hook: 'Deux options, un seul choix — et le vrai pourcentage s’affiche dès que tu tapes. Au bout de 12 questions, tu sauras si tu suis la foule ou si tu vas à contre-courant.',
    packsTitle: 'Choisis un pack',
    count: '{n} questions',
  },
  play: {
    backAria: 'Question précédente',
    homeAria: 'Retour aux packs',
    skip: 'Passer',
    progressAria: 'Progression',
  },
  // Écran de fin uniquement (window.MG_FAQ → accordéon du composant commun data-mg-end). Court, sans spoiler.
  faq: [
    { q: 'Les pourcentages viennent-ils de vraies personnes ?', a: 'Oui. Ce sont les totaux des vrais choix faits dans ce jeu, toutes langues confondues. Si les résultats ne se chargent pas, tu ne vois que ton choix : jamais de chiffres inventés.' },
    { q: 'Quelqu’un peut-il voir ce que j’ai choisi ?', a: 'Non. Le serveur ne garde qu’un total par option, sans nom, compte ni donnée personnelle. Aucune inscription n’est nécessaire.' },
    { q: 'Puis-je voter deux fois à la même question ?', a: 'Chaque navigateur compte une seule fois par question. Si tu rejoues, tu vois le pourcentage actuel, mais ton vote n’est pas ajouté une deuxième fois.' },
    { q: 'C’est quoi, l’accord avec la majorité ?', a: 'Parmi les questions qui ont des résultats, c’est la part où tu as choisi comme la plupart des gens (les égalités parfaites ne comptent pas). Ton profil en découle, ou de ta vitesse de décision s’il n’y a pas encore assez de données.' },
    { q: 'Comment jouer avec des amis ?', a: 'Partage ton résultat depuis cet écran : tes amis reçoivent les mêmes 12 questions et, à la fin, voient combien de choix vous avez en commun.' },
  ],
  privacyLink: 'Politique de confidentialité',

  ui: {
    prompt: 'Tu préfères…',
    packs: {
      random: { name: 'Mix de 12', blurb: '12 questions piochées dans tous les packs' },
      daily: { name: 'Quotidien', blurb: 'Les petits dilemmes de tous les jours' },
      love: { name: 'Amour', blurb: 'Les sujets qui divisent les couples — à jouer à deux' },
      work: { name: 'Boulot & école', blurb: 'Galères de bureau et de salle de classe' },
      food: { name: 'À table', blurb: 'Les débats culinaires qui brisent des amitiés' },
      extreme: { name: 'Extrême', blurb: 'Ici, choisir est déjà une punition' },
    },
    questions: {
      'daily-01': { a: 'Vivre un été sans fin', b: 'Vivre un hiver sans fin' },
      'daily-02': { a: 'Avoir toujours 20 % de batterie', b: 'Avoir toujours une seule barre de wifi' },
      'daily-03': { a: 'Ne prendre que des douches froides, à vie', b: 'Ne boire que des boissons tièdes, à vie' },
      'daily-04': { a: 'Ne plus jamais écouter de musique', b: 'N’écouter qu’une seule chanson pour toujours' },
      'daily-05': { a: 'Avoir tes pensées sous-titrées au-dessus de ta tête', b: 'Voir tout ton historique de recherche rendu public' },
      'daily-06': { a: 'Tomber sur tous les feux verts', b: 'Ne plus jamais faire la queue' },
      'daily-07': { a: 'Passer une journée dans le passé', b: 'Passer une journée dans le futur' },
      'daily-08': { a: 'Avoir l’air d’avoir 20 ans avec l’énergie de 60', b: 'Avoir l’air d’avoir 60 ans avec l’énergie de 20' },
      'daily-09': { a: 'Vivre dans un manoir à une heure du métro', b: 'Vivre dans un studio minuscule à une minute du métro' },
      'daily-10': { a: 'Entendre ce que tout le monde pense', b: 'Ne jamais te faire prendre à mentir' },
      'daily-11': { a: 'Passer un mois sans téléphone', b: 'Passer un mois sans tes amis' },
      'daily-12': { a: 'Ne porter que des tongs, à vie', b: 'Ne porter que des chaussures de ville, à vie' },

      'love-01': { a: 'Sortir avec quelqu’un qui t’écrit toute la journée', b: 'Sortir avec quelqu’un qui écrit peu mais qui est génial en vrai' },
      'love-02': { q: 'Ta moitié va au ciné en tête-à-tête avec un ami du sexe opposé ?', a: 'Aucun problème', b: 'Là, ça dépasse les bornes' },
      'love-03': { a: 'Sortir avec quelqu’un qui t’aime plus', b: 'Sortir avec quelqu’un que tu aimes plus' },
      'love-04': { a: 'Voir ton ex embauché dans ta boîte', b: 'Voir ton ex sortir avec ton meilleur ami' },
      'love-05': { a: 'Toujours partager l’addition au premier rendez-vous', b: 'Qu’une seule personne paie tout au premier rendez-vous' },
      'love-06': { a: 'Partager vos codes de téléphone', b: 'Ne jamais regarder le téléphone de l’autre' },
      'love-07': { a: 'Fêter absolument chaque anniversaire de couple', b: 'Ne fêter aucun anniversaire de couple' },
      'love-08': { a: 'Se réconcilier juste après une dispute', b: 'Dormir dessus et se réconcilier le lendemain' },
      'love-09': { a: 'Sortir avec quelqu’un de canon mais sans conversation', b: 'Sortir avec quelqu’un de banal avec qui tu parles des heures' },
      'love-10': { a: 'Voir ta moitié tous les jours', b: 'Voir ta moitié une fois par semaine' },
      'love-11': { a: 'Que ta moitié soit trop proche de tes amis', b: 'Que ta moitié ne s’entende pas du tout avec tes amis' },
      'love-12': { a: 'Toujours faire ta déclaration en premier', b: 'Toujours attendre que l’autre se déclare' },

      'work-01': { a: 'Bosser 4 jours par semaine, 10 h par jour', b: 'Bosser 5 jours par semaine, 8 h par jour' },
      'work-02': { a: 'Gagner le double avec le pire chef du monde', b: 'Gagner pareil avec un chef en or' },
      'work-03': { a: 'Télétravailler pour toujours', b: 'Aller au bureau tous les jours, pour toujours' },
      'work-04': { a: 'Aller à un dîner d’équipe chaque semaine', b: 'Faire des heures sup un soir par semaine' },
      'work-05': { a: 'Avoir un trou noir à chaque présentation', b: 'Ne plus pouvoir t’arrêter de parler à chaque présentation' },
      'work-06': { a: 'Être dans un groupe WhatsApp à 999+ non lus', b: 'Être dans un groupe où personne ne répond jamais' },
      'work-07': { a: 'Faire tout le projet de groupe seul', b: 'Le faire avec un tire-au-flanc qui aura la même note' },
      'work-08': { a: 'Faire disparaître le lundi', b: 'Avoir deux vendredis par semaine' },
      'work-09': { a: 'Être assis juste à côté du PDG', b: 'Être assis juste à côté des toilettes' },
      'work-10': { a: 'Réviser toute la nuit la veille de l’exam', b: 'Réviser un peu chaque jour pendant un mois' },
      'work-11': { a: 'Faire un métier que tu adores mais mal payé', b: 'Faire un métier que tu détestes mais très bien payé' },
      'work-12': { a: 'Avoir deux heures de pause déjeuner', b: 'Finir le travail une heure plus tôt' },

      'food-01': { a: 'Renoncer aux ramens pour toujours', b: 'Renoncer au poulet frit pour toujours' },
      'food-02': { q: 'La sauce sur la friture ?', a: 'On la verse dessus', b: 'On trempe à côté' },
      'food-03': { q: 'Le chocolat à la menthe ?', a: 'Un pur délice', b: 'Ça a un goût de dentifrice' },
      'food-04': { q: 'De l’ananas sur la pizza ?', a: 'Oui, c’est délicieux', b: 'Jamais de la vie' },
      'food-05': { a: 'Ne manger que très épicé, à vie', b: 'Ne manger que très fade, à vie' },
      'food-06': { a: 'Manger ton plat préféré tous les jours, pour toujours', b: 'Tomber sur un plat au hasard chaque jour, bon ou raté' },
      'food-07': { a: 'Avoir une heure de buffet à volonté', b: 'Avoir un menu dégustation de luxe, une seule fois' },
      'food-08': { a: 'Ne boire que des boissons glacées toute l’année', b: 'Ne boire que des boissons chaudes toute l’année' },
      'food-09': { a: 'Interdire le téléphone à chaque repas', b: 'Interdire de parler à chaque repas' },
      'food-10': { a: 'Ne manger que des pilons de poulet, à vie', b: 'Ne manger que des ailes de poulet, à vie' },
      'food-11': { a: 'Ne plus jamais manger de dessert', b: 'Ne plus jamais grignoter la nuit' },
      'food-12': { a: 'Ajouter du fromage en plus partout', b: 'Ajouter de la coriandre en plus partout' },

      'extreme-01': { a: 'Chanter tout ce que tu dis', b: 'Danser à chaque pas' },
      'extreme-02': { a: 'Toucher un million d’euros mais vieillir de 10 ans d’un coup', b: 'Rester exactement comme tu es' },
      'extreme-03': { a: 'Vivre une semaine dans la peau d’un moustique', b: 'Vivre une semaine dans la peau d’un cafard' },
      'extreme-04': { a: 'Vivre sans internet pour toujours', b: 'Vivre sans chauffage ni clim pour toujours' },
      'extreme-05': { a: 'Passer un an seul sur une île déserte', b: 'Passer un an en coloc avec la personne que tu aimes le moins' },
      'extreme-06': { a: 'Être le meilleur survivant d’une apocalypse zombie', b: 'Être quelqu’un d’ordinaire dans un monde en paix' },
      'extreme-07': { a: 'Ne marcher qu’à reculons, à vie', b: 'Ne marcher qu’en crabe, à vie' },
      'extreme-08': { a: 'Perdre tous tes souvenirs et devenir riche', b: 'Garder tes souvenirs et être fauché' },
      'extreme-09': { a: 'Voir l’avenir sans pouvoir le changer', b: 'Voyager dans le passé, mais une seule fois' },
      'extreme-10': { a: 'Voir combien de temps il reste à vivre à chacun', b: 'Voir le salaire de tout le monde' },
      'extreme-11': { a: 'Ne plus jamais avoir besoin de dormir', b: 'Ne jamais grossir, quoi que tu manges' },
      'extreme-12': { a: 'Avoir une porte qui mène n’importe où', b: 'Arrêter le temps 10 minutes par jour' },
    },
    types: {
      poll: { name: 'Le sondage ambulant', desc: 'Tu es presque toujours du côté de la majorité. Pas besoin de sondage : il suffit de te demander.' },
      mainstream: { name: 'Pile dans la tendance', desc: 'Tu tombes souvent du côté populaire : des choix raisonnables auxquels tout le monde s’identifie.' },
      indie: { name: 'Esprit libre', desc: 'Parfois avec la foule, parfois franchement contre. Tu choisis selon tes propres règles.' },
      contrarian: { name: 'Esprit de contradiction', desc: 'Si tout le monde dit A, tu dis B. Aller à contre-courant, ça te va bien.' },
      instinct: { name: 'À l’instinct', desc: 'Ton doigt décide avant ton cerveau. Première impression, réponse définitive.' },
      steady: { name: 'Juste milieu', desc: 'Ni trop vite ni trop lent : juste ce qu’il faut de réflexion, puis un choix net.' },
      ponder: { name: 'Pro de la réflexion', desc: 'Tu pèses le pour et le contre jusqu’au bout. Chaque choix a sa raison.' },
      skipper: { name: 'Champion de l’esquive', desc: 'Tu as tout passé. Ne pas choisir, c’est aussi un choix.' },
    },
    sideA: 'A',
    sideB: 'B',
    vsBadge: 'VS',
    pct: '{n}' + NNBSP + '%',
    you: 'Toi',
    friend: 'Ton pote',
    // Pluriel (Intl.PluralRules fr : one = 0 et 1, many = 1 000 000…, other)
    people: { one: '{n} vote', many: '{n} de votes', other: '{n} votes' },
    firstVote: 'Tu es le premier à répondre à celle-ci !',
    noData: 'Impossible de charger les résultats pour l’instant : seul ton choix est affiché.',
    already: 'Tu as déjà voté pour celle-ci, ton choix n’est pas recompté — voici la répartition actuelle.',
    next: 'Question suivante',
    finish: 'Voir mon résultat',
    progress: '{i} / {n}',
    pickAria: '{side} : {text}',
    resultAria: '{side} {pct}, {people}',
    packResult: 'Résultat : {pack}',
    rateLabel: 'Accord avec la majorité',
    speedLabel: 'Temps de réflexion moyen',
    seconds: '{s} s',
    matchLine: 'Tu as choisi comme la majorité pour {k} des {m} questions qui ont des résultats.',
    speedNote: 'Les résultats n’ont pas pu être chargés : ton profil se base sur ta vitesse de décision.',
    fewNote: 'Peu de questions ont déjà des résultats : ton profil se base sur ta vitesse de décision.',
    friendLine: 'Mêmes choix que ton pote',
    friendCount: '{k} / {m}',
    friendBanner: 'Un ami te lance un défi — {n} questions. Termine-les pour voir combien de choix vous avez en commun.',
    retry: 'Essayer un autre pack',
    shareTitle: 'Tu préfères ?',
    shareRate: 'Tu préfères ? ({pack}) : je suis d’accord avec la majorité à {rate} % — je suis « {type} ». Combien de mes choix vas-tu partager ?',
    sharePlain: 'Tu préfères ? ({pack}) : terminé ! Je suis « {type} ». Combien de mes choix vas-tu partager ?',
  },

  // Carte OG : jamais de vraie question — seulement les deux camps et « ?% »
  og: {
    title: 'Tu préfères ?',
    tag: 'Choisis. Découvre aussitôt les vrais pourcentages.',
    a: 'Plutôt ça ?',
    b: 'Ou ça ?',
    unknown: '?%',
  },

  privacy: {
    title: 'Politique de confidentialité | Tu préfères ?',
    description: 'Politique de confidentialité de Tu préfères ? : totaux de votes anonymes, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Tu préfères ? (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans inscription ni connexion et ne demande ni nom, ni e-mail, ni coordonnées. Les informations suivantes peuvent être traitées pendant l’utilisation.'],
      ['2. Totaux de votes anonymes', 'Quand tu touches une option, seuls l’identifiant de la question et le numéro de l’option (A ou B) sont envoyés à notre serveur (Supabase) et ajoutés à un total. Nous n’enregistrons pas qui a choisi quoi, et les totaux sont affichés publiquement sous forme de pourcentages. Pour éviter de compter deux fois ton vote, la liste des questions auxquelles tu as répondu est conservée uniquement sur ton appareil (stockage local).'],
      ['3. Cookies et technologies similaires', 'Le Service peut utiliser des cookies pour la publicité et pour comprendre son utilisation. Tu peux refuser ou supprimer les cookies dans les réglages de ton navigateur, mais certaines fonctions risquent alors de mal fonctionner.'],
      ['4. Publicité (Google AdSense)', 'Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon tes visites précédentes. Tu peux en savoir plus et modifier tes préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['5. Statistiques', 'Le Service peut utiliser Google Analytics (GA4) pour connaître le nombre de visiteurs et leur provenance, et enregistre des totaux quotidiens d’événements comme les pages vues, les notes, les cœurs et les packs terminés. Ces informations servent uniquement aux statistiques et ne permettent pas de t’identifier.'],
      ['6. Liens de partage', 'Les liens que tu partages depuis l’écran de résultat contiennent le nom du pack et tes choix (A/B) sous forme de codes courts, pour que la personne qui les reçoit puisse répondre aux mêmes questions et comparer.'],
      ['7. Contact', 'Pour toute question sur cette politique, contacte l’exploitant du site.'],
      ['8. Date d’entrée en vigueur', 'Cette politique s’applique à partir du 27 septembre 2026.'],
    ],
    back: 'Retour à Tu préfères ?',
  },
});
