/* Ski Downhill — fr (Jeu de ski)
 * Les règles sont dans ski-core.js ; ce fichier ne contient que les textes affichés.
 * Les clés en Html sont insérées telles quelles (<br> et <em> seulement) ; les sections de privacy aussi.
 * Espace fine insécable ( ) avant ? ! : ; — garder les espaces réservés {n} {pct} {s} {c} {tier}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap",
    "display": "'Oswald'",
    "displayWeight": 600,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Jeu de ski en ligne – Descente et slalom",
    "description": "Jeu de ski en ligne\u202f: dévale une piste enneigée sans fin, évite sapins, rochers et bonshommes de neige, et passe les portes de slalom pour gagner des mètres bonus.",
    "ogTitle": "Jeu de ski ⛷️ Jusqu’où iras-tu avant la chute ?",
    "ogDescription": "Dévale une piste sans fin, file entre les portes de slalom et évite les sapins. Une chute et c’est fini."
  },
  "siteName": "Jeu de ski",
  "privacyLink": "Confidentialité",
  "start": {
    "badge": "⛷️ Poudreuse fraîche, piste infinie",
    "h1Kicker": "Jeu de ski en ligne",
    "h1Html": "Dévale la montagne<br><em>le plus loin possible</em>",
    "hook": "La piste ne s’arrête jamais et tes skis vont de plus en plus vite. Faufile-toi entre sapins et piquets, et vois combien de mètres tu tiens avant la gamelle.",
    "how": {
      "steer": "Appuie à gauche ou à droite",
      "gates": "Passe entre les piquets",
      "avoid": "Évite sapins et rochers"
    },
    "start": "En piste →",
    "facts": "Appui long ou touches ← → · mobile ou PC · bats ton record"
  },
  "play": {
    "dist": "Distance",
    "best": "Record",
    "pause": "Pause",
    "paused": "Pause",
    "resume": "Reprendre",
    "hint": "Touche pour t’élancer",
    "fieldAria": "Piste de ski\u202f: appuie sur la moitié gauche ou droite pour tourner",
    "gateOk": "+{n} m ×{c}",
    "gateMiss": "Porte ratée"
  },
  "result": {
    "over": "Ta descente",
    "unit": "m",
    "newBest": "Nouveau record perso !",
    "best": "Ton record : {n} m",
    "gates": "Portes passées",
    "time": "Temps de course",
    "timeValue": "{s} s",
    "tierLabel": "Ton niveau de ski",
    "tiers": [
      "🧊 Piste des oursons",
      "🟢 Piste verte",
      "🔵 Piste bleue",
      "⚫ Piste noire",
      "⚡ Bolide des neiges",
      "🏆 Légende des cimes"
    ],
    "top": "Top {n} %",
    "beat": "Plus loin que {pct} % des skieurs",
    "beatAll": "Plus loin que tous les autres skieurs jusqu’ici",
    "others": "Comparé à {n} autres descentes",
    "comparing": "Comparaison avec les autres skieurs…",
    "shareTitle": "Jeu de ski",
    "shareText": "J’ai dévalé {n} m de piste ⛷️ {tier}. Et toi, jusqu’où iras-tu ?",
    "retry": "Rechausser les skis"
  },
  "og": {
    "brand": "⛷️ Jeu de ski",
    "defaultKicker": "Jeu de ski en ligne",
    "defaultTitle": "Jusqu’où iras-tu avant la chute ?",
    "defaultDesc": "Piste infinie · portes de slalom · mobile ou PC"
  },
  "faq": [
    {
      "q": "Comment diriger le skieur ?",
      "a": "Garde le doigt ou la souris appuyé sur la moitié gauche ou droite de la piste, ou maintiens les touches ← → (ou A / D). Le skieur glisse en douceur de ce côté\u202f; relâche pour repartir tout droit. La descente commence à ta première touche."
    },
    {
      "q": "À quoi servent les piquets ?",
      "a": "Deux piquets de la même couleur forment une porte. Passe entre les deux pour gagner des mètres bonus, et enchaîne les portes pour faire monter le combo et grossir chaque bonus. Rater une porte ne termine pas la descente, mais remet le combo à zéro."
    },
    {
      "q": "Comment la distance est-elle comptée ?",
      "a": "On additionne les mètres descendus et les bonus des portes. Plus tu vas loin, plus ça va vite, et la descente s’arrête dès que tu touches un sapin, un rocher ou un bonhomme de neige. Ton record est gardé dans ce navigateur."
    },
    {
      "q": "Et si je change d’onglet ?",
      "a": "Le jeu se met en pause tout seul quand tu quittes la page ou verrouilles ton téléphone. Appuie sur Reprendre (ou la touche P) pour repartir exactement là où tu t’étais arrêté."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Jeu de ski",
    "description": "Politique de confidentialité du jeu de ski : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le jeu de ski (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’une descente, seule votre distance en mètres est envoyée à notre serveur sous forme de compteur anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement pendant l’utilisation, comme décrit ci-dessous."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue et votre record, afficher des publicités et comprendre l’utilisation du Service. Vous pouvez les refuser ou les supprimer dans les réglages de votre navigateur\u202f; certaines fonctions peuvent alors ne pas marcher comme prévu."
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
        "Cette politique est en vigueur depuis le 8 novembre 2026."
      ]
    ],
    "back": "← Retour au jeu de ski"
  }
};
