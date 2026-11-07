/* Test cerveau gauche ou droit (fr) — même structure de clés que en.js. Voir l’en-tête de en.js.
 * questions[i].choices[j] suivent brain-core.js QUESTIONS[i].c[j] (même ordre, même sens que en.js).
 * Pas de chiffres ni de % dans types.*. Pas de spoilers avant le résultat. Juste pour s’amuser.
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
    "title": "Test cerveau gauche ou droit – Logique ou intuition ?",
    "description": "Test cerveau gauche ou droit gratuit : 12 questions du quotidien, environ 2 minutes, sans inscription. Vois ton équilibre gauche/droite, juste pour le fun.",
    "ogTitle": "Test cerveau gauche ou droit 🧠 Logique ou intuition ?",
    "ogDescription": "Douze questions rapides du quotidien. Vois de quel côté penche ta façon de penser et découvre ton personnage cérébral. Un quiz pour s’amuser, pas un diagnostic."
  },
  "siteName": "Test cerveau gauche ou droit",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🧠 Ton style de pensée",
    "h1Kicker": "Test cerveau gauche ou droit",
    "h1Html": "Logique ou intuition ?<br>De quel côté <em>penches</em>-tu ?",
    "hook": "Tu fais des listes ou tu suis ton instinct ? Tu expliques avec des mots ou avec un petit croquis ? Réponds à douze questions du quotidien pour voir comment s’équilibrent tes habitudes de pensée, et découvre le personnage cérébral qui te ressemble.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "💭 12 questions",
    "start": "Commencer le test →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "Lecture de ta façon de penser…",
    "sub": "Tes deux hémisphères en discutent"
  },
  "result": {
    "title": "Mon personnage cérébral : {name}",
    "metaDesc": "Résultat du test cerveau gauche ou droit : {name}. {vibe} Découvre tes forces, des conseils, ton meilleur pote et ton rival complice.",
    "eyebrow": "Ton personnage cérébral est…",
    "lrTitle": "Ton équilibre de pensée gauche / droite",
    "lrLeft": "Style gauche",
    "lrRight": "Style droit",
    "lrNote": "Calculé uniquement à partir de tes douze réponses : logique, plans et mots comptent pour le style cerveau gauche ; intuition, spontanéité et images pour le style cerveau droit.",
    "pctFmt": "{n} %",
    "leanLeft": "Tes réponses penchent vers les habitudes du cerveau gauche.",
    "leanRight": "Tes réponses penchent vers les habitudes du cerveau droit.",
    "leanBalanced": "Tes réponses sont joliment équilibrées entre les deux styles.",
    "traitsLabel": "Tes forces",
    "tipsLabel": "Conseils pour toi",
    "perfectLabel": "Là où tu brilles",
    "bestLabel": "Meilleur pote",
    "rivalLabel": "Rival complice",
    "disclaimer": "Juste pour s’amuser ! Être « cerveau gauche » ou « cerveau droit » est un mythe populaire : la recherche sur le cerveau montre que les deux hémisphères travaillent ensemble sur presque tout. Ce quiz ne regarde que tes préférences de style de pensée. Ce n’est ni un test psychologique ni un diagnostic.",
    "sameShare": "{pct} % des gens ont obtenu ce résultat",
    "shareText": "Mon personnage cérébral, c’est {name} {emoji} « {vibe} » Et toi, tu penches à gauche ou à droite ?",
    "ctaStrong": "Un ami a partagé son personnage cérébral",
    "ctaSub": "Logique ou intuition ? Réponse en 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon personnage cérébral",
    "brand": "🧠 Test cerveau gauche ou droit",
    "defaultKicker": "Un quiz sur les styles de pensée",
    "defaultTitle": "Logique ou intuition ?",
    "defaultDesc": "12 questions · 2 minutes · ton équilibre gauche/droite"
  },
  "faq": [
    {
      "q": "Est-on vraiment « cerveau gauche » ou « cerveau droit » ?",
      "a": "Non, c’est un mythe populaire. Chaque hémisphère a quelques spécialités, mais l’imagerie cérébrale montre que les deux côtés travaillent ensemble sur presque toutes les tâches, et les grandes études n’ont pas trouvé de personnes qui utilisent globalement un côté plus que l’autre. Ici, « style cerveau gauche » et « style cerveau droit » sont juste des surnoms amicaux pour des habitudes de pensée."
    },
    {
      "q": "Comment mon résultat est-il choisi ?",
      "a": "Chaque question porte sur l’une de trois habitudes de pensée : raisonner ou suivre une intuition, planifier ou improviser, expliquer avec des mots ou avec des images. La combinaison des trois désigne ton personnage, et les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "D’où vient le pourcentage gauche/droite ?",
      "a": "Il est calculé uniquement à partir de tes propres réponses. Les choix tournés vers la logique, les plans et les mots s’ajoutent au style cerveau gauche, ceux tournés vers l’intuition, la spontanéité et les images au style cerveau droit, et les réponses les plus nettes comptent un peu plus."
    },
    {
      "q": "Est-ce un vrai test psychologique ?",
      "a": "Non. C’est un quiz léger pour s’amuser, pas une évaluation psychologique ni un diagnostic. La plupart des gens utilisent tous les styles selon la situation : profite de ton résultat et compare-le avec tes amis."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et ne sont pas conservées. On compte seulement, de façon anonyme, quel résultat est sorti, pour pouvoir indiquer à quel point il est courant."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test cerveau gauche ou droit",
    "description": "Politique de confidentialité du Test cerveau gauche ou droit : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test cerveau gauche ou droit (le « Service ») respecte ta vie privée et ne traite que le strict minimum d’informations, comme expliqué ci-dessous.",
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
        "Cette politique est en vigueur depuis le 8 novembre 2026."
      ]
    ],
    "back": "← Retour au Test cerveau gauche ou droit"
  },
  "questions": [
    {
      "q": "Tu dois changer de téléphone. Comment tu choisis ?",
      "choices": [
        "Je compare caractéristiques et prix jusqu’à ce qu’un modèle gagne clairement",
        "Je lis quelques avis, puis je prends celui qui me parle",
        "Je le prends en main en boutique. S’il tombe bien dans la main, c’est lui",
        "Je vérifie les caractéristiques clés, puis je prends le meilleur rapport qualité-prix"
      ]
    },
    {
      "q": "Un samedi libre approche. Il ressemble à quoi ?",
      "choices": [
        "Aucun programme. Je verrai bien où la journée m’emmène",
        "Planifié dès mercredi, presque heure par heure",
        "Une ou deux choses prévues, le reste ouvert",
        "Une vague idée, mais je change volontiers"
      ]
    },
    {
      "q": "Un ami te demande comment aller à un café que tu connais. Tu…",
      "choices": [
        "Envoies le nom de la rue et un ou deux repères",
        "Dessines un petit plan ou envoies une épingle avec une photo de l’entrée",
        "Écris l’itinéraire pas à pas : à gauche à la boulangerie, puis deuxième à droite…",
        "Envoies une capture d’écran de la carte"
      ]
    },
    {
      "q": "Un ami hésite entre deux offres d’emploi et te demande ton avis. Tu…",
      "choices": [
        "Lui demandes laquelle le fait rayonner quand il en parle",
        "Fais avec lui la liste des pour et des contre : salaire, trajet, évolution",
        "Poses quelques questions pratiques avant de donner ton avis",
        "Lui dis d’écouter son instinct. Au fond, il sait déjà"
      ]
    },
    {
      "q": "Tu prépares ton sac pour un week-end. Tu…",
      "choices": [
        "Le fais la veille, en suivant une liste dans ta tête",
        "Jettes des affaires dans un sac juste avant de passer la porte",
        "Le fais le matin même et achètes sur place ce que tu as oublié",
        "Suis une liste écrite plusieurs jours avant"
      ]
    },
    {
      "q": "Comment tu retiens le mieux les choses ?",
      "choices": [
        "Je les visualise : la page, la couleur, l’endroit où c’était",
        "Je griffonne un petit dessin dans la marge",
        "Je me les répète plusieurs fois",
        "Je les écris avec mes propres mots"
      ]
    },
    {
      "q": "Un nouveau jeu de société arrive avec un gros livret de règles. Tu…",
      "choices": [
        "Survoles les règles, puis commences à jouer",
        "Lis toutes les règles avant le premier coup",
        "Zappes les règles et apprends en jouant",
        "Regardes les autres jouer un tour, puis te lances"
      ]
    },
    {
      "q": "À quoi ressemble ta liste de choses à faire ?",
      "choices": [
        "Nette, triée par priorité, cochée chaque jour",
        "Elle existe quelque part. J’y jette un œil de temps en temps",
        "Une courte liste de ce qui compte vraiment",
        "Une liste ? Tout est dans ma tête et je suis le mouvement"
      ]
    },
    {
      "q": "Tu dois expliquer une nouvelle idée à ton équipe ou à ta classe. Tu…",
      "choices": [
        "Ajoutes quelques images simples aux diapos",
        "En parles avec un ou deux exemples",
        "Dessines un schéma au tableau et le construis étape par étape",
        "Rédiges d’abord un résumé clair et bien organisé"
      ]
    },
    {
      "q": "Quelque chose te gêne chez une personne que tu viens de rencontrer, sans savoir pourquoi. Tu…",
      "choices": [
        "Fais confiance à ce ressenti. Il a souvent raison",
        "Attends de voir ce qu’elle fait vraiment",
        "Gardes un peu tes distances pour l’instant, au cas où",
        "L’ignores tant qu’il n’y a pas de vraie raison"
      ]
    },
    {
      "q": "Tu as une journée dans une ville que tu ne connais pas. Premier réflexe ?",
      "choices": [
        "Choisir un lieu à voir, puis flâner à partir de là",
        "Me perdre exprès et suivre les petites rues",
        "Suivre le programme préparé avant le voyage",
        "Consulter une liste des incontournables et en choisir quelques-uns"
      ]
    },
    {
      "q": "Qu’est-ce que tu aimes le plus pendant ton temps libre ?",
      "choices": [
        "Lire, écrire ou jouer avec les mots",
        "Dessiner, prendre des photos ou fabriquer des choses",
        "Regarder des films et des vidéos joliment filmées",
        "Les podcasts et les longues conversations"
      ]
    }
  ],
  "types": {
    "architect": {
      "name": "Architecte des idées",
      "word": "architecte",
      "vibe": "Des plans clairs, des raisons solides et les mots justes. Tu bâtis des idées qui tiennent debout.",
      "keywords": ["Logique", "Méthodique", "Fiable"],
      "desc": "Tu aimes comprendre comment les choses fonctionnent avant de te lancer. Tu penses par étapes, tu gardes un plan sous la main et tu expliques tes idées si clairement que tout le monde peut suivre. On te confie les parties délicates, parce que tu repères les failles et tu les répares avant qu’elles ne deviennent des problèmes. Tu apprécies une bonne discussion, tant qu’elle reste juste et fondée sur des faits. Parfois, tu attends le plan parfait un peu trop longtemps, et c’est là qu’un petit saut dans l’inconnu fait du bien.",
      "traits": ["Tu transformes un problème confus en étapes claires", "Tu expliques simplement les choses compliquées", "Tu tiens tes promesses et tes délais", "Tu repères les erreurs que les autres ratent"],
      "tips": ["Prends chaque jour une petite décision uniquement à l’instinct", "Laisse un peu de place aux surprises dans tes plans"],
      "perfect": "Un projet avec un objectif clair, un plan solide et une équipe qui compte sur ta réflexion soignée."
    },
    "mapmaker": {
      "name": "Cartographe malin",
      "word": "cartographe",
      "vibe": "Tu vois l’ensemble et tu traces l’itinéraire. De la logique avec un œil visuel.",
      "keywords": ["Stratège", "Visuel", "Méthodique"],
      "desc": "Tu raisonnes avec méthode, mais en images. Les schémas, les plans et les cartes mentales t’aident à voir comment tout s’imbrique, et tu prépares le trajet avant de faire le premier pas. Tes amis te demandent d’organiser les voyages, de réaménager une pièce ou de démêler des emplois du temps compliqués, parce que tu rends tout ça simple. Tu préfères montrer plutôt que raconter, et un croquis rapide t’en dit plus qu’un long paragraphe. N’oublie pas que tous les voyages n’ont pas besoin de carte. Certains des plus beaux endroits se découvrent en se trompant de chemin.",
      "traits": ["Tu vois comment les pièces s’assemblent", "Tu organises trajets, pièces et plannings avec aisance", "Tu expliques avec des schémas et des croquis", "Tu restes calme quand ça se complique"],
      "tips": ["Partage ta réflexion à voix haute, pas seulement sur papier", "Laisse de temps en temps quelqu’un d’autre organiser ta journée"],
      "perfect": "Préparer un grand voyage ou aménager un nouvel espace, avec une page blanche, un stylo et le temps de tout penser."
    },
    "debater": {
      "name": "Débatteur éclair",
      "word": "débatteur,débatteuse",
      "vibe": "Une logique rapide, des mots qui fusent et le goût de l’instant. Tu penses mieux à voix haute.",
      "keywords": ["Vif", "Drôle", "Adaptable"],
      "desc": "Tu raisonnes vite et tu parles encore plus vite. Pas besoin de texte préparé : tes meilleurs arguments arrivent en pleine conversation. Tu aimes les faits et la logique claire, mais tu adores aussi le frisson de l’improvisation, ce qui fait de toi une star des discussions, des quiz et des présentations de dernière minute. On apprécie ton humour et ton franc-parler. Souviens-toi juste que toutes les conversations ne sont pas des joutes. Parfois, un ami a plus besoin que tu l’écoutes que de te voir gagner.",
      "traits": ["Tu penses clairement sous pression", "Tu trouves les bons mots sur le moment", "Tu t’adaptes vite quand les plans changent", "Tu rends les discussions vivantes et drôles"],
      "tips": ["Fais une pause et pose une question de plus avant de répondre", "Note tes meilleures idées pour qu’elles ne s’envolent pas"],
      "perfect": "Une discussion animée, une soirée quiz ou une réunion où un esprit vif sauve la mise."
    },
    "hacker": {
      "name": "Hacker de casse-tête",
      "word": "hacker",
      "vibe": "Tu bricoles, tu testes et tu trouves. De la logique en mouvement, une astuce à la fois.",
      "keywords": ["Curieux", "Inventif", "Concret"],
      "desc": "Tu adores les bonnes énigmes, et tu les résous en essayant. Au lieu de lire la notice, tu démontes, tu regardes comment ça s’emboîte et tu trouves le raccourci malin que personne n’avait vu. Ton esprit est logique, mais il fonctionne au mieux quand tes mains sont occupées et que le plan reste souple. Tes amis t’appellent quand quelque chose est cassé, confus ou bloqué. La routine peut vite t’ennuyer, alors glisse-y de petits défis qui gardent ta curiosité en éveil.",
      "traits": ["Tu apprends plus vite en essayant toi-même", "Tu trouves des raccourcis et des solutions astucieuses", "Tu restes curieux de savoir comment tout fonctionne", "Tu t’accroches quand un problème se corse"],
      "tips": ["Termine un projet avant d’en ouvrir un autre", "Explique tes astuces pour que les autres puissent les apprendre"],
      "perfect": "Un gadget en panne, un niveau de jeu coriace ou un escape game avec le chrono qui tourne."
    },
    "weaver": {
      "name": "Tisseur d’histoires",
      "word": "tisseur,tisseuse",
      "vibe": "Tu suis tes émotions et tu les mets en mots. De l’intuition avec un plan bien posé.",
      "keywords": ["Empathique", "Attentionné", "Expressif"],
      "desc": "Tu lis les gens et les moments avec le cœur, et tu sais mettre ces émotions en mots. Tu sens souvent ce dont un ami a besoin avant qu’il le dise, et tu trouves le message parfait pour une carte, un discours ou une conversation difficile. Tu aimes un rythme de vie doux, avec des plans et des rituels qui te font sentir chez toi. Ton intuition est forte, alors fais-lui confiance, mais autorise-toi aussi à changer de cap quand ton cœur te dit autre chose.",
      "traits": ["Tu sens ce que ressentent les autres", "Tu trouves des mots touchants pour chaque moment", "Tu entretiens des amitiés chaleureuses et fidèles", "Tu transformes tes expériences en belles histoires"],
      "tips": ["Partage tes propres émotions aussi souvent que tu écoutes celles des autres", "Garde un carnet pour les idées qui arrivent la nuit"],
      "perfect": "Une lettre sincère, une longue discussion avec un ami cher ou une histoire qui fait se sentir compris."
    },
    "designer": {
      "name": "Designer zen",
      "word": "designer",
      "vibe": "Le sens du beau et une main patiente. Tu rends les choses belles et agréables.",
      "keywords": ["Esthète", "Patient", "Intuitif"],
      "desc": "Tu as le sens des couleurs, des formes et des ambiances, et tu prends le temps de les ajuster. Tu ne sais pas toujours expliquer pourquoi quelque chose fonctionne, mais tu le sais en le voyant, et ton instinct tombe presque toujours juste. Tu aimes les projets calmes au rythme clair : aménager une pièce, retoucher des photos, cuisiner un plat aussi beau que bon. On se sent détendu dans les espaces que tu crées. N’attends pas la perfection pour montrer ton travail. Il est déjà très réussi.",
      "traits": ["Tu as l’œil pour la beauté", "Tu crées des espaces calmes et douillets", "Tu soignes patiemment les détails", "Tu perçois les ambiances que d’autres ne voient pas"],
      "tips": ["Montre ton travail avant qu’il te semble fini", "Mets parfois tes émotions en mots, pas seulement en images"],
      "perfect": "Un après-midi tranquille à arranger, peindre ou mettre en scène quelque chose jusqu’à ce que ce soit parfait."
    },
    "firework": {
      "name": "Feu d’artifice d’idées",
      "word": "feu d’artifice,feux d’artifice",
      "vibe": "Des étincelles d’idées, des mots en rafale et de grandes émotions. Tu illumines chaque conversation.",
      "keywords": ["Inspirant", "Spontané", "Chaleureux"],
      "desc": "Les idées te viennent toute la journée, et tu as hâte de les partager. Tu fais confiance à ton intuition, tu suis ton enthousiasme et tu parles de tes projets avec tant d’énergie que les autres ont envie de suivre. Tu es l’ami qui propose le road trip improvisé, le nouveau café ou l’idée folle qui se révèle géniale. Tu ressens beaucoup et tu le montres, ce qui rapproche les gens de toi. Ton énergie est un cadeau, mais choisis quelques idées à mener jusqu’au bout pour qu’elles brillent vraiment.",
      "traits": ["Tu as des idées sans arrêt", "Tu inspires les autres par ton enthousiasme", "Tu te fais facilement de nouveaux amis", "Tu transformes les jours ordinaires en aventures"],
      "tips": ["Choisis ton idée préférée de la semaine et va au bout", "Laisse aussi la place aux amis plus discrets pour partager leurs idées"],
      "perfect": "Une séance de remue-méninges, un voyage improvisé ou une fête où tout le monde devient ami."
    },
    "dreamer": {
      "name": "Artiste rêveur",
      "word": "rêveur,rêveuse",
      "vibe": "Une imagination libre et des images vives dans la tête. Tu vois des mondes que les autres ne voient pas.",
      "keywords": ["Imaginatif", "Libre", "Original"],
      "desc": "Ta tête est pleine de couleurs, de scènes et de « et si… ». Tu suis ton intuition, tu changes de plan quand l’inspiration frappe et tu penses en images plus qu’en phrases. Les moments ordinaires deviennent de petits films dans ta tête, et tu remarques souvent une beauté devant laquelle les autres passent sans la voir. Tu donnes le meilleur de toi quand personne ne te presse et que tu peux suivre une étincelle où qu’elle mène. Ton originalité est ton super-pouvoir. Garde juste quelques routines simples, pour que tes grandes idées aient un endroit où atterrir.",
      "traits": ["Tu imagines ce que personne d’autre n’imaginerait", "Tu vois la beauté dans les détails du quotidien", "Tu restes ouvert aux nouvelles expériences", "Tu t’exprimes avec style"],
      "tips": ["Transforme une de tes rêveries en petit projet concret ce mois-ci", "Programme un doux rappel pour ce qui compte pour les autres"],
      "perfect": "Une journée libre avec de la musique, un carnet de croquis dans le sac et aucun programme."
    }
  }
};
