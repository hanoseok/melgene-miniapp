/* Snowball Fight — fr (Boules de neige)
 * Rules live in snowball-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + a three-step how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {tier} — keep them as-is when translating.
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
    "title": "Bataille de boules de neige – lance et esquive",
    "description": "Jeu de bataille de boules de neige gratuit en ligne : vise les enfants qui surgissent derrière leurs forts et baisse-toi derrière ton mur quand une boule arrive.",
    "ogTitle": "Boules de neige ☃️ Combien de touches en 60 secondes ?",
    "ogDescription": "Lance vite, baisse-toi à temps et ne touche pas le chien. Trois cœurs, une minute."
  },
  "siteName": "Boules de neige",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "☃️ Neige fraîche, poches pleines",
    "h1Kicker": "Bataille de boules de neige",
    "h1Html": "Vise, lance<br><em>et baisse-toi</em>",
    "hook": "De l’autre côté du jardin, les enfants se cachent derrière leurs forts de neige. Touche-les quand ils pointent le nez, et baisse-toi vite quand l’un d’eux arme son bras.",
    "how": {
      "throw": "Tape pour lancer",
      "duck": "Au ❗, baisse-toi",
      "avoid": "Épargne les amis"
    },
    "start": "Lancer la bataille →",
    "facts": "Partie de 60 s · 3 cœurs · mobile ou PC"
  },
  "play": {
    "score": "Score",
    "time": "Temps",
    "lives": "Cœurs",
    "secUnit": "s",
    "pause": "Pause",
    "paused": "Pause",
    "resume": "Retour au combat",
    "hint": "Touche le jardin pour commencer",
    "fieldAria": "Jardin enneigé : touche un enfant pour lancer une boule, maintiens le mur ou le bouton Baisse-toi pour te cacher",
    "duck": "Baisse-toi (maintiens)",
    "duckAria": "Se cacher derrière le mur tant que c’est appuyé",
    "combo": "Combo ×{n}",
    "golden": "Doré ! +{n}",
    "oops": "Un ami ! −{n}",
    "miss": "Raté",
    "block": "Paré !",
    "ouch": "Aïe !",
    "timeUp": "Temps écoulé !",
    "out": "Enseveli !"
  },
  "result": {
    "over": "Fin de la bataille",
    "reasonTime": "Tu as tenu toute la minute",
    "reasonOut": "Touché trois fois, éliminé",
    "unit": "pts",
    "newBest": "Nouveau record perso !",
    "best": "Ton record : {n} pts",
    "hits": "Touches",
    "accuracy": "Précision",
    "bestCombo": "Meilleur combo",
    "tierLabel": "Ton rang de bataille",
    "tiers": [
      "🧤 Doigts gelés",
      "❄️ Bleu des neiges",
      "⛄ Habitué du jardin",
      "🎯 Fin tireur",
      "⭐ Pilleur de forts",
      "🏆 Légende vivante"
    ],
    "top": "Top {n} %",
    "beat": "Mieux que {pct} % des joueurs",
    "beatAll": "Mieux que tous les autres joueurs jusqu’ici",
    "others": "Comparé à {n} autres parties",
    "comparing": "Comparaison avec les autres joueurs…",
    "shareTitle": "Boules de neige",
    "shareText": "J’ai marqué {n} pts en 60 secondes de bataille de boules de neige ☃️ {tier}. Tu fais mieux ?",
    "retry": "Rejouer"
  },
  "og": {
    "brand": "☃️ Boules de neige",
    "defaultKicker": "Jeu de boules de neige en ligne",
    "defaultTitle": "Combien de touches en 60 secondes ?",
    "defaultDesc": "Lance · baisse-toi · épargne le chien"
  },
  "faq": [
    {
      "q": "Comment lancer et se baisser ?",
      "a": "Touche (ou clique) un enfant qui sort la tête de son fort et une boule de neige part vers lui. Pour te cacher, maintiens le bouton Baisse-toi ou le mur de neige en bas. Tu ne peux pas lancer quand tu es baissé. Sur ordinateur : ← et → pour choisir un fort, ↑ ou F pour lancer, Espace ou ↓ maintenu pour te baisser."
    },
    {
      "q": "Comment savoir qu’une boule arrive ?",
      "a": "Un enfant qui va lancer lève le bras et un ❗ rouge apparaît au-dessus de lui. Touche-le avant et il ne lancera pas. Si la boule est déjà en l’air, un grand ❗ s’affiche au-dessus de ton mur et le bouton Baisse-toi devient rouge : garde-le enfoncé jusqu’à ce que la boule s’écrase."
    },
    {
      "q": "Comment marque-t-on des points ?",
      "a": "Chaque touche rapporte des points, un peu plus pour un bonhomme de neige que pour un enfant. Plusieurs touches d’affilée forment un combo qui augmente la valeur de chaque lancer, et un raté le remet à zéro. Le rare bonhomme de neige doré vaut le plus. Le chien et l’enfant au drapeau blanc sont des amis : les toucher fait perdre des points."
    },
    {
      "q": "Quand une partie se termine-t-elle ?",
      "a": "Une partie dure 60 secondes, ou s’arrête plus tôt si tu es touché trois fois. Le rythme s’accélère à mesure que le temps passe. La partie se met en pause toute seule si tu changes d’onglet ou verrouilles ton téléphone."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Boules de neige",
    "description": "Politique de confidentialité du jeu de boules de neige : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le jeu de boules de neige (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
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
        "Cette politique est en vigueur depuis le 14 novembre 2026."
      ]
    ],
    "back": "← Retour au jeu de boules de neige"
  }
};
