/* Tirage au sort de l’ordre de passage — français (/fr/). Même structure de clés que en.js (voir son en-tête).
 * Espace fine insécable ( ) avant ? ! : comme le veut la typographie française. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&display=swap',
    display: "'Bagel Fat One'",
    displayWeight: 400,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Tirage au sort de l’ordre de passage – liste aléatoire',
    description: 'Outil gratuit pour tirer au sort l’ordre de passage : collez des noms ou utilisez les numéros 1 à N, pour les exposés, les tours de jeu ou les corvées. Sans inscription.',
    ogTitle: 'Ordre de passage 🔢 Qui commence ?',
    ogDescription: 'Mélangez une liste de noms dans un ordre équitable, puis révélez-le carte par carte.',
  },
  siteName: 'Ordre de passage',
  privacyLink: 'Politique de confidentialité',

  hero: {
    h1Kicker: 'Tirage au sort de l’ordre de passage',
    h1Html: 'Qui passe <em>en premier ?</em>',
    hook: 'Écrivez les noms, mélangez une fois, et tout l’ordre est fixé, du premier au dernier.',
  },

  ui: {
    presetLabel: 'C’est l’ordre de quoi ?',
    modeLabel: 'Noms ou numéros',
    modeNames: 'Noms',
    modeNumbers: 'Numéros 1–N',
    namesLabel: 'Noms, un par ligne',
    namesPh: 'Léa\nHugo\nChloé\nLouis',
    namesHint: 'Collez une liste depuis WhatsApp ou un tableur. Les virgules séparent aussi.',
    namesCount: '{n} / {max}',
    clear: 'Effacer',
    numbersLabel: 'Combien ?',
    numbersDec: 'Un de moins',
    numbersInc: 'Un de plus',
    numbersHint: 'Mélange les numéros de 1 à N. Pratique avec les numéros de place ou d’appel.',
    numberItem: 'n° {n}',
    fromLabel: 'Révéler l’ordre',
    fromFirst: 'Du 1er',
    fromLast: 'Du dernier',
    shuffle: 'Tirer l’ordre au sort 🔀',
    fair: 'Mélangé une seule fois avec un hasard cryptographique · les noms restent dans votre navigateur',
  },

  presets: [
    { label: 'Ordre simple', heading: 'L’ordre tiré au sort' },
    { label: 'Exposés', heading: 'Ordre de passage des exposés' },
    { label: 'Tours de jeu', heading: 'Ordre des joueurs' },
    { label: 'Corvées', heading: 'Planning des corvées' },
  ],

  errors: {
    namesFew: 'Écrivez au moins 2 noms, un par ligne, ou passez aux numéros.',
    namesMany: 'Jusqu’à 40 noms maximum.',
    numbersRange: 'Choisissez un nombre entre 2 et 40.',
    badLink: 'Ce lien est cassé ou incomplet : rien ne peut en être affiché.',
  },

  reveal: {
    progress: '{k} sur {n} révélés',
    tapHint: 'Touchez la carte ou « Suivant ». L’ordre a été fixé au moment du mélange.',
    first: 'Révéler ▶',
    next: 'Suivant ▶',
    done: 'Voir tout l’ordre',
    auto: 'Lecture auto',
    autoStop: 'Pause',
    showAll: 'Tout afficher',
    soFar: 'Déjà révélés',
    live: 'Numéro {k} : {who}',
  },

  result: {
    sharedBadge: '🔢 Ordre partagé',
    sharedNote: 'C’est l’ordre enregistré dans le lien. Il n’a pas été remélangé.',
    summary: '{n} au total, du premier au dernier',
    copy: 'Copier en texte',
    copied: 'Ordre copié',
    copyLink: 'Copier le lien',
    linkCopied: 'Lien copié. Toute personne qui l’ouvre voit exactement cet ordre.',
    linkTooLong: 'La liste est trop longue pour un lien : seule l’adresse de la page a été copiée.',
    edit: 'Modifier les noms',
    again: 'Remélanger 🔀',
    againShared: 'Remélanger / À moi 🔀',
    textTitle: '🔢 {heading}',
    shareTitle: 'Ordre de passage',
    shareText: 'Voici notre ordre de passage, tiré au sort 🔢',
  },

  og: {
    brand: '🔢 Ordre de passage',
    kicker: 'Exposés · jeux · corvées',
    title: 'Qui commence ? Tirez l’ordre au sort',
    desc: 'Des noms en entrée, un ordre équitable en sortie',
  },

  faq: [
    { q: 'Le tirage est-il vraiment équitable ?', a: 'Oui. Au moment où vous mélangez, le générateur aléatoire cryptographique du navigateur (crypto.getRandomValues) fait un mélange de Fisher–Yates avec échantillonnage par rejet : chaque ordre possible a exactement la même probabilité. Tout l’ordre est fixé à cet instant, les cartes ne font que le montrer.' },
    { q: 'Quelle différence avec un tirage de gagnant ?', a: 'Un tirage de gagnant s’arrête à un seul nom. Ici, tout le monde reçoit une place du premier au dernier : c’est ce qu’il faut pour un ordre de passage, des tours de jeu, une liste de prise de parole ou un planning de corvées.' },
    { q: 'Révéler du premier ou du dernier ?', a: 'Du premier, c’est plus rapide quand chacun doit se préparer. Du dernier, c’est plus palpitant, car le premier n’est connu qu’à la toute fin.' },
    { q: 'Les noms sont-ils enregistrés ou envoyés ?', a: 'Non. Les noms restent dans votre navigateur. Votre dernière liste est gardée sur cet appareil pour la réutiliser, et un lien de partage ne transmet l’ordre qu’aux personnes à qui vous l’envoyez.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Ordre de passage',
    description: 'Politique de confidentialité de l’outil Ordre de passage : noms et ordres restent dans votre navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Ordre de passage (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Les noms ou numéros que vous saisissez et l’ordre obtenu sont traités uniquement dans votre navigateur et ne sont pas envoyés à notre serveur. Votre dernière liste est conservée dans le stockage local de votre navigateur, sur votre appareil. Quand vous copiez un lien, l’ordre est écrit dans le lien lui-même et n’est partagé qu’avec les personnes à qui vous l’envoyez.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local du navigateur pour mémoriser votre langue et vos réglages, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions risquent alors de ne pas marcher comme prévu.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon vos visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier vos préférences, consultez les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">Paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, tirages commencés et terminés). Rien de cela ne vous identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique, contactez l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique est en vigueur depuis le 15 novembre 2026.'],
    ],
    back: '← Retour à Ordre de passage',
  },
};
