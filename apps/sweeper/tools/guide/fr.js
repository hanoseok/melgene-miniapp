module.exports = {
  metaTitle: 'Démineur : règles, astuces et petite histoire',
  description: 'Comment jouer au Démineur en ligne : lire les chiffres, poser des drapeaux, dégager d’un seul toucher, astuces pour aller plus vite et brève histoire du jeu culte.',
  h1: 'Démineur : comment jouer, lire les chiffres et finir plus vite',
  updated: '2026-10-10',
  intro: 'Le Démineur est un casse-tête de logique gratuit : une grille de cases cachées, quelques mines et un seul objectif, dévoiler toutes les cases sans mine. Quand la grille s’ouvre, il n’y a plus besoin de chance, seulement de lire les chiffres avec soin. Ce guide présente les règles, les commandes sur mobile et sur ordinateur, les habitudes qui font gagner du temps et un peu d’histoire.',
  sections: [
    {
      h: 'Qu’est-ce que le Démineur et quelles sont les règles',
      p: [
        'Au départ, toutes les cases sont couvertes. En dévoilant une case, trois cas se présentent. Si elle cache une mine, la partie est perdue. Si elle est sûre et que ses huit voisines contiennent des mines, elle affiche un chiffre de 1 à 8 qui en donne le nombre exact. Si elle est sûre et sans mine autour, elle apparaît vide et toutes les cases vides connectées s’ouvrent automatiquement : un seul toucher peut donc dégager une grande zone.',
        'Vous gagnez quand toutes les cases sans mine sont dévoilées. Les drapeaux ne sont qu’un pense-bête : ils ne comptent pas pour la victoire, mais ils vous évitent de toucher une case jugée dangereuse et le compteur au-dessus de la grille indique combien de mines restent à marquer. Trois niveaux : Débutant (9 × 9, 10 mines), Moyen (12 × 12, 24 mines) et Expert (14 × 14, 40 mines).',
      ],
    },
    {
      h: 'Commandes et démarrage rapide',
      p: [
        'La grille est pensée pour les pouces : les cases sont assez grandes pour un écran de téléphone et tout tient sans défilement. Votre premier toucher est toujours sûr : les mines sont placées après lui, jamais sur la case choisie ni sur ses voisines, donc une petite zone s’ouvre toujours pour vous donner des indices.',
        'Le chrono démarre avec ce premier toucher. Si vous changez d’onglet ou d’application, il s’arrête et la grille est masquée jusqu’à votre retour.',
      ],
      list: [
        'Touchez une case couverte pour la dévoiler.',
        'Maintenez le doigt sur une case pour poser ou retirer un drapeau, ou passez le bouton Creuser / Drapeau en mode drapeau.',
        'Touchez un chiffre déjà dévoilé : si le nombre de drapeaux autour correspond, toutes les voisines restantes s’ouvrent d’un coup.',
        'Sur ordinateur, le clic droit pose un drapeau ; les flèches, Entrée et la touche F permettent de jouer sans souris.',
        'Le compteur affiche les mines moins les drapeaux. S’il passe sous zéro, au moins un drapeau est mal placé.',
      ],
    },
    {
      h: 'Stratégie : transformer les chiffres en certitudes',
      p: [
        'Commencez par les déductions simples. Un 1 qui n’a qu’une seule voisine couverte désigne cette voisine comme mine. Un chiffre dont les drapeaux sont déjà au complet rend toutes ses autres voisines sûres. Ces deux règles résolvent l’essentiel d’une grille Débutant.',
        'Quand elles ne suffisent plus, comparez les chiffres voisins. Si un 1 touche trois cases couvertes et qu’un 1 voisin en partage deux, la mine se trouve dans la paire commune, donc la troisième case du premier chiffre est sûre. Tant qu’un coup certain existe, ne devinez pas.',
      ],
      list: [
        'Les coins et les bords ont moins de voisines : leurs chiffres sont des indices plus forts.',
        'Posez un drapeau dès que vous êtes certain, puis dégagez le reste d’un toucher sur le chiffre.',
        'S’il faut deviner, choisissez la case la moins risquée et la plus informative.',
        'Ne vous précipitez pas : la vitesse vient de moins d’erreurs et de pauses, pas de touchers plus rapides.',
      ],
    },
    {
      h: 'Petite histoire du Démineur',
      p: [
        'Des jeux consistant à éviter des mines cachées existaient déjà sur les ordinateurs familiaux au début des années 1980, comme Mined-Out sur ZX Spectrum, où l’on traversait un champ en déduisant les mines grâce au nombre de celles qui étaient voisines. La version moderne, avec grille et chiffres, s’est imposée dans les années suivantes.',
        'Elle est devenue une habitude mondiale quand Microsoft l’a livrée avec Windows. On dit souvent que le Solitaire a appris le glisser-déposer et que le Démineur a appris à cliquer avec précision et à utiliser le bouton droit. Des millions de personnes y jouent pendant leurs pauses, et des communautés s’affrontent pour les temps records.',
      ],
    },
    {
      h: 'Temps, défis entre amis et confidentialité',
      p: [
        'Quand vous finissez une grille, votre temps s’affiche et votre meilleur temps par niveau reste enregistré dans votre navigateur seulement. Si d’autres joueurs ont terminé le même niveau, un pourcentage situe votre temps parmi eux ; sans point de comparaison, il reste masqué. Ces chiffres sont de vrais totaux.',
        'Pour défier un ami, partagez votre résultat et choisissez le même niveau. La disposition est aléatoire à chaque partie, donc la chance s’équilibre sur quelques manches. Aucun compte n’est requis et seuls le niveau et un temps arrondi sont envoyés après une victoire, jamais votre nom.',
      ],
    },
  ],
  cta: 'Jouer au Démineur maintenant',
};
