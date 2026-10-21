module.exports = {
  metaTitle: 'Course d’animaux : guide du tirage au sort en course',
  description: 'Comment utiliser la course d’animaux pour désigner un gagnant ou savoir qui paie les cafés : réglage des coureurs, pourquoi chaque prénom a la même chance, idées pour le bureau et les soirées, petite histoire du tirage au sort.',
  h1: 'Course d’animaux : laisser une course trancher, équitablement',
  updated: '2026-10-22',
  intro: 'Certaines décisions sont trop petites pour en débattre et trop gênantes pour les prendre seul : qui paie la prochaine tournée de cafés, qui présente en premier, qui mange la dernière part. La course d’animaux transforme ce moment en petit spectacle. Chaque personne reçoit un animal sur sa propre ligne, un compte à rebours démarre, puis les animaux filent vers l’arrivée avec des accélérations, des faux pas et des arrivées serrées. Quand la poussière retombe, on sait qui est premier et qui est dernier. Ce guide explique comment l’utiliser, pourquoi le résultat est vraiment aléatoire, des idées selon les groupes et un peu d’histoire.',
  sections: [
    {
      h: 'Comment utiliser la course',
      p: [
        'Choisissez d’abord ce que la course décide. Avec « Le 1er gagne », le premier animal à franchir la ligne l’emporte, idéal pour un lot, désigner un volontaire ou savoir qui commence une partie. Avec « Le dernier paie », le plus lent doit s’y coller : payer les cafés, laver les tasses ou chanter le prochain morceau au karaoké.',
        'Réglez ensuite le nombre de coureurs, de 2 à 10, et écrivez un prénom sur chaque ligne. Pressé ? Laissez des lignes vides, elles courent sous un nom par défaut comme Joueur 3. Lancez la course : après un compte à rebours de trois secondes, la course dure environ six à neuf secondes, puis l’ordre d’arrivée s’affiche, avec des médailles pour les trois premiers et la place décisive mise en avant.',
      ],
      list: [
        'Choisir un mode : le premier gagne, ou le dernier paie.',
        'Régler le nombre de coureurs et écrire un prénom par ligne.',
        'Lancer la course et suivre le compte à rebours.',
        'Lire l’ordre d’arrivée, puis relancer avec les mêmes prénoms ou les changer.',
        'Copier un lien avec les prénoms pour que vos amis lancent leur propre course.',
      ],
    },
    {
      h: 'Pourquoi chaque prénom a exactement la même chance',
      p: [
        'La course a l’air chaotique, mais ce n’est pas l’animation qui décide. Au moment où vous lancez, l’application tire tout l’ordre d’arrivée avec le générateur aléatoire cryptographique du navigateur, crypto.getRandomValues. Elle utilise un échantillonnage par rejet pour éviter le léger biais d’un simple calcul de reste, et un mélange de Fisher–Yates, la méthode classique pour mettre une liste dans un ordre aléatoire. Tous les ordres possibles ont la même probabilité.',
        'Ce n’est qu’ensuite que l’animation est préparée. Chaque ligne reçoit sa propre courbe de vitesse, avec des sprints et des faux pas, ajustée pour que les animaux franchissent la ligne exactement dans l’ordre déjà tiré. C’est pour cela que la tête de course change plusieurs fois et que l’arrivée se joue souvent à la photo-finish. L’animal n’est qu’une décoration : le lapin ne va pas plus vite que la tortue, et la ligne 1 n’a pas plus de chance que la ligne 10.',
      ],
    },
    {
      h: 'Idées pour le bureau, les soirées et la classe',
      p: [
        'Au travail, la course règle en douceur les corvées pour lesquelles personne ne se porte volontaire. Elle sert aussi à fixer l’ordre de passage d’une réunion ou à choisir qui décide du resto cette semaine. Tout le monde regarde le même écran, donc personne ne peut crier à la triche, et le compte à rebours transforme une décision ennuyeuse en pause de dix secondes.',
        'En soirée ou en famille, utilisez-la pour savoir qui commence au jeu de société, qui choisit la prochaine chanson ou qui raconte une blague. En classe, l’enseignant peut désigner l’ordre de passage ou le prochain lecteur sans toujours interroger les mêmes élèves.',
      ],
      list: [
        'Tournée de cafés ou de croissants : le dernier paie.',
        'Ordre de passage en réunion : une course, et on suit l’ordre d’arrivée.',
        'Soirée jeux : le gagnant choisit le prochain jeu.',
        'En classe : le premier répond à la question du jour.',
        'Tâches ménagères : le dernier sort les poubelles.',
      ],
    },
    {
      h: 'Petite histoire du tirage au sort et des courses',
      p: [
        'On a toujours cherché des moyens de laisser le hasard trancher équitablement. Le tirage au sort apparaît dans les textes anciens de nombreuses cultures, et la courte paille, le pile ou face ou les comptines comme « am stram gram » sont encore bien vivants. L’idée reste la même : le résultat ne doit pas dépendre de celui qui parle le plus fort.',
        'La course ajoute du suspense. Les petits chevaux de fête foraine, les jeux de course sur plateau et la fable du lièvre et de la tortue jouent tous avec le plaisir de suivre une épreuve incertaine. Cette application réunit les deux traditions : un tirage équitable fait à l’instant où vous lancez, et une course qui rend l’attente amusante.',
      ],
    },
    {
      h: 'Astuces pour une meilleure course',
      p: [
        'Mettez-vous d’accord sur le mode et l’enjeu avant de lancer, pour que le résultat soit accepté sans discussion. Gardez des prénoms courts pour qu’ils tiennent dans la ligne sur un téléphone, et posez l’écran là où tout le monde le voit, ou partagez-le en visio.',
      ],
      list: [
        'Annoncer à voix haute ce que signifie la première ou la dernière place.',
        'Utiliser des prénoms courts ou des surnoms sur petit écran.',
        'Pour plusieurs décisions d’affilée, relancer avec les mêmes prénoms.',
        'Les derniers résultats restent sur l’appareil : pratique pour savoir qui a payé la dernière fois.',
        'Si les animations vous gênent, le réglage « réduire les animations » du système affiche le résultat tout de suite.',
      ],
    },
  ],
  cta: 'Lancer une course d’animaux',
};
