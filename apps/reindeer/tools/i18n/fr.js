/* Reindeer Jump — fr (Saut de renne)
 * Rules live in reindeer-core.js; this file holds every visible string (same keys as en.js).
 * Placeholders: {n} {pct} {tier} — keep them as-is.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Saut de renne – jeu de course infinie sur les toits",
    "description": "Saut de renne est un jeu de course infinie à un seul bouton : bondis sur les toits enneigés la nuit, saute cheminées et corbeaux et franchis les trous en double saut.",
    "ogTitle": "Saut de renne 🦌 Jusqu’où iras-tu sur les toits ?",
    "ogDescription": "Touche pour sauter, maintiens pour monter plus haut, retouche en l’air pour un double saut. Ne tombe pas entre deux toits !"
  },
  "siteName": "Saut de renne",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🦌 Toits enneigés, nuit étoilée",
    "h1Kicker": "Saut de renne",
    "h1Html": "De toit en toit,<br><em>sans tomber !</em>",
    "hook": "Ce soir, quelqu’un doit traverser la ville. Bondis de toit en toit, saute par-dessus cheminées et corbeaux, et ramasse tous les cadeaux en chemin.",
    "how": {
      "tap": "Touche pour sauter",
      "hold": "Maintiens pour monter",
      "air": "Retouche en l’air"
    },
    "start": "C’est parti →",
    "facts": "Course infinie · 3 cœurs · mobile ou PC"
  },
  "play": {
    "score": "Score",
    "dist": "Distance",
    "lives": "Cœurs",
    "mUnit": "m",
    "pause": "Pause",
    "paused": "Pause",
    "resume": "Continuer",
    "hint": "Touche pour partir",
    "fieldAria": "Toits enneigés : touche l’écran ou appuie sur Espace pour sauter, maintiens pour sauter plus haut, retouche en l’air pour un double saut",
    "bell": "Grelot ! +{n}",
    "ouch": "Aïe !",
    "fall": "Oups !",
    "crash": "Plus de cœurs !"
  },
  "result": {
    "over": "Course terminée",
    "reasonFall": "Tu as glissé entre deux toits",
    "reasonCrash": "Trois chocs et plus aucun cœur",
    "unit": "pts",
    "newBest": "Nouveau record perso !",
    "best": "Ton record : {n} pts",
    "distance": "Distance",
    "presents": "Cadeaux",
    "bells": "Grelots",
    "tierLabel": "Ton rang sur les toits",
    "tiers": [
      "🧦 Premier bond",
      "❄️ Saute-cheminée",
      "🦌 Coureur régulier",
      "🌙 Planeur de nuit",
      "⭐ Étoile des toits",
      "🏆 Champion du ciel"
    ],
    "top": "Top {n} %",
    "beat": "Meilleur que {pct} % des joueurs",
    "beatAll": "Meilleur que tous les autres joueurs jusqu’ici",
    "others": "Comparé à {n} autres parties",
    "comparing": "Comparaison avec les autres joueurs…",
    "shareTitle": "Saut de renne",
    "shareText": "J’ai fait {n} pts en bondissant sur les toits 🦌 {tier}. Tu peux faire mieux ?",
    "retry": "Rejouer"
  },
  "og": {
    "brand": "🦌 Saut de renne",
    "defaultKicker": "Course sur les toits à un bouton",
    "defaultTitle": "Jusqu’où iras-tu sur les toits ?",
    "defaultDesc": "Touche pour sauter · maintiens · double saut"
  },
  "faq": [
    {
      "q": "Comment sauter plus haut ?",
      "a": "Plus tu maintiens, plus le saut est haut : garde le doigt (ou Espace, ↑ ou le bouton de la souris) appuyé pendant que le renne monte et il continue de grimper ; lâche tôt pour un petit bond. En l’air, retouche une fois pour un double saut."
    },
    {
      "q": "Qu’est-ce qui termine une partie ?",
      "a": "Tomber dans un trou entre deux toits arrête la partie tout de suite. Heurter une cheminée, un tas de neige, un bloc de glace ou un corbeau coûte un cœur ; le renne clignote ensuite un instant et ne peut pas être touché. Perdre les trois cœurs termine aussi la partie."
    },
    {
      "q": "Peut-on vraiment franchir chaque trou ?",
      "a": "Oui. Chaque trou et chaque obstacle est conçu pour être franchi d’un seul saut maintenu à la vitesse du moment, avec la place d’atterrir avant le suivant. Le double saut sert de secours si tu pars trop tard."
    },
    {
      "q": "Comment marche le score ?",
      "a": "Chaque mètre parcouru rapporte un point et le rythme s’accélère au fil de la course. Un cadeau vaut 10 points, le rare grelot doré 50. La partie se met en pause si tu changes d’onglet ou verrouilles ton téléphone."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Saut de renne",
    "description": "Politique de confidentialité de Saut de renne : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Saut de renne (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul ton score est envoyé à notre serveur sous forme de compteur anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et votre record, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions peuvent alors ne pas marcher comme prévu."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et sur d’autres. Pour en savoir plus et modifier vos préférences, consultez les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes). Rien de tout cela ne vous identifie personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique, veuillez contacter l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique est en vigueur depuis le 18 novembre 2026."
      ]
    ],
    "back": "← Retour à Saut de renne"
  }
};
