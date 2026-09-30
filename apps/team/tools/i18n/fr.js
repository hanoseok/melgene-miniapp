/* Générateur d’équipes aléatoires — français (/fr/)
 * Même structure de clés que en.js. Espace fine insécable ( ) avant ? ! : ;
 */
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
    title: 'Générateur d’équipes aléatoires – Faire des équipes',
    description: 'Générateur d’équipes aléatoires : colle les prénoms, choisis le nombre d’équipes ou de joueurs par équipe et fais des équipes équilibrées. Capitaines séparés, résultat partageable. Gratuit, sans inscription.',
    ogTitle: 'Générateur d’équipes aléatoires 🎲 Faire des équipes',
    ogDescription: 'Colle les prénoms, mélange, et tes équipes sont prêtes en quelques secondes — résultat partageable tel quel.',
  },
  siteName: 'Générateur d’équipes',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🎲 Fini les disputes pour les équipes',
    h1Kicker: 'Générateur d’équipes aléatoires',
    h1Html: 'Qui sera<br>dans <em>ton équipe</em> ?',
    hook: 'Colle les prénoms, touche « mélanger » et laisse le hasard faire les équipes. Sans discussion.',
    facts: 'Jusqu’à 60 prénoms · capitaines séparés · résultat partageable',
    start: 'Faire les équipes →',
  },

  input: {
    title: 'Qui joue ?',
    namesLabel: 'Prénoms',
    namesHint: 'Un par ligne ou séparés par des virgules. Mets * devant un capitaine.',
    placeholder: 'Léa\nHugo\n*Chloé\nLucas, Manon, Louis',
    sample: 'Prénoms d’exemple',
    clear: 'Effacer',
    tooMany: 'Seuls les {max} premiers prénoms sont utilisés.',
    needMore: 'Ajoute au moins 2 prénoms.',
    modeLabel: 'Répartir par',
    modeTeams: 'Nombre d’équipes',
    modeSize: 'Joueurs par équipe',
    minus: 'Moins',
    plus: 'Plus',
    previewEq: '{k} équipes × {size}',
    previewRange: '{k} équipes × {min}–{max}',
    leaders: 'Capitaines (*) dans des équipes différentes',
    leadersCount: 'Capitaines marqués : {n}',
    leadersNone: 'Mets * devant un prénom pour en faire un capitaine',
    shuffle: 'Mélanger les équipes 🎲',
  },

  result: {
    shuffling: 'On mélange…',
    title: 'Les équipes',
    sharedTitle: 'Équipes partagées',
    sharedNote: 'Quelqu’un t’a partagé ces équipes.',
    captain: 'Capitaine',
    rename: 'Autres noms d’équipe',
    again: 'Remélanger',
    edit: 'Modifier les prénoms',
    copy: 'Copier en texte',
    copied: 'Équipes copiées !',
    makeOwn: 'Faire mes équipes',
    badShare: 'Ce lien ne marche pas — fais tes propres équipes ici.',
    shareTitle: 'Générateur d’équipes aléatoires – Faire des équipes',
    shareText: 'Voici nos {k} équipes tirées au sort 🎲',
  },

  people: { one: '{n} personne', other: '{n} personnes' },

  teams: {
    tiger: 'Les Tigres',
    eagle: 'Les Aigles',
    shark: 'Les Requins',
    wolf: 'Les Loups',
    fox: 'Les Renards',
    panda: 'Les Pandas',
    lion: 'Les Lions',
    owl: 'Les Hiboux',
    dolphin: 'Les Dauphins',
    bear: 'Les Ours',
    rabbit: 'Les Lapins',
    penguin: 'Les Pingouins',
    dragon: 'Les Dragons',
    unicorn: 'Les Licornes',
    octopus: 'Les Pieuvres',
    frog: 'Les Grenouilles',
    koala: 'Les Koalas',
    parrot: 'Les Perroquets',
    bee: 'Les Abeilles',
    turtle: 'Les Tortues',
  },

  sample: ['Léa', 'Hugo', 'Chloé', 'Lucas', 'Manon', 'Louis', 'Camille', 'Jules', 'Inès', 'Arthur', 'Zoé', 'Nathan'],

  og: {
    brand: '🎲 Générateur d’équipes',
    kicker: 'Des prénoms · des équipes',
    title: 'Qui sera dans ton équipe ?',
    desc: 'Équipes équitables en quelques secondes · capitaines séparés · résultat partageable',
  },

  faq: [
    { q: 'Comment répartir des prénoms en équipes ?', a: 'Tape ou colle les prénoms, un par ligne ou séparés par des virgules (60 maximum). Choisis le nombre d’équipes ou le nombre de joueurs par équipe, puis touche « Mélanger ». Les équipes n’ont jamais plus d’une personne d’écart.' },
    { q: 'Le tirage est-il vraiment équitable ?', a: 'Oui. Les prénoms sont mélangés avec le générateur aléatoire cryptographique de ton navigateur (crypto.getRandomValues) et un mélange de Fisher–Yates : chaque répartition possible a exactement la même chance. Ni nous ni personne ne peut orienter le résultat.' },
    { q: 'Comment marchent les capitaines ?', a: 'Mets * devant un prénom pour en faire un capitaine et active « Capitaines dans des équipes différentes ». Les capitaines sont placés d’abord, un par équipe, puis tous les autres sont mélangés. S’il y a plus de capitaines que d’équipes, certaines en ont deux.' },
    { q: 'Que contient le lien de partage ?', a: 'Le lien contient lui-même les prénoms et les équipes exactes, donc la personne qui l’ouvre voit le même résultat. Rien n’est enregistré sur notre serveur. Ta dernière liste reste seulement dans ce navigateur pour t’éviter de la retaper.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Générateur d’équipes',
    description: 'Politique de confidentialité du Générateur d’équipes aléatoires : prénoms traités dans le navigateur, cookies, publicité et statistiques.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le Générateur d’équipes aléatoires (le « Service ») respecte votre vie privée et ne traite que les informations minimales décrites ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service fonctionne sans compte ni connexion. Les prénoms saisis sont traités uniquement dans votre navigateur et ne sont pas envoyés à notre serveur. Si vous partagez un résultat, les prénoms et les équipes sont inscrits dans le lien lui-même : toute personne qui a le lien peut les voir. Certaines informations peuvent être collectées automatiquement, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et votre dernière liste de prénoms, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les paramètres de votre navigateur ; certaines fonctions pourraient alors ne pas marcher correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces basées sur vos visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier vos préférences, consultez les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, mélanges, notes). Rien de tout cela ne vous identifie personnellement.'],
      ['5. Contact', 'Pour toute question sur cette politique, contactez l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique est en vigueur depuis le 1er octobre 2026.'],
    ],
    back: '← Retour au Générateur d’équipes',
  },
};
