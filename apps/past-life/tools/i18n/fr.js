/* Test de vie antérieure — français (/fr/)
 * Mêmes 16 ids de types et même ordre questions/choix que data.js (les pondérations ne vivent que là-bas).
 * Vouvoiement partout ; les rôles coréens sont expliqués en une incise (Le Joyau du palais, feuilletoniste avant l’heure, un peu Zorro un peu Columbo).
 * Typo française : espace insécable avant les deux-points et dans les guillemets, espace fine insécable avant ? ! ; et apostrophe typographique.
 * Les clés en Html sont insérées telles quelles (HTML brut), tout comme privacy.sections. Aucun spoiler dans meta/landing/og/faq.
 */
module.exports = {
  // Fonts: fontCss = extra stylesheets (omit → Pretendard), font = page font stack (omit → shared default)
  typography: {},

  meta: {
    title: 'Test vie antérieure : qui étais-je avant ?',
    description: 'Test vie antérieure gratuit : répondez à 12 questions sur votre quotidien et découvrez qui vous étiez dans une vie antérieure. Sans inscription, 2 minutes.',
    ogTitle: 'Test de vie antérieure — Qui étiez-vous dans une autre vie ?',
    ogDescription: 'Le quiz vie antérieure gratuit en 2 minutes : 12 questions du quotidien, 16 vies possibles. Et vous, qui étiez-vous ?',
  },
  siteName: 'Test de vie antérieure',
  landing: {
    badge: '🔮 Plus fun que votre horoscope',
    h1Kicker: 'Test de vie antérieure',
    h1Html: 'Qui étiez-vous<br><em>avant cette vie</em> ?',
    hookHtml: 'Douze questions. Deux minutes.<br>Et une vie oubliée refait surface.',
    metaTime: '⏱️ 2 minutes',
    metaResults: '📜 16 vies passées',
    start: 'Révéler ma vie antérieure →',
    backAria: 'Question précédente',
    loading: 'Dépoussiérage de vos souvenirs d’une autre vie…',
  },
  // Shown only inside the shared end screen (result pages) as an accordion. Plain text, spoiler-free.
  faq: [
    { q: 'Comment fonctionne ce test ?', a: 'Chacune de vos 12 réponses rapporte des points à quelques vies antérieures, et celle qui en totalise le plus est la vôtre. Toutes les langues du test utilisent exactement le même calcul.' },
    { q: 'Est-ce vraiment fiable ?', a: 'C’est un jeu, pas de la voyance : un miroir ludique de vos habitudes de tous les jours. Cela dit, beaucoup de gens se reconnaissent de façon troublante dans leur résultat.' },
    { q: 'Puis-je obtenir un autre résultat ?', a: 'Oui. Votre résultat dépend uniquement de vos réponses : répondez autrement, et vous pourriez découvrir une tout autre vie antérieure.' },
    { q: 'Mes réponses sont-elles enregistrées ?', a: 'Non. Vos réponses sont calculées directement dans votre navigateur, sans jamais être envoyées ni conservées. Aucune inscription n’est nécessaire.' },
  ],
  privacyLink: 'Politique de confidentialité',
  result: {
    title: 'Test vie antérieure : {name}',
    shareText: 'Ma vie antérieure : {name} {emoji} — « {tagline} ». Et vous, qui étiez-vous ?',
    ctaStrong: 'Un ami vous a envoyé sa vie antérieure',
    ctaSub: 'Et vous, qui étiez-vous ? Réponse en 2 minutes.',
    eyebrow: 'Dans une vie antérieure, vous étiez',
    adviceLabel: 'Conseil pour cette vie-ci —',
    good: 'Âme sœur d’antan',
    bad: 'Ennemi juré d’antan',
    retry: 'Refaire le test',
  },
  og: {
    eyebrow: 'Dans une vie antérieure, vous étiez',
    brand: '🔮 Test de vie antérieure',
    defaultTitle: 'Test de vie antérieure',
    defaultDesc: '12 questions, 2 minutes. Qui étiez-vous dans une vie antérieure ?',
  },
  privacy: {
    description: 'Politique de confidentialité du Test de vie antérieure : utilisation des cookies, de la publicité et des statistiques de fréquentation.',
    h1: 'Politique de confidentialité',
    introHtml: 'Le Test de vie antérieure (le « Service ») respecte votre vie privée et ne traite que le minimum d’informations nécessaire, comme décrit ci-dessous.',
    sections: [
      ['1. Informations collectées', 'Vous pouvez utiliser le Service sans inscription ni connexion. Vos réponses au test sont traitées uniquement dans votre navigateur et ne sont jamais enregistrées sur nos serveurs. Certaines informations peuvent toutefois être collectées automatiquement lors de votre utilisation du Service, comme décrit ci-dessous.'],
      ['2. Cookies et technologies similaires', 'Le Service peut utiliser des cookies pour afficher des publicités et comprendre la façon dont il est utilisé. Vous pouvez refuser ou supprimer les cookies dans les paramètres de votre navigateur ; certaines fonctionnalités risquent alors de ne pas fonctionner correctement.'],
      ['3. Publicité (Google AdSense)', 'Le Service affiche des publicités via Google AdSense. Google et ses partenaires peuvent utiliser des cookies pour diffuser des annonces en fonction de vos visites précédentes sur ce site et sur d’autres sites web. Pour en savoir plus et modifier vos préférences de personnalisation des annonces, rendez-vous dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener">paramètres des annonces Google</a>.'],
      ['4. Mesure d’audience (Google Analytics)', 'Le Service peut utiliser Google Analytics (GA4) pour connaître le nombre de visiteurs et les sources de trafic, afin de s’améliorer. Ces données servent uniquement à établir des statistiques et ne permettent pas de vous identifier personnellement.'],
      ['5. Contact', 'Pour toute question concernant cette politique de confidentialité, veuillez contacter l’exploitant du site.'],
      ['6. Date d’entrée en vigueur', 'Cette politique est en vigueur depuis le 1er janvier 2026.'],
    ],
    back: '← Retour au Test de vie antérieure',
  },

  types: {
    sura: {
      name: 'Chef des cuisines royales de Corée',
      tagline: 'D’une pincée de sel, vous décidiez de l’humeur du roi',
      story: 'Dans les cuisines royales de la Corée des Joseon (oui, celles du K-drama « Le Joyau du palais »), l’humeur du roi se décidait au bout de vos doigts. Plus que « trop salé ou trop fade ? », la vraie question était « pour qui est ce repas, au fond ? », et vous l’aviez toujours devinée avant tout le monde. Vous meniez des dizaines de servantes à la baguette, sans jamais livrer une seule de vos recettes. Perfectionniste jusqu’au bout des ongles, vous n’aviez qu’une fierté : servir chaque jour la plus belle table du royaume.',
      traits: ['Le goût comme l’ambiance : tout doit être parfait', 'Vous laissez parler les résultats, pas les ragots', 'Pour vos proches, vous ouvrez grand le garde-manger'],
      advice: 'Vous avez le droit d’avoir la main lourde sur le sel de temps en temps : tout le monde vous pardonnera.',
    },
    celadon: {
      name: 'Maître potier du céladon de Goryeo',
      tagline: 'Mille vases cuits, presque tous cassés par principe',
      story: 'Vous passiez des nuits blanches devant le four avec une seule idée en tête : retrouver le légendaire vert de jade du céladon de Goryeo, en Corée — une teinte si précieuse que les émissaires chinois en parlaient jusque dans leurs rapports. Au moindre écart de nuance, le marteau tombait sans hésitation, sous le regard inquiet d’apprentis qui ne comprenaient pas vraiment vos critères. Pour vous, un vase en céladon n’était pas de la vaisselle : c’était un morceau de ciel. Vos ratés dépassaient de loin vos réussites, mais l’histoire, elle, n’a retenu que vos chefs-d’œuvre.',
      traits: ['Exigence : élevée. Beaucoup trop élevée.', 'Lentement, mais toujours dans les règles de l’art', 'Une vraie tête de mule, en toute discrétion'],
      advice: 'S’arrêter au quatre-vingt-dix-neuvième essai, ça peut aussi être magnifique.',
    },
    hwarang: {
      name: 'Chevalier hwarang de Silla',
      tagline: 'Le physique et le talent d’un champion olympique, au VIe siècle',
      story: 'Au sommet du classement à l’épée comme dans les études — et populaire, en plus. Vous étiez l’as des hwarang, ces « chevaliers-fleurs » d’élite du royaume de Silla, dans l’ancienne Corée. Même en parcourant monts et rivières pour forger votre corps et votre esprit, vous aviez toujours, quelque part, un fan-club secret qui vous encourageait. L’honneur comptait plus que la vie, et gagner salement vous faisait plus honte que perdre. Sur le champ de bataille comme au marché, votre nom était sur toutes les lèvres.',
      traits: ['Vous finissez toujours au centre de l’attention', 'L’honneur et les principes, c’est sacré', 'Votre regard change dès qu’il y a de la compétition'],
      advice: 'S’amuser ensemble rapporte au moins autant que gagner.',
    },
    viking: {
      name: 'Navigateur viking',
      tagline: 'Pas sur la carte ? Raison de plus pour y aller',
      story: 'À la barre de votre drakkar, dans le brouillard de la mer du Nord, « dangereux » voulait dire « amusant ». Pour le frisson d’apercevoir une côte absente de toutes les cartes, une tempête ou deux, c’était donné. Vous poser ? Jamais : la prochaine traversée vous intriguait toujours plus. Votre équipage s’inquiétait, mais vous suivait quand même. Après tout, vous rentriez toujours en un seul morceau.',
      traits: ['Vos yeux s’illuminent devant la nouveauté', 'Étrangement calme en pleine tempête', 'Trop longtemps au même endroit, et la bougeotte vous prend'],
      advice: 'Parfois, vous pouvez jeter l’ancre et profiter vraiment de l’endroit où vous êtes.',
    },
    pharaoh_cat: {
      name: 'Le chat du pharaon',
      tagline: 'Un dieu vivant… qui passait ses journées à faire la sieste',
      story: 'Dans les palais de l’Égypte ancienne, vous étiez un chat vénéré comme une divinité. Vous faisiez quelque chose de particulier ? Non. Vous vous installiez simplement dans le meilleur rayon de soleil et regardiez les humains vous adorer d’eux-mêmes. Mais au moindre signe d’agacement de votre part, tout le palais paniquait — un détail dont personne n’aime parler. Vous aviez l’air de ne rien faire du tout, et pourtant votre simple présence suffisait à tout contrôler.',
      traits: ['Vous observez avec élégance et bougez le moins possible', 'Un seul regard, et l’ambiance change du tout au tout', 'Un génie pour échapper aux corvées'],
      advice: 'Même les dieux gagnent à se montrer en personne de temps en temps.',
    },
    renaissance: {
      name: 'Apprenti d’un peintre de la Renaissance',
      tagline: 'Flagrant délit de talent, entre deux pots de peinture',
      story: 'Dans un atelier de Florence, vous broyiez les pigments et laviez les pinceaux dans l’ombre d’un grand maître. Puis un jour, en son absence, vous avez complété un coin de l’arrière-plan… qui s’est révélé être la partie la plus naturelle de tout le tableau. Vous progressiez en silence, sans que personne ne s’en aperçoive, mais sûrement. Et au bout de votre pinceau se cachait un rêve : signer un jour une toile de votre propre nom.',
      traits: ['Un œil hors du commun pour les détails', 'Du talent en toute discrétion, sans tambour ni trompette', 'Trop de goût pour vous contenter du « ça ira »'],
      advice: 'Vous avez le niveau. Il est temps de signer de votre propre nom.',
    },
    jeongi: {
      name: 'Conteur vedette du vieux Séoul',
      tagline: 'Maître du « la suite au prochain épisode », 200 ans avant Netflix',
      story: 'Sur les marchés du vieux Séoul, les gens lâchaient tout dès que vous arriviez. Vous étiez un jeongisu, un conteur professionnel qui lisait à voix haute les romans à succès devant la foule : un feuilletoniste avant l’heure. Votre botte secrète ? Vous arrêter net au moment le plus palpitant, et attendre que les pièces pleuvent avant de reprendre. À vrai dire, la moitié de l’histoire était improvisée sur le moment, mais c’était si convaincant que personne ne s’en est jamais aperçu. Entre vos mains, même les ragots du voisinage devenaient une épopée.',
      traits: ['Un don pour enjoliver n’importe quelle histoire', 'Un sens du timing et de l’ambiance imparable', 'Vous savez rassembler les foules comme personne'],
      advice: 'Parfois, vous avez le droit de dévoiler la fin tout de suite.',
    },
    silkroad: {
      name: 'Caravanier de la Route de la soie',
      tagline: 'Chaque frontière franchie, c’étaient des amis en plus',
      story: 'Vous traversiez déserts et cols enneigés avec votre soie et vos épices, et les langues étrangères n’ont jamais été un obstacle : quelques gestes, un grand sourire, et l’affaire était conclue. Dans chaque oasis, un ami vous attendait, et ce réseau était votre plus grande richesse. Vous laissiez derrière vous des liens plutôt que des marchandises : une âme de globe-trotteur et un talent fou pour vous faire des amis.',
      traits: ['Vous vous faites des amis partout, en un rien de temps', 'Vous négociez serré sans jamais perdre le sourire', 'Une nouvelle culture ? Adoptée en un clin d’œil'],
      advice: 'Parfois, vous pouvez accepter un cadeau sans marchander.',
    },
    monk_scribe: {
      name: 'Moine copiste du Moyen Âge',
      tagline: 'Tout recopié à la chandelle, sans une seule coquille',
      story: 'Dans un monastère médiéval, vous passiez vos journées à recopier les Écritures sur parchemin. Concentration totale, pas un regard de côté… et pourtant, dans les marges, vous glissiez en secret de petits dessins absurdes. Là où d’autres ne voyaient qu’une répétition sans fin, vous aviez trouvé votre rythme et votre calme. (Histoire vraie : les manuscrits médiévaux regorgent de gribouillis, comme des chevaliers aux prises avec des escargots géants.)',
      traits: ['Quand vous vous concentrez, le monde disparaît', 'Silence à l’extérieur, fou rire à l’intérieur', 'Impossible de laisser passer la moindre erreur'],
      advice: 'Refermez le livre et allez prendre l’air : le monde ne va pas s’écrouler.',
    },
    pirate_cook: {
      name: 'Cuistot d’un navire pirate',
      tagline: 'Pas une seule épée tirée, et pourtant maître à bord',
      story: 'Pas un seul combat à votre actif, et pourtant, sur ce navire, votre parole faisait loi : personne ne voulait risquer le menu du soir, alors même les pirates les plus rudes se tenaient à carreau devant vous. Vous étiez la seule âme douce parmi ces loups de mer endurcis, et les mauvais jours, ils venaient traîner à la cambuse pour se faire réconforter. Brut de décoffrage, mais personne ne savait mieux que vous prendre soin des autres : le vrai pouvoir derrière le capitaine.',
      traits: ['L’affection, vous la montrez en actes… et en petits plats', 'À l’aise même dans les milieux les plus rudes', 'Un cœur tendre et attentionné, contre toute attente'],
      advice: 'Arrêtez de ne vous occuper que des autres : laissez quelqu’un prendre soin de vous.',
    },
    amhaeng: {
      name: 'Inspecteur incognito du roi de Joseon',
      tagline: 'L’insigne du roi, caché sous des haillons de mendiant',
      story: 'Vous traîniez vos haillons dans les marchés, mais dans votre manche se cachait le mapae, un médaillon royal gravé de chevaux qui prouvait que vous étiez l’inspecteur secret du roi, chargé de démasquer les fonctionnaires corrompus. Trois phrases d’un magistrat véreux, et vous flairiez le mensonge ; au moment décisif, vous révéliez votre véritable identité et renversiez la situation — un peu Zorro, un peu Columbo. Voir la vérité quand tout le monde se laissait berner par les apparences : voilà le frisson. Sans autre arme que votre sens de la justice, vous sillonniez incognito tout le royaume de Joseon.',
      traits: ['Vous détectez les mensonges avec une précision redoutable', 'Vous voyez toujours au-delà des apparences', 'Quand vous avez raison, vous allez jusqu’au bout'],
      advice: 'Tout le monde ne cache pas quelque chose : parfois, faites simplement confiance.',
    },
    gladiator: {
      name: 'Gladiateur romain',
      tagline: 'Star du Colisée… avec une peur bleue en coulisses',
      story: 'Dès que vous entriez dans le Colisée, la foule scandait votre nom. Derrière ce visage charismatique, vos genoux tremblaient à chaque fois — mais personne ne l’a jamais remarqué. « Encore une victoire, et je raccroche le glaive pour ouvrir une petite taverne », vous répétiez-vous… avant de reprendre l’épée. La peur au ventre, et pourtant toujours de retour dans l’arène : une star au charme vraiment inattendu.',
      traits: ['Vous cachez votre trac comme un pro', 'Sur scène, votre présence explose', 'En secret, vous chérissez de petits rêves tout simples'],
      advice: 'Avouer que vous avez peur ne vous fera rien perdre du respect des autres.',
    },
    teahouse: {
      name: 'Patron d’une maison de thé sous les Qing',
      tagline: 'Un seul regard suffisait pour deviner les soucis de chacun',
      story: 'Au fond d’une ruelle de la Chine des Qing, votre maison de thé ne désemplissait jamais. Plus célèbre encore que votre thé : votre intuition. Dès qu’un client s’asseyait, vous deviniez déjà comment s’était passée sa journée. Rumeurs, confidences, conseils de vie : tout commençait ici. Vous ne forciez jamais rien ; vous serviez simplement une tasse, et les gens se sentaient déjà mieux.',
      traits: ['Vous sentez l’ambiance d’une pièce en quelques secondes', 'Toujours calme, sans jamais vous presser', 'Les gens se confient à vous tout naturellement'],
      advice: 'Pour une fois, laissez les soucis des autres de côté et parlez des vôtres.',
    },
    ninja_mailman: {
      name: 'Ninja d’Edo (en réalité facteur)',
      tagline: 'Insaisissable comme une ombre, et pas une lettre égarée',
      story: 'Vous aviez suivi un entraînement de ninja des plus rigoureux… pour livrer du courrier en secret. Bondir sur les toits, escalader les murs : tout ce talent servait à livrer avec précision, et jamais en retard. On vous imaginait en mission périlleuse ; votre fierté, c’était le courrier à l’heure (un vrai super-pouvoir, quand on y pense). Au fond, la personne la plus fiable du coin, c’était vous.',
      traits: ['Toujours un travail précis et impeccable', 'Vous gagnez le respect par la constance, pas l’esbroufe', 'Un sens de l’humour discret et inattendu'],
      advice: 'Arrêtez de cacher vos talents : vous avez le droit de frimer un peu.',
    },
    atlantis: {
      name: 'Gardien du phare de l’Atlantide',
      tagline: 'La ville sombrait, mais votre phare brillait toujours',
      story: 'Dans la légendaire Atlantide, la nuit où les vagues ne cessaient de monter, vous avez gardé le phare allumé. Dans la terreur d’une ville qui sombrait, vous étiez la seule personne à garder son calme et à tenir son poste. Grâce à vous, les derniers navires ont quitté le port sains et saufs. Rien de spectaculaire — mais le genre de présence dont quelqu’un, quelque part, a absolument besoin.',
      traits: ['Plus la crise est grave, plus vous êtes calme', 'Vous avez la force tranquille de ceux qui tiennent bon', 'Vous réfléchissez bien plus que vous ne le laissez paraître'],
      advice: 'Vous avez le droit, parfois, de vous appuyer sur la lumière de quelqu’un d’autre.',
    },
    balhae: {
      name: 'Archer à cheval de Balhae',
      tagline: 'Jamais une flèche à côté, même au grand galop',
      story: 'Vous fendiez les vents glacés du Nord, aux confins de Balhae, un ancien royaume de Mandchourie, et votre arc ne tremblait jamais. D’innombrables heures d’entraînement pour un seul instant : toucher la cible en plein centre, du haut d’un cheval lancé à pleine vitesse. Fidèle à votre unité avant tout, vous chevauchiez toujours en tête, et vos compagnons vous suivaient sans hésiter. La vitesse et la précision à la fois : une combinaison rare.',
      traits: ['Une précision intacte, même quand tout s’accélère', 'Une loyauté à toute épreuve envers votre équipe', 'Un objectif en vue ? Vous foncez droit dessus'],
      advice: 'De temps en temps, vous pouvez chevaucher juste pour le plaisir, sans cible en vue.',
    },
  },

  questions: [
    {
      q: 'Lors d’une soirée entre amis, vous êtes plutôt du genre à…',
      choices: [
        'Choisir d’abord ce que tout le monde va manger. Le menu fait l’ambiance.',
        'Observer tranquillement la scène depuis un coin.',
        'Devenir tout naturellement l’âme de la soirée.',
        'Guetter les nouveaux endroits et les nouvelles têtes.',
      ],
    },
    {
      q: 'Un imprévu vous tombe dessus. Que faites-vous ?',
      choices: [
        'Vous bâillez d’abord. Quelqu’un finira bien par s’en occuper.',
        'Vous creusez tranquillement dans votre coin jusqu’à trouver la cause.',
        'Vous en faites une histoire hilarante à raconter plus tard.',
      ],
    },
    {
      q: 'Vous organisez un voyage. Votre priorité ?',
      choices: [
        'Cocher le plus de pays possible, façon collection de tampons.',
        'Sympathiser avec les gens du coin.',
        'Tracer tout l’itinéraire en fonction de ce qu’on va manger.',
      ],
    },
    {
      q: 'Un ami vous confie avoir été traité injustement. Votre réaction ?',
      choices: [
        'Vous dites : « Bon, rassemblons d’abord des preuves. »',
        'Vous passez à l’action et allez vérifier sur-le-champ.',
        'Vous le faites asseoir, préparez un thé et l’écoutez.',
        'Vous l’aidez discrètement, en coulisses.',
      ],
    },
    {
      q: 'L’échéance approche et vous n’avez toujours aucune idée. Que faites-vous ?',
      choices: [
        'Vous éteignez la lumière, vous rêvassez… et soudain, l’idée tombe.',
        'Vous enchaînez les brouillons rapides et gardez le meilleur.',
        'Vous réunissez d’abord toutes les références, à la perfection.',
      ],
    },
    {
      q: 'En shopping, vous êtes du genre à…',
      choices: [
        'Revenir encore et encore jusqu’à trouver la perle rare.',
        'Acheter tout de suite. Les regrets, ce sera pour plus tard.',
      ],
    },
    {
      q: 'Votre rôle dans un projet de groupe ?',
      choices: [
        'Fixer le cap et entraîner tout le monde.',
        'Boucler votre partie à la perfection, sans faire de bruit.',
        'Soigner les détails et la touche finale.',
      ],
    },
    {
      q: 'Si vous postiez quelque chose sur les réseaux sociaux, ce serait…',
      choices: [
        'Un selfie vraiment réussi.',
        'Des anecdotes sur les gens fascinants rencontrés en voyage.',
        'Une phrase piochée dans le livre du jour.',
        'La photo du plat que vous venez de cuisiner.',
      ],
    },
    {
      q: 'Quelqu’un vient vous demander conseil. Votre réflexe ?',
      choices: [
        'Vous commencez par mettre les faits à plat.',
        'Vous vous indignez à ses côtés.',
        'Vous écoutez calmement et apportez du réconfort.',
      ],
    },
    {
      q: 'Pour apprendre quelque chose de nouveau, votre méthode, c’est…',
      choices: [
        'Suivre le mode d’emploi étape par étape, sans erreur.',
        'Observer d’abord en silence et comprendre par vous-même.',
        'Vous lancer directement et apprendre sur le tas.',
      ],
    },
    {
      q: 'Vous allez être en retard à un rendez-vous. Votre plan ?',
      choices: [
        'Tant qu’à être en retard, vous arrivez tranquillement et commencez par vous installer.',
        'Vous calculez l’itinéraire au millimètre pour arriver pile au bon moment.',
        'Vous arrivez en retard, mais vous faites une entrée remarquée.',
        'Vous en profitez pour tester un tout nouvel itinéraire.',
      ],
    },
    {
      q: 'Résumez votre journée en une phrase :',
      choices: [
        'Toutes les corvées esquivées. Journée parfaite.',
        'Un peu de beauté trouvée dans une toute petite chose.',
        'Vous n’allez pas croire ce qui s’est passé aujourd’hui.',
      ],
    },
  ],
};
