/* Test amoureux — français (fr/)
 * Mêmes id et même ordre questions/réponses que lovestyle-core.js (le barème n’est que là-bas).
 * Pas de spoiler : méta, écran d’accueil, FAQ et OG par défaut ne nomment aucun type (animal) et ne citent aucune question.
 * types.<id>.word = mot(s) d’animal pour le contrôle anti-spoiler. Espaces fines insécables avant ? ! : ; ».
 */
module.exports = {
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap',
    display: "'Nunito'",
    displayWeight: 900,
    sans: '',
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Test amoureux : quel genre de partenaire es-tu ?',
    description: 'Quel genre de partenaire es-tu en amour ? Test amoureux en 10 petits moments de couple, 2 à 3 minutes, sans inscription. Découvre ton style, ton match idéal et des conseils doux.',
    ogTitle: 'Test amoureux 💘 Quel genre de partenaire es-tu ?',
    ogDescription: 'Un quiz de 2 minutes. Réponds à 10 petits moments amoureux et découvre ton vrai style en amour.',
  },
  siteName: 'Test amoureux',
  privacyLink: 'Confidentialité',

  start: {
    badge: '💘 Quiz de personnalité',
    h1Kicker: 'Test amoureux',
    h1Html: 'Quel genre de partenaire<br>es-tu <em>en amour</em> ?',
    hook: 'Tes textos, ton premier rendez-vous, vos petites disputes… Dix moments du quotidien révèlent le petit personnage caché dans ton cœur.',
    metaTime: '⏱️ 2 à 3 minutes',
    metaCount: '💌 10 questions',
    start: 'Découvrir mon style →',
  },

  quiz: {
    backAria: 'Question précédente',
    progressAria: 'Progression',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Lecture de ton cœur…',
    sub: 'On associe tes réponses à un style amoureux',
  },

  result: {
    title: 'Test amoureux : je suis {name}',
    eyebrow: 'En amour, tu es',
    strengthsLabel: 'Tes atouts en amour',
    tipsLabel: 'Conseils pour toi',
    bestLabel: 'Match idéal',
    rivalLabel: 'Rival',
    sameShare: '{pct} % des joueurs ont ce style',
    shareText: 'En amour, je suis {name} {emoji} « {vibe} » Et toi ?',
    ctaStrong: 'Un·e ami·e t’a partagé son style',
    ctaSub: 'Et toi, quel genre de partenaire es-tu ? 2 minutes.',
    retry: 'Refaire le test',
  },

  og: {
    eyebrow: 'Mon style en amour',
    brand: '💘 Test amoureux',
    defaultKicker: 'Test amoureux',
    defaultTitle: 'Quel genre de partenaire es-tu ?',
    defaultDesc: '10 moments amoureux · 2 à 3 minutes',
  },

  faq: [
    { q: 'Comment le test choisit-il mon résultat ?', a: 'Chaque réponse donne des points à deux styles, et celui qui en a le plus l’emporte. Les égalités sont départagées par une règle fixe : les mêmes réponses donnent toujours le même résultat.' },
    { q: 'Est-ce un test de personnalité scientifique ?', a: 'Non, c’est juste pour s’amuser. Les questions s’inspirent des habitudes de couple du quotidien, ce n’est pas un diagnostic psychologique : un petit miroir ludique, pas un verdict.' },
    { q: 'Que veulent dire « match idéal » et « rival » ?', a: 'Ton match idéal équilibre naturellement ton style. Ton rival est celui avec qui tu te chamailles le plus… ce qui peut aussi vouloir dire le plus d’étincelles.' },
    { q: 'Mes réponses sont-elles enregistrées ?', a: 'Non. Tes réponses sont calculées dans ton navigateur et ne sont jamais conservées. On compte seulement, de façon anonyme, quel style est sorti pour afficher la fréquence de chaque résultat.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Test amoureux',
    description: 'Politique de confidentialité du Test amoureux : cookies, publicité et statistiques anonymes.',
    h1: 'Politique de confidentialité',
    introHtml: 'Test amoureux (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations nécessaires, comme décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service s’utilise sans inscription ni connexion. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quel style est sorti afin d’afficher la fréquence de chaque résultat.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local du navigateur pour retenir ta langue, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages du navigateur ; certaines fonctions peuvent alors mal fonctionner.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des annonces selon tes visites précédentes sur ce site et d’autres. Plus d’informations et réglages dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Nous conservons uniquement des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ces totaux ne permettent pas de t’identifier.'],
      ['5. Contact', 'Pour toute question sur cette politique, contacte l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique s’applique à partir du 4 octobre 2026.'],
    ],
    back: '← Retour au test amoureux',
  },

  questions: [
    { q: 'Ton crush t’écrit en premier. Tu…', choices: [
      'Réponds en trois secondes, avec cinq émojis',
      'Attends un peu. Pas envie d’avoir l’air trop pressé·e.',
      'Envoies une réponse taquine qui le ou la laisse curieux·se',
      'Demandes comment s’est passée sa journée, et retiens tout',
    ] },
    { q: 'Premier rendez-vous ! Tu proposes…', choices: [
      'Un café mignon avec de jolis desserts et une musique douce',
      'Un endroit calme pour vraiment discuter',
      'Une salle d’arcade ou un bar à jeux. On joue !',
      'Un truc nouveau : marché de nuit, rando, escapade d’un jour',
    ] },
    { q: 'Son anniversaire approche. Ton plan ?', choices: [
      'Une fête surprise avec tous ses amis',
      'Un cadeau stylé qu’il ou elle n’imaginerait jamais',
      'Une lettre manuscrite et un album de nos souvenirs',
      'Un cadeau débile qui le ou la fera rire pendant des jours',
    ] },
    { q: 'Ton ou ta partenaire a passé une journée horrible. Tu…', choices: [
      'Restes à ses côtés en silence. Pas besoin de mots.',
      'Débarques avec son plat préféré et règles ce que tu peux',
      'L’écoutes toute la soirée et retiens chaque mot',
      'L’emmènes faire un tour en voiture sur un coup de tête',
    ] },
    { q: 'En couple, tu aimes t’écrire combien ?', choices: [
      'Toute la journée ! Du bonjour au bonne nuit',
      'Un ou deux petits messages. Je préfère appeler.',
      'De longs messages tendres remplis de cœurs',
      'De temps en temps. Je préfère raconter en vrai.',
    ] },
    { q: 'Petite dispute. Tu…', choices: [
      'As besoin d’un moment seul·e avant de parler',
      'Fais comme si de rien n’était, mais lâches des indices',
      'T’excuses en premier, même si ce n’était pas vraiment ta faute',
      'Fais une blague pour détendre l’atmosphère',
    ] },
    { q: 'Qu’est-ce qui fait battre ton cœur ?', choices: [
      'Quand son visage s’illumine dès qu’il ou elle me voit',
      'Quand on rit de la même bêtise',
      'Quand il ou elle dit « on part quelque part ? » sur un coup de tête',
      'Quand on respecte mon espace et qu’on me choisit quand même',
    ] },
    { q: 'Ton week-end idéal à deux ?', choices: [
      'Se faire beau, un resto tendance, de jolies photos',
      'Cuisiner à la maison et bricoler ensemble',
      'Un pique-nique avec des fleurs et un coucher de soleil',
      'Notre endroit habituel, notre commande habituelle',
    ] },
    { q: 'Quand quelqu’un commence à te plaire, tu…', choices: [
      'Ne sais pas le cacher. Tout le monde le sait en deux jours.',
      'Joues les détaché·es et laisses venir',
      'Aimes en silence, très, très longtemps',
      'Proposes un rendez-vous tout de suite. La vie est courte !',
    ] },
    { q: 'Le plus important pour toi dans un couple ?', choices: [
      'La confiance, et de l’espace pour être moi',
      'Me sentir en sécurité et chouchouté·e',
      'Le romantisme et les petits anniversaires',
      'Être meilleurs amis et tout se dire',
    ] },
  ],

  types: {
    puppy: {
      name: 'le Golden Retriever',
      word: 'golden,retriever,chiot,chien',
      vibe: 'À fond, tout cœur, et toujours ravi·e de te voir.',
      desc: 'Quand tu aimes, le monde entier le sait. Tu écris en premier, tu arrives en avance et tu ne joues jamais : tout se lit sur ton visage. Ton énergie donne à l’autre l’impression d’être la personne la plus importante du monde. Pense juste à prendre soin de toi aussi, pour que ton grand cœur ne tombe jamais à plat.',
      strengths: ['Dévouement total', 'Joie contagieuse', 'Zéro prise de tête'],
      tips: ['Une réponse lente ne veut pas dire qu’il y a un problème : laisse-lui le temps de te manquer.', 'Garde une journée par semaine rien que pour toi ; vos moments à deux brilleront encore plus.', 'Demande quel geste tendre il ou elle préfère, et offre-le sans compter.'],
    },
    cat: {
      name: 'le Chat tsundere',
      word: 'chat',
      vibe: 'Froid dehors, tout doux dedans : les câlins, c’est pour l’élu·e.',
      desc: 'Tu ne tombes pas vite amoureux·se, et jamais bruyamment. Tu as besoin de ton espace et de ton temps, alors tu peux paraître un peu distant·e au début. Mais une fois la confiance gagnée, tu montres un côté doux et joueur que seule cette personne connaît. Ton amour est discret, fidèle et bien réel.',
      strengths: ['Indépendance sereine', 'Fidèle une fois en confiance', 'Tendresse secrète'],
      tips: ['Dis un vrai « tu m’as manqué » à voix haute : venant de toi, ça vaut de l’or.', 'Explique que tu as besoin de moments seul·e, pour qu’on ne prenne pas ça pour de la froideur.', 'Les petits gestes comptent : te souvenir de son café préféré, c’est ta façon d’aimer.'],
    },
    fox: {
      name: 'le Renard charmeur',
      word: 'renard',
      vibe: 'Malin, stylé et toujours un coup d’avance au jeu de la séduction.',
      desc: 'Tu sais faire forte impression. Des messages pleins d’esprit, une tenue parfaite, juste ce qu’il faut de mystère : on te trouve irrésistible. Tu adores le frisson de la romance et tu entretiens la flamme avec des surprises. Sous le charme, tu cherches quelqu’un qui suive ton rythme et voie le vrai toi.',
      strengths: ['Charme magnétique', 'Goût très sûr', 'Entretient la flamme'],
      tips: ['Mélange le jeu de séduction avec de la franchise : des signaux clairs créent vite la confiance.', 'Montre-toi un jour de flemme, sans maquillage : le vrai, c’est attirant.', 'Tes surprises sont légendaires ; laisse-toi surprendre à ton tour.'],
    },
    bear: {
      name: 'le Gros Nounours',
      word: 'nounours,ours',
      vibe: 'Solide, chaleureux, et le câlin le plus rassurant du monde.',
      desc: 'Tu montres ton amour par des actes plutôt que par de grands discours. Tu répares, tu nourris, tu es là quand ça compte. Tu n’es peut-être pas le plus flamboyant des romantiques, mais l’autre ne se demande jamais où il en est. Être avec toi, c’est comme rentrer à la maison.',
      strengths: ['Fiable comme un roc', 'L’amour en actes', 'Grand cœur chaleureux'],
      tips: ['Mets des mots sur tes sentiments de temps en temps : « je suis fier·ère de toi » change tout.', 'Prévois un rendez-vous surprise juste pour le fun, pas pour l’utile.', 'Laisse aussi l’autre prendre soin de toi parfois.'],
    },
    bunny: {
      name: 'le Lapin romantique',
      word: 'lapin',
      vibe: 'Un cœur rêveur qui se souvient de chaque date, chaque chanson, chaque petit anniversaire.',
      desc: 'Pour toi, l’amour est un film, et chaque scène doit être belle. Tu remarques les petits détails, tu écris des messages sincères et tu chéris chaque souvenir. Tu ressens tout intensément : tu es très attentionné·e, et parfois un peu sensible. La bonne personne saura chérir ta tendresse.',
      strengths: ['Romantisme sincère', 'Se souvient de tout', 'Profondément attentionné·e'],
      tips: ['Quand quelque chose te blesse, dis-le doucement au lieu d’attendre qu’on devine.', 'Tout le monde n’aime pas avec de grands gestes : repère aussi les preuves discrètes.', 'Faites un album photo à deux : c’est ton super-pouvoir.'],
    },
    penguin: {
      name: 'le Pingouin fidèle',
      word: 'pingouin,manchot',
      vibe: 'Lent au démarrage, mais quand tu aimes, c’est une seule personne, pour toujours.',
      desc: 'Tu prends ton temps avant d’ouvrir ton cœur, sans jamais rien précipiter. Mais quand tu choisis quelqu’un, c’est pour longtemps. Tu écoutes vraiment, tu retiens l’essentiel et tu restes fidèle en toute saison. Ton amour est doux, patient, de ceux dont on rêve.',
      strengths: ['Fidélité absolue', 'Écoute attentive', 'Douceur constante'],
      tips: ['N’attends pas trop pour montrer ton intérêt : un petit premier pas peut tout changer.', 'Partage aussi tes soucis, pas seulement les siens : l’amour va dans les deux sens.', 'Teste une nouvelle idée de sortie chaque mois pour garder la routine pétillante.'],
    },
    hamster: {
      name: 'le Hamster complice',
      word: 'hamster',
      vibe: 'Ton ou ta partenaire est aussi ton meilleur ami, et chaque rendez-vous finit en fou rire.',
      desc: 'Pour toi, les plus belles histoires commencent en amitié. Tu adores jouer, partager des snacks et rire à en avoir mal au ventre. Tu es facile à vivre et tu apportes une énergie légère et joyeuse au couple. Les discussions sérieuses te gênent un peu, mais ta franchise et ton humour rendent votre lien solide.',
      strengths: ['Fun à l’infini', 'Facile à vivre', 'L’amitié d’abord'],
      tips: ['Ajoute un peu de romantisme de temps en temps : les bougies battent parfois les blagues.', 'Quand ça devient sérieux, reste dans la conversation au lieu de plaisanter.', 'Garde vos blagues privées bien vivantes : c’est la colle de votre couple.'],
    },
    dolphin: {
      name: 'le Dauphin libre',
      word: 'dauphin',
      vibe: 'Aventurier, spontané et toujours une idée de sortie d’avance.',
      desc: 'Tu aimes la liberté, les nouveaux endroits et dire oui à l’aventure. Sortir avec toi, c’est des road trips, des plans improvisés et des histoires à raconter. Tu apportes énergie et curiosité dans chaque relation, et tu as besoin de quelqu’un qui aime le voyage. Ta liberté compte, mais la bonne personne te donne envie de rentrer.',
      strengths: ['Esprit d’aventure', 'Mille idées', 'Courage en amour'],
      tips: ['Équilibre les plans spontanés avec quelques rituels sur lesquels l’autre peut compter.', 'Préviens avant les grandes aventures : tout le monde n’aime pas les surprises.', 'Partage tes rêves : faire des projets à deux, c’est déjà une aventure.'],
    },
  },
};
