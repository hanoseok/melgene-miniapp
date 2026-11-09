/* Ice Fishing — fr (Pêche sur glace)
 * Rules live in icefish-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {fish} {tier} — keep them as-is when translating.
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
    "title": "Jeu de pêche sur glace – Pêche blanche en ligne",
    "description": "Jeu de pêche sur glace gratuit en ligne : descends ta ligne dans un trou de la glace, attends la touche et remonte le poisson sans casser le fil. 60 secondes, mobile ou PC.",
    "ogTitle": "Pêche sur glace 🎣 Combien de poissons en 60 secondes ?",
    "ogDescription": "Descends ta ligne sous la glace, sens la touche et mouline doucement. Tire trop fort et le fil casse."
  },
  "siteName": "Pêche sur glace",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🎣 Un lac gelé, un petit trou",
    "h1Kicker": "Jeu de pêche sur glace",
    "h1Html": "Plonge ta ligne<br><em>et ramène-les</em>",
    "hook": "Quelque chose nage sous la glace. Descends l’hameçon à la bonne profondeur, attends la touche, puis mouline en douceur avant que le fil ne lâche.",
    "how": {
      "lower": "Appuie pour descendre",
      "reel": "Ça mord ? Mouline",
      "red": "Lâche dans le rouge"
    },
    "start": "Commencer à pêcher →",
    "facts": "Partie de 60 s · mobile ou PC · bats ton record"
  },
  "play": {
    "score": "Score",
    "time": "Temps",
    "secUnit": "s",
    "pause": "Pause",
    "paused": "En pause",
    "resume": "Continuer à pêcher",
    "hint": "Appuie sous la glace pour descendre ta ligne",
    "fieldAria": "Lac gelé : appuie à la profondeur voulue pour descendre l’hameçon, appuie pour mouliner quand ça mord",
    "bite": "Ça mord !",
    "catchPop": "{fish} +{n}",
    "snap": "Le fil a cassé !",
    "escape": "Il s’est échappé",
    "timeUp": "Temps écoulé !"
  },
  "fish": {
    "minnow": "Vairon",
    "perch": "Perche",
    "trout": "Truite",
    "pike": "Brochet",
    "golden": "Poisson doré",
    "boot": "Vieille botte"
  },
  "result": {
    "over": "Ta pêche",
    "unit": "pts",
    "newBest": "Nouveau record perso !",
    "best": "Ton record : {n} pts",
    "caught": "Poissons pêchés",
    "snapped": "Fils cassés",
    "bestCatch": "Plus belle prise : {fish}",
    "noCatch": "Pas de poisson cette fois",
    "tierLabel": "Ton niveau de pêcheur",
    "tiers": [
      "🧊 Doigts gelés",
      "🪝 Apprenti foreur",
      "🐟 Pêcheur patient",
      "🎣 Habitué du lac",
      "⭐ Maître des glaces",
      "🏆 Légende du lac"
    ],
    "top": "Top {n} %",
    "beat": "Mieux que {pct} % des pêcheurs",
    "beatAll": "Mieux que tous les pêcheurs jusqu’ici",
    "others": "Comparé à {n} autres parties",
    "comparing": "Comparaison avec les autres pêcheurs…",
    "shareTitle": "Pêche sur glace",
    "shareText": "J’ai fait {n} pts à la pêche sur glace en 60 secondes 🎣 {tier}. Tu fais mieux ?",
    "retry": "Pêcher encore"
  },
  "og": {
    "brand": "🎣 Pêche sur glace",
    "defaultKicker": "Jeu de pêche sur glace",
    "defaultTitle": "Combien de poissons en 60 secondes ?",
    "defaultDesc": "Descends la ligne · sens la touche · ne casse pas le fil"
  },
  "faq": [
    {
      "q": "Comment descendre la ligne ?",
      "a": "Appuie et maintiens n’importe où dans l’eau sous la glace : l’hameçon va vers cette profondeur et s’arrête quand tu lâches. Sur ordinateur, tu peux aussi maintenir les touches ↓ et ↑. Chaque poisson a sa profondeur préférée, alors essaie plusieurs niveaux."
    },
    {
      "q": "Comment mouliner ?",
      "a": "Quand un poisson mord, maintiens appuyé pour mouliner. La barre de tension à droite monte. Quand elle arrive dans la zone rouge, lâche un instant pour détendre le fil, puis appuie de nouveau. Si la barre est pleine, le fil casse ; si le fil reste mou trop longtemps, le poisson se décroche."
    },
    {
      "q": "Pourquoi certains poissons valent plus ?",
      "a": "Plus un poisson est gros et vit profond, plus il tire fort et plus il rapporte de points. Le rare poisson doré vaut le plus. Les déchets comme une vieille botte remontent facilement mais ne rapportent rien. Ton record est enregistré dans ce navigateur."
    },
    {
      "q": "Que se passe-t-il si je change d’onglet ?",
      "a": "La partie se met en pause toute seule quand tu quittes la page ou verrouilles ton téléphone, et le chrono s’arrête aussi. Appuie sur Continuer à pêcher (ou la touche P) pour reprendre là où tu étais."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Pêche sur glace",
    "description": "Politique de confidentialité du jeu de pêche sur glace : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le jeu de pêche sur glace (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
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
        "Cette politique est en vigueur depuis le 10 novembre 2026."
      ]
    ],
    "back": "← Retour au jeu de pêche sur glace"
  }
};
