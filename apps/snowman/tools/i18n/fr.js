/* Bonhomme de neige — Français (/fr/). Même structure de clés que en.js. Garder {name} {n} {max} tels quels.
 * Tutoiement dans l’interface, vouvoiement dans la politique de confidentialité. Espace fine insécable (U+202F) avant ? ! : ; */
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
    title: "Bonhomme de neige : crée le tien en ligne",
    description: "Fabrique un bonhomme de neige en ligne : empile les boules, choisis les yeux, le nez carotte, le chapeau, l’écharpe et les bras, donne-lui un nom, puis partage-le.",
    ogTitle: "Fais ton bonhomme de neige ⛄",
    ogDescription: "Roule, empile et habille ton propre bonhomme de neige en une minute, puis envoie-le à un ami."
  },
  siteName: "Bonhomme de neige",
  privacyLink: "Politique de confidentialité",
  start: {
    badge: "⛄ Spécial hiver",
    h1Kicker: "Bonhomme de neige en ligne",
    h1Html: "Roule, empile et<br><em>habille ton bonhomme</em>",
    hook: "Pas besoin de moufles. Choisis chaque pièce, regarde tomber la neige et envoie ton bonhomme à quelqu’un qui a besoin d’un sourire.",
    start: "Je fais mon bonhomme →"
  },
  editor: {
    title: "Fais ton bonhomme de neige",
    canvasAria: "Aperçu de ton bonhomme de neige dans un décor d’hiver",
    stepOf: "Étape {n} sur {max}",
    steps: {
      body: "Corps",
      face: "Visage",
      nose: "Nez",
      hat: "Chapeau",
      scarf: "Écharpe",
      arms: "Bras",
      extras: "Extras",
      scene: "Décor",
      name: "Nom"
    },
    labels: {
      body: "Boules de neige",
      eyes: "Yeux",
      mouth: "Bouche",
      nose: "Nez",
      hat: "Chapeau",
      scarf: "Couleur de l’écharpe",
      pattern: "Motif",
      arms: "Bras",
      extras: "Extras (au choix)",
      scene: "Arrière-plan",
      name: "Son nom (facultatif)"
    },
    bodies: {
      classic: "Classique",
      duo: "Deux boules",
      chubby: "Rondouillard",
      slim: "Élancé"
    },
    eyes: {
      coal: "Charbon",
      buttons: "Boutons",
      sparkly: "Brillants",
      sleepy: "Endormis"
    },
    mouths: {
      pebbles: "Cailloux",
      smile: "Sourire",
      grin: "Grand rire",
      oh: "Oh !"
    },
    noses: {
      carrot: "Carotte",
      long: "Carotte XL",
      berry: "Baie",
      pinecone: "Pomme de pin"
    },
    hats: {
      top: "Cylindre",
      beanie: "Bonnet",
      santa: "Père Noël",
      bucket: "Seau",
      earmuffs: "Oreillettes",
      none: "Sans chapeau"
    },
    scarves: {
      red: "Rouge",
      green: "Vert",
      blue: "Bleu",
      yellow: "Jaune",
      purple: "Violet",
      none: "Sans écharpe"
    },
    patterns: {
      solid: "Uni",
      stripes: "Rayures",
      dots: "Pois"
    },
    arms: {
      twigs: "Brindilles",
      mittens: "Moufles",
      wave: "Salut !",
      none: "Sans bras"
    },
    extras: {
      broom: "Balai",
      buttons: "Boutons",
      bird: "Oiseau",
      flakes: "Étincelles"
    },
    scenes: {
      night: "Nuit blanche",
      sunny: "Plein soleil",
      village: "Village"
    },
    random: "Surprise !",
    back: "← Retour",
    next: "Suivant →",
    done: "Mon bonhomme est prêt",
    namePlaceholder: "ex. Boule de Neige",
    ideas: "💡 Idées",
    counter: "{n}/{max}",
    namePresets: [
      "Boule de Neige",
      "Monsieur Frimas",
      "Flocon",
      "Glaçon",
      "Bonnet Givré"
    ]
  },
  card: {
    named: "Voici {name} !"
  },
  result: {
    eyebrowMine: "Ton bonhomme est prêt !",
    eyebrowFriend: "Quelqu’un a fait {name} rien que pour toi",
    eyebrowFriendNoName: "Quelqu’un a fait un bonhomme de neige pour toi",
    revealHint: "Il est encore sous la neige fraîche…",
    reveal: "❄️ Enlever la neige",
    imageAlt: "Un bonhomme de neige dans un décor d’hiver",
    save: "Enregistrer",
    saving: "Création de l’image…",
    saved: "Image enregistrée !",
    saveFail: "Impossible de créer l’image. Fais plutôt une capture d’écran.",
    edit: "Continuer",
    retry: "Un autre bonhomme",
    retryFriend: "Faire mon bonhomme",
    shareTitle: "Bonhomme de neige",
    shareText: "Voici {name}, le bonhomme de neige que j’ai fait ⛄ Viens voir :",
    shareTextNoName: "Regarde le bonhomme de neige que j’ai fait ⛄",
    fileName: "bonhomme-de-neige"
  },
  og: {
    brand: "⛄ Bonhomme de neige",
    defaultKicker: "Bonhomme de neige en ligne",
    defaultTitle: "Roule, empile et habille ton bonhomme",
    defaultDesc: "Chapeaux · écharpes · neige qui tombe · à garder ou partager"
  },
  faq: [
    {
      q: "Comment fabriquer mon bonhomme de neige ?",
      a: "Suis les étapes sous l’image : boules de neige, visage, nez, chapeau, écharpe, bras, extras et décor. Touche une option pour l’essayer, le bonhomme change aussitôt. Tu peux passer d’une étape à l’autre à tout moment."
    },
    {
      q: "À quoi sert « Surprise ! » ?",
      a: "Le bouton choisit pour toi une combinaison au hasard de toutes les pièces. Touche-le jusqu’à ce qu’une version te plaise, puis change à la main n’importe quelle pièce."
    },
    {
      q: "Comment enregistrer ou envoyer mon bonhomme ?",
      a: "Touche « Mon bonhomme est prêt ». « Enregistrer » crée une image PNG de 1080×1350, et les boutons de partage envoient un lien. La personne qui l’ouvre enlève la neige pour découvrir ton bonhomme et peut faire le sien."
    },
    {
      q: "Où mon bonhomme est-il conservé ?",
      a: "Tes choix et le nom se trouvent uniquement dans le lien et, pendant que tu construis, dans ton propre navigateur. Rien n’est envoyé à notre serveur, donc toute personne qui a le lien peut les voir."
    }
  ],
  privacy: {
    title: "Politique de confidentialité | Bonhomme de neige",
    description: "Politique de confidentialité de Bonhomme de neige : traitement de votre bonhomme et de son nom, cookies, publicité et statistiques anonymes.",
    h1: "Politique de confidentialité",
    introHtml: "Bonhomme de neige (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    sections: [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Votre bonhomme de neige et le nom saisi ne sont jamais envoyés à un serveur. Ils restent dans votre navigateur (un brouillon est gardé dans le stockage local pendant la construction) et dans l’URL lorsque vous partagez. Certaines informations peuvent être collectées automatiquement pendant l’utilisation du Service, comme décrit ci-dessous."
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
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés, qui ne conservent que des totaux quotidiens par langue (pages vues, bonshommes terminés, notes en étoiles). Rien de cela ne vous identifie personnellement, et le nom de votre bonhomme n’y figure pas."
      ],
      [
        "5. Liens partagés et images",
        "Les liens créés avec « Partager » contiennent votre bonhomme de neige, encodé dans l’URL : toute personne qui possède le lien peut donc le voir. Les images enregistrées sont créées dans votre navigateur. Évitez d’indiquer une adresse, un numéro de téléphone ou d’autres données personnelles dans le nom."
      ],
      [
        "6. Contact",
        "Pour toute question concernant cette politique de confidentialité, veuillez contacter l’éditeur du site."
      ],
      [
        "7. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 9 novembre 2026."
      ]
    ],
    back: "← Retour à Bonhomme de neige"
  }
};
