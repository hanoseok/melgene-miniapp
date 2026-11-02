/* Mon bilan de l’année — français (tutoiement). Key structure = en.js; see en.js for notes ({year}/{next} are filled in by the browser — never write a year as digits). */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Pacifico&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "script": "'Pacifico'",
    "scriptWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Bilan de l’année : crée ta carte rétrospective",
    "description": "Fais ton bilan de l’année en une carte : mot de l’année, meilleur moment, chanson, plat, lieu, qui remercier et objectif. Choisis un thème, enregistre ou partage ta carte.",
    "ogTitle": "Mon bilan de l’année 🎁",
    "ogDescription": "Ton année en une carte : un mot, une chanson, un moment inoubliable et la suite."
  },
  "siteName": "Mon bilan de l’année",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🎁 Spécial fin d’année",
    "h1Kicker": "Bilan de l’année",
    "h1Html": "Ton année<br><em>en une carte</em>",
    "hook": "Un mot, une chanson, un moment inoubliable. Remplis quelques lignes et obtiens une carte qui résume ton année.",
    "start": "Créer ma carte →"
  },
  "editor": {
    "title": "Ton année en quelques lignes",
    "themesAria": "Thèmes de la carte",
    "themes": {
      "aurora": "Aurore",
      "sunset": "Crépuscule",
      "mint": "Menthe",
      "midnight": "Minuit",
      "paper": "Papier",
      "neon": "Néon"
    },
    "previewAria": "Aperçu de ta carte",
    "fields": {
      "nm": {
        "label": "Ton prénom (facultatif)",
        "placeholder": "ex. Léa"
      },
      "w": {
        "label": "Ton mot de l’année",
        "placeholder": "Un mot pour ton année"
      },
      "mo": {
        "label": "Meilleur moment",
        "placeholder": "ex. La mer en hiver avec ma sœur"
      },
      "so": {
        "label": "Chanson de l’année",
        "placeholder": "Celle que tu as écoutée en boucle"
      },
      "fo": {
        "label": "Plat de l’année",
        "placeholder": "ex. Les crêpes du dimanche"
      },
      "pl": {
        "label": "Lieu de l’année",
        "placeholder": "ex. Le petit café près du bureau"
      },
      "th": {
        "label": "Merci à…",
        "placeholder": "ex. Maman, mon équipe, Hugo"
      },
      "go": {
        "label": "Objectif pour l’an prochain",
        "placeholder": "ex. Courir un 10 km"
      }
    },
    "ideasAria": "Idées de mots",
    "ideas": [
      "Audace",
      "Équilibre",
      "Renouveau",
      "Gratitude",
      "Liberté"
    ],
    "needWord": "Commence par ton mot de l’année, le reste est facultatif.",
    "done": "Terminer ma carte"
  },
  "card": {
    "kicker": "BILAN DE L’ANNÉE",
    "titleMine": "Mon année {year}",
    "titleName": "L’année {year} de {name}",
    "word": "Mon mot de l’année",
    "rows": {
      "mo": "Meilleur moment",
      "so": "Chanson de l’année",
      "fo": "Plat de l’année",
      "pl": "Lieu de l’année",
      "th": "Merci à",
      "go": "Objectif {next}"
    }
  },
  "result": {
    "eyebrowMine": "Ton bilan {year} est prêt !",
    "eyebrowFriend": "Le bilan {year} de {name}",
    "eyebrowFriendNoName": "Le bilan {year} d’un proche",
    "imageAlt": "Carte bilan de l’année. Mot de l’année : {word}",
    "save": "Enregistrer l’image",
    "saving": "Création de l’image…",
    "saved": "Image enregistrée !",
    "saveFail": "Impossible de créer l’image. Fais plutôt une capture d’écran.",
    "copyText": "Copier le texte",
    "copied": "Texte copié !",
    "copyFail": "Impossible de copier le texte. Réessaie.",
    "edit": "Modifier",
    "retry": "Créer une autre carte",
    "retryFriend": "Créer la mienne",
    "shareTitle": "Mon bilan de l’année",
    "shareText": "Le bilan {year} de {name} 🎁 Jette un œil :",
    "shareTextNoName": "Mon bilan {year} 🎁 Jette un œil :",
    "fileName": "bilan-annee"
  },
  "og": {
    "brand": "🎁 Mon bilan de l’année",
    "defaultKicker": "Bilan de l’année",
    "defaultTitle": "Ton année en une seule carte",
    "defaultDesc": "6 thèmes · mot, chanson, moment · à enregistrer ou partager",
    "cardKicker": "BILAN DE L’ANNÉE",
    "cardWord": "Audace",
    "cardRows": [
      "Meilleur moment",
      "Chanson de l’année",
      "Objectif"
    ]
  },
  "faq": [
    {
      "q": "Qu’est-ce que je dois remplir ?",
      "a": "Seulement ton mot de l’année. Ton prénom, ton meilleur moment, ta chanson, ton plat, ton lieu, la personne à remercier et ton objectif sont facultatifs : les lignes vides n’apparaissent pas sur la carte."
    },
    {
      "q": "Quelle année s’affiche sur la carte ?",
      "a": "L’année que tu es en train de clôturer, d’après la date de ton appareil. En janvier, la carte affiche encore l’année qui vient de se terminer : tu peux donc la faire un peu en retard."
    },
    {
      "q": "Je peux enregistrer la carte en image ?",
      "a": "Oui. « Enregistrer l’image » crée un PNG de 1080×1350 parfait pour les stories et les messageries. Sur téléphone, le menu de partage s’ouvre ; sur ordinateur, l’image se télécharge."
    },
    {
      "q": "Où est gardé ce que j’écris ?",
      "a": "Seulement dans ton navigateur pendant que tu modifies, et dans le lien si tu le partages. Rien de ce que tu tapes n’est envoyé à notre serveur, donc toute personne qui a le lien peut lire la carte : partage-le avec des gens de confiance."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Mon bilan de l’année",
    "description": "Politique de confidentialité de Mon bilan de l’année : traitement du texte de ta carte, cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Mon bilan de l’année (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Ce que vous écrivez sur votre carte n’est jamais envoyé à un serveur : le texte reste dans votre navigateur (un brouillon est gardé dans le stockage local pendant la saisie) et dans l’URL lorsque vous partagez. Certaines informations peuvent être collectées automatiquement pendant l’utilisation, comme décrit ci-dessous."
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
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés, qui ne gardent que des totaux quotidiens par langue (pages vues, cartes terminées, notes). Rien de cela ne vous identifie, et le contenu de votre carte n’en fait jamais partie."
      ],
      [
        "5. Liens partagés et images",
        "Les liens créés avec « Partager » contiennent votre carte, encodée dans l’URL : toute personne qui a le lien peut la voir. Les images sont créées dans votre navigateur. Évitez d’indiquer une adresse, un numéro de téléphone ou d’autres données personnelles sur la carte."
      ],
      [
        "6. Contact",
        "Pour toute question sur cette politique, contactez l’exploitant du site."
      ],
      [
        "7. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 3 novembre 2026."
      ]
    ],
    "back": "← Retour à Mon bilan de l’année"
  }
};
