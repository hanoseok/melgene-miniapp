/* 집순이·집돌이 지수 테스트 — fr
 * questions[i].choices[j] 는 homebody-core.js QUESTIONS[i].choices[j] 와 같은 순서(점수는 core 에만 있다). 키 구조는 en.js 와 동일.
 * Keys ending in Html are raw HTML (start.h1Html: <br> 1개 + <em> 만). 결과 단계 6종 id 는 homebody-core.js ORDER 와 같다.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep as-is when translating.
 * 스포일러 금지: meta / og.default* / start / faq / loading 에는 결과 이름·질문 문구를 인용하지 않는다.
 * fonts: css = Google Fonts, display = 제목/버튼 글꼴 스택, wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap",
    "display": "'Comfortaa'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test casanier – Es-tu plutôt casanier ou casanière ?",
    "description": "Es-tu casanier ? Fais ce test casanier gratuit : 10 situations du quotidien, environ 1 minute, sans inscription. Découvre ton pourcentage de casanier et ton niveau d’amour pour le canapé.",
    "ogTitle": "Test casanier 🏠 À quel point es-tu casanier ?",
    "ogDescription": "Un test gratuit d’1 minute. Réponds à 10 situations du quotidien et obtiens ton % de casanier."
  },
  "siteName": "Test casanier",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🏠 Indice de casanier",
    "h1Kicker": "Test casanier",
    "h1Html": "À quel point es-tu<br><em>casanier</em> ?",
    "hook": "Dix petites situations pour savoir à quel point tu aimes ton chez-toi, et à quel point le monde extérieur doit se donner du mal.",
    "metaTime": "⏱️ Environ 1 minute",
    "metaCount": "🛋️ 10 questions",
    "start": "Voir mon niveau →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Calcul de tes points cocooning…",
    "sub": "Vérification du canapé"
  },
  "result": {
    "title": "Test casanier : je suis {name}",
    "eyebrow": "Ton profil casanier est",
    "strengthsLabel": "Tes super-pouvoirs",
    "othersLabel": "Comment les autres te voient",
    "bestLabel": "Duo idéal",
    "clashLabel": "Profil opposé",
    "meterLabel": "Niveau de casanier",
    "moreShare": "{pct} % des joueurs sont plus casaniers que toi",
    "shareText": "Je suis {name} {emoji} — « {vibe} » Et toi, tu es casanier à quel point ?",
    "shareTextPct": "Je suis casanier à {pct} % : {name} {emoji}. Et toi ?",
    "ctaStrong": "Un ami t’a partagé son résultat",
    "ctaSub": "Tu es casanier à quel point ? Ça prend 1 minute.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon niveau de casanier",
    "brand": "🏠 Test casanier",
    "defaultKicker": "Test casanier",
    "defaultTitle": "À quel point es-tu casanier ?",
    "defaultDesc": "10 situations du quotidien · environ 1 minute"
  },
  "faq": [
    {
      "q": "Comment est calculé mon pourcentage de casanier ?",
      "a": "Chaque réponse vaut de 0 à 10 points du côté « maison ». Les points de tes dix réponses sont additionnés puis ramenés sur une échelle de 0 à 100 : plus le pourcentage est élevé, plus tu penches pour rester chez toi."
    },
    {
      "q": "Casanier, est-ce la même chose qu’introverti ?",
      "a": "Pas exactement. L’introversion concerne la manière de recharger son énergie, être casanier concerne l’endroit où l’on aime passer son temps. Beaucoup d’extravertis adorent leur canapé et beaucoup d’introvertis adorent les longues balades."
    },
    {
      "q": "Ce test est-il scientifique ?",
      "a": "Non. C’est un petit quiz pour s’amuser et en discuter, pas une évaluation psychologique. Le résultat reflète seulement tes réponses du jour."
    },
    {
      "q": "Comment est calculé « plus casanier que X % des joueurs » ?",
      "a": "Nous comptons de façon anonyme dans quelle tranche de score chaque test terminé se situe. Dès qu’il y a au moins 20 résultats, nous comparons le tien aux autres. Cette ligne n’apparaît que sur ton propre résultat, et reste cachée tant qu’il n’y a pas assez de joueurs."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test casanier",
    "description": "Politique de confidentialité du Test casanier : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test casanier (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations nécessaire, comme décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service s’utilise sans inscription ni connexion. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quelle tranche de score est sortie, pour afficher la fréquence de chaque résultat."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de mal fonctionner."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon tes visites précédentes sur ce site et d’autres. Plus d’informations et réglages dans les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Nous conservons des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ils ne permettent pas de t’identifier."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique, contacte l’exploitant du site."
      ],
      [
        "6. Date d’effet",
        "Cette politique est en vigueur depuis le 21 octobre 2026."
      ]
    ],
    "back": "← Retour au test casanier"
  },
  "questions": [
    {
      "q": "Vendredi soir, le groupe de discussion s’illumine : « Un verre en ville ? »",
      "choices": [
        "Répondre « une prochaine fois » et rentrer ravi",
        "Y aller une heure, puis filer discrètement",
        "Contre-proposer : chez quelqu’un avec des plats à emporter",
        "Y aller et rester jusqu’à la fermeture"
      ]
    },
    {
      "q": "Un long week-end sans rien de prévu. Ton plan idéal ?",
      "choices": [
        "Faire son sac et partir sur un coup de tête",
        "Ne pas sortir de chez soi, exprès",
        "Une excursion d’une journée, puis retour dans mon lit",
        "Un café ou un parc tout près, puis retour à la maison"
      ]
    },
    {
      "q": "On sonne à la porte alors que tu n’attendais personne. Tu…",
      "choices": [
        "Ouvres, un peu surpris",
        "Regardes d’abord par le judas",
        "Adores ça : les visites surprises sont les meilleures",
        "Te figes et attends que la personne parte"
      ]
    },
    {
      "q": "Où aimerais-tu le plus vivre ?",
      "choices": [
        "Dans un logement calme avec mon petit coin à moi",
        "En plein cœur d’une ville animée",
        "Dans un nid où tout est à portée de main",
        "Dans un appartement avec un beau balcon près de l’animation"
      ]
    },
    {
      "q": "C’est un dimanche pluvieux. Ta première pensée ?",
      "choices": [
        "Le meilleur temps : plaid, thé, fenêtre",
        "Zut, tous mes plans tombent à l’eau",
        "Enfin une excuse parfaite pour rester chez moi",
        "Bon, je trouve une sortie à l’intérieur"
      ]
    },
    {
      "q": "Un ami t’invite à un événement dans deux semaines.",
      "choices": [
        "Je regarde d’abord mon agenda",
        "Je prépare déjà comment annuler avec élégance",
        "Je suis partant !",
        "Je dis oui, puis je stresse à l’approche"
      ]
    },
    {
      "q": "Tu rentres après une journée entière dehors. Tu te sens…",
      "choices": [
        "Plein d’énergie, prêt à continuer",
        "Agréablement fatigué",
        "Enfin : porte fermée, téléphone en silencieux",
        "Soulagé, comme une batterie qui se recharge"
      ]
    },
    {
      "q": "C’est l’heure du dîner. Où as-tu envie d’être ?",
      "choices": [
        "À cuisiner chez moi",
        "Dehors, mais dans un petit endroit tranquille",
        "Dans un restaurant animé plein de monde",
        "Sur le canapé avec une livraison et une série"
      ]
    },
    {
      "q": "Combien de jours d’affilée peux-tu rester chez toi sans tourner en rond ?",
      "choices": [
        "Un jour me suffit",
        "Des semaines, sans même m’en rendre compte",
        "Environ trois jours",
        "Une semaine, sans problème"
      ]
    },
    {
      "q": "Tu as un peu d’argent de côté. Tu le dépenses pour…",
      "choices": [
        "Une soirée entre amis",
        "Des billets de spectacle et des voyages",
        "Des gadgets, jeux ou streaming pour le canapé",
        "Un confort en plus : bon fauteuil, lampe, literie"
      ]
    }
  ],
  "types": {
    "wild": {
      "name": "Né pour dehors",
      "vibe": "Chez toi, c’est là où tu poses ton sac avant de ressortir.",
      "desc": "Ta porte d’entrée, c’est une porte à tambour. Une journée à l’intérieur te paraît perdue, et tes meilleures idées arrivent sur un sentier, dans un train ou sur une terrasse. Tu te recharges au contact des gens et du grand air, et tu collectionnes les plans comme d’autres les mugs. Ton logement sert surtout à dormir, se doucher et changer de chaussures.",
      "strengths": [
        "Énergie sans fin",
        "Dit oui à l’aventure",
        "Ne s’ennuie jamais"
      ],
      "others": "On te voit comme celui qui a toujours un plan et qui arrive à décoller tout le monde du canapé."
    },
    "roamer": {
      "name": "Vagabond du week-end",
      "vibe": "Plus dehors que dedans, mais fan de siestes.",
      "desc": "Tu adores sortir, surtout avec des amis, mais tu connais aussi le bonheur d’une soirée qui finit tôt. Ta semaine est pleine de projets, et une soirée tranquille à la maison est une récompense plus qu’une habitude. Tu aimes la variété : un nouveau café, une petite escapade, une rue que tu n’as pas encore explorée.",
      "strengths": [
        "Sociable et curieux",
        "Plans flexibles",
        "Fort pour lancer les choses"
      ],
      "others": "On te voit comme sympa et vivant, toujours partant pour un café, mais qui disparaît parfois pour se ressourcer."
    },
    "switch": {
      "name": "Jongleur d’ambiances",
      "vibe": "Moitié canapé, moitié ville, toujours adaptable.",
      "desc": "Tu apprécies une soirée animée et une soirée tranquille avec le même sourire. Aucune n’est un sacrifice : tu écoutes ton énergie du moment et tu la suis. Cette souplesse te rend agréable aussi bien pour les amis sortants que pour les casaniers. Ton seul dilemme : choisir quel côté écouter un vendredi.",
      "strengths": [
        "S’adapte à tout plan",
        "Écoute son énergie",
        "Agréable compagnie"
      ],
      "others": "On te voit comme quelqu’un de détendu et insaisissable, l’ami qui s’intègre à tous les plans."
    },
    "nester": {
      "name": "Cocon douillet",
      "vibe": "Heureux avec un plaid, une lampe et le plan de rester.",
      "desc": "Chez toi, c’est là où tu es le plus toi-même. Tu l’as rendu confortable exprès : la bonne lumière, le bon fauteuil, les bons snacks. Tu sors pour les gens qui comptent, mais tu gardes des soirées courtes et des sorties proches. Ta soirée idéale a une heure de début, une heure de fin et un canapé à proximité.",
      "strengths": [
        "Rend tout lieu douillet",
        "Dépense son énergie avec soin",
        "Super hôte chez lui"
      ],
      "others": "On te voit comme chaleureux et calme, l’ami chez qui tout le monde veut traîner."
    },
    "homebody": {
      "name": "Casanier certifié",
      "vibe": "Tes meilleurs plans sont ceux qu’on annule.",
      "desc": "Tu aimes vraiment être chez toi, et tu as arrêté de t’en excuser. Ton espace est ta station de recharge, ta salle de loisirs et ton refuge à la fois. Une invitation mérite une pause polie avant la réponse, et un week-end sans rien au calendrier est un cadeau. Tu n’es pas associal : tu choisis simplement tes sorties avec soin.",
      "strengths": [
        "Heureux seul",
        "Monde intérieur riche",
        "Protège sa tranquillité"
      ],
      "others": "On te voit comme calme, un peu mystérieux et étonnamment drôle une fois dans ton élément."
    },
    "legend": {
      "name": "Légende du foyer",
      "vibe": "La porte est une suggestion. Le canapé est un royaume.",
      "desc": "Tu as fait de rester chez toi un art. Les applis de livraison connaissent ton prénom, ton installation est optimisée et ta batterie sociale se recharge dans le silence. Tu peux passer des jours sans penser au monde extérieur et être parfaitement heureux. Quand tu sors, c’est pour quelque chose qui en vaut vraiment la peine, et tu prépares le retour avant de partir.",
      "strengths": [
        "Maître du confort",
        "Totalement autonome",
        "Zéro FOMO"
      ],
      "others": "On te voit comme une légende : rarement aperçu, toujours serein, et la personne à qui demander une bonne série."
    }
  }
};
