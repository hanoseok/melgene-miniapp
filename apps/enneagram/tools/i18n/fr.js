/* Test ennéagramme (fr) — French, tutoiement
 * 9 result ids (type1 … type9); questions[i].choices[j] follow enneagram-core.js QUESTIONS[i].c[j]
 * (the center or stance value of each choice; the one "softer" choice per question scores 1 point instead of 2).
 * Keys ending in Html are raw HTML (only <br> and <em>); privacy.sections bodies are HTML too.
 * No spoilers: meta / og.default* / start / faq / loading never name a result or quote a question.
 * types.<id>.word = result keywords as people would search them (comma separated) — only used by the spoiler check.
 * Result texts never contain digits or %: the type number comes from result.typeNum, the only other number is the real server share ({pct}).
 * Kind, non-judgmental wording: every type has gifts and blind spots, nobody is only one type, and people grow.
 * Just for fun and self-reflection — not an official assessment (such as the RHETI) and not a diagnosis.
 * Typography: U+202F (narrow no-break space) before ? ! : ; » % and after «.
 * Placeholders: {n} {name} {emoji} {vibe} {pct}.
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
    "title": "Test ennéagramme : quel est mon type d’ennéagramme ?",
    "description": "Test ennéagramme gratuit : 12 questions du quotidien, environ 2 minutes, sans inscription. Découvre ton type, ta motivation profonde, tes forces et des pistes pour grandir.",
    "ogTitle": "Test ennéagramme 🔷 Quel est ton type ?",
    "ogDescription": "Douze questions du quotidien sur ta façon de réagir, de décider et de recharger tes batteries. Découvre ton type d’ennéagramme, ce qui te motive et comment tu grandis."
  },
  "siteName": "Test ennéagramme",
  "privacyLink": "Politique de confidentialité",
  "start": {
    "badge": "🔷 Neuf regards sur le monde",
    "h1Kicker": "Test ennéagramme",
    "h1Html": "Qu’est-ce qui te<br><em>pousse</em> vraiment ?",
    "hook": "Certains prennent les devants, d’autres apaisent les tensions, d’autres encore décortiquent tout en silence. L’ennéagramme décrit neuf façons de voir le monde et ce que chacun désire le plus. Réponds à douze questions du quotidien et découvre ton type.",
    "metaTime": "⏱️ 2 min",
    "metaCount": "✨ 12 questions",
    "start": "Trouver mon type →"
  },
  "quiz": {
    "backAria": "Question précédente",
    "progressAria": "Progression",
    "qLabel": "Question {n}"
  },
  "loading": {
    "text": "On relie les points…",
    "sub": "On cherche ta place sur le cercle"
  },
  "result": {
    "title": "Ennéagramme type {n} : {name}",
    "metaDesc": "Résultat du test ennéagramme : type {n}, {name}. {vibe} Découvre ta motivation profonde, tes forces et trois conseils pour grandir.",
    "eyebrow": "Ton type d’ennéagramme",
    "typeNum": "Type {n}",
    "desireLabel": "Au fond, tu veux",
    "fearLabel": "Ce que tu cherches à éviter",
    "gaugeLabel": "Où penchaient tes réponses",
    "centerLabel": "Ton énergie part du…",
    "centers": ["Ventre", "Cœur", "Tête"],
    "stanceLabel": "Pour obtenir ce dont tu as besoin, tu as tendance à…",
    "stances": ["Aller de l’avant", "Faire ce qui est juste", "Prendre du recul"],
    "strengthsLabel": "Tes forces",
    "tipsLabel": "Conseils pour grandir",
    "growthLabel": "Quand tu grandis, tu empruntes à",
    "disclaimer": "Pour le plaisir et pour mieux te connaître. Ce petit quiz n’est pas une évaluation officielle de l’ennéagramme comme le RHETI, ni un test psychologique ou un diagnostic. La plupart des gens se reconnaissent dans plusieurs types : vois ce résultat comme un point de départ, pas comme une étiquette.",
    "sameShare": "{pct} % des gens ont obtenu ce type",
    "shareText": "Je suis du type {n} de l’ennéagramme, {name} {emoji} « {vibe} » Et toi, quel est ton type ?",
    "ctaStrong": "Un ami a partagé son type d’ennéagramme",
    "ctaSub": "Qu’est-ce qui te motive ? Réponse en 2 minutes.",
    "retry": "Refaire le test"
  },
  "og": {
    "eyebrow": "Mon type d’ennéagramme",
    "brand": "🔷 Test ennéagramme",
    "defaultKicker": "Un petit quiz de personnalité",
    "defaultTitle": "Quel est mon type d’ennéagramme ?",
    "defaultDesc": "12 questions · 2 minutes · ce qui te motive"
  },
  "faq": [
    {
      "q": "Comment mon type est-il choisi ?",
      "a": "La moitié des questions regarde d’où part ton énergie en premier : ton corps et ton instinct, tes émotions ou ta réflexion. L’autre moitié regarde comment tu vas d’habitude chercher ce dont tu as besoin. Ton type se trouve là où ces deux réponses se rejoignent, et les mêmes réponses donnent toujours le même résultat."
    },
    {
      "q": "Est-ce le test officiel de l’ennéagramme ?",
      "a": "Non. C’est un quiz court, pour le plaisir et pour mieux te connaître, pas une évaluation officielle ou validée comme le RHETI, et pas un diagnostic psychologique. Si ton résultat ne te ressemble pas, lis aussi la description des types voisins. Beaucoup de gens ne trouvent leur type qu’après un temps de réflexion."
    },
    {
      "q": "Mon type peut-il changer ?",
      "a": "Selon l’ennéagramme, ton type de base reste assez stable, mais ta façon de l’exprimer varie beaucoup avec le stress, l’humeur et ton évolution personnelle. Tes réponses au quiz peuvent aussi bouger : refais le test dans quelques mois et regarde si le même type ressort."
    },
    {
      "q": "Mes réponses sont-elles enregistrées ?",
      "a": "Non. Tes réponses sont calculées dans ton navigateur et ne sont pas conservées. On compte seulement, de façon anonyme, quel type est sorti, pour pouvoir t’indiquer à quel point il est courant."
    }
  ],
  "privacy": {
    "title": "Politique de confidentialité | Test ennéagramme",
    "description": "Politique de confidentialité du Test ennéagramme : cookies, publicité et statistiques anonymes.",
    "h1": "Politique de confidentialité",
    "introHtml": "Le Test ennéagramme (le « Service ») respecte ta vie privée et ne traite que le strict minimum d’informations, comme expliqué ci-dessous.",
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
        "Cette politique est en vigueur depuis le 4 novembre 2026."
      ]
    ],
    "back": "← Retour au Test ennéagramme"
  },
  "questions": [
    {
      "q": "Tu arrives à une soirée où tu ne connais presque personne. Que fais-tu en premier ?",
      "choices": [
        "Je sens l’ambiance et je vais là où il y a de l’énergie",
        "Je repère qui a l’air sympa, et je soigne l’impression que je donne",
        "Je reste un peu en retrait pour comprendre comment ça se passe ici",
        "Je prends un verre et je me lance dans une conversation"
      ]
    },
    {
      "q": "Dans un projet de groupe, tout naturellement, tu…",
      "choices": [
        "Prends les choses en main et fais avancer le projet",
        "Prends ma part et la fais à ma façon, discrètement",
        "Veilles à ce que tout le monde suive et que rien ne soit oublié",
        "Lances l’idée la plus audacieuse et motives tout le monde"
      ]
    },
    {
      "q": "Face à une grande décision, à quoi te fies-tu le plus ?",
      "choices": [
        "À ce que je ressens, et à ce que ça change pour les gens que j’aime",
        "À mes recherches, une liste de pour et de contre et un plan B",
        "À une discussion avec un proche, jusqu’à ce que ça me semble juste",
        "À mon instinct. La plupart du temps, je sais, c’est tout."
      ]
    },
    {
      "q": "Quand tu veux vraiment quelque chose, en général tu…",
      "choices": [
        "Vérifies d’abord que ça convient aux gens autour de moi",
        "Fonces droit dessus",
        "En rêves longtemps avant de faire quoi que ce soit",
        "Travailles dur, fais les choses bien et comptes sur le fait que ça paiera"
      ]
    },
    {
      "q": "Un mauvais jour, qu’est-ce qui te déstabilise le plus ?",
      "choices": [
        "Ne pas savoir ce qui m’attend",
        "Qu’on me donne des ordres, ou qu’une chose me semble injuste",
        "Ne pas me sentir reconnu, ou être mis de côté",
        "Trop de choses en suspens et personne avec un plan clair"
      ]
    },
    {
      "q": "Après une longue semaine chargée, recharger tes batteries, c’est…",
      "choices": [
        "Du temps seul, téléphone éteint, dans ma bulle",
        "Un nouveau projet : un voyage, une sortie, quelque chose de grand",
        "Une journée tranquille à ne rien faire du tout",
        "Vider ma liste de tâches pour enfin me détendre pour de vrai"
      ]
    },
    {
      "q": "Tu es coincé dans une file d’attente qui n’avance pas. Tu…",
      "choices": [
        "Discutes avec ton voisin ou écris à un ami",
        "Le ressens dans ton corps : agité, la mâchoire serrée",
        "Calcules combien de temps ça va prendre et cherches une option plus rapide",
        "Vas jusqu’au début de la file pour voir ce qui se passe vraiment"
      ]
    },
    {
      "q": "Quelqu’un te contredit devant les autres. Tu…",
      "choices": [
        "Cherches un juste milieu qui convienne à tout le monde",
        "Réponds du tac au tac et défends ton point de vue",
        "Te tais et y repenses plus tard, seul de ton côté",
        "Prends plutôt plaisir à un bon débat, pour être honnête"
      ]
    },
    {
      "q": "Quel compliment ferait ta journée ?",
      "choices": [
        "« Tu sais toujours ce qui se passe vraiment. »",
        "« Tu as un cœur immense. »",
        "« Tu es tellement vrai. Tu tiens toujours bon. »",
        "« Il n’y a personne comme toi. »"
      ]
    },
    {
      "q": "Face à une règle qui n’a aucun sens pour toi, tu…",
      "choices": [
        "La contournes discrètement, sans faire d’histoires",
        "Râles en silence, mais détesterais décevoir quelqu’un",
        "La remets en question tout haut, ou l’ignores carrément",
        "La respectes quand même, jusqu’à ce qu’on la change dans les règles"
      ]
    },
    {
      "q": "Quand un ami a un problème, c’est toi qui…",
      "choices": [
        "Interviens et agis concrètement",
        "L’écoutes et l’aides à se sentir moins seul",
        "L’aides à réfléchir et à voir ses options",
        "Te renseignes et trouves qui pourrait l’aider"
      ]
    },
    {
      "q": "Un samedi libre, sans aucun programme. Le plus probable, c’est que tu…",
      "choices": [
        "Écrives à du monde pour organiser quelque chose",
        "Disparaisses pendant des heures dans un livre, un jeu ou une passion",
        "Rattrapes tes corvées ou aides quelqu’un qui en a besoin",
        "Laisses la journée filer et vois où elle te mène"
      ]
    }
  ],
  "types": {
    "type1": {
      "name": "Le Perfectionniste",
      "word": "perfectionniste",
      "vibe": "Tu vois comment les choses pourraient être meilleures, et tu t’y tiens sans bruit.",
      "desire": "Être bon, juste et bien faire les choses",
      "fear": "Avoir tort, être négligent ou laisser filer",
      "desc": "Tu portes en toi un sens clair du bien et du mal, et tu remarques presque partout ce qui pourrait être amélioré. Tu tiens tes promesses, tu assumes tes responsabilités, et les gens te font confiance parce que tu penses ce que tu dis. Ces exigences élevées peuvent pourtant se transformer en un critique intérieur bruyant, et tu peux t’agacer quand les autres ne semblent pas s’en soucier autant. Sous ton meilleur jour, tu es intègre, patient et sage, et tu sais que « assez bien » est parfois exactement ce qu’il faut.",
      "keywords": ["Intègre", "Fiable", "Rigoureux"],
      "strengths": ["Bien faire les choses, même quand personne ne vérifie", "Défendre ce qui est juste", "Transformer le chaos en plans clairs et réalistes"],
      "tips": ["Repère ton critique intérieur et réponds-lui comme le ferait un ami bienveillant.", "Choisis chaque semaine une chose à laisser inachevée exprès, et constate que le monde ne s’écroule pas.", "Fais de la place au jeu. Le repos et le plaisir font partie d’une vie bien menée, ce n’est pas une récompense pour avoir tout fini."],
      "growth": "En grandissant, tu te détends et tu trouves plus de joie, de spontanéité et de légèreté."
    },
    "type2": {
      "name": "L’Altruiste",
      "word": "altruiste",
      "vibe": "Tu sens ce dont les gens ont besoin avant qu’ils le disent, et tu adores embellir leur journée.",
      "desire": "Être aimé et te sentir vraiment utile",
      "fear": "Être rejeté ou mal aimé",
      "desc": "Tu es chaleureux, généreux et attentif aux autres. Tu te souviens des anniversaires, tu es là quand ça compte, et tes amis se sentent souvent vus et choyés à tes côtés. Les relations sont au cœur de ta vie. Comme tu es très tourné vers les autres, tu peux oublier tes propres besoins, avoir du mal à dire non ou te sentir blessé quand ton attention passe inaperçue. Sous ton meilleur jour, tu donnes librement, sans compter, et tu laisses aussi les autres prendre soin de toi.",
      "keywords": ["Chaleureux", "Généreux", "Attentionné"],
      "strengths": ["Faire en sorte que chacun se sente bienvenu et apprécié", "Repérer ce dont quelqu’un a besoin, tout de suite", "Construire des amitiés proches et fidèles"],
      "tips": ["Avant de dire oui, demande-toi ce dont toi, tu as besoin aujourd’hui.", "Laisse les gens t’aider, même pour de petites choses. Recevoir fait partie d’une relation proche.", "Exprime tes besoins à voix haute au lieu d’espérer qu’on les devine."],
      "growth": "En grandissant, tu tournes une part de cette attention vers toi et tu deviens plus honnête sur tes propres émotions et besoins."
    },
    "type3": {
      "name": "Le Battant",
      "word": "battant",
      "vibe": "Tu te fixes un objectif, trouves le chemin le plus rapide et embarques tout le monde avec toi.",
      "desire": "Te sentir précieux et réussir",
      "fear": "Ne rien valoir ou échouer",
      "desc": "Tu es ambitieux, adaptable et plein d’énergie. Tu sais te fixer des objectifs, sentir une ambiance et obtenir des résultats, et ton assurance comme ton élan inspirent souvent les autres. Tu aimes progresser, t’améliorer et exceller dans ce que tu fais. Parfois, pourtant, il est tentant de ne te mesurer qu’à tes réussites et de continuer à courir même quand tu es fatigué. Sous ton meilleur jour, tu es authentique autant que brillant, et tu sais que tu as de la valeur même les jours où tu avances au ralenti.",
      "keywords": ["Ambitieux", "Adaptable", "Inspirant"],
      "strengths": ["Transformer des idées en résultats concrets", "Motiver une équipe et garder le rythme", "Apprendre vite et s’adapter à tout contexte"],
      "tips": ["Demande-toi ce que tu veux vraiment, pas seulement ce qui fera bonne impression.", "Prévois de vrais temps de pause et prends-les aussi au sérieux qu’une échéance.", "Confie un échec ou un doute à quelqu’un de confiance. Être vrai rapproche les gens de toi."],
      "growth": "En grandissant, tu t’engages davantage envers des personnes et des causes plus grandes que ta propre réussite."
    },
    "type4": {
      "name": "Le Romantique",
      "word": "romantique",
      "vibe": "Tu ressens les choses profondément et tu veux une vie qui ait un sens bien à toi.",
      "desire": "Être toi-même et trouver ton propre sens",
      "fear": "N’avoir aucune identité ou être ordinaire",
      "desc": "Tu es sensible, créatif et honnête face aux émotions que beaucoup évitent. Tu remarques la beauté et le sens dans les petites choses, et tu préfères être authentique plutôt que rentrer dans le moule. Tes amis viennent vers toi quand la vie devient dure, parce que les vrais sentiments ne te font pas peur. Il t’arrive de sentir qu’il te manque quelque chose ou que c’est plus facile pour les autres, et tes humeurs peuvent t’emporter. Sous ton meilleur jour, tu transformes tes émotions profondes en créativité et en compassion, et tu savoures ce qui est déjà beau dans ta vie.",
      "keywords": ["Créatif", "Authentique", "Profond"],
      "strengths": ["Exprimer tes émotions par les mots, l’art ou le style", "Rester aux côtés des autres dans les émotions difficiles", "Voir la beauté et le sens que d’autres ne voient pas"],
      "tips": ["Quand une humeur te submerge, nomme-la, puis fais quand même une petite chose concrète.", "Tiens une liste de ce qui est déjà bien dans ta vie et complète-la souvent.", "Crée régulièrement, même si personne ne voit le résultat. Des habitudes stables offrent un foyer à tes émotions."],
      "growth": "En grandissant, tu ajoutes de la structure et de la discipline, et tu transformes tes émotions en un travail régulier dont tu es fier."
    },
    "type5": {
      "name": "L’Observateur",
      "word": "observateur",
      "vibe": "Tu veux comprendre comment tout fonctionne, idéalement depuis un coin tranquille.",
      "desire": "Comprendre le monde et être compétent",
      "fear": "Être impuissant, débordé ou perdu",
      "desc": "Tu es curieux, attentif et indépendant. Tu adores creuser un sujet jusqu’à vraiment le comprendre, et tu remarques souvent des détails et des liens qui échappent aux autres. Tu tiens à ton temps, à ton énergie et à ton intimité, et tu as besoin d’espace pour réfléchir avant d’agir ou de partager. Il t’arrive de rester un peu trop dans ta tête, ou de te replier quand on te demande plus que ce que tu te sens prêt à donner. Sous ton meilleur jour, tu partages généreusement ton savoir et tu avances dans le monde avec assurance.",
      "keywords": ["Curieux", "Perspicace", "Indépendant"],
      "strengths": ["Garder les idées claires quand les autres paniquent", "Apprendre en profondeur et expliquer des idées complexes", "Rester objectif et calme"],
      "tips": ["Partage ce que tu sais avant que ce soit parfait. Tes idées à moitié prêtes sont souvent déjà utiles.", "Essaie des choses avec tes mains et ton corps, pas seulement avec ta tête.", "Dis aux gens quand tu as besoin d’être seul, pour qu’ils ne prennent pas ton silence pour de la distance."],
      "growth": "En grandissant, tu passes de la contemplation à l’action et tu agis avec plus d’assurance et de présence."
    },
    "type6": {
      "name": "Le Loyal",
      "word": "loyal",
      "vibe": "Tu es l’ami qui anticipe, qui a un plan et qui reste là quand ça compte.",
      "desire": "Te sentir en sécurité, soutenu et sûr des gens qui t’entourent",
      "fear": "Te retrouver sans soutien ni repères",
      "desc": "Tu es fidèle, responsable et rapide pour repérer ce qui pourrait mal tourner, ce qui fait de toi un excellent organisateur et un ami de confiance. Tu prends tes engagements au sérieux et tu tiens énormément à tes proches et à tes communautés. Comme tu envisages chaque scénario, ton esprit peut s’emplir de doutes, et il te faut parfois du temps pour faire confiance aux autres, ou à toi-même. Sous ton meilleur jour, tu es courageux et solide, et tu te fies à ton propre jugement autant qu’aux gens que tu aimes.",
      "keywords": ["Fidèle", "Responsable", "Prévoyant"],
      "strengths": ["Repérer les problèmes tôt et s’y préparer", "Soutenir tes amis contre vents et marées", "Rassembler les gens autour d’un but commun"],
      "tips": ["Quand l’inquiétude s’emballe, note ce qui se passe vraiment maintenant, pas ce qui pourrait arriver.", "Prends chaque jour une petite décision sans demander l’avis de personne, et constate que tout se passe bien.", "Souviens-toi de ton parcours. Tu as déjà surmonté des choses difficiles."],
      "growth": "En grandissant, tu te détends, tu fais un peu plus confiance à la vie et tu trouves un centre calme et stable."
    },
    "type7": {
      "name": "L’Épicurien",
      "word": "épicurien",
      "vibe": "La vie est une aventure, et tu veux goûter à tous les plats du menu.",
      "desire": "Être heureux, libre et vivre plein de belles expériences",
      "fear": "Être prisonnier de la douleur, de l’ennui ou des limites",
      "desc": "Tu es enjoué, curieux et plein d’idées. Tu trouves le côté amusant de presque tout, tu rebondis vite, et ton énergie entraîne tout le monde autour de toi. Les nouveaux lieux, les projets et les possibilités t’enthousiasment. Comme il y a toujours quelque chose d’excitant juste après, tu peux avoir du mal à rester longtemps sur une seule chose, ou avec des émotions difficiles. Sous ton meilleur jour, tu allies ta joie à la concentration et à la profondeur, et tu découvres qu’être pleinement présent peut être encore meilleur que le prochain projet.",
      "keywords": ["Enjoué", "Curieux", "Spontané"],
      "strengths": ["Apporter énergie et bonne humeur à n’importe quel groupe", "Trouver vite des solutions créatives", "Rebondir après un coup dur"],
      "tips": ["Termine un projet avant d’en commencer un autre, et savoure ce sentiment d’accomplissement.", "Quand quelque chose fait mal, laisse-toi le ressentir un moment avant de chercher une distraction.", "Offre-toi de temps en temps une heure lente et calme. Le calme peut être une aventure à part entière."],
      "growth": "En grandissant, tu ralentis, tu te concentres en profondeur et tu savoures les moments calmes et réfléchis."
    },
    "type8": {
      "name": "Le Chef",
      "word": "chef",
      "vibe": "Tu dis les choses franchement, tu protèges les tiens et tu ne recules jamais devant un défi.",
      "desire": "Être fort, maître de ta vie et protéger les autres",
      "fear": "Être contrôlé, blessé ou impuissant",
      "desc": "Tu es sûr de toi, direct et plein d’énergie. Tu prends les choses en main quand la situation se complique, tu défends ceux qui ne peuvent pas se défendre eux-mêmes, et les autres se sentent en sécurité quand tu es de leur côté. Tu tiens à l’honnêteté et tu respectes la force. Parfois, ton intensité peut sembler trop forte, et tu caches peut-être tes émotions plus tendres pour ne jamais paraître vulnérable. Sous ton meilleur jour, tu utilises ta force pour élever les autres, et tu laisses ceux en qui tu as confiance voir ton grand cœur chaleureux.",
      "keywords": ["Audacieux", "Protecteur", "Direct"],
      "strengths": ["Décider et prendre les choses en main en pleine crise", "Protéger ceux qui sont traités injustement", "Parler franchement quand les autres se retiennent"],
      "tips": ["Avant de foncer, pose une question de plus et écoute vraiment la réponse.", "Montre ton côté plus tendre à quelqu’un de confiance. C’est une force, pas une faiblesse.", "Remarque quand tu tournes à plein régime, et choisis les combats qui comptent vraiment."],
      "growth": "En grandissant, tu ouvres ton cœur et tu utilises ta force pour prendre soin des autres avec douceur."
    },
    "type9": {
      "name": "Le Médiateur",
      "word": "médiateur",
      "vibe": "Tu apportes le calme partout où tu vas et tu vois chaque côté de l’histoire.",
      "desire": "Trouver la paix intérieure et l’harmonie avec les autres",
      "fear": "Le conflit, la perte du lien ou l’isolement",
      "desc": "Tu es facile à vivre, patient et ouvert. Tu sais voir plusieurs points de vue, tu apaises les situations tendues, et les gens se sentent détendus et acceptés auprès de toi. Tu es souvent le ciment qui fait tenir un groupe. Comme tu veux que tout reste paisible, tu peux suivre les autres, repousser tes propres priorités ou éviter de dire ce que tu penses vraiment. Sous ton meilleur jour, tu es stable et présent, et tu sais que ta voix et tes envies comptent autant que celles de n’importe qui.",
      "keywords": ["Calme", "Bienveillant", "Soutenant"],
      "strengths": ["Apaiser les conflits et aider les gens à se comprendre", "Écouter sans juger", "Créer une ambiance détendue et accueillante"],
      "tips": ["Demande-toi ce que tu veux avant de demander ce que veulent les autres.", "Choisis chaque matin une tâche importante et fais-la en premier.", "Donne ton avis sincère, avec gentillesse. Un peu de friction peut renforcer les relations."],
      "growth": "En grandissant, tu t’éveilles à tes propres objectifs et tu passes à l’action avec énergie et concentration."
    }
  }
};
