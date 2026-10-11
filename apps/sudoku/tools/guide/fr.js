module.exports = {
  metaTitle: 'Guide du sudoku : règles, techniques et histoire',
  description: 'Comment jouer au sudoku en ligne : les règles, les notes et les indices, les techniques du singleton au X-Wing, les quatre niveaux et une petite histoire de ce casse-tête chiffré.',
  h1: 'Sudoku : règles, techniques et plaisir de la grille',
  updated: '2026-10-12',
  intro: 'Le sudoku est un casse-tête de logique gratuit qui se joue sur une grille de 9 cases sur 9. Certaines cases contiennent déjà un chiffre, et il faut remplir les autres pour que chaque ligne, chaque colonne et chaque carré de 3 sur 3 contienne une seule fois les chiffres de 1 à 9. Aucun calcul n’est nécessaire, et une grille bien construite ne demande jamais de deviner. Ce guide présente les règles, les commandes sur téléphone et sur ordinateur, les techniques pour passer de Facile à Expert, et l’histoire étonnamment voyageuse de ce jeu.',
  sections: [
    {
      h: 'Le sudoku et ses règles',
      p: [
        'La grille compte 81 cases, réparties en neuf lignes, neuf colonnes et neuf carrés de trois cases sur trois. Le jeu commence avec des chiffres donnés, en général entre vingt et quarante, qui ne bougent pas. Chaque case vide doit recevoir un chiffre de 1 à 9, et aucun chiffre ne peut apparaître deux fois dans une même ligne, une même colonne ou un même carré. Quand toutes les cases sont remplies sans enfreindre cette règle, la grille est résolue.',
        'Au fond, les chiffres ne sont que neuf symboles différents : on pourrait jouer avec des lettres ou des couleurs sans rien changer. Le sudoku est donc un jeu de placement et d’élimination, pas un problème de maths. Chaque grille de cette page est créée dans votre navigateur puis vérifiée par un solveur avant de s’afficher : elle a une solution et une seule, que l’on atteint uniquement par le raisonnement.',
      ],
    },
    {
      h: 'Commandes et premiers pas',
      p: [
        'Choisissez un niveau et touchez Nouvelle grille. Touchez une case vide pour la sélectionner : sa ligne, sa colonne et son carré se colorent légèrement pour montrer ce qu’elle touche, et si elle contient un chiffre, toutes ses copies sont mises en évidence dans la grille. Touchez ensuite un chiffre du pavé sous la grille. Le petit nombre sous chaque chiffre indique combien d’exemplaires il manque encore, pratique pour repérer les chiffres presque terminés.',
        'La partie est enregistrée dans ce navigateur après chaque coup. Si vous fermez la page, l’écran d’accueil propose un bouton Reprendre la partie avec le niveau et le temps. Le chrono s’arrête dès que vous passez à un autre onglet ou à une autre appli, et la grille reste masquée jusqu’à votre retour : une interruption ne vous coûte rien.',
      ],
      list: [
        'Notes fait passer le pavé en mode crayon : chaque chiffre touché s’écrit ou s’efface en petit dans la case choisie.',
        'Effacer vide la case sélectionnée, et Annuler revient en arrière coup par coup.',
        'Indice remplit une case juste à votre place. Vous en avez trois par grille, et une grille résolue avec un indice n’entre pas dans la comparaison des temps.',
        'Vérifier affiche en rouge les chiffres qui ne correspondent pas à la solution. Sans Vérifier, seuls les doublons dans une ligne, une colonne ou un carré sont encadrés.',
        'Sur ordinateur, les flèches déplacent la sélection, les touches 1 à 9 remplissent, Retour arrière efface, N bascule les notes et Z annule.',
      ],
    },
    {
      h: 'Les techniques, du singleton au X-Wing',
      p: [
        'Presque toutes les grilles commencent par des singletons. Un singleton nu est une case où huit chiffres sur neuf sont déjà exclus par sa ligne, sa colonne et son carré : il n’en reste qu’un possible. Le singleton caché est le point de vue inverse : dans une ligne, une colonne ou un carré, il ne reste qu’une seule case capable d’accueillir un chiffre donné. Passer chaque chiffre en revue sur trois carrés alignés est la manière la plus rapide de les trouver, et les grilles Faciles de cette page se terminent avec ces deux idées seulement.',
        'Les niveaux Moyen et Difficile en demandent un peu plus. Avec la paire pointante, un chiffre qui ne peut se trouver que sur une seule ligne à l’intérieur d’un carré ne peut plus apparaître ailleurs sur cette ligne. Avec la paire nue, deux cases d’un même groupe qui n’ont que les deux mêmes candidats se réservent ces deux chiffres, qu’on peut retirer du reste du groupe. Les grilles Difficiles peuvent aussi exiger un triplet nu ou un X-Wing, quand un chiffre est enfermé dans les deux mêmes colonnes sur deux lignes différentes. Les grilles Expert ont le moins d’indices et réclament des raisonnements plus longs.',
      ],
      list: [
        'Ne prenez des notes qu’une fois les singletons épuisés : elles servent surtout sur les grilles difficiles.',
        'Dès qu’un chiffre est placé, retirez-le des notes de sa ligne, de sa colonne et de son carré. Le jeu le fait pour vous.',
        'En cas de blocage, regardez sur le pavé les chiffres dont il ne reste qu’un ou deux exemplaires et concentrez-vous sur eux.',
        'Ne devinez jamais exprès. Si deux possibilités semblent valables, cherchez une troisième case qui tranchera.',
      ],
    },
    {
      h: 'Une petite histoire du sudoku',
      p: [
        'Le jeu est plus ancien que son nom. Les carrés latins, des grilles où chaque symbole apparaît une fois par ligne et par colonne, ont été étudiés par le mathématicien Leonhard Euler au XVIIIe siècle, et des journaux français publiaient déjà dans les années 1890 des grilles chiffrées aux règles voisines. La forme moderne, avec ses neuf carrés, paraît en 1979 dans un magazine de jeux américain sous le nom de Number Place, et on l’attribue en général au concepteur Howard Garns.',
        'En 1984, l’éditeur japonais Nikoli l’introduit au Japon et le baptise sudoku, abréviation d’une phrase qui signifie à peu près que chaque chiffre doit rester seul. Au Japon, on l’appelle aussi souvent Nanpure, contraction de Number Place. La vague mondiale arrive en 2004 et 2005, quand des journaux britanniques le publient chaque jour, et le sudoku n’a plus quitté les journaux, les cahiers de jeux et les téléphones.',
      ],
    },
    {
      h: 'Niveaux, grille du jour et comparaison équitable',
      p: [
        'Les quatre niveaux dépendent de deux choses : le nombre d’indices laissés et les techniques dont un correcteur intégré a besoin pour résoudre la grille. Facile laisse beaucoup d’indices et se résout avec les singletons. Moyen retire davantage de chiffres et autorise des éliminations simples. Difficile est choisi pour exiger au moins une technique intermédiaire, et Expert réduit la grille au minimum d’indices tout en gardant une solution unique. La grille du jour se crée à partir de la date, une par niveau, partagée par tout le monde, et change à minuit UTC : idéal pour défier un ami sur la même grille.',
        'Quand vous résolvez une grille sans indice, votre temps devient votre record pour ce niveau, enregistré uniquement dans votre navigateur, et l’écran de résultat montre où il se situe parmi les vrais temps des autres joueurs. Seuls le niveau et un temps arrondi par tranches de cinq secondes sont envoyés à notre serveur, jamais votre nom, et la comparaison reste masquée tant qu’il n’y a rien à comparer.',
      ],
    },
  ],
  cta: 'Jouer au sudoku maintenant',
};
