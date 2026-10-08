module.exports = {
  metaTitle: "Jeu de l’échelle : guide de l’amidakuji et du tirage équitable",
  description: "Comment jouer à l’échelle en ligne (amidakuji), pourquoi chacun obtient un résultat différent et comment l’utiliser pour le déjeuner, le café ou les corvées.",
  h1: "Jeu de l’échelle : tirer au sort équitablement avec un amidakuji en ligne",
  updated: "2026-10-09",
  intro: "Le jeu de l’échelle est l’une des façons les plus simples et les plus satisfaisantes de trancher une petite décision. Chacun reçoit une ligne verticale, les résultats se cachent en bas, et un réseau de barreaux décide qui arrive où. Ce guide explique comment jouer en ligne, l’histoire du jeu, les maths qui le font fonctionner, des idées concrètes pour l’utiliser entre amis, collègues ou en famille, et comment se passent le partage et la confidentialité.",
  sections: [
    {
      h: "Comment fonctionne le jeu de l’échelle",
      p: [
        "Choisis d’abord le nombre de joueurs, de deux à dix. Écris un nom pour chaque joueur en haut et un résultat pour chaque case en bas. Un résultat peut être n’importe quoi : un restaurant, une corvée, un lot, ou simplement Gagnant et Sauvé. Si tu es pressé, les préréglages rapides remplissent des valeurs raisonnables pour le déjeuner, qui paie le café, les corvées ou l’ordre de passage, et le bouton Mélanger bat les résultats pour que personne ne sache quelle case correspond à quoi.",
        "Quand tu appuies sur « Construire l’échelle », l’outil trace des lignes verticales avec des barreaux horizontaux aléatoires entre elles. Touche un joueur et un marqueur coloré descend le long de sa ligne : chaque fois qu’il croise un barreau, il passe sur la ligne voisine et continue jusqu’en bas. Le résultat qui l’attend là est celui du joueur. Tu peux suivre les joueurs un par un pour le suspense, ou choisir « Tout révéler » pour voir le tableau entier d’un coup."
      ],
      list: [
        "Choisis le nombre de joueurs, de 2 à 10.",
        "Saisis les noms et les résultats, ou pars d’un préréglage et modifie-le.",
        "Utilise Mélanger si tu veux les résultats dans un ordre aléatoire.",
        "Appuie sur « Construire l’échelle » et touche un joueur pour suivre son chemin.",
        "Révèle les résultats un par un, ou tous à la fois."
      ]
    },
    {
      h: "D’où vient le jeu de l’échelle",
      p: [
        "Au Japon, le jeu s’appelle amidakuji. Son nom s’explique généralement par la ressemblance entre les lignes de l’échelle et les rayons de lumière dessinés autour de l’auréole du Bouddha Amida, et kuji désigne un tirage au sort. On trouve des dessins similaires de lignes et de barreaux dans d’autres pays : en Corée, le jeu s’appelle sadari tagi, littéralement « grimper à l’échelle », et dans les régions sinophones on parle souvent de « jambe de fantôme ».",
        "Une partie de son charme tient au fait qu’il se joue sur une simple feuille de papier. On trace les lignes verticales, on plie le bas pour cacher les résultats, chacun ajoute un barreau, puis on suit les chemins ensemble. Ce mélange d’effort partagé et de surprise explique pourquoi il est devenu un classique pour répartir les corvées, l’ordre et les petits lots à l’école et au bureau."
      ]
    },
    {
      h: "Pourquoi chaque joueur arrive ailleurs",
      p: [
        "L’idée clé est simple. Chaque barreau échange seulement les chemins de deux joueurs voisins, comme deux personnes qui changent de place dans une file. Les chemins ne fusionnent jamais et ne se séparent jamais : deux joueurs qui partent d’endroits différents ne peuvent donc pas finir au même endroit. En termes mathématiques, l’échelle produit toujours une permutation : chaque joueur reçoit exactement un résultat et chaque résultat va à exactement un joueur.",
        "Pour garder un dessin net et valide, cet outil ne place jamais deux barreaux côte à côte sur la même rangée, si bien qu’un chemin sait toujours dans quel sens aller. Une nouvelle disposition aléatoire est créée à chaque construction ou reconstruction, et le nombre de rangées augmente avec le nombre de joueurs pour que le mélange soit bien réparti. Le résultat ne peut pas se deviner à partir des seuls noms, car il dépend de barreaux qui n’existaient pas avant la génération de l’échelle."
      ]
    },
    {
      h: "Idées pour utiliser le jeu de l’échelle",
      p: [
        "Le jeu de l’échelle est idéal quand il faut un résultat par personne sans discussion. Comme chaque résultat est utilisé exactement une fois, il convient très bien pour répartir des tâches ou attribuer des places."
      ],
      list: [
        "Déjeuner au bureau : liste les restaurants, ajoute quelques collègues et laisse l’échelle choisir.",
        "Tournée de cafés : marque un résultat comme « Tu paies » et laisse les autres en « Sauvé ».",
        "Corvées : vaisselle, aspirateur, lessive et poubelles, une par personne, sans accusation de favoritisme.",
        "Ordre de passage : décide qui commence un jeu de société, un exposé ou une activité scolaire.",
        "Équipes et lots : utilise des noms d’équipes ou de lots comme résultats."
      ]
    },
    {
      h: "Conseils, partage et confidentialité",
      p: [
        "Pour un résultat auquel tout le monde fait confiance, saisis tous les noms et les résultats devant le groupe, appuie sur Mélanger, et seulement ensuite construis l’échelle. Si tu veux une deuxième manche avec les mêmes joueurs, choisis « Nouvelle échelle » : elle garde les noms et les résultats mais trace d’autres barreaux. Les noms sont limités à 12 caractères, donc les petits surnoms conviennent le mieux.",
        "Le lien de partage contient les noms, les résultats et la disposition : celui qui l’ouvre voit exactement la même échelle et peut suivre les mêmes chemins. Rien n’est enregistré sur nos serveurs, mais la dernière configuration est mémorisée dans ton propre navigateur pour la prochaine fois. Évite de saisir des informations personnelles sensibles dans les noms ou les résultats, car ils font partie du lien."
      ]
    }
  ],
  cta: "Jouer à l’échelle"
};
