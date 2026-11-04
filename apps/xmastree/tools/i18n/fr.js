/* Sapin de Noël à décorer — Français (/fr/). Même structure de clés que en.js. Garder {name} {n} {max} tels quels.
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
    title: "Décorer un sapin de Noël en ligne",
    description: "Décore un sapin de Noël en ligne : choisis ton sapin, accroche boules, étoiles et sucres d’orge, allume les guirlandes et la neige, puis partage-le.",
    ogTitle: "Décore ton sapin de Noël 🎄",
    ogDescription: "Accroche des boules, allume les guirlandes et partage ton propre sapin en une minute."
  },
  siteName: "Sapin de Noël à décorer",
  privacyLink: "Politique de confidentialité",
  start: {
    badge: "🎄 Spécial fêtes",
    h1Kicker: "Décorer un sapin de Noël",
    h1Html: "Ton sapin<br><em>qui scintille</em>",
    hook: "Accroche boules et sucres d’orge, allume les guirlandes, fais tomber la neige et envoie ton sapin à quelqu’un que tu aimes.",
    start: "Je décore mon sapin →"
  },
  editor: {
    title: "Décore ton sapin",
    canvasAria: "Ton sapin de Noël. Touche-le pour accrocher la décoration choisie, fais glisser une décoration pour la déplacer.",
    hint: "Touche le sapin pour accrocher · glisse pour déplacer",
    paletteLabel: "Décorations",
    kinds: {
      red: "Boule rouge",
      gold: "Boule dorée",
      blue: "Boule bleue",
      purple: "Boule violette",
      silver: "Boule argentée",
      star: "Étoile",
      bell: "Clochette",
      cane: "Sucre d’orge",
      gift: "Cadeau",
      bow: "Nœud",
      sock: "Chaussette",
      flake: "Flocon",
      cookie: "Biscuit",
      erase: "Gomme"
    },
    undo: "Annuler",
    clear: "Tout effacer",
    auto: "Surprise !",
    count: "{n}/{max} décorations",
    full: "Ton sapin est plein ! Déplace ou efface d’abord une décoration.",
    styleLabel: "Sapin",
    styles: {
      classic: "Classique",
      snowy: "Enneigé",
      nordic: "Nordique",
      pink: "Rose"
    },
    bgLabel: "Décor",
    bgs: {
      night: "Nuit étoilée",
      cozy: "Coin du feu",
      snowfield: "Paysage blanc",
      red: "Rouge festif"
    },
    topperLabel: "Cime du sapin",
    toppers: {
      none: "Aucune",
      star: "Étoile",
      angel: "Ange",
      bow: "Nœud"
    },
    extrasLabel: "En plus",
    snow: "Neige",
    lights: "Guirlandes",
    fields: {
      name: {
        label: "Ton prénom",
        placeholder: "ex. Camille"
      },
      message: {
        label: "Petit mot",
        placeholder: "ex. Joyeux Noël !"
      }
    },
    ideas: "💡 Idées",
    counter: "{n}/{max}",
    presets: [
      "Joyeux Noël et belles fêtes à toute la famille !",
      "Que la magie de Noël illumine ta maison !",
      "Bûche, chocolat chaud et douceur de vivre 🎄",
      "Plein de surprises sous le sapin !",
      "Doux Noël, de notre sapin au tien ✨"
    ],
    done: "Mon sapin est prêt"
  },
  card: {
    by: "Décoré par {name}"
  },
  result: {
    eyebrowMine: "Ton sapin est prêt !",
    eyebrowFriend: "{name} a décoré ce sapin pour toi",
    eyebrowFriendNoName: "Quelqu’un a décoré ce sapin pour toi",
    imageAlt: "Sapin de Noël orné de {n} décorations",
    save: "Enregistrer",
    saving: "Création de l’image…",
    saved: "Image enregistrée !",
    saveFail: "Impossible de créer l’image. Fais plutôt une capture d’écran.",
    edit: "Décorer encore",
    retry: "Décorer un autre sapin",
    retryFriend: "Décorer mon propre sapin",
    shareTitle: "Sapin de Noël à décorer",
    shareText: "{name} a décoré un sapin de Noël 🎄 Viens voir :",
    shareTextNoName: "Regarde le sapin de Noël que j’ai décoré 🎄",
    fileName: "christmas-tree"
  },
  og: {
    brand: "🎄 Sapin de Noël à décorer",
    defaultKicker: "Décorer un sapin de Noël",
    defaultTitle: "Ton sapin qui scintille",
    defaultDesc: "Décorations · guirlandes · neige · à garder ou partager"
  },
  faq: [
    {
      q: "Comment accrocher une décoration ?",
      a: "Choisis une décoration dans la rangée sous le sapin, puis touche le sapin où tu veux. Pour la déplacer, appuie dessus et fais-la glisser. La gomme retire une seule décoration, et Annuler revient en arrière d’une étape."
    },
    {
      q: "Puis-je changer de sapin après avoir mis des décorations ?",
      a: "Oui. Tu peux changer la forme du sapin, le décor et la cime, et allumer ou éteindre la neige et les guirlandes quand tu veux. Tes décorations restent exactement à leur place."
    },
    {
      q: "Comment enregistrer ou envoyer mon sapin ?",
      a: "Touche « Mon sapin est prêt ». « Enregistrer » crée une image PNG de 1080×1350, et les boutons de partage envoient un lien. La personne qui l’ouvre voit ton sapin avec ses guirlandes qui scintillent et peut décorer le sien."
    },
    {
      q: "Où mon sapin est-il conservé ?",
      a: "Tes décorations, ton prénom et ton message se trouvent uniquement dans le lien et, pendant que tu décores, dans ton propre navigateur. Rien n’est envoyé à notre serveur, donc toute personne qui a le lien peut les voir."
    }
  ],
  privacy: {
    title: "Politique de confidentialité | Sapin de Noël à décorer",
    description: "Politique de confidentialité de Sapin de Noël à décorer : traitement de ton sapin, du prénom et du message, cookies, publicité et statistiques anonymes.",
    h1: "Politique de confidentialité",
    introHtml: "Sapin de Noël à décorer (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    sections: [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Votre sapin, le prénom et le message saisis ne sont jamais envoyés à un serveur. Ils restent dans votre navigateur (un brouillon est gardé dans le stockage local pendant la décoration) et dans l’URL lorsque vous partagez. Certaines informations peuvent être collectées automatiquement pendant l’utilisation du Service, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies pour afficher des annonces et comprendre comment il est utilisé. Vous pouvez refuser ou supprimer les cookies dans les réglages de votre navigateur ; certaines fonctions risquent alors de ne pas marcher comme prévu."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon vos visites précédentes sur ce site et sur d’autres. Pour en savoir plus et modifier vos préférences, consultez les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés, qui ne conservent que des totaux quotidiens par langue (pages vues, sapins terminés, notes en étoiles). Rien de cela ne vous identifie personnellement, et ni votre prénom ni votre message n’y figurent."
      ],
      [
        "5. Liens partagés et images",
        "Les liens créés avec « Partager » contiennent votre sapin, encodé dans l’URL : toute personne qui possède le lien peut donc le voir. Les images enregistrées sont créées dans votre navigateur. Évitez d’indiquer une adresse, un numéro de téléphone ou d’autres données personnelles dans votre message."
      ],
      [
        "6. Contact",
        "Pour toute question concernant cette politique de confidentialité, veuillez contacter l’éditeur du site."
      ],
      [
        "7. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 5 novembre 2026."
      ]
    ],
    back: "← Retour à Sapin de Noël à décorer"
  }
};
