module.exports = {
  "metaTitle": "Jeu 2048 : comment jouer, stratégie et histoire",
  "description": "Apprends à jouer à 2048, pourquoi la stratégie du coin marche, comment le score est calculé et d'où vient le jeu. Puis joue gratuitement.",
  "h1": "Jeu 2048 : comment jouer et atteindre la tuile 2048",
  "updated": "2026-10-09",
  "intro": "2048 paraît simple : faire glisser des tuiles numérotées sur une grille de quatre par quatre et fusionner celles qui sont identiques. Il est pourtant étonnamment profond. Ce guide présente les règles, le score, les techniques de stratégie des joueurs expérimentés et la brève histoire de l'un des casse-têtes les plus copiés de la dernière décennie.",
  "sections": [
    {
      "h": "Comment jouer",
      "p": [
        "Le plateau est une grille de quatre par quatre avec quelques tuiles numérotées. Glisse le doigt sur le plateau ou appuie sur les flèches (ou W, A, S, D) : toutes les tuiles glissent aussi loin que possible dans cette direction. Quand deux tuiles portant le même nombre se rencontrent, elles fusionnent en une tuile de valeur double : deux 2 donnent un 4, deux 64 donnent un 128.",
        "Après chaque coup qui modifie vraiment le plateau, une nouvelle tuile apparaît dans une case vide. Le plus souvent c'est un 2, et environ une fois sur dix un 4. Si ton geste ne déplace rien, aucune tuile n'est ajoutée. Ton but est de créer une tuile 2048. Ensuite, tu peux continuer pour un meilleur score ou t'arrêter là."
      ],
      "list": [
        "Glisse ou utilise les touches pour déplacer toutes les tuiles à la fois.",
        "Deux voisines identiques fusionnent en une tuile de valeur double.",
        "Un nouveau 2 ou 4 apparaît après chaque coup qui change le plateau.",
        "La partie s'arrête quand le plateau est plein et qu'aucune voisine n'est identique."
      ]
    },
    {
      "h": "Règles à connaître",
      "p": [
        "Une tuile ne peut fusionner qu'une fois par coup. Si une ligne contient 2, 2, 2, 2, un glissement produit deux 4, pas un 8, et la paire la plus proche du mur vers lequel tu glisses fusionne en premier. Ce détail compte quand tu planifies une chaîne de fusions.",
        "Il n'y a ni chronomètre ni retour en arrière : chaque coup est définitif. Ton score augmente de la valeur de chaque nouvelle tuile créée, donc une fusion qui produit un 512 rapporte 512 points. Les grosses fusions valent donc bien plus que les petites. Ton meilleur score est enregistré dans ce navigateur, et à la fin d'une partie ton score peut être comparé anonymement à celui d'autres joueurs pour afficher un pourcentage."
      ]
    },
    {
      "h": "Stratégie : garde ta plus grosse tuile dans un coin",
      "p": [
        "L'habitude la plus utile est de choisir un coin et d'y garder ta plus grosse tuile. Construis le long du bord une chaîne décroissante, avec la plus grosse tuile dans le coin, la suivante à côté, et ainsi de suite, comme un serpent. Comme les tuiles de la chaîne ont des valeurs proches, elles fusionnent l'une après l'autre au lieu de se bloquer.",
        "Choisis deux directions principales, par exemple bas et gauche si ton coin est en bas à gauche. N'utilise la troisième que si tu y es obligé et évite la quatrième, car c'est le coup qui arrache ta grosse tuile du coin. Si tu dois la jouer, vérifie d'abord que la rangée du coin est pleine pour que la tuile ne puisse pas s'échapper."
      ],
      "list": [
        "Choisis un coin et laisse-y ta plus grosse tuile.",
        "Privilégie deux directions principales, la troisième avec parcimonie.",
        "Remplis la rangée de ta chaîne avant d'en construire une autre.",
        "Fusionne les petites tuiles près de la chaîne, pas loin d'elle."
      ]
    },
    {
      "h": "Erreurs fréquentes",
      "p": [
        "Les débutants glissent souvent dans les quatre directions pour courir après les fusions faciles. Cela éparpille les grosses tuiles et coince les petites entre elles. Autre erreur : gaspiller des coups en petites fusions alors qu'une grosse tuile n'a aucune partenaire à proximité.",
        "Regarde un ou deux coups à l'avance. Avant chaque glissement, demande-toi où la nouvelle tuile pourrait tomber et si le coup libère ou bloque une rangée. Quand le plateau se remplit, ralentis : un geste distrait peut terminer la partie, alors que la patience peut sauver une position confuse."
      ]
    },
    {
      "h": "D'où vient 2048",
      "p": [
        "2048 a été créé par le développeur italien Gabriele Cirulli en mars 2014, comme projet de week-end. Il s'est inspiré de jeux antérieurs comme 1024 et Threes, et il a publié son code ouvertement, ce qui a donné naissance à d'innombrables variantes et clones. Le nombre 2048 est deux puissance onze, et en théorie un plateau de quatre par quatre peut atteindre une tuile de 131072.",
        "Cette version ajoute une ambiance d'Halloween, mais les règles sont les classiques. Joue quelques parties, essaie la stratégie du coin et partage ton score avec un ami pour voir qui va le plus loin."
      ]
    }
  ],
  "cta": "Jouer à 2048"
};
