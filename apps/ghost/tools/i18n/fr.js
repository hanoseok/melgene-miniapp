/* Créer son fantôme d’Halloween — français (/fr/)
 * Même structure de clés que en.js. Les dessins et le nombre de pièces sont dans ghost-core.js.
 * Typographie : espace fine insécable (U+202F) avant ? ! : ; et à l’intérieur des « ».
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Créer son fantôme d’Halloween – fantôme mignon',
    description: 'Crée ton fantôme d’Halloween en ligne : choisis la forme, les yeux, la bouche et le chapeau de ton petit fantôme mignon. Gratuit, sans téléchargement, prêt en 1 minute.',
    ogTitle: 'Créer son fantôme d’Halloween 👻',
    ogDescription: 'Ton petit fantôme mignon en une minute, qui flotte et que tu peux envoyer à tes amis.',
  },
  siteName: 'Crée ton fantôme',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '👻 Spécial Halloween',
    h1Kicker: 'Créer son fantôme d’Halloween',
    h1Html: 'Crée ton petit<br><em>fantôme</em>',
    hook: 'Quelqu’un de timide se cache sous ce drap. Donne-lui une frimousse et un peu de caractère, puis regarde-le flotter.',
    start: 'Créer mon fantôme →',
  },

  editor: {
    title: 'Décore ton fantôme',
    hint: 'Astuce : touche le fantôme pour voir le suivant',
    previewAria: 'Ton fantôme. Touche-le pour passer au suivant',
    tabsAria: 'Parties du fantôme',
    tabs: { body: 'Corps', color: 'Couleur', eyes: 'Yeux', mouth: 'Bouche', cheeks: 'Joues', hat: 'Chapeau', item: 'Objet', bg: 'Décor' },
    optionAria: '{part} {n}',
    nameLabel: 'Nom de ton fantôme (facultatif)',
    namePlaceholder: 'ex. : Petit Bouh',
    random: 'Au hasard',
    done: 'Terminé !',
  },

  result: {
    eyebrowMine: 'Ton fantôme est prêt à hanter !',
    eyebrowFriend: 'Un ami a créé ce petit fantôme pour toi',
    untitled: 'Mon petit fantôme',
    imageAlt: 'Fantôme : {name}',
    save: 'Enregistrer l’image',
    saving: 'Création de l’image…',
    saved: 'Image enregistrée !',
    saveFail: 'Impossible de créer l’image. Fais plutôt une capture d’écran.',
    edit: 'Continuer à décorer',
    retry: 'Créer un autre fantôme',
    retryFriend: 'Créer mon fantôme',
    shareTitle: 'Créer son fantôme d’Halloween',
    shareText: 'Voici mon fantôme « {name} » 👻 Crée le tien !',
    shareTextNoName: 'J’ai créé mon petit fantôme 👻 Crée le tien !',
    fileName: 'mon-fantome',
  },

  og: {
    brand: '👻 Crée ton fantôme',
    defaultKicker: 'Fantôme d’Halloween',
    defaultTitle: 'Crée ton petit fantôme',
    defaultDesc: 'Frimousses, chapeaux et petits compagnons · gratuit',
  },

  faq: [
    { q: 'Comment créer mon fantôme ?', a: 'Choisis un onglet en haut de l’éditeur et touche l’option qui te plaît. Toucher le fantôme lui-même passe à l’option suivante de cet onglet, et « Au hasard » mélange tout. Touche « Terminé ! » quand il te plaît.' },
    { q: 'Puis-je enregistrer mon fantôme en image ?', a: 'Oui. « Enregistrer l’image » transforme ton fantôme en PNG. Sur un téléphone, tu peux le garder dans tes photos depuis le menu de partage ; sur un ordinateur, il se télécharge.' },
    { q: 'Comment fonctionne le lien de partage ?', a: 'Tout ton fantôme, nom compris, est rangé dans le lien lui-même. La personne qui l’ouvre voit exactement le même fantôme et peut ensuite créer le sien. Rien n’est stocké sur nos serveurs.' },
    { q: 'Pourquoi mon fantôme bouge-t-il de haut en bas ?', a: 'Parce que les fantômes flottent ! Ce petit mouvement n’existe qu’à l’écran. Si ton appareil est réglé pour réduire les animations, le fantôme reste immobile, et l’image enregistrée est toujours immobile.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Crée ton fantôme',
    description: 'Politique de confidentialité de Crée ton fantôme : traitement de ta création, cookies, publicités et statistiques anonymes.',
    h1: 'Politique de confidentialité',
    introHtml: 'Crée ton fantôme (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrites ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Votre fantôme et son nom ne sont jamais envoyés à un serveur : ils restent dans votre navigateur (et dans l’URL quand vous partagez). Certaines informations peuvent être collectées automatiquement lors de l’utilisation du Service, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies pour afficher des publicités et comprendre comment le Service est utilisé. Vous pouvez refuser ou supprimer les cookies dans les paramètres de votre navigateur ; certaines fonctionnalités peuvent alors ne pas fonctionner comme prévu.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des publicités basées sur vos visites précédentes. Vous pouvez en savoir plus et modifier vos préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, fantômes terminés, notes). Rien de tout cela ne vous identifie personnellement.'],
      ['5. Liens partagés et images', 'Les liens créés avec « Partager » contiennent votre création et le nom saisi, encodés dans l’URL. Les images enregistrées sont créées dans votre navigateur. Évitez de saisir comme nom des informations permettant de vous identifier.'],
      ['6. Contact', 'Pour toute question concernant cette politique, veuillez contacter l’opérateur du Service.'],
      ['7. Date d’entrée en vigueur', 'Cette politique est effective à partir du 1er octobre 2026.'],
    ],
    back: '← Retour à Crée ton fantôme',
  },
};
