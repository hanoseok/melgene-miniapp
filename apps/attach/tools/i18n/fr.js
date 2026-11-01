/* Test de style d’attachement (fr) — French, tutoiement
 * 4 result ids (secure anxious avoidant fearful);
 * questions[i].choices[j] follow attach-core.js QUESTIONS[i].w[j] (the [anxiety, avoidance] score of each choice).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the only number is the real server share ({pct}).
 * Kind, non-judgmental wording: every style is a way of coping that once made sense, and styles can change.
 * Just for fun and self-reflection — not a clinical or psychological diagnosis.
 * Typography: U+202F (narrow no-break space) before ? ! : ; » and after «.
 * Placeholders: {name} {nick} {emoji} {vibe} {pct}.
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
    "title": "Test de style d’attachement : quel est mon style ?",
    "description": "Test de style d’attachement : 11 questions du quotidien sur tes amis, ta famille et ton couple, 2 minutes, sans inscription. Découvre comment tu crées du lien.",
    "ogTitle": "Test de style d’attachement 🫂 Comment crées-tu du lien ?",
    "ogDescription": "Onze situations du quotidien avec tes amis, ta famille et ton couple. Découvre ton style d’attachement, tes atouts et des conseils bienveillants pour des liens plus proches."
  },
  "siteName": "Test de style d’attachement",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🫂 Ton lien aux autres",
    "h1Kicker": "Test de style d’attachement",
    "h1Html": "Comment tu aimes<br>et tu <em>t’attaches</em> ?",
    "hook": "Une réponse qui tarde, un plan annulé, un ami qui se confie tout à coup. Ta façon de réagir à ces petits moments en dit long sur la manière dont tu t’attaches aux autres. Réponds à onze questions du quotidien et découvre ton style d’attachement.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 11 questions",
    "start": "Découvrir mon style →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "On lit entre les lignes…",
    "sub": "On observe ta façon de créer du lien"
  },
  "result": {
    "title": "Mon style d’attachement : {name}",
    "metaDesc": "Résultat du test de style d’attachement : {name}, {nick}. {vibe} Découvre tes atouts et trois conseils bienveillants pour tes relations.",
    "eyebrow": "Ton style d’attachement",
    "gaugeLabel": "Où penchaient tes réponses",
    "axes": [
      [
        "Serein",
        "Souvent inquiet"
      ],
      [
        "Proche",
        "Besoin d’espace"
      ]
    ],
    "strengthsLabel": "Tes atouts",
    "tipsLabel": "Conseils pour tes relations",
    "matchLabel": "À l’aise avec",
    "disclaimer": "Pour le plaisir et pour mieux te connaître. Ce quiz léger n’est ni un bilan psychologique ni un diagnostic. Le style d’attachement peut évoluer avec le temps et selon les relations. Si tes relations te font souvent souffrir, en parler à un psy ou à un conseiller peut vraiment aider.",
    "sameShare": "{pct} % des gens ont obtenu ce style",
    "shareText": "Mon style d’attachement : {name} {emoji} « {vibe} » Et toi ?",
    "ctaStrong": "Un ami a partagé son style d’attachement",
    "ctaSub": "Et toi, comment crées-tu du lien ? Réponse en 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon style d’attachement",
    "brand": "🫂 Test de style d’attachement",
    "defaultKicker": "Un quiz relationnel tout en douceur",
    "defaultTitle": "Quel est mon style d’attachement ?",
    "defaultDesc": "11 questions · 2 minutes · ta façon de créer du lien"
  },
  "faq": [
    {
      "q": "Comment mon résultat est-il choisi ?",
      "a": "Chaque réponse fait bouger deux échelles que les chercheurs utilisent pour décrire l’attachement chez l’adulte : à quel point la proximité t’inquiète, et à quel point tu es à l’aise pour compter sur les autres. Ton résultat se trouve là où ces deux échelles se croisent, et les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "Est-ce un diagnostic psychologique ?",
      "a": "Non. C’est un quiz léger, pour le plaisir et pour mieux te connaître, pas une évaluation professionnelle ou scientifique. Le style d’attachement n’est ni un trouble ni une étiquette figée. Si tes relations te semblent souvent douloureuses ou confuses, un psy ou un conseiller peut t’aider à y voir plus clair."
    },
    {
      "q": "Mon style d’attachement peut-il changer ?",
      "a": "Oui. Beaucoup de gens fonctionnent différemment selon la personne en face, et des relations bienveillantes, la connaissance de soi ou une thérapie peuvent aider à se sentir plus en confiance et plus serein avec le temps. Refais le test dans quelques mois pour comparer."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et ne sont pas conservées. On compte seulement, de façon anonyme, quel résultat est sorti, pour pouvoir t’indiquer à quel point il est courant."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test de style d’attachement",
    "description": "Politique de confidentialité du Test de style d’attachement : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test de style d’attachement (le « Service ») respecte ta vie privée et ne traite que le strict minimum d’informations, comme expliqué ci-dessous.",
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
        "Cette politique est en vigueur depuis le 2 novembre 2026."
      ]
    ],
    "back": "← Retour au Test de style d’attachement"
  },
  "questions": [
    {
      "q": "Un ami proche n’a pas répondu à ton message de la journée. Qu’est-ce qui te passe par la tête ?",
      "choices": [
        "Il doit être débordé. Il me répondra plus tard.",
        "Je relis mon message en me demandant si j’ai dit un truc de travers.",
        "Franchement, je le remarque à peine. Les messages non-stop, ce n’est pas mon truc.",
        "Ça m’inquiète un peu, puis je me dis que je ne devrais pas y accorder autant d’importance."
      ]
    },
    {
      "q": "Une personne dont tu commences à te rapprocher te dit : « J’adore passer du temps avec toi. » Tu…",
      "choices": [
        "Es aux anges, puis te demandes si ce sera encore vrai le mois prochain",
        "Sens une douce chaleur et lui dis que c’est réciproque",
        "Es content, mais tu as bizarrement envie de reculer d’un petit pas",
        "Te sens un peu gêné et changes de sujet avec une blague"
      ]
    },
    {
      "q": "Tu traverses une semaine vraiment difficile. Que fais-tu en général ?",
      "choices": [
        "Je gère seul. Je n’aime pas m’appuyer sur les autres.",
        "J’aimerais en parler, mais je me tais pour ne pas déranger",
        "Je raconte à un proche ce qui se passe et je le laisse m’aider",
        "J’écris à plusieurs personnes en espérant que quelqu’un prenne de mes nouvelles"
      ]
    },
    {
      "q": "Un ami annule votre sortie à la dernière minute.",
      "choices": [
        "Je dis que ce n’est pas grave, mais je décide en silence de moins compter sur lui",
        "Au fond, un peu soulagé. Plus de temps pour moi !",
        "Je me demande s’il a vraiment envie de me voir",
        "Pas de souci. On choisit une autre date."
      ]
    },
    {
      "q": "Un nouvel ami commence à te confier des choses personnelles. Et toi ?",
      "choices": [
        "Je m’ouvre aussi, petit à petit, naturellement",
        "J’ai envie de m’ouvrir, mais je bloque à mi-chemin et je fais marche arrière",
        "Je me confie beaucoup, très vite. J’ai envie qu’on devienne proches rapidement.",
        "Je reste dans le léger. Ma vie privée reste privée."
      ]
    },
    {
      "q": "Toi et un proche n’êtes pas d’accord sur un sujet qui compte.",
      "choices": [
        "Je veux régler ça tout de suite. Attendre m’est insupportable.",
        "J’ai besoin d’air et je me fais discret jusqu’à ce que ça passe",
        "On en parle calmement, même si c’est un peu inconfortable",
        "J’oscille entre l’envie d’en parler et l’envie de disparaître"
      ]
    },
    {
      "q": "Un proche part une semaine. Combien de contacts te semblent idéaux ?",
      "choices": [
        "On se racontera tout à son retour. J’apprécie d’avoir de l’espace.",
        "Quelques messages, c’est sympa, mais aucun, ça me va aussi",
        "Difficile à dire. Il me manque, mais trop de messages me crispent.",
        "Un petit message chaque jour. J’aime sentir qu’on reste connectés."
      ]
    },
    {
      "q": "Quelqu’un a pour toi une attention gentille, sans prévenir.",
      "choices": [
        "Ça me touche, mais une partie de moi se demande ce qu’il attend en retour",
        "J’adore, et je sens que je devrais faire encore plus pour lui",
        "Je suis un peu mal à l’aise, comme si je lui devais quelque chose",
        "Je dis merci et j’en profite, tout simplement"
      ]
    },
    {
      "q": "Quand tu penses aux personnes les plus proches de toi, quelle phrase te ressemble le plus ?",
      "choices": [
        "J’ai confiance : ils seront là pour moi, et ils peuvent compter sur moi aussi",
        "Je les aime bien, mais je me sens mieux quand je ne compte que sur moi",
        "J’ai parfois peur de tenir plus à eux qu’eux à moi",
        "J’ai envie d’être proche, mais une partie de moi s’attend à souffrir"
      ]
    },
    {
      "q": "Une nouvelle personne rejoint ta bande et tout le monde semble l’adorer.",
      "choices": [
        "Ça m’est égal. J’ai mon petit cercle à moi.",
        "J’ai un peu peur d’être mis de côté",
        "Je reste sur mes gardes tant que je ne sais pas si je peux lui faire confiance",
        "Super, une personne de plus avec qui sortir"
      ]
    },
    {
      "q": "Quelqu’un te demande doucement : « Tout va bien pour toi en ce moment ? »",
      "choices": [
        "Je réponds « ça va », puis je regrette de ne pas en avoir dit plus",
        "Je dis honnêtement comment je vais",
        "Je dis que ça va et je change de sujet. Je vais régler ça seul.",
        "Je suis tellement soulagé qu’on l’ait remarqué que tout sort d’un coup"
      ]
    }
  ],
  "types": {
    "secure": {
      "name": "Sécure",
      "nick": "Le Port d’attache",
      "word": "attachement sécure",
      "vibe": "Tu sais être proche sans te perdre, et loin sans perdre confiance.",
      "desc": "Tu as tendance à croire que les personnes que tu aimes seront là, et tu es à l’aise pour être là pour elles aussi. La proximité ne te fait pas peur, un peu de distance non plus. Quand quelque chose coince, tu arrives en général à dire ce que tu ressens sans exploser ni te fermer. Les autres se sentent souvent plus calmes à tes côtés, comme si tu leur offrais un endroit sûr où se poser. Ça ne veut pas dire que tu ne t’inquiètes jamais : simplement, tu retrouves presque toujours ton équilibre.",
      "keywords": [
        "Confiant",
        "Ouvert",
        "Équilibré"
      ],
      "strengths": [
        "Dire ce dont tu as besoin, simplement et gentiment",
        "Laisser de l’espace aux autres sans te sentir rejeté",
        "Réparer après une dispute au lieu de compter les points"
      ],
      "tips": [
        "Pense à prendre de tes nouvelles aussi. Être le pilier ne veut pas dire tout porter seul.",
        "Quand un proche semble inquiet ou distant, rappelle-toi que c’est peut-être un vieux réflexe chez lui, pas un verdict sur toi.",
        "Partage ce qui t’aide à rester calme. Un simple « voilà ce qui m’aide » peut être un cadeau pour un ami qui galère."
      ],
      "match": "Deux cœurs stables construisent des relations simples et sincères. Ton calme aide aussi tous les autres styles à se sentir plus en confiance avec le temps."
    },
    "anxious": {
      "name": "Anxieux",
      "nick": "Le Cœur dévoué",
      "word": "attachement anxieux, attachement préoccupé",
      "vibe": "Tu aimes de tout ton cœur, et tu sens le moindre changement dans l’air.",
      "desc": "Tu tiens énormément aux gens et tu remarques tout : une réponse plus courte, un ton différent, un projet qui glisse. Être proche des autres compte beaucoup pour toi, alors quand un lien te semble incertain, ton esprit s’emballe pour combler les blancs. Cette sensibilité te rend chaleureux, attentif et fidèle. L’inquiétude n’est pas un défaut : elle montre à quel point les gens de ta vie comptent pour toi. Avec un peu de réassurance et d’entraînement, ce grand cœur peut se sentir à la fois proche et apaisé.",
      "keywords": [
        "Bienveillant",
        "Attentif",
        "Fidèle"
      ],
      "strengths": [
        "Sentir ce que les autres ressentent avant qu’ils ne le disent",
        "Montrer ton affection et ta gratitude sans compter",
        "Mettre une vraie énergie à faire vivre tes relations"
      ],
      "tips": [
        "Quand l’inquiétude monte, fais une pause avant d’envoyer ce message de plus. Demande-toi ce que tu sais, pas ce que tu crains.",
        "Dis aux gens ce qui te rassure, comme un petit « on se parle plus tard ». Un besoin clair est plus facile à combler qu’une devinette.",
        "Construis une vie qui te nourrit par elle-même : loisirs, amis, moments calmes. La sérénité repose sur plusieurs ancres, pas sur une seule."
      ],
      "match": "Un partenaire ou un ami stable et constant aide tes inquiétudes à se poser, et ta chaleur l’aide à s’ouvrir."
    },
    "avoidant": {
      "name": "Évitant",
      "nick": "L’Esprit libre",
      "word": "attachement évitant, attachement détaché",
      "vibe": "Tu tiens à ton indépendance, et tu montres ton affection de façon discrète et concrète.",
      "desc": "Tu es autonome et tu sais très bien te débrouiller seul. Tu apprécies les gens, mais tu as aussi besoin de beaucoup d’espace, et trop d’intensité émotionnelle peut te donner envie de prendre du recul. Ce n’est pas de la froideur : c’est souvent une habitude prise il y a longtemps, celle de compter d’abord sur toi-même. Ton calme sous pression et ton respect de la liberté des autres sont de vraies forces. Laisser les gens approcher petit à petit peut rendre tes relations plus légères, pas plus lourdes.",
      "keywords": [
        "Indépendant",
        "Calme",
        "Débrouillard"
      ],
      "strengths": [
        "Garder ton sang-froid quand la pression monte",
        "Respecter l’espace et les choix des autres",
        "Résoudre les problèmes de façon concrète et fiable"
      ],
      "tips": [
        "Quand tu as besoin d’espace, dis-le, et dis quand tu reviens. « J’ai besoin d’une soirée, on en parle demain » préserve la confiance.",
        "Essaie de partager un petit ressenti par semaine avec quelqu’un de confiance. La proximité peut grandir à tout petits pas.",
        "Remarque l’envie de t’éloigner justement quand tout va bien. C’est souvent en restant un instant de plus que le lien s’approfondit."
      ],
      "match": "Une personne posée et patiente respecte ton espace sans le prendre pour elle, et ça te donne envie de la laisser approcher."
    },
    "fearful": {
      "name": "Désorganisé",
      "nick": "Le Hérisson tendre",
      "word": "attachement désorganisé, attachement craintif",
      "vibe": "Tu rêves de proximité, et tu sais aussi à quel point elle peut faire mal.",
      "desc": "Une partie de toi veut un lien profond, une autre reste sur ses gardes, prête à te protéger. Alors tu t’approches, puis tu recules, parfois sans trop savoir pourquoi. Comme un hérisson dans le froid, tu cherches la chaleur mais tu crains les piquants. Ce mélange vient souvent d’expériences où la proximité n’était pas toujours rassurante. Tu n’es ni « trop » ni trop compliqué : tu es perspicace, sensible et profondément empathique, et avec de la confiance et du temps, tu peux te sentir à la fois proche et en paix.",
      "keywords": [
        "Sensible",
        "Empathique",
        "Perspicace"
      ],
      "strengths": [
        "Comprendre la peine des autres parce que tu l’as connue",
        "Lire les gens et les situations avec une vraie profondeur",
        "Chérir la confiance une fois qu’elle est vraiment là"
      ],
      "tips": [
        "Nomme ce va-et-vient quand tu le sens. Dire « une partie de moi veut se rapprocher et une autre a peur », c’est courageux et ça aide.",
        "Choisis des relations calmes et régulières, et laisse-leur le temps de faire leurs preuves.",
        "Sois doux avec toi-même. Si de vieilles blessures pèsent encore sur ton présent, un psy ou un conseiller peut être un vrai allié."
      ],
      "match": "Une personne stable et constante, qui reste bienveillante quand tu vacilles, peut te montrer peu à peu que la proximité peut être rassurante."
    }
  }
};
