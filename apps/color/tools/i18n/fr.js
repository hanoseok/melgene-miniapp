/* Personal Color Test (fr)
 * 8 result ids (springlight springbright summerlight summermute autumnmute autumndeep winterbright winterdeep);
 * questions[i].choices[j] follow color-core.js QUESTIONS[i].w[j] (the [warm/cool, light/deep, bright/muted] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = the result name as people would search it — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the real server share. Swatch colors live in color-core.js.
 * A fun self-check, not a professional draping analysis (result disclaimer, FAQ, guide).
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&display=swap",
    "display": "'Playfair Display'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test de colorimétrie : quelle saison de couleurs es-tu ?",
    "description": "Fais le test de colorimétrie : 12 questions à vérifier devant un miroir, environ 2 minutes, sans photo ni inscription. Découvre ta palette de saison. Juste pour le plaisir.",
    "ogTitle": "Test de colorimétrie 🎨 Quelles couleurs te donnent bonne mine ?",
    "ogDescription": "Un test de colorimétrie saisonnière en 12 questions devant le miroir. Découvre ton sous-ton et tes meilleures nuances."
  },
  "siteName": "Test de colorimétrie",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🎨 Auto-test au miroir",
    "h1Kicker": "Test de colorimétrie",
    "h1Html": "Quelles couleurs te donnent<br>vraiment <em>bonne mine</em> ?",
    "hook": "Prends un miroir et installe-toi à la lumière du jour. Réponds à 12 questions rapides sur ta peau, tes cheveux, tes yeux et les couleurs qu’on te complimente, et découvre ta palette de saison.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🪞 12 questions",
    "start": "Mes couleurs →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "On mélange ta palette…",
    "sub": "Chaque nuance passe à la lumière"
  },
  "result": {
    "title": "Ma colorimétrie : {name}",
    "metaDesc": "Résultat du test de colorimétrie : {name}. {vibe} Découvre tes meilleures couleurs, celles à éviter et des conseils maquillage, cheveux et bijoux.",
    "eyebrow": "Ta saison de couleurs est",
    "gaugeLabel": "Vers où penchent tes réponses",
    "axes": [
      ["Chaud", "Froid"],
      ["Clair", "Profond"],
      ["Lumineux", "Doux"]
    ],
    "paletteLabel": "Tes meilleures couleurs",
    "avoidLabel": "Couleurs à doser",
    "avoidNote": "Pas interdites, juste moins flatteuses près du visage. Garde-les pour les chaussures, les sacs ou les pantalons.",
    "makeupLabel": "Maquillage",
    "hairLabel": "Couleur de cheveux",
    "jewelryLabel": "Bijoux",
    "disclaimer": "Un auto-test ludique, pas une vraie analyse colorimétrique. Un drapage professionnel se fait avec des tissus sous une lumière maîtrisée, et l’éclairage, les écrans et le maquillage changent la perception des couleurs.",
    "sameShare": "{pct} % des gens ont obtenu cette palette",
    "shareText": "Ma colorimétrie : {name} {emoji} « {vibe} » Et toi, c’est quoi ta saison ?",
    "ctaStrong": "Quelqu’un t’a partagé ses couleurs",
    "ctaSub": "Plutôt chaud ou froid ? Découvre-le en 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Ma colorimétrie",
    "brand": "🎨 Test de colorimétrie",
    "defaultKicker": "Test de colorimétrie saisonnière",
    "defaultTitle": "Quelles couleurs te donnent bonne mine ?",
    "defaultDesc": "12 questions devant le miroir · 2 minutes"
  },
  "faq": [
    {
      "q": "Comment le test choisit-il mes couleurs ?",
      "a": "Chaque réponse fait bouger trois curseurs : sous-ton chaud ou froid, clair ou profond, lumineux ou doux. Ton résultat est la palette de saison où ces trois curseurs se rejoignent. Les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "Est-ce aussi fiable qu’une analyse chez un coloriste ?",
      "a": "Non. C’est un auto-test ludique basé sur ce que tu peux observer dans un miroir. Un professionnel pose des tissus de différentes couleurs près de ton visage sous une lumière neutre, ce qu’un questionnaire ne peut pas faire. Vois ton résultat comme un point de départ pour expérimenter."
    },
    {
      "q": "Comment obtenir un résultat plus juste ?",
      "a": "Réponds à la lumière naturelle, près d’une fenêtre, sans maquillage et les cheveux attachés. Les ampoules, les filtres du téléphone et les cheveux colorés peuvent rendre les couleurs plus chaudes ou plus froides qu’elles ne le sont vraiment."
    },
    {
      "q": "Mes réponses ou mes photos sont-elles enregistrées ?",
      "a": "Le test ne demande jamais de photo. Tes réponses sont calculées dans ton navigateur et ne sont pas conservées. Nous comptons seulement, de façon anonyme, quel résultat est sorti, pour afficher sa fréquence."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test de colorimétrie",
    "description": "Politique de confidentialité du Test de colorimétrie : utilisation des cookies, de la publicité et des statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test de colorimétrie (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations nécessaires, comme décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Vous pouvez utiliser le Service sans inscription ni connexion, et il ne demande jamais de photo. Vos réponses sont calculées dans votre navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quel résultat est sorti, afin d’indiquer la fréquence de chaque résultat."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de votre navigateur pour mémoriser votre langue, afficher des publicités et comprendre comment le Service est utilisé. Vous pouvez les refuser ou les supprimer dans les paramètres de votre navigateur ; certaines fonctionnalités risquent alors de ne pas fonctionner correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et sur d’autres sites. Pour en savoir plus et modifier vos préférences de personnalisation des annonces, rendez-vous dans les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Nous conservons des totaux quotidiens anonymes (pages vues, tests terminés, notes) afin d’améliorer le Service. Ces totaux ne permettent pas de vous identifier personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question concernant cette politique de confidentialité, veuillez contacter l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique est en vigueur depuis le 23 octobre 2026."
      ]
    ],
    "back": "← Retour au Test de colorimétrie"
  },
  "questions": [
    {
      "q": "À la lumière du jour, regarde les veines à l’intérieur de ton poignet. De quelle couleur sont-elles ?",
      "choices": [
        "Plutôt bleues ou violettes",
        "Plutôt vertes ou kaki",
        "Un mélange des deux, difficile à dire"
      ]
    },
    {
      "q": "Quels bijoux mettent le plus ta peau en valeur ?",
      "choices": [
        "L’or jaune",
        "L’argent ou le platine",
        "L’or rose ou un métal doux, brossé",
        "Des pièces brillantes et voyantes, peu importe le métal"
      ]
    },
    {
      "q": "Après une heure au soleil sans crème solaire, ta peau en général…",
      "choices": [
        "Rougit et brûle, et bronze à peine",
        "Rougit un peu d’abord, puis hâle légèrement",
        "Dore et bronze facilement",
        "Brûle rarement et fonce un peu"
      ]
    },
    {
      "q": "Tiens un haut blanc pur puis un haut ivoire ou crème sous ton menton. Lequel te va le mieux ?",
      "choices": [
        "Le blanc pur. J’ai l’air frais et lumineux",
        "L’ivoire ou le crème. Le blanc me durcit les traits",
        "Franchement, je ne vois pas de différence"
      ]
    },
    {
      "q": "Quelle couleur de base foncée te va le mieux, juste à côté du visage ?",
      "choices": [
        "Le noir profond. Net et marquant",
        "Le chocolat ou le camel",
        "Un anthracite doux ou le marine. Le noir me paraît lourd",
        "Aucune : le crème ou le beige clair me vont mieux"
      ]
    },
    {
      "q": "Quelle est ta couleur de cheveux naturelle (ou celle que tu avais enfant) ?",
      "choices": [
        "Très foncée, presque noire",
        "Châtain moyen à foncé, avec des reflets roux ou dorés",
        "Châtain cendré ou blond terne",
        "Claire : châtain doré, blond vénitien ou blond"
      ]
    },
    {
      "q": "Comment décrirais-tu tes yeux ?",
      "choices": [
        "Foncés et intenses, avec un blanc très net",
        "Noisette chaud, ambre ou brun doré",
        "Gris-brun ou gris-vert doux, aux nuances fondues",
        "Clairs et pétillants, avec un contour bien marqué"
      ]
    },
    {
      "q": "Quelles couleurs de vêtements te valent le plus de compliments ?",
      "choices": [
        "Des couleurs vives comme le bleu cobalt ou le rose fuchsia",
        "Des teintes douces et poudrées comme le vieux rose ou le vert sauge",
        "Des pastels légers et aériens",
        "Des teintes riches et profondes comme le bordeaux ou le vert forêt"
      ]
    },
    {
      "q": "Quel est le contraste entre tes cheveux et ta peau ?",
      "choices": [
        "Fort. Mes cheveux ressortent nettement sur ma peau",
        "Plutôt moyen",
        "Faible et clair. Les deux sont doux et pâles",
        "Faible et profond. Les deux sont foncés et de ton proche"
      ]
    },
    {
      "q": "Sans maquillage, tes lèvres et tes joues sont…",
      "choices": [
        "Bien rosées",
        "Pêche ou corail",
        "Pâles et beiges, sans beaucoup de couleur",
        "Naturellement foncées, presque baie"
      ]
    },
    {
      "q": "Quelle teinte de blush paraît la plus naturelle sur toi ?",
      "choices": [
        "Pêche ou corail",
        "Rose layette ou vieux rose",
        "Terracotta ou brique douce",
        "Baie ou prune"
      ]
    },
    {
      "q": "Quelle ambiance te ressemble le plus dans le miroir ?",
      "choices": [
        "Ensoleillée et fraîche, comme une citronnade en pique-nique",
        "Aérienne et douce, comme la lavande dans la brume du matin",
        "Chaleureuse et riche, comme un thé aux épices au coin du feu",
        "Nette et intense, comme les lumières de la ville la nuit"
      ]
    }
  ],
  "types": {
    "springlight": {
      "name": "Printemps clair",
      "word": "printemps clair",
      "vibe": "Chaleureuse, délicate et pleine de lumière matinale.",
      "desc": "Ta carnation est chaude mais douce, avec un léger éclat doré et très peu de contraste marqué. Les teintes claires, nettes et légèrement chaudes rendent ta peau fraîche et reposée, alors que les couleurs lourdes ou très foncées ont tendance à t’écraser au lieu de te mettre en valeur. Pense pêche, jaune beurre, aqua clair et rose chaud : des couleurs qui semblent mélangées à du soleil.",
      "keywords": ["Chaud", "Clair", "Frais"],
      "makeup": "Un blush pêche ou abricot, une bouche corail ou rose chaud en transparence, et un trait d’eye-liner brun doux ou bronze plutôt que noir.",
      "hair": "Blond doré, miel ou châtain caramel clair. Évite les tons très foncés ou cendrés qui assombrissent le visage.",
      "jewelry": "Or jaune clair, or rose et pièces délicates. Les perles d’un crème chaud te vont à ravir."
    },
    "springbright": {
      "name": "Printemps lumineux",
      "word": "printemps lumineux",
      "vibe": "Chaleureuse, éclatante et pétillante.",
      "desc": "Ta carnation est chaude et vive, souvent avec un regard lumineux et un contraste frais. Les couleurs saturées et ensoleillées réveillent ton visage, tandis que les teintes poudrées ou grisées peuvent te donner l’air fatigué. Corail, mandarine, jaune tournesol, turquoise et vert gazon sont ton terrain de jeu. Tu peux porter la couleur à forte dose tout en restant toi-même.",
      "keywords": ["Chaud", "Net", "Vif"],
      "makeup": "Un rouge à lèvres corail ou rouge chaud, un blush pêche éclatant et une touche d’irisé. Un eye-liner brun chaud ou bleu canard apporte du peps.",
      "hair": "Châtain doré chaud, cuivré ou châtain lumineux. Des reflets chauds et brillants te vont mieux qu’une couleur cendrée et mate.",
      "jewelry": "Or jaune poli, émail coloré et pierres vives. Les finitions brillantes te réussissent mieux que les mates."
    },
    "summerlight": {
      "name": "Été clair",
      "word": "été clair",
      "vibe": "Fraîche, douce et légère comme un ciel dégagé.",
      "desc": "Ta carnation est claire et froide, avec un sous-ton rosé ou neutre et un ensemble tout en douceur. Les pastels froids et les tons moyens délicats rendent ta peau lisse et lumineuse, alors que les couleurs très foncées, très chaudes ou fluo peuvent prendre le dessus. Bleu poudré, lavande, rose tendre et menthe sont des valeurs sûres. Pense à des couleurs auxquelles on aurait ajouté un peu de blanc et un peu de bleu.",
      "keywords": ["Froid", "Clair", "Doux"],
      "makeup": "Un blush rose ou rose layette, une bouche rose ou mauve en transparence et un eye-liner taupe ou gris doux.",
      "hair": "Blond cendré, châtain clair cendré ou blond beige doux. Les tons très dorés ou orangés risquent de jurer avec ta peau.",
      "jewelry": "Argent, or blanc et platine, avec des perles, de la pierre de lune ou des pierres bleu pâle."
    },
    "summermute": {
      "name": "Été doux",
      "word": "été doux",
      "vibe": "Fraîche, sereine et discrètement élégante.",
      "desc": "Ta carnation est froide à neutre, naturellement fondue, avec peu de contraste entre cheveux, peau et yeux. Les teintes poudrées et grisées te donnent un air soigné et serein, alors que les couleurs très vives ou très chaudes peuvent paraître criardes près du visage. Mauve, vieux rose, bleu ardoise, sauge et prune douce sont ta signature. Les tenues ton sur ton te vont particulièrement bien.",
      "keywords": ["Froid", "Doux", "Serein"],
      "makeup": "Une bouche vieux rose ou mauve, un blush rose doux et un eye-liner gris-brun ou prune pour structurer en douceur.",
      "hair": "Châtain cendré, brun champignon froid ou blond cendré doux. Évite les dorés cuivrés et le noir trop dur.",
      "jewelry": "Argent brossé, or blanc et étain doux. Les finitions mates et les perles grises te ressemblent."
    },
    "autumnmute": {
      "name": "Automne doux",
      "word": "automne doux",
      "vibe": "Chaleureuse, douce et légèrement dorée.",
      "desc": "Ta carnation est chaude et fondue, avec une douceur terreuse et peu de contraste marqué. Les teintes chaudes et poudrées ont l’air naturelles et chic sur toi, alors que les couleurs glacées ou très vives peuvent te faire paraître pâle. Camel, olive, terracotta doux, taupe chaud et vert mousse sont tes meilleurs alliés. Superposer plusieurs neutres chauds et doux est l’un de tes super-pouvoirs.",
      "keywords": ["Chaud", "Doux", "Terreux"],
      "makeup": "Une bouche nude pêche ou brique douce, un blush terracotta chaud et un eye-liner brun ou kaki.",
      "hair": "Châtain doré doux, beige chaud ou caramel poudré. Évite le cendré froid ou le noir bleuté qui éteignent ta chaleur.",
      "jewelry": "Or mat ou brossé, bronze et bois, avec des pierres chaudes comme l’ambre ou l’œil-de-tigre."
    },
    "autumndeep": {
      "name": "Automne profond",
      "word": "automne profond",
      "vibe": "Chaleureuse, riche et pleine de profondeur.",
      "desc": "Ta carnation est chaude et vraiment profonde, souvent avec des cheveux ou des yeux foncés et un sous-ton doré ou olive. Les tons terre riches, épicés et saturés te rendent forte et rayonnante, alors que les pastels et les teintes glacées peuvent te délaver. Rouille, chocolat, moutarde, olive et bleu canard profond sont tes couleurs fétiches. Tu peux porter des teintes sombres sans qu’elles paraissent lourdes.",
      "keywords": ["Chaud", "Profond", "Riche"],
      "makeup": "Une bouche rouge brique, cannelle ou bordeaux chaud, un blush bronze ou terracotta et un eye-liner brun foncé ou olive.",
      "hair": "Chocolat profond, châtain, auburn ou caramel foncé. Les couleurs très claires ou cendrées semblent déconnectées de ton visage.",
      "jewelry": "Or jaune ancien ou soutenu, cuivre et bronze, avec du grenat, de l’œil-de-tigre ou des pierres vert foncé."
    },
    "winterbright": {
      "name": "Hiver lumineux",
      "word": "hiver lumineux",
      "vibe": "Froide, éclatante et impossible à ignorer.",
      "desc": "Ta carnation est froide et nette, souvent avec un contraste saisissant entre cheveux, peau et yeux. Les couleurs pures, éclatantes comme des pierres précieuses, et le noir et blanc francs te rendent vive et affirmée, alors que les teintes poudrées, beiges ou ternes éteignent ton éclat. Fuchsia, cobalt, émeraude, rouge vrai et blanc glacé sont ta signature. Tu peux porter la couleur la plus audacieuse de la pièce.",
      "keywords": ["Froid", "Net", "Contrasté"],
      "makeup": "Une bouche rouge vrai, fuchsia ou rose froid, un blush rose vif et un trait d’eye-liner noir bien net.",
      "hair": "Brun foncé froid, noir bleuté ou une nuance froide bien nette. Le caramel chaud ou les mèches cuivrées peuvent ternir ton teint.",
      "jewelry": "Argent poli, or blanc et platine, avec des diamants, des saphirs ou des pierres de couleur vive."
    },
    "winterdeep": {
      "name": "Hiver profond",
      "word": "hiver profond",
      "vibe": "Froide, profonde et discrètement dramatique.",
      "desc": "Ta carnation est profonde, avec un sous-ton froid ou neutre-froid, souvent des cheveux et des yeux foncés. Les teintes froides et profondes et le vrai noir te donnent une allure élégante et puissante, alors que les pastels chauds et les beiges peuvent te donner l’air fatigué. Noir, bleu encre, prune, bordeaux, vert sapin et blanc glacé pour le contraste composent ta garde-robe idéale.",
      "keywords": ["Froid", "Profond", "Élégant"],
      "makeup": "Une bouche baie, lie-de-vin ou prune profonde, un blush rose froid et un eye-liner noir ou prune foncé.",
      "hair": "Expresso profond, brun foncé froid ou noir doux. Les tons dorés clairs peuvent effacer ta profondeur naturelle.",
      "jewelry": "Argent, or blanc ou gunmetal, avec des pierres profondes comme le rubis, l’améthyste ou l’onyx."
    }
  }
};
