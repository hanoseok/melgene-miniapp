module.exports = {
  metaTitle: 'Taureaux et vaches : règles, astuces et histoire du jeu',
  description: 'Comment jouer à Taureaux et vaches (Bulls and Cows, baseball des nombres) : les règles, la lecture des indices, des astuces de raisonnement et l’histoire du jeu.',
  h1: 'Taureaux et vaches (baseball des nombres) : comment jouer et raisonner',
  updated: '2026-10-18',
  intro: 'Taureaux et vaches est un jeu classique de déchiffrage de code pour un joueur : un nombre secret est caché, vous proposez des nombres et chaque proposition vous rapporte un petit indice. Selon les pays, les indices portent des noms différents : en Corée on parle de baseball des nombres avec strikes, balles et outs, en anglais de « bulls and cows ». Ce guide présente les règles de la version proposée ici, la lecture des indices, quelques façons de raisonner qui simplifient l’énigme, l’origine du jeu et des idées pour y jouer entre amis.',
  sections: [
    {
      h: 'Ce qu’est Taureaux et vaches',
      p: [
        'L’ordinateur choisit un nombre secret dont tous les chiffres sont différents. Au niveau classique il compte 3 chiffres, au niveau plus dur 4. Un chiffre n’apparaît jamais deux fois, mais le zéro est autorisé, même au début : 072 est donc un nombre secret tout à fait valable. Il existe 720 nombres possibles à 3 chiffres et 5 040 à 4 chiffres, et chacun a la même probabilité car les chiffres sont mélangés équitablement à chaque partie.',
        'Votre but est de trouver le nombre en un minimum de propositions. Après chaque essai, on vous dit à quel point vous étiez proche, mais pas quels chiffres étaient justes : c’est là que naît l’énigme. Rien n’est chronométré tant que vous n’activez pas le chrono, et il n’y a pas de bouton d’aide, tout repose donc sur un raisonnement soigneux.',
      ],
    },
    {
      h: 'Déroulement d’une partie',
      p: [
        'Choisissez 3 ou 4 chiffres sur l’écran d’accueil et touchez Commencer. Saisissez un nombre de même longueur avec le pavé de l’écran ou votre clavier, puis touchez Valider. Votre proposition ne doit pas répéter un chiffre, et un nombre déjà essayé n’est pas recompté.',
      ],
      list: [
        'Un « bien placé » (strike) est un chiffre juste et à la bonne place.',
        'Un « mal placé » (balle) est un chiffre présent dans le nombre secret mais à une autre place.',
        'Un « raté » (out) signifie qu’aucun de vos chiffres n’apparaît dans le nombre secret.',
        'Vous gagnez quand tous les chiffres sont bien placés. Le résultat indique le nombre d’essais.',
        'Si vous bloquez, touchez Abandonner deux fois pour voir la réponse et lancer une nouvelle partie. Une partie abandonnée ne compte pas dans vos records.',
      ],
    },
    {
      h: 'Des façons de réfléchir qui aident',
      p: [
        'Les débutants proposent souvent des nombres au hasard en espérant avoir de la chance. Une meilleure habitude consiste à traiter chaque réponse comme un petit fait et à noter ce qu’il élimine. Même un simple carnet, sur papier ou dans votre tête, transforme le jeu : il ressemble beaucoup moins à une loterie.',
      ],
      list: [
        'Additionnez les bien placés et les mal placés. Ce total indique combien de vos chiffres figurent dans le nombre secret, quelle que soit leur place.',
        'Un « raté » est très précieux. Il écarte d’un coup tous les chiffres que vous avez utilisés, vous n’avez plus à y penser.',
        'Ne changez qu’une ou deux choses entre deux propositions. Si l’indice change, vous savez que le chiffre remplacé en est la cause.',
        'Testez séparément les chiffres et les positions. Dès qu’un chiffre est confirmé, déplacez-le pour trouver sa place.',
        'Veillez à ce que chaque proposition puisse encore être la bonne. Si elle contredit ce que vous savez déjà, elle ne peut pas gagner et fait perdre un coup.',
        'Ne vous accrochez pas au premier coup de chance. Vérifiez qu’il s’accorde avec tous les indices précédents avant de construire dessus.',
      ],
    },
    {
      h: 'D’où vient le jeu',
      p: [
        'Taureaux et vaches est un vieux jeu papier-crayon, généralement joué à deux, l’un choisissant le code et l’autre le cherchant à tour de rôle. Il est l’ancêtre du Mastermind, le jeu de plateau à pions colorés publié au début des années 1970. Une version informatique appelée Moo tournait à la même époque sur un gros ordinateur de l’université de Cambridge, et le jeu est depuis un exercice favori des programmeurs.',
        'L’idée a voyagé sous des noms locaux. En Corée, c’est le baseball des nombres, dont cette page reprend le vocabulaire ; au Japon on parle souvent de Hit and Blow, en Chine de 1A2B, et en russe ou en espagnol on emploie les noms des taureaux et des vaches. Des ordinateurs ont montré qu’avec un jeu parfait on trouve tout nombre secret à 4 chiffres en 7 propositions au plus, et en un peu plus de 5 en moyenne : s’en approcher est donc excellent pour un humain.',
      ],
    },
    {
      h: 'Jouer entre amis et suivre ses progrès',
      p: [
        'Le jeu se transforme facilement en défi amical. Mettez-vous d’accord sur le nombre de chiffres, jouez chacun quelques fois le même niveau et comparez qui a besoin du moins d’essais. Comme rien n’est caché hormis le nombre secret, vous pouvez aussi commenter votre raisonnement après la partie, ce qui est un excellent moyen d’apprendre de nouvelles astuces.',
        'Votre meilleur résultat pour chaque niveau n’est enregistré que dans ce navigateur. Quand vous trouvez le nombre, votre nombre d’essais est comparé aux vrais résultats des autres joueurs du même niveau ; s’il n’y a encore rien à comparer, la comparaison est simplement omise. Essayez de battre votre record, puis tentez le niveau à 4 chiffres pour un plus grand défi.',
      ],
    },
  ],
  cta: 'Jouer à Taureaux et vaches',
};
