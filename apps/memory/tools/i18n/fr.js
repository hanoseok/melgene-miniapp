/* Jeu de mémoire — français (espace fine insécable U+202F avant ? ! : ;) */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap',
    display: "'Fredoka'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Jeu de mémoire – Cartes à retourner d’Halloween',
    description: 'Jouez gratuitement au jeu de mémoire en ligne : retournez les cartes d’Halloween deux par deux et trouvez toutes les paires. Trois niveaux, chrono et coups. Sans téléchargement.',
    ogTitle: 'Jeu de mémoire 🎃 Trouverez-vous toutes les paires ?',
    ogDescription: 'Citrouilles, fantômes et chauves-souris se cachent sous les cartes. Retournez-en deux à la fois et testez votre mémoire.',
  },
  siteName: 'Jeu de mémoire d’Halloween',
  privacyLink: 'Confidentialité',
  start: {
    badge: '🎃 Cartes d’Halloween',
    h1Kicker: 'Jeu de mémoire',
    h1Html: 'Retournez tout,<br>trouvez les <em>paires</em>',
    hook: 'Citrouilles, fantômes et chauves-souris se cachent sous les cartes. Retournez-en deux à la fois et retenez bien où se trouve chaque image.',
    how: 'Deux cartes à la fois · même image = une paire',
    levelLabel: 'Choisissez un niveau',
    levels: { easy: 'Facile', normal: 'Moyen', hard: 'Difficile' },
    start: 'Jouer →',
  },
  play: {
    time: 'Temps',
    moves: 'Coups',
    pairs: 'Paires',
    boardAria: 'Plateau du jeu de mémoire. Retournez deux cartes pour trouver une paire.',
    aDown: 'Carte {n}, face cachée',
    paused: 'En pause · touchez pour reprendre',
  },
  result: {
    done: 'Toutes les paires trouvées !',
    sec: 's',
    movesLabel: 'Coups',
    accLabel: 'Précision',
    best: 'Record : {t}',
    newBest: 'Nouveau record !',
    top: 'Top {n} %',
    beat: 'Plus rapide que {pct} % des joueurs',
    beatAll: 'Plus rapide que tous les autres temps',
    others: 'Comparé à {n} autres temps de ce niveau',
    comparing: 'Comparaison avec les autres joueurs…',
    retry: 'Rejouer',
    shareTitle: 'Jeu de mémoire d’Halloween – quelle est ta mémoire ?',
    shareText: 'J’ai trouvé les {pairs} paires en {time} s et {moves} coups 🎃 Tu fais mieux ?',
  },
  og: {
    brand: '🃏 Jeu de mémoire',
    defaultKicker: 'Jeu de mémoire d’Halloween gratuit',
    defaultTitle: 'Trouverez-vous toutes les paires ?',
    defaultDesc: 'Retourner · mémoriser · associer',
  },
  faq: [
    {
      q: 'Comment jouer au jeu de mémoire ?',
      a: 'Au départ, toutes les cartes sont face cachée. Touchez une carte, puis une deuxième. Si les deux images sont identiques, elles restent visibles ; sinon, elles se retournent après un instant. Trouvez toutes les paires pour terminer. Le chrono démarre à la première carte.',
    },
    {
      q: 'Comment sont comptés les coups et la précision ?',
      a: 'Chaque fois que vous retournez deux cartes, c’est un coup. La précision correspond au nombre de paires divisé par le nombre de coups : trouver toutes les paires sans erreur donne 100 %. Une erreur n’ajoute pas de temps, mais elle coûte un coup.',
    },
    {
      q: 'Quelle est la différence entre les niveaux ?',
      a: 'Facile compte 12 cartes (6 paires), Moyen 16 cartes (8 paires) et Difficile 24 cartes (12 paires). Les cartes et les images sont mélangées à chaque partie, et votre record est gardé séparément pour chaque niveau.',
    },
    {
      q: 'Que se passe-t-il si je change d’application ?',
      a: 'Le chrono s’arrête et les cartes sont masquées pour que personne ne triche. Touchez le plateau à votre retour et la partie reprend là où vous l’aviez laissée.',
    },
    {
      q: 'D’où vient le « Top % » ?',
      a: 'À la fin, votre niveau et votre temps arrondi sont comparés aux vrais temps des autres joueurs du même niveau. S’il n’y a pas encore d’autres temps, la comparaison ne s’affiche pas.',
    },
  ],
  privacy: {
    "title": "Politique de confidentialité | Jeu de mémoire",
    "description": "Politique de confidentialité du jeu de mémoire : temps anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le jeu de mémoire d’Halloween (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seuls votre niveau et votre temps (arrondi au dixième de seconde) sont envoyés à notre serveur sous forme de comptage anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation du Service, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de votre navigateur pour retenir votre langue et vos records, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions pourraient alors ne pas marcher comme prévu."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon vos visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier vos préférences : <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs qui ne gardent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes en étoiles). Rien de tout cela ne vous identifie personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, veuillez contacter l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 16 octobre 2026."
      ]
    ],
    "back": "← Retour au jeu de mémoire"
  },
};
