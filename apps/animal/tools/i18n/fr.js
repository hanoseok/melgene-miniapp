/* Quel animal es-tu ? (fr)
 * Same 8 animal ids (wolf owl otter lion panda eagle sloth deer) and question/choice order as animal-core.js (scoring weights live only there).
 * questions[i].choices[j] must stay in the same order as animal-core.js QUESTIONS[i].choices[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name an animal result or quote a question.
 * types.<id>.word = the plain animal word(s) in this language (comma-separated) — only used by the spoiler check.
 * Placeholders: {name} {emoji} {vibe} {pct} {n} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap",
    "display": "'Nunito'",
    "displayWeight": 900,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Quel animal es-tu ? Test de personnalité animal",
    "description": "Quel animal es-tu ? Un test de personnalité animal en 8 situations du quotidien, 2 à 3 minutes, gratuit et sans inscription. Découvre l’animal qui te ressemble, ton match idéal et des conseils.",
    "ogTitle": "Quel animal es-tu ? 🦊 Test de personnalité animal",
    "ogDescription": "Un quiz express de 2 minutes. Réponds à 8 situations du quotidien et rencontre l’animal qui te ressemble."
  },
  "siteName": "Quel animal es-tu ?",
  "privacyLink": "Confidentialité",
  "start": {
    "badge": "🦊 Test de personnalité animal",
    "h1Kicker": "Quel animal es-tu ?",
    "h1Html": "À quel animal<br>ressembles-tu <em>le plus</em> ?",
    "hook": "Un plan annulé, un appel en pleine nuit, une soirée où tu ne connais personne… Quelques moments du quotidien révèlent ton côté sauvage.",
    "metaTime": "⏱️ 2 à 3 minutes",
    "metaCount": "🐾 8 questions",
    "start": "Trouver mon animal →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "On suit tes traces…",
    "sub": "On associe tes réponses à un animal"
  },
  "result": {
    "title": "Quel animal es-tu ? Je suis {name}",
    "eyebrow": "L’animal qui te ressemble le plus",
    "strengthsLabel": "Tes super-pouvoirs",
    "tipsLabel": "Conseils pour ton côté animal",
    "bestLabel": "Match idéal",
    "rivalLabel": "Rival",
    "sameShare": "{pct} % des joueurs ont cet animal",
    "shareText": "Mon animal, c’est {name} {emoji} — « {vibe} » Et toi, quel animal es-tu ?",
    "ctaStrong": "Un ami a partagé son animal",
    "ctaSub": "Quel animal es-tu ? 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon animal est",
    "brand": "🦊 Quel animal es-tu ?",
    "defaultKicker": "Test de personnalité animal",
    "defaultTitle": "Quel animal es-tu ?",
    "defaultDesc": "8 situations du quotidien · 2 à 3 minutes"
  },
  "faq": [
    {
      "q": "Comment le test choisit-il mon animal ?",
      "a": "Chaque réponse donne des points à deux ou trois animaux, et celui qui en a le plus l’emporte. Les égalités sont départagées par une règle fixe : les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "Est-ce un test de personnalité scientifique ?",
      "a": "Non, c’est juste pour s’amuser. Les questions portent sur des habitudes et des humeurs du quotidien, pas sur un diagnostic psychologique : vois-le comme un miroir joueur."
    },
    {
      "q": "Que signifient « match idéal » et « rival » ?",
      "a": "Ton match idéal est l’animal qui équilibre naturellement le tien. Ton rival est celui avec qui tu t’entrechoques le plus, ce qui peut aussi faire des étincelles."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et jamais stockées. Nous comptons seulement, de façon anonyme, quel animal est sorti, pour afficher la fréquence de chaque résultat."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Quel animal es-tu ?",
    "description": "Politique de confidentialité de « Quel animal es-tu ? » : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Quel animal es-tu ? (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations nécessaires, comme décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service s’utilise sans inscription ni connexion. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quel animal est sorti afin d’afficher la fréquence de chaque résultat."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local du navigateur pour retenir ta langue, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions peuvent alors mal fonctionner."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon tes visites précédentes sur ce site et d’autres. Plus d’informations et réglages dans les <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Nous conservons uniquement des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ces totaux ne permettent pas de t’identifier."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique, contacte l’exploitant du site."
      ],
      [
        "6. Date d’effet",
        "Cette politique s’applique à partir du 6 octobre 2026."
      ]
    ],
    "back": "← Retour au test animal"
  },
  "questions": [
    {
      "q": "Ton week-end est annulé au dernier moment. Tu…",
      "choices": [
        "Envoies un message à tes amis les plus proches pour voir qui est dispo",
        "Te poses enfin avec un bouquin ou un documentaire",
        "Tentes un truc au hasard : un nouveau café, un parc, peu importe",
        "Organises un dîner en deux minutes et invites tout le monde. C’est toi qui reçois !"
      ]
    },
    {
      "q": "Un gros projet de groupe te tombe dessus. Tu…",
      "choices": [
        "Avances pas à pas, sans te presser",
        "Gardes une bonne ambiance et fais ta part à ton rythme",
        "Fixes un objectif clair et vises le meilleur résultat",
        "Vérifies d’abord que tout le monde peut s’exprimer à l’aise"
      ]
    },
    {
      "q": "Un ami t’appelle à minuit, bouleversé. Tu…",
      "choices": [
        "Le fais rire avec toutes tes blagues jusqu’à ce qu’il craque",
        "L’aides à y voir clair et à monter un plan pour s’en sortir",
        "Dis « j’arrive » et es là en 20 minutes",
        "Restes au téléphone, calme et rassurant, le temps qu’il faut"
      ]
    },
    {
      "q": "Tu arrives à une soirée où tu ne connais qu’une personne. Tu…",
      "choices": [
        "Restes près de ton ami, souriant, en attendant qu’on vienne te parler",
        "Entres comme chez toi et salues tout le monde",
        "Observes la salle, puis vas parler à quelqu’un qui a l’air intéressant",
        "Te trouves un coin confortable près des chips et n’en bouges plus"
      ]
    },
    {
      "q": "Choisis ton voyage de rêve.",
      "choices": [
        "Un hôtel-club cosy : grasse mat’, bonne cuisine, ne rien faire",
        "Un road trip avec tes meilleurs amis, des souvenirs à chaque étape",
        "Une campagne fleurie ou un chalet dans la forêt",
        "Une vieille ville tranquille, pleine de musées, de librairies et d’histoires"
      ]
    },
    {
      "q": "Un problème surgit sans prévenir. Tu…",
      "choices": [
        "Te concentres, trouves le chemin le plus court et règles ça",
        "En ris, improvises et en fais quelque chose d’amusant",
        "Respires un grand coup, grignotes un truc et laisses faire",
        "Passes devant et prends les commandes tout de suite"
      ]
    },
    {
      "q": "Tes amis te décriraient comme…",
      "choices": [
        "Le doux, celui qui sent toujours l’humeur des autres",
        "Le fonceur, celui qui a toujours un objectif",
        "Le loyal, celui qui est toujours là pour eux",
        "Le marrant, celui qui rend chaque plan meilleur"
      ]
    },
    {
      "q": "Ta soirée parfaite se termine par…",
      "choices": [
        "Tout le monde qui t’acclame après une nuit inoubliable",
        "Bonne bouffe, bonnes personnes et fous rires sans se presser",
        "Une grande discussion tard dans la nuit sous les étoiles",
        "Un coucher tôt, téléphone éteint et une très longue nuit"
      ]
    }
  ],
  "types": {
    "wolf": {
      "name": "le Loup fidèle",
      "word": "loup",
      "vibe": "D’une loyauté farouche : ta meute passe toujours en premier.",
      "desc": "Tu es l’ami qui répond présent. Quand quelqu’un entre dans ton cercle, tu le protèges, tu le soutiens et tu n’oublies jamais ce qu’il a fait pour toi. Tu peux sembler sérieux au début, mais avec les tiens tu es chaleureux, drôle et dévoué. Ta meute a bien de la chance.",
      "strengths": [
        "Une loyauté à toute épreuve",
        "Un cœur protecteur",
        "L’esprit d’équipe"
      ],
      "tips": [
        "Laisse les autres t’aider aussi : tu n’as pas à porter toute la meute.",
        "Dis « non » de temps en temps : être loyal ne veut pas dire tout accepter.",
        "Fais de la place aux nouveaux : ton cercle peut grandir sans perdre sa chaleur."
      ]
    },
    "owl": {
      "name": "la Chouette sage",
      "word": "chouette,hibou",
      "vibe": "Discrète et observatrice, toujours trois coups d’avance dans sa réflexion.",
      "desc": "Tu préfères regarder, écouter et comprendre avant de parler. On vient te voir pour un conseil réfléchi, et tu brilles dans les grandes discussions de fin de nuit. Tu adores apprendre et tu remarques les détails que personne d’autre ne voit. Parfois tu réfléchis trop, mais ta finesse est un vrai cadeau.",
      "strengths": [
        "Une intuition aiguë",
        "Une excellente écoute",
        "Un esprit curieux"
      ],
      "tips": [
        "Partage tes idées avant qu’elles soient parfaites : on a envie de les entendre.",
        "Quand ton esprit s’emballe, écris ou va marcher au lieu de tout ressasser.",
        "Programme un moment de pur jeu sans but : ton cerveau a droit à sa récré."
      ]
    },
    "otter": {
      "name": "la Loutre joueuse",
      "word": "loutre",
      "vibe": "Pure joie, grands sourires et un talent pour embellir toutes les journées.",
      "desc": "Tu transformes les moments ordinaires en jeux. Tu es curieuse, amicale et presque impossible à rendre triste. Tu te fais des amis partout et tu gardes l’ambiance légère même quand tout part de travers. Derrière les blagues, tu veux simplement que tout le monde s’amuse ensemble.",
      "strengths": [
        "Bonne humeur instantanée",
        "Amitiés faciles",
        "Une joie sans peur"
      ],
      "tips": [
        "Prends une minute de calme de temps en temps : toutes les émotions n’ont pas besoin d’une blague.",
        "Termine une petite chose avant de te lancer dans la prochaine aventure.",
        "Dis-le quand ça ne va vraiment pas : on sera ravis d’être là pour toi."
      ]
    },
    "lion": {
      "name": "le Lion audacieux",
      "word": "lion",
      "vibe": "Confiant, chaleureux et né pour mener la danse.",
      "desc": "Tu fais le premier pas quand les autres hésitent. Tu as de la présence, du courage et une vraie générosité, et on suit naturellement ton énergie. Tu aimes les grands moments et tu t’assures que les tiens soient fêtés. Au mieux de ta forme, tu diriges en élevant tous ceux qui t’entourent.",
      "strengths": [
        "Un leadership naturel",
        "Un courage généreux",
        "Une confiance contagieuse"
      ],
      "tips": [
        "Laisse parfois la lumière aux autres : les voix discrètes ont souvent les meilleures idées.",
        "Demande avant de prendre les rênes : l’aide marche mieux quand elle est invitée.",
        "Se reposer fait partie de la force. Même les rois font la sieste."
      ]
    },
    "panda": {
      "name": "le Panda zen",
      "word": "panda",
      "vibe": "Facile à vivre, gentil et le calme de toutes les tempêtes.",
      "desc": "Tu te laisses porter et tu aides tout le monde autour de toi à se détendre. Tu aimes la bonne cuisine, la bonne compagnie et les journées sans course. Tu fais rarement de vagues et on te fait difficilement perdre ton calme. On adore être avec toi, tellement c’est rassurant et confortable.",
      "strengths": [
        "Une présence apaisante",
        "Une gentillesse tranquille",
        "Le goût des petits plaisirs"
      ],
      "tips": [
        "Dis tout haut ce que tu veux : tu as aussi le droit d’avoir un favori.",
        "Choisis un petit objectif par semaine pour te dépasser un peu.",
        "Ne laisse pas « ça m’est égal » cacher ce que tu ressens vraiment."
      ]
    },
    "eagle": {
      "name": "l’Aigle ambitieux",
      "word": "aigle",
      "vibe": "Concentré, indépendant et toujours à viser plus haut.",
      "desc": "Tu vois la vue d’ensemble et tu fonces. Tu te fixes des objectifs, tu fais des plans et tu t’imposes un haut niveau d’exigence. Tu aimes ton indépendance et tu résous les problèmes vite. Ton ambition inspire, et tu espères secrètement quelqu’un qui puisse suivre ton rythme.",
      "strengths": [
        "Une concentration nette",
        "Un esprit indépendant",
        "Un rapide résolveur de problèmes"
      ],
      "tips": [
        "Fête les victoires en chemin, pas seulement au sommet.",
        "Délègue quelque chose cette semaine : la confiance mène plus loin que la vitesse.",
        "Prends des nouvelles des autres : avancer, c’est mieux à plusieurs."
      ]
    },
    "sloth": {
      "name": "le Paresseux cocooning",
      "word": "paresseux",
      "vibe": "Lent, régulier et expert pour profiter de la vie.",
      "desc": "Tu connais le secret que les autres oublient : il n’y a pas de prix pour celui qui se presse. Tu protèges ta tranquillité, tu aimes ton confort et tu avances d’un pas doux à la fois. Tu es patient, imperturbable et discrètement sage sur l’essentiel. Ton calme est un cadeau dans un monde pressé.",
      "strengths": [
        "Une patience profonde",
        "Un esprit paisible",
        "Maître du confort"
      ],
      "tips": [
        "Commence avant de te sentir prêt : les petits pas comptent aussi.",
        "Préviens tes amis de tes plans à l’avance, ils pourront s’adapter à ton rythme.",
        "Essaie une nouveauté par mois : cocooning et curiosité font bon ménage."
      ]
    },
    "deer": {
      "name": "le Cerf doux",
      "word": "cerf,biche",
      "vibe": "Tendre, gracieux et à l’écoute des émotions de chacun.",
      "desc": "Tu remarques les petites choses : un changement d’humeur, quelqu’un de seul dans un coin. Tu es doux, sensible et discrètement gentil, avec un goût pour les lieux beaux et paisibles. Tu sursautes peut-être face aux conflits, mais ton empathie fait de toi quelqu’un à qui l’on se confie.",
      "strengths": [
        "Une empathie profonde",
        "Une gentillesse gracieuse",
        "Le sens de la beauté"
      ],
      "tips": [
        "Tes émotions comptent autant que les leurs : parle tôt, même doucement.",
        "Recharge-toi avec la nature ou la musique après les journées chargées.",
        "Tu as le droit de dire « j’ai besoin d’un moment » sans t’expliquer."
      ]
    }
  }
};
