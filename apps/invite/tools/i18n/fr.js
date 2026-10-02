/* Invitation de fête d’Halloween — Français
 */
module.exports = {
  fonts: {
    css: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    display: "'Nunito'",
    displayWeight: 900,
    sans: "",
    wordBreak: "normal",
    hyphens: "manual"
  },
  meta: {
    title: "Invitation soirée Halloween – à créer en ligne",
    description: "Crée ton invitation de soirée Halloween : nom, date, heure, lieu et thème (fantôme, citrouille, chauve-souris, sorcière). Enregistre l’image ou partage le lien. Gratuit.",
    ogTitle: "Invitation soirée Halloween 🎃 Crée la tienne",
    ogDescription: "Crée une invitation d’Halloween en une minute et envoie-la à tes invités."
  },
  siteName: "Invitation de fête d’Halloween",
  privacyLink: "Politique de confidentialité",
  start: {
    badge: "🎃 Spécial Halloween",
    h1Kicker: "Invitation soirée Halloween",
    h1Html: "Invite tes amis à<br><em>ta soirée d’épouvante</em>",
    hook: "Donne un nom à ta fête, choisis un thème effrayant et envoie une invitation que tes invités auront envie d’ouvrir.",
    start: "Créer mon invitation →"
  },
  editor: {
    title: "Compose ton invitation",
    themesAria: "Thèmes d’invitation",
    themes: {
      ghost: "Fantôme",
      pumpkin: "Citrouille",
      bat: "Chauve-souris",
      witch: "Sorcière",
      spider: "Araignée"
    },
    previewAria: "Aperçu de ton invitation",
    fields: {
      title: {
        label: "Nom de la fête",
        placeholder: "ex. Soirée maison hantée"
      },
      date: {
        label: "Date"
      },
      time: {
        label: "Heure"
      },
      place: {
        label: "Lieu",
        placeholder: "ex. Chez moi, 3e étage"
      },
      note: {
        label: "Un mot pour les invités",
        placeholder: "ex. Déguisement obligatoire !"
      }
    },
    done: "Créer l’invitation"
  },
  card: {
    invited: "Tu es invité(e) !",
    defaultTitle: "Soirée d’Halloween"
  },
  result: {
    eyebrowMine: "Ton invitation est prête !",
    eyebrowFriend: "Tu as reçu une invitation",
    imageAlt: "Invitation : {title}",
    save: "Enregistrer l’image",
    saving: "Création de l’image…",
    saved: "Image enregistrée !",
    saveFail: "Impossible de créer l’image. Essaie avec une capture d’écran.",
    copyText: "Copier le texte",
    copied: "Texte copié !",
    copyFail: "Impossible de copier. Réessaie.",
    edit: "Modifier",
    retry: "Créer une autre invitation",
    retryFriend: "Créer ma propre invitation",
    shareTitle: "Invitation soirée Halloween",
    shareText: "Tu es invité(e) à « {title} » ! 🎃 Ouvre l’invitation :",
    shareTextNoTitle: "Tu es invité(e) à ma soirée d’Halloween ! 🎃 Ouvre l’invitation :",
    fileName: "party-invitation"
  },
  og: {
    brand: "🎃 Invitation Halloween",
    defaultKicker: "Soirée d’Halloween",
    defaultTitle: "Crée ton invitation de fête",
    defaultDesc: "Choisis un thème effrayant · enregistre l’image ou partage le lien",
    cardTitle: "Soirée d’Halloween"
  },
  faq: [
    {
      q: "Comment créer mon invitation ?",
      a: "Choisis un thème, écris le nom de la fête, la date, l’heure, le lieu et un petit mot pour tes invités, puis touche « Créer l’invitation ». Tous les champs sont facultatifs et l’aperçu change pendant que tu écris."
    },
    {
      q: "Puis-je enregistrer l’invitation en image ?",
      a: "Oui. « Enregistrer l’image » crée un PNG que tu peux envoyer dans n’importe quelle conversation. Sur téléphone, le menu de partage s’ouvre ; sur ordinateur, le fichier se télécharge."
    },
    {
      q: "Comment fonctionne le lien de partage ?",
      a: "Toute l’invitation est contenue dans le lien lui-même : la personne qui l’ouvre voit exactement la même carte. Rien n’est stocké sur nos serveurs, et ouvrir un lien ne modifie pas ta propre invitation."
    },
    {
      q: "Puis-je envoyer seulement le texte ?",
      a: "Oui. « Copier le texte » copie le nom de la fête, la date, l’heure, le lieu, ton message et le lien, prêts à coller dans n’importe quel message."
    }
  ],
  privacy: {
    title: "Politique de confidentialité | Invitation de fête d’Halloween",
    description: "Politique de confidentialité d’Invitation de fête d’Halloween : traitement des informations de ton invitation, cookies, publicités et statistiques anonymes.",
    h1: "Politique de confidentialité",
    introHtml: "Invitation de fête d’Halloween (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrites ci-dessous.",
    sections: [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Le nom de la fête, la date, l’heure, le lieu et le message que vous saisissez ne sont jamais envoyés à un serveur : ils restent dans votre navigateur (et dans l’URL quand vous partagez). Certaines informations peuvent être collectées automatiquement lors de l’utilisation du Service, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies pour afficher des publicités et comprendre comment le Service est utilisé. Vous pouvez refuser ou supprimer les cookies dans les paramètres de votre navigateur ; certaines fonctionnalités peuvent alors ne pas fonctionner comme prévu."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des publicités basées sur vos visites précédentes. Vous pouvez en savoir plus et modifier vos préférences dans les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) ainsi que nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, invitations terminées, notes). Rien de tout cela ne vous identifie personnellement."
      ],
      [
        "5. Liens partagés et images",
        "Les liens créés avec « Partager » contiennent les informations de votre invitation, encodées dans l’URL. Les images enregistrées sont créées dans votre navigateur. Évitez de saisir comme lieu votre adresse exacte ou d’autres informations permettant de vous identifier."
      ],
      [
        "6. Contact",
        "Pour toute question concernant cette politique, veuillez contacter l’opérateur du Service."
      ],
      [
        "7. Date d’entrée en vigueur",
        "Cette politique est effective à partir du 3 octobre 2026."
      ]
    ],
    back: "← Retour à l’invitation d’Halloween"
  }
};
