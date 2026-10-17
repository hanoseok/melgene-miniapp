/* Spending Personality Test (fr)
 * 8 result ids (saver value flex impulse saverflex dealhunter quality balance); questions[i].choices[j] follow spend-core.js QUESTIONS[i].v[j] (the habit axis of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name — only used by the spoiler check.
 * Result texts never contain numbers or %: the only numbers are the user's own style mix and the real server share.
 * Placeholders: {name} {emoji} {vibe} {pct} {s} {v} {f} {i}. Entertainment only, not financial advice.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test de personnalité financière : quel dépensier es-tu ?",
    "description": "Fais le test dépensier ou économe : 12 situations du quotidien, 2 minutes, sans inscription. Pour s’amuser, pas un conseil financier.",
    "ogTitle": "Test de personnalité financière 💸 Quel est ton style d’argent ?",
    "ogDescription": "12 situations d’argent du quotidien, 2 minutes. Économe, flambeur ou acheteur compulsif ?"
  },
  "siteName": "Test de personnalité financière",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "💸 Juste pour rire",
    "h1Kicker": "Test de personnalité financière",
    "h1Html": "Quel genre de <em>dépensier</em><br>es-tu ?",
    "hook": "Jour de paie, promos, resto entre amis et abonnements oubliés. Réponds franchement à 12 petites situations d’argent du quotidien et découvre ton style de dépenses.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "🛍️ 12 situations",
    "start": "Mon style d’argent →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "On compte tes sous…",
    "sub": "Lecture de tes tickets de caisse, pour rire"
  },
  "result": {
    "title": "Mon style de dépenses : {name}",
    "metaDesc": "Résultat du test de personnalité financière : {name}. {vibe}",
    "eyebrow": "Ton style de dépenses est",
    "gaugeLabel": "Tes propres réponses, par style",
    "axes": [
      "Économe",
      "Chasseur de bons plans",
      "Flambeur",
      "Impulsif"
    ],
    "strengthsLabel": "Tes atouts côté argent",
    "weaknessLabel": "À surveiller",
    "tipLabel": "Idée pour s’amuser",
    "disclaimer": "Pour le divertissement uniquement. Ceci n’est pas un conseil financier.",
    "sameShare": "{pct} % des gens ont obtenu ce style",
    "shareText": "Mon style de dépenses : {name} {emoji} « {vibe} » Et toi ?",
    "shareTextPct": "Mon style de dépenses : {name} {emoji} (Économe {s} % · Bons plans {v} % · Flambeur {f} % · Impulsif {i} %) Et toi ?",
    "ctaStrong": "Un ami a partagé son style d’argent",
    "ctaSub": "Économe ou flambeur ? Réponse en 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon style de dépenses",
    "brand": "💸 Test de personnalité financière",
    "defaultKicker": "Test de personnalité financière",
    "defaultTitle": "Quel genre de dépensier es-tu ?",
    "defaultDesc": "12 situations d’argent du quotidien · 2 minutes"
  },
  "faq": [
    {
      "q": "Comment mon style de dépenses est-il déterminé ?",
      "a": "Chaque réponse penche vers l’une des quatre habitudes d’argent : épargner, chercher le bon plan, se faire plaisir ou acheter sur un coup de tête. Ton résultat dépend des habitudes que tu as choisies le plus souvent et de l’écart entre elles. Les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "Est-ce un conseil financier ?",
      "a": "Non. C’est un petit quiz de personnalité fait pour s’amuser. Il ne dit rien de ta vraie situation financière et ne doit jamais servir à prendre une décision d’argent. Pour une vraie question financière, adresse-toi à un professionnel qualifié."
    },
    {
      "q": "Y a-t-il un bon ou un mauvais style de dépenses ?",
      "a": "Non. Chaque style a ses forces et ses angles morts, et la plupart des gens en mélangent plusieurs. Tes réponses changent aussi selon ton humeur, ton budget et ta période de vie : refais le test un autre jour."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et ne sont jamais stockées. On compte seulement, de façon anonyme, quel style est sorti, pour pouvoir montrer la fréquence de chacun."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test de personnalité financière",
    "description": "Politique de confidentialité du Test de personnalité financière — notre usage des cookies, de la publicité et des statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test de personnalité financière (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations nécessaires, comme décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Tu peux utiliser le Service sans t’inscrire ni te connecter. Tes réponses et ton mélange de styles sont calculés dans ton navigateur et ne sont jamais envoyés ni stockés sur nos serveurs. On compte seulement, de façon anonyme, quel résultat est sorti, pour pouvoir montrer la fréquence de chaque résultat."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue, afficher des publicités et comprendre comment le Service est utilisé. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctionnalités risquent alors de ne pas fonctionner correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de tes visites précédentes sur ce site et sur d’autres sites web. Pour en savoir plus et modifier tes paramètres de personnalisation des annonces, rends-toi dans les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Nous conservons des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ces totaux ne permettent pas de t’identifier personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, contacte l’éditeur du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique est en vigueur depuis le 18 octobre 2026."
      ]
    ],
    "back": "← Retour au Test de personnalité financière"
  },
  "questions": [
    {
      "q": "Ton salaire vient d’arriver. Que fais-tu en premier ?",
      "choices": [
        "Je réserve un truc sympa dont j’ai envie depuis longtemps",
        "Je vire tout de suite une bonne part sur mon livret",
        "J’ouvre une appli de shopping : « je le mérite »",
        "Je regarde les factures et abonnements à venir, puis je planifie le reste"
      ]
    },
    {
      "q": "Un ami t’invite dans un resto à la mode, plutôt cher.",
      "choices": [
        "Je propose une adresse moins chère ou un dîner à la maison",
        "Super ! Je commande exactement ce qui me fait envie",
        "Je regarde les avis et les menus pour trouver le meilleur rapport qualité-prix",
        "Je réserve tout de suite, je verrai l’addition plus tard"
      ]
    },
    {
      "q": "Ton casque rend l’âme et il faut le remplacer.",
      "choices": [
        "Je compare les avis et l’historique des prix pendant des semaines",
        "J’achète le premier que me montre une pub. Réglé en une minute",
        "J’attends le plus longtemps possible, puis je prends le moins cher qui tient la route",
        "Je prends le top du top, confortable et fait pour durer"
      ]
    },
    {
      "q": "Ta boutique préférée lance de grosses promos.",
      "choices": [
        "Je remplis le panier avant d’avoir le temps de réfléchir",
        "Je n’achète que ce qui était déjà sur ma liste",
        "Je craque pour la belle pièce enfin à portée de main",
        "Je passe mon chemin. Pas cher, ça reste cher si je n’en avais pas besoin"
      ]
    },
    {
      "q": "Un essai gratuit va bientôt devenir un abonnement payant.",
      "choices": [
        "Je l’ai résilié le jour même où je me suis inscrit",
        "Je le garde. Un bon service, ça se paie",
        "Je mets un rappel et je décide si ça vaut le coup",
        "J’avais oublié, et maintenant j’en paie plusieurs"
      ]
    },
    {
      "q": "Pause café au travail.",
      "choices": [
        "La boisson signature de mon café préféré, sans regret",
        "Café fait maison, dans ma gourde à moi",
        "Un café, une viennoiserie et ce joli mug près de la caisse",
        "Le café avec les meilleurs coupons et la carte de fidélité"
      ]
    },
    {
      "q": "L’addition du dîner entre amis arrive.",
      "choices": [
        "Je paie pour tout le monde sur un coup de tête, puis je me demande où est passé l’argent",
        "J’utilise une appli de partage pour que ce soit rapide et juste",
        "J’offre une tournée, et on prend aussi un dessert",
        "Je paie exactement ce que j’ai mangé, au centime près"
      ]
    },
    {
      "q": "La caissière te propose un petit extra en caisse.",
      "choices": [
        "Seulement si l’offre groupée est vraiment plus avantageuse",
        "Oui, et les bonbons près de la caisse aussi",
        "« Non merci. » Même pas besoin de réfléchir",
        "Pourquoi pas. Les petits luxes embellissent la journée"
      ]
    },
    {
      "q": "Tu prépares tes vacances.",
      "choices": [
        "Un tableur et des comparateurs pour avoir le meilleur rapport qualité-prix",
        "Je réserve un vol ce soir parce que le tarif avait l’air bon",
        "Hors saison, hébergement à petit prix, activités gratuites",
        "Un très bel hôtel. Le voyage, c’est ma récompense"
      ]
    },
    {
      "q": "Tu ouvres l’appli de ta banque en fin de mois.",
      "choices": [
        "Attends, où est passé tout ça ?",
        "Je range tout par catégories et j’ajuste le mois prochain",
        "Je sais où c’est parti et ça en valait la peine",
        "Le solde est confortable et j’en suis discrètement fier"
      ]
    },
    {
      "q": "Tu te lances dans un nouveau loisir.",
      "choices": [
        "Direct le matériel de pro. Si je le fais, je le fais bien",
        "J’emprunte du matériel et j’apprends avec des vidéos gratuites",
        "Matériel, livres, cours et une tenue adorable, le tout dès la première semaine",
        "J’achète le kit débutant le mieux noté"
      ]
    },
    {
      "q": "Quelle phrase te ressemble le plus ?",
      "choices": [
        "« Chaque petite économie compte »",
        "« On n’a qu’une vie »",
        "« Pourquoi payer plus cher pour la même chose ? »",
        "« Sur le moment, ça me semblait évident »"
      ]
    }
  ],
  "types": {
    "saver": {
      "name": "Pro de la Cagnotte",
      "word": "cagnotte",
      "vibe": "Chaque sou a sa mission, et les tiens arrivent toujours à l’heure.",
      "desc": "Tu aimes savoir où est ton argent et à quoi il sert. Tu prépares ton déjeuner sans rechigner, tu repères les petites fuites et tu ressens un frisson tranquille quand le chiffre sur ton compte grimpe. Tes amis t’appellent pour savoir si un achat vaut vraiment le coup, et tu leur réponds franchement. Tes habitudes calmes et régulières rendent l’avenir moins effrayant.",
      "strengths": [
        "Patient et rigoureux",
        "Repère vite le gaspillage",
        "Serein face à l’avenir"
      ],
      "weakness": "Tu peux dire non à des choses qui t’auraient vraiment rendu heureux, puis te sentir un peu à l’écart.",
      "tip": "Choisis chaque mois un petit plaisir rien qu’à toi, zéro culpabilité. En profiter fait partie du plan."
    },
    "value": {
      "name": "Détective des Bons Plans",
      "word": "détective",
      "vibe": "D’abord comparer, ensuite acheter.",
      "desc": "Tu te renseignes avant d’acheter : avis, historique des prix, l’autre onglet, l’autre magasin. Dénicher la meilleure offre, c’est comme résoudre une petite énigme, et tu adores partager la solution. Tu n’es pas radin, juste allergique à l’arnaque tarifaire. On suit tes conseils les yeux fermés parce que tu as déjà fait tes devoirs.",
      "strengths": [
        "Excellent enquêteur",
        "Compare avec calme",
        "Partage ses bonnes trouvailles"
      ],
      "weakness": "Comparer peut prendre plus de temps que l’objet n’en vaut, et tu rates parfois le bon moment.",
      "tip": "Fixe-toi une limite de temps pour tes recherches. Le meilleur plan, c’est aussi celui dont tu profites vraiment."
    },
    "flex": {
      "name": "Héros de Son Propre Film",
      "word": "film",
      "vibe": "Vit chaque jour comme une avant-première.",
      "desc": "Pour toi, les beaux moments méritent de belles choses : le bon dîner, la place de concert, le cadeau qui fait écarquiller les yeux. Tu dépenses avec intention et sans trop de culpabilité, et ta générosité est contagieuse. Tes amis adorent ta compagnie parce que tu transformes une soirée ordinaire en événement. Tu vis le moment présent et tu le fais briller.",
      "strengths": [
        "Généreux et fun",
        "Crée des souvenirs inoubliables",
        "Sait ce qu’il aime"
      ],
      "weakness": "Les grands moments peuvent éclipser les petits moments tranquilles qui comptent plus tard.",
      "tip": "Garde aussi dans ton agenda un petit cadeau pour ton futur toi. Ça rend le plaisir encore meilleur."
    },
    "impulse": {
      "name": "Roi du Panier Plein",
      "word": "panier",
      "vibe": "Le panier se remplit plus vite que la réflexion n’arrive.",
      "desc": "Tu suis ton étincelle. Un objet craquant, une bonne humeur ou l’enthousiasme d’un ami, et hop, le colis est déjà en route. Cette spontanéité fait ton charme : tu essaies des choses, tu dis oui aux aventures et ta vie est rarement ennuyeuse. Tes étagères sont pleines d’histoires, même de celles qui ont commencé par « il me le fallait ».",
      "strengths": [
        "Spontané et curieux",
        "Dit oui à l’aventure",
        "Répand la bonne humeur"
      ],
      "weakness": "Certains achats perdent vite leur charme, et le relevé de fin de mois te réserve des surprises.",
      "tip": "Essaie un panier « peut-être » pour une nuit. Si tu souris encore demain, c’est un vrai oui."
    },
    "saverflex": {
      "name": "Fourmi puis Cigale",
      "word": "cigale",
      "vibe": "Prudent pendant des mois, puis un grand oui rayonnant.",
      "desc": "La plupart du temps, tu es le sérieux de la bande : les coupons, le repas préparé, le « pas maintenant ». Mais tu économises pour un but précis, et le jour venu, tu t’offres exactement ce dont tu rêvais, sans te justifier. Un mélange surprenant : économe et théâtral à la fois. On est souvent bluffé par la taille de ton unique grand oui.",
      "strengths": [
        "Épargne avec un objectif",
        "Savoure pleinement ses achats",
        "Sait ce qui compte"
      ],
      "weakness": "Une longue attente peut rendre la folie trop énorme, et la culpabilité peut s’inviter ensuite.",
      "tip": "Donne un nom et une date à ton grand plaisir. L’attendre, c’est déjà la moitié du bonheur."
    },
    "dealhunter": {
      "name": "Chasseur de Soldes",
      "word": "soldes",
      "vibe": "Une bonne affaire, c’est dur de lui tourner le dos.",
      "desc": "Les réductions te font briller les yeux. Tu adores l’offre limitée, le lot et le code promo qui marche vraiment, et tu sautes dessus quand le prix te convient. Mi-détective, mi-aventurier, tu prends un vrai plaisir à la chasse elle-même. Tes amis t’écrivent pour savoir si une promo vaut vraiment le battage.",
      "strengths": [
        "Œil de lynx pour les offres",
        "Rapide et décidé",
        "Agréable pour faire les boutiques"
      ],
      "weakness": "Un super prix peut te faire oublier de te demander si tu en avais vraiment besoin.",
      "tip": "Avant de cliquer, demande-toi : « Je le voudrais à plein tarif ? » Si oui, c’est une vraie victoire."
    },
    "quality": {
      "name": "Acheteur du Durable",
      "word": "durable",
      "vibe": "Un peu plus cher une fois, des années de plaisir.",
      "desc": "Tu choisis avec soin et tu choisis bien. Tu préfères avoir une superbe veste plutôt que cinq moyennes, et tu fais attention à la sensation, à la tenue dans le temps et à la façon dont les choses s’intègrent à ta vie. Tu te renseignes juste assez pour être sûr, puis tu t’engages sans regret. Tes affaires restent belles longtemps, et tu en tires une vraie fierté.",
      "strengths": [
        "Réfléchi et exigeant",
        "Apprécie le savoir-faire et la solidité",
        "Regrette rarement un achat"
      ],
      "weakness": "La « meilleure » option est parfois introuvable, et l’attendre peut te ralentir.",
      "tip": "Le « assez bien » est parfois très bien. Autorise-toi à profiter du bel objet dès maintenant."
    },
    "balance": {
      "name": "Budget Équilibré",
      "word": "équilibré",
      "vibe": "Ni radin, ni fou. Juste ce qu’il faut.",
      "desc": "Tu mélanges un peu de tout. Tu sais économiser quand il le faut, acheter malin quand ça aide, te faire plaisir quand ça compte et t’offrir de temps en temps un achat spontané. Ça fait de toi quelqu’un de facile pour faire les boutiques, voyager ou partager une addition. Ton rapport à l’argent met les autres à l’aise, parce qu’il est souple et sympathique.",
      "strengths": [
        "Souple et détendu",
        "S’adapte à toute situation",
        "Facile pour partager l’addition"
      ],
      "weakness": "Sans règle forte, les petites décisions peuvent dériver sans que tu t’en rendes compte.",
      "tip": "Choisis une toute petite habitude que tu aimes et fais-en ton point d’ancrage. Le reste peut rester souple."
    }
  }
};
