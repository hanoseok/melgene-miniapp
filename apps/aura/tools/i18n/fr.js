/* Test couleur d’aura — Français (fr/)
 * Mêmes 8 id d’aura et même ordre des questions/choix que aura-core.js (les poids ne sont que là-bas).
 * Clés en Html : HTML brut (<br> et <em> seulement). Le corps de privacy.sections est aussi en HTML.
 * Pas de spoiler : meta / og.default* / start / faq ne nomment aucune couleur d’aura et ne citent aucune question.
 * types.<id>.word = mots de couleur de base (séparés par des virgules) — pour le contrôle anti-spoiler.
 * Espaces fines insécables (U+202F) avant ? ! : ; et à l’intérieur des « ».
 * Variables : {name} {emoji} {vibe} {pct} {n}
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&display=swap',
    display: "'Comfortaa'",
    displayWeight: 700,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Test couleur d’aura – De quelle couleur est ton aura ?',
    description: 'De quelle couleur est ton aura ? Fais ce test couleur d’aura gratuit : 12 questions du quotidien, environ 2 minutes, sans inscription. Découvre la lumière que dégage ton énergie.',
    ogTitle: 'Test couleur d’aura ✨ De quelle couleur est ton aura ?',
    ogDescription: 'Un test d’aura gratuit de 2 minutes. Réponds à 12 questions du quotidien et découvre la couleur de ton énergie.',
  },
  siteName: 'Test couleur d’aura',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '✨ Lecture d’aura',
    h1Kicker: 'Test couleur d’aura',
    h1Html: 'De quelle couleur<br>est ton <em>aura</em> ?',
    hook: 'Chacun rayonne à sa façon. Douze petits moments de la vie de tous les jours vont révéler ta lumière.',
    metaTime: '⏱️ Environ 2 minutes',
    metaCount: '🔮 12 questions',
    start: 'Lire mon aura →',
  },

  quiz: {
    backAria: 'Question précédente',
    progressAria: 'Progression',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Lecture de ton aura…',
    sub: 'On laisse les couleurs se poser',
  },

  result: {
    title: 'Test couleur d’aura : mon aura est {name}',
    eyebrow: 'La couleur de ton aura',
    strengthsLabel: 'Tes super-pouvoirs lumineux',
    othersLabel: 'Comment les autres te voient',
    bestLabel: 'Aura complice',
    clashLabel: 'Aura rivale',
    sameShare: '{pct} % des joueurs ont la même aura',
    shareText: 'Mon aura est {name} {emoji} — « {vibe} » Et la tienne, elle est de quelle couleur ?',
    ctaStrong: 'Un·e ami·e t’a envoyé son aura',
    ctaSub: 'Et toi, quelle couleur ? 2 minutes suffisent.',
    retry: 'Refaire le test',
  },

  og: {
    eyebrow: 'La couleur de mon aura',
    brand: '✨ Test couleur d’aura',
    defaultKicker: 'Test couleur d’aura',
    defaultTitle: 'De quelle couleur est ton aura ?',
    defaultDesc: '12 questions du quotidien · environ 2 minutes',
  },

  faq: [
    { q: 'Comment fonctionne le test couleur d’aura ?', a: 'Chaque réponse ajoute des points à quelques couleurs d’aura, et celle qui en a le plus devient ton résultat. En cas d’égalité, une règle fixe tranche : les mêmes réponses donnent donc toujours la même aura.' },
    { q: 'C’est quoi, une aura ?', a: 'Dans la spiritualité populaire, l’aura est un halo d’énergie autour de chaque personne, et chaque couleur est associée à une humeur et à une personnalité. Ce test reprend l’idée de façon ludique : pour s’amuser et réfléchir à soi, pas pour faire de la science.' },
    { q: 'La couleur de mon aura peut-elle changer ?', a: 'Oui. Ton résultat dépend uniquement de tes réponses du jour : une autre humeur ou une nouvelle étape de vie peut faire ressortir une autre couleur. Refais le test quand tu veux.' },
    { q: 'Mes réponses sont-elles enregistrées ?', a: 'Non. Tes réponses sont calculées dans ton navigateur et jamais conservées. Nous comptons seulement, de façon anonyme, quelle aura est sortie, pour afficher la fréquence de chaque résultat.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Test couleur d’aura',
    description: 'Politique de confidentialité du Test couleur d’aura : cookies, publicité et statistiques anonymes.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le Test couleur d’aura (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations nécessaire, comme décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service s’utilise sans inscription ni connexion. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quelle couleur d’aura est sortie, pour afficher la fréquence de chaque résultat.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de mal fonctionner.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon tes visites précédentes sur ce site et d’autres. Plus d’informations et réglages dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Nous conservons des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ils ne permettent pas de t’identifier.'],
      ['5. Contact', 'Pour toute question sur cette politique, contacte l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique est en vigueur depuis le 30 septembre 2026.'],
    ],
    back: '← Retour au test d’aura',
  },

  questions: [
    { q: 'Un samedi matin tranquille, rien de prévu. Tu commences comment ?', choices: [
      'Un footing au lever du soleil. Il faut que je bouge.',
      'Je texte les potes : « Escapade ? On part dans une heure. »',
      'J’arrose mes plantes, puis balade au marché',
      'Un café, un carnet et un silence total',
    ] },
    { q: 'Un·e ami·e t’écrit : « Dis… on peut parler ? » Tu…', choices: [
      'Appelles tout de suite. Quoi qu’il arrive, je suis là.',
      'Écoutes d’abord, puis aides à y voir clair',
      'Débarques avec des snacks et un plan pour le faire rire',
      'Envoies un long message sincère et une chanson qui colle',
    ] },
    { q: 'Tu arrives à une soirée où tu ne connais presque personne.', choices: [
      'Dix minutes plus tard, je discute avec la moitié de la salle',
      'C’est moi qui fais rire tout le monde',
      'Je trouve une personne et on parle des heures dans un coin',
      'Je lance un jeu et j’embarque tout le monde',
    ] },
    { q: 'Tu peux vivre où tu veux pendant un an. Tu choisis…', choices: [
      'Une petite maison à l’orée d’une forêt',
      'Un village tranquille au bord de la mer',
      'Un atelier sous les toits rempli de matériel d’art',
      'Le cœur d’une grande ville qui bouillonne',
    ] },
    { q: 'L’exposé de groupe est pour demain et rien n’est fait.', choices: [
      'Je prends les choses en main et je répartis les tâches',
      'Je fais un plan étape par étape pour que personne ne panique',
      'Tard dans la nuit, j’ai l’idée qui sauve tout',
      'Je repère qui stresse et je vérifie que tout le monde va bien',
    ] },
    { q: 'Tu peux avoir un seul super-pouvoir. Lequel ?', choices: [
      'Lire dans les pensées',
      'Me téléporter n’importe où, n’importe quand',
      'Guérir toutes les blessures et tous les chagrins',
      'Faire sourire n’importe qui en un instant',
    ] },
    { q: 'Qu’est-ce qui remplit le plus la galerie photo de ton téléphone ?', choices: [
      'Des selfies et des photos de groupe avec ceux que j’aime',
      'Des ciels, des fleurs, des arbres : la nature partout',
      'Des angles bizarres, des lumières d’ambiance, des petites œuvres d’art',
      'Les endroits où je suis allé·e et mes aventures',
    ] },
    { q: 'Le stress s’accumule. Qu’est-ce qui t’aide ?', choices: [
      'Ranger et écrire une to-do list bien claire',
      'Une grosse séance de sport jusqu’à avoir la tête vide',
      'Du temps seul·e pour tout réfléchir',
      'Des vidéos drôles et des snacks. Je m’inquiéterai plus tard.',
    ] },
    { q: 'Que pensent les gens quand ils te rencontrent pour la première fois ?', choices: [
      '« Sûr·e de soi. Un peu intense. »',
      '« Tellement chaleureux·se et gentil·le. »',
      '« Calme. On peut lui faire confiance. »',
      '« Mystérieux·se. Pas comme les autres. »',
    ] },
    { q: 'Quel cadeau te ferait le plus plaisir ?', choices: [
      'Une plante ou quelque chose fait main',
      'Des places de concert avec mes meilleurs potes',
      'Un livre rare ou un joli carnet',
      'Un week-end surprise',
    ] },
    { q: 'Une dispute commence. Tu…', choices: [
      'Restes calme et cherches ce qui est juste',
      'T’excuses en premier. La paix compte plus.',
      'Fais une blague pour détendre l’atmosphère',
      'Prends du recul et y repenses plus tard',
    ] },
    { q: 'Choisis la devise qui te ressemble le plus.', choices: [
      'La vie est une aventure : dis oui !',
      'Grandir lentement, s’enraciner profondément.',
      'D’abord le rêver, ensuite le réaliser.',
      'Aimer haut et fort.',
    ] },
  ],

  types: {
    red: {
      name: 'Rouge rubis',
      word: 'rouge',
      vibe: 'Un feu pur : audacieux, motivé, plein de vie.',
      desc: 'Ton aura brûle fort et chaud. Tu es dans l’action : quand quelque chose compte, tu te lances et tu réfléchis en chemin. Les défis te réveillent au lieu de te faire peur, et ton énergie entraîne les autres avec toi. Tu ressens tout intensément, de l’excitation à l’agacement, et tu ne le caches pas. C’est justement cette franchise qui inspire confiance.',
      strengths: ['Une énergie sans peur', 'Un élan contagieux', 'Franc·he et direct·e'],
      others: 'Les autres te voient comme l’étincelle du groupe : celle ou celui qui lance les choses et dit tout haut ce que chacun pense tout bas.',
    },
    orange: {
      name: 'Orange couchant',
      word: 'orange',
      vibe: 'Chaleureux, spontané, toujours partant pour l’aventure.',
      desc: 'Ton aura brille comme un coucher de soleil sur la route des vacances. Tu adores les nouveaux lieux, les nouvelles têtes et le « pourquoi pas ? ». Tu te fais des amis partout et tes anecdotes sont toujours les meilleures à table. La routine t’ennuie, alors tu colores ta vie de projets que personne d’autre n’imaginerait. Sous le fun se cache un cœur généreux qui aime partager les bons moments.',
      strengths: ['Esprit d’aventure', 'Se fait des amis partout', 'Met l’ambiance'],
      others: 'Les autres te voient comme l’ami·e qui transforme une journée banale en histoire à raconter : facile à vivre, sociable et plein·e de surprises.',
    },
    yellow: {
      name: 'Jaune doré',
      word: 'jaune',
      vibe: 'Un rayon de soleil sur pattes : joyeux, curieux, lumineux.',
      desc: 'Ton aura, c’est la pleine lumière du jour. Optimiste, joueur·se et curieux·se de tout, tu collectionnes les idées et les passions. Tu trouves le côté drôle de presque tout, et ton rire est célèbre chez tes amis. Tu aimes la légèreté, mais tu es aussi vif·ve d’esprit : tu apprends vite et tu partages avec tout le monde.',
      strengths: ['Optimisme naturel', 'Esprit vif et curieux', 'Illumine chaque ambiance'],
      others: 'Les autres te voient comme un rayon de soleil : ta simple présence rend les jours difficiles plus légers.',
    },
    green: {
      name: 'Vert émeraude',
      word: 'vert',
      vibe: 'Ancré, attentionné, qui grandit en douceur.',
      desc: 'Ton aura ressemble à une forêt après la pluie : calme, fraîche et vivante. Tu prends profondément soin des gens et des choses qui t’entourent, et tu préfères construire du durable plutôt que gagner vite. Tu remarques ce dont les autres ont besoin et tu aides sans en faire tout un plat. L’équilibre compte pour toi : une balade, un bon repas et les gens que tu aimes réparent presque tout.',
      strengths: ['Stable et patient·e', 'L’âme d’un soignant', 'Garde l’équilibre'],
      others: 'Les autres te voient comme un refuge : fiable, doux·ce, la personne qu’on appelle quand on a besoin de retrouver les pieds sur terre.',
    },
    blue: {
      name: 'Bleu océan',
      word: 'bleu',
      vibe: 'Eaux calmes, loyauté profonde, paroles sincères.',
      desc: 'Ton aura est aussi calme que la mer par beau temps. Tu restes stable quand tout s’emmêle et tu choisis tes mots avec soin. La vérité et la confiance comptent énormément pour toi : tu tiens tes promesses et tu attends la même chose des autres. Tu n’es peut-être pas la voix la plus forte, mais quand tu parles, on t’écoute, parce qu’on sait que tu le penses.',
      strengths: ['Calme sous pression', 'Loyauté profonde', 'Parole réfléchie'],
      others: 'Les autres te voient comme la personne la plus digne de confiance qu’ils connaissent : paisible, juste et toujours honnête.',
    },
    indigo: {
      name: 'Indigo minuit',
      word: 'indigo',
      vibe: 'Intuitif, profond, toujours un coup d’avance.',
      desc: 'Ton aura scintille comme le ciel juste après minuit. Tu sens les choses avant qu’on les dise, et tu devines souvent la fin d’une histoire avant qu’elle commence. Tu aimes les grandes questions, les moments de calme et les conversations qui vont loin. Indépendant·e et un peu secret·ète, tu offres à ceux qui te connaissent vraiment une amitié d’une rare lucidité.',
      strengths: ['Intuition aiguisée', 'Pensée profonde', 'Voit la vue d’ensemble'],
      others: 'Les autres te trouvent sage pour ton âge : discret·ète, perspicace et un peu difficile à cerner.',
    },
    violet: {
      name: 'Violet mystique',
      word: 'violet, mauve',
      vibe: 'Un·e rêveur·se avec une vision que personne d’autre ne voit.',
      desc: 'Ton aura tourbillonne d’imagination. Tu vois le monde tel qu’il pourrait être, pas seulement tel qu’il est, et ta tête déborde d’idées, d’histoires et de projets. L’art, la musique et tout ce qui sort de l’ordinaire t’attirent. Les règles classiques ne te vont pas toujours, et c’est très bien : ta façon unique de voir les choses inspire ton entourage.',
      strengths: ['Imagination débordante', 'Idées originales', 'Inspire les autres'],
      others: 'Les autres te voient comme quelqu’un d’unique : créatif·ve, un brin mystérieux·se et plein·e d’idées surprenantes.',
    },
    pink: {
      name: 'Rose poudré',
      word: 'rose',
      vibe: 'Cœur tendre, amour immense, force douce.',
      desc: 'Ton aura est chaude et tendre comme la première lumière du printemps. Tu aimes sans compter et tu fais sentir aux gens qu’ils comptent, que ce soit en retenant un anniversaire ou en remarquant quand quelqu’un est silencieux. La gentillesse te vient naturellement, et tu crois qu’un petit geste peut changer toute une journée. Doux·ce ne veut pas dire faible : ton cœur, c’est ta force.',
      strengths: ['Gentillesse infinie', 'Grande empathie', 'Fait se sentir aimé'],
      others: 'Les autres te voient comme une personne douce et réconfortante : l’ami·e dont un câlin répare tout.',
    },
  },
};
