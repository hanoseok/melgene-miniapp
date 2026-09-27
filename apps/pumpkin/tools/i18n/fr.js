/* Sculpter une citrouille d’Halloween en ligne — français (/fr/)
 * Même structure de clés que en.js. Les dessins et le nombre de pièces sont dans pumpkin-core.js.
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
    title: 'Sculpter une citrouille d’Halloween en ligne',
    description: 'Sculpter une citrouille d’Halloween en ligne : choisis les yeux, le nez et la bouche, allume la bougie et crée ta lanterne. Gratuit, sans téléchargement.',
    ogTitle: 'Sculpter une citrouille d’Halloween en ligne 🎃',
    ogDescription: 'Crée ta citrouille d’Halloween en une minute, allume la bougie et envoie-la à un ami.',
  },
  siteName: 'Citrouille d’Halloween',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🎃 Spécial Halloween',
    h1Kicker: 'Sculpter une citrouille',
    h1Html: 'Crée ta<br><em>citrouille</em> d’Halloween',
    hook: 'Pas de couteau, pas de dégâts. Donne un visage à ta citrouille, allume la bougie et regarde-la briller.',
    start: 'Commencer à sculpter →',
  },

  editor: {
    title: 'Sculpte ta citrouille',
    hint: 'Astuce : touche la citrouille pour essayer la suivante',
    previewAria: 'Ta citrouille. Touche-la pour essayer l’option suivante',
    tabsAria: 'Parties de la citrouille',
    tabs: { shape: 'Forme', color: 'Couleur', eyes: 'Yeux', nose: 'Nez', mouth: 'Bouche', stem: 'Tige', extra: 'Déco' },
    optionAria: '{part} {n}',
    glow: 'Bougie',
    night: 'Nuit',
    nameLabel: 'Nom de ta citrouille (facultatif)',
    namePlaceholder: 'ex. : Jack le Rigolo',
    random: 'Au hasard',
    done: 'Terminé !',
  },

  result: {
    eyebrowMine: 'Ta citrouille d’Halloween est prête !',
    eyebrowFriend: 'Un ami a sculpté cette citrouille pour toi',
    untitled: 'Ma citrouille',
    imageAlt: 'Citrouille d’Halloween : {name}',
    save: 'Enregistrer l’image',
    saving: 'Création de l’image…',
    saved: 'Image enregistrée !',
    saveFail: 'Impossible de créer l’image. Fais plutôt une capture d’écran.',
    edit: 'Continuer à modifier',
    retry: 'Sculpter une autre citrouille',
    retryFriend: 'Sculpter ma citrouille',
    shareTitle: 'Sculpter une citrouille d’Halloween en ligne',
    shareText: 'J’ai sculpté une citrouille d’Halloween nommée « {name} » 🎃 Sculpte la tienne !',
    shareTextNoName: 'J’ai sculpté ma citrouille d’Halloween 🎃 Sculpte la tienne !',
    fileName: 'ma-citrouille',
  },

  og: {
    brand: '🎃 Citrouille d’Halloween',
    defaultKicker: 'Sculpter une citrouille en ligne',
    defaultTitle: 'Crée ta citrouille d’Halloween',
    defaultDesc: 'Yeux, nez, bouche et bougie · gratuit dans ton navigateur',
  },

  faq: [
    { q: 'Comment sculpter ma citrouille ?', a: 'Choisis un onglet (forme, couleur, yeux, nez, bouche, tige ou déco) et touche une option. Toucher la citrouille passe à l’option suivante, et « Au hasard » mélange tout. Quand elle te plaît, touche « Terminé ! ».' },
    { q: 'Puis-je enregistrer ma citrouille en image ?', a: 'Oui. « Enregistrer l’image » crée un fichier PNG. Sur téléphone, tu peux la garder dans tes photos depuis le menu de partage ; sur ordinateur, elle se télécharge.' },
    { q: 'Comment fonctionne le lien de partage ?', a: 'Toute ta création, nom compris, est enregistrée dans le lien lui-même. La personne qui l’ouvre voit exactement la même citrouille et peut ensuite créer la sienne. Rien n’est stocké sur nos serveurs.' },
    { q: 'À quoi servent les boutons Bougie et Nuit ?', a: 'La bougie illumine les parties sculptées d’une lueur chaude, comme une vraie bougie à l’intérieur. Éteins-la pour un look de jour. Le bouton Nuit alterne entre un ciel étoilé et un fond clair.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Citrouille d’Halloween',
    description: 'Politique de confidentialité de Citrouille d’Halloween : traitement de ta création, cookies, publicités et statistiques anonymes.',
    h1: 'Politique de confidentialité',
    introHtml: 'Citrouille d’Halloween (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrites ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Votre citrouille et son nom ne sont jamais envoyés à un serveur : ils restent dans votre navigateur (et dans l’URL quand vous partagez). Certaines informations peuvent être collectées automatiquement lors de l’utilisation du Service, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies pour afficher des publicités et comprendre comment le Service est utilisé. Vous pouvez refuser ou supprimer les cookies dans les paramètres de votre navigateur ; certaines fonctionnalités peuvent alors ne pas fonctionner comme prévu.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des publicités basées sur vos visites précédentes. Vous pouvez en savoir plus et modifier vos préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, citrouilles terminées, notes). Rien de tout cela ne vous identifie personnellement.'],
      ['5. Liens partagés et images', 'Les liens créés avec « Partager » contiennent votre création et le nom saisi, encodés dans l’URL. Les images enregistrées sont créées dans votre navigateur. Évitez de saisir comme nom des informations permettant de vous identifier.'],
      ['6. Contact', 'Pour toute question concernant cette politique, veuillez contacter l’opérateur du Service.'],
      ['7. Date d’entrée en vigueur', 'Cette politique est effective à partir du 28 septembre 2026.'],
    ],
    back: '← Retour à Citrouille d’Halloween',
  },
};
