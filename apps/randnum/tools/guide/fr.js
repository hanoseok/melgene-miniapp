module.exports = {
  metaTitle: 'Générateur de nombres aléatoires : guide, tirages et conseils',
  description: 'Utiliser le générateur de nombres aléatoires pour une tombola, un concours ou en classe, ce que veut vraiment dire hasard, vrai et pseudo-aléatoire, et comment faire un tirage équitable.',
  h1: 'Générateur de nombres aléatoires : mode d’emploi et tirages vraiment équitables',
  updated: '2026-10-11',
  intro: 'Un générateur de nombres aléatoires ressemble à l’outil le plus simple du web : on tape deux nombres et on en obtient un troisième. Pourtant on s’en sert pour désigner les gagnants d’un concours, interroger un élève, tirer des numéros, sélectionner des réponses à un sondage ou trancher une dispute, et à chaque fois le résultat ne vaut que si tout le monde lui fait confiance. Ce guide explique comment utiliser le générateur, propose des idées pour les concours et la classe, précise ce que signifie vraiment le hasard, compare vrai et pseudo-aléatoire, puis termine par quelques réflexes simples pour un tirage honnête.',
  sections: [
    {
      h: 'Comment utiliser le générateur',
      p: [
        'Tout se passe sur un seul écran. Tape le plus petit nombre voulu dans De et le plus grand dans À, ou touche une plage rapide comme 1–10, 1–45 ou 1–100. Les deux bornes sont incluses : de 1 à 10, tu peux obtenir 1 ou 10. Les nombres négatifs fonctionnent aussi, et chaque borne peut aller jusqu’à un milliard dans un sens comme dans l’autre.',
        'Choisis ensuite combien de nombres tirer, de un à mille. Laisse Doublons permis désactivé si chaque nombre ne doit sortir qu’une fois, ce qui convient aux billets de tombola ou aux numéros de place. Active Trier pour lire les nombres du plus petit au plus grand. Dans Plus d’options, tu peux exclure des nombres comme 13 ou toute une série comme 20-25, et donner un nom au tirage. Appuie sur Tirer : les chiffres défilent comme sur une machine à sous avant de s’arrêter sur le résultat.',
      ],
      list: [
        'Renseigne De et À, ou touche une plage rapide.',
        'Choisis combien de nombres il te faut.',
        'Décide si les doublons sont permis et s’il faut trier.',
        'Si besoin, exclus des nombres et nomme le tirage.',
        'Appuie sur Tirer, puis copie les nombres ou le lien du résultat.',
      ],
    },
    {
      h: 'Idées pour concours, tombolas et salle de classe',
      p: [
        'La plupart des usages reviennent à donner un numéro à chaque personne ou objet et à laisser le générateur choisir. Pour un concours sur Instagram, numérote les participations valides dans l’ordre d’arrivée, tire un nombre par lot sans doublons, puis publie le lien du résultat : tes abonnés verront le tirage exact avec son heure et ses réglages. Un nom comme Concours d’octobre voyage avec le lien.',
        'Les profs utilisent les nombres aléatoires pour rester justes et garder un peu de suspense. Quand chaque élève a un numéro, personne ne peut dire que c’est toujours le même qui est interrogé.',
      ],
      list: [
        'Tombola : cale la plage sur les numéros de billets vendus et tire un gagnant par lot.',
        'Concours en commentaires : numérote les participations valides, tire sans doublons et partage le lien.',
        'En classe : choisis qui répond, forme des binômes au hasard ou fixe l’ordre des exposés.',
        'Au bureau : l’ordre du Père Noël secret, la personne qui prend les notes ou un resto dans une liste numérotée.',
        'Jeux et révisions : des nombres pour le calcul mental, une page à lire ou un dé au nombre de faces voulu.',
      ],
    },
    {
      h: 'Ce que veut vraiment dire « au hasard »',
      p: [
        'Un tirage est aléatoire quand chaque résultat permis a la même chance et que personne ne peut prévoir le suivant, ni la personne qui appuie sur le bouton, ni celle qui a écrit le code. Aléatoire ne veut pas dire bien réparti sur quelques essais. Si tu tires plusieurs fois entre 1 et 10, les répétitions et les séries sont normales : sortir 7 deux fois de suite est exactement aussi probable que sortir 3 puis 8.',
        'Les humains sont réputés pour être très mauvais en hasard. Quand on demande un nombre entre 1 et 10, beaucoup choisissent 7 et peu choisissent 1 ou 10 ; quand on essaie d’écrire une suite au hasard, on évite les répétitions bien plus que le hasard ne le ferait. C’est pour ça qu’un générateur est utile même pour décider qui commence : il efface les habitudes cachées de nos choix.',
      ],
    },
    {
      h: 'Vrai hasard, pseudo-aléatoire et générateur cryptographique',
      p: [
        'Un ordinateur suit des instructions, il ne peut pas inventer du hasard à partir de rien. Un générateur pseudo-aléatoire part d’une valeur appelée graine et applique une formule pour produire une longue suite qui semble aléatoire. Les versions simples suffisent pour un jeu, mais elles peuvent être prévisibles et garder des motifs subtils. Les vrais nombres aléatoires viennent d’un bruit physique, comme le bruit thermique des composants ou les micro-variations de timing du matériel.',
        'Les navigateurs modernes proposent un générateur cryptographiquement sûr, crypto.getRandomValues, et c’est lui que cet outil utilise. Le système d’exploitation l’alimente avec du bruit matériel, et il est conçu pour que les sorties passées ne révèlent rien des suivantes, d’où son usage pour les clés de sécurité. En plus, l’outil évite une erreur classique, le biais du modulo : ramener une grande valeur aléatoire à une petite plage avec un simple reste donne à certains nombres une minuscule chance de plus. Le générateur rejette ces valeurs en trop et tire à nouveau, si bien que chaque nombre de ta plage a exactement la même probabilité. Pour les tirages sans doublons, il utilise un mélange qui fonctionne même sur une plage de deux milliards de nombres.',
      ],
    },
    {
      h: 'Conseils pour un tirage juste et transparent',
      p: [
        'Un outil équitable ne fait que la moitié du travail. L’autre moitié consiste à organiser le tirage pour que personne ne puisse douter du résultat ensuite.',
      ],
      list: [
        'Annonce les règles avant : la plage, la façon de numéroter et le nombre de gagnants.',
        'Fige la liste des participants avant le tirage et garde une trace de qui a quel numéro.',
        'Tire une fois et garde le résultat. Recommencer jusqu’à ce qu’il te plaise n’a aucun sens.',
        'Partage le lien du résultat : il contient les nombres, les réglages et l’heure, donc chacun voit le tirage d’origine et non un nouveau.',
        'Devant un public, tire sur un écran partagé ou en live pour que tout le monde voie les nombres s’arrêter.',
        'N’exclus que des numéros vraiment invalides, comme des billets invendus, et dis-le publiquement.',
      ],
    },
  ],
  cta: 'Tirer des nombres maintenant',
};
