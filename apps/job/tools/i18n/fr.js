/* Test d’orientation métier (fr) — tutoiement
 * 8 result ids (showrunner storyteller captain caretaker creator inventor builder analyst);
 * questions[i].choices[j] follow job-core.js QUESTIONS[i].w[j] (the [people/things, imagine/structure, out front/deep focus] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result, a suggested job or quote a question.
 * types.<id>.word = the result keyword as people would search it — only used by the spoiler check.
 * types.<id>.jobs = 4 real jobs that are common in this country (local names, no digits).
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Light and positive only. Just for fun — not a professional career assessment.
 * Typography: U+202F (narrow no-break space) before ? ! : ; » and after «.
 * Placeholders: {name} {emoji} {vibe} {pct}.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test d’orientation métier : quel métier est fait pour moi ?",
    "description": "Fais le test d’orientation métier : 11 questions rapides, environ 2 minutes, sans inscription. Découvre ton style de travail, tes atouts et des pistes de métiers. Pour le plaisir.",
    "ogTitle": "Test d’orientation métier 💼 Quel métier est fait pour moi ?",
    "ogDescription": "Onze questions légères sur ta façon de travailler. Découvre ton style de travail, tes atouts et quelques métiers à explorer."
  },
  "siteName": "Test d’orientation métier",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "💼 Quel métier pour moi ?",
    "h1Kicker": "Test d’orientation métier",
    "h1Html": "Où vas-tu<br><em>briller</em> au travail ?",
    "hook": "Certains se sentent pousser des ailes dans une salle pleine de monde, d’autres dans un coin tranquille face à un casse-tête. Réponds à onze questions du quotidien et découvre ton style de travail, tes atouts cachés et quelques métiers qui pourraient te correspondre étonnamment bien.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 questions",
    "start": "Trouver mon style →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "On trie tes réponses…",
    "sub": "On associe ton style au monde du travail"
  },
  "result": {
    "title": "Mon style de travail : {name}",
    "metaDesc": "Résultat du test d’orientation métier : {name}. {vibe} Découvre tes atouts, des métiers qui pourraient te plaire et un conseil pour ton style de travail.",
    "eyebrow": "Ta personnalité au travail",
    "gaugeLabel": "Où penchaient tes réponses",
    "axes": [
      ["Les gens", "Les choses et les idées"],
      ["Imagination", "Structure"],
      ["En première ligne", "Concentration"]
    ],
    "jobsLabel": "Métiers à explorer",
    "strengthsLabel": "Tes atouts",
    "envLabel": "Là où tu brilles",
    "watchLabel": "Point de vigilance",
    "tipLabel": "Conseil de travail",
    "buddyLabel": "Collègue idéal",
    "rivalLabel": "Style opposé",
    "disclaimer": "Pour le plaisir seulement. Ce quiz léger n’est pas un bilan d’orientation professionnel. Les métiers sont des idées à explorer, pas des conseils, et tu peux t’épanouir dans bien d’autres voies.",
    "sameShare": "{pct} % des gens ont obtenu ce style de travail",
    "shareText": "Mon style de travail : {name} {emoji} « {vibe} » Et toi ?",
    "ctaStrong": "Un ami a partagé son style de travail",
    "ctaSub": "Quel métier est fait pour toi ? Réponse en 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Ma personnalité au travail",
    "brand": "💼 Test d’orientation métier",
    "defaultKicker": "Un quiz d’orientation léger",
    "defaultTitle": "Quel métier est fait pour moi ?",
    "defaultDesc": "11 questions · 2 minutes · ton style de travail"
  },
  "faq": [
    {
      "q": "Comment mon résultat est-il choisi ?",
      "a": "Chaque réponse fait bouger trois curseurs : travailler avec les gens ou avec les choses et les idées, imaginer du nouveau ou bâtir des systèmes clairs, passer en première ligne ou plonger en profondeur. Ton résultat est le point de rencontre de ces trois curseurs, et les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "Est-ce un vrai bilan d’orientation ?",
      "a": "Non. C’est un quiz léger, fait pour s’amuser et réfléchir, pas un test professionnel ni scientifique. Pour une décision importante sur tes études ou ta carrière, parle à un conseiller d’orientation, à tes professeurs ou à des gens qui exercent les métiers qui t’intriguent."
    },
    {
      "q": "Pourquoi les métiers proposés me semblent un peu décalés ?",
      "a": "Quatre métiers ne peuvent jamais résumer une personne entière. Ce sont des exemples de travail qui mobilise souvent ton style, alors vois-les comme des points de départ. Beaucoup de gens qui ont le même résultat que toi s’épanouissent dans des domaines très différents."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et ne sont pas conservées. On compte seulement, de façon anonyme, quel résultat est sorti, pour pouvoir t’indiquer à quel point il est courant."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test d’orientation métier",
    "description": "Politique de confidentialité du Test d’orientation métier : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test d’orientation métier (le « Service ») respecte ta vie privée et ne traite que le strict minimum d’informations, comme expliqué ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Tu peux utiliser le Service sans t’inscrire ni te connecter. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni conservées sur nos serveurs. On compte seulement, de façon anonyme, quel résultat est sorti, pour indiquer à quel point chaque résultat est courant."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de ton navigateur pour mémoriser ta langue, afficher des publicités et comprendre comment le Service est utilisé. Tu peux les refuser ou les supprimer dans les paramètres de ton navigateur ; certaines fonctions risquent alors de mal fonctionner."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de tes visites précédentes sur ce site et sur d’autres. Tu peux en savoir plus et modifier la personnalisation des annonces dans <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Nous conservons des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ces totaux ne permettent pas de t’identifier."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique est en vigueur depuis le 31 octobre 2026."
      ]
    ],
    "back": "← Retour au Test d’orientation métier"
  },
  "questions": [
    {
      "q": "Un projet de groupe démarre. Quel rôle te retrouves-tu à jouer sans même essayer ?",
      "choices": [
        "Celui qui cherche tranquillement une astuce maligne à laquelle personne n’a pensé",
        "Celui qui lance des idées et les présente à la classe ou à l’équipe",
        "Celui qui prend les outils et construit vraiment le truc, étape par étape",
        "Celui qui tient le planning et vérifie que personne n’est laissé de côté"
      ]
    },
    {
      "q": "Tout à coup, tu as une journée libre. Qu’est-ce qui te tente le plus ?",
      "choices": [
        "Un café avec un ami et une longue discussion sur un film que vous avez adoré",
        "Enfin trier tes dossiers photo ou ton budget, bien propre et bien rangé",
        "Réunir du monde pour un match ou une soirée jeux de société que tu organises",
        "Un atelier d’une journée où tu fabriques quelque chose de tes mains"
      ]
    },
    {
      "q": "Tu viens d’acheter un nouveau gadget. Que fais-tu en premier ?",
      "choices": [
        "Tu l’installes tout de suite, en suivant les étapes une par une",
        "Tu rédiges un mode d’emploi tout simple pour que ta famille s’en serve aussi",
        "Tu filmes le déballage ou tu le montres à tes amis",
        "Tu fouilles dans les réglages pour dénicher les fonctions cachées et les astuces"
      ]
    },
    {
      "q": "Quel compliment te fait plaisir ?",
      "choices": [
        "« Pas une seule erreur. Tu es tellement précis. »",
        "« Si l’équipe tourne bien, c’est grâce à toi. »",
        "« Attends, c’est toi qui as fait ça ? C’est génial. »",
        "« Ce que tu as dit m’a vraiment marqué. »"
      ]
    },
    {
      "q": "Choisis ton lieu de travail idéal.",
      "choices": [
        "Un bureau sympa où toute l’équipe travaille en harmonie",
        "Sur le terrain, en mouvement, avec du vrai matériel à manier",
        "Un endroit qui bouillonne, où il se passe du nouveau chaque jour",
        "Un atelier tranquille avec un tableau blanc plein d’idées à peine ébauchées"
      ]
    },
    {
      "q": "Quelque chose tourne mal. Quel est ton premier réflexe ?",
      "choices": [
        "Réunir tout le monde, répartir les tâches et prendre les rênes",
        "Écouter chaque personne concernée et chercher un angle neuf",
        "Vérifier calmement les chiffres et les relevés pour trouver la cause",
        "Te mettre à bricoler et tester une nouvelle façon de réparer sur-le-champ"
      ]
    },
    {
      "q": "Qu’est-ce qui revient sans cesse dans tes vidéos recommandées ?",
      "choices": [
        "Des vlogs, des sketchs drôles et les dernières tendances",
        "Des réparations, du bricolage et des tests de matériel de camping",
        "De la science, de l’espace et des mystères non résolus expliqués",
        "Des histoires vraies de gens qui aident les autres, comme des profs et des infirmiers"
      ]
    },
    {
      "q": "En voyage, c’est souvent toi qui…",
      "choices": [
        "Te promènes sans plan en remplissant ta pellicule photo ou ton carnet de croquis",
        "Construis le tableau parfait du budget et du planning",
        "Finis par discuter avec les habitants dans un petit café",
        "Guides tout le groupe d’un endroit à l’autre"
      ]
    },
    {
      "q": "C’est la veille d’une échéance. Tu…",
      "choices": [
        "Écris une liste de tâches claire et les coches une par une",
        "Peaufines la présentation finale et maintiens le moral de tout le monde",
        "Prends des nouvelles de chacun pour voir si quelqu’un est bloqué",
        "Te plonges dans le travail et trouves une idée encore meilleure"
      ]
    },
    {
      "q": "Dans une association ou un club, quel rôle te plairait le plus ?",
      "choices": [
        "Accueillir les nouveaux et écouter ceux qui ont besoin de parler",
        "Être le président ou la présidente qui fait avancer tout le monde",
        "Concevoir les affiches, le logo et les goodies",
        "Tenir les comptes et la caisse commune en ordre"
      ]
    },
    {
      "q": "Dans dix ans, qu’aimerais-tu entendre ?",
      "choices": [
        "« Je me suis toujours senti en sécurité en te sachant là. »",
        "« C’est toi qui y as pensé le premier, non ? »",
        "« Tu as fait sourire tellement de monde. »",
        "« Quand ça passe entre tes mains, ça marche, tout simplement. »"
      ]
    }
  ],
  "types": {
    "showrunner": {
      "name": "Le Showman",
      "word": "showman",
      "vibe": "Donne-lui une scène et une idée, et toute la salle s’enflamme.",
      "desc": "Tu t’épanouis là où les gens, les idées et l’action se rencontrent. Tu aimes lancer quelque chose de nouveau, embarquer les autres et voir ça prendre vie devant un public. L’énergie est ton super-pouvoir : une réunion ennuyeuse se transforme en brainstorming dès que tu entres. Un travail qui te laisse lancer, présenter et mettre en relation ressemblera sans doute moins à du travail qu’à un jeu.",
      "keywords": ["Énergique", "Persuasif", "Plein d’idées"],
      "strengths": ["Transformer une idée brute en projet auquel on a envie de s’associer", "Sentir l’ambiance d’une salle et la faire monter", "Prendre la parole et présenter avec aplomb"],
      "jobs": ["Responsable marketing", "Chargé·e de communication", "Organisateur·rice d’événements", "Chef·fe d’entreprise"],
      "env": "Des équipes dynamiques, des lancements et des événements en direct où chaque semaine apporte du nouveau et où tu vois les gens réagir à ton travail.",
      "watch": "Lancer plus de projets que tu ne peux en finir. Les nouvelles idées brillantes peuvent voler du temps à celles qui sont déjà à moitié faites.",
      "tip": "Associe-toi à quelqu’un qui adore les détails, et fixe-toi une ligne d’arrivée avant de te lancer dans la prochaine grande idée."
    },
    "storyteller": {
      "name": "Le Conteur",
      "word": "conteur",
      "vibe": "Tu transformes les idées en mots et en histoires dont on se souvient.",
      "desc": "Tu es attiré par les gens et par le sens des choses. Tu aimes comprendre ce que les autres ressentent, puis le mettre en mots, en leçons ou en histoires qui leur font voir les choses autrement. Tu n’as peut-être pas besoin des projecteurs, mais ton influence discrète porte loin. Un travail où tu peux écouter, écrire, enseigner ou expliquer te conviendra sans doute naturellement.",
      "keywords": ["Empathique", "Expressif", "Réfléchi"],
      "strengths": ["Expliquer des choses compliquées de façon simple et humaine", "Écouter attentivement et saisir ce que les gens veulent vraiment dire", "Trouver l’histoire derrière les faits et les chiffres"],
      "jobs": ["Journaliste", "Professeur·e des écoles", "Psychologue", "Rédacteur·rice"],
      "env": "Des lieux calmes où l’on a le temps de réfléchir, des conversations en tête à tête et des projets où tes mots touchent et aident de vraies personnes.",
      "watch": "Ramener à la maison les soucis des autres. Se soucier profondément est un don, mais il te faut aussi du temps pour recharger les batteries.",
      "tip": "Garde un petit carnet d’idées et de phrases. Tes meilleurs travaux commencent souvent par une ligne que tu avais presque oubliée."
    },
    "captain": {
      "name": "Le Capitaine",
      "word": "capitaine",
      "vibe": "Quand ça s’agite, tout le monde se tourne vers toi pour tenir la barre.",
      "desc": "Tu es au meilleur de ta forme quand il y a une équipe à guider et un objectif à atteindre. Tu aimes les plans clairs, tu décides sans te perdre en détours et tu gardes tout le monde dans la même direction. On te fait confiance en cas de crise parce que tu restes calme et organisé. Un travail où tu diriges des gens, des plannings ou un service fera ressortir ton leadership naturel.",
      "keywords": ["Décidé", "Organisé", "Fiable"],
      "strengths": ["Découper un gros chantier en tâches claires pour chacun", "Rester calme et pragmatique sous pression", "Tenir ses promesses et ses délais"],
      "jobs": ["Chef·fe de projet", "Directeur·rice commercial·e", "Directeur·rice d’hôtel", "Hôte·sse de l’air"],
      "env": "Des équipes actives avec des objectifs clairs, où tu coordonnes les gens, règles les problèmes sur-le-champ et vois vite les résultats.",
      "watch": "Tout faire toi-même parce que ça semble plus rapide. Laisser parfois la barre aux autres rend toute l’équipe plus forte.",
      "tip": "Avant de distribuer les tâches, demande à chacun ce qu’il aimerait le plus faire. Les réponses pourraient te surprendre."
    },
    "caretaker": {
      "name": "Le Bienveillant",
      "word": "bienveillant",
      "vibe": "Tu veilles à ce que personne ne soit oublié en chemin.",
      "desc": "Les gens comptent pour toi, et tu le montres par un soutien régulier et concret. Tu remarques quand quelqu’un traverse une période difficile, tu retiens les détails qui comptent et tu aimes les organisations qui protègent chacun. Tu ne réclames peut-être pas de mérite, mais les équipes sentent la différence quand tu es là. Un travail où tu aides, soutiens et protèges les autres aura sans doute beaucoup de sens pour toi.",
      "keywords": ["Attentionné", "Patient", "Fiable"],
      "strengths": ["Repérer les petits signes qu’une personne a besoin d’aide", "Aller au bout des choses avec soin, jour après jour", "Créer une atmosphère calme et de confiance"],
      "jobs": ["Infirmier·ère", "Chargé·e de ressources humaines", "Assistant·e social·e", "Aide-soignant·e"],
      "env": "Des équipes soudées avec un but clair, où la gentillesse et de bonnes habitudes changent vraiment la vie des gens.",
      "watch": "Dire oui à tout le monde. Protéger ton propre temps fait aussi partie du soin que tu portes aux autres.",
      "tip": "Réserve une heure par semaine rien qu’à tes propres objectifs, et défends-la comme n’importe quel rendez-vous."
    },
    "creator": {
      "name": "Le Créatif",
      "word": "créatif",
      "vibe": "Donne-lui de la matière, et quelque chose de neuf apparaît.",
      "desc": "Tu penses avec tes mains et avec tes yeux. Tu adores fabriquer des choses que l’on peut voir, goûter, tenir ou utiliser, et tu es le plus heureux quand tu peux essayer, tester et améliorer au fil de l’eau. Les règles, pourquoi pas, mais tu préfères avoir de la place pour expérimenter. Un travail où tu conçois, façonnes ou produis quelque chose de concret te passionnera sans doute longtemps.",
      "keywords": ["Inventif", "Manuel", "Visuel"],
      "strengths": ["Transformer une idée en pièce réelle et aboutie", "Repérer ce qui est juste du point de vue du look ou du ressenti", "Apprendre vite en essayant"],
      "jobs": ["Graphiste", "Cuisinier·ère", "Vidéaste", "Décorateur·rice d’intérieur"],
      "env": "Des studios, des cuisines, des ateliers ou des plateaux où tu travailles de vraies matières et montres ce que tu as fait.",
      "watch": "Peaufiner sans fin. Une pièce terminée et montrée au monde t’apprend plus qu’une pièce parfaite au fond d’un tiroir.",
      "tip": "Garde un portfolio de tout ce que tu fais, même les petites choses. Ce sera ta plus belle histoire à raconter sur toi."
    },
    "inventor": {
      "name": "L’Inventeur",
      "word": "inventeur",
      "vibe": "Ton esprit est un labo où les idées neuves mijotent sans cesse.",
      "desc": "Tu aimes les grandes questions et les réponses astucieuses. Tu prends plaisir à plonger dans une énigme, à tester des idées dans ta tête et à trouver la solution à laquelle personne ne s’attendait. Tu réfléchis le mieux quand tu as du calme et la liberté d’explorer. Un travail où tu cherches, conçois des systèmes ou résous des problèmes difficiles sera sans doute un terrain de jeu pour ta curiosité.",
      "keywords": ["Curieux", "Original", "Analytique"],
      "strengths": ["Voir des liens et des motifs que les autres ratent", "Se concentrer à fond sur un seul problème difficile", "Trouver des solutions originales"],
      "jobs": ["Chercheur·se", "Développeur·se informatique", "Architecte", "Ingénieur·e R&D"],
      "env": "Des endroits calmes pour se concentrer, des problèmes intéressants et des collègues qui aiment un bon débat d’idées.",
      "watch": "Garder tes idées brillantes dans ta tête. Les partager tôt aide les autres à les comprendre et à les enrichir.",
      "tip": "Explique ton idée du moment à un ami en trois phrases. S’il comprend, tu es prêt à la construire."
    },
    "builder": {
      "name": "Le Bâtisseur",
      "word": "bâtisseur",
      "vibe": "Tu ne te contentes pas d’en parler. Tu le fais, et bien.",
      "desc": "Tu es pratique, posé et le plus heureux quand tu vois des résultats concrets. Tu aimes les étapes claires, les bons outils et un travail qui te fait bouger plutôt que rester assis. Quand quelque chose tombe en panne, c’est toi qui le répares calmement. Un travail où tu construis, répares, fais fonctionner ou maintiens les choses en sécurité te procurera sans doute une profonde satisfaction.",
      "keywords": ["Pratique", "Compétent", "Posé"],
      "strengths": ["Suivre une procédure avec soin et en sécurité", "Résoudre les pannes avec calme et sens du concret", "Obtenir des résultats réels et visibles"],
      "jobs": ["Ingénieur·e mécanicien·ne", "Électricien·ne", "Pilote de ligne", "Mécanicien·ne automobile"],
      "env": "Des ateliers, des chantiers, des labos ou des cockpits où le savoir-faire, la sécurité et l’esprit d’équipe comptent, et où tu vois chaque jour ce que tu as accompli.",
      "watch": "Sous-estimer tes compétences. Ce qui te paraît évident impressionne souvent tous les autres.",
      "tip": "Apprends un nouvel outil ou une nouvelle technique chaque saison. Tes compétences progressent le plus vite quand tu les empiles pas à pas."
    },
    "analyst": {
      "name": "L’Analyste",
      "word": "analyste",
      "vibe": "Les détails, les données et l’ordre sont tes super-pouvoirs discrets.",
      "desc": "Tu remarques ce que les autres négligent. Tu aimes le travail soigné, les règles claires et la satisfaction d’avoir chaque chiffre et chaque détail parfaitement juste. Tu réfléchis avant d’agir, et on te fait confiance parce que ton jugement repose sur des faits. Un travail où tu organises, vérifies, mesures ou étudies des informations te semblera sans doute calme et gratifiant.",
      "keywords": ["Précis", "Logique", "Calme"],
      "strengths": ["Repérer les erreurs et les régularités dans l’information", "Garder les choses complexes bien rangées et organisées", "Prendre des décisions soignées, fondées sur les faits"],
      "jobs": ["Expert-comptable", "Data analyst", "Bibliothécaire", "Technicien·ne de laboratoire"],
      "env": "Des lieux calmes et bien organisés, avec des attentes claires, où la rigueur est valorisée et où tu as le temps de bien faire les choses.",
      "watch": "Attendre l’information parfaite. Parfois, une décision suffisamment bonne aujourd’hui vaut mieux qu’une décision parfaite le mois prochain.",
      "tip": "Partage une observation tirée de ton travail chaque semaine. Tes découvertes soignées aident bien plus de monde quand on les entend."
    }
  }
};
