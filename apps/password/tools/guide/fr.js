module.exports = {
  metaTitle: 'Générateur de mot de passe\u202f: guide, phrases de passe, entropie',
  description: 'Comment créer des mots de passe solides et des phrases de passe faciles à retenir, ce que signifient vraiment l’entropie et le temps de cassage, et pourquoi un gestionnaire et la double authentification comptent.',
  h1: 'Générateur de mot de passe : mots de passe solides, phrases de passe et entropie',
  updated: '2026-10-13',
  intro: 'La plupart des comptes piratés ne tombent pas sous les coups d’un génie de l’informatique. Tout commence par un mot de passe trop court, un mot de passe réutilisé après la fuite d’un autre site, ou un schéma prévisible comme un prénom suivi d’une année. Un générateur de mot de passe confie à la machine ce que les humains font le plus mal : choisir au hasard. Ce guide explique comment utiliser l’outil, ce qui rend vraiment un mot de passe solide, ce qu’est une phrase de passe, comment lire l’entropie et le temps de cassage, et termine par deux habitudes encore plus importantes que le mot de passe lui-même.',
  sections: [
    {
      h: 'Utiliser le générateur de mot de passe',
      p: [
        'Tout se passe sur un seul écran et sur ton propre appareil. Choisis d’abord Mot de passe ou Phrase de passe. Pour un mot de passe, règle la longueur entre 4 et 64 caractères avec le curseur, puis active les types de caractères voulus : majuscules, minuscules, chiffres et symboles. Chaque type activé apparaît au moins une fois, ce qui satisfait les sites qui imposent des règles de composition. Si tu dois un jour dicter le mot de passe ou le recopier depuis un écran, active Sans sosies pour écarter 0, O, 1, l et I.',
        'Pour une phrase de passe, choisis le nombre de mots (de 3 à 8), le séparateur, et décide s’il faut une majuscule à chaque mot et un chiffre en plus. Sélectionne Un seul ou Cinq d’un coup, puis appuie sur Générer. Chaque résultat a son bouton Copier, et la jauge en dessous affiche l’entropie en bits, un niveau de force et le temps estimé pour le casser.',
      ],
      list: [
        'Choisis Mot de passe ou Phrase de passe.',
        'Règle la longueur ou le nombre de mots.',
        'Choisis les types de caractères, ou le séparateur et les options.',
        'Appuie sur Générer et copie celui qui te plaît.',
        'Enregistre-le aussitôt dans ton gestionnaire de mots de passe.',
      ],
    },
    {
      h: 'Ce qui rend un mot de passe solide',
      p: [
        'La force dépend du nombre de possibilités qu’un attaquant doit tester, pas de l’air compliqué du mot de passe. P@ssw0rd! semble chaotique, mais les outils de cassage testent d’abord les mots courants avec les substitutions classiques : il tombe en quelques secondes. Une vraie suite aléatoire, c’est autre chose : chaque caractère est un tirage indépendant, et chaque caractère supplémentaire multiplie le nombre de possibilités. Voilà pourquoi la longueur bat l’astuce. Passer de 12 à 16 caractères aléatoires rend un mot de passe des dizaines de millions de fois plus difficile à deviner.',
        'L’autre moitié, c’est le hasard. Nous choisissons des dates d’anniversaire, des noms d’animaux, des suites de touches comme azerty, et le même schéma favori partout, et les attaquants connaissent toutes ces manies. Le générateur utilise la source aléatoire cryptographique du navigateur, crypto.getRandomValues, et une technique appelée échantillonnage par rejet pour que chaque caractère autorisé ait exactement la même probabilité. Aucun motif à apprendre, aucun biais à exploiter.',
        'Troisième ingrédient : l’unicité. Même un mot de passe parfait devient faible dès qu’il est réutilisé, car la fuite d’un site le livre à des attaquants qui l’essaient ensuite partout ailleurs. Un compte, un mot de passe.',
      ],
    },
    {
      h: 'Les phrases de passe : solides et plus faciles à retenir',
      p: [
        'Une phrase de passe, c’est une poignée de mots tirés au hasard et collés ensemble, comme une courte phrase absurde. L’astuce, c’est que les mots doivent être choisis par le hasard, pas par toi : un vers de chanson ou une citation célèbre n’a rien d’aléatoire. Ce générateur pioche chaque mot dans une liste intégrée de 2 048 mots anglais courts, donc chaque mot apporte exactement 11 bits d’entropie. Cinq mots donnent 55 bits, six en donnent 66, et un chiffre aléatoire ajoute encore quelques bits.',
        'Les phrases de passe sont idéales pour les rares secrets que tu dois vraiment taper ou retenir : le mot de passe principal de ton gestionnaire, la session de ton ordinateur ou la sauvegarde de ton téléphone. Elles sont longues, donc solides, et faites de vrais mots, donc bien plus faciles à taper sur un clavier de téléphone qu’un fouillis de symboles. Mettre une majuscule à chaque mot n’ajoute pas de force, car le schéma est prévisible, mais cela aide avec les sites qui exigent une majuscule.',
      ],
    },
    {
      h: 'L’entropie et le temps de cassage, expliqués',
      p: [
        'L’entropie, mesurée en bits, indique parmi combien de possibilités également probables un mot de passe a été tiré. Chaque bit double ce nombre : 60 bits représentent environ un milliard de milliards de possibilités, et 80 bits un million de fois plus. La jauge calcule cette valeur exactement à partir de tes réglages. Pour un mot de passe, elle compte toutes les chaînes de la longueur choisie qui contiennent au moins un caractère de chaque type sélectionné ; pour une phrase de passe, elle multiplie les choix de mots par la position et la valeur du chiffre ajouté.',
        'Le temps de cassage suppose une attaque hors ligne rapide à 10 milliards d’essais par seconde, un rythme à la portée d’une seule carte graphique récente face à une base de mots de passe volée et mal protégée. En moyenne, l’attaquant trouve après avoir testé la moitié des possibilités. L’estimation suppose aussi qu’il connaît exactement tes réglages, elle ne cherche donc jamais à te flatter. En gros : moins de 45 bits, c’est faible ; de 45 à 60, moyen ; de 60 à 80, fort ; 80 et plus, très fort.',
      ],
      list: [
        'Comptes jetables ou sans enjeu : 45 à 60 bits.',
        'Comptes du quotidien comme les achats et les réseaux sociaux : 60 à 80 bits.',
        'Messagerie, banque, travail et gestionnaire de mots de passe : 80 bits ou plus.',
      ],
    },
    {
      h: 'Gestionnaire de mots de passe et double authentification',
      p: [
        'Personne ne peut retenir des dizaines de mots de passe aléatoires différents, et personne ne devrait essayer. Un gestionnaire de mots de passe les garde dans un coffre chiffré, les remplit sur les bons sites et te prévient en cas de réutilisation ou de fuite. Génère ici un mot de passe solide, colle-le dans le gestionnaire quand tu crées ou modifies un compte, et tu n’auras plus jamais besoin de le voir. Protège le gestionnaire lui-même par une longue phrase de passe que tu retiens.',
        'La double authentification, ou 2FA, ajoute une seconde étape : un code d’application d’authentification, une clé d’accès ou une clé de sécurité physique. Même si un mot de passe fuit, l’attaquant ne peut pas se connecter. Active-la d’abord sur ta messagerie, car c’est par elle que se réinitialisent la plupart des autres comptes.',
      ],
      list: [
        'Utilise un mot de passe différent pour chaque compte.',
        'Range tes mots de passe dans un gestionnaire, pas dans des notes, des discussions ou des captures d’écran.',
        'Active la 2FA ou les clés d’accès partout où c’est possible, en commençant par ta messagerie.',
        'Change aussitôt un mot de passe si un service annonce une fuite.',
        'N’envoie jamais un mot de passe par message ou par e-mail, et méfie-toi des liens de connexion inattendus.',
      ],
    },
  ],
  cta: 'Générer un mot de passe solide',
};
