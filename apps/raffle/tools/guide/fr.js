module.exports = {
  metaTitle: 'Tirage au sort en ligne : réussir le tirage des lots',
  description: 'Comment organiser un tirage au sort en ligne équitable : coller les noms ou utiliser des tickets numérotés, régler les lots et l’ordre, révéler les gagnants un par un sur grand écran.',
  h1: 'Organiser un tirage au sort équitable en soirée ou en ligne',
  updated: '2026-11-09',
  intro: 'Le tirage des lots est souvent le moment dont tout le monde se souvient après une soirée de fin d’année. Les téléphones se baissent, la salle se tait et le premier nom déclenche les applaudissements. Le plus délicat, c’est l’organisation : les petits papiers se perdent, on tire deux fois le même nom et personne n’est sûr que le chapeau a bien été mélangé. Cette appli de tirage au sort remplace le chapeau par un seul écran. Vous collez la liste des participants ou choisissez des tickets numérotés, notez les lots, puis révélez les gagnants un par un après un court défilement des noms. Ce guide explique la mise en place, les options, l’animation et ce qui rend le résultat équitable.',
  sections: [
    {
      h: 'Comment faire un tirage avec cette appli',
      p: [
        'Choisissez d’abord qui participe. Prenez Noms si vous avez une liste d’invités, une liste de classe ou les pseudos d’un chat en direct, et collez-les un par ligne. Prenez Tickets si les participants ont des tickets numérotés, puis saisissez le plus grand numéro. Indiquez ensuite les lots du plus gros au plus petit, avec le nombre de gagnants pour chacun. Par défaut il y a un gros lot, deux deuxièmes prix et cinq troisièmes prix, mais vous pouvez les renommer, changer les quantités ou aller jusqu’à douze lots.',
        'Appuyez sur Lancer le tirage pour ouvrir l’écran de tirage. À chaque pression sur Tirer, les noms défilent un instant puis s’arrêtent sur un gagnant. Le lot et le nom s’affichent en grand, et une liste sous la scène rassemble tous les gagnants. Si un lot a plusieurs gagnants et que le temps presse, Tirer les restants les désigne d’un coup. Quand tout est tiré, les résultats montrent les gagnants regroupés par lot.',
      ],
      list: [
        'Choisissez Noms ou Tickets.',
        'Listez les lots du plus gros au plus petit, avec le nombre de gagnants.',
        'Réglez l’ordre du tirage et la règle d’une seule victoire.',
        'Tirez un gagnant à la fois, ou tous les restants d’un lot.',
        'Copiez les résultats en texte ou partagez le lien.',
      ],
    },
    {
      h: 'Noms, tickets numérotés et chances supplémentaires',
      p: [
        'La liste fonctionne au mieux quand chaque personne n’y figure qu’une fois. Si un nom apparaît deux fois, l’appli vous prévient, car la liste a souvent été copiée deux fois ou deux personnes ont le même prénom. Chaque ligne compte comme une participation : ajoutez un nom de famille ou une initiale pour les distinguer. Pour donner plus de chances à quelqu’un, par exemple parce qu’il a acheté trois tickets, écrivez *3 après son nom. Il a alors trois fois plus de chances, mais ne gagne qu’une fois si la règle d’une seule victoire est active.',
        'Les tickets numérotés conviennent aux tombolas caritatives, kermesses et soirées où l’on vend des tickets à l’entrée. Saisissez le dernier numéro vendu : l’appli tire entre 1 et ce numéro, et le numéro gagnant s’affiche en grand pour que son détenteur vienne avec son talon.',
      ],
    },
    {
      h: 'Ordre des lots et une seule victoire par personne',
      p: [
        'La plupart des soirées gardent le meilleur pour la fin. L’ordre par défaut tire donc les petits lots d’abord et le gros lot en dernier, ce qui retient tout le monde jusqu’au bout. Pour un direct court où le public risque de partir tôt, vous pouvez commencer par le gros lot.',
        'La règle d’une seule victoire par personne est activée par défaut : un gagnant quitte le tirage des lots suivants, ce qui répartit les cadeaux sur plus de monde. Désactivez-la si chaque lot doit rester ouvert à tous, par exemple pour plusieurs tirages au fil d’une longue soirée. Même alors, personne ne gagne deux fois le même lot.',
      ],
    },
    {
      h: 'Conseils pour la soirée d’entreprise et les concours en direct',
      p: [
        'Branchez un ordinateur sur la télé ou le vidéoprojecteur et activez le mode présentation. La barre de titre et les boutons secondaires disparaissent, le lot et le nom grossissent et se lisent du fond de la salle. Une télécommande de présentation ou la barre d’espace tire le gagnant suivant, ce qui permet à l’animateur de rester face au public. Annoncez le lot avant chaque tirage pour faire monter le suspense, et utilisez Révéler si la soirée prend du retard.',
        'Pour un concours en ligne, rassemblez d’abord les participations au même endroit, par exemple les commentaires d’une publication, puis collez les pseudos dans la liste. Partagez votre écran pendant le tirage pour que tout le monde le voie. Ensuite, copiez les résultats dans le chat ou envoyez le lien, qui ne contient que les lots et les gagnants. En cas d’erreur, Annuler le dernier efface le tirage, mais prévenez le public avant de recommencer.',
      ],
    },
    {
      h: 'Pourquoi le tirage est équitable',
      p: [
        'L’équité est la raison d’être d’un tirage au sort, alors l’appli ne prend aucun raccourci. La liste n’est pas mélangée à l’avance : chaque gagnant est choisi au moment où vous appuyez sur Tirer, avec le générateur aléatoire cryptographique du navigateur, le même type d’aléa que pour les clés de sécurité. Chaque ticket restant a exactement la même chance, et l’échantillonnage par rejet supprime le petit biais des méthodes simples. Les noms qui défilent ne sont qu’une animation affichée après le choix.',
        'Votre liste ne quitte jamais l’appareil. Les noms, les lots et un tirage en cours restent dans le navigateur, même après un rechargement, et rien n’est envoyé à un serveur. À la fin, appuyez sur Nouveau tirage pour effacer les gagnants, ou gardez la liste pour l’an prochain.',
      ],
    },
  ],
  cta: 'Lancer un tirage au sort',
};
