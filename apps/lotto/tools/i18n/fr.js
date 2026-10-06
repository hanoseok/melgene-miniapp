/* Générateur de loto — fr. 키 구조는 en.js 와 같다. */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual'
  },
  meta: {
    title: 'Générateur de loto : numéros aléatoires',
    description: 'Besoin de numéros chance ? Choisis le 6/45 coréen, un 5/50 + 2 étoiles façon Euro, le Powerball américain ou ta propre plage, fixe ou exclus des numéros et tire jusqu’à cinq grilles. Pour le plaisir, sans inscription.',
    ogTitle: 'Générateur de loto 🎱 Numéros aléatoires',
    ogDescription: 'Tire tes numéros chance pour le plaisir, jusqu’à cinq grilles.'
  },
  siteName: 'Générateur de loto',
  privacyLink: 'Confidentialité',
  start: {
    badge: '🎱 Juste pour le plaisir',
    h1Kicker: 'Générateur de loto',
    h1Html: 'Un coup de <em>chance</em> ?<br>Tire tes numéros',
    hook: 'Choisis un jeu, fixe ou écarte quelques numéros et regarde les boules rouler. Jusqu’à cinq grilles d’un coup.',
    facts: 'Corée · façon Euro · Powerball · personnalisé · pour s’amuser',
    start: 'Tirer les numéros →'
  },
  tool: {
    title: 'Règle ton tirage',
    presetLabel: 'Quel jeu ?',
    presets: {
      kr: 'Corée 6/45',
      euro: 'Façon Euro 5/50 + 2',
      us: 'Powerball US',
      custom: 'Perso'
    },
    presetInfo: {
      kr: '6 numéros de 1 à 45',
      euro: '5 numéros de 1 à 50 + 2 étoiles de 1 à 12',
      us: '5 numéros de 1 à 69 + 1 Powerball de 1 à 26',
      custom: 'Choisis le nombre de numéros et le plus grand'
    },
    pickLabel: 'Numéros à tirer',
    maxLabel: 'Plus grand numéro',
    gamesLabel: 'Combien de grilles ?',
    fixedLabel: 'Numéros à garder (facultatif)',
    fixedHint: 'Toujours présents dans chaque grille, par ex. 7, 21',
    fixedPh: '7, 21',
    excludeLabel: 'Numéros à exclure (facultatif)',
    excludeHint: 'Jamais tirés, par ex. 4, 13',
    excludePh: '4, 13',
    draw: 'Tirer les boules 🎱',
    drawing: 'Tirage en cours…',
    machine: 'Les boules tournent dans la machine de tirage',
    note: 'Pour le plaisir uniquement. Toutes les combinaisons ont la même probabilité et cet outil ne prédit rien ni n’augmente tes chances de gagner.',
    errors: {
      bad: 'Saisis des nombres entiers de 1 à {max}, séparés par des virgules.',
      overlap: 'Un numéro ne peut pas être gardé et exclu à la fois.',
      tooMany: 'Tu peux garder au maximum {pick} numéros.',
      notEnough: 'Trop de numéros exclus pour en tirer {pick}.'
    }
  },
  result: {
    title: 'Tes numéros chance',
    game: 'Grille {n}',
    extraNames: {
      euro: 'Étoiles',
      us: 'Powerball'
    },
    copy: 'Copier les numéros 📋',
    copied: 'Numéros copiés !',
    again: 'Tirer à nouveau',
    change: 'Retour aux réglages',
    disclaimer: 'Pour le plaisir uniquement. Aucune prédiction, aucune promesse de gain.',
    shareTitle: 'Générateur de loto',
    shareText: 'Mes numéros chance 🎱\n{numbers}'
  },
  og: {
    brand: '🎱 Générateur de loto',
    kicker: 'Numéros aléatoires · pour le plaisir',
    title: 'Un coup de chance ?',
    desc: 'Choisis un jeu et tire jusqu’à cinq grilles'
  },
  faq: [
    {
      q: 'Comment tirer mes numéros ?',
      a: 'Choisis un jeu (6/45 coréen, façon Euro, Powerball américain ou ta propre plage), puis le nombre de grilles de une à cinq, et appuie sur le bouton de tirage. Les numéros sont tirés d’abord, les boules sortent une à une, puis chaque grille s’affiche triée.'
    },
    {
      q: 'Les numéros sont-ils vraiment aléatoires ?',
      a: 'Oui. Ils viennent du générateur aléatoire cryptographique de ton navigateur (crypto.getRandomValues) avec un échantillonnage par rejet, donc chaque numéro autorisé a exactement la même probabilité, sans biais. L’animation des boules n’est qu’un effet visuel.'
    },
    {
      q: 'À quoi servent les numéros à garder et à exclure ?',
      a: 'Les numéros gardés figurent dans chaque grille et les autres sont tirés autour d’eux. Les numéros exclus ne sortent jamais. Cela ne concerne que les numéros principaux, pas les étoiles ni le Powerball.'
    },
    {
      q: 'Est-ce que cela augmente mes chances de gagner ?',
      a: 'Non. Dans un vrai tirage, toutes les combinaisons ont la même probabilité et aucun outil ne peut prédire le résultat. Ce générateur sert juste à choisir des numéros pour s’amuser et ne promet aucun gain.'
    }
  ],
  privacy: {
    title: 'Politique de confidentialité | Générateur de loto',
    description: 'Politique de confidentialité du Générateur de loto : les numéros saisis restent dans ton navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Générateur de loto (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.',
    sections: [
      [
        '1. Informations collectées',
        'Le Service fonctionne sans compte ni connexion. Les numéros que tu saisis et tes tirages sont traités uniquement dans ton navigateur et ne sont pas envoyés à notre serveur. Certaines informations peuvent toutefois être collectées automatiquement pendant l’utilisation, comme indiqué ci-dessous.'
      ],
      [
        '2. Cookies et technologies similaires',
        'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour mémoriser ta langue, afficher des publicités et comprendre comment il est utilisé. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de ne plus marcher correctement.'
      ],
      [
        '3. Publicité (Google AdSense)',
        'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon tes visites précédentes sur ce site et d’autres. Tu peux en savoir plus et modifier tes préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'
      ],
      [
        '4. Statistiques',
        'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, tirages, notes). Rien de tout cela ne t’identifie personnellement.'
      ],
      [
        '5. Contact',
        'Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site.'
      ],
      [
        '6. Date d’entrée en vigueur',
        'Cette politique est en vigueur depuis le 7 octobre 2026.'
      ]
    ],
    back: '← Retour au Générateur de loto'
  }
};
