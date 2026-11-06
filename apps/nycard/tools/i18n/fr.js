/* Carte de vœux 2027 — français (fr/). Même structure et mêmes variables que en.js. card.* est dessiné sur la carte.
 * Espaces fines insécables ( ) devant ! ? : ; et dans « ». */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Pacifico'",
    scriptWeight: 400,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Carte de vœux 2027 à créer en ligne",
    description: "Carte de vœux 2027 en ligne : un style, une formule, les prénoms et un mot doux. Enregistrez l’image ou envoyez un lien qui s’ouvre comme une enveloppe.",
    ogTitle: "Carte de vœux 2027 🎆",
    ogDescription: "Une jolie carte de bonne année en une minute, pour envoyer vos premiers vœux de 2027."
  },
  siteName: "Carte de vœux 2027",
  privacyLink: "Confidentialité",
  start: {
    badge: "🎆 Bonjour 2027 !",
    h1Kicker: "Carte de vœux 2027",
    h1Html: "Commencez l’année<br>avec de <em>jolis mots</em>",
    hook: "Choisissez un style, écrivez quelques vœux et envoyez une carte qui s’ouvre comme une vraie enveloppe.",
    start: "Créer ma carte →"
  },
  editor: {
    title: "Personnalisez votre carte",
    themesAria: "Styles de carte",
    themes: {
      red: "Rouge et or",
      washi: "Papier washi",
      goat: "Petite chèvre",
      minimal: "Épuré",
      snowy: "Nuit de neige",
      fireworks: "Feu d’artifice"
    },
    previewAria: "Aperçu de votre carte",
    greetingsLabel: "Formule",
    decoLabel: "Options",
    decos: {
      zodiac: "Chèvre",
      year: "2027",
      sparkle: "Paillettes"
    },
    fields: {
      to: {
        label: "Pour",
        placeholder: "ex. : Mamie"
      },
      from: {
        label: "De la part de",
        placeholder: "ex. : Léa"
      },
      message: {
        label: "Votre message",
        placeholder: "Quelques vœux pour l’année…"
      }
    },
    ideas: "💡 Idées",
    counter: "{n}/{max}",
    presets: [
      "Je te souhaite une année 2027 pleine de santé, de rires et de beaux projets qui se réalisent.",
      "Merci pour tout l’an dernier. Vivement les prochains apéros et les longues discussions !",
      "Que cette nouvelle année vous apporte de la douceur, de la sérénité et de jolies surprises.",
      "Mes meilleurs vœux de bonheur et de réussite pour toi et ceux qui te sont chers.",
      "Ma seule bonne résolution : te voir plus souvent cette année. Bonne année !"
    ],
    defaultGreeting: "happy",
    zodiacOn: false,
    done: "Terminer ma carte"
  },
  card: {
    greetings: {
      happy: "Bonne année !",
      formal: "Meilleurs vœux",
      luck: "Belle et heureuse année",
      year: "Bonne année 2027 !"
    },
    zodiac: "2027 · Année de la Chèvre (calendrier lunaire)",
    to: "Chère, cher {name},",
    from: "Je t’embrasse, {name}"
  },
  open: {
    eyebrow: "Vous avez reçu une carte de vœux",
    fromName: "de la part de {name}",
    fromNone: "de la part de quelqu’un qui pense à vous",
    open: "Ouvrir la carte"
  },
  result: {
    eyebrowMine: "Votre carte est prête !",
    eyebrowFriend: "Une carte de {name}",
    eyebrowFriendNoName: "Une carte rien que pour vous",
    imageAlt: "Carte de vœux : {greeting}",
    save: "Enregistrer",
    saving: "Création de l’image…",
    saved: "Image enregistrée !",
    saveFail: "Impossible de créer l’image. Faites plutôt une capture d’écran.",
    copyText: "Copier le texte",
    copied: "Texte copié !",
    copyFail: "Impossible de copier le texte. Réessayez.",
    edit: "Modifier",
    retry: "Créer une autre carte",
    retryFriend: "Créer ma propre carte",
    shareTitle: "Carte de vœux 2027",
    shareText: "{name} vous a envoyé une carte de vœux 🎆 À ouvrir ici :",
    shareTextNoName: "Quelqu’un vous a envoyé une carte de vœux 🎆 À ouvrir ici :",
    fileName: "carte-de-voeux-2027"
  },
  og: {
    brand: "🎆 Carte de vœux 2027",
    defaultKicker: "Carte de vœux 2027",
    defaultTitle: "Commencez l’année avec de jolis mots",
    defaultDesc: "6 styles · image ou lien à envoyer",
    cardGreeting: "Bonne année !"
  },
  faq: [
    {
      q: "Comment créer ma carte ?",
      a: "Choisissez un style et une formule, activez ou non la chèvre, le grand « 2027 » et les paillettes, puis indiquez pour qui est la carte, de la part de qui, et un petit message. L’aperçu se met à jour pendant que vous écrivez. Touchez « Terminer ma carte » quand tout vous plaît."
    },
    {
      q: "Pourquoi une chèvre ?",
      a: "Dans le calendrier lunaire d’Asie de l’Est, 2027 est l’année de la Chèvre (ou du Mouton). Au Japon, en Corée, en Chine ou au Vietnam, on met souvent l’animal de l’année sur les cartes de vœux. C’est un clin d’œil facultatif : désactivez-le si vous préférez."
    },
    {
      q: "Puis-je enregistrer la carte en image ?",
      a: "Oui. « Enregistrer » crée une image PNG de 1080×1350 qui passe très bien dans les messageries et les stories. Sur téléphone, le menu de partage s’ouvre ; sur ordinateur, l’image se télécharge."
    },
    {
      q: "Que voit la personne qui ouvre mon lien ?",
      a: "Elle voit d’abord une enveloppe cachetée, la touche pour l’ouvrir et découvre votre carte, avec la formule dans sa propre langue. Elle peut ensuite créer sa propre carte."
    },
    {
      q: "Où est conservé mon message ?",
      a: "Uniquement dans le lien et, pendant que vous écrivez, dans votre navigateur. Il n’est jamais envoyé à notre serveur ; toute personne qui a le lien peut donc le lire, alors partagez-le seulement avec les bonnes personnes."
    }
  ],
  privacy: {
    title: "Politique de confidentialité | Carte de vœux 2027",
    description: "Politique de confidentialité de la Carte de vœux 2027 : traitement du texte de vos cartes, cookies, publicité et statistiques anonymes.",
    h1: "Politique de confidentialité",
    introHtml: "Carte de vœux 2027 (le « Service ») respecte votre vie privée et ne traite que les informations minimales décrites ci-dessous.",
    sections: [
      [
        "1. Informations collectées",
        "Le Service s’utilise sans compte ni connexion. Les prénoms et le message que vous saisissez ne sont jamais envoyés à un serveur. Ils restent dans votre navigateur (un brouillon est gardé dans le stockage local pendant l’édition) et dans l’adresse du lien quand vous partagez. Certaines informations peuvent être collectées automatiquement, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies pour afficher des publicités et comprendre son utilisation. Vous pouvez refuser ou supprimer les cookies dans les réglages de votre navigateur ; certaines fonctions pourraient alors ne pas fonctionner correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et d’autres sites. Pour en savoir plus et modifier vos préférences, consultez les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, cartes terminées, notes). Rien de cela ne vous identifie personnellement ni ne contient votre message."
      ],
      [
        "5. Liens partagés et images",
        "Les liens créés avec « Partager » contiennent votre carte encodée dans l’adresse : toute personne qui possède le lien peut la voir. Les images enregistrées sont créées dans votre navigateur. Évitez d’indiquer une adresse, un numéro de téléphone ou d’autres données personnelles dans votre message."
      ],
      [
        "6. Contact",
        "Pour toute question sur cette politique de confidentialité, veuillez contacter l’exploitant du site."
      ],
      [
        "7. Date d’entrée en vigueur",
        "Cette politique est en vigueur depuis le 7 novembre 2026."
      ]
    ],
    back: "← Retour à la Carte de vœux 2027"
  }
};
