module.exports = {
  metaTitle: "On mange quoi ? Tirage au sort de repas : guide et astuces",
  description: "Comment fonctionne le tirage de repas façon machine à sous : choix du repas et de l’humeur, équité du hasard, idées pour la cantine, le couple et la famille.",
  h1: "On mange quoi aujourd’hui ? Laissez les rouleaux décider",
  updated: "2026-10-09",
  intro: "Peu de questions quotidiennes sont aussi fatigantes que « on mange quoi ? ». Ce guide explique comment fonctionne le tirage de plats, comment obtenir de meilleures réponses, pourquoi le résultat est vraiment aléatoire et comment l’utiliser entre collègues, amis ou en famille.",
  sections: [
    {
      h: "Comment fonctionne le tirage de plats",
      p: [
        "Vous commencez par choisir le repas concerné : petit-déjeuner, déjeuner, dîner ou en-cas de fin de soirée. Vous pouvez cocher une ou plusieurs humeurs, puis appuyer sur le bouton : les rouleaux de la machine à sous tournent environ deux secondes avant de s’arrêter sur un seul plat. Seul ce plat est affiché, ce qui évite de replonger dans une liste interminable.",
        "Derrière les rouleaux se trouve une liste de plats du quotidien que les gens mangent vraiment dans votre langue, chacun associé aux repas et aux humeurs qui lui conviennent. L’outil filtre la liste selon vos choix puis tire un résultat parmi ce qui reste. Si vous l’ouvrez le matin, il propose déjà le petit-déjeuner, et ainsi de suite selon l’heure locale."
      ],
      list: [
        "Choisissez le repas : petit-déjeuner, déjeuner, dîner ou fin de soirée.",
        "Cochez des humeurs : copieux, léger, épicé ou facile à manger seul. Avec plusieurs cases, un plat n’a besoin d’en remplir qu’une.",
        "Appuyez sur le bouton et attendez l’arrêt des rouleaux.",
        "Pas envie ? Retirez ce plat avec le bouton d’exclusion et relancez.",
        "Content du résultat ? Partagez-le ou allez manger."
      ]
    },
    {
      h: "Obtenir de meilleures réponses",
      p: [
        "Les humeurs sont le réglage le plus utile. Sans aucune case cochée, le tirage porte sur tous les plats du repas, idéal quand vous n’avez vraiment aucune préférence. Si vous voulez quelque chose de chaud et de consistant, cochez copieux et la liste se réduit aux plats adaptés. Comme un plat n’a besoin de correspondre qu’à une seule humeur cochée, en cocher deux ou trois élargit la liste au lieu de la vider.",
        "Le bouton d’exclusion est votre droit de veto, à utiliser honnêtement. Si les rouleaux s’arrêtent sur ce que vous avez mangé hier, écartez-le et relancez. Les plats exclus restent hors jeu jusqu’à ce que vous les remettiez ou rechargiez la page, donc quelques refus suffisent à resserrer le choix. Une bonne règle à plusieurs : un veto par personne, pour ne pas tourner indéfiniment.",
        "Voyez le résultat comme le début d’un plan, pas comme un ordre. Si le plat tiré est un plat de nouilles, vous décidez encore de l’adresse, de la taille et de l’accompagnement. Les rouleaux suppriment l’étape la plus difficile, celle de choisir une catégorie quand tout semble aussi bien."
      ]
    },
    {
      h: "Pourquoi choisir à manger est si fatigant",
      p: [
        "Quand toutes les options sont disponibles, en choisir une peut sembler plus pénible que n’importe quelle option ne le mérite. Les chercheurs qui étudient le choix ont décrit un phénomène souvent appelé surcharge de choix : plus vous comparez d’alternatives, plus vous craignez de rater la meilleure et moins vous êtes satisfait de ce que vous prenez. La nourriture est le piège idéal : la décision revient chaque jour, l’enjeu est faible mais les options sont infinies.",
        "Confier la première décision au hasard résout un problème différent de ce qu’on croit. Vous ne demandez pas à l’outil de connaître vos goûts. Vous remplacez une recherche épuisante par un tirage rapide, et vous observez votre propre réaction. Une petite pointe de déception vous apprend ce que vous vouliez vraiment, et vous pouvez écarter le plat. Un soulagement, et vous tenez votre déjeuner."
      ]
    },
    {
      h: "Le tirage est-il vraiment équitable ?",
      p: [
        "Oui. Le plat est choisi avec le générateur de nombres aléatoires cryptographique de votre navigateur, du même type que celui utilisé pour la sécurité, et il l’est avant que les rouleaux ne démarrent. La rotation n’est qu’un spectacle qui se termine sur le plat déjà tiré : ni le moment du clic, ni la vitesse, ni la chance avec l’animation ne peuvent influencer le résultat.",
        "Pour que chaque plat ait exactement la même probabilité, le tirage utilise une méthode appelée échantillonnage par rejet. Un raccourci courant, prendre un grand nombre aléatoire et en calculer le reste par la taille de la liste, peut favoriser légèrement certains plats quand la division ne tombe pas juste. L’échantillonnage par rejet écarte les quelques valeurs qui causent ce déséquilibre et recommence, de sorte que chaque plat compatible avec vos choix a la même chance."
      ]
    },
    {
      h: "L’utiliser à plusieurs",
      p: [
        "Au bureau, postez le résultat dans la conversation d’équipe et laissez les rouleaux trancher la dispute quotidienne. Un groupe accepte plus facilement une décision dont personne n’est responsable, et le hasard n’a pas de préférence. En couple, c’est une façon douce de sortir du fameux « ça m’est égal, et toi ? ». En famille, laissez un enfant appuyer sur le bouton après avoir convenu que l’on accepte la première réponse.",
        "Vous pouvez aussi en faire un petit jeu : choisissez le repas et les humeurs ensemble, puis pariez sur le résultat. Votre dernier repas et vos dernières humeurs sont mémorisés dans votre seul navigateur, si bien que l’écran s’ouvre avec vos réglages habituels, alors que les plats exclus sont oubliés dès que vous rechargez la page. Le résultat se partage en un court message pour que vos amis tentent le même tirage."
      ]
    }
  ],
  cta: "Tirer le repas du jour"
};
