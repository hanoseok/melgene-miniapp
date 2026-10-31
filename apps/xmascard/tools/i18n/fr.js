/* Carte de Noël à créer — Français (/fr/). Même structure de clés que en.js. Garder {name} {greeting} {n} {max} tels quels.
 * Espace fine insécable (U+202F) avant ? ! : ; */
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
    title: "Carte de Noël à créer et envoyer en ligne",
    description: "Carte de Noël à créer en ligne : choisis un thème et une formule, ajoute les prénoms et un mot chaleureux, puis enregistre l’image ou envoie un lien-enveloppe.",
    ogTitle: "Carte de Noël à créer 🎄",
    ogDescription: "Crée une jolie carte de Noël en une minute et envoie-la à quelqu’un que tu aimes."
  },
  siteName: "Carte de Noël",
  privacyLink: "Politique de confidentialité",
  start: {
    badge: "🎄 Spécial fêtes",
    h1Kicker: "Carte de Noël à créer",
    h1Html: "Un petit mot<br><em>pour Noël</em>",
    hook: "Choisis un joli design, écris quelques mots doux et envoie une carte qui s’ouvre comme une vraie enveloppe.",
    start: "Créer ma carte →"
  },
  editor: {
    title: "Personnalise ta carte",
    themesAria: "Designs de carte",
    themes: {
      classic: "Classique",
      snowy: "Nuit de neige",
      golden: "Doré",
      cute: "Mignon",
      minimal: "Épuré",
      forest: "Forêt d’hiver"
    },
    previewAria: "Aperçu de ta carte",
    greetingsLabel: "Formule",
    decoLabel: "Décorations",
    decos: {
      snow: "Neige",
      lights: "Guirlande",
      sparkle: "Paillettes"
    },
    fields: {
      to: {
        label: "Pour",
        placeholder: "ex. Mamie"
      },
      from: {
        label: "De la part de",
        placeholder: "ex. Léa"
      },
      message: {
        label: "Ton message",
        placeholder: "Écris quelques mots doux…"
      }
    },
    ideas: "💡 Idées",
    counter: "{n}/{max}",
    presets: [
      "Merci d’avoir été là toute l’année. Je te souhaite un Noël doux, gourmand et plein de rires !",
      "Que ces fêtes t’apportent du repos, de la chaleur et de beaux moments en famille.",
      "Loin des yeux, mais jamais loin du cœur. Vivement qu’on se retrouve autour d’une bûche !",
      "Une année bien remplie s’achève : profite de chaque instant et repose-toi bien.",
      "Plein de bonheur, de santé et de belles surprises pour l’année qui arrive !"
    ],
    defaultGreeting: "merry",
    done: "Terminer ma carte"
  },
  card: {
    greetings: {
      merry: "Joyeux Noël !",
      holidays: "Joyeuses fêtes !",
      newyear: "Bonne année !",
      seasons: "Meilleurs vœux"
    },
    to: "Pour {name},",
    from: "Avec affection, {name}"
  },
  open: {
    eyebrow: "Tu as reçu une carte de Noël",
    fromName: "de la part de {name}",
    fromNone: "de quelqu’un qui pense à toi",
    open: "Ouvrir la carte"
  },
  result: {
    eyebrowMine: "Ta carte est prête !",
    eyebrowFriend: "Une carte de {name}",
    eyebrowFriendNoName: "Une carte rien que pour toi",
    imageAlt: "Carte de Noël : {greeting}",
    save: "Enregistrer l’image",
    saving: "Création de l’image…",
    saved: "Image enregistrée !",
    saveFail: "Impossible de créer l’image. Fais plutôt une capture d’écran.",
    copyText: "Copier le texte",
    copied: "Texte copié !",
    copyFail: "Impossible de copier le texte. Réessaie.",
    edit: "Modifier",
    retry: "Créer une autre carte",
    retryFriend: "Créer ma carte à moi",
    shareTitle: "Carte de Noël à créer",
    shareText: "{name} t’a envoyé une carte de Noël 🎄 Ouvre-la ici :",
    shareTextNoName: "Quelqu’un t’a envoyé une carte de Noël 🎄 Ouvre-la ici :",
    fileName: "carte-de-noel"
  },
  og: {
    brand: "🎄 Carte de Noël",
    defaultKicker: "Carte de Noël à créer",
    defaultTitle: "Un petit mot pour Noël",
    defaultDesc: "6 designs · image à enregistrer ou lien à envoyer",
    cardGreeting: "Joyeux Noël !"
  },
  faq: [
    {
      q: "Comment créer ma carte ?",
      a: "Choisis un design et une formule, active ou non la neige, la guirlande et les paillettes, puis ajoute le destinataire, ton prénom et un petit message. L’aperçu change en direct ; appuie sur « Terminer ma carte » quand ça te plaît."
    },
    {
      q: "Je peux enregistrer la carte en image ?",
      a: "Oui. « Enregistrer l’image » crée un PNG de 1080×1350, parfait pour WhatsApp ou une story. Sur téléphone, le menu de partage s’ouvre ; sur ordinateur, l’image se télécharge."
    },
    {
      q: "Que voit la personne qui ouvre mon lien ?",
      a: "D’abord une enveloppe cachetée : un toucher l’ouvre et la carte apparaît, avec la formule dans sa propre langue. Elle peut ensuite créer sa propre carte."
    },
    {
      q: "Où mon message est-il conservé ?",
      a: "Uniquement dans le lien et, pendant que tu écris, dans ton navigateur. Rien n’est envoyé à notre serveur, mais toute personne qui a le lien peut lire la carte : partage-le seulement avec qui tu veux."
    }
  ],
  privacy: {
    title: "Politique de confidentialité | Carte de Noël",
    description: "Politique de confidentialité de Carte de Noël : traitement du texte de ta carte, cookies, publicité et statistiques anonymes.",
    h1: "Politique de confidentialité",
    introHtml: "Carte de Noël (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    sections: [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Les prénoms et le message que vous saisissez ne sont jamais envoyés à un serveur : ils restent dans votre navigateur (un brouillon est gardé dans le stockage local pendant la saisie) et dans l’URL lorsque vous partagez. Certaines informations peuvent être collectées automatiquement pendant l’utilisation, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies pour afficher des publicités et comprendre son utilisation. Vous pouvez refuser ou supprimer les cookies dans les réglages de votre navigateur ; certaines fonctions peuvent alors ne pas marcher comme prévu."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon vos visites précédentes. Pour en savoir plus et modifier vos préférences, consultez les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés, qui ne gardent que des totaux quotidiens par langue (pages vues, cartes terminées, notes). Rien de cela ne vous identifie, et votre message n’en fait jamais partie."
      ],
      [
        "5. Liens partagés et images",
        "Les liens créés avec « Partager » contiennent votre carte, encodée dans l’URL : toute personne qui a le lien peut la voir. Les images sont créées dans votre navigateur. Évitez d’indiquer une adresse, un numéro de téléphone ou d’autres données personnelles dans le message."
      ],
      [
        "6. Contact",
        "Pour toute question sur cette politique, contactez l’exploitant du site."
      ],
      [
        "7. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 1er novembre 2026."
      ]
    ],
    back: "← Retour à Carte de Noël"
  }
};
