/* Jeu 1 à 50 — français (espace fine insécable U+202F avant ? ! : ;) */
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
    title: 'Jeu 1 à 50 – Touchez les nombres dans l’ordre',
    description: 'Jouez au jeu 1 à 50 en ligne : touchez les nombres dans l’ordre le plus vite possible et battez votre record au centième. Mode classique ou rapide 1 à 25. Gratuit, sans téléchargement.',
    ogTitle: 'Jeu 1 à 50 🔢 En combien de temps touchez-vous 1 à 50 ?',
    ogDescription: 'Trouvez le nombre suivant et touchez-le, jusqu’au bout. Un test express de concentration et de rapidité.',
  },
  siteName: 'Jeu 1 à 50',
  privacyLink: 'Politique de confidentialité',
  start: {
    badge: '🔢 Toucher les nombres · vitesse',
    h1Kicker: 'Jeu 1 à 50',
    h1Html: 'De 1 à 50,<br>au plus <em>vite</em>\u202f!',
    hook: 'Les nombres sont éparpillés sur la grille. Trouve le suivant, touche-le et continue jusqu’au bout. Tes yeux doivent aller plus vite que tes doigts.',
    how: { order: 'Touche dans l’ordre dès 1', swap: 'De nouveaux nombres', penalty: 'Erreur = +0,5 s' },
    facts: 'Compte à rebours 3-2-1 · chrono au centième',
    modeLabel: 'Choisis un mode',
    modes: { classic: 'Classique', quick: 'Rapide' },
    start: 'C’est parti →',
  },
  play: {
    next: 'Suivant',
    time: 'Temps',
    progress: 'Fait',
    go: 'GO !',
    boardAria: 'Grille du jeu 1 à 50. Touche les nombres dans l’ordre en commençant par 1.',
    paused: 'Pause · touche pour reprendre',
    aBlank: 'Case vide',
  },
  result: {
    done: 'Terminé !',
    sec: 's',
    mistakesLabel: 'Erreurs',
    perLabel: 'Par nombre',
    best: 'Record : {t}',
    newBest: 'Nouveau record !',
    penNote: 'Inclut +{s} s pour les erreurs',
    top: 'Top {n} %',
    beat: 'Plus rapide que {pct} % des joueurs',
    beatAll: 'Plus rapide que tous les autres temps',
    others: 'Comparé à {n} autres temps',
    comparing: 'Comparaison avec les autres joueurs…',
    retry: 'Rejouer',
    shareTitle: 'Jeu 1 à 50 – quelle est ta vitesse ?',
    shareText: 'J’ai touché de 1 à {max} en {time} secondes 🔢 Tu fais mieux ?',
  },
  og: {
    brand: '🔢 Jeu 1 à 50',
    defaultKicker: 'Jeu de vitesse gratuit',
    defaultTitle: 'En combien de temps de 1 à 50 ?',
    defaultDesc: 'Trouve le nombre suivant · bats le chrono',
  },
  faq: [
    {
      q: 'Comment jouer au jeu 1 à 50 ?',
      a: 'Après un compte à rebours 3-2-1, une grille de 5 sur 5 affiche les nombres de 1 à 25 au hasard. Touche 1, puis 2, puis 3 et ainsi de suite. En mode Classique, chaque case touchée affiche un nouveau nombre entre 26 et 50, et tu continues jusqu’à 50.',
    },
    {
      q: 'Que se passe-t-il si je touche le mauvais nombre ?',
      a: 'La case tremble et 0,5 seconde s’ajoute à ton temps, donc taper au hasard ne sert à rien. Toucher une case vide ne fait rien. Le résultat indique combien d’erreurs tu as faites.',
    },
    {
      q: 'Quelle différence entre Classique et Rapide ?',
      a: 'Le mode Classique va de 1 à 50 et c’est la référence pour comparer les temps. Le mode Rapide s’arrête à 25 et chaque case touchée reste vide : idéal pour s’échauffer, il ressemble à une table de Schulte.',
    },
    {
      q: 'D’où vient le chiffre « Top % » ?',
      a: 'À la fin, ton mode et ton temps arrondi sont comparés aux vrais temps des autres joueurs dans le même mode. S’il n’y a encore aucun temps à comparer, ce bloc ne s’affiche pas.',
    },
  ],
  privacy: {
    "title": "Politique de confidentialité | Jeu 1 à 50",
    "description": "Politique de confidentialité du Jeu 1 à 50 : temps anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Jeu 1 à 50 (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Quand vous terminez une partie, seuls le mode et votre temps (arrondi au dixième de seconde) sont envoyés à notre serveur sous forme de comptage anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation du Service, comme décrit ci-dessous."
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
        "Cette politique s’applique à partir du 14 octobre 2026."
      ]
    ],
    "back": "← Retour au Jeu 1 à 50"
  },
};
