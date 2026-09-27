/* Test du monstre d'Halloween — Français (/fr/)
 * Mêmes 12 id de monstres et même ordre de questions/choix que monster-core.js (les poids de score n'existent que là).
 * Les clés qui finissent par Html sont insérées en HTML brut (seulement <br>, <em>) ; le contenu de privacy.sections est aussi du HTML.
 * Pas de spoilers : meta / og.default* / start / faq ne nomment jamais un monstre ni ne citent une question.
 */
module.exports = {
  // Fonts (per language): css = Google Fonts stylesheet, display = rounded display font stack for titles/buttons,
  // displayWeight, sans = optional body font (omit → shared default), wordBreak: normal|keep-all|auto-phrase, hyphens: manual|auto
  fonts: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap',
    display: "'Baloo 2'",
    displayWeight: 800,
    sans: "",
    wordBreak: 'normal',
    hyphens: 'manual',
  },

  meta: {
    title: 'Quel monstre es-tu ? Test de personnalité Halloween',
    description: 'Quel monstre es-tu ? Fais ce test de personnalité Halloween gratuit : 10 questions rigolo-flippantes, en une minute environ, sans inscription. Découvre le monstre qui te ressemble.',
    ogTitle: 'Quel monstre es-tu ? 🎃 Test de personnalité Halloween',
    ogDescription: 'Un test de personnalité Halloween gratuit, en une minute. Réponds à 10 questions rigolo-flippantes et rencontre ton monstre jumeau.',
  },
  siteName: 'Quel monstre es-tu ?',
  privacyLink: 'Politique de confidentialité',

  start: {
    badge: '🎃 Spécial Halloween',
    h1Kicker: 'Test de personnalité Halloween',
    h1Html: 'Quel <em>monstre</em><br>es-tu ?',
    hook: 'Une nuit un peu flippante, dix petits choix à faire. Quelque part dans le noir, un monstre qui te ressemble drôlement bien t’attend.',
    metaTime: '⏱️ Environ 1 minute',
    metaCount: '🦇 10 questions',
    start: 'Invoquer mon monstre →',
  },

  quiz: {
    backAria: 'Question précédente',
    progressAria: 'Progression',
    qLabel: 'Q{n}',
  },

  loading: {
    text: 'Invocation de ton monstre…',
    sub: 'On remue le chaudron',
  },

  result: {
    title: 'Quel monstre es-tu ? J’ai eu {name}',
    eyebrow: 'Le monstre qui te ressemble, c’est',
    strengthsLabel: 'Pouvoirs du monstre',
    partyLabel: 'Dans une soirée d’Halloween, tu es…',
    bestLabel: 'Meilleur pote',
    rivalLabel: 'Rival adoré',
    sameShare: '{pct} % des joueurs ont eu ce monstre aussi',
    shareText: 'Mon monstre d’Halloween, c’est {name} {emoji} — « {catch} » Quel monstre es-tu ?',
    ctaStrong: 'Un pote t’a envoyé son monstre',
    ctaSub: 'Toi, tu es lequel ? Ça prend une minute.',
    retry: 'Refaire le test',
  },

  og: {
    eyebrow: 'Mon monstre d’Halloween',
    brand: '🎃 Quel monstre es-tu ?',
    defaultKicker: 'Test de personnalité Halloween',
    defaultTitle: 'Quel monstre es-tu ?',
    defaultDesc: '10 questions rigolo-flippantes · environ 1 minute',
  },

  // Shown only inside the shared end screen, as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'Comment fonctionne le test du monstre ?', a: 'Chaque réponse ajoute des points à plusieurs monstres, et celui qui en a le plus devient ton résultat. Les égalités sont tranchées par une règle fixe, donc les mêmes réponses donnent toujours le même monstre.' },
    { q: 'Est-ce que c’est effrayant ?', a: 'Pas du tout ! C’est un quiz d’Halloween mignon et familial — pas de sang ni de jump scares, juste un petit frisson pour rire.' },
    { q: 'Je peux tomber sur un autre monstre ?', a: 'Oui. Ton résultat dépend uniquement de tes réponses, donc répondre autrement peut invoquer un monstre différent.' },
    { q: 'Mes réponses sont-elles enregistrées ?', a: 'Non. Tes réponses sont calculées dans ton navigateur et ne sont jamais stockées. On compte juste, de façon anonyme, quel monstre est sorti, pour montrer à quel point chaque résultat est fréquent.' },
  ],

  privacy: {
    title: 'Politique de confidentialité | Quel monstre es-tu ?',
    description: 'Politique de confidentialité de Quel monstre es-tu ? — comment nous utilisons les cookies, la publicité et les statistiques anonymes.',
    h1: 'Politique de confidentialité',
    introHtml: '« Quel monstre es-tu ? » (le "Service") respecte ta vie privée et ne traite que le minimum d’informations nécessaires, comme décrit ci-dessous.',
    sections: [
      ['1. Informations que nous collectons', 'Tu peux utiliser le Service sans créer de compte ni te connecter. Tes réponses sont calculées dans ton navigateur et ne sont jamais envoyées ni stockées sur nos serveurs. Nous comptons uniquement, de façon anonyme, quel type de monstre est sorti, afin de montrer à quel point chaque résultat est fréquent.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies pour afficher des publicités et comprendre comment il est utilisé. Tu peux refuser ou supprimer les cookies dans les paramètres de ton navigateur ; certaines fonctionnalités risquent alors de ne pas fonctionner correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour proposer des publicités basées sur tes visites précédentes sur ce site et d’autres sites. Tu peux en savoir plus et modifier tes réglages de publicité personnalisée dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres publicitaires Google</a>.'],
      ['4. Statistiques', 'Nous conservons des totaux quotidiens anonymes (pages vues, tests terminés, notes) pour améliorer le Service. Ces totaux ne permettent pas de t’identifier personnellement.'],
      ['5. Contact', 'Pour toute question concernant cette politique de confidentialité, merci de contacter l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 27 septembre 2026.'],
    ],
    back: '← Retour au test du monstre',
  },

  questions: [
    { q: 'Une invitation de dernière minute à une soirée d’Halloween arrive sur ton téléphone. Ta première pensée ?', choices: [
      'Qu’est-ce que je vais mettre ? Faut que ce soit culte.',
      'Il y aura à manger ? Alors je viens.',
      'Hmm… qui d’autre y va ?',
      'Je ramène la déco. Et la playlist.',
    ] },
    { q: 'Trente minutes après le début de la soirée. Tu es où ?', choices: [
      'Au milieu de la piste de danse, bras et jambes dans tous les sens',
      'À la table des amuse-gueules. Troisième assiette.',
      'Dans un coin tranquille, en pleine grande discussion avec une seule personne',
      'Déjà pote avec absolument tout le monde, sans savoir comment',
    ] },
    { q: 'Un cri retentit au fond d’un couloir plongé dans le noir. Tu…', choices: [
      'Cries encore plus fort, puis éclates de rire',
      'Fonces droit dessus. Quelqu’un a peut-être besoin d’aide !',
      'Te fige et te fonds discrètement dans le mur',
      'Regardes ta montre, tranquille. Sûrement une blague.',
    ] },
    { q: 'Il est minuit et tu as un petit creux. Tu craques pour ?', choices: [
      'Un truc rouge et chic : jus de cerise et chocolat noir',
      'Ce qu’il y a dans le frigo. Absolument tout.',
      'Un chocolat chaud avec mon mélange d’épices secret',
    ] },
    { q: 'Ta stratégie costume ?', choices: [
      'Fait main. Je le prépare depuis août.',
      'Un vieux drap avec deux trous pour les yeux. Terminé.',
      'Je m’enroule dans ce qui traîne. Le papier toilette compte aussi.',
      'Un nouveau look chaque heure. Faut garder le suspense.',
    ] },
    { q: 'Ding dong ! Des enfants déguisés sonnent à ta porte. Tu…', choices: [
      'Distribues des grandes barres chocolatées et complimentes chaque costume',
      'Surgis de derrière la porte pour une petite frayeur (toute douce)',
      'Éteins tout et regardes par les rideaux. Y a personne.',
    ] },
    { q: 'Comment tes amis te décriraient ?', choices: [
      'A l’air intimidant, mais en vrai un gros nounours',
      'Toujours à l’heure et bizarrement calme en toutes circonstances',
      'Fait toujours ce qu’il veut et s’en sort toujours indemne',
      'Mystérieux. A une solution pour absolument tout',
    ] },
    { q: '3 h du matin. La soirée touche à sa fin. Tu es…', choices: [
      'Encore en pleine forme. After chez moi !',
      'Endormi sur le canapé. Depuis 23 h.',
      'En train de ranger les restes dans des boîtes soigneusement étiquetées',
      'En train de réparer l’enceinte que quelqu’un a cassée pour que la musique continue',
    ] },
    { q: 'Tu sors dehors et il y a une immense pleine lune. Tu ressens…', choices: [
      'De l’excitation. J’ai besoin de courir quelque part. N’importe où !',
      'De la rêverie. Nuit parfaite pour une balade lente et silencieuse.',
      'Du cocooning. Retour à l’intérieur : plaid, thé, vieux film.',
      'De la chance. Vite, un vœu !',
    ] },
    { q: 'Choisis ta devise pour la nuit d’Halloween.', choices: [
      'Danse comme si personne ne regardait. De toute façon, ce sont tous des fantômes.',
      'Neuf vies, zéro souci.',
      'Toujours pile à l’heure.',
      'Il y a un sort pour ça.',
    ] },
  ],

  types: {
    vampire: {
      name: 'Vampire',
      catch: 'En retard chic, dramatique avec classe.',
      desc: 'Tu es une créature de la nuit au goût impeccable — dans tes tenues, ta musique, tes amuse-gueules. Les gens sont attirés vers toi avant même que tu aies dit un mot, et tu sais exactement comment faire ton entrée. Tu préfères veiller jusqu’à l’aube pour une super conversation plutôt que te coucher tôt. Oui, tu es un peu théâtral. C’est justement pour ça que tout le monde t’adore.',
      strengths: ['Charme magnétique', 'Goût irréprochable', 'Endurance de noctambule'],
      party: 'Celui ou celle qui arrive en dernier et devient instantanément le clou de la soirée.',
    },
    werewolf: {
      name: 'Loup-garou',
      catch: 'Fidèle à la meute, sauvage dans l’âme.',
      desc: 'Tu as une énergie sans limites et un cœur grand comme la pleine lune. Tes amis, c’est ta meute, et tu traverserais la ville en pleine nuit si l’un d’eux avait besoin de toi. Tu es honnête jusqu’à l’excès, tout le temps affamé, et ton humeur suit… disons, les phases de la lune. Quand tu t’investis, c’est à fond — et toute la salle le sent.',
      strengths: ['Loyauté féroce', 'Énergie inépuisable', 'Honnêteté (dans le bon sens)'],
      party: 'Il mène le raid sur le buffet, puis hurle avec les autres sur chaque chanson.',
    },
    witch: {
      name: 'Sorcière',
      catch: 'Mijote des idées, jette des sorts de plans, jamais à court de tours.',
      desc: 'Curieuse, maligne et un peu espiègle — tu as toujours un plan, un plan B et un ingrédient secret. Tu adores collectionner les infos insolites pour en faire quelque chose d’utile (ou joyeusement chaotique). Tes amis viennent te demander conseil parce que tes réponses marchent vraiment. Indépendante jusqu’au bout des ongles, tu préfères voler sur ton propre balai plutôt qu’attendre qu’on vienne te chercher.',
      strengths: ['Sens aigu de la solution', 'Curiosité sans fin', 'Un remède pour tout'],
      party: 'Elle mélange des potions mystérieuses dans la cuisine et lit l’avenir à tout le monde.',
    },
    ghost: {
      name: 'Fantôme',
      catch: 'Discret, tout doux, et secrètement le plus drôle de la bande.',
      desc: 'Tu flottes doucement dans la vie et tu remarques tout ce que les autres ratent. Tu n’es pas vraiment timide — tu préfères juste quelques vrais amis à une pièce bondée. Quand tu prends la parole, c’est toujours la réplique parfaite qui fait rire tout le monde. Tu es aussi passé maître dans l’art de disparaître en douce : là une seconde, tranquillement au lit la suivante.',
      strengths: ['Observateur hors pair', 'Humour pince-sans-rire', 'Présence apaisante'],
      party: 'Il dérive de pièce en pièce, capte les meilleures histoires, puis s’évapore sans laisser de trace.',
    },
    zombie: {
      name: 'Zombie',
      catch: 'Lent, régulier, et absolument imperturbable.',
      desc: 'Rien ne t’ébranle. Deadlines, drama, chaos — tu avances tranquillement à ton rythme et tu finis toujours par arriver. Tu fonctionnes aux snacks et aux siestes, et tu prouves que le calme absolu est un super-pouvoir. Tes amis adorent à quel point tu es facile à vivre ; tu dis oui à tout tant qu’il y a à manger. Juste, ne te réveille pas avant midi.',
      strengths: ['Calme imperturbable', 'Va avec le flow', 'Persévérance surprenante'],
      party: 'Sur le canapé, une assiette dans chaque main, en paix totale avec l’univers.',
    },
    mummy: {
      name: 'Momie',
      catch: 'Une âme ancienne enveloppée de couches douillettes.',
      desc: 'Tu adores ton chez-toi, tes habitudes et tes étagères parfaitement rangées. Tu gardes tout pendant des années — tickets de concert, vieilles photos, amitiés — et tu en prends grand soin. Certains disent que tu es old school ; toi, tu appelles ça intemporel. Sous toutes ces couches se cache un cœur chaleureux et loyal sur lequel on peut compter pendant des siècles.',
      strengths: ['Fiabilité à toute épreuve', 'Organisation impeccable', 'Amitiés qui durent toujours'],
      party: 'Enroulée dans un plaid près du feu, en train de raconter ses meilleures histoires du bon vieux temps.',
    },
    frank: {
      name: 'Monstre de Frankenstein',
      catch: 'Grand, tendre, et bâti avec du cœur.',
      desc: 'Tu peux sembler sérieux au premier abord, mais ceux qui te connaissent savent que tu es l’âme la plus gentille de la pièce. Tu es un bricoleur : tu répares, tu construis, et tu montres ton affection en agissant plutôt qu’en parlant. Parfois tu te sens un peu incompris, mais les amis qui te comprennent feraient n’importe quoi pour toi. C’est vivant… et c’est adorable.',
      strengths: ['Bricoleur hors pair', 'Cœur en or', 'Solide et fiable'],
      party: 'Il répare discrètement les guirlandes lumineuses, puis danse un slow maladroit quand la bonne chanson arrive.',
    },
    pumpkin: {
      name: 'Citrouille d’Halloween',
      catch: 'Sourire lumineux, bonne ambiance instantanée.',
      desc: 'Tu illumines chaque pièce — presque littéralement. Ton optimisme est contagieux, ton rire est sonore, et c’est souvent toi qui as organisé la soirée en premier lieu. Tu mets tout le monde à l’aise et tu n’oublies jamais un prénom. Même la nuit la plus sombre, tu trouves une raison de sourire, et tu aides les autres à en trouver une aussi.',
      strengths: ['Positivité contagieuse', 'Hôte-née', 'Met tout le monde à l’aise'],
      party: 'L’hôte, l’ambianceur, et la raison pour laquelle tout le monde est venu.',
    },
    blackcat: {
      name: 'Chat noir',
      catch: 'Mystérieux, indépendant, cool sans effort.',
      desc: 'Tu fais les choses à ta façon et tu as l’air cool sans même essayer. Tu es sélectif sur qui s’approche de toi, mais une fois que tu choisis quelqu’un, il a un ami pour ses neuf vies. Tu adores une bonne sieste, un coin tranquille et qu’on te laisse en paix — jusqu’à ce que, soudain, tu veuilles toute l’attention. Certains disent que tu portes malheur. Tes amis, eux, savent que tu es leur porte-bonheur.',
      strengths: ['Style sans effort', 'Instincts affûtés', 'Sélectif mais loyal'],
      party: 'Installé à la meilleure place de la maison, en train de juger tout le monde avec tendresse.',
    },
    reaper: {
      name: 'Faucheuse',
      catch: 'Calme, ponctuelle, et jamais en retard sur une deadline.',
      desc: 'Tu es le calme au milieu de la tempête de tout le monde. Pendant que les autres paniquent, toi tu vérifies le planning, tu fais un plan et tu t’en occupes — pile à l’heure, à chaque fois. Ton humour est tellement pince-sans-rire que les gens réalisent que tu plaisantais une heure plus tard. La capuche a l’air intimidante, mais c’est toi qui t’assures que tout le monde rentre bien chez soi.',
      strengths: ['Sang-froid sous pression', 'Timing parfait', 'Attentionnée en secret'],
      party: 'Elle regarde l’heure à 23 h 58, puis annonce très calmement la dernière chanson.',
    },
    fox: {
      name: 'Renard à neuf queues',
      catch: 'Un métamorphe avec un sourire pour chaque pièce.',
      desc: 'Tu t’intègres partout — le dîner chic, la soirée chaotique, la réunion de famille. Tu lis les gens instantanément et tu sais toujours quoi dire. Malin et joueur, tu adores un bon jeu et tu le gagnes presque toujours. Derrière tous ces visages charmants se cache quelqu’un d’une loyauté féroce envers les rares personnes qui ont vu tes vraies queues.',
      strengths: ['Lit l’ambiance instantanément', 'Répartie fulgurante', 'S’adapte à tout'],
      party: 'Il change de costume deux fois et devient meilleur ami avec la grand-mère de l’hôte, sans qu’on sache comment.',
    },
    skeleton: {
      name: 'Squelette',
      catch: 'L’os du rire ? T’en es rempli.',
      desc: 'Tu ne prends pas la vie trop au sérieux — et honnêtement, c’est ton secret. Tu balances des blagues aux pires moments, tu danses au moindre prétexte et tu peux remonter le moral de n’importe qui en trente secondes. Tu voyages léger et tu vis simplement : pas de drame, pas de chichis, juste de la bonne humeur. Les gens se sentent plus légers à tes côtés, comme s’ils avaient perdu quelques kilos de soucis.',
      strengths: ['Remonte le moral instantanément', 'Loufoque sans complexe', 'Zéro-drama qui fait du bien'],
      party: 'Il claque des os sur la piste de danse et lance une farandole que personne n’a demandée.',
    },
  },
};
