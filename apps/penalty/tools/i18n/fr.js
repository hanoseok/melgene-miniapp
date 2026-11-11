/* Tirage de gages (Penalty Card Flip) — français (/fr/ ; la langue vient du cookie ou du réglage enregistré)
 * La logique est dans penalty-core.js ; tous les textes visibles sont ici. Les clés finissant par Html acceptent du HTML (<br>, <em>, <a> seulement).
 * Écrans : accueil (accroche + bouton + pub) → réglages (joueurs, nombre de cartes gage, gages, prénoms) → retournement (cartes face cachée) → fin (qui a un gage + écran de fin commun).
 * La FAQ n'apparaît que sur l'écran de fin commun. Garder les marqueurs {n} {k} tels quels.
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap',
    display: "'Alfa Slab One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Tirage de gages en ligne – Cartes à retourner pour soirées',
    description: 'Jeu gratuit de cartes à retourner pour choisir un gage en soirée ou au bar. Choisissez le nombre de joueurs et de cartes gage, puis retournez les cartes une à une. Sans inscription.',
    ogTitle: 'Tirage de gages 🃏 Retournez la carte, choisissez le gage',
    ogDescription: 'Tirage au sort équitable des gages de soirée, mélangé dans votre navigateur.',
  },
  siteName: 'Tirage de gages',
  privacyLink: 'Politique de confidentialité',

  hero: {
    h1Kicker: 'Tirage de gages',
    h1Html: 'Retournez les cartes,<br><em>tirez le gage</em>',
    hook: 'Une carte face cachée par joueur. Quelques-unes cachent un gage, les autres sont sauves. Qui trinque cette fois ?',
  },

  ui: {
    playersLabel: 'Nombre de joueurs',
    playersDec: 'Un joueur de moins',
    playersInc: 'Un joueur de plus',
    penaltyLabel: 'Nombre de cartes gage',
    penaltyDec: 'Une carte gage de moins',
    penaltyInc: 'Une carte gage de plus',
    penaltyHint: 'Démarre à environ un tiers des joueurs. Modifiable.',
    itemsLabel: 'Liste des gages',
    itemsHint: 'Un gage par ligne. Les cartes gage piochent dans cette liste dans un ordre aléatoire. Modifiez-la librement.',
    itemsPh: 'Chanter une chanson\nPorter un toast',
    resetItems: 'Revenir aux gages d’exemple',
    itemsCount: '{count} lignes',
    namesBtn: '+ Ajouter les prénoms (facultatif)',
    namesLabel: 'Prénoms, dans l’ordre de passage',
    namesPh: 'Camille\nThomas\nLéa',
    namesHint: 'Laissé vide, les tours s’affichent en 1er, 2e, 3e. Moins de prénoms que de joueurs, c’est accepté.',
    start: 'Mélanger les cartes 🃏',
    begin: 'Commencer',
    setupTitle: 'Réglages de la partie',
    fair: 'Mélangé une fois avec un générateur cryptographique · rien ne quitte votre navigateur',
  },

  errors: {
    playersRange: 'Choisissez entre 2 et 12 joueurs.',
    penaltiesRange: 'Il faut entre 1 carte gage et autant que de joueurs.',
    itemsEmpty: 'Écrivez au moins un gage.',
    itemsTooMany: 'Vous pouvez utiliser jusqu’à 30 gages.',
    namesTooMany: 'Il y a plus de prénoms que de joueurs. Retirez un prénom ou ajoutez un joueur.',
    badLink: 'Ce lien de résultat est cassé ou incomplet : rien ne peut être affiché.',
  },

  draw: {
    progress: '{done}/{n} retournées',
    left: '{n} cartes restantes',
    turn: 'Au tour de : {who}',
    turnNum: 'Tour n° {k}',
    numbered: 'Joueur {k}',
    pick: 'Touchez n’importe quelle carte face cachée. Toutes étaient déjà fixées au mélange.',
    gridAria: 'Cartes gage face cachée',
    cardAria: 'Carte {k}, face cachée',
    penaltyTag: 'Gage !',
    safeTag: 'Sauf',
    revealPenalty: '{who} : {text}',
    revealSafe: '{who} est sauf cette fois',
    revealNone: 'Touchez une carte pour la révéler.',
    flipAll: 'Tout retourner',
    reshuffle: 'Remélanger',
    seeResults: 'Voir les résultats',
    done: 'Toutes les cartes sont retournées.',
    live: '{who} : {text}',
    liveSafe: '{who} : sauf',
  },

  result: {
    heading: 'Qui a eu le gage',
    sharedBadge: '🃏 Résultat partagé',
    sharedNote: 'Voici le résultat enregistré dans le lien. Il n’est pas remélangé.',
    summary: '{k} gage · {s} sauf',
    summaryMany: '{k} gages · {s} sauf',
    listHead: 'Gages de cette partie',
    safeList: 'Sauf : {names}',
    copy: 'Copier en texte',
    copied: 'Résultat copié',
    copyLink: 'Copier le lien',
    linkCopied: 'Lien copié. Qui l’ouvre voit exactement ce résultat.',
    again: 'Essayer moi aussi',
    edit: 'Modifier les réglages',
    textTitle: '🃏 Résultat du tirage de gages',
    textSafe: 'sauf',
    shareTitle: 'Tirage de gages',
    shareText: 'Retournez les cartes et tirez un gage de soirée 🃏',
  },

  og: {
    brand: '🃏 Tirage de gages',
    kicker: 'Gages de soirée · une carte à la fois',
    title: 'Tirez les gages en retournant les cartes',
    desc: 'Aléatoire, équitable, prêt en quelques secondes',
    sample: 'Chanter une chanson',
  },

  defaults: [
    'Chanter une chanson (le refrain suffit)',
    'Porter un toast en une phrase',
    'Faire une pose trop mignonne',
    'Verser de l’eau à la personne à votre gauche',
    'Danser le robot pendant 10 secondes',
    'Vous présenter encore, en une phrase de plus',
    'Lancer la chanson choisie par votre voisin de droite',
    'Raconter une blague sur vous-même',
    'Lire la phrase suivante avec une voix de bande-annonce',
    'Deviner du premier coup la chanson préférée du suivant',
  ],

  faq: [
    { q: 'Le mélange est-il vraiment équitable ?', a: 'Oui. Au moment du mélange, les cartes sont placées une seule fois avec le générateur aléatoire cryptographique de votre navigateur (crypto.getRandomValues), avec un échantillonnage par rejet et un mélange de Fisher–Yates. Tout est fixé à cet instant : peu importe la carte touchée.' },
    { q: 'Comment les gages sont-ils choisis ?', a: 'Chaque carte gage prend une ligne de votre liste, dans un ordre aléatoire. S’il y a moins de lignes que de cartes gage, la liste mélangée est réutilisée. Modifiez les lignes avant de mélanger pour les adapter à votre groupe.' },
    { q: 'Peut-on refuser un gage ?', a: 'Oui. Les gages sont là pour s’amuser et restent toujours facultatifs. Si quelqu’un ne veut pas en faire un, le groupe peut le remplacer par un autre plus léger.' },
    { q: 'Comment partager le résultat avec le groupe ?', a: 'Sur l’écran des résultats, touchez « Copier en texte » pour coller la liste dans une discussion, ou « Copier le lien ». Le lien contient ce résultat exact : qui l’ouvre voit les mêmes cartes, sans nouveau mélange.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Tirage de gages',
    description: 'Politique de confidentialité de Tirage de gages : prénoms, gages et résultats restent dans votre navigateur ; cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Tirage de gages (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Les prénoms, les gages et les résultats que vous saisissez ne sont traités que dans votre navigateur et ne sont pas envoyés à nos serveurs. Vos derniers réglages sont conservés dans le stockage local de votre navigateur, que vous pouvez effacer à tout moment. Lorsque vous copiez un lien de résultat, les prénoms, gages et résultats sont inscrits dans ce lien et ne sont visibles que par les personnes à qui vous l’envoyez.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et vos réglages, afficher des publicités et comprendre l’usage du Service. Vous pouvez les refuser ou les supprimer dans les paramètres de votre navigateur ; certaines fonctions pourraient alors ne pas fonctionner comme prévu.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et sur d’autres. Pour en savoir plus et modifier vos préférences, consultez les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés, qui ne conservent que les totaux quotidiens par langue (pages vues, parties commencées et terminées). Aucune de ces données ne vous identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique, contactez l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique est en vigueur depuis le 11 novembre 2026.'],
    ],
    back: '← Retour à Tirage de gages',
  },
};
