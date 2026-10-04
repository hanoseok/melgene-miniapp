/* Générateur de pseudo — français (tu). words: par ambiance { adj, noun } (adjectifs 'masc/fém', noms '|m' '|f'). Voir en.js */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Générateur de pseudo – Idées de pseudos',
    description: 'Pas d’idée de pseudo\u202f? Choisis une ambiance (mignon, cool, drôle, rêveur), ajoute ton prénom si tu veux et obtiens un pseudo aléatoire en un clic. Relance jusqu’à ce qu’il te plaise, puis copie-le. Gratuit.',
    ogTitle: 'Générateur de pseudo ✨ Pseudos mignons et cool',
    ogDescription: 'Choisis une ambiance, ajoute ton prénom et copie ton pseudo en un clic.',
  },
  siteName: 'Générateur de pseudo',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🏷️ Plus d’idées de pseudo ?',
    h1Kicker: 'Générateur de pseudo',
    h1Html: 'Trouve le pseudo<br>qui est <em>vraiment toi</em>',
    hook: 'Choisis une ambiance, glisse ton prénom si tu veux, et reçois un pseudo fait pour toi.',
    facts: 'Mignon, cool, drôle, rêveur · mélange ton prénom · copie en un clic',
    start: 'Créer mon pseudo →',
  },

  make: {
    title: 'Quelle est ton ambiance ?',
    moodLabel: 'Choisis une ambiance',
    moods: { cute: 'Mignon', cool: 'Cool', funny: 'Drôle', dreamy: 'Rêveur', mystic: 'Mystérieux' },
    nameLabel: 'Ton prénom ou des lettres (facultatif)',
    nameHint: 'On le mélange au pseudo. 12 caractères max, il reste dans ton navigateur.',
    namePlaceholder: 'ex. Léa',
    numbers: '＋ Ajouter des chiffres',
    poolCount: 'Combinaisons pour cette ambiance : {n}+',
    make: 'Créer mon pseudo 🎲',
  },

  result: {
    title: 'Ton pseudo',
    copy: 'Copier le pseudo',
    copied: 'Copié !',
    copyFail: 'Copie impossible. Sélectionne le pseudo et copie-le à la main.',
    again: 'Un autre',
    change: 'Changer d’ambiance',
    shareTitle: 'Générateur de pseudo',
    shareText: 'Le générateur de pseudo m’a donné « {nick} » ✨',
  },

  style: { camel: true, order: 'noun-adj', nameSep: '_' },

  words: {
    cute: {
      adj: ['mignon/mignonne', 'doux/douce', 'minuscule', 'câlin/câline', 'pétillant/pétillante', 'moelleux/moelleuse', 'duveteux/duveteuse', 'sucré/sucrée', 'joyeux/joyeuse', 'rond/ronde', 'tendre', 'brillant/brillante'],
      noun: ['lapin|m', 'chaton|m', 'chiot|m', 'panda|m', 'mochi|m', 'guimauve|f', 'cupcake|m', 'caneton|m', 'pêche|f', 'praline|f', 'koala|m', 'brioche|f'],
    },
    cool: {
      adj: ['néon', 'turbo', 'silencieux/silencieuse', 'rapide', 'glacial/glaciale', 'atomique', 'sauvage', 'nocturne', 'chromé/chromée', 'royal/royale', 'électrique', 'flamboyant/flamboyante'],
      noun: ['loup|m', 'faucon|m', 'vipère|f', 'pilote|m', 'lame|f', 'tempête|f', 'tigre|m', 'comète|f', 'titan|m', 'aigle|m', 'bolide|m', 'ninja|m'],
    },
    funny: {
      adj: ['endormi/endormie', 'grincheux/grincheuse', 'bancal/bancale', 'maladroit/maladroite', 'sournois/sournoise', 'patapouf', 'détrempé/détrempée', 'déjanté/déjantée', 'farfelu/farfelue', 'paresseux/paresseuse', 'bougon/bougonne', 'gourmand/gourmande'],
      noun: ['patate|f', 'nouille|f', 'cornichon|m', 'gaufre|f', 'pingouin|m', 'lama|m', 'tartine|f', 'boulette|f', 'morse|m', 'croissant|m', 'gobelin|m', 'hamster|m'],
    },
    dreamy: {
      adj: ['étoilé/étoilée', 'nuageux/nuageuse', 'brumeux/brumeuse', 'velouté/veloutée', 'lunaire', 'pastel', 'flottant/flottante', 'lumineux/lumineuse', 'soyeux/soyeuse', 'vaporeux/vaporeuse', 'doré/dorée', 'serein/sereine'],
      noun: ['lune|f', 'nuage|m', 'aurore|f', 'étoile|f', 'berceuse|f', 'horizon|m', 'pétale|m', 'galaxie|f', 'murmure|m', 'rêverie|f', 'aube|f', 'prairie|f'],
    },
    mystic: {
      adj: ['spectral/spectrale', 'cryptique', 'voilé/voilée', 'fantôme', 'obsidienne', 'crépusculaire', 'hanté/hantée', 'caché/cachée', 'oublié/oubliée', 'maléfique', 'cendré/cendrée', 'arcane'],
      noun: ['corbeau|m', 'spectre|m', 'oracle|m', 'énigme|f', 'code|m', 'ombre|f', 'sphinx|m', 'relique|f', 'rune|f', 'braise|f', 'minuit|m', 'mystère|m'],
    },
  },

  og: {
    brand: '🏷️ Générateur de pseudo',
    kicker: 'Une ambiance · un pseudo',
    title: 'Trouve le pseudo qui est vraiment toi',
    desc: 'Mignon, cool, drôle, rêveur · mélange ton prénom · copie en un clic',
  },

  faq: [
    { q: 'Comment fonctionne le générateur de pseudo ?', a: 'Choisis une ambiance, tape si tu veux ton prénom ou quelques lettres, puis appuie sur créer. L’outil associe un nom et un adjectif tirés de la liste de cette ambiance, et mélange tes lettres si tu en as mis.' },
    { q: 'Le pseudo est-il vraiment aléatoire ?', a: 'Oui. Les mots sont tirés avec le générateur aléatoire cryptographique de ton navigateur (crypto.getRandomValues), donc chaque mot de la liste a la même chance de sortir. Le défilement avant le résultat n’est qu’un effet visuel.' },
    { q: 'Puis-je y mettre mon prénom ?', a: 'Oui, jusqu’à 12 caractères : prénom, initiales ou lettres de ton choix. Ce que tu écris reste dans ton navigateur, n’est envoyé nulle part et n’est pas enregistré.' },
    { q: 'Quelqu’un d’autre peut-il avoir le même pseudo ?', a: 'C’est possible, car chaque ambiance compte des centaines de combinaisons. Si un jeu ou un service indique que le pseudo est déjà pris, génères-en un autre ou active « Ajouter des chiffres ».' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Générateur de pseudo',
    description: 'Politique de confidentialité du Générateur de pseudo : le prénom saisi reste dans ton navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le Générateur de pseudo (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Le prénom ou les lettres que tu saisis et l’ambiance choisie sont traités uniquement dans ton navigateur et ne sont pas envoyés à notre serveur. Certaines informations peuvent toutefois être collectées automatiquement pendant l’utilisation, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour mémoriser ta langue et ta dernière ambiance, afficher des publicités et comprendre l’usage du Service. Tu peux les refuser ou les supprimer dans les paramètres de ton navigateur ; certaines fonctions pourraient alors ne plus fonctionner correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de tes visites précédentes sur ce site et d’autres. Tu peux en savoir plus et modifier tes préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés, qui ne conservent que des totaux quotidiens par langue (pages vues, pseudos créés, notes). Rien de tout cela ne permet de t’identifier.'],
      ['5. Contact', 'Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 5 octobre 2026.'],
    ],
    back: '← Retour au Générateur de pseudo',
  },
};
