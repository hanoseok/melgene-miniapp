/* Course d’animaux — français. Même structure de clés que en.js. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Course d’animaux – tirage au sort en course',
    description: 'Un tirage au sort en course d’animaux : entrez 2 à 10 prénoms, chacun court sur sa ligne. Le premier gagne, ou le dernier paie les cafés. Hasard équitable, gratuit, sans inscription.',
    ogTitle: 'Course d’animaux 🏁 Qui paie les cafés ?',
    ogDescription: 'Entrez les prénoms, alignez les animaux et laissez la course décider. Le premier gagne, ou le dernier paie.',
  },
  siteName: 'Course d’animaux',
  privacyLink: 'Politique de confidentialité',

  hero: {
    h1Kicker: 'Course d’animaux',
    h1Html: 'Impossible de choisir ?<br><em>Les animaux vont trancher</em>',
    hook: 'Qui paie les cafés ? Qui commence ? Mettez tout le monde sur la ligne de départ et regardez la course.',
  },

  ui: {
    modeLabel: 'Comment on décide ?',
    modeWin: '🏆 Le 1er gagne',
    modeLose: '☕ Le dernier paie',
    countLabel: 'Coureurs',
    countValue: '{n} coureurs',
    less: 'Moins de coureurs',
    more: 'Plus de coureurs',
    namesLabel: 'Qui participe ?',
    namesHint: 'Une ligne vide garde son prénom par défaut. L’animal est juste pour le fun et ne change les chances de personne.',
    playerN: 'Joueur {n}',
    nameAria: 'Prénom pour la ligne {n}',
    start: 'Lancer la course 🏁',
    fair: 'L’ordre d’arrivée est tiré au sort avec crypto avant le départ · les prénoms restent sur votre appareil',
    trackAria: 'Piste de course',
    go: 'Partez !',
    bannerWin: '🏆 Le premier arrivé gagne',
    bannerLose: '☕ Le dernier arrivé paie',
    liveStart: 'Trois, deux, un, partez ! La course commence.',
  },

  errors: {
    tooFew: 'Il faut au moins 2 coureurs.',
    tooMany: 'La piste accueille 10 coureurs au maximum.',
    badLink: 'Ce lien est cassé, aucun prénom n’a pu être chargé.',
  },

  result: {
    winKicker: 'Et le gagnant est',
    winTitle: '{name} gagne ! 🏆',
    winSub: 'Premier à franchir la ligne d’arrivée.',
    loseKicker: 'Dernier à passer la ligne',
    loseTitle: '{name} finit dernier',
    loseSub: 'Pas de chance ! Cette tournée de cafés est pour {name} ☕',
    rankingTitle: 'Ordre d’arrivée',
    tagWin: 'Gagnant',
    tagLose: 'Paie ☕',
    edit: 'Changer les prénoms',
    shareNames: 'Copier le lien avec ces prénoms',
    linkCopied: 'Lien copié. Il ouvre les mêmes coureurs, prêts à partir.',
    sharedNote: 'Coureurs chargés depuis un lien partagé. À vous de lancer !',
    history: 'Dernières courses',
    historyClear: 'Effacer',
    historyWin: '🏆 {name}',
    historyLose: '☕ {name}',
    historyMeta: '{n} coureurs',
    liveWin: '{name} gagne la course.',
    liveLose: '{name} arrive en dernier.',
    again: 'Nouvelle course 🏁',
    shareTitle: 'Course d’animaux',
    shareText: 'Impossible de choisir ? Laissez les animaux faire la course 🏁',
  },

  og: {
    brand: '🏁 Course d’animaux',
    kicker: 'Tirage au sort en course · 2 à 10 joueurs',
    title: 'Laissez les animaux décider en courant',
    desc: 'Le premier gagne, ou le dernier paie les cafés',
  },

  faq: [
    { q: 'La course est-elle vraiment aléatoire et équitable ?', a: 'Oui. Dès que vous lancez la course, tout l’ordre d’arrivée est tiré avec le générateur aléatoire cryptographique du navigateur (crypto.getRandomValues), un échantillonnage par rejet et un mélange de Fisher–Yates. Chaque ordre a exactement la même chance ; la course à l’écran ne fait que le mettre en scène.' },
    { q: 'L’animal ou la ligne changent-ils mes chances ?', a: 'Non. Les animaux sont attribués par ligne, juste pour s’amuser. Ici, le lapin ne va pas plus vite que la tortue, et la ligne 1 a les mêmes chances que la ligne 10.' },
    { q: 'Pourquoi les arrivées sont-elles toujours si serrées ?', a: 'Pour le spectacle. Une fois l’ordre tiré, l’animation ajoute des sprints, des faux pas et un final serré à la place qui compte, la première ou la dernière selon le mode. La mise en scène ne change jamais l’ordre.' },
    { q: 'Puis-je envoyer les mêmes coureurs à mes amis ?', a: 'Oui. « Copier le lien avec ces prénoms » met seulement les prénoms et le mode dans le lien, jamais un résultat. La personne qui l’ouvre lance une nouvelle course. Vos derniers résultats restent sur cet appareil.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Course d’animaux',
    description: 'Politique de confidentialité de Course d’animaux : prénoms et résultats restent dans votre navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Course d’animaux (le « Service ») respecte votre vie privée et ne traite que les informations minimales décrites ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Les prénoms saisis sont traités uniquement dans votre navigateur et ne sont pas envoyés à notre serveur. Votre dernière liste de prénoms et vos dix derniers résultats peuvent être conservés dans le stockage local de votre navigateur, sur votre appareil. Lorsque vous copiez un lien avec des prénoms, ceux-ci sont écrits dans le lien et ne sont partagés qu’avec les personnes à qui vous l’envoyez.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local du navigateur pour mémoriser votre langue et vos réglages, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions peuvent alors ne pas marcher correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et d’autres sites. Pour en savoir plus et modifier vos préférences, consultez les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, courses lancées et terminées, notes). Rien de tout cela ne permet de vous identifier.'],
      ['5. Contact', 'Pour toute question sur cette politique, contactez l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 22 octobre 2026.'],
    ],
    back: '← Retour à Course d’animaux',
  },
};
