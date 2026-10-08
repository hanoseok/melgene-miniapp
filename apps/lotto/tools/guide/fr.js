module.exports = {
  metaTitle: "Générateur de loto : guide du hasard et des combinaisons",
  description: "Comment fonctionne le générateur de loto, si ses numéros sont vraiment aléatoires, les mathématiques des combinaisons et comment l’utiliser pour le plaisir.",
  h1: "Générateur de loto : comment naissent les numéros aléatoires",
  updated: "2026-10-09",
  intro: "Le générateur de loto tire des numéros pour le 6/45 coréen, un jeu de type Euro, le Powerball américain ou une plage de ton choix, et les fait rouler hors d’une machine de tirage à l’écran. Il est fait uniquement pour s’amuser. Ce guide explique comment l’utiliser, pourquoi ses numéros sont aléatoires au sens strict, à quoi ressemblent les mathématiques des combinaisons, des usages créatifs au-delà de la loterie et comment jouer avec modération.",
  sections: [
    {
      h: "Comment fonctionne le générateur",
      p: [
        "Tu commences par choisir un jeu. Le 6/45 coréen tire six numéros de 1 à 45. Le jeu de type Euro tire cinq numéros de 1 à 50 plus deux étoiles de 1 à 12. Le Powerball américain tire cinq numéros de 1 à 69 plus un Powerball de 1 à 26. Un jeu personnalisé te laisse fixer le numéro le plus élevé, jusqu’à 100, et le nombre de numéros à tirer, jusqu’à dix. Tu choisis ensuite combien de grilles produire, de une à cinq.",
        "Avant le tirage, tu peux ajouter des numéros à garder et des numéros à exclure. Les numéros gardés figurent dans toutes les grilles et les autres sont tirés autour d’eux ; les numéros exclus n’apparaissent jamais. Ces deux réglages ne concernent que les numéros principaux, pas les étoiles ni le Powerball. Quand tu appuies sur le bouton de tirage, les numéros sont d’abord choisis, puis les boules tournent dans la machine et sortent l’une après l’autre, et enfin chaque grille est affichée triée du plus petit au plus grand. Les couleurs des boules suivent les plages coréennes bien connues, et un bouton de copie place le résultat dans le presse-papiers."
      ],
      list: [
        "Choisis le 6/45 coréen, le type Euro, le Powerball américain ou une plage personnalisée.",
        "Choisis le nombre de grilles à tirer, de 1 à 5.",
        "Si tu veux, indique des numéros à garder et à exclure, séparés par des virgules.",
        "Appuie sur le bouton de tirage et regarde les boules sortir.",
        "Copie les numéros, tire à nouveau ou reviens aux réglages."
      ]
    },
    {
      h: "Les numéros sont-ils vraiment aléatoires ?",
      p: [
        "Le générateur utilise la source aléatoire cryptographique de ton navigateur, le même type d’aléa que celui qui sert à créer des clés de sécurité. Tirer un entier dans une plage semble facile, mais une méthode maladroite peut favoriser certains numéros. Par exemple, si l’on prend une grande valeur aléatoire et que l’on garde le reste de sa division par 45, les petits restes sortent un peu plus souvent. Pour éviter cela, l’outil écarte les rares valeurs aléatoires qui causeraient ce déséquilibre et recommence, une technique appelée échantillonnage par rejet.",
        "Les numéros sont ensuite choisis sans répétition grâce à un mélange partiel, de sorte que chaque numéro restant a la même chance à chaque étape. L’animation des boules est jouée une fois le résultat déjà décidé et n’a aucune influence sur lui. C’est pourquoi chaque numéro autorisé est également probable, et pourquoi l’outil ne peut pas être orienté par le moment ou la façon d’appuyer sur le bouton."
      ]
    },
    {
      h: "Les mathématiques des combinaisons",
      p: [
        "Une loterie est un problème de dénombrement. Dans un jeu 6/45, il existe 8 145 060 ensembles différents de six numéros. Dans un jeu 5/50 plus 2/12, il y a 2 118 760 façons de choisir les cinq numéros principaux et 66 façons de choisir les deux étoiles, soit 139 838 160 combinaisons au total. Dans un jeu 5/69 plus 1/26, il y a 11 238 513 façons de choisir les cinq numéros et 26 choix pour le Powerball, soit 292 201 338 combinaisons. Plus il y a de combinaisons, moins un seul billet en représente.",
        "Chaque combinaison est exactement aussi probable que n’importe quelle autre, y compris 1, 2, 3, 4, 5, 6. Les résultats passés ne changent pas les tirages futurs : il n’existe donc ni numéros chauds ni numéros froids, et garder ou exclure des numéros ne modifie rien aux chances. Une vraie différence tient au nombre d’autres joueurs qui choisissent les mêmes numéros. Beaucoup jouent des dates de naissance, donc des combinaisons uniquement composées de petits numéros sont probablement partagées plus souvent en cas de gain, mais cela concerne le partage d’un gain, pas la façon de le gagner."
      ]
    },
    {
      h: "Façons d’utiliser le générateur",
      p: [
        "Un tirage aléatoire rapide et équitable est utile bien au-delà de la loterie. Le mode personnalisé en fait une petite boîte à outils pour tout ce qui demande des nombres sans biais."
      ],
      list: [
        "Choisir des numéros porte-bonheur pour s’amuser, en gardant une date de naissance ou d’anniversaire dans chaque grille.",
        "Tirer au sort un gagnant pour une tombola ou un concours en numérotant les participants et en tirant un numéro.",
        "Créer des jeux de numéros façon bingo ou tirer un nombre de 1 à 100 pour un jeu de soirée.",
        "Décider qui commence en tirant un numéro de siège ou d’équipe.",
        "Enseigner les probabilités en classe en comparant de nombreux tirages."
      ]
    },
    {
      h: "Jouer avec modération et confidentialité",
      p: [
        "Cet outil n’est pas un opérateur de loterie, ne peut pas vendre de billets et ne peut ni prédire ni améliorer tes chances de gagner. Si tu achètes des billets, considère le coût comme une dépense de loisir : fixe un budget à l’avance, n’achète qu’auprès d’opérateurs agréés, respecte les règles d’âge minimum de ton pays et arrête-toi quand ce n’est plus un plaisir. Si le jeu te pose problème, contacte un service d’aide local.",
        "Les numéros que tu saisis et ceux qui sont tirés sont traités dans ton navigateur et ne sont pas envoyés à notre serveur. Rien de tes grilles n’est conservé. La page peut mémoriser des préférences de base, comme ta langue. Utilise le bouton de copie si tu veux garder un résultat."
      ]
    }
  ],
  cta: "Tirer mes numéros"
};
