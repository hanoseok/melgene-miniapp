/* Roue aléatoire — Français (/fr/)
 * Requête ciblée : « roue aléatoire » / « roue de la fortune ». title = « {requête} | {marque} ».
 * Mêmes clés que les autres fichiers de langue. ui.presets doit garder les mêmes clés et le même nombre
 * d'éléments dans toutes les langues (vérifié par check-roulette.js). 24 caractères max par option.
 * La FAQ n'apparaît que dans l'écran de fin partagé (sous les boutons de partage) — jamais sur l'écran de départ.
 */
module.exports = {
  siteName: 'Roue aléatoire',
  meta: {
    title: 'Roue aléatoire | Melgene Apps',
    description: "Roue aléatoire gratuite en ligne. Écrivez vos options et faites tourner — sans téléchargement ni inscription, prêt en une minute. Pondération et lien à partager inclus.",
    ogTitle: 'Roue aléatoire — écrivez vos options, faites tourner',
    ogDescription: 'Déjeuner, corvées, gages. Une roue de la fortune gratuite et équitable, directement dans votre navigateur.',
  },
  // Police de titre pour l'enseigne, le portail et le résultat (fontCss la charge, displayFont la nomme)
  fontCss: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap',
  displayFont: "'Dela Gothic One'",
  app: {
    name: 'Roue aléatoire',
    description: "Une roue aléatoire gratuite en ligne pour le déjeuner, les corvées, les gages ou un tirage au sort. Ajoutez de 2 à 16 options avec des poids en option, faites tourner : le gagnant est tiré équitablement par un générateur aléatoire cryptographique. Partagez un lien vers la roue exacte.",
  },
  hero: {
    h1: 'Roue aléatoire',
    tagline: 'Indécis ? Écrivez-le et faites tourner.',
  },
  wheel: {
    spin: 'Tourner',
    spinAria: 'Faire tourner la roue',
    share: 'Partager',
    fair: "Le résultat est tiré au hasard dès que vous appuyez sur tourner. La roue ne fait que ralentir pour s'arrêter dessus.",
  },
  history: {
    title: 'Historique des tirages',
    clear: "Effacer l'historique",
  },
  editor: {
    title: 'Options',
    presetsLabel: 'Démarrage rapide',
    presets: { lunch: '🍕 Déjeuner', dare: '🎤 Gages', duty: '🙋 Prénoms', yesno: '👍 Oui / Non', numbers: '🔢 1–10' },
    add: 'Ajouter une option',
    shuffle: 'Mélanger',
    weighted: 'Probabilités pondérées',
    weightedHint: 'Un nombre plus élevé donne une part plus large et sort plus souvent.',
    themeLabel: 'Couleurs',
  },
  result: {
    kicker: 'La roue a choisi',
    again: 'Retourner',
    removeAgain: 'Retirer et retourner',
    close: 'Fermer',
  },
  // Affiché uniquement dans l'écran de fin partagé (sous les boutons de partage) — jamais sur l'écran de départ
  faq: [
    { q: 'Le résultat peut-il être truqué ?', a: "Non. Le gagnant est tiré par un générateur aléatoire cryptographique dès que vous appuyez sur tourner, et la roue s'arrête simplement dessus. Le moment où vous appuyez et l'animation n'ont aucune influence sur le résultat." },
    { q: 'Comment fonctionnent les probabilités pondérées ?', a: "La chance de chaque option est son poids (1 à 5) divisé par la somme de tous les poids. Avec des poids de 2, 1 et 1, la première option gagne 50 % du temps, les autres 25 % chacune." },
    { q: "Combien d'options puis-je ajouter ?", a: "De 2 à 16. Chaque option peut contenir jusqu'à 24 caractères ; les noms longs sont réduits ou tronqués avec des points de suspension quand une part est étroite." },
    { q: 'Puis-je envoyer ma roue à quelqu\'un ?', a: "Oui. Partager crée un lien qui encode vos options, poids et thème de couleur dans l'adresse — rien n'est stocké sur un serveur." },
    { q: 'Faut-il installer une appli ou créer un compte ?', a: 'Non. La roue fonctionne directement dans le navigateur du téléphone, de la tablette ou de l’ordinateur, sans téléchargement ni inscription.' },
  ],
  privacyLink: 'Politique de confidentialité',

  ui: {
    itemN: 'Option {n}',
    wheelAria: 'Roue à {n} parts : {list}',
    ariaItem: "Nom de l'option {n}",
    ariaHandle: "Réordonner l'option {n} (flèches haut/bas)",
    ariaDelete: "Supprimer l'option {n}",
    ariaWeight: "Option {n}, poids {w}, appuyez pour changer",
    count: '{n}/{max}',
    maxReached: "Vous pouvez ajouter jusqu'à {max} options",
    minReached: 'Il faut au moins 2 options pour tourner',
    soundOn: 'Son activé',
    soundOff: 'Son désactivé',
    announce: 'Résultat : {label}',
    historyItem: 'Tirage {n}',
    restore: '{n} option(s) retirée(s) à remettre',
    loadedShare: 'Roue partagée chargée',
    badShare: "Impossible d'ouvrir ce lien", // le toast tient sur une ligne (nowrap) — rester court
    shareTitle: 'Fais tourner ma roue',
    shareText: "J'ai créé une roue — tu la fais tourner ?",
    themes: { candy: 'Bonbon', macaron: 'Macaron', circus: 'Cirque', jewel: 'Bijou' },
    presets: {
      lunch: ['Pizza', 'Tacos', 'Sushis', 'Burgers', 'Kebab', 'Salade', 'Pâtes', 'Couscous'],
      dare: ['Chanter un refrain', 'Danser 15 secondes', 'Imiter un accent', 'Payer le café', 'Raconter une blague', '10 pompes', 'Parler comme un pirate', 'Faire une grimace'],
      duty: ['Emma', 'Léo', 'Chloé', 'Hugo', 'Camille', 'Noah'],
      yesno: ['Oui', 'Non'],
      numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    },
  },

  og: {
    badge: '🎡 Gratuit en ligne',
    title: 'Roue aléatoire',
    tag: 'Déjeuner, prénoms, gages : écrivez et tournez',
  },

  privacy: {
    title: 'Politique de confidentialité | Roue aléatoire',
    description: 'Politique de confidentialité de Roue aléatoire — stockage de vos options, cookies, publicités et analyse.',
    h1: 'Politique de confidentialité',
    introHtml: 'Roue aléatoire (le « Service ») respecte votre vie privée et ne traite que le minimum d\'informations décrites ci-dessous.',
    sections: [
      ['1. Informations collectées', "Le Service fonctionne sans compte ni connexion. Vos options, poids, thème de couleur et historique de tirages ne sont jamais envoyés à un serveur — ils restent dans votre navigateur (stockage local et URL). Certaines informations peuvent être collectées automatiquement lors de l'utilisation du Service, comme décrit ci-dessous."],
      ['2. Cookies et technologies similaires', "Le Service peut utiliser des cookies pour afficher des publicités et comprendre comment le Service est utilisé. Vous pouvez refuser ou supprimer les cookies dans les paramètres de votre navigateur ; certaines fonctionnalités peuvent alors ne pas fonctionner comme prévu."],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des publicités basées sur vos visites précédentes. Vous pouvez en savoir plus et modifier vos préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Analyse', "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, tirages, notes). Rien de tout cela ne vous identifie personnellement."],
      ['5. Liens partagés', 'Les liens créés avec « Partager » contiennent les noms d\'options, les poids et le thème de couleur que vous avez saisis, encodés dans l\'URL. Évitez d\'y saisir des informations permettant de vous identifier.'],
      ['6. Contact', 'Pour toute question concernant cette politique, veuillez contacter l\'opérateur du Service.'],
      ['7. Date d\'entrée en vigueur', 'Cette politique est effective à partir du 27 septembre 2026.'],
    ],
    back: '← Retour à Roue aléatoire',
  },
};
