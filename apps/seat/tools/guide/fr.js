module.exports = {
  metaTitle: 'Plan de classe aléatoire : guide, règles et conseils',
  description: 'Comment les profs utilisent un plan de classe aléatoire : préparer la salle, séparer deux élèves, premiers rangs et places fixes, à quel rythme changer et pourquoi les noms restent privés.',
  h1: 'Plan de classe aléatoire : des places équitables pour toute la classe',
  updated: '2026-10-13',
  intro: 'Changer les élèves de place est un petit rituel de l’année scolaire, et il est étonnamment facile de le rater. Si le prof décide seul, quelqu’un se sent toujours visé. Si les élèves choisissent, les mêmes amis se regroupent et les plus discrets finissent sur les côtés. Un plan de classe aléatoire règle les deux problèmes : le hasard décide, tout le monde voit qu’il a décidé, et l’enseignant garde la main sur les quelques règles qui comptent vraiment. Ce guide explique l’outil, montre comment les profs utilisent le placement aléatoire, détaille les règles possibles et précise ce que deviennent les noms saisis.',
  sections: [
    {
      h: 'Comment faire un plan de classe aléatoire',
      p: [
        'Commence par les noms. Colle ta liste d’élèves avec un nom par ligne, ou sépare-les par des virgules. Si tu préfères ne pas écrire de noms, tape un seul nombre, par exemple 28 : le plan utilisera les numéros 1 à 28, pratique avec les numéros d’appel. Un plan accepte jusqu’à 100 noms.',
        'Ensuite, dessine la salle. Choisis le nombre de rangées et le nombre de places par rangée. Le plan montre la salle du point de vue des élèves, avec le bureau du prof en haut : la première rangée à l’écran est donc la plus proche du tableau. Touche une place pour la barrer quand elle doit rester vide, par exemple une allée, une table cassée ou la place près de la porte. Quand tout ressemble à ta classe, appuie sur Mélanger et regarde les places se retourner une à une, ou passe l’animation si la sonnerie approche.',
      ],
      list: [
        'Colle les noms, ou indique le nombre d’élèves.',
        'Règle les rangées et les places par rangée.',
        'Touche les places qui doivent rester vides.',
        'Ajoute si besoin des règles : séparer, premiers rangs ou places fixes.',
        'Mélange, puis enregistre l’image, copie le texte ou le lien.',
      ],
    },
    {
      h: 'Comment les profs utilisent le placement aléatoire',
      p: [
        'La plupart des enseignants changent les places à un rythme régulier : chaque mois, à chaque période ou au début d’une nouvelle séquence. Un calendrier connu compte plus que l’intervalle exact, car un élève accepte bien mieux une place qu’il n’aime pas quand il sait qu’elle est temporaire.',
        'Le mieux est de faire le tirage devant la classe. Projette l’écran, laisse les places se retourner une à une, et le tirage devient un petit moment collectif plutôt qu’une décision contestée. Ensuite, enregistre le plan en PNG pour tes diapositives ou l’affichage, ou copie-le en tableau texte dans le cahier de liaison ou les consignes pour un remplaçant.',
      ],
      list: [
        'Rentrée : mélanger des élèves qui ne se connaissent pas encore.',
        'Travail de groupe : placer au hasard, puis réunir les tables voisines en équipes.',
        'Contrôles : éviter que des amis soient côte à côte.',
        'Remplacement : laisser un plan imprimé pour que le collègue connaisse chaque prénom.',
      ],
    },
    {
      h: 'Les règles : séparer, premiers rangs et places fixes',
      p: [
        'Le hasard pur est juste, mais une classe a des besoins réels. Dans Règles de placement, tu peux ajouter des paires à séparer : ces deux élèves ne seront jamais voisins, même en diagonale. Tu peux mettre des élèves dans la liste des premiers rangs pour qu’ils soient toujours dans les deux premières rangées, ce qui aide ceux qui portent des lunettes, entendent mal ou ont besoin de se concentrer, sans les montrer du doigt. Et tu peux fixer un nom à une place précise, par exemple pour un élève qui doit être près de la porte ou à côté d’une AESH.',
        'Utilise les règles avec parcimonie. Chaque règle retire un peu de hasard, et dans une salle pleine, trop de règles peuvent rendre tout plan impossible. Dans ce cas, l’outil te prévient au lieu d’enfreindre une règle en silence, et propose de retirer une paire ou une place fixe, ou d’ajouter des places. Bonne habitude : ne garder que les règles que tu pourrais expliquer à la classe.',
      ],
    },
    {
      h: 'Pourquoi le tirage est équitable',
      p: [
        'Chaque plan est tiré avec le générateur aléatoire cryptographique de ton navigateur, le même type de hasard que pour les clés de sécurité. L’outil utilise l’échantillonnage par rejet pour éviter les biais minuscules quand des bits aléatoires deviennent des numéros de place, puis un mélange de Fisher–Yates, qui donne la même chance à chaque disposition possible. Avec des paires à séparer, l’outil retire des plans complets jusqu’à en obtenir un qui respecte toutes les règles, si bien que tous les plans valides restent également probables. Ce n’est que dans les salles très serrées qu’il passe à une recherche méthodique pour trouver un plan qui marche.',
        'Le plan est fixé avant le début de l’animation. Les places qui se retournent ne font que montrer un résultat déjà décidé : appuyer sur Passer ne change rien à qui s’assoit où.',
      ],
    },
    {
      h: 'Partager le plan et protéger les noms',
      p: [
        'Les noms saisis ne quittent jamais ton navigateur. Pas de compte, rien n’est envoyé sur un serveur. Ta dernière liste et la disposition de la salle sont retenues sur ton propre appareil pour la prochaine fois, et le bouton Effacer les supprime.',
        'Quand tu copies le lien, les noms et la disposition exacte sont écrits dans le lien lui-même. Toute personne qui l’ouvre voit le même plan, marqué comme partagé, sans nouveau tirage : pratique pour l’envoyer à un collègue ou le mettre sur l’ENT. Comme les noms voyagent dans le lien, évite de publier des liens avec des noms complets en accès public. Les prénoms, les initiales ou les numéros suffisent en général.',
      ],
    },
  ],
  cta: 'Faire un plan de classe aléatoire',
};
