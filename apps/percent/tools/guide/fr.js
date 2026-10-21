module.exports = {
  metaTitle: 'Calcul pourcentage\u202f: formules, remises et points',
  description: 'Comment calculer un pourcentage à la main\u202f: X % d’un nombre, quel pourcentage représente une valeur, taux d’évolution, remises cumulées, prix d’origine et différence entre pourcentage et point de pourcentage.',
  h1: 'Calcul pourcentage\u202f: la méthode pour tous les cas',
  updated: '2026-10-22',
  intro: 'Les pourcentages sont partout : étiquettes de soldes, fiches de paie, notes d’examen, taux d’intérêt, sondages. La plupart se résolvent avec trois petites formules, mais quelques pièges attrapent presque tout le monde, comme rajouter une remise ou confondre pourcentage et point de pourcentage. Ce guide explique comment fonctionne le calculateur, comment faire les mêmes calculs avec un papier et un crayon, où se cachent les erreurs classiques et quelques astuces de calcul mental pour la vie de tous les jours.',
  sections: [
    {
      h: 'Utiliser le calculateur de pourcentage',
      p: [
        'Choisissez votre question parmi les six onglets du haut : un pourcentage d’un nombre, quel pourcentage représente une valeur, le taux d’évolution entre deux valeurs, une remise ou une hausse, la valeur d’origine avant un changement, ou l’écart entre deux taux en points de pourcentage. Chaque onglet a deux cases. Dès qu’elles sont remplies, la réponse s’affiche, avec une ligne qui montre exactement le calcul effectué.',
        'Vous pouvez taper les décimales avec une virgule ou un point : 12,5 et 12.5 fonctionnent tous les deux, et les séparateurs de milliers comme 1.250 sont compris. Les résultats sont arrondis à dix décimales au plus, ce qui masque les minuscules erreurs d’arrondi des ordinateurs. À la fin, ouvrez le récapitulatif pour voir tous vos résultats dans une seule liste et copier ceux dont vous avez besoin.',
      ],
      list: [
        'Tout est calculé dans votre navigateur : les nombres saisis ne sont envoyés nulle part.',
        'Le bouton de copie copie le résultat avec sa formule.',
        'L’onglet remise propose des boutons rapides pour −10, −20, −30 et −50 %.',
      ],
    },
    {
      h: 'Les trois formules de base, à la main',
      p: [
        'Pour cent veut dire « sur cent » : 15 % c’est 15 sur 100, soit 0,15. Avec cette idée, presque toutes les questions deviennent l’une de trois formules. Pour un pourcentage d’un nombre, on multiplie puis on divise par 100 : 15 % de 200 font 200 × 15 ÷ 100 = 30. Pour savoir quel pourcentage représente une partie, on divise la partie par le total et on multiplie par 100 : 30 sur 120 font 30 ÷ 120 × 100 = 25 %. Pour retrouver le total à partir d’une partie et de son pourcentage, on divise la partie par le pourcentage et on multiplie par 100 : si 30 représente 25 %, le total vaut 30 ÷ 25 × 100 = 120.',
        'L’astuce est de toujours se demander « pourcentage de quoi ? ». Le nombre qui suit le mot « de » est la base, et la base va au dénominateur. La plupart des erreurs arrivent quand la base change discrètement en cours de route.',
      ],
      list: [
        'Partie = total × pourcentage ÷ 100',
        'Pourcentage = partie ÷ total × 100',
        'Total = partie ÷ pourcentage × 100',
      ],
    },
    {
      h: 'Évolution, remises et le piège du calcul inverse',
      p: [
        'Le taux d’évolution compare une nouvelle valeur à l’ancienne : (nouvelle − ancienne) ÷ ancienne × 100. Un prix qui passe de 80 à 100 augmente de 25 %, mais un prix qui tombe de 100 à 80 ne baisse que de 20 %, car la base n’est pas la même dans les deux sens. Cette asymétrie explique une énigme célèbre : retirez 20 % à 100, vous obtenez 80 ; rajoutez 20 %, vous n’arrivez qu’à 96.',
        'Pour la même raison, les remises cumulées sont plus petites qu’elles n’en ont l’air. Une deuxième démarque de 20 % sur un prix déjà soldé à −30 % ne fait pas −50 % : on paie 0,7 × 0,8 = 0,56 du prix, soit −44 %. Pour annuler une évolution, il faut diviser au lieu de soustraire. Une veste à 80 € après −20 % coûtait 80 ÷ 0,8 = 100 €. Un montant de 120 € TTC avec 20 % de TVA vaut 120 ÷ 1,2 = 100 € HT, et non 96 €. L’onglet « Valeur d’origine » affiche cette division et vous prévient même de la mauvaise réponse tentante.',
      ],
    },
    {
      h: 'Pourcentage ou point de pourcentage ?',
      p: [
        'Quand on compare deux pourcentages, il existe deux façons honnêtes de décrire l’écart, et elles donnent des chiffres très différents. Si le taux du Livret A passe de 2 % à 3 %, il gagne 1 point de pourcentage : on soustrait simplement un taux de l’autre. En relatif, il augmente de 50 %, car la hausse de 1 représente la moitié du taux de départ. Les médias et les publicités choisissent parfois la version la plus spectaculaire, d’où l’intérêt de vérifier laquelle est utilisée.',
        'Les points sont l’unité qui convient pour les taux d’intérêt, les taux d’imposition, le chômage, les sondages ou les taux de conversion, c’est-à-dire des nombres qui sont déjà des pourcentages. L’onglet « Écart en points » donne les deux chiffres à la fois : l’écart en points et la variation relative en pourcentage.',
      ],
    },
    {
      h: 'Exemples du quotidien et calcul mental',
      p: [
        'Pas besoin de calculatrice à chaque fois. 10 % d’un nombre, c’est ce nombre avec la virgule décalée d’un cran vers la gauche : 10 % de 64 font 6,4. 5 % en est la moitié, 20 % le double. On peut aussi inverser : 8 % de 50, c’est pareil que 50 % de 8, soit 4. Pour un pourboire de 15 %, calculez 10 % puis ajoutez-en la moitié.',
        'Pour les grandes décisions, écrivez la formule. Comparez une augmentation de salaire et l’inflation en soustrayant les deux taux en points, vérifiez un prix soldé en multipliant par la part qui reste plutôt qu’en soustrayant deux fois, et si un crédit annonce un taux mensuel, souvenez-vous que douze mois d’intérêts composés font plus que douze fois ce taux.',
      ],
      list: [
        '−25 % veut dire qu’on paie 0,75 du prix ; −40 %, 0,6.',
        'Après une baisse de 50 %, il faut +100 % pour revenir au départ.',
        'Doubler, c’est +100 % ; diviser par deux, c’est −50 %.',
      ],
    },
  ],
  cta: 'Ouvrir le calcul de pourcentage',
};
