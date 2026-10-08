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
        id: 'brick',
        kicker: 'Classique d’arcade',
        headline: 'Une balle contre un mur néon',
        blurb: 'Renvoie-la avec ta raquette et casse tout. 3 vies, ça accélère.',
      },
      {
        id: 'mentalage',
        kicker: 'Test de personnalité',
        headline: 'Quel âge a ton esprit ?',
        blurb: '12 questions du quotidien, 2 minutes. Ton âge mental au chiffre près.',
      },
      {
        id: 'fancytext',
        kicker: 'À créer',
        headline: 'Donne du style à ton texte',
        blurb: 'Transforme ton texte en polices stylées et copie-le en un clic.',
      },
      {
        id: 'mole',
        kicker: 'Jeu de réflexes',
        headline: 'Tape les taupes, évite les bombes',
        blurb: 'Tape-les avant qu’elles se cachent. 30 secondes, un titre.',
      },
      {
        id: 'nickname',
        kicker: 'À créer',
        headline: 'Un pseudo qui te ressemble',
        blurb: 'Choisis une ambiance et obtiens un pseudo en un clic.',
      },
      {
        id: 'coinflip',
        kicker: 'Indécis ?',
        headline: 'Pile ou face, ou un dé',
        blurb: 'Une pièce ou jusqu\'à trois dés, toujours équitable.',
      },
      {
        id: 'lotto',
        kicker: 'Un coup de chance ?',
        headline: 'Numéros de loto au hasard',
        blurb: 'Choisis un jeu et tire jusqu\'à cinq grilles.',
      },
      {
        id: 'invite',
        kicker: 'À faire soi-même',
        headline: 'Crée ton invitation Halloween',
        blurb: 'Ajoute les infos, choisis un thème, puis enregistre ou partage.',
      },
      {
        id: 'lunch',
        kicker: 'Pas d’idée ?',
        headline: 'Fais tourner les rouleaux du repas',
        blurb: 'Choisis un repas et une humeur, le jackpot tranche.',
      },
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
        id: 'lovestyle',
        kicker: 'Test de personnalité',
        headline: 'Quel genre de partenaire es-tu ?',
        blurb: 'Dix petits moments à deux pour découvrir ta façon d’aimer.',
      },
      {
        id: 'animal',
        kicker: 'Test de personnalité',
        headline: 'Quel animal es-tu ?',
        blurb: 'Huit moments du quotidien, deux minutes. Rencontre ton côté sauvage.',
      },
      {
        id: 'game2048',
        kicker: 'Jeu de réflexion',
        headline: 'Glisse, fusionne, atteins 2048',
        blurb: 'Assemble les nombres identiques. Le puzzle culte, version Halloween.',
      },
      {
        id: 'aura',
        kicker: 'Test de personnalité',
        headline: 'De quelle couleur est ton aura ?',
        blurb: 'Réponds à quelques moments du quotidien et découvre ton aura.',
      },
      {
        id: 'candy-catch',
        kicker: 'Jeu rapide',
        headline: 'Attrape les bonbons qui tombent',
        blurb: 'Bouge ton seau citrouille et esquive tout ce qui fait peur.',
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
  // Pied de page de toutes les pages du portail (À propos · Guides · Conditions · Confidentialité · Contact). Texte brut (échappé).
  footerNav: { about: 'À propos', guides: 'Guides', terms: 'Conditions d’utilisation', privacy: 'Confidentialité', contact: 'Contact' },
  aboutPage: {
    title: 'À propos | Melgene Apps',
    description: 'Melgene Apps est un petit studio indépendant qui crée des mini-jeux, tests de personnalité et outils créatifs gratuits dans le navigateur, en 12 langues.',
    h1: 'À propos de Melgene Apps',
    lead: 'Melgene Apps est un petit studio indépendant qui conçoit des mini-applis gratuites à ouvrir dans n’importe quel navigateur : petits jeux, tests de personnalité légers, outils pour créer en un instant et coups de pouce pour les petites décisions du quotidien. Rien à télécharger, aucun compte, et la plupart se jouent en une minute environ.',
    sections: [
      {
        h: 'Ce que nous créons',
        p: [
          'Chaque mini-appli Melgene fait une seule chose, mais la fait bien. Certaines sont des jeux d’arcade à finir pendant une pause café, comme le jeu de la taupe, le casse-briques ou un puzzle de fusion. D’autres sont des tests de personnalité qui transforment quelques situations de tous les jours en un résultat ludique à partager. D’autres encore vous aident à créer quelque chose (texte stylé, invitation de fête, pseudo) ou à trancher une petite décision avec une roue, un jeu de l’échelle ou un pile ou face.',
          'Nous ajoutons régulièrement de nouvelles applis, souvent au fil des saisons et des fêtes, et nous améliorons les plus anciennes en observant la façon dont elles sont réellement utilisées.',
        ],
      },
      {
        h: 'Pourquoi nous les créons',
        p: ['Pour nous, les bons petits moments en ligne doivent être rapides, bienveillants et gratuits. Beaucoup de sites de jeux ou de quiz les cachent derrière des inscriptions, des pop-ups et des invitations à installer une appli. Nous visons l’inverse : vous touchez un lien, l’appli s’ouvre, vous jouez, et un geste de plus suffit pour l’envoyer à un ami.'],
      },
      {
        h: 'Comment chaque appli est conçue et testée',
        p: ['Chaque appli commence par un court plan : à qui elle s’adresse, combien de temps dure une partie, ce que montre l’écran de résultat. Nous la développons ensuite comme une page web légère, puis nous la testons avant sa mise en ligne :'],
        list: [
          'Sur de petits écrans de téléphone (360 px de large) comme sur tablette et ordinateur',
          'Dans les 12 langues, en vérifiant que chaque phrase tient à l’écran et se lit naturellement',
          'Avec des contrôles automatiques des liens cassés, des traductions manquantes et de la structure des pages',
          'Sans spoiler : l’écran d’accueil donne envie, sans jamais dévoiler les questions ni les résultats',
        ],
      },
      {
        h: 'Pensé pour le mobile, en 12 langues',
        p: ['La plupart des gens jouent sur leur téléphone : chaque appli est donc d’abord pensée pour un écran étroit. Melgene Apps est disponible en français, anglais, japonais, chinois, coréen, allemand, thaï, vietnamien, espagnol, italien, portugais et russe. Nous écrivons chaque langue pour ses lecteurs plutôt que de traduire mot à mot, et nous utilisons les noms que les gens recherchent vraiment dans leur pays.'],
      },
      {
        h: 'Respectueux de votre vie privée',
        p: ['Aucun compte n’est nécessaire, et nous ne vous demandons jamais votre nom, votre e-mail ou votre numéro de téléphone. Ce que vous saisissez dans une appli est traité dans votre propre navigateur. Les nombres de parties, les cœurs et les notes ne sont que des totaux anonymes par appli. Le site est financé par la publicité Google AdSense ; tous les détails figurent dans notre politique de confidentialité.'],
      },
      {
        h: 'À propos des tests de personnalité',
        p: ['Nos tests de personnalité, tests d’âge mental et autres quiz sont conçus pour divertir. Ce ne sont pas des évaluations psychologiques, médicales ou professionnelles, et un résultat ne doit jamais servir à prendre une décision importante pour vous ou pour quelqu’un d’autre. Profitez-en comme d’un sujet de conversation et d’un moment de détente.'],
      },
      {
        h: 'Nous écrire',
        p: ['Nous lisons tous les messages. Si vous trouvez un bug, avez une idée de nouvelle mini-appli ou souhaitez parler d’un partenariat, rendez-vous sur notre page Contact ou écrivez à contact@melgene.com.'],
      },
    ],
  },
  contactPage: {
    title: 'Contact | Melgene Apps',
    description: 'Contactez Melgene Apps par e-mail pour vos avis, signalements de bugs, propositions de partenariat ou demandes liées à la vie privée. Réponse sous quelques jours ouvrés.',
    h1: 'Nous contacter',
    lead: 'Une question, une idée, un souci ? Nous sommes une petite équipe et nous lisons chaque message nous-mêmes.',
    emailH: 'E-mail',
    emailNote: 'Nous répondons généralement sous quelques jours ouvrés.',
    sections: [
      {
        h: 'Pour quoi nous écrire',
        p: ['Vous pouvez nous écrire pour tout ce qui concerne Melgene Apps, par exemple :'],
        list: [
          'Vos avis et idées de nouveaux mini-jeux, tests ou outils',
          'Signaler un bug : une page qui ne s’ouvre pas, un bouton qui ne répond pas, un texte coupé',
          'Une erreur de traduction ou une tournure peu naturelle dans votre langue',
          'Les demandes de partenariat, de licence ou de presse',
          'Les demandes liées à la vie privée et les questions sur les données ou les cookies',
        ],
      },
      {
        h: 'Signaler un bug',
        p: ['Pour nous aider à corriger vite, indiquez le nom de la mini-appli, la langue utilisée, votre appareil et votre navigateur (par exemple iPhone avec Safari ou Android avec Chrome) et décrivez brièvement ce qui s’est passé. Une capture d’écran aide beaucoup.'],
      },
      {
        h: 'Délai de réponse',
        p: ['Nous répondons en général sous quelques jours ouvrés ; pendant les vacances, cela peut prendre un peu plus de temps. Nous ne vous demanderons jamais de mot de passe ni de coordonnées bancaires.'],
      },
    ],
  },
  termsPage: {
    title: 'Conditions d’utilisation | Melgene Apps',
    description: 'Conditions d’utilisation de Melgene Apps : mini-jeux et tests gratuits fournis en l’état pour le divertissement, règles d’usage, liens de partage et publicité tierce.',
    h1: 'Conditions d’utilisation',
    updated: 'Dernière mise à jour : 9 octobre 2026',
    lead: 'Les présentes conditions d’utilisation s’appliquent à Melgene Apps (le « Service »), y compris le portail et toutes les mini-applis de nos sites. En utilisant le Service, vous acceptez ces conditions. Si vous ne les acceptez pas, merci de ne pas utiliser le Service.',
    sections: [
      { h: '1. Le Service', p: ['Melgene Apps propose gratuitement des mini-jeux, des tests de personnalité, des outils de création et des aides à la décision qui fonctionnent dans votre navigateur. Aucun compte n’est nécessaire. Nous pouvons ajouter, modifier ou retirer des applis et des fonctionnalités à tout moment.'] },
      { h: '2. Service fourni en l’état', p: ['Le Service est fourni « en l’état » et « selon disponibilité », sans garantie d’aucune sorte. Nous faisons de notre mieux pour qu’il fonctionne bien, mais nous ne garantissons pas qu’il sera toujours disponible, exempt d’erreurs ou adapté à un usage particulier. Dans les limites permises par la loi, nous ne sommes pas responsables des pertes ou dommages résultant de son utilisation.'] },
      { h: '3. Pour le divertissement uniquement', p: ['Les résultats des tests de personnalité, des tests d’âge mental, des tirages au sort et des fonctions similaires sont là pour s’amuser. Ils ne constituent pas un avis scientifique, psychologique, médical, financier ou professionnel. Un résultat aléatoire, comme des numéros de loto, n’augmente en rien vos chances de gagner.'] },
      {
        h: '4. Règles d’utilisation',
        p: ['En utilisant le Service, vous vous engagez à ne pas :'],
        list: [
          'L’utiliser à des fins illégales, nuisibles ou malveillantes',
          'Saisir des contenus haineux, harcelants, sexuellement explicites ou portant atteinte aux droits d’autrui',
          'Perturber ou surcharger le Service, l’aspirer massivement ou tenter d’y accéder sans autorisation',
          'Manipuler les compteurs de parties, les cœurs, les notes ou les publicités, y compris par des outils automatisés ou des clics invalides',
        ],
      },
      { h: '5. Ce que vous créez et partagez', p: ['Certaines applis vous permettent de saisir des noms ou du texte, de créer une image ou de générer un lien de partage. Vous êtes responsable de ce que vous saisissez et partagez. Un lien de partage ne conserve que les informations nécessaires pour afficher ce résultat, et toute personne qui l’a peut l’ouvrir : n’y mettez donc pas d’informations personnelles ou sensibles. Nous pouvons supprimer les liens qui enfreignent ces conditions.'] },
      { h: '6. Publicité et cookies', p: ['Le Service est gratuit grâce à la publicité. Les annonces sont fournies par des tiers comme Google AdSense, qui peuvent utiliser des cookies et des technologies similaires pour afficher et mesurer les annonces, y compris personnalisées. Nous ne contrôlons ni le contenu des annonces tierces ni les sites vers lesquels elles renvoient. Pour en savoir plus et gérer vos choix, consultez notre politique de confidentialité et les paramètres des annonces Google.'] },
      { h: '7. Propriété intellectuelle', p: ['Le design, le code, les textes, les illustrations et les autres éléments du Service appartiennent à Melgene Apps ou à ses concédants et sont protégés par la loi. Vous pouvez utiliser le Service à des fins personnelles et non commerciales et partager librement ses liens. Merci de ne pas copier, republier ou vendre les applis ou leur contenu sans notre accord.'] },
      { h: '8. Modification des conditions', p: ['Nous pouvons mettre à jour ces conditions de temps à autre ; la date en haut de cette page sera alors modifiée. Si vous continuez à utiliser le Service après une mise à jour, vous acceptez les conditions révisées.'] },
      { h: '9. Contact', p: ['Pour toute question sur ces conditions, écrivez à contact@melgene.com ou passez par notre page Contact.'] },
    ],
  },
  guidesPage: {
    title: 'Guides et astuces des mini-applis | Melgene Apps',
    description: 'Règles, astuces et petites histoires autour des mini-jeux, tests de personnalité et outils Melgene. Lisez un guide court, puis lancez l’appli.',
    h1: 'Guides et astuces',
    lead: 'Chaque guide explique comment fonctionne une mini-appli, comment progresser et ce qu’il est bon de savoir avant de commencer. Sans spoiler : les questions et les résultats restent une surprise.',
    read: 'Lire le guide',
    play: 'Jouer',
    empty: 'Les guides arrivent bientôt. Revenez nous voir !',
  },
};
