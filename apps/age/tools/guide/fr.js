module.exports = {
  metaTitle: 'Calcul de l’âge : âge exact, 29 février et dates à fêter',
  description: 'Comment le calcul de l’âge trouve votre âge exact en années, mois et jours, ce qui se passe pour les anniversaires du 29 février, comment on compte l’âge en France et ailleurs, et quelles dates fêter.',
  h1: 'Calcul de l’âge : comment votre âge exact est calculé',
  updated: '2026-10-19',
  intro: 'Tout le monde connaît à peu près son âge, mais « exactement », c’est une autre affaire. Combien de mois et de jours depuis le dernier anniversaire ? Quel jour de la semaine êtes-vous né ? Quand fêterez-vous vos 10 000 jours ? Ce guide explique comment l’outil répond à ces questions, selon quelle règle il compte les mois et les jours, ce qui arrive si vous êtes né un 29 février et comment l’âge se compte en France et dans d’autres cultures. Vous trouverez à la fin quelques dates qui font de très bonnes excuses pour une fête.',
  sections: [
    {
      h: 'Comment utiliser le calcul de l’âge',
      p: [
        'Choisissez le jour, le mois et l’année de naissance dans les trois listes, puis appuyez sur le bouton. La liste des jours s’adapte au mois choisi : février ne propose que 28 ou 29 jours et une date qui n’a jamais existé est impossible à sélectionner. Par défaut, l’âge est calculé à la date d’aujourd’hui, celle de votre téléphone ou de votre ordinateur.',
        'Pour connaître votre âge à une autre date, remplissez le champ « Âge à cette date ». C’est pratique pour un dossier qui demande l’âge au 1er septembre, à la clôture d’un concours ou au départ d’un voyage. Toute date entre 1900 et 2199 est acceptée. Le résultat affiche l’âge exact, le compte à rebours avant le prochain anniversaire, le total de jours, semaines, mois et heures vécus, le jour de la semaine de votre naissance, votre signe du zodiaque et votre signe chinois, puis les prochaines dates à fêter.',
      ],
      list: [
        'Votre date de naissance ne quitte jamais le navigateur : rien n’est envoyé ni enregistré.',
        'Partager le résultat ne transmet que le lien de la page et le nombre de jours vécus.',
        '« Calculer un autre âge » vide le formulaire, pour faire le calcul d’un ami ou d’un parent.',
      ],
    },
    {
      h: 'Comment l’âge exact est calculé',
      p: [
        'L’âge en années augmente d’un an à chaque anniversaire, c’est la partie simple. Les mois et les jours font davantage débat, voici donc la règle suivie. À partir du dernier anniversaire, l’outil ajoute des mois entiers du calendrier tant qu’il ne dépasse pas la date visée, puis compte les jours restants un par un. Si vous êtes né le 31 et qu’un mois n’a que 30 jours, son dernier jour sert de repère. Une personne née le 31 janvier a donc exactement un mois de plus le 28 février d’une année ordinaire, et non le 3 mars.',
        'Compter les jours correctement est plus délicat qu’il n’y paraît. Soustraire deux horodatages puis diviser par le nombre de millisecondes d’une journée donne parfois une erreur d’un jour : la nuit du changement d’heure, une journée dure 23 ou 25 heures. L’outil compare les dates du calendrier à midi dans un repère fixe, si bien qu’un jour compte toujours pour un, quel que soit votre fuseau horaire. Les heures vécues sont simplement les jours entiers multipliés par 24.',
      ],
    },
    {
      h: 'Né un 29 février ? Voici votre anniversaire',
      p: [
        'Environ une personne sur 1 461 naît un 29 février, et ne voit son vrai jour d’anniversaire qu’une fois tous les quatre ans. Les autres années, il faut choisir. Cet outil fête l’anniversaire le 28 février, dernier jour du mois : vous prenez un an sans quitter février, ce que font la plupart des familles concernées.',
        'Le droit ne tranche pas partout de la même manière, et certains pays retiennent le 1er mars. Si la date exacte compte pour un permis, une retraite ou un contrat, vérifiez la règle applicable. Pour savoir quand acheter le gâteau, le 28 février fait très bien l’affaire.',
      ],
      list: [
        'Une année est bissextile si elle est divisible par 4, sauf les années séculaires non divisibles par 400.',
        '2000 était bissextile, 2100 ne le sera pas.',
        'Les prochains 29 février tombent en 2028, 2032 et 2036.',
      ],
    },
    {
      h: 'Comment on compte l’âge en France et ailleurs',
      p: [
        'En France comme dans la plupart des pays, l’âge se compte en années révolues : un nouveau-né a zéro an et l’on prend un an à chaque anniversaire. C’est cet âge qui figure sur les formulaires, qui fixe la majorité à 18 ans ou l’âge de la retraite, et c’est lui que l’outil affiche. Dans les démarches, « avoir 18 ans révolus » signifie que le dix-huitième anniversaire est passé.',
        'Ce système n’a pas toujours été universel. En Asie de l’Est, on comptait traditionnellement un bébé comme ayant un an à la naissance, puis on ajoutait une année à chaque Nouvel An. La Corée du Sud a abandonné cette pratique dans le droit en juin 2023, le Japon l’avait fait dès 1950. Ailleurs, ce sont les âges fêtés qui changent : les quinze ans de la quinceañera en Amérique latine, les vingt ans au Japon, ou chez nous les 18 ans, souvent marqués par une grande fête.',
      ],
    },
    {
      h: 'Des dates amusantes à fêter',
      p: [
        'Les anniversaires ronds sont des classiques, mais compter en jours multiplie les occasions. Votre 10 000e jour arrive vers 27 ans et 4 mois, une date que beaucoup laissent passer sans le savoir. Le 20 000e jour tombe vers 54 ans et 9 mois, et 30 000 jours peu après vos 82 ans. L’outil indique les prochaines dates avec leur compte à rebours et signale celles déjà passées.',
        'Le jour de la semaine de votre naissance est une autre petite surprise. Il avance d’un jour chaque année, de deux après un 29 février : votre anniversaire ne retombe sur le même jour que tous les quelques ans. Le signe du zodiaque dépend de la date de naissance. Le signe chinois suit ici l’année grégorienne ; traditionnellement il change au Nouvel An lunaire, fin janvier ou en février, donc si vous êtes né en début d’année votre signe traditionnel peut être celui de l’année précédente.',
      ],
      list: [
        '10 000 jours : environ 27 ans et 4 mois.',
        'Un milliard de secondes : environ 31 ans et 8 mois.',
        'Le demi-anniversaire : six mois après, une bonne raison pour un demi-gâteau.',
      ],
    },
  ],
  cta: 'Ouvrir le calcul de l’âge',
};
