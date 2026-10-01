/* Quiz déguisement d’Halloween — Français (fr/)
 * Mêmes 8 id de déguisement et même ordre des questions/choix que costume-core.js (les poids ne sont que là-bas).
 * Clés en Html : HTML brut (<br> et <em> seulement). Le corps de privacy.sections est aussi en HTML.
 * Pas de spoiler : meta / og.default* / start / faq / loading ne nomment aucun déguisement et ne citent aucune question.
 * types.<id>.word = mots simples du déguisement (séparés par des virgules) — pour le contrôle anti-spoiler.
 * Espaces fines insécables (U+202F) avant ? ! : ; et à l’intérieur des « ».
 * Variables : {name} {emoji} {vibe} {pct} {n}
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
    title: 'Quiz déguisement d’Halloween : en quoi me déguiser ?',
    description: 'En quoi te déguiser pour Halloween ? Quiz déguisement d’Halloween gratuit : 12 moments de soirée, 2 minutes, sans inscription, et un look qui te ressemble.',
    ogTitle: 'Quiz déguisement d’Halloween 🎃 En quoi te déguiser cette année ?',
    ogDescription: 'Un quiz gratuit de 2 minutes. Réponds à 12 moments de soirée d’Halloween et découvre le déguisement qui colle à ta personnalité.',
  },
  siteName: 'Quiz déguisement d’Halloween',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🎃 Cabine d’essayage hantée',
    h1Kicker: 'Quiz déguisement d’Halloween',
    h1Html: 'En quoi me déguiser<br>pour <em>Halloween</em> ?',
    hook: 'Toujours rien dans ton sac à déguisements ? Douze petits moments de soirée vont choisir le look qui te ressemble vraiment.',
    metaTime: '⏱️ 2 minutes',
    metaCount: '🦇 12 questions',
    start: 'Trouver mon costume →',
  },

  quiz: {
    backAria: 'Question précédente',
    progressAria: 'Progression',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'On fouille la malle à costumes…',
    sub: 'Quelques essayages rien que pour toi',
  },

  result: {
    title: 'Quiz déguisement d’Halloween : je serai {name}',
    eyebrow: 'Cette année, déguise-toi en',
    strengthsLabel: 'Tes super-pouvoirs de soirée',
    tipsLabel: 'Comment le réaliser',
    bestLabel: 'Meilleur pote',
    rivalLabel: 'Rival sympa',
    sameShare: '{pct} % des joueurs ont eu ce déguisement',
    shareText: 'Mon déguisement d’Halloween : {name} {emoji} — « {vibe} » Et toi, tu te déguises en quoi ?',
    ctaStrong: 'Un ami a partagé son déguisement d’Halloween',
    ctaSub: 'Et toi, en quoi te déguiser ? Ça prend 2 minutes.',
    retry: 'Refaire le quiz',
  },

  og: {
    eyebrow: 'Mon déguisement d’Halloween',
    brand: '🎃 Quiz déguisement d’Halloween',
    defaultKicker: 'Quiz déguisement d’Halloween',
    defaultTitle: 'En quoi te déguiser pour Halloween ?',
    defaultDesc: '12 moments de soirée · environ 2 minutes',
  },

  faq: [
    { q: 'Comment le quiz choisit-il mon déguisement ?', a: 'Chaque réponse donne des points à un ou deux déguisements, et celui qui en a le plus l’emporte. Les égalités sont départagées par une règle fixe : les mêmes réponses donnent donc toujours le même résultat.' },
    { q: 'Je peux vraiment fabriquer le costume moi-même ?', a: 'Oui. Chaque résultat est accompagné d’astuces simples avec des choses que tu as sans doute déjà chez toi, plus quelques petits achats à prix mini (Action, supermarché). Aucune couture nécessaire.' },
    { q: 'Et si mon résultat ne me plaît pas ?', a: 'Refais le quiz ! Ton résultat dépend uniquement de tes réponses du jour, et une autre humeur de soirée peut faire ressortir un autre look. Ou fais équipe avec ton meilleur pote pour un costume de groupe.' },
    { q: 'Mes réponses sont-elles enregistrées ?', a: 'Non. Tes réponses sont calculées dans ton navigateur et jamais stockées. Nous comptons seulement, de façon anonyme, quel déguisement est sorti, pour afficher la fréquence de chaque résultat.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Quiz déguisement d’Halloween',
    description: 'Politique de confidentialité du Quiz déguisement d’Halloween : cookies, publicité et statistiques anonymes.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le Quiz déguisement d’Halloween (le « Service ») respecte ta vie privée et ne traite que le minimum d’informations nécessaire, comme décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Le Service s’utilise sans inscription ni connexion. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons seulement, de façon anonyme, quel déguisement est sorti, pour afficher la fréquence de chaque résultat.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies et le stockage local de ton navigateur pour retenir ta langue, afficher des publicités et comprendre l’utilisation du Service. Tu peux les refuser ou les supprimer dans les réglages de ton navigateur ; certaines fonctions risquent alors de mal fonctionner.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces selon tes visites précédentes sur ce site et d’autres. Plus d’informations et réglages dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Statistiques', 'Nous conservons des totaux quotidiens anonymes (pages vues, quiz terminés, notes) pour améliorer le Service. Ils ne permettent pas de t’identifier.'],
      ['5. Contact', 'Pour toute question sur cette politique, contacte l’exploitant du site.'],
      ['6. Date d’effet', 'Cette politique est en vigueur depuis le 2 octobre 2026.'],
    ],
    back: '← Retour au quiz',
  },

  questions: [
    { q: 'Une invitation à une soirée d’Halloween vient d’arriver. Ta première pensée ?', choices: [
      'Enfin ! Ça fait des semaines que je prépare mon look.',
      'C’est chez qui ? J’apporte les chips et la playlist.',
      'Faut vraiment se déguiser… ou je peux venir en jogging ?',
      'Je fabrique mon propre costume. Le tout fait, c’est trop banal.',
    ] },
    { q: 'Au magasin de déguisements, tu fonces direct vers…', choices: [
      'Le rayon capes en velours et paillettes',
      'Le bac des promos. Tout me va !',
      'Les oreilles, les queues et les petits accessoires',
      'Le coin DIY : bandages, maquillage, scotch',
    ] },
    { q: 'Tu arrives à la soirée. Premier réflexe ?', choices: [
      'Trouver la piste de danse',
      'Dire bonjour à tout le monde et présenter les gens',
      'Me poser dans un coin tranquille et observer',
      'Filer droit vers le buffet',
    ] },
    { q: 'Ding-dong ! Des enfants crient « Des bonbons ou un sort ! » à ta porte. Tu…', choices: [
      'Danses sur le pas de la porte en distribuant les bonbons',
      'Te caches derrière la porte et surgis : Bouh !',
      'Donnes à chaque enfant un petit sachet fait maison',
      'Exiges d’abord un tour. Donnant-donnant.',
    ] },
    { q: 'Le DJ passe une chanson que tu adores. Tu…', choices: [
      'Danses comme si personne ne regardait. Direct.',
      'Entres lentement en piste avec des gestes théâtraux',
      'Hoches la tête depuis le canapé, un snack à la main',
      'Entraînes ton pote le plus timide sur la piste',
    ] },
    { q: 'Photo de groupe ! Tu es où ?', choices: [
      'Devant, au centre, meilleur profil prêt',
      'À peine visible, tout au bord du cadre',
      'Au dernier rang, en pleine grimace',
      'En train de recoiffer et d’arranger tout le monde avant',
    ] },
    { q: 'Quelqu’un propose : « Et si on se racontait des histoires qui font peur ? » Tu…', choices: [
      'En as déjà une qui glace le sang',
      'Agrippes le bras de ton voisin et écoutes un œil fermé',
      'Transformes l’histoire en comédie en plein milieu',
      'T’éclipses discrètement vers la cuisine',
    ] },
    { q: 'Le buffet t’appelle. Tu prends…', choices: [
      'Un peu de tout. Puis du rab.',
      'Le plat bizarre que personne n’ose goûter',
      'Uniquement le plus joli dessert de la table',
      'Des assiettes pour tes potes avant toi',
    ] },
    { q: 'À minuit, la lumière s’éteint d’un coup. Tu…', choices: [
      'Allumes la lampe de ton téléphone et rassures tout le monde',
      'Fais un bruit sinistre pour faire flipper les autres',
      'Restes parfaitement immobile. Tu vois très bien dans le noir.',
      'Continues à manger. Le noir ne change rien.',
    ] },
    { q: 'Concours de déguisements ! Quel prix gagnerais-tu ?', choices: [
      'Le plus élégant',
      'Le plus créatif',
      'Le chouchou du public',
      'Le plus mignon',
    ] },
    { q: 'Tu visites une maison hantée. C’est toi qui…', choices: [
      'Mènes le groupe et encourages tout le monde',
      'Traverses tout calmement, pas impressionné pour un sou',
      'Cries le plus fort et ris le plus',
      'Examines les décors : « Comment ils ont fait ça ? »',
    ] },
    { q: 'Le lendemain matin de la soirée, tu…', choices: [
      'Dors encore. Réveillez-moi au coucher du soleil.',
      'Ranges et rends à chacun ses affaires oubliées',
      'Prépares déjà la soirée de l’an prochain',
      'Ne fais plus qu’un avec le canapé, complètement à plat',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampire de velours',
      word: 'vampire',
      vibe: 'Élégant sans effort, un brin théâtral, et la star de chaque nuit.',
      desc: 'Tu es né pour la vie nocturne. Tu adores faire une entrée remarquée, tu connais ton meilleur profil et tu sais transformer une soirée banale en scène de film. Les gens sont attirés par ton assurance tranquille et ta part de mystère. Tu prends le style au sérieux, mais tu prends aussi soin de ton cercle : une fois fidèle, c’est pour toujours.',
      strengths: ['Charme magnétique', 'Style impeccable', 'Maître de la nuit'],
      tips: ['Une tenue noire et une cape (un drap sombre fait l’affaire) : effet « comte du château » immédiat.', 'Plaque tes cheveux en arrière et ajoute une touche de rouge au coin des lèvres.', 'Des fausses canines en plastique et une révérence lente et dramatique en arrivant.'],
    },
    witch: {
      name: 'Sorcière du clair de lune',
      word: 'sorcière',
      vibe: 'Futée, créative et toujours en train de mijoter un plan génial.',
      desc: 'Ta tête est un chaudron d’idées. Tu préfères créer quelque chose d’original plutôt que copier tout le monde, et tu as généralement un plan B, C et D. Indépendante et un peu espiègle, tu as un esprit vif qui rend chaque conversation intéressante. Tes amis viennent te voir quand ils ont besoin d’une solution maline — ou d’un bon conseil magique.',
      strengths: ['Idées brillantes', 'Esprit indépendant', 'Répartie aiguisée'],
      tips: ['Un chapeau pointu et une longue robe ou un manteau sombre suffisent pour commencer.', 'Un balai ou un mug étiqueté « potion » comme accessoire fétiche.', 'Ajoute des gommettes étoiles, un rouge à lèvres violet ou une peluche de chat noir sur l’épaule.'],
    },
    ghost: {
      name: 'Fantôme en drap',
      word: 'fantôme',
      vibe: 'Timide et mignon, douillet, et en secret le plus drôle de la pièce.',
      desc: 'Pas besoin d’être sous les projecteurs pour passer un super moment. Tu préfères les vêtements confortables, quelques amis proches et observer la fête depuis un coin douillet. On te sous-estime parfois au début, mais tes remarques discrètes et tes blagues en douce prennent tout le monde par surprise. Doux et gentil, tu es l’ami auprès de qui on se sent en sécurité.',
      strengths: ['Douceur bienveillante', 'Humour en douce', 'Grand observateur'],
      tips: ['Un drap blanc avec deux trous pour les yeux. Classique, confortable et prêt en cinq minutes.', 'Ajoute des lunettes de soleil ou un petit chapeau pour le rendre unique.', 'Brandis une petite pancarte « bouh » pour des photos trop mignonnes.'],
    },
    zombie: {
      name: 'Zombie fêtard',
      word: 'zombie',
      vibe: 'Cool, toujours affamé et impossible à arrêter une fois lancé.',
      desc: 'Tu suis le mouvement et rien ne te stresse vraiment. Donne-toi de bons snacks, des chaussures confortables et tes personnes préférées, et tu es heureux. Le matin, tu démarres lentement, mais une fois lancé, tu es à fond — et rien ne peut t’arrêter. Tes amis adorent ton côté détendu et ta fidélité à ta bande.',
      strengths: ['Zen en toutes circonstances', 'Endurance infinie', 'Fidèle à la bande'],
      tips: ['Prends de vieux vêtements, fais quelques trous et frotte du marc de café pour la « terre ».', 'Du maquillage gris sur le visage et du fard sombre autour des yeux, et le tour est joué.', 'Marche lentement, bras tendus, en grognant pour réclamer des snacks.'],
    },
    blackcat: {
      name: 'Chat noir de minuit',
      word: 'chat',
      vibe: 'Cool, curieux et mystérieux — l’affection seulement pour quelques élus.',
      desc: 'Tu fais les choses à ta façon, à ton rythme. Tout t’intrigue, mais tu ne montres ton intérêt que quand tu le ressens vraiment. On te trouve un peu mystérieux, et c’est exactement ce que tu aimes. Derrière ton air détaché, tu es joueur et tendre avec ceux qui gagnent ta confiance — et tu retombes toujours sur tes pattes.',
      strengths: ['Cool sans effort', 'Curiosité sans fin', 'Retombe toujours sur ses pattes'],
      tips: ['Une tenue toute noire et un serre-tête oreilles de chat : reconnaissable au premier coup d’œil.', 'Dessine un petit nez et des moustaches à l’eye-liner.', 'Accroche dans ton dos une queue faite avec une chaussette ou un collant noir.'],
    },
    mummy: {
      name: 'Momie douillette',
      word: 'momie',
      vibe: 'Patiente, attentionnée, c’est elle qui garde toute la bande soudée.',
      desc: 'C’est toi qui veilles discrètement à ce que tout le monde aille bien. Tu te souviens des petits détails, tu répares ce qui est cassé et tu as toujours un pansement sous la main — au sens propre comme au figuré. Patient et stable, tu as le charme d’une vieille âme et l’amour des choses classiques et intemporelles. Rien qu’à tes côtés, on se sent plus serein.',
      strengths: ['Patience infinie', 'Grand cœur attentionné', 'Fiable comme un roc'],
      tips: ['Enroule de la gaze blanche ou des bandes de vieux drap sur une tenue blanche.', 'Laisse un œil dépasser et quelques bouts pendre librement.', 'Tamponne les bandes avec du thé ou du café pour un effet antique.'],
    },
    pumpkin: {
      name: 'Roi Citrouille',
      word: 'citrouille',
      vibe: 'Chaleureux, rayonnant, le cœur de la fête — roi ou reine d’Halloween.',
      desc: 'Tu illumines chaque pièce comme une lanterne. Tu adores rassembler les gens, tu retiens le prénom de chacun et tu veilles à ce que personne ne se sente mis à l’écart. Les soirées sont plus vivantes quand tu es là, et c’est souvent toi qui les organises. Ta chaleur est contagieuse : on repart de chez toi un peu plus lumineux.',
      strengths: ['Hôte né', 'Chaleur contagieuse', 'Rassembleur'],
      tips: ['Un haut ou un sweat orange avec une tête de lanterne découpée dans de la feutrine noire.', 'Coiffe-toi d’un serre-tête à feuilles vertes ou d’une petite couronne.', 'Promène un seau à bonbons et distribue des friandises à tout le monde.'],
    },
    skeleton: {
      name: 'Squelette danseur',
      word: 'squelette',
      vibe: 'Rigolo, franc et toujours le premier sur la piste de danse.',
      desc: 'Tu es là pour t’amuser, et ça se voit. Tu fais rire les gens sans même essayer, et ton énergie entraîne tout le monde sur la piste. Ta franchise fait du bien : avec toi, ce qu’on voit est ce qu’on a, jusqu’à l’os. La vie paraît plus légère à tes côtés, parce que tu ne te prends jamais trop au sérieux.',
      strengths: ['Booster d’ambiance', 'Franchise jusqu’à l’os', 'Danseur sans peur'],
      tips: ['Des vêtements noirs avec du scotch blanc ou de la peinture textile pour les os.', 'Maquille une tête de mort : base blanche, cercles noirs autour des yeux et dents cousues.', 'Entraîne-toi sur un pas de danse ridicule — les cliquetis sont obligatoires.'],
    },
  },
};
