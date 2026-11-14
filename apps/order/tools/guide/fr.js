module.exports = {
  metaTitle: 'Tirer au sort l’ordre de passage : guide et conseils',
  description: 'Comment tirer au sort un ordre de passage pour des exposés, des tours de jeu ou des corvées, pourquoi le mélange est équitable et comment révéler l’ordre à un groupe.',
  h1: 'Tirage au sort de l’ordre de passage : un ordre équitable du premier au dernier',
  updated: '2026-11-15',
  intro: 'Décider qui passe en premier semble anodin, jusqu’au moment où toute une classe, une équipe ou une famille attend la réponse. Il y a toujours quelqu’un pour trouver l’ordre arrangé, ou pour remarquer que ce sont toujours les mêmes qui commencent. L’outil Ordre de passage règle la question en une seule étape : vous écrivez les noms, vous mélangez une fois, et l’ordre complet, du premier au dernier, est fixé sur-le-champ. Ce guide explique comment l’outil fonctionne, pourquoi le résultat est équitable, dans quelles situations il sert et comment révéler l’ordre pour que tout le monde l’accepte.',
  sections: [
    {
      h: 'Comment ça marche',
      p: [
        'Le premier écran contient toute la préparation. Choisissez d’abord à quoi sert l’ordre : exposés, tours de jeu ou corvées. Cette étiquette ne change que le titre du résultat, vous pouvez donc l’ignorer si vous voulez une simple liste. Écrivez ensuite les noms, un par ligne, ou collez-les. Une liste copiée depuis WhatsApp ou un tableur fonctionne, et les virgules séparent aussi les noms. Si vous préférez ne pas utiliser de noms, passez aux numéros et choisissez combien, de 2 à 40, pratique avec des numéros de place ou d’appel.',
        'Choisissez si l’ordre doit être révélé à partir du premier ou du dernier, puis lancez le tirage. Chaque place apparaît sous forme de carte numérotée : touchez la carte ou le bouton Suivant pour la suivante, activez la lecture automatique pour que les cartes défilent seules, ou appuyez sur Tout afficher pour voir directement la liste complète. Le dernier écran montre tout le monde dans l’ordre avec de grands numéros, ainsi que des boutons pour copier la liste en texte ou copier un lien.',
      ],
      list: [
        'Choisir une étiquette : ordre simple, exposés, tours de jeu ou corvées.',
        'Saisir de 2 à 40 noms, un par ligne, ou passer aux numéros 1 à N.',
        'Choisir de révéler à partir du premier ou du dernier.',
        'Lancer le tirage une seule fois : tout l’ordre est fixé à cet instant.',
        'Révéler carte par carte, en automatique ou tout d’un coup.',
      ],
    },
    {
      h: 'Pourquoi le mélange est équitable',
      p: [
        'Un ordre équitable exige que chaque arrangement possible ait la même probabilité, et que le résultat soit fixé avant que quiconque le voie. Quand vous lancez le tirage, l’application demande des valeurs au générateur aléatoire cryptographique de votre navigateur, le même type de source que pour créer des clés de sécurité. Elle utilise ensuite l’échantillonnage par rejet, qui écarte les rares valeurs qui favoriseraient légèrement certaines places, puis le mélange de Fisher–Yates, une méthode connue qui donne exactement la même chance à chaque ordre possible.',
        'L’ordre complet existe dès ce moment-là. Retourner les cartes une à une ne tire rien de nouveau : cela montre seulement un résultat déjà fixé. Rien n’est envoyé à un serveur, donc personne, nous compris, ne peut voir ni modifier la liste. Si quelqu’un doute, ouvrez le lien partagé sur un autre téléphone : le même ordre apparaît, car le lien contient l’ordre terminé et non un nouveau mélange.',
      ],
    },
    {
      h: 'Dans quelles situations l’utiliser',
      p: [
        'Dès qu’un groupe doit passer à tour de rôle, un ordre tiré au sort évite la discussion sur qui commence. Les enseignants s’en servent pour l’ordre de passage des exposés ou de la lecture à voix haute. Les équipes l’utilisent pour l’ordre de parole en réunion ou lors d’un atelier. Familles et colocataires l’emploient pour le planning des corvées, et les amis pour l’ordre des joueurs aux jeux de société, au karaoké ou à un tournoi de jeux vidéo.',
        'C’est différent de désigner un gagnant. Un tirage de gagnant s’arrête à un seul nom, et un outil de répartition forme des équipes. Ici, chacun reçoit une place du premier au dernier : c’est exactement ce qu’il faut quand tout le monde aura son tour et que seule la séquence reste à décider.',
      ],
      list: [
        'École : ordre de passage des exposés, lecture, binômes de TP.',
        'Travail : ordre de parole en réunion, démos, astreintes.',
        'Maison : qui fait la vaisselle quel jour, qui choisit le film.',
        'Jeux : ordre des joueurs, manches de quiz, karaoké.',
      ],
    },
    {
      h: 'Conseils pour le faire en groupe',
      p: [
        'Lancez le tirage là où tout le monde voit l’écran, ou partagez votre écran en visio. Quand on voit le bouton pressé une seule fois, on fait davantage confiance au résultat qu’à une liste qui arrive toute faite. S’il faut recommencer, par exemple à cause d’un nom mal écrit, dites-le avant de connaître l’ordre plutôt qu’après.',
        'Pour une longue liste, la lecture automatique garde un rythme régulier sans que personne n’ait à toucher l’écran, et Tout afficher est le plus rapide si seule la liste compte. Copier en texte colle une liste numérotée directement dans une discussion ou un document. Votre dernière liste est mémorisée sur l’appareil : un planning hebdomadaire se remélange en un geste la fois suivante.',
      ],
    },
    {
      h: 'Révéler du premier ou du dernier, et partager le résultat',
      p: [
        'Révéler à partir du premier est pratique : la personne qui commence le sait tout de suite et peut se préparer. Révéler à partir du dernier transforme l’ordre en petit compte à rebours, car la dernière carte dévoile qui passe en premier. Les classes et les soirées aiment ce suspense, les réunions préfèrent souvent la version rapide.',
        'Le bouton Copier le lien crée une adresse qui contient l’ordre terminé. Toute personne qui l’ouvre voit la même liste avec une mention indiquant qu’elle n’a pas été remélangée, et peut lancer son propre tirage avec les mêmes noms si elle veut un nouvel ordre. Le lien contient les noms saisis : ne l’envoyez qu’aux personnes concernées.',
      ],
    },
  ],
  cta: 'Tirer l’ordre au sort maintenant',
};
