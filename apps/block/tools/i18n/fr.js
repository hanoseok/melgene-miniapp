/* Puzzle de blocs — français (espace fine insécable   avant ? ! : ;) */
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
    "title": "Puzzle de blocs – jeu de blocs 8×8, efface les lignes",
    "description": "Puzzle de blocs : glisse les pièces sur une grille 8×8, remplis lignes et colonnes pour les effacer et enchaîne les combos. Gratuit, sans téléchargement.",
    "ogTitle": "Puzzle de blocs 🧩 Combien de temps tiendras-tu ?",
    "ogDescription": "Glisse les pièces, remplis une ligne ou une colonne et elle disparaît. Enchaîne pour faire des combos."
  },
  "siteName": "Puzzle de blocs",
  "privacyLink": "Confidentialité",
  "start": {
    "badge": "🧩 Casse-tête 8×8 tout en douceur",
    "h1Kicker": "Puzzle de blocs",
    "h1Html": "Remplis, efface,<br><em>vide la grille !</em>",
    "hook": "Trois pièces, une grille 8×8 et aucun chrono. Case-les, efface lignes et colonnes, et continue tant qu’il reste de la place.",
    "how": {
      "drag": "Glisse une pièce",
      "lines": "Remplis une ligne",
      "plan": "Garde de la place"
    },
    "facts": "Sans chrono · combos · bats ton record",
    "start": "Jouer →"
  },
  "play": {
    "score": "Score",
    "best": "Record",
    "combo": "Combo",
    "comboValue": "×{n}",
    "hint": "Glisse une pièce sur la grille",
    "hintSelected": "Touche une case pour la poser",
    "hintNoFit": "Cette pièce ne rentre pas ici",
    "noRoom": "Plus de place !",
    "boardAria": "Grille de 8 sur 8. Choisis une pièce avec 1, 2 ou 3, déplace-la avec les flèches et appuie sur Entrée pour la poser. Échap pour annuler.",
    "trayAria": "Pièces à poser",
    "pieceAria": "Pièce {n}",
    "pieceNoFit": "Pièce {n} (pas de place)"
  },
  "result": {
    "over": "Plus de place sur la grille",
    "points": "points",
    "lines": "Lignes effacées",
    "combo": "Meilleur combo",
    "comboValue": "×{n}",
    "shareTitle": "Puzzle de blocs",
    "shareText": "J’ai fait {n} points au Puzzle de blocs 🧩 Tu peux faire mieux ?",
    "best": "Record : {n}",
    "newBest": "Nouveau record !",
    "top": "Top {n} %",
    "beat": "Mieux que {pct} % des joueurs",
    "beatAll": "Mieux que tous les autres joueurs pour l’instant",
    "others": "Comparé à {n} autres parties",
    "comparing": "Comparaison avec les autres joueurs…",
    "retry": "Rejouer"
  },
  "og": {
    "brand": "🧩 Puzzle de blocs",
    "defaultKicker": "Jeu de blocs 8×8 gratuit",
    "defaultTitle": "Remplis les lignes, vide la grille",
    "defaultDesc": "Glisse · remplis lignes et colonnes · combos"
  },
  "faq": [
    {
      "q": "Comment jouer ?",
      "a": "Glisse l’une des trois pièces placées sous la grille et dépose-la sur des cases vides. Quand une ligne ou une colonne est pleine, elle s’efface. Une fois les trois pièces posées, trois nouvelles arrivent. La partie s’arrête quand aucune pièce restante ne rentre nulle part."
    },
    {
      "q": "Comment le score est-il calculé ?",
      "a": "Chaque case posée rapporte un point. Effacer des lignes ajoute un bonus qui grandit avec le nombre de lignes effacées d’un coup (10, 30, 60, 100 …), puis ce bonus est multiplié par ton combo."
    },
    {
      "q": "Comment fonctionnent les combos ?",
      "a": "Chaque pièce qui efface au moins une ligne augmente ton combo d’un cran, et ce nombre sert de multiplicateur pour ce coup. Si trois pièces de suite n’effacent rien, le combo retombe à zéro."
    },
    {
      "q": "Peut-on jouer sans glisser ?",
      "a": "Oui. Touche une pièce pour la choisir, puis touche la grille là où tu veux la poser. Au clavier, appuie sur 1, 2 ou 3 pour choisir, déplace avec les flèches et valide avec Entrée."
    },
    {
      "q": "Le pourcentage est-il réel ?",
      "a": "Oui. À la fin d’une partie, seul ton score est envoyé anonymement à notre serveur pour être comparé à ceux des autres. Le pourcentage ne s’affiche que s’il existe de vrais scores à comparer."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Puzzle de blocs",
    "description": "Politique de confidentialité de Puzzle de blocs : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Puzzle de blocs (le « Service ») respecte ta vie privée et ne traite que les informations minimales décrites ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul ton score est envoyé à notre serveur sous forme de comptage anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue et ton record, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions risquent alors de mal fonctionner."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon tes visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier tes préférences, consulte les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs agrégés qui ne gardent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes). Rien de tout cela ne t’identifie personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 29 octobre 2026."
      ]
    ],
    "back": "← Retour au Puzzle de blocs"
  }
};
