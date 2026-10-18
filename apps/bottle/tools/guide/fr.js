module.exports = {
  metaTitle: 'Jeu de la bouteille : règles, tirage équitable, idées',
  description: 'Comment jouer au jeu de la bouteille en ligne comme outil convivial pour savoir qui commence : prénoms, cartes défis, pourquoi chaque place a la même chance, variantes et astuces.',
  h1: 'Le jeu de la bouteille en ligne : une façon équitable et conviviale de désigner qui joue',
  updated: '2026-10-19',
  intro: 'Le jeu de la bouteille, tout le monde le connaît : on s’assoit en cercle, quelqu’un fait tourner une bouteille au milieu et celui ou celle qu’elle montre est désigné. Cette appli garde ce moment simple mais le met sur votre téléphone, sans vraie bouteille ni table parfaitement plate. Vous posez le téléphone au milieu, tapez les prénoms des personnes autour et laissez la bouteille choisir. Pratique pour savoir qui commence, qui choisit la prochaine chanson ou qui débarrasse. Ce guide présente l’origine du jeu, la façon de jouer ici, des idées selon les groupes et la raison pour laquelle le résultat est vraiment équitable.',
  sections: [
    {
      h: 'D’où vient l’idée de faire tourner un objet pour choisir',
      p: [
        'Bien avant les applis, on faisait déjà tourner des objets pour laisser le hasard décider. L’Europe médiévale connaissait le toton, une petite toupie à faces gravées de lettres qui indiquaient au joueur quoi faire en tombant. Aujourd’hui encore, beaucoup d’enfants font tourner une toupie, une pièce ou un stylo pour savoir qui commence. Ces jeux de pointage plaisent pour une raison simple : tout le monde regarde l’objet ralentir, donc personne ne peut dire que c’était truqué.',
        'La version à la bouteille est devenue un classique des fêtes au vingtième siècle, tout simplement parce qu’une bouteille vide est toujours à portée de main et tourne bien sur une table. On s’en est servi pour toutes sortes de choses sans conséquence : qui raconte la prochaine histoire, qui répond à une question, qui lance la partie de cartes. Cette appli est pensée pour ce genre de jeu, comme un outil de décision sympa pour les soirées, les repas de famille, la classe et les soirées jeux.',
      ],
    },
    {
      h: 'Comment jouer avec l’appli',
      p: [
        'Il y a deux façons de jouer. Juste tourner ne demande aucune préparation : appuyez sur le bouton, la bouteille s’arrête dans une direction au hasard et tout le monde regarde où pointe le goulot. Avec prénoms est idéal quand le téléphone est posé au milieu d’une vraie table. Tapez de 2 à 12 prénoms, un par ligne, dans l’ordre où vous êtes assis, dans le sens des aiguilles d’une montre. Les prénoms se placent régulièrement autour de la table à l’écran, comme des chaises, et la bouteille s’arrête sur l’un d’eux.',
        'Lancez la bouteille avec le grand bouton ou en la touchant. Vous pouvez aussi la lancer d’un coup de doigt, ce qui ressemble davantage au vrai geste. Chaque lancer dure quelques secondes, fait plusieurs tours puis ralentit doucement. La personne désignée est mise en avant, le résultat s’affiche sous la table et un historique garde les dix derniers lancers pour que personne n’oublie qui est déjà passé.',
      ],
      list: [
        'Choisissez Juste tourner, ou Avec prénoms et tapez tout le monde dans l’ordre des places.',
        'Laissez Sans répétition activé si chacun doit passer avant que quelqu’un repasse.',
        'Activez si vous voulez la carte défi après chaque tour pour un petit défi sympa.',
        'Posez le téléphone à plat au milieu de la table, puis touchez ou lancez la bouteille.',
        'Annoncez le résultat, puis relancez ou commencez un nouveau tour.',
      ],
    },
    {
      h: 'Des idées selon les groupes',
      p: [
        'En soirée ou pour une fête d’Halloween, faites tourner pour savoir qui choisit la prochaine chanson, qui ouvre le défilé de déguisements ou qui commence le jeu de mime. Avec les cartes défis, la personne désignée reçoit un petit défi gentil, comme une imitation rapide ou un compliment pour son voisin. Les cartes sortent une par une, chaque lancer réserve donc une petite surprise. Si votre groupe a ses propres idées, choisissez Ma liste et écrivez un défi par ligne.',
        'À la maison, c’est une façon indolore de répartir les tâches : celui ou celle que la bouteille désigne vide le lave-vaisselle ou sort le chien. En classe, on peut choisir qui lit à voix haute ou quel groupe présente en premier, et Sans répétition garantit que chaque élève passe. Pour une soirée jeux de société, la bouteille décide qui commence ; en réunion, qui fait le premier point. La règle est simple : si une décision risque de finir en dispute sur l’équité, laissez la bouteille trancher.',
      ],
    },
    {
      h: 'Pourquoi le résultat est équitable',
      p: [
        'Une vraie bouteille sur une vraie table n’est pas parfaitement équitable : les irrégularités de la surface, la forme du verre et la façon de la lancer font pencher les chances. L’appli évite ce problème en décidant le résultat avant que quoi que ce soit bouge. Quand vous lancez, elle demande au générateur aléatoire cryptographique de votre navigateur, le même type de hasard que pour les clés de sécurité, de choisir une place. Elle utilise l’échantillonnage par rejet, qui supprime le léger biais des codes aléatoires simples : avec huit prénoms, chacun a exactement une chance sur huit.',
        'C’est seulement ensuite que l’animation démarre. L’appli calcule de combien la bouteille doit tourner pour s’arrêter dans la part de table de la personne choisie, ajoute quelques tours complets et un petit décalage aléatoire pour ne jamais s’arrêter exactement au même endroit, puis ralentit en douceur. La force de votre geste ne change que le sens de rotation, jamais la personne désignée. Avec Sans répétition, le choix se fait seulement parmi ceux qui ne sont pas encore passés dans le tour, toujours à chances égales. Vos prénoms ne quittent jamais votre appareil.',
      ],
    },
    {
      h: 'Astuces pour un bon lancer',
      p: [
        'Tapez les prénoms dans l’ordre réel des places pour que l’écran corresponde à la table : ainsi, le goulot pointe vraiment vers la bonne personne. Posez le téléphone bien à plat et montez la luminosité si la pièce est sombre. Pour les grands groupes, des prénoms courts ou des surnoms se lisent mieux autour de la table.',
        'Gardez des défis gentils et facultatifs. Tout le monde doit pouvoir passer son tour, et les meilleurs défis font rire toute la tablée au lieu de mettre une personne mal à l’aise. Pour rejouer plus tard avec le même groupe, utilisez Copier le lien avec ces prénoms après un lancer : le lien ouvre la même table, et les prénoms voyagent dans le lien, sans passer par un serveur. Et surtout, profitez du suspense quand la bouteille ralentit.',
      ],
    },
  ],
  cta: 'Faire tourner la bouteille',
};
