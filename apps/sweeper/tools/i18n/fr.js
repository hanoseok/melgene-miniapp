/* Démineur — fr (see en.js for the key structure; placeholders {t} {n} {pct} {time} {diff} stay as-is) */
/* Espaces fines insécables (U+202F) avant ? ! : ; */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Audiowide&display=swap',
    display: "'Audiowide'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },
  meta: {
    title: 'Démineur – Jeu de mines gratuit en ligne',
    description: 'Jouez au Démineur en ligne : dévoilez toutes les cases sûres, posez des drapeaux sur les mines et battez le chrono. Débutant, moyen ou expert. Votre premier clic est toujours sûr.',
    ogTitle: 'Démineur 💣 En combien de temps videz-vous le terrain ?',
    ogDescription: 'Le casse-tête classique dans votre navigateur : trois tailles, un premier clic sans risque et un chrono à battre.',
  },
  siteName: 'Démineur',
  privacyLink: 'Politique de confidentialité',
  start: {
    badge: '💣 Casse-tête · 3 niveaux',
    h1Kicker: 'Démineur',
    h1Html: 'Videz la grille<br>sans <em>boum</em>',
    hook: 'Les chiffres indiquent combien de mines se cachent autour. Réfléchissez, plantez des drapeaux et dégagez la grille avant que le chrono ne file.',
    how: { reveal: 'Touchez pour dévoiler', flag: 'Appui long = drapeau', chord: 'Touchez un chiffre' },
    facts: 'Le premier clic est toujours sûr',
    diffLabel: 'Choisissez un niveau',
    diffs: { beginner: 'Débutant', intermediate: 'Moyen', expert: 'Expert' },
    start: 'Commencer →',
  },
  play: {
    mines: 'Mines',
    time: 'Temps',
    digMode: 'Creuser',
    flagMode: 'Drapeau',
    boardAria: 'Grille de Démineur. Touchez une case pour la dévoiler, appui long ou mode drapeau pour marquer une mine.',
    paused: 'En pause · touchez pour reprendre',
    aHidden: 'Case cachée',
    aFlag: 'Case avec drapeau',
    aMine: 'Mine',
    aNum: '{n} mines autour',
  },
  result: {
    win: 'Terrain déminé !',
    lose: 'Boum !',
    sec: 's',
    timeLabel: 'Temps',
    clearedLabel: 'Dévoilé',
    best: 'Record : {t}',
    newBest: 'Nouveau record !',
    top: 'Top {n} %',
    beat: 'Plus rapide que {pct} % des joueurs',
    beatAll: 'Plus rapide que tous les temps jusqu’ici',
    others: 'Comparé à {n} autres temps',
    comparing: 'Comparaison avec les autres joueurs…',
    retry: 'Rejouer',
    shareTitle: 'Démineur – saurez-vous vider le terrain ?',
    shareWin: 'J’ai déminé le niveau {diff} en {time} secondes 💣 Saurez-vous faire mieux ?',
    shareLose: 'J’ai dévoilé {pct} % du niveau {diff} avant le boum 💥 Saurez-vous faire mieux ?',
  },
  og: { brand: '💣 Démineur', defaultKicker: 'Jeu de réflexion gratuit', defaultTitle: 'Saurez-vous vider le terrain ?', defaultDesc: 'Posez les drapeaux · battez le chrono' },
  faq: [
    {
      q: 'Comment jouer au Démineur ?',
      a: 'Touchez une case pour la dévoiler. Un chiffre indique combien des huit cases voisines cachent une mine. Déduisez où sont les mines, plantez des drapeaux et dévoilez toutes les cases sans mine pour gagner.',
    },
    {
      q: 'Comment poser un drapeau sur mobile ?',
      a: 'Maintenez le doigt sur une case un instant, ou passez le bouton Creuser / Drapeau au-dessus de la grille en mode drapeau, puis touchez. Sur ordinateur : clic droit, ou touche F sur la case sélectionnée.',
    },
    {
      q: 'Que se passe-t-il quand je touche un chiffre ?',
      a: 'Si vous avez posé autant de drapeaux autour du chiffre que sa valeur, le toucher dévoile d’un coup les autres cases voisines. Si un drapeau est faux, la case explose : vérifiez avant.',
    },
    {
      q: 'Le premier clic est-il vraiment sûr ?',
      a: 'Oui. Les mines sont placées après votre premier clic, jamais sur cette case ni juste à côté, donc une zone s’ouvre toujours. Le chrono démarre à ce clic et s’arrête quand vous quittez l’onglet.',
    },
  ],
  privacy: {
    "title": "Politique de confidentialité | Démineur",
    "description": "Politique de confidentialité du Démineur : temps anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Démineur (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Quand vous gagnez une partie, seuls le niveau et votre temps (arrondi à la demi-seconde) sont envoyés à notre serveur sous forme de comptage anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation du Service, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et votre record, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions risquent alors de ne pas fonctionner correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et d’autres sites. Pour en savoir plus et modifier vos préférences, consultez les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes). Rien de tout cela ne permet de vous identifier."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, contactez l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 10 octobre 2026."
      ]
    ],
    "back": "← Retour au Démineur"
  },
};
