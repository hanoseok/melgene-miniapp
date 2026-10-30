module.exports = {
  metaTitle: 'Tableau de tournoi : exempts, têtes de série et tirage équitable',
  description: 'Comment fonctionne un tableau à élimination directe, ce que sont les exempts et les têtes de série, comment l’utiliser en soirée jeux, au bureau, en sport ou pour un « tu préfères », et pourquoi le tirage au sort est équitable.',
  h1: 'Tableau de tournoi : élimination directe, exempts et têtes de série',
  updated: '2026-10-30',
  intro: 'Un tableau de tournoi est le moyen le plus simple de transformer une longue liste en un seul vainqueur. Deux participants s’affrontent, l’un passe, et le tableau est divisé par deux à chaque tour jusqu’au champion. Ce guide explique comment se construit un tableau à élimination directe, pourquoi certains participants sont exempts, ce que veut dire tête de série, comment s’en servir pour une soirée jeux, un concours au bureau, du sport ou un duel de préférences, et pourquoi un vrai tirage au sort est le point de départ le plus équitable.',
  sections: [
    {
      h: 'Comment fonctionne l’élimination directe',
      p: [
        'En élimination directe, chaque match a un gagnant et un perdant, et le perdant est éliminé. Avec 8 participants, on joue 4 quarts de finale, 2 demi-finales et 1 finale. Une règle simple en découle : chaque match élimine exactement un participant, donc un tableau de n participants demande toujours n − 1 matchs pour désigner le vainqueur. Seize participants, 15 matchs ; 64 participants, 63 matchs.',
        'Les noms des tours se comptent depuis la fin : la finale avec 2 participants, les demi-finales avec 4, les quarts avec 8, puis les huitièmes et seizièmes de finale. Dans cette appli, tu peux choisir les gagnants toi-même, deux cartes à la fois, ou simplement tirer le tableau et toucher les gagnants plus tard, au fil des vrais matchs.',
      ],
      list: [
        'Entre de 2 à 64 noms ou choix, un par ligne.',
        'Choisis le tirage au sort ou garde ton ordre comme têtes de série.',
        'Désigne les gagnants duel par duel, ou tire juste le tableau.',
        'Annule un choix ou touche un autre nom si tu changes d’avis.',
        'Enregistre le tableau en PNG, copie-le en texte ou partage un lien.',
      ],
    },
    {
      h: 'Les exempts : quand le compte ne tombe pas juste',
      p: [
        'Un tableau ne se divise proprement en deux que si le nombre de places est une puissance de deux : 2, 4, 8, 16, 32 ou 64. Les vrais groupes le sont rarement. Avec 6 joueurs, le tableau garde 8 places, donc deux restent vides. Ceux qui tombent face à une place vide sont exempts : ils passent au tour suivant sans jouer.',
        'Les exempts doivent être répartis, pas regroupés. Un bon tableau ne met jamais deux places vides l’une contre l’autre et partage les exempts aussi équitablement que possible entre la moitié haute et la moitié basse, pour qu’aucun côté n’ait un chemin plus facile. L’appli place les exempts selon le schéma classique des têtes de série, qui fait exactement cela, et ne compte jamais un exempt comme un match.',
      ],
    },
    {
      h: 'Têtes de série : tirage au sort ou ton propre ordre',
      p: [
        'Les têtes de série déterminent où chacun commence. En sport, on classe les participants pour que les plus forts se croisent le plus tard possible : la tête de série n° 1 affronte d’abord la plus faible, la n° 2 est placée dans l’autre moitié, et ainsi de suite. Si tu gardes ton ordre dans l’appli, ta liste devient le classement : la première ligne est la n° 1, la deuxième la n° 2, et les meilleures reçoivent les exempts en premier.',
        'Quand personne ne doit être avantagé, choisis le tirage au sort. C’est idéal pour une soirée entre amis, une tombola, une liste de desserts ou de films, ou tout groupe où l’on ne veut pas être accusé d’avoir arrangé les affiches.',
      ],
    },
    {
      h: 'Pourquoi le tirage au sort est équitable',
      p: [
        'Un tirage n’est équitable que si chaque ordre possible a la même probabilité. Beaucoup d’outils rapides mélangent avec un aléa faible ou une astuce de tri qui favorise discrètement certaines places. Cette appli utilise le générateur aléatoire cryptographique du navigateur et un mélange de Fisher–Yates avec échantillonnage par rejet, ce qui supprime le petit biais qui apparaît quand on ramène un nombre aléatoire dans un intervalle plus petit. Résultat : chaque disposition de ta liste a exactement la même chance, et personne, pas même la personne qui tient le téléphone, ne choisit les affiches.',
        'L’équité, c’est aussi un tableau toujours cohérent. Si tu changes un gagnant dans un tour précédent, tous les résultats suivants qui en dépendaient sont effacés : un nom ne peut jamais apparaître dans un tour qu’il n’a pas atteint.',
      ],
    },
    {
      h: 'Idées : soirée jeux, bureau, sport et duels de préférences',
      p: [
        'Pour une soirée jeux, mets le nom de tout le monde, tire le tableau et jouez de vrais matchs de ping-pong, de jeu vidéo ou de pierre-feuille-ciseaux en touchant chaque gagnant. Au bureau, un tableau permet de voter sans prise de tête pour le resto d’équipe, le nom d’un projet ou la plus belle tasse de la cuisine. Les clubs peuvent tirer une petite coupe à élimination directe, enregistrer l’image et la poster dans le groupe.',
        'En Corée, ce format est célèbre sous le nom de « coupe du monde de l’idéal » : on choisit son préféré entre deux, tour après tour, jusqu’au dernier. Essaie avec des plats, des chansons, des destinations ou tout ce qui te fait hésiter. Le choix final surprend souvent, et c’est la moitié du plaisir. À la fin, partage le lien pour montrer à tes amis tout ton parcours jusqu’au champion.',
      ],
    },
  ],
  cta: 'Créer un tableau de tournoi',
};
