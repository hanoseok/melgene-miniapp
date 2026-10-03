/* Jeu 2048 (édition Halloween) — français
 * Avant ? ! : ; on met une espace fine insécable (U+202F).
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap',
    display: "'Lilita One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Jeu 2048 gratuit en ligne – édition Halloween',
    description: 'Joue au jeu 2048 en ligne, version Halloween : glisse les tuiles au doigt ou aux flèches, fusionne les nombres identiques et atteins 2048. Gratuit, sans téléchargement.',
    ogTitle: 'Jeu 2048 🎃 Arriveras-tu jusqu’à 2048 ?',
    ogDescription: 'Glisse, fusionne, double. Un petit 2048 qui fait peur, à jouer direct dans ton navigateur.',
  },
  siteName: 'Jeu 2048',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🎃 Édition Halloween · casse-tête',
    h1Kicker: 'Jeu 2048',
    h1Html: 'Arriveras-tu<br>à <em>2048</em> ?',
    hook: 'Fais glisser les tuiles. Deux nombres identiques se rencontrent et fusionnent — continue de doubler avant que la grille soit pleine.',
    how: { swipe: 'Glisse pour bouger', match: 'Fusionne les paires', goal: 'Atteins 2048' },
    facts: 'Sans chrono · doigt ou flèches',
    start: 'C’est parti →',
  },

  play: {
    score: 'Score',
    best: 'Record',
    boardAria: 'Grille de jeu. Glisse ou utilise les flèches du clavier pour déplacer les tuiles.',
    won: 'Tu as fait 2048 !',
    keepGoing: 'Continuer',
    finish: 'Arrêter ici',
    over: 'Plus aucun coup !',
  },

  result: {
    over: 'Plus aucun coup !',
    won: 'Tu as atteint 2048 !',
    points: 'points',
    best: 'Record : {n}',
    newBest: 'Nouveau record !',
    biggest: 'Plus grosse tuile',
    moves: 'Coups',
    top: 'Top {n} %',
    beat: 'Mieux que {pct} % des joueurs',
    beatAll: 'Mieux que tous les autres scores pour l’instant',
    others: 'Comparé à {n} autres scores',
    comparing: 'Comparaison avec les autres joueurs…',
    retry: 'Rejouer',
    shareTitle: 'Jeu 2048 – édition Halloween',
    shareText: 'J’ai fait {score} points au jeu 2048 🎃 Tu me bats ?',
  },

  og: {
    brand: '🔢 Jeu 2048',
    defaultKicker: '2048 d’Halloween gratuit',
    defaultTitle: 'Arriveras-tu à 2048 ?',
    defaultDesc: 'Glisse · fusionne · double',
  },

  faq: [
    { q: 'Comment jouer au 2048 ?', a: 'Glisse sur la grille (ou appuie sur les flèches) pour déplacer toutes les tuiles d’un coup. Quand deux tuiles portant le même nombre se touchent, elles fusionnent en une seule qui vaut le double. Un nouveau 2 ou 4 apparaît après chaque coup.' },
    { q: 'Quand la partie se termine-t-elle ?', a: 'Il n’y a pas de chrono. La partie s’arrête quand la grille est pleine et qu’aucune tuile voisine ne porte le même nombre. Une fois 2048 atteint, tu peux t’arrêter ou continuer pour un plus gros score.' },
    { q: 'Comment le score est-il calculé ?', a: 'Chaque fusion ajoute la valeur de la nouvelle tuile à ton score : plus la fusion est grosse, plus elle rapporte. Ton record est enregistré uniquement dans ce navigateur.' },
    { q: 'Le « top % » est-il réel ?', a: 'Oui. À la fin d’une partie, seul ton score est envoyé anonymement à notre serveur et comparé à ceux des autres. Le top % ne s’affiche que s’il existe de vrais scores à comparer ; sinon, rien ne s’affiche.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Jeu 2048',
    description: 'Politique de confidentialité du jeu 2048 : scores anonymes, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le jeu 2048 (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul ton score (arrondi à 20 points près) est envoyé à notre serveur sous forme de compteur anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local du navigateur pour retenir ta langue et ton record, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions peuvent alors mal fonctionner.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon tes visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier tes préférences : <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes). Rien de tout cela ne permet de t’identifier.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 4 octobre 2026.'],
    ],
    back: '← Retour au jeu 2048',
  },
};
