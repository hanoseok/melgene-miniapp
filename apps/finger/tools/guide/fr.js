module.exports = {
  metaTitle: 'Tirage au doigt : choisir au hasard avec les doigts',
  description: 'Comment utiliser le tirage au doigt sur un seul téléphone : un ou plusieurs gagnants, équipes équilibrées, pourquoi le tirage est équitable, idées de jeux et conseils.',
  h1: 'Tirage au doigt : choisir au hasard avec les doigts de tout le monde',
  updated: '2026-11-01',
  intro: 'Le tirage au doigt règle les petits désaccords en quelques secondes. On pose le téléphone au milieu de la table, chacun appuie un doigt sur l’écran, et après une courte pause l’appli en éclaire un. Pas de prénoms à écrire, pas de papiers à plier, pas de chapeau à tenir. Ce guide explique comment s’en servir, les trois modes, pourquoi le choix est vraiment équitable, et quelques idées pour les apéros, les classes et les repas de famille.',
  sections: [
    {
      h: 'Comment ça marche',
      p: [
        'Sur l’écran d’accueil, choisis ce que l’appli doit décider : Un gagnant désigne un seul doigt, Plusieurs gagnants en désigne deux ou plus d’un coup (pratique pour trouver quelques volontaires), et Équipes répartit tout le monde en deux, trois ou quatre équipes de couleur de taille quasi identique. Ouvre ensuite le pad.',
        'Maintenant, tout le monde pose un doigt sur l’écran en même temps. Chaque doigt reçoit son propre cercle lumineux, d’une couleur différente. Quand il y a assez de doigts, les cercles se mettent à pulser et un anneau se remplit. Ne bougez plus : si quelqu’un ajoute ou retire un doigt, le compte à rebours repart de zéro. Quand l’anneau est plein, le pad tranche. Les autres cercles s’estompent, le cercle choisi grossit et le téléphone vibre brièvement s’il en est capable.',
      ],
      list: [
        'Choisis 1 gagnant, plusieurs gagnants ou des équipes.',
        'Ouvre le pad et pose le téléphone sur une surface plane.',
        'Chacun appuie un doigt sur l’écran.',
        'Restez immobiles jusqu’à ce que l’anneau soit plein.',
        'Le cercle lumineux, ou les cercles de chaque couleur d’équipe, donnent le résultat.',
      ],
    },
    {
      h: 'Sur ordinateur ou écran à un seul toucher',
      p: [
        'Tous les écrans ne détectent pas plusieurs doigts à la fois. Un ordinateur portable ou fixe n’a en général qu’une souris, et certains téléphones et tablettes ne suivent que quelques contacts. Dans ce cas, l’appli passe en mode clic : un clic par joueur pour poser un point de couleur, un nouveau clic sur un point pour l’enlever si tu t’es trompé, puis Go quand tout le monde est inscrit. Le tirage se déroule ensuite exactement comme avec les doigts.',
        'Le mode clic est aussi pratique pour les grands groupes. La plupart des téléphones suivent environ cinq doigts en même temps, et le pad en accepte jusqu’à dix. S’il y a plus de monde que l’écran ne peut en sentir, installez-vous autour d’une tablette, utilisez le mode clic sur un ordinateur, ou faites deux manches et opposez les deux vainqueurs.',
      ],
    },
    {
      h: 'Pourquoi le tirage est équitable',
      p: [
        'L’appli ne décide rien à l’avance. C’est seulement au moment où l’anneau se remplit qu’elle regarde les doigts présents à l’écran et tire au sort parmi eux avec le générateur aléatoire cryptographique de ton navigateur, crypto.getRandomValues. Elle utilise un échantillonnage par rejet, qui écarte les rares valeurs brutes qui avantageraient légèrement certaines positions : chaque doigt a donc exactement la même chance. L’endroit où tu poses le doigt, le moment où tu es arrivé et ta couleur n’y changent rien.',
        'Les équipes s’appuient sur la même source. Tous les doigts sont mélangés, puis distribués un par un dans les équipes, en partant d’une équipe tirée au hasard. Les effectifs ne diffèrent donc jamais de plus d’une personne, et chacun a la même chance de tomber dans n’importe quelle équipe. Comme le compte à rebours repart dès qu’un doigt est ajouté ou retiré, personne ne peut attendre de voir ce qui se passe pour entrer ou sortir à la dernière seconde.',
      ],
    },
    {
      h: 'Idées pour les soirées et le quotidien',
      p: [
        'Le tirage au doigt est parfait dès qu’un groupe veut une décision rapide et neutre. Mettez-vous d’accord sur la signification du résultat avant que quiconque touche l’écran, pour qu’il soit accepté en riant plutôt qu’après un débat.',
      ],
      list: [
        'Qui paie les cafés ou la tournée cette fois-ci.',
        'Qui commence à un jeu de société ou de cartes.',
        'Qui fait la vaisselle, sort les poubelles ou promène le chien.',
        'Qui répond à la prochaine question d’un quiz ou d’un action ou vérité.',
        'Former les équipes pour un blind test, un mime, un foot ou une pétanque entre amis.',
        'Choisir deux volontaires en classe avec le mode plusieurs gagnants.',
      ],
    },
    {
      h: 'Conseils pour une partie sans accroc',
      p: [
        'Pose le téléphone à plat sur une table plutôt que dans la main, pour que personne ne touche l’écran avec un pouce sans le vouloir. Demande à chacun de n’utiliser qu’un seul doigt et de le garder en contact : glisser n’est pas grave, mais le lever relance l’attente. Si le téléphone déclenche un geste système ou fait descendre un menu, commence un peu plus loin des bords de l’écran.',
        'Les résultats des dix derniers tirages s’affichent sous le résultat tant que la page reste ouverte, ce qui aide pour une partie en deux manches gagnantes. Ils ne sont gardés qu’en mémoire et disparaissent quand tu fermes la page, et les touchers eux-mêmes ne quittent jamais ton appareil.',
      ],
      list: [
        'Pose le téléphone à plat et rassemblez-vous autour.',
        'Un doigt par personne, loin des bords de l’écran.',
        'Ne lève pas le doigt avant l’affichage du résultat.',
        'Au-delà de cinq personnes, essayez une tablette ou le mode clic.',
      ],
    },
  ],
  cta: 'Ouvrir le tirage au doigt',
};
