/* Créateur de flocons — français (/fr/ copie). Mêmes clés que en.js. Écriture naturelle, pas de traduction mot à mot.
 * Les clés finissant par Html sont insérées telles quelles (seulement <br> et <em>). */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    script: "'Nunito'",
    scriptWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Créer un flocon de neige en ligne · Créateur de flocons",
    description: "Créez votre propre flocon de neige symétrique en ligne. Réglez les branches, le détail et la taille, choisissez la forme et la couleur, puis enregistrez une image PNG 1080 × 1080 ou partagez un lien.",
    ogTitle: "Créer un flocon de neige ❄️",
    ogDescription: "Quelques touches suffisent pour faire pousser un flocon à six branches. Enregistrez-le ou envoyez-le à un ami."
  },
  siteName: "Créateur de flocons",
  privacyLink: "Politique de confidentialité",
  start: {
    badge: "❄️ Spécial hiver",
    h1Kicker: "Créer un flocon de neige en ligne",
    h1Html: "Fais pousser un flocon<br><em>rien qu'à toi</em>",
    hook: "Quelques touches et un flocon parfaitement symétrique prend forme sous tes yeux. Enregistre-le en image ou envoie le lien à un ami.",
    start: "Commencer →"
  },
  editor: {
    title: "Crée ton flocon",
    canvasAria: "Aperçu de ton flocon de neige",
    labels: {
      arms: "Branches par côté",
      complexity: "Détail",
      size: "Longueur des branches"
    },
    levels: {
      complexity: ["Simple", "Moyen", "Détaillé"],
      size: ["Courtes", "Moyennes", "Longues"]
    },
    buttons: {
      newFlake: "Nouveau flocon",
      shape: "Changer la forme",
      color: "Changer la couleur",
      save: "Enregistrer le PNG",
      share: "Partager",
      done: "C'est terminé"
    },
    shapes: {
      needle: "Aiguilles",
      plate: "Plaquettes",
      spike: "Pointes",
      feather: "Plumes"
    },
    palettes: ["Bleu glacier", "Blanc givre", "Lilas", "Or de minuit", "Menthe"],
    status: {
      copied: "Lien copié !",
      copyFail: "Impossible de copier le lien. Essaie plutôt d'enregistrer le PNG.",
      shared: "Partagé !",
      saving: "Création de ton image…",
      saved: "Image enregistrée !",
      saveFail: "Impossible de créer l'image. Essaie une capture d'écran."
    }
  },
  result: {
    eyebrowMine: "Ton flocon est prêt !",
    eyebrowFriend: "Un ami a créé ce flocon pour toi",
    save: "Enregistrer le PNG",
    edit: "Continuer à créer",
    retry: "Créer un nouveau flocon",
    retryFriend: "Créer le mien",
    shareTitle: "Créateur de flocons",
    shareText: "Regarde le flocon que j'ai créé ❄️ Ouvre le lien pour le voir :",
    fileName: "flocon"
  },
  og: {
    brand: "❄️ Créateur de flocons",
    defaultKicker: "Créer un flocon de neige en ligne",
    defaultTitle: "Fais pousser un flocon rien qu'à toi",
    defaultDesc: "Six branches · formes · couleurs · enregistrer ou partager"
  },
  faq: [
    {
      q: "Comment créer un flocon ?",
      a: "Touche « Nouveau flocon » pour obtenir un dessin neuf, puis utilise les trois curseurs pour les branches, le détail et la longueur. Chaque flocon est une seule branche copiée six fois et reflétée, il reste donc toujours symétrique."
    },
    {
      q: "À quoi servent les boutons de forme et de couleur ?",
      a: "« Changer la forme » modifie le dessin des branches (aiguilles, plaquettes, pointes ou plumes) et garde le même tracé. « Changer la couleur » change le fond et le trait. Tu peux essayer les deux sur le même flocon."
    },
    {
      q: "Comment enregistrer ou partager mon flocon ?",
      a: "« Enregistrer le PNG » télécharge une image 1080 × 1080. « Partager » crée un lien qui contient tes réglages : la personne qui l'ouvre voit le même flocon."
    },
    {
      q: "Mon flocon est-il conservé quelque part ?",
      a: "Non. Le flocon existe uniquement dans l'image et dans le lien. Rien de ce que tu crées n'est envoyé à nos serveurs lorsque tu enregistres ou partages."
    }
  ],
  privacy: {
    title: "Politique de confidentialité | Créateur de flocons",
    description: "Politique de confidentialité du Créateur de flocons : traitement des flocons, cookies, publicité et statistiques anonymes.",
    h1: "Politique de confidentialité",
    introHtml: "Le Créateur de flocons (le « Service ») respecte votre vie privée et ne traite que le minimum d'informations décrit ci-dessous.",
    sections: [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Les réglages de votre flocon ne sont jamais envoyés à un serveur. Ils restent dans votre navigateur et dans le lien que vous partagez. Certaines informations peuvent être collectées automatiquement pendant votre utilisation, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies pour afficher des publicités et comprendre son utilisation. Vous pouvez refuser ou supprimer les cookies dans les réglages de votre navigateur ; certaines fonctions peuvent alors ne pas fonctionner comme prévu."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour afficher des publicités en fonction de vos visites précédentes sur ce site et sur d'autres sites. Pour en savoir plus et modifier vos préférences, consultez <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne conservent que les totaux journaliers par langue (pages vues, flocons terminés). Ces données ne permettent pas de vous identifier personnellement."
      ],
      [
        "5. Liens partagés et images",
        "Un lien créé avec « Partager » contient les réglages de votre flocon dans l'URL : toute personne possédant le lien voit le même flocon. Les images enregistrées sont créées dans votre navigateur et ne sont pas envoyées chez nous."
      ],
      [
        "6. Contact",
        "Pour toute question sur cette politique de confidentialité, contactez l'exploitant du site."
      ],
      [
        "7. Date d'entrée en vigueur",
        "Cette politique est en vigueur depuis le 11 novembre 2026."
      ]
    ],
    back: "← Retour au Créateur de flocons"
  }
};
