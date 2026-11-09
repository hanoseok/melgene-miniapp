/* Test introverti ou extraverti (fr) — même structure de clés que en.js. Voir l’en-tête de en.js.
 * questions[i].choices[j] suivent introvert-core.js QUESTIONS[i].c[j] (même ordre, même sens que en.js).
 * Spectre d’énergie sociale, jamais de codes de types en lettres. Pas de chiffres ni de % dans types.*. Pas de spoilers avant le résultat. Juste pour s’amuser.
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
    "title": "Test introverti ou extraverti – D’où vient ton énergie ?",
    "description": "Test introverti extraverti gratuit : 12 situations du quotidien, environ 2 minutes, sans inscription. Vois où tu te situes sur le spectre de l’énergie sociale, juste pour le fun.",
    "ogTitle": "Test introverti ou extraverti ⚡ D’où vient ton énergie ?",
    "ogDescription": "Douze situations rapides du quotidien. Découvre ton propre équilibre introverti/extraverti et ton personnage d’énergie sociale. Un quiz pour s’amuser, pas une évaluation clinique."
  },
  "siteName": "Test introverti ou extraverti",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "⚡ Un quiz d’énergie sociale",
    "h1Kicker": "Test introverti ou extraverti",
    "h1Html": "Soirée plaid ou grosse soirée ?<br>D’où vient ton <em>énergie</em> ?",
    "hook": "Certains se ressourcent sur le canapé, d’autres au milieu de la foule, et la plupart d’entre nous sont quelque part entre les deux. Réponds à douze situations du quotidien pour voir ta place sur le spectre introverti–extraverti, et découvre le personnage d’énergie sociale qui te ressemble.",
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
    "text": "Mesure de ta batterie sociale…",
    "sub": "On compte les soirées calmes et les soirées animées"
  },
  "result": {
    "title": "Mon type d’énergie sociale : {name}",
    "metaDesc": "Résultat du test introverti extraverti : {name}. {vibe} Découvre tes forces, des conseils, ton duo idéal et ton type opposé.",
    "eyebrow": "Ton type d’énergie sociale est…",
    "ieTitle": "Ton équilibre introverti / extraverti",
    "ieIntro": "Introverti",
    "ieExtro": "Extraverti",
    "ieNote": "Calculé uniquement à partir de tes douze réponses : se ressourcer seul, un cercle proche et réfléchir avant de parler comptent pour le côté introverti ; les choix opposés comptent pour le côté extraverti.",
    "pctFmt": "{n} %",
    "leanIntro": "Tes réponses penchent du côté introverti.",
    "leanExtro": "Tes réponses penchent du côté extraverti.",
    "leanAmbi": "Tu es pile dans la zone ambivertie : tu puises ton énergie des deux côtés.",
    "traitsLabel": "Tes forces",
    "tipsLabel": "Conseils pour toi",
    "perfectLabel": "Ta journée parfaite",
    "bestLabel": "Duo idéal",
    "rivalLabel": "Type opposé",
    "disclaimer": "Juste pour le fun ! Ce quiz est fait pour s’amuser, ce n’est ni une évaluation clinique ni un diagnostic. Il regarde quelques habitudes sociales du quotidien et ne peut rien diagnostiquer. L’introversion et l’extraversion forment un spectre, et la plupart des gens s’y déplacent selon les jours.",
    "sameShare": "{pct} % des gens ont obtenu ce résultat",
    "shareText": "Mon type d’énergie sociale : {name} {emoji} « {vibe} » Et toi, plutôt introverti ou extraverti ?",
    "ctaStrong": "Un ami a partagé son type d’énergie sociale",
    "ctaSub": "Introverti, extraverti ou entre les deux ? Réponse en 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon type d’énergie sociale",
    "brand": "⚡ Test introverti ou extraverti",
    "defaultKicker": "Un quiz d’énergie sociale",
    "defaultTitle": "Introverti ou extraverti ?",
    "defaultDesc": "12 situations · 2 minutes · ton propre équilibre"
  },
  "faq": [
    {
      "q": "Quelle est la différence entre un introverti et un extraverti ?",
      "a": "C’est surtout une question d’énergie. Les personnes du côté introverti ont tendance à se ressourcer dans le calme et le temps seul, tandis que celles du côté extraverti se sentent plutôt rechargées par la compagnie et l’action. Ce n’est pas la même chose qu’être timide ou à l’aise, et ça ne dit rien de ta gentillesse ni de tes capacités."
    },
    {
      "q": "C’est quoi, un ambiverti ?",
      "a": "Un ambiverti se situe vers le milieu du spectre et peut apprécier aussi bien les moments animés que les moments calmes, selon les jours. Beaucoup de gens se trouvent dans cette zone du milieu, c’est pourquoi ton résultat affiche ta propre barre d’équilibre et pas seulement une étiquette."
    },
    {
      "q": "Comment mon résultat est-il choisi ?",
      "a": "Chaque situation regarde l’une de trois habitudes : ta façon de te ressourcer, ta préférence pour un petit cercle ou un grand réseau, et le fait de réfléchir avant de parler ou de penser à voix haute. La combinaison des trois donne ton type, et les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "D’où vient le pourcentage introverti/extraverti ?",
      "a": "Il est calculé uniquement à partir de tes propres réponses. Chaque choix ajoute un peu au côté introverti ou au côté extraverti, et les réponses les plus marquées comptent un peu plus. Il n’est comparé avec personne."
    },
    {
      "q": "Est-ce une évaluation clinique ?",
      "a": "Non. Ce quiz est fait pour s’amuser, ce n’est ni une évaluation clinique ni un diagnostic. Tes réponses sont calculées dans ton navigateur et ne sont pas conservées ; on compte seulement, de façon anonyme, quel résultat est sorti."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test introverti ou extraverti",
    "description": "Politique de confidentialité du Test introverti ou extraverti : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test introverti ou extraverti (le « Service ») respecte ta vie privée et ne traite que le strict minimum d’informations, comme expliqué ci-dessous.",
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
        "Cette politique est en vigueur depuis le 10 novembre 2026."
      ]
    ],
    "back": "← Retour au Test introverti ou extraverti"
  },
  "questions": [
    {
      "q": "C’est vendredi soir, après une longue semaine chargée. Qu’est-ce qui te tente le plus ?",
      "choices": [
        "Téléphone en silencieux, un plaid et une série. Juste moi",
        "Un petit dîner avec un ou deux amis, puis retour à la maison",
        "J’écris au groupe WhatsApp : qui sort ce soir ? J’ai besoin de monde !",
        "Une soirée tranquille chez moi, peut-être un petit appel à un proche"
      ]
    },
    {
      "q": "Ton anniversaire approche. Comment as-tu envie de le fêter ?",
      "choices": [
        "Une grande fête. J’invite tout le monde, les amis d’amis sont les bienvenus",
        "Un dîner avec mes deux ou trois personnes les plus proches",
        "Une petite soirée avec une poignée de bons amis",
        "Un apéro détendu avec des gens venus de différents cercles de ma vie"
      ]
    },
    {
      "q": "En réunion ou en cours, quelqu’un demande : « Des idées ? » Tu…",
      "choices": [
        "J’attends un instant, puis je partage une fois mon idée claire",
        "Je me lance tout de suite et je réfléchis en parlant",
        "Je ne dis rien et j’envoie mon idée plus tard, bien rédigée",
        "Je lance une idée brute et je rebondis sur ce que disent les autres"
      ]
    },
    {
      "q": "Le lendemain d’une grosse fête ou d’un mariage, tu te sens…",
      "choices": [
        "Un peu dans le brouillard, mais partant pour un café avec un ami",
        "À plat. Il me faut une journée entière en solo pour récupérer",
        "Ça va, mais je garde une journée calme et tranquille",
        "Encore à fond. Qui veut qu’on se revoie ?"
      ]
    },
    {
      "q": "Tu es à une fête où tu ne connais que la personne qui organise. Tu…",
      "choices": [
        "Je trouve une personne intéressante et je discute avec elle presque toute la soirée",
        "Je me présente à tout le monde. À la fin, je connais la moitié de la salle",
        "Je rejoins une conversation de groupe et je rencontre quelques nouvelles têtes",
        "Je reste près de la personne que je connais, ou je donne un coup de main en cuisine"
      ]
    },
    {
      "q": "Dans l’ascenseur, il n’y a que toi et un voisin que tu connais à peine. Tu…",
      "choices": [
        "Je lance la conversation : la météo, l’immeuble, n’importe quoi",
        "Je dis bonjour et je glisse un petit commentaire",
        "Je souris, un signe de tête, puis je fixe les numéros d’étage",
        "J’espère en silence qu’aucun de nous n’aura à parler"
      ]
    },
    {
      "q": "Tu passes toute une journée libre chez toi, sans personne. Le soir, tu te sens…",
      "choices": [
        "Bien au calme, même si une petite discussion ferait plaisir",
        "Parfait. Batterie pleine, je recommencerais bien demain",
        "J’ai la bougeotte. Dès midi, j’écrivais à tout le monde",
        "Ça va, mais j’aurais préféré avoir quelqu’un avec moi"
      ]
    },
    {
      "q": "À quoi ressemblent tes groupes WhatsApp ?",
      "choices": [
        "Une ou deux conversations avec mes proches, et ça me suffit largement",
        "Plusieurs groupes, et je suis la plupart des discussions",
        "Quelques groupes, mais je parle surtout dans un seul",
        "Des tonnes : boulot, études, loisirs, vieux potes, ça vibre sans arrêt"
      ]
    },
    {
      "q": "Quand quelque chose te tracasse, comment tu y vois plus clair ?",
      "choices": [
        "J’en parle avec quelqu’un. Ça s’éclaircit au fil de la discussion",
        "J’y réfléchis d’abord, puis j’en parle peut-être",
        "J’appelle un ami tout de suite et je parle jusqu’à ce que tout s’éclaire",
        "J’écris ou je réfléchis au calme jusqu’à trouver la réponse"
      ]
    },
    {
      "q": "Un ami t’écrit à 18 h : « On sort ce soir ? » Tu…",
      "choices": [
        "Oui ! Je suis déjà en train de me préparer",
        "Peut-être, si c’est tranquille et pas trop tard",
        "Pourquoi pas, il me reste un peu d’énergie",
        "Pas ce soir. Ma batterie sociale est à zéro"
      ]
    },
    {
      "q": "C’est ta première semaine dans un nouveau club, un nouveau cours ou une nouvelle équipe. Tu…",
      "choices": [
        "Je discute avec quelques personnes différentes à chaque fois",
        "J’apprends les prénoms de tout le monde et je propose une sortie en groupe",
        "Je trouve une personne avec qui le courant passe et je reste avec elle",
        "Je fais connaissance tout doucement avec deux ou trois personnes"
      ]
    },
    {
      "q": "Tu dois caler un plan avec un ami. Tu préfères…",
      "choices": [
        "Écrire un message, pour réfléchir d’abord à ce que je vais dire",
        "Appeler. C’est plus rapide, et j’aime entendre sa voix",
        "Envoyer un message vocal",
        "Écrire, avec un petit appel seulement si besoin"
      ]
    }
  ],
  "types": {
    "recharger": {
      "name": "Rechargeur Paisible",
      "word": "rechargeur paisible, rechargeur",
      "vibe": "Du calme, du silence et quelques personnes que tu aimes. Tu rayonnes après un moment à toi.",
      "keywords": ["Calme", "Réfléchi", "Fidèle"],
      "desc": "Tu sais exactement ce qui remplit ta batterie : une soirée tranquille, ton espace à toi et du temps pour réfléchir. Tu gardes un petit cercle de personnes en qui tu as vraiment confiance, et avec elles tu es chaleureux, drôle et d’une loyauté sans faille. Dans une conversation, tu écoutes d’abord et tu parles quand tu as quelque chose qui vaut la peine d’être dit, et c’est pour ça que tes mots comptent. Les journées chargées ne te font pas peur, mais il te faut une soirée calme ensuite pour redevenir toi-même. Ce n’est pas une faiblesse. C’est simplement comme ça que fonctionne ton énergie.",
      "traits": ["Tu écoutes avec une vraie attention", "Tu réfléchis avant de parler", "Tu gardes tes amitiés pendant des années", "Tu te sens bien en ta propre compagnie"],
      "tips": ["Note tes moments calmes dans l’agenda comme n’importe quel rendez-vous", "Partage une idée à voix haute avant de la peaufiner"],
      "perfect": "Un après-midi pluvieux avec un bon livre, une boisson chaude et un long message de ton meilleur ami."
    },
    "teapot": {
      "name": "Pipelette Cosy",
      "word": "pipelette",
      "vibe": "Discret avec le monde, intarissable avec tes personnes préférées.",
      "keywords": ["Chaleureux", "Drôle", "Sincère"],
      "desc": "Les inconnus te trouvent peut-être discret, mais tes proches connaissent la vérité : dès que tu te sens à l’aise, les histoires ne s’arrêtent plus. Tu te ressources dans ton coin et tu préfères quelques amis proches à une grande foule, pourtant tu penses à voix haute et tu adores les longues conversations qui partent dans tous les sens. Tu es l’ami qui appelle pour raconter un petit détail et qui reste une heure au téléphone. Les gens se sentent détendus avec toi parce que tu es franc et facile à vivre. Pense juste à t’accorder ensuite le calme dont tu as besoin.",
      "traits": ["Tu mets tes proches à l’aise", "Tu racontes des histoires qui font rire", "Tu dis ce que tu penses vraiment", "Tu fais vivre les conversations"],
      "tips": ["Montre ton côté bavard un peu plus tôt aux nouvelles têtes", "Garde une soirée calme après de longues retrouvailles"],
      "perfect": "Une discussion tard le soir sur le canapé avec ta personne préférée et des grignotages sur la table."
    },
    "observer": {
      "name": "Observateur Discret",
      "word": "observateur",
      "vibe": "Tu connais plein de monde et tu remarques tout, en silence et avec bienveillance.",
      "keywords": ["Perspicace", "Facile à vivre", "Bienveillant"],
      "desc": "Tu passes facilement d’un groupe à l’autre, sans jamais avoir besoin d’être au centre de l’attention. Tu aimes être entouré, tant que tu peux prendre du recul, regarder et écouter. Du coup, tu remarques ce que les autres ne voient pas : qui se sent à l’écart, qui est fatigué, qui a besoin d’un mot gentil. Des amis venus d’horizons très différents ont tous l’impression de bien te connaître. Les grands événements t’amusent à petite dose, et ensuite il te faut du calme pour digérer tout ce que tu as vu et entendu.",
      "traits": ["Tu sens l’ambiance d’une pièce", "Tu t’entends avec toutes sortes de gens", "Tu remarques les petits détails", "Tu restes calme dans les endroits animés"],
      "tips": ["Partage ce que tu remarques, ton regard aide les autres", "Pars un peu plus tôt quand ta batterie faiblit"],
      "perfect": "Une soirée conviviale où tu peux flotter d’une conversation à l’autre, puis une balade tranquille pour rentrer."
    },
    "chameleon": {
      "name": "Caméléon Social",
      "word": "caméléon",
      "vibe": "Roi de la fête un soir, ermite heureux le lendemain. Tu t’adaptes à chaque pièce.",
      "keywords": ["Flexible", "Expressif", "Équilibré"],
      "desc": "Tu peux discuter avec n’importe qui, tu penses facilement à voix haute et tu suis un large cercle d’amis, mais ta batterie se recharge toujours mieux à la maison. Ce mélange fait de toi un ambiverti naturel : vif et bavard quand tu sors, puis heureux au calme quand tu as besoin de souffler. On s’étonne parfois quand tu déclines une invitation, mais tu connais tes limites. Tu changes de mode avec tellement d’aisance que tu trouves ta place presque partout. Ton talent, c’est l’équilibre, alors continue d’écouter ce que ton énergie te dit.",
      "traits": ["Tu trouves ta place dans presque tous les groupes", "Tu peux parler avec n’importe qui", "Tu sais quand tu as besoin d’une pause", "Tu apportes de l’énergie sans t’épuiser"],
      "tips": ["Dis non à une invitation sans culpabiliser", "Préviens tes proches quand tu es en mode calme"],
      "perfect": "Une super soirée entre amis, suivie d’une matinée lente et paresseuse rien que pour toi."
    },
    "host": {
      "name": "Hôte Chaleureux",
      "word": "hôte",
      "vibe": "Tu aimes la compagnie à petites doses chaleureuses : bons plats, amis proches, vraies discussions.",
      "keywords": ["Attentionné", "Stable", "Accueillant"],
      "desc": "Être avec les autres remplit ta batterie, mais tu préfères l’ambiance cosy au vacarme. Un dîner à la maison, un café régulier avec un ami ou un petit voyage entre proches, voilà ce qui te rend le plus heureux. Tu écoutes attentivement, tu réfléchis avant de parler et tu te souviens de ce qui compte pour les gens que tu aimes. Tes amis savent qu’ils peuvent toujours venir te voir, parce que tu crées un espace calme et accueillant. Les grandes foules peuvent te sembler un peu trop, mais une table pleine de visages familiers est ton endroit préféré au monde.",
      "traits": ["Tu fais en sorte que chacun se sente bienvenu", "Tu te souviens des petites choses", "Tu soudes les groupes d’amis", "Tu écoutes sans juger"],
      "tips": ["Laisse les autres recevoir de temps en temps pour te détendre aussi", "Essaie un nouveau groupe de temps à autre, tu pourrais adorer"],
      "perfect": "Un long dîner à la maison avec tes amis proches, bougies allumées et personne ne regarde l’heure."
    },
    "cheer": {
      "name": "Cheerleader de la Bande",
      "word": "cheerleader",
      "vibe": "Bruyant, fidèle et toujours là pour encourager les tiens. Tes amis sont ton énergie.",
      "keywords": ["Enthousiaste", "Loyal", "Encourageant"],
      "desc": "Tu tires ton énergie des autres, et tu la rends aussitôt à tes personnes préférées. Tu préfères une bande soudée à une immense foule, et avec elle tu es bruyant, drôle et d’un soutien sans limite. Tu penses à voix haute, tu réagis avec tout ton visage et tu envoies des vocaux plus longs que la plupart des podcasts. Quand un ami a une bonne nouvelle, tu es le premier à fêter ça. Quand il passe une sale journée, tu es le premier à débarquer. N’oublie pas que toi aussi, tu as le droit d’être encouragé.",
      "traits": ["Tu remontes le moral des autres", "Tu fêtes chaque victoire", "Tu fais vivre le groupe WhatsApp", "Tu mets de l’ambiance dans chaque plan"],
      "tips": ["Demande du soutien quand tu en as besoin, pas seulement en donner", "Laisse un peu de silence pour que les amis plus discrets puissent participer"],
      "perfect": "Un road trip avec tes amis les plus proches, la musique à fond et tout le monde qui chante."
    },
    "connector": {
      "name": "Connecteur Serein",
      "word": "connecteur",
      "vibe": "Tu connais tout le monde et tu rapproches les gens, avec un style calme et réfléchi.",
      "keywords": ["Fiable", "Diplomate", "Sociable"],
      "desc": "Les gens te donnent de l’énergie, et tu en connais beaucoup. Tu aimes rencontrer de nouvelles personnes et garder le contact avec plein de groupes, mais tu le fais avec calme et réflexion. Tu écoutes, tu réfléchis, puis tu dis la bonne chose, ce qui fait de toi un pro pour présenter des gens faits pour se rencontrer. Les autres te font confiance comme pont entre amis, collègues et familles. Tu as rarement besoin des projecteurs, car voir les gens se trouver te suffit. Pense juste à garder du temps pour tes amitiés les plus proches.",
      "traits": ["Tu présentes les gens qui doivent se rencontrer", "Tu restes calme dans les discussions de groupe", "Tu gardes le contact avec plein d’amis", "Tu choisis tes mots avec soin"],
      "tips": ["Prends du temps en tête-à-tête avec tes amis les plus proches", "Donne ton avis même quand le groupe n’est pas d’accord"],
      "perfect": "Un apéro détendu où tu présentes deux amis qui finissent par s’entendre à merveille."
    },
    "butterfly": {
      "name": "Papillon Social",
      "word": "papillon",
      "vibe": "Nouvelles têtes, grands projets et discussions sans fin. Les gens sont ta source d’énergie.",
      "keywords": ["Ouvert", "Énergique", "Spontané"],
      "desc": "Tu t’illumines dans la foule. Rencontrer du monde, faire des plans et discuter de tout te donne plus d’énergie que n’importe quelle sieste. Ton agenda est plein, ton téléphone vibre sans arrêt et tu réfléchis mieux en parlant. Tu fais en sorte que des inconnus se sentent comme de vieux amis en quelques minutes et tu mets de la vie dans chaque pièce. Les journées calmes peuvent te rendre impatient, mais elles t’aident aussi à te recharger autrement. Ta chaleur est un cadeau, alors partage-la aussi avec les personnes plus discrètes.",
      "traits": ["Tu te fais des amis partout", "Tu mets de l’énergie dans chaque événement", "Tu lances facilement la conversation", "Tu transformes les jours ordinaires en plans"],
      "tips": ["Prévois une soirée tranquille par semaine pour reposer ta voix", "Prends des nouvelles en tête-à-tête des amis qui n’aiment pas la foule"],
      "perfect": "Un festival, une grande fête ou une nouvelle ville pleine de gens que tu n’as pas encore rencontrés."
    }
  }
};
