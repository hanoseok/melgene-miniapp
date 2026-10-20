/* Snake Game — fr (/fr/) — same key structure as en.js. Rules and scoring: snake-core.js. */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap",
    "display": "'Lilita One'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Jeu du serpent (Snake) – Gratuit en ligne",
    "description": "Jeu du serpent : glisse le doigt ou utilise les flèches pour guider le serpent, mange des pommes et grandis sans toucher un mur ni ta queue. Gratuit, sans téléchargement.",
    "ogTitle": "Jeu du serpent 🐍 Jusqu’où peux-tu grandir ?",
    "ogDescription": "Le Snake d’autrefois. Il accélère à chaque pomme. Combien de temps tiendras-tu ?"
  },
  "siteName": "Jeu du serpent",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🐍 Arcade classique",
    "h1Kicker": "Jeu du serpent (Snake)",
    "h1Html": "Mange. Grandis.<br><em>Évite le mur !</em>",
    "hook": "Guide le serpent vers les pommes. Chaque bouchée l’allonge et l’accélère un peu. Un seul mauvais virage et c’est fini.",
    "how": {
      "move": "Glisse ou flèches",
      "eat": "Mange les pommes",
      "avoid": "Évite murs et queue"
    },
    "facts": "Accélère · les murs tuent · bats ton record",
    "start": "Je me faufile →"
  },
  "play": {
    "score": "Score",
    "best": "Record",
    "paused": "Pause",
    "resume": "Reprendre",
    "go": "Go !",
    "fieldAria": "Plateau de jeu. Glisse le doigt ou utilise les flèches ou W A S D pour diriger le serpent.",
    "pause": "Pause"
  },
  "result": {
    "wall": "Mur percuté !",
    "self": "Tu as mordu ta queue !",
    "full": "Plateau rempli, parfait !",
    "ate": "Pommes mangées",
    "level": "Niveau de vitesse",
    "shareTitle": "Jeu du serpent",
    "shareText": "J’ai fait {score} points au jeu du serpent 🐍 Tu peux me battre ?",
    "points": "points",
    "best": "Record : {n}",
    "newBest": "Nouveau record !",
    "top": "Top {n} %",
    "beat": "Mieux que {pct} % des joueurs",
    "beatAll": "Mieux que tous les autres scores",
    "others": "Comparé à {n} autres scores",
    "comparing": "Comparaison avec les autres joueurs…",
    "retry": "Rejouer"
  },
  "og": {
    "brand": "🐍 Jeu du serpent",
    "defaultKicker": "Jeu d’arcade classique gratuit",
    "defaultTitle": "Jusqu’où ton serpent peut-il grandir ?",
    "defaultDesc": "Glisse pour diriger · mange des pommes · ne te cogne pas"
  },
  "faq": [
    {
      "q": "Comment jouer ?",
      "a": "Glisse le doigt dans n’importe quelle direction sur le plateau, ou utilise les flèches ou W A S D. Le serpent ne s’arrête jamais : dirige-le vers les pommes. Chaque pomme l’allonge. La partie se termine quand tu touches un mur ou ta propre queue."
    },
    {
      "q": "Pourquoi le serpent accélère-t-il ?",
      "a": "Toutes les quelques pommes, tu passes à un niveau de vitesse supérieur : le serpent va plus vite et chaque pomme rapporte un peu plus. La vitesse finit par plafonner, le jeu reste donc jouable."
    },
    {
      "q": "Le top % est-il réel ?",
      "a": "Oui. À la fin d’une partie, seul ton score est envoyé anonymement à notre serveur et comparé à ceux des autres. Le top % n’apparaît que s’il existe de vrais scores à comparer ; sinon rien n’est affiché."
    },
    {
      "q": "Pourquoi le jeu s’est-il mis en pause tout seul ?",
      "a": "Le jeu se met en pause automatiquement quand tu changes d’onglet ou d’appli, tu ne perds donc rien pendant ton absence. Touche Reprendre pour continuer. Ton meilleur score est gardé dans ce navigateur."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Jeu du serpent",
    "description": "Politique de confidentialité du jeu du serpent : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le jeu du serpent (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul votre score (arrondi à la dizaine) est envoyé à notre serveur sous forme de décompte anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement lors de l’utilisation, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et votre record, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur ; certaines fonctions risquent alors de ne pas fonctionner correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et d’autres sites. Pour en savoir plus et modifier vos préférences : <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne conservent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes). Rien de tout cela ne vous identifie personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, contactez l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique est en vigueur depuis le 21 octobre 2026."
      ]
    ],
    "back": "← Retour au jeu du serpent"
  }
};
