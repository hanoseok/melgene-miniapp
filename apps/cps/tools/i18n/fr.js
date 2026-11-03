/* CPS Test — fr (click speed test / cps). Same keys as en.js; see en.js header for rules and placeholders. */
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
    "title": "Test de clics · CPS test – clics par seconde",
    "description": "Test de clics (CPS test) : clique le plus vite possible pendant 1, 5 ou 10 secondes et découvre tes clics par seconde et ton niveau. Gratuit, sur mobile et PC.",
    "ogTitle": "Test de clics 🖱️ Combien de clics par seconde ?",
    "ogDescription": "Clique ou tape comme un fou pendant 1, 5 ou 10 secondes et obtiens ton score CPS et ton badge."
  },
  "siteName": "Test de clics",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🖱️ Tes doigts sont-ils rapides ?",
    "h1Kicker": "Test de clics · CPS test",
    "h1Html": "Combien de clics<br><em>par seconde ?</em>",
    "hook": "Clique ou tape sur la grande zone le plus vite possible avant la fin du temps. Ton score, ce sont tes clics par seconde.",
    "modeLabel": "Durée du test",
    "modeValue": "{n} s",
    "how": "Le chrono démarre au premier clic · souris et doigts uniquement",
    "start": "C’est parti →",
    "facts": "1, 5 ou 10 secondes · mobile ou PC · bats ton record"
  },
  "play": {
    "mode": "Test de {n} s",
    "time": "Temps",
    "clicks": "Clics",
    "cps": "CPS",
    "ready": "Clique ici pour commencer",
    "readySub": "Le chrono démarre à ton premier clic",
    "go": "Continue à cliquer !",
    "over": "Temps écoulé !",
    "cancelled": "Tu as quitté la page, cet essai ne compte pas. Recommence !",
    "change": "← Changer de mode",
    "zoneAria": "Zone de clic",
    "sec": "{n} s"
  },
  "result": {
    "over": "Ton résultat",
    "mode": "Test de {n} s",
    "unit": "CPS",
    "clicks": "Clics",
    "time": "Durée",
    "tierLabel": "Ton badge de vitesse",
    "tiers": [
      "🐢 Tortue tranquille",
      "🐇 Lapin vif",
      "🐆 Doigts de guépard",
      "⚡ Cliqueur éclair",
      "🔥 Pro du jitter click",
      "🚀 Machine à cliquer"
    ],
    "newBest": "Nouveau record perso !",
    "pb": "Ton record dans ce mode : {n} CPS",
    "tooFast": "Plus de 25 CPS, c’est au-delà de la vitesse humaine : ce score n’est ni enregistré ni comparé.",
    "top": "Top {n} %",
    "beat": "Plus rapide que {pct} % des joueurs",
    "beatAll": "Plus rapide que tous les autres joueurs pour l’instant",
    "others": "Comparé à {n} autres parties dans ce mode",
    "comparing": "Comparaison avec les autres joueurs…",
    "shareTitle": "Test de clics",
    "shareText": "J’ai fait {cps} CPS ({clicks} clics en {sec} s) 🖱️ {tier}. Tu cliques plus vite ?",
    "retry": "Rejouer"
  },
  "og": {
    "brand": "🖱️ Test de clics",
    "defaultKicker": "Test de clics gratuit",
    "defaultTitle": "Combien de clics par seconde peux-tu faire ?",
    "defaultDesc": "1, 5 ou 10 secondes · mobile ou PC"
  },
  "faq": [
    {
      "q": "Comment fonctionne le test de clics ?",
      "a": "Choisis une durée de 1, 5 ou 10 secondes puis appuie sur le bouton. Le chrono démarre dès ton premier clic ou appui dans la grande zone, et ce premier clic compte déjà. Clique le plus vite possible jusqu’à la fin du temps. Ton CPS, c’est le nombre de clics divisé par la durée du test en secondes."
    },
    {
      "q": "C’est quoi, un bon score CPS ?",
      "a": "En cliquant normalement, la plupart des gens tournent autour de 5 à 8 clics par seconde. Les joueurs qui utilisent des techniques comme le jitter click ou le butterfly click dépassent souvent 10. Le mode 1 seconde donne en général le chiffre le plus haut, car on n’a pas le temps de fatiguer."
    },
    {
      "q": "Le clavier ou plusieurs doigts, ça compte ?",
      "a": "Seuls les clics de souris et les appuis dans la zone comptent. Les touches du clavier sont ignorées exprès, car une touche maintenue se répète toute seule. Sur écran tactile, chaque doigt qui touche la zone compte pour un clic : tu peux utiliser deux doigts ou tes deux pouces."
    },
    {
      "q": "Pourquoi mon essai n’a-t-il pas compté ?",
      "a": "Si tu changes d’onglet, verrouilles ton téléphone ou quittes la page pendant que le chrono tourne, l’essai est annulé pour rester équitable. Les scores au-delà de 25 clics par seconde sont impossibles pour un doigt humain : ils ne sont ni enregistrés ni comparés aux autres joueurs."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test de clics",
    "description": "Politique de confidentialité du Test de clics : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test de clics (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’un test, seul votre score (vos clics par seconde) est envoyé à notre serveur sous forme de comptage anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement, comme décrit ci-dessous."
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
        "Cette politique s’applique à partir du 4 novembre 2026."
      ]
    ],
    "back": "← Retour au Test de clics"
  }
};
