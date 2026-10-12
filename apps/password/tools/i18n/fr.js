/* Générateur de mot de passe — français (/fr/)
 *   = espace fine insécable avant ? ! : ; (typographie française).
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap',
    display: "'Montserrat'",
    displayWeight: 800,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Générateur de mot de passe – fort et aléatoire',
    description: 'Générateur de mot de passe gratuit : crée des mots de passe aléatoires forts (4 à 64 caractères) ou des phrases de passe faciles à retenir, avec l’entropie réelle et le temps pour les casser.',
    ogTitle: 'Générateur de mot de passe 🔑 fort, aléatoire, privé',
    ogDescription: 'Mots de passe et phrases de passe aléatoires, avec une force honnête en bits. Créés sur ton appareil, jamais envoyés.',
  },
  siteName: 'Générateur de mot de passe',
  privacyLink: 'Confidentialité',

  hero: {
    h1Kicker: 'Générateur de mot de passe',
    h1Html: 'Des mots de passe solides,<br><em>créés ici même</em>',
    hook: 'Choisis la longueur et les types de caractères, ou passe à une phrase de passe faite de mots au hasard. Un tap pour créer, un tap pour copier.',
  },

  ui: {
    modeLabel: 'Que créer ?',
    modePassword: 'Mot de passe',
    modePassphrase: 'Phrase de passe',
    lengthLabel: 'Longueur',
    typesLabel: 'Caractères à utiliser',
    upper: 'Majuscules',
    lower: 'Minuscules',
    digits: 'Chiffres',
    symbols: 'Symboles',
    similar: 'Sans sosies',
    similarHint: 'Exclut 0 O 1 l I pour un mot de passe plus facile à lire et à taper.',
    wordsLabel: 'Mots',
    sepLabel: 'Séparateur',
    sep: { dash: 'Tiret', dot: 'Point', underscore: 'Tiret bas', space: 'Espace' },
    capitalize: 'Majuscule initiale',
    addNumber: 'Ajouter un chiffre',
    wordsHint: 'Les mots viennent d’une liste intégrée de 2 048 mots anglais.',
    countLabel: 'Combien',
    countOne: 'Un seul',
    countFive: 'Cinq d’un coup',
    generate: 'Générer 🔑',
    generating: 'Création…',
    local: 'Créé sur ton appareil avec crypto.getRandomValues · jamais envoyé',
    needType: 'Choisis au moins un type de caractère.',
  },

  result: {
    heading: 'Ton mot de passe',
    headingMany: 'Tes mots de passe',
    headingPhrase: 'Ta phrase de passe',
    headingPhrases: 'Tes phrases de passe',
    copy: 'Copier',
    copyAria: 'Copier le numéro {n}',
    copied: 'Copié dans le presse-papiers',
    copyFail: 'Copie impossible. Sélectionne le texte et copie-le toi-même.',
    strengthLabel: 'Force',
    strength: { weak: 'Faible', fair: 'Moyen', strong: 'Fort', veryStrong: 'Très fort' },
    bits: '{bits} bits d’entropie',
    crack: 'Temps pour le casser : {time}',
    crackInstant: 'moins d’une seconde',
    crackForever: 'plus que l’âge de l’Univers',
    crackNote: 'Moyenne pour une attaque hors ligne à 10 milliards d’essais par seconde.',
    tips: {
      weak: 'Bien trop facile à deviner. Allonge-le ou ajoute des types de caractères.',
      fair: 'Correct pour un compte sans enjeu. Ajoute quelques caractères pour le reste.',
      strong: 'Bien pour la plupart des comptes. Range-le dans un gestionnaire de mots de passe.',
      veryStrong: 'Excellent. Garde-le pour un seul compte et active aussi la double authentification.',
    },
    again: 'En générer d’autres',
    live: 'Nouveau résultat prêt. Force : {label}.',
    shareTitle: 'Générateur de mot de passe',
    shareText: 'Crée des mots de passe aléatoires solides directement dans ton navigateur. Rien n’est envoyé 🔑',
  },

  og: {
    brand: '🔑 Générateur de mot de passe',
    kicker: 'Mots de passe · phrases de passe · vraie force',
    title: 'Des mots de passe forts en un tap',
    desc: 'Créés sur ton appareil, jamais envoyés',
  },

  faq: [
    { q: 'Un générateur de mot de passe en ligne, c’est sûr ?', a: 'Celui-ci n’envoie rien. Chaque mot de passe est créé sur ton appareil par le générateur aléatoire cryptographique du navigateur (crypto.getRandomValues). Il n’est ni enregistré, ni journalisé, ni placé dans l’adresse de la page. Ferme l’onglet et il disparaît.' },
    { q: 'Quelle longueur choisir ?', a: 'Pour un compte important, vise 16 caractères aléatoires ou une phrase de passe de 5 à 6 mots. En bits, la jauge doit afficher au moins 60, et 80 ou plus pour ta messagerie, ta banque et ton gestionnaire de mots de passe.' },
    { q: 'C’est quoi une phrase de passe ? Est-ce aussi solide ?', a: 'Quelques mots tirés au hasard et collés ensemble, comme une petite phrase absurde. Chaque mot de la liste de 2 048 apporte 11 bits : six mots battent la plupart des mots de passe de 10 caractères, tout en étant bien plus simples à taper et à retenir.' },
    { q: 'Comment le temps pour le casser est-il calculé ?', a: 'C’est le temps moyen pour trouver le mot de passe en testant toutes les combinaisons à 10 milliards d’essais par seconde, une attaque hors ligne rapide. On suppose que l’attaquant connaît tes réglages : c’est une estimation honnête, pas flatteuse.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Générateur de mot de passe',
    description: 'Politique de confidentialité du Générateur de mot de passe : les mots de passe restent dans ton navigateur ; cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le Générateur de mot de passe (le « Service ») respecte ta vie privée et ne traite que les informations minimales décrites ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Les mots de passe et phrases de passe sont générés uniquement dans ton navigateur, avec son générateur aléatoire cryptographique intégré. Ils ne sont jamais envoyés à notre serveur ni à aucun autre, jamais enregistrés dans le stockage du navigateur et jamais écrits dans l’adresse de la page ou dans un lien de partage. Quand tu en copies un, il va seulement dans le presse-papiers de ton appareil.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local du navigateur pour mémoriser ta langue, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions peuvent alors ne pas marcher comme prévu.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon tes visites sur ce site et d’autres. Tu peux en savoir plus et modifier tes préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, générations, notes). Ces compteurs ne contiennent jamais les mots de passe eux-mêmes et rien ne permet de t’identifier.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique s’applique à partir du 13 octobre 2026.'],
    ],
    back: '← Retour au Générateur de mot de passe',
  },
};
