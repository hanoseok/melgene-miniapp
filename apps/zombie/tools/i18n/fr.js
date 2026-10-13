/* Zombie Apocalypse Survival Test (fr)
 * Same keys and question/choice order as en.js (scoring lives in zombie-core.js).
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Rubik:wght@700;800&display=swap",
    "display": "'Rubik'",
    "displayWeight": 800,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test de survie zombie : quel rôle pendant l’apocalypse ?",
    "description": "Fais le test de survie à l’apocalypse zombie : 12 scénarios, 2 minutes, sans inscription. Découvre ton rôle de survivant, tes atouts et ton allié idéal.",
    "ogTitle": "Test de survie zombie 🧟 Quel serait ton rôle ?",
    "ogDescription": "12 scénarios d’invasion, 2 minutes. Qui serais-tu si les zombies débarquaient ?"
  },
  "siteName": "Test de survie zombie",
  "privacyLink": "Confidentialité",
  "start": {
    "badge": "🧟 Spécial Halloween",
    "h1Kicker": "Test de survie zombie",
    "h1Html": "Qui serais-tu<br>si les <em>zombies</em> débarquaient ?",
    "hook": "Les sirènes hurlent et le groupe WhatsApp s’affole. Traverse 12 scénarios d’invasion et découvre quel rôle tu tiendrais le jour où tout bascule.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "📻 12 scénarios",
    "start": "Survivre →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Jour {n}"
  },
  "loading": {
    "text": "On vérifie ton kit de survie…",
    "sub": "Signal radio capté"
  },
  "result": {
    "title": "Mon rôle dans l’apocalypse zombie : {name}",
    "metaDesc": "Résultat du test de survie zombie : {name}. {vibe}",
    "eyebrow": "Quand les zombies débarquent, tu es",
    "forecastLabel": "Pronostic de survie",
    "strengthsLabel": "Compétences de survie",
    "weaknessLabel": "Point faible",
    "tipLabel": "Astuce de survie",
    "sameShare": "{pct} % des survivants ont ce rôle",
    "shareText": "Mon rôle dans l’apocalypse zombie : {name} {emoji} « {vibe} » Et toi, tu serais qui ?",
    "ctaStrong": "Un ami a partagé son rôle de survivant",
    "ctaSub": "Et toi, tu serais qui ? 2 minutes.",
    "bestLabel": "Allié idéal",
    "worstLabel": "Pire allié",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon rôle de survivant",
    "brand": "🧟 Test de survie zombie",
    "defaultKicker": "Test de survie zombie",
    "defaultTitle": "Qui serais-tu si les zombies débarquaient ?",
    "defaultDesc": "12 scénarios d’invasion · 2 minutes"
  },
  "faq": [
    {
      "q": "Comment mon rôle de survivant est-il choisi ?",
      "a": "Chaque réponse ajoute des points aux rôles qui lui correspondent. Celui qui a le plus de points après le dernier scénario devient ton résultat. Mêmes réponses, même résultat, à chaque fois."
    },
    {
      "q": "Est-ce un vrai test de survie ?",
      "a": "Non, c’est juste pour s’amuser. Les scénarios sont loufoques et le pronostic de survie est une blague, pas une statistique. Ne bâtis surtout pas ton vrai plan d’urgence là-dessus."
    },
    {
      "q": "Est-ce que ça fait peur ou c’est gore ?",
      "a": "Pas du tout. Pense comédie d’Halloween plutôt que film d’horreur : pas de sang, pas de sursauts, juste des situations absurdes et des choix rapides."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et jamais stockées. Nous comptons seulement, de façon anonyme, quel rôle est sorti, pour afficher la part de chacun."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test de survie zombie",
    "description": "Politique de confidentialité du Test de survie zombie : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test de survie zombie (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations nécessaires, comme décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Tu peux utiliser le Service sans inscription ni connexion. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quel résultat est sorti, afin d’afficher la fréquence de chaque résultat."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local de ton navigateur pour mémoriser ta langue, afficher des publicités et comprendre comment le Service est utilisé. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de ne pas fonctionner correctement."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces basées sur tes visites précédentes sur ce site et d’autres sites. Pour en savoir plus et modifier tes préférences de personnalisation, consulte les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
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
        "Cette politique est en vigueur depuis le 14 octobre 2026."
      ]
    ],
    "back": "← Retour au test de survie"
  },
  "questions": [
    {
      "q": "7 h du matin. Ton téléphone explose d’alertes : l’invasion zombie, c’est pour de vrai. Premier réflexe ?",
      "choices": [
        "J’appelle tout le monde et je fixe un point de rendez-vous",
        "Je regarde les infos calmement pour comprendre ce qui se passe",
        "Je prends mon sac et je file avant que les rues se remplissent",
        "Je rappuie sur snooze. Ça va sûrement s’arranger… non ?"
      ]
    },
    {
      "q": "Tu as cinq minutes pour faire un seul sac. Qu’est-ce que tu mets en premier ?",
      "choices": [
        "La trousse de secours, évidemment",
        "Des conserves, de l’eau et un ouvre-boîte",
        "Du gros scotch, un couteau multifonction et des piles",
        "Une enceinte et mes snacks préférés"
      ]
    },
    {
      "q": "Il est temps de choisir une planque.",
      "choices": [
        "Un immense centre commercial : des provisions à chaque étage",
        "Un chalet tranquille au fond des bois, rien que pour moi",
        "Le gymnase du collège, où beaucoup de monde peut se réunir",
        "Un toit que j’équipe d’alarmes et de panneaux solaires"
      ]
    },
    {
      "q": "Un groupe d’inconnus frappe à la porte et demande à te rejoindre.",
      "choices": [
        "Je les fais entrer et je vérifie si quelqu’un est blessé",
        "Je pose d’abord quelques questions, puis je décide",
        "Je les accueille avec une blague et un chocolat chaud",
        "Je leur indique une meilleure planque un peu plus loin"
      ]
    },
    {
      "q": "Le groupe n’arrive pas à se mettre d’accord sur la suite.",
      "choices": [
        "Je prends les choses en main et je tranche",
        "Je présente trois options avec leurs pour et leurs contre",
        "Je détends l’atmosphère jusqu’à ce que tout le monde se calme",
        "Pile ou face. Jusqu’ici, ça a toujours marché"
      ]
    },
    {
      "q": "Ton pote a une griffure louche et jure que c’est le chat.",
      "choices": [
        "Je nettoie, je fais un pansement et je garde un œil sur lui",
        "Je le crois. Les chats peuvent être féroces",
        "Je prépare discrètement un plan B, au cas où",
        "J’accroche une petite clochette à sa porte, au cas où"
      ]
    },
    {
      "q": "C’est ton tour de garde cette nuit. Comment tu tiens le coup ?",
      "choices": [
        "Je bidouille la radio jusqu’à capter un signal",
        "Je raconte des histoires qui font frissonner à l’autre veilleur",
        "Je compte les provisions et je prépare la sortie de demain",
        "Je pique du nez, et bizarrement il ne se passe jamais rien pendant mon tour"
      ]
    },
    {
      "q": "Les provisions commencent à manquer.",
      "choices": [
        "Je pars en expédition au supermarché",
        "Je rationne tout équitablement pour que personne n’ait faim",
        "Je lance un potager sur le toit",
        "Je m’éclipse seul et je reviens avec des snacks"
      ]
    },
    {
      "q": "La radio grésille : il existe une zone sûre très, très loin d’ici.",
      "choices": [
        "Je planifie l’itinéraire, les étapes et un plan de secours",
        "Je rassemble tout le monde et je mène l’expédition",
        "Je prépare les fournitures médicales pour la route",
        "Road trip ! Vitres baissées, musique à fond"
      ]
    },
    {
      "q": "Une foule de zombies lents et traînants bloque la route.",
      "choices": [
        "Je cherche une route secondaire sur la carte",
        "Je passe seul en douce. Ils ne me remarqueront même pas",
        "Je les attire ailleurs avec un gadget bruyant de ma fabrication",
        "J’attends, et je tombe par hasard sur un raccourci"
      ]
    },
    {
      "q": "Un après-midi calme dans la planque. Tu fais quoi ?",
      "choices": [
        "J’apprends les gestes de premiers secours à tout le monde",
        "Je fouille le garage du voisin à la recherche de trucs utiles",
        "J’organise un concours de talents",
        "Je gagne toutes les parties de belote sans vraiment forcer"
      ]
    },
    {
      "q": "Choisis ta devise de survie.",
      "choices": [
        "On ne laisse personne derrière",
        "On soigne et on avance",
        "Si tu ne trouves pas, c’est que tu cherches mal",
        "Voyager léger, suivre son instinct"
      ]
    }
  ],
  "types": {
    "leader": {
      "name": "Le Capitaine",
      "word": "capitaine",
      "vibe": "Prend les commandes et fait avancer le groupe.",
      "forecast": "Encore en train de motiver les troupes pendant le générique de fin.",
      "desc": "Quand les sirènes retentissent, tout le monde se tourne vers toi, et tu ne bronches pas. Tu fixes le point de rendez-vous, tu répartis les tâches et tu prends les décisions difficiles pour que personne d’autre n’ait à le faire. Tu ne joues pas au chef pour le plaisir : tu ne supportes simplement pas de voir un groupe se désagréger. Avec toi devant, même une bande de bras cassés finit par ressembler à une équipe.",
      "strengths": [
        "Décide avec calme",
        "Garde le groupe soudé",
        "Courageux dans la tempête"
      ],
      "weakness": "Tu veux porter tous les problèmes seul et tu oublies de dormir.",
      "tip": "Distribue les missions tôt. Une équipe occupée panique moins qu’une équipe qui se pose des questions."
    },
    "strategist": {
      "name": "Le Cerveau",
      "word": "cerveau",
      "vibe": "Trois plans d’avance avant que quiconque en ait un seul.",
      "forecast": "Survit grâce aux cartes, aux listes et à un excellent plan C.",
      "desc": "Tu ne cours pas, tu réfléchis. Pendant que les autres crient, tu comptes déjà les sorties, tu lis la carte et tu te demandes quel pont tient encore debout. Tes plans ont des plans de secours, qui ont eux-mêmes des plans de secours. On te trouve parfois lent à démarrer, mais tout le monde finit par suivre ton itinéraire.",
      "strengths": [
        "Voit la situation d’ensemble",
        "Toujours un plan B",
        "Sang-froid sous pression"
      ],
      "weakness": "Tu peux tellement réfléchir que le bon moment pour bouger est déjà passé.",
      "tip": "Un bon plan aujourd’hui vaut mieux qu’un plan parfait demain. Choisis une route et fonce."
    },
    "medic": {
      "name": "Le Secouriste",
      "word": "secouriste",
      "vibe": "Garde tout le monde rafistolé et en état de marche.",
      "forecast": "La personne que chaque groupe refuse absolument de perdre.",
      "desc": "Tu es le premier à remarquer une jambe qui boite, une toux ou un ami devenu silencieux. Tu as rangé la trousse de secours avant les snacks, et tu restes stable quand tout le monde tremble. Ta gentillesse est concrète : des pansements, de l’eau et une voix calme. Chaque groupe que tu rejoins devient un peu plus solide, rien que parce que tu es là.",
      "strengths": [
        "Des mains sûres",
        "Remarque tout",
        "Bienveillance sans limite"
      ],
      "weakness": "Tu prends soin de tout le monde et tu oublies tes propres égratignures.",
      "tip": "Prends des chaussettes en plus. Des pieds au sec, c’est l’équipement de survie le plus sous-estimé."
    },
    "scavenger": {
      "name": "Le Fouineur",
      "word": "fouineur",
      "vibe": "Trouve ce dont tout le monde a besoin, pile au bon moment.",
      "forecast": "Ne manque jamais de snacks, de piles ni de scotch.",
      "desc": "Les centres commerciaux abandonnés sont tes cartes au trésor. Tu sais quel rayon a encore des piles, quelle pharmacie tout le monde a oubliée et comment entrer et sortir avant que quoi que ce soit ne te remarque. Tu es rapide, débrouillard et un peu fier de tes trouvailles. Pendant que les autres s’inquiètent pour demain, toi, tu reviens avec un sac à dos qui en est rempli.",
      "strengths": [
        "Débrouillard",
        "Vif et agile",
        "Repère des trucs utiles partout"
      ],
      "weakness": "Tu prends un risque de trop pour un pot de pâte à tartiner.",
      "tip": "Vérifie toujours l’étagère du haut et la réserve. Tout le monde les oublie."
    },
    "engineer": {
      "name": "Le Bricoleur",
      "word": "bricoleur",
      "vibe": "Transforme la ferraille en gadgets qui sauvent la mise.",
      "forecast": "Aura remis l’eau chaude et le Wi-Fi en route dès la deuxième semaine.",
      "desc": "Donne-toi du gros scotch, une batterie de voiture et un après-midi, et tu construis un système d’alarme, un chargeur solaire ou un drone un peu douteux. Devant un objet cassé, tu te demandes aussitôt comment le réparer. Tu es plus heureux dans un coin tranquille avec tes outils, et tout le groupe dort mieux grâce à ce que tu fabriques. Un vrai MacGyver de fin du monde.",
      "strengths": [
        "Inventif face aux problèmes",
        "Habile de ses dix doigts",
        "Patient et concentré"
      ],
      "weakness": "Tu oublies de manger quand un projet devient passionnant.",
      "tip": "Apprends à fabriquer une alarme avec des boîtes de conserve et de la ficelle. Le low-tech ne tombe jamais en panne de batterie."
    },
    "lonewolf": {
      "name": "Le Loup solitaire",
      "word": "loup solitaire, loup",
      "vibe": "Discret, rapide et au top quand tu es seul.",
      "forecast": "Aperçu dans chaque zone sûre. Personne ne sait comment il est arrivé là.",
      "desc": "Tu voyages léger, tu fais confiance à ton instinct et tu n’as pas besoin de la foule pour te sentir en sécurité. Pendant que les groupes se disputent, tu t’es déjà faufilé par la ruelle de derrière. Tu n’es pas froid : tu sais juste que moins de monde, c’est moins de bruit. Et quand tu décides d’aider quelqu’un, il s’en souvient pour toujours.",
      "strengths": [
        "Autonome",
        "Furtif et rapide",
        "Fait confiance à son instinct"
      ],
      "weakness": "Tu attends beaucoup trop longtemps avant de demander de l’aide.",
      "tip": "Voyage léger, mais garde toujours un sifflet. Même un loup solitaire a besoin d’appeler la meute."
    },
    "cheer": {
      "name": "Le Boute-en-train",
      "word": "boute-en-train",
      "vibe": "La raison pour laquelle le groupe rit encore au trentième jour.",
      "forecast": "Fait chanter tout le bunker avant la fin de la semaine.",
      "desc": "Les provisions maintiennent les gens en vie, mais toi, tu les fais tenir. Tu racontes les histoires, tu lances les parties de cartes et tu trouves de quoi rire même pendant une panne de courant. Tu sens quand l’ambiance retombe et tu la relèves avec une blague ou une chanson. Tu n’es peut-être pas le plus rapide à la course, mais chaque groupe où tu passes se sent un peu plus courageux.",
      "strengths": [
        "Remonte le moral de tous",
        "Rassemble les gens",
        "Créatif dans les coups durs"
      ],
      "weakness": "Ton rire est parfois un peu fort quand il faudrait du silence.",
      "tip": "Emporte un jeu de cartes. Le moral aussi, c’est une ressource de survie."
    },
    "lucky": {
      "name": "Le Chanceux",
      "word": "chanceux",
      "vibe": "Allez savoir comment, tout finit toujours par s’arranger pour toi.",
      "forecast": "A dormi pendant tout le premier jour de l’invasion. Un classique.",
      "desc": "Tu n’as pas toujours de plan, et pourtant la porte est ouverte, la voiture a de l’essence et le zombie trébuche juste avant de t’atteindre. Tu restes détendu quand les autres paniquent, et ce calme est un super-pouvoir à lui seul. Tes amis disent en rigolant que l’endroit le plus sûr de la ville, c’est à côté de toi, et ils n’ont peut-être pas tort.",
      "strengths": [
        "Zen en toutes circonstances",
        "Excellent instinct",
        "Transforme le chaos en coup de bol"
      ],
      "weakness": "La chance n’est pas un plan, et tes amis te le rappellent sans arrêt.",
      "tip": "Garde un double des clés et un snack dans chaque veste. La chance sourit à ceux qui s’y préparent."
    }
  }
};
