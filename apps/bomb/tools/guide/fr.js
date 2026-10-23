module.exports = {
  metaTitle: 'Patate chaude : règles, variantes de soirée et mèche équitable',
  description: 'Comment jouer à la patate chaude avec un seul téléphone : choisir les joueurs et la mèche, variantes pour les soirées, pourquoi la mèche secrète est équitable et conseils pour jouer en sécurité.',
  h1: 'Patate chaude : le jeu de la bombe à passer sur téléphone',
  updated: '2026-10-24',
  intro: 'La patate chaude est l’un des jeux de groupe les plus simples : on se passe un objet en cercle, personne ne sait quand ça va s’arrêter, et celui qui le tient à ce moment-là a perdu. Ici, c’est ton téléphone qui devient la patate. Tu allumes une mèche, tu touches la bombe, tu passes le téléphone au suivant et le tic-tac accélère jusqu’à ce que, à un moment secret, tout explose. Ce guide explique comment jouer, propose des variantes, montre pourquoi le moment du boum est vraiment aléatoire et donne quelques conseils pour que tout le monde s’amuse.',
  sections: [
    {
      h: 'Comment jouer',
      p: [
        'Commence par choisir si tu veux saisir des prénoms. Avec Jouer direct, personne ne tape rien : on se passe le téléphone et celui qui l’a en main au boum a perdu. Avec prénoms, entre de 2 à 12 joueurs dans l’ordre où vous êtes assis. L’écran affiche alors qui a la bombe et, après chaque toucher, à qui la donner, puis le prénom du perdant apparaît à la fin.',
        'Choisis ensuite la longueur de la mèche. Une mèche courte brûle entre 10 et 25 secondes, une normale entre 20 et 45, une longue entre 40 et 80. Le vrai chiffre n’est jamais affiché. Appuie sur le bouton de départ, touche la grosse bombe, tends le téléphone et continue de le faire tourner. Une courte pause après chaque toucher empêche quelqu’un de faire tout le tour à lui seul.',
      ],
      list: [
        'Choisis Jouer direct ou saisis les joueurs dans l’ordre de passe.',
        'Choisis une mèche courte, normale ou longue.',
        'Active les indices ou les cartes gage si tu veux.',
        'Allume la mèche, touche la bombe et passe le téléphone.',
        'Au boum, celui qui tient le téléphone a perdu.',
      ],
    },
    {
      h: 'Variantes pour les soirées',
      p: [
        'Le jeu de base marche avec tous les groupes, mais quelques petites règles le renouvellent. Pour briser la glace, prends une mèche courte et demande à chacun de dire son prénom et son plat préféré avant de passer. Pour une longue soirée jeux, joue par élimination : celui qui se fait prendre sort, on modifie les prénoms et le dernier joueur restant gagne.',
        'Tu peux aussi rendre la passe plus difficile. Choisissez une catégorie, comme un animal, un pays ou un film, et il faut donner une réponse sans répétition avant de toucher la bombe. Hésite trop et elle risque d’exploser dans tes mains. Les cartes gage, facultatives, ajoutent un petit défi sympa pour le perdant.',
      ],
      list: [
        'Manche à thème : cite un mot de la catégorie avant de passer.',
        'Élimination : le joueur pris sort jusqu’à ce qu’il n’en reste qu’un.',
        'Par équipes : deux équipes jouent à tour de rôle, la moins prise gagne.',
        'En classe : celui qui est pris répond à la question suivante.',
        'En famille : le perdant choisit le prochain jeu ou débarrasse la table.',
      ],
    },
    {
      h: 'Pourquoi la mèche secrète est équitable',
      p: [
        'Dès que tu allumes la mèche, l’appli choisit l’heure du boum avec le générateur aléatoire cryptographique du navigateur, crypto.getRandomValues. Elle utilise un échantillonnage par rejet, qui écarte les quelques valeurs qui rendraient certains instants un peu plus probables : chaque milliseconde de la plage choisie a donc la même chance. Le moment est fixé avant la première passe et n’est jamais affiché, même pas à celui qui tient le téléphone.',
        'Le tic-tac, la vibration et l’indice des étincelles accélèrent bien vers la fin, car c’est ce qui rend la patate chaude excitante. Mais le moment où l’accélération commence, sa force, sa vitesse maximale et quelques fausses accélérations au milieu changent à chaque partie. Le rythme fait battre le cœur plus vite sans révéler le temps restant. Si le jeu passe en arrière-plan, la mèche se met en pause : personne ne perd à cause d’une notification.',
      ],
    },
    {
      h: 'Conseils pour jouer en sécurité',
      p: [
        'Comme le téléphone circule vite, un peu de prudence suffit. Passe-le de main en main au lieu de le lancer, jouez assis ou sans bouger, et éloignez les boissons du cercle. Décidez avant de commencer ce qui arrive au perdant, pour que le résultat soit accueilli avec un éclat de rire plutôt qu’un débat.',
      ],
      list: [
        'Tends le téléphone, ne le lance jamais.',
        'Tiens-le à deux mains, bien fermement.',
        'Coupe le son dans les endroits calmes, la vibration reste active.',
        'Garde des gages gentils et passe toute carte qui gêne quelqu’un.',
        'Avec de jeunes enfants, prends une mèche longue pour garder un rythme tranquille.',
      ],
    },
    {
      h: 'D’où vient la patate chaude',
      p: [
        'Se passer un objet pendant que le temps file est une vieille idée. Beaucoup de jeux d’enfants utilisent une musique qui s’arrête à un moment inconnu, et le nom de patate chaude vient de l’image d’un objet trop brûlant pour être gardé longtemps. On y joue depuis des générations aux anniversaires, dans les cours de récré et en colonie, avec un ballon, un sac de graines ou un paquet emballé.',
        'Plus tard, les fabricants de jouets ont ajouté des minuteurs électroniques et des bombes qui sonnent ou sautent après un délai aléatoire, plus besoin de quelqu’un pour couper la musique. Cette appli reprend la même idée avec un seul téléphone : un minuteur caché et équitable, une ambiance sonore tendue et un résultat immédiat, pour que tout le groupe joue sans qu’un arbitre doive rester sur la touche.',
      ],
    },
  ],
  cta: 'Jouer à la patate chaude',
};
