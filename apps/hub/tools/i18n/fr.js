/* Portail Melgene Apps (hub) — français (/fr/).
 * privacy.introHtml et le corps de privacy.sections sont en HTML ; le reste est du texte brut.
 * ui est utilisé par script.js et intégré à la page sous window.PAGE_I18N.
 * Pas de spoilers : les textes de la sélection décrivent l’ambiance de chaque appli, jamais ses vraies questions ni ses résultats.
 * Typographie : espace insécable ( ) avant ? ! : et à l’intérieur des guillemets « ». */
module.exports = {
  siteName: 'Melgene Apps',
  // 머리글 워드마크: 'Melgene' + 작은 배지 (공통 STRINGS.fr.brandBadge 와 같아야 한다)
  brand: { word: 'Melgene', badge: 'Apps' },
  typography: { display: "'Gabarito', var(--font-sans)" },
  meta: {
    title: 'Mini-jeux gratuits et tests de personnalité | Melgene Apps',
    description:
      'Mini-jeux gratuits et tests de personnalité à faire en une minute, directement dans le navigateur : sans téléchargement ni inscription.',
    ogTitle: 'Melgene Apps : mini-jeux gratuits et tests de personnalité',
    ogDescription: 'Mini-jeux, tests psycho et créations. Sans téléchargement ni inscription : touchez et jouez en une minute.',
  },
  homeAria: 'Accueil Melgene Apps',
  h1: 'Mini-jeux gratuits et tests de personnalité',
  curation: {
    h2: 'Mini-apps du jour',
    items: [
      {
        id: 'merge',
        kicker: 'Jeu rapide',
        headline: 'Lâche, fusionne, grandis',
        blurb: 'Deux objets identiques fusionnent en plus gros. Ne déborde pas !',
      },
      {
        id: 'costume',
        kicker: 'Test de personnalité',
        headline: 'En quoi te déguiser cette année ?',
        blurb: 'Réponds à quelques situations et découvre ton costume idéal.',
      },
      {
        id: 'ghost',
        kicker: 'À toi de créer',
        headline: 'Crée ton propre petit fantôme',
        blurb: 'Choisis une forme, un visage, un chapeau, puis enregistre-le.',
      },
      {
        id: 'team',
        kicker: 'Faire des équipes',
        headline: 'Des équipes au hasard, équitables',
        blurb: 'Tape les prénoms, choisis le nombre d’équipes et mélange.',
      },
      {
        id: 'candy-catch',
        kicker: 'Jeu d’Halloween en 1 min',
        headline: 'Attrape les bonbons qui tombent !',
        blurb: 'Évite les araignées, ramasse les douceurs et vise le meilleur score.',
      },
      {
        id: 'aura',
        kicker: 'Test de personnalité',
        headline: 'De quelle couleur est ton aura ?',
        blurb: 'Quelques situations du quotidien révèlent ta couleur.',
      },
    ],
  },
  browse: {
    h2: 'Toutes les mini-apps',
    searchLabel: 'Rechercher une mini-app',
    searchPlaceholder: 'Rechercher une mini-app',
    catLabel: 'Catégories',
    sortLabel: 'Trier par',
  },
  ui: {
    // « Tests psycho » = l’équivalent français des 심리테스트 / 心理テスト (quiz de personnalité).
    cats: { all: 'Tout', game: 'Jeux', test: 'Tests psycho', create: 'Créer', vote: 'Vote' },
    sorts: { popular: 'Populaires', rating: 'Mieux notées', newest: 'Nouveautés' },
    totalHtml: 'Déjà <strong>{n} parties</strong> jouées',
    play: 'Jouer',
    newBadge: 'NEW',
    plays: '{n} parties',
    ratingAria: 'Noté {avg} sur 5 ({votes} avis)',
    prev: 'Sélection précédente',
    next: 'Sélection suivante',
    goTo: 'Afficher la sélection {n}',
    count: '{n} apps',
    countOne: '1 app',
    emptyCat: 'Aucune mini-app dans cette catégorie pour le moment.',
    emptySearch: 'Aucune mini-app ne correspond à « {q} ». Essayez un autre mot ou affichez tout.',
    reset: 'Tout afficher',
  },
  faqTitle: 'Questions fréquentes',
  faq: [
    [
      'Melgene Apps, c’est quoi ?',
      'Une collection gratuite de mini-apps : des mini-jeux rapides, des tests de personnalité et des applis qui transforment quelques réponses en création bien à vous. Chacune se fait en une minute environ, directement dans le navigateur.',
    ],
    [
      'Faut-il télécharger quelque chose ou s’inscrire ?',
      'Non. Chaque mini-jeu et chaque test est une page web qui fonctionne sur mobile, tablette et ordinateur : envoyez le lien et vos amis peuvent jouer tout de suite. Si vous y jouez souvent, utilisez « Ajouter à l’écran d’accueil » dans le menu du navigateur.',
    ],
    [
      'Collectez-vous des données personnelles ?',
      'Non. Nous ne demandons jamais votre nom, votre e-mail ni votre numéro de téléphone. Les cœurs, les notes et le nombre de parties sont des totaux anonymes par appli, et un lien de partage ne contient que les réponses nécessaires pour afficher le résultat.',
    ],
    [
      'Ajoutez-vous souvent de nouvelles mini-apps ?',
      'Oui, nous ajoutons régulièrement des jeux et des tests psycho selon les tendances. Les nouveautés portent un badge NEW pendant deux semaines et apparaissent en premier avec le tri « Nouveautés ».',
    ],
  ],
  privacyLink: 'Politique de confidentialité',
  og: {
    h1Html: 'Mini-jeux gratuits<br>et tests psycho',
    tag: 'Sans téléchargement. Sans inscription. On joue.',
  },
  privacy: {
    title: 'Politique de confidentialité | Melgene Apps',
    description:
      'Politique de confidentialité de Melgene Apps : publicité (Google AdSense), compteurs anonymes de parties, cœurs et notes, cookies et stockage du navigateur.',
    h1: 'Politique de confidentialité',
    introHtml:
      'Melgene Apps (le « Service ») est une collection de mini-apps utilisables sans compte. Nous respectons votre vie privée et ne traitons que le minimum d’informations nécessaire au fonctionnement du Service, comme décrit ci-dessous.',
    sections: [
      [
        '1. Les informations que nous ne collectons pas',
        'Le Service ne demande ni ne collecte aucune donnée personnelle comme votre nom, votre e-mail, votre numéro de téléphone ou un compte. Ce que vous saisissez dans chaque mini-app est traité par défaut dans votre propre navigateur.',
      ],
      [
        '2. Compteurs anonymes : parties, cœurs et notes (Supabase)',
        'Pour afficher le nombre de parties, les cœurs et les notes, nous enregistrons uniquement les éléments suivants dans Supabase (un service de base de données) : des totaux cumulés par mini-app (parties et cœurs), les notes (1 à 5 étoiles) par mini-app, et des totaux quotidiens par date, mini-app et langue (pages vues, parties terminées, affichage ou non d’une publicité). Pour ne pas compter deux fois la même visite en moins de 30 secondes, le serveur conserve brièvement une empreinte (hachage à sens unique) de votre adresse IP et la supprime automatiquement, généralement sous 24 heures. Pour ne compter qu’une note par navigateur, votre navigateur conserve un identifiant aléatoire dont le serveur ne stocke qu’une empreinte. Lorsque vous créez un lien de partage, nous enregistrons uniquement les réponses nécessaires pour afficher ce résultat. Aucune de ces données ne sert à vous identifier.',
      ],
      [
        '3. Publicité (annonces automatiques Google AdSense)',
        'Le Service affiche des annonces via les annonces automatiques Google AdSense : c’est Google qui choisit leur emplacement. Google et ses partenaires peuvent utiliser des cookies pour afficher des annonces adaptées à vos centres d’intérêt. Vous pouvez consulter et modifier vos préférences dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.',
      ],
      [
        '4. Mesure d’audience (Google Analytics)',
        'Le Service peut utiliser Google Analytics (GA4) pour établir des statistiques de fréquentation et améliorer le Service. Ces données servent uniquement à des fins statistiques et ne permettent pas de vous identifier.',
      ],
      [
        '5. Cookies et stockage du navigateur',
        'Des réglages comme votre langue, la dernière catégorie et le dernier tri utilisés ou les notes que vous avez données sont enregistrés uniquement dans votre navigateur (localStorage, ainsi qu’un cookie qui retient votre langue). Vous pouvez supprimer ou bloquer les cookies et les données de site à tout moment dans les paramètres de votre navigateur.',
      ],
      ['6. Contact', 'Pour toute question sur cette politique de confidentialité, veuillez contacter l’éditeur du site.'],
      ['7. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 26 septembre 2026.'],
    ],
    back: '← Retour à Melgene Apps',
  },
};
