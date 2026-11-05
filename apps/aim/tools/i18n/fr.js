/* Aim Trainer — fr (Aim trainer)
 * Rules live in aim-core.js; this file holds every visible string.
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * Start screen = teaser + mode choice + a one-line how-to. FAQ appears only in the shared end screen.
 * Placeholders: {n} {pct} {avg} {hits} {acc} {tier} — keep them as-is when translating.
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
    "title": "Aim trainer · Entraînement à la visée en ligne",
    "description": "Aim trainer gratuit : touche 30 cibles le plus vite possible ou un maximum en 30 secondes. Temps moyen, précision et classement, sur mobile ou PC.",
    "ogTitle": "Aim trainer 🎯 Ta visée est-elle rapide et précise ?",
    "ogDescription": "Touche 30 cibles ou joue 30 secondes contre la montre et découvre ton temps moyen, ta précision et ton badge de visée."
  },
  "siteName": "Aim trainer",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🎯 Ta visée vaut combien ?",
    "h1Kicker": "Aim trainer · Entraînement à la visée",
    "h1Html": "Vise juste,<br><em>clique vite</em>",
    "hook": "Des cibles surgissent n’importe où dans le cadre. Touche-les avant qu’elles disparaissent et découvre si ta main est rapide et précise.",
    "modeLabel": "Mode",
    "modes": {
      "classic": {
        "name": "Classique",
        "sub": "30 cibles"
      },
      "timed": {
        "name": "Chrono",
        "sub": "30 secondes"
      }
    },
    "how": "Touche la cible centrale pour démarrer · clic à côté = raté",
    "start": "C’est parti →",
    "facts": "Souris, pavé tactile ou doigt · mobile ou PC · bats ton record"
  },
  "modes": {
    "classic": "Classique · 30 cibles",
    "timed": "Chrono · 30 secondes"
  },
  "play": {
    "time": "Temps",
    "hits": "Touchées",
    "acc": "Précision",
    "ready": "Touche la cible pour commencer",
    "readySub": "Le chrono démarre à cette première touche",
    "done": "Terminé !",
    "timeUp": "Temps écoulé !",
    "cancelled": "Tu as quitté la page, cette partie ne compte pas. Réessaie !",
    "change": "← Changer de mode",
    "areaAria": "Zone de visée"
  },
  "result": {
    "over": "Ton résultat",
    "scoreClassic": "Temps moyen par cible",
    "scoreTimed": "Cibles touchées",
    "unitMs": "ms",
    "unitHits": "cibles",
    "acc": "Précision",
    "avg": "Temps moyen",
    "misses": "Ratés",
    "total": "Temps total",
    "escaped": "Envolées",
    "msValue": "{n} ms",
    "secValue": "{n} s",
    "tierLabel": "Ton badge de visée",
    "tiers": [
      "🐢 Échauffement",
      "🙂 Visée tranquille",
      "🎯 Œil vif",
      "🦅 Œil de lynx",
      "⚡ Roi du flick",
      "🏆 Légende de la visée"
    ],
    "newBest": "Nouveau record perso !",
    "pbClassic": "Ton record en Classique : {n} ms",
    "pbTimed": "Ton record en Chrono : {n} cibles",
    "invalid": "C’est plus rapide que ce qu’un humain peut faire, donc ce score n’est ni enregistré ni comparé.",
    "top": "Top {n} %",
    "beat": "Meilleur que {pct} % des joueurs",
    "beatAll": "Meilleur que tous les autres joueurs pour l’instant",
    "others": "Comparé à {n} autres parties dans ce mode",
    "comparing": "Comparaison avec les autres joueurs…",
    "shareTitle": "Aim trainer",
    "shareClassic": "{avg} ms en moyenne par cible avec {acc} % de précision 🎯 {tier}. Tu vises plus vite ?",
    "shareTimed": "{hits} cibles en 30 secondes avec {acc} % de précision 🎯 {tier}. Tu fais mieux ?",
    "retry": "Rejouer"
  },
  "og": {
    "brand": "🎯 Aim trainer",
    "defaultKicker": "Test de visée gratuit",
    "defaultTitle": "Ta visée est-elle rapide et précise ?",
    "defaultDesc": "30 cibles ou 30 secondes · mobile ou PC"
  },
  "faq": [
    {
      "q": "Comment fonctionne cet aim trainer ?",
      "a": "Choisis Classique ou Chrono, appuie sur le bouton, puis touche la cible au centre du cadre pour commencer. En Classique, 30 cibles apparaissent une par une et ton score est le temps moyen pour toucher chacune. En Chrono, tu as 30 secondes pour en toucher le plus possible ; chaque cible rétrécit peu à peu et s’envole si tu es trop lent."
    },
    {
      "q": "C’est quoi, un bon score ?",
      "a": "En Classique, la plupart des gens tournent entre 500 et 800 ms par cible, et les bons joueurs passent sous les 450. En Chrono, 35 à 45 cibles est un résultat courant. La précision compte aussi : si moins de 70 % de tes clics touchent une cible, ton badge descend d’un niveau."
    },
    {
      "q": "Je peux jouer à la souris, au pavé tactile ou au doigt ?",
      "a": "Oui. Clics de souris, pavé tactile, stylet et doigt fonctionnent tous ; le clavier n’est pas utilisé. Seuls les clics dans la zone de jeu comptent. Les scores ne sont pas vraiment comparables d’un appareil à l’autre : souris et téléphone peuvent donner des résultats assez différents."
    },
    {
      "q": "Pourquoi ma partie n’a-t-elle pas compté ?",
      "a": "Si tu changes d’onglet, verrouilles ton téléphone ou quittes la page pendant une partie, elle est annulée pour rester équitable. Les résultats plus rapides que les réflexes humains, comme une moyenne sous 150 ms par cible, ne sont ni enregistrés ni comparés aux autres joueurs."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Aim trainer",
    "description": "Politique de confidentialité de l’Aim trainer : scores anonymes, cookies, publicité et statistiques.",
    "h1": "Politique de confidentialité",
    "introHtml": "L’Aim trainer (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service fonctionne sans compte ni connexion. À la fin d’une partie, seul votre score (temps moyen par cible ou nombre de cibles touchées) est envoyé à notre serveur sous forme de comptage anonyme, sans nom ni identifiant personnel. Certaines informations peuvent être collectées automatiquement, comme décrit ci-dessous."
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
        "Cette politique s’applique à partir du 6 novembre 2026."
      ]
    ],
    "back": "← Retour à l’Aim trainer"
  }
};
