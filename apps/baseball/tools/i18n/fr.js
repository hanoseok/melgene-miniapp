/* Taureaux et vaches (숫자 야구 / number baseball) — fr
 * Rules live in baseball-core.js; this file holds every visible string.
 * Keys ending in Html are raw HTML (<br>, <em> only); privacy.sections bodies are HTML too.
 * Placeholders: {n} {d} {pct} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap",
    "display": "'Fredoka'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Taureaux et vaches – jeu de chiffres à deviner",
    "description": "Jouez gratuitement à Taureaux et vaches (Bulls and Cows, baseball des nombres)\u202f: devinez un nombre secret de 3 ou 4 chiffres grâce aux indices. Meilleur score par niveau.",
    "ogTitle": "Taureaux et vaches ⚾ Saurez-vous trouver le nombre secret\u202f?",
    "ogDescription": "Un nombre secret sans chiffre répété. Proposez-en un, lisez les indices et trouvez-le en un minimum de coups."
  },
  "siteName": "Taureaux et vaches – baseball des nombres",
  "privacyLink": "Confidentialité",
  "start": {
    "badge": "⚾ Baseball des nombres",
    "h1Kicker": "Taureaux et vaches",
    "h1Html": "Trouvez le code<br><em>secret</em>\u202f!",
    "hook": "L’ordinateur a choisi un nombre secret sans chiffre répété. Proposez un nombre, lisez les indices et trouvez le code.",
    "how": "Bien placé = bon chiffre, bonne place · Mal placé = bon chiffre, mauvaise place · Raté = aucun",
    "levelLabel": "Choisissez le nombre de chiffres",
    "levels": {
      "d3": "3 chiffres",
      "d4": "4 chiffres"
    },
    "levelSub": {
      "d3": "Classique",
      "d4": "Plus dur"
    },
    "timer": "Afficher le chrono",
    "start": "Commencer →"
  },
  "play": {
    "tries": "Essais",
    "time": "Temps",
    "slotAria": "Chiffre {n}",
    "enter": "Valider",
    "del": "Effacer",
    "giveUp": "Abandonner",
    "giveUpSure": "Touchez encore pour voir la réponse",
    "historyTitle": "Vos propositions",
    "historyEmpty": "Saisissez un nombre pour faire une première proposition.",
    "errLen": "Saisissez {n} chiffres",
    "errDup": "Les chiffres ne peuvent pas se répéter",
    "errAgain": "Vous avez déjà essayé ce nombre",
    "strike": "Bien placé",
    "ball": "Mal placé",
    "out": "Raté",
    "legend": "Bien placé\u202f: bon chiffre, bonne place · Mal placé\u202f: bon chiffre, mauvaise place"
  },
  "result": {
    "done": "Trouvé\u202f!",
    "gaveUp": "La réponse était",
    "triesCaption": "Essais",
    "timeLabel": "Temps",
    "secretLabel": "Nombre secret",
    "sec": "s",
    "best": "Meilleur score à ce niveau\u202f: {n}",
    "newBest": "Nouveau record personnel\u202f!",
    "top": "Top {n} %",
    "beat": "Moins d’essais que {pct} % des joueurs",
    "beatAll": "Moins d’essais que tous les autres résultats",
    "others": "Comparé à {n} autres résultats à ce niveau",
    "comparing": "Comparaison avec les autres joueurs…",
    "retry": "Rejouer",
    "shareTitle": "Taureaux et vaches – saurez-vous trouver le nombre secret\u202f?",
    "shareText": "J’ai trouvé un nombre de {d} chiffres en {n} essais ⚾ Saurez-vous faire mieux\u202f?"
  },
  "og": {
    "brand": "⚾ Taureaux et vaches",
    "defaultKicker": "Jeu de chiffres gratuit",
    "defaultTitle": "Trouverez-vous le nombre secret\u202f?",
    "defaultDesc": "Bien placé · Mal placé · Raté"
  },
  "faq": [
    {
      "q": "Comment jouer à Taureaux et vaches\u202f?",
      "a": "L’ordinateur choisit un nombre secret dont tous les chiffres sont différents. Saisissez un nombre de même longueur, lui aussi sans chiffre répété, puis validez. Un chiffre bien placé est un «\u202fbien placé\u202f», un bon chiffre au mauvais endroit est un «\u202fmal placé\u202f», et sans aucune correspondance c’est «\u202fraté\u202f». Vous gagnez quand tous les chiffres sont bien placés."
    },
    {
      "q": "Le nombre secret peut-il commencer par 0\u202f? Les chiffres peuvent-ils se répéter\u202f?",
      "a": "Il peut commencer par 0, par exemple 072, mais un chiffre n’apparaît jamais deux fois. Vos propositions ne doivent pas répéter de chiffres non plus. Un nombre déjà essayé n’est pas recompté\u202f: seules les nouvelles propositions augmentent vos essais."
    },
    {
      "q": "Y a-t-il un bouton d’indice ou une limite d’essais\u202f?",
      "a": "Ni indice ni limite. C’est un pur jeu de déduction\u202f: moins vous avez besoin d’essais, mieux c’est. Si vous bloquez, touchez Abandonner pour voir la réponse et lancer une nouvelle partie. Le chrono est facultatif et ne s’affiche que si vous l’activez."
    },
    {
      "q": "Quelle est la différence entre 3 et 4 chiffres\u202f?",
      "a": "Avec 3 chiffres, il y a 720 nombres secrets possibles\u202f; avec 4 chiffres, il y en a beaucoup plus, tous aussi probables. Votre meilleur score est enregistré séparément pour chaque niveau dans ce navigateur."
    },
    {
      "q": "D’où vient le «\u202fTop %\u202f»\u202f?",
      "a": "Quand vous trouvez le nombre, votre nombre d’essais est comparé aux vrais résultats des autres joueurs du même niveau. S’il n’y a pas encore d’autre résultat, la comparaison n’est pas affichée. Les parties abandonnées ne comptent pas."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Taureaux et vaches",
    "description": "Politique de confidentialité de Taureaux et vaches : résultats anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Taureaux et vaches (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. Quand vous trouvez le nombre, seuls le niveau et votre nombre d’essais sont envoyés à notre serveur sous forme de comptage anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation du Service, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de votre navigateur pour retenir votre langue et vos records, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur\u202f; certaines fonctions pourraient alors ne pas marcher comme prévu."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon vos visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier vos préférences\u202f: <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Pour améliorer le Service, nous pouvons utiliser Google Analytics (GA4) et nos propres compteurs qui ne gardent que des totaux quotidiens par langue (pages vues, parties commencées et terminées, notes en étoiles). Rien de tout cela ne vous identifie personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, veuillez contacter l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 18 octobre 2026."
      ]
    ],
    "back": "← Retour à Taureaux et vaches"
  }
};
