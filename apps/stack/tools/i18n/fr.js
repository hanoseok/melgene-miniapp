/* Tour de blocs — français (/fr/)
 * Règles et score dans stack-core.js ; ce fichier ne contient que les textes affichés. Garder {n} {pct} tels quels.
 * Espace fine insécable ( ) avant ? ! : ; — espace insécable ( ) dans « ».
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
    "title": "Tour de blocs – jeu Stack gratuit en ligne",
    "description": "Tour de blocs, le jeu Stack : touche pour lâcher le bloc qui glisse et empile la tour la plus haute possible. Ce qui dépasse est coupé. Gratuit, sans téléchargement.",
    "ogTitle": "Tour de blocs 🏗️ Jusqu’où monteras-tu ?",
    "ogDescription": "Lâche chaque bloc au bon moment. Ce qui dépasse est coupé. Jusqu’à quelle hauteur ira ta tour ?"
  },
  "siteName": "Tour de blocs",
  "privacyLink": "Confidentialité",
  "start": {
    "badge": "🏗️ Arcade en une touche",
    "h1Kicker": "Tour de blocs – jeu Stack",
    "h1Html": "Touche, lâche,<br><em>monte plus haut !</em>",
    "hook": "Un bloc glisse d’un côté à l’autre au-dessus de ta tour. Lâche-le pile au bon moment. Tout ce qui dépasse tombe pour de bon.",
    "how": {
      "tap": "Touche pour lâcher",
      "cut": "Le surplus est coupé",
      "perfect": "Vise le parfait"
    },
    "facts": "Ça accélère · une touche · record à battre",
    "start": "Empiler →"
  },
  "play": {
    "score": "Blocs",
    "best": "Record",
    "paused": "Pause",
    "resume": "Reprendre",
    "hint": "Touche pour lâcher",
    "perfect": "Parfait !",
    "combo": "Combo ×{n}",
    "fieldAria": "Zone de jeu. Touche, clique ou appuie sur Espace pour lâcher le bloc qui glisse.",
    "pause": "Pause"
  },
  "result": {
    "over": "Raté, à côté de la tour !",
    "blocks": "blocs",
    "perfects": "Lâchers parfaits",
    "bestCombo": "Meilleur combo",
    "shareTitle": "Tour de blocs",
    "shareText": "J’ai empilé {n} blocs dans Tour de blocs 🏗️ Tu peux faire mieux ?",
    "best": "Record : {n}",
    "newBest": "Nouveau record !",
    "top": "Top {n} %",
    "beat": "Mieux que {pct} % des joueurs",
    "beatAll": "Mieux que toutes les tours jusqu’ici",
    "others": "Comparé à {n} autres tours",
    "comparing": "Comparaison avec les autres joueurs…",
    "retry": "Rejouer"
  },
  "og": {
    "brand": "🏗️ Tour de blocs",
    "defaultKicker": "Jeu d’empilement gratuit",
    "defaultTitle": "Jusqu’où monteras-tu ta tour ?",
    "defaultDesc": "Touche pour lâcher · le surplus est coupé · vise le parfait"
  },
  "faq": [
    {
      "q": "Comment on joue ?",
      "a": "Un bloc glisse d’avant en arrière au-dessus de la tour. Touche la zone de jeu, clique ou appuie sur Espace pour le lâcher. Seule la partie posée sur le bloc du dessous reste, le reste est coupé et le bloc suivant est plus étroit. La partie s’arrête quand un bloc rate complètement la tour."
    },
    {
      "q": "C’est quoi, un lâcher parfait ?",
      "a": "Si tu lâches le bloc presque exactement sur celui du dessous, il se cale tout seul et garde toute sa taille. Enchaîne plusieurs parfaits d’affilée et le bloc s’élargit à nouveau petit à petit, ce qui te redonne de la marge."
    },
    {
      "q": "Pourquoi ça devient plus dur ?",
      "a": "Chaque bloc empilé fait glisser le suivant un peu plus vite, jusqu’à une vitesse maximale. Trouve le rythme et touche un poil avant que le bloc arrive au bon endroit."
    },
    {
      "q": "Le top % est-il réel ?",
      "a": "Oui. À la fin de chaque partie, seul ton nombre de blocs est envoyé anonymement à notre serveur et comparé à ceux des autres. Le top % n’apparaît que s’il y a de vrais scores à comparer, sinon rien n’est affiché."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Tour de blocs",
    "description": "Politique de confidentialité de Tour de blocs : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Tour de blocs (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul ton score (le nombre de blocs empilés) est envoyé à notre serveur sous forme de compteur anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue et ton record, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions risquent alors de ne pas marcher correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des annonces via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces basées sur tes visites précédentes sur ce site et d’autres. Plus d’infos et réglages dans les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs qui ne gardent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes en étoiles). Rien de tout cela ne permet de t’identifier."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, contacte l’éditeur du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 23 octobre 2026."
      ]
    ],
    "back": "← Retour à Tour de blocs"
  }
};
