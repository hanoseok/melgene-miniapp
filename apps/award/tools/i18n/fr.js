/* Créer un diplôme — français (fr/). Même structure de clés que en.js ; voir l’en-tête de en.js. */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Playfair+Display:wght@700;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    serif: "'Playfair Display'",
    serifWeight: 700,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Créer un diplôme : certificat humoristique",
    description: "Créer un diplôme humoristique ou un certificat de remerciement : nom du prix, raison, cadre et sceau, puis image A4 ou lien qui ouvre une remise de prix.",
    ogTitle: "Créer un diplôme 🏆",
    ogDescription: "Un diplôme drôle ou touchant en une minute, à remettre avec un simple lien."
  },
  siteName: "Créateur de diplômes",
  privacyLink: "Confidentialité",
  start: {
    badge: "🏆 La saison des remises de prix",
    h1Kicker: "Créer un diplôme",
    h1Html: "Quelqu’un mérite<br><em>un prix</em>",
    hook: "Donnez un nom au prix, dites pourquoi et envoyez un lien qui s’ouvre comme une vraie cérémonie.",
    start: "Créer un diplôme →"
  },
  editor: {
    title: "Votre diplôme",
    themesAria: "Styles de diplôme",
    themes: {
      gold: "Cadre doré",
      pastel: "Pastel mignon",
      minimal: "Épuré",
      ribbon: "Ruban rétro"
    },
    previewAria: "Aperçu du diplôme",
    examplesAria: "Idées de nom de prix",
    sealLabel: "Sceau",
    seals: {
      none: "Aucun",
      red: "Sceau rouge",
      gold: "Médaille d’or"
    },
    fields: {
      title: {
        label: "Nom du prix",
        placeholder: "ex. Collègue de l’année"
      },
      to: {
        label: "Décerné à",
        placeholder: "ex. Camille"
      },
      reason: {
        label: "Pourquoi ce prix",
        placeholder: "Pour avoir…"
      },
      date: {
        label: "Date"
      },
      issuer: {
        label: "Remis par",
        placeholder: "ex. Le comité des goûters"
      }
    },
    titleExamples: [
      "Collègue de l’année",
      "Roi des croissants",
      "Prix de la bonne humeur",
      "Champion du fou rire"
    ],
    dice: "🎲 Au hasard",
    counter: "{n}/{max}",
    reasons: [
      "Pour avoir apporté les croissants du vendredi sans jamais oublier personne.",
      "Pour avoir animé le groupe WhatsApp toute l’année avec des mèmes d’une qualité rare.",
      "Pour savoir toujours où se cachent le chargeur, les ciseaux et les bons stylos.",
      "Pour avoir transformé chaque mardi ordinaire en souvenir à raconter.",
      "Pour avoir ri à nos blagues, même la troisième fois.",
      "Pour être le premier à dire « je m’en occupe » et le dernier à partir après le rangement.",
      "Pour un calme olympien face aux bourrages d’imprimante, aux grèves et aux toasts brûlés.",
      "Pour avoir partagé le dernier carré de chocolat alors que personne n’aurait rien vu.",
      "Pour se souvenir des anniversaires, des cafés de chacun et de toutes les petites attentions.",
      "Pour avoir été là, à chaque fois, exactement quand il le fallait.",
      "Pour avoir goûté en premier la recette mystère, avec un courage exemplaire.",
      "Pour nous rappeler chaque jour que la gentillesse est un super-pouvoir."
    ],
    done: "Terminer le diplôme"
  },
  card: {
    heading: "Diplôme d’honneur",
    defaultTitle: "Prix d’excellence",
    presented: "Ce diplôme est fièrement décerné à",
    name: "{name}",
    closing: "En reconnaissance de quoi ce prix lui est remis avec toute notre gratitude.",
    sealFallback: "★"
  },
  open: {
    eyebrow: "🏆 Remise de prix",
    forName: "Un prix pour {name}",
    forNone: "Un prix rien que pour vous",
    hint: "Touchez le parchemin pour le dérouler",
    open: "Dérouler le diplôme"
  },
  result: {
    eyebrowMine: "Votre diplôme est prêt !",
    eyebrowFriend: "Félicitations, {name} !",
    eyebrowFriendNoName: "Félicitations !",
    imageAlt: "Diplôme : {title}",
    save: "Enregistrer",
    saving: "Création de l’image…",
    saved: "Image enregistrée !",
    saveFail: "Impossible de créer l’image. Essayez une capture d’écran.",
    edit: "Modifier",
    retry: "Créer un autre diplôme",
    retryFriend: "Créer mon diplôme",
    shareTitle: "Créer un diplôme",
    shareText: "Un prix attend {name} 🏆 Ouvrez la cérémonie ici :",
    shareTextNoName: "Quelqu’un vous a décerné un prix 🏆 Ouvrez la cérémonie ici :",
    fileName: "diplome"
  },
  og: {
    brand: "🏆 Créateur de diplômes",
    defaultKicker: "Créer un diplôme",
    defaultTitle: "Quelqu’un mérite un prix",
    defaultDesc: "4 styles · sceau · image A4 ou lien cérémonie",
    sampleTitle: "Roi des croissants"
  },
  faq: [
    {
      q: "Comment créer un diplôme ?",
      a: "Choisissez l’un des quatre styles, écrivez le nom du prix, le nom du lauréat et la raison, puis la date, qui le remet et le sceau. L’aperçu se met à jour pendant la saisie. Touchez « Terminer le diplôme » quand tout vous plaît."
    },
    {
      q: "Quelle est la taille de l’image ?",
      a: "« Enregistrer » crée un PNG de 1240×1754, au format A4 : il s’imprime proprement et reste net dans une conversation. Sur téléphone, le menu de partage s’ouvre ; sur ordinateur, l’image se télécharge."
    },
    {
      q: "Que voit la personne qui ouvre mon lien ?",
      a: "Une petite remise de prix : un parchemin roulé apparaît, elle le touche et le diplôme se déroule avec son nom. Le titre et la date s’affichent dans sa langue, et elle peut créer le sien."
    },
    {
      q: "Où est gardé ce que j’écris ?",
      a: "Uniquement dans le lien de partage et dans votre navigateur. Rien n’est envoyé à notre serveur, donc toute personne qui a le lien peut lire le diplôme : partagez-le seulement avec les bonnes personnes."
    }
  ],
  privacy: {
    title: "Politique de confidentialité | Créer un diplôme",
    description: "Politique de confidentialité du créateur de diplômes : traitement du texte saisi, cookies, publicité et statistiques anonymes.",
    h1: "Politique de confidentialité",
    introHtml: "Le créateur de diplômes (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    sections: [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Le nom du prix, les noms, la raison et la date que vous saisissez ne sont jamais envoyés à un serveur. Ils restent dans votre navigateur (un brouillon est gardé en stockage local pendant l’édition) et dans l’URL quand vous partagez. Certaines informations peuvent être collectées automatiquement, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies pour afficher des publicités et comprendre son utilisation. Vous pouvez refuser ou supprimer les cookies dans les réglages de votre navigateur ; certaines fonctions risquent alors de mal fonctionner."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon vos visites sur ce site et d’autres. Pour en savoir plus et modifier vos préférences : <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, diplômes terminés, notes). Rien de cela ne vous identifie ni ne contient ce que vous avez écrit."
      ],
      [
        "5. Liens partagés et images",
        "Les liens créés avec « Partager » contiennent votre diplôme encodé dans l’URL : toute personne qui a le lien peut le voir. Les images sont créées dans votre navigateur. Évitez d’y mettre une adresse, un numéro de téléphone ou d’autres données personnelles."
      ],
      [
        "6. Contact",
        "Pour toute question sur cette politique, contactez l’exploitant du site."
      ],
      [
        "7. Date d’effet",
        "Cette politique s’applique à partir du 15 novembre 2026."
      ]
    ],
    back: "← Retour au créateur de diplômes"
  }
};
