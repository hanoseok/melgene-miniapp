module.exports = {
  metaTitle: 'Guide du tirage du loto : animer un loto, 75 ou 90 boules',
  description: 'Comment animer un loto ou un bingo avec un boulier en ligne : réglages 75 boules, 90 boules ou plage libre, conseils pour les soirées d’entreprise et de famille, et principe d’un tirage équitable.',
  h1: 'Animer le loto d’une soirée avec un boulier en ligne',
  updated: '2026-11-07',
  intro: 'Le loto fait partie des rares jeux qui réunissent tous les âges à la même table. Grands-parents, enfants et collègues qui se connaissent à peine peuvent jouer ensemble, car la règle tient en une phrase : on couvre les numéros annoncés et on crie quand une ligne ou un carton entier est rempli. Il ne manque qu’une personne pour tirer les numéros, et c’est le rôle de cette appli. Elle remplace le boulier, les boules et la feuille de suivi par un seul écran qui affiche un grand numéro, les derniers tirages et tous les numéros déjà sortis. Ce guide explique comment l’utiliser, la différence entre bingo 75 boules et loto 90 boules, comment animer une partie fluide en fin d’année et pourquoi le tirage est équitable.',
  sections: [
    {
      h: 'Comment utiliser ce boulier en ligne',
      p: [
        'Choisissez d’abord le jeu qui correspond à vos cartons. Bingo 75 boules pour les cartons à cinq colonnes B, I, N, G et O, loto 90 boules pour les cartons numérotés de 1 à 90, ou Plage au choix pour saisir vous-même le premier et le dernier numéro. Une plage de 1 à 30 convient bien aux jeunes enfants, et une plage adaptée à des cartons faits maison sert pour une kermesse ou un club. Appuyez ensuite sur le bouton de départ.',
        'Sur l’écran de tirage, appuyez sur le bouton pour tirer un numéro. La boule roule un instant puis s’arrête sur le nouveau numéro, affiché en très grand, avec sa lettre au bingo 75 boules. Les cinq numéros précédents sont juste en dessous et la grille du bas allume chaque numéro sorti, pour que les retardataires vérifient d’un coup d’œil. En cas d’erreur, Annuler remet le dernier numéro. Quand quelqu’un crie « Quine !», vérifiez son carton sur la grille, puis continuez ou appuyez sur Terminer pour voir le bilan.',
      ],
      list: [
        'Choisissez 75 boules, 90 boules ou Plage au choix.',
        'Tirez chaque numéro à la main ou activez le tirage auto.',
        'Vérifiez les cartons gagnants sur la grille des numéros sortis.',
        'Utilisez Annuler si un numéro a été tiré par erreur.',
        'Appuyez sur Terminer pour voir le nombre de numéros tirés et la durée.',
      ],
    },
    {
      h: 'Bingo 75 boules ou loto 90 boules : quelle différence ?',
      p: [
        'Le bingo 75 boules est la version la plus connue en Amérique du Nord, au Japon, en Corée et au Brésil. Chaque carton est une grille de cinq sur cinq dont les colonnes s’appellent B, I, N, G et O. Chaque lettre couvre quinze numéros : B de 1 à 15, I de 16 à 30, N de 31 à 45, G de 46 à 60 et O de 61 à 75, avec souvent une case libre au centre. La lettre indique la colonne à regarder, d’où les annonces du type « B 7 » ou « O 64 », et c’est pour cela que l’appli affiche la lettre sur la boule.',
        'Le loto 90 boules est le jeu traditionnel en France et au Royaume-Uni, proche de la tombola italienne et du loto russe. Les cartons comptent trois lignes de cinq numéros sur neuf colonnes, et l’on gagne en général par étapes : une ligne (la quine), deux lignes, puis le carton plein. Avec davantage de numéros, la partie dure un peu plus longtemps. Si vos cartons ont un autre format, la plage au choix adapte le boulier à vos cartons.',
      ],
    },
    {
      h: 'Conseils pour animer un loto de fin d’année',
      p: [
        'Un loto de fin d’année au bureau, en famille ou à l’école se passe mieux si l’animateur prépare quelques points à l’avance. Fixez les lots et les combinaisons gagnantes avant de commencer et annoncez-les clairement : les disputes du genre « la diagonale compte-t-elle ?» sont ce qui casse le plus vite l’ambiance. Gardez un rythme régulier ; un numéro toutes les cinq secondes environ reste vivant sans perdre personne.',
      ],
      list: [
        'Distribuez les cartons avant le premier tirage et gardez-en quelques-uns en réserve.',
        'Annoncez clairement les combinaisons gagnantes et les lots au départ.',
        'Affichez l’écran de tirage sur une télé ou un vidéoprojecteur.',
        'Tirage auto à 5 ou 8 secondes pour tous les âges, 3 secondes pour les parties rapides.',
        'Vérifiez chaque carton gagnant sur la grille avant de remettre un lot.',
        'Prévoyez de petits lots de consolation pour garder toute la salle dans le jeu.',
      ],
    },
    {
      h: 'Le tirage est-il vraiment aléatoire et équitable ?',
      p: [
        'À chaque tirage, l’appli regarde les numéros qui ne sont pas encore sortis et en choisit un avec le générateur aléatoire cryptographique du navigateur, le même type de hasard que pour les clés de sécurité. Elle applique aussi l’échantillonnage par rejet, qui écarte les rares valeurs qui rendraient certains numéros un peu plus probables. Ainsi, chaque numéro restant a exactement la même chance à chaque tirage, et un numéro déjà sorti ne peut jamais revenir dans la même partie. En tirant tout, on obtient chaque numéro une seule fois, dans un ordre mélangé.',
        'L’appli ne fixe pas l’ordre à l’avance : aucune liste cachée sur l’appareil ne peut être consultée. La courte animation de la boule n’est qu’un effet visuel ; le numéro est choisi d’abord et l’animation ne change jamais le résultat. Si vous avez activé la réduction des animations, le numéro apparaît directement.',
      ],
    },
    {
      h: 'Sur grand écran et autres fonctions pratiques',
      p: [
        'Pour une salle pleine, ouvrez l’appli sur un ordinateur relié à une télé ou un vidéoprojecteur et utilisez le bouton plein écran, qui masque les barres du navigateur et le bandeau du site et agrandit encore la boule. La partie est enregistrée sur l’appareil au fil du jeu : un rechargement accidentel ou un onglet fermé ne fait pas perdre les numéros sortis. La lecture vocale annonce chaque numéro si l’appareil dispose d’une voix française, et l’option son joue un petit carillon ; les deux sont désactivées au départ. Un clavier ou une télécommande de présentation fonctionne aussi : espace, Entrée, flèche droite et Page suivante tirent le numéro suivant.',
      ],
    },
  ],
  cta: 'Lancer le tirage du loto',
};
