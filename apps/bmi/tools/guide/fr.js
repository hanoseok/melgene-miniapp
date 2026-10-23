module.exports = {
  metaTitle: 'Calcul IMC : formule, catégories et limites',
  description: 'Comment calculer l’IMC en kilos ou en livres, ce que veulent dire les seuils de l’OMS et les seuils asiatiques, pourquoi l’IMC se trompe chez les sportifs et comment le tour de taille complète le résultat.',
  h1: 'Calcul IMC : comprendre l’indice de masse corporelle',
  updated: '2026-10-24',
  intro: 'L’indice de masse corporelle, ou IMC, est le chiffre le plus utilisé par les médecins, les assureurs et les applis de sport pour classer les adultes en maigreur, poids normal, surpoids et obésité. Il suffit de la taille et du poids, ce qui le rend rapide, mais aussi assez grossier. Ce guide explique comment fonctionne le calcul IMC, la formule, le sens des catégories, les cas où l’IMC se trompe et les mesures simples qui donnent une image plus complète.',
  sections: [
    {
      h: 'Comment utiliser le calcul IMC',
      p: [
        'Choisissez les unités (centimètres et kilos, ou pieds, pouces et livres), puis entrez votre taille et votre poids. Dès que les deux cases sont remplies, votre IMC s’affiche avec une décimale, un repère sur une échelle de couleurs et le nom de la catégorie. En dessous apparaît la fourchette de poids santé pour votre taille et, si vous en sortez, l’écart approximatif en kilos.',
        'L’âge et le sexe sont facultatifs. Ils ne changent pas le chiffre ; ils ajoutent seulement une remarque utile, par exemple que le calcul est réservé aux adultes ou qu’après 65 ans un IMC un peu plus élevé est souvent acceptable. L’option « Seuils asiatiques » applique les seuils plus bas recommandés en Asie. Tout est calculé dans votre navigateur et rien n’est envoyé ni enregistré.',
      ],
      list: [
        'Les décimales marchent avec un point ou une virgule : 70,5 et 70.5 donnent la même chose.',
        'Si vous changez d’unités, les valeurs déjà saisies sont converties.',
        'Le résumé regroupe votre IMC, votre catégorie et votre poids santé.',
      ],
    },
    {
      h: 'La formule de l’IMC, pas à pas',
      p: [
        'L’IMC, c’est le poids en kilos divisé par la taille en mètres au carré. Pour 1,70 m et 65 kg : 1,7 × 1,7 = 2,89, puis 65 ÷ 2,89 ≈ 22,5. Comme la taille est élevée au carré, quelques centimètres comptent : avec les mêmes 65 kg, on obtient environ 23,9 à 1,65 m et 21,2 à 1,75 m.',
        'En unités américaines, la formule devient 703 × poids en livres ÷ taille en pouces au carré. Le nombre 703 sert simplement à convertir livres et pouces en kilos et en mètres. Le calcul utilise les conversions exactes : 2,54 cm par pouce et 0,45359237 kg par livre.',
      ],
      list: [
        'Système métrique : IMC = kg ÷ (m × m)',
        'Unités américaines : IMC = 703 × lb ÷ (po × po)',
        'Poids santé = de 18,5 × m² à 24,9 × m² (OMS)',
      ],
    },
    {
      h: 'Ce que veulent dire les catégories',
      p: [
        'L’OMS classe l’IMC adulte en maigreur (moins de 18,5), poids normal (18,5 à 24,9), surpoids (25 à 29,9) et obésité (30 et plus), elle-même divisée en obésité modérée (30 à 34,9), sévère (35 à 39,9) et massive (40 et plus). Les seuils sont les mêmes pour les femmes et les hommes. Ils ont été retenus parce que, sur de grandes populations, le risque de diabète de type 2, d’hypertension et de maladies cardiaques augmente quand l’IMC s’éloigne de la zone centrale.',
        'Des études menées en Asie ont montré que beaucoup de personnes d’origine asiatique rencontrent ces risques à un IMC plus bas, car elles ont souvent plus de graisse, notamment abdominale, à poids égal. C’est pourquoi l’OMS Asie-Pacifique fixe le surpoids dès 23 et l’obésité dès 25. Les pays précisent ensuite : le Japon parle d’obésité dès 25, la Chine fixe le surpoids à 24 et l’obésité à 28.',
      ],
      list: [
        'Moins de 18,5 : maigreur sur toutes les échelles',
        '18,5 à 24,9 : poids normal selon l’OMS',
        '23 à 24,9 : déjà surpoids sur l’échelle Asie-Pacifique',
      ],
    },
    {
      h: 'Ce que l’IMC ne dit pas',
      p: [
        'L’IMC ne regarde que le poids total : il ne distingue pas le muscle de la graisse et ne montre pas où celle-ci se trouve. Un rugbyman ou un adepte de musculation peut se retrouver en surpoids, voire en obésité, tout en étant sec, alors qu’une personne âgée qui a perdu du muscle peut avoir un IMC normal avec trop de masse grasse. Deux personnes au même IMC peuvent avoir une santé très différente.',
        'Il n’est pas non plus fait pour tout le monde. Les enfants et les ados sont suivis grâce aux courbes de corpulence du carnet de santé, et la prise de poids pendant la grossesse obéit à ses propres repères. Les adultes très grands ou très petits et les personnes qui retiennent l’eau peuvent aussi obtenir un résultat trompeur. Voyez l’IMC comme un premier repère, pas comme un verdict.',
      ],
    },
    {
      h: 'Tour de taille et rapport taille/hauteur',
      p: [
        'La graisse stockée autour du ventre est plus liée aux maladies cardiaques et métaboliques que celle située ailleurs, et l’IMC ne la voit pas. Un simple mètre ruban suffit. Mesurez à mi-chemin entre la dernière côte et le haut de la hanche, après une expiration normale. En France, on considère souvent qu’un tour de taille supérieur à 80 cm chez la femme et à 94 cm chez l’homme mérite attention.',
        'On utilise aussi le rapport tour de taille/taille : s’il reste sous 0,5, autrement dit si votre tour de taille fait moins de la moitié de votre taille, le risque est en général plus faible. Les balances à impédance et les examens d’imagerie estiment la masse grasse plus directement, même si les appareils grand public sont parfois imprécis. Si l’IMC et le tour de taille ne disent pas la même chose, parlez-en à votre médecin.',
      ],
      list: [
        'Tour de taille ÷ taille sous 0,5 : risque généralement plus bas',
        'Mesurez le matin, debout, après avoir expiré',
        'Gardez le même mètre ruban et le même repère à chaque fois',
      ],
    },
    {
      h: 'Conseils pour lire et suivre votre résultat',
      p: [
        'Pesez-vous à la même heure, idéalement le matin, car le poids peut varier d’un kilo ou plus entre le matin et le soir. Regardez la tendance sur plusieurs semaines plutôt qu’un chiffre isolé, et rappelez-vous que la fourchette santé couvre plusieurs kilos pour une bonne raison : il n’existe pas un poids parfait unique. Pour changer de poids, de petits changements réguliers de sommeil, d’activité et d’alimentation tiennent mieux qu’un régime strict.',
      ],
      list: [
        'Mesurez votre taille sans chaussures et pesez-vous en tenue légère.',
        'Vérifiez votre tour de taille en plus de l’IMC.',
        'Demandez l’avis d’un médecin avant de grands changements.',
      ],
    },
  ],
  cta: 'Calculer mon IMC maintenant',
};
