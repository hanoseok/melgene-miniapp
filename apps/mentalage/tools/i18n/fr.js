/* Test d’âge mental (fr)
 * Same 8 age-bracket ids (kid teen fresh hustle steady seasoned mellow sage) and question/choice order as mentalage-core.js
 * (the "mind age" points live only there). questions[i].choices[j] must stay in the same order as QUESTIONS[i].points[j].
 * Keys ending in Html are inserted as raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = a distinctive word of the result name (comma-separated) — only used by the spoiler check.
 * result.age = plural forms for the number age (Intl.PluralRules: one/few/many/other), {n} = the number (or a range like 24–29).
 * Placeholders: {name} {emoji} {vibe} {age} {pct} {n} {min} {max} {range} — keep them as-is when translating.
 */
module.exports = {
  "fonts": {
    "css": "https://fonts.googleapis.com/css2?family=Pangolin&display=swap",
    "display": "'Pangolin'",
    "displayWeight": 400,
    "sans": "",
    "wordBreak": "normal",
    "hyphens": "manual"
  },
  "meta": {
    "title": "Test d’âge mental : quel âge a ton esprit ?",
    "description": "Fais le test d’âge mental : 12 petites questions du quotidien, 2 à 3 minutes, sans inscription. Découvre l’âge réel de ton esprit au chiffre près, avec tes forces et des conseils.",
    "ogTitle": "Test d’âge mental 🧠 Quel âge a ton esprit ?",
    "ogDescription": "Un quiz de 2 minutes. 12 questions du quotidien révèlent ton âge mental, au chiffre près."
  },
  "siteName": "Test d’âge mental",
  "privacyLink": "Confidentialité",
  "start": {
    "badge": "🧠 Petit quiz de l’esprit",
    "h1Kicker": "Test d’âge mental",
    "h1Html": "Quel âge a vraiment<br><em>ton esprit</em> ?",
    "hook": "Ta carte d’identité dit un chiffre. Tes petites habitudes en disent peut-être un autre. Réponds sincèrement et découvre ce qu’en pense ta tête.",
    "metaTime": "⏱️ 2 à 3 min",
    "metaCount": "✏️ 12 questions",
    "start": "Voir mon âge mental →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Q{n}"
  },
  "loading": {
    "text": "Lecture de tes gribouillis…",
    "sub": "On compte les bougies sur le gâteau de ton esprit"
  },
  "result": {
    "title": "Test d’âge mental : je suis {name}",
    "eyebrow": "Ton âge mental",
    "range": "{min}–{max}",
    "age": {
      "one": "{n} an",
      "few": "{n} ans",
      "many": "{n} ans",
      "other": "{n} ans"
    },
    "metaRange": "Âge mental : {range}.",
    "strengthsLabel": "Ce qui te fait briller",
    "tipsLabel": "Conseils pour ton âge mental",
    "bestLabel": "Meilleur pote",
    "rivalLabel": "Rival",
    "sameShare": "{pct} % des joueurs ont cette tranche d’âge",
    "shareText": "Mon âge mental : {age} {emoji} {name} — « {vibe} » Et toi, quel âge a ton esprit ?",
    "ctaStrong": "Un ami a partagé son âge mental",
    "ctaSub": "Quel âge a ton esprit ? 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon âge mental",
    "brand": "🧠 Test d’âge mental",
    "defaultKicker": "Test d’âge mental",
    "defaultTitle": "Quel âge a ton esprit ?",
    "defaultDesc": "12 questions du quotidien · 2 à 3 minutes"
  },
  "faq": [
    {
      "q": "Comment mon âge mental est-il calculé ?",
      "a": "Chaque réponse rapporte quelques points d’« âge de l’esprit ». Le total te place dans une tranche d’âge, et la position de tes réponses dans cette tranche donne le chiffre exact. Mêmes réponses, même résultat."
    },
    {
      "q": "C’est un vrai test psychologique ?",
      "a": "Non, c’est juste pour s’amuser. Il regarde tes habitudes et ton humeur, pas ton intelligence ni ta maturité. Prends-le comme un miroir rigolo, pas comme un diagnostic."
    },
    {
      "q": "Pourquoi mon résultat est si loin de mon vrai âge ?",
      "a": "C’est tout l’intérêt. Beaucoup de gens ont un esprit plus jeune ou plus mûr que leur âge. Le résultat peut aussi changer avec ton humeur, alors réessaie un autre jour."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et ne sont jamais stockées. On compte seulement, de façon anonyme, quelle tranche d’âge est sortie pour afficher la part de chaque résultat."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test d’âge mental",
    "description": "Politique de confidentialité du Test d’âge mental : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test d’âge mental (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations nécessaires, comme décrit ci-dessous.",
    "sections": [
      [
        "1. Informations collectées",
        "Le Service s’utilise sans inscription ni connexion. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quelle tranche d’âge est sortie pour afficher la part de chaque résultat."
      ],
      [
        "2. Cookies et technologies similaires",
        "Le Service peut utiliser des cookies et le stockage local du navigateur pour retenir ta langue, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions peuvent alors mal fonctionner."
      ],
      [
        "3. Publicité (Google AdSense)",
        "Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon tes visites précédentes sur ce site et d’autres. Pour en savoir plus et modifier la personnalisation des annonces : <a href=\"https://adssettings.google.com/\" target=\"_blank\" rel=\"noopener\">Paramètres des annonces Google</a>."
      ],
      [
        "4. Statistiques",
        "Nous conservons des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ces totaux ne permettent pas de t’identifier."
      ],
      [
        "5. Contact",
        "Pour toute question sur cette politique, contacte l’éditeur du site."
      ],
      [
        "6. Date d’entrée en vigueur",
        "Cette politique s’applique à partir du 8 octobre 2026."
      ]
    ],
    "back": "← Retour au test d’âge mental"
  },
  "questions": [
    {
      "q": "Un samedi sans réveil. Tu te lèves quand ?",
      "choices": [
        "6 h, et la journée est déjà planifiée",
        "Vers 9 h, frais et reposé",
        "Midi passé… le matin, c’est quoi ?",
        "Super tôt, tout excité parce que c’est le week-end !"
      ]
    },
    {
      "q": "Ton anniversaire idéal, c’est…",
      "choices": [
        "Ballons, chapeaux pointus et énorme gâteau !",
        "Une grosse soirée avec toute la bande",
        "Un dîner sympa avec quelques proches",
        "Une journée tranquille et un appel de la famille"
      ]
    },
    {
      "q": "Tu es dehors et ton téléphone tombe à 15 %.",
      "choices": [
        "Panique, je cherche une prise partout",
        "Aucun souci, j’ai toujours une batterie externe",
        "Tant pis s’il s’éteint, mode aventure !"
      ]
    },
    {
      "q": "Au supermarché, tu files d’abord vers…",
      "choices": [
        "Le rayon bonbons et gâteaux",
        "Les pizzas surgelées et les boissons énergisantes",
        "Les fruits et légumes et les promos de la semaine",
        "Ma liste de courses, dans l’ordre"
      ]
    },
    {
      "q": "Tout le monde parle d’un nouveau tube.",
      "choices": [
        "Je connais déjà la choré par cœur",
        "Ajouté à ma playlist dès le premier jour",
        "C’est pas la reprise d’une vieille chanson ?",
        "Je l’écouterai… un jour"
      ]
    },
    {
      "q": "Un jour de congé pluvieux. Programme ?",
      "choices": [
        "Bottes de pluie et sauts dans les flaques !",
        "Plaid, grignotage et une saison entière de série",
        "Une bonne soupe maison et un peu de rangement",
        "Thé, bon livre et sieste au bruit de la pluie"
      ]
    },
    {
      "q": "Tu reçois une prime surprise.",
      "choices": [
        "J’achète enfin le jeu ou la figurine dont je rêve",
        "Je réserve tout de suite un voyage entre potes",
        "Un bon resto, et le reste de côté",
        "Tout sur le livret A. Merci, moi du futur."
      ]
    },
    {
      "q": "Vendredi soir, rien de prévu.",
      "choices": [
        "Jeux vidéo ou appels jusqu’au lever du soleil",
        "J’écris à tout le monde jusqu’à trouver un plan",
        "Pyjama à 21 h, au lit à 22 h. Le bonheur."
      ]
    },
    {
      "q": "Tu sens un rhume arriver.",
      "choices": [
        "Je râle un peu en espérant qu’on me chouchoute",
        "J’ignore et je continue",
        "Tisane, vitamines et au lit tôt",
        "Un médicament et je continue tranquillement"
      ]
    },
    {
      "q": "Le groupe WhatsApp n’arrête pas de sonner.",
      "choices": [
        "Je réponds avec dix stickers d’affilée",
        "J’envoie LE mème parfait",
        "Je lis tout et je réponds plus tard en un long message",
        "Je coupe les notifs. Pourquoi tant de messages ?"
      ]
    },
    {
      "q": "En ce moment, ta chambre, c’est…",
      "choices": [
        "Peluches, figurines et couleurs partout",
        "Posters, câbles et joyeux bazar créatif",
        "Propre et minimaliste, chaque chose à sa place",
        "Des plantes, un fauteuil douillet et une lampe de lecture"
      ]
    },
    {
      "q": "Si tu ne pouvais choisir qu’une chose…",
      "choices": [
        "Redevenir un enfant insouciant pour une journée",
        "Passer direct à une retraite calme et paisible"
      ]
    }
  ],
  "types": {
    "kid": {
      "name": "Gamin de la cour de récré",
      "word": "gamin,récré",
      "vibe": "Curieux, joueur et carburant à la joie pure.",
      "desc": "Ton esprit vit encore à l’heure de la récré. Tu t’enthousiasmes vite, tu ris fort et tu trouves du fun dans presque tout. Les règles deviennent facultatives dès qu’il y a un jeu. Cette énergie franche et lumineuse est contagieuse, et elle rajeunit tout ton entourage.",
      "strengths": [
        "Curiosité sans fin",
        "Remonte-moral express",
        "Imagination sans peur"
      ],
      "tips": [
        "Garde l’émerveillement, mais mets un rappel pour les corvées d’adulte.",
        "Quand quelque chose te semble injuste, respire trois fois avant de réagir.",
        "Partage ton truc rigolo préféré avec un ami qui a besoin de sourire."
      ]
    },
    "teen": {
      "name": "Ado rebelle",
      "word": "ado,rebelle",
      "vibe": "Grandes émotions, avis tranchés et une playlist pour chaque humeur.",
      "desc": "Ton esprit vit en mode lycée : tout compte énormément, et tu ressens tout à fond. Tu questionnes les règles, tu repères les nouveautés avant tout le monde et tu as besoin de ton espace. Derrière l’attitude, il y a un cœur loyal prêt à tout pour ses vrais amis.",
      "strengths": [
        "Passion pour tout",
        "Loyauté à toute épreuve",
        "Radar à tendances"
      ],
      "tips": [
        "Chaque humeur ne mérite pas une réponse immédiate. Dors dessus.",
        "Note tes grandes idées, certaines sont vraiment bonnes.",
        "Laisse un adulte te surprendre. Lui aussi a été rebelle."
      ]
    },
    "fresh": {
      "name": "Esprit première année",
      "word": "première année",
      "vibe": "Libre, spontané et partant pour tout.",
      "desc": "Ton esprit est en première année de fac : un peu fauché, très libre et toujours dispo pour un plan de dernière minute. Tu collectionnes les expériences plutôt que les objets et tu te fais des amis partout. La vie est une grande aventure que tu apprends en marchant.",
      "strengths": [
        "Spontanéité",
        "Se fait des amis partout",
        "Courage face au nouveau"
      ],
      "tips": [
        "Dis oui aux aventures, mais garde une petite habitude d’épargne.",
        "Choisis un seul objectif ce mois-ci et va jusqu’au bout.",
        "Appelle tes parents de temps en temps, ils adorent tes histoires."
      ]
    },
    "hustle": {
      "name": "Vingtenaire ambitieux",
      "word": "vingtenaire,ambitieux",
      "vibe": "Ambitieux, débordé et carburant au café et aux grands projets.",
      "desc": "Ton esprit est en plein chantier. Tu jongles entre objectifs, projets perso et agenda plein, et tu trouves quand même le temps de t’amuser. Tu veux grandir sans devenir ennuyeux. Ton énergie inspire les autres, tant que tu penses à te reposer.",
      "strengths": [
        "Motivation inarrêtable",
        "Pro du multitâche",
        "Planificateur optimiste"
      ],
      "tips": [
        "Planifie ton repos comme tu planifies ton travail.",
        "Fête les petites victoires, pas seulement les grandes.",
        "Tu n’as pas besoin d’avoir déjà toutes les réponses."
      ]
    },
    "steady": {
      "name": "Trentenaire posé",
      "word": "trentenaire",
      "vibe": "Calme, fiable et tranquillement maître de la situation.",
      "desc": "Ton esprit a trouvé son rythme. Tu sais ce que tu aimes, ce que tu n’aimes pas et quand dire non. Tu anticipes, tu tiens parole et tu cuisines plutôt bien. On vient te voir quand on a besoin d’une main sûre, et tu déçois rarement.",
      "strengths": [
        "Fiabilité à toute épreuve",
        "Organisation intelligente",
        "Connaît ses limites"
      ],
      "tips": [
        "Laisse une place pour l’imprévu cette semaine.",
        "Essaie un truc où tu serais de nouveau débutant.",
        "Laisse-toi aider parfois. La confiance marche dans les deux sens."
      ]
    },
    "seasoned": {
      "name": "Quadra aguerri",
      "word": "quadra,aguerri",
      "vibe": "Expérimenté, pratique et difficile à déstabiliser.",
      "desc": "Ton esprit a vu quelques rebondissements et garde son sang-froid. Tu règles les problèmes vite, tu donnes des conseils francs et tu ne perds pas d’énergie dans les drames. Tu aimes le confort, la qualité et les gens qui tiennent parole. Avec toi, on se sent en sécurité.",
      "strengths": [
        "Sang-froid",
        "Conseils sincères",
        "Sagesse pratique"
      ],
      "tips": [
        "Raconte tes histoires, les plus jeunes en apprennent beaucoup.",
        "Garde un loisir juste pour le plaisir, pas pour le résultat.",
        "Étire-toi chaque matin. Ton dos te dira merci."
      ]
    },
    "mellow": {
      "name": "Quinqua zen",
      "word": "quinqua,zen",
      "vibe": "Cool, chaleureux et heureux de prendre son temps.",
      "desc": "Ton esprit apprécie la voie lente. Tu préfères un bon repas, une longue balade et une vraie discussion à une soirée bruyante. Les petites choses te rendent heureux, et le regard des autres ne t’inquiète plus. Ta chaleur tranquille rend chaque réunion plus douce.",
      "strengths": [
        "Présence apaisante",
        "Savoure les petits bonheurs",
        "Écoute généreuse"
      ],
      "tips": [
        "Dis oui à une nouvelle expérience cette saison.",
        "Transmets à quelqu’un un savoir-faire dont tu es fier.",
        "Envoie un petit message à un vieil ami."
      ]
    },
    "sage": {
      "name": "Vieille âme sage",
      "word": "vieille âme,sage",
      "vibe": "Profond, doux et plein d’une sagesse tranquille.",
      "desc": "Ton esprit semble avoir vécu plusieurs vies. Tu aimes le calme, les rituels, le thé et les bons livres. Tu remarques ce que les autres ratent et tes conseils restent en tête des années. Tu ne cours pas après les tendances, mais on vient chercher ton regard apaisé.",
      "strengths": [
        "Regard profond",
        "Patience douce",
        "Conseils qui durent"
      ],
      "tips": [
        "Fais une chose spontanée et un peu bête cette semaine. Juste comme ça.",
        "Tes petits rituels sont précieux : partage-les avec un ami.",
        "Joue à un jeu avec quelqu’un de bien plus jeune. Vous rirez tous les deux."
      ]
    }
  }
};
