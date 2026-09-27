/* Jeu de l'échelle — Français (/fr/)
 * Mots-clés : "tirage au sort", "jeu de l'échelle", "amidakuji".
 * page.* est injecté dans le HTML statique par tools/gen-i18n.js ; ui.* est inliné pour ladder.js.
 */
module.exports = {
  siteName: 'Jeu de l’échelle',
  meta: {
    title: 'Tirage au sort (jeu de l’échelle) | Melgene Apps',
    description: 'Qui paie le café ? Où va-t-on déjeuner ? Qui fait la vaisselle ? Ce tirage au sort en ligne gratuit (un jeu de l\'échelle, ou amidakuji) décide en toute équité, sans installation ni inscription. Partagez la même échelle grâce à un lien.',
    ogTitle: 'Jeu de l’échelle — le tirage au sort équitable, gratuit en 1 minute',
    ogDescription: 'Entrez les noms et les résultats, touchez, et suivez le trajet. Un tirage au sort en ligne gratuit, sans installation.',
  },
  fontCss: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700&display=swap',
  app: {
    name: 'Jeu de l’échelle',
    currency: 'EUR',
    description: 'Un jeu de l\'échelle gratuit en ligne (un tirage au sort) pour choisir le déjeuner, qui paie le café, répartir les corvées ou fixer un ordre de passage. Entrez les joueurs et les résultats pour obtenir une échelle aléatoire équitable, puis partagez exactement la même grâce à un lien.',
  },
  setup: {
    badge: '🪜 Gratuit en ligne',
    h1Html: 'Indécis ?<br>Faites un <em>tirage au sort</em>',
    hook: 'Ajoutez les noms et les résultats, le hasard fait le reste. Déjeuner, café, corvées, ordre de passage — tout est réglé équitablement.',
    countLabel: 'Nombre de joueurs',
    minusAria: 'Moins de joueurs',
    plusAria: 'Plus de joueurs',
    presetLabel: 'Raccourcis',
    presets: { lunch: '🍕 Déjeuner', coffee: '☕ Qui paie le café', clean: '🧹 Corvées', order: '🔢 Ordre de passage' },
    namesLabel: 'Joueurs',
    resultsLabel: 'Résultats',
    shuffle: '🔀 Mélanger',
    build: 'Créer l’échelle →',
  },
  play: {
    edit: '← Modifier',
    rebuild: '🔁 Nouvelle échelle',
    hint: 'Touchez un joueur pour suivre son trajet',
    revealAll: 'Tout révéler',
    finalTitle: 'Résultats finaux',
  },
  privacyLink: 'Politique de confidentialité',

  // FAQ courte, sans spoiler, affichée uniquement dans l'écran de fin partagé (MG_FAQ)
  faq: [
    { q: 'Le jeu de l’échelle est-il vraiment équitable ?', a: 'Oui. Les barreaux sont placés au hasard à chaque fois et les trajets ne se croisent jamais, donc personne ne peut prédire ou truquer le résultat.' },
    { q: 'Puis-je refaire une échelle avec les mêmes joueurs ?', a: 'Touchez « Nouvelle échelle » pour garder vos joueurs et résultats, mais générer une toute nouvelle échelle aléatoire.' },
    { q: 'Combien de joueurs peuvent participer ?', a: 'De 2 à 10 joueurs.' },
    { q: 'Ça marche sur mobile ?', a: 'Oui. Conçu pour le tactile, l’échelle s’adapte automatiquement à toutes les tailles d’écran.' },
  ],

  ui: {
    defaultName: 'Joueur {n}',
    win: 'Gagnant 🎉',
    lose: 'Perdu',
    coffeeWin: 'Paie le café',
    coffeeLose: 'Épargné',
    order: ['1er', '2e', '3e', '4e', '5e', '6e', '7e', '8e', '9e', '10e'],
    pools: {
      lunch: ['Pizza', 'Tacos', 'Burger', 'Sushi', 'Kebab', 'Salade', 'Pâtes', 'Ramen', 'Couscous', 'Sandwich'],
      clean: ['Vaisselle', 'Aspirateur', 'Linge', 'Poubelles', 'Toilettes', 'Courses', 'Poussière', 'Serpillière', 'Plantes', 'Recyclage'],
    },
    ariaName: 'Nom du joueur {n}',
    ariaResult: 'Résultat {n}',
    ariaTrace: 'Suivre le trajet de {name}',
    ariaHidden: 'Résultat {n}, pas encore révélé',
    ariaRevealed: '{result} révélé',
    shareTitle: 'Regarde ce jeu de l’échelle',
    shareText: 'J\'ai créé une échelle — refais le même trajet et vois où tu atterris !',
    retryLabel: 'Nouvelle échelle',
  },

  og: {
    badge: '🪜 Gratuit en ligne',
    title: 'Jeu de l’échelle',
    tag: 'Du déjeuner au café, tout décidé équitablement',
  },

  privacy: {
    title: 'Politique de confidentialité | Jeu de l’échelle',
    description: 'Politique de confidentialité du Jeu de l’échelle — cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le Jeu de l\'échelle (le « Service ») respecte votre vie privée et ne traite que le minimum d\'informations nécessaire, comme décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Vous pouvez utiliser le Service sans inscription ni connexion. Les noms et résultats que vous saisissez ne sont jamais stockés sur nos serveurs ; ils sont traités uniquement dans votre navigateur (stockage local et adresse de la page). Certaines informations peuvent être collectées automatiquement pendant l\'utilisation du Service, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies pour afficher des publicités et comprendre l\'utilisation du Service. Vous pouvez refuser ou supprimer les cookies dans les paramètres de votre navigateur ; certaines fonctionnalités pourraient alors ne plus fonctionner correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des publicités basées sur vos visites précédentes sur ce site et d\'autres. Vous pouvez en savoir plus et modifier vos paramètres de personnalisation publicitaire sur <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Google Ad Settings</a>.'],
      ['4. Statistiques (Google Analytics)', 'Le Service peut utiliser Google Analytics (GA4) pour comprendre le nombre de visiteurs et les sources de trafic afin de l\'améliorer. Ces données sont utilisées uniquement à des fins statistiques et ne vous identifient pas personnellement.'],
      ['5. Liens de partage', 'Les liens créés avec « Partager » contiennent les noms des joueurs et les résultats que vous avez saisis, ainsi que la structure de l\'échelle, encodés dans l\'URL. Nous recommandons de ne pas saisir d\'informations permettant d\'identifier une personne.'],
      ['6. Contact', 'Pour toute question concernant cette politique de confidentialité, veuillez contacter l\'exploitant du site.'],
      ['7. Date d\'entrée en vigueur', 'Cette politique est en vigueur depuis le 1er janvier 2026.'],
    ],
    back: '← Retour au Jeu de l’échelle',
  },
};
