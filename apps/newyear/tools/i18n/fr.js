/* Test du Nouvel An (fr) — même structure que en.js. L’année vient de newyear-core.js (YEAR), jamais écrite à la main.
 * L’ordre de questions[i].choices[j] suit en.js (il encode le score). Pas de chiffres ni de % dans les résultats, pas de spoiler.
 * Espace fine insécable (U+202F) avant ? ! : ; et à l’intérieur des « ». Juste pour s’amuser.
 */
const Y = require('../../newyear-core.js').YEAR;

module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Lora:wght@600;700&display=swap",
    "display": "'Lora'",
    "displayWeight": 700,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": `Test du Nouvel An ${Y} – ton mot-clé de l’année`,
    "description": `Fais le test du Nouvel An ${Y} : 11 petites questions, environ 2 minutes, sans inscription. Découvre ton mot-clé de l’année, ta couleur, ton mois et ton objet porte-bonheur. Juste pour s’amuser.`,
    "ogTitle": `Test du Nouvel An ${Y} 🌅 Quel sera ton mot-clé de l’année ?`,
    "ogDescription": `Onze questions légères sur la façon dont tu as envie de vivre ${Y}. Découvre ton mot-clé, ta couleur, ton mois et ton objet porte-bonheur.`
  },
  "siteName": `Test du Nouvel An ${Y}`,
  "privacyLink": "Confidentialité",
  "start": {
    "badge": `🌅 Bonjour ${Y} !`,
    "h1Kicker": `Test du Nouvel An ${Y}`,
    "h1Html": `De quoi sera faite<br>ton année <em>${Y}</em> ?`,
    "hook": "Un calendrier tout neuf, un premier lever de soleil et une année entière de pages blanches. Réponds à onze questions légères sur ta façon de vivre et découvre le mot-clé, les porte-bonheur et les petits présages qui t’attendent cette année.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 questions",
    "start": "Voir mon année →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "On guette le premier lever de soleil…",
    "sub": "Ton horoscope du Nouvel An s’écrit"
  },
  "result": {
    "title": `Mon mot-clé ${Y} : {name}`,
    "metaDesc": `Résultat du test du Nouvel An ${Y} : {name}. {vibe} Découvre ta couleur, ton mois et ton objet porte-bonheur, et un petit présage pour l’année.`,
    "eyebrow": `Ton mot-clé pour ${Y}`,
    "colorLabel": "Couleur porte-bonheur",
    "monthLabel": "Mois porte-bonheur",
    "itemLabel": "Objet porte-bonheur",
    "gaugeLabel": "Où penchent tes réponses",
    "axes": [
      ["Nouveauté", "Stabilité"],
      ["Ensemble", "Temps pour soi"],
      ["Organisé", "Au feeling"]
    ],
    "fortuneLabel": "Ton année en un coup d’œil",
    "areas": {
      "work": "Travail & études",
      "money": "Côté budget",
      "love": "Amour & entourage",
      "self": "Prendre soin de soi"
    },
    "tipLabel": "Une petite résolution à tester",
    "buddyLabel": "Âme sœur",
    "rivalLabel": "Opposé attachant",
    "disclaimer": "Juste pour s’amuser. Ton mot-clé, tes porte-bonheur et tes présages sont des idées ludiques pour la nouvelle année : ni des prédictions, ni des conseils de santé, d’argent ou de vie.",
    "sameShare": "{pct} % des gens ont eu ce mot-clé",
    "shareText": `Mon mot-clé ${Y}, c’est {name} {emoji} « {vibe} » Et toi ?`,
    "ctaStrong": "Un ami a partagé son présage du Nouvel An",
    "ctaSub": `De quoi sera faite ton année ${Y} ? Réponse en 2 minutes.`,
    "retry": "Refaire le test"
  },
  "months": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  "og": {
    "eyebrow": `Mon mot-clé pour ${Y}`,
    "brand": `🌅 Test du Nouvel An ${Y}`,
    "defaultKicker": "Un petit quiz du Nouvel An",
    "defaultTitle": `De quoi sera faite ton année ${Y} ?`,
    "defaultDesc": "11 questions · 2 minutes · porte-bonheur"
  },
  "faq": [
    {
      "q": "Comment mon mot-clé est-il choisi ?",
      "a": "Chaque réponse fait bouger trois curseurs : essayer du neuf ou garder un rythme stable, passer du temps avec les autres ou du temps pour soi, tout prévoir ou se laisser porter. Ton mot-clé se trouve là où ces trois curseurs se rencontrent, et les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "Est-ce une vraie prédiction de mon année ?",
      "a": "Non. Le mot-clé, la couleur, le mois, l’objet porte-bonheur et les petits présages sont des idées ludiques, pas des prédictions. Personne ne peut savoir comment une année va se dérouler. Vois ton résultat comme une façon amusante de réfléchir à ce que tu as envie de vivre, un peu comme les bonnes résolutions du 1er janvier."
    },
    {
      "q": "Puis-je le refaire et obtenir autre chose ?",
      "a": "Oui. Si tu réponds autrement, tu peux tomber sur un autre mot-clé. Beaucoup de gens le refont plus tard dans l’année, quand leur humeur ou leurs projets ont changé."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et ne sont pas conservées. Nous comptons seulement, de façon anonyme, quel mot-clé est sorti, pour pouvoir montrer s’il est fréquent ou rare."
    }
  ],
  "privacy": {
    "title": `Politique de confidentialité | Test du Nouvel An ${Y}`,
    "description": `Politique de confidentialité du Test du Nouvel An ${Y} : utilisation des cookies, de la publicité et des statistiques anonymes.`,
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test du Nouvel An (le « Service ») respecte ta vie privée et ne traite que le strict minimum d’informations, comme décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service s’utilise sans inscription ni connexion. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quel résultat est sorti, afin d’indiquer la fréquence de chaque résultat."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue, afficher des publicités et comprendre comment le Service est utilisé. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de ne pas marcher correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces en fonction de tes visites précédentes sur ce site et sur d’autres. Pour en savoir plus et modifier la personnalisation des annonces, rends-toi dans les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Nous conservons des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ces totaux ne permettent pas de t’identifier personnellement."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique de confidentialité, contacte l’exploitant du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique est en vigueur depuis le 29 octobre 2026."
      ]
    ],
    "back": "← Retour au Test du Nouvel An"
  },
  "questions": [
    {
      "q": "Il est minuit moins dix, le soir du réveillon. Où es-tu ?",
      "choices": [
        "Sur le canapé avec tes personnes préférées, des chips sur la table, aucun programme",
        "À la soirée du compte à rebours que tu organises pour tes amis depuis des semaines",
        "Chez toi, seul·e, à noter tes objectifs de l’an prochain dans un carnet tout neuf",
        "Quelque part de nouveau, en voyage solo improvisé, à regarder des inconnus trinquer"
      ]
    },
    {
      "q": "Un agenda tout neuf pour l’année atterrit sur ton bureau. Qu’écris-tu en première page ?",
      "choices": [
        "Une liste d’envies à tester entre amis. Les dates attendront",
        "Rien pour l’instant. Tu écriras quand l’envie viendra",
        "Les anniversaires de chacun et les repas de famille, avant tout",
        "Un grand objectif personnel, découpé mois par mois"
      ]
    },
    {
      "q": "Le premier lever de soleil de l’année. Comment l’accueilles-tu ?",
      "choices": [
        "Réveil réglé, boisson chaude à la main, tranquillement à ta fenêtre",
        "Dans un train matinal pris sur un coup de tête, vers un endroit inconnu",
        "En menant une rando de groupe jusqu’à une colline, itinéraire et goûter prévus",
        "Encore debout avec tes amis après la soirée, et tu le vois par hasard"
      ]
    },
    {
      "q": "Ta bonne résolution de l’année serait plutôt…",
      "choices": [
        "Apprendre une nouvelle compétence, avec un planning et un suivi des progrès",
        "Appeler ou voir les gens que tu aimes, à un rythme régulier",
        "Dire oui à plus d’invitations et voir où ça mène",
        "Pas de grande résolution. Juste être un peu plus doux·ce avec toi-même"
      ]
    },
    {
      "q": "Un nouveau projet arrive au travail ou en cours. Tu…",
      "choices": [
        "Prends la partie que personne n’a encore tentée et tu improvises en route",
        "Rejoins une équipe que tu aimes bien et aides là où on a besoin de toi",
        "Prends la partie que tu maîtrises et la fais soigneusement de ton côté",
        "Proposes de piloter et construis un plan avec tout le monde"
      ]
    },
    {
      "q": "Un peu d’argent inattendu te tombe dessus, comme un cadeau ou une petite prime.",
      "choices": [
        "Tu le mets de côté pour une réunion prévue ou des cadeaux pour ta famille",
        "Tu invites tes amis à faire un truc sympa, là, tout de suite",
        "Tu le ranges quelque part et tu l’oublies jusqu’au jour où tu en as besoin",
        "Tu t’offres un cours ou du matériel pour la nouveauté que tu prévois depuis un moment"
      ]
    },
    {
      "q": "Un week-end libre, rien dans l’agenda. Que se passe-t-il ?",
      "choices": [
        "Tu organises une escapade d’une journée en groupe vers un coin que personne ne connaît",
        "Tu ranges, tu prépares la semaine et tu savoures le calme",
        "Tu flânes seul·e dans un quartier que tu n’as jamais exploré",
        "Tu écris à tes amis « Ça vous dit de passer ? » et tu laisses la journée venir"
      ]
    },
    {
      "q": "À un repas du Nouvel An, quelqu’un que tu ne connais pas s’assoit à côté de toi.",
      "choices": [
        "Tu souris, tu restes léger·ère et tu profites tranquillement du repas",
        "Tu lui demandes ce qu’il ou elle fait. Il y a peut-être quelque chose à apprendre pour tes propres objectifs",
        "Tu le ou la présentes à tout le monde et tu lances un jeu",
        "Tu veilles à ce qu’il ou elle se sente bien accueilli·e et tu l’invites à la prochaine fois"
      ]
    },
    {
      "q": "Après une période chargée, tu te sens un peu à plat. Comment recharges-tu les batteries ?",
      "choices": [
        "Tu appelles un·e ami·e proche et vous parlez de tout et de rien pendant des heures",
        "Tu tentes un truc complètement nouveau, sur un coup de tête, juste pour toi",
        "Tu organises un week-end entre amis, programme compris",
        "Tu bloques une soirée calme : coucher tôt, un bon livre, une tasse de thé"
      ]
    },
    {
      "q": "En milieu d’année, une occasion inattendue se présente.",
      "choices": [
        "Tu pèses bien le pour et le contre, puis tu te lances avec un plan clair",
        "Tu la laisses passer. Ton rythme actuel te plaît",
        "Tu en parles d’abord avec tes proches avant de décider",
        "Tu fonces tout de suite et tu embarques un·e ami·e dans l’aventure"
      ]
    },
    {
      "q": "Imagine le prochain réveillon. Qu’est-ce qui te rendrait le plus fier·ère ?",
      "choices": [
        "Un carnet rempli de petites habitudes vraiment tenues",
        "Un grand objectif atteint ensemble par toute ton équipe",
        "Une année pleine de moments chaleureux avec ceux que tu aimes",
        "Une pile d’histoires sur tout ce que tu as essayé pour la toute première fois"
      ]
    }
  ],
  "types": {
    "voyage": {
      "name": "La grande traversée",
      "word": "traversée",
      "vibe": "Tu fixes le cap, et ton équipage te suit avec plaisir.",
      "desc": "Cette année pourrait être celle du grand départ. Tu aimes les nouveaux horizons, mais tu ne quittes jamais le port sans carte, et tu voyages rarement seul·e. On fait confiance à tes plans parce que tu penses à chaque personne à bord. Les grands objectifs partagés te vont bien cette année : un projet d’équipe, un voyage entre amis, un défi relevé à plusieurs. Garde le cap, mais profite aussi du paysage.",
      "keywords": ["Projets audacieux", "Esprit d’équipe", "Nouveaux horizons"],
      "color": "Bleu océan",
      "item": "Une carte papier d’un endroit où tu rêves d’aller",
      "fortune": {
        "work": "Une bonne année pour lancer quelque chose de plus grand que ce que tu ferais seul·e. Ton talent pour fédérer pourrait t’ouvrir des portes intéressantes.",
        "money": "Mettre de côté pour un but commun, comme un voyage ou une fête, pourrait te motiver davantage qu’épargner pour épargner.",
        "love": "Les gens se rassemblent autour de toi. Pense à demander à ton équipage comment il va, pas seulement où en est le plan.",
        "self": "Planifie ton repos comme tu planifies tout le reste. Même les capitaines ont besoin d’une nuit calme au port."
      },
      "tip": "Note une aventure que tu veux partager avec quelqu’un cette année, et choisissez le mois ensemble."
    },
    "festival": {
      "name": "La fête lumineuse",
      "word": "fête",
      "vibe": "Tu transformes les jours ordinaires en petites célébrations.",
      "desc": "Ton année pourrait ressembler à un long festival avec plein de petites scènes. Tu adores essayer de nouvelles choses, et tu adores les faire avec d’autres, de préférence sans trop planifier. Ton énergie rassemble les gens et transforme un mardi gris en soirée. Cette année pourrait récompenser ton ouverture avec de nouvelles amitiés et des invitations surprises. Garde juste un peu de place dans ton agenda pour souffler.",
      "keywords": ["Joyeux", "Sociable", "Spontané"],
      "color": "Corail soleil",
      "item": "Un bouquet de ballons colorés",
      "fortune": {
        "work": "Les idées fraîches viennent facilement quand tu réfléchis avec d’autres. Une approche ludique pourrait résoudre ce que les mines sérieuses n’ont pas su régler.",
        "money": "Les bons moments partagés comptent pour toi. Une petite tirelire pour les sorties entre amis pourrait ménager à la fois ton budget et ta bonne humeur.",
        "love": "Ton cercle pourrait s’agrandir cette année. Une rencontre de hasard pourrait devenir une belle amitié.",
        "self": "Équilibre les semaines chargées avec quelques soirées tranquilles. Tu pétilles encore plus quand tu es reposé·e."
      },
      "tip": "Organise une petite célébration sans aucune raison, et invite quelqu’un que tu aimerais mieux connaître."
    },
    "summit": {
      "name": "Le haut sommet",
      "word": "sommet",
      "vibe": "Un objectif clair, une ascension régulière, une vue superbe tout en haut.",
      "desc": "Cette année ressemble à une montagne que tu as choisi de gravir. Tu aimes les vrais défis, tu aimes bien te préparer et tu es heureux·se de suivre ton propre chemin. Pas à pas, tu pourrais avancer de façon visible sur quelque chose qui compte pour toi : une compétence, un projet, un record personnel. Tu n’as pas besoin de public, mais la vue d’en haut méritera d’être partagée. Fête chaque petit camp sur la route.",
      "keywords": ["Concentré", "Déterminé", "Bien préparé"],
      "color": "Vert sapin",
      "item": "Une paire de baskets confortables",
      "fortune": {
        "work": "La concentration est ta force. Un projet au long cours ou une nouvelle compétence pourrait grandir régulièrement grâce à tes efforts patients.",
        "money": "Des objectifs clairs t’aident là aussi. Savoir pour quoi tu mets de côté pourrait rendre les petits choix plus faciles.",
        "love": "Ton ascension t’occupera peut-être beaucoup, alors un petit message à un·e vieil·le ami·e pourrait compter plus que tu ne le penses.",
        "self": "Les jours de repos font partie de toute belle ascension. Prévois-les aussi sérieusement que tes jours d’entraînement."
      },
      "tip": "Choisis un objectif pour l’année et marque trois petites étapes dans ton calendrier."
    },
    "adventure": {
      "name": "La route libre",
      "word": "route libre",
      "vibe": "Pas de carte, pas de souci. Chaque virage est une nouvelle histoire.",
      "desc": "Ton année pourrait ressembler à un road trip sans destination fixe. Tu suis ta curiosité, tu apprécies ta propre compagnie et tu changes volontiers de direction quand quelque chose d’intéressant apparaît. Cette liberté te mène vers des lieux et des idées que d’autres ne voient pas. Ce pourrait être une année de premières fois : une nouvelle ville, un nouveau loisir, un nouveau regard sur les choses. Garde un carnet à portée de main, tu voudras te souvenir des détours.",
      "keywords": ["Curieux", "Esprit libre", "Indépendant"],
      "color": "Orange coucher de soleil",
      "item": "Un sac à dos léger",
      "fortune": {
        "work": "Les chemins inhabituels pourraient te réussir. Tester une méthode que personne n’a encore essayée pourrait mener à tes meilleures idées.",
        "money": "Les expériences comptent plus pour toi que les objets. Une petite cagnotte voyage pourrait transformer tes envies en vrais départs.",
        "love": "Tu croises des gens passionnants en chemin. Laisse-en quelques-uns rester dans ton histoire plus longtemps qu’un chapitre.",
        "self": "Ta liberté est ton énergie. Assure-toi d’avoir aussi un endroit douillet où revenir."
      },
      "tip": "Essaie une chose complètement nouvelle à chaque saison, et écris une seule ligne sur ce que tu as ressenti."
    },
    "nest": {
      "name": "Le nid douillet",
      "word": "nid douillet",
      "vibe": "Tu crées un foyer où chacun se sent le bienvenu.",
      "desc": "Cette année pourrait tourner autour de quelque chose de chaleureux et de durable. Tu aimes un rythme stable, tu tiens profondément aux gens qui t’entourent et tu prépares les choses avec soin pour que chacun se sente choyé. Ta maison, ton équipe ou ta bande d’amis pourrait devenir l’endroit où tout le monde aime se retrouver. Les petites traditions que tu lances cette année, comme un dîner mensuel ou un album photo partagé, pourraient devenir celles que vous garderez longtemps.",
      "keywords": ["Attentionné", "Fiable", "Prévenant"],
      "color": "Beige chaleureux",
      "item": "Une bougie au parfum doux",
      "fortune": {
        "work": "On compte sur ta main sûre. Organiser et soutenir les autres pourrait être là où tu brilles le plus.",
        "money": "Prévoir pour le confort te correspond. Garder un petit quelque chose pour les moments partagés à la maison pourrait te faire très plaisir.",
        "love": "Tes relations pourraient gagner en profondeur plutôt qu’en nombre. Une longue conversation pourrait compter plus qu’une grande soirée.",
        "self": "Tu prends soin de tout le monde, alors laisse aussi quelqu’un prendre soin de toi. Tu as le droit d’accepter de l’aide."
      },
      "tip": "Lance une petite tradition avec ceux que tu aimes, comme un repas chaque mois ou une photo chaque année."
    },
    "bond": {
      "name": "Le cercle complice",
      "word": "cercle complice",
      "vibe": "Les plus beaux moments de ton année auront des visages familiers.",
      "desc": "Ton année pourrait être colorée par la bonne compagnie. Tu apprécies un rythme détendu, tu sais écouter et tu aimes laisser les projets naître naturellement avec ceux que tu aimes. Tes amis se sentent à l’aise avec toi, et d’anciens liens pourraient refaire surface de jolie façon. Ce pourrait être une année de longues discussions, de repas partagés et de fous rires dont tu te souviendras encore l’hiver prochain. Garde ta porte et ton cœur grands ouverts.",
      "keywords": ["Chaleureux", "Facile à vivre", "Fidèle"],
      "color": "Rose cerise",
      "item": "Une pile de cartes écrites à la main",
      "fortune": {
        "work": "De bonnes relations avec tes collègues ou camarades pourraient tout rendre plus simple. Ta gentillesse est une vraie force.",
        "money": "Partager te plaît plus que posséder. De petits cadeaux bien pensés pourraient t’apporter plus de joie que de gros achats.",
        "love": "Une vieille amitié pourrait refleurir, ou une nouvelle te donner l’impression de vous connaître depuis toujours.",
        "self": "Le temps passé avec les autres te recharge, mais les moments calmes t’aident aussi à entendre tes propres envies."
      },
      "tip": "Envoie chaque mois un petit mot écrit à la main à quelqu’un qui a illuminé ta vie."
    },
    "seed": {
      "name": "La graine patiente",
      "word": "graine patiente",
      "vibe": "De petits pas chaque jour, et quelque chose de beau finit par pousser.",
      "desc": "Cette année pourrait être celle d’une croissance tranquille. Tu préfères un rythme stable, tu aimes ton espace à toi et tu prends plaisir à prévoir de petites étapes raisonnables. Rien de spectaculaire, mais l’hiver prochain, tu pourrais être surpris·e de voir tout ce qui a poussé : une habitude qui a tenu, une compétence qui s’est épanouie, un quotidien plus serein. Ta patience est ton super-pouvoir cette année. Arrose tes graines un peu chaque jour.",
      "keywords": ["Patient", "Constant", "Serein"],
      "color": "Menthe fraîche",
      "item": "Un petit carnet d’habitudes",
      "fortune": {
        "work": "La régularité pourrait battre la vitesse cette année. De petits progrès quotidiens pourraient finir par former quelque chose dont tu seras fier·ère.",
        "money": "Les routines douces te vont bien, comme un petit point mensuel tout simple sur tes propres dépenses.",
        "love": "Ton cercle n’est peut-être pas le plus grand, mais ceux qui en font partie sauront qu’ils peuvent compter sur toi.",
        "self": "Une routine simple, un coin bien rangé et une nuit qui commence tôt pourraient suffire pour te sentir au mieux."
      },
      "tip": "Choisis une toute petite habitude quotidienne, assez petite pour la tenir même les jours de grande flemme."
    },
    "pause": {
      "name": "La douce pause",
      "word": "douce pause",
      "vibe": "Une année plus lente, un cœur plus léger et de la place pour respirer.",
      "desc": "Ton année pourrait être celle du ralentissement, dans le meilleur sens du terme. Tu aimes un rythme calme, tu tiens à ton temps pour toi et tu laisses volontiers la vie se dérouler sans forcer. Ce n’est pas ne rien faire : c’est l’espace où les nouvelles idées apparaissent en silence. Ce pourrait être une année pour savourer les plaisirs simples, un bon livre, une longue balade, une soirée sous le plaid, et remarquer ce qui te rend vraiment heureux·se.",
      "keywords": ["Paisible", "Réfléchi", "Tout en douceur"],
      "color": "Lavande",
      "item": "Une écharpe douce et moelleuse",
      "fortune": {
        "work": "Un esprit calme voit clair. Prendre un moment avant de décider pourrait t’aider à choisir le bon chemin.",
        "money": "Les joies simples coûtent peu. Tu pourrais découvrir que ce que tu aimes le plus est déjà à portée de main.",
        "love": "La compagnie paisible te va bien. Un ou deux amis proches pourraient suffire à remplir ton année.",
        "self": "C’est ton année pour te reposer sans culpabiliser. Les matins lents et les soirées calmes sont bien mérités."
      },
      "tip": "Garde une soirée par semaine entièrement libre, juste pour faire ce dont tu as envie."
    }
  }
};
