/* Défi 10 secondes — fr (10 Second Challenge / timer)
 * Rules live in timer-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + target/blind choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {t} {total} {time} {pct} {tier} — keep them as-is when translating.
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
    "title": "Défi 10 secondes – Arrête le chrono pile à 10,00",
    "description": "Défi 10 secondes : lance le chronomètre et arrête-le pile à 10,00 secondes, au feeling. 3 essais, un mode aveugle, des cibles de 5 ou 30 s. Gratuit, sans téléchargement.",
    "ogTitle": "Défi 10 secondes ⏱️ Tu t’arrêtes pile à 10,00 ?",
    "ogDescription": "Compte dans ta tête et appuie sur STOP au bon moment. 3 essais, et en mode aveugle les chiffres disparaissent."
  },
  "siteName": "Défi 10 secondes",
  "privacyLink": "Confidentialité",
  "start": {
    "badge": "⏱️ Tu sens passer 10 secondes ?",
    "h1Kicker": "Défi 10 secondes",
    "h1Html": "Arrête le chrono<br><em>pile à 10,00</em>",
    "hook": "Lance le chronomètre, compte dans ta tête et arrête-le au bon moment. Trois essais, seul le plus proche compte.",
    "targetLabel": "Temps visé",
    "targetValue": "{n} s",
    "blindLabel": "Mode aveugle",
    "blindDesc": "Les chiffres disparaissent après 3 secondes",
    "how": "Départ, puis STOP · touche l’écran ou appuie sur Espace",
    "start": "C’est parti →",
    "facts": "3 essais · 5, 10 ou 30 secondes · bats ton record"
  },
  "play": {
    "target": "Cible {t}",
    "blindTag": "Aveugle",
    "attempt": "Essai {n} sur {total}",
    "go": "Départ",
    "stop": "STOP",
    "next": "Essai suivant",
    "finish": "Voir mon résultat",
    "readyHint": "Appuie sur Départ, puis arrête pile à {t}",
    "runHint": "Touche l’écran ou appuie sur Espace pour arrêter",
    "early": "{n} trop tôt",
    "late": "{n} trop tard",
    "perfect": "Parfait ! Pile {t} 🎉",
    "cancelled": "Tu as quitté la page, cet essai ne compte pas. Recommence !",
    "hidden": "??:??.??",
    "change": "← Changer de mode",
    "clockAria": "Chronomètre",
    "sec": "{n} s"
  },
  "result": {
    "over": "Ton résultat",
    "mode": "Cible {t}",
    "perfect": "Pile {t} ! Arrêt parfait 🎉",
    "bestLabel": "Meilleur essai, écart de",
    "stoppedAt": "Arrêté à {time}",
    "tierLabel": "Ton horloge interne",
    "tiers": [
      "🐌 Perdu dans le temps",
      "⏳ À peu près là",
      "🙂 Bonne horloge interne",
      "🎯 Timing précis",
      "⚡ Pro du centième",
      "🧠 Chronomètre humain"
    ],
    "newBest": "Nouveau record !",
    "pb": "Ton record dans ce mode : {n}",
    "avg": "Écart moyen",
    "listLabel": "Tes 3 essais",
    "top": "Top {n}%",
    "beat": "Plus précis que {pct}% des joueurs",
    "beatAll": "Plus précis que tous les autres joueurs pour l’instant",
    "others": "Comparé à {n} autres parties dans ce mode",
    "comparing": "Comparaison avec les autres joueurs…",
    "shareTitle": "Défi 10 secondes",
    "shareText": "J’ai arrêté le chrono à seulement {n} de {t} ⏱️ {tier}. Tu fais mieux ?",
    "retry": "Rejouer"
  },
  "og": {
    "brand": "⏱️ Défi 10 secondes",
    "defaultKicker": "Jeu de timing gratuit",
    "defaultTitle": "Arrêter le chrono pile à 10,00 ?",
    "defaultDesc": "3 essais · mode aveugle · 5, 10 ou 30 secondes"
  },
  "faq": [
    {
      "q": "Comment on joue ?",
      "a": "Choisis un temps (5, 10 ou 30 secondes) et appuie sur Départ. Le chrono démarre à l’instant où tu touches. Compte dans ta tête puis appuie sur STOP, touche n’importe où sur l’écran de jeu ou appuie sur Espace quand tu penses que c’est le moment. Tu as trois essais par partie et le plus proche est ton résultat."
    },
    {
      "q": "À quoi sert le mode aveugle ?",
      "a": "En mode aveugle, les chiffres se transforment en points d’interrogation après 3 secondes et tu dois continuer à compter au feeling. C’est bien plus dur, et ce mode a son propre record et sa propre comparaison avec les autres joueurs."
    },
    {
      "q": "Pourquoi c’est si dur de tomber pile sur 10,00 ?",
      "a": "Ton doigt met un petit instant à réagir et ton compte dérive un peu en dix secondes, donc même un bon arrêt tombe quelques centièmes trop tôt ou trop tard. Le chrono prend l’instant exact de ton appui et affiche les centièmes comme un vrai chronomètre. Un 10,00 pile est rare, et c’est ce qui rend le défi amusant."
    },
    {
      "q": "Pourquoi mon essai n’a pas compté ?",
      "a": "Si tu changes d’onglet, verrouilles le téléphone ou quittes la page pendant que le chrono tourne, l’essai est annulé pour rester équitable. Relance simplement le même essai."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Défi 10 secondes",
    "description": "Politique de confidentialité de Défi 10 secondes : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Défi 10 secondes (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul votre score (l’écart en millisecondes de votre meilleur essai) est envoyé à notre serveur sous forme de comptage anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de votre navigateur pour retenir votre langue et votre record, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions pourraient alors ne pas marcher comme prévu."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon vos visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier vos préférences, consultez les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes). Rien de cela ne vous identifie personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique, veuillez contacter l’exploitant du site."
      ],
      [
        "6. Date d’effet",
        "Cette politique s’applique à partir du 2 novembre 2026."
      ]
    ],
    "back": "← Retour à Défi 10 secondes"
  }
};
